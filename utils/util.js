import {
  getUserToken
} from '../api';

const app = getApp()

const formatTime = date => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1

  return year + '-' + (month > 9 ? month : '0' + month)
}

const setNewToken = () => {
  console.log(app.globalData)
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${getUserToken}${app.globalData.openid}`,
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          const { listjson } = res.data
          wx.setStorageSync("token", listjson.token);
          app.globalData.token = listjson.token
        }
        resolve('ok')
      }
    })
  })
}

const removeData = () => {
  wx.removeStorageSync('schoolInfo')
  wx.removeStorageSync('stud_info')
  wx.removeStorageSync('student_id')
  wx.removeStorageSync('stud_img')
  wx.removeStorageSync('token')
  wx.removeStorageSync('openid')

  app.globalData.stud_info = ''
  app.globalData.student_id = ''
  app.globalData.student_img = ''
  app.globalData.token = ''
  app.globalData.openid = ''
  app.globalData.loginType = ''

  wx.showToast({
    title: "请先登录",
    icon: "none",
    duration: 1000
  });
}

const initLoginStatus = () => {
  removeData()
  
  let timer = setTimeout(() => {
    wx.navigateTo({
      url: '../loginRegister/loginregister'
    })
  }, 300)
}

const redirectLogin = () => {
  removeData()
  let timer = setTimeout(() => {
    wx.redirectTo({
      url: '../loginRegister/loginregister'
    })
  }, 300)
}

const getUserState = () => {
  const loginType = wx.getStorageSync('loginType')
  const id = wx.getStorageSync('student_id')

  if (!loginType || !id) {
    return false;
  } 
  return true;
}
const navToLogin = () => {
  wx.navigateTo({
    url: '../loginRegister/loginregister'
  })
}

module.exports = {
  formatTime,
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin,
  redirectLogin
}
