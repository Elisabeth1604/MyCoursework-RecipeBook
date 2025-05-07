<template>
  <div v-if="editableRecipe">
    <h2>Редактирование рецепта</h2>
    <AppRecipeForm
        v-model="editableRecipe"
        :units="units"
        :categories="categories"
        :isEdit="true"
        submitText="Сохранить изменения"
        @submit="handleUpdate"
    />
  </div>
  <div v-else>
    <p>Загрузка рецепта...</p>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useStore} from 'vuex'
import AppRecipeForm from "@/components/AppRecipeForm.vue";
import axios from "axios";

export default {
  components: { AppRecipeForm },
  setup() {
    document.title='Редактирование рецепта | Поделюсь рецептом';
    const store = useStore()
    const route = useRoute()
    const recipeId = Number(route.params.id)

    const units = ref([])
    const categories = ref([])
    const editableRecipe = ref(null)

    const handleUpdate = async (recipeData) => {
      try {
        await store.dispatch('recipe/updateRecipe', {
          recipeId,
          recipeData
        })
        store.dispatch('setMessage', {
          type: 'success',
          text: 'Рецепт успешно обновлён!',
          position: 'app-message'
        })
      } catch (error) {
        store.dispatch('setMessage', {
          type: 'error',
          text: 'Ошибка при обновлении рецепта',
          position: 'app-message'
        })
      }
    }

    onMounted(async () => {
      //  Загружаем список единиц
      const unitsRes = await fetchUnits();
      units.value = unitsRes || [];

      //  Загружаем список категорий
      const catRes = await fetchCategories();
      categories.value = catRes || []

      //  Находим рецепт в store (или запрашиваем с сервера)
      const recipe = store.getters['recipe/getRecipeById'](recipeId)
      if (recipe) {
        // Делаем копию, чтобы не менять state напрямую
        editableRecipe.value = JSON.parse(JSON.stringify(recipe))
      } else {
        // Если нет в store (например, обновили страницу) — принудительно загрузить рецепты в store
        try {
          await store.dispatch('recipe/fetchRecipes')
          const recipe = store.getters['recipe/getRecipeById'](recipeId)
          if (recipe) {
            editableRecipe.value = JSON.parse(JSON.stringify(recipe))
          } else {
            console.warn('Рецепт не найден на сервере')
          }
        } catch (err) {
          console.error('Ошибка загрузки рецепта с сервера:', err)
        }
      }
    });

    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost/api/units/');
        return response.data;
      } catch (error) {
        console.error('Ошибка загрузки единиц измерения:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/api/categories/");
        return response.data;
      } catch (error) {
        console.error("Ошибка получения категорий:", error);
      }
    };

    return {
      units,
      categories,
      editableRecipe,
      handleUpdate
    }
  }
}
</script>

<style scoped>
/* Вся верстка внутри RecipeForm.vue */
</style>
