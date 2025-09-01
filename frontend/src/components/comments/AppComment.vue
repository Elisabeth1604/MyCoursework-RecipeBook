<template>
    <div class="comment">
        <div class="comment-header">
            <img :src="avatar ? `${mediaUrl}${avatar}` : require('@/assets/icons/profile.png')"
                 alt="Фото автора"
                 class="avatar"/>

            <div class="user-info">
                <span class="username">
                    <a :href="`/profile/${user_id}`"
                       title="Перейти в профиль автора">
                        {{ username }}
                    </a>
                </span>
                <span class="timestamp">{{ timestamp }}</span>
            </div>
        </div>

        <div class="comment-body">
            {{ text }}
        </div>

        <AppButton
            v-if="isMyComment"
            @click="emit('delete')"
        >Удалить</AppButton>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import store from '@/store/store';
import {
    AppButton,
} from '@ui';

const props = defineProps({
    user_id: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['delete']);

const mediaUrl = computed(() => store.getters.mediaUrl);

const isMyComment = computed(() =>{
    return store.getters['user/user'].username === props.username;
});
</script>

<style scoped>
.comment {
    padding: 16px;
    margin-bottom: 16px;

    border: 1px solid #dcdcdc;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    background-color: #fff;
}

.comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.avatar {
    width: 40px;
    height: 40px;
    margin-right: 12px;

    border: 1px solid #ccc;
    border-radius: 50%;
    object-fit: cover;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.username {
    font-weight: bold;
    color: #333;
}

/* Ссылка на профиль автора рецепта */
.username a {
    text-decoration: none;
    color: #333;
}

.username a:hover {
    border-bottom: 1.5px dashed #FF9973;
    color: #FF9973;
}

.username a:active {
    border-bottom: 1.5px dashed #ff5722;
    color: #ff5722;
}

.timestamp {
    font-style: italic;
    font-size: 0.85rem;
    color: #888;
}

.comment-body {
    margin-bottom: 12px;

    font-size: 1rem;
    line-height: 1.5;
    color: #444;
}

.comment-actions {
  text-align: right;
}
</style>
