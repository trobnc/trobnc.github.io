

var pages = ["graphs", "records", "reports", "about", "pi"];
var pageName = "";
// If this page we're on now is listed as a subpage, use ".." to get to the relative root
function get_relative_url() {
    var sPath = window.location.pathname.replace(/\/$/, "");
    pageName = sPath.substring(sPath.lastIndexOf('/') + 1);
    if ( pages.includes( pageName ) ) {
        var relative_url = "..";
    } else {
        var relative_url = ".";
    }
    belchertown_debug("URL: Relative URL is: " + relative_url);

    return relative_url;
}

// Determine if debug is on via URL var or config setting
if ( getURLvar("debug") && ( getURLvar("debug") == "true" || getURLvar("debug") == "1" ) ) {
    var belchertown_debug_config = true;
    belchertown_debug("Debug: URL debug variable enabled");
} else {
    var belchertown_debug_config = 0;
    belchertown_debug("Debug: skin.conf belchertown_debug enabled");
}

var moment_locale = "en-US";
moment.locale(moment_locale);

var graphgroups_raw = {"homepage": ["chart1", "chart2", "chart3", "chart4", "windrosechart", "daylightning", "outTempRadialYear"], "day": ["chart1", "chart2", "chart3", "chart4"], "week": ["chart1", "chart2", "chart3", "chart4"], "month": ["chart1", "chart2", "chart3", "chart4"], "year": ["chart1", "chart2", "chart3", "chart4"]};
var graphgroups_titles = {"homepage": "Homepage", "day": "Today", "week": "This Week", "month": "This Month", "year": "This Year"};
var graphpage_content = {};

function belchertown_debug(message) {
    if (belchertown_debug_config > 0) {
        console.log(message);
    }
}

jQuery(document).ready(function() {
    
    // Bootstrap hover tooltips
    jQuery(function () {
        jQuery('[data-toggle="tooltip"]').tooltip()
    })
    
    // If the visitor has overridden the theme, keep that theme going throughout the full site and their visit.
    if ( sessionStorage.getItem('theme') == "toggleOverride" ) {
        belchertown_debug("Theme: sessionStorage override in place.");
        changeTheme( sessionStorage.getItem('currentTheme') );
    }

    // Change theme if a URL variable is set
    if ( window.location.search.indexOf('theme') ) {
        if (window.location.search.indexOf('?theme=dark') === 0) {
            belchertown_debug("Theme: Setting dark theme because of URL override");
            changeTheme("dark", true);
        } else if (window.location.search.indexOf('?theme=light') === 0) {
            belchertown_debug("Theme: Setting light theme because of URL override");
            changeTheme("light", true);
        } else if (window.location.search.indexOf('?theme=auto') === 0) {
            belchertown_debug("Theme: Setting auto theme because of URL override");
            sessionStorage.setItem('theme', 'auto')
            autoTheme(17, 57, 06, 44)
        }
    }

    // Dark mode checkbox toggle switcher
    try {
        document.getElementById('themeSwitch').addEventListener('change', function(event) {
            belchertown_debug("Theme: Toggle button changed");
            (event.target.checked) ? changeTheme("dark", true) : changeTheme("light", true);
        });
    } catch(err) {
        // Silently exit
    }
    
    // After charts are loaded, if an anchor tag is in the URL, let's scroll to it
    jQuery(window).on('load', function() {
        var anchor_tag = location.hash.replace('#','');
        if ( anchor_tag != '' ) {
            // Scroll the webpage to the chart. The timeout is to let jQuery finish appending the outer div so the height of the page is completed.
            setTimeout(function() {
                jQuery('html, body').animate({ scrollTop: jQuery('#'+anchor_tag).offset().top }, 500);
            }, 500);
        }
    });
    
});


// Disable AJAX caching
jQuery.ajaxSetup({
    cache:false
});

// Get the URL variables. Source: https://stackoverflow.com/a/26744533/1177153
function getURLvar(k) {
    var p={};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v});
    return k?p[k]:p;
}

// http://stackoverflow.com/a/14887961/1177153
var weatherdirection = { 0: "N", 90: "E", 180: "S", 270: "W", 360: "N" };

// Change the color of the outTemp_F variable
function get_outTemp_color( unit, outTemp, returnColor=false ) {
    outTemp = parseFloat( outTemp ).toFixed(0); // Convert back to decimal literal
    if ( unit == "degree_F" ) {
        if ( outTemp <= 0 ) {
            var outTemp_color = "#1278c8";
        } else if ( outTemp <= 25 ) {
            var outTemp_color = "#30bfef";
        } else if ( outTemp <= 32 ) {
            var outTemp_color = "#1fafdd";
        } else if ( outTemp <= 40 ) {
            var outTemp_color = "rgba(0,172,223,1)";
        } else if ( outTemp <= 50 ) {
            var outTemp_color = "#71bc3c";
        } else if ( outTemp <= 55 ) {
            var outTemp_color = "rgba(90,179,41,0.8)";
        } else if ( outTemp <= 65 ) {
            var outTemp_color = "rgba(131,173,45,1)";
        } else if ( outTemp <= 70 ) {
            var outTemp_color = "rgba(206,184,98,1)";
        } else if ( outTemp <= 75 ) {
            var outTemp_color = "rgba(255,174,0,0.9)";
        } else if ( outTemp <= 80 ) {
            var outTemp_color = "rgba(255,153,0,0.9)";
        } else if ( outTemp <= 85 ) {
            var outTemp_color = "rgba(255,127,0,1)";
        } else if ( outTemp <= 90 ) {
            var outTemp_color = "rgba(255,79,0,0.9)";
        } else if ( outTemp <= 95 ) {
            var outTemp_color = "rgba(255,69,69,1)";
        } else if ( outTemp <= 110 ) {
            var outTemp_color = "rgba(255,104,104,1)";
        } else if ( outTemp >= 111 ) {
            var outTemp_color = "rgba(218,113,113,1)";
        }
    } else if ( unit == "degree_C" ) {
        if ( outTemp <= 0 ) {
            var outTemp_color = "#1278c8";
        } else if ( outTemp <= -3.8 ) {
            var outTemp_color = "#30bfef";
        } else if ( outTemp <= 0 ) {
            var outTemp_color = "#1fafdd";
        } else if ( outTemp <= 4.4 ) {
            var outTemp_color = "rgba(0,172,223,1)";
        } else if ( outTemp <= 10 ) {
            var outTemp_color = "#71bc3c";
        } else if ( outTemp <= 12.7 ) {
            var outTemp_color = "rgba(90,179,41,0.8)";
        } else if ( outTemp <= 18.3 ) {
            var outTemp_color = "rgba(131,173,45,1)";
        } else if ( outTemp <= 21.1 ) {
            var outTemp_color = "rgba(206,184,98,1)";
        } else if ( outTemp <= 23.8 ) {
            var outTemp_color = "rgba(255,174,0,0.9)";
        } else if ( outTemp <= 26.6 ) {
            var outTemp_color = "rgba(255,153,0,0.9)";
        } else if ( outTemp <= 29.4 ) {
            var outTemp_color = "rgba(255,127,0,1)";
        } else if ( outTemp <= 32.2 ) {
            var outTemp_color = "rgba(255,79,0,0.9)";
        } else if ( outTemp <= 35 ) {
            var outTemp_color = "rgba(255,69,69,1)";
        } else if ( outTemp <= 43.3 ) {
            var outTemp_color = "rgba(255,104,104,1)";
        } else if ( outTemp >= 43.4 ) {
            var outTemp_color = "rgba(218,113,113,1)";
        }
    }
    
    // Return the color value if requested, otherwise just set the div color
    if ( returnColor ) {
        return outTemp_color;
    } else {
        jQuery(".outtemp_outer").css( "color", outTemp_color );
    }
}

function highcharts_tooltip_factory(obsvalue, point_obsType, highchartsReturn=false, rounding, mirrored=false, numberFormat) {
    // Mirrored values have the negative sign removed
    if ( mirrored ) {
        obsvalue = Math.abs( obsvalue );
    }
            
    if ( point_obsType == "windDir" ) {
        if (obsvalue >= 0 && obsvalue <= 11.25) {
            ordinal = "N"; // N
        } else if (obsvalue >= 11.26 && obsvalue <= 33.75) {
            ordinal = "NNE"; // NNE
        } else if (obsvalue >= 33.76 && obsvalue <= 56.25) {
            ordinal = "NE"; // NE
        } else if (obsvalue >= 56.26 && obsvalue <= 78.75) {
            ordinal = "ENE"; // ENE
        } else if (obsvalue >= 78.76 && obsvalue <= 101.25) {
            ordinal = "E"; // E
        } else if (obsvalue >= 101.26 && obsvalue <= 123.75) {
            ordinal = "ESE"; // ESE
        } else if (obsvalue >= 123.76 && obsvalue <= 146.25) {
            ordinal = "SE"; // SE
        } else if (obsvalue >= 146.26 && obsvalue <= 168.75) {
            ordinal = "SSE"; // SSE
        } else if (obsvalue >= 168.76 && obsvalue <= 191.25) {
            ordinal = "S"; // S
        } else if (obsvalue >= 191.26 && obsvalue <= 213.75) {
            ordinal = "SSW"; // SSW
        } else if (obsvalue >= 213.76 && obsvalue <= 236.25) {
            ordinal = "SW"; // SW
        } else if (obsvalue >= 236.26 && obsvalue <= 258.75) {
            ordinal = "WSW"; // WSW
        } else if (obsvalue >= 258.76 && obsvalue <= 281.25) {
            ordinal = "W"; // W
        } else if (obsvalue >= 281.26 && obsvalue <= 303.75) {
            ordinal = "WNW"; // WNW
        } else if (obsvalue >= 303.76 && obsvalue <= 326.25) {
            ordinal = "NW"; // NW
        } else if (obsvalue >= 326.26 && obsvalue <= 348.75) {
            ordinal = "NNW"; // NNW
        } else if (obsvalue >= 348.76 && obsvalue <= 360) {
            ordinal = "N"; // N
        }
        
        // highchartsReturn returns the full wind direction string for highcharts tooltips. e.g "NNW (337)"
        if ( highchartsReturn ) {
            output = ordinal + " ("+ Math.round(obsvalue) + "\xBA)";
        } else {
            output = ordinal;
        }
    } else {
        try {
            // Setup any graphs.conf overrides on formatting
            var { decimals, decimalPoint, thousandsSep } = numberFormat;
            
            // Try to apply the highcharts numberFormat for locale awareness. Use rounding from weewx.conf StringFormats.
            // -1 is set from Python to notate no rounding data available and decimals from graphs.conf is undefined.
            if ( rounding == "-1" && typeof decimals === "undefined" ) {
                output = Highcharts.numberFormat(obsvalue);
            } else {
                // If the amount of decimal is defined, use that instead since rounding is provided to the function.
                if ( typeof decimals !== "undefined" ) {
                    rounding = decimals;
                }
                // If decimalPoint is undefined, use the auto detect from the skin since this comes from the skin.
                if ( typeof decimalPoint === "undefined" ) {
                    decimalPoint = ".";
                }
                // If thousandsSep is undefined, use the auto detect from the skin since this comes from the skin.
                if ( typeof thousandsSep === "undefined" ) {
                    thousandsSep = ",";
                }
                    
                output = Highcharts.numberFormat(obsvalue, rounding, decimalPoint, thousandsSep);
            }
        } catch(err) {
            // Fall back to just returning the highcharts point number value, which is a best guess.
            output = Highcharts.numberFormat(obsvalue);
        }
    }
    
    return output;
}

