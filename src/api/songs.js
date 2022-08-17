import request from '@/utils/axios'



// 根据请求歌曲
export function getSongDetail(ids){
    return request({
      url:'/song/detail',
      method:'get',
      params:{
        ids
      }
    })
}

// 根据歌手详情信息
export function getSingerDetail(id){
  return request({
    url:'/artist/detail',
    method:'get',
    params:{
      id
    }
  })
}
//请求歌手的全部歌曲
export function getSingerAllSongs(id){
  return request({
    url:'/artist/top/song',
    method:'get',
    params:{
      id,
      // limit:30
    }
  })
}
// export function getSingerAllSongs(id){
//   return request({
//     url:'/artist/songs',
//     method:'get',
//     params:{
//       id,
//       limit:30
//     }
//   })
// }
// 请求MP3
export function getSongUrl(id){
  return request({
    url:'/song/url',
    method:'get',
    params:{
      id,
      // limit:30
    }
  })
}
// 请求歌词
export function getLyric(id){
  return request({
    url:'/lyric',
    method:'get',
    params:{
      id,
      // limit:30
    }
  })
}
