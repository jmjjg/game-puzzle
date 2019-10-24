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
        'border': 5,
        'height': function() {
            var real = $('#game').height() - ($('nav').length === 0 ? 0 : $('nav').outerHeight());
            return parseInt((real - this.border) * 2 / 3, 10);
        },
        'width': function() {
            return parseInt($('#game').width(), 10);
        }
    },
    target_image = {
        'url': function() {
            return 'url("src/img/img-001.jpg")';
        },
        'realWidth': function() {
            return 1436;
        },
        'realHeight': function() {
            return 805;
        },
    },
    game_puzzle = {
        'tiles': [],
        'settings': {
            'player': 'Joueur 1',
            'columns': 3,
            'rows': 2,
            'tolerance': 50,
            'opacity': 0.75
        },
        'refresh': function() {
            var game_puzzle = this;

            if ($('#target').length === 0) {
                var target = $('<div id="target"></div>'),
                    ratioWidth = target_image.realWidth() / game_board.width(),
                    ratioHeight = target_image.realHeight() / game_board.height(),
                    ratio = Math.max(ratioWidth, ratioHeight);

                $(target).css({
                    'background-image': target_image.url()
                })
                $(target).width(target_image.realWidth() / ratio);
                $(target).height(target_image.realHeight() / ratio);

                $('#game').append($(target));
            }

            var target = $('#target'),
                ratioWidth = target.width() / game_board.width(),
                ratioHeight = target.height() / game_board.height(),
                ratio = Math.max(ratioWidth, ratioHeight),
                row,
                col,
                tileHeight,
                tileWidth,
                game_puzzle = this;

            $(target).width($(target).width() / ratio);
            $(target).height($(target).height() / ratio);

            targetWidth = Math.round($(target).width());
            targetHeight = Math.round($(target).height());
            tileWidth = Math.round($(target).width() / game_puzzle.settings.columns);
            tileHeight = Math.round($(target).height() / game_puzzle.settings.rows);

            // Create
            if (game_puzzle.tiles.length < (game_puzzle.settings.rows * game_puzzle.settings.columns)) {
                for (row = 0; row < game_puzzle.settings.rows; row++) {
                    for (col = 0; col < game_puzzle.settings.columns; col++) {
                        (function (game_puzzle, row, col) {
                            var tile;
                            tile = $('<div class="tile">');
                            $(tile).css({
                                    'background-image': $(target).css('background-image'),
                                    'background-position': '-' + (col * tileWidth) + 'px -' + (row * tileHeight) + 'px',
                                })
                                .attr('data-col', col)
                                .attr('data-row', row);

                            game_puzzle.tiles.push(tile);
                        })(this, row, col);
                    }
                }

                // Randomize + append
                array_shuffle(game_puzzle.tiles);

                $.each(game_puzzle.tiles, function(index) {
                    $('#game').append(game_puzzle.tiles[index]);
                });
            }

            // Position
            $('#game .tile').each(function(index, tile) {
                var col = $(tile).attr('data-col'),
                    row = $(tile).attr('data-row');

                $(tile).css({
                    'left': (index * (tileWidth + game_board.border)) + 'px',
                    'top': $('#target').position().top + $('#target').height() + game_board.border,
                    'width': tileWidth,
                    'height': tileHeight,
                    'background-position': '-' + (col * tileWidth) + 'px -' + (row * tileHeight) + 'px',
                    'background-size': targetWidth + 'px ' + targetHeight + 'px',
                });
            });

            // https://jqueryui.com/draggable/
            // https://api.jqueryui.com/draggable/
            $('.tile').draggable({
                'opacity': this.settings.opacity,
                'revert': true,
                'scroll': false
            });
        },
        'init': function () {
            var game_puzzle = this;
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
                        tile.animate({
                            'left': target.left + 'px',
                            'top': target.top + 'px'
                        });
                        tile.remove();
                        game_puzzle.refresh();
                    }
                }
            });

            $(window).resize(function () {
                game_puzzle.refresh();
            });
        }
    };
