const SVG_NS = "http://www.w3.org/2000/svg";

const controls = {
  presetSelect: document.getElementById("preset-select"),
  textContent: document.getElementById("text-content"),
  fontFamily: document.getElementById("font-family"),
  textSize: document.getElementById("text-size"),
  baseFrequency: document.getElementById("base-frequency"),
  numOctaves: document.getElementById("num-octaves"),
  scale: document.getElementById("scale"),
  translateX: document.getElementById("translate-x"),
  translateY: document.getElementById("translate-y"),
  rotate: document.getElementById("rotate"),

  animateTextSize: document.getElementById("animate-text-size"),
  animateBaseFrequency: document.getElementById("animate-base-frequency"),
  animateNumOctaves: document.getElementById("animate-num-octaves"),
  animateScale: document.getElementById("animate-scale"),
  animateTranslateX: document.getElementById("animate-translate-x"),
  animateTranslateY: document.getElementById("animate-translate-y"),
  animateRotate: document.getElementById("animate-rotate"),

  textSizeAnimationType: document.getElementById("text-size-animation-type"),
  textSizeAnimationDuration: document.getElementById(
    "text-size-animation-duration",
  ),
  textSizeVolatility: document.getElementById("text-size-volatility"),
  textSizeDensity: document.getElementById("text-size-density"),

  baseFrequencyAnimationType: document.getElementById(
    "base-frequency-animation-type",
  ),
  baseFrequencyAnimationDuration: document.getElementById(
    "base-frequency-animation-duration",
  ),
  baseFrequencyVolatility: document.getElementById("base-frequency-volatility"),
  baseFrequencyDensity: document.getElementById("base-frequency-density"),

  numOctavesAnimationType: document.getElementById(
    "num-octaves-animation-type",
  ),
  numOctavesAnimationDuration: document.getElementById(
    "num-octaves-animation-duration",
  ),
  numOctavesVolatility: document.getElementById("num-octaves-volatility"),
  numOctavesDensity: document.getElementById("num-octaves-density"),

  scaleAnimationType: document.getElementById("scale-animation-type"),
  scaleAnimationDuration: document.getElementById("scale-animation-duration"),
  scaleVolatility: document.getElementById("scale-volatility"),
  scaleDensity: document.getElementById("scale-density"),

  translateXAnimationType: document.getElementById(
    "translate-x-animation-type",
  ),
  translateXAnimationDuration: document.getElementById(
    "translate-x-animation-duration",
  ),
  translateXVolatility: document.getElementById("translate-x-volatility"),
  translateXDensity: document.getElementById("translate-x-density"),

  translateYAnimationType: document.getElementById(
    "translate-y-animation-type",
  ),
  translateYAnimationDuration: document.getElementById(
    "translate-y-animation-duration",
  ),
  translateYVolatility: document.getElementById("translate-y-volatility"),
  translateYDensity: document.getElementById("translate-y-density"),

  rotateAnimationType: document.getElementById("rotate-animation-type"),
  rotateAnimationDuration: document.getElementById("rotate-animation-duration"),
  rotateVolatility: document.getElementById("rotate-volatility"),
  rotateDensity: document.getElementById("rotate-density"),
};

const ui = {
  previewTranslateX: document.getElementById("preview-translate-x"),
  previewTranslateY: document.getElementById("preview-translate-y"),
  previewRotate: document.getElementById("preview-rotate"),
  previewText: document.getElementById("preview-text"),
  turbulenceNode: document.getElementById("turbulence-node"),
  displacementNode: document.getElementById("displacement-node"),
  codeModal: document.getElementById("code-modal"),
  codeOutput: document.getElementById("code-output"),
  copyButton: document.getElementById("copy-button"),
  logConfigButton: document.getElementById("log-config-button"),
  modalCloseButton: document.getElementById("modal-close-button"),
};

let latestSnippet = "";
let textSizeAnimation = null;
let textSizeAnimationKey = "";
const transformAnimationState = {
  translateX: { animation: null, key: "" },
  translateY: { animation: null, key: "" },
  rotate: { animation: null, key: "" },
};

const VARIABLE_META = {
  textSize: {
    baseStateKey: "textSize",
    min: 24,
    max: 220,
    integer: true,
    formatter: (value) => String(Math.round(value)),
  },
  baseFrequency: {
    baseStateKey: "baseFrequency",
    min: 0.0001,
    max: 0.03,
    decimals: 4,
    formatter: (value) => formatFrequency(value),
  },
  numOctaves: {
    baseStateKey: "numOctaves",
    min: 1,
    max: 8,
    integer: true,
    formatter: (value) => String(Math.round(value)),
  },
  scale: {
    baseStateKey: "scale",
    min: 0,
    max: 220,
    integer: true,
    formatter: (value) => String(Math.round(value)),
  },
  translateX: {
    baseStateKey: "translateX",
    min: -320,
    max: 320,
    integer: true,
    volatilityReference: 320,
    formatter: (value) => String(Math.round(value)),
  },
  translateY: {
    baseStateKey: "translateY",
    min: -320,
    max: 320,
    integer: true,
    volatilityReference: 320,
    formatter: (value) => String(Math.round(value)),
  },
  rotate: {
    baseStateKey: "rotate",
    min: -180,
    max: 180,
    integer: true,
    volatilityReference: 180,
    formatter: (value) => String(Math.round(value)),
  },
};

let animationSeeds = {
  textSize: [],
  baseFrequency: [],
  numOctaves: [],
  scale: [],
  translateX: [],
  translateY: [],
  rotate: [],
};

const KNOB_INPUT_IDS = [
  "text-size-animation-duration",
  "text-size-volatility",
  "text-size-density",
  "base-frequency-animation-duration",
  "base-frequency-volatility",
  "base-frequency-density",
  "num-octaves-animation-duration",
  "num-octaves-volatility",
  "num-octaves-density",
  "scale-animation-duration",
  "scale-volatility",
  "scale-density",
  "translate-x-animation-duration",
  "translate-x-volatility",
  "translate-x-density",
  "translate-y-animation-duration",
  "translate-y-volatility",
  "translate-y-density",
  "rotate-animation-duration",
  "rotate-volatility",
  "rotate-density",
];

