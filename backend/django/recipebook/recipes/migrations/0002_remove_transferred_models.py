# Generated by Django 4.2.1 on 2025-03-09 11:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='recipe',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='user',
        ),
        migrations.DeleteModel(
            name='Comment',
        ),
        migrations.RemoveField(
            model_name='favourite',
            name='recipe',
        ),
        migrations.RemoveField(
            model_name='favourite',
            name='user',
        ),
        migrations.DeleteModel(
            name='Favourite',
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='subscriber',
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='target',
        ),
        migrations.DeleteModel(
            name='Subscription',
        ),
    ]
