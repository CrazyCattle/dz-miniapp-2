import { 
  WXregister,
  getShareAuthCode,
  getLessonShare
} from "../../api";


const app = getApp();
const mobileReg = /^13(\d{9})$|^15(\d{9})$|^14(\d{9})$|^17(\d{9})$|^18(\d{9})$/;
Page({
  data: {
    canGetCode: true,
    timeLimit: "60s后,重新获取",
    schoolName: '',
    mobilecode: "",
    student_truename: "",
    student_name: "",
    student_passwd: "",
    mobile: "",
    fromId: undefined,
    cId: undefined
  },
  getCode() {
    if (mobileReg.test(this.data.mobile)) {
      let time = 60;
      wx.request({
        url: `${getShareAuthCode}?mobile=${this.data.mobile}`,
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
        fail: function() {},
        complete: function() {}
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
  register() {
    if (!this.data.mobile) {
      wx.showToast({
        title: "手机号码不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!this.data.mobilecode) {
      wx.showToast({
        title: "验证码不能为空",
        icon: "none",
        duration: 1000
      });
    } else {
      console.log(this.data.mobile, this.data.mobilecode, wx.getStorageSync("shareOpenid"));
      wx.request({
        url: `${WXregister}`,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          mobilecode: this.data.mobilecode,
          mobile: this.data.mobile,
          wxtoken: app.globalData.shareOpenid
        },
        success: res => {
          wx.showToast({
            title: res.data.errortip,
            icon: "none",
            duration: 1000
          });
          console.log(res.data)
          if (res.data.error == 0) {
            const { listjson } = res.data
            wx.setStorageSync("student_id", (app.globalData.student_id = listjson.student_id));
            wx.setStorageSync("token", (app.globalData.token = listjson.token));
            wx.setStorageSync("loginType", 'userlogin');
            app.globalData.loginType = 'userlogin'
            wx.showLoading()
            this.setShareLimit()
          } else if (res.data.error == 2) {
            let timer = setTimeout(() => {
              wx.navigateTo({
                url: `../agreeRegister/agreeRegister?cId=${this.data.cId}&fromId=${this.data.fromId}&mobile=${this.data.mobile}`
              });
              clearTimeout(timer)
            }, 300)
          }
        }
      })
    }
  },
  setShareLimit() {
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
          console.log(res)
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
  iptName(e) {
    if (e.detail.value !== undefined) {
      this.setData({
        student_truename: e.detail.value.trim()
      });
    }
  },
  iptCard(e) {
    if (e.detail.value !== undefined) {
      this.setData({
        student_name: e.detail.value.trim()
      });
    }
  },
  iptPwd(e) {
    if (e.detail.value !== undefined) {
      this.setData({
        student_passwd: e.detail.value.trim()
      });
    }
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
  onLoad: function(options) {
    console.log(options.cId, options.fromId)
    this.setData({
      cId: options.cId,
      fromId: options.fromId,
      schoolName: wx.getStorageSync('schoolInfo').university_title
    })
  }
});
