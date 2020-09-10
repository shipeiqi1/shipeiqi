<template>
  <div class="search">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="goBack">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="search-conter">
        <span class="iconfont iconsearch"></span>
        <input
          type="search"
          placeholder="请输入搜索关键字"
          v-model="key"
          @keyup.enter="search"
          @input="recommend"
        />
      </div>
      <div class="right">
        <span @click="search">搜索</span>
      </div>
    </div>
    <!-- 搜索提示 -->
    <div class="recomend-list" v-if="recommendList.length">
      <div
        class="item one-txt-cut"
        v-for="item in recommendList"
        :key="item.id"
        @click="goSearch(item.title)"
      >{{item.title}}</div>
    </div>

    <!-- 渲染点击搜索后获得的数据 -->
    <div class="list" v-else-if="list.length">
      <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
    </div>

    <!-- 记录 -->
    <div class="record" v-else>
      <!-- 历史记录 -->
      <div class="history">
        <h4>历史记录</h4>
        <div class="items">
          <div
            class="item one-txt-cut"
            v-for="item in history"
            :key="item"
            @click="goSearch(item)"
          >{{item}}</div>
        </div>
      </div>

      <hr class="hr1" />

      <!-- 热门搜索 -->
      <div class="hot">
        <h4>热门搜索</h4>
        <div class="items">
          <div
            class="item one-txt-cut"
            v-for="item in hot"
            :key="item"
            @click="goSearch(item)"
          >{{item}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '../../utils/tool'
export default {
  data() {
    return {
      key: '',
      // 请求的数据
      list: [],
      // 本地的数据
      history: [],
      // 热点数据
      hot: [],
      // 推荐数据列表
      recommendList: []
    }
  },
  // 页面创建请求本地数据和热点数据
  created() {
    // 如果没有历史记录,保证是一个空数组
    this.history = JSON.parse(localStorage.getItem('history')) || []
    // 假设发送了axios请求,获取到了数据
    this.hot = ['关晓彤', '华为', '情火', '姑娘', '了']
  },
  methods: {
    // 点击搜索发送请求
    async search() {
      if (!this.key) return this.$toast('请输入关键字')
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.key
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        console.log(this.list)
      }

      // 把key添加到缓存中
      // 1.如果原来有这个历史记录,删除即可
      // 2.添加到数组的前面
      this.history = this.history.filter(item => item !== this.key)
      this.history.unshift(this.key)
      localStorage.setItem('history', JSON.stringify(this.history))

      // 清空推荐
      this.recommendList = []
    },
    //   点击箭头回退
    goBack() {
      if (this.key) {
        this.key = ''
        this.recommendList = ''
      } else {
        this.$router.back()
      }
    },
    // 点击历史记录进行搜索
    goSearch(item) {
      // 接受传过来的item,赋值给搜索框
      this.key = item
      // 发送请求
      this.search()
    },
    // 搜索框绑定事件,防抖节流
    // eslint-disable-next-line space-before-function-paren
    recommend: debounce(async function () {
      if (this.key === '') return
      const res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.key
        }
      })
      // console.log(this.key)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.recommendList = data
        console.log(this.recommendList)
      }
    }, 1000)
  },
  //  监听input的内容,当值为空隐藏搜索的资料
  watch: {
    key(value) {
      if (value === '') {
        this.list = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #000;
  .search-conter {
    flex: 1;
    display: flex;
    position: relative;
    span {
      position: absolute;
      top: 12px;
      left: 18px;
    }
    input {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      border: 1px solid #ccc;
      padding-left: 35px;
      font-size: 16px;
    }
  }

  .left {
    width: 40px;
    text-align: center;
  }
  .right {
    width: 40px;
    text-align: center;
  }
}
.hr1 {
  margin: 10px 0;
}
.record {
  padding: 15px;
  h4 {
    padding-bottom: 5px;
  }
  .items {
    overflow: hidden;
    text-align: center;
    .item {
      float: left;
      width: 200px;
      height: 28px;
      font-size: 12px;
      margin: 5px;
      padding: 5px;
      width: 50px;
      border: 1px solid #ccc;
      background-color: #ddd;
    }
  }
}
.recomend-list {
  padding: 0 10px;
  .item {
    border-bottom: 1px solid #ccc;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
}
</style>
