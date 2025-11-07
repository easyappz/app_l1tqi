from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Listing, ListingImage


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "phone", "is_staff", "is_blocked", "date_joined"]
    list_filter = ["is_staff", "is_blocked", "is_superuser", "is_active"]
    search_fields = ["username", "email", "phone"]
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("phone", "profile_photo", "is_blocked")}),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1
    max_num = 5


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "category", "price", "status", "is_moderated", "created_at"]
    list_filter = ["status", "is_moderated", "category", "created_at"]
    search_fields = ["title", "description", "author__username"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ListingImageInline]
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("title", "description", "price", "category")
        }),
        ("Author Information", {
            "fields": ("author", "phone")
        }),
        ("Status", {
            "fields": ("status", "is_moderated")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ["listing", "order", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["listing__title"]
