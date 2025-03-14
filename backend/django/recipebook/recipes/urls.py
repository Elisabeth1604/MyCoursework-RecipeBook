from django.urls import path
from .views import RecipeListCreateView, RecipeDetailView, IngredientListView, CategoryListView, RecipeFilterView

urlpatterns = [
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('ingredients/', IngredientListView.as_view(), name='ingredient-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('recipes/filter/', RecipeFilterView.as_view(), name='recipe-filter'),
]
