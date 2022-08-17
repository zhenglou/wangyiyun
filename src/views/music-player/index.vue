<template>
  <div class="player" v-if="musicPlayList.length">
    <transition name="player">
      <div class="player-transition" v-show="fullScreen">
        <div class="bg-cover">
          <img :src="currentSong.picUrl" :alt="currentSong.name">
        </div>
        <div class="player-header"> 
          <SvgIcon iconFileName="back" class="icon back" @click="cancelFullScreen"></SvgIcon>
          <div class="hgroup">
            <h2 class="title">{{currentSong.name}}</h2>
            <h3>
              <span v-for="item in currentSong.ar" :key="item.name">
                {{item.name}}&nbsp;
              </span>
            </h3>
          </div>
        </div>
        <div class="song-wrap">
          <!-- 水平滚动区域 -->
          <div class="song-wrap-l" :class="{showBlock: showCdBlock}" @click="toggleBlock">
            <div class="record-disc">
              <div class="rotate" :class="isRotate">
                <img :src="currentSong.picUrl" :alt="currentSong.name">
              </div>
            </div>
            <!-- 当行歌词 -->
            <div class="song-lyric">{{playLyric}}</div>
          </div>
          <Scroll class="song-wrap-r" :class="{showBlock: !showCdBlock}" @click="toggleBlock" ref="lyricScrollRef">
            <div class="lyric-block" ref="lyricBlockRef">
              <p 
              v-for="(item, index) in currentLyric" 
              :key="index" 
              :class="{active: index===currentLineNum}"
              >
              {{item.lyric}}
              </p>
            </div>
          </Scroll>
          
        </div>
        <div class="player-footer">
          <div class="player-progress">
            <span class="time playtime">{{formatTime(currentTime)}}</span>
            <Progress :progressRatio="progressRatio" @progressMove="progressMove" @progressEnd="progressEnd"/>
            <span class="time endtime">{{formatTime(duration)}}</span>
          </div>
          <div class="player-controller">
            <SvgIcon @click="changeMode"  class="icon" :iconFileName="modeIcon"/>
            <SvgIcon @click="prevPlay"  class="icon" iconFileName="prev"/>
            <SvgIcon @click="togglePlayState"  class="icon" :iconFileName="playIcon"/>
            <SvgIcon @click="nextPlay"  class="icon" iconFileName="next"/>
            <SvgIcon  class="icon" iconFileName="heart"/>
          </div>
        </div>

      </div> 
    </transition>
    <PlayerBar 
      :progressRatio="progressRatio" 
      :togglePlayState="togglePlayState" 
      :nextPlay="nextPlay"
      :changeMode="changeMode"
      :modeInfo="{modeText,modeIcon}"
    />
  </div>  
  <audio 
  ref="audioRef" 
  @canplay="audioReady"
  @timeupdate="timeUpdate"
  @ended="playEnd"
  >
  </audio> 
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { getSongUrl } from "@/api/songs"
import { formatTime } from "@/utils/format"
import Progress from "@/views/music-player/components/Progress.vue"
import initPlayControl from "./js/playController"
import PlayerBar from "./components/PlayerBar.vue"
import initLyric from"./js/playLyric.js"


let store = useStore();
let audioRef = ref(null)
// let isRotate = ref("play")
let duration = ref(0) //MP3的总时长
let currentTime = ref(0) //当前播放时间
// 时间进度比
let progressRatio = computed(()=>{
  if(!audioRef.value) return 0
  // console.log(progressRatio);
  return currentTime.value/duration.value
})
 
let {togglePlayState, nextPlay, prevPlay, changeMode, modeText, modeIcon} = initPlayControl(audioRef)
let {currentLyric, playLyric, currentLineNum, lyricScrollRef, lyricBlockRef, startOperationLyric, stopOperationLyric} = initLyric(currentTime)


let musicPlayList = computed(()=> store.state.musicPlayList)  //当前播放列表
let currentSong = computed(()=> store.getters.currentSong)   // 获取当前播放的歌曲信息
let fullScreen = computed(()=> store.state.fullScreen)  //全屏状态
let playMode = computed(()=> store.state.playMode)  //全屏状态
let showCdBlock = ref(true)


// 取消播放器的全屏状态
function cancelFullScreen(){
  store.commit("setFullScreen", false)
}
function audioReady(){
  duration.value = audioRef.value.duration
  // console.log("准备就绪");
}
// 当播放时间变化触发该事件
function timeUpdate(){
  currentTime.value = audioRef.value.currentTime
  // console.log(currentTime.value);
}
// 在进度条上移动时
function progressMove(newRatio){
  // 当进度条移动时音乐暂停
  if(playing.value) store.commit("setPlayingState",false)
  audioRef.value.currentTime = currentTime.value = newRatio * duration.value
  stopOperationLyric()
}
// 结束在进度条上的操作
function progressEnd(newRatio){
  if(!playing.value) store.commit("setPlayingState",true)
  audioRef.value.currentTime = currentTime.value = newRatio * duration.value
  stopOperationLyric()
  startOperationLyric()
}

