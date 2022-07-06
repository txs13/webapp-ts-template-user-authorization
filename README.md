<h1>MERN webapp template in TypeScript with JWT authorization, admin panel</h1>
<p>The purpose of this repository is to have a tested MERN app template with scalable, maintenable architecture, user authorization strategy, admin panel</p>
<hr/>
<h2>Manual content</h2>
<ul>
    <li><a href="#app-functionality">App functionality</a></li>
    <li><a href="#design-approach">General design approach</a></li>
    <li><a href="#reuse-installation">Reuse and installation instructions</a></li>
    <ul>
        <li><a href="#env">.env parameters</a></li>
        <li><a href="#jwt">JWT keys</a></li>
        <li><a href="#first-start">First start</a></li>
        <li><a href="#local-install">Local installation</a></li>
        <li><a href="#docker-dev">Further development in Docker container</a></li>
        <li><a href="#docker-prod">Production mode in Docker container</a></li>
    </ul>
    <li><a href="#tests">Tests</a></li>
    <li><a href="#to-be-done">To be done / added in further releases</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
</ul>
<hr/>
<h2 id="app-functionality">App functionality</h2>
<p>Working on the side project with my friend, I came to the idea, that it would be very convenient to have a template with some basic functionality - login / logout, user profile page, new user registration page, admin panel, etc.</p>
<p>Navbar contains a logo which leads either to login form or to the starting app page, link to the "about app" page, user menu. After successful login, user menu contains links to the app starting page, user profile, logout function. For admin users there is also admin panel item in the app menu.</p>
<p>Below the navbar there is the area for app messages. Messages appear after some important events and go away several seconds later.</p>
<p>Login form is pretty standard. App checks that user entered at least some inputs and tries to login. "Remember me" option ensures user email to be stored locally and to be used next time user opens the page after logout."</p>
<p>Register form allows user to sign up for the app account. During registration user has to enter just several things about him/her, much more could be added after registration in "profile" app page. App checks that user entered correct information (email, name formats, password length, etc.), but acoount is not going to be active until administrator confirms it. This function is available at admin panel.</p>
<p>Profile page allows user to edit / add information about him/her, delete own profile, change password.</p>
<p>Portal roles are custom and could be edited at admin panel. Administrators can add, remove, edit app roles. Crrently role has no impact on the app functionality.</p>
<p>Admin panel contains also the page with user list, where admin can confirm new user access to the app, change user data, passwords.</p>
<p>"About app", "starting app page", "starting admin panel page" are currenty empty and are supposed to be added / adjusted later according to the forked app needs.</p>
<hr/>
<h2 id="design-approach">General design approach</h2>
<p>Backend app architecture is based on service - controller approach with heavy usage of middleware (for user authorization, admin access, input validation, etc.). Frontend is based on Model-View-Controller strategy. Later I am going to publish here diagrams with comlete api scheme, authorization strategy, frontend architecture, which I use as a handy cheat-sheet if get lost in own code.</p>
<p>App backend is based on the following technologies: express for api handling, zod for input validation, mongoose and mongo db for database handling.</p>
<p>Frontend is based on react, redux, react-router technologies, mui components. In general I already have a lot of ideas regarding code refactoring, but I am going to tackle this after complete all the automatic tests.</p>
<hr/>
<h2 id="reuse-installation">Reuse and installation instructions</h2>
<p>Working on the app I had to move from one design environment to another and therefore had to change environmental variable quite often. Just to make it a littly bit more convenient, current setup allows user to run the app in several modes and proper environmental variables are supposed to be changed automaticly.</p>
    <h3 id="env">.env parameters</h3>
    <p> During the startup app checks the availability of .env file and if there is no one, it creates .env with defaut values. Please keep in mind, that if you delete only one row or record, app will not catch this. If you feel that you cannot find what is missing in .env, just kill it - app will create the default file with full set of necessary values. </p>
    <h3 id="jwt">JWT keys</h3>
    <p>App requires a folder named "keys" with corect jwt keys pair. During the startup, app checks that keys are in place and match each other. If app cannot find keys or folder (for instance during the first startup), it creates both folder and generates keys pair. So if somewhy your keys are corupted pr lost and there is no special purpose to look for exactly the old ones - just kill the "keys" folder with key(s) and app will create the new and correct ones.</p>
    <h3 id="first-start"> First start</h3>
    <p>During every startup app checks at least one admin user and one admin role to be in the database. If there are no ones, app creates default user and role. Default admin username is "admin@example.com", password is "qwerty123". Do not forget to change this password - you can use password generator at the user profile page or admin panel. If admin has default password, app is going to remind you writing this to the server log during every startup.</p>
    <h3 id="local-install">Local installation</h3>
    <h3 id="docker-dev">Further development in Docker container</h3>
    <h3 id="docker-prod">Production mode in Docker container</h3>
<hr/>
<h2 id="tests">Tests</h2>
<hr/>
<h2 id="to-be-done">To be done / added in further releases</h2>
<hr/>
<h2 id="screenshots">Screenshots</h2>
<img src="./screenshot1.png" width="auto"/>
<img src="./screenshot2.png" width="auto"/>