import os
import django
from django.utils.text import slugify
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sajcarpet.settings')
django.setup()

from api.models import Category, Product
from api.models import Blog, TeamMember, Testimonial, Advertisement, InfoPage
from django.contrib.auth import get_user_model

User = get_user_model()

def seed():
    print("Seeding database...")
    
    # Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created superuser: admin / admin123")
    else:
        print("Superuser admin already exists")

    # Categories
    categories = [
        "Beds", "Carpets", "Rugs", "Artificial Grass", "Vinyl", "Laminate", "Wood"
    ]
    
    cat_objs = {}
    for cat_name in categories:
        slug = slugify(cat_name)
        cat, created = Category.objects.get_or_create(
            slug=slug,
            defaults={'name': cat_name}
        )
        cat_objs[cat_name] = cat
        if created:
             print(f"Created category: {cat_name}")

    # Products
    products_data = [
        {
            'name': 'The Emerald Grass',
            'description': 'Low-maintenance, year-round green space with a lush natural look. Durable & weather-resistant.',
            'price': 150.00,
            'stock': 100,
            'category': 'Artificial Grass',
        },
        {
            'name': 'The Kensington Loop',
            'description': 'Durable and elegant. Tightly woven loop pile resists wear—great for hallways and living rooms.',
            'price': 25.00,
            'stock': 500,
            'category': 'Carpets',
        },
        {
            'name': 'The Mayfair Saxony',
            'description': 'Deep, plush Saxony comfort—perfect for bedrooms. Rich, luxurious colors.',
            'price': 35.00,
            'stock': 300,
            'category': 'Carpets',
        },
         {
            'name': 'Luxury King Bed',
            'description': 'A premium king size bed with orthopedic mattress included.',
            'price': 899.00,
            'discount_price': 799.00,
            'stock': 10,
            'category': 'Beds',
        },
         {
            'name': 'Persian Style Rug',
            'description': 'Traditional pattern rug, perfect for living rooms.',
            'price': 120.00,
            'stock': 25,
            'category': 'Rugs',
        }
    ]

    for p_data in products_data:
        cat_name = p_data.pop('category')
        cat = cat_objs.get(cat_name)
        if not cat: continue
            
        slug = slugify(p_data['name'])
        if not Product.objects.filter(slug=slug).exists():
            Product.objects.create(slug=slug, category=cat, **p_data)
            print(f"Created product: {p_data['name']}")

    # ==========================
    # Dynamic Content Seeding
    # ==========================

    # Blogs
    blogs_data = [
      {
        "title": "The Ultimate Guide to Choosing Your Perfect Bed",
        "date": "2025-08-08",
        "likes": 25,
        "content": "Full content regarding choosing the perfect bed...",
        "author": "Saj Team"
      },
      {
        "title": "Top 10 Carpets to Elevate Your Living Room",
        "date": "2025-08-10",
        "likes": 18,
         "content": "Full content regarding top 10 carpets...",
        "author": "Saj Team"
      },
      {
        "title": "How to Pick the Right Rug for Your Space",
        "date": "2025-08-12",
        "likes": 32,
         "content": "Full content regarding picking rugs...",
        "author": "Saj Team"
      }
    ]
    
    for b in blogs_data:
        slug = slugify(b['title'])
        if not Blog.objects.filter(slug=slug).exists():
            Blog.objects.create(slug=slug, **b)
            print(f"Created blog: {b['title']}")

    # Team Members
    team_data = [
        { "name": "Alice", "role": "Designer", "bio": "Expert designer." },
        { "name": "Bob", "role": "Installer", "bio": "Senior installer." },
        { "name": "Charlie", "role": "Manager", "bio": "Store manager." },
        { "name": "David", "role": "Sales", "bio": "Sales executive." },
    ]
    for t in team_data:
        if not TeamMember.objects.filter(name=t['name']).exists():
            TeamMember.objects.create(**t)
            print(f"Created team member: {t['name']}")

    # Testimonials
    testimonials_data = [
        { "name": "John P.", "location": "London", "content": "I was a bit overwhelmed by all the choices, but the team at Saj Carpets & Beds was so helpful.", "rating": 5 },
        { "name": "Sarah K.", "location": "New York", "content": "Amazing service and very friendly staff! I found exactly what I was looking for.", "rating": 5 },
        { "name": "Michael L.", "location": "Berlin", "content": "Great experience from start to finish. The team helped me choose the perfect bed.", "rating": 5 },
    ]
    for tm in testimonials_data:
        if not Testimonial.objects.filter(name=tm['name']).exists():
            Testimonial.objects.create(**tm)
            print(f"Created testimonial: {tm['name']}")

    # Advertisements
    # 1. Store Policies (Footer/Home)
    ads_policies = [
        { "title": "Cash on Delivery", "description": "Pay with confidence! We offer Cash on Delivery (COD) on all orders.", "icon_name": "Money" },
        { "title": "Order Return", "description": "Not satisfied? Our easy returns policy makes it simple to send it back within 7 days.", "icon_name": "ArrowUUpLeft" },
        { "title": "Free Shipping", "description": "Enjoy free shipping on all orders, delivered right to your door at no extra cost.", "icon_name": "Package" }
    ]
    
    # 2. About Page Features
    ads_features = [
        { "title": "Savings", "description": "Beat competitors by 10%, savings of 5%-20%.", "icon_name": "PiggyBank" },
        { "title": "Convenience", "description": "Free estimating, no delivery charges, next-day delivery.", "icon_name": "SealCheck" },
        { "title": "Quality Service", "description": "Seamless installation, huge selection of samples, expert advice.", "icon_name": "Smiley" }
    ]

    all_ads = ads_policies + ads_features
    for ad in all_ads:
        if not Advertisement.objects.filter(title=ad['title']).exists():
            Advertisement.objects.create(**ad)
            print(f"Created ad: {ad['title']}")

    # Top Banner
    if not Advertisement.objects.filter(is_top_banner=True).exists():
        Advertisement.objects.create(
            title="Dream Bigger. Sleep Better.",
            description="Your bedroom should be your sanctuary. Transform it into a haven of rest and relaxation.",
            button_text="Check Out!",
            is_top_banner=True,
            icon_name="Star" # placeholder
        )
        print("Created top banner ad")

    # Info Pages
    info_pages = [
        {
            "slug": "about-intro",
            "title": "Intro Section About Us",
            "content": {
                "title": "Best Quality Furniture For Our Client",
                "description": "At Saj Carpets & Beds, we've been serving Hampshire, Surrey & Berkshire since 1998...",
                "secondaryText": "Let our team help you find the perfect flooring solution..."
            }
        }
    ]
    for info in info_pages:
        if not InfoPage.objects.filter(slug=info['slug']).exists():
            InfoPage.objects.create(**info)
            print(f"Created info page: {info['slug']}")

if __name__ == '__main__':
    seed()
