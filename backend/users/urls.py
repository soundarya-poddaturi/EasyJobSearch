from django.urls import path
from .views import (
    RegisterView, 
    LoginView,  
    get_user_profile, 
    update_address, 
    delete_user_profile, 
    manage_certificate, 
    manage_experience,
    manage_project,
    manage_education
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/<int:id>/', get_user_profile, name='get_user_profile'),
    path('profile/delete/<int:id>/', delete_user_profile, name='delete_user_profile'),
    path('address/manage/<int:id>/', update_address, name='update_user_profile'),
    path('certificate/manage/<int:id>/', manage_certificate, name='manage_certificate'),
    path('experience/manage/<int:id>/', manage_experience, name='manage_experience'),
    path('project/manage/<int:id>/', manage_project, name='manage_project'),
    path('education/manage/<int:id>/', manage_education, name='manage_education'),
]
