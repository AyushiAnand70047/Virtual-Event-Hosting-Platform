# Update your models.py first to include image field
"""
from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    
    @property
    def datetime(self):
        return f"{self.date.strftime('%B %d, %Y')} at {self.time.strftime('%I:%M %p')}"
"""

# Updated views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from .models import Event
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    return render(request, 'admin-home.html')

def livestream(request):
    return render(request, 'live-streaming.html')

# API Endpoints for Event CRUD operations
@csrf_exempt
def get_events(request):
    """API to get all events"""
    events = Event.objects.all().order_by('date', 'time')
    
    event_list = []
    for event in events:
        event_dict = {
            'id': event.id,
            'title': event.title,
            'description': event.description or '',
            'date': event.date.strftime('%Y-%m-%d'),
            'time': event.time.strftime('%H:%M'),
            'datetime': event.datetime,
            'image_url': event.image.url if event.image else None
        }
        event_list.append(event_dict)
    
    return JsonResponse({'events': event_list})

@csrf_exempt
def add_event(request):
    """API to add a new event"""
    if request.method == 'POST':
        try:
            # Extract data from request
            title = request.POST.get('title')
            description = request.POST.get('description', '')
            date_str = request.POST.get('date')
            time_str = request.POST.get('time')
            image = request.FILES.get('image')
            
            # Validate required fields
            if not title or not date_str or not time_str:
                return JsonResponse({
                    'success': False, 
                    'message': 'Missing required fields'
                })
            
            # Parse date and time
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            time_obj = datetime.strptime(time_str, '%H:%M').time()
            
            # Create new event
            event = Event.objects.create(
                title=title,
                description=description,
                date=date_obj,
                time=time_obj,
                image=image  # This will be None if no image was uploaded
            )
            
            # Prepare response
            event_dict = {
                'id': event.id,
                'title': event.title,
                'description': event.description or '',
                'date': event.date.strftime('%Y-%m-%d'),
                'time': event.time.strftime('%H:%M'),
                'datetime': event.datetime,
                'image_url': event.image.url if event.image else None
            }
            
            return JsonResponse({
                'success': True,
                'message': 'Event added successfully!',
                'event': event_dict
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({
        'success': False, 
        'message': 'Invalid request method'
    })

@csrf_exempt
def update_event(request, event_id):
    """API to update an existing event"""
    if request.method == 'POST':
        try:
            # Get the event or return 404
            event = get_object_or_404(Event, id=event_id)
            
            # Extract data from request
            title = request.POST.get('title')
            description = request.POST.get('description', '')
            date_str = request.POST.get('date')
            time_str = request.POST.get('time')
            image = request.FILES.get('image')
            
            # Validate required fields
            if not title or not date_str or not time_str:
                return JsonResponse({
                    'success': False, 
                    'message': 'Missing required fields'
                })
            
            # Parse date and time
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            time_obj = datetime.strptime(time_str, '%H:%M').time()
            
            # Update event
            event.title = title
            event.description = description
            event.date = date_obj
            event.time = time_obj
            
            # Only update image if a new one was provided
            if image:
                event.image = image
                
            event.save()
            
            # Prepare response
            event_dict = {
                'id': event.id,
                'title': event.title,
                'description': event.description or '',
                'date': event.date.strftime('%Y-%m-%d'),
                'time': event.time.strftime('%H:%M'),
                'datetime': event.datetime,
                'image_url': event.image.url if event.image else None
            }
            
            return JsonResponse({
                'success': True,
                'message': 'Event updated successfully!',
                'event': event_dict
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({
        'success': False, 
        'message': 'Invalid request method'
    })
    
@csrf_exempt
def delete_event(request, event_id):
    """API to delete an event"""
    if request.method == 'POST':
        try:
            # Get the event or return 404
            event = get_object_or_404(Event, id=event_id)
            
            # Delete the event
            event.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Event deleted successfully!'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({
        'success': False, 
        'message': 'Invalid request method'
    })