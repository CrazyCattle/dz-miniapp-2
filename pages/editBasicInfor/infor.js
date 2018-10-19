import {
  getUserInfor,
  editUserBasicInfo
} from '../../api';

import {
  formatTime,
  setNewToken,
  initLoginStatus
} from '../../utils/util'

const app = getApp()
const mobileReg = /^13(\d{9})$|^15(\d{9})$|^14(\d{9})$|^17(\d{9})$|^18(\d{9})$/;
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
let stud_info = {}

Page({
  data: {
    stud_info: '',
    user_name: '',
    user_sex: '',
    // user_birthday: '',
    user_phone: '',
    user_email: '',
    sex: ['男', '女'],

    endTime: '',
    index: 0,
  },
  listenerPickerSelected: function (e) {
    this.setData({
      index: e.detail.value
    });
    this.setData({
      user_sex: this.data.sex[this.data.index]
    })
  },
  // listenerDatePickerSelected(e) {
  //   this.setData({
  //     user_birthday: e.detail.value
  //   })
  // },
  iptName(e) {
    this.setData({
      user_name: e.detail.value.trim()
    })
  },
  iptEmail(e) {
    this.setData({
      user_email: e.detail.value.trim()
    })
  },
  iptPhone(e) {
    this.setData({
      user_phone: e.detail.value.trim()
    })
  },
  saveUserInfo() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    console.log(_self.data.user_name, _self.data.user_email, _self.data.user_phone, _self.data.user_birthday, _self.data.user_sex)
    if (!_self.data.user_name) {
      wx.showToast({
        title: "姓名不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!_self.data.user_email) {
      wx.showToast({
        title: "邮箱不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!_self.data.user_phone) {
      wx.showToast({
        title: "手机号码不能为空",
        icon: "none",
        duration: 1000
      });
    } else {
      if (!mobileReg.test(_self.data.user_phone)) {
        wx.showToast({
          title: "手机号码格式不正确",
          icon: "none",
          duration: 1000
        })
      } else if (!emailReg.test(_self.data.user_email)) {
        wx.showToast({
          title: "邮箱格式不正确",
          icon: "none",
          duration: 1000
        })
      } else {
        wx.request({
          url: `${editUserBasicInfo}`,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            stu_id: app.globalData.student_id,
            student_truename: _self.data.user_name,
            student_sex: _self.data.user_sex,
            // student_birthday: _self.data.user_birthday,
            student_mobile: _self.data.user_phone,
            student_email: _self.data.user_email,
            token: app.globalData.token
          },
          success: res => {
            console.log(res)
            if (res.data.tokeninc == '0') {
              if (loginType == 'wxlogin') {
                setNewToken().then(res => {
                  if (res == 'ok') {
                    _self.saveUserInfo()
                  }
                })
              } else {
                initLoginStatus()
              }
            } else {
              if (res.data.error == '0') {
                wx.showToast({
                  title: res.data.errortip,
                  icon: "none",
                  duration: 1000
                })
                const { listjson } = res.data
                for (var key in listjson) {
                  stud_info[key] = listjson[key]
                }
                console.log(stud_info)
                wx.setStorageSync('stud_info', stud_info)
                let timer = setTimeout(() => {
                  wx.navigateBack()
                  clearTimeout(timer)
                }, 300)
              }
            }
          }
        })
      }
    }
  },
  onLoad: function (options) {
    stud_info = wx.getStorageSync('stud_info')
    console.log(stud_info)
    this.setData({
      stud_info: wx.getStorageSync('stud_info'),
      user_name: stud_info.name,
      user_sex: stud_info.sex,
      user_phone: stud_info.phone,
      user_email: stud_info.email,
      endTime: formatTime(new Date())
    })
    this.data.sex.forEach((v, i) => {
      if (v == this.data.user_sex) {
        this.setData({
          index: i
        })
      }
    })
  },
  onShow: function () {

  }
})