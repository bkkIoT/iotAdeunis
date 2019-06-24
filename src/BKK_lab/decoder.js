function Decoder(bytes, port) {

    function Hex2Bin(hex) { return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8); }
    function Bin2Dec(n) { return parseInt(n, 2); }
    function Dec2Bin(n) {
        n_string = n.toString(2)
        if (n_string.length === 8) {
            return n_string;
        }
        else {

            while (n_string.length < 8) {
                n_string = "0".concat(n_string);
            }
            return n_string;
        }

    }


    var dict = {
        0x4E: "0x4E periodic data",
        0x51: "0x51 Motion TOR1 alarm",
        0x1F: "0x1f Motion channels configuration",
        0x20: "0x20 Configuration",
        0x30: "0x30 keep alive",
        0x4F: "0x4F Motion presence alaram",
        0x50: "0x50 Motion luminosity alarm"
    };
    var param = {

        "type": null,
        "Frame_Counter": null,
        "Hardware_error": false,
        "Low_battery": false,
        "configuration_successfull": false,
        "configuration_inconsistency": false,
        "presence_global_counter": null,
        "presence_current_counter": null,
        "luminosity_current_percentage": null
    };

    for (var frameCode in dict) {
        if (parseInt(frameCode, 16) === bytes[0]) {
            param.type = dict[frameCode];
        }
    }
    var status = Dec2Bin(bytes[1]);
    param.Frame_Counter = parseInt(status.charAt(0), 2) * Math.pow(2, 2) + parseInt(status.charAt(1), 2) * Math.pow(2, 1) + parseInt(status.charAt(2), 2);
    //ignorerer foreløpig reserved bit
    //Sjekker om bit'et Configuration inconsistency er markert
    if (parseInt(status.charAt(4)) === 1) {
        param.configuration_inconsistency = true;
    }
    //hardware error
    if (parseInt(status.charAt(5)) === 1) {
        param.Hardware_error = true;
    }//Low battery
    if (parseInt(status.charAt(6)) === 1) {
        param.Low_battery = true;
    }//Configuration successful
    if (parseInt(status.charAt(7)) === 1) {
        param.configuration_successfull = true;
    }
    if (param.type.localeCompare(dict[0x4E])) {
        //sjekker verdi til global presence counter
        param.presence_global_counter = Bin2Dec(Dec2Bin(bytes[2]).concat(Dec2Bin(bytes[3])));
    }
    //.








    return param;

}


