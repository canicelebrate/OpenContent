﻿///#source 1 1 AddressField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AddressField = Alpaca.Fields.ObjectField.extend(
    /**
     * @lends Alpaca.Fields.AddressField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.ObjectField#getFieldType
         */
        getFieldType: function () {
            return "address";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#setup
         */
        setup: function () {
            /// <summary>
            /// s this instance.
            /// </summary>
            /// <returns></returns>
            this.base();

            if (this.data === undefined) {
                this.data = {
                    
                };
            }

            this.schema = {
                "title": "Address",
                "type": "object",
                "properties": {
                    "search": {
                        "title": "Search",
                        "type": "string"
                    },
                    "street": {
                        "title": "Street",
                        "type": "string"
                    },
                    "number": {
                        "title": "House Number",
                        "type": "string"
                    },
                    "city": {
                        "title": "City",
                        "type": "string"
                    },
                    "state": {
                        "title": "State",
                        "type": "string",
                        "enum": ["AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY"]
                    },
                    "postalcode": {
                        "title": "Postal Code",
                        "type": "string"
                    },
                    "country": {
                        "title": "Country",
                        "type": "string"
                    },
                    "latitude": {
                        "title": "Latitude",
                        "type": "number"
                    },
                    "longitude": {
                        "title": "Longitude",
                        "type": "number"
                    }
                }
            };
            Alpaca.merge(this.options, {
                "fields": {
                    "search": {
                        "fieldClass": "googlesearch"
                    },
                    "street": {
                        "fieldClass": "street"
                    },
                    "number": {
                        "fieldClass": "number"
                    },
                    "city": {
                        "fieldClass": "city"
                    },
                    "postalcode": {
                        "fieldClass": "postalcode"
                    },
                    "state": {
                        "optionLabels": ["ALABAMA", "ALASKA", "AMERICANSAMOA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "DISTRICTOFCOLUMBIA", "FEDERATEDSTATESOFMICRONESIA", "FLORIDA", "GEORGIA", "GUAM", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARSHALLISLANDS", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEWHAMPSHIRE", "NEWJERSEY", "NEWMEXICO", "NEWYORK", "NORTHCAROLINA", "NORTHDAKOTA", "NORTHERNMARIANAISLANDS", "OHIO", "OKLAHOMA", "OREGON", "PALAU", "PENNSYLVANIA", "PUERTORICO", "RHODEISLAND", "SOUTHCAROLINA", "SOUTHDAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINISLANDS", "VIRGINIA", "WASHINGTON", "WESTVIRGINIA", "WISCONSIN", "WYOMING"],
                        "fieldClass": "state",
                        "hidden": true
                    },
                    "country": {
                        "type": "country",
                        "fieldClass": "country"
                    },
                    "latitude": {
                        "fieldClass": "lat"
                    },
                    "longitude": {
                        "fieldClass": "lng"
                    }
                }
            });

            if (Alpaca.isEmpty(this.options.addressValidation)) {
                this.options.addressValidation = true;
            }

            
        },

        /**
         * @see Alpaca.Field#isContainer
         */
        isContainer: function () {
            return false;
        },

        /**
         * Returns address in a single line string.
         *
         * @returns {String} Address as a single line string.
         */
        getAddress: function () {
            var value = this.getValue();
            if (this.view.type === "view") {
                value = this.data;
            }
            var address = "";
            if (value) {
                if (value.street) {
                    address += value.street + " ";
                }
                if (value.number) {
                    address += value.number + " ";
                }
                if (value.city) {
                    address += value.city + " ";
                }
                if (value.state) {
                    address += value.state + " ";
                }
                if (value.postalcode) {
                    address += value.postalcode +  " ";
                }
                if (value.country) {
                    address += countryName(value.country);
                }
            }

            return address;
        },

        /**
         * @see Alpaca.Field#afterRenderContainer
         */
        afterRenderContainer: function (model, callback) {

            var self = this;

            this.base(model, function () {
                var container = self.getContainerEl();

                // apply additional css
                $(container).addClass("alpaca-addressfield");

                if (self.options.addressValidation && !self.isDisplayOnly()) {
                    $('<div style="clear:both;"></div>').appendTo(container);
                    var mapButton = $('<a href="#" class="alpaca-form-button">Geocode Address</a>').appendTo(container);
                    if (mapButton.button) {
                        mapButton.button({
                            text: true
                        });
                    }
                    mapButton.click(function () {

                        if (google && google.maps) {
                            var geocoder = new google.maps.Geocoder();
                            var address = self.getAddress();
                            if (geocoder) {
                                geocoder.geocode({
                                    'address': address
                                }, function (results, status) {
                                    if (status === google.maps.GeocoderStatus.OK) {
                                        /*
                                        var mapCanvasId = self.getId() + "-map-canvas";
                                        if ($('#' + mapCanvasId).length === 0) {
                                            $("<div id='" + mapCanvasId + "' class='alpaca-field-address-mapcanvas'></div>").appendTo(self.getFieldEl());
                                        }

                                        var map = new google.maps.Map(document.getElementById(self.getId() + "-map-canvas"), {
                                            "zoom": 10,
                                            "center": results[0].geometry.location,
                                            "mapTypeId": google.maps.MapTypeId.ROADMAP
                                        });

                                        var marker = new google.maps.Marker({
                                            map: map,
                                            position: results[0].geometry.location
                                        });
                                        */
                                        $(".alpaca-field.lng input.alpaca-control", container).val(results[0].geometry.location.lng());
                                        $(".alpaca-field.lat input.alpaca-control", container).val(results[0].geometry.location.lat());
                                    }
                                    else {
                                        self.displayMessage("Geocoding failed: " + status);
                                    }
                                });
                            }

                        }
                        else {
                            self.displayMessage("Google Map API is not installed.");
                        }
                        return false;
                    }).wrap('<small/>');

                    //var mapSearchId = self.getId() + "-map-search";
                    //var input = $("<input type='textbox' id='" + mapSearchId + "' class='alpaca-field-address-mapsearch'></div>").prependTo(container)[0];
                    var input = $(".alpaca-field.googlesearch input.alpaca-control", container)[0];
                    //var input = document.getElementById(mapSearchId);
                    if (input && (typeof google != "undefined") && google && google.maps) {
                        var searchBox = new google.maps.places.SearchBox(input);
                        google.maps.event.addListener(searchBox, 'places_changed', function () {
                            var places = searchBox.getPlaces();
                            if (places.length == 0) {
                                return;
                            }
                            var place = places[0];
                            $(".alpaca-field.postalcode input.alpaca-control", container).val(addressPart(place, "postal_code"));
                            $(".alpaca-field.city input.alpaca-control", container).val(addressPart(place, "locality"));
                            $(".alpaca-field.street input.alpaca-control", container).val(addressPart(place, "route"));
                            $(".alpaca-field.number input.alpaca-control", container).val(addressPart(place, "street_number"));
                            $(".alpaca-field.country select.alpaca-control", container).val(countryISO3(addressCountry(place, "country")));

                            $(".alpaca-field.lng input.alpaca-control", container).val(place.geometry.location.lng());
                            $(".alpaca-field.lat input.alpaca-control", container).val(place.geometry.location.lat());
                            input.value = '';

                        });
                        google.maps.event.addDomListener(input, 'keydown', function (e) {
                            if (e.keyCode == 13) {
                                e.preventDefault();
                            }
                        });
                    }

                    if (self.options.showMapOnLoad) {
                        mapButton.click();
                    }
                }

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.ObjectField#getType
         */
        getType: function () {
            return "any";
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.ObjectField#getTitle
         */
        getTitle: function () {
            return "Address";
        },

        /**
         * @see Alpaca.Fields.ObjectField#getDescription
         */
        getDescription: function () {
            return "Address with Street, City, State, Postal code and Country. Also comes with support for Google map.";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "validateAddress": {
                        "title": "Address Validation",
                        "description": "Enable address validation if true",
                        "type": "boolean",
                        "default": true
                    },
                    "showMapOnLoad": {
                        "title": "Whether to show the map when first loaded",
                        "type": "boolean"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "validateAddress": {
                        "helper": "Address validation if checked",
                        "rightLabel": "Enable Google Map for address validation?",
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    function addressPart(place, adrtype) {
        var res = "";
        if (place && place.address_components) {
            $.each(place.address_components, function (i, comp) {
                $.each(comp.types, function (i, comptype) {
                    if (comptype == adrtype) {
                        //alert(comp.long_name);
                        res = comp.long_name;
                        return;
                    }
                });
                if (res != "") return;
            });
        }
        return res;
    }
    function addressCountry(place) {
        var res = "";
        if (place && place.address_components) {
            $.each(place.address_components, function (i, comp) {
                $.each(comp.types, function (i, comptype) {
                    if (comptype == 'country') {
                        //alert(comp.long_name);
                        res = comp.short_name;
                        return;
                    }
                });
                if (res != "") return;
            });
        }
        return res;
    }

    var countries = [{ "countryName": "Afghanistan", "iso2": "AF", "iso3": "AFG", "phoneCode": "93" }, { "countryName": "Albania", "iso2": "AL", "iso3": "ALB", "phoneCode": "355" }, { "countryName": "Algeria", "iso2": "DZ", "iso3": "DZA", "phoneCode": "213" }, { "countryName": "American Samoa", "iso2": "AS", "iso3": "ASM", "phoneCode": "1 684" }, { "countryName": "Andorra", "iso2": "AD", "iso3": "AND", "phoneCode": "376" }, { "countryName": "Angola", "iso2": "AO", "iso3": "AGO", "phoneCode": "244" }, { "countryName": "Anguilla", "iso2": "AI", "iso3": "AIA", "phoneCode": "1 264" }, { "countryName": "Antarctica", "iso2": "AQ", "iso3": "ATA", "phoneCode": "672" }, { "countryName": "Antigua and Barbuda", "iso2": "AG", "iso3": "ATG", "phoneCode": "1 268" }, { "countryName": "Argentina", "iso2": "AR", "iso3": "ARG", "phoneCode": "54" }, { "countryName": "Armenia", "iso2": "AM", "iso3": "ARM", "phoneCode": "374" }, { "countryName": "Aruba", "iso2": "AW", "iso3": "ABW", "phoneCode": "297" }, { "countryName": "Australia", "iso2": "AU", "iso3": "AUS", "phoneCode": "61" }, { "countryName": "Austria", "iso2": "AT", "iso3": "AUT", "phoneCode": "43" }, { "countryName": "Azerbaijan", "iso2": "AZ", "iso3": "AZE", "phoneCode": "994" }, { "countryName": "Bahamas", "iso2": "BS", "iso3": "BHS", "phoneCode": "1 242" }, { "countryName": "Bahrain", "iso2": "BH", "iso3": "BHR", "phoneCode": "973" }, { "countryName": "Bangladesh", "iso2": "BD", "iso3": "BGD", "phoneCode": "880" }, { "countryName": "Barbados", "iso2": "BB", "iso3": "BRB", "phoneCode": "1 246" }, { "countryName": "Belarus", "iso2": "BY", "iso3": "BLR", "phoneCode": "375" }, { "countryName": "Belgium", "iso2": "BE", "iso3": "BEL", "phoneCode": "32" }, { "countryName": "Belize", "iso2": "BZ", "iso3": "BLZ", "phoneCode": "501" }, { "countryName": "Benin", "iso2": "BJ", "iso3": "BEN", "phoneCode": "229" }, { "countryName": "Bermuda", "iso2": "BM", "iso3": "BMU", "phoneCode": "1 441" }, { "countryName": "Bhutan", "iso2": "BT", "iso3": "BTN", "phoneCode": "975" }, { "countryName": "Bolivia", "iso2": "BO", "iso3": "BOL", "phoneCode": "591" }, { "countryName": "Bosnia and Herzegovina", "iso2": "BA", "iso3": "BIH", "phoneCode": "387" }, { "countryName": "Botswana", "iso2": "BW", "iso3": "BWA", "phoneCode": "267" }, { "countryName": "Brazil", "iso2": "BR", "iso3": "BRA", "phoneCode": "55" }, { "countryName": "British Indian Ocean Territory", "iso2": "IO", "iso3": "IOT", "phoneCode": "" }, { "countryName": "British Virgin Islands", "iso2": "VG", "iso3": "VGB", "phoneCode": "1 284" }, { "countryName": "Brunei", "iso2": "BN", "iso3": "BRN", "phoneCode": "673" }, { "countryName": "Bulgaria", "iso2": "BG", "iso3": "BGR", "phoneCode": "359" }, { "countryName": "Burkina Faso", "iso2": "BF", "iso3": "BFA", "phoneCode": "226" }, { "countryName": "Burma (Myanmar)", "iso2": "MM", "iso3": "MMR", "phoneCode": "95" }, { "countryName": "Burundi", "iso2": "BI", "iso3": "BDI", "phoneCode": "257" }, { "countryName": "Cambodia", "iso2": "KH", "iso3": "KHM", "phoneCode": "855" }, { "countryName": "Cameroon", "iso2": "CM", "iso3": "CMR", "phoneCode": "237" }, { "countryName": "Canada", "iso2": "CA", "iso3": "CAN", "phoneCode": "1" }, { "countryName": "Cape Verde", "iso2": "CV", "iso3": "CPV", "phoneCode": "238" }, { "countryName": "Cayman Islands", "iso2": "KY", "iso3": "CYM", "phoneCode": "1 345" }, { "countryName": "Central African Republic", "iso2": "CF", "iso3": "CAF", "phoneCode": "236" }, { "countryName": "Chad", "iso2": "TD", "iso3": "TCD", "phoneCode": "235" }, { "countryName": "Chile", "iso2": "CL", "iso3": "CHL", "phoneCode": "56" }, { "countryName": "China", "iso2": "CN", "iso3": "CHN", "phoneCode": "86" }, { "countryName": "Christmas Island", "iso2": "CX", "iso3": "CXR", "phoneCode": "61" }, { "countryName": "Cocos (Keeling) Islands", "iso2": "CC", "iso3": "CCK", "phoneCode": "61" }, { "countryName": "Colombia", "iso2": "CO", "iso3": "COL", "phoneCode": "57" }, { "countryName": "Comoros", "iso2": "KM", "iso3": "COM", "phoneCode": "269" }, { "countryName": "Cook Islands", "iso2": "CK", "iso3": "COK", "phoneCode": "682" }, { "countryName": "Costa Rica", "iso2": "CR", "iso3": "CRC", "phoneCode": "506" }, { "countryName": "Croatia", "iso2": "HR", "iso3": "HRV", "phoneCode": "385" }, { "countryName": "Cuba", "iso2": "CU", "iso3": "CUB", "phoneCode": "53" }, { "countryName": "Cyprus", "iso2": "CY", "iso3": "CYP", "phoneCode": "357" }, { "countryName": "Czech Republic", "iso2": "CZ", "iso3": "CZE", "phoneCode": "420" }, { "countryName": "Democratic Republic of the Congo", "iso2": "CD", "iso3": "COD", "phoneCode": "243" }, { "countryName": "Denmark", "iso2": "DK", "iso3": "DNK", "phoneCode": "45" }, { "countryName": "Djibouti", "iso2": "DJ", "iso3": "DJI", "phoneCode": "253" }, { "countryName": "Dominica", "iso2": "DM", "iso3": "DMA", "phoneCode": "1 767" }, { "countryName": "Dominican Republic", "iso2": "DO", "iso3": "DOM", "phoneCode": "1 809" }, { "countryName": "Ecuador", "iso2": "EC", "iso3": "ECU", "phoneCode": "593" }, { "countryName": "Egypt", "iso2": "EG", "iso3": "EGY", "phoneCode": "20" }, { "countryName": "El Salvador", "iso2": "SV", "iso3": "SLV", "phoneCode": "503" }, { "countryName": "Equatorial Guinea", "iso2": "GQ", "iso3": "GNQ", "phoneCode": "240" }, { "countryName": "Eritrea", "iso2": "ER", "iso3": "ERI", "phoneCode": "291" }, { "countryName": "Estonia", "iso2": "EE", "iso3": "EST", "phoneCode": "372" }, { "countryName": "Ethiopia", "iso2": "ET", "iso3": "ETH", "phoneCode": "251" }, { "countryName": "Falkland Islands", "iso2": "FK", "iso3": "FLK", "phoneCode": "500" }, { "countryName": "Faroe Islands", "iso2": "FO", "iso3": "FRO", "phoneCode": "298" }, { "countryName": "Fiji", "iso2": "FJ", "iso3": "FJI", "phoneCode": "679" }, { "countryName": "Finland", "iso2": "FI", "iso3": "FIN", "phoneCode": "358" }, { "countryName": "France", "iso2": "FR", "iso3": "FRA", "phoneCode": "33" }, { "countryName": "French Polynesia", "iso2": "PF", "iso3": "PYF", "phoneCode": "689" }, { "countryName": "Gabon", "iso2": "GA", "iso3": "GAB", "phoneCode": "241" }, { "countryName": "Gambia", "iso2": "GM", "iso3": "GMB", "phoneCode": "220" }, { "countryName": "Gaza Strip", "iso2": "", "iso3": "", "phoneCode": "970" }, { "countryName": "Georgia", "iso2": "GE", "iso3": "GEO", "phoneCode": "995" }, { "countryName": "Germany", "iso2": "DE", "iso3": "DEU", "phoneCode": "49" }, { "countryName": "Ghana", "iso2": "GH", "iso3": "GHA", "phoneCode": "233" }, { "countryName": "Gibraltar", "iso2": "GI", "iso3": "GIB", "phoneCode": "350" }, { "countryName": "Greece", "iso2": "GR", "iso3": "GRC", "phoneCode": "30" }, { "countryName": "Greenland", "iso2": "GL", "iso3": "GRL", "phoneCode": "299" }, { "countryName": "Grenada", "iso2": "GD", "iso3": "GRD", "phoneCode": "1 473" }, { "countryName": "Guam", "iso2": "GU", "iso3": "GUM", "phoneCode": "1 671" }, { "countryName": "Guatemala", "iso2": "GT", "iso3": "GTM", "phoneCode": "502" }, { "countryName": "Guinea", "iso2": "GN", "iso3": "GIN", "phoneCode": "224" }, { "countryName": "Guinea-Bissau", "iso2": "GW", "iso3": "GNB", "phoneCode": "245" }, { "countryName": "Guyana", "iso2": "GY", "iso3": "GUY", "phoneCode": "592" }, { "countryName": "Haiti", "iso2": "HT", "iso3": "HTI", "phoneCode": "509" }, { "countryName": "Holy See (Vatican City)", "iso2": "VA", "iso3": "VAT", "phoneCode": "39" }, { "countryName": "Honduras", "iso2": "HN", "iso3": "HND", "phoneCode": "504" }, { "countryName": "Hong Kong", "iso2": "HK", "iso3": "HKG", "phoneCode": "852" }, { "countryName": "Hungary", "iso2": "HU", "iso3": "HUN", "phoneCode": "36" }, { "countryName": "Iceland", "iso2": "IS", "iso3": "IS", "phoneCode": "354" }, { "countryName": "India", "iso2": "IN", "iso3": "IND", "phoneCode": "91" }, { "countryName": "Indonesia", "iso2": "ID", "iso3": "IDN", "phoneCode": "62" }, { "countryName": "Iran", "iso2": "IR", "iso3": "IRN", "phoneCode": "98" }, { "countryName": "Iraq", "iso2": "IQ", "iso3": "IRQ", "phoneCode": "964" }, { "countryName": "Ireland", "iso2": "IE", "iso3": "IRL", "phoneCode": "353" }, { "countryName": "Isle of Man", "iso2": "IM", "iso3": "IMN", "phoneCode": "44" }, { "countryName": "Israel", "iso2": "IL", "iso3": "ISR", "phoneCode": "972" }, { "countryName": "Italy", "iso2": "IT", "iso3": "ITA", "phoneCode": "39" }, { "countryName": "Ivory Coast", "iso2": "CI", "iso3": "CIV", "phoneCode": "225" }, { "countryName": "Jamaica", "iso2": "JM", "iso3": "JAM", "phoneCode": "1 876" }, { "countryName": "Japan", "iso2": "JP", "iso3": "JPN", "phoneCode": "81" }, { "countryName": "Jersey", "iso2": "JE", "iso3": "JEY", "phoneCode": "" }, { "countryName": "Jordan", "iso2": "JO", "iso3": "JOR", "phoneCode": "962" }, { "countryName": "Kazakhstan", "iso2": "KZ", "iso3": "KAZ", "phoneCode": "7" }, { "countryName": "Kenya", "iso2": "KE", "iso3": "KEN", "phoneCode": "254" }, { "countryName": "Kiribati", "iso2": "KI", "iso3": "KIR", "phoneCode": "686" }, { "countryName": "Kosovo", "iso2": "", "iso3": "", "phoneCode": "381" }, { "countryName": "Kuwait", "iso2": "KW", "iso3": "KWT", "phoneCode": "965" }, { "countryName": "Kyrgyzstan", "iso2": "KG", "iso3": "KGZ", "phoneCode": "996" }, { "countryName": "Laos", "iso2": "LA", "iso3": "LAO", "phoneCode": "856" }, { "countryName": "Latvia", "iso2": "LV", "iso3": "LVA", "phoneCode": "371" }, { "countryName": "Lebanon", "iso2": "LB", "iso3": "LBN", "phoneCode": "961" }, { "countryName": "Lesotho", "iso2": "LS", "iso3": "LSO", "phoneCode": "266" }, { "countryName": "Liberia", "iso2": "LR", "iso3": "LBR", "phoneCode": "231" }, { "countryName": "Libya", "iso2": "LY", "iso3": "LBY", "phoneCode": "218" }, { "countryName": "Liechtenstein", "iso2": "LI", "iso3": "LIE", "phoneCode": "423" }, { "countryName": "Lithuania", "iso2": "LT", "iso3": "LTU", "phoneCode": "370" }, { "countryName": "Luxembourg", "iso2": "LU", "iso3": "LUX", "phoneCode": "352" }, { "countryName": "Macau", "iso2": "MO", "iso3": "MAC", "phoneCode": "853" }, { "countryName": "Macedonia", "iso2": "MK", "iso3": "MKD", "phoneCode": "389" }, { "countryName": "Madagascar", "iso2": "MG", "iso3": "MDG", "phoneCode": "261" }, { "countryName": "Malawi", "iso2": "MW", "iso3": "MWI", "phoneCode": "265" }, { "countryName": "Malaysia", "iso2": "MY", "iso3": "MYS", "phoneCode": "60" }, { "countryName": "Maldives", "iso2": "MV", "iso3": "MDV", "phoneCode": "960" }, { "countryName": "Mali", "iso2": "ML", "iso3": "MLI", "phoneCode": "223" }, { "countryName": "Malta", "iso2": "MT", "iso3": "MLT", "phoneCode": "356" }, { "countryName": "Marshall Islands", "iso2": "MH", "iso3": "MHL", "phoneCode": "692" }, { "countryName": "Mauritania", "iso2": "MR", "iso3": "MRT", "phoneCode": "222" }, { "countryName": "Mauritius", "iso2": "MU", "iso3": "MUS", "phoneCode": "230" }, { "countryName": "Mayotte", "iso2": "YT", "iso3": "MYT", "phoneCode": "262" }, { "countryName": "Mexico", "iso2": "MX", "iso3": "MEX", "phoneCode": "52" }, { "countryName": "Micronesia", "iso2": "FM", "iso3": "FSM", "phoneCode": "691" }, { "countryName": "Moldova", "iso2": "MD", "iso3": "MDA", "phoneCode": "373" }, { "countryName": "Monaco", "iso2": "MC", "iso3": "MCO", "phoneCode": "377" }, { "countryName": "Mongolia", "iso2": "MN", "iso3": "MNG", "phoneCode": "976" }, { "countryName": "Montenegro", "iso2": "ME", "iso3": "MNE", "phoneCode": "382" }, { "countryName": "Montserrat", "iso2": "MS", "iso3": "MSR", "phoneCode": "1 664" }, { "countryName": "Morocco", "iso2": "MA", "iso3": "MAR", "phoneCode": "212" }, { "countryName": "Mozambique", "iso2": "MZ", "iso3": "MOZ", "phoneCode": "258" }, { "countryName": "Namibia", "iso2": "NA", "iso3": "NAM", "phoneCode": "264" }, { "countryName": "Nauru", "iso2": "NR", "iso3": "NRU", "phoneCode": "674" }, { "countryName": "Nepal", "iso2": "NP", "iso3": "NPL", "phoneCode": "977" }, { "countryName": "Netherlands", "iso2": "NL", "iso3": "NLD", "phoneCode": "31" }, { "countryName": "Netherlands Antilles", "iso2": "AN", "iso3": "ANT", "phoneCode": "599" }, { "countryName": "New Caledonia", "iso2": "NC", "iso3": "NCL", "phoneCode": "687" }, { "countryName": "New Zealand", "iso2": "NZ", "iso3": "NZL", "phoneCode": "64" }, { "countryName": "Nicaragua", "iso2": "NI", "iso3": "NIC", "phoneCode": "505" }, { "countryName": "Niger", "iso2": "NE", "iso3": "NER", "phoneCode": "227" }, { "countryName": "Nigeria", "iso2": "NG", "iso3": "NGA", "phoneCode": "234" }, { "countryName": "Niue", "iso2": "NU", "iso3": "NIU", "phoneCode": "683" }, { "countryName": "Norfolk Island", "iso2": "", "iso3": "NFK", "phoneCode": "672" }, { "countryName": "North Korea", "iso2": "KP", "iso3": "PRK", "phoneCode": "850" }, { "countryName": "Northern Mariana Islands", "iso2": "MP", "iso3": "MNP", "phoneCode": "1 670" }, { "countryName": "Norway", "iso2": "NO", "iso3": "NOR", "phoneCode": "47" }, { "countryName": "Oman", "iso2": "OM", "iso3": "OMN", "phoneCode": "968" }, { "countryName": "Pakistan", "iso2": "PK", "iso3": "PAK", "phoneCode": "92" }, { "countryName": "Palau", "iso2": "PW", "iso3": "PLW", "phoneCode": "680" }, { "countryName": "Panama", "iso2": "PA", "iso3": "PAN", "phoneCode": "507" }, { "countryName": "Papua New Guinea", "iso2": "PG", "iso3": "PNG", "phoneCode": "675" }, { "countryName": "Paraguay", "iso2": "PY", "iso3": "PRY", "phoneCode": "595" }, { "countryName": "Peru", "iso2": "PE", "iso3": "PER", "phoneCode": "51" }, { "countryName": "Philippines", "iso2": "PH", "iso3": "PHL", "phoneCode": "63" }, { "countryName": "Pitcairn Islands", "iso2": "PN", "iso3": "PCN", "phoneCode": "870" }, { "countryName": "Poland", "iso2": "PL", "iso3": "POL", "phoneCode": "48" }, { "countryName": "Portugal", "iso2": "PT", "iso3": "PRT", "phoneCode": "351" }, { "countryName": "Puerto Rico", "iso2": "PR", "iso3": "PRI", "phoneCode": "1" }, { "countryName": "Qatar", "iso2": "QA", "iso3": "QAT", "phoneCode": "974" }, { "countryName": "Republic of the Congo", "iso2": "CG", "iso3": "COG", "phoneCode": "242" }, { "countryName": "Romania", "iso2": "RO", "iso3": "ROU", "phoneCode": "40" }, { "countryName": "Russia", "iso2": "RU", "iso3": "RUS", "phoneCode": "7" }, { "countryName": "Rwanda", "iso2": "RW", "iso3": "RWA", "phoneCode": "250" }, { "countryName": "Saint Barthelemy", "iso2": "BL", "iso3": "BLM", "phoneCode": "590" }, { "countryName": "Saint Helena", "iso2": "SH", "iso3": "SHN", "phoneCode": "290" }, { "countryName": "Saint Kitts and Nevis", "iso2": "KN", "iso3": "KNA", "phoneCode": "1 869" }, { "countryName": "Saint Lucia", "iso2": "LC", "iso3": "LCA", "phoneCode": "1 758" }, { "countryName": "Saint Martin", "iso2": "MF", "iso3": "MAF", "phoneCode": "1 599" }, { "countryName": "Saint Pierre and Miquelon", "iso2": "PM", "iso3": "SPM", "phoneCode": "508" }, { "countryName": "Saint Vincent and the Grenadines", "iso2": "VC", "iso3": "VCT", "phoneCode": "1 784" }, { "countryName": "Samoa", "iso2": "WS", "iso3": "WSM", "phoneCode": "685" }, { "countryName": "San Marino", "iso2": "SM", "iso3": "SMR", "phoneCode": "378" }, { "countryName": "Sao Tome and Principe", "iso2": "ST", "iso3": "STP", "phoneCode": "239" }, { "countryName": "Saudi Arabia", "iso2": "SA", "iso3": "SAU", "phoneCode": "966" }, { "countryName": "Senegal", "iso2": "SN", "iso3": "SEN", "phoneCode": "221" }, { "countryName": "Serbia", "iso2": "RS", "iso3": "SRB", "phoneCode": "381" }, { "countryName": "Seychelles", "iso2": "SC", "iso3": "SYC", "phoneCode": "248" }, { "countryName": "Sierra Leone", "iso2": "SL", "iso3": "SLE", "phoneCode": "232" }, { "countryName": "Singapore", "iso2": "SG", "iso3": "SGP", "phoneCode": "65" }, { "countryName": "Slovakia", "iso2": "SK", "iso3": "SVK", "phoneCode": "421" }, { "countryName": "Slovenia", "iso2": "SI", "iso3": "SVN", "phoneCode": "386" }, { "countryName": "Solomon Islands", "iso2": "SB", "iso3": "SLB", "phoneCode": "677" }, { "countryName": "Somalia", "iso2": "SO", "iso3": "SOM", "phoneCode": "252" }, { "countryName": "South Africa", "iso2": "ZA", "iso3": "ZAF", "phoneCode": "27" }, { "countryName": "South Korea", "iso2": "KR", "iso3": "KOR", "phoneCode": "82" }, { "countryName": "Spain", "iso2": "ES", "iso3": "ESP", "phoneCode": "34" }, { "countryName": "Sri Lanka", "iso2": "LK", "iso3": "LKA", "phoneCode": "94" }, { "countryName": "Sudan", "iso2": "SD", "iso3": "SDN", "phoneCode": "249" }, { "countryName": "Suriname", "iso2": "SR", "iso3": "SUR", "phoneCode": "597" }, { "countryName": "Svalbard", "iso2": "SJ", "iso3": "SJM", "phoneCode": "" }, { "countryName": "Swaziland", "iso2": "SZ", "iso3": "SWZ", "phoneCode": "268" }, { "countryName": "Sweden", "iso2": "SE", "iso3": "SWE", "phoneCode": "46" }, { "countryName": "Switzerland", "iso2": "CH", "iso3": "CHE", "phoneCode": "41" }, { "countryName": "Syria", "iso2": "SY", "iso3": "SYR", "phoneCode": "963" }, { "countryName": "Taiwan", "iso2": "TW", "iso3": "TWN", "phoneCode": "886" }, { "countryName": "Tajikistan", "iso2": "TJ", "iso3": "TJK", "phoneCode": "992" }, { "countryName": "Tanzania", "iso2": "TZ", "iso3": "TZA", "phoneCode": "255" }, { "countryName": "Thailand", "iso2": "TH", "iso3": "THA", "phoneCode": "66" }, { "countryName": "Timor-Leste", "iso2": "TL", "iso3": "TLS", "phoneCode": "670" }, { "countryName": "Togo", "iso2": "TG", "iso3": "TGO", "phoneCode": "228" }, { "countryName": "Tokelau", "iso2": "TK", "iso3": "TKL", "phoneCode": "690" }, { "countryName": "Tonga", "iso2": "TO", "iso3": "TON", "phoneCode": "676" }, { "countryName": "Trinidad and Tobago", "iso2": "TT", "iso3": "TTO", "phoneCode": "1 868" }, { "countryName": "Tunisia", "iso2": "TN", "iso3": "TUN", "phoneCode": "216" }, { "countryName": "Turkey", "iso2": "TR", "iso3": "TUR", "phoneCode": "90" }, { "countryName": "Turkmenistan", "iso2": "TM", "iso3": "TKM", "phoneCode": "993" }, { "countryName": "Turks and Caicos Islands", "iso2": "TC", "iso3": "TCA", "phoneCode": "1 649" }, { "countryName": "Tuvalu", "iso2": "TV", "iso3": "TUV", "phoneCode": "688" }, { "countryName": "Uganda", "iso2": "UG", "iso3": "UGA", "phoneCode": "256" }, { "countryName": "Ukraine", "iso2": "UA", "iso3": "UKR", "phoneCode": "380" }, { "countryName": "United Arab Emirates", "iso2": "AE", "iso3": "ARE", "phoneCode": "971" }, { "countryName": "United Kingdom", "iso2": "GB", "iso3": "GBR", "phoneCode": "44" }, { "countryName": "United States", "iso2": "US", "iso3": "USA", "phoneCode": "1" }, { "countryName": "Uruguay", "iso2": "UY", "iso3": "URY", "phoneCode": "598" }, { "countryName": "US Virgin Islands", "iso2": "VI", "iso3": "VIR", "phoneCode": "1 340" }, { "countryName": "Uzbekistan", "iso2": "UZ", "iso3": "UZB", "phoneCode": "998" }, { "countryName": "Vanuatu", "iso2": "VU", "iso3": "VUT", "phoneCode": "678" }, { "countryName": "Venezuela", "iso2": "VE", "iso3": "VEN", "phoneCode": "58" }, { "countryName": "Vietnam", "iso2": "VN", "iso3": "VNM", "phoneCode": "84" }, { "countryName": "Wallis and Futuna", "iso2": "WF", "iso3": "WLF", "phoneCode": "681" }, { "countryName": "West Bank", "iso2": "", "iso3": "", "phoneCode": "970" }, { "countryName": "Western Sahara", "iso2": "EH", "iso3": "ESH", "phoneCode": "" }, { "countryName": "Yemen", "iso2": "YE", "iso3": "YEM", "phoneCode": "967" }, { "countryName": "Zambia", "iso2": "ZM", "iso3": "ZMB", "phoneCode": "260" }, { "countryName": "Zimbabwe", "iso2": "ZW", "iso3": "ZWE", "phoneCode": "263" }];

    function countryISO2(iso3) {
        iso2 = iso2.toUpperCase();
        for (index = 0; index < countries.length; ++index) {
            if (countries[index].iso3 === iso3) {
                return countries[index].iso2;
            }
        }
        return "";
    }

    function countryISO3(iso2) {
        iso2 = iso2.toUpperCase();
        for (index = 0; index < countries.length; ++index) {
            if (countries[index].iso2 === iso2) {
                return countries[index].iso3.toLowerCase();
            }
        }
        return "";
    }

    function countryName(iso3) {
        iso3 = iso3.toUpperCase();
        for (index = 0; index < countries.length; ++index) {
            if (countries[index].iso3 === iso3) {
                return countries[index].countryName;
            }
        }
        return "";
    }

    Alpaca.registerFieldClass("address", Alpaca.Fields.AddressField);

})(jQuery);
///#source 1 1 CKEditorField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CKEditorField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.CKEditorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.CKEditorField#getFieldType
         */
        getFieldType: function () {
            return "ckeditor";
        },

        /**
         * @see Alpaca.Fields.CKEditorField#setup
         */
        setup: function () {
            if (!this.data) {
                this.data = "";
            }
            this.base();
            if (typeof (this.options.ckeditor) == "undefined") {
                this.options.ckeditor = {};
            }
            if (typeof (this.options.configset) == "undefined") {
                this.options.configset = "";
            }
        },
        afterRenderControl: function (model, callback) {
            var self = this;

            this.base(model, function () {

                // see if we can render CK Editor
                if (!self.isDisplayOnly() && self.control && typeof (CKEDITOR) !== "undefined") {
                    // use a timeout because CKEditor has some odd timing dependencies
                    setTimeout(function () {

                        var defaultConfig = {
                            toolbar: [
                                 { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                                 { name: 'styles', items: ['Styles', 'Format'] },
                                 { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', ] },
                                 { name: 'links', items: ['Link', 'Unlink'] },

                                 { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source'] },
                            ],
                            // Set the most common block elements.
                            format_tags: 'p;h1;h2;h3;pre',

                            // Simplify the dialog windows.
                            removeDialogTabs: 'image:advanced;link:advanced',

                            // Remove one plugin.
                            removePlugins: 'elementspath,resize',

                            extraPlugins: 'dnnpages',

                            //autoGrow_onStartup : true,
                            //autoGrow_minHeight : 100,
                            //autoGrow_maxHeight : 300,
                            height: 150,
                            //skin : 'flat',

                            customConfig: '',
                            stylesSet: []
                        };
                        if (self.options.configset == "basic") {
                            defaultConfig = {
                                toolbar: [
                                     { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                                     { name: 'styles', items: ['Styles', 'Format'] },
                                     { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', ] },
                                     { name: 'links', items: ['Link', 'Unlink'] },

                                     { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Maximize', 'Source'] },
                                ],
                                // Set the most common block elements.
                                format_tags: 'p;h1;h2;h3;pre',
                                // Simplify the dialog windows.
                                removeDialogTabs: 'image:advanced;link:advanced',
                                // Remove one plugin.
                                removePlugins: 'elementspath,resize',
                                extraPlugins: 'dnnpages',
                                //autoGrow_onStartup : true,
                                //autoGrow_minHeight : 100,
                                //autoGrow_maxHeight : 300,
                                height: 150,
                                //skin : 'flat',
                                customConfig: '',
                                stylesSet: []
                            };
                        } else if (self.options.configset == "standard") {
                            defaultConfig = {
                                toolbar: [
                                     { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                                     { name: 'styles', items: ['Styles', 'Format'] },
                                     { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', ] },
                                     { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                                     { name: 'insert', items: [ 'Table', 'Smiley', 'SpecialChar',  'Iframe'] },
                                     { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Maximize', 'ShowBlocks', 'Source'] }
                                ],
                                // Set the most common block elements.
                                format_tags: 'p;h1;h2;h3;pre;div',

                                //http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules
                                //extraAllowedContent:
                                //'table tr th td caption[*](*);' +
                                //'div span(*);' 
                                ////'a[!href](*);' 
                                ////'img[!src,alt,width,height](*);' +
                                ////'h1 h2 h3 p blockquote strong em(*);' +
                                //,

                                // Simplify the dialog windows.
                                removeDialogTabs: 'image:advanced;link:advanced',
                                // Remove one plugin.
                                removePlugins: 'elementspath,resize',
                                extraPlugins: 'dnnpages',
                                //autoGrow_onStartup : true,
                                //autoGrow_minHeight : 100,
                                //autoGrow_maxHeight : 300,
                                height: 150,
                                //skin : 'flat',
                                customConfig: '',
                                stylesSet: []
                            };
                        } else if (self.options.configset == "full") {
                            defaultConfig = {
                                toolbar: [
                                    { name: 'document', items: ['Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates'] },
	                                { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
	                                { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'] },
	                                { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
	                                '/',
	                                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
	                                {
	                                    name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
                                        '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
	                                },
	                                { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
	                                { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
	                                '/',
	                                { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
	                                { name: 'colors', items: ['TextColor', 'BGColor'] },
	                                { name: 'tools', items: ['Maximize', 'ShowBlocks', '-', 'About', '-', 'Source'] }
                                ],
                                // Set the most common block elements.
                                format_tags: 'p;h1;h2;h3;pre;div',
                                //http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-allowedContent
                                allowedContentRules: true,
                                // Simplify the dialog windows.
                                removeDialogTabs: 'image:advanced;link:advanced',
                                // Remove one plugin.
                                removePlugins: 'elementspath,resize',
                                extraPlugins: 'dnnpages',
                                //autoGrow_onStartup : true,
                                //autoGrow_minHeight : 100,
                                //autoGrow_maxHeight : 300,
                                height: 150,
                                //skin : 'flat',
                                customConfig: '',
                                stylesSet: []
                            };
                        }
                        var config = $.extend({}, defaultConfig, self.options.ckeditor);

                        self.editor = CKEDITOR.replace($(self.control)[0], config);
                        //self.editor = CKEDITOR.replace($(self.control)[0], self.options.ckeditor);

                    }, 1600);
                }

                // if the ckeditor's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function () {

                    if (self.editor) {
                        self.editor.removeAllListeners();
                        self.editor.destroy(false);
                        self.editor = null;
                    }

                });

                callback();
            });
        },

        initControlEvents: function () {
            var self = this;

            setTimeout(function () {

                // click event
                self.editor.on("click", function (e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });

                // change event
                self.editor.on("change", function (e) {
                    self.onChange();
                    self.triggerWithPropagation("change", e);
                });

                // blur event
                self.editor.on('blur', function (e) {
                    self.onBlur();
                    self.trigger("blur", e);
                });

                // focus event
                self.editor.on("focus", function (e) {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                });

                // keypress event
                self.editor.on("key", function (e) {
                    self.onKeyPress.call(self, e);
                    self.trigger("keypress", e);
                });

                // NOTE: these do not seem to work with CKEditor?
                /*
                // keyup event
                self.editor.on("keyup", function(e) {
                    self.onKeyUp.call(self, e);
                    self.trigger("keyup", e);
                });
    
                // keydown event
                self.editor.on("keydown", function(e) {
                    self.onKeyDown.call(self, e);
                    self.trigger("keydown", e);
                });
                */

            }, 1800); // NOTE: odd timing dependencies
        },

        setValue: function (value) {
            var self = this;

            // be sure to call into base method
            this.base(value);

            if (self.editor) {
                self.editor.setData(value);
            }
        },

        getValue: function () {
            var self = this;

            var value = this.base();

            if (self.editor) {
                value = self.editor.getData();
            }

            return value;
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function () {
            // destroy the plugin instance
            if (this.editor) {
                this.editor.destroy();
                this.editor = null;
            }

            // call up to base method
            this.base();
        }

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.CKEditorField#getTitle
         */
        ,
        getTitle: function () {
            return "CK Editor";
        },

        /**
         * @see Alpaca.Fields.CKEditorField#getDescription
         */
        getDescription: function () {
            return "Provides an instance of a CK Editor control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "ckeditor": {
                        "title": "CK Editor options",
                        "description": "Use this entry to provide configuration options to the underlying CKEditor plugin.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "ckeditor": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("ckeditor", Alpaca.Fields.CKEditorField);

})(jQuery);
///#source 1 1 DateField.js
(function ($) {

    // NOTE: this requires bootstrap-datetimepicker.js
    // NOTE: this requires moment.js

    var Alpaca = $.alpaca;

    Alpaca.Fields.DateField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.DateField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function () {
            return "date";
        },

        getDefaultFormat: function () {
            return "MM/DD/YYYY";
        },

        getDefaultExtraFormats: function () {
            return [];
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function () {
            var self = this;

            // default html5 input type = "date";
            //this.inputType = "date";

            this.base();

            if (!self.options.picker) {
                self.options.picker = {};
            }

            if (typeof (self.options.picker.useCurrent) === "undefined") {
                self.options.picker.useCurrent = false;
            }

            // date format

            /*
            if (self.options.picker.format) {
                self.options.dateFormat = self.options.picker.format;
            }
            */
            if (!self.options.dateFormat) {
                //self.options.dateFormat = self.getDefaultFormat();
            }
            if (!self.options.picker.format) {
                self.options.picker.format = self.options.dateFormat;
            }

            // extra formats
            if (!self.options.picker.extraFormats) {
                var extraFormats = self.getDefaultExtraFormats();
                if (extraFormats) {
                    self.options.picker.extraFormats = extraFormats;
                }
            }
        },

        /**
         * @see Alpaca.Fields.TextField#afterRenderControl
         */
        afterRenderControl: function (model, callback) {

            var self = this;

            this.base(model, function () {

                if (self.view.type !== "display") {
                    if ($.fn.datetimepicker) {
                        self.getControlEl().datetimepicker(self.options.picker);
                        self.picker = self.getControlEl().data("DateTimePicker");
                    }
                }

                callback();

            });
        },

        /**
         * Returns field value as a JavaScript Date.
         *
         * @returns {Date} Field value.
         */
        getDate: function () {
            var self = this;

            var date = null;
            try {
                if (self.picker) {
                    date = (self.picker.date() ? self.picker.date()._d : null);
                }
                else {
                    date = new Date(this.getValue());
                }
            }
            catch (e) {
                console.error(e);
            }

            return date;
        },

        /**
         * Returns field value as a JavaScript Date.
         *
         * @returns {Date} Field value.
         */
        date: function () {
            return this.getDate();
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function (e) {
            this.base();

            this.refreshValidationState();
        },

        isAutoFocusable: function () {
            return false;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function () {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateDateFormat();
            valInfo["invalidDate"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidDate"), [this.options.dateFormat]),
                "status": status
            };

            return baseStatus && valInfo["invalidDate"]["status"];
        },

        /**
         * Validates date format.
         *
         * @returns {Boolean} True if it is a valid date, false otherwise.
         */
        _validateDateFormat: function () {
            var self = this;

            var isValid = true;

            if (self.options.dateFormat) {
                var value = self.getValue();
                if (value || self.isRequired()) {
                    // collect all formats
                    var dateFormats = [];
                    dateFormats.push(self.options.dateFormat);
                    if (self.options.picker && self.options.picker.extraFormats) {
                        for (var i = 0; i < self.options.picker.extraFormats.length; i++) {
                            dateFormats.push(self.options.picker.extraFormats[i]);
                        }
                    }

                    for (var i = 0; i < dateFormats.length; i++) {
                        isValid = isValid || moment(value, self.options.dateFormat, true).isValid();
                    }
                }
            }

            return isValid;
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function (value) {
            var self = this;

            this.base(value);

            if (this.picker) {
                if (self.options.dateFormat) {
                    if (moment(value, self.options.dateFormat, true).isValid()) {
                        this.picker.date(value);
                    }
                }
                else {
                    if (moment(value).isValid()) {
                        this.picker.date(moment(value));
                    }
                }
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getValue: function () {
            
            var self = this;

            var date = null;
            try {
                if (self.picker) {
                    date = (self.picker.date() ? self.picker.date().format() : null);
                }
                else {
                    date = this.base();
                }
            }
            catch (e) {
                console.error(e);
            }

            return date;

        },

        destroy: function () {
            this.base();

            this.picker = null;
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function () {
            return "Date Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function () {
            return "Date Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default": "date",
                        "enum": ["date"],
                        "readonly": true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dateFormat": {
                        "title": "Date Format",
                        "description": "Date format (using moment.js format)",
                        "type": "string"
                    },
                    "picker": {
                        "title": "DatetimePicker options",
                        "description": "Options that are supported by the <a href='http://eonasdan.github.io/bootstrap-datetimepicker/'>Bootstrap DateTime Picker</a>.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "dateFormat": {
                        "type": "text"
                    },
                    "picker": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidDate": "Invalid date for format {0}"
    });
    Alpaca.registerFieldClass("date", Alpaca.Fields.DateField);
    Alpaca.registerDefaultFormatFieldMapping("date", "date");

})(jQuery);
///#source 1 1 FileField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.FileField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ImageField.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.sf = connector.servicesFramework;
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function () {
            return "file";
        }
        ,
        setup: function () {
            if (!this.options.uploadfolder) {
                this.options.uploadfolder = "";
            }
            this.base();
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function () {
            return "File Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function () {
            return "File Field.";
        },
        getControlEl: function () {
            return $(this.control.get(0)).find('input[type=text]#' + this.id);
        },
        setValue: function (value) {

            //var el = $( this.control).filter('#'+this.id);
            //var el = $(this.control.get(0)).find('input[type=text]');
            var el = this.getControlEl();

            if (el && el.length > 0) {
                if (Alpaca.isEmpty(value)) {
                    el.val("");
                }
                else {
                    el.val(value);
                }
            }

            // be sure to call into base method
            //this.base(value);

            // if applicable, update the max length indicator
            this.updateMaxLengthIndicator();
        },

        getValue: function () {
            var value = null;

            //var el = $(this.control).filter('#' + this.id);
            //var el = $(this.control.get(0)).find('input[type=text]');
            var el = this.getControlEl();
            if (el && el.length > 0) {
                value = el.val();
            }
            return value;
        },

        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        handlePostRender: function (callback) {
            var self = this;

            //var el = this.control;
            var el = this.getControlEl();


            $(this.control.get(0)).find('input[type=file]').fileupload({
                dataType: 'json',
                url: self.sf.getServiceRoot('OpenContent') + "FileUpload/UploadFile",
                maxFileSize: 25000000,
                formData: { uploadfolder: self.options.uploadfolder },
                beforeSend: self.sf.setModuleHeaders,
                add: function (e, data) {
                    //data.context = $(opts.progressContextSelector);
                    //data.context.find($(opts.progressFileNameSelector)).html(data.files[0].name);
                    //data.context.show('fade');
                    data.submit();
                },
                progress: function (e, data) {
                    if (data.context) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        data.context.find(opts.progressBarSelector).css('width', progress + '%').find('span').html(progress + '%');
                    }
                },
                done: function (e, data) {
                    if (data.result) {
                        $.each(data.result, function (index, file) {
                            self.setValue(file.url);
                            $(el).change();
                            //$(el).change();
                            //$(e.target).parent().find('input[type=text]').val(file.url);
                            //el.val(file.url);
                            //$(e.target).parent().find('.alpaca-image-display img').attr('src', file.url);
                        });
                    }
                }
            }).data('loaded', true);

            callback();
        },
        applyTypeAhead: function () {
            var self = this;

            if (self.control.typeahead && self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead)) {

                var tConfig = self.options.typeahead.config;
                if (!tConfig) {
                    tConfig = {};
                }
                var tDatasets = tDatasets = {};
                if (!tDatasets.name) {
                    tDatasets.name = self.getId();
                }

                var tFolder = self.options.typeahead.Folder;
                if (!tFolder) {
                    tFolder = "";
                }

                var tEvents = tEvents = {};

                var bloodHoundConfig = {
                    datumTokenizer: function (d) {
                        return Bloodhound.tokenizers.whitespace(d.value);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace
                };

                /*
                if (tDatasets.type === "prefetch") {
                    bloodHoundConfig.prefetch = {
                        url: tDatasets.source,
                        ajax: {
                            //url: sf.getServiceRoot('OpenContent') + "FileUpload/UploadFile",
                            beforeSend: connector.servicesFramework.setModuleHeaders,
        
                        }
                    };
        
                    if (tDatasets.filter) {
                        bloodHoundConfig.prefetch.filter = tDatasets.filter;
                    }
                }
                */

                bloodHoundConfig.remote = {
                    url: self.sf.getServiceRoot('OpenContent') + "DnnEntitiesAPI/Files?q=%QUERY&d=" + tFolder,
                    ajax: {
                        beforeSend: connector.servicesFramework.setModuleHeaders,
                    }
                };

                if (tDatasets.filter) {
                    bloodHoundConfig.remote.filter = tDatasets.filter;
                }

                if (tDatasets.replace) {
                    bloodHoundConfig.remote.replace = tDatasets.replace;
                }


                var engine = new Bloodhound(bloodHoundConfig);
                engine.initialize();
                tDatasets.source = engine.ttAdapter();

                tDatasets.templates = {
                    "empty": "Nothing found...",
                    "suggestion": "{{name}}"
                };

                // compile templates
                if (tDatasets.templates) {
                    for (var k in tDatasets.templates) {
                        var template = tDatasets.templates[k];
                        if (typeof (template) === "string") {
                            tDatasets.templates[k] = Handlebars.compile(template);
                        }
                    }
                }

                //var el = $(this.control.get(0)).find('input[type=text]');
                var el = this.getControlEl();
                // process typeahead
                $(el).typeahead(tConfig, tDatasets);

                // listen for "autocompleted" event and set the value of the field
                $(el).on("typeahead:autocompleted", function (event, datum) {
                    self.setValue(datum.value);
                    $(el).change();
                    //$(self.control).parent().find('input[type=text]').val(datum.value);
                    //$(self.control).parent().find('.alpaca-image-display img').attr('src', datum.value);
                });

                // listen for "selected" event and set the value of the field
                $(el).on("typeahead:selected", function (event, datum) {
                    self.setValue(datum.value);
                    $(el).change();
                    //$(self.control).parent().find('input[type=text]').val(datum.value);
                    //$(self.control).parent().find('.alpaca-image-display img').attr('src', datum.value);
                });

                // custom events
                if (tEvents) {
                    if (tEvents.autocompleted) {
                        $(el).on("typeahead:autocompleted", function (event, datum) {
                            tEvents.autocompleted(event, datum);
                        });
                    }
                    if (tEvents.selected) {
                        $(el).on("typeahead:selected", function (event, datum) {
                            tEvents.selected(event, datum);
                        });
                    }
                }

                // when the input value changes, change the query in typeahead
                // this is to keep the typeahead control sync'd with the actual dom value
                // only do this if the query doesn't already match
                //var fi = $(self.control);
                $(el).change(function () {

                    var value = $(this).val();

                    var newValue = $(el).typeahead('val');
                    if (newValue !== value) {
                        $(el).typeahead('val', value);
                    }

                });

                // some UI cleanup (we don't want typeahead to restyle)
                $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
                $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
            }
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("file", Alpaca.Fields.FileField);

})(jQuery);
///#source 1 1 ImageCropperField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ImageCropperField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ImageField.prototype
     */
    {
        constructor: function(container, data, options, schema, view, connector)
        {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.sf = connector.servicesFramework;
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function () {
            return "imagecropper";
        }
        ,
        setup: function () {
            if (!this.options.uploadfolder) {
                this.options.uploadfolder = "";
            }
            if (!this.options.uploadhidden) {
                this.options.uploadhidden = false;
            }
            if (!this.options.cropper) {
                this.options.cropper = {};
            }
            this.options.cropper.responsive = false;
            if (!this.options.cropper.autoCropArea) {
                this.options.cropper.autoCropArea = 1;
            }
            this.base();
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function () {
            return "Image Cropper Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function () {
            return "Image Cropper Field.";
        },
        getControlEl: function () {
            return $(this.control.get(0)).find('input[type=text]#' + this.id);
        },
        setValue: function (value) {

            //var el = $( this.control).filter('#'+this.id);
            //var el = $(this.control.get(0)).find('input[type=text]');
            var el = this.getControlEl();
            
            if (el && el.length > 0) {
                if (Alpaca.isEmpty(value)) {
                    el.val("");
                }
                else if (Alpaca.isString(value)) {
                    el.val(value);
                }
                else {
                    el.val(value.url);
                    this.setCroppedData(value.cropdata);
                }
            }
            // be sure to call into base method
            //this.base(textvalue);

            // if applicable, update the max length indicator
            this.updateMaxLengthIndicator();
        },

        getValue: function () {
            var value = null;
            var el = this.getControlEl();
            if (el && el.length > 0) {
                //value = el.val();
                value = {
                    url: el.val()
                };
                value.cropdata = this.getCroppedData();
            }
            return value;
        },
        getCroppedData: function () {
            var el = this.getControlEl();
            var cropdata = {};
            for (var i in this.options.croppers) {
                var cropper = this.options.croppers[i];
                var id = this.id + '-' + i;
                var $cropbutton = $('#'+id);
                cropdata[i] = $cropbutton.data('cropdata');
            }
            return cropdata;
        },
        cropAllImages: function (url) {
            var self = this;
            for (var i in this.options.croppers) {
                
                var id = this.id + '-' + i;
                var $cropbutton = $('#' + id);

                //cropdata[i] = $cropbutton.data('cropdata');
                                
                var cropopt = this.options.croppers[i];
                
                var crop = { "x": -1, "y": -1, "width": cropopt.width, "height": cropopt.height, "rotate": 0 };
                var postData = JSON.stringify({ url: url, id: i, crop: crop, resize: cropopt, cropfolder: this.options.cropfolder});

                var action = "CropImage";
                $.ajax({
                    type: "POST",
                    url: self.sf.getServiceRoot('OpenContent') + "DnnEntitiesAPI/" + action,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    data: postData,
                    beforeSend: self.sf.setModuleHeaders
                }).done(function (res) {
                    var cropdata = { url: res.url, cropper: {} };
                    self.setCroppedDataForId(id, cropdata);

                }).fail(function (xhr, result, status) {
                    alert("Uh-oh, something broke: " + status);
                });

            }
            //var data = $image.cropper('getData', { rounded: true });
            //var cropperId = cropButton.data('cropperId');
            
        },
        setCroppedData: function (value) {

            var el = this.getControlEl();
            var parentel = this.getFieldEl();
            if (el && el.length > 0) {
                if (Alpaca.isEmpty(value)) {
                    
                }
                else {
                    var firstCropButton;
                    for (var i in this.options.croppers) {
                        var cropper = this.options.croppers[i];
                        var id = this.id + '-' + i;
                        var $cropbutton = $('#' + id);
                        cropdata = value[i];
                        if (cropdata) {
                            $cropbutton.data('cropdata', cropdata);
                        }
                        
                        if (!firstCropButton) {
                            firstCropButton = $cropbutton;
                            $(firstCropButton).addClass('active');
                            if (cropdata) {
                                var $image = $(parentel).find('.alpaca-image-display img.image');
                                var cropper = $image.data('cropper');
                                if (cropper){
                                    $image.cropper('setData', cropdata.cropper);
                                }
                            }
                        }
                        
                    }
                }
            }

            /*
            var el = this.getControlEl();
            var $image = el.parent().find('.image');
            if (el && el.length > 0) {
                if (Alpaca.isEmpty(value)) {
                    $image.data('cropdata', {});
                }
                else {
                    $image.data('cropdata', value);
                }
            }
            */
        },

        setCroppedDataForId: function (id, value) {
            var el = this.getControlEl();
            if (value) {
                var $cropbutton = $('#' + id);
                $cropbutton.data('cropdata', value);                
            }
        },
        getCurrentCropData : function() {
            var el = this.getControlEl();
            var curtab = $(el).parent().find(".alpaca-form-tab.active");
            var cropdata = $(this).data('cropdata');
            //var cropopt = $(this).data('cropopt');
            return cropdata;
        },
        setCurrentCropData: function (value) {
            var el = this.getFieldEl(); //this.getControlEl();
            
            var curtab = $(el).parent().find(".alpaca-form-tab.active");
            $(curtab).data('cropdata', value);
          
        },
        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        cropChange: function (e) {
            var self = e.data;
            //var parentel = this.getFieldEl();
            var $image = this; //$(parentel).find('.alpaca-image-display img.image');
            var data = $(this).cropper('getData', { rounded: true });
            var cropdata = {
                url: "",
                cropper: data
            };
            self.setCurrentCropData(cropdata);
            //self.setCroppedDataForId(cropperButtonIdcropButton.data('cropperButtonId'), cropdata);

        },
        getCropppersData : function() {
            for (var i in self.options.croppers) {
                var cropper = self.options.croppers[i];
                var id = self.id + '-' + i;

            }
        },
        handlePostRender: function (callback) {
            var self = this;
            var el = this.getControlEl();
            var parentel = this.getFieldEl();

            var cropButton = $('<a href="#" class="alpaca-form-button">Crop</a>');//.appendTo($(el).parent());
            cropButton.click(function () {
                /*
                var data = $image.cropper('getData', { rounded: true });
                var cropperId = cropButton.data('cropperId');
                var cropopt = self.options.croppers[cropperId];
                var postData = JSON.stringify({ url: el.val(), id: cropperId, crop: data, resize: cropopt });
                */
                var data = self.getCroppedData();
                var postData = JSON.stringify({ url: el.val(), cropfolder : self.options.cropfolder, cropdata: data, croppers: self.options.croppers });

                
                $(cropButton).css('cursor', 'wait');

                var action = "CropImages";
                $.ajax({
                    type: "POST",
                    url: self.sf.getServiceRoot('OpenContent') + "DnnEntitiesAPI/" + action,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: postData,
                    beforeSend: self.sf.setModuleHeaders
                }).done(function (res) {
                    /*
                    var cropdata = { url: res.url, cropper: data };
                    self.setCroppedDataForId(cropButton.data('cropperButtonId'), cropdata);
                    */
                    for (var i in self.options.croppers) {
                        var cropper = self.options.croppers[i];
                        var id = self.id + '-' + i;
                        var $cropbutton = $('#' + id);
                        var cropdata = { url: res.cropdata[i].url, cropper: res.cropdata[i].crop };
                        if (cropdata) {
                            $cropbutton.data('cropdata', cropdata);
                        }
                    }
                    setTimeout(function () {
                        $(cropButton).css('cursor', 'initial');
                    }, 500);
                }).fail(function (xhr, result, status) {
                    alert("Uh-oh, something broke: " + status);
                    $(parentel).css('cursor', 'initial');
                });
                return false;
            });

            var firstCropButton;
            for (var i in self.options.croppers) {
                var cropper = self.options.croppers[i];
                var id = self.id + '-' + i;
                var cropperButton = $('<a id="' + id + '" data-id="' + i + '" href="#" class="alpaca-form-tab" >' + i + '</a>').appendTo($(el).parent());
                cropperButton.data('cropopt', cropper);
                cropperButton.click(function () {
                    $image.off('change.cropper');
                                        
                    var cropdata = $(this).data('cropdata');
                    var cropopt = $(this).data('cropopt');
                    $image.cropper('setAspectRatio', cropopt.width / cropopt.height);
                    if (cropdata) {
                        $image.cropper('setData', cropdata.cropper);
                    } else {
                        $image.cropper('reset');
                    }
                    cropButton.data('cropperButtonId', this.id);
                    cropButton.data('cropperId', $(this).attr("data-id"));
                    
                    $(this).parent().find('.alpaca-form-tab').removeClass('active');
                    $(this).addClass('active');

                    $image.on('change.cropper', self ,self.cropChange);

                    return false;
                });
                if (!firstCropButton) {
                    firstCropButton = cropperButton;
                    $(firstCropButton).addClass('active');
                    cropButton.data('cropperButtonId', $(firstCropButton).attr('id'));
                    cropButton.data('cropperId', $(firstCropButton).attr("data-id"));
                }
            }
            
            var $image = $(parentel).find('.alpaca-image-display img.image');
            $image.cropper(self.options.cropper).on('built.cropper', function () {
                var cropopt = $(firstCropButton).data('cropopt');
                if (cropopt) {
                    $(this).cropper('setAspectRatio', cropopt.width / cropopt.height);
                }
                var cropdata = $(firstCropButton).data('cropdata');
                if (cropdata) {
                    $(this).cropper('setData', cropdata.cropper);
                }
                var $image = $(parentel).find('.alpaca-image-display img.image');
                $image.on('change.cropper', self, self.cropChange);
            });
            
            if (self.options.uploadhidden) {
                $(this.control.get(0)).find('input[type=file]').hide();
            } else {
                $(this.control.get(0)).find('input[type=file]').fileupload({
                    dataType: 'json',
                    url: self.sf.getServiceRoot('OpenContent') + "FileUpload/UploadFile",
                    maxFileSize: 25000000,
                    formData: { uploadfolder : self.options.uploadfolder },
                    beforeSend: self.sf.setModuleHeaders,
                    add: function (e, data) {
                        //data.context = $(opts.progressContextSelector);
                        //data.context.find($(opts.progressFileNameSelector)).html(data.files[0].name);
                        //data.context.show('fade');
                        data.submit();
                    },
                    progress: function (e, data) {
                        if (data.context) {
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                            data.context.find(opts.progressBarSelector).css('width', progress + '%').find('span').html(progress + '%');
                        }
                    },
                    done: function (e, data) {
                        if (data.result) {
                            $.each(data.result, function (index, file) {
                                //self.setValue(file.url);
                                el.val(file.url);
                                
                                $(el).change();
                                //$(el).change();
                                //$(e.target).parent().find('input[type=text]').val(file.url);
                                //el.val(file.url);
                                //$(e.target).parent().find('.alpaca-image-display img').attr('src', file.url);
                            });
                        }
                    }
                }).data('loaded', true);
            }
            $(el).change(function () {

                var value = $(this).val();

                //var newValue = $(el).typeahead('val');
                //if (newValue !== value) {
                $(parentel).find('.alpaca-image-display img.image').attr('src', value);
                $image.cropper('replace', value);
                if (value){
                    self.cropAllImages(value);
                }

                //}

            });
            cropButton.appendTo($(el).parent());
            if (self.options.manageurl) {
                var manageButton = $('<a href="' + self.options.manageurl + '" target="_blank" class="alpaca-form-button">Manage files</a>').appendTo($(el).parent());
            }

            
            callback();
        },
        applyTypeAhead: function () {
            var self = this;

            if (self.control.typeahead && self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead)) {

                var tConfig = self.options.typeahead.config;
                if (!tConfig) {
                    tConfig = {};
                }
                var tDatasets = tDatasets = {};
                if (!tDatasets.name) {
                    tDatasets.name = self.getId();
                }

                var tFolder = self.options.typeahead.Folder;
                if (!tFolder) {
                    tFolder = "";
                }

                var tEvents = tEvents = {};

                var bloodHoundConfig = {
                    datumTokenizer: function (d) {
                        return Bloodhound.tokenizers.whitespace(d.value);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace
                };

                /*
                if (tDatasets.type === "prefetch") {
                    bloodHoundConfig.prefetch = {
                        url: tDatasets.source,
                        ajax: {
                            //url: sf.getServiceRoot('OpenContent') + "FileUpload/UploadFile",
                            beforeSend: connector.servicesFramework.setModuleHeaders,
        
                        }
                    };
        
                    if (tDatasets.filter) {
                        bloodHoundConfig.prefetch.filter = tDatasets.filter;
                    }
                }
                */

                bloodHoundConfig.remote = {
                    url: self.sf.getServiceRoot('OpenContent') + "DnnEntitiesAPI/Images?q=%QUERY&d=" + tFolder,
                    ajax: {
                        beforeSend: connector.servicesFramework.setModuleHeaders,

                    }
                };

                if (tDatasets.filter) {
                    bloodHoundConfig.remote.filter = tDatasets.filter;
                }

                if (tDatasets.replace) {
                    bloodHoundConfig.remote.replace = tDatasets.replace;
                }


                var engine = new Bloodhound(bloodHoundConfig);
                engine.initialize();
                tDatasets.source = engine.ttAdapter();

                tDatasets.templates = {
                    "empty": "Nothing found...",
                    "suggestion": "<div style='width:20%;display:inline-block;background-color:#fff;padding:2px;'><img src='{{value}}' style='height:40px' /></div> {{name}}"
                };

                // compile templates
                if (tDatasets.templates) {
                    for (var k in tDatasets.templates) {
                        var template = tDatasets.templates[k];
                        if (typeof (template) === "string") {
                            tDatasets.templates[k] = Handlebars.compile(template);
                        }
                    }
                }

                //var el = $(this.control.get(0)).find('input[type=text]');
                var el = this.getControlEl();
                // process typeahead
                $(el).typeahead(tConfig, tDatasets);

                // listen for "autocompleted" event and set the value of the field
                $(el).on("typeahead:autocompleted", function (event, datum) {
                    //self.setValue(datum.value);
                    el.val(datum.value);
                    $(el).change();
                    //$(self.control).parent().find('input[type=text]').val(datum.value);
                    //$(self.control).parent().find('.alpaca-image-display img').attr('src', datum.value);
                });

                // listen for "selected" event and set the value of the field
                $(el).on("typeahead:selected", function (event, datum) {
                    //self.setValue(datum.value);
                    el.val(datum.value);
                    $(el).change();
                    //$(self.control).parent().find('input[type=text]').val(datum.value);
                    //$(self.control).parent().find('.alpaca-image-display img').attr('src', datum.value);
                });

                // custom events
                if (tEvents) {
                    if (tEvents.autocompleted) {
                        $(el).on("typeahead:autocompleted", function (event, datum) {
                            tEvents.autocompleted(event, datum);
                        });
                    }
                    if (tEvents.selected) {
                        $(el).on("typeahead:selected", function (event, datum) {
                            tEvents.selected(event, datum);
                        });
                    }
                }

                // when the input value changes, change the query in typeahead
                // this is to keep the typeahead control sync'd with the actual dom value
                // only do this if the query doesn't already match
                //var fi = $(self.control);
                $(el).change(function () {

                    var value = $(this).val();

                    var newValue = $(el).typeahead('val');
                    if (newValue !== value) {
                        $(el).typeahead('val', value);
                    }

                });

                // some UI cleanup (we don't want typeahead to restyle)
                $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
                $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
            }
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("imagecropper", Alpaca.Fields.ImageCropperField);

})(jQuery);
///#source 1 1 ImageField.js
(function ($) {

    var Alpaca = $.alpaca;
    
    Alpaca.Fields.ImageField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ImageField.prototype
     */
    {
        constructor: function(container, data, options, schema, view, connector)
        {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.sf = connector.servicesFramework;
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function () {
            return "image";
        }
        ,
        setup: function () {
            if (!this.options.uploadfolder) {
                this.options.uploadfolder = "";
            }
            if (!this.options.uploadhidden) {
                this.options.uploadhidden = false;
            }
            this.base();
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function () {
            return "Image Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function () {
            return "Image Field.";
        },
        getControlEl: function () {
            return $(this.control.get(0)).find('input[type=text]#' + this.id);
        },
        setValue: function (value) {

            //var el = $( this.control).filter('#'+this.id);
            //var el = $(this.control.get(0)).find('input[type=text]');
            var el = this.getControlEl();

            if (el && el.length > 0) {
                if (Alpaca.isEmpty(value)) {
                    el.val("");
                }
                else {
                    el.val(value);
                }
            }
            
            // be sure to call into base method
            //this.base(value);

            // if applicable, update the max length indicator
            this.updateMaxLengthIndicator();
        },

        getValue: function () {
            var value = null;

            //var el = $(this.control).filter('#' + this.id);
            //var el = $(this.control.get(0)).find('input[type=text]');
            var el = this.getControlEl();
            if (el && el.length > 0) {
                    value = el.val();
            }
            return value;
        },

        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        handlePostRender: function (callback) {
            var self = this;

            //var el = this.control;
            var el = this.getControlEl();

            if (self.options.uploadhidden) {
                $(this.control.get(0)).find('input[type=file]').hide();
            } else {
                $(this.control.get(0)).find('input[type=file]').fileupload({
                    dataType: 'json',
                    url: self.sf.getServiceRoot('OpenContent') + "FileUpload/UploadFile",
                    maxFileSize: 25000000,
                    formData: { uploadfolder : self.options.uploadfolder },
                    beforeSend: self.sf.setModuleHeaders,
                    add: function (e, data) {
                        //data.context = $(opts.progressContextSelector);
                        //data.context.find($(opts.progressFileNameSelector)).html(data.files[0].name);
                        //data.context.show('fade');
                        data.submit();
                    },
                    progress: function (e, data) {
                        if (data.context) {
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                            data.context.find(opts.progressBarSelector).css('width', progress + '%').find('span').html(progress + '%');
                        }
                    },
                    done: function (e, data) {
                        if (data.result) {
                            $.each(data.result, function (index, file) {
                                self.setValue(file.url);
                                $(el).change();
                                //$(el).change();
                                //$(e.target).parent().find('input[type=text]').val(file.url);
                                //el.val(file.url);
                                //$(e.target).parent().find('.alpaca-image-display img').attr('src', file.url);
                            });
                        }
                    }
                }).data('loaded', true);
            }
            $(el).change(function () {

                var value = $(this).val();

                //var newValue = $(el).typeahead('val');
                //if (newValue !== value) {
                    $(self.control).parent().find('.alpaca-image-display img').attr('src', value);
                //}

            });

            if (self.options.manageurl) {
                var manageButton = $('<a href="' + self.options.manageurl + '" target="_blank" class="alpaca-form-button">Manage files</a>').appendTo($(el).parent());
            }
            
            callback();
        },
        applyTypeAhead: function () {
            var self = this;

            if (self.control.typeahead && self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead)) {

                var tConfig = self.options.typeahead.config;
                if (!tConfig) {
                    tConfig = {};
                }
                var tDatasets = tDatasets = {};
                if (!tDatasets.name) {
                    tDatasets.name = self.getId();
                }

                var tFolder = self.options.typeahead.Folder;
                if (!tFolder) {
                    tFolder = "";
                }

                var tEvents = tEvents = {};

                var bloodHoundConfig = {
                    datumTokenizer: function (d) {
                        return Bloodhound.tokenizers.whitespace(d.value);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace
                };

                /*
                if (tDatasets.type === "prefetch") {
                    bloodHoundConfig.prefetch = {
                        url: tDatasets.source,
                        ajax: {
                            //url: sf.getServiceRoot('OpenContent') + "FileUpload/UploadFile",
                            beforeSend: connector.servicesFramework.setModuleHeaders,
        
                        }
                    };
        
                    if (tDatasets.filter) {
                        bloodHoundConfig.prefetch.filter = tDatasets.filter;
                    }
                }
                */

                bloodHoundConfig.remote = {
                    url: self.sf.getServiceRoot('OpenContent') + "DnnEntitiesAPI/Images?q=%QUERY&d=" + tFolder,
                    ajax: {
                        beforeSend: connector.servicesFramework.setModuleHeaders,

                    }
                };

                if (tDatasets.filter) {
                    bloodHoundConfig.remote.filter = tDatasets.filter;
                }

                if (tDatasets.replace) {
                    bloodHoundConfig.remote.replace = tDatasets.replace;
                }


                var engine = new Bloodhound(bloodHoundConfig);
                engine.initialize();
                tDatasets.source = engine.ttAdapter();

                tDatasets.templates = {
                    "empty": "Nothing found...",
                    "suggestion": "<div style='width:20%;display:inline-block;background-color:#fff;padding:2px;'><img src='{{value}}' style='height:40px' /></div> {{name}}"
                };

                // compile templates
                if (tDatasets.templates) {
                    for (var k in tDatasets.templates) {
                        var template = tDatasets.templates[k];
                        if (typeof (template) === "string") {
                            tDatasets.templates[k] = Handlebars.compile(template);
                        }
                    }
                }

                //var el = $(this.control.get(0)).find('input[type=text]');
                var el = this.getControlEl();
                // process typeahead
                $(el).typeahead(tConfig, tDatasets);

                // listen for "autocompleted" event and set the value of the field
                $(el).on("typeahead:autocompleted", function (event, datum) {
                    self.setValue(datum.value);
                    $(el).change();
                    //$(self.control).parent().find('input[type=text]').val(datum.value);
                    //$(self.control).parent().find('.alpaca-image-display img').attr('src', datum.value);
                });

                // listen for "selected" event and set the value of the field
                $(el).on("typeahead:selected", function (event, datum) {
                    self.setValue(datum.value);
                    $(el).change();
                    //$(self.control).parent().find('input[type=text]').val(datum.value);
                    //$(self.control).parent().find('.alpaca-image-display img').attr('src', datum.value);
                });

                // custom events
                if (tEvents) {
                    if (tEvents.autocompleted) {
                        $(el).on("typeahead:autocompleted", function (event, datum) {
                            tEvents.autocompleted(event, datum);
                        });
                    }
                    if (tEvents.selected) {
                        $(el).on("typeahead:selected", function (event, datum) {
                            tEvents.selected(event, datum);
                        });
                    }
                }

                // when the input value changes, change the query in typeahead
                // this is to keep the typeahead control sync'd with the actual dom value
                // only do this if the query doesn't already match
                //var fi = $(self.control);
                $(el).change(function () {

                    var value = $(this).val();

                    var newValue = $(el).typeahead('val');
                    if (newValue !== value) {
                        $(el).typeahead('val', value);
                    }

                });

                // some UI cleanup (we don't want typeahead to restyle)
                $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
                $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
            }
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("image", Alpaca.Fields.ImageField);

})(jQuery);
///#source 1 1 NumberField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.NumberField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.NumberField.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.numberDecimalSeparator = connector.numberDecimalSeparator;
        },
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function () {
            // default html5 input type = "number";
            //this.inputType = "number";
            // TODO: we can't do this because Chrome screws up it's handling of number type
            // and prevents us from validating properly
            // @see http://stackoverflow.com/questions/16420828/jquery-val-refuses-to-return-non-numeric-input-from-a-number-field-under-chrome

            this.base();

            if (typeof (this.options.numericEntry) === "undefined") {
                this.options.numericEntry = false;
            }
          
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function () {
            return "number";
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function (callback) {

            var self = this;

            this.base(function () {

                if (self.control) {
                    self.on("keypress", function (e) {

                        var key = e.charCode || e.keyCode || 0;

                        var valid = true;

                        if (self.options.numericEntry) {
                            valid = valid && (key >= 48 && key <= 57);
                        }

                        if (!valid) {
                            // don't even allow entry of invalid characters
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }

                        return valid;
                    });
                }

                callback();
            });
        },

        getValue: function () {
            var self = this;
            if (this.numberDecimalSeparator != '.') {
                var textValue = this._getControlVal(false);
                textValue = textValue.replace(this.numberDecimalSeparator, '.');

            /*
            var value = this.base();

            if (!this.isDisplayOnly()) {
                value = self.getControlValue();
            }
            */
                // some correction for type
                value = self.ensureProperType(textValue);
                return value;
            }
            return this.base();
        },
        setValue: function (value) {
            var val = value;
            if (this.numberDecimalSeparator != '.') {
                if (Alpaca.isEmpty(value)) {
                    val = "";
                }
                else {

                    val = ("" + value).replace('.', this.numberDecimalSeparator);
                }
            }
            // be sure to call into base method
            this.base(val);

        },


        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function () {
            var val = this._getControlVal(true);

            if (typeof (val) == "undefined" || "" == val) {
                return val;
            }

            return parseFloat(val);
        },



        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function () {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateNumber();
            valInfo["stringNotANumber"] = {
                "message": status ? "" : this.getMessage("stringNotANumber"),
                "status": status
            };

            status = this._validateDivisibleBy();
            valInfo["stringDivisibleBy"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringDivisibleBy"), [this.schema.divisibleBy]),
                "status": status
            };

            status = this._validateMaximum();
            valInfo["stringValueTooLarge"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMaximum) {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooLargeExclusive"), [this.schema.maximum]);
                } else {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooLarge"), [this.schema.maximum]);
                }
            }

            status = this._validateMinimum();
            valInfo["stringValueTooSmall"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMinimum) {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooSmallExclusive"), [this.schema.minimum]);
                } else {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooSmall"), [this.schema.minimum]);
                }
            }

            status = this._validateMultipleOf();
            valInfo["stringValueNotMultipleOf"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                valInfo["stringValueNotMultipleOf"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueNotMultipleOf"), [this.schema.multipleOf]);
            }

            // hand back a true/false
            return baseStatus && valInfo["stringNotANumber"]["status"] && valInfo["stringDivisibleBy"]["status"] && valInfo["stringValueTooLarge"]["status"] && valInfo["stringValueTooSmall"]["status"] && valInfo["stringValueNotMultipleOf"]["status"] && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },

        /**
         * Validates if it is a float number.
         * @returns {Boolean} true if it is a float number
         */
        _validateNumber: function () {

            // get value as text
            var textValue = this._getControlVal();
            if (typeof (textValue) === "number") {
                textValue = "" + textValue;
            }

            // allow empty
            if (Alpaca.isValEmpty(textValue)) {
                return true;
            }
            textValue = textValue.replace(',', '.')
            // check if valid number format
            var validNumber = Alpaca.testRegex(Alpaca.regexps.number, textValue);
            if (!validNumber) {
                return false;
            }

            // quick check to see if what they entered was a number
            var floatValue = this.getValue();
            if (isNaN(floatValue)) {
                return false;
            }

            return true;
        },

        /**
         * Validates divisibleBy constraint.
         * @returns {Boolean} true if it passes the divisibleBy constraint.
         */
        _validateDivisibleBy: function () {
            var floatValue = this.getValue();
            if (!Alpaca.isEmpty(this.schema.divisibleBy)) {

                // mod
                if (floatValue % this.schema.divisibleBy !== 0) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates maximum constraint.
         * @returns {Boolean} true if it passes the maximum constraint.
         */
        _validateMaximum: function () {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.maximum)) {
                if (floatValue > this.schema.maximum) {
                    return false;
                }

                if (!Alpaca.isEmpty(this.schema.exclusiveMaximum)) {
                    if (floatValue == this.schema.maximum && this.schema.exclusiveMaximum) { // jshint ignore:line
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Validates maximum constraint.
         * @returns {Boolean} true if it passes the minimum constraint.
         */
        _validateMinimum: function () {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.minimum)) {
                if (floatValue < this.schema.minimum) {
                    return false;
                }

                if (!Alpaca.isEmpty(this.schema.exclusiveMinimum)) {
                    if (floatValue == this.schema.minimum && this.schema.exclusiveMinimum) { // jshint ignore:line
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Validates multipleOf constraint.
         * @returns {Boolean} true if it passes the multipleOf constraint.
         */
        _validateMultipleOf: function () {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.multipleOf)) {
                if (floatValue && this.schema.multipleOf !== 0) {
                    return false;
                }
            }

            return true;
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function () {
            return "number";
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyDown: function (e) {
            var self = this;

            // ignore tab and arrow keys
            if (e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
                return;
            }

            if (e.keyCode === 8) // backspace
            {
                if (!Alpaca.isEmpty(self.schema.minLength) && (self.options.constrainLengths || self.options.constrainMinLength)) {
                    var newValue = self.getValue() || "";
                    if (Alpaca.isNumber(newValue)) {
                        newValue = newValue.toString();
                    }
                    if (newValue.length <= self.schema.minLength) {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }
            else {
                if (!Alpaca.isEmpty(self.schema.maxLength) && (self.options.constrainLengths || self.options.constrainMaxLength)) {
                    var newValue = self.getValue() || "";
                    if (Alpaca.isNumber(newValue)) {
                        newValue = newValue.toString();
                    }
                    if (newValue.length >= self.schema.maxLength) {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }

            if (e.keyCode === 32) // space
            {
                if (self.options.disallowEmptySpaces) {
                    // kill event
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        },

        onKeyUp: function (e) {
            var self = this;

            // if applicable, update the max length indicator
            self.updateMaxLengthIndicator();

            // trigger "fieldkeyup"
            $(this.field).trigger("fieldkeyup");
        },

        /* builder_helpers */

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multipleOf": {
                        "title": "Multiple Of",
                        "description": "Property value must be a multiple of the multipleOf schema property such that division by this value yields an interger (mod zero).",
                        "type": "number"
                    },
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property.",
                        "type": "number"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property.",
                        "type": "number"
                    },
                    "exclusiveMinimum": {
                        "title": "Exclusive Minimum",
                        "description": "Property value can not equal the number defined by the minimum schema property.",
                        "type": "boolean",
                        "default": false
                    },
                    "exclusiveMaximum": {
                        "title": "Exclusive Maximum",
                        "description": "Property value can not equal the number defined by the maximum schema property.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsSchema
         */
        getOptionsForSchema: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multipleOf": {
                        "title": "Multiple Of",
                        "description": "The value must be a integral multiple of the property",
                        "type": "number"
                    },
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property",
                        "type": "number"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property",
                        "type": "number"
                    },
                    "exclusiveMinimum": {
                        "rightLabel": "Exclusive minimum ?",
                        "helper": "Field value must be greater than but not equal to this number if checked",
                        "type": "checkbox"
                    },
                    "exclusiveMaximum": {
                        "rightLabel": "Exclusive Maximum ?",
                        "helper": "Field value must be less than but not equal to this number if checked",
                        "type": "checkbox"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.NumberField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "numericEntry": {
                        "title": "Numeric Entry",
                        "description": "Whether to constrain data entry key presses to numeric values (0-9)",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function () {
            return "Number Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function () {
            return "Field for float numbers.";
        }

        /* end_builder_helpers */
    });

    // Additional Registrations
    Alpaca.registerMessages({
        "stringValueTooSmall": "The minimum value for this field is {0}",
        "stringValueTooLarge": "The maximum value for this field is {0}",
        "stringValueTooSmallExclusive": "Value of this field must be greater than {0}",
        "stringValueTooLargeExclusive": "Value of this field must be less than {0}",
        "stringDivisibleBy": "The value must be divisible by {0}",
        "stringNotANumber": "This value is not a number.",
        "stringValueNotMultipleOf": "This value is not a multiple of {0}"
    });
    Alpaca.registerFieldClass("number", Alpaca.Fields.NumberField);
    Alpaca.registerDefaultSchemaFieldMapping("number", "number");

})(jQuery);
///#source 1 1 Select2Field.js
(function($) {

    var Alpaca = $.alpaca;

    
    Alpaca.Fields.Select2Field = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.SelectField.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.sf = connector.servicesFramework;
        },
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "select";
        },

        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function()
        {
            var self = this;
            if (self.schema["type"] && self.schema["type"] === "array") {
                self.options.multiple = true;
                self.options.removeDefaultNone = true;
                //self.options.hideNone = true;
            }
            this.base();
        },

        getValue: function () {
            if (this.control && this.control.length > 0) {
                var val = this._getControlVal(true);
                if (typeof (val) === "undefined") {
                    val = this.data;
                }
                else if (Alpaca.isArray(val)) {
                    for (var i = 0; i < val.length; i++) {
                        val[i] = this.ensureProperType(val[i]);
                    }
                }

                return this.base(val);
            }
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val)
        {
            if (Alpaca.isArray(val))
            {
                if (!Alpaca.compareArrayContent(val, this.getValue()))
                {
                    if (!Alpaca.isEmpty(val) && this.control)
                    {
                        this.control.val(val);
                    }

                    this.base(val);
                }
            }
            else
            {
                if (val !== this.getValue())
                {
                    /*
                    if (!Alpaca.isEmpty(val) && this.control)
                    {
                        this.control.val(val);
                    }
                    */
                    if (this.control && typeof(val) != "undefined" && val != null)
                    {
                        this.control.val(val);
                    }

                    this.base(val);
                }
            }
        },

        /**
         * @see Alpaca.ListField#getEnum
         */
        getEnum: function()
        {
            if (this.schema)
            {
                if (this.schema["enum"])
                {
                    return this.schema["enum"];
                }
                else if (this.schema["type"] && this.schema["type"] === "array" && this.schema["items"] && this.schema["items"]["enum"])
                {
                    return this.schema["items"]["enum"];
                }
            }
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            if (self.options.multiple)
            {
                var button = this.control.parent().find(".select2-search__field");

                button.focus(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onFocus.call(self, e);
                        self.trigger("focus", e);
                    }
                });

                button.blur(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onBlur.call(self, e);
                        self.trigger("blur", e);
                    }
                });

                this.control.on("change", function (e) {
                    self.onChange.call(self, e);
                    self.trigger("change", e);

                });
            }
        },

        beforeRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                

                if (self.options.dataService && self.options.dataService) {

                    self.selectOptions = [];

                    var completionFunction = function () {
                        self.schema.enum = [];
                        self.options.optionLabels = [];

                        for (var i = 0; i < self.selectOptions.length; i++) {
                            self.schema.enum.push(self.selectOptions[i].value);
                            self.options.optionLabels.push(self.selectOptions[i].text);
                        }

                        // push back to model
                        model.selectOptions = self.selectOptions;

                        callback();
                    };

                    var postData = "{}";
                    if (self.options.dataService.data){
                        postData = self.options.dataService.data; //JSON.stringify(self.options.dataService.data);
                    }
                    if (!self.options.dataService.module) {
                        self.options.dataService.module = "OpenContent"
                    }
                    if (!self.options.dataService.controller) {
                        self.options.dataService.controller = "OpenContentAPI"
                    }
                    if (!self.options.dataService.action) {
                        self.options.dataService.action = "Lookup"
                    }
                    $.ajax({
                        url: self.sf.getServiceRoot(self.options.dataService.module) + self.options.dataService.controller + "/" + self.options.dataService.action,                        
                        beforeSend: self.sf.setModuleHeaders,
                        type: "post",
                        dataType: "json",
                        //contentType: "application/json; charset=utf-8",
                        data: postData,
                        success: function (jsonDocument) {
                            
                            var ds = jsonDocument;
                            if (self.options.dsTransformer && Alpaca.isFunction(self.options.dsTransformer)) {
                                ds = self.options.dsTransformer(ds);
                            }

                            if (ds) {
                                if (Alpaca.isObject(ds)) {
                                    // for objects, we walk through one key at a time
                                    // the insertion order is the order of the keys from the map
                                    // to preserve order, consider using an array as below
                                    $.each(ds, function (key, value) {
                                        self.selectOptions.push({
                                            "value": key,
                                            "text": value
                                        });
                                    });

                                    completionFunction();
                                }
                                else if (Alpaca.isArray(ds)) {
                                    // for arrays, we walk through one index at a time
                                    // the insertion order is dictated by the order of the indices into the array
                                    // this preserves order
                                    $.each(ds, function (index, value) {
                                        self.selectOptions.push({
                                            "value": value.value,
                                            "text": value.text
                                        });
                                    });

                                    completionFunction();
                                }
                            }
                        },
                        "error": function (jqXHR, textStatus, errorThrown) {

                            self.errorCallback({
                                "message": "Unable to load data from uri : " + self.options.dataSource,
                                "stage": "DATASOURCE_LOADING_ERROR",
                                "details": {
                                    "jqXHR": jqXHR,
                                    "textStatus": textStatus,
                                    "errorThrown": errorThrown
                                }
                            });
                        }
                    });
                }
                else {
                    callback();
                }

            });
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.selectOptions = self.selectOptions;

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if emptySelectFirst and nothing currently checked, then pick first item in the value list
                // set data and visually select it
                if (Alpaca.isUndefined(self.data) && self.options.emptySelectFirst && self.selectOptions && self.selectOptions.length > 0)
                {
                    self.data = self.selectOptions[0].value;
                }

                // do this little trick so that if we have a default value, it gets set during first render
                // this causes the state of the control
                if (self.data)
                {
                    self.setValue(self.data);
                }

                // if we are in multiple mode and the bootstrap multiselect plugin is available, bind it in
                //if (self.options.multiple && $.fn.multiselect)
                if ($.fn.select2)
                {
                    var settings = null;
                    if (self.options.select2) {
                        settings = self.options.select2;
                    }
                    else
                    {
                        settings = {};
                    }
                    /*
                    if (!settings.nonSelectedText)
                    {
                        settings.nonSelectedText = "None";
                        if (self.options.noneLabel)
                        {
                            settings.nonSelectedText = self.options.noneLabel;
                        }
                    }
                    if (self.options.hideNone)
                    {
                        delete settings.nonSelectedText;
                    }
                    */
                    $(self.getControlEl()).select2(settings);
                }

                callback();

            });
        },

        /**
         * Validate against enum property.
         *
         * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
         */
        _validateEnum: function()
        {
            var _this = this;

            if (this.schema["enum"])
            {
                var val = this.data;

                if (!this.isRequired() && Alpaca.isValEmpty(val))
                {
                    return true;
                }

                if (this.options.multiple)
                {
                    var isValid = true;

                    if (!val)
                    {
                        val = [];
                    }

                    if (!Alpaca.isArray(val) && !Alpaca.isObject(val))
                    {
                        val = [val];
                    }

                    $.each(val, function(i,v) {

                        if ($.inArray(v, _this.schema["enum"]) <= -1)
                        {
                            isValid = false;
                            return false;
                        }

                    });

                    return isValid;
                }
                else
                {
                    return ($.inArray(val, this.schema["enum"]) > -1);
                }
            }
            else
            {
                return true;
            }
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
                _this.refreshValidationState();
            });
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function()
        {
            if (this.schema.items && this.schema.items.minItems)
            {
                if ($(":selected",this.control).length < this.schema.items.minItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if number of items has been over maxItems.
         * @returns {Boolean} true if number of items has been over maxItems
         */
        _validateMaxItems: function()
        {
            if (this.schema.items && this.schema.items.maxItems)
            {
                if ($(":selected",this.control).length > this.schema.items.maxItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.items.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.items.minItems]),
                "status": status
            };

            return baseStatus && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {
                // set focus onto the select
                var el = $(this.control).get(0);

                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }
            }
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Select Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Select Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multiple": {
                        "title": "Mulitple Selection",
                        "description": "Allow multiple selection if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown.",
                        "type": "number"
                    },
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "multiselect": {
                        "title": "Multiselect Plugin Settings",
                        "description": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multiple": {
                        "rightLabel": "Allow multiple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "emptySelectFirst": {
                        "type": "checkbox",
                        "rightLabel": "Empty Select First"
                    },
                    "multiselect": {
                        "type": "object",
                        "rightLabel": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("select2", Alpaca.Fields.Select2Field);

})(jQuery);
///#source 1 1 Image2Field.js
(function($) {

    var Alpaca = $.alpaca;

    
    Alpaca.Fields.Image2Field = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.Image2Field.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.sf = connector.servicesFramework;
            this.dataSource = {};
        },
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "select";
        },

        /**
         * @see Alpaca.Fields.Image2Field#setup
         */
        setup: function()
        {
            var self = this;
            if (self.schema["type"] && self.schema["type"] === "array") {
                self.options.multiple = true;
                self.options.removeDefaultNone = true;
                //self.options.hideNone = true;
            }
            this.base();
        },

        getValue: function () {
            if (this.control && this.control.length > 0) {
                var val = this._getControlVal(true);
                if (typeof (val) === "undefined") {
                    val = this.data;
                }
                else if (Alpaca.isArray(val)) {
                    for (var i = 0; i < val.length; i++) {
                        val[i] = this.ensureProperType(val[i]);
                    }
                }

                return this.base(val);
            }
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val)
        {
            if (Alpaca.isArray(val))
            {
                if (!Alpaca.compareArrayContent(val, this.getValue()))
                {
                    if (!Alpaca.isEmpty(val) && this.control)
                    {
                        this.control.val(val);
                    }

                    this.base(val);
                }
            }
            else
            {
                if (val !== this.getValue())
                {
                    /*
                    if (!Alpaca.isEmpty(val) && this.control)
                    {
                        this.control.val(val);
                    }
                    */
                    if (this.control && typeof(val) != "undefined" && val != null)
                    {
                        this.control.val(val);
                    }

                    this.base(val);
                }
            }
        },

        /**
         * @see Alpaca.Image2Field#getEnum
         */
        getEnum: function()
        {
            if (this.schema)
            {
                if (this.schema["enum"])
                {
                    return this.schema["enum"];
                }
                else if (this.schema["type"] && this.schema["type"] === "array" && this.schema["items"] && this.schema["items"]["enum"])
                {
                    return this.schema["items"]["enum"];
                }
            }
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            if (self.options.multiple)
            {
                var button = this.control.parent().find(".select2-search__field");

                button.focus(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onFocus.call(self, e);
                        self.trigger("focus", e);
                    }
                });

                button.blur(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onBlur.call(self, e);
                        self.trigger("blur", e);
                    }
                });

                this.control.on("change", function (e) {
                    self.onChange.call(self, e);
                    self.trigger("change", e);

                });
            }
        },

        beforeRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                

                

                    self.selectOptions = [];

                    var completionFunction = function () {
                        self.schema.enum = [];
                        self.options.optionLabels = [];

                        for (var i = 0; i < self.selectOptions.length; i++) {
                            self.schema.enum.push(self.selectOptions[i].value);
                            self.options.optionLabels.push(self.selectOptions[i].text);
                        }

                        // push back to model
                        model.selectOptions = self.selectOptions;

                        callback();
                    };

                    var postData = { q : "*", d : "" };
                    $.ajax({
                        url: self.sf.getServiceRoot("OpenContent") + "DnnEntitiesAPI" + "/" + "ImagesLookup",
                        beforeSend: self.sf.setModuleHeaders,
                        type: "get",
                        dataType: "json",
                        //contentType: "application/json; charset=utf-8",
                        data: postData,
                        success: function (jsonDocument) {
                            
                            var ds = jsonDocument;

                            if (self.options.dsTransformer && Alpaca.isFunction(self.options.dsTransformer)) {
                                ds = self.options.dsTransformer(ds);
                            }

                            if (ds) {
                                if (Alpaca.isObject(ds)) {
                                    // for objects, we walk through one key at a time
                                    // the insertion order is the order of the keys from the map
                                    // to preserve order, consider using an array as below
                                    $.each(ds, function (key, value) {
                                        self.selectOptions.push({
                                            "value": key,
                                            "text": value
                                        });
                                    });

                                    completionFunction();
                                }
                                else if (Alpaca.isArray(ds)) {
                                    // for arrays, we walk through one index at a time
                                    // the insertion order is dictated by the order of the indices into the array
                                    // this preserves order
                                    $.each(ds, function (index, value) {
                                        self.selectOptions.push({
                                            "value": value.value,
                                            "text": value.text
                                        });
                                        self.dataSource[value.value] = value;
                                    });

                                    completionFunction();
                                }
                            }
                        },
                        "error": function (jqXHR, textStatus, errorThrown) {

                            self.errorCallback({
                                "message": "Unable to load data from uri : " + self.options.dataSource,
                                "stage": "DATASOURCE_LOADING_ERROR",
                                "details": {
                                    "jqXHR": jqXHR,
                                    "textStatus": textStatus,
                                    "errorThrown": errorThrown
                                }
                            });
                        }
                    });
                
                    //callback();
                

            });
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.selectOptions = self.selectOptions;

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if emptySelectFirst and nothing currently checked, then pick first item in the value list
                // set data and visually select it
                if (Alpaca.isUndefined(self.data) && self.options.emptySelectFirst && self.selectOptions && self.selectOptions.length > 0)
                {
                    self.data = self.selectOptions[0].value;
                }

                // do this little trick so that if we have a default value, it gets set during first render
                // this causes the state of the control
                if (self.data)
                {
                    self.setValue(self.data);
                }

                // if we are in multiple mode and the bootstrap multiselect plugin is available, bind it in
                //if (self.options.multiple && $.fn.multiselect)
                if ($.fn.select2)
                {
                    var settings = null;
                    if (self.options.select2) {
                        settings = self.options.select2;
                    }
                    else
                    {
                        settings = {};
                    }
                    /*
                    if (!settings.nonSelectedText)
                    {
                        settings.nonSelectedText = "None";
                        if (self.options.noneLabel)
                        {
                            settings.nonSelectedText = self.options.noneLabel;
                        }
                    }
                    if (self.options.hideNone)
                    {
                        delete settings.nonSelectedText;
                    }
                    */

                    settings.templateResult = function (state) {
                        if (!state.id) { return state.text; }
                        
                        var $state = $(
                          '<span><img src="' + self.dataSource[state.id].url + '" style="height: 30px;width: 36px;"  /> ' + state.text + '</span>'
                        );
                        return $state;
                    };

                    settings.templateSelection = function (state) {
                        if (!state.id) { return state.text; }
                        
                        var $state = $(
                          '<span><img src="' + self.dataSource[state.id].url + '" style="height: 15px;width: 18px;"  /> ' + state.text + '</span>'
                        );
                        return $state;
                    };

                    $(self.getControlEl()).select2(settings);
                }

                callback();

            });
        },

        getFileUrl : function(fileid){

            var postData = { fileid: fileid };
            $.ajax({
                url: self.sf.getServiceRoot("OpenContent") + "DnnEntitiesAPI" + "/" + "FileUrl",
                beforeSend: self.sf.setModuleHeaders,
                type: "get",
                asych : false,
                dataType: "json",
                //contentType: "application/json; charset=utf-8",
                data: postData,
                success: function (data) {
                    return data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    return "";
                }
            });

        },

        /**
         * Validate against enum property.
         *
         * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
         */
        _validateEnum: function()
        {
            var _this = this;

            if (this.schema["enum"])
            {
                var val = this.data;

                if (!this.isRequired() && Alpaca.isValEmpty(val))
                {
                    return true;
                }

                if (this.options.multiple)
                {
                    var isValid = true;

                    if (!val)
                    {
                        val = [];
                    }

                    if (!Alpaca.isArray(val) && !Alpaca.isObject(val))
                    {
                        val = [val];
                    }

                    $.each(val, function(i,v) {

                        if ($.inArray(v, _this.schema["enum"]) <= -1)
                        {
                            isValid = false;
                            return false;
                        }

                    });

                    return isValid;
                }
                else
                {
                    return ($.inArray(val, this.schema["enum"]) > -1);
                }
            }
            else
            {
                return true;
            }
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
                _this.refreshValidationState();
            });
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function()
        {
            if (this.schema.items && this.schema.items.minItems)
            {
                if ($(":selected",this.control).length < this.schema.items.minItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if number of items has been over maxItems.
         * @returns {Boolean} true if number of items has been over maxItems
         */
        _validateMaxItems: function()
        {
            if (this.schema.items && this.schema.items.maxItems)
            {
                if ($(":selected",this.control).length > this.schema.items.maxItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.items.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.items.minItems]),
                "status": status
            };

            return baseStatus && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {
                // set focus onto the select
                var el = $(this.control).get(0);

                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }
            }
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Select Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Select Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.Image2Field#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multiple": {
                        "title": "Mulitple Selection",
                        "description": "Allow multiple selection if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown.",
                        "type": "number"
                    },
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "multiselect": {
                        "title": "Multiselect Plugin Settings",
                        "description": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.Image2Field#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multiple": {
                        "rightLabel": "Allow multiple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "emptySelectFirst": {
                        "type": "checkbox",
                        "rightLabel": "Empty Select First"
                    },
                    "multiselect": {
                        "type": "object",
                        "rightLabel": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("image2", Alpaca.Fields.Image2Field);

})(jQuery);
///#source 1 1 UrlField.js
(function($) {

    var Alpaca = $.alpaca;

    $.alpaca.Fields.DnnUrlField = $.alpaca.Fields.TextField.extend({

        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.culture = connector.culture;
            this.sf = connector.servicesFramework;
        },

        setup: function () {
            this.base();
        },
        applyTypeAhead: function () {
            var self = this;
            var tConfig = tConfig = {};
            var tDatasets = tDatasets = {};
            if (!tDatasets.name) {
                tDatasets.name = self.getId();
            }

            var tEvents = tEvents = {};
                
            var bloodHoundConfig = {
                datumTokenizer: function (d) {
                    return Bloodhound.tokenizers.whitespace(d.value);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace
            };

            /*
            if (tDatasets.type === "prefetch") {
                bloodHoundConfig.prefetch = {
                    url: tDatasets.source,
                    ajax: {
                        //url: sf.getServiceRoot('OpenContent') + "FileUpload/UploadFile",
                        beforeSend: connector.servicesFramework.setModuleHeaders,

                    }
                };

                if (tDatasets.filter) {
                    bloodHoundConfig.prefetch.filter = tDatasets.filter;
                }
            }
            */
                    
                bloodHoundConfig.remote = {
                    url: self.sf.getServiceRoot('OpenContent') + "DnnEntitiesAPI/Tabs?q=%QUERY&l="+self.culture,
                    ajax: {
                        beforeSend: self.sf.setModuleHeaders,
                    }
                };

                if (tDatasets.filter) {
                    bloodHoundConfig.remote.filter = tDatasets.filter;
                }

                if (tDatasets.replace) {
                    bloodHoundConfig.remote.replace = tDatasets.replace;
                }
                    

            var engine = new Bloodhound(bloodHoundConfig);
            engine.initialize();
            tDatasets.source = engine.ttAdapter();
                
            tDatasets.templates = {
                "empty": "Nothing found...",
                "suggestion": "{{name}}"
            };

            // compile templates
            if (tDatasets.templates) {
                for (var k in tDatasets.templates) {
                    var template = tDatasets.templates[k];
                    if (typeof (template) === "string") {
                        tDatasets.templates[k] = Handlebars.compile(template);
                    }
                }
            }

            // process typeahead
            $(self.control).typeahead(tConfig, tDatasets);

            // listen for "autocompleted" event and set the value of the field
            $(self.control).on("typeahead:autocompleted", function (event, datum) {
                self.setValue(datum.value);
                $(self.control).change();
            });

            // listen for "selected" event and set the value of the field
            $(self.control).on("typeahead:selected", function (event, datum) {
                self.setValue(datum.value);
                $(self.control).change();
            });

            // custom events
            if (tEvents) {
                if (tEvents.autocompleted) {
                    $(self.control).on("typeahead:autocompleted", function (event, datum) {
                        tEvents.autocompleted(event, datum);
                    });
                }
                if (tEvents.selected) {
                    $(self.control).on("typeahead:selected", function (event, datum) {
                        tEvents.selected(event, datum);
                    });
                }
            }

            // when the input value changes, change the query in typeahead
            // this is to keep the typeahead control sync'd with the actual dom value
            // only do this if the query doesn't already match
            var fi = $(self.control);
            $(self.control).change(function () {

                var value = $(this).val();

                var newValue = $(fi).typeahead('val');
                if (newValue !== value) {
                    $(fi).typeahead('val', newValue);
                }

            });

            // some UI cleanup (we don't want typeahead to restyle)
            $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
            $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
            
        }
    });
    Alpaca.registerFieldClass("url", Alpaca.Fields.DnnUrlField);

})(jQuery);
///#source 1 1 wysihtmlField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.wysihtmlField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.CKEditorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function () {
            return "wysihtml";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function () {
            if (!this.data) {
                this.data = "";
            }

            this.base();

            if (typeof (this.options.wysihtml) == "undefined") {
                this.options.wysihtml = {};
            }
        },

        afterRenderControl: function (model, callback) {
            var self = this;

            this.base(model, function () {

                // see if we can render CK Editor
                if (!self.isDisplayOnly() && self.control ) {
                    //self.plugin = $(self.control).ckeditor(self.options.ckeditor); // Use CKEDITOR.replace() if element is <textarea>.
                    var el = self.control;
                    var ta = $(el).find('#'+self.id)[0];


                    self.editor = new wysihtml5.Editor(ta, {
                        toolbar: $(el).find('#' + self.id + '-toolbar')[0],                        
                        parserRules: wysihtml5ParserRules // defined in file parser rules javascript
                    });

                    wysihtml5.commands.custom_class = {
                        exec: function (composer, command, className) {
                            return wysihtml5.commands.formatBlock.exec(composer, command, "p", className, new RegExp(className, "g"));
                        },
                        state: function (composer, command, className) {
                            return wysihtml5.commands.formatBlock.state(composer, command, "p", className, new RegExp(className, "g"));
                        }
                    };

                }
                callback();
            });
        },
        getEditor: function () {
            return this.editor;
        },

        setValue: function(value)
        {
            var self = this;

            if (this.editor)
            {
                this.editor.setValue(value);
                //self.editor.clearSelection();
            }

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getValue: function()
        {
            var value = null;
            if (this.editor)
            {
                if (this.editor.currentView == 'source')
                    value = this.editor.sourceView.textarea.value
                else 
                    value = this.editor.getValue();
            }
            return value;
        },


        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        getTitle: function () {
            return "wysihtml";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function () {
            return "Provides an instance of a wysihtml control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "wysihtml": {
                        "title": "CK Editor options",
                        "description": "Use this entry to provide configuration options to the underlying CKEditor plugin.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "wysiwyg": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("wysihtml", Alpaca.Fields.wysihtmlField);

})(jQuery);
///#source 1 1 MLCKEditorField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MLCKEditorField = Alpaca.Fields.CKEditorField.extend(
    /**
     * @lends Alpaca.Fields.CKEditorField.prototype
     */
    {

        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.culture = connector.culture;
            this.defaultCulture = connector.defaultCulture;
        },

        /**
         * @see Alpaca.Fields.CKEditorField#setup
         */
        setup: function () {
            if (this.data && Alpaca.isObject(this.data)) {
                this.olddata = this.data;
            } else if (this.data) {
                this.olddata = {};
                this.olddata[this.defaultCulture] = this.data;
            }
            this.base();
        },
        /**
         * @see Alpaca.Fields.CKEditorField#getValue
         */
        getValue: function () {
            var val = this.base();
            var self = this;
            var o = {};
            if (this.olddata && Alpaca.isObject(this.olddata)) {
                $.each(this.olddata, function (key, value) {
                    var v = Alpaca.copyOf(value);
                    if (key != self.culture) {
                        o[key] = v;
                    }
                });
            }
            if (val != "") {
                o[self.culture] = val;
            }
            if ($.isEmptyObject(o)) {
                return "";
            }
            return o;
        },

        /**
         * @see Alpaca.Fields.CKEditorField#setValue
         */
        setValue: function (val) {
            if (val === "") {
                return;
            }
            if (!val) {
                this.base("");
                return;
            }
            if (Alpaca.isObject(val)) {
                var v = val[this.culture];
                if (!v) {
                    this.base("");
                    return;
                }
                this.base(v);
            }
            else
            {
                this.base(val);
            }
        },
        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        handlePostRender: function (callback) {
            var self = this;
            var el = this.getControlEl();
            $(this.control.get(0)).after('<img src="/images/Flags/'+this.culture+'.gif" />');
            callback();
        },
        
        /**
         * @see Alpaca.Fields.CKEditorField#getTitle
         */
        getTitle: function () {
            return "Multi Language CKEditor Field";
        },

        /**
         * @see Alpaca.Fields.CKEditorField#getDescription
         */
        getDescription: function () {
            return "Multi Language CKEditor field .";
        },

        /**
         * @private
         * @see Alpaca.Fields.CKEditorField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default": ","
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.CKEditorField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("mlckeditor", Alpaca.Fields.MLCKEditorField);

})(jQuery);
///#source 1 1 MLFileField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MLUrlField = Alpaca.Fields.FileField.extend(
    /**
     * @lends Alpaca.Fields.MLFileField.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.culture = connector.culture;
            this.defaultCulture = connector.defaultCulture;
        },

        /**
         * @see Alpaca.Fields.MLFileField#setup
         */
        setup: function () {
            if (this.data && Alpaca.isObject(this.data)) {
                this.olddata = this.data;
            } else if (this.data) {
                this.olddata = {};
                this.olddata[this.defaultCulture] = this.data;
            }
            this.base();
        },
        /**
         * @see Alpaca.Fields.MLFileField#getValue
         */
        getValue: function () {
            var val = this.base();
            var self = this;
            var o = {};
            if (this.olddata && Alpaca.isObject(this.olddata)) {
                $.each(this.olddata, function (key, value) {
                    var v = Alpaca.copyOf(value);
                    if (key != self.culture) {
                        o[key] = v;
                    }
                });
            }
            if (val != "") {
                o[self.culture] = val;
            }
            if ($.isEmptyObject(o)) {
                return "";
            }
            return o;
        },

        /**
         * @see Alpaca.Fields.MLFileField#setValue
         */
        setValue: function (val) {
            if (val === "") {
                return;
            }
            if (!val) {
                this.base("");
                return;
            }
            if (Alpaca.isObject(val)) {
                var v = val[this.culture];
                if (!v) {
                    this.base("");
                    return;
                }
                this.base(v);
            }
            else
            {
                this.base(val);
            }
        },
        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        handlePostRender: function (callback) {
            var self = this;
            var el = this.getControlEl();
            $(this.control.get(0)).after('<img src="/images/Flags/'+this.culture+'.gif" />');
            callback();
        },
        
        /**
         * @see Alpaca.Fields.MLFileField#getTitle
         */
        getTitle: function () {
            return "Multi Language Url Field";
        },

        /**
         * @see Alpaca.Fields.MLFileField#getDescription
         */
        getDescription: function () {
            return "Multi Language Url field .";
        },

        /**
         * @private
         * @see Alpaca.Fields.MLFileField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default": ","
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.MLFileField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("mlfile", Alpaca.Fields.MLFileField);

})(jQuery);
///#source 1 1 MLImageField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MLUrlField = Alpaca.Fields.ImageField.extend(
    /**
     * @lends Alpaca.Fields.MLImageField.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.culture = connector.culture;
            this.defaultCulture = connector.defaultCulture;
        },

        /**
         * @see Alpaca.Fields.MLImageField#setup
         */
        setup: function () {
            if (this.data && Alpaca.isObject(this.data)) {
                this.olddata = this.data;
            } else if (this.data) {
                this.olddata = {};
                this.olddata[this.defaultCulture] = this.data;
            }

            this.base();
        },
        /**
         * @see Alpaca.Fields.MLImageField#getValue
         */
        getValue: function () {
            var val = this.base();
            var self = this;
            var o = {};
            if (this.olddata && Alpaca.isObject(this.olddata)) {
                $.each(this.olddata, function (key, value) {
                    var v = Alpaca.copyOf(value);
                    if (key != self.culture) {
                        o[key] = v;
                    }
                });
            }
            if (val != "") {
                o[self.culture] = val;
            }
            if ($.isEmptyObject(o)) {
                return "";
            }
            return o;
        },

        /**
         * @see Alpaca.Fields.MLImageField#setValue
         */
        setValue: function (val) {
            if (val === "") {
                return;
            }
            if (!val) {
                this.base("");
                return;
            }
            if (Alpaca.isObject(val)) {
                var v = val[this.culture];
                if (!v) {
                    this.base("");
                    return;
                }
                this.base(v);
            }
            else
            {
                this.base(val);
            }
        },
        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        handlePostRender: function (callback) {
            var self = this;
            var el = this.getControlEl();
            $(this.control.get(0)).after('<img src="/images/Flags/'+this.culture+'.gif" />');
            callback();
        },
        
        /**
         * @see Alpaca.Fields.MLImageField#getTitle
         */
        getTitle: function () {
            return "Multi Language Url Field";
        },

        /**
         * @see Alpaca.Fields.MLImageField#getDescription
         */
        getDescription: function () {
            return "Multi Language Url field .";
        },

        /**
         * @private
         * @see Alpaca.Fields.MLImageField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default": ","
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.MLImageField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("mlimage", Alpaca.Fields.MLImageField);

})(jQuery);
///#source 1 1 MLTextField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MLTextField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.TagField.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.culture = connector.culture;
            this.defaultCulture = connector.defaultCulture;
        },
        /**
         * @see Alpaca.Fields.TextField#getFieldType
        */
        /*
        getFieldType: function () {
            return "text";
        },
        */

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function () {

            if (this.data && Alpaca.isObject(this.data)) {             
                this.olddata = this.data;
            } else if (this.data) {
                this.olddata = {};
                this.olddata[this.defaultCulture] = this.data;
            }

            this.base();
            /*
            Alpaca.mergeObject(this.options, {
                "fieldClass": "flag-"+this.culture
            });
            */
        },
        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getValue: function () {
            var val = this.base();
            var self = this;
            /*
            if (val === "") {
                return [];
            }
            */

            var o = {};
            if (this.olddata && Alpaca.isObject(this.olddata)) {
                $.each(this.olddata, function (key, value) {
                    var v = Alpaca.copyOf(value);
                    if (key != self.culture) {
                        o[key] = v;
                    }
                });
            }
            if (val != "") {
                o[self.culture] = val;
            }
            if ($.isEmptyObject(o)) {
                return "";
            }
            //o["_type"] = "languages";
            return o;
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function (val) {
            if (val === "") {
                return;
            }
            if (!val) {
                this.base("");
                return;
            }
            if (Alpaca.isObject(val)) {
                var v = val[this.culture];
                if (!v) {
                    this.base("");
                    return;
                }
                this.base(v);
            }
            else
            {
                this.base(val);
            }
        },
        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        handlePostRender: function (callback) {
            var self = this;
            var el = this.getControlEl();
            $(this.control.get(0)).after('<img src="/images/Flags/'+this.culture+'.gif" />');
            //$(this.control.get(0)).after('<div style="background:#eee;margin-bottom: 18px;display:inline-block;padding-bottom:8px;"><span>' + this.culture + '</span></div>');
            callback();
        },
        
        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function () {
            return "Multi Language Text Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function () {
            return "Multi Language Text field .";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default": ","
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("mltext", Alpaca.Fields.MLTextField);

})(jQuery);
///#source 1 1 MLUrlField.js
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MLUrlField = Alpaca.Fields.DnnUrlField.extend(
    /**
     * @lends Alpaca.Fields.MLUrlField.prototype
     */
    {
        constructor: function (container, data, options, schema, view, connector) {
            var self = this;
            this.base(container, data, options, schema, view, connector);
            this.culture = connector.culture;
            this.defaultCulture = connector.defaultCulture;
        },

        /**
         * @see Alpaca.Fields.MLUrlField#setup
         */
        setup: function () {
            if (this.data && Alpaca.isObject(this.data)) {
                this.olddata = this.data;
            } else if (this.data) {
                this.olddata = {};
                this.olddata[this.defaultCulture] = this.data;
            }
            this.base();
        },
        /**
         * @see Alpaca.Fields.MLUrlField#getValue
         */
        getValue: function () {
            var val = this.base();
            var self = this;
            var o = {};
            if (this.olddata && Alpaca.isObject(this.olddata)) {
                $.each(this.olddata, function (key, value) {
                    var v = Alpaca.copyOf(value);
                    if (key != self.culture) {
                        o[key] = v;
                    }
                });
            }
            if (val != "") {
                o[self.culture] = val;
            }
            if ($.isEmptyObject(o)) {
                return "";
            }
            return o;
        },

        /**
         * @see Alpaca.Fields.MLUrlField#setValue
         */
        setValue: function (val) {
            if (val === "") {
                return;
            }
            if (!val) {
                this.base("");
                return;
            }
            if (Alpaca.isObject(val)) {
                var v = val[this.culture];
                if (!v) {
                    this.base("");
                    return;
                }
                this.base(v);
            }
            else
            {
                this.base(val);
            }
        },
        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                self.handlePostRender(function () {
                    callback();
                });
            });
        },
        handlePostRender: function (callback) {
            var self = this;
            var el = this.getControlEl();
            $(this.control.get(0)).after('<img src="/images/Flags/'+this.culture+'.gif" />');
            callback();
        },
        
        /**
         * @see Alpaca.Fields.MLUrlField#getTitle
         */
        getTitle: function () {
            return "Multi Language Url Field";
        },

        /**
         * @see Alpaca.Fields.MLUrlField#getDescription
         */
        getDescription: function () {
            return "Multi Language Url field .";
        },

        /**
         * @private
         * @see Alpaca.Fields.MLUrlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default": ","
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.MLUrlField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("mlurl", Alpaca.Fields.MLUrlField);

})(jQuery);
