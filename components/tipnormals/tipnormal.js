// components/tips/tip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    tips: ''
  },
  attached() {
    this.setData({
      tips: this.data.content
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
