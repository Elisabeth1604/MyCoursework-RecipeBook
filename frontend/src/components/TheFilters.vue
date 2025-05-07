<template>
  <div v-if="isMobile">
    <app-button @click="openModal" class="filters-button">
      <template #icon>
        <img :src="require('@/assets/icons/filters.png')" style="width: 20px"/>
      </template>
      Фильтры</app-button>
    <FiltersModal v-if="showModal" @close="showModal = false">
      <FiltersForm
          v-bind="filters"
          :categories="categories"
          :filtersChanged="filtersChanged"
          @update:selectedCategory="v => filters.selectedCategory = v"
          @update:includeQuery="v => filters.includeQuery = v"
          @update:excludeQuery="v => filters.excludeQuery = v"
          @update:includeIngredients="v => filters.includeIngredients = v"
          @update:excludeIngredients="v => filters.excludeIngredients = v"
          @update:maxCalories="v => filters.maxCalories = v"
          @apply-filters="applyFilters"
          @reset-filters="resetFilters"
      />
    </FiltersModal>
  </div>
  <div v-else class="filters-container">
    <FiltersForm
        v-bind="filters"
        :categories="categories"
        :filtersChanged="filtersChanged"
        @update:selectedCategory="v => filters.selectedCategory = v"
        @update:includeQuery="v => filters.includeQuery = v"
        @update:excludeQuery="v => filters.excludeQuery = v"
        @update:includeIngredients="v => filters.includeIngredients = v"
        @update:excludeIngredients="v => filters.excludeIngredients = v"
        @update:maxCalories="v => filters.maxCalories = v"
        @apply-filters="applyFilters"
        @reset-filters="resetFilters"
    />
  </div>
</template>

<script>
import {useStore} from "vuex";
import {defineComponent, onMounted, ref, watch, computed, onUnmounted} from "vue";
import axios from "axios";
import AppInput from "@/components/AppInput.vue";
import FiltersModal from "@/modal/FiltersModal.vue";
import FiltersForm from "@/components/FiltersForm.vue";
import AppButton from "@/components/AppButton.vue";

export default defineComponent( {
  components: {AppButton, AppInput, FiltersModal, FiltersForm },
  setup(props, { emit }) {
    const store = useStore()

    const categories = ref([]);

    const showModal = ref(false)

    const isMobile = ref(window.innerWidth < 1200)

    const handleResize = () => {
      isMobile.value = window.innerWidth < 1200
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    const openModal = () => {
      showModal.value = true
    }
    const closeModal = () => {
      showModal.value = false
    }


    // Дефолтные значения фильтров
    const initialFilters = {
      selectedCategory: "",
      includeQuery:     "",
      excludeQuery:     "",
      includeIngredients: [],
      excludeIngredients: [],
      maxCalories: null,
    };

    // Объект с текущими фильтрами
    const filters = ref({ ...initialFilters });

    // Сохраняем в localStorage при любом изменении filters
    function saveFilters() {
      localStorage.setItem("recipeFilters", JSON.stringify(filters.value));
    }
    watch(filters, saveFilters, { deep: true });

    // При монтировании восстанавливаем из localStorage (если есть)
    onMounted(() => {
      const raw = localStorage.getItem("recipeFilters");
      if (raw) {
        try {
          Object.assign(filters.value, JSON.parse(raw));
        } catch {}
      }
    });

    // Флаг "изменены текущие фильтры по сравнению с дефолтом"
    const filtersChanged = computed(() => {
      return JSON.stringify(filters.value) !== JSON.stringify(initialFilters);
    });

    // Получение категорий из базы
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/api/categories/");
        categories.value = response.data;
      } catch (error) {
        console.error("Ошибка получения категорий:", error);
      }
    };

    onMounted(fetchCategories)

    // Функция сброса фильтров
    const resetFilters = () => {
      filters.value = { ...initialFilters };
      localStorage.removeItem("recipeFilters");
      store.dispatch('recipe/fetchRecipes');
    };


    // Применение фильтров
    const applyFilters = async () => {
      const params = new URLSearchParams();
      if (filters.value.selectedCategory) params.append("category", filters.value.selectedCategory);
      filters.value.includeIngredients.forEach(i => params.append("includeIngredients[]", i));
      filters.value.excludeIngredients.forEach(i => params.append("excludeIngredients[]", i));
      if (filters.value.maxCalories != null) params.append("maxCalories", filters.value.maxCalories);

      try {
        const { data } = await axios.get(
            `http://localhost/api/recipes/filter/?${params.toString()}`
        );
        store.commit("recipe/setRecipes", data);
        showModal.value = false;
      } catch (e) {
        console.error(e);
      }
    };

    return {
      showModal,
      isMobile,
      openModal,
      closeModal,
      initialFilters,
      applyFilters,
      resetFilters,
      filtersChanged,
      filters,
      categories
    };
  },
});
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 15px;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


</style>