module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // 1rem的大小
      // 1rem大小需要设置为37.5  并且量出来的大小也要 /2
      rootValue: 37.5,
      // 把哪些属性的px转成rem
      propList: ['*']
    }
  }
}
