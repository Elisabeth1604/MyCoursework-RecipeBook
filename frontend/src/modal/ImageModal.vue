<template>
    <Transition name="fade">
        <div v-if="visible"
             class="image-modal"
             @click="closeModal">
            <img :src="imageUrl ? `${mediaUrl}${imageUrl}` : require('@/assets/images/fallback.jpg')"
                 class="full-image"
                 alt="Полное изображение"/>
        </div>
    </Transition>
</template>
  
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

defineProps({
    imageUrl: String,
    visible: Boolean,
});

const emit = defineEmits(['close']);

const store = useStore();
const mediaUrl = computed(() => store.getters.mediaUrl);

const closeModal = () => {
    emit('close');
};
</script>
  
<style scoped>
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.8);

    cursor: pointer;

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