const CHANNEL_CONTROL_MAP = [
  {
    animateInputId: "animate-text-size",
    modeInputId: "text-size-animation-type",
    animateButtonId: "animate-btn-text-size",
  },
  {
    animateInputId: "animate-base-frequency",
    modeInputId: "base-frequency-animation-type",
    animateButtonId: "animate-btn-base-frequency",
  },
  {
    animateInputId: "animate-num-octaves",
    modeInputId: "num-octaves-animation-type",
    animateButtonId: "animate-btn-num-octaves",
  },
  {
    animateInputId: "animate-scale",
    modeInputId: "scale-animation-type",
    animateButtonId: "animate-btn-scale",
  },
  {
    animateInputId: "animate-translate-x",
    modeInputId: "translate-x-animation-type",
    animateButtonId: "animate-btn-translate-x",
  },
  {
    animateInputId: "animate-translate-y",
    modeInputId: "translate-y-animation-type",
    animateButtonId: "animate-btn-translate-y",
  },
  {
    animateInputId: "animate-rotate",
    modeInputId: "rotate-animation-type",
    animateButtonId: "animate-btn-rotate",
  },
];

const ANIMATION_MODE_UI = Object.freeze({
  off: { symbol: "⏻", label: "off" },
  wiggle: { symbol: "〜", label: "smooth" },
  jitter: { symbol: "↯", label: "jumpy" },
});

const TRANSFORM_VARIABLE_KEYS = ["translateX", "translateY", "rotate"];
const PRESET_CONTROL_KEYS = Object.keys(controls).filter(
  (key) => key !== "presetSelect",
);
let isApplyingPreset = false;

function captureControlSnapshot() {
  const snapshot = {};

  PRESET_CONTROL_KEYS.forEach((key) => {
    const control = controls[key];
    if (!control) {
      return;
    }

    snapshot[key] =
      control.type === "checkbox" ? control.checked : control.value;
  });

  return snapshot;
}

function toPresetValuesLiteral(values) {
  const lines = Object.entries(values).map(([key, value]) => {
    const literal =
      typeof value === "string" ? JSON.stringify(value) : String(value);
    return `  ${key}: ${literal},`;
  });

  return `{\n${lines.join("\n")}\n}`;
}

function logCurrentPresetConfig() {
  const values = captureControlSnapshot();
  const currentPreset = controls.presetSelect
    ? controls.presetSelect.value
    : "custom";

  console.log("[Turbulent Playground] Current input snapshot");
  console.log("preset:", currentPreset);
  console.log(values);
  console.log("Paste-ready values block:");
  console.log(toPresetValuesLiteral(values));
}

const BASE_PRESET_VALUES = Object.freeze(captureControlSnapshot());

