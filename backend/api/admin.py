from django.contrib import admin
from api.models.category import Category
from api.models.product import Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ('name', 'category', 'price', 'stock', 'is_active')
    search_fields = ('name', 'description')
    list_filter = ('category', 'is_active')

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)