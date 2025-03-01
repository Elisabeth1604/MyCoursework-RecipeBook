from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar', 'date_joined']
        read_only_fields = ['date_joined']

    # Обновить данные пользователя
    def update(self, instance, validated_data):
        # Если в запросе передано новое фото, обновляем его
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']

        # Обновляем username, только если оно передано и не пустое
        if 'username' in validated_data and validated_data['username']:
            instance.username = validated_data['username']

        # Обновляем email, только если оно передано и не пустое
        if 'email' in validated_data and validated_data['email']:
            instance.email = validated_data['email']

        instance.save()
        return instance

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