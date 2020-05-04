// pages/shoppages/Collages/Collages.js

import {
  auth,
  goods_list,
  //show_cut,
  add_shopcart,
  show_commend,
  wx_group_info
} from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    total_page:'',
    none:false,
    showView: true,
    shop_id: '',
    ungetInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  showButton: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

  // 拼团
  // toCutGoodsPages(e) {
  //   wx.navigateTo({
  //     url: '../groupbuy/groupbuy?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + app.globalData.shop_id,
  //   })
  // },

  toCutGoodsPages(e) {
    //console.log(e)
    var that = this
    if (!store.get('user_id')) {
      that.setData({
        ungetInfo: true
      })
    } else {
      wx.navigateTo({
        url: '../groupbuy/groupbuy?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + app.globalData.shop_id,
      })
    }
  },
  
  show_group() {
    var that = this
    wx_group_info({
      shop_id: app.globalData.shop_id,
      page:that.data.page
    }).then((res) => {
      if (res.error_code == 1000) {
        that.setData({
         // showCut: true,
          goods: res.data.goods, 
          total_page:res.data.total_page
          //group_price: res.data.group_price
        })
      } else if (res.error_code == 1001) {
        that.setData({
          none:true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    that.show_group()
  },



  // 授权登录
  bindGetUserInfo: function (e) {
    var that = this
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
          //is_new: that.data.is_new,
          ungetInfo: false
        })
      }
    }).then(function () {
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback(app.globalData.userid, app.globalData.ungetInfo)
      }
    }).then(function () {
      app.globalData.ungetInfo = false
      that.setData({
        ungetInfo: false
      })
    })

    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
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
    var that=this
    wx.showLoading({
      title: '全力加载中',
    })
    if (that.data.page < that.data.total_page) {
    wx_group_info({
      shop_id: app.globalData.shop_id,
      page: that.data.page+1
    }).then((res) => {
      if (res.error_code == 1000) {
        wx.hideLoading()
        var goods_pre = that.data.goods
        for (var i = 0; i < res.data.goods.length; i++) {
          goods_pre.push(res.data.goods[i])
        }
        that.setData({
          // showCut: true,
          goods: goods_pre,
          page:that.data.page+1
        })
      } 
    })
    } else {
      wx.hideLoading()
      that.setData({
        loadall: false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})