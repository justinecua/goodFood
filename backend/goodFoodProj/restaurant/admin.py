from django.contrib import admin
from .models import (
    Restaurant,
    Restaurant_Branch,
    Operating_Hours,
    Category,
    Restaurant_Category,
)

admin.site.register(Restaurant)
admin.site.register(Restaurant_Branch)
admin.site.register(Operating_Hours)
admin.site.register(Category)
admin.site.register(Restaurant_Category)
