function _mergeNamespaces(n2, m2) {
  for (var i2 = 0; i2 < m2.length; i2++) {
    const e2 = m2[i2];
    if (typeof e2 !== "string" && !Array.isArray(e2)) {
      for (const k2 in e2) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d2 = Object.getOwnPropertyDescriptor(e2, k2);
          if (d2) {
            Object.defineProperty(n2, k2, d2.get ? d2 : {
              enumerable: true,
              get: () => e2[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link2 of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link2);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link2) {
    const fetchOpts = {};
    if (link2.integrity)
      fetchOpts.integrity = link2.integrity;
    if (link2.referrerPolicy)
      fetchOpts.referrerPolicy = link2.referrerPolicy;
    if (link2.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link2.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link2) {
    if (link2.ep)
      return;
    link2.ep = true;
    const fetchOpts = getFetchOpts(link2);
    fetch(link2.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime$1 = { exports: {} };
var reactJsxRuntime_production_min$1 = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$9 = Symbol.for("react.element"), n$b = Symbol.for("react.portal"), p$c = Symbol.for("react.fragment"), q$b = Symbol.for("react.strict_mode"), r$8 = Symbol.for("react.profiler"), t$a = Symbol.for("react.provider"), u$8 = Symbol.for("react.context"), v$9 = Symbol.for("react.forward_ref"), w$6 = Symbol.for("react.suspense"), x$4 = Symbol.for("react.memo"), y$4 = Symbol.for("react.lazy"), z$5 = Symbol.iterator;
function A$5(a2) {
  if (null === a2 || "object" !== typeof a2)
    return null;
  a2 = z$5 && a2[z$5] || a2["@@iterator"];
  return "function" === typeof a2 ? a2 : null;
}
var B$3 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$3 = {};
function E$3(a2, b2, e2) {
  this.props = a2;
  this.context = b2;
  this.refs = D$3;
  this.updater = e2 || B$3;
}
E$3.prototype.isReactComponent = {};
E$3.prototype.setState = function(a2, b2) {
  if ("object" !== typeof a2 && "function" !== typeof a2 && null != a2)
    throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a2, b2, "setState");
};
E$3.prototype.forceUpdate = function(a2) {
  this.updater.enqueueForceUpdate(this, a2, "forceUpdate");
};
function F$2() {
}
F$2.prototype = E$3.prototype;
function G$3(a2, b2, e2) {
  this.props = a2;
  this.context = b2;
  this.refs = D$3;
  this.updater = e2 || B$3;
}
var H$3 = G$3.prototype = new F$2();
H$3.constructor = G$3;
C$1(H$3, E$3.prototype);
H$3.isPureReactComponent = true;
var I$3 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$3 = { key: true, ref: true, __self: true, __source: true };
function M$3(a2, b2, e2) {
  var d2, c6 = {}, k2 = null, h2 = null;
  if (null != b2)
    for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2)
      J.call(b2, d2) && !L$3.hasOwnProperty(d2) && (c6[d2] = b2[d2]);
  var g2 = arguments.length - 2;
  if (1 === g2)
    c6.children = e2;
  else if (1 < g2) {
    for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++)
      f2[m2] = arguments[m2 + 2];
    c6.children = f2;
  }
  if (a2 && a2.defaultProps)
    for (d2 in g2 = a2.defaultProps, g2)
      void 0 === c6[d2] && (c6[d2] = g2[d2]);
  return { $$typeof: l$9, type: a2, key: k2, ref: h2, props: c6, _owner: K$1.current };
}
function N$3(a2, b2) {
  return { $$typeof: l$9, type: a2.type, key: b2, ref: a2.ref, props: a2.props, _owner: a2._owner };
}
function O$3(a2) {
  return "object" === typeof a2 && null !== a2 && a2.$$typeof === l$9;
}
function escape(a2) {
  var b2 = { "=": "=0", ":": "=2" };
  return "$" + a2.replace(/[=:]/g, function(a3) {
    return b2[a3];
  });
}
var P$3 = /\/+/g;
function Q$3(a2, b2) {
  return "object" === typeof a2 && null !== a2 && null != a2.key ? escape("" + a2.key) : b2.toString(36);
}
function R$3(a2, b2, e2, d2, c6) {
  var k2 = typeof a2;
  if ("undefined" === k2 || "boolean" === k2)
    a2 = null;
  var h2 = false;
  if (null === a2)
    h2 = true;
  else
    switch (k2) {
      case "string":
      case "number":
        h2 = true;
        break;
      case "object":
        switch (a2.$$typeof) {
          case l$9:
          case n$b:
            h2 = true;
        }
    }
  if (h2)
    return h2 = a2, c6 = c6(h2), a2 = "" === d2 ? "." + Q$3(h2, 0) : d2, I$3(c6) ? (e2 = "", null != a2 && (e2 = a2.replace(P$3, "$&/") + "/"), R$3(c6, b2, e2, "", function(a3) {
      return a3;
    })) : null != c6 && (O$3(c6) && (c6 = N$3(c6, e2 + (!c6.key || h2 && h2.key === c6.key ? "" : ("" + c6.key).replace(P$3, "$&/") + "/") + a2)), b2.push(c6)), 1;
  h2 = 0;
  d2 = "" === d2 ? "." : d2 + ":";
  if (I$3(a2))
    for (var g2 = 0; g2 < a2.length; g2++) {
      k2 = a2[g2];
      var f2 = d2 + Q$3(k2, g2);
      h2 += R$3(k2, b2, e2, f2, c6);
    }
  else if (f2 = A$5(a2), "function" === typeof f2)
    for (a2 = f2.call(a2), g2 = 0; !(k2 = a2.next()).done; )
      k2 = k2.value, f2 = d2 + Q$3(k2, g2++), h2 += R$3(k2, b2, e2, f2, c6);
  else if ("object" === k2)
    throw b2 = String(a2), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a2).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
  return h2;
}
function S$3(a2, b2, e2) {
  if (null == a2)
    return a2;
  var d2 = [], c6 = 0;
  R$3(a2, d2, "", "", function(a3) {
    return b2.call(e2, a3, c6++);
  });
  return d2;
}
function T$1(a2) {
  if (-1 === a2._status) {
    var b2 = a2._result;
    b2 = b2();
    b2.then(function(b3) {
      if (0 === a2._status || -1 === a2._status)
        a2._status = 1, a2._result = b3;
    }, function(b3) {
      if (0 === a2._status || -1 === a2._status)
        a2._status = 2, a2._result = b3;
    });
    -1 === a2._status && (a2._status = 0, a2._result = b2);
  }
  if (1 === a2._status)
    return a2._result.default;
  throw a2._result;
}
var U$3 = { current: null }, V$1 = { transition: null }, W$3 = { ReactCurrentDispatcher: U$3, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
react_production_min.Children = { map: S$3, forEach: function(a2, b2, e2) {
  S$3(a2, function() {
    b2.apply(this, arguments);
  }, e2);
}, count: function(a2) {
  var b2 = 0;
  S$3(a2, function() {
    b2++;
  });
  return b2;
}, toArray: function(a2) {
  return S$3(a2, function(a3) {
    return a3;
  }) || [];
}, only: function(a2) {
  if (!O$3(a2))
    throw Error("React.Children.only expected to receive a single React element child.");
  return a2;
} };
react_production_min.Component = E$3;
react_production_min.Fragment = p$c;
react_production_min.Profiler = r$8;
react_production_min.PureComponent = G$3;
react_production_min.StrictMode = q$b;
react_production_min.Suspense = w$6;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$3;
react_production_min.cloneElement = function(a2, b2, e2) {
  if (null === a2 || void 0 === a2)
    throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a2 + ".");
  var d2 = C$1({}, a2.props), c6 = a2.key, k2 = a2.ref, h2 = a2._owner;
  if (null != b2) {
    void 0 !== b2.ref && (k2 = b2.ref, h2 = K$1.current);
    void 0 !== b2.key && (c6 = "" + b2.key);
    if (a2.type && a2.type.defaultProps)
      var g2 = a2.type.defaultProps;
    for (f2 in b2)
      J.call(b2, f2) && !L$3.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2)
    d2.children = e2;
  else if (1 < f2) {
    g2 = Array(f2);
    for (var m2 = 0; m2 < f2; m2++)
      g2[m2] = arguments[m2 + 2];
    d2.children = g2;
  }
  return { $$typeof: l$9, type: a2.type, key: c6, ref: k2, props: d2, _owner: h2 };
};
react_production_min.createContext = function(a2) {
  a2 = { $$typeof: u$8, _currentValue: a2, _currentValue2: a2, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a2.Provider = { $$typeof: t$a, _context: a2 };
  return a2.Consumer = a2;
};
react_production_min.createElement = M$3;
react_production_min.createFactory = function(a2) {
  var b2 = M$3.bind(null, a2);
  b2.type = a2;
  return b2;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a2) {
  return { $$typeof: v$9, render: a2 };
};
react_production_min.isValidElement = O$3;
react_production_min.lazy = function(a2) {
  return { $$typeof: y$4, _payload: { _status: -1, _result: a2 }, _init: T$1 };
};
react_production_min.memo = function(a2, b2) {
  return { $$typeof: x$4, type: a2, compare: void 0 === b2 ? null : b2 };
};
react_production_min.startTransition = function(a2) {
  var b2 = V$1.transition;
  V$1.transition = {};
  try {
    a2();
  } finally {
    V$1.transition = b2;
  }
};
react_production_min.unstable_act = function() {
  throw Error("act(...) is not supported in production builds of React.");
};
react_production_min.useCallback = function(a2, b2) {
  return U$3.current.useCallback(a2, b2);
};
react_production_min.useContext = function(a2) {
  return U$3.current.useContext(a2);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a2) {
  return U$3.current.useDeferredValue(a2);
};
react_production_min.useEffect = function(a2, b2) {
  return U$3.current.useEffect(a2, b2);
};
react_production_min.useId = function() {
  return U$3.current.useId();
};
react_production_min.useImperativeHandle = function(a2, b2, e2) {
  return U$3.current.useImperativeHandle(a2, b2, e2);
};
react_production_min.useInsertionEffect = function(a2, b2) {
  return U$3.current.useInsertionEffect(a2, b2);
};
react_production_min.useLayoutEffect = function(a2, b2) {
  return U$3.current.useLayoutEffect(a2, b2);
};
react_production_min.useMemo = function(a2, b2) {
  return U$3.current.useMemo(a2, b2);
};
react_production_min.useReducer = function(a2, b2, e2) {
  return U$3.current.useReducer(a2, b2, e2);
};
react_production_min.useRef = function(a2) {
  return U$3.current.useRef(a2);
};
react_production_min.useState = function(a2) {
  return U$3.current.useState(a2);
};
react_production_min.useSyncExternalStore = function(a2, b2, e2) {
  return U$3.current.useSyncExternalStore(a2, b2, e2);
};
react_production_min.useTransition = function() {
  return U$3.current.useTransition();
};
react_production_min.version = "18.2.0";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React
}, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$6 = reactExports, k$8 = Symbol.for("react.element"), l$8 = Symbol.for("react.fragment"), m$9 = Object.prototype.hasOwnProperty, n$a = f$6.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$b = { key: true, ref: true, __self: true, __source: true };
function q$a(c6, a2, g2) {
  var b2, d2 = {}, e2 = null, h2 = null;
  void 0 !== g2 && (e2 = "" + g2);
  void 0 !== a2.key && (e2 = "" + a2.key);
  void 0 !== a2.ref && (h2 = a2.ref);
  for (b2 in a2)
    m$9.call(a2, b2) && !p$b.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
  if (c6 && c6.defaultProps)
    for (b2 in a2 = c6.defaultProps, a2)
      void 0 === d2[b2] && (d2[b2] = a2[b2]);
  return { $$typeof: k$8, type: c6, key: e2, ref: h2, props: d2, _owner: n$a.current };
}
reactJsxRuntime_production_min$1.Fragment = l$8;
reactJsxRuntime_production_min$1.jsx = q$a;
reactJsxRuntime_production_min$1.jsxs = q$a;
{
  jsxRuntime$1.exports = reactJsxRuntime_production_min$1;
}
var jsxRuntimeExports$1 = jsxRuntime$1.exports;
const Fragment = jsxRuntimeExports$1.Fragment;
const jsx = jsxRuntimeExports$1.jsx;
const jsxs = jsxRuntimeExports$1.jsxs;
const style = "";
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a2, b2) {
    var c6 = a2.length;
    a2.push(b2);
    a:
      for (; 0 < c6; ) {
        var d2 = c6 - 1 >>> 1, e2 = a2[d2];
        if (0 < g2(e2, b2))
          a2[d2] = b2, a2[c6] = e2, c6 = d2;
        else
          break a;
      }
  }
  function h2(a2) {
    return 0 === a2.length ? null : a2[0];
  }
  function k2(a2) {
    if (0 === a2.length)
      return null;
    var b2 = a2[0], c6 = a2.pop();
    if (c6 !== b2) {
      a2[0] = c6;
      a:
        for (var d2 = 0, e2 = a2.length, w2 = e2 >>> 1; d2 < w2; ) {
          var m2 = 2 * (d2 + 1) - 1, C2 = a2[m2], n2 = m2 + 1, x2 = a2[n2];
          if (0 > g2(C2, c6))
            n2 < e2 && 0 > g2(x2, C2) ? (a2[d2] = x2, a2[n2] = c6, d2 = n2) : (a2[d2] = C2, a2[m2] = c6, d2 = m2);
          else if (n2 < e2 && 0 > g2(x2, c6))
            a2[d2] = x2, a2[n2] = c6, d2 = n2;
          else
            break a;
        }
    }
    return b2;
  }
  function g2(a2, b2) {
    var c6 = a2.sortIndex - b2.sortIndex;
    return 0 !== c6 ? c6 : a2.id - b2.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a2) {
    for (var b2 = h2(t2); null !== b2; ) {
      if (null === b2.callback)
        k2(t2);
      else if (b2.startTime <= a2)
        k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
      else
        break;
      b2 = h2(t2);
    }
  }
  function H2(a2) {
    B2 = false;
    G2(a2);
    if (!A2)
      if (null !== h2(r2))
        A2 = true, I2(J2);
      else {
        var b2 = h2(t2);
        null !== b2 && K2(H2, b2.startTime - a2);
      }
  }
  function J2(a2, b2) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c6 = y2;
    try {
      G2(b2);
      for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b2) || a2 && !M2()); ) {
        var d2 = v2.callback;
        if ("function" === typeof d2) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e2 = d2(v2.expirationTime <= b2);
          b2 = exports.unstable_now();
          "function" === typeof e2 ? v2.callback = e2 : v2 === h2(r2) && k2(r2);
          G2(b2);
        } else
          k2(r2);
        v2 = h2(r2);
      }
      if (null !== v2)
        var w2 = true;
      else {
        var m2 = h2(t2);
        null !== m2 && K2(H2, m2.startTime - b2);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c6, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a2 = exports.unstable_now();
      Q2 = a2;
      var b2 = true;
      try {
        b2 = O2(true, a2);
      } finally {
        b2 ? S2() : (N2 = false, O2 = null);
      }
    } else
      N2 = false;
  }
  var S2;
  if ("function" === typeof F2)
    S2 = function() {
      F2(R2);
    };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else
    S2 = function() {
      D2(R2, 0);
    };
  function I2(a2) {
    O2 = a2;
    N2 || (N2 = true, S2());
  }
  function K2(a2, b2) {
    L2 = D2(function() {
      a2(exports.unstable_now());
    }, b2);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a2) {
    a2.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a2) {
    0 > a2 || 125 < a2 ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a2 ? Math.floor(1e3 / a2) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h2(r2);
  };
  exports.unstable_next = function(a2) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b2 = 3;
        break;
      default:
        b2 = y2;
    }
    var c6 = y2;
    y2 = b2;
    try {
      return a2();
    } finally {
      y2 = c6;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a2, b2) {
    switch (a2) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a2 = 3;
    }
    var c6 = y2;
    y2 = a2;
    try {
      return b2();
    } finally {
      y2 = c6;
    }
  };
  exports.unstable_scheduleCallback = function(a2, b2, c6) {
    var d2 = exports.unstable_now();
    "object" === typeof c6 && null !== c6 ? (c6 = c6.delay, c6 = "number" === typeof c6 && 0 < c6 ? d2 + c6 : d2) : c6 = d2;
    switch (a2) {
      case 1:
        var e2 = -1;
        break;
      case 2:
        e2 = 250;
        break;
      case 5:
        e2 = 1073741823;
        break;
      case 4:
        e2 = 1e4;
        break;
      default:
        e2 = 5e3;
    }
    e2 = c6 + e2;
    a2 = { id: u2++, callback: b2, priorityLevel: a2, startTime: c6, expirationTime: e2, sortIndex: -1 };
    c6 > d2 ? (a2.sortIndex = c6, f2(t2, a2), null === h2(r2) && a2 === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c6 - d2))) : (a2.sortIndex = e2, f2(r2, a2), A2 || z2 || (A2 = true, I2(J2)));
    return a2;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a2) {
    var b2 = y2;
    return function() {
      var c6 = y2;
      y2 = b2;
      try {
        return a2.apply(this, arguments);
      } finally {
        y2 = c6;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p$a(a2) {
  for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a2, c6 = 1; c6 < arguments.length; c6++)
    b2 += "&args[]=" + encodeURIComponent(arguments[c6]);
  return "Minified React error #" + a2 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a2, b2) {
  ha(a2, b2);
  ha(a2 + "Capture", b2);
}
function ha(a2, b2) {
  ea[a2] = b2;
  for (a2 = 0; a2 < b2.length; a2++)
    da.add(b2[a2]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a2) {
  if (ja.call(ma, a2))
    return true;
  if (ja.call(la, a2))
    return false;
  if (ka.test(a2))
    return ma[a2] = true;
  la[a2] = true;
  return false;
}
function pa(a2, b2, c6, d2) {
  if (null !== c6 && 0 === c6.type)
    return false;
  switch (typeof b2) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d2)
        return false;
      if (null !== c6)
        return !c6.acceptsBooleans;
      a2 = a2.toLowerCase().slice(0, 5);
      return "data-" !== a2 && "aria-" !== a2;
    default:
      return false;
  }
}
function qa(a2, b2, c6, d2) {
  if (null === b2 || "undefined" === typeof b2 || pa(a2, b2, c6, d2))
    return true;
  if (d2)
    return false;
  if (null !== c6)
    switch (c6.type) {
      case 3:
        return !b2;
      case 4:
        return false === b2;
      case 5:
        return isNaN(b2);
      case 6:
        return isNaN(b2) || 1 > b2;
    }
  return false;
}
function v$8(a2, b2, c6, d2, e2, f2, g2) {
  this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
  this.attributeName = d2;
  this.attributeNamespace = e2;
  this.mustUseProperty = c6;
  this.propertyName = a2;
  this.type = b2;
  this.sanitizeURL = f2;
  this.removeEmptyString = g2;
}
var z$4 = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a2) {
  z$4[a2] = new v$8(a2, 0, false, a2, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a2) {
  var b2 = a2[0];
  z$4[b2] = new v$8(b2, 1, false, a2[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 2, false, a2.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 2, false, a2, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a2) {
  z$4[a2] = new v$8(a2, 3, false, a2.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 3, true, a2, null, false, false);
});
["capture", "download"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 4, false, a2, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 6, false, a2, null, false, false);
});
["rowSpan", "start"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 5, false, a2.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a2) {
  return a2[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a2) {
  var b2 = a2.replace(
    ra,
    sa
  );
  z$4[b2] = new v$8(b2, 1, false, a2, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a2) {
  var b2 = a2.replace(ra, sa);
  z$4[b2] = new v$8(b2, 1, false, a2, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a2) {
  var b2 = a2.replace(ra, sa);
  z$4[b2] = new v$8(b2, 1, false, a2, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 1, false, a2.toLowerCase(), null, false, false);
});
z$4.xlinkHref = new v$8("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a2) {
  z$4[a2] = new v$8(a2, 1, false, a2.toLowerCase(), null, true, true);
});
function ta(a2, b2, c6, d2) {
  var e2 = z$4.hasOwnProperty(b2) ? z$4[b2] : null;
  if (null !== e2 ? 0 !== e2.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1])
    qa(b2, c6, e2, d2) && (c6 = null), d2 || null === e2 ? oa(b2) && (null === c6 ? a2.removeAttribute(b2) : a2.setAttribute(b2, "" + c6)) : e2.mustUseProperty ? a2[e2.propertyName] = null === c6 ? 3 === e2.type ? false : "" : c6 : (b2 = e2.attributeName, d2 = e2.attributeNamespace, null === c6 ? a2.removeAttribute(b2) : (e2 = e2.type, c6 = 3 === e2 || 4 === e2 && true === c6 ? "" : "" + c6, d2 ? a2.setAttributeNS(d2, b2, c6) : a2.setAttribute(b2, c6)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a2) {
  if (null === a2 || "object" !== typeof a2)
    return null;
  a2 = Ja && a2[Ja] || a2["@@iterator"];
  return "function" === typeof a2 ? a2 : null;
}
var A$4 = Object.assign, La;
function Ma(a2) {
  if (void 0 === La)
    try {
      throw Error();
    } catch (c6) {
      var b2 = c6.stack.trim().match(/\n( *(at )?)/);
      La = b2 && b2[1] || "";
    }
  return "\n" + La + a2;
}
var Na = false;
function Oa(a2, b2) {
  if (!a2 || Na)
    return "";
  Na = true;
  var c6 = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b2)
      if (b2 = function() {
        throw Error();
      }, Object.defineProperty(b2.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b2, []);
        } catch (l2) {
          var d2 = l2;
        }
        Reflect.construct(a2, [], b2);
      } else {
        try {
          b2.call();
        } catch (l2) {
          d2 = l2;
        }
        a2.call(b2.prototype);
      }
    else {
      try {
        throw Error();
      } catch (l2) {
        d2 = l2;
      }
      a2();
    }
  } catch (l2) {
    if (l2 && d2 && "string" === typeof l2.stack) {
      for (var e2 = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e2.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e2[g2] !== f2[h2]; )
        h2--;
      for (; 1 <= g2 && 0 <= h2; g2--, h2--)
        if (e2[g2] !== f2[h2]) {
          if (1 !== g2 || 1 !== h2) {
            do
              if (g2--, h2--, 0 > h2 || e2[g2] !== f2[h2]) {
                var k2 = "\n" + e2[g2].replace(" at new ", " at ");
                a2.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a2.displayName));
                return k2;
              }
            while (1 <= g2 && 0 <= h2);
          }
          break;
        }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c6;
  }
  return (a2 = a2 ? a2.displayName || a2.name : "") ? Ma(a2) : "";
}
function Pa(a2) {
  switch (a2.tag) {
    case 5:
      return Ma(a2.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a2 = Oa(a2.type, false), a2;
    case 11:
      return a2 = Oa(a2.type.render, false), a2;
    case 1:
      return a2 = Oa(a2.type, true), a2;
    default:
      return "";
  }
}
function Qa(a2) {
  if (null == a2)
    return null;
  if ("function" === typeof a2)
    return a2.displayName || a2.name || null;
  if ("string" === typeof a2)
    return a2;
  switch (a2) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a2)
    switch (a2.$$typeof) {
      case Ca:
        return (a2.displayName || "Context") + ".Consumer";
      case Ba:
        return (a2._context.displayName || "Context") + ".Provider";
      case Da:
        var b2 = a2.render;
        a2 = a2.displayName;
        a2 || (a2 = b2.displayName || b2.name || "", a2 = "" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
        return a2;
      case Ga:
        return b2 = a2.displayName || null, null !== b2 ? b2 : Qa(a2.type) || "Memo";
      case Ha:
        b2 = a2._payload;
        a2 = a2._init;
        try {
          return Qa(a2(b2));
        } catch (c6) {
        }
    }
  return null;
}
function Ra(a2) {
  var b2 = a2.type;
  switch (a2.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b2.displayName || "Context") + ".Consumer";
    case 10:
      return (b2._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a2 = b2.render, a2 = a2.displayName || a2.name || "", b2.displayName || ("" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b2;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b2);
    case 8:
      return b2 === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b2)
        return b2.displayName || b2.name || null;
      if ("string" === typeof b2)
        return b2;
  }
  return null;
}
function Sa(a2) {
  switch (typeof a2) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a2;
    case "object":
      return a2;
    default:
      return "";
  }
}
function Ta(a2) {
  var b2 = a2.type;
  return (a2 = a2.nodeName) && "input" === a2.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
}
function Ua(a2) {
  var b2 = Ta(a2) ? "checked" : "value", c6 = Object.getOwnPropertyDescriptor(a2.constructor.prototype, b2), d2 = "" + a2[b2];
  if (!a2.hasOwnProperty(b2) && "undefined" !== typeof c6 && "function" === typeof c6.get && "function" === typeof c6.set) {
    var e2 = c6.get, f2 = c6.set;
    Object.defineProperty(a2, b2, { configurable: true, get: function() {
      return e2.call(this);
    }, set: function(a3) {
      d2 = "" + a3;
      f2.call(this, a3);
    } });
    Object.defineProperty(a2, b2, { enumerable: c6.enumerable });
    return { getValue: function() {
      return d2;
    }, setValue: function(a3) {
      d2 = "" + a3;
    }, stopTracking: function() {
      a2._valueTracker = null;
      delete a2[b2];
    } };
  }
}
function Va(a2) {
  a2._valueTracker || (a2._valueTracker = Ua(a2));
}
function Wa(a2) {
  if (!a2)
    return false;
  var b2 = a2._valueTracker;
  if (!b2)
    return true;
  var c6 = b2.getValue();
  var d2 = "";
  a2 && (d2 = Ta(a2) ? a2.checked ? "true" : "false" : a2.value);
  a2 = d2;
  return a2 !== c6 ? (b2.setValue(a2), true) : false;
}
function Xa(a2) {
  a2 = a2 || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a2)
    return null;
  try {
    return a2.activeElement || a2.body;
  } catch (b2) {
    return a2.body;
  }
}
function Ya(a2, b2) {
  var c6 = b2.checked;
  return A$4({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c6 ? c6 : a2._wrapperState.initialChecked });
}
function Za(a2, b2) {
  var c6 = null == b2.defaultValue ? "" : b2.defaultValue, d2 = null != b2.checked ? b2.checked : b2.defaultChecked;
  c6 = Sa(null != b2.value ? b2.value : c6);
  a2._wrapperState = { initialChecked: d2, initialValue: c6, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
}
function ab(a2, b2) {
  b2 = b2.checked;
  null != b2 && ta(a2, "checked", b2, false);
}
function bb(a2, b2) {
  ab(a2, b2);
  var c6 = Sa(b2.value), d2 = b2.type;
  if (null != c6)
    if ("number" === d2) {
      if (0 === c6 && "" === a2.value || a2.value != c6)
        a2.value = "" + c6;
    } else
      a2.value !== "" + c6 && (a2.value = "" + c6);
  else if ("submit" === d2 || "reset" === d2) {
    a2.removeAttribute("value");
    return;
  }
  b2.hasOwnProperty("value") ? cb(a2, b2.type, c6) : b2.hasOwnProperty("defaultValue") && cb(a2, b2.type, Sa(b2.defaultValue));
  null == b2.checked && null != b2.defaultChecked && (a2.defaultChecked = !!b2.defaultChecked);
}
function db(a2, b2, c6) {
  if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
    var d2 = b2.type;
    if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value))
      return;
    b2 = "" + a2._wrapperState.initialValue;
    c6 || b2 === a2.value || (a2.value = b2);
    a2.defaultValue = b2;
  }
  c6 = a2.name;
  "" !== c6 && (a2.name = "");
  a2.defaultChecked = !!a2._wrapperState.initialChecked;
  "" !== c6 && (a2.name = c6);
}
function cb(a2, b2, c6) {
  if ("number" !== b2 || Xa(a2.ownerDocument) !== a2)
    null == c6 ? a2.defaultValue = "" + a2._wrapperState.initialValue : a2.defaultValue !== "" + c6 && (a2.defaultValue = "" + c6);
}
var eb = Array.isArray;
function fb(a2, b2, c6, d2) {
  a2 = a2.options;
  if (b2) {
    b2 = {};
    for (var e2 = 0; e2 < c6.length; e2++)
      b2["$" + c6[e2]] = true;
    for (c6 = 0; c6 < a2.length; c6++)
      e2 = b2.hasOwnProperty("$" + a2[c6].value), a2[c6].selected !== e2 && (a2[c6].selected = e2), e2 && d2 && (a2[c6].defaultSelected = true);
  } else {
    c6 = "" + Sa(c6);
    b2 = null;
    for (e2 = 0; e2 < a2.length; e2++) {
      if (a2[e2].value === c6) {
        a2[e2].selected = true;
        d2 && (a2[e2].defaultSelected = true);
        return;
      }
      null !== b2 || a2[e2].disabled || (b2 = a2[e2]);
    }
    null !== b2 && (b2.selected = true);
  }
}
function gb(a2, b2) {
  if (null != b2.dangerouslySetInnerHTML)
    throw Error(p$a(91));
  return A$4({}, b2, { value: void 0, defaultValue: void 0, children: "" + a2._wrapperState.initialValue });
}
function hb(a2, b2) {
  var c6 = b2.value;
  if (null == c6) {
    c6 = b2.children;
    b2 = b2.defaultValue;
    if (null != c6) {
      if (null != b2)
        throw Error(p$a(92));
      if (eb(c6)) {
        if (1 < c6.length)
          throw Error(p$a(93));
        c6 = c6[0];
      }
      b2 = c6;
    }
    null == b2 && (b2 = "");
    c6 = b2;
  }
  a2._wrapperState = { initialValue: Sa(c6) };
}
function ib(a2, b2) {
  var c6 = Sa(b2.value), d2 = Sa(b2.defaultValue);
  null != c6 && (c6 = "" + c6, c6 !== a2.value && (a2.value = c6), null == b2.defaultValue && a2.defaultValue !== c6 && (a2.defaultValue = c6));
  null != d2 && (a2.defaultValue = "" + d2);
}
function jb(a2) {
  var b2 = a2.textContent;
  b2 === a2._wrapperState.initialValue && "" !== b2 && null !== b2 && (a2.value = b2);
}
function kb(a2) {
  switch (a2) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a2, b2) {
  return null == a2 || "http://www.w3.org/1999/xhtml" === a2 ? kb(b2) : "http://www.w3.org/2000/svg" === a2 && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a2;
}
var mb, nb = function(a2) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c6, d2, e2) {
    MSApp.execUnsafeLocalFunction(function() {
      return a2(b2, c6, d2, e2);
    });
  } : a2;
}(function(a2, b2) {
  if ("http://www.w3.org/2000/svg" !== a2.namespaceURI || "innerHTML" in a2)
    a2.innerHTML = b2;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
    for (b2 = mb.firstChild; a2.firstChild; )
      a2.removeChild(a2.firstChild);
    for (; b2.firstChild; )
      a2.appendChild(b2.firstChild);
  }
});
function ob(a2, b2) {
  if (b2) {
    var c6 = a2.firstChild;
    if (c6 && c6 === a2.lastChild && 3 === c6.nodeType) {
      c6.nodeValue = b2;
      return;
    }
  }
  a2.textContent = b2;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a2) {
  qb.forEach(function(b2) {
    b2 = b2 + a2.charAt(0).toUpperCase() + a2.substring(1);
    pb[b2] = pb[a2];
  });
});
function rb(a2, b2, c6) {
  return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c6 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a2) && pb[a2] ? ("" + b2).trim() : b2 + "px";
}
function sb(a2, b2) {
  a2 = a2.style;
  for (var c6 in b2)
    if (b2.hasOwnProperty(c6)) {
      var d2 = 0 === c6.indexOf("--"), e2 = rb(c6, b2[c6], d2);
      "float" === c6 && (c6 = "cssFloat");
      d2 ? a2.setProperty(c6, e2) : a2[c6] = e2;
    }
}
var tb = A$4({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a2, b2) {
  if (b2) {
    if (tb[a2] && (null != b2.children || null != b2.dangerouslySetInnerHTML))
      throw Error(p$a(137, a2));
    if (null != b2.dangerouslySetInnerHTML) {
      if (null != b2.children)
        throw Error(p$a(60));
      if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML))
        throw Error(p$a(61));
    }
    if (null != b2.style && "object" !== typeof b2.style)
      throw Error(p$a(62));
  }
}
function vb(a2, b2) {
  if (-1 === a2.indexOf("-"))
    return "string" === typeof b2.is;
  switch (a2) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a2) {
  a2 = a2.target || a2.srcElement || window;
  a2.correspondingUseElement && (a2 = a2.correspondingUseElement);
  return 3 === a2.nodeType ? a2.parentNode : a2;
}
var yb = null, zb = null, Ab = null;
function Bb(a2) {
  if (a2 = Cb(a2)) {
    if ("function" !== typeof yb)
      throw Error(p$a(280));
    var b2 = a2.stateNode;
    b2 && (b2 = Db(b2), yb(a2.stateNode, a2.type, b2));
  }
}
function Eb(a2) {
  zb ? Ab ? Ab.push(a2) : Ab = [a2] : zb = a2;
}
function Fb() {
  if (zb) {
    var a2 = zb, b2 = Ab;
    Ab = zb = null;
    Bb(a2);
    if (b2)
      for (a2 = 0; a2 < b2.length; a2++)
        Bb(b2[a2]);
  }
}
function Gb(a2, b2) {
  return a2(b2);
}
function Hb() {
}
var Ib = false;
function Jb(a2, b2, c6) {
  if (Ib)
    return a2(b2, c6);
  Ib = true;
  try {
    return Gb(a2, b2, c6);
  } finally {
    if (Ib = false, null !== zb || null !== Ab)
      Hb(), Fb();
  }
}
function Kb(a2, b2) {
  var c6 = a2.stateNode;
  if (null === c6)
    return null;
  var d2 = Db(c6);
  if (null === d2)
    return null;
  c6 = d2[b2];
  a:
    switch (b2) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d2 = !d2.disabled) || (a2 = a2.type, d2 = !("button" === a2 || "input" === a2 || "select" === a2 || "textarea" === a2));
        a2 = !d2;
        break a;
      default:
        a2 = false;
    }
  if (a2)
    return null;
  if (c6 && "function" !== typeof c6)
    throw Error(p$a(231, b2, typeof c6));
  return c6;
}
var Lb = false;
if (ia)
  try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a2) {
    Lb = false;
  }
function Nb(a2, b2, c6, d2, e2, f2, g2, h2, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b2.apply(c6, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a2) {
  Ob = true;
  Pb = a2;
} };
function Tb(a2, b2, c6, d2, e2, f2, g2, h2, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a2, b2, c6, d2, e2, f2, g2, h2, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else
      throw Error(p$a(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a2) {
  var b2 = a2, c6 = a2;
  if (a2.alternate)
    for (; b2.return; )
      b2 = b2.return;
  else {
    a2 = b2;
    do
      b2 = a2, 0 !== (b2.flags & 4098) && (c6 = b2.return), a2 = b2.return;
    while (a2);
  }
  return 3 === b2.tag ? c6 : null;
}
function Wb(a2) {
  if (13 === a2.tag) {
    var b2 = a2.memoizedState;
    null === b2 && (a2 = a2.alternate, null !== a2 && (b2 = a2.memoizedState));
    if (null !== b2)
      return b2.dehydrated;
  }
  return null;
}
function Xb(a2) {
  if (Vb(a2) !== a2)
    throw Error(p$a(188));
}
function Yb(a2) {
  var b2 = a2.alternate;
  if (!b2) {
    b2 = Vb(a2);
    if (null === b2)
      throw Error(p$a(188));
    return b2 !== a2 ? null : a2;
  }
  for (var c6 = a2, d2 = b2; ; ) {
    var e2 = c6.return;
    if (null === e2)
      break;
    var f2 = e2.alternate;
    if (null === f2) {
      d2 = e2.return;
      if (null !== d2) {
        c6 = d2;
        continue;
      }
      break;
    }
    if (e2.child === f2.child) {
      for (f2 = e2.child; f2; ) {
        if (f2 === c6)
          return Xb(e2), a2;
        if (f2 === d2)
          return Xb(e2), b2;
        f2 = f2.sibling;
      }
      throw Error(p$a(188));
    }
    if (c6.return !== d2.return)
      c6 = e2, d2 = f2;
    else {
      for (var g2 = false, h2 = e2.child; h2; ) {
        if (h2 === c6) {
          g2 = true;
          c6 = e2;
          d2 = f2;
          break;
        }
        if (h2 === d2) {
          g2 = true;
          d2 = e2;
          c6 = f2;
          break;
        }
        h2 = h2.sibling;
      }
      if (!g2) {
        for (h2 = f2.child; h2; ) {
          if (h2 === c6) {
            g2 = true;
            c6 = f2;
            d2 = e2;
            break;
          }
          if (h2 === d2) {
            g2 = true;
            d2 = f2;
            c6 = e2;
            break;
          }
          h2 = h2.sibling;
        }
        if (!g2)
          throw Error(p$a(189));
      }
    }
    if (c6.alternate !== d2)
      throw Error(p$a(190));
  }
  if (3 !== c6.tag)
    throw Error(p$a(188));
  return c6.stateNode.current === c6 ? a2 : b2;
}
function Zb(a2) {
  a2 = Yb(a2);
  return null !== a2 ? $b(a2) : null;
}
function $b(a2) {
  if (5 === a2.tag || 6 === a2.tag)
    return a2;
  for (a2 = a2.child; null !== a2; ) {
    var b2 = $b(a2);
    if (null !== b2)
      return b2;
    a2 = a2.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B$2 = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a2) {
  if (lc && "function" === typeof lc.onCommitFiberRoot)
    try {
      lc.onCommitFiberRoot(kc, a2, void 0, 128 === (a2.current.flags & 128));
    } catch (b2) {
    }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a2) {
  a2 >>>= 0;
  return 0 === a2 ? 32 : 31 - (pc(a2) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a2) {
  switch (a2 & -a2) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a2 & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a2 & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a2;
  }
}
function uc(a2, b2) {
  var c6 = a2.pendingLanes;
  if (0 === c6)
    return 0;
  var d2 = 0, e2 = a2.suspendedLanes, f2 = a2.pingedLanes, g2 = c6 & 268435455;
  if (0 !== g2) {
    var h2 = g2 & ~e2;
    0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
  } else
    g2 = c6 & ~e2, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
  if (0 === d2)
    return 0;
  if (0 !== b2 && b2 !== d2 && 0 === (b2 & e2) && (e2 = d2 & -d2, f2 = b2 & -b2, e2 >= f2 || 16 === e2 && 0 !== (f2 & 4194240)))
    return b2;
  0 !== (d2 & 4) && (d2 |= c6 & 16);
  b2 = a2.entangledLanes;
  if (0 !== b2)
    for (a2 = a2.entanglements, b2 &= d2; 0 < b2; )
      c6 = 31 - oc(b2), e2 = 1 << c6, d2 |= a2[c6], b2 &= ~e2;
  return d2;
}
function vc(a2, b2) {
  switch (a2) {
    case 1:
    case 2:
    case 4:
      return b2 + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b2 + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a2, b2) {
  for (var c6 = a2.suspendedLanes, d2 = a2.pingedLanes, e2 = a2.expirationTimes, f2 = a2.pendingLanes; 0 < f2; ) {
    var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e2[g2];
    if (-1 === k2) {
      if (0 === (h2 & c6) || 0 !== (h2 & d2))
        e2[g2] = vc(h2, b2);
    } else
      k2 <= b2 && (a2.expiredLanes |= h2);
    f2 &= ~h2;
  }
}
function xc(a2) {
  a2 = a2.pendingLanes & -1073741825;
  return 0 !== a2 ? a2 : a2 & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a2 = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a2;
}
function zc(a2) {
  for (var b2 = [], c6 = 0; 31 > c6; c6++)
    b2.push(a2);
  return b2;
}
function Ac(a2, b2, c6) {
  a2.pendingLanes |= b2;
  536870912 !== b2 && (a2.suspendedLanes = 0, a2.pingedLanes = 0);
  a2 = a2.eventTimes;
  b2 = 31 - oc(b2);
  a2[b2] = c6;
}
function Bc(a2, b2) {
  var c6 = a2.pendingLanes & ~b2;
  a2.pendingLanes = b2;
  a2.suspendedLanes = 0;
  a2.pingedLanes = 0;
  a2.expiredLanes &= b2;
  a2.mutableReadLanes &= b2;
  a2.entangledLanes &= b2;
  b2 = a2.entanglements;
  var d2 = a2.eventTimes;
  for (a2 = a2.expirationTimes; 0 < c6; ) {
    var e2 = 31 - oc(c6), f2 = 1 << e2;
    b2[e2] = 0;
    d2[e2] = -1;
    a2[e2] = -1;
    c6 &= ~f2;
  }
}
function Cc(a2, b2) {
  var c6 = a2.entangledLanes |= b2;
  for (a2 = a2.entanglements; c6; ) {
    var d2 = 31 - oc(c6), e2 = 1 << d2;
    e2 & b2 | a2[d2] & b2 && (a2[d2] |= b2);
    c6 &= ~e2;
  }
}
var C = 0;
function Dc(a2) {
  a2 &= -a2;
  return 1 < a2 ? 4 < a2 ? 0 !== (a2 & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a2, b2) {
  switch (a2) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b2.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b2.pointerId);
  }
}
function Tc(a2, b2, c6, d2, e2, f2) {
  if (null === a2 || a2.nativeEvent !== f2)
    return a2 = { blockedOn: b2, domEventName: c6, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e2] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a2;
  a2.eventSystemFlags |= d2;
  b2 = a2.targetContainers;
  null !== e2 && -1 === b2.indexOf(e2) && b2.push(e2);
  return a2;
}
function Uc(a2, b2, c6, d2, e2) {
  switch (b2) {
    case "focusin":
      return Lc = Tc(Lc, a2, b2, c6, d2, e2), true;
    case "dragenter":
      return Mc = Tc(Mc, a2, b2, c6, d2, e2), true;
    case "mouseover":
      return Nc = Tc(Nc, a2, b2, c6, d2, e2), true;
    case "pointerover":
      var f2 = e2.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a2, b2, c6, d2, e2));
      return true;
    case "gotpointercapture":
      return f2 = e2.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a2, b2, c6, d2, e2)), true;
  }
  return false;
}
function Vc(a2) {
  var b2 = Wc(a2.target);
  if (null !== b2) {
    var c6 = Vb(b2);
    if (null !== c6) {
      if (b2 = c6.tag, 13 === b2) {
        if (b2 = Wb(c6), null !== b2) {
          a2.blockedOn = b2;
          Ic(a2.priority, function() {
            Gc(c6);
          });
          return;
        }
      } else if (3 === b2 && c6.stateNode.current.memoizedState.isDehydrated) {
        a2.blockedOn = 3 === c6.tag ? c6.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a2.blockedOn = null;
}
function Xc(a2) {
  if (null !== a2.blockedOn)
    return false;
  for (var b2 = a2.targetContainers; 0 < b2.length; ) {
    var c6 = Yc(a2.domEventName, a2.eventSystemFlags, b2[0], a2.nativeEvent);
    if (null === c6) {
      c6 = a2.nativeEvent;
      var d2 = new c6.constructor(c6.type, c6);
      wb = d2;
      c6.target.dispatchEvent(d2);
      wb = null;
    } else
      return b2 = Cb(c6), null !== b2 && Fc(b2), a2.blockedOn = c6, false;
    b2.shift();
  }
  return true;
}
function Zc(a2, b2, c6) {
  Xc(a2) && c6.delete(b2);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a2, b2) {
  a2.blockedOn === b2 && (a2.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a2) {
  function b2(b3) {
    return ad(b3, a2);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a2);
    for (var c6 = 1; c6 < Kc.length; c6++) {
      var d2 = Kc[c6];
      d2.blockedOn === a2 && (d2.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a2);
  null !== Mc && ad(Mc, a2);
  null !== Nc && ad(Nc, a2);
  Oc.forEach(b2);
  Pc.forEach(b2);
  for (c6 = 0; c6 < Qc.length; c6++)
    d2 = Qc[c6], d2.blockedOn === a2 && (d2.blockedOn = null);
  for (; 0 < Qc.length && (c6 = Qc[0], null === c6.blockedOn); )
    Vc(c6), null === c6.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a2, b2, c6, d2) {
  var e2 = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a2, b2, c6, d2);
  } finally {
    C = e2, cd.transition = f2;
  }
}
function gd(a2, b2, c6, d2) {
  var e2 = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a2, b2, c6, d2);
  } finally {
    C = e2, cd.transition = f2;
  }
}
function fd(a2, b2, c6, d2) {
  if (dd) {
    var e2 = Yc(a2, b2, c6, d2);
    if (null === e2)
      hd(a2, b2, d2, id, c6), Sc(a2, d2);
    else if (Uc(e2, a2, b2, c6, d2))
      d2.stopPropagation();
    else if (Sc(a2, d2), b2 & 4 && -1 < Rc.indexOf(a2)) {
      for (; null !== e2; ) {
        var f2 = Cb(e2);
        null !== f2 && Ec(f2);
        f2 = Yc(a2, b2, c6, d2);
        null === f2 && hd(a2, b2, d2, id, c6);
        if (f2 === e2)
          break;
        e2 = f2;
      }
      null !== e2 && d2.stopPropagation();
    } else
      hd(a2, b2, d2, null, c6);
  }
}
var id = null;
function Yc(a2, b2, c6, d2) {
  id = null;
  a2 = xb(d2);
  a2 = Wc(a2);
  if (null !== a2)
    if (b2 = Vb(a2), null === b2)
      a2 = null;
    else if (c6 = b2.tag, 13 === c6) {
      a2 = Wb(b2);
      if (null !== a2)
        return a2;
      a2 = null;
    } else if (3 === c6) {
      if (b2.stateNode.current.memoizedState.isDehydrated)
        return 3 === b2.tag ? b2.stateNode.containerInfo : null;
      a2 = null;
    } else
      b2 !== a2 && (a2 = null);
  id = a2;
  return null;
}
function jd(a2) {
  switch (a2) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md)
    return md;
  var a2, b2 = ld, c6 = b2.length, d2, e2 = "value" in kd ? kd.value : kd.textContent, f2 = e2.length;
  for (a2 = 0; a2 < c6 && b2[a2] === e2[a2]; a2++)
    ;
  var g2 = c6 - a2;
  for (d2 = 1; d2 <= g2 && b2[c6 - d2] === e2[f2 - d2]; d2++)
    ;
  return md = e2.slice(a2, 1 < d2 ? 1 - d2 : void 0);
}
function od(a2) {
  var b2 = a2.keyCode;
  "charCode" in a2 ? (a2 = a2.charCode, 0 === a2 && 13 === b2 && (a2 = 13)) : a2 = b2;
  10 === a2 && (a2 = 13);
  return 32 <= a2 || 13 === a2 ? a2 : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a2) {
  function b2(b3, d2, e2, f2, g2) {
    this._reactName = b3;
    this._targetInst = e2;
    this.type = d2;
    this.nativeEvent = f2;
    this.target = g2;
    this.currentTarget = null;
    for (var c6 in a2)
      a2.hasOwnProperty(c6) && (b3 = a2[c6], this[c6] = b3 ? b3(f2) : f2[c6]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A$4(b2.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a3 = this.nativeEvent;
    a3 && (a3.preventDefault ? a3.preventDefault() : "unknown" !== typeof a3.returnValue && (a3.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a3 = this.nativeEvent;
    a3 && (a3.stopPropagation ? a3.stopPropagation() : "unknown" !== typeof a3.cancelBubble && (a3.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b2;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a2) {
  return a2.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A$4({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A$4({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a2) {
  return void 0 === a2.relatedTarget ? a2.fromElement === a2.srcElement ? a2.toElement : a2.fromElement : a2.relatedTarget;
}, movementX: function(a2) {
  if ("movementX" in a2)
    return a2.movementX;
  a2 !== yd && (yd && "mousemove" === a2.type ? (wd = a2.screenX - yd.screenX, xd = a2.screenY - yd.screenY) : xd = wd = 0, yd = a2);
  return wd;
}, movementY: function(a2) {
  return "movementY" in a2 ? a2.movementY : xd;
} }), Bd = rd(Ad), Cd = A$4({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A$4({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A$4({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A$4({}, sd, { clipboardData: function(a2) {
  return "clipboardData" in a2 ? a2.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A$4({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a2) {
  var b2 = this.nativeEvent;
  return b2.getModifierState ? b2.getModifierState(a2) : (a2 = Od[a2]) ? !!b2[a2] : false;
}
function zd() {
  return Pd;
}
var Qd = A$4({}, ud, { key: function(a2) {
  if (a2.key) {
    var b2 = Md[a2.key] || a2.key;
    if ("Unidentified" !== b2)
      return b2;
  }
  return "keypress" === a2.type ? (a2 = od(a2), 13 === a2 ? "Enter" : String.fromCharCode(a2)) : "keydown" === a2.type || "keyup" === a2.type ? Nd[a2.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a2) {
  return "keypress" === a2.type ? od(a2) : 0;
}, keyCode: function(a2) {
  return "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
}, which: function(a2) {
  return "keypress" === a2.type ? od(a2) : "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
} }), Rd = rd(Qd), Sd = A$4({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A$4({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A$4({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A$4({}, Ad, {
  deltaX: function(a2) {
    return "deltaX" in a2 ? a2.deltaX : "wheelDeltaX" in a2 ? -a2.wheelDeltaX : 0;
  },
  deltaY: function(a2) {
    return "deltaY" in a2 ? a2.deltaY : "wheelDeltaY" in a2 ? -a2.wheelDeltaY : "wheelDelta" in a2 ? -a2.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a2, b2) {
  switch (a2) {
    case "keyup":
      return -1 !== $d.indexOf(b2.keyCode);
    case "keydown":
      return 229 !== b2.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a2) {
  a2 = a2.detail;
  return "object" === typeof a2 && "data" in a2 ? a2.data : null;
}
var ie = false;
function je(a2, b2) {
  switch (a2) {
    case "compositionend":
      return he(b2);
    case "keypress":
      if (32 !== b2.which)
        return null;
      fe = true;
      return ee;
    case "textInput":
      return a2 = b2.data, a2 === ee && fe ? null : a2;
    default:
      return null;
  }
}
function ke(a2, b2) {
  if (ie)
    return "compositionend" === a2 || !ae && ge(a2, b2) ? (a2 = nd(), md = ld = kd = null, ie = false, a2) : null;
  switch (a2) {
    case "paste":
      return null;
    case "keypress":
      if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
        if (b2.char && 1 < b2.char.length)
          return b2.char;
        if (b2.which)
          return String.fromCharCode(b2.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b2.locale ? null : b2.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a2) {
  var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
  return "input" === b2 ? !!le[a2.type] : "textarea" === b2 ? true : false;
}
function ne(a2, b2, c6, d2) {
  Eb(d2);
  b2 = oe(b2, "onChange");
  0 < b2.length && (c6 = new td("onChange", "change", null, c6, d2), a2.push({ event: c6, listeners: b2 }));
}
var pe = null, qe = null;
function re(a2) {
  se(a2, 0);
}
function te(a2) {
  var b2 = ue(a2);
  if (Wa(b2))
    return a2;
}
function ve(a2, b2) {
  if ("change" === a2)
    return b2;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else
    xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a2) {
  if ("value" === a2.propertyName && te(qe)) {
    var b2 = [];
    ne(b2, qe, a2, xb(a2));
    Jb(re, b2);
  }
}
function Ce(a2, b2, c6) {
  "focusin" === a2 ? (Ae(), pe = b2, qe = c6, pe.attachEvent("onpropertychange", Be)) : "focusout" === a2 && Ae();
}
function De(a2) {
  if ("selectionchange" === a2 || "keyup" === a2 || "keydown" === a2)
    return te(qe);
}
function Ee(a2, b2) {
  if ("click" === a2)
    return te(b2);
}
function Fe(a2, b2) {
  if ("input" === a2 || "change" === a2)
    return te(b2);
}
function Ge(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a2, b2) {
  if (He(a2, b2))
    return true;
  if ("object" !== typeof a2 || null === a2 || "object" !== typeof b2 || null === b2)
    return false;
  var c6 = Object.keys(a2), d2 = Object.keys(b2);
  if (c6.length !== d2.length)
    return false;
  for (d2 = 0; d2 < c6.length; d2++) {
    var e2 = c6[d2];
    if (!ja.call(b2, e2) || !He(a2[e2], b2[e2]))
      return false;
  }
  return true;
}
function Je(a2) {
  for (; a2 && a2.firstChild; )
    a2 = a2.firstChild;
  return a2;
}
function Ke(a2, b2) {
  var c6 = Je(a2);
  a2 = 0;
  for (var d2; c6; ) {
    if (3 === c6.nodeType) {
      d2 = a2 + c6.textContent.length;
      if (a2 <= b2 && d2 >= b2)
        return { node: c6, offset: b2 - a2 };
      a2 = d2;
    }
    a: {
      for (; c6; ) {
        if (c6.nextSibling) {
          c6 = c6.nextSibling;
          break a;
        }
        c6 = c6.parentNode;
      }
      c6 = void 0;
    }
    c6 = Je(c6);
  }
}
function Le(a2, b2) {
  return a2 && b2 ? a2 === b2 ? true : a2 && 3 === a2.nodeType ? false : b2 && 3 === b2.nodeType ? Le(a2, b2.parentNode) : "contains" in a2 ? a2.contains(b2) : a2.compareDocumentPosition ? !!(a2.compareDocumentPosition(b2) & 16) : false : false;
}
function Me() {
  for (var a2 = window, b2 = Xa(); b2 instanceof a2.HTMLIFrameElement; ) {
    try {
      var c6 = "string" === typeof b2.contentWindow.location.href;
    } catch (d2) {
      c6 = false;
    }
    if (c6)
      a2 = b2.contentWindow;
    else
      break;
    b2 = Xa(a2.document);
  }
  return b2;
}
function Ne(a2) {
  var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
  return b2 && ("input" === b2 && ("text" === a2.type || "search" === a2.type || "tel" === a2.type || "url" === a2.type || "password" === a2.type) || "textarea" === b2 || "true" === a2.contentEditable);
}
function Oe(a2) {
  var b2 = Me(), c6 = a2.focusedElem, d2 = a2.selectionRange;
  if (b2 !== c6 && c6 && c6.ownerDocument && Le(c6.ownerDocument.documentElement, c6)) {
    if (null !== d2 && Ne(c6)) {
      if (b2 = d2.start, a2 = d2.end, void 0 === a2 && (a2 = b2), "selectionStart" in c6)
        c6.selectionStart = b2, c6.selectionEnd = Math.min(a2, c6.value.length);
      else if (a2 = (b2 = c6.ownerDocument || document) && b2.defaultView || window, a2.getSelection) {
        a2 = a2.getSelection();
        var e2 = c6.textContent.length, f2 = Math.min(d2.start, e2);
        d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e2);
        !a2.extend && f2 > d2 && (e2 = d2, d2 = f2, f2 = e2);
        e2 = Ke(c6, f2);
        var g2 = Ke(
          c6,
          d2
        );
        e2 && g2 && (1 !== a2.rangeCount || a2.anchorNode !== e2.node || a2.anchorOffset !== e2.offset || a2.focusNode !== g2.node || a2.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e2.node, e2.offset), a2.removeAllRanges(), f2 > d2 ? (a2.addRange(b2), a2.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a2.addRange(b2)));
      }
    }
    b2 = [];
    for (a2 = c6; a2 = a2.parentNode; )
      1 === a2.nodeType && b2.push({ element: a2, left: a2.scrollLeft, top: a2.scrollTop });
    "function" === typeof c6.focus && c6.focus();
    for (c6 = 0; c6 < b2.length; c6++)
      a2 = b2[c6], a2.element.scrollLeft = a2.left, a2.element.scrollTop = a2.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a2, b2, c6) {
  var d2 = c6.window === c6 ? c6.document : 9 === c6.nodeType ? c6 : c6.ownerDocument;
  Te || null == Qe || Qe !== Xa(d2) || (d2 = Qe, "selectionStart" in d2 && Ne(d2) ? d2 = { start: d2.selectionStart, end: d2.selectionEnd } : (d2 = (d2.ownerDocument && d2.ownerDocument.defaultView || window).getSelection(), d2 = { anchorNode: d2.anchorNode, anchorOffset: d2.anchorOffset, focusNode: d2.focusNode, focusOffset: d2.focusOffset }), Se && Ie(Se, d2) || (Se = d2, d2 = oe(Re, "onSelect"), 0 < d2.length && (b2 = new td("onSelect", "select", null, b2, c6), a2.push({ event: b2, listeners: d2 }), b2.target = Qe)));
}
function Ve(a2, b2) {
  var c6 = {};
  c6[a2.toLowerCase()] = b2.toLowerCase();
  c6["Webkit" + a2] = "webkit" + b2;
  c6["Moz" + a2] = "moz" + b2;
  return c6;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a2) {
  if (Xe[a2])
    return Xe[a2];
  if (!We[a2])
    return a2;
  var b2 = We[a2], c6;
  for (c6 in b2)
    if (b2.hasOwnProperty(c6) && c6 in Ye)
      return Xe[a2] = b2[c6];
  return a2;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a2, b2) {
  df.set(a2, b2);
  fa(b2, [a2]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a2, b2, c6) {
  var d2 = a2.type || "unknown-event";
  a2.currentTarget = c6;
  Ub(d2, b2, void 0, a2);
  a2.currentTarget = null;
}
function se(a2, b2) {
  b2 = 0 !== (b2 & 4);
  for (var c6 = 0; c6 < a2.length; c6++) {
    var d2 = a2[c6], e2 = d2.event;
    d2 = d2.listeners;
    a: {
      var f2 = void 0;
      if (b2)
        for (var g2 = d2.length - 1; 0 <= g2; g2--) {
          var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped())
            break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
      else
        for (g2 = 0; g2 < d2.length; g2++) {
          h2 = d2[g2];
          k2 = h2.instance;
          l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped())
            break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
    }
  }
  if (Qb)
    throw a2 = Rb, Qb = false, Rb = null, a2;
}
function D$2(a2, b2) {
  var c6 = b2[of];
  void 0 === c6 && (c6 = b2[of] = /* @__PURE__ */ new Set());
  var d2 = a2 + "__bubble";
  c6.has(d2) || (pf(b2, a2, 2, false), c6.add(d2));
}
function qf(a2, b2, c6) {
  var d2 = 0;
  b2 && (d2 |= 4);
  pf(c6, a2, d2, b2);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a2) {
  if (!a2[rf]) {
    a2[rf] = true;
    da.forEach(function(b3) {
      "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a2), qf(b3, true, a2));
    });
    var b2 = 9 === a2.nodeType ? a2 : a2.ownerDocument;
    null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
  }
}
function pf(a2, b2, c6, d2) {
  switch (jd(b2)) {
    case 1:
      var e2 = ed;
      break;
    case 4:
      e2 = gd;
      break;
    default:
      e2 = fd;
  }
  c6 = e2.bind(null, b2, c6, a2);
  e2 = void 0;
  !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e2 = true);
  d2 ? void 0 !== e2 ? a2.addEventListener(b2, c6, { capture: true, passive: e2 }) : a2.addEventListener(b2, c6, true) : void 0 !== e2 ? a2.addEventListener(b2, c6, { passive: e2 }) : a2.addEventListener(b2, c6, false);
}
function hd(a2, b2, c6, d2, e2) {
  var f2 = d2;
  if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2)
    a:
      for (; ; ) {
        if (null === d2)
          return;
        var g2 = d2.tag;
        if (3 === g2 || 4 === g2) {
          var h2 = d2.stateNode.containerInfo;
          if (h2 === e2 || 8 === h2.nodeType && h2.parentNode === e2)
            break;
          if (4 === g2)
            for (g2 = d2.return; null !== g2; ) {
              var k2 = g2.tag;
              if (3 === k2 || 4 === k2) {
                if (k2 = g2.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2)
                  return;
              }
              g2 = g2.return;
            }
          for (; null !== h2; ) {
            g2 = Wc(h2);
            if (null === g2)
              return;
            k2 = g2.tag;
            if (5 === k2 || 6 === k2) {
              d2 = f2 = g2;
              continue a;
            }
            h2 = h2.parentNode;
          }
        }
        d2 = d2.return;
      }
  Jb(function() {
    var d3 = f2, e3 = xb(c6), g3 = [];
    a: {
      var h3 = df.get(a2);
      if (void 0 !== h3) {
        var k3 = td, n2 = a2;
        switch (a2) {
          case "keypress":
            if (0 === od(c6))
              break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c6.button)
              break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b2 & 4), J2 = !t2 && "scroll" === a2, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
        t2 = [];
        for (var w2 = d3, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2)
            break;
          w2 = w2.return;
        }
        0 < t2.length && (h3 = new k3(h3, n2, null, c6, e3), g3.push({ event: h3, listeners: t2 }));
      }
    }
    if (0 === (b2 & 7)) {
      a: {
        h3 = "mouseover" === a2 || "pointerover" === a2;
        k3 = "mouseout" === a2 || "pointerout" === a2;
        if (h3 && c6 !== wb && (n2 = c6.relatedTarget || c6.fromElement) && (Wc(n2) || n2[uf]))
          break a;
        if (k3 || h3) {
          h3 = e3.window === e3 ? e3 : (h3 = e3.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
          if (k3) {
            if (n2 = c6.relatedTarget || c6.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag))
              n2 = null;
          } else
            k3 = null, n2 = d3;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a2 || "pointerover" === a2)
              t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h3 : ue(k3);
            u2 = null == n2 ? h3 : ue(n2);
            h3 = new t2(F2, w2 + "leave", k3, c6, e3);
            h3.target = J2;
            h3.relatedTarget = u2;
            F2 = null;
            Wc(e3) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c6, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2)
              b: {
                t2 = k3;
                x2 = n2;
                w2 = 0;
                for (u2 = t2; u2; u2 = vf(u2))
                  w2++;
                u2 = 0;
                for (F2 = x2; F2; F2 = vf(F2))
                  u2++;
                for (; 0 < w2 - u2; )
                  t2 = vf(t2), w2--;
                for (; 0 < u2 - w2; )
                  x2 = vf(x2), u2--;
                for (; w2--; ) {
                  if (t2 === x2 || null !== x2 && t2 === x2.alternate)
                    break b;
                  t2 = vf(t2);
                  x2 = vf(x2);
                }
                t2 = null;
              }
            else
              t2 = null;
            null !== k3 && wf(g3, h3, k3, t2, false);
            null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
          }
        }
      }
      a: {
        h3 = d3 ? ue(d3) : window;
        k3 = h3.nodeName && h3.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h3.type)
          var na = ve;
        else if (me(h3))
          if (we)
            na = Fe;
          else {
            na = De;
            var xa = Ce;
          }
        else
          (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee);
        if (na && (na = na(a2, d3))) {
          ne(g3, na, c6, e3);
          break a;
        }
        xa && xa(a2, h3, d3);
        "focusout" === a2 && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
      }
      xa = d3 ? ue(d3) : window;
      switch (a2) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable)
            Qe = xa, Re = d3, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g3, c6, e3);
          break;
        case "selectionchange":
          if (Pe)
            break;
        case "keydown":
        case "keyup":
          Ue(g3, c6, e3);
      }
      var $a;
      if (ae)
        b: {
          switch (a2) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
      else
        ie ? ge(a2, c6) && (ba = "onCompositionEnd") : "keydown" === a2 && 229 === c6.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c6.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d3, ba), 0 < xa.length && (ba = new Ld(ba, a2, null, c6, e3), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c6), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a2, c6) : ke(a2, c6))
        d3 = oe(d3, "onBeforeInput"), 0 < d3.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c6, e3), g3.push({ event: e3, listeners: d3 }), e3.data = $a);
    }
    se(g3, b2);
  });
}
function tf(a2, b2, c6) {
  return { instance: a2, listener: b2, currentTarget: c6 };
}
function oe(a2, b2) {
  for (var c6 = b2 + "Capture", d2 = []; null !== a2; ) {
    var e2 = a2, f2 = e2.stateNode;
    5 === e2.tag && null !== f2 && (e2 = f2, f2 = Kb(a2, c6), null != f2 && d2.unshift(tf(a2, f2, e2)), f2 = Kb(a2, b2), null != f2 && d2.push(tf(a2, f2, e2)));
    a2 = a2.return;
  }
  return d2;
}
function vf(a2) {
  if (null === a2)
    return null;
  do
    a2 = a2.return;
  while (a2 && 5 !== a2.tag);
  return a2 ? a2 : null;
}
function wf(a2, b2, c6, d2, e2) {
  for (var f2 = b2._reactName, g2 = []; null !== c6 && c6 !== d2; ) {
    var h2 = c6, k2 = h2.alternate, l2 = h2.stateNode;
    if (null !== k2 && k2 === d2)
      break;
    5 === h2.tag && null !== l2 && (h2 = l2, e2 ? (k2 = Kb(c6, f2), null != k2 && g2.unshift(tf(c6, k2, h2))) : e2 || (k2 = Kb(c6, f2), null != k2 && g2.push(tf(c6, k2, h2))));
    c6 = c6.return;
  }
  0 !== g2.length && a2.push({ event: b2, listeners: g2 });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a2) {
  return ("string" === typeof a2 ? a2 : "" + a2).replace(xf, "\n").replace(yf, "");
}
function Af(a2, b2, c6) {
  b2 = zf(b2);
  if (zf(a2) !== b2 && c6)
    throw Error(p$a(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a2, b2) {
  return "textarea" === a2 || "noscript" === a2 || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a2) {
  return Hf.resolve(null).then(a2).catch(If);
} : Ff;
function If(a2) {
  setTimeout(function() {
    throw a2;
  });
}
function Kf(a2, b2) {
  var c6 = b2, d2 = 0;
  do {
    var e2 = c6.nextSibling;
    a2.removeChild(c6);
    if (e2 && 8 === e2.nodeType)
      if (c6 = e2.data, "/$" === c6) {
        if (0 === d2) {
          a2.removeChild(e2);
          bd(b2);
          return;
        }
        d2--;
      } else
        "$" !== c6 && "$?" !== c6 && "$!" !== c6 || d2++;
    c6 = e2;
  } while (c6);
  bd(b2);
}
function Lf(a2) {
  for (; null != a2; a2 = a2.nextSibling) {
    var b2 = a2.nodeType;
    if (1 === b2 || 3 === b2)
      break;
    if (8 === b2) {
      b2 = a2.data;
      if ("$" === b2 || "$!" === b2 || "$?" === b2)
        break;
      if ("/$" === b2)
        return null;
    }
  }
  return a2;
}
function Mf(a2) {
  a2 = a2.previousSibling;
  for (var b2 = 0; a2; ) {
    if (8 === a2.nodeType) {
      var c6 = a2.data;
      if ("$" === c6 || "$!" === c6 || "$?" === c6) {
        if (0 === b2)
          return a2;
        b2--;
      } else
        "/$" === c6 && b2++;
    }
    a2 = a2.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a2) {
  var b2 = a2[Of];
  if (b2)
    return b2;
  for (var c6 = a2.parentNode; c6; ) {
    if (b2 = c6[uf] || c6[Of]) {
      c6 = b2.alternate;
      if (null !== b2.child || null !== c6 && null !== c6.child)
        for (a2 = Mf(a2); null !== a2; ) {
          if (c6 = a2[Of])
            return c6;
          a2 = Mf(a2);
        }
      return b2;
    }
    a2 = c6;
    c6 = a2.parentNode;
  }
  return null;
}
function Cb(a2) {
  a2 = a2[Of] || a2[uf];
  return !a2 || 5 !== a2.tag && 6 !== a2.tag && 13 !== a2.tag && 3 !== a2.tag ? null : a2;
}
function ue(a2) {
  if (5 === a2.tag || 6 === a2.tag)
    return a2.stateNode;
  throw Error(p$a(33));
}
function Db(a2) {
  return a2[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a2) {
  return { current: a2 };
}
function E$2(a2) {
  0 > Tf || (a2.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G$2(a2, b2) {
  Tf++;
  Sf[Tf] = a2.current;
  a2.current = b2;
}
var Vf = {}, H$2 = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a2, b2) {
  var c6 = a2.type.contextTypes;
  if (!c6)
    return Vf;
  var d2 = a2.stateNode;
  if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2)
    return d2.__reactInternalMemoizedMaskedChildContext;
  var e2 = {}, f2;
  for (f2 in c6)
    e2[f2] = b2[f2];
  d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = b2, a2.__reactInternalMemoizedMaskedChildContext = e2);
  return e2;
}
function Zf(a2) {
  a2 = a2.childContextTypes;
  return null !== a2 && void 0 !== a2;
}
function $f() {
  E$2(Wf);
  E$2(H$2);
}
function ag(a2, b2, c6) {
  if (H$2.current !== Vf)
    throw Error(p$a(168));
  G$2(H$2, b2);
  G$2(Wf, c6);
}
function bg(a2, b2, c6) {
  var d2 = a2.stateNode;
  b2 = b2.childContextTypes;
  if ("function" !== typeof d2.getChildContext)
    return c6;
  d2 = d2.getChildContext();
  for (var e2 in d2)
    if (!(e2 in b2))
      throw Error(p$a(108, Ra(a2) || "Unknown", e2));
  return A$4({}, c6, d2);
}
function cg(a2) {
  a2 = (a2 = a2.stateNode) && a2.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H$2.current;
  G$2(H$2, a2);
  G$2(Wf, Wf.current);
  return true;
}
function dg(a2, b2, c6) {
  var d2 = a2.stateNode;
  if (!d2)
    throw Error(p$a(169));
  c6 ? (a2 = bg(a2, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a2, E$2(Wf), E$2(H$2), G$2(H$2, a2)) : E$2(Wf);
  G$2(Wf, c6);
}
var eg = null, fg = false, gg = false;
function hg(a2) {
  null === eg ? eg = [a2] : eg.push(a2);
}
function ig(a2) {
  fg = true;
  hg(a2);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a2 = 0, b2 = C;
    try {
      var c6 = eg;
      for (C = 1; a2 < c6.length; a2++) {
        var d2 = c6[a2];
        do
          d2 = d2(true);
        while (null !== d2);
      }
      eg = null;
      fg = false;
    } catch (e2) {
      throw null !== eg && (eg = eg.slice(a2 + 1)), ac(fc, jg), e2;
    } finally {
      C = b2, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a2, b2) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a2;
  ng = b2;
}
function ug(a2, b2, c6) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a2;
  var d2 = rg;
  a2 = sg;
  var e2 = 32 - oc(d2) - 1;
  d2 &= ~(1 << e2);
  c6 += 1;
  var f2 = 32 - oc(b2) + e2;
  if (30 < f2) {
    var g2 = e2 - e2 % 5;
    f2 = (d2 & (1 << g2) - 1).toString(32);
    d2 >>= g2;
    e2 -= g2;
    rg = 1 << 32 - oc(b2) + e2 | c6 << e2 | d2;
    sg = f2 + a2;
  } else
    rg = 1 << f2 | c6 << e2 | d2, sg = a2;
}
function vg(a2) {
  null !== a2.return && (tg(a2, 1), ug(a2, 1, 0));
}
function wg(a2) {
  for (; a2 === mg; )
    mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a2 === qg; )
    qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I$2 = false, zg = null;
function Ag(a2, b2) {
  var c6 = Bg(5, null, null, 0);
  c6.elementType = "DELETED";
  c6.stateNode = b2;
  c6.return = a2;
  b2 = a2.deletions;
  null === b2 ? (a2.deletions = [c6], a2.flags |= 16) : b2.push(c6);
}
function Cg(a2, b2) {
  switch (a2.tag) {
    case 5:
      var c6 = a2.type;
      b2 = 1 !== b2.nodeType || c6.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
      return null !== b2 ? (a2.stateNode = b2, xg = a2, yg = Lf(b2.firstChild), true) : false;
    case 6:
      return b2 = "" === a2.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a2.stateNode = b2, xg = a2, yg = null, true) : false;
    case 13:
      return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c6 = null !== qg ? { id: rg, overflow: sg } : null, a2.memoizedState = { dehydrated: b2, treeContext: c6, retryLane: 1073741824 }, c6 = Bg(18, null, null, 0), c6.stateNode = b2, c6.return = a2, a2.child = c6, xg = a2, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a2) {
  return 0 !== (a2.mode & 1) && 0 === (a2.flags & 128);
}
function Eg(a2) {
  if (I$2) {
    var b2 = yg;
    if (b2) {
      var c6 = b2;
      if (!Cg(a2, b2)) {
        if (Dg(a2))
          throw Error(p$a(418));
        b2 = Lf(c6.nextSibling);
        var d2 = xg;
        b2 && Cg(a2, b2) ? Ag(d2, c6) : (a2.flags = a2.flags & -4097 | 2, I$2 = false, xg = a2);
      }
    } else {
      if (Dg(a2))
        throw Error(p$a(418));
      a2.flags = a2.flags & -4097 | 2;
      I$2 = false;
      xg = a2;
    }
  }
}
function Fg(a2) {
  for (a2 = a2.return; null !== a2 && 5 !== a2.tag && 3 !== a2.tag && 13 !== a2.tag; )
    a2 = a2.return;
  xg = a2;
}
function Gg(a2) {
  if (a2 !== xg)
    return false;
  if (!I$2)
    return Fg(a2), I$2 = true, false;
  var b2;
  (b2 = 3 !== a2.tag) && !(b2 = 5 !== a2.tag) && (b2 = a2.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a2.type, a2.memoizedProps));
  if (b2 && (b2 = yg)) {
    if (Dg(a2))
      throw Hg(), Error(p$a(418));
    for (; b2; )
      Ag(a2, b2), b2 = Lf(b2.nextSibling);
  }
  Fg(a2);
  if (13 === a2.tag) {
    a2 = a2.memoizedState;
    a2 = null !== a2 ? a2.dehydrated : null;
    if (!a2)
      throw Error(p$a(317));
    a: {
      a2 = a2.nextSibling;
      for (b2 = 0; a2; ) {
        if (8 === a2.nodeType) {
          var c6 = a2.data;
          if ("/$" === c6) {
            if (0 === b2) {
              yg = Lf(a2.nextSibling);
              break a;
            }
            b2--;
          } else
            "$" !== c6 && "$!" !== c6 && "$?" !== c6 || b2++;
        }
        a2 = a2.nextSibling;
      }
      yg = null;
    }
  } else
    yg = xg ? Lf(a2.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a2 = yg; a2; )
    a2 = Lf(a2.nextSibling);
}
function Ig() {
  yg = xg = null;
  I$2 = false;
}
function Jg(a2) {
  null === zg ? zg = [a2] : zg.push(a2);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a2, b2) {
  if (a2 && a2.defaultProps) {
    b2 = A$4({}, b2);
    a2 = a2.defaultProps;
    for (var c6 in a2)
      void 0 === b2[c6] && (b2[c6] = a2[c6]);
    return b2;
  }
  return b2;
}
var Mg = Uf(null), Ng = null, Og = null, Pg = null;
function Qg() {
  Pg = Og = Ng = null;
}
function Rg(a2) {
  var b2 = Mg.current;
  E$2(Mg);
  a2._currentValue = b2;
}
function Sg(a2, b2, c6) {
  for (; null !== a2; ) {
    var d2 = a2.alternate;
    (a2.childLanes & b2) !== b2 ? (a2.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
    if (a2 === c6)
      break;
    a2 = a2.return;
  }
}
function Tg(a2, b2) {
  Ng = a2;
  Pg = Og = null;
  a2 = a2.dependencies;
  null !== a2 && null !== a2.firstContext && (0 !== (a2.lanes & b2) && (Ug = true), a2.firstContext = null);
}
function Vg(a2) {
  var b2 = a2._currentValue;
  if (Pg !== a2)
    if (a2 = { context: a2, memoizedValue: b2, next: null }, null === Og) {
      if (null === Ng)
        throw Error(p$a(308));
      Og = a2;
      Ng.dependencies = { lanes: 0, firstContext: a2 };
    } else
      Og = Og.next = a2;
  return b2;
}
var Wg = null;
function Xg(a2) {
  null === Wg ? Wg = [a2] : Wg.push(a2);
}
function Yg(a2, b2, c6, d2) {
  var e2 = b2.interleaved;
  null === e2 ? (c6.next = c6, Xg(b2)) : (c6.next = e2.next, e2.next = c6);
  b2.interleaved = c6;
  return Zg(a2, d2);
}
function Zg(a2, b2) {
  a2.lanes |= b2;
  var c6 = a2.alternate;
  null !== c6 && (c6.lanes |= b2);
  c6 = a2;
  for (a2 = a2.return; null !== a2; )
    a2.childLanes |= b2, c6 = a2.alternate, null !== c6 && (c6.childLanes |= b2), c6 = a2, a2 = a2.return;
  return 3 === c6.tag ? c6.stateNode : null;
}
var $g = false;
function ah(a2) {
  a2.updateQueue = { baseState: a2.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function bh(a2, b2) {
  a2 = a2.updateQueue;
  b2.updateQueue === a2 && (b2.updateQueue = { baseState: a2.baseState, firstBaseUpdate: a2.firstBaseUpdate, lastBaseUpdate: a2.lastBaseUpdate, shared: a2.shared, effects: a2.effects });
}
function ch(a2, b2) {
  return { eventTime: a2, lane: b2, tag: 0, payload: null, callback: null, next: null };
}
function dh(a2, b2, c6) {
  var d2 = a2.updateQueue;
  if (null === d2)
    return null;
  d2 = d2.shared;
  if (0 !== (K & 2)) {
    var e2 = d2.pending;
    null === e2 ? b2.next = b2 : (b2.next = e2.next, e2.next = b2);
    d2.pending = b2;
    return Zg(a2, c6);
  }
  e2 = d2.interleaved;
  null === e2 ? (b2.next = b2, Xg(d2)) : (b2.next = e2.next, e2.next = b2);
  d2.interleaved = b2;
  return Zg(a2, c6);
}
function eh(a2, b2, c6) {
  b2 = b2.updateQueue;
  if (null !== b2 && (b2 = b2.shared, 0 !== (c6 & 4194240))) {
    var d2 = b2.lanes;
    d2 &= a2.pendingLanes;
    c6 |= d2;
    b2.lanes = c6;
    Cc(a2, c6);
  }
}
function fh(a2, b2) {
  var c6 = a2.updateQueue, d2 = a2.alternate;
  if (null !== d2 && (d2 = d2.updateQueue, c6 === d2)) {
    var e2 = null, f2 = null;
    c6 = c6.firstBaseUpdate;
    if (null !== c6) {
      do {
        var g2 = { eventTime: c6.eventTime, lane: c6.lane, tag: c6.tag, payload: c6.payload, callback: c6.callback, next: null };
        null === f2 ? e2 = f2 = g2 : f2 = f2.next = g2;
        c6 = c6.next;
      } while (null !== c6);
      null === f2 ? e2 = f2 = b2 : f2 = f2.next = b2;
    } else
      e2 = f2 = b2;
    c6 = { baseState: d2.baseState, firstBaseUpdate: e2, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
    a2.updateQueue = c6;
    return;
  }
  a2 = c6.lastBaseUpdate;
  null === a2 ? c6.firstBaseUpdate = b2 : a2.next = b2;
  c6.lastBaseUpdate = b2;
}
function gh(a2, b2, c6, d2) {
  var e2 = a2.updateQueue;
  $g = false;
  var f2 = e2.firstBaseUpdate, g2 = e2.lastBaseUpdate, h2 = e2.shared.pending;
  if (null !== h2) {
    e2.shared.pending = null;
    var k2 = h2, l2 = k2.next;
    k2.next = null;
    null === g2 ? f2 = l2 : g2.next = l2;
    g2 = k2;
    var m2 = a2.alternate;
    null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g2 && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e2.baseState;
    g2 = 0;
    m2 = l2 = k2 = null;
    h2 = f2;
    do {
      var r2 = h2.lane, y2 = h2.eventTime;
      if ((d2 & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h2.tag,
          payload: h2.payload,
          callback: h2.callback,
          next: null
        });
        a: {
          var n2 = a2, t2 = h2;
          r2 = b2;
          y2 = c6;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2)
                break a;
              q2 = A$4({}, q2, r2);
              break a;
            case 2:
              $g = true;
          }
        }
        null !== h2.callback && 0 !== h2.lane && (a2.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h2] : r2.push(h2));
      } else
        y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
      h2 = h2.next;
      if (null === h2)
        if (h2 = e2.shared.pending, null === h2)
          break;
        else
          r2 = h2, h2 = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e2.baseState = k2;
    e2.firstBaseUpdate = l2;
    e2.lastBaseUpdate = m2;
    b2 = e2.shared.interleaved;
    if (null !== b2) {
      e2 = b2;
      do
        g2 |= e2.lane, e2 = e2.next;
      while (e2 !== b2);
    } else
      null === f2 && (e2.shared.lanes = 0);
    hh |= g2;
    a2.lanes = g2;
    a2.memoizedState = q2;
  }
}
function ih(a2, b2, c6) {
  a2 = b2.effects;
  b2.effects = null;
  if (null !== a2)
    for (b2 = 0; b2 < a2.length; b2++) {
      var d2 = a2[b2], e2 = d2.callback;
      if (null !== e2) {
        d2.callback = null;
        d2 = c6;
        if ("function" !== typeof e2)
          throw Error(p$a(191, e2));
        e2.call(d2);
      }
    }
}
var jh = new aa.Component().refs;
function kh(a2, b2, c6, d2) {
  b2 = a2.memoizedState;
  c6 = c6(d2, b2);
  c6 = null === c6 || void 0 === c6 ? b2 : A$4({}, b2, c6);
  a2.memoizedState = c6;
  0 === a2.lanes && (a2.updateQueue.baseState = c6);
}
var nh = { isMounted: function(a2) {
  return (a2 = a2._reactInternals) ? Vb(a2) === a2 : false;
}, enqueueSetState: function(a2, b2, c6) {
  a2 = a2._reactInternals;
  var d2 = L$2(), e2 = lh(a2), f2 = ch(d2, e2);
  f2.payload = b2;
  void 0 !== c6 && null !== c6 && (f2.callback = c6);
  b2 = dh(a2, f2, e2);
  null !== b2 && (mh(b2, a2, e2, d2), eh(b2, a2, e2));
}, enqueueReplaceState: function(a2, b2, c6) {
  a2 = a2._reactInternals;
  var d2 = L$2(), e2 = lh(a2), f2 = ch(d2, e2);
  f2.tag = 1;
  f2.payload = b2;
  void 0 !== c6 && null !== c6 && (f2.callback = c6);
  b2 = dh(a2, f2, e2);
  null !== b2 && (mh(b2, a2, e2, d2), eh(b2, a2, e2));
}, enqueueForceUpdate: function(a2, b2) {
  a2 = a2._reactInternals;
  var c6 = L$2(), d2 = lh(a2), e2 = ch(c6, d2);
  e2.tag = 2;
  void 0 !== b2 && null !== b2 && (e2.callback = b2);
  b2 = dh(a2, e2, d2);
  null !== b2 && (mh(b2, a2, d2, c6), eh(b2, a2, d2));
} };
function oh(a2, b2, c6, d2, e2, f2, g2) {
  a2 = a2.stateNode;
  return "function" === typeof a2.shouldComponentUpdate ? a2.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie(c6, d2) || !Ie(e2, f2) : true;
}
function ph(a2, b2, c6) {
  var d2 = false, e2 = Vf;
  var f2 = b2.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = Vg(f2) : (e2 = Zf(b2) ? Xf : H$2.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a2, e2) : Vf);
  b2 = new b2(c6, f2);
  a2.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
  b2.updater = nh;
  a2.stateNode = b2;
  b2._reactInternals = a2;
  d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = e2, a2.__reactInternalMemoizedMaskedChildContext = f2);
  return b2;
}
function qh(a2, b2, c6, d2) {
  a2 = b2.state;
  "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c6, d2);
  "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c6, d2);
  b2.state !== a2 && nh.enqueueReplaceState(b2, b2.state, null);
}
function rh(a2, b2, c6, d2) {
  var e2 = a2.stateNode;
  e2.props = c6;
  e2.state = a2.memoizedState;
  e2.refs = jh;
  ah(a2);
  var f2 = b2.contextType;
  "object" === typeof f2 && null !== f2 ? e2.context = Vg(f2) : (f2 = Zf(b2) ? Xf : H$2.current, e2.context = Yf(a2, f2));
  e2.state = a2.memoizedState;
  f2 = b2.getDerivedStateFromProps;
  "function" === typeof f2 && (kh(a2, b2, f2, c6), e2.state = a2.memoizedState);
  "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b2 = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b2 !== e2.state && nh.enqueueReplaceState(e2, e2.state, null), gh(a2, c6, e2, d2), e2.state = a2.memoizedState);
  "function" === typeof e2.componentDidMount && (a2.flags |= 4194308);
}
function sh(a2, b2, c6) {
  a2 = c6.ref;
  if (null !== a2 && "function" !== typeof a2 && "object" !== typeof a2) {
    if (c6._owner) {
      c6 = c6._owner;
      if (c6) {
        if (1 !== c6.tag)
          throw Error(p$a(309));
        var d2 = c6.stateNode;
      }
      if (!d2)
        throw Error(p$a(147, a2));
      var e2 = d2, f2 = "" + a2;
      if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2)
        return b2.ref;
      b2 = function(a3) {
        var b3 = e2.refs;
        b3 === jh && (b3 = e2.refs = {});
        null === a3 ? delete b3[f2] : b3[f2] = a3;
      };
      b2._stringRef = f2;
      return b2;
    }
    if ("string" !== typeof a2)
      throw Error(p$a(284));
    if (!c6._owner)
      throw Error(p$a(290, a2));
  }
  return a2;
}
function th(a2, b2) {
  a2 = Object.prototype.toString.call(b2);
  throw Error(p$a(31, "[object Object]" === a2 ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a2));
}
function uh(a2) {
  var b2 = a2._init;
  return b2(a2._payload);
}
function vh(a2) {
  function b2(b3, c7) {
    if (a2) {
      var d3 = b3.deletions;
      null === d3 ? (b3.deletions = [c7], b3.flags |= 16) : d3.push(c7);
    }
  }
  function c6(c7, d3) {
    if (!a2)
      return null;
    for (; null !== d3; )
      b2(c7, d3), d3 = d3.sibling;
    return null;
  }
  function d2(a3, b3) {
    for (a3 = /* @__PURE__ */ new Map(); null !== b3; )
      null !== b3.key ? a3.set(b3.key, b3) : a3.set(b3.index, b3), b3 = b3.sibling;
    return a3;
  }
  function e2(a3, b3) {
    a3 = wh(a3, b3);
    a3.index = 0;
    a3.sibling = null;
    return a3;
  }
  function f2(b3, c7, d3) {
    b3.index = d3;
    if (!a2)
      return b3.flags |= 1048576, c7;
    d3 = b3.alternate;
    if (null !== d3)
      return d3 = d3.index, d3 < c7 ? (b3.flags |= 2, c7) : d3;
    b3.flags |= 2;
    return c7;
  }
  function g2(b3) {
    a2 && null === b3.alternate && (b3.flags |= 2);
    return b3;
  }
  function h2(a3, b3, c7, d3) {
    if (null === b3 || 6 !== b3.tag)
      return b3 = xh(c7, a3.mode, d3), b3.return = a3, b3;
    b3 = e2(b3, c7);
    b3.return = a3;
    return b3;
  }
  function k2(a3, b3, c7, d3) {
    var f3 = c7.type;
    if (f3 === ya)
      return m2(a3, b3, c7.props.children, d3, c7.key);
    if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && uh(f3) === b3.type))
      return d3 = e2(b3, c7.props), d3.ref = sh(a3, b3, c7), d3.return = a3, d3;
    d3 = yh(c7.type, c7.key, c7.props, null, a3.mode, d3);
    d3.ref = sh(a3, b3, c7);
    d3.return = a3;
    return d3;
  }
  function l2(a3, b3, c7, d3) {
    if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c7.containerInfo || b3.stateNode.implementation !== c7.implementation)
      return b3 = zh(c7, a3.mode, d3), b3.return = a3, b3;
    b3 = e2(b3, c7.children || []);
    b3.return = a3;
    return b3;
  }
  function m2(a3, b3, c7, d3, f3) {
    if (null === b3 || 7 !== b3.tag)
      return b3 = Ah(c7, a3.mode, d3, f3), b3.return = a3, b3;
    b3 = e2(b3, c7);
    b3.return = a3;
    return b3;
  }
  function q2(a3, b3, c7) {
    if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3)
      return b3 = xh("" + b3, a3.mode, c7), b3.return = a3, b3;
    if ("object" === typeof b3 && null !== b3) {
      switch (b3.$$typeof) {
        case va:
          return c7 = yh(b3.type, b3.key, b3.props, null, a3.mode, c7), c7.ref = sh(a3, null, b3), c7.return = a3, c7;
        case wa:
          return b3 = zh(b3, a3.mode, c7), b3.return = a3, b3;
        case Ha:
          var d3 = b3._init;
          return q2(a3, d3(b3._payload), c7);
      }
      if (eb(b3) || Ka(b3))
        return b3 = Ah(b3, a3.mode, c7, null), b3.return = a3, b3;
      th(a3, b3);
    }
    return null;
  }
  function r2(a3, b3, c7, d3) {
    var e3 = null !== b3 ? b3.key : null;
    if ("string" === typeof c7 && "" !== c7 || "number" === typeof c7)
      return null !== e3 ? null : h2(a3, b3, "" + c7, d3);
    if ("object" === typeof c7 && null !== c7) {
      switch (c7.$$typeof) {
        case va:
          return c7.key === e3 ? k2(a3, b3, c7, d3) : null;
        case wa:
          return c7.key === e3 ? l2(a3, b3, c7, d3) : null;
        case Ha:
          return e3 = c7._init, r2(
            a3,
            b3,
            e3(c7._payload),
            d3
          );
      }
      if (eb(c7) || Ka(c7))
        return null !== e3 ? null : m2(a3, b3, c7, d3, null);
      th(a3, c7);
    }
    return null;
  }
  function y2(a3, b3, c7, d3, e3) {
    if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3)
      return a3 = a3.get(c7) || null, h2(b3, a3, "" + d3, e3);
    if ("object" === typeof d3 && null !== d3) {
      switch (d3.$$typeof) {
        case va:
          return a3 = a3.get(null === d3.key ? c7 : d3.key) || null, k2(b3, a3, d3, e3);
        case wa:
          return a3 = a3.get(null === d3.key ? c7 : d3.key) || null, l2(b3, a3, d3, e3);
        case Ha:
          var f3 = d3._init;
          return y2(a3, b3, c7, f3(d3._payload), e3);
      }
      if (eb(d3) || Ka(d3))
        return a3 = a3.get(c7) || null, m2(b3, a3, d3, e3, null);
      th(b3, d3);
    }
    return null;
  }
  function n2(e3, g3, h3, k3) {
    for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e3, u2, h3[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a2 && u2 && null === n3.alternate && b2(e3, u2);
      g3 = f2(n3, g3, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h3.length)
      return c6(e3, u2), I$2 && tg(e3, w2), l3;
    if (null === u2) {
      for (; w2 < h3.length; w2++)
        u2 = q2(e3, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I$2 && tg(e3, w2);
      return l3;
    }
    for (u2 = d2(e3, u2); w2 < h3.length; w2++)
      x2 = y2(u2, e3, w2, h3[w2], k3), null !== x2 && (a2 && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a2 && u2.forEach(function(a3) {
      return b2(e3, a3);
    });
    I$2 && tg(e3, w2);
    return l3;
  }
  function t2(e3, g3, h3, k3) {
    var l3 = Ka(h3);
    if ("function" !== typeof l3)
      throw Error(p$a(150));
    h3 = l3.call(h3);
    if (null == h3)
      throw Error(p$a(151));
    for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e3, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a2 && m3 && null === t3.alternate && b2(e3, m3);
      g3 = f2(t3, g3, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done)
      return c6(
        e3,
        m3
      ), I$2 && tg(e3, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h3.next())
        n3 = q2(e3, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I$2 && tg(e3, w2);
      return l3;
    }
    for (m3 = d2(e3, m3); !n3.done; w2++, n3 = h3.next())
      n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a2 && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a2 && m3.forEach(function(a3) {
      return b2(e3, a3);
    });
    I$2 && tg(e3, w2);
    return l3;
  }
  function J2(a3, d3, f3, h3) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d3; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c6(a3, l3.sibling);
                    d3 = e2(l3, f3.props.children);
                    d3.return = a3;
                    a3 = d3;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && uh(k3) === l3.type) {
                  c6(a3, l3.sibling);
                  d3 = e2(l3, f3.props);
                  d3.ref = sh(a3, l3, f3);
                  d3.return = a3;
                  a3 = d3;
                  break a;
                }
                c6(a3, l3);
                break;
              } else
                b2(a3, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d3 = Ah(f3.props.children, a3.mode, h3, f3.key), d3.return = a3, a3 = d3) : (h3 = yh(f3.type, f3.key, f3.props, null, a3.mode, h3), h3.ref = sh(a3, d3, f3), h3.return = a3, a3 = h3);
          }
          return g2(a3);
        case wa:
          a: {
            for (l3 = f3.key; null !== d3; ) {
              if (d3.key === l3)
                if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                  c6(a3, d3.sibling);
                  d3 = e2(d3, f3.children || []);
                  d3.return = a3;
                  a3 = d3;
                  break a;
                } else {
                  c6(a3, d3);
                  break;
                }
              else
                b2(a3, d3);
              d3 = d3.sibling;
            }
            d3 = zh(f3, a3.mode, h3);
            d3.return = a3;
            a3 = d3;
          }
          return g2(a3);
        case Ha:
          return l3 = f3._init, J2(a3, d3, l3(f3._payload), h3);
      }
      if (eb(f3))
        return n2(a3, d3, f3, h3);
      if (Ka(f3))
        return t2(a3, d3, f3, h3);
      th(a3, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c6(a3, d3.sibling), d3 = e2(d3, f3), d3.return = a3, a3 = d3) : (c6(a3, d3), d3 = xh(f3, a3.mode, h3), d3.return = a3, a3 = d3), g2(a3)) : c6(a3, d3);
  }
  return J2;
}
var Bh = vh(true), Ch = vh(false), Dh = {}, Eh = Uf(Dh), Fh = Uf(Dh), Gh = Uf(Dh);
function Hh(a2) {
  if (a2 === Dh)
    throw Error(p$a(174));
  return a2;
}
function Ih(a2, b2) {
  G$2(Gh, b2);
  G$2(Fh, a2);
  G$2(Eh, Dh);
  a2 = b2.nodeType;
  switch (a2) {
    case 9:
    case 11:
      b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
      break;
    default:
      a2 = 8 === a2 ? b2.parentNode : b2, b2 = a2.namespaceURI || null, a2 = a2.tagName, b2 = lb(b2, a2);
  }
  E$2(Eh);
  G$2(Eh, b2);
}
function Jh() {
  E$2(Eh);
  E$2(Fh);
  E$2(Gh);
}
function Kh(a2) {
  Hh(Gh.current);
  var b2 = Hh(Eh.current);
  var c6 = lb(b2, a2.type);
  b2 !== c6 && (G$2(Fh, a2), G$2(Eh, c6));
}
function Lh(a2) {
  Fh.current === a2 && (E$2(Eh), E$2(Fh));
}
var M$2 = Uf(0);
function Mh(a2) {
  for (var b2 = a2; null !== b2; ) {
    if (13 === b2.tag) {
      var c6 = b2.memoizedState;
      if (null !== c6 && (c6 = c6.dehydrated, null === c6 || "$?" === c6.data || "$!" === c6.data))
        return b2;
    } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
      if (0 !== (b2.flags & 128))
        return b2;
    } else if (null !== b2.child) {
      b2.child.return = b2;
      b2 = b2.child;
      continue;
    }
    if (b2 === a2)
      break;
    for (; null === b2.sibling; ) {
      if (null === b2.return || b2.return === a2)
        return null;
      b2 = b2.return;
    }
    b2.sibling.return = b2.return;
    b2 = b2.sibling;
  }
  return null;
}
var Nh = [];
function Oh() {
  for (var a2 = 0; a2 < Nh.length; a2++)
    Nh[a2]._workInProgressVersionPrimary = null;
  Nh.length = 0;
}
var Ph = ua.ReactCurrentDispatcher, Qh = ua.ReactCurrentBatchConfig, Rh = 0, N$2 = null, O$2 = null, P$2 = null, Sh = false, Th = false, Uh = 0, Vh = 0;
function Q$2() {
  throw Error(p$a(321));
}
function Wh(a2, b2) {
  if (null === b2)
    return false;
  for (var c6 = 0; c6 < b2.length && c6 < a2.length; c6++)
    if (!He(a2[c6], b2[c6]))
      return false;
  return true;
}
function Xh(a2, b2, c6, d2, e2, f2) {
  Rh = f2;
  N$2 = b2;
  b2.memoizedState = null;
  b2.updateQueue = null;
  b2.lanes = 0;
  Ph.current = null === a2 || null === a2.memoizedState ? Yh : Zh;
  a2 = c6(d2, e2);
  if (Th) {
    f2 = 0;
    do {
      Th = false;
      Uh = 0;
      if (25 <= f2)
        throw Error(p$a(301));
      f2 += 1;
      P$2 = O$2 = null;
      b2.updateQueue = null;
      Ph.current = $h;
      a2 = c6(d2, e2);
    } while (Th);
  }
  Ph.current = ai;
  b2 = null !== O$2 && null !== O$2.next;
  Rh = 0;
  P$2 = O$2 = N$2 = null;
  Sh = false;
  if (b2)
    throw Error(p$a(300));
  return a2;
}
function bi() {
  var a2 = 0 !== Uh;
  Uh = 0;
  return a2;
}
function ci() {
  var a2 = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === P$2 ? N$2.memoizedState = P$2 = a2 : P$2 = P$2.next = a2;
  return P$2;
}
function di() {
  if (null === O$2) {
    var a2 = N$2.alternate;
    a2 = null !== a2 ? a2.memoizedState : null;
  } else
    a2 = O$2.next;
  var b2 = null === P$2 ? N$2.memoizedState : P$2.next;
  if (null !== b2)
    P$2 = b2, O$2 = a2;
  else {
    if (null === a2)
      throw Error(p$a(310));
    O$2 = a2;
    a2 = { memoizedState: O$2.memoizedState, baseState: O$2.baseState, baseQueue: O$2.baseQueue, queue: O$2.queue, next: null };
    null === P$2 ? N$2.memoizedState = P$2 = a2 : P$2 = P$2.next = a2;
  }
  return P$2;
}
function ei(a2, b2) {
  return "function" === typeof b2 ? b2(a2) : b2;
}
function fi(a2) {
  var b2 = di(), c6 = b2.queue;
  if (null === c6)
    throw Error(p$a(311));
  c6.lastRenderedReducer = a2;
  var d2 = O$2, e2 = d2.baseQueue, f2 = c6.pending;
  if (null !== f2) {
    if (null !== e2) {
      var g2 = e2.next;
      e2.next = f2.next;
      f2.next = g2;
    }
    d2.baseQueue = e2 = f2;
    c6.pending = null;
  }
  if (null !== e2) {
    f2 = e2.next;
    d2 = d2.baseState;
    var h2 = g2 = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Rh & m2) === m2)
        null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a2(d2, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
        N$2.lanes |= m2;
        hh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g2 = d2 : k2.next = h2;
    He(d2, b2.memoizedState) || (Ug = true);
    b2.memoizedState = d2;
    b2.baseState = g2;
    b2.baseQueue = k2;
    c6.lastRenderedState = d2;
  }
  a2 = c6.interleaved;
  if (null !== a2) {
    e2 = a2;
    do
      f2 = e2.lane, N$2.lanes |= f2, hh |= f2, e2 = e2.next;
    while (e2 !== a2);
  } else
    null === e2 && (c6.lanes = 0);
  return [b2.memoizedState, c6.dispatch];
}
function gi(a2) {
  var b2 = di(), c6 = b2.queue;
  if (null === c6)
    throw Error(p$a(311));
  c6.lastRenderedReducer = a2;
  var d2 = c6.dispatch, e2 = c6.pending, f2 = b2.memoizedState;
  if (null !== e2) {
    c6.pending = null;
    var g2 = e2 = e2.next;
    do
      f2 = a2(f2, g2.action), g2 = g2.next;
    while (g2 !== e2);
    He(f2, b2.memoizedState) || (Ug = true);
    b2.memoizedState = f2;
    null === b2.baseQueue && (b2.baseState = f2);
    c6.lastRenderedState = f2;
  }
  return [f2, d2];
}
function hi() {
}
function ii(a2, b2) {
  var c6 = N$2, d2 = di(), e2 = b2(), f2 = !He(d2.memoizedState, e2);
  f2 && (d2.memoizedState = e2, Ug = true);
  d2 = d2.queue;
  ji(ki.bind(null, c6, d2, a2), [a2]);
  if (d2.getSnapshot !== b2 || f2 || null !== P$2 && P$2.memoizedState.tag & 1) {
    c6.flags |= 2048;
    li(9, mi.bind(null, c6, d2, e2, b2), void 0, null);
    if (null === R$2)
      throw Error(p$a(349));
    0 !== (Rh & 30) || ni(c6, b2, e2);
  }
  return e2;
}
function ni(a2, b2, c6) {
  a2.flags |= 16384;
  a2 = { getSnapshot: b2, value: c6 };
  b2 = N$2.updateQueue;
  null === b2 ? (b2 = { lastEffect: null, stores: null }, N$2.updateQueue = b2, b2.stores = [a2]) : (c6 = b2.stores, null === c6 ? b2.stores = [a2] : c6.push(a2));
}
function mi(a2, b2, c6, d2) {
  b2.value = c6;
  b2.getSnapshot = d2;
  oi(b2) && pi(a2);
}
function ki(a2, b2, c6) {
  return c6(function() {
    oi(b2) && pi(a2);
  });
}
function oi(a2) {
  var b2 = a2.getSnapshot;
  a2 = a2.value;
  try {
    var c6 = b2();
    return !He(a2, c6);
  } catch (d2) {
    return true;
  }
}
function pi(a2) {
  var b2 = Zg(a2, 1);
  null !== b2 && mh(b2, a2, 1, -1);
}
function qi(a2) {
  var b2 = ci();
  "function" === typeof a2 && (a2 = a2());
  b2.memoizedState = b2.baseState = a2;
  a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ei, lastRenderedState: a2 };
  b2.queue = a2;
  a2 = a2.dispatch = ri.bind(null, N$2, a2);
  return [b2.memoizedState, a2];
}
function li(a2, b2, c6, d2) {
  a2 = { tag: a2, create: b2, destroy: c6, deps: d2, next: null };
  b2 = N$2.updateQueue;
  null === b2 ? (b2 = { lastEffect: null, stores: null }, N$2.updateQueue = b2, b2.lastEffect = a2.next = a2) : (c6 = b2.lastEffect, null === c6 ? b2.lastEffect = a2.next = a2 : (d2 = c6.next, c6.next = a2, a2.next = d2, b2.lastEffect = a2));
  return a2;
}
function si() {
  return di().memoizedState;
}
function ti(a2, b2, c6, d2) {
  var e2 = ci();
  N$2.flags |= a2;
  e2.memoizedState = li(1 | b2, c6, void 0, void 0 === d2 ? null : d2);
}
function ui(a2, b2, c6, d2) {
  var e2 = di();
  d2 = void 0 === d2 ? null : d2;
  var f2 = void 0;
  if (null !== O$2) {
    var g2 = O$2.memoizedState;
    f2 = g2.destroy;
    if (null !== d2 && Wh(d2, g2.deps)) {
      e2.memoizedState = li(b2, c6, f2, d2);
      return;
    }
  }
  N$2.flags |= a2;
  e2.memoizedState = li(1 | b2, c6, f2, d2);
}
function vi(a2, b2) {
  return ti(8390656, 8, a2, b2);
}
function ji(a2, b2) {
  return ui(2048, 8, a2, b2);
}
function wi(a2, b2) {
  return ui(4, 2, a2, b2);
}
function xi(a2, b2) {
  return ui(4, 4, a2, b2);
}
function yi(a2, b2) {
  if ("function" === typeof b2)
    return a2 = a2(), b2(a2), function() {
      b2(null);
    };
  if (null !== b2 && void 0 !== b2)
    return a2 = a2(), b2.current = a2, function() {
      b2.current = null;
    };
}
function zi(a2, b2, c6) {
  c6 = null !== c6 && void 0 !== c6 ? c6.concat([a2]) : null;
  return ui(4, 4, yi.bind(null, b2, a2), c6);
}
function Ai() {
}
function Bi(a2, b2) {
  var c6 = di();
  b2 = void 0 === b2 ? null : b2;
  var d2 = c6.memoizedState;
  if (null !== d2 && null !== b2 && Wh(b2, d2[1]))
    return d2[0];
  c6.memoizedState = [a2, b2];
  return a2;
}
function Ci(a2, b2) {
  var c6 = di();
  b2 = void 0 === b2 ? null : b2;
  var d2 = c6.memoizedState;
  if (null !== d2 && null !== b2 && Wh(b2, d2[1]))
    return d2[0];
  a2 = a2();
  c6.memoizedState = [a2, b2];
  return a2;
}
function Di(a2, b2, c6) {
  if (0 === (Rh & 21))
    return a2.baseState && (a2.baseState = false, Ug = true), a2.memoizedState = c6;
  He(c6, b2) || (c6 = yc(), N$2.lanes |= c6, hh |= c6, a2.baseState = true);
  return b2;
}
function Ei(a2, b2) {
  var c6 = C;
  C = 0 !== c6 && 4 > c6 ? c6 : 4;
  a2(true);
  var d2 = Qh.transition;
  Qh.transition = {};
  try {
    a2(false), b2();
  } finally {
    C = c6, Qh.transition = d2;
  }
}
function Fi() {
  return di().memoizedState;
}
function Gi(a2, b2, c6) {
  var d2 = lh(a2);
  c6 = { lane: d2, action: c6, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a2))
    Ii(b2, c6);
  else if (c6 = Yg(a2, b2, c6, d2), null !== c6) {
    var e2 = L$2();
    mh(c6, a2, d2, e2);
    Ji(c6, b2, d2);
  }
}
function ri(a2, b2, c6) {
  var d2 = lh(a2), e2 = { lane: d2, action: c6, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a2))
    Ii(b2, e2);
  else {
    var f2 = a2.alternate;
    if (0 === a2.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2))
      try {
        var g2 = b2.lastRenderedState, h2 = f2(g2, c6);
        e2.hasEagerState = true;
        e2.eagerState = h2;
        if (He(h2, g2)) {
          var k2 = b2.interleaved;
          null === k2 ? (e2.next = e2, Xg(b2)) : (e2.next = k2.next, k2.next = e2);
          b2.interleaved = e2;
          return;
        }
      } catch (l2) {
      } finally {
      }
    c6 = Yg(a2, b2, e2, d2);
    null !== c6 && (e2 = L$2(), mh(c6, a2, d2, e2), Ji(c6, b2, d2));
  }
}
function Hi(a2) {
  var b2 = a2.alternate;
  return a2 === N$2 || null !== b2 && b2 === N$2;
}
function Ii(a2, b2) {
  Th = Sh = true;
  var c6 = a2.pending;
  null === c6 ? b2.next = b2 : (b2.next = c6.next, c6.next = b2);
  a2.pending = b2;
}
function Ji(a2, b2, c6) {
  if (0 !== (c6 & 4194240)) {
    var d2 = b2.lanes;
    d2 &= a2.pendingLanes;
    c6 |= d2;
    b2.lanes = c6;
    Cc(a2, c6);
  }
}
var ai = { readContext: Vg, useCallback: Q$2, useContext: Q$2, useEffect: Q$2, useImperativeHandle: Q$2, useInsertionEffect: Q$2, useLayoutEffect: Q$2, useMemo: Q$2, useReducer: Q$2, useRef: Q$2, useState: Q$2, useDebugValue: Q$2, useDeferredValue: Q$2, useTransition: Q$2, useMutableSource: Q$2, useSyncExternalStore: Q$2, useId: Q$2, unstable_isNewReconciler: false }, Yh = { readContext: Vg, useCallback: function(a2, b2) {
  ci().memoizedState = [a2, void 0 === b2 ? null : b2];
  return a2;
}, useContext: Vg, useEffect: vi, useImperativeHandle: function(a2, b2, c6) {
  c6 = null !== c6 && void 0 !== c6 ? c6.concat([a2]) : null;
  return ti(
    4194308,
    4,
    yi.bind(null, b2, a2),
    c6
  );
}, useLayoutEffect: function(a2, b2) {
  return ti(4194308, 4, a2, b2);
}, useInsertionEffect: function(a2, b2) {
  return ti(4, 2, a2, b2);
}, useMemo: function(a2, b2) {
  var c6 = ci();
  b2 = void 0 === b2 ? null : b2;
  a2 = a2();
  c6.memoizedState = [a2, b2];
  return a2;
}, useReducer: function(a2, b2, c6) {
  var d2 = ci();
  b2 = void 0 !== c6 ? c6(b2) : b2;
  d2.memoizedState = d2.baseState = b2;
  a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a2, lastRenderedState: b2 };
  d2.queue = a2;
  a2 = a2.dispatch = Gi.bind(null, N$2, a2);
  return [d2.memoizedState, a2];
}, useRef: function(a2) {
  var b2 = ci();
  a2 = { current: a2 };
  return b2.memoizedState = a2;
}, useState: qi, useDebugValue: Ai, useDeferredValue: function(a2) {
  return ci().memoizedState = a2;
}, useTransition: function() {
  var a2 = qi(false), b2 = a2[0];
  a2 = Ei.bind(null, a2[1]);
  ci().memoizedState = a2;
  return [b2, a2];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a2, b2, c6) {
  var d2 = N$2, e2 = ci();
  if (I$2) {
    if (void 0 === c6)
      throw Error(p$a(407));
    c6 = c6();
  } else {
    c6 = b2();
    if (null === R$2)
      throw Error(p$a(349));
    0 !== (Rh & 30) || ni(d2, b2, c6);
  }
  e2.memoizedState = c6;
  var f2 = { value: c6, getSnapshot: b2 };
  e2.queue = f2;
  vi(ki.bind(
    null,
    d2,
    f2,
    a2
  ), [a2]);
  d2.flags |= 2048;
  li(9, mi.bind(null, d2, f2, c6, b2), void 0, null);
  return c6;
}, useId: function() {
  var a2 = ci(), b2 = R$2.identifierPrefix;
  if (I$2) {
    var c6 = sg;
    var d2 = rg;
    c6 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c6;
    b2 = ":" + b2 + "R" + c6;
    c6 = Uh++;
    0 < c6 && (b2 += "H" + c6.toString(32));
    b2 += ":";
  } else
    c6 = Vh++, b2 = ":" + b2 + "r" + c6.toString(32) + ":";
  return a2.memoizedState = b2;
}, unstable_isNewReconciler: false }, Zh = {
  readContext: Vg,
  useCallback: Bi,
  useContext: Vg,
  useEffect: ji,
  useImperativeHandle: zi,
  useInsertionEffect: wi,
  useLayoutEffect: xi,
  useMemo: Ci,
  useReducer: fi,
  useRef: si,
  useState: function() {
    return fi(ei);
  },
  useDebugValue: Ai,
  useDeferredValue: function(a2) {
    var b2 = di();
    return Di(b2, O$2.memoizedState, a2);
  },
  useTransition: function() {
    var a2 = fi(ei)[0], b2 = di().memoizedState;
    return [a2, b2];
  },
  useMutableSource: hi,
  useSyncExternalStore: ii,
  useId: Fi,
  unstable_isNewReconciler: false
}, $h = { readContext: Vg, useCallback: Bi, useContext: Vg, useEffect: ji, useImperativeHandle: zi, useInsertionEffect: wi, useLayoutEffect: xi, useMemo: Ci, useReducer: gi, useRef: si, useState: function() {
  return gi(ei);
}, useDebugValue: Ai, useDeferredValue: function(a2) {
  var b2 = di();
  return null === O$2 ? b2.memoizedState = a2 : Di(b2, O$2.memoizedState, a2);
}, useTransition: function() {
  var a2 = gi(ei)[0], b2 = di().memoizedState;
  return [a2, b2];
}, useMutableSource: hi, useSyncExternalStore: ii, useId: Fi, unstable_isNewReconciler: false };
function Ki(a2, b2) {
  try {
    var c6 = "", d2 = b2;
    do
      c6 += Pa(d2), d2 = d2.return;
    while (d2);
    var e2 = c6;
  } catch (f2) {
    e2 = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a2, source: b2, stack: e2, digest: null };
}
function Li(a2, b2, c6) {
  return { value: a2, source: null, stack: null != c6 ? c6 : null, digest: null != b2 ? b2 : null };
}
function Mi(a2, b2) {
  try {
    console.error(b2.value);
  } catch (c6) {
    setTimeout(function() {
      throw c6;
    });
  }
}
var Ni = "function" === typeof WeakMap ? WeakMap : Map;
function Oi(a2, b2, c6) {
  c6 = ch(-1, c6);
  c6.tag = 3;
  c6.payload = { element: null };
  var d2 = b2.value;
  c6.callback = function() {
    Pi || (Pi = true, Qi = d2);
    Mi(a2, b2);
  };
  return c6;
}
function Ri(a2, b2, c6) {
  c6 = ch(-1, c6);
  c6.tag = 3;
  var d2 = a2.type.getDerivedStateFromError;
  if ("function" === typeof d2) {
    var e2 = b2.value;
    c6.payload = function() {
      return d2(e2);
    };
    c6.callback = function() {
      Mi(a2, b2);
    };
  }
  var f2 = a2.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c6.callback = function() {
    Mi(a2, b2);
    "function" !== typeof d2 && (null === Si ? Si = /* @__PURE__ */ new Set([this]) : Si.add(this));
    var c7 = b2.stack;
    this.componentDidCatch(b2.value, { componentStack: null !== c7 ? c7 : "" });
  });
  return c6;
}
function Ti(a2, b2, c6) {
  var d2 = a2.pingCache;
  if (null === d2) {
    d2 = a2.pingCache = new Ni();
    var e2 = /* @__PURE__ */ new Set();
    d2.set(b2, e2);
  } else
    e2 = d2.get(b2), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d2.set(b2, e2));
  e2.has(c6) || (e2.add(c6), a2 = Ui.bind(null, a2, b2, c6), b2.then(a2, a2));
}
function Vi(a2) {
  do {
    var b2;
    if (b2 = 13 === a2.tag)
      b2 = a2.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
    if (b2)
      return a2;
    a2 = a2.return;
  } while (null !== a2);
  return null;
}
function Wi(a2, b2, c6, d2, e2) {
  if (0 === (a2.mode & 1))
    return a2 === b2 ? a2.flags |= 65536 : (a2.flags |= 128, c6.flags |= 131072, c6.flags &= -52805, 1 === c6.tag && (null === c6.alternate ? c6.tag = 17 : (b2 = ch(-1, 1), b2.tag = 2, dh(c6, b2, 1))), c6.lanes |= 1), a2;
  a2.flags |= 65536;
  a2.lanes = e2;
  return a2;
}
var Xi = ua.ReactCurrentOwner, Ug = false;
function Yi(a2, b2, c6, d2) {
  b2.child = null === a2 ? Ch(b2, null, c6, d2) : Bh(b2, a2.child, c6, d2);
}
function Zi(a2, b2, c6, d2, e2) {
  c6 = c6.render;
  var f2 = b2.ref;
  Tg(b2, e2);
  d2 = Xh(a2, b2, c6, d2, f2, e2);
  c6 = bi();
  if (null !== a2 && !Ug)
    return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e2, $i(a2, b2, e2);
  I$2 && c6 && vg(b2);
  b2.flags |= 1;
  Yi(a2, b2, d2, e2);
  return b2.child;
}
function aj(a2, b2, c6, d2, e2) {
  if (null === a2) {
    var f2 = c6.type;
    if ("function" === typeof f2 && !bj(f2) && void 0 === f2.defaultProps && null === c6.compare && void 0 === c6.defaultProps)
      return b2.tag = 15, b2.type = f2, cj(a2, b2, f2, d2, e2);
    a2 = yh(c6.type, null, d2, b2, b2.mode, e2);
    a2.ref = b2.ref;
    a2.return = b2;
    return b2.child = a2;
  }
  f2 = a2.child;
  if (0 === (a2.lanes & e2)) {
    var g2 = f2.memoizedProps;
    c6 = c6.compare;
    c6 = null !== c6 ? c6 : Ie;
    if (c6(g2, d2) && a2.ref === b2.ref)
      return $i(a2, b2, e2);
  }
  b2.flags |= 1;
  a2 = wh(f2, d2);
  a2.ref = b2.ref;
  a2.return = b2;
  return b2.child = a2;
}
function cj(a2, b2, c6, d2, e2) {
  if (null !== a2) {
    var f2 = a2.memoizedProps;
    if (Ie(f2, d2) && a2.ref === b2.ref)
      if (Ug = false, b2.pendingProps = d2 = f2, 0 !== (a2.lanes & e2))
        0 !== (a2.flags & 131072) && (Ug = true);
      else
        return b2.lanes = a2.lanes, $i(a2, b2, e2);
  }
  return dj(a2, b2, c6, d2, e2);
}
function ej(a2, b2, c6) {
  var d2 = b2.pendingProps, e2 = d2.children, f2 = null !== a2 ? a2.memoizedState : null;
  if ("hidden" === d2.mode)
    if (0 === (b2.mode & 1))
      b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G$2(fj, gj), gj |= c6;
    else {
      if (0 === (c6 & 1073741824))
        return a2 = null !== f2 ? f2.baseLanes | c6 : c6, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a2, cachePool: null, transitions: null }, b2.updateQueue = null, G$2(fj, gj), gj |= a2, null;
      b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d2 = null !== f2 ? f2.baseLanes : c6;
      G$2(fj, gj);
      gj |= d2;
    }
  else
    null !== f2 ? (d2 = f2.baseLanes | c6, b2.memoizedState = null) : d2 = c6, G$2(fj, gj), gj |= d2;
  Yi(a2, b2, e2, c6);
  return b2.child;
}
function hj(a2, b2) {
  var c6 = b2.ref;
  if (null === a2 && null !== c6 || null !== a2 && a2.ref !== c6)
    b2.flags |= 512, b2.flags |= 2097152;
}
function dj(a2, b2, c6, d2, e2) {
  var f2 = Zf(c6) ? Xf : H$2.current;
  f2 = Yf(b2, f2);
  Tg(b2, e2);
  c6 = Xh(a2, b2, c6, d2, f2, e2);
  d2 = bi();
  if (null !== a2 && !Ug)
    return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e2, $i(a2, b2, e2);
  I$2 && d2 && vg(b2);
  b2.flags |= 1;
  Yi(a2, b2, c6, e2);
  return b2.child;
}
function ij(a2, b2, c6, d2, e2) {
  if (Zf(c6)) {
    var f2 = true;
    cg(b2);
  } else
    f2 = false;
  Tg(b2, e2);
  if (null === b2.stateNode)
    jj(a2, b2), ph(b2, c6, d2), rh(b2, c6, d2, e2), d2 = true;
  else if (null === a2) {
    var g2 = b2.stateNode, h2 = b2.memoizedProps;
    g2.props = h2;
    var k2 = g2.context, l2 = c6.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = Vg(l2) : (l2 = Zf(c6) ? Xf : H$2.current, l2 = Yf(b2, l2));
    var m2 = c6.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && qh(b2, g2, d2, l2);
    $g = false;
    var r2 = b2.memoizedState;
    g2.state = r2;
    gh(b2, d2, g2, e2);
    k2 = b2.memoizedState;
    h2 !== d2 || r2 !== k2 || Wf.current || $g ? ("function" === typeof m2 && (kh(b2, c6, m2, d2), k2 = b2.memoizedState), (h2 = $g || oh(b2, c6, h2, d2, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d2, b2.memoizedState = k2), g2.props = d2, g2.state = k2, g2.context = l2, d2 = h2) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), d2 = false);
  } else {
    g2 = b2.stateNode;
    bh(a2, b2);
    h2 = b2.memoizedProps;
    l2 = b2.type === b2.elementType ? h2 : Lg(b2.type, h2);
    g2.props = l2;
    q2 = b2.pendingProps;
    r2 = g2.context;
    k2 = c6.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = Vg(k2) : (k2 = Zf(c6) ? Xf : H$2.current, k2 = Yf(b2, k2));
    var y2 = c6.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && qh(b2, g2, d2, k2);
    $g = false;
    r2 = b2.memoizedState;
    g2.state = r2;
    gh(b2, d2, g2, e2);
    var n2 = b2.memoizedState;
    h2 !== q2 || r2 !== n2 || Wf.current || $g ? ("function" === typeof y2 && (kh(b2, c6, y2, d2), n2 = b2.memoizedState), (l2 = $g || oh(b2, c6, l2, d2, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), d2 = false);
  }
  return kj(a2, b2, c6, d2, f2, e2);
}
function kj(a2, b2, c6, d2, e2, f2) {
  hj(a2, b2);
  var g2 = 0 !== (b2.flags & 128);
  if (!d2 && !g2)
    return e2 && dg(b2, c6, false), $i(a2, b2, f2);
  d2 = b2.stateNode;
  Xi.current = b2;
  var h2 = g2 && "function" !== typeof c6.getDerivedStateFromError ? null : d2.render();
  b2.flags |= 1;
  null !== a2 && g2 ? (b2.child = Bh(b2, a2.child, null, f2), b2.child = Bh(b2, null, h2, f2)) : Yi(a2, b2, h2, f2);
  b2.memoizedState = d2.state;
  e2 && dg(b2, c6, true);
  return b2.child;
}
function lj(a2) {
  var b2 = a2.stateNode;
  b2.pendingContext ? ag(a2, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a2, b2.context, false);
  Ih(a2, b2.containerInfo);
}
function mj(a2, b2, c6, d2, e2) {
  Ig();
  Jg(e2);
  b2.flags |= 256;
  Yi(a2, b2, c6, d2);
  return b2.child;
}
var nj = { dehydrated: null, treeContext: null, retryLane: 0 };
function oj(a2) {
  return { baseLanes: a2, cachePool: null, transitions: null };
}
function pj(a2, b2, c6) {
  var d2 = b2.pendingProps, e2 = M$2.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
  (h2 = g2) || (h2 = null !== a2 && null === a2.memoizedState ? false : 0 !== (e2 & 2));
  if (h2)
    f2 = true, b2.flags &= -129;
  else if (null === a2 || null !== a2.memoizedState)
    e2 |= 1;
  G$2(M$2, e2 & 1);
  if (null === a2) {
    Eg(b2);
    a2 = b2.memoizedState;
    if (null !== a2 && (a2 = a2.dehydrated, null !== a2))
      return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a2.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
    g2 = d2.children;
    a2 = d2.fallback;
    return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = qj(g2, d2, 0, null), a2 = Ah(a2, d2, c6, null), f2.return = b2, a2.return = b2, f2.sibling = a2, b2.child = f2, b2.child.memoizedState = oj(c6), b2.memoizedState = nj, a2) : rj(b2, g2);
  }
  e2 = a2.memoizedState;
  if (null !== e2 && (h2 = e2.dehydrated, null !== h2))
    return sj(a2, b2, g2, d2, h2, e2, c6);
  if (f2) {
    f2 = d2.fallback;
    g2 = b2.mode;
    e2 = a2.child;
    h2 = e2.sibling;
    var k2 = { mode: "hidden", children: d2.children };
    0 === (g2 & 1) && b2.child !== e2 ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = wh(e2, k2), d2.subtreeFlags = e2.subtreeFlags & 14680064);
    null !== h2 ? f2 = wh(h2, f2) : (f2 = Ah(f2, g2, c6, null), f2.flags |= 2);
    f2.return = b2;
    d2.return = b2;
    d2.sibling = f2;
    b2.child = d2;
    d2 = f2;
    f2 = b2.child;
    g2 = a2.child.memoizedState;
    g2 = null === g2 ? oj(c6) : { baseLanes: g2.baseLanes | c6, cachePool: null, transitions: g2.transitions };
    f2.memoizedState = g2;
    f2.childLanes = a2.childLanes & ~c6;
    b2.memoizedState = nj;
    return d2;
  }
  f2 = a2.child;
  a2 = f2.sibling;
  d2 = wh(f2, { mode: "visible", children: d2.children });
  0 === (b2.mode & 1) && (d2.lanes = c6);
  d2.return = b2;
  d2.sibling = null;
  null !== a2 && (c6 = b2.deletions, null === c6 ? (b2.deletions = [a2], b2.flags |= 16) : c6.push(a2));
  b2.child = d2;
  b2.memoizedState = null;
  return d2;
}
function rj(a2, b2) {
  b2 = qj({ mode: "visible", children: b2 }, a2.mode, 0, null);
  b2.return = a2;
  return a2.child = b2;
}
function tj(a2, b2, c6, d2) {
  null !== d2 && Jg(d2);
  Bh(b2, a2.child, null, c6);
  a2 = rj(b2, b2.pendingProps.children);
  a2.flags |= 2;
  b2.memoizedState = null;
  return a2;
}
function sj(a2, b2, c6, d2, e2, f2, g2) {
  if (c6) {
    if (b2.flags & 256)
      return b2.flags &= -257, d2 = Li(Error(p$a(422))), tj(a2, b2, g2, d2);
    if (null !== b2.memoizedState)
      return b2.child = a2.child, b2.flags |= 128, null;
    f2 = d2.fallback;
    e2 = b2.mode;
    d2 = qj({ mode: "visible", children: d2.children }, e2, 0, null);
    f2 = Ah(f2, e2, g2, null);
    f2.flags |= 2;
    d2.return = b2;
    f2.return = b2;
    d2.sibling = f2;
    b2.child = d2;
    0 !== (b2.mode & 1) && Bh(b2, a2.child, null, g2);
    b2.child.memoizedState = oj(g2);
    b2.memoizedState = nj;
    return f2;
  }
  if (0 === (b2.mode & 1))
    return tj(a2, b2, g2, null);
  if ("$!" === e2.data) {
    d2 = e2.nextSibling && e2.nextSibling.dataset;
    if (d2)
      var h2 = d2.dgst;
    d2 = h2;
    f2 = Error(p$a(419));
    d2 = Li(f2, d2, void 0);
    return tj(a2, b2, g2, d2);
  }
  h2 = 0 !== (g2 & a2.childLanes);
  if (Ug || h2) {
    d2 = R$2;
    if (null !== d2) {
      switch (g2 & -g2) {
        case 4:
          e2 = 2;
          break;
        case 16:
          e2 = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e2 = 32;
          break;
        case 536870912:
          e2 = 268435456;
          break;
        default:
          e2 = 0;
      }
      e2 = 0 !== (e2 & (d2.suspendedLanes | g2)) ? 0 : e2;
      0 !== e2 && e2 !== f2.retryLane && (f2.retryLane = e2, Zg(a2, e2), mh(d2, a2, e2, -1));
    }
    uj();
    d2 = Li(Error(p$a(421)));
    return tj(a2, b2, g2, d2);
  }
  if ("$?" === e2.data)
    return b2.flags |= 128, b2.child = a2.child, b2 = vj.bind(null, a2), e2._reactRetry = b2, null;
  a2 = f2.treeContext;
  yg = Lf(e2.nextSibling);
  xg = b2;
  I$2 = true;
  zg = null;
  null !== a2 && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a2.id, sg = a2.overflow, qg = b2);
  b2 = rj(b2, d2.children);
  b2.flags |= 4096;
  return b2;
}
function wj(a2, b2, c6) {
  a2.lanes |= b2;
  var d2 = a2.alternate;
  null !== d2 && (d2.lanes |= b2);
  Sg(a2.return, b2, c6);
}
function xj(a2, b2, c6, d2, e2) {
  var f2 = a2.memoizedState;
  null === f2 ? a2.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c6, tailMode: e2 } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c6, f2.tailMode = e2);
}
function yj(a2, b2, c6) {
  var d2 = b2.pendingProps, e2 = d2.revealOrder, f2 = d2.tail;
  Yi(a2, b2, d2.children, c6);
  d2 = M$2.current;
  if (0 !== (d2 & 2))
    d2 = d2 & 1 | 2, b2.flags |= 128;
  else {
    if (null !== a2 && 0 !== (a2.flags & 128))
      a:
        for (a2 = b2.child; null !== a2; ) {
          if (13 === a2.tag)
            null !== a2.memoizedState && wj(a2, c6, b2);
          else if (19 === a2.tag)
            wj(a2, c6, b2);
          else if (null !== a2.child) {
            a2.child.return = a2;
            a2 = a2.child;
            continue;
          }
          if (a2 === b2)
            break a;
          for (; null === a2.sibling; ) {
            if (null === a2.return || a2.return === b2)
              break a;
            a2 = a2.return;
          }
          a2.sibling.return = a2.return;
          a2 = a2.sibling;
        }
    d2 &= 1;
  }
  G$2(M$2, d2);
  if (0 === (b2.mode & 1))
    b2.memoizedState = null;
  else
    switch (e2) {
      case "forwards":
        c6 = b2.child;
        for (e2 = null; null !== c6; )
          a2 = c6.alternate, null !== a2 && null === Mh(a2) && (e2 = c6), c6 = c6.sibling;
        c6 = e2;
        null === c6 ? (e2 = b2.child, b2.child = null) : (e2 = c6.sibling, c6.sibling = null);
        xj(b2, false, e2, c6, f2);
        break;
      case "backwards":
        c6 = null;
        e2 = b2.child;
        for (b2.child = null; null !== e2; ) {
          a2 = e2.alternate;
          if (null !== a2 && null === Mh(a2)) {
            b2.child = e2;
            break;
          }
          a2 = e2.sibling;
          e2.sibling = c6;
          c6 = e2;
          e2 = a2;
        }
        xj(b2, true, c6, null, f2);
        break;
      case "together":
        xj(b2, false, null, null, void 0);
        break;
      default:
        b2.memoizedState = null;
    }
  return b2.child;
}
function jj(a2, b2) {
  0 === (b2.mode & 1) && null !== a2 && (a2.alternate = null, b2.alternate = null, b2.flags |= 2);
}
function $i(a2, b2, c6) {
  null !== a2 && (b2.dependencies = a2.dependencies);
  hh |= b2.lanes;
  if (0 === (c6 & b2.childLanes))
    return null;
  if (null !== a2 && b2.child !== a2.child)
    throw Error(p$a(153));
  if (null !== b2.child) {
    a2 = b2.child;
    c6 = wh(a2, a2.pendingProps);
    b2.child = c6;
    for (c6.return = b2; null !== a2.sibling; )
      a2 = a2.sibling, c6 = c6.sibling = wh(a2, a2.pendingProps), c6.return = b2;
    c6.sibling = null;
  }
  return b2.child;
}
function zj(a2, b2, c6) {
  switch (b2.tag) {
    case 3:
      lj(b2);
      Ig();
      break;
    case 5:
      Kh(b2);
      break;
    case 1:
      Zf(b2.type) && cg(b2);
      break;
    case 4:
      Ih(b2, b2.stateNode.containerInfo);
      break;
    case 10:
      var d2 = b2.type._context, e2 = b2.memoizedProps.value;
      G$2(Mg, d2._currentValue);
      d2._currentValue = e2;
      break;
    case 13:
      d2 = b2.memoizedState;
      if (null !== d2) {
        if (null !== d2.dehydrated)
          return G$2(M$2, M$2.current & 1), b2.flags |= 128, null;
        if (0 !== (c6 & b2.child.childLanes))
          return pj(a2, b2, c6);
        G$2(M$2, M$2.current & 1);
        a2 = $i(a2, b2, c6);
        return null !== a2 ? a2.sibling : null;
      }
      G$2(M$2, M$2.current & 1);
      break;
    case 19:
      d2 = 0 !== (c6 & b2.childLanes);
      if (0 !== (a2.flags & 128)) {
        if (d2)
          return yj(a2, b2, c6);
        b2.flags |= 128;
      }
      e2 = b2.memoizedState;
      null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
      G$2(M$2, M$2.current);
      if (d2)
        break;
      else
        return null;
    case 22:
    case 23:
      return b2.lanes = 0, ej(a2, b2, c6);
  }
  return $i(a2, b2, c6);
}
var Aj, Bj, Cj, Dj;
Aj = function(a2, b2) {
  for (var c6 = b2.child; null !== c6; ) {
    if (5 === c6.tag || 6 === c6.tag)
      a2.appendChild(c6.stateNode);
    else if (4 !== c6.tag && null !== c6.child) {
      c6.child.return = c6;
      c6 = c6.child;
      continue;
    }
    if (c6 === b2)
      break;
    for (; null === c6.sibling; ) {
      if (null === c6.return || c6.return === b2)
        return;
      c6 = c6.return;
    }
    c6.sibling.return = c6.return;
    c6 = c6.sibling;
  }
};
Bj = function() {
};
Cj = function(a2, b2, c6, d2) {
  var e2 = a2.memoizedProps;
  if (e2 !== d2) {
    a2 = b2.stateNode;
    Hh(Eh.current);
    var f2 = null;
    switch (c6) {
      case "input":
        e2 = Ya(a2, e2);
        d2 = Ya(a2, d2);
        f2 = [];
        break;
      case "select":
        e2 = A$4({}, e2, { value: void 0 });
        d2 = A$4({}, d2, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e2 = gb(a2, e2);
        d2 = gb(a2, d2);
        f2 = [];
        break;
      default:
        "function" !== typeof e2.onClick && "function" === typeof d2.onClick && (a2.onclick = Bf);
    }
    ub(c6, d2);
    var g2;
    c6 = null;
    for (l2 in e2)
      if (!d2.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2])
        if ("style" === l2) {
          var h2 = e2[l2];
          for (g2 in h2)
            h2.hasOwnProperty(g2) && (c6 || (c6 = {}), c6[g2] = "");
        } else
          "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d2) {
      var k2 = d2[l2];
      h2 = null != e2 ? e2[l2] : void 0;
      if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2))
        if ("style" === l2)
          if (h2) {
            for (g2 in h2)
              !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c6 || (c6 = {}), c6[g2] = "");
            for (g2 in k2)
              k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c6 || (c6 = {}), c6[g2] = k2[g2]);
          } else
            c6 || (f2 || (f2 = []), f2.push(
              l2,
              c6
            )), c6 = k2;
        else
          "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D$2("scroll", a2), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c6 && (f2 = f2 || []).push("style", c6);
    var l2 = f2;
    if (b2.updateQueue = l2)
      b2.flags |= 4;
  }
};
Dj = function(a2, b2, c6, d2) {
  c6 !== d2 && (b2.flags |= 4);
};
function Ej(a2, b2) {
  if (!I$2)
    switch (a2.tailMode) {
      case "hidden":
        b2 = a2.tail;
        for (var c6 = null; null !== b2; )
          null !== b2.alternate && (c6 = b2), b2 = b2.sibling;
        null === c6 ? a2.tail = null : c6.sibling = null;
        break;
      case "collapsed":
        c6 = a2.tail;
        for (var d2 = null; null !== c6; )
          null !== c6.alternate && (d2 = c6), c6 = c6.sibling;
        null === d2 ? b2 || null === a2.tail ? a2.tail = null : a2.tail.sibling = null : d2.sibling = null;
    }
}
function S$2(a2) {
  var b2 = null !== a2.alternate && a2.alternate.child === a2.child, c6 = 0, d2 = 0;
  if (b2)
    for (var e2 = a2.child; null !== e2; )
      c6 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags & 14680064, d2 |= e2.flags & 14680064, e2.return = a2, e2 = e2.sibling;
  else
    for (e2 = a2.child; null !== e2; )
      c6 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags, d2 |= e2.flags, e2.return = a2, e2 = e2.sibling;
  a2.subtreeFlags |= d2;
  a2.childLanes = c6;
  return b2;
}
function Fj(a2, b2, c6) {
  var d2 = b2.pendingProps;
  wg(b2);
  switch (b2.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S$2(b2), null;
    case 1:
      return Zf(b2.type) && $f(), S$2(b2), null;
    case 3:
      d2 = b2.stateNode;
      Jh();
      E$2(Wf);
      E$2(H$2);
      Oh();
      d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
      if (null === a2 || null === a2.child)
        Gg(b2) ? b2.flags |= 4 : null === a2 || a2.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Gj(zg), zg = null));
      Bj(a2, b2);
      S$2(b2);
      return null;
    case 5:
      Lh(b2);
      var e2 = Hh(Gh.current);
      c6 = b2.type;
      if (null !== a2 && null != b2.stateNode)
        Cj(a2, b2, c6, d2, e2), a2.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
      else {
        if (!d2) {
          if (null === b2.stateNode)
            throw Error(p$a(166));
          S$2(b2);
          return null;
        }
        a2 = Hh(Eh.current);
        if (Gg(b2)) {
          d2 = b2.stateNode;
          c6 = b2.type;
          var f2 = b2.memoizedProps;
          d2[Of] = b2;
          d2[Pf] = f2;
          a2 = 0 !== (b2.mode & 1);
          switch (c6) {
            case "dialog":
              D$2("cancel", d2);
              D$2("close", d2);
              break;
            case "iframe":
            case "object":
            case "embed":
              D$2("load", d2);
              break;
            case "video":
            case "audio":
              for (e2 = 0; e2 < lf.length; e2++)
                D$2(lf[e2], d2);
              break;
            case "source":
              D$2("error", d2);
              break;
            case "img":
            case "image":
            case "link":
              D$2(
                "error",
                d2
              );
              D$2("load", d2);
              break;
            case "details":
              D$2("toggle", d2);
              break;
            case "input":
              Za(d2, f2);
              D$2("invalid", d2);
              break;
            case "select":
              d2._wrapperState = { wasMultiple: !!f2.multiple };
              D$2("invalid", d2);
              break;
            case "textarea":
              hb(d2, f2), D$2("invalid", d2);
          }
          ub(c6, f2);
          e2 = null;
          for (var g2 in f2)
            if (f2.hasOwnProperty(g2)) {
              var h2 = f2[g2];
              "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a2), e2 = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
                d2.textContent,
                h2,
                a2
              ), e2 = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D$2("scroll", d2);
            }
          switch (c6) {
            case "input":
              Va(d2);
              db(d2, f2, true);
              break;
            case "textarea":
              Va(d2);
              jb(d2);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d2.onclick = Bf);
          }
          d2 = e2;
          b2.updateQueue = d2;
          null !== d2 && (b2.flags |= 4);
        } else {
          g2 = 9 === e2.nodeType ? e2 : e2.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a2 && (a2 = kb(c6));
          "http://www.w3.org/1999/xhtml" === a2 ? "script" === c6 ? (a2 = g2.createElement("div"), a2.innerHTML = "<script><\/script>", a2 = a2.removeChild(a2.firstChild)) : "string" === typeof d2.is ? a2 = g2.createElement(c6, { is: d2.is }) : (a2 = g2.createElement(c6), "select" === c6 && (g2 = a2, d2.multiple ? g2.multiple = true : d2.size && (g2.size = d2.size))) : a2 = g2.createElementNS(a2, c6);
          a2[Of] = b2;
          a2[Pf] = d2;
          Aj(a2, b2, false, false);
          b2.stateNode = a2;
          a: {
            g2 = vb(c6, d2);
            switch (c6) {
              case "dialog":
                D$2("cancel", a2);
                D$2("close", a2);
                e2 = d2;
                break;
              case "iframe":
              case "object":
              case "embed":
                D$2("load", a2);
                e2 = d2;
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++)
                  D$2(lf[e2], a2);
                e2 = d2;
                break;
              case "source":
                D$2("error", a2);
                e2 = d2;
                break;
              case "img":
              case "image":
              case "link":
                D$2(
                  "error",
                  a2
                );
                D$2("load", a2);
                e2 = d2;
                break;
              case "details":
                D$2("toggle", a2);
                e2 = d2;
                break;
              case "input":
                Za(a2, d2);
                e2 = Ya(a2, d2);
                D$2("invalid", a2);
                break;
              case "option":
                e2 = d2;
                break;
              case "select":
                a2._wrapperState = { wasMultiple: !!d2.multiple };
                e2 = A$4({}, d2, { value: void 0 });
                D$2("invalid", a2);
                break;
              case "textarea":
                hb(a2, d2);
                e2 = gb(a2, d2);
                D$2("invalid", a2);
                break;
              default:
                e2 = d2;
            }
            ub(c6, e2);
            h2 = e2;
            for (f2 in h2)
              if (h2.hasOwnProperty(f2)) {
                var k2 = h2[f2];
                "style" === f2 ? sb(a2, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a2, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c6 || "" !== k2) && ob(a2, k2) : "number" === typeof k2 && ob(a2, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D$2("scroll", a2) : null != k2 && ta(a2, f2, k2, g2));
              }
            switch (c6) {
              case "input":
                Va(a2);
                db(a2, d2, false);
                break;
              case "textarea":
                Va(a2);
                jb(a2);
                break;
              case "option":
                null != d2.value && a2.setAttribute("value", "" + Sa(d2.value));
                break;
              case "select":
                a2.multiple = !!d2.multiple;
                f2 = d2.value;
                null != f2 ? fb(a2, !!d2.multiple, f2, false) : null != d2.defaultValue && fb(
                  a2,
                  !!d2.multiple,
                  d2.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e2.onClick && (a2.onclick = Bf);
            }
            switch (c6) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d2 = !!d2.autoFocus;
                break a;
              case "img":
                d2 = true;
                break a;
              default:
                d2 = false;
            }
          }
          d2 && (b2.flags |= 4);
        }
        null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
      }
      S$2(b2);
      return null;
    case 6:
      if (a2 && null != b2.stateNode)
        Dj(a2, b2, a2.memoizedProps, d2);
      else {
        if ("string" !== typeof d2 && null === b2.stateNode)
          throw Error(p$a(166));
        c6 = Hh(Gh.current);
        Hh(Eh.current);
        if (Gg(b2)) {
          d2 = b2.stateNode;
          c6 = b2.memoizedProps;
          d2[Of] = b2;
          if (f2 = d2.nodeValue !== c6) {
            if (a2 = xg, null !== a2)
              switch (a2.tag) {
                case 3:
                  Af(d2.nodeValue, c6, 0 !== (a2.mode & 1));
                  break;
                case 5:
                  true !== a2.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c6, 0 !== (a2.mode & 1));
              }
          }
          f2 && (b2.flags |= 4);
        } else
          d2 = (9 === c6.nodeType ? c6 : c6.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
      }
      S$2(b2);
      return null;
    case 13:
      E$2(M$2);
      d2 = b2.memoizedState;
      if (null === a2 || null !== a2.memoizedState && null !== a2.memoizedState.dehydrated) {
        if (I$2 && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128))
          Hg(), Ig(), b2.flags |= 98560, f2 = false;
        else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
          if (null === a2) {
            if (!f2)
              throw Error(p$a(318));
            f2 = b2.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2)
              throw Error(p$a(317));
            f2[Of] = b2;
          } else
            Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
          S$2(b2);
          f2 = false;
        } else
          null !== zg && (Gj(zg), zg = null), f2 = true;
        if (!f2)
          return b2.flags & 65536 ? b2 : null;
      }
      if (0 !== (b2.flags & 128))
        return b2.lanes = c6, b2;
      d2 = null !== d2;
      d2 !== (null !== a2 && null !== a2.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a2 || 0 !== (M$2.current & 1) ? 0 === T && (T = 3) : uj()));
      null !== b2.updateQueue && (b2.flags |= 4);
      S$2(b2);
      return null;
    case 4:
      return Jh(), Bj(a2, b2), null === a2 && sf(b2.stateNode.containerInfo), S$2(b2), null;
    case 10:
      return Rg(b2.type._context), S$2(b2), null;
    case 17:
      return Zf(b2.type) && $f(), S$2(b2), null;
    case 19:
      E$2(M$2);
      f2 = b2.memoizedState;
      if (null === f2)
        return S$2(b2), null;
      d2 = 0 !== (b2.flags & 128);
      g2 = f2.rendering;
      if (null === g2)
        if (d2)
          Ej(f2, false);
        else {
          if (0 !== T || null !== a2 && 0 !== (a2.flags & 128))
            for (a2 = b2.child; null !== a2; ) {
              g2 = Mh(a2);
              if (null !== g2) {
                b2.flags |= 128;
                Ej(f2, false);
                d2 = g2.updateQueue;
                null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
                b2.subtreeFlags = 0;
                d2 = c6;
                for (c6 = b2.child; null !== c6; )
                  f2 = c6, a2 = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a2, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a2 = g2.dependencies, f2.dependencies = null === a2 ? null : { lanes: a2.lanes, firstContext: a2.firstContext }), c6 = c6.sibling;
                G$2(M$2, M$2.current & 1 | 2);
                return b2.child;
              }
              a2 = a2.sibling;
            }
          null !== f2.tail && B$2() > Hj && (b2.flags |= 128, d2 = true, Ej(f2, false), b2.lanes = 4194304);
        }
      else {
        if (!d2)
          if (a2 = Mh(g2), null !== a2) {
            if (b2.flags |= 128, d2 = true, c6 = a2.updateQueue, null !== c6 && (b2.updateQueue = c6, b2.flags |= 4), Ej(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I$2)
              return S$2(b2), null;
          } else
            2 * B$2() - f2.renderingStartTime > Hj && 1073741824 !== c6 && (b2.flags |= 128, d2 = true, Ej(f2, false), b2.lanes = 4194304);
        f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c6 = f2.last, null !== c6 ? c6.sibling = g2 : b2.child = g2, f2.last = g2);
      }
      if (null !== f2.tail)
        return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B$2(), b2.sibling = null, c6 = M$2.current, G$2(M$2, d2 ? c6 & 1 | 2 : c6 & 1), b2;
      S$2(b2);
      return null;
    case 22:
    case 23:
      return Ij(), d2 = null !== b2.memoizedState, null !== a2 && null !== a2.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (gj & 1073741824) && (S$2(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S$2(b2), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p$a(156, b2.tag));
}
function Jj(a2, b2) {
  wg(b2);
  switch (b2.tag) {
    case 1:
      return Zf(b2.type) && $f(), a2 = b2.flags, a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
    case 3:
      return Jh(), E$2(Wf), E$2(H$2), Oh(), a2 = b2.flags, 0 !== (a2 & 65536) && 0 === (a2 & 128) ? (b2.flags = a2 & -65537 | 128, b2) : null;
    case 5:
      return Lh(b2), null;
    case 13:
      E$2(M$2);
      a2 = b2.memoizedState;
      if (null !== a2 && null !== a2.dehydrated) {
        if (null === b2.alternate)
          throw Error(p$a(340));
        Ig();
      }
      a2 = b2.flags;
      return a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
    case 19:
      return E$2(M$2), null;
    case 4:
      return Jh(), null;
    case 10:
      return Rg(b2.type._context), null;
    case 22:
    case 23:
      return Ij(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Kj = false, U$2 = false, Lj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Mj(a2, b2) {
  var c6 = a2.ref;
  if (null !== c6)
    if ("function" === typeof c6)
      try {
        c6(null);
      } catch (d2) {
        W$2(a2, b2, d2);
      }
    else
      c6.current = null;
}
function Nj(a2, b2, c6) {
  try {
    c6();
  } catch (d2) {
    W$2(a2, b2, d2);
  }
}
var Oj = false;
function Pj(a2, b2) {
  Cf = dd;
  a2 = Me();
  if (Ne(a2)) {
    if ("selectionStart" in a2)
      var c6 = { start: a2.selectionStart, end: a2.selectionEnd };
    else
      a: {
        c6 = (c6 = a2.ownerDocument) && c6.defaultView || window;
        var d2 = c6.getSelection && c6.getSelection();
        if (d2 && 0 !== d2.rangeCount) {
          c6 = d2.anchorNode;
          var e2 = d2.anchorOffset, f2 = d2.focusNode;
          d2 = d2.focusOffset;
          try {
            c6.nodeType, f2.nodeType;
          } catch (F2) {
            c6 = null;
            break a;
          }
          var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a2, r2 = null;
          b:
            for (; ; ) {
              for (var y2; ; ) {
                q2 !== c6 || 0 !== e2 && 3 !== q2.nodeType || (h2 = g2 + e2);
                q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
                3 === q2.nodeType && (g2 += q2.nodeValue.length);
                if (null === (y2 = q2.firstChild))
                  break;
                r2 = q2;
                q2 = y2;
              }
              for (; ; ) {
                if (q2 === a2)
                  break b;
                r2 === c6 && ++l2 === e2 && (h2 = g2);
                r2 === f2 && ++m2 === d2 && (k2 = g2);
                if (null !== (y2 = q2.nextSibling))
                  break;
                q2 = r2;
                r2 = q2.parentNode;
              }
              q2 = y2;
            }
          c6 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
        } else
          c6 = null;
      }
    c6 = c6 || { start: 0, end: 0 };
  } else
    c6 = null;
  Df = { focusedElem: a2, selectionRange: c6 };
  dd = false;
  for (V = b2; null !== V; )
    if (b2 = V, a2 = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a2)
      a2.return = b2, V = a2;
    else
      for (; null !== V; ) {
        b2 = V;
        try {
          var n2 = b2.alternate;
          if (0 !== (b2.flags & 1024))
            switch (b2.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (null !== n2) {
                  var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b2.stateNode, w2 = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t2 : Lg(b2.type, t2), J2);
                  x2.__reactInternalSnapshotBeforeUpdate = w2;
                }
                break;
              case 3:
                var u2 = b2.stateNode.containerInfo;
                1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p$a(163));
            }
        } catch (F2) {
          W$2(b2, b2.return, F2);
        }
        a2 = b2.sibling;
        if (null !== a2) {
          a2.return = b2.return;
          V = a2;
          break;
        }
        V = b2.return;
      }
  n2 = Oj;
  Oj = false;
  return n2;
}
function Qj(a2, b2, c6) {
  var d2 = b2.updateQueue;
  d2 = null !== d2 ? d2.lastEffect : null;
  if (null !== d2) {
    var e2 = d2 = d2.next;
    do {
      if ((e2.tag & a2) === a2) {
        var f2 = e2.destroy;
        e2.destroy = void 0;
        void 0 !== f2 && Nj(b2, c6, f2);
      }
      e2 = e2.next;
    } while (e2 !== d2);
  }
}
function Rj(a2, b2) {
  b2 = b2.updateQueue;
  b2 = null !== b2 ? b2.lastEffect : null;
  if (null !== b2) {
    var c6 = b2 = b2.next;
    do {
      if ((c6.tag & a2) === a2) {
        var d2 = c6.create;
        c6.destroy = d2();
      }
      c6 = c6.next;
    } while (c6 !== b2);
  }
}
function Sj(a2) {
  var b2 = a2.ref;
  if (null !== b2) {
    var c6 = a2.stateNode;
    switch (a2.tag) {
      case 5:
        a2 = c6;
        break;
      default:
        a2 = c6;
    }
    "function" === typeof b2 ? b2(a2) : b2.current = a2;
  }
}
function Tj(a2) {
  var b2 = a2.alternate;
  null !== b2 && (a2.alternate = null, Tj(b2));
  a2.child = null;
  a2.deletions = null;
  a2.sibling = null;
  5 === a2.tag && (b2 = a2.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
  a2.stateNode = null;
  a2.return = null;
  a2.dependencies = null;
  a2.memoizedProps = null;
  a2.memoizedState = null;
  a2.pendingProps = null;
  a2.stateNode = null;
  a2.updateQueue = null;
}
function Uj(a2) {
  return 5 === a2.tag || 3 === a2.tag || 4 === a2.tag;
}
function Vj(a2) {
  a:
    for (; ; ) {
      for (; null === a2.sibling; ) {
        if (null === a2.return || Uj(a2.return))
          return null;
        a2 = a2.return;
      }
      a2.sibling.return = a2.return;
      for (a2 = a2.sibling; 5 !== a2.tag && 6 !== a2.tag && 18 !== a2.tag; ) {
        if (a2.flags & 2)
          continue a;
        if (null === a2.child || 4 === a2.tag)
          continue a;
        else
          a2.child.return = a2, a2 = a2.child;
      }
      if (!(a2.flags & 2))
        return a2.stateNode;
    }
}
function Wj(a2, b2, c6) {
  var d2 = a2.tag;
  if (5 === d2 || 6 === d2)
    a2 = a2.stateNode, b2 ? 8 === c6.nodeType ? c6.parentNode.insertBefore(a2, b2) : c6.insertBefore(a2, b2) : (8 === c6.nodeType ? (b2 = c6.parentNode, b2.insertBefore(a2, c6)) : (b2 = c6, b2.appendChild(a2)), c6 = c6._reactRootContainer, null !== c6 && void 0 !== c6 || null !== b2.onclick || (b2.onclick = Bf));
  else if (4 !== d2 && (a2 = a2.child, null !== a2))
    for (Wj(a2, b2, c6), a2 = a2.sibling; null !== a2; )
      Wj(a2, b2, c6), a2 = a2.sibling;
}
function Xj(a2, b2, c6) {
  var d2 = a2.tag;
  if (5 === d2 || 6 === d2)
    a2 = a2.stateNode, b2 ? c6.insertBefore(a2, b2) : c6.appendChild(a2);
  else if (4 !== d2 && (a2 = a2.child, null !== a2))
    for (Xj(a2, b2, c6), a2 = a2.sibling; null !== a2; )
      Xj(a2, b2, c6), a2 = a2.sibling;
}
var X$2 = null, Yj = false;
function Zj(a2, b2, c6) {
  for (c6 = c6.child; null !== c6; )
    ak(a2, b2, c6), c6 = c6.sibling;
}
function ak(a2, b2, c6) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount)
    try {
      lc.onCommitFiberUnmount(kc, c6);
    } catch (h2) {
    }
  switch (c6.tag) {
    case 5:
      U$2 || Mj(c6, b2);
    case 6:
      var d2 = X$2, e2 = Yj;
      X$2 = null;
      Zj(a2, b2, c6);
      X$2 = d2;
      Yj = e2;
      null !== X$2 && (Yj ? (a2 = X$2, c6 = c6.stateNode, 8 === a2.nodeType ? a2.parentNode.removeChild(c6) : a2.removeChild(c6)) : X$2.removeChild(c6.stateNode));
      break;
    case 18:
      null !== X$2 && (Yj ? (a2 = X$2, c6 = c6.stateNode, 8 === a2.nodeType ? Kf(a2.parentNode, c6) : 1 === a2.nodeType && Kf(a2, c6), bd(a2)) : Kf(X$2, c6.stateNode));
      break;
    case 4:
      d2 = X$2;
      e2 = Yj;
      X$2 = c6.stateNode.containerInfo;
      Yj = true;
      Zj(a2, b2, c6);
      X$2 = d2;
      Yj = e2;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U$2 && (d2 = c6.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
        e2 = d2 = d2.next;
        do {
          var f2 = e2, g2 = f2.destroy;
          f2 = f2.tag;
          void 0 !== g2 && (0 !== (f2 & 2) ? Nj(c6, b2, g2) : 0 !== (f2 & 4) && Nj(c6, b2, g2));
          e2 = e2.next;
        } while (e2 !== d2);
      }
      Zj(a2, b2, c6);
      break;
    case 1:
      if (!U$2 && (Mj(c6, b2), d2 = c6.stateNode, "function" === typeof d2.componentWillUnmount))
        try {
          d2.props = c6.memoizedProps, d2.state = c6.memoizedState, d2.componentWillUnmount();
        } catch (h2) {
          W$2(c6, b2, h2);
        }
      Zj(a2, b2, c6);
      break;
    case 21:
      Zj(a2, b2, c6);
      break;
    case 22:
      c6.mode & 1 ? (U$2 = (d2 = U$2) || null !== c6.memoizedState, Zj(a2, b2, c6), U$2 = d2) : Zj(a2, b2, c6);
      break;
    default:
      Zj(a2, b2, c6);
  }
}
function bk(a2) {
  var b2 = a2.updateQueue;
  if (null !== b2) {
    a2.updateQueue = null;
    var c6 = a2.stateNode;
    null === c6 && (c6 = a2.stateNode = new Lj());
    b2.forEach(function(b3) {
      var d2 = ck.bind(null, a2, b3);
      c6.has(b3) || (c6.add(b3), b3.then(d2, d2));
    });
  }
}
function dk(a2, b2) {
  var c6 = b2.deletions;
  if (null !== c6)
    for (var d2 = 0; d2 < c6.length; d2++) {
      var e2 = c6[d2];
      try {
        var f2 = a2, g2 = b2, h2 = g2;
        a:
          for (; null !== h2; ) {
            switch (h2.tag) {
              case 5:
                X$2 = h2.stateNode;
                Yj = false;
                break a;
              case 3:
                X$2 = h2.stateNode.containerInfo;
                Yj = true;
                break a;
              case 4:
                X$2 = h2.stateNode.containerInfo;
                Yj = true;
                break a;
            }
            h2 = h2.return;
          }
        if (null === X$2)
          throw Error(p$a(160));
        ak(f2, g2, e2);
        X$2 = null;
        Yj = false;
        var k2 = e2.alternate;
        null !== k2 && (k2.return = null);
        e2.return = null;
      } catch (l2) {
        W$2(e2, b2, l2);
      }
    }
  if (b2.subtreeFlags & 12854)
    for (b2 = b2.child; null !== b2; )
      ek(b2, a2), b2 = b2.sibling;
}
function ek(a2, b2) {
  var c6 = a2.alternate, d2 = a2.flags;
  switch (a2.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      dk(b2, a2);
      fk(a2);
      if (d2 & 4) {
        try {
          Qj(3, a2, a2.return), Rj(3, a2);
        } catch (t2) {
          W$2(a2, a2.return, t2);
        }
        try {
          Qj(5, a2, a2.return);
        } catch (t2) {
          W$2(a2, a2.return, t2);
        }
      }
      break;
    case 1:
      dk(b2, a2);
      fk(a2);
      d2 & 512 && null !== c6 && Mj(c6, c6.return);
      break;
    case 5:
      dk(b2, a2);
      fk(a2);
      d2 & 512 && null !== c6 && Mj(c6, c6.return);
      if (a2.flags & 32) {
        var e2 = a2.stateNode;
        try {
          ob(e2, "");
        } catch (t2) {
          W$2(a2, a2.return, t2);
        }
      }
      if (d2 & 4 && (e2 = a2.stateNode, null != e2)) {
        var f2 = a2.memoizedProps, g2 = null !== c6 ? c6.memoizedProps : f2, h2 = a2.type, k2 = a2.updateQueue;
        a2.updateQueue = null;
        if (null !== k2)
          try {
            "input" === h2 && "radio" === f2.type && null != f2.name && ab(e2, f2);
            vb(h2, g2);
            var l2 = vb(h2, f2);
            for (g2 = 0; g2 < k2.length; g2 += 2) {
              var m2 = k2[g2], q2 = k2[g2 + 1];
              "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
            }
            switch (h2) {
              case "input":
                bb(e2, f2);
                break;
              case "textarea":
                ib(e2, f2);
                break;
              case "select":
                var r2 = e2._wrapperState.wasMultiple;
                e2._wrapperState.wasMultiple = !!f2.multiple;
                var y2 = f2.value;
                null != y2 ? fb(e2, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                  e2,
                  !!f2.multiple,
                  f2.defaultValue,
                  true
                ) : fb(e2, !!f2.multiple, f2.multiple ? [] : "", false));
            }
            e2[Pf] = f2;
          } catch (t2) {
            W$2(a2, a2.return, t2);
          }
      }
      break;
    case 6:
      dk(b2, a2);
      fk(a2);
      if (d2 & 4) {
        if (null === a2.stateNode)
          throw Error(p$a(162));
        e2 = a2.stateNode;
        f2 = a2.memoizedProps;
        try {
          e2.nodeValue = f2;
        } catch (t2) {
          W$2(a2, a2.return, t2);
        }
      }
      break;
    case 3:
      dk(b2, a2);
      fk(a2);
      if (d2 & 4 && null !== c6 && c6.memoizedState.isDehydrated)
        try {
          bd(b2.containerInfo);
        } catch (t2) {
          W$2(a2, a2.return, t2);
        }
      break;
    case 4:
      dk(b2, a2);
      fk(a2);
      break;
    case 13:
      dk(b2, a2);
      fk(a2);
      e2 = a2.child;
      e2.flags & 8192 && (f2 = null !== e2.memoizedState, e2.stateNode.isHidden = f2, !f2 || null !== e2.alternate && null !== e2.alternate.memoizedState || (gk = B$2()));
      d2 & 4 && bk(a2);
      break;
    case 22:
      m2 = null !== c6 && null !== c6.memoizedState;
      a2.mode & 1 ? (U$2 = (l2 = U$2) || m2, dk(b2, a2), U$2 = l2) : dk(b2, a2);
      fk(a2);
      if (d2 & 8192) {
        l2 = null !== a2.memoizedState;
        if ((a2.stateNode.isHidden = l2) && !m2 && 0 !== (a2.mode & 1))
          for (V = a2, m2 = a2.child; null !== m2; ) {
            for (q2 = V = m2; null !== V; ) {
              r2 = V;
              y2 = r2.child;
              switch (r2.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Qj(4, r2, r2.return);
                  break;
                case 1:
                  Mj(r2, r2.return);
                  var n2 = r2.stateNode;
                  if ("function" === typeof n2.componentWillUnmount) {
                    d2 = r2;
                    c6 = r2.return;
                    try {
                      b2 = d2, n2.props = b2.memoizedProps, n2.state = b2.memoizedState, n2.componentWillUnmount();
                    } catch (t2) {
                      W$2(d2, c6, t2);
                    }
                  }
                  break;
                case 5:
                  Mj(r2, r2.return);
                  break;
                case 22:
                  if (null !== r2.memoizedState) {
                    hk(q2);
                    continue;
                  }
              }
              null !== y2 ? (y2.return = r2, V = y2) : hk(q2);
            }
            m2 = m2.sibling;
          }
        a:
          for (m2 = null, q2 = a2; ; ) {
            if (5 === q2.tag) {
              if (null === m2) {
                m2 = q2;
                try {
                  e2 = q2.stateNode, l2 ? (f2 = e2.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
                } catch (t2) {
                  W$2(a2, a2.return, t2);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m2)
                try {
                  q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
                } catch (t2) {
                  W$2(a2, a2.return, t2);
                }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a2) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a2)
              break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a2)
                break a;
              m2 === q2 && (m2 = null);
              q2 = q2.return;
            }
            m2 === q2 && (m2 = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
      }
      break;
    case 19:
      dk(b2, a2);
      fk(a2);
      d2 & 4 && bk(a2);
      break;
    case 21:
      break;
    default:
      dk(
        b2,
        a2
      ), fk(a2);
  }
}
function fk(a2) {
  var b2 = a2.flags;
  if (b2 & 2) {
    try {
      a: {
        for (var c6 = a2.return; null !== c6; ) {
          if (Uj(c6)) {
            var d2 = c6;
            break a;
          }
          c6 = c6.return;
        }
        throw Error(p$a(160));
      }
      switch (d2.tag) {
        case 5:
          var e2 = d2.stateNode;
          d2.flags & 32 && (ob(e2, ""), d2.flags &= -33);
          var f2 = Vj(a2);
          Xj(a2, f2, e2);
          break;
        case 3:
        case 4:
          var g2 = d2.stateNode.containerInfo, h2 = Vj(a2);
          Wj(a2, h2, g2);
          break;
        default:
          throw Error(p$a(161));
      }
    } catch (k2) {
      W$2(a2, a2.return, k2);
    }
    a2.flags &= -3;
  }
  b2 & 4096 && (a2.flags &= -4097);
}
function ik(a2, b2, c6) {
  V = a2;
  jk(a2);
}
function jk(a2, b2, c6) {
  for (var d2 = 0 !== (a2.mode & 1); null !== V; ) {
    var e2 = V, f2 = e2.child;
    if (22 === e2.tag && d2) {
      var g2 = null !== e2.memoizedState || Kj;
      if (!g2) {
        var h2 = e2.alternate, k2 = null !== h2 && null !== h2.memoizedState || U$2;
        h2 = Kj;
        var l2 = U$2;
        Kj = g2;
        if ((U$2 = k2) && !l2)
          for (V = e2; null !== V; )
            g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? kk(e2) : null !== k2 ? (k2.return = g2, V = k2) : kk(e2);
        for (; null !== f2; )
          V = f2, jk(f2), f2 = f2.sibling;
        V = e2;
        Kj = h2;
        U$2 = l2;
      }
      lk(a2);
    } else
      0 !== (e2.subtreeFlags & 8772) && null !== f2 ? (f2.return = e2, V = f2) : lk(a2);
  }
}
function lk(a2) {
  for (; null !== V; ) {
    var b2 = V;
    if (0 !== (b2.flags & 8772)) {
      var c6 = b2.alternate;
      try {
        if (0 !== (b2.flags & 8772))
          switch (b2.tag) {
            case 0:
            case 11:
            case 15:
              U$2 || Rj(5, b2);
              break;
            case 1:
              var d2 = b2.stateNode;
              if (b2.flags & 4 && !U$2)
                if (null === c6)
                  d2.componentDidMount();
                else {
                  var e2 = b2.elementType === b2.type ? c6.memoizedProps : Lg(b2.type, c6.memoizedProps);
                  d2.componentDidUpdate(e2, c6.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
                }
              var f2 = b2.updateQueue;
              null !== f2 && ih(b2, f2, d2);
              break;
            case 3:
              var g2 = b2.updateQueue;
              if (null !== g2) {
                c6 = null;
                if (null !== b2.child)
                  switch (b2.child.tag) {
                    case 5:
                      c6 = b2.child.stateNode;
                      break;
                    case 1:
                      c6 = b2.child.stateNode;
                  }
                ih(b2, g2, c6);
              }
              break;
            case 5:
              var h2 = b2.stateNode;
              if (null === c6 && b2.flags & 4) {
                c6 = h2;
                var k2 = b2.memoizedProps;
                switch (b2.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k2.autoFocus && c6.focus();
                    break;
                  case "img":
                    k2.src && (c6.src = k2.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b2.memoizedState) {
                var l2 = b2.alternate;
                if (null !== l2) {
                  var m2 = l2.memoizedState;
                  if (null !== m2) {
                    var q2 = m2.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p$a(163));
          }
        U$2 || b2.flags & 512 && Sj(b2);
      } catch (r2) {
        W$2(b2, b2.return, r2);
      }
    }
    if (b2 === a2) {
      V = null;
      break;
    }
    c6 = b2.sibling;
    if (null !== c6) {
      c6.return = b2.return;
      V = c6;
      break;
    }
    V = b2.return;
  }
}
function hk(a2) {
  for (; null !== V; ) {
    var b2 = V;
    if (b2 === a2) {
      V = null;
      break;
    }
    var c6 = b2.sibling;
    if (null !== c6) {
      c6.return = b2.return;
      V = c6;
      break;
    }
    V = b2.return;
  }
}
function kk(a2) {
  for (; null !== V; ) {
    var b2 = V;
    try {
      switch (b2.tag) {
        case 0:
        case 11:
        case 15:
          var c6 = b2.return;
          try {
            Rj(4, b2);
          } catch (k2) {
            W$2(b2, c6, k2);
          }
          break;
        case 1:
          var d2 = b2.stateNode;
          if ("function" === typeof d2.componentDidMount) {
            var e2 = b2.return;
            try {
              d2.componentDidMount();
            } catch (k2) {
              W$2(b2, e2, k2);
            }
          }
          var f2 = b2.return;
          try {
            Sj(b2);
          } catch (k2) {
            W$2(b2, f2, k2);
          }
          break;
        case 5:
          var g2 = b2.return;
          try {
            Sj(b2);
          } catch (k2) {
            W$2(b2, g2, k2);
          }
      }
    } catch (k2) {
      W$2(b2, b2.return, k2);
    }
    if (b2 === a2) {
      V = null;
      break;
    }
    var h2 = b2.sibling;
    if (null !== h2) {
      h2.return = b2.return;
      V = h2;
      break;
    }
    V = b2.return;
  }
}
var mk = Math.ceil, nk = ua.ReactCurrentDispatcher, ok = ua.ReactCurrentOwner, pk = ua.ReactCurrentBatchConfig, K = 0, R$2 = null, Y = null, Z$2 = 0, gj = 0, fj = Uf(0), T = 0, qk = null, hh = 0, rk = 0, sk = 0, tk = null, uk = null, gk = 0, Hj = Infinity, vk = null, Pi = false, Qi = null, Si = null, wk = false, xk = null, yk = 0, zk = 0, Ak = null, Bk = -1, Ck = 0;
function L$2() {
  return 0 !== (K & 6) ? B$2() : -1 !== Bk ? Bk : Bk = B$2();
}
function lh(a2) {
  if (0 === (a2.mode & 1))
    return 1;
  if (0 !== (K & 2) && 0 !== Z$2)
    return Z$2 & -Z$2;
  if (null !== Kg.transition)
    return 0 === Ck && (Ck = yc()), Ck;
  a2 = C;
  if (0 !== a2)
    return a2;
  a2 = window.event;
  a2 = void 0 === a2 ? 16 : jd(a2.type);
  return a2;
}
function mh(a2, b2, c6, d2) {
  if (50 < zk)
    throw zk = 0, Ak = null, Error(p$a(185));
  Ac(a2, c6, d2);
  if (0 === (K & 2) || a2 !== R$2)
    a2 === R$2 && (0 === (K & 2) && (rk |= c6), 4 === T && Dk(a2, Z$2)), Ek(a2, d2), 1 === c6 && 0 === K && 0 === (b2.mode & 1) && (Hj = B$2() + 500, fg && jg());
}
function Ek(a2, b2) {
  var c6 = a2.callbackNode;
  wc(a2, b2);
  var d2 = uc(a2, a2 === R$2 ? Z$2 : 0);
  if (0 === d2)
    null !== c6 && bc(c6), a2.callbackNode = null, a2.callbackPriority = 0;
  else if (b2 = d2 & -d2, a2.callbackPriority !== b2) {
    null != c6 && bc(c6);
    if (1 === b2)
      0 === a2.tag ? ig(Fk.bind(null, a2)) : hg(Fk.bind(null, a2)), Jf(function() {
        0 === (K & 6) && jg();
      }), c6 = null;
    else {
      switch (Dc(d2)) {
        case 1:
          c6 = fc;
          break;
        case 4:
          c6 = gc;
          break;
        case 16:
          c6 = hc;
          break;
        case 536870912:
          c6 = jc;
          break;
        default:
          c6 = hc;
      }
      c6 = Gk(c6, Hk.bind(null, a2));
    }
    a2.callbackPriority = b2;
    a2.callbackNode = c6;
  }
}
function Hk(a2, b2) {
  Bk = -1;
  Ck = 0;
  if (0 !== (K & 6))
    throw Error(p$a(327));
  var c6 = a2.callbackNode;
  if (Ik() && a2.callbackNode !== c6)
    return null;
  var d2 = uc(a2, a2 === R$2 ? Z$2 : 0);
  if (0 === d2)
    return null;
  if (0 !== (d2 & 30) || 0 !== (d2 & a2.expiredLanes) || b2)
    b2 = Jk(a2, d2);
  else {
    b2 = d2;
    var e2 = K;
    K |= 2;
    var f2 = Kk();
    if (R$2 !== a2 || Z$2 !== b2)
      vk = null, Hj = B$2() + 500, Lk(a2, b2);
    do
      try {
        Mk();
        break;
      } catch (h2) {
        Nk(a2, h2);
      }
    while (1);
    Qg();
    nk.current = f2;
    K = e2;
    null !== Y ? b2 = 0 : (R$2 = null, Z$2 = 0, b2 = T);
  }
  if (0 !== b2) {
    2 === b2 && (e2 = xc(a2), 0 !== e2 && (d2 = e2, b2 = Ok(a2, e2)));
    if (1 === b2)
      throw c6 = qk, Lk(a2, 0), Dk(a2, d2), Ek(a2, B$2()), c6;
    if (6 === b2)
      Dk(a2, d2);
    else {
      e2 = a2.current.alternate;
      if (0 === (d2 & 30) && !Pk(e2) && (b2 = Jk(a2, d2), 2 === b2 && (f2 = xc(a2), 0 !== f2 && (d2 = f2, b2 = Ok(a2, f2))), 1 === b2))
        throw c6 = qk, Lk(a2, 0), Dk(a2, d2), Ek(a2, B$2()), c6;
      a2.finishedWork = e2;
      a2.finishedLanes = d2;
      switch (b2) {
        case 0:
        case 1:
          throw Error(p$a(345));
        case 2:
          Qk(a2, uk, vk);
          break;
        case 3:
          Dk(a2, d2);
          if ((d2 & 130023424) === d2 && (b2 = gk + 500 - B$2(), 10 < b2)) {
            if (0 !== uc(a2, 0))
              break;
            e2 = a2.suspendedLanes;
            if ((e2 & d2) !== d2) {
              L$2();
              a2.pingedLanes |= a2.suspendedLanes & e2;
              break;
            }
            a2.timeoutHandle = Ff(Qk.bind(null, a2, uk, vk), b2);
            break;
          }
          Qk(a2, uk, vk);
          break;
        case 4:
          Dk(a2, d2);
          if ((d2 & 4194240) === d2)
            break;
          b2 = a2.eventTimes;
          for (e2 = -1; 0 < d2; ) {
            var g2 = 31 - oc(d2);
            f2 = 1 << g2;
            g2 = b2[g2];
            g2 > e2 && (e2 = g2);
            d2 &= ~f2;
          }
          d2 = e2;
          d2 = B$2() - d2;
          d2 = (120 > d2 ? 120 : 480 > d2 ? 480 : 1080 > d2 ? 1080 : 1920 > d2 ? 1920 : 3e3 > d2 ? 3e3 : 4320 > d2 ? 4320 : 1960 * mk(d2 / 1960)) - d2;
          if (10 < d2) {
            a2.timeoutHandle = Ff(Qk.bind(null, a2, uk, vk), d2);
            break;
          }
          Qk(a2, uk, vk);
          break;
        case 5:
          Qk(a2, uk, vk);
          break;
        default:
          throw Error(p$a(329));
      }
    }
  }
  Ek(a2, B$2());
  return a2.callbackNode === c6 ? Hk.bind(null, a2) : null;
}
function Ok(a2, b2) {
  var c6 = tk;
  a2.current.memoizedState.isDehydrated && (Lk(a2, b2).flags |= 256);
  a2 = Jk(a2, b2);
  2 !== a2 && (b2 = uk, uk = c6, null !== b2 && Gj(b2));
  return a2;
}
function Gj(a2) {
  null === uk ? uk = a2 : uk.push.apply(uk, a2);
}
function Pk(a2) {
  for (var b2 = a2; ; ) {
    if (b2.flags & 16384) {
      var c6 = b2.updateQueue;
      if (null !== c6 && (c6 = c6.stores, null !== c6))
        for (var d2 = 0; d2 < c6.length; d2++) {
          var e2 = c6[d2], f2 = e2.getSnapshot;
          e2 = e2.value;
          try {
            if (!He(f2(), e2))
              return false;
          } catch (g2) {
            return false;
          }
        }
    }
    c6 = b2.child;
    if (b2.subtreeFlags & 16384 && null !== c6)
      c6.return = b2, b2 = c6;
    else {
      if (b2 === a2)
        break;
      for (; null === b2.sibling; ) {
        if (null === b2.return || b2.return === a2)
          return true;
        b2 = b2.return;
      }
      b2.sibling.return = b2.return;
      b2 = b2.sibling;
    }
  }
  return true;
}
function Dk(a2, b2) {
  b2 &= ~sk;
  b2 &= ~rk;
  a2.suspendedLanes |= b2;
  a2.pingedLanes &= ~b2;
  for (a2 = a2.expirationTimes; 0 < b2; ) {
    var c6 = 31 - oc(b2), d2 = 1 << c6;
    a2[c6] = -1;
    b2 &= ~d2;
  }
}
function Fk(a2) {
  if (0 !== (K & 6))
    throw Error(p$a(327));
  Ik();
  var b2 = uc(a2, 0);
  if (0 === (b2 & 1))
    return Ek(a2, B$2()), null;
  var c6 = Jk(a2, b2);
  if (0 !== a2.tag && 2 === c6) {
    var d2 = xc(a2);
    0 !== d2 && (b2 = d2, c6 = Ok(a2, d2));
  }
  if (1 === c6)
    throw c6 = qk, Lk(a2, 0), Dk(a2, b2), Ek(a2, B$2()), c6;
  if (6 === c6)
    throw Error(p$a(345));
  a2.finishedWork = a2.current.alternate;
  a2.finishedLanes = b2;
  Qk(a2, uk, vk);
  Ek(a2, B$2());
  return null;
}
function Rk(a2, b2) {
  var c6 = K;
  K |= 1;
  try {
    return a2(b2);
  } finally {
    K = c6, 0 === K && (Hj = B$2() + 500, fg && jg());
  }
}
function Sk(a2) {
  null !== xk && 0 === xk.tag && 0 === (K & 6) && Ik();
  var b2 = K;
  K |= 1;
  var c6 = pk.transition, d2 = C;
  try {
    if (pk.transition = null, C = 1, a2)
      return a2();
  } finally {
    C = d2, pk.transition = c6, K = b2, 0 === (K & 6) && jg();
  }
}
function Ij() {
  gj = fj.current;
  E$2(fj);
}
function Lk(a2, b2) {
  a2.finishedWork = null;
  a2.finishedLanes = 0;
  var c6 = a2.timeoutHandle;
  -1 !== c6 && (a2.timeoutHandle = -1, Gf(c6));
  if (null !== Y)
    for (c6 = Y.return; null !== c6; ) {
      var d2 = c6;
      wg(d2);
      switch (d2.tag) {
        case 1:
          d2 = d2.type.childContextTypes;
          null !== d2 && void 0 !== d2 && $f();
          break;
        case 3:
          Jh();
          E$2(Wf);
          E$2(H$2);
          Oh();
          break;
        case 5:
          Lh(d2);
          break;
        case 4:
          Jh();
          break;
        case 13:
          E$2(M$2);
          break;
        case 19:
          E$2(M$2);
          break;
        case 10:
          Rg(d2.type._context);
          break;
        case 22:
        case 23:
          Ij();
      }
      c6 = c6.return;
    }
  R$2 = a2;
  Y = a2 = wh(a2.current, null);
  Z$2 = gj = b2;
  T = 0;
  qk = null;
  sk = rk = hh = 0;
  uk = tk = null;
  if (null !== Wg) {
    for (b2 = 0; b2 < Wg.length; b2++)
      if (c6 = Wg[b2], d2 = c6.interleaved, null !== d2) {
        c6.interleaved = null;
        var e2 = d2.next, f2 = c6.pending;
        if (null !== f2) {
          var g2 = f2.next;
          f2.next = e2;
          d2.next = g2;
        }
        c6.pending = d2;
      }
    Wg = null;
  }
  return a2;
}
function Nk(a2, b2) {
  do {
    var c6 = Y;
    try {
      Qg();
      Ph.current = ai;
      if (Sh) {
        for (var d2 = N$2.memoizedState; null !== d2; ) {
          var e2 = d2.queue;
          null !== e2 && (e2.pending = null);
          d2 = d2.next;
        }
        Sh = false;
      }
      Rh = 0;
      P$2 = O$2 = N$2 = null;
      Th = false;
      Uh = 0;
      ok.current = null;
      if (null === c6 || null === c6.return) {
        T = 1;
        qk = b2;
        Y = null;
        break;
      }
      a: {
        var f2 = a2, g2 = c6.return, h2 = c6, k2 = b2;
        b2 = Z$2;
        h2.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h2, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Vi(g2);
          if (null !== y2) {
            y2.flags &= -257;
            Wi(y2, g2, h2, f2, b2);
            y2.mode & 1 && Ti(f2, l2, b2);
            b2 = y2;
            k2 = l2;
            var n2 = b2.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b2.updateQueue = t2;
            } else
              n2.add(k2);
            break a;
          } else {
            if (0 === (b2 & 1)) {
              Ti(f2, l2, b2);
              uj();
              break a;
            }
            k2 = Error(p$a(426));
          }
        } else if (I$2 && h2.mode & 1) {
          var J2 = Vi(g2);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Wi(J2, g2, h2, f2, b2);
            Jg(Ki(k2, h2));
            break a;
          }
        }
        f2 = k2 = Ki(k2, h2);
        4 !== T && (T = 2);
        null === tk ? tk = [f2] : tk.push(f2);
        f2 = g2;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b2 &= -b2;
              f2.lanes |= b2;
              var x2 = Oi(f2, k2, b2);
              fh(f2, x2);
              break a;
            case 1:
              h2 = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Si || !Si.has(u2)))) {
                f2.flags |= 65536;
                b2 &= -b2;
                f2.lanes |= b2;
                var F2 = Ri(f2, h2, b2);
                fh(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Tk(c6);
    } catch (na) {
      b2 = na;
      Y === c6 && null !== c6 && (Y = c6 = c6.return);
      continue;
    }
    break;
  } while (1);
}
function Kk() {
  var a2 = nk.current;
  nk.current = ai;
  return null === a2 ? ai : a2;
}
function uj() {
  if (0 === T || 3 === T || 2 === T)
    T = 4;
  null === R$2 || 0 === (hh & 268435455) && 0 === (rk & 268435455) || Dk(R$2, Z$2);
}
function Jk(a2, b2) {
  var c6 = K;
  K |= 2;
  var d2 = Kk();
  if (R$2 !== a2 || Z$2 !== b2)
    vk = null, Lk(a2, b2);
  do
    try {
      Uk();
      break;
    } catch (e2) {
      Nk(a2, e2);
    }
  while (1);
  Qg();
  K = c6;
  nk.current = d2;
  if (null !== Y)
    throw Error(p$a(261));
  R$2 = null;
  Z$2 = 0;
  return T;
}
function Uk() {
  for (; null !== Y; )
    Vk(Y);
}
function Mk() {
  for (; null !== Y && !cc(); )
    Vk(Y);
}
function Vk(a2) {
  var b2 = Wk(a2.alternate, a2, gj);
  a2.memoizedProps = a2.pendingProps;
  null === b2 ? Tk(a2) : Y = b2;
  ok.current = null;
}
function Tk(a2) {
  var b2 = a2;
  do {
    var c6 = b2.alternate;
    a2 = b2.return;
    if (0 === (b2.flags & 32768)) {
      if (c6 = Fj(c6, b2, gj), null !== c6) {
        Y = c6;
        return;
      }
    } else {
      c6 = Jj(c6, b2);
      if (null !== c6) {
        c6.flags &= 32767;
        Y = c6;
        return;
      }
      if (null !== a2)
        a2.flags |= 32768, a2.subtreeFlags = 0, a2.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b2 = b2.sibling;
    if (null !== b2) {
      Y = b2;
      return;
    }
    Y = b2 = a2;
  } while (null !== b2);
  0 === T && (T = 5);
}
function Qk(a2, b2, c6) {
  var d2 = C, e2 = pk.transition;
  try {
    pk.transition = null, C = 1, Xk(a2, b2, c6, d2);
  } finally {
    pk.transition = e2, C = d2;
  }
  return null;
}
function Xk(a2, b2, c6, d2) {
  do
    Ik();
  while (null !== xk);
  if (0 !== (K & 6))
    throw Error(p$a(327));
  c6 = a2.finishedWork;
  var e2 = a2.finishedLanes;
  if (null === c6)
    return null;
  a2.finishedWork = null;
  a2.finishedLanes = 0;
  if (c6 === a2.current)
    throw Error(p$a(177));
  a2.callbackNode = null;
  a2.callbackPriority = 0;
  var f2 = c6.lanes | c6.childLanes;
  Bc(a2, f2);
  a2 === R$2 && (Y = R$2 = null, Z$2 = 0);
  0 === (c6.subtreeFlags & 2064) && 0 === (c6.flags & 2064) || wk || (wk = true, Gk(hc, function() {
    Ik();
    return null;
  }));
  f2 = 0 !== (c6.flags & 15990);
  if (0 !== (c6.subtreeFlags & 15990) || f2) {
    f2 = pk.transition;
    pk.transition = null;
    var g2 = C;
    C = 1;
    var h2 = K;
    K |= 4;
    ok.current = null;
    Pj(a2, c6);
    ek(c6, a2);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a2.current = c6;
    ik(c6);
    dc();
    K = h2;
    C = g2;
    pk.transition = f2;
  } else
    a2.current = c6;
  wk && (wk = false, xk = a2, yk = e2);
  f2 = a2.pendingLanes;
  0 === f2 && (Si = null);
  mc(c6.stateNode);
  Ek(a2, B$2());
  if (null !== b2)
    for (d2 = a2.onRecoverableError, c6 = 0; c6 < b2.length; c6++)
      e2 = b2[c6], d2(e2.value, { componentStack: e2.stack, digest: e2.digest });
  if (Pi)
    throw Pi = false, a2 = Qi, Qi = null, a2;
  0 !== (yk & 1) && 0 !== a2.tag && Ik();
  f2 = a2.pendingLanes;
  0 !== (f2 & 1) ? a2 === Ak ? zk++ : (zk = 0, Ak = a2) : zk = 0;
  jg();
  return null;
}
function Ik() {
  if (null !== xk) {
    var a2 = Dc(yk), b2 = pk.transition, c6 = C;
    try {
      pk.transition = null;
      C = 16 > a2 ? 16 : a2;
      if (null === xk)
        var d2 = false;
      else {
        a2 = xk;
        xk = null;
        yk = 0;
        if (0 !== (K & 6))
          throw Error(p$a(331));
        var e2 = K;
        K |= 4;
        for (V = a2.current; null !== V; ) {
          var f2 = V, g2 = f2.child;
          if (0 !== (V.flags & 16)) {
            var h2 = f2.deletions;
            if (null !== h2) {
              for (var k2 = 0; k2 < h2.length; k2++) {
                var l2 = h2[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2)
                    q2.return = m2, V = q2;
                  else
                    for (; null !== V; ) {
                      m2 = V;
                      var r2 = m2.sibling, y2 = m2.return;
                      Tj(m2);
                      if (m2 === l2) {
                        V = null;
                        break;
                      }
                      if (null !== r2) {
                        r2.return = y2;
                        V = r2;
                        break;
                      }
                      V = y2;
                    }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g2)
            g2.return = f2, V = g2;
          else
            b:
              for (; null !== V; ) {
                f2 = V;
                if (0 !== (f2.flags & 2048))
                  switch (f2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, f2, f2.return);
                  }
                var x2 = f2.sibling;
                if (null !== x2) {
                  x2.return = f2.return;
                  V = x2;
                  break b;
                }
                V = f2.return;
              }
        }
        var w2 = a2.current;
        for (V = w2; null !== V; ) {
          g2 = V;
          var u2 = g2.child;
          if (0 !== (g2.subtreeFlags & 2064) && null !== u2)
            u2.return = g2, V = u2;
          else
            b:
              for (g2 = w2; null !== V; ) {
                h2 = V;
                if (0 !== (h2.flags & 2048))
                  try {
                    switch (h2.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Rj(9, h2);
                    }
                  } catch (na) {
                    W$2(h2, h2.return, na);
                  }
                if (h2 === g2) {
                  V = null;
                  break b;
                }
                var F2 = h2.sibling;
                if (null !== F2) {
                  F2.return = h2.return;
                  V = F2;
                  break b;
                }
                V = h2.return;
              }
        }
        K = e2;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot)
          try {
            lc.onPostCommitFiberRoot(kc, a2);
          } catch (na) {
          }
        d2 = true;
      }
      return d2;
    } finally {
      C = c6, pk.transition = b2;
    }
  }
  return false;
}
function Yk(a2, b2, c6) {
  b2 = Ki(c6, b2);
  b2 = Oi(a2, b2, 1);
  a2 = dh(a2, b2, 1);
  b2 = L$2();
  null !== a2 && (Ac(a2, 1, b2), Ek(a2, b2));
}
function W$2(a2, b2, c6) {
  if (3 === a2.tag)
    Yk(a2, a2, c6);
  else
    for (; null !== b2; ) {
      if (3 === b2.tag) {
        Yk(b2, a2, c6);
        break;
      } else if (1 === b2.tag) {
        var d2 = b2.stateNode;
        if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Si || !Si.has(d2))) {
          a2 = Ki(c6, a2);
          a2 = Ri(b2, a2, 1);
          b2 = dh(b2, a2, 1);
          a2 = L$2();
          null !== b2 && (Ac(b2, 1, a2), Ek(b2, a2));
          break;
        }
      }
      b2 = b2.return;
    }
}
function Ui(a2, b2, c6) {
  var d2 = a2.pingCache;
  null !== d2 && d2.delete(b2);
  b2 = L$2();
  a2.pingedLanes |= a2.suspendedLanes & c6;
  R$2 === a2 && (Z$2 & c6) === c6 && (4 === T || 3 === T && (Z$2 & 130023424) === Z$2 && 500 > B$2() - gk ? Lk(a2, 0) : sk |= c6);
  Ek(a2, b2);
}
function Zk(a2, b2) {
  0 === b2 && (0 === (a2.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c6 = L$2();
  a2 = Zg(a2, b2);
  null !== a2 && (Ac(a2, b2, c6), Ek(a2, c6));
}
function vj(a2) {
  var b2 = a2.memoizedState, c6 = 0;
  null !== b2 && (c6 = b2.retryLane);
  Zk(a2, c6);
}
function ck(a2, b2) {
  var c6 = 0;
  switch (a2.tag) {
    case 13:
      var d2 = a2.stateNode;
      var e2 = a2.memoizedState;
      null !== e2 && (c6 = e2.retryLane);
      break;
    case 19:
      d2 = a2.stateNode;
      break;
    default:
      throw Error(p$a(314));
  }
  null !== d2 && d2.delete(b2);
  Zk(a2, c6);
}
var Wk;
Wk = function(a2, b2, c6) {
  if (null !== a2)
    if (a2.memoizedProps !== b2.pendingProps || Wf.current)
      Ug = true;
    else {
      if (0 === (a2.lanes & c6) && 0 === (b2.flags & 128))
        return Ug = false, zj(a2, b2, c6);
      Ug = 0 !== (a2.flags & 131072) ? true : false;
    }
  else
    Ug = false, I$2 && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
  b2.lanes = 0;
  switch (b2.tag) {
    case 2:
      var d2 = b2.type;
      jj(a2, b2);
      a2 = b2.pendingProps;
      var e2 = Yf(b2, H$2.current);
      Tg(b2, c6);
      e2 = Xh(null, b2, d2, a2, e2, c6);
      var f2 = bi();
      b2.flags |= 1;
      "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, ah(b2), e2.updater = nh, b2.stateNode = e2, e2._reactInternals = b2, rh(b2, d2, a2, c6), b2 = kj(null, b2, d2, true, f2, c6)) : (b2.tag = 0, I$2 && f2 && vg(b2), Yi(null, b2, e2, c6), b2 = b2.child);
      return b2;
    case 16:
      d2 = b2.elementType;
      a: {
        jj(a2, b2);
        a2 = b2.pendingProps;
        e2 = d2._init;
        d2 = e2(d2._payload);
        b2.type = d2;
        e2 = b2.tag = $k(d2);
        a2 = Lg(d2, a2);
        switch (e2) {
          case 0:
            b2 = dj(null, b2, d2, a2, c6);
            break a;
          case 1:
            b2 = ij(null, b2, d2, a2, c6);
            break a;
          case 11:
            b2 = Zi(null, b2, d2, a2, c6);
            break a;
          case 14:
            b2 = aj(null, b2, d2, Lg(d2.type, a2), c6);
            break a;
        }
        throw Error(p$a(
          306,
          d2,
          ""
        ));
      }
      return b2;
    case 0:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Lg(d2, e2), dj(a2, b2, d2, e2, c6);
    case 1:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Lg(d2, e2), ij(a2, b2, d2, e2, c6);
    case 3:
      a: {
        lj(b2);
        if (null === a2)
          throw Error(p$a(387));
        d2 = b2.pendingProps;
        f2 = b2.memoizedState;
        e2 = f2.element;
        bh(a2, b2);
        gh(b2, d2, null, c6);
        var g2 = b2.memoizedState;
        d2 = g2.element;
        if (f2.isDehydrated)
          if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
            e2 = Ki(Error(p$a(423)), b2);
            b2 = mj(a2, b2, d2, c6, e2);
            break a;
          } else if (d2 !== e2) {
            e2 = Ki(Error(p$a(424)), b2);
            b2 = mj(a2, b2, d2, c6, e2);
            break a;
          } else
            for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I$2 = true, zg = null, c6 = Ch(b2, null, d2, c6), b2.child = c6; c6; )
              c6.flags = c6.flags & -3 | 4096, c6 = c6.sibling;
        else {
          Ig();
          if (d2 === e2) {
            b2 = $i(a2, b2, c6);
            break a;
          }
          Yi(a2, b2, d2, c6);
        }
        b2 = b2.child;
      }
      return b2;
    case 5:
      return Kh(b2), null === a2 && Eg(b2), d2 = b2.type, e2 = b2.pendingProps, f2 = null !== a2 ? a2.memoizedProps : null, g2 = e2.children, Ef(d2, e2) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), hj(a2, b2), Yi(a2, b2, g2, c6), b2.child;
    case 6:
      return null === a2 && Eg(b2), null;
    case 13:
      return pj(a2, b2, c6);
    case 4:
      return Ih(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a2 ? b2.child = Bh(b2, null, d2, c6) : Yi(a2, b2, d2, c6), b2.child;
    case 11:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Lg(d2, e2), Zi(a2, b2, d2, e2, c6);
    case 7:
      return Yi(a2, b2, b2.pendingProps, c6), b2.child;
    case 8:
      return Yi(a2, b2, b2.pendingProps.children, c6), b2.child;
    case 12:
      return Yi(a2, b2, b2.pendingProps.children, c6), b2.child;
    case 10:
      a: {
        d2 = b2.type._context;
        e2 = b2.pendingProps;
        f2 = b2.memoizedProps;
        g2 = e2.value;
        G$2(Mg, d2._currentValue);
        d2._currentValue = g2;
        if (null !== f2)
          if (He(f2.value, g2)) {
            if (f2.children === e2.children && !Wf.current) {
              b2 = $i(a2, b2, c6);
              break a;
            }
          } else
            for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
              var h2 = f2.dependencies;
              if (null !== h2) {
                g2 = f2.child;
                for (var k2 = h2.firstContext; null !== k2; ) {
                  if (k2.context === d2) {
                    if (1 === f2.tag) {
                      k2 = ch(-1, c6 & -c6);
                      k2.tag = 2;
                      var l2 = f2.updateQueue;
                      if (null !== l2) {
                        l2 = l2.shared;
                        var m2 = l2.pending;
                        null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                        l2.pending = k2;
                      }
                    }
                    f2.lanes |= c6;
                    k2 = f2.alternate;
                    null !== k2 && (k2.lanes |= c6);
                    Sg(
                      f2.return,
                      c6,
                      b2
                    );
                    h2.lanes |= c6;
                    break;
                  }
                  k2 = k2.next;
                }
              } else if (10 === f2.tag)
                g2 = f2.type === b2.type ? null : f2.child;
              else if (18 === f2.tag) {
                g2 = f2.return;
                if (null === g2)
                  throw Error(p$a(341));
                g2.lanes |= c6;
                h2 = g2.alternate;
                null !== h2 && (h2.lanes |= c6);
                Sg(g2, c6, b2);
                g2 = f2.sibling;
              } else
                g2 = f2.child;
              if (null !== g2)
                g2.return = f2;
              else
                for (g2 = f2; null !== g2; ) {
                  if (g2 === b2) {
                    g2 = null;
                    break;
                  }
                  f2 = g2.sibling;
                  if (null !== f2) {
                    f2.return = g2.return;
                    g2 = f2;
                    break;
                  }
                  g2 = g2.return;
                }
              f2 = g2;
            }
        Yi(a2, b2, e2.children, c6);
        b2 = b2.child;
      }
      return b2;
    case 9:
      return e2 = b2.type, d2 = b2.pendingProps.children, Tg(b2, c6), e2 = Vg(e2), d2 = d2(e2), b2.flags |= 1, Yi(a2, b2, d2, c6), b2.child;
    case 14:
      return d2 = b2.type, e2 = Lg(d2, b2.pendingProps), e2 = Lg(d2.type, e2), aj(a2, b2, d2, e2, c6);
    case 15:
      return cj(a2, b2, b2.type, b2.pendingProps, c6);
    case 17:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Lg(d2, e2), jj(a2, b2), b2.tag = 1, Zf(d2) ? (a2 = true, cg(b2)) : a2 = false, Tg(b2, c6), ph(b2, d2, e2), rh(b2, d2, e2, c6), kj(null, b2, d2, true, a2, c6);
    case 19:
      return yj(a2, b2, c6);
    case 22:
      return ej(a2, b2, c6);
  }
  throw Error(p$a(156, b2.tag));
};
function Gk(a2, b2) {
  return ac(a2, b2);
}
function al(a2, b2, c6, d2) {
  this.tag = a2;
  this.key = c6;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b2;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d2;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a2, b2, c6, d2) {
  return new al(a2, b2, c6, d2);
}
function bj(a2) {
  a2 = a2.prototype;
  return !(!a2 || !a2.isReactComponent);
}
function $k(a2) {
  if ("function" === typeof a2)
    return bj(a2) ? 1 : 0;
  if (void 0 !== a2 && null !== a2) {
    a2 = a2.$$typeof;
    if (a2 === Da)
      return 11;
    if (a2 === Ga)
      return 14;
  }
  return 2;
}
function wh(a2, b2) {
  var c6 = a2.alternate;
  null === c6 ? (c6 = Bg(a2.tag, b2, a2.key, a2.mode), c6.elementType = a2.elementType, c6.type = a2.type, c6.stateNode = a2.stateNode, c6.alternate = a2, a2.alternate = c6) : (c6.pendingProps = b2, c6.type = a2.type, c6.flags = 0, c6.subtreeFlags = 0, c6.deletions = null);
  c6.flags = a2.flags & 14680064;
  c6.childLanes = a2.childLanes;
  c6.lanes = a2.lanes;
  c6.child = a2.child;
  c6.memoizedProps = a2.memoizedProps;
  c6.memoizedState = a2.memoizedState;
  c6.updateQueue = a2.updateQueue;
  b2 = a2.dependencies;
  c6.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
  c6.sibling = a2.sibling;
  c6.index = a2.index;
  c6.ref = a2.ref;
  return c6;
}
function yh(a2, b2, c6, d2, e2, f2) {
  var g2 = 2;
  d2 = a2;
  if ("function" === typeof a2)
    bj(a2) && (g2 = 1);
  else if ("string" === typeof a2)
    g2 = 5;
  else
    a:
      switch (a2) {
        case ya:
          return Ah(c6.children, e2, f2, b2);
        case za:
          g2 = 8;
          e2 |= 8;
          break;
        case Aa:
          return a2 = Bg(12, c6, b2, e2 | 2), a2.elementType = Aa, a2.lanes = f2, a2;
        case Ea:
          return a2 = Bg(13, c6, b2, e2), a2.elementType = Ea, a2.lanes = f2, a2;
        case Fa:
          return a2 = Bg(19, c6, b2, e2), a2.elementType = Fa, a2.lanes = f2, a2;
        case Ia:
          return qj(c6, e2, f2, b2);
        default:
          if ("object" === typeof a2 && null !== a2)
            switch (a2.$$typeof) {
              case Ba:
                g2 = 10;
                break a;
              case Ca:
                g2 = 9;
                break a;
              case Da:
                g2 = 11;
                break a;
              case Ga:
                g2 = 14;
                break a;
              case Ha:
                g2 = 16;
                d2 = null;
                break a;
            }
          throw Error(p$a(130, null == a2 ? a2 : typeof a2, ""));
      }
  b2 = Bg(g2, c6, b2, e2);
  b2.elementType = a2;
  b2.type = d2;
  b2.lanes = f2;
  return b2;
}
function Ah(a2, b2, c6, d2) {
  a2 = Bg(7, a2, d2, b2);
  a2.lanes = c6;
  return a2;
}
function qj(a2, b2, c6, d2) {
  a2 = Bg(22, a2, d2, b2);
  a2.elementType = Ia;
  a2.lanes = c6;
  a2.stateNode = { isHidden: false };
  return a2;
}
function xh(a2, b2, c6) {
  a2 = Bg(6, a2, null, b2);
  a2.lanes = c6;
  return a2;
}
function zh(a2, b2, c6) {
  b2 = Bg(4, null !== a2.children ? a2.children : [], a2.key, b2);
  b2.lanes = c6;
  b2.stateNode = { containerInfo: a2.containerInfo, pendingChildren: null, implementation: a2.implementation };
  return b2;
}
function bl(a2, b2, c6, d2, e2) {
  this.tag = b2;
  this.containerInfo = a2;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d2;
  this.onRecoverableError = e2;
  this.mutableSourceEagerHydrationData = null;
}
function cl(a2, b2, c6, d2, e2, f2, g2, h2, k2) {
  a2 = new bl(a2, b2, c6, h2, k2);
  1 === b2 ? (b2 = 1, true === f2 && (b2 |= 8)) : b2 = 0;
  f2 = Bg(3, null, null, b2);
  a2.current = f2;
  f2.stateNode = a2;
  f2.memoizedState = { element: d2, isDehydrated: c6, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  ah(f2);
  return a2;
}
function dl(a2, b2, c6) {
  var d2 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d2 ? null : "" + d2, children: a2, containerInfo: b2, implementation: c6 };
}
function el(a2) {
  if (!a2)
    return Vf;
  a2 = a2._reactInternals;
  a: {
    if (Vb(a2) !== a2 || 1 !== a2.tag)
      throw Error(p$a(170));
    var b2 = a2;
    do {
      switch (b2.tag) {
        case 3:
          b2 = b2.stateNode.context;
          break a;
        case 1:
          if (Zf(b2.type)) {
            b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b2 = b2.return;
    } while (null !== b2);
    throw Error(p$a(171));
  }
  if (1 === a2.tag) {
    var c6 = a2.type;
    if (Zf(c6))
      return bg(a2, c6, b2);
  }
  return b2;
}
function fl(a2, b2, c6, d2, e2, f2, g2, h2, k2) {
  a2 = cl(c6, d2, true, a2, e2, f2, g2, h2, k2);
  a2.context = el(null);
  c6 = a2.current;
  d2 = L$2();
  e2 = lh(c6);
  f2 = ch(d2, e2);
  f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
  dh(c6, f2, e2);
  a2.current.lanes = e2;
  Ac(a2, e2, d2);
  Ek(a2, d2);
  return a2;
}
function gl(a2, b2, c6, d2) {
  var e2 = b2.current, f2 = L$2(), g2 = lh(e2);
  c6 = el(c6);
  null === b2.context ? b2.context = c6 : b2.pendingContext = c6;
  b2 = ch(f2, g2);
  b2.payload = { element: a2 };
  d2 = void 0 === d2 ? null : d2;
  null !== d2 && (b2.callback = d2);
  a2 = dh(e2, b2, g2);
  null !== a2 && (mh(a2, e2, g2, f2), eh(a2, e2, g2));
  return g2;
}
function hl(a2) {
  a2 = a2.current;
  if (!a2.child)
    return null;
  switch (a2.child.tag) {
    case 5:
      return a2.child.stateNode;
    default:
      return a2.child.stateNode;
  }
}
function il(a2, b2) {
  a2 = a2.memoizedState;
  if (null !== a2 && null !== a2.dehydrated) {
    var c6 = a2.retryLane;
    a2.retryLane = 0 !== c6 && c6 < b2 ? c6 : b2;
  }
}
function jl(a2, b2) {
  il(a2, b2);
  (a2 = a2.alternate) && il(a2, b2);
}
function kl() {
  return null;
}
var ll = "function" === typeof reportError ? reportError : function(a2) {
  console.error(a2);
};
function ml(a2) {
  this._internalRoot = a2;
}
nl.prototype.render = ml.prototype.render = function(a2) {
  var b2 = this._internalRoot;
  if (null === b2)
    throw Error(p$a(409));
  gl(a2, b2, null, null);
};
nl.prototype.unmount = ml.prototype.unmount = function() {
  var a2 = this._internalRoot;
  if (null !== a2) {
    this._internalRoot = null;
    var b2 = a2.containerInfo;
    Sk(function() {
      gl(null, a2, null, null);
    });
    b2[uf] = null;
  }
};
function nl(a2) {
  this._internalRoot = a2;
}
nl.prototype.unstable_scheduleHydration = function(a2) {
  if (a2) {
    var b2 = Hc();
    a2 = { blockedOn: null, target: a2, priority: b2 };
    for (var c6 = 0; c6 < Qc.length && 0 !== b2 && b2 < Qc[c6].priority; c6++)
      ;
    Qc.splice(c6, 0, a2);
    0 === c6 && Vc(a2);
  }
};
function ol(a2) {
  return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType);
}
function pl(a2) {
  return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType && (8 !== a2.nodeType || " react-mount-point-unstable " !== a2.nodeValue));
}
function ql() {
}
function rl(a2, b2, c6, d2, e2) {
  if (e2) {
    if ("function" === typeof d2) {
      var f2 = d2;
      d2 = function() {
        var a3 = hl(g2);
        f2.call(a3);
      };
    }
    var g2 = fl(b2, d2, a2, 0, null, false, false, "", ql);
    a2._reactRootContainer = g2;
    a2[uf] = g2.current;
    sf(8 === a2.nodeType ? a2.parentNode : a2);
    Sk();
    return g2;
  }
  for (; e2 = a2.lastChild; )
    a2.removeChild(e2);
  if ("function" === typeof d2) {
    var h2 = d2;
    d2 = function() {
      var a3 = hl(k2);
      h2.call(a3);
    };
  }
  var k2 = cl(a2, 0, false, null, null, false, false, "", ql);
  a2._reactRootContainer = k2;
  a2[uf] = k2.current;
  sf(8 === a2.nodeType ? a2.parentNode : a2);
  Sk(function() {
    gl(b2, k2, c6, d2);
  });
  return k2;
}
function sl(a2, b2, c6, d2, e2) {
  var f2 = c6._reactRootContainer;
  if (f2) {
    var g2 = f2;
    if ("function" === typeof e2) {
      var h2 = e2;
      e2 = function() {
        var a3 = hl(g2);
        h2.call(a3);
      };
    }
    gl(b2, g2, a2, e2);
  } else
    g2 = rl(c6, b2, a2, e2, d2);
  return hl(g2);
}
Ec = function(a2) {
  switch (a2.tag) {
    case 3:
      var b2 = a2.stateNode;
      if (b2.current.memoizedState.isDehydrated) {
        var c6 = tc(b2.pendingLanes);
        0 !== c6 && (Cc(b2, c6 | 1), Ek(b2, B$2()), 0 === (K & 6) && (Hj = B$2() + 500, jg()));
      }
      break;
    case 13:
      Sk(function() {
        var b3 = Zg(a2, 1);
        if (null !== b3) {
          var c7 = L$2();
          mh(b3, a2, 1, c7);
        }
      }), jl(a2, 1);
  }
};
Fc = function(a2) {
  if (13 === a2.tag) {
    var b2 = Zg(a2, 134217728);
    if (null !== b2) {
      var c6 = L$2();
      mh(b2, a2, 134217728, c6);
    }
    jl(a2, 134217728);
  }
};
Gc = function(a2) {
  if (13 === a2.tag) {
    var b2 = lh(a2), c6 = Zg(a2, b2);
    if (null !== c6) {
      var d2 = L$2();
      mh(c6, a2, b2, d2);
    }
    jl(a2, b2);
  }
};
Hc = function() {
  return C;
};
Ic = function(a2, b2) {
  var c6 = C;
  try {
    return C = a2, b2();
  } finally {
    C = c6;
  }
};
yb = function(a2, b2, c6) {
  switch (b2) {
    case "input":
      bb(a2, c6);
      b2 = c6.name;
      if ("radio" === c6.type && null != b2) {
        for (c6 = a2; c6.parentNode; )
          c6 = c6.parentNode;
        c6 = c6.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
        for (b2 = 0; b2 < c6.length; b2++) {
          var d2 = c6[b2];
          if (d2 !== a2 && d2.form === a2.form) {
            var e2 = Db(d2);
            if (!e2)
              throw Error(p$a(90));
            Wa(d2);
            bb(d2, e2);
          }
        }
      }
      break;
    case "textarea":
      ib(a2, c6);
      break;
    case "select":
      b2 = c6.value, null != b2 && fb(a2, !!c6.multiple, b2, false);
  }
};
Gb = Rk;
Hb = Sk;
var tl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Rk] }, ul = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" };
var vl = { bundleType: ul.bundleType, version: ul.version, rendererPackageName: ul.rendererPackageName, rendererConfig: ul.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a2) {
  a2 = Zb(a2);
  return null === a2 ? null : a2.stateNode;
}, findFiberByHostInstance: ul.findFiberByHostInstance || kl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!wl.isDisabled && wl.supportsFiber)
    try {
      kc = wl.inject(vl), lc = wl;
    } catch (a2) {
    }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tl;
reactDom_production_min.createPortal = function(a2, b2) {
  var c6 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!ol(b2))
    throw Error(p$a(200));
  return dl(a2, b2, null, c6);
};
reactDom_production_min.createRoot = function(a2, b2) {
  if (!ol(a2))
    throw Error(p$a(299));
  var c6 = false, d2 = "", e2 = ll;
  null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c6 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e2 = b2.onRecoverableError));
  b2 = cl(a2, 1, false, null, null, c6, false, d2, e2);
  a2[uf] = b2.current;
  sf(8 === a2.nodeType ? a2.parentNode : a2);
  return new ml(b2);
};
reactDom_production_min.findDOMNode = function(a2) {
  if (null == a2)
    return null;
  if (1 === a2.nodeType)
    return a2;
  var b2 = a2._reactInternals;
  if (void 0 === b2) {
    if ("function" === typeof a2.render)
      throw Error(p$a(188));
    a2 = Object.keys(a2).join(",");
    throw Error(p$a(268, a2));
  }
  a2 = Zb(b2);
  a2 = null === a2 ? null : a2.stateNode;
  return a2;
};
reactDom_production_min.flushSync = function(a2) {
  return Sk(a2);
};
reactDom_production_min.hydrate = function(a2, b2, c6) {
  if (!pl(b2))
    throw Error(p$a(200));
  return sl(null, a2, b2, true, c6);
};
reactDom_production_min.hydrateRoot = function(a2, b2, c6) {
  if (!ol(a2))
    throw Error(p$a(405));
  var d2 = null != c6 && c6.hydratedSources || null, e2 = false, f2 = "", g2 = ll;
  null !== c6 && void 0 !== c6 && (true === c6.unstable_strictMode && (e2 = true), void 0 !== c6.identifierPrefix && (f2 = c6.identifierPrefix), void 0 !== c6.onRecoverableError && (g2 = c6.onRecoverableError));
  b2 = fl(b2, null, a2, 1, null != c6 ? c6 : null, e2, false, f2, g2);
  a2[uf] = b2.current;
  sf(a2);
  if (d2)
    for (a2 = 0; a2 < d2.length; a2++)
      c6 = d2[a2], e2 = c6._getVersion, e2 = e2(c6._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c6, e2] : b2.mutableSourceEagerHydrationData.push(
        c6,
        e2
      );
  return new nl(b2);
};
reactDom_production_min.render = function(a2, b2, c6) {
  if (!pl(b2))
    throw Error(p$a(200));
  return sl(null, a2, b2, false, c6);
};
reactDom_production_min.unmountComponentAtNode = function(a2) {
  if (!pl(a2))
    throw Error(p$a(40));
  return a2._reactRootContainer ? (Sk(function() {
    sl(null, null, a2, false, function() {
      a2._reactRootContainer = null;
      a2[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Rk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a2, b2, c6, d2) {
  if (!pl(c6))
    throw Error(p$a(200));
  if (null == a2 || void 0 === a2._reactInternals)
    throw Error(p$a(38));
  return sl(a2, b2, c6, false, d2);
};
reactDom_production_min.version = "18.2.0-next-9e3b772b8-20220608";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m$8 = reactDomExports;
{
  client.createRoot = m$8.createRoot;
  client.hydrateRoot = m$8.hydrateRoot;
}
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production_min$1 = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var e$5 = reactExports;
function h$9(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var k$7 = "function" === typeof Object.is ? Object.is : h$9, l$7 = e$5.useState, m$7 = e$5.useEffect, n$9 = e$5.useLayoutEffect, p$9 = e$5.useDebugValue;
function q$9(a2, b2) {
  var d2 = b2(), f2 = l$7({ inst: { value: d2, getSnapshot: b2 } }), c6 = f2[0].inst, g2 = f2[1];
  n$9(function() {
    c6.value = d2;
    c6.getSnapshot = b2;
    r$7(c6) && g2({ inst: c6 });
  }, [a2, d2, b2]);
  m$7(function() {
    r$7(c6) && g2({ inst: c6 });
    return a2(function() {
      r$7(c6) && g2({ inst: c6 });
    });
  }, [a2]);
  p$9(d2);
  return d2;
}
function r$7(a2) {
  var b2 = a2.getSnapshot;
  a2 = a2.value;
  try {
    var d2 = b2();
    return !k$7(a2, d2);
  } catch (f2) {
    return true;
  }
}
function t$9(a2, b2) {
  return b2();
}
var u$7 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t$9 : q$9;
useSyncExternalStoreShim_production_min$1.useSyncExternalStore = void 0 !== e$5.useSyncExternalStore ? e$5.useSyncExternalStore : u$7;
{
  shim$2.exports = useSyncExternalStoreShim_production_min$1;
}
var shimExports$1 = shim$2.exports;
var withSelector_production_min$1 = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h$8 = reactExports, n$8 = shimExports$1;
function p$8(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var q$8 = "function" === typeof Object.is ? Object.is : p$8, r$6 = n$8.useSyncExternalStore, t$8 = h$8.useRef, u$6 = h$8.useEffect, v$7 = h$8.useMemo, w$5 = h$8.useDebugValue;
withSelector_production_min$1.useSyncExternalStoreWithSelector = function(a2, b2, e2, l2, g2) {
  var c6 = t$8(null);
  if (null === c6.current) {
    var f2 = { hasValue: false, value: null };
    c6.current = f2;
  } else
    f2 = c6.current;
  c6 = v$7(function() {
    function a3(a4) {
      if (!c7) {
        c7 = true;
        d3 = a4;
        a4 = l2(a4);
        if (void 0 !== g2 && f2.hasValue) {
          var b3 = f2.value;
          if (g2(b3, a4))
            return k2 = b3;
        }
        return k2 = a4;
      }
      b3 = k2;
      if (q$8(d3, a4))
        return b3;
      var e3 = l2(a4);
      if (void 0 !== g2 && g2(b3, e3))
        return b3;
      d3 = a4;
      return k2 = e3;
    }
    var c7 = false, d3, k2, m2 = void 0 === e2 ? null : e2;
    return [function() {
      return a3(b2());
    }, null === m2 ? void 0 : function() {
      return a3(m2());
    }];
  }, [b2, e2, l2, g2]);
  var d2 = r$6(a2, c6[0], c6[1]);
  u$6(function() {
    f2.hasValue = true;
    f2.value = d2;
  }, [d2]);
  w$5(d2);
  return d2;
};
function defaultNoopBatch(callback) {
  callback();
}
let batch = defaultNoopBatch;
const setBatch = (newBatch) => batch = newBatch;
const getBatch = () => batch;
const ReactReduxContext$1 = /* @__PURE__ */ reactExports.createContext(null);
function useReduxContext$1() {
  const contextValue = reactExports.useContext(ReactReduxContext$1);
  return contextValue;
}
var reactIs$3 = { exports: {} };
var reactIs_production_min$3 = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$5 = "function" === typeof Symbol && Symbol.for, c$5 = b$5 ? Symbol.for("react.element") : 60103, d$5 = b$5 ? Symbol.for("react.portal") : 60106, e$4 = b$5 ? Symbol.for("react.fragment") : 60107, f$5 = b$5 ? Symbol.for("react.strict_mode") : 60108, g$5 = b$5 ? Symbol.for("react.profiler") : 60114, h$7 = b$5 ? Symbol.for("react.provider") : 60109, k$6 = b$5 ? Symbol.for("react.context") : 60110, l$6 = b$5 ? Symbol.for("react.async_mode") : 60111, m$6 = b$5 ? Symbol.for("react.concurrent_mode") : 60111, n$7 = b$5 ? Symbol.for("react.forward_ref") : 60112, p$7 = b$5 ? Symbol.for("react.suspense") : 60113, q$7 = b$5 ? Symbol.for("react.suspense_list") : 60120, r$5 = b$5 ? Symbol.for("react.memo") : 60115, t$7 = b$5 ? Symbol.for("react.lazy") : 60116, v$6 = b$5 ? Symbol.for("react.block") : 60121, w$4 = b$5 ? Symbol.for("react.fundamental") : 60117, x$3 = b$5 ? Symbol.for("react.responder") : 60118, y$3 = b$5 ? Symbol.for("react.scope") : 60119;
function z$3(a2) {
  if ("object" === typeof a2 && null !== a2) {
    var u2 = a2.$$typeof;
    switch (u2) {
      case c$5:
        switch (a2 = a2.type, a2) {
          case l$6:
          case m$6:
          case e$4:
          case g$5:
          case f$5:
          case p$7:
            return a2;
          default:
            switch (a2 = a2 && a2.$$typeof, a2) {
              case k$6:
              case n$7:
              case t$7:
              case r$5:
              case h$7:
                return a2;
              default:
                return u2;
            }
        }
      case d$5:
        return u2;
    }
  }
}
function A$3(a2) {
  return z$3(a2) === m$6;
}
reactIs_production_min$3.AsyncMode = l$6;
reactIs_production_min$3.ConcurrentMode = m$6;
reactIs_production_min$3.ContextConsumer = k$6;
reactIs_production_min$3.ContextProvider = h$7;
reactIs_production_min$3.Element = c$5;
reactIs_production_min$3.ForwardRef = n$7;
reactIs_production_min$3.Fragment = e$4;
reactIs_production_min$3.Lazy = t$7;
reactIs_production_min$3.Memo = r$5;
reactIs_production_min$3.Portal = d$5;
reactIs_production_min$3.Profiler = g$5;
reactIs_production_min$3.StrictMode = f$5;
reactIs_production_min$3.Suspense = p$7;
reactIs_production_min$3.isAsyncMode = function(a2) {
  return A$3(a2) || z$3(a2) === l$6;
};
reactIs_production_min$3.isConcurrentMode = A$3;
reactIs_production_min$3.isContextConsumer = function(a2) {
  return z$3(a2) === k$6;
};
reactIs_production_min$3.isContextProvider = function(a2) {
  return z$3(a2) === h$7;
};
reactIs_production_min$3.isElement = function(a2) {
  return "object" === typeof a2 && null !== a2 && a2.$$typeof === c$5;
};
reactIs_production_min$3.isForwardRef = function(a2) {
  return z$3(a2) === n$7;
};
reactIs_production_min$3.isFragment = function(a2) {
  return z$3(a2) === e$4;
};
reactIs_production_min$3.isLazy = function(a2) {
  return z$3(a2) === t$7;
};
reactIs_production_min$3.isMemo = function(a2) {
  return z$3(a2) === r$5;
};
reactIs_production_min$3.isPortal = function(a2) {
  return z$3(a2) === d$5;
};
reactIs_production_min$3.isProfiler = function(a2) {
  return z$3(a2) === g$5;
};
reactIs_production_min$3.isStrictMode = function(a2) {
  return z$3(a2) === f$5;
};
reactIs_production_min$3.isSuspense = function(a2) {
  return z$3(a2) === p$7;
};
reactIs_production_min$3.isValidElementType = function(a2) {
  return "string" === typeof a2 || "function" === typeof a2 || a2 === e$4 || a2 === m$6 || a2 === g$5 || a2 === f$5 || a2 === p$7 || a2 === q$7 || "object" === typeof a2 && null !== a2 && (a2.$$typeof === t$7 || a2.$$typeof === r$5 || a2.$$typeof === h$7 || a2.$$typeof === k$6 || a2.$$typeof === n$7 || a2.$$typeof === w$4 || a2.$$typeof === x$3 || a2.$$typeof === y$3 || a2.$$typeof === v$6);
};
reactIs_production_min$3.typeOf = z$3;
{
  reactIs$3.exports = reactIs_production_min$3;
}
var reactIsExports$1 = reactIs$3.exports;
var reactIs$2 = reactIsExports$1;
var FORWARD_REF_STATICS$1 = {
  "$$typeof": true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS$1 = {
  "$$typeof": true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS$1 = {};
TYPE_STATICS$1[reactIs$2.ForwardRef] = FORWARD_REF_STATICS$1;
TYPE_STATICS$1[reactIs$2.Memo] = MEMO_STATICS$1;
var reactIs_production_min$2 = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$4 = Symbol.for("react.element"), c$4 = Symbol.for("react.portal"), d$4 = Symbol.for("react.fragment"), e$3 = Symbol.for("react.strict_mode"), f$4 = Symbol.for("react.profiler"), g$4 = Symbol.for("react.provider"), h$6 = Symbol.for("react.context"), k$5 = Symbol.for("react.server_context"), l$5 = Symbol.for("react.forward_ref"), m$5 = Symbol.for("react.suspense"), n$6 = Symbol.for("react.suspense_list"), p$6 = Symbol.for("react.memo"), q$6 = Symbol.for("react.lazy"), t$6 = Symbol.for("react.offscreen"), u$5;
u$5 = Symbol.for("react.module.reference");
function v$5(a2) {
  if ("object" === typeof a2 && null !== a2) {
    var r2 = a2.$$typeof;
    switch (r2) {
      case b$4:
        switch (a2 = a2.type, a2) {
          case d$4:
          case f$4:
          case e$3:
          case m$5:
          case n$6:
            return a2;
          default:
            switch (a2 = a2 && a2.$$typeof, a2) {
              case k$5:
              case h$6:
              case l$5:
              case q$6:
              case p$6:
              case g$4:
                return a2;
              default:
                return r2;
            }
        }
      case c$4:
        return r2;
    }
  }
}
reactIs_production_min$2.ContextConsumer = h$6;
reactIs_production_min$2.ContextProvider = g$4;
reactIs_production_min$2.Element = b$4;
reactIs_production_min$2.ForwardRef = l$5;
reactIs_production_min$2.Fragment = d$4;
reactIs_production_min$2.Lazy = q$6;
reactIs_production_min$2.Memo = p$6;
reactIs_production_min$2.Portal = c$4;
reactIs_production_min$2.Profiler = f$4;
reactIs_production_min$2.StrictMode = e$3;
reactIs_production_min$2.Suspense = m$5;
reactIs_production_min$2.SuspenseList = n$6;
reactIs_production_min$2.isAsyncMode = function() {
  return false;
};
reactIs_production_min$2.isConcurrentMode = function() {
  return false;
};
reactIs_production_min$2.isContextConsumer = function(a2) {
  return v$5(a2) === h$6;
};
reactIs_production_min$2.isContextProvider = function(a2) {
  return v$5(a2) === g$4;
};
reactIs_production_min$2.isElement = function(a2) {
  return "object" === typeof a2 && null !== a2 && a2.$$typeof === b$4;
};
reactIs_production_min$2.isForwardRef = function(a2) {
  return v$5(a2) === l$5;
};
reactIs_production_min$2.isFragment = function(a2) {
  return v$5(a2) === d$4;
};
reactIs_production_min$2.isLazy = function(a2) {
  return v$5(a2) === q$6;
};
reactIs_production_min$2.isMemo = function(a2) {
  return v$5(a2) === p$6;
};
reactIs_production_min$2.isPortal = function(a2) {
  return v$5(a2) === c$4;
};
reactIs_production_min$2.isProfiler = function(a2) {
  return v$5(a2) === f$4;
};
reactIs_production_min$2.isStrictMode = function(a2) {
  return v$5(a2) === e$3;
};
reactIs_production_min$2.isSuspense = function(a2) {
  return v$5(a2) === m$5;
};
reactIs_production_min$2.isSuspenseList = function(a2) {
  return v$5(a2) === n$6;
};
reactIs_production_min$2.isValidElementType = function(a2) {
  return "string" === typeof a2 || "function" === typeof a2 || a2 === d$4 || a2 === f$4 || a2 === e$3 || a2 === m$5 || a2 === n$6 || a2 === t$6 || "object" === typeof a2 && null !== a2 && (a2.$$typeof === q$6 || a2.$$typeof === p$6 || a2.$$typeof === g$4 || a2.$$typeof === h$6 || a2.$$typeof === l$5 || a2.$$typeof === u$5 || void 0 !== a2.getModuleId) ? true : false;
};
reactIs_production_min$2.typeOf = v$5;
function createListenerCollection() {
  const batch2 = getBatch();
  let first = null;
  let last = null;
  return {
    clear() {
      first = null;
      last = null;
    },
    notify() {
      batch2(() => {
        let listener = first;
        while (listener) {
          listener.callback();
          listener = listener.next;
        }
      });
    },
    get() {
      let listeners = [];
      let listener = first;
      while (listener) {
        listeners.push(listener);
        listener = listener.next;
      }
      return listeners;
    },
    subscribe(callback) {
      let isSubscribed = true;
      let listener = last = {
        callback,
        next: null,
        prev: last
      };
      if (listener.prev) {
        listener.prev.next = listener;
      } else {
        first = listener;
      }
      return function unsubscribe() {
        if (!isSubscribed || first === null)
          return;
        isSubscribed = false;
        if (listener.next) {
          listener.next.prev = listener.prev;
        } else {
          last = listener.prev;
        }
        if (listener.prev) {
          listener.prev.next = listener.next;
        } else {
          first = listener.next;
        }
      };
    }
  };
}
const nullListeners = {
  notify() {
  },
  get: () => []
};
function createSubscription(store2, parentSub) {
  let unsubscribe;
  let listeners = nullListeners;
  function addNestedSub(listener) {
    trySubscribe();
    return listeners.subscribe(listener);
  }
  function notifyNestedSubs() {
    listeners.notify();
  }
  function handleChangeWrapper() {
    if (subscription.onStateChange) {
      subscription.onStateChange();
    }
  }
  function isSubscribed() {
    return Boolean(unsubscribe);
  }
  function trySubscribe() {
    if (!unsubscribe) {
      unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store2.subscribe(handleChangeWrapper);
      listeners = createListenerCollection();
    }
  }
  function tryUnsubscribe() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = void 0;
      listeners.clear();
      listeners = nullListeners;
    }
  }
  const subscription = {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe,
    tryUnsubscribe,
    getListeners: () => listeners
  };
  return subscription;
}
const canUseDOM$1 = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
const useIsomorphicLayoutEffect$1 = canUseDOM$1 ? reactExports.useLayoutEffect : reactExports.useEffect;
function Provider({
  store: store2,
  context,
  children,
  serverState
}) {
  const contextValue = reactExports.useMemo(() => {
    const subscription = createSubscription(store2);
    return {
      store: store2,
      subscription,
      getServerState: serverState ? () => serverState : void 0
    };
  }, [store2, serverState]);
  const previousState = reactExports.useMemo(() => store2.getState(), [store2]);
  useIsomorphicLayoutEffect$1(() => {
    const {
      subscription
    } = contextValue;
    subscription.onStateChange = subscription.notifyNestedSubs;
    subscription.trySubscribe();
    if (previousState !== store2.getState()) {
      subscription.notifyNestedSubs();
    }
    return () => {
      subscription.tryUnsubscribe();
      subscription.onStateChange = void 0;
    };
  }, [contextValue, previousState]);
  const Context = context || ReactReduxContext$1;
  return /* @__PURE__ */ React.createElement(Context.Provider, {
    value: contextValue
  }, children);
}
function createStoreHook$1(context = ReactReduxContext$1) {
  const useReduxContext2 = (
    // @ts-ignore
    context === ReactReduxContext$1 ? useReduxContext$1 : () => reactExports.useContext(context)
  );
  return function useStore2() {
    const {
      store: store2
    } = useReduxContext2();
    return store2;
  };
}
const useStore$1 = /* @__PURE__ */ createStoreHook$1();
function createDispatchHook$1(context = ReactReduxContext$1) {
  const useStore2 = (
    // @ts-ignore
    context === ReactReduxContext$1 ? useStore$1 : createStoreHook$1(context)
  );
  return function useDispatch2() {
    const store2 = useStore2();
    return store2.dispatch;
  };
}
const useDispatch$1 = /* @__PURE__ */ createDispatchHook$1();
setBatch(reactDomExports.unstable_batchedUpdates);
function n$5(n2) {
  for (var r2 = arguments.length, t2 = Array(r2 > 1 ? r2 - 1 : 0), e2 = 1; e2 < r2; e2++)
    t2[e2 - 1] = arguments[e2];
  throw Error("[Immer] minified error nr: " + n2 + (t2.length ? " " + t2.map(function(n3) {
    return "'" + n3 + "'";
  }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
}
function r$4(n2) {
  return !!n2 && !!n2[Q$1];
}
function t$5(n2) {
  var r2;
  return !!n2 && (function(n3) {
    if (!n3 || "object" != typeof n3)
      return false;
    var r3 = Object.getPrototypeOf(n3);
    if (null === r3)
      return true;
    var t2 = Object.hasOwnProperty.call(r3, "constructor") && r3.constructor;
    return t2 === Object || "function" == typeof t2 && Function.toString.call(t2) === Z$1;
  }(n2) || Array.isArray(n2) || !!n2[L$1] || !!(null === (r2 = n2.constructor) || void 0 === r2 ? void 0 : r2[L$1]) || s$1(n2) || v$4(n2));
}
function i$1(n2, r2, t2) {
  void 0 === t2 && (t2 = false), 0 === o$1(n2) ? (t2 ? Object.keys : nn$1)(n2).forEach(function(e2) {
    t2 && "symbol" == typeof e2 || r2(e2, n2[e2], n2);
  }) : n2.forEach(function(t3, e2) {
    return r2(e2, t3, n2);
  });
}
function o$1(n2) {
  var r2 = n2[Q$1];
  return r2 ? r2.i > 3 ? r2.i - 4 : r2.i : Array.isArray(n2) ? 1 : s$1(n2) ? 2 : v$4(n2) ? 3 : 0;
}
function u$4(n2, r2) {
  return 2 === o$1(n2) ? n2.has(r2) : Object.prototype.hasOwnProperty.call(n2, r2);
}
function a$1(n2, r2) {
  return 2 === o$1(n2) ? n2.get(r2) : n2[r2];
}
function f$3(n2, r2, t2) {
  var e2 = o$1(n2);
  2 === e2 ? n2.set(r2, t2) : 3 === e2 ? n2.add(t2) : n2[r2] = t2;
}
function c$3(n2, r2) {
  return n2 === r2 ? 0 !== n2 || 1 / n2 == 1 / r2 : n2 != n2 && r2 != r2;
}
function s$1(n2) {
  return X$1 && n2 instanceof Map;
}
function v$4(n2) {
  return q$5 && n2 instanceof Set;
}
function p$5(n2) {
  return n2.o || n2.t;
}
function l$4(n2) {
  if (Array.isArray(n2))
    return Array.prototype.slice.call(n2);
  var r2 = rn$1(n2);
  delete r2[Q$1];
  for (var t2 = nn$1(r2), e2 = 0; e2 < t2.length; e2++) {
    var i2 = t2[e2], o2 = r2[i2];
    false === o2.writable && (o2.writable = true, o2.configurable = true), (o2.get || o2.set) && (r2[i2] = { configurable: true, writable: true, enumerable: o2.enumerable, value: n2[i2] });
  }
  return Object.create(Object.getPrototypeOf(n2), r2);
}
function d$3(n2, e2) {
  return void 0 === e2 && (e2 = false), y$2(n2) || r$4(n2) || !t$5(n2) || (o$1(n2) > 1 && (n2.set = n2.add = n2.clear = n2.delete = h$5), Object.freeze(n2), e2 && i$1(n2, function(n3, r2) {
    return d$3(r2, true);
  }, true)), n2;
}
function h$5() {
  n$5(2);
}
function y$2(n2) {
  return null == n2 || "object" != typeof n2 || Object.isFrozen(n2);
}
function b$3(r2) {
  var t2 = tn$1[r2];
  return t2 || n$5(18, r2), t2;
}
function m$4(n2, r2) {
  tn$1[n2] || (tn$1[n2] = r2);
}
function _$1() {
  return U$1;
}
function j$1(n2, r2) {
  r2 && (b$3("Patches"), n2.u = [], n2.s = [], n2.v = r2);
}
function g$3(n2) {
  O$1(n2), n2.p.forEach(S$1), n2.p = null;
}
function O$1(n2) {
  n2 === U$1 && (U$1 = n2.l);
}
function w$3(n2) {
  return U$1 = { p: [], l: U$1, h: n2, m: true, _: 0 };
}
function S$1(n2) {
  var r2 = n2[Q$1];
  0 === r2.i || 1 === r2.i ? r2.j() : r2.g = true;
}
function P$1(r2, e2) {
  e2._ = e2.p.length;
  var i2 = e2.p[0], o2 = void 0 !== r2 && r2 !== i2;
  return e2.h.O || b$3("ES5").S(e2, r2, o2), o2 ? (i2[Q$1].P && (g$3(e2), n$5(4)), t$5(r2) && (r2 = M$1(e2, r2), e2.l || x$2(e2, r2)), e2.u && b$3("Patches").M(i2[Q$1].t, r2, e2.u, e2.s)) : r2 = M$1(e2, i2, []), g$3(e2), e2.u && e2.v(e2.u, e2.s), r2 !== H$1 ? r2 : void 0;
}
function M$1(n2, r2, t2) {
  if (y$2(r2))
    return r2;
  var e2 = r2[Q$1];
  if (!e2)
    return i$1(r2, function(i2, o3) {
      return A$2(n2, e2, r2, i2, o3, t2);
    }, true), r2;
  if (e2.A !== n2)
    return r2;
  if (!e2.P)
    return x$2(n2, e2.t, true), e2.t;
  if (!e2.I) {
    e2.I = true, e2.A._--;
    var o2 = 4 === e2.i || 5 === e2.i ? e2.o = l$4(e2.k) : e2.o, u2 = o2, a2 = false;
    3 === e2.i && (u2 = new Set(o2), o2.clear(), a2 = true), i$1(u2, function(r3, i2) {
      return A$2(n2, e2, o2, r3, i2, t2, a2);
    }), x$2(n2, o2, false), t2 && n2.u && b$3("Patches").N(e2, t2, n2.u, n2.s);
  }
  return e2.o;
}
function A$2(e2, i2, o2, a2, c6, s2, v2) {
  if (r$4(c6)) {
    var p2 = M$1(e2, c6, s2 && i2 && 3 !== i2.i && !u$4(i2.R, a2) ? s2.concat(a2) : void 0);
    if (f$3(o2, a2, p2), !r$4(p2))
      return;
    e2.m = false;
  } else
    v2 && o2.add(c6);
  if (t$5(c6) && !y$2(c6)) {
    if (!e2.h.D && e2._ < 1)
      return;
    M$1(e2, c6), i2 && i2.A.l || x$2(e2, c6);
  }
}
function x$2(n2, r2, t2) {
  void 0 === t2 && (t2 = false), !n2.l && n2.h.D && n2.m && d$3(r2, t2);
}
function z$2(n2, r2) {
  var t2 = n2[Q$1];
  return (t2 ? p$5(t2) : n2)[r2];
}
function I$1(n2, r2) {
  if (r2 in n2)
    for (var t2 = Object.getPrototypeOf(n2); t2; ) {
      var e2 = Object.getOwnPropertyDescriptor(t2, r2);
      if (e2)
        return e2;
      t2 = Object.getPrototypeOf(t2);
    }
}
function k$4(n2) {
  n2.P || (n2.P = true, n2.l && k$4(n2.l));
}
function E$1(n2) {
  n2.o || (n2.o = l$4(n2.t));
}
function N$1(n2, r2, t2) {
  var e2 = s$1(r2) ? b$3("MapSet").F(r2, t2) : v$4(r2) ? b$3("MapSet").T(r2, t2) : n2.O ? function(n3, r3) {
    var t3 = Array.isArray(n3), e3 = { i: t3 ? 1 : 0, A: r3 ? r3.A : _$1(), P: false, I: false, R: {}, l: r3, t: n3, k: null, o: null, j: null, C: false }, i2 = e3, o2 = en$1;
    t3 && (i2 = [e3], o2 = on$2);
    var u2 = Proxy.revocable(i2, o2), a2 = u2.revoke, f2 = u2.proxy;
    return e3.k = f2, e3.j = a2, f2;
  }(r2, t2) : b$3("ES5").J(r2, t2);
  return (t2 ? t2.A : _$1()).p.push(e2), e2;
}
function R$1(e2) {
  return r$4(e2) || n$5(22, e2), function n2(r2) {
    if (!t$5(r2))
      return r2;
    var e3, u2 = r2[Q$1], c6 = o$1(r2);
    if (u2) {
      if (!u2.P && (u2.i < 4 || !b$3("ES5").K(u2)))
        return u2.t;
      u2.I = true, e3 = D$1(r2, c6), u2.I = false;
    } else
      e3 = D$1(r2, c6);
    return i$1(e3, function(r3, t2) {
      u2 && a$1(u2.t, r3) === t2 || f$3(e3, r3, n2(t2));
    }), 3 === c6 ? new Set(e3) : e3;
  }(e2);
}
function D$1(n2, r2) {
  switch (r2) {
    case 2:
      return new Map(n2);
    case 3:
      return Array.from(n2);
  }
  return l$4(n2);
}
function F$1() {
  function t2(n2, r2) {
    var t3 = s2[n2];
    return t3 ? t3.enumerable = r2 : s2[n2] = t3 = { configurable: true, enumerable: r2, get: function() {
      var r3 = this[Q$1];
      return en$1.get(r3, n2);
    }, set: function(r3) {
      var t4 = this[Q$1];
      en$1.set(t4, n2, r3);
    } }, t3;
  }
  function e2(n2) {
    for (var r2 = n2.length - 1; r2 >= 0; r2--) {
      var t3 = n2[r2][Q$1];
      if (!t3.P)
        switch (t3.i) {
          case 5:
            a2(t3) && k$4(t3);
            break;
          case 4:
            o2(t3) && k$4(t3);
        }
    }
  }
  function o2(n2) {
    for (var r2 = n2.t, t3 = n2.k, e3 = nn$1(t3), i2 = e3.length - 1; i2 >= 0; i2--) {
      var o3 = e3[i2];
      if (o3 !== Q$1) {
        var a3 = r2[o3];
        if (void 0 === a3 && !u$4(r2, o3))
          return true;
        var f2 = t3[o3], s3 = f2 && f2[Q$1];
        if (s3 ? s3.t !== a3 : !c$3(f2, a3))
          return true;
      }
    }
    var v2 = !!r2[Q$1];
    return e3.length !== nn$1(r2).length + (v2 ? 0 : 1);
  }
  function a2(n2) {
    var r2 = n2.k;
    if (r2.length !== n2.t.length)
      return true;
    var t3 = Object.getOwnPropertyDescriptor(r2, r2.length - 1);
    if (t3 && !t3.get)
      return true;
    for (var e3 = 0; e3 < r2.length; e3++)
      if (!r2.hasOwnProperty(e3))
        return true;
    return false;
  }
  var s2 = {};
  m$4("ES5", { J: function(n2, r2) {
    var e3 = Array.isArray(n2), i2 = function(n3, r3) {
      if (n3) {
        for (var e4 = Array(r3.length), i3 = 0; i3 < r3.length; i3++)
          Object.defineProperty(e4, "" + i3, t2(i3, true));
        return e4;
      }
      var o4 = rn$1(r3);
      delete o4[Q$1];
      for (var u2 = nn$1(o4), a3 = 0; a3 < u2.length; a3++) {
        var f2 = u2[a3];
        o4[f2] = t2(f2, n3 || !!o4[f2].enumerable);
      }
      return Object.create(Object.getPrototypeOf(r3), o4);
    }(e3, n2), o3 = { i: e3 ? 5 : 4, A: r2 ? r2.A : _$1(), P: false, I: false, R: {}, l: r2, t: n2, k: i2, o: null, g: false, C: false };
    return Object.defineProperty(i2, Q$1, { value: o3, writable: true }), i2;
  }, S: function(n2, t3, o3) {
    o3 ? r$4(t3) && t3[Q$1].A === n2 && e2(n2.p) : (n2.u && function n3(r2) {
      if (r2 && "object" == typeof r2) {
        var t4 = r2[Q$1];
        if (t4) {
          var e3 = t4.t, o4 = t4.k, f2 = t4.R, c6 = t4.i;
          if (4 === c6)
            i$1(o4, function(r3) {
              r3 !== Q$1 && (void 0 !== e3[r3] || u$4(e3, r3) ? f2[r3] || n3(o4[r3]) : (f2[r3] = true, k$4(t4)));
            }), i$1(e3, function(n4) {
              void 0 !== o4[n4] || u$4(o4, n4) || (f2[n4] = false, k$4(t4));
            });
          else if (5 === c6) {
            if (a2(t4) && (k$4(t4), f2.length = true), o4.length < e3.length)
              for (var s3 = o4.length; s3 < e3.length; s3++)
                f2[s3] = false;
            else
              for (var v2 = e3.length; v2 < o4.length; v2++)
                f2[v2] = true;
            for (var p2 = Math.min(o4.length, e3.length), l2 = 0; l2 < p2; l2++)
              o4.hasOwnProperty(l2) || (f2[l2] = true), void 0 === f2[l2] && n3(o4[l2]);
          }
        }
      }
    }(n2.p[0]), e2(n2.p));
  }, K: function(n2) {
    return 4 === n2.i ? o2(n2) : a2(n2);
  } });
}
var G$1, U$1, W$1 = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x"), X$1 = "undefined" != typeof Map, q$5 = "undefined" != typeof Set, B$1 = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect, H$1 = W$1 ? Symbol.for("immer-nothing") : ((G$1 = {})["immer-nothing"] = true, G$1), L$1 = W$1 ? Symbol.for("immer-draftable") : "__$immer_draftable", Q$1 = W$1 ? Symbol.for("immer-state") : "__$immer_state", Z$1 = "" + Object.prototype.constructor, nn$1 = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(n2) {
  return Object.getOwnPropertyNames(n2).concat(Object.getOwnPropertySymbols(n2));
} : Object.getOwnPropertyNames, rn$1 = Object.getOwnPropertyDescriptors || function(n2) {
  var r2 = {};
  return nn$1(n2).forEach(function(t2) {
    r2[t2] = Object.getOwnPropertyDescriptor(n2, t2);
  }), r2;
}, tn$1 = {}, en$1 = { get: function(n2, r2) {
  if (r2 === Q$1)
    return n2;
  var e2 = p$5(n2);
  if (!u$4(e2, r2))
    return function(n3, r3, t2) {
      var e3, i3 = I$1(r3, t2);
      return i3 ? "value" in i3 ? i3.value : null === (e3 = i3.get) || void 0 === e3 ? void 0 : e3.call(n3.k) : void 0;
    }(n2, e2, r2);
  var i2 = e2[r2];
  return n2.I || !t$5(i2) ? i2 : i2 === z$2(n2.t, r2) ? (E$1(n2), n2.o[r2] = N$1(n2.A.h, i2, n2)) : i2;
}, has: function(n2, r2) {
  return r2 in p$5(n2);
}, ownKeys: function(n2) {
  return Reflect.ownKeys(p$5(n2));
}, set: function(n2, r2, t2) {
  var e2 = I$1(p$5(n2), r2);
  if (null == e2 ? void 0 : e2.set)
    return e2.set.call(n2.k, t2), true;
  if (!n2.P) {
    var i2 = z$2(p$5(n2), r2), o2 = null == i2 ? void 0 : i2[Q$1];
    if (o2 && o2.t === t2)
      return n2.o[r2] = t2, n2.R[r2] = false, true;
    if (c$3(t2, i2) && (void 0 !== t2 || u$4(n2.t, r2)))
      return true;
    E$1(n2), k$4(n2);
  }
  return n2.o[r2] === t2 && (void 0 !== t2 || r2 in n2.o) || Number.isNaN(t2) && Number.isNaN(n2.o[r2]) || (n2.o[r2] = t2, n2.R[r2] = true), true;
}, deleteProperty: function(n2, r2) {
  return void 0 !== z$2(n2.t, r2) || r2 in n2.t ? (n2.R[r2] = false, E$1(n2), k$4(n2)) : delete n2.R[r2], n2.o && delete n2.o[r2], true;
}, getOwnPropertyDescriptor: function(n2, r2) {
  var t2 = p$5(n2), e2 = Reflect.getOwnPropertyDescriptor(t2, r2);
  return e2 ? { writable: true, configurable: 1 !== n2.i || "length" !== r2, enumerable: e2.enumerable, value: t2[r2] } : e2;
}, defineProperty: function() {
  n$5(11);
}, getPrototypeOf: function(n2) {
  return Object.getPrototypeOf(n2.t);
}, setPrototypeOf: function() {
  n$5(12);
} }, on$2 = {};
i$1(en$1, function(n2, r2) {
  on$2[n2] = function() {
    return arguments[0] = arguments[0][0], r2.apply(this, arguments);
  };
}), on$2.deleteProperty = function(r2, t2) {
  return on$2.set.call(this, r2, t2, void 0);
}, on$2.set = function(r2, t2, e2) {
  return en$1.set.call(this, r2[0], t2, e2, r2[0]);
};
var un$1 = function() {
  function e2(r2) {
    var e3 = this;
    this.O = B$1, this.D = true, this.produce = function(r3, i3, o2) {
      if ("function" == typeof r3 && "function" != typeof i3) {
        var u2 = i3;
        i3 = r3;
        var a2 = e3;
        return function(n2) {
          var r4 = this;
          void 0 === n2 && (n2 = u2);
          for (var t2 = arguments.length, e4 = Array(t2 > 1 ? t2 - 1 : 0), o3 = 1; o3 < t2; o3++)
            e4[o3 - 1] = arguments[o3];
          return a2.produce(n2, function(n3) {
            var t3;
            return (t3 = i3).call.apply(t3, [r4, n3].concat(e4));
          });
        };
      }
      var f2;
      if ("function" != typeof i3 && n$5(6), void 0 !== o2 && "function" != typeof o2 && n$5(7), t$5(r3)) {
        var c6 = w$3(e3), s2 = N$1(e3, r3, void 0), v2 = true;
        try {
          f2 = i3(s2), v2 = false;
        } finally {
          v2 ? g$3(c6) : O$1(c6);
        }
        return "undefined" != typeof Promise && f2 instanceof Promise ? f2.then(function(n2) {
          return j$1(c6, o2), P$1(n2, c6);
        }, function(n2) {
          throw g$3(c6), n2;
        }) : (j$1(c6, o2), P$1(f2, c6));
      }
      if (!r3 || "object" != typeof r3) {
        if (void 0 === (f2 = i3(r3)) && (f2 = r3), f2 === H$1 && (f2 = void 0), e3.D && d$3(f2, true), o2) {
          var p2 = [], l2 = [];
          b$3("Patches").M(r3, f2, p2, l2), o2(p2, l2);
        }
        return f2;
      }
      n$5(21, r3);
    }, this.produceWithPatches = function(n2, r3) {
      if ("function" == typeof n2)
        return function(r4) {
          for (var t3 = arguments.length, i4 = Array(t3 > 1 ? t3 - 1 : 0), o3 = 1; o3 < t3; o3++)
            i4[o3 - 1] = arguments[o3];
          return e3.produceWithPatches(r4, function(r5) {
            return n2.apply(void 0, [r5].concat(i4));
          });
        };
      var t2, i3, o2 = e3.produce(n2, r3, function(n3, r4) {
        t2 = n3, i3 = r4;
      });
      return "undefined" != typeof Promise && o2 instanceof Promise ? o2.then(function(n3) {
        return [n3, t2, i3];
      }) : [o2, t2, i3];
    }, "boolean" == typeof (null == r2 ? void 0 : r2.useProxies) && this.setUseProxies(r2.useProxies), "boolean" == typeof (null == r2 ? void 0 : r2.autoFreeze) && this.setAutoFreeze(r2.autoFreeze);
  }
  var i2 = e2.prototype;
  return i2.createDraft = function(e3) {
    t$5(e3) || n$5(8), r$4(e3) && (e3 = R$1(e3));
    var i3 = w$3(this), o2 = N$1(this, e3, void 0);
    return o2[Q$1].C = true, O$1(i3), o2;
  }, i2.finishDraft = function(r2, t2) {
    var e3 = r2 && r2[Q$1];
    var i3 = e3.A;
    return j$1(i3, t2), P$1(void 0, i3);
  }, i2.setAutoFreeze = function(n2) {
    this.D = n2;
  }, i2.setUseProxies = function(r2) {
    r2 && !B$1 && n$5(20), this.O = r2;
  }, i2.applyPatches = function(n2, t2) {
    var e3;
    for (e3 = t2.length - 1; e3 >= 0; e3--) {
      var i3 = t2[e3];
      if (0 === i3.path.length && "replace" === i3.op) {
        n2 = i3.value;
        break;
      }
    }
    e3 > -1 && (t2 = t2.slice(e3 + 1));
    var o2 = b$3("Patches").$;
    return r$4(n2) ? o2(n2, t2) : this.produce(n2, function(n3) {
      return o2(n3, t2);
    });
  }, e2;
}(), an$1 = new un$1(), fn = an$1.produce;
an$1.produceWithPatches.bind(an$1);
an$1.setAutoFreeze.bind(an$1);
an$1.setUseProxies.bind(an$1);
an$1.applyPatches.bind(an$1);
an$1.createDraft.bind(an$1);
an$1.finishDraft.bind(an$1);
var __extends$1 = globalThis && globalThis.__extends || function() {
  var extendStatics = function(d2, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
      d3.__proto__ = b3;
    } || function(d3, b3) {
      for (var p2 in b3)
        if (Object.prototype.hasOwnProperty.call(b3, p2))
          d3[p2] = b3[p2];
    };
    return extendStatics(d2, b2);
  };
  return function(d2, b2) {
    if (typeof b2 !== "function" && b2 !== null)
      throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
    extendStatics(d2, b2);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  };
}();
var __generator$1 = globalThis && globalThis.__generator || function(thisArg, body2) {
  var _2 = { label: 0, sent: function() {
    if (t2[0] & 1)
      throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_2)
      try {
        if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done)
          return t2;
        if (y2 = 0, t2)
          op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [0];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t2 = _2.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t2[1]) {
              _2.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _2.label < t2[2]) {
              _2.label = t2[2];
              _2.ops.push(op);
              break;
            }
            if (t2[2])
              _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body2.call(thisArg, _2);
      } catch (e2) {
        op = [6, e2];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __spreadArray$1 = globalThis && globalThis.__spreadArray || function(to2, from) {
  for (var i2 = 0, il2 = from.length, j2 = to2.length; i2 < il2; i2++, j2++)
    to2[j2] = from[i2];
  return to2;
};
var __defProp$2 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = function(obj, key, value2) {
  return key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
};
var __spreadValues$1 = function(a2, b2) {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp$1.call(b2, prop))
      __defNormalProp$2(a2, prop, b2[prop]);
  if (__getOwnPropSymbols$1)
    for (var _i = 0, _c = __getOwnPropSymbols$1(b2); _i < _c.length; _i++) {
      var prop = _c[_i];
      if (__propIsEnum$1.call(b2, prop))
        __defNormalProp$2(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps$1 = function(a2, b2) {
  return __defProps$1(a2, __getOwnPropDescs$1(b2));
};
var __async$1 = function(__this, __arguments, generator) {
  return new Promise(function(resolve, reject) {
    var fulfilled = function(value2) {
      try {
        step(generator.next(value2));
      } catch (e2) {
        reject(e2);
      }
    };
    var rejected = function(value2) {
      try {
        step(generator.throw(value2));
      } catch (e2) {
        reject(e2);
      }
    };
    var step = function(x2) {
      return x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
    };
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
(function(_super) {
  __extends$1(MiddlewareArray2, _super);
  function MiddlewareArray2() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var _this = _super.apply(this, args) || this;
    Object.setPrototypeOf(_this, MiddlewareArray2.prototype);
    return _this;
  }
  Object.defineProperty(MiddlewareArray2, Symbol.species, {
    get: function() {
      return MiddlewareArray2;
    },
    enumerable: false,
    configurable: true
  });
  MiddlewareArray2.prototype.concat = function() {
    var arr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      arr[_i] = arguments[_i];
    }
    return _super.prototype.concat.apply(this, arr);
  };
  MiddlewareArray2.prototype.prepend = function() {
    var arr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      arr[_i] = arguments[_i];
    }
    if (arr.length === 1 && Array.isArray(arr[0])) {
      return new (MiddlewareArray2.bind.apply(MiddlewareArray2, __spreadArray$1([void 0], arr[0].concat(this))))();
    }
    return new (MiddlewareArray2.bind.apply(MiddlewareArray2, __spreadArray$1([void 0], arr.concat(this))))();
  };
  return MiddlewareArray2;
})(Array);
(function(_super) {
  __extends$1(EnhancerArray2, _super);
  function EnhancerArray2() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var _this = _super.apply(this, args) || this;
    Object.setPrototypeOf(_this, EnhancerArray2.prototype);
    return _this;
  }
  Object.defineProperty(EnhancerArray2, Symbol.species, {
    get: function() {
      return EnhancerArray2;
    },
    enumerable: false,
    configurable: true
  });
  EnhancerArray2.prototype.concat = function() {
    var arr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      arr[_i] = arguments[_i];
    }
    return _super.prototype.concat.apply(this, arr);
  };
  EnhancerArray2.prototype.prepend = function() {
    var arr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      arr[_i] = arguments[_i];
    }
    if (arr.length === 1 && Array.isArray(arr[0])) {
      return new (EnhancerArray2.bind.apply(EnhancerArray2, __spreadArray$1([void 0], arr[0].concat(this))))();
    }
    return new (EnhancerArray2.bind.apply(EnhancerArray2, __spreadArray$1([void 0], arr.concat(this))))();
  };
  return EnhancerArray2;
})(Array);
function freezeDraftable(val) {
  return t$5(val) ? fn(val, function() {
  }) : val;
}
function createAction$1(type, prepareAction) {
  function actionCreator() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (prepareAction) {
      var prepared = prepareAction.apply(void 0, args);
      if (!prepared) {
        throw new Error("prepareAction did not return an object");
      }
      return __spreadValues$1(__spreadValues$1({
        type,
        payload: prepared.payload
      }, "meta" in prepared && { meta: prepared.meta }), "error" in prepared && { error: prepared.error });
    }
    return { type, payload: args[0] };
  }
  actionCreator.toString = function() {
    return "" + type;
  };
  actionCreator.type = type;
  actionCreator.match = function(action) {
    return action.type === type;
  };
  return actionCreator;
}
function executeReducerBuilderCallback(builderCallback) {
  var actionsMap = {};
  var actionMatchers = [];
  var defaultCaseReducer;
  var builder = {
    addCase: function(typeOrActionCreator, reducer2) {
      var type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type;
      if (type in actionsMap) {
        throw new Error("addCase cannot be called with two reducers for the same action type");
      }
      actionsMap[type] = reducer2;
      return builder;
    },
    addMatcher: function(matcher, reducer2) {
      actionMatchers.push({ matcher, reducer: reducer2 });
      return builder;
    },
    addDefaultCase: function(reducer2) {
      defaultCaseReducer = reducer2;
      return builder;
    }
  };
  builderCallback(builder);
  return [actionsMap, actionMatchers, defaultCaseReducer];
}
function isStateFunction(x2) {
  return typeof x2 === "function";
}
function createReducer(initialState, mapOrBuilderCallback, actionMatchers, defaultCaseReducer) {
  if (actionMatchers === void 0) {
    actionMatchers = [];
  }
  var _c = typeof mapOrBuilderCallback === "function" ? executeReducerBuilderCallback(mapOrBuilderCallback) : [mapOrBuilderCallback, actionMatchers, defaultCaseReducer], actionsMap = _c[0], finalActionMatchers = _c[1], finalDefaultCaseReducer = _c[2];
  var getInitialState;
  if (isStateFunction(initialState)) {
    getInitialState = function() {
      return freezeDraftable(initialState());
    };
  } else {
    var frozenInitialState_1 = freezeDraftable(initialState);
    getInitialState = function() {
      return frozenInitialState_1;
    };
  }
  function reducer2(state2, action) {
    if (state2 === void 0) {
      state2 = getInitialState();
    }
    var caseReducers = __spreadArray$1([
      actionsMap[action.type]
    ], finalActionMatchers.filter(function(_c2) {
      var matcher = _c2.matcher;
      return matcher(action);
    }).map(function(_c2) {
      var reducer22 = _c2.reducer;
      return reducer22;
    }));
    if (caseReducers.filter(function(cr) {
      return !!cr;
    }).length === 0) {
      caseReducers = [finalDefaultCaseReducer];
    }
    return caseReducers.reduce(function(previousState, caseReducer) {
      if (caseReducer) {
        if (r$4(previousState)) {
          var draft = previousState;
          var result = caseReducer(draft, action);
          if (result === void 0) {
            return previousState;
          }
          return result;
        } else if (!t$5(previousState)) {
          var result = caseReducer(previousState, action);
          if (result === void 0) {
            if (previousState === null) {
              return previousState;
            }
            throw Error("A case reducer on a non-draftable value must not return undefined");
          }
          return result;
        } else {
          return fn(previousState, function(draft2) {
            return caseReducer(draft2, action);
          });
        }
      }
      return previousState;
    }, state2);
  }
  reducer2.getInitialState = getInitialState;
  return reducer2;
}
function getType2(slice, actionKey) {
  return slice + "/" + actionKey;
}
function createSlice(options) {
  var name2 = options.name;
  if (!name2) {
    throw new Error("`name` is a required option for createSlice");
  }
  if (typeof process !== "undefined" && false) {
    if (options.initialState === void 0) {
      console.error("You must provide an `initialState` value that is not `undefined`. You may have misspelled `initialState`");
    }
  }
  var initialState = typeof options.initialState == "function" ? options.initialState : freezeDraftable(options.initialState);
  var reducers = options.reducers || {};
  var reducerNames = Object.keys(reducers);
  var sliceCaseReducersByName = {};
  var sliceCaseReducersByType = {};
  var actionCreators = {};
  reducerNames.forEach(function(reducerName) {
    var maybeReducerWithPrepare = reducers[reducerName];
    var type = getType2(name2, reducerName);
    var caseReducer;
    var prepareCallback;
    if ("reducer" in maybeReducerWithPrepare) {
      caseReducer = maybeReducerWithPrepare.reducer;
      prepareCallback = maybeReducerWithPrepare.prepare;
    } else {
      caseReducer = maybeReducerWithPrepare;
    }
    sliceCaseReducersByName[reducerName] = caseReducer;
    sliceCaseReducersByType[type] = caseReducer;
    actionCreators[reducerName] = prepareCallback ? createAction$1(type, prepareCallback) : createAction$1(type);
  });
  function buildReducer() {
    var _c = typeof options.extraReducers === "function" ? executeReducerBuilderCallback(options.extraReducers) : [options.extraReducers], _d = _c[0], extraReducers = _d === void 0 ? {} : _d, _e = _c[1], actionMatchers = _e === void 0 ? [] : _e, _f = _c[2], defaultCaseReducer = _f === void 0 ? void 0 : _f;
    var finalCaseReducers = __spreadValues$1(__spreadValues$1({}, extraReducers), sliceCaseReducersByType);
    return createReducer(initialState, function(builder) {
      for (var key in finalCaseReducers) {
        builder.addCase(key, finalCaseReducers[key]);
      }
      for (var _i = 0, actionMatchers_1 = actionMatchers; _i < actionMatchers_1.length; _i++) {
        var m2 = actionMatchers_1[_i];
        builder.addMatcher(m2.matcher, m2.reducer);
      }
      if (defaultCaseReducer) {
        builder.addDefaultCase(defaultCaseReducer);
      }
    });
  }
  var _reducer;
  return {
    name: name2,
    reducer: function(state2, action) {
      if (!_reducer)
        _reducer = buildReducer();
      return _reducer(state2, action);
    },
    actions: actionCreators,
    caseReducers: sliceCaseReducersByName,
    getInitialState: function() {
      if (!_reducer)
        _reducer = buildReducer();
      return _reducer.getInitialState();
    }
  };
}
var urlAlphabet$1 = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
var nanoid$3 = function(size) {
  if (size === void 0) {
    size = 21;
  }
  var id2 = "";
  var i2 = size;
  while (i2--) {
    id2 += urlAlphabet$1[Math.random() * 64 | 0];
  }
  return id2;
};
var commonProperties$1 = [
  "name",
  "message",
  "stack",
  "code"
];
var RejectWithValue$1 = (
  /** @class */
  function() {
    function RejectWithValue2(payload, meta) {
      this.payload = payload;
      this.meta = meta;
    }
    return RejectWithValue2;
  }()
);
var FulfillWithMeta$1 = (
  /** @class */
  function() {
    function FulfillWithMeta2(payload, meta) {
      this.payload = payload;
      this.meta = meta;
    }
    return FulfillWithMeta2;
  }()
);
var miniSerializeError$1 = function(value2) {
  if (typeof value2 === "object" && value2 !== null) {
    var simpleError = {};
    for (var _i = 0, commonProperties_1 = commonProperties$1; _i < commonProperties_1.length; _i++) {
      var property = commonProperties_1[_i];
      if (typeof value2[property] === "string") {
        simpleError[property] = value2[property];
      }
    }
    return simpleError;
  }
  return { message: String(value2) };
};
(function() {
  function createAsyncThunk2(typePrefix, payloadCreator, options) {
    var fulfilled = createAction$1(typePrefix + "/fulfilled", function(payload, requestId, arg, meta) {
      return {
        payload,
        meta: __spreadProps$1(__spreadValues$1({}, meta || {}), {
          arg,
          requestId,
          requestStatus: "fulfilled"
        })
      };
    });
    var pending = createAction$1(typePrefix + "/pending", function(requestId, arg, meta) {
      return {
        payload: void 0,
        meta: __spreadProps$1(__spreadValues$1({}, meta || {}), {
          arg,
          requestId,
          requestStatus: "pending"
        })
      };
    });
    var rejected = createAction$1(typePrefix + "/rejected", function(error, requestId, arg, payload, meta) {
      return {
        payload,
        error: (options && options.serializeError || miniSerializeError$1)(error || "Rejected"),
        meta: __spreadProps$1(__spreadValues$1({}, meta || {}), {
          arg,
          requestId,
          rejectedWithValue: !!payload,
          requestStatus: "rejected",
          aborted: (error == null ? void 0 : error.name) === "AbortError",
          condition: (error == null ? void 0 : error.name) === "ConditionError"
        })
      };
    });
    var AC = typeof AbortController !== "undefined" ? AbortController : (
      /** @class */
      function() {
        function class_1() {
          this.signal = {
            aborted: false,
            addEventListener: function() {
            },
            dispatchEvent: function() {
              return false;
            },
            onabort: function() {
            },
            removeEventListener: function() {
            },
            reason: void 0,
            throwIfAborted: function() {
            }
          };
        }
        class_1.prototype.abort = function() {
        };
        return class_1;
      }()
    );
    function actionCreator(arg) {
      return function(dispatch, getState2, extra) {
        var requestId = (options == null ? void 0 : options.idGenerator) ? options.idGenerator(arg) : nanoid$3();
        var abortController = new AC();
        var abortReason;
        function abort(reason) {
          abortReason = reason;
          abortController.abort();
        }
        var promise2 = function() {
          return __async$1(this, null, function() {
            var _a, _b, finalAction, conditionResult, abortedPromise, err_1, skipDispatch;
            return __generator$1(this, function(_c) {
              switch (_c.label) {
                case 0:
                  _c.trys.push([0, 4, , 5]);
                  conditionResult = (_a = options == null ? void 0 : options.condition) == null ? void 0 : _a.call(options, arg, { getState: getState2, extra });
                  if (!isThenable$1(conditionResult))
                    return [3, 2];
                  return [4, conditionResult];
                case 1:
                  conditionResult = _c.sent();
                  _c.label = 2;
                case 2:
                  if (conditionResult === false || abortController.signal.aborted) {
                    throw {
                      name: "ConditionError",
                      message: "Aborted due to condition callback returning false."
                    };
                  }
                  abortedPromise = new Promise(function(_2, reject) {
                    return abortController.signal.addEventListener("abort", function() {
                      return reject({
                        name: "AbortError",
                        message: abortReason || "Aborted"
                      });
                    });
                  });
                  dispatch(pending(requestId, arg, (_b = options == null ? void 0 : options.getPendingMeta) == null ? void 0 : _b.call(options, { requestId, arg }, { getState: getState2, extra })));
                  return [4, Promise.race([
                    abortedPromise,
                    Promise.resolve(payloadCreator(arg, {
                      dispatch,
                      getState: getState2,
                      extra,
                      requestId,
                      signal: abortController.signal,
                      abort,
                      rejectWithValue: function(value2, meta) {
                        return new RejectWithValue$1(value2, meta);
                      },
                      fulfillWithValue: function(value2, meta) {
                        return new FulfillWithMeta$1(value2, meta);
                      }
                    })).then(function(result) {
                      if (result instanceof RejectWithValue$1) {
                        throw result;
                      }
                      if (result instanceof FulfillWithMeta$1) {
                        return fulfilled(result.payload, requestId, arg, result.meta);
                      }
                      return fulfilled(result, requestId, arg);
                    })
                  ])];
                case 3:
                  finalAction = _c.sent();
                  return [3, 5];
                case 4:
                  err_1 = _c.sent();
                  finalAction = err_1 instanceof RejectWithValue$1 ? rejected(null, requestId, arg, err_1.payload, err_1.meta) : rejected(err_1, requestId, arg);
                  return [3, 5];
                case 5:
                  skipDispatch = options && !options.dispatchConditionRejection && rejected.match(finalAction) && finalAction.meta.condition;
                  if (!skipDispatch) {
                    dispatch(finalAction);
                  }
                  return [2, finalAction];
              }
            });
          });
        }();
        return Object.assign(promise2, {
          abort,
          requestId,
          arg,
          unwrap: function() {
            return promise2.then(unwrapResult$1);
          }
        });
      };
    }
    return Object.assign(actionCreator, {
      pending,
      rejected,
      fulfilled,
      typePrefix
    });
  }
  createAsyncThunk2.withTypes = function() {
    return createAsyncThunk2;
  };
  return createAsyncThunk2;
})();
function unwrapResult$1(action) {
  if (action.meta && action.meta.rejectedWithValue) {
    throw action.payload;
  }
  if (action.error) {
    throw action.error;
  }
  return action.payload;
}
function isThenable$1(value2) {
  return value2 !== null && typeof value2 === "object" && typeof value2.then === "function";
}
var alm$1 = "listenerMiddleware";
createAction$1(alm$1 + "/add");
createAction$1(alm$1 + "/removeAll");
createAction$1(alm$1 + "/remove");
var promise$1;
typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : globalThis) : function(cb2) {
  return (promise$1 || (promise$1 = Promise.resolve())).then(cb2).catch(function(err) {
    return setTimeout(function() {
      throw err;
    }, 0);
  });
};
F$1();
var shim$1 = { exports: {} };
var useSyncExternalStoreShim_production_min = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var e$2 = reactExports;
function h$4(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var k$3 = "function" === typeof Object.is ? Object.is : h$4, l$3 = e$2.useState, m$3 = e$2.useEffect, n$4 = e$2.useLayoutEffect, p$4 = e$2.useDebugValue;
function q$4(a2, b2) {
  var d2 = b2(), f2 = l$3({ inst: { value: d2, getSnapshot: b2 } }), c6 = f2[0].inst, g2 = f2[1];
  n$4(function() {
    c6.value = d2;
    c6.getSnapshot = b2;
    r$3(c6) && g2({ inst: c6 });
  }, [a2, d2, b2]);
  m$3(function() {
    r$3(c6) && g2({ inst: c6 });
    return a2(function() {
      r$3(c6) && g2({ inst: c6 });
    });
  }, [a2]);
  p$4(d2);
  return d2;
}
function r$3(a2) {
  var b2 = a2.getSnapshot;
  a2 = a2.value;
  try {
    var d2 = b2();
    return !k$3(a2, d2);
  } catch (f2) {
    return true;
  }
}
function t$4(a2, b2) {
  return b2();
}
var u$3 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t$4 : q$4;
useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e$2.useSyncExternalStore ? e$2.useSyncExternalStore : u$3;
{
  shim$1.exports = useSyncExternalStoreShim_production_min;
}
var shimExports = shim$1.exports;
var withSelector = { exports: {} };
var withSelector_production_min = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h$3 = reactExports, n$3 = shimExports;
function p$3(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var q$3 = "function" === typeof Object.is ? Object.is : p$3, r$2 = n$3.useSyncExternalStore, t$3 = h$3.useRef, u$2 = h$3.useEffect, v$3 = h$3.useMemo, w$2 = h$3.useDebugValue;
withSelector_production_min.useSyncExternalStoreWithSelector = function(a2, b2, e2, l2, g2) {
  var c6 = t$3(null);
  if (null === c6.current) {
    var f2 = { hasValue: false, value: null };
    c6.current = f2;
  } else
    f2 = c6.current;
  c6 = v$3(function() {
    function a3(a4) {
      if (!c7) {
        c7 = true;
        d3 = a4;
        a4 = l2(a4);
        if (void 0 !== g2 && f2.hasValue) {
          var b3 = f2.value;
          if (g2(b3, a4))
            return k2 = b3;
        }
        return k2 = a4;
      }
      b3 = k2;
      if (q$3(d3, a4))
        return b3;
      var e3 = l2(a4);
      if (void 0 !== g2 && g2(b3, e3))
        return b3;
      d3 = a4;
      return k2 = e3;
    }
    var c7 = false, d3, k2, m2 = void 0 === e2 ? null : e2;
    return [function() {
      return a3(b2());
    }, null === m2 ? void 0 : function() {
      return a3(m2());
    }];
  }, [b2, e2, l2, g2]);
  var d2 = r$2(a2, c6[0], c6[1]);
  u$2(function() {
    f2.hasValue = true;
    f2.value = d2;
  }, [d2]);
  w$2(d2);
  return d2;
};
{
  withSelector.exports = withSelector_production_min;
}
var withSelectorExports = withSelector.exports;
const ContextKey = Symbol.for(`react-redux-context-${reactExports.version}`);
const gT = globalThis;
function getContext() {
  let realContext = gT[ContextKey];
  if (!realContext) {
    realContext = reactExports.createContext(null);
    gT[ContextKey] = realContext;
  }
  return realContext;
}
const ReactReduxContext = /* @__PURE__ */ new Proxy({}, /* @__PURE__ */ new Proxy({}, {
  get(_2, handler) {
    const target2 = getContext();
    return (_target, ...args) => Reflect[handler](target2, ...args);
  }
}));
function createReduxContextHook(context = ReactReduxContext) {
  return function useReduxContext2() {
    const contextValue = reactExports.useContext(context);
    return contextValue;
  };
}
const useReduxContext = /* @__PURE__ */ createReduxContextHook();
const notInitialized = () => {
  throw new Error("uSES not initialized!");
};
let useSyncExternalStoreWithSelector = notInitialized;
const initializeUseSelector = (fn2) => {
  useSyncExternalStoreWithSelector = fn2;
};
const refEquality = (a2, b2) => a2 === b2;
function createSelectorHook(context = ReactReduxContext) {
  const useReduxContext$12 = context === ReactReduxContext ? useReduxContext : createReduxContextHook(context);
  return function useSelector2(selector, equalityFnOrOptions = {}) {
    const {
      equalityFn = refEquality,
      stabilityCheck = void 0,
      noopCheck = void 0
    } = typeof equalityFnOrOptions === "function" ? {
      equalityFn: equalityFnOrOptions
    } : equalityFnOrOptions;
    const {
      store: store2,
      subscription,
      getServerState,
      stabilityCheck: globalStabilityCheck,
      noopCheck: globalNoopCheck
    } = useReduxContext$12();
    reactExports.useRef(true);
    const wrappedSelector = reactExports.useCallback({
      [selector.name](state2) {
        const selected = selector(state2);
        return selected;
      }
    }[selector.name], [selector, globalStabilityCheck, stabilityCheck]);
    const selectedState = useSyncExternalStoreWithSelector(subscription.addNestedSub, store2.getState, getServerState || store2.getState, wrappedSelector, equalityFn);
    reactExports.useDebugValue(selectedState);
    return selectedState;
  };
}
const useSelector = /* @__PURE__ */ createSelectorHook();
var reactIs$1 = { exports: {} };
var reactIs_production_min$1 = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$2 = "function" === typeof Symbol && Symbol.for, c$2 = b$2 ? Symbol.for("react.element") : 60103, d$2 = b$2 ? Symbol.for("react.portal") : 60106, e$1 = b$2 ? Symbol.for("react.fragment") : 60107, f$2 = b$2 ? Symbol.for("react.strict_mode") : 60108, g$2 = b$2 ? Symbol.for("react.profiler") : 60114, h$2 = b$2 ? Symbol.for("react.provider") : 60109, k$2 = b$2 ? Symbol.for("react.context") : 60110, l$2 = b$2 ? Symbol.for("react.async_mode") : 60111, m$2 = b$2 ? Symbol.for("react.concurrent_mode") : 60111, n$2 = b$2 ? Symbol.for("react.forward_ref") : 60112, p$2 = b$2 ? Symbol.for("react.suspense") : 60113, q$2 = b$2 ? Symbol.for("react.suspense_list") : 60120, r$1 = b$2 ? Symbol.for("react.memo") : 60115, t$2 = b$2 ? Symbol.for("react.lazy") : 60116, v$2 = b$2 ? Symbol.for("react.block") : 60121, w$1 = b$2 ? Symbol.for("react.fundamental") : 60117, x$1 = b$2 ? Symbol.for("react.responder") : 60118, y$1 = b$2 ? Symbol.for("react.scope") : 60119;
function z$1(a2) {
  if ("object" === typeof a2 && null !== a2) {
    var u2 = a2.$$typeof;
    switch (u2) {
      case c$2:
        switch (a2 = a2.type, a2) {
          case l$2:
          case m$2:
          case e$1:
          case g$2:
          case f$2:
          case p$2:
            return a2;
          default:
            switch (a2 = a2 && a2.$$typeof, a2) {
              case k$2:
              case n$2:
              case t$2:
              case r$1:
              case h$2:
                return a2;
              default:
                return u2;
            }
        }
      case d$2:
        return u2;
    }
  }
}
function A$1(a2) {
  return z$1(a2) === m$2;
}
reactIs_production_min$1.AsyncMode = l$2;
reactIs_production_min$1.ConcurrentMode = m$2;
reactIs_production_min$1.ContextConsumer = k$2;
reactIs_production_min$1.ContextProvider = h$2;
reactIs_production_min$1.Element = c$2;
reactIs_production_min$1.ForwardRef = n$2;
reactIs_production_min$1.Fragment = e$1;
reactIs_production_min$1.Lazy = t$2;
reactIs_production_min$1.Memo = r$1;
reactIs_production_min$1.Portal = d$2;
reactIs_production_min$1.Profiler = g$2;
reactIs_production_min$1.StrictMode = f$2;
reactIs_production_min$1.Suspense = p$2;
reactIs_production_min$1.isAsyncMode = function(a2) {
  return A$1(a2) || z$1(a2) === l$2;
};
reactIs_production_min$1.isConcurrentMode = A$1;
reactIs_production_min$1.isContextConsumer = function(a2) {
  return z$1(a2) === k$2;
};
reactIs_production_min$1.isContextProvider = function(a2) {
  return z$1(a2) === h$2;
};
reactIs_production_min$1.isElement = function(a2) {
  return "object" === typeof a2 && null !== a2 && a2.$$typeof === c$2;
};
reactIs_production_min$1.isForwardRef = function(a2) {
  return z$1(a2) === n$2;
};
reactIs_production_min$1.isFragment = function(a2) {
  return z$1(a2) === e$1;
};
reactIs_production_min$1.isLazy = function(a2) {
  return z$1(a2) === t$2;
};
reactIs_production_min$1.isMemo = function(a2) {
  return z$1(a2) === r$1;
};
reactIs_production_min$1.isPortal = function(a2) {
  return z$1(a2) === d$2;
};
reactIs_production_min$1.isProfiler = function(a2) {
  return z$1(a2) === g$2;
};
reactIs_production_min$1.isStrictMode = function(a2) {
  return z$1(a2) === f$2;
};
reactIs_production_min$1.isSuspense = function(a2) {
  return z$1(a2) === p$2;
};
reactIs_production_min$1.isValidElementType = function(a2) {
  return "string" === typeof a2 || "function" === typeof a2 || a2 === e$1 || a2 === m$2 || a2 === g$2 || a2 === f$2 || a2 === p$2 || a2 === q$2 || "object" === typeof a2 && null !== a2 && (a2.$$typeof === t$2 || a2.$$typeof === r$1 || a2.$$typeof === h$2 || a2.$$typeof === k$2 || a2.$$typeof === n$2 || a2.$$typeof === w$1 || a2.$$typeof === x$1 || a2.$$typeof === y$1 || a2.$$typeof === v$2);
};
reactIs_production_min$1.typeOf = z$1;
{
  reactIs$1.exports = reactIs_production_min$1;
}
var reactIsExports = reactIs$1.exports;
var reactIs = reactIsExports;
var FORWARD_REF_STATICS = {
  "$$typeof": true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  "$$typeof": true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
var reactIs_production_min = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$1 = Symbol.for("react.element"), c$1 = Symbol.for("react.portal"), d$1 = Symbol.for("react.fragment"), e = Symbol.for("react.strict_mode"), f$1 = Symbol.for("react.profiler"), g$1 = Symbol.for("react.provider"), h$1 = Symbol.for("react.context"), k$1 = Symbol.for("react.server_context"), l$1 = Symbol.for("react.forward_ref"), m$1 = Symbol.for("react.suspense"), n$1 = Symbol.for("react.suspense_list"), p$1 = Symbol.for("react.memo"), q$1 = Symbol.for("react.lazy"), t$1 = Symbol.for("react.offscreen"), u$1;
u$1 = Symbol.for("react.module.reference");
function v$1(a2) {
  if ("object" === typeof a2 && null !== a2) {
    var r2 = a2.$$typeof;
    switch (r2) {
      case b$1:
        switch (a2 = a2.type, a2) {
          case d$1:
          case f$1:
          case e:
          case m$1:
          case n$1:
            return a2;
          default:
            switch (a2 = a2 && a2.$$typeof, a2) {
              case k$1:
              case h$1:
              case l$1:
              case q$1:
              case p$1:
              case g$1:
                return a2;
              default:
                return r2;
            }
        }
      case c$1:
        return r2;
    }
  }
}
reactIs_production_min.ContextConsumer = h$1;
reactIs_production_min.ContextProvider = g$1;
reactIs_production_min.Element = b$1;
reactIs_production_min.ForwardRef = l$1;
reactIs_production_min.Fragment = d$1;
reactIs_production_min.Lazy = q$1;
reactIs_production_min.Memo = p$1;
reactIs_production_min.Portal = c$1;
reactIs_production_min.Profiler = f$1;
reactIs_production_min.StrictMode = e;
reactIs_production_min.Suspense = m$1;
reactIs_production_min.SuspenseList = n$1;
reactIs_production_min.isAsyncMode = function() {
  return false;
};
reactIs_production_min.isConcurrentMode = function() {
  return false;
};
reactIs_production_min.isContextConsumer = function(a2) {
  return v$1(a2) === h$1;
};
reactIs_production_min.isContextProvider = function(a2) {
  return v$1(a2) === g$1;
};
reactIs_production_min.isElement = function(a2) {
  return "object" === typeof a2 && null !== a2 && a2.$$typeof === b$1;
};
reactIs_production_min.isForwardRef = function(a2) {
  return v$1(a2) === l$1;
};
reactIs_production_min.isFragment = function(a2) {
  return v$1(a2) === d$1;
};
reactIs_production_min.isLazy = function(a2) {
  return v$1(a2) === q$1;
};
reactIs_production_min.isMemo = function(a2) {
  return v$1(a2) === p$1;
};
reactIs_production_min.isPortal = function(a2) {
  return v$1(a2) === c$1;
};
reactIs_production_min.isProfiler = function(a2) {
  return v$1(a2) === f$1;
};
reactIs_production_min.isStrictMode = function(a2) {
  return v$1(a2) === e;
};
reactIs_production_min.isSuspense = function(a2) {
  return v$1(a2) === m$1;
};
reactIs_production_min.isSuspenseList = function(a2) {
  return v$1(a2) === n$1;
};
reactIs_production_min.isValidElementType = function(a2) {
  return "string" === typeof a2 || "function" === typeof a2 || a2 === d$1 || a2 === f$1 || a2 === e || a2 === m$1 || a2 === n$1 || a2 === t$1 || "object" === typeof a2 && null !== a2 && (a2.$$typeof === q$1 || a2.$$typeof === p$1 || a2.$$typeof === g$1 || a2.$$typeof === h$1 || a2.$$typeof === l$1 || a2.$$typeof === u$1 || void 0 !== a2.getModuleId) ? true : false;
};
reactIs_production_min.typeOf = v$1;
function createStoreHook(context = ReactReduxContext) {
  const useReduxContext$12 = (
    // @ts-ignore
    context === ReactReduxContext ? useReduxContext : (
      // @ts-ignore
      createReduxContextHook(context)
    )
  );
  return function useStore2() {
    const {
      store: store2
    } = useReduxContext$12();
    return store2;
  };
}
const useStore = /* @__PURE__ */ createStoreHook();
function createDispatchHook(context = ReactReduxContext) {
  const useStore$12 = (
    // @ts-ignore
    context === ReactReduxContext ? useStore : createStoreHook(context)
  );
  return function useDispatch2() {
    const store2 = useStore$12();
    return store2.dispatch;
  };
}
const useDispatch = /* @__PURE__ */ createDispatchHook();
initializeUseSelector(withSelectorExports.useSyncExternalStoreWithSelector);
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value2) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField = (obj, key, value2) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value2);
  return value2;
};
function isNumericType(type) {
  return isUnsignedIntegerType(type) || isSignedIntegerType(type) || isFloatingType(type);
}
function isUnsignedIntegerType(type) {
  return type == "uint8" || type == "uint16" || type == "uint32" || type == "uint64";
}
function isSignedIntegerType(type) {
  return type == "int8" || type == "int16" || type == "int32" || type == "int64";
}
function isFloatingType(type) {
  return type == "float32" || type == "float64";
}
function createPodDataFromAdapter(adapter) {
  const boards2 = Object.values(adapter.boards).map((boardAdapter) => {
    const packets = getPackets(boardAdapter.name, boardAdapter.packets);
    const measurementToPacket = getMeasurementToPacket(boardAdapter.packets);
    return {
      name: boardAdapter.name,
      packets,
      measurementToPacket
    };
  });
  const packetToBoard = getPacketToBoard(adapter.boards);
  return { boards: boards2, packetToBoard, lastUpdates: {} };
}
function getPackets(boardName, packets) {
  return Object.values(packets).map((packetAdapter) => {
    return {
      ...packetAdapter,
      measurements: getMeasurements(boardName, packetAdapter.measurements)
    };
  });
}
function getMeasurements(boardName, adapters) {
  return Object.values(adapters).map((adapter) => {
    const id2 = `${boardName}/${adapter.id}`;
    if (isNumericAdapter(adapter)) {
      return getNumericMeasurement(id2, adapter);
    } else if (adapter.type == "enum") {
      return getEnumMeasurement(id2, adapter);
    } else {
      return getBooleanMeasurement(id2, adapter);
    }
  });
}
function isNumericAdapter(adapter) {
  return isNumericType(adapter.type);
}
function getNumericMeasurement(id2, adapter) {
  return {
    id: id2,
    name: adapter.name,
    type: adapter.type,
    value: {
      average: 0,
      last: 0
    },
    units: adapter.units,
    safeRange: adapter.safeRange,
    warningRange: adapter.warningRange
  };
}
function getEnumMeasurement(id2, adapter) {
  return {
    id: id2,
    name: adapter.name,
    type: "enum",
    value: "Default"
  };
}
function getBooleanMeasurement(id2, adapter) {
  return {
    id: id2,
    name: adapter.name,
    type: adapter.type,
    value: false
  };
}
function getPacketToBoard(boards2) {
  let packetToBoard = {};
  Object.values(boards2).forEach((board2, index2) => {
    Object.values(board2.packets).forEach((packet) => {
      packetToBoard[packet.id] = index2;
    });
  });
  return packetToBoard;
}
function getMeasurementToPacket(packets) {
  let measurementToPacket = {};
  Object.values(packets).forEach((packet) => {
    Object.values(packet.measurements).forEach((m2) => measurementToPacket[m2.id] = packet.id);
  });
  return measurementToPacket;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min)
    return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f2 = React, k2 = Symbol.for("react.element"), l2 = Symbol.for("react.fragment"), m2 = Object.prototype.hasOwnProperty, n2 = f2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p2 = { key: true, ref: true, __self: true, __source: true };
  function q2(c6, a2, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a2.key && (e2 = "" + a2.key);
    void 0 !== a2.ref && (h2 = a2.ref);
    for (b2 in a2)
      m2.call(a2, b2) && !p2.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
    if (c6 && c6.defaultProps)
      for (b2 in a2 = c6.defaultProps, a2)
        void 0 === d2[b2] && (d2[b2] = a2[b2]);
    return { $$typeof: k2, type: c6, key: e2, ref: h2, props: d2, _owner: n2.current };
  }
  reactJsxRuntime_production_min.Fragment = l2;
  reactJsxRuntime_production_min.jsx = q2;
  reactJsxRuntime_production_min.jsxs = q2;
  return reactJsxRuntime_production_min;
}
{
  jsxRuntime.exports = requireReactJsxRuntime_production_min();
}
var jsxRuntimeExports = jsxRuntime.exports;
reactExports.createContext(void 0);
const WsHandlerContext = reactExports.createContext(null);
const WsHandlerProvider = ({ handler, children }) => {
  return jsxRuntimeExports.jsx(WsHandlerContext.Provider, { value: handler, children });
};
class WsHandler {
  constructor(url, reconnect, onOpen, onClose) {
    __publicField(this, "ws");
    __publicField(this, "topicToSuscriptions", /* @__PURE__ */ new Map());
    this.setupWs(url, reconnect, onOpen, onClose);
  }
  setupWs(url, reconnect, onOpen, onClose) {
    this.ws = new WebSocket(`ws://${url}`);
    this.ws.onopen = () => {
      for (const [topic, callbacks] of this.topicToSuscriptions.entries()) {
        for (const cb2 of callbacks) {
          this.ws.send(getSubscriptionMessage(topic, cb2.id));
        }
      }
      onOpen == null ? void 0 : onOpen();
    };
    this.ws.onmessage = (ev) => {
      const socketMessage = JSON.parse(ev.data);
      console.log(socketMessage);
      const callbacks = this.topicToSuscriptions.get(socketMessage.topic) ?? [];
      for (const callback of callbacks) {
        callback.cb(socketMessage.payload);
      }
    };
    this.ws.onclose = () => {
      onClose == null ? void 0 : onClose();
      if (reconnect) {
        setTimeout(() => {
          this.setupWs(url, reconnect, onOpen, onClose);
        }, 500);
      }
    };
  }
  post(topic, payload) {
    this.ws.send(JSON.stringify({ topic, payload }));
  }
  subscribe(topic, suscription) {
    this.addCallback(topic, suscription.id, suscription.cb);
    this.ws.send(getSubscriptionMessage(topic, suscription.id));
  }
  unsubscribe(topic, id2) {
    this.removeCallback(topic, id2);
    this.ws.send(JSON.stringify({ topic, payload: { subscribe: false, id: id2 } }));
  }
  exchange(topic, req, id2, cb2) {
    this.ws.send(JSON.stringify({ topic, payload: req }));
    const resCallback = (value2) => {
      cb2(value2, (req2) => this.ws.send(JSON.stringify({ topic, payload: req2 })), () => this.removeCallback(topic, id2));
    };
    this.addCallback(topic, id2, resCallback);
  }
  addCallback(topic, id2, cb2) {
    const suscriptions = this.topicToSuscriptions.get(topic);
    if (suscriptions) {
      suscriptions.push({ id: id2, cb: cb2 });
      this.topicToSuscriptions.set(topic, suscriptions);
    } else {
      this.topicToSuscriptions.set(topic, [{ id: id2, cb: cb2 }]);
    }
  }
  removeCallback(topic, id2) {
    var _a;
    const callbacks = this.topicToSuscriptions.get(topic);
    if (callbacks) {
      this.topicToSuscriptions.set(topic, callbacks.filter((element) => element.id != id2));
      if (((_a = this.topicToSuscriptions.get(topic)) == null ? void 0 : _a.length) == 0) {
        this.topicToSuscriptions.delete(topic);
      }
    } else {
      console.warn(`Topic ${topic} doesn't exist in topicToSuscriptions`);
    }
  }
}
function getSubscriptionMessage(topic, id2) {
  return JSON.stringify({
    topic,
    id: id2,
    payload: { subscribe: true, id: id2 }
  });
}
async function createWsHandler(url, reconnect, onOpen, onClose) {
  return new Promise((resolve, reject) => {
    const handler = new WsHandler(url, reconnect, () => {
      onOpen == null ? void 0 : onOpen();
      resolve(handler);
    }, () => {
      onClose == null ? void 0 : onClose();
      reject();
    });
  });
}
function useWsHandler() {
  return reactExports.useContext(WsHandlerContext);
}
function useSubscribe(topic, cb2) {
  const callbackRef = reactExports.useRef(cb2);
  reactExports.useEffect(() => {
    callbackRef.current = cb2;
  });
  const handler = useWsHandler();
  reactExports.useEffect(() => {
    const id2 = nanoid$3();
    handler.subscribe(topic, { id: id2, cb: cb2 });
    return () => {
      handler.unsubscribe(topic, id2);
    };
  }, [topic]);
}
function isNumericMeasurement(measurement) {
  return isNumericType(measurement.type);
}
function updatePacket(boardName, packet, update2) {
  packet.count = update2.count;
  packet.cycleTime = update2.cycleTime;
  packet.hexValue = update2.hexValue;
  updateMeasurements$1(boardName, packet.measurements, update2.measurementUpdates);
}
function updateMeasurements$1(boardName, measurements, measurementUpdates) {
  for (const [mId, newValue] of Object.entries(measurementUpdates)) {
    const id2 = `${boardName}/${mId}`;
    const measurement = measurements.find((item) => item.id == id2);
    if (!measurement) {
      console.warn(`measurement with id ${id2} not found`);
      continue;
    }
    measurement.value = newValue;
  }
}
function updatePodData$1(podData, packetUpdates) {
  for (const update2 of Object.values(packetUpdates)) {
    const packet = getPacket(podData, update2.id);
    if (packet) {
      const boardIndex = podData.packetToBoard[update2.id];
      if (boardIndex === void 0) {
        console.warn(`packet with id ${update2.id} not found in packetToBoard`);
        continue;
      }
      const board2 = podData.boards[boardIndex];
      if (!board2) {
        console.warn(`board with index ${boardIndex} not found`);
        continue;
      }
      updatePacket(board2.name, packet, update2);
    } else {
      console.warn(`packet with id ${update2.id} not found`);
    }
  }
}
function getPacket(podData, id2) {
  const board2 = podData.boards[podData.packetToBoard[id2]];
  if (board2) {
    return board2.packets.find((item) => item.id == id2);
  }
  return void 0;
}
const podDataSlice = createSlice({
  name: "podData",
  initialState: {
    boards: [],
    packetToBoard: {},
    lastUpdates: {}
  },
  reducers: {
    initPodData: (_2, action) => {
      return createPodDataFromAdapter(action.payload);
    },
    updatePodData: (state2, action) => {
      state2.lastUpdates = action.payload;
      updatePodData$1(state2, action.payload);
    }
  }
});
const measurementsSlice = createSlice({
  name: "measurements",
  initialState: { measurements: {}, packetIdToBoard: {} },
  reducers: {
    initMeasurements: (_2, action) => {
      return {
        measurements: createMeasurementsFromPodDataAdapter(action.payload),
        packetIdToBoard: getPacketIdToBoard(action.payload)
      };
    },
    updateMeasurements: (state2, action) => {
      for (const update2 of Object.values(action.payload)) {
        for (const [id2, mUpdate] of Object.entries(update2.measurementUpdates)) {
          const boardName = state2.packetIdToBoard[update2.id];
          if (!boardName) {
            continue;
          }
          const measId = `${boardName}/${id2}`;
          state2.measurements[measId].value = mUpdate;
        }
      }
    }
  }
});
function createMeasurementsFromPodDataAdapter(podDataAdapter) {
  const measurements = {};
  for (const board2 of Object.values(podDataAdapter.boards)) {
    for (const packet of Object.values(board2.packets)) {
      for (const adapter of Object.values(packet.measurements)) {
        const id2 = `${board2.name}/${adapter.id}`;
        if (isNumericAdapter(adapter)) {
          measurements[id2] = getNumericMeasurement(id2, adapter);
        } else if (adapter.type == "bool") {
          measurements[id2] = getBooleanMeasurement(id2, adapter);
        } else {
          measurements[id2] = getEnumMeasurement(id2, adapter);
        }
      }
    }
  }
  return measurements;
}
function getPacketIdToBoard(podData) {
  const packetIdToBoard = {};
  for (const board2 of Object.values(podData.boards)) {
    for (const packet of Object.values(board2.packets)) {
      packetIdToBoard[packet.id] = board2.name;
    }
  }
  return packetIdToBoard;
}
function getMeasurement(measurements, id2) {
  const meas = measurements.measurements[id2];
  if (!meas) {
    console.trace(`measurement ${id2} not found in store`);
    return void 0;
  }
  return meas;
}
function getMeasurementFallback(measurements, id2) {
  return getMeasurement(measurements, id2) ?? {
    id: "Default",
    name: "Default",
    safeRange: [null, null],
    warningRange: [null, null],
    type: "uint8",
    units: "A",
    value: { average: 0, last: 0 }
  };
}
let nanoid$2 = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id2, byte) => {
  byte &= 63;
  if (byte < 36) {
    id2 += byte.toString(36);
  } else if (byte < 62) {
    id2 += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id2 += "-";
  } else {
    id2 += "_";
  }
  return id2;
}, "");
var lodash = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
lodash.exports;
(function(module, exports) {
  (function() {
    var undefined$1;
    var VERSION = "4.17.21";
    var LARGE_ARRAY_SIZE = 200;
    var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var MAX_MEMOIZE_SIZE = 500;
    var PLACEHOLDER = "__lodash_placeholder__";
    var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
    var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
    var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
    var HOT_COUNT = 800, HOT_SPAN = 16;
    var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
    var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
    var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
    var wrapFlags = [
      ["ary", WRAP_ARY_FLAG],
      ["bind", WRAP_BIND_FLAG],
      ["bindKey", WRAP_BIND_KEY_FLAG],
      ["curry", WRAP_CURRY_FLAG],
      ["curryRight", WRAP_CURRY_RIGHT_FLAG],
      ["flip", WRAP_FLIP_FLAG],
      ["partial", WRAP_PARTIAL_FLAG],
      ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
      ["rearg", WRAP_REARG_FLAG]
    ];
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
    var reTrimStart = /^\s+/;
    var reWhitespace = /\s/;
    var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
    var reEscapeChar = /\\(\\)?/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['’]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
    var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reApos = RegExp(rsApos, "g");
    var reComboMark = RegExp(rsCombo, "g");
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reUnicodeWord = RegExp([
      rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
      rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
      rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
      rsUpper + "+" + rsOptContrUpper,
      rsOrdUpper,
      rsOrdLower,
      rsDigits,
      rsEmoji
    ].join("|"), "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var contextProps = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ];
    var templateCounter = -1;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var deburredLetters = {
      // Latin-1 Supplement block.
      "À": "A",
      "Á": "A",
      "Â": "A",
      "Ã": "A",
      "Ä": "A",
      "Å": "A",
      "à": "a",
      "á": "a",
      "â": "a",
      "ã": "a",
      "ä": "a",
      "å": "a",
      "Ç": "C",
      "ç": "c",
      "Ð": "D",
      "ð": "d",
      "È": "E",
      "É": "E",
      "Ê": "E",
      "Ë": "E",
      "è": "e",
      "é": "e",
      "ê": "e",
      "ë": "e",
      "Ì": "I",
      "Í": "I",
      "Î": "I",
      "Ï": "I",
      "ì": "i",
      "í": "i",
      "î": "i",
      "ï": "i",
      "Ñ": "N",
      "ñ": "n",
      "Ò": "O",
      "Ó": "O",
      "Ô": "O",
      "Õ": "O",
      "Ö": "O",
      "Ø": "O",
      "ò": "o",
      "ó": "o",
      "ô": "o",
      "õ": "o",
      "ö": "o",
      "ø": "o",
      "Ù": "U",
      "Ú": "U",
      "Û": "U",
      "Ü": "U",
      "ù": "u",
      "ú": "u",
      "û": "u",
      "ü": "u",
      "Ý": "Y",
      "ý": "y",
      "ÿ": "y",
      "Æ": "Ae",
      "æ": "ae",
      "Þ": "Th",
      "þ": "th",
      "ß": "ss",
      // Latin Extended-A block.
      "Ā": "A",
      "Ă": "A",
      "Ą": "A",
      "ā": "a",
      "ă": "a",
      "ą": "a",
      "Ć": "C",
      "Ĉ": "C",
      "Ċ": "C",
      "Č": "C",
      "ć": "c",
      "ĉ": "c",
      "ċ": "c",
      "č": "c",
      "Ď": "D",
      "Đ": "D",
      "ď": "d",
      "đ": "d",
      "Ē": "E",
      "Ĕ": "E",
      "Ė": "E",
      "Ę": "E",
      "Ě": "E",
      "ē": "e",
      "ĕ": "e",
      "ė": "e",
      "ę": "e",
      "ě": "e",
      "Ĝ": "G",
      "Ğ": "G",
      "Ġ": "G",
      "Ģ": "G",
      "ĝ": "g",
      "ğ": "g",
      "ġ": "g",
      "ģ": "g",
      "Ĥ": "H",
      "Ħ": "H",
      "ĥ": "h",
      "ħ": "h",
      "Ĩ": "I",
      "Ī": "I",
      "Ĭ": "I",
      "Į": "I",
      "İ": "I",
      "ĩ": "i",
      "ī": "i",
      "ĭ": "i",
      "į": "i",
      "ı": "i",
      "Ĵ": "J",
      "ĵ": "j",
      "Ķ": "K",
      "ķ": "k",
      "ĸ": "k",
      "Ĺ": "L",
      "Ļ": "L",
      "Ľ": "L",
      "Ŀ": "L",
      "Ł": "L",
      "ĺ": "l",
      "ļ": "l",
      "ľ": "l",
      "ŀ": "l",
      "ł": "l",
      "Ń": "N",
      "Ņ": "N",
      "Ň": "N",
      "Ŋ": "N",
      "ń": "n",
      "ņ": "n",
      "ň": "n",
      "ŋ": "n",
      "Ō": "O",
      "Ŏ": "O",
      "Ő": "O",
      "ō": "o",
      "ŏ": "o",
      "ő": "o",
      "Ŕ": "R",
      "Ŗ": "R",
      "Ř": "R",
      "ŕ": "r",
      "ŗ": "r",
      "ř": "r",
      "Ś": "S",
      "Ŝ": "S",
      "Ş": "S",
      "Š": "S",
      "ś": "s",
      "ŝ": "s",
      "ş": "s",
      "š": "s",
      "Ţ": "T",
      "Ť": "T",
      "Ŧ": "T",
      "ţ": "t",
      "ť": "t",
      "ŧ": "t",
      "Ũ": "U",
      "Ū": "U",
      "Ŭ": "U",
      "Ů": "U",
      "Ű": "U",
      "Ų": "U",
      "ũ": "u",
      "ū": "u",
      "ŭ": "u",
      "ů": "u",
      "ű": "u",
      "ų": "u",
      "Ŵ": "W",
      "ŵ": "w",
      "Ŷ": "Y",
      "ŷ": "y",
      "Ÿ": "Y",
      "Ź": "Z",
      "Ż": "Z",
      "Ž": "Z",
      "ź": "z",
      "ż": "z",
      "ž": "z",
      "Ĳ": "IJ",
      "ĳ": "ij",
      "Œ": "Oe",
      "œ": "oe",
      "ŉ": "'n",
      "ſ": "s"
    };
    var htmlEscapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var htmlUnescapes = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    };
    var stringEscapes = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    };
    var freeParseFloat = parseFloat, freeParseInt = parseInt;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e2) {
      }
    }();
    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        var value2 = array[index2];
        setter(accumulator, value2, iteratee(value2), array);
      }
      return accumulator;
    }
    function arrayEach(array, iteratee) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (iteratee(array[index2], index2, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEachRight(array, iteratee) {
      var length = array == null ? 0 : array.length;
      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEvery(array, predicate) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (!predicate(array[index2], index2, array)) {
          return false;
        }
      }
      return true;
    }
    function arrayFilter(array, predicate) {
      var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index2 < length) {
        var value2 = array[index2];
        if (predicate(value2, index2, array)) {
          result[resIndex++] = value2;
        }
      }
      return result;
    }
    function arrayIncludes(array, value2) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value2, 0) > -1;
    }
    function arrayIncludesWith(array, value2, comparator) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (comparator(value2, array[index2])) {
          return true;
        }
      }
      return false;
    }
    function arrayMap(array, iteratee) {
      var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index2 < length) {
        result[index2] = iteratee(array[index2], index2, array);
      }
      return result;
    }
    function arrayPush(array, values) {
      var index2 = -1, length = values.length, offset = array.length;
      while (++index2 < length) {
        array[offset + index2] = values[index2];
      }
      return array;
    }
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index2 = -1, length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[++index2];
      }
      while (++index2 < length) {
        accumulator = iteratee(accumulator, array[index2], index2, array);
      }
      return accumulator;
    }
    function arrayReduceRight(array, iteratee, accumulator, initAccum) {
      var length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }
    function arraySome(array, predicate) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (predicate(array[index2], index2, array)) {
          return true;
        }
      }
      return false;
    }
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    function baseFindKey(collection, predicate, eachFunc) {
      var result;
      eachFunc(collection, function(value2, key, collection2) {
        if (predicate(value2, key, collection2)) {
          result = key;
          return false;
        }
      });
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index2 = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index2-- : ++index2 < length) {
        if (predicate(array[index2], index2, array)) {
          return index2;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value2, fromIndex) {
      return value2 === value2 ? strictIndexOf(array, value2, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    function baseIndexOfWith(array, value2, fromIndex, comparator) {
      var index2 = fromIndex - 1, length = array.length;
      while (++index2 < length) {
        if (comparator(array[index2], value2)) {
          return index2;
        }
      }
      return -1;
    }
    function baseIsNaN(value2) {
      return value2 !== value2;
    }
    function baseMean(array, iteratee) {
      var length = array == null ? 0 : array.length;
      return length ? baseSum(array, iteratee) / length : NAN;
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined$1 : object[key];
      };
    }
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? undefined$1 : object[key];
      };
    }
    function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
      eachFunc(collection, function(value2, index2, collection2) {
        accumulator = initAccum ? (initAccum = false, value2) : iteratee(accumulator, value2, index2, collection2);
      });
      return accumulator;
    }
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    function baseSum(array, iteratee) {
      var result, index2 = -1, length = array.length;
      while (++index2 < length) {
        var current = iteratee(array[index2]);
        if (current !== undefined$1) {
          result = result === undefined$1 ? current : result + current;
        }
      }
      return result;
    }
    function baseTimes(n2, iteratee) {
      var index2 = -1, result = Array(n2);
      while (++index2 < n2) {
        result[index2] = iteratee(index2);
      }
      return result;
    }
    function baseToPairs(object, props) {
      return arrayMap(props, function(key) {
        return [key, object[key]];
      });
    }
    function baseTrim(string) {
      return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
    }
    function baseUnary(func) {
      return function(value2) {
        return func(value2);
      };
    }
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function charsStartIndex(strSymbols, chrSymbols) {
      var index2 = -1, length = strSymbols.length;
      while (++index2 < length && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
      }
      return index2;
    }
    function charsEndIndex(strSymbols, chrSymbols) {
      var index2 = strSymbols.length;
      while (index2-- && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
      }
      return index2;
    }
    function countHolders(array, placeholder) {
      var length = array.length, result = 0;
      while (length--) {
        if (array[length] === placeholder) {
          ++result;
        }
      }
      return result;
    }
    var deburrLetter = basePropertyOf(deburredLetters);
    var escapeHtmlChar = basePropertyOf(htmlEscapes);
    function escapeStringChar(chr) {
      return "\\" + stringEscapes[chr];
    }
    function getValue(object, key) {
      return object == null ? undefined$1 : object[key];
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    function iteratorToArray(iterator) {
      var data, result = [];
      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }
      return result;
    }
    function mapToArray(map) {
      var index2 = -1, result = Array(map.size);
      map.forEach(function(value2, key) {
        result[++index2] = [key, value2];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function replaceHolders(array, placeholder) {
      var index2 = -1, length = array.length, resIndex = 0, result = [];
      while (++index2 < length) {
        var value2 = array[index2];
        if (value2 === placeholder || value2 === PLACEHOLDER) {
          array[index2] = PLACEHOLDER;
          result[resIndex++] = index2;
        }
      }
      return result;
    }
    function setToArray(set) {
      var index2 = -1, result = Array(set.size);
      set.forEach(function(value2) {
        result[++index2] = value2;
      });
      return result;
    }
    function setToPairs(set) {
      var index2 = -1, result = Array(set.size);
      set.forEach(function(value2) {
        result[++index2] = [value2, value2];
      });
      return result;
    }
    function strictIndexOf(array, value2, fromIndex) {
      var index2 = fromIndex - 1, length = array.length;
      while (++index2 < length) {
        if (array[index2] === value2) {
          return index2;
        }
      }
      return -1;
    }
    function strictLastIndexOf(array, value2, fromIndex) {
      var index2 = fromIndex + 1;
      while (index2--) {
        if (array[index2] === value2) {
          return index2;
        }
      }
      return index2;
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function trimmedEndIndex(string) {
      var index2 = string.length;
      while (index2-- && reWhitespace.test(string.charAt(index2))) {
      }
      return index2;
    }
    var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        ++result;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    var runInContext = function runInContext2(context) {
      context = context == null ? root : _2.defaults(root.Object(), context, _2.pick(root, contextProps));
      var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
      var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
      var coreJsData = context["__core-js_shared__"];
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var idCounter = 0;
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var nativeObjectToString = objectProto.toString;
      var objectCtorString = funcToString.call(Object2);
      var oldDash = root._;
      var reIsNative = RegExp2(
        "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      var Buffer2 = moduleExports ? context.Buffer : undefined$1, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined$1, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined$1, symIterator = Symbol2 ? Symbol2.iterator : undefined$1, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined$1;
      var defineProperty = function() {
        try {
          var func = getNative(Object2, "defineProperty");
          func({}, "", {});
          return func;
        } catch (e2) {
        }
      }();
      var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
      var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined$1, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
      var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
      var metaMap = WeakMap2 && new WeakMap2();
      var realNames = {};
      var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
      var symbolProto = Symbol2 ? Symbol2.prototype : undefined$1, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1, symbolToString = symbolProto ? symbolProto.toString : undefined$1;
      function lodash2(value2) {
        if (isObjectLike(value2) && !isArray(value2) && !(value2 instanceof LazyWrapper)) {
          if (value2 instanceof LodashWrapper) {
            return value2;
          }
          if (hasOwnProperty.call(value2, "__wrapped__")) {
            return wrapperClone(value2);
          }
        }
        return new LodashWrapper(value2);
      }
      var baseCreate = function() {
        function object() {
        }
        return function(proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result2 = new object();
          object.prototype = undefined$1;
          return result2;
        };
      }();
      function baseLodash() {
      }
      function LodashWrapper(value2, chainAll) {
        this.__wrapped__ = value2;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined$1;
      }
      lodash2.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        "escape": reEscape,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        "evaluate": reEvaluate,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        "interpolate": reInterpolate,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        "variable": "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        "imports": {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          "_": lodash2
        }
      };
      lodash2.prototype = baseLodash.prototype;
      lodash2.prototype.constructor = lodash2;
      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;
      function LazyWrapper(value2) {
        this.__wrapped__ = value2;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH;
        this.__views__ = [];
      }
      function lazyClone() {
        var result2 = new LazyWrapper(this.__wrapped__);
        result2.__actions__ = copyArray(this.__actions__);
        result2.__dir__ = this.__dir__;
        result2.__filtered__ = this.__filtered__;
        result2.__iteratees__ = copyArray(this.__iteratees__);
        result2.__takeCount__ = this.__takeCount__;
        result2.__views__ = copyArray(this.__views__);
        return result2;
      }
      function lazyReverse() {
        if (this.__filtered__) {
          var result2 = new LazyWrapper(this);
          result2.__dir__ = -1;
          result2.__filtered__ = true;
        } else {
          result2 = this.clone();
          result2.__dir__ *= -1;
        }
        return result2;
      }
      function lazyValue() {
        var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start2 = view.start, end = view.end, length = end - start2, index2 = isRight ? end : start2 - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
        if (!isArr || !isRight && arrLength == length && takeCount == length) {
          return baseWrapperValue(array, this.__actions__);
        }
        var result2 = [];
        outer:
          while (length-- && resIndex < takeCount) {
            index2 += dir;
            var iterIndex = -1, value2 = array[index2];
            while (++iterIndex < iterLength) {
              var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value2);
              if (type == LAZY_MAP_FLAG) {
                value2 = computed;
              } else if (!computed) {
                if (type == LAZY_FILTER_FLAG) {
                  continue outer;
                } else {
                  break outer;
                }
              }
            }
            result2[resIndex++] = value2;
          }
        return result2;
      }
      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;
      function Hash(entries) {
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result2 = this.has(key) && delete this.__data__[key];
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result2 = data[key];
          return result2 === HASH_UNDEFINED ? undefined$1 : result2;
        }
        return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined$1 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value2) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value2 === undefined$1 ? HASH_UNDEFINED : value2;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function listCacheDelete(key) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        if (index2 < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index2 == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index2, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        return index2 < 0 ? undefined$1 : data[index2][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value2) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        if (index2 < 0) {
          ++this.size;
          data.push([key, value2]);
        } else {
          data[index2][1] = value2;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map2 || ListCache)(),
          "string": new Hash()
        };
      }
      function mapCacheDelete(key) {
        var result2 = getMapData(this, key)["delete"](key);
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value2) {
        var data = getMapData(this, key), size2 = data.size;
        data.set(key, value2);
        this.size += data.size == size2 ? 0 : 1;
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function SetCache(values2) {
        var index2 = -1, length = values2 == null ? 0 : values2.length;
        this.__data__ = new MapCache();
        while (++index2 < length) {
          this.add(values2[index2]);
        }
      }
      function setCacheAdd(value2) {
        this.__data__.set(value2, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value2) {
        return this.__data__.has(value2);
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__, result2 = data["delete"](key);
        this.size = data.size;
        return result2;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      function stackSet(key, value2) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value2]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value2);
        this.size = data.size;
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function arrayLikeKeys(value2, inherited) {
        var isArr = isArray(value2), isArg = !isArr && isArguments(value2), isBuff = !isArr && !isArg && isBuffer(value2), isType = !isArr && !isArg && !isBuff && isTypedArray(value2), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value2.length, String2) : [], length = result2.length;
        for (var key in value2) {
          if ((inherited || hasOwnProperty.call(value2, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
          (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
          isIndex(key, length)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function arraySample(array) {
        var length = array.length;
        return length ? array[baseRandom(0, length - 1)] : undefined$1;
      }
      function arraySampleSize(array, n2) {
        return shuffleSelf(copyArray(array), baseClamp(n2, 0, array.length));
      }
      function arrayShuffle(array) {
        return shuffleSelf(copyArray(array));
      }
      function assignMergeValue(object, key, value2) {
        if (value2 !== undefined$1 && !eq(object[key], value2) || value2 === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value2);
        }
      }
      function assignValue(object, key, value2) {
        var objValue = object[key];
        if (!(hasOwnProperty.call(object, key) && eq(objValue, value2)) || value2 === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value2);
        }
      }
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseAggregator(collection, setter, iteratee2, accumulator) {
        baseEach(collection, function(value2, key, collection2) {
          setter(accumulator, value2, iteratee2(value2), collection2);
        });
        return accumulator;
      }
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }
      function baseAssignValue(object, key, value2) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object, key, {
            "configurable": true,
            "enumerable": true,
            "value": value2,
            "writable": true
          });
        } else {
          object[key] = value2;
        }
      }
      function baseAt(object, paths) {
        var index2 = -1, length = paths.length, result2 = Array2(length), skip = object == null;
        while (++index2 < length) {
          result2[index2] = skip ? undefined$1 : get(object, paths[index2]);
        }
        return result2;
      }
      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== undefined$1) {
            number = number <= upper ? number : upper;
          }
          if (lower !== undefined$1) {
            number = number >= lower ? number : lower;
          }
        }
        return number;
      }
      function baseClone(value2, bitmask, customizer, key, object, stack) {
        var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
        if (customizer) {
          result2 = object ? customizer(value2, key, object, stack) : customizer(value2);
        }
        if (result2 !== undefined$1) {
          return result2;
        }
        if (!isObject(value2)) {
          return value2;
        }
        var isArr = isArray(value2);
        if (isArr) {
          result2 = initCloneArray(value2);
          if (!isDeep) {
            return copyArray(value2, result2);
          }
        } else {
          var tag = getTag(value2), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value2)) {
            return cloneBuffer(value2, isDeep);
          }
          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            result2 = isFlat || isFunc ? {} : initCloneObject(value2);
            if (!isDeep) {
              return isFlat ? copySymbolsIn(value2, baseAssignIn(result2, value2)) : copySymbols(value2, baseAssign(result2, value2));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value2 : {};
            }
            result2 = initCloneByTag(value2, tag, isDeep);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value2);
        if (stacked) {
          return stacked;
        }
        stack.set(value2, result2);
        if (isSet(value2)) {
          value2.forEach(function(subValue) {
            result2.add(baseClone(subValue, bitmask, customizer, subValue, value2, stack));
          });
        } else if (isMap(value2)) {
          value2.forEach(function(subValue, key2) {
            result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value2, stack));
          });
        }
        var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
        var props = isArr ? undefined$1 : keysFunc(value2);
        arrayEach(props || value2, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value2[key2];
          }
          assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value2, stack));
        });
        return result2;
      }
      function baseConforms(source) {
        var props = keys(source);
        return function(object) {
          return baseConformsTo(object, source, props);
        };
      }
      function baseConformsTo(object, source, props) {
        var length = props.length;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (length--) {
          var key = props[length], predicate = source[key], value2 = object[key];
          if (value2 === undefined$1 && !(key in object) || !predicate(value2)) {
            return false;
          }
        }
        return true;
      }
      function baseDelay(func, wait, args) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return setTimeout2(function() {
          func.apply(undefined$1, args);
        }, wait);
      }
      function baseDifference(array, values2, iteratee2, comparator) {
        var index2 = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
        if (!length) {
          return result2;
        }
        if (iteratee2) {
          values2 = arrayMap(values2, baseUnary(iteratee2));
        }
        if (comparator) {
          includes2 = arrayIncludesWith;
          isCommon = false;
        } else if (values2.length >= LARGE_ARRAY_SIZE) {
          includes2 = cacheHas;
          isCommon = false;
          values2 = new SetCache(values2);
        }
        outer:
          while (++index2 < length) {
            var value2 = array[index2], computed = iteratee2 == null ? value2 : iteratee2(value2);
            value2 = comparator || value2 !== 0 ? value2 : 0;
            if (isCommon && computed === computed) {
              var valuesIndex = valuesLength;
              while (valuesIndex--) {
                if (values2[valuesIndex] === computed) {
                  continue outer;
                }
              }
              result2.push(value2);
            } else if (!includes2(values2, computed, comparator)) {
              result2.push(value2);
            }
          }
        return result2;
      }
      var baseEach = createBaseEach(baseForOwn);
      var baseEachRight = createBaseEach(baseForOwnRight, true);
      function baseEvery(collection, predicate) {
        var result2 = true;
        baseEach(collection, function(value2, index2, collection2) {
          result2 = !!predicate(value2, index2, collection2);
          return result2;
        });
        return result2;
      }
      function baseExtremum(array, iteratee2, comparator) {
        var index2 = -1, length = array.length;
        while (++index2 < length) {
          var value2 = array[index2], current = iteratee2(value2);
          if (current != null && (computed === undefined$1 ? current === current && !isSymbol(current) : comparator(current, computed))) {
            var computed = current, result2 = value2;
          }
        }
        return result2;
      }
      function baseFill(array, value2, start2, end) {
        var length = array.length;
        start2 = toInteger(start2);
        if (start2 < 0) {
          start2 = -start2 > length ? 0 : length + start2;
        }
        end = end === undefined$1 || end > length ? length : toInteger(end);
        if (end < 0) {
          end += length;
        }
        end = start2 > end ? 0 : toLength(end);
        while (start2 < end) {
          array[start2++] = value2;
        }
        return array;
      }
      function baseFilter(collection, predicate) {
        var result2 = [];
        baseEach(collection, function(value2, index2, collection2) {
          if (predicate(value2, index2, collection2)) {
            result2.push(value2);
          }
        });
        return result2;
      }
      function baseFlatten(array, depth, predicate, isStrict, result2) {
        var index2 = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result2 || (result2 = []);
        while (++index2 < length) {
          var value2 = array[index2];
          if (depth > 0 && predicate(value2)) {
            if (depth > 1) {
              baseFlatten(value2, depth - 1, predicate, isStrict, result2);
            } else {
              arrayPush(result2, value2);
            }
          } else if (!isStrict) {
            result2[result2.length] = value2;
          }
        }
        return result2;
      }
      var baseFor = createBaseFor();
      var baseForRight = createBaseFor(true);
      function baseForOwn(object, iteratee2) {
        return object && baseFor(object, iteratee2, keys);
      }
      function baseForOwnRight(object, iteratee2) {
        return object && baseForRight(object, iteratee2, keys);
      }
      function baseFunctions(object, props) {
        return arrayFilter(props, function(key) {
          return isFunction(object[key]);
        });
      }
      function baseGet(object, path) {
        path = castPath(path, object);
        var index2 = 0, length = path.length;
        while (object != null && index2 < length) {
          object = object[toKey(path[index2++])];
        }
        return index2 && index2 == length ? object : undefined$1;
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result2 = keysFunc(object);
        return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
      }
      function baseGetTag(value2) {
        if (value2 == null) {
          return value2 === undefined$1 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object2(value2) ? getRawTag(value2) : objectToString(value2);
      }
      function baseGt(value2, other) {
        return value2 > other;
      }
      function baseHas(object, key) {
        return object != null && hasOwnProperty.call(object, key);
      }
      function baseHasIn(object, key) {
        return object != null && key in Object2(object);
      }
      function baseInRange(number, start2, end) {
        return number >= nativeMin(start2, end) && number < nativeMax(start2, end);
      }
      function baseIntersection(arrays, iteratee2, comparator) {
        var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
        while (othIndex--) {
          var array = arrays[othIndex];
          if (othIndex && iteratee2) {
            array = arrayMap(array, baseUnary(iteratee2));
          }
          maxLength = nativeMin(array.length, maxLength);
          caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined$1;
        }
        array = arrays[0];
        var index2 = -1, seen = caches[0];
        outer:
          while (++index2 < length && result2.length < maxLength) {
            var value2 = array[index2], computed = iteratee2 ? iteratee2(value2) : value2;
            value2 = comparator || value2 !== 0 ? value2 : 0;
            if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
              othIndex = othLength;
              while (--othIndex) {
                var cache = caches[othIndex];
                if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                  continue outer;
                }
              }
              if (seen) {
                seen.push(computed);
              }
              result2.push(value2);
            }
          }
        return result2;
      }
      function baseInverter(object, setter, iteratee2, accumulator) {
        baseForOwn(object, function(value2, key, object2) {
          setter(accumulator, iteratee2(value2), key, object2);
        });
        return accumulator;
      }
      function baseInvoke(object, path, args) {
        path = castPath(path, object);
        object = parent(object, path);
        var func = object == null ? object : object[toKey(last(path))];
        return func == null ? undefined$1 : apply(func, object, args);
      }
      function baseIsArguments(value2) {
        return isObjectLike(value2) && baseGetTag(value2) == argsTag;
      }
      function baseIsArrayBuffer(value2) {
        return isObjectLike(value2) && baseGetTag(value2) == arrayBufferTag;
      }
      function baseIsDate(value2) {
        return isObjectLike(value2) && baseGetTag(value2) == dateTag;
      }
      function baseIsEqual(value2, other, bitmask, customizer, stack) {
        if (value2 === other) {
          return true;
        }
        if (value2 == null || other == null || !isObjectLike(value2) && !isObjectLike(other)) {
          return value2 !== value2 && other !== other;
        }
        return baseIsEqualDeep(value2, other, bitmask, customizer, baseIsEqual, stack);
      }
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsMap(value2) {
        return isObjectLike(value2) && getTag(value2) == mapTag;
      }
      function baseIsMatch(object, source, matchData, customizer) {
        var index2 = matchData.length, length = index2, noCustomizer = !customizer;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (index2--) {
          var data = matchData[index2];
          if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }
        while (++index2 < length) {
          data = matchData[index2];
          var key = data[0], objValue = object[key], srcValue = data[1];
          if (noCustomizer && data[2]) {
            if (objValue === undefined$1 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack();
            if (customizer) {
              var result2 = customizer(objValue, srcValue, key, object, source, stack);
            }
            if (!(result2 === undefined$1 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
              return false;
            }
          }
        }
        return true;
      }
      function baseIsNative(value2) {
        if (!isObject(value2) || isMasked(value2)) {
          return false;
        }
        var pattern = isFunction(value2) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value2));
      }
      function baseIsRegExp(value2) {
        return isObjectLike(value2) && baseGetTag(value2) == regexpTag;
      }
      function baseIsSet(value2) {
        return isObjectLike(value2) && getTag(value2) == setTag;
      }
      function baseIsTypedArray(value2) {
        return isObjectLike(value2) && isLength(value2.length) && !!typedArrayTags[baseGetTag(value2)];
      }
      function baseIteratee(value2) {
        if (typeof value2 == "function") {
          return value2;
        }
        if (value2 == null) {
          return identity;
        }
        if (typeof value2 == "object") {
          return isArray(value2) ? baseMatchesProperty(value2[0], value2[1]) : baseMatches(value2);
        }
        return property(value2);
      }
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result2 = [];
        for (var key in Object2(object)) {
          if (hasOwnProperty.call(object, key) && key != "constructor") {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result2 = [];
        for (var key in object) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseLt(value2, other) {
        return value2 < other;
      }
      function baseMap(collection, iteratee2) {
        var index2 = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value2, key, collection2) {
          result2[++index2] = iteratee2(value2, key, collection2);
        });
        return result2;
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function(object) {
          var objValue = get(object, path);
          return objValue === undefined$1 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        baseFor(source, function(srcValue, key) {
          stack || (stack = new Stack());
          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined$1;
            if (newValue === undefined$1) {
              newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
          }
        }, keysIn);
      }
      function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined$1;
        var isCommon = newValue === undefined$1;
        if (isCommon) {
          var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject2(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }
        if (isCommon) {
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack["delete"](srcValue);
        }
        assignMergeValue(object, key, newValue);
      }
      function baseNth(array, n2) {
        var length = array.length;
        if (!length) {
          return;
        }
        n2 += n2 < 0 ? length : 0;
        return isIndex(n2, length) ? array[n2] : undefined$1;
      }
      function baseOrderBy(collection, iteratees, orders2) {
        if (iteratees.length) {
          iteratees = arrayMap(iteratees, function(iteratee2) {
            if (isArray(iteratee2)) {
              return function(value2) {
                return baseGet(value2, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
              };
            }
            return iteratee2;
          });
        } else {
          iteratees = [identity];
        }
        var index2 = -1;
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        var result2 = baseMap(collection, function(value2, key, collection2) {
          var criteria = arrayMap(iteratees, function(iteratee2) {
            return iteratee2(value2);
          });
          return { "criteria": criteria, "index": ++index2, "value": value2 };
        });
        return baseSortBy(result2, function(object, other) {
          return compareMultiple(object, other, orders2);
        });
      }
      function basePick(object, paths) {
        return basePickBy(object, paths, function(value2, path) {
          return hasIn(object, path);
        });
      }
      function basePickBy(object, paths, predicate) {
        var index2 = -1, length = paths.length, result2 = {};
        while (++index2 < length) {
          var path = paths[index2], value2 = baseGet(object, path);
          if (predicate(value2, path)) {
            baseSet(result2, castPath(path, object), value2);
          }
        }
        return result2;
      }
      function basePropertyDeep(path) {
        return function(object) {
          return baseGet(object, path);
        };
      }
      function basePullAll(array, values2, iteratee2, comparator) {
        var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index2 = -1, length = values2.length, seen = array;
        if (array === values2) {
          values2 = copyArray(values2);
        }
        if (iteratee2) {
          seen = arrayMap(array, baseUnary(iteratee2));
        }
        while (++index2 < length) {
          var fromIndex = 0, value2 = values2[index2], computed = iteratee2 ? iteratee2(value2) : value2;
          while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array) {
              splice.call(seen, fromIndex, 1);
            }
            splice.call(array, fromIndex, 1);
          }
        }
        return array;
      }
      function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0, lastIndex = length - 1;
        while (length--) {
          var index2 = indexes[length];
          if (length == lastIndex || index2 !== previous) {
            var previous = index2;
            if (isIndex(index2)) {
              splice.call(array, index2, 1);
            } else {
              baseUnset(array, index2);
            }
          }
        }
        return array;
      }
      function baseRandom(lower, upper) {
        return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
      }
      function baseRange(start2, end, step, fromRight) {
        var index2 = -1, length = nativeMax(nativeCeil((end - start2) / (step || 1)), 0), result2 = Array2(length);
        while (length--) {
          result2[fromRight ? length : ++index2] = start2;
          start2 += step;
        }
        return result2;
      }
      function baseRepeat(string, n2) {
        var result2 = "";
        if (!string || n2 < 1 || n2 > MAX_SAFE_INTEGER) {
          return result2;
        }
        do {
          if (n2 % 2) {
            result2 += string;
          }
          n2 = nativeFloor(n2 / 2);
          if (n2) {
            string += string;
          }
        } while (n2);
        return result2;
      }
      function baseRest(func, start2) {
        return setToString(overRest(func, start2, identity), func + "");
      }
      function baseSample(collection) {
        return arraySample(values(collection));
      }
      function baseSampleSize(collection, n2) {
        var array = values(collection);
        return shuffleSelf(array, baseClamp(n2, 0, array.length));
      }
      function baseSet(object, path, value2, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path = castPath(path, object);
        var index2 = -1, length = path.length, lastIndex = length - 1, nested = object;
        while (nested != null && ++index2 < length) {
          var key = toKey(path[index2]), newValue = value2;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object;
          }
          if (index2 != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
            if (newValue === undefined$1) {
              newValue = isObject(objValue) ? objValue : isIndex(path[index2 + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      var baseSetData = !metaMap ? identity : function(func, data) {
        metaMap.set(func, data);
        return func;
      };
      var baseSetToString = !defineProperty ? identity : function(func, string) {
        return defineProperty(func, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string),
          "writable": true
        });
      };
      function baseShuffle(collection) {
        return shuffleSelf(values(collection));
      }
      function baseSlice(array, start2, end) {
        var index2 = -1, length = array.length;
        if (start2 < 0) {
          start2 = -start2 > length ? 0 : length + start2;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start2 > end ? 0 : end - start2 >>> 0;
        start2 >>>= 0;
        var result2 = Array2(length);
        while (++index2 < length) {
          result2[index2] = array[index2 + start2];
        }
        return result2;
      }
      function baseSome(collection, predicate) {
        var result2;
        baseEach(collection, function(value2, index2, collection2) {
          result2 = predicate(value2, index2, collection2);
          return !result2;
        });
        return !!result2;
      }
      function baseSortedIndex(array, value2, retHighest) {
        var low = 0, high = array == null ? low : array.length;
        if (typeof value2 == "number" && value2 === value2 && high <= HALF_MAX_ARRAY_LENGTH) {
          while (low < high) {
            var mid = low + high >>> 1, computed = array[mid];
            if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value2 : computed < value2)) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return high;
        }
        return baseSortedIndexBy(array, value2, identity, retHighest);
      }
      function baseSortedIndexBy(array, value2, iteratee2, retHighest) {
        var low = 0, high = array == null ? 0 : array.length;
        if (high === 0) {
          return 0;
        }
        value2 = iteratee2(value2);
        var valIsNaN = value2 !== value2, valIsNull = value2 === null, valIsSymbol = isSymbol(value2), valIsUndefined = value2 === undefined$1;
        while (low < high) {
          var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined$1, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value2 : computed < value2;
          }
          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return nativeMin(high, MAX_ARRAY_INDEX);
      }
      function baseSortedUniq(array, iteratee2) {
        var index2 = -1, length = array.length, resIndex = 0, result2 = [];
        while (++index2 < length) {
          var value2 = array[index2], computed = iteratee2 ? iteratee2(value2) : value2;
          if (!index2 || !eq(computed, seen)) {
            var seen = computed;
            result2[resIndex++] = value2 === 0 ? 0 : value2;
          }
        }
        return result2;
      }
      function baseToNumber(value2) {
        if (typeof value2 == "number") {
          return value2;
        }
        if (isSymbol(value2)) {
          return NAN;
        }
        return +value2;
      }
      function baseToString(value2) {
        if (typeof value2 == "string") {
          return value2;
        }
        if (isArray(value2)) {
          return arrayMap(value2, baseToString) + "";
        }
        if (isSymbol(value2)) {
          return symbolToString ? symbolToString.call(value2) : "";
        }
        var result2 = value2 + "";
        return result2 == "0" && 1 / value2 == -INFINITY ? "-0" : result2;
      }
      function baseUniq(array, iteratee2, comparator) {
        var index2 = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
        if (comparator) {
          isCommon = false;
          includes2 = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set2 = iteratee2 ? null : createSet(array);
          if (set2) {
            return setToArray(set2);
          }
          isCommon = false;
          includes2 = cacheHas;
          seen = new SetCache();
        } else {
          seen = iteratee2 ? [] : result2;
        }
        outer:
          while (++index2 < length) {
            var value2 = array[index2], computed = iteratee2 ? iteratee2(value2) : value2;
            value2 = comparator || value2 !== 0 ? value2 : 0;
            if (isCommon && computed === computed) {
              var seenIndex = seen.length;
              while (seenIndex--) {
                if (seen[seenIndex] === computed) {
                  continue outer;
                }
              }
              if (iteratee2) {
                seen.push(computed);
              }
              result2.push(value2);
            } else if (!includes2(seen, computed, comparator)) {
              if (seen !== result2) {
                seen.push(computed);
              }
              result2.push(value2);
            }
          }
        return result2;
      }
      function baseUnset(object, path) {
        path = castPath(path, object);
        object = parent(object, path);
        return object == null || delete object[toKey(last(path))];
      }
      function baseUpdate(object, path, updater, customizer) {
        return baseSet(object, path, updater(baseGet(object, path)), customizer);
      }
      function baseWhile(array, predicate, isDrop, fromRight) {
        var length = array.length, index2 = fromRight ? length : -1;
        while ((fromRight ? index2-- : ++index2 < length) && predicate(array[index2], index2, array)) {
        }
        return isDrop ? baseSlice(array, fromRight ? 0 : index2, fromRight ? index2 + 1 : length) : baseSlice(array, fromRight ? index2 + 1 : 0, fromRight ? length : index2);
      }
      function baseWrapperValue(value2, actions) {
        var result2 = value2;
        if (result2 instanceof LazyWrapper) {
          result2 = result2.value();
        }
        return arrayReduce(actions, function(result3, action) {
          return action.func.apply(action.thisArg, arrayPush([result3], action.args));
        }, result2);
      }
      function baseXor(arrays, iteratee2, comparator) {
        var length = arrays.length;
        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }
        var index2 = -1, result2 = Array2(length);
        while (++index2 < length) {
          var array = arrays[index2], othIndex = -1;
          while (++othIndex < length) {
            if (othIndex != index2) {
              result2[index2] = baseDifference(result2[index2] || array, arrays[othIndex], iteratee2, comparator);
            }
          }
        }
        return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
      }
      function baseZipObject(props, values2, assignFunc) {
        var index2 = -1, length = props.length, valsLength = values2.length, result2 = {};
        while (++index2 < length) {
          var value2 = index2 < valsLength ? values2[index2] : undefined$1;
          assignFunc(result2, props[index2], value2);
        }
        return result2;
      }
      function castArrayLikeObject(value2) {
        return isArrayLikeObject(value2) ? value2 : [];
      }
      function castFunction(value2) {
        return typeof value2 == "function" ? value2 : identity;
      }
      function castPath(value2, object) {
        if (isArray(value2)) {
          return value2;
        }
        return isKey(value2, object) ? [value2] : stringToPath(toString(value2));
      }
      var castRest = baseRest;
      function castSlice(array, start2, end) {
        var length = array.length;
        end = end === undefined$1 ? length : end;
        return !start2 && end >= length ? array : baseSlice(array, start2, end);
      }
      var clearTimeout2 = ctxClearTimeout || function(id2) {
        return root.clearTimeout(id2);
      };
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result2);
        return result2;
      }
      function cloneArrayBuffer(arrayBuffer) {
        var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
        return result2;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      function cloneRegExp(regexp) {
        var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result2.lastIndex = regexp.lastIndex;
        return result2;
      }
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      function compareAscending(value2, other) {
        if (value2 !== other) {
          var valIsDefined = value2 !== undefined$1, valIsNull = value2 === null, valIsReflexive = value2 === value2, valIsSymbol = isSymbol(value2);
          var othIsDefined = other !== undefined$1, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
          if (!othIsNull && !othIsSymbol && !valIsSymbol && value2 > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
            return 1;
          }
          if (!valIsNull && !valIsSymbol && !othIsSymbol && value2 < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
            return -1;
          }
        }
        return 0;
      }
      function compareMultiple(object, other, orders2) {
        var index2 = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders2.length;
        while (++index2 < length) {
          var result2 = compareAscending(objCriteria[index2], othCriteria[index2]);
          if (result2) {
            if (index2 >= ordersLength) {
              return result2;
            }
            var order = orders2[index2];
            return result2 * (order == "desc" ? -1 : 1);
          }
        }
        return object.index - other.index;
      }
      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
        while (++leftIndex < leftLength) {
          result2[leftIndex] = partials[leftIndex];
        }
        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[holders[argsIndex]] = args[argsIndex];
          }
        }
        while (rangeLength--) {
          result2[leftIndex++] = args[argsIndex++];
        }
        return result2;
      }
      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
        while (++argsIndex < rangeLength) {
          result2[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
          result2[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }
        return result2;
      }
      function copyArray(source, array) {
        var index2 = -1, length = source.length;
        array || (array = Array2(length));
        while (++index2 < length) {
          array[index2] = source[index2];
        }
        return array;
      }
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index2 = -1, length = props.length;
        while (++index2 < length) {
          var key = props[index2];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined$1;
          if (newValue === undefined$1) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }
      function createAggregator(setter, initializer) {
        return function(collection, iteratee2) {
          var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
          return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
        };
      }
      function createAssigner(assigner) {
        return baseRest(function(object, sources) {
          var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined$1, guard = length > 2 ? sources[2] : undefined$1;
          customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined$1;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined$1 : customizer;
            length = 1;
          }
          object = Object2(object);
          while (++index2 < length) {
            var source = sources[index2];
            if (source) {
              assigner(object, source, index2, customizer);
            }
          }
          return object;
        });
      }
      function createBaseEach(eachFunc, fromRight) {
        return function(collection, iteratee2) {
          if (collection == null) {
            return collection;
          }
          if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee2);
          }
          var length = collection.length, index2 = fromRight ? length : -1, iterable = Object2(collection);
          while (fromRight ? index2-- : ++index2 < length) {
            if (iteratee2(iterable[index2], index2, iterable) === false) {
              break;
            }
          }
          return collection;
        };
      }
      function createBaseFor(fromRight) {
        return function(object, iteratee2, keysFunc) {
          var index2 = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
          while (length--) {
            var key = props[fromRight ? length : ++index2];
            if (iteratee2(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }
      function createBind(func, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var fn2 = this && this !== root && this instanceof wrapper ? Ctor : func;
          return fn2.apply(isBind ? thisArg : this, arguments);
        }
        return wrapper;
      }
      function createCaseFirst(methodName) {
        return function(string) {
          string = toString(string);
          var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined$1;
          var chr = strSymbols ? strSymbols[0] : string.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      function createCompounder(callback) {
        return function(string) {
          return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
        };
      }
      function createCtor(Ctor) {
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return new Ctor();
            case 1:
              return new Ctor(args[0]);
            case 2:
              return new Ctor(args[0], args[1]);
            case 3:
              return new Ctor(args[0], args[1], args[2]);
            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);
            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }
          var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
          return isObject(result2) ? result2 : thisBinding;
        };
      }
      function createCurry(func, bitmask, arity) {
        var Ctor = createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index2 = length, placeholder = getHolder(wrapper);
          while (index2--) {
            args[index2] = arguments[index2];
          }
          var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
          length -= holders.length;
          if (length < arity) {
            return createRecurry(
              func,
              bitmask,
              createHybrid,
              wrapper.placeholder,
              undefined$1,
              args,
              holders,
              undefined$1,
              undefined$1,
              arity - length
            );
          }
          var fn2 = this && this !== root && this instanceof wrapper ? Ctor : func;
          return apply(fn2, this, args);
        }
        return wrapper;
      }
      function createFind(findIndexFunc) {
        return function(collection, predicate, fromIndex) {
          var iterable = Object2(collection);
          if (!isArrayLike(collection)) {
            var iteratee2 = getIteratee(predicate, 3);
            collection = keys(collection);
            predicate = function(key) {
              return iteratee2(iterable[key], key, iterable);
            };
          }
          var index2 = findIndexFunc(collection, predicate, fromIndex);
          return index2 > -1 ? iterable[iteratee2 ? collection[index2] : index2] : undefined$1;
        };
      }
      function createFlow(fromRight) {
        return flatRest(function(funcs) {
          var length = funcs.length, index2 = length, prereq = LodashWrapper.prototype.thru;
          if (fromRight) {
            funcs.reverse();
          }
          while (index2--) {
            var func = funcs[index2];
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            if (prereq && !wrapper && getFuncName(func) == "wrapper") {
              var wrapper = new LodashWrapper([], true);
            }
          }
          index2 = wrapper ? index2 : length;
          while (++index2 < length) {
            func = funcs[index2];
            var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined$1;
            if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
            }
          }
          return function() {
            var args = arguments, value2 = args[0];
            if (wrapper && args.length == 1 && isArray(value2)) {
              return wrapper.plant(value2).value();
            }
            var index22 = 0, result2 = length ? funcs[index22].apply(this, args) : value2;
            while (++index22 < length) {
              result2 = funcs[index22].call(this, result2);
            }
            return result2;
          };
        });
      }
      function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
        var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined$1 : createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index2 = length;
          while (index2--) {
            args[index2] = arguments[index2];
          }
          if (isCurried) {
            var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
          }
          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }
          if (partialsRight) {
            args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
          }
          length -= holdersCount;
          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(
              func,
              bitmask,
              createHybrid,
              wrapper.placeholder,
              thisArg,
              args,
              newHolders,
              argPos,
              ary2,
              arity - length
            );
          }
          var thisBinding = isBind ? thisArg : this, fn2 = isBindKey ? thisBinding[func] : func;
          length = args.length;
          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }
          if (isAry && ary2 < length) {
            args.length = ary2;
          }
          if (this && this !== root && this instanceof wrapper) {
            fn2 = Ctor || createCtor(fn2);
          }
          return fn2.apply(thisBinding, args);
        }
        return wrapper;
      }
      function createInverter(setter, toIteratee) {
        return function(object, iteratee2) {
          return baseInverter(object, setter, toIteratee(iteratee2), {});
        };
      }
      function createMathOperation(operator, defaultValue) {
        return function(value2, other) {
          var result2;
          if (value2 === undefined$1 && other === undefined$1) {
            return defaultValue;
          }
          if (value2 !== undefined$1) {
            result2 = value2;
          }
          if (other !== undefined$1) {
            if (result2 === undefined$1) {
              return other;
            }
            if (typeof value2 == "string" || typeof other == "string") {
              value2 = baseToString(value2);
              other = baseToString(other);
            } else {
              value2 = baseToNumber(value2);
              other = baseToNumber(other);
            }
            result2 = operator(value2, other);
          }
          return result2;
        };
      }
      function createOver(arrayFunc) {
        return flatRest(function(iteratees) {
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          return baseRest(function(args) {
            var thisArg = this;
            return arrayFunc(iteratees, function(iteratee2) {
              return apply(iteratee2, thisArg, args);
            });
          });
        });
      }
      function createPadding(length, chars) {
        chars = chars === undefined$1 ? " " : baseToString(chars);
        var charsLength = chars.length;
        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
      }
      function createPartial(func, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn2 = this && this !== root && this instanceof wrapper ? Ctor : func;
          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }
          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }
          return apply(fn2, isBind ? thisArg : this, args);
        }
        return wrapper;
      }
      function createRange(fromRight) {
        return function(start2, end, step) {
          if (step && typeof step != "number" && isIterateeCall(start2, end, step)) {
            end = step = undefined$1;
          }
          start2 = toFinite(start2);
          if (end === undefined$1) {
            end = start2;
            start2 = 0;
          } else {
            end = toFinite(end);
          }
          step = step === undefined$1 ? start2 < end ? 1 : -1 : toFinite(step);
          return baseRange(start2, end, step, fromRight);
        };
      }
      function createRelationalOperation(operator) {
        return function(value2, other) {
          if (!(typeof value2 == "string" && typeof other == "string")) {
            value2 = toNumber(value2);
            other = toNumber(other);
          }
          return operator(value2, other);
        };
      }
      function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
        var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined$1, newHoldersRight = isCurry ? undefined$1 : holders, newPartials = isCurry ? partials : undefined$1, newPartialsRight = isCurry ? undefined$1 : partials;
        bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
        if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
          bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
        }
        var newData = [
          func,
          bitmask,
          thisArg,
          newPartials,
          newHolders,
          newPartialsRight,
          newHoldersRight,
          argPos,
          ary2,
          arity
        ];
        var result2 = wrapFunc.apply(undefined$1, newData);
        if (isLaziable(func)) {
          setData(result2, newData);
        }
        result2.placeholder = placeholder;
        return setWrapToString(result2, func, bitmask);
      }
      function createRound(methodName) {
        var func = Math2[methodName];
        return function(number, precision) {
          number = toNumber(number);
          precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
          if (precision && nativeIsFinite(number)) {
            var pair2 = (toString(number) + "e").split("e"), value2 = func(pair2[0] + "e" + (+pair2[1] + precision));
            pair2 = (toString(value2) + "e").split("e");
            return +(pair2[0] + "e" + (+pair2[1] - precision));
          }
          return func(number);
        };
      }
      var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop2 : function(values2) {
        return new Set2(values2);
      };
      function createToPairs(keysFunc) {
        return function(object) {
          var tag = getTag(object);
          if (tag == mapTag) {
            return mapToArray(object);
          }
          if (tag == setTag) {
            return setToPairs(object);
          }
          return baseToPairs(object, keysFunc(object));
        };
      }
      function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
        if (!isBindKey && typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var length = partials ? partials.length : 0;
        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
          partials = holders = undefined$1;
        }
        ary2 = ary2 === undefined$1 ? ary2 : nativeMax(toInteger(ary2), 0);
        arity = arity === undefined$1 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;
        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
          var partialsRight = partials, holdersRight = holders;
          partials = holders = undefined$1;
        }
        var data = isBindKey ? undefined$1 : getData(func);
        var newData = [
          func,
          bitmask,
          thisArg,
          partials,
          holders,
          partialsRight,
          holdersRight,
          argPos,
          ary2,
          arity
        ];
        if (data) {
          mergeData(newData, data);
        }
        func = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] = newData[9] === undefined$1 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
        if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
          bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
        }
        if (!bitmask || bitmask == WRAP_BIND_FLAG) {
          var result2 = createBind(func, bitmask, thisArg);
        } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
          result2 = createCurry(func, bitmask, arity);
        } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
          result2 = createPartial(func, bitmask, thisArg, partials);
        } else {
          result2 = createHybrid.apply(undefined$1, newData);
        }
        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result2, newData), func, bitmask);
      }
      function customDefaultsAssignIn(objValue, srcValue, key, object) {
        if (objValue === undefined$1 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
          return srcValue;
        }
        return objValue;
      }
      function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
        if (isObject(objValue) && isObject(srcValue)) {
          stack.set(srcValue, objValue);
          baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
          stack["delete"](srcValue);
        }
        return objValue;
      }
      function customOmitClone(value2) {
        return isPlainObject2(value2) ? undefined$1 : value2;
      }
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index2 = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined$1;
        stack.set(array, other);
        stack.set(other, array);
        while (++index2 < arrLength) {
          var arrValue = array[index2], othValue = other[index2];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
          }
          if (compared !== undefined$1) {
            if (compared) {
              continue;
            }
            result2 = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result2 = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result2 = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result2;
      }
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
              return false;
            }
            return true;
          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag:
            return object == other + "";
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;
            stack.set(object, other);
            var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result2;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index2 = objLength;
        while (index2--) {
          var key = objProps[index2];
          if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        var objStacked = stack.get(object);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object;
        }
        var result2 = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index2 < objLength) {
          key = objProps[index2];
          var objValue = object[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === undefined$1 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result2 = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result2 && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result2 = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result2;
      }
      function flatRest(func) {
        return setToString(overRest(func, undefined$1, flatten), func + "");
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }
      var getData = !metaMap ? noop2 : function(func) {
        return metaMap.get(func);
      };
      function getFuncName(func) {
        var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
        while (length--) {
          var data = array[length], otherFunc = data.func;
          if (otherFunc == null || otherFunc == func) {
            return data.name;
          }
        }
        return result2;
      }
      function getHolder(func) {
        var object = hasOwnProperty.call(lodash2, "placeholder") ? lodash2 : func;
        return object.placeholder;
      }
      function getIteratee() {
        var result2 = lodash2.iteratee || iteratee;
        result2 = result2 === iteratee ? baseIteratee : result2;
        return arguments.length ? result2(arguments[0], arguments[1]) : result2;
      }
      function getMapData(map2, key) {
        var data = map2.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getMatchData(object) {
        var result2 = keys(object), length = result2.length;
        while (length--) {
          var key = result2[length], value2 = object[key];
          result2[length] = [key, value2, isStrictComparable(value2)];
        }
        return result2;
      }
      function getNative(object, key) {
        var value2 = getValue(object, key);
        return baseIsNative(value2) ? value2 : undefined$1;
      }
      function getRawTag(value2) {
        var isOwn = hasOwnProperty.call(value2, symToStringTag), tag = value2[symToStringTag];
        try {
          value2[symToStringTag] = undefined$1;
          var unmasked = true;
        } catch (e2) {
        }
        var result2 = nativeObjectToString.call(value2);
        if (unmasked) {
          if (isOwn) {
            value2[symToStringTag] = tag;
          } else {
            delete value2[symToStringTag];
          }
        }
        return result2;
      }
      var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object2(object);
        return arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
        var result2 = [];
        while (object) {
          arrayPush(result2, getSymbols(object));
          object = getPrototype(object);
        }
        return result2;
      };
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
        getTag = function(value2) {
          var result2 = baseGetTag(value2), Ctor = result2 == objectTag ? value2.constructor : undefined$1, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result2;
        };
      }
      function getView(start2, end, transforms) {
        var index2 = -1, length = transforms.length;
        while (++index2 < length) {
          var data = transforms[index2], size2 = data.size;
          switch (data.type) {
            case "drop":
              start2 += size2;
              break;
            case "dropRight":
              end -= size2;
              break;
            case "take":
              end = nativeMin(end, start2 + size2);
              break;
            case "takeRight":
              start2 = nativeMax(start2, end - size2);
              break;
          }
        }
        return { "start": start2, "end": end };
      }
      function getWrapDetails(source) {
        var match = source.match(reWrapDetails);
        return match ? match[1].split(reSplitDetails) : [];
      }
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index2 = -1, length = path.length, result2 = false;
        while (++index2 < length) {
          var key = toKey(path[index2]);
          if (!(result2 = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result2 || ++index2 != length) {
          return result2;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
      }
      function initCloneArray(array) {
        var length = array.length, result2 = new array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
          result2.index = array.index;
          result2.input = array.input;
        }
        return result2;
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);
          case boolTag:
          case dateTag:
            return new Ctor(+object);
          case dataViewTag:
            return cloneDataView(object, isDeep);
          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);
          case mapTag:
            return new Ctor();
          case numberTag:
          case stringTag:
            return new Ctor(object);
          case regexpTag:
            return cloneRegExp(object);
          case setTag:
            return new Ctor();
          case symbolTag:
            return cloneSymbol(object);
        }
      }
      function insertWrapDetails(source, details) {
        var length = details.length;
        if (!length) {
          return source;
        }
        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
        details = details.join(length > 2 ? ", " : " ");
        return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
      }
      function isFlattenable(value2) {
        return isArray(value2) || isArguments(value2) || !!(spreadableSymbol && value2 && value2[spreadableSymbol]);
      }
      function isIndex(value2, length) {
        var type = typeof value2;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value2)) && (value2 > -1 && value2 % 1 == 0 && value2 < length);
      }
      function isIterateeCall(value2, index2, object) {
        if (!isObject(object)) {
          return false;
        }
        var type = typeof index2;
        if (type == "number" ? isArrayLike(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
          return eq(object[index2], value2);
        }
        return false;
      }
      function isKey(value2, object) {
        if (isArray(value2)) {
          return false;
        }
        var type = typeof value2;
        if (type == "number" || type == "symbol" || type == "boolean" || value2 == null || isSymbol(value2)) {
          return true;
        }
        return reIsPlainProp.test(value2) || !reIsDeepProp.test(value2) || object != null && value2 in Object2(object);
      }
      function isKeyable(value2) {
        var type = typeof value2;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value2 !== "__proto__" : value2 === null;
      }
      function isLaziable(func) {
        var funcName = getFuncName(func), other = lodash2[funcName];
        if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
          return false;
        }
        if (func === other) {
          return true;
        }
        var data = getData(other);
        return !!data && func === data[0];
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var isMaskable = coreJsData ? isFunction : stubFalse;
      function isPrototype(value2) {
        var Ctor = value2 && value2.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
        return value2 === proto;
      }
      function isStrictComparable(value2) {
        return value2 === value2 && !isObject(value2);
      }
      function matchesStrictComparable(key, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === srcValue && (srcValue !== undefined$1 || key in Object2(object));
        };
      }
      function memoizeCapped(func) {
        var result2 = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result2.cache;
        return result2;
      }
      function mergeData(data, source) {
        var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
        var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
        if (!(isCommon || isCombo)) {
          return data;
        }
        if (srcBitmask & WRAP_BIND_FLAG) {
          data[2] = source[2];
          newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
        }
        var value2 = source[3];
        if (value2) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value2, source[4]) : value2;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }
        value2 = source[5];
        if (value2) {
          partials = data[5];
          data[5] = partials ? composeArgsRight(partials, value2, source[6]) : value2;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }
        value2 = source[7];
        if (value2) {
          data[7] = value2;
        }
        if (srcBitmask & WRAP_ARY_FLAG) {
          data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
        }
        if (data[9] == null) {
          data[9] = source[9];
        }
        data[0] = source[0];
        data[1] = newBitmask;
        return data;
      }
      function nativeKeysIn(object) {
        var result2 = [];
        if (object != null) {
          for (var key in Object2(object)) {
            result2.push(key);
          }
        }
        return result2;
      }
      function objectToString(value2) {
        return nativeObjectToString.call(value2);
      }
      function overRest(func, start2, transform2) {
        start2 = nativeMax(start2 === undefined$1 ? func.length - 1 : start2, 0);
        return function() {
          var args = arguments, index2 = -1, length = nativeMax(args.length - start2, 0), array = Array2(length);
          while (++index2 < length) {
            array[index2] = args[start2 + index2];
          }
          index2 = -1;
          var otherArgs = Array2(start2 + 1);
          while (++index2 < start2) {
            otherArgs[index2] = args[index2];
          }
          otherArgs[start2] = transform2(array);
          return apply(func, this, otherArgs);
        };
      }
      function parent(object, path) {
        return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
      }
      function reorder(array, indexes) {
        var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
        while (length--) {
          var index2 = indexes[length];
          array[length] = isIndex(index2, arrLength) ? oldArray[index2] : undefined$1;
        }
        return array;
      }
      function safeGet(object, key) {
        if (key === "constructor" && typeof object[key] === "function") {
          return;
        }
        if (key == "__proto__") {
          return;
        }
        return object[key];
      }
      var setData = shortOut(baseSetData);
      var setTimeout2 = ctxSetTimeout || function(func, wait) {
        return root.setTimeout(func, wait);
      };
      var setToString = shortOut(baseSetToString);
      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + "";
        return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
      }
      function shortOut(func) {
        var count = 0, lastCalled = 0;
        return function() {
          var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(undefined$1, arguments);
        };
      }
      function shuffleSelf(array, size2) {
        var index2 = -1, length = array.length, lastIndex = length - 1;
        size2 = size2 === undefined$1 ? length : size2;
        while (++index2 < size2) {
          var rand = baseRandom(index2, lastIndex), value2 = array[rand];
          array[rand] = array[index2];
          array[index2] = value2;
        }
        array.length = size2;
        return array;
      }
      var stringToPath = memoizeCapped(function(string) {
        var result2 = [];
        if (string.charCodeAt(0) === 46) {
          result2.push("");
        }
        string.replace(rePropName, function(match, number, quote, subString) {
          result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result2;
      });
      function toKey(value2) {
        if (typeof value2 == "string" || isSymbol(value2)) {
          return value2;
        }
        var result2 = value2 + "";
        return result2 == "0" && 1 / value2 == -INFINITY ? "-0" : result2;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e2) {
          }
          try {
            return func + "";
          } catch (e2) {
          }
        }
        return "";
      }
      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function(pair2) {
          var value2 = "_." + pair2[0];
          if (bitmask & pair2[1] && !arrayIncludes(details, value2)) {
            details.push(value2);
          }
        });
        return details.sort();
      }
      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }
        var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result2.__actions__ = copyArray(wrapper.__actions__);
        result2.__index__ = wrapper.__index__;
        result2.__values__ = wrapper.__values__;
        return result2;
      }
      function chunk(array, size2, guard) {
        if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined$1) {
          size2 = 1;
        } else {
          size2 = nativeMax(toInteger(size2), 0);
        }
        var length = array == null ? 0 : array.length;
        if (!length || size2 < 1) {
          return [];
        }
        var index2 = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
        while (index2 < length) {
          result2[resIndex++] = baseSlice(array, index2, index2 += size2);
        }
        return result2;
      }
      function compact(array) {
        var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
        while (++index2 < length) {
          var value2 = array[index2];
          if (value2) {
            result2[resIndex++] = value2;
          }
        }
        return result2;
      }
      function concat() {
        var length = arguments.length;
        if (!length) {
          return [];
        }
        var args = Array2(length - 1), array = arguments[0], index2 = length;
        while (index2--) {
          args[index2 - 1] = arguments[index2];
        }
        return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
      }
      var difference = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
      });
      var differenceBy = baseRest(function(array, values2) {
        var iteratee2 = last(values2);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined$1;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
      });
      var differenceWith = baseRest(function(array, values2) {
        var comparator = last(values2);
        if (isArrayLikeObject(comparator)) {
          comparator = undefined$1;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined$1, comparator) : [];
      });
      function drop(array, n2, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
        return baseSlice(array, n2 < 0 ? 0 : n2, length);
      }
      function dropRight(array, n2, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
        n2 = length - n2;
        return baseSlice(array, 0, n2 < 0 ? 0 : n2);
      }
      function dropRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
      }
      function dropWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
      }
      function fill2(array, value2, start2, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (start2 && typeof start2 != "number" && isIterateeCall(array, value2, start2)) {
          start2 = 0;
          end = length;
        }
        return baseFill(array, value2, start2, end);
      }
      function findIndex2(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index2 < 0) {
          index2 = nativeMax(length + index2, 0);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index2);
      }
      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = length - 1;
        if (fromIndex !== undefined$1) {
          index2 = toInteger(fromIndex);
          index2 = fromIndex < 0 ? nativeMax(length + index2, 0) : nativeMin(index2, length - 1);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index2, true);
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }
      function flattenDeep(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, INFINITY) : [];
      }
      function flattenDepth(array, depth) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(array, depth);
      }
      function fromPairs(pairs) {
        var index2 = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
        while (++index2 < length) {
          var pair2 = pairs[index2];
          result2[pair2[0]] = pair2[1];
        }
        return result2;
      }
      function head(array) {
        return array && array.length ? array[0] : undefined$1;
      }
      function indexOf(array, value2, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index2 < 0) {
          index2 = nativeMax(length + index2, 0);
        }
        return baseIndexOf(array, value2, index2);
      }
      function initial(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 0, -1) : [];
      }
      var intersection = baseRest(function(arrays) {
        var mapped = arrayMap(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
      });
      var intersectionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        if (iteratee2 === last(mapped)) {
          iteratee2 = undefined$1;
        } else {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
      });
      var intersectionWith = baseRest(function(arrays) {
        var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        if (comparator) {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined$1, comparator) : [];
      });
      function join(array, separator2) {
        return array == null ? "" : nativeJoin.call(array, separator2);
      }
      function last(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : undefined$1;
      }
      function lastIndexOf(array, value2, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = length;
        if (fromIndex !== undefined$1) {
          index2 = toInteger(fromIndex);
          index2 = index2 < 0 ? nativeMax(length + index2, 0) : nativeMin(index2, length - 1);
        }
        return value2 === value2 ? strictLastIndexOf(array, value2, index2) : baseFindIndex(array, baseIsNaN, index2, true);
      }
      function nth(array, n2) {
        return array && array.length ? baseNth(array, toInteger(n2)) : undefined$1;
      }
      var pull = baseRest(pullAll);
      function pullAll(array, values2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
      }
      function pullAllBy(array, values2, iteratee2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
      }
      function pullAllWith(array, values2, comparator) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined$1, comparator) : array;
      }
      var pullAt = flatRest(function(array, indexes) {
        var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
        basePullAt(array, arrayMap(indexes, function(index2) {
          return isIndex(index2, length) ? +index2 : index2;
        }).sort(compareAscending));
        return result2;
      });
      function remove(array, predicate) {
        var result2 = [];
        if (!(array && array.length)) {
          return result2;
        }
        var index2 = -1, indexes = [], length = array.length;
        predicate = getIteratee(predicate, 3);
        while (++index2 < length) {
          var value2 = array[index2];
          if (predicate(value2, index2, array)) {
            result2.push(value2);
            indexes.push(index2);
          }
        }
        basePullAt(array, indexes);
        return result2;
      }
      function reverse(array) {
        return array == null ? array : nativeReverse.call(array);
      }
      function slice(array, start2, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (end && typeof end != "number" && isIterateeCall(array, start2, end)) {
          start2 = 0;
          end = length;
        } else {
          start2 = start2 == null ? 0 : toInteger(start2);
          end = end === undefined$1 ? length : toInteger(end);
        }
        return baseSlice(array, start2, end);
      }
      function sortedIndex(array, value2) {
        return baseSortedIndex(array, value2);
      }
      function sortedIndexBy(array, value2, iteratee2) {
        return baseSortedIndexBy(array, value2, getIteratee(iteratee2, 2));
      }
      function sortedIndexOf(array, value2) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index2 = baseSortedIndex(array, value2);
          if (index2 < length && eq(array[index2], value2)) {
            return index2;
          }
        }
        return -1;
      }
      function sortedLastIndex(array, value2) {
        return baseSortedIndex(array, value2, true);
      }
      function sortedLastIndexBy(array, value2, iteratee2) {
        return baseSortedIndexBy(array, value2, getIteratee(iteratee2, 2), true);
      }
      function sortedLastIndexOf(array, value2) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index2 = baseSortedIndex(array, value2, true) - 1;
          if (eq(array[index2], value2)) {
            return index2;
          }
        }
        return -1;
      }
      function sortedUniq(array) {
        return array && array.length ? baseSortedUniq(array) : [];
      }
      function sortedUniqBy(array, iteratee2) {
        return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function tail(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 1, length) : [];
      }
      function take(array, n2, guard) {
        if (!(array && array.length)) {
          return [];
        }
        n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
        return baseSlice(array, 0, n2 < 0 ? 0 : n2);
      }
      function takeRight(array, n2, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
        n2 = length - n2;
        return baseSlice(array, n2 < 0 ? 0 : n2, length);
      }
      function takeRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
      }
      function takeWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
      }
      var union = baseRest(function(arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });
      var unionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined$1;
        }
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
      });
      var unionWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
      });
      function uniq(array) {
        return array && array.length ? baseUniq(array) : [];
      }
      function uniqBy(array, iteratee2) {
        return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function uniqWith(array, comparator) {
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        return array && array.length ? baseUniq(array, undefined$1, comparator) : [];
      }
      function unzip(array) {
        if (!(array && array.length)) {
          return [];
        }
        var length = 0;
        array = arrayFilter(array, function(group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function(index2) {
          return arrayMap(array, baseProperty(index2));
        });
      }
      function unzipWith(array, iteratee2) {
        if (!(array && array.length)) {
          return [];
        }
        var result2 = unzip(array);
        if (iteratee2 == null) {
          return result2;
        }
        return arrayMap(result2, function(group) {
          return apply(iteratee2, undefined$1, group);
        });
      }
      var without = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
      });
      var xor = baseRest(function(arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });
      var xorBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined$1;
        }
        return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
      });
      var xorWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
      });
      var zip = baseRest(unzip);
      function zipObject(props, values2) {
        return baseZipObject(props || [], values2 || [], assignValue);
      }
      function zipObjectDeep(props, values2) {
        return baseZipObject(props || [], values2 || [], baseSet);
      }
      var zipWith = baseRest(function(arrays) {
        var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined$1;
        iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined$1;
        return unzipWith(arrays, iteratee2);
      });
      function chain(value2) {
        var result2 = lodash2(value2);
        result2.__chain__ = true;
        return result2;
      }
      function tap(value2, interceptor) {
        interceptor(value2);
        return value2;
      }
      function thru(value2, interceptor) {
        return interceptor(value2);
      }
      var wrapperAt = flatRest(function(paths) {
        var length = paths.length, start2 = length ? paths[0] : 0, value2 = this.__wrapped__, interceptor = function(object) {
          return baseAt(object, paths);
        };
        if (length > 1 || this.__actions__.length || !(value2 instanceof LazyWrapper) || !isIndex(start2)) {
          return this.thru(interceptor);
        }
        value2 = value2.slice(start2, +start2 + (length ? 1 : 0));
        value2.__actions__.push({
          "func": thru,
          "args": [interceptor],
          "thisArg": undefined$1
        });
        return new LodashWrapper(value2, this.__chain__).thru(function(array) {
          if (length && !array.length) {
            array.push(undefined$1);
          }
          return array;
        });
      });
      function wrapperChain() {
        return chain(this);
      }
      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }
      function wrapperNext() {
        if (this.__values__ === undefined$1) {
          this.__values__ = toArray2(this.value());
        }
        var done = this.__index__ >= this.__values__.length, value2 = done ? undefined$1 : this.__values__[this.__index__++];
        return { "done": done, "value": value2 };
      }
      function wrapperToIterator() {
        return this;
      }
      function wrapperPlant(value2) {
        var result2, parent2 = this;
        while (parent2 instanceof baseLodash) {
          var clone2 = wrapperClone(parent2);
          clone2.__index__ = 0;
          clone2.__values__ = undefined$1;
          if (result2) {
            previous.__wrapped__ = clone2;
          } else {
            result2 = clone2;
          }
          var previous = clone2;
          parent2 = parent2.__wrapped__;
        }
        previous.__wrapped__ = value2;
        return result2;
      }
      function wrapperReverse() {
        var value2 = this.__wrapped__;
        if (value2 instanceof LazyWrapper) {
          var wrapped = value2;
          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }
          wrapped = wrapped.reverse();
          wrapped.__actions__.push({
            "func": thru,
            "args": [reverse],
            "thisArg": undefined$1
          });
          return new LodashWrapper(wrapped, this.__chain__);
        }
        return this.thru(reverse);
      }
      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }
      var countBy = createAggregator(function(result2, value2, key) {
        if (hasOwnProperty.call(result2, key)) {
          ++result2[key];
        } else {
          baseAssignValue(result2, key, 1);
        }
      });
      function every(collection, predicate, guard) {
        var func = isArray(collection) ? arrayEvery : baseEvery;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      function filter(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, getIteratee(predicate, 3));
      }
      var find = createFind(findIndex2);
      var findLast = createFind(findLastIndex);
      function flatMap(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), 1);
      }
      function flatMapDeep(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), INFINITY);
      }
      function flatMapDepth(collection, iteratee2, depth) {
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(map(collection, iteratee2), depth);
      }
      function forEach(collection, iteratee2) {
        var func = isArray(collection) ? arrayEach : baseEach;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function forEachRight(collection, iteratee2) {
        var func = isArray(collection) ? arrayEachRight : baseEachRight;
        return func(collection, getIteratee(iteratee2, 3));
      }
      var groupBy = createAggregator(function(result2, value2, key) {
        if (hasOwnProperty.call(result2, key)) {
          result2[key].push(value2);
        } else {
          baseAssignValue(result2, key, [value2]);
        }
      });
      function includes(collection, value2, fromIndex, guard) {
        collection = isArrayLike(collection) ? collection : values(collection);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
        var length = collection.length;
        if (fromIndex < 0) {
          fromIndex = nativeMax(length + fromIndex, 0);
        }
        return isString(collection) ? fromIndex <= length && collection.indexOf(value2, fromIndex) > -1 : !!length && baseIndexOf(collection, value2, fromIndex) > -1;
      }
      var invokeMap = baseRest(function(collection, path, args) {
        var index2 = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value2) {
          result2[++index2] = isFunc ? apply(path, value2, args) : baseInvoke(value2, path, args);
        });
        return result2;
      });
      var keyBy = createAggregator(function(result2, value2, key) {
        baseAssignValue(result2, key, value2);
      });
      function map(collection, iteratee2) {
        var func = isArray(collection) ? arrayMap : baseMap;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function orderBy(collection, iteratees, orders2, guard) {
        if (collection == null) {
          return [];
        }
        if (!isArray(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }
        orders2 = guard ? undefined$1 : orders2;
        if (!isArray(orders2)) {
          orders2 = orders2 == null ? [] : [orders2];
        }
        return baseOrderBy(collection, iteratees, orders2);
      }
      var partition = createAggregator(function(result2, value2, key) {
        result2[key ? 0 : 1].push(value2);
      }, function() {
        return [[], []];
      });
      function reduce(collection, iteratee2, accumulator) {
        var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
      }
      function reduceRight(collection, iteratee2, accumulator) {
        var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
      }
      function reject(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, negate(getIteratee(predicate, 3)));
      }
      function sample(collection) {
        var func = isArray(collection) ? arraySample : baseSample;
        return func(collection);
      }
      function sampleSize(collection, n2, guard) {
        if (guard ? isIterateeCall(collection, n2, guard) : n2 === undefined$1) {
          n2 = 1;
        } else {
          n2 = toInteger(n2);
        }
        var func = isArray(collection) ? arraySampleSize : baseSampleSize;
        return func(collection, n2);
      }
      function shuffle(collection) {
        var func = isArray(collection) ? arrayShuffle : baseShuffle;
        return func(collection);
      }
      function size(collection) {
        if (collection == null) {
          return 0;
        }
        if (isArrayLike(collection)) {
          return isString(collection) ? stringSize(collection) : collection.length;
        }
        var tag = getTag(collection);
        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }
        return baseKeys(collection).length;
      }
      function some(collection, predicate, guard) {
        var func = isArray(collection) ? arraySome : baseSome;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      var sortBy = baseRest(function(collection, iteratees) {
        if (collection == null) {
          return [];
        }
        var length = iteratees.length;
        if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
          iteratees = [];
        } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
          iteratees = [iteratees[0]];
        }
        return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
      });
      var now = ctxNow || function() {
        return root.Date.now();
      };
      function after(n2, func) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n2 = toInteger(n2);
        return function() {
          if (--n2 < 1) {
            return func.apply(this, arguments);
          }
        };
      }
      function ary(func, n2, guard) {
        n2 = guard ? undefined$1 : n2;
        n2 = func && n2 == null ? func.length : n2;
        return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n2);
      }
      function before(n2, func) {
        var result2;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n2 = toInteger(n2);
        return function() {
          if (--n2 > 0) {
            result2 = func.apply(this, arguments);
          }
          if (n2 <= 1) {
            func = undefined$1;
          }
          return result2;
        };
      }
      var bind = baseRest(function(func, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(func, bitmask, thisArg, partials, holders);
      });
      var bindKey = baseRest(function(object, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(key, bitmask, object, partials, holders);
      });
      function curry(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result2.placeholder = curry.placeholder;
        return result2;
      }
      function curryRight(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result2.placeholder = curryRight.placeholder;
        return result2;
      }
      function debounce(func, wait, options) {
        var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = undefined$1;
          lastInvokeTime = time;
          result2 = func.apply(thisArg, args);
          return result2;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout2(timerExpired, wait);
          return leading ? invokeFunc(time) : result2;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === undefined$1 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout2(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = undefined$1;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = undefined$1;
          return result2;
        }
        function cancel() {
          if (timerId !== undefined$1) {
            clearTimeout2(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined$1;
        }
        function flush2() {
          return timerId === undefined$1 ? result2 : trailingEdge(now());
        }
        function debounced() {
          var time = now(), isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === undefined$1) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              clearTimeout2(timerId);
              timerId = setTimeout2(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === undefined$1) {
            timerId = setTimeout2(timerExpired, wait);
          }
          return result2;
        }
        debounced.cancel = cancel;
        debounced.flush = flush2;
        return debounced;
      }
      var defer = baseRest(function(func, args) {
        return baseDelay(func, 1, args);
      });
      var delay = baseRest(function(func, wait, args) {
        return baseDelay(func, toNumber(wait) || 0, args);
      });
      function flip(func) {
        return createWrap(func, WRAP_FLIP_FLAG);
      }
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result2 = func.apply(this, args);
          memoized.cache = cache.set(key, result2) || cache;
          return result2;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      function negate(predicate) {
        if (typeof predicate != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return !predicate.call(this);
            case 1:
              return !predicate.call(this, args[0]);
            case 2:
              return !predicate.call(this, args[0], args[1]);
            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }
          return !predicate.apply(this, args);
        };
      }
      function once2(func) {
        return before(2, func);
      }
      var overArgs = castRest(function(func, transforms) {
        transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
        var funcsLength = transforms.length;
        return baseRest(function(args) {
          var index2 = -1, length = nativeMin(args.length, funcsLength);
          while (++index2 < length) {
            args[index2] = transforms[index2].call(this, args[index2]);
          }
          return apply(func, this, args);
        });
      });
      var partial = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
      });
      var partialRight = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
      });
      var rearg = flatRest(function(func, indexes) {
        return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
      });
      function rest(func, start2) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start2 = start2 === undefined$1 ? start2 : toInteger(start2);
        return baseRest(func, start2);
      }
      function spread(func, start2) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start2 = start2 == null ? 0 : nativeMax(toInteger(start2), 0);
        return baseRest(function(args) {
          var array = args[start2], otherArgs = castSlice(args, 0, start2);
          if (array) {
            arrayPush(otherArgs, array);
          }
          return apply(func, this, otherArgs);
        });
      }
      function throttle(func, wait, options) {
        var leading = true, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        if (isObject(options)) {
          leading = "leading" in options ? !!options.leading : leading;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
          "leading": leading,
          "maxWait": wait,
          "trailing": trailing
        });
      }
      function unary(func) {
        return ary(func, 1);
      }
      function wrap(value2, wrapper) {
        return partial(castFunction(wrapper), value2);
      }
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value2 = arguments[0];
        return isArray(value2) ? value2 : [value2];
      }
      function clone(value2) {
        return baseClone(value2, CLONE_SYMBOLS_FLAG);
      }
      function cloneWith(value2, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return baseClone(value2, CLONE_SYMBOLS_FLAG, customizer);
      }
      function cloneDeep(value2) {
        return baseClone(value2, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
      }
      function cloneDeepWith(value2, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return baseClone(value2, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
      }
      function conformsTo(object, source) {
        return source == null || baseConformsTo(object, source, keys(source));
      }
      function eq(value2, other) {
        return value2 === other || value2 !== value2 && other !== other;
      }
      var gt = createRelationalOperation(baseGt);
      var gte = createRelationalOperation(function(value2, other) {
        return value2 >= other;
      });
      var isArguments = baseIsArguments(function() {
        return arguments;
      }()) ? baseIsArguments : function(value2) {
        return isObjectLike(value2) && hasOwnProperty.call(value2, "callee") && !propertyIsEnumerable.call(value2, "callee");
      };
      var isArray = Array2.isArray;
      var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
      function isArrayLike(value2) {
        return value2 != null && isLength(value2.length) && !isFunction(value2);
      }
      function isArrayLikeObject(value2) {
        return isObjectLike(value2) && isArrayLike(value2);
      }
      function isBoolean2(value2) {
        return value2 === true || value2 === false || isObjectLike(value2) && baseGetTag(value2) == boolTag;
      }
      var isBuffer = nativeIsBuffer || stubFalse;
      var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
      function isElement(value2) {
        return isObjectLike(value2) && value2.nodeType === 1 && !isPlainObject2(value2);
      }
      function isEmpty(value2) {
        if (value2 == null) {
          return true;
        }
        if (isArrayLike(value2) && (isArray(value2) || typeof value2 == "string" || typeof value2.splice == "function" || isBuffer(value2) || isTypedArray(value2) || isArguments(value2))) {
          return !value2.length;
        }
        var tag = getTag(value2);
        if (tag == mapTag || tag == setTag) {
          return !value2.size;
        }
        if (isPrototype(value2)) {
          return !baseKeys(value2).length;
        }
        for (var key in value2) {
          if (hasOwnProperty.call(value2, key)) {
            return false;
          }
        }
        return true;
      }
      function isEqual2(value2, other) {
        return baseIsEqual(value2, other);
      }
      function isEqualWith(value2, other, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        var result2 = customizer ? customizer(value2, other) : undefined$1;
        return result2 === undefined$1 ? baseIsEqual(value2, other, undefined$1, customizer) : !!result2;
      }
      function isError(value2) {
        if (!isObjectLike(value2)) {
          return false;
        }
        var tag = baseGetTag(value2);
        return tag == errorTag || tag == domExcTag || typeof value2.message == "string" && typeof value2.name == "string" && !isPlainObject2(value2);
      }
      function isFinite(value2) {
        return typeof value2 == "number" && nativeIsFinite(value2);
      }
      function isFunction(value2) {
        if (!isObject(value2)) {
          return false;
        }
        var tag = baseGetTag(value2);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      function isInteger(value2) {
        return typeof value2 == "number" && value2 == toInteger(value2);
      }
      function isLength(value2) {
        return typeof value2 == "number" && value2 > -1 && value2 % 1 == 0 && value2 <= MAX_SAFE_INTEGER;
      }
      function isObject(value2) {
        var type = typeof value2;
        return value2 != null && (type == "object" || type == "function");
      }
      function isObjectLike(value2) {
        return value2 != null && typeof value2 == "object";
      }
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      function isMatch(object, source) {
        return object === source || baseIsMatch(object, source, getMatchData(source));
      }
      function isMatchWith(object, source, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return baseIsMatch(object, source, getMatchData(source), customizer);
      }
      function isNaN2(value2) {
        return isNumber2(value2) && value2 != +value2;
      }
      function isNative(value2) {
        if (isMaskable(value2)) {
          throw new Error2(CORE_ERROR_TEXT);
        }
        return baseIsNative(value2);
      }
      function isNull(value2) {
        return value2 === null;
      }
      function isNil(value2) {
        return value2 == null;
      }
      function isNumber2(value2) {
        return typeof value2 == "number" || isObjectLike(value2) && baseGetTag(value2) == numberTag;
      }
      function isPlainObject2(value2) {
        if (!isObjectLike(value2) || baseGetTag(value2) != objectTag) {
          return false;
        }
        var proto = getPrototype(value2);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
      function isSafeInteger(value2) {
        return isInteger(value2) && value2 >= -MAX_SAFE_INTEGER && value2 <= MAX_SAFE_INTEGER;
      }
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      function isString(value2) {
        return typeof value2 == "string" || !isArray(value2) && isObjectLike(value2) && baseGetTag(value2) == stringTag;
      }
      function isSymbol(value2) {
        return typeof value2 == "symbol" || isObjectLike(value2) && baseGetTag(value2) == symbolTag;
      }
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      function isUndefined(value2) {
        return value2 === undefined$1;
      }
      function isWeakMap(value2) {
        return isObjectLike(value2) && getTag(value2) == weakMapTag;
      }
      function isWeakSet(value2) {
        return isObjectLike(value2) && baseGetTag(value2) == weakSetTag;
      }
      var lt = createRelationalOperation(baseLt);
      var lte = createRelationalOperation(function(value2, other) {
        return value2 <= other;
      });
      function toArray2(value2) {
        if (!value2) {
          return [];
        }
        if (isArrayLike(value2)) {
          return isString(value2) ? stringToArray(value2) : copyArray(value2);
        }
        if (symIterator && value2[symIterator]) {
          return iteratorToArray(value2[symIterator]());
        }
        var tag = getTag(value2), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
        return func(value2);
      }
      function toFinite(value2) {
        if (!value2) {
          return value2 === 0 ? value2 : 0;
        }
        value2 = toNumber(value2);
        if (value2 === INFINITY || value2 === -INFINITY) {
          var sign = value2 < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value2 === value2 ? value2 : 0;
      }
      function toInteger(value2) {
        var result2 = toFinite(value2), remainder = result2 % 1;
        return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
      }
      function toLength(value2) {
        return value2 ? baseClamp(toInteger(value2), 0, MAX_ARRAY_LENGTH) : 0;
      }
      function toNumber(value2) {
        if (typeof value2 == "number") {
          return value2;
        }
        if (isSymbol(value2)) {
          return NAN;
        }
        if (isObject(value2)) {
          var other = typeof value2.valueOf == "function" ? value2.valueOf() : value2;
          value2 = isObject(other) ? other + "" : other;
        }
        if (typeof value2 != "string") {
          return value2 === 0 ? value2 : +value2;
        }
        value2 = baseTrim(value2);
        var isBinary = reIsBinary.test(value2);
        return isBinary || reIsOctal.test(value2) ? freeParseInt(value2.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value2) ? NAN : +value2;
      }
      function toPlainObject(value2) {
        return copyObject(value2, keysIn(value2));
      }
      function toSafeInteger(value2) {
        return value2 ? baseClamp(toInteger(value2), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value2 === 0 ? value2 : 0;
      }
      function toString(value2) {
        return value2 == null ? "" : baseToString(value2);
      }
      var assign2 = createAssigner(function(object, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object);
          return;
        }
        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            assignValue(object, key, source[key]);
          }
        }
      });
      var assignIn = createAssigner(function(object, source) {
        copyObject(source, keysIn(source), object);
      });
      var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keysIn(source), object, customizer);
      });
      var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keys(source), object, customizer);
      });
      var at = flatRest(baseAt);
      function create(prototype, properties) {
        var result2 = baseCreate(prototype);
        return properties == null ? result2 : baseAssign(result2, properties);
      }
      var defaults2 = baseRest(function(object, sources) {
        object = Object2(object);
        var index2 = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : undefined$1;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }
        while (++index2 < length) {
          var source = sources[index2];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;
          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value2 = object[key];
            if (value2 === undefined$1 || eq(value2, objectProto[key]) && !hasOwnProperty.call(object, key)) {
              object[key] = source[key];
            }
          }
        }
        return object;
      });
      var defaultsDeep = baseRest(function(args) {
        args.push(undefined$1, customDefaultsMerge);
        return apply(mergeWith, undefined$1, args);
      });
      function findKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
      }
      function findLastKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
      }
      function forIn(object, iteratee2) {
        return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forInRight(object, iteratee2) {
        return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forOwn(object, iteratee2) {
        return object && baseForOwn(object, getIteratee(iteratee2, 3));
      }
      function forOwnRight(object, iteratee2) {
        return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
      }
      function functions(object) {
        return object == null ? [] : baseFunctions(object, keys(object));
      }
      function functionsIn(object) {
        return object == null ? [] : baseFunctions(object, keysIn(object));
      }
      function get(object, path, defaultValue) {
        var result2 = object == null ? undefined$1 : baseGet(object, path);
        return result2 === undefined$1 ? defaultValue : result2;
      }
      function has(object, path) {
        return object != null && hasPath(object, path, baseHas);
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }
      var invert = createInverter(function(result2, value2, key) {
        if (value2 != null && typeof value2.toString != "function") {
          value2 = nativeObjectToString.call(value2);
        }
        result2[value2] = key;
      }, constant(identity));
      var invertBy = createInverter(function(result2, value2, key) {
        if (value2 != null && typeof value2.toString != "function") {
          value2 = nativeObjectToString.call(value2);
        }
        if (hasOwnProperty.call(result2, value2)) {
          result2[value2].push(key);
        } else {
          result2[value2] = [key];
        }
      }, getIteratee);
      var invoke = baseRest(baseInvoke);
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }
      function mapKeys(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value2, key, object2) {
          baseAssignValue(result2, iteratee2(value2, key, object2), value2);
        });
        return result2;
      }
      function mapValues(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value2, key, object2) {
          baseAssignValue(result2, key, iteratee2(value2, key, object2));
        });
        return result2;
      }
      var merge = createAssigner(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
        baseMerge(object, source, srcIndex, customizer);
      });
      var omit = flatRest(function(object, paths) {
        var result2 = {};
        if (object == null) {
          return result2;
        }
        var isDeep = false;
        paths = arrayMap(paths, function(path) {
          path = castPath(path, object);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object, getAllKeysIn(object), result2);
        if (isDeep) {
          result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result2, paths[length]);
        }
        return result2;
      });
      function omitBy(object, predicate) {
        return pickBy(object, negate(getIteratee(predicate)));
      }
      var pick = flatRest(function(object, paths) {
        return object == null ? {} : basePick(object, paths);
      });
      function pickBy(object, predicate) {
        if (object == null) {
          return {};
        }
        var props = arrayMap(getAllKeysIn(object), function(prop) {
          return [prop];
        });
        predicate = getIteratee(predicate);
        return basePickBy(object, props, function(value2, path) {
          return predicate(value2, path[0]);
        });
      }
      function result(object, path, defaultValue) {
        path = castPath(path, object);
        var index2 = -1, length = path.length;
        if (!length) {
          length = 1;
          object = undefined$1;
        }
        while (++index2 < length) {
          var value2 = object == null ? undefined$1 : object[toKey(path[index2])];
          if (value2 === undefined$1) {
            index2 = length;
            value2 = defaultValue;
          }
          object = isFunction(value2) ? value2.call(object) : value2;
        }
        return object;
      }
      function set(object, path, value2) {
        return object == null ? object : baseSet(object, path, value2);
      }
      function setWith(object, path, value2, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return object == null ? object : baseSet(object, path, value2, customizer);
      }
      var toPairs = createToPairs(keys);
      var toPairsIn = createToPairs(keysIn);
      function transform(object, iteratee2, accumulator) {
        var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
        iteratee2 = getIteratee(iteratee2, 4);
        if (accumulator == null) {
          var Ctor = object && object.constructor;
          if (isArrLike) {
            accumulator = isArr ? new Ctor() : [];
          } else if (isObject(object)) {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
          } else {
            accumulator = {};
          }
        }
        (isArrLike ? arrayEach : baseForOwn)(object, function(value2, index2, object2) {
          return iteratee2(accumulator, value2, index2, object2);
        });
        return accumulator;
      }
      function unset(object, path) {
        return object == null ? true : baseUnset(object, path);
      }
      function update2(object, path, updater) {
        return object == null ? object : baseUpdate(object, path, castFunction(updater));
      }
      function updateWith(object, path, updater, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
      }
      function values(object) {
        return object == null ? [] : baseValues(object, keys(object));
      }
      function valuesIn(object) {
        return object == null ? [] : baseValues(object, keysIn(object));
      }
      function clamp2(number, lower, upper) {
        if (upper === undefined$1) {
          upper = lower;
          lower = undefined$1;
        }
        if (upper !== undefined$1) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== undefined$1) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number), lower, upper);
      }
      function inRange(number, start2, end) {
        start2 = toFinite(start2);
        if (end === undefined$1) {
          end = start2;
          start2 = 0;
        } else {
          end = toFinite(end);
        }
        number = toNumber(number);
        return baseInRange(number, start2, end);
      }
      function random(lower, upper, floating) {
        if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
          upper = floating = undefined$1;
        }
        if (floating === undefined$1) {
          if (typeof upper == "boolean") {
            floating = upper;
            upper = undefined$1;
          } else if (typeof lower == "boolean") {
            floating = lower;
            lower = undefined$1;
          }
        }
        if (lower === undefined$1 && upper === undefined$1) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);
          if (upper === undefined$1) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }
        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }
        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
        }
        return baseRandom(lower, upper);
      }
      var camelCase = createCompounder(function(result2, word, index2) {
        word = word.toLowerCase();
        return result2 + (index2 ? capitalize(word) : word);
      });
      function capitalize(string) {
        return upperFirst(toString(string).toLowerCase());
      }
      function deburr(string) {
        string = toString(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
      }
      function endsWith(string, target2, position) {
        string = toString(string);
        target2 = baseToString(target2);
        var length = string.length;
        position = position === undefined$1 ? length : baseClamp(toInteger(position), 0, length);
        var end = position;
        position -= target2.length;
        return position >= 0 && string.slice(position, end) == target2;
      }
      function escape2(string) {
        string = toString(string);
        return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
      }
      function escapeRegExp(string) {
        string = toString(string);
        return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
      }
      var kebabCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? "-" : "") + word.toLowerCase();
      });
      var lowerCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? " " : "") + word.toLowerCase();
      });
      var lowerFirst = createCaseFirst("toLowerCase");
      function pad(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        if (!length || strLength >= length) {
          return string;
        }
        var mid = (length - strLength) / 2;
        return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
      }
      function padEnd(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
      }
      function padStart(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
      }
      function parseInt2(string, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
      }
      function repeat(string, n2, guard) {
        if (guard ? isIterateeCall(string, n2, guard) : n2 === undefined$1) {
          n2 = 1;
        } else {
          n2 = toInteger(n2);
        }
        return baseRepeat(toString(string), n2);
      }
      function replace() {
        var args = arguments, string = toString(args[0]);
        return args.length < 3 ? string : string.replace(args[1], args[2]);
      }
      var snakeCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? "_" : "") + word.toLowerCase();
      });
      function split(string, separator2, limit) {
        if (limit && typeof limit != "number" && isIterateeCall(string, separator2, limit)) {
          separator2 = limit = undefined$1;
        }
        limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
        if (!limit) {
          return [];
        }
        string = toString(string);
        if (string && (typeof separator2 == "string" || separator2 != null && !isRegExp(separator2))) {
          separator2 = baseToString(separator2);
          if (!separator2 && hasUnicode(string)) {
            return castSlice(stringToArray(string), 0, limit);
          }
        }
        return string.split(separator2, limit);
      }
      var startCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? " " : "") + upperFirst(word);
      });
      function startsWith(string, target2, position) {
        string = toString(string);
        position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
        target2 = baseToString(target2);
        return string.slice(position, position + target2.length) == target2;
      }
      function template(string, options, guard) {
        var settings = lodash2.templateSettings;
        if (guard && isIterateeCall(string, options, guard)) {
          options = undefined$1;
        }
        string = toString(string);
        options = assignInWith({}, options, settings, customDefaultsAssignIn);
        var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
        var isEscaping, isEvaluating, index2 = 0, interpolate2 = options.interpolate || reNoMatch, source = "__p += '";
        var reDelimiters = RegExp2(
          (options.escape || reNoMatch).source + "|" + interpolate2.source + "|" + (interpolate2 === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
          "g"
        );
        var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
        string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += string.slice(index2, offset).replace(reUnescapedString, escapeStringChar);
          if (escapeValue) {
            isEscaping = true;
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }
          if (interpolateValue) {
            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
          }
          index2 = offset + match.length;
          return match;
        });
        source += "';\n";
        var variable = hasOwnProperty.call(options, "variable") && options.variable;
        if (!variable) {
          source = "with (obj) {\n" + source + "\n}\n";
        } else if (reForbiddenIdentifierChars.test(variable)) {
          throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
        source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
        var result2 = attempt(function() {
          return Function2(importsKeys, sourceURL + "return " + source).apply(undefined$1, importsValues);
        });
        result2.source = source;
        if (isError(result2)) {
          throw result2;
        }
        return result2;
      }
      function toLower(value2) {
        return toString(value2).toLowerCase();
      }
      function toUpper(value2) {
        return toString(value2).toUpperCase();
      }
      function trim(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return baseTrim(string);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start2 = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start2, end).join("");
      }
      function trimEnd(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return string.slice(0, trimmedEndIndex(string) + 1);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
        return castSlice(strSymbols, 0, end).join("");
      }
      function trimStart(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrimStart, "");
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), start2 = charsStartIndex(strSymbols, stringToArray(chars));
        return castSlice(strSymbols, start2).join("");
      }
      function truncate(string, options) {
        var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
        if (isObject(options)) {
          var separator2 = "separator" in options ? options.separator : separator2;
          length = "length" in options ? toInteger(options.length) : length;
          omission = "omission" in options ? baseToString(options.omission) : omission;
        }
        string = toString(string);
        var strLength = string.length;
        if (hasUnicode(string)) {
          var strSymbols = stringToArray(string);
          strLength = strSymbols.length;
        }
        if (length >= strLength) {
          return string;
        }
        var end = length - stringSize(omission);
        if (end < 1) {
          return omission;
        }
        var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
        if (separator2 === undefined$1) {
          return result2 + omission;
        }
        if (strSymbols) {
          end += result2.length - end;
        }
        if (isRegExp(separator2)) {
          if (string.slice(end).search(separator2)) {
            var match, substring = result2;
            if (!separator2.global) {
              separator2 = RegExp2(separator2.source, toString(reFlags.exec(separator2)) + "g");
            }
            separator2.lastIndex = 0;
            while (match = separator2.exec(substring)) {
              var newEnd = match.index;
            }
            result2 = result2.slice(0, newEnd === undefined$1 ? end : newEnd);
          }
        } else if (string.indexOf(baseToString(separator2), end) != end) {
          var index2 = result2.lastIndexOf(separator2);
          if (index2 > -1) {
            result2 = result2.slice(0, index2);
          }
        }
        return result2 + omission;
      }
      function unescape(string) {
        string = toString(string);
        return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
      }
      var upperCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? " " : "") + word.toUpperCase();
      });
      var upperFirst = createCaseFirst("toUpperCase");
      function words(string, pattern, guard) {
        string = toString(string);
        pattern = guard ? undefined$1 : pattern;
        if (pattern === undefined$1) {
          return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }
        return string.match(pattern) || [];
      }
      var attempt = baseRest(function(func, args) {
        try {
          return apply(func, undefined$1, args);
        } catch (e2) {
          return isError(e2) ? e2 : new Error2(e2);
        }
      });
      var bindAll = flatRest(function(object, methodNames) {
        arrayEach(methodNames, function(key) {
          key = toKey(key);
          baseAssignValue(object, key, bind(object[key], object));
        });
        return object;
      });
      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
        pairs = !length ? [] : arrayMap(pairs, function(pair2) {
          if (typeof pair2[1] != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return [toIteratee(pair2[0]), pair2[1]];
        });
        return baseRest(function(args) {
          var index2 = -1;
          while (++index2 < length) {
            var pair2 = pairs[index2];
            if (apply(pair2[0], this, args)) {
              return apply(pair2[1], this, args);
            }
          }
        });
      }
      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
      }
      function constant(value2) {
        return function() {
          return value2;
        };
      }
      function defaultTo(value2, defaultValue) {
        return value2 == null || value2 !== value2 ? defaultValue : value2;
      }
      var flow = createFlow();
      var flowRight = createFlow(true);
      function identity(value2) {
        return value2;
      }
      function iteratee(func) {
        return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
      }
      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
      }
      function matchesProperty(path, srcValue) {
        return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
      }
      var method = baseRest(function(path, args) {
        return function(object) {
          return baseInvoke(object, path, args);
        };
      });
      var methodOf = baseRest(function(object, args) {
        return function(path) {
          return baseInvoke(object, path, args);
        };
      });
      function mixin(object, source, options) {
        var props = keys(source), methodNames = baseFunctions(source, props);
        if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
          options = source;
          source = object;
          object = this;
          methodNames = baseFunctions(source, keys(source));
        }
        var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
        arrayEach(methodNames, function(methodName) {
          var func = source[methodName];
          object[methodName] = func;
          if (isFunc) {
            object.prototype[methodName] = function() {
              var chainAll = this.__chain__;
              if (chain2 || chainAll) {
                var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                actions.push({ "func": func, "args": arguments, "thisArg": object });
                result2.__chain__ = chainAll;
                return result2;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }
        });
        return object;
      }
      function noConflict() {
        if (root._ === this) {
          root._ = oldDash;
        }
        return this;
      }
      function noop2() {
      }
      function nthArg(n2) {
        n2 = toInteger(n2);
        return baseRest(function(args) {
          return baseNth(args, n2);
        });
      }
      var over = createOver(arrayMap);
      var overEvery = createOver(arrayEvery);
      var overSome = createOver(arraySome);
      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }
      function propertyOf(object) {
        return function(path) {
          return object == null ? undefined$1 : baseGet(object, path);
        };
      }
      var range = createRange();
      var rangeRight = createRange(true);
      function stubArray() {
        return [];
      }
      function stubFalse() {
        return false;
      }
      function stubObject() {
        return {};
      }
      function stubString() {
        return "";
      }
      function stubTrue() {
        return true;
      }
      function times(n2, iteratee2) {
        n2 = toInteger(n2);
        if (n2 < 1 || n2 > MAX_SAFE_INTEGER) {
          return [];
        }
        var index2 = MAX_ARRAY_LENGTH, length = nativeMin(n2, MAX_ARRAY_LENGTH);
        iteratee2 = getIteratee(iteratee2);
        n2 -= MAX_ARRAY_LENGTH;
        var result2 = baseTimes(length, iteratee2);
        while (++index2 < n2) {
          iteratee2(index2);
        }
        return result2;
      }
      function toPath(value2) {
        if (isArray(value2)) {
          return arrayMap(value2, toKey);
        }
        return isSymbol(value2) ? [value2] : copyArray(stringToPath(toString(value2)));
      }
      function uniqueId(prefix2) {
        var id2 = ++idCounter;
        return toString(prefix2) + id2;
      }
      var add = createMathOperation(function(augend, addend) {
        return augend + addend;
      }, 0);
      var ceil = createRound("ceil");
      var divide = createMathOperation(function(dividend, divisor) {
        return dividend / divisor;
      }, 1);
      var floor = createRound("floor");
      function max(array) {
        return array && array.length ? baseExtremum(array, identity, baseGt) : undefined$1;
      }
      function maxBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined$1;
      }
      function mean(array) {
        return baseMean(array, identity);
      }
      function meanBy(array, iteratee2) {
        return baseMean(array, getIteratee(iteratee2, 2));
      }
      function min(array) {
        return array && array.length ? baseExtremum(array, identity, baseLt) : undefined$1;
      }
      function minBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined$1;
      }
      var multiply = createMathOperation(function(multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);
      var round = createRound("round");
      var subtract = createMathOperation(function(minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);
      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }
      function sumBy(array, iteratee2) {
        return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
      }
      lodash2.after = after;
      lodash2.ary = ary;
      lodash2.assign = assign2;
      lodash2.assignIn = assignIn;
      lodash2.assignInWith = assignInWith;
      lodash2.assignWith = assignWith;
      lodash2.at = at;
      lodash2.before = before;
      lodash2.bind = bind;
      lodash2.bindAll = bindAll;
      lodash2.bindKey = bindKey;
      lodash2.castArray = castArray;
      lodash2.chain = chain;
      lodash2.chunk = chunk;
      lodash2.compact = compact;
      lodash2.concat = concat;
      lodash2.cond = cond;
      lodash2.conforms = conforms;
      lodash2.constant = constant;
      lodash2.countBy = countBy;
      lodash2.create = create;
      lodash2.curry = curry;
      lodash2.curryRight = curryRight;
      lodash2.debounce = debounce;
      lodash2.defaults = defaults2;
      lodash2.defaultsDeep = defaultsDeep;
      lodash2.defer = defer;
      lodash2.delay = delay;
      lodash2.difference = difference;
      lodash2.differenceBy = differenceBy;
      lodash2.differenceWith = differenceWith;
      lodash2.drop = drop;
      lodash2.dropRight = dropRight;
      lodash2.dropRightWhile = dropRightWhile;
      lodash2.dropWhile = dropWhile;
      lodash2.fill = fill2;
      lodash2.filter = filter;
      lodash2.flatMap = flatMap;
      lodash2.flatMapDeep = flatMapDeep;
      lodash2.flatMapDepth = flatMapDepth;
      lodash2.flatten = flatten;
      lodash2.flattenDeep = flattenDeep;
      lodash2.flattenDepth = flattenDepth;
      lodash2.flip = flip;
      lodash2.flow = flow;
      lodash2.flowRight = flowRight;
      lodash2.fromPairs = fromPairs;
      lodash2.functions = functions;
      lodash2.functionsIn = functionsIn;
      lodash2.groupBy = groupBy;
      lodash2.initial = initial;
      lodash2.intersection = intersection;
      lodash2.intersectionBy = intersectionBy;
      lodash2.intersectionWith = intersectionWith;
      lodash2.invert = invert;
      lodash2.invertBy = invertBy;
      lodash2.invokeMap = invokeMap;
      lodash2.iteratee = iteratee;
      lodash2.keyBy = keyBy;
      lodash2.keys = keys;
      lodash2.keysIn = keysIn;
      lodash2.map = map;
      lodash2.mapKeys = mapKeys;
      lodash2.mapValues = mapValues;
      lodash2.matches = matches;
      lodash2.matchesProperty = matchesProperty;
      lodash2.memoize = memoize;
      lodash2.merge = merge;
      lodash2.mergeWith = mergeWith;
      lodash2.method = method;
      lodash2.methodOf = methodOf;
      lodash2.mixin = mixin;
      lodash2.negate = negate;
      lodash2.nthArg = nthArg;
      lodash2.omit = omit;
      lodash2.omitBy = omitBy;
      lodash2.once = once2;
      lodash2.orderBy = orderBy;
      lodash2.over = over;
      lodash2.overArgs = overArgs;
      lodash2.overEvery = overEvery;
      lodash2.overSome = overSome;
      lodash2.partial = partial;
      lodash2.partialRight = partialRight;
      lodash2.partition = partition;
      lodash2.pick = pick;
      lodash2.pickBy = pickBy;
      lodash2.property = property;
      lodash2.propertyOf = propertyOf;
      lodash2.pull = pull;
      lodash2.pullAll = pullAll;
      lodash2.pullAllBy = pullAllBy;
      lodash2.pullAllWith = pullAllWith;
      lodash2.pullAt = pullAt;
      lodash2.range = range;
      lodash2.rangeRight = rangeRight;
      lodash2.rearg = rearg;
      lodash2.reject = reject;
      lodash2.remove = remove;
      lodash2.rest = rest;
      lodash2.reverse = reverse;
      lodash2.sampleSize = sampleSize;
      lodash2.set = set;
      lodash2.setWith = setWith;
      lodash2.shuffle = shuffle;
      lodash2.slice = slice;
      lodash2.sortBy = sortBy;
      lodash2.sortedUniq = sortedUniq;
      lodash2.sortedUniqBy = sortedUniqBy;
      lodash2.split = split;
      lodash2.spread = spread;
      lodash2.tail = tail;
      lodash2.take = take;
      lodash2.takeRight = takeRight;
      lodash2.takeRightWhile = takeRightWhile;
      lodash2.takeWhile = takeWhile;
      lodash2.tap = tap;
      lodash2.throttle = throttle;
      lodash2.thru = thru;
      lodash2.toArray = toArray2;
      lodash2.toPairs = toPairs;
      lodash2.toPairsIn = toPairsIn;
      lodash2.toPath = toPath;
      lodash2.toPlainObject = toPlainObject;
      lodash2.transform = transform;
      lodash2.unary = unary;
      lodash2.union = union;
      lodash2.unionBy = unionBy;
      lodash2.unionWith = unionWith;
      lodash2.uniq = uniq;
      lodash2.uniqBy = uniqBy;
      lodash2.uniqWith = uniqWith;
      lodash2.unset = unset;
      lodash2.unzip = unzip;
      lodash2.unzipWith = unzipWith;
      lodash2.update = update2;
      lodash2.updateWith = updateWith;
      lodash2.values = values;
      lodash2.valuesIn = valuesIn;
      lodash2.without = without;
      lodash2.words = words;
      lodash2.wrap = wrap;
      lodash2.xor = xor;
      lodash2.xorBy = xorBy;
      lodash2.xorWith = xorWith;
      lodash2.zip = zip;
      lodash2.zipObject = zipObject;
      lodash2.zipObjectDeep = zipObjectDeep;
      lodash2.zipWith = zipWith;
      lodash2.entries = toPairs;
      lodash2.entriesIn = toPairsIn;
      lodash2.extend = assignIn;
      lodash2.extendWith = assignInWith;
      mixin(lodash2, lodash2);
      lodash2.add = add;
      lodash2.attempt = attempt;
      lodash2.camelCase = camelCase;
      lodash2.capitalize = capitalize;
      lodash2.ceil = ceil;
      lodash2.clamp = clamp2;
      lodash2.clone = clone;
      lodash2.cloneDeep = cloneDeep;
      lodash2.cloneDeepWith = cloneDeepWith;
      lodash2.cloneWith = cloneWith;
      lodash2.conformsTo = conformsTo;
      lodash2.deburr = deburr;
      lodash2.defaultTo = defaultTo;
      lodash2.divide = divide;
      lodash2.endsWith = endsWith;
      lodash2.eq = eq;
      lodash2.escape = escape2;
      lodash2.escapeRegExp = escapeRegExp;
      lodash2.every = every;
      lodash2.find = find;
      lodash2.findIndex = findIndex2;
      lodash2.findKey = findKey;
      lodash2.findLast = findLast;
      lodash2.findLastIndex = findLastIndex;
      lodash2.findLastKey = findLastKey;
      lodash2.floor = floor;
      lodash2.forEach = forEach;
      lodash2.forEachRight = forEachRight;
      lodash2.forIn = forIn;
      lodash2.forInRight = forInRight;
      lodash2.forOwn = forOwn;
      lodash2.forOwnRight = forOwnRight;
      lodash2.get = get;
      lodash2.gt = gt;
      lodash2.gte = gte;
      lodash2.has = has;
      lodash2.hasIn = hasIn;
      lodash2.head = head;
      lodash2.identity = identity;
      lodash2.includes = includes;
      lodash2.indexOf = indexOf;
      lodash2.inRange = inRange;
      lodash2.invoke = invoke;
      lodash2.isArguments = isArguments;
      lodash2.isArray = isArray;
      lodash2.isArrayBuffer = isArrayBuffer;
      lodash2.isArrayLike = isArrayLike;
      lodash2.isArrayLikeObject = isArrayLikeObject;
      lodash2.isBoolean = isBoolean2;
      lodash2.isBuffer = isBuffer;
      lodash2.isDate = isDate;
      lodash2.isElement = isElement;
      lodash2.isEmpty = isEmpty;
      lodash2.isEqual = isEqual2;
      lodash2.isEqualWith = isEqualWith;
      lodash2.isError = isError;
      lodash2.isFinite = isFinite;
      lodash2.isFunction = isFunction;
      lodash2.isInteger = isInteger;
      lodash2.isLength = isLength;
      lodash2.isMap = isMap;
      lodash2.isMatch = isMatch;
      lodash2.isMatchWith = isMatchWith;
      lodash2.isNaN = isNaN2;
      lodash2.isNative = isNative;
      lodash2.isNil = isNil;
      lodash2.isNull = isNull;
      lodash2.isNumber = isNumber2;
      lodash2.isObject = isObject;
      lodash2.isObjectLike = isObjectLike;
      lodash2.isPlainObject = isPlainObject2;
      lodash2.isRegExp = isRegExp;
      lodash2.isSafeInteger = isSafeInteger;
      lodash2.isSet = isSet;
      lodash2.isString = isString;
      lodash2.isSymbol = isSymbol;
      lodash2.isTypedArray = isTypedArray;
      lodash2.isUndefined = isUndefined;
      lodash2.isWeakMap = isWeakMap;
      lodash2.isWeakSet = isWeakSet;
      lodash2.join = join;
      lodash2.kebabCase = kebabCase;
      lodash2.last = last;
      lodash2.lastIndexOf = lastIndexOf;
      lodash2.lowerCase = lowerCase;
      lodash2.lowerFirst = lowerFirst;
      lodash2.lt = lt;
      lodash2.lte = lte;
      lodash2.max = max;
      lodash2.maxBy = maxBy;
      lodash2.mean = mean;
      lodash2.meanBy = meanBy;
      lodash2.min = min;
      lodash2.minBy = minBy;
      lodash2.stubArray = stubArray;
      lodash2.stubFalse = stubFalse;
      lodash2.stubObject = stubObject;
      lodash2.stubString = stubString;
      lodash2.stubTrue = stubTrue;
      lodash2.multiply = multiply;
      lodash2.nth = nth;
      lodash2.noConflict = noConflict;
      lodash2.noop = noop2;
      lodash2.now = now;
      lodash2.pad = pad;
      lodash2.padEnd = padEnd;
      lodash2.padStart = padStart;
      lodash2.parseInt = parseInt2;
      lodash2.random = random;
      lodash2.reduce = reduce;
      lodash2.reduceRight = reduceRight;
      lodash2.repeat = repeat;
      lodash2.replace = replace;
      lodash2.result = result;
      lodash2.round = round;
      lodash2.runInContext = runInContext2;
      lodash2.sample = sample;
      lodash2.size = size;
      lodash2.snakeCase = snakeCase;
      lodash2.some = some;
      lodash2.sortedIndex = sortedIndex;
      lodash2.sortedIndexBy = sortedIndexBy;
      lodash2.sortedIndexOf = sortedIndexOf;
      lodash2.sortedLastIndex = sortedLastIndex;
      lodash2.sortedLastIndexBy = sortedLastIndexBy;
      lodash2.sortedLastIndexOf = sortedLastIndexOf;
      lodash2.startCase = startCase;
      lodash2.startsWith = startsWith;
      lodash2.subtract = subtract;
      lodash2.sum = sum;
      lodash2.sumBy = sumBy;
      lodash2.template = template;
      lodash2.times = times;
      lodash2.toFinite = toFinite;
      lodash2.toInteger = toInteger;
      lodash2.toLength = toLength;
      lodash2.toLower = toLower;
      lodash2.toNumber = toNumber;
      lodash2.toSafeInteger = toSafeInteger;
      lodash2.toString = toString;
      lodash2.toUpper = toUpper;
      lodash2.trim = trim;
      lodash2.trimEnd = trimEnd;
      lodash2.trimStart = trimStart;
      lodash2.truncate = truncate;
      lodash2.unescape = unescape;
      lodash2.uniqueId = uniqueId;
      lodash2.upperCase = upperCase;
      lodash2.upperFirst = upperFirst;
      lodash2.each = forEach;
      lodash2.eachRight = forEachRight;
      lodash2.first = head;
      mixin(lodash2, function() {
        var source = {};
        baseForOwn(lodash2, function(func, methodName) {
          if (!hasOwnProperty.call(lodash2.prototype, methodName)) {
            source[methodName] = func;
          }
        });
        return source;
      }(), { "chain": false });
      lodash2.VERSION = VERSION;
      arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
        lodash2[methodName].placeholder = lodash2;
      });
      arrayEach(["drop", "take"], function(methodName, index2) {
        LazyWrapper.prototype[methodName] = function(n2) {
          n2 = n2 === undefined$1 ? 1 : nativeMax(toInteger(n2), 0);
          var result2 = this.__filtered__ && !index2 ? new LazyWrapper(this) : this.clone();
          if (result2.__filtered__) {
            result2.__takeCount__ = nativeMin(n2, result2.__takeCount__);
          } else {
            result2.__views__.push({
              "size": nativeMin(n2, MAX_ARRAY_LENGTH),
              "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
            });
          }
          return result2;
        };
        LazyWrapper.prototype[methodName + "Right"] = function(n2) {
          return this.reverse()[methodName](n2).reverse();
        };
      });
      arrayEach(["filter", "map", "takeWhile"], function(methodName, index2) {
        var type = index2 + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
        LazyWrapper.prototype[methodName] = function(iteratee2) {
          var result2 = this.clone();
          result2.__iteratees__.push({
            "iteratee": getIteratee(iteratee2, 3),
            "type": type
          });
          result2.__filtered__ = result2.__filtered__ || isFilter;
          return result2;
        };
      });
      arrayEach(["head", "last"], function(methodName, index2) {
        var takeName = "take" + (index2 ? "Right" : "");
        LazyWrapper.prototype[methodName] = function() {
          return this[takeName](1).value()[0];
        };
      });
      arrayEach(["initial", "tail"], function(methodName, index2) {
        var dropName = "drop" + (index2 ? "" : "Right");
        LazyWrapper.prototype[methodName] = function() {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });
      LazyWrapper.prototype.compact = function() {
        return this.filter(identity);
      };
      LazyWrapper.prototype.find = function(predicate) {
        return this.filter(predicate).head();
      };
      LazyWrapper.prototype.findLast = function(predicate) {
        return this.reverse().find(predicate);
      };
      LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
        if (typeof path == "function") {
          return new LazyWrapper(this);
        }
        return this.map(function(value2) {
          return baseInvoke(value2, path, args);
        });
      });
      LazyWrapper.prototype.reject = function(predicate) {
        return this.filter(negate(getIteratee(predicate)));
      };
      LazyWrapper.prototype.slice = function(start2, end) {
        start2 = toInteger(start2);
        var result2 = this;
        if (result2.__filtered__ && (start2 > 0 || end < 0)) {
          return new LazyWrapper(result2);
        }
        if (start2 < 0) {
          result2 = result2.takeRight(-start2);
        } else if (start2) {
          result2 = result2.drop(start2);
        }
        if (end !== undefined$1) {
          end = toInteger(end);
          result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start2);
        }
        return result2;
      };
      LazyWrapper.prototype.takeRightWhile = function(predicate) {
        return this.reverse().takeWhile(predicate).reverse();
      };
      LazyWrapper.prototype.toArray = function() {
        return this.take(MAX_ARRAY_LENGTH);
      };
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash2[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
        if (!lodashFunc) {
          return;
        }
        lodash2.prototype[methodName] = function() {
          var value2 = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value2 instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value2);
          var interceptor = function(value3) {
            var result3 = lodashFunc.apply(lodash2, arrayPush([value3], args));
            return isTaker && chainAll ? result3[0] : result3;
          };
          if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
            isLazy = useLazy = false;
          }
          var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
          if (!retUnwrapped && useLazy) {
            value2 = onlyLazy ? value2 : new LazyWrapper(this);
            var result2 = func.apply(value2, args);
            result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined$1 });
            return new LodashWrapper(result2, chainAll);
          }
          if (isUnwrapped && onlyLazy) {
            return func.apply(this, args);
          }
          result2 = this.thru(interceptor);
          return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
        };
      });
      arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
        var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
        lodash2.prototype[methodName] = function() {
          var args = arguments;
          if (retUnwrapped && !this.__chain__) {
            var value2 = this.value();
            return func.apply(isArray(value2) ? value2 : [], args);
          }
          return this[chainName](function(value3) {
            return func.apply(isArray(value3) ? value3 : [], args);
          });
        };
      });
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var lodashFunc = lodash2[methodName];
        if (lodashFunc) {
          var key = lodashFunc.name + "";
          if (!hasOwnProperty.call(realNames, key)) {
            realNames[key] = [];
          }
          realNames[key].push({ "name": methodName, "func": lodashFunc });
        }
      });
      realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
        "name": "wrapper",
        "func": undefined$1
      }];
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;
      lodash2.prototype.at = wrapperAt;
      lodash2.prototype.chain = wrapperChain;
      lodash2.prototype.commit = wrapperCommit;
      lodash2.prototype.next = wrapperNext;
      lodash2.prototype.plant = wrapperPlant;
      lodash2.prototype.reverse = wrapperReverse;
      lodash2.prototype.toJSON = lodash2.prototype.valueOf = lodash2.prototype.value = wrapperValue;
      lodash2.prototype.first = lodash2.prototype.head;
      if (symIterator) {
        lodash2.prototype[symIterator] = wrapperToIterator;
      }
      return lodash2;
    };
    var _2 = runInContext();
    if (freeModule) {
      (freeModule.exports = _2)._ = _2;
      freeExports._ = _2;
    } else {
      root._ = _2;
    }
  }).call(commonjsGlobal);
})(lodash, lodash.exports);
var lodashExports = lodash.exports;
const messageSlice = createSlice({
  name: "messages",
  initialState: [],
  reducers: {
    addMessage: {
      reducer(messages2, action) {
        const newMessages = [...messages2];
        if (messages2.length > 0 && areMessagesEqual(messages2[messages2.length - 1], action.payload)) {
          newMessages[newMessages.length - 1] = {
            ...messages2[messages2.length - 1],
            id: action.payload.id,
            count: messages2[messages2.length - 1].count + 1
          };
        } else {
          newMessages.push(action.payload);
        }
        return newMessages;
      },
      prepare(message2) {
        return {
          payload: {
            id: nanoid$2(),
            count: 1,
            ...message2
          }
        };
      }
    },
    clearMessages: () => {
      return [];
    }
  }
});
function areMessagesEqual(message2, adapter) {
  if (message2.board == adapter.board && message2.kind == adapter.kind && message2.name == adapter.name) {
    if (message2.kind == "info" && adapter.kind == "info") {
      return message2.msg == adapter.msg;
    } else if (message2.kind != "info" && adapter.kind != "info") {
      return lodashExports.isEqual(message2.protection, adapter.protection);
    } else {
      return false;
    }
  }
  return false;
}
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    boards: []
  },
  reducers: {
    setOrders: (_2, action) => {
      return action.payload;
    },
    updateStateOrders: (state2, action) => {
      Object.entries(action.payload).forEach(([name2, ids]) => {
        const index2 = state2.boards.findIndex((board2) => board2.name == name2);
        if (index2 == -1) {
          return;
        }
        state2.boards[index2].stateOrders = state2.boards[index2].stateOrders.map((item) => {
          return {
            ...item,
            enabled: ids.includes(item.id)
          };
        });
      });
    }
  }
});
const connectionsSlice$1 = createSlice({
  name: "connections",
  initialState: {
    websocket: { name: "Backend WebSocket", isConnected: false },
    boards: []
  },
  reducers: {
    setWebSocketConnection: (connections, action) => {
      connections.websocket.isConnected = action.payload;
      if (!action.payload) {
        connections.boards.forEach((board2) => {
          board2.isConnected = false;
        });
      }
    },
    updateBoardConnections: (connections, action) => {
      for (const update2 of action.payload) {
        const connIndex = connections.boards.findIndex((conn) => conn.name == update2.name);
        if (connIndex != -1) {
          connections.boards[connIndex].isConnected = update2.isConnected;
        } else {
          connections.boards.push({
            name: update2.name,
            isConnected: update2.isConnected
          });
        }
      }
    }
  }
});
const colorfulChart = "_colorfulChart_1r2dq_1";
const body = "_body_1r2dq_8";
const styles$C$1 = {
  colorfulChart,
  body
};
const legend = "_legend_1unjq_1";
const styles$B$1 = {
  legend
};
const legendItem = "_legendItem_1xgh4_1";
const name$4$1 = "_name_1xgh4_9";
const value$2$1 = "_value_1xgh4_17";
const styles$A$1 = {
  legendItem,
  name: name$4$1,
  value: value$2$1
};
const LegendItem = ({ name: name2, units: units2, value: value2, color }) => {
  return jsxRuntimeExports.jsxs("div", { className: styles$A$1.legendItem, children: [jsxRuntimeExports.jsx("div", { className: styles$A$1.name, style: { backgroundColor: color }, children: name2 }), jsxRuntimeExports.jsxs("div", { className: styles$A$1.value, children: [jsxRuntimeExports.jsx("span", { children: value2.toFixed(2) }), " ", jsxRuntimeExports.jsx("span", { children: units2 })] })] });
};
const Legend = ({ items: items2 }) => {
  return jsxRuntimeExports.jsx("div", { className: styles$B$1.legend, children: items2.map((item) => {
    return jsxRuntimeExports.jsx(LegendItem, { name: item.name, units: "A", value: item.getUpdate(), color: item.color }, item.id);
  }) });
};
const title$1$1 = "_title_1owz2_1";
const styles$z$1 = {
  title: title$1$1
};
const Title = ({ title: title2 }) => {
  return jsxRuntimeExports.jsx("div", { className: styles$z$1.title, children: title2 });
};
const imperativeChartWrapper = "_imperativeChartWrapper_1vdm9_1";
const styles$y$1 = {
  imperativeChartWrapper
};
function dataToPath(data, chartLength, minY, maxY, width, height) {
  return data.map((value2, index2) => {
    const chartPoint = valueToChartPoint(index2, value2, data.length, chartLength, minY, maxY, width, height);
    return pointToPathString(chartPoint, index2);
  }).join(" ");
}
function valueToChartPoint(x2, y2, dataLength, chartLength, minY, maxY, width, height) {
  let normX = (chartLength - dataLength + x2) * width / chartLength;
  if (isNaN(normX)) {
    normX = chartLength - 1;
  }
  let normY = height - (y2 - minY) * height / (maxY - minY);
  if (isNaN(normY)) {
    normY = height / 2;
  }
  return [normX, normY];
}
function pointToPathString(point, index2) {
  if (index2 == 0) {
    return `M ${point[0]} ${point[1]}`;
  } else {
    return `L ${point[0]} ${point[1]}`;
  }
}
class RangeArray {
  constructor(initArr, length) {
    __publicField(this, "arr");
    __publicField(this, "length");
    __publicField(this, "min");
    __publicField(this, "max");
    if (length < 2) {
      console.error("maxLineLength should be greater or equal than 2");
    }
    if (initArr.length > length) {
      console.warn(`initArr (length ${initArr.length}) is bigger than length ${length}`);
    }
    this.length = length;
    this.arr = initArr.slice(0, length);
    [this.min, this.max] = getRange(initArr);
  }
  push(value2) {
    this.arr.push(value2);
    if (this.arr.length > this.length) {
      this.arr.shift();
    }
    this.updateRange(value2);
  }
  getArr() {
    return this.arr;
  }
  getRange() {
    return [this.min, this.max];
  }
  updateRange(value2) {
    this.min = value2 < this.min ? value2 : this.min;
    this.max = value2 > this.max ? value2 : this.max;
  }
}
function getRange(points) {
  let min = Infinity;
  let max = -Infinity;
  for (let value2 of points) {
    min = value2 < min ? value2 : min;
    max = value2 > max ? value2 : max;
  }
  return [min, max];
}
function useInterval$1(callback, delay) {
  const savedCallback = reactExports.useRef();
  reactExports.useEffect(() => {
    savedCallback.current = callback;
  });
  reactExports.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let id2 = setInterval(tick, delay);
    return () => clearInterval(id2);
  }, [delay]);
}
const GlobalTickerContext = reactExports.createContext({
  subscribe: () => {
  },
  unsubscribe: () => {
  }
});
const GlobalTicker = ({ fps = 30, children }) => {
  const callbacks = reactExports.useRef([]);
  useInterval$1(() => {
    for (const cb2 of callbacks.current) {
      cb2();
    }
  }, 1e3 / fps);
  return jsxRuntimeExports.jsx(GlobalTickerContext.Provider, { value: {
    subscribe: (cb2) => {
      callbacks.current.push(cb2);
    },
    unsubscribe: (cb2) => {
      callbacks.current = callbacks.current.filter((item) => item != cb2);
    }
  }, children });
};
function useGlobalTicker(cb2) {
  const globalTicker = reactExports.useContext(GlobalTickerContext);
  reactExports.useEffect(() => {
    globalTicker.subscribe(cb2);
    return () => {
      globalTicker.unsubscribe(cb2);
    };
  }, [globalTicker]);
}
function getLargestRangeFromPartial(ranges) {
  const definedRanges = ranges.map((range) => {
    return [range[0] ?? 0, range[1] ?? 0];
  });
  return getLargestRange(definedRanges);
}
function useLines(viewBoxWidth2, viewBoxHeight2, maxLineLength, lineDescriptions) {
  const ref = reactExports.useRef(null);
  const initialLargestRange = reactExports.useMemo(() => getLargestRangeFromPartial(lineDescriptions.map((line2) => line2.range)), []);
  const [collectiveRange, setCollectiveRange] = reactExports.useState(initialLargestRange);
  const lineInstancesRef = reactExports.useRef([]);
  const updateLines = reactExports.useCallback(() => {
    const [min, max] = getLargestRange(lineInstancesRef.current.map((line2) => {
      const currentRange = line2.data.getRange();
      return [
        line2.range[0] ?? currentRange[0],
        line2.range[1] ?? currentRange[1]
      ];
    }));
    if (min != collectiveRange[0] || max != collectiveRange[1]) {
      setCollectiveRange([min, max]);
    }
    lineInstancesRef.current.forEach((line2) => {
      line2.data.push(line2.getUpdate());
      const updatedData = line2.data.getArr();
      const path = dataToPath(updatedData, maxLineLength, min, max, viewBoxWidth2, viewBoxHeight2);
      line2.ref.setAttribute("d", path);
    });
  }, []);
  useGlobalTicker(updateLines);
  reactExports.useLayoutEffect(() => {
    var _a;
    const newLineInstances = createLines(lineDescriptions, lineInstancesRef.current, maxLineLength, viewBoxWidth2, viewBoxHeight2);
    (_a = ref.current) == null ? void 0 : _a.replaceChildren(...newLineInstances.map((line2) => {
      return line2.ref;
    }));
    lineInstancesRef.current = newLineInstances;
  }, [lineDescriptions]);
  reactExports.useLayoutEffect(() => {
    return () => {
      var _a;
      (_a = ref.current) == null ? void 0 : _a.replaceChildren();
    };
  }, []);
  return { ref, range: collectiveRange };
}
function createLines(descriptions, lines, length, width, height) {
  return descriptions.map((description) => {
    var _a, _b;
    const newHandler = ((_a = lines.find((line2) => description.id == line2.id)) == null ? void 0 : _a.data) ?? new RangeArray([], length);
    const [min, max] = getLargestRange(lines.map((line2) => {
      const currentRange = line2.data.getRange();
      return [
        line2.range[0] ?? currentRange[0],
        line2.range[1] ?? currentRange[1]
      ];
    }));
    const path = dataToPath(newHandler.getArr(), length, min, max, width, height);
    const pathElement = createPathElement(description.color, path);
    return {
      id: description.id,
      name: description.name,
      ref: pathElement,
      range: description.range,
      getUpdate: () => description.getUpdate(),
      data: ((_b = lines.find((line2) => description.id == line2.id)) == null ? void 0 : _b.data) ?? new RangeArray([], length),
      color: "red"
    };
  });
}
function createPathElement(color, path) {
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("vector-effect", "non-scaling-stroke");
  pathElement.setAttribute("stroke", color);
  pathElement.setAttribute("stroke-width", "3");
  pathElement.setAttribute("stroke-linejoin", "round");
  pathElement.setAttribute("d", path);
  return pathElement;
}
function getLargestRange(ranges) {
  let min = Infinity;
  let max = -Infinity;
  for (const range of ranges) {
    min = range[0] < min ? range[0] : min;
    max = range[1] > max ? range[1] : max;
  }
  return [min, max];
}
const verticalAxisWrapper = "_verticalAxisWrapper_ln4bm_1";
const value$1$1 = "_value_ln4bm_10";
const styles$x$1 = {
  verticalAxisWrapper,
  value: value$1$1
};
const VerticalAxis = ({ min, max, divisions }) => {
  if (divisions == 0) {
    return null;
  }
  const marks = reactExports.useMemo(() => getAxisMarks(min, max, divisions), [min, max, divisions]);
  return jsxRuntimeExports.jsx("div", { className: styles$x$1.verticalAxisWrapper, children: marks.map((mark) => {
    return jsxRuntimeExports.jsx("div", { className: styles$x$1.value, children: mark.value.toFixed(1) }, mark.id);
  }) });
};
function getAxisMarks(min, max, divisions) {
  const marks = [];
  for (let i2 = 0; i2 < divisions + 1; i2++) {
    marks.push({
      id: nanoid$2(),
      value: i2 * (max - min) / divisions + min
    });
  }
  return marks;
}
function getDivisions(totalLength, divisions) {
  const positions2 = [];
  for (let i2 = 0; i2 < divisions + 1; i2++) {
    positions2.push(i2 * totalLength / divisions);
  }
  return positions2;
}
const HorizontalDivisions = ({ height, divisions, strokeOpacity, strokeWidth }) => {
  if (divisions == 0) {
    return null;
  }
  const heights = reactExports.useMemo(() => {
    return getDivisions(height, divisions);
  }, [height, divisions]);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: heights.map((height2, index2) => {
    return jsxRuntimeExports.jsx("line", { shapeRendering: "crispEdges", vectorEffect: "non-scaling-stroke", x1: 0, y1: height2, x2: "100%", y2: height2, stroke: "black", strokeOpacity, strokeWidth }, index2);
  }) });
};
const VerticalDivisions = ({ divisions, width, strokeOpacity, strokeWidth }) => {
  if (divisions == 0) {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  }
  const widths = reactExports.useMemo(() => {
    return getDivisions(width, divisions);
  }, [width, divisions]);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: widths.map((width2, index2) => {
    return jsxRuntimeExports.jsx("line", { shapeRendering: "crispEdges", vectorEffect: "non-scaling-stroke", x1: width2, y1: 0, x2: width2, y2: "100%", stroke: "black", strokeOpacity, strokeWidth }, index2);
  }) });
};
const STROKE_WIDTH = 1;
const STROKE_OPACITY = 0.2;
const Grid = ({ viewBoxWidth: viewBoxWidth2, viewBoxHeight: viewBoxHeight2, verticalDivisions, horizontalDivisions }) => {
  return jsxRuntimeExports.jsxs("g", { children: [jsxRuntimeExports.jsx(HorizontalDivisions, { divisions: horizontalDivisions, height: viewBoxHeight2, strokeOpacity: STROKE_OPACITY, strokeWidth: STROKE_WIDTH }), jsxRuntimeExports.jsx(VerticalDivisions, { divisions: verticalDivisions, strokeOpacity: STROKE_OPACITY, strokeWidth: STROKE_WIDTH, width: viewBoxWidth2 })] });
};
const LinesWithGrid = ({ width = "100%", height = "100%", showGrid = true, gridDivisions, viewBoxWidth: viewBoxWidth2, viewBoxHeight: viewBoxHeight2, chartRef }) => {
  return jsxRuntimeExports.jsx("div", { style: { flex: "1 1 0" }, children: jsxRuntimeExports.jsxs("svg", { width, height, viewBox: `0 0 ${viewBoxWidth2} ${viewBoxHeight2}`, preserveAspectRatio: "none", fill: "none", style: { overflow: "hidden" }, children: [showGrid && jsxRuntimeExports.jsx(Grid, { verticalDivisions: gridDivisions, horizontalDivisions: gridDivisions, viewBoxHeight: viewBoxHeight2, viewBoxWidth: viewBoxWidth2 }), jsxRuntimeExports.jsx("g", { ref: chartRef, style: { overflow: "hidden" } })] }) });
};
const viewBoxWidth = 1e3;
const viewBoxHeight = 1e3;
const LinesChart = ({ items: items2, divisions, length, showGrid = true, width = "100%", height = "100%", className = "" }) => {
  const { ref, range } = useLines(viewBoxWidth, viewBoxHeight, length, items2);
  return jsxRuntimeExports.jsxs("div", { className: `${styles$y$1.imperativeChartWrapper} ${className}`, children: [jsxRuntimeExports.jsx(VerticalAxis, { divisions, min: range[0], max: range[1] }), jsxRuntimeExports.jsx(LinesWithGrid, { chartRef: ref, height, width, showGrid, viewBoxHeight, viewBoxWidth, gridDivisions: divisions })] });
};
const palette = ["#EE8735", "#51C6EB", "#7BEE35", "#e469ca"];
const ColorfulChart = ({ className = "", title: title2, items: items2, length, height = "8rem" }) => {
  const itemsWithPalette = reactExports.useMemo(() => items2.map((item, index2) => ({
    ...item,
    color: palette[index2 % palette.length]
  })), [items2]);
  return jsxRuntimeExports.jsxs("div", { className: `${styles$C$1.colorfulChart} ${className}`, children: [jsxRuntimeExports.jsx(Title, { title: title2 }), jsxRuntimeExports.jsxs("div", { className: styles$C$1.body, children: [jsxRuntimeExports.jsx(LinesChart, { height, divisions: 4, showGrid: false, items: itemsWithPalette, length }), jsxRuntimeExports.jsx(Legend, { items: itemsWithPalette })] })] });
};
function clamp$1(value2, min, max) {
  return Math.min(Math.max(min, value2), max);
}
function normalize$1(value2, min, max) {
  return (value2 - min) / (max - min);
}
function clampAndNormalize$1(value2, min, max) {
  return normalize$1(clamp$1(value2, min, max), min, max);
}
const MAX_TITLE_TIME = 1100;
const Loader = ({ promises, LoadingView, FailureView, children }) => {
  const [state2, setState] = reactExports.useState({ state: "pending" });
  const startTime = reactExports.useRef(0);
  reactExports.useEffect(() => {
    startTime.current = performance.now();
    Promise.all(promises).then((values) => {
      const elapsed = performance.now() - startTime.current;
      setTimeout(() => {
        setState({ state: "fulfilled", result: values });
      }, clamp$1(MAX_TITLE_TIME - elapsed, 0, MAX_TITLE_TIME));
    }).catch(() => setState({ state: "rejected" }));
  }, []);
  if (state2.state == "fulfilled") {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: children(state2.result) });
  } else if (state2.state == "pending") {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: LoadingView });
  } else {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: FailureView });
  }
};
function doesNumberOverflow(v2, type) {
  const bits = typeToBits[type];
  if (isUnsignedIntegerType(type)) {
    return unsignedIntegerOverflows(v2, bits);
  } else if (isSignedIntegerType(type)) {
    return signedIntegerOverflows(v2, bits);
  } else {
    return floatOverflows(v2);
  }
}
function unsignedIntegerOverflows(value2, bits) {
  return value2 >= 0 && value2 < 1 << bits;
}
function signedIntegerOverflows(value2, bits) {
  return value2 >= -1 << bits - 1 && value2 < 1 << bits - 1;
}
function floatOverflows(value2) {
  return !Number.isNaN(value2);
}
function isWithinRange(v2, range) {
  let isWithinRange2 = true;
  if (range[0] !== null) {
    isWithinRange2 && (isWithinRange2 = v2 >= range[0]);
  }
  if (range[1] !== null) {
    isWithinRange2 && (isWithinRange2 = v2 <= range[1]);
  }
  return isWithinRange2;
}
const typeToBits = {
  uint8: 8,
  uint16: 16,
  uint32: 32,
  uint64: 64,
  int8: 8,
  int16: 16,
  int32: 32,
  int64: 64,
  float32: 32,
  float64: 64
};
const buttonWrapper = "_buttonWrapper_1e74g_1";
const enabled = "_enabled_1e74g_14";
const disabled$1 = "_disabled_1e74g_17";
const label$1$1 = "_label_1e74g_22";
const styles$o$1 = {
  buttonWrapper,
  enabled,
  disabled: disabled$1,
  label: label$1$1
};
var __defProp2 = Object.defineProperty;
var __export = (target2, all) => {
  for (var name2 in all)
    __defProp2(target2, name2, { get: all[name2], enumerable: true });
};
var globals_exports = {};
__export(globals_exports, {
  assign: () => assign,
  colors: () => colors$1,
  createStringInterpolator: () => createStringInterpolator,
  skipAnimation: () => skipAnimation,
  to: () => to,
  willAdvance: () => willAdvance
});
var updateQueue = makeQueue();
var raf = (fn2) => schedule(fn2, updateQueue);
var writeQueue = makeQueue();
raf.write = (fn2) => schedule(fn2, writeQueue);
var onStartQueue = makeQueue();
raf.onStart = (fn2) => schedule(fn2, onStartQueue);
var onFrameQueue = makeQueue();
raf.onFrame = (fn2) => schedule(fn2, onFrameQueue);
var onFinishQueue = makeQueue();
raf.onFinish = (fn2) => schedule(fn2, onFinishQueue);
var timeouts = [];
raf.setTimeout = (handler, ms) => {
  const time = raf.now() + ms;
  const cancel = () => {
    const i2 = timeouts.findIndex((t2) => t2.cancel == cancel);
    if (~i2)
      timeouts.splice(i2, 1);
    pendingCount -= ~i2 ? 1 : 0;
  };
  const timeout = { time, handler, cancel };
  timeouts.splice(findTimeout(time), 0, timeout);
  pendingCount += 1;
  start();
  return timeout;
};
var findTimeout = (time) => ~(~timeouts.findIndex((t2) => t2.time > time) || ~timeouts.length);
raf.cancel = (fn2) => {
  onStartQueue.delete(fn2);
  onFrameQueue.delete(fn2);
  onFinishQueue.delete(fn2);
  updateQueue.delete(fn2);
  writeQueue.delete(fn2);
};
raf.sync = (fn2) => {
  sync = true;
  raf.batchedUpdates(fn2);
  sync = false;
};
raf.throttle = (fn2) => {
  let lastArgs;
  function queuedFn() {
    try {
      fn2(...lastArgs);
    } finally {
      lastArgs = null;
    }
  }
  function throttled(...args) {
    lastArgs = args;
    raf.onStart(queuedFn);
  }
  throttled.handler = fn2;
  throttled.cancel = () => {
    onStartQueue.delete(queuedFn);
    lastArgs = null;
  };
  return throttled;
};
var nativeRaf = typeof window != "undefined" ? window.requestAnimationFrame : (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {
  }
);
raf.use = (impl) => nativeRaf = impl;
raf.now = typeof performance != "undefined" ? () => performance.now() : Date.now;
raf.batchedUpdates = (fn2) => fn2();
raf.catch = console.error;
raf.frameLoop = "always";
raf.advance = () => {
  if (raf.frameLoop !== "demand") {
    console.warn(
      "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
    );
  } else {
    update();
  }
};
var ts = -1;
var pendingCount = 0;
var sync = false;
function schedule(fn2, queue) {
  if (sync) {
    queue.delete(fn2);
    fn2(0);
  } else {
    queue.add(fn2);
    start();
  }
}
function start() {
  if (ts < 0) {
    ts = 0;
    if (raf.frameLoop !== "demand") {
      nativeRaf(loop);
    }
  }
}
function stop() {
  ts = -1;
}
function loop() {
  if (~ts) {
    nativeRaf(loop);
    raf.batchedUpdates(update);
  }
}
function update() {
  const prevTs = ts;
  ts = raf.now();
  const count = findTimeout(ts);
  if (count) {
    eachSafely(timeouts.splice(0, count), (t2) => t2.handler());
    pendingCount -= count;
  }
  if (!pendingCount) {
    stop();
    return;
  }
  onStartQueue.flush();
  updateQueue.flush(prevTs ? Math.min(64, ts - prevTs) : 16.667);
  onFrameQueue.flush();
  writeQueue.flush();
  onFinishQueue.flush();
}
function makeQueue() {
  let next = /* @__PURE__ */ new Set();
  let current = next;
  return {
    add(fn2) {
      pendingCount += current == next && !next.has(fn2) ? 1 : 0;
      next.add(fn2);
    },
    delete(fn2) {
      pendingCount -= current == next && next.has(fn2) ? 1 : 0;
      return next.delete(fn2);
    },
    flush(arg) {
      if (current.size) {
        next = /* @__PURE__ */ new Set();
        pendingCount -= current.size;
        eachSafely(current, (fn2) => fn2(arg) && next.add(fn2));
        pendingCount += next.size;
        current = next;
      }
    }
  };
}
function eachSafely(values, each2) {
  values.forEach((value2) => {
    try {
      each2(value2);
    } catch (e2) {
      raf.catch(e2);
    }
  });
}
function noop() {
}
var defineHidden = (obj, key, value2) => Object.defineProperty(obj, key, { value: value2, writable: true, configurable: true });
var is$1 = {
  arr: Array.isArray,
  obj: (a2) => !!a2 && a2.constructor.name === "Object",
  fun: (a2) => typeof a2 === "function",
  str: (a2) => typeof a2 === "string",
  num: (a2) => typeof a2 === "number",
  und: (a2) => a2 === void 0
};
function isEqual(a2, b2) {
  if (is$1.arr(a2)) {
    if (!is$1.arr(b2) || a2.length !== b2.length)
      return false;
    for (let i2 = 0; i2 < a2.length; i2++) {
      if (a2[i2] !== b2[i2])
        return false;
    }
    return true;
  }
  return a2 === b2;
}
var each = (obj, fn2) => obj.forEach(fn2);
function eachProp(obj, fn2, ctx2) {
  if (is$1.arr(obj)) {
    for (let i2 = 0; i2 < obj.length; i2++) {
      fn2.call(ctx2, obj[i2], `${i2}`);
    }
    return;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn2.call(ctx2, obj[key], key);
    }
  }
}
var toArray = (a2) => is$1.und(a2) ? [] : is$1.arr(a2) ? a2 : [a2];
function flush(queue, iterator) {
  if (queue.size) {
    const items2 = Array.from(queue);
    queue.clear();
    each(items2, iterator);
  }
}
var flushCalls = (queue, ...args) => flush(queue, (fn2) => fn2(...args));
var isSSR = () => typeof window === "undefined" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
var createStringInterpolator;
var to;
var colors$1 = null;
var skipAnimation = false;
var willAdvance = noop;
var assign = (globals) => {
  if (globals.to)
    to = globals.to;
  if (globals.now)
    raf.now = globals.now;
  if (globals.colors !== void 0)
    colors$1 = globals.colors;
  if (globals.skipAnimation != null)
    skipAnimation = globals.skipAnimation;
  if (globals.createStringInterpolator)
    createStringInterpolator = globals.createStringInterpolator;
  if (globals.requestAnimationFrame)
    raf.use(globals.requestAnimationFrame);
  if (globals.batchedUpdates)
    raf.batchedUpdates = globals.batchedUpdates;
  if (globals.willAdvance)
    willAdvance = globals.willAdvance;
  if (globals.frameLoop)
    raf.frameLoop = globals.frameLoop;
};
var startQueue = /* @__PURE__ */ new Set();
var currentFrame = [];
var prevFrame = [];
var priority = 0;
var frameLoop = {
  get idle() {
    return !startQueue.size && !currentFrame.length;
  },
  /** Advance the given animation on every frame until idle. */
  start(animation) {
    if (priority > animation.priority) {
      startQueue.add(animation);
      raf.onStart(flushStartQueue);
    } else {
      startSafely(animation);
      raf(advance);
    }
  },
  /** Advance all animations by the given time. */
  advance,
  /** Call this when an animation's priority changes. */
  sort(animation) {
    if (priority) {
      raf.onFrame(() => frameLoop.sort(animation));
    } else {
      const prevIndex = currentFrame.indexOf(animation);
      if (~prevIndex) {
        currentFrame.splice(prevIndex, 1);
        startUnsafely(animation);
      }
    }
  },
  /**
   * Clear all animations. For testing purposes.
   *
   * ☠️ Never call this from within the frameloop.
   */
  clear() {
    currentFrame = [];
    startQueue.clear();
  }
};
function flushStartQueue() {
  startQueue.forEach(startSafely);
  startQueue.clear();
  raf(advance);
}
function startSafely(animation) {
  if (!currentFrame.includes(animation))
    startUnsafely(animation);
}
function startUnsafely(animation) {
  currentFrame.splice(
    findIndex(currentFrame, (other) => other.priority > animation.priority),
    0,
    animation
  );
}
function advance(dt) {
  const nextFrame = prevFrame;
  for (let i2 = 0; i2 < currentFrame.length; i2++) {
    const animation = currentFrame[i2];
    priority = animation.priority;
    if (!animation.idle) {
      willAdvance(animation);
      animation.advance(dt);
      if (!animation.idle) {
        nextFrame.push(animation);
      }
    }
  }
  priority = 0;
  prevFrame = currentFrame;
  prevFrame.length = 0;
  currentFrame = nextFrame;
  return currentFrame.length > 0;
}
function findIndex(arr, test) {
  const index2 = arr.findIndex(test);
  return index2 < 0 ? arr.length : index2;
}
var clamp$2 = (min, max, v2) => Math.min(Math.max(v2, min), max);
var colors2 = {
  transparent: 0,
  aliceblue: 4042850303,
  antiquewhite: 4209760255,
  aqua: 16777215,
  aquamarine: 2147472639,
  azure: 4043309055,
  beige: 4126530815,
  bisque: 4293182719,
  black: 255,
  blanchedalmond: 4293643775,
  blue: 65535,
  blueviolet: 2318131967,
  brown: 2771004159,
  burlywood: 3736635391,
  burntsienna: 3934150143,
  cadetblue: 1604231423,
  chartreuse: 2147418367,
  chocolate: 3530104575,
  coral: 4286533887,
  cornflowerblue: 1687547391,
  cornsilk: 4294499583,
  crimson: 3692313855,
  cyan: 16777215,
  darkblue: 35839,
  darkcyan: 9145343,
  darkgoldenrod: 3095792639,
  darkgray: 2846468607,
  darkgreen: 6553855,
  darkgrey: 2846468607,
  darkkhaki: 3182914559,
  darkmagenta: 2332068863,
  darkolivegreen: 1433087999,
  darkorange: 4287365375,
  darkorchid: 2570243327,
  darkred: 2332033279,
  darksalmon: 3918953215,
  darkseagreen: 2411499519,
  darkslateblue: 1211993087,
  darkslategray: 793726975,
  darkslategrey: 793726975,
  darkturquoise: 13554175,
  darkviolet: 2483082239,
  deeppink: 4279538687,
  deepskyblue: 12582911,
  dimgray: 1768516095,
  dimgrey: 1768516095,
  dodgerblue: 512819199,
  firebrick: 2988581631,
  floralwhite: 4294635775,
  forestgreen: 579543807,
  fuchsia: 4278255615,
  gainsboro: 3705462015,
  ghostwhite: 4177068031,
  gold: 4292280575,
  goldenrod: 3668254975,
  gray: 2155905279,
  green: 8388863,
  greenyellow: 2919182335,
  grey: 2155905279,
  honeydew: 4043305215,
  hotpink: 4285117695,
  indianred: 3445382399,
  indigo: 1258324735,
  ivory: 4294963455,
  khaki: 4041641215,
  lavender: 3873897215,
  lavenderblush: 4293981695,
  lawngreen: 2096890111,
  lemonchiffon: 4294626815,
  lightblue: 2916673279,
  lightcoral: 4034953471,
  lightcyan: 3774873599,
  lightgoldenrodyellow: 4210742015,
  lightgray: 3553874943,
  lightgreen: 2431553791,
  lightgrey: 3553874943,
  lightpink: 4290167295,
  lightsalmon: 4288707327,
  lightseagreen: 548580095,
  lightskyblue: 2278488831,
  lightslategray: 2005441023,
  lightslategrey: 2005441023,
  lightsteelblue: 2965692159,
  lightyellow: 4294959359,
  lime: 16711935,
  limegreen: 852308735,
  linen: 4210091775,
  magenta: 4278255615,
  maroon: 2147483903,
  mediumaquamarine: 1724754687,
  mediumblue: 52735,
  mediumorchid: 3126187007,
  mediumpurple: 2473647103,
  mediumseagreen: 1018393087,
  mediumslateblue: 2070474495,
  mediumspringgreen: 16423679,
  mediumturquoise: 1221709055,
  mediumvioletred: 3340076543,
  midnightblue: 421097727,
  mintcream: 4127193855,
  mistyrose: 4293190143,
  moccasin: 4293178879,
  navajowhite: 4292783615,
  navy: 33023,
  oldlace: 4260751103,
  olive: 2155872511,
  olivedrab: 1804477439,
  orange: 4289003775,
  orangered: 4282712319,
  orchid: 3664828159,
  palegoldenrod: 4008225535,
  palegreen: 2566625535,
  paleturquoise: 2951671551,
  palevioletred: 3681588223,
  papayawhip: 4293907967,
  peachpuff: 4292524543,
  peru: 3448061951,
  pink: 4290825215,
  plum: 3718307327,
  powderblue: 2967529215,
  purple: 2147516671,
  rebeccapurple: 1714657791,
  red: 4278190335,
  rosybrown: 3163525119,
  royalblue: 1097458175,
  saddlebrown: 2336560127,
  salmon: 4202722047,
  sandybrown: 4104413439,
  seagreen: 780883967,
  seashell: 4294307583,
  sienna: 2689740287,
  silver: 3233857791,
  skyblue: 2278484991,
  slateblue: 1784335871,
  slategray: 1887473919,
  slategrey: 1887473919,
  snow: 4294638335,
  springgreen: 16744447,
  steelblue: 1182971135,
  tan: 3535047935,
  teal: 8421631,
  thistle: 3636451583,
  tomato: 4284696575,
  turquoise: 1088475391,
  violet: 4001558271,
  wheat: 4125012991,
  white: 4294967295,
  whitesmoke: 4126537215,
  yellow: 4294902015,
  yellowgreen: 2597139199
};
var NUMBER = "[-+]?\\d*\\.?\\d+";
var PERCENTAGE = NUMBER + "%";
function call(...parts) {
  return "\\(\\s*(" + parts.join(")\\s*,\\s*(") + ")\\s*\\)";
}
var rgb = new RegExp("rgb" + call(NUMBER, NUMBER, NUMBER));
var rgba = new RegExp("rgba" + call(NUMBER, NUMBER, NUMBER, NUMBER));
var hsl = new RegExp("hsl" + call(NUMBER, PERCENTAGE, PERCENTAGE));
var hsla = new RegExp(
  "hsla" + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER)
);
var hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex6 = /^#([0-9a-fA-F]{6})$/;
var hex8 = /^#([0-9a-fA-F]{8})$/;
function normalizeColor(color) {
  let match;
  if (typeof color === "number") {
    return color >>> 0 === color && color >= 0 && color <= 4294967295 ? color : null;
  }
  if (match = hex6.exec(color))
    return parseInt(match[1] + "ff", 16) >>> 0;
  if (colors$1 && colors$1[color] !== void 0) {
    return colors$1[color];
  }
  if (match = rgb.exec(color)) {
    return (parse255(match[1]) << 24 | // r
    parse255(match[2]) << 16 | // g
    parse255(match[3]) << 8 | // b
    255) >>> // a
    0;
  }
  if (match = rgba.exec(color)) {
    return (parse255(match[1]) << 24 | // r
    parse255(match[2]) << 16 | // g
    parse255(match[3]) << 8 | // b
    parse1(match[4])) >>> // a
    0;
  }
  if (match = hex3.exec(color)) {
    return parseInt(
      match[1] + match[1] + // r
      match[2] + match[2] + // g
      match[3] + match[3] + // b
      "ff",
      // a
      16
    ) >>> 0;
  }
  if (match = hex8.exec(color))
    return parseInt(match[1], 16) >>> 0;
  if (match = hex4.exec(color)) {
    return parseInt(
      match[1] + match[1] + // r
      match[2] + match[2] + // g
      match[3] + match[3] + // b
      match[4] + match[4],
      // a
      16
    ) >>> 0;
  }
  if (match = hsl.exec(color)) {
    return (hslToRgb(
      parse360(match[1]),
      // h
      parsePercentage(match[2]),
      // s
      parsePercentage(match[3])
      // l
    ) | 255) >>> // a
    0;
  }
  if (match = hsla.exec(color)) {
    return (hslToRgb(
      parse360(match[1]),
      // h
      parsePercentage(match[2]),
      // s
      parsePercentage(match[3])
      // l
    ) | parse1(match[4])) >>> // a
    0;
  }
  return null;
}
function hue2rgb(p2, q2, t2) {
  if (t2 < 0)
    t2 += 1;
  if (t2 > 1)
    t2 -= 1;
  if (t2 < 1 / 6)
    return p2 + (q2 - p2) * 6 * t2;
  if (t2 < 1 / 2)
    return q2;
  if (t2 < 2 / 3)
    return p2 + (q2 - p2) * (2 / 3 - t2) * 6;
  return p2;
}
function hslToRgb(h2, s2, l2) {
  const q2 = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
  const p2 = 2 * l2 - q2;
  const r2 = hue2rgb(p2, q2, h2 + 1 / 3);
  const g2 = hue2rgb(p2, q2, h2);
  const b2 = hue2rgb(p2, q2, h2 - 1 / 3);
  return Math.round(r2 * 255) << 24 | Math.round(g2 * 255) << 16 | Math.round(b2 * 255) << 8;
}
function parse255(str) {
  const int = parseInt(str, 10);
  if (int < 0)
    return 0;
  if (int > 255)
    return 255;
  return int;
}
function parse360(str) {
  const int = parseFloat(str);
  return (int % 360 + 360) % 360 / 360;
}
function parse1(str) {
  const num = parseFloat(str);
  if (num < 0)
    return 0;
  if (num > 1)
    return 255;
  return Math.round(num * 255);
}
function parsePercentage(str) {
  const int = parseFloat(str);
  if (int < 0)
    return 0;
  if (int > 100)
    return 1;
  return int / 100;
}
function colorToRgba(input) {
  let int32Color = normalizeColor(input);
  if (int32Color === null)
    return input;
  int32Color = int32Color || 0;
  const r2 = (int32Color & 4278190080) >>> 24;
  const g2 = (int32Color & 16711680) >>> 16;
  const b2 = (int32Color & 65280) >>> 8;
  const a2 = (int32Color & 255) / 255;
  return `rgba(${r2}, ${g2}, ${b2}, ${a2})`;
}
var createInterpolator = (range, output, extrapolate) => {
  if (is$1.fun(range)) {
    return range;
  }
  if (is$1.arr(range)) {
    return createInterpolator({
      range,
      output,
      extrapolate
    });
  }
  if (is$1.str(range.output[0])) {
    return createStringInterpolator(range);
  }
  const config2 = range;
  const outputRange = config2.output;
  const inputRange = config2.range || [0, 1];
  const extrapolateLeft = config2.extrapolateLeft || config2.extrapolate || "extend";
  const extrapolateRight = config2.extrapolateRight || config2.extrapolate || "extend";
  const easing = config2.easing || ((t2) => t2);
  return (input) => {
    const range2 = findRange(input, inputRange);
    return interpolate(
      input,
      inputRange[range2],
      inputRange[range2 + 1],
      outputRange[range2],
      outputRange[range2 + 1],
      easing,
      extrapolateLeft,
      extrapolateRight,
      config2.map
    );
  };
};
function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight, map) {
  let result = map ? map(input) : input;
  if (result < inputMin) {
    if (extrapolateLeft === "identity")
      return result;
    else if (extrapolateLeft === "clamp")
      result = inputMin;
  }
  if (result > inputMax) {
    if (extrapolateRight === "identity")
      return result;
    else if (extrapolateRight === "clamp")
      result = inputMax;
  }
  if (outputMin === outputMax)
    return outputMin;
  if (inputMin === inputMax)
    return input <= inputMin ? outputMin : outputMax;
  if (inputMin === -Infinity)
    result = -result;
  else if (inputMax === Infinity)
    result = result - inputMin;
  else
    result = (result - inputMin) / (inputMax - inputMin);
  result = easing(result);
  if (outputMin === -Infinity)
    result = -result;
  else if (outputMax === Infinity)
    result = result + outputMin;
  else
    result = result * (outputMax - outputMin) + outputMin;
  return result;
}
function findRange(input, inputRange) {
  for (var i2 = 1; i2 < inputRange.length - 1; ++i2)
    if (inputRange[i2] >= input)
      break;
  return i2 - 1;
}
var steps = (steps2, direction = "end") => (progress2) => {
  progress2 = direction === "end" ? Math.min(progress2, 0.999) : Math.max(progress2, 1e-3);
  const expanded = progress2 * steps2;
  const rounded = direction === "end" ? Math.floor(expanded) : Math.ceil(expanded);
  return clamp$2(0, 1, rounded / steps2);
};
var c1 = 1.70158;
var c2 = c1 * 1.525;
var c3 = c1 + 1;
var c4 = 2 * Math.PI / 3;
var c5 = 2 * Math.PI / 4.5;
var bounceOut = (x2) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x2 < 1 / d1) {
    return n1 * x2 * x2;
  } else if (x2 < 2 / d1) {
    return n1 * (x2 -= 1.5 / d1) * x2 + 0.75;
  } else if (x2 < 2.5 / d1) {
    return n1 * (x2 -= 2.25 / d1) * x2 + 0.9375;
  } else {
    return n1 * (x2 -= 2.625 / d1) * x2 + 0.984375;
  }
};
var easings = {
  linear: (x2) => x2,
  easeInQuad: (x2) => x2 * x2,
  easeOutQuad: (x2) => 1 - (1 - x2) * (1 - x2),
  easeInOutQuad: (x2) => x2 < 0.5 ? 2 * x2 * x2 : 1 - Math.pow(-2 * x2 + 2, 2) / 2,
  easeInCubic: (x2) => x2 * x2 * x2,
  easeOutCubic: (x2) => 1 - Math.pow(1 - x2, 3),
  easeInOutCubic: (x2) => x2 < 0.5 ? 4 * x2 * x2 * x2 : 1 - Math.pow(-2 * x2 + 2, 3) / 2,
  easeInQuart: (x2) => x2 * x2 * x2 * x2,
  easeOutQuart: (x2) => 1 - Math.pow(1 - x2, 4),
  easeInOutQuart: (x2) => x2 < 0.5 ? 8 * x2 * x2 * x2 * x2 : 1 - Math.pow(-2 * x2 + 2, 4) / 2,
  easeInQuint: (x2) => x2 * x2 * x2 * x2 * x2,
  easeOutQuint: (x2) => 1 - Math.pow(1 - x2, 5),
  easeInOutQuint: (x2) => x2 < 0.5 ? 16 * x2 * x2 * x2 * x2 * x2 : 1 - Math.pow(-2 * x2 + 2, 5) / 2,
  easeInSine: (x2) => 1 - Math.cos(x2 * Math.PI / 2),
  easeOutSine: (x2) => Math.sin(x2 * Math.PI / 2),
  easeInOutSine: (x2) => -(Math.cos(Math.PI * x2) - 1) / 2,
  easeInExpo: (x2) => x2 === 0 ? 0 : Math.pow(2, 10 * x2 - 10),
  easeOutExpo: (x2) => x2 === 1 ? 1 : 1 - Math.pow(2, -10 * x2),
  easeInOutExpo: (x2) => x2 === 0 ? 0 : x2 === 1 ? 1 : x2 < 0.5 ? Math.pow(2, 20 * x2 - 10) / 2 : (2 - Math.pow(2, -20 * x2 + 10)) / 2,
  easeInCirc: (x2) => 1 - Math.sqrt(1 - Math.pow(x2, 2)),
  easeOutCirc: (x2) => Math.sqrt(1 - Math.pow(x2 - 1, 2)),
  easeInOutCirc: (x2) => x2 < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x2, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x2 + 2, 2)) + 1) / 2,
  easeInBack: (x2) => c3 * x2 * x2 * x2 - c1 * x2 * x2,
  easeOutBack: (x2) => 1 + c3 * Math.pow(x2 - 1, 3) + c1 * Math.pow(x2 - 1, 2),
  easeInOutBack: (x2) => x2 < 0.5 ? Math.pow(2 * x2, 2) * ((c2 + 1) * 2 * x2 - c2) / 2 : (Math.pow(2 * x2 - 2, 2) * ((c2 + 1) * (x2 * 2 - 2) + c2) + 2) / 2,
  easeInElastic: (x2) => x2 === 0 ? 0 : x2 === 1 ? 1 : -Math.pow(2, 10 * x2 - 10) * Math.sin((x2 * 10 - 10.75) * c4),
  easeOutElastic: (x2) => x2 === 0 ? 0 : x2 === 1 ? 1 : Math.pow(2, -10 * x2) * Math.sin((x2 * 10 - 0.75) * c4) + 1,
  easeInOutElastic: (x2) => x2 === 0 ? 0 : x2 === 1 ? 1 : x2 < 0.5 ? -(Math.pow(2, 20 * x2 - 10) * Math.sin((20 * x2 - 11.125) * c5)) / 2 : Math.pow(2, -20 * x2 + 10) * Math.sin((20 * x2 - 11.125) * c5) / 2 + 1,
  easeInBounce: (x2) => 1 - bounceOut(1 - x2),
  easeOutBounce: bounceOut,
  easeInOutBounce: (x2) => x2 < 0.5 ? (1 - bounceOut(1 - 2 * x2)) / 2 : (1 + bounceOut(2 * x2 - 1)) / 2,
  steps
};
var $get = Symbol.for("FluidValue.get");
var $observers = Symbol.for("FluidValue.observers");
var hasFluidValue = (arg) => Boolean(arg && arg[$get]);
var getFluidValue = (arg) => arg && arg[$get] ? arg[$get]() : arg;
var getFluidObservers = (target2) => target2[$observers] || null;
function callFluidObserver(observer2, event) {
  if (observer2.eventObserved) {
    observer2.eventObserved(event);
  } else {
    observer2(event);
  }
}
function callFluidObservers(target2, event) {
  const observers = target2[$observers];
  if (observers) {
    observers.forEach((observer2) => {
      callFluidObserver(observer2, event);
    });
  }
}
var FluidValue = class {
  constructor(get) {
    if (!get && !(get = this.get)) {
      throw Error("Unknown getter");
    }
    setFluidGetter(this, get);
  }
};
var setFluidGetter = (target2, get) => setHidden(target2, $get, get);
function addFluidObserver(target2, observer2) {
  if (target2[$get]) {
    let observers = target2[$observers];
    if (!observers) {
      setHidden(target2, $observers, observers = /* @__PURE__ */ new Set());
    }
    if (!observers.has(observer2)) {
      observers.add(observer2);
      if (target2.observerAdded) {
        target2.observerAdded(observers.size, observer2);
      }
    }
  }
  return observer2;
}
function removeFluidObserver(target2, observer2) {
  const observers = target2[$observers];
  if (observers && observers.has(observer2)) {
    const count = observers.size - 1;
    if (count) {
      observers.delete(observer2);
    } else {
      target2[$observers] = null;
    }
    if (target2.observerRemoved) {
      target2.observerRemoved(count, observer2);
    }
  }
}
var setHidden = (target2, key, value2) => Object.defineProperty(target2, key, {
  value: value2,
  writable: true,
  configurable: true
});
var numberRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
var unitRegex = new RegExp(`(${numberRegex.source})(%|[a-z]+)`, "i");
var rgbaRegex = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi;
var cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
var variableToRgba = (input) => {
  const [token, fallback] = parseCSSVariable(input);
  if (!token || isSSR()) {
    return input;
  }
  const value2 = window.getComputedStyle(document.documentElement).getPropertyValue(token);
  if (value2) {
    return value2.trim();
  } else if (fallback && fallback.startsWith("--")) {
    const value22 = window.getComputedStyle(document.documentElement).getPropertyValue(fallback);
    if (value22) {
      return value22;
    } else {
      return input;
    }
  } else if (fallback && cssVariableRegex.test(fallback)) {
    return variableToRgba(fallback);
  } else if (fallback) {
    return fallback;
  }
  return input;
};
var parseCSSVariable = (current) => {
  const match = cssVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token, fallback] = match;
  return [token, fallback];
};
var namedColorRegex;
var rgbaRound = (_2, p1, p2, p3, p4) => `rgba(${Math.round(p1)}, ${Math.round(p2)}, ${Math.round(p3)}, ${p4})`;
var createStringInterpolator2 = (config2) => {
  if (!namedColorRegex)
    namedColorRegex = colors$1 ? (
      // match color names, ignore partial matches
      new RegExp(`(${Object.keys(colors$1).join("|")})(?!\\w)`, "g")
    ) : (
      // never match
      /^\b$/
    );
  const output = config2.output.map((value2) => {
    return getFluidValue(value2).replace(cssVariableRegex, variableToRgba).replace(colorRegex, colorToRgba).replace(namedColorRegex, colorToRgba);
  });
  const keyframes = output.map((value2) => value2.match(numberRegex).map(Number));
  const outputRanges = keyframes[0].map(
    (_2, i2) => keyframes.map((values) => {
      if (!(i2 in values)) {
        throw Error('The arity of each "output" value must be equal');
      }
      return values[i2];
    })
  );
  const interpolators = outputRanges.map(
    (output2) => createInterpolator({ ...config2, output: output2 })
  );
  return (input) => {
    var _a;
    const missingUnit = !unitRegex.test(output[0]) && ((_a = output.find((value2) => unitRegex.test(value2))) == null ? void 0 : _a.replace(numberRegex, ""));
    let i2 = 0;
    return output[0].replace(
      numberRegex,
      () => `${interpolators[i2++](input)}${missingUnit || ""}`
    ).replace(rgbaRegex, rgbaRound);
  };
};
var prefix = "react-spring: ";
var once = (fn2) => {
  const func = fn2;
  let called = false;
  if (typeof func != "function") {
    throw new TypeError(`${prefix}once requires a function parameter`);
  }
  return (...args) => {
    if (!called) {
      func(...args);
      called = true;
    }
  };
};
var warnInterpolate = once(console.warn);
function deprecateInterpolate() {
  warnInterpolate(
    `${prefix}The "interpolate" function is deprecated in v9 (use "to" instead)`
  );
}
var warnDirectCall = once(console.warn);
function deprecateDirectCall() {
  warnDirectCall(
    `${prefix}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`
  );
}
function isAnimatedString(value2) {
  return is$1.str(value2) && (value2[0] == "#" || /\d/.test(value2) || // Do not identify a CSS variable as an AnimatedString if its SSR
  !isSSR() && cssVariableRegex.test(value2) || value2 in (colors$1 || {}));
}
var useIsomorphicLayoutEffect = isSSR() ? reactExports.useEffect : reactExports.useLayoutEffect;
var useIsMounted = () => {
  const isMounted = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};
function useForceUpdate() {
  const update2 = reactExports.useState()[1];
  const isMounted = useIsMounted();
  return () => {
    if (isMounted.current) {
      update2(Math.random());
    }
  };
}
function useMemoOne(getResult, inputs) {
  const [initial] = reactExports.useState(
    () => ({
      inputs,
      result: getResult()
    })
  );
  const committed = reactExports.useRef();
  const prevCache = committed.current;
  let cache = prevCache;
  if (cache) {
    const useCache = Boolean(
      inputs && cache.inputs && areInputsEqual(inputs, cache.inputs)
    );
    if (!useCache) {
      cache = {
        inputs,
        result: getResult()
      };
    }
  } else {
    cache = initial;
  }
  reactExports.useEffect(() => {
    committed.current = cache;
    if (prevCache == initial) {
      initial.inputs = initial.result = void 0;
    }
  }, [cache]);
  return cache.result;
}
function areInputsEqual(next, prev) {
  if (next.length !== prev.length) {
    return false;
  }
  for (let i2 = 0; i2 < next.length; i2++) {
    if (next[i2] !== prev[i2]) {
      return false;
    }
  }
  return true;
}
var useOnce = (effect) => reactExports.useEffect(effect, emptyDeps);
var emptyDeps = [];
function usePrev(value2) {
  const prevRef = reactExports.useRef();
  reactExports.useEffect(() => {
    prevRef.current = value2;
  });
  return prevRef.current;
}
var $node = Symbol.for("Animated:node");
var isAnimated = (value2) => !!value2 && value2[$node] === value2;
var getAnimated = (owner) => owner && owner[$node];
var setAnimated = (owner, node) => defineHidden(owner, $node, node);
var getPayload = (owner) => owner && owner[$node] && owner[$node].getPayload();
var Animated = class {
  constructor() {
    setAnimated(this, this);
  }
  /** Get every `AnimatedValue` used by this node. */
  getPayload() {
    return this.payload || [];
  }
};
var AnimatedValue = class extends Animated {
  constructor(_value) {
    super();
    this._value = _value;
    this.done = true;
    this.durationProgress = 0;
    if (is$1.num(this._value)) {
      this.lastPosition = this._value;
    }
  }
  /** @internal */
  static create(value2) {
    return new AnimatedValue(value2);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(value2, step) {
    if (is$1.num(value2)) {
      this.lastPosition = value2;
      if (step) {
        value2 = Math.round(value2 / step) * step;
        if (this.done) {
          this.lastPosition = value2;
        }
      }
    }
    if (this._value === value2) {
      return false;
    }
    this._value = value2;
    return true;
  }
  reset() {
    const { done } = this;
    this.done = false;
    if (is$1.num(this._value)) {
      this.elapsedTime = 0;
      this.durationProgress = 0;
      this.lastPosition = this._value;
      if (done)
        this.lastVelocity = null;
      this.v0 = null;
    }
  }
};
var AnimatedString = class extends AnimatedValue {
  constructor(value2) {
    super(0);
    this._string = null;
    this._toString = createInterpolator({
      output: [value2, value2]
    });
  }
  /** @internal */
  static create(value2) {
    return new AnimatedString(value2);
  }
  getValue() {
    const value2 = this._string;
    return value2 == null ? this._string = this._toString(this._value) : value2;
  }
  setValue(value2) {
    if (is$1.str(value2)) {
      if (value2 == this._string) {
        return false;
      }
      this._string = value2;
      this._value = 1;
    } else if (super.setValue(value2)) {
      this._string = null;
    } else {
      return false;
    }
    return true;
  }
  reset(goal) {
    if (goal) {
      this._toString = createInterpolator({
        output: [this.getValue(), goal]
      });
    }
    this._value = 0;
    super.reset();
  }
};
var TreeContext = { dependencies: null };
var AnimatedObject = class extends Animated {
  constructor(source) {
    super();
    this.source = source;
    this.setValue(source);
  }
  getValue(animated2) {
    const values = {};
    eachProp(this.source, (source, key) => {
      if (isAnimated(source)) {
        values[key] = source.getValue(animated2);
      } else if (hasFluidValue(source)) {
        values[key] = getFluidValue(source);
      } else if (!animated2) {
        values[key] = source;
      }
    });
    return values;
  }
  /** Replace the raw object data */
  setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  }
  reset() {
    if (this.payload) {
      each(this.payload, (node) => node.reset());
    }
  }
  /** Create a payload set. */
  _makePayload(source) {
    if (source) {
      const payload = /* @__PURE__ */ new Set();
      eachProp(source, this._addToPayload, payload);
      return Array.from(payload);
    }
  }
  /** Add to a payload set. */
  _addToPayload(source) {
    if (TreeContext.dependencies && hasFluidValue(source)) {
      TreeContext.dependencies.add(source);
    }
    const payload = getPayload(source);
    if (payload) {
      each(payload, (node) => this.add(node));
    }
  }
};
var AnimatedArray = class extends AnimatedObject {
  constructor(source) {
    super(source);
  }
  /** @internal */
  static create(source) {
    return new AnimatedArray(source);
  }
  getValue() {
    return this.source.map((node) => node.getValue());
  }
  setValue(source) {
    const payload = this.getPayload();
    if (source.length == payload.length) {
      return payload.map((node, i2) => node.setValue(source[i2])).some(Boolean);
    }
    super.setValue(source.map(makeAnimated));
    return true;
  }
};
function makeAnimated(value2) {
  const nodeType = isAnimatedString(value2) ? AnimatedString : AnimatedValue;
  return nodeType.create(value2);
}
function getAnimatedType(value2) {
  const parentNode = getAnimated(value2);
  return parentNode ? parentNode.constructor : is$1.arr(value2) ? AnimatedArray : isAnimatedString(value2) ? AnimatedString : AnimatedValue;
}
var withAnimated = (Component, host2) => {
  const hasInstance = (
    // Function components must use "forwardRef" to avoid being
    // re-rendered on every animation frame.
    !is$1.fun(Component) || Component.prototype && Component.prototype.isReactComponent
  );
  return reactExports.forwardRef((givenProps, givenRef) => {
    const instanceRef = reactExports.useRef(null);
    const ref = hasInstance && // eslint-disable-next-line react-hooks/rules-of-hooks
    reactExports.useCallback(
      (value2) => {
        instanceRef.current = updateRef(givenRef, value2);
      },
      [givenRef]
    );
    const [props, deps] = getAnimatedState(givenProps, host2);
    const forceUpdate = useForceUpdate();
    const callback = () => {
      const instance = instanceRef.current;
      if (hasInstance && !instance) {
        return;
      }
      const didUpdate = instance ? host2.applyAnimatedValues(instance, props.getValue(true)) : false;
      if (didUpdate === false) {
        forceUpdate();
      }
    };
    const observer = new PropsObserver(callback, deps);
    const observerRef = reactExports.useRef();
    useIsomorphicLayoutEffect(() => {
      observerRef.current = observer;
      each(deps, (dep) => addFluidObserver(dep, observer));
      return () => {
        if (observerRef.current) {
          each(
            observerRef.current.deps,
            (dep) => removeFluidObserver(dep, observerRef.current)
          );
          raf.cancel(observerRef.current.update);
        }
      };
    });
    reactExports.useEffect(callback, []);
    useOnce(() => () => {
      const observer2 = observerRef.current;
      each(observer2.deps, (dep) => removeFluidObserver(dep, observer2));
    });
    const usedProps = host2.getComponentProps(props.getValue());
    return /* @__PURE__ */ reactExports.createElement(Component, { ...usedProps, ref });
  });
};
var PropsObserver = class {
  constructor(update2, deps) {
    this.update = update2;
    this.deps = deps;
  }
  eventObserved(event) {
    if (event.type == "change") {
      raf.write(this.update);
    }
  }
};
function getAnimatedState(props, host2) {
  const dependencies = /* @__PURE__ */ new Set();
  TreeContext.dependencies = dependencies;
  if (props.style)
    props = {
      ...props,
      style: host2.createAnimatedStyle(props.style)
    };
  props = new AnimatedObject(props);
  TreeContext.dependencies = null;
  return [props, dependencies];
}
function updateRef(ref, value2) {
  if (ref) {
    if (is$1.fun(ref))
      ref(value2);
    else
      ref.current = value2;
  }
  return value2;
}
var cacheKey = Symbol.for("AnimatedComponent");
var createHost = (components, {
  applyAnimatedValues: applyAnimatedValues2 = () => false,
  createAnimatedStyle = (style2) => new AnimatedObject(style2),
  getComponentProps = (props) => props
} = {}) => {
  const hostConfig = {
    applyAnimatedValues: applyAnimatedValues2,
    createAnimatedStyle,
    getComponentProps
  };
  const animated2 = (Component) => {
    const displayName = getDisplayName(Component) || "Anonymous";
    if (is$1.str(Component)) {
      Component = animated2[Component] || (animated2[Component] = withAnimated(Component, hostConfig));
    } else {
      Component = Component[cacheKey] || (Component[cacheKey] = withAnimated(Component, hostConfig));
    }
    Component.displayName = `Animated(${displayName})`;
    return Component;
  };
  eachProp(components, (Component, key) => {
    if (is$1.arr(components)) {
      key = getDisplayName(Component);
    }
    animated2[key] = animated2(Component);
  });
  return {
    animated: animated2
  };
};
var getDisplayName = (arg) => is$1.str(arg) ? arg : arg && is$1.str(arg.displayName) ? arg.displayName : is$1.fun(arg) && arg.name || null;
function callProp(value2, ...args) {
  return is$1.fun(value2) ? value2(...args) : value2;
}
var matchProp = (value2, key) => value2 === true || !!(key && value2 && (is$1.fun(value2) ? value2(key) : toArray(value2).includes(key)));
var resolveProp = (prop, key) => is$1.obj(prop) ? key && prop[key] : prop;
var getDefaultProp = (props, key) => props.default === true ? props[key] : props.default ? props.default[key] : void 0;
var noopTransform = (value2) => value2;
var getDefaultProps = (props, transform = noopTransform) => {
  let keys = DEFAULT_PROPS;
  if (props.default && props.default !== true) {
    props = props.default;
    keys = Object.keys(props);
  }
  const defaults2 = {};
  for (const key of keys) {
    const value2 = transform(props[key], key);
    if (!is$1.und(value2)) {
      defaults2[key] = value2;
    }
  }
  return defaults2;
};
var DEFAULT_PROPS = [
  "config",
  "onProps",
  "onStart",
  "onChange",
  "onPause",
  "onResume",
  "onRest"
];
var RESERVED_PROPS = {
  config: 1,
  from: 1,
  to: 1,
  ref: 1,
  loop: 1,
  reset: 1,
  pause: 1,
  cancel: 1,
  reverse: 1,
  immediate: 1,
  default: 1,
  delay: 1,
  onProps: 1,
  onStart: 1,
  onChange: 1,
  onPause: 1,
  onResume: 1,
  onRest: 1,
  onResolve: 1,
  // Transition props
  items: 1,
  trail: 1,
  sort: 1,
  expires: 1,
  initial: 1,
  enter: 1,
  update: 1,
  leave: 1,
  children: 1,
  onDestroyed: 1,
  // Internal props
  keys: 1,
  callId: 1,
  parentId: 1
};
function getForwardProps(props) {
  const forward = {};
  let count = 0;
  eachProp(props, (value2, prop) => {
    if (!RESERVED_PROPS[prop]) {
      forward[prop] = value2;
      count++;
    }
  });
  if (count) {
    return forward;
  }
}
function inferTo(props) {
  const to2 = getForwardProps(props);
  if (to2) {
    const out = { to: to2 };
    eachProp(props, (val, key) => key in to2 || (out[key] = val));
    return out;
  }
  return { ...props };
}
function computeGoal(value2) {
  value2 = getFluidValue(value2);
  return is$1.arr(value2) ? value2.map(computeGoal) : isAnimatedString(value2) ? globals_exports.createStringInterpolator({
    range: [0, 1],
    output: [value2, value2]
  })(1) : value2;
}
function hasProps(props) {
  for (const _2 in props)
    return true;
  return false;
}
function isAsyncTo(to2) {
  return is$1.fun(to2) || is$1.arr(to2) && is$1.obj(to2[0]);
}
function detachRefs(ctrl, ref) {
  var _a;
  (_a = ctrl.ref) == null ? void 0 : _a.delete(ctrl);
  ref == null ? void 0 : ref.delete(ctrl);
}
function replaceRef(ctrl, ref) {
  var _a;
  if (ref && ctrl.ref !== ref) {
    (_a = ctrl.ref) == null ? void 0 : _a.delete(ctrl);
    ref.add(ctrl);
    ctrl.ref = ref;
  }
}
var config$1 = {
  default: { tension: 170, friction: 26 },
  gentle: { tension: 120, friction: 14 },
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
  slow: { tension: 280, friction: 60 },
  molasses: { tension: 280, friction: 120 }
};
var defaults = {
  ...config$1.default,
  mass: 1,
  damping: 1,
  easing: easings.linear,
  clamp: false
};
var AnimationConfig = class {
  constructor() {
    this.velocity = 0;
    Object.assign(this, defaults);
  }
};
function mergeConfig(config2, newConfig, defaultConfig) {
  if (defaultConfig) {
    defaultConfig = { ...defaultConfig };
    sanitizeConfig(defaultConfig, newConfig);
    newConfig = { ...defaultConfig, ...newConfig };
  }
  sanitizeConfig(config2, newConfig);
  Object.assign(config2, newConfig);
  for (const key in defaults) {
    if (config2[key] == null) {
      config2[key] = defaults[key];
    }
  }
  let { frequency, damping } = config2;
  const { mass } = config2;
  if (!is$1.und(frequency)) {
    if (frequency < 0.01)
      frequency = 0.01;
    if (damping < 0)
      damping = 0;
    config2.tension = Math.pow(2 * Math.PI / frequency, 2) * mass;
    config2.friction = 4 * Math.PI * damping * mass / frequency;
  }
  return config2;
}
function sanitizeConfig(config2, props) {
  if (!is$1.und(props.decay)) {
    config2.duration = void 0;
  } else {
    const isTensionConfig = !is$1.und(props.tension) || !is$1.und(props.friction);
    if (isTensionConfig || !is$1.und(props.frequency) || !is$1.und(props.damping) || !is$1.und(props.mass)) {
      config2.duration = void 0;
      config2.decay = void 0;
    }
    if (isTensionConfig) {
      config2.frequency = void 0;
    }
  }
}
var emptyArray = [];
var Animation = class {
  constructor() {
    this.changed = false;
    this.values = emptyArray;
    this.toValues = null;
    this.fromValues = emptyArray;
    this.config = new AnimationConfig();
    this.immediate = false;
  }
};
function scheduleProps(callId, { key, props, defaultProps, state: state2, actions }) {
  return new Promise((resolve, reject) => {
    let delay;
    let timeout;
    let cancel = matchProp(props.cancel ?? (defaultProps == null ? void 0 : defaultProps.cancel), key);
    if (cancel) {
      onStart();
    } else {
      if (!is$1.und(props.pause)) {
        state2.paused = matchProp(props.pause, key);
      }
      let pause = defaultProps == null ? void 0 : defaultProps.pause;
      if (pause !== true) {
        pause = state2.paused || matchProp(pause, key);
      }
      delay = callProp(props.delay || 0, key);
      if (pause) {
        state2.resumeQueue.add(onResume);
        actions.pause();
      } else {
        actions.resume();
        onResume();
      }
    }
    function onPause() {
      state2.resumeQueue.add(onResume);
      state2.timeouts.delete(timeout);
      timeout.cancel();
      delay = timeout.time - raf.now();
    }
    function onResume() {
      if (delay > 0 && !globals_exports.skipAnimation) {
        state2.delayed = true;
        timeout = raf.setTimeout(onStart, delay);
        state2.pauseQueue.add(onPause);
        state2.timeouts.add(timeout);
      } else {
        onStart();
      }
    }
    function onStart() {
      if (state2.delayed) {
        state2.delayed = false;
      }
      state2.pauseQueue.delete(onPause);
      state2.timeouts.delete(timeout);
      if (callId <= (state2.cancelId || 0)) {
        cancel = true;
      }
      try {
        actions.start({ ...props, callId, cancel }, resolve);
      } catch (err) {
        reject(err);
      }
    }
  });
}
var getCombinedResult = (target2, results) => results.length == 1 ? results[0] : results.some((result) => result.cancelled) ? getCancelledResult(target2.get()) : results.every((result) => result.noop) ? getNoopResult(target2.get()) : getFinishedResult(
  target2.get(),
  results.every((result) => result.finished)
);
var getNoopResult = (value2) => ({
  value: value2,
  noop: true,
  finished: true,
  cancelled: false
});
var getFinishedResult = (value2, finished, cancelled = false) => ({
  value: value2,
  finished,
  cancelled
});
var getCancelledResult = (value2) => ({
  value: value2,
  cancelled: true,
  finished: false
});
function runAsync(to2, props, state2, target2) {
  const { callId, parentId, onRest } = props;
  const { asyncTo: prevTo, promise: prevPromise } = state2;
  if (!parentId && to2 === prevTo && !props.reset) {
    return prevPromise;
  }
  return state2.promise = (async () => {
    state2.asyncId = callId;
    state2.asyncTo = to2;
    const defaultProps = getDefaultProps(
      props,
      (value2, key) => (
        // The `onRest` prop is only called when the `runAsync` promise is resolved.
        key === "onRest" ? void 0 : value2
      )
    );
    let preventBail;
    let bail;
    const bailPromise = new Promise(
      (resolve, reject) => (preventBail = resolve, bail = reject)
    );
    const bailIfEnded = (bailSignal) => {
      const bailResult = (
        // The `cancel` prop or `stop` method was used.
        callId <= (state2.cancelId || 0) && getCancelledResult(target2) || // The async `to` prop was replaced.
        callId !== state2.asyncId && getFinishedResult(target2, false)
      );
      if (bailResult) {
        bailSignal.result = bailResult;
        bail(bailSignal);
        throw bailSignal;
      }
    };
    const animate = (arg1, arg2) => {
      const bailSignal = new BailSignal();
      const skipAnimationSignal = new SkipAnimationSignal();
      return (async () => {
        if (globals_exports.skipAnimation) {
          stopAsync(state2);
          skipAnimationSignal.result = getFinishedResult(target2, false);
          bail(skipAnimationSignal);
          throw skipAnimationSignal;
        }
        bailIfEnded(bailSignal);
        const props2 = is$1.obj(arg1) ? { ...arg1 } : { ...arg2, to: arg1 };
        props2.parentId = callId;
        eachProp(defaultProps, (value2, key) => {
          if (is$1.und(props2[key])) {
            props2[key] = value2;
          }
        });
        const result2 = await target2.start(props2);
        bailIfEnded(bailSignal);
        if (state2.paused) {
          await new Promise((resume) => {
            state2.resumeQueue.add(resume);
          });
        }
        return result2;
      })();
    };
    let result;
    if (globals_exports.skipAnimation) {
      stopAsync(state2);
      return getFinishedResult(target2, false);
    }
    try {
      let animating;
      if (is$1.arr(to2)) {
        animating = (async (queue) => {
          for (const props2 of queue) {
            await animate(props2);
          }
        })(to2);
      } else {
        animating = Promise.resolve(to2(animate, target2.stop.bind(target2)));
      }
      await Promise.all([animating.then(preventBail), bailPromise]);
      result = getFinishedResult(target2.get(), true, false);
    } catch (err) {
      if (err instanceof BailSignal) {
        result = err.result;
      } else if (err instanceof SkipAnimationSignal) {
        result = err.result;
      } else {
        throw err;
      }
    } finally {
      if (callId == state2.asyncId) {
        state2.asyncId = parentId;
        state2.asyncTo = parentId ? prevTo : void 0;
        state2.promise = parentId ? prevPromise : void 0;
      }
    }
    if (is$1.fun(onRest)) {
      raf.batchedUpdates(() => {
        onRest(result, target2, target2.item);
      });
    }
    return result;
  })();
}
function stopAsync(state2, cancelId) {
  flush(state2.timeouts, (t2) => t2.cancel());
  state2.pauseQueue.clear();
  state2.resumeQueue.clear();
  state2.asyncId = state2.asyncTo = state2.promise = void 0;
  if (cancelId)
    state2.cancelId = cancelId;
}
var BailSignal = class extends Error {
  constructor() {
    super(
      "An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."
    );
  }
};
var SkipAnimationSignal = class extends Error {
  constructor() {
    super("SkipAnimationSignal");
  }
};
var isFrameValue = (value2) => value2 instanceof FrameValue;
var nextId = 1;
var FrameValue = class extends FluidValue {
  constructor() {
    super(...arguments);
    this.id = nextId++;
    this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(priority2) {
    if (this._priority != priority2) {
      this._priority = priority2;
      this._onPriorityChange(priority2);
    }
  }
  /** Get the current value */
  get() {
    const node = getAnimated(this);
    return node && node.getValue();
  }
  /** Create a spring that maps our value to another value */
  to(...args) {
    return globals_exports.to(this, args);
  }
  /** @deprecated Use the `to` method instead. */
  interpolate(...args) {
    deprecateInterpolate();
    return globals_exports.to(this, args);
  }
  toJSON() {
    return this.get();
  }
  observerAdded(count) {
    if (count == 1)
      this._attach();
  }
  observerRemoved(count) {
    if (count == 0)
      this._detach();
  }
  /** Called when the first child is added. */
  _attach() {
  }
  /** Called when the last child is removed. */
  _detach() {
  }
  /** Tell our children about our new value */
  _onChange(value2, idle = false) {
    callFluidObservers(this, {
      type: "change",
      parent: this,
      value: value2,
      idle
    });
  }
  /** Tell our children about our new priority */
  _onPriorityChange(priority2) {
    if (!this.idle) {
      frameLoop.sort(this);
    }
    callFluidObservers(this, {
      type: "priority",
      parent: this,
      priority: priority2
    });
  }
};
var $P = Symbol.for("SpringPhase");
var HAS_ANIMATED = 1;
var IS_ANIMATING = 2;
var IS_PAUSED = 4;
var hasAnimated = (target2) => (target2[$P] & HAS_ANIMATED) > 0;
var isAnimating = (target2) => (target2[$P] & IS_ANIMATING) > 0;
var isPaused = (target2) => (target2[$P] & IS_PAUSED) > 0;
var setActiveBit = (target2, active2) => active2 ? target2[$P] |= IS_ANIMATING | HAS_ANIMATED : target2[$P] &= ~IS_ANIMATING;
var setPausedBit = (target2, paused) => paused ? target2[$P] |= IS_PAUSED : target2[$P] &= ~IS_PAUSED;
var SpringValue = class extends FrameValue {
  constructor(arg1, arg2) {
    super();
    this.animation = new Animation();
    this.defaultProps = {};
    this._state = {
      paused: false,
      delayed: false,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    };
    this._pendingCalls = /* @__PURE__ */ new Set();
    this._lastCallId = 0;
    this._lastToId = 0;
    this._memoizedDuration = 0;
    if (!is$1.und(arg1) || !is$1.und(arg2)) {
      const props = is$1.obj(arg1) ? { ...arg1 } : { ...arg2, from: arg1 };
      if (is$1.und(props.default)) {
        props.default = true;
      }
      this.start(props);
    }
  }
  /** Equals true when not advancing on each frame. */
  get idle() {
    return !(isAnimating(this) || this._state.asyncTo) || isPaused(this);
  }
  get goal() {
    return getFluidValue(this.animation.to);
  }
  get velocity() {
    const node = getAnimated(this);
    return node instanceof AnimatedValue ? node.lastVelocity || 0 : node.getPayload().map((node2) => node2.lastVelocity || 0);
  }
  /**
   * When true, this value has been animated at least once.
   */
  get hasAnimated() {
    return hasAnimated(this);
  }
  /**
   * When true, this value has an unfinished animation,
   * which is either active or paused.
   */
  get isAnimating() {
    return isAnimating(this);
  }
  /**
   * When true, all current and future animations are paused.
   */
  get isPaused() {
    return isPaused(this);
  }
  /**
   *
   *
   */
  get isDelayed() {
    return this._state.delayed;
  }
  /** Advance the current animation by a number of milliseconds */
  advance(dt) {
    let idle = true;
    let changed = false;
    const anim = this.animation;
    let { toValues } = anim;
    const { config: config2 } = anim;
    const payload = getPayload(anim.to);
    if (!payload && hasFluidValue(anim.to)) {
      toValues = toArray(getFluidValue(anim.to));
    }
    anim.values.forEach((node2, i2) => {
      if (node2.done)
        return;
      const to2 = (
        // Animated strings always go from 0 to 1.
        node2.constructor == AnimatedString ? 1 : payload ? payload[i2].lastPosition : toValues[i2]
      );
      let finished = anim.immediate;
      let position = to2;
      if (!finished) {
        position = node2.lastPosition;
        if (config2.tension <= 0) {
          node2.done = true;
          return;
        }
        let elapsed = node2.elapsedTime += dt;
        const from = anim.fromValues[i2];
        const v0 = node2.v0 != null ? node2.v0 : node2.v0 = is$1.arr(config2.velocity) ? config2.velocity[i2] : config2.velocity;
        let velocity;
        const precision = config2.precision || (from == to2 ? 5e-3 : Math.min(1, Math.abs(to2 - from) * 1e-3));
        if (!is$1.und(config2.duration)) {
          let p2 = 1;
          if (config2.duration > 0) {
            if (this._memoizedDuration !== config2.duration) {
              this._memoizedDuration = config2.duration;
              if (node2.durationProgress > 0) {
                node2.elapsedTime = config2.duration * node2.durationProgress;
                elapsed = node2.elapsedTime += dt;
              }
            }
            p2 = (config2.progress || 0) + elapsed / this._memoizedDuration;
            p2 = p2 > 1 ? 1 : p2 < 0 ? 0 : p2;
            node2.durationProgress = p2;
          }
          position = from + config2.easing(p2) * (to2 - from);
          velocity = (position - node2.lastPosition) / dt;
          finished = p2 == 1;
        } else if (config2.decay) {
          const decay = config2.decay === true ? 0.998 : config2.decay;
          const e2 = Math.exp(-(1 - decay) * elapsed);
          position = from + v0 / (1 - decay) * (1 - e2);
          finished = Math.abs(node2.lastPosition - position) <= precision;
          velocity = v0 * e2;
        } else {
          velocity = node2.lastVelocity == null ? v0 : node2.lastVelocity;
          const restVelocity = config2.restVelocity || precision / 10;
          const bounceFactor = config2.clamp ? 0 : config2.bounce;
          const canBounce = !is$1.und(bounceFactor);
          const isGrowing = from == to2 ? node2.v0 > 0 : from < to2;
          let isMoving;
          let isBouncing = false;
          const step = 1;
          const numSteps = Math.ceil(dt / step);
          for (let n2 = 0; n2 < numSteps; ++n2) {
            isMoving = Math.abs(velocity) > restVelocity;
            if (!isMoving) {
              finished = Math.abs(to2 - position) <= precision;
              if (finished) {
                break;
              }
            }
            if (canBounce) {
              isBouncing = position == to2 || position > to2 == isGrowing;
              if (isBouncing) {
                velocity = -velocity * bounceFactor;
                position = to2;
              }
            }
            const springForce = -config2.tension * 1e-6 * (position - to2);
            const dampingForce = -config2.friction * 1e-3 * velocity;
            const acceleration = (springForce + dampingForce) / config2.mass;
            velocity = velocity + acceleration * step;
            position = position + velocity * step;
          }
        }
        node2.lastVelocity = velocity;
        if (Number.isNaN(position)) {
          console.warn(`Got NaN while animating:`, this);
          finished = true;
        }
      }
      if (payload && !payload[i2].done) {
        finished = false;
      }
      if (finished) {
        node2.done = true;
      } else {
        idle = false;
      }
      if (node2.setValue(position, config2.round)) {
        changed = true;
      }
    });
    const node = getAnimated(this);
    const currVal = node.getValue();
    if (idle) {
      const finalVal = getFluidValue(anim.to);
      if ((currVal !== finalVal || changed) && !config2.decay) {
        node.setValue(finalVal);
        this._onChange(finalVal);
      } else if (changed && config2.decay) {
        this._onChange(currVal);
      }
      this._stop();
    } else if (changed) {
      this._onChange(currVal);
    }
  }
  /** Set the current value, while stopping the current animation */
  set(value2) {
    raf.batchedUpdates(() => {
      this._stop();
      this._focus(value2);
      this._set(value2);
    });
    return this;
  }
  /**
   * Freeze the active animation in time, as well as any updates merged
   * before `resume` is called.
   */
  pause() {
    this._update({ pause: true });
  }
  /** Resume the animation if paused. */
  resume() {
    this._update({ pause: false });
  }
  /** Skip to the end of the current animation. */
  finish() {
    if (isAnimating(this)) {
      const { to: to2, config: config2 } = this.animation;
      raf.batchedUpdates(() => {
        this._onStart();
        if (!config2.decay) {
          this._set(to2, false);
        }
        this._stop();
      });
    }
    return this;
  }
  /** Push props into the pending queue. */
  update(props) {
    const queue = this.queue || (this.queue = []);
    queue.push(props);
    return this;
  }
  start(to2, arg2) {
    let queue;
    if (!is$1.und(to2)) {
      queue = [is$1.obj(to2) ? to2 : { ...arg2, to: to2 }];
    } else {
      queue = this.queue || [];
      this.queue = [];
    }
    return Promise.all(
      queue.map((props) => {
        const up = this._update(props);
        return up;
      })
    ).then((results) => getCombinedResult(this, results));
  }
  /**
   * Stop the current animation, and cancel any delayed updates.
   *
   * Pass `true` to call `onRest` with `cancelled: true`.
   */
  stop(cancel) {
    const { to: to2 } = this.animation;
    this._focus(this.get());
    stopAsync(this._state, cancel && this._lastCallId);
    raf.batchedUpdates(() => this._stop(to2, cancel));
    return this;
  }
  /** Restart the animation. */
  reset() {
    this._update({ reset: true });
  }
  /** @internal */
  eventObserved(event) {
    if (event.type == "change") {
      this._start();
    } else if (event.type == "priority") {
      this.priority = event.priority + 1;
    }
  }
  /**
   * Parse the `to` and `from` range from the given `props` object.
   *
   * This also ensures the initial value is available to animated components
   * during the render phase.
   */
  _prepareNode(props) {
    const key = this.key || "";
    let { to: to2, from } = props;
    to2 = is$1.obj(to2) ? to2[key] : to2;
    if (to2 == null || isAsyncTo(to2)) {
      to2 = void 0;
    }
    from = is$1.obj(from) ? from[key] : from;
    if (from == null) {
      from = void 0;
    }
    const range = { to: to2, from };
    if (!hasAnimated(this)) {
      if (props.reverse)
        [to2, from] = [from, to2];
      from = getFluidValue(from);
      if (!is$1.und(from)) {
        this._set(from);
      } else if (!getAnimated(this)) {
        this._set(to2);
      }
    }
    return range;
  }
  /** Every update is processed by this method before merging. */
  _update({ ...props }, isLoop) {
    const { key, defaultProps } = this;
    if (props.default)
      Object.assign(
        defaultProps,
        getDefaultProps(
          props,
          (value2, prop) => /^on/.test(prop) ? resolveProp(value2, key) : value2
        )
      );
    mergeActiveFn(this, props, "onProps");
    sendEvent(this, "onProps", props, this);
    const range = this._prepareNode(props);
    if (Object.isFrozen(this)) {
      throw Error(
        "Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?"
      );
    }
    const state2 = this._state;
    return scheduleProps(++this._lastCallId, {
      key,
      props,
      defaultProps,
      state: state2,
      actions: {
        pause: () => {
          if (!isPaused(this)) {
            setPausedBit(this, true);
            flushCalls(state2.pauseQueue);
            sendEvent(
              this,
              "onPause",
              getFinishedResult(this, checkFinished(this, this.animation.to)),
              this
            );
          }
        },
        resume: () => {
          if (isPaused(this)) {
            setPausedBit(this, false);
            if (isAnimating(this)) {
              this._resume();
            }
            flushCalls(state2.resumeQueue);
            sendEvent(
              this,
              "onResume",
              getFinishedResult(this, checkFinished(this, this.animation.to)),
              this
            );
          }
        },
        start: this._merge.bind(this, range)
      }
    }).then((result) => {
      if (props.loop && result.finished && !(isLoop && result.noop)) {
        const nextProps = createLoopUpdate(props);
        if (nextProps) {
          return this._update(nextProps, true);
        }
      }
      return result;
    });
  }
  /** Merge props into the current animation */
  _merge(range, props, resolve) {
    if (props.cancel) {
      this.stop(true);
      return resolve(getCancelledResult(this));
    }
    const hasToProp = !is$1.und(range.to);
    const hasFromProp = !is$1.und(range.from);
    if (hasToProp || hasFromProp) {
      if (props.callId > this._lastToId) {
        this._lastToId = props.callId;
      } else {
        return resolve(getCancelledResult(this));
      }
    }
    const { key, defaultProps, animation: anim } = this;
    const { to: prevTo, from: prevFrom } = anim;
    let { to: to2 = prevTo, from = prevFrom } = range;
    if (hasFromProp && !hasToProp && (!props.default || is$1.und(to2))) {
      to2 = from;
    }
    if (props.reverse)
      [to2, from] = [from, to2];
    const hasFromChanged = !isEqual(from, prevFrom);
    if (hasFromChanged) {
      anim.from = from;
    }
    from = getFluidValue(from);
    const hasToChanged = !isEqual(to2, prevTo);
    if (hasToChanged) {
      this._focus(to2);
    }
    const hasAsyncTo = isAsyncTo(props.to);
    const { config: config2 } = anim;
    const { decay, velocity } = config2;
    if (hasToProp || hasFromProp) {
      config2.velocity = 0;
    }
    if (props.config && !hasAsyncTo) {
      mergeConfig(
        config2,
        callProp(props.config, key),
        // Avoid calling the same "config" prop twice.
        props.config !== defaultProps.config ? callProp(defaultProps.config, key) : void 0
      );
    }
    let node = getAnimated(this);
    if (!node || is$1.und(to2)) {
      return resolve(getFinishedResult(this, true));
    }
    const reset = (
      // When `reset` is undefined, the `from` prop implies `reset: true`,
      // except for declarative updates. When `reset` is defined, there
      // must exist a value to animate from.
      is$1.und(props.reset) ? hasFromProp && !props.default : !is$1.und(from) && matchProp(props.reset, key)
    );
    const value2 = reset ? from : this.get();
    const goal = computeGoal(to2);
    const isAnimatable = is$1.num(goal) || is$1.arr(goal) || isAnimatedString(goal);
    const immediate = !hasAsyncTo && (!isAnimatable || matchProp(defaultProps.immediate || props.immediate, key));
    if (hasToChanged) {
      const nodeType = getAnimatedType(to2);
      if (nodeType !== node.constructor) {
        if (immediate) {
          node = this._set(goal);
        } else
          throw Error(
            `Cannot animate between ${node.constructor.name} and ${nodeType.name}, as the "to" prop suggests`
          );
      }
    }
    const goalType = node.constructor;
    let started = hasFluidValue(to2);
    let finished = false;
    if (!started) {
      const hasValueChanged = reset || !hasAnimated(this) && hasFromChanged;
      if (hasToChanged || hasValueChanged) {
        finished = isEqual(computeGoal(value2), goal);
        started = !finished;
      }
      if (!isEqual(anim.immediate, immediate) && !immediate || !isEqual(config2.decay, decay) || !isEqual(config2.velocity, velocity)) {
        started = true;
      }
    }
    if (finished && isAnimating(this)) {
      if (anim.changed && !reset) {
        started = true;
      } else if (!started) {
        this._stop(prevTo);
      }
    }
    if (!hasAsyncTo) {
      if (started || hasFluidValue(prevTo)) {
        anim.values = node.getPayload();
        anim.toValues = hasFluidValue(to2) ? null : goalType == AnimatedString ? [1] : toArray(goal);
      }
      if (anim.immediate != immediate) {
        anim.immediate = immediate;
        if (!immediate && !reset) {
          this._set(prevTo);
        }
      }
      if (started) {
        const { onRest } = anim;
        each(ACTIVE_EVENTS, (type) => mergeActiveFn(this, props, type));
        const result = getFinishedResult(this, checkFinished(this, prevTo));
        flushCalls(this._pendingCalls, result);
        this._pendingCalls.add(resolve);
        if (anim.changed)
          raf.batchedUpdates(() => {
            var _a;
            anim.changed = !reset;
            onRest == null ? void 0 : onRest(result, this);
            if (reset) {
              callProp(defaultProps.onRest, result);
            } else {
              (_a = anim.onStart) == null ? void 0 : _a.call(anim, result, this);
            }
          });
      }
    }
    if (reset) {
      this._set(value2);
    }
    if (hasAsyncTo) {
      resolve(runAsync(props.to, props, this._state, this));
    } else if (started) {
      this._start();
    } else if (isAnimating(this) && !hasToChanged) {
      this._pendingCalls.add(resolve);
    } else {
      resolve(getNoopResult(value2));
    }
  }
  /** Update the `animation.to` value, which might be a `FluidValue` */
  _focus(value2) {
    const anim = this.animation;
    if (value2 !== anim.to) {
      if (getFluidObservers(this)) {
        this._detach();
      }
      anim.to = value2;
      if (getFluidObservers(this)) {
        this._attach();
      }
    }
  }
  _attach() {
    let priority2 = 0;
    const { to: to2 } = this.animation;
    if (hasFluidValue(to2)) {
      addFluidObserver(to2, this);
      if (isFrameValue(to2)) {
        priority2 = to2.priority + 1;
      }
    }
    this.priority = priority2;
  }
  _detach() {
    const { to: to2 } = this.animation;
    if (hasFluidValue(to2)) {
      removeFluidObserver(to2, this);
    }
  }
  /**
   * Update the current value from outside the frameloop,
   * and return the `Animated` node.
   */
  _set(arg, idle = true) {
    const value2 = getFluidValue(arg);
    if (!is$1.und(value2)) {
      const oldNode = getAnimated(this);
      if (!oldNode || !isEqual(value2, oldNode.getValue())) {
        const nodeType = getAnimatedType(value2);
        if (!oldNode || oldNode.constructor != nodeType) {
          setAnimated(this, nodeType.create(value2));
        } else {
          oldNode.setValue(value2);
        }
        if (oldNode) {
          raf.batchedUpdates(() => {
            this._onChange(value2, idle);
          });
        }
      }
    }
    return getAnimated(this);
  }
  _onStart() {
    const anim = this.animation;
    if (!anim.changed) {
      anim.changed = true;
      sendEvent(
        this,
        "onStart",
        getFinishedResult(this, checkFinished(this, anim.to)),
        this
      );
    }
  }
  _onChange(value2, idle) {
    if (!idle) {
      this._onStart();
      callProp(this.animation.onChange, value2, this);
    }
    callProp(this.defaultProps.onChange, value2, this);
    super._onChange(value2, idle);
  }
  // This method resets the animation state (even if already animating) to
  // ensure the latest from/to range is used, and it also ensures this spring
  // is added to the frameloop.
  _start() {
    const anim = this.animation;
    getAnimated(this).reset(getFluidValue(anim.to));
    if (!anim.immediate) {
      anim.fromValues = anim.values.map((node) => node.lastPosition);
    }
    if (!isAnimating(this)) {
      setActiveBit(this, true);
      if (!isPaused(this)) {
        this._resume();
      }
    }
  }
  _resume() {
    if (globals_exports.skipAnimation) {
      this.finish();
    } else {
      frameLoop.start(this);
    }
  }
  /**
   * Exit the frameloop and notify `onRest` listeners.
   *
   * Always wrap `_stop` calls with `batchedUpdates`.
   */
  _stop(goal, cancel) {
    if (isAnimating(this)) {
      setActiveBit(this, false);
      const anim = this.animation;
      each(anim.values, (node) => {
        node.done = true;
      });
      if (anim.toValues) {
        anim.onChange = anim.onPause = anim.onResume = void 0;
      }
      callFluidObservers(this, {
        type: "idle",
        parent: this
      });
      const result = cancel ? getCancelledResult(this.get()) : getFinishedResult(this.get(), checkFinished(this, goal ?? anim.to));
      flushCalls(this._pendingCalls, result);
      if (anim.changed) {
        anim.changed = false;
        sendEvent(this, "onRest", result, this);
      }
    }
  }
};
function checkFinished(target2, to2) {
  const goal = computeGoal(to2);
  const value2 = computeGoal(target2.get());
  return isEqual(value2, goal);
}
function createLoopUpdate(props, loop2 = props.loop, to2 = props.to) {
  const loopRet = callProp(loop2);
  if (loopRet) {
    const overrides = loopRet !== true && inferTo(loopRet);
    const reverse = (overrides || props).reverse;
    const reset = !overrides || overrides.reset;
    return createUpdate({
      ...props,
      loop: loop2,
      // Avoid updating default props when looping.
      default: false,
      // Never loop the `pause` prop.
      pause: void 0,
      // For the "reverse" prop to loop as expected, the "to" prop
      // must be undefined. The "reverse" prop is ignored when the
      // "to" prop is an array or function.
      to: !reverse || isAsyncTo(to2) ? to2 : void 0,
      // Ignore the "from" prop except on reset.
      from: reset ? props.from : void 0,
      reset,
      // The "loop" prop can return a "useSpring" props object to
      // override any of the original props.
      ...overrides
    });
  }
}
function createUpdate(props) {
  const { to: to2, from } = props = inferTo(props);
  const keys = /* @__PURE__ */ new Set();
  if (is$1.obj(to2))
    findDefined(to2, keys);
  if (is$1.obj(from))
    findDefined(from, keys);
  props.keys = keys.size ? Array.from(keys) : null;
  return props;
}
function declareUpdate(props) {
  const update2 = createUpdate(props);
  if (is$1.und(update2.default)) {
    update2.default = getDefaultProps(update2);
  }
  return update2;
}
function findDefined(values, keys) {
  eachProp(values, (value2, key) => value2 != null && keys.add(key));
}
var ACTIVE_EVENTS = [
  "onStart",
  "onRest",
  "onChange",
  "onPause",
  "onResume"
];
function mergeActiveFn(target2, props, type) {
  target2.animation[type] = props[type] !== getDefaultProp(props, type) ? resolveProp(props[type], target2.key) : void 0;
}
function sendEvent(target2, type, ...args) {
  var _a, _b, _c, _d;
  (_b = (_a = target2.animation)[type]) == null ? void 0 : _b.call(_a, ...args);
  (_d = (_c = target2.defaultProps)[type]) == null ? void 0 : _d.call(_c, ...args);
}
var BATCHED_EVENTS = ["onStart", "onChange", "onRest"];
var nextId2 = 1;
var Controller = class {
  constructor(props, flush3) {
    this.id = nextId2++;
    this.springs = {};
    this.queue = [];
    this._lastAsyncId = 0;
    this._active = /* @__PURE__ */ new Set();
    this._changed = /* @__PURE__ */ new Set();
    this._started = false;
    this._state = {
      paused: false,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    };
    this._events = {
      onStart: /* @__PURE__ */ new Map(),
      onChange: /* @__PURE__ */ new Map(),
      onRest: /* @__PURE__ */ new Map()
    };
    this._onFrame = this._onFrame.bind(this);
    if (flush3) {
      this._flush = flush3;
    }
    if (props) {
      this.start({ default: true, ...props });
    }
  }
  /**
   * Equals `true` when no spring values are in the frameloop, and
   * no async animation is currently active.
   */
  get idle() {
    return !this._state.asyncTo && Object.values(this.springs).every((spring) => {
      return spring.idle && !spring.isDelayed && !spring.isPaused;
    });
  }
  get item() {
    return this._item;
  }
  set item(item) {
    this._item = item;
  }
  /** Get the current values of our springs */
  get() {
    const values = {};
    this.each((spring, key) => values[key] = spring.get());
    return values;
  }
  /** Set the current values without animating. */
  set(values) {
    for (const key in values) {
      const value2 = values[key];
      if (!is$1.und(value2)) {
        this.springs[key].set(value2);
      }
    }
  }
  /** Push an update onto the queue of each value. */
  update(props) {
    if (props) {
      this.queue.push(createUpdate(props));
    }
    return this;
  }
  /**
   * Start the queued animations for every spring, and resolve the returned
   * promise once all queued animations have finished or been cancelled.
   *
   * When you pass a queue (instead of nothing), that queue is used instead of
   * the queued animations added with the `update` method, which are left alone.
   */
  start(props) {
    let { queue } = this;
    if (props) {
      queue = toArray(props).map(createUpdate);
    } else {
      this.queue = [];
    }
    if (this._flush) {
      return this._flush(this, queue);
    }
    prepareKeys(this, queue);
    return flushUpdateQueue(this, queue);
  }
  /** @internal */
  stop(arg, keys) {
    if (arg !== !!arg) {
      keys = arg;
    }
    if (keys) {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].stop(!!arg));
    } else {
      stopAsync(this._state, this._lastAsyncId);
      this.each((spring) => spring.stop(!!arg));
    }
    return this;
  }
  /** Freeze the active animation in time */
  pause(keys) {
    if (is$1.und(keys)) {
      this.start({ pause: true });
    } else {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].pause());
    }
    return this;
  }
  /** Resume the animation if paused. */
  resume(keys) {
    if (is$1.und(keys)) {
      this.start({ pause: false });
    } else {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].resume());
    }
    return this;
  }
  /** Call a function once per spring value */
  each(iterator) {
    eachProp(this.springs, iterator);
  }
  /** @internal Called at the end of every animation frame */
  _onFrame() {
    const { onStart, onChange, onRest } = this._events;
    const active2 = this._active.size > 0;
    const changed = this._changed.size > 0;
    if (active2 && !this._started || changed && !this._started) {
      this._started = true;
      flush(onStart, ([onStart2, result]) => {
        result.value = this.get();
        onStart2(result, this, this._item);
      });
    }
    const idle = !active2 && this._started;
    const values = changed || idle && onRest.size ? this.get() : null;
    if (changed && onChange.size) {
      flush(onChange, ([onChange2, result]) => {
        result.value = values;
        onChange2(result, this, this._item);
      });
    }
    if (idle) {
      this._started = false;
      flush(onRest, ([onRest2, result]) => {
        result.value = values;
        onRest2(result, this, this._item);
      });
    }
  }
  /** @internal */
  eventObserved(event) {
    if (event.type == "change") {
      this._changed.add(event.parent);
      if (!event.idle) {
        this._active.add(event.parent);
      }
    } else if (event.type == "idle") {
      this._active.delete(event.parent);
    } else
      return;
    raf.onFrame(this._onFrame);
  }
};
function flushUpdateQueue(ctrl, queue) {
  return Promise.all(queue.map((props) => flushUpdate(ctrl, props))).then(
    (results) => getCombinedResult(ctrl, results)
  );
}
async function flushUpdate(ctrl, props, isLoop) {
  const { keys, to: to2, from, loop: loop2, onRest, onResolve } = props;
  const defaults2 = is$1.obj(props.default) && props.default;
  if (loop2) {
    props.loop = false;
  }
  if (to2 === false)
    props.to = null;
  if (from === false)
    props.from = null;
  const asyncTo = is$1.arr(to2) || is$1.fun(to2) ? to2 : void 0;
  if (asyncTo) {
    props.to = void 0;
    props.onRest = void 0;
    if (defaults2) {
      defaults2.onRest = void 0;
    }
  } else {
    each(BATCHED_EVENTS, (key) => {
      const handler = props[key];
      if (is$1.fun(handler)) {
        const queue = ctrl["_events"][key];
        props[key] = ({ finished, cancelled }) => {
          const result2 = queue.get(handler);
          if (result2) {
            if (!finished)
              result2.finished = false;
            if (cancelled)
              result2.cancelled = true;
          } else {
            queue.set(handler, {
              value: null,
              finished: finished || false,
              cancelled: cancelled || false
            });
          }
        };
        if (defaults2) {
          defaults2[key] = props[key];
        }
      }
    });
  }
  const state2 = ctrl["_state"];
  if (props.pause === !state2.paused) {
    state2.paused = props.pause;
    flushCalls(props.pause ? state2.pauseQueue : state2.resumeQueue);
  } else if (state2.paused) {
    props.pause = true;
  }
  const promises = (keys || Object.keys(ctrl.springs)).map(
    (key) => ctrl.springs[key].start(props)
  );
  const cancel = props.cancel === true || getDefaultProp(props, "cancel") === true;
  if (asyncTo || cancel && state2.asyncId) {
    promises.push(
      scheduleProps(++ctrl["_lastAsyncId"], {
        props,
        state: state2,
        actions: {
          pause: noop,
          resume: noop,
          start(props2, resolve) {
            if (cancel) {
              stopAsync(state2, ctrl["_lastAsyncId"]);
              resolve(getCancelledResult(ctrl));
            } else {
              props2.onRest = onRest;
              resolve(
                runAsync(
                  asyncTo,
                  props2,
                  state2,
                  ctrl
                )
              );
            }
          }
        }
      })
    );
  }
  if (state2.paused) {
    await new Promise((resume) => {
      state2.resumeQueue.add(resume);
    });
  }
  const result = getCombinedResult(ctrl, await Promise.all(promises));
  if (loop2 && result.finished && !(isLoop && result.noop)) {
    const nextProps = createLoopUpdate(props, loop2, to2);
    if (nextProps) {
      prepareKeys(ctrl, [nextProps]);
      return flushUpdate(ctrl, nextProps, true);
    }
  }
  if (onResolve) {
    raf.batchedUpdates(() => onResolve(result, ctrl, ctrl.item));
  }
  return result;
}
function getSprings(ctrl, props) {
  const springs = { ...ctrl.springs };
  if (props) {
    each(toArray(props), (props2) => {
      if (is$1.und(props2.keys)) {
        props2 = createUpdate(props2);
      }
      if (!is$1.obj(props2.to)) {
        props2 = { ...props2, to: void 0 };
      }
      prepareSprings(springs, props2, (key) => {
        return createSpring(key);
      });
    });
  }
  setSprings(ctrl, springs);
  return springs;
}
function setSprings(ctrl, springs) {
  eachProp(springs, (spring, key) => {
    if (!ctrl.springs[key]) {
      ctrl.springs[key] = spring;
      addFluidObserver(spring, ctrl);
    }
  });
}
function createSpring(key, observer) {
  const spring = new SpringValue();
  spring.key = key;
  if (observer) {
    addFluidObserver(spring, observer);
  }
  return spring;
}
function prepareSprings(springs, props, create) {
  if (props.keys) {
    each(props.keys, (key) => {
      const spring = springs[key] || (springs[key] = create(key));
      spring["_prepareNode"](props);
    });
  }
}
function prepareKeys(ctrl, queue) {
  each(queue, (props) => {
    prepareSprings(ctrl.springs, props, (key) => {
      return createSpring(key, ctrl);
    });
  });
}
var SpringContext = ({
  children,
  ...props
}) => {
  const inherited = reactExports.useContext(ctx);
  const pause = props.pause || !!inherited.pause, immediate = props.immediate || !!inherited.immediate;
  props = useMemoOne(() => ({ pause, immediate }), [pause, immediate]);
  const { Provider: Provider2 } = ctx;
  return /* @__PURE__ */ reactExports.createElement(Provider2, { value: props }, children);
};
var ctx = makeContext(SpringContext, {});
SpringContext.Provider = ctx.Provider;
SpringContext.Consumer = ctx.Consumer;
function makeContext(target2, init) {
  Object.assign(target2, reactExports.createContext(init));
  target2.Provider._context = target2;
  target2.Consumer._context = target2;
  return target2;
}
var SpringRef = () => {
  const current = [];
  const SpringRef2 = function(props) {
    deprecateDirectCall();
    const results = [];
    each(current, (ctrl, i2) => {
      if (is$1.und(props)) {
        results.push(ctrl.start());
      } else {
        const update2 = _getProps(props, ctrl, i2);
        if (update2) {
          results.push(ctrl.start(update2));
        }
      }
    });
    return results;
  };
  SpringRef2.current = current;
  SpringRef2.add = function(ctrl) {
    if (!current.includes(ctrl)) {
      current.push(ctrl);
    }
  };
  SpringRef2.delete = function(ctrl) {
    const i2 = current.indexOf(ctrl);
    if (~i2)
      current.splice(i2, 1);
  };
  SpringRef2.pause = function() {
    each(current, (ctrl) => ctrl.pause(...arguments));
    return this;
  };
  SpringRef2.resume = function() {
    each(current, (ctrl) => ctrl.resume(...arguments));
    return this;
  };
  SpringRef2.set = function(values) {
    each(current, (ctrl, i2) => {
      const update2 = is$1.fun(values) ? values(i2, ctrl) : values;
      if (update2) {
        ctrl.set(update2);
      }
    });
  };
  SpringRef2.start = function(props) {
    const results = [];
    each(current, (ctrl, i2) => {
      if (is$1.und(props)) {
        results.push(ctrl.start());
      } else {
        const update2 = this._getProps(props, ctrl, i2);
        if (update2) {
          results.push(ctrl.start(update2));
        }
      }
    });
    return results;
  };
  SpringRef2.stop = function() {
    each(current, (ctrl) => ctrl.stop(...arguments));
    return this;
  };
  SpringRef2.update = function(props) {
    each(current, (ctrl, i2) => ctrl.update(this._getProps(props, ctrl, i2)));
    return this;
  };
  const _getProps = function(arg, ctrl, index2) {
    return is$1.fun(arg) ? arg(index2, ctrl) : arg;
  };
  SpringRef2._getProps = _getProps;
  return SpringRef2;
};
function useSprings(length, props, deps) {
  const propsFn = is$1.fun(props) && props;
  if (propsFn && !deps)
    deps = [];
  const ref = reactExports.useMemo(
    () => propsFn || arguments.length == 3 ? SpringRef() : void 0,
    []
  );
  const layoutId = reactExports.useRef(0);
  const forceUpdate = useForceUpdate();
  const state2 = reactExports.useMemo(
    () => ({
      ctrls: [],
      queue: [],
      flush(ctrl, updates2) {
        const springs2 = getSprings(ctrl, updates2);
        const canFlushSync = layoutId.current > 0 && !state2.queue.length && !Object.keys(springs2).some((key) => !ctrl.springs[key]);
        return canFlushSync ? flushUpdateQueue(ctrl, updates2) : new Promise((resolve) => {
          setSprings(ctrl, springs2);
          state2.queue.push(() => {
            resolve(flushUpdateQueue(ctrl, updates2));
          });
          forceUpdate();
        });
      }
    }),
    []
  );
  const ctrls = reactExports.useRef([...state2.ctrls]);
  const updates = [];
  const prevLength = usePrev(length) || 0;
  reactExports.useMemo(() => {
    each(ctrls.current.slice(length, prevLength), (ctrl) => {
      detachRefs(ctrl, ref);
      ctrl.stop(true);
    });
    ctrls.current.length = length;
    declareUpdates(prevLength, length);
  }, [length]);
  reactExports.useMemo(() => {
    declareUpdates(0, Math.min(prevLength, length));
  }, deps);
  function declareUpdates(startIndex, endIndex) {
    for (let i2 = startIndex; i2 < endIndex; i2++) {
      const ctrl = ctrls.current[i2] || (ctrls.current[i2] = new Controller(null, state2.flush));
      const update2 = propsFn ? propsFn(i2, ctrl) : props[i2];
      if (update2) {
        updates[i2] = declareUpdate(update2);
      }
    }
  }
  const springs = ctrls.current.map((ctrl, i2) => getSprings(ctrl, updates[i2]));
  const context = reactExports.useContext(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);
  useIsomorphicLayoutEffect(() => {
    layoutId.current++;
    state2.ctrls = ctrls.current;
    const { queue } = state2;
    if (queue.length) {
      state2.queue = [];
      each(queue, (cb2) => cb2());
    }
    each(ctrls.current, (ctrl, i2) => {
      ref == null ? void 0 : ref.add(ctrl);
      if (hasContext) {
        ctrl.start({ default: context });
      }
      const update2 = updates[i2];
      if (update2) {
        replaceRef(ctrl, update2.ref);
        if (ctrl.ref) {
          ctrl.queue.push(update2);
        } else {
          ctrl.start(update2);
        }
      }
    });
  });
  useOnce(() => () => {
    each(state2.ctrls, (ctrl) => ctrl.stop(true));
  });
  const values = springs.map((x2) => ({ ...x2 }));
  return ref ? [values, ref] : values;
}
function useSpring(props, deps) {
  const isFn = is$1.fun(props);
  const [[values], ref] = useSprings(
    1,
    isFn ? props : [props],
    isFn ? deps || [] : deps
  );
  return isFn || arguments.length == 2 ? [values, ref] : values;
}
var Interpolation = class extends FrameValue {
  constructor(source, args) {
    super();
    this.source = source;
    this.idle = true;
    this._active = /* @__PURE__ */ new Set();
    this.calc = createInterpolator(...args);
    const value2 = this._get();
    const nodeType = getAnimatedType(value2);
    setAnimated(this, nodeType.create(value2));
  }
  advance(_dt) {
    const value2 = this._get();
    const oldValue = this.get();
    if (!isEqual(value2, oldValue)) {
      getAnimated(this).setValue(value2);
      this._onChange(value2, this.idle);
    }
    if (!this.idle && checkIdle(this._active)) {
      becomeIdle(this);
    }
  }
  _get() {
    const inputs = is$1.arr(this.source) ? this.source.map(getFluidValue) : toArray(getFluidValue(this.source));
    return this.calc(...inputs);
  }
  _start() {
    if (this.idle && !checkIdle(this._active)) {
      this.idle = false;
      each(getPayload(this), (node) => {
        node.done = false;
      });
      if (globals_exports.skipAnimation) {
        raf.batchedUpdates(() => this.advance());
        becomeIdle(this);
      } else {
        frameLoop.start(this);
      }
    }
  }
  // Observe our sources only when we're observed.
  _attach() {
    let priority2 = 1;
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        addFluidObserver(source, this);
      }
      if (isFrameValue(source)) {
        if (!source.idle) {
          this._active.add(source);
        }
        priority2 = Math.max(priority2, source.priority + 1);
      }
    });
    this.priority = priority2;
    this._start();
  }
  // Stop observing our sources once we have no observers.
  _detach() {
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        removeFluidObserver(source, this);
      }
    });
    this._active.clear();
    becomeIdle(this);
  }
  /** @internal */
  eventObserved(event) {
    if (event.type == "change") {
      if (event.idle) {
        this.advance();
      } else {
        this._active.add(event.parent);
        this._start();
      }
    } else if (event.type == "idle") {
      this._active.delete(event.parent);
    } else if (event.type == "priority") {
      this.priority = toArray(this.source).reduce(
        (highest, parent) => Math.max(highest, (isFrameValue(parent) ? parent.priority : 0) + 1),
        0
      );
    }
  }
};
function isIdle(source) {
  return source.idle !== false;
}
function checkIdle(active2) {
  return !active2.size || Array.from(active2).every(isIdle);
}
function becomeIdle(self2) {
  if (!self2.idle) {
    self2.idle = true;
    each(getPayload(self2), (node) => {
      node.done = true;
    });
    callFluidObservers(self2, {
      type: "idle",
      parent: self2
    });
  }
}
globals_exports.assign({
  createStringInterpolator: createStringInterpolator2,
  to: (source, args) => new Interpolation(source, args)
});
var isCustomPropRE = /^--/;
function dangerousStyleValue(name2, value2) {
  if (value2 == null || typeof value2 === "boolean" || value2 === "")
    return "";
  if (typeof value2 === "number" && value2 !== 0 && !isCustomPropRE.test(name2) && !(isUnitlessNumber.hasOwnProperty(name2) && isUnitlessNumber[name2]))
    return value2 + "px";
  return ("" + value2).trim();
}
var attributeCache = {};
function applyAnimatedValues(instance, props) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false;
  }
  const isFilterElement = instance.nodeName === "filter" || instance.parentNode && instance.parentNode.nodeName === "filter";
  const { style: style2, children, scrollTop, scrollLeft, viewBox, ...attributes } = props;
  const values = Object.values(attributes);
  const names = Object.keys(attributes).map(
    (name2) => isFilterElement || instance.hasAttribute(name2) ? name2 : attributeCache[name2] || (attributeCache[name2] = name2.replace(
      /([A-Z])/g,
      // Attributes are written in dash case
      (n2) => "-" + n2.toLowerCase()
    ))
  );
  if (children !== void 0) {
    instance.textContent = children;
  }
  for (const name2 in style2) {
    if (style2.hasOwnProperty(name2)) {
      const value2 = dangerousStyleValue(name2, style2[name2]);
      if (isCustomPropRE.test(name2)) {
        instance.style.setProperty(name2, value2);
      } else {
        instance.style[name2] = value2;
      }
    }
  }
  names.forEach((name2, i2) => {
    instance.setAttribute(name2, values[i2]);
  });
  if (scrollTop !== void 0) {
    instance.scrollTop = scrollTop;
  }
  if (scrollLeft !== void 0) {
    instance.scrollLeft = scrollLeft;
  }
  if (viewBox !== void 0) {
    instance.setAttribute("viewBox", viewBox);
  }
}
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
var prefixKey = (prefix2, key) => prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
var prefixes = ["Webkit", "Ms", "Moz", "O"];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
  prefixes.forEach((prefix2) => acc[prefixKey(prefix2, prop)] = acc[prop]);
  return acc;
}, isUnitlessNumber);
var domTransforms = /^(matrix|translate|scale|rotate|skew)/;
var pxTransforms = /^(translate)/;
var degTransforms = /^(rotate|skew)/;
var addUnit = (value2, unit) => is$1.num(value2) && value2 !== 0 ? value2 + unit : value2;
var isValueIdentity = (value2, id2) => is$1.arr(value2) ? value2.every((v2) => isValueIdentity(v2, id2)) : is$1.num(value2) ? value2 === id2 : parseFloat(value2) === id2;
var AnimatedStyle = class extends AnimatedObject {
  constructor({ x: x2, y: y2, z: z2, ...style2 }) {
    const inputs = [];
    const transforms = [];
    if (x2 || y2 || z2) {
      inputs.push([x2 || 0, y2 || 0, z2 || 0]);
      transforms.push((xyz) => [
        `translate3d(${xyz.map((v2) => addUnit(v2, "px")).join(",")})`,
        // prettier-ignore
        isValueIdentity(xyz, 0)
      ]);
    }
    eachProp(style2, (value2, key) => {
      if (key === "transform") {
        inputs.push([value2 || ""]);
        transforms.push((transform) => [transform, transform === ""]);
      } else if (domTransforms.test(key)) {
        delete style2[key];
        if (is$1.und(value2))
          return;
        const unit = pxTransforms.test(key) ? "px" : degTransforms.test(key) ? "deg" : "";
        inputs.push(toArray(value2));
        transforms.push(
          key === "rotate3d" ? ([x22, y22, z22, deg]) => [
            `rotate3d(${x22},${y22},${z22},${addUnit(deg, unit)})`,
            isValueIdentity(deg, 0)
          ] : (input) => [
            `${key}(${input.map((v2) => addUnit(v2, unit)).join(",")})`,
            isValueIdentity(input, key.startsWith("scale") ? 1 : 0)
          ]
        );
      }
    });
    if (inputs.length) {
      style2.transform = new FluidTransform(inputs, transforms);
    }
    super(style2);
  }
};
var FluidTransform = class extends FluidValue {
  constructor(inputs, transforms) {
    super();
    this.inputs = inputs;
    this.transforms = transforms;
    this._value = null;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let transform = "";
    let identity = true;
    each(this.inputs, (input, i2) => {
      const arg1 = getFluidValue(input[0]);
      const [t2, id2] = this.transforms[i2](
        is$1.arr(arg1) ? arg1 : input.map(getFluidValue)
      );
      transform += " " + t2;
      identity = identity && id2;
    });
    return identity ? "none" : transform;
  }
  // Start observing our inputs once we have an observer.
  observerAdded(count) {
    if (count == 1)
      each(
        this.inputs,
        (input) => each(
          input,
          (value2) => hasFluidValue(value2) && addFluidObserver(value2, this)
        )
      );
  }
  // Stop observing our inputs once we have no observers.
  observerRemoved(count) {
    if (count == 0)
      each(
        this.inputs,
        (input) => each(
          input,
          (value2) => hasFluidValue(value2) && removeFluidObserver(value2, this)
        )
      );
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._value = null;
    }
    callFluidObservers(this, event);
  }
};
var primitives = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  // SVG
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
];
globals_exports.assign({
  batchedUpdates: reactDomExports.unstable_batchedUpdates,
  createStringInterpolator: createStringInterpolator2,
  colors: colors2
});
var host = createHost(primitives, {
  applyAnimatedValues,
  createAnimatedStyle: (style2) => new AnimatedStyle(style2),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getComponentProps: ({ scrollTop, scrollLeft, ...props }) => props
});
var animated = host.animated;
function lightenHSL(color, lOffset) {
  const matches = color.replaceAll(" ", "").match(/hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/);
  const h2 = matches[1];
  const s2 = matches[2];
  const l2 = matches[3];
  const newLightness = Math.min(parseInt(l2) + lOffset, 100);
  return `hsl(${h2}, ${s2}%, ${newLightness}%)`;
}
const Button = ({ label: label2, color = "hsl(29, 88%, 57%)", onClick, disabled: disabled2, className = "" }) => {
  const [springs, api] = useSpring(() => ({
    from: { backgroundColor: color },
    config: {
      mass: 5,
      tension: 3e3,
      friction: 1,
      clamp: true
    }
  }));
  return jsxRuntimeExports.jsx(animated.div, { className: `${styles$o$1.buttonWrapper} ${disabled2 ? styles$o$1.disabled : styles$o$1.enabled} ${className}`, onClick: (ev) => {
    if (!disabled2) {
      onClick(ev);
    }
    ev.stopPropagation();
  }, style: !disabled2 ? { ...springs } : {}, onMouseDown: () => api.start({
    to: { backgroundColor: lightenHSL(color, 15) }
  }), onMouseLeave: () => api.start({
    to: { backgroundColor: color }
  }), onMouseUp: () => api.start({
    to: { backgroundColor: color }
  }), children: jsxRuntimeExports.jsx("span", { className: styles$o$1.label, children: label2 }) });
};
const checkbox = "_checkbox_5szzg_1";
const styles$n$1 = {
  checkbox
};
const CheckBox = ({ value: value2, onChange = () => {
}, disabled: disabled2 = false, isRequired = true, color = "blue" }) => {
  const [checked, setChecked] = reactExports.useState(value2);
  return jsxRuntimeExports.jsx("input", { className: styles$n$1.checkbox, type: "checkbox", disabled: disabled2, style: { accentColor: color }, required: isRequired, onChange: (ev) => {
    onChange(Boolean(ev.target.checked));
    setChecked(Boolean(ev.target.checked));
  }, id: styles$n$1.checkBox, checked });
};
const select = "_select_1nv83_1";
const styles$m$1 = {
  select
};
const Dropdown = ({ value: value2, options, onChange = () => {
} }) => {
  return jsxRuntimeExports.jsx("select", { name: "", className: styles$m$1.select, value: value2, onChange: (ev) => onChange(ev.target.value), children: options.map((option, index2) => {
    return jsxRuntimeExports.jsx("option", { value: option, children: option }, index2);
  }) });
};
const FileInput = ({ accept, className, label: label2, onFile }) => {
  const id2 = reactExports.useId();
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsx("label", { htmlFor: id2, className, style: { cursor: "pointer" }, children: label2 }), jsxRuntimeExports.jsx("input", { id: id2, type: "file", style: { display: "none" }, accept, onChange: (ev) => {
    if (ev.target.files)
      onFile(ev.target.files[0]);
  } })] });
};
const textInput = "_textInput_cc2he_1";
const valid = "_valid_cc2he_14";
const invalid = "_invalid_cc2he_18";
const disabled = "_disabled_cc2he_22";
const styles$l$1 = {
  textInput,
  valid,
  invalid,
  disabled
};
const TextInput = ({ isValid, ...props }) => {
  return jsxRuntimeExports.jsx("input", { ...props, type: "text", name: "", className: `${styles$l$1.textInput} ${isValid ? styles$l$1.valid : styles$l$1.invalid} ${props.disabled ? styles$l$1.disabled : ""} ${props.className ?? ""}` });
};
function getUnion(arr) {
  return arr.map((value2) => `(?:${value2})`).join("|");
}
const numericInputKeyRegex = (() => {
  const arrows = ["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"];
  const controlKeys = ["Delete", "Backspace", "Home", "End"];
  const chars = "[0-9.+-]";
  const regexp = chars + "|" + getUnion(arrows) + "|" + getUnion(controlKeys);
  return new RegExp(regexp);
})();
const NumericInput = ({ value: value2, onChange = () => {
}, required = true, disabled: disabled2 = false, isValid = true, placeholder = "Enter number", className }) => {
  const [number, setNumber] = reactExports.useState(value2);
  reactExports.useEffect(() => {
    onChange(number);
  }, [number]);
  return jsxRuntimeExports.jsx(TextInput, { className, defaultValue: value2 ?? "", isValid: isValid && number !== null, disabled: disabled2, placeholder, required, onKeyDown: (ev) => {
    if (!numericInputKeyRegex.test(ev.key)) {
      ev.preventDefault();
      return false;
    }
  }, onChange: (ev) => {
    if (ev.target.value == "") {
      setNumber(null);
    } else if (isNumber(ev.target.value)) {
      setNumber(parseFloat(ev.target.value));
    }
  } });
};
function isNumber(str) {
  return /^-?\d+(?:\.\d+)?$/.test(str);
}
const expandablePairs = "_expandablePairs_mrn64_1";
const addBtn = "_addBtn_mrn64_10";
const styles$k$1 = {
  expandablePairs,
  addBtn
};
const pair = "_pair_1yfnp_1";
const styles$j$1 = {
  pair
};
const Pair = ({ initialPair, onChange, showRemove, onRemove }) => {
  return jsxRuntimeExports.jsxs("div", { className: styles$j$1.pair, children: [jsxRuntimeExports.jsx(NumericInput, { value: initialPair[0], onChange: (v2) => onChange({ index: 0, value: v2 }), className: styles$j$1.input }, 0), jsxRuntimeExports.jsx(NumericInput, { value: initialPair[1], onChange: (v2) => onChange({ index: 1, value: v2 }), className: styles$j$1.input }, 1), showRemove && jsxRuntimeExports.jsx(Button, { label: "Remove", onClick: onRemove })] });
};
function reducer(state2, action) {
  switch (action.type) {
    case "add_pair":
      return [...state2, { id: nanoid$3(), pair: [null, null] }];
    case "update_pair":
      return state2.map((item) => {
        if (item.id == action.payload.id) {
          if (action.payload.newValue.index == 0) {
            return {
              id: item.id,
              pair: [
                action.payload.newValue.value,
                item.pair[1]
              ]
            };
          } else {
            return {
              id: item.id,
              pair: [
                item.pair[0],
                action.payload.newValue.value
              ]
            };
          }
        }
        return item;
      });
    case "remove_pair":
      return state2.filter((item) => item.id != action.payload);
  }
}
const ExpandablePairs = ({ leftColumnName, rightColumnName, value: value2, onChange }) => {
  const [items2, dispatch] = reactExports.useReducer(reducer, value2, (value22) => value22.map((pair2) => ({ id: nanoid$3(), pair: pair2 })));
  reactExports.useEffect(() => {
    onChange(items2.map((item) => item.pair));
  }, [items2]);
  return jsxRuntimeExports.jsxs("div", { className: styles$k$1.expandablePairs, children: [jsxRuntimeExports.jsx("div", { className: styles$k$1.name, children: leftColumnName }), jsxRuntimeExports.jsx("div", { className: styles$k$1.name, children: rightColumnName }), items2.map((item) => jsxRuntimeExports.jsx(Pair, { showRemove: items2.length > 1, initialPair: item.pair, onChange: (v2) => dispatch({
    type: "update_pair",
    payload: { id: item.id, newValue: v2 }
  }), onRemove: () => dispatch({ type: "remove_pair", payload: item.id }) }, item.id)), jsxRuntimeExports.jsx(Button, { className: styles$k$1.addBtn, label: "Add row", onClick: () => dispatch({ type: "add_pair" }) })] });
};
const messagesWrapper = "_messagesWrapper_11lif_1";
const messages = "_messages_11lif_1";
const buttons$1 = "_buttons_11lif_19";
const clearBtn = "_clearBtn_11lif_26";
const styles$i$1 = {
  messagesWrapper,
  messages,
  buttons: buttons$1,
  clearBtn
};
const message = "_message_1pvm5_1";
const info = "_info_1pvm5_1";
const fault = "_fault_1pvm5_7";
const warning$1 = "_warning_1pvm5_13";
const icon$1$1 = "_icon_1pvm5_29";
const counter$1 = "_counter_1pvm5_34";
const content$4 = "_content_1pvm5_38";
const idAndCounter = "_idAndCounter_1pvm5_42";
const timestamp$1 = "_timestamp_1pvm5_48";
const styles$h$1 = {
  message,
  info,
  fault,
  warning: warning$1,
  icon: icon$1$1,
  counter: counter$1,
  content: content$4,
  idAndCounter,
  timestamp: timestamp$1
};
const counter = "_counter_7kwa5_1";
const styles$g$1 = {
  counter
};
const Counter = ({ count, className }) => {
  return jsxRuntimeExports.jsx("div", { className: `${styles$g$1.counter} ${className}`, children: count });
};
const SvgInfo = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "2em", height: "2em", viewBox: "0 0 21 21", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 10.5, cy: 10.5, r: 8.75, fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M10.5 14.175V14.2625", stroke: "white", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M10.4956 6.79126V11.385", stroke: "white", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }));
const SvgWarning = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "2em", height: "2em", viewBox: "0 0 12 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M11.7604 9.27924L7.57416 1.91612C7.40488 1.63527 7.17167 1.40413 6.89601 1.24403C6.62034 1.08392 6.31111 1 5.99682 1C5.68253 1 5.3733 1.08392 5.09764 1.24403C4.82198 1.40413 4.58876 1.63527 4.41949 1.91612L0.233274 9.27924C0.0853935 9.54068 0.00501781 9.83882 0.00022742 10.1437C-0.00456297 10.4485 0.0664008 10.7493 0.205984 11.0158C0.367363 11.3158 0.600951 11.565 0.882874 11.7379C1.1648 11.9108 1.48495 12.0012 1.81061 11.9999H10.183C10.5066 12.0036 10.8253 11.9166 11.107 11.7479C11.3887 11.5792 11.6235 11.3347 11.7877 11.039C11.9313 10.7697 12.0046 10.4646 11.9998 10.1552C11.995 9.84579 11.9123 9.54338 11.7604 9.27924Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M6 9.54541V9.61103", stroke: "white", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M6 4C6 4 6 6.09983 6 7.44531", stroke: "white", strokeLinecap: "round", strokeLinejoin: "round" }));
const SvgFault = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "2em", height: "2em", viewBox: "0 0 12 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("g", { clipPath: "url(#clip0_451_2054)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M11.9241 4.31812V8.80687C11.9241 9.54187 11.5303 10.2244 10.8938 10.5984L6.99563 12.8494C6.35907 13.2169 5.57157 13.2169 4.92844 12.8494L1.03031 10.5984C0.716479 10.4165 0.456053 10.1551 0.2752 9.84065C0.0943477 9.52618 -0.000563022 9.16965 2.51262e-06 8.80687V4.31812C2.51262e-06 3.58312 0.393752 2.90062 1.03031 2.52656L4.92844 0.275625C5.565 -0.091875 6.3525 -0.091875 6.99563 0.275625L10.8938 2.52656C11.5303 2.90062 11.9241 3.57656 11.9241 4.31812Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M5.96533 9.31885V9.38447", stroke: "white", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M5.96533 3.77344C5.96533 3.77344 5.96533 5.87327 5.96533 7.21875", stroke: "white", strokeLinecap: "round", strokeLinejoin: "round" })), /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement("clipPath", { id: "clip0_451_2054" }, /* @__PURE__ */ reactExports.createElement("rect", { width: 12, height: 13.5, fill: "white" }))));
const timestamp = "_timestamp_bqu8b_1";
const styles$f$1 = {
  timestamp
};
const TimestampView = ({ timestamp: timestamp2, className }) => {
  return jsxRuntimeExports.jsx("div", { className: `${styles$f$1.timestamp} ${className}`, children: getTimestampString(timestamp2) });
};
function getTimestampString(timestamp2) {
  return `${timestamp2.hour}:${timestamp2.minute}:${timestamp2.second} ${timestamp2.day}/${timestamp2.month}/${timestamp2.year}`;
}
const protectionMessage = "_protectionMessage_1x017_1";
const kindAndOrigin = "_kindAndOrigin_1x017_7";
const protectionKind = "_protectionKind_1x017_16";
const origin$1 = "_origin_1x017_28";
const styles$e$1 = {
  protectionMessage,
  kindAndOrigin,
  protectionKind,
  origin: origin$1
};
const origin = "_origin_f85zk_1";
const text = "_text_f85zk_8";
const arrow = "_arrow_f85zk_12";
const styles$d$1 = {
  origin,
  text,
  arrow
};
const SvgRightArrow = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "1em", height: "1em", viewBox: "0 0 5 8", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M1 7L3.7559 4.5303C4.08137 4.23864 4.08137 3.76136 3.7559 3.4697L1 1", stroke: "currentColor", strokeWidth: 1.5, strokeMiterlimit: 10, strokeLinecap: "round", strokeLinejoin: "round" }));
const Origin = ({ board: board2, name: name2, className }) => {
  return jsxRuntimeExports.jsxs("div", { className: `${className} ${styles$d$1.origin}`, children: [jsxRuntimeExports.jsx("span", { className: styles$d$1.text, children: board2 }), jsxRuntimeExports.jsx(SvgRightArrow, { className: styles$d$1.arrow }), jsxRuntimeExports.jsx("span", { className: styles$d$1.text, style: { textOverflow: "ellipsis", overflow: "hidden" }, children: name2 })] });
};
const protectionView = "_protectionView_unmg1_1";
const styles$c$1 = {
  protectionView
};
const DECIMALS = 2;
const ProtectionView = ({ protection }) => {
  const ProtectionText = getProtectionText(protection);
  return jsxRuntimeExports.jsx("div", { className: styles$c$1.protectionView, children: ProtectionText });
};
function getProtectionText(protection) {
  switch (protection.kind) {
    case "OUT_OF_BOUNDS":
      return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsxs("span", { children: [" ", "Want: [", protection.data.bounds[0].toFixed(DECIMALS), ", ", protection.data.bounds[1].toFixed(DECIMALS), "]"] }), " ", jsxRuntimeExports.jsxs("span", { children: ["Got: ", protection.data.value.toFixed(DECIMALS)] })] });
    case "UPPER_BOUND":
      return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsxs("span", { children: ["Want: x ", "<", " ", protection.data.bound.toFixed(DECIMALS)] }), " ", jsxRuntimeExports.jsxs("span", { children: ["Got: ", protection.data.value.toFixed(DECIMALS)] })] });
    case "LOWER_BOUND":
      return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsxs("span", { children: ["Want: x ", ">", " ", protection.data.bound.toFixed(DECIMALS)] }), " ", jsxRuntimeExports.jsxs("span", { children: ["Got: ", protection.data.value.toFixed(DECIMALS)] })] });
    case "EQUALS":
      return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsxs("span", { children: ["Mustn't be ", protection.data.value.toFixed(DECIMALS)] }) });
    case "NOT_EQUALS":
      return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsxs("span", { children: ["Must be ", protection.data.want.toFixed(DECIMALS), " but is", " ", protection.data.value.toFixed(DECIMALS)] }) });
    case "TIME_ACCUMULATION":
      return jsxRuntimeExports.jsxs("span", { children: ["Value was ", protection.data.value.toFixed(DECIMALS), " for", " ", protection.data.timelimit.toFixed(DECIMALS), " seconds"] });
    case "ERROR_HANDLER":
      return jsxRuntimeExports.jsx("span", { children: protection.data });
  }
}
const ProtectionMessageView = ({ message: message2, className }) => {
  return jsxRuntimeExports.jsxs("div", { className: `${styles$e$1.protectionMessage} ${className}`, children: [jsxRuntimeExports.jsxs("div", { className: styles$e$1.kindAndOrigin, children: [jsxRuntimeExports.jsx("div", { className: styles$e$1.protectionKind, children: message2.protection.kind }), jsxRuntimeExports.jsx(Origin, { className: styles$e$1.origin, board: message2.board, name: message2.name })] }), jsxRuntimeExports.jsx(ProtectionView, { protection: message2.protection })] });
};
const infoMessageView = "_infoMessageView_sdjf0_1";
const board = "_board_sdjf0_8";
const styles$b$1 = {
  infoMessageView,
  board
};
const InfoMessageView = ({ message: message2, className }) => {
  return jsxRuntimeExports.jsxs("div", { className: `${styles$b$1.infoMessageView} ${className}`, children: [jsxRuntimeExports.jsx("div", { className: styles$b$1.board, children: message2.board }), jsxRuntimeExports.jsx("div", { children: message2.msg })] });
};
const icons = {
  info: SvgInfo,
  fault: SvgFault,
  warning: SvgWarning
};
const appearances = {
  info: styles$h$1.info,
  warning: styles$h$1.warning,
  fault: styles$h$1.fault
};
const MessageView = React.memo(({ message: message2 }) => {
  const Icon = icons[message2.kind];
  const appearance = appearances[message2.kind];
  const Message = message2.kind == "warning" || message2.kind == "fault" ? jsxRuntimeExports.jsx(ProtectionMessageView, { message: message2, className: styles$h$1.content }) : jsxRuntimeExports.jsx(InfoMessageView, { message: message2, className: styles$h$1.content });
  return jsxRuntimeExports.jsxs("article", { className: `${styles$h$1.message} ${appearance}`, children: [jsxRuntimeExports.jsx(Icon, { className: styles$h$1.icon }), Message, jsxRuntimeExports.jsx(Counter, { className: styles$h$1.counter, count: message2.count }), jsxRuntimeExports.jsx(TimestampView, { className: styles$h$1.timestamp, timestamp: message2.timestamp })] });
});
const AUTO_THRESHOLD = 30;
function useAutoScroll(items2) {
  const ref = reactExports.useRef(null);
  const autoScroll = reactExports.useRef(true);
  const prevScrollTop = reactExports.useRef();
  reactExports.useLayoutEffect(() => {
    if (ref.current && autoScroll.current) {
      ref.current.scroll({
        top: ref.current.scrollHeight,
        behavior: "auto"
      });
    }
  }, [items2]);
  function handleScroll(ev) {
    if (prevScrollTop.current && ev.currentTarget.scrollTop < prevScrollTop.current) {
      autoScroll.current = false;
    } else if (
      // If user scroll to the bottom, auto = true
      Math.abs(ev.currentTarget.scrollTop + ev.currentTarget.offsetHeight - ev.currentTarget.scrollHeight) < AUTO_THRESHOLD
    ) {
      autoScroll.current = true;
    }
    prevScrollTop.current = ev.currentTarget.scrollTop;
  }
  return { ref, handleScroll };
}
const Messages = ({ messages: messages2 }) => {
  const { ref, handleScroll } = useAutoScroll(messages2);
  const dispatch = useDispatch();
  return jsxRuntimeExports.jsxs("section", { className: styles$i$1.messagesWrapper, children: [jsxRuntimeExports.jsx("section", { ref, onScroll: handleScroll, className: styles$i$1.messages, children: messages2.map((message2) => {
    return jsxRuntimeExports.jsx(MessageView, { message: message2 }, message2.id);
  }) }), jsxRuntimeExports.jsxs("div", { className: styles$i$1.buttons, children: [jsxRuntimeExports.jsx(Button, { className: styles$i$1.clearBtn, label: "To bottom", color: "#adadad", onClick: () => {
    var _a;
    return (_a = ref.current) == null ? void 0 : _a.scrollTo({ top: ref.current.scrollHeight });
  } }), jsxRuntimeExports.jsx(Button, { className: styles$i$1.clearBtn, label: "Clear", onClick: () => dispatch(messageSlice.actions.clearMessages()) })] })] });
};
const MessagesContainer = () => {
  const messages2 = useMessages();
  return jsxRuntimeExports.jsx(Messages, { messages: messages2 });
};
function useMessages() {
  const dispatch = useDispatch();
  useSubscribe("message/update", (msg) => {
    dispatch(messageSlice.actions.addMessage(msg));
  });
  return useSelector((state2) => state2.messages);
}
const connectionsWrapper = "_connectionsWrapper_178jc_1";
const boards = "_boards_178jc_10";
const styles$a$1 = {
  connectionsWrapper,
  boards
};
const connectionViewWrapper = "_connectionViewWrapper_16yoq_1";
const icon$3 = "_icon_16yoq_13";
const label$2 = "_label_16yoq_18";
const connected = "_connected_16yoq_23";
const disconnected = "_disconnected_16yoq_28";
const styles$9$1 = {
  connectionViewWrapper,
  icon: icon$3,
  label: label$2,
  connected,
  disconnected
};
var DefaultContext$1 = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext$1 = React.createContext && React.createContext(DefaultContext$1);
var __assign$1 = globalThis && globalThis.__assign || function() {
  __assign$1 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$1.apply(this, arguments);
};
var __rest$1 = globalThis && globalThis.__rest || function(s2, e2) {
  var t2 = {};
  for (var p2 in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
      t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
      if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
        t2[p2[i2]] = s2[p2[i2]];
    }
  return t2;
};
function Tree2Element$1(tree) {
  return tree && tree.map(function(node, i2) {
    return React.createElement(node.tag, __assign$1({
      key: i2
    }, node.attr), Tree2Element$1(node.child));
  });
}
function GenIcon$1(data) {
  return function(props) {
    return React.createElement(IconBase$1, __assign$1({
      attr: __assign$1({}, data.attr)
    }, props), Tree2Element$1(data.child));
  };
}
function IconBase$1(props) {
  var elem = function(conf) {
    var attr = props.attr, size = props.size, title2 = props.title, svgProps = __rest$1(props, ["attr", "size", "title"]);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className)
      className = conf.className;
    if (props.className)
      className = (className ? className + " " : "") + props.className;
    return React.createElement("svg", __assign$1({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: __assign$1(__assign$1({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title2 && React.createElement("title", null, title2), props.children);
  };
  return IconContext$1 !== void 0 ? React.createElement(IconContext$1.Consumer, null, function(conf) {
    return elem(conf);
  }) : elem(DefaultContext$1);
}
function TbPlugConnectedX(props) {
  return GenIcon$1({ "tag": "svg", "attr": { "viewBox": "0 0 24 24", "strokeWidth": "2", "stroke": "currentColor", "fill": "none", "strokeLinecap": "round", "strokeLinejoin": "round" }, "child": [{ "tag": "path", "attr": { "stroke": "none", "d": "M0 0h24v24H0z", "fill": "none" } }, { "tag": "path", "attr": { "d": "M20 16l-4 4" } }, { "tag": "path", "attr": { "d": "M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5z" } }, { "tag": "path", "attr": { "d": "M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5z" } }, { "tag": "path", "attr": { "d": "M3 21l2.5 -2.5" } }, { "tag": "path", "attr": { "d": "M18.5 5.5l2.5 -2.5" } }, { "tag": "path", "attr": { "d": "M10 11l-2 2" } }, { "tag": "path", "attr": { "d": "M13 14l-2 2" } }, { "tag": "path", "attr": { "d": "M16 16l4 4" } }] })(props);
}
function TbPlugConnected(props) {
  return GenIcon$1({ "tag": "svg", "attr": { "viewBox": "0 0 24 24", "strokeWidth": "2", "stroke": "currentColor", "fill": "none", "strokeLinecap": "round", "strokeLinejoin": "round" }, "child": [{ "tag": "path", "attr": { "stroke": "none", "d": "M0 0h24v24H0z", "fill": "none" } }, { "tag": "path", "attr": { "d": "M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5z" } }, { "tag": "path", "attr": { "d": "M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5z" } }, { "tag": "path", "attr": { "d": "M3 21l2.5 -2.5" } }, { "tag": "path", "attr": { "d": "M18.5 5.5l2.5 -2.5" } }, { "tag": "path", "attr": { "d": "M10 11l-2 2" } }, { "tag": "path", "attr": { "d": "M13 14l-2 2" } }] })(props);
}
const ConnectionView = ({ connection }) => {
  return jsxRuntimeExports.jsxs("div", { className: `${styles$9$1.connectionViewWrapper} ${connection.isConnected ? styles$9$1.connected : styles$9$1.disconnected}`, children: [connection.isConnected ? jsxRuntimeExports.jsx(TbPlugConnected, { className: styles$9$1.icon }) : jsxRuntimeExports.jsx(TbPlugConnectedX, { className: styles$9$1.icon }), jsxRuntimeExports.jsx("div", { className: styles$9$1.label, children: connection.name })] });
};
function useConnections() {
  const dispatch = useDispatch();
  useSubscribe("connection/update", (update2) => {
    dispatch(connectionsSlice$1.actions.updateBoardConnections(update2));
  });
  return useSelector((state2) => state2.connections);
}
const Connections = () => {
  const connections = useConnections();
  return jsxRuntimeExports.jsxs("div", { className: styles$a$1.connectionsWrapper, children: [jsxRuntimeExports.jsx(ConnectionView, { connection: connections.websocket }), jsxRuntimeExports.jsx("div", { className: styles$a$1.boards, children: Object.values(connections.boards).map((conn) => {
    return jsxRuntimeExports.jsx(ConnectionView, { connection: conn }, conn.name);
  }) })] });
};
const logger = "_logger_t74c5_1";
const state = "_state_t74c5_10";
const buttons = "_buttons_t74c5_16";
const styles$8$1 = {
  logger,
  state,
  buttons
};
function useLogger() {
  const [state2, setState] = reactExports.useState(false);
  const handler = useWsHandler();
  const log = (enable) => {
    handler.post("logger/enable", enable);
  };
  function startLogging() {
    log(true);
  }
  function stopLogging() {
    log(false);
  }
  useSubscribe("logger/response", (result) => {
    setState(result);
  });
  return [state2, startLogging, stopLogging];
}
const Logger = () => {
  const [state2, startLogging, stopLogging] = useLogger();
  return jsxRuntimeExports.jsxs("div", { className: styles$8$1.logger, children: [jsxRuntimeExports.jsxs("span", { className: styles$8$1.state, children: ["Logging: ", `${state2}`] }), jsxRuntimeExports.jsxs("div", { className: styles$8$1.buttons, children: [jsxRuntimeExports.jsx(Button, { label: "Start", color: "hsl(116, 38%, 50%)", onClick: () => {
    startLogging();
  } }), jsxRuntimeExports.jsx(Button, { label: "Stop", color: "hsl(0, 77%, 53%)", onClick: () => {
    stopLogging();
  } })] })] });
};
const orders$2 = "_orders_1njiv_1";
const forms = "_forms_1njiv_10";
const styles$7$1 = {
  orders: orders$2,
  forms
};
const boardOrdersView = "_boardOrdersView_10l0u_1";
const name$2$1 = "_name_10l0u_7";
const orders$1 = "_orders_10l0u_13";
const styles$6$1 = {
  boardOrdersView,
  name: name$2$1,
  orders: orders$1
};
const orderList = "_orderList_fnn4s_1";
const title$3 = "_title_fnn4s_7";
const orders = "_orders_fnn4s_12";
const styles$5$1 = {
  orderList,
  title: title$3,
  orders
};
function useOrders$1() {
  const dispatch = useDispatch();
  useSubscribe("order/stateOrders", (msg) => {
    dispatch(orderSlice.actions.updateStateOrders(msg));
  });
  return useSelector((state2) => state2.orders.boards);
}
function createFormFromOrder(order) {
  const fields2 = Object.values(order.fields).map((desc) => {
    return getField(desc);
  });
  return {
    id: order.id.toString(),
    name: order.name,
    fields: fields2
  };
}
function getField(desc) {
  switch (desc.kind) {
    case "boolean":
      return {
        id: desc.id,
        name: desc.name,
        type: "boolean",
        value: false
      };
    case "enum":
      return {
        id: desc.id,
        name: desc.name,
        type: "enum",
        options: desc.options,
        value: desc.options[0] ?? "Default"
      };
    case "numeric":
      return {
        id: desc.id,
        name: desc.name,
        type: "numeric",
        value: null,
        placeholder: desc.type,
        isValid: false,
        validator: getNumericValidator(desc.type, desc.safeRange)
      };
  }
}
function getNumericValidator(type, range) {
  return (v2) => {
    if (v2 === null) {
      return false;
    }
    let result = true;
    result && (result = doesNumberOverflow(v2, type));
    result && (result = isWithinRange(v2, range));
    return result;
  };
}
const field = "_field_18hw8_1";
const name$1$1 = "_name_18hw8_8";
const styles$4$1 = {
  field,
  name: name$1$1
};
const Input = ({ input, onChange }) => {
  switch (input.type) {
    case "numeric":
      return jsxRuntimeExports.jsx(NumericInput, { ...input, placeholder: `${input.placeholder}...`, onChange: (v2) => onChange({ type: "numeric", value: v2 }) });
    case "boolean":
      return jsxRuntimeExports.jsx(CheckBox, { ...input, onChange: (v2) => onChange({ type: "boolean", value: v2 }) });
    case "enum":
      return jsxRuntimeExports.jsx(Dropdown, { ...input, onChange: (v2) => onChange({ type: "enum", value: v2 }) });
    case "expandablePairs":
      return jsxRuntimeExports.jsx(ExpandablePairs, { ...input, leftColumnName: "Position", rightColumnName: "Velocity", onChange: (v2) => console.log(v2) });
  }
};
const Field = ({ field: field2, onChange }) => {
  return jsxRuntimeExports.jsxs("div", { className: styles$4$1.field, children: [jsxRuntimeExports.jsx("div", { className: styles$4$1.name, children: field2.name }), jsxRuntimeExports.jsx(Input, { input: { ...field2 }, onChange: (ev) => onChange({ id: field2.id, ev }) })] });
};
const formWrapper = "_formWrapper_tbot6_1";
const fields = "_fields_tbot6_13";
const styles$3$1 = {
  formWrapper,
  fields
};
const headerWrapper = "_headerWrapper_1471o_1";
const caret = "_caret_1471o_12";
const visible = "_visible_1471o_25";
const hidden = "_hidden_1471o_29";
const name$5 = "_name_1471o_33";
const target = "_target_1471o_41";
const targetVisible = "_targetVisible_1471o_51";
const sendBtn = "_sendBtn_1471o_59";
const styles$2$1 = {
  headerWrapper,
  caret,
  visible,
  hidden,
  name: name$5,
  target,
  targetVisible,
  sendBtn
};
const SvgTarget = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "2em", height: "2em", viewBox: "0 0 83 81", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M27.4296 77C19.9253 73.971 13.3591 68.4808 9.00666 60.8703C4.89823 53.7206 3.24917 45.4002 4.31652 37.2059M18.4245 12.027C25.0059 6.81429 33.1335 3.98704 41.5 4.00004C50.0173 4.00004 57.8592 6.9155 64.1628 11.762M55.5704 77C63.0747 73.971 69.6409 68.4808 73.9933 60.8703C78.1018 53.7206 79.7508 45.4002 78.6835 37.2059", stroke: "currentColor", strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ reactExports.createElement("circle", { cx: 41, cy: 41, r: 24, fill: "currentColor" }));
const caretWrapper = "_caretWrapper_3ittz_1";
const styles$1$1 = {
  caretWrapper
};
function BsFillCaretRightFill(props) {
  return GenIcon$1({ "tag": "svg", "attr": { "fill": "currentColor", "viewBox": "0 0 16 16" }, "child": [{ "tag": "path", "attr": { "d": "m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" } }] })(props);
}
const Caret = ({ isOpen, onClick, className = "" }) => {
  return jsxRuntimeExports.jsx("div", { className: `${styles$1$1.caretWrapper} ${className}`, onClick, style: { transform: isOpen ? "rotate(90deg)" : "" }, children: jsxRuntimeExports.jsx(BsFillCaretRightFill, {}) });
};
const Header = ({ name: name2, disabled: disabled2, info: info2, springs, onTargetToggle: onTargetClick, onButtonClick }) => {
  const [targetOn, setTargetOn] = reactExports.useState(false);
  reactExports.useEffect(() => {
    onTargetClick(targetOn);
  }, [targetOn]);
  return jsxRuntimeExports.jsxs(animated.div, { className: styles$2$1.headerWrapper, onClick: info2.type == "toggable" ? info2.toggleDropdown : () => {
  }, style: {
    ...springs,
    cursor: info2.type == "toggable" ? "pointer" : "auto"
  }, children: [jsxRuntimeExports.jsx(Caret, { isOpen: info2.type == "toggable" ? info2.isOpen : false, className: `${styles$2$1.caret} ${info2.type == "toggable" ? styles$2$1.visible : styles$2$1.hidden}` }), jsxRuntimeExports.jsx("div", { className: styles$2$1.name, children: name2 }), jsxRuntimeExports.jsx(SvgTarget, { className: `${styles$2$1.target} ${targetOn ? styles$2$1.targetVisible : ""}`, onClick: (ev) => {
    ev.stopPropagation();
    setTargetOn((prev) => {
      return !prev;
    });
  } }), jsxRuntimeExports.jsx("div", { className: styles$2$1.sendBtn, children: jsxRuntimeExports.jsx(Button, { label: "send", onClick: (ev) => {
    onButtonClick();
    ev.stopPropagation();
  }, disabled: disabled2 }) })] });
};
function useListenKey(key, callback, listen) {
  const listener = reactExports.useCallback((ev) => {
    if (ev.key == key) {
      ev.preventDefault();
      callback();
    }
  }, [key, callback, listen]);
  reactExports.useEffect(() => {
    if (listen) {
      document.addEventListener("keydown", listener);
    }
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [listen, key, listener, callback]);
}
const Form = ({ initialForm, onSubmit }) => {
  const [listen, setListen] = reactExports.useState(false);
  const [form, handleEvent] = useForm(initialForm);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [springs, api] = useSpring(() => ({
    from: { filter: "brightness(1)" },
    config: {
      tension: 600
    }
  }));
  function blinkHeader() {
    api.start({
      from: { filter: "brightness(1.2)" },
      to: { filter: "brightness(1)" }
    });
  }
  function trySubmit() {
    if (form.isValid) {
      blinkHeader();
      onSubmit(form);
    }
  }
  useListenKey(" ", () => {
    trySubmit();
  }, listen);
  const headerInfo = form.fields.length > 0 ? {
    type: "toggable",
    isOpen,
    toggleDropdown: () => setIsOpen((prevValue) => !prevValue)
  } : { type: "fixed" };
  return jsxRuntimeExports.jsxs("div", { className: styles$3$1.formWrapper, children: [jsxRuntimeExports.jsx(Header, { name: form.name, info: headerInfo, disabled: !form.isValid, onTargetToggle: (state2) => setListen(state2), onButtonClick: () => trySubmit(), springs }), isOpen && form.fields.length > 0 && jsxRuntimeExports.jsx("div", { className: styles$3$1.fields, children: form.fields.map((field2) => jsxRuntimeExports.jsx(Field, { field: field2, onChange: handleEvent }, field2.id)) })] });
};
const OrdersList = ({ title: title2, orders: orders2 }) => {
  const sendOrder = useSendOrder();
  return jsxRuntimeExports.jsxs("div", { className: styles$5$1.orderList, children: [jsxRuntimeExports.jsx("span", { className: styles$5$1.title, children: title2 }), jsxRuntimeExports.jsx("div", { className: styles$5$1.orders, children: orders2.map((order) => jsxRuntimeExports.jsx(Form, { initialForm: createFormFromOrder(order), onSubmit: (ev) => {
    sendOrder(createOrder(order.id, ev));
  } }, order.id)) })] });
};
function createOrder(id2, form) {
  return {
    id: id2,
    fields: Object.fromEntries(form.fields.map((field2) => {
      if (field2.type == "expandablePairs") {
        return [field2.id, field2.value];
      }
      return [field2.id, { value: field2.value, isEnabled: true }];
    }))
  };
}
const BoardOrdersView = ({ board: board2, showName }) => {
  const stateOrders = board2.stateOrders.filter((order) => order.enabled);
  return jsxRuntimeExports.jsxs("div", { className: styles$6$1.boardOrdersView, children: [showName && jsxRuntimeExports.jsx("div", { className: styles$6$1.name, children: board2.name }), jsxRuntimeExports.jsxs("div", { className: styles$6$1.orders, children: [board2.orders.length > 0 && jsxRuntimeExports.jsx(OrdersList, { title: "Permanent orders", orders: board2.orders }), stateOrders.length > 0 && jsxRuntimeExports.jsx(OrdersList, { title: "State orders", orders: stateOrders })] })] });
};
const Orders = ({ orders: orders2 }) => {
  return jsxRuntimeExports.jsx("div", { className: styles$7$1.orders, children: orders2.map((board2) => jsxRuntimeExports.jsx(BoardOrdersView, { board: board2, showName: true }, board2.name)) });
};
class SignalChannel {
  constructor(url, protocols) {
    __publicField(this, "socket");
    __publicField(this, "listeners", {
      offer: this.emptyHandle.bind(this),
      answer: this.emptyHandle.bind(this),
      candidate: this.emptyHandle.bind(this),
      close: this.emptyHandle.bind(this),
      poll: this.emptyHandle.bind(this)
    });
    __publicField(this, "signalBuffer", new Array());
    this.socket = new WebSocket(url, protocols);
    this.socket.onopen = () => {
      this.signalBuffer.forEach((signal) => {
        this.socket.send(JSON.stringify(signal));
      });
    };
    this.socket.onmessage = (msg) => {
      const signal = JSON.parse(msg.data);
      this.listeners[signal.name](signal);
    };
  }
  addSignalListener(signal, handle) {
    this.listeners[signal] = handle;
  }
  removeSignalListener(signal) {
    this.listeners[signal] = this.emptyHandle.bind(this);
  }
  sendSignal(kind, payload) {
    const signal = {
      name: kind,
      payload
    };
    if (this.socket.readyState !== WebSocket.OPEN) {
      this.signalBuffer.push(signal);
      return;
    }
    this.socket.send(JSON.stringify(signal));
  }
  close() {
    this.socket.close();
  }
  onError(handle) {
    this.socket.onerror = handle;
  }
  onClose(handle) {
    this.socket.onclose = handle;
  }
  emptyHandle(_2) {
  }
}
class RemotePeer {
  constructor(signalAddr, configuration) {
    __publicField(this, "peer");
    __publicField(this, "signal");
    __publicField(this, "candidateBuffer", new Array());
    __publicField(this, "validCandidateStates", /* @__PURE__ */ new Set([
      "stable",
      "have-remote-offer",
      "have-remote-pranswer"
    ]));
    this.peer = new RTCPeerConnection(configuration);
    this.signal = new SignalChannel(signalAddr);
    this.peer.onnegotiationneeded = this.onNegotiationNeeded.bind(this);
    this.peer.onicecandidate = this.onIceCandidate.bind(this);
    this.peer.onsignalingstatechange = this.onSignalingStateChange.bind(this);
    this.signal.addSignalListener("offer", this.onOfferSignal.bind(this));
    this.signal.addSignalListener("answer", this.onAnswerSignal.bind(this));
    this.signal.addSignalListener("candidate", this.onCandidateSignal.bind(this));
    this.signal.addSignalListener("close", this.onCloseSignal.bind(this));
    this.signal.onClose(this.onClose.bind(this));
    this.signal.onError(this.onError.bind(this));
  }
  async onIceCandidate(ev) {
    if (!ev.candidate)
      return;
    this.signal.sendSignal("candidate", ev.candidate.toJSON());
  }
  async onNegotiationNeeded() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    this.signal.sendSignal("offer", offer);
  }
  async onOfferSignal(signal) {
    await this.peer.setRemoteDescription(signal.payload);
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    this.signal.sendSignal("answer", answer);
  }
  async onAnswerSignal(signal) {
    await this.peer.setRemoteDescription(signal.payload);
  }
  async onCloseSignal(_signal) {
    this.close();
  }
  canAddIceCandidate() {
    return this.validCandidateStates.has(this.peer.signalingState);
  }
  async onCandidateSignal(signal) {
    if (!this.canAddIceCandidate()) {
      return this.candidateBuffer.push(signal.payload);
    }
    await this.peer.addIceCandidate(signal.payload);
  }
  async onSignalingStateChange() {
    if (!this.canAddIceCandidate())
      return;
    for (const candidate of this.candidateBuffer) {
      await this.peer.addIceCandidate(candidate);
    }
  }
  onClose() {
    this.close();
  }
  onError() {
    this.close();
  }
  close() {
    this.peer.close();
    this.signal.sendSignal("close", null);
    this.signal.close();
  }
  onTrack(callback) {
    this.peer.ontrack = callback;
  }
  onConnectionStateChange(callback) {
    this.peer.onconnectionstatechange = () => callback(this.peer.connectionState);
  }
}
function useWebRTC(signalUrl, configuration) {
  const peer = reactExports.useRef();
  const [peerState, setPeerState] = reactExports.useState("new");
  const [mediaStreams, setMediaStreams] = reactExports.useState(null);
  reactExports.useEffect(() => {
    peer.current = new RemotePeer(signalUrl, configuration);
    peer.current.onTrack(handleTrack);
    peer.current.onConnectionStateChange(setPeerState);
    return () => {
      peer.current.close();
    };
  }, []);
  function handleTrack(ev) {
    console.log(ev);
    setMediaStreams((prevStreams) => prevStreams ? [...prevStreams, ...ev.streams] : [...ev.streams]);
  }
  return [mediaStreams, peerState];
}
function useSendOrder() {
  const handler = useWsHandler();
  return (order) => {
    handler.post("order/send", order);
  };
}
async function useFetchBack(production, path, signal) {
  const config2 = useConfig();
  return fetchBack(`http://${production ? config2.prodServer.ip : config2.devServer.ip}:${production ? config2.prodServer.port : config2.devServer.port}/${path}`, signal);
}
async function fetchBack(url, signal) {
  const res = await fetch(url, {
    signal
  });
  return await res.json();
}
const config = {
  devServer: { ip: "127.0.0.1", port: 4e3 },
  prodServer: { ip: "192.168.0.9", port: 4e3 },
  paths: {
    podDataDescription: "backend/podDataStructure",
    orderDescription: "backend/orderStructures",
    packets: "backend/packets",
    messages: "backend/messages",
    connections: "backend/connections",
    logger: "backend/logger",
    bootloader: "backend/bootloader_file",
    websocket: "backend",
    uploadableBoards: "backend/uploadableBoards"
  },
  cameras: {
    ip: "192.168.0.9",
    port: 4040
  }
};
function areFieldsValid(fields2) {
  return fields2.every((field2) => {
    var _a, _b, _c;
    switch (field2.type) {
      case "numeric":
        return ((_a = field2.validator) == null ? void 0 : _a.call(field2, field2.value)) ?? true;
      case "boolean":
        return ((_b = field2.validator) == null ? void 0 : _b.call(field2, field2.value)) ?? true;
      case "enum":
        return ((_c = field2.validator) == null ? void 0 : _c.call(field2, field2.value)) ?? true;
    }
  });
}
function useForm(initialForm) {
  const [form, setForm] = reactExports.useState({
    ...initialForm,
    isValid: areFieldsValid(initialForm.fields)
  });
  function handleEvent(ev) {
    setForm((prev) => {
      const field2 = form.fields.find((field22) => field22.id == ev.id);
      if (!field2) {
        console.error("invalid form id", ev.id);
        return prev;
      }
      const newFields = prev.fields.map((field22) => {
        var _a;
        if (field22.id == ev.id) {
          if (field22.type == "boolean" && ev.ev.type == "boolean") {
            return { ...field22, value: ev.ev.value };
          } else if (field22.type == "enum" && ev.ev.type == "enum") {
            return { ...field22, value: ev.ev.value };
          } else if (field22.type == "numeric" && ev.ev.type == "numeric") {
            return {
              ...field22,
              value: ev.ev.value,
              isValid: ((_a = field22.validator) == null ? void 0 : _a.call(field22, ev.ev.value)) ?? true
            };
          } else {
            console.log(`field ${field22.id} type (${field22.type}) and event type (${ev.ev.type}) don't match`);
          }
        }
        return field22;
      });
      return {
        ...prev,
        fields: newFields,
        isValid: areFieldsValid(newFields)
      };
    });
  }
  return [form, handleEvent];
}
const ConfigContext = reactExports.createContext(config);
const ConfigProvider = ({ devIp, prodIp, children }) => {
  const mutableConfig = {
    ...config,
    devServer: { ...config.devServer, ip: devIp },
    prodServer: { ...config.prodServer, ip: prodIp }
  };
  return jsxRuntimeExports.jsx(ConfigContext.Provider, { value: mutableConfig, children });
};
function useConfig() {
  return reactExports.useContext(ConfigContext);
}
reactExports.createContext({
  add: () => {
  }
});
function selectBmslMeasurements(measurements) {
  return {
    av_current: getMeasurementFallback(measurements, "BMSL/av_current"),
    low_cell1: getMeasurementFallback(measurements, "BMSL/low_cell1"),
    low_cell2: getMeasurementFallback(measurements, "BMSL/low_cell2"),
    low_cell3: getMeasurementFallback(measurements, "BMSL/low_cell3"),
    low_cell4: getMeasurementFallback(measurements, "BMSL/low_cell4"),
    low_cell5: getMeasurementFallback(measurements, "BMSL/low_cell5"),
    low_cell6: getMeasurementFallback(measurements, "BMSL/low_cell6"),
    low_SOC1: getMeasurementFallback(measurements, "BMSL/low_SOC1"),
    low_is_balancing1: getMeasurementFallback(measurements, "BMSL/low_is_balancing1"),
    low_maximum_cell: getMeasurementFallback(measurements, "BMSL/low_maximum_cell"),
    low_minimum_cell: getMeasurementFallback(measurements, "BMSL/low_minimum_cell"),
    low_battery_temperature_1: getMeasurementFallback(measurements, "BMSL/low_battery_temperature_1"),
    low_battery_temperature_2: getMeasurementFallback(measurements, "BMSL/low_battery_temperature_2"),
    total_voltage_low: getMeasurementFallback(measurements, "BMSL/total_voltage_low"),
    input_charging_current: getMeasurementFallback(measurements, "BMSL/input_charging_current"),
    output_charging_current: getMeasurementFallback(measurements, "BMSL/output_charging_current"),
    input_charging_voltage: getMeasurementFallback(measurements, "BMSL/output_charging_current"),
    output_charging_voltage: getMeasurementFallback(measurements, "BMSL/output_charging_voltage"),
    pwm_frequency: getMeasurementFallback(measurements, "BMSL/pwm_frequency"),
    conditions_ready: getMeasurementFallback(measurements, "BMSL/conditions_ready"),
    conditions_want_to_charge: getMeasurementFallback(measurements, "BMSL/conditions_want_to_charge"),
    conditions_charging: getMeasurementFallback(measurements, "BMSL/conditions_charging"),
    conditions_fault: getMeasurementFallback(measurements, "BMSL/conditions_fault")
  };
}
function selectLcuMeasurements(measurements) {
  return {
    general_state: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_general_state"),
    specific_state: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_specific_state"),
    slave_general_state: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_general_state"),
    slave_specific_state: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_specific_state"),
    airgap_1: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_airgap_1"),
    airgap_2: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_airgap_2"),
    airgap_3: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_airgap_3"),
    airgap_4: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_airgap_4"),
    slave_airgap_5: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_airgap_5"),
    slave_airgap_6: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_airgap_6"),
    slave_airgap_7: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_airgap_7"),
    slave_airgap_8: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_airgap_8"),
    current_coil_1: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_current_coil_hems_1"),
    current_coil_2: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_current_coil_hems_3"),
    current_coil_3: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_current_coil_ems_1"),
    current_coil_4: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_current_coil_ems_3"),
    slave_current_coil_5: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_current_coil_hems_2"),
    slave_current_coil_6: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_current_coil_hems_4"),
    slave_current_coil_7: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_current_coil_ems_2"),
    slave_current_coil_8: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_current_coil_ems_4"),
    temperature_hems_1: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_hems_1"),
    temperature_hems_2: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_hems_2"),
    temperature_hems_3: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_hems_3"),
    temperature_hems_4: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_hems_4"),
    temperature_ems_1: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_ems_1"),
    temperature_ems_2: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_ems_2"),
    temperature_ems_3: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_ems_3"),
    temperature_ems_4: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_ems_4"),
    temperature_lpu_1: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_lpu_1"),
    temperature_lpu_2: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_lpu_2"),
    temperature_lpu_3: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_lpu_3"),
    temperature_lpu_4: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_temperature_lpu_4"),
    slave_temperature_lpu_5: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_temperature_lpu_5"),
    slave_temperature_lpu_6: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_temperature_lpu_6"),
    slave_temperature_lpu_7: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_temperature_lpu_7"),
    slave_temperature_lpu_8: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_temperature_lpu_8"),
    battery_voltage_1: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_battery_voltage_1"),
    battery_voltage_2: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_battery_voltage_2"),
    slave_battery_voltage_3: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_battery_voltage_3"),
    slave_battery_voltage_4: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_slave_battery_voltage_4"),
    reference_current_1: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_hems_1"),
    reference_current_2: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_hems_2"),
    reference_current_3: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_hems_3"),
    reference_current_4: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_hems_4"),
    slave_reference_current_5: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_ems_1"),
    slave_reference_current_6: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_ems_2"),
    slave_reference_current_7: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_ems_3"),
    slave_reference_current_8: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_reference_current_ems_4"),
    rot_x: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_rot_x"),
    rot_y: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_rot_y"),
    rot_z: getMeasurementFallback(measurements, "LCU_MASTER/lcu_master_rot_z"),
    control_state: measurements.measurements["LCU_MASTER/lcu_master_control_state"]
  };
}
function selectObccuMeasurements(measurements) {
  return {
    "2BatteryTemperature1": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_1"),
    "2BatteryTemperature2": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_2"),
    "2BatteryTemperature3": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_3"),
    "2BatteryTemperature4": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_4"),
    "2BatteryTemperature5": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_5"),
    "2BatteryTemperature6": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_6"),
    "2BatteryTemperature7": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_7"),
    "2BatteryTemperature8": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_8"),
    "2BatteryTemperature9": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_9"),
    "2BatteryTemperature10": getMeasurementFallback(measurements, "OBCCU/2battery_temperature_10"),
    dclvTemperature: getMeasurementFallback(measurements, "OBCCU/dclv_temperature"),
    generalState: getMeasurementFallback(measurements, "OBCCU/general_state"),
    imd: getMeasurementFallback(measurements, "OBCCU/imd"),
    isBalancing1: getMeasurementFallback(measurements, "OBCCU/is_balancing1"),
    isBalancing10: getMeasurementFallback(measurements, "OBCCU/is_balancing10"),
    isBalancing2: getMeasurementFallback(measurements, "OBCCU/is_balancing2"),
    isBalancing3: getMeasurementFallback(measurements, "OBCCU/is_balancing3"),
    isBalancing4: getMeasurementFallback(measurements, "OBCCU/is_balancing4"),
    isBalancing5: getMeasurementFallback(measurements, "OBCCU/is_balancing5"),
    isBalancing6: getMeasurementFallback(measurements, "OBCCU/is_balancing6"),
    isBalancing7: getMeasurementFallback(measurements, "OBCCU/is_balancing7"),
    isBalancing8: getMeasurementFallback(measurements, "OBCCU/is_balancing8"),
    isBalancing9: getMeasurementFallback(measurements, "OBCCU/is_balancing9"),
    maximumCell1: getMeasurementFallback(measurements, "OBCCU/maximum_cell_1"),
    maximumCell10: getMeasurementFallback(measurements, "OBCCU/maximum_cell_10"),
    maximumCell2: getMeasurementFallback(measurements, "OBCCU/maximum_cell_2"),
    maximumCell3: getMeasurementFallback(measurements, "OBCCU/maximum_cell_3"),
    maximumCell4: getMeasurementFallback(measurements, "OBCCU/maximum_cell_4"),
    maximumCell5: getMeasurementFallback(measurements, "OBCCU/maximum_cell_5"),
    maximumCell6: getMeasurementFallback(measurements, "OBCCU/maximum_cell_6"),
    maximumCell7: getMeasurementFallback(measurements, "OBCCU/maximum_cell_7"),
    maximumCell8: getMeasurementFallback(measurements, "OBCCU/maximum_cell_8"),
    maximumCell9: getMeasurementFallback(measurements, "OBCCU/maximum_cell_9"),
    minimumCell1: getMeasurementFallback(measurements, "OBCCU/minimum_cell_1"),
    minimumCell10: getMeasurementFallback(measurements, "OBCCU/minimum_cell_10"),
    minimumCell2: getMeasurementFallback(measurements, "OBCCU/minimum_cell_2"),
    minimumCell3: getMeasurementFallback(measurements, "OBCCU/minimum_cell_3"),
    minimumCell4: getMeasurementFallback(measurements, "OBCCU/minimum_cell_4"),
    minimumCell5: getMeasurementFallback(measurements, "OBCCU/minimum_cell_5"),
    minimumCell6: getMeasurementFallback(measurements, "OBCCU/minimum_cell_6"),
    minimumCell7: getMeasurementFallback(measurements, "OBCCU/minimum_cell_7"),
    minimumCell8: getMeasurementFallback(measurements, "OBCCU/minimum_cell_8"),
    minimumCell9: getMeasurementFallback(measurements, "OBCCU/minimum_cell_9"),
    SOC1: getMeasurementFallback(measurements, "OBCCU/SOC1"),
    SOC10: getMeasurementFallback(measurements, "OBCCU/SOC10"),
    SOC2: getMeasurementFallback(measurements, "OBCCU/SOC2"),
    SOC3: getMeasurementFallback(measurements, "OBCCU/SOC3"),
    SOC4: getMeasurementFallback(measurements, "OBCCU/SOC4"),
    SOC5: getMeasurementFallback(measurements, "OBCCU/SOC5"),
    SOC6: getMeasurementFallback(measurements, "OBCCU/SOC6"),
    SOC7: getMeasurementFallback(measurements, "OBCCU/SOC7"),
    SOC8: getMeasurementFallback(measurements, "OBCCU/SOC8"),
    SOC9: getMeasurementFallback(measurements, "OBCCU/SOC9"),
    totalVoltage1: getMeasurementFallback(measurements, "OBCCU/total_voltage1"),
    totalVoltage10: getMeasurementFallback(measurements, "OBCCU/total_voltage10"),
    totalVoltage2: getMeasurementFallback(measurements, "OBCCU/total_voltage2"),
    totalVoltage3: getMeasurementFallback(measurements, "OBCCU/total_voltage3"),
    totalVoltage4: getMeasurementFallback(measurements, "OBCCU/total_voltage4"),
    totalVoltage5: getMeasurementFallback(measurements, "OBCCU/total_voltage5"),
    totalVoltage6: getMeasurementFallback(measurements, "OBCCU/total_voltage6"),
    totalVoltage7: getMeasurementFallback(measurements, "OBCCU/total_voltage7"),
    totalVoltage8: getMeasurementFallback(measurements, "OBCCU/total_voltage8"),
    totalVoltage9: getMeasurementFallback(measurements, "OBCCU/total_voltage9"),
    totalVoltageHigh: getMeasurementFallback(measurements, "OBCCU/total_voltage_high"),
    battery_temperature_1: getMeasurementFallback(measurements, "OBCCU/battery_temperature_1"),
    battery_temperature_2: getMeasurementFallback(measurements, "OBCCU/battery_temperature_2"),
    battery_temperature_3: getMeasurementFallback(measurements, "OBCCU/battery_temperature_3"),
    battery_temperature_4: getMeasurementFallback(measurements, "OBCCU/battery_temperature_4"),
    battery_temperature_5: getMeasurementFallback(measurements, "OBCCU/battery_temperature_5"),
    battery_temperature_6: getMeasurementFallback(measurements, "OBCCU/battery_temperature_6"),
    battery_temperature_7: getMeasurementFallback(measurements, "OBCCU/battery_temperature_7"),
    battery_temperature_8: getMeasurementFallback(measurements, "OBCCU/battery_temperature_8"),
    battery_temperature_9: getMeasurementFallback(measurements, "OBCCU/battery_temperature_9"),
    battery_temperature_10: getMeasurementFallback(measurements, "OBCCU/battery_temperature_10"),
    drift: getMeasurementFallback(measurements, "OBCCU/drift")
  };
}
function selectPcuMeasurements(measurements) {
  return {
    max_ppu_a_temperature: getMeasurementFallback(measurements, "PCU/max_ppu_a_temperature"),
    max_motor_a_temperature: getMeasurementFallback(measurements, "PCU/max_motor_a_temperature"),
    motor_a_current_u: getMeasurementFallback(measurements, "PCU/motor_a_current_u"),
    motor_a_current_v: getMeasurementFallback(measurements, "PCU/motor_a_current_v"),
    motor_a_current_w: getMeasurementFallback(measurements, "PCU/motor_a_current_w"),
    motor_b_current_u: getMeasurementFallback(measurements, "PCU/motor_b_current_u"),
    motor_b_current_v: getMeasurementFallback(measurements, "PCU/motor_b_current_v"),
    motor_b_current_w: getMeasurementFallback(measurements, "PCU/motor_b_current_w"),
    ppu_a_battery_voltage: getMeasurementFallback(measurements, "PCU/ppu_a_battery_voltage"),
    ppu_a_battery_current: getMeasurementFallback(measurements, "PCU/ppu_a_battery_current"),
    accel_x: getMeasurementFallback(measurements, "PCU/accel_x"),
    accel_y: getMeasurementFallback(measurements, "PCU/accel_y"),
    accel_z: getMeasurementFallback(measurements, "PCU/accel_z"),
    velocity: getMeasurementFallback(measurements, "PCU/velocity"),
    accel: getMeasurementFallback(measurements, "PCU/accel"),
    duty_u: getMeasurementFallback(measurements, "PCU/duty_u"),
    duty_v: getMeasurementFallback(measurements, "PCU/duty_v"),
    duty_w: getMeasurementFallback(measurements, "PCU/duty_w"),
    peak_current: getMeasurementFallback(measurements, "PCU/peak_current")
  };
}
function selectVcuMeasurements(measurements) {
  return {
    general_state: getMeasurementFallback(measurements, "VCU/general_state"),
    specific_state: getMeasurementFallback(measurements, "VCU/specific_state"),
    voltage_state: getMeasurementFallback(measurements, "VCU/voltage_state"),
    reference_pressure: getMeasurementFallback(measurements, "VCU/reference_pressure"),
    actual_pressure: getMeasurementFallback(measurements, "VCU/actual_pressure"),
    valve_state: getMeasurementFallback(measurements, "VCU/valve_state"),
    reed1: getMeasurementFallback(measurements, "VCU/reed1"),
    reed2: getMeasurementFallback(measurements, "VCU/reed2"),
    bottle_temp_1: getMeasurementFallback(measurements, "VCU/bottle_temp_1"),
    bottle_temp_2: getMeasurementFallback(measurements, "VCU/bottle_temp_2"),
    high_pressure: getMeasurementFallback(measurements, "VCU/high_pressure"),
    position: getMeasurementFallback(measurements, "VCU/position"),
    speed: getMeasurementFallback(measurements, "VCU/speed")
  };
}
const messagesReducer = messageSlice.reducer;
const { setOrders, updateStateOrders } = orderSlice.actions;
const orderReducer = orderSlice.reducer;
const { setWebSocketConnection, updateBoardConnections } = connectionsSlice$1.actions;
const connectionsSlice = connectionsSlice$1.reducer;
function n(n2) {
  for (var r2 = arguments.length, t2 = Array(r2 > 1 ? r2 - 1 : 0), e2 = 1; e2 < r2; e2++)
    t2[e2 - 1] = arguments[e2];
  throw Error("[Immer] minified error nr: " + n2 + (t2.length ? " " + t2.map(function(n3) {
    return "'" + n3 + "'";
  }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
}
function r(n2) {
  return !!n2 && !!n2[Q];
}
function t(n2) {
  var r2;
  return !!n2 && (function(n3) {
    if (!n3 || "object" != typeof n3)
      return false;
    var r3 = Object.getPrototypeOf(n3);
    if (null === r3)
      return true;
    var t2 = Object.hasOwnProperty.call(r3, "constructor") && r3.constructor;
    return t2 === Object || "function" == typeof t2 && Function.toString.call(t2) === Z;
  }(n2) || Array.isArray(n2) || !!n2[L] || !!(null === (r2 = n2.constructor) || void 0 === r2 ? void 0 : r2[L]) || s(n2) || v(n2));
}
function i(n2, r2, t2) {
  void 0 === t2 && (t2 = false), 0 === o(n2) ? (t2 ? Object.keys : nn)(n2).forEach(function(e2) {
    t2 && "symbol" == typeof e2 || r2(e2, n2[e2], n2);
  }) : n2.forEach(function(t3, e2) {
    return r2(e2, t3, n2);
  });
}
function o(n2) {
  var r2 = n2[Q];
  return r2 ? r2.i > 3 ? r2.i - 4 : r2.i : Array.isArray(n2) ? 1 : s(n2) ? 2 : v(n2) ? 3 : 0;
}
function u(n2, r2) {
  return 2 === o(n2) ? n2.has(r2) : Object.prototype.hasOwnProperty.call(n2, r2);
}
function a(n2, r2) {
  return 2 === o(n2) ? n2.get(r2) : n2[r2];
}
function f(n2, r2, t2) {
  var e2 = o(n2);
  2 === e2 ? n2.set(r2, t2) : 3 === e2 ? n2.add(t2) : n2[r2] = t2;
}
function c(n2, r2) {
  return n2 === r2 ? 0 !== n2 || 1 / n2 == 1 / r2 : n2 != n2 && r2 != r2;
}
function s(n2) {
  return X && n2 instanceof Map;
}
function v(n2) {
  return q && n2 instanceof Set;
}
function p(n2) {
  return n2.o || n2.t;
}
function l(n2) {
  if (Array.isArray(n2))
    return Array.prototype.slice.call(n2);
  var r2 = rn(n2);
  delete r2[Q];
  for (var t2 = nn(r2), e2 = 0; e2 < t2.length; e2++) {
    var i2 = t2[e2], o2 = r2[i2];
    false === o2.writable && (o2.writable = true, o2.configurable = true), (o2.get || o2.set) && (r2[i2] = { configurable: true, writable: true, enumerable: o2.enumerable, value: n2[i2] });
  }
  return Object.create(Object.getPrototypeOf(n2), r2);
}
function d(n2, e2) {
  return void 0 === e2 && (e2 = false), y(n2) || r(n2) || !t(n2) || (o(n2) > 1 && (n2.set = n2.add = n2.clear = n2.delete = h), Object.freeze(n2), e2 && i(n2, function(n3, r2) {
    return d(r2, true);
  }, true)), n2;
}
function h() {
  n(2);
}
function y(n2) {
  return null == n2 || "object" != typeof n2 || Object.isFrozen(n2);
}
function b(r2) {
  var t2 = tn[r2];
  return t2 || n(18, r2), t2;
}
function m(n2, r2) {
  tn[n2] || (tn[n2] = r2);
}
function _() {
  return U;
}
function j(n2, r2) {
  r2 && (b("Patches"), n2.u = [], n2.s = [], n2.v = r2);
}
function g(n2) {
  O(n2), n2.p.forEach(S), n2.p = null;
}
function O(n2) {
  n2 === U && (U = n2.l);
}
function w(n2) {
  return U = { p: [], l: U, h: n2, m: true, _: 0 };
}
function S(n2) {
  var r2 = n2[Q];
  0 === r2.i || 1 === r2.i ? r2.j() : r2.g = true;
}
function P(r2, e2) {
  e2._ = e2.p.length;
  var i2 = e2.p[0], o2 = void 0 !== r2 && r2 !== i2;
  return e2.h.O || b("ES5").S(e2, r2, o2), o2 ? (i2[Q].P && (g(e2), n(4)), t(r2) && (r2 = M(e2, r2), e2.l || x(e2, r2)), e2.u && b("Patches").M(i2[Q].t, r2, e2.u, e2.s)) : r2 = M(e2, i2, []), g(e2), e2.u && e2.v(e2.u, e2.s), r2 !== H ? r2 : void 0;
}
function M(n2, r2, t2) {
  if (y(r2))
    return r2;
  var e2 = r2[Q];
  if (!e2)
    return i(r2, function(i2, o3) {
      return A(n2, e2, r2, i2, o3, t2);
    }, true), r2;
  if (e2.A !== n2)
    return r2;
  if (!e2.P)
    return x(n2, e2.t, true), e2.t;
  if (!e2.I) {
    e2.I = true, e2.A._--;
    var o2 = 4 === e2.i || 5 === e2.i ? e2.o = l(e2.k) : e2.o, u2 = o2, a2 = false;
    3 === e2.i && (u2 = new Set(o2), o2.clear(), a2 = true), i(u2, function(r3, i2) {
      return A(n2, e2, o2, r3, i2, t2, a2);
    }), x(n2, o2, false), t2 && n2.u && b("Patches").N(e2, t2, n2.u, n2.s);
  }
  return e2.o;
}
function A(e2, i2, o2, a2, c6, s2, v2) {
  if (r(c6)) {
    var p2 = M(e2, c6, s2 && i2 && 3 !== i2.i && !u(i2.R, a2) ? s2.concat(a2) : void 0);
    if (f(o2, a2, p2), !r(p2))
      return;
    e2.m = false;
  } else
    v2 && o2.add(c6);
  if (t(c6) && !y(c6)) {
    if (!e2.h.D && e2._ < 1)
      return;
    M(e2, c6), i2 && i2.A.l || x(e2, c6);
  }
}
function x(n2, r2, t2) {
  void 0 === t2 && (t2 = false), !n2.l && n2.h.D && n2.m && d(r2, t2);
}
function z(n2, r2) {
  var t2 = n2[Q];
  return (t2 ? p(t2) : n2)[r2];
}
function I(n2, r2) {
  if (r2 in n2)
    for (var t2 = Object.getPrototypeOf(n2); t2; ) {
      var e2 = Object.getOwnPropertyDescriptor(t2, r2);
      if (e2)
        return e2;
      t2 = Object.getPrototypeOf(t2);
    }
}
function k(n2) {
  n2.P || (n2.P = true, n2.l && k(n2.l));
}
function E(n2) {
  n2.o || (n2.o = l(n2.t));
}
function N(n2, r2, t2) {
  var e2 = s(r2) ? b("MapSet").F(r2, t2) : v(r2) ? b("MapSet").T(r2, t2) : n2.O ? function(n3, r3) {
    var t3 = Array.isArray(n3), e3 = { i: t3 ? 1 : 0, A: r3 ? r3.A : _(), P: false, I: false, R: {}, l: r3, t: n3, k: null, o: null, j: null, C: false }, i2 = e3, o2 = en;
    t3 && (i2 = [e3], o2 = on$1);
    var u2 = Proxy.revocable(i2, o2), a2 = u2.revoke, f2 = u2.proxy;
    return e3.k = f2, e3.j = a2, f2;
  }(r2, t2) : b("ES5").J(r2, t2);
  return (t2 ? t2.A : _()).p.push(e2), e2;
}
function R(e2) {
  return r(e2) || n(22, e2), function n2(r2) {
    if (!t(r2))
      return r2;
    var e3, u2 = r2[Q], c6 = o(r2);
    if (u2) {
      if (!u2.P && (u2.i < 4 || !b("ES5").K(u2)))
        return u2.t;
      u2.I = true, e3 = D(r2, c6), u2.I = false;
    } else
      e3 = D(r2, c6);
    return i(e3, function(r3, t2) {
      u2 && a(u2.t, r3) === t2 || f(e3, r3, n2(t2));
    }), 3 === c6 ? new Set(e3) : e3;
  }(e2);
}
function D(n2, r2) {
  switch (r2) {
    case 2:
      return new Map(n2);
    case 3:
      return Array.from(n2);
  }
  return l(n2);
}
function F() {
  function t2(n2, r2) {
    var t3 = s2[n2];
    return t3 ? t3.enumerable = r2 : s2[n2] = t3 = { configurable: true, enumerable: r2, get: function() {
      var r3 = this[Q];
      return en.get(r3, n2);
    }, set: function(r3) {
      var t4 = this[Q];
      en.set(t4, n2, r3);
    } }, t3;
  }
  function e2(n2) {
    for (var r2 = n2.length - 1; r2 >= 0; r2--) {
      var t3 = n2[r2][Q];
      if (!t3.P)
        switch (t3.i) {
          case 5:
            a2(t3) && k(t3);
            break;
          case 4:
            o2(t3) && k(t3);
        }
    }
  }
  function o2(n2) {
    for (var r2 = n2.t, t3 = n2.k, e3 = nn(t3), i2 = e3.length - 1; i2 >= 0; i2--) {
      var o3 = e3[i2];
      if (o3 !== Q) {
        var a3 = r2[o3];
        if (void 0 === a3 && !u(r2, o3))
          return true;
        var f2 = t3[o3], s3 = f2 && f2[Q];
        if (s3 ? s3.t !== a3 : !c(f2, a3))
          return true;
      }
    }
    var v2 = !!r2[Q];
    return e3.length !== nn(r2).length + (v2 ? 0 : 1);
  }
  function a2(n2) {
    var r2 = n2.k;
    if (r2.length !== n2.t.length)
      return true;
    var t3 = Object.getOwnPropertyDescriptor(r2, r2.length - 1);
    if (t3 && !t3.get)
      return true;
    for (var e3 = 0; e3 < r2.length; e3++)
      if (!r2.hasOwnProperty(e3))
        return true;
    return false;
  }
  var s2 = {};
  m("ES5", { J: function(n2, r2) {
    var e3 = Array.isArray(n2), i2 = function(n3, r3) {
      if (n3) {
        for (var e4 = Array(r3.length), i3 = 0; i3 < r3.length; i3++)
          Object.defineProperty(e4, "" + i3, t2(i3, true));
        return e4;
      }
      var o4 = rn(r3);
      delete o4[Q];
      for (var u2 = nn(o4), a3 = 0; a3 < u2.length; a3++) {
        var f2 = u2[a3];
        o4[f2] = t2(f2, n3 || !!o4[f2].enumerable);
      }
      return Object.create(Object.getPrototypeOf(r3), o4);
    }(e3, n2), o3 = { i: e3 ? 5 : 4, A: r2 ? r2.A : _(), P: false, I: false, R: {}, l: r2, t: n2, k: i2, o: null, g: false, C: false };
    return Object.defineProperty(i2, Q, { value: o3, writable: true }), i2;
  }, S: function(n2, t3, o3) {
    o3 ? r(t3) && t3[Q].A === n2 && e2(n2.p) : (n2.u && function n3(r2) {
      if (r2 && "object" == typeof r2) {
        var t4 = r2[Q];
        if (t4) {
          var e3 = t4.t, o4 = t4.k, f2 = t4.R, c6 = t4.i;
          if (4 === c6)
            i(o4, function(r3) {
              r3 !== Q && (void 0 !== e3[r3] || u(e3, r3) ? f2[r3] || n3(o4[r3]) : (f2[r3] = true, k(t4)));
            }), i(e3, function(n4) {
              void 0 !== o4[n4] || u(o4, n4) || (f2[n4] = false, k(t4));
            });
          else if (5 === c6) {
            if (a2(t4) && (k(t4), f2.length = true), o4.length < e3.length)
              for (var s3 = o4.length; s3 < e3.length; s3++)
                f2[s3] = false;
            else
              for (var v2 = e3.length; v2 < o4.length; v2++)
                f2[v2] = true;
            for (var p2 = Math.min(o4.length, e3.length), l2 = 0; l2 < p2; l2++)
              o4.hasOwnProperty(l2) || (f2[l2] = true), void 0 === f2[l2] && n3(o4[l2]);
          }
        }
      }
    }(n2.p[0]), e2(n2.p));
  }, K: function(n2) {
    return 4 === n2.i ? o2(n2) : a2(n2);
  } });
}
var G, U, W = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x"), X = "undefined" != typeof Map, q = "undefined" != typeof Set, B = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect, H = W ? Symbol.for("immer-nothing") : ((G = {})["immer-nothing"] = true, G), L = W ? Symbol.for("immer-draftable") : "__$immer_draftable", Q = W ? Symbol.for("immer-state") : "__$immer_state", Z = "" + Object.prototype.constructor, nn = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(n2) {
  return Object.getOwnPropertyNames(n2).concat(Object.getOwnPropertySymbols(n2));
} : Object.getOwnPropertyNames, rn = Object.getOwnPropertyDescriptors || function(n2) {
  var r2 = {};
  return nn(n2).forEach(function(t2) {
    r2[t2] = Object.getOwnPropertyDescriptor(n2, t2);
  }), r2;
}, tn = {}, en = { get: function(n2, r2) {
  if (r2 === Q)
    return n2;
  var e2 = p(n2);
  if (!u(e2, r2))
    return function(n3, r3, t2) {
      var e3, i3 = I(r3, t2);
      return i3 ? "value" in i3 ? i3.value : null === (e3 = i3.get) || void 0 === e3 ? void 0 : e3.call(n3.k) : void 0;
    }(n2, e2, r2);
  var i2 = e2[r2];
  return n2.I || !t(i2) ? i2 : i2 === z(n2.t, r2) ? (E(n2), n2.o[r2] = N(n2.A.h, i2, n2)) : i2;
}, has: function(n2, r2) {
  return r2 in p(n2);
}, ownKeys: function(n2) {
  return Reflect.ownKeys(p(n2));
}, set: function(n2, r2, t2) {
  var e2 = I(p(n2), r2);
  if (null == e2 ? void 0 : e2.set)
    return e2.set.call(n2.k, t2), true;
  if (!n2.P) {
    var i2 = z(p(n2), r2), o2 = null == i2 ? void 0 : i2[Q];
    if (o2 && o2.t === t2)
      return n2.o[r2] = t2, n2.R[r2] = false, true;
    if (c(t2, i2) && (void 0 !== t2 || u(n2.t, r2)))
      return true;
    E(n2), k(n2);
  }
  return n2.o[r2] === t2 && (void 0 !== t2 || r2 in n2.o) || Number.isNaN(t2) && Number.isNaN(n2.o[r2]) || (n2.o[r2] = t2, n2.R[r2] = true), true;
}, deleteProperty: function(n2, r2) {
  return void 0 !== z(n2.t, r2) || r2 in n2.t ? (n2.R[r2] = false, E(n2), k(n2)) : delete n2.R[r2], n2.o && delete n2.o[r2], true;
}, getOwnPropertyDescriptor: function(n2, r2) {
  var t2 = p(n2), e2 = Reflect.getOwnPropertyDescriptor(t2, r2);
  return e2 ? { writable: true, configurable: 1 !== n2.i || "length" !== r2, enumerable: e2.enumerable, value: t2[r2] } : e2;
}, defineProperty: function() {
  n(11);
}, getPrototypeOf: function(n2) {
  return Object.getPrototypeOf(n2.t);
}, setPrototypeOf: function() {
  n(12);
} }, on$1 = {};
i(en, function(n2, r2) {
  on$1[n2] = function() {
    return arguments[0] = arguments[0][0], r2.apply(this, arguments);
  };
}), on$1.deleteProperty = function(r2, t2) {
  return on$1.set.call(this, r2, t2, void 0);
}, on$1.set = function(r2, t2, e2) {
  return en.set.call(this, r2[0], t2, e2, r2[0]);
};
var un = function() {
  function e2(r2) {
    var e3 = this;
    this.O = B, this.D = true, this.produce = function(r3, i3, o2) {
      if ("function" == typeof r3 && "function" != typeof i3) {
        var u2 = i3;
        i3 = r3;
        var a2 = e3;
        return function(n2) {
          var r4 = this;
          void 0 === n2 && (n2 = u2);
          for (var t2 = arguments.length, e4 = Array(t2 > 1 ? t2 - 1 : 0), o3 = 1; o3 < t2; o3++)
            e4[o3 - 1] = arguments[o3];
          return a2.produce(n2, function(n3) {
            var t3;
            return (t3 = i3).call.apply(t3, [r4, n3].concat(e4));
          });
        };
      }
      var f2;
      if ("function" != typeof i3 && n(6), void 0 !== o2 && "function" != typeof o2 && n(7), t(r3)) {
        var c6 = w(e3), s2 = N(e3, r3, void 0), v2 = true;
        try {
          f2 = i3(s2), v2 = false;
        } finally {
          v2 ? g(c6) : O(c6);
        }
        return "undefined" != typeof Promise && f2 instanceof Promise ? f2.then(function(n2) {
          return j(c6, o2), P(n2, c6);
        }, function(n2) {
          throw g(c6), n2;
        }) : (j(c6, o2), P(f2, c6));
      }
      if (!r3 || "object" != typeof r3) {
        if (void 0 === (f2 = i3(r3)) && (f2 = r3), f2 === H && (f2 = void 0), e3.D && d(f2, true), o2) {
          var p2 = [], l2 = [];
          b("Patches").M(r3, f2, p2, l2), o2(p2, l2);
        }
        return f2;
      }
      n(21, r3);
    }, this.produceWithPatches = function(n2, r3) {
      if ("function" == typeof n2)
        return function(r4) {
          for (var t3 = arguments.length, i4 = Array(t3 > 1 ? t3 - 1 : 0), o3 = 1; o3 < t3; o3++)
            i4[o3 - 1] = arguments[o3];
          return e3.produceWithPatches(r4, function(r5) {
            return n2.apply(void 0, [r5].concat(i4));
          });
        };
      var t2, i3, o2 = e3.produce(n2, r3, function(n3, r4) {
        t2 = n3, i3 = r4;
      });
      return "undefined" != typeof Promise && o2 instanceof Promise ? o2.then(function(n3) {
        return [n3, t2, i3];
      }) : [o2, t2, i3];
    }, "boolean" == typeof (null == r2 ? void 0 : r2.useProxies) && this.setUseProxies(r2.useProxies), "boolean" == typeof (null == r2 ? void 0 : r2.autoFreeze) && this.setAutoFreeze(r2.autoFreeze);
  }
  var i2 = e2.prototype;
  return i2.createDraft = function(e3) {
    t(e3) || n(8), r(e3) && (e3 = R(e3));
    var i3 = w(this), o2 = N(this, e3, void 0);
    return o2[Q].C = true, O(i3), o2;
  }, i2.finishDraft = function(r2, t2) {
    var e3 = r2 && r2[Q];
    var i3 = e3.A;
    return j(i3, t2), P(void 0, i3);
  }, i2.setAutoFreeze = function(n2) {
    this.D = n2;
  }, i2.setUseProxies = function(r2) {
    r2 && !B && n(20), this.O = r2;
  }, i2.applyPatches = function(n2, t2) {
    var e3;
    for (e3 = t2.length - 1; e3 >= 0; e3--) {
      var i3 = t2[e3];
      if (0 === i3.path.length && "replace" === i3.op) {
        n2 = i3.value;
        break;
      }
    }
    e3 > -1 && (t2 = t2.slice(e3 + 1));
    var o2 = b("Patches").$;
    return r(n2) ? o2(n2, t2) : this.produce(n2, function(n3) {
      return o2(n3, t2);
    });
  }, e2;
}(), an = new un();
an.produce;
an.produceWithPatches.bind(an);
an.setAutoFreeze.bind(an);
an.setUseProxies.bind(an);
an.applyPatches.bind(an);
an.createDraft.bind(an);
an.finishDraft.bind(an);
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _defineProperty(obj, key, value2) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value2,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value2;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target2) {
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source = null != arguments[i2] ? arguments[i2] : {};
    i2 % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target2, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target2, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target2;
}
function formatProdErrorMessage(code) {
  return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or use the non-minified dev environment for full errors. ";
}
var $$observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var randomString = function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
function isPlainObject$1(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function createStore(reducer2, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(formatProdErrorMessage(0));
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(formatProdErrorMessage(1));
    }
    return enhancer(createStore)(reducer2, preloadedState);
  }
  if (typeof reducer2 !== "function") {
    throw new Error(formatProdErrorMessage(2));
  }
  var currentReducer = reducer2;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  function getState2() {
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(3));
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(formatProdErrorMessage(4));
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(5));
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(6));
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index2 = nextListeners.indexOf(listener);
      nextListeners.splice(index2, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject$1(action)) {
      throw new Error(formatProdErrorMessage(7));
    }
    if (typeof action.type === "undefined") {
      throw new Error(formatProdErrorMessage(8));
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(9));
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i2 = 0; i2 < listeners.length; i2++) {
      var listener = listeners[i2];
      listener();
    }
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(formatProdErrorMessage(10));
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(formatProdErrorMessage(11));
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState2());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }
    }, _ref[$$observable] = function() {
      return this;
    }, _ref;
  }
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState: getState2,
    replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function(key) {
    var reducer2 = reducers[key];
    var initialState = reducer2(void 0, {
      type: ActionTypes.INIT
    });
    if (typeof initialState === "undefined") {
      throw new Error(formatProdErrorMessage(12));
    }
    if (typeof reducer2(void 0, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error(formatProdErrorMessage(13));
    }
  });
}
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i2 = 0; i2 < reducerKeys.length; i2++) {
    var key = reducerKeys[i2];
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);
  var shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e2) {
    shapeAssertionError = e2;
  }
  return function combination(state2, action) {
    if (state2 === void 0) {
      state2 = {};
    }
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer2 = finalReducers[_key];
      var previousStateForKey = state2[_key];
      var nextStateForKey = reducer2(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        action && action.type;
        throw new Error(formatProdErrorMessage(14));
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state2).length;
    return hasChanged ? nextState : state2;
  };
}
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(function(a2, b2) {
    return function() {
      return a2(b2.apply(void 0, arguments));
    };
  });
}
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function(createStore2) {
    return function() {
      var store2 = createStore2.apply(void 0, arguments);
      var _dispatch = function dispatch() {
        throw new Error(formatProdErrorMessage(15));
      };
      var middlewareAPI = {
        getState: store2.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function(middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store2.dispatch);
      return _objectSpread2(_objectSpread2({}, store2), {}, {
        dispatch: _dispatch
      });
    };
  };
}
function createThunkMiddleware(extraArgument) {
  var middleware = function middleware2(_ref) {
    var dispatch = _ref.dispatch, getState2 = _ref.getState;
    return function(next) {
      return function(action) {
        if (typeof action === "function") {
          return action(dispatch, getState2, extraArgument);
        }
        return next(action);
      };
    };
  };
  return middleware;
}
var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
const thunkMiddleware = thunk;
var __extends = globalThis && globalThis.__extends || function() {
  var extendStatics = function(d2, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
      d3.__proto__ = b3;
    } || function(d3, b3) {
      for (var p2 in b3)
        if (Object.prototype.hasOwnProperty.call(b3, p2))
          d3[p2] = b3[p2];
    };
    return extendStatics(d2, b2);
  };
  return function(d2, b2) {
    if (typeof b2 !== "function" && b2 !== null)
      throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
    extendStatics(d2, b2);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  };
}();
var __generator = globalThis && globalThis.__generator || function(thisArg, body2) {
  var _2 = { label: 0, sent: function() {
    if (t2[0] & 1)
      throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_2)
      try {
        if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done)
          return t2;
        if (y2 = 0, t2)
          op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [0];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t2 = _2.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t2[1]) {
              _2.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _2.label < t2[2]) {
              _2.label = t2[2];
              _2.ops.push(op);
              break;
            }
            if (t2[2])
              _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body2.call(thisArg, _2);
      } catch (e2) {
        op = [6, e2];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __spreadArray = globalThis && globalThis.__spreadArray || function(to2, from) {
  for (var i2 = 0, il2 = from.length, j2 = to2.length; i2 < il2; i2++, j2++)
    to2[j2] = from[i2];
  return to2;
};
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = function(obj, key, value2) {
  return key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
};
var __spreadValues = function(a2, b2) {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var _i = 0, _c = __getOwnPropSymbols(b2); _i < _c.length; _i++) {
      var prop = _c[_i];
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = function(a2, b2) {
  return __defProps(a2, __getOwnPropDescs(b2));
};
var __async = function(__this, __arguments, generator) {
  return new Promise(function(resolve, reject) {
    var fulfilled = function(value2) {
      try {
        step(generator.next(value2));
      } catch (e2) {
        reject(e2);
      }
    };
    var rejected = function(value2) {
      try {
        step(generator.throw(value2));
      } catch (e2) {
        reject(e2);
      }
    };
    var step = function(x2) {
      return x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
    };
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var composeWithDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length === 0)
    return void 0;
  if (typeof arguments[0] === "object")
    return compose;
  return compose.apply(null, arguments);
};
function isPlainObject(value2) {
  if (typeof value2 !== "object" || value2 === null)
    return false;
  var proto = Object.getPrototypeOf(value2);
  if (proto === null)
    return true;
  var baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }
  return proto === baseProto;
}
var MiddlewareArray = (
  /** @class */
  function(_super) {
    __extends(MiddlewareArray2, _super);
    function MiddlewareArray2() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var _this = _super.apply(this, args) || this;
      Object.setPrototypeOf(_this, MiddlewareArray2.prototype);
      return _this;
    }
    Object.defineProperty(MiddlewareArray2, Symbol.species, {
      get: function() {
        return MiddlewareArray2;
      },
      enumerable: false,
      configurable: true
    });
    MiddlewareArray2.prototype.concat = function() {
      var arr = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        arr[_i] = arguments[_i];
      }
      return _super.prototype.concat.apply(this, arr);
    };
    MiddlewareArray2.prototype.prepend = function() {
      var arr = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        arr[_i] = arguments[_i];
      }
      if (arr.length === 1 && Array.isArray(arr[0])) {
        return new (MiddlewareArray2.bind.apply(MiddlewareArray2, __spreadArray([void 0], arr[0].concat(this))))();
      }
      return new (MiddlewareArray2.bind.apply(MiddlewareArray2, __spreadArray([void 0], arr.concat(this))))();
    };
    return MiddlewareArray2;
  }(Array)
);
var EnhancerArray = (
  /** @class */
  function(_super) {
    __extends(EnhancerArray2, _super);
    function EnhancerArray2() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var _this = _super.apply(this, args) || this;
      Object.setPrototypeOf(_this, EnhancerArray2.prototype);
      return _this;
    }
    Object.defineProperty(EnhancerArray2, Symbol.species, {
      get: function() {
        return EnhancerArray2;
      },
      enumerable: false,
      configurable: true
    });
    EnhancerArray2.prototype.concat = function() {
      var arr = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        arr[_i] = arguments[_i];
      }
      return _super.prototype.concat.apply(this, arr);
    };
    EnhancerArray2.prototype.prepend = function() {
      var arr = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        arr[_i] = arguments[_i];
      }
      if (arr.length === 1 && Array.isArray(arr[0])) {
        return new (EnhancerArray2.bind.apply(EnhancerArray2, __spreadArray([void 0], arr[0].concat(this))))();
      }
      return new (EnhancerArray2.bind.apply(EnhancerArray2, __spreadArray([void 0], arr.concat(this))))();
    };
    return EnhancerArray2;
  }(Array)
);
function isBoolean(x2) {
  return typeof x2 === "boolean";
}
function curryGetDefaultMiddleware() {
  return function curriedGetDefaultMiddleware(options) {
    return getDefaultMiddleware(options);
  };
}
function getDefaultMiddleware(options) {
  if (options === void 0) {
    options = {};
  }
  var _c = options.thunk, thunk2 = _c === void 0 ? true : _c;
  options.immutableCheck;
  options.serializableCheck;
  var middlewareArray = new MiddlewareArray();
  if (thunk2) {
    if (isBoolean(thunk2)) {
      middlewareArray.push(thunkMiddleware);
    } else {
      middlewareArray.push(thunkMiddleware.withExtraArgument(thunk2.extraArgument));
    }
  }
  return middlewareArray;
}
var IS_PRODUCTION = true;
function configureStore(options) {
  var curriedGetDefaultMiddleware = curryGetDefaultMiddleware();
  var _c = options || {}, _d = _c.reducer, reducer2 = _d === void 0 ? void 0 : _d, _e = _c.middleware, middleware = _e === void 0 ? curriedGetDefaultMiddleware() : _e, _f = _c.devTools, devTools = _f === void 0 ? true : _f, _g = _c.preloadedState, preloadedState = _g === void 0 ? void 0 : _g, _h = _c.enhancers, enhancers = _h === void 0 ? void 0 : _h;
  var rootReducer;
  if (typeof reducer2 === "function") {
    rootReducer = reducer2;
  } else if (isPlainObject(reducer2)) {
    rootReducer = combineReducers(reducer2);
  } else {
    throw new Error('"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers');
  }
  var finalMiddleware = middleware;
  if (typeof finalMiddleware === "function") {
    finalMiddleware = finalMiddleware(curriedGetDefaultMiddleware);
  }
  var middlewareEnhancer = applyMiddleware.apply(void 0, finalMiddleware);
  var finalCompose = compose;
  if (devTools) {
    finalCompose = composeWithDevTools(__spreadValues({
      trace: !IS_PRODUCTION
    }, typeof devTools === "object" && devTools));
  }
  var defaultEnhancers = new EnhancerArray(middlewareEnhancer);
  var storeEnhancers = defaultEnhancers;
  if (Array.isArray(enhancers)) {
    storeEnhancers = __spreadArray([middlewareEnhancer], enhancers);
  } else if (typeof enhancers === "function") {
    storeEnhancers = enhancers(defaultEnhancers);
  }
  var composedEnhancer = finalCompose.apply(void 0, storeEnhancers);
  return createStore(rootReducer, preloadedState, composedEnhancer);
}
function createAction(type, prepareAction) {
  function actionCreator() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (prepareAction) {
      var prepared = prepareAction.apply(void 0, args);
      if (!prepared) {
        throw new Error("prepareAction did not return an object");
      }
      return __spreadValues(__spreadValues({
        type,
        payload: prepared.payload
      }, "meta" in prepared && { meta: prepared.meta }), "error" in prepared && { error: prepared.error });
    }
    return { type, payload: args[0] };
  }
  actionCreator.toString = function() {
    return "" + type;
  };
  actionCreator.type = type;
  actionCreator.match = function(action) {
    return action.type === type;
  };
  return actionCreator;
}
var urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
var nanoid$1 = function(size) {
  if (size === void 0) {
    size = 21;
  }
  var id2 = "";
  var i2 = size;
  while (i2--) {
    id2 += urlAlphabet[Math.random() * 64 | 0];
  }
  return id2;
};
var commonProperties = [
  "name",
  "message",
  "stack",
  "code"
];
var RejectWithValue = (
  /** @class */
  function() {
    function RejectWithValue2(payload, meta) {
      this.payload = payload;
      this.meta = meta;
    }
    return RejectWithValue2;
  }()
);
var FulfillWithMeta = (
  /** @class */
  function() {
    function FulfillWithMeta2(payload, meta) {
      this.payload = payload;
      this.meta = meta;
    }
    return FulfillWithMeta2;
  }()
);
var miniSerializeError = function(value2) {
  if (typeof value2 === "object" && value2 !== null) {
    var simpleError = {};
    for (var _i = 0, commonProperties_1 = commonProperties; _i < commonProperties_1.length; _i++) {
      var property = commonProperties_1[_i];
      if (typeof value2[property] === "string") {
        simpleError[property] = value2[property];
      }
    }
    return simpleError;
  }
  return { message: String(value2) };
};
(function() {
  function createAsyncThunk2(typePrefix, payloadCreator, options) {
    var fulfilled = createAction(typePrefix + "/fulfilled", function(payload, requestId, arg, meta) {
      return {
        payload,
        meta: __spreadProps(__spreadValues({}, meta || {}), {
          arg,
          requestId,
          requestStatus: "fulfilled"
        })
      };
    });
    var pending = createAction(typePrefix + "/pending", function(requestId, arg, meta) {
      return {
        payload: void 0,
        meta: __spreadProps(__spreadValues({}, meta || {}), {
          arg,
          requestId,
          requestStatus: "pending"
        })
      };
    });
    var rejected = createAction(typePrefix + "/rejected", function(error, requestId, arg, payload, meta) {
      return {
        payload,
        error: (options && options.serializeError || miniSerializeError)(error || "Rejected"),
        meta: __spreadProps(__spreadValues({}, meta || {}), {
          arg,
          requestId,
          rejectedWithValue: !!payload,
          requestStatus: "rejected",
          aborted: (error == null ? void 0 : error.name) === "AbortError",
          condition: (error == null ? void 0 : error.name) === "ConditionError"
        })
      };
    });
    var AC = typeof AbortController !== "undefined" ? AbortController : (
      /** @class */
      function() {
        function class_1() {
          this.signal = {
            aborted: false,
            addEventListener: function() {
            },
            dispatchEvent: function() {
              return false;
            },
            onabort: function() {
            },
            removeEventListener: function() {
            },
            reason: void 0,
            throwIfAborted: function() {
            }
          };
        }
        class_1.prototype.abort = function() {
        };
        return class_1;
      }()
    );
    function actionCreator(arg) {
      return function(dispatch, getState2, extra) {
        var requestId = (options == null ? void 0 : options.idGenerator) ? options.idGenerator(arg) : nanoid$1();
        var abortController = new AC();
        var abortReason;
        function abort(reason) {
          abortReason = reason;
          abortController.abort();
        }
        var promise2 = function() {
          return __async(this, null, function() {
            var _a, _b, finalAction, conditionResult, abortedPromise, err_1, skipDispatch;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  _c.trys.push([0, 4, , 5]);
                  conditionResult = (_a = options == null ? void 0 : options.condition) == null ? void 0 : _a.call(options, arg, { getState: getState2, extra });
                  if (!isThenable(conditionResult))
                    return [3, 2];
                  return [4, conditionResult];
                case 1:
                  conditionResult = _c.sent();
                  _c.label = 2;
                case 2:
                  if (conditionResult === false || abortController.signal.aborted) {
                    throw {
                      name: "ConditionError",
                      message: "Aborted due to condition callback returning false."
                    };
                  }
                  abortedPromise = new Promise(function(_2, reject) {
                    return abortController.signal.addEventListener("abort", function() {
                      return reject({
                        name: "AbortError",
                        message: abortReason || "Aborted"
                      });
                    });
                  });
                  dispatch(pending(requestId, arg, (_b = options == null ? void 0 : options.getPendingMeta) == null ? void 0 : _b.call(options, { requestId, arg }, { getState: getState2, extra })));
                  return [4, Promise.race([
                    abortedPromise,
                    Promise.resolve(payloadCreator(arg, {
                      dispatch,
                      getState: getState2,
                      extra,
                      requestId,
                      signal: abortController.signal,
                      abort,
                      rejectWithValue: function(value2, meta) {
                        return new RejectWithValue(value2, meta);
                      },
                      fulfillWithValue: function(value2, meta) {
                        return new FulfillWithMeta(value2, meta);
                      }
                    })).then(function(result) {
                      if (result instanceof RejectWithValue) {
                        throw result;
                      }
                      if (result instanceof FulfillWithMeta) {
                        return fulfilled(result.payload, requestId, arg, result.meta);
                      }
                      return fulfilled(result, requestId, arg);
                    })
                  ])];
                case 3:
                  finalAction = _c.sent();
                  return [3, 5];
                case 4:
                  err_1 = _c.sent();
                  finalAction = err_1 instanceof RejectWithValue ? rejected(null, requestId, arg, err_1.payload, err_1.meta) : rejected(err_1, requestId, arg);
                  return [3, 5];
                case 5:
                  skipDispatch = options && !options.dispatchConditionRejection && rejected.match(finalAction) && finalAction.meta.condition;
                  if (!skipDispatch) {
                    dispatch(finalAction);
                  }
                  return [2, finalAction];
              }
            });
          });
        }();
        return Object.assign(promise2, {
          abort,
          requestId,
          arg,
          unwrap: function() {
            return promise2.then(unwrapResult);
          }
        });
      };
    }
    return Object.assign(actionCreator, {
      pending,
      rejected,
      fulfilled,
      typePrefix
    });
  }
  createAsyncThunk2.withTypes = function() {
    return createAsyncThunk2;
  };
  return createAsyncThunk2;
})();
function unwrapResult(action) {
  if (action.meta && action.meta.rejectedWithValue) {
    throw action.payload;
  }
  if (action.error) {
    throw action.error;
  }
  return action.payload;
}
function isThenable(value2) {
  return value2 !== null && typeof value2 === "object" && typeof value2.then === "function";
}
var alm = "listenerMiddleware";
createAction(alm + "/add");
createAction(alm + "/removeAll");
createAction(alm + "/remove");
var promise;
typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : globalThis) : function(cb2) {
  return (promise || (promise = Promise.resolve())).then(cb2).catch(function(err) {
    return setTimeout(function() {
      throw err;
    }, 0);
  });
};
F();
const { initMeasurements, updateMeasurements } = measurementsSlice.actions;
const measurementsReducer = measurementsSlice.reducer;
const store = configureStore({
  reducer: {
    measurements: measurementsReducer,
    messages: messagesReducer,
    orders: orderReducer,
    connections: connectionsSlice
  }
});
/**
 * @remix-run/router v1.3.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target2[key] = source[key];
        }
      }
    }
    return target2;
  };
  return _extends$2.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to2) {
    return typeof to2 === "string" ? to2 : createPath(to2);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value2, message2) {
  if (value2 === false || value2 === null || typeof value2 === "undefined") {
    throw new Error(message2);
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index2) {
  return {
    usr: location.state,
    key: location.key,
    idx: index2
  };
}
function createLocation(current, to2, state2, key) {
  if (state2 === void 0) {
    state2 = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to2 === "string" ? parsePath(to2) : to2, {
    state: state2,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to2 && to2.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index2 = getIndex();
  if (index2 == null) {
    index2 = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index2
    }), "");
  }
  function getIndex() {
    let state2 = globalHistory.state || {
      idx: null
    };
    return state2.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index2;
    index2 = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to2, state2) {
    action = Action.Push;
    let location = createLocation(history.location, to2, state2);
    if (validateLocation)
      validateLocation(location, to2);
    index2 = getIndex() + 1;
    let historyState = getHistoryState(location, index2);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to2, state2) {
    action = Action.Replace;
    let location = createLocation(history.location, to2, state2);
    if (validateLocation)
      validateLocation(location, to2);
    index2 = getIndex();
    let historyState = getHistoryState(location, index2);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to2) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to2 === "string" ? to2 : createPath(to2);
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn2) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn2;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to2) {
      return createHref(window2, to2);
    },
    createURL,
    encodeLocation(to2) {
      let url = createURL(to2);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function isIndexRoute(route) {
  return route.index === true;
}
function convertRoutesToDataRoutes(routes, parentPath, allIds) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  if (allIds === void 0) {
    allIds = /* @__PURE__ */ new Set();
  }
  return routes.map((route, index2) => {
    let treePath = [...parentPath, index2];
    let id2 = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
    invariant(!allIds.has(id2), 'Found a route id collision on id "' + id2 + `".  Route id's must be globally unique within Data Router usages`);
    allIds.add(id2);
    if (isIndexRoute(route)) {
      let indexRoute = _extends$2({}, route, {
        id: id2
      });
      return indexRoute;
    } else {
      let pathOrLayoutRoute = _extends$2({}, route, {
        id: id2,
        children: route.children ? convertRoutesToDataRoutes(route.children, treePath, allIds) : void 0
      });
      return pathOrLayoutRoute;
    }
  });
}
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i2 = 0; matches == null && i2 < branches.length; ++i2) {
    matches = matchRouteBranch(
      branches[i2],
      // Incoming pathnames are generally encoded from either window.location
      // or from router.navigate, but we want to match against the unencoded
      // paths in the route definitions.  Memory router locations won't be
      // encoded here but there also shouldn't be anything to decode so this
      // should be a safe operation.  This avoids needing matchRoutes to be
      // history-aware.
      safelyDecodeURI(pathname)
    );
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index2, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index2,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index2) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index2);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index2, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0)
    return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a2, b2) => a2.score !== b2.score ? b2.score - a2.score : compareIndexes(a2.routesMeta.map((meta) => meta.childrenIndex), b2.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s2) => s2 === "*";
function computeScore(path, index2) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index2) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s2) => !isSplat(s2)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a2, b2) {
  let siblings = a2.length === b2.length && a2.slice(0, -1).every((n2, i2) => n2 === b2[i2]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a2[a2.length - 1] - b2[b2.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i2 = 0; i2 < routesMeta.length; ++i2) {
    let meta = routesMeta[i2];
    let end = i2 === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match)
      return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match)
    return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = paramNames.reduce((memo, paramName, index2) => {
    if (paramName === "*") {
      let splatValue = captureGroups[index2] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    memo[paramName] = safelyDecodeURIComponent(captureGroups[index2] || "", paramName);
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let paramNames = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^$?{}|()[\]]/g, "\\$&").replace(/\/:(\w+)/g, (_2, paramName) => {
    paramNames.push(paramName);
    return "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else
    ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, paramNames];
}
function safelyDecodeURI(value2) {
  try {
    return decodeURI(value2);
  } catch (error) {
    warning(false, 'The URL path "' + value2 + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value2;
  }
}
function safelyDecodeURIComponent(value2, paramName) {
  try {
    return decodeURIComponent(value2);
  } catch (error) {
    warning(false, 'The value for the URL param "' + paramName + '" will not be decoded because' + (' the string "' + value2 + '" is a malformed URL segment. This is probably') + (" due to a bad percent encoding (" + error + ")."));
    return value2;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/")
    return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function warning(cond, message2) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message2);
    try {
      throw new Error(message2);
    } catch (e2) {
    }
  }
}
function resolvePath(to2, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to2 === "string" ? parsePath(to2) : to2;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1)
        segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field2, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field2 + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index2) => index2 === 0 || match.route.path && match.route.path.length > 0);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to2;
  if (typeof toArg === "string") {
    to2 = parsePath(toArg);
  } else {
    to2 = _extends$2({}, toArg);
    invariant(!to2.pathname || !to2.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to2));
    invariant(!to2.pathname || !to2.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to2));
    invariant(!to2.search || !to2.search.includes("#"), getInvalidPathError("#", "search", "hash", to2));
  }
  let isEmptyPath = toArg === "" || to2.pathname === "";
  let toPathname = isEmptyPath ? "/" : to2.pathname;
  let from;
  if (isPathRelative || toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to2.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to2, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
class AbortedDeferredError extends Error {
}
class DeferredData {
  constructor(data, responseInit) {
    this.pendingKeysSet = /* @__PURE__ */ new Set();
    this.subscribers = /* @__PURE__ */ new Set();
    this.deferredKeys = [];
    invariant(data && typeof data === "object" && !Array.isArray(data), "defer() only accepts plain objects");
    let reject;
    this.abortPromise = new Promise((_2, r2) => reject = r2);
    this.controller = new AbortController();
    let onAbort = () => reject(new AbortedDeferredError("Deferred data aborted"));
    this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", onAbort);
    this.controller.signal.addEventListener("abort", onAbort);
    this.data = Object.entries(data).reduce((acc, _ref) => {
      let [key, value2] = _ref;
      return Object.assign(acc, {
        [key]: this.trackPromise(key, value2)
      });
    }, {});
    if (this.done) {
      this.unlistenAbortSignal();
    }
    this.init = responseInit;
  }
  trackPromise(key, value2) {
    if (!(value2 instanceof Promise)) {
      return value2;
    }
    this.deferredKeys.push(key);
    this.pendingKeysSet.add(key);
    let promise2 = Promise.race([value2, this.abortPromise]).then((data) => this.onSettle(promise2, key, null, data), (error) => this.onSettle(promise2, key, error));
    promise2.catch(() => {
    });
    Object.defineProperty(promise2, "_tracked", {
      get: () => true
    });
    return promise2;
  }
  onSettle(promise2, key, error, data) {
    if (this.controller.signal.aborted && error instanceof AbortedDeferredError) {
      this.unlistenAbortSignal();
      Object.defineProperty(promise2, "_error", {
        get: () => error
      });
      return Promise.reject(error);
    }
    this.pendingKeysSet.delete(key);
    if (this.done) {
      this.unlistenAbortSignal();
    }
    if (error) {
      Object.defineProperty(promise2, "_error", {
        get: () => error
      });
      this.emit(false, key);
      return Promise.reject(error);
    }
    Object.defineProperty(promise2, "_data", {
      get: () => data
    });
    this.emit(false, key);
    return data;
  }
  emit(aborted, settledKey) {
    this.subscribers.forEach((subscriber) => subscriber(aborted, settledKey));
  }
  subscribe(fn2) {
    this.subscribers.add(fn2);
    return () => this.subscribers.delete(fn2);
  }
  cancel() {
    this.controller.abort();
    this.pendingKeysSet.forEach((v2, k2) => this.pendingKeysSet.delete(k2));
    this.emit(true);
  }
  async resolveData(signal) {
    let aborted = false;
    if (!this.done) {
      let onAbort = () => this.cancel();
      signal.addEventListener("abort", onAbort);
      aborted = await new Promise((resolve) => {
        this.subscribe((aborted2) => {
          signal.removeEventListener("abort", onAbort);
          if (aborted2 || this.done) {
            resolve(aborted2);
          }
        });
      });
    }
    return aborted;
  }
  get done() {
    return this.pendingKeysSet.size === 0;
  }
  get unwrappedData() {
    invariant(this.data !== null && this.done, "Can only unwrap data on initialized and settled deferreds");
    return Object.entries(this.data).reduce((acc, _ref2) => {
      let [key, value2] = _ref2;
      return Object.assign(acc, {
        [key]: unwrapTrackedPromise(value2)
      });
    }, {});
  }
  get pendingKeys() {
    return Array.from(this.pendingKeysSet);
  }
}
function isTrackedPromise(value2) {
  return value2 instanceof Promise && value2._tracked === true;
}
function unwrapTrackedPromise(value2) {
  if (!isTrackedPromise(value2)) {
    return value2;
  }
  if (value2._error) {
    throw value2._error;
  }
  return value2._data;
}
class ErrorResponse {
  constructor(status, statusText, data, internal) {
    if (internal === void 0) {
      internal = false;
    }
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data instanceof Error) {
      this.data = data.toString();
      this.error = data;
    } else {
      this.data = data;
    }
  }
}
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
const validMutationMethods = new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
const validRequestMethods = new Set(validRequestMethodsArr);
const redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
const redirectPreserveMethodStatusCodes = /* @__PURE__ */ new Set([307, 308]);
const IDLE_NAVIGATION = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0
};
const IDLE_FETCHER = {
  state: "idle",
  data: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0
};
const IDLE_BLOCKER = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
};
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const isBrowser$1 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const isServer = !isBrowser$1;
function createRouter(init) {
  invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let dataRoutes = convertRoutesToDataRoutes(init.routes);
  let unlistenHistory = null;
  let subscribers = /* @__PURE__ */ new Set();
  let savedScrollPositions = null;
  let getScrollRestorationKey = null;
  let getScrollPosition = null;
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, init.basename);
  let initialErrors = null;
  if (initialMatches == null) {
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let {
      matches,
      route
    } = getShortCircuitMatches(dataRoutes);
    initialMatches = matches;
    initialErrors = {
      [route.id]: error
    };
  }
  let initialized = !initialMatches.some((m2) => m2.route.loader) || init.hydrationData != null;
  let router2;
  let state2 = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  };
  let pendingAction = Action.Pop;
  let pendingPreventScrollReset = false;
  let pendingNavigationController;
  let isUninterruptedRevalidation = false;
  let isRevalidationRequired = false;
  let cancelledDeferredRoutes = [];
  let cancelledFetcherLoads = [];
  let fetchControllers = /* @__PURE__ */ new Map();
  let incrementingLoadId = 0;
  let pendingNavigationLoadId = -1;
  let fetchReloadIds = /* @__PURE__ */ new Map();
  let fetchRedirectIds = /* @__PURE__ */ new Set();
  let fetchLoadMatches = /* @__PURE__ */ new Map();
  let activeDeferreds = /* @__PURE__ */ new Map();
  let blockerFunctions = /* @__PURE__ */ new Map();
  let ignoreNextHistoryUpdate = false;
  function initialize() {
    unlistenHistory = init.history.listen((_ref) => {
      let {
        action: historyAction,
        location,
        delta
      } = _ref;
      if (ignoreNextHistoryUpdate) {
        ignoreNextHistoryUpdate = false;
        return;
      }
      warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let blockerKey = shouldBlockNavigation({
        currentLocation: state2.location,
        nextLocation: location,
        historyAction
      });
      if (blockerKey && delta != null) {
        ignoreNextHistoryUpdate = true;
        init.history.go(delta * -1);
        updateBlocker(blockerKey, {
          state: "blocked",
          location,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location
            });
            init.history.go(delta);
          },
          reset() {
            deleteBlocker(blockerKey);
            updateState({
              blockers: new Map(router2.state.blockers)
            });
          }
        });
        return;
      }
      return startNavigation(historyAction, location);
    });
    if (!state2.initialized) {
      startNavigation(Action.Pop, state2.location);
    }
    return router2;
  }
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state2.fetchers.forEach((_2, key) => deleteFetcher(key));
    state2.blockers.forEach((_2, key) => deleteBlocker(key));
  }
  function subscribe(fn2) {
    subscribers.add(fn2);
    return () => subscribers.delete(fn2);
  }
  function updateState(newState) {
    state2 = _extends$2({}, state2, newState);
    subscribers.forEach((subscriber) => subscriber(state2));
  }
  function completeNavigation(location, newState) {
    var _location$state, _location$state2;
    let isActionReload = state2.actionData != null && state2.navigation.formMethod != null && isMutationMethod(state2.navigation.formMethod) && state2.navigation.state === "loading" && ((_location$state = location.state) == null ? void 0 : _location$state._isRedirect) !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        actionData = null;
      }
    } else if (isActionReload) {
      actionData = state2.actionData;
    } else {
      actionData = null;
    }
    let loaderData = newState.loaderData ? mergeLoaderData(state2.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state2.loaderData;
    for (let [key] of blockerFunctions) {
      deleteBlocker(key);
    }
    let preventScrollReset = pendingPreventScrollReset === true || state2.navigation.formMethod != null && isMutationMethod(state2.navigation.formMethod) && ((_location$state2 = location.state) == null ? void 0 : _location$state2._isRedirect) !== true;
    updateState(_extends$2({}, newState, {
      actionData,
      loaderData,
      historyAction: pendingAction,
      location,
      initialized: true,
      navigation: IDLE_NAVIGATION,
      revalidation: "idle",
      restoreScrollPosition: getSavedScrollPosition(location, newState.matches || state2.matches),
      preventScrollReset,
      blockers: new Map(state2.blockers)
    }));
    if (isUninterruptedRevalidation)
      ;
    else if (pendingAction === Action.Pop)
      ;
    else if (pendingAction === Action.Push) {
      init.history.push(location, location.state);
    } else if (pendingAction === Action.Replace) {
      init.history.replace(location, location.state);
    }
    pendingAction = Action.Pop;
    pendingPreventScrollReset = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    cancelledDeferredRoutes = [];
    cancelledFetcherLoads = [];
  }
  async function navigate(to2, opts) {
    if (typeof to2 === "number") {
      init.history.go(to2);
      return;
    }
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(to2, opts);
    let currentLocation = state2.location;
    let nextLocation = createLocation(state2.location, path, opts && opts.state);
    nextLocation = _extends$2({}, nextLocation, init.history.encodeLocation(nextLocation));
    let userReplace = opts && opts.replace != null ? opts.replace : void 0;
    let historyAction = Action.Push;
    if (userReplace === true) {
      historyAction = Action.Replace;
    } else if (userReplace === false)
      ;
    else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state2.location.pathname + state2.location.search) {
      historyAction = Action.Replace;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : void 0;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: nextLocation
          });
          navigate(to2, opts);
        },
        reset() {
          deleteBlocker(blockerKey);
          updateState({
            blockers: new Map(state2.blockers)
          });
        }
      });
      return;
    }
    return await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace
    });
  }
  function revalidate() {
    interruptActiveLoads();
    updateState({
      revalidation: "loading"
    });
    if (state2.navigation.state === "submitting") {
      return;
    }
    if (state2.navigation.state === "idle") {
      startNavigation(state2.historyAction, state2.location, {
        startUninterruptedRevalidation: true
      });
      return;
    }
    startNavigation(pendingAction || state2.historyAction, state2.navigation.location, {
      overrideNavigation: state2.navigation
    });
  }
  async function startNavigation(historyAction, location, opts) {
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    saveScrollPosition(state2.location, state2.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = matchRoutes(dataRoutes, location, init.basename);
    if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      cancelActiveDeferreds();
      completeNavigation(location, {
        matches: notFoundMatches,
        loaderData: {},
        errors: {
          [route.id]: error
        }
      });
      return;
    }
    if (isHashChangeOnly(state2.location, location) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location, {
        matches
      });
      return;
    }
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(init.history, location, pendingNavigationController.signal, opts && opts.submission);
    let pendingActionData;
    let pendingError;
    if (opts && opts.pendingError) {
      pendingError = {
        [findNearestBoundary(matches).route.id]: opts.pendingError
      };
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      let actionOutput = await handleAction(request, location, opts.submission, matches, {
        replace: opts.replace
      });
      if (actionOutput.shortCircuited) {
        return;
      }
      pendingActionData = actionOutput.pendingActionData;
      pendingError = actionOutput.pendingActionError;
      let navigation = _extends$2({
        state: "loading",
        location
      }, opts.submission);
      loadingNavigation = navigation;
      request = new Request(request.url, {
        signal: request.signal
      });
    }
    let {
      shortCircuited,
      loaderData,
      errors
    } = await handleLoaders(request, location, matches, loadingNavigation, opts && opts.submission, opts && opts.replace, pendingActionData, pendingError);
    if (shortCircuited) {
      return;
    }
    pendingNavigationController = null;
    completeNavigation(location, _extends$2({
      matches
    }, pendingActionData ? {
      actionData: pendingActionData
    } : {}, {
      loaderData,
      errors
    }));
  }
  async function handleAction(request, location, submission, matches, opts) {
    interruptActiveLoads();
    let navigation = _extends$2({
      state: "submitting",
      location
    }, submission);
    updateState({
      navigation
    });
    let result;
    let actionMatch = getTargetMatch(matches, location);
    if (!actionMatch.route.action) {
      result = {
        type: ResultType.error,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      result = await callLoaderOrAction("action", request, actionMatch, matches, router2.basename);
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
    }
    if (isRedirectResult(result)) {
      let replace;
      if (opts && opts.replace != null) {
        replace = opts.replace;
      } else {
        replace = result.location === state2.location.pathname + state2.location.search;
      }
      await startRedirectNavigation(state2, result, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
    }
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        // Send back an empty object we can use to clear out any prior actionData
        pendingActionData: {},
        pendingActionError: {
          [boundaryMatch.route.id]: result.error
        }
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    return {
      pendingActionData: {
        [actionMatch.route.id]: result.data
      }
    };
  }
  async function handleLoaders(request, location, matches, overrideNavigation, submission, replace, pendingActionData, pendingError) {
    let loadingNavigation = overrideNavigation;
    if (!loadingNavigation) {
      let navigation = _extends$2({
        state: "loading",
        location,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0
      }, submission);
      loadingNavigation = navigation;
    }
    let activeSubmission = submission ? submission : loadingNavigation.formMethod && loadingNavigation.formAction && loadingNavigation.formData && loadingNavigation.formEncType ? {
      formMethod: loadingNavigation.formMethod,
      formAction: loadingNavigation.formAction,
      formData: loadingNavigation.formData,
      formEncType: loadingNavigation.formEncType
    } : void 0;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state2, matches, activeSubmission, location, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, pendingActionData, pendingError, fetchLoadMatches);
    cancelActiveDeferreds((routeId) => !(matches && matches.some((m2) => m2.route.id === routeId)) || matchesToLoad && matchesToLoad.some((m2) => m2.route.id === routeId));
    if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
      completeNavigation(location, _extends$2({
        matches,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: pendingError || null
      }, pendingActionData ? {
        actionData: pendingActionData
      } : {}));
      return {
        shortCircuited: true
      };
    }
    if (!isUninterruptedRevalidation) {
      revalidatingFetchers.forEach((rf2) => {
        let fetcher = state2.fetchers.get(rf2.key);
        let revalidatingFetcher = {
          state: "loading",
          data: fetcher && fetcher.data,
          formMethod: void 0,
          formAction: void 0,
          formEncType: void 0,
          formData: void 0,
          " _hasFetcherDoneAnything ": true
        };
        state2.fetchers.set(rf2.key, revalidatingFetcher);
      });
      let actionData = pendingActionData || state2.actionData;
      updateState(_extends$2({
        navigation: loadingNavigation
      }, actionData ? Object.keys(actionData).length === 0 ? {
        actionData: null
      } : {
        actionData
      } : {}, revalidatingFetchers.length > 0 ? {
        fetchers: new Map(state2.fetchers)
      } : {}));
    }
    pendingNavigationLoadId = ++incrementingLoadId;
    revalidatingFetchers.forEach((rf2) => fetchControllers.set(rf2.key, pendingNavigationController));
    let {
      results,
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state2.matches, matches, matchesToLoad, revalidatingFetchers, request);
    if (request.signal.aborted) {
      return {
        shortCircuited: true
      };
    }
    revalidatingFetchers.forEach((rf2) => fetchControllers.delete(rf2.key));
    let redirect = findRedirect(results);
    if (redirect) {
      await startRedirectNavigation(state2, redirect, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    let {
      loaderData,
      errors
    } = processLoaderData(state2, matches, matchesToLoad, loaderResults, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds);
    activeDeferreds.forEach((deferredData, routeId) => {
      deferredData.subscribe((aborted) => {
        if (aborted || deferredData.done) {
          activeDeferreds.delete(routeId);
        }
      });
    });
    markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    return _extends$2({
      loaderData,
      errors
    }, didAbortFetchLoads || revalidatingFetchers.length > 0 ? {
      fetchers: new Map(state2.fetchers)
    } : {});
  }
  function getFetcher(key) {
    return state2.fetchers.get(key) || IDLE_FETCHER;
  }
  function fetch2(key, routeId, href, opts) {
    if (isServer) {
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    }
    if (fetchControllers.has(key))
      abortFetcher(key);
    let matches = matchRoutes(dataRoutes, href, init.basename);
    if (!matches) {
      setFetcherError(key, routeId, getInternalRouterError(404, {
        pathname: href
      }));
      return;
    }
    let {
      path,
      submission
    } = normalizeNavigateOptions(href, opts, true);
    let match = getTargetMatch(matches, path);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      handleFetcherAction(key, routeId, path, match, matches, submission);
      return;
    }
    fetchLoadMatches.set(key, {
      routeId,
      path,
      match,
      matches
    });
    handleFetcherLoader(key, routeId, path, match, matches, submission);
  }
  async function handleFetcherAction(key, routeId, path, match, requestMatches, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    if (!match.route.action) {
      let error = getInternalRouterError(405, {
        method: submission.formMethod,
        pathname: path,
        routeId
      });
      setFetcherError(key, routeId, error);
      return;
    }
    let existingFetcher = state2.fetchers.get(key);
    let fetcher = _extends$2({
      state: "submitting"
    }, submission, {
      data: existingFetcher && existingFetcher.data,
      " _hasFetcherDoneAnything ": true
    });
    state2.fetchers.set(key, fetcher);
    updateState({
      fetchers: new Map(state2.fetchers)
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    fetchControllers.set(key, abortController);
    let actionResult = await callLoaderOrAction("action", fetchRequest, match, requestMatches, router2.basename);
    if (fetchRequest.signal.aborted) {
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    if (isRedirectResult(actionResult)) {
      fetchControllers.delete(key);
      fetchRedirectIds.add(key);
      let loadingFetcher = _extends$2({
        state: "loading"
      }, submission, {
        data: void 0,
        " _hasFetcherDoneAnything ": true
      });
      state2.fetchers.set(key, loadingFetcher);
      updateState({
        fetchers: new Map(state2.fetchers)
      });
      return startRedirectNavigation(state2, actionResult, {
        isFetchActionRedirect: true
      });
    }
    if (isErrorResult(actionResult)) {
      setFetcherError(key, routeId, actionResult.error);
      return;
    }
    if (isDeferredResult(actionResult)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    let nextLocation = state2.navigation.location || state2.location;
    let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
    let matches = state2.navigation.state !== "idle" ? matchRoutes(dataRoutes, state2.navigation.location, init.basename) : state2.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = _extends$2({
      state: "loading",
      data: actionResult.data
    }, submission, {
      " _hasFetcherDoneAnything ": true
    });
    state2.fetchers.set(key, loadFetcher);
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(
      init.history,
      state2,
      matches,
      submission,
      nextLocation,
      isRevalidationRequired,
      cancelledDeferredRoutes,
      cancelledFetcherLoads,
      {
        [match.route.id]: actionResult.data
      },
      void 0,
      // No need to send through errors since we short circuit above
      fetchLoadMatches
    );
    revalidatingFetchers.filter((rf2) => rf2.key !== key).forEach((rf2) => {
      let staleKey = rf2.key;
      let existingFetcher2 = state2.fetchers.get(staleKey);
      let revalidatingFetcher = {
        state: "loading",
        data: existingFetcher2 && existingFetcher2.data,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        " _hasFetcherDoneAnything ": true
      };
      state2.fetchers.set(staleKey, revalidatingFetcher);
      fetchControllers.set(staleKey, abortController);
    });
    updateState({
      fetchers: new Map(state2.fetchers)
    });
    let {
      results,
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state2.matches, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach((r2) => fetchControllers.delete(r2.key));
    let redirect = findRedirect(results);
    if (redirect) {
      return startRedirectNavigation(state2, redirect);
    }
    let {
      loaderData,
      errors
    } = processLoaderData(state2, state2.matches, matchesToLoad, loaderResults, void 0, revalidatingFetchers, fetcherResults, activeDeferreds);
    let doneFetcher = {
      state: "idle",
      data: actionResult.data,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      " _hasFetcherDoneAnything ": true
    };
    state2.fetchers.set(key, doneFetcher);
    let didAbortFetchLoads = abortStaleFetchLoads(loadId);
    if (state2.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state2.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state2.fetchers)
      });
    } else {
      updateState(_extends$2({
        errors,
        loaderData: mergeLoaderData(state2.loaderData, loaderData, matches, errors)
      }, didAbortFetchLoads ? {
        fetchers: new Map(state2.fetchers)
      } : {}));
      isRevalidationRequired = false;
    }
  }
  async function handleFetcherLoader(key, routeId, path, match, matches, submission) {
    let existingFetcher = state2.fetchers.get(key);
    let loadingFetcher = _extends$2({
      state: "loading",
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0
    }, submission, {
      data: existingFetcher && existingFetcher.data,
      " _hasFetcherDoneAnything ": true
    });
    state2.fetchers.set(key, loadingFetcher);
    updateState({
      fetchers: new Map(state2.fetchers)
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    fetchControllers.set(key, abortController);
    let result = await callLoaderOrAction("loader", fetchRequest, match, matches, router2.basename);
    if (isDeferredResult(result)) {
      result = await resolveDeferredData(result, fetchRequest.signal, true) || result;
    }
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    if (isRedirectResult(result)) {
      await startRedirectNavigation(state2, result);
      return;
    }
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state2.matches, routeId);
      state2.fetchers.delete(key);
      updateState({
        fetchers: new Map(state2.fetchers),
        errors: {
          [boundaryMatch.route.id]: result.error
        }
      });
      return;
    }
    invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
    let doneFetcher = {
      state: "idle",
      data: result.data,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      " _hasFetcherDoneAnything ": true
    };
    state2.fetchers.set(key, doneFetcher);
    updateState({
      fetchers: new Map(state2.fetchers)
    });
  }
  async function startRedirectNavigation(state3, redirect, _temp) {
    var _window;
    let {
      submission,
      replace,
      isFetchActionRedirect
    } = _temp === void 0 ? {} : _temp;
    if (redirect.revalidate) {
      isRevalidationRequired = true;
    }
    let redirectLocation = createLocation(
      state3.location,
      redirect.location,
      // TODO: This can be removed once we get rid of useTransition in Remix v2
      _extends$2({
        _isRedirect: true
      }, isFetchActionRedirect ? {
        _isFetchActionRedirect: true
      } : {})
    );
    invariant(redirectLocation, "Expected a location on the redirect navigation");
    if (ABSOLUTE_URL_REGEX.test(redirect.location) && isBrowser$1 && typeof ((_window = window) == null ? void 0 : _window.location) !== "undefined") {
      let newOrigin = init.history.createURL(redirect.location).origin;
      if (window.location.origin !== newOrigin) {
        if (replace) {
          window.location.replace(redirect.location);
        } else {
          window.location.assign(redirect.location);
        }
        return;
      }
    }
    pendingNavigationController = null;
    let redirectHistoryAction = replace === true ? Action.Replace : Action.Push;
    let {
      formMethod,
      formAction,
      formEncType,
      formData
    } = state3.navigation;
    if (!submission && formMethod && formAction && formData && formEncType) {
      submission = {
        formMethod,
        formAction,
        formEncType,
        formData
      };
    }
    if (redirectPreserveMethodStatusCodes.has(redirect.status) && submission && isMutationMethod(submission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends$2({}, submission, {
          formAction: redirect.location
        }),
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    } else {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation: {
          state: "loading",
          location: redirectLocation,
          formMethod: submission ? submission.formMethod : void 0,
          formAction: submission ? submission.formAction : void 0,
          formEncType: submission ? submission.formEncType : void 0,
          formData: submission ? submission.formData : void 0
        },
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    }
  }
  async function callLoadersAndMaybeResolveData(currentMatches, matches, matchesToLoad, fetchersToLoad, request) {
    let results = await Promise.all([...matchesToLoad.map((match) => callLoaderOrAction("loader", request, match, matches, router2.basename)), ...fetchersToLoad.map((f2) => callLoaderOrAction("loader", createClientSideRequest(init.history, f2.path, request.signal), f2.match, f2.matches, router2.basename))]);
    let loaderResults = results.slice(0, matchesToLoad.length);
    let fetcherResults = results.slice(matchesToLoad.length);
    await Promise.all([resolveDeferredResults(currentMatches, matchesToLoad, loaderResults, request.signal, false, state2.loaderData), resolveDeferredResults(currentMatches, fetchersToLoad.map((f2) => f2.match), fetcherResults, request.signal, true)]);
    return {
      results,
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    isRevalidationRequired = true;
    cancelledDeferredRoutes.push(...cancelActiveDeferreds());
    fetchLoadMatches.forEach((_2, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.push(key);
        abortFetcher(key);
      }
    });
  }
  function setFetcherError(key, routeId, error) {
    let boundaryMatch = findNearestBoundary(state2.matches, routeId);
    deleteFetcher(key);
    updateState({
      errors: {
        [boundaryMatch.route.id]: error
      },
      fetchers: new Map(state2.fetchers)
    });
  }
  function deleteFetcher(key) {
    if (fetchControllers.has(key))
      abortFetcher(key);
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    state2.fetchers.delete(key);
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant(controller, "Expected fetch controller: " + key);
    controller.abort();
    fetchControllers.delete(key);
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = {
        state: "idle",
        data: fetcher.data,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        " _hasFetcherDoneAnything ": true
      };
      state2.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    for (let key of fetchRedirectIds) {
      let fetcher = state2.fetchers.get(key);
      invariant(fetcher, "Expected fetcher: " + key);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
      }
    }
    markFetchersDone(doneKeys);
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id2] of fetchReloadIds) {
      if (id2 < landedId) {
        let fetcher = state2.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn2) {
    let blocker = state2.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn2) {
      blockerFunctions.set(key, fn2);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state2.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  function updateBlocker(key, newBlocker) {
    let blocker = state2.blockers.get(key) || IDLE_BLOCKER;
    invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
    state2.blockers.set(key, newBlocker);
    updateState({
      blockers: new Map(state2.blockers)
    });
  }
  function shouldBlockNavigation(_ref2) {
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = _ref2;
    if (blockerFunctions.size === 0) {
      return;
    }
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state2.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      return;
    }
    if (blockerFunction({
      currentLocation,
      nextLocation,
      historyAction
    })) {
      return blockerKey;
    }
  }
  function cancelActiveDeferreds(predicate) {
    let cancelledRouteIds = [];
    activeDeferreds.forEach((dfd, routeId) => {
      if (!predicate || predicate(routeId)) {
        dfd.cancel();
        cancelledRouteIds.push(routeId);
        activeDeferreds.delete(routeId);
      }
    });
    return cancelledRouteIds;
  }
  function enableScrollRestoration(positions2, getPosition, getKey) {
    savedScrollPositions = positions2;
    getScrollPosition = getPosition;
    getScrollRestorationKey = getKey || ((location) => location.key);
    if (!initialScrollRestored && state2.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y2 = getSavedScrollPosition(state2.location, state2.matches);
      if (y2 != null) {
        updateState({
          restoreScrollPosition: y2
        });
      }
    }
    return () => {
      savedScrollPositions = null;
      getScrollPosition = null;
      getScrollRestorationKey = null;
    };
  }
  function saveScrollPosition(location, matches) {
    if (savedScrollPositions && getScrollRestorationKey && getScrollPosition) {
      let userMatches = matches.map((m2) => createUseMatchesMatch(m2, state2.loaderData));
      let key = getScrollRestorationKey(location, userMatches) || location.key;
      savedScrollPositions[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location, matches) {
    if (savedScrollPositions && getScrollRestorationKey && getScrollPosition) {
      let userMatches = matches.map((m2) => createUseMatchesMatch(m2, state2.loaderData));
      let key = getScrollRestorationKey(location, userMatches) || location.key;
      let y2 = savedScrollPositions[key];
      if (typeof y2 === "number") {
        return y2;
      }
    }
    return null;
  }
  router2 = {
    get basename() {
      return init.basename;
    },
    get state() {
      return state2;
    },
    get routes() {
      return dataRoutes;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch: fetch2,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (to2) => init.history.createHref(to2),
    encodeLocation: (to2) => init.history.encodeLocation(to2),
    getFetcher,
    deleteFetcher,
    dispose,
    getBlocker,
    deleteBlocker,
    _internalFetchControllers: fetchControllers,
    _internalActiveDeferreds: activeDeferreds
  };
  return router2;
}
function isSubmissionNavigation(opts) {
  return opts != null && "formData" in opts;
}
function normalizeNavigateOptions(to2, opts, isFetcher) {
  if (isFetcher === void 0) {
    isFetcher = false;
  }
  let path = typeof to2 === "string" ? to2 : createPath(to2);
  if (!opts || !isSubmissionNavigation(opts)) {
    return {
      path
    };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, {
        method: opts.formMethod
      })
    };
  }
  let submission;
  if (opts.formData) {
    submission = {
      formMethod: opts.formMethod || "get",
      formAction: stripHashFromPath(path),
      formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
      formData: opts.formData
    };
    if (isMutationMethod(submission.formMethod)) {
      return {
        path,
        submission
      };
    }
  }
  let parsedPath = parsePath(path);
  let searchParams = convertFormDataToSearchParams(opts.formData);
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = "?" + searchParams;
  return {
    path: createPath(parsedPath),
    submission
  };
}
function getLoaderMatchesUntilBoundary(matches, boundaryId) {
  let boundaryMatches = matches;
  if (boundaryId) {
    let index2 = matches.findIndex((m2) => m2.route.id === boundaryId);
    if (index2 >= 0) {
      boundaryMatches = matches.slice(0, index2);
    }
  }
  return boundaryMatches;
}
function getMatchesToLoad(history, state2, matches, submission, location, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, pendingActionData, pendingError, fetchLoadMatches) {
  let actionResult = pendingError ? Object.values(pendingError)[0] : pendingActionData ? Object.values(pendingActionData)[0] : void 0;
  let currentUrl = history.createURL(state2.location);
  let nextUrl = history.createURL(location);
  let defaultShouldRevalidate = (
    // Forced revalidation due to submission, useRevalidate, or X-Remix-Revalidate
    isRevalidationRequired || // Clicked the same link, resubmitted a GET form
    currentUrl.toString() === nextUrl.toString() || // Search params affect all loaders
    currentUrl.search !== nextUrl.search
  );
  let boundaryId = pendingError ? Object.keys(pendingError)[0] : void 0;
  let boundaryMatches = getLoaderMatchesUntilBoundary(matches, boundaryId);
  let navigationMatches = boundaryMatches.filter((match, index2) => {
    if (match.route.loader == null) {
      return false;
    }
    if (isNewLoader(state2.loaderData, state2.matches[index2], match) || cancelledDeferredRoutes.some((id2) => id2 === match.route.id)) {
      return true;
    }
    let currentRouteMatch = state2.matches[index2];
    let nextRouteMatch = match;
    return shouldRevalidateLoader(match, _extends$2({
      currentUrl,
      currentParams: currentRouteMatch.params,
      nextUrl,
      nextParams: nextRouteMatch.params
    }, submission, {
      actionResult,
      defaultShouldRevalidate: defaultShouldRevalidate || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
    }));
  });
  let revalidatingFetchers = [];
  fetchLoadMatches && fetchLoadMatches.forEach((f2, key) => {
    if (!matches.some((m2) => m2.route.id === f2.routeId)) {
      return;
    } else if (cancelledFetcherLoads.includes(key)) {
      revalidatingFetchers.push(_extends$2({
        key
      }, f2));
    } else {
      let shouldRevalidate = shouldRevalidateLoader(f2.match, _extends$2({
        currentUrl,
        currentParams: state2.matches[state2.matches.length - 1].params,
        nextUrl,
        nextParams: matches[matches.length - 1].params
      }, submission, {
        actionResult,
        defaultShouldRevalidate
      }));
      if (shouldRevalidate) {
        revalidatingFetchers.push(_extends$2({
          key
        }, f2));
      }
    }
  });
  return [navigationMatches, revalidatingFetchers];
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew = (
    // [a] -> [a, b]
    !currentMatch || // [a, b] -> [a, c]
    match.route.id !== currentMatch.route.id
  );
  let isMissingData = currentLoaderData[match.route.id] === void 0;
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
async function callLoaderOrAction(type, request, match, matches, basename, isStaticRequest, isRouteRequest, requestContext) {
  if (basename === void 0) {
    basename = "/";
  }
  if (isStaticRequest === void 0) {
    isStaticRequest = false;
  }
  if (isRouteRequest === void 0) {
    isRouteRequest = false;
  }
  let resultType;
  let result;
  let reject;
  let abortPromise = new Promise((_2, r2) => reject = r2);
  let onReject = () => reject();
  request.signal.addEventListener("abort", onReject);
  try {
    let handler = match.route[type];
    invariant(handler, "Could not find the " + type + ' to run on the "' + match.route.id + '" route');
    result = await Promise.race([handler({
      request,
      params: match.params,
      context: requestContext
    }), abortPromise]);
    invariant(result !== void 0, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ('"' + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
  } catch (e2) {
    resultType = ResultType.error;
    result = e2;
  } finally {
    request.signal.removeEventListener("abort", onReject);
  }
  if (isResponse(result)) {
    let status = result.status;
    if (redirectStatusCodes.has(status)) {
      let location = result.headers.get("Location");
      invariant(location, "Redirects returned/thrown from loaders/actions must have a Location header");
      if (!ABSOLUTE_URL_REGEX.test(location)) {
        let activeMatches = matches.slice(0, matches.indexOf(match) + 1);
        let routePathnames = getPathContributingMatches(activeMatches).map((match2) => match2.pathnameBase);
        let resolvedLocation = resolveTo(location, routePathnames, new URL(request.url).pathname);
        invariant(createPath(resolvedLocation), "Unable to resolve redirect location: " + location);
        if (basename) {
          let path = resolvedLocation.pathname;
          resolvedLocation.pathname = path === "/" ? basename : joinPaths([basename, path]);
        }
        location = createPath(resolvedLocation);
      } else if (!isStaticRequest) {
        let currentUrl = new URL(request.url);
        let url = location.startsWith("//") ? new URL(currentUrl.protocol + location) : new URL(location);
        if (url.origin === currentUrl.origin) {
          location = url.pathname + url.search + url.hash;
        }
      }
      if (isStaticRequest) {
        result.headers.set("Location", location);
        throw result;
      }
      return {
        type: ResultType.redirect,
        status,
        location,
        revalidate: result.headers.get("X-Remix-Revalidate") !== null
      };
    }
    if (isRouteRequest) {
      throw {
        type: resultType || ResultType.data,
        response: result
      };
    }
    let data;
    let contentType = result.headers.get("Content-Type");
    if (contentType && /\bapplication\/json\b/.test(contentType)) {
      data = await result.json();
    } else {
      data = await result.text();
    }
    if (resultType === ResultType.error) {
      return {
        type: resultType,
        error: new ErrorResponse(status, result.statusText, data),
        headers: result.headers
      };
    }
    return {
      type: ResultType.data,
      data,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (resultType === ResultType.error) {
    return {
      type: resultType,
      error: result
    };
  }
  if (result instanceof DeferredData) {
    return {
      type: ResultType.deferred,
      deferredData: result
    };
  }
  return {
    type: ResultType.data,
    data: result
  };
}
function createClientSideRequest(history, location, signal, submission) {
  let url = history.createURL(stripHashFromPath(location)).toString();
  let init = {
    signal
  };
  if (submission && isMutationMethod(submission.formMethod)) {
    let {
      formMethod,
      formEncType,
      formData
    } = submission;
    init.method = formMethod.toUpperCase();
    init.body = formEncType === "application/x-www-form-urlencoded" ? convertFormDataToSearchParams(formData) : formData;
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value2] of formData.entries()) {
    searchParams.append(key, value2 instanceof File ? value2.name : value2);
  }
  return searchParams;
}
function processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds) {
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  results.forEach((result, index2) => {
    let id2 = matchesToLoad[index2].route.id;
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, id2);
      let error = result.error;
      if (pendingError) {
        error = Object.values(pendingError)[0];
        pendingError = void 0;
      }
      errors = errors || {};
      if (errors[boundaryMatch.route.id] == null) {
        errors[boundaryMatch.route.id] = error;
      }
      loaderData[id2] = void 0;
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id2] = result.headers;
      }
    } else {
      if (isDeferredResult(result)) {
        activeDeferreds.set(id2, result.deferredData);
        loaderData[id2] = result.deferredData.data;
      } else {
        loaderData[id2] = result.data;
      }
      if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
        statusCode = result.statusCode;
      }
      if (result.headers) {
        loaderHeaders[id2] = result.headers;
      }
    }
  });
  if (pendingError) {
    errors = pendingError;
    loaderData[Object.keys(pendingError)[0]] = void 0;
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state2, matches, matchesToLoad, results, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors
  } = processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds);
  for (let index2 = 0; index2 < revalidatingFetchers.length; index2++) {
    let {
      key,
      match
    } = revalidatingFetchers[index2];
    invariant(fetcherResults !== void 0 && fetcherResults[index2] !== void 0, "Did not find corresponding fetcher result");
    let result = fetcherResults[index2];
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state2.matches, match.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = _extends$2({}, errors, {
          [boundaryMatch.route.id]: result.error
        });
      }
      state2.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else if (isDeferredResult(result)) {
      invariant(false, "Unhandled fetcher deferred data");
    } else {
      let doneFetcher = {
        state: "idle",
        data: result.data,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        " _hasFetcherDoneAnything ": true
      };
      state2.fetchers.set(key, doneFetcher);
    }
  }
  return {
    loaderData,
    errors
  };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = _extends$2({}, newLoaderData);
  for (let match of matches) {
    let id2 = match.route.id;
    if (newLoaderData.hasOwnProperty(id2)) {
      if (newLoaderData[id2] !== void 0) {
        mergedLoaderData[id2] = newLoaderData[id2];
      }
    } else if (loaderData[id2] !== void 0) {
      mergedLoaderData[id2] = loaderData[id2];
    }
    if (errors && errors.hasOwnProperty(id2)) {
      break;
    }
  }
  return mergedLoaderData;
}
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex((m2) => m2.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find((m2) => m2.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
  let route = routes.find((r2) => r2.index || !r2.path || r2.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route
    }],
    route
  };
}
function getInternalRouterError(status, _temp4) {
  let {
    pathname,
    routeId,
    method,
    type
  } = _temp4 === void 0 ? {} : _temp4;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method + ' request to "' + pathname + '" but ' + ('did not provide a `loader` for route "' + routeId + '", ') + "so there is no way to handle the request.";
    } else if (type === "defer-action") {
      errorMessage = "defer() is not supported in actions";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = 'Route "' + routeId + '" does not match URL "' + pathname + '"';
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = 'No route matches URL "' + pathname + '"';
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method.toUpperCase() + ' request to "' + pathname + '" but ' + ('did not provide an `action` for route "' + routeId + '", ') + "so there is no way to handle the request.";
    } else if (method) {
      errorMessage = 'Invalid request method "' + method.toUpperCase() + '"';
    }
  }
  return new ErrorResponse(status || 500, statusText, new Error(errorMessage), true);
}
function findRedirect(results) {
  for (let i2 = results.length - 1; i2 >= 0; i2--) {
    let result = results[i2];
    if (isRedirectResult(result)) {
      return result;
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath(_extends$2({}, parsedPath, {
    hash: ""
  }));
}
function isHashChangeOnly(a2, b2) {
  return a2.pathname === b2.pathname && a2.search === b2.search && a2.hash !== b2.hash;
}
function isDeferredResult(result) {
  return result.type === ResultType.deferred;
}
function isErrorResult(result) {
  return result.type === ResultType.error;
}
function isRedirectResult(result) {
  return (result && result.type) === ResultType.redirect;
}
function isResponse(value2) {
  return value2 != null && typeof value2.status === "number" && typeof value2.statusText === "string" && typeof value2.headers === "object" && typeof value2.body !== "undefined";
}
function isValidMethod(method) {
  return validRequestMethods.has(method);
}
function isMutationMethod(method) {
  return validMutationMethods.has(method);
}
async function resolveDeferredResults(currentMatches, matchesToLoad, results, signal, isFetcher, currentLoaderData) {
  for (let index2 = 0; index2 < results.length; index2++) {
    let result = results[index2];
    let match = matchesToLoad[index2];
    let currentMatch = currentMatches.find((m2) => m2.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== void 0;
    if (isDeferredResult(result) && (isFetcher || isRevalidatingLoader)) {
      await resolveDeferredData(result, signal, isFetcher).then((result2) => {
        if (result2) {
          results[index2] = result2 || results[index2];
        }
      });
    }
  }
}
async function resolveDeferredData(result, signal, unwrap) {
  if (unwrap === void 0) {
    unwrap = false;
  }
  let aborted = await result.deferredData.resolveData(signal);
  if (aborted) {
    return;
  }
  if (unwrap) {
    try {
      return {
        type: ResultType.data,
        data: result.deferredData.unwrappedData
      };
    } catch (e2) {
      return {
        type: ResultType.error,
        error: e2
      };
    }
  }
  return {
    type: ResultType.data,
    data: result.deferredData.data
  };
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some((v2) => v2 === "");
}
function createUseMatchesMatch(match, loaderData) {
  let {
    route,
    pathname,
    params
  } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    handle: route.handle
  };
}
function getTargetMatch(matches, location) {
  let search = typeof location === "string" ? parsePath(location).search : location.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    return matches[matches.length - 1];
  }
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
/**
 * React Router v6.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target2[key] = source[key];
        }
      }
    }
    return target2;
  };
  return _extends$1.apply(this, arguments);
}
function isPolyfill(x2, y2) {
  return x2 === y2 && (x2 !== 0 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
const is = typeof Object.is === "function" ? Object.is : isPolyfill;
const {
  useState,
  useEffect,
  useLayoutEffect,
  useDebugValue
} = React$1;
function useSyncExternalStore$2(subscribe, getSnapshot, getServerSnapshot) {
  const value2 = getSnapshot();
  const [{
    inst
  }, forceUpdate] = useState({
    inst: {
      value: value2,
      getSnapshot
    }
  });
  useLayoutEffect(() => {
    inst.value = value2;
    inst.getSnapshot = getSnapshot;
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({
        inst
      });
    }
  }, [subscribe, value2, getSnapshot]);
  useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({
        inst
      });
    }
    const handleStoreChange = () => {
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({
          inst
        });
      }
    };
    return subscribe(handleStoreChange);
  }, [subscribe]);
  useDebugValue(value2);
  return value2;
}
function checkIfSnapshotChanged(inst) {
  const latestGetSnapshot = inst.getSnapshot;
  const prevValue = inst.value;
  try {
    const nextValue = latestGetSnapshot();
    return !is(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
  return getSnapshot();
}
const canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
const isServerEnvironment = !canUseDOM;
const shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore$2;
const useSyncExternalStore = "useSyncExternalStore" in React$1 ? ((module) => module.useSyncExternalStore)(React$1) : shim;
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: []
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to2, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to2, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useNavigate() {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getPathContributingMatches(matches).map((match) => match.pathnameBase));
  let activeRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to2, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current)
      return;
    if (typeof to2 === "number") {
      navigator2.go(to2);
      return;
    }
    let path = resolveTo(to2, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
  }, [basename, navigator2, routePathnamesJson, locationPathname]);
  return navigate;
}
const OutletContext = /* @__PURE__ */ reactExports.createContext(null);
function useOutlet(context) {
  let outlet = reactExports.useContext(RouteContext).outlet;
  if (outlet) {
    return /* @__PURE__ */ reactExports.createElement(OutletContext.Provider, {
      value: context
    }, outlet);
  }
  return outlet;
}
function useResolvedPath(to2, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getPathContributingMatches(matches).map((match) => match.pathnameBase));
  return reactExports.useMemo(() => resolveTo(to2, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to2, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let dataRouterStateContext = reactExports.useContext(DataRouterStateContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/";
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterStateContext || void 0);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorElement() {
  let error = useRouteError();
  let message2 = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message2), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state2) {
    if (state2.location !== props.location) {
      return {
        error: props.error,
        location: props.location
      };
    }
    return {
      error: props.error || state2.error,
      location: state2.location
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && match.route.errorElement) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState) {
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (matches == null) {
    if (dataRouterState != null && dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState == null ? void 0 : dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]));
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  return renderedMatches.reduceRight((outlet, match, index2) => {
    let error = match.route.id ? errors == null ? void 0 : errors[match.route.id] : null;
    let errorElement = dataRouterState ? match.route.errorElement || /* @__PURE__ */ reactExports.createElement(DefaultErrorElement, null) : null;
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index2 + 1));
    let getChildren = () => /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
      match,
      routeContext: {
        outlet,
        matches: matches2
      }
    }, error ? errorElement : match.route.element !== void 0 ? match.route.element : outlet);
    return dataRouterState && (match.route.errorElement || index2 === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1;
(function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
})(DataRouterHook$1 || (DataRouterHook$1 = {}));
var DataRouterStateHook$1;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
})(DataRouterStateHook$1 || (DataRouterStateHook$1 = {}));
function useDataRouterState(hookName) {
  let state2 = reactExports.useContext(DataRouterStateContext);
  !state2 ? invariant(false) : void 0;
  return state2;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state2 = useDataRouterState(DataRouterStateHook$1.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);
  if (error) {
    return error;
  }
  return (_state$errors = state2.errors) == null ? void 0 : _state$errors[routeId];
}
function RouterProvider(_ref) {
  let {
    fallbackElement,
    router: router2
  } = _ref;
  let state2 = useSyncExternalStore(
    router2.subscribe,
    () => router2.state,
    // We have to provide this so React@18 doesn't complain during hydration,
    // but we pass our serialized hydration data into the router so state here
    // is already synced with what the server saw
    () => router2.state
  );
  let navigator2 = reactExports.useMemo(() => {
    return {
      createHref: router2.createHref,
      encodeLocation: router2.encodeLocation,
      go: (n2) => router2.navigate(n2),
      push: (to2, state3, opts) => router2.navigate(to2, {
        state: state3,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      }),
      replace: (to2, state3, opts) => router2.navigate(to2, {
        replace: true,
        state: state3,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      })
    };
  }, [router2]);
  let basename = router2.basename || "/";
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(DataRouterContext.Provider, {
    value: {
      router: router2,
      navigator: navigator2,
      static: false,
      // Do we need this?
      basename
    }
  }, /* @__PURE__ */ reactExports.createElement(DataRouterStateContext.Provider, {
    value: state2
  }, /* @__PURE__ */ reactExports.createElement(Router, {
    basename: router2.basename,
    location: router2.state.location,
    navigationType: router2.state.historyAction,
    navigator: navigator2
  }, router2.state.initialized ? /* @__PURE__ */ reactExports.createElement(Routes, null) : fallbackElement))), null);
}
function Navigate(_ref3) {
  let {
    to: to2,
    replace,
    state: state2,
    relative
  } = _ref3;
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterState = reactExports.useContext(DataRouterStateContext);
  let navigate = useNavigate();
  reactExports.useEffect(() => {
    if (dataRouterState && dataRouterState.navigation.state !== "idle") {
      return;
    }
    navigate(to2, {
      replace,
      state: state2,
      relative
    });
  });
  return null;
}
function Outlet(props) {
  return useOutlet(props.context);
}
function Route(_props) {
  invariant(false);
}
function Router(_ref4) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false
  } = _ref4;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp
  }), [basename, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state: state2 = null,
    key = "default"
  } = locationProp;
  let location = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      pathname: trailingPathname,
      search,
      hash,
      state: state2,
      key
    };
  }, [basename, pathname, search, hash, state2, key]);
  if (location == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: {
      location,
      navigationType
    }
  }));
}
function Routes(_ref5) {
  let {
    children,
    location
  } = _ref5;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let routes = dataRouterContext && !children ? dataRouterContext.router.routes : createRoutesFromChildren(children);
  return useRoutes(routes, location);
}
var AwaitRenderStatus;
(function(AwaitRenderStatus2) {
  AwaitRenderStatus2[AwaitRenderStatus2["pending"] = 0] = "pending";
  AwaitRenderStatus2[AwaitRenderStatus2["success"] = 1] = "success";
  AwaitRenderStatus2[AwaitRenderStatus2["error"] = 2] = "error";
})(AwaitRenderStatus || (AwaitRenderStatus = {}));
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index2) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, parentPath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let treePath = [...parentPath, index2];
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      hasErrorBoundary: element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
function enhanceManualRouteObjects(routes) {
  return routes.map((route) => {
    let routeClone = _extends$1({}, route);
    if (routeClone.hasErrorBoundary == null) {
      routeClone.hasErrorBoundary = routeClone.errorElement != null;
    }
    if (routeClone.children) {
      routeClone.children = enhanceManualRouteObjects(routeClone.children);
    }
    return routeClone;
  });
}
/**
 * React Router DOM v6.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target2[key] = source[key];
        }
      }
    }
    return target2;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target2 = {};
  var sourceKeys = Object.keys(source);
  var key, i2;
  for (i2 = 0; i2 < sourceKeys.length; i2++) {
    key = sourceKeys[i2];
    if (excluded.indexOf(key) >= 0)
      continue;
    target2[key] = source[key];
  }
  return target2;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target2) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target2 || target2 === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "children"];
function createBrowserRouter(routes, opts) {
  return createRouter({
    basename: opts == null ? void 0 : opts.basename,
    history: createBrowserHistory({
      window: opts == null ? void 0 : opts.window
    }),
    hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
    routes: enhanceManualRouteObjects(routes)
  }).initialize();
}
function parseHydrationData() {
  var _window;
  let state2 = (_window = window) == null ? void 0 : _window.__staticRouterHydrationData;
  if (state2 && state2.errors) {
    state2 = _extends({}, state2, {
      errors: deserializeErrors(state2.errors)
    });
  }
  return state2;
}
function deserializeErrors(errors) {
  if (!errors)
    return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new ErrorResponse(val.status, val.statusText, val.data, val.internal === true);
    } else if (val && val.__type === "Error") {
      let error = new Error(val.message);
      error.stack = "";
      serialized[key] = error;
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref4, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace,
    state: state2,
    target: target2,
    to: to2,
    preventScrollReset
  } = _ref4, rest = _objectWithoutPropertiesLoose(_ref4, _excluded);
  let absoluteHref;
  let isExternal = false;
  if (isBrowser && typeof to2 === "string" && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(to2)) {
    absoluteHref = to2;
    let currentUrl = new URL(window.location.href);
    let targetUrl = to2.startsWith("//") ? new URL(currentUrl.protocol + to2) : new URL(to2);
    if (targetUrl.origin === currentUrl.origin) {
      to2 = targetUrl.pathname + targetUrl.search + targetUrl.hash;
    } else {
      isExternal = true;
    }
  }
  let href = useHref(to2, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to2, {
    replace,
    state: state2,
    target: target2,
    preventScrollReset,
    relative
  });
  function handleClick(event) {
    if (onClick)
      onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target: target2
    }))
  );
});
const NavLink = /* @__PURE__ */ reactExports.forwardRef(function NavLinkWithRef(_ref5, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to: to2,
    children
  } = _ref5, rest = _objectWithoutPropertiesLoose(_ref5, _excluded2);
  let path = useResolvedPath(to2, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = reactExports.useContext(DataRouterStateContext);
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp({
      isActive,
      isPending
    });
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null].filter(Boolean).join(" ");
  }
  let style2 = typeof styleProp === "function" ? styleProp({
    isActive,
    isPending
  }) : styleProp;
  return /* @__PURE__ */ reactExports.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style: style2,
    to: to2
  }), typeof children === "function" ? children({
    isActive,
    isPending
  }) : children);
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmitImpl"] = "useSubmitImpl";
  DataRouterHook2["UseFetcher"] = "useFetcher";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useLinkClickHandler(to2, _temp) {
  let {
    target: target2,
    replace: replaceProp,
    state: state2,
    preventScrollReset,
    relative
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to2, {
    relative
  });
  return reactExports.useCallback((event) => {
    if (shouldProcessLinkClick(event, target2)) {
      event.preventDefault();
      let replace = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to2, {
        replace,
        state: state2,
        preventScrollReset,
        relative
      });
    }
  }, [location, navigate, path, replaceProp, state2, target2, to2, preventScrollReset, relative]);
}
const global$1 = "";
const scrollbars = "";
const appWrapper = "_appWrapper_12372_1";
const styles$Z = {
  appWrapper
};
const sidebarWrapper = "_sidebarWrapper_z3h32_1";
const logo = "_logo_z3h32_13";
const separator = "_separator_z3h32_18";
const items = "_items_z3h32_25";
const styles$Y = {
  sidebarWrapper,
  logo,
  separator,
  items
};
const iconWrapper = "_iconWrapper_1z0v8_1";
const link$1 = "_link_1z0v8_5";
const active$2 = "_active_1z0v8_9";
const styles$X = {
  iconWrapper,
  link: link$1,
  active: active$2
};
const SidebarItem = ({ item, isActive }) => {
  return /* @__PURE__ */ jsx(
    NavLink,
    {
      to: item.path,
      className: `${styles$X.link} ${isActive ? styles$X.active : ""}`,
      children: /* @__PURE__ */ jsxs("div", { className: styles$X.iconWrapper, children: [
        " ",
        item.icon
      ] })
    }
  );
};
const SvgTeamLogo = (props) => /* @__PURE__ */ reactExports.createElement("svg", { id: "Logo_Hyperloop_UPV", "data-name": "Logo Hyperloop UPV", viewBox: "0 0 213.89314 276.15957", "sodipodi:docname": "Logo Hyperloop UPV-16.svg", "inkscape:export-filename": "teamLogo.svg", "inkscape:export-xdpi": 96, "inkscape:export-ydpi": 96, width: "1em", height: "1em", fill: "currentColor", "xmlns:inkscape": "http://www.inkscape.org/namespaces/inkscape", "xmlns:sodipodi": "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd", xmlns: "http://www.w3.org/2000/svg", "xmlns:svg": "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("sodipodi:namedview", { id: "namedview22", pagecolor: "#505050", bordercolor: "#eeeeee", borderopacity: 1, "inkscape:showpageshadow": 0, "inkscape:pageopacity": 0, "inkscape:pagecheckerboard": 0, "inkscape:deskcolor": "#505050", showgrid: "false" }), /* @__PURE__ */ reactExports.createElement("path", { d: "m 118.14315,86.73957 q 0,-15.08 0,-30.13 0,-10.59 0,-21.18 v -13.72 c 0,-2.57 0,-5.14 0,-7.71 0,-3.23 -0.06,-6.4499995 -1.41,-9.4399995 a 7.35,7.35 0 0 0 -10.23,-3.71000001 19.93,19.93 0 0 0 -4.48,3.53000001 C 95.563148,10.59957 89.423148,17.16957 83.133148,23.56957 c -2.05,2.1 -4.36,4 -4.93,7.2 l -0.44,79.86 h -27.38 c -9,0.67 -9.47,-7.61 -9.47,-7.61 v -13.66 c -0.8,-9.17 -8.22,-10.84 -8.22,-10.84 -5.13,-1.24 -7,1.45 -7,1.45 l -21.7499997,21.25 c -4.57,3.8 -3.91,10.85 -3.91,10.85 l 0.08,39 c -0.65,7.33 3.27,10.86 3.27,10.86 l 17.0499997,16.59 c 7,7.61 13.5,6.74 13.5,6.74 8.4,-0.5 7.7,-7.86 7.7,-7.86 v -16.55 c 0.44,-7.59 6.42,-8.79 8.7,-9 h 27.2 l -0.35,64 c 16.88,-16.89 22.820002,-22.87 40.950002,-41 0,-17.47 0,-30.07 0,-47.54 q 0.02,-20.31 0.01,-40.57 z", id: "path17", "inkscape:export-filename": "teamLogo.svg", "inkscape:export-xdpi": 96, "inkscape:export-ydpi": 96 }), /* @__PURE__ */ reactExports.createElement("path", { d: "m 211.05315,157.05957 c 0,0 6.39,-7.18 0,-13.59 0,0 -3.39,-3.45 -7.59,-3.25 h -29.4 a 10.58,10.58 0 0 0 -7.48,3.1 l -14.39,14.35 v 0 l -56.610002,56.6 v 0 l -14.55,14.58 a 10.58,10.58 0 0 0 -3.1,7.48 v 29.4 c -0.2,4.2 3.25,7.59 3.25,7.59 6.41,6.39 13.59,0 13.59,0 0,0 7.490002,-7.46 30.000002,-29.93 v 0 l 56.55,-56.54 v 0 c 22.32,-22.35 29.73,-29.79 29.73,-29.79 z", id: "path19" }));
const Sidebar = ({ items: items2 }) => {
  const location = useLocation();
  return /* @__PURE__ */ jsxs("nav", { className: styles$Y.sidebarWrapper, children: [
    /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(SvgTeamLogo, { className: styles$Y.logo }) }),
    /* @__PURE__ */ jsx("div", { className: styles$Y.separator }),
    /* @__PURE__ */ jsx("div", { className: styles$Y.items, children: items2.map((item) => {
      return /* @__PURE__ */ jsx(
        SidebarItem,
        {
          item,
          isActive: isInSubpath(item.path, location.pathname)
        },
        item.path
      );
    }) })
  ] });
};
function isInSubpath(itemPath, currentPath) {
  return "/" + currentPath.split("/")[1] == itemPath;
}
const SvgWheel = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "2em", height: "2em", viewBox: "0 0 25 25", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M12.5 19.9308C10.4486 19.9308 8.58992 19.0998 7.24601 17.754C5.90209 16.4101 5.06917 14.5514 5.06917 12.5C5.06917 10.4486 5.90022 8.58992 7.24601 7.246C8.58992 5.90209 10.4486 5.06916 12.5 5.06917C14.5514 5.06917 16.4101 5.90022 17.754 7.246C19.0979 8.58992 19.9308 10.4486 19.9308 12.5C19.9308 14.5514 19.0998 16.4101 17.754 17.754C16.4101 19.0979 14.5514 19.9308 12.5 19.9308ZM12.5 24C9.32365 24 6.44864 22.7122 4.36914 20.6309C2.28776 18.5495 0.999995 15.6745 0.999995 12.5C0.999996 9.32364 2.28776 6.44864 4.36914 4.36913C6.45052 2.28775 9.32552 0.999989 12.5 0.999989C15.6764 0.99999 18.5514 2.28775 20.6309 4.36913C22.7122 6.44864 24 9.32364 24 12.5C24 15.6763 22.7122 18.5513 20.6309 20.6309C18.5513 22.7122 15.6763 24 12.5 24ZM6.5048 18.4952C8.03963 20.03 10.1584 20.979 12.5 20.979C14.8416 20.979 16.9604 20.03 18.4952 18.4952C20.03 16.9604 20.979 14.8415 20.979 12.5C20.979 10.1584 20.03 8.03962 18.4952 6.50479C16.9604 4.96996 14.8416 4.02099 12.5 4.02099C10.1584 4.02099 8.03963 4.96996 6.5048 6.50479C4.96997 8.03962 4.02099 10.1584 4.02099 12.5C4.02099 14.8415 4.96997 16.9604 6.5048 18.4952ZM11.7494 13.3741C11.9403 13.565 12.2043 13.6829 12.5 13.6829C12.7939 13.6829 13.0596 13.565 13.2506 13.3741L13.2524 13.3722C13.4434 13.1813 13.5613 12.9174 13.5613 12.6217C13.5613 12.3278 13.4434 12.062 13.2524 11.8711L13.2506 11.8692C13.0596 11.6783 12.7957 11.5604 12.5 11.5604C12.2061 11.5604 11.9403 11.6783 11.7494 11.8692L11.7476 11.8711C11.5566 12.062 11.4387 12.3278 11.4387 12.6217C11.4406 12.9174 11.5585 13.1813 11.7494 13.3741ZM11.8224 14.4934C11.5473 14.3923 11.2983 14.2332 11.0943 14.0292C11.0251 13.96 10.9596 13.8851 10.9015 13.8046L10.8828 13.8102L6.9484 14.864C7.25349 15.5809 7.69336 16.2266 8.23616 16.7676C9.17765 17.7091 10.4298 18.3417 11.8243 18.4971L11.8243 14.5439C11.8206 14.5271 11.8206 14.5102 11.8224 14.4934ZM10.5159 12.4644C10.5422 12.1406 10.6451 11.8374 10.8098 11.5735C10.8005 11.5622 10.793 11.5491 10.7855 11.536L8.52628 7.9554C8.42521 8.04337 8.32788 8.13508 8.23242 8.23054C7.14119 9.32177 6.46549 10.8323 6.46549 12.4981C6.46549 12.8481 6.49544 13.1907 6.55346 13.5257L10.5159 12.4644ZM11.9141 10.72C12.0994 10.6619 12.296 10.632 12.5 10.632C12.6834 10.632 12.8612 10.6563 13.0316 10.7031L15.2365 7.11873C14.4148 6.69945 13.4845 6.46361 12.5 6.46361C11.478 6.46361 10.5159 6.71817 9.67179 7.16552L11.9141 10.72ZM14.1602 11.5267C14.3324 11.785 14.4447 12.0863 14.4784 12.4083L14.4803 12.4083L18.4278 13.6436C18.4989 13.273 18.5364 12.8912 18.5364 12.5C18.5364 10.8341 17.8607 9.32364 16.7694 8.23241C16.6515 8.11449 16.528 8.00032 16.3988 7.89176L14.1902 11.4836C14.179 11.4967 14.1696 11.5117 14.1602 11.5267ZM14.1322 13.7578C14.0648 13.8533 13.9899 13.945 13.9057 14.0273C13.7091 14.222 13.4733 14.3774 13.2113 14.4784C13.2131 14.499 13.215 14.5215 13.215 14.5421L13.215 18.4915C14.5964 18.3286 15.8354 17.6997 16.7676 16.7657C17.2823 16.251 17.7053 15.6427 18.0085 14.9688L14.1322 13.7578Z", fill: "currentColor" }));
const SvgCameras = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "2em", height: "2em", viewBox: "0 0 25 25", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M22.2266 16.1956L19.1177 14.1344V7.46458L22.2266 5.40338C23.7475 4.39921 25 5.01228 25 6.77751V14.832C25 16.5973 23.7475 17.2103 22.2266 16.1956Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.93103 22.5679H15.128C19.2135 22.5679 20.5883 21.2842 20.5883 17.4208V7.1267C20.5883 3.26335 19.2265 1.97964 15.128 1.97964H6.93103C2.83254 1.97964 1.4707 3.26335 1.4707 7.1267V17.4208C1.4707 20.0005 2.83254 22.5679 6.93103 22.5679ZM7.35306 10.8032C8.97742 10.8032 10.2942 9.48636 10.2942 7.862C10.2942 6.23763 8.97742 4.92082 7.35306 4.92082C5.72869 4.92082 4.41188 6.23763 4.41188 7.862C4.41188 9.48636 5.72869 10.8032 7.35306 10.8032Z", fill: "currentColor" }));
const { initPodData, updatePodData } = podDataSlice.actions;
const App = () => {
  const dispatch = useDispatch$1();
  const config2 = useConfig();
  const podDataDescriptionPromise = useFetchBack(
    true,
    config2.paths.podDataDescription
  );
  const WS_URL = `${config2.prodServer.ip}:${config2.prodServer.port}/${config2.paths.websocket}`;
  return /* @__PURE__ */ jsx("div", { className: styles$Z.appWrapper, children: /* @__PURE__ */ jsx(
    Loader,
    {
      promises: [
        createWsHandler(
          WS_URL,
          true,
          () => dispatch(setWebSocketConnection(true)),
          () => dispatch(setWebSocketConnection(false))
        ),
        podDataDescriptionPromise.then((adapter) => {
          dispatch(initPodData(adapter));
          dispatch(initMeasurements(adapter));
        })
      ],
      LoadingView: /* @__PURE__ */ jsx("div", { children: "Loading" }),
      FailureView: /* @__PURE__ */ jsx("div", { children: "Failure" }),
      children: ([handler]) => /* @__PURE__ */ jsxs(WsHandlerProvider, { handler, children: [
        /* @__PURE__ */ jsx(
          Sidebar,
          {
            items: [
              { path: "/vehicle", icon: /* @__PURE__ */ jsx(SvgWheel, {}) },
              // { path: "/tube", icon: <Tube /> },
              { path: "/cameras", icon: /* @__PURE__ */ jsx(SvgCameras, {}) }
            ]
          }
        ),
        /* @__PURE__ */ jsx(Outlet, {})
      ] })
    }
  ) });
};
const index = "";
const boardsPage = "_boardsPage_1b3x3_1";
const column$1 = "_column_1b3x3_14";
const gridColumn = "_gridColumn_1b3x3_22";
const styles$W = {
  boardsPage,
  column: column$1,
  gridColumn
};
function useMeasurements() {
  const dispatch = useDispatch$1();
  const [measurements, setMeasurements] = reactExports.useState(
    store.getState().measurements
  );
  useSubscribe("podData/update", (msg) => {
    dispatch(updateMeasurements(msg));
  });
  const callback = reactExports.useCallback(() => {
    setMeasurements(store.getState().measurements);
  }, []);
  useGlobalTicker(callback);
  return measurements;
}
const levitationSectionWrapper = "_levitationSectionWrapper_1d3mx_1";
const rotations = "_rotations_1d3mx_8";
const positions = "_positions_1d3mx_15";
const airgaps = "_airgaps_1d3mx_21";
const batteries$1 = "_batteries_1d3mx_29";
const coils = "_coils_1d3mx_33";
const styles$V = {
  levitationSectionWrapper,
  rotations,
  positions,
  airgaps,
  batteries: batteries$1,
  coils
};
const window$1 = "_window_atjh1_1";
const header$1 = "_header_atjh1_12";
const content$3 = "_content_atjh1_19";
const styles$U = {
  window: window$1,
  header: header$1,
  content: content$3
};
const Window = ({ title: title2, height, children }) => {
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: styles$U.window,
      style: {
        height: height == "fit" ? "fit-content" : height == "fill" ? "100%" : void 0
      },
      children: [
        /* @__PURE__ */ jsx("header", { className: styles$U.header, children: title2 }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: styles$U.content,
            style: {
              flexGrow: height == "fill" ? "1" : ""
            },
            children
          }
        )
      ]
    }
  );
};
const iconTagWrapper = "_iconTagWrapper_syh2w_1";
const styles$T = {
  iconTagWrapper
};
const valueDataWrapper = "_valueDataWrapper_11p6r_1";
const name$4 = "_name_11p6r_9";
const value$3 = "_value_11p6r_1";
const units$1 = "_units_11p6r_22";
const styles$S = {
  valueDataWrapper,
  name: name$4,
  value: value$3,
  units: units$1
};
function useTextUpdater(getText) {
  const ref = reactExports.useRef(null);
  const textNodeRef = reactExports.useRef();
  reactExports.useLayoutEffect(() => {
    var _a;
    const textNode = document.createTextNode("");
    textNodeRef.current = textNode;
    (_a = ref.current) == null ? void 0 : _a.appendChild(textNode);
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeChild(textNode);
    };
  }, []);
  useGlobalTicker(() => {
    const text2 = getText();
    if (textNodeRef.current) {
      textNodeRef.current.nodeValue = text2;
    }
  });
  return ref;
}
const ValueData = reactExports.memo(({ measurement }) => {
  const ref = useTextUpdater(() => {
    const storeMeas = store.getState().measurements.measurements[measurement.id];
    if (!storeMeas) {
      return "Default";
    }
    if (isNumericMeasurement(storeMeas)) {
      return storeMeas.value.average.toFixed(3);
    } else {
      return storeMeas.value.toString();
    }
  });
  const isNumeric = isNumericMeasurement(measurement);
  return /* @__PURE__ */ jsxs("div", { className: styles$S.valueDataWrapper, children: [
    /* @__PURE__ */ jsx("span", { className: styles$S.name, children: measurement.name }),
    isNumeric && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: styles$S.value,
          children: measurement.value.average.toFixed(3)
        }
      ),
      /* @__PURE__ */ jsx("span", { className: styles$S.units, children: measurement.units })
    ] }),
    !isNumeric && /* @__PURE__ */ jsx(
      "span",
      {
        ref,
        className: styles$S.value
      }
    )
  ] });
});
const IconTag = ({ icon: icon2, measurement }) => {
  return /* @__PURE__ */ jsxs("article", { className: styles$T.iconTagWrapper, children: [
    icon2,
    /* @__PURE__ */ jsx(ValueData, { measurement })
  ] });
};
const multipleTagsWrapper = "_multipleTagsWrapper_kdztp_1";
const styles$R = {
  multipleTagsWrapper
};
const separatorWrapper = "_separatorWrapper_689af_1";
const line = "_line_689af_8";
const styles$Q = {
  separatorWrapper,
  line
};
const Separator = () => {
  return /* @__PURE__ */ jsx("div", { className: styles$Q.separatorWrapper, children: /* @__PURE__ */ jsx("div", { className: styles$Q.line }) });
};
const MultipleTags = ({ tags: tags2, className = "" }) => {
  return /* @__PURE__ */ jsx("article", { className: `${styles$R.multipleTagsWrapper} ${className}`, children: tags2.map((tag, index2, arr) => {
    return /* @__PURE__ */ jsxs(React.Fragment, { children: [
      tag,
      index2 < arr.length - 1 && /* @__PURE__ */ jsx(Separator, {})
    ] }, index2);
  }) });
};
const SvgYawIcon = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "3em", height: "3em", viewBox: "0 0 36 36", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M24 32.4068C20.6829 35.8644 15.3171 35.8644 12 32.4068L14.4 31.7814M12 3.59322C15.3171 0.135593 20.6829 0.135593 24 3.59322L21.6 4.21863", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ reactExports.createElement("rect", { x: 29, y: 13.8247, width: 22.8626, height: 10.651, rx: 5.32552, transform: "rotate(135 29 13.8247)", fill: "currentColor" }));
const SvgPitchIcon = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "3em", height: "3em", viewBox: "0 0 36 36", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.78462 14.5897C7.08602 14.7154 7.2957 14.9944 7.33252 15.3189L7.55145 17.248C7.6075 17.7419 7.25256 18.1877 6.75868 18.2438C6.26981 18.2992 5.82804 17.952 5.76476 17.466C4.44298 19.4685 4.44845 22.1948 5.97202 24.2215C6.27069 24.6188 6.19073 25.1831 5.79341 25.4817C5.3961 25.7804 4.83189 25.7004 4.53321 25.3031C2.04883 21.9982 2.64402 17.2662 5.88098 14.7137C6.1374 14.5115 6.48322 14.464 6.78462 14.5897Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M13.1549 18.1947C13.4208 17.6 14.117 17.3341 14.7099 17.6009L16.8568 18.567C17.4497 18.8338 17.7147 19.5322 17.4488 20.1269L16.9672 21.2037C16.7013 21.7985 16.0051 22.0643 15.4122 21.7975L13.2653 20.8314C12.6724 20.5647 12.4074 19.8663 12.6733 19.2715L13.1549 18.1947Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M22.2636 22.2935C22.5295 21.6988 23.2257 21.4329 23.8186 21.6997L25.9655 22.6658C26.5584 22.9326 26.8234 23.631 26.5575 24.2257L26.076 25.3025C25.81 25.8973 25.1138 26.1631 24.5209 25.8963L22.374 24.9302C21.7811 24.6635 21.5161 23.9651 21.7821 23.3703L22.2636 22.2935Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M10.8838 12.3315C12.1541 9.49077 15.4796 8.2209 18.3114 9.4952L30.069 14.7859C32.9009 16.0602 34.1668 19.3962 32.8965 22.2369C31.6262 25.0777 28.3007 26.3476 25.4689 25.0733L13.7112 19.7825C10.8794 18.5082 9.61348 15.1723 10.8838 12.3315Z", fill: "currentColor" }));
const SvgRollIcon = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "3em", height: "3em", viewBox: "0 0 36 36", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M12.2171 21C9.88426 16.7994 10.9578 11.3701 14.9838 8.56284C19.0473 5.72947 25.74 6.47636 28 13.0633L25.413 12.4444", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M31.9746 19.5113C32.2043 21.5657 30.8518 23.4663 28.8259 23.9357L12.0257 27.8281C8.20111 28.7143 4.45857 26.0745 4.03837 22.1944C3.60787 18.2191 6.85748 14.804 10.8757 15.0088L28.1039 15.8869C30.1136 15.9893 31.7524 17.5238 31.9746 19.5113Z", fill: "currentColor" }));
const Rotations = ({ rot1, rot2, rot3, className = "" }) => {
  return /* @__PURE__ */ jsx(
    MultipleTags,
    {
      className,
      tags: [
        /* @__PURE__ */ jsx(
          IconTag,
          {
            icon: /* @__PURE__ */ jsx(SvgYawIcon, {}),
            measurement: rot1
          }
        ),
        /* @__PURE__ */ jsx(
          IconTag,
          {
            icon: /* @__PURE__ */ jsx(SvgPitchIcon, {}),
            measurement: rot2
          }
        ),
        /* @__PURE__ */ jsx(
          IconTag,
          {
            icon: /* @__PURE__ */ jsx(SvgRollIcon, {}),
            measurement: rot3
          }
        )
      ]
    }
  );
};
const airgapsWrapper = "_airgapsWrapper_1ws6e_1";
const styles$P = {
  airgapsWrapper
};
const airgapRowWrapper = "_airgapRowWrapper_1874l_1";
const styles$O = {
  airgapRowWrapper
};
const imageTagWrapper = "_imageTagWrapper_ho2lw_1";
const image = "_image_ho2lw_1";
const styles$N = {
  imageTagWrapper,
  image
};
const barTagWrapper = "_barTagWrapper_12e69_1";
const styles$M = {
  barTagWrapper
};
const Bar$1 = "";
const tempWrapper = "_tempWrapper_1o3t0_1";
const rangeBarWrapper = "_rangeBarWrapper_1o3t0_7";
const bulb = "_bulb_1o3t0_21";
const content$2 = "_content_1o3t0_25";
const styles$L = {
  tempWrapper,
  rangeBarWrapper,
  bulb,
  content: content$2
};
function clamp(value2, min, max) {
  return Math.min(Math.max(value2, min), max);
}
function normalize(value2, min, max) {
  return (value2 - min) / (max - min);
}
function clampAndNormalize(value2, min, max) {
  return normalize(clamp(value2, min, max), min, max);
}
const FaultLowerBound = 20;
const FaultUpperBound = 80;
const WarningLowerBound = 40;
const WarningUpperBound = 60;
const stateToColor = {
  stable: "hsl(92, 82%, 56%)",
  warning: "hsl(52, 90%, 61%)",
  fault: "hsl(356, 90%, 61%)"
};
function getState(meas) {
  if (isNumericMeasurement(meas)) {
    return getStateFromRange(
      meas.value.last,
      meas.safeRange[0],
      meas.safeRange[1]
    );
  } else if (meas.type == "bool") {
    return meas.value ? "stable" : "fault";
  } else {
    return "stable";
  }
}
function getStateFromRange(value2, min, max) {
  if (min !== null && max !== null) {
    const percentage = clampAndNormalize$1(value2, min, max) * 100;
    if (percentage < FaultLowerBound || percentage > FaultUpperBound) {
      return "fault";
    } else if (percentage < WarningLowerBound || percentage > WarningUpperBound) {
      return "warning";
    } else {
      return "stable";
    }
  }
  if (min !== null && value2 > min || max !== null && value2 < max) {
    return "stable";
  }
  if (min === null && max === null) {
    return "stable";
  }
  return "fault";
}
const colors = {
  stable: "hsl(96, 90%, 61%)",
  warning: "hsl(52, 90%, 61%)",
  fault: "hsl(356, 90%, 61%)"
};
const RangeBar = ({ type, value: value2, min, max }) => {
  const percentage = clampAndNormalize(value2, min, max) * 100;
  const color = colors[getStateFromRange(value2, min, max)];
  const oppositeHeight = 100 - percentage;
  return /* @__PURE__ */ jsxs("div", { className: `${type == "temp" ? styles$L.tempWrapper : ""}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: styles$L.rangeBarWrapper,
        style: {
          backgroundColor: color,
          borderColor: color
        },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: styles$L.content,
            style: {
              height: `${oppositeHeight}%`
            }
          }
        )
      }
    ),
    type == "temp" && /* @__PURE__ */ jsx(
      "div",
      {
        className: styles$L.bulb,
        style: { backgroundColor: color }
      }
    )
  ] });
};
const boolBar = "_boolBar_1s1o5_1";
const on = "_on_1s1o5_10";
const off = "_off_1s1o5_14";
const styles$K = {
  boolBar,
  on,
  off
};
const BoolBar = ({ isOn }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${styles$K.boolBar} ${isOn ? styles$K.on : styles$K.off}`
    }
  );
};
const Bar = (props) => {
  switch (props.type) {
    case "range":
    case "temp":
      return /* @__PURE__ */ jsx(
        RangeBar,
        {
          type: props.type,
          value: props.value,
          min: props.min,
          max: props.max
        }
      );
    case "bool":
      return /* @__PURE__ */ jsx(BoolBar, { isOn: props.value });
  }
};
const stateOverlay = "_stateOverlay_17867_1";
const overlay = "_overlay_17867_13";
const styles$J = {
  stateOverlay,
  overlay
};
const StateOverlay = ({ state: state2, children }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$J.stateOverlay, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: styles$J.overlay,
        style: { backgroundColor: stateToColor[state2] }
      }
    ),
    children
  ] });
};
const BarTag = ({
  measurement,
  barType,
  showWrapper = false
}) => {
  return /* @__PURE__ */ jsx(StateOverlay, { state: getState(measurement), children: /* @__PURE__ */ jsxs(
    "article",
    {
      className: `${styles$M.barTagWrapper} ${showWrapper ? styles$M.tagWrapper : ""}`,
      children: [
        (barType == "range" || barType == "temp") && measurement.safeRange[0] !== null && measurement.safeRange[1] !== null && /* @__PURE__ */ jsx(
          Bar,
          {
            type: barType,
            value: measurement.value.last,
            min: measurement.safeRange[0],
            max: measurement.safeRange[1]
          }
        ),
        (barType == "range" || barType == "temp") && (measurement.safeRange[0] === null || measurement.safeRange[1] === null) && /* @__PURE__ */ jsx(
          Bar,
          {
            type: "bool",
            value: (() => {
              const state2 = getStateFromRange(
                measurement.value.last,
                measurement.safeRange[0],
                measurement.safeRange[1]
              );
              if (state2 == "stable") {
                return true;
              } else {
                return false;
              }
            })()
          }
        ),
        barType == "bool" && /* @__PURE__ */ jsx(
          Bar,
          {
            type: barType,
            value: measurement.value
          }
        ),
        /* @__PURE__ */ jsx(ValueData, { measurement })
      ]
    }
  ) });
};
const ImageTag = ({
  imageUrl,
  width = "3.5rem",
  height = "3.5rem",
  measurement
}) => {
  return /* @__PURE__ */ jsxs("article", { className: `${styles$N.imageTagWrapper} tagWrapper`, children: [
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: imageUrl,
        alt: "",
        className: styles$N.image,
        style: { width, height }
      }
    )
  ] });
};
const emsUrl = "/assets/EMS-ff226188.png";
const hemsUrl = "/assets/HEMS-4c76b066.png";
const HEMS_IMAGE_WIDTH = "6rem";
const HEMS_IMAGE_HEIGHT = "2.5rem";
const EMS_IMAGE_WIDTH = "6rem";
const EMS_IMAGE_HEIGHT = "2.6rem";
const AirgapRow = ({ hems1, ems1, ems2, hems2 }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$O.airgapRowWrapper, children: [
    /* @__PURE__ */ jsx(
      ImageTag,
      {
        imageUrl: emsUrl,
        width: EMS_IMAGE_WIDTH,
        height: EMS_IMAGE_HEIGHT,
        measurement: ems1
      }
    ),
    /* @__PURE__ */ jsx(
      ImageTag,
      {
        imageUrl: hemsUrl,
        width: HEMS_IMAGE_WIDTH,
        height: HEMS_IMAGE_HEIGHT,
        measurement: hems1
      }
    ),
    /* @__PURE__ */ jsx(
      ImageTag,
      {
        imageUrl: hemsUrl,
        width: HEMS_IMAGE_WIDTH,
        height: HEMS_IMAGE_HEIGHT,
        measurement: hems2
      }
    ),
    /* @__PURE__ */ jsx(
      ImageTag,
      {
        imageUrl: emsUrl,
        width: EMS_IMAGE_WIDTH,
        height: EMS_IMAGE_HEIGHT,
        measurement: ems2
      }
    )
  ] });
};
const Airgaps = ({
  airgap_1,
  airgap_2,
  airgap_3,
  airgap_4,
  slave_airgap_5,
  slave_airgap_6,
  slave_airgap_7,
  slave_airgap_8,
  className
}) => {
  return /* @__PURE__ */ jsxs("div", { className: `${styles$P.airgapsWrapper} ${className}`, children: [
    /* @__PURE__ */ jsx(
      AirgapRow,
      {
        ems1: airgap_1,
        hems1: airgap_2,
        hems2: airgap_3,
        ems2: airgap_4
      }
    ),
    /* @__PURE__ */ jsx(
      AirgapRow,
      {
        ems1: slave_airgap_5,
        hems1: slave_airgap_6,
        hems2: slave_airgap_7,
        ems2: slave_airgap_8
      }
    )
  ] });
};
const coilsInfoWrapper = "_coilsInfoWrapper_dvbw4_1";
const styles$I = {
  coilsInfoWrapper
};
const coilInfoWrapper = "_coilInfoWrapper_1xm1g_1";
const chartWrapper = "_chartWrapper_1xm1g_8";
const styles$H = {
  coilInfoWrapper,
  chartWrapper
};
const coilInfoLabelsWrapper = "_coilInfoLabelsWrapper_mpzid_1";
const styles$G = {
  coilInfoLabelsWrapper
};
const coilInfoLabelWrapper = "_coilInfoLabelWrapper_s2j8b_1";
const name$3 = "_name_s2j8b_7";
const value$2 = "_value_s2j8b_14";
const styles$F = {
  coilInfoLabelWrapper,
  name: name$3,
  value: value$2
};
const CoilInfoLabel = ({ measurement }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$F.coilInfoLabelWrapper, children: [
    /* @__PURE__ */ jsx("span", { className: styles$F.name, children: measurement.name }),
    /* @__PURE__ */ jsx("span", { className: styles$F.value, children: measurement.value.average.toFixed(2) + " " + measurement.units })
  ] });
};
const CoilInfoLabels = ({ measurements }) => {
  return /* @__PURE__ */ jsx("div", { className: styles$G.coilInfoLabelsWrapper, children: measurements.map((measurement) => {
    return /* @__PURE__ */ jsx(
      CoilInfoLabel,
      {
        measurement
      },
      measurement.name
    );
  }) });
};
const CurrentChart = ({ current }) => {
  return /* @__PURE__ */ jsx(
    LinesChart,
    {
      width: "8rem",
      height: "6rem",
      divisions: 3,
      items: [
        {
          id: current.id,
          name: current.name,
          range: current.safeRange,
          color: "red",
          getUpdate: () => store.getState().measurements.measurements[current.id].value.last
        }
      ],
      length: 50
    }
  );
};
const CoilInfo = ({ coilData }) => {
  return /* @__PURE__ */ jsxs("article", { className: styles$H.coilInfoWrapper, children: [
    /* @__PURE__ */ jsx(
      CoilInfoLabels,
      {
        measurements: [
          coilData.current,
          coilData.currentRef,
          coilData.temperature
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      CurrentChart,
      {
        current: coilData.current,
        currentRef: coilData.currentRef
      }
    )
  ] });
};
const CoilsInfo = ({ coilsData, className = "" }) => {
  return /* @__PURE__ */ jsx("div", { className: `${styles$I.coilsInfoWrapper} ${className}`, children: coilsData.map((data, index2) => {
    return /* @__PURE__ */ jsx(
      CoilInfo,
      {
        coilData: data
      },
      index2
    );
  }) });
};
const LCU = (props) => {
  return /* @__PURE__ */ jsx(Window, { title: "LCU", children: /* @__PURE__ */ jsxs("section", { className: styles$V.levitationSectionWrapper, children: [
    /* @__PURE__ */ jsx(
      Rotations,
      {
        className: styles$V.rotations,
        rot1: props.rot_x,
        rot2: props.rot_y,
        rot3: props.rot_z
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: styles$V.positions, children: [
      /* @__PURE__ */ jsx(
        BarTag,
        {
          barType: "range",
          measurement: props.rot_y
        }
      ),
      /* @__PURE__ */ jsx(
        BarTag,
        {
          barType: "range",
          measurement: props.rot_z
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      Airgaps,
      {
        className: styles$V.airgaps,
        airgap_1: props.airgap_1,
        airgap_2: props.airgap_2,
        airgap_3: props.airgap_3,
        airgap_4: props.airgap_4,
        slave_airgap_5: props.slave_airgap_5,
        slave_airgap_6: props.slave_airgap_6,
        slave_airgap_7: props.slave_airgap_7,
        slave_airgap_8: props.slave_airgap_8
      }
    ),
    /* @__PURE__ */ jsx(
      CoilsInfo,
      {
        className: styles$V.coils,
        coilsData: [
          {
            current: props.current_coil_1,
            currentRef: props.reference_current_1,
            temperature: props.temperature_ems_1
          },
          {
            current: props.current_coil_2,
            currentRef: props.reference_current_2,
            temperature: props.temperature_ems_2
          },
          {
            current: props.current_coil_3,
            currentRef: props.reference_current_3,
            temperature: props.temperature_ems_3
          },
          {
            current: props.current_coil_4,
            currentRef: props.reference_current_4,
            temperature: props.temperature_ems_4
          },
          {
            current: props.slave_current_coil_5,
            currentRef: props.slave_reference_current_5,
            temperature: props.temperature_hems_1
          },
          {
            current: props.slave_current_coil_6,
            currentRef: props.slave_reference_current_6,
            temperature: props.temperature_hems_2
          },
          {
            current: props.slave_current_coil_7,
            currentRef: props.slave_reference_current_7,
            temperature: props.temperature_hems_3
          },
          {
            current: props.slave_current_coil_8,
            currentRef: props.slave_reference_current_8,
            temperature: props.temperature_hems_4
          }
        ]
      }
    )
  ] }) });
};
const pcuSectionWrapper = "_pcuSectionWrapper_utozc_1";
const styles$E = {
  pcuSectionWrapper
};
const vectorGauge = "_vectorGauge_mlxq0_1";
const directions = "_directions_mlxq0_9";
const styles$D = {
  vectorGauge,
  directions
};
const gaugeTagWrapper = "_gaugeTagWrapper_nmifn_1";
const gauge = "_gauge_nmifn_1";
const styles$C = {
  gaugeTagWrapper,
  gauge
};
const Arc = ({
  sweep,
  strokeWidth,
  percentage,
  radius,
  className
}) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const fullArc = circumference * (sweep / 360);
  const filledArc = fullArc * (percentage / 100);
  const dashArray = `${filledArc} ${circumference}`;
  const transform = `rotate(${-90 - sweep / 2}, ${radius}, ${radius})`;
  return /* @__PURE__ */ jsx(
    "circle",
    {
      viewBox: `0 0 ${radius * 2} ${radius * 2}`,
      className,
      cx: radius,
      cy: radius,
      fill: "transparent",
      r: innerRadius,
      strokeWidth,
      strokeDasharray: dashArray,
      strokeLinecap: "round",
      transform,
      style: {
        transition: "stroke-dasharray 0.1s linear"
      }
    }
  );
};
const maskArc = "_maskArc_nrdb0_1";
const styles$B = {
  maskArc
};
const BackgroundArc = ({
  percentage,
  radius,
  strokeWidth,
  sweep,
  className
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("mask", { id: "myMask", children: /* @__PURE__ */ jsx(
      Arc,
      {
        sweep,
        radius,
        strokeWidth,
        percentage,
        className: styles$B.maskArc
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      "foreignObject",
      {
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        mask: "url(#myMask)",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className,
            style: {
              width: "100%",
              height: "100%"
            }
          }
        )
      }
    )
  ] });
};
const backgroundArc = "_backgroundArc_1o56u_1";
const radialShadowArc = "_radialShadowArc_1o56u_5";
const rainbowArc = "_rainbowArc_1o56u_9";
const styles$A = {
  backgroundArc,
  radialShadowArc,
  rainbowArc
};
const Gauge = ({
  className,
  sweep,
  strokeWidth,
  value: value2,
  min,
  max
}) => {
  const radius = 500;
  const percentage = clampAndNormalize(value2, min, max) * 100;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className,
      width: "1em",
      height: "1em",
      viewBox: `0 0 ${radius * 2} ${radius * 2}`,
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ jsx(
          Arc,
          {
            className: styles$A.backgroundArc,
            sweep,
            radius,
            strokeWidth,
            percentage: 100
          }
        ),
        /* @__PURE__ */ jsx(
          BackgroundArc,
          {
            sweep,
            className: styles$A.rainbowArc,
            percentage,
            radius,
            strokeWidth
          }
        )
      ]
    }
  );
};
const textData = "_textData_1jqlf_1";
const name$2 = "_name_1jqlf_10";
const value$1 = "_value_1jqlf_15";
const units = "_units_1jqlf_20";
const styles$z = {
  textData,
  name: name$2,
  value: value$1,
  units
};
const TextData = reactExports.memo(({ name: name2, value: value2, units: units2 }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$z.textData, children: [
    /* @__PURE__ */ jsx("div", { className: styles$z.name, children: name2 }),
    /* @__PURE__ */ jsx("div", { className: styles$z.value, children: value2.toFixed(2) }),
    /* @__PURE__ */ jsx("div", { className: styles$z.units, children: units2 })
  ] });
});
const GaugeTag = ({
  measurement,
  className,
  strokeWidth,
  min,
  max
}) => {
  return /* @__PURE__ */ jsxs("article", { className: `${styles$C.gaugeTagWrapper} ${className}`, children: [
    /* @__PURE__ */ jsx(
      Gauge,
      {
        className: styles$C.gauge,
        sweep: 250,
        strokeWidth,
        value: measurement.value.average,
        min,
        max
      }
    ),
    /* @__PURE__ */ jsx(
      TextData,
      {
        name: measurement.name,
        units: measurement.units,
        value: measurement.value.average
      }
    )
  ] });
};
const directionTagWrapper = "_directionTagWrapper_xvr1t_1";
const valueWrapper = "_valueWrapper_xvr1t_11";
const axis = "_axis_xvr1t_17";
const styles$y = {
  directionTagWrapper,
  valueWrapper,
  axis
};
const DirectionTag = ({ axis: axis2, value: value2, units: units2 }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$y.directionTagWrapper, children: [
    /* @__PURE__ */ jsx("span", { className: styles$y.axis, children: axis2 }),
    /* @__PURE__ */ jsxs("div", { className: styles$y.valueWrapper, children: [
      /* @__PURE__ */ jsx("span", { className: styles$y.value, children: value2.toFixed(2) }),
      /* @__PURE__ */ jsx("span", { className: styles$y.units, children: units2 })
    ] })
  ] });
};
const VectorGauge = ({ x: x2, y: y2, z: z2 }) => {
  return /* @__PURE__ */ jsxs("article", { className: styles$D.vectorGauge, children: [
    /* @__PURE__ */ jsx(
      GaugeTag,
      {
        measurement: x2,
        min: 0,
        max: 100,
        strokeWidth: 145,
        className: styles$D.velGauge
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: styles$D.directions, children: [
      /* @__PURE__ */ jsx(
        DirectionTag,
        {
          axis: "x",
          value: x2.value.average,
          units: "m"
        }
      ),
      /* @__PURE__ */ jsx(
        DirectionTag,
        {
          axis: "y",
          value: y2.value.average,
          units: "m"
        }
      ),
      /* @__PURE__ */ jsx(
        DirectionTag,
        {
          axis: "z",
          value: z2.value.average,
          units: "m"
        }
      )
    ] })
  ] });
};
const motorInfoWrapper = "_motorInfoWrapper_18for_1";
const chart = "_chart_18for_7";
const motorTemp = "_motorTemp_18for_11";
const styles$x = {
  motorInfoWrapper,
  chart,
  motorTemp
};
const MotorInfo = ({
  title: title2,
  motorCurrentU,
  motorCurrentV,
  motorCurrentW
}) => {
  return /* @__PURE__ */ jsx("div", { className: styles$x.motorInfoWrapper, children: /* @__PURE__ */ jsx(
    ColorfulChart,
    {
      className: styles$x.chart,
      title: title2,
      length: 100,
      items: [
        getItemFromMeasurement(motorCurrentU),
        getItemFromMeasurement(motorCurrentV),
        getItemFromMeasurement(motorCurrentW)
      ]
    }
  ) });
};
function getItemFromMeasurement(meas) {
  return {
    id: meas.id,
    name: meas.name,
    color: "red",
    getUpdate: () => getMeasurementValue(meas.id),
    range: meas.safeRange
  };
}
function getMeasurementValue(id2) {
  const measurement = store.getState().measurements.measurements[id2];
  if (!measurement) {
    return 0;
  }
  if (isNumericMeasurement(measurement)) {
    return measurement.value.last;
  } else {
    return 0;
  }
}
const tempTag = "_tempTag_h7oai_1";
const title$2 = "_title_h7oai_21";
const value = "_value_h7oai_25";
const styles$w = {
  tempTag,
  title: title$2,
  value
};
const TempTag = ({ meas, icon: icon2 }) => {
  return /* @__PURE__ */ jsx(StateOverlay, { state: getState(meas), children: /* @__PURE__ */ jsxs("div", { className: styles$w.tempTag, children: [
    /* @__PURE__ */ jsx("div", { className: styles$w.title, children: meas.name }),
    /* @__PURE__ */ jsx("div", { className: styles$w.icon, children: icon2 }),
    /* @__PURE__ */ jsx("div", { className: styles$w.value, children: `${meas.value.last.toFixed(2)} ${meas.units}` })
  ] }) });
};
const motorUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX8AAABYCAYAAAAdmvddAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHVSURBVHgB7da9ShYAGIbh95OIBIeoFkMoamqwA4g6gdZOITqeDqC1paUlSJxd/d3cFAR1F5z8mTwFh+++ruk9gIebd3G89fNuIv79357zi8spWH+5Nh/evppl9/7jl6mw3+V0MytnP178+TyP4Pz74vThXhkAcsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBghbrv+7ezCP6dv174+v1352JeP1uc1bXnk/B7v7h7B0czTJ79vTJfNrcmAr7XS6rt1cP54nPHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyBI/AGCxB8gSPwBgsQfIEj8AYLEHyDoHnh6KYcvGDzIAAAAAElFTkSuQmCC";
const pcbUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAeCAYAAACxHzfjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAirSURBVHgBzVhrVFXHFf7uLVdAXtdUFJTIQ6PgA1z1RZooKD5YWQVstElMUsQWX43RGpKuFlRMK9TYkppgFtRiq1katU2TQlYjPkCMiZUgbQggQgBRBERcBbwX5GG43bPPmXPPJSjNan9kWMOc2Xv2nG/27Plmn2sAYHB2dg7s7e39HT2HUbUJGRXYqIjnB8hYOIwM0l7XDifro3rBw8PjZYvFcttp586dBqrbx443xy5aEWZ/E/0zGBnU8DIBHveXsehryk4cvfRIe5ulkUQ7BEgxb+D0ef54bkskBgZsuHqlFd2WHjYIDQ9AXeVNdFGfbDFtjj8aqm/B2nkXitdo4gEBXnnBA2U2ezvGzwwPTxfUXb7J72i90YGuOz0IDBnLetEveO8zP2HqpHMzAxST5OzKR3nxNYwZb0ZO0WbkpJ2kfgPG0sQHzm3Brg3HcIsm+V/KT/csx5hxnkh+/m18ULsD77x5Dq2NHUg/Es8YZOSIByfNijQG1efJWU+jm1alipGS9RSvUi5ElPkrJ1GdyPPwTNJN+hDTZLpCsqyt53mcCB29XHjeMGgOEY4kxh+pBghP5ew6yfN+cOhTXlketaLk/qkYRzM/Qt7BYg2Hq7sJD/m6YZSPK8w+I9Fc34nKj5tZdv7dWjTXdqCn+x5OH6yCC40dRWO4kh7SUeqCdTilB7k1Go0CJHsyIWLhYlgtd/CP09VYuz0aIz2cVSMbG7pT7LQ1d2rmdkcpK678pAUlJ64TsE4GdCn/Gtpbu+AbZEYJPY+b5IVpj/sSSDeHILXpHK7fSVkGBga45e1e9Xw8mm80IXv/a/ziuIR5mrGRtiR2zbxBq3VEm5tZhvab3fx8fHcptxXnW7iyft/nDH72spHa9jNDqM/K7tg0J0rQ0q1OqmdZJlfS1/cl9v/yBC7kV8HZxYTYhHB8PzEc+rAT1gJY+jP5bLNuwyaspToYgCixT0QxeOHhDXsXqMDIk0Nst/0dgw7O67/5NSy03TajMvhwxllcOnEZmckRaGq1ImX3KUya4YsZRFPSgcLaxc2JXjqfAQhgX9RcQcaedI1nJgeHIOmVZDaZv2ISZj8xAfqYw6DtVQ4OBhemoEM11VVxRC/m8MVTeAG1Fc14Li4Ez8YE8zzHP6xBTVmTHaRmbmBv9lj72TNubh7wHTde40IPdw8trnq6+9Fj6bd7WIfRoIUAhioMMoHq2elzAyITU5axwYTJ3sgrrMHq5VNxm0i7vPo2YgK/7WAp5hPgTtHpvUut6Ht4emI9bfmA+mJ3AskASFl+vhl3LX0IChutAZOYmNZ0LhTcWU8kTyWSaqEAaYRKdjJWV657DJ9fuIpZTx5ho6iVMxG+ZIrDasVYQT/Jx6KVuBTbXV2F9Ynx2su+M3sufp/zNrssblMoHZwJDzw4BhV8+cUGCMahZfgXnS3wFyALqYZVEE+mbfwzE/doX0+8lf8T1JY3w+ztDm/qS4DawaFOT9c9HEy5yFtuIE57ZEowsgUoHmKDl6eXSlMg7qxDS10nYl4IVVeJIQ+OvCwWLoxiGiWQfLojvhezHFarBZerFPo489cyhRcHbFpCIYq7lytiV89VD45yOsX2CeIuLSnmt9jkVqqeKSo8wxw8IcgdvhO9HANPz5NwPDh2FlIpKGb5CjQ3NeFyTSkbFL5XhsayFni5jNDm6ujpg/NoFaRaXD1GYOmaENSXtaHyyr+4iptIeFbwoigibsVNMyc6ANMe89GuQpvu4BiNQx8c2WXSUU6gTceVNmwJD0PDS2tQvzUBdVRFX3rJYUJ62PjGAiygu3w83SwiRgUo0U/YFc5DNhI3SoByV4zsbTmFTRer0ssGNStQPfmzlzaxv1y9jPZl0KAB1cKg9qGLGb71bWo4kOxxwYPR/gpoAuXiZiJPmxTQY111AFUwcCR8eXCkV1uaGmGxWjWQP7JaranT5k7wj1vzqGaTW1WPhg4LZEZS1tLGhCUPTiVRSntLtxY7+u0bTiZCwNFt9jHS0/uz39LkRsoyDpHiqo/fKIQvnsyrCwzxwT3/kSgd0YV/juhGqakLX1J/+lyFzIOm+mDUQ2b0tIPr3X8DvaJV+8PJJk4bB/oScEwwYD8oImedt5gpL5dqoMjMWS95S2zn2m3LNGPhfpkMS9m27Ke1FevH/Tcy/Q5XfHrNAZwc6j3Oi5mECi0J151UL6OcDLJSP8T61GjeXpFPHqUqStrh1TRhg9b/fxSZmWtFjfkhEowBeVJepc+BpL8fLrmWkfQ+68UNIyba8locfB828yAz5ZkH0pdyG7soCBk/VzKa138RQf2JCA0ejQNpS1gfFzURL/5wJuszSB8xxw9hwd70KaLov5JgaJm542Jop41GZTSKqO6luvVcXoX6qaB+xRkEH7ooJ9EAXeJrcKAj8XiH7mY9lYyiZFnpKHYdd3qHTDB0OB2KmplDfuOwg00m0/X+/n401rbhM7q733mjiJXpR8wcW+IlicmnWJZXUMdVlKTd9jD4sdQX1nG9n54pSQ/OYPhKVqRmUJxBKoxHIwngU+ILMWTWw1j14gLkfbGDvuRSOUUTht5jxuLY305T64MfrFqNfX84zJNlUiv6U6eH4XjuGR638pl4pKZlsH7f/iOIjFrqoFcO46DMXAWoy4oYPh8ccuteUsY6u5oC4l9exIML6P4ueL+MhyVuW8qe7O7qwq+2v4K2WzdxruAkSi5+zGOz3/wtbrW2sP7VlCTSt+KjwlO4VPwJ67My96ChXvGq1BsekGAMPjjyF4zQyTPHB2xOj4U/5ZLy430G8aL8EJsxLwDyF4zQhRFKgkF/j9r81NvES5OFCb1KP9+FH7sjNHKWdjvNXBTBPwK4ebri2c2RDDB8STD/IDFUZm5Q0b47K2LSk4IfTaZv2Vcm40O/FTIP/BoyITXeT6ZmWnqZWFz6C3+hX05aDpBonXSpSG0aVVzflHqDapDA9x81S5cwha4taQAAAABJRU5ErkJggg==";
const PCU = (props) => {
  return /* @__PURE__ */ jsx(Window, { title: "PCU", children: /* @__PURE__ */ jsxs("section", { className: styles$E.pcuSectionWrapper, children: [
    /* @__PURE__ */ jsx(
      VectorGauge,
      {
        x: props.velocity,
        y: props.velocity,
        z: props.velocity
      }
    ),
    /* @__PURE__ */ jsx(
      VectorGauge,
      {
        x: props.accel_x,
        y: props.accel_y,
        z: props.accel_z
      }
    ),
    /* @__PURE__ */ jsx(
      MotorInfo,
      {
        title: "Motor 1",
        motorCurrentU: props.motor_a_current_u,
        motorCurrentV: props.motor_a_current_v,
        motorCurrentW: props.motor_a_current_w
      }
    ),
    /* @__PURE__ */ jsx(
      MotorInfo,
      {
        title: "Motor 2",
        motorCurrentU: props.motor_b_current_u,
        motorCurrentV: props.motor_b_current_v,
        motorCurrentW: props.motor_b_current_w
      }
    ),
    /* @__PURE__ */ jsx(
      TempTag,
      {
        meas: props.max_motor_a_temperature,
        icon: /* @__PURE__ */ jsx(
          "img",
          {
            src: motorUrl,
            style: {
              objectFit: "contain",
              width: "9rem",
              height: "4rem"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      TempTag,
      {
        meas: props.max_ppu_a_temperature,
        icon: /* @__PURE__ */ jsx(
          "img",
          {
            src: pcbUrl,
            style: {
              objectFit: "contain",
              width: "4rem",
              height: "4rem"
            }
          }
        )
      }
    )
  ] }) });
};
const bmsl = "_bmsl_1cv1f_1";
const styles$v = {
  bmsl
};
const ValueDataTag = (props) => {
  return /* @__PURE__ */ jsx(StateOverlay, { state: getState(props.measurement), children: /* @__PURE__ */ jsx(ValueData, { ...props }) });
};
const BMSL = (props) => {
  return /* @__PURE__ */ jsx(Window, { title: "BMSL", children: /* @__PURE__ */ jsxs("div", { className: styles$v.bmsl, children: [
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.low_SOC1 }),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.low_battery_temperature_1
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.total_voltage_low
      }
    )
  ] }) });
};
const batteryInfo = "_batteryInfo_c1tlw_1";
const icon$2 = "_icon_c1tlw_10";
const content$1 = "_content_c1tlw_17";
const title$1 = "_title_c1tlw_23";
const tags = "_tags_c1tlw_27";
const styles$u = {
  batteryInfo,
  icon: icon$2,
  content: content$1,
  title: title$1,
  tags
};
const batteryUrl = "/assets/battery-d48f5a10.png";
const BatteryInfo = (props) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$u.batteryInfo, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        className: styles$u.icon,
        src: batteryUrl,
        alt: "Lipo batterty"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: styles$u.content, children: [
      /* @__PURE__ */ jsx("span", { className: styles$u.title, children: props.title }),
      /* @__PURE__ */ jsxs("div", { className: styles$u.tags, children: [
        /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.soc }),
        /* @__PURE__ */ jsx(
          BarTag,
          {
            barType: "temp",
            measurement: props.temp1
          }
        ),
        /* @__PURE__ */ jsx(
          BarTag,
          {
            barType: "range",
            measurement: props.totalVoltage
          }
        )
      ] })
    ] })
  ] });
};
const generalInfo = "_generalInfo_4rl9x_1";
const styles$t = {
  generalInfo
};
const GeneralInfo = (props) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$t.generalInfo, children: [
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.maximumCell1
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.maximumCell2
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.maximumCell3
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.minimumCell1
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.minimumCell2
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.minimumCell3
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.totalVoltageHigh
      }
    ),
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.drift })
  ] });
};
const obccu = "_obccu_7r8eo_1";
const batteries = "_batteries_7r8eo_10";
const styles$s = {
  obccu,
  batteries
};
const OBCCU = (props) => {
  return /* @__PURE__ */ jsx(Window, { title: "OBCCU", children: /* @__PURE__ */ jsxs("div", { className: styles$s.obccu, children: [
    /* @__PURE__ */ jsx(
      GeneralInfo,
      {
        maximumCell1: props.maximumCell1,
        maximumCell2: props.maximumCell2,
        maximumCell3: props.maximumCell3,
        minimumCell1: props.minimumCell1,
        minimumCell2: props.minimumCell2,
        minimumCell3: props.minimumCell3,
        totalVoltageHigh: props.totalVoltageHigh,
        drift: props.drift
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: styles$s.batteries, children: [
      /* @__PURE__ */ jsx(
        BatteryInfo,
        {
          title: "Battery 1",
          soc: props.SOC1,
          temp1: props.battery_temperature_1,
          totalVoltage: props.totalVoltage1
        }
      ),
      /* @__PURE__ */ jsx(
        BatteryInfo,
        {
          title: "Battery 2",
          soc: props.SOC1,
          temp1: props.battery_temperature_2,
          totalVoltage: props.totalVoltage2
        }
      ),
      /* @__PURE__ */ jsx(
        BatteryInfo,
        {
          title: "Battery 3",
          soc: props.SOC1,
          temp1: props.battery_temperature_3,
          totalVoltage: props.totalVoltage3
        }
      )
    ] })
  ] }) });
};
const vcu = "_vcu_1ctqr_1";
const styles$r = {
  vcu
};
const VCU = (props) => {
  return /* @__PURE__ */ jsx(Window, { title: "VCU", children: /* @__PURE__ */ jsxs("div", { className: styles$r.vcu, children: [
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.general_state }),
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.specific_state }),
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.voltage_state }),
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.valve_state }),
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.reed1 }),
    /* @__PURE__ */ jsx(ValueDataTag, { measurement: props.reed2 }),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.high_pressure
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.position
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.speed
      }
    ),
    /* @__PURE__ */ jsx(
      BarTag,
      {
        barType: "range",
        measurement: props.reference_pressure
      }
    )
  ] }) });
};
const BoardsPage = () => {
  const measurements = useMeasurements();
  return /* @__PURE__ */ jsxs("div", { className: styles$W.boardsPage, children: [
    /* @__PURE__ */ jsx(OBCCU, { ...selectObccuMeasurements(measurements) }),
    /* @__PURE__ */ jsxs("div", { className: styles$W.column, children: [
      /* @__PURE__ */ jsx(VCU, { ...selectVcuMeasurements(measurements) }),
      /* @__PURE__ */ jsx(PCU, { ...selectPcuMeasurements(measurements) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$W.gridColumn, children: [
      /* @__PURE__ */ jsx(Connections, {}),
      /* @__PURE__ */ jsx(LCU, { ...selectLcuMeasurements(measurements) }),
      /* @__PURE__ */ jsx(BMSL, { ...selectBmslMeasurements(measurements) })
    ] })
  ] });
};
const controlPage = "_controlPage_1ffv2_1";
const column = "_column_1ffv2_11";
const styles$q = {
  controlPage,
  column
};
const emergencyOrdersWrapper = "_emergencyOrdersWrapper_1vqjt_1";
const icon$1 = "_icon_1vqjt_10";
const stopBtn = "_stopBtn_1vqjt_14";
const restartBtn = "_restartBtn_1vqjt_18";
const brakeBtn = "_brakeBtn_1vqjt_22";
const contactorBtn = "_contactorBtn_1vqjt_26";
const styles$p = {
  emergencyOrdersWrapper,
  icon: icon$1,
  stopBtn,
  restartBtn,
  brakeBtn,
  contactorBtn
};
const emergencyButtonWrapper = "_emergencyButtonWrapper_199x7_1";
const label$1 = "_label_199x7_13";
const styles$o = {
  emergencyButtonWrapper,
  label: label$1
};
const EmergencyButton = ({
  label: label2,
  icon: icon2,
  className,
  targetKey,
  onTrigger
}) => {
  useListenKey(targetKey, onTrigger, true);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `${styles$o.emergencyButtonWrapper} ${className}`,
      onClick: onTrigger,
      children: [
        icon2,
        /* @__PURE__ */ jsx("span", { className: styles$o.label, children: label2 })
      ]
    }
  );
};
const SvgStopIcon = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "3em", height: "3em", viewBox: "0 0 43 42", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M28.0385 1.55194L14.8283 1.55194C13.9172 1.55194 13.0434 1.91389 12.3991 2.55817L3.05811 11.8992C2.41383 12.5434 2.05188 13.4173 2.05188 14.3284L2.05188 27.5386C2.05188 28.4497 2.41383 29.3235 3.05811 29.9678L12.3991 39.3088C13.0434 39.9531 13.9172 40.315 14.8283 40.315H28.0385C28.9496 40.315 29.8235 39.9531 30.4677 39.3088L39.8087 29.9678C40.453 29.3235 40.815 28.4497 40.815 27.5386V14.3284C40.815 13.4173 40.453 12.5434 39.8087 11.8992L30.4677 2.55817C29.8235 1.91389 28.9496 1.55194 28.0385 1.55194Z", fill: "#FF2424", stroke: "#FFEEEE", strokeWidth: 3 }), /* @__PURE__ */ reactExports.createElement("rect", { x: 9.21594, y: 17.2321, width: 24.7742, height: 7.74194, fill: "white" }));
const SvgRestartIcon = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "3em", height: "3em", viewBox: "0 0 38 40", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M16.3468 7.71331C14.8947 8.07691 13.3885 8.63716 11.8794 9.51118C5.05988 13.4607 2.72074 21.939 6.65247 28.456C10.5924 34.9868 19.3011 37.0666 26.1206 33.117C32.9401 29.1676 35.2792 20.6894 31.3475 14.1722M11.4696 4.88324L18.639 6.38577L15.5306 13.1431", stroke: "#E6F0FF", strokeWidth: 9, strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M16.3468 7.71331C14.8947 8.07691 13.3885 8.63716 11.8794 9.51118C5.05988 13.4607 2.72074 21.939 6.65247 28.456C10.5924 34.9868 19.3011 37.0666 26.1206 33.117C32.9401 29.1676 35.2792 20.6894 31.3475 14.1722M11.4696 4.88324L18.639 6.38577L15.5306 13.1431", stroke: "#2D74FF", strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round" }));
const SvgBrake = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "3em", height: "3em", viewBox: "0 0 45 55", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M42.4682 39.5937L42.3781 40.7566C42.1634 44.1527 40.3139 47.1141 37.6081 49.1937C37.5484 49.2402 37.4872 49.2864 37.4359 49.3251L37.4185 49.3383C37.3988 49.3541 37.3645 49.3808 37.3199 49.4115C37.2214 49.483 37.122 49.5529 37.019 49.6228C34.4027 51.4308 31.0519 52.5 27.4213 52.5C24.9021 52.5 22.5145 51.9852 20.4145 51.064V51.3464L18.0851 49.8005L18.085 49.8004L18.0849 49.8004L18.0845 49.8001L18.0826 49.7989L18.0754 49.794L18.0476 49.7756L17.9481 49.7096C17.8655 49.6549 17.7552 49.5819 17.6441 49.5085L17.6432 49.5079L17.3354 49.3045L17.2317 49.2358L17.1989 49.214L17.1838 49.2039L17.1828 49.2032C16.1036 48.4855 14.7028 47.0591 13.9151 46.2232C13.5456 45.8443 13.1757 45.4386 12.8126 45.0024L8.7707 40.2889L7.97138 39.4052L7.97073 39.4045L3.60161 34.5806C3.60134 34.5803 3.60107 34.58 3.60079 34.5797C3.60076 34.5797 3.60073 34.5797 3.60069 34.5796C1.89251 32.696 2.22239 29.8731 4.23757 28.3652C5.09941 27.7184 6.1249 27.418 7.12275 27.418C8.02139 27.418 8.92938 27.6597 9.71406 28.1544L9.82768 28.226L9.86913 28.264C9.91028 28.2948 9.97586 28.3448 10.042 28.3996C10.1058 28.4507 10.16 28.4998 10.2028 28.5408L12.3146 30.4612L11.3054 31.5709L12.3146 30.4612L12.4499 30.5842L12.4499 30.5842L12.4562 30.5899L12.7861 30.8934V10.8338C12.7861 8.42229 14.9025 6.69822 17.1885 6.69822H17.2689C18.1551 6.69822 19.0152 6.95801 19.7362 7.41661V5.63553C19.7362 3.22542 21.851 1.5 24.1344 1.5H24.2168C26.5012 1.5 28.6171 3.22466 28.6171 5.63553V6.00308C29.3361 5.54901 30.1915 5.29195 31.0717 5.29195H31.1541C33.4387 5.29195 35.5523 7.02064 35.5523 9.42965V11.1201C36.2745 10.661 37.1361 10.4009 38.0236 10.4009H38.1018C40.3924 10.4009 42.5 12.131 42.5 14.5384V34.857L42.8749 34.3455L42.4682 39.5937Z", fill: "#EE8735", stroke: "white", strokeWidth: 3 }));
const SvgOpenSwitch = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "6em", height: "3em", viewBox: "0 0 87 26", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2 22H31", stroke: "currentColor", strokeWidth: 4, strokeLinecap: "round" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M85 22H56", stroke: "currentColor", strokeWidth: 4, strokeLinecap: "round" }), /* @__PURE__ */ reactExports.createElement("circle", { cx: 29, cy: 22, r: 4, fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("circle", { cx: 4, cy: 4, r: 4, transform: "matrix(-1 0 0 1 61 18)", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("line", { x1: 29, y1: 22.1716, x2: 49.1716, y2: 2, stroke: "currentColor", strokeWidth: 4, strokeLinecap: "round" }));
const EmergencyOrders = ({
  brake,
  openContactors,
  reset,
  stop: stop2
}) => {
  const StyledStopIcon = /* @__PURE__ */ jsx(SvgStopIcon, { className: styles$p.icon });
  const StyledRestartIcon = /* @__PURE__ */ jsx(
    SvgRestartIcon,
    {
      className: `${styles$p.icon}`,
      color: "#ebf6ff"
    }
  );
  const StyledBrakeIcon = /* @__PURE__ */ jsx(SvgBrake, { className: styles$p.icon });
  const StyledOpenContactorIcon = /* @__PURE__ */ jsx(
    SvgOpenSwitch,
    {
      className: styles$p.icon,
      color: "black"
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: styles$p.emergencyOrdersWrapper, children: [
    /* @__PURE__ */ jsx(
      EmergencyButton,
      {
        label: "STOP",
        icon: StyledStopIcon,
        className: styles$p.stopBtn,
        targetKey: "s",
        onTrigger: stop2
      }
    ),
    /* @__PURE__ */ jsx(
      EmergencyButton,
      {
        label: "RESET",
        icon: StyledRestartIcon,
        className: styles$p.restartBtn,
        targetKey: "r",
        onTrigger: reset
      }
    ),
    /* @__PURE__ */ jsx(
      EmergencyButton,
      {
        label: "BRAKE",
        icon: StyledBrakeIcon,
        className: styles$p.brakeBtn,
        targetKey: "b",
        onTrigger: brake
      }
    ),
    /* @__PURE__ */ jsx(
      EmergencyButton,
      {
        label: "OPEN CONTACTORS",
        icon: StyledOpenContactorIcon,
        className: styles$p.contactorBtn,
        targetKey: "o",
        onTrigger: openContactors
      }
    )
  ] });
};
const hardcodedOrderToId = {
  set_regulator_pressure: 210,
  brake: 215,
  unbrake: 216,
  disable_emergency_tape: 217,
  enable_emergency_tape: 218,
  test_current_control: 335,
  open_contactors: 902,
  close_contactors: 903,
  take_off: 300,
  test_svppwm: 615,
  stop_lcu_control: 316,
  stop_pcu_control: 609
};
function getHardcodedOrders(boardOrders) {
  const foundOrders = [];
  const wantedOrdersIds = Object.values(hardcodedOrderToId);
  for (const board2 of boardOrders) {
    for (const order of board2.orders) {
      if (wantedOrdersIds.includes(order.id)) {
        foundOrders.push(order);
      }
    }
    for (const stateOrder of board2.stateOrders) {
      if (wantedOrdersIds.includes(stateOrder.id)) {
        foundOrders.push(stateOrder);
      }
    }
  }
  return [{ name: "", orders: foundOrders, stateOrders: [] }];
}
const ResetVehicleOrder = {
  id: 250,
  fields: {}
};
const StopOrder = {
  id: 200,
  fields: {}
};
const BrakeOrder = {
  id: 215,
  fields: {}
};
const OpenContactorsOrder = {
  id: 902,
  fields: {}
};
const bootloader = "_bootloader_hxoo9_1";
const styles$n = {
  bootloader
};
const dropElementWrapper = "_dropElementWrapper_iivag_1";
const dragOver = "_dragOver_iivag_14";
const link = "_link_iivag_19";
const styles$m = {
  dropElementWrapper,
  dragOver,
  link
};
function isCorrectFormat(fileName, fileFormat) {
  return fileName.endsWith(`.${fileFormat}`);
}
function getFile(ev, format) {
  ev.preventDefault();
  if (ev.dataTransfer.items) {
    return handleFileWithDataTransferItems(ev, format);
  } else {
    return handleFileWidthDataTransferFiles(ev);
  }
}
function handleFileWithDataTransferItems(ev, format) {
  if (ev.dataTransfer.items.length > 1 || ev.dataTransfer.items.length < 1) {
    console.error("Expected one file");
    return null;
  } else if (ev.dataTransfer.items[0].kind !== "file") {
    console.error("Dropped item is not file");
    return null;
  } else if (!isCorrectFormat(
    [...ev.dataTransfer.items][0].getAsFile().name,
    format
  )) {
    const fileName = [...ev.dataTransfer.items][0].getAsFile().name;
    const extension = fileName.substring(fileName.lastIndexOf("."));
    console.error(
      `Incorrect file format: expected "${format}" got "${extension}"`
    );
    return null;
  } else {
    return [...ev.dataTransfer.items][0].getAsFile();
  }
}
function handleFileWidthDataTransferFiles(ev) {
  if (ev.dataTransfer.files.length > 1 || ev.dataTransfer.files.length < 1) {
    console.error("Expected one file");
    return null;
  } else {
    return [...ev.dataTransfer.files][0];
  }
}
const DropElement = ({ onFile }) => {
  const [isDragOver, setDragOver] = reactExports.useState(false);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${styles$m.dropElementWrapper} ${isDragOver ? styles$m.dragOver : ""}`,
      onDragEnter: () => {
        setDragOver(true);
      },
      onDragLeave: (ev) => {
        if (ev.currentTarget.contains(ev.relatedTarget)) {
          return;
        }
        setDragOver(false);
      },
      onDrop: (ev) => {
        const file = getFile(ev, "bin");
        if (file) {
          onFile(file);
        }
      },
      onDragOver: (ev) => ev.preventDefault(),
      children: /* @__PURE__ */ jsxs("div", { className: styles$m.textWrapper, children: [
        /* @__PURE__ */ jsx("span", { style: { pointerEvents: "none" }, children: "Drop or " }),
        /* @__PURE__ */ jsx(
          FileInput,
          {
            accept: ".bin",
            onFile,
            className: styles$m.link,
            label: "Choose file"
          }
        )
      ] })
    }
  );
};
const sendElementWrapper = "_sendElementWrapper_1tir3_1";
const fileIcon = "_fileIcon_1tir3_14";
const fileData = "_fileData_1tir3_19";
const name$1 = "_name_1tir3_27";
const removeBtn = "_removeBtn_1tir3_33";
const styles$l = {
  sendElementWrapper,
  fileIcon,
  fileData,
  name: name$1,
  removeBtn
};
const SvgBinaryFile = (props) => /* @__PURE__ */ reactExports.createElement("svg", { id: "svg59", width: "2em", height: "2em", viewBox: "0 0 373 457.79935", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlns: "http://www.w3.org/2000/svg", "xmlns:svg": "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("defs", { id: "defs63" }), /* @__PURE__ */ reactExports.createElement("g", { id: "g65", transform: "translate(-69.5,-27.127445)" }, /* @__PURE__ */ reactExports.createElement("path", { style: {
  display: "inline",
  fill: "currentColor"
}, d: "M 105,483.56703 C 89.762998,479.32051 77.692974,468.01213 71.754378,452.41927 L 69.5,446.5 V 261 75.5 l 2.727597,-8 C 77.586076,51.783666 87.909715,39.978079 102.35484,33.048021 106.83468,30.898817 113.2,28.636565 116.5,28.020794 120.74294,27.229073 151.63799,26.988886 222,27.200605 L 321.5,27.5 l 5.62043,2.84882 c 4.58432,2.323644 15.30051,12.554991 58.13007,55.5 49.12599,49.25842 52.66234,53.03781 54.87956,58.65118 l 2.36994,6 v 143 143 l -3.05992,8.54417 c -5.49647,15.34768 -14.63255,26.13084 -28.16392,33.24137 -13.45333,7.06953 -4.29757,6.69309 -160.77616,6.61026 -109.80128,-0.0581 -141.9957,-0.35214 -145.5,-1.32877 z m 290.78019,-33.14478 c 5.58635,-2.7838 9.05383,-6.3311 12.51761,-12.80578 L 410.5,433.5 v -134 -134 L 371,165 c -38.19474,-0.48348 -39.65959,-0.57365 -44.3295,-2.72894 C 316.27713,157.47426 309.17786,149.4583 305.8482,138.7601 304.19123,133.43625 304,129.00262 304,95.910906 V 59 h -91.30366 -91.30365 l -5.17288,2.577752 c -5.58635,2.783799 -9.05383,6.331097 -12.51761,12.805778 L 101.5,78.5 l -0.26324,180.51124 -0.26324,180.51125 2.26324,4.48068 c 1.24478,2.46438 3.79229,5.49682 5.66112,6.73876 L 112.29577,453 H 251.45154 390.60731 Z M 146.59305,418.57169 c -10.44309,-4.3774 -17.67364,-11.82566 -21.55774,-22.20685 -1.99645,-5.33601 -2.1135,-7.2384 -1.83393,-29.80808 l 0.29862,-24.10829 3.24993,-6.59681 c 3.85328,-7.8215 10.13358,-13.96849 18.07492,-17.69125 5.35446,-2.51008 6.52276,-2.66041 20.67515,-2.66041 13.48074,0 15.49835,0.22983 19.92034,2.26912 10.6651,4.91844 18.17457,13.73878 21.02983,24.70087 2.18701,8.3965 2.18701,42.66352 0,51.06002 -2.85816,10.97322 -10.39689,19.8207 -21.02983,24.68069 -4.21663,1.92729 -6.92262,2.29098 -18.92034,2.54296 -13.00297,0.27309 -14.42067,0.1177 -19.90695,-2.18197 z m 28.37177,-31.50595 C 175.56284,385.94832 176,377.89682 176,368 c 0,-9.89682 -0.43716,-17.94832 -1.03518,-19.06574 -0.89527,-1.67282 -2.15228,-1.93426 -9.3,-1.93426 -5.09486,0 -8.72508,0.46026 -9.46482,1.2 -1.69158,1.69158 -1.69158,37.90842 0,39.6 0.73974,0.73974 4.36996,1.2 9.46482,1.2 7.14772,0 8.40473,-0.26144 9.3,-1.93426 z m 84.25336,32.27118 c -1.805,-0.88965 -4.28,-3.0169 -5.5,-4.72723 -2.16431,-3.03417 -2.22519,-3.88964 -2.507,-35.22379 l -0.28882,-32.11411 -5.53159,-0.57091 c -9.37862,-0.96796 -15.77539,-7.31274 -15.77539,-15.64719 0,-5.66669 2.64222,-10.63677 7.33657,-13.80029 C 240.06852,315.15314 241.36304,315 256,315 c 14.63696,0 15.93148,0.15314 19.04805,2.2534 1.8391,1.23937 4.26815,3.82687 5.39788,5.75 1.98292,3.37549 2.05407,4.93401 2.05407,44.9966 0,40.06259 -0.0711,41.62111 -2.05407,44.9966 -4.36343,7.4278 -13.49047,10.15387 -21.22775,6.34032 z m 74.93009,-0.28752 c -10.007,-3.68739 -18.35175,-11.98133 -22.38225,-22.24596 -1.7638,-4.49196 -2.15236,-8.136 -2.53945,-23.81572 -0.51583,-20.8953 0.48757,-29.83923 4.19857,-37.42424 3.27068,-6.68503 10.59716,-13.92979 17.53663,-17.34104 C 336.2671,315.61449 337.15181,315.5 352,315.5 c 14.84819,0 15.7329,0.11449 21.03823,2.72244 6.92338,3.40334 14.26417,10.65237 17.51429,17.29538 3.42737,7.0053 4.4359,14.39028 4.4359,32.48218 0,18.0919 -1.00853,25.47688 -4.4359,32.48218 -3.258,6.6591 -10.60619,13.90545 -17.51429,17.27155 -5.08757,2.47901 -6.67745,2.72176 -19.53823,2.98314 -11.92588,0.24239 -14.79287,-0.008 -19.35173,-1.68747 z M 361.4433,386.77749 C 362.70005,384.98323 363,381.36509 363,368 c 0,-21.06672 0.0349,-21 -11,-21 -11.03495,0 -11,-0.0667 -11,21 0,21.06672 -0.0349,21 11,21 7.01616,0 8.0584,-0.24529 9.4433,-2.22251 z m -189.52973,-104.702 c -4.63206,-1.45965 -7.77648,-4.16086 -9.86446,-8.47405 C 160.12067,269.61782 160,267.56886 160,238.80811 v -30.56045 l -5.54147,-0.45954 c -16.02319,-1.32877 -21.1095,-19.58286 -8.1352,-29.19617 2.59262,-1.921 4.1516,-2.09195 19.07784,-2.09195 16.10891,0 16.28615,0.0241 19.78595,2.69355 6.8415,5.21827 6.81288,5.00871 6.81288,49.89185 0,38.69937 -0.0814,40.45135 -2.07095,44.56117 -3.20798,6.6268 -11.46892,10.49186 -18.01548,8.42892 z M 243,281.63261 c -15.14304,-3.30331 -26.05665,-14.66839 -28.91054,-30.10648 -1.35076,-7.30695 -1.41877,-35.94441 -0.10442,-43.97077 2.00576,-12.24857 10.22877,-22.95332 21.79689,-28.3753 C 241.15984,176.65944 242.3626,176.5 256,176.5 c 13.6374,0 14.84016,0.15944 20.21807,2.68006 11.56812,5.42198 19.79113,16.12673 21.79689,28.3753 1.31435,8.02636 1.24634,36.66382 -0.10442,43.97077 -3.71417,20.09178 -19.54112,31.68749 -42.8442,31.39006 C 251.45485,282.8701 246.025,282.29249 243,281.63261 Z M 265,249 c 1.84566,-1.84566 2,-3.33333 2,-19.27749 C 267,207.83911 267.08147,208 256,208 c -11.08147,0 -11,-0.16089 -11,21.72251 0,21.14692 0.0675,21.27749 11,21.27749 5.66667,0 7.38095,-0.38095 9,-2 z m 92.6838,32.55119 c -2.0989,-0.74857 -4.73247,-2.19025 -5.85238,-3.20375 C 347.14675,274.10787 347,272.92942 347,239.54966 V 208 h -4.18428 c -13.40052,0 -21.60979,-13.50696 -14.85349,-24.43889 3.80231,-6.15227 8.12979,-7.51325 23.97205,-7.53915 15.66989,-0.0256 20.34671,1.47675 24.27801,7.79899 2.26128,3.63654 2.29135,4.11237 2.60278,41.17905 0.1733,20.625 0.0234,39.90259 -0.33308,42.83909 -0.78977,6.50556 -5.63835,12.55449 -11.33045,14.13551 -4.5293,1.25805 -4.78515,1.24661 -9.46774,-0.42341 z M 361.99265,107.49164 336.5,81.983276 336.23183,105.52342 c -0.17194,15.09261 0.10983,24.24645 0.78518,25.50836 1.00405,1.8761 2.20981,1.96822 25.76082,1.96822 h 24.70746 z", id: "path177" })));
const SvgCross = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "2em", height: "2em", viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M9.91665 9.84888L4.15114 4.08337M9.84882 4.1512L4.08331 9.91671", stroke: "currentColor", strokeWidth: 2, strokeMiterlimit: 10, strokeLinecap: "round", strokeLinejoin: "round" }));
const SendElement = ({ file, onRemove }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$l.sendElementWrapper, children: [
    /* @__PURE__ */ jsx(SvgBinaryFile, { className: styles$l.fileIcon }),
    /* @__PURE__ */ jsxs("div", { className: styles$l.fileData, children: [
      /* @__PURE__ */ jsx("div", { className: styles$l.name, children: file.name }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.size, children: [
        file.size,
        " B"
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      SvgCross,
      {
        className: styles$l.removeBtn,
        onClick: () => onRemove()
      }
    )
  ] });
};
let nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id2, byte) => {
  byte &= 63;
  if (byte < 36) {
    id2 += byte.toString(36);
  } else if (byte < 62) {
    id2 += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id2 += "-";
  } else {
    id2 += "_";
  }
  return id2;
}, "");
function useBootloader(onDownloadSuccess, onDownloadFailure, onUploadSuccess, onUploadFailure, onProgress) {
  const handler = useWsHandler();
  const handleUpload = (board2, file) => {
    const id2 = nanoid();
    handler.exchange("blcu/upload", { board: board2, file }, id2, (res, _2, end) => {
      if (res.percentage == 100) {
        onUploadSuccess();
        end();
      } else if (res.failure) {
        onUploadFailure();
        end();
      } else {
        onProgress(res.percentage);
      }
    });
  };
  const handleDownload = (board2) => {
    const id2 = nanoid();
    handler.exchange("blcu/download", { board: board2 }, id2, (res, _2, end) => {
      if (res.percentage == 100) {
        onDownloadSuccess();
        end();
      } else if (res.failure) {
        onDownloadFailure();
        end();
      } else {
        onProgress(res.percentage);
      }
    });
  };
  return [handleUpload, handleDownload];
}
function useBootloaderState() {
  const [state2, setState] = reactExports.useState({ kind: "empty" });
  const [handleUpload, handleDownload] = useBootloader(
    onDownloadSuccess,
    onDownloadFailure,
    onUploadSuccess,
    onUploadFailure,
    onProgress
  );
  function upload(board2, file) {
    file.arrayBuffer().then((arr) => {
      handleUpload(
        board2,
        window.btoa(String.fromCharCode(...new Uint8Array(arr)))
      );
    });
  }
  function download(board2) {
    handleDownload(board2);
    setState({ kind: "awaiting", progress: 0 });
  }
  function onUploadSuccess() {
    setState({ kind: "upload_success" });
    trasitionToEmpy();
  }
  function onUploadFailure() {
    setState({ kind: "upload_failure" });
    trasitionToEmpy();
  }
  function onDownloadSuccess() {
    setState({ kind: "download_success" });
    trasitionToEmpy();
  }
  function onDownloadFailure() {
    setState({ kind: "download_failure" });
    trasitionToEmpy();
  }
  function trasitionToEmpy() {
    setTimeout(() => {
      setState(() => {
        return { kind: "empty" };
      });
    }, 1e3);
  }
  function onProgress(progress) {
    setState({ kind: "awaiting", progress });
  }
  function removeFile() {
    setState({ kind: "empty" });
  }
  function setFile(file) {
    setState({ kind: "send", file });
  }
  return [state2, upload, download, setFile, removeFile];
}
const awaitElementWrapper = "_awaitElementWrapper_1mas9_1";
const styles$k = {
  awaitElementWrapper
};
const progressBar = "_progressBar_1h33x_1";
const fill = "_fill_1h33x_10";
const styles$j = {
  progressBar,
  fill
};
const ProgressBar = ({ progress }) => {
  return /* @__PURE__ */ jsx("div", { className: styles$j.progressBar, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: styles$j.fill,
      style: { flexBasis: `${progress}%` }
    }
  ) });
};
const LoadingElement = ({ progress }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$k.awaitElementWrapper, children: [
    "Loading",
    /* @__PURE__ */ jsx(ProgressBar, { progress })
  ] });
};
const responseElementWrapper = "_responseElementWrapper_1rrhn_1";
const icon = "_icon_1rrhn_10";
const successIcon = "_successIcon_1rrhn_14";
const failureIcon = "_failureIcon_1rrhn_18";
const styles$i = {
  responseElementWrapper,
  icon,
  successIcon,
  failureIcon
};
var DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext = React.createContext && React.createContext(DefaultContext);
var __assign = globalThis && globalThis.__assign || function() {
  __assign = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
var __rest = globalThis && globalThis.__rest || function(s2, e2) {
  var t2 = {};
  for (var p2 in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
      t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
      if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
        t2[p2[i2]] = s2[p2[i2]];
    }
  return t2;
};
function Tree2Element(tree) {
  return tree && tree.map(function(node, i2) {
    return React.createElement(node.tag, __assign({
      key: i2
    }, node.attr), Tree2Element(node.child));
  });
}
function GenIcon(data) {
  return function(props) {
    return React.createElement(IconBase, __assign({
      attr: __assign({}, data.attr)
    }, props), Tree2Element(data.child));
  };
}
function IconBase(props) {
  var elem = function(conf) {
    var attr = props.attr, size = props.size, title2 = props.title, svgProps = __rest(props, ["attr", "size", "title"]);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className)
      className = conf.className;
    if (props.className)
      className = (className ? className + " " : "") + props.className;
    return React.createElement("svg", __assign({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: __assign(__assign({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title2 && React.createElement("title", null, title2), props.children);
  };
  return IconContext !== void 0 ? React.createElement(IconContext.Consumer, null, function(conf) {
    return elem(conf);
  }) : elem(DefaultContext);
}
function HiCheckCircle(props) {
  return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "child": [{ "tag": "path", "attr": { "fillRule": "evenodd", "d": "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", "clipRule": "evenodd" } }] })(props);
}
function MdCancel(props) {
  return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "fill": "none", "d": "M0 0h24v24H0z" } }, { "tag": "path", "attr": { "d": "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" } }] })(props);
}
const ResponseElement = ({ success }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$i.responseElementWrapper, children: [
    success && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        HiCheckCircle,
        {
          className: `${styles$i.icon} ${styles$i.successIcon}`
        }
      ),
      "Success!"
    ] }),
    !success && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        MdCancel,
        {
          className: `${styles$i.icon} ${styles$i.failureIcon}`
        }
      ),
      "Error!"
    ] })
  ] });
};
const boardControlsWrapper = "_boardControlsWrapper_q7reb_1";
const styles$h = {
  boardControlsWrapper
};
const Controls = ({
  options,
  enableUpload,
  onBoardChange,
  onDownloadClick,
  onUploadClick
}) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$h.boardControlsWrapper, children: [
    /* @__PURE__ */ jsx(
      Dropdown,
      {
        options,
        onChange: onBoardChange
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        label: "Download",
        onClick: onDownloadClick,
        color: "hsl(209, 100%, 60%)"
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        label: "Upload",
        disabled: !enableUpload,
        onClick: () => {
          if (enableUpload)
            onUploadClick();
        }
      }
    )
  ] });
};
const Bootloader = ({ boards: boards2 }) => {
  const [state2, upload, download, setFile, removeFile] = useBootloaderState();
  const [board2, setBoard] = reactExports.useState(boards2[0] ?? "Default");
  return /* @__PURE__ */ jsxs("div", { className: styles$n.bootloader, children: [
    state2.kind == "empty" && /* @__PURE__ */ jsx(DropElement, { onFile: setFile }),
    state2.kind == "send" && /* @__PURE__ */ jsx(
      SendElement,
      {
        file: {
          name: state2.file.name,
          size: state2.file.size
        },
        onRemove: () => removeFile()
      }
    ),
    state2.kind == "awaiting" && /* @__PURE__ */ jsx(LoadingElement, { progress: state2.progress }),
    (state2.kind == "upload_success" || state2.kind == "download_success") && /* @__PURE__ */ jsx(ResponseElement, { success: true }),
    (state2.kind == "upload_failure" || state2.kind == "download_failure") && /* @__PURE__ */ jsx(ResponseElement, { success: false }),
    (state2.kind == "empty" || state2.kind == "send") && /* @__PURE__ */ jsx(
      Controls,
      {
        options: boards2,
        enableUpload: state2.kind == "send",
        onBoardChange: (board22) => setBoard(board22),
        onDownloadClick: () => download(board2),
        onUploadClick: () => {
          if (state2.kind == "send")
            upload(board2, state2.file);
        }
      }
    )
  ] });
};
const BootloaderContainer = () => {
  const [boards2, setBoards] = reactExports.useState();
  const uploadableBoardsPromise = useFetchBack(
    true,
    config.paths.uploadableBoards
  );
  reactExports.useEffect(() => {
    uploadableBoardsPromise.then((value2) => {
      setBoards(value2);
    });
  }, []);
  if (boards2) {
    return /* @__PURE__ */ jsx(Bootloader, { boards: boards2 });
  } else {
    return /* @__PURE__ */ jsx(Fragment, { children: "Fetching boards..." });
  }
};
const ControlPage = () => {
  const sendOrder = useSendOrder();
  const boardOrders = useOrders$1();
  return /* @__PURE__ */ jsxs("div", { className: styles$q.controlPage, children: [
    /* @__PURE__ */ jsx(
      Window,
      {
        title: "Orders",
        height: "fill",
        children: /* @__PURE__ */ jsx(Orders, { orders: getHardcodedOrders(boardOrders) })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: styles$q.column, children: [
      /* @__PURE__ */ jsx(
        Window,
        {
          title: "Messages",
          height: "fill",
          children: /* @__PURE__ */ jsx(MessagesContainer, {})
        }
      ),
      /* @__PURE__ */ jsx(BootloaderContainer, {})
    ] }),
    /* @__PURE__ */ jsx(
      Window,
      {
        title: "Connections",
        height: "fill",
        children: /* @__PURE__ */ jsx(Connections, {})
      }
    ),
    /* @__PURE__ */ jsx(Window, { title: "Logger", children: /* @__PURE__ */ jsx(Logger, {}) }),
    /* @__PURE__ */ jsx(
      EmergencyOrders,
      {
        brake: () => {
          console.log("brake");
          sendOrder(BrakeOrder);
        },
        openContactors: () => {
          console.log("open contactors");
          sendOrder(OpenContactorsOrder);
        },
        reset: () => {
          console.log("reset");
          sendOrder(ResetVehicleOrder);
        },
        stop: () => {
          console.log("stop");
          sendOrder(StopOrder);
        }
      }
    )
  ] });
};
const contentWrapper = "_contentWrapper_qr507_1";
const styles$g = {
  contentWrapper
};
const paginationWrapper = "_paginationWrapper_1jpma_1";
const styles$f = {
  paginationWrapper
};
const paginationItemWrapper = "_paginationItemWrapper_1cwxh_1";
const active$1 = "_active_1cwxh_12";
const styles$e = {
  paginationItemWrapper,
  active: active$1
};
const PaginationItem = ({ isActive, pageNumber, onClick }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${styles$e.paginationItemWrapper} ${isActive ? styles$e.active : ""}`,
      onClick,
      children: pageNumber
    }
  );
};
const Pagination = ({ routes }) => {
  const [activeRoute, setActiveRoute] = reactExports.useState(routes[0]);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    navigate(activeRoute);
  }, [activeRoute]);
  return /* @__PURE__ */ jsx("div", { className: styles$f.paginationWrapper, children: routes.map((route, index2) => {
    return /* @__PURE__ */ jsx(
      PaginationItem,
      {
        pageNumber: index2 + 1,
        isActive: route == activeRoute,
        onClick: () => setActiveRoute(route)
      },
      index2
    );
  }) });
};
const pageWrapper = "_pageWrapper_vygrb_1";
const header = "_header_vygrb_8";
const content = "_content_vygrb_23";
const styles$d = {
  pageWrapper,
  header,
  content
};
const PageWrapper = ({ title: title2, children }) => {
  return /* @__PURE__ */ jsxs("main", { className: styles$d.pageWrapper, children: [
    /* @__PURE__ */ jsx("header", { className: styles$d.header, children: /* @__PURE__ */ jsx("h1", { children: title2 }) }),
    /* @__PURE__ */ jsx("div", { className: styles$d.content, children })
  ] });
};
function useOrders() {
  const dispatch = useDispatch$1();
  const handler = useWsHandler();
  const config2 = useConfig();
  const orderDescriptionPromise = useFetchBack(
    true,
    config2.paths.orderDescription
  );
  reactExports.useEffect(() => {
    const controller = new AbortController();
    const id2 = nanoid();
    orderDescriptionPromise.then((descriptions) => {
      dispatch(setOrders(descriptions));
      handler.subscribe("order/stateOrders", {
        id: id2,
        cb: (stateOrder) => {
          dispatch(updateStateOrders(stateOrder));
        }
      });
    }).catch((reason) => console.error(reason));
    return () => {
      controller.abort();
      handler.unsubscribe("order/stateOrders", id2);
    };
  }, []);
}
const VehiclePage = () => {
  useOrders();
  return /* @__PURE__ */ jsx(PageWrapper, { title: "Vehicle", children: /* @__PURE__ */ jsxs("div", { className: styles$g.contentWrapper, children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Pagination, { routes: ["first", "second"] })
  ] }) });
};
async function fetchFromBackend(path) {
  return fetch(
    `http://${"127.0.0.1"}:${"4000"}${path}`,
    { mode: "cors" }
  );
}
const loadPodData = async () => {
  const state2 = store.getState();
  if (Object.keys(state2.measurements).length == 0) {
    const response = await fetchFromBackend(
      "/backend/podDataStructure"
    );
    const podData = await response.json();
    store.dispatch(initMeasurements(podData));
  }
  return null;
};
const vehicleRoute = {
  path: "/vehicle",
  element: /* @__PURE__ */ jsx(VehiclePage, {}),
  loader: loadPodData,
  children: [
    { path: "", element: /* @__PURE__ */ jsx(Navigate, { to: "first" }) },
    { path: "first", element: /* @__PURE__ */ jsx(BoardsPage, {}) },
    { path: "second", element: /* @__PURE__ */ jsx(ControlPage, {}) }
  ]
};
const camerasPageWrapper = "_camerasPageWrapper_ztv9o_1";
const loading$1 = "_loading_ztv9o_8";
const styles$c = {
  camerasPageWrapper,
  loading: loading$1
};
const camerasWrapper$1 = "_camerasWrapper_1pk19_1";
const secondaryCameras = "_secondaryCameras_1pk19_12";
const mainCameraWrapper = "_mainCameraWrapper_1pk19_19";
const mainCamera = "_mainCamera_1pk19_19";
const styles$b = {
  camerasWrapper: camerasWrapper$1,
  secondaryCameras,
  mainCameraWrapper,
  mainCamera
};
const videoWrapper = "_videoWrapper_1gx5h_1";
const video = "_video_1gx5h_1";
const styles$a = {
  videoWrapper,
  video
};
function useMediaStream(stream) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    } else {
      console.error("video ref is", ref.current);
    }
  }, [stream]);
  return ref;
}
const Camera = ({ stream, ...props }) => {
  const ref = useMediaStream(stream);
  const className = `${styles$a.videoWrapper} ${props.className ?? ""}`;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className,
      children: /* @__PURE__ */ jsx(
        "video",
        {
          ref,
          muted: true,
          loop: true,
          playsInline: true,
          autoPlay: true,
          disablePictureInPicture: true,
          className: `${styles$a.video}`
        }
      )
    }
  );
};
const title = "_title_3hoq3_1";
const name = "_name_3hoq3_8";
const dot = "_dot_3hoq3_14";
const styles$9 = {
  title,
  name,
  dot
};
const CameraTitle = ({ title: title2, ...props }) => {
  const className = `${styles$9.title} ${props.className ?? ""}`;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...props,
      className,
      children: [
        /* @__PURE__ */ jsx("div", { className: styles$9.name, children: title2 }),
        /* @__PURE__ */ jsx("div", { className: styles$9.dot })
      ]
    }
  );
};
const labeledCameraWrapper = "_labeledCameraWrapper_if8es_1";
const titleOverlay = "_titleOverlay_if8es_5";
const camera$2 = "_camera_if8es_11";
const styles$8 = {
  labeledCameraWrapper,
  titleOverlay,
  camera: camera$2
};
const LabeledCamera = ({
  camera: camera2,
  onClick = () => {
  },
  className = ""
}) => {
  return /* @__PURE__ */ jsxs("div", { className: `${styles$8.labeledCameraWrapper} ${className}`, children: [
    /* @__PURE__ */ jsx(
      Camera,
      {
        stream: camera2.stream,
        className: styles$8.camera,
        onClick: () => onClick()
      }
    ),
    /* @__PURE__ */ jsx(
      CameraTitle,
      {
        title: `Cam ${camera2.id}`,
        className: styles$8.titleOverlay
      }
    )
  ] });
};
const secondaryCamerasWrapper = "_secondaryCamerasWrapper_1hqfj_1";
const camera$1 = "_camera_1hqfj_12";
const styles$7 = {
  secondaryCamerasWrapper,
  camera: camera$1
};
const SecondaryCameras = ({
  cameras: cameras2,
  onClick,
  className = ""
}) => {
  return /* @__PURE__ */ jsx("div", { className: `${styles$7.secondaryCamerasWrapper} ${className}`, children: cameras2.map((camera2, index2) => {
    return /* @__PURE__ */ jsx(
      LabeledCamera,
      {
        className: styles$7.camera,
        camera: camera2,
        onClick: () => onClick(index2 + 1)
      },
      index2
    );
  }) });
};
function streamsToCameras(streams) {
  return streams.map((stream, index2) => ({ id: index2, stream }));
}
function useCameras(streams) {
  const [cameras2, setCameras] = reactExports.useState(
    streamsToCameras(streams)
  );
  reactExports.useEffect(() => {
    setCameras(streamsToCameras(streams));
  }, [streams]);
  const setMainCamera = reactExports.useCallback((index2) => {
    setCameras((prevCameras) => {
      const newCameras = [...prevCameras];
      [newCameras[0], newCameras[index2]] = [
        newCameras[index2],
        newCameras[0]
      ];
      return newCameras;
    });
  }, []);
  return { cameras: cameras2, setMainCamera };
}
const Cameras$1 = ({ streams }) => {
  const { cameras: cameras2, setMainCamera } = useCameras(streams);
  return /* @__PURE__ */ jsxs("div", { className: styles$b.camerasWrapper, children: [
    /* @__PURE__ */ jsx("div", { className: styles$b.mainCameraWrapper, children: /* @__PURE__ */ jsx(
      LabeledCamera,
      {
        className: styles$b.mainCamera,
        camera: cameras2[0]
      }
    ) }),
    /* @__PURE__ */ jsx(
      SecondaryCameras,
      {
        cameras: cameras2.slice(1),
        onClick: (index2) => setMainCamera(index2),
        className: styles$b.secondaryCameras
      }
    )
  ] });
};
function useInterval(callback, delay) {
  const savedCallback = reactExports.useRef();
  reactExports.useEffect(() => {
    savedCallback.current = callback;
  });
  reactExports.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let id2 = setInterval(tick, delay);
    return () => clearInterval(id2);
  }, [delay]);
}
const AnimatedEllipsis = () => {
  const [points, setPoints] = reactExports.useState(["."]);
  useInterval(() => {
    setPoints((prevPoints) => {
      return new Array((prevPoints.length + 1) % 4).fill(".");
    });
  }, 800);
  return /* @__PURE__ */ jsx("span", { children: points });
};
const CAMERAS_URL$1 = `ws://${config.cameras.ip}:${config.cameras.port}`;
const CamerasPage = () => {
  const [streams, _state] = useWebRTC(CAMERAS_URL$1);
  if (streams) {
    return /* @__PURE__ */ jsx("div", { className: styles$c.camerasPageWrapper, children: /* @__PURE__ */ jsx(Cameras$1, { streams }) });
  } else {
    return /* @__PURE__ */ jsxs("div", { className: styles$c.loading, children: [
      "Loading cameras ",
      /* @__PURE__ */ jsx(AnimatedEllipsis, {})
    ] });
  }
};
const camerasRoute = {
  path: "/cameras",
  element: /* @__PURE__ */ jsx(CamerasPage, {})
};
const tubePageWrapper = "_tubePageWrapper_ie7cr_1";
const styles$6 = {
  tubePageWrapper
};
const pumpIndicatorWrapper = "_pumpIndicatorWrapper_kvm47_1";
const label = "_label_kvm47_9";
const styles$5 = {
  pumpIndicatorWrapper,
  label
};
const fanIcon = "_fanIcon_fvbdl_9";
const rotating = "_rotating_fvbdl_14";
const rotation = "_rotation_fvbdl_1";
const styles$4 = {
  fanIcon,
  rotating,
  rotation
};
const SvgFan = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "4em", height: "4em", viewBox: "0 0 214 214", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M107 206C161.708 206 206 161.846 206 107.451C206 53.0554 161.708 8.90155 107 8.90155C52.2919 8.90155 8 53.0554 8 107.451C8 161.846 52.2919 206 107 206ZM107 214C166.094 214 214 166.296 214 107.451C214 48.6053 166.094 0.90155 107 0.90155C47.9055 0.90155 0 48.6053 0 107.451C0 166.296 47.9055 214 107 214Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M183.925 91.69C180.516 90.7834 177.063 90.1031 173.608 89.6507C161.655 87.9733 149.61 88.6084 138.475 91.3733C134.43 82.943 127.158 76.3255 118.294 73.061C123.567 64.9941 130.112 58.0133 137.52 52.6193C144.065 47.8152 151.202 44.0985 158.565 41.6954C160.11 41.1977 161.791 41.5596 163.019 42.6472C175.836 53.9782 185.289 69.0731 189.563 86.2057C190.379 89.5604 187.289 92.5514 183.925 91.69Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M86.9807 174.23C94.4345 164.755 99.8416 154.059 103.024 143C103.933 143.09 104.888 143.135 105.842 143.135C114.614 143.135 122.75 140.009 129.022 134.705C133.476 143.316 136.204 152.427 137.249 161.583C138.158 169.652 137.75 177.718 136.158 185.334C135.841 186.831 134.703 188.099 133.295 188.644C124.341 191.953 116.479 192.996 105.797 192.996C97.5249 192.996 89.5249 191.818 81.9803 189.641C78.6618 188.689 77.662 184.564 80.0715 182.117C82.5718 179.579 84.8437 176.95 86.9807 174.23Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M124.658 39.7878C117.204 49.2623 111.796 59.9129 108.615 70.9724C107.706 70.9272 106.797 70.882 105.842 70.882C97.0239 70.882 88.8897 74.054 82.6171 79.3122C78.1628 70.7009 75.4356 61.5903 74.3904 52.4341C73.5267 44.3655 73.935 36.2518 75.5262 28.6829C75.8455 27.1429 76.9814 25.918 78.3894 25.3751C87.3436 22.0656 95.1604 21.0231 105.842 21.0231C114.16 21.0231 122.16 22.1558 129.704 24.3326C133.023 25.2844 134.023 29.455 131.613 31.9019C129.113 34.3953 126.796 37.0231 124.658 39.7878Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M27.761 122.328C31.1703 123.189 34.6233 123.869 38.0327 124.367C49.9864 126.044 62.0308 125.409 73.2114 122.644C77.2559 131.03 84.4828 137.647 93.3466 140.911C88.1194 149.025 81.5289 155.959 74.1659 161.398C67.6667 166.202 60.5304 169.829 53.1674 172.277C51.6215 172.776 49.9412 172.412 48.7131 171.37C35.8505 160.039 26.3969 144.944 22.1242 127.812C21.3076 124.457 24.3972 121.466 27.761 122.328Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M69.6196 107.009C69.6196 109.139 69.8011 111.225 70.1657 113.219C60.531 112.767 51.2134 110.499 42.713 106.873C35.3044 103.609 28.5329 99.2589 22.7593 94.091C21.5781 93.0487 21.032 91.3713 21.3496 89.8297C24.8496 72.4243 33.6207 56.9677 45.9391 45.1386C48.4394 42.7357 52.5747 43.9154 53.4836 47.2232C54.4397 50.6232 55.5756 53.9329 56.8476 57.1502C61.3475 68.3002 67.9375 78.3628 75.9827 86.6125C71.9819 92.459 69.6196 99.4395 69.6196 107.009Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M142.067 107.009C142.067 104.879 141.885 102.793 141.521 100.798C151.155 101.298 160.474 103.518 168.928 107.144C176.382 110.407 183.153 114.759 188.925 119.881C190.106 120.969 190.653 122.601 190.335 124.188C186.835 141.546 178.018 157.003 165.702 168.831C163.201 171.234 159.066 170.01 158.157 166.702C157.201 163.347 156.11 160.083 154.793 156.865C150.293 145.715 143.703 135.653 135.703 127.358C139.704 121.557 142.066 114.576 142.066 107.007L142.067 107.009Z", fill: "currentColor" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M105.89 134.15C120.87 134.15 133.054 121.995 133.054 107.056C133.054 92.1172 120.87 79.9617 105.89 79.9617C90.9107 79.9617 78.7217 92.1172 78.7217 107.056C78.7234 121.995 90.9107 134.15 105.89 134.15Z", fill: "currentColor" }));
const AnimatedFan = ({ rotate }) => {
  return /* @__PURE__ */ jsx(SvgFan, { className: `${styles$4.fanIcon} ${rotate ? styles$4.rotating : ""}` });
};
const bar = "_bar_1ivvh_1";
const active = "_active_1ivvh_8";
const styles$3 = {
  bar,
  active
};
const BooleanBar = ({ isOn }) => {
  return /* @__PURE__ */ jsx("div", { className: `${styles$3.bar} ${isOn ? styles$3.active : ""}` });
};
const PumpIndicator = ({ isOn }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$5.pumpIndicatorWrapper, children: [
    /* @__PURE__ */ jsx("div", { className: styles$5.label, children: "PUMP" }),
    /* @__PURE__ */ jsx(AnimatedFan, { rotate: isOn }),
    /* @__PURE__ */ jsx(BooleanBar, { isOn })
  ] });
};
const tubeDataWrapper = "_tubeDataWrapper_1ozxa_1";
const styles$2 = {
  tubeDataWrapper
};
const defaultMeasurement = {
  id: "test",
  name: "test",
  safeRange: [0, 100],
  type: "int16",
  units: "A",
  value: { average: 10, last: 12 },
  warningRange: [0, 100]
};
const GAUGE_WIDTH = 130;
const TubeData = () => {
  return /* @__PURE__ */ jsxs("div", { className: styles$2.tubeDataWrapper, children: [
    /* @__PURE__ */ jsx(
      GaugeTag,
      {
        className: "",
        measurement: defaultMeasurement,
        min: defaultMeasurement.safeRange[0] ?? 0,
        max: defaultMeasurement.safeRange[1] ?? 100,
        strokeWidth: GAUGE_WIDTH
      }
    ),
    /* @__PURE__ */ jsx(PumpIndicator, { isOn: true }),
    /* @__PURE__ */ jsx(
      GaugeTag,
      {
        className: "",
        measurement: defaultMeasurement,
        min: defaultMeasurement.safeRange[0] ?? 0,
        max: defaultMeasurement.safeRange[1] ?? 100,
        strokeWidth: GAUGE_WIDTH
      }
    )
  ] });
};
const cameras = "_cameras_dkxwt_1";
const loading = "_loading_dkxwt_8";
const styles$1 = {
  cameras,
  loading
};
const camerasWrapper = "_camerasWrapper_10jbu_1";
const camera = "_camera_10jbu_1";
const styles = {
  camerasWrapper,
  camera
};
const Cameras = ({ streams, className }) => {
  return /* @__PURE__ */ jsxs("div", { className: `${styles.camerasWrapper} ${className}`, children: [
    /* @__PURE__ */ jsx(
      Camera,
      {
        stream: streams[0],
        className: styles.camera
      }
    ),
    /* @__PURE__ */ jsx(
      Camera,
      {
        stream: streams[1],
        className: styles.camera
      }
    ),
    /* @__PURE__ */ jsx(
      Camera,
      {
        stream: streams[2],
        className: styles.camera
      }
    )
  ] });
};
const CAMERAS_URL = `ws://${config.cameras.ip}:${config.cameras.port}`;
const CamerasContainer = () => {
  const [streams, _2] = useWebRTC(CAMERAS_URL);
  if (streams) {
    return /* @__PURE__ */ jsx(
      Cameras,
      {
        streams,
        className: styles$1.cameras
      }
    );
  } else {
    return /* @__PURE__ */ jsxs("div", { className: `${styles$1.loading} ${styles$1.cameras}`, children: [
      "Loading cameras",
      /* @__PURE__ */ jsx(AnimatedEllipsis, {})
    ] });
  }
};
const TubePage = () => {
  return /* @__PURE__ */ jsx(PageWrapper, { title: "Tube", children: /* @__PURE__ */ jsxs("div", { className: styles$6.tubePageWrapper, children: [
    /* @__PURE__ */ jsx(CamerasContainer, {}),
    /* @__PURE__ */ jsx(TubeData, {})
  ] }) });
};
const tubeRoute = {
  path: "/tube",
  element: /* @__PURE__ */ jsx(TubePage, {}),
  loader: loadPodData
};
const router = createBrowserRouter([
  {
    path: "/",
    element: /* @__PURE__ */ jsx(App, {}),
    children: [
      { path: "", element: /* @__PURE__ */ jsx(Navigate, { to: "vehicle" }) },
      vehicleRoute,
      camerasRoute,
      tubeRoute
    ]
  }
]);
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsx(
    ConfigProvider,
    {
      devIp: "127.0.0.1",
      prodIp: "127.0.0.1",
      children: /* @__PURE__ */ jsx(GlobalTicker, { fps: 60, children: /* @__PURE__ */ jsx(RouterProvider, { router }) })
    }
  ) }) })
);
