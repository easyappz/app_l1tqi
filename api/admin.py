from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Category, Listing, ListingImage


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Enhanced admin interface for User model.
    """
    list_display = [
        "username",
        "email",
        "phone",
        "is_staff",
        "is_blocked",
        "listings_count",
        "date_joined"
    ]
    list_filter = [
        "is_staff",
        "is_blocked",
        "is_superuser",
        "is_active",
        "date_joined"
    ]
    search_fields = ["username", "email", "phone", "first_name", "last_name"]
    readonly_fields = ["date_joined", "last_login", "listings_count"]
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional Info", {
            "fields": ("phone", "profile_photo", "is_blocked")
        }),
        ("Statistics", {
            "fields": ("listings_count",),
            "classes": ("collapse",)
        }),
    )
    
    actions = ["block_users", "unblock_users"]
    
    def listings_count(self, obj):
        """Display count of user's listings."""
        count = obj.listings.count()
        return format_html(
            '<span style="color: {}">{}</span>',
            "green" if count > 0 else "gray",
            count
        )
    listings_count.short_description = "Listings"
    
    def block_users(self, request, queryset):
        """Action to block selected users."""
        updated = queryset.exclude(is_staff=True).update(is_blocked=True)
        self.message_user(
            request,
            f"{updated} user(s) were successfully blocked."
        )
    block_users.short_description = "Block selected users"
    
    def unblock_users(self, request, queryset):
        """Action to unblock selected users."""
        updated = queryset.update(is_blocked=False)
        self.message_user(
            request,
            f"{updated} user(s) were successfully unblocked."
        )
    unblock_users.short_description = "Unblock selected users"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Enhanced admin interface for Category model.
    """
    list_display = ["name", "slug", "listings_count", "created_at"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ["created_at", "listings_count"]
    
    def listings_count(self, obj):
        """Display count of listings in category."""
        count = obj.listings.count()
        return format_html(
            '<span style="color: {}">{}</span>',
            "green" if count > 0 else "gray",
            count
        )
    listings_count.short_description = "Listings"


class ListingImageInline(admin.TabularInline):
    """
    Inline admin for listing images.
    """
    model = ListingImage
    extra = 1
    max_num = 5
    fields = ["image", "order", "image_preview"]
    readonly_fields = ["image_preview"]
    
    def image_preview(self, obj):
        """Display image preview."""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px;" />',
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Preview"


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    """
    Enhanced admin interface for Listing model.
    """
    list_display = [
        "title",
        "author",
        "category",
        "price",
        "status",
        "is_moderated",
        "images_count",
        "created_at"
    ]
    list_filter = [
        "status",
        "is_moderated",
        "category",
        "created_at",
        "updated_at"
    ]
    search_fields = [
        "title",
        "description",
        "author__username",
        "author__email",
        "phone"
    ]
    readonly_fields = ["created_at", "updated_at", "images_count"]
    inlines = [ListingImageInline]
    list_per_page = 25
    date_hierarchy = "created_at"
    
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
        ("Statistics", {
            "fields": ("images_count",),
            "classes": ("collapse",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )
    
    actions = ["approve_listings", "reject_listings", "activate_listings", "deactivate_listings"]
    
    def images_count(self, obj):
        """Display count of listing images."""
        count = obj.images.count()
        return format_html(
            '<span style="color: {}">{}</span>',
            "green" if count > 0 else "red",
            count
        )
    images_count.short_description = "Images"
    
    def approve_listings(self, request, queryset):
        """Action to approve selected listings."""
        updated = queryset.update(is_moderated=True, status="active")
        self.message_user(
            request,
            f"{updated} listing(s) were successfully approved."
        )
    approve_listings.short_description = "Approve selected listings"
    
    def reject_listings(self, request, queryset):
        """Action to reject selected listings."""
        updated = queryset.update(is_moderated=False, status="inactive")
        self.message_user(
            request,
            f"{updated} listing(s) were successfully rejected."
        )
    reject_listings.short_description = "Reject selected listings"
    
    def activate_listings(self, request, queryset):
        """Action to activate selected listings."""
        updated = queryset.update(status="active")
        self.message_user(
            request,
            f"{updated} listing(s) were successfully activated."
        )
    activate_listings.short_description = "Activate selected listings"
    
    def deactivate_listings(self, request, queryset):
        """Action to deactivate selected listings."""
        updated = queryset.update(status="inactive")
        self.message_user(
            request,
            f"{updated} listing(s) were successfully deactivated."
        )
    deactivate_listings.short_description = "Deactivate selected listings"


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    """
    Enhanced admin interface for ListingImage model.
    """
    list_display = ["listing", "order", "image_preview", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["listing__title"]
    readonly_fields = ["image_preview", "created_at"]
    list_per_page = 50
    
    def image_preview(self, obj):
        """Display image preview."""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 150px; max-height: 150px;" />',
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Preview"
