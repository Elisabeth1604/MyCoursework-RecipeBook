<template>
<!-- Форма добавления рецепта -->
  <h2>Добавить новый рецепт</h2>
    <form @submit.prevent="submitRecipe"> <!-- Отправка формы с предотвращением стандартной перезагрузки страницы -->
      <!-- Поле (компонент) для ввода НАЗВАНИЯ рецепта с привязкой к данным компонента через v-model-->
      <app-input
          label="Название рецепта"
          name="title"
          iD="title"
          type="text"
          input-class="add-recipe-form"
          placeholder="Введите название рецепта"
          v-model.trim="recipe_title"
          :error="rtError || backendErrors.recipe_title"
          @blur="rtBlur"
          required
      ></app-input> <!-- trim убирает пробелы в результирующей строке-->

      <!-- Поле (компонент) для ввода КРАТКОГО ОПИСАНИЯ рецепта с привязкой к данным компонента через v-model-->
      <app-input
          label="Краткое описание"
          name="description"
          iD="description"
          type="text"
          input-class="add-recipe-form"
          placeholder="Введите описание рецепта"
          v-model="description"
          :error="descError"
          @blur="descBlur"
          required
      ></app-input>

      <!-- Поле (компонент) для ЗАГРУЗКИ ИЗОБРАЖЕНИЯ рецепта-->
      <app-input
          label="Загрузите изображение блюда"
          name="image"
          iD="image"
          type="file"
          input-class="add-recipe-form"
          @change="handleImageUpload"
          @error="mpError"
          @blur="mpBlur"
      ></app-input>

      <label class="label-steps">Добавьте ингредиенты</label>
      <!-- Поле (компонент) для ДОБАВЛЕНИЯ ИНГРЕДИЕНТОВ рецепта -->
      <div class="form-group">
        <div v-for="(ingredient, index) in recipe.ingredients" :key="ingredient.index" class="ingredient">
          <!-- Поле для названия ингредиента (!потом будет выбор из базы) -->
          <div class="ingredient-dropdown">
            <app-input
                :label="'Ингредиент ' + (index + 1) + ':'"
                name="ingredient"
                type="text"
                input-class="ingredient-input"
                v-model.trim="ingredient.ingredient_name"
                placeholder="Введите ингредиент"
                required
                @input="onIngredientInput(index)"
            ></app-input>
            <!-- Выпадающий список подсказок -->
            <ul v-if="ingredient.suggestions && ingredient.suggestions.length" class="suggestions">
              <li
                  v-for="item in ingredient.suggestions"
                  :key="item.id"
                  @mousedown.prevent="selectIngredient(index, item)"
              >
                {{ item.ingredient_name }}
              </li>
            </ul>
          </div>
        <!-- Поле для количества ингредиента -->
          <app-input
            label="Количество"
            v-model="ingredient.quantity"
            name="quantity"
            type="number"
            input-class="quantity-input"
          ></app-input>
          <!-- Выпадающий список выбора единиц измерения -->
          <div class="form-group-ingredients">
          <label class="unit-select-label">Единица измерения</label>
          <select v-model="ingredient.unit" class="unit-select" >
            <option v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.unit_name }}
            </option>
          </select>
          </div>
          <app-button
          button-class="remove-ingredient"
          @click.stop="removeIngredient(index)"
          type="button"
          >Удалить <span class="ingredient-text">ингредиент</span></app-button>
        </div>
        <app-button
          button-class="add-step-btn"
          type="button"
          @action="addIngredient"
          >Добавить ингредиент</app-button>
      </div>

      <div class="servings-time-container">
        <!-- Поле (компонент) для КОЛИЧЕСТВА ПОРЦИЙ рецепта с привязкой к данным компонента через v-model-->
        <app-input
            label="Порции"
            name="servings"
            iD="servings"
            type="number"
            input-class="add-recipe-form"
            v-model="servings"
            :error="servError"
            @blur="servBlur"
            placeholder="Количество порций"
            required
        ></app-input>

        <div class="form-group-prep-time">
          <!-- Основное название для группы полей времени приготовления -->
          <label>Время приготовления</label>

          <div class="time-inputs">
            <!-- Поле для ввода количества часов -->
            <app-input
              label=""
              name="prepTimeHours"
              iD="prepTimeHours"
              type="number"
              input-class="prep-time-input"
              placeholder="Часы"
              v-model.number="recipe.prep_time_hour"
            ></app-input>
            <span class="time-label">час(ов)</span>

            <!-- Поле для ввода количества минут -->
            <app-input
              label=""
              name="prepTimeMinutes"
              iD="prepTimeMinutes"
              type="number"
              input-class="prep-time-input"
              placeholder="Минуты"
              v-model.number="recipe.prep_time_min"
            ></app-input>
            <span class="time-label">минут</span>
          </div>
        </div>
      </div>

      <!-- Выпадающий список выбора категории блюда -->
      <div class="form-group">
      <label class="categories-select-label">Категория блюда</label>
      <select v-model="category" class="category-select" @error="catError" @blur="catBlur">
        <option value="" disabled selected hidden>Выберите категорию</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.category_name }}
        </option>
      </select>
      </div>

      <!-- Поле для ШАГОВ ПРИГОТОВЛЕНИЯ-->
      <label class="label-steps">Шаги приготовления</label>
      <div class="inform-case">
            <img src="..\assets\icons\information.png" alt="Информационная табличка">
            <p class="inform">Рекомендуем разбивать рецепт минимум на 5 шагов. Используй горизонтальные фото!</p>
          </div>
      <div class="form-group">
          <div v-for="(step, index) in recipe.steps" :key="index" class="step">
              <label>Шаг {{ index + 1 }}:</label>
              <textarea class="step-description" v-model="step.description" placeholder="Опишите этот шаг" required></textarea>
              <label>Загрузите изображение для этого шага:</label>
              <input type="file" @change="handleStepImageUpload($event, index)">

              <app-button
              button-class="remove-step"
              @action="removeStep(index)"
              >Удалить шаг</app-button>
          </div>
          <app-button
          button-class="add-step-btn"
          type="button"
          @action="addStep"
          >Добавить шаг</app-button>
      </div>

      <label class="is_public">
        <input type="checkbox" class="checkbox-input" v-model="recipe.is_public" />
        Сделать рецепт общедоступным
      </label>

      <app-button type="submit"
      button-class="submit-btn"
      >Отправить рецепт</app-button>

    </form>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useAddRecipeForm } from '@/use/add-recipe-form';
