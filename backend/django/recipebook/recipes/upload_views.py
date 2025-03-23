import os
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class FileUploadView(APIView):
    """
    Эндпоинт для загрузки файлов.
    Принимает POST-запрос с файлом под ключом 'image'.
    Сохраняет файл в media/uploads/ и возвращает полный URL сохранённого файла.
    """

    def post(self, request, format=None):
        # Проверяем, передан ли файл
        if 'image' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['image']

        # Опционально: можно добавить проверку типа файла или размера

        # Определяем путь для сохранения: media/uploads/имя_файла
        upload_folder = 'uploads'
        # Генерируем уникальное имя файла, чтобы избежать коллизий (например, с помощью timestamp)
        from time import time
        unique_filename = f"{int(time())}_{file.name}"
        upload_path = os.path.join(upload_folder, unique_filename)

        # Сохраняем файл через default_storage
        path = default_storage.save(upload_path, ContentFile(file.read()))
        # Получаем URL сохранённого файла (например, "/media/uploads/...")
        file_url = default_storage.url(path)
        # Строим абсолютный URL, добавляя домен
        full_url = request.build_absolute_uri(file_url)

        return Response({"url": full_url}, status=status.HTTP_201_CREATED)
