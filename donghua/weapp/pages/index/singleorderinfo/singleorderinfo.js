//pages/shoppages/singleorderinfo/singleorderinfo.js
import {
  // printGroupSignture,
  getFormIdInfo,
  getOrderInfo,
  goodsDetail,
  goods_info,
  get_address,
  teaPay,
  my_cash,
  new_order,
  cut_order,
  print_pro,
  meituan_index,
  getNum
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    unenough:false,
    unenough_msg:'',
    phone2:'',
    receiver2:'',
    is_in_food: 0,
    switchChecked:false,
    // autofocus:true,
    onFocus: true, //textarea焦点是否选中
    isShowText: false, //控制显示 textarea 还是 text
    // newmessage:'',      //用于存储textarea输入内容
    phone: '',
    receiver: '',
    sign: '',
    desk_show:false,
    desk_num: '',
    showWM: false,
    showTC: false,
    showAllList: false,
    differentHid: true,
    currentTab: 0,
    messagelist: [],
    newmessage: '',
    message: '',
    goods: [],
    disable: false,
    goods_id: '',
    order_type: '',
    num: 1,
    editaddress: {
      address:'',
      phone:'',
      id:'',
      receiver:''
    },
    goods: '',
    order_sn: '',
    discount: 0.00,
    express_fee: 0.00,
    cash_num: 0,
    coupon: '',
    coupon_id: '',
    totalPrice: 0,
    totalMoney: 0,
    num:0,
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor,
    shop_address:app.globalData.shop_address,
    open_time:app.globalData.business_hours
  },
  //备注
  onShowTextare() { //显示textare
    this.setData({
      isShowText: true,
      onFocus: true
    })
  },
  onShowText() { //显示text
    this.setData({
      isShowText: false,
      onFocus: false
    })
  },
  onRemarkInput(event) { //保存输入框填写内容
    var value = event.detail.value;
    this.setData({
      newmessage: value,
      isShowText: false,
      onFocus: false
    });
  },
