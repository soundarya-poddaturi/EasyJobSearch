from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.views import View
from .models import StudentUser, Address, Certificate, Experience, Project, Education
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
import json
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email,password)
        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if StudentUser.objects.filter(email=email).exists():
            return JsonResponse({'message': 'User already exists'}, status=400)
        print("next\n\n")
        hashed_password = make_password(password)
        user = StudentUser.objects.create(email=email, password=hashed_password)
        user.save()
        return JsonResponse({'message': 'User registered successfully'}, status=201)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email,password)
        # Check if both email and password are provided
        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if the user with the provided email exists
            user = StudentUser.objects.get(email=email)
        except StudentUser.DoesNotExist:
            return JsonResponse({'error': 'Invalid email or password.'}, status=401)

        # Verify the password using check_password
        if check_password(password, user.password):
            # If authentication is successful, return success message
            return JsonResponse({
                'message': 'Login successful',
                'user': {
                    'email': user.email
                }
            }, status=200)
        else:
            return JsonResponse({'error': 'Invalid email or password.'}, status=401)

@csrf_exempt
def get_user_profile(request, email):
    user = get_object_or_404(StudentUser, email=email)
    return JsonResponse({
        'email': user.email,
        'address': list(user.address.values()), 
        'certificates': list(user.certificates.values()), 
        'experiences': list(user.experiences.values()),
        'projects': list(user.projects.values()),
        'education': list(user.education.values()),
    })

@csrf_exempt
def delete_user_profile(request, email):
    user = get_object_or_404(StudentUser, email=email)
    user.delete()
    return JsonResponse({'message': 'User profile deleted successfully'}, status=200)

@csrf_exempt
def update_address(request, email):
    user_profile = get_object_or_404(StudentUser, email=email)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        # Using update_or_create with defaults
        print(data)
        address, created = Address.objects.update_or_create(
            user_profile=user_profile,
            address_line_1=data['address_line_1'],  # This is used for lookup.
            defaults={
                'city': data.get('city', ''),
                'state': data.get('state', ''),
                'pincode': data.get('pincode', ''),
            }
        )
        
        if created:
            return JsonResponse({'message': 'Address created successfully'}, status=201)
        else:
            return JsonResponse({'message': 'Address updated successfully'}, status=200)

    return HttpResponse(status=405)  # Method not allowed for other HTTP methods
    

@csrf_exempt
def manage_certificate(request, email):
    user_profile = get_object_or_404(StudentUser, email=email)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        certificate = Certificate.objects.create(
            user_profile=user_profile,
            title=data['title'],
            description=data['description'],
            file_link=data['file_link']
        )
        return JsonResponse({'message': 'Certificate added successfully', 'id': certificate.id})
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        certificate = get_object_or_404(Certificate, id=data['id'])
        certificate.title = data.get('title', certificate.title)
        certificate.description = data.get('description', certificate.description)
        certificate.file_link = data.get('file_link', certificate.file_link)
        certificate.save()
        return JsonResponse({'message': 'Certificate updated successfully'})

    elif request.method == 'DELETE':
        data = json.loads(request.body)
        certificate = get_object_or_404(Certificate, id=data['id'])
        certificate.delete()
        return JsonResponse({'message': 'Certificate deleted successfully'})
