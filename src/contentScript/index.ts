// when a user focuses on a text input, we will show a pop up with a input inside it.
// when user enters message in the input in popup, we will encrypt the message in the background and show the encrypted message in the input field.

import CryptoJS from 'crypto-js'
import { replaceEncryptedMessagesInHtml, setTextInWhatsAppInputBox } from '../utils'

// create a div element

console.log('content.js loaded')
const div = document.createElement('div')

// set the innerHTML of the div element
div.innerHTML = `
  <div style="padding: 20px; display: flex; flex-direction:column; gap:8px">
    <h2>Encrypt-It</h2>
    <div style="display: flex; flex-direction: row; gap: 10px;">
    <input type="password" id="password-input" style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 10px;" placeholder="Enter password" />
    <input type="text" id="popup-input" style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 10px;" />
    <button id="popup-button" style="padding: 10px 5px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Encrypt</button>
    </div>
  </div>
`

// set the style of the div element
div.style.position = 'fixed'
div.style.top = '50%'
div.style.left = '50%'
div.style.transform = 'translate(-50%, -50%)'
div.style.backgroundColor = 'white'
div.style.color = 'black'
div.style.zIndex = '1000'
div.style.display = 'none'

// append the div element to the body
document.body.appendChild(div)

// it will work on all input elements

let inputElement = null as HTMLDivElement | null
let popupInputElement = document.querySelector('#popup-input') as HTMLInputElement
let passwordInputElement = document.querySelector('#password-input') as HTMLInputElement

passwordInputElement.value = localStorage.getItem('encyript-it-password') || ''

// listen for focus events on all input elements
document.addEventListener(
  'focus',
  function (event: any) {
    // check if the focused element is querySelector("div[role='textbox'][data-tab='10']")

    if (
      event.target.tagName === 'DIV' &&
      event.target.getAttribute('role') === 'textbox' &&
      event.target.getAttribute('data-tab') === '10'
    ) {
      // set the inputElement to the focused element
      inputElement = event.target as HTMLDivElement

      // show the popup
      div.style.display = 'block'

      // put the pop up in front of the input element
      div.style.top = event.target.getBoundingClientRect().top + 'px'
      div.style.left = event.target.getBoundingClientRect().left + 'px'
      div.style.position = 'absolute'
      div.style.transform = 'translate(0, -120%)'
    }
  },
  true,
)

div.setAttribute('tabindex', '0')

// listen for blur events on all input elements
document.addEventListener(
  'blur',
  function (event) {
    // check if the blurred element is the inputElement and not the popup input
    if (
      event.target === inputElement &&
      event.relatedTarget !== div &&
      event.relatedTarget !== popupInputElement &&
      !div.contains(event.relatedTarget as Node)
    ) {
      // hide the popup
      div.style.display = 'none'
    }
  },
  true,
)

passwordInputElement?.addEventListener('input', function (event: any) {
  localStorage.setItem('encyript-it-password', event.target.innerHTML)
})

// listen for click events on the popup button

document?.getElementById('popup-button')?.addEventListener('click', async function () {
  const message = popupInputElement?.value
  const password = localStorage.getItem('encyript-it-password')

  // encrypt the message
  const encryptedMessage = await CryptoJS.AES.encrypt(message, password!).toString()

  setTextInWhatsAppInputBox('encrypted:' + encryptedMessage)
})

setInterval(async () => {
  console.log('replacing encrypted messages')
  const password = localStorage.getItem('encyript-it-password')
  await replaceEncryptedMessagesInHtml(password!)
}, 5000)
