from rest_framework import viewsets, permissions
from api.models.cms import HeroSlide, CompanyInfo, AboutFeature
from api.serializers.cms import HeroSlideSerializer, CompanyInfoSerializer, AboutFeatureSerializer

class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = HeroSlide.objects.filter(is_active=True).order_by('order')
    serializer_class = HeroSlideSerializer
    
    def get_queryset(self):
        # Admins see all, others see active
        if self.request.user.is_staff:
             return HeroSlide.objects.all().order_by('order')
        return HeroSlide.objects.filter(is_active=True).order_by('order')

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class CompanyInfoViewSet(viewsets.ModelViewSet):
    queryset = CompanyInfo.objects.all()
    serializer_class = CompanyInfoSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class AboutFeatureViewSet(viewsets.ModelViewSet):
    queryset = AboutFeature.objects.all()
    serializer_class = AboutFeatureSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
