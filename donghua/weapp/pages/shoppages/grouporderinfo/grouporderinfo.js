// pages/shoppages/grouporderinfo/grouporderinfo.js

import {
  goods_info,
  get_default,
  pay,
  my_cash,
  new_order,
  cut_order
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage: false,
    message: '',
    goods: [],
    disable: false,
    goods_id: '',
    order_type: '',
    count: 1,
    editaddress: '',
    goods: '',
    order_sn: '',
    discount: 0.00,
    express_fee: 0.00,
    cash_num: 0,
    coupon: '',
    coupon_id: '',
    totalPrice: 0,
    totalMoney: 0
  },

  editaddress() {
    var that = this
    if (that.editaddress == '') {
      get_default({
        user_id: app.globalData.userid
      }).then((res) => {
        if(res.error_code==1000){
          that.setData({
            editaddress:res.data
          })
        }
      })
    }
  },

  tocoupons() {
    var that = this
    wx.navigateTo({
      url: '/pages/mine/couponUse/couponUse?goods_id=' + that.data.goods_id + '&order_type=0'
    })
  },


  show_coupons(id) {
    var that = this
    that.data.goods_id = id
    my_cash({
      user_id: app.globalData.userid,
      shop_id: app.globalData.shop_id,
      goods_id: id,
      order_group_type: 0
    }).then((res) => {
      if (res.error_code == 1002) {
        that.setData({
          cash_num: 0
        })
      } else if (res.error_code == 1000) {
        that.setData({
          cash_num: res.data.length
        })
      }
    })
  },

  input_message(e) {
    var that = this
    that.data.message = e.detail.value
  },
  bindmodifyaddress() {
    wx.navigateTo({
      url: '/pages/mine/address/address',
    })
  },


  totalPrice: function() {
    var that = this;
    var total_price = 0;
    for (var i = 0; i < that.data.goods.length; i++) {
      total_price = parseFloat(that.data.goods.goods_price)
    }
    that.setData({
      totalPrice: total_price.toFixed(2),
      totalMoney: total_price.toFixed(2)
    });
  },


  formSubmit(e) {
    var that = this
    var order_goods = []
    var item = that.data.goods
    order_goods.push({
      "goods_id": item.goods_id,
      "goods_num": 1,
      "goods_cost": parseFloat(item.goods_price),
      "product_id": item.product_id,
      "user_id": store.get('user_id'),
      "key_name": item.key_name
    })
    that.setData({
      disable: true
    })
    if (that.data.editaddress != '') {
      new_order({
        order_group_type: 1,
        group_sn: item.group_sn,
        pay_sum: 1,
        goods: order_goods,
        message: that.data.message,
        address_id: that.data.editaddress.id,
        user_id: app.globalData.userid,
        shop_id: app.globalData.shop_id,
        cash_id: that.data.coupon_id,
        order_type: 0,
        
        buyer: that.data.editaddress.receiver,
        address: that.data.editaddress.address + that.data.editaddress.detail,
        phone: that.data.editaddress.phone
        
      }).then((res) => {
        if (res.error_code == 1000) {
          that.setData({
            order_sn: res.data.order_sn
          })
          that.order_pay()
        } else if (res.error_code == 1004) {
          wx.showLoading({
            title: '库存不足',
          })
          setTimeout(function() {
            wx.hideLoading()
            that.setData({
              disable: false
            })
          }, 1000)
        } else {
          wx.showLoading({
            title: res.msg,
          })
          setTimeout(function() {
            wx.hideLoading()
            that.setData({
              disable: false
            })
          }, 1000)
        }
      })
    } else {
      wx.showLoading({
        title: '请填写收货地址',
      })
      setTimeout(function() {
        wx.hideLoading()
        that.setData({
          disable: false
        })
      }, 1000)
    }

  },

  order_pay() {
    var that = this
    pay({
      shop_id: that.data.goods.shop_id,
      user_id: app.globalData.userid,
      order_sn: that.data.order_sn
    }).then((res) => {
      wx.requestPayment({
        appId: res.appId,
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: function() {
          wx.navigateTo({
            url: '/pages/shoppages/groupOrder/groupOrder?order_sn=' + that.data.order_sn+'&group_num='+that.data.goods.group_num,
          })
        },
        fail: function(res) {
          wx.showLoading({
            title: '添加至待付款',
          })
          setTimeout(function() {
            wx.hideLoading()
            that.setData({
              disable: false
            })
          }, 1000)
        }
      })

    })
  },

  
  tomessage() {
    var that = this
    that.setData({
      showMessage: true
    })
  },
  hide() {
    var that = this
    that.setData({
      showMessage: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    store.set('coupon', '')
    that.setData({
        backgroundColor: app.globalData.selectedColor,
      bar: app.globalData.barHeight
    })
    wx.getStorage({
      key: 'editaddress',
      success: function(res) {
        if (res != '') {
          that.setData({
            editaddress: res.data
          })
        }
      },
    })
    
    
    wx.getStorage({
      key: 'grouporderinfo',
      success: function(res) {
        that.setData({
          goods: res.data,
          totalPrice: res.data.goods_price,
          totalMoney: res.data.goods_price
        })
        //that.totalPrice()
      },
    })
    //that.goods_id = options.goods_id
    //that.goods_info(options.goods_id,options.shop_id)
    //that.show_coupons(options.goods_id)

    that.editaddress()
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
    let that = this
    wx.getStorage({
      key: 'editaddress',
      success: function(res) {
        if (res != '') {
          that.setData({
            editaddress: res.data
          })
        }
      },
    })
    that.data.coupon = store.get('coupon')
    if (that.data.coupon != '') {
      if (that.data.coupon.cash_type == 1) {
        that.setData({
          discount: that.data.totalPrice * (10 - that.data.coupon.cash_money) / 10,
          totalMoney: that.data.totalPrice * that.data.coupon.cash_money / 10,
          coupon_id: that.data.coupon.cash_id
        })
      } else if (that.data.coupon.cash_type == 0) {
        that.setData({
          discount: that.data.coupon.cash_money,
          totalMoney: that.data.totalPrice - that.data.coupon.cash_money,
          coupon_id: that.data.coupon.cash_id
        })
      }
    }
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