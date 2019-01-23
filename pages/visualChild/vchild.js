import {
  getCClass
} from '../../api';
Page({
  data: {
    list: []
  },
  linkToChild(e) {
    const cId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../courseChild/course?id=${cId}`
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    wx.request({
      url: `${getCClass}?class_id=${options.id}`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == 0) {
          this.setData({
            list: res.data.listjson
          })
        }
      }
    })
  }
})