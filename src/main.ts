const core = require("@actions/core");
const github = require("@actions/github");

type githubIssue = {
    owner: string,
    repo: string,
    number: string
}

async function main() {
    try {
        const client = new github.GitHub(core.getInput("token", {required: true}));

        // If the issue is being closed, we don't need to do anything
        if (github.context.payload.action !== "opened") {
            return;
        }

        // Is the user a new contributor?
        if (!github.context.payload.sender) {
            throw new Error("Error! No sender provided");
        }

        const sender: string = github.context.payload.sender!.login;
        const issue: githubIssue = github.context.issue;


        let firstIssue: boolean = await isFirstIssue(
            client,
            sender,
            issue
        );

        if (!firstIssue) {
            // user is not a new contributor
            return;
        }

        const issueMessage: string = core.getInput("issue-message").replace(/{username}/, sender) || "Hello! Thank you for raising this issue. We hope to resolve an issue soon!";
        const prMessage: string = core.getInput("pr-message").replace(/{username}/, sender) || "Hello! Your pull request will be reviewed soon. We hope to merge this pull request soon!";

        await client.issues.createComment({
            owner: issue.owner,
            repo: issue.repo,
            issue_number: issue.number,
            body: issueMessage
        });

    } catch (error) {
        console.log('ERROR: ' + error);
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        return;
    }
}

async function isFirstIssue(
    client,
    sender: string,
    currIssue: githubIssue
): Promise<boolean> {
    const {status, data: issues} = await client.issues.listForRepo({
        owner: currIssue.owner,
        repo: currIssue.repo,
        creator: sender,
        state: 'all'
    });

    if (status !== 200) {
        throw new Error(`Received unexpected API status code ${status}`);
    }

    if (issues.length === 0) {
        return true;
    }

    for (const issue of issues) {
        if (issue.number < currIssue.number && !issue.pull_request) {
            return false;
        }
    }

    return true;
}

main().then(() => {
});