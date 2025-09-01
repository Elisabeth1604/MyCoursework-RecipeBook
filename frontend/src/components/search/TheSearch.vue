<template>
    <div class ="search-form"
         :class="{ hidden: !showSearch() }">
        <input class ="search-form_txt"
               id="search-form_txt"
               type="text"
               v-model="searchQuery"
               placeholder="Найти рецепт">

        <AppButton
            @action="search"
            button-class="search-button"
        >Поиск</AppButton>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import {
    AppButton,
} from '@ui';

const store = useStore();
const route = useRoute();
const searchQuery = ref('');

const search = () => {
    if (searchQuery.value.trim()) {
        if (route.path === '/favourite')
            store.dispatch('recipe/searchRecipesFavourites', searchQuery.value);
        if (route.path === '/' || route.path === '/my-recipes')
            store.dispatch('recipe/searchRecipes', searchQuery.value);

        return;
    }
    store.dispatch('recipe/fetchRecipes');
};

const showSearch = () => {
    return route.path !== '/add-recipe' && !route.path.startsWith('/profile') && route.path !== '/calorie-calculator';
};
</script>

<style scoped>
.search-form {
    display: flex;
    align-items: center;
    padding: 5px;

    background-color: #fff;
    border-radius: 5px;
}

.search-form input {
    width: 300px;
    padding: 10px;

    border-radius: 5px;
    border: none;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.hidden {
    visibility: hidden;
}

@media (max-width: 1030px) {
    .search-form input {
        width: 250px;
    }
}

@media (max-width: 730px) {
    .search-form {
        height: 30px;
        margin-right: 10px;
        margin-left: 10px;
    }
    .search-form input {
        width: 200px;
        height: 10px;
    }
}

@media (max-width: 567px) {
    .search-form input {
        width: 150px;
    }
}

@media (max-width: 480px) {
    .search-form input {
        width: 100px;
        font-size: 12px;
    }
    .search-form{
        margin-right: 10px;
        margin-left: 10px;
    }
    .search-button{
        font-size: 12px;
    }
}

@media (max-width: 400px) {
    .search-form input {
        width: 80px;
        font-size: 11px;
    }
    .search-button{
        font-size: 11px;
    }
}
</style>
