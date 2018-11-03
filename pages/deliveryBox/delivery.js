import {
  resumeList,
  delResume,
  getPositionCollect,
  getCompanyCollect,
  getMydropinbox,
  getMyinvitation
} from '../../api';

import {
  setNewToken,
  initLoginStatus,
  getUserState,
  navToLogin
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    tabActive: 1,
    student_id: '',
    type: 0,
    page: -1,
    canGetDropinbox : true,
    dropinboxPage: 1,
    mydropinbox: [
      {
        jobName: '企业服务部实习生',
        apply_time: '2016.12.30',
        companyShort: '上海脚步网络科技有限公司',
        apply_passstate: '-1',
        companyLogo: 'http://yuncompany.bestsep.com//Uploads/icon/dr/sbzdh.jpg'
      },
      {
        jobName: 'test 1',
        apply_time: '2018-01-01',
        companyShort: '上海脚步网',
        apply_passstate: '0',
        companyLogo: 'http://yuncompany.bestsep.com//Uploads/icon/dr/sbzdh.jpg'
      },
      {
        jobName: 'test 1',
        apply_time: '2018-01-01',
        companyShort: '上海脚步网',
        apply_passstate: '1',
        companyLogo: 'http://yuncompany.bestsep.com//Uploads/icon/dr/sbzdh.jpg'
      },
      {
        jobName: 'test 1',
        apply_time: '2018-01-01',
        companyShort: '上海脚步网',
        apply_passstate: '2',
        companyLogo: 'http://yuncompany.bestsep.com//Uploads/icon/dr/sbzdh.jpg'
      },
      {
        jobName: 'test 1',
        apply_time: '2018-01-01',
        companyShort: '上海脚步网',
        apply_passstate: '3',
        companyLogo: 'http://yuncompany.bestsep.com//Uploads/icon/dr/sbzdh.jpg'
      },
      {
        jobName: 'test 1',
        apply_time: '2018-01-01',
        companyShort: '上海脚步网',
        apply_passstate: '4',
        companyLogo: 'http://yuncompany.bestsep.com//Uploads/icon/dr/sbzdh.jpg'
      }
    ]
  },
  linkToDropDetail () {
    wx.navigateTo({
      url: '../deliveryBoxDetail/detail'
    })
  },
  //获取投递箱
  getMydropinboxFun() {
    let loginType = wx.getStorageSync('loginType')
    let _self = this
    wx.request({
      url: `${getMydropinbox}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        nums: 10,
        p: _self.data.dropinboxPage,
        type: 0
      },
      method: 'GET',
      success: res => {
        console.log(res, '投递箱')
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.getMydropinboxFun()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (res.data.error == 0) {
            const { listjson } = res.data
            // console.log(listjson)
            // if (listjson.length == 0 && _self.data.mydropinbox.length == 0) {
            //   _self.setData({
            //     hasMoreInfor1: false
            //   })
            // }
            // if (listjson.length < 10 & listjson.length > 0) {
            //   _self.setData({
            //     canGetDropinbox: false
            //   })
            // } else {
            //   _self.setData({
            //     dropinboxPage: ++_self.data.dropinboxPage
            //   })
            // }
            // _self.setData({
            //   mydropinbox: _self.data.mydropinbox.concat(listjson),
            //   showMore1: false
            // })
            _self.setData({
              mydropinbox: listjson
            })
          } else {
            _self.setData({
              mydropinbox: []
            })
          }
        }
      }
    })
  },
  lower() {
    // if (this.data.canGetDropinbox) {
    //   const self = this;
    //   wx.showNavigationBarLoading();
    //   self.setData({
    //     showMore1: true
    //   })
    //   if (self.timer1) {
    //     clearTimeout(self.timer1);
    //   }
    //   self.timer1 = setTimeout(() => {
    //     self.getMydropinboxFun()
    //     wx.hideNavigationBarLoading();
    //   }, 500);
    // }
    // console.log('lower1')
  },
  onLoad: function (options) {
    if (getUserState() && !!app.globalData.student_id && !!app.globalData.token) {
      // this.getMydropinboxFun()
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 1000
      });
      navToLogin()
    }
  },
  onShow: function () {}
})