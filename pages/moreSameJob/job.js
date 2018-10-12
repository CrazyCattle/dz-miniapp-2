import { 
  getCRecommend,
  getPositionList
 } from "../../api.js";

import {
  getUserState,
  navToLogin
} from '../../utils/util'

let app = getApp()

Page({
  data: {
    student_id: app.globalData.student_id || wx.getStorageSync("student_id") || '',
    curpage: 1,
    canLoadMore: true,
    showLoading: false,
    scrollTop: 0,
    timer: null,
    jobList: [],
    id: undefined
  },
  linkJobDetail (e) {
    if (getUserState()) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../jobDetail/detail?id=${id}`
      })
    } else {
      navToLogin()
    }
  },
  getSameCompany(pId) {
    if (this.data.canLoadMore) {
      wx.request({
        url: `${getPositionList}`,
        data: {
          p: this.data.curpage,
          nums: 10,
          positiontype_id: pId
        },
        success: res => {
          if (res.data.error == '0') {
            const { list } = res.data.result
            this.setData({
              jobList: this.data.jobList.concat(list)
            })
            if (list.length >= 10) {
              this.setData({
                canLoadMore: true,
                curpage: ++this.data.curpage
              })
            } else {
              this.setData({
                canLoadMore: false
              })
            }
          }
        }
      })
    } else {
      this.setData({
        showLoading: false
      })
    }
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getSameCompany(this.data.id)
  },
  lower(e) {
    const self = this;
    self.setData({
      showLoading: true
    })
    wx.showNavigationBarLoading();
    if (self.timer) {
      clearTimeout(self.timer);
    }
    self.timer = setTimeout(() => {
      this.getSameCompany(this.data.id)
      wx.hideNavigationBarLoading();
    }, 500);
  }
});
