import { createRouter, createWebHistory, linkActiveClass, linkExactActiveClass } from 'vue-router'
import store from '../store/store'
import RecipeList from '../views/RecipeList.vue'

const routes = [
  { // Доступен без авторизации (главная)
    path: '/',
    name: 'RecipeList',
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
      layout: 'common-form', // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'common-form'
      auth: true
    }
  },
  
  { // Доступен без авторизации (регистрация)
    path: '/reg',
    name: 'Reg',
    component: () => import('../views/Reg.vue'),
    meta:{
      layout: 'common-form'
    }
  },
  { // Доступен без авторизации (страница рецепта)
    path: '/recipe-page/:id',
    name: 'RecipePage',
    component: () => import('../views/RecipePage.vue'),
    meta:{
      layout: 'main'
    }
  },
  { // Доступен с авторизацией (избранное)
    path: '/favourite',
    name: 'Favourite',
    component: () => import('../views/Favourite.vue'),
    meta:{
      layout: 'main',
      auth: true
    }
  },
  { // Доступен без авторизации (профиль другого пользователя)
    path: '/profile/:userId',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta:{
      layout: 'main',
    }
  },
  { // Доступен с авторизацией (свой профиль)
    path: '/profile',
    name: 'MyProfile',
    component: () => import('../views/Profile.vue'),
    meta:{
      layout: 'main',
      auth: true
    }
  },
  { // Доступен с авторизацией (добавленные рецепты пользователя)
    path: '/my-recipes',
    name: 'MyRecipes',
    component: () => import('../views/MyRecipes.vue'),
    meta:{
      layout: 'main',
      auth: true
    }
  },
  {
    path: '/edit-recipe/:id',
    name: 'EditRecipe',
    component: () => import('@/views/EditRecipe.vue'),
    meta: {
      layout: 'common-form',
      auth: true
    }
  },
  {
    path: '/calorie-calculator',
    name: 'CalorieCalculator',
    component: () => import('@/views/CalorieCalculator.vue'),
    meta: {
      layout: 'main'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Чтобы при переходе на другую страницу вернуться в начало прокрутки
    return { top: 0 };
  },
  // CSS-классы, которые Vue Router будет добавлять к <router-link>, когда ссылка активна
  linkActiveClass: 'active', // класс для всех подходящих путей
  linkExactActiveClass: 'active' // класс только для точного совпадения
})

// Вызывается перед загрузкой страницы
let routeStartTime = 0;

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth;
  routeStartTime = Date.now(); // для отслеживания времени загрузки

  store.commit('setGlobalLoader', true);

  if (requireAuth && !store.getters['auth/isAuthenticated']) {
    store.commit('auth/showLoginModal');
    store.dispatch("setMessage", {
      type: "warning",
      text: 'Пожалуйста, войдите или зарегистрируйтесь и попробуйте снова!',
      position: "app-message"
    });
    next(false); // отменяем переход
  } else {
    next(); // продолжаем переход
  }
});

// Отключение лоадера после загрузки страницы через определенное время
// чтобы даже если страница загрузилась моментально, не было мигания и было плавно
router.afterEach(() => {
  const elapsed = Date.now() - routeStartTime; // сколько миллисекунд прошло с начала перехода
  const remaining = 500 - elapsed; // сколько осталось до 500 мс

  setTimeout(() => {
    store.commit('setGlobalLoader', false);
  }, remaining > 0 ? remaining : 0);
});

export default router
