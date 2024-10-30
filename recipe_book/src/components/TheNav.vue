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
                @action="viewCategories"
                buttonClass="button"
            >Категории</app-button>
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
                    <li><a @click="handleProfile">
                        <img src="..\assets\icons\profile.png" alt="Иконка профиля" class="dropdown-menu-icon">Мой профиль</a></li>
                    <hr>
                    <li><a @click="handleMyRecipes">
                        <img src="..\assets\icons\food.png" alt="Иконка рецептов" class="dropdown-menu-icon">Мои рецепты</a></li>
                    <hr>
                    <li><a @click="handleFavourite">
                        <img src="..\assets\icons\heart (1).png" alt="Иконка избранного" class="dropdown-menu-icon">Избранное</a></li>
                    <hr>
                    <li><a @click.prevent="logout">
                        <img src="..\assets\icons\door.png" alt="Иконка выйти" class="dropdown-menu-icon">Выйти</a></li>
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
            @close="isLoginVisible = false"
        ></auth-modal>
    </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import AppButton from './AppButton.vue';
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import AuthModal from '@/modal/AuthModal.vue';

export default defineComponent({
    setup() {
        const router = useRouter()
        const store = useStore()

        const isMenuOpen = ref(false) // Управляем открытием выпадающего меню
        const isAuth = ref(true) // Управляем аутентификацией
        const isLoginVisible = ref(false) // Управляем показом модального окна входа

        const viewCategories = () => {
            alert('Opening categories...');
        }

        const viewProfile = () => {
            alert('Redirecting to profile...');
        }

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
            const navButtons = document.querySelector('.nav-buttons');
            if (isMenuOpen.value) {
                navButtons.classList.add('open');
            } else {
                navButtons.classList.remove('open');
            }
        }

        const openLoginModal = () => {
            isLoginVisible.value = true; // Показываем модальное окно
            console.log('Показали модальное окно входа');
            console.log(isLoginVisible.value);
        }
      
        const handleAddRecipe = () => {  // Обработчик нажатия на кнопку Добавить рецепт
            console.log('Добавить рецепт нажат'); // Добавьте это сообщение
            // if (isAuth.value) {
                router.push('/add-recipe');
                
            // } else {
            //     openLoginModal();
            //     console.log('Переход не выполнен');
            // }
        };

        const handleFavourite = () => { // Обработчик нажатия Избранное
            console.log('Нажали перейти в избранное');
            router.push('/favourite');
        }

        const handleProfile = () => { // Обработчик нажатия Профиль
            console.log('Нажали перейти в профиль');
            router.push('/profile');
        }

        const handleMyRecipes = () => { // Обработчик нажатия Мои рецепты
            console.log('Нажали перейти в мои рецепты');
            router.push('/my-recipes');
        }
                
        return{
            logout:() => {
                store.commit('auth/logout') // Вызываем мутацию logout
                router.push('/') // Отправляем пользователя на главную
            },
            isAuth,
            isLoginVisible,
            isMenuOpen,
            openLoginModal,
            handleAddRecipe,
            toggleMenu,
            viewCategories,
            viewProfile,
            handleFavourite,
            handleProfile,
            handleMyRecipes
        }
    },
    components:{ AppButton, 'auth-modal':AuthModal}
   
})
</script>

<style scoped>
/* Основные стили */
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
  display: none; /* По умолчанию скрыто */
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
  display: block;
}

hr{
    width: 100px;
    border-color:lightgray;
    margin: 0;
    margin-top: 4px;
}

/* Гамбургер-меню скрыто по умолчанию */
.menu-icon {
    display: none;
    cursor: pointer;
    height: 40px;
}


@media (max-width: 956px) {
    .nav-buttons {
        display: none; /* Скрываем кнопки на малых экранах */
    }

    .menu-icon {
        display: block; /* Показываем иконку меню */
        height: 40px;
        width: 40px;
    }
    .menu-icon img {
        width: 100%;  /* Иконка будет адаптироваться по ширине родительского элемента */
        height: auto; /* Поддерживаем пропорции */
    }

    /* Когда меню открыто (класс open добавляется через JS) */
    .nav-buttons.open {
        display: flex; /* Показываем кнопки при нажатии на меню */
        flex-direction: column;
        position: absolute;
        top: 60px;
        right: 0;
        background-color: #fff;
        padding: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 10;
        border-radius: 5px;
        align-items: center;
    }
}
</style>