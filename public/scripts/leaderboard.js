async function main() {
    let top = await db.collection("users").orderBy("correct", "desc").limit(10).get();
    const table = document.querySelector("#table");
    let i = 0;
    top.forEach(function (e) {
        let data = e.data()
        let rowTemplate = `<tr>
            <td>${i+1}</td>
            <td>${data.username}</td>
            <td>${data.correct}</td>
            <td>${data.incorrect}</td>
        </tr>`;
        table.innerHTML += rowTemplate;
        i++;
    });
}

async function searchUsernames(string) {
    let names = await db.collection("users").orderBy("username").startAt([string]).endAt([string + '\uf8ff']).limit(5).get()
    names.forEach(n => {
        console.log(n.data())
    })
}

async function getCurrentUserScore() {
    let uid = auth.currentUser.uid;
    let res = await db.collection("users").doc(uid).get();
    let data = res.data();
    document.getElementById("score").innerHTML = `<strong>Username:</strong> ${data.username}<br>
    <strong>Correct:</strong> ${data.correct}<br>
    <strong>Incorrect:</strong> ${data.incorrect}`;
}

auth.onAuthStateChanged((user) => {
  getCurrentUserScore();
})

main();