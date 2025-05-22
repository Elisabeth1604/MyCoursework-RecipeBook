<template>    
  <h2>Регистрация</h2>
  <p>Зарегистрируйся, чтобы обмениваться рецептами!</p>
  <form @submit.prevent="submitForm"> <!--Отправка формы регистрации с предотвращением стандартной перезагрузки страницы-->
    <app-input
        label="Имя пользователя"
        name="username"
        iD="username"
        type="text"
        input-class="login-form"
        v-model.trim="usernameValue"
        @blur="usernameBlur"
        :error="usernameError || backendErrors.username"
        placeholder="Введите ваше имя на сайте"
        required
    ></app-input>
    <app-input
        label="E-mail"
        name="email"
        iD="email"
        type="email"
        input-class="login-form"
        v-model.trim="emailValue"
        @blur="emailBlur"
        :error="emailError || backendErrors.email"
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
          v-model.trim="passwordValue"
          @blur="passwordBlur"
          :error="passwordError || backendErrors.password"
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
          v-model.trim="confirmPasswordValue"
          @blur="confirmPasswordBlur"
          :error="confirmPasswordError || backendErrors.confirmPassword"
          placeholder="Введите пароль ещё раз"
          required
      ></app-input>
    </div>
    <app-button type="submit"
    >Зарегистрироваться</app-button>
    <small v-show="isSubmitting">Подождите...</small>
  </form>
  <app-message v-if="showMessage" :text="message" position="app-message"/>
</template>
    
<script>
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRegForm } from '@/use/reg-form';
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

    const isPasswordVisible = ref(false);

    const message = computed(() => store.getters.message);

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
          confirmPassword: values.confirmPassword
        });

        store.dispatch('setMessage', {
          type: 'success',
          text: 'Регистрация успешна! Теперь можно войти.',
          position: "app-message"
        }, { root: true });
      } catch (error) {
        if (error.response?.data) {
          // Обработка ошибок бэкенда
          const fieldMap = {
            username: 'username',
            email: 'email',
            password: 'password'
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
            position: "app-message",
          }, { root: true });
        }
      }
    });

    return {
      // Логика валидации
      ...registrForm,

      isPasswordVisible,
      togglePasswordVisibility,
      message,
      submitForm
    };
  },

  components: { AppInput, AppButton, AppLink, AppMessage }
})
</script>

<style scoped>
.reg-form{
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-form{
  height: 38px;
  padding: 10px; /* Отступ справа для иконки */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-input-container{
  position: relative;
  height: 75px;
  margin-top: 0;
}

p{
  font-size:13px;
  margin:0 15px 15px 0;
}
</style>
