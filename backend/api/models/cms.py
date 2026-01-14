from django.db import models

class HeroSlide(models.Model):
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='hero_images/')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title or f"Slide {self.id}"

class CompanyInfo(models.Model):
    name = models.CharField(max_length=255, default="Saj Carpets")
    logo = models.ImageField(upload_to='company_assets/', blank=True, null=True)
    about_image = models.ImageField(upload_to='company_assets/', blank=True, null=True)
    about_us_content = models.TextField(blank=True, help_text="Content for the About Us page")
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    facebook_link = models.URLField(blank=True)
    instagram_link = models.URLField(blank=True)
    instagram_link = models.URLField(blank=True)
    twitter_link = models.URLField(blank=True)
    
    # New Footer/Map Fields
    map_image = models.ImageField(upload_to='company_assets/', blank=True, null=True, help_text="Fallback image if interactive map is not used")
    map_url = models.URLField(blank=True, help_text="Link to Google Maps or similar")
    opening_hours = models.TextField(blank=True, help_text="Line separated opening hours")
    payment_image = models.ImageField(upload_to='company_assets/', blank=True, null=True, help_text="Payment methods icons image")
    
    def __str__(self):
        return f"{self.name} Info"

    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and CompanyInfo.objects.exists():
            return # Prevent creating second instance via code if needed, but viewset logic is better
        super(CompanyInfo, self).save(*args, **kwargs)

class AboutFeature(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, help_text="Phosphor Icon name (e.g., Smiley, Package)")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']


    def __str__(self):
        return self.title

class SellingPoint(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, help_text="Phosphor Icon name (e.g., Package, Money)")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title

