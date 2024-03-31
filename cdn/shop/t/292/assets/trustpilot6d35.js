/** Shopify CDN: Minification failed

Line 16:0 Transforming class syntax to the configured target environment ("es5") is not supported yet
Line 18:15 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 27:25 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 35:19 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 36:8 Transforming const to the configured target environment ("es5") is not supported yet
Line 42:18 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 49:4 Transforming async functions to the configured target environment ("es5") is not supported yet
Line 51:12 Transforming const to the configured target environment ("es5") is not supported yet
Line 58:12 Transforming const to the configured target environment ("es5") is not supported yet
Line 67:26 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
... and 5 more hidden warnings

**/
class Trustpilot extends HTMLElement {

    constructor(){
        super();

        this.isMobile = window.innerWidth < 1025 ? true : false;
        this.definePlacement();
        this.buildSelecotrs();
        this.fetchData();
    }

    static getElementName(){
        return 'trustpilot-summary'
    }

    get companyName(){
        return "www.perfumania.com"
    }

    definePlacement(){
        const desktopTpWrapper = document.querySelector('footer.footer-wrapper .footer-bottom-pane-wrap');
        if(this.isMobile || !desktopTpWrapper) return;

        desktopTpWrapper.prepend(this);
    }

    buildSelecotrs(){
        this.tpScore = this.querySelector('[data-tp-score]');
        this.tpReview = this.querySelector('[data-tp-reviews]');
        // this.srOnly = this.querySelector('.visually-hidden');
        this.globalTpSrOnly = document.querySelectorAll('[data-tp-sr-only]');
    }

    async fetchData(){
        try {
            const resp = await fetch(
                `https://api.trustpilot.com/v1/business-units/find?name=${this.companyName}`, 
                {
                    headers: { 'apikey': 'Bma1O3hzcwubG63AcMXW8wTysjZoFllM', 'Content-Type': 'application/json' }
                }
            );

            const data = await resp.json();
            this.data = data;
            this.render();
            this.updateGlobalSrOnlyText();
        } catch(err){
            console.log(err);
        }
    }

    updateGlobalSrOnlyText(){
        if(!this.data) return;
        const reviewText = this.data.score.trustScore + ' out of five star rating on Trustpilot';
        this.globalTpSrOnly = document.querySelectorAll('[data-tp-sr-only]');
        this.globalTpSrOnly.forEach(elem => {
            elem.textContent = reviewText;
            const parentLink = elem.closest('a');
            if(parentLink) parentLink.setAttribute('aria-label', reviewText);
        });
    }

    render(){
        if(!this.data) return;
        if(!this.data.status || this.data.status !== 'active') return;
        this.tpScore.innerHTML = 'TrustScore <strong>'+ this.data.score.trustScore +'</strong>';
        this.tpReview.innerHTML = '<strong>'+ this.data.numberOfReviews.total +'</strong> reviews';
        const reviewText = 'TrustScore ' + this.data.score.trustScore + ' stars out of 5 stars rating on Trustpilot. Based on ' + this.data.numberOfReviews.total + ' reviews';
        const link = this.querySelector('a');
        // link.setAttribute('aria-label', 'TrustScore ' + this.data.score.trustScore + ' ' + this.data.numberOfReviews.total + ' reviews');
        link.setAttribute('aria-description', reviewText);
        // this.srOnly.textContent = reviewText;
    }
}

if(!customElements.get(Trustpilot.getElementName()))
    customElements.define(Trustpilot.getElementName(), Trustpilot);