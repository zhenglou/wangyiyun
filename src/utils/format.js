// 处理秒数, 返回 00 : 00格式
export function formatTime(time){
  time = time | 0
  // 转分钟
  let m = String((time / 60) | 0).padStart(2, 0) 

  // 转秒数
  let s = String(time % 60).padStart(2, 0) 

  return `${m}:${s} `
}
export function formatLyric(str){
  return str.split(/\n/).filter(item => item !== "").map((item)=>{
  let [, time, lyric] = item.split(/\[|\]/g)
  // 换算时间为秒速
  // console.log(time.split(':')[0]*60 + time.split(':')[1]);
  time = time.split(":").reduce((a,b)=>a*60+b*1)
  // console.log({time, lyric});
  return{time, lyric}
  })
  // console.log();
}