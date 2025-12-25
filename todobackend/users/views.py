from django.conf import settings
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, CustomUserSerializer

# 1. User Registration
class RegisterView(generics.CreateAPIView):
    """
    Endpoint to register a new user.
    Permissions: AllowAny (Anyone can register)
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# 2. Login (Customized to use HttpOnly Cookies)
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom view to handle Login.
    Instead of returning tokens in the JSON body, it sets them as HttpOnly Cookies.
    This prevents XSS attacks from stealing the tokens.
    """
    def post(self, request, *args, **kwargs):
        # execute the standard logic first
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            # Set Access Token Cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                # max_age could be added here matching settings.ACCESS_TOKEN_LIFETIME
            )

            # Set Refresh Token Cookie
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True, # Always True for security
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            )

            # Remove tokens from the JSON response for extra security
            del response.data['access']
            del response.data['refresh']

        return response


# 3. Token Refresh (Customized to use Cookies)
class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom view to handle Token Refresh.
    It reads the refresh token from cookies (if not provided in body)
    and sets the new access token in the cookie.
    """
    def post(self, request, *args, **kwargs):
        # If the client uses withCredentials=True, the refresh token is in the cookies.
        # We might need to manually inject it into the data if SimpleJWT doesn't find it.
        if 'refresh' not in request.data and 'refresh_token' in request.COOKIES:
            request.data['refresh'] = request.COOKIES['refresh_token']

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            # Set the new Access Token in the cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            )

            # Note: If ROTATE_REFRESH_TOKENS is True, we should also update the refresh cookie here.
            if 'refresh' in response.data:
                refresh_token = response.data.get('refresh')
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    httponly=True,
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                )

            # Clean up JSON response
            if 'access' in response.data:
                del response.data['access']
            if 'refresh' in response.data:
                del response.data['refresh']

        return response


# 4. User Detail (Me)
class UserDetailView(views.APIView):
    """
    Endpoint to retrieve the current authenticated user's details.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # request.user is automatically populated by JWTAuthentication
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# 5. Logout
class LogoutView(views.APIView):
    """
    Endpoint to log out.
    It basically destroys the cookies by deleting them.
    """
    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        
        # Delete both cookies
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie('refresh_token')
        
        return response