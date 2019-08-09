export function urlParamsFormat(params) {
  const paramsStr = Object.keys(params)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

  return paramsStr;
}
