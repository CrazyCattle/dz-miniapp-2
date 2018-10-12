import { 
  getPlayUrl,
  collect
} from '../../api';

const app = getApp()

Page({
  data: {
    // 视频 信息
    controls: true,
    autoplay: false,
    showPlayBtn: true,
    showCenterPlayBtn: false,
    playInfor: {},
    
    courseId: undefined,
    active: false,
    menuActive: false,
    collected: false
  },
  more () {
    this.setData({
      active: !this.data.active
    })
  },
  showMenu () {
    this.setData({
      menuActive: !this.data.menuActive
    })
  },
  hideCourseList () {
    if (this.data.menuActive) {
      this.setData({
        menuActive: false
      })
    }
  },
  linkCoursePlay (e) {
    let curid = e.target.dataset.curid
    let id = e.target.dataset.id
    if (curid !== id) {
      wx.navigateTo({
        url: `../coursePlay/play?id=${id}`
      })
    }
  },
  collectCourse (e) {
    if (!!app.globalData.student_id) {
      let id = e.currentTarget.dataset.id
      wx.request({
        url: `${collect}?stu_id=${app.globalData.student_id}&lesson_id=${id}`,
        success: res => {
          console.log(res)
          if (res.data.error == '0') {
            wx.showToast({
              title: res.data.errortip,
              icon: "none",
              duration: 1000
            });
            this.setData({
              collected: !this.data.collected
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '登陆后才能收藏',
        icon: "none",
        duration: 1000
      });
    }
  },
  onLoad: function (options) {
    let id = options.id
    this.setData({
      courseId: id
    })
    wx.request({
      url: `${getPlayUrl}${id}`+(app.globalData.student_id?`&stu_id=${app.globalData.student_id}`:''),
      method: 'GET',
      success: res => {
        console.log(res)
        const { error } = res.data
        if (error == '0') {
          const { result } = res.data
          console.log(result)
          this.setData({
            playInfor: result,
            collected: result.collect
          })
          wx.setNavigationBarTitle({
            title: result.lesson_name
          })
        }
      },
      fail: err => {
        throw Error(err);
      },
      complete: res => {
        // console.log(res)
      }
    })
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '简历择业',
      path: `pages/coursePlay/play?id=${this.data.courseId}`,
      success: function(res) {
        console.log(res)
      }
    }
  }
})