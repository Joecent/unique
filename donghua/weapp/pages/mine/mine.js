// pages/mine/mine.js
import {
  // wx_group_info,
  // get_groupApply,
  isUserInfo,
  auth,
  user_info,
  admin_shop_info,
  addShopCard
  // get_goods
} from '../../utils/api.js'
import * as store from '../../utils/store.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone:'13601624592',
    owner:false,
    sender:false,
    seller:false,
    changeStatus: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor,
    mineColor: app.globalData.selectedColor
  },
  toIndex: function() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  tomycoupon(){
    wx.navigateTo({
      url: '/pages/mine/mycoupon/mycoupon',
    })
  },
  tocoupon(){
    wx.navigateTo({
      url: '/pages/mine/coupon/coupon',
    })
  },
  toGoNext(){
    wx.navigateTo({
      url: '/pages/mine/withdraw/withdraw',
    })
  },
  calltokf: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  toshop(){
    wx.navigateTo({
      url: '/pages/mine/withdraw/withdraw',
    })
  },
  toshopservice(){
    wx.navigateTo({
      url: '/pages/mine/refundlist/refundlist',
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
            addShopCard({ user_id: response.data.user_id, shop_id: app.globalData.shop_id }).then(res => {
              
            })
             that.user_info()
          } else if (response.error_code == 1001) {
            wx.showLoading({
              title: '登录失败',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
          }
        })
      }
    })
  },
  tosend(){
    wx.navigateTo({
      url: '/pages/mine/dispatching/dispatching',
    })
  },
  user_info() {
    var that = this
    wx.getUserInfo({
      success(res) {
        that.setData({
          avatar: res.userInfo.avatarUrl,
          name: res.userInfo.nickName
        })
      }
    })
    isUserInfo({
      user_id: app.globalData.userid,
      shop_id:app.globalData.shop_id,
    }).then(res=>{
      if(res.error_code==1000){
        res.data.forEach(function(item){
          if(item.type==1){
            that.setData({
              owner: true
            })
          }
          if(item.type==0){
            that.setData({
              sender: true
            })
          }
          if(item.type==2){
            app.globalData.seller=app.globalData.userid
            that.setData({
              seller: true
            })
          }
        })
      }
    })
    admin_shop_info({
      shop_id:app.globalData.shop_id
    }).then(res=>{
      that.setData({
        phone:res.data.cs_phone
      })
    })
  },
  //联系客服
  toPhone() {
    wx.navigateTo({
      url: 'applyFor/applyFor',
    })
  },
  //添加地址
  toaddress() {
    wx.navigateTo({
      url: '/pages/mine/address/address',
    })
  },
  tonotpay(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },

  tonotpost(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },
  tonotreceive(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },
  toservice(e) {
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderlist?bindid=' + e.currentTarget.dataset.bindid,
    })
  },
  toApplyFor() {
    wx.navigateTo({
      url: '/pages/mine/instructions/instructions',
    })
  },
  //开团
  // toGoNext(e) {
  //   get_groupApply({
  //     shop_id: app.globalData.shop_id,
  //     user_id: store.get('user_id')
  //   }).then((response) => {
  //     if (response.data.status == 1) {
  //       if (response.data.verify_status == 1) {
  //         wx.navigateTo({
  //           url: 'distribution/distribution'
  //         })
  //       } else {
  //         wx.navigateTo({
  //           url: 'applyForResult/applyForResult'
  //         })
  //       }
  //     } else {
  //       wx.navigateTo({
  //         url: 'applyForResult/applyForResult',
  //       })
  //     }
  //   })
  // },

  // getConfig: function() {
  //   get_groupApply({
  //     shop_id: app.globalData.shop_id,
  //     user_id: store.get('user_id')
  //   }).then((response) => {

  //     if (response.data == '') {

  //       this.setData({
  //         changeStatus: false
  //       })
  //     } else {

  //       this.setData({
  //         changeStatus: true
  //       })

  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (!store.get('user_id')||app.globalData.userid==0) {
      that.setData({
        showLoad: true
      })
    }
    that.user_info()
    // that.getConfig()

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
    // that.setData({
    //   backgroundColor: app.globalData.selectedColor,
    //   mineColor: app.globalData.selectedColor,
    // })
    if (!store.get('user_id')) {
      that.setData({
        showLoad: true
      })
    }
    that.user_info()
    // that.getConfig()
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