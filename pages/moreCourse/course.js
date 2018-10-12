import { getCRecommend } from "../../api.js";

let app = getApp()

Page({
  data: {
    student_id: app.globalData.student_id || wx.getStorageSync("student_id") || '',
    curpage: 1,
    canLoadMore: false,
    showLoading: false,
    scrollTop: 0,
    timer: null,
    // 职位推荐
    courseList: []
  },
  // 获取课程推荐
  getCRData() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getCRecommend}${this.data.curpage}&stu_id=${app.globalData.student_id}`,
        success: res => {
          const { error } = res.data;
          if (error == "0") {
            const { dataExsit } = res.data.result;
            this.setData({
              canLoadMore: dataExsit
            });
            if (dataExsit) {
              this.setData({
                curpage: ++this.data.curpage,
                showLoading: true
              });
            } else {
              this.setData({
                showLoading: false
              })
            }
          }
          resolve(res);
        },
        fail: err => {
          throw Error(err);
        },
        complete: res => {
          // console.log(res)
        }
      });
    });
  },
  linkCoursePlay (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../coursePlay/play?id=${id}`
    })
  },
  onLoad: function(options) {
    console.log(this.data.student_id)
    if (!!app.globalData.student_id) {
      this.getCRData().then(res => {
        console.log(res)
        const { error } = res.data;
        if (error == "0") {
          const { list } = res.data.result;
          this.setData({
            courseList: list
          });
        }
      });
    }
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  lower(e) {
    if (this.data.canLoadMore) {
      const self = this;
      wx.showNavigationBarLoading();
      if (self.timer) {
        clearTimeout(self.timer);
      }
      self.timer = setTimeout(() => {
        this.getCRData().then((res) => {
          const { error } = res.data;
          if (error == "0") {
            const { list } = res.data.result;
            this.setData({
              courseList: this.data.courseList.concat(list)
            });
          }
        })
        wx.hideNavigationBarLoading();
      }, 500);
    }
  }
});
