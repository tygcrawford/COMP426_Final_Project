const loginTab = document.querySelector("#login-tab");
const signupTab = document.querySelector("#signup-tab");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

let open = "login"

loginTab.addEventListener("click", (e) => {
    if (open === "signup") {
        signupTab.classList.remove("is-active")
        loginTab.classList.add("is-active")
        signupForm.classList.add("is-hidden")
        loginForm.classList.remove("is-hidden")
        open = "login"
    }
});

signupTab.addEventListener("click", (e) => {
    if (open === "login") {
        signupTab.classList.add("is-active")
        loginTab.classList.remove("is-active")
        signupForm.classList.remove("is-hidden")
        loginForm.classList.add("is-hidden")
        open = "signup"
    }
});