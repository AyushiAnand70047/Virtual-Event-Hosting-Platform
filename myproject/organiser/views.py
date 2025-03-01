from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,'admin-home.html')

def livestream(request):
    return render(request,'live-streaming.html')