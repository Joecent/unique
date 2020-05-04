// pages/mine/cut/cut.js
import {
  show_one_cut
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    winHeight: '',
    winHeight_first: '',
    winHeight_second: '',
    none: true,
    none_first: true,
    none_second: true
  },


  to_order(e) {
    wx.setStorage({
      key: "singleorderinfo",
      data: [{
        active: true,
        count: 1,
        goods_id: e.currentTarget.dataset.goods_id,
        image: e.currentTarget.dataset.goods_img,
        key_name: e.currentTarget.dataset.spec,
        price: e.currentTarget.dataset.price,
        self_id: e.currentTarget.dataset.self_id,
        name: e.currentTarget.dataset.goods_name
      }]
    })
    wx.navigateTo({
      url: '/pages/shoppages/singleorderinfo/singleorderinfo',
    })
  },
  

  swichNav(e) {
    var that = this
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      if (e.currentTarget.dataset.current == 0) {
        that.setData({
          currentTab: e.currentTarget.dataset.current,
          winHeight: that.data.winHeight_first,
          none: that.data.none_first
        })
      } else if (e.currentTarget.dataset.current == 1) {
        if (that.data.none_second == false) {
          that.setData({
            none: false,
            currentTab: e.currentTarget.dataset.current,
          })
        } else {
          that.setData({
            none: true,
            currentTab: e.currentTarget.dataset.current,
            winHeight: that.data.winHeight_second
          })
        }
      }
    }
  },


  recut(e) {
    //console.log(e,"跳转")
    wx.navigateTo({   
      url: '/pages/shoppages/cutPriceDesc/cutPriceDesc?goods_id=' + e.currentTarget.dataset.goods_id + "&get_price=" + e.currentTarget.dataset.get_price + "&goods_price=" + e.currentTarget.dataset.goods_price
    })
  },



  Tocut(e){
    console.log(e,"shdbchbhb")
    wx.navigateTo({
      url: '/pages/shoppages/helpCut/helpCut?goods_id=' + e.currentTarget.dataset.goods_id + "&self_id=" + e.currentTarget.dataset.self_id 
    })
  },


  show_cut() {
    var that = this
    show_one_cut({
      shop_id: app.globalData.shop_id,
      openid: store.get('openid')
    }).then((res) => {
      that.data.winHeight_first = (res.data[1].length + res.data[2].length) * 234
      that.data.winHeight_second = (res.data[3].length) * 234
      if (res.data[1] != '' && res.data[2] != '') {
        that.setData({
          cut_success: res.data[1],
          cut: res.data[2],
          winHeight: that.data.winHeight_first
        })
      } else if (res.data[2] != '' && res.data[1] == '') {
        that.setData({
          cut: res.data[2],
          winHeight: that.data.winHeight_first
        })
      } else if (res.data[1] != '' && res.data[2] == '') {
        that.setData({
          cut_success: res.data[1],
          winHeight: that.data.winHeight_first
        })
      } else if (res.data[1] == '' && res.data[2] == '') {
        that.data.none_first = false
        that.setData({
          none: false
        })
      }
      if (res.data[3] != '') {
        that.setData({
          cut_failure: res.data[3]
        })
      } else if (res.data[3] == '') {
        that.data.none_second = false
      }
    })
  },


  bindchange(e) {
    var that = this
    if (e.detail.current == 0) {
      that.setData({
        currentTab: e.detail.current,
        winHeight: that.data.winHeight_first,
        none: that.data.none_first
      })
    } else if (e.detail.current == 1) {
      if (that.data.none_second == false) {
        that.setData({
          none: false,
          currentTab: e.detail.current,
        })
      } else {
        that.setData({
          none: true,
          currentTab: e.detail.current,
          winHeight: that.data.winHeight_second
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight,
      backgroundColor: app.globalData.selectedColor,
    })
    that.show_cut()
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