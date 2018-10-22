import {
  getZPType, //行业大类
  getIndustryList,//行业小类
  getSalaryBase,//薪资
  getunitsizeType,//公司规模
  getPositionType,
  getProvinceList, //省份
  getCityList, //father_id 城市
  delExpect,
  sendExpect
} from '../../api';

const app = getApp()

Page({
  data: {
    resumeId: undefined,

    // 目标行业
    industryIndex: [0, 0],
    industryIndexArr: [],
    industryArray: [[], []],
    industryOne: [],
    industryOneC: [],

    //职位类别
    jobIndex: [0, 0],
    jobIndexArr: [],
    jobArray: [[], []],
    jobOne: [],
    jobOneC: [],
    father_changeId: undefined,

    // 地点
    addressIndex: [0, 0],
    addressIndexArr: [],
    addressArray: [[], []],
    addressOne: [],
    addressOneC: [],
    prov_changeId: undefined,
    
    // 薪资数据
    salaryArr: ['不限','1k - 2k','2k - 4k','4k - 5k','5k - 7k','7k - 9k','9k - 12k','12k - 20k'],
    salaryIndex: 0,
    salaryIndexArr: [],
    // 公司规模数据
    sizeArr: ['15人以下','15 - 50人','50 - 150人','150 - 500人','500 - 2000人','2000人以上'],
    sizeIndex: 0,
    sizeIndexArr: [],
    //公司性质
    xzArr: ['民营 / 股份制企业','国有企业','外资','合资','事业单位','政府或非盈利机构','上市公司','其他'],
    xzIndex: 0,
    xzIndexArr: [],
  },

  //获取薪资
  listenerSalary(e) {
    this.setData({
      salaryIndex: e.detail.value,
      // expect_pay: this.data.salaryIndexArr[e.detail.value]
    });
    this.setData({
      salary: this.data.salaryArr[this.data.salaryIndex]
    })
  },

  //获取公司规模
  listenerSize(e) {
    this.setData({
      sizeIndex: e.detail.value,
      // expect_unitsize: this.data.sizeIndexArr[e.detail.value]
    });
    this.setData({
      company_size: this.data.sizeArr[this.data.sizeIndex]
    })
  },

  //获取公司性质
  listenerNature(e) {
    this.setData({
      xzIndex: e.detail.value,
      // expect_unittype: this.data.xzIndexArr[e.detail.value]
    });
    this.setData({
      company_type: this.data.xzArr[this.data.xzIndex]
    })
  },

  // 监听期望行业
  listenerIndustry(e) {
    this.setData({
      industry: this.data.industryArray[1][e.detail.value[1]],
      industry_id: this.data.industryIndexArr[e.detail.value[1]]
    })
  },
  listenerIndustryChange(e) {
    let c = e.detail.column
    let v = e.detail.value
    let _self = this
    if (c == '0') {
      _self.data.industryOne.forEach((val, i) => {
        if (val.categoryName1 == _self.data.industryArray[0][v]) {
          wx.request({
            url: `${getIndustryList}?categoryId1=${val.categoryId1}`,
            success: res => {
              if (res.data.error == '0') {
                const arr = []
                const arr1 = []
                res.data.listjson.forEach((v, i) => {
                  arr.push(v.categoryName2)
                  arr1.push(v.categoryId2)
                })
                _self.setData({
                  industryArray: [_self.data.industryOneC, arr],
                  industryIndexArr: arr1
                })
              }
            }
          })
        }
      })
    }
  },

  //招聘职位职位类型
  getPosiParentTypeFun() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getPositionType}?father_id=0&level=1`,
        method: 'GET',
        success: res => {
          if (res.data.error == '0') {
            const { listjson } = res.data
            const jobOne = []
            listjson.forEach((v, i) => {
              jobOne.push(v.categoryName1)
            })
            this.setData({
              jobOne: listjson,
              jobOneC: jobOne
            })
            resolve(listjson)
          }
        }
      })
    })
  },

  getPosiChildTypeFun(id) {
    let _self = this
    wx.request({
      url: `${getPositionType}?father_id=${id}&level=2`,
      method: 'GET',
      success: res => {
        if (res.data.error == '0') {
          const arr = []
          const arr1 = []
          res.data.listjson.forEach((v, i) => {
            arr.push(v.categoryName2)
            arr1.push(v.categoryId2)
          })
          this.setData({
            jobArray: [this.data.jobOneC, arr],
            father_changeId: id,
            father_id: id,
            jobIndexArr: arr1
          })
        }
      }
    })
  },

  // 监听职位类别
  listenerJobList(e) {
    this.setData({
      user_exprect: this.data.jobArray[1][e.detail.value[1]],
      father_id: this.data.father_changeId,
      positiontype_id: this.data.jobIndexArr[e.detail.value[1]]
    })
  },
  listenerJobChange(e) {
    let c = e.detail.column
    let v = e.detail.value
    let _self = this
    if (c == '0') {
      _self.data.jobOne.forEach((val, i) => {
        if (val.categoryName1 == _self.data.jobArray[0][v]) {
          wx.request({
            url: `${getPositionType}?father_id=${val.categoryId1}&level=2`,
            success: res => {
              if (res.data.error == '0') {
                const arr = []
                const arr1 = []
                res.data.listjson.forEach((v, i) => {
                  arr.push(v.categoryName2)
                  arr1.push(v.categoryId2)
                })
                _self.setData({
                  jobArray: [_self.data.jobOneC, arr],
                  jobIndexArr: arr1,
                  father_changeId: val.categoryId2
                })
              } else {
                wx.showToast({
                  title: res.data.errortip,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      })
    }
  },

  // 地点监听
  listenerCity(e) {
    this.setData({
      city: this.data.addressArray[1][e.detail.value[1]],
      province_id: this.data.prov_changeId,
      city_id: this.data.addressIndexArr[e.detail.value[1]]
    })
  },
  listenerCityChange(e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let c = e.detail.column
    let v = e.detail.value
    let _self = this
    if (c == '0') {
      _self.data.addressOne.forEach((val, i) => {
        if (val.name == _self.data.addressArray[0][v]) {
          wx.request({
            url: `${getCityList}?id=${val.id}`,
            success: res => {
              if (res.data.error == '0') {
                const arr = []
                const arr1 = []
                res.data.listjson.forEach((v, i) => {
                  arr.push(v.name)
                  arr1.push(v.id)
                })
                _self.setData({
                  addressArray: [_self.data.addressOneC, arr],
                  prov_changeId: val.id,
                  addressIndexArr: arr1,
                  workProvince: val.name
                })
                
              } else {  
                wx.showToast({
                  title: res.data.errortip,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      })
    }
  },

  // 删除 求职期望
  deleteExpect() {
    wx.request({
      url: `${delExpect}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        expect_id: this.data.expect_id
      },
      method: 'GET',
      success: res => {
        wx.showToast({
          title: res.data.errortip,
          icon: 'none',
          duration: 1000
        })
        if (res.data.error == '0'){
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
    })
  },

  toggleIssel (e) {
    this.setData({
      issel: e.currentTarget.dataset.sure
    })
  },

  // 修改 保存期望
  saveExpect() {
    wx.request({
      url: `${sendExpect}`,
      data: {
        token: app.globalData.token,
        stu_id: app.globalData.student_id,
        id: this.data.resumeId,
        resumeDefault: 0,

        issel: this.data.issel,
        industry: this.data.industry, 
        jobyname: this.data.user_exprect,  
        workProvince: this.data.workProvince,
        workCity: this.data.city,  
        salary: this.data.salary,  
        people: this.data.company_size,  
        companytype: this.data.company_type
      },
      method: 'POST', 
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        wx.showToast({
          icon: 'none',
          title: res.data.errortip,
          duration: 1000
        })
        if (res.data.error=='0') {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
    })
  },

  onLoad: function (options) {
    let data = JSON.parse(options.data)

    this.setData({
      industry: data.industry,
      user_exprect: data.jobyname,
      issel: data.issel,
      workProvince: data.xjd_province,
      city: data.workCity,
      salary: data.salary,
      company_size: data.people,
      company_type: data.companytype,
      resumeId: data.id
    })

    this.getPosiParentTypeFun().then((res) => {
      this.getPosiChildTypeFun(res[0].categoryId1)
    })

    // 行业大类
    new Promise((resolve, reject) => {
      wx.request({
        url: `${getZPType}?module=inc_industry`,
        success: res => {
          if (res.data.error == '0') {
            const { listjson } = res.data
            const jobOne = []
            listjson.forEach((v, i) => {
              jobOne.push(v.categoryName1)
            })
            this.setData({
              industryOne: listjson,
              industryOneC: jobOne
            })
            resolve(listjson)
          }
        }
      })
    }).then(res => {
      wx.request({
        url: `${getIndustryList}?categoryId1=${res[0].categoryId1}`,
        success: res => {
          if (res.data.error == '0') {
            const arr = []
            const arr1 = []
            res.data.listjson.forEach((v, i) => {
              arr.push(v.categoryName2)
              arr1.push(v.categoryId2)
            })
            this.setData({
              industryArray: [this.data.industryOneC, arr],
              industryIndexArr: arr1
            })
          }
        }
      })
    })

    // 地点
    new Promise((resolve, reject) => {
      wx.request({
        url: `${getProvinceList}`,
        success: res => {
          if (res.data.error == '0') {
            const { listjson } = res.data
            const jobOne = []
            listjson.forEach((v, i) => {
              jobOne.push(v.name)
            })
            this.setData({
              addressOne: listjson,
              addressOneC: jobOne
            })
            resolve(listjson)
          }
        }
      })
    }).then(res => {
      wx.request({
        url: `${getCityList}?id=${res[0].id}`,
        success: data => {
          if (data.data.error == '0') {
            const arr = []
            const arr1 = []
            data.data.listjson.forEach((v, i) => {
              arr.push(v.name)
              arr1.push(v.id)
            })
            this.setData({
              addressArray: [this.data.addressOneC, arr],
              prov_changeId: res[0].id,
              province_id: res[0].id,
              addressIndexArr: arr1
            })
          }
        }
      })
    })
  },
  onShow: function () {}
})