<template>
  <div>
    <h2>Добавление нового рецепта</h2>
    <!-- RecipeForm получает newRecipe -->
    <AppRecipeForm
        v-model="newRecipe"
        :units="units"
        :categories="categories"
        :isEdit="false"
        submitText="Отправить рецепт"
        @submit="handleCreate"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppRecipeForm from "@/components/AppRecipeForm.vue";
import axios from "axios";

export default {
  components: { AppRecipeForm },
  setup() {
    document.title='Добавление рецепта | Поделюсь рецептом';

    const store = useStore();
    const units = ref([]);
    const categories = ref([]);

    // Новый рецепт
    const newRecipe = ref({
      recipe_title: undefined,
      description: undefined,
      main_photo: null,
      prep_time_min: null,
      prep_time_hour: null,
      servings: null,
      is_public: true,
      category: '',
      ingredients: [
        { ingredient: { id: null, ingredient_name: '' }, quantity: '', unit: '', suggestions: [] }
      ],
      steps: [
        { description: '', photo: '' }
      ]
    });

    const handleCreate = async (recipeData) => {
      try {
        // Тут запрос на добавление
        await store.dispatch('recipe/addRecipe', recipeData);
        store.dispatch('setMessage', {
          type: 'success',
          text: 'Рецепт успешно добавлен!',
          position: 'app-message'
        });
      } catch (error) {
        store.dispatch('setMessage', {
          type: 'error',
          text: 'Ошибка при добавлении рецепта',
          position: 'app-message'
        });
      }
    }

    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost/api/units/');
        units.value = response.data;
      } catch (error) {
        console.error('Ошибка загрузки единиц измерения:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/api/categories/");
        categories.value = response.data;
      } catch (error) {
        console.error("Ошибка получения категорий:", error);
      }
    };

    onMounted(async () => {
      // Загрузим список единиц
      await fetchUnits();
      // Загрузим список категорий
      await fetchCategories();
    });

    return {
      newRecipe,
      units,
      categories,
      handleCreate
    }
  }
}
</script>

<style scoped>
/* Можно оставить пустым — всё в RecipeForm.vue */
</style>
