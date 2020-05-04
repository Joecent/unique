// pages/shoppages/goodslist/goodslist.js
import {
  goods_list,
  auth
} from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    index: 0,
    coupon_num: 0,
    page: 1,
    total_page:'',
    loadall: true,
    cate_id: "",
    ungetInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  show_cate(cate_id) {
    var that = this
    goods_list({
      shop_id: app.globalData.shop_id,
      cate_id: cate_id,
      page: that.data.page
    }).then((res) => {
      if (res.error_code == 1000) {
        wx.showLoading({
          title: '全力加载中',
          duration: 500
        })
        that.data.total_page = res.data.total_page
        that.setData({
          goods: res.data.goods,
          loadall: true,
          winHeight: Math.round(res.data.goods.length / 2) * 540
          //coupon_num: res.data.total_page
        })
        wx.setNavigationBarTitle({
          title: res.data.cate_name
        })
      } else {
        wx.showLoading({
          title: '加载失败',
          duration: 500
        })
      }
    })
  },


  // toGoodsinfo(e) {

  //   var homeid = e.currentTarget.dataset.goods_id
   
  //   wx.navigateTo({
  //     url: '/pages/shoppages/goods/goods?goods_id=' + homeid,
  //   })
  // },

  toGoodsinfo(e) {
    //console.log(e)
    var that = this
    var homeid = e.currentTarget.dataset.goods_id
    if (!store.get('user_id')) {
      that.setData({
        ungetInfo: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/shoppages/goods/goods?goods_id=' + homeid,
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.show_cate(options.cate_id)
    that.setData({
      bar: app.globalData.barHeight,
      cate_id: options.cate_id,
        backgroundColor: app.globalData.selectedColor,
    })
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
      console.log(response, "授权")
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
    var that = this
    wx.showLoading({
      title: '全力加载中',
    })
    if (that.data.page < that.data.total_page) {
      goods_list({
        shop_id: app.globalData.shop_id,
        cate_id: that.data.cate_id,
        page: that.data.page + 1
      }).then((res) => {
        if (res.error_code == 1000) {
          wx.hideLoading()
          var goods_pre = that.data.goods
          for (var i = 0; i < res.data.goods.length; i++) {
            goods_pre.push(res.data.goods[i])
          }
          that.setData({
            goods: goods_pre,
            winHeight: Math.round(goods_pre.length / 2) * 540,
            page: that.data.page + 1,
            loadall: false
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
  onShareAppMessage: function () {

  }
})