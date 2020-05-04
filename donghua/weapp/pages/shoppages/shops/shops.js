// pages/shoppages/shops/shops.js
import {
  search_goods,
  shop_info,
  show_commend,
  sel_cate,
  show_cate_goods,
  goods_list,
  auth,
  show_cut,
  get_cash,
  tea_goods_show,
  add_shopcart
} from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //commend_page: 1,
    catename: [],
    goods: [],

    // 左侧点击类样式
    //curNav:"0",
    scrollTop: 0,
    // 定义一个空数组，用来存放右侧滑栏中每一个商品分类的 Height
    listHeight: '',
    animation: '',
    height: '',
    width: '',
    ishide: true,
    // showView: true,
    //showModalStatus: true,
    count: 1,
    idx: 0,
    spec_goods_scores: [],
    spec_spec_imgs: [],
    spec_market_prices: [],
    booleans: false,
    ungetInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
  },

  toIndex: function () {
    wx.redirectTo({
      url: '../index/index',
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

  //  列表
  showButton: function() {
    var that = this;
    var bol = that.data.booleans;
    this.setData({
      booleans: !bol
    })
    // var that = this;
    // that.setData({
    //   showView: (!that.data.showView)
    // })
  },

  // 搜索
  to_search_goods() {
    wx.navigateTo({
      url: '/pages/shoppages/search/search',
    })
  },

  clickItemToggeHide: function(e) {
    var that = this
    that.setData({
      ishide: true,
      //showModalStatus: true
    });
  },

  hideModals: function() {
    this.setData({
      //showModalStatus: false,
    })
  },


  tea_goods_show() {
    var that = this
    tea_goods_show({
      shop_id: app.globalData.shop_id
    }).then((res) => {
      //console.log(res, 4544444)
      var listChild1 = res.data.goods;
      var names = ""
      for (var item in listChild1) {
        names += ":" + item;
        var height = (listChild1[item].length - 1) * that.data.right_contentHeight;
        that.data.listHeight += ":" + height;
      }
      if (res.error_code == 1000) {
        wx.showLoading({
          title: '正在加载中...',
          duration: 500
        })
        that.setData({
          goods: listChild1,
          listHeight: that.data.listHeight
        })
      }

      var names = names.substring(1).split(':');
      that.setData({
        names: names
      })
    })
  },







  /**
   * 加入购物车
   */

  addCart(e) {
    console.log(e, "456")
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
      setTimeout(function() {
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
        // console.log(res, "aaaa")
        if (res.error_code == 1001) {
          wx.showLoading({
            title: '添加失败',
          })
        } else {
          wx.showLoading({
            title: '已加入购物车',
          })
          setTimeout(function() {
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
      count:1
    })
  },


  // 加号
  importCountjia(e) {
    console.log(e, 77777777)
    var that = this
    var count = that.data.count;
    count++
    that.data.count = count
    if (that.data.count > that.data.spec_goods_scores) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function() {
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
    that.setData({
      count: count,
    });
  },


  chooseSpec(e) {
    var that = this
    that.setData({
      chooseIndex: e.currentTarget.dataset.index,
      spec_price_choose: that.data.spec_price_pre[e.currentTarget.dataset.index],
      spec_goods_scores: that.data.spec_goods_score[e.currentTarget.dataset.index],
      spec_spec_imgs: that.data.spec_spec_img[e.currentTarget.dataset.index],
      spec_market_prices: that.data.spec_market_price[e.currentTarget.dataset.index]
    })
  },




  // show_commend() {
  //   var that = this
  //   show_commend({
  //     shop_id: app.globalData.shop_id,
  //     page: that.data.commend_page
  //   }).then((res) => {
  //     if (res.error_code == 1000) {
  //       that.data.commend_total_page = res.data.total_page
  //       that.setData({
  //         rec_goods: res.data.goods,
  //         rec_goods_length: res.data.goods.length,
  //       })
  //       wx.showLoading({
  //         title: '加载中',
  //         duration: 1000
  //       })
  //     }
  //   })
  // },

  // toGoodsinfo(e) {
  //   wx.navigateTo({
  //     url: '/pages/shoppages/goods/goods?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + this.data.shop_id,
  //   })
  // },

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      backgroundColor: app.globalData.selectedColor,
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: wx.getStorageSync('selectedColor'),
    //   animation: {
    //     duration: 400,
    //     timingFunc: 'easeIn'
    //   }
    // })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth
        })
      }
    })

    // that.setData({
    //   ungetInfo: app.globalData.ungetInfo
    // })

    that.tea_goods_show()
  },

  // 右侧滑栏的 bindscroll 事件函数
  scroll(event) {
    var that = this
    // 把 listHeight 切割成数组
    // var height = that.data.listHeight.substring(1).split(':');
    // 定义一个 index 供左侧边栏联动使用
    var index = 1;
    var num = 0;
    // for (var i = 0; i < height.length; i++) {
    //   // 累计右侧滑栏滚动上去的每一个分类的 Height
    //   num += parseInt(height[i]);
    //   // 循环判断 num 是否大于右侧滑栏滚动上去的 Height ，然后 get 到 i 值赋给 index
    //   if (num > event.detail.scrollTop) {
    //     index = i + 1;
    //     // 如果右侧滑栏滚动高度小于单个类别高度的 1/2 时，index 为 0
    //     if (event.detail.scrollTop < height[0] / 2) {
    //       index = 0;
    //     }
    //     break;
    //   }
    // }
    // 定义并设置左侧边栏的滚动高度
    var left_scrollTop = that.data.left_titleHeight * index
    that.setData({
      scrollTop: left_scrollTop,
      // 动态给左侧滑栏传递对应该项的 id，用于高亮效果显示
      index: that.data.names[index]
    })
  },

  //点击左侧 tab ，右侧列表相应位置联动 置顶
  switchRightTab: function(e) {
    console.log(e, "999999")
    var that = this
    var id = e.target.id;
    var index = e.currentTarget.dataset.itemIndex;
    // console.log(e, "444444")
    that.setData({
      scrollTopId: "a" + index,
      idx: index,
      // 左侧点击类样式
      //curNav: id,
      //ishide: !that.data.ishide,
      //showModalStatus: !that.data.showModalStatus
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    // 定义右侧标题的 rpx 高度 和 px 高度
    var right_titleRpxHeight = 60;
    var right_titleHeight;
    // 定义右侧单个商品的 rpx 高度 和 px 高度
    var right_contentRpxHeight = 180;
    var right_contentHeight;
    // 定义左侧单个tab的 rpx 高度 和 px 高度
    var left_titleRpxHeight = 140;
    var left_titleHeight;
    //  获取可视区屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        // percent 为当前设备1rpx对应的px值
        var percent = res.windowWidth / 750;
        that.setData({
          winHeight: res.windowHeight-90,
          right_titleHeight: Number(right_titleRpxHeight * percent),
          right_contentHeight: Number(right_contentRpxHeight * percent),
          left_titleHeight: Number(left_titleRpxHeight * percent)
        })
      }
    })
  },


  // 授权登录
  bindGetUserInfo: function (e) {
    var that = this
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
      console.log(response.data.u)
      console.log(response, "授权")
      if (response.error_code == 1000) {
        app.globalData.userid = response.data.user_id
        store.set('openid', response.data.openid)
        store.set('user_id', response.data.user_id)
        that.setData({
          //is_new: that.data.is_new,
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

    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
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