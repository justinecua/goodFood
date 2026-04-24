from django.http import JsonResponse

def print_test(request):
    print("connected successfully")
    return JsonResponse({"message": "connected successfully"})