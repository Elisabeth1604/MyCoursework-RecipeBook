<template>
  <header>
    <the-logo></the-logo>
    <the-search></the-search>
    <the-nav></the-nav>
  </header>
</template>

<script>
import { defineComponent } from 'vue';
import TheLogo from './TheLogo.vue';
import TheSearch from './TheSearch.vue';
import TheNav from './TheNav.vue';

export default defineComponent({
  setup() {

  },

  components:{ TheLogo, TheSearch, TheNav }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Alice&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Serif+Display:ital@0;1&family=Macondo&family=Mate:ital@0;1&display=swap');
header {
  position: fixed; /* Фиксированное позиционирование */
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FF7340;
  padding: 20px;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
/* Более узкие экраны (мобильные) */
@media (max-width: 480px) {
  header {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
