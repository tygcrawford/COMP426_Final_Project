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

searchUsernames("wow")
// main()