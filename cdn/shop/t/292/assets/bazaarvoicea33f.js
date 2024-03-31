"use strict";class Bazaarvoice{constructor(){this.container=document.querySelector('.productReviewsSection [data-bv-show="reviews"]'),this.container&&this.watchReviewWidgetInitialization()}init(){this.root=this.container.shadowRoot,this.root&&(this.shouldWatchForGuidelineModal=!0,this.guidelineModalObserver=null,this.updateReviewWidgetStyle(),this.watchReviewWidgetChanges())}watchReviewWidgetInitialization(){const config={root:null,rootMargin:"0px 0px 0"+(Math.floor(window.innerHeight*10/100)+"px")+" 0px",threshold:.05};new IntersectionObserver((entries,observer2)=>{if(entries[0].isIntersecting){const section=entries[0].target;observer2.unobserve(section),setTimeout(this.init.bind(this),3e3)}},config).observe(this.container)}watchReviewWidgetChanges(){const config={attributes:!0,childList:!0,subtree:!0},callback=debounce((mutationList,observer2)=>{mutationList.forEach(mutation=>{if(mutation.type==="childList"){if(mutation.addedNodes.length===0)return;Array.from(mutation.addedNodes).every(node=>{if(node.id&&node.id==="bv-rnr-portal")return this.updatePhotoModal(node),!1})}if(mutation.type==="attributes"&&mutation.attributeName==="aria-pressed"){if(!mutation.target.closest(".bv_rating_content3"))return;const addReviewModal=document.querySelector('[data-bv-show="inpage_submission"]');setTimeout(()=>this.updateAddReviewModalStyle(),1e3)}})});new MutationObserver(callback).observe(this.root,config)}watchReviewModalsInjectedToDOM(){let isBvAddReviewModalInjected=!1;const rootElem=document.body,config={attributes:!1,childList:!0,subtree:!1},callback=debounce((mutationList,observer2)=>{mutationList.every(mutation=>(Array.from(mutation.addedNodes).every(added_node=>{const bvshow=added_node?.dataset?.bvShow;return bvshow&&bvshow==="inpage_submission"?(isBvAddReviewModalInjected=!0,setTimeout(()=>{this.updateAddReviewModalStyle(added_node)},1e3),observer2.disconnect(),!1):!0}),isBvAddReviewModalInjected?(observer2.disconnect(),!1):!0))});new MutationObserver(callback).observe(rootElem,config)}watchReviewGuidLineModalChanges(addReviewModal){if(!addReviewModal)return;let stopLooping=!1;const config={attributes:!1,childList:!0,subtree:!0},callback=debounce((mutationList,observer)=>{mutationList.every(mutation=>(mutation.type==="childList"&&(Array.from(mutation.addedNodes).every(node=>{if(!node||!node.getAttribute)return!0;const type=node.getAttribute("type"),hiddenElem=node.querySelector('[aria-hidden="true"]'),dialog=node.querySelector('[role="dialog"]');if(type&&type==="popup"&&dialog){const dialogLabel=dialog.getAttribute("aria-labelledby");hiddenElem&&hiddenElem.removeAttribute("aria-hidden");let closeBtnParent=node.querySelector("#bv-ips-label-close-button");return dialogLabel&&dialogLabel==="bv-ips-successpop-popup"&&(closeBtnParent=node.querySelector('button[aria-label*="Close"]')),dialog&&closeBtnParent&&dialog.prepend(closeBtnParent.parentElement),_theme.focusFirstTabbable($(node)),this.shouldWatchForGuidelineModal=!1,stopLooping=!0,!1}return!0}),Array.from(mutation.removedNodes).every(node=>{if(!node||!node.getAttribute)return!0;const type=node.getAttribute("type"),hiddenElem=node.querySelector('[aria-hidden="true"]');return type&&type==="popup"&&hiddenElem?(this.shouldWatchForGuidelineModal=!0,stopLooping=!0,!1):!0})),!stopLooping))});this.guidelineModalObserver=new MutationObserver(callback),this.guidelineModalObserver.observe(addReviewModal,config)}updateReviewWidgetStyle(){const style=document.createElement("style");style.textContent=`
            .visually-hidden {
                position: absolute!important;
                overflow: hidden;
                width: 1px;
                height: 1px;
                margin: -1px;
                padding: 0;
                border: 0;
                clip: rect(0 0 0 0);
                word-wrap: normal!important;
            }
            ul li .prev, .cTWDsX li .next { position: relative; }
            ul li .prev:focus-visible::after { content: 'Previous reviews'; left: 0; }
            ul li .next:focus-visible::after { content: 'Next reviews'; right: 0; }
            ul li .prev:focus-visible::after,
            ul li .next:focus-visible::after {
                display: block;
                background: #000;
                color: #fff;
                position: absolute;
                top: calc(100% + 4px);
                padding: 4px 8px;
                font-size: 0.875rem;
                line-height: normal;
                white-space: nowrap;
            }
            #bv_review_maincontainer svg.hyTcyl path, 
            #bv_review_maincontainer svg.hyTcyl polygon { stroke: #000;}
            .hJlnPh .reportbutton { border: 1px solid #000; padding: 4px 8px;}
            button.jqywFD { text-decoration: underline; }
            #bv-reviews-rating-snapshot-container{display:none}
        `,this.root.append(style),this.root.querySelectorAll('[id="bv_rating_summary_star_filled_1_1_99.99_product1_undefined"]').forEach((elem,index)=>{const newId=elem.id+"_"+index;elem.id=newId;const svg=elem.closest("svg");if(!svg)return;const svg_polygon=svg.querySelector("polygon"),svg_path=svg.querySelector("path"),newStyle=`url(${window.location.href}#${newId})`;svg_polygon&&(svg_polygon.style.fill=newStyle),svg_path&&(svg_path.style.fill=newStyle)})}updatePhotoModal(target){if(!target)return;const photoModal=target.querySelector("#photoModal");if(!photoModal)return;photoModal.setAttribute("aria-label","Full Review");const closeBtn=photoModal.querySelector(".modalCloseBtn");if(photoModal.querySelectorAll('img[role="alert"]').forEach(img=>{img.removeAttribute("role"),img.removeAttribute("aria-live")}),closeBtn){const btnSrOnlyText=document.createElement("span");btnSrOnlyText.classList.add("visually-hidden");const btnText="Close photo modal";btnSrOnlyText.textContent=btnText,closeBtn.append(btnSrOnlyText),closeBtn.setAttribute("aria-label",btnText)}}updateAddReviewModalStyle(addReviewModal){const reviewModal=addReviewModal||document.querySelector('[data-bv-show="inpage_submission"]');if(!reviewModal||!reviewModal.shadowRoot)return;const root=reviewModal.shadowRoot,isStyleExist=root.querySelector("style[data-new]");if(this.shouldWatchForGuidelineModal&&(this.guidelineModalObserver&&(this.guidelineModalObserver.disconnect(),this.guidelineModalObserver=null),setTimeout(()=>{this.watchReviewGuidLineModalChanges(root)},2e3)),isStyleExist)return;const style=document.createElement("style");style.setAttribute("data-new",!0),style.textContent=`
            .ckUDTq {white-space: normal;}
            [type="fieldTitle"] button {text-decoration: underline;}
            [type="focus"] [aria-labelledby*='bv-ips-offscreen-round-close-button'] { height: auto; }
        `,root.append(style)}}window.addEventListener("DOMContentLoaded",evt=>{new Bazaarvoice});
//# sourceMappingURL=/cdn/shop/t/292/assets/bazaarvoice.js.map?v=88859360584853127951710766588
