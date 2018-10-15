import {
  getIndexCRecommend,
  banner,
  getPositionList,
  getCompanyList,
  sendPositionHate,
  getStuForecast
} from '../../api.js';

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util';



const app = getApp()

Page({
  data: {
    key: -1,
    clicked: false,
    student_id: app.globalData.student_id || wx.getStorageSync("student_id") || '',
    // 轮播
    banner: [],
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    canautoplay: false,
    circular: true,
    interval: 5000,
    duration: 300,
    aiList: [],
    showAiTip: false,
    // 职位推荐
    jobList: [],
    // 名企推荐
    companyList: []
  },
  showTip(e) {
    let key = e.currentTarget.dataset.key
    let clicked = e.currentTarget.dataset.clicked
    if (clicked) {
      this.setData({
        clicked: false
      })
    } else {
      this.setData({
        key,
        clicked: true
      })
    }
  },
  noInterest (e) {
    let id = e.currentTarget.dataset.id
    if (getUserState()) {
      new Promise((resolve, reject) => {
        wx.request({
          url: `${sendPositionHate}`,
          data: {
            stu_id: app.globalData.student_id,
            token: app.globalData.token,
            position_id: id
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            console.log(res)
            if (res.data.error == '0') {
              wx.showToast({
                title: res.data.errortip,
                icon: 'none',
                duration: 1000
              })
              setTimeout(() => {
                resolve('OK')
              }, 500)
            }
          }
        })
      }).then(res => {
        if (res == 'OK') {
          this.getPositionListFun()
          this.setData({
            key: -1,
            clicked: false,
          })
        }
      })
    } else {
      navToLogin()
    }
  },
  linkMoreCompany () {
    wx.navigateTo({
      url: '../companyRecommend/company'
    })
  },
  linkMoreJob () {
    wx.navigateTo({
      url: '../jobRecommend/work'
    })
  },
  linkToEditInfor() {
    if (getUserState()) {
      wx.navigateTo({
        url: '../userInformation/information'
      })
    } else {
      navToLogin()
    }
  },
  closeTip() {
    if (getUserState()) {
      this.setData({
        showAiTip: false
      })
      wx.setStorageSync('showAiTip', false)
    } else {
      navToLogin()
    }
  },
  getAI() {
    let loginType = wx.getStorageSync('loginType')
    let _self = this
    if (getUserState()) {
      wx.request({
        url: `${getStuForecast}`,
        data: {
          stu_id: app.globalData.student_id,
          token: app.globalData.token
        },
        success: res => {
          console.log(res, 'ai')
          const { result } = res.data
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.getAI()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (!result.hasOwnProperty('length')) {
              const { list } = result
              if (!list.hasOwnProperty('length')) {
                console.log(wx.getStorageSync('showAiTip') === false)
                if (wx.getStorageSync('showAiTip') === '') {
                  this.setData({
                    showAiTip: true
                  })
                } else if (wx.getStorageSync('showAiTip') === false) {
                  this.setData({
                    showAiTip: false
                  })
                }
                this.setData({
                  aiList: list
                })
              } else {
                this.setData({
                  aiList: []
                })
              }
            } else {
              this.setData({
                aiList: []
              })
            }
          }
        }
      })
    } else {
      navToLogin()
    }
  },
  linkCourse () {
    if (getUserState()) {
      wx.navigateTo({
        url: '../moreCourse/course'
      })
    } else {
      navToLogin()
    }
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
  linkCompanyDetail (e) {
    if (getUserState()) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../companyDetail/detail?id=${id}`
      })
    } else {
      navToLogin()
    }
  },
  linkJobRecommend () {
    if (getUserState()) {
      wx.navigateTo({
        url: `../jobRecommend/work`
      })
    } else {
      navToLogin()
    }
  },
  linkCoursePlay (e) {
    let id = e.target.dataset.id
    // wx.navigateTo({
    //   url: `../coursePlay/play?id=${id}`
    // })
    if (getUserState()) {
      wx.navigateTo({
        url: `../coursePlay/play?id=${id}`
      })
    } else {
      navToLogin()
    }
  },
  linkCourseType (e) {
    wx.switchTab({
      url: `../navCourse/course`,
    })
  },
  linkResumeCenter() {
    // wx.navigateTo({
    //   url: '../resumeCenter/center'
    // })
    if (getUserState()) {
      wx.navigateTo({
        url: '../resumeCenter/center'
      })
    } else {
      navToLogin()
    }
  },
  // 获取首页轮播
  getBannerFun() {
    wx.request({
      url: `${banner}`,
      method: 'GET',
      success: res => {
        if (res.data.error == '0') {
          this.setData({
            banner: res.data.result
          })

          if (res.data.result.length > 1) {
            this.setData({
              indicatorDots: true
            })
          }
        }
      }
    })
  },
  // 获取首页课程推荐轮播
  getIndexCRecommendFun() {
    wx.request({
      url: `${getIndexCRecommend}`+(!!app.globalData.student_id?`?stu_id=${app.globalData.student_id}`:''),
      success: res => {
        const { result } = res.data
        if (res.data.error == '0') {
          this.setData({
            imgUrls: result
          })
        }
      }
    })
  },
  // 获取职位推荐
  getPositionListFun() {
    wx.request({
      url: `${getPositionList}`,
      data: {
        isai: 1,
        p: '1',
        isrom: '1',
        nums: '4',
        stu_id: getUserState() ? `${app.globalData.student_id}` : '0'
      },
      method: 'GET',
      success: (res) => {
        if (res.data.error == '0') {
          console.log(res.data)
          this.setData({
            jobList: res.data.result.list
          })
        }
      }
    })
  },
  // 获取企业推荐
  getCompanyListFun() {
    wx.request({
      url: `${getCompanyList}`,
      data: {
        p: '1',
        isrom: '1',
        nums: '4',
        stu_id: getUserState() ? `${app.globalData.student_id}` : '0'
      },
      method: 'GET',
      success: (res) => {
        if (res.data.error == '0') {
          this.setData({
            companyList: res.data.result.list
          })
        }
      }
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '首页'
    })
    this.getAI()
    this.getBannerFun()
    this.getIndexCRecommendFun()
    this.getPositionListFun()
    this.getCompanyListFun()
  }
})