// Handle wind arrow rotation with the ability to "rollover" past 0 
// without spinning back around. e.g 350 to 3 would normally spin back around
// https://stackoverflow.com/a/19872672/1177153
function rotateThis(newRotation) {
    if ( newRotation == "N/A") { return; }
    belchertown_debug("rotateThis: rotating to " + newRotation);
    var currentRotation;
    finalRotation = finalRotation || 0; // if finalRotation undefined or 0, make 0, else finalRotation
    currentRotation = finalRotation % 360;
    if ( currentRotation < 0 ) { currentRotation += 360; }
    if ( currentRotation < 180 && (newRotation > (currentRotation + 180)) ) { finalRotation -= 360; }
    if ( currentRotation >= 180 && (newRotation <= (currentRotation - 180)) ) { finalRotation += 360; }
    finalRotation += (newRotation - currentRotation);
    jQuery(".wind-arrow").css( "transform", "rotate(" + finalRotation + "deg)" );
    jQuery(".arrow").css( "transform", "rotate(" + finalRotation + "deg)" );
}

// Title case strings. https://stackoverflow.com/a/45253072/1177153
function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

function autoTheme(sunset_hour, sunset_min, sunrise_hour, sunrise_min) {
    // First check if ?theme= is in URL. If so, bail out and do not change anything. 
    if ( getURLvar("theme") && getURLvar("theme") != "auto" ) {
        belchertown_debug("Auto theme: theme override detected in URL. Skipping auto theme");
        return true;
    }
    belchertown_debug("Auto theme: checking to see if theme needs to be switched");
    
    var d = new Date();
    var nowHour = d.getHours();
    var nowMinutes = d.getMinutes();
    nowHour = nowHour;
    sunrise_hour = sunrise_hour;
    sunset_hour = sunset_hour;
    
    // Determine if it's day time. https://stackoverflow.com/a/14718577/1177153
    if ( sunrise_hour <= nowHour && nowHour < sunset_hour ) {
        dayTime = true;
    } else {
        dayTime = false;
    }
    
    belchertown_debug("Auto theme: sunrise: " + sunrise_hour);
    belchertown_debug("Auto theme: now: " + nowHour);
    belchertown_debug("Auto theme: sunset: " + sunset_hour);
    belchertown_debug("Auto theme: are we in daylight hours: " + dayTime);
    belchertown_debug("Auto theme: sessionStorage.getItem('theme') = " + sessionStorage.getItem('theme'));
    
    if ( dayTime ) {
        // Day time, set light if needed
        if ( document.body.classList.contains("dark") ) {
            if ( sessionStorage.getItem('theme') == "auto" ) {
                belchertown_debug("Auto theme: setting light theme since dayTime variable is true (day)");
            } else {
                belchertown_debug("Auto theme: cannot set light theme since visitor used toggle to override theme. Refresh to reset the override.");
            }
            // Only change theme if user has not overridden the auto option with the toggle
            if ( sessionStorage.getItem('theme') == "auto" ) {
                changeTheme("light");
            }
        }
    } else {
        // Night time, set dark if needed
        if ( document.body.classList.contains("light") ) {
            if ( sessionStorage.getItem('theme') == "auto" ) {
                belchertown_debug("Auto theme: setting dark theme since dayTime variable is false (night)");
            } else {
                belchertown_debug("Auto theme: cannot set dark theme since visitor used toggle to override theme. Refresh to reset the override.");
            }
            // Only change theme if user has not overridden the auto option with the toggle
            if ( sessionStorage.getItem('theme') == "auto" ) {
                changeTheme("dark");
            }
        }
    }
}

function changeTheme(themeName, toggleOverride=false) {
    belchertown_debug("Theme: Changing to " + themeName);
    // If the configured theme is auto, but the user toggles light/dark, remove the auto option.
    if ( toggleOverride ) {
        belchertown_debug("Theme: toggle override clicked.");
        belchertown_debug("Theme: sessionStorage.getItem('theme') was previously: " + sessionStorage.getItem('theme') );
        // This was applied only to auto theme config, but now it's applied to all themes so visitor has full control on light/dark mode
        //if ( sessionStorage.getItem('theme') == "auto" ) { }
        sessionStorage.setItem('theme', 'toggleOverride');
        belchertown_debug("Theme: sessionStorage.getItem('theme') is now: " + sessionStorage.getItem('theme') );
    }
    if ( themeName == "dark" ) {
        // Apply dark theme
        jQuery('body').addClass("dark");
        jQuery('body').removeClass("light");
        jQuery("#themeSwitch").prop( "checked", true );
        sessionStorage.setItem('currentTheme', 'dark');
    } else if ( themeName == "light" ) {
        // Apply light theme
        jQuery('body').addClass("light");
        jQuery('body').removeClass("dark");
        jQuery("#themeSwitch").prop( "checked", false );
        belchertown_debug("Theme: logo_image is defined.");
        jQuery("#logo_image").attr("src", "https://moreheadcitync.org/ImageRepository/Document?documentID=460");
        sessionStorage.setItem('currentTheme', 'light');
    }
}

function ajaxweewx() {
    // Relative URL
    jQuery.getJSON(get_relative_url() + "/json/weewx_data.json", update_weewx_data);
};

// Update weewx data elements
//var station_obs_array = "";
var unit_rounding_array = "";
var unit_label_array = "";
function update_weewx_data( data ) {
    belchertown_debug("Updating weewx data");
    
    
    //station_obs_array = data["station_observations"];
    unit_rounding_array = data["unit_rounding"];
    unit_label_array = data["unit_label"];
    
    // Daily High Low
    high = data["day"]["outTemp"]["max"];
    low = data["day"]["outTemp"]["min"];
    jQuery(".high").html( high );
    jQuery(".low").html( low );
    
    // Barometer trending by finding a negative number
    count = ( data["current"]["barometer_trend"].match(/-/g) || [] ).length
    
    if ( count >= 1 ) {
        jQuery(".pressure-trend").html( '<i class="fa fa-arrow-down barometer-down"></i>' );
    } else {
        jQuery(".pressure-trend").html( '<i class="fa fa-arrow-up barometer-up"></i>' );
    }
    
    // Daily max gust span
    jQuery(".dailymaxgust").html( parseFloat( data["day"]["wind"]["max"] ).toFixed(1) );
    
    // Daily Snapshot Stats Section
    jQuery(".snapshot-records-today-header").html( moment.unix( data["current"]["epoch"] ).utcOffset(-300.0).format( 'dddd, LL' ) );
    jQuery(".snapshot-records-month-header").html( moment.unix( data["current"]["epoch"] ).utcOffset(-300.0).format( 'MMMM YYYY' ) );
    jQuery(".dailystatshigh").html( data["day"]["outTemp"]["max"] );
    jQuery(".dailystatslow").html( data["day"]["outTemp"]["min"] );
    jQuery(".dailystatswindavg").html( data["day"]["wind"]["average"] );
    jQuery(".dailystatswindmax").html( data["day"]["wind"]["max"] );
    jQuery(".dailystatsrain").html( data["day"]["rain"]["sum"] );
    jQuery(".dailystatsrainrate").html( data["day"]["rain"]["max"] );
    
    // Month Snapshot Stats Section
    jQuery(".monthstatshigh").html( data["month"]["outTemp"]["max"] );
    jQuery(".monthstatslow").html( data["month"]["outTemp"]["min"] );
    jQuery(".monthstatswindavg").html( data["month"]["wind"]["average"] );
    jQuery(".monthstatswindmax").html( data["month"]["wind"]["max"] );
    jQuery(".monthstatsrain").html( data["month"]["rain"]["sum"] );
    jQuery(".monthstatsrainrate").html( data["month"]["rain"]["max"] );
    
    // Sunrise and Sunset            
    jQuery(".sunrise-value").html( moment.unix( parseFloat(data["almanac"]["sunrise_epoch"]).toFixed(0) ).utcOffset(-300.0).format( "LT" ) );
    jQuery(".sunset-value").html( moment.unix( parseFloat(data["almanac"]["sunset_epoch"]).toFixed(0) ).utcOffset(-300.0).format( "LT" ) );
    
    // Moon icon, phase and illumination percent
    switch ( data["almanac"]["moon"]["moon_index"] ) {
        case "0":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-new'></div>" );
            break;
        case "1":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-waxing-crescent-3 northern-hemisphere'></div>" );
            break;
        case "2":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-first-quarter northern-hemisphere'></div>" );
            break;
        case "3":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-waxing-gibbous-3 northern-hemisphere'></div>" );
            break;
        case "4":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-full'></div>" );
            break;
        case "5":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-waning-gibbous-3 northern-hemisphere'></div>" );
            break;
        case "6":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-third-quarter northern-hemisphere'></div>" );
            break;
        case "7":
            jQuery(".moon-icon").html( "<div class='wi wi-moon-alt-waning-crescent-4 northern-hemisphere'></div>" );
            break;
    }
    jQuery(".moon-phase").html( titleCase( data["almanac"]["moon"]["moon_phase"] ) ); // Javascript function above
    jQuery(".moon-visible").html( "<strong>" + data["almanac"]["moon"]["moon_fullness"] + "%</strong> visible" );
    // Close current modal if open
    jQuery('#almanac').modal('hide');
    jQuery(".almanac-extras-modal-body").html( data["almanac"]["almanac_extras_modal_html"] );
    almanac_updated = "Last Updated " + moment.unix( data["current"]["datetime_raw"] ).utcOffset( -300.0 ).format( "LL, LTS" );
    jQuery(".almanac_last_updated").html( almanac_updated );
}

function ajaxforecast() {
    jQuery.getJSON( get_relative_url() + "/json/forecast.json", update_forecast_data);
};

function aeris_coded_weather( data, full_observation = false ) {
    // https://www.aerisweather.com/support/docs/api/reference/weather-codes/
    var output = "";
    var coverage_code = data.split(":")[0]
    var intensity_code = data.split(":")[1]
    var weather_code = data.split(":")[2]
        
    var cloud_dict = {
        "CL": "Clear",
        "FW": "Mostly Clear",
        "SC": "Partly Cloudy",
        "BK": "Mostly Cloudy",
        "OV": "Cloudy"
    }
    
    var coverage_dict = {
        "AR": "Areas of",
        "BR": "Brief",
        "C": "Chance of",
        "D": "Definite",
        "FQ": "Frequent",
        "IN": "Intermittent",
        "IS": "Isolated",
        "L": "Likely",
        "NM": "Numerous",
        "O": "Occasional",
        "PA": "Patchy",
        "PD": "Periods of",
        "S": "Slight Chance of",
        "SC": "Scattered",
        "VC": "In the Vicinity",
        "WD": "Widespread"
    }
    
    var intensity_dict = {
        "VL": "Very Light",
        "L": "Light",
        "H": "Heavy",
        "VH": "Very Heavy"
    }
    
    var weather_dict = {
        "A": "Hail",
        "BD": "Blowing Dust",
        "BN": "Blowing Sand",
        "BR": "Mist",
        "BS": "Blowing Snow",
        "BY": "Blowing Spray",
        "F": "Fog",
        "FR": "Frost",
        "H": "Haze",
        "IC": "Ice Crystals",
        "IF": "Ice Fog",
        "IP": "Sleet",
        "K": "Smoke",
        "L": "Drizzle",
        "R": "Rain",
        "RW": "Rain Showers",
        "RS": "Rain/Snow Mix",
        "SI": "Snow/Sleet Mix",
        "WM": "Wintry Mix",
        "S": "Snow",
        "SW": "Snow Showers",
        "T": "Thunderstorms",
        "UP": "Unknown Precipitation",
        "VA": "Volcanic Ash",
        "WP": "Waterspouts",
        "ZF": "Freezing Fog",
        "ZL": "Freezing Drizzle",
        "ZR": "Freezing Rain",
        "ZY": "Freezing Spray"
    }
    
    // Check if the weather_code is in the cloud_dict and use that if it's there. If not then it's a combined weather code.
    if ( cloud_dict.hasOwnProperty( weather_code ) ) { 
        return cloud_dict[weather_code];
    } else {
        // Add the coverage if it's present, and full observation forecast is requested
        if ( ( coverage_code ) && ( full_observation ) ) {
            output += coverage_dict[coverage_code] + " ";
        }
        // Add the intensity if it's present
        if ( intensity_code ) {
            output += intensity_dict[intensity_code] + " ";
        }
        // Weather output
        output += weather_dict[weather_code];
    }
    
    return output;
}