import { useStore } from 'vuex';
import axios from "axios";
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import store from "@/store/store";


export default defineComponent({
  name: 'AppAddRecipe',
  setup() {
    document.title='Добавление рецепта | Поделюсь рецептом';
    const store = useStore();

    const units = ref([]);
    const categories = ref([]);

    const addRecipeForm = useAddRecipeForm();
    const { backendErrors,
            resetForm } = addRecipeForm;

    onMounted(() => {
      fetchUnits();
      fetchCategories();
    });

    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost/api/units/');
        units.value = response.data;
      } catch (error) {
        console.error('Ошибка загрузки единиц измерения:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/api/categories/");
        categories.value = response.data;
      } catch (error) {
        console.error("Ошибка получения категорий:", error);
      }
    };

    const recipe = ref({ // Реактивный объект рецепта (здесь только поля, которых нет в блоке с vee-validate)
      id: null, // id рецепта
      main_photo: null, // Изображение блюда
      prep_time_min: null,
      prep_time_hour: null,
      ingredients: [
        { ingredient: null, ingredient_name: '', quantity: '', unit: '', suggestions: [] }
      ],
      steps: [{ description: '', photo: '' }], // Шаги приготовления
      is_public: true
    });

    const submitRecipe = addRecipeForm.handleSubmit(async (values) => {
      try {
        // Очистка предыдущих ошибок
        backendErrors.value = {};

        // Используем Vuex для отправки рецепта
        await store.dispatch('recipe/addRecipe', {
          recipe_title: values.recipe_title,
          description: values.description,
          prep_time_min: values.prep_time_min,
          prep_time_hour: values.prep_time_hour,
          servings: values.servings,
          main_photo: recipe.value.main_photo,
          ingredients: recipe.value.ingredients.map(ing => ({
            ingredient: ing.ingredient, // id
            quantity: ing.quantity,
            unit: ing.unit,
          })),
          steps: recipe.value.steps,
          category: values.category,
          is_public: recipe.value.is_public
        });

        // Очистка полей после отправки

        resetForm(); // Очищаются те, которые в vee-validate

        // Очищаются те, которые в ref recipe
        recipe.value = {
          id: null,
          main_photo: null,
          prep_time_min: null,
          prep_time_hour: null,
          ingredients: [
            { ingredient: null, ingredient_name: '', quantity: '', unit: '', suggestions: [] }
          ],
          steps: [{ description: '', photo: '' }],
          is_public: true,
        };

        backendErrors.value = {};

        store.dispatch(
            "setMessage",
            { type: "success", text: `Рецепт добавлен!`, position: "app-message" },
            { root: true }
        );

      } catch (error) {
        if (error.response && error.response.data) {

          console.error('Ошибка при добавлении рецепта:', error.response.data);

          // Обрабатываем массив ошибок, сохраняем в `backendErrors`
          for (const field in error.response.data) {
            backendErrors.value[field] = error.response.data[field].join(" ");
          }

          store.dispatch(
              "setMessage",
              { type: "error", text: `${error.response.data.recipe_title}`, position: "app-message" },
              { root: true }
          );
        }
      }
    })

    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Создаем объект FormData и добавляем в него файл под ключом "image"
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Отправляем POST-запрос на endpoint загрузки файлов на вашем бэкенде
        const response = await axios.post('http://localhost/api/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Предполагаем, что сервер возвращает JSON с полем url, содержащим путь к загруженному файлу
        const downloadURL = response.data.url;
        console.log('Image URL:', downloadURL);
        // Обновляем как локальное свойство рецепта, так и поле валидации
        recipe.value.main_photo = downloadURL;

      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
      }
    };

    const handleStepImageUpload = async (event, index) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost/api/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const downloadURL = response.data.url;
        console.log('Step Image URL:', downloadURL);
        // Сохраняем URL изображения для шага
        recipe.value.steps[index].photo = downloadURL;
      } catch (error) {
        console.error('Ошибка при загрузке изображения для шага:', error);
      }
    };

    // Метод для обработки ввода ингредиента
    const onIngredientInput = async (index) => {
      const query = recipe.value.ingredients[index].ingredient_name;
      if (!query || query.length < 2) {
        recipe.value.ingredients[index].suggestions = [];
        return;
      }
      try {
        const response = await axios.get('http://localhost/api/ingredients/', {
          params: { query }
        });
        recipe.value.ingredients[index].suggestions = response.data;
      } catch (error) {
        console.error('Ошибка поиска ингредиентов:', error);
      }
    };

    // Выбор ингредиента из подсказок
    const selectIngredient = (index, selectedItem) => {
      recipe.value.ingredients[index].ingredient = selectedItem.id;
      // Сохраняем имя ингредиента для отображения в поле ввода
      recipe.value.ingredients[index].ingredient_name = selectedItem.ingredient_name;
      recipe.value.ingredients[index].suggestions = [];
    };

    const addIngredient = () => {
      recipe.value.ingredients.push({ ingredient: null, ingredient_name:'', quantity: '', unit: '' , suggestions: [] });
      console.log('Ингредиент добавлен')
    };

    const removeIngredient = (index) => {
      recipe.value.ingredients.splice(index, 1);
    };

    const addStep = () => {
      recipe.value.steps.push({ description: '', photo: null });
    };

    const removeStep = (index) => {
      recipe.value.steps.splice(index, 1);
    };


    return {
      recipe,
      submitRecipe,
      handleImageUpload,
      handleStepImageUpload,
      addStep,
      removeStep,
      addIngredient,
      removeIngredient,
      units,
      categories,
      onIngredientInput,
      selectIngredient,

      ...addRecipeForm
    };
  },

  components: { AppButton, AppInput }
});
</script>

