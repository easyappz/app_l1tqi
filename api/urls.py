from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    CategoryViewSet,
    ListingViewSet,
    AdminStatsView,
    AdminListingViewSet,
    AdminUserViewSet,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"listings", ListingViewSet, basename="listing")
router.register(r"admin/listings", AdminListingViewSet, basename="admin-listing")
router.register(r"admin/users", AdminUserViewSet, basename="admin-user")

urlpatterns = [
    # Authentication
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/profile/", ProfileView.as_view(), name="profile"),
    
    # Admin
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    
    # Router URLs
    path("", include(router.urls)),
]
