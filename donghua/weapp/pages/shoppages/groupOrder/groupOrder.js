// pages/shoppages/groupOrder/groupOrder.js
import {
  search_order
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: ''
  },
 
 
  order_info(order_sn) {
    let that = this
    search_order({
      order_sn: order_sn
    }).then((res) => {
      that.setData({
        goods_img: res.data[0].goods_img,
        goods_name: res.data[0].goods_name,
        goods_price: res.data[0].goods_cost,
       // market_price: res.data[0].market_price,
        order_time: res.data[0].order_time,
        phone: res.data[0].phone,
        address: res.data[0].address,
        detail: res.data[0].detail,
        receiver: res.data[0].receiver,
        is_leader: res.data[0].is_leader,
        group_status: res.data[0].group_status
      })
      that.data.goods_id = res.data[0].goods_id
    })
  },

  gohome(){
    wx.redirectTo({
      url: '/pages/shoppages/index/index',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      bar: app.globalData.barHeight,
      group_num: options.group_num,
      backgroundColor: app.globalData.selectedColor,
    })
    that.order_info(options.order_sn)
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
    var that = this
    return {
      title: '我发起了一个拼单，你要不要一起参与？',
      path: '/pages/shoppages/groupbuy/groupbuy?openid=' + store.get('openid') + '&goods_id=' + that.data.goods_id,
      success: (res) => {
        console.log(that.data.goods_id)
      },
      fail: (res) => {
        console.log(that.data.goods_id)
      }
    }
  }
})