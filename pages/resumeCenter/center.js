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
    website: '',
    curShow: true,
    noResumeList: false,

    isBack: false,
    student_id: '',
    type: 0,
    page: -1,
    fliterType: 'job',
    // page 1
    resumeList: [],
    // page 2
    tabActive: 0,
    status: {
      sending: '0',
      seeing: '25%',
      filtering: '50%',
      inving: '75%',
      seeing: '100%',
    },
    mydropinbox: [],
    canGetDropinbox: true,
    timer1: null,
    dropinboxPage: 1,
    showMore1: true,
    hasMoreInfor1: true,

    // page 3
    id: -1,
    ids: -1,
    showPos: false,
    showCompany: false,
    myinvitatio: [],
    canGetinvitation: true,
    timer2: null,
    invitationPage: 1,
    showMore2: true,
    hasMoreInfor2: true,

    // 收藏职位列表
    jobList: [],
    // 收藏公司列表
    companyList: []
  },
  // 投递箱 切换过滤
  changeTab (e) {
    let tabActive = e.currentTarget.dataset.tab
    if (tabActive !== this.data.tabActive) {
      this.setData({
        tabActive,
        dropinboxPage: 1,
        mydropinbox: [],
        canGetDropinbox: true,
        hasMoreInfor1: true,
        ids: -1
      })
      this.getMydropinboxFun()
    }
  },
  showDetail(e) {
    let id = e.currentTarget.dataset.id
    this.setData({ id })
  },
  showDetailNone() {
    this.setData({ id: -1 })
  },
  showStatus(e) {
    let ids = e.currentTarget.dataset.ids
    if ( ids != this.data.ids) {
      this.setData({ ids })
    } else {
      this.setData({
        ids: -1
      })
    }
  },
  linkToJobDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../jobDetail/detail?id=${id}`
    })
  },
  linkCompanyDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../companyDetail/detail?id=${id}`
    })
  },
  linkToDetail(e) {
    let index = e.currentTarget.dataset.index
    console.log(this.data.mydropinbox[index])
    let item = JSON.stringify(this.data.mydropinbox[index])
    wx.navigateTo({
      url: `../resumeCenterDropbox/index?item=${item}`
    })
  },
  //获取收藏的职位
  getPositionCollectFun() {
    wx.request({
      url: `${getPositionCollect}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=1&nums=10`,
      method: 'GET',
      success: res => {
        console.log(res,11231)
        if (res.data.error == '0') {
          const { list } = res.data.result
          this.setData({
            showPos: true,
            jobList: this.data.jobList.concat(list)
          })
        }
      }
    })
  },
  //获取收藏的公司
  getCompanyCollectFun() {
    wx.request({
      url: `${getCompanyCollect}?stu_id=${app.globalData.student_id}&token=${app.globalData.token}&p=1&nums=10`,
      method: 'GET',
      success: res => {
        console.log(res,5436436)
        if (res.data.error == '0') {
          const { list } = res.data.result
          this.setData({
            showCompany: true,
            companyList: this.data.companyList.concat(list)
          })
        }
      }
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
        type: this.data.tabActive
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
            const { list } = res.data.result
           
            console.log(list)
            if (list.length == 0 && _self.data.mydropinbox.length == 0) {
              _self.setData({
                hasMoreInfor1: false
              })
            } 
            if (list.length < 10 & list.length > 0) {
              _self.setData({
                canGetDropinbox: false
              })
            } else {
              _self.setData({
                dropinboxPage: ++_self.data.dropinboxPage
              })
            }
            _self.setData({
              mydropinbox: _self.data.mydropinbox.concat(list),
              showMore1: false
            })
          }
        }
      }
    })
  },
  lower1() {
    if (this.data.canGetDropinbox) {
      const self = this;
      wx.showNavigationBarLoading();
      self.setData({
        showMore1: true
      })
      if (self.timer1) {
        clearTimeout(self.timer1);
      }
      self.timer1 = setTimeout(() => {
        self.getMydropinboxFun()
        wx.hideNavigationBarLoading();
      }, 500);
    }
    console.log('lower1')
  },
  //获取邀请函
  getMyinvitationFun() {
    let loginType = wx.getStorageSync('loginType')
    let _self = this
    wx.request({
      url: `${getMyinvitation}`,
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token,
        nums: 10,
        p: _self.data.invitationPage
      },
      method: 'GET',
      success: res => {
        console.log(res, '邀请函')
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
            const { list } = res.data.result
            if (list === null || !list.hasOwnProperty['length'] || list.length == 0) {
              _self.setData({
                myinvitatio: [],
                hasMoreInfor2: false
              })
            } else if (list.length < 10 & list.length > 0) {
              _self.setData({
                canGetinvitation: false,
                myinvitatio: _self.data.myinvitatio.concat(list)
              })
            } else {
              _self.setData({
                invitationPage: ++_self.data.invitationPage,
                myinvitatio: _self.data.myinvitatio.concat(list)
              })
            }
            _self.setData({
              showMore2: false
            })
            // console.log(_self.data.myinvitatio)
          }
        }
      }
    })
  },
  lower2() {
    if (this.data.canGetinvitation) {
      const self = this;
      wx.showNavigationBarLoading();
      self.setData({
        showMore2: true
      })
      if (self.timer2) {
        clearTimeout(self.timer2);
      }
      self.timer2 = setTimeout(() => {
        self.getMyinvitationFun()
        wx.hideNavigationBarLoading();
      }, 500);
    }
    console.log('lower2')
  },
  tabPage(e) {
    let page = e.currentTarget.dataset.page
    this.setData({
      page: page
    })
    if (page == 1) {
      this.getResume()
    } else if (page == 4) {
      if (this.data.fliterType == 'job') {
        if (this.data.jobList.length == 0) {
          console.log(this.data.jobList.length)
          this.getPositionCollectFun()
        }
      } else if (this.data.fliterType == 'company') {
        console.log(this.data.companyList.length)
        if (this.data.companyList.length == 0) {
          this.getCompanyCollectFun()
        }
      }
    } else if (page == 2) {
      if (this.data.mydropinbox.length == 0) {
        this.getMydropinboxFun()
      }
    } else if (page == 3) {
      if (this.data.myinvitatio.length == 0) {
        this.getMyinvitationFun()
      }
    }
  },
  changeCokllectFilter(e) {
    let type = e.target.dataset.type
    this.setData({
      fliterType: type
    })
    if (this.data.fliterType == 'job') {
      //if (this.data.jobList.length == 0) {
      this.setData({
        showPos: true,
        jobList:[]
      })
        this.getPositionCollectFun()
      //}
    } else if (this.data.fliterType == 'company') {
      //if (this.data.companyList.length == 0) {
        this.setData({
          showCompany: true,
          companyList: []
        })
        this.getCompanyCollectFun()
      //}
    }
  },
  positionLower(){},
  companyLower(){},
  editResumeBasicInfor(e) {
    let id = e.target.dataset.id
    let lan = (e.target.dataset.lan=='1'?'en':'cn')
    wx.navigateTo({
      url: `../editResumeBasicInfor/infor?id=${id}&lan=${lan}`,
    })
  },
  delResumeVail(resumes_id) {
    let _self = this
    let loginType = wx.getStorageSync('loginType')
    wx.request({
      url: `${delResume}`,
      data: {
        resumes_id,
        stu_id: app.globalData.student_id,
        token: app.globalData.token
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res)
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.delResumeVail(resumes_id)
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (res.data.error == '0') {
            _self.getResume()
            wx.showToast({
              title: res.data.errortip,
              icon: "none",
              duration: 1000
            });
          }
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  delResume(e) {
    let _self = this
    new Promise((resolve, reject) => {
      wx.showModal({
        title: '确定删除此简历吗？',
        content: '删除后不可恢复',
        confirmText: '删除',
        success: res => {
          console.log(res)
          if (res.confirm) {
            resolve(res.confirm)
          }
        }
      })
    }).then(res => {
      if (res) {
        let resumes_id = e.target.dataset.id
        _self.delResumeVail(resumes_id)
      }
    })
  },
  linkResume(e) {
    let resumes_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../resume/resume?resumes_id=${resumes_id}`,
    })
  },
  getResume() {
    let loginType = wx.getStorageSync('loginType')
    let _self = this

    wx.request({
      url: `${resumeList}`,
      method: 'POST',
      data: {
        stu_id: app.globalData.student_id,
        token: app.globalData.token
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res)
        const { error } = res.data

        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.getResume()
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (error == '0') {
            this.setData({
              resumeList: res.data.listjson
            })
            if (res.data.listjson.length == '0') {
              this.setData({
                noResumeList: !this.data.noResumeList
              })
            }
          } else if (error == '1') {
            this.setData({
              resumeList: [],
              noResumeList: !this.data.noResumeList
            })
          }
        }
      },
      fail: res => {
        throw Error(res)
      },
      complete: res => {
        // res
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      website: wx.getStorageSync('schoolInfo').enter_stu_url
    })
    if (!!app.globalData.student_id) {
      if (options.action) {
        this.setData({
          page: 2,
          dropinboxPage: 1,
          mydropinbox: [],
          canGetDropinbox: true,
          hasMoreInfor1: true,
          ids: -1
        })
        if (options.action == 'send') {
          this.setData({
            tabActive: 1
          })
        } else if (options.action == 'view') {
          this.setData({
            tabActive: 4
          })
        }
        this.getMydropinboxFun()
      } else {
        this.setData({
          student_id: app.globalData.student_id,
          page: 1
        })
        this.getResume()
      }
    } else {
      this.setData({
        noResumeList: !this.data.noResumeList
      })
    }
  },
  onShow() {
    console.log(this.data.isBack)
    if (this.data.isBack) {
      if (this.data.page == '1'){
        this.getResume()
      }else if (this.data.page == '4'){
        if (this.data.fliterType == 'job') {
          //if (this.data.jobList.length == 0) {
          this.setData({
            showPos: true,
            jobList: []
          })
          this.getPositionCollectFun()
          //}
        } else if (this.data.fliterType == 'company') {
          //if (this.data.companyList.length == 0) {
          this.setData({
            showCompany: true,
            companyList: []
          })
          this.getCompanyCollectFun()
          //}
        }
      }
    }
    this.setData({
      isBack: true
    })
  }
})