<h1 align="center">Monux</h1>

<p align="center">
  <img alt="Monux Logo" height="200" src="https://user-images.githubusercontent.com/3316789/41643946-9fb8fbac-7464-11e8-9dcf-083ec60bc178.png">
</p>

<p align="center">
  Desktop Banking Client
</p>


## Contents

- [Vision](#vision)
- [Download](#download)
- [Features](#features)
- [Usage](#usage)
- [Support this project](#support-this-project)
- [Goals](#goals)
- [Screenshots](#screenshots)
- [Contributors](#contributors)


## Vision

Monux is being designed to support all OSes and any bank with a public API. At the moment, Monux only supports [Monzo](https://monzo.com) on macOS and Windows.


## Download

#### [The latest release can be downloaded here →](https://github.com/robjtede/monux/releases/download/v0.9.3/Monux-0.9.3-mac.zip)

[See releases for older versions →](https://github.com/robjtede/monux/releases)


## Features

- ☑️ View balance / spend today
- ☑️ Transaction list view
- ☑️ Month-by-month spending breakdowns
- ☑️ Transaction detail view
- ☑️ Full notes and attachments
- ☑️ Edit notes
- ☑️ Add and remove attachments/receipts
- ☑️ Filter transactions


## Usage

### Create a client

- [Create a new OAuth client](https://developers.monzo.com/apps/home) on the Monzo developer site. The name, logo and description can be anything you like.
- The `Redirect URLs` must be `https://monux.robjte.de/auth/` for the application to collect the auth tokens correctly. **Note this proxy is secure and CAN NOT access your account.**
- `Confidentiality` can be set to `Confidential` or `Non-confidential`. Confidential clients are recommended as you will not have to log back in every 6 hours. Tokens are stored securely on your machine.

### Logging In

- Launch Monux. You will be presented with a form to enter the client details.
- Copy the `Client ID` and `Client secret` over to the input fields and click "Save client details".
- The app will restart and you should be presented with a standard Monzo login prompt to enter your email address.
- After clicking "Submit" you should see "Check your email". (If this does not appear, you should check your email address and try again. If the problem persists, you may have exceeded the API request limit; wait an hour and try again. If it still does not work, there may be a bug in Monux.)
- You will receive an email with a login link. This link will direct you to `https://monux.robjte.de/auth/...` where there will be a link that says "Click here to log in to Monux →". Clicking this may prompt you with something like "Do you want to allow this page to open Monux.app?" Click "Allow".
- If all has gone well, Monux should open with its main interface. There may be some keychain prompts during this process. It is safe to allow access to helper processes.


## Support this project

#### [https://monzo.me/robertede](https://monzo.me/robertede/5.00?d=Thanks%20for%20making%20Monux!)


## Goals

### (Vote on what you want to see next)

[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Transaction%20location%20on%20map)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Transaction%20location%20on%20map/vote)
[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Graph%20balance%20over%20time)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Graph%20balance%20over%20time/vote)
[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/CSV%20JSON%20Excel%20export)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/CSV%20JSON%20Excel%20export/vote)
[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/View%20spending%20targets)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/View%20spending%20targets/vote)
[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Multiple%20accounts)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Multiple%20accounts/vote)
[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Change%20category)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BM7TWYY0DN4K8DS0DTV3V07B/Change%20category/vote)



## Screenshots

![List Preview](https://i.imgur.com/Ydmg9cV.png)
![Spending Preview](https://i.imgur.com/Qpd5Lye.png)


## Contributors
- [Rob Ede](https://github.com/robjtede)
- [Andrew Schofield](https://github.com/andrew-schofield)
