$(document).ready(function () {

    /*--Overflow scroll glitch fix---*/

    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.append(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();

    /*------ MODALS ---------*/
    let renderClickableBG = (isDark, elementToClose, renderParent = $('body'), blockScroll = true, id = "default-clickable-bg") => {
        renderParent.append(`<div class="clickable-bg" id=${id}></div>`);
        if (blockScroll) {
            $('body').css({
                'padding-right': scrollWidth,
                'overflow-y': 'hidden',
            });
        }
        if (isDark) {
            $('.clickable-bg').addClass('clickable-bg--dark').fadeOut(1).fadeIn(400);
        }
        $('.clickable-bg').on('click', function () {
            $(this).remove()
            if (elementToClose[0] === $('.mobile-menu')[0]) {
                let mobToggle = $('.mobile-menu-toggle');
                mobToggle.removeClass('opened')
                toggleMenuIcon(mobToggle);
            }

            if (elementToClose) {
                elementToClose.removeClass('opened');
                if (blockScroll) {
                    $('body').css({
                        'padding-right': 0,
                        'overflow-y': 'auto',
                    });
                }
            }
        })
    }

    const openModal = (modalId) => {
        $('.modal').removeClass('opened')
        let modalToOpen = $(modalId);
        modalToOpen.addClass('opened').fadeOut(1).fadeIn(400);
        renderClickableBG(true, modalToOpen, modalToOpen);
    }

    const closeModal = (modalId) => {
        let modalToClose = $(modalId)
        modalToClose.removeClass('opened');
        $('body').css({
            'padding-right': 0,
            'overflow-y': 'auto',
        });
        modalToClose.find(('.clickable-bg')).remove();
    }

    $(document).on('click', '.js-open-modal', function (e) {
        e.preventDefault();
        let vThis = $(e.target)
        let dataModal = vThis.attr('data-modal');
        openModal(dataModal);
    })

    $(document).on('click', '.js-close-modal', function (e) {
        let vThis = $(e.target);
        closeModal('#' + vThis.parents('.modal')[0].id)
    })


    /*------ MOBILE MENU ---------*/

    let toggleMenuIcon = (icon) => {
        if (icon.hasClass('opened')) {
            icon.find('use').attr('xlink:href', 'img/svg/sprite.svg#close-big');
        } else {
            icon.find('use').attr('xlink:href', 'img/svg/sprite.svg#menu');
        }
    }

    $(document).on('click', '.js-open-mobile-menu', function (e) {
        let vThis = $(e.target);
        let mobileMenu = $('.mobile-menu')
        $('.header__mobile-bottom').toggleClass('opened');
        vThis.toggleClass('opened');
        toggleMenuIcon(vThis);
        if (vThis.hasClass('opened')) {
            renderClickableBG(true, mobileMenu)
        } else {
            $('.clickable-bg').remove();
            $('body').css({
                'padding-right': scrollWidth,
                'overflow-y': 'auto',
            });

        }
        mobileMenu.toggleClass('opened');

    })

    /*------ INPUTS ---------*/

    $(document).on('click', '.js-filter-checkbox', function (e) {
        e.preventDefault();
        let vThis = $(e.target);
        let isChecked = vThis.find('.filters-checkbox').prop('checked');
        vThis.toggleClass('checked').find('.filters-checkbox-label').toggleClass('checked');
        vThis.find('.filters-checkbox').prop('checked', !isChecked);
        let clearFiltersBtn = vThis.parents('form').find('.js-clear-filters');
        if (!clearFiltersBtn.hasClass('visible')) {
            clearFiltersBtn.addClass('visible')
        } else {
            let isAllUnchecked = true;
            vThis.parents('form').find('input.filters-checkbox').each(function () {
                if ($(this).prop('checked')) {
                    isAllUnchecked = false;
                }
            })
            if (isAllUnchecked) {
                clearFiltersBtn.removeClass('visible')
            }
        }
    });

    $(document).on('click', '.js-clear-filters', function (e) {
        e.preventDefault();
        let vThis = $(e.target);
        vThis.parents('form').find('.js-filter-checkbox').removeClass('checked');
        vThis.parents('form').find('.filters-checkbox-label').removeClass('checked');
        vThis.parents('form').find('.filters-checkbox').prop('checked', false);
        vThis.removeClass('visible');
    });


    $(document).on('click', '.js-tabs-control', function (e) {
        let vThis = $(e.target);
        $('.js-tabs-control').removeClass('active');
        vThis.addClass('active');
        vThis.parents('.js-tabs').find('.js-tab').removeClass('active')
        vThis.parents('.js-tabs').find(vThis.attr('data-tab')).addClass('active')
    });

    $(document).on('click', '.js-open-popup', function (e) {
        let vThis = $(e.target);
        $('#popup-bg').remove();
        $('.js-open-popup').removeClass('opened');
        let popup = vThis.parent().find('.js-popup');
        popup.toggleClass('opened');
        renderClickableBG(false, popup, $('body'), false, 'popup-bg');
    })

    $(document).on('click', '.js-custom-select .custom-select-option', function (e) {
        let vThis = $(e.target);
        let optionValue = $(this).text();
        let optionsWrapper = $(this).parents('.custom-select-options');
        let customSelect = $(this).parents('.js-custom-select');
        customSelect.find('.custom-select__value').text(optionValue);
        setTimeout(function () {
            $('#popup-bg').remove();
        }, 50);
        optionsWrapper.removeClass('opened');
        customSelect.find('.custom-select__value').removeClass('default');
        customSelect.find('option').each(function () {
            if ($(this).text() === optionValue) {
                customSelect.find('select').val(optionValue).change();
            }
        })
    })

    $(document).on('click', '.js-toggle', function (e) {
        let vThis = $(e.target);
        vThis.parent().find('.js-toggle').removeClass('active');
        vThis.addClass('active');
    });

    $(document).on('click', '.js-checkbox', function (e) {
        let vThis = $(e.target).parents('.js-checkbox');
        if (e.target.tagName.toLowerCase() !== 'a') {
            e.preventDefault()
            let isChecked = $(this).find('.custom-checkbox').prop('checked');
            vThis.toggleClass('checked').find('.custom-cb-badge').toggleClass('checked');
            vThis.find('.custom-checkbox').prop('checked', !isChecked);
        }
    });

    let elements = document.querySelectorAll("input[type='tel']");
    elements.forEach(function (element) {
        let dynamicMask = IMask(element, {
            mask: [
                {
                    mask: '+{7}(#00)000-00-00',
                    definitions: {
                        '#': /[12345690]/
                    }
                },
                {
                    mask: '{#}(000)000-00-00',
                    definitions: {
                        '#': /[8]/
                    }
                },{
                    mask: '{+#}(000)000-00-00',
                    definitions: {
                        '#': /[+7]/
                    }
                },
            ]
        });
    })

    /*------ SLIDERS ---------*/

    $('.js-program-slider').each(function () {
        $(this).slick({
            centerMode: true,
            centerPadding: '0',
            prevArrow: $(this).parent('.tour-program__slider-wrapper').find('.arrow--prev'),
            nextArrow: $(this).parent('.tour-program__slider-wrapper').find('.arrow--next'),
        });
    });

    $('.js-testimonials-slider').each(function () {
        $(this).slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: $(this).parent('.tour-program__slider-wrapper').find('.arrow--prev'),
            nextArrow: $(this).parent('.tour-program__slider-wrapper').find('.arrow--next'),
            responsive: [
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                    }
                },
            ]

        })
    });


    /*------ MAP ---------*/

    function loadScript(url, callback) {

        var script = document.createElement("script");

        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function init() {
        // Создание карт.
        function prepareMap() {

            let mapJsonPath = 'data/map.json';
            let myGeoObjects = [];
            let objectsCounter = 0;
            $.getJSON(mapJsonPath, function (data) {
                data.forEach(point => {
                    objectsCounter++;
                    let balloonInner =
                        `<div class="custom-balloon">
                                <div class="custom-balloon__bg"></div>
                                <div class="custom-balloon__text"><b>${point.name}</b></div>
                                <div class="custom-balloon__text">${point.address}</div>
                                <div class="custom-balloon__text">Режим работы: ${point.worktime}</div>
                         </div>`

                    let placemark = new ymaps.Placemark(point.coords, {
                            balloonContent: balloonInner,
                        },
                        {
                            hideIconOnBalloonOpen: false,
                            balloonOffset: [27, -44],
                            iconLayout: 'default#image',
                            iconImageHref: 'img/marker.png',
                            iconImageSize: [80, 80],
                        });


                    myGeoObjects.push(placemark)
                })

                var myMap = new ymaps.Map('map-container', {
                    center: data[0].coords,
                    zoom: 15,
                    controls: ['zoomControl'],
                });

                myGeoObjects.forEach(item => {
                    myMap.geoObjects.add(item);
                })
                myMap.behaviors.disable('scrollZoom');

            })


        }

        prepareMap()

    }

    let check_if_load = false;
    const checkLoadMap = () => {
        if (!check_if_load) {
            check_if_load = true;
            loadScript("https://api-maps.yandex.ru/2.1/?apikey=04709a29-6f21-442a-9cb5-272b39900456&lang=ru_RU", function () {
                ymaps.ready(init);
            });
        }
    }

    let checkVisible = (elem, eventName, callback) => {
        let i = 0;
        let elemsNum = elem.length;

        elem.each(function () {
            i = callback($(this), i);
            if (i >= elemsNum) {
                $(document).off(`scroll.${eventName}`);
            }
        });

        $(document).on(`scroll.${eventName}`, function () {
            elem.each(function () {
                i = callback($(this), i);
                if (i >= elemsNum) {
                    $(document).off(`scroll.${eventName}`);
                }
            });
        });
    }

    if ($('#map-container').length > 0) {

        checkVisible($('#map-container'), 'scroll.map-container', function (vThis, i) {
            if (vThis.visible(true) && !vThis.hasClass('visible')) {
                vThis.addClass('visible');
                checkLoadMap();
                i++;
            }
            return i;
        });
    }

    /*------ MISC ---------*/

    $(document).on('click', '.js-close', (e) => {
        $(e.target).parents('.js-closable').slideUp();
    })

    let moveElement = (element, target, screenSize, append = true, after = false) => {
        if (screen.width < screenSize) {
            if (after) {
                for (let i = 0; i < $(element).length; i++) {
                    $(target).eq(i).after($(element).eq($(target).length === 1 ? 0 : i))
                }
            } else {
                if (append) {
                    for (let i = 0; i < $(element).length; i++) {
                        $(element).eq(i).appendTo($(target).eq($(target).length === 1 ? 0 : i))
                    }
                } else {
                    for (let i = 0; i < $(element).length; i++) {
                        $(element).eq(i).prependTo($(target).eq($(target).length === 1 ? 0 : i))
                    }
                }
            }
        }
    }

    moveElement('.header .nav-menu', '.mobile-menu', 991);
    moveElement('.header__advantages', '.mobile-menu', 1199);
    moveElement('.header .small-nav-menu', '.mobile-menu', 991);
    moveElement('.header .small-nav-menu', '.mobile-menu', 991);
    moveElement('.license__image', '.license__box', 1199);

    let initialFoldedHeight = null;
    let initialText = null;
    $(document).on('click', '.js-read-more-toggle', function (e) {
        let vThis = $(e.target);
        let initialHeight = vThis.prev('.js-read-more-wrapper').find($('.js-read-more-container')).height();
        if (!vThis.hasClass('opened')) {
            initialFoldedHeight = vThis.prev('.js-read-more-wrapper').height();
            initialText = vThis.find('.read-more__toggle-text').text()
            vThis.prev('.js-read-more-wrapper').animate({
                height: initialHeight
            }, 300);
            vThis.addClass('opened');
            vThis.find('.read-more__toggle-text').text('Свернуть');
        } else {
            vThis.prev('.js-read-more-wrapper').animate({
                height: initialFoldedHeight
            }, 300);
            vThis.removeClass('opened');
            vThis.find('.read-more__toggle-text').text(initialText);
        }
    });

    $(document).on('click', '.js-accordion', function (e) {
        let vThis = $(e.target),
            sliderWrapper = vThis.siblings('.js-accordion-content').find('.tour-program__slider-wrapper'),
            slider = vThis.siblings('.js-accordion-content').find('.js-program-slider');
        if (!vThis.hasClass('opened')) {
            vThis.addClass('opened');
            vThis.parent().addClass('opened');
            vThis.siblings('.js-accordion-content').slideDown();
            slider.slick('unslick').slick({
                centerMode: true,
                centerPadding: '0',
                prevArrow: sliderWrapper.find('.arrow--prev'),
                nextArrow: sliderWrapper.find('.arrow--next'),
            });
        }
        else {
            vThis.removeClass('opened');
            vThis.parent().addClass('opened');
            vThis.siblings('.js-accordion-content').slideUp();
        }
    });

    $('#tp-date').datepicker({
        range: true,
        multipleDatesSeparator: ' - '
    })

    let scrollTo = (target) => {
        $([document.documentElement, document.body]).animate({
            scrollTop: target.offset().top
        }, 1000);
    }

    $(document).on('click', '.js-scroll-to', function (e) {
        let vThis = $(e.target);
        let target = vThis.attr('data-scroll');
        scrollTo($(target));
    })

    $(document).on('click', '.js-success-btn', function (e) {
        const vThis = $(e.target);
        if (!vThis.hasClass('successful')) {
            vThis.html('<div class="common-btn__icon"><svg class="icon"><use xlink:href="img/svg/sprite.svg#check"></use> </svg></div>Спасибо! Отзыв отправлен на модерацию');
            vThis.addClass('successful')
        }
    })

    const changeHtml = (element, html) => {
        $(element).html()
    }

    $(document).on('click', '.js-close-cookie', function () {
        $('.cookies-disclaimer').removeClass('show');
    });
});


