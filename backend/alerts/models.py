from django.db import models
from users.models import User

class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    keywords = models.CharField(max_length=200)
    location_filter = models.CharField(max_length=100, blank=True, null=True)
    frequency = models.CharField(max_length=50)
    last_sent = models.DateTimeField(blank=True, null=True)

# Create your models here.
