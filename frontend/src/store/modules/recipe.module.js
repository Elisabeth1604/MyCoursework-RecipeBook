import axios from "axios";

export default {
    namespaced: true,
    state: {
      recipes:[], // Здесь хранятся рецепты, которые пришли с бэка, все либо же с какими-то фильтрами, удобно обращаться сюда из компонента
      servings: 4, // Это текущее количество порций, по дефолту 4, но заменяется на указанное автором рецепта, пользователь меняет через UI и пересчитывает ингредиенты
    },
    getters: {
        // Возвращает все рецепты
        allRecipes: (state) => state.recipes,
        // Возвращает рецепт
        recipe: (state) => state.recipe,
        // Возвращает текущее количество порций
        servings: (state) => state.servings,
        // Пересчитывает ингредиенты на основе количества порций
        adjustedIngredients: (state) => {
            if (!state.recipe || !Array.isArray(state.recipe.ingredients)) {
              return [];
            }
          
            return state.recipe.ingredients.map((ingredient) => ({
              name: ingredient.ingredient.ingredient_name,
              amount: ((ingredient.quantity / state.recipe.servings) * state.servings).toFixed(1),
              unit: ingredient.unit || ''
            }));
        },
        getRecipeById: (state) => (id) => {
            console.log(id)
            return state.recipes.find(recipe => Number(recipe.id) === id)|| null;
        },
        // Возвращает рецепты для текущего пользователя
        getUserRecipes: (state) => (userId) => {
            return state.recipes.filter(recipe => recipe.user && recipe.user.id === userId);
        },
    },
    mutations: {
        setRecipe(state, recipe) {
            state.recipe = recipe;
            state.servings = recipe.servings; // Чтобы при открытии карточки отображалось то количество порций, которое задумал автор
        },
        setRecipes(state, recipes) {
            state.recipes = recipes;
        },
        // Изменяет количество порций
        setServings(state, servings) {
            state.servings = Math.max(1, servings); // Минимум 1 порция
        },
    },
    actions: {
        async fetchRecipes({ commit }) {
            try {
                const response = await axios.get('http://localhost/api/recipes/');
                commit('setRecipes', response.data);
            } catch (error) {
                console.error("Ошибка получения рецептов:", error);
            }
        },
        async searchRecipes({ commit }, searchQuery) {
            try {
                const response = await axios.get(`http://localhost/api/recipes/?search=${encodeURIComponent(searchQuery)}`);
                commit('setRecipes', response.data);
            } catch (error) {
                console.error("Ошибка поиска рецептов:", error);
            }
        },
        // Устанавливаем текущий рецепт
        setRecipe({ commit }, recipe) {
            commit('setRecipe', recipe);
        },
        // Действие для изменения количества порций
        updateServings({ commit }, amount) {
            commit('setServings', amount);
        },
    },
  };