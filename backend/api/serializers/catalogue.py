from rest_framework import serializers
from api.models.catalogue import CatalogueItem

class CatalogueItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogueItem
        fields = ['id', 'title', 'description', 'image', 'category', 'order', 'created_at']
