<template>
  <div class="filters-container">
    <!-- Категория рецепта -->
    <div class="filter">
      <label for="category">Категория</label>
      <select v-model="selectedCategory" class="filter-input">
        <option value="">Любая категория</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.category_name }}
        </option>
      </select>
    </div>

    <!-- Включить ингредиенты -->
    <div class="filter">
      <label for="include-ingredients">Включить ингредиенты</label>
      <input
          type="text"
          v-model="includeQuery"
          class="filter-input"
          placeholder="Введите ингредиент"
          @input="fetchIngredients(includeQuery)"
          @keydown.enter.prevent="addIngredient(includeQuery, 'include')"
      />
      <ul v-if="includeSuggestions.length" class="suggestions">
        <li v-for="item in includeSuggestions" :key="item.id" @click="addIngredient(item.ingredient_name, 'include')">
          {{ item.ingredient_name }}
        </li>
      </ul>
      <div class="selected-tags">
        <span v-for="(ingredient, index) in includeIngredients" :key="index" class="tag">
          {{ ingredient }} <button @click="removeIngredient(index, 'include')">&times;</button>
        </span>
      </div>
    </div>

    <!-- Исключить ингредиенты -->
    <div class="filter">
      <label for="exclude-ingredients">Исключить ингредиенты</label>
      <input
          type="text"
          v-model="excludeQuery"
          class="filter-input"
          placeholder="Введите ингредиент"
          @input="fetchIngredients(excludeQuery)"
          @keydown.enter.prevent="addIngredient(excludeQuery, 'exclude')"
      />
      <ul v-if="excludeSuggestions.length" class="suggestions">
        <li v-for="item in excludeSuggestions" :key="item.id" @click="addIngredient(item.ingredient_name, 'exclude')">
          {{ item.ingredient_name }}
        </li>
      </ul>
      <div class="selected-tags">
        <span v-for="(ingredient, index) in excludeIngredients" :key="index" class="tag">
          {{ ingredient }} <button @click="removeIngredient(index, 'exclude')">&times;</button>
        </span>
      </div>
    </div>

    <!-- Калорийность -->
    <div class="filter">
      <label for="calories">Калорийность (не более)</label>
      <input type="number" v-model.number="maxCalories" class="filter-input" placeholder="Введите калории" />
    </div>

    <!-- Кнопка "Подобрать рецепты" -->
    <button @click="applyFilters" class="select-button">Подобрать рецепты</button>
    <!-- Кнопка сброса фильтров (появляется, если фильтры изменены) -->
    <button v-if="filtersChanged" @click="resetFilters" class="select-button">Сбросить</button>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {defineComponent, onMounted, ref, watch, computed} from "vue";
import axios from "axios";

