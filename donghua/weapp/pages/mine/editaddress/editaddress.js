// pages/mine/editaddress/editaddress.js
import * as store from '../../../utils/store.js';
import { update_address } from '../../../utils/api.js';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiver: '',
    detail: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    address_id: '',
    name: '',
    customItem: '全部',
// region: ['全部', '全部', '全部'],
  },

  /**
    * 选择所在位置
    */
  bindaddinput(e) {
 var that=this
      console.log('picker发送选择改变，携带值为', e.detail.value)
    var addresslist = e.detail.value
      that.setData({
        address: addresslist[0] + addresslist[1] + addresslist[2]
      })

    // var that = this
    // wx.chooseLocation({
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     var name = res.name
    //     var address = res.address
    //     that.setData({
    //       latitude: latitude,
    //       longitude: longitude,
    //       name: name,
    //       address: address
    //     })
    //   },
    // })
  },
  /**
   * 提交保存
   */
  formSubmit(e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.receiver == "") {
      warn = "收货人不能为空";
    } else if (e.detail.value.phone == "") {
      warn = "手机号码不能为空！";
    } else if (!(/^[1][0-9][0-9]{9}$/.test(e.detail.value.phone))) {
      warn = "手机号格式不正确";
    } else if (that.data.address == undefined || that.data.address == '选择所在位置') {
      warn = "所在位置不能为空";
    } else {
      flag = false;
    }
    if (flag == true) {
      wx.showLoading({
        title: warn,
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    } else {
      update_address({
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        address: that.data.address,
        detail: e.detail.value.detail,
        phone: e.detail.value.phone,
        receiver: e.detail.value.receiver,
        address_id: that.data.address_id
      }).then((response) => {
        if (response.error_code == 1000) {
          wx.showLoading({
            title: '修改成功',
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showLoading({
            title: '修改失败',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bar: app.globalData.barHeight,
      receiver: store.get('editaddress').receiver,
      phone: store.get('editaddress').phone,
      address: store.get('editaddress').address,
      detail: store.get('editaddress').detail,
      latitude: store.get('editaddress').latitude,
      longitude: store.get('editaddress').longitude,
      address_id: store.get('editaddress').id,
      backgroundColor: app.globalData.selectedColor,
    })
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