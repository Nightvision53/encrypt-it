console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    localStorage.setItem('count', request.count)
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  localStorage['key'] = message.key //store into extension's local storage
})
