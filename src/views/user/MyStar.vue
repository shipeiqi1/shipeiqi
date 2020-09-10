<template>
  <div class="star">
    <hm-header>我的收藏</hm-header>
    <div class="list">
      <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getStarList()
  },
  methods: {
    async getStarList() {
      const res = await this.$axios.get('/user_star')
      //   console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        // console.log(this.list)
        this.list.forEach(item => {
          item.comment_length = item.comments.length
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  .info {
    flex: 1;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .uesr {
      color: #666;
      font-size: 14px;
      span:first-child {
        margin-right: 10px;
      }
    }
  }
  .img {
    img {
      width: 120px;
      height: 74px;
      object-fit: cover;
    }
  }
}
</style>
