// ==UserScript==
// @name         KimCartoon Fetch Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://kimcartoon.me/Cartoon/*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {

	GM_setClipboard($kissenc.getSecretKey());
	localStorage.secretkey = $kissenc.getSecretKey();
	dispatchEvent(new Event("key"));
	// $("body").keypress(e=>e.key=" " && obj($("#divDownload a").get().map(i=>i.href).join("\n")))
})();
