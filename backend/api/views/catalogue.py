from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from api.models.catalogue import CatalogueItem
from api.serializers.catalogue import CatalogueItemSerializer

class CatalogueItemViewSet(viewsets.ModelViewSet):
    queryset = CatalogueItem.objects.all()
    serializer_class = CatalogueItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
