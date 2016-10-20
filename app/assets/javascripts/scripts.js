/**
* @depends plugins.js
*/
/*!
DC-publisher="Drexel University"
DC-creator="David Vespoli"
DC-title="common scripts"
DC-type="javscript"
DC-date="2012-05"
DC-updated="$BuildDate$"
DC-source=""
DC-relation=""
DC-coverage="Common scripts used throughout the site"
<link rel="schema.DC" href="http://dublincore.org/documents/dces/" />
*/
var DREXEL = window.DREXEL || {};
DREXEL.utility = {
    //whos at bat - Give me the index of the item with the highest z-index in a set
    //expects jquery element array
    //make sure to set your z-index properly after slide advance
    getTopIndex: function ($el) {
        var zindex_highest = 0,
			index = 0;
        $el.each(function (i) {
            var zindex_current = parseInt($(this).css('z-index'), 10);
            if (zindex_current > zindex_highest) {
                zindex_highest = zindex_current;
                index = i;
            }
        });
        return index;
    },
    //whos on deck - give me the upcoming item in a set
    //jquery element array, current item index, should we go in reverse
    getNextIndex: function ($el, current, reverse) {
        if (reverse) {
            return (current === 0) ? $el.length - 1 : current - 1;
        } else {
            return (current === $el.length - 1) ? 0 : current + 1;
        }
    },
	OlderThanIE9: function() {
		if($("html.lt-ie9").length > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	OlderThanIE8: function() {
		if($("html.lt-ie8").length > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};
DREXEL.responsiveImage = {
    get: function ($noScriptElement) {
        var img = window.document.createElement('img');
        if (screen.width >= 1220) {
            //wide
            img.src = $noScriptElement.data("path") + '/wide.ashx';
        } else if (screen.width >= 980) {
            //normal
            img.src = $noScriptElement.data("path") + '.ashx';
        } else if (screen.width == 768 && window.innerWidth == 1024) {
            // iPad in landscape
            img.src = $noScriptElement.data("path") + '.ashx';
        } else if (screen.width >= 740) {
            //narrow
            img.src = $noScriptElement.data("path") + '/narrow.ashx';
        } else {
            //mobile
            img.src = $noScriptElement.data("path") + '/mobile.ashx';
        }
        img.title = $noScriptElement.data("title") || '';
        img.alt = $noScriptElement.data("alt") || '';
        return img;
    },
    init: function () {
        //get responsive images
        $('.responsive-image').each(function () {
            var $this = $(this),
					img = DREXEL.responsiveImage.get($this);
            //may have to do this differently for other situations (not just blindly append to parent)
            $this.parent().append(img);
        });
    }
};
DREXEL.bgSlides = {
    init: function () {
        //load up the images with the activity spinner		
        $('#bg-images-full li').css({
            height: 500
        }); //
        //$(".bg-images li").activity();
        //once everythig has loaded show the background and listen for window resize
        $window.load(function () {
            var $images = $(".bg-images img"),
				aspectRatio = $images.eq(0).width() / $images.eq(0).height();
            //turn off spinner and show background    
            //removing for now. started throwing error "HIERARCHY_REQUEST_ERR: DOM Exception 3" 
            //$(".bg-images li").activity(false);
            $('#bg-images-full li').css({
                height: 'auto'
            });
            //init with z-index
            $images.css('z-index', 1).eq(0).css('z-index', 3);
            $images.css({
                display: 'block'
            });
            //resizing the background will cause the image to be either 100% tall or wide. Whichever will keep full image background
            var resizeBackground = function () {
                //only want this on full background
                if (($window.width() / $window.height()) < aspectRatio) {
                    $("#bg-images-full img").removeClass().addClass('bgheight');
                } else {
                    $("#bg-images-full img").removeClass().addClass('bgwidth');
                }
            };
            if ($('#bg-images-full').length) {
                $window.resize(function () {
                    resizeBackground();
                }).trigger("resize");
            }
        });
    },
    advance: function (reverse, i) {
        if (DREXEL.hero.animating) {
            return false;
        }
        var $images = $('.bg-images img');
        //figure out what the current items is and what the next will be
        var currentIndex = DREXEL.utility.getTopIndex($images),
			nextIndex = (typeof i === 'undefined') ? DREXEL.utility.getNextIndex($images, currentIndex, reverse) : i;
        if (currentIndex === nextIndex) {
            return false;
        }
        //get ready for the big reveal
        $images.eq(nextIndex).css({
            opacity: 1,
            'z-index': 2
        });
        //fade out top image and move to the bottom
        $images.eq(currentIndex).animate({
            opacity: 0
        }, DREXEL.hero.animateTime, function () {
            $(this).css('z-index', 1);
            $images.eq(nextIndex).css({
                opacity: 1,
                'z-index': 3
            });
        });
    }
};
DREXEL.hero = {
    animating: false,
    animateTime: 400,
    randomStartCheck: function () {
        if (typeof (randomHeroStart) !== 'undefined' && randomHeroStart == true) {
            var randomnumber = Math.floor(Math.random() * ($('ul.bg-images li').length - 1));
            for (i = 0; i < randomnumber; i++) {
                $('#hero ul.captions').append($('#hero ul.captions li:first'));
                $('ul.bg-images').append($('ul.bg-images li:first'));
            }
        }
    },
    init: function () {
        //add pager
        var $captions = $("#hero ul.captions > li");
        //init z-index
        $captions.css({
            'z-index': 1,
            position: 'absolute'
        }).eq(0).css({
            'z-index': 3,
            position: 'relative'
        });
        if ($('#hero ul.captions li').length > 1) {
            if ($('#hero').parent('.home-hero').length) {
                //build the thumb pager
                this.pager.init($captions.length, true);
            } else {
                //build the little pager
                this.pager.init($captions.length);
            }
        }
    },
    advance: function (reverse, i) {
        if (DREXEL.hero.animating) {
            return false;
        }
        var $captions = $("#hero ul.captions > li");
        this.currentIndex = DREXEL.utility.getTopIndex($captions);
        this.nextIndex = (typeof i === 'undefined') ? DREXEL.utility.getNextIndex($captions, this.currentIndex, reverse) : i;
        var $incoming = $captions.eq(this.nextIndex),
			$outgoing = $captions.eq(this.currentIndex),
			$hero = $('#hero ul').eq(0);
        if (this.currentIndex === this.nextIndex) {
            return false;
        }
        //get ready for next caption
        $incoming.css({
            opacity: 0,
            'z-index': 2,
            display: 'block',
            position: 'absolute'
        });
        //figure out which is taller and set stage to fit
        var ih = $incoming.height(),
			oh = $outgoing.height();
        $hero.css({
            height: oh
        });
        $outgoing.css({
            position: 'absolute'
        });
        $incoming.css({
            position: 'absolute'
        });
        DREXEL.hero.pager.advance(this.nextIndex, this.currentIndex);
        DREXEL.bgSlides.advance(reverse, i);
        DREXEL.hero.animating = true;
        $outgoing.animate({
            opacity: 0
        }, DREXEL.animateTime, function () {
            $incoming.css({
                opacity: 1,
                'z-index': 3
            });
            $outgoing.css({
                display: 'none'
            });
            $hero.css({
                height: ih
            });
            DREXEL.hero.animating = false;
        }).css({
            'z-index': 1
        });
    },
    pager: {
        init: function (n, thumbs) {
            var $images = $('.bg-images img'),
					$captions = $("#hero ul.captions > li"),
					i;
            if (thumbs) {
                //keep track of this guy's dom
                this.$ele = $('<ul class="thumb-pager row">');
                //add pager thumbs
                for (i = 0; i < $images.length; i++) {
                    var $i = $images.eq(i),
						title = $captions.eq(i).find('h1,h2').html(),
						$thumb = $('<li data-index="' + i + '"><a href="#"><img title="' + $i.attr('title') + '" height="64" width="105" src="' + $i.attr('src') + '" alt="' + $i.attr('alt') + '" title="' + $i.attr('title') + '"  />' + title + '</a></li>');
                    $thumb.click(function (e) {
                        var $this = $(this);
                        e.preventDefault();
                        DREXEL.hero.advance(false, $this.data('index'));
                    });
                    this.$ele.append($thumb);
                }
                //if there are 3 or more slide the last to the front to position first slide in middle
                if ($images.length > 2) {
                    var last = this.$ele.find('li:last-child');
                    this.$ele.prepend(last);
                }
            } else {
                //add mini pager (dots)
                this.$ele = $('<ul class="pager row">');
                for (i = 0; i < n; i++) {
                    this.$ele.append('<li data-index="' + i + '">slide ' + (i + 1) + '</li>');
                }
            }
            var $next = '',
					$prev = '';
            //build our previous next buttons
            if (($images.length > 3 && thumbs) || (!thumbs)) {
                var $next = $('<a class="next" href="#">next</a>').click(function (e) {
                    e.preventDefault();
                    DREXEL.hero.advance();
                });
                var $prev = $('<a class="prev" href="#">previous</a>').click(function (e) {
                    e.preventDefault();
                    DREXEL.hero.advance(1);
                });
                //add buttons and appropriate class to pager			
                if (thumbs) {
                    this.$ele.appendTo('#hero').wrap('<div class="thumb-pager-container"></div>').wrap('<div class="thumb-pager-mask"></div>');
                    //this.$ele.clone().appendTo('#hero').wrap('<div class="pager-container"></div>');
                } else {
                    this.$ele.appendTo('#hero').wrap('<div class="pager-container"></div>');
                }
                if ($('.thumb-pager-container').length) {
                    $('.thumb-pager-container').append($next, $prev);
                    //$('.pager-container').append($next.clone(),$prev.clone(true))
                } else {
                    $('.pager-container').append($next, $prev);
                }
                //figure out width and center
                var w = $('.pager-container').css({ display: 'inline-block', width: 'auto' }).width();
                $('.pager-container').css({ width: parseInt(w) + 'px', display: 'block' });
            } //end prev next buttons
            //init first slide to active
            this.$ele.find('li[data-index=0]').addClass('active');
        },
        //pager advance
        advance: function () {
            if (typeof DREXEL.hero.nextIndex == 'undefined') { return false; }
            var thumbs = $('#hero').parent('.home-hero').length ? true : false;
            var $sample = $('.thumb-pager-container li:visible').eq(0);
            var thumbWidth = parseInt($sample.width()) + parseInt($sample.css('margin-left')) + parseInt($sample.css('margin-right'));
            //special treatment for thumb pager
            if (thumbs) {
                //check to see if the index of the "active" item is behind the 
                //index of the incoming slide, if so go forward
                if (DREXEL.hero.pager.$ele.find('li.active').index() < this.$ele.find('li[data-index=' + DREXEL.hero.nextIndex + ']').index()) {
                    //animate and reshuffle						
                    DREXEL.hero.pager.$ele
						.animate({ left: '-' + thumbWidth + 'px' }, 400, function () {
						    $(this).css('left', 0)
							.append(DREXEL.hero.pager.$ele.find('li').eq(0))
						});
                } else {
                    //go backwards
                    DREXEL.hero.pager.$ele
						.css({ left: '-' + thumbWidth + 'px' })
						.prepend(DREXEL.hero.pager.$ele.find('li:last-child'))
						.animate({ left: 0 }, 400, function () {
						});
                }
            }
            //change "active" thumb to current one
            this.$ele.find('li[data-index=' + DREXEL.hero.currentIndex + ']').removeClass('active');
            this.$ele.find('li[data-index=' + DREXEL.hero.nextIndex + ']').addClass('active');
        }
    } //pager
};
DREXEL.addswipe = function (config) {
    var time = 1000,
    // allow movement if < 1000 ms (1 sec)
		range = config.range || 50,
    // swipe movement of 50 pixels triggers the slider
		x = 0,
		y = 0,
		t = 0,
		touch = "ontouchend" in document,
		st = (touch) ? 'touchstart' : 'mousedown',
		mv = (touch) ? 'touchmove' : 'mousemove',
		en = (touch) ? 'touchend' : 'mouseup';
    config.el.bind(st, function (e) {
        // prevent image drag (Firefox)
        if (config.direction === 'y') { e.preventDefault(); }
        t = (new Date()).getTime();
        x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX, y = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
    }).bind(en, function (e) {
        t = 0;
        x = 0, y = 0;
    }).bind(mv, function (e) {
        var newx = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
			newy = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY,
			rx = (x === 0) ? 0 : Math.abs(newx - x),
			ry = (y === 0) ? 0 : Math.abs(newy - y),
        // allow if movement < 1 sec
			ct = (new Date()).getTime();
        if (t !== 0 && ct - t < time && (rx > range || ry > range)) {
            //let event bubble if scrolling up/down
            if (ry > rx) {
                //up/down swipe
                if (config.direction === "y") {
                    //log('swipey');
                    e.preventDefault();
                    if (newy < y) {
                        //down
                        config.f1();
                    }
                    if (newy > y) {
                        //up
                        config.f2();
                    }
                }
            } else {
                //side swipe
                if (config.direction === "x") {
                    //log('swipex');
                    e.preventDefault();
                    if (newx < x) {
                        //'left'
                        config.f1();
                    }
                    if (newx > x) {
                        //'right'
                        config.f2();
                    }
                }
            }
            t = 0;
            x = 0;
            y = 0;
            return false;
        }
    });
};
DREXEL.fatFooter = {
    init: function () {
        $window.load(function () {
            var $fatNav = $('#fat-nav');
            //mobile vers needs open per list footer toggle
            //full site needs open for entire element
            $fatNav.find('h2').toggle(function () {
                $(this).addClass('open').next('ul').eq(0).addClass('open');
                $fatNav.click();
            }, function () {
                $(this).removeClass('open').next('ul').eq(0).removeClass('open');
                $fatNav.click();
            });
            if ($fatNav.length > 0) {
                $('.footer-bg').click(function () { $fatNav.click() });
                $('#fat-nav ul li h2').hover(
					function () {
					    $('.footer-bg').addClass('hover');
					},
					function () {
					    $('.footer-bg').removeClass('hover');
					}
				);
                $('.footer-bg').hover(
					function () {
					    $('.footer-bg').addClass('hover');
					},
					function () {
					    $('.footer-bg').removeClass('hover');
					}
				);
                $('#fat-nav ul li.live-it').hover(
					function () {
					    $('.footer-bg').addClass('hover');
					},
					function () {
					    $('.footer-bg').removeClass('hover');
					}
				);
            }
            $fatNav.click(function () {
                $fatNav.hasClass('open') ? $fatNav.removeClass('open') : $fatNav.addClass('open');
                //get rid of the follow callout if its open
                if ($fatNav.hasClass('open')) { $('#follow-callout').find('.on a').click(); }
            });
        }); //window load
    } //init
};
DREXEL.calloutTabs = {
    init: function () {
        /*********right rail follow callout box*/
        //prevent fous. hidden in css with js class
        $('#follow-callout').css({
            display: 'block'
        });
        $('#follow-callout.tabs ul.tab-nav li').each(function () {
            var $this = $(this),
				$a = $this.find('a').eq(0),
            //get the link
				$c = $($a.attr('href')),
            //items corresponding container
				$children = $this.parents('.tabs').find('.tabs-content aside'),
            //grab all the tab children
				$lis = $(this).siblings(),
				$tabsCont = $c.parent(),
				$fc = $('#follow-callout');
            //initially hide all containers unless a tab is "on"		
            if ($this.hasClass('on')) {
                $c.addClass('open');
                $tabsCont.addClass('open');
            } else {
                $c.removeClass('open');
            }
            //log($this);
            //attach our click handler		
            $a.click(function (e) {
                e.preventDefault();
                $lis.removeClass('on');
                //see if we are looking at a mobile sized viewport
                DREXEL.isMobile = ($window.width() > 740) ? false : true;
                //hiding if on tab is clicked
                if ($this.hasClass('on')) {
                    if (!DREXEL.isMobile) {
                        $fc.removeClass('expanded').animate({
                            width: 0
                        }, 200, function () {
                            $this.removeClass('on');
                            $c.removeClass('open');
                        });
                    } else {
                        //leave it open
                        //$this.removeClass('on');
                        //$c.removeClass('open');
                    }
                    //$tabsCont.animate({width:'0px'},200); //.removeClass('open');
                } else {
                    $this.addClass('on');
                    //if we are not aleady open then open
                    if (!DREXEL.isMobile) {
                        if (!$fc.hasClass('expanded')) {
                            if ($('.lt-ie8').length > 0) {
                                $fc.addClass('expanded').animate({
                                    width: 290
                                }, 200);
                            }
                            else {
                                $fc.addClass('expanded').animate({
                                    width: 318
                                }, 200);
                            }
                        }
                    }
                    //$tabsCont.css({width:'290px'}); //.addClass('open');
                    $children.removeClass('open');
                    $c.addClass('open');
                    //close fat-nav if its open
                    $('#fat-nav').removeClass('open');
                }
            });
        }); //tabs li each	
    } //init
};
DREXEL.bingosquare = function ($this) {
    //white squares on landing page that reveal hidden content when clicked/hovered
    var Modernizr = (typeof (Modernizr) === "undefined") ? null : Modernizr;
    if (navigator.msMaxTouchPoints) {
        $this.bind("selectstart", function (e) { e.preventDefault(); });
        $this.bind("MSPointerUp", function () {
            if ($this.hasClass('active')) {
                $this.removeClass('active');
            } else {
                var bw = $('#bingo').width(),
					w = $this.width(),
					p = $this.position().left;
                //if we are the last square
                if (w + p + (w * 0.2) >= bw) {
                    $this.find('.hidden-content').addClass('end');
                } else {
                    $this.find('.hidden-content').removeClass('end');
                }
                $this.addClass('active').siblings().removeClass('active');
            }
        });
    } else if (!Modernizr || !Modernizr.touch) {
        //do these on hover for non touch devices
        $this.hover(function () {
            var bw = $('#bingo').width(),
				w = $this.width(),
				p = $this.position().left;
            //if we are the last square
            if (w + p + (w * 0.2) >= bw) {
                $this.find('.hidden-content').addClass('end');
            } else {
                $this.find('.hidden-content').removeClass('end');
            }
            $this.addClass('active').siblings().removeClass('active');
        }, function () {
            $this.removeClass('active');
        });
    } else {
        //do these on click for touch devices
        $this.click(function () {
            if ($this.hasClass('active')) {
                $this.removeClass('active');
            } else {
                var bw = $('#bingo').width(),
					w = $this.width(),
					p = $this.position().left;
                //if we are the last square
                if (w + p + (w * 0.2) >= bw) {
                    $this.find('.hidden-content').addClass('end');
                } else {
                    $this.find('.hidden-content').removeClass('end');
                }
                $this.addClass('active').siblings().removeClass('active');
            }
        });
    }
};
DREXEL.applyTab = {
    init: function () {
        $degree = $('#apply-degree');
        $location = $('#apply-location');
        $applyGo = $('#apply-go');
        $degree.change(function () {
            $location.find('option').remove().end();
            $location.removeAttr("disabled");
            switch ($degree.val()) {
                case "Undergraduate":
                    $location.append(
						$('<option />').text("University City Campus").val("http://www.drexel.edu/undergrad/apply/"),
						$('<option />').text("Drexel at Burlington County College").val("http://www.drexel.edu/bcc/admissions/apply/"),
						$('<option />').text("Drexel at Delaware County Community College").val("http://drexel.edu/dccc/"),
						$('<option />').text("Drexel at Montgomery County Community College").val("http://drexel.edu/mccc/"),
						$('<option />').text("Sacramento").val("http://sacramento.drexel.edu/apply/applying-to-drexel/")
					);
                    break;
                case "Graduate Professional":
                    $location.append(
						$('<option />').text("University City Campus").val("http://www.drexel.edu/grad/apply/"),
						$('<option />').text("Queen Lane Campus").val("http://www.drexel.edu/grad/programs/ducom/apply/"),
						$('<option />').text("Drexel at Burlington County College").val("http://www.drexel.edu/bcc/admissions/apply/"),
						$('<option />').text("Drexel at Delaware County Community College").val("http://drexel.edu/dccc/"),
						$('<option />').text("Drexel at Montgomery County Community College").val("http://drexel.edu/mccc/"),
						$('<option />').text("Sacramento").val("http://sacramento.drexel.edu/apply/applying-to-drexel/")
					);
                    break;
                case "Drexel Online":
                    $location.attr("disabled", "disabled");
                    break;
                case "Adult Education":
                    $location.append(
						$('<option />').text("University City Campus").val("http://www.drexel.edu/em/apply/goodwin/"),
						$('<option />').text("Sacramento").val("http://sacramento.drexel.edu/apply/applying-to-drexel/")
					);
                    break;
            }
        });
        $applyGo.click(function (e) {
            e.preventDefault();
            if ($degree.val() == "Drexel Online") {
                window.location = "http://www.drexel.com/online-degrees/apply.aspx";
            }
            else {
                window.location = $location.val();
            }
        });
    }
};
DREXEL.DirectoryQuickSearch = {
    init: function () {
        $('input.people-search-input').keypress(function (event) {
            if (event.which == '13') {
                event.preventDefault();
                DREXEL.DirectoryQuickSearch.doSearch($(this).val());
            }
        });
        $('input.people-search-submit').click(function (e) {
            e.preventDefault();
            DREXEL.DirectoryQuickSearch.doSearch($('input.people-search-input').val());
        });
    },
    doSearch: function (q) {
        location.href = "/search/?t=people&q=" + escape(q);
    }
};
DREXEL.iOSOrientationRefresh = function (){
	if((!navigator.userAgent.match(/CriOS/i)) 
		&& (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i))) {
        jQuery('body').bind('orientationchange',function(event){
                if( window.orientation == 0 || window.orientation == 90)
                    window.location.href = window.location.href;
        });
    }
};
DREXEL.IECompatibilityMode = {
    init: function () {
        var agentStr = navigator.userAgent;
        var compatMode = false;
        if (	(agentStr.indexOf("Trident/6.0") > -1) ||
				(agentStr.indexOf("Trident/5.0") > -1) ||
				(agentStr.indexOf("Trident/4.0") > -1)
			) 
		{
            if (agentStr.indexOf("MSIE 7.0") > -1)
                compatMode = true;
        }
        if (!compatMode) {
            $('#ieCompatDiv').remove();
        }
        else {
            $('#ieCompatDiv').css("display", "block");
        }
    }
};
var menuCumulativeWidth = 0;
var headerHeight = 0;
var id;
var longID;
DREXEL.Wrapper = {
    CenterMenu: function () {
        $(window).resize(function () {
			DREXEL.Wrapper.DoCenterMenu();
			clearTimeout(longID);
			longID = setTimeout(DREXEL.Wrapper.DoCenterMenu, 300);
        });
		
        DREXEL.Wrapper.DoCenterMenu();
		DREXEL.Wrapper.WrapMenus();
    },
    DoCenterMenu: function () {
        DREXEL.isMobile = ($window.width() > 740) ? false : true;
		menuCumulativeWidth = 0;
        if (!DREXEL.isMobile || DREXEL.utility.OlderThanIE9()) {
			$('ul.top-level').removeAttr('style');
			$('#main-nav nav ul.top-level > li').removeAttr("style");
			$('#main-nav nav ul.top-level > li > a').removeAttr("style");
            $('li.section').each(function () {
                menuCumulativeWidth += $(this).outerWidth(true) + 1;
            });
            $('ul.top-level').css("width", menuCumulativeWidth + "px");
            $('ul.top-level').css("margin", "0 auto");
        }
        else {
            $('ul.top-level').removeAttr('style');
        }
    },
    InitFooter: function () {
        DREXEL.Wrapper.PositionFooter();
        $(window).scroll(DREXEL.Wrapper.PositionFooter).resize(DREXEL.Wrapper.PositionFooter);
    },
    PositionFooter: function () {
        $footer = $("#footer");
        footerHeight = $footer.height();
        if (($(document.body).outerHeight() > $(window).height()) || ($footer.css("position") == "fixed" && $(document.body).outerHeight() + footerHeight > $(window).height())) {
            $footer.css({
                position: "relative"
            });
        }
        else {
            $footer.css({
                position: "fixed"
            });
        }
    },
    OverrideSearchBox: function (sitePath) {
        $('#site-search input[type="search"]').unbind("keypress");
        $('#site-search input[type="search"]').keypress(function (event) {
            if (event.which == '13') {
                event.preventDefault();
                location.href = sitePath + "?q=" + escape($(this).val());
            }
        });
    },
    IsWrapper: function () {
        return ($('body.alt-layout').length > 0) ? true : false;
    },
    InitMegaMenus: function () {
		$(window).resize(function () {
			DREXEL.Wrapper.FitMegaMenus();
		});
		DREXEL.Wrapper.FitMegaMenus();
    },
	FitMegaMenus: function() {
		if (!DREXEL.isMobile) {
            $('#main-nav li.mega').each(function () {
                var $ulMega = $(this).children('ul');
                // determine the tallest menu and use it's height to set the height of its siblings
                var hMax = $ulMega.height();
                $('>li', $ulMega).each(function (i, e) {
                    var h = $('>a', e).outerHeight() + $('>ul', e).height();
                    if (h > hMax)
                        hMax = h;
                });
                $ulMega.children('li').height(hMax);
                $ulMega.height(hMax + 10);
				
				var $ulMega = $(this).children('ul');
				// Make sure menu fits in window
				$ulMega.css('left', "0px");
				var ulLeft = parseInt($ulMega.offset().left);
				var ulWidth = parseInt($ulMega.width());
				var windowWidth = parseInt($(window).width());
				if (ulLeft + ulWidth > windowWidth) {
					var offset = windowWidth - (ulLeft + ulWidth);
					$ulMega.css('left', offset.toString() + 'px');
				}
            });
        }
		/*$('#main-nav li.mega').each(function() {
			var $ulMega = $(this).children('ul');
			// Make sure menu fits in window
			$ulMega.css('left', "0px");
			var ulLeft = parseInt($ulMega.offset().left);
			var ulWidth = parseInt($ulMega.width());
			var windowWidth = parseInt($(window).width());
			if (ulLeft + ulWidth > windowWidth) {
				var offset = windowWidth - (ulLeft + ulWidth);
				$ulMega.css('left', offset.toString() + 'px');
			}
		});*/
	},
	WrapMenus: function () {
		headerHeight = $('#header').height();
		
		var supportsOrientationChange = "onorientationchange" in window;
		if(supportsOrientationChange)
		{
			window.addEventListener("orientationchange", function() {
				DREXEL.Wrapper.DoWrapMenus();
			}, false);
		}
		
		$(window).resize(function () {
			DREXEL.Wrapper.DoWrapMenus();
			clearTimeout(id);
			id = setTimeout(DREXEL.Wrapper.DoWrapMenus, 300);
        });
		
        DREXEL.Wrapper.DoWrapMenus();
	},
	DoWrapMenus: function () {
		if((!DREXEL.isMobile || DREXEL.utility.OlderThanIE9()) && !DREXEL.utility.OlderThanIE8() && $('#main-nav').length > 0) {
			$('#main-nav nav').removeAttr("style");
			$('#main-nav nav ul.top-level').removeClass("wrapped");
			$('#main-nav nav ul.top-level > li').removeAttr("style");
			$('#main-nav nav ul.top-level > li > a').removeAttr("style");
			$('#header').removeAttr("style");
			
			if($('#header #logo').length > 0)
			{
				$('#header #logo').removeAttr("style");
				$('#header #site-title').removeAttr("style");
			}
			else if($('#header #lockup').length > 0)
			{
				$('#header #lockup').removeAttr("style");
			}
			$('li.section').removeAttr('style');
			var numOfSections = $('li.section').length;
			if(menuCumulativeWidth > $('#main-nav nav').outerWidth(true))
			{
				$('#main-nav nav ul.top-level').addClass("wrapped");
				$('li.section').css("width", ($('#main-nav nav').outerWidth(true) / numOfSections) + "px");
				$('ul.top-level').css("width", $('#main-nav nav').outerWidth(true));
			}
			var hMax = $('li.section').height();
			$('li.section').each(function () {
				var h = $(this).height();
				if(h > hMax)
					hMax = h;
			});
			
			$('li.section').each(function () {
				var h = $(this).height();
				if(h != hMax)
				{
					var pad = ( hMax - h) / 2;
					var padTop = parseInt($(this).children(":first").css("padding-top"));
					var padBottom = parseInt($(this).children(":first").css("padding-bottom"));
					$(this).children(":first").css("padding-top", (padTop + pad) + "px");
					$(this).children(":first").css("padding-bottom", (padBottom + pad) + "px");
				}
				else
				{
					$(this).children(":first").css("height", hMax + "px");
				}
			});
			var navHeightOld = $('#main-nav nav').height();
			
			$('#main-nav nav').css("height", hMax + "px");
			$('li.section').css("height", hMax + "px");
			$('li.section > ul').css("top", hMax + "px");
			
			var navHeightDifference = $('#main-nav nav').height() - navHeightOld;
			$('#header').css("height", ($('#header').height() + navHeightDifference) + "px");
			
			if($('#header #logo').length > 0)
			{
				$('#header #logo').css("bottom", (parseInt($('#header #logo').css("bottom")) + navHeightDifference) + "px");
				$('#header #site-title').css("bottom", (parseInt($('#header #site-title').css("bottom")) + navHeightDifference) + "px");
			}
			else if($('#header #lockup').length > 0)
			{
				$('#header #lockup').css("bottom", (parseInt($('#header #lockup').css("bottom")) + navHeightDifference) + "px");
			}
		}
		else
		{
			$('#main-nav nav').removeAttr("style");
			$('#main-nav nav ul.top-level').removeClass("wrapped");
			$('#main-nav nav ul.top-level > li').removeAttr("style");
			$('#main-nav nav ul.top-level > li > a').removeAttr("style");
			$('#header').removeAttr("style");
			
			if($('#header #logo').length > 0)
			{
				$('#header #logo').removeAttr("style");
				$('#header #site-title').removeAttr("style");
			}
			else if($('#header #lockup').length > 0)
			{
				$('#header #lockup').removeAttr("style");
			}
		}
	}
};
DREXEL.TouchIE10 = {
    init: function () {
        DREXEL.TouchIE10.HandleMenus();
    },
    HandleMenus: function () {
        $('#main-nav li a.section').each(function () {
            $(this).click(function (event) {
                if ($(this).parent().hasClass("processing")) {
                    $(this).parent().removeClass("processing");
                    event.preventDefault();
                }
            });
            this.addEventListener("MSPointerUp", function (event) {
                if (event.pointerType == event.MSPOINTER_TYPE_TOUCH && !$(this).parent().hasClass("touched")) {
                    event.preventDefault();
                    $(this).parent().siblings().removeClass("touched");
                    $(this).parent().addClass("touched");
                    $(this).parent().addClass("processing");
                }
            });
        });
    }
};
var $window;
$(function () {
    $window = $(window);
    DREXEL.hero.randomStartCheck();
    //initialize hero caption tabs
    $('#hero .tab').css({
        display: 'none'
    }).eq(0).css({
        display: 'block'
    });
    $('#hero .tabs-nav li').append('<span class="arrow-up" />').eq(0).addClass('active');
    $('#hero .tabs-nav li').click(function (e) {
        e.preventDefault();
        var $this = $(this),
			i = $this.index();
        $this.addClass('active').siblings().removeClass('active');
        $this.parents('.tabs').eq(0).find('.tab').css({
            display: 'none'
        }).eq(i).css({
            display: 'block'
        });
        //set the proper height
        var h = $this.parents('.captions').eq(0).find('.caption:visible').outerHeight();
        //log($this.parents('.captions').eq(0).find('.caption:visible'));
        //log(h);
        $this.parents('.captions').eq(0).css({
            height: h
        });
    });
    $window.load(function () {
        DREXEL.isMobile = ($window.width() > 740) ? false : true;
        if (navigator.msMaxTouchPoints && !DREXEL.isMobile) {
            DREXEL.TouchIE10.init();
        }
        if (DREXEL.Wrapper.IsWrapper()) {
            DREXEL.Wrapper.CenterMenu();
            DREXEL.Wrapper.InitFooter();
            DREXEL.Wrapper.InitMegaMenus();
        }
        //open and close follow callout on home page
        if ($('.home-hero').length) {
            $('#follow-callout li:eq(0) a').click();
            window.setTimeout(
			function () {
			    //leave it open for mobile
			    if (!DREXEL.isMobile && $('#follow-callout li:eq(0)').hasClass("on")) {
			        $('#follow-callout li:eq(0) a').click();
			    }
			}, 6000);
        } else {
            //open for mobile
            if (DREXEL.isMobile) {
                $('#follow-callout li:eq(0) a').click();
            }
        }
    }); //window load
    //landing page bingo
    // Move the title square to the top left position for mobile devices
    if (Modernizr && Modernizr.touch && ($window.width() < 740)) {
        $('#bingo .square.title-square').insertBefore('#bingo .square:first-child');
    }
    $('#bingo .square').not('.title-square,.empty-square').each(
		function () {
		    DREXEL.bingosquare($(this));
		});
    //global search label and field
    $('#site-search label').toggle(
	function () {
	    var $this = $(this),
				$input = $this.prev();
	    $this.addClass('open').html('Search -');
	    $input.addClass('open');
	}, function () {
	    var $this = $(this),
				$input = $this.prev();
	    $this.removeClass('open').html('Search +');
	    $input.removeClass('open');
	});
    // Search box event
    $('#site-search input[type="search"]').keypress(function (event) {
        if (event.which == '13') {
            event.preventDefault();
            location.href = "/search/?q=" + escape($(this).val());
        }
    });
    //Main nav h1 click for mobile
    $('#main-nav h1').toggle(
	function () {
	    var $this = $(this),
				$ul = $(this).next();
	    $this.addClass('open');
	    $ul.addClass('open');
	}, function () {
	    var $this = $(this),
				$ul = $(this).next();
	    $this.removeClass('open');
	    $ul.removeClass('open');
	});
    //fix placeholder in IE
    var input = document.createElement("input");
    if (('placeholder' in input) == false) {
        $('[placeholder]').focus(function () {
            var i = $(this);
            if (i.val() == i.attr('placeholder')) {
                i.val('').removeClass('placeholder');
                if (i.hasClass('password')) {
                    i.removeClass('password');
                    this.type = 'password';
                }
            }
        }).blur(function () {
            var i = $(this);
            if (i.val() == '' || i.val() == i.attr('placeholder')) {
                if (this.type == 'password') {
                    i.addClass('password');
                    this.type = 'text';
                }
                i.addClass('placeholder').val(i.attr('placeholder'));
            }
        }).blur().parents('form').submit(function () {
            $(this).find('[placeholder]').each(function () {
                var i = $(this);
                if (i.val() == i.attr('placeholder')) {
                    i.val('');
                }
            });
        });
    }
    //IE7 / Compatibility Mode fixes 
    if ($('html').hasClass('lt-ie8')) {
        $('#main-nav').find('li:last-child').addClass('last');
        $('#center-rail').find('.listing').children('li:last-child').addClass('last'); //PT4 
    };
    //Addresses slider control display issues in IE8 and below
    if ($('html').hasClass('lt-ie9')) {
        if ($('#hero')) {//broken slideshow controls
            $('#hero').parents().removeClass('home-hero').addClass('homeie');
        };
        $('.tabs-nav').children('li:last-child').addClass('last'); //PT3 slideshow tabs
    }
    //doo our inits
    DREXEL.responsiveImage.init();
    DREXEL.bgSlides.init();
    DREXEL.fatFooter.init();
    DREXEL.hero.init();
    DREXEL.calloutTabs.init();
    DREXEL.applyTab.init();
    DREXEL.DirectoryQuickSearch.init();
    DREXEL.IECompatibilityMode.init();
	DREXEL.iOSOrientationRefresh();
    //add swipability to stuff
    if (typeof (Modernizer) !== "undefined" && 'touch' in Modernizer && Modernizr.touch) {
        //
        $('#bingo .square').not('.title-square,.empty-square').each(function () {
            var $this = $(this);
            DREXEL.addswipe({
                el: $this,
                direction: 'x',
                f1: function () {
                    DREXEL.bingosquare($this);
                },
                f2: function () {
                    DREXEL.bingosquare($this);
                }
            });
        });
        //add swipe event which will trigger hero/background and caption to advance
        DREXEL.addswipe({
            el: $('#hero'),
            direction: 'x',
            f1: function () {
                DREXEL.hero.advance(1);
            },
            f2: function () {
                DREXEL.hero.advance();
            }
        });
        //iOS mobile not keeping track of the fixed element so we create an invisible div that sits
        //on top that gets moved via javascript as we scroll, and we listen for swipe on that instead
        /* the way it should be done. add down the track when safari is fixed and support is dropped
        DREXEL.addswipe({
        el: $('#footer'),
        direction: 'y',
        range: 20,
        f1: function () {
        $('#footer').addClass('open');
        },
        f2: function () {
        $('#footer').removeClass('open');
        }
        });
        */
        /*
        window.onscroll = function () {
        setMask();
        };
        var $mask = $('<div id="footer-mask" />').appendTo('body');
        var setMask = function () {
        $mask.css({
        height: $('#footer h2').eq(0).height(),
        width: $('#footer').width(),
        position: 'absolute',
        top: window.pageYOffset + window.innerHeight - $('#footer').height() + 'px',
        left: 0,
        zIndex: 1200,
        background: 'transparent'
        });
        };
        $window.load(function () {
        setMask();
        DREXEL.addswipe({
        el: $mask,
        direction: 'y',
        range: 2,
        f1: function () {
        $('#fat-nav').addClass('open');
        setTimeout(function () {
        setMask();
        }, 500);
        },
        f2: function () {
        $('#fat-nav').removeClass('open');
        setTimeout(function () {
        setMask();
        }, 500);
        }
        });
        });
        */
    } //Modernizer.touch
}); //doc ready