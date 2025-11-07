from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import User, Category, Listing, ListingImage
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileUpdateSerializer,
    CategorySerializer,
    ListingListSerializer,
    ListingDetailSerializer,
    ListingCreateUpdateSerializer,
    AdminStatsSerializer,
    ListingModerateSerializer,
    UserBlockSerializer,
)
from .permissions import IsOwnerOrAdmin, IsAdminUser
from .filters import ListingFilter


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        request=UserRegistrationSerializer,
        responses={201: UserSerializer}
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    User login endpoint.
    """
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "username": {"type": "string"},
                    "password": {"type": "string"}
                }
            }
        },
        responses={200: UserSerializer}
    )
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response(
                {"error": "Please provide both username and password"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if user.is_blocked:
            return Response(
                {"error": "User is blocked"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update current user profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == "PUT" or self.request.method == "PATCH":
            return UserProfileUpdateSerializer
        return UserSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List all categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing listings.
    """
    queryset = Listing.objects.filter(status="active", is_moderated=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = ListingFilter
    ordering_fields = ["created_at", "price"]
    search_fields = ["title", "description"]
    
    def get_serializer_class(self):
        if self.action == "list":
            return ListingListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return ListingCreateUpdateSerializer
        return ListingDetailSerializer
    
    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsOwnerOrAdmin()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(name="q", description="Search query", required=False, type=str),
        ]
    )
    @action(detail=False, methods=["get"])
    def search(self, request):
        query = request.query_params.get("q", "")
        if query:
            listings = self.queryset.filter(
                Q(title__icontains=query) | Q(description__icontains=query)
            )
        else:
            listings = self.queryset
        
        page = self.paginate_queryset(listings)
        if page is not None:
            serializer = ListingListSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)
        
        serializer = ListingListSerializer(listings, many=True, context={"request": request})
        return Response(serializer.data)


class AdminStatsView(APIView):
    """
    Admin statistics endpoint.
    """
    permission_classes = [IsAdminUser]
    
    @extend_schema(responses={200: AdminStatsSerializer})
    def get(self, request):
        total_users = User.objects.count()
        total_listings = Listing.objects.count()
        active_listings = Listing.objects.filter(status="active").count()
        inactive_listings = Listing.objects.filter(status="inactive").count()
        
        user_activity = User.objects.annotate(
            listings_count=Count("listings")
        ).filter(listings_count__gt=0).values("username", "listings_count")[:10]
        
        stats = {
            "total_users": total_users,
            "total_listings": total_listings,
            "active_listings": active_listings,
            "inactive_listings": inactive_listings,
            "user_activity": list(user_activity),
        }
        
        serializer = AdminStatsSerializer(stats)
        return Response(serializer.data)


class AdminListingViewSet(viewsets.ModelViewSet):
    """
    Admin viewset for managing all listings.
    """
    queryset = Listing.objects.all()
    serializer_class = ListingDetailSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ListingFilter
    ordering_fields = ["created_at", "price", "status"]
    
    @extend_schema(request=ListingModerateSerializer)
    @action(detail=True, methods=["put"])
    def moderate(self, request, pk=None):
        listing = self.get_object()
        serializer = ListingModerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action = serializer.validated_data["action"]
        
        if action == "approve":
            listing.is_moderated = True
            listing.status = "active"
        else:
            listing.is_moderated = False
            listing.status = "inactive"
        
        listing.save()
        
        return Response(
            ListingDetailSerializer(listing).data,
            status=status.HTTP_200_OK
        )


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin viewset for managing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    @extend_schema(request=UserBlockSerializer)
    @action(detail=True, methods=["put"])
    def block(self, request, pk=None):
        user = self.get_object()
        serializer = UserBlockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user.is_blocked = serializer.validated_data["is_blocked"]
        user.save()
        
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_200_OK
        )
