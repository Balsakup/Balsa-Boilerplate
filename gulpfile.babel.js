// Import modules
// ---
import { src, dest, watch, parallel, series } from 'gulp';
import gulpLoadPlugins                        from 'gulp-load-plugins';
import browserSync                            from 'browser-sync';
import del                                    from 'del';

// Gulp variables
// ---
const $        = gulpLoadPlugins();
const bs       = browserSync.create();

// Source and destination location
// ---
const dirs     = {
    src : './src',
    dest: './dist'
};

// Sources location
// ---
const srcFiles = {
    sass: `${dirs.src}/sass/**/*.sass`,
    pug : `${dirs.src}/pug/**/*.pug`,
    js  : `${dirs.src}/js/**/*.js`
};

// PugJS options
// ---
const pugOpts  = {
    pretty: '    '
};

// SASS Task
// ---
export const buildSass = () =>
    src([ srcFiles.sass, '!**/vendor/**' ])
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync().on('error', $.sass.logError))
        .pipe($.sourcemaps.write('.'))
        .pipe(dest(`${dirs.dest}/css`))
        .pipe($.filter('**/*.css'))
        .pipe(bs.stream());

// PugJS Task
// ---
export const buildPug = () =>
    src([ srcFiles.pug, '!**/(_)*.pug' ])
        .pipe($.pug(pugOpts))
        .pipe(dest(dirs.dest));

// JS Task
// ---
export const buildJs = () =>
    src([ srcFiles.js, '!**/vendor/**', '!**/(_)*.js' ])
        .pipe($.sourcemaps.init())
        .pipe($.include())
        .pipe($.sourcemaps.write('.'))
        .pipe(dest(`${dirs.dest}/js`))
        .pipe($.filter('**/*.js'))
        .pipe(bs.stream());

// Serve and Watch Task
// ---
export const ServeAndWatch = () => {
    bs.init({ server: dirs.dest });

    watch(srcFiles.sass, buildSass);
    watch(srcFiles.pug, buildPug);
    watch(srcFiles.js, buildJs);

    watch(`${dirs.dest}/*.html`).on('change', bs.reload);
};

// Clean Task
// ---
export const clean = () =>
    del([ dirs.dest ]);

// Serve Task
// ---
export const serve = series(clean, parallel(buildPug, buildSass, buildJs), ServeAndWatch);

// Default Task
// ---
export default serve;
