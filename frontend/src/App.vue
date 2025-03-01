<template>
  <!-- <main-layout></main-layout> страница с рецептами (главная)
       <auth-layout></auth-layout>
       <reg-layout></reg-layout> -->
  <div v-cloak> <!--Элементы становятся видимыми только когда страница полностью отрендерится-->
    <component :is="layout+'-layout'" v-if="layout"></component> <!--Конкатенируем сам layout из meta с оставшейся строкой и получаем название, динамический компонент-->
  </div>
</template>

<script>
import { defineComponent } from 'vue';
// Нужно получить метаданные текущего роута с помощью UseRoute()
import { useRoute } from 'vue-router'
import { useStore} from 'vuex'
import { computed } from 'vue'
import MainLayout from './layout/MainLayout.vue';
import AuthLayout from './layout/AuthLayout.vue';
import AddRecipeLayout from './layout/AddRecipeLayout.vue';
import RegLayout from './layout/RegLayout.vue';
import RecipePageLayout from './layout/RecipePageLayout.vue';
import FavouriteLayout from './layout/FavouriteLayout.vue';
import ProfileLayout from './layout/ProfileLayout.vue';
import MyRecipesLayout from './layout/MyRecipesLayout.vue';

export default{
  setup() {
    const route = useRoute() // Текущий роут
    const layout = computed(() => route.meta.layout)
    
    return{
      layout//Возвращаем значение layout из meta для доступа в шаблоне
    }    
  },

  components:{ 
    'main-layout': MainLayout, 
    'auth-layout': AuthLayout, 
    'add-recipe-layout': AddRecipeLayout, 
    'reg-layout': RegLayout,
    'recipe-page-layout': RecipePageLayout,
    'favourite-layout': FavouriteLayout,
    'profile-layout' : ProfileLayout,
    'my-recipes-layout' : MyRecipesLayout
  }
}
</script>

