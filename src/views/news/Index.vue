<template>
  <div class="index">
    <!-- 头部 -->
    <div class="header">
      <div class="logo">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="bgc">
        <div class="search" @click="$router.push('/search')">
          <span class="iconfont iconsearch"></span>
          <span>搜索新闻</span>
        </div>
      </div>
      <div class="user" @click="$router.push('/user')">
        <span class="iconfont iconwode"></span>
      </div>
    </div>
    <!-- tab栏 -->
    <van-sticky class="more-sticky">
      <div class="more" @click="$router.push('/manage')">
        <span class="iconfont iconlianjie"></span>
      </div>
    </van-sticky>
    <!-- tab栏管理 -->
    <van-tabs v-model="active" sticky animated swipeable>
      <van-tab :title="tab.name" v-for="tab in tablist" :key="tab.id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="onLoad"
          >
            <hm-post :post="item" v-for="item in newList" :key="item.id"></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      // 默认显示的栏目
      active: 0,
      // 栏目数据
      tablist: [],
      // 文章数据
      newList: [],
      // 请求的页码
      pageIndex: 1,
      // 请求的数据条数
      pageSize: 5,
      // 加载状态
      loading: false,
      // 是否加载完成
      finished: false,
      // 关闭上拉刷新
      refreshing: false
    }
  },
  // 缓存组件激活的时候触发
  activated() {
    console.log('index组件激活')
  },
  // 缓存组件不激活的时候触发
  deactivated() {
    console.log('index未激活')
  },
  created() {
    console.log('index创建成功')
    this.getTabList()
  },
  destroyed() {
    console.log('index销毁')
  },
  methods: {
    async getTabList() {
      // 请求前,调取本地存储中的数据
      const tablist = JSON.parse(localStorage.getItem('activeList'))
      // 判断如果本地有数据,优先加载本地的数据
      if (tablist) {
        this.tablist = tablist
        this.getNewList(this.tablist[0].id)
        return
      }
      // 发送请求,获取头部导航的数据
      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tablist = data
        // 继续发送Ajax请求获取文章的详情,需要携带加载项的id
        this.getNewList(this.tablist[0].id)
      }
    },
    // 获取新闻列表
    async getNewList(id) {
      // 发送请求获得新闻数据
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      // console.log(data, statusCode)
      if (statusCode === 200) {
        if (this.pageIndex === 1) {
          this.newList = []
        }
        this.newList = [...this.newList, ...data]
        // console.log(this.newList)
        // 数据加载完成,需要把loading改成false
        // 解决只加载一次数据
        this.loading = false

        // 修改刷新的数据状态防止一直刷新
        this.refreshing = false

        // 判断数据库是否还有更多数据
        // 如果添加到data中的新数据小于请求的条数就禁止触发onload事件
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        // 加载下一页的数据
        this.pageIndex++
        // 发送axios请求,得到当前页的数据
        this.getNewList(this.tablist[this.active].id)
      }, 1000)
    },
    // 下拉刷新
    onRefresh() {
      // 1.清空之间的数据
      this.newList = []
      // 2.重置请求数据为第一页
      this.pageIndex = 1
      // 3.修改下拉加载的finished为false,防止不加载数据
      this.finished = false
      // 4.把loading修改为true,防止下拉刷新无数据,重复加载数据
      this.loading = true
      // 5.重新发送axiso请求
      setTimeout(() => {
        // 重新加载当前分类下的数据
        this.getNewList(this.tablist[this.active].id)
        // console.log(this.tablist[this.active].id)
      }, 1000)
    }
  },
  watch: {
    // 监视tab栏的active变化
    active(value) {
      // 当tab的值发生变化,就代表我们需要重新获取新的数据了
      // 1.清空之前的数组
      this.newList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      setTimeout(() => {
        // 获取当前栏目的数据
        this.getNewList(this.tablist[value].id)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 50px;
  align-items: center;
  background-color: #ff0000;
  .user {
    position: relative;
    width: 55px;
    text-align: center;
    span {
      font-size: 25px;
      color: #fff;
    }
  }
  .logo {
    color: #ffffff;
    width: 70px;
    padding-left: 10px;
    span {
      font-size: 50px;
    }
  }
  .bgc {
    flex: 1;
  }
}
.search {
  height: 36px;
  line-height: 36px;
  background-color: #ff8080;
  border-radius: 18px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  span:first-child {
    margin-right: 5px;
  }
}

/deep/ .van-tabs__wrap {
  width: 85%;
}
.more {
  width: 15%;
  height: 44px;
  position: absolute;
  right: 0;
  z-index: 999;
  background-color: #fff;
  text-align: center;
  line-height: 44px;
}
.more-sticky {
  /deep/ .van-sticky--fixed {
    z-index: 100;
  }
}
</style>
