// pages/mine/refundapply/refundapply.js
import { newRefund, receive, addAftermarketService} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    shop_id:'',
    file_data: [],
    disable: false
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  receive_order(){
    
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


  refund_submit() {
    var that = this
    that.setData({ disable: true })
    function upload() {
      var p = new Promise(function up(resolve) {
        if (that.data.files.length != 0) {
          wx.uploadFile({
            url: 'https://www.linwushop.com/api/upload_img',
            filePath: that.data.files[that.data.i],
            name: 'file',
            success: function (res) {
              console.log(res.data,'tttt')
              var data = JSON.parse(res.data)
              console.log(res.data,'4444')
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
      // if (that.data.refund_money > that.data.order_money) {
      //   wx.showLoading({
      //     title: '退款金额过大',
      //   })
      //   setTimeout(function () {
      //     wx.hideLoading()
      //   }, 500)
      // } else if (that.data.refund_type == ''){
      //   wx.showLoading({
      //     title: '退款类型必填',
      //   })
      //   setTimeout(function () {
      //     wx.hideLoading()
      //   }, 500)
      if (that.data.reason == '') {
        wx.showLoading({
          title: '售后详情必填',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else if (that.data.file_data == '') {
        wx.showLoading({
          title: '请上传照片',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        flag = false
      }
      if (res == true && flag == false) {
        //console.log(app.globalData.userid,'888')
        addAftermarketService({
          user_id: app.globalData.userid,
          order_id: that.data.order_id,
          type: 1,
          shop_id:that.data.shop_id,
          extra: that.data.reason,
          image: that.data.file_data.join(';'),
        }).then((res) => {
          if (res.error_code == 1000) {
            wx.showLoading({
              title: '提交成功',
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.redirectTo({
                url: '/pages/mine/orderlist/orderlist?bindid=' + '3',
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
    //console.log(store.get('order_detail'),'444')
    var that = this
    var order=store.get('order_detail')
    var goodslists=[]
    var allcost = 0
    for (var i = 0; i < order.goodscost.length; i++) {
      // allcost = allcost + parseFloat(res.data[0].goodscost[i])
      goodslists.push({
        goodscost: order.goodscost[i],
        goodsimg: order.goodsimg[i],
        goodsname: order.goodsname[i],
        goodsnum: order.goodsnum[i],
        keyname: order.key_name[i]
      })
      allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum)
    }
    that.data.order_id = order.order_id
    that.data.shop_id = order.shop_id
    that.setData({
      allcost: allcost.toFixed(2),
      goodslists: goodslists,
      receiver:order.buyer,
      phone:order.phone,
      address:order.address+order.detail,
      order_time:order.order_time,
      bar: app.globalData.barHeight,
     // refund_money: options.order_money,
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