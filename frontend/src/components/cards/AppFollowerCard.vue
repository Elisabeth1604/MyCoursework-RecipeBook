<!--Этот компонент используется для отображения карточки подписчика или подписки пользователя,
отображается в профиле в соответствующей секции-->
<template>
    <div class="follower-card" 
         @click="handleCardClick" 
         title="При нажатии откроется профиль автора">

        <div class="follower-card-img">
            <img :src="follower?.avatar_url ? `${mediaUrl}${follower?.avatar_url}` : 
                require('@/assets/icons/profile.png')" alt="Фото профиля"/>
        </div>

        <p>{{follower?.username}}</p>

        <AppButton v-if="isSubscriptions"
                   @click.stop="unsubscribe"
                   button-class="unsubscribe-btn">Отписаться</AppButton>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import store from '@/store/store';
import router from '@/router/router';
import {
    AppButton,
} from '@ui';

const props = defineProps({
    id: Number,
    isSubscriptions: {
        type: Boolean,
        default: false,
    },
});

const follower = ref(null);
const mediaUrl = computed(() => store.getters.mediaUrl);

const loadData = async () => {
    try {
        // Загружаются данные о подписчике или подписке по id, переданному в props
        const response = await store.dispatch('user/fetchUserById', props.id);
        follower.value = response;
    }
    catch (error){
        console.error('Ошибка загрузки подписчика или подписки:', error);
    }
};

const unsubscribe = async () => {
    try {
        await store.dispatch('user/unsubscribe', props.id);
        store.dispatch('setMessage', {
            type: 'success',
            text: 'Вы успешно отписались!',
            position: 'app-message-profile',
        });
    } catch {
        store.dispatch('setMessage', {
            type: 'error',
            text: 'Ошибка отписки',
            position: 'app-message-profile',
        });
    }
};

const handleCardClick = () => {
    router.push({
        name: 'Profile',
        params: { userId: props.id },
    });
};

onMounted(loadData);
</script>

<style scoped>
.follower-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 15px;
    height: 200px;

    text-align: center;

    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    transition: box-shadow 0.3s ease;

    cursor: pointer;
}

.follower-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.follower-card-img {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;

    border-radius: 10px;
    overflow: hidden;
}

.follower-card img {
    height: 100%;
    width: auto;
    object-fit: cover;
}

@media (max-width: 1100px) {
    .follower-card {
        height: 190px;
    }
}

@media (max-width: 425px) {
    .follower-card {
        height: 170px;
    }
}
</style>
