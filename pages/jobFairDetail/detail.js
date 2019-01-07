// pages/jobFairDetail/detail.js
Page({
  data: {
    changeType: '1'
  },
  exchange (e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      changeType: type
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