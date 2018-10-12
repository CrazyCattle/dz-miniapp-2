
import { 
  register,
  getAuthCode
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
    mobile: ""
  },
  getCode() {
    if (mobileReg.test(this.data.mobile)) {
      let time = 60;
      wx.request({
        url: `${getAuthCode}${this.data.mobile}`,
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
    if (!this.data.student_truename) {
      wx.showToast({
        title: "姓名不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!this.data.student_name) {
      wx.showToast({
        title: "学号不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!this.data.student_passwd) {
      wx.showToast({
        title: "密码不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!this.data.mobile) {
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
      console.log(
        this.data.student_truename,
        this.data.student_name,
        this.data.student_passwd,
        this.data.mobile,
        this.data.mobilecode
      );
      wx.request({
        url: `${register}`,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          mobilecode: this.data.mobilecode,
          student_truename: this.data.student_truename,
          student_name: this.data.student_name,
          student_passwd: this.data.student_passwd,
          mobile: this.data.mobile
        },
        success: res => {
          wx.showToast({
            title: res.data.errortip,
            icon: "none",
            duration: 1000
          });
          if (res.data.error == '0') {
            setTimeout(() => {
              wx.reLaunch({
                url: '../navIndex/index'
              })
            },150)
          }
        }
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      schoolName: wx.getStorageSync('schoolInfo').university_title
    })
  }
});
