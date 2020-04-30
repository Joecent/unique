// pages/mine/couponUse/couponUse.js
import {my_cash} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: '#FF5D35',
    coupons:[],
    none:true
  },
back(){
  wx.navigateBack({
    delta: 1,
  })
},
touse(e){
  store.set('coupon',e.currentTarget.dataset.coupon)
  wx.navigateBack({
    delta: 1,
  })
},
get_cash(){
  var that=this
  var goods=[]
  wx.getStorage({
    key: 'cartShop',
    success: function (res) {
      res.data.forEach(function(item){
        goods.push({price:item.price,count:item.num})
      })
      my_cash({
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        goods:goods
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
  onLoad: function (options) {
    var that=this
    that.get_cash()
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