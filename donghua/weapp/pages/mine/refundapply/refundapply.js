// pages/mine/refundapply/refundapply.js
import { refund } from '../../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu:3,
    type_name: '',
    type_choose_button: true,
    refund_type: '',
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
    disable: false
  },
  back() {
    wx.navigateBack({
      delta: 1,
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
  choose_statu(e) {
 
    var that = this
    that.setData({
      statu_choose_button: true,
      statu: e.currentTarget.dataset.type
    })
  },
  choose_type(e) {
    var that = this
    that.setData({
      type_choose_button: true,
      refund_type: e.currentTarget.dataset.type,
    })
  },
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


  refund_submit() {
    var that = this
    that.setData({ disable: true })
    function upload() {
      var p = new Promise(function up(resolve) {
        if (that.data.files.length != 0) {
          wx.uploadFile({
            url: 'https://www.linwushop.com/upload_img',
            filePath: that.data.files[that.data.i],
            name: 'file',
            success: function (res) {
              var data = JSON.parse(res.data)
              if (data.error_code == 1000) {
                that.data.file_data.push(data.data.img_url)
                that.data.i++
                if (that.data.i == that.data.files.length) {
                  that.data.flag = true
                  resolve(that.data.flag)
                } else if (that.data.i < that.data.files.length) {
                  up(resolve)
                }
              } else if (data.error_code == 1002) {
                that.data.flag = true
                resolve(that.data.flag)
              } else if (data.error_code == 1003) {
                that.data.flag = false
                wx.showLoading({
                  title: '图片过大',
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 500)
              }

            },
            fail: function () {
              resolve(false)
            }

          })
        } else {
          that.data.file_data = []
          that.data.flag = true
          resolve(that.data.flag)
        }
      })
      return p
    }

    
    upload().then(function (res) {
      console.log(res)
      var flag = true
      if (that.data.refund_money > that.data.order_money) {
        wx.showLoading({
          title: '退款金额过大',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else if (that.data.refund_type == ''){
        wx.showLoading({
          title: '退款类型必填',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else if (that.data.statu == 3) {
        wx.showLoading({
          title: '收货状态必填',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else if (that.data.reason == '') {
        wx.showLoading({
          title: '退货原因必填',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        flag = false
      }
      if (res == true && flag == false) {
        refund({
          user_id: app.globalData.userid,
          order_id: that.data.order_id,
          refund_type: that.data.refund_type,
          receive_status: that.data.statu,
          refund_money: that.data.refund_money,
          refund_desc: that.data.reason,
          refund_photo: that.data.file_data.join(',')
        }).then((res) => {
          if (res.error_code == 1000) {
            wx.showLoading({
              title: '提交成功',
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.navigateTo({
                url: '/pages/mine/refund/refund',
              })
            }, 500)
          }
        })
      } else {
        that.setData({ disable: false })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.order_id = options.order_id
    that.data.order_money = options.order_money
    that.setData({
      bar: app.globalData.barHeight,
      refund_money: options.order_money,
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