import { GitHubIssuePayload, GitHubStartPayload } from "../../interfaces";


export class GitHubService {

    constructor () {}

    onStart( payload: GitHubStartPayload ): string {

        let message: string;
        const { sender, action, repository } = payload;

        return message = `User ${ sender.login } ${ action } star on ${ repository.full_name }`;
    }

    onIssue( payload: GitHubIssuePayload ): string {
        let message: string;
        const { action, issue } = payload;

        if ( action === 'opened' ) {
            return `An issue was opened with this title ${ issue.title }`;
        }

        if ( action === 'closed' ) {
            return `An issue was closed by ${ issue.user.login }`;
        }

        if ( action === 'reopened' ) {
            return `An issue was reopened by ${ issue.user.login }`;
        }

        return `Unhandler action for the issue event ${ action }`;
    }
}