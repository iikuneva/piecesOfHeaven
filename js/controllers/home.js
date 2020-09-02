import { getAllPlaces } from '../data.js';

export default async function home() {
    this.partials = {
        header: await this.load('./templates/header.hbs'),
        footer: await this.load('./templates/footer.hbs'),
        place: await this.load('./templates/place.hbs')
    };

    const context = Object.assign({}, this.app.userData);
    if (this.app.userData.email) {
        const places = await getAllPlaces();
        context.places = places;
    }

    this.partial('./templates/home.hbs', context);
}