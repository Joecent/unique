// pages/mine/appointment/appointment.js
import {
  wait_pay,
  wait,
  receive,
  finish,
  pay,
  cancel,
  confirm_receive,
  order_pay,
  already_experience,
  wait_experience,

} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    moreHandel: true,
    winHeight: 0,
    notpaylist: [],
    notreceivelist: [],
    order_num: 0,
    notpostlist: [],
  },

  // topay(e) {
  //   var that = this
  //   order_pay({
  //     shop_id: e.currentTarget.dataset.shop_id,
  //     user_id: app.globalData.userid,
  //     order_sn: e.currentTarget.dataset.order_sn
  //   }).then((res) => {
  //     wx.requestPayment({
  //       appId: res.appId,
  //       timeStamp: res.timeStamp,
  //       nonceStr: res.nonceStr,
  //       package: res.package,
  //       signType: res.signType,
  //       paySign: res.paySign,
  //       success: function () {
  //         that.notpay()
  //       },
  //       fail: function (res) {
  //         wx.showLoading({
  //           title: '付款失败',
  //         })
  //         setTimeout(function () {
  //           wx.hideLoading()
  //         }, 1000)
  //       }
  //     })
  //   })
  // },

  // discard(e) {
  //   var that = this
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否确认取消？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         cancel({
  //           order_id: e.currentTarget.dataset.order_id,
  //           user_id: app.globalData.userid,
  //           reason: ''
  //         }).then((res) => {
  //           wx.showLoading({
  //             title: '取消成功',
  //           })
  //           setTimeout(function () {
  //             wx.hideLoading()
  //             that.notpay()
  //           }, 500)
  //         })
  //       }
  //     },
  //   })
  // },

  swichNav(e) {
    var that = this
    if (that.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },



  /**
   * 可用
   */

  notpost() {
    var that = this
    wait_experience({
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id
    }).then((res) => {
      console.log(res, "555555r")
      if (res.error_code == 1000) {
        var notpostlist_pre = res.data
        that.setData({
          winHeight: res.data.length * 300,
          order_num: res.data.length,
          notpostlist: notpostlist_pre
        })
      }
    })
  },

  /**
   * 不可用
   */
  finish() {
    var that = this
    already_experience({
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id
    }).then((res) => {
      if (res.error_code == 1000) {
        var finishlist_pre = res.data
        that.setData({
          finishlist: finishlist_pre,
          winHeight: res.data.length * 300,
          order_num: res.data.length
        })
      } else {
        that.setData({
          winHeight: res.data.length * 300,
          order_num: res.data.length
        })
      }
    })
  },



  toexpress(e) {
    var that = this
    wx.navigateTo({
      url: '/pages/mine/express/express?order_id=' + e.currentTarget.dataset.order_id,
    })
  },


  // comfirm_get(e) {
  //   var that = this
  //   wx.showModal({
  //     title: '确认收货',
  //     content: '收货后商家将收到款项，是否确认？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         confirm_receive({
  //           order_id: e.currentTarget.dataset.order_id
  //         }).then((res) => {
  //           if (res.error_code == 1000) {
  //             that.show()
  //           } else {
  //             wx.showLoading({
  //               title: '确认收货失败',
  //             })
  //             setTimeout(function () {
  //               wx.hideLoading()
  //             }, 500)
  //           }
  //         })
  //       }
  //     }
  //   })
  // },


  bindChange(e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    })
    that.show()
  },
  showmore(e) {
    var that = this
    that.setData({
      moreHandel: e.currentTarget.dataset.id
    })
  },


  show() {
    var that = this
    if (that.data.currentTab == 0) {
      that.notpost()
    } else if (that.data.currentTab == 1) {
      that.finish()
    }
  },


  // orderInfo(e) {
  //   var that = this
  //   if (e.currentTarget.dataset.order_status == 'notpost') {
  //     wx.setStorage({
  //       key: 'orderinfo',
  //       data: {
  //         order_status: e.currentTarget.dataset.order_status,
  //         order: that.data.notpaylist[e.currentTarget.dataset.index]
  //       }
  //     })
  //   } else if (e.currentTarget.dataset.order_status == 'finish') {
  //     wx.setStorage({
  //       key: 'orderinfo',
  //       data: {
  //         order_status: e.currentTarget.dataset.order_status,
  //         order: that.data.finishlist[e.currentTarget.dataset.index]
  //       }
  //     })
  //   }
  //   // wx.navigateTo({
  //   //   url: '/pages/mine/orderinfo/orderinfo',
  //   // })
  // },

  refund(e) {
    wx.navigateTo({
      url: '/pages/mine/refundapply/refundapply?order_id=' + e.currentTarget.dataset.order_id + '&order_money=' + e.currentTarget.dataset.order_money,
    })
  },

  // 劵
  touse(e) {
    //store.set('coupon', e.currentTarget.dataset.coupon)
    wx.navigateTo({
      url: '/pages/mine/couponCode/couponCode?barcode=' + e.currentTarget.dataset.barcode,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight,
      backgroundColor: app.globalData.selectedColor,
      //currentTab: options.bindid
    })
    that.show(),
    that.notpost()
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
    // var that = this
    // that.show()
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