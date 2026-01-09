from rest_framework import viewsets
from ..models import Blog, TeamMember, Testimonial, Advertisement, InfoPage, ContactMessage
from ..serializers.content_serializer import (
    BlogSerializer, TeamMemberSerializer, TestimonialSerializer, 
    AdvertisementSerializer, InfoPageSerializer, ContactMessageSerializer
)
from rest_framework.permissions import AllowAny, IsAdminUser

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-date')
    serializer_class = BlogSerializer
    permission_classes = [AllowAny] # Allow read for all, write restriction handled if needed or globally

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [AllowAny]

class InfoPageViewSet(viewsets.ModelViewSet):
    queryset = InfoPage.objects.all()
    serializer_class = InfoPageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]
