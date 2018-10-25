import { loginIn } from "../../api";

const app = getApp();

Page({
  data: {
    username: "",
    password: ""
  },
  register() {
    wx.navigateTo({
      url: "../register/register"
    });
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
    } else {
      wx.request({
        url: `${loginIn}`,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
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
            wx.setStorageSync("student_id", (app.globalData.student_id = res.data.listjson.student_id));
            wx.setStorageSync("token", (app.globalData.token = res.data.listjson.token));
            wx.setStorageSync("loginType", 'userlogin');
            app.globalData.loginType = 'userlogin'

            wx.showToast({
              title: '登录成功',
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
      });
    }
  },
  onLoad: function (options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { }
});
