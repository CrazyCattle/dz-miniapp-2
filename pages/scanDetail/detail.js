// import {
 
// } from '../../api';

const app = getApp()

Page({
  data: {
    // 薪资数据
    salaryArr: ['不限', '1k - 2k', '2k - 4k', '4k - 5k', '5k - 7k', '7k - 9k', '9k - 12k', '12k - 20k'],
    salaryIndex: 0,
    salaryIndexArr: [],
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
  linkToEWm () {
    wx.navigateTo({
      url: '../scanEwm/ewm'
    })
  },
  onLoad: function (options) {},
  onShow: function () {}
})