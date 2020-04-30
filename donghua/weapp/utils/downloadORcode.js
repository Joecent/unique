
function savePicToAlbum(tempFilePath) {
  let that = this;
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.showToast({
                  title: '保存成功'
                });
              },
              fail(res) {
                console.log(res);
              }
            })
          },
          fail() {
            // 用户拒绝授权,打开设置页面
            wx.openSetting({
              success: function (data) {
                console.log("openSetting: success");
              },
              fail: function (data) {
                console.log("openSetting: fail");
              }
            });
          }
        })
      } else {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            });
          },
          fail(res) {
            console.log(res);
          }
        })
      }
    },
    fail(res) {
      console.log(res);
    }
  })
}
function image() {
  var imageSize = {};
  // var originalScale = 0.2;//图片高宽比  
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      // var windowscale = windowHeight / windowWidth;//屏幕高宽比  
      imageSize.imageWidth = windowWidth;
      imageSize.imageHeight = windowHeight;
      // if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比  
      //   //图片缩放后的宽为屏幕宽  
      //   imageSize.imageWidth = windowWidth;
      //   imageSize.imageHeight = (windowWidth * 400) / 320;
      //   imageSize.chaWidth = windowWidth - 320;
      //   imageSize.chaHeight = (windowWidth * 400) / 320 - 400;
      // } else {//图片高宽比大于屏幕高宽比  
      //   //图片缩放后的高为屏幕高  
      //   imageSize.imageHeight = windowHeight;
      //   imageSize.imageWidth = (windowHeight * 320) / 400;
      //   imageSize.chaWidth = windowWidth - 320;
      //   imageSize.chaHeight = (windowWidth * 400) / 320 - 400;
      // }

    }
  })
  return imageSize;
}
module.exports = {
  // formatTime: formatTime,
  savePicToAlbum: savePicToAlbum,
  image: image
}