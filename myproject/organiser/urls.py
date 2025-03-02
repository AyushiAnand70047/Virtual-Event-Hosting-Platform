from django.urls import path
from . import views

urlpatterns = [
    path('admin-home/', views.home, name='admin-home'),
    path('live-stream/', views.livestream, name='livestream'),
    # API endpoints
    path('api/events/', views.get_events, name='get_events'),
    path('api/events/add/', views.add_event, name='add_event'),
    path('api/events/update/<int:event_id>/', views.update_event, name='update_event'),
    path('api/events/delete/<int:event_id>/', views.delete_event, name='delete_event'),
]