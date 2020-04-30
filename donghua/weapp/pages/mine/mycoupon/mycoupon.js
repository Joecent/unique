// pages/mine/mycoupon/mycoupon.js
import { cash_list } from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: '#FF5D35',
    coupons: [],
    none: false
  },
  my_cash_list(){
    let that=this
    cash_list({
      shop_id:app.globalData.shop_id
    }).then(res=>{
      if(res.error_code==1000&&res.data.length!=0){
        that.setData({
          none:true,
          coupons:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.my_cash_list()
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
  onShareAppMessage: function (e) {
    var that = this
    return {
      title: '【' + app.globalData.shop_name + '】送你一张优惠券，邀你一起来团购！',
      path: '/pages/index/index?cash_id=' + e.target.dataset.cash_id + '&cash_name=' + e.target.dataset.cash_name + '&pay_money=' + e.target.dataset.pay_money + '&cash_money=' + e.target.dataset.cash_money+'&shop_id='+app.globalData.shop_id,
      imageUrl: app.globalData.share_bg_img,
    }
  }
})