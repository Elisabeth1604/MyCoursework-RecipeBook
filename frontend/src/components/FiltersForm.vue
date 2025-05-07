<template>
  <!-- Категория рецепта -->
  <div class="filter">
    <label for="category">Категория</label>
    <select v-model="localSelectedCategory" class="filter-input">
      <option value="">Любая категория</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.category_name }}
      </option>
    </select>
  </div>

  <!-- Включить ингредиенты -->
  <div class="filter">
    <app-input
        label="Включить ингредиенты"
        name="include-ingredients"
        iD="include-ingredients"
        type="text"
        v-model="localIncludeQuery"
        input-class="filter-input"
        placeholder="Введите ингредиент"
        @keydown.enter.prevent="addIngredient(localIncludeQuery, 'include')"
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
    <app-input
        label="Исключить ингредиенты"
        name="exclude-ingredients"
        iD="exclude-ingredients"
        type="text"
        v-model="localExcludeQuery"
        input-class="filter-input"
        placeholder="Введите ингредиент"
        @keydown.enter.prevent="addIngredient(localExcludeQuery, 'exclude')"
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
    <app-input
        label="Калорийность (не более)"
        name="calories"
        iD="calories"
        type="number"
        v-model.number="localMaxCalories"
        input-class="filter-input"
        placeholder="Введите калории" />
  </div>

  <!-- Кнопка "Подобрать рецепты" -->
  <button @click="applyFilters" class="select-button">Подобрать рецепты</button>
  <!-- Кнопка сброса фильтров (появляется, если фильтры изменены) -->
  <button v-if="filtersChanged" @click="resetFilters" class="select-button">Сбросить</button>
</template>

<script>
import AppInput from "@/components/AppInput.vue";
import {computed, defineComponent, onMounted, onUnmounted, ref, toRefs, watch} from "vue";
import {useStore} from "vuex";
import axios from "axios";

export default defineComponent( {
  components: { AppInput },
  props: {
    categories: { type: Array, default: () => [] },
    selectedCategory: { type: String, default: "" },
    includeQuery: String,
    excludeQuery: String,
    includeIngredients: { type: Array, default: () => [] },
    excludeIngredients: { type: Array, default: () => [] },
    maxCalories: { type: Number, default: null },
    includeSuggestions: { type: Array, default: () => [] },
    excludeSuggestions: { type: Array, default: () => [] },
    filtersChanged: { type: Boolean, default: false },
  },
  emits: [
    'update:selectedCategory',
    'update:includeQuery',
    'update:excludeQuery',
    'update:includeIngredients',
    'update:excludeIngredients',
    'update:maxCalories',
    'fetch-ingredients',
    'add-ingredient',
    'remove-ingredient',
    'apply-filters',
    'reset-filters',
  ],
  setup(props, { emit }) {
    const includeSuggestions = ref([]);
    const excludeSuggestions = ref([]);
    const loading       = ref(false);

    // Нельзя напрямую менять значение props, поэтому используем локальные computed
    const localIncludeQuery = computed({
      get: () => props.includeQuery,
      set: (value) => emit('update:includeQuery', value)
    });

    const localExcludeQuery = computed({
      get: () => props.excludeQuery,
      set: (value) => emit('update:excludeQuery', value)
    });

    const localSelectedCategory = computed({
      get: ()    => props.selectedCategory,
      set: value => emit('update:selectedCategory', value)
    });

    const localMaxCalories = computed({
      get: ()    => props.maxCalories,
      set: value => emit('update:maxCalories', value)
    });

    watch(localIncludeQuery, v => fetchIngredients(v, "include"));
    watch(localExcludeQuery, v => fetchIngredients(v, "exclude"));

    const {
      categories, selectedCategory,
      includeIngredients,
      excludeIngredients,
      maxCalories,
      filtersChanged
    } = toRefs(props);

    // Получение ингредиентов с автодополнением
    const fetchIngredients = async (query, type) => {
      if (!query || query.length < 2) {
        includeSuggestions.value = [];
        excludeSuggestions.value = [];
        return;
      }
      loading.value = true;
      try {
        const { data } = await axios.get(`http://localhost/api/ingredients/?query=${query}`);
        if (type === "include") includeSuggestions.value = data;
        else                   excludeSuggestions.value = data;
      } catch (e) {
        console.error("Ошибка при получении ингредиентов:", e);
      } finally {
        loading.value = false;
      }
    };

    // Добавление ингредиента в список
    const addIngredient = (name, type) => {
      if (!name.trim()) return;
      if (type === "include") {
        emit("update:includeIngredients", [...props.includeIngredients, name]);
        localIncludeQuery.value = "";
        includeSuggestions.value = [];
      } else {
        emit("update:excludeIngredients", [...props.excludeIngredients, name]);
        localExcludeQuery.value = "";
        excludeSuggestions.value = [];
      }
    };

    // Удаление ингредиента
    const removeIngredient = (index, type) => {
      const list = type === "include" ? [...props.includeIngredients] : [...props.excludeIngredients];
      list.splice(index, 1);
      emit(type === "include"
          ? "update:includeIngredients"
          : "update:excludeIngredients", list);
    };

    function applyFilters() {
      emit('apply-filters');
    }

    function resetFilters() {
      emit('update:selectedCategory', "");
      emit('update:includeIngredients', []);
      emit('update:excludeIngredients', []);
      emit('update:maxCalories', null);
      localIncludeQuery.value = "";
      localExcludeQuery.value = "";
      emit('reset-filters'); // Дополнительно сообщаем родителю
    }

    return {
      categories,
      selectedCategory,
      includeIngredients,
      excludeIngredients,
      maxCalories,
      filtersChanged,
      includeSuggestions,
      excludeSuggestions,
      fetchIngredients,
      addIngredient,
      removeIngredient,
      applyFilters,
      resetFilters,
      localIncludeQuery,
      localExcludeQuery,
      localSelectedCategory,
      localMaxCalories
    };
  },
});
</script>

<style scoped>
.filter {
  position: relative; /* Чтобы выпадающий список абсолютно позиционир относит поля */
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.filter label {
  margin-bottom: 3px;
}

.filter-input {
  border: 1px solid #333;
  border-radius: 5px;
  padding: 8px;
  font-size: 14px;
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

@media (max-width: 970px) {
  .filters-container {
    justify-content: start;
  }
}
</style>