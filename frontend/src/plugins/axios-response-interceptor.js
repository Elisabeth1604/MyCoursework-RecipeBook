import axios from 'axios';
import store from '@/store/store';
import router from '@/router/router';

// Перехватчик ответов
axios.interceptors.response.use(
    response => response, // если всё хорошо – возвращаем ответ без изменений
    async (error) => {
        const originalRequest = error.config;

        // Если получена ошибка 401 и запрос ещё не был повторён
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Флаг, чтобы не попадать в бесконечный цикл
            try {
                console.log("Сработал перехватчик")
                // Пытаемся обновить токен через соответствующий экшен в Vuex
                await store.dispatch('auth/refreshToken');
                // Обновляем заголовок запроса новым токеном
                originalRequest.headers['Authorization'] = `Bearer ${store.state.auth.token}`;
                // Повторно отправляем исходный запрос
                return axios(originalRequest);
            } catch (refreshError) {
                // Если обновление токена не удалось, выполняем логаут и перенаправляем пользователя на страницу логина
                store.commit('auth/logout');
                router.push('/login');
                return Promise.reject(refreshError);
            }
        }
        // Если ошибка не 401 или запрос уже был повторён – просто пробрасываем её дальше
        return Promise.reject(error);
    }
);
