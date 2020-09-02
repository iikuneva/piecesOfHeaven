import home from './controllers/home.js';
import { registerGet, registerPost } from './controllers/register.js';
import { loginGet, loginPost } from './controllers/login.js';
import { logoutGet } from './controllers/logout.js';
import { createGet, createPost, detailsGet, editGet, editPost, deleteGet, searchGet } from './controllers/places.js';


window.addEventListener('load', () => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.userData = {
            email: localStorage.getItem('email') || '',
            userId: localStorage.getItem('userId') || '',
        };

        this.get('index.html', home);
        this.get('#/home', home);
        this.get('/', home);

        this.get('#/register', registerGet);
        this.post('#/register', ctx => { registerPost.call(ctx); });

        this.get('#/login', loginGet);
        this.post('#/login', ctx => { loginPost.call(ctx); });
        this.get('#/logout', logoutGet);

        this.get('#/create', createGet);
        this.post('#/create', ctx => { createPost.call(ctx); });

        this.get('#/details/:id', detailsGet);

        this.get('#/delete/:id', deleteGet);

        this.get('#/edit/:id', editGet);
        this.post('#/edit/:id', ctx => { editPost.call(ctx); });
        
        // this.get('#/like/:id', likeGet);

        this.get('#/search', searchGet);

        this.get('', function() {
            this.swap ('<h1>404 Page not found')
        });

    });

    app.run();
});