// 正则判断是否为正确的手机号
export const isPhone = (phone) => {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[3678])[0-9]{8}$/;
  return reg.test(phone);
};
// 格式化秒数
export const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
  return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
}
// 格式化数字统计
export const formatNumber = (data) => {
  const strNum = String(data);
  switch(strNum.length) {
    case 1: ;
    case 2: ;
    case 3: return strNum;break;
    case 4: return `${strNum.slice(0, 1)}千`;break;
    case 5: return `${strNum.slice(0, 1)}万`;break;
    case 6: return `十万+`;break;
  }
}