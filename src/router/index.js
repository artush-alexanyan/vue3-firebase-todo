import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "TodoHome",
    component: () =>
      import(/* webpackChunkName: "todo-home" */ "@/todos/TodoHome.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
