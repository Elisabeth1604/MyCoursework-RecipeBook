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

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import AppRecipeForm from '@/components/forms/AppRecipeForm.vue';
import axios from 'axios';

document.title='Редактирование рецепта | Поделюсь рецептом';
const store = useStore();
const route = useRoute();
const recipeId = Number(route.params.id);

const units = ref([]);
const categories = ref([]);
const editableRecipe = ref(null);

const handleUpdate = async (recipeData) => {
    try {
        await store.dispatch('recipe/updateRecipe', {
            recipeId,
            recipeData,
        });

        store.dispatch('setMessage', {
            type: 'success',
            text: 'Рецепт успешно обновлён!',
            position: 'app-message',
        });
    } catch {
        store.dispatch('setMessage', {
            type: 'error',
            text: 'Ошибка при обновлении рецепта',
            position: 'app-message',
        });
    }
};

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
        const response = await axios.get('http://localhost/api/categories/');
        return response.data;
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
    }
};

onMounted(async () => {
    const unitsRes = await fetchUnits();
    units.value = unitsRes || [];

    const catRes = await fetchCategories();
    categories.value = catRes || [];

    const recipe = store.getters['recipe/getRecipeById'](recipeId);

    if (recipe) {
        editableRecipe.value = JSON.parse(JSON.stringify(recipe));
        return;
    }

    try {
        await store.dispatch('recipe/fetchRecipes');

        if (recipe) {
            editableRecipe.value = JSON.parse(JSON.stringify(recipe));
            return;
        }

        console.warn('Рецепт не найден на сервере');
    } catch (error) {
        console.error('Ошибка загрузки рецепта с сервера:', error);
    }
});
</script>
