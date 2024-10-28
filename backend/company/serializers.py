#by suppa


# users/serializers.py

from rest_framework import serializers
from .models import Job, Question,Company,Application, Answer

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
        fields = ['id', 'question_text']  # Including `id` for better identification

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'location']


# serializers.py

class JobSerializer(serializers.ModelSerializer):
    # Set read_only=True for listing jobs
    questions = QuestionSerializer(many=True, read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source='company', write_only=True)  # To handle company ID input
    company = serializers.StringRelatedField(read_only=True)  # To display the company name when listing
    
    # Add a company_details field to include both `name` and `location` from Company model
    company_details = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['job_name', 'job_role', 'job_description', 'last_date', 'questions', 'company_id', 'company', 'company_details']

    def get_company_details(self, obj):
        """Retrieve company name and location for display."""
        return {
            'name': obj.company.name,
            'location': obj.company.location
        }

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


class AnswerSerializer(serializers.ModelSerializer):
    # For reading: Include question details; For writing: Expect `question_id` from frontend
    question = QuestionSerializer(read_only=True)  
    question_id = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all(), source='question', write_only=True
    )

    class Meta:
        model = Answer
        fields = ['id', 'question', 'question_id', 'answer_text']

class ApplicationSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)  # For handling multiple answers at once
    job_id = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all(), source='job')  # Link to Job model

    class Meta:
        model = Application
        fields = ['id', 'student_id', 'job_id', 'status', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        application = Application.objects.create(**validated_data)
        
        for answer_data in answers_data:
            Answer.objects.create(application=application, **answer_data)
        
        return application