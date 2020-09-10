<template>
  <div>
    <div class="zhanwei"></div>
    <div class="hm-header">
      <div class="back" @click="back">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="title">
        <slot></slot>
      </div>
      <div class="extra"></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.zhanwei {
  height: 50px;
  width: 100%;
}
.hm-header {
  position: fixed;
  top: 0;
  background-color: #fff;
  z-index: 999;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}
.title {
  flex: 1;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
}
.back,
.extra {
  text-align: center;
  width: 50px;
}
</style>
