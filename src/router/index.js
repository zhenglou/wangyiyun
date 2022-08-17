import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "@/views/home-view/index"
const routes = [
    {
      name:'Root',
      path:'/',
      component:Home,
      redirect:'/m'
    },
    {
      name:'Home',
      path:'/m',
      redirect:'/m/recommend',
      component:Home,
      children:[
        {
          name:'Ranking',
          path:'ranking',
          component:()=> import("@/views/home-view/components/Ranking.vue")     
        },
        {
          name:'Recommend',
          path:'recommend',
          component:()=> import("@/views/home-view/components/Recommend.vue")     
        },
        {
          name:'Search',
          path:'search',
          component:()=> import("@/views/home-view/components/Search.vue")     
        },
        {
          name:'Singer',
          path:'singer',
          component:()=> import("@/views/home-view/components/Singer.vue")     
        }
      ]
      
    },
    {
      name:'PlayList',
      path:'/m/playList/:id',
      component:()=> import("@/views/PlayList")
    },
    {
      name:'SingerDetail',
      path:'/m/singerDetail/:id',
      component:()=> import("@/views/SingerDetail.vue")
    }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router
