<template>
  <div class="fillow">
    <hm-header>我的关注</hm-header>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$base + item.head_img" alt />
        </div>
        <div class="content">
          <p class="name">{{item.nickname}}</p>
          <p class="time">{{item.create_date|time}}</p>
        </div>
        <div class="right">
          <van-button type="primary" round size="small" @click="unfollow(item.id)">取消关注</van-button>
        </div>
      </div>
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
    this.getFollowList()
  },
  methods: {
    async getFollowList() {
      const res = await this.$axios.get('/user_follows')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        console.log(this.list)
      }
    },
    async unfollow(id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要取关该用户吗?'
        })
      } catch {
        return this.$toast('取消操作')
      }
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast(message)
        this.getFollowList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.item {
  height: 80px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  .left {
    width: 50px;
    height: 50px;
    margin: 0 15px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    flex: 1;
    .name {
      font-size: 16px;
    }
    .time {
      color: #666;
    }
  }
  .right {
    margin: 15px;
  }
}
</style>
