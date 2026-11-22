# Farm sprite tools

Scripts used to cut the farm picture (Class 3 "Living and Non-living Things") into
separate sprites plus a clean background. They are not part of the app build.

- `polys.js` – outlines of the objects (picture pixels)
- `cut.js` – GrabCut each object into a mask (needs `sharp` and `@techstark/opencv-js`)
- `build.js` – writes `<name>.webp` sprites, `background.webp` and `farm.json`

Inputs and outputs live next to a `base_full.png` crop of the picture, which is not committed.
Copy the results to `frontend/src/assets/farm/` and `frontend/src/games/farm.json`.
