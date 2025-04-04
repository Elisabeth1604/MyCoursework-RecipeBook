from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    UserProfileView,
    logout_view,
    RegisterView,
    ChangePasswordView,
    FavouriteRecipeListView,
    SubscriptionListView,
    SubscriptionActionsView,
    UserDetailView,
    SubscriptionStatusView
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Логин
    path('token/refresh/',  CustomTokenRefreshView.as_view(), name='token_refresh'),  # Обновление токена
    path('logout/', logout_view, name='logout'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'), # Получение пользователя по id для просмотра профиля
    path('register/', RegisterView.as_view(), name='register'),
    path('password/change/', ChangePasswordView.as_view(), name='change-password'),
    path('user/favourites/', FavouriteRecipeListView.as_view(), name='user-favourites'),
    path('user/favourites/<int:recipe_id>/', FavouriteRecipeListView.as_view(), name='remove-from-favourites'),
    path('subscriptions/', SubscriptionListView.as_view(), name='subscriptions-list'),
    path('subscriptions/<int:user_id>/', SubscriptionActionsView.as_view(), name='subscription-actions'),
    path('user/<int:user_id>/subscription-status/', SubscriptionStatusView.as_view(), name='subscription-status'),
]