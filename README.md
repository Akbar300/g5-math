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
