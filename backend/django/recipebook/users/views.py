from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics
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