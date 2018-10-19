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
    swiperIndex: 0,

    key: -1,
    clicked: false,
    student_id: app.globalData.student_id || wx.getStorageSync("student_id") || '',
    // 轮播
    banner: [],

    autoplay: true,
    canautoplay: true,
    circular: true,
    interval: 5000,
    duration: 300,
    aiList: [],

    workType: 1,
    orderby: 0,
    isai: 1,
    baseCity: '',
    baseCityId: '',

    showAiTip: false,
    // 职位推荐
    jobList: [],
    // 名企推荐
    companyList: [],

    // 推荐区域显示
    showType: 1
  },
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  exchangeCity () {
    wx.navigateTo({
      url: '../exchangeCity/city'
    })
  },
  linkSearch () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  showRecommend (e) {
    let type = e.currentTarget.dataset.type
    console.log(type)
    this.setData({
      showType: type
    })

    if (type == 1) {
      this.setData({
        orderby: 0,
        isai: 1,
      })
      this.getPositionListFun()
    } else if (type == 2) {
      this.setData({
        orderby: 1,
        isai: 0,
      })
      this.getPositionListFun()
    } else if( type == 3) {
      this.getCompanyListFun()
    }
  },
  changeWT (e) {
    let id = e.currentTarget.dataset.id
    if (id !== this.data.workType) {
      this.setData({
        workType: id
      })
      this.getPositionListFun()
    }
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
          // const { result } = res.data
          // if (res.data.tokeninc == '0') {
          //   if (loginType == 'wxlogin') {
          //     setNewToken().then(res => {
          //       if (res == 'ok') {
          //         _self.getAI()
          //       }
          //     })
          //   } else {
          //     initLoginStatus()
          //   }
          // } else {
          //   if (!result.hasOwnProperty('length')) {
          //     const { list } = result
          //     if (!list.hasOwnProperty('length')) {
          //       console.log(wx.getStorageSync('showAiTip') === false)
          //       if (wx.getStorageSync('showAiTip') === '') {
          //         this.setData({
          //           showAiTip: true
          //         })
          //       } else if (wx.getStorageSync('showAiTip') === false) {
          //         this.setData({
          //           showAiTip: false
          //         })
          //       }
          //       this.setData({
          //         aiList: list
          //       })
          //     } else {
          //       this.setData({
          //         aiList: []
          //       })
          //     }
          //   } else {
          //     this.setData({
          //       aiList: []
          //     })
          //   }
          // }
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
            banner: res.data.listjson
          })

          if (res.data.listjson.length > 1) {
            this.setData({
              indicatorDots: true
            })
          }
        }
      }
    })
  },

  getPositionListFun() {
    wx.request({
      url: `${getPositionList}`,
      data: {
        p: 1,
        isrom: '1',
        nums: 10,
        city_id: this.data.baseCityId,
        stu_id: getUserState() ? `${app.globalData.student_id}` : '0',
        isai: this.data.isai,
        workType: this.data.workType,
        orderby: this.data.orderby
      },
      method: 'GET',
      success: (res) => {
        if (res.data.error == '0') {
          console.log(res.data)
          this.setData({
            jobList: res.data.listjson
          })
        } else {
          this.setData({
            jobList: []
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
        city: this.data.baseCity,
        stu_id: getUserState() ? `${app.globalData.student_id}` : '0',
        workType: this.data.workType,
      },
      method: 'GET',
      success: (res) => {
        if (res.data.error == '0') {
          this.setData({
            companyList: res.data.listjson
          })
        } else {
          this.setData({
            companyList: []
          })
        }
      }
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '首页'
    })

    this.setData({
      baseCity: app.globalData.baseCity,
      baseCityId: app.globalData.baseCityId,
    })

    this.getAI()
    this.getBannerFun()
    // this.getIndexCRecommendFun()
    this.getPositionListFun()
    this.getCompanyListFun()
  }
})