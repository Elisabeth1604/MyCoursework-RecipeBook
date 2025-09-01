<template>
    <div :class="['recipe-card', { expanded: isExpanded }]"
         @click="handleCardClick"
         title="При нажатии откроется страница рецепта">

        <AppButton
            v-if="mode === 'my'"
            title = "Удалить"
            buttonClass="delete-btn"
            @action="confirmDelete"
        >
            ✖
        </AppButton>

        <img class="recipe-card-img"
             :src="recipeImage ? `${mediaUrl}${recipeImage}` : require('@/assets/images/fallback.jpg')"
             alt="Фото рецепта" />

        <div class="recipe-header">
            <div class="kkal" title="Количество калорий на 100 грамм">
                <img class="kkal-img" :src="require('@/assets/icons/kcal.png')" />

                <span class="calories">
                    {{ Math.round(calories) }} ккал
                </span>
            </div>
            
            <div class="prep" title="Время приготовления">
                <img class="prep-img" :src="require('@/assets/icons/clock (2).png')" />

                <span class="prep-time">
                    {{prepTimeHour? prepTimeHour : 0}} ч {{  prepTimeMin? prepTimeMin : 0 }} мин
                </span>
            </div>
        </div>
        
        <h3>{{ recipeTitle }}</h3>
        
        <p>{{ recipeDescription }}</p>

        <div class="card-footer">
            <AppButton
                v-if="!isExpanded"
                buttonClass="ingredients-button"
                title="Развернуть карточку"
                @action="toggleCard"
                small>Состав</AppButton>
            
            <AppButton
                v-if="mode !== 'my' && !isExpanded"
                buttonClass="favorite-btn"
                @action="addToFavourites(recipeId)"
                :title="isFavourite ? 'Удалить из избранного' : 'Добавить в избранное'">
                <img
                    class="favourites-img"
                    :src="isFavourite
                        ? require('@/assets/icons/heart.png')
                        : require('@/assets/icons/favourite.png')"
                    :alt="isFavourite ? 'Удалить из избранного' : 'Добавить в избранное'"
                />
            </AppButton>
            
            <AppButton
                v-if="mode === 'my'&& !isExpanded"
                @action="editRecipe()"
                title="Редактировать рецепт"
            >Редактировать</AppButton>
        </div>

        <div v-if="isExpanded" class="card-ingredients">
            <div class="ingredients">
                <h4>Ингредиенты:</h4>

                <ul>
                    <li v-for="item in ingredients"
                        :key="item.ingredient.ingredient_name">
                        {{ item.ingredient.ingredient_name }}
                    </li>
                </ul>
            </div>

            <AppButton @action="viewRecipe(recipeId)"
                       buttonClass="recipe-card-button">Показать рецепт</AppButton>
            
            <AppButton @action="toggleCard"
                       buttonClass="recipe-card-button"
                       small>Свернуть</AppButton>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
    AppButton,
} from '@ui';

const props = defineProps({
    recipeId: Number,
    recipeTitle: String,
    recipeDescription: String,
    recipeImage: String,
    prepTimeMin: Number,
    prepTimeHour : Number,
    servings: Number,
    calories: Number,
    ingredients: Array, // массив объектов {ingredient, quantity}
    isPublic: Boolean,
    isExpanded: Boolean,
    mode: String, // пропс для режима использования (где отображается карточка, в избранном, на главной и тд)
});

const emit = defineEmits(['toggle-card', 'delete-my-recipe']);

const store = useStore();
const router = useRouter();

const getUserFavourites = computed(
    () => store.getters['recipe/getUserFavourites'],
);

const mediaUrl = computed(() => store.getters.mediaUrl);

const isAuth = computed(() => store.getters['auth/isAuthenticated']);

const isFavourite = computed(() => {
    if (isAuth.value) {
        return getUserFavourites.value.some(recipe => recipe.id === props.recipeId);
    }
    return false;
});

const viewRecipe = (recipeId) => {
    router.push({
        name: 'RecipePage',
        params: { id: recipeId },
    });
};

const toggleCard = () => {
    emit('toggle-card');
};

const handleCardClick = () => {
    viewRecipe(props.recipeId);
};

const addToFavourites = (recipeId) => {
    if (isAuth.value) {
        if (isFavourite.value) {
            store.dispatch('recipe/removeFromFavourites', recipeId);
            
            store.dispatch('setMessage', {
                type: 'success',
                text: 'Рецепт удалён из избранного!',
                position: 'app-message',
            });

            return;
        }

        store.dispatch('recipe/addToFavourites', recipeId);

        store.dispatch('setMessage', {
            type: 'success',
            text: 'Рецепт добавлен в избранное!',
            position: 'app-message',
        });

        return;
    }

    store.dispatch('setMessage', {
        type: 'warning',
        text: 'Пожалуйста, войдите или зарегистрируйтесь и попробуйте снова!',
        position: 'app-message',
    });
};

const confirmDelete = () => {
    const message = 'Удалить этот рецепт навсегда?';

    if (confirm(message)) {
        if (props.mode === 'my') {
            emit('delete-my-recipe', props.recipeId);
        }
    }
};

const editRecipe = () => {
    router.push({ name: 'EditRecipe', params: { id: props.recipeId } });
};
</script>

<style scoped>
.recipe-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-height: 420px;

    text-align: center;

    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    transition: transform 0.3s ease, box-shadow 0.3s ease;

    cursor: pointer;
}

/* Развернутая карточка рецепта */
.recipe-card.expanded {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
}

.recipe-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}

/* Главное фото рецепта */
.recipe-card-img {
    width: 100%;
    height: 210px;
    border-radius: 10px;
    object-fit: cover;
}

/* Калорийность и время приготовления */
.recipe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
}

/* Поле времени приготовления */
.prep, .kkal {
    display: flex;
    align-items: center
}

.prep-img, .kkal-img {
    max-height: 25px;
    padding-right: 5px;
}

/* Кнопки показать рецепт и свернуть */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

/* Кнопка добавления в избранное */
.favorite-btn {
    padding: 5px 0 0 0;

    background-color: transparent;
    border: none;

    cursor: pointer;
}

.favorite-btn:hover {
    background-color:#e5e2e2
}

.favorite-btn img {
    width: 100%;
    height: 30px;
}

.recipe-card .prep-time, .calories {
    font-size: 14px;
    color: #666;
}

/* Здесь для списка ингредиентов */
ul {
    padding-inline-start: 20px;
}

/* Развернутое поле для списка ингредиентов вместе с кнопками */
.card-ingredients {
    text-align: start;
}

/* Поле ингредиентов с названием */
.ingredients {
    margin-top: 10px;

    text-align: start;
    font-size: 14px;
    color: #666;
}

/* Название "Ингредиенты" */
.ingredients h4 {
    padding-left: 10px;
    font-size: 15px;
}

.recipe-card h3 {
    margin: 15px 0 10px 0;
    color: #333;
}

.recipe-card p {
    font-size: 14px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}

.delete-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 2px 7px;

    font-size: 15px;

    background: #FF9973;
    border: none;
    border-radius: 30%;
    color: white;

    box-shadow: 0 0 0 rgba(0, 0, 0, 0);

    cursor: pointer;
}

.delete-btn:hover {
    background-color: #ff5722;
}
</style>
