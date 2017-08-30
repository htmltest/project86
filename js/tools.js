$(document).ready(function() {

    $.validator.addMethod('maskPhone',
        function(value, element) {
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $.validator.addMethod('maskDate',
        function(value, element) {
            return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.filter-title a').click(function(e) {
        $('.filter').toggleClass('closed');
        e.preventDefault();
    });

    $(window).on('load resize', function() {
        updateCalendarMore();
    });

    $('body').on('click', '.calendar-item-more a', function(e) {
        $('.calendar-more').remove();
        var curLink = $(this);
        var curItem = curLink.parents().filter('.calendar-item');
        curItem.find('.calendar-item-link').eq(0).find('a').trigger('click');
        e.preventDefault();
    });

    $('body').on('click', '.calendar-item-link a', function(e) {
        var curLink = $(this);
        var curItem = curLink.parents().filter('.calendar-item');

        if (curItem.find('.calendar-item-link').length == 1) {

            $('.calendar-more').remove();
            curItem.append('<div class="calendar-more"><div class="calendar-more-loading"><div class="loading" style="display:block"></div></div><a href="#" class="calendar-more-close"></a></div>');
            curItem.find('.calendar-more').show().addClass('active');

            $.ajax({
                type: 'POST',
                url: curLink.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.calendar-more').remove();
                curItem.append(html);
                curItem.find('.calendar-more').show().addClass('active');
            });
        } else {
            var curIndex = curItem.find('.calendar-item-link').index(curLink.parent());

            $('.calendar-more').remove();
            var newHTML = '<div class="calendar-more calendar-more-list-outer">' +
                                '<div class="calendar-more-date">' + curItem.find('.calendar-item-day').data('fulldate') + '</div>' +
                                '<div class="calendar-more-list">' +
                                    '<div class="calendar-more-list-inner">' +
                                        '<div class="calendar-more-list-wrap">';

            curItem.find('.calendar-item-link a').each(function() {
                var itemLink = $(this);
                newHTML +=                  '<div class="calendar-more-list-item"><a href="' + itemLink.attr('href') + '">' + itemLink.html() + '</a></div>';
            });

            newHTML +=                      '<div class="calendar-more-list-active"></div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
            curItem.append(newHTML);
            curItem.find('.calendar-more-list-item').eq(curIndex).addClass('active');
            var curActiveTop = 0;
            curItem.find('.calendar-more-list-item').each(function() {
                if (curItem.find('.calendar-more-list-item').index($(this)) < curIndex) {
                    curActiveTop += $(this).outerHeight(true);
                }
            });
            curItem.find('.calendar-more-list-active').css({'top': curActiveTop, 'height': curItem.find('.calendar-more-list-item').eq(curIndex).outerHeight(true)});
            curItem.find('.calendar-more').show().addClass('active');
            curItem.find('.calendar-more-list-item a').eq(curIndex).trigger('click');
            $('.calendar-more-list-inner').jScrollPane({
                autoReinitialise: true
            }).bind(
                'jsp-initialised', function(event, isScrollable) {
                    if ($('.calendar-more-list-inner').hasClass('jspScrollable')) {
                        var scrollAPI = $('.calendar-more-list-inner').data('jsp');
                        if (scrollAPI) {
                            scrollAPI.scrollToElement(curItem.find('.calendar-more-list-item').eq(curIndex), true);
                        }
                    }
                }
            );
        }
        e.preventDefault();
    });

    $(window).on('resize', function() {
        $('.calendar-more').remove();
    });

    $('body').on('click', '.calendar-more-list-item a', function(e) {
        var curLink = $(this);
        var curItem = curLink.parents().filter('.calendar-item');

        curItem.find('.calendar-more-text').remove();
        curItem.append('<div class="calendar-more calendar-more-text"><div class="calendar-more-loading"><div class="loading" style="display:block"></div></div><a href="#" class="calendar-more-close"></a></div>');
        curItem.find('.calendar-more').show().addClass('active');

        $.ajax({
            type: 'POST',
            url: curLink.attr('href'),
            dataType: 'html',
            cache: false
        }).done(function(html) {
            curItem.find('.calendar-more-text').remove();
            curItem.append(html);
            curItem.find('.calendar-more').show().addClass('active');
            curItem.find('.calendar-more-list-item.active').removeClass('active');
            curLink.parent().addClass('active');
            var curIndex = curItem.find('.calendar-more-list-item').index(curLink.parent());
            curItem.find('.calendar-more-text').prepend('<div class="calendar-more-text-mobile-ctrl">' + (curIndex + 1) + '/' + curItem.find('.calendar-more-list-item').length + '<a href="#" class="calendar-more-text-mobile-prev"></a><a href="#" class="calendar-more-text-mobile-next"></a></div>');
            var curActiveTop = 0;
            curItem.find('.calendar-more-list-item').each(function() {
                if (curItem.find('.calendar-more-list-item').index($(this)) < curIndex) {
                    curActiveTop += $(this).outerHeight(true);
                }
            });
            curItem.find('.calendar-more-list-active').animate({'top': curActiveTop, 'height': curItem.find('.calendar-more-list-item').eq(curIndex).outerHeight(true)});
        });
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.calendar-more').length == 0 && !$(e.target).parent().hasClass('calendar-item-more') && !$(e.target).parent().hasClass('calendar-item-link')) {
            $('.calendar-more').remove();
        }
    });

    $('body').on('click', '.calendar-more-close', function(e) {
        $('.calendar-more').remove();
        e.preventDefault();
    });

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('.header-mobile-link').click(function(e) {
        $('html').toggleClass('header-mobile-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-mobile').length == 0 && !$(e.target).hasClass('header-mobile') && !$(e.target).hasClass('header-mobile-link')) {
            $('html').removeClass('header-mobile-open');
        }
    });

    $('.side-mobile-link').click(function(e) {
        if ($('html').hasClass('side-mobile-open')) {
            $('html').removeClass('side-mobile-open');
            $('.wrapper').css({'top': 'auto'});
            $(window).scrollTop($('.wrapper').data('scrollTop'));
        } else {
            $('.wrapper').css({'top': -$(window).scrollTop()}).data('scrollTop', $(window).scrollTop());
            $('html').addClass('side-mobile-open');
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.side').length == 0 && !$(e.target).hasClass('side') && !$(e.target).hasClass('side-mobile-link')) {
            $('html').removeClass('side-mobile-open');
        }
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({scrollTop: 0})
        e.preventDefault();
    });

    $('.profile-block-param-value-new input').each(function() {
        var curInput = $(this);
        if (curInput.attr('id') != '') {
            curInput.attr('id', curInput.attr('id') + '_');
        }
    });

    $('body').on('click', '.edit-link', function(e) {
        var curBlock = $(this).parents().filter('.profile-block');

        var curPadding = $('.wrapper').width();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        if ($('.window').length > 0) {
            $('.window').remove();
        }

        var windowHTML =    '<div class="window-profile">' +
                                '<h1>' + curBlock.find('.profile-block-title').html() + '</h1>' +
                                '<form action="' + $(this).attr('href') + '" method="post" class="novalidate">';

        curBlock.find('.profile-block-param').each(function() {
            var curField = $(this);
            if (curField.find('.maskDate').length > 0) {
                windowHTML +=       '<div class="form-row">' +
                                        '<div class="form-field">' +
                                            '<div class="form-input form-input-date"><span>' + curField.find('.profile-block-param-title').html() + '</span>' + curField.find('.profile-block-param-value-new').html() + curField.find('.profile-block-param-value-new').html() + '</div>' +
                                        '</div>' +
                                    '</div>';
            } else {
                windowHTML +=       '<div class="form-row">' +
                                        '<div class="form-field">' +
                                            '<div class="form-input"><span>' + curField.find('.profile-block-param-title').html() + '</span>' + curField.find('.profile-block-param-value-new').html() + curField.find('.profile-block-param-value-new').html() + '</div>' +
                                        '</div>' +
                                    '</div>';
            }
        });

        windowHTML +=               '<div class="form-row">' +
                                        '<div class="form-field">' +
                                            '<div class="cols">' +
                                                '<div class="col-half">' +
                                                    '<div class="form-submit">' +
                                                        '<input type="submit" value="Сохранить" class="btn-submit" />' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</form>' +
                            '</div>';

        $('body').append('<div class="window"><div class="window-loading"></div></div>');
        $('.window').append('<div class="window-container"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>');
        $('.window').data('curBlock', curBlock);

        $('.window .form-input').each(function() {
            var curInput = $(this).find('input').eq(0);
            if (curInput.attr('id') != '') {
                curInput.attr('id', curInput.attr('id').slice(0, -1));
            }
        });

        $('.window .form-input').each(function() {
            var curInput = $(this).find('input').eq(1);
            curInput.hide();
            if (curInput.attr('id') != '') {
                curInput.attr('id', curInput.attr('id') + 'old');
            }
            if (curInput.attr('name') != '') {
                curInput.attr('name', curInput.attr('name') + '_old');
            }
        });

        windowPosition();

        $(window).resize(function() {
            windowPosition();
        });

        $('.window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').on('keyup', function(e) {
            if (e.keyCode == 27) {
                windowClose();
            }
        });

        $('.window form').each(function() {
            var curForm = $(this);
            initForm(curForm);
            curForm.validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();
                    checkErrors();
                },
                submitHandler: function(form) {
                    $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        dataType: 'json',
                        data: $(form).serialize(),
                        cache: false
                    }).complete(function(data) {
                        var obj = $.parseJSON(data.responseText);
                        curForm.find('.form-success, .form-error').remove();
                        if (obj.s == '1') {
                            curForm.prepend('<div class="form-success"><div class="form-success-title">' + obj.m + '</div></div>');
                            var curBlock = $('.window').data('curBlock');
                            curBlock.find('.profile-block-param').each(function() {
                                var curField = $(this);
                                var curIndex = curBlock.find('.profile-block-param').index(curField);
                                var curValue = $('.window .form-input').eq(curIndex).find('input').val();
                                curField.find('.profile-block-param-value').html(curValue);
                                curField.find('.profile-block-param-value-new input').attr('value', curValue);
                            });
                            $('.window .form-row').remove();
                            windowPosition();
                        } else {
                            curForm.prepend('<div class="form-error"><div class="form-error-title">' + obj.m + '</div></div>');
                        }
                    });
                }
            });
        });

        $(document).click(function(e) {
            if ($(e.target).hasClass('window')) {
                windowClose();
            }
        });

        e.preventDefault();
    });

});

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
    $('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });
});

