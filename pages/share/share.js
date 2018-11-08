import {
  wxAuthorization,
  getStuClassLimit,
  SubVisitorer,
  StuVisitorer,
  getSClass,
  classTwoLesson,
  getLessonShare,
  SubIsVisitorer,
  SubOneVisitorer,
  getCheckoutShare
} from '../../api.js'

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    cId: undefined,
    isSupport: false,
    from_id: undefined,

    userToken: '',
    avatarUrl: '',
    nickName: '',

    friendList: [],
    courseDetails: {},
    isShared: false,
    hasPower: 0,
    shareTimes: 0,
    showGetCourse: false,
    hasGetCourse: false,

    showGetCoursePop: false
  },

  linkToIndex () {
    wx.reLaunch({
      url: '../navIndex/index',
    })
  },

  linkToCourse (e) {
    let id = e.currentTarget.dataset.id

    let promise = new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res)
        }
      });
    })
    promise.then((res) => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${wxAuthorization}`,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            code: res.code
          },
          success: res => {
            resolve(res)
          }
        })
      })
    }).then(res => {
      const { result } = res.data
      wx.request({
        url: `${getCheckoutShare}`,
        data: {
          class_id: this.data.cId,
          from_student_id: this.data.from_id,
          wxtoken: result.openid
        },
        success: res => {
          app.globalData.shareOpenid = result.openid
          wx.setStorageSync('shareOpenid', result.openid)
          console.log(app.globalData.shareOpenid)
          if (res.data.error == 0) {
            wx.navigateTo({
              url: `../courseChild/course?id=${id}`
            })
          } else {
            wx.navigateTo({
              url: `../shareRegister/register?cId=${this.data.cId}&fromId=${this.data.from_id}`
            })
          }
        }
      })
    })
  },

  GetLessonShareStatus (id) {
    let loginType = wx.getStorageSync('loginType')
    wx.request({
      url: `${getLessonShare}?token=${app.globalData.token}&stu_id=${app.globalData.student_id}&class_id=${id}`,
      success: res => {
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                this.GetLessonShareStatus()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          wx.showToast({
            title: res.data.errortip,
            icon: "none",
            duration: 1000
          });
          console.log('GetLessonShareStatus', res.data)
          this.setData({
            showGetCourse: false
          })
        }
      }
    })
  },

  GetCourse (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    if (getUserState()) {
      // this.GetLessonShareStatus(id)
      this.setData({
        hasGetCourse: false
      })
      // this.linkCourse()
    } else {
      navToLogin()
    }
  },

  linkCourse (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: `../courseChild/course?id=${id}`,
    })
  },

  getLesson () {
    let loginType = wx.getStorageSync('loginType')
    wx.request({
      url: `${getStuClassLimit}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&class_id=${this.data.cId}`,
      success: res => {
        console.log(res.data)
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                this.getLesson()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (res.data.error == 0) {
            console.log(res, 111)
            const data = res.data.listjson
            if (data.share_islimits == 1) {
              this.setData({
                hasPower: 1,
                shareTimes: data.share_times
              })
            } else {
              this.setData({
                hasPower: 0,
                shareTimes: data.share_times
              })
            }
          } else {
            if (res.data.listjson.share_islimits == 0) {
              this.setData({
                hasPower: 0,
                shareTimes: res.data.listjson.share_times
              })
            }
          }
        }
      }
    })
  },

  // 获取 支持用户的列表
  getFriendList () {
    wx.request({
      url: `${StuVisitorer}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&class_id=${this.data.cId}`,
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            friendList: res.data.listjson
          })
        } else {
          this.setData({
            friendList: []
          })
        }
      }
    })
  },

  // 获取 分享的课程详情
  getCourseDetail () {
    wx.request({
      url: `${classTwoLesson}?class_id=${this.data.cId}`,
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            courseDetails: res.data.listjson,
            c_name: res.data.listjson.class_name
          })
        }
      }
    })
  },

  // 判断是否是自己
  isMySelf () {
    wx.request({
      url: `${SubOneVisitorer}`,
      data: {
        from_student_id: this.data.from_id,
        visitorer_wxtoken: this.data.userToken
      },
      success: res => {
        // console.log(res, 'isMySelf')
        // wx.showToast({
        //   title: res.data.errortip,
        //   icon: "none",
        //   duration: 1000
        // });
        if (res.data.error == 0) {
          this.getLesson()
          this.getFriendList()
          this.setData({
            isShared: false
          })
        } else {
          this.setData({
            isShared: true
          })
        }
      }
    })
  },

  // 该用户是否 支持过分享的页面
  isSupportFun () {
    wx.request({
      url: `${SubIsVisitorer}`,
      data: {
        class_id: this.data.cId,
        from_student_id: this.data.from_id,
        visitorer_wxtoken: this.data.userToken
      },
      success: res => {
        console.log(res, 'isSupport')
        
        console.log('isSupportFun：', res.data)
        if (res.data.error == 0) {
          this.setData({
            showGetCourse: true,
            hasGetCourse: true
          })
        }
      }
    })
  },

  // 获取用户提交数据
  getUserSupport () {
    wx.request({
      url: `${SubVisitorer}`,
      data: {
        class_id: this.data.cId,
        from_student_id: this.data.from_id,
        visitorer_wxtoken: this.data.userToken,
        visitorer_nickname: this.data.nickName,
        visitorer_avatar: this.data.avatarUrl
      },
      success: res => {
        console.log(res, '获取用户提交数据 getUserSupport')
        // if (res.data.error == 0) {
          // this.setData({
          //   showGetCourse: true,
          //   hasGetCourse: true
          // })
        // }
        // if (res.data.error == 0) {
        // } else if (res.data.error == 1) {
        // }
      }
    })
  },
  

  linkToShareLogin (e) {
    let cId = e.currentTarget.dataset.id

    console.log(cId, this.data.from_id, 'hahhah')
    if (app.globalData.token && app.globalData.student_id) {
      wx.showLoading()
      this.setShareLimit()
    } else {
      wx.navigateTo({
        url: `../shareRegister/register?cId=${cId}&fromId=${this.data.from_id}`
      })
    }
  },

  setShareLimit() {
    wx.request({
      url: `${getLessonShare}?token=${app.globalData.token}&stu_id=${app.globalData.student_id}&class_id=${this.data.cId}`,
      success: res => {
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                this.setShareLimit()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          wx.hideLoading()
          this.setData({
            showGetCourse: true,
            hasGetCourse: true,
            showGetCoursePop: false
          })
        }
      }
    })
  },

  getUserInfo(e) {
    if (e.detail.encryptedData) {
      const rawData = JSON.parse(e.detail.rawData)
      this.setData({
        isSupport: true,
        avatarUrl: rawData.avatarUrl,
        nickName: rawData.nickName
      })
      this.getUserSupport()
      this.setData({
        showGetCoursePop: true
      })
    }
  },

  // 获取 登录用户的openid
  getUserToken () {
    new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res)
        }
      });
    }).then(res => {
      wx.request({
        url: `${wxAuthorization}`,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          code: res.code
        },
        success: res => {
          if (res.data.error == 0) {
            this.setData({
              userToken: res.data.result.openid
            })

            this.getCourseDetail()

            if (!this.data.from_id) {
              this.getLesson()
              this.getFriendList()
            } else {
              this.isSupportFun()
              if (this.data.userToken == app.globalData.openid) {
                this.isMySelf()
              } else {
                this.setData({
                  isShared: true
                })
              }
            }
            // if (this.data.userToken == app.globalData.openid) {
            //   this.getLesson()
            //   this.getFriendList()
            // } else if (this.data.userToken !== app.globalData.openid && this.data.from_id){
            //   this.setData({
            //     isShared: true
            //   })

            //   this.isSupport()
            // }
            console.log(this.data.userToken == app.globalData.openid, '000')
          }
        }
      })
    })
  },

  onLoad: function (options) {
    console.log(options)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      let ids = scene.split('and')
      this.setData({
        cId: ids[0],
        from_id: ids[1]
      })
    } else {
      this.setData({
        cId: options.id,
        from_id: options.from_student_id || ''
      })
    }
  },

  onShow () {
    this.getUserToken()
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      // title: `${this.data.c_name}`,
      title: '我正在看大招职观求职课，快来支持我！',
      // imageUrl: '',
      path: `pages/share/share?id=${this.data.cId}&from_student_id=${app.globalData.student_id}`,
      success: function (res) {
        console.log(res)
      }
    }
  }
})