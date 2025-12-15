Because YouTube constantly changes, most of this is now broken.

I don't really want to maintain this as it was just a simple project for learning purposes.

## Current UI iteration
<img width="3399" height="1029" alt="attempt-3" src="https://github.com/user-attachments/assets/a460d617-867b-4319-8e45-5c6a78f7590c" />

## UI in context
<img width="3319" height="912" alt="attempt-3 in context" src="https://github.com/user-attachments/assets/6a9e8250-99ee-4d3c-b64c-b905295dcdbb" />

## Plan
- [x] a file that populates `videoData` with video info from the `DOM`
	- [x] Videos & Shorts
		- [x] title
		- [x] duration
		- [x] views
		- [x] type
		- [x] upload year
		- [x] watched
	- [x] Playlists
		- [x] title
		- [x] type
	- [x] Channels
		- [x] title
		- [x] type
	- [x] Curated (People also watched, Suggested, For You, etc.) 
    - [ ] Songs?
	- [ ] Sponsored?

- [x] a function that checks the `videoData` with the `filteCriteria` and decides visibility
	- [x] type
	- [x] duration
	- [x] views
	- [x] upload year
	- [x] keywords
	- [x] watched/unwatched/all
	- [x] curated
	- [ ] sponsored?

- [ ] a function or file that sorts all the videos as they load

- [x] a file or function that extracts the `filterCriteria` from the custom UI as it changes
  - [x] Type
  - [x] Duration & Views
  - [x] Upload Year
  - [ ] Keywords
  - [x] Sort By
  - [x] View

- [ ] Create actual UI
  - [ ] keyword addition and removal functionality
  - [ ] duration unit selection
  - [ ] make it look good
  - [ ] view number formatting

### Bugs:
- [ ] need to handle resetting everything on new searches. I might reload but preferably I would just reset everything
- [ ] the dropdowns cut off if there are no videos and it's loading (probably has to do with being inside of an element that just got shorter, or it could be the z-index)
- [ ] probably a bunch more stuff
