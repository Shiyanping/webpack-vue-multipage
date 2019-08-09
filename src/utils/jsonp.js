import jsonp from 'jsonp';
import { urlParamsFormat } from './index';

export default function requestJsonp(options) {
  let { url, data, option = {} } = options;
  const urlParams = urlParamsFormat(data);
  url = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}${urlParams}`;

  return new Promise((resolve, reject) => {
    jsonp(url, option, (err, response) => {
      // 请求成功
      if (!err) {
        const { data, success, message } = response;
        if (success) {
          // 成功返回
          resolve(data);
        } else {
          // 后台报错
          console.log(message);
          reject(response);
        }
      } else {
        // 请求不成功
        reject(err);
      }
    });
  });
}
