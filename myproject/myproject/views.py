from django.contrib.auth import logout as auth_logout
from django.shortcuts import redirect

def logout(request):
    auth_logout(request)  # This will log out and clear session data
    return redirect('login')  # Redirect to login page after logout
