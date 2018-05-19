(function() {
var config = {
    region: 'SCN', // 我自己加的 pl
    qiniuUploadURL: 'https://upload-z2.qiniup.com', /*配置自己七牛服务器的域名，Z2是华南区的，可在七牛文档查*/
    qiniuImageURLPrefix: 'https://image.yourdomain/', /*下载、查看图片等，需要配自己的域名，在dns里配TXT转到七牛*/
    qiniuUploadToken: '',
    qiniuUploadTokenURL: 'https://yourdomain/uptoken', /*配置自己服务器的域名，获取传图token*/
    qiniuUploadTokenFunction: null
}

module.exports = {
    init: init,
    upload: upload
}

// 在整个程序生命周期中，只需要 init 一次即可
// 如果需要变更参数，再调用 init 即可
function init(options) {
    config = {
        region: '',
        qiniuUploadURL: '',
        qiniuImageURLPrefix: '',
        qiniuUploadToken: '',
        qiniuUploadTokenURL: '',
        qiniuUploadTokenFunction: null
    };
    updateConfigWithOptions(options);
}

function updateConfigWithOptions(options) {
    if (options.uploadURL) {
        config.qiniuUploadURL = options.uploadURL;
    } else {
        console.error('qiniu uploader need uploadURL');
    }
    if (options.uptoken) {
        config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
        config.qiniuUploadTokenURL = options.uptokenURL;
    } else if(options.uptokenFunc) {
        config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
        config.qiniuImageURLPrefix = options.domain;
    }
}

function upload(filePath, success, fail, options) {
    if (null == filePath) {
        console.error('qiniu uploader need filePath to upload');
        return;
    }
    // if (options) {
    //     init(options);
    // }
    if (config.qiniuUploadToken) {
        doUpload(filePath, success, fail, options);
    } else if (config.qiniuUploadTokenURL) {
        getQiniuToken(function() {
            doUpload(filePath, success, fail, options);
        });
    } else if (config.qiniuUploadTokenFunction) {
        config.qiniuUploadToken = config.qiniuUploadTokenFunction();
    } else {
        console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
        return;
    }
}

function doUpload(filePath, success, fail, options) {
    var url = config.qiniuUploadURL;
    var fileName = filePath.split('//')[1];
    if (options && options.key) {
        fileName = options.key;
    }
    var formData = {
        'token': config.qiniuUploadToken,
        'key': fileName
    };
    wx.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file',
        formData: formData,
        success: function (res) {
            var dataString = res.data
            var dataObject = JSON.parse(dataString);
            //do something
            var imageUrl = config.qiniuImageURLPrefix + dataObject.key;
            dataObject.imageURL = imageUrl;
            console.log(dataObject);
            success(dataObject);
        },
        fail: function (error) {
            console.log(error);
            fail(error);
        }
    })
}

function getQiniuToken(callback) {
  wx.request({
    url: config.qiniuUploadTokenURL,
    success: function (res) {
      var token = res.data.uptoken;
      config.qiniuUploadToken = token;
      if (callback) {
          callback();
      }
    },
    fail: function (error) {
      console.log(error);
    }
  })
}

})();
