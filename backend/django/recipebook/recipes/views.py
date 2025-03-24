from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Recipe, Ingredient, Category, Unit
from .serializers import RecipeSerializer, IngredientSerializer, CategorySerializer, RecipeCreateSerializer, UnitSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os

'''Поиск
Если используется базовый поиск через ?search=..., DRF проходит по указанным полям и возвращает рецепты, удовлетворяющие условию.
Если используется форма фильтров, запрос отправляется на эндпоинт /api/recipes/filter/ с отдельными параметрами для категории, 
ингредиентов и калорий. Врчуную применяются фильтры к queryset(RecipeFilterView)'''

class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter] # Встроенный фильтр DRF SearchFilter для реализации поиска через параметр ?search=
    # Поля, по которым будет осуществляться поиск:
    # - 'recipe_title': ищет по названию рецепта.
    # - 'recipeingredient__ingredient__ingredient_name':
    #      Пересекаем связь: Recipe -> RecipeIngredient (через обратную связь по умолчанию, для SearchFilter можно использовать имя модели в нижнем регистре) ->
    #      Ingredient -> ingredient_name, что позволяет искать рецепты по названию ингредиента.
    # - 'category__category_name': ищет по названию категории, к которой привязан рецепт.
    search_fields = ['recipe_title', 'recipeingredient__ingredient__ingredient_name', 'category__category_name']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RecipeCreateSerializer
        return RecipeSerializer

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class IngredientListView(generics.ListAPIView):
    serializer_class = IngredientSerializer
    def get_queryset(self):
        query = self.request.query_params.get('query', '')
        return Ingredient.objects.filter(ingredient_name__icontains=query)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RecipeFilterView(generics.ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        queryset = Recipe.objects.all()
        category = self.request.query_params.get("category") # Из параметров запроса выбранная категория
        include_ingredients = self.request.query_params.getlist("includeIngredients[]") # Массивы ингредиентов
        exclude_ingredients = self.request.query_params.getlist("excludeIngredients[]")
        max_calories = self.request.query_params.get("maxCalories") # В модели Recipes нет калорий, нужно считать!!!!!!

        # Фильтр по категории
        if category:
            # Фильтр по внешнему ключу category
            queryset = queryset.filter(category_id=category)

        # Фильтр по включенным ингредиентам
        if include_ingredients:
            for ingredient in include_ingredients:
                # Отбираем рецепты, у которых есть хотя бы один связанный объект RecipeIngredient,
                # где имя ингредиента содержит подстроку (без учета регистра)
                queryset = queryset.filter(recipeingredient__ingredient__ingredient_name__icontains=ingredient)

        # Фильтр по исключаемым ингредиентам
        if exclude_ingredients:
            for ingredient in exclude_ingredients:
                queryset = queryset.exclude(recipeingredient__ingredient__ingredient_name__icontains=ingredient)

        # Фильтр по калорийности
        if max_calories:
            queryset = queryset.filter(calories_per_100__lte=max_calories)

        return queryset

class UnitListView(generics.ListAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

