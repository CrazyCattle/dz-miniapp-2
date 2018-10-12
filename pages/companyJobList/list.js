import {
  getPositionList
} from '../../api'

import {
  initLoginStatus,
  setNewToken,
  getDetails,
  getUserState,
  navToLogin
} from '../../utils/util'

Page({
  data: {
    id: undefined,
    curpage: 1,
    canLoadMore: true,
    showLoading: false,
    scrollTop: 0,
    timer: null,

    recruitList: []
  },
  linkJobDetail (e) {
    if (getUserState()) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../jobDetail/detail?id=${id}`
      })
    } else {
      navToLogin()
    }
  },
  getData() {
    if (this.data.canLoadMore) {
      wx.request({
        url: `${getPositionList}`,
        data: {
          p: this.data.curpage,
          nums: 10,
          company_id: this.data.id
        },
        method: 'GET',
        success: res => {
          console.log(res,'aaaa')
          if (res.data.error == '0') {
            const { list } =  res.data.result
            this.setData({
              recruitList: this.data.recruitList.concat(list)
            })
            if(this.data.recruitList.length >= 6) {
              this.setData({
                showMore: true,
                canLoadMore: true,
                curpage: ++this.data.curpage
              })
            } else {
              this.setData({
                showMore: false,
                canLoadMore: false
              })
            }
          }
        }
      })
    } else {
      this.setData({
        showLoading: false
      })
    }
  },
  onLoad: function (options) {
    let id = options.id
    this.setData({ id })
    this.getData()
  },
  lower(e) {
    const self = this;
    self.setData({
      showLoading: true
    })
    wx.showNavigationBarLoading();
    if (self.timer) {
      clearTimeout(self.timer);
    }
    self.timer = setTimeout(() => {
      this.getData()
      wx.hideNavigationBarLoading();
    }, 500);
  }
})