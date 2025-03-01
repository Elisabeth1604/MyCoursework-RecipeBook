import { createStore, createLogger } from 'vuex'
import auth from './modules/auth.module'
import recipe from './modules/recipe.module';
import user from './modules/user.module'

const plugins = []

if(process.env.NODE_ENV === 'development'){ // Если мы находимся в режиме разработки
  plugins.push(createLogger()) // Добавляем плагин, чтобы следить, что находится со стором
}

let messageTimeoutId = null;
let fadeTimeoutId = null;

export default createStore({
  plugins,
  state(){
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

    setMessage(state, { type, text, position = "default", fadingOut = false }) {
      state.message = { type, text, position, fadingOut };
      state.showMessage = true;
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

    setMessage({ commit }, message) {
      // Очищаем предыдущие таймауты, если они есть
      if (messageTimeoutId) clearTimeout(messageTimeoutId);
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId);

      // Сразу устанавливаем сообщение без fadingOut
      commit("setMessage", { ...message, fadingOut: false });

      // Через 4.5 сек запускаем анимацию исчезновения
      messageTimeoutId = setTimeout(() => {
        commit("setMessage", { ...message, fadingOut: true });
        // Через 0.5 сек полностью скрываем сообщение
        fadeTimeoutId = setTimeout(() => {
          commit("clearMessage");
        }, 500);
      }, 4500);
    },
    closeMessage({ commit, state }) {
      // Отменяем запланированные таймауты
      if (messageTimeoutId) {
        clearTimeout(messageTimeoutId);
        messageTimeoutId = null;
      }
      if (fadeTimeoutId) {
        clearTimeout(fadeTimeoutId);
        fadeTimeoutId = null;
      }
      // Если сообщение всё ещё отображается, запускаем анимацию исчезновения
      if (state.showMessage && state.message && !state.message.fadingOut) {
        commit("setMessage", { ...state.message, fadingOut: true });
        fadeTimeoutId = setTimeout(() => {
          commit("clearMessage");
        }, 500);
      }
    },
  },
  modules: {
    auth, recipe, user
  }
})
