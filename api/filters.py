from django_filters import rest_framework as filters
from .models import Listing


class ListingFilter(filters.FilterSet):
    """
    Filter class for Listing model.
    """
    category = filters.NumberFilter(field_name="category__id")
    price_min = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = filters.NumberFilter(field_name="price", lookup_expr="lte")
    
    class Meta:
        model = Listing
        fields = ["category", "price_min", "price_max", "status"]
