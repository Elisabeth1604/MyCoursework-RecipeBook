<template>
  <app-page title="Профиль"> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
    <div class="profile">
      <section class="profile-info">
      <div class="profile-photo-container" >
        <!-- Аватарка с анимацией загрузки -->
        <div class="avatar-wrapper" v-if="isUserLoaded">
          <!-- Основное изображение -->
          <img
              v-if="user?.avatar && !avatarError"
              :src="`${mediaUrl}${user?.avatar}`"
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
        <p><strong>Имя:</strong> {{ user?.username ? user.username : 'Загрузка...' }}</p>
        <p><strong>Email:</strong> {{ user?.email ? user.email : 'Загрузка...' }}</p>
        <p><strong>Дата регистрации:</strong> {{ formattedDate }}</p>
        <p><strong>Подписчики: </strong>{{ user?.followers_count }}</p>
        <p><strong>Подписки: </strong>{{ user?.subscriptions_count }}</p>

        <app-button
            v-show="!isEditing && !isMyProfile"
            @click="subscribeOrUnsubscribe"
            button-class="subscribe-btn"
        >{{ isSubscribed ? "Отписаться" : `Подписаться` }}</app-button>

        <app-button
            v-show="!isEditing && isMyProfile"
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
    <div class="user-recipes" v-if="!isMyProfile">
      <h2>Все рецепты пользователя</h2>
      <div class="recipes" ref="recipeGrid" v-if="userRecipes && userRecipes.length">
        <recipe-card
            v-for="item in userRecipes"
            :key="item.id"
            :recipe-id="item.id"
            :recipe-title="item.recipe_title"
            :recipe-description="item.description"
            :recipe-image="item.main_photo"
            :prepTimeMin="item.prep_time_min"
            :prepTimeHour="item.prep_time_hour"
            :ingredients="item.ingredients"
            :servings="item.servings"
            :calories="item.calories_per_100"
            :is-expanded="expandedCardId === item.id"
            :is-public=true
            @toggle-card="toggleCard(item.id)"
        />
      </div>
      <!-- Если рецептов нет, например, по заданным фильтрам, выводим сообщение -->
      <div v-else class="no-recipes" style="text-align:start">
        <p>У пользователя пока нет рецептов.</p>
      </div>
    </div>
  </app-page>
</template>

