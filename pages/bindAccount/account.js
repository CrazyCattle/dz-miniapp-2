import {
  wxLogin,
  wxAuthorization,
  WxRegLogin
} from "../../api";

const app = getApp()

Page({
  data: {
    username: "",
    password: "",
    phone: ''
  },
  inputName(e) {
    console.log(e.detail);
    this.setData({
      username: e.detail.value.trim()
    });
  },
  inputPwd(e) {
    console.log(e.detail);
    this.setData({
      password: e.detail.value.trim()
    });
  },
  loginIn() {
    console.log("username:" + this.data.username, "pwd:" + this.data.password);
    if (!this.data.username) {
      wx.showToast({
        title: "手机号不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!this.data.password) {
      wx.showToast({
        title: "密码不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/.test(this.data.password)) {
      wx.showToast({
        title: '密码请输入8-12位数字和字母组合',
        icon: "none",
        duration: 1000
      });
    } else {
      let promise = new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve(res)
          }
        });
      })
      promise.then((res) => {
        return new Promise((resolve, reject) => {
          wx.request({
            url: `${wxAuthorization}`,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            data: {
              code: res.code
            },
            success: res => {
              resolve(res)
            }
          })
        })
      }).then(res => {
        if (res.data.error == '0') {
          let fResult = res.data.result
          let openid = fResult.openid
        
          wx.request({
            url: `${wxLogin}`,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              wxtoken: openid,
              username: this.data.username.trim(),
              password: this.data.password.trim()
            },
            method: "POST",
            success: res => {
              console.log(res);
              const { error } = res.data;
              wx.showToast({
                title: res.data.errortip,
                icon: "none",
                duration: 1000
              });
              if (error == "0") {
                app.globalData.openid = fResult.openid
                wx.setStorageSync('openid', fResult.openid)
                
                wx.setStorageSync("student_id", (app.globalData.student_id = res.data.listjson.student_id));
                wx.setStorageSync("token", (app.globalData.token = res.data.listjson.token));
                wx.setStorageSync("loginType", 'wxlogin');
                app.globalData.loginType = 'wxlogin'

                wx.showToast({
                  title: '绑定成功',
                  icon: 'none',
                  duration: 1000
                })

                let timer = setTimeout(() => {
                  wx.reLaunch({
                    url: "../navMe/me"
                  });
                  clearTimeout(timer)
                }, 300)
              }
            }
          })
        }
      })
      console.log(app.globalData.openid)
    }
  },
  bingTologin () {
    if (!this.data.password) {
      wx.showToast({
        title: "密码不能为空",
        icon: "none",
        duration: 1000
      });
    } else if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/.test(this.data.password)) {
      wx.showToast({
        title: '密码请输入8-12位数字和字母组合',
        icon: "none",
        duration: 1000
      });
    } else {
      let promise = new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve(res)
          }
        });
      })
      promise.then((res) => {
        return new Promise((resolve, reject) => {
          wx.request({
            url: `${wxAuthorization}`,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            data: {
              code: res.code
            },
            success: res => {
              resolve(res)
            }
          })
        })
      }).then(res => {
        console.log(res)
        if (res.data.error == '0') {
          let { result } = res.data
          console.log(result)
          this.bindPhone(result.openid, this.data.password)
        }
      })
    }
  },
  // 绑定手机号
  bindPhone(openid, password) {
    wx.request({
      url: `${WxRegLogin}`,
      data: {
        mobile: app.globalData.userPhone,
        wxtoken: openid,
        password
      },
      success: res => {
        console.log(res, 111)
        if (res.data.error == 0) {
          const { listjson } = res.data
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1000
          })

          app.globalData.openid = openid
          wx.setStorageSync('openid', openid)

          wx.setStorageSync("student_id", (app.globalData.student_id = listjson.student_id));
          wx.setStorageSync("token", (app.globalData.token = listjson.token));
          wx.setStorageSync("loginType", 'wxlogin');
          app.globalData.loginType = 'wxlogin'

          let timer = setTimeout(() => {
            wx.reLaunch({
              url: "../navMe/me"
            });
            clearTimeout(timer)
          }, 300)
        }
      }
    })
  },
  register() {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  onLoad: function (options) {
    this.setData({
      phone: app.globalData.userPhone
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {}
})