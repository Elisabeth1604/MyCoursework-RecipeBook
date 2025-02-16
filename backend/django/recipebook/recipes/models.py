# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Categories(models.Model):
    names = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'categories'


class Comments(models.Model):
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateField(blank=True, null=True)
    users_id = models.IntegerField()
    recipes_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'comments'
        unique_together = (('id', 'recipes_id', 'users_id'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Favourites(models.Model):
    users_id = models.IntegerField()
    recipes_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'favourites'
        unique_together = (('id', 'recipes_id', 'users_id'),)


class IngredientUnits(models.Model):
    id = models.AutoField(primary_key=True)  # Новый суррогатный ключ
    ingredient_id = models.IntegerField()
    unit_id = models.IntegerField()
    conversion_to_grams = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ingredient_units'
        unique_together = (('ingredient_id', 'unit_id'),)



class Ingredients(models.Model):
    names = models.CharField(max_length=45, blank=True, null=True)
    calories = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    proteins = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    fats = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    carbohydrates = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ingredients'


class RecipeSteps(models.Model):
    description = models.TextField(blank=True, null=True)
    photo = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipe_steps'


class Recipes(models.Model):
    titles = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    servings = models.IntegerField(blank=True, null=True)
    prep_time_min = models.IntegerField(blank=True, null=True)
    prep_time_hour = models.IntegerField(blank=True, null=True)
    main_photo = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateField(blank=True, null=True)
    users_id = models.IntegerField()
    categories_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'recipes'


class RecipesHasIngredients(models.Model):
    quantity = models.IntegerField(blank=True, null=True)
    units_id = models.IntegerField()
    recipes_id = models.IntegerField()
    ingredients_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'recipes_has_ingredients'


class StepRecipe(models.Model):
    recipe_steps_id = models.IntegerField()
    recipes_id = models.IntegerField()
    id = models.IntegerField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'step_recipe'


class Subscriptions(models.Model):
    subscriber_id = models.IntegerField()
    target_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'subscriptions'


class Units(models.Model):
    names = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'units'


class Users(models.Model):
    username = models.CharField(max_length=45)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    creaded_at = models.DateField()

    class Meta:
        managed = False
        db_table = 'users'
