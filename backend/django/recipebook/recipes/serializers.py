from rest_framework import serializers
from users.serializers import UserSerializer  # Импортируем сериализатор пользователя
from rest_framework.validators import UniqueValidator
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


class RecipeIngredientCreateSerializer(serializers.ModelSerializer):
    # Здесь предполагаем, что при создании мы передаём идентификаторы ингредиента и единицы измерения
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    unit = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all())

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity', 'unit']

class StepCreateSerializer(serializers.ModelSerializer):
    photo = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = RecipeStep
        fields = ['description', 'photo']

class RecipeCreateSerializer(serializers.ModelSerializer):
    recipe_title = serializers.CharField(
        max_length=255,
        validators=[
            UniqueValidator(
                queryset=Recipe.objects.all(),
                message="Рецепт с таким названием уже существует!"
            )
        ]
    )
    # Вложенные сериализаторы для создания ингредиентов и шагов
    ingredients = RecipeIngredientCreateSerializer(many=True, source="recipeingredient_set")
    steps = StepCreateSerializer(many=True)

    class Meta:
        model = Recipe
        # Укажите те поля, которые будут передаваться при создании рецепта
        fields = ['recipe_title', 'description', 'servings', 'prep_time_min', 'prep_time_hour', 'main_photo', 'category', 'ingredients', 'steps']

    def create(self, validated_data):
        # Извлекаем вложенные данные
        ingredients_data = validated_data.pop('recipeingredient_set', [])
        steps_data = validated_data.pop('steps', [])

        # Автоматически устанавливаем текущего пользователя как автора
        # Предполагается, что в контексте сериализатора передается request
        user = self.context['request'].user

        # Создаем объект рецепта
        recipe = Recipe.objects.create(user=user, **validated_data)

        # Создаем объекты RecipeIngredient, связывая их с созданным рецептом
        for ingredient_data in ingredients_data:
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient_data['ingredient'],
                quantity=ingredient_data['quantity'],
                unit=ingredient_data.get('unit')
            )

        # Создаем связанные записи шагов приготовления
        for step_data in steps_data:
            RecipeStep.objects.create(recipe=recipe, **step_data)

        return recipe

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


