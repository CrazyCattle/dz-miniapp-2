import {
  getResumeOne,
  sendEmail
} from '../../api';

import {
  setNewToken,
  initLoginStatus
} from '../../utils/util';

const app = getApp()
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

Page({
  data: {
    resumes_id: '',
    imgurl: ''
  },
  getResumeDetail(id) {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    wx.request({
      url: `${getResumeOne}`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        resumes_id: id,
        stu_id: app.globalData.student_id,
        token: app.globalData.token
      },
      success: res => {
        console.log(res)
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.getResumeDetail(id)
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (res.data.error == '0') {
            const { imgurl } = res.data.listjson
            _self.setData({
              imgurl
            })
          }
        }
      }
    })
  },
  prewResumeImg() {
    wx.previewImage({
      urls: [this.data.imgurl]
    })
  },
  onLoad: function (options) {
    let id = options.resumes_id
    this.setData({
      resumes_id: id
    })
    this.getResumeDetail(id)
  },
  onReady: function () { },
  onShow: function () { }
})