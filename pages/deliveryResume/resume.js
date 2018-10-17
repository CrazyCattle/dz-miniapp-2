import {
  resumeList,
  deliveryResume
} from '../../api';

import {
  setNewToken,
  initLoginStatus
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    website: '',
    curShow: true,
    noResumeList: false,

    isBack: false,
    student_id: '',
    resumes_id: undefined,
    jobId: undefined,

    page: 1,
    fliterType: 'job',
    // page 1
    resumeList: [],
  },
  checkboxChange (e) {
    console.log(e.detail.value)
  },
  formSubmit(e) {
    console.log(e.detail.value, e.detail.formId)
    const id = e.detail.value.id
    const formId = e.detail.formId
    wx.request({
      url: `${deliveryResume}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        resumes_id: id,
        position_id: this.data.jobId,
        form_id: formId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          wx.showToast({
            icon: 'none',
            title: res.data.errortip,
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else if (res.data.error == '1') {
          wx.showToast({
            icon: 'none',
            title: res.data.errortip,
            duration: 1000
          })
        }
      }
    })
  },
  linkResume(e) {
    let resumes_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../resume/resume?resumes_id=${resumes_id}`,
    })
  },
  deliveryResume(e) {
    let resumes_id = e.currentTarget.dataset.id
    wx.request({
      url: `${deliveryResume}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        resumes_id: resumes_id,
        position_id: this.data.jobId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          wx.showToast({
            icon: 'none',
            title: res.data.errortip,
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else if (res.data.error == '1') {
          wx.showToast({
            icon: 'none',
            title: res.data.errortip,
            duration: 1000
          })
        }
      }
    })
  },
  getResume() {
    let loginType = wx.getStorageSync('loginType')
    let _self = this

    wx.request({
      url: `${resumeList}`,
      method: 'POST',
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res)
        const { error } = res.data

        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.getResume()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (error == '0') {
            this.setData({
              resumeList: res.data.listjson
            })
            if (res.data.listjson.length == '0') {
              this.setData({
                noResumeList: !this.data.noResumeList
              })
            }
          } else if (error == '1') {
            this.setData({
              resumeList: [],
              noResumeList: !this.data.noResumeList
            })
          }
        }
      },
      fail: res => {
        throw Error(res)
      },
      complete: res => {
        // res
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      jobId: options.id,
      website: wx.getStorageSync('schoolInfo').enter_stu_url
    })
    if (!!app.globalData.student_id) {
      this.setData({
        student_id: app.globalData.student_id
      })
      this.getResume()
    } else {
      this.setData({
        noResumeList: !this.data.noResumeList
      })
    }
  }
})