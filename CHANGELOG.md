# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


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

[0.8.0]: https://github.com/robjtede/monux/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/robjtede/monux/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/robjtede/monux/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/robjtede/monux/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/robjtede/monux/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/robjtede/monux/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/robjtede/monux/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/robjtede/monux/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/robjtede/monux/compare/4f9e08...v0.0.1
