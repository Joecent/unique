import {
  get_groupCash,
  getFormIdInfo,
  group_cash,
  getUserMoney
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'

var app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    wayList: [],
    selected: '微信',
    allSelect: false,
    showSelected: false,
    isCheck: 'Off',
    allIncome: 0,
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor
  },

  getWD(){
    var that=this
    get_groupCash({
      user_id: store.get('user_id'),
      shop_id: app.globalData.shop_id,
    }).then((response) => {
      console.log(response)
      var wayList = response.cashInfo.cash_name.wayList
      // for (var i = 0; i < wayList.length;i++){
      //   if (wayList[i].content=='微信'){
      //     wayList.splice(i,1)
      //   }
      // }
      this.setData({
        wayList: wayList,
        selected: wayList[0].content
      })
    })
  },
  get_money(){
    var that=this
    getUserMoney({ 
      shop_id: app.globalData.shop_id,
      user_id:app.globalData.userid
    }).then(res=>{
      that.setData({
        allIncome: res.data.data.group_money
      })
    })
  },
  formSubmit: function (e) {
    var that = this
    that.setData({
      disabled:true
    })
    // getFormIdInfo({
    //   formId: e.detail.formId,
    //   user_id: store.get('user_id'),
    // }).then((response) => {})
    var isCheck = that.data.isCheck
    if (isCheck == 'Off') {
      that.setData({
        disabled: false
      })
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
    if (selected == '微信') {
      if (e.detail.value.wxMoney == "") {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '金额不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (!e.detail.value.wxMoney.toString().split(".")[1] == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '金额要大于一元',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (parseInt(e.detail.value.wxMoney) > parseInt(that.data.allIncome)) {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '余额不足',
          mask: true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.wxMoney == 0) {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '金额要大于一元',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else {
        wx.showLoading({
          title: '正在提现',
          mask: true
        })
        group_cash({
          user_id: store.get('user_id'),
          shop_id: app.globalData.shop_id,
          blance_cash: e.detail.value.wxMoney,
          cash_type: 1,
          is_check: that.data.isCheck
        }).then((response) => {
         
          if (response.status=='1'){
            that.setData({
              disabled: false
            })
            wx.showLoading({
              title: '提现成功',
              mask: true
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          }else{
            that.setData({
              disabled: false
            })
            wx.showModal({
              title: '提示',
              content: response.msg,
              showCancel: false,
            })
          }
   
        })
      }
    }
    if (selected == '支付宝') {
      if (e.detail.value.zfbName == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '姓名不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.zfbAccount == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '账号不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.zfbMoney == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '金额不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.zfbMoney == 0) {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '金额要大于一元',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (parseInt(e.detail.value.zfbMoney) > parseInt(that.data.allIncome)){
        that.setData({
          disabled: false
        })
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
          that.setData({
            disabled: false
          })
          wx.showLoading({
            title: '金额要大于一分',
            mask: true
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)

          return
        }
        group_cash({
          user_id: store.get('user_id'),
          shop_id: app.globalData.shop_id,
          blance_cash: e.detail.value.zfbMoney,
          cash_type: 2,
          zfb_name: e.detail.value.zfbName,
          zfb_username: e.detail.value.zfbAccount,
          is_check: that.data.isCheck
        }).then((response) => {
          
          if (response.status == '1') {
            that.setData({
              disabled: false
            })
            wx.showLoading({
              title: response.msg,
              mask: true
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.redirectTo({
                url: '../distribution/distribution',
              })
            }, 1000)
          } else {
            that.setData({
              disabled: false
            })
            wx.showModal({
              title: '提示',
              content: response.msg,
              showCancel: false,
            })
          }
        })

      } else {
        group_cash({
          user_id: store.get('user_id'),
          shop_id: app.globalData.shop_id,
          blance_cash: e.detail.value.zfbMoney,
          cash_type: 2,
          zfb_name: e.detail.value.zfbName,
          zfb_username: e.detail.value.zfbAccount,
          is_check: that.data.isCheck
        }).then((response) => {
          
          if (response.status == '1') {
            that.setData({
              disabled: false
            })
            wx.showLoading({
              title: response.msg,
              mask: true
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.redirectTo({
                url: '../distribution/distribution',
              })
            }, 1000)
          } else {
            that.setData({
              disabled: false
            })
            wx.showModal({
              title: '提示',
              content: response.msg,
              showCancel: false,
            })
          }
        })
      }
    }
    if (selected == '银行卡') {
      that.setData({
        disabled: false
      })
      if (e.detail.value.yhkName == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '姓名不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.yhkAccount == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '卡号不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.yhkBank == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '银行不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (e.detail.value.yhkMoney == '') {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '金额不能为空',
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        return
      } else if (parseInt(e.detail.value.yhkMoney) > parseInt(that.data.allIncome)) {
        that.setData({
          disabled: false
        })
        wx.showLoading({
          title: '余额不足',
          mask: true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)

        return
      }  else if (e.detail.value.yhkMoney == 0) {
        that.setData({
          disabled: false
        })
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
          that.setData({
            disabled: false
          })
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
      group_cash({
        user_id: store.get('user_id'),
        shop_id: app.globalData.shop_id,
        blance_cash: e.detail.value.yhkMoney,
        cash_type: 3,
        yhk_name: e.detail.value.yhkName,
        yhk_username: e.detail.value.yhkAccount,
        yhk_bank: e.detail.value.yhkBank,
        is_check: that.data.isCheck
      }).then((response) => {
       
        if (response.status == '1') {
          that.setData({
            disabled: false
          })
          wx.showLoading({
            title: response.msg,
            mask: true
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.redirectTo({
              url: '../distribution/distribution',
            })
          }, 1000)
        } else {
          that.setData({
            disabled: false
          })
          wx.showModal({
            title: '提示',
            content: response.msg,
            showCancel: false,
          })
        }
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
    that.setData({
      showSelected: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.getWD()
    this.get_money()
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