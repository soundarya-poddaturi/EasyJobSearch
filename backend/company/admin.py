from django.contrib import admin
from .models import Job
from .models import Question
from .models import Company


admin.site.register(Job)
admin.site.register(Question)
admin.site.register(Company)