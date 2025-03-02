from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from .models import Event

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
        event_list.append({
            'id': event.id,
            'title': event.title,
            'description': event.description or '',
            'date': event.date.strftime('%Y-%m-%d'),
            'time': event.time.strftime('%H:%M'),
            'datetime': event.datetime
        })
    
    return JsonResponse({'events': event_list})

@csrf_exempt
def add_event(request):
    """API to add a new event"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract data from request
            title = data.get('title')
            description = data.get('description', '')
            date_str = data.get('date')
            time_str = data.get('time')
            
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
                time=time_obj
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Event added successfully!',
                'event': {
                    'id': event.id,
                    'title': event.title,
                    'description': event.description or '',
                    'date': event.date.strftime('%Y-%m-%d'),
                    'time': event.time.strftime('%H:%M'),
                    'datetime': event.datetime
                }
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
            
            # Parse JSON data
            data = json.loads(request.body)
            
            # Extract data from request
            title = data.get('title')
            description = data.get('description', '')
            date_str = data.get('date')
            time_str = data.get('time')
            
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
            event.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Event updated successfully!',
                'event': {
                    'id': event.id,
                    'title': event.title,
                    'description': event.description or '',
                    'date': event.date.strftime('%Y-%m-%d'),
                    'time': event.time.strftime('%H:%M'),
                    'datetime': event.datetime
                }
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