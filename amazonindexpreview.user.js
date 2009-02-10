// ==UserScript==
// @name           AmazonINDEXPreview
// @namespace      http://weblibrary.s224.xrea.com/weblog/
// @description    Preview Amazon book index.
// @include        http://www.amazon.co.jp/*
// ==/UserScript==

(function () {
  if (!document.body.parentNode.innerHTML.match(/<li><b>ISBN\-10:<\/b>\s(\d{9}[\dX])<\/li>/))
    return;
  var isbn10 = RegExp.$1;

  var block = document.evaluate(
    "//div[@id='priceBlock']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (!block)
    return;

  GM_xmlhttpRequest({
    method : 'GET',
    url : 'http://www.amazon.co.jp/gp/product/toc/' + isbn10,
    onload : function(resp) {
	var link = document.createElement('div');
	var rePage = resp.responseText.replace(/\n/g, ' ');
	var reParse = rePage.match(/\"bucket\">(.*?)<\/div>/);
	link.setAttribute('style', 'padding: 0px 10px;border: #E47911 1px solid;');
	link.innerHTML = reParse[1];
    block.parentNode.insertBefore(link, block.nextSibling);
    }
  });
})();



