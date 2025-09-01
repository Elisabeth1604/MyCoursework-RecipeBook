<template>
    <div class="comment-item">
        <img
            class="comment-recipe-image"
            :src="comment.recipe.main_photo ? `${mediaUrl}${comment.recipe.main_photo}` : 
                require('@/assets/images/fallback.jpg')"
            alt="Фото рецепта"
        />
        
        <div class="comment-content">
            <RouterLink :to="`/recipe-page/${comment.recipe.id}`"
                        class="recipe-title">
                {{ comment.recipe.recipe_title }}
            </RouterLink>

            <p class="comment-text">
                {{ comment.text }}
            </p>

            <span class="comment-date">
                { new Date(comment.created_at).toLocaleDateString('ru-RU') }}
            </span>
        </div>
        
        <AppButton @click="emit('delete')">Удалить</AppButton>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import store from '@/store/store';
import { 
    AppButton, 
} from '@ui';

defineProps({
    comment: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['delete']);

const mediaUrl = computed(() => store.getters.mediaUrl);
</script>

<style scoped>
.comment-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;

    border: 1px solid #ddd;
    border-radius: 10px;
    background: #fff;
}
.comment-recipe-image {
    width: 100px;
    height: 100px;
    margin-right: 15px;

    border-radius: 8px;
    object-fit: cover;
}
.comment-content {
    flex-grow: 1;
}
.recipe-title {
    font-weight: bold;
    font-size: 16px;
    text-decoration: none;
    color: #333;
}
.recipe-title:hover {
    border-bottom: 1.5px dashed #FF9973;
    color: #FF9973;
}

.recipe-title:active {
    border-bottom: 1.5px dashed #ff5722;
    color: #ff5722;
}
.comment-text {
    margin: 5px 0;
    color: #555;
}
.comment-date {
    font-size: 0.85em;
    color: #888;
}
</style>