function aeris_coded_alerts( data, full_observation = false ) {
    // https://www.aerisweather.com/support/docs/aeris-maps/reference/alert-types/
    
    var alert_dict = {
        "TOE": "911 Telephone Outage",
        "ADR": "Administrative Message",
        "AQA": "Air Quality Alert",
        "AQ.S": "Air Quality Alert",
        "AS.Y": "Air Stagnation Advisory",
        "AR.W": "Arctic Outflow Warning",
        "AF.Y": "Ashfall Advisory",
        "MH.Y": "Ashfall Advisory",
        "AF.W": "Ashfall Warning",
        "AVW": "Avalanche Warning",
        "AVA": "Avalanche Watch",
        "BH.S": "Beach Hazard Statement",
        "BZ.W": "Blizzard Warning",
        "DU.Y": "Blowing Dust Advisory",
        "BS.Y": "Blowing Snow Advisory",
        "BW.Y": "Brisk Wind Advisory",
        "CAE": "Child Abduction Emergency",
        "CDW": "Civil Danger Warning",
        "CEM": "Civil Emergency Message",
        "CF.Y": "Coastal Flood Advisory",
        "CF.S": "Coastal Flood Statement",
        "CF.W": "Coastal Flood Warning",
        "CF.A": "Coastal Flood Watch",
        "FG.Y": "Dense Fog Advisory",
        "MF.Y": "Dense Fog Advisory",
        "SM.Y": "Dense Smoke Advisory",
        "MS.Y": "Dense Smoke Advisory",
        "DS.W": "Dust Storm Warning",
        "EQW": "Earthquake Warning",
        "EVI": "Evacuation - Immediate",
        "EH.W": "Excessive Heat Warning",
        "EH.A": "Excessive Heat Watch",
        "EC.W": "Extreme Cold Warning",
        "EC.A": "Extreme Cold Watch",
        "RFD": "Extreme Fire Danger",
        "EW.W": "Extreme Wind Warning",
        "FRW": "Fire Warning",
        "FW.A": "Fire Weather Watch",
        "FF.S": "Flash Flood Statement",
        "FF.W": "Flash Flood Warning",
        "FF.A": "Flash Flood Watch",
        "FE.W": "Flash Freeze Warning",
        "FL.Y": "Flood Advisory",
        "FL.S": "Flood Statement",
        "FL.W": "Flood Warning",
        "FA.W": "Flood Warning",
        "FL.A": "Flood Watch",
        "FA.A": "Flood Watch",
        "FZ.W": "Freeze Warning",
        "FZ.A": "Freeze Watch",
        "ZL.Y": "Freezing Drizzle Advisory",
        "ZF.Y": "Freezing Fog Advisory",
        "ZR.W": "Freezing Rain Warning",
        "UP.Y": "Freezing Spray Advisory",
        "FR.Y": "Frost Advisory",
        "GL.W": "Gale Warning",
        "GL.A": "Gale Watch",
        "HZ.W": "Hard Freeze Warning",
        "HZ.A": "Hard Freeze Watch",
        "HMW": "Hazardous Materials Warning",
        "SE.W": "Hazardous Seas Warning",
        "SE.A": "Hazardous Seas Watch",
        "HWO": "Hazardous Weather Outlook",
        "HT.Y": "Heat Advisory",
        "HT.W": "Heat Warning",
        "UP.W": "Heavy Freezing Spray Warning",
        "UP.A": "Heavy Freezing Spray Watch",
        "SU.Y": "High Surf Advisory",
        "SU.W": "High Surf Warning",
        "HW.W": "High Wind Warning",
        "HW.A": "High Wind Watch",
        "HF.W": "Hurricane Force Wind Warning",
        "HF.A": "Hurricane Force Wind Watch",
        "HU.S": "Hurricane Local Statement",
        "HU.W": "Hurricane Warning",
        "HU.A": "Hurricane Watch",
        "FA.Y": "Hydrologic Advisory",
        "IS.W": "Ice Storm Warning",
        "LE.W": "Lake Effect Snow Warning",
        "LW.Y": "Lake Wind Advisory",
        "LS.Y": "Lakeshore Flood Advisory",
        "LS.S": "Lakeshore Flood Statement",
        "LS.W": "Lakeshore Flood Warning",
        "LS.A": "Lakeshore Flood Watch",
        "LEW": "Law Enforcement Warning",
        "LAE": "Local Area Emergency",
        "LO.Y": "Low Water Advisory",
        "MA.S": "Marine Weather Statement",
        "NUW": "Nuclear Power Plant Warning",
        "RHW": "Radiological Hazard Warning",
        "RA.W": "Rainfall Warning",
        "FW.W": "Red Flag Warning",
        "RFW": "Red Flag Warning",
        "RP.S": "Rip Current Statement",
        "SV.W": "Severe Thunderstorm Warning",
        "SV.A": "Severe Thunderstorm Watch",
        "SV.S": "Severe Weather Statement",
        "TO.S": "Severe Weather Statement",
        "SPW": "Shelter In Place Warning",
        "NOW": "Short Term Forecast",
        "SC.Y": "Small Craft Advisory",
        "SW.Y": "Small Craft Advisory For Hazadous Seas",
        "RB.Y": "Small Craft Advisory for Rough Bar",
        "SI.Y": "Small Craft Advisory for Winds",
        "SO.W": "Smog Warning",
        "SQ.W": "Snow Squall Warning",
        "SQ.A": "Snow Squall Watch",
        "SB.Y": "Snow and Blowing Snow Advisory",
        "SN.W": "Snowfall Warning",
        "MA.W": "Special Marine Warning",
        "SPS": "Special Weather Statement",
        "SG.W": "Storm Surge Warning",
        "SS.W": "Storm Surge Warning",
        "SS.A": "Storm Surge Watch",
        "SR.W": "Storm Warning",
        "SR.A": "Storm Watch",
        "TO.W": "Tornado Warning",
        "TO.A": "Tornado Watch",
        "TC.S": "Tropical Cyclone Statement",
        "TR.S": "Tropical Storm Local Statement",
        "TR.W": "Tropical Storm Warning",
        "TR.A": "Tropical Storm Watch",
        "TS.Y": "Tsunami Advisory",
        "TS.W": "Tsunami Warning",
        "TS.A": "Tsunami Watch",
        "TY.S": "Typhoon Local Statement",
        "TY.W": "Typhoon Warning",
        "TY.A": "Typhoon Watch",
        "VOW": "Volcano Warning",
        "WX.Y": "Weather Advisory",
        "WX.W": "Weather Warning",
        "WI.Y": "Wind Advisory",
        "WC.Y": "Wind Chill Advisory",
        "WC.W": "Wind Chill Warning",
        "WC.A": "Wind Chill Watch",
        "WI.W": "Wind Warning",
        "WS.W": "Winter Storm Warning",
        "WS.A": "Winter Storm Watch",
        "LE.A": "Winter Storm Watch",
        "BZ.A": "Winter Storm Watch",
        "WW.Y": "Winter Weather Advisory",
        "LE.Y": "Winter Weather Advisory",
        "ZR.Y": "Winter Weather Advisory",
        "AW.WI.MN": "Minor Wind",
        "AW.WI.MD": "Moderate Wind",
        "AW.WI.SV": "Servere Wind",
        "AW.WI.EX": "Extreme Wind",
        "AW.SI.MN": "Minor Snow/Ice",
        "AW.SI.MD": "Moderate Snow/Ice",
        "AW.SI.SV": "Servere Snow/Ice",
        "AW.SI.EX": "Extreme Snow/Ice",
        "AW.TS.MN": "Minor Thunderstorm",
        "AW.TS.MD": "Moderate Thunderstorm",
        "AW.TS.SV": "Servere Thunderstorm",
        "AW.TS.EX": "Extreme Thunderstorm",
        "AW.LI.MN": "Minor Lightning",
        "AW.LI.MD": "Moderate Lightning",
        "AW.LI.SV": "Servere Lightning",
        "AW.LI.EX": "Extreme Lightning",
        "AW.FG.MN": "Minor Fog",
        "AW.FG.MD": "Moderate Fog",
        "AW.FG.SV": "Servere Fog",
        "AW.FG.EX": "Extreme Fog",
        "AW.HT.MN": "Minor High Temperature",
        "AW.HT.MD": "Moderate High Temperature",
        "AW.HT.SV": "Servere High Temperature",
        "AW.HT.EX": "Extreme High Temperature",
        "AW.LT.MN": "Minor Low Temperature",
        "AW.LT.MD": "Moderate Low Temperature",
        "AW.LT.SV": "Servere Low Temperature",
        "AW.LT.EX": "Extreme Low Temperature",
        "AW.CE.MN": "Minor Coastal Event",
        "AW.CE.MD": "Moderate Coastal Event",
        "AW.CE.SV": "Servere Coastal Event",
        "AW.CE.EX": "Extreme Coastal Event",
        "AW.FR.MN": "Minor Forest Fire",
        "AW.FR.MD": "Moderate Forest Fire",
        "AW.FR.SV": "Servere Forest Fire",
        "AW.FR.EX": "Extreme Forest Fire",
        "AW.AV.MN": "Minor Avalanche",
        "AW.AV.MD": "Moderate Avalanche",
        "AW.AV.SV": "Servere Avalanche",
        "AW.AV.EX": "Extreme Avalanche",
        "AW.RA.MN": "Minor Rainfall",
        "AW.RA.MD": "Moderate Rainfall",
        "AW.RA.SV": "Servere Rainfall",
        "AW.RA.EX": "Extreme Rainfall",
        "AW.FL.MN": "Minor Flooding",
        "AW.FL.MD": "Moderate Flooding",
        "AW.FL.SV": "Servere Flooding",
        "AW.FL.EX": "Extreme Flooding",
        "AW.RF.MN": "Minor Rain Flooding",
        "AW.RF.MD": "Moderate Rain Flooding",
        "AW.RF.SV": "Servere Rain Flooding",
        "AW.RF.EX": "Extreme Rain Flooding",
        "AW.UK.MN": "Minor Unknown",
        "AW.UK.MD": "Moderate Unknown",
        "AW.UK.SV": "Servere Unknown",
        "AW.UK.EX": "Extreme Unknown"
    }
 
    return alert_dict[data];
}

