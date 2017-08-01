$(document).ready(function() {

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

    $('.form-input input').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    $('.form-input input').focus(function() {
        $(this).parent().addClass('focus');
    });

    $('.form-input input').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

});

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
});

function initForm(curForm) {
    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
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