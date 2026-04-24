from django.db import models

class AccountType(models.Model):
    acc_type_id = models.AutoField(primary_key=True)
    account_type = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.account_type

class Account(models.Model):
    account_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=50, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    email_address = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=500)
    mobile_number = models.CharField(max_length=20, blank=True, null=True)
    account_profile_photo = models.ImageField(upload_to='account_photos/', blank=True, null=True)
    account_type = models.ForeignKey(AccountType, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"