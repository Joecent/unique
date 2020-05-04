// pages/shoppages/search/search.js
import {
  goods_list,
  shop_info,
  search_tea_goods,
  add_shopcart
} from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
const app = getApp()

import debounce from '../../../utils/debounce'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    constants: [],
    hasMore: true,
    loading: false,
  },

  search(e) {
    console.log(e)
    var that = this
    search_tea_goods({
      shop_id: app.globalData.shop_id,
      goods_name: e.detail.value
    }).then((res) => {
      console.log(res)
      if (res.error_code == 1000) {
        if (res.data.length != 0) {
          wx.showLoading({
            title: '正在加载中...',
            duration: 500
          })
          setTimeout(function () {
            that.setData({
              constants: res.data,
              inputVal: e.detail.value,
            });
          }, 500)
        } else {
          wx.showLoading({
            title: '暂无所需商品',
            duration: 500
          })
          setTimeout(function () {
            // wx.hideLoading()
            that.setData({
              goods: []
            })
          }, 500)
        }
      }
    })
  },



  // 跳转详情页
  toGoodsinfo(e) {
    console.log(e, "123")

    wx.navigateTo({
      url: '/pages/shoppages/goods/goods?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + this.data.shop_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      backgroundColor: app.globalData.selectedColor,
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