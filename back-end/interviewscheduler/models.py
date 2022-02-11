from django.db import models

# Create your models here.
class Candidate(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

class Interview(models.Model):
    scheduled_time = models.DateField()
    location_name = models.CharField(max_length=100)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)