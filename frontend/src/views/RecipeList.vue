<template>
  <app-page title="Последние рецепты" filters> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
    <div class="recipes" ref="recipeGrid" v-if="publicRecipes && publicRecipes.length">
      <recipe-card
          v-for="item in publicRecipes"
          :key="item.id"
          :recipe-id="item.id"
          :recipe-title="item.recipe_title"
          :recipe-description="item.description"
          :recipe-image="item.main_photo"
          :prepTimeMin="item.prep_time_min"
          :prepTimeHour="item.prep_time_hour"
          :ingredients="item.ingredients"
          :servings="item.servings"
          :calories="item.calories_per_100"
          :is-expanded="expandedCardId === item.id"
          :is-public=true
          @toggle-card="toggleCard(item.id)"
      />
    </div>
    <!-- Если рецептов нет, например, по заданным фильтрам, выводим сообщение -->
    <div v-else class="no-recipes">
      <p>
        Таких рецептов пока нет, ваш может
        <router-link to="/add-recipe" class="link"> стать первым</router-link>!
      </p>
    </div>
  </app-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import {useStore} from 'vuex'
import RecipeCard from '@/components/AppRecipeCard.vue';
import AppPage from '@/components/ui/AppPage.vue';

export default {
  name: 'App',
  setup() {
    const expandedCardId = ref(null);
    const store = useStore();

    const recipes = computed(() => store.getters['recipe/allRecipes']);

    const publicRecipes = computed( () => {
      return recipes.value.filter(recipe => recipe.is_public)
    });
   
    const toggleCard = (id) => {
      expandedCardId.value = expandedCardId.value === id ? null : id;
    };

    onMounted(() => {
      store.dispatch('recipe/fetchRecipes');
    });

    return {
      expandedCardId,
      recipes,
      publicRecipes,
      toggleCard
    };
  },
  components: {
    RecipeCard,
    AppPage
  }
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

.no-recipes {
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
}

.link{
  display: inline-block;
  margin-top: 5px;
  color:rgb(83, 127, 163);
  text-decoration-line: none;
  border-bottom: 1px solid;
}

/* Цвет при наведении на ссылку */
.link:hover, .link:hover {
  color: #FF9973;
}
/* Цвет при нажатии на ссылку */
.link:active, .link:active {
  color: #fc511c;
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

