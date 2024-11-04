import { createStore, createLogger } from 'vuex'
import auth from './modules/auth.module'
import recipe from './modules/recipe.module';
import user from './modules/user.module'
// import { db, storage } from '../services/firebase'; // Импортируйте ваше подключение к Firebase

const plugins = []

if(process.env.NODE_ENV === 'development'){ // Если мы находимся в режиме разработки
  plugins.push(createLogger()) // Добавляем плагин, чтобы следить, что находится со стором
}

export default createStore({
  plugins,
  state() {
    return {
      recipes: [], // Здесь хранить рецепты
      message: null, // Сообщения об ошибках, успехе или предупреждении
      showMessage: false // Флаг для отображения сообщения
    };
  },
  getters: {
    allRecipes(state) {
      return state.recipes;
    },
    message(state){
      return state.message
    },
    showMessage(state) {
      return state.showMessage;
    }
  },
  mutations: {
    ADD_RECIPE(state, recipe) {
      state.recipes.push(recipe);
    },

    setMessage(state, message){
      state.message = message;
      state.showMessage = true; // Устанавливаем флаг для отображения сообщения
    },

    clearMessage(state){ //Очищение сообщения
      state.message = null;
      state.showMessage = false; // Сбрасываем флаг для отображения сообщения
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

    setMessage({commit}, message){
      commit('setMessage', message)
      setTimeout(() => {
        commit('clearMessage') //Закрываем сообщение автоматически через 5 секунд
      }, 5000)
    }
  },
  modules: {
    auth, recipe, user
  }
})
