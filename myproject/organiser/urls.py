from django.urls import path
from . import views

urlpatterns = [
    path('admin-home/', views.home,name='admin-home'),
    path('live-stream/',views.livestream),
]