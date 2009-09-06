// ==UserScript==
// @name           AmazonTOCPreview
// @namespace      http://weblibrary.s224.xrea.com/weblog/
// @description    Preview Amazon book table of contents + himeji_libsearchlink.
// @include        http://www.amazon.co.jp/*
// ==/UserScript==

(function () {
  if (!document.body.parentNode.innerHTML.match(/<li><b>ISBN\-10:<\/b>\s(\d{9}[\d|X])<\/li>/))
    return;
  var isbn10 = RegExp.$1;
  var bl = document.getElementById("btAsinTitle");
  var bt = document.getElementById("btAsinTitle").innerHTML;
  var sw = bt.match(/(.*?)\(.*?\)$/);
  var ysw = decodeURIComponent(sw[1]);
	ysw = ysw.substring(0,10);

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
	var lib_link = document.createElement('a');
	lib_link.setAttribute('href', 'http://www.library.city.himeji.hyogo.jp/cgi-bin/Sopcsken.sh?p_mode=1&srsl1=1&srsl2=2&tgid=tyo%3A010A' + isbn10);
	lib_link.setAttribute('title', 'To Himeji City Library');
	lib_link.setAttribute('target', '_blank');
	lib_link.innerHTML = '</br><span style=\" padding:5px; color: #ffffff; background-color:#AB5010;\">>> 姫路市図書館蔵書検索をする</span>';
	var yauc_links = document.createElement('a');
	yauc_links.setAttribute('href', 'http://search.auctions.yahoo.co.jp/jp/search/auc?auccat=21600&f=0x2&alocale=0jp&apg=1&s1=end&o1=a&mode=2&p=' + ysw);
	yauc_links.setAttribute('title', 'To auctionbookYahoo');
	yauc_links.setAttribute('target', '_blank');
	yauc_links.innerHTML = '<span style=\" margin:10px;padding:3px; color: #ffffff; background-color:#AB5010;\">>> ヤフーオークション検索をする</span>';
	if(reParse){
		link.innerHTML = reParse[1];
	}else{
		link.innerHTML = '目次情報が見つかりませんでした。';
	}
	block.parentNode.insertBefore(yauc_links, block.nextSibling);
	block.parentNode.insertBefore(lib_link, block.nextSibling);
	block.parentNode.insertBefore(link, block.nextSibling);
    }
  });
})();



