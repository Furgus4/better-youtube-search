## Current UI iteration
<img width="3399" height="1029" alt="attempt-3" src="https://github.com/user-attachments/assets/a460d617-867b-4319-8e45-5c6a78f7590c" />

## UI in context
<img width="3319" height="912" alt="attempt-3 in context" src="https://github.com/user-attachments/assets/6a9e8250-99ee-4d3c-b64c-b905295dcdbb" />

## Plan
- [x] a file that creates all the custom UI (currrent UI is temporary)

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
	- [x] Curated (People also watched, Suggested, For You, etc.) 
	- [ ] Grids of shorts (just hiding these for now bacuase I can't get much data on the shorts)
	- [ ] Sponsored? (I think this is in the ad-renderers but I'm not sure) (I've never seen one)

- [ ] a function that checks the `videoData` with the `filteCriteria` and decides visibility
	- [x] type
	- [x] duration
	- [x] views
	- [x] upload year
	- [ ] keywords
	- [ ] tags
	- [x] watched/unwatched/all
	- [x] curated (still need to hide the whole thing if all the videos are hidden based on other criteria)
	- [ ] sponsored (have yet to see one)
    - [ ] Make sure that it can unhide videos as the filters change (would have to implement after the file that extracts `filterCriteria` from the UI)

- [ ] a file or function that extracts the `filterCriteria` from the custom UI as it changes

- [ ] Iterate on UI
- [ ] polish/create real UI in plugin
- [ ] add final functionality to the UI
	- [ ] duration unit selection
	- [ ] view number formatting
	- [ ] keyword & tag additions
