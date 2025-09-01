import axios from 'axios';
import store from '@/store/store';
import router from '@/router/router';

axios.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Если получена ошибка 401 и запрос ещё не был повторён
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Флаг, чтобы не попадать в бесконечный цикл

            try {
                await store.dispatch('auth/refreshToken');
                originalRequest.headers['Authorization'] = `Bearer ${store.state.auth.token}`;
                return axios(originalRequest);
            } catch (refreshError) {
                store.commit('auth/logout');
                router.push('/login');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);
