<!-- Этот компонент объединяет в себя название и контейнер для контента страниц Профиль, Мои рецепты, Избранное -->
<template>
    <div class="app-page">
        <TheFilters v-if="filters"/> <!--Если передан пропс, то на странице отображаются еще фильтры (только на главной)-->

        <h2 :class="title">
            {{title}}
        </h2>

        <slot/>
    </div>
</template>

<script setup>
import TheFilters from '@/components/search/TheFilters.vue';

const props = defineProps({
    title:{
        type: String,
        required: true,
    },
    // Фильтры только на главной
    filters:{
        type: Boolean,
        required: false,
    },
});

document.title=`${props.title} | Поделюсь рецептом`;
</script>

<style scoped>
.app-page {
    padding: 40px;
    margin: 0 auto;
    max-width: 1200px;
}

@media (max-width: 480px) {
    .app-page {
        padding: 20px;
    }
}
</style>
