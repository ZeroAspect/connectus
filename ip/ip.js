async function IPquery(){
    const ip = await fetch("http://ip-api.com/json/")
    const json = await ip.json()
    return json
}

module.exports = IPquery