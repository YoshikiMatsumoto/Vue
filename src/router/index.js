import Vue from 'vue';
import Router from 'vue-router';
import HomeView  from '../views/Home.vue';
import MapDisplay from '../components/MapDisplay.vue';
Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/map',
    name: 'MapDisplay',
    component: MapDisplay
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
