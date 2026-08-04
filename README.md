# CAD Geometry Lab

CAD Geometry Lab is an educational website for exploring the mathematics and algorithms behind computer-aided design. The learning path begins with draggable points and parametric curves, then progresses through Bézier curves, B-splines, NURBS, and surface modelling.

## First release

The initial landing page includes:

- a structured five-stage CAD geometry learning path;
- an interactive, keyboard-accessible draggable-points preview;
- a working Bézier knowledge check;
- a roadmap for Python and Bokeh demonstrations; and
- a responsive layout designed for desktop, tablet, and mobile screens.

## Run locally

From the project directory, start any simple static server. For example:

    python -m http.server 8000

Then open http://localhost:8000 in a browser.

## Python demonstrations

Python source will live in the python/cadmath package and individual demo folders. GitHub Pages cannot execute a Python or Bokeh server process, so public demonstrations will be exported as standalone Bokeh HTML/JavaScript where possible. Python-callback server applications will include local run instructions or use a separate application host later.

## Learning roadmap

1. Points and parametric curves
2. Bézier curves and the de Casteljau algorithm
3. B-spline basis functions, curves, and knot insertion
4. NURBS weights and exact conic geometry
5. Tensor-product surfaces and continuity

## Project status

The landing page is the first project milestone. Content pages, Bokeh demonstrations, quizzes, mathematical modules, tests, and notebooks will be added incrementally.
