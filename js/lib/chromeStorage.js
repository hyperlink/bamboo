// Copyright (c) 2013 by Xiaoxin Lu

var storage = (function(storage, $){

   var type = 'sync',
       deferred = $.Deferred()

   return {
      set: set,
      get: get,
      remove: remove
   }

   function get(keys) {
      deferred = $.Deferred()
      storage[type].get(keys, handler)
      return deferred.promise()
   }

   function set(items) {
      deferred = $.Deferred()
      storage[type].set(items, handler)
      return deferred.promise()
   }

   function remove(keys) {
      deferred = $.Deferred()
      try {
         storage[type].remove(keys, handler)
      } catch(e) {
         console.error(e)
         deferred.reject(e)
      }
      return deferred.promise()
   }

   function handler() {
      if (chrome.runtime.lastError) {
         deferred.reject(chrome.runtime.lastError)
         console.error(chrome.runtime.lastError.message)
      } else {
         deferred.resolve.apply(deferred, arguments)
      }
   }

})(chrome.storage, jQuery)