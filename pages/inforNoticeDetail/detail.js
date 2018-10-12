Page({
  data: {
    content: {},
    tempFilePath: ''
  },
  downFiles(e) {
    let url = e.currentTarget.dataset.url
    new Promise((resolve, reject) => {
      wx.downloadFile({
        url: `https://static.dazhao100.cn/${url}`,
        success: res => {
          if (res.statusCode == 200 && res.errMsg == 'downloadFile:ok') {
            this.setData({
              tempFilePath: res.tempFilePath
            })
            resolve(res.tempFilePath)
          } else {
            wx.showToast({
              icon: 'none',
              title: '下载失败',
              duration: 1000
            })
            reject(res)
          }
        }
      })
    }).then(res => {
      wx.openDocument({
        filePath: res,
        success: data => {
          console.log(data)
        }
      })
    })
    
    console.log(url)
  },
  onLoad: function (options) {
    this.setData({
      content: JSON.parse(options.content)
    })
  },
  onShow: function () {}
})