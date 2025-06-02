const toLoginButton = document.getElementById("to-login-button");
const toRegisterButton = document.getElementById("to-register-button");
const conformNewPasswordButton = document.getElementById(
  "confirm-new-password-button"
);

const mnemonicInputs = document.getElementsByClassName("phrase-container");
const passwordInputs = document.getElementsByClassName("password-input");

Array.from(mnemonicInputs).forEach((elem) => {
  elem.addEventListener("change", () => {
    const words = elem.value.split(" ");
    console.log(words);
    if (words.length == 12) {
      for (var i = 0; i < 12; i++) {
        Array.from(mnemonicInputs)[i].value = words[i];
      }
    }
  });
});

conformNewPasswordButton.addEventListener("click", async () => {
  mnemonic = "";
  Array.from(mnemonicInputs).forEach((elem) => {
    mnemonic += elem.value + " ";
  });
  mnemonic = mnemonic.slice(0, -1);
  console.log(mnemonic);
  let password = "";
  if (
    passwordInputs[0].value &&
    passwordInputs[1].value &&
    passwordInputs[0].value == passwordInputs[1].value
  ) {
    password = passwordInputs[0].value;
    try {
      let params = generateAllfromMnemonic(mnemonic);
      const passwordHash = CryptoJS.SHA256(password).toString();

      await putValueToLocalStorage("passwordHash", passwordHash, password);
      await putValueToLocalStorage("mnemonic", params.mnemonic, password);
      await putValueToLocalStorage("privateKey", params.privateKey, password);
      await putValueToLocalStorage("publicKey", params.publicKey, password);
      await putValueToLocalStorage("address", params.address, password);
      await savePassword(password);

      window.location.href = "home.html";
    } catch (e) {
      console.error(e);
      showError("Invalid mnemonic");
    }
  } else {
    if (!passwordInputs[0].value) {
      showError("Provide password!");
      return;
    }
    if (!passwordInputs[1].value) {
      showError("Provide password confirmation!");
      return;
    }
    if (passwordInputs[0].value != passwordInputs[1].value) {
      showError("Passwords don`t match!");
      return;
    }
  }
});

toLoginButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

toRegisterButton.addEventListener("click", () => {
  window.location.href = "register.html";
});

//------------------------------------------------------------
// Extension button
document.getElementById("openTabButton").addEventListener("click", async () => {
  const extensionURL = browser.runtime.getURL("./utils/recover.html");
  await browser.tabs.create({ url: extensionURL });
});

//------------------------------------------------------------
// Localisation
async function updateRecover() {
  const lang = await getLang();
  document.getElementById("mnemonic-label").innerHTML = await getValueByKey(
    "putMnemonic",
    lang
  );

  document.getElementById("to-login-button").innerHTML = await getValueByKey(
    "toLogin",
    lang
  );
  document.getElementById("to-register-button").innerHTML = await getValueByKey(
    "toRegister",
    lang
  );
  document.getElementById("password").placeholder = await getValueByKey(
    "password",
    lang
  );
  document.getElementById("new-password-label").innerHTML = await getValueByKey(
    "newPassword",
    lang
  );
  document.getElementById("confirm-password").placeholder = await getValueByKey(
    "confirmPassword",
    lang
  );
  document.getElementById("confirm-password-label").innerHTML =
    await getValueByKey("confirmPasswordLabel", lang);
  document.getElementById("confirm-new-password-button").innerHTML =
    await getValueByKey("proceed", lang);
}

const localisationButton = document.getElementById("changeLangButton");
localisationButton.addEventListener("click", async () => {
  let lang = await getLang();
  await nextLang(lang);

  updateRecover();
  // console.log(await getLang());
});
document.addEventListener("DOMContentLoaded", async () => {
  updateRecover();
});
