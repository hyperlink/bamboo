// Copyright (c) 2013 by Xiaoxin Lu
/**
 * Chainable browser actions! A wrapper for chrome.browserAction
 */
var browserAction = (function(cba){
	return {
		setBroken: function(){
			cba.setBadgeText({text: "\u00D7" })
			cba.setBadgeBackgroundColor({color:[255,0,0,255]})
			return this
		},

		setSystemNotice: function(text, title) {
			if (title != null) this.setTitle(title)
			cba.setBadgeText({text:text})
			cba.setBadgeBackgroundColor({color:[194,116,0,255]})
			return this
		},

		setGood: function(title) {
			cba.setBadgeText({text:"\u2022"})
			cba.setBadgeBackgroundColor({color:[0,255,0,255]})
			if (title != null) this.setTitle(title)
			return this
		},

		setTitle: function(title) {
			cba.setTitle({title: title})
			return this
		},

		addClick: function(fn) {
			cba.onClicked.addListener(fn)
			return this
		},

		removeClick: function(fn) {
			cba.onClicked.removeListener(fn)
			return this
		}
	}
})(chrome.browserAction);