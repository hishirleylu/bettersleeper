const USER_INFO_ENDPOINT = "https://api.sleeper.app/v1/user/{0}"

async function getUserInfoByUsername(username) {
    return apiCallOne(USER_INFO_ENDPOINT, username);
}