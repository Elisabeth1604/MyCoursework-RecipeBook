<template>
  <app-page title="Добавленные рецепты"> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
    <div class="recipes" v-if="myRecipes.length">
      <app-recipe-card v-for="recipe in myRecipes"
                       :key="recipe.id"
                       :recipe-id="recipe.id"
                       :recipe-title="recipe.recipe_title"
                       :recipe-description="recipe.description"
                       :recipe-image="recipe.main_photo"
                       :prepTimeMin="recipe.prep_time_min"
                       :prepTimeHour="recipe.prep_time_hour"
                       :ingredients="recipe.ingredients"
                       :servings="recipe.servings"
                       :calories="recipe.calories_per_100"
                       :is-expanded="expandedCardId === recipe.id"
                       @toggle-card="toggleCard(recipe.id)"
                       mode="my"
                       @delete-my-recipe="handleDelete"/>
    </div>
    <div v-else>
      <p>У вас ещё нет добавленных рецептов
        <router-link to="/add-recipe" class="link"> добавьте первый</router-link>!
      </p>
    </div>
  </app-page>
</template>

<script>
import {defineComponent, computed, onMounted, ref} from 'vue'
import { useStore } from 'vuex';
import AppPage from '@/components/ui/AppPage.vue';
import AppRecipeCard from "@/components/AppRecipeCard.vue";
import RecipeCard from "@/components/AppRecipeCard.vue";
import store from "@/store/store";

export default defineComponent({
  name: 'MyRecipes',
  setup() {
    const store = useStore();
    const currentUser = computed(() => store.getters['user/user']);
    const expandedCardId = ref(null);

    const toggleCard = (id) => {
      expandedCardId.value = expandedCardId.value === id ? null : id;
    };

    // Если текущий пользователь найден, используем getter getUserRecipes,
    // иначе возвращаем пустой массив
    const myRecipes = computed(() => {
      return currentUser.value
          ? store.getters['recipe/getUserRecipes'](currentUser.value.id)
          : [];
    });

    onMounted(async () => {
      await store.dispatch('recipe/fetchRecipes');
    });

    const handleDelete = () => {
      store.dispatch(
          "setMessage",
          { type: "success", text: "Рецепт удален!", position: "app-message" },
          { root: true });
    };

    return {
      myRecipes,
      toggleCard,
      expandedCardId,
      handleDelete
    };
  },
  components:{RecipeCard, AppPage, AppRecipeCard}
})
</script>