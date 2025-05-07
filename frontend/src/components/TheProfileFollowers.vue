<template>
  <section class="followers-subscriptions" v-show="followersSection && currentUser.followers.length!==0">
    <h3>Подписчики</h3>
    <div class="followers-subscriptions-list">
      <app-follower-card
          v-for="item in currentUser.followers"
          :key="item"
          :id="item"
      />
    </div>
  </section>
  <section class="followers-subscriptions" v-show="subscriptionsSection && currentUser.subscriptions.length!==0">
    <h3>Подписки</h3>
    <div class="followers-subscriptions-list">
      <app-follower-card
          v-for="item in currentUser.subscriptions"
          :key="item"
          :id="item"
          :is-subscriptions="true"
      />
    </div>
  </section>
</template>

<script>
import AppFollowerCard from "@/components/AppFollowerCard.vue";
import {computed, defineComponent, props} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  props: {
    followersSection: { type: Boolean,
                        default: false },
    subscriptionsSection: { type: Boolean,
                            default: false }
  },
  setup(props) {
    const store = useStore();

    const currentUser = computed(() => store.getters['user/user']); // Текущий авторизованный пользователь


    return {
      currentUser,
      ...props
    }
  },

  components: { AppFollowerCard }
})
</script>

<style scoped>
.followers-subscriptions{
  display: block;
  grid-column: 1 / 2;
  text-align: center;
  align-items: center;
  margin-bottom: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.followers-subscriptions-list{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: start; /* Все карточки выравниваются по верхней границе */
}

h3{
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