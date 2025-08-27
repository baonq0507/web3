import { createApp } from "vue";
// import "./style.css";
import Antd from 'ant-design-vue';
import App from "./App.vue";
import { createPinia } from 'pinia';
import 'ant-design-vue/dist/reset.css';
import router from "@/router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(Antd).use(router).mount("#app");
