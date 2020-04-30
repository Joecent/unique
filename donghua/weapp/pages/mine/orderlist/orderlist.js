// pages/mine/orderlist/orderlist.js

import {
  refuse_group,
  finish,
  receive,
  wait,
  confirmGroups,
  aftermarketOrder
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    waitGrouplist: [],
    finshGrouplist: [],
    refuseGrouplist: [],
    order_num: 0,
    alreadyGrouplist: [],
    goods_id: '',
    page: 1,
    loadall: true,
    limit: 5,
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor
  },
  //联系商家
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.shop_phone,
    })
  },
  //申请售后
  offer(e){
    console.log(e.currentTarget.dataset.items,'4')
    store.set('order_detail', e.currentTarget.dataset.items)
      wx.navigateTo({
        url: '/pages/mine/refundapply/refundapply',
      })
  },
  //查看售后详情
  serviceinfo(e){
    wx.navigateTo({
      url: '/pages/mine/refunddetail/refunddetail?order_id='+e.currentTarget.dataset.order_id+'&user_id='+e.currentTarget.dataset.user_id,
    })
  },
  //确认收货
  sureConfirm: function (e) {
    console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    confirmGroups({
      order_id: e.currentTarget.dataset.order_id,
    }).then((res) => {
      wx.hideLoading()
      if (res.error_code == "1000") {
        var change_id = e.currentTarget.dataset.order_id
        var alreadyGrouplist = that.data.alreadyGrouplist
        for (var i = 0; i < alreadyGrouplist.length; i++) {
            if (alreadyGrouplist[i].order_id == change_id) {
              alreadyGrouplist[i].shipping_status = 2
          }
        }
        that.setData({
          alreadyGrouplist: alreadyGrouplist
        })
        wx.showLoading({
          title: res.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      } else {
        wx.showLoading({
          title: res.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })
  },
  //查看详情
  seebtn: function(e) {
    console.log(e)
    var groupdetail = JSON.stringify(e.currentTarget.dataset.items)
    // store.set('', e.currentTarget.dataset.items)
    wx.navigateTo({
      url: '/pages/mine/orderlist/orderdetails/orderdetails?groupdetail=' + groupdetail
    })
  },
 

  // getTimes() {
  //   var that = this
  //   var timer = null;

  //   timer = setInterval(function() {
  //     var waitGrouplist = that.data.waitGrouplist
  //     var length = waitGrouplist.length
  //     for (var i = 0; i < length; i++) {
  //       if (waitGrouplist[i].group_time > 0) {
  //         waitGrouplist[i].group_time -= 1
  //         let t = waitGrouplist[i].group_time * 1000
  //         if (t > 0) {
  //           let d = Math.floor(t / 86400000)
  //           let h = Math.floor((t / 3600000) % 24)
  //           let m = Math.floor((t / 60000) % 60)
  //           let s = Math.floor((t / 1000) % 60)
  //           d = d < 10 ? '0' + d : d
  //           h = h < 10 ? '0' + h : h
  //           m = m < 10 ? '0' + m : m
  //           s = s < 10 ? '0' + s : s
  //           let countdown = d + "天" + h + "小时" + m + "分钟" + s + "秒"
  //           waitGrouplist[i].groups_time = countdown

  //         } else {
  //           let flag = waitGrouplist.every((val, ind) =>
  //             val.group_time <= 0)
  //           if (flag) clearInterval(timer)
  //           waitGrouplist[i].groups_time = '拼团已结束'
  //           //  that.show()
  //         }
  //       }
  //     }
  //     that.setData({
  //       waitGrouplist: waitGrouplist
  //     })
  //   }, 1000);
  // },
  // refund: function(e) {
  //   wx.navigateTo({
  //     url: '/pages/mine/refundapply/refundapply?order_id=' + e.currentTarget.dataset.order_id + '&order_money=' + e.currentTarget.dataset.group_price,
  //   })
  // },

  swichNav(e) {
    var that = this
    if (that.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
    that.show()
  },

  /**
   * 正在拼
   */
  waitGroup() {
    wx.showLoading({
      title: '加载中',
      mask: false,
    })
    var that = this
    wait({
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id,
      page: that.data.page,
      limit: that.data.limit
    }).then((res) => {
      wx.hideLoading()
      if (res.data != '') {
        that.setData({
          waitGrouplist: res.data,
          // totalPage: res.data.totalPage,
          order_num: 1,
        })
        // that.getTimes(that.data.waitGrouplist)

      } else {
        that.setData({
          order_num: 0,
          waitGrouplist:[],
        })
      }

    })
  },

  /**
   * 配送中
   */
  alreadyGroup() {
    wx.showLoading({
      title: '加载中',
      mask: false,
    })
    var that = this
    receive({
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id,
      page: that.data.page,
      limit: that.data.limit
    }).then((res) => {
      wx.hideLoading()
      if (res.data != '') {
        that.setData({
          order_num: 1,
          alreadyGrouplist: res.data,
          // totalPage: res.data.totalPage
        })
      } else {
        that.setData({
          order_num: 0,
          alreadyGrouplist:[],
        })
      }

    })
  },

  /**
   * 已完成
   */
  finshGroup() {
    wx.showLoading({
      title: '加载中',
      mask: false,
    })
    var that = this
    finish({
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id,
      page: that.data.page,
      limit: that.data.limit
    }).then((res) => {
      wx.hideLoading()
      if (res.data != '') {
        that.setData({
          finshGrouplist: res.data,
          // totalPage: res.data.totalPage,
          order_num: 1
        })
      } else {
        that.setData({
          order_num: 0,
          finshGrouplist:[],
        })
      }

    })
  },
  /**
   * 售后
   */
  service(){
    wx.showLoading({
      title: '加载中',
      mask: false,
    })
    var that = this
    aftermarketOrder({
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id,
      page: that.data.page,
    }).then((res) => {
      wx.hideLoading()
      if (res.data.goodsOrder != '') {
        that.setData({
          serviceList: res.data.goodsOrder,
          // totalPage: res.data.totalPage,
          order_num: 1
        })
      } else {
        that.setData({
          order_num: 0,
          finshGrouplist: [],
        })
      }

    })
  },
  bindChange(e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    })
    that.show()
  },

  show() {
    var that = this
    that.setData({
      page: 1,
      loadall: true
    })
    if (that.data.currentTab == 0) {
      that.waitGroup()
    } else if (that.data.currentTab == 1) {
      that.alreadyGroup()
    } else if (that.data.currentTab == 2) {
      that.finshGroup()
    } else if (that.data.currentTab == 3) {
      that.service()
    }
    
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    that.setData({
      currentTab: options.bindid,
    })

    const promise = new Promise(function(resolve, reject) {
      if (that.show()) {
        resolve(value);
      }
    });
    // promise.then(that.getTimes())
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
    console.log('加载')
    wx.showLoading({
      title: '加载中',
      mask: false,
    })
    var that = this
    // if (that.data.page < that.data.totalPage) {
    if (that.data.currentTab == 0) {
      //待成团
      wait({
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        page: that.data.page + 1,
        limit: that.data.limit
      }).then((res) => {
        wx.hideLoading()
        if (res.data != '') {
          var grouplist = that.data.waitGrouplist
          for (var i = 0; i < res.data.length; i++) {
            grouplist.push(res.data[i])
          }
          that.setData({
            waitGrouplist: grouplist,
            // totalPage: res.data.totalPage,
            page: that.data.page + 1,
          })
        } else {
          that.setData({
            loadall: false
          })
        }
      })
    } else if (that.data.currentTab == 1) {
      //配送中
      receive({
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        page: that.data.page + 1,
        limit: that.data.limit
      }).then((res) => {
        wx.hideLoading()
        if (res.data != '') {
          var grouplist = that.data.alreadyGrouplist
          for (var i = 0; i < res.data.length; i++) {
            grouplist.push(res.data[i])
          }
          that.setData({
            alreadyGrouplist: grouplist,
            // totalPage: res.data.totalPage,
            page: that.data.page + 1
          })
        } else {
          that.setData({
            loadall: false
          })
        }

      })
    } else if (that.data.currentTab == 2) {
      //已完成
      finish({
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        page: that.data.page + 1,
        limit: that.data.limit
      }).then((res) => {
        wx.hideLoading()
        var grouplist = that.data.finshGrouplist
        for (var i = 0; i < res.data.length; i++) {
          grouplist.push(res.data[i])
        }
        if (res.data != '') {
          that.setData({
            finshGrouplist: grouplist,
            // totalPage: res.data.totalPage,
            page: that.data.page + 1
          })
        } else {
          that.setData({
            loadall: false
          })
        }
      })
    } else if (that.data.currentTab == 3) {
      //售后
      aftermarketOrder({
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        page: that.data.page + 1,
        limit: that.data.limit
      }).then((res) => {
        wx.hideLoading()
        var grouplist = that.data.serviceList
        for (var i = 0; i < res.data.length; i++) {
          grouplist.push(res.data[i])
        }
        if (res.data != '') {
          that.setData({
            serviceList: grouplist,
            // totalPage: res.data.totalPage,
            page: that.data.page + 1
          })
        } else {
          that.setData({
            loadall: false
          })
        }
      })
    }
    // } else {
    //   wx.hideLoading()
    //   that.setData({
    //     loadall: false
    //   })
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})