import { Request, Response } from 'express';
import { GitHubService } from '../services/github.service';
import { DiscordService } from '../services/discord.service';

export class GithubController {

    constructor(
        private readonly githubService = new GitHubService(),
        private readonly discordService = new DiscordService(),
    ) {}

    webHookHandler = ( req: Request, res: Response ) => {
        
        const gitHubEvent = req.header('x-github-event') ?? 'unknown';
        const payload = req.body;
        let message: string;

        switch( gitHubEvent ) {

            case 'star':
                message = this.githubService.onStart( payload );
            break;

            case 'issues':
                message = this.githubService.onIssue( payload );
            break;

            default:
                message = `Unknown event ${ gitHubEvent }`;
        }

        this.discordService.notify( message )
        .then( () => res.status(202).send('Accepted' ) )
        .catch( () => res.status(500).json({ error: 'Internal server error'}));
    }
}