import { 
  getSClass,
  getStuClassLimit
} from '../../api.js'

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util'


const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    hasPower: false,
    share_islimits: 0,

    showMore: false,
    class_name: '',
    class_intro: {},
    classThree: [],
    cId: '',
    courseList: [],
  },
  linkShare (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../share/share?id=${id}`
      // url: `../share/share?id=${id}&stuId=${this.data.cId}`
    })
  },
  showMore () {
    this.setData({
      showMore: !this.data.showMore
    })
  },
  linkCoursePlay (e) {
    let id = e.currentTarget.dataset.id
    console.log(id, 1324)
    wx.navigateTo({
      url: `../coursePlay/play?id=${id}`,
    })
  },
  linkCourseShare(e) {
    let id = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: `../share/share?id=${id}`
      // url: `../share/share?id=${id}&stuId=${this.data.cId}`
    })
  },
  getPhoneNumber (e) {
    console.log(e)
  },
  getLessonStatus () {
    wx.request({
      url: `${getStuClassLimit}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&class_id=${this.data.cId}`,
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          if (res.data.listjson.share_islimits == 1) {
            this.setData({
              hasPower: true
            })
          }
        } else if (res.data.error == 1) {
          if (res.data.listjson.share_islimits == 0) {
            this.setData({
              hasPower: true
            })
          }
        }
      }
    })
  },

  initGetData (params) {
    let loginType = wx.getStorageSync('loginType')
    wx.request({
      url: `${getSClass}${params}`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                this.initGetData()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          const { error } = res.data
          if (error == '0') {
            console.log(res.data.listjson)
            const { class_intro, classThree, share_islimits } = res.data.listjson
            const article = class_intro.class_intro
            const { class_name } = class_intro
            this.setData({
              class_name: `${class_name}系列课程`,
              class_intro,
              share_islimits
            })
            wx.setNavigationBarTitle({
              title: this.data.class_name
            })
            WxParse.wxParse('article', 'html', article, this, 5);
            this.setData({
              classThree
            })
            console.log(this.data.classThree)
          }
        }
      }
    })
  },

  onLoad: function (options) {
    let id = options.id
    this.setData({
      cId: id
    })

    let params = ''

    if (app.globalData.student_id) {
      params = id + '&stu_id=' + app.globalData.student_id + '&token=' + app.globalData.token
    } else {
      params = id + '&token=' + app.globalData.token
    }

    this.initGetData(params)
    
    if (app.globalData.token && app.globalData.student_id) {
      this.getLessonStatus()
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: `${this.data.class_name}系列课程`,
      path: `pages/courseChild/course?id=${this.data.cId}`,
      success: function (res) {
        console.log(res)
      }
    }
  }
})