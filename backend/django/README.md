# recipe_book_backend

## Основные команды

### Создать суперпользователя (для Django Admin)
```
python manage.py createsuperuser
```

Логин
Email
Пароль
Затем войти в админку: http://127.0.0.1:8000/admin/

### Запустить сервер
```
python manage.py runserver
```

###  Работа с миграциями
```
python manage.py makemigrations  # Создать файлы миграций
python manage.py migrate  # Применить миграции
python manage.py showmigrations  # Показать список миграций

python manage.py sqlmigrate <имя_приложения> <номер_файла_миграции> # Посмотреть SQL запрос для выполнения файла миграции
```

### Создание нового приложения
```
python manage.py startapp new_app_name
```

### Перейти в оболочку Django
```
python manage.py shell
```
```
python manage.py shell_plus --print-sql # Будут отображаться сразу SQL-запросы (django-extentions)
```

## Основные команды Git (только для backend/)

### Добавить изменения и коммитить только backend/
```
git add backend/
git commit -m "Обновления бэкенда"
git push origin main  # Или другая ветка
```


### Удалить ненужные файлы из Git (если уже были закоммичены)
```
git rm -r --cached backend/venv
git commit -m "Удалены ненужные файлы из Git"
git push origin main
```

