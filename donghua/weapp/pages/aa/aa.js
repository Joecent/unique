// pages/aa/aa.js

import {
  goods_info,
  show_no_group,
  get_goods,
  add_shopcart,
  shop_info,
  auth,
  tea_goods_show
} from '../../utils/api.js'
import * as store from '../../utils/store.js'
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    catename: [],
    goods: [],

    // 左侧点击类样式
    idx: 0,
    scrollTop: 0,
    // 定义一个空数组，用来存放右侧滑栏中每一个商品分类的 Height
    listHeight: '',
    animation: '',
    height: '',
    width: '',
    ishide: false,
    scrollTopId:'0',
     //active: 0
  },


  clickItemToggeHide: function(e) {
    var that = this
    that.setData({
      ishide: !that.data.ishide
    });
  },

  animate: function() {
    var width = this.data.width
    console.log(width)
    var animation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 300,
      timingFunction: 'ease',
      delay: 0
    })
    this.animation = animation
    animation.translateX(width).step()
    this.setData({
      animation: animation.export()
    })
  },


  tea_goods_show() {
    var that = this
    tea_goods_show({
      shop_id: app.globalData.shop_id
    }).then((res) => {
      console.log(res, 4544444)
      // res.data.goods.forEach(function(items) {
      //   items.goods.forEach(function(item) {
      //     var spec_count = []
      //     for (var i = 0; i < item.goods_price.length; i++) {
      //       spec_count.push(0)
      //     }
      //     item.Count = 0
      //     item.spec_count = spec_count
      //   })
      // })
      var listChild1 = res.data.goods;
      console.log(listChild1, "4556555555555")
      var names = ""
      for (var item in listChild1) {
        names += ":" + item;
        var height = (listChild1[item].length - 1) * this.data.right_contentHeight;

        this.data.listHeight += ":" + height;
      }

      that.setData({
        goods: listChild1,
        //good: res.data.goods
        listHeight: this.data.listHeight
      })
      var names = names.substring(1).split(':');
      this.setData({
        names: names
      })
    })
  },


  toGoodsinfo(e) {
    wx.navigateTo({
      url: '/pages/shoppages/goods/goods?goods_id=' + e.currentTarget.dataset.goods_id + '&shop_id=' + this.data.shop_id,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.tea_goods_show()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth
        })
      }
    })
  },



  // 右侧滑栏的 bindscroll 事件函数（ES6写法）
  scroll(event) {
    // 把 listHeight 切割成数组
    var height = this.data.listHeight.substring(1).split(':');
    // 定义一个 index 供左侧边栏联动使用
    var index = 1;
    var num = 0;
    for (var i = 0; i < height.length; i++) {
      // 累计右侧滑栏滚动上去的每一个分类的 Height
      num += parseInt(height[i]);
      // 循环判断 num 是否大于右侧滑栏滚动上去的 Height ，然后 get 到 i 值赋给 index
      if (num > event.detail.scrollTop) {
        index = i + 1;
        // 如果右侧滑栏滚动高度小于单个类别高度的 1/2 时，index 为 0
        if (event.detail.scrollTop < height[0] / 2) {
          index = 0;
        }
        break;
      }
    }
    // 定义并设置左侧边栏的滚动高度
    var left_scrollTop = this.data.left_titleHeight * index
    this.setData({
      scrollTop: left_scrollTop,
      // 动态给左侧滑栏传递对应该项的 id，用于高亮效果显示
      curNav: this.data.names[index]
    })
  },

  //点击左侧 tab ，右侧列表相应位置联动 置顶
  switchRightTab: function(e) {
    console.log(e,"6666666")
    var that = this
    var id = e.target.id;
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      scrollTopId: id,
      idx: index,
      // 左侧点击类样式
    //  curNav: id,
      ishide: !that.data.ishide
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
          winHeight: res.windowHeight,
          right_titleHeight: Number(right_titleRpxHeight * percent),
          right_contentHeight: Number(right_contentRpxHeight * percent),
          left_titleHeight: Number(left_titleRpxHeight * percent)
        })
      }
    })




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