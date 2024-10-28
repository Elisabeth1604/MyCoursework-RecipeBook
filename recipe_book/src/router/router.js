import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store'
import RecipeList from '../views/RecipeList.vue'
import RecipePage from '@/views/RecipePage.vue'


const routes = [
  { // Доступен без авторизации (главная)
    path: '/', // Путь URL маршрута
    name: 'RecipeList', // Имя маршрута
    component: RecipeList, // Какой именно компонент будет использоваться
    meta:{
      layout: 'main' // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'main'
    }
  },
  { // Доступен с авторизацией
    path: '/add-recipe',
    name: 'AddRecipe',   
    component: () => import('../views/AddRecipe.vue'), // Ленивая загрузка компонента добавления рецепта (только когда он нужен)
    meta:{
      layout: 'add-recipe', // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'main'
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
    component: RecipePage,
    meta:{
      layout: 'recipe-page' // Дополнительные метаданные для маршрута. Этот маршрут использует layout 'recipe-page'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Вызывается перед загрузкой страницы
router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth

  if(requireAuth && store.getters['auth/isAuthenticated']){
    next() // Если пользователь авторизован, переходим на новую страницу
  } else if(requireAuth && !store.getters['auth/isAuthenticated']){
    alert('Вы должны быть авторизованы, чтобы получить доступ к этой странице.');
    next(true) // Прерываем переход на страницу
    
  } else{
    next()
  }
})

export default router
