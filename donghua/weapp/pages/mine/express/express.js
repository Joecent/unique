// pages/mine/express/express.js

import { get_shipping } from '../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    none: true,
    error: true
  },
  
  get_info(id) {
    wx.showLoading({
      title: '查询中',
    })
    var that = this
    get_shipping({ order_id: id }).then((res) => {
      wx.hideLoading()
      if (res.error_code == 1000) {
        if (res.data.data.length == 0) {
          that.setData({
            none: false
          })
        } else {
          that.setData({
            express_infos: res.data.data,
          })
        }
      } else if (res.error_code == 1001) {
        that.setData({
          error: false
        })
      } else if (res.error_code == 1002 || 1004) {
        that.setData({
          none: false
        })
      };
    })
  },

  toback(){
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight
    })
    this.get_info(options.order_id)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})