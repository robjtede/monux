# Monzoo
Unofficial Monzo Client for Desktop

**Monzoo is MacOS only for now.**

## Download
[See releases →](https://github.com/robjtede/monzoo/releases)

## Usage
- [Create a new OAuth client](https://developers.monzo.com/apps/home) on the Monzo developer site. The name, logo and description can be anything you like but...
- The `Redirect URLs` must be `monzoo://auth/` for the application to collect the auth tokens correctly.
- Copy the `Client ID` and `Client secret` over to the input fields when launching.
- Follow instructions and follow standard Monzo auth flow.

## Goals
- [x] View balance / spend today
- [x] Transaction list view
- [x] Transaction detail view
- [x] Full notes and attachments
- [ ] Merchant location (embedded map)
- [ ] Filter transactions
- [ ] Search transactions
- [ ] Graph balance over time
- [ ] Multiple accounts (Monzo pending)
- [ ] View spending targets (Monzo pending)

## Screenshot
![Preview](http://i.imgur.com/kKnDg0M.png)
