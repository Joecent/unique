// pages/mine/addaddress/addaddress.js
import { add_address } from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItem: '全部',
    latitude: '',
    longitude: '',
    name: '',
    address: '选择所在位置',
    selected: 0,
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor
  },
  // bindaddinput(e) {
  //   var that = this
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   var addresslist = e.detail.value
  //   that.setData({
  //     address: addresslist[0] + addresslist[1] + addresslist[2]
  //   })
  // },

  /**
  * 选择所在位置
  */
  bindaddinput() {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        //console.log(res, '0000')
        var latitude = res.latitude
        var longitude = res.longitude
        var name = res.name
        var address = res.address
        that.setData({
          latitude: latitude,
          longitude: longitude,
          name: name,
          address: address,
          selected: 1
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
              success: function (tip) {
                if (tip.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data.authSetting["scope.userLocation"] === true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        //授权成功之后，再调用chooseLocation选择地方
                        wx.chooseLocation({
                          success: function (res) {
                            var latitude = res.latitude
                            var longitude = res.longitude
                            var name = res.name
                            var address = res.address
                            that.setData({
                              latitude: latitude,
                              longitude: longitude,
                              name: name,
                              address: address,
                              selected: 1
                            })
                          },
                        })
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
  /**
 * 点击添加收货地址
 */
  formSubmit(e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.receiver == "") {
      warn = "收货人不能为空";
    } else if (e.detail.value.phone == "") {
      warn = "手机号不能为空！";
    } else if (!(/^[1][0-9][0-9]{9}$/.test(e.detail.value.phone))) {
      warn = "手机号不正确";
    } else if (that.data.address == undefined || that.data.address == '选择所在位置') {
      warn = "位置不能为空";
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
      add_address({
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        address: that.data.address,
        detail: e.detail.value.detail,
        phone: e.detail.value.phone,
        receiver: e.detail.value.receiver,
        //user_id:app.globalData.userid
        user_id: store.get('user_id')

      }).then((response) => {
        if (response.error_code == 1000) {
          wx.showLoading({
            title: '添加成功',
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showModal({
            title: '提示',
            content: response.msg,
            showCancel: false,
          })
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
      address: '选择所在位置',
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