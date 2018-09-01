var _jq = (jQuery || django.jQuery)

(function ($) {
    "use strict";
    // store for keeping all the select2 widget ids for fail-safe parsing later
    var _all_easy_select2_ids = [];
    /**
     * passing the current element to initialize and the options to initialize with
     * @param $el - Jquery object to initialize with select2
     * @param obj - select2 constructor options
     */
    function redisplay_select2($el, obj){
        var $selectEle = $("#" + $el.attr('id'));
        if($selectEle.hasClass("select2-hidden-accessible")){
            $selectEle.select2('destroy').select2(obj);
        } else{
            $selectEle.select2(obj);
        }
        $selectEle.change(function (e) {
            var $pencilEle = $('#change_'+$(this).attr('id'));

            if($pencilEle.length < 1 ) return;

            $pencilEle.attr('href',
                $pencilEle.attr('data-href-template').replace('__fk__', $(this).val())
            );
        });
        _all_easy_select2_ids.push($el.attr('id'));
    }

    /**
     * core function call for easy_select2
     * @param options - select2 constructor properties
     */
    function add_select2_handlers(options){


        $('div.field-easy-select2:not([id*="__prefix__"])').each(function(){
            // taking data-* for select2 constructor properties for backward compatibility
            var obj = $(this).data();

            // merging the options and data properties, modifying the first
            // NOTE: obj properties will be overwritten by options
            // https://api.jquery.com/jquery.extend/
            $.extend(obj, options);
            redisplay_select2($(this), obj);
        });

        $(document).bind('DOMNodeInserted', function (e) {
            var $changedEle = $(e.target);

            if(!$changedEle.parentsUntil('select').length < 1) return;

            var $select2Eles = $(e.target).find('div.field-easy-select2:not([id*="__prefix__"])');
            if($select2Eles.length) {
                 $(e.target).find('div.field-easy-select2:not([id*="__prefix__"])').each(function () {
                     // taking data-* for select2 constructor properties for backward compatibility
                    var obj = $(this).data();
                    // merging the options and data properties, modifying the first
                    // NOTE: obj properties will be overwritten by options
                    // https://api.jquery.com/jquery.extend/

                     $.extend(obj, options);
                     redisplay_select2($(this), obj);
                 });
            } else {
                $.each(_all_easy_select2_ids, function(idx, val){
                    var obj = $("#" + val).data();
                    $.extend(obj, options);
                    $("#" + val).select2('destroy').select2();
                });
            }
        });
    }

    /**
     * JQuery plugin for django-easy-select2
     * @param options - object containing select2 constructor properties
     */
    $.fn.easy_select = function(options){
        add_select2_handlers(options);
    };

}(jQuery || django.jQuery));