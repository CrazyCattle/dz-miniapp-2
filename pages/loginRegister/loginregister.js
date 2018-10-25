import {
  schoolInfo,
  judgeStu
} from "../../api";

const app = getApp();

Page({
  data: {
    logoUrl: ""
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
