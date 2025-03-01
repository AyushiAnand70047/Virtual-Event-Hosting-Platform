from django.urls import path
from . import views

urlpatterns = [
    path('user-home/', views.home,name='user-home'),
]