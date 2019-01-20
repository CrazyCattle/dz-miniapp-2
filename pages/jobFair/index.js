import {
  ZphList
} from '../../api.js'

const app =getApp()

Page({
  data: {
    list: [],
    keyword: '',
    page: 1,
    showLoading: false,
    canLoadingMore: true
  },
  searchKeyword (e) {
    let keyword = e.detail.value.trim()
    if (this.data.keyword != keyword) {
      this.setData({
        page: 1
      })
      this.setData({
        keyword,
        list: [],
        canLoadingMore: true,
        showLoading: true
      })
      this.getZphList()
    }
  },
  linkToDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobFairDetail/detail?id=${id}`
    })
  },
  getZphList () {
    if (this.data.canLoadingMore) {
      this.setData({
        showLoading: true,
        canLoadingMore: false
      })
      wx.request({
        url: `${ZphList}`,
        data: {
          keyword: this.data.keyword,
          nums: 10,
          p: this.data.page
        },
        success: res => {
          if (res.data.error == 0) {
            this.setData({
              page: ++this.data.page,
              canLoadingMore: true,
              list: this.data.list.concat(res.data.listjson)
            })
          } else {
            this.setData({
              canLoadingMore: false,
              page: this.data.page-1 > 1 ? --this.data.page:1
            })
          }
          this.setData({
            showLoading: false
          })
        }
      })
    }
  },
  lower () {
    wx.showNavigationBarLoading();
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.getZphList()
      wx.hideNavigationBarLoading()
    }, 1000)
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