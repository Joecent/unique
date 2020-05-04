// pages/ss/ss.js

import {
  tea_goods_show,
  add_shopcart
} from '../../utils/api.js'
import * as store from '../../utils/store.js'
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp()

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     shop_id: '144',
//     showView: true,
//   },


//   showButton: function () {
//     var that = this;
//     that.setData({
//       showView: (!that.data.showView)
//     })

// },


//   addCart(e){
//     console.log(e,"145")
//   },


//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     tea_goods_show({
//       shop_id: app.globalData.shop_id
//     }).then((res) => {
//       this.data.constants = res.data.goods
//       this.setData({
//         constants: res.data.goods,
//       })
//     })
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })



Page({ /** * 页面的初始数据 */
  data: {
    arrayData: null,
    dialogData: null,
    isDialogShow: false,
    isScroll: true
  },
  /** * 生命周期函数--监听页面加载 */
  onLoad: function(options) {
    //构建测试数据 
    let data = new Array();
    let dialog = new Array();
    for (let i = 0; i < 25; i++) {
      data[i] = '我是测试-----------' + i;
      dialog[i] = {
        name: '我是弹窗-' + i,
        isSelected: false
      };
    }
    this.setData({
      arrayData: data,
      dialogData: dialog
    });
  },
  /** * 显示、关闭弹窗 */
  showDialog: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    console.log('currentStatu:', currentStatu);
    //关闭 
    if (currentStatu == "close") {
      this.setData({
        isDialogShow: false,
        isScroll: true
      });
    }
    // 显示 
    if (currentStatu == "open") {
      this.setData({
        isDialogShow: true,
        isScroll: false
      });
    }
  },
})