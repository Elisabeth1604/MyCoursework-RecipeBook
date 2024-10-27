<template>    
        <h2>Регистрация</h2>
        <p>Зарегистрируйся, чтобы обмениваться рецептами!</p>
        <form @submit.prevent="login"> <!--Отправка формы входа с предотвращением стандартной перезагрузки страницы-->
            <app-input
                label="Имя на сайте"
                name="name"
                iD="name"
                type="text"
                input-class="login-form"
                v-model:value.trim="name"
                placeholder="Введите ваше имя на сайте"
                required
            ></app-input>
            <app-input
                label="E-mail"
                name="email"
                iD="email"
                type="email"
                input-class="login-form"
                v-model:value.trim="mail"
                placeholder="Введите почту"
                required
            ></app-input>
            <div class="password-input-container"> <!-- Контейнер для поля пароля -->
                <!-- Показать/скрыть пароль только для поля password c предотвращением (prevent) перезагрузки по клику по умолчанию -->
                <a href="#" @click.prevent="togglePasswordVisibility" 
                class="password-control" :class="{ view: isPasswordVisible }"
                :title="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"></a>
    
                <!-- Поле ввода пароля с изменением типа text/password в зависимости от значения isPasswordVisible
                для функционала скрыть и показать -->
                <app-input
                    label="Пароль"
                    name="password"
                    iD="password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    input-class="login-form"
                    v-model:value.trim="password"
                    placeholder="Введите пароль"
                    required
                ></app-input>        
            </div>
    
            <app-input
                label="Подтверждение пароля"
                name="confirm-password"
                iD="confirm-password"
                type="password"
                input-class="login-form"
                placeholder="Введите пароль ещё раз"
                required
            ></app-input>
    
            <app-button type="submit"
                button-class="submit-btn"
            >Зарегистрироваться</app-button>
        </form>
</template>
    
<script>
import { defineComponent } from 'vue';
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';
import AppLink from '@/components/AppLink.vue';

export default defineComponent({
    setup() {
        
    },

    components:{ AppInput, AppButton, AppLink }
})
</script>

<style scoped>
.form-group {
    display: block;
    margin-bottom: 20px;
}
.reg-form{
    box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.login-form{
    display: inline-block;
    box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

p{
    font-size:13px;
    margin:0 15px 15px 0;
}
</style>
