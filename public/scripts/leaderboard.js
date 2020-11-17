async function drawLeaderboard() {
    let top = await db.collection("users").orderBy("rating", "asc").limit(10).get();
    const table = document.querySelector("#leaderboard-table");
    let i = 0;
    top.forEach(function (e) {
        let user = e.data()
        let rowTemplate = `<tr>
            <td>${i+1}</td>
            <td>${user.username}</td>
            <td>${user.correct}</td>
            <td>${user.incorrect}</td>
            <td>${user.correct + user.incorrect}</td>
            <td>${user.rating}</td>
        </tr>`;
        table.innerHTML += rowTemplate;
        i++;
    });
}

async function getAllUsernames() {
    let query = await db.collection("users").get()
    let data = query.docs.map( doc => doc.data().username )
    return data
}

async function getCurrentUserScore() {
    let uid = auth.currentUser.uid;
    let res = await db.collection("users").doc(uid).get();
    return res.data();
}

async function displayCurrentUserScore() {
    let user = await getCurrentUserScore();
    let rowTemplate = `<tr>
            <td>${user.username}</td>
            <td>${user.correct}</td>
            <td>${user.incorrect}</td>
            <td>${user.correct + user.incorrect}</td>
            <td>${user.rating}</td>
        </tr>`;
    document.getElementById("currentuser-table").innerHTML = rowTemplate;
}

async function getUserWithUsername(username) {
    let query = await db.collection("users").where("username", "==", username).get();
    if(query.empty) return undefined;
    return query.docs[0].data();
}

auth.onAuthStateChanged((user) => {
  displayCurrentUserScore();
})


drawLeaderboard();

$(async () => {
    $("#search-box").on("change", async (e) => {
        let username = e.target.value;
        let user = await getUserWithUsername(username);
        if (user) {
            $("#userinfo-table-container").toggleClass("is-hidden")
            let rowTemplate = `<tr>
                    <td>${user.username}</td>
                    <td>${user.correct}</td>
                    <td>${user.incorrect}</td>
                    <td>${user.correct + user.incorrect}</td>
                    <td>${user.rating}</td>
                </tr>`;
            $("#userinfo-table").html(rowTemplate);
        }
    });

    $("#search-box").autocomplete({
        source: await getAllUsernames()
    });
})