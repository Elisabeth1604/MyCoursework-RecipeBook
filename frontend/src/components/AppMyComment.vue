<template>
  <div class="comment-item">
    <img
        class="comment-recipe-image"
        :src="comment.recipe.main_photo ? `${mediaUrl}${comment.recipe.main_photo}` : require('@/assets/images/fallback.jpg')"
        alt="Фото рецепта"
    />
    <div class="comment-content">
      <router-link :to="`/recipe-page/${comment.recipe.id}`" class="recipe-title">
        {{ comment.recipe.recipe_title }}
      </router-link>
      <p class="comment-text">{{ comment.text }}</p>
      <span class="comment-date">{{ new Date(comment.created_at).toLocaleDateString('ru-RU') }}</span>
    </div>
    <app-button @click="$emit('delete')">Удалить</app-button>
  </div>
</template>

<script>
import {computed, defineComponent} from "vue";
import AppButton from "@/components/AppButton.vue";
import store from "@/store/store";

export default defineComponent({
  components: { AppButton },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  emits: ['delete'],
  setup(props) {
    const mediaUrl = computed(() => store.getters.mediaUrl);

    return {
      mediaUrl,
    };
  }
})
</script>

<style scoped>
.comment-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  background: #fff;
}
.comment-recipe-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}
.comment-content {
  flex-grow: 1;
}
.recipe-title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  text-decoration: none;
}
.recipe-title:hover {
  border-bottom: 1.5px dashed #FF9973;
  color: #FF9973;
}

.recipe-title:active {
  border-bottom: 1.5px dashed #ff5722;
  color: #ff5722;
}
.comment-text {
  margin: 5px 0;
  color: #555;
}
.comment-date {
  font-size: 0.85em;
  color: #888;
}
</style>