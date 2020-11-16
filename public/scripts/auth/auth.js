// listen for auth state change
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = "pages/quiz.html"
    } else {
        console.log("no current user");
    }
});

// user signup
const signup_form = document.querySelector("#signup-form");
signup_form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = signup_form["signup-username"].value
    const email = signup_form["signup-email"].value
    const password = signup_form["signup-password"].value
    
    auth.createUserWithEmailAndPassword(email, password).then((creds) => {
        const user_data = {
            username: username,
            correct: 0,
            incorrect: 0
        }
        db.collection("users").doc(creds.user.uid).set(user_data);
        console.log("signed up");
    });
});

// user login
const login_form = document.querySelector("#login-form");
login_form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = login_form["login-email"].value;
    const password = login_form["login-password"].value;

    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        console.log("logged in")
    });
});