<template>
  <div :class="['recipe-card', { expanded: isExpanded }]"
       @click="handleCardClick"
       title="При нажатии откроется страница рецепта">
    <app-button
        v-if="mode === 'my'"
        title = "Удалить"
        buttonClass="delete-btn"
        @action="confirmDelete"
    >
      ✖
    </app-button>
    <img class="recipe-card-img"
         :src="recipeImage ? `${mediaUrl}${recipeImage}` : require('@/assets/images/fallback.jpg')"
         alt="Фото рецепта" />
    <div class="recipe-header">
      <div class="kkal" title="Количество калорий на 100 грамм">
        <img class="kkal-img" :src="require('@/assets/icons/kcal.png')" />
        <span class="calories">{{ Math.round(calories) }} ккал</span>
      </div>
      <div class="prep" title="Время приготовления">
        <img class="prep-img" :src="require('@/assets/icons/clock (2).png')" />
        <span class="prep-time">{{prepTimeHour? prepTimeHour : 0}} ч {{  prepTimeMin? prepTimeMin : 0 }} мин</span>
      </div>
    </div>
    <h3>{{ recipeTitle }}</h3>
    <p>{{ recipeDescription }}</p>

    <div class="card-footer">
      <app-button
          v-if="!isExpanded"
          buttonClass="ingredients-button"
          title="Развернуть карточку"
          @action="toggleCard"
          small>Состав</app-button>
      <app-button
          v-if="mode !== 'my' && !isExpanded"
          buttonClass="favorite-btn"
          @action="addToFavourites(recipeId)"
          :title="isFavourite ? 'Удалить из избранного' : 'Добавить в избранное'">
        <img
            class="favourites-img"
            :src="isFavourite
                  ? require('@/assets/icons/heart.png')
                  : require('@/assets/icons/favourite.png')"
            :alt="isFavourite ? 'Удалить из избранного' : 'Добавить в избранное'"
        />
      </app-button>
      <app-button
          v-if="mode === 'my'&& !isExpanded"
          @action="editRecipe()"
          title="Редактировать рецепт"
      >Редактировать</app-button>
    </div>

    <div v-if="isExpanded" class="card-ingredients">
      <div class="ingredients">
        <h4>Ингредиенты:</h4>
        <ul>
          <li v-for="item in ingredients" :key="item.ingredient.ingredient_name">{{ item.ingredient.ingredient_name }}</li>
        </ul>
      </div>
      <app-button @action="viewRecipe(recipeId)"
                  buttonClass="recipe-card-button">Показать рецепт</app-button>
      <app-button @action="toggleCard"
                  buttonClass="recipe-card-button"
                  small>Свернуть</app-button>
    </div>
  </div>
</template>
  
<script>
import AppButton from './AppButton.vue';
import {mapGetters} from "vuex";

export default {
  props: {
    recipeId: Number,
    recipeTitle: String,
    recipeDescription: String,
    recipeImage: String,
    prepTimeMin: Number,
    prepTimeHour : Number,
    servings: Number,
    calories: Number,
    ingredients: Array, // Это массив объектов {ingredient, quantity}
    isPublic: Boolean,
    isExpanded: Boolean, // Принимаем состояние карточки от родителя
    mode: String // Этот пропс для режима использования (где отображается карточка, в избранном, на главной и тд)
  },
  data() {
    return {
      expandedStyle: {}, // Стили для развернутой карточки
    }
  },
  computed: {
    ...mapGetters('recipe', ['getUserFavourites']),
    mediaUrl() {
      return this.$store.getters.mediaUrl;
    },
    isAuth() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    isFavourite() {
      if (this.isAuth ) {
        return this.getUserFavourites.some(recipe => recipe.id === this.recipeId);
      }
      return false;
    }
  },
  methods: {
    viewRecipe(recipeId) {
      this.$router.push({ name: 'RecipePage', params: { id: recipeId } });
    },
    toggleCard() {
      this.$emit('toggle-card')
    },
    handleCardClick() {
      // Вызов viewRecipe только при клике вне кнопок
      this.viewRecipe(this.recipeId);
    },
    addToFavourites(recipeId) {
      if (this.isAuth) {
        if (this.isFavourite) {
          // Если уже в избранном — удаляем
          this.$store.dispatch('recipe/removeFromFavourites', recipeId);
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Рецепт удалён из избранного!",
            position: "app-message"
          });
        } else {
          // Иначе добавляем
          this.$store.dispatch('recipe/addToFavourites', recipeId);
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Рецепт добавлен в избранное!",
            position: "app-message"
          });
        }
      }
      else {
        this.$store.dispatch("setMessage", {
          type: "warning",
          text: "Пожалуйста, войдите или зарегистрируйтесь и попробуйте снова!",
          position: "app-message"
        });
      }
    },
    confirmDelete() {
      const message = 'Удалить этот рецепт навсегда?';

      if (confirm(message)) {
        if (this.mode === 'my') {
          this.$emit('delete-my-recipe', this.recipeId);
        }
      }
    },
    editRecipe(){
      this.$router.push({ name: 'EditRecipe', params: { id: this.recipeId } });
    }
  },
  components: {
    'app-button': AppButton,
  },
}
</script>

<style scoped>
.recipe-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  min-height: 420px;
  overflow: hidden; /* Скрывает часть содержимого, которая не поместилась в контейнере */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Плавное изменение тени и размера */
}

/* Развернутая карточка рецепта */
.recipe-card.expanded {
  transform: scale(1.05); /* Увеличиваем карточку */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.recipe-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}

/* Главное фото рецепта */
.recipe-card-img {
  width: 100%;
  height: 210px;
  object-fit: cover; /* Часть картинки, которая не поместилась, обрежется без искажений*/
  border-radius: 10px;

}

/* Калорийность и время приготовления */
.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

/* Поле времени приготовления */
.prep, .kkal{
  display: flex;
  align-items: center
}

.prep-img, .kkal-img{
  max-height: 25px;
  padding-right: 5px;
}

/* Кнопки показать рецепт и свернуть */
.card-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; /* Это позволяет элементу смещаться к нижней части контейнера */
}

/* Кнопка добавления в избранное */
.favorite-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px 0 0 0;
}

.favorite-btn:hover {
  background-color:#e5e2e2
}

.favorite-btn img {
  width: 100%;
  height: 30px;
}

.recipe-card .prep-time, .calories {
  font-size: 14px;
  color: #666;
}

/* Здесь для списка ингредиентов */
ul{
  padding-inline-start: 20px;
}

/* Развернутое поле для списка ингредиентов вместе с кнопками */
.card-ingredients{
  text-align: start;
}

/* Поле ингредиентов с названием */
.ingredients {
  text-align: start;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

/* Название "Ингредиенты" */
.ingredients h4{
  padding-left: 10px;
  font-size: 15px;
}

.recipe-card h3 {
  margin: 15px 0 10px 0;
  color: #333;
}

.recipe-card p {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis; /* Многоточие в конце при обрезке */
  display: -webkit-box; /* Поддержка обрезки по количеству строк */
  -webkit-box-orient: vertical; /* Вертикальная ориентация для box */
  -webkit-line-clamp: 3; /* Ограничиваем количество строк */
}

.delete-btn {
  position: absolute;
  padding: 2px 7px;
  top: 6px;
  right: 6px;
  background: #FF9973;
  border: none;
  font-size: 15px;
  cursor: pointer;
  color: white;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0); /* Убираю тень, наследованную от обычного button */
  border-radius: 30%;
}

.delete-btn:hover{
  background-color: #ff5722;
}
</style>