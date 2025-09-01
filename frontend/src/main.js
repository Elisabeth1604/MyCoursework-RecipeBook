import { createApp } from 'vue';
import App from './App.vue';

import router from './router/router';
import store from './store/store';

import MainLayout from '@/layout/MainLayout.vue';
import CommonFormLayout from '@/layout/CommonFormLayout.vue';

import '@/assets/css/style.css';
import { initializeAuthStore } from '@/store/modules/auth.module';
import './plugins/axios-response-interceptor';

const app = createApp(App);

app.component('main-layout', MainLayout);
app.component('common-form-layout', CommonFormLayout);

app.use(store);
app.use(router);

initializeAuthStore(store);

app.mount('#app');
