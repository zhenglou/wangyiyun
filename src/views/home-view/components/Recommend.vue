<template>
  <div class="recommend">
    <div class="swipe-container">
      <van-swipe
        class="remd-swiper"
        :autoplay="3000"
        indicator-color="white"
        lazy-render
      >
        <van-swipe-item v-for="item in swiperImgList" :key="item">
          <img :src="item.imageUrl" alt="图片" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <section class="recommend-playlist">
      <div class="remd-header">
        <h3>推荐歌单</h3>
      </div>
      <ul class="remd-playlist">
        <li v-for="(item,index) in playlist" :key="index" @click="handleClickPlayList(item.id)">
          <img v-img-lazy="item.picUrl" alt="封面" class="cover">
          <p class="name">{{item.name}}</p>
        </li>
      </ul>
    </section>
    <section class="recommend-newsong">
      <div class="remd-header">
        <h3>新歌推荐</h3>
      </div>
      <ul class="remd-newsong">
        <li v-for="(item,index) in newSongList" :key="index" @click="addOneSong(item)">
          <img v-img-lazy="item.picUrl" alt="新歌封面" class="pic">
          <div class="info">
            <h4 class="name">{{item.name}}</h4>
            <p>
              <span v-for="(aItem,aIndex) in item.song.artists" :key="aIndex">
                {{aItem.name}}
              </span>
            </p>
          </div>
          <SvgIcon class="icon" iconFileName="player"/>
        </li>
      </ul>
    </section>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { getRecommendSwiper, getRecommendPlayList, getRecommendNewSong } from "@/api/recommend"
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
let store = useStore();
let router = useRouter();
let swiperImgList = reactive([]);
let playlist = reactive([]);
let newSongList = reactive([]);
onMounted(()=>{
  getSwiperImg();
  getPlayList();
  getNewSongList();
})
// 点击歌曲：添加一首歌到播放列表
function addOneSong({id, name, picUrl, song}){
  // {id, name,picUrl,artists:song.artists}
  // console.log();
  store.dispatch("addOneSong",{id, name,picUrl,ar:song.artists})
}
//请求轮播图片数据
let getSwiperImg = ()=>{
  getRecommendSwiper({type:2})
  .then(res =>{
    // console.log(res);
    swiperImgList.push(...res.data.banners);
  })
  .catch(err =>{
    // console.log(err);
  })
}
// 请求推荐歌单数据
let getPlayList = ()=>{
  getRecommendPlayList({limit:6})
  .then(res =>{
    // console.log(...res.data.result);
    playlist.push(...res.data.result);
  })
  .catch(err =>{
    console.log(err);
  })
}
// 请求推荐新歌数据
let getNewSongList = ()=>{
  getRecommendNewSong()
  .then(res =>{
    // console.log(res);
    newSongList.push(...res.data.result);
    // console.log(newSongList);
  })
  .catch(err =>{
    console.log("推荐请求轮播数据出错" + err);
  })
}
// 推荐歌单跳转详情页
let handleClickPlayList = (id) => {
  // console.log("新歌详情歌单id"+ id);
  router.push(`/m/playlist/${id}`)
}

</script>

<style lang="less" scoped>
.recommend {
  // padding-top: 88px;
  width: 100%;
  .remd-header {
    margin: 10px;
    h3 {
      height: 26px;
      font-size: @font-size-large;
      line-height: 2em;
      color: @light-color;
      letter-spacing: 0.12em;
      font-weight: bold;
    }
  }
}
.swipe-container {
  width: 100%;
  .remd-swiper {
    .van-swipe-item {
      img {
        width: 100%;
      }
    }
  }
}
.recommend-playlist {
  .remd-playlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    li {
      flex: 0 0 32%;
      max-width: 32%;
      margin: 10px 0;
      box-sizing: border-box;
      img {
        width: 100%;
        height: auto;
        border-radius: 10px;
      }
      p {
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 3em;
        line-height: 1.5em;
        color: @light-color;
        font-size: @font-size-small;
      }
    }
  }
}
.remd-newsong {
    margin:0 10px;
  li {
    position: relative;
    display: flex;
    height: 60px;
    margin-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    .pic {
      width: 56px;
      height: 56px;
      border-radius: 10px;
    }
    .info {
      overflow: hidden;
      flex: 1;
      margin-left: 12px;
      height: 100%;
      border-bottom: @dark-color-m solid 1px;
      h4 {
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        color: @light-color-m;
        font-size: @font-size-medium;
      }
      p {
        margin-top: 10px;
        color: @dark-color-m;
        font-size: @font-size-small;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
    }
    .icon{
        position: absolute;
        margin-top: auto;
        margin-bottom: auto;
        width: 24px;
        height: 24px;
        top: 0;
        bottom: 0;
        right: 0;
        font-size: 2em;
        color: @dark-color;
    }
  }
}
</style>

