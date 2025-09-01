<template>    
    <h2>Регистрация</h2>

    <p>Зарегистрируйся, чтобы обмениваться рецептами!</p>

    <form @submit.prevent="submitForm">
        <AppInput
            label="Имя пользователя"
            name="username"
            iD="username"
            type="text"
            input-class="login-form"
            v-model.trim="registrForm.usernameValue"
            @blur="registrForm.usernameBlur"
            :error="registrForm.usernameError || registrForm.backendErrors.username"
            placeholder="Введите ваше имя на сайте"
            required
        ></AppInput>

        <AppInput
            label="E-mail"
            name="email"
            iD="email"
            type="email"
            input-class="login-form"
            v-model.trim="registrForm.emailValue"
            @blur="registrForm.emailBlur"
            :error="registrForm.emailError || registrForm.backendErrors.email"
            placeholder="Введите почту"
            required
        ></AppInput>

        <div class="password-input-container">
            <a href="#" @click.prevent="togglePasswordVisibility"
               class="password-control" :class="{ view: isPasswordVisible }"
               :title="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'">
            </a>

            <AppInput
                label="Пароль"
                name="password"
                iD="reg-password"
                :type="isPasswordVisible ? 'text' : 'password'"
                input-class="login-form"
                v-model.trim="registrForm.passwordValue"
                @blur="registrForm.passwordBlur"
                :error="registrForm.passwordError || registrForm.backendErrors.password"
                placeholder="Введите пароль"
                required
            ></AppInput>
        </div>

        <div class="password-input-container">
            <AppInput
                label="Подтверждение пароля"
                name="confirm-password"
                iD="confirm-password"
                :type="isPasswordVisible ? 'text' : 'password'"
                input-class="login-form"
                v-model.trim="registrForm.confirmPasswordValue"
                @blur="registrForm.confirmPasswordBlur"
                :error="registrForm.confirmPasswordError || registrForm.backendErrors.confirmPassword"
                placeholder="Введите пароль ещё раз"
                required
            ></AppInput>
        </div>

        <AppButton type="submit">Зарегистрироваться</AppButton>

        <small v-show="registrForm.isSubmitting">Подождите...</small>
    </form>

    <AppMessage v-if="showMessage"
                :text="message"
                position="app-message"/>
</template>
    
<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRegForm } from '@/use/reg-form';
import {
    AppButton,
    AppMessage,
    AppInput,
} from '@ui';

const store = useStore();

const message = computed(() => store.getters.message);
const showMessage = computed(() => store.getters.showMessage);

const isPasswordVisible = ref(false);

const registrForm = useRegForm();

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const submitForm = registrForm.handleSubmit(async (values) => {
    try {
        // Сброс ошибок
        Object.keys(registrForm.backendErrors.value).forEach(key => registrForm.backendErrors.value[key] = '');

        await store.dispatch('auth/register', {
            username: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
        });

        store.dispatch('setMessage', {
            type: 'success',
            text: 'Регистрация успешна! Теперь можно войти.',
            position: 'app-message',
        }, { root: true });
    } catch (error) {
        if (error.response?.data) {
            // Обработка ошибок бэкенда
            const fieldMap = {
                username: 'username',
                email: 'email',
                password: 'password',
            };

            for (const [field, messages] of Object.entries(error.response.data)) {
                const mappedField = fieldMap[field] || field;

                if (registrForm.backendErrors.value.hasOwnProperty(mappedField)) {
                    // Если ошибки уже есть, добавляем новую через запятую
                    const currentErrors = registrForm.backendErrors.value[mappedField];
                    const newErrors = Array.isArray(messages)
                        ? messages.join(', ')
                        : messages;

                    registrForm.backendErrors.value[mappedField] = currentErrors
                        ? `${currentErrors}, ${newErrors}`
                        : newErrors;
                }
            }
        } else {
            store.dispatch('setMessage', {
                type: 'error',
                text: 'Ошибка при регистрации. Попробуйте снова.',
                position: 'app-message',
            }, { root: true });
        }
    }
});
</script>

<style scoped>
.reg-form {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;

    border: 1px solid #ccc;
    border-radius: 5px;
}

.login-form {
    display: flex;
    align-items: center;
    width: 100%;
    height: 38px;
    padding: 10px;

    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.password-input-container {
    position: relative;
    height: 75px;
    margin-top: 0;
}

p {
    margin: 0 15px 15px 0;
    font-size:13px;
}
</style>
