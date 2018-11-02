import {
  getResumeOne,
  sendEmail,
  ShareResumesOne
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
    imgurl: '',
    student_id: ''
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
            const { listjson } = res.data
            _self.setData({
              imgurl: listjson.imgurl,
              resumeTitle: listjson.title
            })
            console.log()
          }
        }
      }
    })
  },

  getShareResume () {
    wx.request({
      url: `${ShareResumesOne}`,
      data: {
        resumes_id: this.data.resumes_id,
        stu_id: this.data.student_id
      },
      success: res => {
        if (res.data.error == 0) {
          const { imgurl } = res.data.listjson
          this.setData({
            imgurl
          })
        }
      }
    })
  },

  onLoad: function (options) {
    let id = options.resumes_id
    let student_id = options.student_id || ''

    this.setData({
      resumes_id: id
    })

    if (student_id) {
      this.setData({
        student_id: student_id
      })
      this.getShareResume()
    } else {
      this.getResumeDetail(id)
    }
  },
  onShareAppMessage (e) {
    return {
      title: `<${this.data.resumeTitle}>_大招智能简历`,
      // imageUrl: '',
      path: `pages/resume/resume?resumes_id=${this.data.resumes_id}&student_id=${app.globalData.student_id}`,
      success: function (res) {
        console.log(res)
      }
    }
  }
})