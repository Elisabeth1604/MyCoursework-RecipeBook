<template>
  <div class ="search-form">
    <input class ="search-form_txt"
           id="search-form_txt"
           type="text"
           v-model="searchQuery"
           placeholder="Найти рецепт">
    <!-- Кнопка, компонент AppButton, который
     использует кастомное событие action для вызова метода search -->
     <app-button
        @action="search"
        button-class="search-button"
     >Поиск</app-button>
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue'
import { useStore } from 'vuex';
import AppButton from './AppButton.vue';

export default defineComponent({
  setup() {
    const store = useStore();
    const searchQuery = ref(''); // Локальное состояние для поискового запроса

    const search = () => {
      // Если значение запроса не пустое (с удалёнными пробелами)
      if (searchQuery.value.trim()) {
        store.dispatch('recipe/searchRecipes', searchQuery.value);
      }
      else{
        store.dispatch('recipe/fetchRecipes')
      }
    };
    return {
      searchQuery,
      search,
    };
  },
  components:{ AppButton }
})
</script>

<style>
.search-form {
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: #fff;
  border-radius: 5px;
}

.search-form input {
  padding: 10px;
  border-radius: 5px;
  border: none;
  width: 300px;
  outline: none; /* Убрать стандартное выделение */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

/* Уменьшаем размеры поиска при уменьшении экрана */
@media (max-width: 1030px) {
  .search-form input {
    width: 250px;
  }
}

@media (max-width: 618px) {
  .search-form {
    height: 30px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .search-form input {
    width: 200px;
    height: 10px;
  }
}

@media (max-width: 567px) {
  .search-form input {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .search-form input {
    width: 100px;
    font-size: 12px;    
  }

  .search-form{
    margin-right: 10px;
    margin-left: 10px;
  }

  .search-button{
    font-size: 12px;
  }
}

@media (max-width: 400px) {
  .search-form input {
    width: 80px;
    font-size: 11px;
  }
  .search-button{
    font-size: 11px;
  }
}
</style>