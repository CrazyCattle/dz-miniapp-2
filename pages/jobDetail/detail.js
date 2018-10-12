import {
  getPositionOne,
  getPositionList,
  sendPosCollect
} from '../../api'

import {
  initLoginStatus,
  getDetails,
  getUserState,
  setNewToken,
  navToLogin
} from '../../utils/util'

// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var map;

const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    jobId: undefined,
    collected: false,
    work_name: '',
    // 位置 经纬度
    address: '',
    lat: undefined,
    lng: undefined,
    // 职位详情
    list: {},
    // 名企推荐
    companyList: [],
    positionId: undefined,

    hasDesc: false,
    hasReq: false
  },
  linkToCompany (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../companyDetail/detail?id=${id}`
    })
  },
  linkToJobDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobDetail/detail?id=${id}`
    })
  },
  linkMoreSameJob() {
    wx.navigateTo({
      url: `../moreSameJob/job?id=${this.data.positionId}`
    })
  },
  linkMap (e) {
    console.log(e.target.dataset.name)
    let address = e.target.dataset.name

    if (address) {
      // 实例化API核心类
      this.setData({
        address: address
      })
      map = new QQMapWX({
        key: 'AXZBZ-EX6K6-Z2CSQ-EPFR4-EEDYK-7QBIY'
      });
      // 调用接口
      new Promise((resolve, reject) => {
        map.geocoder({
          address: this.data.address,
          success: (res) => {
            if (res.status == '0') {
              this.setData({
                lat: res.result.location.lat,
                lng: res.result.location.lng,
              })
              resolve({
                lat: this.data.lat,
                lng: this.data.lng
              })
            }
          }
        })
      }).then((res) => {
        wx.openLocation({
          latitude: res.lat,
          longitude: res.lng,
          scale: 18,
          address: this.data.address
        })
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '该公司尚未填写地址',
        duration: 1000
      })
    }
  },
  collect () {
    wx.request({
      url: `${sendPosCollect}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        position_id: this.data.jobId
      },
      method: 'POST', 
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          wx.showToast({
            icon: 'none',
            title: res.data.errortip,
            duration: 1000
          })
          if (res.data.errortip == '成功收藏职位') {
            this.setData({
              collected: true
            })
          } else {
            this.setData({
              collected: false
            })
          }
        }
      }
    })
  },
  delivery() {
    if (getUserState()) {
      wx.navigateTo({
        url: `../deliveryResume/resume?id=${this.data.jobId}`
      })
    } else {
      navToLogin()
    }
  },
  getDetails (id) {
    const _self = this
    let loginType = wx.getStorageSync('loginType')
    return new Promise((resolve,reject) => {
      wx.request({
        url: `${getPositionOne}`,
        data: {
          token: app.globalData.token,
          stu_id: app.globalData.student_id,
          position_id: id
        },
        method: 'GET',
        success: res => {
          console.log(res)
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.getDetails()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == '0') {
              const { list } = res.data.result
              _self.setData({

              })
              console.log(list.collectinc,'ttttt')
              if (list.collectinc == '1') {
                _self.setData({
                  collected: true
                })
              } else {
                _self.setData({
                  collected: false
                })
              }
              this.setData({ 
                list,
                work_name: list.position_name
              })
              console.log(this.data.list)
              const { position_demand,position_description } = res.data.result.list
              if (!!position_demand) {
                _self.setData({
                  hasDesc: true
                })
                WxParse.wxParse('article1', 'html', position_demand, _self, 5);
              }
              if (!!position_description) {
                _self.setData({
                  hasReq: true
                })
                WxParse.wxParse('article2', 'html', position_description, _self, 5);
              }
              resolve(this.data.list.positiontype_id)
            }
          }
        }
      })
    })
  },
  getSameCompany(pId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getPositionList}`,
        data: {
          p: 1,
          nums: 4,
          isai: 1,
          positiontype_id: pId
        },
        success: res => {
          resolve(res.data.result.list)
        }
      })
    })
  },
  onLoad: function (options) {
    const id = options.id
    console.log(id)
    this.setData({
      jobId: id 
    })
    this.getDetails(id).then(res => {
      this.setData({
        positionId: res
      })
      this.getSameCompany(res).then(res => {
        this.setData({
          companyList: this.data.companyList.concat(res)
        })
        console.log(this.data.companyList)
      })
    })
  },
  onReady: function () {},
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: this.data.work_name,
      // imageUrl: '',
      path: `pages/jobDetail/detail?id=${this.data.jobId}`,
      success: function(res) {
        console.log(res)
      }
    }
  }
})