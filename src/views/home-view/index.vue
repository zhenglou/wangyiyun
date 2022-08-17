<template>
  <div class="home">
    <div class="m-topbar">
      <SvgIcon class="icon" iconFileName="music"></SvgIcon>
      <h1 class="title">Music</h1>
    </div>
    <!-- <div class="m-tabs-container">
      <van-tabs v-model:active="active">
        <van-tab title="推荐">
          <Recommend/>
        </van-tab>
        <van-tab title="歌手">
          <Singer/>
        </van-tab>
        <van-tab title="排行">
          <Ranking/>
        </van-tab>
        <van-tab title="搜索">
          <Search/>
        </van-tab>
      </van-tabs>
    </div> -->
    <div class="m-tab-container">
      <nav class="m-tab-header">
        <router-link :to="{name:'Recommend'}">推荐</router-link>
        <router-link :to="{name:'Singer'}">歌手</router-link>
        <router-link :to="{name:'Ranking'}">排行</router-link>
        <router-link :to="{name:'Search'}">搜索</router-link>
      </nav>
      <div class="m-tab-panel">
        <router-view></router-view>
      </div>
    </div>
    




  </div>
</template>
<script setup>
// import { ref } from 'vue';
// import Ranking from './components/Ranking.vue';
// import Recommend from './components/Recommend.vue';
// import Search from './components/Search.vue';
// import Singer from './components/Singer.vue';
// const active = ref(0);
</script>
<style lang="less" scoped>
.m-topbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: @light-color;
  background-image: linear-gradient(@topbar-gradient 10%, @main-background);
  font-size: @font-size-oversized;
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
  h1{
    font-weight: bold;
  }
}

.m-tab-container {
  position: relative;
  .m-tab-header {
    position: fixed;
    top: 44px;
    left: 0;
    width: 100%;
    z-index: 99;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    line-height: 30px;
    background-color: @main-background;
    a {
      border-bottom: 2px solid transparent;
      color: @dark-color;
      &.router-link-active {
        color: @light-color;
        border-bottom: 2px solid @light-color;
      }
    }
  }
  .m-tab-panel {
    width: 100%;
    padding-top: 88px;
  }
}


// .m-tab-container{
//   // 覆盖vant样式
//   /deep/ .van-tabs{
//     .van-tabs__nav{
//       background-color: @main-background;
//     }
//     .van-tab{
//       color: @dark-color;
//     }
//     .van-tab--active{
//       color: @light-color;
//     }
//     .van-tabs__line{
//       background: @light-color;
//     }
//   }
// }
</style>


