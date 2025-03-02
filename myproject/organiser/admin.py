from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'time', 'created_at')
    list_filter = ('date',)
    search_fields = ('title', 'description')
    date_hierarchy = 'date'

admin.site.register(Event, EventAdmin)