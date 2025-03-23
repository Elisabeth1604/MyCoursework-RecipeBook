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
            date_joined: ''
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
                username: "",
                email: "",
                avatar: "",
                date_joined: ''
            };
        },
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
    },
};
