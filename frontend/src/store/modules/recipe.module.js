import axios from 'axios';

const TOKEN_KEY = 'jwt-token';
const API_URL = 'http://localhost/api/';

export default {
    namespaced: true,
    state: {
        recipes: [],
        servings: 4,
        favourites: [],
    },
    getters: {
        allRecipes: (state) => state.recipes,
        recipe: (state) => state.recipe,
        servings: (state) => state.servings,

        // Пересчитывает ингредиенты на основе количества порций
        adjustedIngredients: (state) => {
            if (!state.recipe || !Array.isArray(state.recipe.ingredients)) {
                return [];
            }

            return state.recipe.ingredients.map((ingredient) => ({
                name: ingredient.ingredient.ingredient_name,
                amount: ((ingredient.quantity / state.recipe.servings) * state.servings).toFixed(1),
                unit: ingredient.unit || '',
            }));
        },

        getRecipeById: (state) => (id) => {
            return state.recipes.find(recipe => Number(recipe.id) === id)|| null;
        },

        getUserRecipes: (state) => (userId) => {
            return state.recipes.filter(recipe => recipe.user && recipe.user.id === userId);
        },

        getUserPublicRecipes: (state) => (userId) => {
            return state.recipes.filter(recipe => recipe.user && recipe.user.id === userId && recipe.is_public);
        },

        getUserFavourites: (state) => state.favourites,
    },
    mutations: {
        setRecipe(state, recipe) {
            state.recipe = recipe;
            state.servings = recipe.servings; // Чтобы при открытии карточки отображалось то количество порций, которое задумал автор
        },

        setRecipes(state, recipes) {
            state.recipes = recipes;
        },

        setServings(state, servings) {
            state.servings = Math.max(1, servings);
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
                console.error('Ошибка получения рецептов:', error);
            }
        },

        async searchRecipes({ commit }, searchQuery) {
            try {
                const response = await axios.get(`${API_URL}recipes/?search=${encodeURIComponent(searchQuery)}`);
                commit('setRecipes', response.data);
            } catch (error) {
                console.error('Ошибка поиска рецептов:', error);
            }
        },

        async searchRecipesFavourites({ commit }, searchQuery) {
            try {
                const response = await axios.get(`${API_URL}user/favourites/?search=${encodeURIComponent(searchQuery)}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                });

                commit('setFavourites', response.data );
            } catch (error) {
                console.error('Ошибка поиска рецептов:', error);
            }
        },

        async addRecipe({ commit }, recipeData) {
            try {
                const response = await axios.post(`${API_URL}recipes/`, recipeData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`, // если требуется авторизация
                        'Content-Type': 'application/json',
                    },
                });

                commit('add_recipe', response.data);
            } catch (error) {
                console.error('Ошибка добавления рецепта:', error);
                throw error;
            }
        },

        async updateRecipe({ commit }, { recipeId, recipeData }) {
            try {
                const response = await axios.put(`${API_URL}recipes/${recipeId}/`, recipeData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                        'Content-Type': 'application/json',
                    },
                });

                return response.data;
            } catch (error) {
                console.error('Ошибка обновления рецепта:', error);
                throw error;
            }
        },

        async fetchFavourites({ commit }) {
            try {
                const response = await axios.get(`${API_URL}user/favourites`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                });

                commit('setFavourites', response.data );
            } catch (error) {
                console.error('Ошибка получения избранного:', error);
            }
        },

        async removeFromFavourites({ dispatch }, recipeId) {
            try {
                await axios.delete(`${API_URL}user/favourites/${recipeId}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                });

                await dispatch('fetchFavourites');
            } catch (error) {
                console.error('Ошибка удаления из избранного:', error);
            }
        },

        async addToFavourites({ dispatch }, recipeId) {
            try {
                await axios.post(`${API_URL}user/favourites/`, {
                    recipe_id: recipeId,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                });

                await dispatch('fetchFavourites');
            } catch (error) {
                console.error('Ошибка при добавлении в избранное:', error);
            }
        },

        async getRecipeComments(context, recipeId){
            try {
                const response = await axios.get(`${API_URL}recipes/${recipeId}/comments/`);
                return response.data;
            }
            catch (error) {
                console.error('Ошибка при получении комментариев к рецепту:', error);
                return [];
            }
        },

        async addRecipeComment ({}, { recipeId, newComment }){
            try {
                await axios.post(`http://localhost/api/recipes/${recipeId}/comments/`, {
                    text: newComment,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                });
            }
            catch (error) {
                console.error('Ошибка при добавлении комментария:', error);
                throw error;
            }
        },

        async deleteRecipeComment ({}, commentId){
            try {
                await axios.delete(`http://localhost/api/comments/${commentId}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                });
            }
            catch (error) {
                console.error('Ошибка при удалении комментария:', error);
                throw error;
            }
        },

        // текущий рецепт
        setRecipe({ commit }, recipe) {
            commit('setRecipe', recipe);
        },

        updateServings({ commit }, amount) {
            commit('setServings', amount);
        },
    },
};
