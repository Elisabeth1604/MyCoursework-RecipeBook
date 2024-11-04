<template>
    <app-page title="Профиль"> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->
      <div class="profile">
        <section class="profile-info">
        <div class="profile-photo-container">
          <img src="..\assets\images\person.jpg" alt="Фото пользователя" class="avatar" />
        </div>
        <div class="details">
            <p><strong>Имя:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p>Дата регистрации: 01.01.01</p>
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
                      
              placeholder="Введите новое имя пользователя"
              required
            ></app-input>

            <app-input
              label="Изменить email"
              name="email"
              iD="email"
              type="text"
              input-class="edit-profile-input"
                      
              placeholder="Введите новый адрес электронной почты"
              required
            ></app-input>

            <app-input
              label="Изменить фото"
              name="image"
              iD="image"
              type="file"
              input-class="add-recipe-form"
              required
            ></app-input>

            <h3>Изменить пароль</h3>

            <app-input
              label="Старый пароль"
              name="old_password"
              iD="old_password"
              type="text"
              input-class="edit-profile-input"
                      
              placeholder="Введите старый пароль"
              required
            ></app-input>

            <app-input
              label="Новый пароль"
              name="new_password"
              iD="new_password"
              type="text"
              input-class="edit-profile-input"
                      
              placeholder="Введите новый пароль"
              required
            ></app-input>

            <app-input
              label="Подтверждение пароля"
              name="confirm_password"
              iD="confirm_password"
              type="text"
              input-class="edit-profile-input"
                      
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
import { defineComponent, computed, ref } from 'vue'
import AppPage from '@/components/ui/AppPage.vue';
import { useStore } from 'vuex';
import AppRecipeCard from '@/components/AppRecipeCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import AppMessage from '@/components/ui/AppMessage.vue';

export default defineComponent({
    setup() {
    const store = useStore();

    const isEditing = ref(false); // Флаг для формы редактирования профиля
    const isSaving = ref(false); //Если нажали сохранить изменения, изменяется на true для надписи сохраняем...

    const user = computed(() => store.state.user);
    const userRecipes = computed(() => store.getters['recipe/getUserRecipes'](user.value.id));

    const showMessage = computed(() => store.getters.showMessage); // Флаг для уведомления

    const editProfile = () => {
      // Здесь можно добавить логику для редактирования профиля      
      isEditing.value = true;
    };    

    const savedEdits = () => {
      isSaving.value = true // Флаг для сообщения, что идет сохранение
      setTimeout(() => {
        isEditing.value = false;
        isSaving.value = false;
        store.dispatch('setMessage', { type: 'success', text: 'Изменения сохранены' });
      }, 3000); // 3000 миллисекунд = 3 секунды, через 3 секунды форма закроется и появится сообщение "Изменения сохранены"
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
      savedEdits,
      isEditing,
      isSaving,
      showMessage
    };
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

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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