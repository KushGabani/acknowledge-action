"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require("@actions/core");
const github = require("@actions/github");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new github.GitHub(core.getInput("repo-token", { required: true }));
            // If the issue is being closed, we don't need to do anything
            if (github.context.payload.action !== "opened") {
                return;
            }
            // Is the user a new contributor?
            if (!github.context.payload.sender) {
                throw new Error("Error! No sender provided");
            }
            const sender = github.context.payload.sender.login;
            const issue = github.context.issue;
            let firstIssue = yield isFirstIssue(client, sender, issue);
            if (!firstIssue) {
                // user is not a new contributor
                return;
            }
            const issueMessage = core.getInput("issue-message").replace(/{username}/, sender) || "Hello! Thank you for raising this issue. We hope to resolve an issue soon!";
            const prMessage = core.getInput("pr-message").replace(/{username}/, sender) || "Hello! Your pull request will be reviewed soon. We hope to merge this pull request soon!";
            yield client.issues.createComment({
                owner: issue.owner,
                repo: issue.repo,
                issue_number: issue.number,
                body: issueMessage
            });
        }
        catch (error) {
            console.log('ERROR: ' + error);
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
            return;
        }
    });
}
function isFirstIssue(client, sender, currIssue) {
    return __awaiter(this, void 0, void 0, function* () {
        const { status, data: issues } = yield client.issues.listForRepo({
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
    });
}
main().then(() => {
});
