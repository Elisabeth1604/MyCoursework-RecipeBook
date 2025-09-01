import os
from django.conf import settings
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
    #StringRelatedField, чтобы вывести значение __str__ модели Unit (то есть unit_name)
    unit = serializers.StringRelatedField()

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity', 'unit']

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    user = UserSerializer(read_only=True)
    ingredients = RecipeIngredientSerializer(source='recipeingredient_set', many=True)
    steps = StepSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ('calories_per_100', 'proteins_per_100', 'fats_per_100', 'carbs_per_100')


class RecipeIngredientCreateSerializer(serializers.ModelSerializer):
    # При создании передаём идентификаторы ингредиента и единицы измерения
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    unit = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all())
    quantity = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity', 'unit']

    def to_internal_value(self, data):
        # Обработка пустых строк до валидации полей (преобразуем '' в None для quantity)
        if data.get('quantity') == '':
            data['quantity'] = None
        return super().to_internal_value(data)

    def validate(self, data):
        unit = data.get('unit')
        quantity = data.get('quantity')

        if unit and unit.unit_name.strip().lower() != 'по вкусу' and quantity is None:
            raise serializers.ValidationError({
                'quantity': 'Укажите количество, если это не "по вкусу".'
            })
        return data

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
        # Поля, которые будут передаваться при создании рецепта
        fields = ['recipe_title', 'description', 'servings', 'prep_time_min', 'prep_time_hour',
                  'main_photo', 'category', 'ingredients', 'steps', 'is_public']

    def create(self, validated_data):
        # Извлекаем вложенные данные
        ingredients_data = validated_data.pop('recipeingredient_set', [])
        steps_data = validated_data.pop('steps', [])

        # Автоматически устанавливаем текущего пользователя как автора
        # Предполагается, что в контексте сериализатора передается request
        user = self.context['request'].user

        recipe = Recipe.objects.create(user=user, **validated_data)

        # Создаем объекты RecipeIngredient, связывая их с созданным рецептом
        for ingredient_data in ingredients_data:
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient_data['ingredient'],
                quantity=ingredient_data['quantity'],
                unit=ingredient_data.get('unit')
            )

        # Связанные записи шагов приготовления
        for step_data in steps_data:
            RecipeStep.objects.create(recipe=recipe, **step_data)

        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('recipeingredient_set', [])
        steps_data = validated_data.pop('steps', [])

        # Обновляем простые поля рецепта
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Обработка шагов
        existing_steps = list(instance.steps.all())
        new_steps = steps_data

        # Обновление существующих шагов
        for i, step_data in enumerate(new_steps):
            if i < len(existing_steps):
                step = existing_steps[i]
                # Если фото изменилось, удаляем старое
                if 'photo' in step_data and step.photo != step_data['photo']:
                    if step.photo:
                        relative_path = step.photo.replace(settings.MEDIA_URL, '') if step.photo.startswith(
                            settings.MEDIA_URL) else step.photo
                        full_path = os.path.join(settings.MEDIA_ROOT, relative_path)
                        if os.path.isfile(full_path):
                            try:
                                os.remove(full_path)
                            except Exception as e:
                                print(f"Ошибка при удалении фото шага: {e}")
                    step.photo = step_data.get('photo', '')
                step.description = step_data.get('description', '')
                step.save()
            else:
                # Добавляем новый шаг
                RecipeStep.objects.create(recipe=instance, **step_data)

        # Удалить лишние старые шаги
        if len(existing_steps) > len(new_steps):
            for step in existing_steps[len(new_steps):]:
                if step.photo:
                    relative_path = step.photo.replace(settings.MEDIA_URL, '') if step.photo.startswith(
                        settings.MEDIA_URL) else step.photo
                    full_path = os.path.join(settings.MEDIA_ROOT, relative_path)
                    if os.path.isfile(full_path):
                        try:
                            os.remove(full_path)
                        except Exception as e:
                            print(f"Ошибка при удалении фото шага: {e}")
                step.delete()

        instance.recipeingredient_set.all().delete()

        # Новые ингредиенты
        for ingredient_data in ingredients_data:
            RecipeIngredient.objects.create(
                recipe=instance,
                ingredient=ingredient_data['ingredient'],
                quantity=ingredient_data['quantity'],
                unit=ingredient_data.get('unit')
            )

        return instance

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


