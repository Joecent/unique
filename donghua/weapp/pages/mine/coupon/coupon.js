import { usable_cash, disable_cash, create_qrcode} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    coupons:[],
    winHeight:0,
    coupon_num:0,
    image:'',
    backgroundColor: '#FF5D35'
  },
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },
  swichNav(e){
    var that=this
    if(that.data.currentTab==e.currentTarget.dataset.current){
      return false;
    }else {
      that.setData(({
        currentTab:e.currentTarget.dataset.current
      }))
    }
  },
  show_useable(){
    var that = this
    usable_cash({user_id:store.get('user_id')}).then((res)=>{
      if(res.data!=''){
      that.setData({
        coupons:res.data,
        winHeight:res.data.length * 112,
        coupon_num: 1
        })
      }else{
        that.setData({
          coupons:'',
          coupon_num:0
        })
      }
    })
  },
  show_unuseable(){
    var that = this
    disable_cash({
      user_id:store.get('user_id')
    }).then((res)=>{
      if(res.data!=''){
      that.setData({
        coupons:res.data,
        winHeight: res.data.length * 112,
        coupon_num:1
      })
      } else {
        that.setData({
          coupons: '',
          coupon_num: 0
        })
      }
    })
  },
  bindchange(e){
    var that=this
    that.setData({
      currentTab:e.detail.current
    })
    if(that.data.currentTab==0){
      that.show_useable()
    }else if(that.data.currentTab==1){
      that.show_unuseable()
    }
  },
  touse(e){
    wx.reLaunch({
      url: '/pages/index/index?shop_id=' + e.currentTarget.dataset.shop_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      bar:app.globalData.barHeight
    })
    that.show_useable()
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
    this.show_useable()
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