<template>
    <div v-if="show"
         class="global-loader">
        <div class="spinner"/>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const show = computed(() => store.getters.showGlobalLoader);
</script>

<style scoped>
.global-loader {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;

    background: white;

}
.spinner {
    width: 50px;
    height: 50px;

    border: 5px solid #ccc;
    border-top-color: #FF7340;
    border-radius: 50%;

    animation: spin 0.8s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
