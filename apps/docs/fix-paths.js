const fs = require('fs');
const path = require('path');

const BASE_PATH = '/quartz-ui';
const DIST_DIR = path.join(__dirname, 'dist');

function updateHTMLPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Inject script to configure router for base path without changing URL
  const basePathScript = `<script>
(function() {
  // Store base path for router
  window.__EXPO_ROUTER_BASE_PATH__ = '${BASE_PATH}';

  // Patch history methods to handle base path
  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;

  history.pushState = function(state, title, url) {
    if (url && !url.startsWith('http') && !url.startsWith('${BASE_PATH}')) {
      url = '${BASE_PATH}' + url;
    }
    return originalPushState.call(this, state, title, url);
  };

  history.replaceState = function(state, title, url) {
    if (url && !url.startsWith('http') && !url.startsWith('${BASE_PATH}')) {
      url = '${BASE_PATH}' + url;
    }
    return originalReplaceState.call(this, state, title, url);
  };

  // Intercept router's pathname to strip base path
  Object.defineProperty(window.location, 'pathname', {
    get: function() {
      var path = window.location.href.replace(window.location.origin, '').split('?')[0].split('#')[0];
      if (path.startsWith('${BASE_PATH}')) {
        return path.substring('${BASE_PATH}'.length) || '/';
      }
      return path;
    },
    configurable: true
  });
})();
</script>`;

  if (!content.includes('__EXPO_ROUTER_BASE_PATH__')) {
    content = content.replace('<head>', `<head>${basePathScript}`);
  }

  // Replace paths in HTML files
  content = content.replace(/src="\/_expo\//g, `src="${BASE_PATH}/_expo/`);
  content = content.replace(/href="\/_expo\//g, `href="${BASE_PATH}/_expo/`);
  content = content.replace(/src="\/assets\//g, `src="${BASE_PATH}/assets/`);
  content = content.replace(/href="\/assets\//g, `href="${BASE_PATH}/assets/`);

  fs.writeFileSync(filePath, content, 'utf8');
}

function updateJSPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace asset paths in JavaScript files
  // Match patterns like: "/assets/" or '\/assets\/' or "\/assets\/"
  content = content.replace(/["']\/assets\//g, `"${BASE_PATH}/assets/`);
  content = content.replace(/\\"\/assets\//g, `\\"${BASE_PATH}/assets/`);
  content = content.replace(/\\'\/assets\//g, `\\'${BASE_PATH}/assets/`);

  // Also fix __node_modules paths
  content = content.replace(/["']\/.*__node_modules\//g, `"${BASE_PATH}/assets/__node_modules/`);
  content = content.replace(/\\"\/.*__node_modules\//g, `\\"${BASE_PATH}/assets/__node_modules/`);

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.html')) {
      console.log(`Updating HTML paths in: ${filePath}`);
      updateHTMLPaths(filePath);
    } else if (file.endsWith('.js')) {
      console.log(`Updating JS paths in: ${filePath}`);
      updateJSPaths(filePath);
    }
  });
}

console.log('Fixing paths for GitHub Pages...');
walkDir(DIST_DIR);

// Create 404.html for SPA routing on GitHub Pages
console.log('Creating 404.html for SPA routing...');
const indexPath = path.join(DIST_DIR, 'index.html');
const notFoundPath = path.join(DIST_DIR, '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('Created 404.html');
}

console.log('Done!');
