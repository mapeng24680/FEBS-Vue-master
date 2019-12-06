export function triggerWindowResizeEvent () {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}
export function setCookie (name, value) {
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
}
export function getCookie(name) {
  let cookieList = document.cookie.split(';');
  for (let i = 0; i < cookieList.length; i++) {
    if (cookieList[i].split('=')[0].replace(/\s*/g, "") == name) {
      return cookieList[i].split('=')[1]
    }
  }
}
export function delCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}
