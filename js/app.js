// Copyright (c) 2013 by Xiaoxin Lu

/*globals browserAction:false, bambooApi:false, webkitNotifications:true */

var REFRESH_INTERVAL = 60
const BUILD_IS_GOOD_MSG = 'Build is good'

function initApp() {
	if (bambooHost) {
		browserAction.setSystemNotice("Sync", "Checking server...")
		start()
	} else {
		browserAction.setSystemNotice("Setup", "Click to setup your Bamboo monitor");
		launchSetup()
	}

	browserAction.addClick(function(){
		chrome.tabs.create({ url : getBrowserActionClickLocation() })
	})
}

function getBrowserActionClickLocation() {
	return bambooHost || 'options.html'
}

function launchSetup() {
	chrome.tabs.create({
		url: 'options.html',
		selected: true
	})
}

function start() {
	bambooApi.getCurrentUser().
		then(requestStatus).
		fail(function handleStartFailure(){
			setApiError.apply(this, arguments)
			setTimeout(start, REFRESH_INTERVAL*1e3)
		})
}

function requestStatus() {
	bambooApi.getFavoriteResults().then(processResult).fail(setApiError)
	setTimeout(requestStatus, REFRESH_INTERVAL*1e3)
}

function setApiError(errorObj, msg, msg2) {
	console.error(errorObj)
	browserAction.setSystemNotice(msg, msg2)
}

function processResult (data) {
	var results = data.results
	if (results.size > results['max-result']) {
		return setApiError({}, 'error', 'Too many results. Not logged in?')
	}

	var badBuilds = results.result.filter(isBad)

	if (badBuilds.length) {
		var message = buildBrokenDisplayMessage(badBuilds)
		browserAction.setBroken().setTitle('Build is broken: ' + message)
		desktopNotify(message)
	} else {
		browserAction.setGood(BUILD_IS_GOOD_MSG)
		desktopNotify(BUILD_IS_GOOD_MSG)
	}
}

function buildBrokenDisplayMessage(badBuilds) {
	var message = []
	badBuilds.forEach(function(build) {
		message.push(build.projectName + " ⇨ " + build.planName)
	})
	return message.join(', ')
}

function isBad(result) {
	return result.state != 'Successful'
}

function desktopNotify(message) {
	if ( webkitNotifications.checkPermission() === 0 && desktopNotify.lastMessage != message) {
		var note = webkitNotifications.createNotification(
			"images/BAMBOO.png", "Builds Status", message)
		note.show()
		window.setTimeout(function(){note.cancel()}, 1e4)
		desktopNotify.lastMessage = message
	}
}