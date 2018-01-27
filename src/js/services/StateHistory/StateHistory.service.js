(() => {
  'use strict';

  angular
    .module('copayApp.services')
    .factory('StateHistoryService', StateHistoryService);

  StateHistoryService.$inject = ['storageService'];

  function StateHistoryService(storageService) {
    return {
      set,
      get
    };

    function set(key, state, cb) {

    }

    function get(key, cb) {

    }
  }
})();
