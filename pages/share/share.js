import {
  wxAuthorization,
  getStuClassLimit,
  SubVisitorer,
  StuVisitorer,
  getSClass,
  classTwoLesson,
  getLessonShare
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

    userToken: '',
    avatarUrl: '',
    nickName: '',

    friendList: [],
    courseDetails: {},
    isShared: false,
    hasPower: 0,
    shareTimes: 0,
    showGetCourse: false,
    hasGetCourse: false
  },
  linkToIndex () {
    wx.reLaunch({
      url: '../navIndex/index',
    })
  },
  linkToCourse (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../courseChild/course?id=${id}`
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
          this.setData({
            showGetCourse: false,
            hasGetCourse: true
          })
        }
      }
    })
  },
  GetCourse (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    if (getUserState()) {
      this.GetLessonShareStatus(id)
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
  getCourseDetail () {
    wx.request({
      url: `${classTwoLesson}?class_id=${this.data.cId}`,
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            courseDetails: res.data.listjson
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

      wx.request({
        url: `${SubVisitorer}`,
        data: {
          class_id: this.data.cId,
          from_student_id: this.data.from_student_id,
          visitorer_wxtoken: this.data.userToken,
          visitorer_nickname: this.data.nickName,
          visitorer_avatar: this.data.avatarUrl
        },
        success: res => {
          wx.showToast({
            title: res.data.errortip,
            icon: "none",
            duration: 1000
          });
          this.setData({
            showGetCourse: true
          })
          // if (res.data.error == 0) {
          // } else if (res.data.error == 1) {
          // }
        }
      })
    }
  },

  getUserToken () {
    new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          console.log(res, 123456)
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
          console.log(res, 1234)
          if (res.data.error == 0) {
            this.setData({
              userToken: res.data.result.openid
            })
          }
        }
      })
    })
  },
  getUser() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res, 1111);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
              
            }
          });
        }
      }
    });
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cId: options.id
    })
    if (!options.from_student_id) {
      this.getLesson()
      this.getFriendList()
    } else {
      this.setData({
        isShared: true,
        from_student_id: options.from_student_id
      })
      this.getUserToken()

      // 获取 进入分享 用户的信息
      // wx.getUserInfo({
      //   success: res => {
      //     console.log(res, 'init')
      //     if (res.errMsg == 'getUserInfo:ok') {
      //       this.setData({
      //         isSupport: true
      //       })
      //     }
      //   }
      // })
    }
    this.getCourseDetail()
  },
  
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: this.data.c_name,
      // imageUrl: '',
      path: `pages/share/share?id=${this.data.cId}&from_student_id=${app.globalData.student_id}`,
      success: function (res) {
        console.log(res)
      }
    }
  }
})