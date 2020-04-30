// pages/mine/refundapply/refundapply.js
import { newRefund, receive, addAftermarketService, upAftermarketOrder,print_pro} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:'',
    is_shop:false,
    statu:0,
    type_name: '',
    type_choose_button: true,
    refund_type: 1,
    statu_choose_button: true,
    filelist: [],
    files: [],
    hide_add: false,
    refund_money: '',
    order_money: '',
    reason: '',
    i: 0,
    order_id: '',
    file_data: [],
    disable: false,
    backgroundColor: app.globalData.selectedColor
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  contact: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.cs_phone
    })
  },
  contact_user(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  receive_order(){
    
  },
  //同意处理售后
  agree_submit(){
    var that=this
    upAftermarketOrder({
      type:'agree',
      user_id:app.globalData.userid,
      shop_id:app.globalData.shop_id,
      //shop_id:234,
      order_id:that.data.order_id
    }).then(res=>{
      console.log(res,'444')
      if(res.error_code==1000){
        var goods_pre = []
        for (var i = 0; i < that.data.goodslists.length; i++) {
          var item = that.data.goodslists[i]
          goods_pre.push({
            goods_name: item.goodsname,
            goods_price: item.goodsprice,
            goods_num: item.goodsnum,
            goods_cost: parseFloat(item.goodsprice) * item.goodsnum,
            key_name: '常规',
          })
        }
        //console.log(total_money,'ttttt')
        print_pro({
          order_id: that.data.order_id,
          order_type: that.data.order_type,
          shop_id: app.globalData.shop_id,
          shop_name: app.globalData.shop_name,
          shop_phone: app.globalData.shop_phone,
          goods: goods_pre,
          service:that.data.reason,
          pay_price: that.data.allcost,
          num: that.data.goodslists.length,
          name: that.data.receiver,
          address: that.data.address,
          phone: that.data.phone,
          message: ''
        }).then(res => { })
        wx.showLoading({
          title: '已同意处理',
        })
        setTimeout(function(){
          wx.hideLoading()
          wx.navigateBack({
            delta: 1,
          })
        },500)
      }
    })
  },
  //预览图片
  topreview: function (e) {
    var src = e.currentTarget.dataset.src;
    var imgList = e.currentTarget.dataset.discuss_img;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //拒绝处理售后
  refuse_submit() {
    var that = this
    upAftermarketOrder({
      type: 'refuse',
      user_id: app.globalData.userid,
      shop_id: app.globalData.shop_id,
      order_id: that.data.order_id
    }).then(res => {
      if(res.error_code==1000){
        wx.showLoading({
          title: '已拒绝处理',
        })
        setTimeout(function(){
          wx.hideLoading()
          wx.navigateBack({
            delta: 1,
          })
        },500)
      }
    })
  },
  to_choose() {
    var that = this
    if (that.data.type_choose_button == true) {
      that.setData({
        type_choose_button: false
      })
    } else if (that.data.type_choose_button == false) {
      that.setData({
        type_choose_button: true
      })
    }

  },
  // choose_statu(e) {
 
  //   var that = this
  //   that.setData({
  //     statu_choose_button: true,
  //     statu: e.currentTarget.dataset.type
  //   })
  // },
  // choose_type(e) {
  //   var that = this
  //   that.setData({
  //     type_choose_button: true,
  //     refund_type: e.currentTarget.dataset.type,
  //   })
  // },
  to_choose_statu() {
    var that = this
    if (that.data.statu_choose_button == true) {
      that.setData({
        statu_choose_button: false
      })
    } else if (that.data.statu_choose_button == false) {
      that.setData({
        statu_choose_button: true
      })
    }
  },
  money_input(e) {
    var that = this
    that.data.refund_money = e.detail.value
  },
  reason_input(e) {
    var that = this
    that.setData({
      reason: e.detail.value
    })
  },
  to_upload() {
    var that = this
    that.data.filelist = that.data.files
    wx.chooseImage({
      count: 3,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          filelist: that.data.filelist.concat(res.tempFilePaths)
        });
        if (that.data.filelist.length > 3) {
          wx.showLoading({
            title: '不能超过3张',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        } else {
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          })
          if (that.data.files.length > 2) {
            that.setData({
              hide_add: true
            })
          }
        }
      }
    })
  },
  showdetail(id,user_id){
    var that=this
  addAftermarketService({
    user_id: user_id,
    order_id:id,
    type: 0,
    shop_id: app.globalData.shop_id,
    //shop_id:234
    }).then((res) => {
      if(res.error_code==1000){
        var goods=res.data.goodsOrder
        var goodslists=[]
        var allcost=0
        for(var i=0;i<goods.length;i++){
        goodslists.push({
          goodscost: goods[i].goods_cost,
          goodsimg: goods[i].goods_img,
          goodsname: goods[i].goods_name,
          goodsnum: goods[i].goods_num,
        })
        allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum)
        }
        that.data.order_id=res.data.marketService.order_id
        that.setData({
          goodslists: goodslists,
          allcost:allcost.toFixed(2),
          receiver:res.data.order.buyer,
          phone:res.data.order.phone,
          address:res.data.order.address,
          order_time:res.data.order.order_time,
          reason:res.data.marketService.extra,
          files:res.data.marketService.image.split(';'),
          status: res.data.marketService.status,
          cs_phone:res.data.shop.cs_phone,
          order_type:res.data.order.order_type
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.showdetail(options.order_id,options.user_id)
    if(options.type){
      that.setData({
        is_shop:true
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