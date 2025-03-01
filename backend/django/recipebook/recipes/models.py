# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Category(models.Model):
    category_name = models.CharField(max_length=45, unique=True)

    class Meta:
        db_table = 'categories'

    def __str__(self):
        return self.category_name

class Ingredient(models.Model):
    ingredient_name = models.CharField(max_length=45, unique=True)
    calories = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0)
    proteins = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0)
    fats = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0)
    carbohydrates = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0)

    class Meta:
        db_table = 'ingredients'

    def __str__(self):
        return self.ingredient_name

class Unit(models.Model):
    unit_name = models.CharField(max_length=45, unique=True)

    class Meta:
        db_table = 'units'

    def __str__(self):
        return self.unit_name

class IngredientUnits(models.Model):
    id = models.AutoField(primary_key=True)  # Новый суррогатный ключ
    ingredient= models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name="ingredient_units")
    unit= models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="ingredient_units")
    conversion_to_grams = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'ingredient_units'
        unique_together = (('ingredient', 'unit'),)

class User(models.Model):
    username = models.CharField(max_length=45, unique=True)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username

class Recipe(models.Model):
    recipe_title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    servings = models.IntegerField()
    prep_time_min = models.IntegerField()
    prep_time_hour = models.IntegerField(blank=True, default=0)
    main_photo = models.CharField(max_length=255)
    created_at = models.DateField(auto_now_add=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="recipes")

    class Meta:
        db_table = 'recipes'

    def __str__(self):
        return self.recipe_title

class RecipeStep(models.Model):
    id = models.AutoField(primary_key=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    description = models.TextField()
    photo = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'recipe_steps'


# Связь Рецепты - Ингредиенты (многие ко многим)
class RecipeIngredient(models.Model):
    id = models.AutoField(primary_key=True)
    quantity = models.IntegerField()
    unit =  models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)

    class Meta:
        db_table = 'recipes_has_ingredients'
        unique_together = (('recipe', 'ingredient'),)

    def __str__(self):
        return f"{self.recipe.recipe_title} - {self.ingredient.ingredient_name}: {self.quantity}"


class Subscription(models.Model):
    subscriber = models.ForeignKey(User, related_name="subscriptions", on_delete=models.CASCADE)
    target = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)

    class Meta:
        db_table = 'subscriptions'
        unique_together = (('subscriber', 'target'),)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    user= models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="comments")

    class Meta:
        db_table = 'comments'

    def __str__(self):
        return f"Комментарий {self.user.username} к {self.recipe.recipe_title}"


class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favourites")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="favourites")

    class Meta:
        db_table = 'favourites'
        unique_together = (('recipe', 'user'),)