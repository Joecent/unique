import { base } from './authConfig.js';
import * as store from '../store.js';

const get = (path, params, showToast) => {
  const newParams = { ...params };
   newParams.sessionId = store.get('sessionId') || 'undefined';
   newParams.appId = store.appId;
  if (showToast) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
    });
  }

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        wx.hideToast();
        if (!res.data.code) {
          resolve(res.data);
        } else {
          if (res.data.code == 10001){
            return
            store.set('sessionId', '');
            store.set('peopleId', '');
            store.set('me', '');
            get('account/sessionId', {}, (res) => {
              store.set('sessionId', res);
            });

            wx.showModal({
              title: '小提示',
              content: '会话已过期，请重新登录',
              confirmColor: '#ffa42f',
              showCancel: false,
              success: () => {
                getApp().auth(()=>{
                  get(cmd, params, callback);
                });
              },
            });
            return;
          }
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffa42f',
            showCancel: false,
          });
        }
      },
      fail: (error) => {
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
        wx.showToast({
          title: '网络出错',
          image: '/images/timeout.png',
          mask: true,
          duration: 1500,
        });
      },
    });
  });
};

const post = (path, params, showToast) => {
  const newParams = { ...params };
   newParams.sessionId = store.get('sessionId') || 'undefined';
   newParams.appId = store.appId;

  if (showToast) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
    });
  }

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        wx.hideToast();
        if (!res.data.code) {
          resolve(res.data);
        } else {
          if(res.data.code == 10001){
            store.set('sessionId', '');
            store.set('peopleId', '');
            store.set('me', '');
            get('account/sessionId', {}, (res) => {
              store.set('sessionId', res);
            });

            wx.showModal({
              title: '小提示',
              content: '会话已过期，请重新登录',
              confirmColor: '#ffaf0e',
              showCancel: false,
              success: () => {
                getApp().auth(()=>{
                  post(cmd, params, callback);
                });
              },
            });
            return;
          }
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false,
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错',
          image: '/images/timeout.png',
          mask: true,
          duration: 1500,
        });
      },
    });
  });
};

const http = {
  post,
  get,
};

export default http;
