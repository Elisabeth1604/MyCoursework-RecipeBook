<template>
  <the-header/>
  <div class="container">
    <router-view/>
  </div>
  <the-footer/>
</template>

<script>
import { defineComponent } from 'vue'
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

export default defineComponent({
  components: { TheHeader, TheFooter }
})
</script>

<style scoped>
.container{
  margin-top: 110px;
}
</style>
