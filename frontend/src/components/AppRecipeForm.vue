<template>
  <!--Форма для добавления или редактирования рецепта, используется в соответствующих компонентах
  Отправка с предотвращением стандартной перезагрузки страницы .prevent-->
  <form @submit.prevent="submitRecipe">
    <!-- Название рецепта -->
    <app-input
        label="Название рецепта"
        name="title"
        iD="title"
        type="text"
        input-class="add-recipe-form"
        placeholder="Введите название рецепта"
        v-model.trim="recipe_title"
        :error="rtDisplayError || backendErrors.recipe_title"
        @blur="rtBlur"
        required
    />
    <!-- Краткое описание -->
    <app-input
        label="Краткое описание"
        name="description"
        iD="description"
        type="text"
        input-class="add-recipe-form"
        placeholder="Введите описание рецепта"
        v-model="description"
        :error="descDisplayError"
        @blur="descBlur"
        required
    />
    <!-- Главное фото -->
    <app-input
        label="Загрузите изображение блюда"
        name="image"
        iD="image"
        type="file"
        input-class="add-recipe-form"
        @change="handleImageUpload"
        ref="mainPhotoInput"
    />
    <!-- Предпросмотр главного фото -->
    <img
        v-if="previewMainPhoto"
        :src="previewMainPhoto"
        class="avatar-preview"
        alt="Предпросмотр главного фото"
    />
    <!-- Ингредиенты -->
    <label class="label-steps">Добавьте ингредиенты</label>
    <div class="inform-case">
      <img src="../assets/icons/information.png" alt="Инфо" />
      <p class="inform">
        Для более точного расчета калорийности рекомендуем использовать граммы!
      </p>
    </div>
    <div class="form-group">
      <div
          v-for="(ingredient, index) in localRecipe.ingredients"
          :key="ingredient.index"
          class="ingredient"
      >
        <div class="ingredient-dropdown">
          <app-input
              :label="'Ингредиент ' + (index + 1) + ':'"
              name="ingredient"
              type="text"
              input-class="ingredient-input"
              v-model.trim="ingredient.ingredient.ingredient_name"
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
        <!-- Количество -->
        <app-input
            label="Количество"
            v-model.number="ingredient.quantity"
            name="quantity"
            type="number"
            input-class="quantity-input"
        ></app-input>
        <!-- Селект единиц -->
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
    <!-- Порции + Время приготовления -->
    <div class="servings-time-container">
      <app-input
          label="Порции"
          name="servings"
          iD="servings"
          type="number"
          input-class="add-recipe-form"
          v-model="servings"
          :error="servDisplayError"
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
              v-model.number="localRecipe.prep_time_hour"
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
              v-model.number="localRecipe.prep_time_min"
          ></app-input>
          <span class="time-label">минут</span>
        </div>
      </div>
    </div>
    <!-- Выпадающий список выбора категории блюда -->
    <div class="form-group">
      <label class="categories-select-label">Категория блюда</label>
      <select v-model="category" class="category-select" @error="catDisplayError" @blur="catBlur" :class="{ invalid: catDisplayError }">
        <option value="" disabled selected hidden>Выберите категорию</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.category_name }}
        </option>
      </select>
      <small class="validation-message" v-if="catDisplayError">{{ catDisplayError }}</small>
    </div>
    <!-- Шаги -->
    <label class="label-steps">Шаги приготовления</label>
    <div class="inform-case">
      <img src="..\assets\icons\information.png" alt="Информационная табличка">
      <p class="inform">Рекомендуем разбивать рецепт минимум на 5 шагов. Используй горизонтальные фото!</p>
    </div>
    <div class="form-group">
      <div v-for="(step, index) in localRecipe.steps" :key="index" class="step">
        <label>Шаг {{ index + 1 }}:</label>
        <textarea class="step-description"
                  v-model="step.description"
                  placeholder="Опишите этот шаг" required></textarea>
        <label>Загрузите изображение для этого шага:</label>
        <input type="file" @change="handleStepImageUpload($event, index)">
        <app-button
            button-class="remove-step"
            @action="removeStep(index)"
        >Удалить шаг</app-button>
        <div v-if="stepPreviews[index]" class="step-preview-container">
          <img
              :src="stepPreviews[index]"
              class="step-image-preview"
              alt="Предпросмотр шага"
          />
        </div>
      </div>
      <app-button
          button-class="add-step-btn"
          type="button"
          @action="addStep"
      >Добавить шаг</app-button>
    </div>
    <!-- Публичность -->
    <label class="is_public">
      <input type="checkbox"
             class="checkbox-input"
             v-model="localRecipe.is_public" />
      Сделать рецепт общедоступным
    </label>
    <!-- Кнопка отправки -->
    <app-button type="submit"
                button-class="submit-btn">{{ submitText }}</app-button>
  </form>
