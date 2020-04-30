// pages/mine/orderlist/orderdetails/orderdetails.js
import {
  goodsDetail,
  finish,
  receive,
  wait,
} from '../../../../utils/api.js'
import * as store from '../../../../utils/store.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor,
    order_type:1,
    desk_num:''
  },
  getgoods: function (e) {
    var that = this
    if (that.data.shipping_status == 1) {
      receive({
        sign: that.data.sign,
        user_id: e.currentTarget.dataset.userid
      }).then((res) => {
        var goodslists = []
        var allcost=0
        for (var i = 0; i < res.data[0].goodscost.length; i++) {
          // allcost = allcost + parseFloat(res.data[0].goodscost[i])
          goodslists.push({
            goodscost: res.data[0].goodscost[i],
            goodsimg: res.data[0].goodsimg[i],
            goodsname: res.data[0].goodsname[i],
            //products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
            goodsnum: res.data[0].goodsnum[i],
            keyname: res.data[0].key_name[i]
          })
          allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum) 
        }
        var phone_pre=''
        if (app.globalData.userid == e.currentTarget.dataset.userid){
          phone_pre = res.data[0].phone
        }else{
          phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
        }
        var address_pre = ''
        if (app.globalData.userid == e.currentTarget.dataset.userid) {
          address_pre = res.data[0].address + res.data[0].detail
        } else {
          address_pre = res.data[0].address + '******'
        }
        that.setData({
          allcost: allcost.toFixed(2),
          userid: e.currentTarget.dataset.userid,
          goodslists: goodslists,
          address: address_pre,
          phone: phone_pre,
          receiver: res.data[0].buyer,
          order_time: res.data[0].order_time,
          shop_name: res.data[0].name,
          order_id:res.data[0].day_times,
          order_type:res.data[0].order_type,
          desk_num:res.data[0].desk_num
        })
      })
    } else if (that.data.shipping_status == 2) {

      finish({
        sign: that.data.sign,
        user_id: e.currentTarget.dataset.userid
      }).then((res) => {
        var goodslists = []
        var allcost=0
        for (var i = 0; i < res.data[0].goodscost.length; i++) {
          // allcost = allcost + parseFloat(res.data[0].goodscost[i])
          goodslists.push({
            goodscost: res.data[0].goodscost[i],
            goodsimg: res.data[0].goodsimg[i],
            goodsname: res.data[0].goodsname[i],
            products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
            goodsnum: res.data[0].goodsnum[i],
            keyname: res.data[0].key_name[i]
          })
          allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum) 
        }
        var phone_pre = ''
        if (app.globalData.userid == e.currentTarget.dataset.userid) {
          phone_pre = res.data[0].phone
        } else {
          phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
        }
        that.setData({
          allcost: allcost.toFixed(2),
          userid: e.currentTarget.dataset.userid,
          goodslists: goodslists,
          address: res.data[0].address + res.data[0].detail,
          phone: phone_pre,
          receiver: res.data[0].buyer,
          order_time: res.data[0].order_time,
          shop_name: res.data[0].name,
          order_id: res.data[0].day_times,
          order_type:res.data[0].order_type,
          desk_num:res.data[0].desk_num
        })
      })
    } else {
     
      wait({
        sign: that.data.sign,
        user_id: e.currentTarget.dataset.userid
      }).then((res) => {
        var goodslists = []
        var allcost=0
        for (var i = 0; i < res.data[0].goodscost.length; i++) {
          // allcost = allcost + parseFloat(res.data[0].goodscost[i])
          goodslists.push({
            goodscost: res.data[0].goodscost[i],
            goodsimg: res.data[0].goodsimg[i],
            goodsname: res.data[0].goodsname[i],
            goodsnum: res.data[0].goodsnum[i],
            products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
            keyname: res.data[0].key_name[i]
          })
          allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum) 
        }
        var phone_pre = ''
        if (app.globalData.userid == e.currentTarget.dataset.userid) {
          phone_pre = res.data[0].phone
        } else {
          phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
        }
        that.setData({
          allcost: allcost.toFixed(2),
          userid: e.currentTarget.dataset.userid,
          goodslists: goodslists,
          address: res.data[0].address + res.data[0].detail,
          phone: phone_pre,
          receiver: res.data[0].buyer,
          order_time:res.data[0].order_time,
          shop_name: res.data[0].name,
          order_id: res.data[0].day_times,
          order_type:res.data[0].order_type,
          desk_num:res.data[0].desk_num
        })
      })
    }
  },
  //  时间戳转换
  getTimes() {
    var that = this
    var times = that.data.create_time
    var timer = null;
    timer = setInterval(function () {
      var day = 0,
        hour = 0,
        minute = 0,
        second = 0; //时间默认值
      if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (day <= 9) day = '0' + day;
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      var countdown = hour+"时"+minute + "分" + second + "秒"
      that.setData({
        group_time: countdown
      })
      times--;
    }, 1000);
    if (times <= 0) {
      that.setData({
        group_time: '拼团已结束'
      })

      clearInterval(timer);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.sign) {
      that.setData({
        sign: options.sign,
        //backgroundColor: app.globalData.selectedColor,
      })
      goodsDetail({
        sign: options.sign,
        user_id: '',
        type: 1,
      }).then((res) => {
        //consol.log(res.userPhoto[0][1],'333')
        that.setData({
          userid: res.userPhoto[0][1],
        })
       var peoplenum = res.userPhoto.length
       that.setData({
         peoplenum:peoplenum
       })
        if (res.status == 1) {
          if(res.msg=='已成团'){
            receive({
              sign: that.data.sign,
              user_id: that.data.userid
            }).then((res) => {
              var goodslists = []
              var allcost = 0
              for (var i = 0; i < res.data[0].goodscost.length; i++) {
                goodslists.push({
                  goodscost: res.data[0].goodscost[i],
                  goodsimg: res.data[0].goodsimg[i],
                  goodsname: res.data[0].goodsname[i],
                  goodsnum: res.data[0].goodsnum[i],
                  products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
                  keyname: res.data[0].key_name[i]
                })
                allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum)
              }
              var phone_pre = ''
              if (app.globalData.userid == that.data.userid) {
                phone_pre = res.data[0].phone
              } else {
                phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
              }
              that.setData({
                allcost: allcost.toFixed(2),
                goodslists: goodslists,
                address: res.data[0].address + res.data[0].detail,
                phone: phone_pre,
                receiver: res.data[0].buyer,
                order_time: res.data[0].order_time,
                shop_name:res.data[0].name,
                order_id: res.data[0].day_times,
                order_type:res.data[0].order_type,
                desk_num:res.data[0].desk_num
              })
            })
            var i = 3 - res.userPhoto.length
            var userPhoto = res.userPhoto
            for (var j = 0; j < i; j++) {
              userPhoto.push('')
            }
            var b = 0
            for (var a = 0; a < res.userPhoto.length; a++) {
              if (res.userPhoto[a]) {
                b = b + 1
              }
            }
            that.setData({
              length: b,
              create_time: 0,
              userPhoto: userPhoto,
            })
            that.getTimes()
          }else{
          wait({
            sign: that.data.sign,
            user_id: that.data.userid
          }).then((res) => {
            var goodslists = []
            var allcost = 0
            for (var i = 0; i < res.data[0].goodscost.length; i++) {
              goodslists.push({
                goodscost: res.data[0].goodscost[i],
                goodsimg: res.data[0].goodsimg[i],
                goodsname: res.data[0].goodsname[i],
                goodsnum: res.data[0].goodsnum[i],
                products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
                keyname: res.data[0].key_name[i]
              })
              allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum) 
            }
            var phone_pre = ''
            if (app.globalData.userid == that.data.userid) {
              phone_pre = res.data[0].phone
            } else {
              phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
            }
            that.setData({
              allcost: allcost.toFixed(2),
              goodslists: goodslists,
              address: res.data[0].address + res.data[0].detail,
              phone: phone_pre,
              receiver: res.data[0].buyer,
              order_time: res.data[0].order_time,
              shop_name: res.data[0].name,
              order_id: res.data[0].day_times,
              order_type:res.data[0].order_type,
              desk_num:res.data[0].desk_num
            })
          })
          var i = 3 - res.userPhoto.length
          var userPhoto = res.userPhoto
          for (var j = 0; j < i; j++) {
            userPhoto.push('')
          }
          var b = 0
          for (var a = 0; a < res.userPhoto.length; a++) {
            if (res.userPhoto[a]) {
              b = b + 1
            }
          }
          that.setData({
            length: b,
            create_time: res.create_time,
            userPhoto: userPhoto,
          })
          that.getTimes()
          }
        } else {
          that.setData({
            group_time: 0
          })
        }
      })
    } else {
      console.log(options,'tttt')
      var groupdetail = JSON.parse(options.groupdetail)
      that.setData({
        sign: groupdetail.sign,
        groupdetail: groupdetail,
        shipping_status: groupdetail.shipping_status
      })
      goodsDetail({
        sign: groupdetail.sign,
        user_id: '',
        type: 1,
      }).then((res) => {
        that.setData({
          userid: res.userPhoto[0][1],
        })
        var peoplenum = res.userPhoto.length
        that.setData({
          peoplenum: peoplenum
        })
        if (res.status == 1) {
          if (groupdetail.shipping_status == 1) {
            receive({
              sign: groupdetail.sign,
              user_id: that.data.userid
            }).then((res) => {
              var goodslists = []
              var allcost = 0
              for (var i = 0; i < res.data[0].goodscost.length; i++) {
                // allcost = allcost + parseFloat(res.data[0].goodscost[i])
                goodslists.push({
                  goodscost: res.data[0].goodscost[i],
                  goodsimg: res.data[0].goodsimg[i],
                  goodsname: res.data[0].goodsname[i],
                  goodsnum: res.data[0].goodsnum[i],
                  products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
                  keyname: res.data[0].key_name[i]
                })
                allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum) 
              }
              var phone_pre = ''
              if (app.globalData.userid == that.data.userid) {
                phone_pre = res.data[0].phone
              } else {
                phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
              }
              that.setData({
                allcost: allcost.toFixed(2),
                goodslists: goodslists,
                address: res.data[0].address + res.data[0].detail,
                phone: phone_pre,
                receiver: res.data[0].buyer,
                order_time: res.data[0].order_time,
                shop_name: res.data[0].name,
                order_id: res.data[0].day_times,
                order_type:res.data[0].order_type,
                desk_num:res.data[0].desk_num
              })
            })
          } else if (groupdetail.shipping_status == 2) {
            finish({
              sign: groupdetail.sign,
              user_id: that.data.userid
            }).then((res) => {
              var goodslists = []
              var allcost = 0
              for (var i = 0; i < res.data[0].goodscost.length; i++) {
                // allcost = allcost + parseFloat(res.data[0].goodscost[i])
                goodslists.push({
                  goodscost: res.data[0].goodscost[i],
                  goodsimg: res.data[0].goodsimg[i],
                  goodsname: res.data[0].goodsname[i],
                  goodsnum: res.data[0].goodsnum[i],
                  products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
                  keyname: res.data[0].key_name[i]
                })
                allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum) 
              }
              var phone_pre = ''
              if (app.globalData.userid == that.data.userid) {
                phone_pre = res.data[0].phone
              } else {
                phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
              }
              that.setData({
                allcost: allcost.toFixed(2),
                goodslists: goodslists,
                address: res.data[0].address + res.data[0].detail,
                phone: phone_pre,
                receiver: res.data[0].buyer,
                order_time: res.data[0].order_time,
                shop_name: res.data[0].name,
                order_id: res.data[0].day_times,
                order_type:res.data[0].order_type,
                desk_num:res.data[0].desk_num
              })
            })
          } else {
            
            wait({
              sign: groupdetail.sign,
              user_id: that.data.userid
            }).then((res) => {
              var goodslists = []
              var allcost = 0
              for (var i = 0; i < res.data[0].goodscost.length; i++) {
                // allcost = allcost + parseFloat(res.data[0].goodscost[i])

                goodslists.push({
                  allcost:allcost,
                  goodscost: res.data[0].goodscost[i],
                  goodsimg: res.data[0].goodsimg[i],
                  goodsname: res.data[0].goodsname[i],
                  goodsnum: res.data[0].goodsnum[i],
                  products: [res.data[0].products[i].first_profit, res.data[0].products[i].second_profit, res.data[0].products[i].three_profit],
                  keyname: res.data[0].key_name[i]
                })
                allcost = allcost + parseFloat(goodslists[i].goodscost) * parseFloat(goodslists[i].goodsnum) 
              }
              var phone_pre = ''
              if (app.globalData.userid == that.data.userid) {
                phone_pre = res.data[0].phone
              } else {
                phone_pre = res.data[0].phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
              }
              that.setData({
                allcost: allcost.toFixed(2),
                goodslists: goodslists,
                address: res.data[0].address + res.data[0].detail,
                phone: phone_pre,
                receiver: res.data[0].buyer,
                order_time: res.data[0].order_time,
                shop_name: res.data[0].name,
                order_id: res.data[0].day_times,
                order_type:res.data[0].order_type,
                desk_num:res.data[0].desk_num
              })
            })
          }
          var i = 3 - res.userPhoto.length
          var userPhoto = res.userPhoto

          for (var j = 0; j < i; j++) {
            userPhoto.push('')
          }
          var b = 0
          for (var a = 0; a < res.userPhoto.length; a++) {
            if (res.userPhoto[a]) {
              b = b + 1
            }
          }

          that.setData({
            length: b,
            create_time: res.create_time,
            userPhoto: userPhoto,
          })

          that.getTimes()
        } else {
          that.setData({
            group_time: 0
          })
        }
      })


    }
    //判断页面来源页
    // let pages = getCurrentPages();
    // let prevpage = pages[pages.length - 2];
    // console.log(prevpage.route)

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
    var that = this
    return {
      title: '【'+app.globalData.shop_name+'】已全店优惠价，快来拼团吧！',
      path: '/pages/index/index?sign=' + that.data.sign +'&shop_id='+app.globalData.shop_id,
      imageUrl: 'https://image.linwushop.com/2019/04/25-08:27:36-/b29c39df5d9c7b36571c69caeb215b58.png',
    }
  }
})