import axios from 'axios';

const API_URL = 'http://localhost/api/';
const TOKEN_KEY = 'jwt-token'

import { jwtDecode } from "jwt-decode";
import store from "@/store/store";
import router from "@/router/router";

// Функция для периодической проверки токена
function startTokenRefresh(store) {
    setInterval(async () => {
        const token = store.state.auth.token;
        if (token) {
            const decoded = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);

            if (decoded.exp - now < 300) { // Если до истечения < 5 минут
                console.log("Обновляем токен...");
                await store.dispatch("auth/refreshToken");
            }
        }
    }, 300000); // Проверять раз в 5 минут
}

// Запуск обновления токена при инициализации store
export function initializeAuthStore(store) {
    startTokenRefresh(store);
}

export default {
    namespaced: true, // Чтобы названия экшенов были локальными, а не глобальными

    state(){
        return{
            // По токену будем определять, авторизован ли человек, причем начальное значение указываем не null, а получаем из localStorage
            token: localStorage.getItem(TOKEN_KEY),
            // чтобы при обновлении страницы авторизация не сбрасывалась
            isLoginVisible: false
        }
    },

    mutations:{ // Здесь синхронный код, изменяющий state
        setToken(state, token){
            state.token = token
            localStorage.setItem(TOKEN_KEY, token)
        },
        logout(state){
            state.token = null
            localStorage.removeItem(TOKEN_KEY) // Удаляем из localStorage
        },
        // setLoginVisible(state, isVisible) {
        //     state.isLoginVisible = isVisible;
        // }
        showLoginModal(state) {
            state.isLoginVisible = true;
        },
        hideLoginModal(state) {
            state.isLoginVisible = false;
        }
    },

    actions: {
        async login({ commit }, { username, password }) {
            try {
                console.log('Отправляем данные:', { username, password });
                const response = await axios.post(`${API_URL}token/`, {
                    username: username,
                    password: password
                });

                commit('setToken', response.data.access); // Сохраняем access-токен
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                store.dispatch(
                    "setMessage",
                    { type: "success", text: "Добро пожаловать!", position: "app-message" },
                    { root: true });
                commit('hideLoginModal'); // Закрыть модальное окно входа

            } catch (error) {
                console.error('Ошибка авторизации:', error);
                store.dispatch(
                    "setMessage",
                    { type: "error", text: "Ошибка в имени пользователя или пароле!", position: "app-message" },
                    { root: true });
                throw new Error('Ошибка авторизации');
            }
        },

        async refreshToken({ commit }) {
            try {
                const response = await axios.post(`${API_URL}token/refresh/`, {}, { withCredentials: true });

                commit("setToken", response.data.access);
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
            } catch (error) {
                console.error("Ошибка обновления токена:", error);
                commit("logout");
            }
        },

        async logout({ commit }) {
            try {
                await axios.post(`${API_URL}logout/`, {}, { withCredentials: true });
                commit("logout");
                delete axios.defaults.headers.common["Authorization"];
                store.dispatch("setMessage", { type: "success", text: "Вы вышли из профиля!", position: "app-message" }, { root: true });
            } catch (error) {
                console.error("Ошибка при выходе:", error);
            }
        },

        async register({ dispatch }, { username, email, password, confirmPassword }) {
            try {
                const response = await axios.post(`${API_URL}register/`, {
                    username,
                    email,
                    password,
                    password2: confirmPassword
                }, { withCredentials: true });

                store.dispatch("setMessage", {
                    type: "success",
                    text: "Вы успешно зарегистрированы!",
                    position: "app-message",
                }, { root: true });

                // Ждем 500 мс перед входом, чтобы сообщение успело появиться
                await new Promise(resolve => setTimeout(resolve, 700));

                // После успешной регистрации сразу выполняем вход
                await dispatch("login", { username, password });

                router.push('/')

                return response.data;
            } catch (error) {
                console.error("Ошибка регистрации:", error.response?.data || error.message);

                let errorMessage = "Ошибка регистрации";
                if (error.response?.data) {
                    if (error.response.data.password) {
                        errorMessage = error.response.data.password.join(" "); // Склеиваем массив ошибок
                    } else if (error.response.data.email) {
                        errorMessage = error.response.data.email;
                    } else if (error.response.data.username) {
                        errorMessage = error.response.data.username;
                    }
                }
                store.dispatch("setMessage", {
                    type: "error",
                    text: errorMessage,
                    position: "app-message",
                }, { root: true });
                throw error;
            }
        },

        async changePassword({ commit, getters }, { oldPassword, newPassword, confirmPassword }) {
            try {

                const response = await axios.post(
                    `${API_URL}password/change/`,
                    { old_password: oldPassword, new_password: newPassword, new_password2: confirmPassword },
                    { withCredentials: true,
                            headers: {
                            Authorization: `Bearer ${getters.token}`, // Явно передаём токен
                        }, }
                );
                return response.data;
            } catch (error) {
                let errorMessage = "Ошибка при изменении пароля";
                if (error.response?.data) {
                    errorMessage = Object.values(error.response.data).join(" ");
                }
                store.dispatch("setMessage", {
                    type: "error",
                    text: errorMessage,
                    position: "app-message-profile"
                }, { root: true });
                throw error;
            }
        }
    },

    getters: {
        token(state){
            return state.token
        },
        isAuthenticated(_, getters){
            return !!getters.token // Двойным отрицанием приводим токен к булевому значению, чтобы в зависимости от его значения возвращать состояние isAuthenticated
        }
    }
}