<template>
    <footer>
        <p>&copy; 2025 Поделюсь рецептом. Все права защищены.</p>
        <p>
            <a href="#">Политика конфиденциальности</a> |
            <a href="#">Условия использования</a>
        </p>
    </footer>
</template>

<style scoped>
footer {
    position: relative;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    margin-top: 115px;

    text-align: center;

    background-color: #4c4a49;
    color: white;
}

footer a {
    text-decoration: none;
    color: #ff5722;
}

footer a:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    p {
        font-size: 12px;
    }
}
</style>
