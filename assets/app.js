const RESULT_INACTIVE_CLASS = "result-inactive"
const FAILED_INTERACTION_BUTTON_CLASS = "failed-interaction-button"
const DEFAULT_RESULT_PLACEHOLDER =
  "Digite um texto que você deseja criptografar ou descriptografar. "

const CRYPT_VALUES = {
  a: "ai",
  e: "enter",
  i: "imes",
  o: "ober",
  u: "ufat",
}

const CRYPT_ACTION_FUNCTIONS = {
  crypt: (userInput) => {
    const cryptTextList = splitTextByEmptyCharacters(userInput).map((text) => {
      let finalResult = text
        .split("")
        .map((character) => {
          if (!CRYPT_VALUES[character]) return character
          return CRYPT_VALUES[character]
        })
        .join("")

      return finalResult
    })

    const cryptTextResult = cryptTextList.join(" ")

    resultTab.classList.remove(RESULT_INACTIVE_CLASS)
    resultTextElement.textContent = cryptTextResult
    copyButton.addEventListener("click", copyCryptText)
  },
  decrypt: (userInput) => {
    const decryptTextList = splitTextByEmptyCharacters(userInput).map(
      (text) => {
        let finalResult = text
        Object.entries(CRYPT_VALUES).forEach(([index, value]) => {
          finalResult = finalResult.replaceAll(value, index)
        })
        return finalResult
      }
    )

    const decryptTextResult = decryptTextList.join(" ")

    resultTab.classList.remove(RESULT_INACTIVE_CLASS)
    resultTextElement.textContent = decryptTextResult
    copyButton.addEventListener("click", copyCryptText)
  },
}

const inputElement = document.getElementById("user-input")
const cryptButton = document.getElementById("crypt")
const decryptButton = document.getElementById("decrypt")
const resultTab = document.getElementById("result")
const copyButton = document.getElementById("copy")
const resultTextElement = document.getElementById("result-text")

const checkEmptyString = (string) => string.trim().length === 0
const stringHasUppercase = (string) => /[A-Z]/.test(string)
const splitTextByEmptyCharacters = (string) =>
  string.split(/(\s+)/).filter((str) => !checkEmptyString(str))
const stringHasSpecialCharacters = (string) => /[^A-Za-z0-9 ,.?!]/.test(string)

const disableButtons = () => {
  cryptButton.setAttribute("disabled", true)
  decryptButton.setAttribute("disabled", true)
}

const enableButtons = () => {
  cryptButton.removeAttribute("disabled")
  decryptButton.removeAttribute("disabled")
}

const resetButtonsStyles = () => {
  cryptButton.classList.remove(FAILED_INTERACTION_BUTTON_CLASS)
  decryptButton.classList.remove(FAILED_INTERACTION_BUTTON_CLASS)
  cryptButton.textContent = "Criptografar"
  decryptButton.textContent = "Descriptografar"
  enableButtons()
}

const onActionFail = (message, element) => {
  resultTab.classList.add(RESULT_INACTIVE_CLASS)
  resultTextElement.textContent = DEFAULT_RESULT_PLACEHOLDER
  copyButton.removeEventListener("click", copyCryptText)

  disableButtons()
  element.classList.add(FAILED_INTERACTION_BUTTON_CLASS)
  element.textContent = message
  setTimeout(() => {
    resetButtonsStyles()
  }, 3000)
}

const copyCryptText = () => {
  navigator.clipboard.writeText(resultTextElement.textContent)
  copyButton.textContent = "Copiado!"
  setTimeout(() => {
    copyButton.textContent = "Copiar"
  }, 1500)
}

const onActionClick = (element) => {
  const target = element.target.id
  resetButtonsStyles(element.target)

  try {
    const userInput = inputElement.value

    if (checkEmptyString(userInput))
      throw new Error("O texto não pode estar vazio")
    if (stringHasUppercase(userInput))
      throw new Error("O texto não pode conter letras maiúsculas")
    if (
      splitTextByEmptyCharacters(userInput).forEach((text) => {
        if (!stringHasSpecialCharacters(text)) return
        throw new Error("O texto não pode conter caracteres especiais")
      })
    ) {
    }

    if (!CRYPT_ACTION_FUNCTIONS[target]) return
    resetButtonsStyles()
    CRYPT_ACTION_FUNCTIONS[target](userInput)
  } catch (exception) {
    onActionFail(exception.message, element.target)
  }
}

cryptButton.addEventListener("click", onActionClick)
decryptButton.addEventListener("click", onActionClick)
inputElement.addEventListener("input", resetButtonsStyles)
