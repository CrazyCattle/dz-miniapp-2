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
    user_exprect: '',
    industry: '',
    city: '',
    salary: undefined,
    company_size: '',
    company_type: '',
    industry_id: undefined,  
    father_id: undefined,  
    positiontype_id: undefined,  
    province_id: undefined,  
    city_id: undefined,  
    expect_pay: undefined,  
    expect_unittype: undefined,  
    expect_unitsize: undefined,  
    expect_id: undefined,  

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
    salaryArr: [],
    salaryIndex: 0,
    salaryIndexArr: [],
    // 公司规模数据
    sizeArr: [],
    sizeIndex: 0,
    sizeIndexArr: [],
    //公司性质
    xzArr: [],
    xzIndex: 0,
    xzIndexArr: [],
  },


  //获取薪资
  getSalaryBaseFun() {
    wx.request({
      url: `${getSalaryBase}`,
      method: 'GET',
      success: res => {
        if (res.data.error == '0') {
          const arr1 = []
          const arr2 =[]
          res.data.result.forEach((v, i) => {
            arr1.push(v.tilte)
            arr2.push(v.parameter)
          })
          this.setData({
            salaryArr: arr1,
            salaryIndexArr: arr2
          })
        }
      }
    })
  },
  listenerSalary(e) {
    this.setData({
      salaryIndex: e.detail.value,
      expect_pay: this.data.salaryIndexArr[e.detail.value]
    });
    this.setData({
      salary: this.data.salaryArr[this.data.salaryIndex]
    })
  },

  //获取公司规模
  getunitsizeTypeFun() {
    wx.request({
      url: `${getunitsizeType}`,
      method: 'GET',
      success: res => {
        if (res.data.error == '0') {
          const arr1 = []
          const arr2 = []
          res.data.result.forEach((v, i) => {
            arr1.push(v.tilte)
            arr2.push(v.parameter)
          })
          this.setData({
            sizeArr: arr1,
            sizeIndexArr: arr2
          })
        }
      }
    })
  },
  listenerSize(e) {
    this.setData({
      sizeIndex: e.detail.value,
      expect_unitsize: this.data.sizeIndexArr[e.detail.value]
    });
    this.setData({
      company_size: this.data.sizeArr[this.data.sizeIndex]
    })
  },

  //获取公司性质
  getCompanyXZFun() {
    wx.request({
      url: `${getZPType}?module=ComUnitType`,
      method: 'GET',
      success: res => {
        if (res.data.error == '0') {
          const arr1 = []
          const arr2 = []
          res.data.listjson.forEach((v, i) => {
            arr1.push(v.tilte)
            arr2.push(v.parameter)
          })
          this.setData({
            xzArr: arr1,
            xzIndexArr: arr2
          })
        }
      }
    })
  },
  listenerNature(e) {
    this.setData({
      xzIndex: e.detail.value,
      expect_unittype: this.data.xzIndexArr[e.detail.value]
    });
    this.setData({
      company_type: this.data.xzArr[this.data.xzIndex]
    })
  },

  // 监听目标行业
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
        if (val.tilte == _self.data.industryArray[0][v]) {
          wx.request({
            url: `${getIndustryList}?tb_type=${val.parameter}`,
            success: res => {
              if (res.data.error == '0') {
                const arr = []
                const arr1 = []
                res.data.result.forEach((v, i) => {
                  arr.push(v.industry_name)
                  arr1.push(v.industry_id)
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
              jobOne.push(v.positiontype_name)
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
            arr.push(v.positiontype_name)
            arr1.push(v.positiontype_id)
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
        if (val.positiontype_name == _self.data.jobArray[0][v]) {
          wx.request({
            url: `${getPositionType}?father_id=${val.positiontype_id}&level=2`,
            success: res => {
              if (res.data.error == '0') {
                const arr = []
                const arr1 = []
                res.data.listjson.forEach((v, i) => {
                  arr.push(v.positiontype_name)
                  arr1.push(v.positiontype_id)
                })
                _self.setData({
                  jobArray: [_self.data.jobOneC, arr],
                  jobIndexArr: arr1,
                  father_changeId: val.positiontype_id
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
        if (val.province_name == _self.data.addressArray[0][v]) {
          wx.request({
            url: `${getCityList}?father_id=${val.province_code}`,
            success: res => {
              if (res.data.error == '0') {
                const arr = []
                const arr1 = []
                res.data.listjson.forEach((v, i) => {
                  arr.push(v.city_name)
                  arr1.push(v.city_id)
                })
                _self.setData({
                  addressArray: [_self.data.addressOneC, arr],
                  prov_changeId: val.province_id,
                  addressIndexArr: arr1
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
  saveExpect() {
    wx.request({
      url: `${sendExpect}`,
      data: {
        token: app.globalData.token,
        stu_id: app.globalData.student_id,
        expect_id: this.data.expect_id == '-9999' ? 0 : this.data.expect_id,
        industry_id: this.data.industry_id,  
        father_id: this.data.father_id,  
        positiontype_id: this.data.positiontype_id,  
        province_id: this.data.province_id,  
        city_id: this.data.city_id,  
        expect_pay: this.data.expect_pay,  
        expect_unittype: this.data.expect_unittype,  
        expect_unitsize: this.data.expect_unitsize
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
      user_exprect: data.industry_name,
      industry: data.positiontype_name,
      city: data.city_name,
      salary: data.expect_payname,
      company_size: data.expect_unitsizename,
      company_type: data.expect_unittypename,
      industry_id: data.industry_id,  
      father_id: data.father_id,  
      positiontype_id: data.positiontype_id,  
      province_id: data.province_id,  
      city_id: data.city_id,  
      expect_pay: data.expect_pay,  
      expect_unittype: data.expect_unittype,  
      expect_unitsize: data.expect_unitsize,  
      expect_id: data.expect_id
    })

    this.getSalaryBaseFun()
    this.getunitsizeTypeFun()
    this.getCompanyXZFun()

    this.getPosiParentTypeFun().then((res) => {
      this.getPosiChildTypeFun(res[0].positiontype_id)
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
              jobOne.push(v.tilte)
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
        url: `${getIndustryList}?tb_type=${res[0].parameter}`,
        success: res => {
          if (res.data.error == '0') {
            const arr = []
            const arr1 = []
            res.data.result.forEach((v, i) => {
              arr.push(v.industry_name)
              arr1.push(v.industry_id)
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
              jobOne.push(v.province_name)
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
        url: `${getCityList}?father_id=${res[0].province_code}`,
        success: data => {
          if (data.data.error == '0') {
            const arr = []
            const arr1 = []
            data.data.listjson.forEach((v, i) => {
              arr.push(v.city_name)
              arr1.push(v.city_id)
            })
            this.setData({
              addressArray: [this.data.addressOneC, arr],
              prov_changeId: res[0].province_id,
              province_id: res[0].province_id,
              addressIndexArr: arr1
            })
          }
        }
      })
    })
  },
  onShow: function () {}
})