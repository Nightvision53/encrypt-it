import CryptoJS from 'crypto-js'

export { replaceEncryptedMessagesInHtml, setTextInWhatsAppInputBox }

const findPGPMessages = (): HTMLSpanElement[] => {
  const spans = Array.from(document.getElementsByTagName('span'))
  return spans.filter((span) => span.innerHTML.startsWith('encrypted:'))
}

const replaceEncryptedMessagesInHtml = async (secret: string) => {
  const pgpMessageSpans = findPGPMessages()

  for (const span of pgpMessageSpans) {
    const encryptedMessage = span.innerHTML.toString().split('encrypted:')[1]

    var decrypted = CryptoJS.AES.decrypt(encryptedMessage, secret).toString(CryptoJS.enc.Utf8)

    span.innerHTML = decrypted
  }
}

function setTextInWhatsAppInputBox(text: string) {
  // Select the message input box using the role attribute and data-tab attribute
  const messageBox = document.querySelector("div[role='textbox'][data-tab='10']") as HTMLDivElement

  if (messageBox) {
    // Focus the message box
    messageBox.focus()

    // Clear any existing text in the message box
    messageBox.innerHTML = ''

    // Insert the text into the message box
    document.execCommand('insertText', false, text)

    // Create and dispatch the input event to notify changes in the message box
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    })
    messageBox.dispatchEvent(inputEvent)

    // Create and dispatch the keyup event to simulate the 'Enter' key
    const keyupEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
    })
    messageBox.dispatchEvent(keyupEvent)
  } else {
    console.error('Message input box not found')
  }
}
