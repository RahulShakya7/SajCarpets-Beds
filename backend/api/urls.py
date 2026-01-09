from rest_framework.routers import DefaultRouter
from django.urls import path, include
from api.views.category import CategoryPublicViewSet, CategoryAdminViewSet
from api.views.product import ProductViewSet, ProductOperation
from api.views.order import OrderViewSet
from api.views.customer import UserViewSet, CustomerViewSet
from api.views.register import RegisterView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

from rest_framework_simplejwt.views import TokenRefreshView
from .views.content_views import (
    BlogViewSet, TeamMemberViewSet, TestimonialViewSet,
    AdvertisementViewSet, InfoPageViewSet, ContactMessageViewSet
)
from .views.dashboard import DashboardStatsView
from .views.cms import HeroSlideViewSet, CompanyInfoViewSet, AboutFeatureViewSet
from .views.auth_views import ChangePasswordView


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products') # Read Only
router.register(r'productscrud', ProductOperation, basename='productscrud') # Full CRUD
router.register(r'categories', CategoryPublicViewSet, basename='categories')
router.register(r'categoriescrud', CategoryAdminViewSet, basename='categoriescrud')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'customers', CustomerViewSet, basename='customers')
router.register(r'users', UserViewSet, basename='users')
router.register(r'blogs', BlogViewSet, basename='blog')
router.register(r'team', TeamMemberViewSet, basename='team')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'ads', AdvertisementViewSet, basename='advertisement')
router.register(r'info', InfoPageViewSet, basename='infopage')
router.register(r'contact_messages', ContactMessageViewSet, basename='contact_message')
router.register(r'hero', HeroSlideViewSet, basename='hero')
router.register(r'company_info', CompanyInfoViewSet, basename='company_info')
router.register(r'about_features', AboutFeatureViewSet, basename='about_features')

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
urlpatterns += router.urls