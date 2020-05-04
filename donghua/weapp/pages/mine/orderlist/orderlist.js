// pages/mine/orderlist/orderlist.js

import {
  wait_pay,
  wait,
  receive,
  finish,
  pay,
  cancel,
  confirm_receive,
  some_one_order
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
    somenotpay:[],
    goods_id:''
  },

  topay(e) {
    console.log(e)
    var that = this
    pay({
      shop_id: e.currentTarget.dataset.shop_id,
      user_id: app.globalData.userid,
      order_sn: e.currentTarget.dataset.order_sn
    }).then((res) => {
      wx.requestPayment({
        appId: res.appId,
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: function() {
          //that.some_one_order()
          that.notpay()
        },
        fail: function(res) {
          wx.showLoading({
            title: '付款失败',
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)
        }
      })
    })
  },

  discard(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认取消？',
      success: function(res) {
        if (res.confirm) {
          cancel({
            order_id: e.currentTarget.dataset.order_id,
            user_id: app.globalData.userid,
            reason: ''
          }).then((res) => {
            wx.showLoading({
              title: '取消成功',
            })
            setTimeout(function() {
              wx.hideLoading()
              //that.some_one_order()
              that.notpay()
            }, 500)
          })
        }
      },
    })
  },

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
  toEvaluate(){
    wx.navigateTo({
      url: '/pages/mine/evaluate/evaluate',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  
  // some_one_order(){
  //   var that = this
  //   some_one_order({
  //     user_id: store.get('user_id'),
  //     shop_id:app.globalData.shop_id,
  //     order_type: 1
  //   }).then((res) =>{
  //     console.log(res,"全部订单")
  //     if(res.error_code == 1000){
  //       var notpays = res.data
  //       that.setData({
  //         somenotpay: notpays,
  //         winHeight: res.data.length * 350,
  //         order_num: res.data.length,
  //       })
  //     } else if (res.error_code == 1001) {
  //       that.setData({
  //         order_num: 0,
  //         winHeight: res.data.length * 500,
  //       })
  //     }
  //   })
  // },

   

  /**
   * 待付款方法
   */
  notpay() {
    var that = this
    wait_pay({
      user_id: store.get('user_id')
    }).then((res) => {
      console.log(res, "待付款")
      if (res.error_code == 1000) {
        var notpaylist_pre = res.data
        notpaylist_pre.forEach(function (item) {
          item.goods_number = item.goodscost.length
        })

        notpaylist_pre.sort(that.compare("order_id"));
        
        that.setData({
          notpaylist: notpaylist_pre,
          winHeight: notpaylist_pre.length * 550,
          order_num: notpaylist_pre.length
        })
      } else if (res.error_code == 1001) {
        that.setData({
          order_num: 0,
          winHeight: res.data.length * 500,
        })
      }
    })
  },

  // 判断数组 从大到小排
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },

  /**
   * 待发货方法
   */
  notpost() {
    var that = this
    wait({
      user_id: store.get('user_id')
    }).then((res) => {
      console.log(res,"待发货")
      if (res.error_code == 1000) {
        var notpostlist_pre = res.data
        notpostlist_pre.forEach(function(item) {
          item.goods_number = item.goodscost.length
        })
        //notpostlist_pre.goods_number=res.data.goodscost.length
        that.setData({
          winHeight: res.data.length * 500,
          order_num: res.data.length,
          notpostlist: notpostlist_pre
        })
      }else if (res.error_code == 1001) {
        that.setData({
          order_num: 0,
          winHeight: res.data.length * 400,
        })
      }
    })
  },

  /**
   * 待收货方法
   */
  notreceive() {
    var that = this
    receive({
      user_id: store.get('user_id')
    }).then((res) => {
      if (res.error_code == 1000) {
        var notreceive_pre = res.data
        notreceive_pre.forEach(function(item) {
          item.goods_number = item.goodscost.length
        })
        that.setData({
          notreceivelist: notreceive_pre,
          winHeight: res.data.length * 500,
          order_num: res.data.length
        })
      } else if (res.error_code == 1001) {
        that.setData({
          order_num: 0,
          winHeight: res.data.length * 500,
        })
      }
    })
  },

  /**
   * 已完成方法
   */
  finish() {
    var that = this
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       winHeight: res.windowHeight
    //     });
    //   }
    // });
    finish({
      user_id: store.get('user_id')
    }).then((res) => {
      if (res.error_code == 1000) {
        var finishlist_pre = res.data
        finishlist_pre.forEach(function(item) {
          item.goods_number = item.goodscost.length
        })
        that.setData({
          finishlist: finishlist_pre,
          winHeight: res.data.length * 500,
          order_num: res.data.length
        })
      } else if (res.error_code == 1001) {
        that.setData({
          order_num: 0,
          winHeight: res.data.length * 500,
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

  purchase(e) {
    wx.navigateTo({
      url: '/pages/shoppages/goods/goods?goods_id=' + e.currentTarget.dataset.goods_id
    })
  },


  comfirm_get(e) {
    var that = this
    wx.showModal({
      title: '确认收货',
      content: '收货后商家将收到款项，是否确认？',
      success: function(res) {
        if (res.confirm) {
          confirm_receive({
            order_id: e.currentTarget.dataset.order_id,
            shop_id: app.globalData.shop_id,
            user_id: app.globalData.userid
          }).then((res) => {
            if (res.error_code == 1000) {
              that.show()
            } else {
              wx.showLoading({
                title: '确认收货失败',
              })
              setTimeout(function() {
                wx.hideLoading()
              }, 500)
            }
          })
        }
      }
    })
  },



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
      that.notpay()   
    } else if (that.data.currentTab == 1) {
      that.notpost()
    } else if (that.data.currentTab == 2) {
      that.notreceive()
    } else if (that.data.currentTab == 3) {
      that.finish()
    }
  },


  orderInfo(e) {
    var that = this
    // if (e.currentTarget.dataset.order_status == 'some_one_order'){
    //   wx.setStorage({
    //     key: 'orderinfo',
    //     data: {
    //       order_status: e.currentTarget.dataset.order_status,
    //       order: that.data.somenotpay[e.currentTarget.dataset.index]
    //     }
    //   })
    //  }
    // else 
    if (e.currentTarget.dataset.order_status == 'notpay') {
      wx.setStorage({
        key: 'orderinfo',
        data: {
          order_status: e.currentTarget.dataset.order_status,
          order: that.data.notpaylist[e.currentTarget.dataset.index]
        }
      })
    } else if (e.currentTarget.dataset.order_status == 'notreceive') {
      wx.setStorage({
        key: 'orderinfo',
        data: {
          order_status: e.currentTarget.dataset.order_status,
          order: that.data.notreceivelist[e.currentTarget.dataset.index]
        }
      })
    } else if (e.currentTarget.dataset.order_status == 'notpost') {
      wx.setStorage({
        key: 'orderinfo',
        data: {
          order_status: e.currentTarget.dataset.order_status,
          order: that.data.notpostlist[e.currentTarget.dataset.index]
        }
      })
    } else if (e.currentTarget.dataset.order_status == 'finish') {
      wx.setStorage({
        key: 'orderinfo',
        data: {
          order_status: e.currentTarget.dataset.order_status,
          order: that.data.finishlist[e.currentTarget.dataset.index]
        }
      })
    }
    wx.navigateTo({
      url: '/pages/mine/orderinfo/orderinfo',
    })
  },
  
  refund(e) {
    wx.navigateTo({
      url: '/pages/mine/refundapply/refundapply?order_id=' + e.currentTarget.dataset.order_id + '&order_money=' + e.currentTarget.dataset.order_money,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight,
      currentTab: options.bindid,
      backgroundColor: app.globalData.selectedColor,
    })
    that.show()
   // that.some_one_order()
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