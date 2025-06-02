let password = "";
let params = {};
let isFirst = true;
let indexes = [];

const passwordInputs = document.getElementsByClassName("password-input");
const phraseInputs = document.getElementsByClassName("phrase-container");
console.log(phraseInputs.length);
const firstButtonNext = document.getElementById("nav-button-next1");
firstButtonNext.addEventListener("click", async () => {
  if (
    passwordInputs[0].value &&
    passwordInputs[1].value &&
    passwordInputs[0].value == passwordInputs[1].value
  ) {
    document.getElementById("app-password").classList.add("hidden");
    document.getElementById("app-phrase").classList.remove("hidden");
    password = passwordInputs[0].value;
    processKeys(isFirst);
  } else {
    if (!passwordInputs[0].value) {
      showError(await getValueByKeyNoLang("providePasswordError"));
      return;
    }
    if (!passwordInputs[1].value) {
      showError(await getValueByKeyNoLang("provideConfirmPasswordError"));
      return;
    }
    if (passwordInputs[0].value != passwordInputs[1].value) {
      showError(await getValueByKeyNoLang("passwordMismatch"));
      return;
    }
  }
});

const revealButton = document.getElementById("reveal-button");
revealButton.addEventListener("click", () => {
  for (var i = 0; i < 12; i++) {
    phraseInputs[i].type = "text";
  }
});

const secondNextButton = document.getElementById("nav-button-next2");
secondNextButton.addEventListener("click", () => {
  document.getElementById("app-phrase").classList.add("hidden");
  document.getElementById("app-confirm-phrase").classList.remove("hidden");
  const phrase_arr = params.mnemonic.split(" ");

  for (var i = 0; i < 12; i++) {
    if (Array.from(indexes).includes(i)) {
      phraseInputs[i + 12].value = "";
      phraseInputs[i + 12].removeAttribute("readonly");
    } else {
      phraseInputs[i + 12].value = phrase_arr[i];
      phraseInputs[i + 12].setAttribute("readonly", "readonly");
    }
  }
});

const secondPrevButton = document.getElementById("nav-button-previous2");
secondPrevButton.addEventListener("click", () => {
  document.getElementById("app-password").classList.remove("hidden");
  document.getElementById("app-phrase").classList.add("hidden");
});

const thirdPrevButton = document.getElementById("nav-button-previous3");
thirdPrevButton.addEventListener("click", () => {
  document.getElementById("app-confirm-phrase").classList.add("hidden");
  document.getElementById("app-phrase").classList.remove("hidden");
});

const confirmButton = document.getElementById("confirm-button");
confirmButton.addEventListener("click", async () => {
  const userPhrase = [];
  for (var i = 12; i < 24; i++) {
    userPhrase.push(phraseInputs[i].value);
  }
  if (userPhrase.join(" ") == params.mnemonic) {
    const passwordHash = CryptoJS.SHA256(password);

    await putValueToLocalStorage("passwordHash", passwordHash, password);
    await putValueToLocalStorage("mnemonic", params.mnemonic, password);
    await putValueToLocalStorage("privateKey", params.privateKey, password);
    await putValueToLocalStorage("publicKey", params.publicKey, password);
    await putValueToLocalStorage("address", params.address, password);
    await savePassword(password);

    window.location.href = "home.html";
  } else {
    showError(await getValueByKeyNoLang("wrongPhrase"));
  }
});

const phraseCopyButton = document.getElementById("phrase-copy-button");
phraseCopyButton.addEventListener("click", () => {
  navigator.clipboard
    .writeText(params.mnemonic)
    .then(() => {
      console.log("Text copied to clipboard");
      showError("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});

function processKeys(first) {
  isFirst = false;
  if (first) {
    params = generateAll();
    indexes = getCheckPhrase(4, 11, params.mnemonic.split(" ")).indexes;
  }
  const phrase_arr = params.mnemonic.split(" ");
  for (var i = 0; i < 12; i++) {
    phraseInputs[i].value = phrase_arr[i];
    phraseInputs[i].type = "password";
  }
}

const toLoginButton = document.getElementById("to-login-button");
const toRecoverButton = document.getElementById("to-recover-button");

toLoginButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

toRecoverButton.addEventListener("click", () => {
  window.location.href = "recover.html";
});

//------------------------------------------------------------
// Extension button
document.getElementById("openTabButton").addEventListener("click", async () => {
  const extensionURL = browser.runtime.getURL("utils/register.html");
  await browser.tabs.create({ url: extensionURL });
});

//------------------------------------------------------------
// Localisation
async function updateRegister() {
  const lang = await getLang();

  document.getElementById("password").placeholder = await getValueByKey(
    "password",
    lang
  );
  document.getElementById("confirm-password").placeholder = await getValueByKey(
    "confirmPassword",
    lang
  );
  document.getElementById("nav-button-next1").innerHTML = await getValueByKey(
    "next",
    lang
  );
  document.getElementById("nav-button-next2").innerHTML = await getValueByKey(
    "next",
    lang
  );
  document.getElementById("nav-button-previous2").innerHTML =
    await getValueByKey("previous", lang);
  document.getElementById("nav-button-previous3").innerHTML =
    await getValueByKey("previous", lang);
  document.getElementById("confirm-button").innerHTML = await getValueByKey(
    "confirm",
    lang
  );
  document.getElementById("put-label").innerHTML = await getValueByKey(
    "putLabel",
    lang
  );
  document.getElementById("watching-label").innerHTML = await getValueByKey(
    "watchLabel",
    lang
  );
  document.getElementById("reveal-button").innerHTML = await getValueByKey(
    "revealMnemonic",
    lang
  );
  document.getElementById("to-login-button").innerHTML = await getValueByKey(
    "toLogin",
    lang
  );
  document.getElementById("to-recover-button").innerHTML = await getValueByKey(
    "toRecover",
    lang
  );
  document.getElementById("phrase-copy-button").innerHTML = await getValueByKey(
    "phraseCopied",
    lang
  );
}

const localisationButton = document.getElementById("changeLangButton");
localisationButton.addEventListener("click", async () => {
  let lang = await getLang();
  await nextLang(lang);

  updateRegister();
  // console.log(await getLang());
});
document.addEventListener("DOMContentLoaded", async () => {
  updateRegister();
});
