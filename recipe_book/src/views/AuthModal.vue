<template>
    <div v-if="isLoginVisible" class="modal-overlay" @click="closeModal"> <!-- Полупрозрачный затемнённый фон -->
    <div class="modal-window" @click.stop> <!-- Само модальное окно, клик на нем не закрывает модальное окно -->
    <h2>Вход</h2>
        <form @submit.prevent="onSubmit"> <!--Отправка формы входа с предотвращением стандартной перезагрузки страницы-->
            <app-input
                label="E-mail"
                name="mail"
                type="email"
                iD="email"               
                v-model:value="email"
                input-class="login-form"
                placeholder="Введите почту"
                :error="eError"
                @blur="eBlur"
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
                  :type="isPasswordVisible ? 'text' : 'password'"
                  iD="password"
                  input-class="login-form"                  
                  v-model:value="password"
                  placeholder="Введите пароль"
                  :error="pError"
                  @blur="pBlur"
                  required
              ></app-input>        
            </div>

            <div class="check-box-memory">
                  <input type="checkbox" id="memoryMe" name="memoryMe" value="to-memory" />
                  <label for="memoryMe">Запомнить меня?</label>
            </div>

            <app-button type="submit"
              button-class="submit-btn"
              :disabled="isSubmitting"
            >Войти</app-button>

            <app-link
            text="Забыли пароль?"
            @click="closeModal"
            link-class="link-forgot-pass"></app-link>

            <router-link to="/reg"
            @click="closeModal"
            class="link-not-registered"            
            >Еще не зарегистрированы?</router-link>
        </form>
    </div>
    </div>
</template>

<script>
import {defineComponent,  toRefs, ref, props } from 'vue';
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';
import AppLink from '@/components/AppLink.vue';
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
        const isPasswordVisible= ref(false) // Состояние видимости пароля       

        const closeModal = () => {
          emit('close');
          console.log('Окно закрыто')
          isPasswordVisible.value=false
        };
       const resetForm = () => {
            // Сброс всех полей формы
            
        }
      const togglePasswordVisibility = () => {
        isPasswordVisible.value = !isPasswordVisible.value; // Переключение состояния видимости пароля
      }
        return{ ...UseLoginForm(), // Хук, возвращает объект, поэтому пользуемся оператором разворачивания, перенесла всю логику туда
          togglePasswordVisibility,
          closeModal,
          resetForm,
          isPasswordVisible
        } 
    },
   
    components:{AppInput, AppButton, AppLink}
})
</script>

<style>
/* Полупрозрачный затемненный фон */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный черный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Высокий z-index для отображения поверх других элементов */
}

/* Стиль модального окна */
.modal-window {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px; /* Ширина окна */
  max-width: 90%; /* Для адаптивности */
}
.login-form{
    display: inline-block;
    box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* Для чек-бокса Запомнить меня */
.check-box-memory{
  display:inline-flex;
  margin-bottom: 15px;
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

.link-not-registered, .link-forgot-pass{
  font-size: 13px;
  color:rgb(83, 127, 163);
  display: inline-block;
  margin-top: 5px;
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

/* Поле ввода пароля с иконкой */
.password-input-container {
  position: relative;
  margin-bottom: 15px; /* пространство для ошибки */
}

.password-control {
  position: absolute; 
	top: 50%; /* Чтобы центрировать по вертикали */
  right: 10px; /* Смещаем иконку справа */
	display: inline-block;
	width: 24px;
	height: 24px;
  background-size: contain; /* Обеспечиваем масштабирование иконки внутри кнопки */
  background-position: center; /* Центрируем иконку внутри кнопки */
	background: url(/src/assets/icons/view.png) 0 0 no-repeat; /*Позиционировать в левом верхнем углу и не повторять*/
  cursor: pointer;
}
.password-control.view {
	background: url(/src/assets/icons/no-view.png) 0 0 no-repeat; /*Позиционировать в левом верхнем углу и не повторять*/
}
</style>
