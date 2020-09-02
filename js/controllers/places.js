import { showInfo, showError } from '../notification.js';
import { createPlace, getPlaceById, updatePlace, deletePlace, likePlace, setPlaceLikeId, getAllPlaces } from '../data.js';

export async function createGet() {
    this.partials = {
        header: await this.load('./templates/header.hbs'),
        footer: await this.load('./templates/footer.hbs'),
    };

    this.partial('./templates/create.hbs', this.app.userData);
}

export async function createPost() {
    const place = {
        title: this.params.title,
        location: this.params.location,
        imageUrl: this.params.imageUrl,
        description: this.params.description
    };

    try {
        if (place.title.length === 0) {
            throw new Error('Title should not be empty');
        }
        if (place.location.length === 0) {
            throw new Error('Location should not be empty');
        }
        if (place.imageUrl.length === 0) {
            throw new Error('ImageUrl should not be empty');
        }
        if (place.description.length === 0) {
            throw new Error('Description should not be empty');
        }


        const result = await createPlace(place);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Created successfully!');
        this.redirect('#/home');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

export async function detailsGet() {
    this.partials = {
        header: await this.load('./templates/header.hbs'),
        footer: await this.load('./templates/footer.hbs'),
    };
    const id = this.params.id;
    const place = await getPlaceById(id);
    const context = Object.assign({ place }, this.app.userData);
    if (place.ownerId === this.app.userData.userId) {
        context.isCreator = true;
    };

    const isLiked = place.likes.map(o => o.email).includes(this.app.userData.email);
    context.isLiked = isLiked;

    await this.partial('./templates/details.hbs', context);

    //like
    const likeBtn = document.querySelector('#likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            // e.stopPropagation();
            try {
                const result = await likePlace();
                const likeid = result.objectId;

                const res = await setPlaceLikeId(likeid, id);
                if (res.hasOwnProperty('errorData')) {
                    const error = new Error();
                    Object.assign(error, res);
                    throw error;
                }
                likeBtn.remove();
                let textContainer = document.querySelector("#container > div > div.info > div");
                let span = document.createElement('span');
                span.textContent = `You liked that place!`;
                textContainer.appendChild(span);
                // return;
            } catch (err) {
                showError(err.message);
            }
        })
    }
}


export async function editGet() {
    this.partials = {
        header: await this.load('./templates/header.hbs'),
        footer: await this.load('./templates/footer.hbs'),
    };
    const id = this.params.id;
    const place = await getPlaceById(id);
    const context = Object.assign({ place }, this.app.userData);
    // context.isCreator = (recipe.objectId === this.app.userData.userId);
    await this.partial('./templates/edit.hbs', context);

}

export async function editPost() {
    const id = this.params.id;

    const updatedPlace = {
        title: this.params.title,
        location: this.params.location,
        imageUrl: this.params.imageUrl,
        description: this.params.description
    };

    try {
        if (updatedPlace.title.length === 0) {
            throw new Error('Title should not be empty');
        }
        if (updatedPlace.location.length === 0) {
            throw new Error('Location should not be empty');
        }
        if (updatedPlace.imageUrl.length === 0) {
            throw new Error('ImageUrl should not be empty');
        }
        if (updatedPlace.description.length === 0) {
            throw new Error('Description should not be empty');
        }

        const result = await updatePlace(id, updatedPlace);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Edited successfully!');
        this.redirect(`#/details/${result.objectId}`);
    } catch (err) {
        console.error(err);
        showError(err.message);
    }

}

export async function deleteGet() {
    const id = this.params.id;

    try {
        const result = await deletePlace(id);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Deleted successfully!');
        this.redirect('#/home');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }

}

// export async function likeGet() {
//     const placeid = this.params.id;
//     const place = await getPlaceById(placeid);

//     const result = await likePlace();

//     const likeid = result.objectId;

//     const res = await setPlaceLikeId(likeid, placeid);
//     if (res.hasOwnProperty('errorData')) {
//         const error = new Error();
//         Object.assign(error, res);
//         throw error;
//     }

//     showInfo('Liked successfully!');
//     this.redirect(`#/details/${placeid}`);
// }


export async function searchGet() {
    let searchString = this.params.search || '';

    this.partials = {
        header: await this.load('./templates/header.hbs'),
        footer: await this.load('./templates/footer.hbs'),
        place: await this.load('./templates/place.hbs')
    };
    let context = Object.assign({}, this.app.userData);

    if (searchString) {
        const allPlaces = await getAllPlaces();
        let searchPlaces = allPlaces.filter(e => e.title.toLowerCase().includes(searchString.toLowerCase()) ||
            e.description.toLowerCase().includes(searchString.toLowerCase()) ||
            e.location.toLowerCase().includes(searchString.toLowerCase()));

        context.places = searchPlaces;
    } else {
        const places = await getAllPlaces();
        context.places = places;
    }

    this.partial('./templates/home.hbs', context);
}

