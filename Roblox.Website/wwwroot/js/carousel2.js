$(function () {
    var carouselArray = [
				                { img: "images/GameCarousel/img5.jpg",
				                    img_thumb: "/images/GameCarousel/img5_thumb.jpg",
				                    title: "ROBLOX Building",
				                    by: "",
				                    more: "Build anything on your home plate<br/> and show it off to your friends!",
				                    align: "right"
				                },
				                { img: "images/GameCarousel/img4.jpg",
				                    img_thumb: "/images/GameCarousel/img4_thumb.jpg",
				                    title: "Chaos Canyon",
				                    by: "by ROBLOX",
				                    more: "Battle in this Legendary Map!",
				                    align: "right"
				                },
				                { img: "images/GameCarousel/img2.jpg",
				                    img_thumb: "/images/GameCarousel/img2_thumb.jpg",
				                    title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Crossroads",
				                    by: "by ROBLOX",
				                    more: "Multi-player Battle!",
				                    align: "right"
				                },
				                { img: "images/GameCarousel/img3.jpg",
				                    img_thumb: "/images/GameCarousel/img3_thumb.jpg",
				                    title: "&nbsp;Rocket Arena",
				                    by: "by ROBLOX",
				                    more: "Multi-player Battle!",
				                    align: "right"
				                },
				                { img: "images/GameCarousel/img6.jpg",
				                    img_thumb: "/images/GameCarousel/img6_thumb.jpg",
				                    title: "Thousands of Games!",
				                    by: "",
				                    more: "See what people are<br />playing right now!",
				                    align: "right"
				                },
	   		                ];

    var i;
    for (i = 1; i <= 5; i++) {
        eval("$('.nav" + i + "').click(function () { carousel_gotoPage(" + i + "); return false; });");
        // Remove unsightly dotted line on click (but not for keyboard tabbing)
        if (i == 1) {
            eval("$('.nav" + i + "').mouseover(function () { stopGlowButtons(); $('.tooltip').attr('style', 'position: absolute; top: 159px; left: " + (198 + (30 * i)) + "px'); $('#game').attr('src', carouselArray[" + (i - 1) + "].img_thumb); });");
        } else {
            eval("$('.nav" + i + "').mouseover(function () { stopGlowButtons(); $('.tooltip').attr('style', 'position: relative; top: 159px; left: " + (198 + (30 * i)) + "px'); $('#game').attr('src', carouselArray[" + (i - 1) + "].img_thumb); });");
        }
    }

    $(".nav").mouseout(function () {
        glowButtons();
        $(".tooltip").attr("style", "display: none");
    });

    $(".caption").removeClass("hidden"); // otherwise, the caption jumps during loading
    carousel_init(carouselArray);
    $(".carousel").click(function (event) {
        carousel_click_current(event);
    });
    $(".carousel").mouseover(function (event) {
        carouselGlowButtons(event);
    });
    $(".carousel").mouseout(function (event) {
        carouselStopGlowButtons(event);
    });
    $(".navContainer").mouseover(function () {
        stopGlowButtons();
    });
    $(".navContainer").mouseout(function () {
        glowButtons();
    });
});          // end jquery init function
