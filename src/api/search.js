import request from "@/utils/axios"

//获取搜索结果
export function getSearchResult(keywords){
    return request({
      url:'/search',
      method: 'get',
      params:{
        keywords
      }
    })
} 
// 热门搜索词
export function getHotkeyword(){
    return request({
      url:'/search/hot',
      method:'get'
    })
}
// 推荐歌词placehoder
export function getDefaultKeyword(){
  return request({
    url:'/search/default',
    method:'get'
  })
}