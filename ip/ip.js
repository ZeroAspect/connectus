async function IPquery(){
    const ip = await fetch("https://api.ipify.org?format=json")
    const json = await ip.json()
    return json
}

module.exports = IPquery