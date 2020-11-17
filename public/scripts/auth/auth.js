let creatingAccount = false;

// listen for auth state change
auth.onAuthStateChanged((user) => {
    if (user && !creatingAccount) {
        window.location.href = "pages/quiz.html"
    }
});

async function checkUsernameUnique(username) {
    let query = await db.collection("users").where("username", "==", username).get();
    return query.empty;
}

function errorMessage(message) {
    let notif = document.querySelector("#error-notif");
    notif.innerText = message;
    notif.classList.remove("is-hidden")
}

// user signup
const signup_form = document.querySelector("#signup-form");
signup_form.addEventListener("submit", async (e) => {
    creatingAccount = true;
    e.preventDefault();

    const username = signup_form["signup-username"].value
    const email = signup_form["signup-email"].value
    const password = signup_form["signup-password"].value

    let unique = await checkUsernameUnique(username);

    if (unique) {
        auth.createUserWithEmailAndPassword(email, password).then(async (creds) => {
            const user_data = {
                username: username,
                correct: 0,
                incorrect: 0
            }
            await db.collection("users").doc(creds.user.uid).set(user_data);
            window.location.href = "pages/quiz.html"
        }).catch((e) => {
            errorMessage("This email is already associated with an account.");
        });
    } else {
        errorMessage("This username is already taken.")
    }
});

// user login
const login_form = document.querySelector("#login-form");
login_form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = login_form["login-email"].value;
    const password = login_form["login-password"].value;

    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        // console.log("logged in")
    }).catch((e) => {
        errorMessage("Email or password incorrect.");
    });
});