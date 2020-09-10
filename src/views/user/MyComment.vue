<template>
  <div class="comment">
    <hm-header>我的评论</hm-header>
    <div class="list">
      <!-- 下拉加载和上拉刷新 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onLoad"
        >
          <div class="item" v-for="item in list" :key="item.id">
            <div class="time">{{item.create_date|time('YYYY-MM-DD HH:mm')}}</div>
            <div class="commeent" v-if="item.parent">
              <div class="name">回复:{{item.parent.user.nikename}}</div>
              <div class="comment-content">{{item.parent.content}}</div>
            </div>
            <div class="content">{{item.content}}</div>
            <div class="origin">
              <span
                class="one-txt-cut"
                @click="$router.push(`/post-detail/${item.post.id}`)"
              >原文:{{item.post.title}}</span>
              <span class="iconfont iconjiantou1"></span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      // 当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 5,
      // 代表加载状态,如果loading为true 的时候,代表list组件正在加载数据,onload事件就不在触发
      // 带滚动到底部 触发onload事件的时候,自动会发loading改为true,防止重复请求数据
      loading: false,
      // 代表是否结束 false代表后台还有数据, true代表没有更多数据了
      // finished默认应该为false,但是如果后台没有更多数据了,应该吧finisshed改成true
      finished: false,
      refreshing: false
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      // 通过axios的get请求发送的参数必须放到params中或者拼接到url地址中
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      //   console.log(res.data)
      // 获取到后台的数据解构判断
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        data.reverse()
        // 展开运算符,拼接数据,用于解决请求的数据覆盖问题
        this.list = [...this.list, ...data]
        // console.log(this.list)

        // 出现不加载问题,因为加载完成后loading为true,不在触发load事件
        this.loading = false

        // 出现后台数据加载完毕,重复加载但是没有新数据问题
        // 需要进行判断,如果没有更多数据,需要把finisshed改成true
        if (data.length < this.pageSize) {
          // 表示加载已完成不在触发onload事件
          this.finished = true
        }

        // 把下拉的状态改成false,解决一直刷新问题
        this.refreshing = false
      }
    },
    onLoad() {
      // 每次下拉加载下一页的数据
      setTimeout(() => {
        this.pageIndex++
        this.getCommentList()
      }, 1000)
    },
    onRefresh() {
      setTimeout(() => {
        // 下拉刷新需要清除原来的数据,因为不清除就会数据冲突
        this.list = []
        // 防止后台没有数据
        this.finished = false
        // 防止刷新时没有数据重复触发onload事件
        this.loading = true
        // 重新发送请求加载第一页的数据
        this.pageIndex = 1
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.item {
  padding: 15px;
  border-bottom: 1px solid #ccc;
  .time {
    font-size: 16px;
    color: #666;
  }
  .commeent {
    background-color: #ddd;
    .name {
      font-size: 14px;
    }
    .comment-content {
      font-size: 16px;
      line-height: 40px;
    }
  }
  .content {
    font-size: 16px;
    line-height: 36px;
  }

  .origin {
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
}
</style>
