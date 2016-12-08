!function ($) {
    "use strict";

    var RatingTopTraders = (function () {
        var instance = null,
            action = null,
            container = null;

        var items = {},
            steps = [],
            icount = 0;

        var tmAllMax  = 40000,
            tmItemMin = 3000,
            tmItemMax = 8000,
            tmAll = 0;

        return {
            instance : function () {
                if (null == instance) {
                    instance = this;
                }

                return instance;
            },

            init: function ( options ) {
                $.ajaxSetup({ cache: false });

                if (undefined !== options.action) {
                    action = options.action;
                }

                if (undefined !== options.containerName) {
                    container = $(options.containerName);
                }

                $(window).resize(function () {
                    instance._buildList();
                });

                instance._load(function () {
                    var pos = 0;

                    for (var id in items) {
                        container.append(instance._getHtmlItem(pos++, items[id]));
                        icount++;
                    }

                    instance._buildList();
                    instance._run(20000);
                });
            },

            _load: function ( onLoad ) {
                $.getJSON(action, function ( json ) {

                   // for test
                   // items = {"response":{"i05":{"equity":100},"i10":{"equity":95},"i15":{"equity":90},"i20":{"equity":85},"i25":{"equity":80},"i30":{"equity":75},"i40":{"equity":70},"i45":{"equity":65}}};
                   // items = items.response;
                   // json  = {"response":{"i15":{"equity": 99},"i10":{"equity":97},"i25":{"equity":89},"i05":{"equity":83},"i20":{"equity":82},"i35":{"equity":74},"i50":{"equity":69},"i40":{"equity":65},"i55":{"equity":263},"i60":{"equity":73},"i65":{"equity":12}}};

                    var newitems = json.response,
                        ids = Object.keys(items);

                    steps = []; // reset

                    if (ids.length > 0) {
                        var oldlist = [],
                            tmplist = [],
                            newinsert = [];

                        var newids = Object.keys(newitems);

                        // mark items in the old array
                        for (var i = 0; i < ids.length; i++) {
                            oldlist[i] = [ids[i], 'remove']; // id, tag
                            tmplist[i] = [ids[i], items[ids[i]].equity]; // id, equity

                            if (i < newids.length) {
                                if (newids[i] == ids[i] || undefined !== newitems[ids[i]]) {
                                    oldlist[i][1] = 'ok'; // 1 - tag
                                }
                            }
                        }

                        // random mixing
                        var count = oldlist.length;
                        for (var i = 0; i < count; i++) {
                            var j = Math.floor(Math.random() * count);

                            if (i != j) {
                                var value = oldlist[i];
                                oldlist[i] = oldlist[j];
                                oldlist[j] = value;
                            }
                        }

                        // search new items in the new array
                        for (var i = 0; i < newids.length; i++) {
                            // if of the item from the new array not in the old array
                            if (undefined === items[newids[i]]) {
                                newinsert.push(newids[i]);
                            }
                        }

                        // console.log(items);
                        // console.log(newitems);
                        // console.log(oldlist);

                        for (var i = 0; i < oldlist.length; i++) {
                            var id = oldlist[i][0],
                                pos = instance._findPosition(id, tmplist);

                            if ('ok' == oldlist[i][1]) { // 1 - tag
                                if (newitems[id].equity != tmplist[pos][1]) { // 1 - equity
                                    var direct = newitems[id].equity > tmplist[pos][1] ? 1 : -1;
                                    steps.push([id, pos, instance._setToPosition(pos, id, newitems[id].equity, tmplist), direct, 'update']);
                                }
                            } else { // if ('remove' == oldlist[i][1]) { // 1 - equity
                                if (newinsert.length > 0) {
                                    var newid = newinsert.shift();
                                    tmplist[pos][0] = newid; // 0 - id
                                    steps.push([newid, pos, instance._setToPosition(pos, newid, newitems[newid].equity, tmplist), 0, 'update']); // replace
                                } else {
                                    tmplist.splice(pos, 1);
                                    steps.push([id, pos, -1, 0, 'remove']);
                                }
                            }

                            // console.log(tmplist);
                        }

                        // adding new items in the list
                        do {
                            var newid = newinsert.shift();

                            if (undefined === newid) {
                                break;
                            }

                            var item = [newid, newitems[newid].equity],
                                pos = -1;

                            for (var i = 0; i < tmplist.length; i++) {
                                if (tmplist[i][1] < item[1]) { // 1 - equity
                                    pos = i;
                                    break;
                                }
                            }

                            if (pos >= 0) {
                                tmplist.splice(pos, 0, item);
                            } else {
                                pos = tmplist.push(item);
                            }

                            steps.push([newid, pos, -1, 0, 'insert']);

                            // console.log(tmplist);
                        }
                        while (true);
                    }

                    // console.log(steps);

                    items = newitems;
                    onLoad();
                });
            },

            _buildList: function () {
                var totalHeight = 0;

                for (var i = 0; i < icount; i++) { // 5 - count
                    totalHeight += $('#riid' + i, container)
                                       .css({top: totalHeight})
                                       .outerHeight();
                }

                container.css({'min-height': totalHeight});
            },

            _run: function ( timeout ) {
                window.setTimeout(function () {
                    instance._load(function () {
                        tmAll = tmAllMax;
                        instance._refreshItem(0, function () {
                            // console.log('tmAll = ' + tmAll);
                            instance._run(Math.max(tmAll, 1));
                        });
                    });
                }, timeout);
            },

            _refreshItem: function ( step, onRefresh ) {
                if (step < steps.length) {
                    var id  = steps[step][0],
                        pos = steps[step][1],
                        pos2 = steps[step][2],
                        tmItem = Math.floor(Math.random() * (tmItemMax - tmItemMin + 1)) + tmItemMin;
                        // console.log('tmItem = ' + tmItem);

                    switch (steps[step][4]) { // 1 - tag
                        case 'update':
                            instance._markItem(pos, steps[step][3]); // 3 - direct
                            instance._updateHtmlItem(pos, items[id]);
                            instance._moveHtmlItem(pos, pos2);
                            window.setTimeout(function () {
                                instance._unmarkItem(pos2, steps[step][3]); // 3 - direct
                            }, 1200);
                            break;

                        case 'insert':
                            instance._insertHtmlItem(pos, items[id]);
                            break;

                        case 'remove':
                            instance._removeHtmlItem(pos);
                            break;
                    }

                    instance._buildList();

                    window.setTimeout(function () {
                        instance._refreshItem(step + 1, onRefresh);
                        tmAll -= tmItem; // decriment the total timeout
                    }, tmItem);
                } else {
                    onRefresh();
                }
            },

            _findPosition: function ( id, gids ) {
                for (var i = 0; i < gids.length; i++) {
                    if (id == gids[i][0]) { // 0 - id
                        return i;
                    }
                }

                return -1;
            },

            // set the item to calculated position in the list
            _setToPosition: function ( pos, id, equity, gids ) {
                if (-1 != pos) {
                    gids[pos][1] = equity; // 1 - equity

                    while (pos < gids.length - 1) {
                        if (gids[pos][1] > gids[pos + 1][1]) {
                            break;
                        }

                        var value = gids[pos];
                        gids[pos] = gids[pos + 1];
                        gids[pos + 1] = value;
                        pos++;
                    }

                    while (pos > 0) {
                        if (gids[pos][1] < gids[pos - 1][1]) {
                            break;
                        }

                        var value = gids[pos - 1];
                        gids[pos - 1] = gids[pos];
                        gids[pos] = value;
                        pos--;
                    }
                }

                return pos;
            },

            _getHtmlItem: function ( pos, item ) {
                var words = {trader: $('#ratingId').data('trader'),
                             asset: $('#ratingId').data('asset'),
                             instrument: $('#ratingId').data('instrument'),
                             date: $('#ratingId').data('date')};

                var itemHtml = '\
                    <div id="riid' + pos + '" class="item tr">\
                        <div class="td number">\
                            <span class="number_wrap">' + (pos + 1) + '</span>\
                        </div>\
                        <div class="td name">\
                            <p class="field_title">' + words.trader + '</p>\
                            <p class="the_name">' + item.name + '</p>\
                            <p class="location"><i class="icon icon-marker"></i><span>' + item.country + '</span></p>\
                        </div>\
                        <div class="td capital tac">\
                            <span class="dollar_icon">$</span> <span class="the_amount">' + instance.moneyFormat(item.equity) + '</span>\
                        </div>\
                        <div class="td trade_active tac">\
                            <p class="field_title">' + words.asset + '</p>\
                            <p class="the_trade_active">' + item.asset + '</p>\
                        </div>\
                        <div class="td instruments tac">\
                            <p class="field_title">' + words.instrument + '</p>\
                            <p class="the_instrument">\
                                <span class="wrap_blue">' + item.instrument + '</span>\
                            </p>\
                        </div>\
                        <div class="td updated">\
                            <p class="field_title">' + words.date + '</p>\
                            <p class="the_updated">' + item.date + '</p>\
                        </div>\
                    </div>';

                return itemHtml;
            },

            _insertHtmlItem: function ( pos, item ) {
                // :TODO:
                // icount++;
            },

            _updateHtmlItem: function ( pos, item ) {
                var div = $('#riid' + pos);

                $('.the_name', div).text(item.name);
                $('.location span', div).text(item.country);
                $('.the_amount', div).text(instance.moneyFormat(item.equity));
                $('.the_trade_active', div).text(item.asset);
                $('.the_instrument span', div).text(item.instrument);
                $('.the_updated', div).text(item.date);
            },

            _moveHtmlItem: function ( pos, pos2 ) {
                if (pos == pos2/* || pos < 0 || pos2 < 0*/) {
                    return;
                }

                $('#riid' + pos + ' .number_wrap').text(pos2 + 1);
                $('#riid' + pos).prop('id', 'riid-tmp');

                // reindex of items changed positions
                if (pos2 > pos) {
                    for (var i = pos + 1; i <= pos2; i++) {
                        $('#riid' + i + ' .number_wrap').text(i);
                        $('#riid' + i).prop('id', 'riid' + (i - 1));
                    }
                } else {
                    for (var i = pos - 1; i >= pos2; i--) {
                        $('#riid' + i + ' .number_wrap').text(i + 2);
                        $('#riid' + i).prop('id', 'riid' + (i + 1));
                    }
                }

                $('#riid-tmp').prop('id', 'riid' + pos2);
            },

            _removeHtmlItem: function ( pos ) {
                $('#riid' + pos).remove();

                // reindex of items changed positions
                for (var i = pos + 1; i < icount; i++) { // 5 - count
                    $('#riid' + i + ' .number_wrap').text(i);
                    $('#riid' + i).prop('id', 'riid' + (i - 1));
                }

                icount--;
            },

            _markItem: function ( pos, direct ) {
                 var cssClass = 'yell';

                 if (direct > 0) {
                     cssClass = 'green';
                 } else if (direct < 0) {
                     cssClass = 'red';
                 }
                 
                 $('#riid' + pos).addClass(cssClass);
            },

            _unmarkItem: function ( pos, direct ) {
                var cssClass = 'yell';

                if (direct > 0) {
                    cssClass = 'green';
                } else if (direct < 0) {
                    cssClass = 'red';
                }

                $('#riid' + pos).removeClass(cssClass);
            },

            moneyFormat: function ( value ) {
                value = value.toString();

                for (var i = value.length - 1 - 3; i >= 0; i -= 3) {
                    value = value.slice(0, i + 1) + ',' + value.slice(i + 1);
                }

                return value;
            }
        }
    })();

    $.RatingTopTraders = RatingTopTraders.instance();

    $.RatingTopTraders.init({action: '/options/rating.php',
                             containerName: '.best_traiders .traiders'});

}(window.jQuery);