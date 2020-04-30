// pages/mine/refundlist/refundlist.js
import { businessAftermarketOrder,upAftermarketOrder} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList:'',
    backgroundColor: app.globalData.selectedColor
  },
  /**
   * 查看详情
   */
  serviceinfo(e) {
    wx.navigateTo({
      url: '/pages/mine/refunddetail/refunddetail?order_id=' + e.currentTarget.dataset.order_id+'&type=shop&user_id='+e.currentTarget.dataset.user_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    businessAftermarketOrder({
      shop_id:app.globalData.shop_id
      //shop_id:234
    }).then(res=>{
      //console.log(res,'888')
      that.setData({
        serviceList:res.data.goodsOrder
      })
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