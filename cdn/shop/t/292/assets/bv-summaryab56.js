/** Shopify CDN: Minification failed

Line 18:0 Transforming class syntax to the configured target environment ("es5") is not supported yet
Line 79:15 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 88:8 Transforming const to the configured target environment ("es5") is not supported yet
Line 98:21 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 100:24 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 115:14 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 124:25 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 134:18 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 135:8 Transforming const to the configured target environment ("es5") is not supported yet
Line 138:8 Transforming const to the configured target environment ("es5") is not supported yet
... and 45 more hidden warnings

**/
"use strict";

class BVRatingSummary extends HTMLElement {
    #sessionKey = '_bvsummary';
    settings = {
        starIcon: `<svg class="bv-icon-star" xmlns="http://www.w3.org/2000/svg" width="17px" height="17px" viewBox="0 0 25 25" focusable="false">
        <polygon
            points="25 9.12 15.5669599 9.12 12.512219 0 9.40860215 9.12 0 9.12 7.55131965 14.856 4.47214076 24 12.512219 18.216 20.5522972 24 17.4731183 14.856"
            style="fill: url('#[[START_ICON_ID]]');"
        ></polygon>
        <path d="" style="fill: url('#[[START_ICON_ID]]');"></path>
        <defs>
            <linearGradient id="[[START_ICON_ID]]" x1="[[BV_STAR_FILL_X1]]%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color: rgb(0, 0, 0); stop-opacity: 1;"></stop>
                <stop offset="1%" style="stop-color: rgb(204, 204, 204); stop-opacity: 1;"></stop>
            </linearGradient>
        </defs>
        </svg>`,

        template: `
            <div class="bv_summary" itemprop="aggregateRating" itemscope="" itemtype="https://schema.org/AggregateRating">
                <span itemprop="itemReviewed" itemscope="true" itemtype="https://schema.org/IndividualProduct" class="visually-hidden">
                    <span itemprop="name">[[BV_PRODUCT_TITLE]]</span>
                </span>
                <div itemprop="ratingValue" class="visually-hidden notranslate" aria-hidden="true">[[BV_AVG_RATING]]</div>
                <meta itemprop="reviewCount" content="[[BV_TOTAL_REVIEWS]]" />
                <button class="bv_summary_container" type="button" aria-expanded="false">
                    <span class="visually-hidden">[[BV_SUMMARY_TEXT]]</span>
                    <div class="bv_summary_star_container" aria-hidden="true">[[BV_STARS]]</div>
                    <div class="bv_summary_reviews_count">[[BV_TOTAL_REVIEWS]]</div>
                </button>
                [[BV_SUMMARY_MODAL]]
                [[BV_SKIP_TO_REVIEW_LINK]]
            </div>`,

        modalTemplate: `
            <dialog class="bv_summary_modal">
                <div class="bv_summary_modal_container">
                    <div class="bv_summary_modal_body">
                        <ul role="list">[[BV_SUMMARY_MODAL_ITEMS]]</ul>
                    </div>
                    <div class="bv_summary_modal_footer">
                        [[BV_SUMMARY_MODAL_BTN]]
                    </div>
                </div>
            </dialog>`,
        
        modalTemplateListItem: `
            <li role="listitem">
                <p>
                    <span class="visually-hidden">[[BV_TOTAL_RATING]] reviews with [[BV_RATING_NAME]] stars</span>
                    <span aria-hidden="true" class="bv_summary_rating_name">[[BV_RATING_NAME]]</span>
                    <span aria-hidden="true" class="bv_summary_rating_icon">[[BV_STAR_ICON]]</span>
                    <span aria-hidden="true" class="bv_summary_progressbar">
                        <span class="bv_summary_progressbar_empty">
                            <span class="bv_summary_progressbar_filled" style="width: [[BV_RATING_CONTRIBUTION]]%"></span>
                        </span>
                    </span>
                    <span aria-hidden="true" class="bv_summary_total_rating">[[BV_TOTAL_RATING]]</span>
                </p>
            </li>`
    };

    constructor(){
        super();
        this.productId = this.dataset.productId;
        if(!this.productId) return;

        this.productTitle = this.dataset.productId;
        this.productUrl = this.dataset.productUrl;
        this.isIpadLandAndUp = window.innerWidth >= 1024;
        this.isQuickview = this.dataset.quickview;
        const cachedData = this.getCachedData();
        this.updatePosition();
        if(cachedData) {
            this.render(cachedData);
            return;
        }

        this.fetchBVRatingSummaryData();        
    }

