from django.http import JsonResponse
from rest_framework import status


class BlockedUserMiddleware:
    """
    Middleware to check if user is blocked and prevent them from creating/editing content.
    """
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if request.user.is_authenticated and request.user.is_blocked:
            if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
                if not request.path.startswith("/admin/") and not request.path.startswith("/django_static/"):
                    return JsonResponse(
                        {"error": "Your account has been blocked. You cannot perform this action."},
                        status=status.HTTP_403_FORBIDDEN
                    )
        
        response = self.get_response(request)
        return response
