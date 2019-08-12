import request from '@/utils/request';
import requestJsonp from '@/utils/jsonp';
import hostSetting from './host_setting';

export function getClubActivityList() {
  return request({
    url:
      'https://xwz.coohua.com/task/sign/history?base-key=9VbTPbdKqOcFausRd_ztnArQldzz0m4Xz6E0flYBGBrOP_chqmncOTvHPgFg9djK',
    method: 'get'
  });
}

export function getClubDetail() {
  return requestJsonp({
    url: `${hostSetting.activityTest}/club/oneWorkInfo?aid=13&test=test`,
    data: {
      aid: 13,
      wid: 84958
    }
  });
}
