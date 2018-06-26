# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [0.10.0] - 2018-08-26
### Added
- Search transactions by name, category or notes using the search field above the transaction list.
- Groups of transactions can now be collapsed.
- Windows support.

### Changed
- Current accounts are now supported.
- The login flow has been vastly improved both functionally and stylistically.
- Monux is built using Angular.
- Attachment upload UI has been improved.

### Fixed
- Logout did not clear all caches.
- Plus symbols (+) would be removed from notes.

### Known Issues
- Various bug mean you may need to do a View -> Refresh on first load if your transactions do not appear.
- Nothing is cached yet. An active internet connection is required, at present.
- Transaction history only goes back to the beginning of last month.
- Spending pie chart says "This month" but actually includes all available history.
- [macOS] Touch Bar support has been lost for now.
- [macOS] Far too many keychain authentication prompts on first launch. Make sure to click "Always allow".

[0.10.0 Milestone](https://github.com/robjtede/monux/milestone/7?closed=1)


## [0.9.3] - 2017-07-14
### Changed
- Authentication now requires a secure proxy (hosted on https://monux.robjte.de) to support webmail clients.

### Fixed
- Non-confidential clients now work.


## [0.9.2] - 2017-07-14
### Fixed
- It was unclear how to continue after entering client details. App now relaunches.


## [0.9.1] - 2017-07-14
### Fixed
- Client info was not being saved correctly.


## [0.9.0] - 2017-07-14
### Added
- **Spending pane** (month-my-month breakdowns)
- Attachment hints on transaction summaries.

### Changed
- Only new transaction are requested.
- Transactions are updated on click.
- Pending transactions are updated automatically.
- Improved cache performance.
- Incomplete tabs/panes show summary of future functionality.

### Fixed
- List became scrollable horizontally when a transaction summary has a long description.
- Touch bar amounts were truncated for round amounts.
- Clicking the dock icon would always refresh the open window.

[0.9.0 Milestone](https://github.com/robjtede/monux/milestone/6?closed=1)


## [0.8.0] - 2017-06-18
### Added
- Touch Bar support.
- Logout button.

### Changed
- Migrate codebase to TypeScript.
- Use refresh token in auth flow (confidential client support).
- Use system keychain for token storage.
- Single window authentication.

### Fixed
- Balance and spending show 0.
- Transaction statuses not displaying.
- Fallback image error causing infinite rendering.
- Transaction attachments rendering twice.
- Active card checks showing amount from previously selected transaction.

[0.8.0 Milestone](https://github.com/robjtede/monux/milestone/4?closed=1)


## [0.7.0] - 2017-03-01
### Added
- Category filtering.
- Grouping options.
- Add and remove attachments.
- Keyboard shortcuts for transaction list navigation.

### Changed
- Simplified notes editing.
- Group headings now stick to the top of the list.

### Fixed
- Fix merchant info for peer to peer transfers.
- Filter hidden transactions before grouping.

[0.7.0 Milestone](https://github.com/robjtede/monux/milestone/3?closed=1)


## [0.6.0] - 2017-01-26
### Added
New name and icon.
Transaction groups (only per-day currently) now show spending totals.
Meta-transactions (like active card checks) and declined transactions can now be hidden.
The merchant emoji is now displayed in the detail view.

### Fixed
Bugs fixed (and probably some introduced).

[0.6.0 Milestone](https://github.com/robjtede/monux/milestone/2?closed=1)


## [0.5.0] - 2017-01-13
### Added
- Notes are now editable.
- Running balance is now shown in detail pane.
- Attachments can now be enlarged when clicked.
- Attachments can now be dragged out of the window when enlarged.
- Account name is now shown in tab bar.

### Fixed
- Bug fixes.
- Code cleanup.

[0.6.0 Milestone](https://github.com/robjtede/monux/milestone/1?closed=1)


## [0.4.0] - 2017-01-04
### Added
- Details now show when transactions were settled.
- Declined transactions now show the reason why.
- Added tabs (not yet useful, these features will come).

### Changed
- Broken merchant logos now show category icon instead.
- Improved security of login.
- Lots of small stylistic changes.

### Fixed
- Attachments now have the correct orientation.
- Better handling of active card checks and balance checks.


## [0.3.0] - 2016-12-29
### Changed
- Redesigned detail view.

### Fixed
- Fixed pending statuses.


## [0.2.0] - 2016-12-24
### Added
- Input your own client id/secret on first launch.
- Copy/paste into text fields.


## [0.1.0] - 2016-12-23
### Changed
- Bump version number.


## [0.0.1] - 2016-12-23
### Added
- Login via Monzo email authentication.
- View balance.
- View transaction list.
- View limited transaction details.

[0.10.3]: https://github.com/robjtede/monux/compare/v0.9.3...v0.10.0
[0.9.3]: https://github.com/robjtede/monux/compare/v0.9.2...v0.9.3
[0.9.2]: https://github.com/robjtede/monux/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/robjtede/monux/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/robjtede/monux/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/robjtede/monux/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/robjtede/monux/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/robjtede/monux/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/robjtede/monux/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/robjtede/monux/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/robjtede/monux/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/robjtede/monux/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/robjtede/monux/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/robjtede/monux/compare/4f9e08...v0.0.1
