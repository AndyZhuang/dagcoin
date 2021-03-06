(function () {
  'use strict';

  angular.module('copayApp.controllers').controller('acceptCorrespondentInvitationController',
    function ($scope, $rootScope, $timeout, configService, profileService, isCordova, go, correspondentListService, gettextCatalog) {
      const self = this;
      const fc = profileService.focusedClient;
      $scope.backgroundColor = fc.backgroundColor;

      $scope.beforeQrCodeScan = function () {
        console.log('beforeQrCodeScan');
        $scope.error = null;
      };

      $scope.onQrCodeScanned = function (data) {
        console.log('onQrCodeScanned', data);
        handleCode(data);
      };

      $scope.pair = function () {
        $scope.error = null;
        handleCode($scope.code);
      };

      function handleCode(code) {
        const matches = code.match(/^([\w\/+]+)@([\w.:\/-]+)#([\w\/+-]+)$/);
        if (!matches) {
          return setError(gettextCatalog.getString('Invalid pairing code'));
        }
        const pubkey = matches[1];
        const hub = matches[2];
        const pairingSecret = matches[3];
        if (pubkey.length !== 44) {
          return setError(gettextCatalog.getString('Invalid pubkey length'));
        }
        // if (pairing_secret.length !== 12)
        //    return setError("Invalid pairing secret length");
        console.log(pubkey, hub, pairingSecret);
        self.setOngoingProcess(gettextCatalog.getString('pairing'));
        correspondentListService.acceptInvitation(hub, pubkey, pairingSecret, (err) => {
          if (err) {
            console.log('acceptInvitationError', err);
          }
          self.setOngoingProcess();
          // acceptInvitation() will already open chat window
          /* if (err)
                    $scope.error = err;
                else
                    go.path('correspondentDevices'); */
        });
      }

      function setError(error) {
        $scope.error = error;
      }

      this.setOngoingProcess = function (name) {
        if (isCordova) {
          if (name) {
            window.plugins.spinnerDialog.hide();
            window.plugins.spinnerDialog.show(null, `${name}...`, true);
          } else {
            window.plugins.spinnerDialog.hide();
          }
        } else {
          $scope.onGoingProcess = name;
          $timeout(() => {
            $rootScope.$apply();
          });
        }
      };
    });
}());
