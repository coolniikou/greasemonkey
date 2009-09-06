// ==UserScript==
// @name           AmazonTOCPreview+
// @namespace      http://weblibrary.s224.xrea.com/weblog/
// @description    Preview Amazon book table of contents + kobe_libsearchlink.
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
	lib_link.setAttribute('href', 'https://www.lib.city.kobe.jp/opac/opacs/find_books?AGE=b&ISNUMBER=isbn&author-andor=and&btype=B&dispcnt=50&isbn=' + isbn10  + '&kanname%5Ball-pub%5D=1&kanname%5Ball-pub%5D=0&kanname%5Bcentral%5D=0&kanname%5Be-nada%5D=0&kanname%5Bhokushin%5D=0&kanname%5Bhyogo%5D=0&kanname%5Bkobe-ccn%5D=0&kanname%5Bkobe-cufs%5D=0&kanname%5Bnada%5D=0&kanname%5Bnagata%5D=0&kanname%5Bnorth%5D=0&kanname%5Bsannomiya%5D=0&kanname%5Bsuma%5D=0&kanname%5Btarumi%5D=0&kanname%5Bwest%5D=0&keyword-andor=and&lang=all&searchmode=syosai&sh-andor=and&title-andor=and');
	lib_link.setAttribute('title', 'To Kobe City Library');
	lib_link.setAttribute('target', '_blank');
	lib_link.innerHTML = '</br><span style=\" margin:10pz; padding:3px; color: #ffffff; background-color:#AB5010;\">>> 神戸市図書館蔵書検索をする</span>';
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



