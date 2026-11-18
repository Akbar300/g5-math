# Motion explainer engine

Short animated lessons that play inside the page (SVG, no video files). Each one is built from parameters, so one explainer covers every number of its kind.

## Pieces

| File | What it does |
| --- | --- |
| `js/explain.js` | The engine: scene player (Back, Play/Pause, Next, Replay, 0.75×/1×/1.5×, reduced motion), the registry, `EX.prim` drawing helpers, and the built-in fraction explainers (`scale100`, `eighths`). |
| `js/explainers/*.js` | One file per explainer family. Each calls `EX.register`. Load after `explain.js`. |
| `js/engine.js` | Shows **Watch how** after a wrong answer, and passes the student's answer to the explainer. |
| `js/adapt.js` | Lets V2 lesson cards carry `watch: {...}`, which shows a **Watch it** section. |

## Add an explainer

```js
EX.register('my-id', {
  build(o)   { return { title, scenes: [{ dur, cap, draw(t) }], quiz: { q, right, wrong: [3], yes, no } }; },
  label(o)   { return 'short label for the Watch button'; },
  match(item, ctx) { return /* o or null */; },   // optional: auto-pick from a practice question
  order: 50                                        // lower runs first
});
```

- `draw(t)` returns SVG markup for time `t` ms in a 400×240 viewBox. Use `EX.prim` (`at`, `txt`, `sfrac`, `pop`, `span`, `ease`, ...).
- One short caption per scene. Stacked fractions. Teal fills. The last step is always a tap-to-answer question.
- Build scenes from the input so special cases get their own scene (see `round.js`: the 9 rollover scene and the "don't round twice" scene only appear when they apply).
- Trap scene: show where the tempting wrong answer lands. When `o.wrong` (the student's answer) is passed, use it.

## Hook it up

- **Learn card:** `watch: { id: 'round', x: '3.062', p: 1 }` on the card.
- **Practice item:** `item.watch = (ctx) => ({ id: 'round', x, p, wrong: ctx.answer })`. Set `watch: false` to never offer one. Items without `watch` fall back to the registered `match()` functions.
- Never shown in Test Lab.

## Check before shipping

`/tmp`-style headless check (see the PR): build every variant, draw every scene at several times, fail on `NaN`/`undefined`, check the quiz has 3 distinct wrong answers, and confirm the answer against an independent calculation. Then screenshot each scene at phone and desktop width, light and dark.

## Explainers

| id | File | Covers |
| --- | --- | --- |
| `scale100` | explain.js | n/d → hundredths → decimal → percent (friendly denominators) |
| `eighths` | explain.js | eighths by halving, count by 0.125, anchor trick |
| `round` | round.js | round to the nearest whole, tenth, hundredth: place + decider, keep or bump, zoom number line, rule, 9 rollover, don't round twice, trap, clean finish |

Ideas queued: estimate with rounded decimals (5.CE.3a), compare/order decimals, place the decimal point in a product.
