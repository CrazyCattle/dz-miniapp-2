import {
  ZphList
} from '../../api.js'

const app =getApp()

Page({
  data: {
    list: []
  },
  linkToDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobFairDetail/detail?id=${id}`
    })
  },
  getZphList () {
    wx.request({
      url: `${ZphList}`,
      data: {
        nums: 10,
        p: 1
      },
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            list: this.data.list.concat(res.data.listjson)
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.getZphList()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})