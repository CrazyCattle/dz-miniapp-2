import {
  wxAuthorization,
  getUserToken
} from 'api';

const ald = require('./utils/ald-stat.js')

App({
  globalData: {
    userInfo: null,
    openid: wx.getStorageSync('openid') || '', //微信openid
    shareOpenid: wx.getStorageSync('shareOpenid') || '', // 进入分享页openid
    stud_info: wx.getStorageSync('stud_info') || '', //学生信息
    student_img: wx.getStorageSync('userIcon') || '',//学生图片
    student_id: wx.getStorageSync('student_id') || '',//学生id
    schoolInfor: wx.getStorageSync('schoolInfor') || '', //学校信息
    token: wx.getStorageSync('token') || '',//后台登陆token
    loginType: '',  //登陆类型
    baseCity: wx.getStorageSync('baseCity') || '全国',// 获取首页 城市
    baseCityId: wx.getStorageSync('baseCityId') || '1',// 获取首页 城市ID
    userPhone: wx.getStorageSync('userPhone') || '', // 用户手机号
  },
  
  onLaunch: function (options) {
    let self = this;
  
    wx.showShareMenu({
      withShareTicket: true
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  }
});
