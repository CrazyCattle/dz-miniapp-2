import {
  getStuClassLimit,
  SubVisitorer,
  getStuVisitorer,
  getSClass,
  classTwoLesson
} from '../../api.js'

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

    courseDetails: {},
    isShared: false,
    hasPower: false,
    shareTimes: 0
  },
  linkCourse (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: `../courseChild/course?id=${id}`,
    })
  },
  getLesson () {
    let loginType = wx.getStorageSync('loginType')
    wx.request({
      url: `${getStuClassLimit}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&class_id=${this.data.cId}`,
      success: res => {
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                this.getLesson()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (res.data.error == 0) {
            console.log(res, 111)
            const data = res.data.listjson
            if (data.share_islimits == 1) {
              this.setData({
                hasPower: true,
                shareTimes: data.share_times
              })
            } else {
              this.setData({
                hasPower: false,
                shareTimes: data.share_times
              })
            }
          }
        }
      }
    })
  },
  getCourseDetail () {
    wx.request({
      url: `${classTwoLesson}?class_id=${this.data.cId}`,
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            courseDetails: res.data.listjson
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cId: options.id
    })
    if (!options.stuId) {
      this.getLesson()
    } else {
      this.setData({
        isShared: true
      })
    }

    this.getCourseDetail()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})