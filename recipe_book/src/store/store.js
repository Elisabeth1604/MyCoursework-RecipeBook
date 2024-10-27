import { createStore, createLogger } from 'vuex'
import auth from './modules/auth.module'
// import { db, storage } from '../services/firebase'; // Импортируйте ваше подключение к Firebase

const plugins = []

if(process.env.NODE_ENV === 'development'){ // Если мы находимся в режиме разработки
  plugins.push(createLogger()) // Добавляем плагин, чтобы следить, что находится со стором
}

export default createStore({
  plugins,
  state() {
    return {
      recipes: [] // Здесь храните ваши рецепты
    };
  },
  getters: {
    allRecipes(state) {
      return state.recipes;
    }
  },
  mutations: {
    ADD_RECIPE(state, recipe) {
      state.recipes.push(recipe);
    }
  },
  actions: {
    async addRecipe({ commit }, recipe) {
      try {
        const response = await fetch('https://recipe-book-8f83f-default-rtdb.firebaseio.com/recipes.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recipe)
        });
        const firebaseData = await response.json();
        console.log('Recipe added:', firebaseData);
  
        // Коммит мутации, если нужно
        // commit('ADD_RECIPE', recipe);
      } catch (error) {
        console.error('Ошибка при добавлении рецепта в Store:', error);
      }
    },
  },
  modules: {
    auth
  }
})
