import request from "@/utils/axios"

export function getRecommendSwiper(parmas){
  return request({
    url:'/banner',
    method:'get'  ,
    parmas
  })
}
//推荐歌单
export function getRecommendPlayList(params){
  return request({
    url:'/personalized',
    method:'get',
    params
  })
} 

// 推荐新歌列表数据
export function getRecommendNewSong(){
  return request({
    url:'/personalized/newsong',
    method:'get',
    params:{
      limit:6
    }
  })
} 

// 获取playlist中的数据
export function getPlaylistDetail(id){
  return request({
    url:'/playlist/detail',
    method:'get',
    params:{
      id
    }
  })
} 
