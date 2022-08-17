import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { getLyric } from "@/api/songs"
import { formatLyric } from "@/utils/format";
export default function(currentTime){
  const store = useStore()
  const currentSong = computed(()=> store.getters.currentSong)
  const currentLyric = ref([])
  const playLyric = ref("") // 当前播放的高亮单词
  const currentLineNum = ref(0)
  let lyricScrollRef = ref(null)
  let timer = null
  let lyricBlockRef = ref(null)
  // const currentTime = ref()
  // 监听 currentSong 变化， 请求歌词
  watch(currentSong, (newSong)=>{
    if(!newSong.id) return
    getLyric(newSong.id)
    .then(res=>{
      // console.log(res);
      currentLyric.value = formatLyric(res.data.lrc.lyric)
      stopOperationLyric()
      // currentTime = 0
      // console.log(currentLyric);
      //开始定时获取高亮的歌词
      startOperationLyric()
      
    })
    .catch(err=>{
      console.log(err);
    })
  })
  watch(()=> currentLineNum.value, (newNum)=>{
    // 滚动到下一句歌词位置
    // console.log(newNum);
    scrollRunning(newNum)
  })
  // 开始运作高亮单词
  function startOperationLyric(){
    if(currentLyric.value.length > 0){
      // console.log(11111);
      getInitCurrentLyric()
      timedUpdateLyric()
    }
  }
  // 关闭定时器
  function stopOperationLyric(){
    clearTimeout(timer)
  }
  // 定时更新歌词
  function timedUpdateLyric(){
    let cLyricValue = currentLyric.value // 歌词数组
    let index = currentLineNum.value // 当前行数

    // 如果只剩下最后一项不再开启定时器
    if(index >= cLyricValue.length - 1) return currentLineNum.value = cLyricValue.length - 1
    // 下一句歌词触发更新的时间  下一行歌词的播放时间 - 当前播放时间
    let delay = cLyricValue[index+1]?.time - currentTime.value
    // console.log(delay);
      timer = setTimeout(()=>{
        // 限制index
        index = Math.min(index + 1, cLyricValue.length - 1)
        currentLineNum.value = index
        // 设置当前播放的高亮单词
        playLyric.value = cLyricValue[index].lyric

        // 开启下一行的定时器
        timedUpdateLyric()
    }, delay * 1000)
  }
  // 初始化需要高亮的歌词
  function getInitCurrentLyric(){
    let cLyricValue = currentLyric.value,
        cTimeVal = currentTime.value,
        index = 0, // 高亮的行数
        len = cLyricValue.length;
        // console.log(cLyricValue);
        for(let i =0; i<len; i++){
          if(cTimeVal >= cLyricValue[i].time && (cTimeVal < cLyricValue[i+1]?.time || i === len -1)){
            index = i
            console.log(i);
            break
          }
        }
        playLyric.value = cLyricValue[index].lyric
        currentLineNum.value = index
  }   
  // 滚动动画  到下一句歌词
  function scrollRunning(num){
    if(num > 5){
      const targetEle = lyricBlockRef.value.children[num - 5]
      // 滚动到指定元素的位置
      lyricScrollRef.value.scroll.scrollToElement(targetEle, 1000)
  }else{
      // 不发生滚动
      lyricScrollRef.value.scroll.scrollTo(0, 0, 1000)
  }
  }

  return{
    currentLyric, 
    playLyric, 
    currentLineNum, 
    lyricScrollRef, 
    lyricBlockRef,
    startOperationLyric,
    stopOperationLyric 
  }
}


