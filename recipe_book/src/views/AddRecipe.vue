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

                <!-- Поле (компонент) для ВРЕМЕНИ ПРИГОТОВЛЕНИЯ рецепта с привязкой к данным компонента через v-model-->
                <app-input
                    label="Время приготовления (в минутах)"
                    name="prepTime"
                    iD="prepTime"
                    type="number"
                    input-class="add-recipe-form"
                    
                    required
                ></app-input>

                <!-- Поле (компонент) для КОЛИЧЕСТВА ПОРЦИЙ рецепта с привязкой к данным компонента через v-model-->
                <app-input
                    label="Количество порций"
                    name="servings"
                    iD="servings"
                    type="number"
                    input-class="add-recipe-form"
                    
                    required
                ></app-input>

                <!-- Поле для ШАГОВ ПРИГОТОВЛЕНИЯ-->
                <div class="form-group">
                    <h2>Шаги приготовления</h2>
                    <div v-for="(step, index) in recipe.steps" :key="index" class="step">
                        <label>Шаг {{ index + 1 }}:</label>
                        <textarea class="step-description" v-model="step.description" placeholder="Опишите этот шаг" required></textarea>
                        <label>Загрузите изображение для этого шага:</label>
                        <input type="file" @change="handleStepImageUpload(index)" required>

                        <app-button 
                        button-class="remove-step" 
                        @click="removeStep(index)"
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
import focusDirective from '@/directives/focusDirective';
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
      servings: '0',
      steps: [] // Шаги приготовления
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

.add-recipe-form{
    box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.step {
    margin-bottom: 20px;
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
</style>
