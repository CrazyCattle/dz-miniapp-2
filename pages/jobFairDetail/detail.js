import {
  getZphOne,
  getZphCompanyList
} from '../../api.js'

const app =getApp()

Page({
  data: {
    changeType: '1',
    details: '',
    companyNums: 0,
    companyList: []
  },
  exchange (e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      changeType: type
    })
  },
  linkJobList () {
    wx.navigateTo({
      url: '../jobFairSearch/search'
    })
  },
  linkToDetail () {
    wx.navigateTo({
      url: '../jobFairCompanyDetail/detail'
    })
  },
  getZplDetail (id) {
    wx.request({
      url: `${getZphOne}`,
      data: { id },
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            details: res.data.listjson
          })
        }
      }
    })
  },
  getZplCompanyList(id) {
    wx.request({
      url: `${getZphCompanyList}`,
      data: {
        id,
        p: 1,
        nums: 10
      },
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            companyNums: res.data.companynum,
            companyList: this.data.companyList.concat(res.data.listjson)
          })
        }
      }
    })
  },
  onLoad: function (options) {
    let id = options.id
    this.getZplDetail(id)
    this.getZplCompanyList(id)
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})