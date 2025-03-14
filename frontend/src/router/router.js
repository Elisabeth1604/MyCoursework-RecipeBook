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
  { // Доступен с авторизацией (профиль пользователя)
    path: '/profile',
    name: 'Profile',
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
router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth

  if(requireAuth && store.getters['auth/isAuthenticated']){
    next() // Если пользователь авторизован, переходим на новую страницу
  } else if(requireAuth && !store.getters['auth/isAuthenticated']){
    alert('Вы должны быть авторизованы, чтобы получить доступ к этой странице.');
    store.commit('auth/showLoginModal');
    next(false) // Прерываем переход на страницу (изменить на false потом!!!!)
    
  } else{
    next()
  }
})

export default router
