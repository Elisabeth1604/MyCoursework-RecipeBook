<template>
<div>
  <!-- Модальное окно для развернутого изображения -->
  <ImageModal :imageUrl="selectedImage" :visible="isModalVisible" @close="isModalVisible = false" />

  <div class="recipe-page" v-if="recipe">
    <!-- Название рецепта -->
    <h1 class="recipe-title">{{ recipe.recipe_title }}</h1>
    <!-- Описание рецепта -->
    <p class="recipe-description">{{ recipe.description }}</p>
    <!-- Автор рецепта -->
      <div class="author">
          <img :src="recipe.user.avatar ? `${mediaUrl}${recipe.user.avatar}` : require('@/assets/icons/profile.png')" alt="Фото автора рецепта">
          <p class="recipe-author" >Автор: <a :href="`/profile/${recipe.user.id}`" title="Перейти в профиль автора">{{ recipe.user.username }}</a></p>
      </div>
    <!-- Блок с фото и количеством порций -->
    <div class="recipe-header">
      <img :src="recipe.main_photo ? `${mediaUrl}${recipe.main_photo}` : require('@/assets/images/fallback.jpg')"
           alt="Фото рецепта"
           class="recipe-image"
           @click="openImage(recipe.main_photo)"/>
      <div class="right-section">
        <div class="servings-ingred-header">
          <h2>Ингредиенты:</h2>
          <div class="servings-section">
            <label for="servings">Порции:</label>
            <div class="servings-control">
                <button @click="changeServings(-1)">&#9664;</button>
                <input type="number" id="servings" v-model="currentServings" min="1" />
                <button @click="changeServings(1)">&#9654;</button>
            </div>
          </div>
        </div>
        <!-- Ингредиенты -->
        <div class="ingredients">
          <ul>
            <li v-for="ingredient in adjustedIngredients" :key="ingredient.name" class="ingredient-item">
              <span class="ingredient-name">{{ ingredient.name }}</span>
              <div class="ingredient-divider"></div> <!-- Линия между названием и количеством -->
              <div class="ingredient-details">
                <span class="ingredient-amount" v-if="ingredient.amount!=='0.0'">{{ ingredient.amount }}</span>
                <span class="ingredient-amount" v-else></span>
                <span class="ingredient-unit">{{ ingredient.unit }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Инфо о калорийности -->
    <div class="recipe-info">
      <div class="recipe-info-calories">
        <img alt="Иконка калорийности" class="kkal-img" :src="require('@/assets/icons/kcal.png')" />
        <p class="recipe-info-content">Калорийность на 100 грамм: {{ Math.round(recipe.calories_per_100) }} ккал</p>
      </div>
      <!-- Инфо о времени приготовления -->
      <div class="recipe-info-time">
        <img alt="Иконка времени приготовления" :src="require('@/assets/icons/clock (2).png')">
        <p class="recipe-info-content">Общее время приготовления: {{recipe.prep_time_hour? recipe.prep_time_hour : 0}} ч {{  recipe.prep_time_min? recipe.prep_time_min : 0 }} мин</p>
      </div>
      </div>
    <hr>
    <!-- Шаги приготовления (отдельный компонент) -->
    <h2>Шаги приготовления:</h2>
    <div class="steps">
      <app-recipe-step
          v-for="(step, index) in recipe.steps"
          :key="index"
          :step="step"
          :index="index">
      </app-recipe-step>
    </div>
  </div>
  <div v-else>
      <p class="no-recipes">Рецепт не найден...</p>
  </div>
</div>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import AppRecipeStep from '@/components/AppRecipeStep.vue';
import ImageModal from '@/modal/ImageModal.vue';

export default {
  name: 'RecipePage',
  setup() {
    const store = useStore();
    const route = useRoute();

    // id рецепта из параметра route
    const recipeId = Number(route.params.id);

    // Доступ к рецепту из Vuex на основе id
    const recipe = computed(() => store.getters['recipe/getRecipeById'](recipeId));

    const isModalVisible = ref(false); // Открыто ли окно большого фото
    const selectedImage = ref('');

    // Доступ к количеству порций из Vuex
    const currentServings = computed({
        get: () => store.getters['recipe/servings'],
        set: (value) => store.commit('recipe/setServings', value),
    });

    const mediaUrl = computed(() => store.getters.mediaUrl);

    // Функция для изменения количества порций
    const changeServings = (amount) => {
      store.dispatch('recipe/updateServings', currentServings.value + amount);
    };

    const openImage = (imageUrl) => {
      selectedImage.value = imageUrl;
      isModalVisible.value = true;
    };

    onMounted(async () => {
      if (!store.state.recipe.recipes.length) {
        await store.dispatch('recipe/fetchRecipes');
      }
      if (recipe.value) {
        store.dispatch('recipe/setRecipe', recipe.value); // Устанавливаем текущий рецепт
        console.log(recipe.value.main_photo)
        console.log(adjustedIngredients.value)
      }
    });

    // Доступ к пересчитанным ингредиентам из Vuex
    const adjustedIngredients = computed(() =>
    store.getters['recipe/adjustedIngredients'].map(ingredient => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      }))
    );

    return {
      recipe,
      currentServings,
      adjustedIngredients,
      changeServings,
      isModalVisible,
      selectedImage,
      openImage,
      mediaUrl
    };
  },
  components: { AppRecipeStep, ImageModal }
};
</script>
  
