// pages/mine/couponUse/couponUse.js
import {
  my_cash
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    none: true
  },

  touse(e) {
    console.log(e, "123")
    store.set('coupon', e.currentTarget.dataset.coupon)
    wx.navigateBack({
      delta: 1,
    })
  },


  get_cash(goods_id, order_type) {
    var that = this
    var goods = []
    wx.getStorage({
      key: 'singleorderinfo',
      success: function(res) {
        res.data.forEach(function(item) {
          goods.push({
            product_id: item.product_id,
            count: item.count
          })

        })
        my_cash({
          user_id: app.globalData.userid,
          shop_id: app.globalData.shop_id,
          goods: goods
        }).then((res) => {
          if (res.error_code == 1000) {
            that.setData({
              coupons: res.data
            })
          } else {
            that.setData({
              none: false
            })
          }
        })
      },
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight,
      backgroundColor: app.globalData.selectedColor,
    })
    that.get_cash(options.goods_id, options.order_type)
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