const PRESETS = Object.freeze({
  "readable-ish": {
    label: "readable-ish",
    values: {
      ...BASE_PRESET_VALUES,
      animateTextSize: true,
      textSizeAnimationType: "jitter",
      textSizeAnimationDuration: "6.3",
      textSizeVolatility: "0.09",
      textSizeDensity: "9",
      animateBaseFrequency: true,
      baseFrequencyAnimationType: "jitter",
      baseFrequencyAnimationDuration: "6.9",
      baseFrequencyVolatility: "0.55",
      baseFrequencyDensity: "8",
      animateTranslateX: true,
      translateXAnimationType: "jitter",
      translateXAnimationDuration: "5.4",
      translateXVolatility: "0.06",
      translateXDensity: "13",
      animateTranslateY: true,
      translateYAnimationType: "jitter",
      translateYAnimationDuration: "5.8",
      translateYVolatility: "0.06",
      translateYDensity: "13",
    },
  },
  newspaper: {
    label: "newspaper",
    values: {
      ...BASE_PRESET_VALUES,
      textContent:
        "The Evening Chronicle is a paper for those in flight and those simply passing through, carrying whispers from one corner of the world to the next; you may glimpse the ink’s quiet flourishes, though their touch remains just out of reach. Yet that is no cause for concern.",
      fontFamily: "Times New Roman, serif",
      textSize: "25",
      baseFrequency: "0.0009",
      numOctaves: "8",
      scale: "13",
      translateX: "0",
      translateY: "0",
      rotate: "0",
      animateTextSize: false,
      animateBaseFrequency: false,
      animateNumOctaves: false,
      animateScale: false,
      animateTranslateX: false,
      animateTranslateY: false,
      animateRotate: false,
      textSizeAnimationType: "jitter",
      textSizeAnimationDuration: "6.3",
      textSizeVolatility: "0.09",
      textSizeDensity: "9",
      baseFrequencyAnimationType: "jitter",
      baseFrequencyAnimationDuration: "6.9",
      baseFrequencyVolatility: "0.55",
      baseFrequencyDensity: "8",
      numOctavesAnimationType: "wiggle",
      numOctavesAnimationDuration: "5",
      numOctavesVolatility: "0.35",
      numOctavesDensity: "5",
      scaleAnimationType: "wiggle",
      scaleAnimationDuration: "5",
      scaleVolatility: "0.35",
      scaleDensity: "5",
      translateXAnimationType: "jitter",
      translateXAnimationDuration: "5.4",
      translateXVolatility: "0.06",
      translateXDensity: "13",
      translateYAnimationType: "jitter",
      translateYAnimationDuration: "5.8",
      translateYVolatility: "0.06",
      translateYDensity: "13",
      rotateAnimationType: "wiggle",
      rotateAnimationDuration: "5",
      rotateVolatility: "0.35",
      rotateDensity: "5",
    },
  },
  thriller: {
    label: "thriller",
    values: {
      ...BASE_PRESET_VALUES,
      textContent: "I never left, you just forgot how to > see me <",
      fontFamily: "Arial, sans-serif",
      textSize: "112",
      baseFrequency: "0.0001",
      numOctaves: "2",
      scale: "39",
      translateX: "0",
      translateY: "0",
      rotate: "0",
      animateTextSize: true,
      animateBaseFrequency: false,
      animateNumOctaves: true,
      animateScale: false,
      animateTranslateX: true,
      animateTranslateY: true,
      animateRotate: false,
      textSizeAnimationType: "jitter",
      textSizeAnimationDuration: "5.2",
      textSizeVolatility: "0.64",
      textSizeDensity: "13",
      baseFrequencyAnimationType: "jitter",
      baseFrequencyAnimationDuration: "6.9",
      baseFrequencyVolatility: "0.55",
      baseFrequencyDensity: "8",
      numOctavesAnimationType: "jitter",
      numOctavesAnimationDuration: "0.5",
      numOctavesVolatility: "0.75",
      numOctavesDensity: "13",
      scaleAnimationType: "wiggle",
      scaleAnimationDuration: "5",
      scaleVolatility: "0.35",
      scaleDensity: "5",
      translateXAnimationType: "jitter",
      translateXAnimationDuration: "2.1",
      translateXVolatility: "0.06",
      translateXDensity: "13",
      translateYAnimationType: "jitter",
      translateYAnimationDuration: "5.8",
      translateYVolatility: "0.06",
      translateYDensity: "13",
      rotateAnimationType: "wiggle",
      rotateAnimationDuration: "5",
      rotateVolatility: "0.35",
      rotateDensity: "5",
    },
  },
  graffiti: {
    label: "graffiti",
    values: {
      ...BASE_PRESET_VALUES,
      textContent: "LET YOUR MIND CREATE",
      fontFamily: "Impact, sans-serif",
      textSize: "106",
      baseFrequency: "0.023",
      numOctaves: "2",
      scale: "39",
      translateX: "0",
      translateY: "0",
      rotate: "0",
      animateTextSize: true,
      animateBaseFrequency: false,
      animateNumOctaves: true,
      animateScale: false,
      animateTranslateX: false,
      animateTranslateY: false,
      animateRotate: false,
      textSizeAnimationType: "jitter",
      textSizeAnimationDuration: "6.3",
      textSizeVolatility: "0.09",
      textSizeDensity: "9",
      baseFrequencyAnimationType: "jitter",
      baseFrequencyAnimationDuration: "6.9",
      baseFrequencyVolatility: "0.55",
      baseFrequencyDensity: "8",
      numOctavesAnimationType: "jitter",
      numOctavesAnimationDuration: "5",
      numOctavesVolatility: "0.56",
      numOctavesDensity: "9",
      scaleAnimationType: "wiggle",
      scaleAnimationDuration: "5",
      scaleVolatility: "0.35",
      scaleDensity: "5",
      translateXAnimationType: "jitter",
      translateXAnimationDuration: "5.4",
      translateXVolatility: "0.06",
      translateXDensity: "13",
      translateYAnimationType: "jitter",
      translateYAnimationDuration: "5.8",
      translateYVolatility: "0.06",
      translateYDensity: "13",
      rotateAnimationType: "wiggle",
      rotateAnimationDuration: "5",
      rotateVolatility: "0.35",
      rotateDensity: "5",
    },
  },
  "death-eater": {
    label: "death eater",
    values: {
      ...BASE_PRESET_VALUES,
      textContent: "🖤",
      fontFamily: "Times New Roman, serif",
      textSize: "95",
      baseFrequency: "0.023",
      numOctaves: "8",
      scale: "116",
      translateX: "0",
      translateY: "0",
      rotate: "0",
      animateTextSize: true,
      animateBaseFrequency: false,
      animateNumOctaves: false,
      animateScale: true,
      animateTranslateX: true,
      animateTranslateY: true,
      animateRotate: true,
      textSizeAnimationType: "jitter",
      textSizeAnimationDuration: "6.3",
      textSizeVolatility: "0.42",
      textSizeDensity: "11",
      baseFrequencyAnimationType: "jitter",
      baseFrequencyAnimationDuration: "6.9",
      baseFrequencyVolatility: "0.55",
      baseFrequencyDensity: "8",
      numOctavesAnimationType: "wiggle",
      numOctavesAnimationDuration: "5",
      numOctavesVolatility: "0.78",
      numOctavesDensity: "5",
      scaleAnimationType: "jitter",
      scaleAnimationDuration: "3.7",
      scaleVolatility: "0.62",
      scaleDensity: "14",
      translateXAnimationType: "jitter",
      translateXAnimationDuration: "10.7",
      translateXVolatility: "0.37",
      translateXDensity: "13",
      translateYAnimationType: "jitter",
      translateYAnimationDuration: "10",
      translateYVolatility: "0.24",
      translateYDensity: "13",
      rotateAnimationType: "jitter",
      rotateAnimationDuration: "5",
      rotateVolatility: "0.35",
      rotateDensity: "5",
    },
  },
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatFrequency(value) {
  return Number.parseFloat(value).toFixed(4);
}

function formatDuration(value) {
  return `${Number.parseFloat(value).toFixed(1)}s`;
}

function getAnimationEasing(animationType, valueCount) {
  if (animationType !== "jitter") {
    return "linear";
  }

  const steps = Math.max(1, valueCount - 1);
  return `steps(${steps}, end)`;
}

function formatTransform(variableKey, value) {
  const rounded = Math.round(value);

  if (variableKey === "translateX") {
    return `translateX(${rounded}px)`;
  }

  if (variableKey === "translateY") {
    return `translateY(${rounded}px)`;
  }

  return `rotate(${rounded}deg)`;
}

function formatPercent(index, length) {
  if (length <= 1) {
    return "0%";
  }

  const raw = (index / (length - 1)) * 100;
  return `${Number.parseFloat(raw.toFixed(2))}%`;
}

function escapeHtmlContent(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getStepDecimals(stepText) {
  if (!stepText || stepText === "any") {
    return 0;
  }

  if (stepText.includes("e-")) {
    return Number.parseInt(stepText.split("e-")[1], 10);
  }

  const dotIndex = stepText.indexOf(".");
  return dotIndex === -1 ? 0 : stepText.length - dotIndex - 1;
}

function getRangeConfig(input) {
  const min = Number.parseFloat(input.min || "0");
  const max = Number.parseFloat(input.max || "100");
  const stepText = input.step || "1";
  const step =
    stepText === "any" ? (max - min) / 100 : Number.parseFloat(stepText);
  const decimals = getStepDecimals(stepText);

  return { min, max, step, decimals };
}

function quantizeToStep(value, min, max, step, decimals) {
  let next = clamp(value, min, max);

  if (Number.isFinite(step) && step > 0) {
    next = min + Math.round((next - min) / step) * step;
  }

  next = clamp(next, min, max);
  return Number.parseFloat(next.toFixed(decimals));
}

function percentFromInput(input) {
  const { min, max } = getRangeConfig(input);

  if (max <= min) {
    return 0;
  }

  return clamp((Number.parseFloat(input.value) - min) / (max - min), 0, 1);
}

function percentFromAngle(angleDeg, currentPercent) {
  const normalized = (angleDeg + 360) % 360;
  let delta = (normalized - 225 + 360) % 360;

  if (delta > 270) {
    delta = currentPercent >= 0.5 ? 270 : 0;
  }

  return clamp(delta / 270, 0, 1);
}

function updateKnobVisual(input, knob) {
  const percent = percentFromInput(input);
  const angle = -135 + percent * 270;
  knob.style.setProperty("--progress", String(percent));
  knob.style.setProperty("--angle", `${angle}deg`);
  knob.setAttribute("aria-valuenow", input.value);
}

function setRangeFromPercent(input, percent) {
  const { min, max, step, decimals } = getRangeConfig(input);
  const raw = min + clamp(percent, 0, 1) * (max - min);
  const quantized = quantizeToStep(raw, min, max, step, decimals);
  const nextValue =
    decimals > 0 ? quantized.toFixed(decimals) : String(Math.round(quantized));

  if (nextValue !== input.value) {
    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function adjustRangeByStep(input, stepMultiplier) {
  const { min, max, step, decimals } = getRangeConfig(input);
  const baseStep = Number.isFinite(step) && step > 0 ? step : (max - min) / 100;
  const current = Number.parseFloat(input.value);
  const next = quantizeToStep(
    current + baseStep * stepMultiplier,
    min,
    max,
    baseStep,
    decimals,
  );
  const nextValue =
    decimals > 0 ? next.toFixed(decimals) : String(Math.round(next));

  if (nextValue !== input.value) {
    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function getKnobCategoryClass(inputId) {
  if (inputId.endsWith("-animation-duration")) {
    return "knob--duration";
  }

  if (inputId.endsWith("-volatility")) {
    return "knob--volatility";
  }

  if (inputId.endsWith("-density")) {
    return "knob--density";
  }

  return "knob--base";
}

function setupKnobForInputId(inputId) {
  const input = document.getElementById(inputId);

  if (!input || input.dataset.knobReady === "true") {
    return;
  }

  input.dataset.knobReady = "true";
  input.classList.add("knob-source");

  const knobWrap = document.createElement("div");
  knobWrap.className = "knob-wrap";

  const knob = document.createElement("button");
  knob.type = "button";
  knob.className = `knob ${getKnobCategoryClass(inputId)}`;
  knob.setAttribute("role", "slider");

  const labelText =
    input.labels && input.labels.length > 0
      ? input.labels[0].textContent.trim()
      : "Knob control";
  knob.setAttribute("aria-label", labelText);

  const { min, max } = getRangeConfig(input);
  knob.setAttribute("aria-valuemin", String(min));
  knob.setAttribute("aria-valuemax", String(max));

  const knobIndicator = document.createElement("span");
  knobIndicator.className = "knob-indicator";
  knob.appendChild(knobIndicator);
  knobWrap.appendChild(knob);
  input.insertAdjacentElement("afterend", knobWrap);

  const applyFromPointer = (event) => {
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle =
      Math.atan2(event.clientY - centerY, event.clientX - centerX) *
      (180 / Math.PI);
    const percent = percentFromAngle(angle, percentFromInput(input));
    setRangeFromPercent(input, percent);
    updateKnobVisual(input, knob);
  };

  knob.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    knob.setPointerCapture(event.pointerId);
    applyFromPointer(event);
  });

  knob.addEventListener("pointermove", (event) => {
    if (!knob.hasPointerCapture(event.pointerId)) {
      return;
    }

    applyFromPointer(event);
  });

  knob.addEventListener("pointerup", (event) => {
    if (knob.hasPointerCapture(event.pointerId)) {
      knob.releasePointerCapture(event.pointerId);
    }
  });

  knob.addEventListener("pointercancel", (event) => {
    if (knob.hasPointerCapture(event.pointerId)) {
      knob.releasePointerCapture(event.pointerId);
    }
  });

  knob.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      adjustRangeByStep(input, 1);
      updateKnobVisual(input, knob);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      adjustRangeByStep(input, -1);
      updateKnobVisual(input, knob);
      return;
    }

    if (event.key === "PageUp") {
      event.preventDefault();
      adjustRangeByStep(input, 5);
      updateKnobVisual(input, knob);
      return;
    }

    if (event.key === "PageDown") {
      event.preventDefault();
      adjustRangeByStep(input, -5);
      updateKnobVisual(input, knob);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const percent = event.key === "Home" ? 0 : 1;
      setRangeFromPercent(input, percent);
      updateKnobVisual(input, knob);
    }
  });

  input.addEventListener("input", () => {
    updateKnobVisual(input, knob);
  });

  updateKnobVisual(input, knob);
}

function setupAnimationKnobs() {
  KNOB_INPUT_IDS.forEach((inputId) => {
    setupKnobForInputId(inputId);
  });
}

function getChannelControlElements(item) {
  const animateInput = document.getElementById(item.animateInputId);
  const modeInput = document.getElementById(item.modeInputId);
  const toggleButton = document.getElementById(item.animateButtonId);

  if (!animateInput || !modeInput || !toggleButton) {
    return null;
  }

  return { animateInput, modeInput, toggleButton };
}

function syncChannelControlElements(elements) {
  const { animateInput, modeInput, toggleButton } = elements;
  const isActive = Boolean(animateInput.checked);
  const mode = modeInput.value === "jitter" ? "jitter" : "wiggle";
  const channel = animateInput.closest(".channel");
  const visualMode = isActive ? mode : "off";
  const modeUi = ANIMATION_MODE_UI[visualMode] ?? ANIMATION_MODE_UI.off;

  if (channel) {
    channel.classList.toggle("is-off", !isActive);
  }

  toggleButton.classList.toggle("is-active", isActive);
  toggleButton.setAttribute("aria-pressed", String(isActive));
  toggleButton.dataset.mode = visualMode;
  toggleButton.textContent = modeUi.symbol;
  toggleButton.setAttribute(
    "aria-label",
    `Cycle animation state (current: ${modeUi.label})`,
  );
  toggleButton.title = "Cycle: off, smooth, jumpy";
}

function syncAllChannelIconControls() {
  CHANNEL_CONTROL_MAP.forEach((item) => {
    const elements = getChannelControlElements(item);
    if (!elements) {
      return;
    }
    syncChannelControlElements(elements);
  });
}

function setupChannelIconControls() {
  CHANNEL_CONTROL_MAP.forEach((item) => {
    const elements = getChannelControlElements(item);

    if (!elements) {
      return;
    }

    const { animateInput, modeInput, toggleButton } = elements;
    const sync = () => syncChannelControlElements(elements);

    toggleButton.addEventListener("click", () => {
      const currentMode = modeInput.value === "jitter" ? "jitter" : "wiggle";
      const wasActive = animateInput.checked;
      let animateChanged = false;
      let modeChanged = false;

      if (!wasActive) {
        animateInput.checked = true;
        animateChanged = true;
        if (currentMode !== "wiggle") {
          modeInput.value = "wiggle";
          modeChanged = true;
        }
      } else if (currentMode === "wiggle") {
        modeInput.value = "jitter";
        modeChanged = true;
      } else {
        animateInput.checked = false;
        animateChanged = true;
      }

      if (modeChanged) {
        modeInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (animateChanged) {
        animateInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      sync();
    });

    animateInput.addEventListener("change", sync);
    modeInput.addEventListener("change", sync);
    sync();
  });
}

function setControlElementValue(control, value) {
  if (!control) {
    return;
  }

  if (control.type === "checkbox") {
    control.checked = Boolean(value);
    return;
  }

  control.value = String(value);
}

function setPresetToCustom() {
  if (!controls.presetSelect || controls.presetSelect.value === "custom") {
    return;
  }

  controls.presetSelect.value = "custom";
}

function handleManualControlMutation() {
  if (isApplyingPreset) {
    return;
  }

  setPresetToCustom();
}

function applyPreset(presetId) {
  const preset = PRESETS[presetId];
  if (!preset) {
    return;
  }

  const values = { ...BASE_PRESET_VALUES, ...preset.values };
  isApplyingPreset = true;
  PRESET_CONTROL_KEYS.forEach((key) => {
    setControlElementValue(controls[key], values[key]);
  });
  isApplyingPreset = false;

  syncAllChannelIconControls();
  regenerateAllAnimationValues();
}

function populatePresetSelect() {
  if (!controls.presetSelect) {
    return;
  }

  controls.presetSelect.innerHTML = "";

  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "Custom";
  controls.presetSelect.appendChild(customOption);

  Object.entries(PRESETS).forEach(([presetId, preset]) => {
    const option = document.createElement("option");
    option.value = presetId;
    option.textContent = preset.label;
    controls.presetSelect.appendChild(option);
  });

  controls.presetSelect.value = PRESETS["readable-ish"]
    ? "readable-ish"
    : "custom";
}

function setupPresetControls() {
  populatePresetSelect();

  if (controls.presetSelect) {
    controls.presetSelect.addEventListener("change", () => {
      const presetId = controls.presetSelect.value;
      if (presetId === "custom") {
        return;
      }
      applyPreset(presetId);
    });
  }

  if (controls.presetSelect && controls.presetSelect.value !== "custom") {
    applyPreset(controls.presetSelect.value);
  }

  PRESET_CONTROL_KEYS.forEach((key) => {
    const control = controls[key];
    if (!control) {
      return;
    }

    control.addEventListener("input", handleManualControlMutation);
    control.addEventListener("change", handleManualControlMutation);
  });
}

function normalizeValue(value, options) {
  let next = clamp(value, options.min, options.max);

  if (options.integer) {
    next = Math.round(next);
  }

  if (typeof options.decimals === "number") {
    next = Number.parseFloat(next.toFixed(options.decimals));
  }

  return next;
}

function getState() {
  const inputText = controls.textContent.value;

  return {
    textContent: inputText.length > 0 ? inputText : "Glitchy Text",
    fontFamily: controls.fontFamily.value,
    textSize: Number.parseInt(controls.textSize.value, 10),
    baseFrequency: Number.parseFloat(controls.baseFrequency.value),
    numOctaves: Number.parseInt(controls.numOctaves.value, 10),
    scale: Number.parseInt(controls.scale.value, 10),
    translateX: Number.parseInt(controls.translateX.value, 10),
    translateY: Number.parseInt(controls.translateY.value, 10),
    rotate: Number.parseInt(controls.rotate.value, 10),
    animations: {
      textSize: {
        enabled: controls.animateTextSize.checked,
        type: controls.textSizeAnimationType.value,
        duration: Number.parseFloat(controls.textSizeAnimationDuration.value),
        volatility: Number.parseFloat(controls.textSizeVolatility.value),
        density: Number.parseInt(controls.textSizeDensity.value, 10),
      },
      baseFrequency: {
        enabled: controls.animateBaseFrequency.checked,
        type: controls.baseFrequencyAnimationType.value,
        duration: Number.parseFloat(
          controls.baseFrequencyAnimationDuration.value,
        ),
        volatility: Number.parseFloat(controls.baseFrequencyVolatility.value),
        density: Number.parseInt(controls.baseFrequencyDensity.value, 10),
      },
      numOctaves: {
        enabled: controls.animateNumOctaves.checked,
        type: controls.numOctavesAnimationType.value,
        duration: Number.parseFloat(controls.numOctavesAnimationDuration.value),
        volatility: Number.parseFloat(controls.numOctavesVolatility.value),
        density: Number.parseInt(controls.numOctavesDensity.value, 10),
      },
      scale: {
        enabled: controls.animateScale.checked,
        type: controls.scaleAnimationType.value,
        duration: Number.parseFloat(controls.scaleAnimationDuration.value),
        volatility: Number.parseFloat(controls.scaleVolatility.value),
        density: Number.parseInt(controls.scaleDensity.value, 10),
      },
      translateX: {
        enabled: controls.animateTranslateX.checked,
        type: controls.translateXAnimationType.value,
        duration: Number.parseFloat(controls.translateXAnimationDuration.value),
        volatility: Number.parseFloat(controls.translateXVolatility.value),
        density: Number.parseInt(controls.translateXDensity.value, 10),
      },
      translateY: {
        enabled: controls.animateTranslateY.checked,
        type: controls.translateYAnimationType.value,
        duration: Number.parseFloat(controls.translateYAnimationDuration.value),
        volatility: Number.parseFloat(controls.translateYVolatility.value),
        density: Number.parseInt(controls.translateYDensity.value, 10),
      },
      rotate: {
        enabled: controls.animateRotate.checked,
        type: controls.rotateAnimationType.value,
        duration: Number.parseFloat(controls.rotateAnimationDuration.value),
        volatility: Number.parseFloat(controls.rotateVolatility.value),
        density: Number.parseInt(controls.rotateDensity.value, 10),
      },
    },
  };
}

function getAnimationSequence(variableKey, state) {
  const meta = VARIABLE_META[variableKey];
  const settings = state.animations[variableKey];
  const base = normalizeValue(state[meta.baseStateKey], meta);
  const source = animationSeeds[variableKey];
  const reference =
    typeof meta.volatilityReference === "number"
      ? meta.volatilityReference
      : Math.abs(base);
  const span = reference * settings.volatility;

  if (!Array.isArray(source) || source.length === 0) {
    return [base, base, base];
  }

  const middle = source.map((unit) => {
    const candidate = base + unit * span;
    return normalizeValue(candidate, meta);
  });

  return [base, ...middle, base];
}

function generateAnimationSeed(density) {
  const count = Math.max(2, density);
  const seed = [];

  for (let i = 1; i < count; i += 1) {
    seed.push(Math.random() * 2 - 1);
  }

  return seed;
}

function regenerateAnimationValue(variableKey) {
  const state = getState();
  const animationState = state.animations[variableKey];
  animationSeeds[variableKey] = generateAnimationSeed(animationState.density);

  render();
}

function regenerateAllAnimationValues() {
  const state = getState();

  Object.keys(VARIABLE_META).forEach((variableKey) => {
    const animationState = state.animations[variableKey];
    animationSeeds[variableKey] = generateAnimationSeed(animationState.density);
  });

  render();
}

function clearGeneratedSvgAnimations() {
  ui.turbulenceNode
    .querySelectorAll("animate[data-generated='true']")
    .forEach((node) => node.remove());
  ui.displacementNode
    .querySelectorAll("animate[data-generated='true']")
    .forEach((node) => node.remove());
}

function appendSvgAnimation(
  target,
  attributeName,
  values,
  formatter,
  duration,
  animationType,
) {
  if (!Array.isArray(values) || values.length === 0) {
    return;
  }

  const animate = document.createElementNS(SVG_NS, "animate");
  animate.setAttribute("attributeName", attributeName);
  animate.setAttribute("values", values.map(formatter).join(";"));
  animate.setAttribute("dur", `${duration}s`);
  animate.setAttribute("repeatCount", "indefinite");
  if (animationType === "jitter") {
    animate.setAttribute("calcMode", "discrete");
  }
  animate.setAttribute("data-generated", "true");
  target.appendChild(animate);
}

function applyTextSizeAnimation(state) {
  const values = getAnimationSequence("textSize", state);
  const settings = state.animations.textSize;

  if (
    settings.enabled &&
    Array.isArray(values) &&
    values.length > 1 &&
    typeof ui.previewText.animate === "function"
  ) {
    const nextKey = `${values.join(";")}|${settings.duration}|${settings.type}`;

    if (nextKey !== textSizeAnimationKey) {
      if (textSizeAnimation) {
        textSizeAnimation.cancel();
      }

      const keyframes = values.map((value) => ({
        fontSize: `${Math.round(value)}px`,
      }));

      textSizeAnimation = ui.previewText.animate(keyframes, {
        duration: settings.duration * 1000,
        iterations: Number.POSITIVE_INFINITY,
        easing: getAnimationEasing(settings.type, values.length),
      });
      textSizeAnimationKey = nextKey;
    }
    return;
  }

  if (textSizeAnimation) {
    textSizeAnimation.cancel();
    textSizeAnimation = null;
  }

  textSizeAnimationKey = "";
  ui.previewText.style.fontSize = `${state.textSize}px`;
}

function getTransformTarget(variableKey) {
  if (variableKey === "translateX") {
    return ui.previewTranslateX;
  }

  if (variableKey === "translateY") {
    return ui.previewTranslateY;
  }

  return ui.previewRotate;
}

function applyTransformAnimation(variableKey, state) {
  const target = getTransformTarget(variableKey);
  const settings = state.animations[variableKey];
  const values = getAnimationSequence(variableKey, state);
  const animationStore = transformAnimationState[variableKey];
  const baseTransform = formatTransform(variableKey, state[variableKey]);

  if (!target || !animationStore) {
    return;
  }

  if (
    settings.enabled &&
    Array.isArray(values) &&
    values.length > 1 &&
    typeof target.animate === "function"
  ) {
    const nextKey = `${values.join(";")}|${settings.duration}|${settings.type}`;

    if (nextKey !== animationStore.key) {
      if (animationStore.animation) {
        animationStore.animation.cancel();
      }

      const keyframes = values.map((value) => ({
        transform: formatTransform(variableKey, value),
      }));

      animationStore.animation = target.animate(keyframes, {
        duration: settings.duration * 1000,
        iterations: Number.POSITIVE_INFINITY,
        easing: getAnimationEasing(settings.type, values.length),
      });
      animationStore.key = nextKey;
    }
    return;
  }

  if (animationStore.animation) {
    animationStore.animation.cancel();
    animationStore.animation = null;
  }

  animationStore.key = "";
  target.style.transform = baseTransform;
}

function applyTransformAnimations(state) {
  TRANSFORM_VARIABLE_KEYS.forEach((variableKey) => {
    applyTransformAnimation(variableKey, state);
  });
}

function buildSnippet(state) {
  const safeText = escapeHtmlContent(state.textContent);
  const turbulenceAnimationLines = [];
  const displacementAnimationLines = [];
  const transformInfo = {
    translateX: {
      className: "distort-x",
      keyframesName: "translateXMotion",
    },
    translateY: {
      className: "distort-y",
      keyframesName: "translateYMotion",
    },
    rotate: {
      className: "distort-r",
      keyframesName: "rotateMotion",
    },
  };

  if (state.animations.baseFrequency.enabled) {
    const values = getAnimationSequence("baseFrequency", state)
      .map(VARIABLE_META.baseFrequency.formatter)
      .join(";");
    const calcModePart =
      state.animations.baseFrequency.type === "jitter"
        ? ` calcMode="discrete"`
        : "";
    turbulenceAnimationLines.push(
      `      <animate attributeName="baseFrequency" values="${values}" dur="${formatDuration(state.animations.baseFrequency.duration)}" repeatCount="indefinite"${calcModePart} />`,
    );
  }

  if (state.animations.numOctaves.enabled) {
    const values = getAnimationSequence("numOctaves", state)
      .map(VARIABLE_META.numOctaves.formatter)
      .join(";");
    const calcModePart =
      state.animations.numOctaves.type === "jitter"
        ? ` calcMode="discrete"`
        : "";
    turbulenceAnimationLines.push(
      `      <animate attributeName="numOctaves" values="${values}" dur="${formatDuration(state.animations.numOctaves.duration)}" repeatCount="indefinite"${calcModePart} />`,
    );
  }

  if (state.animations.scale.enabled) {
    const values = getAnimationSequence("scale", state)
      .map(VARIABLE_META.scale.formatter)
      .join(";");
    const calcModePart =
      state.animations.scale.type === "jitter" ? ` calcMode="discrete"` : "";
    displacementAnimationLines.push(
      `      <animate attributeName="scale" values="${values}" dur="${formatDuration(state.animations.scale.duration)}" repeatCount="indefinite"${calcModePart} />`,
    );
  }

  const svgLines = [`<svg width="0" height="0">`, `  <filter id="turbulence">`];

  if (turbulenceAnimationLines.length > 0) {
    svgLines.push(
      `    <feTurbulence type="turbulence" baseFrequency="${formatFrequency(state.baseFrequency)}" numOctaves="${state.numOctaves}" result="turbulence">`,
    );
    svgLines.push(...turbulenceAnimationLines);
    svgLines.push(`    </feTurbulence>`);
  } else {
    svgLines.push(
      `    <feTurbulence type="turbulence" baseFrequency="${formatFrequency(state.baseFrequency)}" numOctaves="${state.numOctaves}" result="turbulence" />`,
    );
  }

  if (displacementAnimationLines.length > 0) {
    svgLines.push(
      `    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="${state.scale}" xChannelSelector="R" yChannelSelector="G">`,
    );
    svgLines.push(...displacementAnimationLines);
    svgLines.push(`    </feDisplacementMap>`);
  } else {
    svgLines.push(
      `    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="${state.scale}" xChannelSelector="R" yChannelSelector="G" />`,
    );
  }

  const transformOrder = ["translateX", "translateY", "rotate"];
  const activeTransformKeys = transformOrder.filter(
    (variableKey) =>
      state[variableKey] !== 0 ||
      Boolean(state.animations[variableKey]?.enabled),
  );

  let wrappedText = `<span class="distort">${safeText}</span>`;
  activeTransformKeys
    .slice()
    .reverse()
    .forEach((variableKey) => {
      const meta = transformInfo[variableKey];
      wrappedText = `<span class="${meta.className}">${wrappedText}</span>`;
    });

  svgLines.push(`  </filter>`, `</svg>`, ``, wrappedText, ``);

  const cssLines = [
    `.distort {`,
    `  font-family: ${state.fontFamily};`,
    `  font-size: ${state.textSize}px;`,
    `  filter: url(#turbulence);`,
  ];
  const textSizeValues = getAnimationSequence("textSize", state);
  const textSizeTiming = getAnimationEasing(
    state.animations.textSize.type,
    textSizeValues.length,
  );

  if (state.animations.textSize.enabled) {
    cssLines.push(
      `  animation: textSizeMotion ${formatDuration(state.animations.textSize.duration)} ${textSizeTiming} infinite;`,
    );
  }

  cssLines.push(`}`);

  if (state.animations.textSize.enabled) {
    cssLines.push(``, `@keyframes textSizeMotion {`);
    textSizeValues.forEach((value, index, values) => {
      cssLines.push(
        `  ${formatPercent(index, values.length)} { font-size: ${Math.round(value)}px; }`,
      );
    });
    cssLines.push(`}`);
  }

  activeTransformKeys.forEach((variableKey) => {
    const meta = transformInfo[variableKey];
    const settings = state.animations[variableKey];
    const transformValues = getAnimationSequence(variableKey, state);
    const animationTiming = getAnimationEasing(
      settings.type,
      transformValues.length,
    );

    cssLines.push(
      ``,
      `.${meta.className} {`,
      `  display: inline-block;`,
      `  transform: ${formatTransform(variableKey, state[variableKey])};`,
    );

    if (settings.enabled) {
      cssLines.push(
        `  animation: ${meta.keyframesName} ${formatDuration(settings.duration)} ${animationTiming} infinite;`,
      );
    }

    cssLines.push(`}`);

    if (settings.enabled) {
      cssLines.push(``, `@keyframes ${meta.keyframesName} {`);
      transformValues.forEach((value, index, values) => {
        cssLines.push(
          `  ${formatPercent(index, values.length)} { transform: ${formatTransform(variableKey, value)}; }`,
        );
      });
      cssLines.push(`}`);
    }
  });

  return [...svgLines, "<!-- CSS -->", ...cssLines].join("\n");
}

function openCodeModal(code) {
  ui.codeOutput.textContent = code;

  if (typeof ui.codeModal.showModal === "function") {
    if (!ui.codeModal.open) {
      ui.codeModal.showModal();
    }
    return;
  }

  ui.codeModal.setAttribute("open", "");
}

function closeCodeModal() {
  if (typeof ui.codeModal.close === "function") {
    if (ui.codeModal.open) {
      ui.codeModal.close();
    }
    return;
  }

  ui.codeModal.removeAttribute("open");
}

function handleCodeModalOutsideClick(event) {
  if (!ui.codeModal.open) {
    return;
  }

  const rect = ui.codeModal.getBoundingClientRect();
  const clickedInsideDialog =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!clickedInsideDialog) {
    closeCodeModal();
  }
}

function render() {
  const state = getState();

  ui.previewText.textContent = state.textContent;
  ui.previewText.style.fontFamily = state.fontFamily;

  ui.turbulenceNode.setAttribute(
    "baseFrequency",
    formatFrequency(state.baseFrequency),
  );
  ui.turbulenceNode.setAttribute("numOctaves", String(state.numOctaves));
  ui.displacementNode.setAttribute("scale", String(state.scale));

  clearGeneratedSvgAnimations();

  if (state.animations.baseFrequency.enabled) {
    appendSvgAnimation(
      ui.turbulenceNode,
      "baseFrequency",
      getAnimationSequence("baseFrequency", state),
      VARIABLE_META.baseFrequency.formatter,
      state.animations.baseFrequency.duration,
      state.animations.baseFrequency.type,
    );
  }

  if (state.animations.numOctaves.enabled) {
    appendSvgAnimation(
      ui.turbulenceNode,
      "numOctaves",
      getAnimationSequence("numOctaves", state),
      VARIABLE_META.numOctaves.formatter,
      state.animations.numOctaves.duration,
      state.animations.numOctaves.type,
    );
  }

  if (state.animations.scale.enabled) {
    appendSvgAnimation(
      ui.displacementNode,
      "scale",
      getAnimationSequence("scale", state),
      VARIABLE_META.scale.formatter,
      state.animations.scale.duration,
      state.animations.scale.type,
    );
  }

  applyTextSizeAnimation(state);
  applyTransformAnimations(state);

  latestSnippet = buildSnippet(state);
}

function fallbackCopy(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();

  const copied = document.execCommand("copy");
  helper.remove();
  return copied;
}

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => fallbackCopy(text));
  }

  return Promise.resolve(fallbackCopy(text));
}

