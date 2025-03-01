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
          <h3>Редактирование профиля</h3>
          <form @submit.prevent="onEdit">
            <app-input
              label="Изменить имя пользователя"
              name="name"
              iD="name"
              type="text"
              input-class="edit-profile-input"
              v-model="updatedUsername"
                      
              placeholder="Введите новое имя пользователя"
              required
            ></app-input>

            <app-input
              label="Изменить email"
              name="email"
              iD="email"
              type="text"
              input-class="edit-profile-input"
              v-model="updatedEmail"
                      
              placeholder="Введите новый адрес электронной почты"
              required
            ></app-input>

            <app-input
              label="Изменить фото"
              name="image"
              iD="image"
              type="file"
              input-class="add-recipe-form"
              @change="handleAvatarChange"
              required
            ></app-input>
            <img v-if="updatedAvatar" :src="previewAvatar" class="avatar-preview" />

            <h3>Изменить пароль</h3>

            <app-input
              label="Старый пароль"
              name="old_password"
              iD="old_password"
              type="password"
              input-class="edit-profile-input"
              v-model="oldPassword"
                      
              placeholder="Введите старый пароль"
              required
            ></app-input>

            <app-input
              label="Новый пароль"
              name="new_password"
              iD="new_password"
              type="password"
              input-class="edit-profile-input"
              v-model="newPassword"
                      
              placeholder="Введите новый пароль"
              required
            ></app-input>

            <app-input
              label="Подтверждение пароля"
              name="confirm_password"
              iD="confirm_password"
              type="password"
              input-class="edit-profile-input"
              v-model="confirmPassword"
                      
              placeholder="Введите пароль еще раз"
              required
            ></app-input>

            <app-button type="submit"
              @click="savedEdits"
              button-class="edit-profile"
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

export default defineComponent({
    setup() {
    const store = useStore();

    const user = computed(() => store.getters['user/user']);

    const updatedUsername = ref(user.value?.username || "");
    const updatedEmail = ref(user.value?.email || "");
    const updatedAvatar = ref(null);

    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");

    const isEditing = ref(false); // Флаг для формы редактирования профиля
    const isSaving = ref(false); //Если нажали сохранить изменения, изменяется на true для надписи сохраняем...

    const userRecipes = computed(() => store.getters['recipe/getUserRecipes'](user.value.id));

    const showMessage = computed(() => store.getters.showMessage); // Флаг для уведомления

    const previewAvatar = ref(null);

    const avatarLoaded = ref(false);
    const avatarError = ref(false);

    const isUserLoaded = ref(false);

      const handleAvatarLoad = () => {
        setTimeout(() => {
          avatarLoaded.value = true;
        }, 100); // небольшая задержка для плавности
      };

    const handleAvatarError = () => {
      avatarError.value = true;
    };

    const mediaUrl = ref('http://127.0.0.1:8000/');
    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (previewAvatar.value) {
          URL.revokeObjectURL(previewAvatar.value); // Освобождаем старый объект
        }
        updatedAvatar.value = file;
        previewAvatar.value = URL.createObjectURL(file);
      }
    };

      onMounted(async () => {

        await store.dispatch('user/fetchUser'); // Загружаем пользователя при монтировании

        updatedUsername.value = user.value?.username || ""; // Обновляем updatedUsername
        updatedEmail.value = user.value?.email || "";       // Обновляем updatedEmail

        isUserLoaded.value = true;
      });

    const editProfile = () => {
      isEditing.value = true;
    };

    const savedEdits = async () => {
      try {
        isSaving.value = true; // Показываем сообщение "Сохраняем..."

        const formData = new FormData();
        formData.append("username", updatedUsername.value);
        formData.append("email", updatedEmail.value);

        if (updatedAvatar.value) {
          formData.append("avatar", updatedAvatar.value);
        }

        await store.dispatch("user/updateUser", formData);
        await store.dispatch("user/fetchUser"); // Чтобы сразу обновились данные

        // Успешное обновление
        isEditing.value = false;

        // Сбрасываем значения полей
        updatedUsername.value = "";
        updatedEmail.value = "";
        updatedAvatar.value = null;
        previewAvatar.value = null;

        store.dispatch("setMessage", { type: "success", text: "Изменения сохранены", position: "app-message-profile",
          fadingOut: false }, { root: true });

      } catch (error) {
        console.error("Ошибка обновления профиля:", error);
        store.dispatch("setMessage", { type: "error", text: "Ошибка при сохранении профиля", position: "app-message-profile" }, { root: true });
      } finally {
        isSaving.value = false; // В любом случае скрываем индикатор загрузки
      }
    };

    const openRecipe = (recipeId) => {
      // Навигация к странице рецепта
      console.log(`Открытие рецепта с ID ${recipeId}`);
    };

    return {
      user,
      updatedUsername,
      updatedEmail,
      updatedAvatar,
      previewAvatar,
      userRecipes,
      editProfile,
      openRecipe,
      savedEdits,
      isEditing,
      isSaving,
      showMessage,
      handleAvatarChange,
      mediaUrl,
      avatarLoaded,
      avatarError,
      handleAvatarLoad,
      handleAvatarError,
      isUserLoaded,
      oldPassword,
      newPassword,
      confirmPassword,
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
  margin-bottom: 10px;
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