function aeris_icon( data ) {
    // https://www.aerisweather.com/support/docs/api/reference/icon-list/
    icon_name = data.split(".")[0]; // Remove .png
    
    var icon_dict = {
        "blizzard": "snow",
        "blizzardn": "snow",
        "blowingsnow": "snow",
        "blowingsnown": "snow",
        "clear": "clear-day",
        "clearn": "clear-night",
        "cloudy": "cloudy",
        "cloudyn": "cloudy",
        "cloudyw": "cloudy",
        "cloudywn": "cloudy",
        "cold": "clear-day",
        "coldn": "clear-night",
        "drizzle": "rain",
        "drizzlen": "rain",
        "dust": "fog",
        "dustn": "fog",
        "fair": "mostly-clear-day",
        "fairn": "mostly-clear-night",
        "drizzlef": "rain",
        "fdrizzlen": "rain",
        "flurries": "sleet",
        "flurriesn": "sleet",
        "flurriesw": "sleet",
        "flurrieswn": "sleet",
        "fog": "fog",
        "fogn": "fog",
        "freezingrain": "rain",
        "freezingrainn": "rain",
        "hazy": "fog",
        "hazyn": "fog",
        "hot": "clear-day",
        "N/A ": "unknown",
        "mcloudy": "mostly-cloudy-day",
        "mcloudyn": "mostly-cloudy-night",
        "mcloudyr": "rain",
        "mcloudyrn": "rain",
        "mcloudyrw": "rain",
        "mcloudyrwn": "rain",
        "mcloudys": "snow",
        "mcloudysn": "snow",
        "mcloudysf": "snow",
        "mcloudysfn": "snow",
        "mcloudysfw": "snow",
        "mcloudysfwn": "snow",
        "mcloudysw": "mostly-cloudy-day",
        "mcloudyswn": "mostly-cloudy-night",
        "mcloudyt": "thunderstorm",
        "mcloudytn": "thunderstorm",
        "mcloudytw": "thunderstorm",
        "mcloudytwn": "thunderstorm",
        "mcloudyw": "mostly-cloudy-day",
        "mcloudywn": "mostly-cloudy-night",
        "na": "unknown",
        "na": "unknown",
        "pcloudy": "partly-cloudy-day",
        "pcloudyn": "partly-cloudy-night",
        "pcloudyr": "rain",
        "pcloudyrn": "rain",
        "pcloudyrw": "rain",
        "pcloudyrwn": "rain",
        "pcloudys": "snow",
        "pcloudysn": "snow",
        "pcloudysf": "snow",
        "pcloudysfn": "snow",
        "pcloudysfw": "snow",
        "pcloudysfwn": "snow",
        "pcloudysw": "partly-cloudy-day",
        "pcloudyswn": "partly-cloudy-night",
        "pcloudyt": "thunderstorm",
        "pcloudytn": "thunderstorm",
        "pcloudytw": "thunderstorm",
        "pcloudytwn": "thunderstorm",
        "pcloudyw": "partly-cloudy-day",
        "pcloudywn": "partly-cloudy-night",
        "rain": "rain",
        "rainn": "rain",
        "rainandsnow": "rain",
        "rainandsnown": "rain",
        "raintosnow": "rain",
        "raintosnown": "rain",
        "rainw": "rain",
        "rainw": "rain",
        "showers": "rain",
        "showersn": "rain",
        "showersw": "rain",
        "showersw": "rain",
        "sleet": "sleet",
        "sleetn": "sleet",
        "sleetsnow": "sleet",
        "sleetsnown": "sleet",
        "smoke": "fog",
        "smoken": "fog",
        "snow": "snow",
        "snown": "snow",
        "snoww": "snow",
        "snowwn": "snow",
        "snowshowers": "snow",
        "snowshowersn": "snow",
        "snowshowersw": "snow",
        "snowshowerswn": "snow",
        "snowtorain": "snow",
        "snowtorainn": "snow",
        "sunny": "clear-day",
        "sunnyn": "clear-night",
        "sunnyw": "mostly-clear-day",
        "sunnywn": "mostly-clear-night",
        "tstorm": "thunderstorm",
        "tstormn": "thunderstorm",
        "tstorms": "thunderstorm",
        "tstormsn": "thunderstorm",
        "tstormsw": "thunderstorm",
        "tstormswn": "thunderstorm",
        "wind": "wind",
        "wind": "wind",
        "wintrymix": "sleet",
        "wintrymixn": "sleet"
    }
    
    return icon_dict[icon_name];    
}

function show_forcast_alert( data, forecast_provider ) {
    belchertown_debug("Forecast: Updating alert data for " + forecast_provider);
    var i, forecast_alert_modal, forecast_alerts;
    forecast_alert_modal = "";
    forecast_alerts = [];
    
    // Empty anything that's been appended to the modal from the previous run
    jQuery(".wx-stn-alert-text").empty();
    
    if ( forecast_provider == "darksky" ) {
        if ( data['alerts'] ) {
            for ( i = 0; i < data['alerts'].length; i++ ) { 
                forecast_alert_title = data['alerts'][i]['title'];
                forecast_alert_body = data['alerts'][i]['description'].replace(/\n/g, '<br>');
                forecast_alert_link = data['alerts'][i]['title'];
                forecast_alert_expires = moment.unix( data['alerts'][i]['expires'] ).utcOffset(-300.0).format( 'LLL' );
                forecast_alerts.push( { "title": forecast_alert_title, "body": forecast_alert_body, "link": forecast_alert_link, "expires": forecast_alert_expires });
            }
        }
    } else if ( forecast_provider == "aeris" ) {
        if ( data['alerts'][0]['response'][0] ) {
            for ( i = 0; i < data['alerts'][0]['response'].length; i++ ) {             
                //forecast_alert_title = data['alerts'][0]['response'][i]['details']['name'];
                forecast_alert_title = aeris_coded_alerts( data['alerts'][0]['response'][i]['details']['type'] );
                forecast_alert_body = data['alerts'][0]['response'][i]['details']['body'].replace(/\n/g, '<br>');
                //forecast_alert_link = data['alerts'][0]['response'][i]['details']['name'];
                forecast_alert_link = data['alerts'][0]['response'][i]['details']['type'];
                forecast_alert_expires = moment.unix( data['alerts'][0]['response'][i]['timestamps']['expires'] ).utcOffset(-300.0).format( 'LLL' );
                forecast_alerts.push( { "title": forecast_alert_title, "body": forecast_alert_body, "link": forecast_alert_link, "expires": forecast_alert_expires });
            }
        }
    }

    if ( forecast_alerts.length > 0 ) {
        belchertown_debug("Forecast: There are " + forecast_alerts.length + " alert(s).");
        for ( i = 0; i < forecast_alerts.length; i++ ) { 
            
            alert_link = "<i class='fa fa-exclamation-triangle'></i> <a href='#forecast-alert-"+i+"' data-toggle='modal' data-target='#forecast-alert-"+i+"'>" +forecast_alerts[i]["title"] + " in effect until " + forecast_alerts[i]["expires"] + "</a><br>";
            jQuery(".wx-stn-alert-text").append( alert_link );
            
            forecast_alert_modal += "<!-- Forecast Alert Modal "+i+" -->";
            forecast_alert_modal += "<div class='modal fade' id='forecast-alert-"+i+"' tabindex='-1' role='dialog' aria-labelledby='forecast-alert'>";
              forecast_alert_modal += "<div class='modal-dialog' role='document'>";
                forecast_alert_modal += "<div class='modal-content'>";
                  forecast_alert_modal += "<div class='modal-header'>";
                    forecast_alert_modal += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
                    forecast_alert_modal += "<h4 class='modal-title' id='forecast-alert'>" + forecast_alerts[i]["title"] + "</h4>";
                  forecast_alert_modal += "</div>";
                  forecast_alert_modal += "<div class='modal-body'>";
                    forecast_alert_modal += forecast_alerts[i]["body"];
                  forecast_alert_modal += "</div>";
                  forecast_alert_modal += "<div class='modal-footer'>";
                    forecast_alert_modal += "<button type='button' class='btn btn-primary' data-dismiss='modal'>Close</button>";
                  forecast_alert_modal += "</div>";
                forecast_alert_modal += "</div>";
              forecast_alert_modal += "</div>";
            forecast_alert_modal += "</div>";
            
            jQuery(".wx-stn-alert-text").append( forecast_alert_modal );
        }
        jQuery(".wx-stn-alert").show();
    } else {
        belchertown_debug("Forecast: There are no forecast alerts");
        jQuery(".wx-stn-alert").hide();
    }
}

