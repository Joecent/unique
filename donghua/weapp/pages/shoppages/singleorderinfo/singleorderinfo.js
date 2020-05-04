// pages/shoppages/singleorderinfo/singleorderinfo.js
import {
  goods_info,
  get_default,
  pay,
  my_cash,
  new_order,
  cut_order,
  print_pro,
  shop_info,
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
    //goods: [],
    disable: false,
    goods_id: '',
    order_type: '',
    //count: 1,
    editaddress: '',
    goods: '',
    order_sn: '',
    discount: 0.00,
    express_fee: 0.00,
    cash_num: 0,
    coupon: '',
    coupon_id: '',
    totalPrice: 0,
    totalMoney: 0,
    shopa:"",
    shop_phone:''
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

  // input_message(e) {
  //   var that = this
  //   that.data.message = e.detail.value
  // },

  //得到默认地址
  get_default_address(){
    var that = this
    get_default({user_id:app.globalData.userid}).then((res)=>{
      if(res.error_code==1000){
        that.setData({
          editaddress: res.data
        })
      }
    })
  },
  tocoupons() {
    var that = this
    wx.navigateTo({
      url: '/pages/mine/couponUse/couponUse?goods_id=' + that.data.goods_id + '&order_type=0'
    })
  },


  // show_coupons(id) {
  //   var that = this
  //   that.data.goods_id = id
  //   my_cash({
  //     user_id: app.globalData.userid,
  //     shop_id: app.globalData.shop_id,
  //     goods_id: id,
  //     order_group_type: 0
  //   }).then((res) => {
  //     if (res.error_code == 1002) {
  //       that.setData({
  //         cash_num: 0
  //       })
  //     } else if (res.error_code == 1000) {
  //       that.setData({
  //         cash_num: res.data.length 
  //       })
  //     }
  //   })
  // },

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
    var that = this
    that.setData({
      message:e.detail.value.message
    })
    if (that.data.goods[0].self_id) {
      if (that.data.editaddress != '') {
        cut_order({
          self_id: that.data.goods[0].self_id,
          goods_id: that.data.goods[0].goods_id,
          address_id: that.data.editaddress.id,
          buyer: that.data.editaddress.receiver,
          address: that.data.editaddress.address + that.data.editaddress.detail,
          phone: that.data.editaddress.phone
        }).then((res) => {
          if (res.error_code == 1000) {
            that.data.order_sn = res.data.order_sn
            that.order_pay()
          } else if (res.error_code == 1004) {
            wx.showLoading({
              title: '库存不足',
            })
            setTimeout(function () {
              wx.hideLoading()
              that.setData({
                disable: false
              })
            }, 1000)
          } else {
            wx.showLoading({
              title: '参数错误',
            })
            setTimeout(function () {
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
        setTimeout(function () {
          wx.hideLoading()
          that.setData({
            disable: false
          })
        }, 1000)
      }
    } else {
      var order_goods = []
      for (var i = 0; i < this.data.goods.length; i++) {
        var item = this.data.goods[i]
        order_goods.push({
          "goods_id": item.goods_id,
          "goods_num": item.count,
          "goods_cost": parseFloat(item.price),
          "product_id": item.product_id,
          "user_id": store.get('user_id'),
          "key_name": item.key_name ? item.key_name : '',
          "goods_name": item.goods_name
        })
      }
      that.setData({
        disable: true
      })
      if (that.data.editaddress != '') {
        new_order({
          order_group_type: 0,
          goods: order_goods,
          message: e.detail.value.message,
          address_id: that.data.editaddress.id,
          user_id: app.globalData.userid,
          shop_id: app.globalData.shop_id,
          cash_id: that.data.coupon_id,
          order_type: 0,
          goods_name: that.data.goods[0].name,
          buyer: that.data.editaddress.receiver,
          address: that.data.editaddress.address + that.data.editaddress.detail,
          phone: that.data.editaddress.phone,
          send_price:0.5
        }).then((res) => {
          if (res.error_code == 1000) {
            that.data.order_sn = res.data.order_sn
            that.order_pay()
          } else if (res.error_code == 1004) {
            wx.showLoading({
              title: '库存不足',
            })
            setTimeout(function () {
              wx.hideLoading()
              that.setData({
                disable: false
              })
            }, 1000)
          } else {
            wx.showLoading({
              title: '参数错误',
            })
            setTimeout(function () {
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
        setTimeout(function () {
          wx.hideLoading()
          that.setData({
            disable: false
          })
        }, 1000)
      }
    }
  },

  order_pay(e) {
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
        success: function () {
          var goods_pre = []
          for (var i = 0; i < that.data.goods.length; i++) {
            var item = that.data.goods[i]
            goods_pre.push({
              goods_name: item.name,
              goods_price: item.price,
              goods_num: item.count,
              goods_cost: parseFloat(item.price) * item.count,
              key_name: item.key_name ? item.key_name : '',
            })
          }
          print_pro({
            goods: goods_pre,
            pay_price: that.data.totalMoney,
            num: that.data.goods.length,
            name: that.data.editaddress.receiver,
            address: that.data.editaddress.address + that.data.editaddress.detail,
            phone: that.data.editaddress.phone,
            shop_name: that.data.shopa,
            shop_phone: that.data.shop_phone,
            order_type:0,
            shop_id:app.globalData.shop_id,
            message: that.data.message
          }).then(res => {

          })
          wx.navigateTo({
            url: '/pages/mine/orderlist/orderlist?bindid=1' + '&goods_id=' + that.data.goods_id,
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
            wx.redirectTo({
              url: '/pages/mine/orderlist/orderlist?bindid='+0,
            })
          }, 1000)
        }
      })
    })
  },


  shop_info() {
    var that = this
    shop_info({
      shop_id: app.globalData.shop_id,
      user_id: app.globalData.userid
    }).then((res) => {
      if (res.error_code == 1000) {
        that.setData({
          shopa: res.data.name,
          shop_phone: res.data.data.cs_phone
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var goods_info = []
    that.setData({
      backgroundColor: app.globalData.selectedColor,
    })
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
   
   
    that.shop_info()
    that.get_default_address()
   
    wx.getStorage({
      key: 'singleorderinfo',
      success: function (res) {
        console.log(res)
        that.setData({
          goods: res.data,
        })
        res.data.forEach(function (item) {
          goods_info.push({
            product_id: item.product_id,
            count: item.count,
          })
        })
        my_cash({
          user_id: app.globalData.userid,
          shop_id: app.globalData.shop_id,
          goods: goods_info
        }).then((response) => {
          //console.log(response,"youhuishdhchbhjb")
          if (response.error_code == 1000) {
            that.setData({
              cash_num: response.data.length
            })
          } else if(response.error_code == 1002){
            that.setData({
              cash_num: response.data.length
            })
          }
        })
        that.totalPrice()
      },
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
    let that = this
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

    // that.editaddress()

    that.data.coupon = store.get('coupon')

    

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