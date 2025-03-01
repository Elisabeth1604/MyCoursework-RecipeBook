from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    UserProfileView,
    logout_view,
    RegisterView
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Логин
    path('token/refresh/',  CustomTokenRefreshView.as_view(), name='token_refresh'),  # Обновление токена
    path('token/logout/', logout_view, name='token_logout'),
    path('user/', UserProfileView.as_view(), name='user-profile'), # Для получения пользователя
    path('register/', RegisterView.as_view(), name='register'),
]