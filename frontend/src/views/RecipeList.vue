<!--Раздел Последние рецепты на главной RecipeList.vue с дочерним компонентом RecipeCard.vue-->
<template>
    <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
    <AppPage title="Последние рецепты" filters>
        <div v-if="publicRecipes && publicRecipes.length"
             class="recipes"
             ref="recipeGrid">
            <AppRecipeCard
                v-for="item in publicRecipes"
                :key="item.id"
                :recipe-id="item.id"
                :recipe-title="item.recipe_title"
                :recipe-description="item.description"
                :recipe-image="item.main_photo"
                :prepTimeMin="item.prep_time_min"
                :prepTimeHour="item.prep_time_hour"
                :ingredients="item.ingredients"
                :servings="item.servings"
                :calories="item.calories_per_100"
                :is-expanded="expandedCardId === item.id"
                :is-public="true"
                @toggle-card="toggleCard(item.id)"
            />
        </div>

        <div v-else
             class="no-recipes">
            <p>
                Таких рецептов пока нет, ваш может
                <RouterLink to="/add-recipe"
                            class="link"> стать первым
                </RouterLink>!
            </p>
        </div>
    </AppPage>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import AppRecipeCard from '@/components/cards/AppRecipeCard.vue';
import {
    AppPage,
} from '@ui';

defineOptions({
    name: 'App',
});

const expandedCardId = ref(null);
const store = useStore();

const recipes = computed(() => store.getters['recipe/allRecipes']);

const isAuth = computed(() => store.getters['auth/isAuthenticated']);

const publicRecipes = computed( () => {
    return recipes.value.filter(recipe => recipe.is_public);
});

const toggleCard = (id) => {
    expandedCardId.value = expandedCardId.value === id ? null : id;
};

onMounted(() => {
    store.dispatch('recipe/fetchRecipes');
    if (isAuth.value) {
        // Если выполнен вход, отображать рецепты, которые уже в избранном
        store.dispatch('recipe/fetchFavourites');
    }
});

// Следим за изменением авторизации (если пользователь войдет в профиль, сразу отметить избранные рецепты)
watch(isAuth, (newVal) => {
    store.dispatch('recipe/fetchRecipes');
    if (newVal) {
        store.dispatch('recipe/fetchFavourites');
    } else {
        store.commit('recipe/setFavourites', []);
    }
});
</script>

<style>
.recipe-list {
    max-width: 1200px;
    padding: 40px;
    margin: 0 auto;
}

.recipes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-items: start;
}

.no-recipes {
    margin-top: 40px;

    text-align: center;
    font-size: 16px;
}

.link{
    display: inline-block;
    margin-top: 5px;

    color:rgb(83, 127, 163);
    text-decoration-line: none;

    border-bottom: 1px solid;
}

.link:hover, .link:hover {
    color: #FF9973;
}

.link:active, .link:active {
    color: #fc511c;
}

@media (max-width: 1024px) {
    .recipes {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .recipes {
        grid-template-columns: 1fr;
    }
}
</style>
