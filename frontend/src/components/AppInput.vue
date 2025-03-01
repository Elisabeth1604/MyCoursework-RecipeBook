<template>
    <div :class="[name==='ingredient' || name==='quantity' ? 'form-group-ingredients' : 'form-group']"> <!--Добавила динамический класс, чтобы у полей ввода ингредиента и его количества был класс не form-group-->
        <label v-if="label !== '' && iD !== 'uname' && iD !== 'password'" :for="iD">{{label}}</label> <!-- Привязываем метку (label) к полю ввода по атрибуту 'for' с динамическим значением iD -->
        <!-- Если передан инпут для названия рецепта или для mail, делаем его активным автоматически с помощью кастомной 
         директивы v-focus -->
         <!--Если есть ошибка, обводим инпут красным, т е присваиваем динамическому классу класс invalid-->
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
        :min="type==='number' ? '1' :'null'"
        @input="change"
        @blur="handleBlur">        
        
         <!-- Сообщение об ошибке, если оно передано -->
         <small v-if="error">{{ error }}</small>
    </div>
</template>

<script>
import focusDirective from '@/directives/focusDirective';

export default {
    // Компонент может вызывать событие update:value
    emits:['update:modelValue', 'blur'],
    props: {
        label: String,
        name: String,
        type: String,
        placeholder:{ 
            type:String,
            default:''
        },
        modelValue: String,
        inputClass:{
            type: String,
            default:''
        },
        iD:{
            type:String
        },
        error: {
            type:String,
            default: null
        }
    },
    methods: {
        change(event){
            this.$emit('update:modelValue', event.target.value) // Эмитим обновление value, т е
            //обновляем значение в родительском компоненте при изменении данных в дочернем компоненте
        },
        handleBlur() {
            this.$emit('blur');
        },
    },
    directives: {
        focus:focusDirective // файлик с директивой для автоматически активного поля
    },
}
</script>

<style>
.invalid{
    display: inline-block;
    box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/
    width: 100%;
    padding: 10px;
    border: 2px solid darkred;
    border-radius: 5px;

}

small {
    color: darkred;
    font-size: 0.8rem;
    display: block;
    margin-top: 5px; /* Пробел между полем и ошибкой */
}
</style>
