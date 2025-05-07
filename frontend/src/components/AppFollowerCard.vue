<!--Этот компонент используется для отображения карточки подписчика или подписки пользователя,
отображается в профиле в соответствующей секции-->
<template>
  <div class="follower-card" @click="handleCardClick" title="При нажатии откроется профиль автора">
    <div class="follower-card-img">
    <img :src="follower?.avatar_url ? `${mediaUrl}${follower?.avatar_url}` : require('@/assets/icons/profile.png')" alt="Фото профиля"/>
    </div>
    <p>{{follower?.username}}</p>
    <app-button v-if="isSubscriptions"
        @click.stop="unsubscribe"
        button-class="unsubscribe-btn">Отписаться</app-button>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, props, ref, watch } from "vue";
import store from "@/store/store";
import AppButton from "@/components/AppButton.vue";
import router from "@/router/router";

export default defineComponent({
  props: {
    id: Number,
    isSubscriptions: { // Этот пропс нужен для того, чтобы отображать кнопку Отписаться только у подписок, но не у подписчиков
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const follower = ref(null);
    const mediaUrl = computed(() => store.getters.mediaUrl);

    const loadData = async () => {
      try {
        // Загружаются данные о подписчике или подписке по id, переданному в props
        const response = await store.dispatch('user/fetchUserById', props.id);
        follower.value = response;
        console.log(follower.value)
      }
      catch (error){
        console.error('Ошибка загрузки подписчика или подписки:', error);
      }
    };

    onMounted(loadData);

    const unsubscribe = async () => {
        try {
          await store.dispatch('user/unsubscribe', props.id);
          store.dispatch("setMessage", {
            type: "success",
            text: 'Вы успешно отписались!',
            position: "app-message-profile"
          });
        } catch (error) {
          store.dispatch("setMessage", {
            type: "error",
            text: `Ошибка отписки`,
            position: "app-message-profile"
          });
        }
    };

    const handleCardClick = () => {
      router.push({
        name: 'Profile', // имя маршрута
        params: { userId: props.id }
      });
    };

    return {
      follower,
      unsubscribe,
      handleCardClick,
      mediaUrl
    }
  },
  components: { AppButton }
})
</script>

<style scoped>
.follower-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  height: 200px;
  overflow: hidden; /*Скрывает часть содержимого, которая не поместилась в контейнере*/
  transition: box-shadow 0.3s ease;
}

.follower-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.follower-card-img {
  border-radius: 10px;
  height: 120px;
  overflow: hidden; /* обрезаем по границам контейнера */
  display: flex;
  justify-content: center;
  align-items: center;
}

.follower-card img {
  height: 100%;
  width: auto;
  object-fit: cover; /* сохраняет пропорции и центрирует */
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