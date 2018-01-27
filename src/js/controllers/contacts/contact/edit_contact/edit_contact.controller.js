(() => {
  'use strict';

  angular
    .module('copayApp.controllers')
    .controller('EditContactController', EditContactController);

  EditContactController.$inject = ['$stateParams', 'addressbookService', '$state'];

  function EditContactController($stateParams, addressbookService, $state) {
    const contact = this;
    const contactData = addressbookService.getContact($stateParams.address) || {};

    Object.keys(contactData).map((key) => {
      contact.data[key] = contactData[key] || '';
      return true;
    });

    contact.backParams = { address: $stateParams.address };

    contact.update = () => {
      if (addressbookService.update(contactData)) {
        $state.go('contact', contact.data);
      }
    };
  }
})();
