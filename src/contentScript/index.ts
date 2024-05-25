// when a user focuses on a text input, we will show a pop up with a input inside it.
// when user enters message in the input in popup, we will encrypt the message in the background and show the encrypted message in the input field.

import { decryptMessage, encryptMessage } from '../utils'
import * as openpgp from 'openpgp'

// create a div element

console.log('content.js loaded')
const div = document.createElement('div')

// set the innerHTML of the div element
div.innerHTML = `
  <input type="text" id="popup-input" />
  <button id="popup-button">Encrypt</button>
`

// set the style of the div element
div.style.position = 'fixed'
div.style.top = '50%'
div.style.left = '50%'
div.style.transform = 'translate(-50%, -50%)'
div.style.backgroundColor = 'white'
div.style.color = 'black'
div.style.zIndex = '1000'

// append the div element to the body
document.body.appendChild(div)

// it will work on all input elements

let inputElement = null
let popupInputElement = document.querySelector('#popup-input')

// listen for focus events on all input elements
document.addEventListener(
  'focus',
  function (event) {
    // check if the focused element is an input element
    if (
      (event.target.tagName === 'INPUT' && event.target.type === 'text') ||
      event.target.tagName === 'TEXTAREA'
    ) {
      // not the popup input
      if (event.target.id === 'popup-input') {
        return
      }

      // set the inputElement to the focused element
      inputElement = event.target

      // show the popup
      div.style.display = 'block'
    }
  },
  true,
)

// listen for click events on the popup button
document?.getElementById('popup-button').addEventListener('click', async function () {
  // get the value of the popup input
  console.log('popupInputElement', popupInputElement)
  const message = popupInputElement.value

  let publicKey = ''
  let privateKey = ''

  // get the public and private keys from the local storage
  localStorage.getItem('publicKey') && (publicKey = localStorage.getItem('publicKey')!)
  localStorage.getItem('privateKey') && (privateKey = localStorage.getItem('privateKey')!)

  // encrypt the message
  const encryptedMessage = await encryptMessage({
    publicKey: await openpgp.readKey({ armoredKey: publicKey }),
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
    message,
  })

  setTextInWhatsAppInputBox(encryptedMessage)
})

function setTextInWhatsAppInputBox(text) {
  // Select the message input box using the role attribute and data-tab attribute
  const messageBox = document.querySelector("div[role='textbox'][data-tab='10']")

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
