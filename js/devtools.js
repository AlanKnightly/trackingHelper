chrome.devtools.panels.create(
  "Track Help",
  "FontPicker.png",
  "../html/panel.html",
  /**
   *  panel对象- {onShown:{},onHidden:{},onSearch:{}}
   */
  function (panel) {
    let panelWindow = null;
    // Add request checker
    function addTrackingWatcher (w) {
      panelWindow = w;
      chrome.devtools.network.onRequestFinished.addListener(
        requestHandle,
        {
          urls: ["<all_urls>"],// 拦截所有URL的请求
        }, ["blocking"] // 阻塞式
      );
    }
    // Remove request checker
    function removeTrackingWatcher (w) {
      panelWindow = null;
      chrome.devtools.network.onRequestFinished.removeListener(
        requestHandle,
        {
          urls: ["<all_urls>"],// 拦截所有URL的请求
        }, ["blocking"] // 阻塞式
      );
    }
    // Request Checker
    function requestHandle (e) {
      let actionUrl = e.request.url;
      if (/https:\/\/sensor\-bigdata\-test\.sdbattery\.net/.test(actionUrl)&&panelWindow) {
        const trackingInfoSTr = extractInfo(actionUrl)
        const liDom = domFactory(trackingInfoSTr)
        panelWindow.document.querySelector('#tracking-list').appendChild(liDom);
      }
    }
    panel.onShown.addListener(addTrackingWatcher);
    panel.onHidden.addListener(removeTrackingWatcher);
  });
// 仅递归检查 $开头的默认埋点属性
function recursionDel(obj){
  for (let p in obj){
    if(/^\$/.test(p)){
       delete obj[p]
    }else{
      if(typeof obj[p] === "object" ){
        recursionDel(obj[p])
      }
    }
  }
}

function del$(str){
  const obj = JSON.parse(str)
   recursionDel(obj)
  return JSON.stringify(obj)
}

// Url中提取信息并以DOM返回
function extractInfo(actionUrl){
  var qs = actionUrl.split('?')[1];
  var paramsObject = new URLSearchParams(qs);
  const decodedData = window.atob(paramsObject.get('data'));
  return del$(decodedData)
}

// 接收infoObj对象并返回合适的DOM片段
function domFactory(infoObjStr){
  const dataContent = document.createTextNode(infoObjStr)
  const liDOM = document.createElement('li')
  liDOM.appendChild(dataContent)
  return liDOM
}

// function producePList(node){


// }