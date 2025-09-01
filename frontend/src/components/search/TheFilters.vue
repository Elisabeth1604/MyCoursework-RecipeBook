<template>
    <div v-if="isMobile">
        <AppButton @click="openModal"
                   class="filters-button">
            <template #icon>
                <img :src="require('@/assets/icons/filters.png')" style="width: 20px"/>
            </template>
            Фильтры
        </AppButton>

        <FiltersModal v-if="showModal"
                      @close="showModal = false">
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

    <div v-else
         class="filters-container"
    >
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

<script setup>
import { useStore } from 'vuex';
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import axios from 'axios';
import FiltersModal from '@/modal/FiltersModal.vue';
import FiltersForm from '@/components/forms/FiltersForm.vue';
import {
    AppButton,
} from '@ui';

const store = useStore();

const categories = ref([]);

const showModal = ref(false);

const isMobile = ref(window.innerWidth < 1200);

const handleResize = () => {
    isMobile.value = window.innerWidth < 1200;
};

const openModal = () => {
    showModal.value = true;
};

const initialFilters = {
    selectedCategory: '',
    includeQuery:     '',
    excludeQuery:     '',
    includeIngredients: [],
    excludeIngredients: [],
    maxCalories: null,
};

const filters = ref({ ...initialFilters });

function saveFilters() {
    localStorage.setItem('recipeFilters', JSON.stringify(filters.value));
}
watch(filters, saveFilters, { deep: true });

const filtersChanged = computed(() => {
    return JSON.stringify(filters.value) !== JSON.stringify(initialFilters);
});

const fetchCategories = async () => {
    try {
        const response = await axios.get('http://localhost/api/categories/');
        categories.value = response.data;
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
    }
};

const resetFilters = () => {
    filters.value = { ...initialFilters };
    localStorage.removeItem('recipeFilters');
    store.dispatch('recipe/fetchRecipes');
};

const applyFilters = async () => {
    const params = new URLSearchParams();
    if (filters.value.selectedCategory) {
        params.append('category', filters.value.selectedCategory);
    }

    filters.value.includeIngredients.forEach(i => params.append('includeIngredients[]', i));
    filters.value.excludeIngredients.forEach(i => params.append('excludeIngredients[]', i));

    if (filters.value.maxCalories != null) {
        params.append('maxCalories', filters.value.maxCalories);
    }

    try {
        const { data } = await axios.get(
            `http://localhost/api/recipes/filter/?${params.toString()}`,
        );
        store.commit('recipe/setRecipes', data);
        showModal.value = false;
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);

    fetchCategories();

    const raw = localStorage.getItem('recipeFilters');
    if (raw) {
        Object.assign(filters.value, JSON.parse(raw));
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
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
