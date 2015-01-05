// node
var fs = require('fs');
var path = require('path');

// broccoli
var selectFiles = require('broccoli-select');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var mince = require('broccoli-mincer');

var env = require('broccoli-env').getEnv();
var root = process.cwd();

var dest = '';
var src = 'app/';
var themesDir = 'themes';

var themesSrcDir = path.join(src, themesDir);
var themesDestDir = path.join(dest, themesDir);

var themes = fs.readdirSync(themesSrcDir);

var resultTree = null;

themes.forEach(function(theme) {
  
  console.log("Build theme '" + theme + "' with target " + env + "...");
  
  var themeSrcDir = path.join(themesSrcDir, theme);
  var themeDestDir = path.join(themesDestDir, theme);
  
  var assetFiles = ['css/**/*.*', 'js/**/*.*'];
  
  var themeAssetsTree = pickFiles(themeSrcDir, {
    srcDir: '/',
    files: ['style.*', 'css/**/*.*', 'js/**/*.*'],
    destDir: ""
  });
  
  // Select bootstrap assets
  var bootstrapTree = pickFiles('vendor/assets/components/bootstrap-sass-official/assets/fonts/bootstrap', {
    srcDir: '/',
    files: ['**/*.*'],
    destDir: "bootstrap"
  });
  
  
  // Select other files
  var publicTree = selectFiles(themeSrcDir, {
    acceptFiles: [ '**/*'],
    rejectFiles: assetFiles,
    outputDir: themeDestDir,
    allowNone: true
  });
  
  // Setup assets tree
  var sourceTrees = [themeAssetsTree, bootstrapTree];
  var assetsTree = mergeTrees(sourceTrees, { overwrite: true });
  
  // Compile assets
  assetsTree = mince(assetsTree, {
    //originalPaths: true, 
    digest: true,
    allowNone: true,
    inputFiles: ['**/*.*'],
    manifest: path.join(themeDestDir, 'assets', 'assets.json'),
    sourceMaps: true,
    embedMappingComments: true, 
    compress: false,
    enable: [
      //'autoprefixer'
    ],
    engines: {
      Coffee: {
        bare: true
      }
    },
    paths: [
      path.join(root, 'vendor/assets/components'),
      path.join(root, 'vendor/assets/components/bootstrap-sass-official/assets/javascripts'),
      path.join(root, 'vendor/assets/components/bootstrap-sass-official/assets/stylesheets'),
      path.join(root, 'vendor/assets/components/bootstrap-sass-official/assets/fonts'),
      ".", 
      'css', 
      'js'
    ],
    
    helpers: {
      asset_path: function(pathname, options) {
        var asset = this.environment().findAsset(pathname, options);
        if (!asset) {
          throw new Error('File ' + pathname + ' not found');
        }
        return asset.digestPath;
      }
    }
  });
  
  // Merge trees into result
  var trees = [publicTree, assetsTree];
  if (resultTree !== null) {
    trees.unshift(resultTree);
  }
  
  resultTree = mergeTrees(trees, { overwrite: true });
  
});

module.exports = resultTree;