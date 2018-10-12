import {
  getCClass,
  getIndexCRecommend,
  getCollect,
  getHistory,
  getNewCourse
} from '../../api';

const app = getApp()

Page({
  data: {
    isBack: false,
    page2Show: false,
    page3Show: false,

    showCollectMore: false,
    showHistoryMore: false,

    showLoading: false,
    placeholderTxt: '搜索课程、讲师或关键字',
    focus: false,
    page: 1,
    // page 1数据
    typeArr: [],
    // page 2 轮播
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    canautoplay: false,
    circular: true,
    interval: 2500,
    duration: 300,
    // 发现好课
    courseList: [],
    curCoursePage: 1,
    dataExsit: false,

    // page 3
    courseCollected: [],
    courseHistory: [],
    page3RecordShow: false,
    taped: false
  },
  iptFocus(e) {
    this.setData({
      focus: !this.data.focus,
      taped: !this.data.taped
    })
    console.log(this.data.focus)
  },
  cc() {
    this.setData({
      focus: !this.data.focus,
      taped: !this.data.taped
    })
  },
  searchChange(e) {
    console.log(e.detail.value)

  },
  iptConfirm(e) {
    let keyword = e.detail.value
    wx.navigateTo({
      url: `../courseCollection/collect?keyword=${keyword}`
    })
  },
  linkCourse() {
    if (!!app.globalData.student_id) {
      wx.navigateTo({
        url: '../moreCourse/course'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      })
    }
  },
  linkCoursePlay(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: `../coursePlay/play?id=${id}`
    })
  },
  tabPage(e) {
    let page = e.target.dataset.page
    this.setData({
      page: page
    })

    if (page == 1) {
      this.setData({
        page3Show: false
      })
      if (this.data.typeArr.length == 0) {
        this.getTypeClass()
      }
    }

    if (page == 2) {
      this.setData({
        page3Show: false
      })
      if (this.data.imgUrls.length == 0) {
        wx.request({
          url: `${getIndexCRecommend}` + (!!app.globalData.student_id ? `?stu_id=${app.globalData.student_id}` : ''),
          success: res => {
            console.log(res)
            const { result } = res.data
            this.setData({
              imgUrls: result
            })
          }
        })
      }

      if (this.data.courseList.length == 0) {
        wx.request({
          url: `${getNewCourse}${this.data.curCoursePage}` + (!!app.globalData.student_id ? `&stu_id=${app.globalData.student_id}` : ''),
          data: {},
          method: 'GET',
          success: res => {
            console.log(res, '1111111111')
            const { error } = res.data
            if (error == '0') {
              this.setData({
                courseList: res.data.result,
                curCoursePage: ++this.data.curCoursePage,
                dataExsit: res.data.dataExsit
              })
            }
          },
          fail: res => {
            throw Error(res)
          },
          complete: res => {
            // complete
          }
        })
      }
    }

    if (page == 3) {
      if (!!app.globalData.student_id) {
        this.getCollectCourse()
        this.getHistoryCourse()
      } else {
        this.setData({
          page2Show: false,
          page3Show: true
        })
      }
    }

  },
  getCollectCourse() {
    wx.request({
      url: `${getCollect}?num=3&stu_id=${app.globalData.student_id}`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          if (res.data.result.length > 0) {
            this.setData({
              courseCollected: res.data.result,
              showCollectMore: res.data.dataExsit,
              page3Show: false
            })
          } else {
            this.setData({
              courseCollected: [],
              page3Show: true
            })
          }
        }
      },
      fail: res => {
        throw Error(res)
      },
      complete: res => {
        // complete
      }
    })
  },
  getHistoryCourse() {
    wx.request({
      url: `${getHistory}?num=3&stu_id=${app.globalData.student_id}`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          if (res.data.result.length > 0) {
            this.setData({
              courseHistory: res.data.result,
              showHistoryMore: res.data.dataExsit,
              page3RecordShow: false
            })
          } else {
            this.setData({
              page3RecordShow: true
            })
          }
        }
      }
    })
  },
  linkChildPage(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: `../courseChild/course?id=${id}`
    })
  },
  linkCollect() {
    wx.navigateTo({
      url: '../courseCollection/collect'
    })
  },
  linkRecord() {
    wx.navigateTo({
      url: '../courseRecord/record'
    })
  },
  linCourse(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../coursePlay/play?id=${id}`
    })
  },
  getTypeClass() {
    wx.request({
      url: `${getCClass}`,
      method: 'GET',
      success: res => {
        const { error } = res.data
        if (error == '0') {
          const { result } = res.data
          this.setData({
            typeArr: result
          })
        }
        console.log(res)
      }
    })
  },
  onLoad: function (options) {
    if (options.page && options.page == '3') {
      this.setData({
        page: 3
      })
      this.getCollectCourse()
      this.getHistoryCourse()
    } else {
      this.getTypeClass()
    }
  },
  onShow() {
    console.log(this.data.isBack, this.data.page == '3')
    if (this.data.isBack) {
      if (this.data.page == '3') {
        this.getCollectCourse()
        this.getHistoryCourse()
        console.log(this.data.page, this.data.page3Show)
      }

      if (this.data.taped) {
        this.setData({
          focus: !this.data.focus
        })
      }
    }
    console.log(this.data.page == '3')
    this.setData({
      isBack: true
    })
  },
  onReachBottom: function () {
    if (this.data.page == 2 && this.data.dataExsit) {
      this.setData({
        showLoading: true
      })
      wx.request({
        url: `${getNewCourse}${this.data.curCoursePage}` + (!!app.globalData.student_id ? `&stu_id=${app.globalData.student_id}` : ''),
        method: 'GET',
        success: res => {
          const { error } = res.data
          if (error == '0') {
            this.setData({
              courseList: this.data.courseList.concat(res.data.result),
              dataExsit: res.data.dataExsit,
              showLoading: false
            })
            if (this.data.dataExsit) {
              this.setData({
                curCoursePage: ++this.data.curCoursePage
              })
            }
          }
        },
        fail: res => {
          throw Error(res)
        },
        complete: res => {
          // complete
        }
      })
    }
  }
})