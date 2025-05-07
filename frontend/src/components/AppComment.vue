<template>
<div class="comment">
  <div class="comment-header">
    <img :src="avatar ? `${mediaUrl}${avatar}` : require('@/assets/icons/profile.png')" alt="Фото автора" class="avatar"/>
    <div class="user-info">
      <span class="username"><a :href="`/profile/${user_id}`" title="Перейти в профиль автора">{{ username }}</a></span>
      <span class="timestamp">{{ timestamp }}</span>
    </div>
  </div>
  <div class="comment-body">
    {{ text }}
  </div>
  <app-button
      v-if="isMyComment"
      @click="$emit('delete')"
  >Удалить</app-button>
</div>
</template>

<script>
import {computed, defineComponent, onMounted, props, ref} from "vue";
import store from "@/store/store";
import AppButton from "@/components/AppButton.vue";

export default defineComponent({
  components: { AppButton },
  props: {
    user_id: {
      type: Number,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: null
    }
  },
  emits: ['delete'],
  setup(props) {
    const mediaUrl = computed(() => store.getters.mediaUrl);

    const isMyComment = computed(() =>{
      return store.getters["user/user"].username === props.username;
    });

    return {
      mediaUrl,
      isMyComment
    };
  }
})
</script>

<style scoped>
.comment {
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  background-color: #fff;
  margin-bottom: 16px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 1px solid #ccc;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: #333;
}

/* Ссылка на профиль автора рецепта */
.username a {
  text-decoration: none;
  color: #333;
}

.username a:hover {
  border-bottom: 1.5px dashed #FF9973;
  color: #FF9973;
}

.username a:active {
  border-bottom: 1.5px dashed #ff5722;
  color: #ff5722;
}

.timestamp {
  font-style: italic;
  color: #888;
  font-size: 0.85rem;
}

.comment-body {
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
  margin-bottom: 12px;
}

.comment-actions {
  text-align: right;
}
</style>