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
    hideSubmit: false,
    curShow: true,
    noResumeList: false,
    chooseId: -1,

    isBack: false,
    student_id: '',
    resumes_id: undefined,
    jobId: undefined,

    page: 1,
    fliterType: 'job',
    // page 1
    resumeListArr: [],
    showLinkWeb: false
  },
  chooseResume (e) {
    let rId = e.currentTarget.dataset.id

    this.setData({
      chooseId: rId
    })
  },
  radioChange (e) {
    console.log(e.detail.value)
  },
  formSubmit() {
    if (this.data.chooseId !== -1) {
      this.setData({
        hideSubmit: true
      })
      wx.request({
        url: `${deliveryResume}`,
        data: {
          stu_id: app.globalData.student_id,
          token: app.globalData.token,
          resumes_id: this.data.chooseId,
          position_id: this.data.jobId
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: res => {
          wx.showToast({
            icon: 'none',
            title: res.data.errortip,
            duration: 1000
          })
          if (res.data.error == '0') {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else if (res.data.error == '1') {
            this.setData({
              showLinkWeb: true
            })
          }
          this.setData({
            hideSubmit: false
          })
        }
      })
    }
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
              resumeListArr: res.data.listjson
            })
            if (res.data.listjson.length == '0') {
              this.setData({
                showLinkWeb: true,
                noResumeList: !this.data.noResumeList
              })
            }
          } else if (error == '1') {
            this.setData({
              resumeListArr: [],
              showLinkWeb: true,
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
      jobId: options.id
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