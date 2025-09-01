<template>
    <AppPage title="Профиль"> <!-- Использую шаблон AppPage(название и контейнер для контента)
                                для главной, избранного, профиля и моих рецептов-->
        <div class="profile">
            <section class="profile-info">
                <div class="profile-photo-container" >
                    <!-- Аватарка с анимацией загрузки -->
                    <div v-if="isUserLoaded"
                         class="avatar-wrapper" >
                        <!-- Основное изображение -->
                        <img
                            v-if="user?.avatar_url && !profileForm.avatarError"
                            :src="`${mediaUrl}${user?.avatar_url}`"
                            alt="Фото пользователя"
                            class="avatar"
                            @error="profileForm.handleAvatarError"
                        >
                        <!-- Дефолтное изображение (появляется, если нет аватарки или ошибка) -->
                        <img
                            v-else
                            :src="require('@/assets/icons/profile.png')"
                            alt="Дефолтное фото"
                            class="avatar default-avatar"
                        >
                    </div>
                </div>

                <div class="details">
                    <p><strong>Имя:</strong> {{ user?.username ? user.username : 'Загрузка...' }}</p>
                    <p><strong>Email:</strong> {{ user?.email ? user.email : 'Загрузка...' }}</p>
                    <p><strong>Дата регистрации:</strong> {{ formattedDate }}</p>
                    <p><strong>Подписчики: </strong>{{ user?.followers_count }}</p>
                    <p><strong>Подписки: </strong>{{ user?.subscriptions_count }}</p>

                    <AppButton
                        v-show="!isEditing && !isMyProfile"
                        @click="subscribeOrUnsubscribe"
                    >{{ isSubscribed ? "Отписаться" : `Подписаться` }}</AppButton>

                    <AppButton
                        v-show="!isEditing && isMyProfile"
                        @click="editProfile"
                        button-class="edit-profile"
                    >Редактировать <span class="edit">профиль</span></AppButton>
                </div>
            </section>

            <section v-show="isEditing"
                     class="editProfile" >
                <span class="close-btn"
                      @click="closeEditForm">&times;
                </span>

                <h3>Редактирование профиля</h3>

                <form @submit.prevent="onEdit">
                    <AppInput
                        label="Изменить имя пользователя"
                        name="username"
                        iD="name"
                        type="text"
                        input-class="edit-profile-input"
                        v-model="profileForm.username"
                        @blur="profileForm.usernameBlur"
                        :error="profileForm.usernameError || profileForm.backendErrors.username"
                        @input="profileForm.backendErrors.username = ''"

                        placeholder="Введите новое имя пользователя"
                    ></AppInput>

                    <AppInput
                        label="Изменить email"
                        name="email"
                        iD="email"
                        type="text"
                        input-class="edit-profile-input"
                        v-model="profileForm.email"
                        @blur="profileForm.emailBlur"
                        :error="profileForm.emailError || profileForm.backendErrors.email"
                        @input="profileForm.backendErrors.email = ''"
                        placeholder="Введите новый адрес электронной почты"
                    ></AppInput>

                    <AppInput
                        label="Изменить фото"
                        name="image"
                        iD="image"
                        type="file"
                        ref="avatarInput"
                        input-class="add-recipe-form"
                        @change="profileForm.handleAvatarChange"
                    ></AppInput>

                    <img v-if="profileForm.previewAvatar"
                         :src="profileForm.previewAvatar"
                         class="avatar-preview"
                         alt="Выбранный новый аватар"/>

                    <h3>Изменить пароль</h3>

                    <div class="password-input-container-profile">
                        <a href="#" @click.prevent="togglePasswordVisibility"
                           class="password-control" :class="{ view: isPasswordVisible }"
                           :title="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'">
                        </a>

                        <AppInput
                            label="Старый пароль"
                            name="oldPassword"
                            iD="old_password"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            input-class="edit-profile-input"
                            v-model="profileForm.oldPassword"
                            @blur="profileForm.oldPasswordBlur"
                            :error="profileForm.oldPasswordError || profileForm.backendErrors.oldPassword"
                            @input="profileForm.backendErrors.oldPassword = ''"
                            placeholder="Введите старый пароль"
                        ></AppInput>
                    </div>

                    <AppInput
                        label="Новый пароль"
                        name="newPassword"
                        iD="new_password"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        input-class="edit-profile-input"
                        v-model="profileForm.newPassword"
                        @blur="profileForm.newPasswordBlur"
                        :error="profileForm.newPasswordError || profileForm.backendErrors.newPassword"
                        @input="profileForm.backendErrors.newPassword = ''"
                        placeholder="Введите новый пароль"
                    ></AppInput>

                    <AppInput
                        label="Подтверждение пароля"
                        name="confirmPassword"
                        iD="confirm_password"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        input-class="edit-profile-input"
                        v-model="profileForm.confirmPassword"
                        @blur="profileForm.confirmPasswordBlur"
                        :error="profileForm.confirmPasswordError || profileForm.backendErrors.confirmPassword"
                        @input="profileForm.backendErrors.confirmPassword = ''"
                        placeholder="Введите пароль еще раз"
                    ></AppInput>

                    <AppButton type="submit"
                               button-class="edit-profile"
                    >Сохранить изменения</AppButton>
                </form>
            </section>

            <div v-if="showMessage"
                 class="message-container">
                <AppMessage position="app-message-profile"/>
            </div>

            <TheProfileFollowers :followers-section="true" v-if="isMyProfile"/>
            <TheProfileFollowers :subscriptions-section="true" v-if="isMyProfile"/>

            <section v-if="isMyProfile && myComments.length" class="my-comments">
                <h2>Мои комментарии</h2>

                <AppMyComment
                    v-for="comment in myComments"
                    :key="comment.id"
                    :comment="comment"
                    @delete="deleteComment(comment.id)">
                </AppMyComment>
            </section>
        </div>

        <div v-if="!isMyProfile"
             class="user-recipes">
            <h2>Все рецепты пользователя</h2>

            <div v-if="userRecipes && userRecipes.length"
                 class="recipes"
                 ref="recipeGrid">
                <AppRecipeCard
                    v-for="item in userRecipes"
                    :key="item.id"
                    :recipe-id="item.id"
                    :recipe-title="item.recipe_title"
                    :recipe-description="item.description"
                    :recipe-image="item.main_photo"
                    :prepTimeMin="item.prep_time_min"
                    :prepTimeHour="item.prep_time_hour"
                    :ingredients="item.ingredients"
                    :servings="item.servings"
                    :calories="item.calories_per_100"
                    :is-expanded="expandedCardId === item.id"
                    :is-public="true"
                    @toggle-card="toggleCard(item.id)"
                />
            </div>

            <div v-else
                 class="no-recipes"
                 style="text-align:start">
                <p>У пользователя пока нет рецептов.</p>
            </div>
        </div>
    </AppPage>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { UseProfileChangeForm } from '@/use/change-profile';
