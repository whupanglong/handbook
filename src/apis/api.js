import wepy from 'wepy'
import {
  wxRequest
} from '../utils/wxRequest';

const apiHost = 'https://yourdomain/'

const API = {
  'yourapi': async function(params) {
    return await wxRequest(params, apiHost + 'xx/xxxxx')
  }
}

module.exports = API
