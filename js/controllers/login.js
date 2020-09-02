import { login } from '../data.js';
import { showInfo, showError } from '../notification.js';

export async function loginGet() {
    this.partials = {
        header: await this.load('./templates/header.hbs'),
        footer: await this.load('./templates/footer.hbs'),
    };
    this.partial('./templates/login.hbs', this.app.userData);
}

export async function loginPost() {
    try {
        
        const result = await login(this.params.email, this.params.password);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

       
        this.app.userData.email = result.email;
        this.app.userData.userId = result.objectId;
       
        showInfo(`Logged in as ${result.email}`);

        this.redirect('#/home');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}