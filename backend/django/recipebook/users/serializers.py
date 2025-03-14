from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
import os
from django.conf import settings

from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar', 'date_joined']
        read_only_fields = ['date_joined']

    def get_avatar(self, obj):
        """Возвращает путь к файлу внутри папки `media/` (без домена)"""
        if obj.avatar:
            return obj.avatar.url  # Вернет "media/avatars/user5.jpg"
        return None

    # Обновить данные пользователя
    def update(self, instance, validated_data):
        try:
            # Если в запросе передано новое фото, обновляем его
            if 'avatar' in validated_data:
                # Удаляем старое фото, если оно существует
                if instance.avatar:
                    old_avatar_path = os.path.join(settings.MEDIA_ROOT, instance.avatar.name)
                    if os.path.exists(old_avatar_path):
                        os.remove(old_avatar_path)
                # Сохраняем новое фото
                instance.avatar = validated_data['avatar']

            # Обновляем username, только если оно передано и не пустое
            if 'username' in validated_data and validated_data['username']:
                instance.username = validated_data['username']

            # Обновляем email, только если оно передано и не пустое
            if 'email' in validated_data and validated_data['email']:
                instance.email = validated_data['email']

            instance.save()
            return instance
        except Exception as e:
            # Логируем ошибку и возвращаем её
            raise serializers.ValidationError({"error": str(e)})

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')  # Удаляем повторный пароль перед созданием пользователя
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]  # Валидация сложности пароля
    )
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        # Проверка совпадения новых паролей
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Пароли не совпадают."})
        return attrs