@csrf_exempt
def manage_experience(request, email):
    user_profile = get_object_or_404(StudentUser, email=email)
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        experience = Experience.objects.create(
            user_profile=user_profile,
            employer=data['employer'],
            location=data['location'],
            role_title=data['role_title'],
            duration_from_year=data['duration_from_year'],
            duration_from_month=data['duration_from_month'],
            duration_to_year=data['duration_to_year'],
            duration_to_month=data['duration_to_month'],
            description=data['description'],
            skills=data['skills']
        )
        return JsonResponse({'message': 'Experience added successfully', 'id': experience.id})
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        experience = get_object_or_404(Experience, id=data['id'])
        experience.employer = data.get('employer', experience.employer)
        experience.location = data.get('location', experience.location)
        experience.role_title = data.get('role_title', experience.role_title)
        experience.duration_from_year = data.get('duration_from_year', experience.duration_from_year)
        experience.duration_from_month = data.get('duration_from_month', experience.duration_from_month)
        experience.duration_to_year = data.get('duration_to_year', experience.duration_to_year)
        experience.duration_to_month = data.get('duration_to_month', experience.duration_to_month)
        experience.description = data.get('description', experience.description)
        experience.skills = data.get('skills', experience.skills)
        experience.save()
        return JsonResponse({'message': 'Experience updated successfully'})
    elif request.method == 'DELETE':
        data = json.loads(request.body)
        experience = get_object_or_404(Experience, id=data['id'])
        experience.delete()
        return JsonResponse({'message': 'Experience deleted successfully'})
    return HttpResponse(status=405)

@csrf_exempt
def manage_project(request, email):
    user_profile = get_object_or_404(StudentUser, email=email)
    if request.method == 'POST':
        data = json.loads(request.body)
        project = Project.objects.create(
            user_profile=user_profile,
            title=data['title'],
            duration_from_year=data['duration_from_year'],
            duration_from_month=data['duration_from_month'],
            duration_to_year=data['duration_to_year'],
            duration_to_month=data['duration_to_month'],
            description=data['description'],
            skills=data['skills'],
            link=data.get('link')  # Optional field
        )
        return JsonResponse({'message': 'Project added successfully', 'id': project.id})

    elif request.method == 'PUT':
        data = json.loads(request.body)
        project = get_object_or_404(Project, id=data['id'])
        project.title = data.get('title', project.title)
        project.duration_from_year = data.get('duration_from_year', project.duration_from_year)
        project.duration_from_month = data.get('duration_from_month', project.duration_from_month)
        project.duration_to_year = data.get('duration_to_year', project.duration_to_year)
        project.duration_to_month = data.get('duration_to_month', project.duration_to_month)
        project.description = data.get('description', project.description)
        project.skills = data.get('skills', project.skills)
        project.link = data.get('link', project.link)
        project.save()
        return JsonResponse({'message': 'Project updated successfully'})

    elif request.method == 'DELETE':
        data = json.loads(request.body)
        project = get_object_or_404(Project, id=data['id'])
        project.delete()
        return JsonResponse({'message': 'Project deleted successfully'})

@csrf_exempt
def manage_education(request, email):
    user_profile = get_object_or_404(StudentUser, email=email)
    if request.method == 'POST':
        data = json.loads(request.body)
        education = Education.objects.create(
            user_profile=user_profile,
            institute_name=data['institute_name'],
            duration_from_year=data['duration_from_year'],
            duration_from_month=data['duration_from_month'],
            duration_to_year=data['duration_to_year'],
            duration_to_month=data['duration_to_month'],
            marks_or_grade=data['marks_or_grade']
        )
        return JsonResponse({'message': 'Education added successfully', 'id': education.id})

    elif request.method == 'PUT':
        data = json.loads(request.body)
        education = get_object_or_404(Education, id=data['id'])
        education.institute_name = data.get('institute_name', education.institute_name)
        education.duration_from_year = data.get('duration_from_year', education.duration_from_year)
        education.duration_from_month = data.get('duration_from_month', education.duration_from_month)
        education.duration_to_year = data.get('duration_to_year', education.duration_to_year)
        education.duration_to_month = data.get('duration_to_month', education.duration_to_month)
        education.marks_or_grade = data.get('marks_or_grade', education.marks_or_grade)
        education.save()
        return JsonResponse({'message': 'Education updated successfully'})

    elif request.method == 'DELETE':
        data = json.loads(request.body)
        education = get_object_or_404(Education, id=data['id'])
        education.delete()
        return JsonResponse({'message': 'Education deleted successfully'})