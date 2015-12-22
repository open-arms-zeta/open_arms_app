module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            client: {
                src: 'client/scripts/client.js',
                dest: 'server/public/assets/scripts/client.min.js'
            },
            admin: {
                src: 'client/scripts/admin.js',
                dest: 'server/public/assets/scripts/admin.min.js'
            },
            login: {
                src: 'client/scripts/login.js',
                dest: 'server/public/assets/scripts/login.min.js'
            },
            register: {
                src: 'client/scripts/register.js',
                dest: 'server/public/assets/scripts/register.min.js'
            },
            controllers: {
                src: 'client/scripts/controllers/*.js',
                dest: "server/public/assets/scripts/controllers/controller.min.js"
            },
            factories: {
                src: 'client/scripts/factories/*.js',
                dest: "server/public/assets/scripts/factories/factory.min.js"
            }
        },
        copy: {
            angular: {
                expand: true,
                cwd: 'node_modules/angular',
                src: [
                    "angular.min.js",
                    "angular.min.js.map"
                ],
                "dest": "server/public/vendors/"
            },
            angularRoute: {
                expand: true,
                cwd: 'node_modules/angular-route',
                src: [
                    "angular-route.min.js",
                    "angular-route.min.js.map"
                ],
                "dest": "server/public/vendors/"
            },
            angularAria: {
                expand: true,
                cwd: 'node_modules/angular-aria',
                src: [
                    "angular-aria.min.js",
                    "angular-aria.min.js.map"
                ],
                "dest": "server/public/vendors/"
            },
            angularAnimate: {
                expand: true,
                cwd: 'node_modules/angular-animate',
                src: [
                    "angular-animate.min.js",
                    "angular-animate.min.js.map"
                ],
                "dest": "server/public/vendors/"
            },
            angularMaterial: {
                expand: true,
                cwd: 'node_modules/angular-material',
                src: [
                    "angular-material.min.js",
                    "angular-material.min.css",
                    "angular-material.min.js.map"
                ],
                "dest": "server/public/vendors/"
            },
            angularMessages: {
                expand: true,
                cwd: 'node_modules/angular-messages',
                src: [
                    "angular-messages.min.js",
                    "angular-messages.min.js.map"
                ],
                "dest": "server/public/vendors/"
            },
            papaparse: {
                expand: true,
                cwd: 'node_modules/papaparse',
                src: [
                    "papaparse.min.js"
                ],
                "dest": "server/public/vendors/"
            },
            angularBootstrap: {
                expand: true,
                cwd: 'node_modules/angular-bootstrap',
                src: [
                    "ui-bootstrap.min.js"
                ],
                "dest": "server/public/vendors/"
            },
            angularCSV: {
                expand: true,
                cwd: 'node_modules/ng-csv/build',
                src: [
                    "ng-csv.min.js"
                ],
                "dest": "server/public/vendors/"
            },
            angularSanitize: {
                expand: true,
                cwd: 'node_modules/angular-sanitize',
                src: [
                    "angular-sanitize.min.js",
                    "angular-sanitize.min.js.map"
                ],
                "dest": "server/public/vendors/"
            },
            bootstrap: {
                expand: true,
                cwd: 'node_modules/bootstrap/dist/css',
                src: [
                    "bootstrap.min.css",
                    "bootstrap.min.css.map"
                ],
                "dest": "server/public/vendors/"
            },
            bootstrapFonts: {
                expand: true,
                cwd: 'node_modules/bootstrap/dist/fonts',
                src: [
                    "*"
                ],
                "dest": "server/public/fonts/"
            },fontAwesome: {
                expand: true,
                cwd: 'node_modules/font-awesome/',
                src: [
                    "css/font-awesome.min.css",
                    "css/font-awesome.css.map",
                    "fonts/*"
                ],
                "dest": "server/public/vendors/font-awesome/"
            },
            jQuery: {
                expand: true,
                cwd: 'node_modules/jquery/dist/',
                src: [
                    "jquery.min.js",
                    "jquery.min.map"
                ],
                "dest": "server/public/vendors/"
            },
            underscore: {
                expand: true,
                cwd: 'node_modules/underscore/',
                src: [
                    "underscore-min.js",
                    "underscore-min.map"
                ],
                "dest": "server/public/vendors/"
            },
            normalize: {
                expand: true,
                cwd: 'node_modules/normalize.css/',
                src: [
                    "normalize.css"
                ],
                "dest": "server/public/vendors/"
            },
            html: {
                expand: true,
                cwd: "client/views",
                src: [
                    "*",
                    "*/*"
                ],
                dest: "server/public/assets/views/"
            },
            style: {
                expand: true,
                cwd: "client/styles",
                src: '*.css',
                dest: 'server/public/assets/styles'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['copy', 'uglify']);

};