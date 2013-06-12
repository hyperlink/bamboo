// Copyright (c) 2013 by Xiaoxin Lu

/*globals APIConnect:false */

const bambooApi = new APIConnect()

chrome.storage.sync.get('bambooHost', function(item) {
	// global
	window.bambooHost = item.bambooHost
	setupBambooApi(item.bambooHost)
	initApp()
})

function setupBambooApi(bambooHost) {
	if (bambooHost) {
		bambooApi.options(getUrlObject(bambooHost)).context('rest/api/latest', function() {
			bambooApi.connect('result?favourite=1&expand=results.result', {as: 'getFavoriteResults'})
			bambooApi.connect('project?expand=projects.project.plans', {as: 'getAllProjects'})
			bambooApi.connect('project/:project?expand=plans', {as: 'getPlansForProject'})
			bambooApi.connect('currentUser')
		})
		return true
	}
	return false
}

function getUrlObject(url) {
	var a = document.createElement("a")
	a.href = url
	return {
		domain: a.host,
		protocol: a.protocol,
		port: a.port || ((a.protocol == 'https:') ? "443" : "80")
	}
}