<template>    
    <div class="step">
        <label class="label-step">Шаг {{ index + 1 }}</label>
        <img :src="step.image" alt="Фото шага" class="step-image" />
        <p class="step-description">{{ step.description }}</p>
    </div>
</template>

<script>
import { defineComponent} from 'vue'

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
        
    },
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