<style scoped>
  /* Основной контейнер страницы рецепта */
  .recipe-page {
      width: 80%;
      margin: 0 auto;
      padding: 20px;
  }

  /* Название рецепта - по центру, увеличенный шрифт */
  .recipe-title {
      text-align: center;
      font-size: 2em;
      margin-bottom: 10px;
  }

  /* Описание рецепта - по центру */
  .recipe-description {
      text-align: center;
      font-size: 1.2em;
      margin-bottom: 20px;
  }

  /* Автор рецепта - по правому краю */
  .recipe-author {
      text-align: right;
      font-style: italic;
      text-decoration: none;
      color: #333;
  }

   /* Ссылка на профиль автора рецепта */
  .recipe-author a {
      text-align: right;
      font-style: italic;
      border-bottom: 1.5px dashed #333;
      text-decoration: none;
      color: #333;
  }

  .recipe-author a:hover {
      border-bottom: 1.5px dashed #FF9973;
      color: #FF9973;
  }

  .recipe-author a:active {
      border-bottom: 1.5px dashed #ff5722;
      color: #ff5722;
  }

  /* Класс для фото + имя */
  .author {
      display: flex;
      align-items: center;
      justify-content: end;
      margin-top: 10px; /* Отступ сверху для отделения от остальных элементов */
  }

  /* Фото профиля автора*/
  .author img{
      width: 40px; /* Ширина изображения */
      height: 40px; /* Высота изображения */
      border-radius: 20%; /* Закругление углов для создания круглой формы */
      object-fit: cover; /* Сохранение пропорций без искажения */
      margin-right: 10px; /* Отступ справа от изображения */
  }

  /* Блок с изображением и контролем порций */
  .recipe-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 20px;
  }

  /* Стиль для изображения рецепта */
  .recipe-image {
      max-height: 450px;
      object-fit: cover; /* Часть картинки, которая не поместилась, обрежется без искажений*/
      width: 49%; /* Такую часть ширины контейнера займёт */
      border-radius: 8px;
      cursor: pointer;
  }

  /* Блок для Ингредиенты и Порции */
  .servings-ingred-header{
      display: flex;
      justify-content: space-between;
      align-items: end;
  }

  /* Блок контроля количества порций */
  .servings-section {
      display: inline-flex;
      align-items: center;
      text-align: right;
  }

  /* Контейнер для кнопок и поля ввода количества порций */
  .servings-control {
      align-items: center;
      min-width: 74px;
  }

  /* Стиль для кнопок управления количеством порций */
  .servings-control button {
      background-color: #eee;
      border: none;
      padding: 4px;
      cursor: pointer;
  }

  /* Поле ввода для отображения текущего количества порций */
  .servings-control input {
      width: 50px;
      text-align: center;
      font-size: 1em;
  }

  /* Поле справа от картинки рецепта, количество порций и ингредиенты */
  .right-section{
      display: flex;
      flex-direction: column;
      width: 47%;
  }

  /* Убираем маркеры списка для ингредиентов */
  .ingredients ul {
      list-style-type: none;
      padding: 0;
  }

  /* Блок для списка ингредиентов */
  .ingredients {
      margin-top: 0;
  }

  .ingredient-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
  }

  .ingredient-name {
      font-weight: 500;
      flex: 0;
  }

  /* Полосы между названиями ингредиентов и их количеством */
  .ingredient-divider {
      height: 2px; /* Высота полосы */
      background-color: lightgray; /* Цвет полосы */
      flex: 1; /* Занимает оставшееся пространство */
      margin: 0 10px; /* Отступы по бокам */
  }

  .ingredient-details {
    display: grid;
    grid-template-columns: 45px 65px; /* Первая колонка фиксированной ширины, вторая занимает оставшееся пространство */
    align-items: center; /* Вертикальное выравнивание */
    gap: 10px;
  }

  /* Количество игредиентов */

  .ingredient-amount {
    text-align: left; /* Выравнивание чисел по правому краю */
  }

  .ingredient-unit {
    text-align: left; /* Выравнивание единиц измерения по левому краю */
  }

  .recipe-info{
    display: flex;
    flex-direction: column;
  }

  .recipe-info-calories, .recipe-info-time{
      display: inline-flex;
      align-items: center;
  }

  .recipe-info-content {
      font-weight: bold;
  }

  .recipe-info img{
      max-height: 30px;
      padding-right: 5px;
  }

  /* Блок для шагов приготовления */
  .steps {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      align-items: start; /* Все карточки выравниваются по верхней границе */
      margin-top: 20px;
  }

  .steps h2 {
      margin-bottom: 10px;
  }

  h1, h2{
      color: #333;
  }

  p{
      color: #333;
  }

  hr{
      width: 100%;
  }

