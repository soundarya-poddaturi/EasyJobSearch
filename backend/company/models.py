from django.db import models
from django.contrib.auth.models import User

from django.db import models


class Company(models.Model):
    email=models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
   
    job_name = models.CharField(max_length=100)
    job_role = models.CharField(max_length=100)
    job_description = models.TextField()
    last_date = models.DateField()

    def __str__(self):
        return self.job_name

class Question(models.Model):
    job = models.ForeignKey(Job, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()

    def __str__(self):
        return self.question_text