from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return self.username

class Subscription(models.Model):
    subscriber = models.ForeignKey(CustomUser, related_name="subscriptions", on_delete=models.CASCADE, db_column="subscriber")
    target = models.ForeignKey(CustomUser, related_name="followers", on_delete=models.CASCADE, db_column="target")

    class Meta:
        db_table = 'subscriptions'
        unique_together = (('subscriber', 'target'),)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    user= models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="comments", db_column="user")
    recipe = models.ForeignKey("recipes.Recipe", on_delete=models.CASCADE, related_name="comments", db_column="recipe")

    class Meta:
        db_table = 'comments'

    def __str__(self):
        return f"Комментарий {self.user.username} к {self.recipe.recipe_title}"


class Favourite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="favourites", db_column='user')
    recipe = models.ForeignKey("recipes.Recipe", on_delete=models.CASCADE, related_name="favourites", db_column='recipe')

    class Meta:
        db_table = 'favourites'
        unique_together = (('recipe', 'user'),)
