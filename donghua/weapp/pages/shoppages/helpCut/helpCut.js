import {
  help_people
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avtar: '',
      userName: '',
      openid: '',
      userid: ''
    },
    goods_id: '',
    goodsInfo: {
      goods_img: '',
      goods_price: '',
      final_money: '',
      now_money: '',
      goods_desc: '',
      goods_p_num: '',
      cuted_price: '',
      surplus: ''
    },
    helpList: [],
    time: '',
    endTime: '',
    list: [],
    self_id:''
  },
  reset() {
    this.setData({
      bar: app.globalData.barHeight,
      barHeight: app.globalData.barHeight + 45
    })
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  getUserInfo() {
    this.setData({
      userInfo: {
        avtar: app.globalData.userInfo.avatarUrl,
        userid: app.globalData.userid,
        userName: app.globalData.userInfo.nickName
      }
    })
  },


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
        that.setData({
          time: h + ':' + m + ':' + s
        })
        setTimeout(fn, 1000)
      }
    }();

    function formatTime(t) {
      return t < 10 ? '0' + t : t
    }
  },
  
  showInfo(goods_id,self_id) {
     var that = this
    help_people({
      self_id: self_id,
      goods_id: that.data.goods_id
    }).then((res) => {
     // console.log(res, "砍价")
      if (res.error_code == '1000') {
        let arr = []
        for (let i = 0; i < 3; i++) {
          res.data.help[i] && arr.push(res.data.help[i])
        }
        that.setData({
          goodsInfo: {
            goods_id:res.data.goods_id,
            goods_img: res.data.goods_img,
            goods_price: res.data.goods_price, //2.00
            final_money: res.data.final_money,
            now_money: res.data.now_money,
            goods_name: res.data.goods_name,
            goods_p_num: res.data.goods_num,
            now_money: res.data.now_money,
            cuted_price: (res.data.goods_price - res.data.now_money).toFixed(2),  //已砍价钱
            surplus: (res.data.now_money - res.data.final_money).toFixed(2)  //0.98
          },
          helpList: arr,
          list: res.data.help,
          endTime: res.data.cut_time
        })
        that.getTimes()
      }
    })
  },
  showMore() {
    let arr = this.data.helpList
    //console.log(arr, "砍价")
    for (let i = 3; i < this.data.list.length; i++) {
      this.data.list[i] && arr.push(this.data.list[i])
    }
    this.setData({
      helpList: arr
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    that.data.goods_id = options.goods_id
    that.reset()
    that.getUserInfo()
    that.showInfo(options.goods_id,options.self_id)
    that.data.sef_id = options.self_id
    that.setData({
      backgroundColor: app.globalData.selectedColor,
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
  onShareAppMessage: function (res) {
    var that = this
    return {
      title:'我发现一件好货，帮帮我超低价拿！',
      path: '/pages/shoppages/othersCut/othersCut?openid=' + store.get('openid') + '&self_id=' + that.data.sef_id + '&goods_id=' + that.data.goods_id,
      success: (res) => {
      },
      fail: (res) => {

      }
    }
  }
})