<template>
    <div class="favourite-page">
        <h2>Рецепты, которые вы сохранили</h2>
        <div class="favourite-recipes">

        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        
    },
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