function copySnippet() {
  const text = latestSnippet || buildSnippet(getState());

  if (!text) {
    return;
  }

  openCodeModal(text);
  copyToClipboard(text).catch(() => {});
}

controls.textContent.addEventListener("input", render);
controls.fontFamily.addEventListener("change", render);
controls.textSize.addEventListener("input", render);
controls.baseFrequency.addEventListener("input", render);
controls.numOctaves.addEventListener("input", render);
controls.scale.addEventListener("input", render);
controls.translateX.addEventListener("input", render);
controls.translateY.addEventListener("input", render);
controls.rotate.addEventListener("input", render);

controls.animateTextSize.addEventListener("change", render);
controls.textSizeAnimationType.addEventListener("change", render);
controls.textSizeAnimationDuration.addEventListener("input", render);
controls.textSizeVolatility.addEventListener("input", () =>
  regenerateAnimationValue("textSize"),
);
controls.textSizeDensity.addEventListener("input", () =>
  regenerateAnimationValue("textSize"),
);

controls.animateBaseFrequency.addEventListener("change", render);
controls.baseFrequencyAnimationType.addEventListener("change", render);
controls.baseFrequencyAnimationDuration.addEventListener("input", render);
controls.baseFrequencyVolatility.addEventListener("input", () =>
  regenerateAnimationValue("baseFrequency"),
);
controls.baseFrequencyDensity.addEventListener("input", () =>
  regenerateAnimationValue("baseFrequency"),
);

