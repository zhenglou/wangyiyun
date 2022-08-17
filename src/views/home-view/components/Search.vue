<template>
 <div class="search">
        <div class="search-inner">
            <SvgIcon class="icon" iconFileName="search"/>
            <input type="text" class="search-input" v-model="query" :placeholder="placeholder">
        </div>
        <div class="hot-topics" v-if="searchResult.length <= 0">
            <h3 class="title" @click="text">热门搜索</h3>
            <ul class="hotlist">
                <li v-for="(item, index) in hotKeywords" :key="index" @click="changeQuery(item.first)">
                    {{item.first}}
                </li>
            </ul>
        </div>
        <div class="search-result">
            <Scroll class="scroll-wrap">
                <ul>
                    <li v-for="item in searchResult" :key="item.id" @click="addOneSong(item)">
                        <span>{{item.name}}</span>
                        - 
                        <span v-for="(aItem, index) in item.artists" :key="index">
                            {{aItem.name}}&nbsp;
                        </span>
                    </li>
                </ul>
            </Scroll>
        </div>
    </div>
</template> 
<script setup>
import { watch, ref, onMounted} from "vue"
import {getSearchResult, getHotkeyword,getDefaultKeyword} from "@/api/search"
import {getSongDetail} from "@/api/songs"
import Scroll from "@/components/Scroll.vue"
import { useStore } from "vuex";
const store = useStore()
let query = ref(""),
    searchResult = ref([]),
    hotKeywords = ref([]),
    placeholder = ref("");

function text(){
  console.log(111);
}
function changeQuery(q){
  // console.log();
    query.value = q
}
// function changeQuery(q){
//   query.value = q
// }
// 点击歌曲：添加一首歌到播放列表
function addOneSong({id}){
  // {id, name,picUrl,artists:song.artists}
  // console.log();

  getSongDetail(id)
  .then(res=>{
    let {id, name, al, ar} = res.data.songs[0]
    store.dispatch("addOneSong",{id, name,picUrl:al.picUrl, ar})
  })
  .catch(err =>{
    console.log("获取歌曲详细信息失败");
  })
}
onMounted(()=>{
// 获取推荐的搜索词placeholder
  getDefaultKeyword()
  .then(res=>{
    placeholder.value = res.data.data.showKeyword
    // console.log(res);
  })
  .catch(err=>{
    console.log(err,"获取默认热门歌曲失败");
  })
// 获取热门歌曲
  getHotkeyword()
  .then(res=>{
    hotKeywords.value = res.data.result.hots
    // console.log(res);
  })
  .catch(err=>{
    console.log(err,"获取热门歌曲失败");
  })
})
watch(()=>query.value,(newVal)=>{
  // console.log(newVal);
  newVal = newVal.trim()
  if(!newVal) return searchResult.value=[]
  getSearchResult(newVal)
  .then(res=>{
    // console.log(res);
    searchResult.value = res.data.result.songs
  })
  .catch(err=>{
    console.log("请求搜索结果出错",err);
  })
})
</script>

<style lang='less' scoped>
.search{
    position: relative;
    padding: 10px 20px;
    .search-inner{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: 0 6px;
        height: 32px;
        background: #6d5b77;
        border-radius: 6px;
        .icon{
            width: 16px;
            height: 16px;
            color: hsla(0,0%,100%,.2);
        }
        .search-input{
            flex: 1;
            margin: 0 6px;
            line-height: 18px;
            background: #6d5b77;
            color: #fff;
            font-size: 14px;
            outline: 0;
            &::-webkit-input-placeholder{
                color: hsla(0,0%,100%,.2);
            }
        }
    }
    .hot-topics{
        margin-top: 20px;
        .title{
            margin-bottom: 20px;
            font-size: 14px;
            color: hsla(0,0%,100%,.8);
        }
        .hotlist > li{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: #6d5b77;
            font-size: 14px;
            color: hsla(0,0%,100%,.5);
        }
    }
    .search-result{
        width: 100%;
        // height: 200px;
        overflow: hidden;
        color: hsla(0,0%,100%,.5);
        .scroll-wrap{
            width: 100%;
            height: calc(100vh - 130px);
            overflow: hidden;
        }
        li{
            // overflow: hidden;
            padding: 5px 30px;
            height: 25px;
            font-size: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>