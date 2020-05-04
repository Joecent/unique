// pages/shoppages/goods/goods.js
import util from '../../../utils/downloadORcode'
var image = require('../../../utils/downloadORcode.js')
import {
  get_goods_pro,
  getQRcode,
  goods_info,
  show_no_group,
  get_goods,
  add_shopcart,
  shop_info,
  auth
} from '../../../utils/api.js'
import * as store from '../../../utils/store.js'
//const WxParse = require('../../../wxParse/wxParse.js')
const app = getApp()
var goods_id = ''
var u = ''

Page({

      /**
       * 页面的初始数据
       */
      data: {
        currentTab:0,
        hidLoad: true,
        animationData: {},
        hidShare: true,
        display: '',
        chooseSize: false,
        animationData: {},
        spec_name: '',
        spec_image: '',
        spec_value: '',
        goods_id: '',
        goods: [],
        show_groups: false,
        content: '',
        shop_id: '',
        goods_image: [],
        is_group: 1,
        index: 100,
        products: '',
        specimgs: '',
        type: '',
        spec_price_pre: [],
        goods_info_pre: "",
        showLoad: false,
        num: 1,
        totalNum: 0,
        count: 1,
        showView: false,
        valuations:[{

        }]
      },

      /**
       * 获取头像
       */
      getAvatarUrl: function() {
        var that = this
        var avatarUrl = store.get('me').avatarUrl
        // console.log(avatarUrl,'44')
        //保存头像
        wx.downloadFile({
          url: avatarUrl,
          success: function(res) {
            that.setData({
              exam: res.tempFilePath,
            })
            /**
             * 获取二维码
             */
            getQRcode({
              user_id: store.get('user_id'),
              shop_id: app.globalData.shop_id,
              goods_id: that.data.goods_id
            }).then((response) => {
              // console.log(response.user_code)
              wx.downloadFile({
                url: response.user_code,
                success: function(res) {
                  that.setData({
                    share: res.tempFilePath,
                  })
                  //获取背景
                  wx.downloadFile({
                    url: 'https://image.linwushop.com/2018/11/13-11:27:58-/fc5218dc48afb42177fa38b1ede83fb4.png',
                    success: function(res) {
                      that.setData({
                        backurl: res.tempFilePath,
                      })
                      //商品照片
                      wx.downloadFile({
                        url: that.data.goods.goods_img,
                        success: function(res) {
                          that.setData({
                            goodsPho: res.tempFilePath,
                          })
                          /**
                           * 生成画布
                           */
                          var myName = app.globalData.userInfo.nickName
                          var goodsName = that.data.goods.goods_name
                          var goodsPrices = that.data.spec_goods_prices
                          var marketPrices = that.data.spec_market_prices
                          var ctx = wx.createCanvasContext('myCanvas');
                          ctx.drawImage(that.data.backurl, 0, 0, that.data.imageWidth - 25, 490);
                          ctx.drawImage(that.data.share, (that.data.imageWidth - 185) / 2, 265, 160, 160);
                          ctx.setStrokeStyle('#999999')
                          ctx.setLineWidth(0.4)
                          ctx.strokeRect(44, 169, that.data.imageWidth - 113, 82)
                          ctx.drawImage(that.data.goodsPho, 45, 170, 80, 80);
                          ctx.font = 'normal 11px sans-serif';
                          ctx.fillText(goodsName, 145, 190);
                          ctx.setFontSize(13);
                          ctx.setFillStyle('#fe2c4f');
                          ctx.fillText('￥' + goodsPrices, 145, 220);
                          ctx.setFontSize(12);
                          ctx.setFillStyle('#999999');
                          ctx.fillText('￥' + marketPrices, 205, 220);
                          ctx.save();
                          ctx.arc(70, 100, 30, Math.PI * 0, Math.PI * 2, true);
                          ctx.clip();
                          ctx.drawImage(that.data.exam, 40, 70, 60, 60);
                          ctx.restore();
                          ctx.font = 'normal 11px sans-serif';
                          ctx.setFontSize(18);
                          ctx.setFillStyle('#FFFFFF');
                          //限制文字长度及换行
                          var chr = myName.split("");
                          var temp = "";
                          var row = [];
                          for (var a = 0; a < chr.length; a++) {
                            if (ctx.measureText(temp).width < 180) {
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
                              if (ctx.measureText(test).width < 140) {
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
                            ctx.fillText(row[b], 120, 90 + b * 30, 300);
                          }
                          ctx.fillText('邻伍', (that.data.imageWidth - 60) / 2, 55);
                          ctx.setFontSize(14);
                          ctx.setFillStyle('#333333');
                          ctx.fillText('用微信扫二维码进入小程序', (that.data.imageWidth - 185) / 2, 490 - 35);
                          ctx.draw();
                          that.setData({
                            hidLoad: true
                          })
                        },

                        fail: function() {
                          console.log('fail', '11')
                        }
                      })
                    },

                    fail: function() {
                      console.log('fail', '22')
                    }
                  })
                },

                fail: function() {
                  console.log('fail', '33')
                }
              })
            })

          },
          fail: function() {
            console.log('fail')
          }
        })
      },
      savePic: function() { //保存图片
        var that = this
        wx.canvasToTempFilePath({
          x: 18,
          y:20,
          width: that.data.imageWidth - 62,
          height: 447,
          canvasId: 'myCanvas',
          success: function(res) {
            util.savePicToAlbum(res.tempFilePath)
          }
        })
      },
      //显示二维码遮罩层
      showStratum: function() {
        var that = this;
        that.setData({
          display: "block",
          hidLoad: false
        })
        // var avatarUrl = app.globalData.userInfo.avatarUrl
        that.getAvatarUrl()
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
        that.animation = animation
        that.setData({
          animationData: animation.export()
        })
        var n = 0;
        setInterval(function() {
          n = n + 1;
          that.animation.rotate(180 * (n)).step()
          that.setData({
            animationData: this.animation.export()
          })
        }.bind(that), 1000)
      },
      hideview: function() {
        this.setData({
          display: "none"
        })
      },

      show_home() {
        wx.redirectTo({
          url: '/pages/shoppages/index/index',
        })

      },
      cart() {
        wx.redirectTo({
          url: '/pages/mine/cart/cart',
        })
      },

      mineGrey() {
        wx.redirectTo({
          url: '/pages/mine/mine',
        })
      },

      show_goods(goods_id) {
        let that = this
        var goods_image_pre = []
        var item_1 = ''
        var item_2 = ''
        var spec_names = []
        var spec_values = []
        that.data.goods_id = goods_id
        get_goods_pro({
          goods_id: goods_id,
          user_id: store.get('user_id'),
        }).then((res) => {
          if (res.data.status) {
            that.setData({
              hidShare: false
            })
          } else if (!res.data.status) {
            that.setData({
              hidShare: true
            })
          }
          if (res.error_code == 1000) {
            goods_image_pre.push(res.data.goods[0].goods_img)
            if (res.data.goods[0].img_urls != '') {
              for (var i = 0; i < res.data.goods[0].img_urls.length; i++) {
                goods_image_pre.push(res.data.goods[0].img_urls[i])
              }
            }

            that.data.products = res.data.products[0]
            that.data.specimgs = res.data.specimgs[0]
            // console.log(res.data.goods[0])
            if (res.data.goods[0].is_on_spec == 1) {
              that.setData({
                goods: res.data.goods[0],
                goods_image: goods_image_pre,
                is_group: res.data.goods[0].is_group,
                goods_price: res.data.products[0].goods_prices[0],
                spec_goods_prices: res.data.products[0].goods_prices[0],
                spec_group_prices: res.data.products[0].group_prices[0],
                spec_market_prices: res.data.products[0].market_prices[0],
                spec_goods_scores: res.data.products[0].goods_scores[0],
                market_price: res.data.products[0].market_prices[0],
                group_price: res.data.products[0].group_prices[0],
                spec_image: res.data.goods[0].goods_img,
                key_name: res.data.products[0].key_names[0],
                goods_img: res.data.goods[0].goods_img,
                goods_type: res.data.goods[0].goods_type,
                goods_scores: res.data.products[0].goods_scores[0]
              })
              if (res.data.products[0].key_names[0].indexOf(" ") == -1) {
                let spec_name_pre = res.data.products[0].key_names[0].split(":")[0]
                let spec_value_pro = []
                for (var k = 0; k < res.data.products[0].key_names.length; k++) {
                  spec_value_pro.push(res.data.products[0].key_names[k].split(":")[1])
                }
                that.setData({
                  spec_name: spec_name_pre,
                  spec_value: spec_value_pro
                })
              } else {
                let spec_infos = res.data.products[0].key_names[0].split(" ")
                let spec_value_pre = []
                for (var p = 0; p < spec_infos.length; p++) {
                  spec_names.push(spec_infos[p].split(":")[0])
                }
                for (var q = 0; q < res.data.products[0].key_names.length; q++) {
                  let spec_value_p = res.data.products[0].key_names[q].split(" ")
                  spec_value_pre.push(spec_value_p[0].split(":")[1] + "/" + spec_value_p[1].split(":")[1])
                }
                that.setData({
                  spec_name: spec_names[0] + '/' + spec_names[1],
                  spec_value: spec_value_pre
                })
              }
            } else {
              that.setData({
                goods: res.data.goods[0],
                is_group: res.data.goods[0].is_group,
                goods_image: goods_image_pre,
                goods_price: res.data.products[0].goods_prices[0],
                spec_goods_prices: res.data.products[0].goods_prices[0],
                spec_group_prices: res.data.products[0].group_prices[0],
                spec_market_prices: res.data.products[0].market_prices[0],
                spec_goods_scores: res.data.products[0].goods_scores[0],
                market_price: res.data.products[0].market_prices[0],
                group_price: res.data.products[0].group_prices[0],
                spec_image: res.data.goods[0].goods_img,
                goods_type: res.data.goods[0].goods_type,
                //key_name: res.data.products[0].key_names[0],
                // goods_img: res.data.goods[0].goods_img,
              })
            }
            if (res.data.goods[0].goods_type == 0) {
              that.setData({
                showView: true
              })
            } else {
              that.setData({
                showView: false
              })
            }

          } else {
            wx.showLoading({
              title: '参数错误',
            })
            setTimeout(function() {
              wx.hideLoading()
            }, 2000)

          }
        })
      },

      /**
       * 切换Tab
       */
      changeTab(e){
        var that = this
        if (that.currentTab == e.currentTarget.dataset.current) {
          return false;
        } else {
          that.setData({
            currentTab: e.currentTarget.dataset.current
          })
        }
      },
      /**
       * 打开规格
       */
      show_spec(e) {
        var that = this
        if (!store.get('user_id')) {
          that.setData({
            showLoad: true
          })
        }
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(0).step()
        that.setData({
          type: e.currentTarget.dataset.type,
          animationData: animation.export(),
          chooseSize: true,
          index: 0,
          product_id: that.data.products.product_ids[0],
          spec_image: that.data.specimgs.spec_imgs[0],
          spec_goods_prices: that.data.products.goods_prices[0],
          spec_group_prices: that.data.products.group_prices[0],
          spec_market_prices: that.data.products.market_prices[0],
          spec_goods_scores: that.data.products.goods_scores[0],
          spec_image: that.data.goods.goods_img
          //spec_value_choose: that.data.spec_value[0]
        })
        setTimeout(function() {
          animation.translateY(0).step()
          that.setData({
            animationData: animation.export()
          })
        }, 200)
      },


      /**确认按钮 */
      tobought(e) {
        // console.log(e.currentTarget.dataset.goods_type, '77777777777')
        var that = this
        var flag = true
        let total = that.data.totalNum;
        if (that.data.index == 100) {
          wx.showLoading({
            title: '请选择规格',
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        } else if (that.data.spec_goods_scores < 1) {
          wx.showLoading({
            title: '库存不足',
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        } else {
          flag = false
        }
        if (flag == false) {
          //  1 加入购物车   2  立即购买
          if (that.data.type == 1) {
            add_shopcart({
              shop_id: app.globalData.shop_id,
              name: that.data.goods.goods_name,
              image: that.data.goods.goods_img,
              key_name: that.data.spec_value_choose,
              product_id: that.data.product_id,
              number: that.data.spec_goods_scores,
              price: that.data.spec_goods_prices,
              goods_id: that.data.goods_id,
              user_id: store.get('user_id'),
              count: that.data.count,
            }).then((res) => {
              // console.log(res, "加入购物车")
              if (res.error_code == 1001) {
                wx.showLoading({
                  title: '添加失败',
                })
              } else {
                wx.showLoading({
                  title: '加入购物车',
                })
                setTimeout(function() {
                  wx.hideLoading()
                  that.setData({
                    chooseSize: false
                  })
                }, 1000)
                // 购物车显示数字
                setTimeout(function() {
                  that.setData({
                    scaleCart: true
                  })
                  setTimeout(function() {
                    that.setData({
                      scaleCart: false,
                      hasCarts: true,
                      count: that.data.count
                    })
                  }, 200)
                }, 300)
              }
            })

            // wx.setStorage({
            //   key: "cart",
            //   data: [{
            //     count: that.data.count,
            //     product_id: that.data.product_id
            //   }]
            // })
          } else if (that.data.type == 2) {
            wx.setStorage({
              key: "singleorderinfo",
              data: [{
                goods_id: that.data.goods_id,
                key_name: that.data.spec_value_choose,
                price: that.data.spec_goods_prices,
                // image: that.data.specimgs.spec_image,
                name: that.data.goods.goods_name,
                product_id: that.data.product_id,
                count: that.data.count,
                // image: that.data.goods.goods_img,
                image: that.data.spec_image,
                number: that.data.spec_goods_scores
              }]
            })
            that.setData({
              count: 1
            })

            if (e.currentTarget.dataset.goods_type == 0) {
              wx.navigateTo({
                url: '/pages/shoppages/singleorderinfo/singleorderinfo',
              })
            } else {
              wx.navigateTo({
                url: '/pages/shoppages/singleorderinfos/singleorderinfos',
              })
            }
          }
        }
      },


      //   if(addlist[index].count > addlist[index].number) {
      //   wx.showLoading({
      //     title: '库存不足',
      //   })
      //   setTimeout(function () {
      //     wx.hideLoading()
      //   }, 1000)
      //   addlist[index].count = addlist[index].number
      // }


      // 加号
      importCountjia(e) {
        //console.log(index, 77777777)
        var that = this
        var count = that.data.count;
        count++
        that.data.count = count
        if (that.data.count > that.data.spec_goods_scores) {
          wx.showLoading({
            title: '库存不足',
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)
          that.data.count = that.data.spec_goods_scores
        }
        that.setData({
          count: that.data.count,
        });
      },


      // 减号
      importCountjian(e) {
        var that = this
        var count = that.data.count;
        if (count > 1) {
          count--
        }

        // var minusStatus = num <= 1 ? 'disabled' : 'normal';
        // 将数值与状态写回
        that.setData({
          count: count,
          // minusStatus: minusStatus
        });
      },




      /**
       * 隐藏规格
       */
      hideModal() {
        var that = this;
        that.setData({
          chooseSize: false
        })
      },

      tochoose(e) {
        var that = this
        let idx = e.currentTarget.dataset.spec_id
        that.setData({
          index: e.currentTarget.dataset.spec_id,
          product_id: that.data.products.product_ids[idx],
          spec_image: that.data.specimgs.spec_imgs[idx],
          spec_goods_prices: that.data.products.goods_prices[idx],
          spec_group_prices: that.data.products.group_prices[idx],
          spec_market_prices: that.data.products.market_prices[idx],
          spec_goods_scores: that.data.products.goods_scores[idx],
          spec_value_choose: that.data.spec_value[idx]
        })
      },


      // shop_info() {
      //   shop_info({
      //     shop_id: app.globalData.shop_id,
      //     user_id: store.get('user_id')
      //   }).then((res) => {
      //     console.log(res, '888')
      //   })
      // },

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


      chooseSpec(e) {
        var that = this
        that.setData({
          chooseIndex: e.currentTarget.dataset.index,
          spec_price_choose: that.data.spec_price_pre[e.currentTarget.dataset.index]
        })
      },


      /**
       * 隐藏规格
       */
      hideModal() {
        var that = this;
        that.setData({
          chooseSize: false
        })
      },
      //授权
      bindGetUserInfo: function(e) {
        var that = this
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            app.globalData.code = res.code
            store.set('me', e.detail.userInfo)
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = e.detail.userInfo
            auth({
              shop_id: app.globalData.shop_id,
              code: app.globalData.code,
              name: e.detail.userInfo.nickName,
              photo: e.detail.userInfo.avatarUrl,
              sex: e.detail.userInfo.gender
            }).then((response) => {
              if (response.error_code == 1000) {
                app.globalData.userid = response.data.user_id
                store.set('openid', response.data.openid)
                store.set('user_id', response.data.user_id)
                that.setData({
                  showLoad: false,
                  avatar: e.detail.userInfo.avatarUrl,
                  name: e.detail.userInfo.nickName,
                  u: response.data.u
                })
                that.show_goods(goods_id)
                that.shop_info()
                var imageSize = image.image()
                that.setData({
                  imageWidth: imageSize.imageWidth,
                  imageHeight: imageSize.imageHeight,
                })
                get_goods_pro({
                  goods_id: goods_id,
                  u: u,
                  user_id: response.data.user_id,
                }).then((res) => {})
              }

            })
          }
        })
      },



      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
        console.log(options)
        // get_goods_pro({
        //   goods_id: "1296",
        //   u: 'NTE3MXNoYXJlX2NvZGU=',
        //   user_id: store.get('user_id'),
        // }).then((res) => { })
        var that = this
        if (options.u != undefined) {
          if (!store.get('user_id')) {
            that.setData({
              showLoad: true,
              goods_id: options.goods_id
            })
            goods_id = options.goods_id
            u = options.u
          } else {
            console.log(options.goods_id, '3333333')
            that.show_goods(options.goods_id)
            get_goods_pro({
              goods_id: options.goods_id,
              u: options.u,
              user_id: store.get('user_id'),
            }).then((res) => {})
          }
        } else {
          that.show_goods(options.goods_id)
        }
        if (app.globalData.shop_color && app.globalData.shop_color != '') {
          that.setData({
            backgroundColor: app.globalData.selectedColor
          })
        } else {
          app.shop_colorCallback = shop_color => {
            if (shop_color != '') {
              that.setData({
                backgroundColor: app.globalData.selectedColor
              })
            }
          }
        }

        that.shop_info()
        var imageSize = image.image()
        that.setData({
          imageWidth: imageSize.imageWidth,
          imageHeight: imageSize.imageHeight,
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
        this.setData({
          backgroundColor: app.globalData.selectedColor,
        })

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
      onShareAppMessage: function(res) {
        var that = this
        if (that.data.hidShare) {
          return {
            title: res.target.dataset.name,
            path: 'pages/shoppages/goods/goods?goods_id=' + that.data.goods_id,
            success: function(res) {
              console.log(res, "123")
            }
          }
        } else {
          return {
            title: res.target.dataset.name,
            path: 'pages/shoppages/goods/goods?goods_id=' + that.data.goods_id + '&u=' + app.globalData.u,
            success: function(res) {
              console.log(res, "123")
            }
          }
        }
      }
      })
