<template>
  <div class="singer">
      <Scroll class="scroll-plane" ref="scrollRef" :probeType="3" @scroll="handleScrollView">
        <ul class="singer-list" ref="groupRef">
          <li 
          class="singer-list-group"
          v-for="item in singerList"
          :key="item.tag"
          >
            <h3 class="group-title">{{item.tag}}</h3>
            <ul style="padding-bottom:5px;">
              <li 
              class="group-item"
              v-for="sItem in item.singerInfo"
              :key="sItem.id"
              @click="handleClick(sItem.id)"
              >
                <div class="avatar">
                  <img v-img-lazy="sItem.picUrl" :alt="sItem.name">
                  <!-- <img src="" alt=""> -->
                </div>
                 <span class="name">{{sItem.name}}</span>
              </li>
            </ul>
          </li> 
        </ul>
      </Scroll>
      <div class="index-bar">
        <ul>
          <li
            v-for="(item,index) in singerList"
            :key="item.tag"
            :data-index="index"
            :class="{current: currentIndex=== index}"
            @touchstart.prevent.stop = "handleTouchStart($event,index)"
            @touchmove.prevent.stop = "handleTouchMove($event,index)"
          >
            {{item.tag}}
          </li>
        </ul>
      </div>
  </div>
</template>
<script setup>
import Scroll from "@/components/Scroll.vue";
import { getHotSinger, getSingerList } from "@/api/singer";
import { onMounted, reactive, ref, watch, nextTick} from "vue";
import { useRouter } from "vue-router";
let singerList = handleAchor();
let scrollRef = ref(null);
let groupRef = ref(null); // ul 
let touchPosition = {};
let currentIndex = ref(0);
let tempArr = reactive([]);
let allGroupItemHeight = ref([]);
let router = useRouter();
//当触摸到索引栏某个字母，跳到指定位置
function handleTouchStart(e,index){
  // console.log(e,index);
  scrollTo(index)
  touchPosition.y1 = e.touches[0].pageY
  touchPosition.anchorIndex = index;
}
function scrollTo(i){
  i = Math.max(0,Math.min(i, groupRef.value.children.length - 1))
  currentIndex.value = i;
  let targetElement = groupRef.value.children[i]
  let scroll = scrollRef.value.scroll
  scroll.scrollToElement(targetElement,300)
}
// 当手指栏触摸的同时上下滚动
  
function handleTouchMove(e){
    touchPosition.y2 = e.touches[0].pageY
    let moveIndex = Math.floor((touchPosition.y2 - touchPosition.y1) / 20)
    // console.log("sadasd"+moveIndex);
    moveIndex += touchPosition.anchorIndex;
    scrollTo(moveIndex)
    
}

function handleScrollView(y){
  y = -y;
  // console.log(y);
  allGroupItemHeight.value.forEach((itemY,i) =>{
    let nextItemY = allGroupItemHeight.value[i+1]
    if(y>=itemY && y<nextItemY){
      currentIndex.value = i
    }
  })
}

function handleAchor(){
  let arr = reactive([{tag: "热"}]);
  for(let i = 65; i< 91; i++){
    arr.push({tag: String.fromCharCode(i)})
  }
  // console.log(arr);
  return arr;
}

//点击歌手跳转歌手的详情页
function handleClick(id){
  // console.log(id);
  router.push(`/m/singerDetail/${id}`)
}

watch(()=> tempArr.length, async()=>{
  //等待页面更新完毕
  await nextTick()
  let allGroupLi= groupRef.value.children;
  // console.log(allGroupLi);
  let initHeight = 0;
  // 临时存储每个列表组的坐标区间
  let temp =[initHeight]
  for(let i = 0; i<allGroupLi.length; i++){
    temp.push(initHeight += allGroupLi[i].offsetHeight)
  }
  allGroupItemHeight.value = temp
})
// scrollRef.value.offect
onMounted(()=>{
  singerList.forEach(item =>{
    if(item.tag == "热"){
      getHotSinger()
      .then(res =>{
        // console.log("热",res);
        item.singerInfo = res.data.artists;
        tempArr.push(item.singerInfo)
      })
      .catch(err =>{
        console.log(err);
      })
    }
    else{
      getSingerList(item.tag)
      .then(res =>{
        // console.log("字母",res);
        item.singerInfo = res.data.artists;
        tempArr.push(item.singerInfo)

      })
      .catch(err =>{
        console.log(err);
      })
    }
  })
  // console.log(singerList);
})
</script>

<style lang="less" scoped>
.singer {
  .scroll-plane{
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 88px);
  }
  // 索引栏
  .index-bar {
    position: fixed;
    top: 50%;
    right: 10px;
    z-index: 999;
    width: 18px;
    background-color: @sidebar-background;
    transform: translateY(-50%);
    color: @dark-color;
    border-radius: 18px;
    li {
      height: 20px;
      font-size: @font-size-mini;
      line-height: 20px;
      text-align: center;
      box-sizing: border-box;
    }
    .current {
      color: @light-color;
    }
  }
  .singer-list {
    .singer-list-group {
      .group-title {
        padding-left: 16px;
        height: 2em;
        line-height: 2em;
        font-size: @font-size-mini;
        color: @dark-color;
        background: @sidebar-background;
      }
      .group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          overflow: hidden;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        span.name {
          margin-left: 20px;
          color: @dark-color;
          font-size: @font-size-small;
        }
      }
    }
  }
}
</style>

