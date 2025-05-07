<template>
  <the-header/>
  <!-- Поместила в класс container из AppAddRecipe для единого стиля -->
  <div class="container">
    <router-view/>
  </div>
  <the-footer/>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

export default {
  components: { TheHeader, TheFooter }
}
</script>

<style scoped>
.container{
  margin-top: 110px;
}
</style>
