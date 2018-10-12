// pages/resumeCenterDropbox/index.js
Page({
  data: {
    item: {}
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      item: JSON.parse(options.item)
    })
  }
})