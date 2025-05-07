<template>
  <!-- Кнопка, которая генерирует событие action при нажатии и принимает текст
   через слот и стили через пропсы -->
  <button @click="$emit('action')"
          :class="[buttonClass, { 'disabled': Disabled }]"
          :disabled="Disabled">
          <slot name="icon" />
          <slot/>
  </button>
</template>

<script>
export default {
  // Компонент может генерировать кастомное событие 'action'
  emits: ['action'],
  // Определение свойств (props), которые компонент получает от родителя
  props: {
    buttonClass:{
      type: String,
      default: '',
    },
    Disabled:{ // Если я хочу неактивную изначально кнопку, но если этого свойства нет, то по умолчанию кнопка обычная
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
button {
  display: inline-block;
  padding: 10px 15px;
  max-height: 40px;
  background-color: #FF9670;
  color: white;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #ff5722;
}

.disabled {
  background-color: grey;
  cursor: not-allowed;
  opacity: 0.6;
  transition: background-color 0.2s ease, opacity 0.3s ease;
}

.disabled:hover {
  background-color: rgb(100, 99, 99);
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 480px) {
  button {
    font-size: 12px;
  }
}
</style>