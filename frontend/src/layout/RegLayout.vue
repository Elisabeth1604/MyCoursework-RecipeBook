<template>
    <the-header></the-header>
    <!-- Поместила в класс container из AppAddRecipe для единого стиля -->
    <div class="container"> 
        <router-view/>
    </div>
    <the-footer></the-footer>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

export default {
    setup() {
        
    },

    components:{ TheHeader, TheFooter }
}
</script>
