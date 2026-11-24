# Grade 5 Math

A calm, game-first practice lab for FCPS Grade 5 math and the 2023 Virginia Math SOL.

- Each unit: **Learn → Practice → Test Lab**, with a **Core** path and an **Advanced** (Go Further) path.
- Practice folds fresh questions and an endless dojo into one place. No timers unless you want them later.
- Multi-step computation uses a paper-style work area (carries, partial products, long-division rows).
- Print pack: US Letter, full color, two columns, two question pages plus an answer key on its own page.
- Light and dark mode, remembered on this device, and a left-hand tab sidebar on wide screens so short answers and work stay on one view with less scrolling.
- Fractions display stacked (numerator, bar, denominator) in questions, chips, feedback, and print packs. The Division and Multiply arenas open the original neon ninja games (`arenas/division.html`, `arenas/multiply.html`, gameplay unchanged, scaled to fit big screens). The Lab versions (`arenas/*-lab.html`) cover the original size range (including 4-digit ÷ 2-digit, facts, and mental tricks) with the paper-method long-division sign.

- Percent-of-a-number explainer (`js/explainers/percent.js`): Unit 4 Percents has three new Watch it cards (10% steps, friendly fractions, 5% is half of 10%) and a Percent of a number practice skill in Core; misses in Units 4 and 7 offer Watch how with that question's numbers.
- Rounding explainer (`js/explainers/round.js`): Unit 5 has a new first lesson, **Round it** (6 cards, each with Watch it), and a **Round decimals** practice skill. A miss offers Watch how with that question's number, and it shows where the student's own answer lands on the number line. Explainers are now a small engine: each one registers with `EX.register` (see `js/explainers/README.md`).
- Motion explainers (`js/explain.js`): short animated scenes that play in the page, no video files. Unit 4 has a **Watch it** button on six Learn cards, and a missed fraction/decimal/percent question offers **Watch how** with an explainer built for that fraction (for example 4/25 → 16%, or 5/8 = 1/2 + 1/8). Each one ends with a tap-to-answer question. Speeds 0.75×, 1× and 1.5×; reduced motion jumps to each scene's end. Not shown in Test Lab.

- Unit 11 Pilot tab now has three modes (`js/shapelab.js`): **Missions** (Star Pilot), **Shape Lab** and **Free Build**. In Shape Lab a rectangle or square is given by its corner coordinates: tap each corner, connect them (diagonals are caught with a hint), then find the area or perimeter; some missions give only three corners and ask for the fourth. Free Build lets you tap or type points to make any shape, close it, measure it when its sides run across or up/down, or drop in a quick rectangle, square or L-shape. In both, the rocket can fly the shape's edge (takeoff across then up) while a log adds the legs up to the perimeter. Core uses Quadrant I; Advanced uses all four quadrants. A fourth mode, **Tricks**, teaches counting steps and measuring rectangles from the numbers alone (what is the same, add when crossing zero, two x's and two y's): five try-first lessons with animated number-line hops, then ten no-grid practice questions with a Show it on the grid check.

All 11 class units and both paper arenas are live. This is a static site: open `index.html` locally, use GitHub Pages, or deploy the folder to Vercel with no build step.

- **Unit 9 Geometry Lab tab** (`js/geolab.js`, styles in `css/app.css` under "Geometry Lab"): ported from the Neon Geometry Lab. Three modes: **Learn** (formulas shown, solve step by step), **Missions** (a side, height or radius is missing; solve with a variable, then keep going) and **Pick it** (perimeter, area or volume word problems). Shapes are drawn to scale and animate: perimeter walks the edges and adds the sides, area fills the unit squares, volume stacks layers of cubes, an L-shape splits into two rectangles, a triangle shows the rectangle it is half of. Wrong answers get a reason (for example "that is the area"), hints come one at a time and light up the drawing. Core: rectangle, square, right triangle, polygon, L-shape, box, cube. Advanced adds circle (π ≈ 3.14), any triangle and parallelogram. Color code works in light and dark: given teal, perimeter green, area blue, volume violet, unknown orange. +8 XP per mission (+5 with hints). Unit 9 Practice and Test Lab questions about perimeter, area or volume get a **Try it in Geometry Lab** button (`window.__glPreset`). The existing Unit 9 tabs are unchanged.

- **Unit 9 Learn visuals** (`js/explainers/geometry.js`): three new 🎬 **Watch it** explainers. **Why a triangle is ½ × b × h**: a rectangle is cut corner to corner and the top half turns around to land exactly on the bottom half. Advanced adds a scene where the height splits any triangle into two halves of two rectangles. **Why a parallelogram is b × h**: drop the height, cut off the end triangle and slide it over to make a rectangle, with a slanted-side trap. **Why volume is l × w × h**: one row of cubes, then the bottom layer, then the layers stack with a running count. Each one ends with a your-turn question, and a missed Practice question with the numbers in its text offers **Watch how** with those numbers. Still pictures (`GV.*`) replace the old placeholders on the Unit 9 Learn cards: triangle-in-rectangle, box of cubes with a highlighted layer, around/cover/fill, circle parts, parallelogram before and after. New Advanced card: Any triangle is half a rectangle. Also fixed: the triangle height label on the first triangle card was cut off.

## Units

1. Data Detectives (5.PS.1, 5.PS.2)
2. Pattern & Number Lab (5.CE.4, 5.NS.2, 5.PFA.1–2)
3. Whole Number Workshop (5.CE.1)
4. Fraction & Decimal Studio (5.NS.1), including an intro to ratios and percents
5. Decimal Workshop (5.CE.3)
6. Metric Lab (5.MG.1)
7. Compare & Percent Studio (5.NS.1)
8. Fraction Workshop (5.CE.2)
9. Shape & Measure Lab (5.MG.2, 5.MG.3)
10. Data & Chance Lab (5.PS.1–3)
11. Coordinate Quest (Grade 6 standard)

## Test Lab and review (Nov 24)
- Test Lab holds all feedback until **Submit test**. Each question has a 🚩 flag; Submit warns once about unanswered or flagged questions. Optional ⏱ timer (off by default, counts up).
- Results show a by-topic breakdown (Unit 11 has topic labels via `UNIT.topicOf`) and a button to practice the misses.
- Missed questions go into a per-unit **review queue** (localStorage `g5lab_<unit>:rq`). Practice has a 🔁 Review mode, and "All skills" mixes in due items. A review item returns after 1, 3 and 7 days, and is retired after the last one is right.
- Unit 11 questions that name coordinates get a **Try it in Shape Lab** button (`window.G5ItemHook`, `window.__slPreset` loads the points into Free Build).
- Pilot → Tricks has a third tab, **Both directions**: steps = across gap + up/down gap, plus "where does the rover turn?".
- `V.numberLine` staggers crowded labels and scales to the card width.
