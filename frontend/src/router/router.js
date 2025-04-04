import { createRouter, createWebHistory, linkActiveClass, linkExactActiveClass } from 'vue-router'
import store from '../store/store'
import RecipeList from '../views/RecipeList.vue'

const routes = [
  { // Доступен без авторизации (главная)
    path: '/', // Путь URL маршрута
    name: 'RecipeList', // Имя маршрута
    component: RecipeList, // Какой именно компонент будет использоваться
    meta:{
      layout: 'main' // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'main'
    }
  },
  { // Доступен с авторизацией (страница добавления нового рецепта)
    path: '/add-recipe',
    name: 'AddRecipe',   
    component: () => import('../views/AddRecipe.vue'), // Ленивая загрузка компонента добавления рецепта (только когда он нужен)
    meta:{
      layout: 'add-recipe', // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'add-recipe'
      auth: true
    }
  },
  
  { // Доступен без авторизации (регистрация)
    path: '/reg',
    name: 'Reg',
    component: () => import('../views/Reg.vue'), // Ленивая загрузка компонента регистрации (только когда он нужен)
    meta:{
      layout: 'reg' // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'reg'
    }
  },
  { // Доступен без авторизации (страница рецепта)
    path: '/recipe-page/:id',
    name: 'RecipePage',
    component: () => import('../views/RecipePage.vue'), // Ленивая загрузка компонента рецепта (только когда он нужен)
    meta:{
      layout: 'recipe-page' // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'recipe-page'
    }
  },
  { // Доступен с авторизацией (избранное)
    path: '/favourite',
    name: 'Favourite',
    component: () => import('../views/Favourite.vue'), // Ленивая загрузка компонента избранного (только когда он нужен)
    meta:{
      layout: 'favourite', // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'favourite'
      auth: true
    }
  },
  { // Доступен без авторизации (профиль другого пользователя)
    path: '/profile/:userId',
    name: 'Profile',
    component: () => import('../views/Profile.vue'), // Ленивая загрузка компонента профиля (только когда он нужен)
    meta:{
      layout: 'profile', // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'profile'
    }
  },
  { // Доступен с авторизацией (свой профиль)
    path: '/profile',
    name: 'MyProfile',
    component: () => import('../views/Profile.vue'), // Ленивая загрузка компонента профиля (только когда он нужен)
    meta:{
      layout: 'profile', // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'profile'
      auth: true
    }
  },
  { // Доступен с авторизацией (добавленные рецепты пользователя)
    path: '/my-recipes',
    name: 'MyRecipes',
    component: () => import('../views/MyRecipes.vue'), // Ленивая загрузка компонента профиля (только когда он нужен)
    meta:{
      layout: 'my-recipes', // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'profile'
      auth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Чтобы при переходе на другую страницу вернуться в начало прокрутки
    return { top: 0 };
  },
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

// Вызывается перед загрузкой страницы
let routeStartTime = 0;

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth;
  routeStartTime = Date.now(); // запоминаем старт

  store.commit('setGlobalLoader', true);

  if (requireAuth && !store.getters['auth/isAuthenticated']) {
    store.commit('auth/showLoginModal');
    store.dispatch("setMessage", {
      type: "warning",
      text: 'Пожалуйста, зарегистрируйтесь и попробуйте снова!',
      position: "app-message"
    });
    next(false); // отменяем переход
  } else {
    next(); // продолжаем переход
  }
});

router.afterEach(() => {
  const elapsed = Date.now() - routeStartTime;
  const remaining = 500 - elapsed;

  setTimeout(() => {
    store.commit('setGlobalLoader', false);
  }, remaining > 0 ? remaining : 0);
});


export default router
