import {
  getMydropinboxOne,
  setInterviewState
} from '../../api';

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    id: undefined,
    details: null,
    showBtns: true,
    showTips: -1
  },
  getDropboxDetail () {
    wx.request({
      url: `${getMydropinboxOne}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        id: this.data.id
      },
      success: res => {
        if (res.data.error == 0) {
          this.setData({
            details: res.data.listjson
          })
        }
      }
    })
  },
  handleSubmit (e) {
    let type = e.currentTarget.dataset.type
    let opid = e.currentTarget.dataset.opid
    console.log(e.currentTarget, type, opid)

    wx.request({
      url: `${setInterviewState}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        id: this.data.id,
        isInterview: type,
        type: opid
      },
      success: res => {
        wx.showToast({
          title: res.data.errortip,
          icon: 'none',
          duration: 1000
        })
        if (res.data.error == 0) {
          this.setData({
            showBtns: false,
            showTips: opid
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
    this.getDropboxDetail()
  },
  onShow: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {}
})