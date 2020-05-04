// pages/shoppages/groupbuy/groupbuy.js
import {
  goods_info,
  show_no_group,
  get_goods
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
//const WxParse = require('../../../wxParse/wxParse.js')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: false,
    animationData: {},
    spec_name: '',
    //spec_image: '',
    spec_value: '',
    goods_id: '',
    goods: [],
    show_groups: false,
    content: '',
    shop_id: '',
    goods_image: [],
    is_group: 1,
    index: 100,
    products: '',
    specimgs: '',
    type: '',
    ungetInfo: false
  },

  show_goods(goods_id) {
    let that = this
    var goods_image_pre = []
    var item_1 = ''
    var item_2 = ''
    var spec_names = []
    var spec_values = []
    that.data.goods_id = goods_id
    get_goods({
      goods_id: goods_id
    }).then((res) => {
      if (res.error_code == 1000) {
        // WxParse.wxParse('article', 'html', res.data.goods[0].goods_desc, that, 5)
        goods_image_pre.push(res.data.goods[0].goods_img)

        if (res.data.goods[0].img_urls != '') {
          for (var i = 0; i < res.data.goods[0].img_urls.length; i++) {
            goods_image_pre.push(res.data.goods[0].img_urls[i])
          }
        }

        that.data.products = res.data.products[0]
        that.data.specimgs = res.data.specimgs[0]
        if (res.data.goods[0].is_on_spec == 1) {
          that.setData({
            goods: res.data.goods[0],
            is_group: res.data.goods[0].is_group,
            goods_image: goods_image_pre,
            goods_price: res.data.products[0].goods_prices[0],
            spec_goods_prices: res.data.products[0].group_prices[0],
            spec_group_prices: res.data.products[0].group_prices[0],
            spec_market_prices: res.data.products[0].market_prices[0],
            spec_goods_scores: res.data.products[0].goods_scores[0],
            market_price: res.data.products[0].market_prices[0],
            group_price: res.data.products[0].group_prices[0],
            spec_image: res.data.goods[0].goods_img,
            goods_img: res.data.goods[0].goods_img
          })
          if (res.data.products[0].key_names[0].indexOf(" ") == -1) {
            let spec_name_pre = res.data.products[0].key_names[0].split(":")[0]
            let spec_value_pro = []
            for (var k = 0; k < res.data.products[0].key_names.length; k++) {
              spec_value_pro.push(res.data.products[0].key_names[k].split(":")[1])
            }
            that.setData({
              spec_name: spec_name_pre,
              spec_value: spec_value_pro
            })
          } else {
            let spec_infos = res.data.products[0].key_names[0].split(" ")
            let spec_value_pre = []
            for (var p = 0; p < spec_infos.length; p++) {
              spec_names.push(spec_infos[p].split(":")[0])
            }
            for (var q = 0; q < res.data.products[0].key_names.length; q++) {
              let spec_value_p = res.data.products[0].key_names[q].split(" ")
              spec_value_pre.push(spec_value_p[0].split(":")[1] + "/" + spec_value_p[1].split(":")[1])
            }
            that.setData({
              spec_name: spec_names[0] + '/' + spec_names[1],
              spec_value: spec_value_pre
            })
          }
        } else {
          that.setData({
            goods: res.data.goods[0],
            is_group: res.data.goods[0].is_group,
            goods_image: goods_image_pre,
            goods_price: res.data.products[0].goods_prices[0],
            spec_goods_prices: res.data.products[0].group_prices[0],
            spec_group_prices: res.data.products[0].group_prices[0],
            spec_market_prices: res.data.products[0].market_prices[0],
            spec_goods_scores: res.data.products[0].goods_scores[0],
            market_price: res.data.products[0].market_prices[0],
            group_price: res.data.products[0].group_prices[0],
            spec_image: res.data.goods[0].goods_img,
            goods_img: res.data.goods[0].goods_img
          })
        }
      } else {
        wx.showLoading({
          title: '参数错误',
        })
      }
    })
  },


  show_home() {
    wx.redirectTo({
      url: '/pages/shoppages/index/index',
    })
  },
  cart() {
    wx.redirectTo({
      url: '/pages/mine/cart/cart',
    })
  },

  mineGrey() {
    wx.redirectTo({
      url: '/pages/mine/mine',
    })
    
  },



  tochoose(e) {
    var that = this
    let idx = e.currentTarget.dataset.spec_id
    that.setData({
      index: e.currentTarget.dataset.spec_id,
      product_id: that.data.products.product_ids[idx],
      spec_image: that.data.specimgs.spec_imgs[idx],
      spec_goods_prices: that.data.products.group_prices[idx],
      spec_group_prices: that.data.products.group_prices[idx],
      spec_market_prices: that.data.products.market_prices[idx],
      spec_goods_scores: that.data.products.goods_scores[idx],
      spec_value_choose: that.data.spec_value[idx]
    })
  },

  reset() {
    this.setData({
      bar: app.globalData.barHeight,
      barHeight: app.globalData.barHeight + 45
    })
  },
  joingroup(e) {
    var that = this
    if (app.globalData.userid && app.globalData.userid != 0) { 
    wx.setStorage({
      key: 'grouporderinfo',
      data: {
        goods_id: that.data.goods_id,
        goods_name: that.data.goods.goods_name,
        goods_price: e.currentTarget.dataset.goods_cost,
        group_sn: e.currentTarget.dataset.group_sn,
        key_name: e.currentTarget.dataset.key_name,
        product_id: e.currentTarget.dataset.product_id,
        image: that.data.goods_img,
        group_prices: e.currentTarget.dataset.group_prices,
        group_num: that.data.goods.group_num
      }
    })
    wx.navigateTo({
      url: '/pages/shoppages/grouporderinfo/grouporderinfo',
    })
    }else{
      that.setData({
        ungetInfo: true
      })
    }
  },



  /**
   * 打开规格
   */
  show_spec(e) {
    var that = this
    if (app.globalData.userid && app.globalData.userid != 0) { 
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(0).step()
    that.setData({
      type: e.currentTarget.dataset.type,
      animationData: animation.export(),
      index: 0,
      chooseSize: true,
      product_id: that.data.products.product_ids[0],
      spec_image: that.data.specimgs.spec_imgs[0],
      spec_goods_prices: that.data.products.group_prices[0],
      spec_group_prices: that.data.products.group_prices[0],
      spec_market_prices: that.data.products.market_prices[0],
      spec_goods_scores: that.data.products.goods_scores[0],
      //spec_value_choose: that.data.spec_value[0]
    })
    
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
    }else{
      that.setData({
        ungetInfo: true
      })
    }
  },


  /**确认按钮 */
  tobought() {
    var that = this
    var flag = true
    if (that.data.index == 100) {
      wx.showLoading({
        title: '请选择规格',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 500)
    } else if (that.data.spec_goods_scores < 1) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 500)
    } else {
      flag = false
    }
    if (flag == false) {
      if (that.data.type == 1) {
        wx.setStorage({
          key: "grouporderinfo",
          data: {
            goods_id: that.data.goods_id,
            key_name: that.data.spec_value_choose,
            goods_price: that.data.spec_group_prices,
            group_prices: that.data.spec_group_prices,
            image: that.data.goods_img,
            goods_name: that.data.goods.goods_name,
            product_id: that.data.product_id,
            group_sn: '',
            market_prices: that.data.spec_market_prices,
            group_num:that.data.goods.group_num
          }
        })
        wx.navigateTo({
          url: '/pages/shoppages/grouporderinfo/grouporderinfo',
        })
      }
    }
  },
  /**
   * 隐藏规格
   */
  hideModal() {
    var that = this;
    that.setData({
      chooseSize: false
    })
  },
 
  show_more_groups() {
    this.setData({
      show_groups: true
    })
  },


  cancel_groups_show() {
    this.setData({
      show_groups: false
    })
  },


  show_no_group(id) {
    var that = this
    that.data.good_id = id
    show_no_group({
      goods_id: id
    }).then((res) => {
      that.setData({
        group_wait: res.data.group,
        group_count: res.data.count
      })
    })
  },
  //授权函数
  bindGetUserInfo: function (e) {
    var that = this
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
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.reset()
    this.show_no_group(options.goods_id)
    this.show_goods(options.goods_id)
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