import { useRoute } from 'vue-router';
import AppMyComment from '@/components/comments/AppMyComment.vue';
import AppRecipeCard from '@/components/cards/AppRecipeCard.vue';
import TheProfileFollowers from '@/components/TheProfileFollowers.vue';
import {
    AppMessage,
    AppPage,
    AppInput,
    AppButton,
} from '@ui';

const store = useStore();
const route = useRoute();

const isAuth = computed(() => store.getters['auth/isAuthenticated']);

const currentUser = computed(() => store.getters['user/user']); // Текущий авторизованный пользователь

const targetUserId = computed(() => route.params.userId); // ID пользователя, чей профиль открыт
const isCurrentUser = computed(() => currentUser.value?.id === Number(targetUserId.value));
const user = ref(null); // Данные пользователя, чей профиль просматривается

// Рецепты, добавленные пользователем (видим только публичные)
const userRecipes = computed(() => store.getters['recipe/getUserPublicRecipes'](Number(targetUserId.value)));

// Подписаны ли мы на человека, чью страницу открыли
const isSubscribed = computed(() => store.getters['user/isSubscriber'](Number(targetUserId.value)));

const isMyProfile = computed(() => {
    return route.path === '/profile' || isCurrentUser.value || targetUserId.value === undefined;});

const isPasswordVisible = ref(false);
const isEditing = ref(false); // Флаг для формы редактирования профиля
const avatarInput = ref(null); // доступ к <app-input type="file" ref="avatarInput">

