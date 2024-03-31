/** Shopify CDN: Minification failed

Line 21:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 24:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 25:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 32:2 Transforming const to the configured target environment ("es5") is not supported yet
Line 48:2 Transforming const to the configured target environment ("es5") is not supported yet
Line 53:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 54:6 Transforming let to the configured target environment ("es5") is not supported yet
Line 55:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 75:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 102:6 Transforming const to the configured target environment ("es5") is not supported yet
... and 43 more hidden warnings

**/
"use strict";

window._theme = window._theme || {};

_theme.debounce = (func, delay) => {
  let debounceTimer;
  
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay || 300);
  }
}

_theme.StoreMapper = (function(){
  const selectors = {
    container: '#storemapper',
    searchContainer: '#storemapper #storemapper-form .storemapper-form-inner',
    searchError: '#storemapper #storemapper-form .storemapper-error',
    searchinput: '#storemapper #storemapper-zip',
    searchSubmitBtn: '#storemapper #storemapper-go',
    searchResetBtn: '#storemapper .storemapper-reset',
    storeListItems: '#storemapper #storemapper-list > li',
    mapPopupContent: "#storemapper #storemapper-right .mapboxgl-popup .mapboxgl-popup-content",
    mapBoxLinkContainer: "#storemapper .mapboxgl-ctrl-attrib-inner",
    storeMapperMarker: "#storemapper #storemapper-right .storemapper-marker",
    moreInfoBtn: '#storemapper #storemapper-right .mapboxgl-ctrl-attrib-button',
    status: '#storemapper-status',
    poweredByText: '.storemapper-powered-by'
  };

  const settings = {
    modalTarget: null
  };
  
  function StoreMapper(){
    const mapperInterval = setInterval(() => {
      let run = false;
      const container = document.querySelector(selectors.container);
      if(window.Storemapper && container){
        if(window.Storemapper.is_mobile) run = true;
        else if(window.Storemapper.markers_loaded) run = true;
      }

      if(run){
        this.container = container;
        clearInterval(mapperInterval);
        this.init();
      }
    });

    setTimeout(() => {
      if(mapperInterval) clearInterval(mapperInterval);
    }, 8000);
  }
  
  StoreMapper.prototype.init = function(){
    // console.log('Inside', window.Storemapper);
    const self = this;

    window.Storemapper.map._renderTaskQueue.add(onUpdate);
    window.Storemapper.map._listeners.moveend.push(onUpdate);
    window.Storemapper.map._listeners.dataloading.push(onLoading);

    // const config = { attributes: true, childList: true, subtree: true };
    // const callback = _theme.debounce((mutationList, observer) => {
    //   setTimeout(() => {
    //     console.count('interval called');
    //     onUpdate();
    //     observer.disconnect();
    //   }, 500);
    // });
    
    // const observer = new MutationObserver(callback);
    // observer.observe(this.container, config);
    //observer.disconnect();

    function onUpdate(res){
      // console.log(res)
      setTimeout(() => {
        self.updateStaticTextAndLabel();
      }, 100);
    }

    function onLoading(res){
      const search_lat = window.Storemapper.search_lat;
      const search_lng = window.Storemapper.search_lng;
      if(search_lat && search_lng){
        const status = document.querySelector(selectors.status);
        status.textContent = 'Please wait. content loading';
      }
    }
  }

  StoreMapper.prototype.handleViewOnClick = function(evt){
    settings.modalTarget = evt.target;
    if(evt.buttons !== 0) return;

    setTimeout(() => {
      _theme.focusTrap($(selectors.mapPopupContent), () => {
        const popup = document.querySelector('#storemapper .mapboxgl-popup');
        if(!popup) return;
        popup.remove();
        evt.target.focus();
        settings.modalTarget = null;
      })
    }, 250);
  }

  StoreMapper.prototype.handleMakerClick = function(evt){
    settings.modalTarget = evt.target;
    _theme.handleKeyboardEnterOrSpacePress(evt, null, () => {
      setTimeout(() => {
        _theme.focusTrap($(selectors.mapPopupContent), () => {
          const popup = document.querySelector('#storemapper .mapboxgl-popup');
          if(!popup) return;
          popup.remove();
          evt.target.focus();
          settings.modalTarget = null;
        })
      }, 250);
    });
  }

  StoreMapper.prototype.handleCloseModal = function(evt){
    if(!settings.modalTarget) return;
    const popup = document.querySelector('#storemapper .mapboxgl-popup');
    if(popup) popup.remove();
    settings.modalTarget.focus();
  }

  StoreMapper.prototype.handleSearchSubmit = function(evt){
    const searchinput = document.querySelector(selectors.searchinput);
    const searchSubmitBtn = document.querySelector(selectors.searchSubmitBtn);
    const searchError = document.querySelector(selectors.searchError);
    if(searchError) searchError.remove();
    
    if(searchinput.value.trim() !== '') {
      searchSubmitBtn.click();
      return true;
    }

    // const status = document.querySelector(selectors.status);
    // status.textContent = 'Please enter a location to view stores';
    const searchContainer = document.querySelector(selectors.searchContainer);
    const status = document.createElement('p');
    status.classList.add('storemapper-error', 'help-block');
    status.setAttribute('role', 'alert');
    status.textContent = 'Please enter a location to view stores';
    searchinput.focus();
    searchContainer.appendChild(status);
  }

  StoreMapper.prototype.handleSearchReset = function(evt){
    _theme.handleKeyboardEnterOrSpacePress(evt);
    this.updateStaticTextAndLabel();
  }

  StoreMapper.prototype.updateStaticTextAndLabel = function(){
    // const self = this;
    // console.count('called');
    const handleMakerClick = this.handleMakerClick.bind(this);
    const handleViewOnClick = this.handleViewOnClick.bind(this);

    const searchinput = document.querySelector(selectors.searchinput);
    const searchContainer = document.querySelector(selectors.searchContainer);
    const searchSubmitBtn = document.querySelector(selectors.searchSubmitBtn);
    const searchResetBtn = document.querySelector(selectors.searchResetBtn);
    const storeListItems = document.querySelectorAll(selectors.storeListItems);
    const mapPopupContents = document.querySelectorAll(selectors.mapPopupContent);
    const mapBoxLinkContainer = document.querySelector(selectors.mapBoxLinkContainer);
    const moreInfoBtn = document.querySelector(selectors.moreInfoBtn);
    const poweredByText = document.querySelector(selectors.poweredByText);
    const search_lat = window.Storemapper.search_lat;
    const search_lng = window.Storemapper.search_lng;
    
    if(poweredByText) poweredByText.remove();
    
    if(searchinput) {
      searchinput.setAttribute('aria-label', 'Enter zip code or full address');
      searchinput.setAttribute('aria-controls', 'storemapper-status');
      searchinput.setAttribute('required', true);
      searchinput.setAttribute('aria-required', true);
    }

    // Search input :: Submit Button
    if(searchContainer && searchSubmitBtn) {
      const hasClone = document.getElementById('storemapper-go-fake');
      if(hasClone) hasClone.remove();

      const searchSubmitBtnClone = searchSubmitBtn.cloneNode(true);
      searchSubmitBtnClone.id = 'storemapper-go-fake';
      searchSubmitBtn.classList.add('hidden');
      searchSubmitBtnClone.classList.remove('hidden');
      searchContainer.appendChild(searchSubmitBtnClone);
      searchSubmitBtn.setAttribute('aria-label', 'Search location');  
      searchSubmitBtnClone.removeEventListener('click', this.handleSearchSubmit.bind(this));
      searchSubmitBtnClone.addEventListener('click', this.handleSearchSubmit.bind(this));
    }
    
    // Search Input :: Reset Button
    if(searchResetBtn) {
      searchResetBtn.setAttribute('role', 'button');
      searchResetBtn.setAttribute('tabindex', '0');
      searchResetBtn.removeEventListener('keyup', this.handleSearchReset.bind(this));
      searchResetBtn.addEventListener('keyup', this.handleSearchReset.bind(this));
    }

    // Stores :: List Items
    storeListItems.forEach(item => {
      const markerId = item.dataset.idx;
      const marker = document.querySelector('#storemapper #storemapper-marker-' + markerId);
      const title = item.querySelector('.storemapper-title');
      const phone = item.querySelector('.storemapper-phone a');
      const storeLink = item.querySelector('.storemapper-storelink');
      const email = item.querySelector('.storemapper-email a');
      const storeName = title.textContent;

      item.removeAttribute('tabindex');
      item.removeAttribute('aria-label');
      item.querySelectorAll('[aria-label]').forEach(subItem => {
        subItem.removeAttribute('aria-label');
      });

      // Left store list title. Instead of heading, it should be treated as normal text
      if(title) {
        title.setAttribute('role', 'heading');
        title.setAttribute('aria-level', '2');
        title.setAttribute('data-title', storeName);
      }
      
      // Icon
      item.querySelectorAll('p svg').forEach(item => {
        item.setAttribute('role', 'img');
        let label = 'icon';
        if(item.closest('.storemapper-address')) label = 'location';
        if(item.closest('.storemapper-phone')) label = 'phone';
        if(item.closest('.storemapper-email')) label = 'email';
        item.setAttribute('aria-label', label);
      });

      if(phone){
        phone.setAttribute('aria-label', 'Phone: ' + phone.textContent);
        phone.classList.add('outline-inset');
      }

      if(email){
        email.setAttribute('aria-label', 'Email: ' + email.textContent);
        email.classList.add('outline-inset');
      }

      if(storeLink) {
        storeLink.setAttribute('role', 'button');
        storeLink.setAttribute('aria-haspopup', 'dialog');
        storeLink.setAttribute('aria-label', storeLink.textContent + ' ' + storeName);
        storeLink.removeEventListener('click', handleViewOnClick);
        storeLink.addEventListener('click', handleViewOnClick);
      }
      if(marker){
        marker.setAttribute('role', 'button');
        marker.setAttribute('tabindex', '0');
        if(title) marker.setAttribute('aria-label', storeName + ' popup');
        marker.removeEventListener('keyup', handleMakerClick);
        marker.addEventListener('keyup', handleMakerClick);
      }
    });

    // Location Popup on Map
    mapPopupContents.forEach(popup => {
      const parent = popup.closest('.mapboxgl-popup');
      const title = popup.querySelector('.storemapper-popup-name');
      const phone = popup.querySelector('.storemapper-popup-phone a');
      const closePopupBtn = popup.querySelector('.mapboxgl-popup-close-button');

      popup.querySelectorAll('[aria-label]:not(a)').forEach(item => {
        item.removeAttribute('aria-label');
      });

      if(title) {
        title.setAttribute('role', 'heading');
        title.setAttribute('aria-level', '2');
      }
      if(phone) phone.setAttribute('aria-label', 'Phone: ' + phone.textContent);
      if(parent){
        parent.setAttribute('role', 'dialog');
        parent.setAttribute('aria-modal', 'true');
        parent.setAttribute('aria-label', 'Location popup ' + title.textContent);
      }

      if(closePopupBtn){
        const existSpan = closePopupBtn.querySelector('span');
        if(existSpan) existSpan.remove();
        const span = document.createElement('span');
        span.classList.add('visually-hidden');
        span.textContent = 'Close popup ' + title.textContent;
        closePopupBtn.setAttribute('aria-label', 'Close popup ' + title.textContent);
        closePopupBtn.appendChild(span);
        closePopupBtn.removeEventListener('click', this.handleCloseModal.bind(this));
        closePopupBtn.addEventListener('click', this.handleCloseModal.bind(this));
      }

      // Icon
      popup.querySelectorAll('p svg').forEach(item => {
        item.setAttribute('role', 'img');
        let label = 'icon';
        if(item.closest('.storemapper-popup-address')) label = 'location';
        if(item.closest('.storemapper-popup-phone')) label = 'phone';
        if(item.closest('.storemapper-popup-email')) label = 'email';
        item.setAttribute('aria-label', label);
      });
    });

    // Credit & Info Link
    if(mapBoxLinkContainer){
      mapBoxLinkContainer.removeAttribute('role');
      mapBoxLinkContainer.querySelectorAll('a').forEach(item => {
        item.removeAttribute('role');
        item.removeAttribute('title');
        if(item.classList.contains('mapbox-improve-map')){
          item.setAttribute('aria-label', item.textContent)
        }
      });
    }
    if(moreInfoBtn){
      moreInfoBtn.setAttribute('aria-label', 'Map more action');
    }

    if(search_lat && search_lng){
      const status = document.querySelector(selectors.status);
      const totalStores = storeListItems.length;
      let msg = totalStores + ' stores found for the search term \"'+ searchinput.value + '\"  ';
      if(totalStores < 2) msg = totalStores + ' store found for the search term \"'+ searchinput.value + '\"  ';
      status.textContent = msg;
      // _theme.Helpers.showNotification(storeListItems.length + ' stores found for the search term '+ searchinput.value);
    }
  }

  return StoreMapper;
})();


window.addEventListener('load', evt => {
  new _theme.StoreMapper();
});