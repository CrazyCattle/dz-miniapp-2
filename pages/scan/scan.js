import {
  ZphScanList
} from '../../api.js'

const app = getApp()

Page({
  data: {},
  linkToScandetail () {
    // wx.navigateTo({
    //   url: '../scanDetail/detail'
    // })
    wx.scanCode({
      success: res => {
        console.log(res)
        if (res.errMsg == 'scanCode:ok') {
          const { result } = res
          this.loginWebsite(result)
        }
      }
    })
  },
  loginWebsite (params) {
    wx.request({
      url: `${ZphScanList}`,
      data: {
        sessionid: params,
        account: app.globalData.stud_info.account
      },
      success: res => {
        wx.showToast({
          title: res.data.errortip,
          icon: 'none',
          duration: 1000
        })
        // if (res.data.error == 0) {}
      }
    })
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})