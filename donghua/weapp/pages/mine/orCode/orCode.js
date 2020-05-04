import util from '../../../utils/downloadORcode'
import {
  getQRcode,
  shop_info
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
var image = require('../../../utils/downloadORcode.js')
var app = getApp()

Page({
  data: {
    ORcodeUrl: '',
    animationData: {},
    downloadHid: true
  },

  shop_info() {
    var that = this
    shop_info({
      shop_id: app.globalData.shop_id,
      user_id: app.globalData.userid
    }).then((res) => {
      // console.log(res, "555555")
      if (res.error_code == 1000) {
        that.setData({
          shopa: res.data.name
        })
      }
    })
  },

  onLoad: function(options) {
    var that = this;
    that.shop_info()
    var imageSize = image.image()
    that.setData({
      imageWidth: imageSize.imageWidth,
      imageHeight: imageSize.imageHeight,
      backgroundColor: app.globalData.selectedColor,
      display: "block"
    })
    that.getBackground()
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.animation = animation
    var n = 0;
    setInterval(function() {
      n = n + 1;
      that.animation.rotate(180 * (n)).step()
      that.setData({
        animationData: this.animation.export()
      })
    }.bind(that), 500)
    
  },

  //获取背景
  getBackground: function() {
    var that = this
    wx.downloadFile({
      url: 'https://image.linwushop.com/2018/11/13-11:22:40-/fc99b475a60b93d4089b97019faf1384.png',
      success: function(res) {
        that.setData({
          backurl: res.tempFilePath,
        })
        var avatarUrl = store.get('me').avatarUrl
        /**
         * 获取头像
         */
        wx.downloadFile({
          url: avatarUrl,
          success: function(res) {
            that.setData({
              exam: res.tempFilePath,
            })
            getQRcode({
              user_id: store.get('user_id'),
              shop_id: app.globalData.shop_id,
            }).then((response) => {
             
              /**
               * 获取二维码
               */
              wx.downloadFile({
                url: response.user_code,
                success: function(res) {
                  that.setData({
                    share: res.tempFilePath,
                  })
                  var userName = app.globalData.userInfo.nickName
                  /**
                   * 生成画布
                   */
                  var ctx = wx.createCanvasContext('myCanvas');
                  ctx.drawImage(that.data.backurl, 25, 0, that.data.imageWidth - 50, 450);
                  ctx.save();
                  ctx.arc(90, 120, 30, Math.PI * 0, Math.PI * 2, true);
                  ctx.clip();
                  ctx.drawImage(that.data.exam, 60, 90, 60, 60);
                  ctx.restore();
                  ctx.font = 'normal 11px sans-serif';
                  ctx.setFontSize(18);
                  ctx.setFillStyle('#FFFFFF');
                  //限制文字长度及换行
                  var chr = userName.split("");
                  var temp = "";
                  var row = [];
                  for (var a = 0; a < chr.length; a++) {
                    if (ctx.measureText(temp).width < 190) {
                      temp += chr[a];
                    } else {
                      a--;
                      row.push(temp);
                      temp = "";
                    }
                  }
                  row.push(temp);
                  if (row.length > 2) {
                    var rowCut = row.slice(0, 2);
                    var rowPart = rowCut[1];
                    var test = "";
                    var empty = [];
                    for (var a = 0; a < rowPart.length; a++) {
                      if (ctx.measureText(test).width < 150) {
                        test += rowPart[a];
                      } else {
                        break;
                      }
                    }
                    empty.push(test);
                    var group = empty[0] + "..."
                    rowCut.splice(1, 1, group);
                    row = rowCut;
                  }
                  for (var b = 0; b < row.length; b++) {
                    ctx.fillText(row[b], 130, 110 + b * 30, 300);
                  }
                  ctx.fillText('邻伍', (that.data.imageWidth - 85) / 2 + 23, 65);
                  ctx.save();
                  ctx.arc((that.data.imageWidth - 250) / 2 + 123, 285, 100, Math.PI * 0, Math.PI * 2, true);
                  ctx.clip();
                  ctx.setFillStyle('White')
                  ctx.fillRect((that.data.imageWidth - 250) / 2 + 23, 185, 210, 210)
                  ctx.drawImage(that.data.share, (that.data.imageWidth - 250) / 2 + 23, 185, 200, 200);
                  ctx.restore();
                  ctx.draw();
                  that.setData({
                    display: "none",
                    downloadHid: false,
                  })
                },

                fail: function() {
                  console.log('fail')
                }
              })
              // }
            })
          },

          fail: function() {
            console.log('fail')
          }
        })
      },

      fail: function() {
        wx.showLoading({
          title: '2222',
        })
      }
    })
  },
  //保存图片
  savePic: function() {
    var that = this
    wx.canvasToTempFilePath({
      x: 25,
      y: 0,
      width: that.data.imageWidth,
      height: 450,
      canvasId: 'myCanvas',
      success: function(res) {
        util.savePicToAlbum(res.tempFilePath)
      }
    })
  },
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: this.data.shopa,
      path: '/pages/shoppages/index/index?u=' + app.globalData.u,
    }
  }
})