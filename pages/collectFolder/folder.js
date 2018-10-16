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
    fliterType: 'job',
    jobList: [],
    companyList: []
  },
  //获取收藏的职位
  getPositionCollectFun() {
    wx.request({
      url: `${getPositionCollect}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=1&nums=10`,
      method: 'GET',
      success: res => {
        console.log(res, 11231)
        if (res.data.error == '0') {
          const { list } = res.data.result
          this.setData({
            showPos: true,
            jobList: this.data.jobList.concat(list)
          })
        }
      }
    })
  },
  //获取收藏的公司
  getCompanyCollectFun() {
    wx.request({
      url: `${getCompanyCollect}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=1&nums=10`,
      method: 'GET',
      success: res => {
        console.log(res, 5436436)
        if (res.data.error == '0') {
          const { list } = res.data.result
          this.setData({
            showCompany: true,
            companyList: this.data.companyList.concat(list)
          })
        }
      }
    })
  },
  changeCokllectFilter(e) {
    let type = e.target.dataset.type
    this.setData({
      fliterType: type
    })
    if (this.data.fliterType == 'job') {
      this.setData({
        showPos: true,
        jobList: []
      })
      this.getPositionCollectFun()
    } else if (this.data.fliterType == 'company') {
      this.setData({
        showCompany: true,
        companyList: []
      })
      this.getCompanyCollectFun()
    }
  },
  onLoad: function (options) {
    this.getPositionCollectFun()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})