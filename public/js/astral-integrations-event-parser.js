/**
 * Welcome to the house of cards. If you are supporting this then I am very sorry
 * for your pain. This script was written to run analytics on Aloette in a very
 * under a very specific state. Despite efforts to make it more robust, I make
 * no promises that it survive any updates to Wordpress or the IDSTC API. Good Luck
 */

var AloetteEvents = (function() {
    "use strict";

    function AloetteEvents () {
        this.dataLayer = window.dataLayer;
        this.getCurrencyCode();
    }

    /**
     * Parses a ajax load event and pushes it into the dataLayer
     * 
     * @param  string url  
     * @param  string data Response Text from Ajax call
     * @return void
     */
    AloetteEvents.prototype.parseLoadEvent = function (url, data) {
        if (typeof this.dataLayer !== "undefined") {
            //check if dataLayer even exists
            try {
                var rawData = JSON.parse(data);;
            } catch (e) {
                return false;
            }
            if ((url.indexOf("StartNewCart") > -1 || 
                url.indexOf("getCartInfo") > -1) &&
                typeof rawData.CurrencyTypeID !== "undefined" &&
                rawData.CurrencyTypeID !== null) {
                //Get Currency Code
                this._setCurrencyCode(rawData.CurrencyTypeID);
            } else if (url.indexOf("GetProductsForCart") > -1) {
                //Process Category View
                var event = {
                    "event": "eec.impressionView",
                    "ecommerce": {
                        "currencyCode": this.getCurrencyCode(),
                        "impressions": this._parseCategoryEvent(rawData),
                    },
                }
                this.dataLayer.push(event);
            } else if (url.indexOf("GetProductDetail") > -1) {
                //Process Product View

            } else if (url.indexOf("GetViewCartInfo") > -1) {
                //Process Cart View

            } else if (url.indexOf("GetSubtotalInfo") > -1) {
                //Process Checkout Init View
            }            
        }
    }

    /**
     * Parses a category view event
     * @param  Object rawData Raw return from api of current view.
     * @return object JSON object describing the current impression
     */
    AloetteEvents.prototype._parseCategoryEvent = function(rawData) {
        var urlParams = window.location.search,
        queryParams = {},
        impressions = [],
        i = 0,
        impressionLen = 0;

        if (urlParams.length > 0) {
            queryParams = this._parseUrlParams(urlParams)
        }

        if (typeof queryParams["items"] !== undefined) {
            queryParams["items"] = parseInt(queryParams["items"]);
            //Check if there is more data then currently in the view
            if (rawData.length > queryParams["items"]) {
                impressionLen = queryParams["items"];
                if (typeof queryParams["pg"] !== "undefined" &&
                    parseInt(queryParams["pg"]) > 1) {
                    queryParams["pg"] = parseInt(queryParams["pg"]);
                    i = impressionLen;
                    impressionLen = queryParams["items"] * queryParams["pg"];
                }
            } else {
                impressionLen = rawData.length;
            }
        } else {
            impressionLen = rawData.length;
        }
        
        while (i < impressionLen) {
            impressions.push(this._parseCategoryProductView(rawData[i], i));
            i++;
        } 
        return impressions;
    }

    AloetteEvents.prototype.getCurrencyCode = function() {
        if (typeof this.currencyCode === "undefined" ||
            this.currencyCode == "") {
            return this._setCurrencyCode();
        }
        return this.currencyCode;
    }

    AloetteEvents.prototype._setCurrencyCode = function(currencyTypeID) {
        var currencyTypes = localStorage.getItem("CurrencyTypes");
        if (typeof currencyTypeID !== "undefined" && 
            currencyTypeID && currencyTypes) {
            try {
                currencyTypes = JSON.parse(currencyTypes);;
            } catch (e) {
                return this.currencyCode = "USD";
            }

            if (typeof currencyTypes.currencyTypes !== "undefined") {
                for (var i = 0; i < currencyTypes.currencyTypes.length; i++) {
                    if (typeof currencyTypes.currencyTypes[i].CurrencyTypeID !== "undefined" &&
                        typeof currencyTypes.currencyTypes[i].ISOCode !== "undefined" &&
                        currencyTypes.currencyTypes[i].CurrencyTypeID == currencyTypeID) {
                        return this.currencyCode = currencyTypes.currencyTypes[i].ISOCode
                    }
                }
            }
        } 
        return this.currencyCode = "USD";
    }

    AloetteEvents.prototype._parseCategoryProductView = function(rawProduct, position) {
        var product = {};

        if (typeof rawProduct.sku !== "undefined" && rawProduct.sku) {
            product["id"] = rawProduct.sku;
            product["brand"] = "Aloette";
            if (typeof position !== "undefined") {
                product["position"] = position;
            }
            if (typeof rawProduct.displayName !== "undefined" &&
                rawProduct.displayName) {
                product["name"] = rawProduct.displayName;
            }
            if (typeof rawProduct.price !== "undefined" &&
                rawProduct.price != null) {
                product["price"] = rawProduct.price;
            }
            if (typeof rawProduct.displayCategories !== undefined &&
                rawProduct.displayCategories.length > 0) {
                for (var i = 0; i < rawProduct.displayCategories.length; i++) {
                    if (typeof rawProduct.displayCategories[i].displayCategoryID !== "undefined" &&
                        rawProduct.displayCategories[i].displayCategories) {
                        product["category"] = rawProduct.displayCategories[i].displayCategoryID
                        break;
                    }
                }
            }
        }
        return product;
    }

    AloetteEvents.prototype.purchaseEvent = function() {
        var ordersProcessed, order, purchaseEvent;

        try {
            order = JSON.parse(window.sessionStorage.getItem("lastPaidOrder"));
        } catch (e) {
            return false
        }

        ordersProcessed = window.sessionStorage.getItem("ordersProcessed");
        if (ordersProcessed) {
            try {
            ordersProcessed = JSON.parse(window.sessionStorage.getItem("ordersProcessed"));
            } catch (e) {
            }
        } else {
            ordersProcessed = [];
        }
        //Validate that the last order session object contains recognizable 
        //order id
        if (typeof order.OrderID !== "undefined") {
            if (ordersProcessed && ordersProcessed.length > 0) {
                //Check if the order has already been processes 
                //(page refreshes, etc)
                if ( ordersProcessed.indexOf(order.OrderID) > -1 ) {
                    //exit event parsing if order has already been processed
                    return;
                }
            }

            purchaseEvent = {
                "event": "eec.purchase",
                "ecommerce": {
                    "currencyCode": this.getCurrencyCode(),
                    "purchase" : this._parseOrderEvent(order),
                }
            };
            this.dataLayer.push(purchaseEvent);
            ordersProcessed.push(order.OrderID);
            window.sessionStorage.setItem("ordersProcessed", JSON.stringify(ordersProcessed));
        }

    }

    AloetteEvents.prototype._parseOrderEvent = function(order) {
        var event = {
            "actionField": {},
            "products": [],
        }, product;

        event.actionField["id"] = order.OrderID;
        //Get Order Total for revenue
        if (typeof order.OrderTotal !== "undefined" && order.OrderTotal) {
            event.actionField["revenue"] = order.OrderTotal;
        } else {
            event.actionField["revenue"] = 0;
        }
        //Get tax costs
        if (typeof order.Tax !== "undefined" &&
            order.Tax) {
            event.actionField["tax"] = order.tax;
        }
        //Get Order Shipping Costs
        if (typeof order.ShippingMethods !== "undefined" && 
            order.ShippingMethods && 
            typeof order.Shipping !== "undefined" &&
            order.Shipping ) {
            event.actionField["shipping"] = order.Shipping;
        }
        for (var i = 0; i < order.OrderLines.length; i++) {
            //Get Product Data for event
            product = this._parseOrderProductEvent(order.OrderLines[i]);
            if (product) {
            //If valid product data is available;
                event.products.push(this._parseOrderProductEvent(order.OrderLines[i]));
            }
        }

        return event;
    }

    AloetteEvents.prototype._parseOrderProductEvent = function(rawProduct) {
        var product = {};

        if (typeof rawProduct.ProductSKU !== "undefined" && rawProduct.ProductSKU) {
            product["id"] = rawProduct.ProductSKU;
            if (typeof rawProduct.ProductDisplayName !== "undefined" && rawProduct.ProductDisplayName) {
                product["name"] = rawProduct.ProductDisplayName;
            }
            if (typeof rawProduct.Quantity !== "undefined" && rawProduct.Quantity) {
                product["quantity"] = rawProduct.Quantity;
            }
            if (typeof rawProduct.Price !== "undefined" && rawProduct.Price) {
                product["price"] = rawProduct.Price;
            }
        } else {
            //Skip Product if SKU Unavailable
            product = false;
        }
        return product;
    }

    AloetteEvents.prototype._parseUrlParams = function(urlParams) {
        urlParams = urlParams.substring(1)
        var vars = urlParams.split("&");
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            // If first entry with this name
            if (typeof query_string[key] === "undefined") {
                query_string[key] = decodeURIComponent(value);
            // If second entry with this name
            } else if (typeof query_string[key] === "string") {
                var arr = [query_string[key], decodeURIComponent(value)];
                query_string[key] = arr;
            // If third or later entry with this name
            } else {
                query_string[key].push(decodeURIComponent(value));
            }
        }
        return query_string;
    }

    return AloetteEvents;
})();