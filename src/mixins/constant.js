const CONSTANT = {
  'DR_SESS': 'drSession',
  'QINIU_IMG_STYLE': '?imageView2/0/format/png/interlace/1/q/75|imageslim',
  // 'IMAGE_ROUTE': 'https://img.drhhy.com/'
  'IMAGE_ROUTE': 'https://lithops.payouquan.cn/',
  'CATEGORY': 'private-category',
  'PRESENT_SHOP': 'present-shop',
  'CUT_IMG': '?imageView2/1/w/500/h/500', // 裁剪正中部分，等比缩小生成300x300缩略图：
  'ROUND_IMG': '?roundPic/radius/!50p', // 圆形图片
  'SLIM': '?imageslim', // 图片压缩，肉眼不可见
  'ORDER_STATUS': ['待付款', '待发货', '待签收', '已完成'/*'退款申请', '已取消', */]
} // end of data

module.exports = CONSTANT
