<template>
  <div class="nav-container">
    <div class="nav-buttons">
      <app-button
      @action="handleAddRecipe"
      buttonClass="button"
      >Добавить рецепт</app-button>
      <!-- Кнопки, компоненты AppButton, который
      использует кастомное событие action
      для вызова методов viewCategories и viewProfile -->
      <app-button
          @action="handleCalorieCalculator"
          buttonClass="button"
      >Калькулятор КБЖУ</app-button>
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
    <div class="menu-container">
      <div class="menu-icon">
        <img src="../assets/icons/menu.png" alt="Menu" />
      </div>
      <ul class="dropdown-menu" >
        <li><a @click="handleAddRecipe">
          <img :src="require('@/assets/icons/add.png')" alt="Иконка добавить рецепт" class="dropdown-menu-icon">Добавить рецепт</a></li>
        <hr>
        <li><a @click="handleCalorieCalculator">
          <img :src="require('@/assets/icons/calc_kkal.png')" alt="Иконка калькулятор калорий" class="dropdown-menu-icon">Калькулятор КБЖУ</a></li>
        <hr>
        <li v-if="isAuth"><a @click="handleProfile">
          <img :src="require('@/assets/icons/profile.png')" alt="Иконка профиля" class="dropdown-menu-icon">Профиль</a></li>
        <hr v-if="isAuth">
        <li v-if="isAuth"><a @click="handleMyRecipes">
          <img :src="require('@/assets/icons/food.png')" alt="Иконка рецептов" class="dropdown-menu-icon">Мои рецепты</a></li>
        <hr v-if="isAuth">
        <li v-if="isAuth"><a @click="handleFavourite">
          <img :src="require('@/assets/icons/heart (1).png')" alt="Иконка избранного" class="dropdown-menu-icon">Избранное</a></li>
        <hr v-if="isAuth">
        <li v-if="isAuth"><a @click.prevent="logout">
          <img :src="require('@/assets/icons/door.png')" alt="Иконка выйти" class="dropdown-menu-icon">Выйти</a></li>
        <li v-if="!isAuth"><a @click.prevent="openLoginModal">
          <img :src="require('@/assets/icons/door.png')" alt="Иконка войти" class="dropdown-menu-icon">Войти</a></li>
      </ul>
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

    const isAuth = computed(() => store.getters['auth/isAuthenticated']);// Управление аутентификацией

    const isLoginVisible = computed(() => store.state.auth.isLoginVisible);// Управление показом модального окна входа

    const handleCalorieCalculator = () => {
      router.push('/calorie-calculator')
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
      openLoginModal,
      handleAddRecipe,
      handleCalorieCalculator,
      handleFavourite,
      handleProfile,
      handleMyRecipes,
      handleCloseModal
    }
  },
  components: { AppButton, 'auth-modal': AuthModal }
})
</script>

<style scoped>
.nav-container {
  justify-self: end;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

/* Контейнер для кнопки профиля и выпадающего меню */
.profile-menu-container, .menu-container {
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
  padding: 5px 0 5px 5px;
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
  align-items: center;
  padding: 5px;
  text-align: left;
  font-size: 14px;
}

.dropdown-menu li a {
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: color 0.15s ease;
}

.dropdown-menu li a:hover {
  color:#FF9973;
}

.dropdown-menu li a:active {
  color:#ff5722;
}

.dropdown-menu-icon { /* Для изображений иконок */
  width: 18px;
  height: 18px;
}

/* Показ меню при наведении на кнопку Профиль */
.profile-menu-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.menu-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

hr{
  width: 100px;
  border-color:lightgray;
  margin: 4px 0 2px 0;
}

/* Гамбургер-меню скрыто по умолчанию */
.menu-icon {
  display: none;
  cursor: pointer;
  height: 40px;
}

@media (max-width: 1290px) {
  .nav-buttons {
    display: none;
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
}

@media (max-width: 768px){
  .menu-icon {
    height: 35px;
    width: 35px;
  }
}
</style>