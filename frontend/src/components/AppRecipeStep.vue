<template>    
    <div class="step">
        <label class="label-step">Шаг {{ index + 1 }}</label>
         <!-- Модальное окно для увеличенного изображения шага -->
         <ImageModal :imageUrl="selectedImage" :visible="isModalVisible" @close="isModalVisible = false" />
        <!-- Изображение шага с обработчиком клика -->
        <img :src="step.image" alt="Фото шага {{ index + 1 }}" class="step-image" @click="openImage(step.image)" />
        <p class="step-description">{{ step.description }}</p>
    </div>
</template>

<script>
import { defineComponent, ref} from 'vue'
import ImageModal from '@/modal/ImageModal.vue';

export default defineComponent({    
    props: {
        step: { 
            type: Object, 
            required: true 
        },
        index: {
            type: Number,
            default: 0
        }
    },
    setup() {
        const isModalVisible = ref(false); // управляет видимостью модального окна
        const selectedImage = ref(''); // хранит URL выбранного изображения

        // Открытие изображения в модальном окне
        const openImage = (imageUrl) => {
            selectedImage.value = imageUrl;
            isModalVisible.value = true;
        };

        return {
            isModalVisible,
            selectedImage,
            openImage
        };
    },
    components:{ImageModal}
})
</script>

<style scoped>
/* Контейнер для каждого шага с изображением и описанием */
    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background-color: #e8e8e8;
        border-radius: 8px;
        padding-left: 10px;
        padding-right: 10px;
    }
    
    /* Стиль для изображения шага приготовления */
    .step-image {
        width: 100%;
        border-radius: 8px;
        cursor: pointer;
    }
    
    /* Описание шага приготовления */
    .step-description {
        margin-top: 5px;
        color: #333;
        border-radius: 8px;
        border:1.9px #787878  dotted; /* Обводка точечками */
        padding: 10px;
    }

    .label-step{
        padding: 5px;
    }

</style>