controls.animateNumOctaves.addEventListener("change", render);
controls.numOctavesAnimationType.addEventListener("change", render);
controls.numOctavesAnimationDuration.addEventListener("input", render);
controls.numOctavesVolatility.addEventListener("input", () =>
  regenerateAnimationValue("numOctaves"),
);
controls.numOctavesDensity.addEventListener("input", () =>
  regenerateAnimationValue("numOctaves"),
);

controls.animateScale.addEventListener("change", render);
controls.scaleAnimationType.addEventListener("change", render);
controls.scaleAnimationDuration.addEventListener("input", render);
controls.scaleVolatility.addEventListener("input", () =>
  regenerateAnimationValue("scale"),
);
controls.scaleDensity.addEventListener("input", () =>
  regenerateAnimationValue("scale"),
);

controls.animateTranslateX.addEventListener("change", render);
controls.translateXAnimationType.addEventListener("change", render);
controls.translateXAnimationDuration.addEventListener("input", render);
controls.translateXVolatility.addEventListener("input", () =>
  regenerateAnimationValue("translateX"),
);
controls.translateXDensity.addEventListener("input", () =>
  regenerateAnimationValue("translateX"),
);

controls.animateTranslateY.addEventListener("change", render);
controls.translateYAnimationType.addEventListener("change", render);
controls.translateYAnimationDuration.addEventListener("input", render);
controls.translateYVolatility.addEventListener("input", () =>
  regenerateAnimationValue("translateY"),
);
controls.translateYDensity.addEventListener("input", () =>
  regenerateAnimationValue("translateY"),
);

controls.animateRotate.addEventListener("change", render);
controls.rotateAnimationType.addEventListener("change", render);
controls.rotateAnimationDuration.addEventListener("input", render);
controls.rotateVolatility.addEventListener("input", () =>
  regenerateAnimationValue("rotate"),
);
controls.rotateDensity.addEventListener("input", () =>
  regenerateAnimationValue("rotate"),
);

ui.copyButton.addEventListener("click", copySnippet);
if (ui.logConfigButton) {
  ui.logConfigButton.addEventListener("click", logCurrentPresetConfig);
}
ui.modalCloseButton.addEventListener("click", closeCodeModal);
ui.codeModal.addEventListener("click", handleCodeModalOutsideClick);

setupPresetControls();
setupAnimationKnobs();
setupChannelIconControls();
regenerateAllAnimationValues();
