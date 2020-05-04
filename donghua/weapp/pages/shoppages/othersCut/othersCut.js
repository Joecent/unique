import {
  auth,
  help_cut,
  help_people
} from '../../../utils/api.js';
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
    topUserInfo: {
      avtar: '',
      userName: ''
    },
    openid: '',
    self_id: '',
    goods_id: '',
    showModalFlag: false,
    goodsInfo: {
      goods_img: '',
      goods_price: '',
      final_money: '',
      now_money: '',
      goods_name: '',
      goods_p_num: '',
      cuted_price: '',
      surplus: ''
    },
    helpList: [],
    time: '',
    endTime: '',
    list: [],
    cut_money: '',
    helpCut: false,
    ungetInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  reset() {
    this.setData({
      bar: app.globalData.barHeight,
      barHeight: app.globalData.barHeight + 45
    })
  },


  showModel() {
    var that = this
    if (app.globalData.userid && app.globalData.userid != 0) { 
    that.setData({
      helpCut: true
    })
    help_cut({
      openid: store.get('openid'),
      self_id: that.data.self_id,
      goods_id: that.data.goods_id
    }).then((res) => {
      if (res.error_code == '1000') {
        that.setData({
          showModalFlag: true,
          cut_money: res.data.cut_money,
          helpCut: false
        })
        this.showInfo();
        this.getUserInfo()
        this.reset();
      }
      if (res.error_code == '1001') {
        wx.showLoading({
          title: '你已经砍过价了',
        })
        setTimeout(function() {
          wx.hideLoading()
          that.setData({
            helpCut: false
          })
        }, 2000)
      }
    })
    }else{
      that.setData({
        ungetInfo:true
      })
    }
  },
  hideModal() {
    this.setData({
      showModalFlag: false
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

  showInfo() {
    help_people({
      self_id: this.data.self_id
    }).then((res) => {
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
          endTime: res.data.cut_time,
          topUserInfo: {
            avtar: res.data.help[res.data.help.length-1].photo,
            userName: res.data.help[res.data.help.length-1].nickname,
          }
        })
        this.getTimes()
      }
    })
  },

  toIndexPage() {
    wx.navigateTo({
      url: '/pages/shoppages/index/index'
    })
  },
  back() {
    wx.navigateTo({
      url: "/pages/shoppages/shopcut/shopcut"
    })
  },

  //授权函数
  bindGetUserInfo: function(e) {
    var that = this
    // 可以将 res 发送给后台解码出 unionId
    app.globalData.userInfo = e.detail.userInfo
    auth({
      shop_id:app.globalData.shop_id,
      code: app.globalData.code,
      name: e.detail.userInfo.nickName,
      photo: e.detail.userInfo.avatarUrl,
      sex: e.detail.userInfo.gender
    }).then((response) => {
      if (response.error_code == 1000) {
        app.globalData.userid = response.data.user_id
        store.set('openid', response.data.openid)
        store.set('user_id', response.data.user_id)
      }
    }).then(function() {
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback(app.globalData.userid, app.globalData.ungetInfo)
      }
    }).then(function() {
      app.globalData.ungetInfo = false
      that.setData({
        ungetInfo: false
      })
    })
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
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

  
  showMore() {
    let arr = this.data.helpList
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
  onLoad: function(options) {
    this.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    this.reset()
    this.getUserInfo()
    this.data.openid = options.openid,
    this.data.self_id = options.self_id,
    this.data.goods_id = options.goods_id,
    this.showInfo()
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