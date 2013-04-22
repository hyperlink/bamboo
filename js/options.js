// Copyright (c) 2013 by Xiaoxin Lu

var bgPage = chrome.extension.getBackgroundPage()
var $host = $("#bambooHost")

storage.get('bambooHost').done(function(item){
	$host.val(item.bambooHost)
})

$("#applyBtn").click(function(){
	var bambooHost = $host.val()
	if (bambooHost) {
		storage.set({'bambooHost': bambooHost}).done(function() {
			if (bgPage.setupBambooApi(bambooHost)) {
				bgPage.bambooHost = bambooHost
				bgPage.start()
			}
		})
	}
})