import os
import django
from django.utils.text import slugify
from datetime import datetime
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SajCarpet.settings')
django.setup()

from api.models import (
    Category, Product, ProductImage, 
    Attribute, AttributeValue, ProductAttributeValue,
    Blog, TeamMember, Testimonial, Advertisement, InfoPage
)
from api.models.cms import AboutFeature, SellingPoint
from api.models.review import Review
from django.contrib.auth import get_user_model

User = get_user_model()

def seed():
    print("Seeding database...")
    
    # ==========================
    # 1. Users
    # ==========================
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created superuser: admin")

    reviewers_data = [
        ("john_doe", "john@example.com"),
        ("jane_smith", "jane@example.com"),
        ("mike_ross", "mike@example.com"),
        ("rachel_zane", "rachel@example.com"),
        ("harvey_specter", "harvey@example.com")
    ]
    reviewers = []
    for username, email in reviewers_data:
        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        if created:
            user.set_password('password123')
            user.save()
        reviewers.append(user)
    print(f"Ensured {len(reviewers)} reviewer accounts.")

    # ==========================
    # 2. Categories & Attributes
    # ==========================
    categories = ["Beds", "Carpets", "Rugs", "Artificial Grass", "Vinyl", "Laminate", "Wood"]
    cat_objs = {}
    for cat_name in categories:
        slug = slugify(cat_name)
        cat, _ = Category.objects.get_or_create(slug=slug, defaults={'name': cat_name})
        cat_objs[cat_name] = cat
    
    # Attributes
    attrs_data = {
        "Color": ["Grey", "Beige", "Blue", "Charcoal", "Cream", "Green", "Red", "Brown"],
        "Size": ["Single", "Double", "King", "Super King", "Small", "Medium", "Large", "2x3m", "3x4m"],
        "Material": ["Wool", "Synthetic", "Blend", "Polypropylene", "Nylon", "Wood"]
    }
    
    attr_val_objs = {} # Map 'Color:Grey' -> AttributeValue Object
    
    for attr_name, values in attrs_data.items():
        attribute, _ = Attribute.objects.get_or_create(name=attr_name)
        for val in values:
            av, _ = AttributeValue.objects.get_or_create(attribute=attribute, value=val)
            attr_val_objs[f"{attr_name}:{val}"] = av

    # ==========================
    # 3. Products with Rich Content
    # ==========================
    
    products_list = [
        {
            'name': 'The Emerald Grass',
            'category': 'Artificial Grass',
            'price': 150.00,
            'stock': 100,
            'description': """Experience the lush, vibrant beauty of a perfectly manicured lawn all year round with 'The Emerald Grass'. Designed to mimic the natural texture and color variation of real grass, this premium artificial turf is the ultimate solution for a low-maintenance, high-impact outdoor space.
            
Say goodbye to mowing, watering, and muddy patches. The Emerald Grass features a high-density pile that feels soft underfoot, making it perfect for families, pets, and entertaining. Its UV-resistant technology ensures the rich green hue won't fade in the sun, keeping your garden looking fresh through every season.

Whether you're revamping a balcony, a small courtyard, or a sprawling backyard, the perforated backing allows for excellent drainage, preventing waterlogging during rainy days. Durable, realistic, and eco-friendly—transform your exterior into a green oasis today.""",
            'attrs': ["Color:Green", "Material:Synthetic"]
        },
        {
            'name': 'The Kensington Loop',
            'category': 'Carpets',
            'price': 25.00,
            'stock': 500,
            'description': """Bring understated elegance and exceptional durability to your home with 'The Kensington Loop'. This tightly woven loop pile carpet is engineered to withstand the hustle and bustle of daily life, making it an ideal choice for high-traffic areas like hallways, stairs, and living rooms.
            
The texture is not only visually appealing, adding a subtle depth to your floor, but also practical. Its loop construction resists crushing and flattening, ensuring it retains its neat appearance for years. Available in a palette of sophisticated neutrals, it seamlessly complements both modern and traditional interiors.

Stain-resistant and easy to clean, The Kensington Loop offers peace of mind along with style. It’s the smart choice for busy households that refuse to compromise on aesthetics.""",
            'attrs': ["Color:Grey", "Color:Beige", "Material:Polypropylene"]
        },
        {
            'name': 'The Mayfair Saxony',
            'category': 'Carpets',
            'price': 35.00,
            'stock': 300,
            'description': """Indulge in pure luxury with 'The Mayfair Saxony', a carpet that redefines comfort. Sink your toes into the deep, plush pile that offers a sensation of warmth and softness unmatched by standard carpets. It’s the perfect foundation for bedrooms and lounges where comfort is king.
            
Crafted with high-quality fibers, the Mayfair Saxony doesn't just feel good; it looks stunning. The saxony cut reflects light beautifully, creating a rich, velvet-like appearance that adds a touch of glamour to any room. 
            
Despite its opulent feel, it is surprisingly durable and resilient. Treated with advanced stain protection, spills are easily managed, allowing you to enjoy luxury living without the worry. Elevate your home sanctuary with the touch of class it deserves.""",
            'attrs': ["Color:Charcoal", "Color:Cream", "Material:Nylon"]
        },
        {
            'name': 'Luxury King Bed',
            'category': 'Beds',
            'price': 899.00,
            'discount_price': 799.00,
            'stock': 10,
            'description': """Transform your bedroom into a five-star retreat with our 'Luxury King Bed'. This masterfully crafted bed frame combines robust engineering with exquisite design. The headboard features deep button tufting and premium upholstery that exudes sophistication.
            
Included is our signature orthopedic mattress, designed to support your spine and alleviate pressure points, ensuring you wake up refreshed every morning. The slat system provides optimal ventilation for the mattress, extending its lifespan and maintaining hygiene.
            
With ample under-bed clearance for storage and a sturdy construction that eliminates squeaks, this bed is a marriage of form and function. It's not just a place to sleep; it's a centerpiece for your bedroom decor.""",
            'attrs': ["Size:King", "Color:Grey"]
        },
        {
            'name': 'Persian Style Rug',
            'category': 'Rugs',
            'price': 120.00,
            'stock': 25,
            'description': """Add a timeless masterpiece to your floor with our 'Persian Style Rug'. Inspired by centuries-old traditional designs, this rug features intricate floral motifs and a rich, warm color palette that brings instant character to any room.
            
Woven from high-quality, durable fibers, it captures the look and feel of an authentic antique rug without the fragile maintenance. It's fade-resistant and stands up well to foot traffic, making it a perfect anchor for your living room seating area or dining table.
            
Soft yet resilient, it adds a layer of acoustic insulation and warmth to hard floors. Whether your home is classic, bohemian, or eclectic, this rug ties the room together with unmatched charm.""",
            'attrs': ["Size:Large", "Color:Red", "Material:Blend"]
        },
        {
            'name': 'Nordic Oak Laminate',
            'category': 'Laminate',
            'price': 18.50,
            'stock': 200,
            'description': """Capture the serene beauty of Scandinavian design with 'Nordic Oak Laminate'. This flooring offers the authentic look of wide-plank oak with the practical benefits of modern laminate technology. The light, airy tones brighten up any space, making small rooms feel larger and more inviting.
            
Its scratch-resistant top layer is designed to cope with pets, heels, and furniture, while the click-lock system makes installation a breeze for DIY enthusiasts. Water-resistant and easy to sweep, it’s ideal for kitchens and dining areas.
            
Enjoy the warmth and texture of wood without the maintenance. Nordic Oak Laminate delivers a clean, modern aesthetic that stands the test of time.""",
             'attrs': ["Color:Beige", "Material:Synthetic"]
        },
        {
            'name': 'Vinyl Stone Effect',
            'category': 'Vinyl',
            'price': 22.00,
            'stock': 150,
            'description': """Achieve the sophisticated look of natural stone with the warmth and comfort of vinyl. Our 'Vinyl Stone Effect' flooring features realistic slate textures and varying tones that mimic the real thing perfectly.
            
Unlike cold stone tiles, this vinyl is warm underfoot and cushioned, reducing noise and providing comfort when standing for long periods. It is 100% waterproof, making it the ultimate choice for bathrooms and kitchens.
            
Slip-resistant and incredibly easy to clean, it offers a safe and hygienic surface for family homes. Upgrade your utility spaces with a flooring that combines rugged looks with soft durability.""",
             'attrs': ["Color:Grey", "Material:Synthetic"]
        },
        {
            'name': 'Solid Walnut Flooring',
            'category': 'Wood',
            'price': 65.00,
            'stock': 80,
            'description': """Nothing compares to the richness of real wood. Our 'Solid Walnut Flooring' is sourced from sustainable forests and offers a distinct, dark grain that exudes luxury and warmth. Each plank is unique, telling its own story through natural knots and variations.
            
This solid wood flooring is an investment that adds value to your property. It can be sanded and refinished multiple times, ensuring it lasts for generations. The lacquered finish enhances the wood's natural beauty while providing a protective shield against daily wear.
            
Perfect for formal dining rooms, studies, or grand hallways, Solid Walnut Flooring is the statement piece your home has been waiting for.""",
             'attrs': ["Color:Brown", "Material:Wood"]
        }
    ]

    for p_data in products_list:
        cat_name = p_data.pop('category')
        attrs = p_data.pop('attrs', [])
        cat = cat_objs.get(cat_name)
        if not cat: continue
        
        slug = slugify(p_data['name'])
        
        # Create or Update Product
        product, created = Product.objects.update_or_create(
            slug=slug,
            defaults={
                'name': p_data['name'],
                'category': cat,
                'description': p_data['description'],
                'price': p_data['price'],
                'stock': p_data['stock'],
                'discount_price': p_data.get('discount_price')
            }
        )
        print(f"{'Created' if created else 'Updated'} product: {product.name}")
        
        # Assign Attributes
        for attr_key in attrs:
            av = attr_val_objs.get(attr_key)
            if av:
                ProductAttributeValue.objects.get_or_create(product=product, attribute_value=av)

    # ==========================
    # 4. Rich Blog Content
    # ==========================
    blogs_data = [
      {
        "title": "The Ultimate Guide to Choosing Your Perfect Bed",
        "date": "2025-08-08",
        "likes": 25,
        "author": "Saj Team",
        "content": """We spend a third of our lives sleeping, so choosing the right bed is one of the most important decisions you can make for your home and health. But with so many options—from memory foam to pocket springs, divans to bedsteads—where do you start?

### 1. Size Matters
First, consider the size of your room. A Super King might sound dreamy, but if it leaves you no room to walk, it will cramp your style. Measure your space carefully, allowing for door opening and bedside tables.

### 2. Support is Key
Your mattress should support your spine in a neutral position. If you share a bed, look for pocket sprung mattresses which minimize 'roll-together', or memory foam which molds to your individual shapes.

### 3. Style and Storage
A bed is the focal point of the room. Upholstered frames add softness and luxury, while wooden frames offer timeless appeal. Don't forget storage! Ottoman beds or divans with drawers can be life-savers in smaller homes.

At Saj Carpets & Beds, we offer a personalized consultation to help you find the bed of your dreams. Visit our showroom to test our range today."""
      },
      {
        "title": "Top 10 Carpets to Elevate Your Living Room",
        "date": "2025-08-10",
        "likes": 18,
        "author": "Alice Designer",
        "content": """The living room is the heart of the home, and the carpet you choose sets the tone for the entire space. Here are our top picks for 2025:

1. **The Plush Saxony**: For those who prioritize comfort above all.
2. **The Durable Loop**: Perfect for busy family homes with pets.
3. **The Statement Pattern**: Bold geometrics are back in vogue.
4. **The Natural Wool**: Sustainable, breathable, and incredibly resilient.
...

Choosing the right color is just as important as the texture. Light neutrals expand the space, while deep blues and greys create a cozy, intimate atmosphere. Stop by to see our full swatch collection!"""
      },
      {
        "title": "Artificial Grass: Is It Right for You?",
        "date": "2025-08-12",
        "likes": 32,
        "author": "Bob Installer",
        "content": """Gone are the days of fake-looking, plastic grass. Modern artificial turf is indistinguishable from the real thing, offering a lush green lawn 365 days a year without the mud, mowing, or watering.

**Pros:**
*   **Low Maintenance:** No more weekends spent mowing.
*   **Durability:** Withstands heavy foot traffic and sports.
*   **Pet Friendly:** Easy to clean and resistant to digging.

**Cons:**
*   **Initial Cost:** Higher upfront investment than turf.
*   **Heat:** Can get warm in direct, intense summer sun.

For many of our clients, the benefits far outweigh the downsides. It's truly a lifestyle upgrade."""
      }
    ]
    
    for b in blogs_data:
        slug = slugify(b['title'])
        Blog.objects.update_or_create(slug=slug, defaults=b)
        print(f"Updated blog: {b['title']}")

    # ==========================
    # 5. Reviews, Testimonials, Ads, Team ...
    # ==========================
    
    # Team
    team_data = [
        { "name": "Alice", "role": "Designer", "bio": "With 10 years of interior design experience, Alice helps you coordinate your flooring with your wider decor." },
        { "name": "Bob", "role": "Head Installer", "bio": "Bob ensures every carpet and floor is fitted to perfection, with a keen eye for detail." },
        { "name": "Charlie", "role": "Manager", "bio": "Charlie oversees the showroom and ensures every customer leaves with a smile." }
    ]
    for t in team_data:
        TeamMember.objects.get_or_create(name=t['name'], defaults=t)

    # Testimonials
    testimonials_data = [
        { "name": "John P.", "location": "London", "content": "I was a bit overwhelmed by all the choices, but the team at Saj Carpets & Beds was so helpful.", "rating": 5 },
        { "name": "Sarah K.", "location": "New York", "content": "Amazing service and very friendly staff! I found exactly what I was looking for.", "rating": 5 },
        { "name": "Michael L.", "location": "Berlin", "content": "Great experience from start to finish. The team helped me choose the perfect bed.", "rating": 5 },
    ]
    for tm in testimonials_data:
        Testimonial.objects.get_or_create(name=tm['name'], defaults=tm)

    # Ads
    ads_policies = [
        { "title": "Cash on Delivery", "description": "Pay with confidence! We offer Cash on Delivery (COD) on all orders.", "icon_name": "Money" },
        { "title": "Order Return", "description": "Not satisfied? Our easy returns policy makes it simple to send it back within 7 days.", "icon_name": "ArrowUUpLeft" },
        { "title": "Free Shipping", "description": "Enjoy free shipping on all orders, delivered right to your door at no extra cost.", "icon_name": "Package" }
    ]
    for ad in ads_policies:
        Advertisement.objects.get_or_create(title=ad['title'], defaults=ad)

    # About Features (Why Choose Us)
    about_features_data = [
        { "title": "Savings", "description": "Beat competitors by 10%, savings of 5%-20%.", "icon_name": "PiggyBank" },
        { "title": "Convenience", "description": "Free estimating, no delivery charges, next-day delivery.", "icon_name": "SealCheck" },
        { "title": "Quality Service", "description": "Seamless installation, huge selection of samples, expert advice.", "icon_name": "Smiley" }
    ]
    for feat in about_features_data:
        AboutFeature.objects.get_or_create(title=feat['title'], defaults=feat)

    # Info Pages
    info_pages = [
        {
            "slug": "about-intro",
            "title": "Intro Section About Us",
            "content": {
                "title": "Best Quality Furniture For Our Client",
                "description": "At Saj Carpets & Beds, we've been serving Hampshire, Surrey & Berkshire since 1998. We pride ourselves on offering a vast selection of high-quality flooring and beds to suit every style and budget.",
                "secondaryText": "Let our team help you find the perfect flooring solution. From measurement to installation, we handle it all with professionalism and care."
            }
        }
    ]
    for info in info_pages:
        InfoPage.objects.update_or_create(slug=info['slug'], defaults=info)

    # Reviews Seeding (Refresh)
    comments_pool = [
        "Absolutely love this! The quality is outstanding and it looks even better in person.",
        "Great value for money. Highly recommended to anyone looking to upgrade their home.",
        "It's decent, delivery was fast, but I expected a slightly different shade.",
        "Fast delivery and exactly as described. The installers were very professional.",
        "The texture is amazing, really adds warmth to the room. My kids love playing on it.",
        "Customer service was helpful when I had questions about sizing. 5 stars!",
        "Best purchase I've made for my home this year. Completely transformed the space.",
        "Super comfortable and luxurious. Feels like walking on clouds.",
        "Installation was a breeze, laid it myself in an afternoon.",
        "Solid construction, very heavy and durable. Will last for years."
    ]

    print("Refreshing reviews...")
    all_products = Product.objects.all()
    for product in all_products:
        # Check if product has enough reviews
        current_reviews = product.reviews.count()
        if current_reviews < 5:
            needed = 5 - current_reviews
            for _ in range(needed):
                reviewer = random.choice(reviewers)
                rating = random.choices([3, 4, 5], weights=[10, 40, 50], k=1)[0]
                comment = random.choice(comments_pool)
                Review.objects.create(product=product, user=reviewer, rating=rating, comment=comment)
            print(f"Added reviews for {product.name}")

