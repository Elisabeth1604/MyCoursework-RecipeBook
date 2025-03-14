<!-- Этот компонент объединяет в себя название и контейнер для контента страниц Профиль, Мои рецепты, Избранное -->
<template>
  <div class="app-page">
    <the-filters v-if="filters"/> <!--Если передан пропс, то на странице отображаются еще фильтры (только на главной)-->
    <h2>{{title}}</h2>
    <slot/> <!--Сюда вставляем контент-->
  </div>
</template>

<script>
import { defineComponent, props } from 'vue'
import TheFilters from "@/components/TheFilters.vue";

export default defineComponent({
  props:{
    title:{
      type: String,
      required: true
    },
    //Фильтры отображаем только на главной, передаем в пропс
    filters:{
      type: Boolean,
      required: false
    }
  },
  setup(props) {
    document.title=`${props.title} | Поделюсь рецептом`
  },
  components: {
    TheFilters,
  }
})
</script>

<style scoped>
.app-page{
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>