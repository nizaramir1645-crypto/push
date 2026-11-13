importScripts('/config.js');

// عند الضغط على الإشعار: فتح الرابط (حقل url في Custom data) أو الموقع الأصلي
self.addEventListener('notificationclick', function (event) {
  var d = event.notification.data || {};
  var m = d.FCM_MSG || {};
  var url = (m.data && m.data.url) || (m.fcmOptions && m.fcmOptions.link) || PN_CONFIG.siteUrl;
  event.notification.close();
  event.stopImmediatePropagation();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url === url && 'focus' in list[i]) return list[i].focus();
      }
      return clients.openWindow(url);
    })
  );
});

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp(PN_CONFIG.firebase);
firebase.messaging();

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
