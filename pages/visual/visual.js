Page({
  data: {
    swiperIndex: 0,
    // indicatorDots: true,
    autoplay: true,
    canautoplay: true,
    circular: true,
    interval: 5000,
    duration: 300,
    imgUrls: [
      'https://static.dazhao100.cn/pic/1514342891l592025878.png',
      'https://static.dazhao100.cn/pic/1528698094l338683272.png',
      'https://static.dazhao100.cn/pic/1528683179l389784958.png'
    ],
    list: [
      { img: 'https://static.dazhao100.cn/pic/1526907753l016152041.png', title: 'UI设计中的插画与情感化hahhahahhhhahah' },
      { img: 'https://static.dazhao100.cn/pic/1526907753l016152041.png', title: 'UI设计中的插画与情感化hahhahahhhhahah' },
      { img: 'https://static.dazhao100.cn/pic/1526907753l016152041.png', title: 'UI设计中的插画与情感化hahhahahhhhahah'}
    ]
  },
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  linkToChild () {
    wx.navigateTo({
      url: '../courseChild/course?id=78'
    })
  },
  linkToMore (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../visualChild/vchild?id=${id}`
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