import {
  getZphOne,
  getZphCompanyList
} from '../../api.js'

const app =getApp()

const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    id: '',
    changeType: '1',
    details: '',
    companyNums: 0,
    contDetails: '',
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
      url: `../jobFairSearch/search?id=${this.data.id}`
    })
  },
  linkToDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobFairCompanyDetail/detail?id=${id}&zphId=${this.data.id}`
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
            details: res.data.listjson,
            contDetails: res.data.listjson.detail
          })
          wx.setNavigationBarTitle({
            title: this.data.details.name
          })
          WxParse.wxParse('article1', 'html', this.data.contDetails, this, 5);
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
    this.setData({ id })
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