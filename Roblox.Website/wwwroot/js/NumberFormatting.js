if (typeof Roblox === "undefined") {
    Roblox = {};
}

if (typeof Roblox.NumberFormatting === "undefined") {
    Roblox.NumberFormatting = (function () {
        var commas = function (number) {
            if (typeof number !== "number") {
                throw "'number' is not a number";
            }

            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Inserts commas into the number.
        }
        
        var abbreviate = function (number) {
            if (typeof number !== "number") {
                throw "'number' is not a number";
            }

            var oneThousand = 1000;
            var oneMillion = 1000000;
            var oneBillion = 1000000000;

            if (number <= 0)
            {
                return "0";
            }

            if (number < oneThousand)
            {
                return number;
            } 
            
            if (number < oneMillion) 
            {
                var value = Math.round(number / oneThousand * 10) / 10;
                if (value >= oneThousand) {
                    return Math.round(value / oneThousand * 10) / 10 + "M";
                }
                return value + "K";
            } 
            
            if (number < oneBillion) 
            {
                var value = Math.round(number / oneMillion * 10) / 10;
                if (value >= oneThousand) {
                    return Math.round(value / oneThousand * 10) / 10 + "B";
                }
                return value + "M";
            } 
            return Math.round(number / oneBillion * 10) / 10 + "B";
        }
        
        var abbreviatedFormat = function (number) {
            if (typeof number !== "number") {
                throw "'number' is not a number";
            }

            var tenThousand = 10000;
            var oneMillion = 1000000;
            var oneBillion = 1000000000;

            if (number == 0)
            {
                return "0";
            }

            if (number < tenThousand)
            {
                return commas(number);
            }

            var append = "B+";
            var trimCharacters = 9;

            if (number < oneMillion)
            {
                append = "K+";
                trimCharacters = 3;
            }
            else if (number < oneBillion)
            {
                append = "M+";
                trimCharacters = 6;
            }

            var numberString = number.toString();
            return numberString.substring(0, numberString.length - trimCharacters) + append;
        }

        return {
            abbreviatedFormat: abbreviatedFormat,
            commas: commas,
            abbreviate: abbreviate
        };
    })();
}