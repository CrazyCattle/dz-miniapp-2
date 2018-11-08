import {
  resumeList,
  delResume,
  getPositionCollect,
  getCompanyCollect,
  getMydropinbox,
  getMyinvitation
} from '../../api';

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    isLogin: false,
    tabActive: 1,
    student_id: '',
    type: 0,
    page: -1,
    canGetDropinbox : true,
    showNoTips: false,
    timer: null,
    dropinboxPage: 1,
    mydropinbox: []
  },
  handleChange (e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      canGetDropinbox: true,
      showNoTips: false,
      tabActive: id,
      dropinboxPage: 1,
      mydropinbox: []
    })
    this.getMydropinboxFun()
  },
  linkToDropDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../deliveryBoxDetail/detail?id=${id}`
    })
  },
  //获取投递箱
  getMydropinboxFun() {
    let loginType = wx.getStorageSync('loginType')
    if (this.data.canGetDropinbox) {
      wx.request({
        url: `${getMydropinbox}`,
        data: {
          stu_id: app.globalData.student_id,
          token: app.globalData.token,
          nums: 10,
          p: this.data.dropinboxPage,
          type: this.data.tabActive
        },
        method: 'GET',
        success: res => {
          console.log(res, '投递箱')
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  this.getMydropinboxFun()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == 0) {
              const { listjson } = res.data
              if (listjson.length < 10 & listjson.length >= 0) {
                this.setData({
                  canGetDropinbox: false
                })
              } else {
                this.setData({
                  dropinboxPage: ++this.data.dropinboxPage
                })
              }
              this.setData({
                mydropinbox: this.data.mydropinbox.concat(listjson)
              })
            } else {
              this.setData({
                mydropinbox: this.data.mydropinbox.concat([]),
                canGetDropinbox: false,
                showNoTips: true
              })
            }
          }
        }
      })
    }
  },
  lower() {
    if (this.data.canGetDropinbox) {
      wx.showNavigationBarLoading();
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.getMydropinboxFun()
        wx.hideNavigationBarLoading();
      }, 100);
    }
  },
  onLoad (options) {
    if (getUserState() && !!app.globalData.student_id && !!app.globalData.token) {
      this.setData({
        isLogin: true
      })
      this.getMydropinboxFun()
    } else {
      this.setData({
        showNoTips: true
      })
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 1000
      });
      initLoginStatus()
    }
  }
})