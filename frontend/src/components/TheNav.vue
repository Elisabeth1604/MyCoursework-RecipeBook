<template>
  <div class="nav-container">
    <div :class="{ 'open': isMenuOpen }" class="nav-buttons">
      <app-button
      @action="handleAddRecipe"
      buttonClass="button"
      >Добавить рецепт</app-button>
      <!-- Кнопки, компоненты AppButton, который
      использует кастомное событие action
      для вызова методов viewCategories и viewProfile -->
      <app-button
          @action="viewCalorieCalculator"
          buttonClass="button"
      >Калькулятор калорий</app-button>
      <div class="profile-menu-container">
        <app-button v-if="isAuth"
            @action="handleProfile"
            buttonClass="button"
        >Профиль</app-button>
        <app-button v-else
            @action="openLoginModal"
            buttonClass="button"
        >Войти</app-button>
        <!-- Выпадающее меню -->
        <ul class="dropdown-menu" v-if="isAuth">
          <li><a @click="handleMyRecipes">
              <img :src="require('@/assets/icons/food.png')" alt="Иконка рецептов" class="dropdown-menu-icon">Мои рецепты</a></li>
          <hr>
          <li><a @click="handleFavourite">
              <img :src="require('@/assets/icons/heart (1).png')" alt="Иконка избранного" class="dropdown-menu-icon">Избранное</a></li>
          <hr>
          <li><a @click.prevent="logout">
              <img :src="require('@/assets/icons/door.png')" alt="Иконка выйти" class="dropdown-menu-icon">Выйти</a></li>
        </ul>
      </div>
    </div>
    <!-- Иконка гамбургер-меню -->
    <div class="menu-icon" @click="toggleMenu">
      <img src="../assets/icons/menu.png" alt="Menu" />
    </div>
    <!-- Модальное окно входа, обрабатываем событие закрытия, которое эмитит LoginModal-->
    <auth-modal
        :isLoginVisible="isLoginVisible"
        @close="handleCloseModal"
    ></auth-modal>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import AppButton from './AppButton.vue';
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import AuthModal from '@/modal/AuthModal.vue';
import axios from "axios";
import store from "@/store/store";

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()

    const isMenuOpen = ref(false) // Флаг открытия выпадающего меню

    const isAuth = computed(() => store.getters['auth/isAuthenticated']);// Управление аутентификацией

    const isLoginVisible = computed(() => store.state.auth.isLoginVisible);// Управление показом модального окна входа

    const viewCalorieCalculator = () => {
    }

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    }

    const openLoginModal = () => {
      if (!isLoginVisible.value) {
        store.commit('auth/showLoginModal');
      }
    }

    const handleAddRecipe = () => {  // Обработчик нажатия на кнопку Добавить рецепт
      router.push('/add-recipe');
    };

    const handleFavourite = () => { // Обработчик нажатия Избранное
      router.push('/favourite');
    }

    const handleProfile = () => { // Обработчик нажатия Профиль
      router.push('/profile');
      store.dispatch('user/fetchUser');
    }

    const handleMyRecipes = () => { // Обработчик нажатия Мои рецепты
      router.push('/my-recipes');
    };

    const handleCloseModal = () => {
      store.commit('auth/hideLoginModal');
    };

    onMounted(() => {
      store.dispatch('user/fetchUser');
    });

    return{
      logout:() => {
        store.dispatch('auth/logout')
        store.dispatch("user/logoutUser")
        delete axios.defaults.headers.common['Authorization'];
        router.push('/')
      },
      isAuth,
      isLoginVisible,
      isMenuOpen,
      openLoginModal,
      handleAddRecipe,
      toggleMenu,
      viewCalorieCalculator,
      handleFavourite,
      handleProfile,
      handleMyRecipes,
      handleCloseModal
    }
  },
  components:{ AppButton, 'auth-modal':AuthModal}
})
</script>

<style scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

/* Контейнер для кнопки профиля и выпадающего меню */
.profile-menu-container {
  position: relative;
  display: inline-block;
}

/* Выпадающее меню */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 10; /*Чтобы отображалось поверх*/
  list-style: none;
  padding-bottom: 5px;
  padding-left: 5px;
  margin-top: 0;
  width: 150px; /* Ширина выпадающего меню */
  border-radius: 5px;
  /* Анимационные свойства */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition:
      opacity 0.2s ease-out,
      transform 0.2s ease-out,
      visibility 0.2s ease-out;
}

/* Стили для элементов выпадающего меню */
.dropdown-menu li {
  padding: 5px;
  text-align: left;
  font-size: 14px;
}

.dropdown-menu li a {
  text-decoration: none;
  color: #333;
  display: block;
  cursor: pointer;
  transition: color 0.15s ease;
}

.dropdown-menu li a:hover {
  color:#FF9973; /*Цвет текста при наведении*/
}

.dropdown-menu li a:active {
  color:#ff5722; /*Цвет текста при нажатии*/
}

.dropdown-menu-icon { /* Для изображений иконок */
  margin-right: 10px;
  width: 18px;
  height: 18px;
}

/* Показ меню при наведении на кнопку Профиль */
.profile-menu-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

hr{
  width: 100px;
  border-color:lightgray;
  margin: 4px 0 0 0;
}

/* Гамбургер-меню скрыто по умолчанию */
.menu-icon {
  display: none;
  cursor: pointer;
  height: 40px;
}

@media (max-width: 1100px) {
  .nav-buttons {
    position: absolute;
    top: 60px;
    right: 10px;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    border-radius: 5px;
    align-items: flex-start;
    padding: 0;
    margin: 0;
    width: auto;
    max-height: 0;
    opacity: 0;
    overflow: visible;
    transform: translateY(-10px);
    transition:
        transform 0.2s ease-out,
        opacity 0.3s ease-out,
        visibility 0.2s ease-out;
  }

  .menu-icon {
    display: block; /* Показываем иконку меню */
    height: 40px;
    width: 40px;
  }
  .menu-icon img {
    width: 90%;  /* Иконка будет адаптироваться по ширине родительского элемента */
    height: auto; /* Поддерживаем пропорции */
  }

  /* Когда меню открыто*/
  .nav-buttons.open {
    flex-direction: column;
    position: absolute;
    top: 65px;
    right: 1%;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    border-radius: 5px;
    align-items: flex-start;

    max-height: 500px; /* Достаточно для всего меню */
    opacity: 1;
    overflow: visible;
    transform: translateY(0);
  }
}

@media (max-width: 768px){
  .menu-icon {
    height: 35px;
    width: 35px;
  }
}
</style>