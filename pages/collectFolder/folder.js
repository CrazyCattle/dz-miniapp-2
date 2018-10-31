import {
  getPositionCollect,
  getCompanyCollect
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
    fliterType: 'job',
    curpage: 1,
    jobList: [],
    companyList: [],
    isJobBack: false,
    isComBack: false,

    canLoadMore: true,
    showLoading: true
  },
  linkToJobDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobDetail/detail?id=${id}`
    })
  },
  linkCompanyDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../companyDetail/detail?id=${id}`
    })
  },
  //获取收藏的职位
  getPositionCollectFun() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    if (this.data.canLoadMore) {
      this.setData({
        showLoading: true
      })
      wx.request({
        url: `${getPositionCollect}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=${this.data.curpage}&nums=10`,
        method: 'GET',
        success: res => {
          console.log(res, 11231)
          let data = res.data.listjson
          if (res.data.error == '0') {
            if (data.length > 0) {
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
                showLoading: false,
                jobList: this.data.jobList.concat(data)
              })
            } else {
              this.setData({
                showLoading: false,
                showTips: !this.data.showTips
              })
            }
          } else {
            this.setData({
              canLoadMore: false,
              showLoading: false,
              jobList: this.data.jobList.concat(data)
            })
          }
        }
      })
    }
  },
  //获取收藏的公司
  getCompanyCollectFun() {
    if (this.data.canLoadMore) {
      this.setData({
        showLoading: true
      })
      wx.request({
        url: `${getCompanyCollect}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=${this.data.curpage}&nums=10`,
        method: 'GET',
        success: res => {
          let data = res.data.listjson
          if (res.data.error == '0') {
            if (data.length > 0) {
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
                showLoading: false,
                companyList: this.data.companyList.concat(data)
              })
            } else {
              this.setData({
                showLoading: false
              })
            }
          } else {
            this.setData({
              canLoadMore: false,
              showLoading: false,
              companyList: this.data.companyList.concat(data)
            })
          }
        }
      })
    }
  },
  changeCokllectFilter(e) {
    let type = e.target.dataset.type
    this.setData({
      fliterType: type,
      showLoading: true,
      curpage: 1,
      canLoadMore: true
    })
    if (this.data.fliterType == 'job') {
      this.setData({
        jobList: [],
        isJobBack: true,
        isComBack: false
      })
      this.getPositionCollectFun()
    } else if (this.data.fliterType == 'company') {
      this.setData({
        companyList: [],
        isJobBack: false,
        isComBack: true
      })
      this.getCompanyCollectFun()
    }
  },
  onLoad: function (options) {
    if (getUserState() && !!app.globalData.student_id && !!app.globalData.token) {
      this.getPositionCollectFun()
    } else {
      navToLogin()
    }
  },
  onShow: function () {
    if (this.data.isJobBack) {
      this.setData({
        fliterType: 'job',
        showLoading: true,
        curpage: 1,
        canLoadMore: true,
        jobList: []
      })
      this.getPositionCollectFun()
    } else if (this.data.isComBack) {
      this.setData({
        fliterType: 'company',
        showLoading: true,
        curpage: 1,
        canLoadMore: true,
        companyList: []
      })
      this.getCompanyCollectFun()
    }
    if (this.data.fliterType == 'job') {
      this.setData({
        isJobBack: true,
        isComBack: false
      })
    } else {
      this.setData({
        isJobBack: false,
        isComBack: true
      })
    }
  }
})