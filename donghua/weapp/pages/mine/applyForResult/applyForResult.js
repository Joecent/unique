// pages/mine/applyForResult/applyForResult.js
import {
  get_applyDistributio,
  send_code
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidForbidden: true,
    hidWait: true,
    hidBust: true,
  },
  applyAgain:function(){
    wx.redirectTo({
      url: '../applyFor/applyFor',
    })
  },
//判断显示哪个模块
  judgement: function(e) {
    get_applyDistributio({
      user_id: store.get('user_id'),
      u: '',
      shop_id: app.globalData.shop_id,
      getStatus: '1',
    }).then((response) => {
      console.log(response)
      if (response.data.status == 0) {
        this.setData({
          hidForbidden: false,
        })
      } else {
        if (response.data.verify_status == 2) {
          this.setData({
            hidBust: false
          })
        } else if (response.data.verify_status == 1) {
          wx.redirectTo({
            url: '../distribution/distribution',
          })
        } else {
          this.setData({
            hidWait: false,
          })
        }
      }
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
    that.judgement()
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