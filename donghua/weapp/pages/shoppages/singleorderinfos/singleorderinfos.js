// pages/shoppages/singleorderinfos/singleorderinfos.js
import {
  goods_info,
  get_address,
  pay,
  my_cash,
  new_order,
  cut_order,
  print_pro,
  service_order,
  order_pay
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
    //count: 1,
    editaddress: '',
    //goods: '',
    order_sn: '',
    discount: 0.00,
    express_fee: 0.00,
    cash_num: 0,
    coupon: '',
    coupon_id: '',
    totalPrice: 0,
    totalMoney: 0
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

  input_message(e) {

    var that = this
    that.data.message = e.detail.value
  },

  editaddress() {
    var that = this
    if (that.editaddress == '') {
      get_address({
        user_id: app.globalData.userid
      }).then((res) => {
        res.data.forEach(function (item) {
          if (item.status == 1) {
            that.setData({
              editaddress: item
            })
          }
        })
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

  bindmodifyaddress() {
    wx.navigateTo({
      url: '/pages/mine/address/address',
    })
  },

  totalPrice: function () {
    var that = this;
    var total_price = 0;
    for (var i = 0; i < that.data.goods.length; i++) {
      total_price += that.data.goods[i].count * parseFloat(that.data.goods[i].price)
    }
    that.setData({
      totalPrice: total_price.toFixed(2),
      totalMoney: total_price.toFixed(2)
    });
  },

  formSubmit(e) {
    console.log(e)
     //console.log(e,"8888888")
    var that = this
    that.setData({
      message: e.detail.value.message
      })
    var order_goods = []
    var flag = true
    if (e.detail.value.service_name == '') {
      wx.showLoading({
        title: '请填写姓名',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else if (e.detail.value.service_phone == '') {
      wx.showLoading({
        title: '请填写手机号',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(e.detail.value.service_phone))) {
      wx.showLoading({
        title: '手机号不正确',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else {
      flag = false
    }
    if (flag == false) {
      for (var i = 0; i < this.data.goods.length; i++) {
        var item = this.data.goods[i]
        order_goods.push({
          "goods_id": item.goods_id,
          "goods_num": item.num,
          "goods_cost": parseFloat(item.price),
          "product_id": item.product_id,
          "user_id": store.get('user_id'),
          "key_name": item.key_name,
          "service_name": item.service_name,
          "member_price": item.member_price,
          "goods_name": item.goods_name,
        })
      }
      that.setData({
        disable: true,
      })

      service_order({
        order_group_type: 0, 
        goods: order_goods,
        message: that.data.message,
        address_id: that.data.editaddress.id,
        user_id: app.globalData.userid,
        shop_id: app.globalData.shop_id,
        cash_id: that.data.coupon_id,
        order_type: 1,
        goods_name: that.data.goods[0].name,
        goods_id: that.data.goods[0].goods_id,
        goods_num: that.data.goods[0].count,
        goods_cost: that.data.totalMoney,
        product_id: that.data.goods[0].product_id,
        service_name: e.detail.value.service_name,
        service_time: e.detail.value.dates + " " + e.detail.value.times,
        service_num: 1,
        service_phone: e.detail.value.service_phone,
      }).then((res) => {
       // console.log(res, "ascfsdvsddsv")
        if (res.error_code == 1000) {
          that.data.order_sn = res.data.order_sn
          that.order_pay()
        } else {
          wx.showLoading({
            title: '参数错误',
          })
          setTimeout(function () {
            wx.hideLoading()
            that.setData({
              disable: false
            })
          }, 2000)
        }
      })
    }
  },

  order_pay() {
    var that = this
    order_pay({
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
        success: function (res) {
          //console.log(res,"1230")
          wx.navigateTo({
            url: '/pages/mine/coupon/coupon?bindid=0',
          })
        },
        fail: function (res) {
          wx.showLoading({
            title: '添加至待付款',
          })
          setTimeout(function () {
            wx.hideLoading()
            that.setData({
              disable: false
            })
          }, 1000)
        }
      })
    })
  },


  //预约时间
  bindDateChange: function (e) {
    console.log(e)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    var goods_info = []
    store.set('coupon', '')
    that.setData({
      bar: app.globalData.barHeight
    })
    wx.getStorage({
      key: 'editaddress',
      success: function (res) {
        if (res != '') {
          that.setData({
            editaddress: res.data
          })
        }
      },
    })
    
    wx.getStorage({
      key: 'singleorderinfo',
      success: function (res) {
        //console.log(res.data, '666')
        that.setData({
          goods: res.data
        })
        res.data.forEach(function (item) {
          goods_info.push({
            product_id: item.product_id,
            count: item.count
          })
        })
        my_cash({
          user_id: app.globalData.userid,
          shop_id: app.globalData.shop_id,
          goods: goods_info
        }).then((response) => {
          if (response.error_code == 1000) {
            that.setData({
              cash_num: res.data.length
            })
          }
        })
        that.totalPrice()
      },
    })

    that.editaddress()

    if (that.data.coupon != '') {
      if (that.data.coupon.cash_type == 1) {
        let total = that.data.totalPrice * that.data.coupon.cash_money / 10
        that.setData({
          discount: that.data.totalPrice * (10 - that.data.coupon.cash_money) / 10,
          totalMoney: total.toFixed(2),
          coupon_id: that.data.coupon.cash_id
        })
      } else if (that.data.coupon.cash_type == 0) {
        let total = that.data.totalPrice - that.data.coupon.cash_money
        that.setData({
          discount: that.data.coupon.cash_money,
          totalMoney: total.toFixed(2),
          coupon_id: that.data.coupon.cash_id
        })
      }
    }
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
    
    var that = this
    var goods_info = []
    store.set('coupon', '')
    that.setData({
      bar: app.globalData.barHeight
    })
    wx.getStorage({
      key: 'editaddress',
      success: function (res) {
        if (res != '') {
          that.setData({
            editaddress: res.data
          })
        }
      },
    })

    wx.getStorage({
      key: 'singleorderinfo',
      success: function (res) {
        console.log(res.data, '666')
        that.setData({
          goods: res.data
        })
        res.data.forEach(function (item) {
          goods_info.push({
            product_id: item.product_id,
            count: item.count
          })
        })
        my_cash({
          user_id: app.globalData.userid,
          shop_id: app.globalData.shop_id,
          goods: goods_info
        }).then((response) => {
          if (response.error_code == 1000) {
            that.setData({
              cash_num: res.data.length
            })
          }
        })
        that.totalPrice()
      },
    })
    that.editaddress()
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