from api.models.catalogue import CatalogueItem

def create_ads():
    print("Creating Ads (Banners)...")
    Advertisement.objects.all().delete()
    
    # Only keep the banners (e.g. Dream Bigger)
    banners = [
        {
            "title": "Dream Bigger. Sleep Better.",
            "description": "Experience the ultimate comfort with our new collection of luxury mattresses.",
            "button_text": "Shop Beds",
            "image": None,
            "is_top_banner": True,
        },
         {
            "title": "New Season, New Style",
            "description": "Refresh your home with our latest carpet arrivals.",
            "button_text": "View Carpets",
            "image": None,
            "is_top_banner": True,
        }
    ]

    for ad_data in banners:
        Advertisement.objects.create(**ad_data)
    print("Ads (Banners) created.")

def create_selling_points():
    print("Creating Selling Points...")
    SellingPoint.objects.all().delete()

    points = [
        {
            "title": "Free Delivery",
            "description": "We offer free delivery on all orders over £500. Fast and reliable service to your doorstep.",
            "icon_name": "Package",
            "order": 1
        },
        {
            "title": "Order Return",
            "description": "Not happy with your purchase? Return it within 30 days for a full refund. No questions asked.",
            "icon_name": "ArrowUUpLeft",
            "order": 2
        },
        {
            "title": "Free Shipping",
            "description": "Enjoy free shipping on selected items. Check our shipping policy for more details.",
            "icon_name": "Money", 
            "order": 3
        }
    ]

    for sp in points:
        SellingPoint.objects.create(**sp)
    print("Selling Points created.")

