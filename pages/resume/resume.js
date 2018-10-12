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
    sendResumeBox: false,
    resumes_id: '',
    SendTitle: '',
    truename: '',
    sendEmail: '',
    fromEmail: '',
    sendTxt: '脚步网络科技有限公司HR，您好！我是应聘贵公司房地产招商专员的求职者招妹。我曾做过大招世纪广场投资有限公司的招商招商专员，同同时也做过大招企业发展有限公司的销',
    imgurl: ''
  },
  iptTitle(e) {
    let SendTitle = e.detail.value.trim()
    this.setData({
      SendTitle
    })
  },
  iptName(e) {
    let truename = e.detail.value.trim()
    this.setData({
      truename
    })
  },
  iptReEmail(e) {
    let sendEmail = e.detail.value.trim()
    this.setData({
      sendEmail
    })
  },
  iptSendEmail(e) {
    let fromEmail = e.detail.value.trim()
    this.setData({
      fromEmail
    })
  },
  iptCont(e) {
    let sendTxt = e.detail.value.trim()
    this.setData({
      sendTxt
    })
  },
  sendresume() {
    

    if (!this.data.SendTitle) {
      wx.showToast({
        title: "邮件主题不能为空",
        icon: "none",
        duration: 1000
      })
    } else if (!this.data.truename) {
      wx.showToast({
        title: "姓名不能为空",
        icon: "none",
        duration: 1000
      })
    } else if (!this.data.sendEmail) {
      wx.showToast({
        title: "收件邮箱不能为空",
        icon: "none",
        duration: 1000
      })
    } else if (!this.data.fromEmail) {
      wx.showToast({
        title: "发件邮箱不能为空",
        icon: "none",
        duration: 1000
      })
    } else if (!this.data.sendTxt) {
      wx.showToast({
        title: "发送内容不能为空",
        icon: "none",
        duration: 1000
      })
    } else {
      if (!emailReg.test(this.data.sendEmail)) {
        wx.showToast({
          title: "收件邮箱格式不正确",
          icon: "none",
          duration: 1000
        })
      } else if (!emailReg.test(this.data.fromEmail)) {
        wx.showToast({
          title: "发件邮箱格式不正确",
          icon: "none",
          duration: 1000
        })
      } else {
        this.sendEmail()
      }
    }
  },
  sendEmail() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    wx.request({
      url: `${sendEmail}`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        stu_id: app.globalData.student_id,
        resumes_id: _self.data.resumes_id,
        SendTitle: _self.data.SendTitle,
        truename: _self.data.truename,
        sendEmail: _self.data.sendEmail,
        fromEmail: _self.data.fromEmail,
        sendTxt: _self.data.sendTxt,
        token: app.globalData.token
      },
      success: res => {
        const data = res.data
        if (data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.sendEmail()
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
              _self.setData({
                sendResumeBox: !_self.data.sendResumeBox
              })
            }, 500)
          }
        }
      }
    })
  },
  close() {
    this.setData({
      sendResumeBox: !this.data.sendResumeBox
    })
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