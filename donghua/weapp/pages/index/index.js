// pages/shoppages/diningindex/diningindex.js
import {
  auth,
  sel_cate,
  shop_info,
  newTeaGoods,
  goodsDetail,
  getShopJuLi,
  addShopCard,
  get_groups,
  get_cash,
  isUserInfo,
  group_status
} from '../../utils/api.js';
import * as store from '../../utils/store.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show_image:false,
    show_attr:false,
    show_share_coupon:false,
    share_cash_id:'',
    pay_money:0,
    cash_money:0,
    new_cash:false,
    bannerGone:false,
    openPicker: true,
    needAnimation: true,
    sourcehide: false,
    group_success: false,
    groupinfo:false,
    ungetInfo:false,
    num:0,
    sign:'',
    Selected_goods_id: '',
    showModalStatus: false,
    shop_coupon_show: false,
    shop_cash_id: '',
    cash_id: '',
    show_cancel:true,
    logo: '',
    name: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_new: 1,
    show_coupon:false,
    curTab: 0,
    current: 0,
    goods: [],
    toView: '0',
    scrollTop: 100,
    foodCounts: 0,
    totalPrice: 0, // 总价格
    totalCount: 0, // 总商品数
    carArray: [],
    fold: true,
    cartShow: 'none',
    status: 0,
    url: "",
    showPopup: false,
    active: 0,
    cates: [],
    cate_id: '',
    parentIndex_pre: '',
    index_pre: '',
    cateHeight: '',
    backgroundColor: app.globalData.selectedColor,
    indexColor: app.globalData.selectedColor,
    groups:[],
    groupsShow:false,
    howGroup:false
  },
  //关闭优惠券显示
  close_coupon(){
    this.setData({
      show_coupon:false
    })
  },
  close_share_coupon(){
    this.setData({
      show_share_coupon: false
    })
  },
  //领取优惠券
  click(){
    var that=this
    if (!store.get('user_id') || app.globalData.userid == 0) {
      that.setData({
        ungetInfo: true
      })
    } else {
      get_cash({ shop_id: app.globalData.shop_id, cash_id: that.data.cash_id, user_id: app.globalData.userid }).then((res) => {
        if (res.error_code == 1000) {
          that.setData({
            show_coupon:false
          })
          wx.showLoading({
            title: '领取成功',
          })
          setTimeout(function(){
            wx.hideLoading()
          },1000)
        } else if (res.error_code == 1002) {
          that.setData({
            show_coupon: false
          })
          wx.showLoading({
            title: '重复领取',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        } else if (res.error_code == 1005) {
          that.setData({
            show_coupon: false
          })
          wx.showLoading({
            title: '超过领取次数',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        } else if (res.error_code == 1001) {
          that.setData({
            show_coupon: false
          })
          wx.showLoading({
            title: '优惠券已删除',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        } else if (res.error_code == 1004) {
          that.setData({
            show_coupon: false
          })
          wx.showLoading({
            title: '优惠券已领完',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      })
    }
  },
  //领取转发优惠券
  click_share() {
    var that = this
    if (!store.get('user_id') || app.globalData.userid == 0) {
      that.setData({
        ungetInfo: true
      })
    } else {
      get_cash({ shop_id: app.globalData.shop_id, cash_id: that.data.share_cash_id, user_id: app.globalData.userid }).then((res) => {
        if (res.error_code == 1000) {
          that.setData({
            show_share_coupon: false
          })
          wx.showLoading({
            title: '领取成功',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }else if(res.error_code==1002){
          that.setData({
            show_share_coupon: false
          })
          wx.showLoading({
            title: '重复领取',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        } else if (res.error_code == 1001) {
          that.setData({
            show_share_coupon: false
          })
          wx.showLoading({
            title: '优惠券已删除',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        } else if (res.error_code == 1004) {
          that.setData({
            show_share_coupon: false
          })
          wx.showLoading({
            title: '优惠券已领完',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      })
    }
  },
  //显示如何拼团
  showHow(){
    this.setData({
      howGroup:!this.data.howGroup
    })
  },
  //显示/隐藏拼团列表
  changeShow(){
    this.setData({
      groupsShow:!this.data.groupsShow
    })
  },
  //参团
  join_group(e){
    let that=this
    var item = e.currentTarget.dataset.item
    that.setData({
      groupsShow:false,
      groupinfo:true,
      sign:item.sign,
      num:item.count,
      name:item.name,
      photo:item.photo
    })
  },
  //得到正在拼团列表
  get_groups(id){
    var that=this
    get_groups({shop_id:id}).then((res)=>{
      if(res.error_code==1000){
        that.setData({
          groups:res.data
        })
      }
    })
  },
  //店铺信息
  get_shopinfo(id) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    //if(store.get('shop_id')){
      //app.globalData.shop_id = store.get('shop_id')
    that.showgoods(id)
    //that.get_groups(id)
    shop_info({
        shop_id: id,
        // user_id: app.globalData.userid
      }).then((res) => {
        wx.hideLoading()
        if (res.error_code == 1000) {
          var imgUrls = res.data.data.bg_picture_url
          // imgUrls.splice(1, 0, "https://image.linwushop.com/2018/12/29-16:20:59-/da886c33e6058c720e4616f7e6170b87.png");
          // imgUrls.unshift('https://image.linwushop.com/2018/12/29-16:20:59-/da886c33e6058c720e4616f7e6170b87.png')
          app.globalData.share_bg_img = res.data.data.share_bg_img
          app.globalData.is_in_food = res.data.data.is_in_food
          app.globalData.is_out_food = res.data.data.is_out_food
          app.globalData.shop_name = res.data.name
          app.globalData.shop_phone = res.data.data.cs_phone
          app.globalData.shop_address = res.data.data.shop_address
          app.globalData.business_hours = res.data.data.business_hours
          app.globalData.tag = res.data.data.tag
          app.globalData.initial_price = res.data.data.initial_price
          app.globalData.send_price = res.data.data.send_price
          app.globalData.send_type = res.data.send_type
          if (res.data.casharr!=''){
          that.data.cash_id = res.data.casharr.id
          that.data.cash_name = res.data.casharr.cash_name
          that.data.pay_money = res.data.casharr.pay_money
          that.data.cash_money = res.data.casharr.cash_money
          that.data.new_cash=true
          if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(app.globalData.userid, app.globalData.ungetInfo)
          }
          }else{
            that.data.new_cash=false
          }
          that.setData({
            is_out_food: res.data.data.is_out_food,
            shop_status:res.data.data.status,
            shopa: res.data.name,
            initial_price: parseFloat(res.data.data.initial_price),
            send_price: parseFloat(res.data.data.send_price),
            // logo: res.data.logo,
            // shop_address: res.data.data.shop_address,
            // business: res.data.data.business_hours,
            // cs_phone: res.data.data.cs_phone,
            // latitude: res.data.data.latitude,
            // longitude: res.data.data.longitude,
            imgUrls: imgUrls,
            shop_extra: res.data.data.shop_extra ? res.data.data.shop_extra:'',
            // groupimg: res.data.data.group_bg_img,
            // is_group: res.data.data.is_group,
            // bargain_bg_img: res.data.data.bargain_bg_img,
            // is_bargain: res.data.data.is_bargain,
            
            // shop_info_isshow: res.data.data.shop_info_isshow,
            // cash_bg_img: res.data.data.cash_bg_img
          })
          //  修改首页标题
          // wx.setNavigationBarTitle({
          //   title: that.data.shopa
          // })
        }
      })
    //}else{
    // wx.getLocation({
    //   success: function(res) {
    //     getShopJuLi({
    //       longitude:res.longitude,  
    //       latitude:res.latitude
    //       // longitude: 31.052511,
    //       // latitude: 121.189628
    //     }).then(res=>{
    //       app.globalData.shop_id=res.data.data[0].id
    //       store.set('shop_id', res.data.data[0].id)
    //       that.showgoods(res.data.data[0].id)
    //       shop_info({
    //         shop_id: res.data.data[0].id,
    //         // user_id: app.globalData.userid
    //       }).then((res) => {
    //         wx.hideLoading()
    //         if (res.error_code == 1000) {
    //           var imgUrls = res.data.data.bg_picture_url
    //           // imgUrls.splice(1, 0, "https://image.linwushop.com/2018/12/29-16:20:59-/da886c33e6058c720e4616f7e6170b87.png");
    //           // imgUrls.unshift('https://image.linwushop.com/2018/12/29-16:20:59-/da886c33e6058c720e4616f7e6170b87.png')
    //           //app.globalData.shop_phone = res.data.data.cs_phone
    //           app.globalData.is_in_food = res.data.data.is_in_food
    //           app.globalData.shop_name = res.data.name
    //           that.setData({
    //             shopa: res.data.name,
    //             initial_price: parseFloat(res.data.data.initial_price),
    //             // logo: res.data.logo,
    //             // shop_address: res.data.data.shop_address,
    //             // business: res.data.data.business_hours,
    //             // cs_phone: res.data.data.cs_phone,
    //             // latitude: res.data.data.latitude,
    //             // longitude: res.data.data.longitude,
    //             imgUrls: imgUrls,
    //             // groupimg: res.data.data.group_bg_img,
    //             // is_group: res.data.data.is_group,
    //             // bargain_bg_img: res.data.data.bargain_bg_img,
    //             // is_bargain: res.data.data.is_bargain,
    //             // is_cash: res.data.data.is_cash,
    //             // shop_info_isshow: res.data.data.shop_info_isshow,
    //             // cash_bg_img: res.data.data.cash_bg_img
    //           })
    //           //  修改首页标题
    //           // wx.setNavigationBarTitle({
    //           //   title: that.data.shopa
    //           // })
    //         }
    //       })
    //     })
        

    //   },
    // })
   // }
  },
 
  toMine: function () {
    wx.redirectTo({
      url: '/pages/mine/mine',
    })
  },
  toIndex:function(){
    if(this.data.show_image==true){
      this.selectInfo()
    }
  },
  selectMenu: function (e) {
    var that = this
    var index = e.currentTarget.dataset.itemIndex;
    that.data.cate_id = e.currentTarget.dataset.cate_id
    that.setData({
      active: index,
      toView: 'a' + index.toString(),
    })
  },

  //移除商品
  decreaseCart: function (parentIndex, index, spec_index) {
    this.data.goods[parentIndex].goods[index].Count--
    this.data.goods[parentIndex].goods[index].spec_count[spec_index]--
    var key_name_pre = this.data.goods[parentIndex].goods[index].key_name.split('+')
    key_name_pre.pop()
    this.data.goods[parentIndex].goods[index].key_name = key_name_pre.join('+')
    var name = this.data.goods[parentIndex].goods[index].goods_name;
    var num = this.data.goods[parentIndex].goods[index].Count;
    var mark = 'a' + index + 'b' + parentIndex + 'c' + spec_index
    var price = this.data.goods[parentIndex].goods[index].products[spec_index].goods_price;
    var image = this.data.goods[parentIndex].goods[index].goods_img
    var key_name = this.data.goods[parentIndex].goods[index].key_name
    var product_id = this.data.goods[parentIndex].goods[index].products[spec_index].product_id
    var spec_count = this.data.goods[parentIndex].goods[index].spec_count[spec_index]
    var goods_id = this.data.goods[parentIndex].goods[index].goods_id
    var obj = {
      price: price,
      num: num,
      mark: mark,
      name: name,
      index: index,
      parentIndex: parentIndex,
      image: image,
      key_name: key_name,
      product_id: product_id,
      spec_count: spec_count,
      goods_id: goods_id
    };
    var carArray1 = this.data.carArray.filter(item => item.mark != mark);
    carArray1.push(obj);
    for (var m = 0; m < carArray1.length; m++) {
      if (carArray1[m].spec_count == 0) {
        carArray1.splice(m, 1); // splice(a,b); a需要删除的位置,b删除几个
      }
    }
    this.setData({
      Count: this.data.goods[parentIndex].goods[index].spec_count[spec_index],
      carArray: carArray1,
      goods: this.data.goods
    })
    this.calTotalPrice()
    this.setData({})
    //关闭弹起
    var count1 = 0
    for (let i = 0; i < carArray1.length; i++) {
      if (carArray1[i].num == 0) {
        count1++;
      }
    }
    if (count1 == carArray1.length) {
      if (num == 0) {
        this.setData({
          cartShow: 'none'
        })
      }
    }
  },
  //添加到购物车
  addCart(parentIndex, index, spec_index) {
    var that = this
    this.data.goods[parentIndex].goods[index].Count++;
    this.data.goods[parentIndex].goods[index].spec_count[spec_index]++
    var mark = 'a' + index + 'b' + parentIndex + 'c' + spec_index
    var price = this.data.goods[parentIndex].goods[index].products[spec_index].goods_price;
    var num = this.data.goods[parentIndex].goods[index].Count;
    var name = this.data.goods[parentIndex].goods[index].goods_name;
    var image = this.data.goods[parentIndex].goods[index].goods_img
    this.data.goods[parentIndex].goods[index].key_name = this.data.goods[parentIndex].goods[index].key_name ? this.data.goods[parentIndex].goods[index].key_name + '+'+this.data.goods[parentIndex].goods[index].attr_choose.join('/') : this.data.goods[parentIndex].goods[index].attr_choose.join('/');
    var key_name = this.data.goods[parentIndex].goods[index].key_name
    var product_id = this.data.goods[parentIndex].goods[index].products[spec_index].product_id
    var spec_count = this.data.goods[parentIndex].goods[index].spec_count[spec_index]
    var goods_id = this.data.goods[parentIndex].goods[index].goods_id
    var obj = {
      price: price,
      num: num,
      mark: mark,
      name: name,
      index: index,
      parentIndex: parentIndex,
      image: image,
      key_name: key_name,
      product_id: product_id,
      spec_index: spec_index,
      spec_count: spec_count,
      goods_id: goods_id
    };
    var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    carArray1.push(obj)
    //this.data.good[parantIndex].goods[index].Count=num
    this.setData({
      Count: this.data.goods[parentIndex].goods[index].spec_count[spec_index],
      carArray: carArray1,
      goods: this.data.goods,
      show_attr:false 
    })
    this.calTotalPrice();
  },
  //打开商品详情弹窗
  show_image(e) {
    var that = this
    that.data.show_image = true
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    that.data.parentIndex_pre = parentIndex
    that.data.index_pre = index
    //that.data.Count_pre = that.data.goods[parentIndex].goods[index].Count
    // let spec_item_pre = []
     let show_spec_img = ''
    // if (that.data.goods[parentIndex].goods[index].is_on_spec == 1) {
    //   show_spec_img = that.data.goods[parentIndex].goods[index].spec_item_images[0].spec_img
    //   for (var i = 0; i < that.data.goods[parentIndex].goods[index].products.length; i++) {
    //     spec_item_pre.push(that.data.goods[parentIndex].goods[index].products[i].key_name.split(":")[1])
    //   }
    // } else if (that.data.goods[parentIndex].goods[index].is_on_spec == 0) {
     show_spec_img = that.data.goods[parentIndex].goods[index].goods_img
    //}
    that.setData({
      parentIndex_pre: parentIndex,
      index_pre: index,
      Count: that.data.goods[parentIndex].goods[index].spec_count[0],
      showModalStatus: true,
      show_cancel:true,
      chooseIndex: 0,
      is_on_spec: that.data.goods[parentIndex].goods[index].is_on_spec,
      goods_image: show_spec_img,
      goods_name: that.data.goods[parentIndex].goods[index].goods_name,
      goods_desc: that.data.goods[parentIndex].goods[index].goods_desc,
      goods_num: that.data.goods[parentIndex].goods[index].goods_num,
      goods_score: that.data.goods[parentIndex].goods[index].products[0].goods_score,
      spec_name: that.data.goods[parentIndex].goods[index].products[0].key_name.split(":")[0],
      goods_price:that.data.goods[parentIndex].goods[index].products[0].goods_price,
      market_price:that.data.goods[parentIndex].goods[index].products[0].market_price,
      spec_price_choose: that.data.goods[parentIndex].goods[index].products[0].differ_profit[that.data.num],
      //spec_item: spec_item_pre,
    })
  },
  /**
   * 关闭弹窗
   */
  selectInfo: function () {
    //var index = e.currentTarget.dataset.index;
    this.data.show_image = !this.data.show_image
    this.setData({
      showModalStatus: !this.data.showModalStatus,
    })
  },
  //清空购物车
  empty() {
    this.data.goods.forEach(function (items) {
      items.goods.forEach(function (item) {
        item.Count = 0,
        item.spec_count[0] = 0
        item.key_name=''
      })
    })
    this.setData({
      carArray: [],
      goods: this.data.goods,
      totalPrice: 0,
      totalCount: 0,
      cartShow:'none',
      Count:0
    })
  },
  /**
   * 列表页减少
   */
  decreaseShopCart: function (e) {
    var that = this
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    if (that.data.goods[parentIndex].goods[index].products.length == 1) {
      this.decreaseCart(parentIndex, index, 0)
    } else {
      that.data.parentIndex_pre = parentIndex
      that.data.index_pre = index
      //that.data.Count_pre = that.data.goods[parentIndex].goods[index].Count
      // 
      that.data.carArray.forEach(function (item) {
        if (parentIndex == item.parentIndex && index == item.index) {
          that.decreaseCart(parentIndex, index, item.spec_index)
        }
      })
    }
  },
  /**
   * 列表页增加
   */
  addShopCart: function (e) {
    var that = this
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    if (that.data.goods[parentIndex].goods[index].is_on_spec == 0) {
      that.data.goods[parentIndex].goods[index].attr_choose = []
      that.addCart(parentIndex, index, 0);
    } else if (that.data.goods[parentIndex].goods[index].is_on_spec == 1){
      //打开属性弹窗
      that.data.parentIndex_pre = parentIndex
      that.data.index_pre = index
      //var key_name=[]
      let attr_value_pre = that.data.goods[parentIndex].goods[index].attr
      let show_spec_img = ''
      attr_value_pre.forEach(function(item){
        item.attr_value_pre=item.attr_value.split('/')
        item.chooseIndex = 0
      })
      //that.data.goods[parentIndex].goods[index].attr_choose=key_name
      that.setData({
        show_attr:true,
        Count: that.data.goods[parentIndex].goods[index].spec_count[0],
        //chooseIndex: 0,
        is_on_spec: that.data.goods[parentIndex].goods[index].is_on_spec,
        //goods_image: show_spec_img,
        goods_name: that.data.goods[parentIndex].goods[index].goods_name,
        goods_attr: attr_value_pre,
        //spec_name: that.data.goods[parentIndex].goods[index].products[0].key_name.split(":")[0],
        //differ_profit: that.data.goods[parentIndex].goods[index].products[0].differ_profit, 
        spec_price_choose: that.data.goods[parentIndex].goods[index].products[0].goods_price, 
        //spec_item: spec_item_pre,
      })
    }
  },
  /**
   * 选择属性
   */
  chooseAttr(e){
    var that=this
    var show_attr_pre = that.data.goods_attr
    var cur = e.currentTarget.dataset
    show_attr_pre[cur.indexs].chooseIndex=cur.index
    that.setData({
      goods_attr:show_attr_pre,
    })
  },
  /**
   * 选择规格
   */
  chooseSpec(e) {
    var that = this
    that.setData({
      Count: that.data.goods[that.data.parentIndex_pre].goods[that.data.index_pre].spec_count[e.currentTarget.dataset.index],
      chooseIndex: e.currentTarget.dataset.index,
      differ_profit: that.data.goods[that.data.parentIndex_pre].goods[that.data.index_pre].products[e.currentTarget.dataset.index].differ_profit, 
      spec_price_choose: that.data.goods[that.data.parentIndex_pre].goods[that.data.index_pre].products[e.currentTarget.dataset.index].differ_profit[that.data.num],
      goods_image: that.data.goods[that.data.parentIndex_pre].goods[that.data.index_pre].spec_item_images[e.currentTarget.dataset.index].spec_img
    })
  },
  /**
   * 商品详情弹窗增加购物车
   */
  addCart_pre(e) {
    var that = this
    var touch = e
    that.addShopCart(touch)
  },
  /**
   * 商品详情弹窗减少购物车
   */
  decreaseCart_pre() {
    var that = this
    that.decreaseCart(that.data.parentIndex_pre, that.data.index_pre, that.data.chooseIndex)
  },
  //计算总价
  calTotalPrice: function () {
    var carArray = this.data.carArray;
    var totalPrice = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].spec_count;
      totalCount += carArray[i].spec_count
    }
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      totalCount: totalCount,
    });
  },

  //购物车
  toggleList: function () {
    // if (!this.data.totalCount) {
    //   return;
    // }
    this.setData({
      fold: !this.data.fold,
    })
    var fold = this.data.fold
    this.cartShow(fold)
  },
  cartShow: function (fold) {
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
    } else {
      this.setData({
        cartShow: 'none',
      })
    }
  },

  //结算
  toPayOrder: function (e) {
    var that=this
    store.set('coupon','')
    if (!store.get('user_id') || app.globalData.userid == 0) {
      that.setData({
        ungetInfo: true
      })
    }else{
          wx.setStorage({
            key: 'cartShop',
            data: this.data.carArray,
          })
          if (that.data.sign != '') {
            wx.navigateTo({
              url: '/pages/index/singleorderinfo/singleorderinfo?sign=' + that.data.sign + '&num=' + that.data.num
            })
          } else {
            wx.navigateTo({
              url: '/pages/index/singleorderinfo/singleorderinfo'
            })
          }
       // }
      //})
       
      
    }
  },

  reset() {
    this.setData({
      bar: app.globalData.barHeight,
      bar_banner: app.globalData.barHeight * 2 + 90,
      windowHeight: app.globalData.windowHeight - app.globalData.barHeight
    })
  },
  //属性框消失
  changeShowAttr(){
    this.setData({
      show_attr:false
    })
  },
  //点击无操作
  noChange(){
    return
  },
  /**
   * 属性弹窗添加购物车
   */
  addCartAttr(){
    let that=this    
    let parentIndex = that.data.parentIndex_pre
    let index = that.data.index_pre
    let key_name=[]
    let attr_value_pre = that.data.goods[parentIndex].goods[index].attr
    attr_value_pre.forEach(function (item) {
      key_name.push(item.attr_value_pre[item.chooseIndex])
    })
    that.data.goods[parentIndex].goods[index].attr_choose = key_name
    that.addCart(parentIndex, index, 0);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this
  if (options.seller&&options.seller!=0){
    app.globalData.seller=options.seller
  }
  if(options.parentIndex&&options.index){
    that.data.show_image=true
    that.data.parentIndex_pre=options.parentIndex
    that.data.index_pre=options.index
  }
  if (options.sign){
      that.getGroupStatus(options.sign)
  }
  if(options.cash_id){
    that.data.share_cash_id = options.cash_id
    that.setData({
      show_share_coupon:true,
      share_cash_name:options.cash_name,
      share_cash_money:options.cash_money,
      share_pay_money:options.pay_money
    })
  }
  if(options.desk_num){
    store.set('desk_num',options.desk_num)
  }else{
    store.set('desk_num','')
  }
  if(options.shop_id){
    app.globalData.shop_id = options.shop_id
    store.set('shop_id', options.shop_id)
    that.get_shopinfo(options.shop_id)
  }else if(store.get('shop_id')){
    app.globalData.shop_id = store.get('shop_id')
    that.get_shopinfo(store.get('shop_id'))
  }else{
    wx.getLocation({
       success: function(res) {
         getShopJuLi({
           longitude:res.longitude,  
           latitude:res.latitude
         }).then(res=>{
           app.globalData.shop_id=res.data.data.id
           store.set('shop_id', res.data.data.id)
           that.get_shopinfo(res.data.data.id)
         })
  }
  })
  }
    that.reset()
    if (app.globalData.userid == 0){
      app.userInfoReadyCallback = (user_id, ungetInfo,is_new,shop_id) => {
        app.globalData.userid = user_id
        store.set('user_id',user_id)
        if (is_new==1 && that.data.new_cash == true) {
          that.setData({
            show_coupon: true,
            cash_name:that.data.cash_name,
            pay_money: that.data.pay_money,
            cash_money: that.data.cash_money,
          })
        } else {
          that.setData({
            show_coupon: false
          })
        }
        isUserInfo({
          user_id: user_id,
          shop_id: shop_id,
        }).then(response => {
          if (response.error_code == 1000) {
            response.data.forEach(function (item) {
              if (item.type == 2) {
                app.globalData.seller = user_id
              }
            })
          }
        })
    }
    }else{
      if (app.globalData.is_new == 1 && that.data.new_cash == true){
        that.setData({
          show_coupon: true,
          cash_name: that.data.cash_name,
          pay_money: that.data.pay_money,
          cash_money: that.data.cash_money,
        })
      } else {
        that.setData({
          show_coupon: false
        })
      }
    }
    //that.showcates()
    //that.showgoods()
    //if (app.globalData.userid && app.globalData.userid != 0) {
    //   if (options.type == 'share' && options.self_id) {
    //     wx.navigateTo({
    //       url: '/pages/shoppages/othersCut/othersCut?openid=' + options.openid + '&self_id=' + options.self_id + '&goods_id=' + options.goods_id
    //     })
    //   } else if (options.type == 'share_goods') {
    //     wx.navigateTo({
    //       url: '/pages/shoppages/goods/goods?openid=' + options.openid + '&goods_id=' + options.goods_id,
    //     })
    //   }
    //   that.get_shopinfo()
    //   that.showcates()
    //   that.showgoods()
    // } else {
    //   app.userInfoReadyCallback = (userInfo, ungetInfo) => {
    //     that.setData({
    //       ungetInfo: app.globalData.ungetInfo
    //     })
    //     if (userInfo != 0) {
    //       if (options.type == 'share' && options.self_id) {
    //         wx.navigateTo({
    //           url: '/pages/shoppages/othersCut/othersCut?openid=' + options.openid + '&self_id=' + options.self_id + '&goods_id=' + options.goods_id
    //         })
    //       } else if (options.type == 'share_goods') {
    //         wx.navigateTo({
    //           url: '/pages/shoppages/goods/goods?openid=' + options.openid + '&goods_id=' + options.goods_id,
    //         })
    //       }
    //       that.get_shopinfo()
    //       that.showcates()
    //       that.showgoods()
    //     }
    //   }
    // }
  },
  //查询团购状态
  getGroupStatus(sign){
    let that=this
    group_status({
      sign:sign
    }).then(res=>{
      if (res.data.status == 1) {
        if (res.data.num < 3) {
          that.setData({
            photo:res.data.photo,
            name: res.data.name,
            num: res.data.num,
            groupinfo: true,
            sign:sign
          })
        } else if (res.data.num >= 3) {
          that.setData({
            sourcehide: true,
            group_success: true,
            sign: ''
          })
          setTimeout(function () {
            that.setData({
              sourcehide: false,
              group_success: false
            })
          }, 3000)
        }
      } else if (res.data.status == 2) {
        that.setData({
          sourcehide: true,
          group_over: true,
          sign: ''
        })
        setTimeout(function () {
          that.setData({
            sourcehide: false,
            group_over: false
          })
        }, 3000)
      }
    })
  },
  showgoods(id) {
    var that = this
    var goods_pre = []
    newTeaGoods({
      shop_id: id,
      sign:that.data.sign
    }).then((res) => {
      res.data.goods.forEach(function (items) {
        items.goods.forEach(function (item) {
          var spec_count = []
          for (var i = 0; i < item.products.length; i++) {
            spec_count.push(0)
          }
          item.Count = 0
          item.spec_count = spec_count
        })
      })
      if (that.data.show_image == false) {
      that.setData({
        goods: res.data.goods
      })
      } else if (that.data.show_image == true){
        let index = that.data.index_pre
        let parentIndex = that.data.parentIndex_pre
        let show_spec_img = ''
        show_spec_img = res.data.goods[parentIndex].goods[index].goods_img
        that.setData({
          parentIndex_pre: parentIndex,
          index_pre: index,
          Count: res.data.goods[parentIndex].goods[index].spec_count[0],
          showModalStatus: true,
          chooseIndex: 0,
          is_on_spec: res.data.goods[parentIndex].goods[index].is_on_spec,
          goods_image: show_spec_img,
          goods_name: res.data.goods[parentIndex].goods[index].goods_name,
          goods_desc: res.data.goods[parentIndex].goods[index].goods_desc,
          goods_num: res.data.goods[parentIndex].goods[index].goods_num,
          goods_score: res.data.goods[parentIndex].goods[index].products[0].goods_score,
          spec_name: res.data.goods[parentIndex].goods[index].products[0].key_name.split(":")[0],
          goods_price:res.data.goods[parentIndex].goods[index].products[0].goods_price,
          market_price:res.data.goods[parentIndex].goods[index].products[0].market_price,
          spec_price_choose:res.data.goods[parentIndex].goods[index].products[0].differ_profit[that.data.num],
          goods: res.data.goods
        })
      }
    })
  },

  showcates() {
    var that = this
    var cates_pre = []
    sel_cate({
      shop_id: app.globalData.shop_id
    }).then((res) => {
      if (res.error_code == 1000) {
        res.data.forEach(function (item, index) {
          cates_pre.push({
            cate_name: item.cate_name,
            cate_id: item.cate_id,
            //Refresh: Refresh[index] 
          })
        })
        that.setData({
          cate_infos: res.data,
          cates: cates_pre,
          cateHeight: cates_pre.length * 108
        })
      }
    })
  },

  // 授权登录
  bindGetUserInfo: function (e) {
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.code = res.code
        store.set('me', e.detail.userInfo)
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = e.detail.userInfo
        auth({
          //shop_id: app.globalData.shop_id,
          code: app.globalData.code,
          name: e.detail.userInfo.nickName,
          photo: e.detail.userInfo.avatarUrl,
          sex: e.detail.userInfo.gender
        }).then((response) => {
          if (response.error_code == 1000) {
            // app.globalData.u = response.data.u
            app.globalData.userid = response.data.user_id
            store.set('openid', response.data.openid)
            store.set('user_id', response.data.user_id)
            that.setData({
              ungetInfo: false
            })
            addShopCard({user_id: response.data.user_id,shop_id:app.globalData.shop_id}).then(res=>{
              if (res.error_code == 1001) {
                that.setData({
                  ungetInfo:false,
                  show_coupon:false
                })
              }else if(res.error_code==1000){
                that.setData({
                  ungetInfo: false,
                  show_coupon: true
                })
              }
            })
            isUserInfo({
              user_id: response.data.user_id,
              shop_id: app.globalData.shop_id,
            }).then(res => {
              if (res.error_code == 1000) {
                res.data.forEach(function (item) {
                  if (item.type == 2) {
                    app.globalData.seller = response.data.user_id
                  }
                })
              }
            })
            app.globalData.ungetInfo = false
            that.setData({
              ungetInfo: false
            })
          }
        })
      }
    })
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
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
  //监听页面滚动
  onPageScroll: function (e) {
    if (e.scrollTop > 100 && !this.data.bannerGone) {
      this.setData({
        bannerGone: true
      })
    }
  },
  show_banner(){
    this.setData({
      bannerGone: false
    })
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
  onShareAppMessage: function (e) {
    if (e.from == 'button') {
      // this.setData({
      //   show_cancel:false
      // })
      return {
        title: '【' + app.globalData.shop_name + '】' + this.data.goods_name,
        path: '/pages/index/index?shop_id=' + app.globalData.shop_id + '&seller=' + app.globalData.seller + '&parentIndex=' + this.data.parentIndex_pre +'&index='+this.data.index_pre,
        imageUrl: '',
        success: function (res) {
          // console.log('22222')
          // this.setData({
          //   show_cancel: true
          // })
        },

      }
    } else if (e.from == 'menu') {
      return {
        title: '【' + app.globalData.shop_name + '】今日特价，为你，千千万万遍！',
        path: '/pages/index/index?shop_id=' + app.globalData.shop_id + '&seller=' + app.globalData.seller,
        imageUrl: app.globalData.share_bg_img,
        success: function (res) {
        }
      }
    }
  }
})