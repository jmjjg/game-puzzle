module.exports = function (grunt) {
    require("jit-grunt")(grunt, {
        replace: 'grunt-text-replace'
    });

    var src = {
            css: [
                "/opt/node_modules/bootstrap/dist/css/bootstrap.css",
                "src/css/game-puzzle.css"
            ],
            js: [
                "/opt/node_modules/jquery/dist/jquery.min.js",
                "/opt/node_modules/popper.js/dist/umd/popper.js",
                "/opt/node_modules/bootstrap/dist/js/bootstrap.js",
                "src/js/jquery-ui.js",
                "src/js/game-puzzle.js",
            ]
        },
        dst = {
            css: "out/game-puzzle.css",
            js: "out/game-puzzle.js"
        },
        config = {
            cssmin: {
                build: {
                    files: {
                        "out/game-puzzle.min.css": src.css
                    }
                }
            },
            jsvalidate: {
                build: {
                    files: {
                        src: src.js
                    }
                },
                options: {
                    verbose: true
                }
            },
            uglify: {
                build: {
                    src: src.js,
                    dest: dst.js
                }
            },
            watch: {
                build: {
                    files: [
                        "*",
                        "**/*",
                        "!out/*"
                    ],
                    tasks: ["build"]
                }
            }
        };

    grunt.initConfig(config);
    grunt.registerTask("build", ["jsvalidate", "cssmin", "uglify"]);
    grunt.registerTask("default", ["watch"]);
};