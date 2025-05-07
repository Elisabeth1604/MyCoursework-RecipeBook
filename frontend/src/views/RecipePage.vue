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
          <img :src="recipe.user.avatar_url ? `${mediaUrl}${recipe.user.avatar_url}` : require('@/assets/icons/profile.png')" alt="Фото автора рецепта">
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
        <!-- Энергетическая ценность -->
        <div class="nutrition">
          <h3>Энергетическая ценность на 100 грамм</h3>

          <div class="nutrition-grid">
            <div class="nutrition-cell">
              <div class="nutrition-title">КАЛОРИЙНОСТЬ</div>
              <div class="nutrition-value">{{ Math.round(recipe.calories_per_100) }}</div>
              <div class="nutrition-unit">ККАЛ</div>
            </div>
            <div class="nutrition-cell">
              <div class="nutrition-title">БЕЛКИ</div>
              <div class="nutrition-value">{{ Math.round(recipe.proteins_per_100) }}</div>
              <div class="nutrition-unit">ГРАММ</div>
            </div>
            <div class="nutrition-cell">
              <div class="nutrition-title">ЖИРЫ</div>
              <div class="nutrition-value">{{ Math.round(recipe.fats_per_100) }}</div>
              <div class="nutrition-unit">ГРАММ</div>
            </div>
            <div class="nutrition-cell">
              <div class="nutrition-title">УГЛЕВОДЫ</div>
              <div class="nutrition-value">{{ Math.round(recipe.carbs_per_100) }}</div>
              <div class="nutrition-unit">ГРАММ</div>
            </div>
          </div>
          <p class="nutrition-note">
            *калорийность рассчитана для сырых продуктов
          </p>

        </div>

      </div>
    </div>
    <!-- Инфо о калорийности -->
    <div class="recipe-info">
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

    <!-- Комментарии (отдельный компонент) -->
    <h2>Комментарии:</h2>
    <div class="comments">
      <app-comment
          v-for="(comment, index) in comments"
          :key="index"
          :username="comment.user.username"
          :user_id="comment.user.id"
          :avatar="comment.user.avatar_url"
          :timestamp="comment.created_at"
          :text="comment.text"
          @delete="deleteComment(comment.id)">
      </app-comment>
    </div>
    <!-- Форма добавления комментария -->
    <div class="add-comment">
      <textarea
          v-model="newComment"
          placeholder="Ваш комментарий..."
          class="comment-input"
          rows="4"
      ></textarea>
      <app-button @click="submitComment">Отправить</app-button>
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
import AppComment from '@/components/AppComment.vue';
import ImageModal from '@/modal/ImageModal.vue';
import AppButton from "@/components/AppButton.vue";
import store from "@/store/store";

export default {
  name: 'RecipePage',
  setup() {
    const store = useStore();
    const route = useRoute();

    // id рецепта из параметра route
    const recipeId = Number(route.params.id);

    // Доступ к рецепту из Vuex на основе id
    const recipe = computed(() => store.getters['recipe/getRecipeById'](recipeId));
    const comments = ref([]);

    const isModalVisible = ref(false); // Открыто ли окно большого фото
    const selectedImage = ref('');

    const newComment = ref('');

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
        document.title=`${recipe.value.recipe_title} | Поделюсь рецептом`;
        comments.value = await store.dispatch('recipe/getRecipeComments', recipeId);
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

    const submitComment = async () => {
      try {
        if (!newComment.value) return;
        await store.dispatch('recipe/addRecipeComment',{
          recipeId,
          newComment: newComment.value
        })

        newComment.value = '';
        comments.value = await store.dispatch('recipe/getRecipeComments', recipeId);

        store.dispatch('setMessage', {
          type: 'success',
          text: 'Комментарий успешно добавлен!',
          position: 'app-message'
        });
      }
      catch (error){
        store.dispatch('setMessage', {
          type: 'error',
          text: `Ошибка при добавлении комментария: ${error.response?.data?.detail || error.message}`,
          position: 'app-message'
        });
      }
    };
    const deleteComment = async (commentId) => {
      try {
        await store.dispatch('recipe/deleteRecipeComment', commentId);

        // Удаляем локально
        comments.value = comments.value.filter(comment => comment.id !== commentId);

        store.dispatch('setMessage', {
          type: 'success',
          text: 'Комментарий удалён!',
          position: 'app-message'
        });
      } catch (error) {
        store.dispatch('setMessage', {
          type: 'error',
          text: `Ошибка удаления: ${error.response?.data?.detail || error.message}`,
          position: 'app-message'
        });
      }
    };

    return {
      recipe,
      currentServings,
      adjustedIngredients,
      changeServings,
      isModalVisible,
      selectedImage,
      openImage,
      mediaUrl,
      comments,
      newComment,
      submitComment,
      deleteComment
    };
  },
  components: {AppButton, AppRecipeStep, ImageModal, AppComment }
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
    padding-right: 35px;
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
    align-items: center;
    padding-right: 30px;
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

  /* Энергетическая ценность */
  .nutrition {
    margin-top: 2rem;
    text-align: center;
  }

  .nutrition h3 {
    font-weight: bold;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .nutrition-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .nutrition-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .nutrition-title {
    font-size: 0.8rem;
    letter-spacing: 1px;
    color: #777;
    margin-bottom: 6px;
  }

  .nutrition-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
  }

  .nutrition-unit {
    font-size: 0.8rem;
    color: #777;
    letter-spacing: 1px;
  }

  .nutrition-note {
    font-size: 0.75rem;
    color: #888;
    margin-top: 0.8rem;
    text-align: center;
    font-style: italic;
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

  p {
    color: #333;
  }

  hr {
    width: 100%;
  }

  .add-comment {
    margin-top: 30px;
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
  }

  .comment-input {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1em;
    resize: vertical;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  /* Адаптивное поведение для класса servings-ingred-header */
  @media (max-width: 996px) {
    .servings-ingred-header{
      display: block;
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
    .nutrition-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .recipe-header {
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      width: 100%;
    }

    .recipe-image,
    .right-section {
      width: 100%;
    }

    .recipe-image {
      max-width: 100%;
      height: auto;
    }

    .servings-ingred-header{
      display: flex;
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
  .nutrition-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>