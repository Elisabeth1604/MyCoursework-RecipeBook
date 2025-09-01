<template>
    <div v-if="showMessage && message && message.position === position"
         :class="[position, messageClass, message.fadingOut ? 'fade-out' : 'fade-in']">
        <div class="message-content">
            <div class="message-icon"/>

            <p v-if="title"
               class="message-title" >{{ title }}
            </p>

            <p class="message-text">
                {{ message.text }}
            </p>

            <span class="close-button"
                  @click="closeMessage">
                &times;
            </span>
        </div>
    </div>
</template>
  
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

defineProps({
    position: {
        type: String,
        default: 'app-message', // Если место не передано, то по дефолту в верхнем правом углу
    },
});

const store = useStore();

const message = computed(() => store.state.message);

const showMessage = computed(() => store.getters.showMessage);

const messageClass = computed(() => {
    if (!message.value) return {};
    const type = message.value.type;
    return {
        'error': type === 'error',
        'success': type === 'success',
        'warning': type === 'warning',
    };
});

const TITLE_MAP = {
    success: 'Успешно!',
    error: 'Ошибка!',
    warning: 'Внимание!',
};

const closeMessage = () => {
    store.dispatch('closeMessage', null, { root: true });
};

const title = computed(() => message.value? TITLE_MAP[message.value.type]: null);
</script>

<style>
.app-message {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    width: 300px;

    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    animation: fadeIn 0.5s ease-in-out;
}

.app-message.error, .app-message-profile.error {
    background-color: #f8d7da;
    border-left: 5px solid #dc3545;
    color: #721c24;
}

.app-message.success, .app-message-profile.success {
    background-color: #d4edda;
    border-left: 5px solid #28a745;
    color: #155724;
}

.app-message.warning, .app-message-profile.warning {
    background-color: #fff3cd;
    border-left: 5px solid #ffc107;
    color: #856404;
}

.message-content {
    display: block;
    align-items: center;
}

.message-icon {
    margin-right: 10px;
}

.close-button {
    position: absolute;
    right: 2%;
    top: 10%;

    font-size: 17px;
    color: inherit; /* Цвет текста наследуется от родителя */

    background: none;
    border: none;

    cursor: pointer;
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
