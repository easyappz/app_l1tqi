from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Category, Listing, ListingImage


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "password", "password_confirm", "profile_photo"]
    
    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile.
    """
    active_listings_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "profile_photo", "active_listings_count", "is_staff", "is_blocked"]
        read_only_fields = ["id", "is_staff", "is_blocked"]
    
    def get_active_listings_count(self, obj):
        return obj.listings.filter(status="active").count()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    """
    class Meta:
        model = User
        fields = ["username", "email", "phone", "profile_photo"]


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for categories.
    """
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "created_at"]
        read_only_fields = ["id", "slug", "created_at"]


class ListingImageSerializer(serializers.ModelSerializer):
    """
    Serializer for listing images.
    """
    class Meta:
        model = ListingImage
        fields = ["id", "image", "order", "created_at"]
        read_only_fields = ["id", "created_at"]


class ListingListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing list view.
    """
    author_username = serializers.CharField(source="author.username", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    first_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Listing
        fields = [
            "id", "title", "description", "price", "author", "author_username",
            "category", "category_name", "status", "created_at", "first_image"
        ]
        read_only_fields = ["id", "author", "created_at"]
    
    def get_first_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None


class ListingDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for listing detail view.
    """
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Listing
        fields = [
            "id", "title", "description", "price", "author", "category",
            "phone", "status", "is_moderated", "created_at", "updated_at", "images"
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at", "is_moderated"]


class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating listings.
    """
    images_data = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        max_length=5
    )
    
    class Meta:
        model = Listing
        fields = ["id", "title", "description", "price", "category", "phone", "status", "images_data"]
        read_only_fields = ["id"]
    
    def validate_images_data(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("Maximum 5 images allowed per listing.")
        return value
    
    def create(self, validated_data):
        images_data = validated_data.pop("images_data", [])
        listing = Listing.objects.create(**validated_data)
        
        for index, image in enumerate(images_data):
            ListingImage.objects.create(listing=listing, image=image, order=index)
        
        return listing
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop("images_data", None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if images_data is not None:
            instance.images.all().delete()
            for index, image in enumerate(images_data):
                ListingImage.objects.create(listing=instance, image=image, order=index)
        
        return instance


class AdminStatsSerializer(serializers.Serializer):
    """
    Serializer for admin statistics.
    """
    total_users = serializers.IntegerField()
    total_listings = serializers.IntegerField()
    active_listings = serializers.IntegerField()
    inactive_listings = serializers.IntegerField()
    user_activity = serializers.DictField()


class ListingModerateSerializer(serializers.Serializer):
    """
    Serializer for moderating listings.
    """
    action = serializers.ChoiceField(choices=["approve", "reject"])
    
    def validate(self, attrs):
        return attrs


class UserBlockSerializer(serializers.Serializer):
    """
    Serializer for blocking/unblocking users.
    """
    is_blocked = serializers.BooleanField()