const expandedCardId = ref(null);

const isUserLoaded = ref(false);

const profileForm = UseProfileChangeForm();

const mediaUrl = computed(() => store.getters.mediaUrl);
const showMessage = computed(() => store.getters.showMessage);

const myComments = ref([]);

const loadMyComments = async () => {
    if (isMyProfile.value && currentUser.value?.id) {
        myComments.value = await store.dispatch('user/fetchUserComments', currentUser.value.id);
    }
};

const loadData = async () => {
    if (isMyProfile.value) {
        await store.dispatch('user/fetchUser');
        user.value = currentUser.value;
        await loadMyComments();
    } else {
        try {
            const response = await store.dispatch('user/fetchUserById', targetUserId.value);
            await store.dispatch('recipe/fetchRecipes');
            user.value = response;
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
        }
    }
    isUserLoaded.value = true;
    document.title=`${user.value.username} | Поделюсь рецептом`;
};

// Автоматическая перезагрузка при изменении URL,
// чтобы можно было с чужого профиля перейти на свой без полной перезагрузки страницы
watch(
    () => route.fullPath, // отслеживаем весь путь, включая и /profile, и /profile/123
    () => {
        loadData(); // каждый раз при изменении маршрута загружаем заново
    },
);

const editProfile = () => {
    isEditing.value = true;
};

const closeEditForm = () => {
    isEditing.value = false;
};

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const onEdit = async () => {
    try {
        await profileForm.onSubmit();

        if (isMyProfile.value) {
            user.value = { ...store.getters['user/user'] };
        }

        profileForm.username.value = '';
        profileForm.email.value = '';
        profileForm.oldPassword.value = null;
        profileForm.newPassword.value = null;
        profileForm.confirmPassword.value = null;
        profileForm.avatar.value = null;
        profileForm.previewAvatar.value = null;

        Object.keys(profileForm.backendErrors.value).forEach(
            (key) => (profileForm.backendErrors.value[key] = ''),
        );

        // Сброс <input type="file">
        if (avatarInput.value) {
            const fileInput = avatarInput.value.$el?.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = null;
        }

        closeEditForm();

        store.dispatch('setMessage', {
            type: 'success',
            text: 'Данные успешно обновлены!',
            position: 'app-message-profile',
        }, { root: true });
    } catch {
        store.dispatch('setMessage', {
            type: 'error',
            text: 'Ошибка изменения профиля',
            position: 'app-message',
        }, { root: true });
    }
};

const subscribe = async () => {
    await store.dispatch('user/fetchUser');

    if (isAuth.value) {
        try {
            await store.dispatch('user/subscribe', targetUserId.value);
            store.dispatch('setMessage', {
                type: 'success',
                text: 'Вы успешно подписались!',
                position: 'app-message-profile',
            });
        } catch {
            store.dispatch('setMessage', {
                type: 'error',
                text: 'Ошибка подписки',
                position: 'app-message-profile',
            });
        }

        return;
    }

    store.commit('auth/showLoginModal');
    store.dispatch('setMessage', {
        type: 'warning',
        text: 'Пожалуйста, авторизуйтесь и попробуйте снова!',
        position: 'app-message',
    });
};

const unsubscribe = async () => {
    if (isAuth.value) {
        try {
            await store.dispatch('user/unsubscribe', targetUserId.value);
            store.dispatch('setMessage', {
                type: 'success',
                text: 'Вы успешно отписались!',
                position: 'app-message-profile',
            });
        } catch {
            store.dispatch('setMessage', {
                type: 'error',
                text: 'Ошибка отписки',
                position: 'app-message-profile',
            });
        }

        return;
    }

    store.commit('auth/showLoginModal');
    store.dispatch('setMessage', {
        type: 'warning',
        text: 'Пожалуйста, авторизуйтесь и попробуйте снова!',
        position: 'app-message',
    });
};

