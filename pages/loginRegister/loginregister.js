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
    session_key: '',
    code: ''
  },
  getPhoneNumber (e) {
    wx.login({
      success: res1 => {
        this.setData({
          code: res1.code
        })
        app.globalData.code = res1.code
        if (e.detail.encryptedData) {
          wx.showLoading()
          new Promise((resolve, reject) => {
            wx.request({
              url: `${wxAuthorization}`,
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                code: app.globalData.code
              },
              success: res2 => {
                resolve(res2)
              }
            })
          }).then(res3 => {
            console.log(333)
            if (res3.data.error == '0') {
              let { result } = res3.data
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
                success: res4 => {
                  if (res4.data.error == 0) {
                    let listjson = JSON.parse(res4.data.listjson)
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
            title: '微信授权后才能使用微信登陆',
            duration: 1000
          })
        }
      }
    })
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
    // wx.navigateTo({
    //   url: "../login/login"
    // });
    wx.showLoading()
    let promise = new Promise((resolve, reject) => {
      wx.login({ success: res => {
        resolve(res);
      }});
    });
    promise.then(res => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${wxAuthorization}`,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          data: {
            code: res.code
          },
          success: res => {
            resolve(res);
          }
        });
      });
    })
    .then(res => {
      const { result } = res.data;
      console.log(result);
      wx.navigateTo({ url: `../login/login?openid=${result.openid}` });
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
    wx.removeStorageSync("loginType");
    wx.removeStorageSync('openid')

    wx.login({
      success: res1 => {
        this.setData({
          code: res1.code
        })
        app.globalData.code = res1.code
      }
    })
  }
});
