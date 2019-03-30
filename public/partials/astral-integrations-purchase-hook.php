<script type="text/javascript">
(function() {
    "use strict";
    if (window.sessionStorage.getItem('lastPaidOrder') && window.location.pathname.indexOf('shop-success') > -1) {
        if (typeof window.AloetteEvents === 'function') {
            if (typeof window.eventParser === 'undefined') {
                window.eventParser = new AloetteEvents();  
            }
            window.eventParser.purchaseEvent();
        }
    }
})();
</script>