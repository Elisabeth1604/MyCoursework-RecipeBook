<template>
    <transition name="fade">
        <div class="image-modal" v-if="visible" @click="closeModal">
        <img :src="imageUrl" alt="Полное изображение" class="full-image" />
        </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'ImageModal',
    props: {
      imageUrl: String,
      visible: Boolean
    },
    emits: ['close'],
    setup(props, { emit }) {
      const closeModal = () => {
        emit('close');
      };
  
      return {
        closeModal
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
    max-width: 90%;
    max-height: 90%;
  }
  /* Анимация для появления и исчезновения модального окна */
   .fade-enter-active, .fade-leave-active {
       transition: opacity 0.5s;
   }
   .fade-enter, .fade-leave-to /* .fade-leave-active в <2.1.8 */ {
       opacity: 0;
   }
  </style>