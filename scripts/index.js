var index = (function () {
  'use strict';

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];

    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }

    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");

    return typeof key === "symbol" ? key : String(key);
  }

  function _decorate(decorators, factory, superClass, mixins) {
    var api = _getDecoratorsApi();

    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        api = mixins[i](api);
      }
    }

    var r = factory(function initialize(O) {
      api.initializeInstanceElements(O, decorated.elements);
    }, superClass);
    var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
    api.initializeClassElements(r.F, decorated.elements);
    return api.runClassFinishers(r.F, decorated.finishers);
  }

  function _getDecoratorsApi() {
    _getDecoratorsApi = function () {
      return api;
    };

    var api = {
      elementsDefinitionOrder: [["method"], ["field"]],
      initializeInstanceElements: function (O, elements) {
        ["method", "field"].forEach(function (kind) {
          elements.forEach(function (element) {
            if (element.kind === kind && element.placement === "own") {
              this.defineClassElement(O, element);
            }
          }, this);
        }, this);
      },
      initializeClassElements: function (F, elements) {
        var proto = F.prototype;
        ["method", "field"].forEach(function (kind) {
          elements.forEach(function (element) {
            var placement = element.placement;

            if (element.kind === kind && (placement === "static" || placement === "prototype")) {
              var receiver = placement === "static" ? F : proto;
              this.defineClassElement(receiver, element);
            }
          }, this);
        }, this);
      },
      defineClassElement: function (receiver, element) {
        var descriptor = element.descriptor;

        if (element.kind === "field") {
          var initializer = element.initializer;
          descriptor = {
            enumerable: descriptor.enumerable,
            writable: descriptor.writable,
            configurable: descriptor.configurable,
            value: initializer === void 0 ? void 0 : initializer.call(receiver)
          };
        }

        Object.defineProperty(receiver, element.key, descriptor);
      },
      decorateClass: function (elements, decorators) {
        var newElements = [];
        var finishers = [];
        var placements = {
          static: [],
          prototype: [],
          own: []
        };
        elements.forEach(function (element) {
          this.addElementPlacement(element, placements);
        }, this);
        elements.forEach(function (element) {
          if (!_hasDecorators(element)) return newElements.push(element);
          var elementFinishersExtras = this.decorateElement(element, placements);
          newElements.push(elementFinishersExtras.element);
          newElements.push.apply(newElements, elementFinishersExtras.extras);
          finishers.push.apply(finishers, elementFinishersExtras.finishers);
        }, this);

        if (!decorators) {
          return {
            elements: newElements,
            finishers: finishers
          };
        }

        var result = this.decorateConstructor(newElements, decorators);
        finishers.push.apply(finishers, result.finishers);
        result.finishers = finishers;
        return result;
      },
      addElementPlacement: function (element, placements, silent) {
        var keys = placements[element.placement];

        if (!silent && keys.indexOf(element.key) !== -1) {
          throw new TypeError("Duplicated element (" + element.key + ")");
        }

        keys.push(element.key);
      },
      decorateElement: function (element, placements) {
        var extras = [];
        var finishers = [];

        for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
          var keys = placements[element.placement];
          keys.splice(keys.indexOf(element.key), 1);
          var elementObject = this.fromElementDescriptor(element);
          var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
          element = elementFinisherExtras.element;
          this.addElementPlacement(element, placements);

          if (elementFinisherExtras.finisher) {
            finishers.push(elementFinisherExtras.finisher);
          }

          var newExtras = elementFinisherExtras.extras;

          if (newExtras) {
            for (var j = 0; j < newExtras.length; j++) {
              this.addElementPlacement(newExtras[j], placements);
            }

            extras.push.apply(extras, newExtras);
          }
        }

        return {
          element: element,
          finishers: finishers,
          extras: extras
        };
      },
      decorateConstructor: function (elements, decorators) {
        var finishers = [];

        for (var i = decorators.length - 1; i >= 0; i--) {
          var obj = this.fromClassDescriptor(elements);
          var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

          if (elementsAndFinisher.finisher !== undefined) {
            finishers.push(elementsAndFinisher.finisher);
          }

          if (elementsAndFinisher.elements !== undefined) {
            elements = elementsAndFinisher.elements;

            for (var j = 0; j < elements.length - 1; j++) {
              for (var k = j + 1; k < elements.length; k++) {
                if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                  throw new TypeError("Duplicated element (" + elements[j].key + ")");
                }
              }
            }
          }
        }

        return {
          elements: elements,
          finishers: finishers
        };
      },
      fromElementDescriptor: function (element) {
        var obj = {
          kind: element.kind,
          key: element.key,
          placement: element.placement,
          descriptor: element.descriptor
        };
        var desc = {
          value: "Descriptor",
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        if (element.kind === "field") obj.initializer = element.initializer;
        return obj;
      },
      toElementDescriptors: function (elementObjects) {
        if (elementObjects === undefined) return;
        return _toArray(elementObjects).map(function (elementObject) {
          var element = this.toElementDescriptor(elementObject);
          this.disallowProperty(elementObject, "finisher", "An element descriptor");
          this.disallowProperty(elementObject, "extras", "An element descriptor");
          return element;
        }, this);
      },
      toElementDescriptor: function (elementObject) {
        var kind = String(elementObject.kind);

        if (kind !== "method" && kind !== "field") {
          throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
        }

        var key = _toPropertyKey(elementObject.key);

        var placement = String(elementObject.placement);

        if (placement !== "static" && placement !== "prototype" && placement !== "own") {
          throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
        }

        var descriptor = elementObject.descriptor;
        this.disallowProperty(elementObject, "elements", "An element descriptor");
        var element = {
          kind: kind,
          key: key,
          placement: placement,
          descriptor: Object.assign({}, descriptor)
        };

        if (kind !== "field") {
          this.disallowProperty(elementObject, "initializer", "A method descriptor");
        } else {
          this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
          this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
          this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
          element.initializer = elementObject.initializer;
        }

        return element;
      },
      toElementFinisherExtras: function (elementObject) {
        var element = this.toElementDescriptor(elementObject);

        var finisher = _optionalCallableProperty(elementObject, "finisher");

        var extras = this.toElementDescriptors(elementObject.extras);
        return {
          element: element,
          finisher: finisher,
          extras: extras
        };
      },
      fromClassDescriptor: function (elements) {
        var obj = {
          kind: "class",
          elements: elements.map(this.fromElementDescriptor, this)
        };
        var desc = {
          value: "Descriptor",
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        return obj;
      },
      toClassDescriptor: function (obj) {
        var kind = String(obj.kind);

        if (kind !== "class") {
          throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
        }

        this.disallowProperty(obj, "key", "A class descriptor");
        this.disallowProperty(obj, "placement", "A class descriptor");
        this.disallowProperty(obj, "descriptor", "A class descriptor");
        this.disallowProperty(obj, "initializer", "A class descriptor");
        this.disallowProperty(obj, "extras", "A class descriptor");

        var finisher = _optionalCallableProperty(obj, "finisher");

        var elements = this.toElementDescriptors(obj.elements);
        return {
          elements: elements,
          finisher: finisher
        };
      },
      runClassFinishers: function (constructor, finishers) {
        for (var i = 0; i < finishers.length; i++) {
          var newConstructor = (0, finishers[i])(constructor);

          if (newConstructor !== undefined) {
            if (typeof newConstructor !== "function") {
              throw new TypeError("Finishers must return a constructor.");
            }

            constructor = newConstructor;
          }
        }

        return constructor;
      },
      disallowProperty: function (obj, name, objectType) {
        if (obj[name] !== undefined) {
          throw new TypeError(objectType + " can't have a ." + name + " property.");
        }
      }
    };
    return api;
  }

  function _createElementDescriptor(def) {
    var key = _toPropertyKey(def.key);

    var descriptor;

    if (def.kind === "method") {
      descriptor = {
        value: def.value,
        writable: true,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "get") {
      descriptor = {
        get: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "set") {
      descriptor = {
        set: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === "field") {
      descriptor = {
        configurable: true,
        writable: true,
        enumerable: true
      };
    }

    var element = {
      kind: def.kind === "field" ? "field" : "method",
      key: key,
      placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
      descriptor: descriptor
    };
    if (def.decorators) element.decorators = def.decorators;
    if (def.kind === "field") element.initializer = def.value;
    return element;
  }

  function _coalesceGetterSetter(element, other) {
    if (element.descriptor.get !== undefined) {
      other.descriptor.get = element.descriptor.get;
    } else {
      other.descriptor.set = element.descriptor.set;
    }
  }

  function _coalesceClassElements(elements) {
    var newElements = [];

    var isSameElement = function (other) {
      return other.kind === "method" && other.key === element.key && other.placement === element.placement;
    };

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var other;

      if (element.kind === "method" && (other = newElements.find(isSameElement))) {
        if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
          if (_hasDecorators(element) || _hasDecorators(other)) {
            throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
          }

          other.descriptor = element.descriptor;
        } else {
          if (_hasDecorators(element)) {
            if (_hasDecorators(other)) {
              throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
            }

            other.decorators = element.decorators;
          }

          _coalesceGetterSetter(element, other);
        }
      } else {
        newElements.push(element);
      }
    }

    return newElements;
  }

  function _hasDecorators(element) {
    return element.decorators && element.decorators.length;
  }

  function _isDataDescriptor(desc) {
    return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
  }

  function _optionalCallableProperty(obj, name) {
    var value = obj[name];

    if (value !== undefined && typeof value !== "function") {
      throw new TypeError("Expected '" + name + "' to be a function");
    }

    return value;
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  const isDirective = (o) => {
      return typeof o === 'function' && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill = window.customElements !== undefined &&
      window.customElements.polyfillWrapFlushCallback !==
          undefined;
  /**
   * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
   * `container`.
   */
  const removeNodes = (container, start, end = null) => {
      while (start !== end) {
          const n = start.nextSibling;
          container.removeChild(start);
          start = n;
      }
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */
  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */
  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */
  const boundAttributeSuffix = '$lit$';
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */
  class Template {
      constructor(result, element) {
          this.parts = [];
          this.element = element;
          const nodesToRemove = [];
          const stack = [];
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
          const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
          // Keeps track of the last index associated with a part. We try to delete
          // unnecessary nodes, but we never want to associate two different parts
          // to the same index. They must have a constant node between.
          let lastPartIndex = 0;
          let index = -1;
          let partIndex = 0;
          const { strings, values: { length } } = result;
          while (partIndex < length) {
              const node = walker.nextNode();
              if (node === null) {
                  // We've exhausted the content inside a nested template element.
                  // Because we still have parts (the outer for-loop), we know:
                  // - There is a template in the stack
                  // - The walker will find a nextNode outside the template
                  walker.currentNode = stack.pop();
                  continue;
              }
              index++;
              if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                  if (node.hasAttributes()) {
                      const attributes = node.attributes;
                      const { length } = attributes;
                      // Per
                      // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                      // attributes are not guaranteed to be returned in document order.
                      // In particular, Edge/IE can return them out of order, so we cannot
                      // assume a correspondence between part index and attribute index.
                      let count = 0;
                      for (let i = 0; i < length; i++) {
                          if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                              count++;
                          }
                      }
                      while (count-- > 0) {
                          // Get the template literal section leading up to the first
                          // expression in this attribute
                          const stringForPart = strings[partIndex];
                          // Find the attribute name
                          const name = lastAttributeNameRegex.exec(stringForPart)[2];
                          // Find the corresponding attribute
                          // All bound attributes have had a suffix added in
                          // TemplateResult#getHTML to opt out of special attribute
                          // handling. To look up the attribute value we also need to add
                          // the suffix.
                          const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                          const attributeValue = node.getAttribute(attributeLookupName);
                          node.removeAttribute(attributeLookupName);
                          const statics = attributeValue.split(markerRegex);
                          this.parts.push({ type: 'attribute', index, name, strings: statics });
                          partIndex += statics.length - 1;
                      }
                  }
                  if (node.tagName === 'TEMPLATE') {
                      stack.push(node);
                      walker.currentNode = node.content;
                  }
              }
              else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                  const data = node.data;
                  if (data.indexOf(marker) >= 0) {
                      const parent = node.parentNode;
                      const strings = data.split(markerRegex);
                      const lastIndex = strings.length - 1;
                      // Generate a new text node for each literal section
                      // These nodes are also used as the markers for node parts
                      for (let i = 0; i < lastIndex; i++) {
                          let insert;
                          let s = strings[i];
                          if (s === '') {
                              insert = createMarker();
                          }
                          else {
                              const match = lastAttributeNameRegex.exec(s);
                              if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                  s = s.slice(0, match.index) + match[1] +
                                      match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                              }
                              insert = document.createTextNode(s);
                          }
                          parent.insertBefore(insert, node);
                          this.parts.push({ type: 'node', index: ++index });
                      }
                      // If there's no text, we must insert a comment to mark our place.
                      // Else, we can trust it will stick around after cloning.
                      if (strings[lastIndex] === '') {
                          parent.insertBefore(createMarker(), node);
                          nodesToRemove.push(node);
                      }
                      else {
                          node.data = strings[lastIndex];
                      }
                      // We have a part for each match found
                      partIndex += lastIndex;
                  }
              }
              else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                  if (node.data === marker) {
                      const parent = node.parentNode;
                      // Add a new marker node to be the startNode of the Part if any of
                      // the following are true:
                      //  * We don't have a previousSibling
                      //  * The previousSibling is already the start of a previous part
                      if (node.previousSibling === null || index === lastPartIndex) {
                          index++;
                          parent.insertBefore(createMarker(), node);
                      }
                      lastPartIndex = index;
                      this.parts.push({ type: 'node', index });
                      // If we don't have a nextSibling, keep this node so we have an end.
                      // Else, we can remove it to save future costs.
                      if (node.nextSibling === null) {
                          node.data = '';
                      }
                      else {
                          nodesToRemove.push(node);
                          index--;
                      }
                      partIndex++;
                  }
                  else {
                      let i = -1;
                      while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                          // Comment node has a binding marker inside, make an inactive part
                          // The binding won't work, but subsequent bindings will
                          // TODO (justinfagnani): consider whether it's even worth it to
                          // make bindings in comments work
                          this.parts.push({ type: 'node', index: -1 });
                          partIndex++;
                      }
                  }
              }
          }
          // Remove text binding nodes after the walk to not disturb the TreeWalker
          for (const n of nodesToRemove) {
              n.parentNode.removeChild(n);
          }
      }
  }
  const endsWith = (str, suffix) => {
      const index = str.length - suffix.length;
      return index >= 0 && str.slice(index) === suffix;
  };
  const isTemplatePartActive = (part) => part.index !== -1;
  // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.
  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#elements-attributes
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-characters
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
   * space character except " ".
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */
  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */
  class TemplateInstance {
      constructor(template, processor, options) {
          this.__parts = [];
          this.template = template;
          this.processor = processor;
          this.options = options;
      }
      update(values) {
          let i = 0;
          for (const part of this.__parts) {
              if (part !== undefined) {
                  part.setValue(values[i]);
              }
              i++;
          }
          for (const part of this.__parts) {
              if (part !== undefined) {
                  part.commit();
              }
          }
      }
      _clone() {
          // There are a number of steps in the lifecycle of a template instance's
          // DOM fragment:
          //  1. Clone - create the instance fragment
          //  2. Adopt - adopt into the main document
          //  3. Process - find part markers and create parts
          //  4. Upgrade - upgrade custom elements
          //  5. Update - set node, attribute, property, etc., values
          //  6. Connect - connect to the document. Optional and outside of this
          //     method.
          //
          // We have a few constraints on the ordering of these steps:
          //  * We need to upgrade before updating, so that property values will pass
          //    through any property setters.
          //  * We would like to process before upgrading so that we're sure that the
          //    cloned fragment is inert and not disturbed by self-modifying DOM.
          //  * We want custom elements to upgrade even in disconnected fragments.
          //
          // Given these constraints, with full custom elements support we would
          // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
          //
          // But Safari dooes not implement CustomElementRegistry#upgrade, so we
          // can not implement that order and still have upgrade-before-update and
          // upgrade disconnected fragments. So we instead sacrifice the
          // process-before-upgrade constraint, since in Custom Elements v1 elements
          // must not modify their light DOM in the constructor. We still have issues
          // when co-existing with CEv0 elements like Polymer 1, and with polyfills
          // that don't strictly adhere to the no-modification rule because shadow
          // DOM, which may be created in the constructor, is emulated by being placed
          // in the light DOM.
          //
          // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
          // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
          // in one step.
          //
          // The Custom Elements v1 polyfill supports upgrade(), so the order when
          // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
          // Connect.
          const fragment = isCEPolyfill ?
              this.template.element.content.cloneNode(true) :
              document.importNode(this.template.element.content, true);
          const stack = [];
          const parts = this.template.parts;
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
          const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
          let partIndex = 0;
          let nodeIndex = 0;
          let part;
          let node = walker.nextNode();
          // Loop through all the nodes and parts of a template
          while (partIndex < parts.length) {
              part = parts[partIndex];
              if (!isTemplatePartActive(part)) {
                  this.__parts.push(undefined);
                  partIndex++;
                  continue;
              }
              // Progress the tree walker until we find our next part's node.
              // Note that multiple parts may share the same node (attribute parts
              // on a single element), so this loop may not run at all.
              while (nodeIndex < part.index) {
                  nodeIndex++;
                  if (node.nodeName === 'TEMPLATE') {
                      stack.push(node);
                      walker.currentNode = node.content;
                  }
                  if ((node = walker.nextNode()) === null) {
                      // We've exhausted the content inside a nested template element.
                      // Because we still have parts (the outer for-loop), we know:
                      // - There is a template in the stack
                      // - The walker will find a nextNode outside the template
                      walker.currentNode = stack.pop();
                      node = walker.nextNode();
                  }
              }
              // We've arrived at our part's node.
              if (part.type === 'node') {
                  const part = this.processor.handleTextExpression(this.options);
                  part.insertAfterNode(node.previousSibling);
                  this.__parts.push(part);
              }
              else {
                  this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
              }
              partIndex++;
          }
          if (isCEPolyfill) {
              document.adoptNode(fragment);
              customElements.upgrade(fragment);
          }
          return fragment;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const commentMarker = ` ${marker} `;
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */
  class TemplateResult {
      constructor(strings, values, type, processor) {
          this.strings = strings;
          this.values = values;
          this.type = type;
          this.processor = processor;
      }
      /**
       * Returns a string of HTML used to create a `<template>` element.
       */
      getHTML() {
          const l = this.strings.length - 1;
          let html = '';
          let isCommentBinding = false;
          for (let i = 0; i < l; i++) {
              const s = this.strings[i];
              // For each binding we want to determine the kind of marker to insert
              // into the template source before it's parsed by the browser's HTML
              // parser. The marker type is based on whether the expression is in an
              // attribute, text, or comment poisition.
              //   * For node-position bindings we insert a comment with the marker
              //     sentinel as its text content, like <!--{{lit-guid}}-->.
              //   * For attribute bindings we insert just the marker sentinel for the
              //     first binding, so that we support unquoted attribute bindings.
              //     Subsequent bindings can use a comment marker because multi-binding
              //     attributes must be quoted.
              //   * For comment bindings we insert just the marker sentinel so we don't
              //     close the comment.
              //
              // The following code scans the template source, but is *not* an HTML
              // parser. We don't need to track the tree structure of the HTML, only
              // whether a binding is inside a comment, and if not, if it appears to be
              // the first binding in an attribute.
              const commentOpen = s.lastIndexOf('<!--');
              // We're in comment position if we have a comment open with no following
              // comment close. Because <-- can appear in an attribute value there can
              // be false positives.
              isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                  s.indexOf('-->', commentOpen + 1) === -1;
              // Check to see if we have an attribute-like sequence preceeding the
              // expression. This can match "name=value" like structures in text,
              // comments, and attribute values, so there can be false-positives.
              const attributeMatch = lastAttributeNameRegex.exec(s);
              if (attributeMatch === null) {
                  // We're only in this branch if we don't have a attribute-like
                  // preceeding sequence. For comments, this guards against unusual
                  // attribute values like <div foo="<!--${'bar'}">. Cases like
                  // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                  // below.
                  html += s + (isCommentBinding ? commentMarker : nodeMarker);
              }
              else {
                  // For attributes we use just a marker sentinel, and also append a
                  // $lit$ suffix to the name to opt-out of attribute-specific parsing
                  // that IE and Edge do for style and certain SVG attributes.
                  html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                      attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                      marker;
              }
          }
          html += this.strings[l];
          return html;
      }
      getTemplateElement() {
          const template = document.createElement('template');
          template.innerHTML = this.getHTML();
          return template;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = (value) => {
      return (value === null ||
          !(typeof value === 'object' || typeof value === 'function'));
  };
  const isIterable = (value) => {
      return Array.isArray(value) ||
          // tslint:disable-next-line:no-any
          !!(value && value[Symbol.iterator]);
  };
  /**
   * Writes attribute values to the DOM for a group of AttributeParts bound to a
   * single attibute. The value is only set once even if there are multiple parts
   * for an attribute.
   */
  class AttributeCommitter {
      constructor(element, name, strings) {
          this.dirty = true;
          this.element = element;
          this.name = name;
          this.strings = strings;
          this.parts = [];
          for (let i = 0; i < strings.length - 1; i++) {
              this.parts[i] = this._createPart();
          }
      }
      /**
       * Creates a single part. Override this to create a differnt type of part.
       */
      _createPart() {
          return new AttributePart(this);
      }
      _getValue() {
          const strings = this.strings;
          const l = strings.length - 1;
          let text = '';
          for (let i = 0; i < l; i++) {
              text += strings[i];
              const part = this.parts[i];
              if (part !== undefined) {
                  const v = part.value;
                  if (isPrimitive(v) || !isIterable(v)) {
                      text += typeof v === 'string' ? v : String(v);
                  }
                  else {
                      for (const t of v) {
                          text += typeof t === 'string' ? t : String(t);
                      }
                  }
              }
          }
          text += strings[l];
          return text;
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              this.element.setAttribute(this.name, this._getValue());
          }
      }
  }
  /**
   * A Part that controls all or part of an attribute value.
   */
  class AttributePart {
      constructor(committer) {
          this.value = undefined;
          this.committer = committer;
      }
      setValue(value) {
          if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
              this.value = value;
              // If the value is a not a directive, dirty the committer so that it'll
              // call setAttribute. If the value is a directive, it'll dirty the
              // committer if it calls setValue().
              if (!isDirective(value)) {
                  this.committer.dirty = true;
              }
          }
      }
      commit() {
          while (isDirective(this.value)) {
              const directive = this.value;
              this.value = noChange;
              directive(this);
          }
          if (this.value === noChange) {
              return;
          }
          this.committer.commit();
      }
  }
  /**
   * A Part that controls a location within a Node tree. Like a Range, NodePart
   * has start and end locations and can set and update the Nodes between those
   * locations.
   *
   * NodeParts support several value types: primitives, Nodes, TemplateResults,
   * as well as arrays and iterables of those types.
   */
  class NodePart {
      constructor(options) {
          this.value = undefined;
          this.__pendingValue = undefined;
          this.options = options;
      }
      /**
       * Appends this part into a container.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendInto(container) {
          this.startNode = container.appendChild(createMarker());
          this.endNode = container.appendChild(createMarker());
      }
      /**
       * Inserts this part after the `ref` node (between `ref` and `ref`'s next
       * sibling). Both `ref` and its next sibling must be static, unchanging nodes
       * such as those that appear in a literal section of a template.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterNode(ref) {
          this.startNode = ref;
          this.endNode = ref.nextSibling;
      }
      /**
       * Appends this part into a parent part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendIntoPart(part) {
          part.__insert(this.startNode = createMarker());
          part.__insert(this.endNode = createMarker());
      }
      /**
       * Inserts this part after the `ref` part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterPart(ref) {
          ref.__insert(this.startNode = createMarker());
          this.endNode = ref.endNode;
          ref.endNode = this.startNode;
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          const value = this.__pendingValue;
          if (value === noChange) {
              return;
          }
          if (isPrimitive(value)) {
              if (value !== this.value) {
                  this.__commitText(value);
              }
          }
          else if (value instanceof TemplateResult) {
              this.__commitTemplateResult(value);
          }
          else if (value instanceof Node) {
              this.__commitNode(value);
          }
          else if (isIterable(value)) {
              this.__commitIterable(value);
          }
          else if (value === nothing) {
              this.value = nothing;
              this.clear();
          }
          else {
              // Fallback, will render the string representation
              this.__commitText(value);
          }
      }
      __insert(node) {
          this.endNode.parentNode.insertBefore(node, this.endNode);
      }
      __commitNode(value) {
          if (this.value === value) {
              return;
          }
          this.clear();
          this.__insert(value);
          this.value = value;
      }
      __commitText(value) {
          const node = this.startNode.nextSibling;
          value = value == null ? '' : value;
          // If `value` isn't already a string, we explicitly convert it here in case
          // it can't be implicitly converted - i.e. it's a symbol.
          const valueAsString = typeof value === 'string' ? value : String(value);
          if (node === this.endNode.previousSibling &&
              node.nodeType === 3 /* Node.TEXT_NODE */) {
              // If we only have a single text node between the markers, we can just
              // set its value, rather than replacing it.
              // TODO(justinfagnani): Can we just check if this.value is primitive?
              node.data = valueAsString;
          }
          else {
              this.__commitNode(document.createTextNode(valueAsString));
          }
          this.value = value;
      }
      __commitTemplateResult(value) {
          const template = this.options.templateFactory(value);
          if (this.value instanceof TemplateInstance &&
              this.value.template === template) {
              this.value.update(value.values);
          }
          else {
              // Make sure we propagate the template processor from the TemplateResult
              // so that we use its syntax extension, etc. The template factory comes
              // from the render function options so that it can control template
              // caching and preprocessing.
              const instance = new TemplateInstance(template, value.processor, this.options);
              const fragment = instance._clone();
              instance.update(value.values);
              this.__commitNode(fragment);
              this.value = instance;
          }
      }
      __commitIterable(value) {
          // For an Iterable, we create a new InstancePart per item, then set its
          // value to the item. This is a little bit of overhead for every item in
          // an Iterable, but it lets us recurse easily and efficiently update Arrays
          // of TemplateResults that will be commonly returned from expressions like:
          // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
          // If _value is an array, then the previous render was of an
          // iterable and _value will contain the NodeParts from the previous
          // render. If _value is not an array, clear this part and make a new
          // array for NodeParts.
          if (!Array.isArray(this.value)) {
              this.value = [];
              this.clear();
          }
          // Lets us keep track of how many items we stamped so we can clear leftover
          // items from a previous render
          const itemParts = this.value;
          let partIndex = 0;
          let itemPart;
          for (const item of value) {
              // Try to reuse an existing part
              itemPart = itemParts[partIndex];
              // If no existing part, create a new one
              if (itemPart === undefined) {
                  itemPart = new NodePart(this.options);
                  itemParts.push(itemPart);
                  if (partIndex === 0) {
                      itemPart.appendIntoPart(this);
                  }
                  else {
                      itemPart.insertAfterPart(itemParts[partIndex - 1]);
                  }
              }
              itemPart.setValue(item);
              itemPart.commit();
              partIndex++;
          }
          if (partIndex < itemParts.length) {
              // Truncate the parts array so _value reflects the current state
              itemParts.length = partIndex;
              this.clear(itemPart && itemPart.endNode);
          }
      }
      clear(startNode = this.startNode) {
          removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
      }
  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */
  class BooleanAttributePart {
      constructor(element, name, strings) {
          this.value = undefined;
          this.__pendingValue = undefined;
          if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
              throw new Error('Boolean attributes can only contain a single expression');
          }
          this.element = element;
          this.name = name;
          this.strings = strings;
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          if (this.__pendingValue === noChange) {
              return;
          }
          const value = !!this.__pendingValue;
          if (this.value !== value) {
              if (value) {
                  this.element.setAttribute(this.name, '');
              }
              else {
                  this.element.removeAttribute(this.name);
              }
              this.value = value;
          }
          this.__pendingValue = noChange;
      }
  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */
  class PropertyCommitter extends AttributeCommitter {
      constructor(element, name, strings) {
          super(element, name, strings);
          this.single =
              (strings.length === 2 && strings[0] === '' && strings[1] === '');
      }
      _createPart() {
          return new PropertyPart(this);
      }
      _getValue() {
          if (this.single) {
              return this.parts[0].value;
          }
          return super._getValue();
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              // tslint:disable-next-line:no-any
              this.element[this.name] = this._getValue();
          }
      }
  }
  class PropertyPart extends AttributePart {
  }
  // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the thrid
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.
  let eventOptionsSupported = false;
  try {
      const options = {
          get capture() {
              eventOptionsSupported = true;
              return false;
          }
      };
      // tslint:disable-next-line:no-any
      window.addEventListener('test', options, options);
      // tslint:disable-next-line:no-any
      window.removeEventListener('test', options, options);
  }
  catch (_e) {
  }
  class EventPart {
      constructor(element, eventName, eventContext) {
          this.value = undefined;
          this.__pendingValue = undefined;
          this.element = element;
          this.eventName = eventName;
          this.eventContext = eventContext;
          this.__boundHandleEvent = (e) => this.handleEvent(e);
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          if (this.__pendingValue === noChange) {
              return;
          }
          const newListener = this.__pendingValue;
          const oldListener = this.value;
          const shouldRemoveListener = newListener == null ||
              oldListener != null &&
                  (newListener.capture !== oldListener.capture ||
                      newListener.once !== oldListener.once ||
                      newListener.passive !== oldListener.passive);
          const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
          if (shouldRemoveListener) {
              this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
          }
          if (shouldAddListener) {
              this.__options = getOptions(newListener);
              this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
          }
          this.value = newListener;
          this.__pendingValue = noChange;
      }
      handleEvent(event) {
          if (typeof this.value === 'function') {
              this.value.call(this.eventContext || this.element, event);
          }
          else {
              this.value.handleEvent(event);
          }
      }
  }
  // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.
  const getOptions = (o) => o &&
      (eventOptionsSupported ?
          { capture: o.capture, passive: o.passive, once: o.once } :
          o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Creates Parts when a template is instantiated.
   */
  class DefaultTemplateProcessor {
      /**
       * Create parts for an attribute-position binding, given the event, attribute
       * name, and string literals.
       *
       * @param element The element containing the binding
       * @param name  The attribute name
       * @param strings The string literals. There are always at least two strings,
       *   event for fully-controlled bindings with a single expression.
       */
      handleAttributeExpressions(element, name, strings, options) {
          const prefix = name[0];
          if (prefix === '.') {
              const committer = new PropertyCommitter(element, name.slice(1), strings);
              return committer.parts;
          }
          if (prefix === '@') {
              return [new EventPart(element, name.slice(1), options.eventContext)];
          }
          if (prefix === '?') {
              return [new BooleanAttributePart(element, name.slice(1), strings)];
          }
          const committer = new AttributeCommitter(element, name, strings);
          return committer.parts;
      }
      /**
       * Create parts for a text-position binding.
       * @param templateFactory
       */
      handleTextExpression(options) {
          return new NodePart(options);
      }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */
  function templateFactory(result) {
      let templateCache = templateCaches.get(result.type);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(result.type, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      // If the TemplateStringsArray is new, generate a key from the strings
      // This key is shared between all templates with identical content
      const key = result.strings.join(marker);
      // Check if we already have a Template for this key
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          // If we have not seen this key before, create a new Template
          template = new Template(result, result.getTemplateElement());
          // Cache the Template for this key
          templateCache.keyString.set(key, template);
      }
      // Cache all future queries for this TemplateStringsArray
      templateCache.stringsArray.set(result.strings, template);
      return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template result or other value to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result Any value renderable by NodePart - typically a TemplateResult
   *     created by evaluating a template tag like `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */
  const render = (result, container, options) => {
      let part = parts.get(container);
      if (part === undefined) {
          removeNodes(container, container.firstChild);
          parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
          part.appendInto(container);
      }
      part.setValue(result);
      part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */
  const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */
  function removeNodesFromTemplate(template, nodesToRemove) {
      const { element: { content }, parts } = template;
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let part = parts[partIndex];
      let nodeIndex = -1;
      let removeCount = 0;
      const nodesToRemoveInTemplate = [];
      let currentRemovingNode = null;
      while (walker.nextNode()) {
          nodeIndex++;
          const node = walker.currentNode;
          // End removal if stepped past the removing node
          if (node.previousSibling === currentRemovingNode) {
              currentRemovingNode = null;
          }
          // A node to remove was found in the template
          if (nodesToRemove.has(node)) {
              nodesToRemoveInTemplate.push(node);
              // Track node we're removing
              if (currentRemovingNode === null) {
                  currentRemovingNode = node;
              }
          }
          // When removing, increment count by which to adjust subsequent part indices
          if (currentRemovingNode !== null) {
              removeCount++;
          }
          while (part !== undefined && part.index === nodeIndex) {
              // If part is in a removed node deactivate it by setting index to -1 or
              // adjust the index as needed.
              part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
              // go to the next active part.
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
              part = parts[partIndex];
          }
      }
      nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
  }
  const countNodes = (node) => {
      let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
      const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
      while (walker.nextNode()) {
          count++;
      }
      return count;
  };
  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
      for (let i = startIndex + 1; i < parts.length; i++) {
          const part = parts[i];
          if (isTemplatePartActive(part)) {
              return i;
          }
      }
      return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */
  function insertNodeIntoTemplate(template, node, refNode = null) {
      const { element: { content }, parts } = template;
      // If there's no refNode, then put node at end of template.
      // No part indices need to be shifted in this case.
      if (refNode === null || refNode === undefined) {
          content.appendChild(node);
          return;
      }
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let insertCount = 0;
      let walkerIndex = -1;
      while (walker.nextNode()) {
          walkerIndex++;
          const walkerNode = walker.currentNode;
          if (walkerNode === refNode) {
              insertCount = countNodes(node);
              refNode.parentNode.insertBefore(node, refNode);
          }
          while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
              // If we've inserted the node, simply adjust all subsequent parts
              if (insertCount > 0) {
                  while (partIndex !== -1) {
                      parts[partIndex].index += insertCount;
                      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                  }
                  return;
              }
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Get a key to lookup in `templateCaches`.
  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
  let compatibleShadyCSSVersion = true;
  if (typeof window.ShadyCSS === 'undefined') {
      compatibleShadyCSSVersion = false;
  }
  else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
      console.warn(`Incompatible ShadyCSS version detected. ` +
          `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
          `@webcomponents/shadycss@1.3.1.`);
      compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */
  const shadyTemplateFactory = (scopeName) => (result) => {
      const cacheKey = getTemplateCacheKey(result.type, scopeName);
      let templateCache = templateCaches.get(cacheKey);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(cacheKey, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      const key = result.strings.join(marker);
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          const element = result.getTemplateElement();
          if (compatibleShadyCSSVersion) {
              window.ShadyCSS.prepareTemplateDom(element, scopeName);
          }
          template = new Template(result, element);
          templateCache.keyString.set(key, template);
      }
      templateCache.stringsArray.set(result.strings, template);
      return template;
  };
  const TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */
  const removeStylesFromLitTemplates = (scopeName) => {
      TEMPLATE_TYPES.forEach((type) => {
          const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
          if (templates !== undefined) {
              templates.keyString.forEach((template) => {
                  const { element: { content } } = template;
                  // IE 11 doesn't support the iterable param Set constructor
                  const styles = new Set();
                  Array.from(content.querySelectorAll('style')).forEach((s) => {
                      styles.add(s);
                  });
                  removeNodesFromTemplate(template, styles);
              });
          }
      });
  };
  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */
  const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
      shadyRenderSet.add(scopeName);
      // If `renderedDOM` is stamped from a Template, then we need to edit that
      // Template's underlying template element. Otherwise, we create one here
      // to give to ShadyCSS, which still requires one while scoping.
      const templateElement = !!template ? template.element : document.createElement('template');
      // Move styles out of rendered DOM and store.
      const styles = renderedDOM.querySelectorAll('style');
      const { length } = styles;
      // If there are no styles, skip unnecessary work
      if (length === 0) {
          // Ensure prepareTemplateStyles is called to support adding
          // styles via `prepareAdoptedCssText` since that requires that
          // `prepareTemplateStyles` is called.
          //
          // ShadyCSS will only update styles containing @apply in the template
          // given to `prepareTemplateStyles`. If no lit Template was given,
          // ShadyCSS will not be able to update uses of @apply in any relevant
          // template. However, this is not a problem because we only create the
          // template for the purpose of supporting `prepareAdoptedCssText`,
          // which doesn't support @apply at all.
          window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
          return;
      }
      const condensedStyle = document.createElement('style');
      // Collect styles into a single style. This helps us make sure ShadyCSS
      // manipulations will not prevent us from being able to fix up template
      // part indices.
      // NOTE: collecting styles is inefficient for browsers but ShadyCSS
      // currently does this anyway. When it does not, this should be changed.
      for (let i = 0; i < length; i++) {
          const style = styles[i];
          style.parentNode.removeChild(style);
          condensedStyle.textContent += style.textContent;
      }
      // Remove styles from nested templates in this scope.
      removeStylesFromLitTemplates(scopeName);
      // And then put the condensed style into the "root" template passed in as
      // `template`.
      const content = templateElement.content;
      if (!!template) {
          insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
      }
      else {
          content.insertBefore(condensedStyle, content.firstChild);
      }
      // Note, it's important that ShadyCSS gets the template that `lit-html`
      // will actually render so that it can update the style inside when
      // needed (e.g. @apply native Shadow DOM case).
      window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
      const style = content.querySelector('style');
      if (window.ShadyCSS.nativeShadow && style !== null) {
          // When in native Shadow DOM, ensure the style created by ShadyCSS is
          // included in initially rendered output (`renderedDOM`).
          renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
      }
      else if (!!template) {
          // When no style is left in the template, parts will be broken as a
          // result. To fix this, we put back the style node ShadyCSS removed
          // and then tell lit to remove that node from the template.
          // There can be no style in the template in 2 cases (1) when Shady DOM
          // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
          // is in use ShadyCSS removes the style if it contains no content.
          // NOTE, ShadyCSS creates its own style so we can safely add/remove
          // `condensedStyle` here.
          content.insertBefore(condensedStyle, content.firstChild);
          const removes = new Set();
          removes.add(condensedStyle);
          removeNodesFromTemplate(template, removes);
      }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document `<head>`.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in `<style>` elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (for example
   * `Promise.resolve()`), or be deferred until the first time the element's
   * `connectedCallback` runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (for example, in a `:host` rule) or via a rule that directly
   * matches an element with a shadowRoot. In other words, instead of flowing from
   * parent to child as do native css custom properties, shimmed custom properties
   * flow only from shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */
  const render$1 = (result, container, options) => {
      if (!options || typeof options !== 'object' || !options.scopeName) {
          throw new Error('The `scopeName` option is required.');
      }
      const scopeName = options.scopeName;
      const hasRendered = parts.has(container);
      const needsScoping = compatibleShadyCSSVersion &&
          container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
          !!container.host;
      // Handle first render to a scope specially...
      const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
      // On first scope render, render into a fragment; this cannot be a single
      // fragment that is reused since nested renders can occur synchronously.
      const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
      render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
      // When performing first scope render,
      // (1) We've rendered into a fragment so that there's a chance to
      // `prepareTemplateStyles` before sub-elements hit the DOM
      // (which might cause them to render based on a common pattern of
      // rendering in a custom element's `connectedCallback`);
      // (2) Scope the template with ShadyCSS one time only for this scope.
      // (3) Render the fragment into the container and make sure the
      // container knows its `part` is the one we just rendered. This ensures
      // DOM will be re-used on subsequent renders.
      if (firstScopeRender) {
          const part = parts.get(renderContainer);
          parts.delete(renderContainer);
          // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
          // that should apply to `renderContainer` even if the rendered value is
          // not a TemplateInstance. However, it will only insert scoped styles
          // into the document if `prepareTemplateStyles` has already been called
          // for the given scope name.
          const template = part.value instanceof TemplateInstance ?
              part.value.template :
              undefined;
          prepareTemplateStyles(scopeName, renderContainer, template);
          removeNodes(container, container.firstChild);
          container.appendChild(renderContainer);
          parts.set(container, part);
      }
      // After elements have hit the DOM, update styling if this is the
      // initial render to this container.
      // This is needed whenever dynamic changes are made so it would be
      // safest to do every render; however, this would regress performance
      // so we leave it up to the user to call `ShadyCSS.styleElement`
      // for dynamic changes.
      if (!hasRendered && needsScoping) {
          window.ShadyCSS.styleElement(container.host);
      }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var _a;
  /**
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
   * replaced at compile time by the munged name for object[property]. We cannot
   * alias this function, so we have to use a small shim that has the same
   * behavior when not compiling.
   */
  window.JSCompiler_renameProperty =
      (prop, _obj) => prop;
  const defaultConverter = {
      toAttribute(value, type) {
          switch (type) {
              case Boolean:
                  return value ? '' : null;
              case Object:
              case Array:
                  // if the value is `null` or `undefined` pass this through
                  // to allow removing/no change behavior.
                  return value == null ? value : JSON.stringify(value);
          }
          return value;
      },
      fromAttribute(value, type) {
          switch (type) {
              case Boolean:
                  return value !== null;
              case Number:
                  return value === null ? null : Number(value);
              case Object:
              case Array:
                  return JSON.parse(value);
          }
          return value;
      }
  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */
  const notEqual = (value, old) => {
      // This ensures (old==NaN, value==NaN) always returns false
      return old !== value && (old === old || value === value);
  };
  const defaultPropertyDeclaration = {
      attribute: true,
      type: String,
      converter: defaultConverter,
      reflect: false,
      hasChanged: notEqual
  };
  const microtaskPromise = Promise.resolve(true);
  const STATE_HAS_UPDATED = 1;
  const STATE_UPDATE_REQUESTED = 1 << 2;
  const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
  const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
  const STATE_HAS_CONNECTED = 1 << 5;
  /**
   * The Closure JS Compiler doesn't currently have good support for static
   * property semantics where "this" is dynamic (e.g.
   * https://github.com/google/closure-compiler/issues/3177 and others) so we use
   * this hack to bypass any rewriting by the compiler.
   */
  const finalized = 'finalized';
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   */
  class UpdatingElement extends HTMLElement {
      constructor() {
          super();
          this._updateState = 0;
          this._instanceProperties = undefined;
          this._updatePromise = microtaskPromise;
          this._hasConnectedResolver = undefined;
          /**
           * Map with keys for any properties that have changed since the last
           * update cycle with previous values.
           */
          this._changedProperties = new Map();
          /**
           * Map with keys of properties that should be reflected when updated.
           */
          this._reflectingProperties = undefined;
          this.initialize();
      }
      /**
       * Returns a list of attributes corresponding to the registered properties.
       * @nocollapse
       */
      static get observedAttributes() {
          // note: piggy backing on this to ensure we're finalized.
          this.finalize();
          const attributes = [];
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          this._classProperties.forEach((v, p) => {
              const attr = this._attributeNameForProperty(p, v);
              if (attr !== undefined) {
                  this._attributeToPropertyMap.set(attr, p);
                  attributes.push(attr);
              }
          });
          return attributes;
      }
      /**
       * Ensures the private `_classProperties` property metadata is created.
       * In addition to `finalize` this is also called in `createProperty` to
       * ensure the `@property` decorator can add property metadata.
       */
      /** @nocollapse */
      static _ensureClassProperties() {
          // ensure private storage for property declarations.
          if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
              this._classProperties = new Map();
              // NOTE: Workaround IE11 not supporting Map constructor argument.
              const superProperties = Object.getPrototypeOf(this)._classProperties;
              if (superProperties !== undefined) {
                  superProperties.forEach((v, k) => this._classProperties.set(k, v));
              }
          }
      }
      /**
       * Creates a property accessor on the element prototype if one does not exist.
       * The property setter calls the property's `hasChanged` property option
       * or uses a strict identity check to determine whether or not to request
       * an update.
       * @nocollapse
       */
      static createProperty(name, options = defaultPropertyDeclaration) {
          // Note, since this can be called by the `@property` decorator which
          // is called before `finalize`, we ensure storage exists for property
          // metadata.
          this._ensureClassProperties();
          this._classProperties.set(name, options);
          // Do not generate an accessor if the prototype already has one, since
          // it would be lost otherwise and that would never be the user's intention;
          // Instead, we expect users to call `requestUpdate` themselves from
          // user-defined accessors. Note that if the super has an accessor we will
          // still overwrite it
          if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
              return;
          }
          const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
          Object.defineProperty(this.prototype, name, {
              // tslint:disable-next-line:no-any no symbol in index
              get() {
                  return this[key];
              },
              set(value) {
                  const oldValue = this[name];
                  this[key] = value;
                  this._requestUpdate(name, oldValue);
              },
              configurable: true,
              enumerable: true
          });
      }
      /**
       * Creates property accessors for registered properties and ensures
       * any superclasses are also finalized.
       * @nocollapse
       */
      static finalize() {
          // finalize any superclasses
          const superCtor = Object.getPrototypeOf(this);
          if (!superCtor.hasOwnProperty(finalized)) {
              superCtor.finalize();
          }
          this[finalized] = true;
          this._ensureClassProperties();
          // initialize Map populated in observedAttributes
          this._attributeToPropertyMap = new Map();
          // make any properties
          // Note, only process "own" properties since this element will inherit
          // any properties defined on the superClass, and finalization ensures
          // the entire prototype chain is finalized.
          if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
              const props = this.properties;
              // support symbols in properties (IE11 does not support this)
              const propKeys = [
                  ...Object.getOwnPropertyNames(props),
                  ...(typeof Object.getOwnPropertySymbols === 'function') ?
                      Object.getOwnPropertySymbols(props) :
                      []
              ];
              // This for/of is ok because propKeys is an array
              for (const p of propKeys) {
                  // note, use of `any` is due to TypeSript lack of support for symbol in
                  // index types
                  // tslint:disable-next-line:no-any no symbol in index
                  this.createProperty(p, props[p]);
              }
          }
      }
      /**
       * Returns the property name for the given attribute `name`.
       * @nocollapse
       */
      static _attributeNameForProperty(name, options) {
          const attribute = options.attribute;
          return attribute === false ?
              undefined :
              (typeof attribute === 'string' ?
                  attribute :
                  (typeof name === 'string' ? name.toLowerCase() : undefined));
      }
      /**
       * Returns true if a property should request an update.
       * Called when a property value is set and uses the `hasChanged`
       * option for the property if present or a strict identity check.
       * @nocollapse
       */
      static _valueHasChanged(value, old, hasChanged = notEqual) {
          return hasChanged(value, old);
      }
      /**
       * Returns the property value for the given attribute value.
       * Called via the `attributeChangedCallback` and uses the property's
       * `converter` or `converter.fromAttribute` property option.
       * @nocollapse
       */
      static _propertyValueFromAttribute(value, options) {
          const type = options.type;
          const converter = options.converter || defaultConverter;
          const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
          return fromAttribute ? fromAttribute(value, type) : value;
      }
      /**
       * Returns the attribute value for the given property value. If this
       * returns undefined, the property will *not* be reflected to an attribute.
       * If this returns null, the attribute will be removed, otherwise the
       * attribute will be set to the value.
       * This uses the property's `reflect` and `type.toAttribute` property options.
       * @nocollapse
       */
      static _propertyValueToAttribute(value, options) {
          if (options.reflect === undefined) {
              return;
          }
          const type = options.type;
          const converter = options.converter;
          const toAttribute = converter && converter.toAttribute ||
              defaultConverter.toAttribute;
          return toAttribute(value, type);
      }
      /**
       * Performs element initialization. By default captures any pre-set values for
       * registered properties.
       */
      initialize() {
          this._saveInstanceProperties();
          // ensures first update will be caught by an early access of
          // `updateComplete`
          this._requestUpdate();
      }
      /**
       * Fixes any properties set on the instance before upgrade time.
       * Otherwise these would shadow the accessor and break these properties.
       * The properties are stored in a Map which is played back after the
       * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
       * (<=41), properties created for native platform properties like (`id` or
       * `name`) may not have default values set in the element constructor. On
       * these browsers native properties appear on instances and therefore their
       * default value will overwrite any element default (e.g. if the element sets
       * this.id = 'id' in the constructor, the 'id' will become '' since this is
       * the native platform default).
       */
      _saveInstanceProperties() {
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          this.constructor
              ._classProperties.forEach((_v, p) => {
              if (this.hasOwnProperty(p)) {
                  const value = this[p];
                  delete this[p];
                  if (!this._instanceProperties) {
                      this._instanceProperties = new Map();
                  }
                  this._instanceProperties.set(p, value);
              }
          });
      }
      /**
       * Applies previously saved instance properties.
       */
      _applyInstanceProperties() {
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          // tslint:disable-next-line:no-any
          this._instanceProperties.forEach((v, p) => this[p] = v);
          this._instanceProperties = undefined;
      }
      connectedCallback() {
          this._updateState = this._updateState | STATE_HAS_CONNECTED;
          // Ensure first connection completes an update. Updates cannot complete
          // before connection and if one is pending connection the
          // `_hasConnectionResolver` will exist. If so, resolve it to complete the
          // update, otherwise requestUpdate.
          if (this._hasConnectedResolver) {
              this._hasConnectedResolver();
              this._hasConnectedResolver = undefined;
          }
      }
      /**
       * Allows for `super.disconnectedCallback()` in extensions while
       * reserving the possibility of making non-breaking feature additions
       * when disconnecting at some point in the future.
       */
      disconnectedCallback() {
      }
      /**
       * Synchronizes property values when attributes change.
       */
      attributeChangedCallback(name, old, value) {
          if (old !== value) {
              this._attributeToProperty(name, value);
          }
      }
      _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
          const ctor = this.constructor;
          const attr = ctor._attributeNameForProperty(name, options);
          if (attr !== undefined) {
              const attrValue = ctor._propertyValueToAttribute(value, options);
              // an undefined value does not change the attribute.
              if (attrValue === undefined) {
                  return;
              }
              // Track if the property is being reflected to avoid
              // setting the property again via `attributeChangedCallback`. Note:
              // 1. this takes advantage of the fact that the callback is synchronous.
              // 2. will behave incorrectly if multiple attributes are in the reaction
              // stack at time of calling. However, since we process attributes
              // in `update` this should not be possible (or an extreme corner case
              // that we'd like to discover).
              // mark state reflecting
              this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
              if (attrValue == null) {
                  this.removeAttribute(attr);
              }
              else {
                  this.setAttribute(attr, attrValue);
              }
              // mark state not reflecting
              this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
          }
      }
      _attributeToProperty(name, value) {
          // Use tracking info to avoid deserializing attribute value if it was
          // just set from a property setter.
          if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
              return;
          }
          const ctor = this.constructor;
          const propName = ctor._attributeToPropertyMap.get(name);
          if (propName !== undefined) {
              const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
              // mark state reflecting
              this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
              this[propName] =
                  // tslint:disable-next-line:no-any
                  ctor._propertyValueFromAttribute(value, options);
              // mark state not reflecting
              this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
          }
      }
      /**
       * This private version of `requestUpdate` does not access or return the
       * `updateComplete` promise. This promise can be overridden and is therefore
       * not free to access.
       */
      _requestUpdate(name, oldValue) {
          let shouldRequestUpdate = true;
          // If we have a property key, perform property update steps.
          if (name !== undefined) {
              const ctor = this.constructor;
              const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
              if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                  if (!this._changedProperties.has(name)) {
                      this._changedProperties.set(name, oldValue);
                  }
                  // Add to reflecting properties set.
                  // Note, it's important that every change has a chance to add the
                  // property to `_reflectingProperties`. This ensures setting
                  // attribute + property reflects correctly.
                  if (options.reflect === true &&
                      !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                      if (this._reflectingProperties === undefined) {
                          this._reflectingProperties = new Map();
                      }
                      this._reflectingProperties.set(name, options);
                  }
              }
              else {
                  // Abort the request if the property should not be considered changed.
                  shouldRequestUpdate = false;
              }
          }
          if (!this._hasRequestedUpdate && shouldRequestUpdate) {
              this._enqueueUpdate();
          }
      }
      /**
       * Requests an update which is processed asynchronously. This should
       * be called when an element should update based on some state not triggered
       * by setting a property. In this case, pass no arguments. It should also be
       * called when manually implementing a property setter. In this case, pass the
       * property `name` and `oldValue` to ensure that any configured property
       * options are honored. Returns the `updateComplete` Promise which is resolved
       * when the update completes.
       *
       * @param name {PropertyKey} (optional) name of requesting property
       * @param oldValue {any} (optional) old value of requesting property
       * @returns {Promise} A Promise that is resolved when the update completes.
       */
      requestUpdate(name, oldValue) {
          this._requestUpdate(name, oldValue);
          return this.updateComplete;
      }
      /**
       * Sets up the element to asynchronously update.
       */
      async _enqueueUpdate() {
          // Mark state updating...
          this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
          let resolve;
          let reject;
          const previousUpdatePromise = this._updatePromise;
          this._updatePromise = new Promise((res, rej) => {
              resolve = res;
              reject = rej;
          });
          try {
              // Ensure any previous update has resolved before updating.
              // This `await` also ensures that property changes are batched.
              await previousUpdatePromise;
          }
          catch (e) {
              // Ignore any previous errors. We only care that the previous cycle is
              // done. Any error should have been handled in the previous update.
          }
          // Make sure the element has connected before updating.
          if (!this._hasConnected) {
              await new Promise((res) => this._hasConnectedResolver = res);
          }
          try {
              const result = this.performUpdate();
              // If `performUpdate` returns a Promise, we await it. This is done to
              // enable coordinating updates with a scheduler. Note, the result is
              // checked to avoid delaying an additional microtask unless we need to.
              if (result != null) {
                  await result;
              }
          }
          catch (e) {
              reject(e);
          }
          resolve(!this._hasRequestedUpdate);
      }
      get _hasConnected() {
          return (this._updateState & STATE_HAS_CONNECTED);
      }
      get _hasRequestedUpdate() {
          return (this._updateState & STATE_UPDATE_REQUESTED);
      }
      get hasUpdated() {
          return (this._updateState & STATE_HAS_UPDATED);
      }
      /**
       * Performs an element update. Note, if an exception is thrown during the
       * update, `firstUpdated` and `updated` will not be called.
       *
       * You can override this method to change the timing of updates. If this
       * method is overridden, `super.performUpdate()` must be called.
       *
       * For instance, to schedule updates to occur just before the next frame:
       *
       * ```
       * protected async performUpdate(): Promise<unknown> {
       *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
       *   super.performUpdate();
       * }
       * ```
       */
      performUpdate() {
          // Mixin instance properties once, if they exist.
          if (this._instanceProperties) {
              this._applyInstanceProperties();
          }
          let shouldUpdate = false;
          const changedProperties = this._changedProperties;
          try {
              shouldUpdate = this.shouldUpdate(changedProperties);
              if (shouldUpdate) {
                  this.update(changedProperties);
              }
          }
          catch (e) {
              // Prevent `firstUpdated` and `updated` from running when there's an
              // update exception.
              shouldUpdate = false;
              throw e;
          }
          finally {
              // Ensure element can accept additional updates after an exception.
              this._markUpdated();
          }
          if (shouldUpdate) {
              if (!(this._updateState & STATE_HAS_UPDATED)) {
                  this._updateState = this._updateState | STATE_HAS_UPDATED;
                  this.firstUpdated(changedProperties);
              }
              this.updated(changedProperties);
          }
      }
      _markUpdated() {
          this._changedProperties = new Map();
          this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
      }
      /**
       * Returns a Promise that resolves when the element has completed updating.
       * The Promise value is a boolean that is `true` if the element completed the
       * update without triggering another update. The Promise result is `false` if
       * a property was set inside `updated()`. If the Promise is rejected, an
       * exception was thrown during the update.
       *
       * To await additional asynchronous work, override the `_getUpdateComplete`
       * method. For example, it is sometimes useful to await a rendered element
       * before fulfilling this Promise. To do this, first await
       * `super._getUpdateComplete()`, then any subsequent state.
       *
       * @returns {Promise} The Promise returns a boolean that indicates if the
       * update resolved without triggering another update.
       */
      get updateComplete() {
          return this._getUpdateComplete();
      }
      /**
       * Override point for the `updateComplete` promise.
       *
       * It is not safe to override the `updateComplete` getter directly due to a
       * limitation in TypeScript which means it is not possible to call a
       * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
       * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
       * This method should be overridden instead. For example:
       *
       *   class MyElement extends LitElement {
       *     async _getUpdateComplete() {
       *       await super._getUpdateComplete();
       *       await this._myChild.updateComplete;
       *     }
       *   }
       */
      _getUpdateComplete() {
          return this._updatePromise;
      }
      /**
       * Controls whether or not `update` should be called when the element requests
       * an update. By default, this method always returns `true`, but this can be
       * customized to control when to update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      shouldUpdate(_changedProperties) {
          return true;
      }
      /**
       * Updates the element. This method reflects property values to attributes.
       * It can be overridden to render and keep updated element DOM.
       * Setting properties inside this method will *not* trigger
       * another update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      update(_changedProperties) {
          if (this._reflectingProperties !== undefined &&
              this._reflectingProperties.size > 0) {
              // Use forEach so this works even if for/of loops are compiled to for
              // loops expecting arrays
              this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
              this._reflectingProperties = undefined;
          }
      }
      /**
       * Invoked whenever the element is updated. Implement to perform
       * post-updating tasks via DOM APIs, for example, focusing an element.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      updated(_changedProperties) {
      }
      /**
       * Invoked when the element is first updated. Implement to perform one time
       * work on the element after update.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      firstUpdated(_changedProperties) {
      }
  }
  _a = finalized;
  /**
   * Marks class as having finished creating properties.
   */
  UpdatingElement[_a] = true;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const legacyCustomElement = (tagName, clazz) => {
      window.customElements.define(tagName, clazz);
      // Cast as any because TS doesn't recognize the return type as being a
      // subtype of the decorated class when clazz is typed as
      // `Constructor<HTMLElement>` for some reason.
      // `Constructor<HTMLElement>` is helpful to make sure the decorator is
      // applied to elements however.
      // tslint:disable-next-line:no-any
      return clazz;
  };
  const standardCustomElement = (tagName, descriptor) => {
      const { kind, elements } = descriptor;
      return {
          kind,
          elements,
          // This callback is called once the class is otherwise fully defined
          finisher(clazz) {
              window.customElements.define(tagName, clazz);
          }
      };
  };
  /**
   * Class decorator factory that defines the decorated class as a custom element.
   *
   * @param tagName the name of the custom element to define
   */
  const customElement = (tagName) => (classOrDescriptor) => (typeof classOrDescriptor === 'function') ?
      legacyCustomElement(tagName, classOrDescriptor) :
      standardCustomElement(tagName, classOrDescriptor);
  const standardProperty = (options, element) => {
      // When decorating an accessor, pass it through and add property metadata.
      // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
      // stomp over the user's accessor.
      if (element.kind === 'method' && element.descriptor &&
          !('value' in element.descriptor)) {
          return Object.assign({}, element, { finisher(clazz) {
                  clazz.createProperty(element.key, options);
              } });
      }
      else {
          // createProperty() takes care of defining the property, but we still
          // must return some kind of descriptor, so return a descriptor for an
          // unused prototype field. The finisher calls createProperty().
          return {
              kind: 'field',
              key: Symbol(),
              placement: 'own',
              descriptor: {},
              // When @babel/plugin-proposal-decorators implements initializers,
              // do this instead of the initializer below. See:
              // https://github.com/babel/babel/issues/9260 extras: [
              //   {
              //     kind: 'initializer',
              //     placement: 'own',
              //     initializer: descriptor.initializer,
              //   }
              // ],
              initializer() {
                  if (typeof element.initializer === 'function') {
                      this[element.key] = element.initializer.call(this);
                  }
              },
              finisher(clazz) {
                  clazz.createProperty(element.key, options);
              }
          };
      }
  };
  const legacyProperty = (options, proto, name) => {
      proto.constructor
          .createProperty(name, options);
  };
  /**
   * A property decorator which creates a LitElement property which reflects a
   * corresponding attribute value. A `PropertyDeclaration` may optionally be
   * supplied to configure property features.
   *
   * @ExportDecoratedItems
   */
  function property(options) {
      // tslint:disable-next-line:no-any decorator
      return (protoOrDescriptor, name) => (name !== undefined) ?
          legacyProperty(options, protoOrDescriptor, name) :
          standardProperty(options, protoOrDescriptor);
  }

  /**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  */
  const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
      ('replace' in CSSStyleSheet.prototype);
  const constructionToken = Symbol();
  class CSSResult {
      constructor(cssText, safeToken) {
          if (safeToken !== constructionToken) {
              throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
          }
          this.cssText = cssText;
      }
      // Note, this is a getter so that it's lazy. In practice, this means
      // stylesheets are not created until the first element instance is made.
      get styleSheet() {
          if (this._styleSheet === undefined) {
              // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
              // is constructable.
              if (supportsAdoptingStyleSheets) {
                  this._styleSheet = new CSSStyleSheet();
                  this._styleSheet.replaceSync(this.cssText);
              }
              else {
                  this._styleSheet = null;
              }
          }
          return this._styleSheet;
      }
      toString() {
          return this.cssText;
      }
  }
  const textFromCSSResult = (value) => {
      if (value instanceof CSSResult) {
          return value.cssText;
      }
      else if (typeof value === 'number') {
          return value;
      }
      else {
          throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
      }
  };
  /**
   * Template tag which which can be used with LitElement's `style` property to
   * set element styles. For security reasons, only literal string values may be
   * used. To incorporate non-literal values `unsafeCSS` may be used inside a
   * template string part.
   */
  const css = (strings, ...values) => {
      const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
      return new CSSResult(cssText, constructionToken);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time
  (window['litElementVersions'] || (window['litElementVersions'] = []))
      .push('2.2.1');
  /**
   * Minimal implementation of Array.prototype.flat
   * @param arr the array to flatten
   * @param result the accumlated result
   */
  function arrayFlat(styles, result = []) {
      for (let i = 0, length = styles.length; i < length; i++) {
          const value = styles[i];
          if (Array.isArray(value)) {
              arrayFlat(value, result);
          }
          else {
              result.push(value);
          }
      }
      return result;
  }
  /** Deeply flattens styles array. Uses native flat if available. */
  const flattenStyles = (styles) => styles.flat ? styles.flat(Infinity) : arrayFlat(styles);
  class LitElement extends UpdatingElement {
      /** @nocollapse */
      static finalize() {
          // The Closure JS Compiler does not always preserve the correct "this"
          // when calling static super methods (b/137460243), so explicitly bind.
          super.finalize.call(this);
          // Prepare styling that is stamped at first render time. Styling
          // is built from user provided `styles` or is inherited from the superclass.
          this._styles =
              this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ?
                  this._getUniqueStyles() :
                  this._styles || [];
      }
      /** @nocollapse */
      static _getUniqueStyles() {
          // Take care not to call `this.styles` multiple times since this generates
          // new CSSResults each time.
          // TODO(sorvell): Since we do not cache CSSResults by input, any
          // shared styles will generate new stylesheet objects, which is wasteful.
          // This should be addressed when a browser ships constructable
          // stylesheets.
          const userStyles = this.styles;
          const styles = [];
          if (Array.isArray(userStyles)) {
              const flatStyles = flattenStyles(userStyles);
              // As a performance optimization to avoid duplicated styling that can
              // occur especially when composing via subclassing, de-duplicate styles
              // preserving the last item in the list. The last item is kept to
              // try to preserve cascade order with the assumption that it's most
              // important that last added styles override previous styles.
              const styleSet = flatStyles.reduceRight((set, s) => {
                  set.add(s);
                  // on IE set.add does not return the set.
                  return set;
              }, new Set());
              // Array.from does not work on Set in IE
              styleSet.forEach((v) => styles.unshift(v));
          }
          else if (userStyles) {
              styles.push(userStyles);
          }
          return styles;
      }
      /**
       * Performs element initialization. By default this calls `createRenderRoot`
       * to create the element `renderRoot` node and captures any pre-set values for
       * registered properties.
       */
      initialize() {
          super.initialize();
          this.renderRoot =
              this.createRenderRoot();
          // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
          // element's getRootNode(). While this could be done, we're choosing not to
          // support this now since it would require different logic around de-duping.
          if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
              this.adoptStyles();
          }
      }
      /**
       * Returns the node into which the element should render and by default
       * creates and returns an open shadowRoot. Implement to customize where the
       * element's DOM is rendered. For example, to render into the element's
       * childNodes, return `this`.
       * @returns {Element|DocumentFragment} Returns a node into which to render.
       */
      createRenderRoot() {
          return this.attachShadow({ mode: 'open' });
      }
      /**
       * Applies styling to the element shadowRoot using the `static get styles`
       * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
       * available and will fallback otherwise. When Shadow DOM is polyfilled,
       * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
       * is available but `adoptedStyleSheets` is not, styles are appended to the
       * end of the `shadowRoot` to [mimic spec
       * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
       */
      adoptStyles() {
          const styles = this.constructor._styles;
          if (styles.length === 0) {
              return;
          }
          // There are three separate cases here based on Shadow DOM support.
          // (1) shadowRoot polyfilled: use ShadyCSS
          // (2) shadowRoot.adoptedStyleSheets available: use it.
          // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
          // rendering
          if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
              window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
          }
          else if (supportsAdoptingStyleSheets) {
              this.renderRoot.adoptedStyleSheets =
                  styles.map((s) => s.styleSheet);
          }
          else {
              // This must be done after rendering so the actual style insertion is done
              // in `update`.
              this._needsShimAdoptedStyleSheets = true;
          }
      }
      connectedCallback() {
          super.connectedCallback();
          // Note, first update/render handles styleElement so we only call this if
          // connected after first update.
          if (this.hasUpdated && window.ShadyCSS !== undefined) {
              window.ShadyCSS.styleElement(this);
          }
      }
      /**
       * Updates the element. This method reflects property values to attributes
       * and calls `render` to render DOM via lit-html. Setting properties inside
       * this method will *not* trigger another update.
       * * @param _changedProperties Map of changed properties with old values
       */
      update(changedProperties) {
          super.update(changedProperties);
          const templateResult = this.render();
          if (templateResult instanceof TemplateResult) {
              this.constructor
                  .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
          }
          // When native Shadow DOM is used but adoptedStyles are not supported,
          // insert styling after rendering to ensure adoptedStyles have highest
          // priority.
          if (this._needsShimAdoptedStyleSheets) {
              this._needsShimAdoptedStyleSheets = false;
              this.constructor._styles.forEach((s) => {
                  const style = document.createElement('style');
                  style.textContent = s.cssText;
                  this.renderRoot.appendChild(style);
              });
          }
      }
      /**
       * Invoked on each update to perform rendering tasks. This method must return
       * a lit-html TemplateResult. Setting properties inside this method will *not*
       * trigger the element to update.
       */
      render() {
      }
  }
  /**
   * Ensure this class is marked as `finalized` as an optimization ensuring
   * it will not needlessly try to `finalize`.
   *
   * Note this property name is a string to prevent breaking Closure JS Compiler
   * optimizations. See updating-element.ts for more information.
   */
  LitElement['finalized'] = true;
  /**
   * Render method used to render the lit-html TemplateResult to the element's
   * DOM.
   * @param {TemplateResult} Template to render.
   * @param {Element|DocumentFragment} Node into which to render.
   * @param {String} Element name.
   * @nocollapse
   */
  LitElement.render = render$1;

  let PageContent = _decorate([customElement('page-content')], function (_initialize, _LitElement) {
    class PageContent extends _LitElement {
      constructor(...args) {
        super(...args);

        _initialize(this);
      }

    }

    return {
      F: PageContent,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
      /** Component styling **/
      :host {
        display: block;
        margin: 0 auto;
        padding: 0 12px;
        max-width: 1024px;
      }

      @media only screen and (max-width: 900px) {
        :host {
          padding: 0;
        }
      }
    `;
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          return html`
      <slot></slot>
    `;
        }
      }]
    };
  }, LitElement);

  let SharedNavigation = _decorate([customElement('shared-nav')], function (_initialize, _LitElement) {
    class SharedNavigation extends _LitElement {
      constructor() {
        super();

        _initialize(this);

        this._mobileActive = false;
      }

    }

    return {
      F: SharedNavigation,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
            /** Colors and variables **/
            :host {
            }
            @media (prefers-color-scheme: dark) {
                :host {
                }
            }

            /** Component styling **/
            :host {
            }

            :host .nav-container a {
                color: var(--link-font-color);
                text-decoration: none;
            }
            :host .nav-container a:hover {
                color: var(--link-font-color-hover);
            }

            :host .nav-container {
                display: flex;
                gap: 8px;
                margin-top: 8px;
                background: var(--g-background-color);
            }

            :host .nav-item {
                font-size: 16px;
                font-weight: 600;
                padding: 10px 16px;
            }
            :host .nav-item:hover {
                background-color: var(--g-background-extra2-color);
            }

            :host .nav-toggler {
                display: none;
                background-image: url('hamburger.svg');
                background-repeat: no-repeat;
                background-position: center;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                width: 48px;
                height: 48px;
            }
            :host .nav-toggler:hover {
                background-color: var(--g-background-extra2-color);
            }

            @media only screen and (max-width: 640px) {
                :host .nav-container {
                    display: none;
                    flex-direction: column;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    padding-top: 40px;
                    padding-bottom: 12px;
                }
                :host .nav-container.nav-active {
                    display: flex;
                }

                :host .nav-toggler {
                    display: block;
                }
            }
        `;
        }
      }, {
        kind: "method",
        key: "_onMobileToggled",
        value: function _onMobileToggled() {
          this._mobileActive = !this._mobileActive;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const containerClassList = ["nav-container"];

          if (this._mobileActive) {
            containerClassList.push("nav-active");
          }

          return html`
            <div class="${containerClassList.join(" ")}">
                <a href="https://godotengine.github.io/doc-status/" target="_blank" class="nav-item">
                    ClassRef Status
                </a>
                <a href="https://godot-proposals-viewer.github.io/" target="_blank" class="nav-item">
                    Proposal Viewer
                </a>
                <a href="https://godotengine.github.io/godot-prs-by-file/" target="_blank" class="nav-item">
                    PRs by File
                </a>
                <a href="https://godotengine.github.io/godot-commit-artifacts/" target="_blank" class="nav-item">
                    Commit Artifacts
                </a>
                <a href="https://godotengine.github.io/godot-interactive-changelog/" target="_blank" class="nav-item">
                    Interactive Changelog
                </a>
            </div>
            <div
                class="nav-toggler"
                @click="${this._onMobileToggled}"
            ></div>
        `;
        }
      }]
    };
  }, LitElement);

  let IndexHeader = _decorate([customElement('gr-index-entry')], function (_initialize, _LitElement) {
    class IndexHeader extends _LitElement {
      constructor() {
        super(); // Auto-refresh about once a minute so that the relative time of generation is always actual.

        _initialize(this);

        this._refreshTimeout = setTimeout(this._refresh.bind(this), 60 * 1000);
      }

    }

    return {
      F: IndexHeader,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
          /** Colors and variables **/
          :host {
            --header-meta-color: #98a5b8;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --header-meta-color: #515c6c;
            }
          }

          /** Component styling **/
          :host {
          }

          :host .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          :host .header-metadata {
            color: var(--header-meta-color);
            text-align: right;
          }
          :host .header-metadata a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host .header-metadata a:hover {
            color: var(--link-font-color-hover);
          }

          @media only screen and (max-width: 900px) {
            :host .header {
              flex-wrap: wrap;
              text-align: center;
            }
            :host .header-title,
            :host .header-metadata {
              width: 100%;
            }
            :host .header-metadata {
              padding-bottom: 12px;
              text-align: center;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Date
        })],
        key: "generated_at",

        value() {
          return null;
        }

      }, {
        kind: "method",
        key: "_refresh",
        value: function _refresh() {
          this.requestUpdate(); // Continue updating.

          this._refreshTimeout = setTimeout(this._refresh.bind(this), 60 * 1000);
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          let generatedAt = "";
          let generatedRel = "";

          if (this.generated_at) {
            generatedAt = greports.format.formatTimestamp(this.generated_at);
            let timeValue = (Date.now() - this.generated_at) / (1000 * 60);
            let timeUnit = "minute";

            if (timeValue < 1) {
              generatedRel = "just now";
            } else {
              if (timeValue > 60) {
                timeValue = timeValue / 60;
                timeUnit = "hour";
              }

              generatedRel = greports.format.formatTimespan(-Math.round(timeValue), timeUnit);
            }
          }

          return html`
            <div class="header">
                <h1 class="header-title">
                    Godot Team Reports
                </h1>
                <div class="header-metadata">
                    ${this.generated_at ? html`
                        <span title="${generatedAt}">
                            data generated ${generatedRel}
                        </span>
                    ` : ''}
                    <br/>
                    <a
                            href="https://github.com/godotengine/godot-team-reports"
                            target="_blank"
                    >
                        contribute on GitHub
                    </a>
                </div>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let IndexDescription = _decorate([customElement('gr-index-description')], function (_initialize, _LitElement) {
    class IndexDescription extends _LitElement {
      constructor(...args) {
        super(...args);

        _initialize(this);
      }

    }

    return {
      F: IndexDescription,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
          /** Colors and variables **/
          :host {
          }
          @media (prefers-color-scheme: dark) {
            :host {
            }
          }

          /** Component styling **/
          :host {
            line-height: 22px;
          }

          :host .header-description {
            display: flex;
            align-items: flex-end;
            color: var(--dimmed-font-color);
          }

          :host .header-description-column {
            flex: 2;
          }

          :host .header-description a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host .header-description a:hover {
            color: var(--link-font-color-hover);
          }

          :host hr {
            border: none;
            border-top: 1px solid var(--g-background-extra-color);
            width: 30%;
          }

          @media only screen and (max-width: 900px) {
            :host .header-description {
              padding: 0 8px;
              flex-direction: column;
            }

            :host .header-description-column {
              width: 100%;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Date
        })],
        key: "generated_at",

        value() {
          return null;
        }

      }, {
        kind: "method",
        key: "render",
        value: function render() {
          return html`
            <div class="header-description">
                <div class="header-description-column">
                    This page lists all open pull-requests (PRs) assigned to every Godot engine maintenance team.
                    <hr>
                    Contributors are encouraged to collaborate and clear the backlog by giving these PRs a proper look
                    and either approving or declining them.
                    <br/>
                    Positively reviewed PRs are open to be merged by responsible maintainers.
                </div>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let TeamItem = _decorate([customElement('gr-team-item')], function (_initialize, _LitElement) {
    class TeamItem extends _LitElement {
      constructor(...args) {
        super(...args);

        _initialize(this);
      }

    }

    return {
      F: TeamItem,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
          /** Colors and variables **/
          :host {
            --tab-hover-background-color: rgba(0, 0, 0, 0.14);
            --tab-active-background-color: #d6e6ff;
            --tab-active-border-color: #397adf;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --tab-hover-background-color: rgba(255, 255, 255, 0.14);
              --tab-active-background-color: #2c3c55;
              --tab-active-border-color: #397adf;
            }
          }

          /** Component styling **/
          :host {
            max-width: 240px;
          }

          :host .team-item {
            border-left: 5px solid transparent;
            color: var(--g-font-color);
            cursor: pointer;
            display: flex;
            flex-direction: row;
            padding: 3px 12px;
            align-items: center;
          }
          :host .team-item:hover {
            background-color: var(--tab-hover-background-color);
          }
          :host .team-item--active {
            background-color: var(--tab-active-background-color);
            border-left: 5px solid var(--tab-active-border-color);
          }

          :host .team-icon {
            background-size: cover;
            border-radius: 2px;
            display: inline-block;
            width: 16px;
            height: 16px;
          }

          :host .team-title {
            font-size: 13px;
            padding-left: 12px;
            white-space: nowrap;
          }

          :host .team-pull-count {
            color: var(--dimmed-font-color);
            flex-grow: 1;
            font-size: 13px;
            padding: 0 12px 0 6px;
            text-align: right;
          }
          :host .team-pull-count--hot {
            color: var(--g-font-color);
            font-weight: 700;
          }

          @media only screen and (max-width: 900px) {
            :host .team-item {
              padding: 6px 16px;
            }

            :host .team-title,
            :host .team-pull-count {
              font-size: 16px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "id",

        value() {
          return "";
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "name",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "avatar",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Boolean,
          reflect: true
        })],
        key: "active",

        value() {
          return false;
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Number
        })],
        key: "pull_count",

        value() {
          return 0;
        }

      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const classList = ["team-item"];

          if (this.active) {
            classList.push("team-item--active");
          }

          const countClassList = ["team-pull-count"];

          if (this.pull_count > 50) {
            countClassList.push("team-pull-count--hot");
          }

          return html`
            <div class="${classList.join(" ")}">
                <div
                    class="team-icon"
                    style="background-image: url('${this.avatar}')"
                ></div>
                <span class="team-title">
                    ${this.name}
                </span>
                <span class="${countClassList.join(" ")}">
                    ${this.pull_count}
                </span>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let TeamList = _decorate([customElement('gr-team-list')], function (_initialize, _LitElement) {
    class TeamList extends _LitElement {
      constructor() {
        super();

        _initialize(this);

        this._currentSection = "teams";
        this._mobileActive = false;
      }

    }

    return {
      F: TeamList,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
          /** Colors and variables **/
          :host {
            --teams-background-color: #fcfcfa;
            --teams-border-color: #515c6c;
            --section-active-border-color: #397adf;
            --teams-mobile-color: #9bbaed;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --teams-background-color: #0d1117;
              --teams-border-color: #515c6c;
              --section-active-border-color: #397adf;
              --teams-mobile-color: #222c3d;
            }
          }

          /** Component styling **/
          :host {
          }

          :host .team-list {
            background-color: var(--teams-background-color);
            border-right: 2px solid var(--teams-border-color);
            width: 240px;
            min-height: 216px;
          }

          :host .team-list-switcher {
            display: flex;
            flex-direction: row;
            justify-content: center;
          }
          :host .team-list-title {
            cursor: pointer;
            margin: 0 10px 12px 10px;
          }
          :host .team-list-title--active {
            border-bottom: 3px solid var(--section-active-border-color);
          }

          :host .team-list-section {
            display: none;
          }
          :host .team-list-section--active {
            display: block;
          }
          :host .team-list-section--selected:after {
            content: '';
            background: var(--section-active-border-color);
            border-radius: 2px;
            display: inline-block;
            height: 4px;
            width: 4px;
            vertical-align: super;
          }
          :host .team-mobile-container {
            display: none;
            padding: 0 12px 24px 12px;
          }
          :host .team-mobile-button {
            width: 100%;
            padding: 12px 0;
            margin: 0;
            border: none;
            border-radius: 4px;
            background: var(--teams-mobile-color);
            text-align: center;
            cursor: pointer;
          }

          @media only screen and (max-width: 900px) {
            :host {
              width: 100%
            }

            :host .team-list-switcher {
                font-size: 17px;
            }

            :host .team-list {
              display: none;
              width: 100% !important;
            }
            :host .team-list.team-list--active {
                margin-bottom: 24px;
            }
            :host .team-mobile-container,
            :host .team-list.team-list--active {
              display: block !important;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "teams",

        value() {
          return [];
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "reviewers",

        value() {
          return [];
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Number
        })],
        key: "selected",

        value() {
          return {};
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Boolean
        })],
        key: "selected_is_person",

        value() {
          return false;
        }

      }, {
        kind: "method",
        key: "onMobileClicked",
        value: function onMobileClicked() {
          this._mobileActive = !this._mobileActive;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onSwitcherClicked",
        value: function onSwitcherClicked(switchTo, event) {
          this._currentSection = switchTo;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onTabClicked",
        value: function onTabClicked(tab, isPerson, event) {
          this.dispatchEvent(greports.util.createEvent("tabclick", {
            "tab": tab,
            "isPerson": isPerson
          }));
          greports.util.setHistoryHash(tab.slug);
          this._mobileActive = false;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "update",
        value: function update(changedProperties) {
          if (changedProperties.has("selected_is_person")) {
            this._currentSection = this.selected_is_person ? "reviewers" : "teams";
          }

          _get(_getPrototypeOf(TeamList.prototype), "update", this).call(this, changedProperties);
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const teamsTitleClassList = ["team-list-title"];

          if (this._currentSection === "teams") {
            teamsTitleClassList.push("team-list-title--active");
          }

          if (!this.selected_is_person) {
            teamsTitleClassList.push("team-list-section--selected");
          }

          const reviewersTitleClassList = ["team-list-title"];

          if (this._currentSection === "reviewers") {
            reviewersTitleClassList.push("team-list-title--active");
          }

          if (this.selected_is_person) {
            reviewersTitleClassList.push("team-list-section--selected");
          }

          const teamsClassList = ["team-list-section", "team-list-section--teams"];

          if (this._currentSection === "teams") {
            teamsClassList.push("team-list-section--active");
          }

          const reviewersClassList = ["team-list-section", "team-list-section--reviewers"];

          if (this._currentSection === "reviewers") {
            reviewersClassList.push("team-list-section--active");
          }

          const containerClassList = ["team-list"];

          if (this._mobileActive) {
            containerClassList.push("team-list--active");
          }

          return html`
            <div class="team-mobile-container">
                <p class="team-mobile-button" @click="${this.onMobileClicked.bind(this)}">
                    ${this.selected_is_person ? html`Reviewer : ` : html`Team : `} ${this.selected.name}
                </p>
            </div>
            <div class="${containerClassList.join(" ")}">
                <div class="team-list-switcher">
                    <h4
                        class="${teamsTitleClassList.join(" ")}"
                        @click="${this.onSwitcherClicked.bind(this, "teams")}"
                    >
                        Teams
                    </h4>
                    <h4
                        class="${reviewersTitleClassList.join(" ")}"
                        @click="${this.onSwitcherClicked.bind(this, "reviewers")}"
                    >
                        Reviewers
                    </h4>
                </div>

                <div class="${teamsClassList.join(" ")}">
                    ${this.teams.length > 0 ? this.teams.map(item => {
          return html`
                                <gr-team-item
                                    .id="${item.id}"
                                    .name="${item.name}"
                                    .avatar="${item.avatar}"
                                    .pull_count="${item.pull_count}"
                                    ?active="${!this.selected_is_person && this.selected.id === item.id}"
                                    @click="${this.onTabClicked.bind(this, item, false)}"
                                />
                            `;
        }) : html`
                            <span>There are no teams</span>
                        `}
                </div>

                <div class="${reviewersClassList.join(" ")}">
                    ${this.reviewers.length > 0 ? this.reviewers.map(item => {
          return html`
                                <gr-team-item
                                    .id="${item.id}"
                                    .name="${item.name}"
                                    .avatar="${item.avatar}"
                                    .pull_count="${item.pull_count}"
                                    ?active="${this.selected_is_person && this.selected.id === item.id}"
                                    @click="${this.onTabClicked.bind(this, item, true)}"
                                />
                            `;
        }) : html`
                            <span>There are no reviewers</span>
                        `}
                </div>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let PullRequestItem = _decorate([customElement('gr-pull-request')], function (_initialize, _LitElement) {
    class PullRequestItem extends _LitElement {
      constructor(...args) {
        super(...args);

        _initialize(this);
      }

    }

    return {
      F: PullRequestItem,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
          /** Colors and variables **/
          :host {
            --pr-border-color: #fcfcfa;
            --draft-font-color: #ffcc31;
            --draft-background-color: #9db3c0;
            --stats-background-color: #f9fafa;
            --ghost-font-color: #738b99;

            --mergeable-unknown-color: #939fa3;
            --mergeable-no-color: #de1600;
            --mergeable-maybe-color: #c49504;
            --mergeable-yes-color: #50b923;

            --stat-temp0-color: #000000;
            --stat-temp1-color: #383824;
            --stat-temp2-color: #645b2c;
            --stat-temp3-color: #a07b24;
            --stat-temp4-color: #b06c15;
            --stat-temp5-color: #bb5010;
            --stat-temp6-color: #e33b07;
            --stat-temp7-color: #e6240e;
            --stat-temp8-color: #b31605;
            --stat-temp9-color: #d3001c;
          }

          @media (prefers-color-scheme: dark) {
            :host {
              --pr-border-color: #0d1117;
              --draft-font-color: #e0c537;
              --draft-background-color: #1e313c;
              --stats-background-color: #0f1316;
              --ghost-font-color: #495d68;

              --mergeable-unknown-color: #4e5659;
              --mergeable-no-color: #d31a3b;
              --mergeable-maybe-color: #cbad1c;
              --mergeable-yes-color: #3bc213;

              --stat-temp0-color: #ffffff;
              --stat-temp1-color: #f0ed7e;
              --stat-temp2-color: #f5d94a;
              --stat-temp3-color: #f8b71e;
              --stat-temp4-color: #f38c06;
              --stat-temp5-color: #f06009;
              --stat-temp6-color: #e33b07;
              --stat-temp7-color: #e6240e;
              --stat-temp8-color: #b31605;
              --stat-temp9-color: #d3001c;
            }
          }

          /** Component styling **/
          :host {
            border-bottom: 3px solid var(--pr-border-color);
            display: block;
            padding: 14px 12px 20px 12px;
          }

          :host a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host a:hover {
            color: var(--link-font-color-hover);
          }

          :host .pr-title {
            display: inline-block;
            font-size: 20px;
            margin-top: 6px;
            margin-bottom: 12px;
          }
          :host .pr-title-name {
            color: var(--g-font-color);
            line-height: 24px;
            word-break: break-word;
          }

          :host .pr-title-draft {
            background-color: var(--draft-background-color);
            border-radius: 6px 6px;
            color: var(--draft-font-color);
            font-size: 14px;
            padding: 1px 6px;
            vertical-align: bottom;
          }

          :host .pr-meta {
            color: var(--dimmed-font-color);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 13px;
          }

          :host .pr-labels {
            display: flex;
            flex-flow: column wrap;
            padding: 4px 0;
            max-height: 60px;
          }

          :host .pr-label {
            padding-right: 8px;
          }
          :host .pr-label-dot {
            border-radius: 4px;
            box-shadow: rgb(0 0 0 / 28%) 0 0 3px 0;
            display: inline-block;
            width: 8px;
            height: 8px;
          }
          :host .pr-label-name {
            padding-left: 3px;
          }

          :host .pr-milestone-value {
            font-weight: 700;
          }

          :host .pr-mergeable-value,
          :host .pr-mergeable-reason {
            border-bottom: 1px dashed var(--g-font-color);
            cursor: help;
            font-weight: 700;
          }

          :host .pr-mergeable-value--unknown {
            color: var(--mergeable-unknown-color);
          }
          :host .pr-mergeable-value--no {
            color: var(--mergeable-no-color);
          }
          :host .pr-mergeable-value--maybe {
            color: var(--mergeable-maybe-color);
          }
          :host .pr-mergeable-value--yes {
            color: var(--mergeable-yes-color);
          }

          :host .pr-time {

          }
          :host .pr-time-value {
            border-bottom: 1px dashed var(--g-font-color);
            cursor: help;
            font-weight: 700;
          }

          :host .pr-author {

          }
          :host .pr-author-value {

          }
          :host .pr-author-value--hot:before {
            content: "★";
            color: var(--draft-font-color);
          }
          :host .pr-author-value--ghost {
            color: var(--ghost-font-color);
            font-weight: 600;
          }

          :host .pr-links {
            font-size: 13px;
            margin-top: 8px;
          }

          :host .pr-link {
            font-weight: 700;
            white-space: nowrap;
          }

          :host .pr-stats {
            background-color: var(--stats-background-color);
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
            padding: 10px 6px;
            margin-top: 12px;
          }

          :host .pr-stat + .pr-stat {
            margin-left: 12px;
          }

          :host .pr-stat--temp0 {
            color: var(--stat-temp0-color);
          }
          :host .pr-stat--temp1 {
            color: var(--stat-temp1-color);
          }
          :host .pr-stat--temp2 {
            color: var(--stat-temp2-color);
          }
          :host .pr-stat--temp3 {
            color: var(--stat-temp3-color);
          }
          :host .pr-stat--temp4 {
            color: var(--stat-temp4-color);
          }
          :host .pr-stat--temp5 {
            color: var(--stat-temp5-color);
            font-weight: 700;
          }
          :host .pr-stat--temp6 {
            color: var(--stat-temp6-color);
            font-weight: 700;
          }
          :host .pr-stat--temp7 {
            color: var(--stat-temp7-color);
            font-weight: 700;
          }
          :host .pr-stat--temp8 {
            color: var(--stat-temp8-color);
            font-weight: 700;
          }
          :host .pr-stat--temp9 {
            color: var(--stat-temp9-color);
            font-weight: 700;
          }

          :host .pr-review {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-top: 14px;
          }

          :host .pr-review-teams {
            max-width: 50%;
          }

          :host .pr-review-team {
            color: var(--light-font-color);
            white-space: nowrap;
          }
          :host .pr-review-team + .pr-review-team:before {
            content: "· ";
            white-space: break-spaces;
          }

          @media only screen and (max-width: 900px) {
            :host {
              padding: 14px 0 20px 0;
            }
            :host .pr-meta {
              flex-wrap: wrap;
            }
            :host .pr-labels {
              width: 100%;
              justify-content: space-between;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "id",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "title",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "url",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "diff_url",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "patch_url",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Boolean
        })],
        key: "draft",

        value() {
          return false;
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "mergeable_state",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "mergeable_reason",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "labels",

        value() {
          return [];
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "milestone",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String,
          reflect: true
        })],
        key: "branch",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "links",

        value() {
          return [];
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "created_at",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "updated_at",

        value() {
          return '';
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Object
        })],
        key: "author",

        value() {
          return null;
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "teams",

        value() {
          return [];
        }

      }, {
        kind: "method",
        key: "getStatTemp",
        value: function getStatTemp(value, factor) {
          let temp = Math.floor(value / factor);

          if (temp > 9) {
            temp = 9;
          }

          return temp;
        }
      }, {
        kind: "method",
        key: "getMergeableStateText",
        value: function getMergeableStateText(value, reason) {
          const descriptions = {
            'UNKNOWN': "unknown",
            'CONFLICTING': "no",
            'MERGEABLE': "yes"
          };

          if (typeof descriptions[value] === "undefined") {
            return value.toLowerCase;
          }

          if (value === 'MERGEABLE' && !['CLEAN', 'HAS_HOOKS', 'UNSTABLE'].includes(reason)) {
            return "maybe";
          }

          return descriptions[value];
        }
      }, {
        kind: "method",
        key: "getMergeableStateDescription",
        value: function getMergeableStateDescription(value) {
          const descriptions = {
            'UNKNOWN': "The mergeability of the pull request is not calculated.",
            'CONFLICTING': "The pull request cannot be merged due to merge conflicts.",
            'MERGEABLE': "The pull request can be merged."
          };

          if (typeof descriptions[value] === "undefined") {
            return value;
          }

          return descriptions[value];
        }
      }, {
        kind: "method",
        key: "getMergeableReasonText",
        value: function getMergeableReasonText(value) {
          const descriptions = {
            'UNKNOWN': "unknown",
            'BEHIND': "outdated branch",
            'BLOCKED': "blocked",
            'CLEAN': "clean",
            'DIRTY': "merge conflicts",
            'DRAFT': "draft",
            'HAS_HOOKS': "passing status w/ hooks",
            'UNSTABLE': "non-passing status"
          };

          if (typeof descriptions[value] === "undefined") {
            return value;
          }

          return descriptions[value];
        }
      }, {
        kind: "method",
        key: "getMergeableReasonDescription",
        value: function getMergeableReasonDescription(value) {
          const descriptions = {
            'UNKNOWN': "The state cannot currently be determined.",
            'BEHIND': "The head ref is out of date.",
            'BLOCKED': "The merge is blocked. It likely requires an approving review.",
            'CLEAN': "Mergeable and passing commit status.",
            'DIRTY': "The merge commit cannot be cleanly created.",
            'DRAFT': "The merge is blocked due to the pull request being a draft.",
            'HAS_HOOKS': "Mergeable with passing commit status and pre-receive hooks.",
            'UNSTABLE': "Mergeable with non-passing commit status."
          };

          if (typeof descriptions[value] === "undefined") {
            return value;
          }

          return descriptions[value];
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const created_days = greports.format.getDaysSince(this.created_at);
          const stale_days = greports.format.getDaysSince(this.updated_at);
          const other_teams = [].concat(this.teams);
          other_teams.sort((a, b) => {
            const a_name = a.toLowerCase().replace(/^_/, "");
            const b_name = b.toLowerCase().replace(/^_/, "");
            if (a_name > b_name) return 1;
            if (a_name < b_name) return -1;
            return 0;
          });
          const authorClassList = ["pr-author-value"];

          if (this.author.pull_count > 40) {
            authorClassList.push("pr-author-value--hot");
          }

          if (this.author.id === "") {
            authorClassList.push("pr-author-value--ghost");
          } // Keep it to two columns, but if there isn't enough labels, keep it to one.


          let labels_height = Math.ceil(this.labels.length / 2) * 20;

          if (labels_height < 60) {
            labels_height = 60;
          }

          return html`
            <div class="pr-container">
                <a
                    class="pr-title"
                    href="${this.url}"
                    target="_blank"
                >
                    ${this.draft ? html`
                        <span class="pr-title-draft">draft</span>
                    ` : ''}
                    <span class="pr-title-id">#${this.id}</span> <span class="pr-title-name">${this.title}</span>
                </a>

                <div class="pr-meta">
                    <div class="pr-labels" style="max-height:${labels_height}px">
                        ${this.labels.map(item => {
          return html`
                                <span
                                    class="pr-label"
                                >
                                    <span
                                        class="pr-label-dot"
                                        style="background-color: ${item.color}"
                                    ></span>
                                    <span
                                        class="pr-label-name"
                                    >
                                        ${item.name}
                                    </span>
                                </span>
                            `;
        })}
                    </div>

                    <div class="pr-milestone">
                        <div>
                            <span>milestone: </span>
                            ${this.milestone != null ? html`
                                <a
                                    href="${this.milestone.url}"
                                    target="_blank"
                                >
                                    ${this.milestone.title}
                                </a>
                            ` : html`
                                <span>none</span>
                            `}
                        </div>
                        <div>
                            <span>branch: </span>
                            <span class="pr-milestone-value">
                                ${this.branch}
                            </span>
                        </div>
                        <div>
                            <span>mergeable: </span>
                            <span
                                class="pr-mergeable-value pr-mergeable-value--${this.getMergeableStateText(this.mergeable_state, this.mergeable_reason)}"
                                title="${this.getMergeableStateDescription(this.mergeable_state)}"
                            >
                                ${this.getMergeableStateText(this.mergeable_state, this.mergeable_reason)}
                            </span>
                            ${this.mergeable_reason !== 'UNKNOWN' ? html`
                                |
                                <span
                                        class="pr-mergeable-reason pr-mergeable-reason--${this.mergeable_reason.toLowerCase()}"
                                        title="${this.getMergeableReasonDescription(this.mergeable_reason)}"
                                >
                                    ${this.getMergeableReasonText(this.mergeable_reason)}
                                </span>
                            ` : html``}
                        </div>
                    </div>

                    <div class="pr-timing">
                        <div class="pr-time">
                            <span>created: </span>
                            <span
                                class="pr-time-value"
                                title="${greports.format.formatTimestamp(this.created_at)}"
                            >
                                ${greports.format.formatDate(this.created_at)}
                            </span>
                        </div>
                        <div class="pr-time">
                            <span>updated: </span>
                            <span
                                class="pr-time-value"
                                title="${greports.format.formatTimestamp(this.updated_at)}"
                            >
                                ${greports.format.formatDate(this.updated_at)}
                            </span>
                        </div>
                        <div class="pr-author">
                            <span>author: </span>
                            <a
                                class="${authorClassList.join(" ")}"
                                href="https://github.com/godotengine/godot/pulls/${this.author.user}"
                                target="_blank"
                                title="Open ${this.author.pull_count} ${this.author.pull_count > 1 ? 'PRs' : 'PR'} by ${this.author.user}"
                            >
                                ${this.author.user}
                            </a>
                        </div>
                    </div>
                </div>

                ${this.links.length > 0 ? html`
                    <div class="pr-links">
                        <span>linked issues: </span>
                        ${this.links.map((item, index) => {
          let issueRef = "#" + item.issue;

          if (item.repo !== "godotengine/godot") {
            issueRef = item.repo + issueRef;
          }

          return html`
                                ${index > 0 ? html`
                                    <span> · </span>
                                ` : ''}
                                <a
                                    class="pr-link"
                                    href="${item.url}"
                                    target="_blank"
                                    title="Open the issue ${issueRef} which this PR ${item.keyword}"
                                >
                                    ${issueRef}
                                </a>
                            `;
        })}
                    </div>
                ` : ''}

                <div class="pr-stats">
                    <div
                        class="pr-stat"
                        title="Days since this PR was created"
                    >
                        <span>lifetime: </span>
                        <span
                            class="pr-stat--temp${this.getStatTemp(created_days, 14)}"
                        >
                            ${greports.format.formatDays(created_days)}
                        </span>
                    </div>
                    <div
                        class="pr-stat"
                        title="Days since last update to this PR was made"
                    >
                        <span>stale for: </span>
                        <span
                            class="pr-stat--temp${this.getStatTemp(stale_days, 14)}"
                        >
                            ${greports.format.formatDays(stale_days)}
                        </span>
                    </div>
                </div>

                <div class="pr-review">
                    <div class="pr-review-teams">
                        ${other_teams.length > 0 ? html`
                            <span>also awaiting reviews from: </span>
                            ${other_teams.map(item => {
          return html`
                                    <span class="pr-review-team">${item}</span>
                                `;
        })}
                        ` : ''}
                    </div>
                    <div class="pr-download">
                        <span>download changeset: </span>
                        <a
                            href="${this.diff_url}"
                            target="_blank"
                        >
                            diff
                        </a> |
                        <a
                            href="${this.patch_url}"
                            target="_blank"
                        >
                            patch
                        </a>
                    </div>

                </div>
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let PullRequestList = _decorate([customElement('gr-pull-list')], function (_initialize, _LitElement) {
    class PullRequestList extends _LitElement {
      constructor() {
        super(); // Look in global.js for the actual defaults.

        _initialize(this);

        this._sortBy = "age";
        this._sortDirection = "desc";
        this._showDraft = false;
        this._filterMilestone = "4.0";
        this._filterMergeable = "";
        this.restoreUserPreferences();
      }

    }

    return {
      F: PullRequestList,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
          /** Colors and variables **/
          :host {
            --pulls-background-color: #e5edf8;
            --pulls-toolbar-color: #9bbaed;
            --pulls-toolbar-accent-color: #5a6f90;

            --sort-color: #5c7bb6;
            --sort-color-hover: #2862cd;
            --sort-color-active: #2054b5;

            --reset-color: #4e4f53;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --pulls-background-color: #191d23;
              --pulls-toolbar-color: #222c3d;
              --pulls-toolbar-accent-color: #566783;

              --sort-color: #4970ad;
              --sort-color-hover: #5b87de;
              --sort-color-active: #6b9aea;

              --reset-color: #7f8185;
            }
          }

          /** Component styling **/
          :host {
            flex-grow: 1;
          }

          :host input[type=checkbox] {
            margin: 0;
            vertical-align: bottom;
          }

          :host select {
            background: var(--pulls-background-color);
            border: 1px solid var(--pulls-background-color);
            color: var(--g-font-color);
            font-size: 12px;
            outline: none;
            min-width: 60px;
          }

          :host .team-pulls {
            background-color: var(--pulls-background-color);
            border-radius: 0 4px 4px 0;
            padding: 8px 12px;
            max-width: 760px;
            min-height: 200px;
          }

          :host .team-pulls-toolbar {
            background: var(--pulls-toolbar-color);
            border-radius: 4px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 10px 14px;
            margin-bottom: 6px;
          }

          :host .pulls-count {
            font-size: 15px;
          }
          :host .pulls-count strong {
            font-size: 18px;
          }
          :host .pulls-count-total {
            color: var(--dimmed-font-color);
          }

          :host .pulls-filters {
            display: flex;
            flex-direction: row;
          }
          :host .pulls-filters-column {
            display: flex;
            flex-direction: column;
            font-size: 13px;
            min-width: 140px;
          }
          :host .pulls-filters-column + .pulls-filters-column {
            margin-left: 38px;
          }

          :host .pulls-filter {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1px 0;
          }

          :host .pulls-sort {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1px 0;
          }

          :host .pulls-sort-action {
            color: var(--sort-color);
            cursor: pointer;
          }
          :host .pulls-sort-action:hover {
            color: var(--sort-color-hover);
          }

          :host .pulls-sort-action--active,
          :host .pulls-sort-action--active:hover {
            color: var(--sort-color-active);
            cursor: default;
            text-decoration: underline;
          }

          :host .pulls-reset {
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid var(--pulls-toolbar-accent-color);
            margin-top: 8px;
            padding-top: 2px;
          }

          :host .pulls-reset-action {
            color: var(--reset-color);
            cursor: pointer;
          }

          @media only screen and (max-width: 900px) {
            :host .team-pulls {
              padding: 8px;
              max-width: 95%;
              margin: 0px auto;
            }
            :host .team-pulls-toolbar {
              flex-wrap: wrap;
            }
            :host .pulls-count {
              font-size: 17px;
              margin-bottom: 12px;
              text-align: center;
              width: 100%;
            }
            :host .pulls-count strong {
              font-size: 20px;
            }
            :host .pulls-filters {
              width: 100%;
              justify-content: space-between;
            }

            :host .pulls-filters-column {
                font-size: 15px;
            }
            :host .pulls-filters-column > span {
                padding: 2px 0;
            }
            :host .pulls-filter > *:first-child,
            :host .pulls-sort > *:first-child {
                padding-right: 12px;
            }
          }
        `;
        }
      }, {
        kind: "field",
        decorators: [property({
          type: Array
        })],
        key: "pulls",

        value() {
          return [];
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Object
        })],
        key: "teams",

        value() {
          return {};
        }

      }, {
        kind: "field",
        decorators: [property({
          type: String
        })],
        key: "selected_group",

        value() {
          return "";
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Boolean
        })],
        key: "selected_is_person",

        value() {
          return false;
        }

      }, {
        kind: "field",
        decorators: [property({
          type: Object
        })],
        key: "authors",

        value() {
          return {};
        }

      }, {
        kind: "method",
        key: "restoreUserPreferences",
        value: function restoreUserPreferences() {
          const userPreferences = greports.util.getLocalPreferences();
          this._sortBy = userPreferences["sortBy"];
          this._sortDirection = userPreferences["sortDirection"];
          this._showDraft = userPreferences["showDraft"];
          this._filterMilestone = userPreferences["filterMilestone"];
          this._filterMergeable = userPreferences["filterMergeable"];
        }
      }, {
        kind: "method",
        key: "saveUserPreferences",
        value: function saveUserPreferences() {
          const currentPreferences = {
            "sortBy": this._sortBy,
            "sortDirection": this._sortDirection,
            "showDraft": this._showDraft,
            "filterMilestone": this._filterMilestone,
            "filterMergeable": this._filterMergeable
          };
          greports.util.setLocalPreferences(currentPreferences);
        }
      }, {
        kind: "method",
        key: "onResetPreferencesClicked",
        value: function onResetPreferencesClicked() {
          greports.util.resetLocalPreferences();
          this.restoreUserPreferences();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onSortClicked",
        value: function onSortClicked(sortField, event) {
          this._sortBy = sortField;
          this.saveUserPreferences();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onSortDirectionClicked",
        value: function onSortDirectionClicked(sortDirection, event) {
          this._sortDirection = sortDirection;
          this.saveUserPreferences();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onDraftsChecked",
        value: function onDraftsChecked(event) {
          this._showDraft = event.target.checked;
          this.saveUserPreferences();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onMilestoneChanged",
        value: function onMilestoneChanged(event) {
          this._filterMilestone = event.target.value;
          this.saveUserPreferences();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onMergeableChanged",
        value: function onMergeableChanged(event) {
          this._filterMergeable = event.target.value;
          this.saveUserPreferences();
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "getMergeableFilterValue",
        value: function getMergeableFilterValue(state, reason) {
          const descriptions = {
            'UNKNOWN': "unknown",
            'CONFLICTING': "no",
            'MERGEABLE': "yes"
          };

          if (typeof descriptions[state] === "undefined") {
            return "unknown";
          }

          if (state === 'MERGEABLE' && !['CLEAN', 'HAS_HOOKS', 'UNSTABLE'].includes(reason)) {
            return "maybe";
          }

          return descriptions[state];
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          const milestones = [];
          let pulls = [].concat(this.pulls);
          const sort_direction = this._sortDirection === "desc" ? 1 : -1;
          pulls.sort((a, b) => {
            if (a.milestone && !milestones.includes(a.milestone.title)) {
              milestones.push(a.milestone.title);
            }

            if (b.milestone && !milestones.includes(b.milestone.title)) {
              milestones.push(b.milestone.title);
            }

            if (this._sortBy === "stale") {
              if (a.updated_at > b.updated_at) return 1 * sort_direction;
              if (a.updated_at < b.updated_at) return -1 * sort_direction;
              return 0;
            } else {
              // "age" is default.
              if (a.created_at > b.created_at) return 1 * sort_direction;
              if (a.created_at < b.created_at) return -1 * sort_direction;
              return 0;
            }
          }); // Values can be dynamically removed from the selector,
          // but we don't really want to break the filters.

          let milestone = "";

          if (milestones.includes(this._filterMilestone)) {
            milestone = this._filterMilestone;
          }

          let mergeables = ["no", "maybe", "yes"];
          pulls = pulls.filter(item => {
            if (!this._showDraft && item.is_draft) {
              return false;
            }

            if (milestone !== "" && item.milestone && item.milestone.title !== milestone) {
              return false;
            }

            if (this._filterMergeable !== "" && this.getMergeableFilterValue(item.mergeable_state, item.mergeable_reason) !== this._filterMergeable) {
              return false;
            }

            return true;
          });
          const total_pulls = this.pulls.length;
          const filtered_pulls = pulls.length;
          return html`
            <div class="team-pulls">
                <div class="team-pulls-toolbar">
                    <div class="pulls-count">
                        <span>PRs to review: </span>
                        <strong>${filtered_pulls}</strong>
                        ${filtered_pulls !== total_pulls ? html`
                            <span class="pulls-count-total"> (out of ${total_pulls})</span>
                        ` : ''}
                    </div>

                    <div class="pulls-filters">
                        <span class="pulls-filters-column">
                            <span class="pulls-filter">
                                <label for="show-drafts">show drafts? </label>
                                <input
                                    id="show-drafts"
                                    type="checkbox"
                                    .checked="${this._showDraft}"
                                    @click="${this.onDraftsChecked}"
                                />
                            </span>

                            <span class="pulls-filter">
                                <span>milestone: </span>
                                <select @change="${this.onMilestoneChanged}">
                                    <option value="">*</option>
                                    ${milestones.map(item => {
          return html`
                                            <option
                                                value="${item}"
                                                .selected="${milestone === item}"
                                            >
                                                ${item}
                                            </option>
                                        `;
        })}
                                </select>
                            </span>

                            <span class="pulls-filter">
                                <span>mergeable: </span>
                                <select @change="${this.onMergeableChanged}">
                                    <option value="">*</option>
                                    ${mergeables.map(item => {
          return html`
                                            <option
                                                value="${item}"
                                                .selected="${this._filterMergeable === item}"
                                            >
                                                ${item}
                                            </option>
                                        `;
        })}
                                </select>
                            </span>
                        </span>

                        <span class="pulls-filters-column">
                            <span class="pulls-sort">
                                <span>sort by: </span>
                                <span>
                                    <span
                                        class="pulls-sort-action ${this._sortBy === "age" ? "pulls-sort-action--active" : ""}"
                                        title="Show older PRs first"
                                        @click="${this.onSortClicked.bind(this, "age")}"
                                    >
                                        lifetime
                                    </span> ·
                                    <span
                                        class="pulls-sort-action ${this._sortBy === "stale" ? "pulls-sort-action--active" : ""}"
                                        title="Show least recently updated PRs first"
                                        @click="${this.onSortClicked.bind(this, "stale")}"
                                    >
                                        stale
                                    </span>
                                </span>
                            </span>

                            <span class="pulls-sort">
                                <span></span>
                                <span>
                                    <span
                                        class="pulls-sort-action ${this._sortDirection === "asc" ? "pulls-sort-action--active" : ""}"
                                        title="Show newer PRs first"
                                        @click="${this.onSortDirectionClicked.bind(this, "asc")}"
                                    >
                                        asc
                                    </span> ·
                                    <span
                                        class="pulls-sort-action ${this._sortDirection === "desc" ? "pulls-sort-action--active" : ""}"
                                        title="Show older PRs first"
                                        @click="${this.onSortDirectionClicked.bind(this, "desc")}"
                                    >
                                        desc
                                    </span>
                                </span>
                            </span>

                            <span class="pulls-reset">
                                <span
                                    class="pulls-reset-action"
                                    @click="${this.onResetPreferencesClicked}"
                                >
                                    reset filters
                                </span>
                            </span>
                        </span>
                    </div>
                </div>

                ${pulls.map(item => {
          const other_teams = [];
          item.teams.forEach(teamId => {
            if (teamId === "") {
              return; // continue
            }

            if (this.selected_is_person || !this.selected_is_person && teamId !== this.selected_group) {
              other_teams.push(this.teams[teamId].name);
            }
          });
          let author = null;

          if (typeof this.authors[item.authored_by] != "undefined") {
            author = this.authors[item.authored_by];
          }

          return html`
                        <gr-pull-request
                            .id="${item.public_id}"
                            .title="${item.title}"
                            .url="${item.url}"
                            ?draft="${item.is_draft}"
                            .mergeable_state="${item.mergeable_state}"
                            .mergeable_reason="${item.mergeable_reason}"

                            .labels="${item.labels}"
                            .milestone="${item.milestone}"
                            .branch="${item.target_branch}"
                            .links="${item.links}"

                            .created_at="${item.created_at}"
                            .updated_at="${item.updated_at}"
                            .author="${author}"

                            .diff_url="${item.diff_url}"
                            .patch_url="${item.patch_url}"

                            .teams="${other_teams}"
                        />
                    `;
        })}
            </div>
        `;
        }
      }]
    };
  }, LitElement);

  let EntryComponent = _decorate([customElement('entry-component')], function (_initialize, _LitElement) {
    class EntryComponent extends _LitElement {
      constructor() {
        super();

        _initialize(this);

        this._entryRequested = false;
        this._isLoading = true;
        this._generatedAt = null;
        this._teams = {};
        this._orderedTeams = [];
        this._reviewers = {};
        this._orderedReviewers = [];
        this._selectedGroup = {};
        this._selectedIsPerson = false;
        this._authors = {};
        this._pulls = [];

        this._requestData();
      }

    }

    return {
      F: EntryComponent,
      d: [{
        kind: "get",
        static: true,
        key: "styles",
        value: function styles() {
          return css`
          /** Colors and variables **/
          :host {
          }
          @media (prefers-color-scheme: dark) {
            :host {
            }
          }

          /** Component styling **/
          :host {
          }

          :host .teams {
            display: flex;
            padding: 24px 0;
          }

          @media only screen and (max-width: 900px) {
            :host .teams {
              flex-wrap: wrap;
            }
          }
        `;
        }
      }, {
        kind: "method",
        key: "performUpdate",
        value: function performUpdate() {
          this._requestData();

          _get(_getPrototypeOf(EntryComponent.prototype), "performUpdate", this).call(this);
        }
      }, {
        kind: "method",
        key: "_requestData",
        value: async function _requestData() {
          if (this._entryRequested) {
            return;
          }

          this._entryRequested = true;
          this._isLoading = true;
          const data = await greports.api.getData();

          if (data) {
            this._generatedAt = data.generated_at;
            this._teams = data.teams;
            this._reviewers = data.reviewers;
            this._authors = data.authors;
            this._pulls = data.pulls;
            this._orderedTeams = Object.values(this._teams);

            this._orderedTeams.sort((a, b) => {
              if (a.id === "") return -1;
              if (b.id === "") return 1;
              const a_name = a.name.toLowerCase().replace(/^_/, "");
              const b_name = b.name.toLowerCase().replace(/^_/, "");
              if (a_name > b_name) return 1;
              if (a_name < b_name) return -1;
              return 0;
            });

            this._orderedReviewers = Object.values(this._reviewers);

            this._orderedReviewers.sort((a, b) => {
              const a_name = a.name.toLowerCase();
              const b_name = b.name.toLowerCase();
              if (a_name > b_name) return 1;
              if (a_name < b_name) return -1;
              return 0;
            }); // Try to select the team or the reviewer that was passed in the URL.


            let hasPresetGroup = false;
            const requested_slug = greports.util.getHistoryHash();

            if (requested_slug !== "") {
              for (let i = 0; i < this._orderedTeams.length; i++) {
                const team = this._orderedTeams[i];

                if (team.slug === requested_slug) {
                  this._selectedGroup = team;
                  this._selectedIsPerson = false;
                  hasPresetGroup = true;
                  break;
                }
              }

              if (!hasPresetGroup) {
                for (let i = 0; i < this._orderedReviewers.length; i++) {
                  const reviewer = this._orderedReviewers[i];

                  if (reviewer.slug === requested_slug) {
                    this._selectedGroup = reviewer;
                    this._selectedIsPerson = true;
                    hasPresetGroup = true;
                    break;
                  }
                }
              }
            } // If no team/reviewer was passed in the URL, or that team/reviewer is not available, use the first team.


            if (!hasPresetGroup) {
              if (this._orderedTeams.length) {
                this._selectedGroup = this._orderedTeams[0];
                greports.util.setHistoryHash(this._orderedTeams[0].slug);
              } else {
                this._selectedGroup = {};
                greports.util.setHistoryHash("");
              }
            }
          } else {
            this._generatedAt = null;
            this._teams = {};
            this._orderedTeams = [];
            this._reviewers = {};
            this._orderedReviewers = [];
            this._selectedGroup = {};
            this._selectedIsPerson = false;
            this._authors = {};
            this._pulls = [];
          }

          this._isLoading = false;
          this.requestUpdate();
        }
      }, {
        kind: "method",
        key: "onTabClicked",
        value: function onTabClicked(event) {
          this._selectedGroup = event.detail.tab;
          this._selectedIsPerson = event.detail.isPerson;
          this.requestUpdate();
          window.scrollTo(0, 0);
        }
      }, {
        kind: "method",
        key: "render",
        value: function render() {
          let pulls = [];

          this._pulls.forEach(pull => {
            if (!this._selectedIsPerson && pull.teams.includes(this._selectedGroup.id)) {
              pulls.push(pull);
            }

            if (this._selectedIsPerson && pull.reviewers.includes(this._selectedGroup.id)) {
              pulls.push(pull);
            }
          });

          return html`
            <page-content>
                <shared-nav></shared-nav>
                <gr-index-entry .generated_at="${this._generatedAt}"></gr-index-entry>
                <gr-index-description></gr-index-description>

                ${this._isLoading ? html`
                    <h3>Loading...</h3>
                ` : html`
                    <div class="teams">
                        <gr-team-list
                            .teams="${this._orderedTeams}"
                            .reviewers="${this._orderedReviewers}"
                            .selected="${this._selectedGroup}"
                            .selected_is_person="${this._selectedIsPerson}"
                            @tabclick="${this.onTabClicked}"
                        ></gr-team-list>

                        <gr-pull-list
                            .pulls="${pulls}"
                            .teams="${this._teams}"
                            .selected_group="${this._selectedGroup.id}"
                            .selected_is_person="${this._selectedIsPerson}"
                            .authors="${this._authors}"
                        ></gr-pull-list>
                    </div>
                `}
            </page-content>
        `;
        }
      }]
    };
  }, LitElement);

  return EntryComponent;

}());