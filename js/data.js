
const appId = `35D3ACA4-25E4-4FC2-FF81-06F5640F8500`;
const apiKey = `8A81FE35-75FB-4631-9CF3-94C7A55D4F3C`;

function host(endpoint) {
    return `https://api.backendless.com/${appId}/${apiKey}/${endpoint}`;
}

const endpoints = {
    REGISTER: 'users/register',
    LOGIN: 'users/login',
    LOGOUT: 'users/logout',
    PLACES: 'data/places',
    LIKES: 'data/likes'
};

export async function register(email, password) {

    const result = (await fetch(host(endpoints.REGISTER), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })).json();

    return result;
}

export async function login(email, password) {

    const result = await (await fetch(host(endpoints.LOGIN), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: email,
            password
        })
    })).json();

    localStorage.setItem('userToken', result['user-token']);
    localStorage.setItem('email', result.email);
    localStorage.setItem('userId', result.objectId);

    return result;
}

export async function logout() {

    const token = localStorage.getItem('userToken');

    const result = fetch(host(endpoints.LOGOUT), {
        headers: {
            'user-token': token
        }
    });

    localStorage.removeItem('userToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');

    return result;
}

//create place
export async function createPlace(place) {

    const token = localStorage.getItem('userToken');

    const result = (await fetch(host(endpoints.PLACES), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify(place)
    })).json();

    return result;
}


//edit place
export async function updatePlace(id, updatedProps) {

    const token = localStorage.getItem('userToken');

    const result = (await fetch(host(endpoints.PLACES + '/' + id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify(updatedProps)
    })).json();

    return result;
}

// delete place
export async function deletePlace(id) {

    const token = localStorage.getItem('userToken');

    const result = await fetch(host(endpoints.PLACES + "/" + id), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        }
    });

    return result;
}

//get place by Id
export async function getPlaceById(id) {

    const token = localStorage.getItem('userToken');


    const result = (await fetch(host(endpoints.PLACES + "/" + id + `?relationsDepth=1`), {
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        }
    })).json();

    return result;
}

// get places by user ID
export async function getPlaceByOwner() {

    const token = localStorage.getItem('userToken');
    const ownerId = localStorage.getItem('userId');

    const result = (await fetch(host(endpoints.PLACES + `?where=ownerId%3D%27${ownerId}%27`), {
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        }
    })).json();

    return result;
}

//get all places
export async function getAllPlaces() {


    const token = localStorage.getItem('userToken');


    const result = (await fetch(host(endpoints.PLACES), {
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        }
    })).json();

    return result;
}


//like place
export async function likePlace() {

    const token = localStorage.getItem('userToken');
    const email = localStorage.getItem('email');
    const result = (await fetch(host(endpoints.LIKES), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify({ email })
    })).json();

    return result;
}


export async function setPlaceLikeId(likeid, placeid) {

    const token = localStorage.getItem('userToken');

    const response = await fetch(host(endpoints.PLACES + "/" + placeid + "/likes"), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify([`${likeid}`])
    });

    const data = await response.json();

    if (data.hasOwnProperty('errorData')) {
        const error = new Error();
        Object.assign(error, data);
        throw error;
    }

    return data;
}

// export async function searchPlace(str) {

//     const token = localStorage.getItem('userToken');

//     let result;
//     if (!str) {
//         result = getAllPlaces();
//     } else {
//         result = (await fetch(host(endpoints.PLACES + `?where=title%20LIKE%20%27%25${str}%25%27`), {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'user-token': token
//             }
//         })).json();
//     }
//     return result;
// }