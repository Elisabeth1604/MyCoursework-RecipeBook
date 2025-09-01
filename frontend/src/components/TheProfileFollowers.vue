<template>
    <section v-show="followersSection && currentUser.followers.length !== 0"
             class="followers-subscriptions">
        <h3>Подписчики</h3>
        <div class="followers-subscriptions-list">
            <AppFollowerCard
                v-for="item in currentUser.followers"
                :key="item"
                :id="item"
            />
        </div>
    </section>

    <section v-show="subscriptionsSection && currentUser.subscriptions.length !== 0"
             class="followers-subscriptions">
        <h3>Подписки</h3>
        <div class="followers-subscriptions-list">
            <AppFollowerCard
                v-for="item in currentUser.subscriptions"
                :key="item"
                :id="item"
                :is-subscriptions="true"
            />
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import AppFollowerCard from '@/components/cards/AppFollowerCard.vue';

defineProps({
    followersSection: {
        type: Boolean,
        default: false,
    },
    subscriptionsSection: {
        type: Boolean,
        default: false,
    },
});
const store = useStore();

const currentUser = computed(() => store.getters['user/user']);
</script>

<style scoped>
.followers-subscriptions {
    display: block;
    grid-column: 1 / 2;
    margin-bottom: 40px;
    padding: 20px;
    align-items: center;

    text-align: center;

    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.followers-subscriptions-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    align-items: start;
}

h3 {
    text-align: start;
}

@media (max-width: 760px) {
    .followers-subscriptions-list{
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }
}

@media (max-width: 590px) {
    .followers-subscriptions-list{
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
}

@media (max-width: 385px) {
    .followers-subscriptions-list{
        grid-template-columns: repeat(1, 1fr);
        gap: 10px;
    }
}
</style>
