<template>
  <the-header/>
  <router-view/>
  <the-footer/>
</template>

<script>
import { defineComponent } from 'vue';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

export default defineComponent({
  components: { TheHeader, TheFooter }
})
</script>
