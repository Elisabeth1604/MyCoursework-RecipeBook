<template>
    <!-- Кнопка, которая генерирует событие action при нажатии и принимает текст 
     через слот и стили через пропсы -->
    <button @click="$emit('action')" :class="[buttonClass, { 'disabled': Disabled }]"
    :disabled="Disabled"><slot/></button>
</template>

<script>

export default {
    // Компонент может генерировать кастомное событие 'action'
    emits: ['action'],
    // Определение свойств (props), которые компонент получает от родителя
    props: {
        buttonClass:{
            type: String, // Ожидается строка для CSS-класса кнопки
            default: '',
            // validator (value){
            //     return
            // }

        },
        Disabled:{ // Если я хочу неактивную изначально кнопку, но если этого свойства нет, то по умолчанию кнопка обычная
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>

.search-button{
    margin-left: 5px;
}

button {
    display: inline-block;
    padding: 10px 15px;
    background-color: #FF9973;
    color: white;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

button:hover {
    background-color: #ff5722;
}

.disabled {
    background-color: grey; /* Цвет для неактивной кнопки */
    cursor: not-allowed; /* Изменение курсора */
    opacity: 0.6; /* Уменьшение непрозрачности */
}

.disabled:hover {
    background-color: rgb(100, 99, 99); /* Цвет для неактивной кнопки */
    cursor: not-allowed; /* Изменение курсора */
    opacity: 0.6; /* Уменьшение непрозрачности */
}
</style>