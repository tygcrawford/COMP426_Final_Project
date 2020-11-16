// user logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();

    auth.signOut().then(() => {
        console.log("logged out");
    });
});