function update_forecast_data( data ) {
    forecast_provider = "aeris";
    belchertown_debug("Forecast: Provider is " + forecast_provider);
    belchertown_debug("Forecast: Updating data");
    
    forecast_row = [];
    
    if ( forecast_provider == "N/A" ) {
        jQuery(".forecastrow").hide();
        belchertown_debug("Forecast: No provider, hiding forecastrow");
        return;
    } else if ( forecast_provider == "darksky" ) {
        
        var forecast_subtitle = moment.unix( data["currently"]["time"] ).utcOffset(-300.0).format( 'LLL' );

        // WX icon in temperature box
        if ( data['currently']['icon'] == "partly-cloudy-night" ) {
            // partly-cloudy-night could also be clear-day
            var wxicon = get_relative_url() + "/images/partly-cloudy-night.png";
        } else {
            var wxicon = get_relative_url() + "/images/" + data['currently']['icon'] + ".png";
        }
        belchertown_debug("Forecast: icon is " + wxicon);
        
        // Current observation text
        jQuery(".current-obs-text").html( data["currently"]["summary"] );

        // Visibility text in station observation table
        try {
            visibility_output = parseFloat(parseFloat(data["currently"]["visibility"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["visibility"], maximumFractionDigits: unit_rounding_array["visibility"]}) + " " + unit_label_array["visibility"];

            jQuery(".station-observations .visibility").html( visibility_output );
        } catch(err) {
            // Visibility not in the station observation table or any of the unit arrays, so silently exit
        }
    
        // Force 7 day forecast
        //for (i = 0; i < data["daily"]["data"].length; i++) {
        for (i = 0; i < 7; i++) {
            
            var weekday = moment.unix( data["daily"]["data"][i]["time"] + 7200 ).utcOffset(-300.0).format( "ddd M/DD" );
            
            if ( data['daily']['data'][i]['icon'] == "partly-cloudy-night" ) {
                var image_url = get_relative_url() + "/images/clear-day.png";
            } else { 
                var image_url = get_relative_url() + "/images/"+data['daily']['data'][i]['icon']+".png";
            }
            
            var condition_text = "";
            switch ( data["daily"]["data"][i]["icon"] ) {
                case "clear-day":
                    condition_text = "Clear"; // Clear
                    break;
                case "clear-night":
                    condition_text = "Clear"; // Clear
                    break;
                case "rain":
                    condition_text = "Rain"; // Rain
                    break;
                case "snow":
                    condition_text = "Snow"; // Snow
                    break;
                case "sleet":
                    condition_text = "Sleet"; // Sleet
                    break;
                case "wind":
                    condition_text = "Windy"; // Windy
                    break;
                case "fog":
                    condition_text = "Fog"; // Fog
                    break;
                case "cloudy":
                    condition_text = "Cloudy"; // Overcast
                    break;
                case "partly-cloudy-day":
                    condition_text = "Partly Cloudy"; // Partly Cloudy
                    break;
                case "partly-cloudy-night":
                    condition_text = "Clear"; // Clear - https://darksky.net/dev/docs/faq - So you can just treat partly-cloudy-night as an alias for clear-day.
                    break;
                case "hail":
                    condition_text = "Hail"; // Hail
                    break;
                case "thunderstorm":
                    condition_text = "Thunderstorms"; // Thunderstorm
                    break;
                case "tornado":
                    condition_text = "Tornado"; // Tornado
                    break;
            }
            
            if ( data["daily"]["data"][i].hasOwnProperty("precipType") && data["daily"]["data"][i]["precipType"] == "snow" ) {
                var snow_depth = data["daily"]["data"][i]["precipAccumulation"];
                var snow_unit = "in";
            } else if ( data["daily"]["data"][i].hasOwnProperty("precipType") && data["daily"]["data"][i]["precipType"] == "rain" ) {
                var precip = data["daily"]["data"][i]["precipProbability"] * 100;
            } else {
                var precip = 0;
                var snow_depth = 0;
                var snow_unit = "";
            }
            var darksky_link_units = data["flags"]["units"].toLowerCase().concat("12"); // Currently the DarkSky forecast link uses a "{unit}12" string in the URL.
            
            var forecast_link = '<a href="https://darksky.net/details/'+data["latitude"]+','+data["longitude"]+'/'+moment.unix( data["daily"]["data"][i]["time"] + 7200 ).utcOffset(-300.0).format( "YYYY-M-D" )+'/'+darksky_link_units+'/" target="_blank">Daily Forecast</a>';

            forecast_row.push( {
                    "weekday": weekday,
                    "image_url": image_url,
                    "condition_text": condition_text,
                    "minTemp": data["daily"]["data"][i]["temperatureLow"],
                    "maxTemp": data["daily"]["data"][i]["temperatureHigh"],
                    "windSpeed": data["daily"]["data"][i]["windSpeed"],
                    "windGust": data["daily"]["data"][i]["windGust"],
                    "snow_depth": snow_depth,
                    "snow_unit": snow_unit,
                    "precip": precip,
                    "forecast_link": forecast_link,
            
            } );
        }
    }
    
    if ( forecast_provider == "aeris" ) {
        var forecast_subtitle = moment.unix( data["timestamp"] ).utcOffset(-300.0).format( 'LLL' );
        
        try {
            belchertown_debug("Forecast: icon from Aeris data is " + data["current"][0]["response"]["ob"]["icon"] );
            var wxicon = get_relative_url() + "/images/" + aeris_icon( data["current"][0]["response"]["ob"]["icon"] ) + ".png";
            belchertown_debug("Forecast: Belchertown icon is " + wxicon);
            // Current observation text
            jQuery(".current-obs-text").html( aeris_coded_weather( data["current"][0]["response"]["ob"]["weatherPrimaryCoded"], true ) );
            
            // Visibility text in station observation table
            if ( ( "us" == "si" ) || ( "us" == "ca" ) ) {
                // si and ca = kilometer
                visibility = data["current"][0]["response"]["ob"]["visibilityKM"];
            } else {
                // us and uk2 and default = miles
                visibility = data["current"][0]["response"]["ob"]["visibilityMI"];
            }
            
            try {
                visibility_output = parseFloat(parseFloat( visibility )).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["visibility"], maximumFractionDigits: unit_rounding_array["visibility"]}) + " " + unit_label_array["visibility"];

                jQuery(".station-observations .visibility").html( visibility_output );
            } catch(err) {
                // Visibility not in the station observation table or any of the unit arrays, so silently exit
            }
        } catch(err) {
            // Probably a non-metar current observation, which does not have visibility, icon, conditions, etc. So silently exit.
        }
        
        for (i = 0; i < data["forecast"][0]["response"][0]["periods"].length; i++) {
            var image_url = get_relative_url() + "/images/" + aeris_icon( data["forecast"][0]["response"][0]["periods"][i]["icon"] ) + ".png";
            var condition_text = aeris_coded_weather( data["forecast"][0]["response"][0]["periods"][i]["weatherPrimaryCoded"], false );
            var weekday = moment.unix( data["forecast"][0]["response"][0]["periods"][i]["timestamp"] + 7200 ).utcOffset(-300.0).format( "ddd M/DD" );

            // Determine temperature units
            if ( ( "us" == "ca" ) || ( "us" == "uk2" ) || ( "us" == "si" ) ) {
                minTemp = data["forecast"][0]["response"][0]["periods"][i]["minTempC"];
                maxTemp = data["forecast"][0]["response"][0]["periods"][i]["maxTempC"];
            } else {
                // Default
                minTemp = data["forecast"][0]["response"][0]["periods"][i]["minTempF"];
                maxTemp = data["forecast"][0]["response"][0]["periods"][i]["maxTempF"];
            }
            
            // Determine wind units
            if ( "us" == "ca" ) {
                // ca = kph
                windSpeed = data["forecast"][0]["response"][0]["periods"][i]["windSpeedKPH"];
                windGust = data["forecast"][0]["response"][0]["periods"][i]["windGustKPH"];
            } else if ( "us" == "si" ) {
                // si = meters per second. MPS is KPH / 3.6
                windSpeed = data["forecast"][0]["response"][0]["periods"][i]["windSpeedKPH"] / 3.6;
                windGust = data["forecast"][0]["response"][0]["periods"][i]["windGustKPH"] / 3.6;
            } else {
                // us and uk2 and default = mph
                windSpeed = data["forecast"][0]["response"][0]["periods"][i]["windSpeedMPH"];
                windGust = data["forecast"][0]["response"][0]["periods"][i]["windGustMPH"];
            }
            
            if ( ( data["forecast"][0]["response"][0]["periods"][i]["snowCM"] > 0 ) || ( data["forecast"][0]["response"][0]["periods"][i]["snowIN"] > 0 ) ) {
                // Determine snow unit
                if ( ( "us" == "si" ) || ( "us" == "ca" ) || ( "us" == "uk2" ) ) {
                    snow_depth = data["forecast"][0]["response"][0]["periods"][i]["snowCM"];
                    snow_unit = "cm";
                } else {
                    snow_depth = data["forecast"][0]["response"][0]["periods"][i]["snowIN"];
                    snow_unit = "in";
                }
            } else if ( data["forecast"][0]["response"][0]["periods"][i]["pop"] > 0 ) {
                // Rain percent of precip
                precip = data["forecast"][0]["response"][0]["periods"][i]["pop"];
            } else {
                precip = 0;
                snow_depth = 0;
                snow_unit = "";
            }
            
            var forecast_link_setup = "".replace("YYYY", moment.unix( data["forecast"][0]["response"][0]["periods"][i]["timestamp"] + 7200 ).utcOffset(-300.0).format( "YYYY" )).replace("MM", moment.unix( data["forecast"][0]["response"][0]["periods"][i]["timestamp"] + 7200 ).utcOffset(-300.0).format( "MM" )).replace("DD", moment.unix( data["forecast"][0]["response"][0]["periods"][i]["timestamp"] + 7200 ).utcOffset(-300.0).format( "DD" ));
            var forecast_link = '<a href="'+forecast_link_setup+'" target="_blank">Daily Forecast</a>';
            
            forecast_row.push( {
                    "weekday": weekday,
                    "image_url": image_url,
                    "condition_text": condition_text,
                    "minTemp": minTemp,
                    "maxTemp": maxTemp,
                    "windSpeed": windSpeed,
                    "windGust": windGust,
                    "snow_depth": snow_depth,
                    "snow_unit": snow_unit,
                    "precip": precip,
                    "forecast_link": forecast_link
            
            } );
        }
    }

    // WX icon in temperature box    
    jQuery("#wxicon").attr( "src", wxicon );
    belchertown_debug("Forecast: Changing icon to " + wxicon);

    // Build daily forecast row
    var output_html = "";
    for (i = 0; i < forecast_row.length; i++) {
        if ( i == 0 ) {
            output_html += '<div class="col-sm-1-5 forecast-day forecast-today">';
        } else {
            output_html += '<div class="col-sm-1-5 forecast-day border-left">';
        }
        // Add 7200 (2 hours) to the epoch to get an hour well into the day to avoid any DST issues. This way it'll either be 1am or 2am. Without it, we get 12am or 11pm (the previous day).
        output_html += '<span id="weekday">'+forecast_row[i]["weekday"]+'</span>';
        output_html += '<br>';
        output_html += '<div class="forecast-conditions">';
        output_html += '<img id="icon" src="'+forecast_row[i]["image_url"]+'">';
        output_html += '<span class="forecast-condition-text">'+forecast_row[i]["condition_text"]+'</span>';
        output_html += '</div>';
        output_html += '<span class="forecast-high">'+ parseFloat( forecast_row[i]["maxTemp"] ).toFixed(0) +'&deg;</span> | <span class="forecast-low">'+ parseFloat( forecast_row[i]["minTemp"] ).toFixed(0) +'&deg;</span>';
        output_html += '<br>';
        output_html += '<div class="forecast-precip">';
        if ( forecast_row[i]["snow_depth"] > 0 ) {
            output_html += '<div class="snow-precip">';
            output_html += '<img src="'+get_relative_url()+'/images/snowflake-icon-15px.png"> <span>'+ parseFloat( forecast_row[i]["snow_depth"] ).toFixed(0) +'<span> ' + forecast_row[i]["snow_unit"];
            output_html += '</div>';
        } else if ( forecast_row[i]["precip"] > 0 ) {
            output_html += '<i class="wi wi-raindrop wi-rotate-45 rain-precip"></i> <span>'+ parseFloat( forecast_row[i]["precip"] ).toFixed(0) +'%</span>';
        } else {
            output_html += '<i class="wi wi-raindrop wi-rotate-45 rain-no-precip"></i> <span>0%</span>';
        }
        output_html += '</div>';
        output_html += '<div class="forecast-wind">';
        output_html += '<i class="wi wi-strong-wind"></i> <span>'+ parseFloat( forecast_row[i]["windSpeed"] ).toFixed(0) +'</span> | <span> '+ parseFloat( forecast_row[i]["windGust"] ).toFixed(0) +' mph';        
        output_html += '</div>';
        output_html += '</div>';
    }
    
    // Show the forecast row
    jQuery(".forecast-subtitle").html( "Last Updated on " + forecast_subtitle );
    jQuery(".forecasts").html( output_html );
    
    // Show weather alert
    show_forcast_alert( data, forecast_provider );
    
}

//============================================//
// Live website using MQTT Websockets enabled //
//============================================//

var mqttConnected = false;

function ajaximages(section=false, reload_timer_interval_seconds=false) {
    // This function only runs if the elements have an img src.
    // Update images within the specific section
    if ( section ) {
        if ( section == "radar" ) {
            belchertown_debug("Updating radar image");
            // Reload images
            if ( document.querySelectorAll(".radar-map img").length > 0 ) {
                var radar_img = document.querySelectorAll(".radar-map img")[0].src;
                var new_radar_img = radar_img + "&t=" + Math.floor(Math.random() * 999999999);
                document.querySelectorAll(".radar-map img")[0].src = new_radar_img;
                //var radar_html = jQuery('.radar-map').children('img').attr('src').split('?')[0] // Get the img src and remove everything after "?" so we don't stack ?'s onto the image during updates
                //jQuery('.radar-map').children('img').attr('src', radar_html + "?" + Math.floor(Math.random() * 999999999));
            }
            // Reload iframe - https://stackoverflow.com/a/4249946/1177153
            if ( document.querySelectorAll(".radar-map iframe").length > 0 ) {
                jQuery(".radar-map iframe").each(function(){
                    jQuery(this).attr( 'src', function ( i, val ) { return val; });
                });
            }
        } else {
            belchertown_debug("Updating " + section + " images");
            // Reload images
            jQuery('.'+section+' img').each(function(){
                new_image_url = jQuery(this).attr('src').split('?')[0] + "?" + Math.floor(Math.random() * 999999999);
                jQuery(this).attr('src', new_image_url);
            });
            // Reload iframes
            jQuery('.'+section+' iframe').each(function(){
                jQuery(this).attr( 'src', function ( i, val ) { return val; });
            });
        }
        // Set the new timer
        if ( reload_timer_interval_seconds ) {
            var reload_timer_ms = reload_timer_interval_seconds * 1000; // convert to millis
            setTimeout(function() { ajaximages(section, reload_timer_interval_seconds); }, reload_timer_ms);
        }
    }
}

var reconnect_using_inactive_timestamp = false;
var inactive_timestamp = "";

// MQTT connect
function connect() {
    belchertown_debug( "MQTT: Connecting to MQTT Websockets: 192.168.86.33 9001 (SSL Disabled)" );
    if ( reconnect_using_inactive_timestamp ) {
        updated = moment.unix( inactive_timestamp ).utcOffset( -300.0 ).format( "LL, LTS" );
    } else { 
        updated = moment.unix( "1614021900" ).utcOffset( -300.0 ).format( "LL, LTS" );
    }
    reported = "Connecting to weather station real time data. Last Updated " + updated;
    jQuery(".updated").html( reported );
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").hide();
    jQuery(".loadingMarker").show();
    
    client = new Paho.Client("192.168.86.33", 9001, mqttclient);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
        useSSL: false,
        reconnect: true,
        onSuccess:onConnect,
        onFailure:onFailure
      }
    client.connect( options );
}

// MQTT connect callback
function onConnect() {
    mqttConnected = true;
    belchertown_debug( "MQTT: MQTT Connected. Subscribing." );
    if ( reconnect_using_inactive_timestamp ) {
        updated = moment.unix( inactive_timestamp ).utcOffset( -300.0 ).format( "LL, LTS" );
    } else { 
        updated = moment.unix( "1614021900" ).utcOffset( -300.0 ).format( "LL, LTS" );
    }
    if ( pageName == "pi" ) {
        reported = "Connecting. Last Updated " + updated;
    } else {
        reported = "Connected. Waiting for data. Last Updated " + updated;
    }
    jQuery(".updated").html( reported );
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").hide();
    jQuery(".loadingMarker").show();            
    client.subscribe( "weather/loop" );
    if ( getURLvar("stayconnected") && ( getURLvar("stayconnected") == "true" || getURLvar("stayconnected") == "1" ) ) {
        belchertown_debug("stayconnected URL var found: ignoring disconnect_live_website_visitor value");
    } else {
        if ( pageName != "pi" ) {
            var activityTimeout = setTimeout( inactive, 1800000 ); // Stop automatic ajax refresh
        }
    }
}

