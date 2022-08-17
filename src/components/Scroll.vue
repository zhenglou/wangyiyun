<template>
  <div ref="scrollRootRef">
    <slot></slot>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue"
// 滚动

import BScroll from "@better-scroll/core"
import ObserveDom from "@better-scroll/observe-dom"
BScroll.use(ObserveDom)
/**
 * 注意： 
 *  BScroll默认只处理容器的第一个子元素的滚动，其它的元素会被忽略
 *  监听的滚动的容器必须有固定的高度
 * 
 */
// 监听滚动的容器
let scrollRootRef = ref(null);
let scroll = ref(null)
let props = defineProps({
  probeType:{
    type: Number,
    default: 0
  },
  click: {
      type: Boolean,
      default: true
  }
})
let emit = defineEmits(["scroll"])
onMounted(()=>{
  //  arg1：要监听的滚动容器
  scroll.value = new BScroll(scrollRootRef.value, {
      observeDOM: true,
      // scrollY,
      // click:true,
      ...props,
    })
  if(props.probeType > 0){
    scroll.value.on("scroll",(position)=>{
      emit("scroll",position.y)
      // console.log(position);
    })
  }

})
// 点击索引栏上的字母锚点


onUnmounted(()=>{
    // 销毁
    scroll.value.destroy()
})

defineExpose({
  scroll
})
</script>
<style lang="less" scoped>
// div{
//   position: absolute;
//   top: 100px;
// }
</style>

