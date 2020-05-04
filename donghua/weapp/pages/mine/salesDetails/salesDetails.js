// pages/mine/salesDetails/salesDetails.js

import {
  get_income,
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extraHid:true,
    oneSelect: true,
    twoSelect: true,
    allList: [],
    pageindex: 1
  },
  showStratum: function (e) {
    var that = this;
    that.setData({
      display: "block",
      extra: e.currentTarget.dataset.user.extra
    })
  },
  hideview: function () {
    this.setData({
      display: "none"
    })
  },
  //显示隐藏收入
  showIncome: function() {
    this.setData({
      pageindex:1
    })
    if (this.data.oneSelect) {
      this.setData({
        oneSelect: false,
      })
    } else {
      this.setData({
        oneSelect: true,
      })
    }
    this.hidAll()
    this.getDistributionData()
  },
  //显示隐藏提现
  showWithdraw: function() {
    this.setData({
      pageindex: 1
    })
    if (this.data.twoSelect) {
      this.setData({
        twoSelect: false,
      })
    } else {
      this.setData({
        twoSelect: true,
      })
    }
    this.hidAll()
    this.getDistributionData()
  },
  //全部隐藏
  hidAll: function() {
    if (this.data.oneSelect || this.data.twoSelect) {
      this.setData({
        allHid: false
      })
    } else {
      this.setData({
        allHid: true
      })
    }
  },
  //获取列表
  getDistributionData: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var oneSelect = that.data.oneSelect
    var twoSelect = that.data.twoSelect
    var condition = ''
    if (!oneSelect || !twoSelect) {
      if (!oneSelect) {
        condition = '1'
      } else if (!twoSelect) {
        condition = '2'
      }
    } 
    // console.log(condition)
    get_income({
      user_id: store.get('user_id'),
      status: condition,
      page: that.data.pageindex,
      limit: 12
    }).then((response) => {
      this.setData({
        allList: response.detail,
        pageCount: response.totalPage
      })
      
      wx.hideLoading()
      wx.stopPullDownRefresh()

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    // wx.setNavigationBarColor({
    //   frontColor: this.data.fontColor,
    //   backgroundColor: this.data.backgroundColor,
    //   animation: {
    //     duration: 400,
    //     timingFunc: 'easeIn'
    //   }
    // })
    this.getDistributionData()

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
    this.setData({ pageindex: 1})
    this.getDistributionData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // 当前页+1
    var pageindex = that.data.pageindex
    if (pageindex < that.data.pageCount) {
      pageindex = that.data.pageindex + 1;
      that.setData({
        pageindex: pageindex,
      })
      wx.showLoading({
        title: '加载中',
      })
      var that = this
      var oneSelect = that.data.oneSelect
      var twoSelect = that.data.twoSelect
      var condition = ''
      if (!oneSelect || !twoSelect) {
        if (!oneSelect) {
          condition = '1'
        } else if (!twoSelect) {
          condition = '2'
        }
      }
      console.log(condition)
      get_income({
        user_id: store.get('user_id'),
        status: condition,
        page: that.data.pageindex,
        limit: 12
      }).then((response) => {
        var newList = response.detail
        var allList = that.data.allList
        for (var i = 0; i < newList.length; i++) {
          allList.push(newList[i])
        }
        this.setData({
          allList: allList
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()

      })

    }else{
      wx.showToast({
        title: '已经没有更多了',
        icon: 'none',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


})