<template>
  <app-page title="Сохраненные рецепты"> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
    <div class="recipes" v-if="favouriteRecipes.length">
      <app-recipe-card v-for="recipe in favouriteRecipes"
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
                       :is-public=true
                       @toggle-card="toggleCard(recipe.id)"
                       mode="favourite"
                       @remove-from-favourite="removeFavourite"/>
    </div>
    <div v-else>
      <p>У вас ещё нет сохраненных рецептов!</p>
    </div>
  </app-page>
</template>

<script>
import {computed, defineComponent, onMounted, ref} from 'vue'
import AppPage from '@/components/ui/AppPage.vue';
import AppRecipeCard from "@/components/AppRecipeCard.vue";
import {useStore} from "vuex";
import store from "@/store/store";

export default defineComponent({
  name: 'Favourite',
  setup() {
    document.title='Сохраненные рецепты | Поделюсь рецептом';
    const store = useStore();
    const currentUser = computed(() => store.getters['user/user']);
    const expandedCardId = ref(null);

    // Если текущий пользователь найден, используем getter getUserFavourites,
    // иначе возвращаем пустой массив
    const favouriteRecipes = computed(() => {
      return currentUser.value
          ? store.getters['recipe/getUserFavourites']
          : [];
    });

    onMounted( async() =>{
      await store.dispatch('recipe/fetchFavourites'); // Загрузка избранного при монтировании
    });

    const toggleCard = (id) => {
      expandedCardId.value = expandedCardId.value === id ? null : id;
    };

    const removeFavourite = async (recipeId) => {
      await store.dispatch('recipe/removeFromFavourites', recipeId)
      store.dispatch(
          "setMessage",
          { type: "success", text: "Рецепт удален из избранного!", position: "app-message" },
          { root: true });
    };

    return{
      favouriteRecipes,
      toggleCard,
      expandedCardId,
      removeFavourite
    };
  },
  components: { AppPage, AppRecipeCard }
})
</script>

<style scoped>
.favourite-page{
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
}
</style>
