from django.db import models
from django.contrib.auth.models import User
class StudentUser(model.Model):
    email=

class Address(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address_line_1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

class Certificate(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name='certificates', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    file_link = models.URLField()

class Experience(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name='experiences', on_delete=models.CASCADE)
    employer = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    role_title = models.CharField(max_length=100)
    duration_from_year = models.IntegerField(default=1900)  # Added default value
    duration_from_month = models.IntegerField(default=1)  # Added default value
    duration_to_year = models.IntegerField(default=1900)  # Added default value
    duration_to_month = models.IntegerField(default=12)  # Added default value
    description = models.TextField()
    skills = models.CharField(max_length=255)
from django.db import models

class Project(models.Model):
    user_profile = models.ForeignKey(UserProfile,related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    duration_from_year = models.IntegerField(default=1900)  # Added default value
    duration_from_month = models.IntegerField(default=1)  # Added default value
    duration_to_year = models.IntegerField(default=1900)  # Added default value
    duration_to_month = models.IntegerField(default=12)  # Added default value
    description = models.TextField()
    skills = models.CharField(max_length=300, default='N/A') 
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title
class Education(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name='education',on_delete=models.CASCADE)
    institute_name = models.CharField(max_length=200)
    duration_from_year = models.IntegerField(default=1900)  # Added default value
    duration_from_month = models.IntegerField(default=1)  # Added default value
    duration_to_year = models.IntegerField(default=1900)  # Added default value
    duration_to_month = models.IntegerField(default=12)  # Added default value
    marks_or_grade = models.CharField(max_length=100)
