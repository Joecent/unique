// pages/mine/address/address.js

import {
  get_address,
  del_address,
  default_address
} from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor
  },

  /**
   * 删除地址
   */
  binddelete(e) {
    var that = this
    del_address({
      address_id: e.currentTarget.dataset.id
    }).then((res) => {
      if (res.error_code == 1000) {
        wx.showLoading({
          title: '删除成功',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        that.onLoad()
      }
    })
  },

  /**
   * 选择地址
   */
  bindaddreeChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
    wx.setStorage({
      key: "editaddress",
      data: e.currentTarget.dataset
    })
  },

  /**
   * 添加新地址
   */
  bindaddnewaddress: function () {
    wx.navigateTo({
      url: '/pages/mine/addaddress/addaddress'
    })
  },

  /**
   * 去编辑地址
   */
  bindedit(e) {
    wx.navigateTo({
      url: '/pages/mine/editaddress/editaddress?',
    })
    store.set('editaddress', e.currentTarget.dataset)
  },

  /**
   * 点击文字设为默认
   */
  bindradioChange(e) {
    var that = this
    default_address({
      address_id: e.currentTarget.dataset.id,
      user_id: app.globalData.userid
    }).then((res) => {
      if (res.error_code == 1000) {
        wx.showLoading({
          title: '已设为默认',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    }).then(function () {
      that.onLoad()
    })

  },
  /**
   * 点击圆圈设为默认
   */
  radioChange(e) {
    var that = this
    default_address({
      address_id: e.currentTarget.dataset.id,
      user_id: app.globalData.userid
    }).then((res) => {
      if (res.error_code == 1000) {
        wx.showLoading({
          title: '已设为默认',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    }).then(function () {
      that.onLoad()
      
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bar: app.globalData.barHeight,
      backgroundColor: app.globalData.selectedColor,
    })
    get_address({
      user_id: app.globalData.userid
    }).then((res) => {
      this.setData({
        list: res.data,
        winHeight: res.data.length * 130,
      })
      if(res.data.length==1){
        wx.setStorage({
          key: "editaddress",
          data: res.data[0]
        })
      }
    })
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
    this.onLoad()
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