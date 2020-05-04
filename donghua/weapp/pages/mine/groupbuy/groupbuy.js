// pages/mine/groupbuy/groupbuy.js

import * as store from '../../../utils/store.js'
import {
  my_group
} from '../../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups: [],
    groups_num: 0,
    goods_id: '',
    currentTab: 0,
    winHeight: 0,
  },

  toshare(e) {
    var that = this
    that.data.goods_id = e.currentTarget.dataset.goods_id
  },

  get_groups() {
    var that = this
    my_group({
      user_id: store.get('user_id')
    }).then((res) => {
       
      var group= res.data
      
      group.sort(that.compare("order_id"));
     
      that.setData({
        groups: group,
        groups_num: res.data.length, 
        winHeight: res.data.length * 360,
      })
    })
  },
  
  // 判断数组 从大到小排
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },


  toorderinfo(e) {
    wx.navigateTo({
      url: '/pages/shoppages/groupOrder/groupOrder?order_sn=' + e.currentTarget.dataset.order_sn + '&group_num=' + e.currentTarget.dataset.group_num,
    })
  },

  swichNav(e) {
    var that = this
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData(({
        currentTab: e.currentTarget.dataset.current
      }))
    }
  },

  bindchange(e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight,
      name: store.get('me').nickName,
      image: store.get('me').avatarUrl,
      backgroundColor: app.globalData.selectedColor,
    })
    that.get_groups()
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