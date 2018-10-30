import {
  schoolInfo,
  judgeStu,
  wxAuthorization,
  WxMobileLogin,
  wxAuthorMobile
} from "../../api";

const app = getApp();

Page({
  data: {
    logoUrl: "",
    session_key: ''
  },
  getPhoneNumber (e) {
    if (e.detail.encryptedData) {
      console.log(
        e.detail.encryptedData, '--1--',
        e.detail.errMsg, '--1--',
        e.detail.iv
      )
      
      wx.showLoading()
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

          wx.request({
            url: `${wxAuthorMobile}`,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              session_key: result.session_key
            },
            success: res => {
              console.log(res, 'phone')
              if (res.data.error == 0) {
                let listjson = JSON.parse(res.data.listjson)
                const phone = listjson.phoneNumber
                wx.setStorageSync('userPhone', (app.globalData.userPhone = phone))
                this.isUserExist(result, phone, result.openid)
              } else {
                wx.showToast({
                  title: '请求数据失败，请稍后重试',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } 
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '允许微信授权才能使用微信登陆',
        duration: 1000
      })
    }
  },
  // 判断用户存不存在
  isUserExist(result, phone, token) {
    wx.request({
      url: `${WxMobileLogin}`,
      data: {
        mobile: phone,
        wxtoken: token
      },
      success: res => {
        const { listjson } = res.data
        if (res.data.error == 1) {
          wx.redirectTo({
            url: "../bindAccount/account"
          });
        } else {
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1000
          })

          app.globalData.openid = result.openid
          wx.setStorageSync('openid', result.openid)

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
  linkLogin() {
    wx.navigateTo({
      url: "../login/login"
    });
  },
  lonkBind() {
    wx.request({
      url: `${judgeStu}`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        wxtoken: wx.getStorageSync('openid')
      },
      success: res => {
        console.log(res, 32132132)
        const { error } = res.data
        if (error == '1') {
          wx.navigateTo({
            url: "../bindAccount/account"
          });
        } else if (error == '0') {
          wx.setStorageSync('token', (app.globalData.token = res.data.listjson.token))
          wx.setStorageSync('student_id', (app.globalData.student_id = res.data.listjson.student_id))
          wx.setStorageSync("loginType", 'wxlogin');
          app.globalData.loginType = 'wxlogin'

          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1000
          })

          let timer = setTimeout(() => {
            wx.reLaunch({
              url: '../navMe/me',
            })
            clearTimeout(timer)
          }, 300)
        }
      }
    })
  },
  register() {
    wx.navigateTo({
      url: "../register/register"
    });
  },
  onLoad: function (options) {
    wx.removeStorageSync('schoolInfo')
    wx.removeStorageSync('stud_info')
    wx.removeStorageSync('student_id')
    wx.removeStorageSync('userIcon')
    wx.removeStorageSync('baseCity')
    wx.removeStorageSync('searches')
    wx.removeStorageSync('baseCityId')
    wx.removeStorageSync('loginType')
    
    // new Promise((resolve, reject) => {
    //   if (!app.globalData.schoolInfo) {
    //     wx.request({
    //       url: `${schoolInfo}`,
    //       method: "GET",
    //       success: res => {
    //         console.log(res);
    //         if (res.data.error == "0") {
    //           app.globalData.schoolInfo = res.data.result;
    //           wx.setStorageSync("schoolInfo", res.data.result);
    //           resolve(app.globalData.schoolInfo);
    //         }
    //       },
    //       fail: res => {
    //         throw Error(err);
    //       },
    //       complete: () => {
    //         // complete
    //       }
    //     });
    //   } else {
    //     resolve(app.globalData.schoolInfo);
    //   }
    // }).then(res => {
    //   this.setData({
    //     logoUrl: res.enter_logo
    //   });
    // });
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { }
});
