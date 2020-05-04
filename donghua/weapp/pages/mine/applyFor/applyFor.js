// pages/mine/applyFor/applyFor.js
import {
  get_applyDistributio,
  send_code
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'

var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    disable:false,
    name: '',
    phone: '',
    phoneCode: '',
    trade: '',
    state: '',
    timer: '',
    countDownNum: '30',
    hid: false
  },

  importName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  importPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  importCode: function(e) {
    this.setData({
      phoneCode: e.detail.value
    })
  },
  importTrade: function(e) {
    this.setData({
      trade: e.detail.value
    })
  },
  importState: function(e) {
    this.setData({
      state: e.detail.value
    })
  },
  //倒计时
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function() {
        countDownNum--;
        that.setData({
          countDownNum: countDownNum
        })
        if (countDownNum == 0) {
          clearInterval(that.data.timer);
          that.setData({
            hid: false,
            countDownNum: 30
          })
        }
      }, 1000)
    })
  },


  //获取验证
  getCode: function() {
    var that = this
    var phone = this.data.phone
    if (phone.length <= 0) {
      wx.showLoading({
        title: '请填写手机号',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 1000)
      return
    }
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(phone))) {
      wx.showLoading({
        title: '手机号不正确',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 1000)
      return
    }
    that.setData({
      hid: true
    })
    this.countDown()
    send_code({
      phone: that.data.phone
    }).then((response) => {
      console.log(response)
    })
  },
  //提交
  submit: function(e) {
    var that = this
    that.setData({
      disable: true,
    })
    console.log(that.data.disable)
    var name = this.data.name
    var phone = this.data.phone
    var phoneCode = this.data.phoneCode
    // var trade = '无'
    var state = this.data.state
    if (name.length <= 0) {
      wx.showLoading({
        title: '请填写姓名',
      })
      setTimeout(function() {
        wx.hideLoading()
        that.setData({
          disable: false
        })
      }, 1000)
      return
    }
    if (phone.length <= 0) {
      wx.showLoading({
        title: '请填写手机号',
      })
      setTimeout(function() {
        wx.hideLoading()
        that.setData({
          disable: false
        })
      }, 1000)
      return
    }
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(phone))) {
      wx.showLoading({
        title: '手机号不正确',
      })
      setTimeout(function() {
        wx.hideLoading()
        that.setData({
          disable: false
        })
      }, 1000)
      return
    }
    if (phoneCode.length <= 0) {
      wx.showLoading({
        title: '请填写验证码',
      })
      setTimeout(function() {
        wx.hideLoading()
        that.setData({
          disable: false
        })
      }, 1000)
      return
    }
    // if (trade.length <= 0) {
    //   wx.showLoading({
    //     title: '请填写行业',
    //   })
    //   setTimeout(function() {
    //     wx.hideLoading()
    //   }, 1000)
    //   return
    // }
    if (state.length <= 0) {
      that.setData({
        state: '无'
      })
    }
    get_applyDistributio({
      shop_id: app.globalData.shop_id,
      sale_name: that.data.name,
      phone: that.data.phone,
      code: that.data.phoneCode,
      industry: '无',
      u: '',
      instruction: that.data.state,
      user_id: store.get('user_id')
    }).then((response) => {
      console.log(response)
      wx.showLoading({
        title: response.msg,
        mask: true
      })
      setTimeout(function() {
        that.setData({
          disable: false
        })
        wx.hideLoading()
          if (response.data.verify_status == 1) {
            wx.redirectTo({
              url: '../distribution/distribution'
            })
          } else {
            wx.redirectTo({
              url: '../applyForResult/applyForResult',
            })
          }
      }, 1000)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      backgroundColor: app.globalData.selectedColor,
    })
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