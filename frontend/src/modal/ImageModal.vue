<template>
  <transition name="fade">
    <div class="image-modal" v-if="visible" @click="closeModal">
    <img :src="imageUrl ? `${mediaUrl}${imageUrl}` : require('@/assets/images/fallback.jpg')"
         class="full-image"
         alt="Полное изображение"/>
    </div>
  </transition>
</template>
  
<script>
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: 'ImageModal',
  props: {
    imageUrl: String,
    visible: Boolean
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const mediaUrl = computed(() => store.getters.mediaUrl);

    const closeModal = () => {
      emit('close');
    };

    return {
      closeModal,
      mediaUrl
    };
  }
};
</script>
  
<style scoped>
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
}
.full-image {
  width: 70%;
  height: 80%;
}
/* Анимация для появления и исчезновения модального окна */
.fade-enter-active, .fade-leave-active {
   transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active в <2.1.8 */ {
   opacity: 0;
}
</style>