Page({
  data: {},
  removeSearch () { console.log('remove') },
  linkToRecom () { 
    wx.navigateTo({
      url: '../jobRecommend/work',
    })
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})