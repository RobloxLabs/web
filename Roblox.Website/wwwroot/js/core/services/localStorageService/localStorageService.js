import { LocalStorage } from 'Roblox';

function handler(e) {
  console.debug('Successfully communicate with other tab');
  console.debug('Received data: ' + localStorage.getItem('data'));
}

export default {
  getUserKey: function (userId) {
    return 'user_' + userId;
  },

  storage: function () {
    if (LocalStorage) {
      return LocalStorage.isAvailable();
    }
    return localStorage;
  },

  getLength: function () {
    if (this.storage()) {
      return localStorage.length;
    }
    return 0;
  },

  getKey: function (i) {
    if (this.storage()) {
      return localStorage.key(i);
    }
    return '';
  },

  setLocalStorage: function (key, value) {
    if (this.storage()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  getLocalStorage: function (key) {
    if (this.storage()) {
      return JSON.parse(localStorage.getItem(key));
    }
  },

  listenLocalStorage: function (handlerCallback) {
    if (this.storage() && typeof handlerCallback !== 'undefined') {
      if (window.addEventListener) {
        // Normal browsers
        window.addEventListener('storage', handlerCallback, false);
      } else {
        // for IE (why make your life more difficult)
        window.attachEvent('onstorage', handlerCallback);
      }
    }
  },

  removeLocalStorage: function (key) {
    if (this.storage()) {
      localStorage.removeItem(key);
    }
  },

  saveDataByTimeStamp: function (key, data) {
    var currentTime = new Date().getTime();
    var existingData = this.getLocalStorage(key);
    if (!existingData) {
      existingData = {};
    }
    existingData['data'] = data;
    existingData['timeStamp'] = currentTime;
    this.setLocalStorage(key, existingData);
  },

  fetchNonExpiredCachedData: function (key, expirationMS) {
    var currentTimeStamp = new Date().getTime();
    var cachedData = this.getLocalStorage(key);
    if (cachedData && cachedData['timeStamp']) {
      var cachedTimeStamp = cachedData['timeStamp'];
      expirationMS = expirationMS || 30000; // default is 30s
      if (currentTimeStamp - cachedTimeStamp < expirationMS) {
        return cachedData;
      } else {
        // if cache is expired, remove it from localstorage
        this.removeLocalStorage(key);
      }
    }
    return null;
  }
};
