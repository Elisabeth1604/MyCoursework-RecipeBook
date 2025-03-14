from django.contrib import admin

from .models import Category, Ingredient, Unit, Recipe, RecipeIngredient, RecipeStep

admin.site.register(Category)
admin.site.register(Ingredient)
admin.site.register(Unit)
admin.site.register(Recipe)
admin.site.register(RecipeIngredient)
admin.site.register(RecipeStep)