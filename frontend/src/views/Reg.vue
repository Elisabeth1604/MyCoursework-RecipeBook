<template>    
    <h2>Регистрация</h2>
    <p>Зарегистрируйся, чтобы обмениваться рецептами!</p>
    <form @submit.prevent="register"> <!--Отправка формы регистрации с предотвращением стандартной перезагрузки страницы-->
        <app-input
            label="Имя пользователя"
            name="username"
            iD="username"
            type="text"
            input-class="login-form"
            v-model.trim="username"
            placeholder="Введите ваше имя на сайте"
            required
        ></app-input>
        <app-input
            label="E-mail"
            name="email"
            iD="email"
            type="email"
            input-class="login-form"
            v-model.trim="email"
            placeholder="Введите почту"
            required
        ></app-input>
        <div class="password-input-container">
            <!-- Показать/скрыть пароль только для поля password c предотвращением (prevent) перезагрузки по клику по умолчанию -->
            <a href="#" @click.prevent="togglePasswordVisibility"
              class="password-control" :class="{ view: isPasswordVisible }"
              :title="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'">
            </a>
            <!-- Поле ввода пароля с изменением типа text/password в зависимости от значения isPasswordVisible
            для функционала скрыть и показать -->
            <app-input
                label="Пароль"
                name="password"
                iD="reg-password"
                :type="isPasswordVisible ? 'text' : 'password'"
                input-class="login-form"
                v-model.trim="password"
                placeholder="Введите пароль"
                required
            ></app-input>
        </div>
        <div class="password-input-container">
          <app-input
              label="Подтверждение пароля"
              name="confirm-password"
              iD="confirm-password"
              :type="isPasswordVisible ? 'text' : 'password'"
              input-class="login-form"
              v-model.trim="confirmPassword"
              placeholder="Введите пароль ещё раз"
              required
          ></app-input>
        </div>
        <app-button type="submit"
        >Зарегистрироваться</app-button>
    </form>
  <app-message v-if="showMessage" :text="message" position="app-message"/>
</template>
    
<script>
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';
import AppLink from '@/components/AppLink.vue';
import AppMessage from "@/components/ui/AppMessage.vue";

export default defineComponent({
    computed: {
      message() {
        return this.$store.getters.message;
      },
      showMessage() {
        return this.$store.getters.showMessage;
      }
    },
    setup() {
      const store = useStore();

      const username = ref("");
      const email = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const isPasswordVisible = ref(false);

      const message = computed(() => store.getters.message);

      const togglePasswordVisibility = () => {
        isPasswordVisible.value = !isPasswordVisible.value;
      };

      const register = async () => {
            if (password.value !== confirmPassword.value) {
              store.dispatch('setMessage', { type: 'error', text: 'Пароли не совпадают!' });
              return;
            }
            try {
              await store.dispatch('auth/register', {
                username: username.value,
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value
              });

              store.dispatch('setMessage', { type: 'success', text: 'Регистрация успешна! Теперь можно войти.' });
            } catch (error) {
              store.dispatch('setMessage', { type: 'error', text: 'Ошибка при регистрации. Попробуйте снова.' });
            }
      }
      return {
        username,
        email,
        password,
        confirmPassword,
        isPasswordVisible,
        togglePasswordVisibility,
        register,
        message
      };
    },

    components:{ AppInput, AppButton, AppLink, AppMessage }
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
  height: 38px;             /* Фиксированная высота */
  padding: 10px;       /* Отступ справа для иконки */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-input-container{
  position: relative;
  height: 75px; /* Фиксированная высота контейнера */
  margin-top: 0;
}

p{
    font-size:13px;
    margin:0 15px 15px 0;
}
</style>
