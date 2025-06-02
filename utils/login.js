//------------------------------------------------------------
// Login

const input = document.getElementById("login-password-input");
const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", async () => {
  const password = input.value;
  console.log(CryptoJS.SHA256(password).toString());
  await getValueFromLocalStorage("passwordHash", password).then(
    (passwordHash) => {
      if (CryptoJS.SHA256(password).toString() == passwordHash) {
        console.log("password pass!");
        try {
          savePassword(password);
          window.location.href = "home.html";
        } catch (e) {
          console.log("Some error: ", e);
        }
      } else {
        showError("Wrong Password!");
      }
    }
  );
});

//------------------------------------------------------------
// Recover

const forgotPasswordButton = document.getElementById("forgot-password-button");
forgotPasswordButton.addEventListener("click", () => {
  window.location.href = "recover.html";
});

//------------------------------------------------------------
// Extension button
document.getElementById("openTabButton").addEventListener("click", async () => {
  const extensionURL = browser.runtime.getURL("utils/login.html");
  await browser.tabs.create({ url: extensionURL });
});

//------------------------------------------------------------
// Localisation
async function updateLogin() {
  const lang = await getLang();
  document.getElementById("login-password-input").placeholder =
    await getValueByKey("password", lang);
  document.getElementById("login-button").innerHTML = await getValueByKey(
    "login",
    lang
  );
  document.getElementById("forgot-password-button").innerHTML =
    await getValueByKey("forgotPassword", lang);
}

const localisationButton = document.getElementById("changeLangButton");
localisationButton.addEventListener("click", async () => {
  let lang = await getLang();
  await nextLang(lang);

  updateLogin();
  // console.log(await getLang());
});
document.addEventListener("DOMContentLoaded", async () => {
  updateLogin();
});
