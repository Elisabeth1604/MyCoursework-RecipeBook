<template>
  <div>
    <a :href="link"
     :class="linkClass">{{ text }}</a>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    link:{
        type: String,
        default: ''
    },
    linkClass: {
        type: String,
        default: ''
    }
  }
};
</script>

<style scoped>
  a {
    display: inline-block;
    margin-top: 5px;
    text-decoration-line: none;
    border-bottom: 1px solid;
  }
  /* Цвет при наведении на ссылку */
  a:hover {
    color: #FF9973;
  }
/* Цвет при нажатии на ссылку */
  a:active {
    color: #fc511c;
  }
</style>