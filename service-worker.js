self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('idle-factory-v1').then(cache => {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'app.js',
        'jshelpers/utils.js',
        'jshelpers/gameState.js',
        'jshelpers/factoryActions.js',
        'factories.json',
        'icon.png',
        'graphics/background.png',
        'graphics/run-down-factory.png',
        'graphics/simple-factory.png',
        'graphics/money.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});