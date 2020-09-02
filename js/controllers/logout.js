import { logout } from '../data.js';
import { showInfo, showError } from '../notification.js';

export async function logoutGet() {
    try {
        const result = await logout();
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        this.app.userData.email = '';
        this.app.userData.userId = '';

        showInfo('Successfully logged out');

        this.redirect('#/home');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}
