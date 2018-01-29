(() => {
  'use strict';

  angular
    .module('copayApp.controllers')
    .controller('SearchContactsController', SearchContactsController);

  SearchContactsController.$inject = ['addressbookService'];

  function SearchContactsController(addressbookService) {
    const vm = this;

    addressbookService.list((contacts) => {
      vm.contacts = contacts;
      console.log(contacts);
    });

    vm.search = () => {

    };

    vm.clearFilter = () => {
      vm.search_value = '';
    };
  }
})();
