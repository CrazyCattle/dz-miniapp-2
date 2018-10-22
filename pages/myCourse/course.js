import {
  getCollect
} from '../../api.js'

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util'

const app = getApp()

Page({
  data: {
    curpage: 1,
    list: [],
    canLoadMore: true,
    showLoading: true,
    showTips: false,
  },
  lower() {
    const _self = this
    if (_self.timer) {
      clearTimeout(_self.timer)
    }
    _self.timer = setTimeout(() => {
      _self.initGetData()
    }, 500)
  },
  initGetData () {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    if (this.data.canLoadMore) {
      this.setData({
        showLoading: true
      })
      wx.request({
        url: `${getCollect}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=${this.data.curpage}`,
        success: res => {
          console.log(res)
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.initGetData()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == '0') {
              let data = res.data.listjson
              if (data.length > 0) {
                if (data.length == 10) {
                  this.setData({
                    curpage: ++this.data.curpage,
                    canLoadMore: true
                  })
                } else {
                  this.setData({
                    canLoadMore: false
                  })
                }
                this.setData({
                  showLoading: false,
                  list: this.data.list.concat(data)
                })
              } else {
                this.setData({
                  showTips: !this.data.showTips
                })
              }
            }
          }
        }
      })
    }
  },
  onLoad: function (options) {
    this.initGetData()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})