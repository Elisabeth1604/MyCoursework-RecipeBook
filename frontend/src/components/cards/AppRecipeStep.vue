<template>    
    <div class="step">
        <label class="label-step">
            Шаг {{ index + 1 }}
        </label>

        <!-- Модальное окно для увеличенного изображения шага -->
        <ImageModal :imageUrl="selectedImage"
                    :visible="isModalVisible"
                    @close="isModalVisible = false" />

        <!-- Изображение шага с обработчиком клика -->
        <img :src="step.photo ? `${mediaUrl}${step.photo}`: require('@/assets/images/fallback.jpg')"
             alt="Фото шага"
             class="step-image"
             @click="openImage(step.photo)" />

        <p class="step-description">{{ step.description }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ImageModal from '@/modal/ImageModal.vue';

defineProps({
    step: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        default: 0,
    },
});

const isModalVisible = ref(false);
const selectedImage = ref(''); // URL выбранного изображения
const mediaUrl = ref('http://127.0.0.1:8000/');

const openImage = (imageUrl) => {
    selectedImage.value = imageUrl;
    isModalVisible.value = true;
};
</script>

<style scoped>
.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;

    text-align: center;

    background-color: white;
    border: 1px solid #dcdcdc;
    border-radius: 8px;

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.step-image {
    width: 100%;
    border-radius: 8px;
    cursor: pointer;
}

.step-description {
    margin-top: 5px;
    padding: 10px;

    color: #333;
    border: 1.9px #787878  dotted;
    border-radius: 8px;
}

.label-step{
    padding: 5px;
}
</style>


