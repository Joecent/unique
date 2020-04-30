//app.js

import * as store from './utils/store.js';
const ald = require('./utils/ald-stat.js')
import {
  shop_info,
  phone_login,
  send_code,
  auth,
  shop_color,
  getShopJuLi,
  addShopCard
} from './utils/api.js';
App({
  globalData: {
    u:'',
    userInfo: '',
    userid: 0,
    barHeight: 0,
    windowHeight: 0,
    code: '',
    ungetInfo: false,
    shop_id: '',
    selectedColor:'#FF5D35',
    shop_phone:'',
    seller:0,
    is_in_food:0,
    tag:'',
    is_new:0
  },

  onLaunch: function () {
    let that = this
    // wx.getLocation({
    //   success: function (res) {
    //     getShopJuLi({
    //       longitude: res.longitude,
    //       latitude: res.latitude
    //     }).then(res => {
    //       that.globalData.shop_id = res.data.data[0].id
    //       store.set('shop_id', res.data.data[0].id)
    //     })
    //   },
    // })
    // shop_color({
    //   shop_id: that.globalData.shop_id,
    // }).then((res) => {
    //   that.globalData.selectedColor = res.shop_color
    //   if (that.selectedColorCallback) {
    //     that.selectedColorCallback(res.shop_color);
    //   }

    // })
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.barHeight = res.statusBarHeight,
          that.globalData.windowHeight = res.windowHeight
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync( 'logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
     
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code
        // 获取用户信息
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框  
              wx.getUserInfo({
                success: res => {
                  store.set('me', res.userInfo)
                  // 可以将 res 发送给后台解码出 unionId
                  that.globalData.userInfo = res.userInfo
                  auth({
                   // shop_id: that.globalData.shop_id,
                    code: that.globalData.code,
                    name: res.userInfo.nickName,
                    photo: res.userInfo.avatarUrl,
                    sex: res.userInfo.gender

                  }).then((response) => {
                    if (response.error_code == 1000) {
                      that.globalData.userid = response.data.user_id
                      that.globalData.token = response.data.token
                      that.globalData.u = response.data.u
                      store.set('openid', response.data.openid)
                      store.set('user_id', response.data.user_id)
                    }
                    }).then(function () {
                      addShopCard({ user_id: that.globalData.userid, shop_id: that.globalData.shop_id }).then(res => {
                      if (res.error_code == 1001) {
                        that.globalData.is_new = 0
                      } else if (res.error_code == 1000) {
                        that.globalData.is_new = 1
                      }
                        if (that.userInfoReadyCallback) {
                          that.userInfoReadyCallback(that.globalData.userid, that.globalData.ungetInfo, that.globalData.is_new,that.globalData.shop_id)
                        }
                    })
                  })
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                }
              })
            } else {
              that.globalData.ungetInfo = true
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(that.globalData.userid, that.globalData.ungetInfo)
              }
            }
          },
          fail: (res) => {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                that.onLaunch()
              }
            })
          }
        })
        
      }
    })
  },
})