const subscribeOrUnsubscribe = async () => {
    if (isSubscribed.value) {
        await unsubscribe();
        return;
    }
    await subscribe();

    await store.dispatch('user/fetchUser');  // Обновляем данные после действия
    await loadData();  // Повторно загружаем профиль
};


const toggleCard = (id) => {
    expandedCardId.value = expandedCardId.value === id ? null : id;
};

const deleteComment = async (commentId) => {
    try {
        await store.dispatch('recipe/deleteRecipeComment', commentId);

        myComments.value = myComments.value.filter(c => c.id !== commentId);

        store.dispatch('setMessage', {
            type: 'success',
            text: 'Комментарий удалён',
            position: 'app-message-profile',
        });
    } catch (error) {
        store.dispatch('setMessage', {
            type: 'error',
            text: `Ошибка удаления: ${error.response?.data?.detail || error.message}`,
            position: 'app-message-profile',
        });
    }
};

const formattedDate = computed(() => {
    if (!this.user || !this.user.date_joined) {
        return 'Загрузка...';
    }

    return new Date(this.user.date_joined).toLocaleDateString('ru-RU');
});

onMounted(loadData);
</script>

<style>
.password-input-container-profile {
    position: relative;
    height: 80px;
    margin-top: 0;
}

.profile {
    display: grid;
    grid-template-columns: 65% 35%;
    align-items: start;
}

.profile-info {
    display: inline-flex;
    text-align: center;
    align-items: center;
    margin-bottom: 40px;
    padding: 20px;

    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.editProfile {
    position: relative;

    display: block;
    text-align: start;
    padding: 20px;
    margin-left:20px;
    margin-bottom: 40px;

    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-profile-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    box-sizing: border-box; /* по умолчанию стоит content-box, который не учитывает padding родителя*/

    border: 1px solid #ccc;
    border-radius: 5px;
}

.profile-photo-container {
    width: 20vw;
    height: 20vw;
    max-width: 350px;
    max-height: 350px;
    min-width: 100px;
    margin: 0;
}

.avatar-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar {
    width: 100%;
    height: 100%;

    border-radius: 10%;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    opacity: 1;

    transition: opacity 0.4s ease-in-out;
}

.default-avatar {
    opacity: 1 !important;
}

.avatar-preview {
    width: 100px;
    height: 100px;
    margin-top: 10px;

    border-radius: 50%;
    object-fit: cover;
}

.details{
    display: block;
    text-align: start;
    margin-left: 20px;
}

.message-container {
    position: relative;

    margin-bottom: 40px;
    padding: 10px;

    background-color: transparent;
}

label {
    display: block;
    margin-bottom: 5px;

    font-weight: bold;
    font-size: 15px;
    color: #333;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;

    font-size: 24px;
    color: #666;

    transition: color 0.3s;

    cursor: pointer;
}

.close-btn:hover {
    color: #333;
}

.is-saving {
    color: #155724;
}

.my-comments {
    grid-column: 1 / 2;
}

@media (max-width: 1050px) {
    .profile{
        display: block;
    }
  
    .editProfile{
        margin-left: 0;
    }

    .profile-info{
        width: 100%;
        box-sizing: border-box;
    }

    .profile-photo-container {
        width: 250px;
        height: 250px;
    }

    .message-container {
        margin-left: 0;
    }
}

@media (max-width: 594px) {
    .profile-photo-container {
        width: 200px;
        height: 200px;
    }
}

@media (max-width: 542px) {
    .profile-photo-container {
        width: 150px;
        height: 150px;
    }

    .details p {
        font-size: 14px;
    }

    label {
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .profile-photo-container {
        width: 110px;
        height: 110px;
    }

    h3 {
        font-size: 16px;
    }

    .edit {
        display:none;
    }

    label {
        font-size: 12px;
    }
}
</style>
