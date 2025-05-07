<template>
  <div v-if="isLoginVisible" class="modal-overlay" @click="closeModal"> <!-- Полупрозрачный затемнённый фон -->
    <div class="modal-window" @click.stop> <!-- Само модальное окно, клик на нем не закрывает модальное окно -->
      <h2>Вход</h2>
      <form @submit.prevent="onSubmit"> <!--Отправка формы входа с предотвращением стандартной перезагрузки страницы-->
        <app-input
            label="Имя пользователя"
            name="username"
            type="text"
            iD="uname"
            v-model="username"
            input-class="login-form"
            placeholder="Введите имя пользователя"
            :error="uError"
            @blur="uBlur"
            required
        ></app-input>

        <div class="password-input-container"> <!-- Контейнер для поля пароля -->
          <!-- Поле ввода пароля с изменением типа text/password в зависимости от значения isPasswordVisible
          для функционала скрыть и показать -->
          <app-input
              label="Пароль"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              iD="password"
              input-class="login-form"
              v-model="password"
              placeholder="Введите пароль"
              :error="pError"
              @blur="pBlur"
              required
          ></app-input>
          <!-- Показать/скрыть пароль только для поля password c предотвращением (prevent) перезагрузки по клику по умолчанию -->
          <a href="#" @click.prevent="togglePasswordVisibility"
             class="password-control" :class="{ view: isPasswordVisible }"
             :title="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"></a>
        </div>
        <div class="form-footer">
          <router-link to="/reg"
                       @click="closeModal"
                       class="link-not-registered"
          >Еще не зарегистрированы?</router-link>
          <app-button type="submit"
              :disabled="isSubmitting"
            >Войти</app-button>
        </div>
      </form>
    </div>
  </div>
  <app-message v-if="showMessage" :text="message"/>
</template>

<script>
import {defineComponent, toRefs, ref, computed} from 'vue';
import {useStore} from "vuex";
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';
import AppLink from '@/components/AppLink.vue';
import AppMessage from '@/components/ui/AppMessage.vue';
import { UseLoginForm } from '@/use/login-form';

export default defineComponent({
  emits:['close'],
  props:{
    isLoginVisible:{ // управляет видимостью модального окна
      type: Boolean,
      default: false
    }
  },
  setup( props, { emit }) {
    const store = useStore();
    // Получаем сообщение и флаг показа сообщения через computed
    const message = computed(() => store.getters.message);
    const showMessage = computed(() => store.getters.showMessage);

    const isPasswordVisible= ref(false)

    const closeModal = () => {
      emit('close');
      isPasswordVisible.value=false
    };
    const resetForm = () => {
        // Сброс всех полей формы
    }
    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    }
    return{ ...UseLoginForm(), // Хук, возвращает объект, поэтому пользуемся оператором разворачивания, перенесла всю логику туда
      togglePasswordVisibility,
      closeModal,
      resetForm,
      isPasswordVisible,
      message,
      showMessage
    }
  },
  components:{AppInput, AppButton, AppLink, AppMessage}
})
</script>

<style>
.login-form{
  display: flex;
  align-items: center;
  width: 100%;
  height: 38px;
  padding: 10px; /* Отступ справа для иконки */
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 15px;
}

/* Для чек-бокса Запомнить меня */
.check-box-memory{
  display: flex;
  align-items: center;
}

/* Для лейбла Запомнить меня */
.check-box-memory label{
  display:inline-flex;
  margin-bottom: 0;
  margin-left: 3px;
  font-size: 14px;
  font-weight:lighter;
  color: #333;
}

.password-input-container {
  position: relative;
  height: 42px;
  margin-top: 15px;
}

.password-control {
  position: absolute;
	top: 50%; /* Чтобы центрировать по вертикали */
  right: 10px;
  transform: translateY(-50%);
	width: 24px;
	height: 24px;
  background-size: contain; /* Обеспечиваем масштабирование иконки внутри кнопки */
	background: url(/src/assets/icons/view.png) center no-repeat; /* Центрировать  и не повторять*/
  cursor: pointer;
}

.password-control.view {
	background: url(/src/assets/icons/no-view.png) center no-repeat;
}

.link-not-registered, .link-forgot-pass{
  display: inline-block;
  margin-top: 5px;
  font-size: 13px;
  color:rgb(83, 127, 163);
  text-decoration-line: none;
  border-bottom: 1px solid;
}

/* Цвет при наведении на ссылку */
.link-not-registered:hover, .link-forgot-pass:hover {
  color: #FF9973;
}
/* Цвет при нажатии на ссылку */
.link-not-registered:active, .link-forgot-pass:active {
  color: #fc511c;
}
</style>
