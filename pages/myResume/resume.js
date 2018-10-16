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
    // page 1
    resumeList: [],
    list: [
      {
        imgUrl: 'https://static.dazhao100.cn/pic/1526907753l016152041.png',
        title: '企业服务部实习生',
        time: '2016.12.30',
        company: '上海脚步网络科技有限公司',
        status: 0
      },
      {
        imgUrl: 'https://static.dazhao100.cn/pic/1526907753l016152041.png',
        title: '企业服务部实习生',
        time: '2016.12.30',
        company: '上海脚步网络科技有限公司',
        status: 1
      },
      {
        imgUrl: 'https://static.dazhao100.cn/pic/1526907753l016152041.png',
        title: '企业服务部实习生',
        time: '2016.12.30',
        company: '上海脚步网络科技有限公司',
        status: 2
      },
      {
        imgUrl: 'https://static.dazhao100.cn/pic/1526907753l016152041.png',
        title: '企业服务部实习生',
        time: '2016.12.30',
        company: '上海脚步网络科技有限公司',
        status: 2
      }
    ]
  },
  linkResume(e) {
    let resumes_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../resume/resume?resumes_id=${resumes_id}`,
    })
  },
  editResumeBasicInfor(e) {
    let id = e.currentTarget.dataset.id
    let lan = (e.target.dataset.lan == '1' ? 'en' : 'cn')
    wx.navigateTo({
      url: `../editResumeBasicInfor/infor?id=${id}&lan=${lan}`,
    })
  },
  getResume() {
    let loginType = wx.getStorageSync('loginType')
    let _self = this

    wx.request({
      url: `${resumeList}`,
      method: 'POST',
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res)
        const { error } = res.data

        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.getResume()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (error == '0') {
            this.setData({
              resumeList: res.data.listjson
            })
            if (res.data.listjson.length == '0') {
              this.setData({
                noResumeList: !this.data.noResumeList
              })
            }
          } else if (error == '1') {
            this.setData({
              resumeList: [],
              noResumeList: !this.data.noResumeList
            })
          }
        }
      },
      fail: res => {
        throw Error(res)
      },
      complete: res => {
        // res
      }
    })
  },
  onLoad: function (options) {
    if (getUserState() && !!app.globalData.student_id && !!app.globalData.token) {
      this.getResume()
    } else {
      navToLogin()
    }
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})