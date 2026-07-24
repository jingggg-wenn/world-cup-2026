# BetTracker

A lightweight, single-page betting tracker built with vanilla HTML, CSS, and JavaScript. No dependencies, no build step.

## Features

- Track bets by match with dates
- Multiple bets per match, grouped and collapsible
- Inline edit and delete for each bet
- Realized P/L with progress toward a custom profit target
- Fully responsive

## Usage

Open `index.html` in any browser. No server required.

To deploy, push to GitHub and enable GitHub Pages from the `main` branch root.

## Structure

```
bettracker/
  index.html
  css/
    style.css
  js/
    app.js
  README.md
```

## Customizing the target

In `js/app.js`, change the `TARGET` constant at the top of the file:

```js
const TARGET = 200; // change to whatever you want
```
