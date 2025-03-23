import axios from "axios";

const TOKEN_KEY = 'jwt-token'
const API_URL = 'http://localhost/api/'

export default {
    namespaced: true,
    state: {
        recipes:[], // Здесь хранятся рецепты, которые пришли с бэка, все либо же с какими-то фильтрами, удобно обращаться сюда из компонента
        servings: 4, // Это текущее количество порций, по дефолту 4, но заменяется на указанное автором рецепта, пользователь меняет через UI и пересчитывает ингредиенты
        favourites: {}, // Здесь хранится избранное
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

        getUserFavourites: (state) => state.favourites

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

        add_recipe(state, recipe) {
            state.recipes.push(recipe);
        },

        setFavourites(state, data) {
            state.favourites= data;
        },
    },
    actions: {
        async fetchRecipes({ commit }) {
            try {
                const response = await axios.get(`${API_URL}recipes/`);
                commit('setRecipes', response.data);
            } catch (error) {
                console.error("Ошибка получения рецептов:", error);
            }
        },

        async searchRecipes({ commit }, searchQuery) {
            try {
                const response = await axios.get(`${API_URL}recipes/?search=${encodeURIComponent(searchQuery)}`);
                commit('setRecipes', response.data);
            } catch (error) {
                console.error("Ошибка поиска рецептов:", error);
            }
        },

        async addRecipe({ commit }, recipeData) {
            try {
                const response = await axios.post(`${API_URL}recipes/`, recipeData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`, // если требуется авторизация
                        'Content-Type': 'application/json'
                    }
                });

                commit('add_recipe', response.data);
            } catch (error) {
                console.error("Ошибка добавления рецепта:", error);
                // Пробрасываем ошибку, чтобы верхний уровень увидел её
                throw error
            }
        },

        async fetchFavourites({ commit, rootState }) {
            try {
                const response = await axios.get(`${API_URL}user/favourites`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                    }
                });
                commit('setFavourites', response.data );
            } catch (error) {
                console.error("Ошибка получения избранного:", error);
            }
        },

        async removeFromFavourites({ dispatch }, recipeId) {
            try {
                await axios.delete(`${API_URL}user/favourites/${recipeId}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                    }
                });
                // Обновляем список избранного после удаления
                await dispatch('fetchFavourites');
            } catch (error) {
                console.error("Ошибка удаления из избранного:", error);
            }
        },

        async addToFavourites({ dispatch }, recipeId) {
            try {
                await axios.post(`${API_URL}user/favourites/`, {
                    recipe_id: recipeId
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
                    }
                });
                // Обновим список
                await dispatch('fetchFavourites');
            } catch (error) {
                console.error("Ошибка при добавлении в избранное:", error);
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