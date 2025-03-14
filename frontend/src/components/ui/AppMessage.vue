<template>
  <!-- Основной контейнер для уведомления -->
  <div :class="[position, messageClass, message.fadingOut ? 'fade-out' : 'fade-in']" v-if="showMessage && message&& message.position === position">
    <!-- Контейнер для содержимого уведомления -->
    <div class="message-content">
      <!-- Иконка уведомления -->
      <div class="message-icon"></div>
      <!-- title уведомления -->
      <p class="message-title" v-if="title">{{ title }}</p>
      <!-- Текст уведомления -->
      <p class="message-text">{{ message.text }}</p>
      <!-- Кнопка закрытия уведомления -->
      <span class="close-button" @click="closeMessage">&times;</span>
    </div>
  </div>
</template>
  
<script>
import { useStore } from 'vuex'
import { computed } from 'vue';

export default {
  props:{
    position: { // Через пропс получаем место для появления уведомления
      type: String,
      default: 'app-message' // Если место не передано, то по дефолту в верхнем правом углу
    }
  },
  setup(props) {
    const store = useStore()
    // Получаем сообщение из store
    const message = computed(() => store.state.message)
    // Получаем флаг для отображения сообщения
    const showMessage = computed(() => store.getters.showMessage);
      
    // Вычисляемое свойство для класса уведомления
    const messageClass = computed(() => {
      if (!message.value) return {};
      const type = message.value.type;
      return {
        'error': type === 'error',
        'success': type === 'success',
        'warning': type === 'warning'
      };
    });

    const TITLE_MAP = { 
      success: 'Успешно!',
      error: 'Ошибка!',
      warning: 'Внимание!'
    };
    const closeMessage = () => {
      store.dispatch('closeMessage', null, { root: true });
    };

    const title = computed(() => message.value? TITLE_MAP[message.value.type]: null)    

    return {
      message,
      showMessage,
      title,
      messageClass,
      closeMessage,
      close: () => store.commit('clearMessage') // Вызываем мутацию закрытия сообщения
    };
  },
};
</script>

<style>
/* Основной контейнер для уведомления */
.app-message {
  position: fixed; /* Фиксированное положение */
  top: 20px; /* Отступ сверху */
  right: 20px; /* Отступ справа */
  padding: 15px; /* Внутренний отступ */
  border-radius: 5px; /* Скругление углов */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Тень */
  display: flex; /* Флексбокс для выравнивания элементов */
  align-items: center; /* Выравнивание по центру по вертикали */
  justify-content: space-between; /* Равномерное распределение пространства между элементами */
  animation: fadeIn 0.5s ease-in-out; /* Анимация появления */
  width: 300px; /* Ширина контейнера */
  z-index: 9999;
}

/* Стили для уведомления об ошибке */
.app-message.error, .app-message-profile.error {
  background-color: #f8d7da; /* Цвет фона */
  border-left: 5px solid #dc3545; /* Цвет и ширина левой границы */
  color: #721c24; /* Цвет текста */
}

/* Стили для успешного уведомления */
.app-message.success, .app-message-profile.success {
  background-color: #d4edda; /* Цвет фона */
  border-left: 5px solid #28a745; /* Цвет и ширина левой границы */
  color: #155724; /* Цвет текста */
}

/* Стили для предупреждающего уведомления */
.app-message.warning.app-message-profile.warning {
  background-color: #fff3cd; /* Цвет фона */
  border-left: 5px solid #ffc107; /* Цвет и ширина левой границы */
  color: #856404; /* Цвет текста */
}

/* Контейнер для содержимого уведомления */
.message-content {
  display: block; /* Флексбокс для выравнивания элементов */
  align-items: center; /* Выравнивание по центру по вертикали */
}

/* Иконка уведомления (может быть добавлена позже) */
.message-icon {
  margin-right: 10px; /* Отступ справа */
}

/* Кнопка закрытия уведомления */
.close-button {
  position: absolute; /*Абсолютное позиционирование крестика относительно уведомления*/
  right: 2%; /* Отступ справа */
  top: 10%; /* Отступ сверху */
  background: none; /* Прозрачный фон */
  border: none; /* Без границ */
  font-size: 17px; /* Размер шрифта */
  cursor: pointer; /* Курсор в виде руки при наведении */
  color: inherit; /* Цвет текста наследуется от родителя */
}

/* Анимация появления уведомления */
@keyframes fadeIn {
  from {
    opacity: 0; /* Начальная прозрачность */
    transform: translateY(-20px); /* Начальное положение сверху */
  }
  to {
    opacity: 1; /* Конечная прозрачность */
    transform: translateY(0); /* Конечное положение */
  }
}

/* Анимация исчезновения уведомления */
@keyframes fadeOut {
  from {
    opacity: 1; /* Начальная прозрачность */
    transform: translateY(0); /* Исходное положение */
  }
  to {
    opacity: 0; /* Полностью прозрачное состояние */
    transform: translateY(-20px); /* Смещение вверх при исчезновении */
  }
}

/* Применяем анимации */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.fade-out {
  animation: fadeOut 0.5s ease-in-out forwards;
}

.app-message-profile.fade-out {
  animation: fadeOut 0.9s ease-in-out forwards;
}

.message-text{
  font-size: 14px;
}

.message-title{
  font-size: 15px;
  font-weight:bold;
}

@media (max-width: 480px) {
  .message-title{
    font-size: 13px;
  }
  .message-text{
    font-size: 12px;
  }
}
</style>