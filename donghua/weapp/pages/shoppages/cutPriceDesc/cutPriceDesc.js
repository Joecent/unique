// pages/shoppages/cutPriceDesc/cutPriceDesc.js

import {
  goods_info,
  cut,
  self_cut,
  help_people
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
//const WxParse = require('../../../wxParse/wxParse.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: '',
    shop_id: '',
    goods: [],
    goods_image: [],
    time: '',
    endTime: '',
  },

  show_goods_info(goods_id, shop_id) {
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)
    var that = this
    var goods_image_pre = []
    that.data.shop_id = shop_id
    that.data.goods_id = goods_id
    store.set('shop_id', shop_id)
    goods_info({
      goods_id: goods_id,
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id
    }).then((res) => {
         
      if (res.error_code == 1000) {
        if (res.data[0].goods_desc == '') {
          res.data[0].goods_desc = '暂无'
        }
        // WxParse.wxParse('article', 'html', res.data[0].goods_desc, that, 5)
        goods_image_pre.push(res.data[0].goods_img)
        if (res.data[0].img_url != '') {
          for (var i = 0; i < res.data[0].img_url.length; i++) {
            goods_image_pre.push(res.data[0].img_url[i])
          }
        }
        that.setData({
          goods: res.data[0],
          is_group: res.data[0].is_group,
          goods_image: goods_image_pre
        })
        wx.hideLoading()
      } else {
        wx.showLoading({
          title: '参数错误',
        })
      }
    })
  },
  // reset() {
  //   this.setData({
  //     bar: app.globalData.barHeight,
  //     barHeight: app.globalData.barHeight + 45
  //   })
  // },

  toHelpCut(e) {
    //console.log(e, "12")
    var that = this
    cut({
      openid: store.get('openid'),
      goods_id: this.data.goods_id
    }).then((res) => {
      if (e.currentTarget.dataset.goods_score < 1) {
        wx.showLoading({
          title: '库存不足',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      } else {

        self_cut({
          openid: store.get('openid'),
          self_id: res.data.self_id
        })

        wx.navigateTo({
          url: '/pages/shoppages/helpCut/helpCut?goods_id=' + this.data.goods_id + '&shop_id=' + this.data.shop_id + '&self_id=' + res.data.self_id
        })
      }
    })
  },


  // 倒计时

  getTimes() {
    let that = this
    let endTimeString = this.data.endTime.replace(/-/g, '/')
    let endTime = new Date(endTimeString).getTime() 
    ! function fn() {
      let nowTime = new Date().getTime()
      let t = endTime - nowTime
      if (t > 0) {
        let h = formatTime(Math.floor(t / 1000 / 60 / 60 % 24))
        let m = formatTime(Math.floor(t / 1000 / 60 % 60))
        let s = formatTime(Math.floor(t / 1000 % 60))
        // console.log(s,"xiaocxi")
        that.setData({
          // time: h + ':' + m + ':' + s,
          h: h,
          m: m,
          s: s
        })
        setTimeout(fn, 1000)
      }
    }();

    function formatTime(t) {
      return t < 10 ? '0' + t : t
    }
  },

  showInfo() {
    help_people({
      self_id: store.get('self_id')
    }).then((res) => {
      //console.log(res,"砍价")
      if (res.error_code == '1000') {
        let arr = []
        for (let i = 0; i < 3; i++) {
          res.data.help[i] && arr.push(res.data.help[i])
        }
        this.setData({
          goodsInfo: {
            goods_img: res.data.goods_img,
            goods_price: res.data.goods_price,
            final_money: res.data.final_money,
            now_money: res.data.now_money,
            goods_name: res.data.goods_name,
            goods_p_num: res.data.goods_num,
            cuted_price: (res.data.goods_price - res.data.now_money).toFixed(2),
            surplus: (res.data.now_money - res.data.final_money).toFixed(2)
          },
          helpList: arr,
          list: res.data.help,
          endTime: res.data.cut_time
        })
        this.getTimes()
      }
    })
  },


  show_home() {
    wx.redirectTo({
      url: '/pages/shoppages/index/index',
    })
  },
  cart() {
    wx.redirectTo({
      url: '/pages/mine/cart/cart',
    })
  
  },

  mineGrey() {
    wx.redirectTo({
      url: '/pages/mine/mine',
    })
   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,"oooooooooooo")
    this.setData({
        backgroundColor: app.globalData.selectedColor,
      bar: app.globalData.barHeight,
      // barHeight: app.globalData.barHeight + 45,
      get_price: options.get_price,
      goods_price: options.goods_price
    })
    this.show_goods_info(options.goods_id, options.shop_id)
    this.data.goods_id = options.goods_id
    //this.showInfo()
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