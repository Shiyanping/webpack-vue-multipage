import request from '@/utils/request';
import requestJsonp from '@/utils/jsonp';
import hostSetting from './host_setting';

export function getClubActivityList() {
  return request({
    url: 'xxx',
    method: 'get'
  });
}

export function getClubDetail() {
  return requestJsonp({
    url: `${hostSetting.baidu}xxx`,
    data: {
      aid: 13,
      wid: 84958
    }
  });
}
