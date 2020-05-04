// pages/mine/cart/cart.js
import {
  auth,
  show_shopcart,
  del_shopcart,
  user_info
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
//const request = require('../../../utils/request');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    saveHidden: true,
    allSelect: true,
    noSelect: false,
    tempFilePaths: "",
    allPrice: 0,
    imageUrl: "",
    imageUrlPrefix: "",
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
    infofrominput: {},
    inputPrice: true,
    addlist: [],
    list: [],
    count: 1,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    number: ''
    // items: [],
    // startX: 0, //开始坐标
    // startY: 0,
    // isTouchMove: false //默认隐藏删除
  },

  toShops: function () {
    wx.redirectTo({
      url: '../../shoppages/shops/shops',
    })
  },
  toMine: function () {
    wx.redirectTo({
      url: '../mine',
    })

  },
  toIndex: function () {
    wx.redirectTo({
      url: '../../shoppages/index/index',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      bar: app.globalData.barHeight,
    })

    // wx.getStorage({
    //   key: 'cart',
    //   success: function(res) {
    //     that.setData({
    //       count: res.data[0].count
    //     })
    //   }
    // })
    if (!store.get('user_id')) {
      that.setData({
        showLoad: true
      })
    } else {
      that.setData({
        showLoad: false
      })
    }
    that.user_info()

    // that.user_info()

  },


  //计算总价方法
  totalPrice: function () {
    var list = this.data.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.price == "") {
        curItem.price = 0;
      } else {
        curItem.price = curItem.price;
      }
      if (curItem.active) {
        total += parseFloat(curItem.price) * curItem.count;
      }
    }

    //console.log(total)

    total = total.toFixed(2); //js浮点计算bug，取两位小数精度

    return total;
  },


  //输入数量
  importCount: function (e) {
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    addlist[index].count = e.detail.value;

    if (addlist[index].count > addlist[index].number) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      addlist[index].count = addlist[index].number
    }
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
  },


  //点击减少数量
  importCountjian: function (e) {
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    var count = addlist[index].count;
    if (count > 1) {
      count--;
    }
    addlist[index].count = count
    this.setData({
      list: addlist,
    })
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
  },



  //点击增加数量
  importCountjia: function (e) {
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    var count = addlist[index].count;
    count++;
    addlist[index].count = count

    if (addlist[index].count > addlist[index].number) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      addlist[index].count = addlist[index].number
    }

    this.setData({
      list: addlist,
    })
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
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
    var that = this;
    that.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    var userid = store.get('user_id');
    var cart = {
      'user_id': userid,
      'shop_id': app.globalData.shop_id
    };

    if (!store.get('user_id')) {
      that.setData({
        showLoad: true
      })
    } else {
      that.setData({
        showLoad: false
      })
    }
    that.user_info()

    show_shopcart(cart).then((res) => {
      res.data.forEach(function (item) {
        item.active = true
      })
      that.data.list = res.data
      var totalPrice = that.totalPrice()
      that.setData({
        list: res.data,
        allSelect: true,
        noSelect: false,
        allPrice: totalPrice,
      })
    })
  },

  /**
   * 删除购物车内的商品
   */
  dellItem: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;

    // wx.showModal({
    //   title: '删除提示',
    //   //标题(可为空或者省略)  
    //   content: '是否删除当前数据',
    //   confirmText: '确定删除',
    //   confirmColor: '#333ccc',
    //   cancelText: '取消删除',
    //   cancelColor: '000',
    //  // showCancel: false,
    //   //设置cancel是否展示    
    //   success: function(res) {
    //     if (res.confirm) {
    //     } else if (res.cancel) {
    //       console.log('取消')
    //     }
    //   }
    // })
    list.splice(index, 1);
    that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
    var cart = {
      'id': e.currentTarget.dataset.uuid
    };
    del_shopcart(cart).then((res) => {
      if (res.error_code == 1000) {
        var totalPrice = this.totalPrice();
        this.setData({
          allPrice: totalPrice,
          inputPrice: false,
        })
      } else { }
    })
  },



  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    }
    var count = list[index].count;
    list[index].count = count
    this.setData({
      list: list,
    })
    if (list[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
    var id = e.currentTarget.dataset.id
  },

  allSelect: function () {
    var list = this.data.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },

  setGoodsList: function (saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      saveHidden: saveHidden,
      totalPrice: total,
      allSelect: allSelect,
      noSelect: noSelect,
      list: list
    });
    var shopCarInfo = {};
    var tempNumber = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNumber = tempNumber + list[i].number
    }
    shopCarInfo.shopNum = tempNumber;
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  },

  // 全选
  bindAllSelect: function () {
    var currentAllSelect = this.data.allSelect;
    var list = this.data.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
        var count = list[i].count;
        list[i].count = count
        this.setData({
          list: list,
        })
        if (list[i].real_price != "") {
          var totalPrice = this.totalPrice();
          this.setData({
            allPrice: totalPrice,
            inputPrice: false,
          })
        }
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
        var count = list[i].count;
        list[i].count = count
        this.setData({
          list: list,
        })
        if (list[i].real_price != "") {
          var totalPrice = this.totalPrice();
          this.setData({
            allPrice: totalPrice,
            inputPrice: false,
          })
        }
      }
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
  },

  editTap: function () {
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },

  saveTap: function () {
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  getSaveHide: function () {
    var saveHidden = this.data.saveHidden;
    return saveHidden;
  },
  deleteSelected: function (e) {
    var that = this;
    var itemlist = that.data.list
    var newsourse = []
    for (var i = 0; i < itemlist.length; i++) {
      if (itemlist[i].active == true) {
        newsourse.push(itemlist[i].id)
      }
    }
    var ob = {};
    ob.ids = newsourse
    wx.request({
      method: 'POST',
      url: app.globalData.etoolsUrl + '/cart/delete',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-token': wx.getStorageSync('token')
      },
      data: {
        data: JSON.stringify(ob)
      },
      success(res) {
        if (res.data.meta.code == app.apiCode.SUCCESS) { } else {
          //处理错误信息
          var exception = res.data.meta;
          app.handleException(exception, true);
        }
      }
    })
    var list = this.data.list;
    list = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },

  // 结算
  toPayOrder: function (e) {
    var that = this;
    var itemlist = this.data.list
    var newsourse = []
    for (var i = 0; i < itemlist.length; i++) {
      if (itemlist[i].active == true) {
        newsourse.push(itemlist[i])
      }
    }
    if (newsourse.length == 0) {
      wx.showLoading({
        title: '请选择商品',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else {
      wx.navigateTo({
        url: '/pages/shoppages/singleorderinfo/singleorderinfo'
      })
    }
    wx.setStorage({
      key: "singleorderinfo",
      data: newsourse
    })
    wx.removeStorage({
      key: 'coupon',
      success: function (res) { }
    })
  },


  toPayOrders() {
    wx.redirectTo({
      url: '/pages/shoppages/shops/shops',
    })
  },



  bindGetUserInfo: function(e) {
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.code = res.code

        store.set('me', e.detail.userInfo)
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = e.detail.userInfo
        auth({
          shop_id: app.globalData.shop_id,
          code: app.globalData.code,
          name: e.detail.userInfo.nickName,
          photo: e.detail.userInfo.avatarUrl,
          sex: e.detail.userInfo.gender
        }).then((response) => {
          if (response.error_code == 1000) {
            app.globalData.userid = response.data.user_id
            store.set('openid', response.data.openid)
            store.set('user_id', response.data.user_id)
            that.setData({
              showLoad: false,
              avatar: e.detail.userInfo.avatarUrl,
              name: e.detail.userInfo.nickName
            })
            // that.user_info()
          }
        })
      }
    })
  },

  user_info() {
    var that = this
    user_info({
      user_id: app.globalData.userid
    }).then((res) => {
      if (res.error_code = 1000) {
        // that.setData({
        //   avatar: res.data.photo,
        //   name: res.data.name
        // })
      }
    })
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