import wepy from 'wepy'
import 'wepy-async-function'
import CONSTANT from './constant'
import category from './CATEGORY'
import API from '../apis/api'

export default class Mixin extends wepy.mixin {
  // 判断数组中是否有xx
  $inArray (array, item) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return true;
      }
    }
    return false;
  }

  $getCategory (species) {
    return category[species]
  }

  _to2Str = (num)=>{
    return ('0' + num).substr(-2,2)
  }
  // 输出2017-05-27这样的格式
  $formatDate (date='', addTime = false) {
    let d = new Date(date)
    let time = addTime ? (' ' + this._to2Str(d.getHours()) + ':' + this._to2Str(d.getMinutes()) + ':' + this._to2Str(d.getSeconds())) : ''
    return d.getFullYear() + '-' + this._to2Str(1+d.getMonth()) + '-' + this._to2Str('0'+d.getDate()) + time
  }

  // 深度复制object
  $copyObj (ori) {
    return JSON.parse(JSON.stringify(ori))
  }

  // 查看大图
  $previewImage (e) {
    let url = e.currentTarget.dataset.url
    wepy.previewImage({'urls': [url]})
  }

  $toast (msg, success=true) {
    if (success) {
      wepy.showToast({'title': msg})
    } else {
      wepy.showToast({'title': msg, 'image': '../../images/bug.png'})
    }
  }

  // 判断基础库版本是否符合需要
  $isVerAbove (ver) {
    let sysInfo = wepy.getSystemInfoSync()
    return sysInfo.SDKVersion >= ver
  }

  // 进行微信登陆, 更新或者注册用户
  async $login(force=false) {
    // 爬友圈session
    let drSess = wepy.getStorageSync(CONSTANT.DR_SESS) || null
    // 如果没有或者过期了就从新获取一下
    if (!drSess || !drSess.expires || drSess.expires < Date.now() || force) {
      let loginRes = await wepy.login() // 获取code
      console.log('重新获取登录态', loginRes)

      if (loginRes['code']) {
        // let baseUserInfo = await wepy.getUserInfo({'lang': 'zh_CN'})// 微信的基本信息，用于更新服务器的存储
        // code换登录鉴权
        let dr = await API.jscode2Session({'query': {'jscode': loginRes['code']/*, 'base': baseUserInfo*/}})
        if (dr && dr.data) {
          wepy.setStorageSync(CONSTANT.DR_SESS, dr.data)
          drSess = dr['data']// 同爬友圈一个redis管理，前缀区分
        }else{
          return false
        }
      } else {
        return false
      }
    }
    return drSess['drSess']
  }
}
