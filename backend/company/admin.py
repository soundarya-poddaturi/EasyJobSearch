from django.contrib import admin
from .models import Job, Question, Answer, Application, Company

class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_name', 'job_role', 'company', 'last_date')
    search_fields = ('job_name', 'job_role')
    list_filter = ('company', 'last_date')

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'question_text')
    search_fields = ('question_text',)
    list_filter = ('job',)

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_id', 'job', 'status')  # Display ID, student_id, job, and status
    search_fields = ('student_id',)
    list_filter = ('status', 'job')  # Filter by status and job for easy admin access

class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'question', 'answer_text')
    search_fields = ('answer_text',)
    list_filter = ('application', 'question')

admin.site.register(Job, JobAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Company)
