from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta
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
from .permissions import IsOwnerOrAdmin, IsAdminUser, IsNotBlocked
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
                },
                "required": ["username", "password"]
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
        if self.request.method in ["PUT", "PATCH"]:
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
    queryset = Listing.objects.select_related(
        "author", "category"
    ).prefetch_related("images").filter(
        status="active",
        is_moderated=True
    )
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsNotBlocked]
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
            return [permissions.IsAuthenticated(), IsNotBlocked(), IsOwnerOrAdmin()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        if self.request.user.is_blocked:
            raise permissions.PermissionDenied(
                "Blocked users cannot create listings."
            )
        serializer.save(author=self.request.user, is_moderated=True)
    
    def perform_update(self, serializer):
        if self.request.user.is_blocked and not self.request.user.is_staff:
            raise permissions.PermissionDenied(
                "Blocked users cannot edit listings."
            )
        serializer.save()
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="q",
                description="Search query",
                required=False,
                type=str
            ),
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
            serializer = ListingListSerializer(
                page,
                many=True,
                context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        
        serializer = ListingListSerializer(
            listings,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)
    
    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated]
    )
    def my_listings(self, request):
        """
        Get listings created by current user.
        """
        listings = Listing.objects.select_related(
            "author", "category"
        ).prefetch_related("images").filter(
            author=request.user
        ).order_by("-created_at")
        
        page = self.paginate_queryset(listings)
        if page is not None:
            serializer = ListingListSerializer(
                page,
                many=True,
                context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        
        serializer = ListingListSerializer(
            listings,
            many=True,
            context={"request": request}
        )
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
        
        # Listings created in last 7 days
        seven_days_ago = timezone.now() - timedelta(days=7)
        listings_last_7_days = Listing.objects.filter(
            created_at__gte=seven_days_ago
        ).count()
        
        # Active users (users with at least one listing)
        active_users = User.objects.annotate(
            listings_count=Count("listings")
        ).filter(listings_count__gt=0).count()
        
        # Top users by listing count
        user_activity = User.objects.annotate(
            listings_count=Count("listings")
        ).filter(listings_count__gt=0).values(
            "id", "username", "listings_count"
        ).order_by("-listings_count")[:10]
        
        stats = {
            "total_users": total_users,
            "total_listings": total_listings,
            "active_listings": active_listings,
            "inactive_listings": inactive_listings,
            "listings_last_7_days": listings_last_7_days,
            "active_users": active_users,
            "user_activity": list(user_activity),
        }
        
        serializer = AdminStatsSerializer(stats)
        return Response(serializer.data)


class AdminListingViewSet(viewsets.ModelViewSet):
    """
    Admin viewset for managing all listings.
    """
    queryset = Listing.objects.select_related(
        "author", "category"
    ).prefetch_related("images").all()
    serializer_class = ListingDetailSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = ListingFilter
    ordering_fields = ["created_at", "price", "status"]
    search_fields = ["title", "description", "author__username"]
    
    @extend_schema(request=ListingModerateSerializer)
    @action(detail=True, methods=["post"])
    def moderate(self, request, pk=None):
        """
        Moderate listing: approve, reject, or delete.
        """
        listing = self.get_object()
        serializer = ListingModerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action_type = serializer.validated_data["action"]
        
        if action_type == "approve":
            listing.is_moderated = True
            listing.status = "active"
            listing.save()
            return Response(
                ListingDetailSerializer(listing).data,
                status=status.HTTP_200_OK
            )
        elif action_type == "reject":
            listing.is_moderated = False
            listing.status = "inactive"
            listing.save()
            return Response(
                ListingDetailSerializer(listing).data,
                status=status.HTTP_200_OK
            )
        elif action_type == "delete":
            listing.delete()
            return Response(
                {"message": "Listing deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        
        return Response(
            {"error": "Invalid action"},
            status=status.HTTP_400_BAD_REQUEST
        )


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin viewset for managing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["username", "email", "phone"]
    ordering_fields = ["date_joined", "username"]
    
    @extend_schema(request=UserBlockSerializer)
    @action(detail=True, methods=["post"])
    def block(self, request, pk=None):
        """
        Block or unblock a user.
        """
        user = self.get_object()
        
        if user.is_staff:
            return Response(
                {"error": "Cannot block admin users"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = UserBlockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user.is_blocked = serializer.validated_data["is_blocked"]
        user.save()
        
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_200_OK
        )
