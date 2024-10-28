from django.views.decorators.http import require_http_methods
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from .models import StudentUser, Address, Certificate, Experience, Project, Education
from django.contrib.auth.hashers import make_password,check_password
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import  status
from django.views.decorators.csrf import csrf_exempt
import json


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Capture form data from request
        email = request.data.get('email')
        password = request.data.get('password')
        re_enter_password = request.data.get('reEnterPassword')
        first_name = request.data.get('firstName')
        middle_name = request.data.get('middleName', '')  # Optional
        last_name = request.data.get('lastName')
        gender = request.data.get('gender', '')  # Optional
        mobile = request.data.get('mobile', '')  # Optional

        # Validate required fields
        if not email or not password or not first_name or not last_name:
            return Response({'error': 'Email, password, first name, and last name are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure password match
        if password != re_enter_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user with this email already exists
        if StudentUser.objects.filter(email=email).exists():
            return Response({'error': 'User already exists with this email address.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        hashed_password = make_password(password)
        user = StudentUser.objects.create(
            email=email,
            password=hashed_password,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            gender=gender,
            mobile=mobile
        )
        user.save()

        # Include the ID of the created user in the response
        return Response({'message': 'User registered successfully', 'userId': user.id}, status=status.HTTP_201_CREATED)



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
                    'id':user.id,
                    'email': user.email

                }
            }, status=200)
        else:
            return JsonResponse({'error': 'Invalid email or password.'}, status=401)




@csrf_exempt
@require_http_methods(["GET", "PUT"])
def user_profile(request, id):
    user = get_object_or_404(StudentUser, id=id)

    if request.method == "GET":
    # Create a dictionary for personal information
        personal_info = {
            'email': user.email,
            'first_name': user.first_name,
            'middle_name': user.middle_name,
            'last_name': user.last_name,
            'gender': user.gender,
            'mobile': user.mobile,
            'address': list(user.address.values()) if hasattr(user, 'address') else []  # Optional address
        }

        # Collect additional user-related data
        additional_data = {
            'certificates': list(user.certificates.values()) if hasattr(user, 'certificates') else [],
            'experiences': list(user.experiences.values()) if hasattr(user, 'experiences') else [],
            'projects': list(user.projects.values()) if hasattr(user, 'projects') else [],
            'education': list(user.education.values()) if hasattr(user, 'education') else [],
            'resume': {
            'id': user.resume.id,
            'pdf_file': user.resume.pdf_file.url  # Assuming pdf_file is a FileField in Resume model
        } if hasattr(user, 'resume') else None  # Checks if resume exists
        }

        # Combine personal information with additional data
        user_data = {
            'personal_info': personal_info,
            **additional_data  # Unpacking additional data into the user_data dictionary
        }

        return JsonResponse(user_data)


    elif request.method == "PUT":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)

            # Update fields while preventing email from being changed
            user.first_name = data.get('first_name', user.first_name)
            user.middle_name = data.get('middle_name', user.middle_name)
            user.last_name = data.get('last_name', user.last_name)
            user.gender = data.get('gender', user.gender)
            user.mobile = data.get('mobile', user.mobile)

            # Save the updated user object
            user.save()

            # Prepare the response data
            updated_info = {
                'email': user.email,
                'first_name': user.first_name,
                'middle_name': user.middle_name,
                'last_name': user.last_name,
                'gender': user.gender,
                'mobile': user.mobile,
                'address': list(user.address.values()) if hasattr(user, 'address') else []
            }

            return JsonResponse({'personal_info': updated_info}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

@csrf_exempt
def get_user_profile(request, id):
    print(id)
    user = get_object_or_404(StudentUser, id=id)
    
    # Create a dictionary for personal information
    personal_info = {
        'email': user.email,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'last_name': user.last_name,
        'gender': user.gender,
        'mobile': user.mobile,
        'address': list(user.address.values()) if hasattr(user, 'address') else []  # Optional address
    }
    
    # Collect additional user-related data with current status logic
    additional_data = {
        'certificates': list(user.certificates.values()) if hasattr(user, 'certificates') else [],
        'experiences': [
            {
                'id': exp.id,
                'employer': exp.employer,
                'role_title': exp.role_title,
                'duration_from': exp.duration_from,
                'duration_to': "Present" if exp.current else exp.duration_to,
                'description': exp.description,
                'skills': exp.skills
            } for exp in user.experiences.all()
        ],
        'projects': list(user.projects.values()) if hasattr(user, 'projects') else [],
        'education': [
            {
                'id': edu.id,
                'institute_name': edu.institute_name,
                'duration_from': edu.duration_from,
                'duration_to': "Present" if edu.current else edu.duration_to,
                'marks_or_grade': edu.marks_or_grade
            } for edu in user.education.all()
        ],
    }

    # Combine personal information with additional data
    user_data = {
        'personal_info': personal_info,
        **additional_data  # Unpacking additional data into the user_data dictionary
    }

    return JsonResponse(user_data)



@csrf_exempt
def delete_user_profile(request, id):
    user = get_object_or_404(StudentUser, id=id)
    user.delete()
    return JsonResponse({'message': 'User profile deleted successfully'}, status=200)


@csrf_exempt
def update_address(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        # Update or create based solely on user_profile
        address, created = Address.objects.update_or_create(
            user_profile=user_profile,
            defaults={  # Set all address fields here as defaults
                'address_line_1': data.get('address_line_1', ''),
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
def manage_certificate(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)
    
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
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json

from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudentUser, Experience, Project, Education
import json
from datetime import datetime

# Helper function to parse dates
def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d') if date_str else None
    except ValueError:
        return None

# ------------------------- Manage Experience ------------------------- #
@csrf_exempt
def manage_experience(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)

    try:
        data = json.loads(request.body)

        if request.method == 'POST':
            employer = data.get('employer')
            if not employer:
                return JsonResponse({'error': 'Employer is required'}, status=400)
            
            role_title = data.get('role_title')
            if not role_title:
                return JsonResponse({'error': 'Role title is required'}, status=400)

            duration_from = parse_date(data.get('duration_from'))
            duration_to = parse_date(data.get('duration_to'))
            current = duration_to == datetime(1800, 1, 1)  # Check if ongoing
            experience = Experience.objects.create(
                user_profile=user_profile,
                employer=employer,
                location=data.get('location', ''),
                role_title=role_title,
                duration_from=duration_from,
                duration_to=duration_to,
                current=current,
                description=data.get('description', ''),
                skills=data.get('skills', '')
            )
            return JsonResponse({'message': 'Experience added successfully', 'id': experience.id})

        elif request.method == 'PUT':
            experience = get_object_or_404(Experience, id=data['id'])

            experience.employer = data.get('employer', experience.employer)
            experience.location = data.get('location', experience.location)
            experience.role_title = data.get('role_title', experience.role_title)
            experience.duration_from = parse_date(data.get('duration_from')) or experience.duration_from
            experience.current = experience.duration_to == datetime(1800, 1, 1)  # Update current status
            experience.duration_to = parse_date(data.get('duration_to')) or experience.duration_to
            experience.description = data.get('description', experience.description)
            experience.skills = data.get('skills', experience.skills)
            experience.save()
            return JsonResponse({'message': 'Experience updated successfully'})

        elif request.method == 'DELETE':
            experience = get_object_or_404(Experience, id=data['id'])
            experience.delete()
            return JsonResponse({'message': 'Experience deleted successfully'})

        return HttpResponse(status=405)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Experience.DoesNotExist:
        return JsonResponse({'error': 'Experience record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ------------------------- Manage Project ------------------------- #
@csrf_exempt
def manage_project(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)

    try:
        data = json.loads(request.body)

        if request.method == 'POST':
            title = data.get('title')
            if not title:
                return JsonResponse({'error': 'Title is required'}, status=400)

            duration_from = parse_date(data.get('duration_from'))
            duration_to = parse_date(data.get('duration_to'))
            current = duration_to == datetime(1800, 1, 1)  # Check if ongoing
            project = Project.objects.create(
                user_profile=user_profile,
                title=title,
                duration_from=duration_from,
                duration_to=duration_to,
                description=data.get('description', ''),
                skills=data.get('skills', ''),
                link=data.get('link', ''),
                current=current
            )

            return JsonResponse({'message': 'Project added successfully', 'id': project.id})

        elif request.method == 'PUT':
            project = get_object_or_404(Project, id=data['id'])
            project.title = data.get('title', project.title)
            project.duration_from = parse_date(data.get('duration_from')) or project.duration_from
            project.duration_to = parse_date(data.get('duration_to')) or project.duration_to
            project.description = data.get('description', project.description)
            project.current = project.duration_to == datetime(1800, 1, 1)  # Update current status
            project.skills = data.get('skills', project.skills)
            project.link = data.get('link', project.link)
            project.save()
            return JsonResponse({'message': 'Project updated successfully'})

        elif request.method == 'DELETE':
            project = get_object_or_404(Project, id=data['id'])
            project.delete()
            return JsonResponse({'message': 'Project deleted successfully'})

        return HttpResponse(status=405)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ------------------------- Manage Education ------------------------- #
@csrf_exempt
def manage_education(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)

    try:
        data = json.loads(request.body)

        if request.method == 'POST':
            institute_name = data.get('institute_name')
            if not institute_name:
                return JsonResponse({'error': 'Institute name is required'}, status=400)

            duration_from = parse_date(data.get('duration_from'))
            duration_to = parse_date(data.get('duration_to'))

            education = Education.objects.create(
                user_profile=user_profile,
                institute_name=institute_name,
                duration_from=duration_from,
                duration_to=duration_to,
                marks_or_grade=data.get('marks_or_grade', '')
            )
            return JsonResponse({'message': 'Education added successfully', 'id': education.id}, status=201)

        elif request.method == 'PUT':
            education = get_object_or_404(Education, id=data['id'])
            education.institute_name = data.get('institute_name', education.institute_name)
            education.duration_from = parse_date(data.get('duration_from')) or education.duration_from
            education.duration_to = parse_date(data.get('duration_to')) or education.duration_to
            education.marks_or_grade = data.get('marks_or_grade', education.marks_or_grade)
            education.save()
            return JsonResponse({'message': 'Education updated successfully', 'id': education.id}, status=200)

        elif request.method == 'DELETE':
            education = get_object_or_404(Education, id=data['id'])
            education.delete()
            return JsonResponse({'message': 'Education deleted successfully', 'id': data['id']}, status=200)

        return HttpResponse(status=405)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Education.DoesNotExist:
        return JsonResponse({'error': 'Education record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Resume, StudentUser

class ResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        print(student_id,"in resume get")
        try:
            user = StudentUser.objects.get(id=student_id)
            resume = Resume.objects.get(user_profile=user)
            return Response({
                'user_profile': user.id,
                'pdf_file': resume.pdf_file.url if resume.pdf_file else None
            }, status=status.HTTP_200_OK)
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, student_id):
        print(student_id,"in resume post")
        try:
            user = StudentUser.objects.get(id=student_id)
            if Resume.objects.filter(user_profile=user).exists():
                return Response({'error': 'Resume already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            pdf_file = request.FILES.get('pdf_file')
            resume = Resume.objects.create(user_profile=user, pdf_file=pdf_file)
            return Response({
                'message': 'Resume created successfully',
                'user_profile': user.id,
                'pdf_file': resume.pdf_file.url if resume.pdf_file else None
            }, status=status.HTTP_201_CREATED)
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, student_id):
        try:
            user = StudentUser.objects.get(id=student_id)
            resume = Resume.objects.get(user_profile=user)
            pdf_file = request.FILES.get('pdf_file')
            if pdf_file:
                resume.pdf_file = pdf_file
                resume.save()
            return Response({
                'message': 'Resume updated successfully',
                'user_profile': user.id,
                'pdf_file': resume.pdf_file.url if resume.pdf_file else None
            }, status=status.HTTP_200_OK)
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, student_id):
        try:
            user = StudentUser.objects.get(id=student_id)
            resume = Resume.objects.get(user_profile=user)
            resume.delete()
            return Response({'message': 'Resume deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
