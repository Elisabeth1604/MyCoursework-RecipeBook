<template>
    <TheHeader/>
    <!-- Поместила в класс container из AppAddRecipe
    для единого стиля страниц с формами регистрации и добавления рецепта-->
    <div class="container">
        <RouterView/>
    </div>
    <TheFooter/>
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheFooter from '@/components/layouts/TheFooter.vue';
</script>

<style scoped>
.container{
  margin-top: 110px;
}
</style>
