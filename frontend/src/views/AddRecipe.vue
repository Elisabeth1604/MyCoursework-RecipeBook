<template>
    <div>
        <h2>Добавление нового рецепта</h2>

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

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import AppRecipeForm from '@/components/forms/AppRecipeForm.vue';
import axios from 'axios';

document.title='Добавление рецепта | Поделюсь рецептом';

const store = useStore();
const units = ref([]);
const categories = ref([]);

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
        { ingredient: { id: null, ingredient_name: '' }, quantity: '', unit: '', suggestions: [] },
    ],
    steps: [
        { description: '', photo: '' },
    ],
});

const handleCreate = async (recipeData) => {
    try {
        await store.dispatch('recipe/addRecipe', recipeData);
        store.dispatch('setMessage', {
            type: 'success',
            text: 'Рецепт успешно добавлен!',
            position: 'app-message',
        });
    } catch {
        store.dispatch('setMessage', {
            type: 'error',
            text: 'Ошибка при добавлении рецепта',
            position: 'app-message',
        });
    }
};

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
        const response = await axios.get('http://localhost/api/categories/');
        categories.value = response.data;
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
    }
};

onMounted(async () => {
    await fetchUnits();
    await fetchCategories();
});
</script>
