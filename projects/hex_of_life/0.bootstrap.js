(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./app.js":
/*!******************!*\
  !*** ./app.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wasm_game_of_life_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wasm_game_of_life.js */ \"./wasm_game_of_life.js\");\n/* harmony import */ var _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wasm_game_of_life_bg.wasm */ \"./wasm_game_of_life_bg.wasm\");\n\n\n\nconst CELL_SIZE = 50;\n\n//const GRID_COLOR = \"#FFAA00\";\nconst COLOR_DEAD = \"#111111\";\n// These must match `Cell::Alive` and `Cell::Dead` in `src/lib.rs`.\nconst DEAD  = 0;\nconst ALIVE = 1;\n\nconst w_ = 800;\nconst h_ = 600;\n\nconst w = Math.ceil(w_/(CELL_SIZE * 1.5 * 1.1) + 1)/2;\nconst h = Math.ceil(h_/CELL_SIZE + 0.8660254037844387 * 1.1);\n\nconst universe = _wasm_game_of_life_js__WEBPACK_IMPORTED_MODULE_0__[\"Universe\"].new(w,h);\nconst width  = universe.width();\nconst height = universe.height();\n\n// Initialize the canvas with room for all of our cells and a 1px border\n// around each of them.\nconst canvas = document.getElementById(\"hex-of-life-canvas\");\ncanvas.width  = CELL_SIZE * (2 * width - 1) * 1.5 * 1.1;\ncanvas.height = CELL_SIZE * (height - 0.8660254037844387 * 1.1);\n\nconst ctx = canvas.getContext('2d');\n\nlet animationId = null;\n\nconst fps = new class {\n  constructor() {\n    this.fps = document.getElementById(\"fps\");\n    this.frames = [];\n    this.lastFrameTimeStamp = performance.now();\n  }\n\n  render() {\n    const now = performance.now();\n    const delta = now - this.lastFrameTimeStamp;\n    this.lastFrameTimeStamp = now;\n    const fps = 1 / delta * 1000;\n\n    this.frames.push(fps);\n    if (this.frames.length > 100) {\n      this.frames.shift();\n    }\n\n    let min = Infinity;\n    let max = -Infinity;\n    let sum = 0;\n    for (let i = 0; i < this.frames.length; i++) {\n      sum += this.frames[i];\n      min = Math.min(this.frames[i], min);\n      max = Math.max(this.frames[i], max);\n    }\n    let mean = sum / this.frames.length;\n\n    this.fps.textContent = `\nFrames per Second:\n         latest = ${Math.round(fps)}\navg of last 100 = ${Math.round(mean)}\nmin of last 100 = ${Math.round(min)}\nmax of last 100 = ${Math.round(max)}\n`.trim();\n  }\n};\n\nvar slow = -1;\nconst fadeRate = 80;\n\nconst renderLoop = () => {\n  fps.render();\n  if (fadeRate <= ++slow) {\n    //for (let i = 0; i < 1; i++) {\n      slow = 0;\n      universe.tick();\n    //}\n  }\n  drawCells(slow);\n  //drawGrid()\n  animationId = requestAnimationFrame(renderLoop);\n};\n\nconst getIndex = (x, y) => {\n  return x + y * width;\n};\n\nconst drawHexagon = (x,y) => {\n    const x0 = 3.3*(x+(y%2)/2)*CELL_SIZE;\n    const y0 = y*CELL_SIZE;\n    ctx.beginPath();\n    ctx.moveTo(x0+CELL_SIZE,y0);\n    const y1 = CELL_SIZE*0.8660254037844386;\n    const x1 = CELL_SIZE*0.5;\n    const x2 = CELL_SIZE;\n    // pre-calculated hex_agon angles -for performance\n    ctx.lineTo(x0+x1,y0+y1);\n    ctx.lineTo(x0-x1,y0+y1);\n    ctx.lineTo(x0-x2,y0);\n    ctx.lineTo(x0-x1,y0-y1);\n    ctx.lineTo(x0+x1,y0-y1);\n    ctx.lineTo(x0+x2,y0);\n    ctx.closePath();\n    ctx.fill();\n    //var style = ctx.fillStyle;\n    //ctx.fillStyle = \"white\";\n    //ctx.font = \"12px Arial\";\n    //ctx.fillText(\"(\"+x+\",\"+y+\")\", x0,y0);\n    //ctx.fillStyle = style;\n}\n\n//const drawGrid = () => {\n    //ctx.beginPath();\n    //ctx.strokeStyle = GRID_COLOR;\n    //// Vertical lines.\n    //for (let i = 0; i <= width; i++) {\n        //ctx.moveTo(i * (3.3*CELL_SIZE/2), 0);\n        //ctx.lineTo(i * (3.3*CELL_SIZE/2), canvas.height);\n    //}\n    //// Horizontal lines.\n    //for (let j = 0; j <= height; j++) {\n        //ctx.moveTo(0           , j * CELL_SIZE);\n        //ctx.lineTo(canvas.width, j * CELL_SIZE);\n        //ctx.stroke();\n    //}\n  //ctx.stroke();\n//};\n\nconst drawCell = (what) => {\n  for (var y = 0; y < height; y++) {\n    for (var x = 0; x < width; x++) {\n      const idx = getIndex(x,y);\n      if (cells[idx] !== what) {\n        continue;\n      }\n      drawHexagon(x,y);\n    }\n  }\n};\n\nconst drawCells = (n) => {\n  const cellsPtr = universe.cells();\n  const cells = new Uint8Array(_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer, cellsPtr, width * height);\n\n  // Because changing the `fillStyle` is an expensive operation, we want to\n  // avoid doing it for every cell. Instead, we do two passes: one for live\n  // cells, and one for dead cells.\n\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  // Dead cells.\n  ctx.fillStyle = COLOR_DEAD;\n  for (var y = 0; y < height; y++) {\n    for (var x = 0; x < width; x++) {\n      const idx = getIndex(x,y);\n      if (cells[idx] !== DEAD) {\n        continue;\n      }\n      drawHexagon(x,y);\n    }\n  }\n\n  // Live cells.\n  const t_ = (n*n)/(fadeRate*fadeRate);\n  const t  = boundedBy(0, n <= fadeRate/2 ? 4*t_ : 1-t_, 0.5);\n  ctx.fillStyle = rgb(17+t*(226-17),17+t*(0-17),17+t*(116-17));\n  for (var y = 0; y < height; y++) {\n    for (var x = 0; x < width; x++) {\n      const idx = getIndex(x,y);\n      if (cells[idx] !== ALIVE) {\n        continue;\n      }\n      drawHexagon(x,y);\n    }\n  }\n};\n\nconst playPauseButton = document.getElementById(\"play-pause\");\n\nconst isPaused = () => {\n  return animationId === null;\n};\n\nconst play = () => {\n  playPauseButton.textContent = \"⏸\";\n  renderLoop();\n};\n\nconst pause = () => {\n  playPauseButton.textContent = \"▶\";\n  cancelAnimationFrame(animationId);\n  animationId = null;\n};\n\nplayPauseButton.addEventListener(\"click\", event => {\n  if (isPaused()) { play(); } else { pause(); }\n});\n\nconst boundedBy = (a,x,b) => Math.min(Math.max(a,x),b);\nconst rgb = (r,g,b) => \"rgb(\"+r+\",\"+g+\",\"+b+\")\";\n\ncanvas.addEventListener(\"click\", event => {\n  const boundingRect = canvas.getBoundingClientRect();\n\n  const mouseX = event.clientX - boundingRect.left;\n  const mouseY = event.clientY - boundingRect.top ;\n  //  drawHexagon(3.3*(x+(y%2)/2)*CELL_SIZE\n  //             ,y*CELL_SIZE);\n  var x  = (mouseX / CELL_SIZE / 1.65);\n  var y  = (mouseY / CELL_SIZE);\n  const shape = \"(\"+Math.floor(x)%2\n              + \",\"+Math.floor(y)%2\n              + \",\"+(0 + (1/3 + (1-(y%1))/3.15 < (x % 1)))\n              + \")\";\n  //console.log(\"shape = \", shape);\n  var x  = Math.floor(mouseX / CELL_SIZE / 3.3);\n  var y  = 2*Math.floor(mouseY / CELL_SIZE/2)+1;\n  switch (shape) {\n    case \"(0,0,0)\":\n          y--;\n          break;\n    case \"(1,0,1)\":\n          x++;\n          y--;\n          break;\n    case \"(0,1,0)\":\n          y++;\n          break;\n    case \"(1,1,1)\":\n          x++;\n          y++;\n          break;\n  }\n\n  //console.log(\"x = \",x,\"y= \",y);\n  universe.toggle_cell(x, y);\n\n  drawCells(slow);\n});\n\nplay();\npause();\n\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./wasm_game_of_life.js":
/*!******************************!*\
  !*** ./wasm_game_of_life.js ***!
  \******************************/
/*! exports provided: __wbg_f_time_time_n, __wbg_f_timeEnd_timeEnd_n, Universe, __wbindgen_object_clone_ref, __wbindgen_object_drop_ref, __wbindgen_string_new, __wbindgen_number_new, __wbindgen_number_get, __wbindgen_undefined_new, __wbindgen_null_new, __wbindgen_is_null, __wbindgen_is_undefined, __wbindgen_boolean_new, __wbindgen_boolean_get, __wbindgen_symbol_new, __wbindgen_is_symbol, __wbindgen_string_get, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_f_time_time_n\", function() { return __wbg_f_time_time_n; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_f_timeEnd_timeEnd_n\", function() { return __wbg_f_timeEnd_timeEnd_n; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Universe\", function() { return Universe; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_object_clone_ref\", function() { return __wbindgen_object_clone_ref; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_object_drop_ref\", function() { return __wbindgen_object_drop_ref; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_string_new\", function() { return __wbindgen_string_new; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_number_new\", function() { return __wbindgen_number_new; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_number_get\", function() { return __wbindgen_number_get; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_undefined_new\", function() { return __wbindgen_undefined_new; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_null_new\", function() { return __wbindgen_null_new; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_is_null\", function() { return __wbindgen_is_null; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_is_undefined\", function() { return __wbindgen_is_undefined; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_boolean_new\", function() { return __wbindgen_boolean_new; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_boolean_get\", function() { return __wbindgen_boolean_get; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_symbol_new\", function() { return __wbindgen_symbol_new; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_is_symbol\", function() { return __wbindgen_is_symbol; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_string_get\", function() { return __wbindgen_string_get; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return __wbindgen_throw; });\n/* harmony import */ var _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wasm_game_of_life_bg.wasm */ \"./wasm_game_of_life_bg.wasm\");\n/* tslint:disable */\n\n\nconst __wbg_f_time_time_n_target = console.time;\n\nconst TextDecoder = typeof self === 'object' && self.TextDecoder\n    ? self.TextDecoder\n    : __webpack_require__(/*! util */ \"./node_modules/util/util.js\").TextDecoder;\n\nlet cachedDecoder = new TextDecoder('utf-8');\n\nlet cachegetUint8Memory = null;\nfunction getUint8Memory() {\n    if (cachegetUint8Memory === null ||\n        cachegetUint8Memory.buffer !== _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer)\n        cachegetUint8Memory = new Uint8Array(_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer);\n    return cachegetUint8Memory;\n}\n\nfunction getStringFromWasm(ptr, len) {\n    return cachedDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));\n}\n\nfunction __wbg_f_time_time_n(arg0, arg1) {\n    let varg0 = getStringFromWasm(arg0, arg1);\n    __wbg_f_time_time_n_target(varg0);\n}\n\nconst __wbg_f_timeEnd_timeEnd_n_target = console.timeEnd;\n\nfunction __wbg_f_timeEnd_timeEnd_n(arg0, arg1) {\n    let varg0 = getStringFromWasm(arg0, arg1);\n    __wbg_f_timeEnd_timeEnd_n_target(varg0);\n}\n\nclass Universe {\n\n                static __construct(ptr) {\n                    return new Universe(ptr);\n                }\n\n                constructor(ptr) {\n                    this.ptr = ptr;\n                }\n\n            free() {\n                const ptr = this.ptr;\n                this.ptr = 0;\n                _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"__wbg_universe_free\"](ptr);\n            }\n        static new(arg0, arg1) {\n    return Universe.__construct(_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"universe_new\"](arg0, arg1));\n}\nwidth() {\n    return _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"universe_width\"](this.ptr);\n}\nheight() {\n    return _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"universe_height\"](this.ptr);\n}\ncells() {\n    return _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"universe_cells\"](this.ptr);\n}\ntick() {\n    return _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"universe_tick\"](this.ptr);\n}\ntoggle_cell(arg0, arg1) {\n    return _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"universe_toggle_cell\"](this.ptr, arg0, arg1);\n}\n}\n\nlet slab = [];\n\nlet slab_next = 0;\n\nfunction addHeapObject(obj) {\n    if (slab_next === slab.length)\n        slab.push(slab.length + 1);\n    const idx = slab_next;\n    const next = slab[idx];\n\n    slab_next = next;\n\n    slab[idx] = { obj, cnt: 1 };\n    return idx << 1;\n}\n\nlet stack = [];\n\nfunction getObject(idx) {\n    if ((idx & 1) === 1) {\n        return stack[idx >> 1];\n    } else {\n        const val = slab[idx >> 1];\n\n    return val.obj;\n\n    }\n}\n\nfunction __wbindgen_object_clone_ref(idx) {\n    // If this object is on the stack promote it to the heap.\n    if ((idx & 1) === 1)\n        return addHeapObject(getObject(idx));\n\n    // Otherwise if the object is on the heap just bump the\n    // refcount and move on\n    const val = slab[idx >> 1];\n    val.cnt += 1;\n    return idx;\n}\n\nfunction dropRef(idx) {\n\n    let obj = slab[idx >> 1];\n\n    obj.cnt -= 1;\n    if (obj.cnt > 0)\n        return;\n\n    // If we hit 0 then free up our space in the slab\n    slab[idx >> 1] = slab_next;\n    slab_next = idx >> 1;\n}\n\nfunction __wbindgen_object_drop_ref(i) { dropRef(i); }\n\nfunction __wbindgen_string_new(p, l) {\n    return addHeapObject(getStringFromWasm(p, l));\n}\n\nfunction __wbindgen_number_new(i) { return addHeapObject(i); }\n\nfunction __wbindgen_number_get(n, invalid) {\n    let obj = getObject(n);\n    if (typeof(obj) === 'number')\n        return obj;\n    getUint8Memory()[invalid] = 1;\n    return 0;\n}\n\nfunction __wbindgen_undefined_new() { return addHeapObject(undefined); }\n\nfunction __wbindgen_null_new() {\n    return addHeapObject(null);\n}\n\nfunction __wbindgen_is_null(idx) {\n    return getObject(idx) === null ? 1 : 0;\n}\n\nfunction __wbindgen_is_undefined(idx) {\n    return getObject(idx) === undefined ? 1 : 0;\n}\n\nfunction __wbindgen_boolean_new(v) {\n    return addHeapObject(v === 1);\n}\n\nfunction __wbindgen_boolean_get(i) {\n    let v = getObject(i);\n    if (typeof(v) === 'boolean') {\n        return v ? 1 : 0;\n    } else {\n        return 2;\n    }\n}\n\nfunction __wbindgen_symbol_new(ptr, len) {\n    let a;\n    if (ptr === 0) {\n        a = Symbol();\n    } else {\n        a = Symbol(getStringFromWasm(ptr, len));\n    }\n    return addHeapObject(a);\n}\n\nfunction __wbindgen_is_symbol(i) {\n    return typeof(getObject(i)) === 'symbol' ? 1 : 0;\n}\n\nconst TextEncoder = typeof self === 'object' && self.TextEncoder\n    ? self.TextEncoder\n    : __webpack_require__(/*! util */ \"./node_modules/util/util.js\").TextEncoder;\n\nlet cachedEncoder = new TextEncoder('utf-8');\n\nfunction passStringToWasm(arg) {\n\n    const buf = cachedEncoder.encode(arg);\n    const ptr = _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"__wbindgen_malloc\"](buf.length);\n    getUint8Memory().set(buf, ptr);\n    return [ptr, buf.length];\n}\n\nlet cachegetUint32Memory = null;\nfunction getUint32Memory() {\n    if (cachegetUint32Memory === null ||\n        cachegetUint32Memory.buffer !== _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer)\n        cachegetUint32Memory = new Uint32Array(_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer);\n    return cachegetUint32Memory;\n}\n\nfunction __wbindgen_string_get(i, len_ptr) {\n    let obj = getObject(i);\n    if (typeof(obj) !== 'string')\n        return 0;\n    const [ptr, len] = passStringToWasm(obj);\n    getUint32Memory()[len_ptr / 4] = len;\n    return ptr;\n}\n\nfunction __wbindgen_throw(ptr, len) {\n    throw new Error(getStringFromWasm(ptr, len));\n}\n\n\n\n//# sourceURL=webpack:///./wasm_game_of_life.js?");

/***/ }),

/***/ "./wasm_game_of_life_bg.wasm":
/*!***********************************!*\
  !*** ./wasm_game_of_life_bg.wasm ***!
  \***********************************/
/*! exports provided: memory, __wbg_universe_free, universe_new, universe_width, universe_height, universe_cells, universe_tick, universe_toggle_cell, __wbindgen_malloc */
/***/ (function(module, exports, __webpack_require__) {

eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.i];\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name != \"__webpack_init__\") exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n__webpack_require__(/*! ./wasm_game_of_life */ \"./wasm_game_of_life.js\");\n// exec wasm module\nwasmExports[\"__webpack_init__\"]()\n\n//# sourceURL=webpack:///./wasm_game_of_life_bg.wasm?");

/***/ })

}]);
