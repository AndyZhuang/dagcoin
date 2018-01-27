(() => {
  'use strict';

  angular
    .module('copayApp.services')
    .factory('addressbookService', addressbookService);

  addressbookService.$inject = ['storageService', 'profileService'];

  function addressbookService(storageService, profileService) {
    let contacts = false;

    return {
      getContact,
      list,
      favorites,
      add,
      update,
      remove,
      removeAll
    };

    function addressBookKey() {
      const fc = profileService.focusedClient;
      const network = fc.credentials.network;
      return `addressbook-${network}`;
    }

    /**
     * Get contact by wallet address
     * @param address address of the wallet
     * @returns {*}
     */

    function getContact(address) {
      list(() => (contacts[address] || false));
    }

    function list(cb) {
      if (!contacts) {
        const ab = storageService.get(addressBookKey());

        if (ab) {
          const json = JSON.parse(ab);
          contacts = {};

          Object.keys(json).map((address) => {
            if (typeof json[address] === 'string') {
              contacts[address] = {
                address,
                first_name: json[address].split(' ')[0],
                last_name: json[address].split(' ')[1]
              };
            } else if (json[address].first_name) {
              contacts[address] = json[address];
            }
            return true;
          });
        } else {
          contacts = {};
        }
      }
      return cb(contacts);
    }

    function favorites() {
      list(() => {
        const favoritesList = [];

        Object.keys(contacts).map((address) => {
          const contact = contacts[address];
          if (contact.favorite) {
            favoritesList.push(contact);
          }
          return true;
        });

        return favoritesList;
      });
    }

    function add(entry) {
      list(() => {
        contacts[entry.address] = entry;
        return storageService.set(addressBookKey(), JSON.stringify(contacts));
      });
    }

    function update(entry, force = false) {
      list(() => {
        if (force) {
          contacts[entry.address] = entry;
        } else {
          Object.keys(force).map((key) => {
            contacts[entry.address][key] = force[key];
            return true;
          });
        }
        return storageService.set(addressBookKey(), JSON.stringify(contacts));
      });
    }

    function remove(addr) {
      list(() => {
        delete contacts[addr];
        return storageService.set(addressBookKey(), JSON.stringify(contacts));
      });
    }

    function removeAll() {
      contacts = {};
      return storageService.remove(addressBookKey());
    }
  }
})();
