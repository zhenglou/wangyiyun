<template>
  <div class="ranking">
    <div class="ranking-list">
      <ul>
        <li class="ranking-item" v-for="item in rankingList" :key="item.id" @click="handleClick(item.id)">
          <div class="cover">
            <img width="100" height="100" v-img-lazy="item.coverImgUrl" />
          </div>
          <div class="info">
            <p class="name">{{ item.name }}</p>
            <p class="desc">{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getRankingList } from "@/api/ranking";
import { useRouter } from "vue-router"
let rankingList = ref([]),
    router = useRouter()
onMounted(() => {
  getRankingList()
    .then((res) => {
      rankingList.value = res.data.list;
      // console.log(rankingList.value);
    })
    .catch((err) => {
      console.log("排行榜获取出错", err);
    });
});
let handleClick = (id) => {
    // 携带id跳转到歌单详情页
    router.push(`/m/playList/${id}`)
}
</script>
<style lang="less" scoped>
.ranking {
  width: 100%;
  .ranking-list {
    margin: 0 20px;
    .ranking-item {
      display: flex;
      height: 100px;
      margin-top: 20px;
      &:last-child {
        padding-bottom: 20px;
      }
      .cover {
        width: 100px;
        height: 100px;
      }
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left: 20px;
        height: 100px;
        overflow: hidden;
        background: @main-light-background;
        color: @dark-color;
        .name {
          font-size: @font-size-medium;
        }
        .desc {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-small;
        }
      }
    }
  }
}
</style>