<style>
.form-group {
  display: block;
  margin-bottom: 20px;
}

/* Другой стиль для формы ввода ингредиента и количества */
.form-group-ingredients {
  display: flex;
  flex-direction: column;
}

/* Другие стили для label Ингредиент №, Количество и Единица измерения */
.form-group-ingredients label, .unit-select-label{
  font-size: 14px;
  font-weight: 1px;
  font-family: monospace;
}

/* Класс для инпутов (кроме ингредиентов) */
.add-recipe-form{
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.remove-ingredient{
  margin-top: 15px;
}

/* Классы для поля ввода названия ингредиента, количества, единиц измерения и категории */
.ingredient-input, .quantity-input, .unit-select {
  height: 30px;  
  margin-right: 10px;
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
  border-radius: 5px;
  border: 1px solid #ccc;
}

.category-select{
  width: 40%;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 7px;
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
  border-radius: 5px;
  border: 1px solid #ccc;
}


/* Класс для контейнера полей ингредиента (название, количество, единица измерения и кнопка удалить) */
.ingredient{
  display: grid;
  grid-template-columns: 30% 15% 26% auto; /* Пропорции для полей */
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f1f1f1;
  border-radius: 5px;
}

/* Стили остаются прежними, можно добавить стили для dropdown */
.ingredient-dropdown {
  position: relative;
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dropdown-list li {
  padding: 8px;
  cursor: pointer;
}

.dropdown-list li:hover {
  background: #f0f0f0;
}

/* Контейнер для полей Порции и Время приготовления */
.servings-time-container{
  display: grid;
  grid-template-columns: 40% 56%; /* Пропорции для полей */
  gap: 4%;
}

.form-group-prep-time {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.time-inputs {
  display: flex;
  align-items: center;
  height: 50px;
}

.prep-time-input {
  width: 70px; /* Ширина полей для часов и минут */
  height: 25px;
  margin-right: 5px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.time-label {
  margin-right: 20px; /* Отступы между полями и текстовыми метками */
  font-size: 14px;
  color: #333;
}

.add-ingredient-btn {
  margin-top: 15px;
}

/* Стили для поля добавления шагов*/
.step {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
}

.step-description{
  box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

h2 {
  text-align:start;
  color: #333;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.label-steps{
  font-size: 19px;
}

.add-step-btn{
  background-color:#4e8410;
}

.add-step-btn:hover{
  background-color:#3e6e08;
}

/* Стили для информационной таблички */
.inform-case{
  display: inline-flex;
  align-items: center;
}

.inform-case img{
  height: 35px;
  margin-right: 5px;
}

.inform{
  color: #6c6b6b;
  font-style:italic;
  font-size:15px
}

.is_public{
  margin-bottom: 15px;
}

/* Стилизация чекбокса */
.checkbox-input {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 1px solid #FF9973;
  border-radius: 0.25rem;
  background-color: #fff;
  cursor: pointer;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  margin: 0;
}

/* Оформление состояния checked */
.checkbox-input:checked{
  background-color: white;
  color: white;
  background-image: url("@/assets/icons/checkbox.png");
}

/* Адаптивность */
@media (max-width: 595px) {
  h2{
    font-size:22px
  }
  .form-group-ingredients label, .unit-select-label{
    font-size: 12px;
    font-weight: 1px;
    font-family: monospace;
  }
  /* Чтобы на экранах шириной менее 584px исчезло слово "ингредиент" в кнопке удалить ингредиент (скрываем span) */
  .remove-ingredient .ingredient-text {
    display: none;
  }
  .inform{
    color: #6c6b6b;
    font-style:italic;
    font-size:13px
  }
  label {
    font-size:15px
  }
  .label-steps {
    font-size:18px
  }
  select  {
    font-size:12px
  }
}
@media (max-width: 522px) {
  h2{
    font-size:21px
  } 
  label {
    font-size:14px
  }
  .label-steps {
    font-size:17px
  }
  select  {
    font-size:11px
  }
  .ingredient{
  display: grid;
  grid-template-columns: 33% 18% 28% auto; /* Пропорции для полей */
}
}
@media (max-width: 461px) {  
  .label-steps {
    font-size:17px
  }
  .remove-step{
    margin-top: 10px;
  }
  .ingredient{
    display: block;
  }
}
</style>
