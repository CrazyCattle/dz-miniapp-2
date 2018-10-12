import {
  getUnvDegree,
  getMajorsArray,
  getfacultyArray,
  studentEduEdit
} from '../../api';

import {
  formatTime,
  setNewToken,
  initLoginStatus
} from '../../utils/util';

const app = getApp()
var stud_info = {}
const idCDegree = {}
const idCDepartment = {}
const idCMajor = {}

Page({
  data: {
    stud_info: '',
    educ: [],
    department: [],
    major: [],
    index: 0,
    departmentIndex: 0,
    majorIndex: 0,
    endTime: '',

    educCont: '',//用户学历
    departmentCont: '',//用户院系
    majorCont: '',//用户专业

    degreeId: '',// 学历id
    departmentId: '',//学院id
    majorId: '',//专业id
    university_id: '',//学校id

    student_stgraduatetwo: '',//入学时间
    student_edgraduate: '',//毕业时间
    student_name: '',//学号
  },
  listenerMajor: function (e) {
    this.setData({
      majorIndex: e.detail.value
    });
    let selectMajor = this.data.major[this.data.majorIndex]
    for (let key in idCMajor) {
      if (idCMajor[key] == selectMajor) {
        this.setData({
          majorId: key
        })
      }
    }
    console.log(this.data.majorId)
  },
  listenerDepartment: function (e) {
    this.setData({
      departmentIndex: e.detail.value
    });
    let selectDepartment = this.data.department[this.data.departmentIndex]
    for (let key in idCDepartment) {
      if (idCDepartment[key] == selectDepartment) {
        this.setData({
          departmentId: key
        })
      }
    }
    console.log(this.data.departmentId)
    wx.request({
      url: `${getMajorsArray}?faculty_id=${this.data.departmentId}`,
      success: data => {
        if (data.data.error == '0') {
          const { listjson } = data.data
          console.log(listjson)
          const major = []
          listjson.map((v, i) => {
            let id = ''
            let name = ''
            for (let key in v) {
              if (key == 'major_id') {
                id = v['major_id']
              }
              if (key == 'major_name') {
                name = v['major_name']
              }
              idCMajor[id] = name
            }
            major.push(v.major_name)
          })
          this.setData({ major })
          major.forEach((v, majorIndex) => {
            if (v == this.data.majorCont) {
              this.setData({ majorIndex })
              for (let key in idCMajor) {
                if (idCMajor[key] == v) {
                  this.setData({
                    majorId: key
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  listenerPickerSelected: function (e) {
    this.setData({
      index: e.detail.value
    });
    let selectDegree = this.data.educ[this.data.index]
    for (let key in idCDegree) {
      if (idCDegree[key] == selectDegree) {
        this.setData({
          degreeId: key
        })
      }
    }
  },
  listenerStartTime(e) {
    this.setData({
      student_stgraduatetwo: e.detail.value
    })
  },
  listenerEndTime(e) {
    this.setData({
      student_edgraduate: e.detail.value
    })
  },
  iptStudenNumber(e) {
    console.log(e)
    this.setData({
      student_name: e.detail.value.trim()
    })
  },
  modifyEduc() {
    let _self = this
    let loginType = wx.getStorageSync('loginType')

    if (!_self.data.student_name) {
      wx.showToast({
        title: "学号不能为空",
        icon: "none",
        duration: 1000
      });
    } else {
      console.log(
        _self.data.degreeId,
        _self.data.departmentId,
        _self.data.majorId,
        _self.data.student_name,
        _self.data.student_stgraduatetwo,
        _self.data.student_edgraduate
      )
      wx.request({
        url: studentEduEdit,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          university_id: _self.data.university_id,
          stu_id: app.globalData.student_id,
          student_degree: _self.data.degreeId,
          faculty_id: _self.data.departmentId,
          major_id: _self.data.majorId,
          student_name: _self.data.student_name,
          student_stgraduatetwo: _self.data.student_stgraduatetwo,
          student_edgraduate: _self.data.student_edgraduate,
          token: app.globalData.token
        },
        success: res => {
          console.log(res)
          if (res.data.tokeninc == '0') {
            if (loginType == 'wxlogin') {
              setNewToken().then(res => {
                if (res == 'ok') {
                  _self.modifyEduc()
                }
              })
            } else {
              initLoginStatus()
            }
          } else {
            if (res.data.error == '0') {
              const { listjson } = res.data
              wx.showToast({
                title: res.data.errortip,
                icon: "none",
                duration: 1000
              })
              for (let k in listjson) {
                stud_info[k] = listjson[k]
              }
              wx.setStorageSync('stud_info', stud_info)
              wx.navigateBack()
            }
          }
          
        }
      })
    }
  },
  onLoad: function (options) {
    stud_info = wx.getStorageSync('stud_info')
    this.setData({
      user_school: wx.getStorageSync('schoolInfo').university_title,
      university_id: wx.getStorageSync('schoolInfo').university_id,
      stud_info: wx.getStorageSync('stud_info'),
      student_stgraduatetwo: wx.getStorageSync('stud_info').student_stgraduatetwo || '请选择年月',
      student_edgraduate: wx.getStorageSync('stud_info').student_edgraduate || '请选择年月',
      student_name: wx.getStorageSync('stud_info').student_name || '请选择年月',

      educCont: wx.getStorageSync('stud_info').student_degree_name || '请选择学历',
      departmentCont: wx.getStorageSync('stud_info').faculty_name || '请选择专业',
      majorCont: wx.getStorageSync('stud_info').major_name || '请选择专业',

      endTime: formatTime(new Date())
    })
    wx.request({
      url: `${getUnvDegree}?university_id=${this.data.university_id}`,
      success: res => {
        if (res.data.error == '0') {
          const { listjson } = res.data
          const educ = []
          console.log(listjson)
          listjson.map((v, i) => {
            var id = ''
            var name = ''
            for (let key in v) {
              if (key == 'list_parameter') {
                id = v['list_parameter']
              }
              if (key == 'list_name') {
                name = v['list_name']
              }
              if (id > 0 || id === '0') {
                idCDegree[id] = name
              }
            }
            console.log(idCDegree)
            educ.push(v.list_name)
          })
          this.setData({ educ })
          educ.forEach((v, index) => {
            if (v == this.data.educCont) {
              this.setData({ index })
              for (let key in idCDegree) {
                if (idCDegree[key] == v) {
                  this.setData({
                    degreeId: key
                  })
                }
              }
            }
          })
        }
      }
    })

    new Promise((resolve, reject) => {
      wx.request({
        url: `${getfacultyArray}?university_id=${this.data.university_id}`,
        success: res => {
          if (res.data.error == '0') {
            const { listjson } = res.data
            const department = []
            listjson.map((v, i) => {
              let id = ''
              let name = ''
              for (let key in v) {
                if (key == 'faculty_id') {
                  id = v['faculty_id']
                }
                if (key == 'faculty_name') {
                  name = v['faculty_name']
                }
                idCDepartment[id] = name
              }
              department.push(v.faculty_name)
            })
            this.setData({ department })
            department.forEach((v, departmentIndex) => {
              if (v == this.data.departmentCont) {
                this.setData({ departmentIndex })
                for (let key in idCDepartment) {
                  if (idCDepartment[key] == v) {
                    this.setData({
                      departmentId: key
                    })
                  }
                }
              }
            })
            resolve(this.data.departmentId)
          }
        }
      })
    }).then((res) => {
      wx.request({
        url: `${getMajorsArray}?faculty_id=${res}`,
        success: data => {
          if (data.data.error == '0') {
            const { listjson } = data.data
            console.log(listjson)
            const major = []
            listjson.map((v, i) => {
              let id = ''
              let name = ''
              for (let key in v) {
                if (key == 'major_id') {
                  id = v['major_id']
                }
                if (key == 'major_name') {
                  name = v['major_name']
                }
                idCMajor[id] = name
              }
              major.push(v.major_name)
            })
            this.setData({ major })
            major.forEach((v, majorIndex) => {
              if (v == this.data.majorCont) {
                this.setData({ majorIndex })
                for (let key in idCMajor) {
                  if (idCMajor[key] == v) {
                    this.setData({
                      majorId: key
                    })
                  }
                }
              }
            })
          }
        }
      })
    })
  },
  onShow: function () {

  }
})