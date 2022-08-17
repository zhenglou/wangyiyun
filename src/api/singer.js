import request from "@/utils/axios"

//请求热门歌手数据
export function getHotSinger(){
    return request({
      url:'/top/artists',
      method: 'get',
      params:{
        limit:30
      }
    })
} 

// 根据字母请求相同字母名称的歌手的数据
export function getSingerList(letter){
  return request({
    url:'/artist/list',
    method: 'get',
    params:{
      // 字母参数
      initial: letter,
      // initial: "b"  表示查询b开头的歌手的数据
      type: -1,
      area: 7
    }
  })
}

