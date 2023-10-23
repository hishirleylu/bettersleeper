async function apiCallOne(endpoint, first) {
    let request = endpoint.replace("{0}", first)
    const response = await fetch(request);
    return await response.json();
}
async function apiCallTwo(endpoint, first, second) {
    let request = endpoint.replace("{0}", first).replace("{1}", second)
    console.log(request)
    const response = await fetch(request);
    return await response.json();
}