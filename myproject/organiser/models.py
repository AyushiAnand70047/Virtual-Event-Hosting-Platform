from django.db import models
from datetime import datetime

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def datetime(self):
        """Format the date and time for display"""
        from datetime import datetime
        combined = datetime.combine(self.date, self.time)
        return combined.strftime('%b %d, %Y, %I:%M %p')