// MQTT Failure
function onFailure() {
    mqttConnected = false;
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").show();
    jQuery(".loadingMarker").hide();
    var d = new Date();
    epoch = parseFloat( (d / 1000) ).toFixed(0); // Convert millis to seconds
    if ( client.isConnected() ) {
        updated = moment.unix( epoch ).utcOffset( -300.0 ).format( "LL, LTS" );
    } else {
        updated = moment.unix( "1614021900" ).utcOffset( -300.0 ).format( "LL, LTS" );
    }
    jQuery(".updated").html( "Failed connecting to the weather station. Please try again later! Last Updated " + updated );
    console.log( "MQTT: " + moment.unix( epoch ).utcOffset( -300.0 ).format() + ": Cannot connect to MQTT broker" );
}

// MQTT connection lost
function onConnectionLost(responseObject) {
    mqttConnected = false;
    jQuery(".onlineMarker").hide();
    jQuery(".offlineMarker").show();
    jQuery(".loadingMarker").hide();
    var d = new Date();
    epoch = parseFloat( (d / 1000) ).toFixed(0);  // Convert millis to seconds
    if ( client.isConnected() ) {
        updated = moment.unix( epoch ).utcOffset( -300.0 ).format( "LL, LTS" );
    } else {
        updated = moment.unix( "1614021900" ).utcOffset( -300.0 ).format( "LL, LTS" );
    }
    jQuery(".updated").html( "Lost connection to the weather station. Please try again later! Last Updated " + updated );
    if (responseObject.errorCode !== 0) {
        console.log( "MQTT: " + moment.unix( epoch ).utcOffset( -300.0 ).format() + ": mqtt Connection Lost: "+responseObject.errorMessage );
    }
}

function inactive() {
    client.disconnect(); // Disconnect mqtt
    belchertown_debug( "MQTT: Inactive timer expired. MQTT Disconnected" );
    jQuery(".onlineMarker").hide(); // Hide online beacon
    jQuery(".offlineMarker").show(); // Show offline beacon
    jQuery(".loadingMarker").hide(); // Hide loading beacon
    var d = new Date();
    epoch = parseFloat( (d / 1000) ).toFixed(0);  // Convert millis to seconds
    updated = moment.unix( epoch ).utcOffset( -300.0 ).format( "LL, LTS" );
    jQuery(".updated").html( "Live updates have stopped. Last Updated " + updated + " <button type='button' class='btn btn-primary restart-interval'>Continue live updates</button>" );
    reconnect_using_inactive_timestamp = true; // Set a flag to use the inactive timestamp in case we reconnect we have the latest last updated time
    inactive_timestamp = epoch; // Store this timestamp in case we reconnect
}

// New message from mqtt, process it
function onMessageArrived(message) {
    belchertown_debug( "MQTT: " + message.payloadString );
    update_current_wx( message.payloadString );
}

