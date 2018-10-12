import {
  getPositionList,
  getZPType,
  getPositionType,
  getProvinceList,
  getCityList
} from '../../api'
import {
  getUserState,
  navToLogin
} from '../../utils/util'
const app = getApp()
Page({
  data: {
    curPage: 1,
    showLoading: false,
    canLoadingMore: true,
    scrollTop: 0,
    timer: null,
    jobList: []
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
  // 获取职位数据
  getJobData() {
    let _self = this
    if (this.data.canLoadingMore) {
      wx.request({
        url: `${getPositionList}`,
        data: {
          p: _self.data.curPage,
          unittype: 0,
          positiontype_id: 0,
          city_id: 0,
          education: 0,
          nums: 10,
          keyword: this.data.keyword
        },
        type: 'GET',
        success: res => {
          if (res.data.error == '0') {
            const { list } = res.data.result
            if (list.length >= 1) {
              _self.setData({
                jobList: this.data.jobList.concat(list)
              })
            }
            if ( list.length >= 10) {
              _self.setData({
                curPage: ++_self.data.curPage
              })
            } else {
              _self.setData({
                canLoadingMore: false
              })
            }
            _self.setData({
              showLoading: false
            })
          }
        }
      })
    } else {
      _self.setData({
        showLoading: false
      })
    }
  },
  onLoad: function (options) {
    this.setData({
      keyword: options.keyword
    })
    this.getJobData(this.data.keyword) 

  },
  onShow: function() {
    if (this.data.taped) {
      this.setData({
        focus: !this.data.focus
      })
    }
  },
  lower (e) {
    wx.showNavigationBarLoading();
    const _self = this
    if (_self.timer) {
      clearTimeout(_self.timer)
    }
    _self.setData({
      showLoading: true
    })
    _self.timer = setTimeout(() => {
      this.getJobData()
      wx.hideNavigationBarLoading()
    }, 1000)
  }
})