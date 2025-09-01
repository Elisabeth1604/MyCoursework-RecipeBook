import os
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import RecipeIngredient, Recipe
from django.conf import settings

def calculate_nutrition_per_100(recipe):
    total_weight = 0.0
    total_calories = 0.0
    total_proteins = 0.0
    total_fats = 0.0
    total_carbs = 0.0

    for rec_ing in recipe.recipeingredient_set.all():
        quantity = rec_ing.quantity or 0
        conversion = rec_ing.ingredient.ingredient_units.filter(unit=rec_ing.unit).first()
        if conversion and conversion.conversion_to_grams is not None:
            weight = quantity * conversion.conversion_to_grams
        else:
            weight = quantity

        total_weight += weight

        try:
            ing = rec_ing.ingredient
            total_calories += (float(ing.calories or 0) * weight) / 100
            total_proteins += (float(ing.proteins or 0) * weight) / 100
            total_fats += (float(ing.fats or 0) * weight) / 100
            total_carbs += (float(ing.carbohydrates or 0) * weight) / 100
        except (ValueError, TypeError):
            continue

    if total_weight > 0:
        return {
            "calories": round((total_calories / total_weight) * 100, 2),
            "proteins": round((total_proteins / total_weight) * 100, 2),
            "fats": round((total_fats / total_weight) * 100, 2),
            "carbs": round((total_carbs / total_weight) * 100, 2),
        }
    return {"calories": 0, "proteins": 0, "fats": 0, "carbs": 0}


@receiver([post_save, post_delete], sender=RecipeIngredient)
def update_recipe_nutrition(sender, instance, **kwargs):
    recipe = instance.recipe
    values = calculate_nutrition_per_100(recipe)
    Recipe.objects.filter(pk=recipe.pk).update(
        calories_per_100=values["calories"],
        proteins_per_100=values["proteins"],
        fats_per_100=values["fats"],
        carbs_per_100=values["carbs"],
    )


@receiver(pre_save, sender=Recipe)
def delete_old_main_photo(sender, instance, **kwargs):
    if not instance.pk:
        return  # Новый рецепт, нечего удалять

    try:
        old_instance = Recipe.objects.get(pk=instance.pk)
    except Recipe.DoesNotExist:
        return

    old_file_path = old_instance.main_photo
    new_file_path = instance.main_photo

    # Ничего не делать, если фото не менялось
    if not old_file_path or old_file_path == new_file_path:
        return

    # Удаление: очищаем путь от "/media/" если нужно
    relative_path = old_file_path.replace(settings.MEDIA_URL, '') if old_file_path.startswith(settings.MEDIA_URL) else old_file_path
    full_old_path = os.path.join(settings.MEDIA_ROOT, relative_path)

    if os.path.isfile(full_old_path):
        try:
            os.remove(full_old_path)
            print(f"Удалено старое фото: {full_old_path}")
        except Exception as e:
            print(f"Ошибка при удалении старого фото: {e}")
    else:
        print(f"Файл не найден: {full_old_path}")
