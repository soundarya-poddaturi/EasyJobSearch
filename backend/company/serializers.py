#by suppa


# users/serializers.py

from rest_framework import serializers
from .models import Job, Question,Company

# class QuestionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Question
#         fields = ['question_text']

# class JobSerializer(serializers.ModelSerializer):
#     questions = QuestionSerializer(many=True)

#     class Meta:
#         model = Job
#         fields = ['job_id', 'job_name', 'job_role', 'job_description', 'last_date', 'questions']

#     def create(self, validated_data):
#         questions_data = validated_data.pop('questions')
#         job = Job.objects.create(**validated_data)
#         for question_data in questions_data:
#             Question.objects.create(job=job, **question_data)
#         return job


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_text']

class JobSerializer(serializers.ModelSerializer):
    # Set read_only=True for listing jobs
    questions = QuestionSerializer(many=True, read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source='company', write_only=True)  # To handle company ID input
    company = serializers.StringRelatedField(read_only=True)  # To display the company name when listing

    class Meta:
        model = Job
        fields = [ 'job_name', 'job_role', 'job_description', 'last_date', 'questions', 'company_id', 'company']

    def create(self, validated_data):
        # Extract questions and company_id
        questions_data = self.context['request'].data.get('questions', [])
        company = validated_data.pop('company')
        
        # Create job with validated data and company
        job = Job.objects.create(**validated_data, company=company)
        
        # Create questions linked to the job
        for question_data in questions_data:
            Question.objects.create(job=job, **question_data)
        
        return job