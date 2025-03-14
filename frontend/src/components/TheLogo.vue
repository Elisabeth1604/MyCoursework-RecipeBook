<template>
  <router-link to="/">
    <div class="logo" title="На главную">
      <img src="..\assets\icons\figma1.png" alt="Логотип">
    </div>
    </router-link>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Alice&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Serif+Display:ital@0;1&family=Macondo&family=Mate:ital@0;1&display=swap');
.logo {
  display: flex;
  align-items: center;
}

a {
  text-decoration: none; /* Отключаем подчеркивание для всех ссылок */
  color: inherit; /* Цвет текста ссылок остается неизменным */
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

.logo h1 {
  font-family: "Bricolage Grotesque", sans-serif;
  font-weight: 650;
  margin: 0;
  font-size: 40px
}

/* Адаптивное поведение для логотипа и текста */
@media (max-width: 768px) {
  .logo img {
    height: 40px; /* Уменьшение размера логотипа */
    margin-right: 0; /* Убрать отступ при уменьшении экрана */
  }

  .logo h1 {
    font-size: 30px; /* Уменьшение шрифта заголовка */
  }
}

/* Более узкие экраны (мобильные) */
@media (max-width: 480px) {
  .logo h1 {
    font-size: 24px; /* Ещё большее уменьшение шрифта заголовка */
  }

  .logo img {
    height: 35px; /* Уменьшение логотипа для мобильных */
  }

  header {
    padding: 15px; /* Уменьшение отступов для мобильных */
  }
}
</style>