import {
  pushSetting,
  getPushSetting
} from '../../api';

Page({
  data: {
    dxts: false,
    yjts: false,
    znxts: false,
    noticeStep: [
      { name: '实时推送', id: '1', checked: true },
      { name: '每日一次', id: '2', checked: false },
      { name: '每周一次', id: '3', checked: false }
    ],
    curId: ''
  },
  switchChange (e) {
    console.log(e.detail.value)
  },
  cType (e) {
    let type = e.currentTarget.dataset.type
    switch(type) {
      case 'dxts':
        this.setData({
          dxts: !this.data.dxts
        })
        break;
      case 'yjts':
        this.setData({
          yjts: !this.data.yjts
        })
        break;
      case 'znxts':
        this.setData({
          znxts: !this.data.znxts
        })  
        break;
      default:
        break;
    }
    console.log(this.data.dxts, this.data.yjts, this.data.znxts)
  },
  cStep (e) {
    let id = e.target.dataset.id
    this.setData({
      curId: id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})