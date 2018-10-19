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
    active: 0,
    curCity: '全国',
    curCityId: '1',
    searches: []
  },
  removeSearch () {
    wx.removeStorageSync('searches')
    this.setData({
      searches: []
    })
  },
  iptConfirm(e) {
    let keyword = e.detail.value
    if (!!keyword) {
      // wx.navigateTo({
      //   url: `../jobRecommendSearch/search?keyword=${keyword}`
      // })
      let data = [{
        id: this.data.curCityId,
        keyword,
        curCity: this.data.curCity
      }]
      this.setData({
        searches: this.data.searches.concat(data)
      })
      console.log(this.data.searches)
      wx.setStorageSync('searches', this.data.searches)
      wx.navigateTo({
        url: `../relatedPositions/positions?cId=${this.data.curCity}&keyword=${keyword}&curCity=${this.data.curCity}`
      })
    }
  },
  showCityChoose () {
    this.setData({
      active: !this.data.active
    })
  },
  linkToRecom (e) { 
    // wx.navigateTo({
    //   url: '../relatedPositions/positions',
    // })
    let keyword = e.currentTarget.dataset.txt
    let id = e.currentTarget.dataset.id
    let city = e.currentTarget.dataset.city
    wx.navigateTo({
      url: `../relatedPositions/positions?cId=${id}&keyword=${keyword}&curCity=${city}`
    })
  },
  chooseCity (e) {
    let id = e.currentTarget.dataset.id
    let city = e.currentTarget.dataset.txt
    this.setData({
      active: !this.data.active,
      curCity: city,
      curCityId: id
    })
    console.log(id, city)
  },
  //获取城市
  getProvinceListFun() {
    wx.request({
      url: `${getProvinceList}`,
      method: 'GET',
      success: res => {
        console.log(res.data, '城市')
        if (res.data.error == 0) {
          this.setData({
            provinceList: res.data.listjson
          })
          this.getCityListFun(this.data.provinceList[0].id)
        }
      }
    })
  },
  chooseProvince(e) {
    let id = e.currentTarget.dataset.id
    this.getCityListFun(id)
  },
  getCityListFun(id) {
    wx.request({
      url: `${getCityList}?id=${id}`,
      method: 'GET',
      success: res => {
        console.log(res.data, '城市')
        if (res.data.error == 0) {
          this.setData({
            cityList: res.data.listjson
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(!!wx.getStorageSync('searches'))
    if (!!wx.getStorageSync('searches')) {
      let searches =wx.getStorageSync('searches')
      this.setData({
        searches
      })
      console.log(1)
    }
    this.getProvinceListFun()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})