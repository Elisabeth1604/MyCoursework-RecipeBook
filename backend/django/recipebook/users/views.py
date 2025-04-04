from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer, SubscriptionSerializer
from .models import Favourite, Subscription
from recipes.serializers import RecipeSerializer
from recipes.models import Recipe
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.http import JsonResponse

from django.conf import settings

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Только для авторизованных пользователей

    def get(self, request):
        serializer = UserSerializer(request.user)  # Сериализуем данные пользователя
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)  # Позволяет обновлять частично
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        user = get_object_or_404(get_user_model(), pk=pk)
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)  # Получаем стандартный ответ
        refresh_token = response.data.pop('refresh', None)  # Удаляем refresh из JSON
        access_token = response.data['access']  # Достаем access

        # Устанавливаем refresh-токен в HttpOnly Cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite="Lax",
            domain="localhost",
            secure=settings.DEBUG is False,
            max_age=60 * 60 * 24 * 7  # 7 дней
        )

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"detail": "Refresh-токен отсутствует"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({"access": access_token})
        except Exception:
            return Response({"detail": "Refresh-токен недействителен"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def logout_view(request):
    """Выход из системы: удаление refresh-токена из Cookie"""
    response = Response({"detail": "Вы вышли из системы"}, status=status.HTTP_200_OK)
    response.delete_cookie("refresh_token")  # Удаляем refresh-токен из Cookie
    return response

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            print("Request data:", request.data)  # Логируем данные запроса
            serializer = ChangePasswordSerializer(data=request.data)
            if serializer.is_valid():
                user = request.user
                print("Validated data:", serializer.validated_data)
                # Проверка старого пароля
                if not user.check_password(serializer.validated_data['old_password']):
                    return Response(
                        {"old_password": "Неверный пароль"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Установка нового пароля
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({"detail": "Пароль успешно изменен!"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FavouriteRecipeListView(generics.ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['recipe_title', 'recipeingredient__ingredient__ingredient_name', 'category__category_name']

    def get_queryset(self):
        # Получаем избранные рецепты текущего пользователя
        favourite_recipes = Favourite.objects.filter(user=self.request.user).values_list('recipe_id', flat=True)

        # Создаем базовый queryset с префетчами для оптимизации
        queryset = Recipe.objects.filter(id__in=favourite_recipes).prefetch_related(
            'recipeingredient_set__ingredient',
            'category'
        ).distinct()

        return queryset

    def delete(self, request, recipe_id):
        try:
            fav = Favourite.objects.get(user=request.user, recipe_id=recipe_id)
            fav.delete()
            return Response({"detail": "Рецепт удалён из избранного"}, status=status.HTTP_204_NO_CONTENT)
        except Favourite.DoesNotExist:
            return Response({"detail": "Рецепт не найден в избранном"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        recipe_id = request.data.get('recipe_id')
        if not recipe_id:
            return Response({'detail': 'Не передан ID рецепта'}, status=400)

        # Проверим, что рецепт существует
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'detail': 'Рецепт не найден'}, status=404)

        # Добавим в избранное, если его ещё там нет
        favourite, created = Favourite.objects.get_or_create(user=request.user, recipe=recipe)
        if not created:
            return Response({'detail': 'Рецепт уже в избранном'}, status=200)

        return Response({'detail': 'Добавлен в избранное'}, status=201)


class SubscriptionListView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(subscriber=self.request.user)

    def perform_create(self, serializer):
        serializer.save(subscriber=self.request.user)

class SubscriptionActionsView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        target_user = get_object_or_404(User, pk=user_id)
        if request.user == target_user:
            return Response({'detail': 'Нельзя подписаться на самого себя'}, status=400)

        # Проверим, есть ли уже подписка
        if Subscription.objects.filter(subscriber=request.user, target=target_user).exists():
            return Response({'detail': 'Вы уже подписаны'}, status=400)

        Subscription.objects.create(subscriber=request.user, target=target_user)
        return Response({'detail': 'Подписка оформлена'}, status=201)

    def delete(self, request, *args, **kwargs):
        try:
            target_user = User.objects.get(pk=self.kwargs['user_id'])
            subscription = Subscription.objects.get(
                subscriber=request.user,
                target=target_user
            )
            subscription.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)
        except Subscription.DoesNotExist:
            return Response({"detail": "Подписка не найдена"}, status=status.HTTP_404_NOT_FOUND)


class SubscriptionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            target_user = get_user_model().objects.get(pk=user_id)
            is_subscribed = Subscription.objects.filter(
                subscriber=request.user,
                target=target_user
            ).exists()

            return Response({
                'user_id': user_id,
                'is_subscribed': is_subscribed
            }, status=status.HTTP_200_OK)

        except get_user_model().DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )