<template>
    <div>
        <a :href="link"
           :class="linkClass">
            {{ text }}</a>
    </div>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        default: '',
    },
    link:{
        type: String,
        default: '',
    },
    linkClass: {
        type: String,
        default: '',
    },
});
</script>

<style scoped>
a {
    display: inline-block;
    margin-top: 5px;

    text-decoration-line: none;

    border-bottom: 1px solid;
}

a:hover {
    color: #FF9973;
}

a:active {
    color: #fc511c;
}
</style>
