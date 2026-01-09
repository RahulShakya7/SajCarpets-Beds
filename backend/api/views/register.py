from rest_framework import generics, permissions
from django.contrib.auth.models import User
from api.serializers.customer import UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
