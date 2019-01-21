import {
  getCompanyOne,
  sendComCollect,
  getZphPositionList
} from '../../api'

import {
  initLoginStatus,
  setNewToken,
  getDetails,
  getUserState,
  navToLogin
} from '../../utils/util'

const WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
    companyId: undefined,
    id: '',
    showMask: false,
    collected: false,
    list: {},
    active: 1,
    more: true,
    c_name: '',
    showMore: false,
    // 职位列表
    recruitList: []
  },

  linkJobDetail(e) {
    // if (getUserState()) {
    //   const id = e.currentTarget.dataset.id
    //   wx.navigateTo({
    //     url: `../jobDetail/detail?id=${id}`
    //   })
    // } else {
    //   navToLogin()
    // }
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobDetail/detail?id=${id}`
    })
  },
  linkJobList() {
    wx.navigateTo({
      url: `../companyJobList/list?id=${this.data.companyId}`
    })
  },
  tabInfor(e) {
    this.setData({
      active: e.target.dataset.tab
    })
    if (this.data.active == '2') {
      if (this.data.recruitList.length == 0) {
        wx.request({
          url: `${getZphPositionList}`,
          data: {
            p: 1,
            nums: 10,
            id: this.data.id,
            company_id: this.data.companyId
          },
          method: 'GET',
          success: res => {
            if (res.data.error == '0') {
              this.setData({
                recruitList: res.data.listjson
              })

              if (this.data.recruitList.length >= 6) {
                this.setData({
                  showMore: true
                })
              } else {
                this.setData({
                  showMore: false
                })
              }
            }
          }
        })
      }
    }
  },
  extendAll() {
    this.setData({
      more: false
    })
  },
  share() {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  sendCollectCompany() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${sendComCollect}`,
        data: {
          stu_id: app.globalData.student_id,
          token: app.globalData.token,
          id: this.data.companyId
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.sendCollectCompany()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == '0') {
              resolve(res.data)
            }
          }
        }
      })
    })
  },
  collectCompany(e) {
    let collected = e.currentTarget.dataset.collected
    this.sendCollectCompany().then(res => {
      if (res.error == '0') {
        if (res.listjson.state == 1) {
          this.setData({
            collected: true
          })
        } else {
          this.setData({
            collected: false
          })
        }
        wx.showToast({
          icon: 'none',
          title: res.errortip,
          duration: 1000
        })
      }
    })
  },
  productImg() { },
  getCompanyInformation(cId) {
    let _self = this
    let loginType = wx.getStorageSync('loginType')
    let data
    if (app.globalData.student_id) {
      data = {
        token: app.globalData.token,
        stu_id: app.globalData.student_id,
        id: cId
      }
    } else {
      data = {
        stu_id: 0,
        id: cId
      }
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getCompanyOne}`,
        data,
        method: 'GET',
        success: res => {
          console.log(res)
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.getCompanyInformation(cId)
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == '0') {
              const list = res.data.listjson
              this.setData({
                list,
                c_name: list.companyName
              })
              const article = list.companyDescript
              console.log(list.collectinc)
              if (list.collectinc != 0) {
                this.setData({
                  collected: true
                })
              }
              if (article) {
                WxParse.wxParse('article', 'html', article, _self, 5);
              }
            }
          }
        }
      })
    })
  },
  onLoad: function (options) {
    let id
    if (options.scene) {
      id = decodeURIComponent(options.scene)
    } else {
      id = options.id
      // id = '82928'
    }
    this.setData({
      companyId: id,
      id: options.zphId
    })
    this.getCompanyInformation(id)
  },
  onShow: function () { },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: this.data.c_name,
      // imageUrl: '',
      path: `pages/companyDetail/detail?id=${this.data.companyId}`,
      success: function (res) {
        console.log(res)
      }
    }
  }
})