import {createApp} from 'vue';
import {createPinia} from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import {createBootstrap} from 'bootstrap-vue-next';
import App from './App.vue';
import './styles/main.scss';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.config.performance = true;
app.use(createBootstrap());
app.use(pinia);
app.mount('#app');