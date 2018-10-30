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
      // if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(e.detail.value)) {
      //   wx.showToast({
      //     title: '密码请输入6-12位数字和字母组合',
      //     icon: "none",
      //     duration: 1000
      //   });
      // } else {
      //   this.setData({
      //     password: e.detail.value.trim()
      //   });
      // }
      this.setData({
        password: e.detail.value.trim()
      });
    }
  },
  setPassword () {
    if (this.data.password) {
      wx.request({
        url: `${WxRegLogin}`,
        data: {
          mobile: this.data.mobile,
          password: this.data.password
        },
        success: res => {
          console.log(res, 'success')
          if (res.data.error == 0) {
            const { listjson } = res.data
            wx.showToast({
              title: res.data.error,
              icon: "none",
              duration: 1000
            });

            wx.setStorageSync("student_id", (app.globalData.student_id = listjson.student_id));
            wx.setStorageSync("token", (app.globalData.token = listjson.token));
            wx.setStorageSync("loginType", 'userlogin');
            app.globalData.loginType = 'userlogin'
            wx.showLoading()
            this.setShareLimit()
          }
        }
      })
    } else {
      wx.showToast({
        title: '请先输入密码',
        icon: "none",
        duration: 1000
      });
    }
  },

  setShareLimit () {
    wx.request({
      url: `${getLessonShare}?token=${app.globalData.token}&stu_id=${app.globalData.student_id}&class_id=${this.data.cId}`,
      success: res => {
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                this.setShareLimit()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          let timer = setTimeout(() => {
            wx.navigateTo({
              url: `../share/share?id=${this.data.cId}&from_student_id=${this.data.fromId}`
            })
            clearTimeout(timer)
          }, 150)
        }
      }
    })
  },

  onLoad: function (options) {
    if (options.cId && options.fromId && options.mobile) {
      this.setData({
        cId: options.cId,
        fromId: options.fromId,
        mobile: options.mobile
      })
    } else {
      wx.reLaunch({
        url: '../navIndex/index'
      })
    }
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})