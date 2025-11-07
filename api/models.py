from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.utils.text import slugify


class User(AbstractUser):
    """
    Custom user model with additional fields for classifieds board.
    """
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_photo = models.ImageField(upload_to="profile_photos/", blank=True, null=True)
    is_blocked = models.BooleanField(default=False)
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_groups',
        related_query_name='custom_user',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_permissions',
        related_query_name='custom_user',
    )
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=["username"]),
            models.Index(fields=["email"]),
            models.Index(fields=["is_blocked"]),
        ]
    
    def __str__(self):
        return self.username


class Category(models.Model):
    """
    Category model for classifying listings.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["name"]),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Listing(models.Model):
    """
    Listing model for user advertisements.
    """
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="listings"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="listings"
    )
    phone = models.CharField(max_length=20)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="active"
    )
    is_moderated = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Listing"
        verbose_name_plural = "Listings"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["price"]),
            models.Index(fields=["-created_at"]),
            models.Index(fields=["author"]),
            models.Index(fields=["status", "is_moderated"]),
        ]
    
    def __str__(self):
        return self.title


class ListingImage(models.Model):
    """
    Image model for listing photos (max 5 per listing).
    """
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to="listing_images/")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Listing Image"
        verbose_name_plural = "Listing Images"
        ordering = ["order", "created_at"]
        indexes = [
            models.Index(fields=["listing", "order"]),
        ]
    
    def __str__(self):
        return f"Image for {self.listing.title} (order: {self.order})"