import gulp from 'gulp'
import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import terser from 'gulp-terser'
import del from 'del'
import cleanCSS from 'gulp-clean-css'
import { Project as MorphProject, StructureKind } from 'ts-morph'
import iconsData from 'simple-icons/_data/simple-icons.json'

const tsProject = ts.createProject("tsconfig.json");

gulp.task("generate", async function () {
    const generatedProject = new MorphProject();
    const simpleIconsEnumFile = generatedProject.createSourceFile("src/simple-icons.ts", null, {
        overwrite: true
    });
    simpleIconsEnumFile.addEnum({
        members: iconsData.icons.map(icon => {
            return {
                name: (icon.slug || icon.title).replace(/[\s_-](\w)/g, /** @param p1 {String} */function (match, p1) {
                    return p1.toUpperCase();
                }).replace(/\W/g, "_").replace(/^\w/g, /** @param match {String} */function (match) {
                    return match.toUpperCase();
                }).replace(/^[^a-zA-Z]/g, "_$&"),
                value: (icon.slug || icon.title).replace(/\s/g, "-"),
                docs: [
                    {
                        description: icon.title,
                        tags: [
                            {
                                tagName: "see",
                                text: icon.source
                            }
                        ]
                    }
                ]
            };
        }),
        name: "SimpleIcons",
        isExported: true,
        kind: StructureKind.Enum
    }).addMembers(["bitcoin", "dependabot", "discord", "gitlab", "npm", "paypal", "serverfault", "stackexchange", "superuser", "telegram", "travis"].map(iconName => {
        return {
            name: iconName,
            value: iconName
        };
    }));
    await generatedProject.save();
});

gulp.task("clean", function () {
    return del("dist/*.*");
});

gulp.task("ts-build", function () {
    return tsProject.src().
           pipe(sourcemaps.init()).
           pipe(tsProject()).js.
           pipe(terser()).
           pipe(sourcemaps.write(".", {
               includeContent: false,
               sourceRoot: "../src"
           })).
           pipe(gulp.dest("dist"));
});

gulp.task("css-build", function () {
    return gulp.src("src/*.css").
           pipe(sourcemaps.init()).
           pipe(cleanCSS()).
           pipe(sourcemaps.write(".", {
               includeContent: false,
               sourceRoot: "../src"
           })).
           pipe(gulp.dest("dist"));
});

gulp.task("html-build", function () {
    return gulp.src("src/*.htm").
           pipe(sourcemaps.init()).
           //pipe(htmlmin()).
           pipe(sourcemaps.write(".", {
               includeContent: false,
               sourceRoot: "../src"
           })).
           pipe(gulp.dest("dist"));
});

gulp.task("copy-static", function () {
    return gulp.src("www/*.*").pipe(gulp.dest("dist"));
});

gulp.task("build", gulp.series(["clean", "ts-build", "css-build", "html-build", "copy-static"]));