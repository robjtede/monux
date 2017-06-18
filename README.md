# Monux
Unofficial Monzo Client for Desktop

<img alt="Monux Logo" height="200" src="https://github.com/robjtede/monux/blob/master/monux.png">

**Monux is MacOS only for now.**

## Download
[See releases →](https://github.com/robjtede/monux/releases)

## Usage
- [Create a new OAuth client](https://developers.monzo.com/apps/home) on the Monzo developer site. The name, logo and description can be anything you like but...
- The `Redirect URLs` must be `monux://auth/` for the application to collect the auth tokens correctly and `Confidentiality` must to set to `Confidential`.
- Copy the `Client ID` and `Client secret` over to the input fields when launching.
- Follow instructions and follow standard Monzo auth flow.

## Support this project
[https://monzo.me/robertede](https://monzo.me/robertede/5.00?d=Thanks%20for%20making%20Monux!)

## Goals
- [x] View balance / spend today
- [x] Transaction list view
- [x] Transaction detail view
- [x] Full notes and attachments
- [x] Edit notes
- [x] Add and remove attachments/receipts
- [x] Filter transactions
- [ ] Transaction location on map
- [ ] Search transactions
- [ ] Graph balance over time
- [ ] Month-by-month spending break-downs
- [ ] CSV / JSON / Excel export
- [ ] Change category (Monzo pending)
- [ ] Multiple accounts (Monzo pending)
- [ ] View spending targets (Monzo pending)

## Screenshot
![Preview](http://i.imgur.com/xZFeXDj.png)
