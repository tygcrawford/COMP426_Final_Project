async function main() {
    let top = await db.collection("users").orderBy("correct", "desc").limit(10).get()
    top.forEach(e => {
        console.log(e.data())
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
    document.getElementById("score").innerText = `username: ${data.username}
    correct: ${data.correct}
    incorrect: ${data.incorrect}`;
}

auth.onAuthStateChanged((user) => {
  getCurrentUserScore()  
})