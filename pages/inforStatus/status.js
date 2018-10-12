import {
  getStudentMis
} from '../../api'

import {
  initLoginStatus,
  getDetails,
  getUserState
} from '../../utils/util'

const app =getApp()

Page({
  data: {
    scrollTop: 0,
    showTips: false,
    messageArr: [],
    showLoading: true,
    timer: null,
    curpage: 1,
    canLoadMore: true
  },
  getAllMess () {
    const _self = this
    if (_self.data.canLoadMore) {
      _self.setData({
        showLoading: true
      })
      wx.request({
        url: `${getStudentMis}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&mis_type=1&p=${_self.data.curpage}&nums=10`,
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
                  _self.setData({
                    curpage: ++_self.data.curpage,
                    canLoadMore: true
                  })
                } else {
                  _self.setData({
                    canLoadMore: false
                  })
                }
                _self.setData({
                  showLoading: false,
                  messageArr: _self.data.messageArr.concat(data)
                })
              } else {
                _self.setData({
                  showTips: !_self.data.showTips
                })
              }
            }
          }
        }
      })
    } else {
      _self.setData({
        showLoading: false
      })
    }
  },
  onLoad: function (options) {
    if (getUserState()) {
      this.getAllMess()
    } else {
      this.setData({
        showTips: !this.data.showTips
      })
    }
  },
  lower() {
    const self = this;
    wx.showNavigationBarLoading();
    if (self.timer) {
      clearTimeout(self.timer);
    }
    self.timer = setTimeout(() => {
      self.getAllMess()
      wx.hideNavigationBarLoading();
    }, 300);
  }
})