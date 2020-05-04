// pages/mine/mine.js
import {
  get_config,
  auth,
  user_info,
  change_photo,
  get_applyDistributio
} from '../../utils/api.js'
import * as store from '../../utils/store.js'
const app = getApp()
Page({
/**
 * 页面的初始数据
 */
data: {
    hidDistribution: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  toShops: function() {
    wx.redirectTo({
      url: '../shoppages/shops/shops',
    })
  },
  toCart: function() {
    wx.redirectTo({
      url: 'cart/cart',
    })
  },
  toIndex: function() {
    wx.redirectTo({
      url: '../shoppages/index/index',
    })
  },


  bindGetUserInfo: function(e) {
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.code = res.code
        store.set('me', e.detail.userInfo)
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = e.detail.userInfo
        auth({
          shop_id: app.globalData.shop_id,
          code: app.globalData.code,
          name: e.detail.userInfo.nickName,
          photo: e.detail.userInfo.avatarUrl,
          sex: e.detail.userInfo.gender
        }).then((response) => {
          if (response.error_code == 1000) {
            app.globalData.userid = response.data.user_id
            store.set('openid', response.data.openid)
            store.set('user_id', response.data.user_id)
            that.setData({
              showLoad: false,
              avatar: e.detail.userInfo.avatarUrl,
              name: e.detail.userInfo.nickName
            })
            // that.user_info()
          }
        })
      }
    })
  },

  user_info() {
    var that = this
    user_info({
      user_id: store.get('user_id')
    }).then((res) => {
      // console.log(res)
      if (res.error_code = 1000) {
        that.setData({
          avatar: res.data.photo,
          name: res.data.name
        })
      }
    })
  },

  //添加地址
  toaddress() {
    wx.navigateTo({
      url: '/pages/mine/address/address',
    })
  },

  // 我的砍价
  tomycut() {
    wx.navigateTo({
      url: '/pages/mine/cut/cut'
    })
  },

  //我的拼团
  tomygroup() {
    wx.navigateTo({
      url: '/pages/mine/groupbuy/groupbuy',

    })
  },

  //我的优惠券
  tocoupon() {
    wx.navigateTo({
      url: '/pages/mine/coupon/coupon',
    })
  },

  //我的预约
  appointment() {
    wx.navigateTo({
      url: '/pages/mine/appointment/appointment',
    })
  },

  //退款售后

  torefund() {
    wx.navigateTo({
      url: '/pages/mine/refund/refund',
    })
  },

  tonotpay(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },

  tonotpost(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },
  tonotreceive(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },
  tofinish(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },
  //分销
  toDistribution(e) {
    // wx.navigateTo({
    //   url: 'applyFor/applyFor',
    // })
    get_applyDistributio({
      user_id: store.get('user_id'),
      u: '',
      getStatus: '1',
    }).then((response) => {
      // console.log(response)
      // wx.showLoading({
      //   title: response.msg,
      // })
      // setTimeout(function() {
      // wx.hideLoading()
      var actuality = JSON.stringify(response.data);
      if (response.status == 2) {
        if (response.data.status == 0) {
          wx.navigateTo({
            url: 'applyForResult/applyForResult?actuality=' + actuality,
          })
        } else {
          if (response.data.verify_status == 1) {
            wx.navigateTo({
              url: 'distribution/distribution'
            })
          } else {
            wx.navigateTo({
              url: 'applyForResult/applyForResult?actuality=' + actuality,
            })
          }
        }
      } else {
        wx.navigateTo({
          url: 'applyFor/applyFor',
        })
      }
      // }, 1000)
    })
  },

  getConfig: function() {
    get_config({
      shop_id: app.globalData.shop_id
    }).then((response) => {
      if (response.msg.is_share == 1) {
        this.setData({
          hidDistribution: true
        })
      } else {
        this.setData({
          hidDistribution: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (!store.get('user_id')) {
      that.setData({
        showLoad: true
      })
    }
    that.user_info()
    that.getConfig()
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
    let that = this
    that.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    if (!store.get('user_id')) {
      that.setData({
        showLoad: true
      })
    }
    that.user_info()
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