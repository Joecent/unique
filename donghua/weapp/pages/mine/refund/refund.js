import { refund_order, cancel_refund } from '../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    winHeight: 1000,
    refund_handling: [],
    refund_finish: [],
    none: false,
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  swichNav(e) {
    var that = this
    if (e.currentTarget.dataset.current == that.data.currentTab) {
      return false
    } else {
      if (e.currentTarget.dataset.current == 0 && that.data.refund_handling.length > 0) {
        that.setData({
          none: true
        })
      } else if (e.currentTarget.dataset.current == 0 && that.data.refund_finish.length == 0) {
        that.setData({
          none: false
        })
      } else if (e.currentTarget.dataset.current == 1 && that.data.refund_finish.length > 0) {
        that.setData({
          none: true
        })
      } else if (e.currentTarget.dataset.current == 1 && that.data.refund_finish.length == 0) {
        that.setData({
          none: false
        })
      }
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  tosee() {
    wx.navigateTo({
      url: '',
    })
  },
  discard(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认取消退款？',
      success: function (res) {
        if (res.confirm) {
          cancel_refund({
            refund_sn: e.currentTarget.dataset.refund_sn
          }).then((res) => {
            if (res.error_code == 1000) {
              wx.showLoading({
                title: '取消成功',
              })
              setTimeout(function () {
                wx.hideLoading()
                that.show_refund()
              }, 500)
            } else {
              wx.showLoading({
                title: '取消退款失败',
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            }
          })
        }
      }
    })
  },
  show_refund() {
    var that = this
    var list = []
    var finish_list = []
    refund_order({ user_id: app.globalData.userid }).then((res) => {
      if (res.error_code == 1000) {
        res.data.forEach(function (item) {
          if (item.refund_status == 0 || item.refund_status == 1 || item.refund_status == 2) {
            list.push(item)
            console.log(list,'1111')
          } else if (item.refund_status == 3 || item.refund_status == 4) {
            finish_list.push(item)
          }
        })
      } else if (res.error_code == 1001) {
        that.setData({
          none: false
        })
      }
    }).then(() => {
      var length_pre = ''
      if (list.length != 0) {
        that.setData({
          none: true
        })
      }
      if (list.length >= finish_list.length) {
        length_pre = list.length
      } else if (finish_list < list.length) {
        length_pre = finish_list.length
      }
      that.setData({
        winHeight: length_pre * 370,
        refund_handling: list,
        refund_finish: finish_list
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      bar: app.globalData.barHeight,
      backgroundColor: app.globalData.selectedColor,
    })
    that.show_refund()
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