    connectedCallback(){}

    disconnectedCallback(){
        this.skipToReviewsBtns.forEach(btn => {
            btn.removeEventListener('click', this.handleWriteReview.bind(this));
        });
        this.summaryModalTriggerBtn.removeEventListener('click', this.openSummaryModal.bind(this));
        this.summaryModal.removeEventListener('keyup', this.handleSummaryModalEscape.bind(this));
        this.summaryModal.removeEventListener('focusout', this.handleSummaryModalFocusOut.bind(this));
        
        this.modalCloseTimer = null;
        this.summaryModalTriggerBtn.removeEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.summaryModalTriggerBtn.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.summaryModal.removeEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.summaryModal.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    initEvents(){
        this.skipToReviewsBtns.forEach(btn => {
            btn.addEventListener('click', this.handleWriteReview.bind(this));
        });
        this.summaryModalTriggerBtn.addEventListener('click', this.openSummaryModal.bind(this));
        this.summaryModal.addEventListener('keyup', this.handleSummaryModalEscape.bind(this));
        this.summaryModal.addEventListener('focusout', this.handleSummaryModalFocusOut.bind(this));
    }

    initDesktopOnlyEvents(){
        if(!this.isIpadLandAndUp) return;

        this.modalCloseTimer = null;
        this.summaryModalTriggerBtn.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.summaryModalTriggerBtn.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.summaryModal.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.summaryModal.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    updatePosition(){
        const section = _theme.Helpers.getParamFromURL('section');
        if(!section || section !== 'reviews') return;
        setTimeout(this.handleWriteReview.bind(this), 2500);
        const newUrl = _theme.Helpers.deleteParamFromURL('section');
        history.pushState('', '', newUrl);
    }

    static get getElementName(){
        return 'bv-rating-summary'
    }

    async fetchBVRatingSummaryData(){
        try{
            const resp = await fetch(`
                https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=caVhjOuijxSJVqMHM6yS16ABhvzzl0CF1onOQBzGbJYsk&productid=${this.productId}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0
            `);
            const data = await resp.json();
            this.cacheData(data);
            this.render(data);
        } catch(err){
            console.error(err);
        }
    }

    render(data){
        let html = this.settings.template;
        const starIcon = this.settings.starIcon;
        let modalHtml = this.settings.modalTemplate;

        const { reviewSummary: { numReviews, primaryRating: { average, distribution } } } = data;
        if(numReviews === 0){
            this.classList.add('hidden');
            return;
        }

        const finalAvgRating = average.toFixed(1);
        const summaryText = `${finalAvgRating} out of 5 stars. Read reviews for average rating value is ${finalAvgRating} of 5.`;

        const starFillPer = (average % 1).toFixed(5) * 100;
        const starIconHtml = distribution.map((d, i) => {
            const index = i + 1;
            let icon = _theme.Helpers.updateHtml(starIcon, '[[START_ICON_ID]]', `bv_rating_summary_star_filled_${i}`);
            if(index < average){
                icon = _theme.Helpers.updateHtml(icon, '[[BV_STAR_FILL_X1]]', 99.99);
            } else {
                icon = _theme.Helpers.updateHtml(icon, '[[BV_STAR_FILL_X1]]', starFillPer);
            }
            return icon;
        }).join('');

        html = _theme.Helpers.updateHtml(html, '[[BV_STARS]]', starIconHtml);

        html = _theme.Helpers.updateHtml(html, '[[BV_PRODUCT_TITLE]]', this.productTitle);
        html = _theme.Helpers.updateHtml(html, '[[BV_SUMMARY_TEXT]]', summaryText);
        html = _theme.Helpers.updateHtml(html, '[[BV_AVG_RATING]]', finalAvgRating);
        html = _theme.Helpers.updateHtml(html, '[[BV_TOTAL_REVIEWS]]', `(${numReviews})`);
        
        let skipLink = `<a data-skip-reviews class="top-write-review-btn" href="javascript:void(0)" aria-label="Skip to Write a review section">Write a review</a>`;
        if(this.isQuickview) skipLink = `<a class="top-write-review-btn" href="${this.productUrl}?section=reviews" aria-label="Write a review">Write a review</a>`;
        html = _theme.Helpers.updateHtml(html, '[[BV_SKIP_TO_REVIEW_LINK]]', skipLink);
        
        modalHtml = _theme.Helpers.updateHtml(modalHtml, '[[BV_SUMMARY_MODAL_ITEMS]]', this.buildModalSummaryList(data));
        let modalBtnHtml = `<button data-skip-reviews type="button" class="btn btn-black" aria-label="Read ${numReviews} reviews, Skip to reviews section">Read ${numReviews} reviews</button>`;
        if(this.isQuickview) modalBtnHtml = `<a href="${this.productUrl}?section=reviews" class="btn btn-black" aria-label="Read ${numReviews} reviews">Read ${numReviews} reviews</a>`;
        modalHtml = _theme.Helpers.updateHtml(modalHtml, '[[BV_SUMMARY_MODAL_BTN]]', modalBtnHtml);
        html = _theme.Helpers.updateHtml(html, '[[BV_SUMMARY_MODAL]]', modalHtml);

        this.innerHTML = html;
        this.buildSelectors();
        this.initEvents();
        this.initDesktopOnlyEvents();
    }

    buildModalSummaryList(data){
        const { reviewSummary: { numReviews, primaryRating: { average, distribution } } } = data;
        let html = '';
        let starIcon = this.settings.starIcon;
        
        distribution.forEach(({ key, count }, i) => {
            let itemHtml = this.settings.modalTemplateListItem;
            let icon = _theme.Helpers.updateHtml(starIcon, '[[START_ICON_ID]]', `bv_rating_modal_summary_star_filled_${i}`);
            icon = _theme.Helpers.updateHtml(icon, '[[BV_STAR_FILL_X1]]', 99.99);
            const contribution = (count * 100/numReviews).toFixed(2);
            itemHtml = _theme.Helpers.updateHtml(itemHtml, '[[BV_TOTAL_RATING]]', count);
            itemHtml = _theme.Helpers.updateHtml(itemHtml, '[[BV_RATING_NAME]]', key);
            itemHtml = _theme.Helpers.updateHtml(itemHtml, '[[BV_STAR_ICON]]', icon);
            itemHtml = _theme.Helpers.updateHtml(itemHtml, '[[BV_RATING_CONTRIBUTION]]', contribution);
            html += itemHtml;
        });

        return html;
    }

    cacheData(data){
        if(!data) return;
        const productSummary = { [this.productId]: data };
        _theme.Helpers.setItemIntoSS(this.#sessionKey, productSummary);
    }

    getCachedData(){
        const data = _theme.Helpers.getItemFromSS(this.#sessionKey);
        return data && data[this.productId];
    }

    buildSelectors(){
        this.skipToReviewsBtns = this.querySelectorAll('[data-skip-reviews]');
        this.summaryModal = this.querySelector('dialog');
        this.summaryModalTriggerBtn = this.querySelector('button.bv_summary_container');
    }

    handleSummaryModalEscape(evt){
        if (!evt.code || evt.code.toUpperCase() !== 'ESCAPE') return;
        this.closeSummaryModal();
    }

    handleSummaryModalFocusOut(evt){
        if(evt.relatedTarget && !this.summaryModal.contains(evt.relatedTarget)){
            evt.preventDefault();
            this.closeSummaryModal();
        }
    }

    handleMouseEnter(){
        if(this.modalCloseTimer) clearTimeout(this.modalCloseTimer);
        this.openSummaryModal();
    }

    handleMouseLeave(){
        this.modalCloseTimer = setTimeout(this.closeSummaryModal.bind(this), 300);
    }

    openSummaryModal(){
        this.summaryModalTriggerBtn.setAttribute('aria-expanded', true);
        if(this.summaryModal.show) this.summaryModal.show();
        else this.summaryModal.setAttribute('open', true);
    }

    closeSummaryModal(){
        if(this.summaryModal.close) this.summaryModal.close();
        else this.summaryModal.removeAttribute('open');
        this.summaryModalTriggerBtn.setAttribute('aria-expanded', false);
    }

    handleWriteReview(){
        this.summaryModal.close();
        const reviewSection = document.querySelector('.shopify-section.productReviewsSection');
        if(!reviewSection) return;
        // window.scrollTo(0, reviewSection.getBoundingClientRect().top);
        setTimeout(() => {
            reviewSection.scrollIntoView({behavior: 'smooth'});
            const rootElem = reviewSection.querySelector('[data-bv-show="reviews"]');
            if(rootElem && rootElem.shadowRoot) 
                _theme.focusFirstTabbable($(rootElem.shadowRoot), '[role="button"][tabindex="0"]');
        }, 300);
    }
}

if(!customElements.get(BVRatingSummary.getElementName)){
    customElements.define(BVRatingSummary.getElementName, BVRatingSummary);
}