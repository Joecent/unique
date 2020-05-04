// pages/my/evaluate/evaluate.js
//const request = require('../../../utils/request');
import { get_shipping } from '../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/image/mine/star.png',
    selectedSrc: '/image/mine/star_s.png',
    halfSrc: '/image/mine/star.png',
    key: 0,//评分
    order_uuid: ''
  },
  /**
   * 点击右边,半颗星
   */
  // selectLeft: function (e) {
  //   var key = e.currentTarget.dataset.key
  //   if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
  //     //只有一颗星的时候,再次点击,变为0颗
  //     key = 0;
  //   }
  //   console.log("得" + key + "分")
  //   this.setData({
  //     key: key
  //   })
  // },
  /**
   * 点击星星
   */
  selectRight: function (e) {
    var that = this;
    var key = e.currentTarget.dataset.key
    if (that.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    console.log("得" + key + "分")
    that.setData({
      key: key
    })
  },
  /**
   * 点击发布评价
   */
  formSubmit: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (that.data.key == "") {
      warn = "评分不能为0";
    } else {
      flag = false;
    }
    if (flag == true) {
      wx.showLoading({
        title: warn,
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    } else {
      request('book.order.comment', {
        order_uuid: that.data.order_uuid,
        star: that.data.key,
        comment: e.detail.value.comment
      }, function (response) {
        if (response.data.success == true) {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.switchTab({
              url: '/pages/books/index/index'
            })
          }, 1000)
        } else {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      order_uuid: options.uuid,
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