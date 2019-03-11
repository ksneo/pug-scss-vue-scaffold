import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import { paths, resource } from './settings';

const $ = gulpLoaderPlugins();

gulp.task('build:img', cb => {
    gulp.src(resource.src.images)
        .pipe(
            $.imagemin([
                $.imagemin.optipng({ optimizationLevel: 3 }),
                $.imagemin.jpegtran({ progressive: true }),
                $.imagemin.svgo(),
            ]),
        )
        .pipe(gulp.dest(paths.src.static));
    cb();
});
