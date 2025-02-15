<template>
    <div class ="search-form"> <!-- Форма поиска рецептов-->
        <input class ="search-form_txt"  id="search-form_txt"  type="text" placeholder="Найдите рецепт">
        <!-- Кнопка, компонент AppButton, который 
         использует кастомное событие action для вызова метода search -->
         <app-button 
            @action="search"
            button-class="search-button"
        >Поиск</app-button>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import AppButton from './AppButton.vue';

export default defineComponent({
    setup() {
        
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
    outline: none; /* Убираем стандартное выделение */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* Легкая тень для улучшения визуала */
}

/* Уменьшаем размеры поиска при уменьшении экрана */
@media (max-width: 1030px) {
  .search-form input {
      width: 250px; /* Уменьшаем ширину поля ввода */
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
    width: 100px; /* Занимает всю ширину родительского элемента */
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
        width: 80px; /* Занимает всю ширину родительского элемента */
        font-size: 11px;    
    }
    .search-button{
        font-size: 11px;
    }
}
</style>