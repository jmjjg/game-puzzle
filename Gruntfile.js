module.exports = function (grunt) {
    require("jit-grunt")(grunt, {
        replace: 'grunt-text-replace'
    });

    // @see https://gruntjs.com/configuring-tasks
    // @see https://www.npmjs.com/package/grunt-stylelint

    var
        dependencies = {
            "src": {
                "css": [
                    "/opt/node_modules/bootstrap/dist/css/bootstrap.css",
                    "/opt/node_modules/@fortawesome/fontawesome-free/css/all.css"
                ],
                "js": [
                    "/opt/node_modules/jquery/dist/jquery.min.js",
                    "/opt/node_modules/popper.js/dist/umd/popper.js",
                    "/opt/node_modules/bootstrap/dist/js/bootstrap.js",
                    "/opt/node_modules/@fortawesome/fontawesome-free/js/all.js",
                    "src/js/jquery-ui.js"
                ]
            },
            "dest": {
                "css": "out/game-puzzle-dependencies.min.css",
                "js": "out/game-puzzle-dependencies.min.js"
            }
        },
        game = {
            "src": {
                "css": [
                    "src/css/game-puzzle.css"
                ],
                "js": [
                    "src/js/game-puzzle.js"
                ]
            },
            "dest": {
                "css": "out/game-puzzle-dependencies.min.css",
                "js": "out/game-puzzle-dependencies.min.js"
            }
        },
        config = {
            "copy": {
                "build": {
                    "src": "fa-solid-900.*",
                    "expand": true,
                    "cwd": "/opt/node_modules/@fortawesome/fontawesome-free/webfonts",
                    "dest": "out/webfonts/"
                },
            },
            "cssmin": {
                "build": {
                    "files": [
                        {
                            "src": dependencies.src.css,
                            "dest": dependencies.dest.css
                        }
                    ]
                }
            },
            "jsvalidate": {
                "build": {
                    "files": {
                        "src": dependencies.src.js
                    }
                },
                "game": {
                    "files": {
                        "src": game.src.js
                    }
                },
                "options": {
                    "verbose": true
                }
            },
            "replace": {
                "build": {
                    "src": dependencies.dest.css,
                    "overwrite": true,
                    "replacements": [
                        {
                            "from": /webfonts/g,
                            "to": 'out/webfonts'
                        }
                    ]
                }
            },
            "uglify": {
                "build": {
                    "src": dependencies.src.js,
                    "dest": dependencies.dest.js
                }
            },
            "watch": {
                "build": {
                    "files": dependencies.src.js,
                    "tasks": ["build"]
                },
                "game": {
                    "files": game.src.js,
                    "tasks": ["jsvalidate:game"]
                }
            }
        };

    grunt.initConfig(config);
    grunt.registerTask("build", ["jsvalidate", "cssmin", "uglify", "copy", "replace"]);
    grunt.registerTask("default", ["watch"]);

    // var src = {
    //         css: [
    //             "/opt/node_modules/bootstrap/dist/css/bootstrap.css",
    //             "/opt/node_modules/@fortawesome/fontawesome-free/css/all.css",
    //             "src/css/game-puzzle.css"
    //         ],
    //         js: [
    //             "/opt/node_modules/jquery/dist/jquery.min.js",
    //             "/opt/node_modules/popper.js/dist/umd/popper.js",
    //             "/opt/node_modules/bootstrap/dist/js/bootstrap.js",
    //             "/opt/node_modules/@fortawesome/fontawesome-free/js/all.js",
    //             "src/js/jquery-ui.js",
    //             "src/js/game-puzzle.js",
    //         ]
    //     },
    //     dest = {
    //         css: "out/game-puzzle.css",
    //         js: "out/game-puzzle.js"
    //     },
    //     config = {
    //         copy: {
    //             build: {
    //                 src: 'fa-solid-900.*',
    //                 expand: true,
    //                 cwd: '/opt/node_modules/@fortawesome/fontawesome-free/webfonts',
    //                 dest: 'out/webfonts/',
    //             },
    //         },
    //         cssmin: {
    //             build: {
    //                 files: {
    //                     "out/game-puzzle.min.css": src.css
    //                 }
    //             }
    //         },
    //         jsvalidate: {
    //             build: {
    //                 files: {
    //                     src: src.js
    //                 }
    //             },
    //             options: {
    //                 verbose: true
    //             }
    //         },
    //         replace: {
    //             build: {
    //                 src: ['out/game-puzzle.min.css'],
    //                 overwrite: true,
    //                 replacements: [
    //                     {
    //                         from: /webfonts/g,
    //                         to: 'out/webfonts'
    //                     }
    //                 ]
    //             }
    //         },
    //         uglify: {
    //             build: {
    //                 src: src.js,
    //                 dest: dest.js
    //             }
    //         },
    //         watch: {
    //             build: {
    //                 files: [
    //                     "*",
    //                     "**/*",
    //                     "!out/**"
    //                 ],
    //                 tasks: ["build"]
    //             }
    //         }
    //     };

    // grunt.initConfig(config);
    // grunt.registerTask("build", ["jsvalidate", "cssmin", "uglify", "copy", "replace"]);
    // grunt.registerTask("default", ["watch"]);
};