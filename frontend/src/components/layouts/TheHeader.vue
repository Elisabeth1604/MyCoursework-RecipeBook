<template>
    <header>
        <TheLogo></TheLogo>
        <TheSearch></TheSearch>
        <TheNav></TheNav>
    </header>
</template>

<script setup>
import TheLogo from '../TheLogo.vue';
import TheSearch from '../search/TheSearch.vue';
import TheNav from './TheNav.vue';
</script>

<style scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    display: grid;
    grid-template-columns: 5fr auto 5fr;
    align-items: center;
    padding: 20px;

    background-color: #FF7340;
    color: white;
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
