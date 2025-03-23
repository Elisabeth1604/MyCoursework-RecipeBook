from django.urls import path
from .views import RecipeListCreateView, RecipeDetailView, IngredientListView, CategoryListView, RecipeFilterView, UnitListView
from .upload_views import FileUploadView

urlpatterns = [
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('ingredients/', IngredientListView.as_view(), name='ingredient-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('recipes/filter/', RecipeFilterView.as_view(), name='recipe-filter'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('units/', UnitListView.as_view(), name='unit-list'),
]
