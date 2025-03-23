from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    UserProfileView,
    logout_view,
    RegisterView,
    ChangePasswordView,
    FavouriteRecipeListView
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Логин
    path('token/refresh/',  CustomTokenRefreshView.as_view(), name='token_refresh'),  # Обновление токена
    path('logout/', logout_view, name='logout'),
    path('user/', UserProfileView.as_view(), name='user-profile'), # Для получения пользователя
    path('register/', RegisterView.as_view(), name='register'),
    path('password/change/', ChangePasswordView.as_view(), name='change-password'),
    path('user/favourites/', FavouriteRecipeListView.as_view(), name='user-favourites'),
    path('user/favourites/<int:recipe_id>/', FavouriteRecipeListView.as_view(), name='remove-from-favourites'),

]