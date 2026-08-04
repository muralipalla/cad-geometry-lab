(() => {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const quizForm = document.querySelector("[data-quiz-form]");
  if (quizForm) {
    const feedback = quizForm.querySelector("[data-quiz-feedback]");
    const resetButton = quizForm.querySelector("[data-quiz-reset]");

    quizForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = quizForm.querySelector("input[name='bezier-question']:checked");

      feedback.className = "quiz-feedback is-visible";
      if (!selected) {
        feedback.classList.add("is-incorrect");
        feedback.textContent = "Choose an answer first, then check your prediction.";
        return;
      }

      if (selected.value === "global") {
        feedback.classList.add("is-correct");
        feedback.textContent = "Correct. A Bézier control point has global influence: moving it changes the curve across the parameter interval.";
      } else {
        feedback.classList.add("is-incorrect");
        feedback.textContent = "Not quite. A quadratic Bézier curve has global control, so moving its middle point reshapes the curve across its parameter interval.";
      }

      resetButton.hidden = false;
    });

    resetButton.addEventListener("click", () => {
      quizForm.reset();
      feedback.className = "quiz-feedback";
      feedback.textContent = "";
      resetButton.hidden = true;
      quizForm.querySelector("input").focus();
    });
  }

  const demo = document.querySelector("[data-drag-demo]");
  if (!demo) return;

  const svg = demo.querySelector("[data-drag-svg]");
  const curve = demo.querySelector("[data-curve-path]");
  const polygon = demo.querySelector("[data-control-polygon]");
  const readout = demo.querySelector("[data-point-readout]");
  const points = Array.from(demo.querySelectorAll("[data-control-point]"));
  const labels = Array.from(demo.querySelectorAll("[data-point-label]"));
  let activePoint = null;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const pointValues = (point) => ({
    x: Number(point.getAttribute("cx")),
    y: Number(point.getAttribute("cy"))
  });

  const coordinates = (point) => {
    const values = pointValues(point);
    return {
      x: ((values.x - 280) / 40).toFixed(1),
      y: ((180 - values.y) / 40).toFixed(1)
    };
  };

  const updateGeometry = (selectedPoint) => {
    const values = points.map(pointValues);
    polygon.setAttribute("points", values.map((point) => point.x + "," + point.y).join(" "));
    curve.setAttribute("d", "M" + values[0].x + " " + values[0].y + "Q" + values[1].x + " " + values[1].y + " " + values[2].x + " " + values[2].y);

    points.forEach((point, index) => {
      const value = values[index];
      const label = labels[index];
      const isUpperHalf = value.y < 180;
      label.setAttribute("x", String(clamp(value.x + 14, 12, 525)));
      label.setAttribute("y", String(clamp(value.y + (isUpperHalf ? -13 : 28), 18, 346)));
      const coordinate = coordinates(point);
      point.setAttribute("aria-valuetext", point.dataset.label + " at x " + coordinate.x + ", y " + coordinate.y);
    });

    if (selectedPoint) {
      const coordinate = coordinates(selectedPoint);
      readout.textContent = selectedPoint.dataset.label + " = (" + coordinate.x + ", " + coordinate.y + ")";
    }
  };

  const eventPosition = (event) => {
    const rectangle = svg.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rectangle.left) * 560 / rectangle.width, 24, 536),
      y: clamp((event.clientY - rectangle.top) * 360 / rectangle.height, 24, 336)
    };
  };

  const movePoint = (point, x, y) => {
    point.setAttribute("cx", String(clamp(x, 24, 536)));
    point.setAttribute("cy", String(clamp(y, 24, 336)));
    updateGeometry(point);
  };

  points.forEach((point) => {
    point.addEventListener("pointerdown", (event) => {
      activePoint = point;
      point.setPointerCapture(event.pointerId);
      const position = eventPosition(event);
      movePoint(point, position.x, position.y);
    });

    point.addEventListener("pointermove", (event) => {
      if (activePoint !== point) return;
      const position = eventPosition(event);
      movePoint(point, position.x, position.y);
    });

    const releasePoint = (event) => {
      if (activePoint !== point) return;
      if (point.hasPointerCapture(event.pointerId)) point.releasePointerCapture(event.pointerId);
      activePoint = null;
    };

    point.addEventListener("pointerup", releasePoint);
    point.addEventListener("pointercancel", releasePoint);
    point.addEventListener("focus", () => updateGeometry(point));
    point.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 12 : 4;
      const values = pointValues(point);
      const movement = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step]
      }[event.key];

      if (!movement) return;
      event.preventDefault();
      movePoint(point, values.x + movement[0], values.y + movement[1]);
    });
  });

  updateGeometry(null);
})();
