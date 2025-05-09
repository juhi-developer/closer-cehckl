# Changelog

All notable changes to this project will be documented in this file.

### 2024-02-16

### Android - 1.23(23)

### IOS - 1.0(55)

### Fixed

1. MEDIA UPLOAD FAST ACROSS WHOLE APP
2. CHAT DESIGN
3. OVERALL PERFORMANCE OF WHOLE APP
4. Moments pagination api
5. Onboarding validation and profile compression.
6. Remember days date change to DD-MM-YYYY and also year should be 2010 to 2100 and also
7. Loader above moments and other tab as well when refreshing(api call background)
8. Background socket disconnect and lifecycle check
9. Chat links saved locally
10. Chat message skip and typing status is also wrong and blue ticks
11. To do time wrong organise
12. While creating the to do list and notes the timing is not same as my device time
13. Add to highlight > save highlight without adding name > continuous loader shown
14. Story reply text
15. days to remember > select month December > events not shown
16. Sent image first time from android > iOS app is in closed state > without opening app blue tick shown (only in IOS)
17. Moments screen become unresponsive - Poke IOS
18. Story shown black > view all stories > check the last story (It will work fine when user refreshes moments screen)
19. Media handled correctly in chat for all types images, videos, audio, pdf and links
20. Moments refresh data over api for sender instead of socket
21. Notification redirection done but still refinement needs to be done
22. Chat typing and background issues
23. Story and feed sometimes blank

### 2024-01-25

### Android - 1.8(18)

### IOS - 1.0(51)

### Fixed

- ⁠Missing chat issues
- Gif not loading quicky and size
- Login issues(mentioned in group)
- High delay on login screen
- Other issues in Mohit's file(almost fixed some are pending)
- Removed reaction reaction grey bg in gifs(chat) and notes(moments)
- Sentry issues resloved
- Added logs so we can check on sentry for ex. images
- Tagging issue in organise(to dos)

### 2024-01-20

### Android - 1.5(15)

### IOS - 1.0(48)

### Fixed

- ⁠Missing chat issues
  -⁠ ⁠Missing chat notifications(notification not opening done)
  -⁠ ⁠Onboarding tool tips for that user
  -⁠ ⁠Other issues in Mohit's file(almost fixed some are pending)
  -⁠ ⁠Invalid APNS certificate error that came while sending a notification to RJ(manually token added clevertap)
  -⁠ ⁠Mohit to monitor Sentry and Crashalytics for user issues(done) 
  -⁠ ⁠Token expiration
- Clevertap test users remove

### 2024-01-17

### Android - 1.4(14)

### IOS - 1.0(47)

### Fixed

- Notes reaction loader issue
- moments page going blank
- moments api added background

### 2024-01-16

### Android - 1.3(13)

### IOS - 1.0(44)

### Added

### Fixed

- Clevertap notification crash
- Clever tap errors fixed and user properties + partner name
- ⁠Nudge going multiple time
- Quiz card answer not showing on front end to me
- Notification redirection
- Story not loading
- ⁠I tapped on a sticky note reaction notification and landed on quiz cards
- ⁠Notifications For both push & in app. For push, also check different app states - foreground, background & killed.
- Tapping on sticky note in app notification took me to the quiz card instead of the sticky notes area
- Sticky notes still going blank. Lag in bottom sheet
- Timezone issue show 03 instead of Qatar
- ⁠Poke modal padding issue
- ⁠Chat message reaction
- ⁠Chat messages blue tick
- ⁠Pink dot in notifications is not going(moments)
- ⁠Check the time of Watchlist(organise)
- Added sentry and crashlytics
- Added socket logs
- Fixed the QnA image issue showing same on both side
- Personalise QA mandatory
- Test push notifications from admin panel

### Changed
