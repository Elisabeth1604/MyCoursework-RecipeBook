<template>
    <div class="nav-container">
        <div class="nav-buttons">
            <AppButton
                @action="handleAddRecipe"
                buttonClass="button"
            >Добавить рецепт</AppButton>

            <AppButton
                @action="handleCalorieCalculator"
                buttonClass="button"
            >Калькулятор КБЖУ</AppButton>
            
            <div class="profile-menu-container">
                <AppButton v-if="isAuth"
                           @action="handleProfile"
                           buttonClass="button"
                >Профиль</AppButton>
                
                <AppButton v-else
                           @action="openLoginModal"
                           buttonClass="button"
                >Войти</AppButton>

                <ul v-if="isAuth" 
                    class="dropdown-menu" >
                    <li>
                        <a @click="handleMyRecipes">
                            <img :src="require('@/assets/icons/food.png')" 
                                 alt="Иконка рецептов" 
                                 class="dropdown-menu-icon">
                            Мои рецепты</a>
                    </li>
                    <hr>
                    <li>
                        <a @click="handleFavourite">
                            <img :src="require('@/assets/icons/heart (1).png')" 
                                 alt="Иконка избранного" 
                                 class="dropdown-menu-icon">
                            Избранное</a>
                    </li>
                    <hr>
                    <li>
                        <a @click.prevent="logout">
                            <img :src="require('@/assets/icons/door.png')" 
                                 alt="Иконка выйти" 
                                 class="dropdown-menu-icon">
                            Выйти</a>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- гамбургер-меню -->
        <div class="menu-container">
            <div class="menu-icon">
                <img src="../../assets/icons/menu.png"
                     alt="Menu"
                />
            </div>
            
            <ul class="dropdown-menu" >
                <li>
                    <a @click="handleAddRecipe">
                        <img :src="require('@/assets/icons/add.png')" 
                             alt="Иконка добавить рецепт" class="dropdown-menu-icon">
                        Добавить рецепт</a>
                </li>
                <hr>
                <li>
                    <a @click="handleCalorieCalculator">
                        <img :src="require('@/assets/icons/calc_kkal.png')" 
                             alt="Иконка калькулятор калорий" 
                             class="dropdown-menu-icon">
                        Калькулятор КБЖУ</a>
                </li>
                <hr>
                <li v-if="isAuth">
                    <a @click="handleProfile">
                        <img :src="require('@/assets/icons/profile.png')" 
                             alt="Иконка профиля" 
                             class="dropdown-menu-icon">
                        Профиль</a>
                </li>
                <hr v-if="isAuth">
                <li v-if="isAuth">
                    <a @click="handleMyRecipes">
                        <img :src="require('@/assets/icons/food.png')" 
                             alt="Иконка рецептов" 
                             class="dropdown-menu-icon">
                        Мои рецепты</a>
                </li>
                <hr v-if="isAuth">
                <li v-if="isAuth">
                    <a @click="handleFavourite">
                        <img :src="require('@/assets/icons/heart (1).png')" 
                             alt="Иконка избранного" 
                             class="dropdown-menu-icon">
                        Избранное</a>
                </li>
                <hr v-if="isAuth">
                <li v-if="isAuth">
                    <a @click.prevent="logout">
                        <img :src="require('@/assets/icons/door.png')" 
                             alt="Иконка выйти" 
                             class="dropdown-menu-icon">
                        Выйти</a>
                </li>
                <li v-if="!isAuth">
                    <a @click.prevent="openLoginModal">
                        <img :src="require('@/assets/icons/door.png')" 
                             alt="Иконка войти" 
                             class="dropdown-menu-icon">
                        Войти</a>
                </li>
            </ul>
        </div>

        <AuthModal
            :isLoginVisible="isLoginVisible"
            @close="handleCloseModal"
        ></AuthModal>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AuthModal from '@/modal/AuthModal.vue';
import {
    AppButton,
} from '@ui';

const router = useRouter();
const store = useStore();

const isAuth = computed(() => store.getters['auth/isAuthenticated']);

const isLoginVisible = computed(() => store.state.auth.isLoginVisible);

const handleCalorieCalculator = () => {
    router.push('/calorie-calculator');
};

const openLoginModal = () => {
    if (!isLoginVisible.value) {
        store.commit('auth/showLoginModal');
    }
};

const handleAddRecipe = () => {
    router.push('/add-recipe');
};

const handleFavourite = () => {
    router.push('/favourite');
};

const handleProfile = () => {
    router.push('/profile');
    store.dispatch('user/fetchUser');
};

const handleMyRecipes = () => {
    router.push('/my-recipes');
};

const handleCloseModal = () => {
    store.commit('auth/hideLoginModal');
};

onMounted(() => {
    store.dispatch('user/fetchUser');
});
</script>

<style scoped>
.nav-container {
    display: flex;
    justify-self: end;    
    justify-content: space-between;
    align-items: center;
}

.nav-buttons {
    display: flex;
    gap: 10px;
}

.profile-menu-container, .menu-container {
    position: relative;
    display: inline-block;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 10;
    
    padding: 5px 0 5px 5px;
    margin-top: 0;
    width: 150px;

    border-radius: 5px;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  
    
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition:
        opacity 0.2s ease-out,
        transform 0.2s ease-out,
        visibility 0.2s ease-out;
    
    list-style: none;
}

.dropdown-menu li {
    align-items: center;
    padding: 5px;
    
    text-align: left;
    font-size: 14px;
}

.dropdown-menu li a {
    display: flex;
    align-items: center;
    gap: 10px;
    
    text-decoration: none;
    color: #333;
    
    transition: color 0.15s ease;
    
    cursor: pointer;
}

.dropdown-menu li a:hover {
    color:#FF9973;
}

.dropdown-menu li a:active {
    color:#ff5722;
}

.dropdown-menu-icon {
    width: 18px;
    height: 18px;
}

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

hr {
    width: 100px;
    border-color:lightgray;
    margin: 4px 0 2px 0;
}

/* Гамбургер-меню скрыто по умолчанию */
.menu-icon {
    display: none;  
    height: 40px;
    cursor: pointer;
}

@media (max-width: 1290px) {
    .nav-buttons {
        display: none;
    }
    .menu-icon {
        display: block;
        height: 40px;
        width: 40px;
    }
    .menu-icon img {
        width: 90%;
        height: auto;
    }
}

@media (max-width: 768px){
    .menu-icon {
        height: 35px;
        width: 35px;
    }
}
</style>
