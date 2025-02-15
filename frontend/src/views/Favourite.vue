<template>
    <app-page title="Сохраненные рецепты"> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
        <div class="favourite-recipes">

        </div>
    </app-page>
</template>

<script>
import { defineComponent } from 'vue'
import AppPage from '@/components/ui/AppPage.vue';

export default defineComponent({
    setup() {
        
    },
    components: {AppPage}
})
</script>

<style scoped>
h2{
    color: #333;
}
.favourite-page{
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
}
/* Расположение избранных рецептов */
.favourite-recipes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start; /* Все карточки выравниваются по верхней границе */
}
</style>
