import {
  getStudentMis
} from '../../api'

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util'

const app =getApp()

Page({
  data: {
    scrollTop: 0,
    showNav: true,
    showTips: false,
    messageArr: [],
    showLoading: true,
    timer: null,
    curpage: 1,
    canLoadMore: true
  },
  linkStatus () {
    wx.navigateTo({
      url: '../inforStatus/status',
    })
  },
  linkInvi() {
    wx.navigateTo({
      url: '../enrollmentInvitation/invi',
    })
  },
  linkRecommend() {
    wx.navigateTo({
      url: '../enrollmentRecommend/recommend',
    })
  },
  linkNotice() {
    wx.navigateTo({
      url: '../inforNotice/notice',
    })
  },
  lower () {
    const _self = this
    if (_self.timer) {
      clearTimeout( _self.timer)
    }
    _self.timer = setTimeout(() => {
      _self.getAllMess()
    }, 500)
  },
  getAllMess () {
    let _self = this
    let loginType = wx.getStorageSync('loginType')
    if (this.data.canLoadMore) {
      this.setData({
        showLoading: true
      })
      wx.request({
        url: `${getStudentMis}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&mis_type=0&p=${this.data.curpage}&nums=10`,
        success: res => {
          console.log(res)
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.getAllMess()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == '0') {
              let data =  res.data.result.list
              if (data.length > 0) {
                console.log(data)
                if (data.length == 10) {
                  this.setData({
                    curpage: ++this.data.curpage,
                    canLoadMore: true
                  })
                } else {
                  this.setData({
                    canLoadMore: false
                  })
                }
                this.setData({
                  showNav: true,
                  showLoading: false,
                  messageArr: this.data.messageArr.concat(data)
                })
              } else {
                this.setData({
                  showNav: true,
                  showTips: !this.data.showTips
                })
              }
            }
          }
        }
      })
    }
  },
  onLoad: function (options) {
    if (getUserState()) {
      this.getAllMess()
    } else {
      this.setData({
        showNav: false,
        showTips: !this.data.showTips
      })
    }
  },
  onShow: function() { }
})