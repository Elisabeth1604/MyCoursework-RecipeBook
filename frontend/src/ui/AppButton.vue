<template>
    <button @click.stop="emit('action')"
            :class="[buttonClass, { 'disabled': Disabled }]"
            :disabled="Disabled">
        <slot name="icon" />
        <slot/>
    </button>
</template>

<script setup>
defineProps({
    buttonClass:{
        type: String,
        default: '',
    },
    Disabled:{
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['action']);
</script>

<style>
button {
    display: inline-block;
    padding: 10px 15px;
    max-height: 40px;

    background-color: #FF9670;
    color: white;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

    transition: background-color 0.2s ease;

    cursor: pointer;
}

button:hover {
    background-color: #ff5722;
}

.disabled {
    background-color: grey;
    opacity: 0.6;

    transition: background-color 0.2s ease, opacity 0.3s ease;

    cursor: not-allowed;
}

.disabled:hover {
    background-color: rgb(100, 99, 99);
    opacity: 0.6;

    cursor: not-allowed;
}

@media (max-width: 480px) {
    button {
        font-size: 12px;
    }
}
</style>
