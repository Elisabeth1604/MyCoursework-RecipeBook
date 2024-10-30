<template>
    <!-- Форма добавления рецепта -->
    <div class="container">
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
                    required
                ></app-input>                           

                <label class="label-steps">Добавьте ингредиенты</label>
                <!-- Поле (компонент) для ДОБАВЛЕНИЯ ИНГРЕДИЕНТОВ рецепта -->
                <div class="form-group">
                  <div v-for="(ingredient, index) in recipe.ingredients" :key="ingredient.name" class="ingredient">
                    <!-- Поле для названия ингредиента (!потом будет выбор из базы) -->
                    <app-input
                      :label="'Ингредиент ' + (index + 1) + ':'"
                      name="ingredient"
                      type="string"
                      input-class="ingredient-input"                      
                      required
                  ></app-input>
                  <!-- Поле для количества ингредиента -->
                    <app-input
                      label="Количество"
                      v-model="ingredient.quantity"
                      name="quantity"
                      type="number"
                      input-class="quantity-input"
                      required
                  ></app-input>
                    <!-- Выпадающий список выбора единиц измерения -->
                    <div class="form-group-ingredients">
                    <label class="unit-select-label">Единица измерения</label>
                    <select v-model="ingredient.unit" class="unit-select" >
                      <option disabled value="">Выберите единицу</option>
                        <option value="граммы">гр</option>
                        <option value="килограммы">кг</option>
                        <option value="литры">л</option>
                        <option value="миллилитры">мл</option>
                        <option value="стаканы">стак.</option>
                        <option value="столовые ложки">стол.л.</option>
                        <option value="чайные ложки">чайн.л.</option>
                        <option value="шт">шт</option>
                        <option value="зубчики">зубч.</option>
                        <option value="щепотки">щепотка</option>
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
                        required
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
                        required
                      ></app-input>
                      <span class="time-label">минут</span>
                    </div>
                  </div>
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
                        <input type="file" @change="handleStepImageUpload(index)" required>

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

                <app-button type="submit"
                button-class="submit-btn"
                >Отправить рецепт</app-button>
            </form>
        </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import { useStore } from 'vuex';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default defineComponent({
  name: 'AppAddRecipe',
  setup() {
    const store = useStore();

    const recipe = ref({ // Для создания реактивного объекта recipe используется ref
      id: '', // id рецепта
      title: '', // Название рецепта
      description: '', // Краткое описание
      image: null, // Изображение блюда
      prepTime: '0', // Время приготовления
      ingredients: [
        { name: '', quantity: '', unit: '' }
      ],
      servings: '0',
      steps: [{ description: '', image: '' }] // Шаги приготовления
    });

    const submitRecipe = async () => {
      try {
        console.group('Form data');
        console.log('ID:', recipe.value.id);
        console.log('Title:', recipe.value.title);
        console.log('Description:', recipe.value.description);
        console.log('Prep Time:', recipe.value.prepTime);
        console.log('Servings:', recipe.value.servings);
        console.log('Steps:', recipe.value.steps);
        console.groupEnd();

        // Используем Vuex для отправки рецепта
        await store.dispatch('addRecipe', {
          title: recipe.value.title,
          description: recipe.value.description,
          prepTime: recipe.value.prepTime,
          servings: recipe.value.servings,
          image: recipe.value.image,
          steps: recipe.value.steps
        });

        // Очистка формы после отправки
        resetForm();
      } catch (error) {
        console.error('Ошибка при добавлении рецепта:', error);
      }
    };

    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const imageStorageRef = storageRef(storage, `images/${file.name}`);
      try {
        await uploadBytes(imageStorageRef, file);
        const downloadURL = await getDownloadURL(imageStorageRef);
        console.log('Image URL:', downloadURL);
        
        // Сохраняем URL изображения
        recipe.value.image = downloadURL;
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
      }
    };

    const handleStepImageUpload = async (event, index) => {
      const file = event.target.files[0];
      if (!file) return;

      const stepImageStorageRef = storageRef(storage, `images/steps/${file.name}`);
      try {
        await uploadBytes(stepImageStorageRef, file);
        const downloadURL = await getDownloadURL(stepImageStorageRef);
        console.log('Step Image URL:', downloadURL);
        
        // Сохраняем URL изображения для шага
        recipe.value.steps[index].image = downloadURL;
      } catch (error) {
        console.error('Ошибка при загрузке изображения для шага:', error);
      }
    };

    const addIngredient = () => {
      recipe.value.ingredients.push({ name: '', quantity: '', unit: '' });
      console.log('Ингредиент добавлен')
    };

    const removeIngredient = (index) => {
      recipe.value.ingredients.splice(index, 1);
    };

    const addStep = () => {
      recipe.value.steps.push({ description: '', image: null });
    };

    const removeStep = (index) => {
      recipe.value.steps.splice(index, 1);
    };

    const resetForm = () => {
      recipe.value = {
        id: '',
        title: '',
        description: '',
        image: null,
        prepTime: '0',
        ingredients: [],
        servings: '0',
        steps: []
      };
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
      resetForm
    };
  },
  components:{AppButton, AppInput}
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

/* Классы для поля ввода названия ингредиента, количества и единиц измерения */
.ingredient-input, .quantity-input, .unit-select {
  height: 30px;  
  margin-right: 10px;
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

.container {
  max-width: 600px;
  margin: auto;
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.submit-btn{
  background-color:rgb(83, 127, 163);
  width: 100%;
}

.submit-btn:hover{
  background-color:rgb(71, 109, 141)
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
