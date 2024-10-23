from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile, Experience, Certificate,Project,Education
class RegisterView(APIView):
    # Allow all users (including unauthenticated) to access this view
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check if the email or password is missing
        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if a user with the same email already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        user = User.objects.create(
            username=email,  # Since Django's User model uses 'username', we set it as the email
            email=email,
            password=make_password(password)  # Hash the password before saving
        )
        user.save()

        return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
# views.py


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(request, username=email, password=password)
        if user is not None:
            return Response({'message': 'Login successful!'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import UserProfile, Certificate, Experience
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User

def get_user_profile(request, email):
    print(email)
    user = get_object_or_404(User, email=email)
    print(user,"hdh")
    user_profile = get_object_or_404(UserProfile, user=user)
    print(user_profile)
    certificates = list(user_profile.certificates.values())
    experiences = list(user_profile.experiences.values())
    projects = list(user_profile.projects.values())  # Corrected from certificates to projects
    print(projects)
    education = list(user_profile.education.values())
    data = {
        'address_line_1': user_profile.address_line_1,
        'city': user_profile.city,
        'state': user_profile.state,
        'pincode': user_profile.pincode,
        'certificates': certificates,
        'experiences': experiences,
        'projects':projects,
        'education':education,
       
    }
    # print(data)
    return JsonResponse(data)


# Update User Profile based on email
@csrf_exempt
def update_address(request, email):
    if request.method == 'PUT':
        data = json.loads(request.body)
        user = get_object_or_404(User, email=email)
        user_profile = get_object_or_404(UserProfile, user=user)
        
        user_profile.address_line_1 = data.get('address_line_1', user_profile.address_line_1)
        user_profile.city = data.get('city', user_profile.city)
        user_profile.state = data.get('state', user_profile.state)
        user_profile.pincode = data.get('pincode', user_profile.pincode)
        user_profile.save()
        
        return JsonResponse({'message': 'UserProfile updated successfully'})

# Delete User Profile based on email
@csrf_exempt
def delete_user_profile(request, email):
    if request.method == 'DELETE':
        user = get_object_or_404(User, email=email)
        user_profile = get_object_or_404(UserProfile, user=user)
        user_profile.delete()
        return JsonResponse({'message': 'UserProfile deleted successfully'})

# Add, Update, Delete Certificate based on user email
@csrf_exempt
def manage_certificate(request, email):
    user = get_object_or_404(User, email=email)
    user_profile = get_object_or_404(UserProfile, user=user)
    
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

# Add, Update, Delete Experience based on user email
@csrf_exempt
def manage_experience(request, email):
    user = get_object_or_404(User, email=email)
    user_profile = get_object_or_404(UserProfile, user=user)
    
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

@csrf_exempt
def manage_project(request, email):
    user = get_object_or_404(User, email=email)
    user_profile = get_object_or_404(UserProfile, user=user)

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


# Add, Update, Delete Education based on user email
@csrf_exempt
def manage_education(request, email):
    user = get_object_or_404(User, email=email)
    user_profile = get_object_or_404(UserProfile, user=user)

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
