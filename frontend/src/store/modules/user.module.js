import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/';
export default {
    namespaced: true,
    state: {
        user: {
            id: null,
            username: "",
            email: "",
            avatar: "", // URL для аватара пользователя
            date_joined: '',
            followers: [], // Подписчики
            subscriptions: [], // Подписки
        },
    },
    getters: {
        user: (state) => state.user,
        isSubscriber: (state) => (userId) => {
            return state.user.subscriptions.includes(userId) // Подписан я на пользователя userId или нет
        }
    },
    mutations: {
        setUser(state, userData) {
            state.user = { ...state.user, ...userData };
        },
        clearUser(state) {
            state.user = {
                id: null,
                username: "",
                email: "",
                avatar: "",
                date_joined: '',
                followers: [],
                subscriptions: [],
            };
        },
        addSubscription (state, userId) {
            if (!state.user.subscriptions.includes(userId)) {
                state.user.subscriptions.push(userId);
            }
        },
        removeSubscription (state, userId) {
            state.user.subscriptions = state.user.subscriptions.filter(id => id !== userId);
        }
    },
    actions: {
        async fetchUser({ commit, rootState }) {
            const token = rootState.auth.token; // Берем токен из auth модуля

            if (!token) {
                console.warn("Попытка загрузки профиля без авторизации.");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}user/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                commit("setUser", response.data); // Сохраняем данные пользователя
            } catch (error) {
                console.error("Ошибка загрузки пользователя:", error.response ? error.response.data : error);
            }
        },

        async updateUser({ commit, rootState }, formData) {
            const token = rootState.auth.token; // Берем токен из auth модуля

            // Проверка: есть ли хотя бы одно поле в formData
            if (![...formData.entries()].length) {
                console.warn("Пустая форма — запрос не отправлен.");
                return;
            }

            try {
                //console.log("Отправляемые данные:", formData);
                const response = await axios.put(`${API_URL}user/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                commit("setUser", response.data); // Обновляем данные пользователя в store
            } catch (error) {
                console.error("Ошибка при обновлении профиля:", error);
                throw error;
            }
        },

        logoutUser({ commit }) {
            commit("clearUser"); // Чистим данные пользователя при выходе
        },

        async subscribe({ commit }, userId) {
            try {
                await axios.post(`${API_URL}subscriptions/${userId}/`);
                commit('addSubscription', userId);
            } catch (error) {
                throw new Error('Ошибка подписки');
            }
        },

        async unsubscribe({ commit }, userId) {
            try {
                await axios.delete(`${API_URL}subscriptions/${userId}/`);
                commit('removeSubscription', userId);
            } catch (error) {
                throw new Error('Ошибка отписки');
            }
        },

        async fetchUserById({ commit }, userId) {
            try {
                const response = await axios.get(`${API_URL}user/${userId}/`);
                return response.data; // Возвращаем данные пользователя
            } catch (error) {
                throw new Error('Ошибка загрузки пользователя');
            }
        },

        async fetchUserComments({ }, userId) {
            try {
                const response = await axios.get(`${API_URL}user/${userId}/comments/`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Ошибка загрузки комментариев:', error);
                return [];
            }
        }

    },
};
