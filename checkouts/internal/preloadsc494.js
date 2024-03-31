
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.baseline.en.cd3f231ecf338317ce55.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/625.baseline.en.5c5d0aacc3ee30e93c13.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/486.baseline.en.eb7dddfbd2b4b0f0bc0b.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/681.baseline.en.87cfc17079887f08f788.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.6df9e83b5e84cd645dee.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/751.baseline.en.3248b1ea37c8c8287656.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/836.baseline.en.09e3037e8cca27835a34.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/179.baseline.en.cda528453c57df5383cf.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/100.baseline.en.aaf5a5941b77953f0095.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/OnePage.baseline.en.d72ef97c222a25ba08d9.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/625.baseline.en.5eeb7486c5777b0f95a3.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.f79e630f70b79519e81e.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/836.baseline.en.5c8be743b69bc96dbc9b.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/268.baseline.en.bb49b10e29810e77451c.css"];
      var fontPreconnectUrls = ["https://fonts.shopifycdn.com"];
      var fontPrefetchUrls = ["https://fonts.shopifycdn.com/montserrat/montserrat_n4.1d581f6d4bf1a97f4cbc0b88b933bc136d38d178.woff2?h1=cGVyZnVtYW5pYS5jb20&hmac=21ac71f45f401d7d6cc55e54d687e10d7d8fb594bc4e586039f828d254d10acb","https://fonts.shopifycdn.com/montserrat/montserrat_n7.c496e9cf2031deec4c4bca338faa81971c8631d4.woff2?h1=cGVyZnVtYW5pYS5jb20&hmac=450951895b17040e95d9d36c79ffc3224598537c803681a5953fa6245fa3349d","https://fonts.shopifycdn.com/alegreya_sans/alegreyasans_n4.59e120541f4f6f427ecd086379922b7764465df9.woff2?h1=cGVyZnVtYW5pYS5jb20&hmac=734862c753fa25f00835b7ea5fab2b252264d200e6a22c953b89a5b6c4276c48","https://fonts.shopifycdn.com/alegreya_sans/alegreyasans_n7.475a79fe0fef75789bc066fc255516ef43ccbd1f.woff2?h1=cGVyZnVtYW5pYS5jb20&hmac=7916d1ddb234bfd9345b407a531a7d945cc762b1b9edf348d92e61936c9ac0c9"];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0269/7763/2389/files/perfumania-logo-desktop_x320.jpg?v=1709819615"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  