var
    /**
     * Shuffles array in place.
     * @param {Array} a items The array containing the items.
     * @url https://stackoverflow.com/a/6274381
     */
    array_shuffle = function(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    },
    game_board = {
        'height': function() {
            return parseInt($('#game').height() - ($('nav').length === 0 ? 0 : $('nav').outerHeight()), 10);
        },
        'width': function() {
            return parseInt($('#game').width(), 10);
        }
    },
    target_image = {
        'url': function() {
            return 'url("' + $('#image').val() + '")';
        },
        'realWidth': function() {
            return $('#image').find(':selected').attr('data-width');
        },
        'realHeight': function() {
            return $('#image').find(':selected').attr('data-height');
        },
    },
    game_puzzle = {
        'start': null,
        'tiles': [],
        'defaults': {
            'player': 'Joueur 1',
            'border': 5,
            'columns': 3,
            'rows': 2,
            'tolerance': 50,
            'tileOpacity': 0.75,
            'backgroundOpacity': 0.4,
            'clickToDrag': true,
        },
        'settings': {},
        'shutdown': function() {
            $('#game .tile, #game .tile-correct').remove();
            $('#target').remove();
            this.tiles = [];
        },
        'apply': function() {
            this.shutdown();
            this.refresh();
        },
        'reset': function() {
            this.settings = $.extend({}, this.defaults);
            this.shutdown();
            this.init();
        },
        'refresh': function() {
            var game_puzzle = this;
            $.each(game_puzzle.settings, function(key) {
                var field = $('#'+key),
                    value = field ? $(field).val() : null
                ;

                if (value) {
                    if (value.match(/^[0-9]+$/)) {
                        value = parseInt(value, 10);
                    } else if (value.match(/^[0-9]+\.[0-9]+$/)) {
                        value = parseFloat(value);
                    }
                    game_puzzle.settings[key] = value;
                }
            });

            var game_puzzle = this,
                availableHeight = parseInt((game_board.height() - game_puzzle.settings.border) * game_puzzle.settings.rows / (game_puzzle.settings.rows + 1), 10),
                ratioWidth = target_image.realWidth() / game_board.width(),
                ratioHeight = target_image.realHeight() / availableHeight,
                ratio = Math.max(ratioWidth, ratioHeight),
                target,
                row,
                col,
                tileHeight,
                tileWidth,
                initialize = $('#target').length === 0;

            if (initialize === true) {
                $('#message').remove();
                target = $('<div id="target"></div>')
                    .css({
                        'background-image': target_image.url(),
                        'opacity': game_puzzle.settings.backgroundOpacity
                    })
                ;

                $('#game').append($(target));

                for (row = 0; row < game_puzzle.settings.rows; row++) {
                    for (col = 0; col < game_puzzle.settings.columns; col++) {
                        (function (game_puzzle, row, col) {
                            var tile;
                            tile = $('<div class="tile">');
                            $(tile)
                                .attr('data-col', col)
                                .attr('data-row', row)
                                .css({
                                    'background-image': target_image.url(),
                                    'background-position': '-' + (col * tileWidth) + 'px -' + (row * tileHeight) + 'px',
                                });

                            game_puzzle.tiles.push(tile);
                        })(this, row, col);
                    }
                }

                // Randomize + append
                array_shuffle(game_puzzle.tiles);

                $.each(game_puzzle.tiles, function(index) {
                    $('#game').append(game_puzzle.tiles[index]);
                });
            } else {
                target = $('#target');
            }

            target.css({'background-image': target_image.url()})
                .width(Math.round(target_image.realWidth() / ratio))
                .height(Math.round(target_image.realHeight() / ratio));

            tileWidth = Math.round($(target).width() / game_puzzle.settings.columns);
            tileHeight = Math.round($(target).height() / game_puzzle.settings.rows);

            // Position
            $('#game .tile').each(function(index, tile) {
                var col = $(tile).attr('data-col'),
                    row = $(tile).attr('data-row');

                $(tile).css({
                    'left': (game_puzzle.settings.border + (index * (tileWidth + game_puzzle.settings.border))) + 'px',
                    'top': $('#target').position().top + $('#target').height() + game_puzzle.settings.border,
                    'width': tileWidth,
                    'height': tileHeight,
                    'background-position': '-' + (col * tileWidth) + 'px -' + (row * tileHeight) + 'px',
                    'background-size': $(target).width() + 'px ' + $(target).height() + 'px',
                });
            });

            // https://jqueryui.com/draggable/
            // https://api.jqueryui.com/draggable/
            $('.tile')
                .draggable({
                    'opacity': this.settings.tileOpacity,
                    'revert': true,
                    'scroll': false
                });

                if ($('#clickToDrag').is(':checked') === true) {
                    // @see: https://stackoverflow.com/a/56590231
                    $('.tile')
                        .click(function(event) {
                            if ($(this).hasClass('dragging')) {
                                $(this).removeClass('dragging');
                                event.type = 'mouseup.draggable';
                                event.target = this;
                                $(this).trigger(event);
                            } else {
                                $(this).addClass('dragging');
                                event.type = 'mousedown.draggable';
                                event.target = this;
                                $(this).trigger(event);
                            }
                        });
                }

                if (initialize === true) {
                    game_puzzle.start = new Date();
                }
        },
        'init': function () {
            var game_puzzle = this;
            game_puzzle.settings = $.extend({}, game_puzzle.defaults); // @todo: or stored

            // Import settings
            $.each(game_puzzle.settings, function(key) {
                var field = $('#'+key);
                if (field) {
                    if ($(field).is('input[type=checkbox]')) {
                        $(field).prop('checked', game_puzzle.settings[key] === true);
                    } else {
                        $(field).val(game_puzzle.settings[key]);
                    }
                }
            });

            game_puzzle.refresh();

            // https://jqueryui.com/droppable/
            // https://api.jqueryui.com/droppable/
            $('#game').droppable({
                'drop': function (event, ui) {
                    var tile = $(ui.draggable),
                        target = {
                            'left': $('#target').offset().left + (tile.attr('data-col') * tile.width()),
                            'top': $('#target').offset().top + (tile.attr('data-row') * tile.height())
                        },
                        correct = (
                            (ui.position.left - game_puzzle.settings.tolerance <= target.left)
                            && (ui.position.left + game_puzzle.settings.tolerance >= target.left)
                            && (ui.position.top - game_puzzle.settings.tolerance <= target.top)
                            && (ui.position.top + game_puzzle.settings.tolerance >= target.top)
                        );

                    if (correct === true) {
                        $(tile)
                            .draggable({
                                disabled: true,
                                revert: false
                            })
                            .draggable('destroy')
                            .css({'opacity': 1})
                            .attr('class', 'tile-correct');

                        tile.animate({
                            'left': target.left + 'px',
                            'top': target.top + 'px'
                        });

                        game_puzzle.refresh();

                        if ($('.tile').length === 0) {
                            game_puzzle.onSuccess();
                        }
                    }
                }
            });

            $(window).resize(function () {
                game_puzzle.refresh();
            });
        },
        'onSuccess': function() {
            var game_puzzle = this,
                seconds = parseInt((new Date().getTime() - game_puzzle.start.getTime())/1000, 10),
                msgstr = "Bravo " + game_puzzle.settings.player + ", tu as terminé le puzzle en " + seconds + " secondes",
                message = $('<h1 id="message"></h1>').text(msgstr);

            $('#target').after(message);
        }
    };
