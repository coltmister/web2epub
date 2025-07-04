(() => {
  var __webpack_modules__ = {249: function (e, t, n) {
    var r;
    e.exports = (r = r || function (e, t) {
      var r;
      if ("undefined" != typeof window && window.crypto && (r = window.crypto), "undefined" != typeof self && self.crypto && (r = self.crypto), "undefined" != typeof globalThis && globalThis.crypto && (r = globalThis.crypto), !r && "undefined" != typeof window && window.msCrypto && (r = window.msCrypto), !r && undefined !== n.g && n.g.crypto && (r = n.g.crypto), !r) try {
        r = n(480);
      } catch (e) {}
      var i = function () {
        if (r) {
          if ("function" == typeof r.getRandomValues) try {
            return r.getRandomValues(new Uint32Array(1))[0];
          } catch (e) {}
          if ("function" == typeof r.randomBytes) try {
            return r.randomBytes(4).readInt32LE();
          } catch (e) {}
        }
        throw new Error("Native crypto module could not be used to get secure random number.");
      }, o = Object.create || function () {
        function e() {}
        return function (t) {
          var n;
          return e.prototype = t, n = new e, e.prototype = null, n;
        };
      }(), a = {}, c = a.lib = {}, u = c.Base = {extend: function (e) {
        var t = o(this);
        return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function () {
          t.$super.init.apply(this, arguments);
        }), t.init.prototype = t, t.$super = this, t;
      }, create: function () {
        var e = this.extend();
        return e.init.apply(e, arguments), e;
      }, init: function () {}, mixIn: function (e) {
        for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
        e.hasOwnProperty("toString") && (this.toString = e.toString);
      }, clone: function () {
        return this.init.prototype.extend(this);
      }}, s = c.WordArray = u.extend({init: function (e, t) {
        e = this.words = e || [], this.sigBytes = null != t ? t : 4 * e.length;
      }, toString: function (e) {
        return (e || f).stringify(this);
      }, concat: function (e) {
        var t = this.words, n = e.words, r = this.sigBytes, i = e.sigBytes;
        if (this.clamp(), r % 4) for (var o = 0; o < i; o++) {
          var a = n[o >>> 2] >>> 24 - o % 4 * 8 & 255;
          t[r + o >>> 2] |= a << 24 - (r + o) % 4 * 8;
        } else for (var c = 0; c < i; c += 4) t[r + c >>> 2] = n[c >>> 2];
        return this.sigBytes += i, this;
      }, clamp: function () {
        var t = this.words, n = this.sigBytes;
        t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8, t.length = e.ceil(n / 4);
      }, clone: function () {
        var e = u.clone.call(this);
        return e.words = this.words.slice(0), e;
      }, random: function (e) {
        for (var t = [], n = 0; n < e; n += 4) t.push(i());
        return new s.init(t, e);
      }}), l = a.enc = {}, f = l.Hex = {stringify: function (e) {
        for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i++) {
          var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
          r.push((o >>> 4).toString(16)), r.push((15 & o).toString(16));
        }
        return r.join("");
      }, parse: function (e) {
        for (var t = e.length, n = [], r = 0; r < t; r += 2) n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - r % 8 * 4;
        return new s.init(n, t / 2);
      }}, p = l.Latin1 = {stringify: function (e) {
        for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i++) {
          var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
          r.push(String.fromCharCode(o));
        }
        return r.join("");
      }, parse: function (e) {
        for (var t = e.length, n = [], r = 0; r < t; r++) n[r >>> 2] |= (255 & e.charCodeAt(r)) << 24 - r % 4 * 8;
        return new s.init(n, t);
      }}, m = l.Utf8 = {stringify: function (e) {
        try {
          return decodeURIComponent(escape(p.stringify(e)));
        } catch (e) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function (e) {
        return p.parse(unescape(encodeURIComponent(e)));
      }}, d = c.BufferedBlockAlgorithm = u.extend({reset: function () {
        this._data = new s.init, this._nDataBytes = 0;
      }, _append: function (e) {
        "string" == typeof e && (e = m.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
      }, _process: function (t) {
        var n, r = this._data, i = r.words, o = r.sigBytes, a = this.blockSize, c = o / (4 * a), u = (c = t ? e.ceil(c) : e.max((0 | c) - this._minBufferSize, 0)) * a, l = e.min(4 * u, o);
        if (u) {
          for (var f = 0; f < u; f += a) this._doProcessBlock(i, f);
          n = i.splice(0, u), r.sigBytes -= l;
        }
        return new s.init(n, l);
      }, clone: function () {
        var e = u.clone.call(this);
        return e._data = this._data.clone(), e;
      }, _minBufferSize: 0}), h = (c.Hasher = d.extend({cfg: u.extend(), init: function (e) {
        this.cfg = this.cfg.extend(e), this.reset();
      }, reset: function () {
        d.reset.call(this), this._doReset();
      }, update: function (e) {
        return this._append(e), this._process(), this;
      }, finalize: function (e) {
        return e && this._append(e), this._doFinalize();
      }, blockSize: 16, _createHelper: function (e) {
        return function (t, n) {
          return new e.init(n).finalize(t);
        };
      }, _createHmacHelper: function (e) {
        return function (t, n) {
          return new h.HMAC.init(e, n).finalize(t);
        };
      }}), a.algo = {});
      return a;
    }(Math), r);
  }, 214: function (e, t, n) {
    var r;
    e.exports = (r = n(249), function (e) {
      var t = r, n = t.lib, i = n.WordArray, o = n.Hasher, a = t.algo, c = [];
      !function () {
        for (var t = 0; t < 64; t++) c[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0;
      }();
      var u = a.MD5 = o.extend({_doReset: function () {
        this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function (e, t) {
        for (var n = 0; n < 16; n++) {
          var r = t + n, i = e[r];
          e[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
        }
        var o = this._hash.words, a = e[t + 0], u = e[t + 1], m = e[t + 2], d = e[t + 3], h = e[t + 4], g = e[t + 5], v = e[t + 6], y = e[t + 7], x = e[t + 8], b = e[t + 9], w = e[t + 10], _ = e[t + 11], A = e[t + 12], S = e[t + 13], E = e[t + 14], T = e[t + 15], k = o[0], O = o[1], P = o[2], C = o[3];
        k = s(k, O, P, C, a, 7, c[0]), C = s(C, k, O, P, u, 12, c[1]), P = s(P, C, k, O, m, 17, c[2]), O = s(O, P, C, k, d, 22, c[3]), k = s(k, O, P, C, h, 7, c[4]), C = s(C, k, O, P, g, 12, c[5]), P = s(P, C, k, O, v, 17, c[6]), O = s(O, P, C, k, y, 22, c[7]), k = s(k, O, P, C, x, 7, c[8]), C = s(C, k, O, P, b, 12, c[9]), P = s(P, C, k, O, w, 17, c[10]), O = s(O, P, C, k, _, 22, c[11]), k = s(k, O, P, C, A, 7, c[12]), C = s(C, k, O, P, S, 12, c[13]), P = s(P, C, k, O, E, 17, c[14]), k = l(k, O = s(O, P, C, k, T, 22, c[15]), P, C, u, 5, c[16]), C = l(C, k, O, P, v, 9, c[17]), P = l(P, C, k, O, _, 14, c[18]), O = l(O, P, C, k, a, 20, c[19]), k = l(k, O, P, C, g, 5, c[20]), C = l(C, k, O, P, w, 9, c[21]), P = l(P, C, k, O, T, 14, c[22]), O = l(O, P, C, k, h, 20, c[23]), k = l(k, O, P, C, b, 5, c[24]), C = l(C, k, O, P, E, 9, c[25]), P = l(P, C, k, O, d, 14, c[26]), O = l(O, P, C, k, x, 20, c[27]), k = l(k, O, P, C, S, 5, c[28]), C = l(C, k, O, P, m, 9, c[29]), P = l(P, C, k, O, y, 14, c[30]), k = f(k, O = l(O, P, C, k, A, 20, c[31]), P, C, g, 4, c[32]), C = f(C, k, O, P, x, 11, c[33]), P = f(P, C, k, O, _, 16, c[34]), O = f(O, P, C, k, E, 23, c[35]), k = f(k, O, P, C, u, 4, c[36]), C = f(C, k, O, P, h, 11, c[37]), P = f(P, C, k, O, y, 16, c[38]), O = f(O, P, C, k, w, 23, c[39]), k = f(k, O, P, C, S, 4, c[40]), C = f(C, k, O, P, a, 11, c[41]), P = f(P, C, k, O, d, 16, c[42]), O = f(O, P, C, k, v, 23, c[43]), k = f(k, O, P, C, b, 4, c[44]), C = f(C, k, O, P, A, 11, c[45]), P = f(P, C, k, O, T, 16, c[46]), k = p(k, O = f(O, P, C, k, m, 23, c[47]), P, C, a, 6, c[48]), C = p(C, k, O, P, y, 10, c[49]), P = p(P, C, k, O, E, 15, c[50]), O = p(O, P, C, k, g, 21, c[51]), k = p(k, O, P, C, A, 6, c[52]), C = p(C, k, O, P, d, 10, c[53]), P = p(P, C, k, O, w, 15, c[54]), O = p(O, P, C, k, u, 21, c[55]), k = p(k, O, P, C, x, 6, c[56]), C = p(C, k, O, P, T, 10, c[57]), P = p(P, C, k, O, v, 15, c[58]), O = p(O, P, C, k, S, 21, c[59]), k = p(k, O, P, C, h, 6, c[60]), C = p(C, k, O, P, _, 10, c[61]), P = p(P, C, k, O, m, 15, c[62]), O = p(O, P, C, k, b, 21, c[63]), o[0] = o[0] + k | 0, o[1] = o[1] + O | 0, o[2] = o[2] + P | 0, o[3] = o[3] + C | 0;
      }, _doFinalize: function () {
        var t = this._data, n = t.words, r = 8 * this._nDataBytes, i = 8 * t.sigBytes;
        n[i >>> 5] |= 128 << 24 - i % 32;
        var o = e.floor(r / 4294967296), a = r;
        n[15 + (i + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), n[14 + (i + 64 >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), t.sigBytes = 4 * (n.length + 1), this._process();
        for (var c = this._hash, u = c.words, s = 0; s < 4; s++) {
          var l = u[s];
          u[s] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8);
        }
        return c;
      }, clone: function () {
        var e = o.clone.call(this);
        return e._hash = this._hash.clone(), e;
      }});
      function s(e, t, n, r, i, o, a) {
        var c = e + (t & n | ~t & r) + i + a;
        return (c << o | c >>> 32 - o) + t;
      }
      function l(e, t, n, r, i, o, a) {
        var c = e + (t & r | n & ~r) + i + a;
        return (c << o | c >>> 32 - o) + t;
      }
      function f(e, t, n, r, i, o, a) {
        var c = e + (t ^ n ^ r) + i + a;
        return (c << o | c >>> 32 - o) + t;
      }
      function p(e, t, n, r, i, o, a) {
        var c = e + (n ^ (t | ~r)) + i + a;
        return (c << o | c >>> 32 - o) + t;
      }
      t.MD5 = o._createHelper(u), t.HmacMD5 = o._createHmacHelper(u);
    }(Math), r.MD5);
  }, 602: module => {
    var t;
    self, t = () => (() => {
      var __webpack_modules__ = {318: e => {
        e.exports = function (e) {
          return e && e.__esModule ? e : {default: e};
        };
      }, 862: (e, t, n) => {
        var r = n(8);
        function i() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap;
          return i = function () {
            return e;
          }, e;
        }
        e.exports = function (e) {
          if (e && e.__esModule) return e;
          if (null === e || "object" !== r(e) && "function" != typeof e) return {default: e};
          var t = i();
          if (t && t.has(e)) return t.get(e);
          var n = {}, o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var a in e) if (Object.prototype.hasOwnProperty.call(e, a)) {
            var c = o ? Object.getOwnPropertyDescriptor(e, a) : null;
            c && (c.get || c.set) ? Object.defineProperty(n, a, c) : n[a] = e[a];
          }
          return n.default = e, t && t.set(e, n), n;
        };
      }, 8: e => {
        function t(n) {
          return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? e.exports = t = function (e) {
            return typeof e;
          } : e.exports = t = function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
          }, t(n);
        }
        e.exports = t;
      }, 406: (e, t, n) => {
        "use strict";
        var r = n(318), i = n(862);
        Object.defineProperty(t, "__esModule", {value: true}), t.default = undefined;
        var o = i(n(853)), a = r(n(184)), c = r(n(282)), u = r(n(662)), s = r(n(628)), l = r(n(722)), f = r(n(366)), p = r(n(577)), m = r(n(753)), d = r(n(708)), h = r(n(477)), g = r(n(9));
        t.default = class {
          constructor() {
            this._I18n = {}, this._Info = {}, this._Uuid = {}, this._Date = null, this._Cover = null, this._Pages = [], this._Images = [], this._Zip = {};
          }
          init(e) {
            if (e instanceof JSZip) return this._Zip = e, this;
            if (this._Info = Object.assign({}, {i18n: "en", title: "undefined", author: "undefined", publisher: "undefined", description: "", tags: []}, e), this._Uuid = {scheme: "uuid", id: o.uuidv4()}, this._Date = o.getISODate(), !c.default[this._Info.i18n]) throw "Unknown Language: ".concat(this._Info.i18n);
            return this._I18n = c.default[this._Info.i18n], this._Zip = new JSZip, this._Zip.file("mimetype", h.default), this._Zip.file("META-INF/container.xml", u.default), this._Zip.file("OEBPS/title-page.html", ejs.render(m.default, {i18n: this._I18n, title: this._Info.title, author: this._Info.author, publisher: this._Info.publisher, description: o.parseDOM(this._Info.description), tags: this._Info.tags}, {client: true})), this;
          }
          static html2text(e, t = false) {
            return o.html2text(e, t);
          }
          date(e) {
            if (e instanceof Date) return this._Date = o.getISODate(e), this;
            throw "Date object is not valid";
          }
          uuid(e) {
            if (o.isEmpty(e)) throw "UUID value is empty";
            {
              let t = "uuid";
              return o.validateUrl(e) && (t = "URI"), this._Uuid = {scheme: t, id: e}, this;
            }
          }
          cover(e) {
            let t, n;
            if (e instanceof Blob) n = e.type, t = o.mime2ext(n); else {
              if (!(e instanceof ArrayBuffer)) throw "Cover data is not valid";
              t = (0, a.default)(new Uint8Array(e)), t && (n = t.mime, t = o.mime2ext(n));
            }
            if (!t) throw "Cover data is not allowed";
            return this._Cover = {type: n, path: "OEBPS/cover-image.".concat(t)}, this._Zip.file(this._Cover.path, e), this._Zip.file("OEBPS/front-cover.html", ejs.render(s.default, {i18n: this._I18n, cover: this._Cover}, {client: true})), this;
          }
          image(e, t) {
            let n, r;
            if (e instanceof Blob) r = e.type, n = o.mime2ext(r); else {
              if (!(e instanceof ArrayBuffer)) throw "Image data is not valid";
              n = (0, a.default)(new Uint8Array(e)), r = n.mime, n && (n = o.mime2ext(r));
            }
            if (!n) throw "Image data is not allowed";
            const i = "assets/".concat(t, ".").concat(n);
            return this._Images[t] = {type: r, path: i}, this._Zip.file("OEBPS/".concat(i), e), this;
          }
          notes(e) {
            if (o.isEmpty(e)) throw "Notes is empty";
            return this._Zip.file("OEBPS/notes.html", ejs.render(l.default, {i18n: this._I18n, notes: o.parseDOM(e)}, {client: true})), this;
          }
          add(e, t, n = this._Pages.length) {
            if (o.isEmpty(e)) throw "Title is empty";
            if (o.isEmpty(t)) throw "Content of ".concat(e, " is empty");
            return Array.isArray(t) || (t = ejs.compile(t, {client: true})({image: this._Images}, e => '<img src="'.concat(e ? e.path : "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=", '" alt=""></img>')), t = o.parseDOM(t)), this._Zip.file("OEBPS/page-".concat(n, ".html"), ejs.render(f.default, {i18n: this._I18n, title: e, content: t}, {client: true})), this._Pages[n] = e, this;
          }
          generate(e = "blob", t) {
            if (!JSZip.support[e]) throw "This browser does not support ".concat(e);
            let n = this._Zip.file("OEBPS/notes.html");
            return n = !!n, this._Zip.file("book.opf", ejs.render(d.default, {i18n: this._I18n, uuid: this._Uuid, date: this._Date, title: this._Info.title, author: this._Info.author, publisher: this._Info.publisher, description: o.html2text(this._Info.description, true), tags: this._Info.tags, cover: this._Cover, pages: this._Pages, notes: n, images: this._Images}, {client: true})), this._Zip.file("OEBPS/table-of-contents.html", ejs.render(p.default, {i18n: this._I18n, pages: this._Pages}, {client: true})), this._Zip.file("toc.ncx", ejs.render(g.default, {i18n: this._I18n, uuid: this._Uuid, title: this._Info.title, author: this._Info.author, pages: this._Pages, notes: n}, {client: true})), this._Zip.generateAsync({type: e, mimeType: h.default, compression: "DEFLATE", compressionOptions: {level: 9}}, t);
          }
        }, e.exports = t.default;
      }, 853: (e, t) => {
        "use strict";
        function n(e, t = false) {
          let n = (new DOMParser).parseFromString("<!doctype html><body>".concat(e), "text/html");
          return t ? n.body.textContent.trim() : (n = (new XMLSerializer).serializeToString(n.body), n = n.replace(/(^<body\s?[^>]*>|<\/body>$)/g, ""), n);
        }
        Object.defineProperty(t, "__esModule", {value: true}), t.uuidv4 = function () {
          return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, e => (e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16));
        }, t.isObject = function (e) {
          const t = typeof e;
          return "function" === t || "object" === t && !!e;
        }, t.isEmpty = function (e) {
          return null === e || "string" == typeof e && !e.trim();
        }, t.getISODate = function (e = new Date) {
          return e.toISOString();
        }, t.parseDOM = n, t.html2text = function (e, t = false) {
          return e = n(e = (e = (e = (e = (e = (e = (e = e.replace(/<style([\s\S]*?)<\/style>/gi, "")).replace(/<script([\s\S]*?)<\/script>/gi, "")).replace(/<\/(div|p|li|dd|h[1-6])>/gi, "\n")).replace(/<(br|hr)\s*[/]?>/gi, "\n")).replace(/<li>/gi, "+ ")).replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n"), true), t && (e = e.replace(/\n+/g, " ")), e;
        }, t.validateUrl = function (e) {
          return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(e);
        }, t.mime2ext = function (e) {
          let t = null;
          switch (e) {
            case "image/jpg":
            case "image/jpeg":
              t = "jpg";
              break;
            case "image/svg+xml":
              t = "svg";
              break;
            case "image/gif":
            case "image/apng":
            case "image/png":
            case "image/webp":
            case "image/bmp":
              t = e.split("/")[1];
              break;
            default:
              t = null;
          }
          return t;
        };
      }, 769: module => {
        "use strict";
        const toBytes = e => [...e].map(e => e.charCodeAt(0)), xpiZipFilename = toBytes("META-INF/mozilla.rsa"), oxmlContentTypes = toBytes("[Content_Types].xml"), oxmlRels = toBytes("_rels/.rels");
        function readUInt64LE(e, t = 0) {
          let n = e[t], r = 1, i = 0;
          for (; ++i < 8;) r *= 256, n += e[t + i] * r;
          return n;
        }
        const fileType = e => {
          if (!(e instanceof Uint8Array || e instanceof ArrayBuffer || Buffer.isBuffer(e))) throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof e}\``);
          const t = e instanceof Uint8Array ? e : new Uint8Array(e);
          if (!(t && t.length > 1)) return null;
          const n = (e, n) => {
            n = Object.assign({offset: 0}, n);
            for (let r = 0; r < e.length; r++) if (n.mask) {
              if (e[r] !== (n.mask[r] & t[r + n.offset])) return false;
            } else if (e[r] !== t[r + n.offset]) return false;
            return true;
          }, r = (e, t) => n(toBytes(e), t);
          if (n([255, 216, 255])) return {ext: "jpg", mime: "image/jpeg"};
          if (n([137, 80, 78, 71, 13, 10, 26, 10])) return {ext: "png", mime: "image/png"};
          if (n([71, 73, 70])) return {ext: "gif", mime: "image/gif"};
          if (n([87, 69, 66, 80], {offset: 8})) return {ext: "webp", mime: "image/webp"};
          if (n([70, 76, 73, 70])) return {ext: "flif", mime: "image/flif"};
          if ((n([73, 73, 42, 0]) || n([77, 77, 0, 42])) && n([67, 82], {offset: 8})) return {ext: "cr2", mime: "image/x-canon-cr2"};
          if (n([73, 73, 42, 0]) || n([77, 77, 0, 42])) return {ext: "tif", mime: "image/tiff"};
          if (n([66, 77])) return {ext: "bmp", mime: "image/bmp"};
          if (n([73, 73, 188])) return {ext: "jxr", mime: "image/vnd.ms-photo"};
          if (n([56, 66, 80, 83])) return {ext: "psd", mime: "image/vnd.adobe.photoshop"};
          if (n([80, 75, 3, 4])) {
            if (n([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], {offset: 30})) return {ext: "epub", mime: "application/epub+zip"};
            if (n(xpiZipFilename, {offset: 30})) return {ext: "xpi", mime: "application/x-xpinstall"};
            if (r("mimetypeapplication/vnd.oasis.opendocument.text", {offset: 30})) return {ext: "odt", mime: "application/vnd.oasis.opendocument.text"};
            if (r("mimetypeapplication/vnd.oasis.opendocument.spreadsheet", {offset: 30})) return {ext: "ods", mime: "application/vnd.oasis.opendocument.spreadsheet"};
            if (r("mimetypeapplication/vnd.oasis.opendocument.presentation", {offset: 30})) return {ext: "odp", mime: "application/vnd.oasis.opendocument.presentation"};
            const e = (e, t = 0) => e.findIndex((e, n, r) => n >= t && 80 === r[n] && 75 === r[n + 1] && 3 === r[n + 2] && 4 === r[n + 3]);
            let i = 0, o = false, a = null;
            do {
              const c = i + 30;
              if (o || (o = n(oxmlContentTypes, {offset: c}) || n(oxmlRels, {offset: c})), a || (r("word/", {offset: c}) ? a = {ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"} : r("ppt/", {offset: c}) ? a = {ext: "pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"} : r("xl/", {offset: c}) && (a = {ext: "xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})), o && a) return a;
              i = e(t, c);
            } while (i >= 0);
            if (a) return a;
          }
          if (n([80, 75]) && (3 === t[2] || 5 === t[2] || 7 === t[2]) && (4 === t[3] || 6 === t[3] || 8 === t[3])) return {ext: "zip", mime: "application/zip"};
          if (n([117, 115, 116, 97, 114], {offset: 257})) return {ext: "tar", mime: "application/x-tar"};
          if (n([82, 97, 114, 33, 26, 7]) && (0 === t[6] || 1 === t[6])) return {ext: "rar", mime: "application/x-rar-compressed"};
          if (n([31, 139, 8])) return {ext: "gz", mime: "application/gzip"};
          if (n([66, 90, 104])) return {ext: "bz2", mime: "application/x-bzip2"};
          if (n([55, 122, 188, 175, 39, 28])) return {ext: "7z", mime: "application/x-7z-compressed"};
          if (n([120, 1])) return {ext: "dmg", mime: "application/x-apple-diskimage"};
          if (n([51, 103, 112, 53]) || n([0, 0, 0]) && n([102, 116, 121, 112], {offset: 4}) && (n([109, 112, 52, 49], {offset: 8}) || n([109, 112, 52, 50], {offset: 8}) || n([105, 115, 111, 109], {offset: 8}) || n([105, 115, 111, 50], {offset: 8}) || n([109, 109, 112, 52], {offset: 8}) || n([77, 52, 86], {offset: 8}) || n([100, 97, 115, 104], {offset: 8}))) return {ext: "mp4", mime: "video/mp4"};
          if (n([77, 84, 104, 100])) return {ext: "mid", mime: "audio/midi"};
          if (n([26, 69, 223, 163])) {
            const e = t.subarray(4, 4100), n = e.findIndex((e, t, n) => 66 === n[t] && 130 === n[t + 1]);
            if (-1 !== n) {
              const t = n + 3, r = n => [...n].every((n, r) => e[t + r] === n.charCodeAt(0));
              if (r("matroska")) return {ext: "mkv", mime: "video/x-matroska"};
              if (r("webm")) return {ext: "webm", mime: "video/webm"};
            }
          }
          if (n([0, 0, 0, 20, 102, 116, 121, 112, 113, 116, 32, 32]) || n([102, 114, 101, 101], {offset: 4}) || n([102, 116, 121, 112, 113, 116, 32, 32], {offset: 4}) || n([109, 100, 97, 116], {offset: 4}) || n([109, 111, 111, 118], {offset: 4}) || n([119, 105, 100, 101], {offset: 4})) return {ext: "mov", mime: "video/quicktime"};
          if (n([82, 73, 70, 70])) {
            if (n([65, 86, 73], {offset: 8})) return {ext: "avi", mime: "video/vnd.avi"};
            if (n([87, 65, 86, 69], {offset: 8})) return {ext: "wav", mime: "audio/vnd.wave"};
            if (n([81, 76, 67, 77], {offset: 8})) return {ext: "qcp", mime: "audio/qcelp"};
          }
          if (n([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
            let e = 30;
            do {
              const r = readUInt64LE(t, e + 16);
              if (n([145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101], {offset: e})) {
                if (n([64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43], {offset: e + 24})) return {ext: "wma", mime: "audio/x-ms-wma"};
                if (n([192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43], {offset: e + 24})) return {ext: "wmv", mime: "video/x-ms-asf"};
                break;
              }
              e += r;
            } while (e + 24 <= t.length);
            return {ext: "asf", mime: "application/vnd.ms-asf"};
          }
          if (n([0, 0, 1, 186]) || n([0, 0, 1, 179])) return {ext: "mpg", mime: "video/mpeg"};
          if (n([102, 116, 121, 112, 51, 103], {offset: 4})) return {ext: "3gp", mime: "video/3gpp"};
          for (let e = 0; e < 2 && e < t.length - 16; e++) {
            if (n([73, 68, 51], {offset: e}) || n([255, 226], {offset: e, mask: [255, 226]})) return {ext: "mp3", mime: "audio/mpeg"};
            if (n([255, 228], {offset: e, mask: [255, 228]})) return {ext: "mp2", mime: "audio/mpeg"};
            if (n([255, 248], {offset: e, mask: [255, 252]})) return {ext: "mp2", mime: "audio/mpeg"};
            if (n([255, 240], {offset: e, mask: [255, 252]})) return {ext: "mp4", mime: "audio/mpeg"};
          }
          if (n([102, 116, 121, 112, 77, 52, 65], {offset: 4})) return {ext: "m4a", mime: "audio/mp4"};
          if (n([79, 112, 117, 115, 72, 101, 97, 100], {offset: 28})) return {ext: "opus", mime: "audio/opus"};
          if (n([79, 103, 103, 83])) return n([128, 116, 104, 101, 111, 114, 97], {offset: 28}) ? {ext: "ogv", mime: "video/ogg"} : n([1, 118, 105, 100, 101, 111, 0], {offset: 28}) ? {ext: "ogm", mime: "video/ogg"} : n([127, 70, 76, 65, 67], {offset: 28}) ? {ext: "oga", mime: "audio/ogg"} : n([83, 112, 101, 101, 120, 32, 32], {offset: 28}) ? {ext: "spx", mime: "audio/ogg"} : n([1, 118, 111, 114, 98, 105, 115], {offset: 28}) ? {ext: "ogg", mime: "audio/ogg"} : {ext: "ogx", mime: "application/ogg"};
          if (n([102, 76, 97, 67])) return {ext: "flac", mime: "audio/x-flac"};
          if (n([77, 65, 67, 32])) return {ext: "ape", mime: "audio/ape"};
          if (n([119, 118, 112, 107])) return {ext: "wv", mime: "audio/wavpack"};
          if (n([35, 33, 65, 77, 82, 10])) return {ext: "amr", mime: "audio/amr"};
          if (n([37, 80, 68, 70])) return {ext: "pdf", mime: "application/pdf"};
          if (n([77, 90])) return {ext: "exe", mime: "application/x-msdownload"};
          if ((67 === t[0] || 70 === t[0]) && n([87, 83], {offset: 1})) return {ext: "swf", mime: "application/x-shockwave-flash"};
          if (n([123, 92, 114, 116, 102])) return {ext: "rtf", mime: "application/rtf"};
          if (n([0, 97, 115, 109])) return {ext: "wasm", mime: "application/wasm"};
          if (n([119, 79, 70, 70]) && (n([0, 1, 0, 0], {offset: 4}) || n([79, 84, 84, 79], {offset: 4}))) return {ext: "woff", mime: "font/woff"};
          if (n([119, 79, 70, 50]) && (n([0, 1, 0, 0], {offset: 4}) || n([79, 84, 84, 79], {offset: 4}))) return {ext: "woff2", mime: "font/woff2"};
          if (n([76, 80], {offset: 34}) && (n([0, 0, 1], {offset: 8}) || n([1, 0, 2], {offset: 8}) || n([2, 0, 2], {offset: 8}))) return {ext: "eot", mime: "application/vnd.ms-fontobject"};
          if (n([0, 1, 0, 0, 0])) return {ext: "ttf", mime: "font/ttf"};
          if (n([79, 84, 84, 79, 0])) return {ext: "otf", mime: "font/otf"};
          if (n([0, 0, 1, 0])) return {ext: "ico", mime: "image/x-icon"};
          if (n([0, 0, 2, 0])) return {ext: "cur", mime: "image/x-icon"};
          if (n([70, 76, 86, 1])) return {ext: "flv", mime: "video/x-flv"};
          if (n([37, 33])) return {ext: "ps", mime: "application/postscript"};
          if (n([253, 55, 122, 88, 90, 0])) return {ext: "xz", mime: "application/x-xz"};
          if (n([83, 81, 76, 105])) return {ext: "sqlite", mime: "application/x-sqlite3"};
          if (n([78, 69, 83, 26])) return {ext: "nes", mime: "application/x-nintendo-nes-rom"};
          if (n([67, 114, 50, 52])) return {ext: "crx", mime: "application/x-google-chrome-extension"};
          if (n([77, 83, 67, 70]) || n([73, 83, 99, 40])) return {ext: "cab", mime: "application/vnd.ms-cab-compressed"};
          if (n([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) return {ext: "deb", mime: "application/x-deb"};
          if (n([33, 60, 97, 114, 99, 104, 62])) return {ext: "ar", mime: "application/x-unix-archive"};
          if (n([237, 171, 238, 219])) return {ext: "rpm", mime: "application/x-rpm"};
          if (n([31, 160]) || n([31, 157])) return {ext: "Z", mime: "application/x-compress"};
          if (n([76, 90, 73, 80])) return {ext: "lz", mime: "application/x-lzip"};
          if (n([208, 207, 17, 224, 161, 177, 26, 225])) return {ext: "msi", mime: "application/x-msi"};
          if (n([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) return {ext: "mxf", mime: "application/mxf"};
          if (n([71], {offset: 4}) && (n([71], {offset: 192}) || n([71], {offset: 196}))) return {ext: "mts", mime: "video/mp2t"};
          if (n([66, 76, 69, 78, 68, 69, 82])) return {ext: "blend", mime: "application/x-blender"};
          if (n([66, 80, 71, 251])) return {ext: "bpg", mime: "image/bpg"};
          if (n([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
            if (n([106, 112, 50, 32], {offset: 20})) return {ext: "jp2", mime: "image/jp2"};
            if (n([106, 112, 120, 32], {offset: 20})) return {ext: "jpx", mime: "image/jpx"};
            if (n([106, 112, 109, 32], {offset: 20})) return {ext: "jpm", mime: "image/jpm"};
            if (n([109, 106, 112, 50], {offset: 20})) return {ext: "mj2", mime: "image/mj2"};
          }
          if (n([70, 79, 82, 77])) return {ext: "aif", mime: "audio/aiff"};
          if (r("<?xml ")) return {ext: "xml", mime: "application/xml"};
          if (n([66, 79, 79, 75, 77, 79, 66, 73], {offset: 60})) return {ext: "mobi", mime: "application/x-mobipocket-ebook"};
          if (n([102, 116, 121, 112], {offset: 4})) {
            if (n([109, 105, 102, 49], {offset: 8})) return {ext: "heic", mime: "image/heif"};
            if (n([109, 115, 102, 49], {offset: 8})) return {ext: "heic", mime: "image/heif-sequence"};
            if (n([104, 101, 105, 99], {offset: 8}) || n([104, 101, 105, 120], {offset: 8})) return {ext: "heic", mime: "image/heic"};
            if (n([104, 101, 118, 99], {offset: 8}) || n([104, 101, 118, 120], {offset: 8})) return {ext: "heic", mime: "image/heic-sequence"};
          }
          return n([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10]) ? {ext: "ktx", mime: "image/ktx"} : n([68, 73, 67, 77], {offset: 128}) ? {ext: "dcm", mime: "application/dicom"} : n([77, 80, 43]) || n([77, 80, 67, 75]) ? {ext: "mpc", mime: "audio/x-musepack"} : n([66, 69, 71, 73, 78, 58]) ? {ext: "ics", mime: "text/calendar"} : n([103, 108, 84, 70, 2, 0, 0, 0]) ? {ext: "glb", mime: "model/gltf-binary"} : n([212, 195, 178, 161]) || n([161, 178, 195, 212]) ? {ext: "pcap", mime: "application/vnd.tcpdump.pcap"} : null;
        };
        module.exports = fileType, module.exports.default = fileType, Object.defineProperty(fileType, "minimumBytes", {value: 4100}), module.exports.stream = readableStream => new Promise((resolve, reject) => {
          const stream = eval("require")("stream");
          readableStream.once("readable", () => {
            const e = new stream.PassThrough, t = readableStream.read(module.exports.minimumBytes) || readableStream.read();
            try {
              e.fileType = fileType(t);
            } catch (e) {
              reject(e);
            }
            readableStream.unshift(t), stream.pipeline ? resolve(stream.pipeline(readableStream, e, () => {})) : resolve(readableStream.pipe(e));
          });
        });
      }, 184: (e, t, n) => {
        "use strict";
        const r = n(769), i = new Set(["jpg", "png", "gif", "webp", "flif", "cr2", "tif", "bmp", "jxr", "psd", "ico", "bpg", "jp2", "jpm", "jpx", "heic", "cur", "dcm"]), o = e => {
          const t = r(e);
          return i.has(t && t.ext) ? t : null;
        };
        e.exports = o, e.exports.default = o, Object.defineProperty(o, "minimumBytes", {value: r.minimumBytes});
      }, 662: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n<rootfiles>\n<rootfile full-path="book.opf" media-type="application/oebps-package+xml"/>\n</rootfiles>\n</container>';
      }, 628: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%= i18n.code %>">\n<head>\n<title><%= i18n.cover %></title>\n<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8"/>\n</head>\n<body>\n<div id="cover-image">\n<img src="../<%= cover.path %>" alt="<%= i18n.cover %>"/>\n</div>\n</body>\n</html>\n';
      }, 722: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%= i18n.code %>">\n<head>\n<title><%= i18n.note %></title>\n<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8"/>\n</head>\n<body>\n<div id="notes-page">\n<div class="ugc">\n<%- notes %>\n</div>\n</div>\n</body>\n</html>\n';
      }, 366: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%= i18n.code %>">\n<head>\n<title><%= title %></title>\n<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8"/>\n</head>\n<body>\n<div class="chapter type-1">\n<div class="chapter-title-wrap">\n<h2 class="chapter-title"><%= title %></h2>\n</div>\n<div class="ugc chapter-ugc">\n<% if (Array.isArray(content)) { %>\n<% content.forEach(item => { %>\n<p class="indent"><%= item %></p>\n<% }); %>\n<% } else { %>\n<%- content %>\n<% } %>\n</div>\n</div>\n</body>\n</html>\n';
      }, 577: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%= i18n.code %>">\n<head>\n<title><%= i18n.toc %></title>\n<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8"/>\n</head>\n<body>\n<div id="toc">\n<h1><%= i18n.toc %></h1>\n<ul>\n<% pages.forEach((title, index) => { %>\n<li class="chaptertype-1">\n<a href="page-<%= index %>.html">\n<span class="toc-chapter-title"><%= title %></span>\n</a>\n</li>\n<% }); %>\n</ul>\n</div>\n</body>\n</html>\n';
      }, 753: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%= i18n.code %>">\n<head>\n<title><%= i18n.info %></title>\n<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8"/>\n</head>\n<body>\n<div id="title-page">\n<h1 class="title"><%= title %></h1>\n<h2 class="subtitle"></h2>\n<h3 class="author"><%= author %></h3>\n<h4 class="publisher"><%= publisher %></h4>\n</div>\n<% if (Array.isArray(tags) && tags.length) { %>\n<div class="part-title-wrap">\n<% tags = tags.join(\'</code>, <code>\'); %>\n<code><%- tags %></code>\n</div>\n<% } %>\n<% if (description) { %>\n<div class="ugc">\n<%- description %>\n</div>\n<% } %>\n</body>\n</html>\n';
      }, 708: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="PrimaryID">\n<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">\n<dc:title><%= title %></dc:title>\n<dc:language><%= i18n.code %></dc:language>\n<dc:identifier id="PrimaryID" opf:scheme="<%= uuid.scheme %>"><%= uuid.id %></dc:identifier>\n<dc:date opf:event="publication"><%= date %></dc:date>\n<% if (description) { %>\n<dc:description><%= description %></dc:description>\n<% } %>\n<dc:creator opf:role="aut"><%= author %></dc:creator>\n<dc:publisher><%= publisher %></dc:publisher>\n<% if (cover) { %>\n<meta name="cover" content="cover-image"/>\n<% } %>\n<% if (Array.isArray(tags) && tags.length) tags.forEach(tag => { %>\n<dc:subject><%= tag %></dc:subject>\n<% }); %>\n</metadata>\n<manifest>\n<% if (cover) { %>\n<item id="front-cover" href="OEBPS/front-cover.html" media-type="application/xhtml+xml"/>\n<% } %>\n<item id="title-page" href="OEBPS/title-page.html" media-type="application/xhtml+xml"/>\n<item id="notes" href="OEBPS/notes.html" media-type="application/xhtml+xml"/>\n<item id="table-of-contents" href="OEBPS/table-of-contents.html" media-type="application/xhtml+xml"/>\n<% pages.forEach((page, index) => { %>\n<item id="page-<%= index %>" href="OEBPS/page-<%= index %>.html" media-type="application/xhtml+xml"/>\n<% }); %>\n<% if (cover) { %>\n<item id="cover-image" href="<%= cover.path %>" media-type="<%= cover.type %>" properties="cover-image"/>\n<% } %>\n<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n<% Object.keys(images).forEach(name => { %>\n<item id="<%= name %>" href="OEBPS/<%= images[name].path %>" media-type="<%= images[name].type %>"/>\n<% }); %>\n</manifest>\n<spine toc="ncx">\n<% if (cover) { %>\n<itemref idref="front-cover" linear="no"/>\n<% } %>\n<itemref idref="title-page" linear="yes"/>\n<itemref idref="table-of-contents" linear="yes"/>\n<% pages.forEach((page, index) => { %>\n<itemref idref="page-<%= index %>" linear="yes"/>\n<% }); %>\n<% if (notes) { %>\n<itemref idref="notes" linear="yes"/>\n<% } %>\n</spine>\n<guide>\n<% if (cover) { %>\n<reference type="cover" title="<%= i18n.cover %>" href="OEBPS/front-cover.html"/>\n<% } %>\n<reference type="toc" title="<%= i18n.toc %>" href="OEBPS/table-of-contents.html"/>\n</guide>\n</package>\n';
      }, 477: e => {
        e.exports = "application/epub+zip";
      }, 9: e => {
        e.exports = '<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">\n<ncx version="2005-1" xml:lang="<%= i18n.code %>" xmlns="http://www.daisy.org/z3986/2005/ncx/">\n<head>\n<meta name="dtb:uid" content="<%= uuid.id %>"/>\n<meta name="dtb:depth" content="2"/>\n<meta name="dtb:totalPageCount" content="0"/>\n<meta name="dtb:maxPageNumber" content="0"/>\n</head>\n<docTitle>\n<text><%= title %></text>\n</docTitle>\n<docAuthor>\n<text><%= author %></text>\n</docAuthor>\n<navMap>\n<navPoint id="title-page" playOrder="1">\n<navLabel>\n<text><%= i18n.info %></text>\n</navLabel>\n<content src="OEBPS/title-page.html"/>\n</navPoint>\n<navPoint id="table-of-contents" playOrder="2">\n<navLabel>\n<text><%= i18n.toc %></text>\n</navLabel>\n<content src="OEBPS/table-of-contents.html"/>\n</navPoint>\n<% pages.forEach((title, index) => { %>\n<navPoint id="page-<%= index %>" playOrder="<%= (index + 3) %>">\n<navLabel>\n<text><%= title %></text>\n</navLabel>\n<content src="OEBPS/page-<%= index %>.html"/>\n</navPoint>\n<% }); %>\n<% if (notes) { %>\n<navPoint id="notes-page" playOrder="2">\n<navLabel>\n<text><%= i18n.note %></text>\n</navLabel>\n<content src="OEBPS/notes.html"/>\n</navPoint>\n<% } %>\n</navMap>\n</ncx>\n';
      }, 282: e => {
        "use strict";
        e.exports = JSON.parse('{"en":{"code":"en","cover":"Cover","toc":"Table of Contents","info":"Information","note":"Notes"},"vi":{"code":"vi","cover":"Bìa sách","toc":"Mục lục","info":"Giới thiệu","note":"Ghi chú"},"hi":{"code":"hi","cover":"आवरण","toc":"विषय - सूची","info":"जानकारी","note":"टिप्पणियाँ"}}');
      }}, __webpack_module_cache__ = {};
      function __nested_webpack_require_24993__(e) {
        var t = __webpack_module_cache__[e];
        if (undefined !== t) return t.exports;
        var n = __webpack_module_cache__[e] = {exports: {}};
        return __webpack_modules__[e](n, n.exports, __nested_webpack_require_24993__), n.exports;
      }
      var __webpack_exports__ = __nested_webpack_require_24993__(406);
      return __webpack_exports__;
    })(), module.exports = t();
  }, 480: () => {}}, __webpack_module_cache__ = {};
  function __webpack_require__(e) {
    var t = __webpack_module_cache__[e];
    if (undefined !== t) return t.exports;
    var n = __webpack_module_cache__[e] = {exports: {}};
    return __webpack_modules__[e].call(n.exports, n, n.exports, __webpack_require__), n.exports;
  }
  __webpack_require__.n = e => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return __webpack_require__.d(t, {a: t}), t;
  }, __webpack_require__.d = (e, t) => {
    for (var n in t) __webpack_require__.o(t, n) && !__webpack_require__.o(e, n) && Object.defineProperty(e, n, {enumerable: true, get: t[n]});
  }, __webpack_require__.g = function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  }(), __webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  var __webpack_exports__ = {};
  (() => {
    "use strict";
    var e, t = '[ERROR] Error on "%s"', n = function () {
      function e(e, t) {
        this.name = e, this.executeFunction = t;
      }
      return e.prototype.run = function () {
        for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
        this.name && console.log(this.name);
        try {
          return this.executeFunction.apply(null, e);
        } catch (e) {
          var r = t.replace("%s", this.name);
          throw console.error(r), e;
        }
      }, e;
    }(), r = function () {
      function e() {
        this.stepsFlow = [];
      }
      return e.prototype.addStep = function (e, t) {
        undefined === t && (t = []);
        for (var n = [], r = 0, i = t; r < i.length; r++) {
          for (var o = i[r], a = false, c = 0, u = this.stepsFlow.length; c < u; c++) if (o === this.stepsFlow[c].step) {
            n.push(c), a = true;
            break;
          }
          if (!a) throw new Error("Failed to create execution dependency.");
        }
        this.stepsFlow.push({step: e, dependenciesIndex: n});
      }, e.prototype.process = function (e, t) {
        return n = this, r = undefined, o = function () {
          var n, r, i, o, a, c, u, s, l, f, p, m;
          return function (e, t) {
            var n, r, i, o, a = {label: 0, sent: function () {
              if (1 & i[0]) throw i[1];
              return i[1];
            }, trys: [], ops: []};
            return o = {next: c(0), throw: c(1), return: c(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
              return this;
            }), o;
            function c(c) {
              return function (u) {
                return function (c) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; o && (o = 0, c[0] && (a = 0)), a;) try {
                    if (n = 1, r && (i = 2 & c[0] ? r.return : c[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, c[1])).done) return i;
                    switch (r = 0, i && (c = [2 & c[0], i.value]), c[0]) {
                      case 0:
                      case 1:
                        i = c;
                        break;
                      case 4:
                        return a.label++, {value: c[1], done: false};
                      case 5:
                        a.label++, r = c[1], c = [0];
                        continue;
                      case 7:
                        c = a.ops.pop(), a.trys.pop();
                        continue;
                      default:
                        if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                          a = 0;
                          continue;
                        }
                        if (3 === c[0] && (!i || c[1] > i[0] && c[1] < i[3])) {
                          a.label = c[1];
                          break;
                        }
                        if (6 === c[0] && a.label < i[1]) {
                          a.label = i[1], i = c;
                          break;
                        }
                        if (i && a.label < i[2]) {
                          a.label = i[2], a.ops.push(c);
                          break;
                        }
                        i[2] && a.ops.pop(), a.trys.pop();
                        continue;
                    }
                    c = t.call(e, a);
                  } catch (e) {
                    c = [6, e], r = 0;
                  } finally {
                    n = i = 0;
                  }
                  if (5 & c[0]) throw c[1];
                  return {value: c[0] ? c[1] : undefined, done: true};
                }([c, u]);
              };
            }
          }(this, function (d) {
            switch (d.label) {
              case 0:
                n = this.stepsFlow.length, r = [], i = null, t(n), o = 0, d.label = 1;
              case 1:
                if (!(o < n)) return [3, 6];
                for (a = this.stepsFlow[o], c = [], u = 0, s = a.dependenciesIndex; u < s.length; u++) l = s[u], c.push(r[l]);
                return f = a.step, (i = f.run.apply(f, c)) instanceof Promise ? (m = (p = r).push, [4, i]) : [3, 3];
              case 2:
                return m.apply(p, [d.sent()]), [3, 4];
              case 3:
                r.push(i), d.label = 4;
              case 4:
                e(o + 1), d.label = 5;
              case 5:
                return o++, [3, 1];
              case 6:
                return [2, i];
            }
          });
        }, new ((i = undefined) || (i = Promise))(function (e, t) {
          function a(e) {
            try {
              u(o.next(e));
            } catch (e) {
              t(e);
            }
          }
          function c(e) {
            try {
              u(o.throw(e));
            } catch (e) {
              t(e);
            }
          }
          function u(t) {
            var n;
            t.done ? e(t.value) : (n = t.value, n instanceof i ? n : new i(function (e) {
              e(n);
            })).then(a, c);
          }
          u((o = o.apply(n, r || [])).next());
        });
        var n, r, i, o;
      }, e;
    }(), i = (e = function (t, n) {
      return e = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
        e.__proto__ = t;
      } || function (e, t) {
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      }, e(t, n);
    }, function (t, n) {
      if ("function" != typeof n && null !== n) throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
      function r() {
        this.constructor = t;
      }
      e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r);
    });
    const o = function (e) {
      return i(t, e), t;
    }(Error);
    function a(e) {
      if ("undefined" == typeof AbortController) return fetch(e).then(function (t) {
        if (!t.ok) throw new o(e);
        return t;
      });
      var t = new AbortController, n = {method: "GET", signal: t.signal}, r = setTimeout(function () {
        return t.abort();
      }, 1e4);
      return fetch(e, n).then(function (t) {
        if (clearTimeout(r), !t.ok) throw new o(e);
        return t;
      }).catch(function (e) {
        throw clearTimeout(r), e;
      });
    }
    const c = function () {
      function e() {}
      return e.prototype.requestTextContent = function (t) {
        return e.requestUrl(t).then(function (e) {
          return e.text();
        });
      }, e.prototype.loadFileFrom = function (t) {
        return e.requestUrl(t).then(function (e) {
          return e.blob();
        });
      }, e.requestUrl = function (e) {
        return a(e);
      }, e;
    }(), u = new c;
    var s = function () {
      var e = function (t, n) {
        return e = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        }, e(t, n);
      };
      return function (t, n) {
        if ("function" != typeof n && null !== n) throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function r() {
          this.constructor = t;
        }
        e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r);
      };
    }();
    const l = function (e) {
      function t(t) {
        var n = e.call(this) || this;
        return n.proxyURL = t, n;
      }
      return s(t, e), t.prototype.requestTextContent = function (t) {
        return e.prototype.requestTextContent.call(this, this.generateProxyUrl(t));
      }, t.prototype.loadFileFrom = function (t) {
        return e.prototype.loadFileFrom.call(this, this.generateProxyUrl(t));
      }, t.prototype.generateProxyUrl = function (e) {
        return this.proxyURL + encodeURIComponent(e);
      }, t;
    }(c);
    var f = [new l("https://proxy.mangaraiku.eu.org/?url="), new l("https://api.codetabs.com/v1/proxy?quest="), new (function () {
      function e() {}
      return e.prototype.requestTextContent = function (t) {
        return e.requestUrl(t).then(function (e) {
          return e.contents;
        });
      }, e.prototype.loadFileFrom = function (e) {
        return this.requestTextContent(e).then(function (e) {
          return fetch(e).then(function (e) {
            return e.blob();
          });
        });
      }, e.requestUrl = function (e) {
        return a("https://api.allorigins.win/get?url=" + encodeURIComponent(e)).then(function (e) {
          return e.json();
        }).then(function (t) {
          var n = t.status.http_code;
          if (n < 200 && n > 299) throw new o(e);
          return t;
        });
      }, e;
    }())];
    function p(e) {
      for (var t = f.concat([]).sort(function () {
        return Math.random() > Math.random() ? 1 : -1;
      }), n = e(u), r = function (t) {
        n = n.catch(function (n) {
          return e(t);
        });
      }, i = 0, o = t; i < o.length; i++) r(o[i]);
      return n;
    }
    const m = new n("Converting downloaded text to DOM", function (e) {
      return (new DOMParser).parseFromString(e, "text/html");
    });
    function d(e) {
      var t = e.querySelector('meta[itemprop="datePublished"][content]');
      if (t) try {
        return new Date(t.getAttribute("content"));
      } catch (e) {}
      var n = e.querySelector('time[itemprop="startDate"][datetime]');
      if (n) try {
        return new Date(n.getAttribute("datetime"));
      } catch (e) {}
      var r = x(e, ["article:published_time", "article:modified_time", "book:release_date", "og:article:published_time", "og:article:modified_time", "og:book:release_date"]);
      if (r) try {
        return new Date(r);
      } catch (e) {}
      return new Date;
    }
    function h(e) {
      var t = x(e, ["author"]);
      if (t) return t;
      var n = e.querySelector('[itemprop="author"] meta[itemprop="name"][content]');
      if (n) return n.getAttribute("content");
      var r = e.querySelector('[itemprop="author"]');
      return r ? r.textContent : "";
    }
    function g(e) {
      var t = e.querySelector('[itemprop="publisher"] meta[itemprop="name"][content]');
      return t ? t.getAttribute("content") : x(e, ["publisher", "owner", "copyright", "og:site_name"]);
    }
    function y(e) {
      var t = x(e, ["news_keywords", "keywords"]);
      return t ? t.split(/\s*,\s*/) : [];
    }
    function x(e, t) {
      for (var n = 0, r = t; n < r.length; n++) {
        var i = r[n], o = e.querySelector('meta[name="'.concat(i, '"][content]'));
        if (o) {
          var a = o.getAttribute("content").trim();
          if (a) return a;
        }
      }
      return null;
    }
    const b = new n("Retrieving metadata from HTML document", function (e, t) {
      return {title: e.title, date: d(e), author: h(e), publisher: g(e) || t, uuid: t, description: x(e, ["description", "og:description", "subtitle", "abstract"]) || "", tags: y(e)};
    });
    var w = [].concat(["map", "embed", "object", "video", "audio", "iframe", "canvas", "applet", "frameset", "track", "portal", "source", "frame", "param", "shadow"], ["button", "input", "textarea", "select", "output", "datalist", "keygen"], ["base", "script", "meta", "link", "style", "template", "slot"], ["menu", "command", "nav", "menuitem"], ["svg"]);
    function _(e) {
      for (var t = e.length - 1; t >= 0; t--) e[t].remove();
    }
    const A = new n("Removing unused HTML elements", function (e) {
      !function (e, t) {
        for (var n = 0, r = t; n < r.length; n++) {
          var i = r[n];
          _(e.getElementsByTagName(i));
        }
      }(e, w);
    }), S = new n("Removing HTML hidden elements", function (e) {
      for (var t = e.querySelectorAll("[hidden]"), n = 0, r = Array.from(t); n < r.length; n++) r[n].remove();
    }), E = new n("Removing all HTML comments", function (e) {
      for (var t, n = [], r = e.createNodeIterator(e.documentElement, NodeFilter.SHOW_COMMENT, function () {
        return NodeFilter.FILTER_ACCEPT;
      }); t = r.nextNode();) n.push(t);
      for (var i = 0, o = n; i < o.length; i++) o[i].remove();
    });
    var T = ["SPAN", "ABBR", "CITE", "EM", "I", "B", "SUB", "SUP", "SMALL", "STRONG", "MARK", "DEL", "S", "CODE", "P", "OL", "UL", "LI", "DIV", "PRE", "BLOCKQUOTE", "LABEL", "ASIDE", "ADDRESS", "H1", "H2", "H3", "H4", "H5", "H6", "MAIN", "SECTION", "HEADER", "ARTICLE", "FOOTER", "SUMMARY", "DETAILS", "TABLE", "CAPTION", "THEAD", "TBODY", "TFOOT"];
    function k(e) {
      if (function (e) {
        return -1 !== T.indexOf(e.tagName) && !e.innerHTML.trim();
      }(e)) {
        var t = e.parentElement;
        e.remove(), k(t);
      }
    }
    const O = new n("Removing empty HTML elements", function (e) {
      for (var t, n = [], r = e.createNodeIterator(e.documentElement, NodeFilter.SHOW_ELEMENT, function () {
        return NodeFilter.FILTER_ACCEPT;
      }); t = r.nextNode();) n.push(t);
      for (var i = 0, o = n; i < o.length; i++) k(o[i]);
    });
    function P(e, t) {
      t(e);
      for (var n = 0, r = Array.from(e.children); n < r.length; n++) P(r[n], t);
    }
    const C = new n("Removing custom attributes", function (e) {
      !function (e, t) {
        P(e.documentElement, function (e) {
          for (var t = [], n = 0, r = Array.from(e.attributes); n < r.length; n++) 0 === (a = r[n]).name.indexOf("data-") && t.push(a);
          for (var i = 0, o = t; i < o.length; i++) {
            var a = o[i];
            e.removeAttribute(a.name);
          }
        });
      }(e);
    });
    var B = [].concat(["onafterprint", "onbeforeprint", "onbeforeunload", "onerror", "onhashchange", "onload", "onmessage", "onoffline", "ononline", "onpagehide", "onpageshow", "onpopstate", "onresize", "onstorage", "onunload"], ["onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "oninvalid", "onreset", "onsearch", "onselect", "onsubmit"], ["onkeydown", "onkeypress", "onkeyup"], ["onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onwheel"], ["ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "onscroll"], ["oncopy", "oncut", "onpaste"], ["ontoggle"]), D = [].concat(["style", "class"], ["background", "bgcolor", "border"], B, ["contextmenu", "draggable", "tabindex", "for", "autocomplete", "capture", "contenteditable", "crossorigin", "dirname", "enterkeyhint", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "inputmode", "list", "maxlength", "minlength", "max", "min", "novalidate", "pattern", "readonly", "required", "spellcheck", "step", "usemap", "autofocus"], ["loading", "ping", "slot", "sizes", "decoding", "crossorigin", "elementtiming", "fetchpriority", "referrerpolicy", "sizes"], ["accept", "accept-charset", "action", "enctype", "method"], ["srcset", "attributionsrc"]);
    const I = new n("Removing unused element attributes", function (e) {
      for (var t = 0, n = D; t < n.length; t++) for (var r = n[t], i = e.querySelectorAll("[".concat(r, "]")), o = 0, a = Array.from(i); o < a.length; o++) a[o].removeAttribute(r);
    });
    function L(e) {
      for (var t = Array.from(e.childNodes), n = false, r = t.length - 1; r >= 0; r--) {
        var i = t[r], o = i.nodeType === Node.TEXT_NODE;
        if (n && o) {
          var a = t[r + 1];
          i.nodeValue += a.nodeValue, a.remove();
        }
        n = o;
      }
      for (var c = 0, u = Array.from(e.children); c < u.length; c++) {
        var s = u[c];
        s.childNodes && L(s);
      }
    }
    const U = new n("Merging text nodes", function (e) {
      L(e.documentElement);
    });
    const j = new n("Removing extra whitespaces", function (e) {
      for (var t, n = e.createNodeIterator(e.documentElement, NodeFilter.SHOW_TEXT, function () {
        return NodeFilter.FILTER_ACCEPT;
      }); t = n.nextNode();) (function (e) {
        var t = e.parentElement.tagName;
        return -1 == ["PRE", "CODE"].indexOf(t);
      }(r = t) && (r.nodeValue = r.nodeValue.replace(/\r/g, "").replace(/\t/g, " ").replace(/  +/g, " ").replace(/\n[\n ]+/g, "\n").replace(/ +\n/g, "\n")));
      var r;
    });
    function q(e) {
      return e instanceof XMLDocument ? function (e) {
        return 0 === e.rootElement.children.length;
      }(e) : function (e) {
        return 0 === e.children.length;
      }(e);
    }
    const M = new n("Remove empty SVGs", function (e) {
      Array.from(e.querySelectorAll("svg")).filter(q).forEach(function (e) {
        return e.remove();
      });
      var t = new DOMParser;
      Array.from(e.querySelectorAll("img[src]")).filter(function (e) {
        return e.getAttribute("src").startsWith("data:image/svg+xml");
      }).forEach(function (e) {
        var n = e.getAttribute("src");
        fetch(n).then(function (e) {
          return e.text();
        }).then(function (e) {
          return t.parseFromString(e, "text/xml");
        }).then(function (t) {
          q(t) && e.remove();
        });
      });
    });
    const N = new n("Cleaning HTML document", function (e) {
      return t = this, i = undefined, a = function () {
        var t, i;
        return function (e, t) {
          var n, r, i, o, a = {label: 0, sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          }, trys: [], ops: []};
          return o = {next: c(0), throw: c(1), return: c(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function c(c) {
            return function (u) {
              return function (c) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; o && (o = 0, c[0] && (a = 0)), a;) try {
                  if (n = 1, r && (i = 2 & c[0] ? r.return : c[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, c[1])).done) return i;
                  switch (r = 0, i && (c = [2 & c[0], i.value]), c[0]) {
                    case 0:
                    case 1:
                      i = c;
                      break;
                    case 4:
                      return a.label++, {value: c[1], done: false};
                    case 5:
                      a.label++, r = c[1], c = [0];
                      continue;
                    case 7:
                      c = a.ops.pop(), a.trys.pop();
                      continue;
                    default:
                      if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                        a = 0;
                        continue;
                      }
                      if (3 === c[0] && (!i || c[1] > i[0] && c[1] < i[3])) {
                        a.label = c[1];
                        break;
                      }
                      if (6 === c[0] && a.label < i[1]) {
                        a.label = i[1], i = c;
                        break;
                      }
                      if (i && a.label < i[2]) {
                        a.label = i[2], a.ops.push(c);
                        break;
                      }
                      i[2] && a.ops.pop(), a.trys.pop();
                      continue;
                  }
                  c = t.call(e, a);
                } catch (e) {
                  c = [6, e], r = 0;
                } finally {
                  n = i = 0;
                }
                if (5 & c[0]) throw c[1];
                return {value: c[0] ? c[1] : undefined, done: true};
              }([c, u]);
            };
          }
        }(this, function (o) {
          switch (o.label) {
            case 0:
              return t = new n(null, function () {
                return e;
              }), (i = new r).addStep(t), i.addStep(A, [t]), i.addStep(S, [t]), i.addStep(E, [t]), i.addStep(O, [t]), i.addStep(C, [t]), i.addStep(I, [t]), i.addStep(U, [t]), i.addStep(j, [t]), i.addStep(M, [t]), [4, i.process(function () {}, function () {})];
            case 1:
              return o.sent(), [2];
          }
        });
      }, new ((o = undefined) || (o = Promise))(function (e, n) {
        function r(e) {
          try {
            u(a.next(e));
          } catch (e) {
            n(e);
          }
        }
        function c(e) {
          try {
            u(a.throw(e));
          } catch (e) {
            n(e);
          }
        }
        function u(t) {
          var n;
          t.done ? e(t.value) : (n = t.value, n instanceof o ? n : new o(function (e) {
            e(n);
          })).then(r, c);
        }
        u((a = a.apply(t, i || [])).next());
      });
      var t, i, o, a;
    });
    function F(e, t) {
      !function (e, t) {
        for (var n = 0, r = Array.from(e.attributes); n < r.length; n++) {
          var i = r[n];
          t.setAttribute(i.name, i.value);
        }
      }(e, t), function (e, t) {
        for (var n = 0, r = Array.from(e.childNodes); n < r.length; n++) {
          var i = r[n];
          e.removeChild(i), t.appendChild(i);
        }
      }(e, t), e.parentNode.replaceChild(t, e);
    }
    var R = {H1: "h2", H2: "h3", H3: "h4", H4: "h5", H5: "h6"};
    const H = new n("Reducing the heading level", function (e) {
      if (function (e) {
        return Array.from(e.querySelectorAll("h1")).length > 0;
      }(e)) for (var t, n, r = 0, i = Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")); r < i.length; r++) {
        undefined, n = function (e) {
          var t = e.tagName;
          if ("H6" === t) {
            var n = document.createElement("p");
            return n.setAttribute("role", "heading"), n.setAttribute("aria-level", "7"), n;
          }
          return document.createElement(R[t]);
        }(t = i[r]), F(t, n);
      }
    }), z = new n("Choosing the main content from HTML document", function (e) {
      var t = e.querySelectorAll("main article");
      if (1 === t.length) return t[0];
      var n = e.querySelector('main, [role="main"]');
      return n || (e.querySelector("article") || e.body);
    });
    function Z(e, t) {
      var n, r = function (e, t, n) {
        if (n || 2 === arguments.length) for (var r, i = 0, o = t.length; i < o; i++) !r && i in t || (r || (r = Array.prototype.slice.call(t, 0, i)), r[i] = t[i]);
        return e.concat(r || Array.prototype.slice.call(t));
      }([], e, true), i = r.pop(), o = i.parentNode;
      if (r.length > 0) {
        var a = function (e) {
          var t = e.tagName, n = document.createElement(t);
          return function (e, t) {
            for (var n = 0, r = Array.from(e.attributes); n < r.length; n++) {
              var i = r[n];
              t.setAttribute(i.name, i.value);
            }
          }(e, n), n;
        }(i);
        n = Z(r, a), t.appendChild(a);
      }
      return function (e, t, n) {
        for (var r = false, i = 0, o = Array.from(e.childNodes); i < o.length; i++) {
          var a = o[i];
          r ? (e.removeChild(a), t.appendChild(a)) : a === n && (r = true);
        }
      }(o, t, i), 0 === r.length && (i.remove(), n = i.innerText), n;
    }
    const W = new n("Splitting the main content from HTML document by headings", function (e, t) {
      var n = Array.from(e.getElementsByTagName("h2"));
      return 0 === n.length ? [{title: t.title, element: e}] : (n.length > 1 || (n = Array.from(e.querySelectorAll("h2, h3"))), function (e, t, n) {
        for (var r = [], i = 0, o = n.reverse(); i < o.length; i++) {
          for (var a = [], c = o[i]; c !== e;) a.push(c), c = c.parentNode;
          var u = Z(a, s = document.createElement("div"));
          "" !== s.innerText.trim() && r.push({title: u, element: s});
        }
        var s;
        return e.textContent.trim().length >= 80 && (function (e, t) {
          for (var n = 0, r = Array.from(e.childNodes); n < r.length; n++) {
            var i = r[n];
            e.removeChild(i), t.appendChild(i);
          }
        }(e, s = document.createElement("div")), "" !== s.innerText.trim() && r.push({title: t.title, element: s})), r.reverse();
      }(e, t, n));
    });
    function G(e) {
      F(e, document.createElement("div"));
    }
    const X = new n("Converting noscript tags to div", function (e) {
      Array.from(e.querySelectorAll("noscript")).forEach(G);
    });
    var Q = __webpack_require__(214), V = __webpack_require__.n(Q);
    var Y = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function a(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function c(e) {
          try {
            u(r.throw(e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(a, c);
        }
        u((r = r.apply(e, t || [])).next());
      });
    }, K = function (e, t) {
      var n, r, i, o, a = {label: 0, sent: function () {
        if (1 & i[0]) throw i[1];
        return i[1];
      }, trys: [], ops: []};
      return o = {next: c(0), throw: c(1), return: c(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function c(c) {
        return function (u) {
          return function (c) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; o && (o = 0, c[0] && (a = 0)), a;) try {
              if (n = 1, r && (i = 2 & c[0] ? r.return : c[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, c[1])).done) return i;
              switch (r = 0, i && (c = [2 & c[0], i.value]), c[0]) {
                case 0:
                case 1:
                  i = c;
                  break;
                case 4:
                  return a.label++, {value: c[1], done: false};
                case 5:
                  a.label++, r = c[1], c = [0];
                  continue;
                case 7:
                  c = a.ops.pop(), a.trys.pop();
                  continue;
                default:
                  if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                    a = 0;
                    continue;
                  }
                  if (3 === c[0] && (!i || c[1] > i[0] && c[1] < i[3])) {
                    a.label = c[1];
                    break;
                  }
                  if (6 === c[0] && a.label < i[1]) {
                    a.label = i[1], i = c;
                    break;
                  }
                  if (i && a.label < i[2]) {
                    a.label = i[2], a.ops.push(c);
                    break;
                  }
                  i[2] && a.ops.pop(), a.trys.pop();
                  continue;
              }
              c = t.call(e, a);
            } catch (e) {
              c = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & c[0]) throw c[1];
            return {value: c[0] ? c[1] : undefined, done: true};
          }([c, u]);
        };
      }
    }, J = new DOMParser;
    const $ = new n("Loading images", function (e, t) {
      return Y(this, undefined, undefined, function () {
        var n, r, i, o;
        return K(this, function (a) {
          var c;
          return n = function () {
            var e = this, t = {};
            return function (n) {
              var r = n.getAttribute("src");
              if (r in t) return t[r];
              var i = function (e) {
                return p(function (t) {
                  return t.loadFileFrom(e);
                });
              }(r).then(function (t) {
                return Y(e, undefined, undefined, function () {
                  var e;
                  return K(this, function (n) {
                    switch (n.label) {
                      case 0:
                        if (!t.type.startsWith("image/")) throw new Error;
                        return "image/svg+xml" !== t.type ? [3, 2] : [4, t.text()];
                      case 1:
                        if (e = n.sent(), q(J.parseFromString(e, "text/xml"))) throw new Error;
                        n.label = 2;
                      case 2:
                        return [2, {id: V()(r), blob: t}];
                    }
                  });
                });
              }).catch(function (e) {
                return fetch("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAXNSR0IArs4c6QAAAjRJREFUeNrF1d1rzXEcwPHXOXPmjObpNMccNtMa5fGCPOWZccIuUEpYXJCQ1GykPCtP4SDMPEQkUywZViLPidLKDf+Av8GdcyHf+oVju9n7ff151/fzufjqSeIGqtRtilTaLAdFUiq77DhNjhhE0nRNWrrkNa1uapCAWb7Lqe2CSzW6YSNAzkVRivQT82eSFnhgNYjry0sTEIgpMd5Ko6REielriWeWAfrL0gkCxWZotlazHWKR8YFWeWsugLQmooG07YZhuONSAnHlNnliEv8O1HgkJSZji1nCVqo0eWA0hQIl5tpivKyjAHoZ7YhbMhQOUGqddouUAhImOuucflA4EKXYFNcdEqNwIGG4GgR6m+2eRigcSJis1XshkVSr3Wb+HQj3b8u7/1ciplSdF+r8ncEa6AS9zdPhGFL2+2CUMhu8NlN4TLVhfwskZb2yE1DmpC8aPDdROO4i79yUiQR20ilpmY82CHuf6qGnqgExA6zwWc5t1wyNBr6q80Edwi7uOykNKJKxzWdrUKFVs3Ih0MgPL00Xxmdrs0cfxA1QpcZhb8wHVLjrvCGEK3xTA79X+chWQIklWrXoMEagwh2npQlnDOMLPVYvUKpem0EQSZyQRtou3hoMkhbrsFxhQqLcXvY5KCUp65la+O/EKfOdZ4JLdlio3TQkZFT9wZGizvHJO+uJq3bdLWNBmd0u/PZi3kt5m/NelldL3it5r+bNyUK5emeM0G3WOyBF91mluEe/6J+j257vXdKuCgAAAABJRU5ErkJggg==").then(function (e) {
                  return e.blob();
                }).then(function (e) {
                  return {id: "no-image", blob: e};
                });
              });
              return t[r] = i, i;
            };
          }(), c = t, r = function (e) {
            var t = e.getAttribute("src").trim(), n = new URL(t, c).toString();
            e.setAttribute("src", n);
          }, i = function (e) {
            return Array.from(e.querySelectorAll("img[src]")).filter(function (e) {
              return e.getAttribute("src").trim();
            });
          }(e).filter(function (e) {
            return !e.getAttribute("src").startsWith("data:");
          }), i.forEach(r), o = i.map(function (e) {
            return n(e).then(function (t) {
              return function (e, t) {
                var n = document.createComment("<%= image['".concat(t.id, "'] %>"));
                e.parentNode.replaceChild(n, e);
              }(e, t), t;
            });
          }), [2, Promise.allSettled(o).then(function (e) {
            return e.filter(function (e) {
              return "fulfilled" === e.status;
            }).map(function (e) {
              return e.value;
            });
          }).then(function (e) {
            return Array.from(new Set(e));
          })];
        });
      });
    });
    var ee = __webpack_require__(602), te = __webpack_require__.n(ee), ne = function () {
      return ne = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }, ne.apply(this, arguments);
    };
    const re = new n("Creating EPUB file", function (e, t, n) {
      return r = this, i = undefined, a = function () {
        var r, i, o, a, c;
        return function (e, t) {
          var n, r, i, o, a = {label: 0, sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          }, trys: [], ops: []};
          return o = {next: c(0), throw: c(1), return: c(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function c(c) {
            return function (u) {
              return function (c) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; o && (o = 0, c[0] && (a = 0)), a;) try {
                  if (n = 1, r && (i = 2 & c[0] ? r.return : c[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, c[1])).done) return i;
                  switch (r = 0, i && (c = [2 & c[0], i.value]), c[0]) {
                    case 0:
                    case 1:
                      i = c;
                      break;
                    case 4:
                      return a.label++, {value: c[1], done: false};
                    case 5:
                      a.label++, r = c[1], c = [0];
                      continue;
                    case 7:
                      c = a.ops.pop(), a.trys.pop();
                      continue;
                    default:
                      if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                        a = 0;
                        continue;
                      }
                      if (3 === c[0] && (!i || c[1] > i[0] && c[1] < i[3])) {
                        a.label = c[1];
                        break;
                      }
                      if (6 === c[0] && a.label < i[1]) {
                        a.label = i[1], i = c;
                        break;
                      }
                      if (i && a.label < i[2]) {
                        a.label = i[2], a.ops.push(c);
                        break;
                      }
                      i[2] && a.ops.pop(), a.trys.pop();
                      continue;
                  }
                  c = t.call(e, a);
                } catch (e) {
                  c = [6, e], r = 0;
                } finally {
                  n = i = 0;
                }
                if (5 & c[0]) throw c[1];
                return {value: c[0] ? c[1] : undefined, done: true};
              }([c, u]);
            };
          }
        }(this, function (u) {
          switch (u.label) {
            case 0:
              for ((r = new (te())).init(ne({i18n: "en"}, t)), r.uuid(t.uuid), r.date(t.date), n.forEach(function (e) {
                return r.image(e.blob, e.id);
              }), i = 0, o = e; i < o.length; i++) a = o[i], r.add(a.title, a.content);
              return [4, r.generate("blob", function (e) {
                console.log("progression: " + e.percent.toFixed(2) + " %"), e.currentFile && console.log("current file = " + e.currentFile);
              })];
            case 1:
              return c = u.sent(), [2, {title: t.title, epub: c}];
          }
        });
      }, new ((o = undefined) || (o = Promise))(function (e, t) {
        function n(e) {
          try {
            u(a.next(e));
          } catch (e) {
            t(e);
          }
        }
        function c(e) {
          try {
            u(a.throw(e));
          } catch (e) {
            t(e);
          }
        }
        function u(t) {
          var r;
          t.done ? e(t.value) : (r = t.value, r instanceof o ? r : new o(function (e) {
            e(r);
          })).then(n, c);
        }
        u((a = a.apply(r, i || [])).next());
      });
      var r, i, o, a;
    });
    function ie(e, t) {
      return new URL(e, t).href;
    }
    function oe(e, t) {
      if (function (e, t) {
        return e.split("#")[0] === t.split("#")[0];
      }(t, e)) {
        var n = e.split("#")[1];
        if (n) return "#".concat(n);
      }
      return e;
    }
    const ae = new n("Fix links", function (e, t) {
      for (var n = 0, r = e.flatMap(function (e) {
        return Array.from(e.querySelectorAll("a[href]"));
      }); n < r.length; n++) {
        var i = r[n], o = i.getAttribute("href");
        o = oe(o = ie(o, t), t), i.setAttribute("href", o);
      }
      return e;
    }), ce = new n("Set external links to open in a new tab", function (e) {
      for (var t = 0, n = e.flatMap(function (e) {
        return Array.from(e.querySelectorAll('a[href^="http://"], a[href^="https://"]'));
      }); t < n.length; t++) n[t].setAttribute("target", "_blank");
      return e;
    });
    function ue(e, t) {
      for (var n = 0, r = e.length; n < r; n++) if (null !== e[n].querySelector("#".concat(t, ',a[name="').concat(t, '"]'))) return n;
      return -1;
    }
    function se(e) {
      var t = document.createElement("span");
      F(e, t), t.removeAttribute("href");
    }
    function le(e, t) {
      var n = e.getAttribute("href"), r = "page-".concat(t, ".html").concat(n);
      e.setAttribute("href", r);
    }
    const fe = new n("Remove broken anchor links", function (e) {
      for (var t = 0, n = e.length; t < n; t++) for (var r = e[t], i = 0, o = Array.from(r.querySelectorAll('a[href^="#"]')); i < o.length; i++) {
        var a = o[i], c = ue(e, a.getAttribute("href").substring(1));
        -1 === c ? se(a) : c !== t && le(a, c);
      }
      return e;
    });
    const pe = new n("Fix links", function (e, t) {
      return i = this, o = undefined, c = function () {
        var i, o, a;
        return function (e, t) {
          var n, r, i, o, a = {label: 0, sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          }, trys: [], ops: []};
          return o = {next: c(0), throw: c(1), return: c(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function c(c) {
            return function (u) {
              return function (c) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; o && (o = 0, c[0] && (a = 0)), a;) try {
                  if (n = 1, r && (i = 2 & c[0] ? r.return : c[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, c[1])).done) return i;
                  switch (r = 0, i && (c = [2 & c[0], i.value]), c[0]) {
                    case 0:
                    case 1:
                      i = c;
                      break;
                    case 4:
                      return a.label++, {value: c[1], done: false};
                    case 5:
                      a.label++, r = c[1], c = [0];
                      continue;
                    case 7:
                      c = a.ops.pop(), a.trys.pop();
                      continue;
                    default:
                      if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                        a = 0;
                        continue;
                      }
                      if (3 === c[0] && (!i || c[1] > i[0] && c[1] < i[3])) {
                        a.label = c[1];
                        break;
                      }
                      if (6 === c[0] && a.label < i[1]) {
                        a.label = i[1], i = c;
                        break;
                      }
                      if (i && a.label < i[2]) {
                        a.label = i[2], a.ops.push(c);
                        break;
                      }
                      i[2] && a.ops.pop(), a.trys.pop();
                      continue;
                  }
                  c = t.call(e, a);
                } catch (e) {
                  c = [6, e], r = 0;
                } finally {
                  n = i = 0;
                }
                if (5 & c[0]) throw c[1];
                return {value: c[0] ? c[1] : undefined, done: true};
              }([c, u]);
            };
          }
        }(this, function (c) {
          switch (c.label) {
            case 0:
              return i = new n(null, function () {
                return e.map(function (e) {
                  return e.element;
                });
              }), o = new n(null, function () {
                return t;
              }), (a = new r).addStep(i), a.addStep(o), a.addStep(ae, [i, o]), a.addStep(ce, [ae]), a.addStep(fe, [ae]), [4, a.process(function () {}, function () {})];
            case 1:
              return c.sent(), [2];
          }
        });
      }, new ((a = undefined) || (a = Promise))(function (e, t) {
        function n(e) {
          try {
            u(c.next(e));
          } catch (e) {
            t(e);
          }
        }
        function r(e) {
          try {
            u(c.throw(e));
          } catch (e) {
            t(e);
          }
        }
        function u(t) {
          var i;
          t.done ? e(t.value) : (i = t.value, i instanceof a ? i : new a(function (e) {
            e(i);
          })).then(n, r);
        }
        u((c = c.apply(i, o || [])).next());
      });
      var i, o, a, c;
    });
    function me(e) {
      return e.map(function (e) {
        return {title: e.title, content: (n = e.element, r = (new XMLSerializer).serializeToString(n), i = (new DOMParser).parseFromString(r, "text/html"), o = (new XMLSerializer).serializeToString(i), a = (new DOMParser).parseFromString(o, "text/html"), t = a.body.innerHTML, t.replace(/<!\-\-\s*<%= image\[/g, "<%= image[").replace(/] %>\s*\-\->/g, "] %>"))};
        var t, n, r, i, o, a;
      });
    }
    const de = function (e, t, i) {
      return o = this, a = undefined, u = function () {
        var o, a, c, u;
        return function (e, t) {
          var n, r, i, o, a = {label: 0, sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          }, trys: [], ops: []};
          return o = {next: c(0), throw: c(1), return: c(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function c(c) {
            return function (u) {
              return function (c) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; o && (o = 0, c[0] && (a = 0)), a;) try {
                  if (n = 1, r && (i = 2 & c[0] ? r.return : c[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, c[1])).done) return i;
                  switch (r = 0, i && (c = [2 & c[0], i.value]), c[0]) {
                    case 0:
                    case 1:
                      i = c;
                      break;
                    case 4:
                      return a.label++, {value: c[1], done: false};
                    case 5:
                      a.label++, r = c[1], c = [0];
                      continue;
                    case 7:
                      c = a.ops.pop(), a.trys.pop();
                      continue;
                    default:
                      if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                        a = 0;
                        continue;
                      }
                      if (3 === c[0] && (!i || c[1] > i[0] && c[1] < i[3])) {
                        a.label = c[1];
                        break;
                      }
                      if (6 === c[0] && a.label < i[1]) {
                        a.label = i[1], i = c;
                        break;
                      }
                      if (i && a.label < i[2]) {
                        a.label = i[2], a.ops.push(c);
                        break;
                      }
                      i[2] && a.ops.pop(), a.trys.pop();
                      continue;
                  }
                  c = t.call(e, a);
                } catch (e) {
                  c = [6, e], r = 0;
                } finally {
                  n = i = 0;
                }
                if (5 & c[0]) throw c[1];
                return {value: c[0] ? c[1] : undefined, done: true};
              }([c, u]);
            };
          }
        }(this, function (s) {
          switch (s.label) {
            case 0:
              return o = new n(null, function () {
                return e;
              }), a = new n('Downloading "'.concat(e, '"'), function (e) {
                return p(function (t) {
                  return t.requestTextContent(e);
                });
              }), c = new n(null, me), (u = new r).addStep(o), u.addStep(a, [o]), u.addStep(m, [a]), u.addStep(b, [m, o]), u.addStep(N, [m]), u.addStep(H, [m]), u.addStep(z, [m]), u.addStep(X, [z]), u.addStep($, [z, o]), u.addStep(W, [z, b]), u.addStep(pe, [W, o]), u.addStep(c, [W]), u.addStep(re, [c, b, $]), [4, u.process(t, i)];
            case 1:
              return [2, s.sent()];
          }
        });
      }, new ((c = undefined) || (c = Promise))(function (e, t) {
        function n(e) {
          try {
            i(u.next(e));
          } catch (e) {
            t(e);
          }
        }
        function r(e) {
          try {
            i(u.throw(e));
          } catch (e) {
            t(e);
          }
        }
        function i(t) {
          var i;
          t.done ? e(t.value) : (i = t.value, i instanceof c ? i : new c(function (e) {
            e(i);
          })).then(n, r);
        }
        i((u = u.apply(o, a || [])).next());
      });
      var o, a, c, u;
    };
    var he = document.getElementById("form"), ge = document.querySelector("button[type=submit]"), ve = null;
    function ye(e) {
      var t = e.title, n = e.epub, r = function (e) {
        return e.toLowerCase().replace(/[^\p{L}0-9\s]/gu, "").replace(/\s+/g, "-");
      }(t), i = URL.createObjectURL(n), o = document.createElement("a");
      o.href = i, o.textContent = "Download EPUB", o.download = r + ".epub", document.body.appendChild(o), o.click(), o.remove(), xe(), setTimeout(function () {
        return URL.revokeObjectURL(i);
      }, 18e5);
    }
    function xe() {
      ge.disabled = false;
    }
    function be(e) {
      ve.setAttribute("max", e.toString());
    }
    function we(e) {
      ve.setAttribute("value", e.toString());
    }
    he.onsubmit = function (e) {
      e.preventDefault(), ge.disabled = true;
      var t = document.getElementById("url").value;
      if (null === ve) {
        var n = document.querySelector("main");
        ve = document.createElement("progress"), n.appendChild(ve);
      }
      return de(t, we, be).catch(function (e) {
        throw xe(), alert(e.message), e;
      }).then(ye), false;
    };
  })();
})();
