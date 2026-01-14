from django.db import models

class Blog(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    author = models.CharField(max_length=100)
    date = models.DateField()
    likes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    image = models.ImageField(upload_to='team_images/', blank=True, null=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    rating = models.PositiveIntegerField(default=5)
    image = models.ImageField(upload_to='testimonial_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.rating}*"

class Advertisement(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    is_top_banner = models.BooleanField(default=False)
    button_text = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='banners/', blank=True, null=True)

    def __str__(self):
        return self.title

from django.utils.text import slugify

class InfoPage(models.Model):
    slug = models.SlugField(unique=True, blank=True) # e.g., 'about-us', 'contact-us'
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="Flexible JSON content for sections") 
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(InfoPage, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"
