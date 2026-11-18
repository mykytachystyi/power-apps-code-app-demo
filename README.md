# My First Power Apps Code App

A learning project built with React, TypeScript, Vite, and Power Apps.
It retrieves the current user's profile and attempts to retrieve their manager
through the Office 365 Users connector.

## What I learned

- Connector: an integration with a service, such as Office 365 Users.
- Connection: authenticated access to that service.
- Data source: the connector added to a particular app using a connection.
- Generated service: typed TypeScript methods used to call the connector.

Request flow:
React -> generated service -> Power Platform connection -> Office 365 Users.

Office 365 Users accesses Microsoft Entra user information through Microsoft Graph.
It does not read the Dataverse Users table.

## Prerequisites

- Node.js LTS, npm, and Git.
- A Power Platform test environment with Code Apps enabled.
- Permission and licensing to run the app.
- An Office 365 Users connection in that environment.

Enable Code Apps in Power Platform admin center:
Manage -> Environments -> select environment ->
Settings -> Product -> Features -> Enable code apps.

## CLI version used

The installed CLI exposes `power-apps`, not `pa`.

Install:
npm install --global @microsoft/power-apps-cli

Check:
power-apps --help
power-apps init --help

Newer documentation uses `pa app ...`.
Command names and parameters depend on the installed CLI version.

The original setup also installed @microsoft/power-apps globally.
For a cloned project, npm install restores its declared project dependencies.

## Original project creation

npx degit github:microsoft/PowerAppsCodeApps/templates/vite code-app-demo-manual
cd code-app-demo-manual
npm install

## Set up a clone

npm install

Initialize using your own environment:
power-apps init -n "My First Code App" -e YOUR-ENVIRONMENT-ID

Sign in with the account that can access that environment.
power.config.json is local and excluded from Git.
power.config.example.json documents the configuration structure.

## Add Office 365 Users

In make.powerapps.com, select the correct environment:
Connections -> New connection -> Office 365 Users -> Create.

Open the connection details. Its URL contains the connection ID.

Run:
power-apps add-data-source -a "shared_office365users" -c "YOUR-CONNECTION-ID"

If asked whether you are using a connection reference, select No.
This exercise uses a direct connection ID.

The CLI generates:
- src/generated/models/Office365UsersModel.ts
- src/generated/services/Office365UsersService.ts

## Run locally

In one terminal:
power-apps run

If it reports that the app is not running on localhost:3000,
open a second terminal in the project directory:
npm run dev -- --port 3000

Some template versions integrate the local services differently.
Follow the URLs printed by your installed tooling.

Open the Local Play URL in the same browser profile used for Power Apps.
Keep the required development processes running.

## Profile and manager calls

The app uses:
Office365UsersService.MyProfile_V2('id,displayName,mail,userPrincipalName')

Then it passes the returned user ID to:
Office365UsersService.Manager_V2(userId, 'id,displayName,mail')

Check result.success before using result.data.
A failed result may contain an error even if no exception is thrown.

## Troubleshooting encountered

### pa is not recognized

Our CLI package exposed only the power-apps executable.
Inspect the installed version and use power-apps --help.
Changing PATH cannot create a command absent from the package.

### PowerShell rejects cd /d

/d is CMD syntax.
In PowerShell, use:
cd D:\Projects\code-app-demo-manual

### Environment not found

Verify the Environment ID and the signed-in tenant/account.
We retried initialization after checking authentication, and it succeeded.

### Local app is not running

The Power Apps local connection service and Vite frontend may require
separate running terminals. Check the ports printed by each process.

### Error appears as {}

JSON.stringify can omit Error properties.
Inspect the browser console and display error.message explicitly.

### Manager lookup returns 404

Microsoft Graph returns 404 when the user has no assigned manager.
A Dataverse manager assignment does not configure the Entra manager relationship.

In our test, profile retrieval succeeded, but the Entra manager was unavailable.
The test account could not edit the Entra assignment.

Dataverse System Administrator permissions do not grant Entra administrator rights.

## Dependency audit

At initial setup, npm audit reported a picomatch advisory affecting
the Vite and TypeScript ESLint dependency chains.

No forced dependency changes were applied.
Review the current npm audit output before publishing.
Dependency remediation remains unfinished.

## Current status

- Local Code App runs in Power Apps Local Play.
- React changes appear through Vite hot reload.
- Office 365 Users data source is configured.
- Profile retrieval works.
- Manager lookup returns 404 for the test user.
- Publishing to Power Apps has not been completed.

## Documentation

- https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview
- https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch
- https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data
- https://learn.microsoft.com/en-us/graph/api/user-list-manager
