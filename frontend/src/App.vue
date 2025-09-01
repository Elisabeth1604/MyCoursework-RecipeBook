<template>
    <div v-cloak> <!--Элементы становятся видимыми только когда страница полностью отрендерится-->
        <AppLoader/>
        <!--Конкатенируем сам layout из meta с оставшейся строкой и получаем название, динамический компонент-->
        <component v-if="layout" :is="layout+'-layout'"></component>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import {
    AppLoader,
} from '@ui';

const route = useRoute();
const layout = computed(() => route.meta.layout);
</script>
