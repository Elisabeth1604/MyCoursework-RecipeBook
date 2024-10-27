<template>
  <div class="recipe-list">
      <h2>Последние рецепты</h2>
      <div class="recipes" ref="recipeGrid">
          <recipe-card
              v-for="item in recipes"
              :key="item.id"
              :recipe-id="item.id"
              :recipe-title="item.title"
              :recipe-description="item.description"
              :recipe-image="item.image"
              :prepTime="item.prepTime"
              :ingredients="item.ingredients"
              :servings="item.servings"
              :is-expanded="expandedCardId === item.id"
              @toggle-card="toggleCard(item.id)"
          />
      </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import RecipeCard from '@/components/AppRecipeCard.vue';

export default defineComponent({
  setup() {
    
  },
  components:{ RecipeCard }
})
</script>

<style>

.recipe-list {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.recipes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start; /* Все карточки выравниваются по верхней границе */
}

h2{
  color:#333;
}

/* адаптивность */
@media (max-width: 1024px) {
  .recipes {
    grid-template-columns: repeat(2, 1fr); /* Два столбца при ширине экрана меньше 1024px */
  }
}

@media (max-width: 768px) {
  .recipes {
    grid-template-columns: 1fr; /* Один столбец при ширине экрана меньше 768px */
  }
}
</style>