/* Адаптивное поведение для класса servings-ingred-header */
  @media (max-width: 996px) {
      .servings-ingred-header{
          flex-direction: column;
      }

      .servings-control{
          height: 30px;
      }

  }

  /* Чтобы шаги выстраивались в одну колонку */
  @media (max-width: 700px) {
      .steps {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
          align-items: start;
          margin-top: 20px;
      }
  }

  @media (max-width: 602px) {
      .recipe-title{
          font-size:28px
      }

      .recipe-description{
          font-size:17px
      }
      .servings-control{
          height: 25px;
      }

      label{
          font-size:15px;
      }

      .servings-control button{
          height: 25px;

      }

      .ingredients{
          margin-top:5px;
      }

      .ingredient-name{
          font-size:15px
      }

      .ingredient-amount{
          font-size:15px
      }

      .ingredient-unit{
          width: 40px;
      }

      h2{
          font-size:22px
      }
  }

/* Более узкие экраны (мобильные) */
@media (max-width: 480px) {
  .recipe-title{
      font-size:25px
  }

  .recipe-description{
      font-size:16px
  }

  label{
      font-size:13px;
  }

  h2{
      font-size:18px
  }

  .ingredients{
      margin-top:5px;
  }

  .ingredient-name{
      font-size:13px
  }

  .ingredient-amount{
      font-size:13px
  }

  .ingredient-unit{
      width: 35px;
  }

  .servings-control input{
      width: 40px;
      height: 12px;
      font-size: 12px
  }

  .servings-control button{
      height: 20px;
      font-size: 10px;
      padding: 2px;
  }

  .recipe-author{
      font-size: 13px
  }

  .author img{
      width: 25px;
      height: 25px;
  }
}
</style>