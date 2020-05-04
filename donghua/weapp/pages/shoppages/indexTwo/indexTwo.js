// pages/shoppages/index/index.js

import {
  sel_cate_pro,
  show_cash,
  sel_cate,
  show_commend,
  auth,
  goods_list,
  show_cut,
  add_shopcart,
  tea_goods_show,
  usable_cash,
  shop_info,
  get_cash,
  wx_group_info,
} from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidPullUp: false,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    spec_price_pre: [],
    spec_goods_scores: [],
    spec_spec_imgs: [],
    spec_market_prices: [],
    type: '',
    cash_id: "",
    //showLoad: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cs_phone: '',
    showModalStatus: false,
    animationData: '',
    chooseSize: false,
    count: 1,
    latitude: '',
    longitude: '',
    is_slide: 0,
    // coupon_got: 0,
    is_new: 1,
    spec_item: '',
    ungetInfo: false,
    winHeight: 0,
    coupon_num: 0,
    show: true,
    page: 1,
    total_page: '',
    loadall: true,
  },

  toShops: function () {
    wx.redirectTo({
      url: '../shops/shops',
    })
  },
  toCart: function () {
    wx.redirectTo({
      url: '../../mine/cart/cart',
    })
  },
  toMine: function () {
    wx.redirectTo({
      url: '../../mine/mine',
    })
  },


  get_shopinfo() {
    var that = this
    shop_info({
      shop_id: app.globalData.shop_id,
      user_id: app.globalData.userid
    }).then((res) => {
      console.log(res.data.data.order)
      console.log(res.data.data)
      if (res.error_code == 1000) {
        var templates = [res.data.data.is_bargain, res.data.data.is_cash, res.data.data.is_goods_group, res.data.data.is_group, res.data.data.is_hot_pust, res.data.data.is_search, res.data.data.is_slide, res.data.data.shop_info_isshow]
        var switchs = [res.data.data.order.is_bargain_order, res.data.data.order.is_cash_order, res.data.data.order.is_goods_group_order, res.data.data.order.is_group_order, res.data.data.order.is_hot_pust_order, res.data.data.order.is_search_order, res.data.data.order.is_slide_order, res.data.data.order.shop_info_isshow_order, ]
        // console.log(switchs)
        var switchses=[]
        for (var x = 0; x < switchs.length;x++){
          var num=''
        num=Number(switchs[x]);
          switchses.push(num)
        }
        console.log(switchses,'22222')
        var librarys = ["is_bargain", "is_cash", "is_goods_group", "is_group", "is_hot_pust", "is_search", "is_slide", "shop_info_isshow", "seat"]
        var dataitems=[]
        var item=[]
        for (var i = 0; i < templates.length; i++) {
          if (templates[i] != 0) {
            dataitems[switchses[i] - 1] = librarys[i]
          } else {
            dataitems[switchses[i]-1] = librarys[8]
          }
        }
        if (dataitems[dataitems.length - 1] == "is_hot_pust"){
          that.setData({
            hidPullUp:true
          })
        }else{
          that.setData({
            hidPullUp: false
          })
        }
     
        that.setData({
          datatext: dataitems
        });
      
       

        that.setData({
          shopa: res.data.name,
          logo: res.data.logo,
          shop_address: res.data.data.shop_address,
          business: res.data.data.business_hours,
          cs_phone: res.data.data.cs_phone,
          latitude: res.data.data.latitude,
          longitude: res.data.data.longitude,
          imgUrls: res.data.data.bg_picture_url,
          groupimg: res.data.data.group_bg_img,
          is_group: res.data.data.is_group,
          bargain_bg_img: res.data.data.bargain_bg_img,
          is_bargain: res.data.data.is_bargain,
          is_cash: res.data.data.is_cash,
          shop_info_isshow: res.data.data.shop_info_isshow,
          cash_bg_img: res.data.data.cash_bg_img
        })
        //  修改首页标题
        wx.setNavigationBarTitle({
          title: that.data.shopa
        })


      }
    })
  },


  //地图
  bindaddinput: function (e) {
    //console.log(e,"pppp")
    wx.openLocation({
      latitude: parseFloat(this.data.latitude), //31.26785  
      longitude: parseFloat(this.data.longitude), // 121.45665
    })
  },

  // 电话
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.cs_phone,
    })
  },

  //显示优惠券
  show_cash() {
    var that = this
    var cash_pre = []
    show_cash({ shop_id: app.globalData.shop_id, user_id: app.globalData.userid }).then((res) => {
      if (res.data.cashArr != "") {
        res.data.cashArr.forEach(function (item) {
          if (item.status == 0 && item.cash_state != 3) {
            cash_pre.push(item)
          }
        })
        if (cash_pre == '') {
          that.setData({
            none: true,
            winHeight: 420,
            casharr: cash_pre
          })
        } else {
          that.setData({
            none: false,
            casharr: cash_pre,
            winHeight: cash_pre.length * 200,
          })
        }
      } else {
        that.setData({
          none: true,
          winHeight: 420,
          casharr: cash_pre
        })
      }
    })
  },

  // 优惠券弹出层
  showModal: function (e) {
    // 显示遮罩层
    var that = this
    if (!store.get('user_id')) {
      that.setData({
        ungetInfo: true
      })
    } else {
      var animation = wx.createAnimation({
        duration: 100,
        timingFunction: "linear",
        delay: 0
      })
      that.animation = animation
      animation.translateY(700).step()
      that.setData({
        animationData: animation.export(),
        showModalStatus: true,
      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }.bind(that), 200)
    }
  },

  hideModals: function () {
    this.setData({
      showModalStatus: false,
    })
  },

  // cash_state : 2，首页  0，店铺领取  3，下单  1，转发

  //  status  0 未领取过   1 领取

  //  is_new  0 领取过   1 未领取
  click(e) {
    var that = this
    get_cash({
      shop_id: app.globalData.shop_id,
      cash_id: e.currentTarget.dataset.id,
      user_id: app.globalData.userid
    }).then((res) => {
      if (res.error_code == 1000) {
        wx.showToast({
          title: '领取成功',
          duration: 1000
        })
        this.show_cash();
      }
    })
  },


  // to_sue() {
  //   var that = this
  //   that.setData({
  //     coupon_got: 1
  //   })
  // },



  shopcut() {
    wx.navigateTo({
      url: '/pages/shoppages/shopcut/shopcut',
    })
  },

  Collage() {
    wx.navigateTo({
      url: '/pages/shoppages/Collages/Collages',
    })
  },


  // 搜索
  to_search_goods() {
    wx.navigateTo({
      url: '/pages/shoppages/search/search',
    })
  },


  // 分类
  showcates() {
    var that = this
    sel_cate({
      shop_id: app.globalData.shop_id,
    }).then((res) => {
      if (res.error_code == 1000) {
        wx.showLoading({
          title: '正在加载中...',
          duration: 500
        })
        that.setData({
          cates: res.data
        })
      } else {
        wx.showLoading({
          title: '加载失败',
          duration: 1000
        })
      }
    })
  },

  bindcation(e) {
    var that = this
    var homeid = e.currentTarget.dataset.cate_id
    wx.navigateTo({
      url: '/pages/shoppages/goodslist/goodslist?cate_id=' + homeid,
    })
  },




  // 砍价跳转
  toCutGoodsPage(e) {
    wx.navigateTo({
      url: '../cutPriceDesc/cutPriceDesc?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + this.data.shop_id + '&get_price=' + e.currentTarget.dataset.get_price + '&goods_price=' + e.currentTarget.dataset.goods_price,
    })
  },



  // 拼团
  toCutGoodsPages(e) {
    wx.navigateTo({
      url: '../groupbuy/groupbuy?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + this.data.shop_id + '&get_price=' + e.currentTarget.dataset.get_price + '&goods_price=' + e.currentTarget.dataset.goods_price,
    })
  },


  // 店铺热销

  show_commend() {
    var that = this
    show_commend({
      shop_id: app.globalData.shop_id,
      page: that.data.page
    }).then((res) => {
      // that.data.constants = res.data.goods
      that.setData({
        rec_goods: res.data.goods,
        total_page: res.data.total_page
        //goods: res.data.goods[0],
        //is_group: res.data.goods[0].is_group,
      })
    })
  },


  // 跳转详情页

  toGoodsinfo(e) {
    //console.log(e)
    var that = this
    if (!store.get('user_id')) {
      that.setData({
        ungetInfo: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/shoppages/goods/goods?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + this.data.shop_id,
      })
    }
  },


  chooseSpec(e) {
    // console.log(e,"pppppp")
    var that = this
    that.setData({
      chooseIndex: e.currentTarget.dataset.index,
      spec_price_choose: that.data.spec_price_pre[e.currentTarget.dataset.index],
      spec_goods_scores: that.data.spec_goods_score[e.currentTarget.dataset.index],
      spec_spec_imgs: that.data.spec_spec_img[e.currentTarget.dataset.index],
      spec_market_prices: that.data.spec_market_price[e.currentTarget.dataset.index]
    })
  },

  /**
   * 加入购物车
   */
  addCart(e) {
    var that = this
    if (!store.get('user_id')) {
      that.setData({
        ungetInfo: true
      })
    } else {
      // add_shopcart({
      //   shop_id: app.globalData.shop_id,
      //   name: e.currentTarget.dataset.goods_name,
      //   image: e.currentTarget.dataset.goods_img,
      //   key_name: '',
      //   product_id: e.currentTarget.dataset.product_id[0],
      //   number: e.currentTarget.dataset.goods_score[0],
      //   price: e.currentTarget.dataset.spec_price[0],
      //   goods_id: e.currentTarget.dataset.goods_id,
      //   user_id: store.get('user_id'),
      //   count: 1,
      //   spec_imgs: e.currentTarget.dataset.spec_img[0],
      // }).then((res) => { })
      let spec_item_pre = []
      that.data.goods_info_pre = e.currentTarget.dataset
      that.data.spec_price_pre = e.currentTarget.dataset.spec_price
      that.data.spec_goods_score = e.currentTarget.dataset.goods_score
      that.data.spec_spec_img = e.currentTarget.dataset.spec_img
      that.data.spec_market_price = e.currentTarget.dataset.market_price

      for (var i = 0; i < e.currentTarget.dataset.spec_name.length; i++) {
        spec_item_pre.push(e.currentTarget.dataset.spec_name[i].split(":")[1])
      }

      that.setData({
        chooseSize: !that.data.chooseSize,
        spec_name: e.currentTarget.dataset.spec_name[0].split(":")[0],
        spec_item: spec_item_pre,
        goods_name: e.currentTarget.dataset.goods_name,
        chooseIndex: 0,
        spec_price_choose: e.currentTarget.dataset.spec_price[0],
        goods_img: e.currentTarget.dataset.goods_img,
        spec_goods_scores: e.currentTarget.dataset.goods_score[0],
        spec_market_prices: e.currentTarget.dataset.market_price[0],
        spec_spec_imgs: e.currentTarget.dataset.spec_img[0],
        spec_imgs: e.currentTarget.dataset.spec_img.length,
        spec_names: e.currentTarget.dataset.spec_name.length
      })
    }
  },

  // 确定加入
  addToCart(e) {
    var that = this
    if (e.currentTarget.dataset.spec_goods_scores < 1) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    } else {
      add_shopcart({
        name: that.data.goods_info_pre.goods_name,
        image: that.data.goods_info_pre.goods_img,
        key_name: that.data.goods_info_pre.spec_name[that.data.chooseIndex],
        product_id: that.data.goods_info_pre.product_id[that.data.chooseIndex],
        number: that.data.goods_info_pre.goods_score[that.data.chooseIndex],
        price: that.data.goods_info_pre.spec_price[that.data.chooseIndex],
        goods_id: that.data.goods_info_pre.goods_id,
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        count: that.data.count
      }).then((res) => {
        if (res.error_code == 1001) {
          wx.showLoading({
            title: '添加失败',
          })
        } else {
          wx.showLoading({
            title: '已加入购物车',
          })
          setTimeout(function () {
            wx.hideLoading()
            that.setData({
              chooseSize: false,
              count: 1
            })
          }, 1000)
        }
      })
    }
  },

  /**
   * 隐藏购物车弹出层
   */
  hideModal() {
    var that = this;
    that.setData({
      chooseSize: false,
      count: 1
    })
  },


  // 加号
  importCountjia(e) {
    var that = this
    var count = this.data.count;
    count++
    that.data.count = count
    if (that.data.count > that.data.spec_goods_scores) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      that.data.count = that.data.spec_goods_scores
    }
    that.setData({
      count: that.data.count,
    });

  },


  // 减号
  importCountjian(e) {
    var that = this
    var count = that.data.count;
    if (count > 1) {
      count--
    }

    // var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    that.setData({
      count: count,
      // minusStatus: minusStatus
    });
  },

  // tochoose(e) {
  //   console.log(e,"888888")
  //   var that = this
  //   let idx = e.currentTarget.dataset.spec_id
  //   that.setData({
  //     index: e.currentTarget.dataset.spec_id,
  //     product_id: that.data.products.product_ids[idx],
  //     spec_image: that.data.specimgs.spec_imgs[idx],
  //     spec_goods_prices: that.data.products.goods_prices[idx],
  //     spec_group_prices: that.data.products.group_prices[idx],
  //     spec_market_prices: that.data.products.market_prices[idx],
  //     spec_goods_scores: that.data.products.goods_scores[idx],
  //     spec_value_choose: that.data.spec_value[idx]
  //   })
  // },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.scene) {
      console.log("has scene");
      var scene = decodeURIComponent(options.scene);
      console.log("scene is", scene);
      that.setData({
        sceneCode: scene
      })

      // var arrPara = scene.split("&");
      // var arr = [];
      // for (var i in arrPara) {
      //   arr = arrPara[i].split("=");
      //   wx.setStorageSync(arr[0], arr[1]);
      //   console.log("setStorageSync:", arr[0], "=", arr[1]);
      // }
    } else {
      console.log("no scene");
    }
    if (app.globalData.shop_color && app.globalData.shop_color != '') {
      that.setData({
        backgroundColor: app.globalData.selectedColor
      })
    } else {
      app.shop_colorCallback = shop_color => {
        if (shop_color != '') {
          that.setData({
            backgroundColor: app.globalData.selectedColor
          })
        }
      }
    }

    that.showcates()
    that.get_shopinfo()
    that.show_commend()
    if (app.globalData.userid && app.globalData.userid != 0) {
      that.show_cash()
    } else {
      app.userInfoReadyCallback = (userInfo, ungetInfo) => {
        if (userInfo != 0) {
          that.show_cash()
        }
      }
    }
  },


  // 授权登录
  bindGetUserInfo: function (e) {
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
          sel_cate_pro({
            u: that.data.sceneCode,
            shop_id: app.globalData.shop_id,
            user_id: response.data.user_id
          }).then((res) => {
          })
          if (response.error_code == 1000) {
            app.globalData.userU = response.data.u
            // console.log(app.globalData.userU)
            app.globalData.userid = response.data.user_id
            store.set('openid', response.data.openid)
            store.set('user_id', response.data.user_id)
            that.setData({
              is_new: that.data.is_new,
              ungetInfo: false
            })
          }
        }).then(function () {
          if (app.userInfoReadyCallback) {
            app.userInfoReadyCallback(app.globalData.userid, app.globalData.ungetInfo)
          }
        }).then(function () {
          app.globalData.ungetInfo = false
          that.setData({
            ungetInfo: false
          })
        })
      }
    })
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
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
    this.setData({
      backgroundColor: app.globalData.selectedColor,
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
    var that = this
    if (that.data.hidPullUp){
    wx.showLoading({
      title: '正在加载',
    })
    if (that.data.page < that.data.total_page) {
      show_commend({
        shop_id: app.globalData.shop_id,
        page: that.data.page + 1
      }).then((res) => {
        if (res.error_code == 1000) {
          wx.hideLoading()
          var goods_pre = that.data.rec_goods
          for (var i = 0; i < res.data.goods.length; i++) {
            goods_pre.push(res.data.goods[i])
          }
          that.setData({
            rec_goods: goods_pre,
            page: that.data.page + 1
          })
         
        }
      })
    } else {
      wx.hideLoading()
      
      that.setData({
        loadall: false
      })
      }
    }
  },
  loadMore: function() {
    var that=this
    wx.showLoading({
      title: '正在加载',
    })
    if (that.data.page < that.data.total_page) {
      show_commend({
        shop_id: app.globalData.shop_id,
        page: that.data.page + 1
      }).then((res) => {
        if (res.error_code == 1000) {
          wx.hideLoading()
          var goods_pre = that.data.rec_goods
          for (var i = 0; i < res.data.goods.length; i++) {
            goods_pre.push(res.data.goods[i])
          }
          if (that.data.page + 1 == that.data.total_page) {
            that.setData({
              loadall: false,
              rec_goods: goods_pre,
            })
          }else{
            that.setData({
              rec_goods: goods_pre,
              page: that.data.page + 1
            })
          }
          
        }
      })
    } else {
      wx.hideLoading()
      that.setData({
        loadall: false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})