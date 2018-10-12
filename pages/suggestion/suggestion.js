import {
  feedback
} from '../../api';

import {
  setNewToken,
  initLoginStatus
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    suggestion: ''
  },
  suggest(e) {
    this.setData({
      suggestion: e.detail.value.trim()
    })
  },
  submitSuggest() {
    if (!!this.data.suggestion) {
      this.uSuggest()
    } else {
      wx.showToast({
        title: '请填写建议内容',
        icon: "none",
        duration: 1000
      });
    }
  },
  uSuggest() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    wx.request({
      url: `${feedback}`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        stu_id: app.globalData.student_id,
        content: this.data.suggestion,
        token: app.globalData.token
      },
      success: res => {
        const data = res.data
        if (data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.uSuggest()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (data.error == '0') {
            wx.showToast({
              title: data.errortip,
              icon: "none",
              duration: 1000
            });
            let timer = setTimeout(() => {
              wx.reLaunch({
                url: '../navMe/me'
              })
              clearTimeout(timer)
            }, 300)
          }
        }
      }
    })
  },
  onLoad: function (options) {

  }
})