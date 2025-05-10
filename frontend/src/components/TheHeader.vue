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
  components:{ TheLogo, TheSearch, TheNav }
})
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 5fr auto 5fr;
  align-items: center;
  background-color: #FF7340;
  padding: 20px;
  color: white;
  z-index: 1000;
  box-shadow: 0 8px 5px rgba(0,0,0,0.1);
}

the-logo {
  justify-self: start;
}

the-search {
  justify-self: center;
}

the-nav {
  justify-self: end;
}

@media (max-width: 500px) {
  header {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
