<template>
  <app-page title="Профиль"> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
    <div class="profile">
      <section class="profile-info">
      <div class="profile-photo-container" >
        <!-- Аватарка с анимацией загрузки -->
        <div class="avatar-wrapper" v-if="isUserLoaded">
          <!-- Основное изображение -->
          <img
              v-if="user.avatar && !avatarError"
              :src="`${mediaUrl}${user.avatar}`"
              alt="Фото пользователя"
              class="avatar"
              :class="{ 'hidden': !avatarLoaded }"
              @error="handleAvatarError"
          >

          <!-- Дефолтное изображение (появляется, если нет аватарки или ошибка) -->
          <img
              v-else
              :src="require('@/assets/icons/profile.png')"
              alt="Дефолтное фото"
              class="avatar default-avatar"
          >
        </div>
      </div>
      <div class="details">
          <p><strong>Имя:</strong> {{ user.username ? user.username : 'Загрузка...' }}</p>
          <p><strong>Email:</strong> {{ user.email ? user.email : 'Загрузка...' }}</p>
        <p><strong>Дата регистрации:</strong> {{ formattedDate }}</p>
          <app-button v-show="!isEditing"
          @click="editProfile"
          button-class="edit-profile"
          >Редактировать <span class="edit">профиль</span></app-button>
      </div>
      </section>
      <!-- Если флаг isEditing true, показывается форма редактирования профиля -->
      <section class="editProfile" v-show="isEditing">
        <span class="close-btn" @click="closeEditForm">&times;</span>
        <h3>Редактирование профиля</h3>
        <form @submit.prevent="onEdit">
          <app-input
            label="Изменить имя пользователя"
            name="username"
            iD="name"
            type="text"
            input-class="edit-profile-input"
            v-model="username"
            @blur="usernameBlur"
            :error="usernameError || backendErrors.username"
            @input="backendErrors.username = ''"

            placeholder="Введите новое имя пользователя"
          ></app-input>
          <!--При редактировании поля (@input) очищается соответствующая ошибка-->
          <app-input
            label="Изменить email"
            name="email"
            iD="email"
            type="text"
            input-class="edit-profile-input"
            v-model="email"
            @blur="emailBlur"
            :error="emailError || backendErrors.email"
            @input="backendErrors.email = ''"

            placeholder="Введите новый адрес электронной почты"
          ></app-input>

          <app-input
            label="Изменить фото"
            name="image"
            iD="image"
            type="file"
            input-class="add-recipe-form"
            @change="handleAvatarChange"
          ></app-input>
          <img v-if="previewAvatar" :src="previewAvatar" class="avatar-preview"  alt="Выбранный новый аватар"/>

          <h3>Изменить пароль</h3>
          <div class="password-input-container-profile">
            <!-- Показать/скрыть пароль только для поля password c предотвращением (prevent) перезагрузки по клику по умолчанию -->
            <a href="#" @click.prevent="togglePasswordVisibility"
               class="password-control" :class="{ view: isPasswordVisible }"
               :title="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'">
            </a>
            <!-- Поле ввода пароля с изменением типа text/password в зависимости от значения isPasswordVisible
          для функционала скрыть и показать -->
            <app-input
              label="Старый пароль"
              name="oldPassword"
              iD="old_password"
              :type="isPasswordVisible ? 'text' : 'password'"
              input-class="edit-profile-input"
              v-model="oldPassword"
              @blur="oldPasswordBlur"
              :error="oldPasswordError || backendErrors.oldPassword"
              @input="backendErrors.oldPassword = ''"

              placeholder="Введите старый пароль"
            ></app-input>
          </div>

          <app-input
            label="Новый пароль"
            name="newPassword"
            iD="new_password"
            :type="isPasswordVisible ? 'text' : 'password'"
            input-class="edit-profile-input"
            v-model="newPassword"
            @blur="newPasswordBlur"
            :error="newPasswordError || backendErrors.newPassword"
            @input="backendErrors.newPassword = ''"
            placeholder="Введите новый пароль"
          ></app-input>

          <app-input
            label="Подтверждение пароля"
            name="confirmPassword"
            iD="confirm_password"
            :type="isPasswordVisible ? 'text' : 'password'"
            input-class="edit-profile-input"
            v-model="confirmPassword"
            @blur="confirmPasswordBlur"
            :error="confirmPasswordError || backendErrors.confirmPassword"
            @input="backendErrors.confirmPassword = ''"
            placeholder="Введите пароль еще раз"
          ></app-input>

          <app-button type="submit"
            button-class="edit-profile"
            :disabled="isSubmitting"
            >Сохранить изменения</app-button>
            <small v-show="isSaving">Сохраняем...</small>
        </form>
      </section>
      <!-- Если флаг showMessage из store в значении true, показываем уведомление  -->
      <div class="message-container" v-if="showMessage">
        <app-message position="app-message-profile"/>
      </div>
    </div>
  </app-page>
</template>

<script>
import {defineComponent, computed, ref, onMounted} from 'vue'
import AppPage from '@/components/ui/AppPage.vue';
import { useStore } from 'vuex';
import AppRecipeCard from '@/components/AppRecipeCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import AppMessage from '@/components/ui/AppMessage.vue';
import {UseProfileChangeForm} from "@/use/change-profile";
import store from "@/store/store";

