import { defineAsyncComponent } from 'vue';

export const AppButton = defineAsyncComponent(() => import('./AppButton.vue'));
export const AppInput = defineAsyncComponent(() => import('./AppInput.vue'));
export const AppLoader = defineAsyncComponent(() => import('./AppLoader.vue'));
export const AppMessage = defineAsyncComponent(() => import('./AppMessage.vue'));
export const AppPage = defineAsyncComponent(() => import('./AppPage.vue'));
