<template>
  <router-link to="/">
    <div class="logo" title="На главную">
      <img src="..\assets\icons\figma1.png" alt="Логотип">
    </div>
    </router-link>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
}

a {
  text-decoration: none; /* Отключаем подчеркивание для ссылок */
  color: inherit; /* Цвет текста ссылок остается неизменным */
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

/* Адаптивное поведение для логотипа и текста */
@media (max-width: 768px) {
  .logo img {
    height: 40px; /* Уменьшение размера логотипа */
    margin-right: 0; /* Убрать отступ при уменьшении экрана */
  }
}

/* Более узкие экраны (мобильные) */
@media (max-width: 480px) {
  .logo img {
    height: 35px; /* Уменьшение логотипа для мобильных */
  }

  header {
    padding: 15px; /* Уменьшение отступов для мобильных */
  }
}

@media (max-width: 382px) {
  .logo img {
    height: 30px;
  }

  header {
    padding: 10px;
  }
}
</style>