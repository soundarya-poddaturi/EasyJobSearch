#Company side views by suppa

# from django.contrib.auth.models import Company
from rest_framework.views import APIView
from .models import Company
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import JobSerializer
from .models import Job
from .serializers import ApplicationSerializer
from .models import Application  # Make sure this line is present


# Register view
@api_view(['POST'])
def register_company(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name=request.data.get('name')
    location=request.data.get('location')
    if Company.objects.filter(email=email).exists():
        return Response({'error': 'email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    hashed_password = make_password(password)
    user = Company.objects.create(email=email, password=hashed_password,name=name,location=location)
    user.save()

    return Response({'message': 'Company registered successfully'}, status=status.HTTP_201_CREATED)

# # Login view
# @api_view(['POST'])
# def login_company(request):
    # email = request.data.get('email')
    # password = request.data.get('password')

    # user = authenticate(email=email, password=password)
    # if user is not None:
    #     refresh = RefreshToken.for_user(user)
    #     return Response({
    #         'refresh': str(refresh),
    #         'access': str(refresh.access_token),
    #     })
    # else:
    #     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def login_company(request):
    email = request.data.get('email')
    password = request.data.get('password')
    print(email,password)
    # Check if both email and password are provided
    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if the user with the provided email exists
        user = Company.objects.get(email=email)
    except Company.DoesNotExist:
        return JsonResponse({'error': 'Invalid email or password.'}, status=401)

    if check_password(password, user.password):
        return JsonResponse({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                
            }
        }, status=200)
    else:
        return JsonResponse({'error': 'Invalid email or password.'}, status=401)





@api_view(['POST'])
def create_job(request):
    print(request.data)
    serializer = JobSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def list_jobs(request):
#     # Get the company name from query parameters
#     company_name = request.query_params.get('company', None)

#     if company_name:
#         try:
#             # Fetch the company by name
#             company = Company.objects.get(name=company_name)
#             # Retrieve all jobs for that company
#             jobs = Job.objects.filter(company=company)
#             if not jobs.exists():
#                 return Response({"error": "No jobs found for this company."}, status=status.HTTP_404_NOT_FOUND)
#         except Company.DoesNotExist:
#             return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)
#     else:
#         # If no company name is provided, retrieve all jobs
#         jobs = Job.objects.all()

#     serializer = JobSerializer(jobs, many=True)
#     return Response(serializer.data)
@api_view(['GET'])
def get_company_details(request, company_id):
    try:
        company = Company.objects.get(id=company_id)
        company_data = {
            'id': company.id,
            'email': company.email,
            'name': company.name,
            'location': company.location
        }
        return JsonResponse(company_data, status=200)
    except Company.DoesNotExist:
        return JsonResponse({'error': 'Company not found.'}, status=404)


from django.http import JsonResponse
from .models import Job

def list_jobs(request):
    jobs = Job.objects.select_related('company').prefetch_related('questions').all()

    # Create a list to hold job data
    job_list = []

    for job in jobs:
        # Construct job data including company and questions
        job_data = {
            'id':job.id,
            'job_name': job.job_name,
            'job_role': job.job_role,
            'job_description': job.job_description,
            'last_date': job.last_date,
            'experience':job.experience,
            'type':job.type,
            'salary':job.salary,
            'company': {
                'id': job.company.id,
                'name': job.company.name,
                'email': job.company.email,
                'location': job.company.location
            },
            'questions': [{'id': question.id, 'question_text': question.question_text} for question in job.questions.all()]
        }

        # Append the job data to the job list
        job_list.append(job_data)

    # Return the job list as JSON response
    return JsonResponse(job_list, safe=False)
@api_view(['GET'])
def get_company_jobs(request, company_id):
    # print(company_id)
    try:
        # Retrieve the company by ID
        company = Company.objects.get(id=company_id)
        # Fetch all jobs related to the company
        jobs = company.jobs.all()  # Use the related name 'jobs' defined in the Job model

        # Serialize job data
        job_list = []
        for job in jobs:
            job_data = {
                'job_id': job.id,
                'job_name': job.job_name,
                'job_role': job.job_role,
                'job_description': job.job_description,
                'last_date': job.last_date,
                'experience':job.experience,
                'type':job.type,
                'salary':job.salary,
            }
            job_list.append(job_data)

        # Return the list of jobs as a JSON response
        return JsonResponse(job_list, safe=False)

    except Company.DoesNotExist:
        return JsonResponse({'error': 'Company not found.'}, status=404)
@api_view(['GET'])
def get_job_details(request, job_id):
    try:
        # Retrieve the job with the provided job_id
        job = Job.objects.get(id=job_id)
        
        # Serialize the job details
        serializer = JobSerializer(job)
        
        # Return the serialized job data as JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
'''
@api_view(['POST'])
def create_application(request):
    serializer = ApplicationSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ApplicationSerializer
from .models import Job  # Import Job from the current app
from django.http import JsonResponse
from users.views import user_profile  # Adjust this import based on your project structure
from django.test import RequestFactory  # Import RequestFactory
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ApplicationSerializer
from .models import Job  # Import Job from the current app
from users.models import StudentUser  # Import StudentUser from the users app
from django.http import JsonResponse
from users.views import user_profile  # Adjust this import based on your project structure
from django.test import RequestFactory  # Import RequestFactory
from .models import RequiredSkills
@api_view(['POST'])
def create_application(request):
    serializer = ApplicationSerializer(data=request.data)

    if serializer.is_valid():
        # Extract student ID and job ID from request data
        student_id = request.data.get('student_id')
        job_id = request.data.get('job_id')

        # Fetch job details
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch mandatory skills for the job
        mandatory_skills = RequiredSkills.objects.filter(job=job, mandatory_flag=True).values_list('skill_name', flat=True)
        print(mandatory_skills)
        # Fetch student details using the existing user_profile function
        factory = RequestFactory()
        student_request = factory.get(f'/api/profile/{student_id}/')
        student_response = user_profile(student_request, student_id)
        
        # Extract data from the JsonResponse
        student_data = json.loads(student_response.content)
        student_skills = set(skill['skill_name'] for skill in student_data['skills'])  # Adjust key name if needed

        # Check if student has all mandatory skills
        missing_skills = [skill for skill in mandatory_skills if skill not in student_skills]
        if missing_skills:
            return Response(
                {"error": "Student is missing the following mandatory skills: " + ", ".join(missing_skills)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save the application and prepare the response data
        application = serializer.save()
        response_data = {
            "application": serializer.data,
            "student": student_data['personal_info'],
            "job": {
                "id": job.id,
                "job_name": job.job_name,
                "job_role": job.job_role,
                "company_id": job.company_id,
            },
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_applications_by_job(request, job_id):
    try:

        applications = Application.objects.filter(job_id=job_id)  # Get applications for the specified job
        serializer = ApplicationSerializer(applications, many=True)  # Serialize the data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return the serialized data
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_application_details(request, application_id):
    # print("application by jobid")
    try:
        # Retrieve the application by ID
        application = Application.objects.get(id=application_id)
        # print(application)
    except Application.DoesNotExist:
        return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the application details with answers and questions
    serializer = ApplicationSerializer(application)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateApplicationStatusView(APIView):
    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Update only the status field
        application.status = request.data.get("status")
        application.save()

        return Response({"message": "Status updated successfully", "status": application.status}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_application_ids_by_student(request, student_id):
    try:
        # Filter applications by the provided student_id
        applications = Application.objects.filter(student_id=student_id)
        
        # Extract only the application IDs
        application_ids = applications.values_list('id', flat=True)
        
        # Return the list of application IDs as a JSON response
        return Response({"application_ids": list(application_ids)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)