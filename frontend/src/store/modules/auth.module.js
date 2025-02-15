const TOKEN_KEY = 'jwt-token'

export default {
    namespaced: true, // Чтобы названия экшенов были локальными, а не глобальными

    state(){
        return{
            token: localStorage.getItem(TOKEN_KEY), // По токену будем определять, авторизован ли человек, причем начальное значение указываем не null, а получаем из localStorage
            // чтобы при обновлении страницы авторизация не сбрасывалась
            // isLoginVisible: false
        }
    },

    mutations:{ // Здесь асинхронный код, изменяющий state
        setToken(state, token){
            state.token = token
            localStorage.setItem(TOKEN_KEY, token)
        },
        logout(state){ // Для выхода, не обязательно делать это асинхронно, т к нет запроса на сервер
            state.token = null
            localStorage.removeItem(TOKEN_KEY) // Удаляем из localStorage
        },
        // setLoginVisible(state, isVisible) {
        //     state.isLoginVisible = isVisible;
        // }
    },

    actions:{
        async login({commit, dispatch}, payload){ // Здесь будем делать запрос к базе данных, когда что-то прилетит с сервера, будем вызывать мутацию
            try {
                commit('setToken', 'TEST TOKEN') // Временный метод, вызывающий мутацию
                commit('clearMessage', null, {root : true})
            } catch (e) {
                dispatch('setMessage', {
                    value: error(e.responce.data.error.message),
                    type: error
                }, {root : true})
                throw new Error // Если войти не удалось
            }

        }
    },

    getters:{
        token(state){
            return state.token
        },
        isAuntheticated(_, getters){
            return !!getters.token // Двойным отрицанием приводим токен к булевому значению, чтобы в зависимости от его значения возвращать состояние isAuthenticated
        }
    }
    
}