//选择堂吃
  switchChange(){
    this.setData({
      switchChecked: !this.data.switchChecked
    })
    this.totalPrice()
  },

  receiveer: function(e) {
    this.setData({
      receiver2: e.detail.value
    })
  },
  inphone: function(e) {
    this.setData({
      phone2: e.detail.value
    })
  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  chooseWM: function() {
    this.setData({
      currentTab: 0,
      differentHid: true
    })
  },

  chooseTC: function() {
    this.setData({
      currentTab: 1,
      differentHid: false
    })
  },
  /**
   * 输入描述
   */
  // bindmessageinput: function(e) {
  //   var that = this;
  //   that.setData({
  //     newmessage: e.detail.value.split(","),
  //   })
  // },

  /**
   * 点击描述
   */
  binddescribe: function(e) {
    var that = this;
    // that.data.newmessage.push('#' + e.currentTarget.dataset.item)
    // that.setData({
    //   newmessage: that.data.newmessage.toString().replace(/,/g, ''),
    //   isShowText: false,
    //   onFocus: true
    // })
    // that.data.newmessage.push('#' + e.currentTarget.dataset.item)
    that.setData({
      newmessage: that.data.newmessage + '#' + e.currentTarget.dataset.item,
      isShowText: false,
      onFocus: false
    })
  },


  hide() {
    var that = this
    that.setData({
      showMessage: false
    })
  },

  tomessage() {
    var that = this
    that.setData({
      showMessage: true
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
        user_id: store.get('user_id')
      }).then((res) => {
        res.data.forEach(function(item) {
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
      url: '/pages/mine/couponUse/couponUse?goods_id=' + that.data.goods_id + '&order_type=1'
    })
  },

  // show_coupons(id) {
  //   var that = this
  //   that.data.goods_id = id
  //   my_cash({
  //     user_id: store.get('user_id'),
  //     shop_id: app.globalData.shop_id,
  //     goods: id,
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

  totalPrice: function() {
    var that = this;
    var total_price = 0;
    for (var i = 0; i < that.data.goods.length; i++) {
      total_price += that.data.goods[i].num * parseFloat(that.data.goods[i].price)
    }
    var send_price=0
    var total_money=0
      if (that.data.switchChecked ==false&&total_price <app.globalData.initial_price){
      send_price = app.globalData.send_price
    }else{
      send_price = 0
    }
    var cash_money=0
    if (that.data.coupon != '') {
        cash_money = that.data.coupon.cash_money
        that.data.coupon_id = that.data.coupon.cash_id
    }   
    total_money=parseFloat(send_price)+total_price-cash_money
    that.setData({
      totalPrice: total_price.toFixed(2),
      express_fee:send_price,
      initial_price:app.globalData.initial_price,
      totalMoney: total_money.toFixed(2)
    });
  },
  //付款
  formSubmitWM(e) {
      var that = this
      getFormIdInfo({
      formId: e.detail.formId,
      user_id: store.get('user_id'),
      }).then((res) => { })
      var order_goods = []
      var pay_sum = 0
      for (var i = 0; i < this.data.goods.length; i++) {
        var item = this.data.goods[i]
        order_goods.push({
          "goods_id": item.goods_id,
          "goods_num": item.num,
          "goods_cost": parseFloat(item.price),
          "product_id": item.product_id,
          "user_id": store.get('user_id'),
          "key_name": item.key_name
        })
        pay_sum += item.num
      }
      that.setData({
        disable: true
      })
      if(that.data.switchChecked==true){
        that.data.editaddress.address="自取/堂吃"
        that.data.editaddress.detail=""
        that.data.editaddress.phone=that.data.phone2
        that.data.editaddress.id=1
        that.data.editaddress.receiver=that.data.receiver2
        store.set('address2',{
          phone2:that.data.phone2,
          receiver2:that.data.receiver2
        })
      }
      if (that.data.sign == '') {
        if (that.data.editaddress.address != '' && that.data.editaddress.phone != '' && that.data.editaddress.receiver != '') {
          new_order({
            // sign: that.data.sign,
            seller:app.globalData.seller,
            send_price: that.data.switchChecked==true?0:that.data.express_fee,
            order_group_type: 1,
            goods: order_goods,
            pay_sum:pay_sum,
            message: that.data.newmessage,
            address_id: that.data.editaddress.id,
            desk_num:that.data.desk_num,
            user_id: store.get('user_id'),
            shop_id: app.globalData.shop_id,
            cash_id: that.data.coupon_id,
            order_type: that.data.switchChecked==true?2:1,
            buyer: that.data.editaddress.receiver,
            address: that.data.editaddress.address + that.data.editaddress.detail,
            phone: that.data.editaddress.phone
          }).then((res) => {
            if (res.error_code == 1000) {
                var secondaddress = []
              secondaddress.push(that.data.editaddress.phone, that.data.editaddress.receiver)
              store.set('secondaddress', secondaddress)
              that.data.order_sn = res.data.order_sn
              that.order_pay1(res.data.order_id)
            } else if (res.error_code == 1004) {
              wx.showLoading({
                title: '库存不足',
              })
              setTimeout(function() {
                wx.hideLoading()
                that.setData({
                  disable: false,
                  unenough_msg:res.data.goods_name,
                  unenough:true
                })
              }, 1000)
            } else {
              wx.showLoading({
                title: '地址错误',
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
            title: '请填写收货信息',
          })
          setTimeout(function() {
            wx.hideLoading()
            that.setData({
              disable: false
            })
          }, 1000)

        }
      } else {
        getNum({
          sign: that.data.sign
        }).then(res=>{
          if(res.data.num!=that.data.num){
            wx.showLoading({
              title: '参团人数变化',
            })
            setTimeout(function(){
              wx.navigateTo({
                url: '/pages/index/index?sign=' + that.data.sign,
              })
            },1000)
          }else{
            if (that.data.editaddress.receiver == '' || that.data.editaddress.phone==''){
              wx.showLoading({
                title: '请填写收货信息',
              })
              setTimeout(function () {
                wx.hideLoading()
                that.setData({
                  disable: false
                })
              }, 1000)
              return
            }
            goodsDetail({
              user_id: store.get('user_id'),
              sign: that.data.sign
            }).then((res) => {
              if (res.status == 1) {
                new_order({
                  seller: app.globalData.seller,
                  sign: that.data.sign,
                  send_price: that.data.switchChecked == true ? 0 : that.data.express_fee,
                  order_group_type: 1,
                  goods: order_goods,
                  pay_sum: pay_sum,
                  message: that.data.newmessage,
                  address_id: that.data.editaddress.id,
                  user_id: store.get('user_id'),
                  shop_id: app.globalData.shop_id,
                  cash_id: that.data.coupon_id,
                  order_type: that.data.switchChecked == true ? 2 : 1,
                  buyer: that.data.editaddress.receiver,
                  address: that.data.editaddress.address + that.data.editaddress.detail,
                  phone: that.data.editaddress.phone
                }).then((res) => {
                  if (res.error_code == 1000) {
                    var secondaddress = []
                    secondaddress.push(that.data.phone, that.data.receiver)
                    store.set('secondaddress', secondaddress)
                    that.data.order_sn = res.data.order_sn
                    that.order_pay1(res.data.order_id)
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
                      title: '重新添加地址',
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
                  title: res.msg,
                  mask: true,
                })
                that.setData({
                  disable: false
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 500)
              }
            })
          }
        })
        
    }
  },

  order_pay1(order_id) {
    var that = this
    teaPay({
      shop_id: that.data.goods.shop_id,
      user_id: store.get('user_id'),
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
            wx.redirectTo({
              url: '/pages/mine/orderlist/orderlist?bindid=0'
            })
        },
        fail: function(res) {
          wx.showLoading({
            title: '付款失败',
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


  /**
   * 创建配送订单
   */
  create_give(order_id, order_sn) {
    var that = this
    var goods_pre = []
    for (var i = 0; i < that.data.goods.length; i++) {
      var item = this.data.goods[i]
      goods_pre.push({
        "goodCount": item.count,
        "goodPrice": parseFloat(item.price),
        "goodName": item.name,
        "goodUnit": '个'
      })
    }
    meituan_index({
      order_id: order_id,
      receiver_name: that.data.editaddress.receiver,
      receiver_address: that.data.editaddress.address + that.data.editaddress.detail,
      receiver_phone: that.data.editaddress.phone,
      address_id: that.data.editaddress.id,
      goods_value: that.data.totalMoney,
      order_sn: order_sn,
      goods: goods_pre
    }).then(res => {})
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.sign) {
      that.setData({
        phone: store.get('secondaddress')[0],
        receiver: store.get('secondaddress')[1],
        address_id: options.address_id,
        address: options.address,
        sign: options.sign,
        num:options.num
      })
      // wx.getStorage({
      //   key: 'editaddress',
      //   success: function (res) {
      //     if (res != '') {
      //       that.setData({
      //         editaddress: res.data,
      //         phone: res.data.phone,
      //         receiver: res.data.receiver
      //       })
      //     }
      //   },
      // })

    } else {
      wx.getStorage({
        key: 'editaddress',
        success: function(res) {
          if (res != '') {
            that.setData({
              editaddress: res.data,
              phone: res.data.phone,
              receiver: res.data.receiver
            })
          }
        },
      })
    }
    if(store.get('desk_num')){
    that.data.phone2='1'
    that.data.receiver2='u'
    that.setData({
      desk_show:true,
      desk_num: store.get('desk_num')
    })
  }
    // if (app.globalData.is_out_food == 1 && app.globalData.is_in_food == 1) {
    //   that.setData({
    //     showAllList: true
    //   })

    // } else if (app.globalData.is_out_food == 1) {
    //   that.setData({
    //     showWM: true,
    //     differentHid: true
    //   })
    // } else if (app.globalData.is_in_food == 1) {
    //   that.setData({
    //     showTC: true,
    //     differentHid: false
    //   })
    // }
    var goods_info = []
    if(store.get('address2')){
      that.setData({
        phone2:store.get('address2').phone2,
        receiver2: store.get('address2').receiver2
      })
    }
    if(app.globalData.is_in_food==1&&app.globalData.is_out_food==0){
      that.data.switchChecked=true
    }
    that.setData({
      switchChecked: that.data.switchChecked,
      send_price: app.globalData.send_price,
      is_in_food: app.globalData.is_in_food,
      is_out_food:app.globalData.is_out_food,
      messagelist:app.globalData.tag,
      bar: app.globalData.barHeight,
      shop_address: app.globalData.shop_address,
      open_time: app.globalData.business_hours
    })


    wx.getStorage({
      key: 'cartShop',
      success: function(res) {
        that.setData({
          goods: res.data
        })
        res.data.forEach(function(item) {
          goods_info.push({
            price: item.price,
            count: item.num
          })
        })
        my_cash({
          user_id: store.get('user_id'),
          shop_id: app.globalData.shop_id,
          goods: goods_info
        }).then((response) => {
          if (response.error_code == 1000) {
            that.setData({
              cash_num: response.data.length
            })
          }
        })
        that.totalPrice()
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
  onHide: function() {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    store.set('coupon', '')
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