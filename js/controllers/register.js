import { register, login } from '../data.js';
import { showInfo, showError } from '../notification.js';

export async function registerGet() {
    this.partials = {
        header: await this.load('./templates/header.hbs'),
        footer: await this.load('./templates/footer.hbs')
    };

    this.partial('./templates/register.hbs', this.app.userData);
}

export async function registerPost() {
    try {
        if (this.params.password !== this.params.repeatPassword) { 
            throw new Error('Password don\'t match');
        }
        if (this.params.email.length === 0) {
            throw new Error('The email input must be filled'); 
        }
        if (this.params.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        const result = await register(this.params.email, this.params.password);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        const loginResult = await login(this.params.email, this.params.password);
        if (loginResult.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, loginResult);
            throw error;
        }
        this.app.userData.email = loginResult.email;
        this.app.userData.userId = loginResult.objectId;
        

        showInfo('Successfully registerd');
        this.redirect('#/home');
        
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}