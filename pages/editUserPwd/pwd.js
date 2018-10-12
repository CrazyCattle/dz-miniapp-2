
import {
  register,
  getAuthCode,
  getStuAuthCode,
  valiCode
} from "../../api";

import {
  setNewToken,
  initLoginStatus
} from '../../utils/util';


const app = getApp();
const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
const mobileReg = /^13(\d{9})$|^15(\d{9})$|^14(\d{9})$|^17(\d{9})$|^18(\d{9})$/;

Page({
  data: {
    step: '1',
    canGetCode: true,
    timeLimit: "60s后,重新获取",
    schoolName: '',
    mobilecode: "",
    student_passwd: "",
    student_rpasswd: "",
    mobile: ""
  },
  iptPhone(e) {
    console.log(e)
    if (e.detail.value !== undefined) {
      this.setData({
        mobile: e.detail.value.trim()
      });
    }
  },
  iptCode(e) {
    if (e.detail.value !== undefined) {
      this.setData({
        mobilecode: e.detail.value.trim()
      });
    }
  },
  getCode() {
    if (mobileReg.test(this.data.mobile)) {
      let time = 60;
      wx.request({
        url: `${getStuAuthCode}?mobile=${this.data.mobile}&stu_id=${app.globalData.student_id}`,
        method: 'GET',
        success: res => {
          console.log(res)
          if (res.data.error == '0') {
            this.setData({
              canGetCode: !this.data.canGetCode
            });
            wx.showToast({
              title: res.data.errortip,
              icon: "none",
              duration: 1000
            });
            let timer = setInterval(() => {
              this.setData({
                timeLimit: time-- + "s后,重新获取"
              });
              if (time == 0) {
                this.setData({
                  canGetCode: !this.data.canGetCode
                });
                clearInterval(timer);
              }
            }, 1000);
          } else if (res.data.error == '1') {
            wx.showToast({
              title: res.data.errortip,
              icon: "none",
              duration: 1000
            });
          }
        },
        fail: function () { },
        complete: function () { }
      })
    } else {
      if (!this.data.mobile) {
        wx.showToast({
          title: "手机号码不能为空",
          icon: "none",
          duration: 1000
        });
      } else {
        wx.showToast({
          title: "手机号码格式错误",
          icon: "none",
          duration: 1000
        });
      }
    }
  },
  nextToPwd() {
    let _self = this
    if (!mobileReg.test(_self.data.mobile)) {
      wx.showToast({
        title: "手机号不正确",
        icon: "none",
        duration: 1000
      });
    } else if (!_self.data.mobilecode) {
      wx.showToast({
        title: "验证码不能为空",
        icon: "none",
        duration: 1000
      });
    } else {
      _self.vailPhoneCode()
    }
  },
  vailPhoneCode() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')
    wx.request({
      url: `${valiCode}`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        stu_id: app.globalData.student_id,
        mobilecode: _self.data.mobilecode,
        mobile: _self.data.mobile,
        token: app.globalData.token
      },
      success: res => {
        console.log(res)
        const { data } = res

        if (data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.vailPhoneCode()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (data.error == '0') {
            _self.setData({
              step: '2'
            })
          } else {
            wx.showToast({
              title: data.errortip,
              icon: "none",
              duration: 1000
            });
          }
        }
      }
    })
  },
  iptNewPwd(e) {
    if (e.detail.value !== undefined) {
      this.setData({
        student_passwd: e.detail.value.trim()
      });
    }
  },
  iptRepeatPwd(e) {
    if (e.detail.value !== undefined) {
      this.setData({
        student_rpasswd: e.detail.value.trim()
      });
    }
  },
  updatePwd() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    wx.request({
      url: `${valiCode}`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        stu_id: app.globalData.student_id,
        mobilecode: _self.data.mobilecode,
        mobile: _self.data.mobile,
        newone: _self.data.student_passwd,
        newtwo: _self.data.student_rpasswd,
        token: app.globalData.token
      },
      success: res => {
        const { data } = res
        console.log(data)
        if (data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.updatePwd()
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
            _self.setData({
              step: '3'
            })
          } else {
            wx.showToast({
              title: data.errortip,
              icon: "none",
              duration: 1000
            });
          }
        }
      }
    })
  },
  nextToIndex() {
    let _self = this
    if (_self.data.student_passwd !== _self.data.student_rpasswd) {
      wx.showToast({
        title: "两次密码输入不一致",
        icon: "none",
        duration: 1000
      });
    } else if (!pwdReg.test(_self.data.student_passwd) || !pwdReg.test(_self.data.student_rpasswd)) {
      wx.showToast({
        title: "请输入由字母、数字组成的6-18位密码",
        icon: "none",
        duration: 1000
      });
    } else {
      _self.updatePwd()
    }
  },
  gotoIndex() {
    wx.reLaunch({
      url: '../navIndex/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      schoolName: wx.getStorageSync('schoolInfo').university_title
    })
  }
});
