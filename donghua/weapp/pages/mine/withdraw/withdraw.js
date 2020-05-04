import {
  cashDetail,
  cash
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wayList: [],
    selected: '',
    allSelect: false,
    showSelected: false,
    isCheck: 'Off',
    allIncome: 0
  },

  getWD: function() {
    cashDetail({
      user_id: app.globalData.userid,
      shop_id: app.globalData.shop_id,
    }).then((response) => {
      console.log(response)
      var wayList = response.cashInfo.cash_name.wayList
      this.setData({
        wayList: response.cashInfo.cash_name.wayList,
        selected: wayList[0].content
      })
    })
  },

  formSubmit: function(e) {
    var that = this
    var isCheck = that.data.isCheck
    if (isCheck == 'Off') {
      wx.showLoading({
        title: '请同意提交',
        mask: true
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 1000)
      return
    }
    var selected = that.data.selected
    console.log(e.detail.value)
    if (selected == '微信') {
      if (e.detail.value.wxMoney == "") {
        console.log(1)
        wx.showLoading({
          title: '金额不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (!e.detail.value.wxMoney.toString().split(".")[1] == '') {
        wx.showLoading({
          title: '金额要大于一元',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.wxMoney > that.data.allIncome) {
        wx.showLoading({
          title: '余额不足',
          mask: true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.wxMoney == 0) {
        wx.showLoading({
          title: '金额要大于一元',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else {
        cash({
          user_id: store.get('user_id'),
          shop_id: app.globalData.shop_id,
          blance_cash: e.detail.value.wxMoney,
          cash_type: 1,
          is_check: that.data.isCheck
        }).then((response) => {
          wx.showLoading({
            title: response.msg,
            mask: true
          })
          setTimeout(function() {
            wx.hideLoading()
            wx.redirectTo({
              url: '../distribution/distribution',
            })
          }, 1000)
        })
      }
    }
    if (selected == '支付宝') {
      if (e.detail.value.zfbName == '') {
        wx.showLoading({
          title: '姓名不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.zfbAccount == '') {
        wx.showLoading({
          title: '账号不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.zfbMoney == '') {
        wx.showLoading({
          title: '金额不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.zfbMoney == 0) {
        wx.showLoading({
          title: '金额要大于一元',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.zfbMoney > that.data.allIncome){
        wx.showLoading({
          title: '余额不足',
          mask: true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)

        return
      } else if (!e.detail.value.zfbMoney.toString().split(".")[1] == '') {
        if (e.detail.value.zfbMoney.toString().split(".")[1].length > 2) {
          wx.showLoading({
            title: '金额要大于一分',
            mask: true
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)

          return
        }
        cash({
          user_id: store.get('user_id'),
          shop_id: app.globalData.shop_id,
          blance_cash: e.detail.value.zfbMoney,
          cash_type: 2,
          zfb_name: e.detail.value.zfbName,
          zfb_username: e.detail.value.zfbAccount,
          is_check: that.data.isCheck
        }).then((response) => {
          wx.showLoading({
            title: response.msg,
            mask: true
          })
          setTimeout(function() {
            wx.hideLoading()
            wx.redirectTo({
              url: '../distribution/distribution',
            })
          }, 1000)
        })

      } else {
        cash({
          user_id: store.get('user_id'),
          shop_id: app.globalData.shop_id,
          blance_cash: e.detail.value.zfbMoney,
          cash_type: 2,
          zfb_name: e.detail.value.zfbName,
          zfb_username: e.detail.value.zfbAccount,
          is_check: that.data.isCheck
        }).then((response) => {
          wx.showLoading({
            title: response.msg,
            mask: true
          })
          wx.hideLoading()
          setTimeout(function() {
            wx.hideLoading()
            wx.redirectTo({
              url: '../distribution/distribution',
            })
          }, 1000)
        })
      }
    }
    if (selected == '银行卡') {
      if (e.detail.value.yhkName == '') {
        wx.showLoading({
          title: '姓名不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.yhkAccount == '') {
        wx.showLoading({
          title: '卡号不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.yhkBank == '') {
        wx.showLoading({
          title: '银行不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.yhkMoney == '') {
        wx.showLoading({
          title: '金额不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.yhkMoney > that.data.allIncome) {
        wx.showLoading({
          title: '余额不足',
          mask: true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)

        return
      }  else if (e.detail.value.yhkMoney == 0) {
        wx.showLoading({
          title: '金额要大于一元',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (!e.detail.value.yhkMoney.toString().split(".")[1] == '') {
        if (e.detail.value.yhkMoney.toString().split(".")[1].length > 2) {
          wx.showLoading({
            title: '金额要大于一分',
            mask: true
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)
          return
        }
      }
      cash({
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        blance_cash: e.detail.value.yhkMoney,
        cash_type: 3,
        yhk_name: e.detail.value.yhkName,
        yhk_username: e.detail.value.yhkAccount,
        yhk_bank: e.detail.value.yhkBank,
        is_check: that.data.isCheck
      }).then((response) => {
        wx.showLoading({
          title: response.msg,
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
          wx.redirectTo({
            url: '../distribution/distribution',
          })
        }, 1000)
      })

    }
  },
  //了解选取
  selectRead: function() {
    if (this.data.allSelect) {
      this.setData({
        allSelect: false,
        isCheck: 'Off'
      })
    } else {
      this.setData({
        allSelect: true,
        isCheck: 'On'
      })
    }
  },
  //弹出支付方式
  showChange: function() {
    var that = this
    var list = that.data.wayList
    list.selected = false
    that.setData({
      wayList: list,
      showSelected: true
    })
    // console.log(this.data.arr)
  },
  //选择支付方式
  selectorMode: function(e) {
    var that = this
    var thisChecked = e.currentTarget.id
    var wayList = that.data.wayList
    for (var i = 0; i < wayList.length; i++) {
      if (i == thisChecked) {
        wayList[i].selected = true;
      } else {
        wayList[i].selected = false;
      }
    }
    that.setData({
      wayList: wayList,
      selected: wayList[thisChecked].content,
      selectedId: wayList[thisChecked].id
    })
    // console.log(that.data.selectedId)
    // setTimeout(function() {
    that.setData({
      showSelected: false
    })
    // }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.getWD()
    // wx.setNavigationBarColor({
    //   frontColor: wx.getStorageSync('selectedFontColor'),
    //   backgroundColor: wx.getStorageSync('selectedColor'),
    //   animation: {
    //     duration: 400,
    //     timingFunc: 'easeIn'
    //   }
    // })
    this.setData({
      backgroundColor: app.globalData.selectedColor,
      allIncome: options.allIncome
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})