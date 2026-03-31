// Luna Cycle Tracker – Service Worker
// next-pwa generates the main sw.js; this file can be used for custom push logic

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title   = data.title   ?? 'Luna'
  const options = {
    body: data.body ?? 'Time to check your cycle!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    tag: 'luna-reminder',
    renotify: true,
    data: { url: data.url ?? '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url ?? '/')
  )
})
