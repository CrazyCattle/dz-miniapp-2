import {
  WxRegLogin,
  getLessonShare
} from "../../api";

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    cId: undefined,
    fromId: undefined,
    password: '',
    mobile: ''
  },
  iptPwd(e) {
    if (e.detail.value) {
      this.setData({
        password: e.detail.value.trim()
      });
    }
  },
  setPassword() {
    if (this.data.password) {
      if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/.test(this.data.password)) {
        wx.showLoading()
        wx.request({
          url: `${WxRegLogin}`,
          data: {
            mobile: this.data.mobile,
            mobilecode: this.data.code,
            password: this.data.password
          },
          success: res => {
            if (res.data.error == 0) {
              wx.hideLoading()
              console.log(res, 'success')
              const { listjson } = res.data
              wx.showToast({
                title: res.data.errortip,
                icon: "none",
                duration: 1000
              });

              wx.setStorageSync("student_id", (app.globalData.student_id = listjson.student_id));
              wx.setStorageSync("token", (app.globalData.token = listjson.token));
              wx.setStorageSync("loginType", 'userlogin');
              app.globalData.loginType = 'userlogin'

              let timer = setTimeout(() => {
                wx.reLaunch({
                  url: '../navMe/me'
                })
                clearTimeout(timer)
              }, 300)
            }
          }
        })
      } else {
        wx.showToast({
          title: '密码请输入8-12位数字和字母组合',
          icon: "none",
          duration: 1000
        });
      }
    } else {
      wx.showToast({
        title: '请先输入密码',
        icon: "none",
        duration: 1000
      });
    }
  },

  onLoad: function (options) {
    let code = options.code
    let mobile = options.mobile
    if (code && mobile) {
      this.setData({
        code: code,
        mobile: mobile
      })
    } else {
      wx.reLaunch({
        url: '../navIndex/index'
      })
    }
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
})