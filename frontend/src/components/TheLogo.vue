<template>
    <RouterLink to="/">
        <div class="logo" title="На главную">
            <img src="@/assets/icons/figma1.png"
                 alt="Логотип">
        </div>
    </RouterLink>
</template>

<style scoped>
.logo {
    display: flex;
    align-items: center;
}

a {
    text-decoration: none;
    color: inherit;
}

.logo img {
    height: 50px;
    margin-right: 10px;
}

@media (max-width: 768px) {
    .logo img {
        height: 40px;
        margin-right: 0;
    }
}

@media (max-width: 480px) {
    .logo img {
        height: 35px;
    }

    header {
        padding: 15px;
    }
}
@media (max-width: 382px) {
    .logo img {
        height: 30px;
    }

    header {
        padding: 10px;
    }
}
</style>
