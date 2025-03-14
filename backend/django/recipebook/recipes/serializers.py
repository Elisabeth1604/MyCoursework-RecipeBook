from rest_framework import serializers
from users.serializers import UserSerializer  # Импортируем сериализатор пользователя
from .models import Recipe, Ingredient, Category, RecipeIngredient, RecipeStep, Unit


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()
    # Используем StringRelatedField, чтобы вывести значение __str__ модели Unit (то есть unit_name)
    unit = serializers.StringRelatedField()

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity', 'unit']

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep  # Убедись, что модель называется именно Step
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    user = UserSerializer(read_only=True)
    ingredients = RecipeIngredientSerializer(source='recipeingredient_set', many=True)
    steps = StepSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ('calories_per_100',)

