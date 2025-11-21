import exprees from 'express';
import { envs } from './config';
import { GithubController } from './presentation/github/controller';



(() => {
    main();
})();


function main() {

    const app = exprees();
    const controller = new GithubController();

    app.use( exprees.json() );

    app.post('/api/github', controller.webHookHandler );

    app.listen( envs.PORT, () => {
        console.log(`Running on port: ${ envs.PORT }`)
    } )
}