import { 
  getCollect,
  getNewCourse
} from "../../api";

const app = getApp();

Page({
  data: {
    scrollTop: 0,
    timer: null,
    curPage: 1,
    canGetMore: true,
    showLoading: false,
    curPage: 1,
    // 职位推荐
    courseList: [],

    fromKeyword: false,
    focus: false,
    searchTxt: '搜索课程或者讲师',
    keyword: ''
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
  iptConfirm(e) {
    let keyword = e.detail.value
    if (!!keyword) {
      this.setData({
        searchTxt: keyword,
        fromKeyword: false,
        keyword,
        curPage: 1,
        courseList: []
      })
      this.GetSearchCourse()
    }
    console.log(keyword)
  },
  linCourse(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../coursePlay/play?id=${id}`
    });
  },
  GetSearchCourse () {
    wx.showNavigationBarLoading();
    if (this.data.canGetMore) {
      this.setData({
        showLoading: true
      })
      wx.request({
        url: `${getNewCourse}${this.data.curPage}&nums=10&keyword=${this.data.keyword}`,
        success: res => {
          console.log(res)
          if (res.data.error == "0") {
            let data = res.data.listjson
            this.setData({
              courseList: this.data.courseList.concat(data),
              fromKeyword: true,
              showLoading: false
            });
            if (data.length < 10) {
              this.setData({
                canGetMore: false
              })
            } else {
              this.setData({
                curPage: ++this.data.curPage
              })
            }
          } else {
            this.setData({
              courseList: this.data.courseList.concat(data),
              fromKeyword: true,
              showLoading: false
            })
          }
          wx.hideNavigationBarLoading();
        }
      })
    }
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '课程搜索列表'
    })
    this.GetSearchCourse()
  },
  lower(e) {
    this.GetSearchCourse()
    this.setData({
      showLoading: true
    })
  }
});