function playEnd(){
  audioRef.value.currentTime = 0
  // store.commit("setPlayingState",false)
  if(playMode.value === 1){
    // 单曲循环
    audioRef.value.play()
    store.commit("setPlayingState", true)
    stopOperationLyric(),
    startOperationLyric()
    
  }else{
    nextPlay()
  }
}
// 切换左右屏幕
function toggleBlock(){
  showCdBlock.value = !showCdBlock.value
}

let playing = computed(()=>store.state.playing);  //播放状态
let playIcon = computed(()=>playing.value ? "pause" : "play") //唱片形状
let isRotate = computed(()=>playing.value ? "play" : "pause")  //是否旋转唱片


// 监听播放状态
watch(playing,(newState)=>{
  if(newState){
    stopOperationLyric()
    startOperationLyric()
  }else{
    stopOperationLyric()
  }
})
watch(currentSong, (newSong)=>{
  // console.log("监听歌曲对象", newSong);
  getSongUrl(newSong.id)
  .then(res=>{
    const musicUrl = res.data.data[0].url
    // console.log(musicUrl);
    audioRef.value.src= musicUrl
    audioRef.value.play();
    store.commit("setPlayingState", true)
  })
  .catch(err=>{
    console.log("mp3获取失败");
  })
})


</script>

<style lang="less" scoped>
.player {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 199;

  // 过渡盒子的动画效果
  .player-transition {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: @main-background;
    &.player-enter-active,
    &.player-leave-active {
      transition: all 0.6s;
      .bg-cover,
      .player-header,
      .song-wrap,
      .player-footer {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.player-enter-from,
    &.player-leave-to {
      background: #fff;
      .player-header {
        transform: translateY(-100px);
      }
      .song-wrap {
        transform: scale(0);
      }
      .player-footer {
        transform: translateY(120px);
      }
    }
  }

  .bg-cover {
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(30px);
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .player-header {
    position: relative;
    overflow: hidden;
    height: 60px;
    padding-top: 10px;
    text-align: center;
    box-sizing: border-box;
    .icon.back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      padding: 9px;
      width: 22px;
      height: 22px;
      color: #f0d0e0;
      transform: rotate(-90deg);
    }
    & > * {
      width: 50%;
      margin: 0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    h2 {
      height: 30px;
      line-height: 30px;
      font-size: @font-size-large;
      color: #fff;
    }
    h3 {
      height: 20px;
      line-height: 20px;
      font-size: @font-size-medium;
      color: #969595;
    }
  }
  .song-wrap {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 190px);
    // cd唱片区块
    .song-wrap-l {
      position: absolute;
      top: 0;
      left: -200%;
      width: 100%;
      padding-top: 20px;
      //唱片圆盘
      .record-disc {
        overflow: hidden;
        // background-color: #fff;
        .rotate {
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          width: 70vw;
          height: 70vw;
          border-radius: 50%;
          border: 10px solid rgba(255, 255, 255, 0.1);
          animation: rotate 20s linear infinite;
          &.play {
            animation-play-state: running;
          }
          &.pause {
            animation-play-state: paused;
          }
          img {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          }
        }
      }
      // 歌词
      .song-lyric {
        overflow: hidden;
        width: 80%;
        margin: 30px auto 0 auto;
        text-align: center;
        line-height: 2em;
        font-size: @font-size-medium;
        // color: @dark-color;
        color: rgba(255, 255, 255, 0.5)
      }
    }
    // 歌词区块
    .song-wrap-r{
      position: absolute;
      left: -200%;
      top: 0;
      width: 100%;
      height: 100%;
      .lyric-block{
        text-align: center;
        font-size: @font-size-small;
        color: @dark-color;
        p{
          line-height: 30px;
        }
      }
      .active{
        color: #fff;
      }
    }
    .showBlock{
      left: 0;
    }
  }
  .player-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 30px;
    width: 80%;
    height: 100px;
    margin: 0 auto;
    // background-color: #fff;
    .player-progress {
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0 auto;
      padding: 10px 0;
      color: #fff;
      .playtime {
        margin-right: 20px;
      }
      .endtime {
        margin-left: 10px;
      }
    }

    .player-controller {
      display: flex;
      height: 60px;
      align-items: center;
      .icon {
        width: 32px;
        height: 32px;
        flex: 1;
        color: #f0d0e0;
      }
    }
  }
}
</style>


