﻿// ==UserScript==
// @include http://steamcommunity.com/market*
// ==/UserScript==


(function(){

function init(){

	var el = document.getElementById('tabContentsMyListings');
	if(el)
	{
		mainPage(el);
	} else
	if(document.getElementById('largeiteminfo_item_name'))
	{
		itemPage();
	}

}

function mainPage(tabContentsMyListings){
	var listingid;
	
	// styles
	document.body.insertAdjacentHTML("afterBegin", 
		'<style>.scrollbl_listing{max-height:500px;overflow-y:scroll;} .lfremove{display:inline-block}</style>'
	);
	
	
	//// Remove button
	// add
	var el = document.querySelector('#tabContentsMyListings .market_listing_edit_buttons').innerHTML='<a href="#checkAllListings" id="btnCheckAllListings" class="item_market_action_button item_market_action_button_blue"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">Выбрать все</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a> <a href="#removeListings" id="btnRemoveListings" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">Удалить выбранные</span><span class="item_market_action_button_edge item_market_action_button_right"></span></a>';
	
	// set function
	window.$J('#btnCheckAllListings').click(function(){
		window.$J('.lfremove').attr('checked',!window.$J('.lfremove:first')[0].checked)
		return false;
	});
	window.$J('#btnRemoveListings').click(function(){
		var data = [];
		
		window.$J('.lfremove').each(function(i, el){
			if(el.checked)
				data.push(el);
		});

		function run(i){
			if(i<data.length)
				new window.Ajax.Request('http://steamcommunity.com/market/removelisting/'+window.$J(data[i]).data('listingid'), {
					method: 'post',
					parameters: {
						sessionid: window.g_sessionID,
					},
					onComplete: function() {
						run(++i);
					},
					onSuccess: function() {
						data[i].parentElement.parentElement.parentElement.parentElement.remove();
					}
				});
		}
		if(data.length)
			run(0);
		
		return false;
	});

	var rows = window.$J('#tabContentsMyListings .market_listing_row').detach();
	window.$J('.market_content_block.my_listing_section.market_home_listing_table').append('<div class="scrollbl_listing"></div>').click;
	rows.prependTo("#tabContentsMyListings .scrollbl_listing");
	
	window.$J('.market_listing_cancel_button a').each(function(i, el){
		var res = decodeURIComponent(String(el.href)).match(/mylisting', '(\d+)', (\d+), '(\d+)', '(\d+)'/i);
		if(res){
			window.$J(el).before('<span class="item_market_action_button_contents"><input type="checkbox" class="lfremove" data-listingid="'+res[1]+'"/></span>');
			window.$J(el).remove();
		}
	});
	var myListings = window.$J('#tabContentsMyListings span.market_listing_price');
	if(myListings){
	
		var total = 0;
		for(var i=0; myListings.length>i; i++){
			total += parseFloat(myListings[i].innerHTML.match(/(\d+(?:[.,]\d{1,2})?)/)[1].replace(',','.'))*100;
		}
		window.$J('#my_market_activelistings_number').append(' / '+window.v_currencyformat(total, window.GetCurrencyCode(window.g_rgWalletInfo.wallet_currency)));
	}

}

function itemPage(){
	//// accept ssa checked
	window.$('market_buynow_dialog_accept_ssa').checked=true;
}

var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
	
})();