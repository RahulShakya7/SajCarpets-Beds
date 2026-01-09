from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from api.models.product import Product
from api.models.order import Order
from api.models.category import Category
from api.models.content import ContactMessage

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users_count = User.objects.count()
        products_count = Product.objects.count()
        orders_count = Order.objects.count()
        messages_count = ContactMessage.objects.count()
        categories_count = Category.objects.count()

        data = {
            "users": users_count,
            "products": products_count,
            "orders": orders_count,
            "messages": messages_count,
            "categories": categories_count
        }
        return Response(data)
