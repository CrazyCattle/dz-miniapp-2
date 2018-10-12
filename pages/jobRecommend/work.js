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
    chooseType: 1, //选中的过滤类型 1：招聘职位类型 2：城市 3：学历

    recruitType: [],//招聘单位类型数组
    eduType: [],//学历类型数组
    posiTypeParent: [], //招聘职位类型一级
    posiTypeChild: [],//招聘职位类型二级
    curPage: 1,
    showLoading: false,
    canLoadingMore: true,

    provinceList: [],
    cityList: [],

    recruitTypeId: 0, // 初始招聘单位 为不限
    positionTypeId: 0,
    cityTypeId: 0,
    educTypeId: 0,

    positionTXT: '招聘职位类型',
    cityTXT: '城市',
    educTXT: '学历',

    active: 0,
    placeholderTxt: '搜索公司或职位名称',
    focus: false,
    filterType: 0,
    scrollTop: 0,
    timer: null,
    // 职位推荐
    jobList: []
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
  searchChange(e) {
    console.log(e.detail.value)
  },
  iptConfirm(e) {
    let keyword = e.detail.value
    wx.navigateTo({
      url: `../jobRecommendSearch/search?keyword=${keyword}`
    })
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
  // 招聘单位类型切换
  filterData (e) {
    let type = e.target.dataset.type
    let id = e.currentTarget.dataset.id
    if (this.data.filterType != type) {
      this.setData({
        filterType: type,
        jobList: [],
        recruitTypeId: id,
        canLoadingMore: true,
        curPage: 1
      })
      if (this.data.chooseType == 1) {
        this.setData({
          city_id: 0,
          education: 0,
        })
      } else if (this.data.chooseType == 2) {
        this.setData({
          positiontype_id: 0,
          education: 0
        })
      } else if (this.data.chooseType == 3) {
        this.setData({
          positiontype_id: 0,
          city_id: 0
        })
      }
      this.getJobData()
    }
  },
  // 过滤下拉切换
  tabFilter (e) {
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
  // 获取职位推荐
  getPositionListFun() {
    wx.request({
      url: `${getPositionList}?p=1&isrom=1&nums=4`,
      method: 'GET',
      success: (res) => {
        if (res.data.error == '0') {
          console.log(res.data)
          this.setData({
            jobList: res.data.result.list
          })
        }
      }
    })
  },
  //获取招聘单位类型
  getRecruitTypeFun() {
    let _self = this
    wx.request({
      url: `${getZPType}?module=ComUnitType`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          _self.setData({
            recruitType: this.data.recruitType.concat(res.data.listjson)
          })
        }
      }
    })
  },
  //获取招聘职位类型
  getPosiParentTypeFun() {
    let _self = this
    wx.request({
      url: `${getPositionType}?father_id=0&level=1`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          _self.setData({
            posiTypeParent: res.data.listjson
          })
        }
      }
    })
  },
  getPosiChildTypeFun(id) {
    let _self = this
    wx.request({
      url: `${getPositionType}?father_id=${id}&level=2`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          _self.setData({
            posiTypeChild: res.data.listjson
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.errortip,
            duration: 1000
          })
          _self.setData({
            posiTypeChild: []
          })
        }
      }
    })
  },

  //招聘职位类型过滤
  chooseParentType(e){
    let id = e.currentTarget.dataset.id
    this.getPosiChildTypeFun(id)
  },
  // 通过单位类型和职位类型获取数据
  chooseChildType(e) {
    let id = e.currentTarget.dataset.id
    let txt = e.target.dataset.txt
    if (txt != '不限') {
      this.setData({
        positionTXT: txt,
      })
    } else {
      this.setData({
        positionTXT: '招聘职位类型',
      })
    }
    this.setData({
      jobList: [],
      canLoadingMore: true,
      curPage: 1,
      positionTypeId: id,
      cityTypeId: 0,
      educTypeId: 0,
      chooseType: 1,
      cityTXT: '城市',
      educTXT: '学历',
    })
    this.getJobData()
  },
  //获取城市
  getProvinceListFun() {
    wx.request({
      url: `${getProvinceList}`,
      method: 'GET',
      success: res => {
        console.log(res.data,'城市')
        this.setData({
          provinceList: res.data.listjson
        })
      }
    })
  },
  chooseProvince(e) {
    let id =  e.currentTarget.dataset.id
    this.getCityListFun(id)
  },
  getCityListFun(id) {
    wx.request({
      url: `${getCityList}?father_id=${id}`,
      method: 'GET',
      success: res => {
        console.log(res.data, '城市')
        this.setData({
          cityList: res.data.listjson
        })
      }
    })
  },
 // 通过单位类型和城市获取数据
  chooseCity(e) {
    let id =  e.currentTarget.dataset.id
    let txt = e.target.dataset.txt
    if (txt != '不限') {
      this.setData({
        cityTXT: txt,
      })
    } else {
      this.setData({
        cityTXT: '城市',
      })
    }
    this.setData({
      jobList: [],
      canLoadingMore: true,
      curPage: 1,
      cityTypeId: id,
      positionTypeId: 0,
      educTypeId: 0,
      chooseType: 2,
      positionTXT: '招聘职位类型',
      educTXT: '学历'
    })
    this.getJobData()
  },
  // 学历类型过滤
  filterEduc (e) {
    this.setData({
      active: 0
    })
  },
  chooseEduId(e){
    // 学历过滤 获取id
    let id = e.target.dataset.id
    let txt = e.target.dataset.txt
    console.log(txt)
    if (txt != '不限') {
      this.setData({
        educTXT: txt,
      })
    } else {
      this.setData({
        educTXT: '学历',
      })
    }
    this.setData({
      jobList: [],
      canLoadingMore: true,
      curPage: 1,
      educTypeId: id,
      positionTypeId: 0,
      cityTypeId: 0,
      chooseType: 3,
      positionTXT: '招聘职位类型',
      cityTXT: '城市'
    })
    this.getJobData()
  },
  //获取学历类型
  getEduTypeFun(){
    let _self = this
    wx.request({
      url: `${getZPType}?module=Degree`,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.error == '0') {
          _self.setData({
            eduType: this.data.eduType.concat(res.data.listjson)
          })
        }
      }
    })
  },
  // 获取职位数据
  getJobData() {
    let _self = this
    if (this.data.canLoadingMore) {
      wx.request({
        url: `${getPositionList}`,
        data: {
          p: _self.data.curPage,
          unittype: this.data.recruitTypeId,
          positiontype_id: this.data.positionTypeId,
          city_id: this.data.cityTypeId,
          education: this.data.educTypeId,
          nums: 10
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
    this.getRecruitTypeFun()
    this.getEduTypeFun()
    this.getPosiParentTypeFun()
    this.getJobData()  //获取职位

    this.getProvinceListFun()
    this.getCityListFun(0)
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