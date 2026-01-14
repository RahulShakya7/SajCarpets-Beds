from django.db import models

class CatalogueItem(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='catalogue_images/', null=True, blank=True)
    category = models.CharField(max_length=255, help_text="Comma-separated categories")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title
