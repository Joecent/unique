// pages/mine/distribution/distribution.js

import {
  get_distributioToal,
  get_income,
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    moreHid: true,
    extraHid: true,
  },
  showStratum: function (e) {
    var that = this;
    that.setData({
      display: "block",
      extra: e.currentTarget.dataset.user.extra
    })
  },
  hideview: function () {
    this.setData({
      display: "none"
    })
  },

  jumoOrCode: function() {
    wx.navigateTo({
      url: '../ORcode/ORcode',
    })
  },

  jumoWithdraw: function() {
    wx.navigateTo({
      url: '../withdraw/withdraw?allIncome=' + this.data.allIncome,
    })
  },

  jumpSelesDetails: function() {
    wx.navigateTo({
      url: '../salesDetails/salesDetails',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this
    that.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    get_distributioToal({
      user_id: store.get('user_id'),
    }).then((response) => {
      that.setData({
        phone: response.userInfo.phone,
        name: response.userInfo.name,
        avatarUrl: response.userInfo.photo,
        list: response.detail,
        allIncome: response.userInfo.blance
      })
    })
    get_income({
      user_id: store.get('user_id'),
      page: 1,
      limit: 12
    }).then((response) => {
      console.log(response.detail)
      if (response.detail.length <= 3) {
        that.setData({
          moreHid: true
        })
      } else {
        that.setData({
          moreHid: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})