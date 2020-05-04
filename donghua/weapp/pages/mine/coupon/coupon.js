import {
  usable_cash,
  disable_cash,
  create_qrcode,
  my_cash
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    coupons: [],
    winHeight: 0,
    coupon_num: 0,
    image: ''
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

  show_useable() {
    var that = this
    usable_cash({
      user_id: store.get('user_id'),
      shop_id:app.globalData.shop_id
    }).then((res) => {
      that.setData({
        coupons: res.data,
        winHeight: res.data.length * 112,
        coupon_num: res.data.length
      })
    })
  },


  touse(e) {
    //console.log(e,"llllllll")
   // store.set('coupon', e.currentTarget.dataset.coupon)
    wx.navigateTo({
      url: '/pages/mine/couponCode/couponCode?barcode=' + e.currentTarget.dataset.barcode
    })
  },
  

  get_cash(goods_id, order_type) {
    var that = this
    var goods = []
    wx.getStorage({
      key: 'singleorderinfo',
      success: function (res) {
        res.data.forEach(function (item) {
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
              coupons: res.data,
              winHeight: res.data.length * 112,
              coupon_num: res.data.length
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


  show_unuseable() {
    var that = this
    disable_cash({
      user_id: store.get('user_id'),
      shop_id:app.globalData.shop_id
    }).then((res) => {
      that.setData({
        coupons: res.data,
        winHeight: res.data.length * 112,
        coupon_num: res.data.length
      })
    })
  },
  bindchange(e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    })
    if (that.data.currentTab == 0) {
      that.show_useable()
      //that.get_cash()
    } else if (that.data.currentTab == 1) {
      that.show_unuseable()
    }
  },
  
  // touse(e) {
  //   wx.navigateTo({
  //     url: '/pages/mine/couponCode/couponCode?barcode=' + e.currentTarget.dataset.barcode,
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight,
      backgroundColor: app.globalData.selectedColor,
    })
    that.show_useable()
    //that.get_cash(options.goods_id, options.order_type)
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
    //this.show_useable()
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