import {
  getZPType, //行业大类
  getIndustryList,//行业小类
  getSalaryBase,//薪资
  getunitsizeType,//公司规模
  getPositionType,
} from '../../api';

Page({
  data: {
    // 行业
    industry: [],
    industryIndex: 0,
    industryIndexArr: [],
    
    // 职位类别
    job: ['请选择职位类别', '互联网/IT23432', '金融'],
    jobIndex: 0,
    
    //职位
    address: ['请选择求职地点', '互联网/IT425', '金融'],
    addressIndex: 0,
    //职位
    salary: ['请选择薪资范围', '互联网/IT432', '金融'],
    salaryIndex: 0,
    //职位
    size: ['请选择公司规模', '互联网/IT34', '金融'],
    sizeIndex: 0,
    //职位
    nature: ['请选择公司性质', '互联网/IT12', '金融'],
    natureIndex: 0
  },
  // 行业监听
  listenerIndustry (e) {
    this.setData({
      industryIndex: e.detail.value
    });
  },
  // 职位类别监听
  listenerJob(e) {
    this.setData({
      jobIndex: e.detail.value
    });
  },
  // 行业监听
  listenerAddress(e) {
    this.setData({
      addressIndex: e.detail.value
    });
  },
  // 职位类别监听
  listenerSalary(e) {
    this.setData({
      salaryIndex: e.detail.value
    });
  },
  // 行业监听
  listenerSize(e) {
    this.setData({
      sizeIndex: e.detail.value
    });
  },
  // 职位类别监听
  listenerNature(e) {
    this.setData({
      natureIndex: e.detail.value
    });
  },
  addMoreAddress () {
    console.log(1)
  },
  getIndustryParent() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getZPType}?module=inc_industry`,
        success: res => {
          console.log(res)
          if (res.data.error == '0') {
            const { listjson } = res.data
            const arr1 = []
            const arr2 = []
            listjson.forEach((v, i) => {
              arr1.push(v.tilte)
              arr2.push(v.parameter)
            })
            this.setData({
              industry: arr1,
              industryIndexArr: arr2
            })
            resolve(arr2[0])
          }
        }
      })
    })
  },
  getIndustryChild(id) {
    wx.request({
      url: `${getIndustryList}?tb_type=${id}`,
      success: res => {
        console.log(res,1000)
        if (res.data.error == '0') {
          const arr1 = []
          const arr2 = []
          listjson.forEach((v, i) => {
            arr1.push(v.tilte)
            arr2.push(v.parameter)
          })
          this.setData({
            industry: arr1,
            industryIndexArr: arr2
          })
          this.setData({
            jobArray: [this.data.jobOneC, arr]
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(options.id)
    this.getIndustryParent().then(res => {
      this.getIndustryChild(res)
    })
  },
  onShow: function () {

  }
})