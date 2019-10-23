var game_board = {
        'height': function() {
            return parseInt($('#game').height() - ($('nav').length === 0 ? 0 : $('nav').outerHeight()), 10);
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
            'columns': 3,
            'rows': 2,
            'tolerance': 50,
            'opacity': 0.75
        },
        'refresh': function() {
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

            for (row = 0; row < game_puzzle.settings.rows; row++) {
                for (col = 0; col < game_puzzle.settings.columns; col++) {
                    (function (game, row, col, create) {
                        var tile;
                        if (create === true) {
                            tile = $('<div class="tile">');
                            $(tile).css({
                                'background-image': $(target).css('background-image'),
                                'background-position': '-' + (col * tileWidth) + 'px -' + (row * tileHeight) + 'px',
                            })
                                .attr('data-col', col)
                                .attr('data-row', row);
                        } else {
                            tile = $('.tile[data-col=' + col + '][data-row=' + row + ']');
                        }

                        $(tile).css({
                            'top': ($('#game').position().top + row * tileHeight) + 'px',
                            'right': 0,
                            'width': tileWidth,
                            'height': tileHeight,
                            'background-position': '-' + (col * tileWidth) + 'px -' + (row * tileHeight) + 'px',
                            'background-size': targetWidth + 'px ' + targetHeight + 'px',
                        });

                        if (create === true) {
                            $('#game').append($(tile));
                            game_puzzle.tiles.push(tile);
                        }
                    })(this, row, col, game_puzzle.tiles.length < (game_puzzle.settings.rows * game_puzzle.settings.columns));
                }
            }

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
                    }
                }
            });

            $(window).resize(function () {
                game_puzzle.refresh();
            });
        }
    };
