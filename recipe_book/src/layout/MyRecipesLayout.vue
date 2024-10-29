<template>
    <the-header></the-header>
    <router-view></router-view>
    <the-footer></the-footer>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

export default{
    setup() {
        
    },
    components:{TheHeader, TheFooter}
}
</script>