export default defineComponent({
  setup() {
  const store = useStore();

  const user = computed(() => store.getters['user/user']);

  const isEditing = ref(false); // Флаг для формы редактирования профиля
  const isSaving = ref(false); //Если нажали сохранить изменения, изменяется на true для надписи сохраняем...

  const userRecipes = computed(() => store.getters['recipe/getUserRecipes'](user.value.id));

  const showMessage = computed(() => store.getters.showMessage); // Флаг для уведомления
  const isPasswordVisible = ref(false);

  const isUserLoaded = ref(false);

  // Используем хук и разворачиваем его свойства
  const profileForm = UseProfileChangeForm();

  const mediaUrl = ref('http://127.0.0.1:8000/');

  onMounted(async () => {
    await store.dispatch('user/fetchUser');
    profileForm.username.value = user.value?.username || '';
    profileForm.email.value = user.value?.email || '';
    isUserLoaded.value = true;
  });

  const editProfile = () => {
    isEditing.value = true;
  };

  const closeEditForm = () => {
    isEditing.value = false;
  };

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
  };

  const onEdit = async () => {
    isSaving.value = true; // Показываем "Сохраняем..."
    try {
      await profileForm.onSubmit(); // Вызываем метод onSubmit из хука UseProfileChangeForm
      // Закрываем форму редактирования после успешного сохранения
      closeEditForm();
      store.dispatch("setMessage", {
        type: "success",
        text: 'Данные успешно обновлены!',
        position: "app-message-profile"
      }, { root: true });
    } catch (error) {

      store.dispatch("setMessage", {
        type: "error",
        text: `Ошибка изменения профиля`,
        position: "app-message"
      }, { root: true });
    } finally {
      isSaving.value = false; // Сбрасываем состояние загрузки
    }
  };

  const openRecipe = (recipeId) => {
    // Навигация к странице рецепта
    console.log(`Открытие рецепта с ID ${recipeId}`);
  };

  return {
    user,
    userRecipes,
    editProfile,
    openRecipe,
    isEditing,
    isSaving,
    showMessage,
    mediaUrl,
    isUserLoaded,
    onEdit,
    isPasswordVisible,
    togglePasswordVisibility,
    closeEditForm,
    ...profileForm // Хук, возвращает объект, поэтому пользуемся оператором разворачивания, перенесла всю логику изменения пароля туда
  };
  },
  computed: {
    formattedDate() {
      if (!this.user || !this.user.date_joined) return 'Загрузка...';
      return new Date(this.user.date_joined).toLocaleDateString('ru-RU');
    }
  },
  components:{AppPage, AppRecipeCard, AppButton, AppInput, AppMessage}
})
</script>

<style>
.password-input-container-profile{
  position: relative;
  height: 80px; /* Фиксированная высота контейнера */
  margin-top: 0;
}

.profile{
  display: grid;
  grid-template-columns: 65% 35%;
  align-items: start;
  
}

.profile-info {
  display: inline-flex;
  text-align: center;
  align-items: center;
  margin-bottom: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.editProfile{
  position: relative;
  display: block;
  text-align: start;
  margin-bottom: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin-left:20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-profile-input{
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

.profile-photo-container {
  width: 20vw; /* Ширина контейнера в процентах от ширины экрана */
  height: 20vw; /* Высота контейнера в процентах от ширины экрана */
  max-width: 350px; /* Максимальная ширина контейнера */
  max-height: 350px; /* Максимальная высота контейнера */  
  min-width: 100px;
  margin: 0;
}

.avatar-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hidden {
  opacity: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 10%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 1;
  transition: opacity 0.4s ease-in-out;
}

.default-avatar {
  opacity: 1 !important;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
}

.details{
  display: block;
  text-align: start;
  margin-left:20px;
}

.app-message-profile {
  position: absolute; /* Абсолютное позиционирование */
  top: 0; /* Отступ сверху */
  left: 0; /* Отступ слева */
  width: 100%; /* Ширина контейнера */
  padding: 15px; /* Внутренний отступ */
  border-radius: 5px; /* Скругление углов */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Тень */
  display: flex; /* Флексбокс для выравнивания элементов */
  align-items: center; /* Выравнивание по центру по вертикали */
  justify-content: space-between; /* Равномерное распределение пространства между элементами */
  animation: fadeIn 0.5s ease-in-out; /* Анимация появления */
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
}

/* Стили для контейнера сообщения */
.message-container {
  position: relative; /* Относительное позиционирование */
  margin-bottom: 40px; /* Отступ снизу */
  background-color: white; /* Цвет фона */
  border: 1px solid #ccc; /* Граница */
  border-radius: 5px; /* Скругление углов */
  padding: 20px; /* Внутренний отступ */
  margin-left: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Тень */  
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 15px;
  color: #333;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

@media (max-width: 1050px) {
  .profile{
    display: block;
  }
  
  .editProfile{
    margin-left: 0;
  }

  .profile-info{
    width: 100%;
    box-sizing: border-box;
  }

  .profile-photo-container {
    width: 250px; /* Уменьшенная ширина контейнера для фото */
    height: 250px; /* Уменьшенная высота контейнера для фото*/
  }

  .message-container {
    margin-left: 0;
  }
}

@media (max-width: 594px) {
  .profile-photo-container {
    width: 200px; /* Уменьшенная ширина контейнера для фото */
    height: 200px; /* Уменьшенная высота контейнера для фото*/
  }
}

@media (max-width: 542px) {
  .profile-photo-container {    
    width: 150px; /* Уменьшенная ширина контейнера для фото */
    height: 150px; /* Уменьшенная высота контейнера для фото*/
    
  }

  .details p{
    font-size: 14px;
  }

  label {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .profile-photo-container {
    width: 110px; /* Уменьшенная ширина контейнера для фото */
    height: 110px; /* Уменьшенная высота контейнера для фото*/
  }

  h3{
    font-size: 16px;
  }

  .edit{
    display:none;
  }

  label {
    font-size: 12px;
  }
}

</style>