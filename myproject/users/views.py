from django.shortcuts import render
from organiser.models import Event
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def home(request):
    events = Event.objects.all()
    return render(request,'user-home.html',{'events':events})