<script>
import {defineComponent, computed, ref, onMounted, watch} from 'vue'
import AppPage from '@/components/ui/AppPage.vue';
import { useStore } from 'vuex';
import AppRecipeCard from '@/components/AppRecipeCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import AppMessage from '@/components/ui/AppMessage.vue';
import {UseProfileChangeForm} from "@/use/change-profile";
import store from "@/store/store";
import {useRoute} from "vue-router";
import router from "@/router/router";
import RecipeCard from "@/components/AppRecipeCard.vue";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();

    const isAuth = computed(() => store.getters['auth/isAuthenticated']);

    const currentUser = computed(() => store.getters['user/user']); // Текущий авторизованный пользователь

    const targetUserId = computed(() => route.params.userId); // ID пользователя, чей профиль открыт
    const isCurrentUser = computed(() => currentUser.value?.id === Number(targetUserId.value)); // Совпадает ли мой id с id открытого профиля
    const user = ref(null); // Данные пользователя, чей профиль просматривается

    const userRecipes = computed(() => store.getters['recipe/getUserPublicRecipes'](Number(targetUserId.value))); // Рецепты, добавленные пользователем (видим только публичные)

    const isSubscribed = computed(() => store.getters['user/isSubscriber'](Number(targetUserId.value))) // Подписаны ли мы на человека, чью страницу открыли

    const isMyProfile = computed(() => {
      return route.path === '/profile' || isCurrentUser.value || targetUserId.value === undefined; // Открыт мой профиль (true) или чужой (false)
    });

    const isPasswordVisible = ref(false);
    const isEditing = ref(false); // Флаг для формы редактирования профиля
    const isSaving = ref(false); //Если нажали сохранить изменения, изменяется на true для надписи сохраняем...

    const expandedCardId = ref(null);

    const isUserLoaded = ref(false);

    // Используем хук и разворачиваем его свойства (там все для редактирования профиля)
    const profileForm = UseProfileChangeForm();

    const mediaUrl = computed(() => store.getters.mediaUrl);
    const showMessage = computed(() => store.getters.showMessage); // Флаг для уведомления

    const loadData = async () => {
      if (isMyProfile.value) {
        // Если это профиль текущего пользователя
        await store.dispatch('user/fetchUser');
        user.value = currentUser.value;
      } else {
        // Если это чужой профиль - загружаем его данные
        try {
          const response = await store.dispatch('user/fetchUserById', targetUserId.value);
          await store.dispatch('recipe/fetchRecipes');
          user.value = response;
        } catch (error) {
          console.error('Ошибка загрузки профиля:', error);
        }
      }
      isUserLoaded.value = true;
    };

    // Загрузка при монтировании
    onMounted(loadData);

    // Автоматическая перезагрузка при изменении URL, чтобы можно было с чужого профиля перейти на свой без полной перезагрузки страницы
    watch(
        () => route.path,
        (newPath) => {
          if (newPath === "/profile") loadData();
        }
    );

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
        isSaving.value = false;
      }
    };

    const subscribe = async () => {
      // Если пользователь авторизован, пробуем подписаться
      await store.dispatch('user/fetchUser');
      if (isAuth) {
        try {
          await store.dispatch('user/subscribe', targetUserId.value);
          store.dispatch("setMessage", {
            type: "success",
            text: 'Вы успешно подписались!',
            position: "app-message-profile"
          });
        } catch (error) {
          store.dispatch("setMessage", {
            type: "error",
            text: `Ошибка подписки`,
            position: "app-message-profile"
          });
        }
      }
      else {
        store.commit('auth/showLoginModal');
        store.dispatch("setMessage", {
          type: "warning",
          text: 'Пожалуйста, авторизуйтесь и попробуйте снова!',
          position: "app-message"
        });
      }
    };

    const unsubscribe = async () => {
      // Если пользователь авторизован, пробуем отписаться
      if (isAuth) {
        try {
          await store.dispatch('user/unsubscribe', targetUserId.value);
          store.dispatch("setMessage", {
            type: "success",
            text: 'Вы успешно отписались!',
            position: "app-message-profile"
          });
        } catch (error) {
          store.dispatch("setMessage", {
            type: "error",
            text: `Ошибка отписки`,
            position: "app-message-profile"
          });
        }
      }
      else {
        store.commit('auth/showLoginModal');
        store.dispatch("setMessage", {
          type: "warning",
          text: 'Пожалуйста, авторизуйтесь и попробуйте снова!',
          position: "app-message"
        });
      }
    };

    const subscribeOrUnsubscribe = async () => {
      if (isSubscribed.value) {
        await unsubscribe();
      } else {
        await subscribe();
      }
      await store.dispatch('user/fetchUser');  // Обновляем данные после действия
      await loadData();  // Повторно загружаем профиль
    };


    const toggleCard = (id) => {
      expandedCardId.value = expandedCardId.value === id ? null : id;
    };

    return {
      user,
      isMyProfile,
      isCurrentUser,
      targetUserId,
      userRecipes,
      editProfile,
      subscribeOrUnsubscribe,
      isSubscribed,
      isEditing,
      isSaving,
      showMessage,
      mediaUrl,
      isUserLoaded,
      onEdit,
      isPasswordVisible,
      togglePasswordVisibility,
      closeEditForm,
      ...profileForm, // Хук, возвращает объект, поэтому пользуемся оператором разворачивания, перенесла всю логику изменения пароля туда

      expandedCardId,
      toggleCard
    };
  },
  computed: {
    formattedDate() {
      if (!this.user || !this.user.date_joined) return 'Загрузка...';
      return new Date(this.user.date_joined).toLocaleDateString('ru-RU');
    }
  },
  components: { RecipeCard, AppPage, AppRecipeCard, AppButton, AppInput, AppMessage }
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: fadeIn 0.5s ease-in-out; /* Анимация появления */
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
}

/* Стили для контейнера сообщения */
.message-container {
  position: relative;
  margin-bottom: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin-left: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    width: 250px;
    height: 250px;
  }

  .message-container {
    margin-left: 0;
  }
}

@media (max-width: 594px) {
  .profile-photo-container {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 542px) {
  .profile-photo-container {    
    width: 150px;
    height: 150px;
    
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
    width: 110px;
    height: 110px;
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