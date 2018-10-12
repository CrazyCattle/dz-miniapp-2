import {
  getUnivNotice
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
    canLoadMore: true,
    content: {}
  },
  linkDetail (e) {
    const id = e.currentTarget.dataset.id

    this.data.messageArr.forEach(e => {
      if (e.notice_id == id) {
        console.log(e)
        wx.navigateTo({
          url: `../inforNoticeDetail/detail?content=${JSON.stringify(e)}`
        })
      }
    })
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
  },
  getAllMess () {
    const _self = this
    if (_self.data.canLoadMore) {
      _self.setData({
        showLoading: true
      })
      wx.request({
        url: `${getUnivNotice}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=${_self.data.curpage}&nums=10`,
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
  onShow: function () {
  
  },
  onUnload: function () {
  
  },
  onReachBottom: function () {
  
  }
})