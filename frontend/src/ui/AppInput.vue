<template>
    <div :class="[name==='ingredient' || name==='quantity' ? 'form-group-ingredients' :
        name==='include-ingredients' || name==='exclude-ingredients' || name==='calories'? '' : 'form-group']">
        <!--Добавила динамический класс, чтобы у полей ввода ингредиента и его количества был класс не form-group-->
        <label v-if="label !== '' && iD !== 'uname' && iD !== 'password'"
               :for="iD">
            {{label}}
        </label> <!-- Привязка метки (label) к полю ввода по атрибуту 'for' с динамическим значением iD -->
        <!-- Если передан инпут для названия рецепта или для mail, делаем его активным автоматически с помощью кастомной
     директивы v-focus -->

        <input v-if="name==='title' || name==='username' || name==='name'" v-focus
               :class="[error ? 'invalid' : inputClass]"
               :type="type" :id="iD" :name="name"
               :placeholder="placeholder"
               :value="modelValue"
               autocomplete="off"
               @input="change"
               @blur="handleBlur">

        <!--Для других полей неактивные изначально инпуты-->
        <input v-else :class="[error ? 'invalid' : inputClass]"
               :type="type" :id="iD" :name="name"
               :placeholder="placeholder"
               :value="modelValue"
               autocomplete="off"
               :min="type==='number' ? '0' :'null'"
               @input="change"
               @blur="handleBlur">

        <small class="validation-message" v-if="error">{{ error }}</small>
    </div>
</template>

<script setup>
import vFocus from '@/directives/focusDirective';

defineProps({
    label: String,
    name: String,
    type: String,
    placeholder:{
        type:String,
        default:'',
    },
    modelValue: [String, Number, null],
    inputClass:{
        type: String,
        default:'',
    },
    iD:{
        type:String,
    },
    error: {
        type:String,
        default: null,
    },
});

const emit = defineEmits(['update:modelValue', 'blur']);

const change = (event) => {
    emit('update:modelValue', event.target.value);
};

const handleBlur = () => {
    emit('blur');
};
</script>

<style>
.invalid {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;

    border: 2px solid darkred;
    border-radius: 5px;
}

.validation-message {
    display: block;

    margin-top: 5px;
    margin-bottom: 10px;

    color: darkred;
    font-size: 0.8rem;
}

.class-input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;

    border: 1px solid #ccc;
    border-radius: 5px;
}

.filter-input {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;

    font-size: 14px;

    border: 1px solid #333;
    border-radius: 5px;
}
</style>
