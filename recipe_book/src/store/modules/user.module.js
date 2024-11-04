export default{
    namespaced: true,
    state: {
        user: {
          id: null,
          name: '',
          email: '',
          avatar: '', // URL для аватара пользователя
        },
    },
    getters: {
        user: (state) => state.user,
    },
    mutations: {
        setUser(state, userData) {
            state.user = { ...state.user, ...userData };
          },
          clearUser(state) {
            state.user = {
              id: null,
              name: '',
              email: '',
              avatar: '',
            }
        }
    },
    actions: {
        fetchUser({ commit }, userId) {
            // Здесь вы можете выполнить запрос к API для получения данных пользователя
            // Пример (замените на свой API):
            // axios.get(`/api/users/${userId}`).then(response => {
            //   commit('setUser', response.data);
            // });
        
            // Для примера, добавим статичные данные:
            const userData = {
              id: userId,
              name: 'Елизавета',
              email: 'elizaveta@example.com',
              avatar: 'https://via.placeholder.com/100',
            };
            commit('setUser', userData);
          }
    }
}