// Handle MQTT message
function update_current_wx(data) {
    data = jQuery.parseJSON( data );
    
    
    // This message is a weewx archive update. Update weewx data, forecast data and highcharts graphs
    if ( data.hasOwnProperty("interval_minute") ) {
        // Delays are recommended to allow the other skins to complete processing
        belchertown_debug( "MQTT: MQTT message indicates this is an archive interval." );
        if ( pageName != "pi" ) {
            setTimeout( showChart, 30000, homepage_graphgroup ); // Load updated charts. 
        }
        setTimeout( ajaxweewx, 10000 ); // Update weewx data
        setTimeout( ajaxforecast, 10000 ); // Update forecast data
        setTimeout( ajaximages, 10000 ); // Update radar and home page hook "img src" if present
    } else {
        // Only show the updated time on non-archive packets
        epoch = parseFloat( data["dateTime"] ).toFixed(0);
        updated = moment.unix(epoch).utcOffset(-300.0).format("LL, LTS");
        if ( pageName == "pi" ) {
            updated_text = "Connected. Received " + updated;
        } else {
            updated_text = "Connected to weather station live. Data received " + updated;
        }
        jQuery(".updated").html( updated_text );
    }
    // If we're in this function, show the online beacon and hide the others
    jQuery(".onlineMarker").show(); // Show the online beacon
    jQuery(".offlineMarker").hide();
    jQuery(".loadingMarker").hide();
    
    // Update the station observation box elements
    station_mqtt_data = Object.keys(data); // Turn data (mqtt message) into an object we can forEach
    // Get all span elements within the table. This is setup by Python initially
    jQuery('.station-observations').find("span").each(function () {
        // The class name is the same as the Extras.station_observations name (weewx schema)
        thisElementClass = jQuery(this).attr("class")
        // Loop through each MQTT payload item
        station_mqtt_data.forEach( mqttdata => {
            if ( thisElementClass == "rainWithRainRate" ) {
                // Force dayRain since that's the MQTT payload name
                thisElementClass = "dayRain";
            }
            if ( thisElementClass == "barometer" || thisElementClass == "pressure" || thisElementClass == "altimeter" || thisElementClass == "cloudbase" ) {
                // Do not group number into thousands,hundreds format
                localeStringUseGrouping = false;
            } else {
                localeStringUseGrouping  = true;
            }
            // If this MQTT payload key begins with the name of the span class name, update the info. Can also use mqttdata.includes(thisElementClass) if weewx-mqtt changes in future
            if ( mqttdata.startsWith(thisElementClass) ) {
                html_output = parseFloat(parseFloat(data[mqttdata])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array[thisElementClass], maximumFractionDigits: unit_rounding_array[thisElementClass], useGrouping: localeStringUseGrouping}) + unit_label_array[thisElementClass];
                
                // Finally update the element class
                jQuery("." + thisElementClass).html( html_output );
            }
        });  
    });
    // End dynamic station observation box

    // Temperature F
    if ( data.hasOwnProperty("outTemp_F") ) {
        // Inside parseFloat converts str to int. Outside parseFloat processes the locale string
        // Help from: https://stackoverflow.com/a/40152286/1177153 and https://stackoverflow.com/a/31581206/1177153
        outTemp = parseFloat(parseFloat(data["outTemp_F"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]});
        get_outTemp_color( "degree_F", outTemp );
        jQuery(".outtemp").html( outTemp );
    
        // Feels like temp as defined by NOAA's "Apparent Temperature" at: http://www.nws.noaa.gov/ndfd/definitions.htm
        //if ( data["outTemp_F"] <= 50 ) {
        //    jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["windchill_F"])).toLocaleString("en-US", {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "  &#176;F" );
        //} else if ( data["outTemp_F"] >= 80 ) {
        //    jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["heatindex_F"])).toLocaleString("en-US", {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "  &#176;F" );
        //} else {
        //    jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["outTemp_F"])).toLocaleString("en-US", {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "  &#176;F" );
        //}
    }
    
    // Temperature C
    if ( data.hasOwnProperty("outTemp_C") ) {
        outTemp = parseFloat(parseFloat(data["outTemp_C"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]});
        get_outTemp_color( "degree_C", outTemp );
        jQuery(".outtemp").html( outTemp );
    }
    
    // Apparent Temperature US
    if ( data.hasOwnProperty("appTemp_F") ) {
        jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["appTemp_F"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]}) + "  &#176;F" ); 
    }

    // Apparent Temperature Metric
    if ( data.hasOwnProperty("appTemp_C") ) {
        jQuery(".feelslike").html( "Feels like: " + parseFloat(parseFloat(data["appTemp_C"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["outTemp"], maximumFractionDigits: unit_rounding_array["outTemp"]}) + "  &#176;F" );
    }
    
    // Wind
    if ( data.hasOwnProperty("windDir") ) {
        // No toLocaleString() here since there is no float decimal needed.
        rotateThis( data["windDir"] );
        //jQuery(".wind-arrow").css( "transform", "rotate(" + data["windDir"] + "deg)" );
        jQuery(".curwinddeg").html( parseFloat( data["windDir"] ).toFixed(0) + "&deg;" );
        jQuery(".curwinddir").html( highcharts_tooltip_factory( parseFloat( data["windDir"] ).toFixed(0), "windDir" ) );
    }
    // Windspeed US
    if ( data.hasOwnProperty("windSpeed_mph") ) {
        jQuery(".curwindspeed").html( parseFloat(parseFloat(data["windSpeed_mph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}) );
    }
    // Windspeed Metric
    if ( data.hasOwnProperty("windSpeed_kph") ) {
        jQuery(".curwindspeed").html( parseFloat(parseFloat(data["windSpeed_kph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}) );
    }
    // Windspeed METRICWX
    if ( data.hasOwnProperty("windSpeed_mps") ) {
        jQuery(".curwindspeed").html( parseFloat(parseFloat(data["windSpeed_mps"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windSpeed"], maximumFractionDigits: unit_rounding_array["windSpeed"]}) );
    }
    
    // Wind Gust US
    // May not be provided in mqtt, but just in case.
    if ( data.hasOwnProperty("windGust_mph") ) {
        jQuery(".curwindgust").html( parseFloat(parseFloat(data["windGust_mph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windGust"], maximumFractionDigits: unit_rounding_array["windGust"]}) );
    }
    // Wind Gust Metric
    if ( data.hasOwnProperty("windGust_kph") ) {
        jQuery(".curwindgust").html( parseFloat(parseFloat(data["windGust_kph"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windGust"], maximumFractionDigits: unit_rounding_array["windGust"]}) );
    }
    // Wind Gust METRICWX
    if ( data.hasOwnProperty("windGust_mps") ) {
        jQuery(".curwindgust").html( parseFloat(parseFloat(data["windGust_mps"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windGust"], maximumFractionDigits: unit_rounding_array["windGust"]}) );
    }
    
    // Windchill US
    if ( data.hasOwnProperty("windchill") ) {
        jQuery(".curwindchill").html( parseFloat(parseFloat(data["windchill"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windchill"], maximumFractionDigits: unit_rounding_array["windchill"]}) + " &#176;F" );
    }
    // Windchill Metric
    if ( data.hasOwnProperty("windchill_C") ) {
        jQuery(".curwindchill").html( parseFloat(parseFloat(data["windchill_C"])).toLocaleString("en-US", {minimumFractionDigits: unit_rounding_array["windchill"], maximumFractionDigits: unit_rounding_array["windchill"]}) + " &#176;F" );
    }
};


Highcharts.setOptions({
    global: {
        //useUTC: false
        timezoneOffset: 300.0
    },
    lang: {
        decimalPoint: ".",
        thousandsSep: ","
    }
});

function showChart(json_file, prepend_renderTo=false) {

    // Relative URL by finding what page we're on currently.
    jQuery.getJSON(get_relative_url() + '/json/' + json_file + '.json', function(data) {
        
        // Loop through each chart name (e.g. chart1, chart2, chart3)
        jQuery.each(data, function (plotname, obsname) {
            var observation_type = undefined;
            
            // Ignore the Belchertown Version since this "plot" has no other options
            if ( plotname == "belchertown_version" ) {
                return true;
            }

            // Ignore the generated timestamp since this "plot" has no other options
            if ( plotname == "generated_timestamp" ) {
                return true;
            }
            
            // Ignore the chartgroup_title since this "plot" has no other options
            if ( plotname == "chartgroup_title" ) {
                return true;
            }
            
            // Set the chart's tooltip date time format, then return since this "plot" has no other options
            if ( plotname == "tooltip_date_format" ) {
                tooltip_date_format = obsname;
                return true;
            }            
            
            // Set the chart colors, then return right away since this "plot" has no other options
            if ( plotname == "colors" ) { 
                colors = obsname.split(","); 
                return true;
            }

            // Set the chart credits, then return right away since this "plot" has no other options
            if ( plotname == "credits" ) {
                credits = obsname.split(",")[0];
                return true;
            }

            // Set the chart credits url, then return right away since this "plot" has no other options
            if ( plotname == "credits_url" ) {
                credits_url = obsname.split(",")[0];
                return true;
            }

            // Set the chart credits position, then return right away since this "plot" has no other options
            if ( plotname == "credits_position" ) {
                credits_position = obsname;
                return true;
            }

            // Loop through each chart options
            jQuery.each(data[plotname]["options"], function (optionName, optionVal) {
                switch(optionName) {
                    case "type":
                        type = optionVal;
                        break;
                    case "renderTo":
                        renderTo = optionVal;
                        break;
                    case "title":
                        title = optionVal;
                        break;
                    case "subtitle":
                        subtitle = optionVal;
                        break;
                    case "yAxis_label":
                        yAxis_label = optionVal;
                        break;
                    case "chart_group":
                        chart_group = optionVal;
                        break;
                    case "gapsize":
                        gapsize = optionVal;
                        break; 
                    case "connectNulls":
                        connectNulls = optionVal;
                        break;
                    case "rounding":
                        rounding = optionVal;
                        break;
                    case "xAxis_categories":
                        xAxis_categories = optionVal;
                        break;
                    case "plot_tooltip_date_format":
                        plot_tooltip_date_format = optionVal;
                        break;
                    case "css_class":
                        css_class = optionVal;
                        break;
                    case "css_height":
                        css_height = optionVal;
                        break;
                    case "css_width":
                        css_width = optionVal;
                        break;
                    case "legend":
                        legend_enabled = optionVal;
                        break;
                    case "exporting":
                        exporting_enabled = optionVal;
                        break;
                }
            });
            
            // Handle any per-chart date time format override
            if ( typeof plot_tooltip_date_format !== "undefined" ) {
                var tooltip_date_format = plot_tooltip_date_format;
            }
            
            var options = {
                chart: {
                    renderTo: '',
                    spacing: [5, 10, 10, 0],
                    type: '',
                    zoomType: 'x'
                },
                
                exporting: {
                    enabled: JSON.parse( String( exporting_enabled ) ) // Convert string to bool
                },

                title: {
                    useHTML: true,
                    text: ''
                },

                subtitle: {
                    text: ''
                },

                legend: {
                    enabled: JSON.parse( String( legend_enabled ) ) // Convert string to bool
                },

                xAxis: {
                    dateTimeLabelFormats: {
                        day: '%e %b',
                        week: '%e %b',
                        month: '%b %y',
                    },
                    lineColor: '#555',
                    minRange: 900000,
                    minTickInterval: 900000,
                    title: {
                        style: {
                            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    },
                    ordinal: false,
                    type: 'datetime'
                },

                yAxis: [{
                    endOnTick: true,
                    lineColor: '#555',
                    minorGridLineWidth: 0,
                    startOnTick: true,
                    showLastLabel: true,
                    title: {
                    },
                    opposite: false
                }],

                plotOptions: {
                    area: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                        threshold: null,
                        softThreshold: true
                    },
                    line: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                    },
                    spline: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                    },
                    areaspline: {
                        lineWidth: 2,
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            enabled: false,
                            radius: 2
                        },
                        threshold: null,
                        softThreshold: true
                    },
                    scatter: {
                        gapSize: '',
                        gapUnit: 'value',
                        marker: {
                            radius: 2
                        },
                    },
                },
                
                // Highstock is needed for gapsize. Disable these 3 to make it look like standard Highcharts
                scrollbar: {
                    enabled: false
                },
                navigator: {
                    enabled: false
                },
                rangeSelector: {
                    enabled: false
                },

                tooltip: {
                    enabled: true,
                    crosshairs: true,
                    dateTimeLabelFormats: {
                        hour: '%e %b %H:%M'
                    },
                    // For locale control with moment.js
                    formatter: function (tooltip) {
                                    try {
                                        // The first returned item is the header, subsequent items are the points.
                                        // Mostly applies to line style charts (line, spline, area)
                                        return [moment.unix( this.x / 1000).utcOffset(-300.0).format( tooltip_date_format )].concat(
                                            this.points.map(function (point) {
                                                // If observation_type is in the series array, use that otherwise use the obsType
                                                var point_obsType = point.series.userOptions.observation_type ? point.series.userOptions.observation_type : point.series.userOptions.obsType;
                                                var rounding = point.series.userOptions.rounding;
                                                var mirrored = point.series.userOptions.mirrored_value;
                                                var numberFormat = point.series.userOptions.numberFormat ? point.series.userOptions.numberFormat : "";
                                                return "<span style='color:" + point.series.color + "'>\u25CF</span> " + point.series.name + ': ' + highcharts_tooltip_factory( point.y, point_obsType, true, rounding, mirrored, numberFormat );
                                            })
                                        );
                                    } catch(e) {
                                        // There's an error so check if it's windDir to apply wind direction label, or if it's a scatter. If none of those revert back to default tooltip.
                                        if (this.series.userOptions.obsType == "windDir" || this.series.userOptions.observation_type == "windDir") {
                                            // If observation_type is in the series array, use that otherwise use the obsType
                                            var point_obsType = this.series.userOptions.observation_type ? this.series.userOptions.observation_type : this.series.userOptions.obsType;
                                            var rounding = this.series.userOptions.rounding;
                                            var mirrored = this.series.userOptions.mirrored_value;
                                            return moment.unix( this.x / 1000).utcOffset(-300.0).format( tooltip_date_format ) +'<br><b>' + highcharts_tooltip_factory( this.point.y, point_obsType, true, rounding, mirrored );
                                        } else if (this.series.userOptions.type == "scatter") {
                                            // Catch anything else that might be a scatter plot. Scatter plots will just show x,y coordinates without this.
                                            return "<span style='color:" + this.series.color + "'>\u25CF</span> " + this.series.name + ': ' + Highcharts.numberFormat(this.y);
                                        } else {
                                            return tooltip.defaultFormatter.call(this, tooltip);
                                        }
                                    }
                    },
                    split: true,
                },
                
                credits: {},

                series: [{}]

            };
            
            // Default options completed, build overrides from JSON and graphs.conf
            
            // Set the chart render div and title
            if ( prepend_renderTo ) {
                options.chart.renderTo = json_file + "_" + renderTo;
            } else {
                options.chart.renderTo = renderTo;
            }
            
            belchertown_debug( options.chart.renderTo + ": building a " + type + " chart" );
            
            if ( css_class ) {
                jQuery( "#" + options.chart.renderTo ).addClass( css_class );
                belchertown_debug( options.chart.renderTo + ": div id is " + options.chart.renderTo + " and adding CSS class: " + css_class );
            }
            
            options.chart.type = type;
            options.title.text = "<a href='#"+options.chart.renderTo+"'>"+title+"</a>"; // Anchor link to chart for direct linking
            options.subtitle.text = subtitle;
            options.plotOptions.area.gapSize = gapsize;
            options.plotOptions.line.gapSize = gapsize;
            options.plotOptions.spline.gapSize = gapsize;
            options.plotOptions.scatter.gapSize = gapsize;
            if ( connectNulls == "true" ) {
                options.plotOptions.series = { connectNulls: connectNulls };
            }
            options.colors = colors;
            
            // If we have xAxis categories, reset xAxis and populate it from these options. Also need to reset tooltip since there's no datetime for moment.js to use.
            if ( xAxis_categories.length >= 1 ) {
                belchertown_debug( options.chart.renderTo + ": has " + xAxis_categories.length + " xAxis categories. Resetting xAxis and tooltips for grouping" );
                options.xAxis = {}
                options.xAxis.categories = xAxis_categories;
                options.tooltip = {}
                options.tooltip = {
                    enabled: true,
                    crosshairs: true,
                    split: true,
                    formatter: function () {
                        // The first returned item is the header, subsequent items are the points
                        return [this.x].concat(
                            this.points.map(function (point) {
                                // If observation_type is in the series array, use that otherwise use the obsType
                                var point_obsType = point.series.userOptions.observation_type ? point.series.userOptions.observation_type : point.series.userOptions.obsType;
                                var rounding = point.series.userOptions.rounding;
                                var mirrored = point.series.userOptions.mirrored_value;
                                return "<span style='color:" + point.series.color + "'>\u25CF</span> " + point.series.name + ': ' + highcharts_tooltip_factory( point.y, point_obsType, true, rounding, mirrored );
                            })
                        );
                    },
                }
            }
            
            // Reset the series everytime we loop.
            options.series = [];

            // Build the series
            var i = 0;
            jQuery.each(data[plotname]["series"], function (seriesName, seriesVal) {
                observation_type = data[plotname]["series"][seriesName]["obsType"];
                options.series[i] = data[plotname]["series"][seriesName];
                i++;
            });
            
            /* yAxis customization handler and label handling
            Take the following example. 
            yAxis is in observation 0 (rainTotal), so that label is caught and set by yAxis1_active. 
            If you move yAxis to observation 1 (rainRate), then the label is caught and set by yAxis_index.
            There may be a more efficient way to do this. If so, please submit a pull request :)
            [[[chart3]]]
                title = Rain
                [[[[rainTotal]]]]
                    name = Rain Total
                    yAxis = 1
                [[[[rainRate]]]]
            */
            
            var yAxis1_active = undefined;
            
            // Find if any series have yAxis = 1. If so, save the array number so we can set labels correctly.
            // We really care if yAxis is in array 1+, so we can go back and set yAxis 0 to the right label.
            var yAxis_index = options.series.findIndex( function(item){ return item.yAxis == 1 } )
            
            // Handle series specific data, overrides and non-Highcharts options that we passed through
            options.series.forEach(s => {
                if (s.yAxis == "1") {
                    // If yAxis = 1 is set for the observation, add a new yAxis and associate that observation to the right side of the chart
                    yAxis1_active = true;
                    options.yAxis.push({ // Secondary yAxis
                                opposite: true,
                                title: {
                                    text: s.yAxis_label,
                                },
                            }),
                    // Associate this series to the new yAxis 1
                    s.yAxis = 1
                                        
                    // We may have already passed through array 0 in the series without setting the "multi axis label", go back and explicitly define it.
                    if ( yAxis_index >= 1 ) {
                        options.yAxis[0].title.text = options.series[0].yAxis_label;
                    } 
                } else {
                    if ( yAxis1_active ) {
                        // This yAxis is first in the data series, so we can set labels without needing to double back
                        options.yAxis[0].title.text = s.yAxis_label;
                    } else {
                        // Apply the normal yAxis 0's label without observation name
                        options.yAxis[0].title.text = s.yAxis_label;
                    }
                    // Associate this series to yAxis 1
                    s.yAxis = 0;
                }
                
                // Run yAxis customizations
                this_yAxis = s.yAxis;
                
                belchertown_debug( options.chart.renderTo + ": " + s.obsType + " is on yAxis " + this_yAxis );
                
                // Some charts may require a defined min/max on the yAxis
                options.yAxis[this_yAxis].min = s.yAxis_min !== "undefined" ? s.yAxis_min : null;
                options.yAxis[this_yAxis].max = s.yAxis_max !== "undefined" ? s.yAxis_max : null;
                
                // Some charts may require a defined soft min/max on the yAxis
                options.yAxis[this_yAxis].softMin = s.yAxis_softMin !== "undefined" ? parseInt(s.yAxis_softMin) : null;
                options.yAxis[this_yAxis].softMax = s.yAxis_softMax !== "undefined" ? parseInt(s.yAxis_softMax) : null;

                // Set the yAxis tick interval. Mostly used for barometer. 
                if ( s.yAxis_tickInterval ) { 
                    options.yAxis[this_yAxis].tickInterval = s.yAxis_tickInterval;
                }
                
                // Set yAxis minorTicks. This is a graph-wide setting so setting it for any of the yAxis will set it for the graph itself
                if ( s.yAxis_minorTicks ) {
                    options.yAxis[this_yAxis].minorTicks = true;
                }
                
                // Barometer chart plots get a higher precision yAxis tick
                if (s.obsType == "barometer") {
                    if ( typeof s.yAxis_tickInterval === "undefined" ) { 
                        // If no tick interval override, set 0.01 as default tick interval to satisfy an old request for this level of precision. 
                        options.yAxis[this_yAxis].tickInterval = 0.01;
                    }
                    // Define yAxis label float format if rounding is defined. Default to 2 decimals if nothing defined
                    if ( typeof s.rounding !== "undefined" ) {
                        options.yAxis[this_yAxis].labels = { format: '{value:.'+s.rounding+'f}' }
                    } else {
                        options.yAxis[this_yAxis].labels = { format: '{value:.2f}' }
                    }
                }
                
                // Rain, RainRate and rainTotal (special Belchertown skin observation) get yAxis precision
                if (s.obsType == "rain" || s.obsType == "rainRate" || s.obsType == "rainTotal") {
                    options.yAxis[this_yAxis].min = 0;
                    options.yAxis[this_yAxis].minRange = 0.01;
                    options.yAxis[this_yAxis].minorGridLineWidth = 1;
                }

                if (s.obsType == "windDir") {
                    options.yAxis[this_yAxis].tickInterval = 90;
                    options.yAxis[this_yAxis].labels = { formatter: function() { var value = weatherdirection[this.value]; return value !== 'undefined' ? value : this.value; } }
                }
                
                // Check if this series has a gapsize override
                if (s.gapsize) {
                    options.plotOptions.area.gapSize = s.gapsize;
                    options.plotOptions.line.gapSize = s.gapsize;
                    options.plotOptions.spline.gapSize = s.gapsize;
                    options.plotOptions.scatter.gapSize = s.gapsize;
                }
                
                // If this chart is a mirrored chart, make the yAxis labels non-negative
                if ( s.mirrored_value ) {
                    belchertown_debug( options.chart.renderTo + ": mirrored chart due to mirrored_value = true" );
                    options.yAxis[s.yAxis].labels = { formatter: function() { return Math.abs(this.value); } }
                }
                
                // Lastly, apply any numberFormat label overrides
                if ( typeof s.numberFormat !== "undefined" && Object.keys(s.numberFormat).length >= 1 ) {
                    var { decimals, decimalPoint, thousandsSep } = s.numberFormat
                    options.yAxis[this_yAxis].labels = { formatter: function () { return Highcharts.numberFormat(this.value, decimals, decimalPoint, thousandsSep); } }                    
                }
                
            });
            
            // If windRose is present, configure a special chart to show that data
            if (observation_type == "windRose") {
                var categories = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N/A'];
                options.chart.className = "highcharts-windRose"; // Used for dark mode
                options.chart.type = "column";
                options.chart.polar = true;
                options.chart.alignTicks = false;
                options.pane = { size: '80%' }
                // Reset xAxis and rebuild
                options.xAxis = {}
                options.xAxis.min = 0;
                options.xAxis.max = 16;
                options.xAxis.crosshair = true;
                options.xAxis.categories = categories;
                options.xAxis.tickmarkPlacement = 'on';
                //options.xAxis.labels = { useHTML: true } // Option disabled in highcharts 8
                //options.legend.align = "right";
                options.legend.verticalAlign = "top";
                options.legend.x = 210;
                options.legend.y = 119;
                options.legend.layout = "vertical";
                options.legend.floating = true;
                options.yAxis[0].min = 0;
                options.yAxis[0].endOnTick = false;
                options.yAxis[0].reversedStacks = false;
                options.yAxis[0].title.text = "Frequency (%)";
                options.yAxis[0].gridLineWidth = 0;
                options.yAxis[0].labels = { enabled: false }
                options.yAxis[0].zIndex = 800;
                options.plotOptions = { column: {
                                            stacking: 'normal',
                                            shadow: false,
                                            groupPadding: 0,
                                            pointPlacement: 'on',
                                        }
                                    }
                // Reset the tooltip
                options.tooltip = {}
                options.tooltip.shared = true;
                options.tooltip.valueSuffix = '%';
                options.tooltip.followPointer = true;
                options.tooltip.useHTML = true;
                
                // Since wind rose is a special observation, I did not re-do the JSON arrays to accomodate it as a separate array.
                // So we need to grab the data array within the series and save it to a temporary array, delete the entire chart series, 
                // and reapply the windrose data back to the series.
                var newSeries = options.series[0].data;
                options.series = [];
                newSeries.forEach( ns => {
                    options.series.push(ns);
                });
            }
            
            // If Hays chart is present, configure a special chart to show that data
            if (observation_type == "haysChart") {
                options.chart.type = "arearange"
                options.chart.polar = true;
                options.plotOptions = {
                    turboThreshold: 0,
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                };

                // Find min and max of the series data for the yAxis min and max
                var maximum_flattened = [];
                options.series[0].data.forEach( seriesData => {
                    maximum_flattened.push(seriesData[2]);
                });
                var range_max = Math.max(...maximum_flattened);
                
                if (options.series[0].yAxis_softMax) {
                    var range_max = options.series[0].yAxis_softMax;
                }
                
                options.legend = { "enabled": false }

                options.yAxis = {
                    showFirstLabel: false,
                    tickInterval: 2,
                    tickmarkPlacement: 'on',
                    min: -1,
                    softMax: range_max,
                    title: {
                        text: options.series[0].yAxis_label,
                    },
                    labels: {
                        align: 'center',
                        x: 0,
                        y: 0
                    },
                }

                options.tooltip = {
                    split: false,
                    shared: true,
                    followPointer: true,
                    useHTML: true,
                    formatter: function (tooltip) {
                        return this.points.map(function (point) {
                            var rounding = point.series.userOptions.rounding;
                            var mirrored = point.series.userOptions.mirrored_value;
                            var numberFormat = point.series.userOptions.numberFormat ? point.series.userOptions.numberFormat : "";
                            return "<strong>" + moment.unix( point.x / 1000).utcOffset(-300.0).format( tooltip_date_format ) + "</strong><br><span style='color:" + options.series[0].color + "'>\u25CF</span> High: " + highcharts_tooltip_factory( point.point.high, observation_type, true, rounding, mirrored, numberFormat ) + "<br><span style='color:" + options.series[0].color + "'>\u25CF</span> Low: " + highcharts_tooltip_factory( point.point.low, observation_type, true, rounding, mirrored, numberFormat );
                        });
                    }
                }

                var currentSeries = options.series;
                var currentSeriesData = options.series[0].data;
                var range_unit = options.series[0].range_unit;
                var newSeriesData = [];
                var currentSeriesColor = options.series[0].color;
                currentSeriesData.forEach( seriesData => {
                    newSeriesData.push({
                        x: seriesData[0],
                        low: seriesData[1],
                        high: seriesData[2],
                    });
                });
                options.series = [];
                options.series.push({
                    data: newSeriesData,
                    obsType: "haysChart",
                    obsUnit: range_unit,
                    color: currentSeriesColor,
                    fillColor: currentSeriesColor,
                    connectEnds: false,
                });
            }

            // If weather range is present, configure a special chart to show that data
            // https://www.highcharts.com/blog/tutorials/209-the-art-of-the-chart-weather-radials/
            if (observation_type == "weatherRange") {
                options.chart.type = "columnrange";
                // If polar is defined, use it and add a special dark mode CSS class
                if ( JSON.parse( String( options.series[0].polar.toLowerCase() ) ) ) {
                    options.chart.polar = true; // Make sure the option is a string, then convert to bool
                    options.chart.className = "highcharts-weatherRange belchertown-polar"; // Used for dark mode
                } else {
                    options.chart.className = "highcharts-weatherRange"; // Used for dark mode
                }
                
                options.legend = { "enabled": false }
                
                // Find min and max of the series data for the yAxis min and max
                var minimum_flattened = [];
                var maximum_flattened = [];
                options.series[0].data.forEach( seriesData => {
                    minimum_flattened.push(seriesData[1]);
                    maximum_flattened.push(seriesData[2]);
                });
                var range_min = Math.min(...minimum_flattened);
                var range_max = Math.max(...maximum_flattened);
                
                var yAxis_tickInterval = Math.ceil( Math.round(range_max / 5) / 5 ) * 5; // Divide max outTemp by 5 and round it, then round that value up to the nearest 5th multiple. This gives clean yAxis tick lines. 
                
                options.yAxis = {
                    showFirstLabel: true,
                    tickInterval: yAxis_tickInterval,
                    min: range_min,
                    max: range_max,
                    title: {
                        text: options.series[0].yAxis_label,
                    },
                }
                
                options.xAxis = {}
                options.xAxis = {
                    labels: {
                        format: "{value: %b}"
                    },
                    tickInterval: 2592000000, // 30 days
                    showLastLabel: true,
                    crosshair: true,
                    type: "datetime"
                }
                
                options.plotOptions = {}
                options.plotOptions = {
                  series: {
                    turboThreshold: 0,
                    stacking: "normal",
                    showInLegend: false,
                    borderWidth: 0,
                  }
                }

                options.tooltip = {
                    split: false,
                    shared: true,
                    followPointer: true,
                    useHTML: true,
                    formatter: function (tooltip) {
                        return this.points.map(function (point) {
                            var rounding = point.series.userOptions.rounding;
                            var mirrored = point.series.userOptions.mirrored_value;
                            var numberFormat = point.series.userOptions.numberFormat ? point.series.userOptions.numberFormat : "";
                            return "<strong>" + moment.unix( point.x / 1000).utcOffset(-300.0).format( tooltip_date_format ) + "</strong><br><span style='color:" + get_outTemp_color( point.series.userOptions.obsUnit, point.point.high, true) + "'>\u25CF</span> High: " + highcharts_tooltip_factory( point.point.high, observation_type, true, rounding, mirrored, numberFormat ) + "<br><span style='color:" + get_outTemp_color( point.series.userOptions.obsUnit, point.point.low, true) + "'>\u25CF</span> Low: " + highcharts_tooltip_factory( point.point.low, observation_type, true, rounding, mirrored, numberFormat ) + "<br><span style='color:" + get_outTemp_color( point.series.userOptions.obsUnit, point.point.average, true) + "'>\u25CF</span> Average: " + highcharts_tooltip_factory( point.point.average, observation_type, true, rounding, mirrored, numberFormat );
                        });
                    }
                }

                // Update data
                var currentSeries = options.series;
                var currentSeriesData = options.series[0].data;
                var range_unit = options.series[0].range_unit;
                var newSeriesData = [];
                currentSeriesData.forEach( seriesData => {
                    if ( options.series[0].color ) {
                        var color = options.series[0].color;
                    } else {
                        // Set color of the column based on the average temperature, or return default if not temperature
                        var color = get_outTemp_color( range_unit, seriesData[3], true );                    
                    }
                    newSeriesData.push({
                        x: seriesData[0],
                        low: seriesData[1],
                        high: seriesData[2],
                        average: seriesData[3],
                        color: color
                    });
                });
                options.series = [];
                options.series.push({
                    data: newSeriesData,
                    obsType: "weatherRange",
                    obsUnit: range_unit
                });
            }
            
            // Apply any width, height CSS overrides to the parent div of the chart
            if ( css_height != "" ) {
                jQuery("#"+options.chart.renderTo).parent().css({
                   'height' : css_height,
                   'padding' : '0px 15px',
                   'margin-bottom' : '20px'
                });
            }
            if ( css_width != "" ) {
                jQuery("#"+options.chart.renderTo).parent().css('width', css_width);
            }
            
            if ( credits != "highcharts_default" ) {
                options.credits.text = credits;
            }
            
            if ( credits_url != "highcharts_default" ) {
                options.credits.href = credits_url;
            }

            if ( credits_position != "highcharts_default" ) {
                options.credits.position = JSON.parse(credits_position);
            }

            // Finally all options are done, now show the chart
            var chart = new Highcharts.chart(options);
            
            // If using debug, show a copy paste debug for use with jsfiddle
            belchertown_debug("Highcharts.chart('container', " + JSON.stringify(options) + ");");

        });
    
    });

};
