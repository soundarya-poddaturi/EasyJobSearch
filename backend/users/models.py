from django.db import models
from django.contrib.auth.models import User

class StudentUser(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.email


class Address(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='address', on_delete=models.CASCADE)  # Fixed plural in related_name
    address_line_1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    def __str__(self):
        return f'{self.address_line_1}, {self.city}'


class Certificate(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='certificates', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    file_link = models.URLField()

    def __str__(self):
        return self.title


class Experience(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='experiences', on_delete=models.CASCADE)
    employer = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    role_title = models.CharField(max_length=100)
    duration_from_year = models.IntegerField()  # Removed default values; can add validators
    duration_from_month = models.IntegerField()
    duration_to_year = models.IntegerField()
    duration_to_month = models.IntegerField()
    description = models.TextField()
    skills = models.CharField(max_length=255)

    def __str__(self):
        return self.role_title


class Project(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    duration_from_year = models.IntegerField()
    duration_from_month = models.IntegerField()
    duration_to_year = models.IntegerField()
    duration_to_month = models.IntegerField()
    description = models.TextField()
    skills = models.CharField(max_length=300, default='N/A')
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title


class Education(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='education', on_delete=models.CASCADE)
    institute_name = models.CharField(max_length=200)
    duration_from_year = models.IntegerField()
    duration_from_month = models.IntegerField()
    duration_to_year = models.IntegerField()
    duration_to_month = models.IntegerField()
    marks_or_grade = models.CharField(max_length=100)

    def __str__(self):
        return self.institute_name
