<template>
  <footer>
    <p>&copy; 2025 Поделюсь рецептом. Все права защищены.</p>
      <p>
        <a href="#">Политика конфиденциальности</a> |
        <a href="#">Условия использования</a>
      </p>
    </footer>
</template>

<script>
export default {
};
</script>

<style scoped>
footer {
  background-color: #4c4a49; /* Цвет фона */
  color: white; /* Цвет текста */
  text-align: center; /* Выравнивание текста по центру */
  padding: 10px 0; /* Отступы сверху и снизу */
  margin-top: 115px;
  position: relative; /* Относительное позиционирование */
  bottom: 0; /* Положение внизу */
  width: 100%; /* Ширина 100% */
}

footer a {
  color: #ff5722; /* Цвет ссылок */
  text-decoration: none; /* Убираем подчеркивание */
}

footer a:hover {
  text-decoration: underline; /* Подчеркивание при наведении */
}

@media (max-width: 480px) {
  p{
      font-size: 12px;
  }
}
</style>