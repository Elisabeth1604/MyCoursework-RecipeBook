<template>
  <div v-cloak> <!--Элементы становятся видимыми только когда страница полностью отрендерится-->
    <app-loader/>
    <component :is="layout+'-layout'" v-if="layout"></component> <!--Конкатенируем сам layout из meta с оставшейся строкой и получаем название, динамический компонент-->
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import MainLayout from './layout/MainLayout.vue';
import CommonFormLayout from './layout/CommonFormLayout.vue';
import AppLoader from "@/components/ui/AppLoader.vue";

export default{
  setup() {
    const route = useRoute() // Текущий роут, получить его метаданные
    const layout = computed(() => route.meta.layout)
    
    return{
      layout //Возвращаем значение layout из meta для доступа в шаблоне
    }    
  },

  components:{ 
    'main-layout': MainLayout,
    'common-form-layout': CommonFormLayout,
    'app-loader': AppLoader
  }
}
</script>

