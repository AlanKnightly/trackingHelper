
// 请求拦截器
// On install 在被安装的时候去初始化
chrome.runtime.onInstalled.addListener(function(){
  // 添加事件  
  chrome.webRequest.onBeforeSendHeaders.addListener(requestHandle, {
      urls: ["<all_urls>"],// 拦截所有URL的请求
  },["blocking"]); // 阻塞式
});

// 添加header
function requestHandle(request) {
  let actionUrl = request.url;
  if(/https:\/\/sensor\-bigdata\-test\.sdbattery\.net/.test(actionUrl)){
    var qs = actionUrl.split('?')[1]
    console.log('qs:',qs)
    var paramsObject = new URLSearchParams(qs)
    const decodedData = window.atob(paramsObject.get('data'))
    console.log(decodedData)
    
  }
}