// pages/mine/orderinfo/orderinfo.js

const app = getApp()
import * as store from '../../../utils/store.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var goods_info = []
    wx.getStorage({
      key: 'orderinfo',
      success: function (res) {
        console.log(res)
        // that.data.
        for (var i = 0; i < res.data.order.goodscost.length; i++) {
          goods_info.push({
            goodscost: res.data.order.goodscost[i],
            goodsid: res.data.order.goodsid[i],
            goodsimg: res.data.order.goodsimg[i],
            goodsname: res.data.order.goodsname[i],
            goodsnum: res.data.order.goodsnum[i],
            order_sn: res.data.order.order_sn
          })
        }
        that.setData({
          order_status: res.data.order_status,
          goods: goods_info,
          address: res.data.order.address,
          detail: res.data.order.detail,
          receiver: res.data.order.receiver,
          phone: res.data.order.phone,
          order_sn: res.data.order.order_sn,
          order_time: res.data.order.order_time,
          pay_money: res.data.order.pay_money,
          
        })
      },
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