export default defineComponent( {
  setup(props, { emit }) {
    const store = useStore()
    // Дефолтные значения фильтров
    const defaultFilters = {
      selectedCategory: "",
      includeIngredients: [],
      excludeIngredients: [],
      maxCalories: null,
    };

    // Состояние для фильтров
    const selectedCategory = ref("");
    const categories = ref([]);

    // Поля для ингредиентов
    const includeQuery = ref("");
    const excludeQuery = ref("");
    const includeIngredients = ref([]);
    const excludeIngredients = ref([]);
    const includeSuggestions = ref([]);
    const excludeSuggestions = ref([]);

    // Поле калорийности
    const maxCalories = ref(null);

    onMounted(() => {
      fetchCategories();
    });

    // Функция сохранения фильтров в localStorage
    const saveFilters = () => {
      const filters = {
        selectedCategory: selectedCategory.value,
        includeIngredients: includeIngredients.value,
        excludeIngredients: excludeIngredients.value,
        maxCalories: maxCalories.value,
      };
      localStorage.setItem("recipeFilters", JSON.stringify(filters));
    };

    // Восстановление фильтров из localStorage при загрузке страницы
    onMounted(() => {
      const savedFilters = localStorage.getItem("recipeFilters");
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        selectedCategory.value = parsed.selectedCategory || defaultFilters.selectedCategory;
        includeIngredients.value = parsed.includeIngredients || defaultFilters.includeIngredients;
        excludeIngredients.value = parsed.excludeIngredients || defaultFilters.excludeIngredients;
        maxCalories.value = parsed.maxCalories || defaultFilters.maxCalories;
      }
    });

    // Отслеживаем изменения фильтров и сохраняем их
    watch(
        [selectedCategory, includeIngredients, excludeIngredients, maxCalories],
        saveFilters,
        { deep: true }
    );

    // Вычисляемое свойство, определяющее, изменены ли фильтры по сравнению с дефолтными
    const filtersChanged = computed(() => {
      return (
          selectedCategory.value !== defaultFilters.selectedCategory ||
          JSON.stringify(includeIngredients.value) !== JSON.stringify(defaultFilters.includeIngredients) ||
          JSON.stringify(excludeIngredients.value) !== JSON.stringify(defaultFilters.excludeIngredients) ||
          maxCalories.value !== defaultFilters.maxCalories
      );
    });

    // Функция сброса фильтров
    const resetFilters = () => {
      selectedCategory.value = defaultFilters.selectedCategory;
      includeIngredients.value = [...defaultFilters.includeIngredients];
      excludeIngredients.value = [...defaultFilters.excludeIngredients];
      maxCalories.value = defaultFilters.maxCalories;
      includeQuery.value = "";
      excludeQuery.value = "";
      localStorage.removeItem("recipeFilters");
      store.dispatch('recipe/fetchRecipes') // Чтобы при сбрасывании фильтров сразу обновлялись рецепты на странице и не нужно было обновлять страницу
    };

    // Получение категорий из базы
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/api/categories/");
        categories.value = response.data;
      } catch (error) {
        console.error("Ошибка получения категорий:", error);
      }
    };

    // Получение ингредиентов с автодополнением
    const fetchIngredients = async (query) => {
      if (query.length < 2) {
        includeSuggestions.value = [];
        excludeSuggestions.value = [];
        return;
      }
      try {
        const response = await axios.get(`http://localhost/api/ingredients/?query=${query}`);
        if (includeQuery.value === query) {
          includeSuggestions.value = response.data;
        } else {
          excludeSuggestions.value = response.data;
        }
      } catch (error) {
        console.error("Ошибка загрузки ингредиентов:", error);
      }
    };

    // Добавление ингредиента в список
    const addIngredient = (ingredient, type) => {
      if (!ingredient.trim()) return;
      if (type === "include" && !includeIngredients.value.includes(ingredient)) {
        includeIngredients.value.push(ingredient);
      } else if (type === "exclude" && !excludeIngredients.value.includes(ingredient)) {
        excludeIngredients.value.push(ingredient);
      }
      includeQuery.value = "";
      excludeQuery.value = "";
      includeSuggestions.value = [];
      excludeSuggestions.value = [];
    };

    // Удаление ингредиента
    const removeIngredient = (index, type) => {
      if (type === "include") {
        includeIngredients.value.splice(index, 1);
      } else if (type === "exclude") {
        excludeIngredients.value.splice(index, 1);
      }
    };

    // Применение фильтров
    const applyFilters = async () => {
      try {
        const response = await axios.get("http://localhost/api/recipes/filter/", {
          params: {
            category: selectedCategory.value,
            includeIngredients: includeIngredients.value,
            excludeIngredients: excludeIngredients.value,
            maxCalories: maxCalories.value,
          }
        });

        // Фильтрация должна обновить рецепты в Vuex:
        store.commit('recipe/setRecipes', response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рецептов:", error);
      }
    };

    return {
      selectedCategory,
      categories,
      includeQuery,
      excludeQuery,
      includeIngredients,
      excludeIngredients,
      includeSuggestions,
      excludeSuggestions,
      maxCalories,
      fetchIngredients,
      addIngredient,
      removeIngredient,
      applyFilters,
      filtersChanged,
      resetFilters,
    };
  },
});
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.filter {
  position: relative; /* Чтобы выпадающий список абсолютно позиционир относит поля */
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.filter label {
  font-size: 14px;
  margin-bottom: 5px;
}

.filter-input {
  border: 1px solid #333;
  border-radius: 5px;
  padding: 8px;
  font-size: 14px;
}

.suggestions {
  position: absolute;
  top: 100%; /* Располагаем список сразу под полем ввода */
  left: 0;
  width: 100%; /* Делаем ширину как у поля ввода */
  background: white;
  border: 1px solid #ccc;
  border-top: none; /* Убираем границу сверху, чтобы не дублировалась */
  border-radius: 5px;
  list-style: none;
  padding: 5px;
  margin: 0;
  max-height: 120px;
  overflow-y: auto;
  z-index: 10;
}

.suggestions li {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.suggestions li:hover {
  background: #f0f0f0;
}

.selected-tags {
  margin-top: 5px;
}

.selected-tags:empty {
  margin-top: 0; /* Убираем отступ, если внутри ничего нет */
}

.tag {
  display: inline-flex;
  align-items: center;
  background: #ddd;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 5px;
  font-size: 12px;
  margin-bottom: 2px;
}

.tag button {
  background: none;
  border: none;
  margin-left: 5px;
  cursor: pointer;
}
</style>