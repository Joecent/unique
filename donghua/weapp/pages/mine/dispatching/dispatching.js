// pages/mine/distribution/dispatching/dispatching.js
import {
  sendConfirmGroupMessage,
  searchGroup,
  confirmGroup,
  getGroupPhone,
  getDistriBution,
  searchGroupBuilk,
  searchGroupBuilkMessage,
  print_pro,
  newWaitOrder,
  dada_index,
  dada_cancel,
  redada_index,
  get_dada_status
} from '../../../utils/api.js';
import * as store from '../../../utils/store.js'
var util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate:'',
    endDate:'',
    startTime:'00:00',
    endTime:'00:00',
    onenoticetatus:false,
    onesurestatus:false,
    surestatus:false,
    noticetatus:false,
    searchName: '',
    loadall: true,
    page: 1,
    orderInfo:false,
    order_list:[],
    backgroundColor: app.globalData.selectedColor,
  },
  callsend(e){
    console.log(e,'4444')
    var that=this
    wx.showLoading({
      title: '正在呼叫配送',
    })
    dada_index({
      shop_id:app.globalData.shop_id,
      order_id: e.currentTarget.dataset.order_id,
    }).then(res=>{
      if(res.error_code==1000){
        
        that.data.grouplist[e.currentTarget.dataset.idx].status=1
        wx.showLoading({
          title: res.msg,
        })
        setTimeout(function(){
          wx.hideLoading()
        },500)
      }
      that.setData({
        grouplist:that.data.grouplist
      })
    })
  },
  //取消订单
  canclesend(e){
    var that=this
    dada_cancel({
      shop_id:app.globalData.shop_id,
      order_id: e.currentTarget.dataset.order_id,
    }).then(res=>{
      if (res.error_code == 1000) {
        that.data.grouplist[e.currentTarget.dataset.idx].status = 5
      }
      that.setData({
        grouplist: that.data.grouplist
      })
    })
  },
  //重新下单
  recallsend(e){
    var that=this
    var that = this
    wx.showLoading({
      title: '正在呼叫配送',
    })
    redada_index({
      shop_id: app.globalData.shop_id,
      order_id: e.currentTarget.dataset.order_id,
    }).then(res => {
      if (res.error_code == 1000) {
        wx.hideLoading()
        that.data.grouplist[e.currentTarget.dataset.idx].status = 1
      }
      that.setData({
        grouplist: that.data.grouplist
      })
    })
  },
  //联系骑手
  callsender(e){
    var that=this
    get_dada_status({
      shop_id:app.globalData.shop_id,
      order_id:e.currentTarget.dataset.order_id
    }).then(res=>{
      //console.log(res,'222')
      wx.makePhoneCall({
        phoneNumber: res.data.transporterPhone,
      })
    })
  },
  tocall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //选择开始日期
  bindstartDate(e){
    console.log('222')
    this.setData({
      startDate: e.detail.value
    })
  },
  //选择结束日期
  bindendDate(e) {
    console.log('222')
    this.setData({
      endDate: e.detail.value
    })
  },
  //选择开始时间
  bindstartTime(e){
    this.setData({
      startTime: e.detail.value
    })
  },
  //选择结束时间
  bindendTime(e){
    this.setData({
      endTime: e.detail.value
    })
  },
  //根据时间进行搜索
  searchBytime(){
    var that = this
    var flag=true
    if(that.data.startTime==''){
      wx.showLoading({
        title: '请输入开始时间',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    } else if (that.data.endTime == ''){
      wx.showLoading({
        title: '请输入结束时间',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }else {
      flag=false
    }
    if(flag==false){
    that.data.order_list=[]
    var timestart = that.data.startDate + ' ' + that.data.startTime + ':00'
    var timeend = that.data.endDate + ' ' + that.data.endTime + ':00'
    var starttime = new Date(timestart.replace(/-/g, "/")).getTime() / 1000
    var endtime = new Date(timeend.replace(/-/g, "/")).getTime() / 1000
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    getDistriBution({
      shop_id: app.globalData.shop_id,
      startTime:starttime,
      endTime:endtime,
      phone: '',
      //page: 1,
      //limit: 10000
    }).then((res) => {
      wx.hideLoading()
      if (res.data.data != '') {
        var grouplist = res.data.data
        for (var i = 0; i < grouplist.length; i++) {
          if (grouplist[i].phone_times==0){
            that.data.order_list.push(grouplist[i].order_id)
          }
        }
        that.setData({
          grouplist: grouplist,
          loadall: true,
          orderInfo: true,
          noticetatus: false
        })
        console.log(that.data.order_list, '222')
      } else {
        that.setData({
          loadall: true,
          grouplist: ''
        })
      }
    })
    }
  },
  //扫码
  scanOrder(){
    var that=this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: function(res) {
        console.log(res,'555')
        getDistriBution({
          shop_id: app.globalData.shop_id,
          order_rand_num:res.result
        }).then(res=>{
          if (res.data.data != '') {
            var grouplist = res.data.data
            for (var i = 0; i < grouplist.length; i++) {
              that.data.order_list.push(grouplist[i].order_id)
            }
            that.setData({
              grouplist: grouplist,
              loadall: true,
              orderInfo: true,
              noticetatus: false
            })
          } else {
            that.setData({
              loadall: true,
              grouplist: ''
            })
          }
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //一键通知
  onekeynotice: function() {
    var that = this
    wx.showLoading({
      title: '正在通知中',
      mask: true,
    })
    that.setData({
      noticetatus:true
    })
    // var grouplist = that.data.grouplist
    // var order_idlist = []
    // console.log(grouplist)
    // for (var a = 0; a < grouplist.length; a++) {
    //   for (var b = 0; b < grouplist[a].group.length; b++) {
    //     if (grouplist[a].group[b].tzstatus != 2 && grouplist[a].group[b].phone_times < 1) {
    //       console.log(grouplist[a].group[b].order_id)
    //       order_idlist.push(grouplist[a].group[b].order_id)
    //     }
    //   }
    // }
    // if(order_idlist.length>0){

    // }else{
    //   wx.showLoading({
    //     title: '已无可通知对象',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //   }, 1000)
    // }
    searchGroupBuilkMessage({
      //order_id: order_idlist
      order_id: that.data.order_list
    }).then((res) => {
      wx.hideLoading()
      var grouplist = that.data.grouplist
      if (res.msg == '发送通知成功') {
        wx.showLoading({
          title: '短信发送成功',
        })
        setTimeout(function(){
          wx.hideLoading()
        },500)
        that.setData({
          noticetatus:true
        })
      }else{
        wx.showLoading({
          title: '通知失败',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
      // if (res.msg == '发送通知成功') {
      //   for (var b = 0; b < order_idlist.length; b++) {
      //     var change_id = order_idlist[b]
      //     for (var i = 0; i < grouplist.length; i++) {
      //       for (var j = 0; j < grouplist[i].group.length; j++) {
      //         if (grouplist[i].group[j].order_id == change_id) {
      //           grouplist[i].group[j].tzstatus = 2
      //         }
      //       }
      //     }
      //   }
      //   that.setData({
      //     grouplist: grouplist,
      //     noticetatus:false
      //   })
      //   wx.showLoading({
      //     title: res.msg,
      //     mask:true,
      //   })
      //   setTimeout(function() {
      //     wx.hideLoading()
      //   }, 1000)
      // } else {
      //   that.setData({
      //     noticetatus: false
      //   })
      //   wx.showLoading({
      //     title: res.msg,
      //     mask: true,
      //   })
      //   setTimeout(function() {
      //     wx.hideLoading()
      //   }, 1000)
      // }
    })
  },
  //一键交货
  onekeysure: function() {
    wx.showLoading({
      title: '正在处理交货',
      mask: true,
    })
    var that = this
    that.setData({
      surestatus:true
    })
    var grouplistst = that.data.grouplist
    var order_idlist = []
    for (var a = 0; a < grouplistst.length; a++) {
      for (var b = 0; b < grouplistst[a].group.length; b++) {
        if (grouplistst[a].group[b].status != 2) {
          order_idlist.push(grouplistst[a].group[b].order_id)
        }
      }
    }
    searchGroupBuilk({
      order_id: order_idlist
    }).then((res) => {
      wx.hideLoading()
      var grouplist = that.data.grouplist
      if (res.msg == '确认收货成功') {
        for (var b = 0; b < order_idlist.length; b++) {
          var change_id = order_idlist[b]
          for (var i = 0; i < grouplist.length; i++) {
            for (var j = 0; j < grouplist[i].group.length; j++) {
              if (grouplist[i].group[j].order_id == change_id) {
                grouplist[i].group[j].status = 2
              }
            }
          }
        }
        that.setData({
          surestatus:false,
          grouplist: grouplist
        })
        wx.showLoading({
          title: res.msg,
          mask: true,
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      } else {
        that.setData({
          surestatus:false
        })
        wx.showLoading({
          title: res.msg,
          mask: true,
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      }

    })
  },
  //打印小票
  print(e){
    var that=this
    var item=e.currentTarget.dataset.items
    console.log(e.currentTarget.dataset,'ttt')
    var goods_pre =[]
    wx.showLoading({
      title: '正在出票',
    })
    for(var i=0;i<item.goods.length;i++){
    goods_pre.push({
      goods_name: item.goods[i].goods_name,
      goods_price: item.goods[i].goods_cost,
      goods_num: item.goods[i].goods_num,
      goods_cost: parseFloat(item.goods[i].goods_cost) * item.goods[i].goods_num,
      //key_name: item.goods[i].key_name,
    })
    }
    print_pro({
      order_id: item.order_id,
      order_type: item.order_type,
      shop_id: app.globalData.shop_id,
      shop_name: app.globalData.shop_name,
      shop_phone: app.globalData.shop_phone,
      goods: goods_pre,
      pay_price: item.total_money,
      num: item.goods.length,
      name: item.buyer,
      address: item.address,
      phone: item.phone,
      message: item.message
    }).then(res => { 
      wx.hideLoading()
      var grouplist = that.data.grouplist
      grouplist[e.currentTarget.dataset.idx].print_status = 1
      that.setData({
        grouplist: grouplist
      })
    })
  },
  //通知
  sendnote(e){
    var that=this
    wx.showLoading({
      title: '正在通知'
    })
    searchGroupBuilkMessage({
      order_id: [e.currentTarget.dataset.order_id]
    }).then((res) => {
      var grouplist = that.data.grouplist
      grouplist[e.currentTarget.dataset.idx].phone_times=2
      if (res.error_code==1000) {
        wx.hideLoading()
        that.setData({
          grouplist: grouplist
        })
      } else {
        wx.showLoading({
          title: '通知失败',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
    })
  },
  //通知
  // sendnote: function(e) {
  //   var that = this
  //   wx.showLoading({
  //     title: '正在通知中',
  //     mask: true,
  //   })
  //   that.setData({
  //     onenoticetatus:true
  //   })
  //   getGroupPhone({
  //     order_id: e.currentTarget.dataset.items.order_id,
  //   }).then((res) => {
  //     wx.hideLoading()
  //     if (res.status == 1) {
  //       sendConfirmGroupMessage({
  //         phone: res.phone,
  //         order_id: e.currentTarget.dataset.items.order_id,
  //       }).then((res) => {
  //         if (res.status == 0) {
  //           that.setData({
  //             onenoticetatus:false
  //           })
  //           wx.showLoading({
  //             title: res.msg,
  //             mask: true,
  //           })
  //           setTimeout(function() {
  //             wx.hideLoading()
  //           }, 1000)
  //         } else {
  //           var change_id = e.currentTarget.dataset.items.order_id
  //           var grouplist = that.data.grouplist
  //           for (var i = 0; i < grouplist.length; i++) {
  //             for (var j = 0; j < grouplist[i].group.length; j++) {
  //               if (grouplist[i].group[j].order_id == change_id) {
  //                 grouplist[i].group[j].tzstatus = 2
  //               }
  //             }
  //           }
  //           that.setData({
  //             grouplist: grouplist,
  //               onenoticetatus: false
  //           })
  //           wx.showLoading({
  //             title: '发送成功',
  //             mask: true,
  //           })
  //           setTimeout(function() {
  //             wx.hideLoading()
  //           }, 1000)
  //         }
  //       })
  //     }else{
  //       that.setData({
  //         onenoticetatus: false
  //       })
  //       wx.showLoading({
  //         title: res.msg,
  //         mask: true,
  //       })
  //       setTimeout(function () {
  //         wx.hideLoading()
  //       }, 1000)
  //     }
  //   })
  // },
  //确认收货
  sruetrue: function(e) {
    wx.showLoading({
      title: '正在处理交货',
      mask: true,
    })
    var that = this
    that.setData({
      onesurestatus:true
    })
    confirmGroup({
      order_id: e.currentTarget.dataset.items.order_id,
    }).then((res) => {
      wx.hideLoading()
      if (res.error_code == "1000") {
        var change_id = e.currentTarget.dataset.items.order_id
        var grouplist = that.data.grouplist
        for (var i = 0; i < grouplist.length; i++) {
          for (var j = 0; j < grouplist[i].group.length; j++) {
            if (grouplist[i].group[j].order_id == change_id) {
              grouplist[i].group[j].status = 2
            }
          }
        }
        that.setData({
          grouplist: grouplist,
          onesurestatus:false
        })
        wx.showLoading({
          title: res.msg,
          mask: true,
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      } else {
        that.setData({
          onesurestatus:false
        })
        wx.showLoading({
          title: res.msg,
          mask: true,
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      }
    })
  },
  //搜索
  search: function(e) {
    //console.log('111')
    this.setData({
      searchName: e.detail.value
    })
  },
  //根据名字或手机尾号查询
  tosearch: function(e) {
    var that = this
    that.data.order_list = []
    if (that.data.searchName==''){
      wx.showLoading({
        title: '请输入手机尾号或姓名',
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
    }else{
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    
    getDistriBution({
      shop_id: app.globalData.shop_id,
      phone: that.data.searchName,
    }).then((res) => {
      wx.hideLoading()
      if (res.data.data != '') {
        var grouplist = res.data.data
        for (var i = 0; i < grouplist.length; i++) {
          that.data.order_list.push(grouplist[i].order_id)
        }
        that.setData({
          grouplist: grouplist,
          loadall: true,
          orderInfo:true,
          noticetatus: false
        })
        //console.log(that.data.order_list,'222')
      } else {
        that.setData({
          loadall: true,
          grouplist: ''
        })
      }
    })
    }
  },
  //订单列表查询
  show(){
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    newWaitOrder({
      shop_id:app.globalData.shop_id,
      page:1,
      order_type:0
    }).then(res=>{
      that.setData({
        grouplist:res.data.data,
        totalPage:res.data.totalPage
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.show()
    if (options.user_id != undefined) {
      that.setData({
        user_id: options.user_id
      })
    } else {
      that.setData({
        user_id: store.get('user_id')
      })
    }
   // that.tosearch()
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log(timestamp,'222')
    var date = util.formatTime1(new Date())
    that.setData({
      // startDate:date,
      // endDate:date
      send_type:app.globalData.send_type
    })
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    if(that.data.page<=that.data.totalPage){
    newWaitOrder({
      shop_id: app.globalData.shop_id,
      page: that.data.page+1,
      order_type: 0
    }).then((res) => {
      wx.hideLoading()
      if (res.data.data != '') {
        var grouplist = that.data.grouplist
        var grouplists = res.data.data
        for (var i = 0; i < grouplists.length; i++) {
          grouplist.push(grouplists[i])
        }
        that.setData({
          grouplist: grouplist,
          page: that.data.page + 1
        })
      } else {
        that.setData({
          loadall: false
        })
      }
    })
    }else{
      that.setData({
        loadall: false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this
    return {
      title: '我发现了一些好吃的，哪个更符合你口味？',
      path: '/pages/mine/distribution/dispatching/dispatching?user_id=' + that.data.user_id + '&startTime=' + that.data.startTime + '&endTime=' + that.data.endTime,
      imageUrl: 'https://image.linwushop.com/2018/12/01-17:17:11-/bb374312af71d6a636d67ae81f851853.png',
      success: (res) => {

      },
      fail: (res) => {

      }
    }
  }
})