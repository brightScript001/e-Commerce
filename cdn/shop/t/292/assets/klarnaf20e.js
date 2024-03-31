/** Shopify CDN: Minification failed

Line 16:2 Transforming const to the configured target environment ("es5") is not supported yet
Line 25:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 28:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 43:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 64:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 68:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 73:8 Transforming const to the configured target environment ("es5") is not supported yet

**/
"use strict";
window._theme = window._theme || {};

_theme.KlarnaWidget = (function () {
  const selecotrs = {
    container: "klarna-placement",
    learnMoreBtn: 'button[part="osm-cta"]',
    modalCloseBtn: '#learn-more-dialog-payment_calculator-default__nav-bar__right-icon',
    modalCloseBtnWrapper: '#learn-more-dialog-payment_calculator-default__nav-bar__right-edge',
    modalHeader: '#learn-more-dialog-payment_calculator-default__nav-bar'
  };

  function KlarnaWidget() {
    const klarna = document.querySelector(selecotrs.container);
    if (!klarna) return;

    const wrapperInterval = setInterval(() => {
      if (!klarna.wrapper) return;
      clearInterval(wrapperInterval);
      this.root = klarna.wrapper.shadowRoot;
      if (!this.root || this.root.mode !== "open") return;
      this.initADA();
      this.initEvents();
    }, 1000);

    setTimeout(() => {
      if (wrapperInterval) clearInterval(wrapperInterval);
    }, 8000);
  }

  KlarnaWidget.prototype.initADA = function () {
    const learnMoreBtn = this.root.querySelector(selecotrs.learnMoreBtn);
    if (learnMoreBtn)
      learnMoreBtn.setAttribute(
        "aria-label",
        "Learn More about Klarna interest free payments"
      );
  };

  KlarnaWidget.prototype.initEvents = function () {
    if (!window.Klarna)  return;
    
    window.Klarna.OnsiteMessaging.on("informationalModalOpened", (evt) => {
      this.initModalADA();
    });

    Klarna.OnsiteMessaging.on("informationalModalClosed", (evt) => {
      // console.log('modal closed');
    });
  };

  KlarnaWidget.prototype.initModalADA = function () {
    const klarnaModal = document.querySelector('klarna-osm-interstitial');
    if(!klarnaModal || !klarnaModal.renderRoot) return;
    this.klarnaModalRoot = klarnaModal.renderRoot;

    const run = () => {
        // const modalHeader = this.klarnaModalRoot.querySelector(selecotrs.modalHeader);
        // const modalCloseBtnWrapper = this.klarnaModalRoot.querySelector(selecotrs.modalCloseBtnWrapper);
        
        // modalHeader.prepend(modalCloseBtnWrapper);
        const modalCloseBtn = this.klarnaModalRoot.querySelector(selecotrs.modalCloseBtn);
        if(modalCloseBtn) modalCloseBtn.setAttribute('aria-label', 'Close Klarna modal');
    }

    setTimeout(run, 1000);
  }

  return KlarnaWidget;
})();

window.onload = function () {
  new _theme.KlarnaWidget();
};
