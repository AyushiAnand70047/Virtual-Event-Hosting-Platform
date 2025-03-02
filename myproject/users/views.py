from django.shortcuts import render
from organiser.models import Event


# Create your views here.
def home(request):
    events = Event.objects.all()
    return render(request,'user-home.html',{'events':events})