</template>

<script>
import {ref, watch, computed, reactive} from 'vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import { useAddRecipeForm } from '@/use/add-recipe-form'; // vee-validate логика
import axios from 'axios';
import store from "@/store/store";

export default {
  name: 'RecipeForm',
  components: { AppButton, AppInput },
  props: {
    modelValue: {
      type: Object,
      required: true, // Объект рецепта (нового или редактируемого)
    },
    categories: {
      type: Array,
      default: () => [],
    },
    units: {
      type: Array,
      default: () => [],
    },
    submitText: {
      type: String,
      default: 'Отправить рецепт',
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'submit'],

  setup(props, { emit }) {
    // Vee-validate часть
    const {
      recipe_title,
      rtError,
      rtBlur,
      rtDisplayError,

      description,
      descError,
      descBlur,
      descDisplayError,

      servings,
      servError,
      servBlur,
      servDisplayError,

      category,
      catError,
      catBlur,
      catDisplayError,

      handleSubmit,
      isSubmitting,
      backendErrors,
      resetForm,
    } = useAddRecipeForm();

    // Локальное хранение рецепта (чтобы дополнять steps и ingredients)
    const localRecipe = ref({
      ingredients: [],
      steps: [],
      main_photo: '',
      is_public: false,
      prep_time_hour: 0,
      prep_time_min: 0,
    });

    // Предпросмотры
    const previewMainPhoto = ref(null);
    const stepPreviews = ref([]);

    const mediaUrl = computed(() => store.getters.mediaUrl);

    // При первом монтировании (или при редактировании)
    // следит за изменением пропса modelValue,
    // загружает его данные в валидируемые поля формы и
    // локальное состояние localRecipe
    watch(
        () => props.modelValue,
        (newVal) => {
          if (!newVal) return;
          // Заполняем валидируемые поля текущими значениями newVal
          recipe_title.value = newVal.recipe_title || '';
          description.value = newVal.description || '';
          servings.value = newVal.servings || '';
          category.value = typeof newVal.category === 'object' ? newVal.category.id : newVal.category;

          // Теперь все остальные поля
          localRecipe.value = {
            ...localRecipe.value,
            ingredients: (newVal.ingredients || []).map(item => ({
              ingredient: item.ingredient,
              quantity: item.quantity,
              unit: findUnitId(item.unit),
              suggestions: [],
            })),
            steps: newVal.steps || [],
            main_photo: newVal.main_photo,
            is_public: newVal.is_public,
            prep_time_hour: newVal.prep_time_hour || 0,
            prep_time_min: newVal.prep_time_min || 0,
            category: newVal.category,
          };

          // Предпросмотры отображаем
          stepPreviews.value = localRecipe.value.steps.map(s => {
            if (!s.photo) return null;
            const isAbsolute = /^https?:\/\//.test(s.photo);
            return isAbsolute ? s.photo : new URL(s.photo, mediaUrl.value).href;
          });

          if (localRecipe.value.main_photo) {
            const isAbsolute = /^https?:\/\//.test(localRecipe.value.main_photo);
            previewMainPhoto.value = isAbsolute
                ? localRecipe.value.main_photo
                : new URL(localRecipe.value.main_photo, mediaUrl.value).href;
          }
        },
        // immediate: true гарантирует, что этот код отработает сразу при первом монтировании компонента,
        // даже если modelValue не менялся
        { immediate: true }
    );

    function findUnitId(unitName) {
      const match = props.units.find((u) => u.unit_name === unitName);
      return match ? match.id : null;
    }

    // ЛОГИКА РАБОТЫ С ФОТО
    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      // Локальный предпросмотр
      if (previewMainPhoto.value) {
        URL.revokeObjectURL(previewMainPhoto.value);
      }
      const previewURL = URL.createObjectURL(file);
      previewMainPhoto.value = previewURL;

      // Загрузка на сервер
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await axios.post('http://localhost/api/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        localRecipe.value.main_photo = response.data.url;

      } catch (error) {
        console.error('Ошибка при загрузке главного фото:', error);
      }
    };

    const handleStepImageUpload = async (event, index) => {
      const file = event.target.files[0];
      if (!file) return;
      // Локальный предпросмотр
      const previewURL = URL.createObjectURL(file);
      if (stepPreviews.value[index]) {
        URL.revokeObjectURL(stepPreviews.value[index]);
      }
      stepPreviews.value[index] = previewURL;

      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await axios.post('http://localhost/api/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        localRecipe.value.steps[index].photo = response.data.url;
      } catch (error) {
        console.error('Ошибка при загрузке фото шага:', error);
      }
    };

    // ИНГРЕДИЕНТЫ
    const addIngredient = () => {
      localRecipe.value.ingredients.push({
        ingredient: { id: null, ingredient_name: '' },
        quantity: '',
        unit: '',
        suggestions: []
      });
    };

    const removeIngredient = (index) => {
      localRecipe.value.ingredients.splice(index, 1);
    };

    // Поиск ингредиентов
    const onIngredientInput = async (index) => {
      // Получение введённого пользователем значения ингредиента из поля ingredient_name
      const query = localRecipe.value.ingredients[index].ingredient.ingredient_name;
      // Если поле пустое или менее 2 символов — не отправляем запрос и просто очищаем список подсказок
      if (!query || query.length < 2) {
        localRecipe.value.ingredients[index].suggestions = [];
        return;
      }
      try {
        // Отправляем GET-запрос, передаём query как параметр
        const response = await axios.get('http://localhost/api/ingredients/', {
          params: { query },
        });
        localRecipe.value.ingredients[index].suggestions = response.data;
      } catch (error) {
        console.error('Ошибка поиска ингредиентов:', error);
      }
    };

    // Выбрали ингредиент из выпадающего списка
    const selectIngredient = (index, selectedItem) => {
      // Присвоить id выбранного ингредиента
      localRecipe.value.ingredients[index].ingredient.id = selectedItem.id;
      // Присвоить название ингредиента, чтобы отобразилось в поле ввода (взамен того, что ввёл пользователь)
      localRecipe.value.ingredients[index].ingredient.ingredient_name =
          selectedItem.ingredient_name;
      // Очистить список подсказок, чтобы выпадающее меню исчезло после выбора
      localRecipe.value.ingredients[index].suggestions = [];
    };

    // ШАГИ (добавить и удалить)
    const addStep = async () => {
      localRecipe.value.steps.push({
        description: '',
        photo: '',
      });
    };

    const removeStep = (index) => {
      localRecipe.value.steps.splice(index, 1);
    };

    // ОТПРАВКА ФОРМЫ
    function normalizeRecipe(recipe) {
      // Здесь объединение валидируемых данных и localRecipe в один объект для отправки на сервер
      return {
        recipe_title: recipe_title.value,
        description: description.value,
        servings: servings.value,
        category: typeof category.value === 'object' ? category.value.id : category.value,
        main_photo: recipe.main_photo,
        is_public: recipe.is_public,
        prep_time_hour: recipe.prep_time_hour ? +recipe.prep_time_hour : 0,
        prep_time_min: recipe.prep_time_min ? +recipe.prep_time_min : 0,
        ingredients: recipe.ingredients.map(item => ({
          ingredient: typeof item.ingredient === 'object' ? item.ingredient.id : item.ingredient,
          quantity: item.quantity,
          unit: item.unit,
        })),
        steps: recipe.steps.map(step => ({
          description: step.description,
          photo: step.photo || '',
        })),
      };
    }

    function clearForm() {
      resetForm(); // vee-validate очистка

      recipe_title.value = '';
      description.value = '';
      servings.value = '';
      category.value = '';

      localRecipe.value = {
        ingredients: [],
        steps: [],
        main_photo: '',
        is_public: false,
        prep_time_hour: 0,
        prep_time_min: 0,
      };

      stepPreviews.value = [];
      previewMainPhoto.value = null;
    }


    const submitRecipe = handleSubmit(async () => {
      // Эмитим событие submit родителю
      const cleanRecipe = normalizeRecipe(localRecipe.value);

      emit('submit', cleanRecipe);

      if (!props.isEdit) {
        clearForm(); // только при добавлении
      }
    });

    return {
      // Метаданные vee-validate
      recipe_title,
      rtError,
      rtDisplayError,
      rtBlur,

      description,
      descError,
      descBlur,
      descDisplayError,

      servings,
      servError,
      servBlur,
      servDisplayError,

      category,
      catError,
      catBlur,
      catDisplayError,

      backendErrors,
      isSubmitting,

      // Локальный рецепт
      localRecipe,

      // Предпросмотры
      previewMainPhoto,
      stepPreviews,

      // Методы
      handleImageUpload,
      handleStepImageUpload,
      addIngredient,
      removeIngredient,
      onIngredientInput,
      selectIngredient,
      addStep,
      removeStep,
      submitRecipe,
    };
  },
};
</script>

<style scoped>
/* Удалить ингредиент */
.remove-ingredient{
  margin-top: 15px;
}

/* Поле для выбора категории */
.category-select{
  width: 40%;
  height: 35px;
  margin-right: 10px;
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
  grid-template-columns: 40% 56%;
  gap: 4%;
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

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
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

.step-preview-container {
  margin-top: 10px;
  text-align: start;
}

.step-image-preview, .avatar-preview {
  width: 100%;
  max-width: 250px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
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
