(() => {
  'use strict';

  angular
    .module('copayApp.controllers')
    .controller('preferencesWalletTypeController', preferencesWalletTypeController);

  preferencesWalletTypeController.$inject = ['changeWalletTypeService', 'gettextCatalog'];

  function preferencesWalletTypeController(changeWalletTypeService, gettextCatalog) {
    const conf = require('byteballcore/conf.js');

    const vm = this;
    vm.isLight = conf.bLight;

    vm.changeWalletType = () => {
      if (vm.isLight) {
        const ModalInstanceCtrl = function ($scopeModal, $modalInstance, $sce) {
          $scopeModal.header = $sce.trustAsHtml(gettextCatalog.getString('Change wallet type!'));
          $scopeModal.title = $sce.trustAsHtml(gettextCatalog.getString(`The wallet will contain the most current state of the entire Dagcoin database.
            This option is better for privacy but will take several gigabytes of storage and the initial sync will take several days.
            CPU load will be high during sync. After changing to full wallet your money won't be visible until database will synchronize your transactions.`));

          $scopeModal.yes_label = gettextCatalog.getString('Change it');
          $scopeModal.ok = function () {
            $modalInstance.close(true);
          };
          $scopeModal.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        };

        const modalInstance = $modal.open({
          templateUrl: 'views/modals/confirmation.html',
          windowClass: animationService.modalAnimated.slideUp,
          controller: ['$scope', '$modalInstance', '$sce', ModalInstanceCtrl],
        });

        modalInstance.result.finally(() => {
          const m = angular.element(document.getElementsByClassName('reveal-modal'));
          m.addClass(animationService.modalAnimated.slideOutDown);
        });

        modalInstance.result.then((ok) => {
          if (ok) {
            changeWalletTypeService.change();
          }
        });
      } else {
        changeWalletTypeService.change();
      }
    };
  }
})();
