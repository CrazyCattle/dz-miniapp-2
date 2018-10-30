import {
  getCClass,
  LessonBanner
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
    placeholderTxt: '搜索课程或者讲师',
    focus: false,
    cId: '',

    swiperIndex: 0,
    // indicatorDots: true,
    autoplay: true,
    canautoplay: true,
    circular: true,
    interval: 5000,
    duration: 300,
    imgUrls: [],
    list: []
  },
  linkToSearch () {
    wx.navigateTo({
      url: '../courseSearch/course'
    })
  },
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  linkToChild (e) {
    const cId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../courseChild/course?id=${cId}`
    })
  },
  linkToChild2 (e) {
    let url = e.currentTarget.dataset.url
    let cId
    if (url.indexOf('classTwoId=') > -1) {
      cId = url.split('classTwoId=')
      wx.navigateTo({
        url: `../courseChild/course?id=${cId[1]}`
      })
    }
    
  },
  linkToMore (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../visualChild/vchild?id=${id}`
    })
  },
  getBanner () {
    wx.request({
      url: `${LessonBanner}`,
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            imgUrls: res.data.listjson
          })
        }
      }
    })
  },
  onLoad: function (options) {
    wx.request({
      url: `${getCClass}?twonum=4`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            list: res.data.listjson
          })
        }
      }
    })

    this.getBanner()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})