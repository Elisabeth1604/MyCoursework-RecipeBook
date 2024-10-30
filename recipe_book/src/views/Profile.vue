<template>
    <app-page title="Профиль"> <!-- Использую шаблон AppPage(название и контейнер для контента) для главной, избранного, профиля и моих рецептов-->

    </app-page>
</template>

<script>
import { defineComponent } from 'vue'
import AppPage from '@/components/ui/AppPage.vue';

export default defineComponent({
    setup() {
        
    },
    components:{AppPage}
})
</script>