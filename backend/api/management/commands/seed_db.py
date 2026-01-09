
import os
import shutil
from pathlib import Path
from django.core.files import File
from django.utils.text import slugify
from django.core.management.base import BaseCommand
import urllib.request
from api.models.cms import HeroSlide
from api.models.product import Product, ProductImage, Category
from api.models.content import Blog
from django.conf import settings

class Command(BaseCommand):
    help = 'Seeds the database with static data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting database seed...")
        
        # Paths
        SOURCE_BASE = Path(r"c:\Users\Asus\Desktop\Work\Saj Carpets\sajcarpets\public")
        MEDIA_ROOT = Path(settings.MEDIA_ROOT)
        
        def ensure_media_dir(path):
            if not os.path.exists(path):
                os.makedirs(path)

        # LINK: Hero Seeding
        data = [
          {
            "title": "Saj Carpets & Beds",
            "subtitle": "Discover Unmatched Comfort and Style",
            "description": "Transform your house into a home with Saj Carpets & Beds. We provide high-quality carpets and beds to match your unique style.",
            "image_path": "images/slider/carpet1.jpg",
            "order": 1
          },
          {
            "title": "Luxury Carpets & Beds",
            "subtitle": "Elevate Your Home’s Style",
            "description": "Experience premium comfort with our luxurious carpets and beds. Designed to bring elegance and warmth to your home.",
            "image_path": "images/slider/bed1.jpg",
            "order": 2
          },
        ]

        ensure_media_dir(MEDIA_ROOT / 'hero_slides')

        for item in data:
            if HeroSlide.objects.filter(title=item['title']).exists():
                self.stdout.write(f"  Skipping Slide {item['title']} (already exists)")
                continue
            
            src = SOURCE_BASE / item['image_path']
            if src.exists():
                with open(src, 'rb') as f:
                    slide = HeroSlide(
                        title=item['title'],
                        subtitle=item['subtitle'],
                        description=item['description'],
                        order=item['order'],
                        is_active=True
                    )
                    slide.image.save(item['image_path'].split('/')[-1], File(f), save=True)
                self.stdout.write(self.style.SUCCESS(f"  Created Slide: {item['title']}"))
            else:
                self.stdout.write(self.style.WARNING(f"  Image not found for {item['title']}: {src}"))

        # LINK: Product Seeding
        self.stdout.write("\nSeeding Products...")
        
        cats = {
            "Rugs": None,
            "Living Room Rugs": "Rugs",
            "Bedroom Rugs": "Rugs"
        }
        
        cat_objs = {}
        for name, parent in cats.items():
            slug = slugify(name)
            if not Category.objects.filter(slug=slug).exists():
                 c = Category.objects.create(name=name, slug=slug)
            else:
                 c = Category.objects.get(slug=slug)
            cat_objs[name] = c

        products_data = [
          {
            "name": "Arran Hand-Tufted Wool Rug",
            "description": "A soft, durable hand-tufted wool rug with a subtle heathered look. Perfect for living spaces.",
            "price": 199,
            "discount_price": 169,
            "stock": 12,
            "category": "Living Room Rugs",
            "images": ["images/carpet1.jpg", "images/carpet2.jpg", "images/carpet3.jpg"]
          },
          {
            "name": "Skye Flatweave Rug",
            "description": "Low-profile flatweave with subtle stripes—easy to clean and great for high-traffic spaces.",
            "price": 129,
            "discount_price": None,
            "stock": 25,
            "category": "Living Room Rugs",
            "images": ["images/carpet4.jpg"]
          },
          {
            "name": "Harris Shag Rug",
            "description": "Super-plush shag with dense pile for a cozy, luxe feel.",
            "price": 249,
            "discount_price": 219,
            "stock": 7,
            "category": "Bedroom Rugs",
            "images": ["images/carpet1.jpg"] 
          },
        ]

        ensure_media_dir(MEDIA_ROOT / 'product_images')

        for p in products_data:
            if Product.objects.filter(name=p['name']).exists():
                self.stdout.write(f"  Skipping Product {p['name']} (already exists)")
                continue

            cat = cat_objs.get(p['category'])
            prod = Product.objects.create(
                name=p['name'],
                slug=slugify(p['name']),
                category=cat,
                description=p['description'],
                price=p['price'],
                discount_price=p['discount_price'],
                stock=p['stock'],
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f"  Created Product: {p['name']}"))

            for img_path in p['images']:
                src = SOURCE_BASE / img_path
                if src.exists():
                    with open(src, 'rb') as f:
                        pi = ProductImage(product=prod)
                        pi.image.save(img_path.split('/')[-1], File(f), save=True)
                else:
                     self.stdout.write(self.style.WARNING(f"    Image not found: {src}"))

        # LINK: Blog Seeding
        self.stdout.write("\nSeeding Blogs...")
        blogs_data = [
          {
            "title": "The Ultimate Guide to Choosing Your Perfect Carpet",
            "date": "2025-08-08",
            "image_url": "https://c.animaapp.com/ypxcOp9T/img/image-9.svg",
            "content": "<p>Choosing the right carpet can redefine a room—adding warmth, texture, and acoustic comfort. This guide breaks down fibers, pile types, sizing, and care so you can shop with confidence.</p>"
          },
          {
            "title": "Top 10 Living Room Carpets (Editor’s Picks)",
            "date": "2025-08-10",
            "image_url": "https://c.animaapp.com/ypxcOp9T/img/image-8.svg",
            "content": "<p>We shortlisted living room carpets that balance durability and design. From textured neutrals to bold geometrics, here are our favorites.</p>"
          },
          {
            "title": "How to Measure for a Rug (No Guesswork)",
            "date": "2025-08-12",
            "image_url": "https://c.animaapp.com/ypxcOp9T/img/image-10.svg",
            "content": "<p>Measure your seating area first, not the whole room. Tape out potential sizes and check door swing clearance before buying.</p>"
          }
        ]

        ensure_media_dir(MEDIA_ROOT / 'blog_images')

        for b in blogs_data:
            if Blog.objects.filter(title=b['title']).exists():
                 self.stdout.write(f"  Skipping Blog {b['title']} (already exists)")
                 continue
            
            blog = Blog(
                title=b['title'],
                slug=slugify(b['title']),
                content=b['content'],
                author="Saj Team",
                date=b['date']
            )
            
            # Download image
            try:
                # Add headers to avoid 403 Forbidden on some CDNs
                req = urllib.request.Request(
                    b['image_url'], 
                    data=None, 
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                )
                with urllib.request.urlopen(req) as response:
                    with open("temp_img", 'wb') as tmp:
                        shutil.copyfileobj(response, tmp)
                
                with open("temp_img", 'rb') as f:
                    fname = b['image_url'].split('/')[-1]
                    blog.image.save(fname, File(f), save=True)
                if os.path.exists("temp_img"):
                     os.remove("temp_img")
                     
                self.stdout.write(self.style.SUCCESS(f"  Created Blog: {b['title']}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Error downloading image for {b['title']}: {e}"))
                blog.save()

        self.stdout.write(self.style.SUCCESS("\nSeeding Complete."))
