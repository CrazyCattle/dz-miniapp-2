import {
  getSiteCityList
} from '../../api.js'

const app = getApp()

Page({
  data: {
    listjson: []
  },
  chooseCity (e) {
    let id = e.currentTarget.dataset.id
    let city = e.currentTarget.dataset.cnsite
    wx.setStorageSync('baseCity', city)
    wx.setStorageSync('baseCityId', id)

    app.globalData.baseCityId = id
    app.globalData.baseCity = city
    
    wx.reLaunch({
      url: '../navIndex/index',
    })
  },
  onLoad: function (options) {
    wx.request({
      url: `${getSiteCityList}`,
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          const { listjson } = res.data
          this.setData({
            listjson
          })
        }
      }
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})