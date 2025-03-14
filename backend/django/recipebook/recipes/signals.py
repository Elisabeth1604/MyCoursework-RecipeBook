from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import RecipeIngredient, Recipe

def calculate_calories_per_100(recipe):
    total_weight = 0.0
    total_calories = 0.0

    for rec_ing in recipe.recipeingredient_set.all():
        quantity = rec_ing.quantity or 0
        # Поиск коэффициента перевода
        conversion = rec_ing.ingredient.ingredient_units.filter(unit=rec_ing.unit).first()
        if conversion and conversion.conversion_to_grams is not None:
            weight = quantity * conversion.conversion_to_grams
        else:
            weight = quantity  # Если коэффициент не найден, считаем, что количество уже в граммах

        total_weight += weight

        try:
            calories_value = float(rec_ing.ingredient.calories or 0)
        except (ValueError, TypeError):
            calories_value = 0.0

        calories_for_ing = (weight * calories_value) / 100.0
        total_calories += calories_for_ing

    if total_weight > 0:
        return round((total_calories / total_weight) * 100, 2)
    return 0

@receiver([post_save, post_delete], sender=RecipeIngredient)
def update_recipe_calories(sender, instance, **kwargs):
    recipe = instance.recipe
    new_calories = calculate_calories_per_100(recipe)
    Recipe.objects.filter(pk=recipe.pk).update(calories_per_100=new_calories)