function initForm(curForm) {
    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });

    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent().parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    var dateFormat = 'dd.mm.yy';
    curForm.find('.form-input-date input').datepicker({
        dateFormat: dateFormat
    });
    window.setInterval(function() {
        $('.form-input-date input').each(function() {
            if ($(this).val() != '') {
                $(this).parent().addClass('focus');
            }
        });
    }, 100);

    if (curForm.hasClass('window-form')) {
        curForm.validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();
                checkErrors();
            },
            submitHandler: function(form) {
                windowOpen($(form).attr('action'), $(form).serialize());
            }
        });
    } else {
        if (!curForm.hasClass('novalidate')) {
            curForm.validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();
                    checkErrors();
                }
            });
        }
    }
}

function checkErrors() {
    $('.form-input').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0 || curField.find('textarea.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0 || curField.find('textarea.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });

    $('.form-checkbox, .form-file').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });

    $('.form-select').each(function() {
        var curField = $(this).parent().parent();
        if (curField.find('select.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('select.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}

function windowOpen(linkWindow, dataWindow) {
    var curPadding = $('.wrapper').width();
    $('html').addClass('window-open');
    curPadding = $('.wrapper').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});

    if ($('.window').length > 0) {
        $('.window').remove();
    }

    $('body').append('<div class="window"><div class="window-loading"></div></div>')

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

            if ($('.window-container img').length > 0) {
                $('.window-container img').each(function() {
                    $(this).attr('src', $(this).attr('src'));
                });
                $('.window-container').data('curImg', 0);
                $('.window-container img').load(function() {
                    var curImg = $('.window-container').data('curImg');
                    curImg++;
                    $('.window-container').data('curImg', curImg);
                    if ($('.window-container img').length == curImg) {
                        $('.window-container').removeClass('window-container-load');
                        windowPosition();
                    }
                });
            } else {
                $('.window-container').removeClass('window-container-load');
                windowPosition();
            }

            $(window).resize(function() {
                windowPosition();
            });

            $('.window-close').click(function(e) {
                windowClose();
                e.preventDefault();
            });

            $('body').on('keyup', function(e) {
                if (e.keyCode == 27) {
                    windowClose();
                }
            });

            $('.window form').each(function() {
                initForm($(this));
            });

            $(document).click(function(e) {
                if ($(e.target).hasClass('window')) {
                    windowClose();
                }
            });
        }
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 60) {
            $('.window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
    }
}

function updateCalendarMore() {
    $('.calendar-list').each(function() {
        var curList = $(this);
        curList.find('.calendar-item').each(function() {
            var curItem = $(this);
            curItem.removeClass('have-more');
            curItem.find('.calendar-item-more').remove();
            var curLinksMore = curItem.find('.calendar-item-link:hidden').length;
            if (curLinksMore > 0) {
                curItem.addClass('have-more');
                curItem.find('.calendar-item-content').append('<div class="calendar-item-more"><a href="#">+ ' + (curLinksMore) + ' события</a></div>');
            }
        });
    });
}

$(window).on('load resize scroll', function() {
    if ($(window).scrollTop() > $(window).height()) {
        $('.up-link').css({'right': 25});
    } else {
        $('.up-link').css({'right': 9999});
    }
});