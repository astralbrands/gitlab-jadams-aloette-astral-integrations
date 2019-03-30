<script type="text/javascript">
(function(XHR) {
    "use strict";

    var open = XHR.prototype.open;
    var send = XHR.prototype.send;

    XHR.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        open.call(this, method, url, async, user, pass);
    };

    XHR.prototype.send = function(data) {
        var self = this;
        var oldOnReadyStateChange;
        var url = this._url;

        function onReadyStateChange() {
            if(url.includes("api/shopping/") && self.readyState == 4) {
                setTimeout(function() {
                    if (typeof window.AloetteEvents === "function") {
                        if (typeof window.eventParser === "undefined") {
                            window.eventParser = new AloetteEvents();  
                        }
                        window.eventParser.parseLoadEvent(url, self.responseText);
                    }
                }, 0);
            }
            if(oldOnReadyStateChange) {
                oldOnReadyStateChange();
            }
        }

        if(this.addEventListener) {
            this.addEventListener("readystatechange", onReadyStateChange, false);
        } else {
            oldOnReadyStateChange = this.onreadystatechange; 
            this.onreadystatechange = onReadyStateChange;
        }

        send.call(this, data);
    }
})(XMLHttpRequest);
</script>