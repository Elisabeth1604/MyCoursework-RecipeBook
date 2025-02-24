from django.contrib import admin

from .models import Category, Ingredient, Unit, User, Recipe, RecipeIngredient, RecipeStep, Subscription, Comment, Favourite

admin.site.register(Category)
admin.site.register(Ingredient)
admin.site.register(Unit)
admin.site.register(User)
admin.site.register(Recipe)
admin.site.register(RecipeIngredient)
admin.site.register(RecipeStep)
admin.site.register(Subscription)
admin.site.register(Comment)
admin.site.register(Favourite)