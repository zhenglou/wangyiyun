<template>
  <div class="p-progress-inner" ref="proBarWrapRef"  @click="handleClickProgress">
    <!-- 当前已经播放过得进度条 -->
    <div class="p-progress-play" ref="proBarPlayRef" :style="proPlayStyle">
      <!-- 滑块 -->
      <div 
      class="slider"
      @touchstart.prevent="touchStartProgress"
      @touchmove.prevent="touchMoveProgress"
      @touchend.prevent="touchEndProgress"
      :style="sliderStyle"
      >
        <i class="slider-btn" ref="sliderBtnRef" ></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { offset } from '@better-scroll/shared-utils';
// 当前播放时间
// const currentTime = ref(0)
//总时长
// const duration = ref(0)
const props = defineProps(["progressRatio"])
const emits = defineEmits(["progressMove","progressEnd"])
const touch = {}
const offsetW = ref(0) /* 偏移量 */
//play进度条
const proBarPlayRef = ref(null)
const proPlayStyle = computed(()=> `width:${offsetW.value}px`)
//滑块
const sliderBtnRef = ref(null)
const sliderStyle = computed(()=> `transform:translateX(${offsetW.value}px)`)
// 进度条容器
const proBarWrapRef = ref(null)
const proBarWrapWidth = ref(0)

// 获取进度条容器总宽度
onMounted(()=>{
  proBarWrapWidth.value = proBarWrapRef.value.offsetWidth - sliderBtnRef.value.offsetWidth
})
watch(()=>props.progressRatio,(newRatio)=>{
    offsetW.value = props.progressRatio * proBarWrapWidth.value
})
function touchStartProgress(e){
  touch.x1 = e.touches[0].pageX
  touch.initW = proBarPlayRef.value.offsetWidth

}
function touchMoveProgress(e){
  let xDiff = e.touches[0].pageX - touch.x1
  offsetW.value = xDiff + touch.initW
  //边界限制
  offsetW.value = Math.max(0,Math.min(offsetW.value, proBarWrapWidth.value))
  // 移动中，设置audio的currentTime  为 play宽度对应的时间值
  let progressRatio = offsetW.value / proBarWrapWidth.value
  emits("progressMove",progressRatio)

}
// 手指离开
function touchEndProgress(e){
  let progressRatio = offsetW.value / proBarWrapWidth.value
  // 移动中，设置audio的currentTime  为 play宽度对应的时间值
  emits("progressEnd",progressRatio)

}
// 点击进度条时
function handleClickProgress(e){
  console.log( proBarWrapWidth.value);
  let offsetWidth = Math.min(e.offsetX, proBarWrapWidth.value)
  let progressRatio = offsetWidth / proBarWrapWidth.value
  emits("progressEnd", progressRatio)

}

</script>

<style lang="less" scoped>
.p-progress-inner {
  position: relative;
  flex: 1;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  .p-progress-play {
    position: absolute;
    width: 0;
    height: 100%;
    background: #f0d0e0;
  }
  // 滑块
  .slider {
    position: absolute;
    left: -7px;
    top: -13px;
    width: 30px;
    height: 30px;
    .slider-btn{
        position: absolute;
        top: 7px;
        left: 7px;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        box-sizing: border-box;
        border-radius: 8px;
        background: @light-color;
    }
  }
}

</style>
