<template>
    <AppPage title="Добавленные рецепты"> <!-- Использую шаблон AppPage(название и контейнер для контента)
                                                для главной, избранного, профиля и моих рецептов-->
        <div class="section">
            <img :src="require('@/assets/icons/public.png')"/>
            <h3>Публичные</h3>
        </div>

        <div v-if="myPublicRecipes.length"
             class="recipes">
            <AppRecipeCard v-for="recipe in myPublicRecipes"
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
                           @delete-my-recipe="handleDelete(recipe.id)"/>
        </div>

        <div v-else>
            <p>У вас ещё нет добавленных публичных рецептов
                <RouterLink to="/add-recipe"
                            class="link"> добавьте первый
                </RouterLink>!
            </p>
        </div>

        <hr>

        <div class="section">
            <img :src="require('@/assets/icons/private.png')"/>
            <h3>Только для меня</h3>
        </div>

        <div v-if="myPrivateRecipes.length"
             class="recipes">
            <AppRecipeCard v-for="recipe in myPrivateRecipes"
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
                           @delete-my-recipe="handleDelete(recipe.id)"/>
        </div>

        <div v-else>
            <p>У вас ещё нет добавленных личных рецептов
                <RouterLink to="/add-recipe"
                            class="link"> добавьте первый
                </RouterLink>!
            </p>
        </div>
    </AppPage>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import AppRecipeCard from '@/components/cards/AppRecipeCard.vue';
import {
    AppPage,
} from '@ui';

defineOptions({
    name: 'MyRecipes',
});

const store = useStore();
const currentUser = computed(() => store.getters['user/user']);
const expandedCardId = ref(null);

const toggleCard = (id) => {
    expandedCardId.value = expandedCardId.value === id ? null : id;
};

const myRecipes = computed(() => {
    return currentUser.value
        ? store.getters['recipe/getUserRecipes'](currentUser.value.id)
        : [];
});

const myPublicRecipes = computed( () => {
    return myRecipes.value.filter(recipe => recipe.is_public);
});

const myPrivateRecipes = computed( () => {
    return myRecipes.value.filter(recipe => !recipe.is_public);
});

const handleDelete = async (recipeId) => {
    try {
        await axios.delete(`http://localhost/api/recipes/${recipeId}/`);
        await store.dispatch('recipe/fetchRecipes');
        store.dispatch(
            'setMessage',
            { type: 'success', text: 'Рецепт удален!', position: 'app-message' },
            { root: true });
    } catch (error) {
        console.error('Ошибка при удалении рецепта:', error);
        store.dispatch(
            'setMessage',
            { type: 'error', text: `${error.response.data}`, position: 'app-message' },
            { root: true });
    }
};

onMounted(async () => {
    await store.dispatch('recipe/fetchRecipes');
});
</script>

<style scoped>
hr {
    margin-top: 35px;
}

.section {
    display: flex;
}

.section img {
    height: 35px;
    margin-top: 10px;
    margin-right: 10px;
}
</style>
