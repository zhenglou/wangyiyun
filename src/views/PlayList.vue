<template>
    <div class="m-playlist">
        <SvgIcon class="iconNav" iconFileName="back" @click="$router.go(-1)"></SvgIcon>
        <section class="m-p-header">
           <img class="p-header-bg" :src="playListData.coverImgUrl" alt="背景图"> 
           <div class="p-header-container">
                <div class="p-h-cover">
                    <img :src="playListData.coverImgUrl" alt="背景图">
                    <p class="play-count">
                        <SvgIcon class="icon" iconFileName="music2"/>
                        {{handlePlayCount(playListData.playCount)}}
                    </p>
                </div>
                <!-- 文本描述 -->
                <div class="p-h-text-info">
                    <h2 class="name">{{playListData.name}}</h2>
                    <p class="creator">
                        <img :src="creatorInfo.avatarUrl" :alt="creatorInfo.nickname" class="avatar">
                        {{creatorInfo.nickname}}
                    </p>
                </div>
           </div>
        </section>
        <!-- 歌曲列表 -->
        <!-- <section class="m-p-songs">
            <p class="songs-subtit">
                <svg-icon class="icon" iconFileName="player"/>
                <span>顺序播放全部 ({{songsData.length}})</span>
            </p>
            <ul class="songs-list" v-loading="loading">
                <li class="songs-item" v-for="(item, index) in songsData" :key="index">
                    <p class="order">{{index+1}}</p>
                    <div class="content">
                        <h4 class="name">{{item.name}}</h4>
                        <p class="desc">
                            <span v-for="(aItem, i) in item.ar" :key="aItem.id">
                                {{aItem.name}} &nbsp;
                            </span>
                        </p>
                    </div>
                </li>
            </ul>
        </section> -->
    
        <SongsList :songsData="songsData"/>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { onMounted, reactive, ref } from "vue";
import { getPlaylistDetail } from "@/api/recommend"
import { getSongDetail } from "@/api/songs"
import SongsList from "@/components/SongList.vue"
let route = useRoute()
let playListData = ref({})
let creatorInfo = ref({})
let songsData = reactive([])
// let loading = computed(() => songsData.length <= 0)

onMounted(()=>{
    getPlaylist()
})

// 获取歌单的详情数据
let getPlaylist = () => {
    getPlaylistDetail(route.params.id)
    .then(res => {
        // console.log("歌单详情数据", res);
        playListData.value = res.data.playlist
        creatorInfo.value = res.data.playlist.creator
        // 存有歌曲id的数组
        let trackIds = res.data.playlist.trackIds
        trackIds.length = Math.min(30, trackIds.length)
        // console.log(trackIds);
        getSongs(trackIds)
    })
    .catch(err => {
        console.log("请求歌单详情出错", err);
    })
}

// 根据id批量请求歌曲的信息
let getSongs = (trackIds) => {
    let ids = [];
    trackIds.forEach(item => ids.push(item.id))

    // setTimeout(() => {
    // },3000)
    // 携带参数，发起请求
    getSongDetail(ids.toString())
    .then(res => {
        // console.log(res);
        songsData.push(...res.data.songs)
    })
    .catch(err => {
        console.log("批量获取歌曲对象出错", err);
    })
}

// 处理播放数字的单位
let handlePlayCount = (count) => {
    if(count >= 10000 && count < 100000000){ //超过1万并且小于1亿
        return (count/10000).toFixed()+"万"
    }else if(count >= 100000000){ //超过1亿
        return (count/100000000).toFixed()+"亿"
    }else{
        return count
    }
}


</script>

<style lang='less' scoped>
.m-playlist{
     .iconNav{
        position: absolute;
        top: 6px;
        left: 6px;
        z-index: 99;
        width: 22px !important;
        height: 22px !important;
        color: #f0d0e0;
    }
    .m-p-header{
        position: relative;
        height: 186px;
        .p-header-bg{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            // 模糊
            filter: blur(20px);
            -webkit-filter: blur(20px);
        }
        .p-header-container{
            display: flex;
            justify-content: space-between;
            height: 126px;
            padding: 30px 10px 30px 15px;
            box-sizing: border-box;
            .p-h-cover{
                position: relative;
                width: 32%;
                img{
                    width: 100%;
                    height: auto;
                }
                .play-count{
                    position: absolute;
                    right: 0;
                    top: 0;
                    padding: 2px;
                    color: @light-color-m;
                    background-color: rgba(0,0,0,.2);
                    font-size: @font-size-mini;
                    .icon{
                        width: 12px;
                        height: 12px;
                    }
                }
            }
            .p-h-text-info{
                width: 65%;
                .name{
                    display: -webkit-box;
                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    height: 3em;
                    line-height: 1.5em;
                    color: @light-color-m;
                    font-size: @font-size-medium;
                    margin-bottom: 16px;
                }
                .creator{
                    overflow:hidden;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                    color: @dark-color;
                    img{
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
    // .m-p-songs{
    //     margin: 10px;
    //     .songs-subtit{
    //         margin-bottom: 10px;
    //         line-height: 30px;
    //         font-size: @font-size-medium;
    //         color: @light-color;
    //         .icon{
    //             width: 26px;
    //             height: 26px;
    //             vertical-align: middle;
    //         }
    //         span{
    //             vertical-align: middle;
    //             margin-left: 4px;
    //         }
    //     }
    //     .songs-item{
    //         display: flex;
    //         align-items: center;
    //         box-sizing: border-box;
    //         height: 64px;
    //         .order{
    //             width: 30px;
    //             height: 30px;
    //             font-size: @font-size-large;
    //             color: @dark-color-m;
    //         }
    //         .content{
    //             width: 90%;
    //             h4.name{
    //                 font-size: @font-size-medium;
    //                 color: @light-color-m;
    //                 margin-bottom: 6px;
    //             }
    //             p.desc{
    //                 font-size: @font-size-small;
    //                 color: @dark-color;
    //                 overflow:hidden;
    //                 white-space:nowrap;
    //                 text-overflow:ellipsis;
    //             }
    //         }
    //     }
    // }
}
</style>