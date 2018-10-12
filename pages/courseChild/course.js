import { getSClass } from '../../api.js';

const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    showMore: false,
    class_name: '',
    class_intro: {},
    classThree: [],
    c_id: '',
    courseList: [
      {
        user_pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        user_name: 'test saj 1',
        pic_url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        title: '第一次求职？来看这里',
        learning: '232',
        data: '06:16'
      },
      {
        user_pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        user_name: 'test saj 1',
        pic_url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        title: '简历吐槽大会，这里有你的吗？',
        learning: '232',
        data: '06:16'
      },
      {
        user_pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        user_name: 'test saj 1',
        pic_url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        title: '第一次求职？来看这里',
        learning: '232',
        data: '06:16'
      }
    ],
  },
  linkShare () {
    wx.navigateTo({
      url: '../share/share',
    })
  },
  showMore () {
    this.setData({
      showMore: !this.data.showMore
    })
  },
  linkCoursePlay (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../coursePlay/play?id=${id}`,
    })
  },
  getPhoneNumber (e) {
    console.log(e)
  },
  onLoad: function (options) {
    let id = options.id
    let _self = this
    this.setData({
      c_id: id
    })

    wx.request({
      url: `${getSClass}${id}`,
      method: 'GET',
      success: res => {
        console.log(res)
        const { error } = res.data
        if (error == '0') {
          console.log(res.data.result)
          const { class_intro, classThree } = res.data.result
          const article = class_intro.class_intro
          const { class_name } = class_intro
          _self.setData({
            class_name: `${class_name}系列课程`
          })
          wx.setNavigationBarTitle({
            title: this.data.class_name
          })
          WxParse.wxParse('article', 'html', article, _self, 5);
          this.setData({
            classThree
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: `${this.data.class_name}系列课程`,
      path: `pages/courseChild/course?id=${this.data.c_id}`,
      success: function (res) {
        console.log(res)
      }
    }
  }
})