def create_catalogue():
    print("Creating catalogue items...")
    CatalogueItem.objects.all().delete()
    
    items = [
        {
            "title": "The Emerald Grass",
            "category": "Artificial Grass, Outdoor",
            "description": "Experience the lush, vibrant beauty of a perfectly manicured lawn all year round with 'The Emerald Grass'. Designed to mimic the natural texture and color variation of real grass, this premium artificial turf is the ultimate solution for a low-maintenance, high-impact outdoor space.\n\nCrafted with high-quality, UV-resistant fibers, 'The Emerald Grass' maintains its rich green hue even under the harshest sun, ensuring your garden looks fresh and inviting regardless of the season. Its advanced drainage system prevents water accumulation, making it pet-friendly and easy to clean, while the soft, cushioned feel underfoot provides a safe and comfortable play area for children.\n\nIdeal for patios, balconies, rooftops, or replacing natural lawns, this artificial grass eliminates the need for mowing, watering, and fertilizing. Say goodbye to muddy patches and relentless upkeep, and hello to a pristine, evergreen landscape that enhances the aesthetic appeal of your home. Whether hosting a summer barbecue or enjoying a quiet afternoon, 'The Emerald Grass' offers the perfect blend of functionality and style for modern outdoor living.",
            "image": None 
        },
        {
            "title": "The Kensington Loop",
            "category": "Loop Pile, High-Traffic",
            "description": "Bring understated elegance and exceptional durability to your home with 'The Kensington Loop'. This tightly woven loop pile carpet is engineered to withstand the hustle and bustle of daily life, making it an excellent choice for hallways, stairs, and living rooms where foot traffic is highest.\n\nThe unique loop construction not only adds a sophisticated texture to your floor but also offers superior resilience against crushing and matting. Available in a palette of neutral, earthy tones, 'The Kensington Loop' seamlessly integrates with various interior styles, from contemporary minimalist to rustic charm.\n\nBeyond its robustness, this carpet provides a layer of thermal insulation, helping to keep your home warm and energy-efficient. Its stain-resistant properties ensure that spills and accidents are easily managed, maintaining the carpet's pristine appearance for years. Choose 'The Kensington Loop' for a practical yet stylish flooring solution that doesn't compromise on comfort.",
            "image": None
        },
        {
            "title": "The Mayfair Saxony",
            "category": "Cut Pile, Luxury",
            "description": "Indulge in pure luxury with 'The Mayfair Saxony', a carpet that redefines comfort. Sink your toes into the deep, plush pile that offers a sensation of warmth and softness unmatched by standard carpets. Perfect for bedrooms and lounges, this carpet transforms any room into a cozy sanctuary.\n\nManufactured using premium-grade fibers, 'The Mayfair Saxony' boasts a rich, velvety finish that catches the light beautifully, adding a touch of opulence to your decor. Its dense weave provides excellent sound absorption, creating a quieter, more peaceful environment in your home.\n\nAvailable in a wide range of sophisticated colors, from deep jewel tones to soft pastels, you can find the perfect shade to complement your design vision. Despite its luxurious feel, 'The Mayfair Saxony' is designed for longevity, treated with stain protection to ensure it remains as stunning as the day it was installed. Elevate your living space with the unparalleled elegance and comfort of 'The Mayfair Saxony'.",
            "image": None
        },
        {
            "title": "The Hampshire Weave",
            "category": "Wool, Natural Fibre",
            "description": "Discover the timeless appeal of 'The Hampshire Weave', a carpet that celebrates the natural beauty and resilience of wool. Woven using traditional methods, this carpet features a distinctive texture that adds depth and character to any room, embodying a classic British style.\n\nWool is naturally insulating, flame-retardant, and resistant to dirt, making 'The Hampshire Weave' a safe and practical choice for family homes. Its breathable fibers help regulate humidity, contributing to a healthier indoor climate. The natural elasticity of wool means the carpet bounces back from furniture indentations, maintaining its structure over time.\n\nWith its subtle, organic patterns and warm, neutral shades, this carpet serves as a versatile foundation for both modern and traditional interiors. Committed to sustainability, 'The Hampshire Weave' is biodegradable and renewable, offering an eco-friendly flooring option without sacrificing quality or aesthetics. Invest in the enduring quality of natural wool with 'The Hampshire Weave'.",
            "image": None
        },
        {
            "title": "The Regent Flatweave",
            "category": "Flatweave, Natural Fibre",
            "description": "Low-profile texture ideal for busy rooms; easy to clean and beautifully understated. Its flat construction prevents dirt accumulation, making it a hygienic choice for dining areas.\n\n'The Regent Flatweave' combines modern practicality with sleek design. Its tight weave structure ensures that chairs slide easily over the surface, preventing snagging and wear common in other carpet types. This makes it particularly suitable for home offices and dining rooms.\n\nHighly durable and resistant to crushing, this flatweave carpet maintains its crisp responsiveness even in high-traffic zones. The collection features a range of contemporary geometric designs and solid colors, allowing you to make a bold statement or keep things simple. Easy to vacuum and maintain, 'The Regent Flatweave' offers a hassle-free flooring solution that keeps up with your dynamic lifestyle.",
            "image": None
        },
        {
            "title": "The Camden Pattern",
            "category": "Pattern, Statement",
            "description": "Bold geometric pattern that pulls a room together and adds visual interest. Uses colorfast dyes to ensure the vibrant design remains striking for years to come. 'The Camden Pattern' is for those who view their floor as a canvas.\n\nInspired by modern art and urban architecture, this collection features eye-catching motifs that can serve as the focal point of a room. Whether you prefer monochrome contrasts or vibrant bursts of color, there is a design to match your personality.\n\nConstructed from durable synthetic fibers, it is stain-resistant and bleach-cleanable, ensuring that the bold patterns stay bright and defined. Perfect for living areas, playrooms, or creative workspaces, 'The Camden Pattern' injects energy and style into your home, proving that practical flooring can also be a stunning design element.",
            "image": None
        },
        {
            "title": "Luxury King Bed",
            "category": "Beds, Luxury",
            "description": "Transform your bedroom into a five-star retreat with our 'Luxury King Bed'. This masterfully crafted bed frame combines robust engineering with exquisite design, offering the perfect blend of style and support for a restful night's sleep.\n\nThe headboard is upholstered in premium velvet fabric, featuring deep button tufting that adds a touch of classic elegance. The frame is constructed from solid hardwood, ensuring stability and longevity. A high-quality slat system supports your mattress, providing optimal ventilation and distributing weight evenly to prevent sagging.\n\nAvailable with optional under-bed storage drawers, the 'Luxury King Bed' maximizes functionality without compromising aesthetics. Whether reading a book against the plush headboard or drifting off to sleep, this bed provides the ultimate comfort experience. Elevate your bedroom decor with this centerpiece of luxury and craftsmanship.",
            "image": None
        },
        {
            "title": "Persian Style Rug",
            "category": "Rugs, Traditional",
            "description": "Add a timeless masterpiece to your floor with our 'Persian Style Rug'. Inspired by centuries-old traditional designs, this rug features intricate floral motifs and a rich, complex color palette that tells a story of heritage and artistry.\n\nWoven from high-quality, soft fibers, it offers a luxurious feel underfoot while being durable enough to withstand high traffic areas. The detailed border and central medallion create a structured, elegant look that anchors any room, from formal dining areas to cozy living rooms.\n\nStain-resistant and easy to clean, this rug combines the beauty of antique styling with the practicality of modern materials. Whether placed on hardwood floors or layered over carpet, the 'Persian Style Rug' adds warmth, texture, and a sense of history to your home decor.",
            "image": None
        }
    ]

    for i, item in enumerate(items):
        CatalogueItem.objects.create(
            title=item["title"],
            description=item["description"],
            category=item["category"],
            order=i
        )
    print("Catalogue items created.")

if __name__ == '__main__':
    seed()
    create_ads()
    create_selling_points()
    create_catalogue()
