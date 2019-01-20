import {
  getZphCompanyList,
  getZPType,
  getPositionType
} from '../../api'
import {
  getUserState,
  navToLogin
} from '../../utils/util'
const app = getApp()
Page({
  data: {
    id: '',

    positionTxt: '行业类别',
    positionType: '职位性质',
    keyword: '',

    workType: [
      { id: '1', name: '全职' },
      { id: '2', name: '实习' }
    ],

    IndustryArr: [], // 行业类别数组
    PositionArr: [], // 职位类别数组

    chooseType: 1, //选中的过滤类型 1：招聘职位类型 2：城市 3：学历

    eduType: ['不限', '专科', '本科', '硕士', '博士'],//学历类型数组

    curPage: 1,
    showLoading: false,
    canLoadingMore: true,

    provinceList: [],
    cityList: [],

    industryTxt: '',
    jobCategoryId: '',
    cityTXT: '',
    educTXT: '',

    active: 0,
    scrollTop: 0,
    timer: null,
    // 职位推荐
    jobList: [],
  },
  linkSearch() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  linkJobDetail(e) {
    // if (getUserState()) {
    //   const id = e.currentTarget.dataset.id
    //   wx.navigateTo({
    //     url: `../jobDetail/detail?id=${id}`
    //   })
    // } else {
    //   navToLogin()
    // }
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobDetail/detail?id=${id}`
    })
  },

  linkToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobFairCompanyDetail/detail?id=${id}`
    })
  },

  //行业类别过滤
  chooseParentType(e) {
    let txt = e.currentTarget.dataset.txt
    this.setData({
      active: 0,
      industryTxt: txt,
      positionTxt: txt
    })
    this.reGetJobData()
  },
  //职位类别过滤
  chooseJobType(e) {
    let id = e.currentTarget.dataset.id
    let txt = e.currentTarget.dataset.txt
    this.setData({
      active: 0,
      jobCategoryId: id,
      positionType: txt
    })
    this.reGetJobData()
  },
  // 切换学历过滤
  chooseEdu(e) {
    let txt = e.currentTarget.dataset.txt
    this.setData({
      active: 0,
      educTXT: txt
    })
    this.reGetJobData()
  },

  searchKeyword (e) {
    let keyword = e.detail.value.trim()
    if (keyword != this.data.keyword) {
      this.setData({
        keyword: keyword,
        canLoadingMore: true,
        jobList: [],
        curPage: 1
      })
      this.getJobData()
    }
  },
  // 切换职位类型过滤
  // chooseworkType(e) {
  //   let id = e.currentTarget.dataset.id
  //   let txt = e.currentTarget.dataset.txt
  //   this.setData({
  //     active: 0,
  //     workTypeId: id,
  //     workTypeTxt: txt
  //   })
  //   this.reGetJobData()
  // },

  // 过滤下拉切换
  tabFilter(e) {
    console.log(e)
    console.log(this.data.active, e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    if (this.data.active == id) {
      this.setData({
        active: 0
      })
    } else {
      if (id >= 0) {
        this.setData({
          active: id
        })
      }
    }
  },

  // 获取招聘单位类型
  getIndustryTypeFun() {
    wx.request({
      url: `${getZPType}`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          this.setData({
            IndustryArr: res.data.listjson
          })
        }
      }
    })
  },

  //获取职位类别
  getPosiType() {
    wx.request({
      url: `${getPositionType}?level=1`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          this.setData({
            PositionArr: res.data.listjson
          })
        }
      }
    })
  },

  reGetJobData() {
    this.setData({
      canLoadingMore: true,
      jobList: [],
      curPage: 1
    })
    this.getJobData()
  },

  // 获取职位数据
  getJobData() {
    let _self = this
    if (this.data.canLoadingMore) {
      wx.request({
        url: `${getZphCompanyList}`,
        data: {
          keyword: this.data.keyword,
          industry: this.data.industryTxt,
          id: this.data.id,
          degree: this.data.educTXT,
          // workType: this.data.workTypeId,
          // city_id: this.data.curCityId,
          p: _self.data.curPage,
          nums: 10
        },
        type: 'GET',
        success: res => {
          if (res.data.error == '0') {
            const list = res.data.listjson
            if (list.length >= 1) {
              _self.setData({
                jobList: this.data.jobList.concat(list)
              })
            }
            if (list.length >= 10) {
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
          } else {
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
      id: options.id
    })
    this.getIndustryTypeFun() // 获取招聘单位类型
    this.getPosiType() //获取职位类别

    this.getJobData()  //获取职位
  },
  lower(e) {
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