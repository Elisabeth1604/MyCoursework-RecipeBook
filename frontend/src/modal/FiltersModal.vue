<template>
    <div class="modal-overlay"
         @click.self="closeModal">
        <div class="modal-window">
            <slot/>
        </div>
    </div>
</template>

<script setup>

const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close');
};
</script>

<style scoped>
.modal-window {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
