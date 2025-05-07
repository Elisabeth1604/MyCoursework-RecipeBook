<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-window">
      <slot/>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  emits:['close'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close');
    };
    return{
      closeModal
    }
  }
})
</script>

<style scoped>
.modal-window {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>