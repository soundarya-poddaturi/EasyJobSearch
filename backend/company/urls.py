from django.urls import path
from .views import (

    #bysuppa
    register_company,
    login_company,
    create_job,
    list_jobs,
    get_company_details,
    get_company_jobs
    # JobsByCompanyView,
)

urlpatterns = [
    #by suppa


    path('register_company/', register_company, name='register_company'),
    path('login_company/', login_company, name='login_company'),
    path('create_job/', create_job, name='create_job'),
    path('list_jobs/', list_jobs, name='list_jobs'),
    path('<int:company_id>/', get_company_details, name='get_company_details'),  # New endpoint
    # path('jobs/company/<str:company_name>/', JobsByCompanyView.as_view(), name='jobs-by-company'),
    path('jobs/', list_jobs, name='list_jobs'),  # This should handle the query parameter
     path('<int:company_id>/jobs/', get_company_jobs, name='get_company_jobs'),  # New endpoint for jobs
    # path('jobs/company/<str:company_name>/', JobsByCompanyView.as_view(), name='jobs_by_company'),
]