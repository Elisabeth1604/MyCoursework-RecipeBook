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
              :calories="item.kkal"
              :is-expanded="expandedCardId === item.id"
              @toggle-card="toggleCard(item.id)"
          />
      </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import {useStore} from 'vuex'
import RecipeCard from '@/components/AppRecipeCard.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    'recipe-card': RecipeCard,
  },
  setup() {
    const expandedCardId = ref(null);
    const store = useStore();

    const recipes = computed(() => store.getters['recipe/allRecipes']);
   
    const toggleCard = (id) => {
      expandedCardId.value = expandedCardId.value === id ? null : id;
    };

    // const getRecipesFromDatabase = async () => {
    //   try {
    //     const { data } = await axios.get(
    //       'https://recipe-book-8f83f-default-rtdb.firebaseio.com/recipes.json'
    //     );
    //     const fetchedRecipes = Object.keys(data).map((key) => ({
    //       id: key,
    //       title: data[key].title,
    //       description: data[key].description,
    //       prepTime: data[key].prepTime,
    //       servings: data[key].servings,
    //       image: data[key].image || null,
    //       ingredients: data[key].ingredients || [],
    //     }));

    //     recipes.value = [...recipes.value, ...fetchedRecipes];
    //   } catch (error) {
    //     console.error('Ошибка при получении данных из базы данных:', error);
    //   }
    // };

    onMounted(() => {
      // Получаем рецепты при загрузке компонента
      // getRecipesFromDatabase();
      // store.dispatch('recipe/fetchRecipes');
    });

    return {
      expandedCardId,
      recipes,
      toggleCard
      // getRecipesFromDatabase,
    };
  },
};
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

