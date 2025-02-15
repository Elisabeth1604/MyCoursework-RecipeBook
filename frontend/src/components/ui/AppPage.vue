<!-- Этот компонент объединяет в себя название и контейнер для контента страниц Профиль, Мои рецепты, Избранное -->
<template>
    <div class="app-page">
        <h2>{{title}}</h2>
        <slot/> <!--Сюда вставляем контент-->
    </div>
</template>

<script>
import { defineComponent, props } from 'vue'

export default defineComponent({
    props:{
            title:{
                type: String,
                required: true
            }
        },
    setup(props) {
        document.title=`${props.title} | Yummy`
    },
})
</script>

<style scoped>
h2{
    color: #333;
}
.app-page{
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
}

</style>