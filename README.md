## Current UI iteration
<img width="3399" height="1029" alt="attempt-3" src="https://github.com/user-attachments/assets/a460d617-867b-4319-8e45-5c6a78f7590c" />

## UI in context
<img width="3319" height="912" alt="attempt-3 in context" src="https://github.com/user-attachments/assets/6a9e8250-99ee-4d3c-b64c-b905295dcdbb" />

## Plan
- [ ] a file that populates `videoData` with video info from the `DOM`
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
	- [ ] Grids of shorts
	- [x] Curated (People also watched, Suggested, For You, etc.) (still need to hide the whole thing if all the videos are hidden based on other criteria)
    - [ ] Sponsored? (i think this is actually the ad-renderer)

- [x] a file that creates all the custom UI (temp UI focused on content)

- [ ] a function that checks the `videoData` with the `filteCriteria` and decides visibility
	- [x] type
	- [x] duration
	- [x] views
	- [x] upload year
	- [ ] keywords
	- [ ] tags
	- [ ] view
		- [x] watched/unwatched/all
		- [ ] suggested
		- [ ] for you
		- [ ] people also watched
		- [ ] sponsored

- [ ] a file or function that extracts the `filterCriteria` from the custom UI

- [ ] Iterate on UI
- [ ] polish/create real UI in plugin
- [ ] add final functionality to the UI
	- [ ] duration unit selection
	- [ ] view number formatting
	- [ ] keyword & tag additions
