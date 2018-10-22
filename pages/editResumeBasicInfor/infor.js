import {
  resumeBasicEdit,
  getResumeOne,
  jobExpect,
  jobExpectChild,
  uploadImg,
  getPositionType
} from '../../api';

import {
  setNewToken,
  initLoginStatus
} from '../../utils/util';

const app = getApp()

Page({
  data: {
    userImgPath: '',
    resume_id: '',
    // 简历信息
    user_pic: "",
    origin_user_pic: '',
    resumeTitle: '',
    user_name: '',
    user_phone: '',
    user_email: '',
    user_exprect: '',
    // 简历期望
    jobExpect: ["web前端", "PHP开发"],
    jobExpectIndex: 0,

    multiIndex: [0, 0],
    multiArray: [[], []],
    expectOne: [],
    expectOneC: [],
    //中英文
    lan: ''
  },
  reviewResume (e) {
    let resumes_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../resume/resume?resumes_id=${resumes_id}`,
    })
  },
  chooseImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        console.log(res);
        if (res.errMsg == "chooseImage:ok") {
          this.setData({
            user_pic: res.tempFilePaths[0],
            userImgPath: res.tempFiles
          });

          this.uploadUserImg()
        }
      },
      fail: res => { throw Error(res) },
      complete: res => {
        // res
      }
    });
  },
  listenerJobExpect(e) {
    this.setData({
      user_exprect: this.data.multiArray[1][e.detail.value[1]]
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let c = e.detail.column
    let v = e.detail.value
    let _self = this
    if (c == '0') {
      _self.data.expectOne.forEach((val, i) => {
        if (val.categoryName1 == _self.data.multiArray[0][v]) {
          wx.request({
            url: `${getPositionType}?level=2&father_id=${val.categoryId1}`,
            success: res => {
              console.log(res)
              if (res.data.error == '0') {
                console.log(res.data.listjson)
                const arr = []
                res.data.listjson.forEach((v, i) => {
                  arr.push(v.categoryName2)
                })
                _self.setData({
                  multiArray: [_self.data.expectOneC, arr]
                })
              }
            }
          })
        }
      })
    }
  },
  iptTitle(e) {
    this.setData({
      resumeTitle: e.detail.value.trim()
    })
  },
  iptName(e) {
    this.setData({
      user_name: e.detail.value.trim()
    })
  },
  iptPhone(e) {
    this.setData({
      user_phone: e.detail.value.trim()
    })
  },
  iptEmail(e) {
    this.setData({
      user_email: e.detail.value.trim()
    })
  },
  iptExprect(e) {
    console.log(e.detail)
    this.setData({
      user_exprect: e.detail.value.trim()
    })
  },

  submitResumeInfo() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    if (!_self.data.resumeTitle) {
      wx.showToast({
        title: "简历名称不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!_self.data.user_name) {
      wx.showToast({
        title: "姓名不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!_self.data.user_phone) {
      wx.showToast({
        title: "手机号码不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!_self.data.user_email) {
      wx.showToast({
        title: "邮箱不能为空",
        icon: "none",
        duration: 1000
      });
    } else if (!_self.data.user_exprect) {
      wx.showToast({
        title: "求职期望不能为空",
        icon: "none",
        duration: 1000
      });
    } else {
      console.log(
        _self.data.resume_id,
        app.globalData.student_id,
        _self.data.resumeTitle,
        _self.data.user_name,
        _self.data.user_phone,
        _self.data.user_email,
        _self.data.user_exprect,
        app.globalData.token
      );
      wx.request({
        url: `${resumeBasicEdit}`,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          resumes_id: _self.data.resume_id,
          student_id: app.globalData.student_id,
          title: _self.data.resumeTitle,
          truename: _self.data.user_name,
          mobile: _self.data.user_phone,
          email: _self.data.user_email,
          expectwork: _self.data.user_exprect,
          token: app.globalData.token
        },
        success: res => {
          console.log(res)
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.submitResumeInfo()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == '0') {
              let timer = setTimeout(() => {
                wx.navigateBack()
                clearTimeout(timer)
              }, 300)
            }
            wx.showToast({
              title: res.data.errortip,
              icon: "none",
              duration: 1000
            });
          }
        },
        fail: res => { },
        complete: res => { }
      })
    }
  },
  uploadUserImg() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    console.log(app.globalData.student_id, _self.data.resume_id)
    if (!!_self.data.user_pic && (_self.data.origin_user_pic !== _self.data.user_pic)) {
      wx.uploadFile({
        url: `${uploadImg}`,
        header: {
          "Content-Type": "multipart/form-data"
        },
        method: 'POST',
        filePath: _self.data.user_pic,
        name: 'image',
        formData: {
          'file': _self.data.userImgPath,
          'stu_id': app.globalData.student_id,
          'resumes_id': _self.data.resume_id,
          'token': app.globalData.token
        },
        success: res => {
          const data = JSON.parse(res.data)
          console.log(res)
          if (data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.uploadUserImg()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (data.error == '0') {
              wx.showToast({
                title: data.errortip,
                icon: "none",
                duration: 1000
              });
            }
          }
        }
      })
    } else {
      wx.showToast({
        title: "请先选择想要上传的图片",
        icon: "none",
        duration: 1000
      });
    }
  },

  getResumeDetail(id) {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    wx.request({
      url: `${getResumeOne}`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        resumes_id: id,
        stu_id: app.globalData.student_id,
        token: app.globalData.token
      },
      success: res => {
        console.log(res)
        if (res.data.tokeninc == '0') {
          if (loginType == 'wxlogin') {
            setNewToken().then(res => {
              if (res == 'ok') {
                _self.getResumeDetail(id)
              }
            })
          } else {
            initLoginStatus()
          }
        } else {
          if (res.data.error == '0') {
            const { listjson } = res.data
            this.setData({
              user_pic: listjson.img,
              origin_user_pic: listjson.img,
              resumeTitle: listjson.title,
              user_name: listjson.truename,
              user_phone: listjson.mobile,
              user_email: listjson.email,
              user_exprect: listjson.expectwork,
            })
          }
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(options)
    let id = options.id
    let lan = options.lan

    this.setData({
      lan: options.lan,
      resume_id: id,
      user_exprect: this.data.jobExpect[this.data.jobExpectIndex]
    })

    this.getResumeDetail(id)

    new Promise((resolve, reject) => {
      wx.request({
        url: `${jobExpect}?language=${lan}`,
        success: res => {
          if (res.data.error == '0') {
            const { listjson } = res.data
            const expectOne = []
            listjson.forEach((v, i) => {
              expectOne.push(v.categoryName1)
            })
            this.setData({
              expectOne: listjson,
              expectOneC: expectOne
            })
            resolve(listjson)
          }
        }
      })
    }).then(res => {
      wx.request({
        url: `${getPositionType}?level=2&father_id=${res[0].categoryId1}`,
        success: res => {
          if (res.data.error == '0') {
            const arr = []
            res.data.listjson.forEach((v, i) => {
              arr.push(v.categoryName2)
            })
            this.setData({
              multiArray: [this.data.expectOneC, arr]
            })
          }
        }
      })
    })
  }
});
