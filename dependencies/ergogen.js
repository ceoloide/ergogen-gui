/*!
 * Ergogen v4.2.1
 * https://ergogen.xyz
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('makerjs'), require('js-yaml'), require('jszip'), require('mathjs'), require('kle-serial'), require('hull')) :
	typeof define === 'function' && define.amd ? define(['makerjs', 'js-yaml', 'jszip', 'mathjs', 'kle-serial', 'hull'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ergogen = factory(global.makerjs, global.jsyaml, global.jszip, global.math, global.kle, global.hull));
})(this, (function (require$$0, require$$2, require$$1$1, require$$3, require$$1, require$$8$1) { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var utils = {};

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils;
		hasRequiredUtils = 1;
		const m = require$$0;


		utils.deepcopy = value => {
		    if (value === undefined) return undefined
		    return JSON.parse(JSON.stringify(value))
		};

		const deep = utils.deep = (obj, key, val) => {
		    const levels = key.split('.');
		    const last = levels.pop();
		    let step = obj;
		    for (const level of levels) {
		        step[level] = step[level] || {};
		        step = step[level];
		    }
		    if (val === undefined) return step[last]
		    step[last] = val;
		    return obj
		};

		utils.template = (str, vals={}) => {
		    const regex = /\{\{([^}]*)\}\}/g;
		    let res = str;
		    let shift = 0;
		    for (const match of str.matchAll(regex)) {
		        const replacement = (deep(vals, match[1]) || '') + '';
		        res = res.substring(0, match.index + shift)
		            + replacement
		            + res.substring(match.index + shift + match[0].length);
		        shift += replacement.length - match[0].length;
		    }
		    return res
		};

		const eq = utils.eq = (a=[], b=[]) => {
		    return a[0] === b[0] && a[1] === b[1]
		};

		const line = utils.line = (a, b) => {
		    return new m.paths.Line(a, b)
		};

		utils.circle = (p, r) => {
		    return {paths: {circle: new m.paths.Circle(p, r)}}
		};

		utils.rect = (w, h, o=[0, 0]) => {
		    const res = {
		        top:    line([0, h], [w, h]),
		        right:  line([w, h], [w, 0]),
		        bottom: line([w, 0], [0, 0]),
		        left:   line([0, 0], [0, h])
		    };
		    return m.model.move({paths: res}, o)
		};

		utils.poly = (arr) => {
		    let counter = 0;
		    let prev = arr[arr.length - 1];
		    const res = {
		        paths: {}
		    };
		    for (const p of arr) {
		        if (eq(prev, p)) continue
		        res.paths['p' + (++counter)] = line(prev, p);
		        prev = p;
		    }
		    return res
		};

		utils.bbox = (arr) => {
		    let minx = Infinity;
		    let miny = Infinity;
		    let maxx = -Infinity;
		    let maxy = -Infinity;
		    for (const p of arr) {
		        minx = Math.min(minx, p[0]);
		        miny = Math.min(miny, p[1]);
		        maxx = Math.max(maxx, p[0]);
		        maxy = Math.max(maxy, p[1]);
		    }
		    return {low: [minx, miny], high: [maxx, maxy]}
		};

		const farPoint = utils.farPoint = [1234.1234, 2143.56789];

		utils.union = utils.add = (a, b) => {
		    return m.model.combine(a, b, false, true, false, true, {
		        farPoint
		    })
		};

		utils.subtract = (a, b) => {
		    return m.model.combine(a, b, false, true, true, false, {
		        farPoint
		    })
		};

		utils.intersect = (a, b) => {
		    return m.model.combine(a, b, true, false, true, false, {
		        farPoint
		    })
		};

		utils.stack = (a, b) => {
		    return {
		        models: {
		            a, b
		        }
		    }
		};

		const semver = utils.semver = (str, name='') => {
		    let main = str.split('-')[0];
		    if (main.startsWith('v')) {
		        main = main.substring(1);
		    }
		    while (main.split('.').length < 3) {
		        main += '.0';
		    }
		    if (/^\d+\.\d+\.\d+$/.test(main)) {
		        const parts = main.split('.').map(part => parseInt(part, 10));
		        return {major: parts[0], minor: parts[1], patch: parts[2]}
		    } else throw new Error(`Invalid semver "${str}" at ${name}!`)
		};

		utils.satisfies = (current, expected) => {
		    if (current.major === undefined) current = semver(current);
		    if (expected.major === undefined) expected = semver(expected);
		    return current.major === expected.major && (
		        current.minor > expected.minor || (
		            current.minor === expected.minor && 
		            current.patch >= expected.patch
		        )
		    )
		};
		return utils;
	}

	var io = {};

	var assert = {};

	var point;
	var hasRequiredPoint;

	function requirePoint () {
		if (hasRequiredPoint) return point;
		hasRequiredPoint = 1;
		const m = require$$0;
		const u = requireUtils();

		point = class Point {
		    constructor(x=0, y=0, r=0, meta={}) {
		        if (Array.isArray(x)) {
		            this.x = x[0];
		            this.y = x[1];
		            this.r = 0;
		            this.meta = {};
		        } else {
		            this.x = x;
		            this.y = y;
		            this.r = r;
		            this.meta = meta;
		        }
		    }

		    get p() {
		        return [this.x, this.y]
		    }

		    set p(val) {
		        [this.x, this.y] = val;
		    }

		    shift(s, relative=true, resist=false) {
		        s[0] *= (!resist && this.meta.mirrored) ? -1 : 1;
		        if (relative) {
		            s = m.point.rotate(s, this.r);
		        }
		        this.x += s[0];
		        this.y += s[1];
		        return this
		    }

		    rotate(angle, origin=[0, 0], resist=false) {
		        angle *= (!resist && this.meta.mirrored) ? -1 : 1;
		        if (origin) {
		            this.p = m.point.rotate(this.p, angle, origin);
		        }
		        this.r += angle;
		        return this
		    }

		    mirror(x) {
		        this.x = 2 * x - this.x;
		        this.r = -this.r;
		        return this
		    }

		    clone() {
		        return new Point(
		            this.x,
		            this.y,
		            this.r,
		            u.deepcopy(this.meta)
		        )
		    }

		    position(model) {
		        return m.model.moveRelative(m.model.rotate(model, this.r), this.p)
		    }

		    unposition(model) {
		        return m.model.rotate(m.model.moveRelative(model, [-this.x, -this.y]), -this.r)
		    }

		    rect(size=14) {
		        let rect = u.rect(size, size, [-size/2, -size/2]);
		        return this.position(rect)
		    }

		    angle(other) {
		        const dx = other.x - this.x;
		        const dy = other.y - this.y;
		        return -Math.atan2(dx, dy) * (180 / Math.PI)
		    }

		    equals(other) {
		        return this.x === other.x
		            && this.y === other.y
		            && this.r === other.r
		            && JSON.stringify(this.meta) === JSON.stringify(other.meta)
		    }
		};
		return point;
	}

	var hasRequiredAssert;

	function requireAssert () {
		if (hasRequiredAssert) return assert;
		hasRequiredAssert = 1;
		requireUtils();
		requirePoint();
		const mathjs = require$$3;

		const mathnum = assert.mathnum = raw => units => {
		    return mathjs.evaluate(`${raw}`, units || {})
		};

		const assert$1 = assert.assert = (exp, msg) => {
		    if (!exp) {
		        throw new Error(msg)
		    }
		};

		const type = assert.type = val => units => {
		    if (Array.isArray(val)) return 'array'
		    if (val === null) return 'null'
		    try {
		        const num = mathnum(val)(units);
		        if (typeof num === 'number') return 'number'
		    } catch (err) {}
		    return typeof val
		};

		const sane = assert.sane = (val, name, _type) => units => {
		    assert$1(type(val)(units) == _type, `Field "${name}" should be of type ${_type}!`);
		    if (_type == 'number') return mathnum(val)(units)
		    return val
		};

		assert.unexpected = (obj, name, expected) => {
		    const sane_obj = sane(obj, name, 'object')();
		    for (const key of Object.keys(sane_obj)) {
		        assert$1(expected.includes(key), `Unexpected key "${key}" within field "${name}"!`);
		    }
		};

		const _in = assert.in = (raw, name, arr) => {
		    assert$1(arr.includes(raw), `Field "${name}" should be one of [${arr.join(', ')}]!`);
		    return raw
		};

		const arr = assert.arr = (raw, name, length, _type, _default) => units => {
		    assert$1(type(raw)(units) == 'array', `Field "${name}" should be an array!`);
		    assert$1(length == 0 || raw.length == length, `Field "${name}" should be an array of length ${length}!`);
		    raw = raw.map(val => val === undefined ? _default : val);
		    raw.map(val => assert$1(type(val)(units) == _type, `Field "${name}" should contain ${_type}s!`));
		    if (_type == 'number') {
		        raw = raw.map(val => mathnum(val)(units));
		    }
		    return raw
		};

		const numarr = assert.numarr = (raw, name, length) => units => arr(raw, name, length, 'number', 0)(units);
		assert.strarr = (raw, name) => arr(raw, name, 0, 'string', '')();

		const xy = assert.xy = (raw, name) => units => numarr(raw, name, 2)(units);

		assert.wh = (raw, name) => units => {
		    if (!Array.isArray(raw)) raw = [raw, raw];
		    return xy(raw, name)(units)
		};

		assert.trbl = (raw, name, _default=0) => units => {
		    if (!Array.isArray(raw)) raw = [raw, raw, raw, raw];
		    if (raw.length == 2) raw = [raw[1], raw[0], raw[1], raw[0]];
		    return arr(raw, name, 4, 'number', _default)(units)
		};

		assert.asym = (raw, name) => {
		    // allow different aliases
		    const source_aliases = ['source', 'origin', 'base', 'primary', 'left'];
		    const clone_aliases = ['clone', 'image', 'derived', 'secondary', 'right'];
		    _in(raw, name, ['both'].concat(source_aliases, clone_aliases));
		    // return aliases to canonical names
		    if (source_aliases.includes(raw)) return 'source'
		    if (clone_aliases.includes(raw)) return 'clone'
		    return raw
		};
		return assert;
	}

	var kle = {};

	var hasRequiredKle;

	function requireKle () {
		if (hasRequiredKle) return kle;
		hasRequiredKle = 1;
		const u = requireUtils();
		const kle$1 = require$$1;
		const yaml = require$$2;

		kle.convert = (config, logger) => {
		    const keyboard = kle$1.Serial.deserialize(config);
		    const result = {points: {zones: {}}};

		    // if the keyboard notes are valid YAML/JSON, they get added to each key as metadata
		    let meta;
		    try {
		        meta = yaml.load(keyboard.meta.notes);
		    } catch (ex) {
		        // notes were not valid YAML/JSON, oh well...
		    }
		    meta = meta || {};

		    let index = 1;
		    for (const key of keyboard.keys) {
		        const id = `key${index++}`;
		        const colid = `${id}col`;
		        const rowid = `${id}row`;
		        // we try to look at the first non-empty label
		        const label = key.labels.filter(e => !!e)[0] || ''; 

		        // PCB nets can be specified through key labels
		        let row_net = id;
		        let col_net = 'GND';
		        if (label.match(/^\d+_\d+$/)) {
		            const parts = label.split('_');
		            row_net = `row_${parts[0]}`;
		            col_net = `col_${parts[1]}`;
		        }

		        // need to account for keycap sizes, as KLE anchors
		        // at the corners, while we consider the centers
		        const x = key.x + (key.width - 1) / 2;
		        const y = key.y + (key.height - 1) / 2;
		        
		        // KLE rotations have an absolute origin, which is the
		        // top left corner of a standard keycap, so we adjust
		        // by half of its size, to match where Ergogen positions
		        // its keys
		        const origin_x = key.rotation_x - 0.5;
		        const origin_y = key.rotation_y - 0.5;

		        // anchoring the per-key zone to the KLE-computed coords
		        const converted = {
		            key: {
		                origin: [`${origin_x} u`, `${-origin_y} u`],
		                splay: -key.rotation_angle,
		                shift: [`${x} u`, `${-y} u`],
		            },
		            columns: {}
		        };
		        
		        // adding a column-level rotation with origin
		        converted.columns[colid] = {
		            rows: {}
		        };
		        
		        // passing along metadata to each key
		        converted.columns[colid].rows[rowid] = u.deepcopy(meta);
		        converted.columns[colid].rows[rowid].width = `${key.width} u`;
		        converted.columns[colid].rows[rowid].height = `${key.height} u`;
		        converted.columns[colid].rows[rowid].label = label;
		        converted.columns[colid].rows[rowid].column_net = col_net;
		        converted.columns[colid].rows[rowid].row_net = row_net;
		        
		        result.points.zones[id] = converted;
		    }

		    return result
		};
		return kle;
	}

	var name = "ergogen";
	var version = "4.2.1";
	var description = "Ergonomic keyboard layout generator";
	var author = "Bán Dénes <mr@zealot.hu>";
	var license = "MIT";
	var homepage = "https://ergogen.xyz";
	var repository = "github:ergogen/ergogen";
	var bugs = "https://github.com/ergogen/ergogen/issues";
	var main = "./src/ergogen.js";
	var bin = "./src/cli.js";
	var scripts = {
		build: "rollup -c",
		test: "mocha -r test/helpers/register test/index.js",
		coverage: "nyc --reporter=html --reporter=text npm test"
	};
	var dependencies = {
		"fs-extra": "^11.3.2",
		hull: "github:andriiheonia/hull",
		"js-yaml": "^3.14.1",
		jszip: "^3.10.1",
		"kle-serial": "github:ergogen/kle-serial#ergogen",
		makerjs: "^0.18.1",
		mathjs: "^15.0.0",
		yargs: "^17.7.2"
	};
	var devDependencies = {
		"@rollup/plugin-commonjs": "^28.0.7",
		"@rollup/plugin-json": "^6.1.0",
		chai: "^4.5.0",
		"chai-as-promised": "^7.1.2",
		"dir-compare": "^5.0.0",
		glob: "^11.0.3",
		mocha: "^11.7.4",
		nyc: "^17.1.0",
		rollup: "^4.52.4",
		sinon: "^21.0.0"
	};
	var nyc = {
		all: true,
		include: [
			"src/**/*.js"
		]
	};
	var require$$8 = {
		name: name,
		version: version,
		description: description,
		author: author,
		license: license,
		homepage: homepage,
		repository: repository,
		bugs: bugs,
		main: main,
		bin: bin,
		scripts: scripts,
		dependencies: dependencies,
		devDependencies: devDependencies,
		nyc: nyc
	};

	var hasRequiredIo;

	function requireIo () {
		if (hasRequiredIo) return io;
		hasRequiredIo = 1;
		const yaml = require$$2;
		const makerjs = require$$0;

		const u = requireUtils();
		const a = requireAssert();
		const kle = requireKle();

		const package_json = require$$8;

		const fake_require = io.fake_require = injection => name => {
		    const dependencies = {
		        makerjs
		    };
		    if (name.endsWith('package.json')) {
		        return package_json
		    } else if (dependencies[name]) {
		        return dependencies[name]
		    } else throw new Error(`Unknown dependency "${name}" among the requirements of injection "${injection}"!`)
		};

		io.unpack = async (zip) => {

		    // main config text (has to be called "config.ext" where ext is one of yml/yaml/json/js)
		    const candidates = zip.file(/^config\.(ya?ml|json|js)$/);
		    if (candidates.length != 1) {
		        throw new Error('Ambiguous config in bundle!')
		    }
		    const config_text = await candidates[0].async('string');
		    const injections = [];

		    // bundled footprints
		    const fps = zip.folder('footprints');
		    const module_prefix = 'const module = {};\n\n';
		    const module_suffix = '\n\nreturn module.exports;';
		    for (const fp of fps.file(/.*\.js$/)) {
		        const name = fp.name.slice('footprints/'.length).split('.')[0];
		        const text = await fp.async('string');
		        const parsed = new Function('require', module_prefix + text + module_suffix)(fake_require(name));
		        // TODO: some sort of footprint validation?
		        injections.push(['footprint', name, parsed]);
		    }

		    // bundled pcb templates
		    const tpls = zip.folder('templates');
		    for (const tpl of tpls.file(/.*\.js$/)) {
		        const name = tpl.name.slice('templates/'.length).split('.')[0];
		        const text = await tpl.async('string');
		        const parsed = new Function('require', module_prefix + text + module_suffix)(fake_require(name));
		        // TODO: some sort of template validation?
		        injections.push(['template', name, parsed]);
		    }

		    return [config_text, injections]
		};

		io.interpret = (raw, logger) => {
		    let config = raw;
		    let format = 'OBJ';
		    if (a.type(raw)() == 'string') {
		        try {
		            config = yaml.load(raw);
		            format = 'YAML';
		        } catch (yamlex) {
		            try {
		                config = new Function(raw)();
		                a.assert(
		                    a.type(config)() == 'object',
		                    'Input JS Code doesn\'t resolve into an object!'
		                );
		                format = 'JS';
		            } catch (codeex) {
		                logger('YAML exception:', yamlex);
		                logger('Code exception:', codeex);
		                throw new Error('Input is not valid YAML, JSON, or JS Code!')
		            }
		        }
		    }
		    
		    try {
		        // assume it's KLE and try to convert it
		        config = kle.convert(config, logger);
		        format = 'KLE';
		    } catch (kleex) {
		        // nope... nevermind
		    }

		    if (a.type(config)() != 'object') {
		        throw new Error('Input doesn\'t resolve into an object!')
		    }

		    if (!Object.keys(config).length) {
		        throw new Error('Input appears to be empty!')
		    }

		    return [config, format]
		};

		io.twodee = (model, options) => {
		    const {debug, svg} = options;
		    const assembly = makerjs.model.originate({
		        models: {
		            export: u.deepcopy(model)
		        },
		        units: 'mm'
		    });

		    const result = {
		        dxf: makerjs.exporter.toDXF(assembly),
		    };
		    if (debug) {
		        result.yaml = assembly;
		    }
		    if (debug || svg) {
		      result.svg = makerjs.exporter.toSVG(assembly);
		    }
		    return result
		};
		return io;
	}

	var prepare = {};

	var hasRequiredPrepare;

	function requirePrepare () {
		if (hasRequiredPrepare) return prepare;
		hasRequiredPrepare = 1;
		const u = requireUtils();
		const a = requireAssert();

		const _extend = prepare._extend = (to, from) => {
		    const to_type = a.type(to)();
		    const from_type = a.type(from)();
		    if (from === undefined || from === null) return to
		    if (from === '$unset') return undefined
		    if (to_type != from_type) return from
		    if (from_type == 'object') {
		        const res = u.deepcopy(to);
		        for (const key of Object.keys(from)) {
		            res[key] = _extend(to[key], from[key]);
		            if (res[key] === undefined) delete res[key];
		        }
		        return res
		    } else if (from_type == 'array') {
		        const res = u.deepcopy(to);
		        for (const [i, val] of from.entries()) {
		            res[i] = _extend(res[i], val);
		        }
		        return res
		    } else return from
		};

		const extend = prepare.extend = (...args) => {
		    let res = args[0];
		    for (const arg of args) {
		        if (res == arg) continue
		        res = _extend(res, arg);
		    }
		    return res
		};

		const traverse = prepare.traverse = (config, root, breadcrumbs, op) => {
		    if (a.type(config)() == 'object') {
		        const result = {};
		        for (const [key, val] of Object.entries(config)) {
		            breadcrumbs.push(key);
		            op(result, key, traverse(val, root, breadcrumbs, op), root, breadcrumbs);
		            breadcrumbs.pop();
		        }
		        return result
		    } else if (a.type(config)() == 'array') {
		        // needed so that arrays can set output the same way as objects within ops
		        const dummy = {};
		        const result = [];
		        let index = 0;
		        for (const val of config) {
		            breadcrumbs.push(`[${index}]`);
		            op(dummy, 'dummykey', traverse(val, root, breadcrumbs, op), root, breadcrumbs);
		            result[index] = dummy.dummykey;
		            breadcrumbs.pop();
		            index++;
		        }
		        return result
		    }
		    return config
		};

		prepare.unnest = config => traverse(config, config, [], (target, key, val) => {
		    u.deep(target, key, val);
		});

		prepare.inherit = config => traverse(config, config, [], (target, key, val, root, breadcrumbs) => {
		    if (val && val.$extends !== undefined) {
		        let candidates = u.deepcopy(val.$extends);
		        if (a.type(candidates)() !== 'array') candidates = [candidates];
		        const list = [val];
		        while (candidates.length) {
		            const path = candidates.shift();
		            const other = u.deep(root, path);
		            a.assert(other, `"${path}" (reached from "${breadcrumbs.join('.')}.$extends") does not name a valid inheritance target!`);
		            let parents = other.$extends || [];
		            if (a.type(parents)() !== 'array') parents = [parents];
		            candidates = candidates.concat(parents);
		            a.assert(!list.includes(other), `"${path}" (reached from "${breadcrumbs.join('.')}.$extends") leads to a circular dependency!`);
		            list.unshift(other);
		        }
		        val = extend.apply(null, list);
		        delete val.$extends;
		    }
		    target[key] = val;
		});

		prepare.parameterize = config => traverse(config, config, [], (target, key, val, root, breadcrumbs) => {

		    // we only care about objects
		    if (a.type(val)() !== 'object') {
		        target[key] = val;
		        return 
		    }

		    let params = val.$params;
		    let args = val.$args;

		    // explicitly skipped (probably intermediate) template, remove (by not setting it)
		    if (val.$skip) return

		    // nothing to do here, just pass the original value through
		    if (!params && !args) {
		        target[key] = val;
		        return
		    }

		    // unused template, remove (by not setting it)
		    if (params && !args) return

		    if (!params && args) {
		        throw new Error(`Trying to parameterize through "${breadcrumbs}.$args", but the corresponding "$params" field is missing!`)
		    }

		    params = a.strarr(params, `${breadcrumbs}.$params`);
		    args = a.sane(args, `${breadcrumbs}.$args`, 'array')();
		    if (params.length !== args.length) {
		        throw new Error(`The number of "$params" and "$args" don't match for "${breadcrumbs}"!`)
		    }

		    let str = JSON.stringify(val);
		    const zip = rows => rows[0].map((_, i) => rows.map(row => row[i]));
		    for (const [par, arg] of zip([params, args])) {
		        str = str.replace(new RegExp(`${par}`, 'g'), arg);
		    }
		    try {
		        val = JSON.parse(str);
		    } catch (ex) {
		        throw new Error(`Replacements didn't lead to a valid JSON object at "${breadcrumbs}"! ` + ex)
		    }

		    delete val.$params;
		    delete val.$args;
		    target[key] = val;
		});
		return prepare;
	}

	var units = {};

	var hasRequiredUnits;

	function requireUnits () {
		if (hasRequiredUnits) return units;
		hasRequiredUnits = 1;
		const a = requireAssert();
		const prep = requirePrepare();

		const default_units = {
		    U: 19.05,
		    u: 19,
		    cx: 18,
		    cy: 17,
		    $default_stagger: 0,
		    $default_spread: 'u',
		    $default_splay: 0,
		    $default_height: 'u-1',
		    $default_width: 'u-1',
		    $default_padding: 'u',
		    $default_autobind: 10
		};

		units.parse = (config = {}) => {
		    const raw_units = prep.extend(
		        default_units,
		        a.sane(config.units || {}, 'units', 'object')(),
		        a.sane(config.variables || {}, 'variables', 'object')()
		    );
		    const units = {};
		    for (const [key, val] of Object.entries(raw_units)) {
		        units[key] = a.mathnum(val)(units);
		    }
		    return units
		};
		return units;
	}

	var points = {};

	var anchor = {};

	var hasRequiredAnchor;

	function requireAnchor () {
		if (hasRequiredAnchor) return anchor;
		hasRequiredAnchor = 1;
		requireUtils();
		const a = requireAssert();
		const Point = requirePoint();
		const m = require$$0;

		const mirror_ref = anchor.mirror = (ref, mirror=true) => {
		    if (mirror) {
		        if (ref.startsWith('mirror_')) {
		            return ref.substring(7)
		        }
		        return 'mirror_' + ref
		    }
		    return ref
		};

		const aggregator_common = ['parts', 'method'];

		const aggregators = {
		    average: (config, name, parts) => {
		        a.unexpected(config, name, aggregator_common);
		        const len = parts.length;
		        if (len == 0) {
		          return new Point()
		        }
		        let x = 0, y = 0, r = 0;
		        for (const part of parts) {
		            x += part.x;
		            y += part.y;
		            r += part.r;
		        }
		        return new Point(x / len, y / len, r / len)
		    },
		    intersect: (config, name, parts) => {
		        // a line is generated from a point by taking their
		        // (rotated) Y axis. The line is not extended to
		        // +/- Infinity as that doesn't work with makerjs.
		        // An arbitrary offset of 1 meter is considered
		        // sufficient for practical purposes, and the point
		        // coordinates are used as pivot point for the rotation.
		        const get_line_from_point = (point, offset=1000) => {
		            const origin = [point.x, point.y];
		            const p1 = [point.x, point.y - offset];
		            const p2 = [point.x, point.y + offset];

		            let line = new m.paths.Line(p1, p2);
		            line = m.path.rotate(line, point.r, origin);

		            return line
		        };

		        a.unexpected(config, name, aggregator_common);
		        a.assert(parts.length==2, `Intersect expects exactly two parts, but it got ${parts.length}!`);

		        const line1 = get_line_from_point(parts[0]);
		        const line2 = get_line_from_point(parts[1]);
		        const intersection = m.path.intersection(line1, line2);

		        a.assert(intersection, `The points under "${name}.parts" do not intersect!`);

		        const intersection_point_arr = intersection.intersectionPoints[0];
		        const intersection_point = new Point(
		            intersection_point_arr[0], intersection_point_arr[1], 0
		        );

		        return intersection_point
		    },
		};

		const anchor$1 = anchor.parse = (raw, name, points={}, start=new Point(), mirror=false) => units => {

		    //
		    // Anchor type handling
		    //

		    if (a.type(raw)() == 'string') {
		        raw = {ref: raw};
		    }

		    else if (a.type(raw)() == 'array') {
		        // recursive call with incremental start mods, according to `affect`s
		        let current = start.clone();
		        let index = 1;
		        for (const step of raw) {
		            current = anchor$1(step, `${name}[${index++}]`, points, current, mirror)(units);
		        }
		        return current
		    }

		    a.unexpected(raw, name, ['ref', 'aggregate', 'orient', 'shift', 'rotate', 'affect', 'resist']);

		    //
		    // Reference or aggregate handling
		    //

		    let point = start.clone();
		    if (raw.ref !== undefined && raw.aggregate !== undefined) {
		        throw new Error(`Fields "ref" and "aggregate" cannot appear together in anchor "${name}"!`)
		    }

		    if (raw.ref !== undefined) {
		        // base case, resolve directly
		        if (a.type(raw.ref)() == 'string') {
		            const parsed_ref = mirror_ref(raw.ref, mirror);
		            a.assert(points[parsed_ref], `Unknown point reference "${parsed_ref}" in anchor "${name}"!`);
		            point = points[parsed_ref].clone();
		        // recursive case
		        } else {
		            point = anchor$1(raw.ref, `${name}.ref`, points, start, mirror)(units);
		        }
		    }

		    if (raw.aggregate !== undefined) {
		        raw.aggregate = a.sane(raw.aggregate, `${name}.aggregate`, 'object')();
		        raw.aggregate.method = a.sane(raw.aggregate.method || 'average', `${name}.aggregate.method`, 'string')();
		        a.assert(aggregators[raw.aggregate.method], `Unknown aggregator method "${raw.aggregate.method}" in anchor "${name}"!`);
		        raw.aggregate.parts = a.sane(raw.aggregate.parts || [], `${name}.aggregate.parts`, 'array')();

		        const parts = [];
		        let index = 1;
		        for (const part of raw.aggregate.parts) {
		            parts.push(anchor$1(part, `${name}.aggregate.parts[${index++}]`, points, start, mirror)(units));
		        }

		        point = aggregators[raw.aggregate.method](raw.aggregate, `${name}.aggregate`, parts);
		    }

		    //
		    // Actual orient/shift/rotate/affect handling
		    //

		    const resist = a.sane(raw.resist || false, `${name}.resist`, 'boolean')();
		    const rotator = (config, name, point) => {
		        // simple case: number gets added to point rotation
		        if (a.type(config)(units) == 'number') {
		            let angle = a.sane(config, name, 'number')(units);
		            point.rotate(angle, false, resist);
		        // recursive case: points turns "towards" target anchor
		        } else {
		            const target = anchor$1(config, name, points, start, mirror)(units);
		            point.r = point.angle(target);
		        }
		    };

		    if (raw.orient !== undefined) {
		        rotator(raw.orient, `${name}.orient`, point);
		    }
		    if (raw.shift !== undefined) {
		        const xyval = a.wh(raw.shift, `${name}.shift`)(units);
		        point.shift(xyval, true, resist);
		    }
		    if (raw.rotate !== undefined) {
		        rotator(raw.rotate, `${name}.rotate`, point);
		    }
		    if (raw.affect !== undefined) {
		        const candidate = point.clone();
		        point = start.clone();
		        point.meta = candidate.meta;
		        let affect = raw.affect;
		        if (a.type(affect)() == 'string') affect = affect.split('');
		        affect = a.strarr(affect, `${name}.affect`);
		        let i = 0;
		        for (const aff of affect) {
		            a.in(aff, `${name}.affect[${++i}]`, ['x', 'y', 'r']);
		            point[aff] = candidate[aff];
		        }
		    }

		    return point
		};
		return anchor;
	}

	var hasRequiredPoints;

	function requirePoints () {
		if (hasRequiredPoints) return points;
		hasRequiredPoints = 1;
		const m = require$$0;
		const u = requireUtils();
		const a = requireAssert();
		const prep = requirePrepare();
		const anchor_lib = requireAnchor();

		const push_rotation = points._push_rotation = (list, angle, origin) => {
		    let candidate = origin;
		    for (const r of list) {
		        candidate = m.point.rotate(candidate, r.angle, r.origin);
		    }
		    list.push({
		        angle: angle,
		        origin: candidate
		    });
		};

		const render_zone = points._render_zone = (zone_name, zone, anchor, global_key, units) => {

		    // zone-wide sanitization

		    a.unexpected(zone, `points.zones.${zone_name}`, ['columns', 'rows', 'key']);
		    // the anchor comes from "above", because it needs other zones too (for references)
		    const cols = zone.columns = a.sane(zone.columns || {}, `points.zones.${zone_name}.columns`, 'object')();
		    const zone_wide_rows = a.sane(zone.rows || {}, `points.zones.${zone_name}.rows`, 'object')();
		    for (const [key, val] of Object.entries(zone_wide_rows)) {
		        zone_wide_rows[key] = val || {}; // no check yet, as it will be extended later
		    }
		    const zone_wide_key = a.sane(zone.key || {}, `points.zones.${zone_name}.key`, 'object')();

		    // algorithm prep

		    const points = {};
		    const rotations = [];
		    const zone_anchor = anchor.clone();
		    // transferring the anchor rotation to "real" rotations
		    rotations.push({
		        angle: zone_anchor.r,
		        origin: zone_anchor.p
		    });
		    // and now clear it from the anchor so that we don't apply it twice
		    zone_anchor.r = 0;

		    // column layout

		    if (!Object.keys(cols).length) {
		        cols.default = {};
		    }
		    let first_col = true;
		    for (let [col_name, col] of Object.entries(cols)) {

		        // column-level sanitization

		        col = col || {};

		        a.unexpected(
		            col,
		            `points.zones.${zone_name}.columns.${col_name}`,
		            ['rows', 'key']
		        );
		        col.rows = a.sane(
		            col.rows || {},
		            `points.zones.${zone_name}.columns.${col_name}.rows`,
		            'object'
		        )();
		        for (const [key, val] of Object.entries(col.rows)) {
		            col.rows[key] = val || {}; // again, no check yet, as it will be extended later
		        }
		        col.key = a.sane(
		            col.key || {},
		            `points.zones.${zone_name}.columns.${col_name}.key`,
		            'object'
		        )();

		        // combining row data from zone-wide defs and col-specific defs

		        const actual_rows = Object.keys(prep.extend(zone_wide_rows, col.rows));
		        if (!actual_rows.length) {
		            actual_rows.push('default');
		        }

		        // getting key config through the 5-level extension

		        const keys = [];
		        const default_key = {
		            stagger: units.$default_stagger,
		            spread: units.$default_spread,
		            splay: units.$default_splay,
		            origin: [0, 0],
		            orient: 0,
		            shift: [0, 0],
		            rotate: 0,
		            adjust: {},
		            width: units.$default_width,
		            height: units.$default_height,
		            padding: units.$default_padding,
		            autobind: units.$default_autobind,
		            skip: false,
		            asym: 'both',
		            colrow: '{{col.name}}_{{row}}',
		            name: '{{zone.name}}_{{colrow}}'
		        };
		        for (const row of actual_rows) {
		            const key = prep.extend(
		                default_key,
		                global_key,
		                zone_wide_key,
		                col.key,
		                zone_wide_rows[row] || {},
		                col.rows[row] || {}
		            );

		            key.zone = zone;
		            key.zone.name = zone_name;
		            key.col = col;
		            key.col.name = col_name;
		            key.row = row;

		            key.stagger = a.sane(key.stagger, `${key.name}.stagger`, 'number')(units);
		            key.spread = a.sane(key.spread, `${key.name}.spread`, 'number')(units);
		            key.splay = a.sane(key.splay, `${key.name}.splay`, 'number')(units);
		            key.origin = a.xy(key.origin, `${key.name}.origin`)(units);
		            key.orient = a.sane(key.orient, `${key.name}.orient`, 'number')(units);
		            key.shift = a.xy(key.shift, `${key.name}.shift`)(units);
		            key.rotate = a.sane(key.rotate, `${key.name}.rotate`, 'number')(units);
		            key.width = a.sane(key.width, `${key.name}.width`, 'number')(units);
		            key.height = a.sane(key.height, `${key.name}.height`, 'number')(units);
		            key.padding = a.sane(key.padding, `${key.name}.padding`, 'number')(units);
		            key.skip = a.sane(key.skip, `${key.name}.skip`, 'boolean')();
		            key.asym = a.asym(key.asym, `${key.name}.asym`);

		            // templating support
		            for (const [k, v] of Object.entries(key)) {
		                if (a.type(v)(units) == 'string') {
		                    key[k] = u.template(v, key);
		                }
		            }

		            keys.push(key);
		        }

		        // setting up column-level anchor
		        if (!first_col) {
		            zone_anchor.x += keys[0].spread;
		        }
		        zone_anchor.y += keys[0].stagger;
		        const col_anchor = zone_anchor.clone();

		        // applying col-level rotation (cumulatively, for the next columns as well)

		        if (keys[0].splay) {
		            push_rotation(
		                rotations,
		                keys[0].splay,
		                col_anchor.clone().shift(keys[0].origin, false).p
		            );
		        }

		        // actually laying out keys
		        let running_anchor = col_anchor.clone();
		        for (const r of rotations) {
		            running_anchor.rotate(r.angle, r.origin);
		        }

		        for (const key of keys) {

		            // copy the current column anchor
		            let point = running_anchor.clone();

		            // apply cumulative per-key adjustments
		            point.r += key.orient;
		            point.shift(key.shift);
		            point.r += key.rotate;

		            // commit running anchor
		            running_anchor = point.clone();

		            // apply independent adjustments
		            point = anchor_lib.parse(key.adjust, `${key.name}.adjust`, {}, point)(units);

		            // save new key
		            point.meta = key;
		            points[key.name] = point;

		            // advance the running anchor to the next position
		            running_anchor.shift([0, key.padding]);
		        }

		        first_col = false;
		    }

		    return points
		};

		const parse_axis = points._parse_axis = (config, name, points, units) => {
		    if (!['number', 'undefined'].includes(a.type(config)(units))) {
		        const mirror_obj = a.sane(config, name, 'object')();
		        const distance = a.sane(mirror_obj.distance || 0, `${name}.distance`, 'number')(units);
		        delete mirror_obj.distance;
		        let axis = anchor_lib.parse(mirror_obj, name, points)(units).x;
		        axis += distance / 2;
		        return axis
		    } else return config
		};

		const perform_mirror = points._perform_mirror = (point, axis, units) => {
		    point.meta.mirrored = false;
		    if (point.meta.asym == 'source') return ['', null]
		    const mp = point.clone().mirror(axis);
		    const mirrored_name = `mirror_${point.meta.name}`;
		    const mirror_config = mp.meta.mirror || {};
		    mp.meta = prep.extend(mp.meta, mirror_config);
		    mp.meta.name = mirrored_name;
		    mp.meta.colrow = `mirror_${mp.meta.colrow}`;
		    mp.meta.mirrored = true;

		    // Re-sanitize overridden properties
		    if (mirror_config.width !== undefined) {
		        mp.meta.width = a.sane(mp.meta.width, `${mp.meta.name}.width`, 'number')(units);
		    }
		    if (mirror_config.height !== undefined) {
		        mp.meta.height = a.sane(mp.meta.height, `${mp.meta.name}.height`, 'number')(units);
		    }

		    if (point.meta.asym == 'clone') {
		        point.meta.skip = true;
		    }
		    return [mirrored_name, mp]
		};

		const perform_autobind = points._perform_autobind = (points, units) => {

		    const bounds = {};
		    const col_lists = {};
		    const mirrorzone = p => (p.meta.mirrored ? 'mirror_' : '') + p.meta.zone.name;

		    // round one: get column upper/lower bounds and per-zone column lists
		    for (const p of Object.values(points)) {

		        const zone = mirrorzone(p);
		        const col = p.meta.col.name;

		        if (!bounds[zone]) bounds[zone] = {};
		        if (!bounds[zone][col]) bounds[zone][col] = {min: Infinity, max: -Infinity};
		        if (!col_lists[zone]) col_lists[zone] = Object.keys(p.meta.zone.columns);

		        bounds[zone][col].min = Math.min(bounds[zone][col].min, p.y);
		        bounds[zone][col].max = Math.max(bounds[zone][col].max, p.y);
		    }

		    // round two: apply autobind as appropriate
		    for (const p of Object.values(points)) {

		        const autobind = a.sane(p.meta.autobind, `${p.meta.name}.autobind`, 'number')(units);
		        if (!autobind) continue

		        const zone = mirrorzone(p);
		        const col = p.meta.col.name;
		        const col_list = col_lists[zone];
		        const col_bounds = bounds[zone][col];

		        
		        // specify default as -1, so we can recognize where it was left undefined even after number-ification
		        const bind = p.meta.bind = a.trbl(p.meta.bind, `${p.meta.name}.bind`, -1)(units);

		        // up
		        if (bind[0] == -1) {
		            if (p.y < col_bounds.max) bind[0] = autobind;
		            else bind[0] = 0;
		        }

		        // down
		        if (bind[2] == -1) {
		            if (p.y > col_bounds.min) bind[2] = autobind;
		            else bind[2] = 0;
		        }

		        // left
		        if (bind[3] == -1) {
		            bind[3] = 0;
		            const col_index = col_list.indexOf(col);
		            if (col_index > 0) {
		                const left = bounds[zone][col_list[col_index - 1]];
		                if (left && p.y >= left.min && p.y <= left.max) {
		                    bind[3] = autobind;
		                }
		            }
		        }

		        // right
		        if (bind[1] == -1) {
		            bind[1] = 0;
		            const col_index = col_list.indexOf(col);
		            if (col_index < col_list.length - 1) {
		                const right = bounds[zone][col_list[col_index + 1]];
		                if (right && p.y >= right.min && p.y <= right.max) {
		                    bind[1] = autobind;
		                }
		            }
		        }
		    }
		};

		points.parse = (config, units) => {

		    // config sanitization
		    a.unexpected(config, 'points', ['zones', 'key', 'rotate', 'mirror']);
		    const zones = a.sane(config.zones, 'points.zones', 'object')();
		    const global_key = a.sane(config.key || {}, 'points.key', 'object')();
		    const global_rotate = a.sane(config.rotate || 0, 'points.rotate', 'number')(units);
		    const global_mirror = config.mirror;
		    let points = {};

		    // rendering zones
		    for (let [zone_name, zone] of Object.entries(zones)) {

		        // zone sanitization
		        zone = a.sane(zone || {}, `points.zones.${zone_name}`, 'object')();

		        // extracting keys that are handled here, not at the zone render level
		        const anchor = anchor_lib.parse(zone.anchor || {}, `points.zones.${zone_name}.anchor`, points)(units);
		        const rotate = a.sane(zone.rotate || 0, `points.zones.${zone_name}.rotate`, 'number')(units);
		        const mirror = zone.mirror;
		        delete zone.anchor;
		        delete zone.rotate;
		        delete zone.mirror;

		        // creating new points
		        let new_points = render_zone(zone_name, zone, anchor, global_key, units);

		        // simplifying the names in individual point "zones" and single-key columns
		        while (Object.keys(new_points).some(k => k.endsWith('_default'))) {
		            for (const key of Object.keys(new_points).filter(k => k.endsWith('_default'))) {
		                const new_key = key.slice(0, -8);
		                new_points[new_key] = new_points[key];
		                new_points[new_key].meta.name = new_key;
		                delete new_points[key];
		            }
		        }

		        // adjusting new points
		        for (const [new_name, new_point] of Object.entries(new_points)) {
		            
		            // issuing a warning for duplicate keys
		            if (Object.keys(points).includes(new_name)) {
		                throw new Error(`Key "${new_name}" defined more than once!`)
		            }

		            // per-zone rotation
		            if (rotate) {
		                new_point.rotate(rotate);
		            }
		        }

		        // adding new points so that they can be referenced from now on
		        points = Object.assign(points, new_points);

		        // per-zone mirroring for the new keys
		        const axis = parse_axis(mirror, `points.zones.${zone_name}.mirror`, points, units);
		        if (axis !== undefined) {
		            const mirrored_points = {};
		            for (const new_point of Object.values(new_points)) {
		                const [mname, mp] = perform_mirror(new_point, axis, units);
		                if (mp) {
		                    mirrored_points[mname] = mp;
		                }
		            }
		            points = Object.assign(points, mirrored_points);
		        }
		    }

		    // applying global rotation
		    for (const point of Object.values(points)) {
		        if (global_rotate) {
		            point.rotate(global_rotate);
		        }
		    }

		    // global mirroring for points that haven't been mirrored yet
		    const global_axis = parse_axis(global_mirror, `points.mirror`, points, units);
		    const global_mirrored_points = {};
		    for (const point of Object.values(points)) {
		        if (global_axis !== undefined && point.meta.mirrored === undefined) {
		            const [mname, mp] = perform_mirror(point, global_axis, units);
		            if (mp) {
		                global_mirrored_points[mname] = mp;
		            }
		        }
		    }
		    points = Object.assign(points, global_mirrored_points);

		    // removing temporary points
		    const filtered = {};
		    for (const [k, p] of Object.entries(points)) {
		        if (p.meta.skip) continue
		        filtered[k] = p;
		    }

		    // apply autobind
		    perform_autobind(filtered, units);

		    // done
		    return filtered
		};

		points.visualize = (points, units) => {
		    const models = {};
		    for (const [pname, p] of Object.entries(points)) {
		        const w = p.meta.width;
		        const h = p.meta.height;
		        const rect = u.rect(w, h, [-w/2, -h/2]);
		        models[pname] = p.position(rect);
		    }
		    return {models: models}
		};
		return points;
	}

	var outlines = {};

	var operation = {};

	var hasRequiredOperation;

	function requireOperation () {
		if (hasRequiredOperation) return operation;
		hasRequiredOperation = 1;
		const op_prefix = operation.op_prefix = str => {

		    const prefix = str[0];
		    const suffix = str.slice(1);
		    const result = {name: suffix, operation: 'add'};

		    if (prefix == '+') ; // noop
		    else if (prefix == '-') result.operation = 'subtract';
		    else if (prefix == '~') result.operation = 'intersect';
		    else if (prefix == '^') result.operation = 'stack';
		    else result.name = str; // no prefix, so the name was the whole string

		    return result
		};

		operation.operation = (str, choices={}, order=Object.keys(choices)) => {
		    let res = op_prefix(str);
		    for (const key of order) {
		        if (choices[key].includes(res.name)) {
		            res.what = key;
		            break
		        }
		    }
		    return res
		};
		return operation;
	}

	var filter = {};

	var hasRequiredFilter;

	function requireFilter () {
		if (hasRequiredFilter) return filter;
		hasRequiredFilter = 1;
		const u = requireUtils();
		const a = requireAssert();
		const anchor_lib = requireAnchor();
		const Point = requirePoint();
		const anchor = anchor_lib.parse;

		const _true = () => true;
		const _false = () => false;
		const _and = arr => p => arr.map(e => e(p)).reduce((a, b) => a && b);
		const _or = arr => p => arr.map(e => e(p)).reduce((a, b) => a || b);

		const similar = (keys, reference, name, units) => {
		    let neg = false;
		    if (reference.startsWith('-')) {
		        neg = true;
		        reference = reference.slice(1);
		    }

		    // support both string or regex as reference
		    let internal_tester = val => (''+val) == reference;
		    if (reference.startsWith('/')) {
		        try {
		            const regex_parts = reference.split('/');
		            regex_parts.shift(); // remove starting slash
		            const flags = regex_parts.pop();
		            const regex = new RegExp(regex_parts.join('/'), flags);
		            internal_tester = val => regex.test(''+val);
		        } catch (ex) {
		            throw new Error(`Invalid regex "${reference}" found at filter "${name}"!`)
		        }
		    }

		    // support strings, arrays, or objects as key
		    const external_tester = (point, key) => {
		        const value = u.deep(point, key);
		        if (a.type(value)() == 'array') {
		            return value.some(subkey => internal_tester(subkey))
		        } else if (a.type(value)() == 'object') {
		            return Object.keys(value).some(subkey => internal_tester(subkey))
		        } else {
		            return internal_tester(value)
		        }
		    };

		    // consider negation
		    if (neg) {
		        return point => keys.every(key => !external_tester(point, key))
		    } else {
		        return point => keys.some(key => external_tester(point, key))
		    }
		};

		const comparators = {
		    '~': similar
		    // TODO: extension point for other operators...
		};
		const symbols = Object.keys(comparators);

		const simple = (exp, name, units) => {

		    let keys = ['meta.name', 'meta.tags'];
		    let op = '~';
		    let value;
		    const parts = exp.split(/\s+/g);

		    // full case
		    if (symbols.includes(parts[1])) {
		        keys = parts[0].split(',');
		        op = parts[1];
		        value = parts.slice(2).join(' ');
		    
		    // middle case, just an operator spec, default "keys"
		    } else if (symbols.includes(parts[0])) {
		        op = parts[0];
		        value = parts.slice(1).join(' ');

		    // basic case, only "value"
		    } else {
		        value = exp;
		    }

		    return point => comparators[op](keys, value, name, units)(point)
		};

		const complex = (config, name, units, aggregator=_or) => {

		    // we branch by type
		    const type = a.type(config)(units);
		    switch(type) {

		        // boolean --> either all or nothing
		        case 'boolean':
		            return config ? _true : _false
		 
		        // string --> base case, meaning a simple/single filter
		        case 'string':
		            return simple(config, name, units)
		        
		        // array --> aggregated simple filters with alternating and/or conditions
		        case 'array':
		            const alternate = aggregator == _and ? _or : _and;
		            return aggregator(config.map(elem => complex(elem, name, units, alternate)))

		        default:
		            throw new Error(`Unexpected type "${type}" found at filter "${name}"!`)
		    }
		};

		const contains_object = (val) => {
		    if (a.type(val)() == 'object') return true
		    if (a.type(val)() == 'array') return val.some(el => contains_object(el))
		    return false
		};

		filter.parse = (config, name, points={}, units={}, asym='source') => {

		    let result = [];

		    // if a filter decl is undefined, it's just the default point at [0, 0]
		    if (config === undefined) {
		        result.push(new Point());

		    // if a filter decl is an object, or an array that contains an object at any depth, it is an anchor
		    } else if (contains_object(config)) {
		        if (['source', 'both'].includes(asym)) {
		            result.push(anchor(config, name, points)(units));
		        }
		        if (['clone', 'both'].includes(asym)) {
		            // this is strict: if the ref of the anchor doesn't have a mirror pair, it will error out
		            // also, we check for duplicates as ref-less anchors mirror to themselves
		            const clone = anchor(config, name, points, undefined, true)(units);
		            if (result.every(p => !p.equals(clone))) {
		                result.push(clone);
		            }
		        }
		        
		    // otherwise, it is treated as a condition to filter all available points
		    } else {
		        const source = Object.values(points).filter(complex(config, name, units));
		        if (['source', 'both'].includes(asym)) {
		            result = result.concat(source);
		        }
		        if (['clone', 'both'].includes(asym)) {
		            // this is permissive: we only include mirrored versions if they exist, and don't fuss if they don't
		            // also, we check for duplicates as clones can potentially refer back to their sources, too
		            const pool = result.map(p => p.meta.name);
		            result = result.concat(
		                source.map(p => points[anchor_lib.mirror(p.meta.name)])
		                .filter(p => !!p)
		                .filter(p => !pool.includes(p.meta.name))
		            );
		        }
		    }

		    return result
		};
		return filter;
	}

	var hasRequiredOutlines;

	function requireOutlines () {
		if (hasRequiredOutlines) return outlines;
		hasRequiredOutlines = 1;
		const m = require$$0;
		const u = requireUtils();
		const a = requireAssert();
		const o = requireOperation();
		const Point = requirePoint();
		const prep = requirePrepare();
		const anchor = requireAnchor().parse;
		const filter = requireFilter().parse;
		const hulljs = require$$8$1;

		const binding = (base, bbox, point, units) => {

		    let bind = a.trbl(point.meta.bind || 0, `${point.meta.name}.bind`)(units);
		    // if it's a mirrored key, we swap the left and right bind values
		    if (point.meta.mirrored) {
		        bind = [bind[0], bind[3], bind[2], bind[1]];
		    }

		    const bt = Math.max(bbox.high[1], 0) + Math.max(bind[0], 0);
		    const br = Math.max(bbox.high[0], 0) + Math.max(bind[1], 0);
		    const bd = Math.min(bbox.low[1], 0) - Math.max(bind[2], 0);
		    const bl = Math.min(bbox.low[0], 0) - Math.max(bind[3], 0);

		    if (bind[0] || bind[1]) base = u.union(base, u.rect(br, bt));
		    if (bind[1] || bind[2]) base = u.union(base, u.rect(br, -bd, [0, bd]));
		    if (bind[2] || bind[3]) base = u.union(base, u.rect(-bl, -bd, [bl, bd]));
		    if (bind[3] || bind[0]) base = u.union(base, u.rect(-bl, bt, [bl, 0]));

		    return base
		};

		const rectangle = (config, name, points, outlines, units) => {

		    // prepare params
		    a.unexpected(config, `${name}`, ['size', 'corner', 'bevel']);
		    const size = a.wh(config.size, `${name}.size`)(units);
		    const rec_units = prep.extend({
		        sx: size[0],
		        sy: size[1]
		    }, units);
		    const corner = a.sane(config.corner || 0, `${name}.corner`, 'number')(rec_units);
		    const bevel = a.sane(config.bevel || 0, `${name}.bevel`, 'number')(rec_units);

		    // return shape function and its units
		    return [() => {

		        const error = (dim, val) => `Rectangle for "${name}" isn't ${dim} enough for its corner and bevel (${val} - 2 * ${corner} - 2 * ${bevel} <= 0)!`;
		        const [w, h] = size;
		        const mod = 2 * (corner + bevel);
		        const cw = w - mod;
		        a.assert(cw >= 0, error('wide', w));
		        const ch = h - mod;
		        a.assert(ch >= 0, error('tall', h));

		        let rect = new m.models.Rectangle(cw, ch);
		        if (bevel) {
		            rect = u.poly([
		                [-bevel, 0],
		                [-bevel, ch],
		                [0, ch + bevel],
		                [cw, ch + bevel],
		                [cw + bevel, ch],
		                [cw + bevel, 0],
		                [cw, -bevel],
		                [0, -bevel]
		            ]);
		        }
		        if (corner > 0) rect = m.model.outline(rect, corner, 0);
		        rect = m.model.moveRelative(rect, [-cw/2, -ch/2]);
		        const bbox = {high: [w/2, h/2], low: [-w/2, -h/2]};

		        return [rect, bbox]
		    }, rec_units]
		};

		const circle = (config, name, points, outlines, units) => {

		    // prepare params
		    a.unexpected(config, `${name}`, ['radius']);
		    const radius = a.sane(config.radius, `${name}.radius`, 'number')(units);
		    const circ_units = prep.extend({
		        r: radius
		    }, units);

		    // return shape function and its units
		    return [() => {
		        let circle = u.circle([0, 0], radius);
		        const bbox = {high: [radius, radius], low: [-radius, -radius]};
		        return [circle, bbox]
		    }, circ_units]
		};

		const polygon = (config, name, points, outlines, units) => {

		    // prepare params
		    a.unexpected(config, `${name}`, ['points']);
		    const poly_points = a.sane(config.points, `${name}.points`, 'array')();

		    // return shape function and its units
		    return [point => {
		        const parsed_points = [];
		        // the poly starts at [0, 0] as it will be positioned later
		        // but we keep the point metadata for potential mirroring purposes
		        let last_anchor = new Point(0, 0, 0, point.meta);
		        let poly_index = -1;
		        for (const poly_point of poly_points) {
		            const poly_name = `${name}.points[${++poly_index}]`;
		            last_anchor = anchor(poly_point, poly_name, points, last_anchor)(units);
		            parsed_points.push(last_anchor.p);
		        }
		        let poly = u.poly(parsed_points);
		        const bbox = u.bbox(parsed_points);
		        return [poly, bbox]
		    }, units]
		};

		const hull = (config, name, points, outlines, units) => {

		  // prepare params
		  a.unexpected(config, `${name}`, ['concavity', 'extend', 'points']);
		  const concavity = a.sane(config.concavity || 50, `${name}.concavity`, 'number')(units);
		  // Extend should default to `true` if not defined
		  const extend = a.sane(config.extend === undefined || config.extend, `${name}.extend`, 'boolean')(units);
		  const hull_points = a.sane(config.points, `${name}.points`, 'array')();

		  // return shape function and its units
		  return [point => {
		    const parsed_points = [];
		    // the poly starts at [0, 0] as it will be positioned later
		    // but we keep the point metadata for potential mirroring purposes
		    let last_anchor = new Point(0, 0, 0, point.meta);
		    let poly_index = -1;
		    for (const poly_point of hull_points) {
		        const poly_name = `${name}.points[${++poly_index}]`;
		        last_anchor = anchor(poly_point, poly_name, points, last_anchor)(units);
		        if(extend) {
		          const w = last_anchor.meta.width;
		          const h = last_anchor.meta.height;
		          const rect = u.rect(w, h, [-w/2, -h/2]);
		          const model = last_anchor.position(rect);
		          const top_origin = model.paths.top.origin;
		          const top_end =  model.paths.top.end;
		          const bottom_origin =  model.paths.bottom.origin;
		          const bottom_end =  model.paths.bottom.end;
		          const model_origin = model.origin;
		          parsed_points.push([top_origin[0] + model_origin[0], top_origin[1] + model_origin[1]]);
		          parsed_points.push([top_end[0] + model_origin[0], top_end[1] + model_origin[1]]);
		          parsed_points.push([bottom_origin[0] + model_origin[0], bottom_origin[1] + model_origin[1]]);
		          parsed_points.push([bottom_end[0] + model_origin[0], bottom_end[1] + model_origin[1]]);
		          // When width or height are too large, we need to add additional points along the sides, or
		          // the convex hull algorithm will fold "within" the key. Points are then added at regular
		          // intervals, their number being at least 2, since MakerJS places the first two points at
		          // either end of the path. When a side is longer than 18 divide the length of a side by
		          // that amount and add it to 2, this way we always have at least a middle point for sides
		          // longer than 18 
		          const l = 18;
		          let intermediate_points = [];
		          if (w > l) {
		            intermediate_points = intermediate_points.concat(m.path.toPoints(model.paths.top, 2 + Math.floor(w / l)));
		            intermediate_points = intermediate_points.concat(m.path.toPoints(model.paths.bottom, 2 + Math.floor(w / l)));
		          }
		          if (h > l) {
		            intermediate_points = intermediate_points.concat(m.path.toPoints(model.paths.left, 2 + Math.floor(h / l)));
		            intermediate_points = intermediate_points.concat(m.path.toPoints(model.paths.right, 2 + Math.floor(h / l)));
		          }
		          for (let i = 0; i < intermediate_points.length; i++) {
		            const p = intermediate_points[i];
		            if (!m.measure.isPointEqual(p, top_origin) &&
		              !m.measure.isPointEqual(p, top_end) &&
		              !m.measure.isPointEqual(p, bottom_origin) &&
		              !m.measure.isPointEqual(p, bottom_end)) {
		              // Not one of the corners
		              const intermediate_point = [p[0] + model_origin[0], p[1] + model_origin[1]];
		              parsed_points.push(intermediate_point);
		            }
		          }
		        } else {
		          parsed_points.push(last_anchor.p);
		        }
		    }
		    const poly_points = hulljs(parsed_points, concavity);
		    let poly = u.poly(poly_points);
		    const bbox = u.bbox(poly_points);
		    return [poly, bbox]
		  }, units]
		};

		const outline = (config, name, points, outlines, units) => {

		    // prepare params
		    a.unexpected(config, `${name}`, ['name', 'origin']);
		    a.assert(outlines[config.name], `Field "${name}.name" does not name an existing outline!`);
		    const origin = anchor(config.origin || {}, `${name}.origin`, points)(units);
		    
		    // return shape function and its units
		    return [() => {
		        let o = u.deepcopy(outlines[config.name]);
		        o = origin.unposition(o);
		        const bbox = m.measure.modelExtents(o);
		        return [o, bbox]
		    }, units]
		};

		const path = (config, name, points, outlines, units) => {

		    // prepare params
		    a.unexpected(config, `${name}`, ['segments']);
		    const segments = a.sane(config.segments, `${name}.segments`, 'array')();
		    const segments_points = [];
		    for(const [index, segment] of segments.entries()) {
		      a.in(segment.type, `${name}.segments.${index}.type`, ['line', 'arc', 's_curve', 'bezier']);
		      segments_points.push(a.sane(segment.points, `${name}.segments.${index}.points`, 'array')());
		      const num_points = segment.points.length;
		      switch (segment.type) {
		       case 'bezier':
		          a.unexpected(segment, `${name}.segments.${index}`, ['type', `points`, 'accuracy']);
		          break
		        case 'arc':
		        case 'line':
		        case 's_curve':
		          a.unexpected(segment, `${name}.segments.${index}`, ['type', `points`]);
		          break
		      }
		      switch (segment.type) {
		       case 'bezier':
		          a.assert(num_points > (index === 0 ? 2 : 1), `Bezier Curve needs 3 or 4 points, but ${index === 0 ? num_points : num_points + 1} were provided (${index === 0 ? '' : '1 inherited from the previous segment, '}${num_points} declared)`);
		          break
		        case 'arc':
		          a.assert(num_points === (index === 0 ? 3 : 2), `Arc needs 3 points, but ${index === 0 ? num_points : num_points + 1} were provided (${index === 0 ? '' : '1 inherited from the previous segment, '}${num_points} declared)`);
		          break
		        case 'line':
		          a.assert(num_points > (index === 0 ? 1 : 0), `Line need at least 2 points, but ${index === 0 ? num_points : num_points + 1} ${num_points === 1 ? 'was' : 'were'} provided (${index === 0 ? '' : '1 inherited from the previous segment, '}${num_points} declared)`);
		          break
		        case 's_curve':
		          a.assert(num_points === (index === 0 ? 2 : 1), `S-Curve needs 2 points, but ${index === 0 ? num_points : num_points + 1} ${num_points === 1 ? 'was' : 'were'} provided (${index === 0 ? '' : '1 inherited from the previous segment, '}${num_points} declared)`);
		          break
		      }
		    }

		    // return shape function and its units
		    return [(point) => {
		      let shape = {
		        models: {},
		        paths: {}
		      };
		      // the segment starts at [0, 0] as it will be positioned later
		      // but we keep the point metadata for potential mirroring purposes
		      let first_anchor = undefined;
		      let last_anchor = new Point(0, 0, 0, point.meta);
		      for (const [index, segment] of segments.entries()){
		        const parsed_points = [];
		        // Segments after the first one need one less point, as the start is taken from the
		        // last segment
		        if (index > 0) {
		          parsed_points.push(last_anchor.p);
		        }
		        let point_index = -1;
		        for (const segment_point of segments_points[index]) {
		            const segment_points_name = `${name}.segments.${index}.points[${++point_index}]`;
		            last_anchor = anchor(segment_point, segment_points_name, points, last_anchor)(units);
		            if(first_anchor === undefined) {
		              first_anchor = last_anchor;
		            }
		            parsed_points.push(last_anchor.p);
		        }
		        const segment_name = `path${index}`;
		        switch (segment.type) {
		          case 'line':
		            let line = new m.models.ConnectTheDots(false, parsed_points);
		            shape.models[segment_name] = line;
		            break
		          case 'arc':
		            let arc = new m.paths.Arc(...parsed_points);
		            shape.paths[segment_name] = arc;
		            break
		          case 's_curve':
		            const origin = parsed_points[0];
		            a.assert(parsed_points[0][0] !== parsed_points[1][0], `The ${name}.segments.${index} S-Curve segment cannot have points on the same X axis`);
		            const width = Math.abs(parsed_points[1][0] - parsed_points[0][0]);
		            a.assert(parsed_points[0][1] !== parsed_points[1][1], `The ${name}.segments.${index} S-Curve segment cannot have points on the same Y axis`);
		            const height = Math.abs(parsed_points[1][1] - parsed_points[0][1]);
		            const mirrorX = parsed_points[0][0] > parsed_points[1][0];
		            const mirrorY = parsed_points[0][1] > parsed_points[1][1];
		            const s_curve_raw = new m.models.SCurve(width, height);
		            const mirrored_s_curve = m.model.mirror(s_curve_raw, mirrorX, mirrorY);
		            const s_curve = m.model.move(mirrored_s_curve, origin);
		            shape.models[segment_name] = s_curve;
		            break
		          case 'bezier':
		            let bezier = new m.models.BezierCurve(...parsed_points);
		            shape.models[segment_name] = bezier;
		            break
		        }
		      }
		      // We always close the shape with a line between the first and last anchor, if they are not already the same
		      if(first_anchor.x !== last_anchor.x || first_anchor.y != last_anchor.y) {
		        let closing_line = new m.paths.Line([first_anchor.x, first_anchor.y], [last_anchor.x, last_anchor.y]);
		        shape.paths["closing_line"] = closing_line;
		      }
		      const chain = m.model.findSingleChain(shape);
		      a.assert(chain.endless, "The provided path configuration doesn't generate a closed shape.");
		      const bbox = m.measure.modelExtents(shape);
		      return [shape, {low: bbox.low, high: bbox.high}]
		    }, units]
		};

		const whats = {
		    rectangle,
		    circle,
		    polygon,
		    outline,
		    path,
		    hull
		};

		const expand_shorthand = (config, name, units) => {
		    if (a.type(config.expand)(units) == 'string') {
		        const prefix = config.expand.slice(0, -1);
		        const suffix = config.expand.slice(-1);
		        const valid_suffixes = [')', '>', ']'];
		        a.assert(valid_suffixes.includes(suffix), `If field "${name}" is a string, ` +
		            `it should end with one of [${valid_suffixes.map(s => `'${s}'`).join(', ')}]!`);
		        config.expand = prefix;
		        config.joints = config.joints || valid_suffixes.indexOf(suffix);
		    }
		    
		    if (a.type(config.joints)(units) == 'string') {
		        if (config.joints == 'round') config.joints = 0;
		        if (config.joints == 'pointy') config.joints = 1;
		        if (config.joints == 'beveled') config.joints = 2;
		    }
		};

		outlines.parse = (config, points, units) => {

		    // output outlines will be collected here
		    const outlines = {};

		    // the config must be an actual object so that the exports have names
		    config = a.sane(config, 'outlines', 'object')();
		    for (let [outline_name, parts] of Object.entries(config)) {

		        // placeholder for the current outline
		        outlines[outline_name] = {models: {}};

		        // each export can consist of multiple parts
		        // either sub-objects or arrays are fine...
		        if (a.type(parts)() == 'array') {
		            parts = {...parts};
		        }
		        parts = a.sane(parts, `outlines.${outline_name}`, 'object')();
		        
		        for (let [part_name, part] of Object.entries(parts)) {
		            
		            const name = `outlines.${outline_name}.${part_name}`;

		            // string part-shortcuts are expanded first
		            if (a.type(part)() == 'string') {
		                part = o.operation(part, {outline: Object.keys(outlines)});
		            }

		            // process keys that are common to all part declarations
		            const operation = u[a.in(part.operation || 'add', `${name}.operation`, ['add', 'subtract', 'intersect', 'stack'])];
		            const what = a.in(part.what || 'outline', `${name}.what`, ['rectangle', 'circle', 'polygon', 'outline', 'path', 'hull']);
		            const bound = !!part.bound;
		            const asym = a.asym(part.asym || 'source', `${name}.asym`);

		            // `where` is delayed until we have all, potentially what-dependent units
		            // default where is [0, 0], as per filter parsing
		            const original_where = part.where; // need to save, so the delete's don't get rid of it below
		            const where = units => filter(original_where, `${name}.where`, points, units, asym);
		            
		            const original_adjust = part.adjust; // same as above
		            const fillet = a.sane(part.fillet || 0, `${name}.fillet`, 'number')(units);
		            expand_shorthand(part, `${name}.expand`, units);
		            const expand = a.sane(part.expand || 0, `${name}.expand`, 'number')(units);
		            const joints = a.in(a.sane(part.joints || 0, `${name}.joints`, 'number')(units), `${name}.joints`, [0, 1, 2]);
		            const scale = a.sane(part.scale || 1, `${name}.scale`, 'number')(units);

		            // these keys are then removed, so ops can check their own unexpected keys without interference
		            delete part.operation;
		            delete part.what;
		            delete part.bound;
		            delete part.asym;
		            delete part.where;
		            delete part.adjust;
		            delete part.fillet;
		            delete part.expand;
		            delete part.joints;
		            delete part.scale;

		            // a prototype "shape" maker (and its units) are computed
		            const [shape_maker, shape_units] = whats[what](part, name, points, outlines, units);
		            const adjust = start => anchor(original_adjust || {}, `${name}.adjust`, points, start)(shape_units);

		            // and then the shape is repeated for all where positions
		            for (const w of where(shape_units)) {
		                const point = adjust(w.clone());
		                let [shape, bbox] = shape_maker(point); // point is passed for mirroring metadata only...
		                if (bound) {
		                    shape = binding(shape, bbox, point, shape_units);
		                }
		                shape = point.position(shape); // ...actual positioning happens here
		                outlines[outline_name] = operation(outlines[outline_name], shape);
		            }

		            if (scale !== 1) {
		                outlines[outline_name] = m.model.scale(outlines[outline_name], scale);
		            }
		    
		            if (expand) {
		                outlines[outline_name] = m.model.outline(
		                    outlines[outline_name], Math.abs(expand), joints, (expand < 0), {farPoint: u.farPoint}
		                );
		            }

		            if (fillet) {
		                for (const [index, chain] of m.model.findChains(outlines[outline_name]).entries()) {
		                    outlines[outline_name].models[`fillet_${part_name}_${index}`] = m.chain.fillet(chain, fillet);
		                }
		            }
		        }

		        // final adjustments
		        m.model.originate(outlines[outline_name]);
		        m.model.simplify(outlines[outline_name]);

		    }

		    return outlines
		};
		return outlines;
	}

	var cases = {};

	var hasRequiredCases;

	function requireCases () {
		if (hasRequiredCases) return cases;
		hasRequiredCases = 1;
		const m = require$$0;
		const a = requireAssert();
		const o = requireOperation();

		cases.parse = (config, outlines, units) => {

		    const cases_config = a.sane(config, 'cases', 'object')();

		    const scripts = {};
		    const cases = {};
		    const results = {};

		    const resolve = (case_name, resolved_scripts=new Set(), resolved_cases=new Set()) => {
		        for (const o of Object.values(cases[case_name].outline_dependencies)) {
		            resolved_scripts.add(o);
		        }
		        for (const c of Object.values(cases[case_name].case_dependencies)) {
		            resolved_cases.add(c);
		            resolve(c, resolved_scripts, resolved_cases);
		        }
		        const result = [];
		        for (const o of resolved_scripts) {
		            result.push(scripts[o] + '\n\n');
		        }
		        for (const c of resolved_cases) {
		            result.push(cases[c].body);
		        }
		        result.push(cases[case_name].body);
		        result.push(`
        
            function main() {
                return ${case_name}_case_fn();
            }

        `);
		        return result.join('')
		    };

		    for (let [case_name, case_config] of Object.entries(cases_config)) {

		        // config sanitization
		        if (a.type(case_config)() == 'array') {
		            case_config = {...case_config};
		        }
		        const parts = a.sane(case_config, `cases.${case_name}`, 'object')();

		        const body = [];
		        const case_dependencies = [];
		        const outline_dependencies = [];
		        let first = true;
		        for (let [part_name, part] of Object.entries(parts)) {
		            if (a.type(part)() == 'string') {
		                part = o.operation(part, {
		                    outline: Object.keys(outlines),
		                    case: Object.keys(cases)
		                }, ['case', 'outline']);
		            }
		            const part_qname = `cases.${case_name}.${part_name}`;
		            const part_var = `${case_name}__part_${part_name}`;
		            a.unexpected(part, part_qname, ['what', 'name', 'extrude', 'shift', 'rotate', 'operation']);
		            const what = a.in(part.what || 'outline', `${part_qname}.what`, ['outline', 'case']);
		            const name = a.sane(part.name, `${part_qname}.name`, 'string')();
		            const shift = a.numarr(part.shift || [0, 0, 0], `${part_qname}.shift`, 3)(units);
		            const rotate = a.numarr(part.rotate || [0, 0, 0], `${part_qname}.rotate`, 3)(units);
		            const operation = a.in(part.operation || 'add', `${part_qname}.operation`, ['add', 'subtract', 'intersect']);

		            let base;
		            if (what == 'outline') {
		                const extrude = a.sane(part.extrude || 1, `${part_qname}.extrude`, 'number')(units);
		                const outline = outlines[name];
		                a.assert(outline, `Field "${part_qname}.name" does not name a valid outline!`);
		                // This is a hack to separate multiple calls to the same outline with different extrude values
		                // I know it needlessly duplicates a lot of code, but it's the quickest fix in the short term
		                // And on the long run, we'll probably be moving to CADQuery anyway...
		                const extruded_name = `${name}_extrude_` + ('' + extrude).replace(/\D/g, '_');
		                if (!scripts[extruded_name]) {
		                    scripts[extruded_name] = m.exporter.toJscadScript(outline, {
		                        functionName: `${extruded_name}_outline_fn`,
		                        extrude: extrude,
		                        indent: 4
		                    });
		                }
		                outline_dependencies.push(extruded_name);
		                base = `${extruded_name}_outline_fn()`;
		            } else {
		                a.assert(part.extrude === undefined, `Field "${part_qname}.extrude" should not be used when what=case!`);
		                a.in(name, `${part_qname}.name`, Object.keys(cases));
		                case_dependencies.push(name);
		                base = `${name}_case_fn()`;
		            }

		            let op = 'union';
		            if (operation == 'subtract') op = 'subtract';
		            else if (operation == 'intersect') op = 'intersect';

		            let op_statement = `let result = ${part_var};`;
		            if (!first) {
		                op_statement = `result = result.${op}(${part_var});`;
		            }
		            first = false;

		            body.push(`

                // creating part ${part_name} of case ${case_name}
                let ${part_var} = ${base};

                // make sure that rotations are relative
                let ${part_var}_bounds = ${part_var}.getBounds();
                let ${part_var}_x = ${part_var}_bounds[0].x + (${part_var}_bounds[1].x - ${part_var}_bounds[0].x) / 2
                let ${part_var}_y = ${part_var}_bounds[0].y + (${part_var}_bounds[1].y - ${part_var}_bounds[0].y) / 2
                ${part_var} = translate([-${part_var}_x, -${part_var}_y, 0], ${part_var});
                ${part_var} = rotate(${JSON.stringify(rotate)}, ${part_var});
                ${part_var} = translate([${part_var}_x, ${part_var}_y, 0], ${part_var});

                ${part_var} = translate(${JSON.stringify(shift)}, ${part_var});
                ${op_statement}
                
            `);
		        }

		        cases[case_name] = {
		            body: `

                function ${case_name}_case_fn() {
                    ${body.join('')}
                    return result;
                }
            
            `,
		            case_dependencies,
		            outline_dependencies
		        };

		        results[case_name] = resolve(case_name);
		    }

		    return results
		};
		return cases;
	}

	var pcbs = {};

	var alps;
	var hasRequiredAlps;

	function requireAlps () {
		if (hasRequiredAlps) return alps;
		hasRequiredAlps = 1;
		alps = {
		    params: {
		        designator: 'S',
		        from: undefined,
		        to: undefined
		    },
		    body: p => `

    (module ALPS (layer F.Cu) (tedit 5CF31DEF)

        ${p.at /* parametric position */}
        
        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
        ${''/* corner marks */}
        (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))

        ${''/* pins */}
        (pad 1 thru_hole circle (at 2.5 -4.5) (size 2.25 2.25) (drill 1.47) (layers *.Cu *.Mask) ${p.from})
        (pad 2 thru_hole circle (at -2.5 -4) (size 2.25 2.25) (drill 1.47) (layers *.Cu *.Mask) ${p.to})
    )

    `
		};
		return alps;
	}

	var button;
	var hasRequiredButton;

	function requireButton () {
		if (hasRequiredButton) return button;
		hasRequiredButton = 1;
		button = {
		    params: {
		        designator: 'B', // for Button
		        side: 'F',
		        from: undefined,
		        to: undefined
		    },
		    body: p => `
    
    (module E73:SW_TACT_ALPS_SKQGABE010 (layer F.Cu) (tstamp 5BF2CC94)

        (descr "Low-profile SMD Tactile Switch, https://www.e-switch.com/product-catalog/tact/product-lines/tl3342-series-low-profile-smt-tact-switch")
        (tags "SPST Tactile Switch")

        ${p.at /* parametric position */}
        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
        ${'' /* outline */}
        (fp_line (start 2.75 1.25) (end 1.25 2.75) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start 2.75 -1.25) (end 1.25 -2.75) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start 2.75 -1.25) (end 2.75 1.25) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -1.25 2.75) (end 1.25 2.75) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -1.25 -2.75) (end 1.25 -2.75) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -2.75 1.25) (end -1.25 2.75) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -2.75 -1.25) (end -1.25 -2.75) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -2.75 -1.25) (end -2.75 1.25) (layer ${p.side}.SilkS) (width 0.15))
        
        ${'' /* pins */}
        (pad 1 smd rect (at -3.1 -1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.from})
        (pad 1 smd rect (at 3.1 -1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.from})
        (pad 2 smd rect (at -3.1 1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.to})
        (pad 2 smd rect (at 3.1 1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.to})
    )
    
    `
		};
		return button;
	}

	var choc$1;
	var hasRequiredChoc$1;

	function requireChoc$1 () {
		if (hasRequiredChoc$1) return choc$1;
		hasRequiredChoc$1 = 1;
		// Kailh Choc PG1350
		// Nets
		//    from: corresponds to pin 1
		//    to: corresponds to pin 2
		// Params
		//    hotswap: default is false
		//      if true, will include holes and pads for Kailh choc hotswap sockets
		//    reverse: default is false
		//      if true, will flip the footprint such that the pcb can be reversible
		//    keycaps: default is false
		//      if true, will add choc sized keycap box around the footprint
		// 
		// note: hotswap and reverse can be used simultaneously

		choc$1 = {
		  params: {
		    designator: 'S',
		    hotswap: false,
		    reverse: false,
		    keycaps: false,
		    from: undefined,
		    to: undefined
		  },
		  body: p => {
		    const standard = `
      (module PG1350 (layer F.Cu) (tedit 5DD50112)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

      ${''/* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))      
      
      ${''/* middle shaft */}
      (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))
        
      ${''/* stabilizers */}
      (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      `;
		    const keycap = `
      ${'' /* keycap marks */}
      (fp_line (start -9 -8.5) (end 9 -8.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9 -8.5) (end 9 8.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9 8.5) (end -9 8.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start -9 8.5) (end -9 -8.5) (layer Dwgs.User) (width 0.15))
      `;
		    function pins(def_neg, def_pos, def_side) {
		      if(p.hotswap) {
		        return `
          ${'' /* holes */}
          (pad "" np_thru_hole circle (at ${def_pos}5 -3.75) (size 3 3) (drill 3) (layers *.Cu *.Mask))
          (pad "" np_thru_hole circle (at 0 -5.95) (size 3 3) (drill 3) (layers *.Cu *.Mask))
      
          ${'' /* net pads */}
          (pad 1 smd rect (at ${def_neg}3.275 -5.95 ${p.r}) (size 2.6 2.6) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask)  ${p.from})
          (pad 2 smd rect (at ${def_pos}8.275 -3.75 ${p.r}) (size 2.6 2.6) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask)  ${p.to})
        `
		      } else {
		          return `
            ${''/* pins */}
            (pad 1 thru_hole circle (at ${def_pos}5 -3.8) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from})
            (pad 2 thru_hole circle (at ${def_pos}0 -5.9) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.to})
          `
		      }
		    }
		    if(p.reverse) {
		      return `
        ${standard}
        ${p.keycaps ? keycap : ''}
        ${pins('-', '', 'B')}
        ${pins('', '-', 'F')})
        `
		    } else {
		      return `
        ${standard}
        ${p.keycaps ? keycap : ''}
        ${pins('-', '', 'B')})
        `
		    }
		  }
		};
		return choc$1;
	}

	var chocmini;
	var hasRequiredChocmini;

	function requireChocmini () {
		if (hasRequiredChocmini) return chocmini;
		hasRequiredChocmini = 1;
		// Kailh Choc PG1232
		// Nets
		//    from: corresponds to pin 1
		//    to: corresponds to pin 2
		// Params
		//    reverse: default is false
		//      if true, will flip the footprint such that the pcb can be reversible 
		//    keycaps: default is false
		//      if true, will add choc sized keycap box around the footprint

		chocmini = {
		    params: {
		      designator: 'S',
				  side: 'F',
				  reverse: false,
		      keycaps: false,
		      from: undefined,
		      to: undefined
		    },
		    body: p => {
			    const standard = `
        (module lib:Kailh_PG1232 (layer F.Cu) (tedit 5E1ADAC2)
        ${p.at /* parametric position */} 

        ${'' /* footprint reference */}        
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value Kailh_PG1232 (at 0 -7.3) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))

        ${'' /* corner marks */}
        (fp_line (start -7.25 -6.75) (end -6.25 -6.75) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7.25 -6.75) (end -7.25 -5.75) (layer Dwgs.User) (width 0.15))

        (fp_line (start -7.25 6.75) (end -6.25 6.75) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7.25 6.75) (end -7.25 5.75) (layer Dwgs.User) (width 0.15))

        (fp_line (start 7.25 -6.75) (end 6.25 -6.75) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7.25 -6.75) (end 7.25 -5.75) (layer Dwgs.User) (width 0.15))

        (fp_line (start 7.25 6.75) (end 6.25 6.75) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7.25 6.75) (end 7.25 5.75) (layer Dwgs.User) (width 0.15))


        (fp_line (start 2.8 -5.35) (end -2.8 -5.35) (layer Dwgs.User) (width 0.15))
        (fp_line (start -2.8 -3.2) (end 2.8 -3.2) (layer Dwgs.User) (width 0.15))
        (fp_line (start 2.8 -3.2) (end 2.8 -5.35) (layer Dwgs.User) (width 0.15))
        (fp_line (start -2.8 -3.2) (end -2.8 -5.35) (layer Dwgs.User) (width 0.15))
        
        ${''/* middle shaft */}        	 
        (fp_line (start 2.25 2.6) (end 5.8 2.6) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -2.25 2.6) (end -5.8 2.6) (layer Edge.Cuts) (width 0.12))
        (fp_line (start 2.25 3.6) (end 2.25 2.6) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -2.25 3.6) (end 2.25 3.6) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -2.25 2.6) (end -2.25 3.6) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -5.8 2.6) (end -5.8 -2.95) (layer Edge.Cuts) (width 0.12))
        (fp_line (start 5.8 -2.95) (end 5.8 2.6) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -5.8 -2.95) (end 5.8 -2.95) (layer Edge.Cuts) (width 0.12))
        
        ${''/* stabilizers */}    
        (pad 3 thru_hole circle (at 5.3 -4.75) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) (clearance 0.2))
        (pad 4 thru_hole circle (at -5.3 -4.75) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) (clearance 0.2))
      `;
		      const keycap = `
        ${'' /* keycap marks */}
        (fp_line (start -9 -8.5) (end 9 -8.5) (layer Dwgs.User) (width 0.15))
        (fp_line (start 9 -8.5) (end 9 8.5) (layer Dwgs.User) (width 0.15))
        (fp_line (start 9 8.5) (end -9 8.5) (layer Dwgs.User) (width 0.15))
        (fp_line (start -9 8.5) (end -9 -8.5) (layer Dwgs.User) (width 0.15))
        `;
		      function pins(def_neg, def_pos) {
		        return `
        ${''/* pins */}
        (pad 1 thru_hole circle (at ${def_neg}4.58 5.1) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) ${p.from} (clearance 0.2))
        (pad 2 thru_hole circle (at ${def_pos}2 5.4) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) ${p.to} (clearance 0.2))
			  `
		      }
		      if(p.reverse){
		        return `
          ${standard}
          ${p.keycaps ? keycap : ''}
          ${pins('-', '')}
          ${pins('', '-')})

          `
		      } else {
		        return `
          ${standard}
          ${p.keycaps ? keycap : ''}
          ${pins('-', '')})
          `
		      }
		    }
		  };
		return chocmini;
	}

	var diode$1;
	var hasRequiredDiode$1;

	function requireDiode$1 () {
		if (hasRequiredDiode$1) return diode$1;
		hasRequiredDiode$1 = 1;
		diode$1 = {
		    params: {
		        designator: 'D',
		        from: undefined,
		        to: undefined
		    },
		    body: p => `
  
    (module ComboDiode (layer F.Cu) (tedit 5B24D78E)


        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
        ${''/* diode symbols */}
        (fp_line (start 0.25 0) (end 0.75 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0) (end 0.75 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer B.SilkS) (width 0.1))
    
        ${''/* SMD pads on both sides */}
        (pad 1 smd rect (at -1.65 0 ${p.r}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.to})
        (pad 2 smd rect (at 1.65 0 ${p.r}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.from})
        (pad 1 smd rect (at -1.65 0 ${p.r}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.to})
        (pad 2 smd rect (at 1.65 0 ${p.r}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.from})
        
        ${''/* THT terminals */}
        (pad 1 thru_hole rect (at -3.81 0 ${p.r}) (size 1.778 1.778) (drill 0.9906) (layers *.Cu *.Mask) ${p.to})
        (pad 2 thru_hole circle (at 3.81 0 ${p.r}) (size 1.905 1.905) (drill 0.9906) (layers *.Cu *.Mask) ${p.from})
    )
  
    `
		};
		return diode$1;
	}

	var jstph;
	var hasRequiredJstph;

	function requireJstph () {
		if (hasRequiredJstph) return jstph;
		hasRequiredJstph = 1;
		jstph = {
		    params: {
		        designator: 'JST',
		        side: 'F',
		        pos: undefined,
		        neg: undefined
		    },
		    body: p => `
    
    (module JST_PH_S2B-PH-K_02x2.00mm_Angled (layer F.Cu) (tedit 58D3FE32)

        (descr "JST PH series connector, S2B-PH-K, side entry type, through hole, Datasheet: http://www.jst-mfg.com/product/pdf/eng/ePH.pdf")
        (tags "connector jst ph")

        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        (fp_line (start -2.25 0.25) (end -2.25 -1.35) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -2.25 -1.35) (end -2.95 -1.35) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -2.95 -1.35) (end -2.95 6.25) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -2.95 6.25) (end 2.95 6.25) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start 2.95 6.25) (end 2.95 -1.35) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start 2.95 -1.35) (end 2.25 -1.35) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start 2.25 -1.35) (end 2.25 0.25) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start 2.25 0.25) (end -2.25 0.25) (layer ${p.side}.SilkS) (width 0.15))

        (fp_line (start -1 1.5) (end -1 2.0) (layer ${p.side}.SilkS) (width 0.15))
        (fp_line (start -1.25 1.75) (end -0.75 1.75) (layer ${p.side}.SilkS) (width 0.15))

        (pad 1 thru_hole rect (at -1 0 ${p.r}) (size 1.2 1.7) (drill 0.75) (layers *.Cu *.Mask) ${p.pos})
        (pad 2 thru_hole oval (at 1 0 ${p.r}) (size 1.2 1.7) (drill 0.75) (layers *.Cu *.Mask) ${p.neg})
            
    )
    
    `
		};
		return jstph;
	}

	var jumper;
	var hasRequiredJumper;

	function requireJumper () {
		if (hasRequiredJumper) return jumper;
		hasRequiredJumper = 1;
		jumper = {
		    params: {
		        designator: 'J',
		        side: 'F',
		        from: undefined,
		        to: undefined
		    },
		    body: p => `
        (module lib:Jumper (layer F.Cu) (tedit 5E1ADAC2)
        ${p.at /* parametric position */} 

        ${'' /* footprint reference */}        
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value Jumper (at 0 -7.3) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))

        ${'' /* pins */}
        (pad 1 smd rect (at -0.50038 0 ${p.r}) (size 0.635 1.143) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
        (clearance 0.1905) ${p.from})
        (pad 2 smd rect (at 0.50038 0 ${p.r}) (size 0.635 1.143) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
        (clearance 0.1905) ${p.to}))
    `
		};
		return jumper;
	}

	var mx;
	var hasRequiredMx;

	function requireMx () {
		if (hasRequiredMx) return mx;
		hasRequiredMx = 1;
		// Any MX switch
		// Nets
		//    from: corresponds to pin 1
		//    to: corresponds to pin 2
		// Params
		//    hotswap: default is false
		//      if true, will include holes and pads for Kailh MX hotswap sockets
		//    reverse: default is false
		//      if true, will flip the footprint such that the pcb can be reversible 
		//    keycaps: default is false
		//      if true, will add choc sized keycap box around the footprint
		//
		// note: hotswap and reverse can be used simultaneously

		mx = {
		  params: {
		    designator: 'S',
		    hotswap: false,
		    reverse: false,
		    keycaps: false,
		    from: undefined,
		    to: undefined
		  },
		  body: p => {
		    const standard = `
      (module MX (layer F.Cu) (tedit 5DD4F656)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

      ${''/* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))
    
      ${''/* middle shaft */}
      (pad "" np_thru_hole circle (at 0 0) (size 3.9878 3.9878) (drill 3.9878) (layers *.Cu *.Mask))

      ${''/* stabilizers */}
      (pad "" np_thru_hole circle (at 5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      `;
		    const keycap = `
      ${'' /* keycap marks */}
      (fp_line (start -9.5 -9.5) (end 9.5 -9.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9.5 -9.5) (end 9.5 9.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9.5 9.5) (end -9.5 9.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start -9.5 9.5) (end -9.5 -9.5) (layer Dwgs.User) (width 0.15))
      `;
		    function pins(def_neg, def_pos, def_side) {
		      if(p.hotswap) {
		        return `
        ${'' /* holes */}
        (pad "" np_thru_hole circle (at ${def_pos}2.54 -5.08) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at ${def_neg}3.81 -2.54) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        
        ${'' /* net pads */}
        (pad 1 smd rect (at ${def_neg}7.085 -2.54 ${p.r}) (size 2.55 2.5) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask) ${p.from})
        (pad 2 smd rect (at ${def_pos}5.842 -5.08 ${p.r}) (size 2.55 2.5) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask) ${p.to})
        `
		      } else {
		          return `
            ${''/* pins */}
            (pad 1 thru_hole circle (at ${def_pos}2.54 -5.08) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.from})
            (pad 2 thru_hole circle (at ${def_neg}3.81 -2.54) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.to})
          `
		      }
		    }
		    if(p.reverse){
		      return `
        ${standard}
        ${p.keycaps ? keycap : ''}
        ${pins('-', '', 'B')}
        ${pins('', '-', 'F')})
        `
		    } else {
		      return `
        ${standard}
        ${p.keycaps ? keycap : ''}
        ${pins('-', '', 'B')})
        `
		    }
		  }
		};
		return mx;
	}

	var oled;
	var hasRequiredOled;

	function requireOled () {
		if (hasRequiredOled) return oled;
		hasRequiredOled = 1;
		oled = {
		    params: {
		        designator: 'OLED',
		        side: 'F',
		        VCC: {type: 'net', value: 'VCC'},
		        GND: {type: 'net', value: 'GND'},
		        SDA: undefined,
		        SCL: undefined
		    },
		    body: p => `
        (module lib:OLED_headers (layer F.Cu) (tedit 5E1ADAC2)
        ${p.at /* parametric position */} 

        ${'' /* footprint reference */}        
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value OLED (at 0 -7.3) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))

        ${'' /* pins */}
        (pad 4 thru_hole oval (at 1.6 2.18 ${p.r+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.SDA})
        (pad 3 thru_hole oval (at 1.6 4.72 ${p.r+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.SCL})
        (pad 2 thru_hole oval (at 1.6 7.26 ${p.r+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.VCC})
        (pad 1 thru_hole rect (at 1.6 9.8 ${p.r+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.GND})
        )
        `
		};
		return oled;
	}

	var omron;
	var hasRequiredOmron;

	function requireOmron () {
		if (hasRequiredOmron) return omron;
		hasRequiredOmron = 1;
		omron = {
		    params: {
		        designator: 'S',
		        from: undefined,
		        to: undefined
		    },
		    body: p => `
    
    (module OMRON_B3F-4055 (layer F.Cu) (tstamp 5BF2CC94)

        ${p.at /* parametric position */}
        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
        ${'' /* stabilizers */}
        (pad "" np_thru_hole circle (at 0 -4.5) (size 1.8 1.8) (drill 1.8) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at 0 4.5) (size 1.8 1.8) (drill 1.8) (layers *.Cu *.Mask))

        ${'' /* switch marks */}
        (fp_line (start -6 -6) (end 6 -6) (layer Dwgs.User) (width 0.15))
        (fp_line (start 6 -6) (end 6 6) (layer Dwgs.User) (width 0.15))
        (fp_line (start 6 6) (end -6 6) (layer Dwgs.User) (width 0.15))
        (fp_line (start -6 6) (end -6 -6) (layer Dwgs.User) (width 0.15))

        ${'' /* pins */}
        (pad 1 np_thru_hole circle (at 6.25 -2.5) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask) ${p.from})
        (pad 2 np_thru_hole circle (at -6.25 -2.5) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask) ${p.from})
        (pad 3 np_thru_hole circle (at 6.25 2.5) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask) ${p.to})
        (pad 4 np_thru_hole circle (at -6.25 2.5 ) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask) ${p.to})
    )
    
    `
		};
		return omron;
	}

	var pad;
	var hasRequiredPad;

	function requirePad () {
		if (hasRequiredPad) return pad;
		hasRequiredPad = 1;
		pad = {
		    params: {
		        designator: 'PAD',
		        width: 1,
		        height: 1,
		        front: true,
		        back: true,
		        text: '',
		        align: 'left',
		        mirrored: {type: 'boolean', value: '{{mirrored}}'},
		        net: undefined
		    },
		    body: p => {

		        const layout = (toggle, side) => {
		            if (!toggle) return ''
		            let x = 0, y = 0;
		            const mirror = side == 'B' ? '(justify mirror)' : '';
		            const plus = (p.text.length + 1) * 0.5;
		            let align = p.align;
		            if (p.mirrored === true) {
		                if (align == 'left') align = 'right';
		                else if (align == 'right') align = 'left';
		            }
		            if (align == 'left') x -= p.width / 2 + plus;
		            if (align == 'right') x += p.width / 2 + plus;
		            if (align == 'up') y += p.height / 2 + plus;
		            if (align == 'down') y -= p.height / 2 + plus;
		            let text = '';
		            if (p.text.length) {
		                text = `(fp_text user ${p.text} (at ${x} ${y} ${p.r}) (layer ${side}.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15)) ${mirror}))`;
		            }
		            return `(pad 1 smd rect (at 0 0 ${p.r}) (size ${p.width} ${p.height}) (layers ${side}.Cu ${side}.Paste ${side}.Mask) ${p.net})\n${text}`
		        };

		        return `
    
        (module SMDPad (layer F.Cu) (tedit 5B24D78E)

            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
            
            ${''/* SMD pads */}
            ${layout(p.front, 'F')}
            ${layout(p.back, 'B')}
            
        )
    
        `
		    }
		};
		return pad;
	}

	var promicro;
	var hasRequiredPromicro;

	function requirePromicro () {
		if (hasRequiredPromicro) return promicro;
		hasRequiredPromicro = 1;
		// Arduino ProMicro atmega32u4au
		// Params
		//  orientation: default is down
		//    if down, power led will face the pcb
		//    if up, power led will face away from pcb

		promicro = {
		  params: {
		    designator: 'MCU',
		    orientation: 'down',
		    RAW: {type: 'net', value: 'RAW'},
		    GND: {type: 'net', value: 'GND'},
		    RST: {type: 'net', value: 'RST'},
		    VCC: {type: 'net', value: 'VCC'},
		    P21: {type: 'net', value: 'P21'},
		    P20: {type: 'net', value: 'P20'},
		    P19: {type: 'net', value: 'P19'},
		    P18: {type: 'net', value: 'P18'},
		    P15: {type: 'net', value: 'P15'},
		    P14: {type: 'net', value: 'P14'},
		    P16: {type: 'net', value: 'P16'},
		    P10: {type: 'net', value: 'P10'},
		    P1: {type: 'net', value: 'P1'},
		    P0: {type: 'net', value: 'P0'},
		    P2: {type: 'net', value: 'P2'},
		    P3: {type: 'net', value: 'P3'},
		    P4: {type: 'net', value: 'P4'},
		    P5: {type: 'net', value: 'P5'},
		    P6: {type: 'net', value: 'P6'},
		    P7: {type: 'net', value: 'P7'},
		    P8: {type: 'net', value: 'P8'},
		    P9: {type: 'net', value: 'P9'}
		  },
		  body: p => {
		    const standard = `
      (module ProMicro (layer F.Cu) (tedit 5B307E4C)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
    
      ${''/* illustration of the (possible) USB port overhang */}
      (fp_line (start -19.304 -3.81) (end -14.224 -3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -19.304 3.81) (end -19.304 -3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 3.81) (end -19.304 3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 -3.81) (end -14.224 3.81) (layer Dwgs.User) (width 0.15))
    
      ${''/* component outline */}
      (fp_line (start -17.78 8.89) (end 15.24 8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start 15.24 -8.89) (end -17.78 -8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start -17.78 -8.89) (end -17.78 8.89) (layer F.SilkS) (width 0.15))
      `;
		    function pins(def_neg, def_pos) {
		      return `
        ${''/* extra border around "RAW", in case the rectangular shape is not distinctive enough */}
        (fp_line (start -15.24 ${def_pos}6.35) (end -12.7 ${def_pos}6.35) (layer F.SilkS) (width 0.15))
        (fp_line (start -15.24 ${def_pos}6.35) (end -15.24 ${def_pos}8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start -12.7 ${def_pos}6.35) (end -12.7 ${def_pos}8.89) (layer F.SilkS) (width 0.15))
      
        ${''/* pin names */}
        (fp_text user RAW (at -13.97 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -11.43 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user RST (at -8.89 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user VCC (at -6.35 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P21 (at -3.81 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P20 (at -1.27 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P19 (at 1.27 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P18 (at 3.81 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P15 (at 6.35 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P14 (at 8.89 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P16 (at 11.43 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P10 (at 13.97 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      
        (fp_text user P01 (at -13.97 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P00 (at -11.43 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -8.89 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -6.35 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P02 (at -3.81 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P03 (at -1.27 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P04 (at 1.27 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P05 (at 3.81 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P06 (at 6.35 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P07 (at 8.89 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P08 (at 11.43 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P09 (at 13.97 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      
        ${''/* and now the actual pins */}
        (pad 1 thru_hole rect (at -13.97 ${def_pos}7.62 ${p.r}) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.RAW})
        (pad 2 thru_hole circle (at -11.43 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.GND})
        (pad 3 thru_hole circle (at -8.89 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.RST})
        (pad 4 thru_hole circle (at -6.35 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.VCC})
        (pad 5 thru_hole circle (at -3.81 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P21})
        (pad 6 thru_hole circle (at -1.27 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P20})
        (pad 7 thru_hole circle (at 1.27 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P19})
        (pad 8 thru_hole circle (at 3.81 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P18})
        (pad 9 thru_hole circle (at 6.35 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P15})
        (pad 10 thru_hole circle (at 8.89 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P14})
        (pad 11 thru_hole circle (at 11.43 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P16})
        (pad 12 thru_hole circle (at 13.97 ${def_pos}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P10})
        
        (pad 13 thru_hole circle (at -13.97 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P1})
        (pad 14 thru_hole circle (at -11.43 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P0})
        (pad 15 thru_hole circle (at -8.89 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.GND})
        (pad 16 thru_hole circle (at -6.35 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.GND})
        (pad 17 thru_hole circle (at -3.81 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P2})
        (pad 18 thru_hole circle (at -1.27 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P3})
        (pad 19 thru_hole circle (at 1.27 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P4})
        (pad 20 thru_hole circle (at 3.81 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P5})
        (pad 21 thru_hole circle (at 6.35 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P6})
        (pad 22 thru_hole circle (at 8.89 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P7})
        (pad 23 thru_hole circle (at 11.43 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P8})
        (pad 24 thru_hole circle (at 13.97 ${def_neg}7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P9})
      `
		    }
		    if(p.orientation == 'down') {
		      return `
        ${standard}
        ${pins('-', '')})
        `
		    } else {
		      return `
        ${standard}
        ${pins('', '-')})
        `
		    }
		  }
		};
		return promicro;
	}

	var rgb;
	var hasRequiredRgb;

	function requireRgb () {
		if (hasRequiredRgb) return rgb;
		hasRequiredRgb = 1;
		rgb = {
		    params: {
		        designator: 'LED',
		        side: 'F',
		        din: undefined,
		        dout: undefined,
		        VCC: {type: 'net', value: 'VCC'},
		        GND: {type: 'net', value: 'GND'}
		    },
		    body: p => `
    
        (module WS2812B (layer F.Cu) (tedit 53BEE615)

            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

            (fp_line (start -1.75 -1.75) (end -1.75 1.75) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start -1.75 1.75) (end 1.75 1.75) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start 1.75 1.75) (end 1.75 -1.75) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start 1.75 -1.75) (end -1.75 -1.75) (layer ${p.side}.SilkS) (width 0.15))

            (fp_line (start -2.5 -2.5) (end -2.5 2.5) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start -2.5 2.5) (end 2.5 2.5) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start 2.5 2.5) (end 2.5 -2.5) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start 2.5 -2.5) (end -2.5 -2.5) (layer ${p.side}.SilkS) (width 0.15))

            (fp_poly (pts (xy 4 2.2) (xy 4 0.375) (xy 5 1.2875)) (layer ${p.side}.SilkS) (width 0.1))

            (pad 1 smd rect (at -2.2 -0.875 ${p.r}) (size 2.6 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.VCC})
            (pad 2 smd rect (at -2.2 0.875 ${p.r}) (size 2.6 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.dout})
            (pad 3 smd rect (at 2.2 0.875 ${p.r}) (size 2.6 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.GND})
            (pad 4 smd rect (at 2.2 -0.875 ${p.r}) (size 2.6 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.din})

            (pad 11 smd rect (at -2.5 -1.6 ${p.r}) (size 2 1.2) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.VCC})
            (pad 22 smd rect (at -2.5 1.6 ${p.r}) (size 2 1.2) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.dout})
            (pad 33 smd rect (at 2.5 1.6 ${p.r}) (size 2 1.2) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.GND})
            (pad 44 smd rect (at 2.5 -1.6 ${p.r}) (size 2 1.2) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.din})
            
        )
    
    `
		};
		return rgb;
	}

	var rotary;
	var hasRequiredRotary;

	function requireRotary () {
		if (hasRequiredRotary) return rotary;
		hasRequiredRotary = 1;
		// EC11 rotary encoder
		//
		// Nets
		//    from: corresponds to switch pin 1 (for button presses)
		//    to: corresponds to switch pin 2 (for button presses)
		//    A: corresponds to pin 1 (for rotary)
		//    B: corresponds to pin 2 (for rotary, should be GND)
		//    C: corresponds to pin 3 (for rotary)

		rotary = {
		    params: {
		        designator: 'ROT',
		        from: undefined,
		        to: undefined,
		        A: undefined,
		        B: undefined,
		        C: undefined
		    },
		    body: p => `
        (module rotary_encoder (layer F.Cu) (tedit 603326DE)

            ${p.at /* parametric position */}
        
            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0.5) (layer F.SilkS) 
                ${p.ref_hide} (effects (font (size 1 1) (thickness 0.15))))
            (fp_text value "" (at 0 8.89) (layer F.Fab)
                (effects (font (size 1 1) (thickness 0.15))))

            ${''/* component outline */}
            (fp_line (start -0.62 -0.04) (end 0.38 -0.04) (layer F.SilkS) (width 0.12))
            (fp_line (start -0.12 -0.54) (end -0.12 0.46) (layer F.SilkS) (width 0.12))
            (fp_line (start 5.98 3.26) (end 5.98 5.86) (layer F.SilkS) (width 0.12))
            (fp_line (start 5.98 -1.34) (end 5.98 1.26) (layer F.SilkS) (width 0.12))
            (fp_line (start 5.98 -5.94) (end 5.98 -3.34) (layer F.SilkS) (width 0.12))
            (fp_line (start -3.12 -0.04) (end 2.88 -0.04) (layer F.Fab) (width 0.12))
            (fp_line (start -0.12 -3.04) (end -0.12 2.96) (layer F.Fab) (width 0.12))
            (fp_line (start -7.32 -4.14) (end -7.62 -3.84) (layer F.SilkS) (width 0.12))
            (fp_line (start -7.92 -4.14) (end -7.32 -4.14) (layer F.SilkS) (width 0.12))
            (fp_line (start -7.62 -3.84) (end -7.92 -4.14) (layer F.SilkS) (width 0.12))
            (fp_line (start -6.22 -5.84) (end -6.22 5.86) (layer F.SilkS) (width 0.12))
            (fp_line (start -2.12 -5.84) (end -6.22 -5.84) (layer F.SilkS) (width 0.12))
            (fp_line (start -2.12 5.86) (end -6.22 5.86) (layer F.SilkS) (width 0.12))
            (fp_line (start 5.98 5.86) (end 1.88 5.86) (layer F.SilkS) (width 0.12))
            (fp_line (start 1.88 -5.94) (end 5.98 -5.94) (layer F.SilkS) (width 0.12))
            (fp_line (start -6.12 -4.74) (end -5.12 -5.84) (layer F.Fab) (width 0.12))
            (fp_line (start -6.12 5.76) (end -6.12 -4.74) (layer F.Fab) (width 0.12))
            (fp_line (start 5.88 5.76) (end -6.12 5.76) (layer F.Fab) (width 0.12))
            (fp_line (start 5.88 -5.84) (end 5.88 5.76) (layer F.Fab) (width 0.12))
            (fp_line (start -5.12 -5.84) (end 5.88 -5.84) (layer F.Fab) (width 0.12))
            (fp_line (start -8.87 -6.89) (end 7.88 -6.89) (layer F.CrtYd) (width 0.05))
            (fp_line (start -8.87 -6.89) (end -8.87 6.81) (layer F.CrtYd) (width 0.05))
            (fp_line (start 7.88 6.81) (end 7.88 -6.89) (layer F.CrtYd) (width 0.05))
            (fp_line (start 7.88 6.81) (end -8.87 6.81) (layer F.CrtYd) (width 0.05))
            (fp_circle (center -0.12 -0.04) (end 2.88 -0.04) (layer F.SilkS) (width 0.12))
            (fp_circle (center -0.12 -0.04) (end 2.88 -0.04) (layer F.Fab) (width 0.12))

            ${''/* pin names */}
            (pad A thru_hole rect (at -7.62 -2.54 ${p.r}) (size 2 2) (drill 1) (layers *.Cu *.Mask) ${p.A})
            (pad C thru_hole circle (at -7.62 -0.04) (size 2 2) (drill 1) (layers *.Cu *.Mask) ${p.C})
            (pad B thru_hole circle (at -7.62 2.46) (size 2 2) (drill 1) (layers *.Cu *.Mask) ${p.B})
            (pad 1 thru_hole circle (at 6.88 -2.54) (size 1.5 1.5) (drill 1) (layers *.Cu *.Mask) ${p.from})
            (pad 2 thru_hole circle (at 6.88 2.46) (size 1.5 1.5) (drill 1) (layers *.Cu *.Mask) ${p.to})

            ${''/* Legs */}
            (pad "" thru_hole rect (at -0.12 -5.64 ${p.r}) (size 3.2 2) (drill oval 2.8 1.5) (layers *.Cu *.Mask))
            (pad "" thru_hole rect (at -0.12 5.56 ${p.r})  (size 3.2 2) (drill oval 2.8 1.5) (layers *.Cu *.Mask))
        )
    `
		};
		return rotary;
	}

	var scrollwheel;
	var hasRequiredScrollwheel;

	function requireScrollwheel () {
		if (hasRequiredScrollwheel) return scrollwheel;
		hasRequiredScrollwheel = 1;
		// Panasonic EVQWGD001 horizontal rotary encoder
		//
		//   __________________
		//  (f) (t)         | |
		//  | (1)           | |
		//  | (2)           | |
		//  | (3)           | |
		//  | (4)           | |
		//  |_( )___________|_|
		//
		// Nets
		//    from: corresponds to switch pin 1 (for button presses)
		//    to: corresponds to switch pin 2 (for button presses)
		//    A: corresponds to pin 1 (for rotary)
		//    B: corresponds to pin 2 (for rotary, should be GND)
		//    C: corresponds to pin 3 (for rotary)
		//    D: corresponds to pin 4 (for rotary, unused)
		// Params
		//    reverse: default is false
		//      if true, will flip the footprint such that the pcb can be reversible


		scrollwheel = {
		    params: {
		      designator: 'S',
				  reverse: false,
		      from: undefined,
		      to: undefined,
		      A: undefined,
		      B: undefined,
		      C: undefined,
		      D: undefined
		    },
		    body: p => {
		      const standard = `
        (module RollerEncoder_Panasonic_EVQWGD001 (layer F.Cu) (tedit 6040A10C)
        ${p.at /* parametric position */}   
        (fp_text reference REF** (at 0 0 ${p.r}) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))
        (fp_text value RollerEncoder_Panasonic_EVQWGD001 (at -0.1 9 ${p.r}) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))
        
        ${'' /* corner marks */}
        (fp_line (start -8.4 -6.4) (end 8.4 -6.4) (layer Dwgs.User) (width 0.12))
        (fp_line (start 8.4 -6.4) (end 8.4 7.4) (layer Dwgs.User) (width 0.12))
        (fp_line (start 8.4 7.4) (end -8.4 7.4) (layer Dwgs.User) (width 0.12))
        (fp_line (start -8.4 7.4) (end -8.4 -6.4) (layer Dwgs.User) (width 0.12))
      `;
		      function pins(def_neg, def_pos) {
		        return `
          ${'' /* edge cuts */}
          (fp_line (start ${def_pos}9.8 7.3) (end ${def_pos}9.8 -6.3) (layer Edge.Cuts) (width 0.15))
          (fp_line (start ${def_pos}7.4 -6.3) (end ${def_pos}7.4 7.3) (layer Edge.Cuts) (width 0.15))
          (fp_line (start ${def_pos}9.5 -6.6) (end ${def_pos}7.7 -6.6) (layer Edge.Cuts) (width 0.15))
          (fp_line (start ${def_pos}7.7 7.6) (end ${def_pos}9.5 7.6) (layer Edge.Cuts) (width 0.15))
          (fp_arc (start ${def_pos}7.7 7.3) (end ${def_pos}7.4 7.3) (angle ${def_neg}90) (layer Edge.Cuts) (width 0.15))
          (fp_arc (start ${def_pos}9.5 7.3) (end ${def_pos}9.5 7.6) (angle ${def_neg}90) (layer Edge.Cuts) (width 0.15))
          (fp_arc (start ${def_pos}7.7 -6.3) (end ${def_pos}7.7 -6.6) (angle ${def_neg}90) (layer Edge.Cuts) (width 0.15))
          (fp_arc (start ${def_pos}9.5 -6.3) (end ${def_pos}9.8 -6.3) (angle ${def_neg}90) (layer Edge.Cuts) (width 0.15))

          ${'' /* pins */}
          (pad S1 thru_hole circle (at ${def_neg}6.85 -6.2 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers *.Cu *.Mask) ${p.from})
          (pad S2 thru_hole circle (at ${def_neg}5 -6.2 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers *.Cu *.Mask) ${p.to})
          (pad A thru_hole circle (at ${def_neg}5.625 -3.81 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers *.Cu *.Mask) ${p.A})
          (pad B thru_hole circle (at ${def_neg}5.625 -1.27 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers *.Cu *.Mask) ${p.B})
          (pad C thru_hole circle (at ${def_neg}5.625 1.27 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers *.Cu *.Mask) ${p.C})
          (pad D thru_hole circle (at ${def_neg}5.625 3.81 ${p.r}) (size 1.6 1.6) (drill 0.9) (layers *.Cu *.Mask) ${p.D})

          ${'' /* stabilizer */}
          (pad "" np_thru_hole circle (at ${def_neg}5.625 6.3 ${p.r}) (size 1.5 1.5) (drill 1.5) (layers *.Cu *.Mask))
        `
		    }
		    if(p.reverse) {
		      return `
        ${standard}
        ${pins('-', '')}
        ${pins('', '-')})
        `
		    } else {
		      return `
        ${standard}
        ${pins('-', '')})
        `
		    }
		  }
		};
		return scrollwheel;
	}

	var slider;
	var hasRequiredSlider;

	function requireSlider () {
		if (hasRequiredSlider) return slider;
		hasRequiredSlider = 1;
		slider = {
		    params: {
		        designator: 'T', // for Toggle
		        side: 'F',
		        from: undefined,
		        to: undefined
		    },
		    body: p => {

		        const left = p.side == 'F' ? '-' : '';
		        const right = p.side == 'F' ? '' : '-';

		        return `
        
        (module E73:SPDT_C128955 (layer F.Cu) (tstamp 5BF2CC3C)

            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
            
            ${'' /* outline */}
            (fp_line (start 1.95 -1.35) (end -1.95 -1.35) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start 0 -1.35) (end -3.3 -1.35) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start -3.3 -1.35) (end -3.3 1.5) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start -3.3 1.5) (end 3.3 1.5) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start 3.3 1.5) (end 3.3 -1.35) (layer ${p.side}.SilkS) (width 0.15))
            (fp_line (start 0 -1.35) (end 3.3 -1.35) (layer ${p.side}.SilkS) (width 0.15))
            
            ${'' /* extra indicator for the slider */}
            (fp_line (start -1.95 -3.85) (end 1.95 -3.85) (layer Dwgs.User) (width 0.15))
            (fp_line (start 1.95 -3.85) (end 1.95 -1.35) (layer Dwgs.User) (width 0.15))
            (fp_line (start -1.95 -1.35) (end -1.95 -3.85) (layer Dwgs.User) (width 0.15))
            
            ${'' /* bottom cutouts */}
            (pad "" np_thru_hole circle (at 1.5 0) (size 1 1) (drill 0.9) (layers *.Cu *.Mask))
            (pad "" np_thru_hole circle (at -1.5 0) (size 1 1) (drill 0.9) (layers *.Cu *.Mask))

            ${'' /* pins */}
            (pad 1 smd rect (at ${right}2.25 2.075 ${p.r}) (size 0.9 1.25) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.from})
            (pad 2 smd rect (at ${left}0.75 2.075 ${p.r}) (size 0.9 1.25) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.to})
            (pad 3 smd rect (at ${left}2.25 2.075 ${p.r}) (size 0.9 1.25) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask))
            
            ${'' /* side mounts */}
            (pad "" smd rect (at 3.7 -1.1 ${p.r}) (size 0.9 0.9) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask))
            (pad "" smd rect (at 3.7 1.1 ${p.r}) (size 0.9 0.9) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask))
            (pad "" smd rect (at -3.7 1.1 ${p.r}) (size 0.9 0.9) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask))
            (pad "" smd rect (at -3.7 -1.1 ${p.r}) (size 0.9 0.9) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask))
        )
        
        `
		    }
		};
		return slider;
	}

	var trrs;
	var hasRequiredTrrs;

	function requireTrrs () {
		if (hasRequiredTrrs) return trrs;
		hasRequiredTrrs = 1;
		// TRRS-PJ-320A-dual
		//
		// Normal footprint:
		//     _________________
		//    |   (2)   (3) (4)|
		//    |                |
		//    | (1)            |
		//    |________________|
		// 
		// Reverse footprint:
		//     _________________
		//    |   (2)   (3) (4)|
		//    | (1)            |
		//    | (1)            |
		//    |___(2)___(3)_(4)|
		//
		// Reverse & symmetric footprint:
		//     _________________
		//    | (1|2)   (3) (4)|
		//    |                |
		//    |_(1|2)___(3)_(4)|
		//
		// Nets
		//    A: corresponds to pin 1
		//    B: corresponds to pin 2
		//    C: corresponds to pin 3
		//    D: corresponds to pin 4
		// Params
		//    reverse: default is false
		//      if true, will flip the footprint such that the pcb can be reversible
		//    symmetric: default is false
		//      if true, will only work if reverse is also true
		//      this will cause the footprint to be symmetrical on each half
		//      pins 1 and 2 must be identical if symmetric is true, as they will overlap

		trrs = {
		  params: {
		    designator: 'TRRS',
		    reverse: false,
		    symmetric: false,
		    A: undefined,
		    B: undefined,
		    C: undefined,
		    D: undefined
		  },
		  body: p => {
		    const standard = `
      (module TRRS-PJ-320A-dual (layer F.Cu) (tedit 5970F8E5)

      ${p.at /* parametric position */}   

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 14.2) (layer Dwgs.User) (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value TRRS-PJ-320A-dual (at 0 -5.6) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))

      ${''/* corner marks */}
      (fp_line (start 0.5 -2) (end -5.1 -2) (layer Dwgs.User) (width 0.15))
      (fp_line (start -5.1 0) (end -5.1 -2) (layer Dwgs.User) (width 0.15))
      (fp_line (start 0.5 0) (end 0.5 -2) (layer Dwgs.User) (width 0.15))
      (fp_line (start -5.35 0) (end -5.35 12.1) (layer Dwgs.User) (width 0.15))
      (fp_line (start 0.75 0) (end 0.75 12.1) (layer Dwgs.User) (width 0.15))
      (fp_line (start 0.75 12.1) (end -5.35 12.1) (layer Dwgs.User) (width 0.15))
      (fp_line (start 0.75 0) (end -5.35 0) (layer Dwgs.User) (width 0.15))

      `;
		    function stabilizers(def_pos) {
		      return `
        (pad "" np_thru_hole circle (at ${def_pos} 8.6) (size 1.5 1.5) (drill 1.5) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at ${def_pos} 1.6) (size 1.5 1.5) (drill 1.5) (layers *.Cu *.Mask))
      `
		    }
		    function pins(def_neg, def_pos) {
		      return `
        (pad 1 thru_hole oval (at ${def_neg} 11.3 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.A})
        (pad 2 thru_hole oval (at ${def_pos} 10.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.B})
        (pad 3 thru_hole oval (at ${def_pos} 6.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.C})
        (pad 4 thru_hole oval (at ${def_pos} 3.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.D})
      `
		    }
		    if(p.reverse & p.symmetric) {
		      return `
        ${standard}
        ${stabilizers('-2.3')}
        ${pins('0', '-4.6')}
        ${pins('-4.6', '0')})
      `
		    } else if(p.reverse) {
		        return `
          ${standard}
          ${stabilizers('-2.3')}
          ${stabilizers('0')}
          ${pins('-2.3', '2.3')}
          ${pins('0', '-4.6')})
        `
		    } else {
		      return `
        ${standard}
        ${stabilizers('-2.3')}
        ${pins('-4.6', '0')})
      `
		    }
		  }
		};
		return trrs;
	}

	var via;
	var hasRequiredVia;

	function requireVia () {
		if (hasRequiredVia) return via;
		hasRequiredVia = 1;
		// Via
		// Nets
		//		net: the net this via should be connected to

		via = {
		    params: {
		      net: undefined
		    },
		    body: p => `
      (module VIA-0.6mm (layer F.Cu) (tedit 591DBFB0)
      ${p.at /* parametric position */}   
      ${'' /* footprint reference */}
      (fp_text reference REF** (at 0 1.4) (layer F.SilkS) hide (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value VIA-0.6mm (at 0 -1.4) (layer F.Fab) hide (effects (font (size 1 1) (thickness 0.15))))

      ${'' /* via */}
      (pad 1 thru_hole circle (at 0 0) (size 0.6 0.6) (drill 0.3) (layers *.Cu) (zone_connect 2) ${p.net})
      )
    `
		};
		return via;
	}

	var battery_connector_jst_ph_2;
	var hasRequiredBattery_connector_jst_ph_2;

	function requireBattery_connector_jst_ph_2 () {
		if (hasRequiredBattery_connector_jst_ph_2) return battery_connector_jst_ph_2;
		hasRequiredBattery_connector_jst_ph_2 = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @ceoloide
		//
		// Description:
		//  A reversible JST PH 2.0mm footprint with support for solder jumpers and traces. This is
		//  the same part sold at Typeractive.xyz and LCSC.
		//
		//  Note that the footprint's courtyard includes the space required for the male connector
		//  and its cables. Make sure to leave enough room in front of the connector. The silkscreen
		//  includes a handy reference for positive and negative terminals that remains visible
		//  after the connector is soldered, to ensure wire polarity is correct.
		//
		// Datasheet:
		//  https://cdn.shopify.com/s/files/1/0618/5674/3655/files/JST-S2B-PH-K.pdf?v=1670451309
		//
		// Params
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    include_traces: default is true
		//      if true it will include traces that connect the jumper pads to the connector pins
		//    trace_width: default is 0.250mm
		//      allows to override the trace width that connects the jumper pads to the connector
		//      pins. Not recommended to go below 0.25mm.
		//    include_silkscreen: default is true
		//      if true it will include the silkscreen. Recommended to be true to ensure connector
		//      polarity is not reversed, which can lead to shorting and damage to the MCU
		//    include_fabrication: default is true
		//      if true it will include the outline of the connector in the fabrication layer
		//    include_courtyard: default is true
		//      if true it will include a courtyard outline around the connector and in front of it
		//      to also account for the male connector plug and the wires. Recommended to be true
		//      at least once in the development of a board to confirm sufficient clearance for the
		//      connector and wires.
		//    battery_connector_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    battery_connector_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    battery_connector_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    battery_connector_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.

		battery_connector_jst_ph_2 = {
		  params: {
		    designator: 'JST',
		    side: 'F',
		    reversible: false,
		    include_traces: true,
		    trace_width: 0.250,
		    include_silkscreen: true,
		    include_fabrication: true,
		    include_courtyard: true,
		    battery_connector_3dmodel_filename: '',
		    battery_connector_3dmodel_xyz_offset: [0, 0, 0],
		    battery_connector_3dmodel_xyz_rotation: [0, 0, 0],
		    battery_connector_3dmodel_xyz_scale: [1, 1, 1],
		    BAT_P: { type: 'net', value: 'BAT_P' },
		    BAT_N: { type: 'net', value: 'GND' },
		  },
		  body: p => {
		    let local_nets = [
		      p.local_net("1"),
		      p.local_net("2"),
		    ];

		    const standard_opening = `
    (footprint "ceoloide:battery_connector_jst_ph_2"
        (layer "${p.side}.Cu")
        ${p.at}
        (property "Reference" "${p.ref}"
            (at 0 4.8 ${p.r})
            (layer "${p.side}.SilkS")
            ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
        )
        `;
		    const front_fabrication = `
        (fp_line (start -2.95 -1.35) (end -2.95 6.25) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -2.95 6.25) (end 2.95 6.25) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -2.25 -1.35) (end -2.95 -1.35) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -2.25 0.25) (end -2.25 -1.35) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 2.25 -1.35) (end 2.25 0.25) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 2.25 0.25) (end -2.25 0.25) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 2.95 -1.35) (end 2.25 -1.35) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 2.95 6.25) (end 2.95 -1.35) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        `;
		    const front_courtyard = `
        (fp_line (start -3.45 -1.85) (end -3.45 10.5) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start -3.45 10.5) (end 3.45 10.5) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start 3.45 -1.85) (end -3.45 -1.85) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start 3.45 10.5) (end 3.45 -1.85) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        `;
		    const front_silkscreen = `
        (fp_line (start -1.5 7.40) (end -0.5 7.40) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
        (fp_line (start 1.5 7.40) (end 0.5 7.40) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
        (fp_line (start 1 6.90) (end 1 7.90) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
        (fp_line (start -2.06 -1.46) (end -3.06 -1.46) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -3.06 -1.46) (end -3.06 -0.46) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 2.14 -1.46) (end 3.06 -1.46) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 3.06 -1.46) (end 3.06 -0.46) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -2.14 6.36) (end -3.06 6.36) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -3.06 6.36) (end -3.06 5.36) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 2.14 6.36) (end 3.06 6.36) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 3.06 6.36) (end 3.06 5.36) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        `;
		    const back_fabrication = `
        (fp_line (start -2.95 -1.35) (end -2.25 -1.35) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -2.95 6.25) (end -2.95 -1.35) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -2.25 -1.35) (end -2.25 0.25) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -2.25 0.25) (end 2.25 0.25) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 2.25 -1.35) (end 2.95 -1.35) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 2.25 0.25) (end 2.25 -1.35) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 2.95 -1.35) (end 2.95 6.25) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 2.95 6.25) (end -2.95 6.25) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        `;
		    const back_courtyard = `
        (fp_line (start -3.45 -1.85) (end -3.45 10.5) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start -3.45 10.5) (end 3.45 10.5) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start 3.45 -1.85) (end -3.45 -1.85) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start 3.45 10.5) (end 3.45 -1.85) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        `;
		    const back_silkscreen = `
        (fp_line (start 1.5 7.40) (end 0.5 7.40) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
        (fp_line (start -1.5 7.40) (end -0.5 7.40) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
        (fp_line (start -1 6.90) (end -1 7.90) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
        (fp_line (start -2.06 -1.46) (end -3.06 -1.46) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -3.06 -1.46) (end -3.06 -0.46) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 2.14 -1.46) (end 3.06 -1.46) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 3.06 -1.46) (end 3.06 -0.46) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -2.14 6.36) (end -3.06 6.36) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -3.06 6.36) (end -3.06 5.36) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 2.14 6.36) (end 3.06 6.36) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 3.06 6.36) (end 3.06 5.36) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        `;
		    const front_pads = `
        (pad "1" thru_hole roundrect (at -1 0 ${p.r}) (size 1.2 1.75) (drill 0.75) (layers "*.Cu" "*.Mask") (roundrect_rratio 0.20) ${p.BAT_N.str})
        (pad "2" thru_hole oval (at 1 0 ${p.r}) (size 1.2 1.75) (drill 0.75) (layers "*.Cu" "*.Mask") ${p.BAT_P.str})
        `;
		    const back_pads = `
        (pad "1" thru_hole roundrect (at 1 0 ${p.r}) (size 1.2 1.75) (drill 0.75) (layers "*.Cu" "*.Mask") (roundrect_rratio 0.20) ${p.BAT_N.str})
        (pad "2" thru_hole oval (at -1 0 ${p.r}) (size 1.2 1.75) (drill 0.75) (layers "*.Cu" "*.Mask") ${p.BAT_P.str})
        `;
		    const reversible_pads = `
        (pad "11" thru_hole oval (at -1 0 ${p.r}) (size 1.2 1.75) (drill 0.75) (layers "*.Cu" "*.Mask") ${local_nets[0].str})
        (pad "12" thru_hole oval (at 1 0 ${p.r}) (size 1.2 1.75) (drill 0.75) (layers "*.Cu" "*.Mask") ${local_nets[1].str})
        (pad "21" smd custom (at -1 1.8 ${180 + p.r}) (size 0.1 0.1) (layers "F.Cu" "F.Mask" "F.Paste")
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0.4)
                        (xy -0.6 0.4)
                        (xy -0.6 0.2)
                        (xy 0 -0.4)
                        (xy 0.6 0.2)
                    )   
                    (width 0)
                    (fill yes)
                )
            )
            ${local_nets[0]}
        )
        (pad "31" smd custom (at -1 1.8 ${180 + p.r}) (size 0.1 0.1) (layers "B.Cu" "B.Mask" "B.Paste")
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0.4)
                        (xy -0.6 0.4)
                        (xy -0.6 0.2)
                        (xy 0 -0.4)
                        (xy 0.6 0.2)
                    )
                    (width 0)
                    (fill yes)
                )
            )
            ${local_nets[0]}
        )
        (pad "22" smd custom (at 1 1.8 ${180 + p.r}) (size 0.1 0.1) (layers "F.Cu" "F.Mask" "F.Paste")
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0.4)
                        (xy -0.6 0.4)
                        (xy -0.6 0.2)
                        (xy 0 -0.4)
                        (xy 0.6 0.2)
                    )
                    (width 0)
                    (fill yes)
                )
            )
            ${local_nets[1]}
        )
        (pad "32" smd custom (at 1 1.8 ${180 + p.r}) (size 0.1 0.1) (layers "B.Cu" "B.Mask" "B.Paste")
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0.4)
                        (xy -0.6 0.4)
                        (xy -0.6 0.2)
                        (xy 0 -0.4)
                        (xy 0.6 0.2)
                    )
                    (width 0)
                    (fill yes)
                )
            )
            ${local_nets[1]}
        )
        (pad "1" smd custom (at -1 2.816 ${180 + p.r}) (size 1.2 0.5) (layers "F.Cu" "F.Mask" "F.Paste") ${p.BAT_P.str}
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0)
                        (xy -0.6 0)
                        (xy -0.6 1)
                        (xy 0 0.4)
                        (xy 0.6 1)
                    )
                    (width 0)
                    (fill yes)
                )
            )
        )
        (pad "1" smd custom (at 1 2.816 ${180 + p.r}) (size 1.2 0.5) (layers "B.Cu" "B.Mask" "B.Paste") ${p.BAT_P.str}
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0)
                        (xy -0.6 0)
                        (xy -0.6 1)
                        (xy 0 0.4)
                        (xy 0.6 1)
                    )
                    (width 0)
                    (fill yes)
                )
            )
        )
        (pad "2" smd custom (at -1 2.816 ${180 + p.r}) (size 1.2 0.5) (layers "B.Cu" "B.Mask" "B.Paste") ${p.BAT_N.str}
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0)
                        (xy -0.6 0)
                        (xy -0.6 1)
                        (xy 0 0.4)
                        (xy 0.6 1)
                    )
                    (width 0)
                    (fill yes)
                )
            )
        )
        (pad "2" smd custom (at 1 2.816 ${180 + p.r}) (size 1.2 0.5) (layers "F.Cu" "F.Mask" "F.Paste") ${p.BAT_N.str}
            (clearance 0.1) (zone_connect 0)
            (options (clearance outline) (anchor rect))
            (primitives
                (gr_poly
                    (pts
                        (xy 0.6 0)
                        (xy -0.6 0)
                        (xy -0.6 1)
                        (xy 0 0.4)
                        (xy 0.6 1)
                    )
                    (width 0)
                    (fill yes)
                )
            ) 
        )
        `;
		    const standard_closing = `
    )
        `;

		    const reversible_traces = ` 
    (segment (start ${p.eaxy(-1, 1.8)}) (end ${p.eaxy(-1, 0)}) (width ${p.trace_width}) (layer "F.Cu") (net ${local_nets[0].index}))
    (segment (start ${p.eaxy(-1, 1.8)}) (end ${p.eaxy(-1, 0)}) (width ${p.trace_width}) (layer "B.Cu") (net ${local_nets[0].index}))
    (segment (start ${p.eaxy(1, 1.8)}) (end ${p.eaxy(1, 0)}) (width ${p.trace_width}) (layer "F.Cu") (net ${local_nets[1].index}))
    (segment (start ${p.eaxy(1, 1.8)}) (end ${p.eaxy(1, 0)}) (width ${p.trace_width}) (layer "B.Cu") (net ${local_nets[1].index}))
        `;

		    const battery_connector_3dmodel = `
    (model ${p.battery_connector_3dmodel_filename}
      (offset (xyz ${p.battery_connector_3dmodel_xyz_offset[0]} ${p.battery_connector_3dmodel_xyz_offset[1]} ${p.battery_connector_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.battery_connector_3dmodel_xyz_scale[0]} ${p.battery_connector_3dmodel_xyz_scale[1]} ${p.battery_connector_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.battery_connector_3dmodel_xyz_rotation[0]} ${p.battery_connector_3dmodel_xyz_rotation[1]} ${p.battery_connector_3dmodel_xyz_rotation[2]}))
    )
    `;

		    let final = standard_opening;

		    if (p.side == "F" || p.reversible) {
		      if (p.include_fabrication) {
		        final += front_fabrication;
		      }
		      if (p.include_courtyard) {
		        final += front_courtyard;
		      }
		      if (p.include_silkscreen) {
		        final += front_silkscreen;
		      }
		    }
		    if (p.side == "B" || p.reversible) {
		      if (p.include_fabrication) {
		        final += back_fabrication;
		      }
		      if (p.include_courtyard) {
		        final += back_courtyard;
		      }
		      if (p.include_silkscreen) {
		        final += back_silkscreen;
		      }
		    }
		    if (p.reversible) {
		      final += reversible_pads;
		    } else if (p.side == "F") {
		      final += front_pads;
		    } else if (p.side == "B") {
		      final += back_pads;
		    }
		    if (p.battery_connector_3dmodel_filename) {
		      final += battery_connector_3dmodel;
		    }
		    final += standard_closing;
		    if (p.reversible && p.include_traces) {
		      final += reversible_traces;
		    }
		    return final;
		  }
		};
		return battery_connector_jst_ph_2;
	}

	/*
	Copyright (c) 2023 Marco Massarelli

	SPDX-License-Identifier: CC-BY-NC-SA-4.0

	To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/

	Author: @infused-kim + @ceoloide improvements

	Description:
	  PCB footprint for for molex pico ezmate connector with 2 pins. Ideal for
	  battery connections.

	  This connector was chosen over the more common JST connector, because it
	  has a mated profile height of only 1.65 mm. This is lower than the Kailh
	  Choc hotswap sockets.

	  It should also be compatible with the JST ACH connector (which is almost the
	  same).

	  One downside is that there are almost no batteries that ship with this
	  connector. The one exception is the Nintendo Joycon 500 mAh battery.

	  If you want to use the common 301230 battery, you will either need to crimp
	  the connector yourself or buy a pre-crimped connector that you attach to
	  the battery wires (available on digikey).

	Params:
	  side: default is F for Front
	      the side on which to place the single-side footprint and designator, either F or B
	  reversible: default is false
	    if true, it will include pads on both Front and Back to make the footprint reversible
	  include_silkscreen: default is true
	    if true it will include the silkscreen. Recommended to be true to ensure connector
	    polarity is not reversed, which can lead to shorting and damage to the MCU
	  include_fabrication: default is true
	    if true it will include the outline of the connector in the fabrication layer
	  include_courtyard: default is true
	    if true it will include a courtyard outline around the connector and in front of it
	    to also account for the male connector plug and the wires. Recommended to be true
	    at least once in the development of a board to confirm sufficient clearance for the
	    connector and wires.

	@ceoloide's improvements:
	  - Add parameters to control silkscreen, fabrication, and courtyard
	  - Expand courtyard to include space for the connector cable
	  - Add polarity silkscreen
	  - Upgrade to KiCad 8
	*/

	var battery_connector_molex_pico_ezmate_1x02;
	var hasRequiredBattery_connector_molex_pico_ezmate_1x02;

	function requireBattery_connector_molex_pico_ezmate_1x02 () {
		if (hasRequiredBattery_connector_molex_pico_ezmate_1x02) return battery_connector_molex_pico_ezmate_1x02;
		hasRequiredBattery_connector_molex_pico_ezmate_1x02 = 1;
		battery_connector_molex_pico_ezmate_1x02 = {
		  params: {
		    designator: 'CONN',
		    side: 'F',
		    reversible: false,
		    include_silkscreen: true,
		    include_fabrication: true,
		    include_courtyard: true,
		    BAT_P: { type: 'net', value: 'BAT_P' },
		    BAT_N: { type: 'net', value: 'GND' },
		  },
		  body: p => {
		    const top = `
  (footprint "ceoloide:battery_connector_molex_pico_ezmate_1x02"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0.1 3.9 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr smd)
    `;

		    const front_silkscreen = `
    (fp_line (start 0.5 3.85) (end 1.5 3.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 1 4.35) (end 1 3.35) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.5 3.85) (end -1.5 3.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 0.64 2.63) (end 1.14 2.63) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 0.34 2.13) (end 0.64 2.63) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.34 2.13) (end 0.34 2.13) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.64 2.63) (end -0.34 2.13) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.16 -2.09) (end -1.16 -2.3) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.21 -2.09) (end -1.16 -2.09) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.21 1.24) (end -2.21 -2.09) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.14 2.63) (end -0.64 2.63) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.21 -2.09) (end 1.16 -2.09) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.21 1.24) (end 2.21 -2.09) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    `;
		    const front_fabrication = `
    (fp_line (start -0.45 2.02) (end 0.45 2.02) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -0.75 2.52) (end -0.45 2.02) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -2.1 2.52) (end -0.75 2.52) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -2.1 -1.98) (end 2.1 -1.98) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -0.6 -1.272893) (end -0.1 -1.98) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -1.1 -1.98) (end -0.6 -1.272893) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.1 -1.98) (end 2.1 2.52) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -2.1 -1.98) (end -2.1 2.52) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 0.75 2.52) (end 2.1 2.52) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 0.45 2.02) (end 0.75 2.52) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    `;
		    const front_courtyard = `
    (fp_line (start 2.6 -2.8) (end -2.6 -2.8) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -2.6 -2.8) (end -2.6 6.75) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 2.6 6.75) (end 2.6 -2.8) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -2.6 6.75) (end 2.6 6.75) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    `;
		    const front_pads = `
    (pad "" smd roundrect (at 1.75 1.9 ${p.r}) (size 0.7 0.8) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25))
    (pad "" smd roundrect (at -1.75 1.9 ${p.r}) (size 0.7 0.8) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25))
    (pad "2" smd roundrect (at 0.6 -1.875 ${p.r}) (size 0.6 0.85) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25) ${p.BAT_P.str})
    (pad "1" smd roundrect (at -0.6 -1.875 ${p.r}) (size 0.6 0.85) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25) ${p.BAT_N.str})
    `;
		    const back_silkscreen = `
    (fp_line (start 0.5 3.85) (end 1.5 3.85) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.5 3.85) (end -1.5 3.85) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -1 4.35) (end -1 3.35) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.34 2.13) (end -0.64 2.63) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.64 2.63) (end -1.14 2.63) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 1.16 -2.09) (end 1.16 -2.3) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.21 -2.09) (end 1.16 -2.09) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.21 1.24) (end 2.21 -2.09) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.21 -2.09) (end -1.16 -2.09) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.21 1.24) (end -2.21 -2.09) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 0.64 2.63) (end 0.34 2.13) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 1.14 2.63) (end 0.64 2.63) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 0.34 2.13) (end -0.34 2.13) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    `;
		    const back_fabrication = `
    (fp_line (start 2.1 -1.98) (end -2.1 -1.98) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 0.6 -1.272893) (end 0.1 -1.98) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 1.1 -1.98) (end 0.6 -1.272893) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -2.1 -1.98) (end -2.1 2.52) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.1 -1.98) (end 2.1 2.52) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -0.75 2.52) (end -2.1 2.52) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -0.45 2.02) (end -0.75 2.52) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 0.45 2.02) (end -0.45 2.02) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 0.75 2.52) (end 0.45 2.02) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.1 2.52) (end 0.75 2.52) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    `;
		    const back_courtyard = `
    (fp_line (start -2.6 6.75) (end -2.6 -2.8) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 2.6 6.75) (end -2.6 6.75) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -2.6 -2.8) (end 2.6 -2.8) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 2.6 -2.8) (end 2.6 6.75) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    `;
		    const back_pads = `
    (pad "" smd roundrect (at 1.75 1.9 ${180 + p.r}) (size 0.7 0.8) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25))
    (pad "" smd roundrect (at -1.75 1.9 ${180 + p.r}) (size 0.7 0.8) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25))
    (pad "1" smd roundrect (at 0.6 -1.875 ${180 + p.r}) (size 0.6 0.85) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25) ${p.BAT_N.str})
    (pad "2" smd roundrect (at -0.6 -1.875 ${180 + p.r}) (size 0.6 0.85) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25) ${p.BAT_P.str})
    `;
		    const bottom = `
  )
    `;
		    let final = top;
		    if (p.side == "F" || p.reversible) {
		      final += front_pads;
		      if(p.include_silkscreen) final += front_silkscreen;
		      if(p.include_courtyard) final += front_courtyard;
		      if(p.include_fabrication) final += front_fabrication;
		    }
		    if (p.side == "B" || p.reversible) {
		      final += back_pads;
		      if(p.include_silkscreen) final += back_silkscreen;
		      if(p.include_courtyard) final += back_courtyard;
		      if(p.include_fabrication) final += back_fabrication;
		    }
		    final += bottom;
		    return final;
		  }
		};
		return battery_connector_molex_pico_ezmate_1x02;
	}

	var diode_tht_sod123;
	var hasRequiredDiode_tht_sod123;

	function requireDiode_tht_sod123 () {
		if (hasRequiredDiode_tht_sod123) return diode_tht_sod123;
		hasRequiredDiode_tht_sod123 = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Authors: @ergogen + (@infused-kim, @ceoloide, @achamian, @im-AMS improvements)
		//
		// Description:
		//  Combined Thru-Hole and SMD diode footprint for SOD-123 package, like the Semtech 1N4148W
		//  component sold by Typeractive.xyz or LCSC.
		//
		// Datasheet:
		//  https://cdn.shopify.com/s/files/1/0618/5674/3655/files/Semtech-1N4148W.pdf?v=1670451309
		//
		// Params:
		//    side: default is B for Back
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    include_thru_hole_smd_pads: default is false
		//      if true, the reversible pads will include a thru-hole on the SMD pad to connect
		//      front to back, for ease of routing. This may make SMD soldering slightly harder.
		//    include_traces_vias: default is false
		//      if true it will include traces and vias when reversible is true, and include_tht if false,
		//      using this can make routing simpler with reversible PCBs. In the other cases it's simply
		//      not needed.
		//    trace_distance: default is 1.2
		//      this is the extra distance the trace moves from the pad, and creates a via. By default it goes outward.
		//      you could set this to -1.1, and the trace moves inward and creates the via under the diode.
		//    trace_width: default is 0.250mm
		//      allows to override the trace width that connects the pads. Not recommended
		//      to go below 0.15mm (JLCPC min is 0.127mm).
		//    via_size: default is 0.6
		//      allows to define the size of the via. Not recommended below 0.56 (JLCPCB minimum),
		//      or above 0.8 (KiCad default), to avoid overlap or DRC errors
		//    via_drill: default is 0.3
		//      allows to define the size of the drill. Not recommended below 0.3 (JLCPCB minimum),
		//      or above 0.4 (KiCad default), to avoid overlap or DRC errors
		//    include_tht: default is false
		//      if true it includes through-hole pads alongside SMD ones
		//    diode_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    diode_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    diode_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    diode_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//
		// @infused-kim's improvements:
		//  - Add option to hide thru-holes
		//  - Add virtual attribute to silence DRC error
		//
		// @ceoloide's improvements:
		//  - Add single side support
		//  - Upgrade to KiCad 8
		//  - Add traces for THT pads
		//
		// @grazfather's improvements:
		//  - Add support for switch 3D model
		//
		// @achamian's improvements:
		//  - Add thru-hole SMD pads for ease of routing
		//
		// @im-AMS's improvements:
		//  - Add traces and vias to connect reversible SMD pads when no THT are present

		diode_tht_sod123 = {
		  params: {
		    designator: 'D',
		    side: 'B',
		    reversible: false,
		    include_traces_vias: false,
		    trace_distance: { type: 'number', value: 1.2 },
		    trace_width: 0.25,
		    via_size: 0.6,
		    via_drill: 0.3,
		    include_tht: false,
		    include_thru_hole_smd_pads: false,
		    diode_3dmodel_filename: '',
		    diode_3dmodel_xyz_offset: [0, 0, 0],
		    diode_3dmodel_xyz_rotation: [0, 0, 0],
		    diode_3dmodel_xyz_scale: [1, 1, 1],
		    from: { type: 'net', value: undefined },
		    to: { type: 'net', value: undefined }
		  },
		  body: p => {
		    const standard_opening = `
    (footprint "ceoloide:diode_tht_sod123"
        (layer "${p.reversible ? 'F' : p.side}.Cu")
        ${p.at}
        (property "Reference" "${p.ref}"
            (at 0 0 ${p.r})
            (layer "${p.reversible ? 'F' : p.side}.SilkS")
            ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
        )
        `;
		    // This can be useful to avoid confusion from the fab, since via-in-pads are usually premium
		    const thru_hole_smd_pads_description = `
      (property "Description" "Thru-hole SMD pads, *NOT* via-in-pad (do not plug or tent)."
        (at 0 0 0)
        (unlocked yes)
        (layer "F.Fab")
        (hide yes)
        (effects
          (font
            (size 1.27 1.27)
          )
        )
      )
    `;
		    const front_silk = `
      (fp_line (start 0.25 0) (end 0.75 0) (layer "F.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start 0.25 0.4) (end -0.35 0) (layer "F.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer "F.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.35 0) (end 0.25 -0.4) (layer "F.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.35 0) (end -0.35 0.55) (layer "F.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.35 0) (end -0.35 -0.55) (layer "F.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.75 0) (end -0.35 0) (layer "F.SilkS") (stroke (width 0.1) (type solid)))
        `;

		    const front_smd_pads = `
      (pad "1" smd rect (at -1.65 0 ${p.r}) (size 0.9 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to.str})
      (pad "2" smd rect (at 1.65 0 ${p.r}) (size 0.9 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from.str})
        `;
		    const back_silk = `
      (fp_line (start 0.25 0) (end 0.75 0) (layer "B.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start 0.25 0.4) (end -0.35 0) (layer "B.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer "B.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.35 0) (end 0.25 -0.4) (layer "B.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.35 0) (end -0.35 0.55) (layer "B.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.35 0) (end -0.35 -0.55) (layer "B.SilkS") (stroke (width 0.1) (type solid)))
      (fp_line (start -0.75 0) (end -0.35 0) (layer "B.SilkS") (stroke (width 0.1) (type solid)))
        `;
		    const back_smd_pads = `
      (pad "1" smd rect (at -1.65 0 ${p.r}) (size 0.9 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.to.str})
      (pad "2" smd rect (at 1.65 0 ${p.r}) (size 0.9 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from.str})
        `;
		      
		    const reversible_tht_pads = `
      (pad "1" thru_hole rect (at -1.65 0 ${p.r}) (size 0.9 1.2) (drill 0.3) (layers "*.Cu" "*.Paste" "*.Mask") ${p.to.str})
      (pad "2" thru_hole rect (at 1.65 0 ${p.r}) (size 0.9 1.2) (drill 0.3) (layers "*.Cu" "*.Paste" "*.Mask") ${p.from.str})
        `;

		    const tht = `
      (pad "1" thru_hole rect (at -3.81 0 ${p.r}) (size 1.778 1.778) (drill 0.9906) (layers "*.Cu" "*.Mask") ${p.to.str})
      (pad "2" thru_hole circle (at 3.81 0 ${p.r}) (size 1.905 1.905) (drill 0.9906) (layers "*.Cu" "*.Mask") ${p.from.str})
        `;

		    const diode_3dmodel = `
      (model ${p.diode_3dmodel_filename}
          (offset (xyz ${p.diode_3dmodel_xyz_offset[0]} ${p.diode_3dmodel_xyz_offset[1]} ${p.diode_3dmodel_xyz_offset[2]}))
          (scale (xyz ${p.diode_3dmodel_xyz_scale[0]} ${p.diode_3dmodel_xyz_scale[1]} ${p.diode_3dmodel_xyz_scale[2]}))
          (rotate (xyz ${p.diode_3dmodel_xyz_rotation[0]} ${p.diode_3dmodel_xyz_rotation[1]} ${p.diode_3dmodel_xyz_rotation[2]})))
        `;
		    const standard_closing = `
    )
        `;
		    const tht_traces = `
    (segment
      (start ${p.eaxy(3.81, 0)})
      (end ${p.eaxy(1.65, 0)})
      (width ${p.trace_width})
      (layer "F.Cu")
      (net ${p.from.index})
    )
    (segment
      (start ${p.eaxy(3.81, 0)})
      (end ${p.eaxy(1.65, 0)})
      (width ${p.trace_width})
      (layer "B.Cu")
      (net ${p.from.index})
    )
    (segment
      (start ${p.eaxy(-1.65, 0)})
      (end ${p.eaxy(-3.81, 0)})
      (width ${p.trace_width})
      (layer "F.Cu")
      (net ${p.to.index})
    )
    (segment
      (start ${p.eaxy(-1.65, 0)})
      (end ${p.eaxy(-3.81, 0)})
      (width ${p.trace_width})
      (layer "B.Cu")
      (net ${p.to.index})
    )
    `;

		    const smd_pad_traces = `
    (segment
      (start ${p.eaxy(1.65, 0)})
      (end ${p.eaxy(1.65 + 1*p.trace_distance, 0)})
      (width ${p.trace_width})
      (layer "F.Cu")
      (net ${p.from.index})
    )
    (via
      (at ${p.eaxy(1.65 + 1*p.trace_distance, 0)})
      (size ${p.via_size})
      (drill ${p.via_drill})
      (layers "F.Cu" "B.Cu")
      (net ${p.from.index})
    )
    (segment
      (start ${p.eaxy(1.65 + 1*p.trace_distance, 0)})
      (end ${p.eaxy(1.65, 0)})
      (width ${p.trace_width})
      (layer "B.Cu")
      (net ${p.from.index})
    )
    (segment
      (start ${p.eaxy(-1.65, 0)})
      (end ${p.eaxy(-1.65 - 1*p.trace_distance, 0)})
      (width ${p.trace_width})
      (layer "F.Cu")
      (net ${p.to.index})
    )
    (via
      (at ${p.eaxy(-1.65 - 1*p.trace_distance, 0)})
      (size ${p.via_size})
      (drill ${p.via_drill})
      (layers "F.Cu" "B.Cu")
      (net ${p.to.index})
    )
    (segment
      (start ${p.eaxy(-1.65 - 1*p.trace_distance, 0)})
      (end ${p.eaxy(-1.65, 0)})
      (width ${p.trace_width})
      (layer "B.Cu")
      (net ${p.to.index})
    )
    `;

		    let final = standard_opening;

		    if (p.side == "F" || p.reversible) {
		      final += front_silk;
		      if(!p.include_thru_hole_smd_pads) {
		        final += front_smd_pads;
		      }
		    }
		    if (p.side == "B" || p.reversible) {
		      final += back_silk;
		      if(!p.include_thru_hole_smd_pads) {
		        final += back_smd_pads;
		      }
		    }
		    if (p.include_tht) {
		      final += tht;
		    }
		    if (p.reversible && p.include_thru_hole_smd_pads) {
		      final += thru_hole_smd_pads_description;
		      final += reversible_tht_pads;
		    }

		    if (p.diode_3dmodel_filename) {
		      final += diode_3dmodel;
		    }

		    final += standard_closing;

		    if (p.reversible && p.include_traces_vias) {
		      if(p.include_tht) {
		        final += tht_traces;
		      } else if (!p.include_tht && !p.include_thru_hole_smd_pads) {
		        final += smd_pad_traces;
		      }
		    }

		    return final;
		  }
		};
		return diode_tht_sod123;
	}

	var display_nice_view;
	var hasRequiredDisplay_nice_view;

	function requireDisplay_nice_view () {
		if (hasRequiredDisplay_nice_view) return display_nice_view;
		hasRequiredDisplay_nice_view = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Author: @infused-kim + @ceoloide improvements
		//
		// Description:
		//  Reversible footprint for nice!view display. Includes an outline of the
		//  display to make positioning easier.
		//
		//  Note that because the center pin is VCC on both sides, there is no associated jumper pad
		//  in the reversible footprint.
		//
		//  In its default configuration, jumper pads are positioned above the pins, when the
		//  component is oriented verically and pointing upwards, or left of the pins, when oriented
		//  horizontally and oriented leftward. Jumper pads position can be inverted with a parameter.
		//
		//  In its default configuration, labels are positioned below the pins, when the
		//  component is oriented verically and pointing upwards, or right of the pins, when oriented
		//  horizontally and oriented leftward. Labels position can be inverted with a parameter.
		//
		// Pinout and schematics:
		//  https://nicekeyboards.com/docs/nice-view/pinout-schematic
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    include_traces: default is true
		//      if true it will include traces that connect the jumper pads to the vias
		//      and the through-holes for the MCU
		//    gnd_trace_width: default is 0.250mm
		//      allows to override the GND trace width. Not recommended to go below 0.25mm (JLCPC
		//      min is 0.127mm).
		//    signal_trace_width: default is 0.250mm
		//      allows to override the trace width that connects the jumper pads to the MOSI, SCK,
		//      and CS pins. Not recommended to go below 0.15mm (JLCPC min is 0.127mm).
		//    invert_jumpers_position default is false
		//      allows to change the position of the jumper pads, from their default to the opposite
		//      side of the pins. See the description above for more details.
		//    invert_labels_position default is false
		//      allows to change the position of the labels, from their default to the north
		//      side of the pins. See the description above for more details.
		//    include_silkscreen: default is true
		//      if true it will include the silkscreen layer.
		//    include_labels default is true
		//      if true and Silkscreen layer is included, it will include the pin labels. The labels
		//      will match the *opposite* side of the board when the footprint is set to be reversible, 
		//      since they are meant to match the solder jumpers behavior and aid testing.
		//    include_courtyard: default is true
		//      if true it will include a courtyard outline around the pin header.
		//    niceview_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB for the nice!view display. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    niceview_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the nice!view 3d model
		//      relative to the footprint.
		//    niceview_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the nice!view 3d model relative to its
		//      original size.
		//    niceview_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the nice!view 3d
		//      model relative to the footprint.
		//    pin_socket_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file for pin socket to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    pin_socket_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the pin socket 3d model
		//      relative to the footprint.
		//    pin_socket_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the pin socket 3d model relative to its
		//      original size.
		//    pin_socket_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the pin socket 3d
		//      model relative to the footprint.
		//    pin_header_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file for pin header to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    pin_header_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the pin header 3d model
		//      relative to the footprint.
		//    pin_header_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the pin header 3d model relative to its
		//      original size.
		//    pin_header_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the pin header 3d
		//      model relative to the footprint.
		//
		// @ceoloide's improvements:
		//  - Added support for traces
		//  - Upgraded to KiCad 8 format
		//  - Make silkscreen and courtyard optional
		//  - Added ability to move labels and jumpers independently
		//
		// # Placement and soldering of jumpers
		//
		// The reversible footprint is meant to be used with jumpers on the
		// OPPOSITE side of where the nice!view is installed. The silkscreen
		// labels will also match the board when read on the opposite side.
		// This is to have all jumpers and components to solder on the same
		// side, and be able to read the correct labels of the display to do
		// tests with a multimeter.
		//
		// @nidhishs' improvements:
		// - Added 3D model support

		display_nice_view = {
		  params: {
		    designator: 'DISP',
		    side: 'F',
		    reversible: false,
		    include_traces: true,
		    gnd_trace_width: 0.25,
		    signal_trace_width: 0.25,
		    invert_jumpers_position: false,
		    invert_labels_position: false,
		    include_silkscreen: true,
		    include_labels: true,
		    include_courtyard: true,
		    niceview_3dmodel_filename: '',
		    niceview_3dmodel_xyz_offset: [0, 0, 0],
		    niceview_3dmodel_xyz_rotation: [0, 0, 0],
		    niceview_3dmodel_xyz_scale: [1, 1, 1],
		    pin_socket_3dmodel_filename: '',
		    pin_socket_3dmodel_xyz_offset: [0, 0, 0],
		    pin_socket_3dmodel_xyz_rotation: [0, 0, 0],
		    pin_socket_3dmodel_xyz_scale: [1, 1, 1],
		    pin_header_3dmodel_filename: '',
		    pin_header_3dmodel_xyz_offset: [0, 0, 0],
		    pin_header_3dmodel_xyz_rotation: [0, 0, 0],
		    pin_header_3dmodel_xyz_scale: [1, 1, 1],
		    MOSI: { type: 'net', value: 'MOSI' },
		    SCK: { type: 'net', value: 'SCK' },
		    VCC: { type: 'net', value: 'VCC' },
		    GND: { type: 'net', value: 'GND' },
		    CS: { type: 'net', value: 'CS' },
		  },
		  body: p => {
		    let dst_nets = [
		      p.MOSI,
		      p.SCK,
		      p.VCC,
		      p.GND,
		      p.CS,
		    ];

		    let local_nets = [
		      p.local_net("1"),
		      p.local_net("2"),
		      p.VCC,
		      p.local_net("4"),
		      p.local_net("5"),
		    ];

		    if (p.reversible || p.side == "B") {
		      dst_nets = dst_nets.slice().reverse();
		    }
		    let socket_nets = p.reversible ? local_nets : dst_nets;

		    let jumpers_offset = 0;
		    let labels_offset = 3.75;
		    let label_vcc_offset = 3.75;

		    let jumpers_front_top = dst_nets;
		    let jumpers_front_bottom = local_nets;
		    let jumpers_back_top = dst_nets;
		    let jumpers_back_bottom = local_nets.slice().reverse();

		    if (p.invert_labels_position) {
		      if(p.reversible && !p.invert_jumpers_position) {
		          label_vcc_offset = 0;
		          labels_offset = -1.62;
		      } else {
		        label_vcc_offset = 0;
		        labels_offset = label_vcc_offset;
		      }
		    } else {
		      if(p.reversible && p.invert_jumpers_position) {
		        labels_offset = 1.62 + label_vcc_offset;
		      }
		    }
		    if (p.invert_jumpers_position) {
		      jumpers_offset = 4.4;

		      jumpers_front_top = local_nets;
		      jumpers_front_bottom = dst_nets;
		      jumpers_back_top = local_nets.slice().reverse();
		      jumpers_back_bottom = dst_nets;
		    }

		    const top = `
  (footprint "ceoloide:display_nice_view"
    (layer ${p.side}.Cu)
    ${p.at /* parametric position */}
    (property "Reference" "${p.ref}"
      (at 0 20 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr exclude_from_pos_files exclude_from_bom)
    `;
		    const front_silkscreen = `
    (fp_line (start -6.41 15.37) (end -6.41 18.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.41 18.03) (end -6.41 18.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.41 15.37) (end 6.41 18.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.41 15.37) (end -6.41 15.37) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    `;
		    const front_courtyard = `
    (fp_line (start 6.88 14.9) (end 6.88 18.45) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start 6.88 18.45) (end -6.82 18.45) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.82 18.45) (end -6.82 14.9) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.82 14.9) (end 6.88 14.9) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    `;

		    const front_jumpers = `
    (pad "14" smd rect (at -5.08 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[0].str})
    (pad "15" smd rect (at -2.54 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[1].str})
    (pad "16" smd rect (at 2.54 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[3].str})
    (pad "17" smd rect (at 5.08 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[4].str})

    (pad "10" smd rect (at -5.08 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[0].str})
    (pad "11" smd rect (at -2.54 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[1].str})
    (pad "12" smd rect (at 2.54 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[3].str})
    (pad "13" smd rect (at 5.08 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[4].str})
    `;

		    const back_silkscreen = `
    (fp_line (start 6.41 15.37) (end 6.41 18.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.41 15.37) (end -6.41 15.37) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.41 18.03) (end -6.41 18.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.41 15.37) (end -6.41 18.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    `;

		    const back_courtyard = `
    (fp_line (start 6.88 14.9) (end 6.88 18.45) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start 6.88 18.45) (end -6.82 18.45) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.82 18.45) (end -6.82 14.9) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.82 14.9) (end 6.88 14.9) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    `;

		    const back_jumpers = `
    (pad "24" smd rect (at 5.08 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[0].str})
    (pad "25" smd rect (at 2.54 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[1].str})
    (pad "26" smd rect (at -2.54 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[3].str})
    (pad "27" smd rect (at -5.08 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[4].str})

    (pad "20" smd rect (at 5.08 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[0].str})
    (pad "21" smd rect (at 2.54 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[1].str})
    (pad "22" smd rect (at -2.54 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[3].str})
    (pad "23" smd rect (at -5.08 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[4].str})
    `;

		    const silkscreen_labels_front = `
    (fp_text user "${dst_nets[0].name}" (at -5.08 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position  ? "right" : "left"}))
    )
    (fp_text user "${dst_nets[1].name}" (at -2.48 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "right" : "left"}))
    )
    (fp_text user "${dst_nets[2].name}" (at 0.15 ${14.75 + label_vcc_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "right" : "left"}))
    )
    (fp_text user "${dst_nets[3].name}" (at 2.62 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "right" : "left"}))
    )
    (fp_text user "${dst_nets[4].name}" (at 5.12 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "right" : "left"}))
    )
    `;

		    const silkscreen_labels_back = `
    (fp_text user "${p.reversible ? dst_nets[0].name : dst_nets[4].name}" (at 5.22 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    (fp_text user "${p.reversible ? dst_nets[1].name : dst_nets[3].name}" (at 2.72 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    (fp_text user "${p.reversible ? dst_nets[2].name : dst_nets[2].name}" (at 0.15 ${14.75 + label_vcc_offset} ${90 + p.r}) (unlocked yes) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    (fp_text user "${p.reversible ? dst_nets[3].name : dst_nets[1].name}" (at -2.38 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    (fp_text user "${p.reversible ? dst_nets[4].name : dst_nets[0].name}" (at -4.98 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    `;

		    const niceview_3dmodel = `
    (model ${p.niceview_3dmodel_filename}
      (offset (xyz ${p.niceview_3dmodel_xyz_offset[0]} ${p.niceview_3dmodel_xyz_offset[1]} ${p.niceview_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.niceview_3dmodel_xyz_scale[0]} ${p.niceview_3dmodel_xyz_scale[1]} ${p.niceview_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.niceview_3dmodel_xyz_rotation[0]} ${p.niceview_3dmodel_xyz_rotation[1]} ${p.niceview_3dmodel_xyz_rotation[2]}))
    )
    `;

		    const pin_socket_3dmodel = `
    (model ${p.pin_socket_3dmodel_filename}
      (offset (xyz ${p.pin_socket_3dmodel_xyz_offset[0]} ${p.pin_socket_3dmodel_xyz_offset[1]} ${p.pin_socket_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.pin_socket_3dmodel_xyz_scale[0]} ${p.pin_socket_3dmodel_xyz_scale[1]} ${p.pin_socket_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.pin_socket_3dmodel_xyz_rotation[0]} ${p.pin_socket_3dmodel_xyz_rotation[1]} ${p.pin_socket_3dmodel_xyz_rotation[2]}))
    )
    `;

		    const pin_header_3dmodel = `
    (model ${p.pin_header_3dmodel_filename}
      (offset (xyz ${p.pin_header_3dmodel_xyz_offset[0]} ${p.pin_header_3dmodel_xyz_offset[1]} ${p.pin_header_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.pin_header_3dmodel_xyz_scale[0]} ${p.pin_header_3dmodel_xyz_scale[1]} ${p.pin_header_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.pin_header_3dmodel_xyz_rotation[0]} ${p.pin_header_3dmodel_xyz_rotation[1]} ${p.pin_header_3dmodel_xyz_rotation[2]}))
    )
    `;

		    const bottom = `
    (pad "1" thru_hole oval (at -5.08 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[0].str})
    (pad "2" thru_hole oval (at -2.54 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[1].str})
    (pad "3" thru_hole oval (at 0 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[2].str})
    (pad "4" thru_hole oval (at 2.54 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[3].str})
    (pad "5" thru_hole circle (at 5.08 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[4].str})

    (fp_line (start 5.4 13.4) (end 5.4 -11.9) (layer Dwgs.User) (stroke (width 0.15) (type solid)))
    (fp_line (start -5.4 13.4) (end -5.4 -11.9) (layer Dwgs.User) (stroke (width 0.15) (type solid)))
    (fp_line (start 5.4 -11.9) (end -5.4 -11.9) (layer Dwgs.User) (stroke (width 0.15) (type solid)))
    (fp_line (start -5.4 13.4) (end 5.4 13.4) (layer Dwgs.User) (stroke (width 0.15) (type solid)))

    (fp_line (start -7 -18) (end 7 -18) (layer Dwgs.User) (stroke (width 0.15) (type solid)))
    (fp_line (start 7 18) (end -7 18) (layer Dwgs.User) (stroke (width 0.15) (type solid)))
    (fp_line (start -7 18) (end -7 -18) (layer Dwgs.User) (stroke (width 0.15) (type solid)))
    (fp_line (start 7 18) (end 7 -18) (layer Dwgs.User) (stroke (width 0.15) (type solid)))
  )
    `;

		    const traces_bottom = `
  (segment (start ${p.eaxy(-5.08, 16.7)}) (end ${p.eaxy(-5.08, 18.45)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-2.54, 16.7)}) (end ${p.eaxy(-2.54, 18.45)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(2.54, 16.7)}) (end ${p.eaxy(2.54, 18.45)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[3].index}))
  (segment (start ${p.eaxy(5.08, 16.7)}) (end ${p.eaxy(5.08, 18.45)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[4].index}))
  (segment (start ${p.eaxy(-5.08, 16.7)}) (end ${p.eaxy(-5.08, 18.45)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-2.54, 16.7)}) (end ${p.eaxy(-2.54, 18.45)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(2.54, 16.7)}) (end ${p.eaxy(2.54, 18.45)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${socket_nets[3].index}))
  (segment (start ${p.eaxy(5.08, 16.7)}) (end ${p.eaxy(5.08, 18.45)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[4].index}))
    `;

		    const traces_top = `
  (segment (start ${p.eaxy(-5.08, 16.7)}) (end ${p.eaxy(-5.08, 14.95)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-2.54, 16.7)}) (end ${p.eaxy(-2.54, 14.95)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(2.54, 16.7)}) (end ${p.eaxy(2.54, 14.95)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[3].index}))
  (segment (start ${p.eaxy(5.08, 16.7)}) (end ${p.eaxy(5.08, 14.95)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[4].index}))
  (segment (start ${p.eaxy(-5.08, 16.7)}) (end ${p.eaxy(-5.08, 14.95)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-2.54, 16.7)}) (end ${p.eaxy(-2.54, 14.95)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(2.54, 16.7)}) (end ${p.eaxy(2.54, 14.95)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${socket_nets[3].index}))
  (segment (start ${p.eaxy(5.08, 16.7)}) (end ${p.eaxy(5.08, 14.95)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[4].index}))
    `;

		    let final = top;

		    if (p.side == "F" || p.reversible) {
		      if (p.include_silkscreen) {
		        final += front_silkscreen;
		        if (p.include_labels) final += silkscreen_labels_front;
		      }
		      if (p.include_courtyard) final += front_courtyard;
		    }
		    if (p.side == "B" || p.reversible) {
		      if (p.include_silkscreen) {
		        final += back_silkscreen;
		        if (p.include_labels) final += silkscreen_labels_back;
		      }
		      if (p.include_courtyard) final += back_courtyard;
		    }
		    if (p.reversible) {
		      final += front_jumpers;
		      final += back_jumpers;
		    }
		    if (p.niceview_3dmodel_filename) {
		      final += niceview_3dmodel;
		    }
		    if (p.pin_socket_3dmodel_filename) {
		      final += pin_socket_3dmodel;
		    }
		    if (p.pin_header_3dmodel_filename) {
		      final += pin_header_3dmodel;
		    }
		    final += bottom;
		    if (p.include_traces && p.reversible) {
		      if (p.invert_jumpers_position) {
		        final += traces_bottom;
		      } else {
		        final += traces_top;
		      }
		    }
		    return final;
		  }
		};
		return display_nice_view;
	}

	var display_ssd1306;
	var hasRequiredDisplay_ssd1306;

	function requireDisplay_ssd1306 () {
		if (hasRequiredDisplay_ssd1306) return display_ssd1306;
		hasRequiredDisplay_ssd1306 = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Author: @ceoloide
		//
		// Description:
		//  Reversible footprint for SSD1306 OLED display. Includes an outline of the
		//  display to make positioning easier.
		//
		//  In its default configuration, jumper pads are positioned above the pins, when the
		//  component is oriented verically and pointing upwards, or left of the pins, when oriented
		//  horizontally and oriented leftward. Jumper pads position can be inverted with a parameter.
		//
		//  In its default configuration, labels are positioned below the pins, when the
		//  component is oriented verically and pointing upwards, or right of the pins, when oriented
		//  horizontally and oriented leftward. Labels position can be inverted with a parameter.
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    include_traces: default is true
		//      if true it will include traces that connect the jumper pads to the vias
		//      and the through-holes for the MCU
		//    gnd_trace_width: default is 0.250mm
		//      allows to override the GND trace width. Not recommended to go below 0.25mm (JLCPC
		//      min is 0.127mm).
		//    signal_trace_width: default is 0.250mm
		//      allows to override the trace width that connects the jumper pads to the SDA, and SCL.
		//      Not recommended to go below 0.15mm (JLCPC min is 0.127mm).
		//    invert_jumpers_position default is false
		//      allows to change the position of the jumper pads, from their default to the opposite
		//      side of the pins. See the description above for more details.
		//    invert_labels_position default is false
		//      allows to change the position of the labels, from their default to the north
		//      side of the pins. See the description above for more details.
		//    include_silkscreen: default is true
		//      if true it will include the silkscreen layer.
		//    include_labels default is true
		//      if true and Silkscreen layer is included, it will include the pin labels. The labels
		//      will match the *opposite* side of the board when the footprint is set to be reversible, 
		//      since they are meant to match the solder jumpers behavior and aid testing.
		//    include_courtyard: default is true
		//      if true it will include a courtyard outline around the pin header.
		//
		// # Placement and soldering of jumpers
		//
		// The reversible footprint is meant to be used with jumpers on the
		// OPPOSITE side of where the display is installed. The silkscreen
		// labels will also match the board when read on the opposite side.
		// This is to have all jumpers and components to solder on the same
		// side, and be able to read the correct labels of the display to do
		// tests with a multimeter.

		display_ssd1306 = {
		  params: {
		    designator: 'DISP',
		    side: 'F',
		    reversible: false,
		    include_traces: true,
		    gnd_trace_width: 0.25,
		    signal_trace_width: 0.25,
		    invert_jumpers_position: false,
		    invert_labels_position: false,
		    include_silkscreen: true,
		    include_labels: true,
		    include_courtyard: true,
		    SDA: { type: 'net', value: 'SDA' },
		    SCL: { type: 'net', value: 'SCL' },
		    VCC: { type: 'net', value: 'VCC' },
		    GND: { type: 'net', value: 'GND' },
		  },
		  body: p => {
		    let dst_nets = [
		      p.SDA,
		      p.SCL,
		      p.VCC,
		      p.GND,
		    ];

		    let local_nets = [
		      p.local_net("1"),
		      p.local_net("2"),
		      p.local_net("3"),
		      p.local_net("4"),
		    ];

		    if (p.reversible || p.side == "B") {
		      dst_nets = dst_nets.slice().reverse();
		    }
		    let socket_nets = p.reversible ? local_nets : dst_nets;

		    let jumpers_offset = 0;
		    let labels_offset = 3.75;

		    let jumpers_front_top = dst_nets;
		    let jumpers_front_bottom = local_nets;
		    let jumpers_back_top = dst_nets;
		    let jumpers_back_bottom = local_nets.slice().reverse();

		    if (p.invert_labels_position) {
		      if(p.reversible && !p.invert_jumpers_position) {
		          labels_offset = -1.62;
		      } else {
		        labels_offset = 0;
		      }
		    } else {
		      if(p.reversible && p.invert_jumpers_position) {
		        labels_offset = 1.62 + 3.75;
		      }
		    }
		    if (p.invert_jumpers_position) {
		      jumpers_offset = 4.4;

		      jumpers_front_top = local_nets;
		      jumpers_front_bottom = dst_nets;
		      jumpers_back_top = local_nets.slice().reverse();
		      jumpers_back_bottom = dst_nets;
		    }

		    const top = `
  (footprint "ceoloide:display_ssd1306"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 20 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
		(attr exclude_from_pos_files exclude_from_bom)
    `;
		    
		    const front_silkscreen = `
    (fp_line (start 5.14 15.37) (end 5.14 18.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 5.14 15.37) (end -5.14 15.37) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 5.14 18.03) (end -5.14 18.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -5.14 15.37) (end -5.14 18.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    `;
		    
		    const front_courtyard = `
    (fp_line (start 5.61 14.9) (end 5.61 18.45) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start 5.61 18.45) (end -5.61 18.45) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -5.61 18.45) (end -5.61 14.9) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -5.61 14.9) (end 5.61 14.9) (layer "F.CrtYd") (stroke (width 0.15) (type solid)))
    `;
		    
		    const front_fab = `
    (fp_line (start -3.77 -11.14) (end -3.77 11.24) (layer "F.Fab") (stroke (width 0.15) (type solid)))
    (fp_line (start 1.75 -11.14) (end 1.75 11.24) (layer "F.Fab") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.77 -11.14) (end 1.75 -11.14) (layer "F.Fab") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.77 11.24) (end 1.75 11.24) (layer "F.Fab") (stroke (width 0.15) (type solid)))
    `;

		    const front_jumpers = `
    (pad "14" smd rect (at -3.81 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[0].str})
    (pad "15" smd rect (at -1.27 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[1].str})
    (pad "16" smd rect (at 1.27 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[2].str})
    (pad "17" smd rect (at 3.81 ${14.05 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_top[3].str})

    (pad "10" smd rect (at -3.81 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[0].str})
    (pad "11" smd rect (at -1.27 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[1].str})
    (pad "12" smd rect (at 1.27 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[2].str})
    (pad "13" smd rect (at 3.81 ${14.95 + jumpers_offset} ${90 + p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${jumpers_front_bottom[3].str})
    `;

		    const back_silkscreen = `
    (fp_line (start 5.14 15.37) (end 5.14 18.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 5.14 15.37) (end -5.14 15.37) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 5.14 18.03) (end -5.14 18.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -5.14 15.37) (end -5.14 18.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    `;

		    const back_courtyard = `
    (fp_line (start 5.61 14.9) (end 5.61 18.45) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start 5.61 18.45) (end -5.61 18.45) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -5.61 18.45) (end -5.61 14.9) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    (fp_line (start -5.61 14.9) (end 5.61 14.9) (layer "B.CrtYd") (stroke (width 0.15) (type solid)))
    `;
		    
		    const back_fab = `
    (fp_line (start 3.77 -11.14) (end 3.77 11.24) (layer "B.Fab") (stroke (width 0.15) (type solid)))
    (fp_line (start -1.75 -11.14) (end -1.75 11.24) (layer "B.Fab") (stroke (width 0.15) (type solid)))
    (fp_line (start 3.77 -11.14) (end -1.75 -11.14) (layer "B.Fab") (stroke (width 0.15) (type solid)))
    (fp_line (start 3.77 11.24) (end -1.75 11.24) (layer "B.Fab") (stroke (width 0.15) (type solid)))
    `;

		    const back_jumpers = `
    (pad "24" smd rect (at 3.81 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[0].str})
    (pad "25" smd rect (at 1.27 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[1].str})
    (pad "26" smd rect (at -1.27 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[2].str})
    (pad "27" smd rect (at -3.81 ${14.05 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_top[3].str})

    (pad "20" smd rect (at 3.81 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[0].str})
    (pad "21" smd rect (at 1.27 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[1].str})
    (pad "22" smd rect (at -1.27 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[2].str})
    (pad "23" smd rect (at -3.81 ${14.95 + jumpers_offset} ${270 + p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${jumpers_back_bottom[3].str})
    `;

		    const silkscreen_labels_front = `
    (fp_text user "${dst_nets[0].name}" (at -3.81 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position  ? "right" : "left"}))
    )
    (fp_text user "${dst_nets[1].name}" (at -1.27 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "right" : "left"}))
    )
    (fp_text user "${dst_nets[2].name}" (at 1.27 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "right" : "left"}))
    )
    (fp_text user "${dst_nets[3].name}" (at 3.81 ${14.75 + labels_offset} ${90 + p.r}) (unlocked yes) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "right" : "left"}))
    )
    `;
		    const silkscreen_labels_back = `
    (fp_text user "${p.reversible ? dst_nets[0].name : dst_nets[3].name}" (at 3.81 ${14.75 + labels_offset} ${90 + p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    (fp_text user "${p.reversible ? dst_nets[1].name : dst_nets[2].name}" (at 1.27 ${14.75 + labels_offset} ${90 + p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    (fp_text user "${p.reversible ? dst_nets[2].name : dst_nets[1].name}" (at -1.27 ${14.75 + labels_offset} ${90 + p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    (fp_text user "${p.reversible ? dst_nets[3].name : dst_nets[0].name}" (at -3.81 ${14.75 + labels_offset} ${90 + p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify ${!p.invert_labels_position ? "left" : "right"} mirror))
    )
    `;

		    const bottom = `
    (pad "1" thru_hole oval (at -3.81 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[0].str})
    (pad "2" thru_hole oval (at -1.27 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[1].str})
    (pad "3" thru_hole oval (at 1.27 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[2].str})
    (pad "4" thru_hole oval (at 3.81 16.7 ${270 + p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${socket_nets[3].str})

    (fp_line (start -6.00 -19.70) (end -6.00 18.30) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 6.00 -19.70) (end 6.00 18.30) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.00 -19.70) (end 6.00 -19.70) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.00 -17.45) (end 6.00 -17.45) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.00 18.30) (end 6.00 18.30) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -6.00 12.55) (end 6.00 12.55) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
  )
    `;

		    const traces_bottom = `
  (segment (start ${p.eaxy(-3.81, 16.7)}) (end ${p.eaxy(-3.81, 18.45)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-1.27, 16.7)}) (end ${p.eaxy(-1.27, 18.45)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(1.27, 16.7)}) (end ${p.eaxy(1.27, 18.45)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[2].index}))
  (segment (start ${p.eaxy(3.81, 16.7)}) (end ${p.eaxy(3.81, 18.45)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[3].index}))
  (segment (start ${p.eaxy(-3.81, 16.7)}) (end ${p.eaxy(-3.81, 18.45)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-1.27, 16.7)}) (end ${p.eaxy(-1.27, 18.45)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(1.27, 16.7)}) (end ${p.eaxy(1.27, 18.45)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${socket_nets[2].index}))
  (segment (start ${p.eaxy(3.81, 16.7)}) (end ${p.eaxy(3.81, 18.45)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[3].index}))
    `;

		    const traces_top = `
  (segment (start ${p.eaxy(-3.81, 16.7)}) (end ${p.eaxy(-3.81, 14.95)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-1.27, 16.7)}) (end ${p.eaxy(-1.27, 14.95)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(1.27, 16.7)}) (end ${p.eaxy(1.27, 14.95)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[2].index}))
  (segment (start ${p.eaxy(3.81, 16.7)}) (end ${p.eaxy(3.81, 14.95)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${socket_nets[3].index}))
  (segment (start ${p.eaxy(-3.81, 16.7)}) (end ${p.eaxy(-3.81, 14.95)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[0].index}))
  (segment (start ${p.eaxy(-1.27, 16.7)}) (end ${p.eaxy(-1.27, 14.95)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[1].index}))
  (segment (start ${p.eaxy(1.27, 16.7)}) (end ${p.eaxy(1.27, 14.95)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${socket_nets[2].index}))
  (segment (start ${p.eaxy(3.81, 16.7)}) (end ${p.eaxy(3.81, 14.95)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${socket_nets[3].index}))
    `;

		    let final = top;

		    if (p.side == "F" || p.reversible) {
		      final += front_fab;
		      if (p.include_silkscreen) {
		        final += front_silkscreen;
		        if (p.include_labels) final += silkscreen_labels_front;
		      }
		      if (p.include_courtyard) final += front_courtyard;
		    }
		    if (p.side == "B" || p.reversible) {
		      final += back_fab;
		      if (p.include_silkscreen) {
		        final += back_silkscreen;
		        if (p.include_labels) final += silkscreen_labels_back;
		      }
		      if (p.include_courtyard) final += back_courtyard;
		    }
		    if (p.reversible) {
		      final += front_jumpers;
		      final += back_jumpers;
		    }
		    final += bottom;
		    if (p.include_traces && p.reversible) {
		      if (p.invert_jumpers_position) {
		        final += traces_bottom;
		      } else {
		        final += traces_top;
		      }
		    }
		    return final;
		  }
		};
		return display_ssd1306;
	}

	var led_sk6812miniE;
	var hasRequiredLed_sk6812miniE;

	function requireLed_sk6812miniE () {
		if (hasRequiredLed_sk6812miniE) return led_sk6812miniE;
		hasRequiredLed_sk6812miniE = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @ceoloide
		//
		// Description:
		//  Reversible footprint for "YS-SK6812mini-e" LEDs, to be used either as per-key lightning or
		//  underglow. The footprint allows many customizations, including pre-defined traces to
		//  simplify routing.
		//
		//  These LEDs are very tolerant of undervoltage, and are easy to solder thanks to the side
		//  legs.
		//
		// Datasheet:
		//  https://datasheet.lcsc.com/lcsc/2305101623_OPSCO-Optoelectronics-SK6812MINI-E_C5149201.pdf
		//
		// Nets:
		//    P1: corresponds to VCC pin
		//    P2: corresponds to Data-Out pin
		//    P3: corresponds to GND pin
		//    P4: corresponds to Data-In pin
		//
		// Params:
		//    side: default is B for Back
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    reverse_mount: default is true (per-key LED)
		//      if true, the pads will be oriented so that the LED shines through ther PCB, i.e.
		//      when used for per-key LEDs. When set to false, the pads will match the datasheet
		//      and assume the LED shines away from the PCB, i.e. when used as underglow. Note that
		//      automated PCB assembly may not support both options depending on the component reel
		//    include_traces_vias: default is true
		//      if true it will include traces and vias to simplify routing when the footprint is
		//      made reversible
		//    signal_trace_width: default is 0.250mm
		//      allows to override the trace width that connects the DIN / DOUT pads. Not recommended
		//      to go below 0.15mm (JLCPC min is 0.127mm)
		//    gnd_trace_width: default is 0.250mm
		//      allows to override the GND trace width. Not recommended to go below 0.25mm (JLCPC
		//      min is 0.127mm). Do not exceed 0.8mm to avoid clearance errors
		//    vcc_trace_width: default is 0.250mm
		//      allows to override the VCC trace width. Not recommended to go below 0.25mm (JLCPC
		//      min is 0.127mm). Do not exceed 0.8mm to avoid clearance errors
		//    via_size: default is 0.8
		//      allows to define the size of the via. Not recommended below 0.56 (JLCPCB minimum),
		//      or above 0.8 (KiCad default), to avoid overlap or DRC errors
		//    via_drill: default is 0.4
		//      allows to define the size of the drill. Not recommended below 0.3 (JLCPCB minimum),
		//      or above 0.4 (KiCad default), to avoid overlap or DRC errors 
		//    include_courtyard: default is true
		//      if true it will include the part courtyard
		//    include_keepout: default is false
		//      if true it will include the part keepout area
		//    led_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    led_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    led_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    led_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.

		led_sk6812miniE = {
		  params: {
		    designator: 'LED',
		    side: 'B',
		    reversible: false,
		    reverse_mount: true,
		    include_traces_vias: true,
		    signal_trace_width: 0.25,
		    gnd_trace_width: 0.25,
		    vcc_trace_width: 0.25,
		    via_size: 0.8,
		    via_drill: 0.4,
		    include_courtyard: true,
		    include_keepout: false,
		    led_3dmodel_filename: '',
		    led_3dmodel_xyz_offset: [0, 0, 0],
		    led_3dmodel_xyz_rotation: [0, 0, 0],
		    led_3dmodel_xyz_scale: [1, 1, 1],
		    P1: { type: 'net', value: 'VCC' },
		    P2: undefined,
		    P3: { type: 'net', value: 'GND' },
		    P4: undefined,
		  },
		  body: p => {
		    const standard_opening = `
  (footprint "ceoloide:led_SK6812mini-e (${p.reverse_mount ? "per-key" : "underglow"}${p.reversible ? ", reversible" : "single-side"})" 
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at -4.75 0 ${90 + p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr smd)

    (fp_line (start -1.6 -1.4) (end 1.6 -1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.6 1.4) (end 1.6 1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.6 -1.4) (end -1.6 1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 1.6 -1.4) (end 1.6 1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.6 -1.05) (end -2.94 -1.05) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.94 -1.05) (end -2.94 -0.37) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.94 -0.37) (end -1.6 -0.37) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.6 0.35) (end -2.94 0.35) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.94 1.03) (end -1.6 1.03) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -2.94 0.35) (end -2.94 1.03) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 1.6 1.03) (end 2.94 1.03) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.94 0.35) (end 1.6 0.35) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.94 1.03) (end 2.94 0.35) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 1.6 -0.37) (end 2.94 -0.37) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.94 -1.05) (end 1.6 -1.05) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 2.94 -0.37) (end 2.94 -1.05) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    `;
		    const marks_reversed = `
    (fp_line (start -0.8 -1.4) (end -0.8 1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 0.8 -1.4) (end 0.8 1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start -1 -1.4) (end -1 1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start 1 -1.4) (end 1 1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    `;
		    const marks_straight = `
    (fp_line (start -1.6 -0.7) (end -0.8 -1.4) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    `;
		    const front_reversed = `
    (fp_line (start -3.8 1.6) (end -2.2 1.6) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -3.8 0) (end -3.8 1.6) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (pad "4" smd rect (at -2.7 -0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P4.str})
    (pad "3" smd rect (at -2.7 0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P3.str})
    (pad "1" smd rect (at 2.7 -0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P1.str})
    (pad "2" smd rect (at 2.7 0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P2.str})
    `;
		    const front = `
    (fp_line (start -3.8 -1.6) (end -2.2 -1.6) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -3.8 0) (end -3.8 -1.6) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (pad "4" smd rect (at -2.70 0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P4.str})
    (pad "3" smd rect (at -2.70 -0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P3.str})
    (pad "1" smd rect (at 2.70 0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P1.str})
    (pad "2" smd rect (at 2.70 -0.7 ${p.r}) (size 1.4 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.P2.str})
    `;
		    const back_reversed = `
    (fp_line (start -3.8 -1.6) (end -2.2 -1.6) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -3.8 0) (end -3.8 -1.6) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (pad "2" smd rect (at 2.70 -0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P2.str})
    (pad "1" smd rect (at 2.70 0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P1.str})
    (pad "3" smd rect (at -2.70 -0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P3.str})
    (pad "4" smd rect (at -2.70 0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P4.str})
    `;
		    const back = `
    (fp_line (start -3.8 1.6) (end -2.2 1.6) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -3.8 0) (end -3.8 1.6) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (pad "2" smd rect (at 2.70 0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P2.str})
    (pad "1" smd rect (at 2.70 -0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P1.str})
    (pad "3" smd rect (at -2.70 0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P3.str})
    (pad "4" smd rect (at -2.70 -0.7 ${p.r}) (size 1.4 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.P4.str})
    `;
		    const standard_closing = `
    (fp_rect (start -1.8 -1.55) (end 1.8 1.55) (layer "Edge.Cuts") (stroke (width 0.12) (type solid)) (fill none))
  )
    `;

		    const traces_vias_reversed = `
  ${'' /* VCC Trace */}
  (segment (start ${p.eaxy(3.4, -0.7)}) (end ${p.eaxy(4.06, -0.105916)}) (width ${p.vcc_trace_width}) (layer "F.Cu") (net ${p.P1.index}))
  (segment (start ${p.eaxy(4.06, -0.105916)}) (end ${p.eaxy(4.06, 0.7)}) (width ${p.vcc_trace_width}) (layer "F.Cu") (net ${p.P1.index}))
  (segment (start ${p.eaxy(2.7, -0.7)}) (end ${p.eaxy(3.4, -0.7)}) (width ${p.vcc_trace_width}) (layer "F.Cu") (net ${p.P1.index}))
  (via (at ${p.eaxy(4.06, 0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P1.index}))
  (segment (start ${p.eaxy(2.7, 0.7)}) (end ${p.eaxy(4.06, 0.7)}) (width ${p.vcc_trace_width}) (layer "B.Cu") (net ${p.P1.index}))
  ${'' /* Data signal out trace */}
  (segment (start ${p.eaxy(4.95, -0.7)}) (end ${p.eaxy(2.7, -0.7)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P2.index}))
  (via (at ${p.eaxy(4.95, -0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(2.7, 0.7)}) (end ${p.eaxy(3.481, 1.485)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(3.481, 1.485)}) (end ${p.eaxy(4.529, 1.485)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(4.95, 1.06)}) (end ${p.eaxy(4.95, -0.7)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(4.529, 1.485)}) (end ${p.eaxy(4.95, 1.06)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P2.index}))
  ${'' /* GND Trace */}
  (segment (start ${p.eaxy(-3.4, -0.7)}) (end ${p.eaxy(-4.06, -0.105916)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${p.P3.index}))
  (segment (start ${p.eaxy(-4.06, -0.105916)}) (end ${p.eaxy(-4.06, 0.7)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${p.P3.index}))
  (segment (start ${p.eaxy(-2.7, -0.7)}) (end ${p.eaxy(-3.4, -0.7)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${p.P3.index}))
  (via (at ${p.eaxy(-4.06, 0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P3.index}))
  (segment (start ${p.eaxy(-2.7, 0.7)}) (end ${p.eaxy(-4.06, 0.7)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${p.P3.index}))
  ${'' /* Data signal in trace */}
  (segment (start ${p.eaxy(-4.95, -0.7)}) (end ${p.eaxy(-2.7, -0.7)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P4.index}))
  (via (at ${p.eaxy(-4.95, -0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-2.7, 0.7)}) (end ${p.eaxy(-3.481, 1.485)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-3.481, 1.485)}) (end ${p.eaxy(-4.529, 1.485)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-4.95, 1.06)}) (end ${p.eaxy(-4.95, -0.7)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-4.529, 1.485)}) (end ${p.eaxy(-4.95, 1.06)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P4.index}))
    `;

		    const traces_vias_straight = `
  ${'' /* VCC Trace */}
  (segment (start ${p.eaxy(3.4, -0.7)}) (end ${p.eaxy(4.06, -0.105916)}) (width ${p.vcc_trace_width}) (layer "B.Cu") (net ${p.P1.index}))
  (segment (start ${p.eaxy(4.06, -0.105916)}) (end ${p.eaxy(4.06, 0.7)}) (width ${p.vcc_trace_width}) (layer "B.Cu") (net ${p.P1.index}))
  (segment (start ${p.eaxy(2.7, -0.7)}) (end ${p.eaxy(3.4, -0.7)}) (width ${p.vcc_trace_width}) (layer "B.Cu") (net ${p.P1.index}))
  (via (at ${p.eaxy(4.06, 0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P1.index}))
  (segment (start ${p.eaxy(2.7, 0.7)}) (end ${p.eaxy(4.06, 0.7)}) (width ${p.vcc_trace_width}) (layer "F.Cu") (net ${p.P1.index}))
  ${'' /* Data signal out trace */}
  (segment (start ${p.eaxy(4.95, -0.7)}) (end ${p.eaxy(2.7, -0.7)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P2.index}))
  (via (at ${p.eaxy(4.95, -0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(2.7, 0.7)}) (end ${p.eaxy(3.481, 1.485)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(3.481, 1.485)}) (end ${p.eaxy(4.529, 1.485)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(4.95, 1.06)}) (end ${p.eaxy(4.95, -0.7)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P2.index}))
  (segment (start ${p.eaxy(4.529, 1.485)}) (end ${p.eaxy(4.95, 1.06)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P2.index}))
  ${'' /* GND Trace */}
  (segment (start ${p.eaxy(-3.4, -0.7)}) (end ${p.eaxy(-4.06, -0.105916)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${p.P3.index}))
  (segment (start ${p.eaxy(-4.06, -0.105916)}) (end ${p.eaxy(-4.06, 0.7)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${p.P3.index}))
  (segment (start ${p.eaxy(-2.7, -0.7)}) (end ${p.eaxy(-3.4, -0.7)}) (width ${p.gnd_trace_width}) (layer "F.Cu") (net ${p.P3.index}))
  (via (at ${p.eaxy(-4.06, 0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P3.index}))
  (segment (start ${p.eaxy(-2.7, 0.7)}) (end ${p.eaxy(-4.06, 0.7)}) (width ${p.gnd_trace_width}) (layer "B.Cu") (net ${p.P3.index}))
  ${'' /* Data signal in trace */}
  (segment (start ${p.eaxy(-4.95, -0.7)}) (end ${p.eaxy(-2.7, -0.7)}) (width ${p.signal_trace_width}) (layer "B.Cu") (net ${p.P4.index}))
  (via (at ${p.eaxy(-4.95, -0.7)}) (size ${p.via_size}) (drill ${p.via_drill}) (layers "F.Cu" "B.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-2.7, 0.7)}) (end ${p.eaxy(-3.481, 1.485)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-3.481, 1.485)}) (end ${p.eaxy(-4.529, 1.485)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-4.95, 1.06)}) (end ${p.eaxy(-4.95, -0.7)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P4.index}))
  (segment (start ${p.eaxy(-4.529, 1.485)}) (end ${p.eaxy(-4.95, 1.06)}) (width ${p.signal_trace_width}) (layer "F.Cu") (net ${p.P4.index}))
    `;

		    const courtyard_front = `
    (fp_poly
      (pts
        (xy 1.6 -1.05)
        (xy 2.94 -1.05)
        (xy 2.94 -0.37)
        (xy 1.6 -0.37)
        (xy 1.6 0.35)
        (xy 2.94 0.35)
        (xy 2.94 1.03)
        (xy 1.6 1.03)
        (xy 1.6 1.4)
        (xy -1.6 1.4)
        (xy -1.6 1.03)
        (xy -2.94 1.03)
        (xy -2.94 0.35)
        (xy -1.6 0.35)
        (xy -1.6 -0.37)
        (xy -2.94 -0.37)
        (xy -2.94 -1.05)
        (xy -1.6 -1.05)
        (xy -1.6 -1.4)
        (xy 1.6 -1.4)
      )
			(stroke
				(width 0.1)
				(type solid)
			)
      (layer "B.CrtYd")
    )
    `;

		    const courtyard_back = `
    (fp_poly
      (pts
        (xy 1.6 -1.05)
        (xy 2.94 -1.05)
        (xy 2.94 -0.37)
        (xy 1.6 -0.37)
        (xy 1.6 0.35)
        (xy 2.94 0.35)
        (xy 2.94 1.03)
        (xy 1.6 1.03)
        (xy 1.6 1.4)
        (xy -1.6 1.4)
        (xy -1.6 1.03)
        (xy -2.94 1.03)
        (xy -2.94 0.35)
        (xy -1.6 0.35)
        (xy -1.6 -0.37)
        (xy -2.94 -0.37)
        (xy -2.94 -1.05)
        (xy -1.6 -1.05)
        (xy -1.6 -1.4)
        (xy 1.6 -1.4)
      )
			(stroke
				(width 0.1)
				(type solid)
			)
      (layer "B.CrtYd")
    )
    `;

		    const keepout = `
  (zone
    (net 0)
    (net_name "")
    (layers "F&B.Cu")
    (hatch edge 0.3)
    (connect_pads (clearance 0))
    (min_thickness 0.25)
		(filled_areas_thickness no)
		(keepout
			(tracks not_allowed)
			(vias not_allowed)
			(pads allowed)
			(copperpour not_allowed)
			(footprints allowed)
		)
		(fill
			(thermal_gap 0.5)
			(thermal_bridge_width 0.5)
		)
    (polygon
      (pts
        (xy ${p.eaxy(-2, -1.85)})
        (xy ${p.eaxy(2.00, -1.85)})
        (xy ${p.eaxy(2.00, 1.85)})
        (xy ${p.eaxy(-2, 1.85)})
      )
    )
  )
    `;

		    const led_3dmodel = `
    (model ${p.led_3dmodel_filename}
      (offset (xyz ${p.led_3dmodel_xyz_offset[0]} ${p.led_3dmodel_xyz_offset[1]} ${p.led_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.led_3dmodel_xyz_scale[0]} ${p.led_3dmodel_xyz_scale[1]} ${p.led_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.led_3dmodel_xyz_rotation[0]} ${p.led_3dmodel_xyz_rotation[1]} ${p.led_3dmodel_xyz_rotation[2]}))
    )
      `;

		    let final = standard_opening;

		    if (p.side == "F" || p.reversible) {
		      if (p.reverse_mount) {
		        final += marks_reversed;
		        final += front_reversed;
		      } else {
		        final += marks_straight;
		        final += front;
		      }
		      if (p.include_courtyard) {
		        final += courtyard_front;
		      }
		    }
		    if (p.side == "B" || p.reversible) {
		      if (p.reverse_mount) {
		        final += back_reversed;
		        final += marks_reversed;
		      } else {
		        final += marks_straight;
		        final += back;
		      }
		      if (p.include_courtyard) {
		        final += courtyard_back;
		      }
		    }

		    if (p.led_3dmodel_filename) {
		      final += led_3dmodel;
		    }

		    final += standard_closing;
		    if (p.include_keepout) {
		      final += keepout;
		    }
		    if (p.reversible && p.include_traces_vias) {
		      if (p.reverse_mount) {
		        final += traces_vias_reversed;
		      } else {
		        final += traces_vias_straight;
		      }
		    }

		    return final;
		  }
		};
		return led_sk6812miniE;
	}

	var mcu_nice_nano;
	var hasRequiredMcu_nice_nano;

	function requireMcu_nice_nano () {
		if (hasRequiredMcu_nice_nano) return mcu_nice_nano;
		hasRequiredMcu_nice_nano = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Author: @infused-kim + @ceoloide improvements
		//
		// Description:
		//  A single-side or reversible footprint for the nice!nano (or any pro-micro compatible
		//  controller) that uses jumpers instead of two socket rows to be reversible.
		//
		//  Note that the extra pins are *ONLY* compatible with nice!nano boards and not with
		//  clones like the Supermini, which has pins in a slightly different position.
		//
		//  This is a re-implementation of the promicro_pretty footprint made popular
		//  by @benvallack.
		//
		// Pinout and schematics:
		//  https://nicekeyboards.com/docs/nice-nano/pinout-schematic
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    reverse_mount: default is false (MCU facing away from the PCB)
		//      if true, the sockets will be oriented so that the MCU faces the PCB (RAW / B+ is the
		//      top left pin). This is the most common mounting option for the nice!nano.
		//      When set to false, the pads will match the datasheet and assume the MCU faces away
		//      from the PCB (RAW / B+ is the top right pin).
		//    include_traces: default is true
		//      if true it will include traces that connect the jumper pads to the vias
		//      and the through-holes for the MCU
		//    include_extra_pins: default is false
		//      if true and if not reversible it will include nice!nano extra pin sockets (P1.01,
		//      P1.02, P1.07)
		//    only_required_jumpers: default is false
		//      if true, it will only place jumpers on the first 4 rows of pins, which can't be
		//      reversed in firmware, i.e. RAW and P1, GND and P0, GND and RST, GND and VCC.
		//    use_rectangular_jumpers: default is false
		//      if true, it will replace chevron-style jumpers with rectangual pads
		//    via_size: default is 0.8
		//      allows to define the size of the via. Not recommended below 0.56 (JLCPCB minimum),
		//      or above 0.8 (KiCad default), to avoid overlap or DRC errors.
		//    via_drill: default is 0.4
		//      allows to define the size of the drill. Not recommended below 0.3 (JLCPCB minimum),
		//      or above 0.4 (KiCad default), to avoid overlap or DRC errors. 
		//    Pxx_label, VCC_label, RAW_label, GND_label, RST_label: default is ''
		//      allows to override the label for each pin
		//    mcu_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    mcu_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    mcu_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    mcu_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//
		// @infused-kim's improvements:
		//  - Use real traces instead of pads, which gets rid of hundreds of DRC errors.
		//  - Leave more space between the vias to allow easier routing through the middle
		//    of the footprint
		//
		// @ceoloide's improvements:
		//  - Move vias closer to the pads to clear up more space for silkscreen
		//  - Add ability to use rectangular jumpers instead of chevron-style
		//  - Add ability to control via size, to free up space for routing if needed
		//  - Add ability to only have required jumpers and let the rest be handled in firmware
		//  - Add single side (non-reversible) support
		//  - Add ability to mount with MCU facing towards or away from PCB
		//  - Add ability to show silkscreen labels on both sides for single side footprint
		//  - Add extra pins (P1.01, P1.02, P1.07) when footprint is single-side or reversible
		//    (only required jumpers)
		//  - Upgrade to KiCad 8
		//
		// # Placement and soldering of jumpers
		//
		// The reversible footprint is meant to be used with jumpers on the
		// OPPOSITE side of where the nice!nano (or pro-micro compatible board) is
		// installed. The silkscreen labels will also match the board when read on
		// the opposite side. This is to have all jumpers and components to solder on
		// the same side, and be able to read the correct labels of the MCU to do
		// tests with a multimeter.
		//
		// # Further credits
		//
		// The original footprint was created from scratch by @infused-kim, but was based on the ideas from
		// these other footprints:
		//
		// https://github.com/Albert-IV/ergogen-contrib/blob/main/src/footprints/promicro_pretty.js
		// https://github.com/50an6xy06r6n/keyboard_reversible.pretty

		mcu_nice_nano = {
		  params: {
		    designator: 'MCU',
		    side: 'F',
		    reversible: false,
		    reverse_mount: false,
		    include_traces: true,
		    include_extra_pins: false,
		    invert_jumpers_position: false,
		    only_required_jumpers: false,
		    use_rectangular_jumpers: false,
		    via_size: 0.8, // JLCPC min is 0.56 for 1-2 layer boards, KiCad defaults to 0.8
		    via_drill: 0.4, // JLCPC min is 0.3 for 1-2 layer boards, KiCad defaults to 0.4

		    show_instructions: true,
		    show_silk_labels: true,
		    show_silk_labels_on_both_sides: false,
		    show_via_labels: true,

		    mcu_3dmodel_filename: '',
		    mcu_3dmodel_xyz_offset: [0, 0, 0],
		    mcu_3dmodel_xyz_rotation: [0, 0, 0],
		    mcu_3dmodel_xyz_scale: [1, 1, 1],

		    RAW_label: '',
		    GND_label: '',
		    RST_label: '',
		    VCC_label: '',
		    P21_label: '',
		    P20_label: '',
		    P19_label: '',
		    P18_label: '',
		    P15_label: '',
		    P14_label: '',
		    P16_label: '',
		    P10_label: '',

		    P1_label: '',
		    P0_label: '',
		    P2_label: '',
		    P3_label: '',
		    P4_label: '',
		    P5_label: '',
		    P6_label: '',
		    P7_label: '',
		    P8_label: '',
		    P9_label: '',

		    P101_label: '',
		    P102_label: '',
		    P107_label: '',

		    RAW: { type: 'net', value: 'RAW' },
		    GND: { type: 'net', value: 'GND' },
		    RST: { type: 'net', value: 'RST' },
		    VCC: { type: 'net', value: 'VCC' },
		    P21: { type: 'net', value: 'P21' },
		    P20: { type: 'net', value: 'P20' },
		    P19: { type: 'net', value: 'P19' },
		    P18: { type: 'net', value: 'P18' },
		    P15: { type: 'net', value: 'P15' },
		    P14: { type: 'net', value: 'P14' },
		    P16: { type: 'net', value: 'P16' },
		    P10: { type: 'net', value: 'P10' },

		    P1: { type: 'net', value: 'P1' },
		    P0: { type: 'net', value: 'P0' },
		    P2: { type: 'net', value: 'P2' },
		    P3: { type: 'net', value: 'P3' },
		    P4: { type: 'net', value: 'P4' },
		    P5: { type: 'net', value: 'P5' },
		    P6: { type: 'net', value: 'P6' },
		    P7: { type: 'net', value: 'P7' },
		    P8: { type: 'net', value: 'P8' },
		    P9: { type: 'net', value: 'P9' },

		    P101: { type: 'net', value: 'P101' },
		    P102: { type: 'net', value: 'P102' },
		    P107: { type: 'net', value: 'P107' },
		  },
		  body: p => {
		    const get_pin_net_name = (p, pin_name) => {
		      return p[pin_name].name;
		    };

		    const get_pin_net_str = (p, pin_name) => {
		      return p[pin_name].str;
		    };

		    const get_pin_label_override = (p, pin_name) => {
		      let prop_name = `${pin_name}_label`;
		      return p[prop_name];
		    };

		    const get_pin_label = (p, pin_name) => {
		      let label = get_pin_label_override(p, pin_name);
		      if (label == '') {
		        label = get_pin_net_name(p, pin_name);
		      }

		      if (label === undefined) {
		        label = '""';
		      }

		      return label;
		    };

		    const gen_traces_row = (row_num) => {
		      const traces = `
  (segment (start ${p.eaxy((p.use_rectangular_jumpers ? 4.58 : 4.775), -12.7 + (row_num * 2.54))}) (end ${p.eaxy(3.4, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))
  (segment (start ${p.eaxy((p.use_rectangular_jumpers ? -4.58 : -4.775), -12.7 + (row_num * 2.54))}) (end ${p.eaxy(-3.4, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))

  (segment (start ${p.eaxy(-7.62, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(-5.5, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))
  (segment (start ${p.eaxy(-7.62, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(-5.5, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(5.5, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(7.62, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))
  (segment (start ${p.eaxy(7.62, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(5.5, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "B.Cu"))

  (segment (start ${p.eaxy(-2.604695, 0.23 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(3.17, 0.23 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-4.775, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-4.425305, 0 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-3.700305, 0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-3.099695, 0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-4.425305, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-3.700305, 0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-3.099695, 0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-2.604695, 0.23 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))

  (segment (start ${p.eaxy(4.775, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(4.425305, 0 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(2.594695, -0.22 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-3.18, -0.22 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(4.425305, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(3.700305, -0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(3.700305, -0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(3.099695, -0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(3.099695, -0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(2.594695, -0.22 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
        `;

		      return traces
		    };

		    const gen_traces = () => {
		      let traces = '';
		      for (let i = 0; i < 12; i++) {
		        if (i < 4 || !p.only_required_jumpers) {
		          let row_traces = gen_traces_row(i);
		          traces += row_traces;
		        }
		      }

		      return traces
		    };

		    const invert_pins = (p.side == 'B' && !p.reverse_mount && !p.reversible) || (p.side == 'F' && p.reverse_mount && !p.reversible) || (!p.reverse_mount && p.reversible);

		    const gen_socket_row = (row_num, pin_name_left, pin_name_right, show_via_labels, show_silk_labels) => {
		      const row_offset_y = 2.54 * row_num;

		      const socket_hole_num_left = 24 - row_num;
		      const socket_hole_num_right = 1 + row_num;
		      const via_num_left = 124 - row_num;
		      const via_num_right = 101 + row_num;

		      const net_left = get_pin_net_str(p, pin_name_left);
		      const net_right = get_pin_net_str(p, pin_name_right);
		      const via_label_left = get_pin_label(p, pin_name_left);
		      const via_label_right = get_pin_label(p, pin_name_right);

		      // These are the silkscreen labels that will be printed on the PCB.
		      // If the footprint is reversible, they will be aligned with the pins
		      // on the opposite side of where the MCU board is mounted.
		      const net_silk_front_left = via_label_left;
		      const net_silk_front_right = via_label_right;
		      const net_silk_back_left = via_label_right;
		      const net_silk_back_right = via_label_left;

		      let socket_row_base = `
    ${''/* Socket Holes */}
    (pad "${socket_hole_num_left}" thru_hole circle (at -7.62 ${ -12.7 + row_offset_y} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? p.local_net(socket_hole_num_left).str : net_left})
    (pad "${socket_hole_num_right}" thru_hole circle (at 7.62 ${ -12.7 + row_offset_y} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? p.local_net(socket_hole_num_right).str : net_right})
      `;
		      let socket_row_vias = `
    ${''/* Inside VIAS */}
    (pad "${via_num_left}" thru_hole circle (at -3.4 ${ -12.7 + row_offset_y} ${p.r}) (size ${p.via_size} ${p.via_size}) (drill ${p.via_drill}) (layers "*.Cu" "*.Mask") ${net_left})
    (pad "${via_num_right}" thru_hole circle (at 3.4 ${ -12.7 + row_offset_y} ${p.r}) (size ${p.via_size} ${p.via_size}) (drill ${p.via_drill}) (layers "*.Cu" "*.Mask") ${net_right})
      `;

		      let socket_row_rectangular_jumpers = `
    ${''/* Jumper Pads - Front Left */}
    (pad "${socket_hole_num_left}" smd rect (at -5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_left).str})
    (pad "${via_num_left}" smd rect (at -4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_left})

    ${''/* Jumper Pads - Front Right */}
    (pad "${via_num_right}" smd rect (at 4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_right})
    (pad "${socket_hole_num_right}" smd rect (at 5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_right).str})

    ${''/* Jumper Pads - Back Left */}
    (pad "${socket_hole_num_left}" smd rect (at -5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_left).str})
    (pad "${via_num_right}" smd rect (at -4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_right})

    ${''/* Jumper Pads - Back Right */}
    (pad "${via_num_left}" smd rect (at 4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_left})
    (pad "${socket_hole_num_right}" smd rect (at 5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_right).str})
        `;

		      let socket_row_chevron_jumpers = `
    ${''/* Jumper Pads - Front Left */}
    (pad "${socket_hole_num_left}" smd custom (at -5.5 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_left).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0) (fill yes))
    ))
    (pad "${via_num_left}" smd custom (at -4.775 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_left}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))

    ${''/* Jumper Pads - Front Right */}
    (pad "${via_num_right}" smd custom (at 4.775 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_right}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))
    (pad "${socket_hole_num_right}" smd custom (at 5.5 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_right).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0) (fill yes))
    ))

    ${''/* Jumper Pads - Back Left */}
    (pad "${socket_hole_num_left}" smd custom (at -5.5 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_left).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
      ) (width 0) (fill yes))
    ))

    (pad "${via_num_right}" smd custom (at -4.775 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_right}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))

    ${''/* Jumper Pads - Back Right */}
    (pad "${via_num_left}" smd custom (at 4.775 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_left}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))
    (pad "${socket_hole_num_right}" smd custom (at 5.5 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_right).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
      ) (width 0) (fill yes))
    ))
        `;
		      let socket_row = socket_row_base;
		      if (p.reversible && (row_num < 4 || !p.only_required_jumpers)) {
		        socket_row += socket_row_vias;
		        if (p.use_rectangular_jumpers) {
		          socket_row += socket_row_rectangular_jumpers;
		        } else {
		          socket_row += socket_row_chevron_jumpers;
		        }
		      }
		      if (show_silk_labels == true) {
		        if (p.reversible || p.show_silk_labels_on_both_sides || p.side == 'F') {
		          // Silkscreen labels - front
		          if (row_num != 9
		            || !p.include_extra_pins
		            || (p.include_extra_pins && invert_pins && !p.reversible) 
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_front_left}" (at -${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_front_left.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
            `;
		          }
		          if (row_num != 9 
		            || !p.include_extra_pins
		            || (p.include_extra_pins && !invert_pins && !p.reversible)
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_front_right}" (at ${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_front_right.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
            `;
		          }
		        }
		        if (p.reversible|| p.show_silk_labels_on_both_sides || p.side == 'B') {
		          // Silkscreen labels - back
		          if (row_num != 9 
		            || !p.include_extra_pins
		            || (p.include_extra_pins && !invert_pins && !p.reversible) 
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_back_left}" (at ${p.reversible ? '-' : ''}${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_back_left.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
            `;
		          }
		          if (row_num != 9 
		            || !p.include_extra_pins
		            || (p.include_extra_pins && invert_pins && !p.reversible) 
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_back_right}" (at ${p.reversible ? '' : '-'}${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_back_right.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
            `;
		          }
		        }
		      }

		      if (show_via_labels && (p.reversible && (row_num < 4 || !p.only_required_jumpers))) {
		        socket_row += `
    ${''/* Via Labels - Front */}
    (fp_text user "${via_label_left}" (at -3.262 ${ -13.5 + row_offset_y} ${p.r}) (layer "F.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)))
    )
    (fp_text user "${via_label_right}" (at 3.262 ${ -13.5 + row_offset_y} ${p.r}) (layer "F.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)))
    )

    ${''/* Via Labels - Back */}
    (fp_text user "${via_label_left}" (at -3.262 ${ -13.5 + row_offset_y} ${180 + p.r}) (layer "B.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
    )
    (fp_text user "${via_label_right}" (at 3.262 ${ -13.5 + row_offset_y} ${180 + p.r}) (layer "B.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
    )
          `;
		      }

		      return socket_row
		    };
		    const gen_socket_rows = (show_via_labels, show_silk_labels) => {
		      const pin_names = [
		        // The pin matrix below assumes PCB is mounted with the MCU
		        // facing away from the PCB (reverse_mount = false) on the
		        // Front side. It should be inverted for reverse_mount = true
		        // or when mounted on teh Back
		        ['P1', 'RAW'],
		        ['P0', 'GND'],
		        ['GND', 'RST'],
		        ['GND', 'VCC'],
		        ['P2', 'P21'],
		        ['P3', 'P20'],
		        ['P4', 'P19'],
		        ['P5', 'P18'],
		        ['P6', 'P15'],
		        ['P7', 'P14'],
		        ['P8', 'P16'],
		        ['P9', 'P10'],
		      ];

		      let socket_rows = '';
		      for (let i = 0; i < pin_names.length; i++) {
		        let pin_name_left = pin_names[i][invert_pins ? 1 : 0];
		        let pin_name_right = pin_names[i][invert_pins ? 0 : 1];

		        const socket_row = gen_socket_row(
		          i, pin_name_left, pin_name_right,
		          show_via_labels, show_silk_labels
		        );

		        socket_rows += socket_row;
		      }
		      // Socket silkscreen
		      // P1 / D1 / P0.06 is marked according to orientation
		      if (show_silk_labels == true) {
		        if (p.reversible || p.show_silk_labels_on_both_sides || p.side == 'F') {
		          socket_rows += `
    (fp_line (start 6.29 -14.03) (end 8.95 -14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 16.57) (end 8.95 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 -14.03) (end -6.29 -14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 16.57) (end -6.29 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start ${invert_pins ? '' : '-'}6.29 -11.43) (end ${invert_pins ? '' : '-'}8.95 -11.43) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            `;
		        }
		        if (p.reversible || p.show_silk_labels_on_both_sides || p.side == 'B') {
		          socket_rows += `
    (fp_line (start -6.29 -14.03) (end -8.95 -14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 16.57) (end -8.95 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 -14.03) (end 6.29 -14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 16.57) (end 6.29 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start ${invert_pins ? (p.reversible ? '-' : '') : (p.reversible ? '' : '-')}8.95 -11.43) (end ${invert_pins ? (p.reversible ? '-' : '') : (p.reversible ? '' : '-')}6.29 -11.43) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
          `;
		        }
		      }
		      return socket_rows
		    };

		    const common_top = `
  (footprint "ceoloide:mcu_nice_nano"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 -15 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr exclude_from_pos_files exclude_from_bom)

    ${''/* USB socket outline */}
    (fp_line (start 3.556 -18.034) (end 3.556 -16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.81 -16.51) (end -3.81 -18.034) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.81 -18.034) (end 3.556 -18.034) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))


  ${''/* Controller outline */}
    (fp_line (start -8.89 -16.51) (end 8.89 -16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -8.89 -16.51) (end -8.89 16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 8.89 -16.51) (end 8.89 16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -8.89 16.57) (end 8.89 16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    `;

		    const instructions = `
    (fp_text user "R hand back side (M${!p.reverse_mount ? '↑' : '↓'})" (at 0 -15.245 ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user "L hand back side (M${!p.reverse_mount ? '↑' : '↓'})" (at 0 -15.245 ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    `;

		    const socket_rows = gen_socket_rows(
		      p.show_via_labels, p.show_silk_labels
		    );
		    const traces = gen_traces();

		    const extra_pins = `
    (pad "25" thru_hole circle (at ${invert_pins ? '' : '-'}5.08 10.16 ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P101})
    (pad "26" thru_hole circle (at ${invert_pins ? '' : '-'}2.54 10.16 ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P102})
    (pad "27" thru_hole circle (at 0 10.16 ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P107})
    `;
		    const extra_pins_reversible = `
    (pad "28" thru_hole circle (at ${invert_pins ? '-' : ''}5.08 10.16 ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P101})
    (pad "29" thru_hole circle (at ${invert_pins ? '-' : ''}2.54 10.16 ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P102})
    `;

		    const mcu_3dmodel = `
    (model ${p.mcu_3dmodel_filename}
      (offset (xyz ${p.mcu_3dmodel_xyz_offset[0]} ${p.mcu_3dmodel_xyz_offset[1]} ${p.mcu_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.mcu_3dmodel_xyz_scale[0]} ${p.mcu_3dmodel_xyz_scale[1]} ${p.mcu_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.mcu_3dmodel_xyz_rotation[0]} ${p.mcu_3dmodel_xyz_rotation[1]} ${p.mcu_3dmodel_xyz_rotation[2]}))
    )
    `;

		    return `
    ${''/* Controller*/}
    ${common_top}
    ${socket_rows}
    ${p.include_extra_pins && (!p.reversible || (p.reversible && p.only_required_jumpers)) ? extra_pins : ''}
    ${p.include_extra_pins && p.reversible && p.only_required_jumpers ? extra_pins_reversible : ''}
    ${p.reversible && p.show_instructions ? instructions : ''}
    ${p.mcu_3dmodel_filename ? mcu_3dmodel : ''}
  )

  ${''/* Traces */}
  ${p.reversible && p.include_traces ? traces : ''}
    `;
		  }
		};
		return mcu_nice_nano;
	}

	var mcu_supermini_nrf52840;
	var hasRequiredMcu_supermini_nrf52840;

	function requireMcu_supermini_nrf52840 () {
		if (hasRequiredMcu_supermini_nrf52840) return mcu_supermini_nrf52840;
		hasRequiredMcu_supermini_nrf52840 = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Author: @infused-kim + @ceoloide improvements
		//
		// Description:
		//  A single-side or reversible footprint for the SuperMini NRF52840 (or any
		//  pro-micro compatible controller) that uses jumpers instead of two socket
		//  rows to be reversible.
		//
		//  Note that the extra pins are *ONLY* compatible with SuperMini NRF52840
		//  board and not with the Nice!Nano, which has pins in a slightly different position.
		//
		//  This is a re-implementation of the promicro_pretty footprint made popular
		//  by @benvallack, adapted to match the SuperMini extra pin position.
		//
		// Pinout and schematics:
		//  https://wiki.icbbuy.com/doku.php?id=developmentboard:nrf52840
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    reverse_mount: default is false (MCU facing away from the PCB)
		//      if true, the sockets will be oriented so that the MCU faces the PCB (RAW / B+ is the
		//      top left pin). This is the most common mounting option for the SuperMini.
		//      When set to false, the pads will match the datasheet and assume the MCU faces away
		//      from the PCB (RAW / B+ is the top right pin).
		//    include_traces: default is true
		//      if true it will include traces that connect the jumper pads to the vias
		//      and the through-holes for the MCU
		//    include_extra_pins: default is false
		//      if true and if not reversible it will include SuperMini extra pin sockets (P1.01,
		//      P1.02, P1.07). If the board is reversible, extra pins will be added only if the
		//      flag `only_required_jumpers` is set to true, and only P1.01 and P1.02 will be
		//      added to avoid overlap of P1.07.
		//    only_required_jumpers: default is false
		//      if true, it will only place jumpers on the first 4 rows of pins, which can't be
		//      reversed in firmware, i.e. RAW and P1, GND and P0, GND and RST, GND and VCC.
		//    use_rectangular_jumpers: default is false
		//      if true, it will replace chevron-style jumpers with rectangual pads
		//    via_size: default is 0.8
		//      allows to define the size of the via. Not recommended below 0.56 (JLCPCB minimum),
		//      or above 0.8 (KiCad default), to avoid overlap or DRC errors.
		//    via_drill: default is 0.4
		//      allows to define the size of the drill. Not recommended below 0.3 (JLCPCB minimum),
		//      or above 0.4 (KiCad default), to avoid overlap or DRC errors. 
		//    Pxx_label, VCC_label, RAW_label, GND_label, RST_label: default is ''
		//      allows to override the label for each pin
		//    mcu_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    mcu_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    mcu_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    mcu_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//
		// @infused-kim's improvements:
		//  - Use real traces instead of pads, which gets rid of hundreds of DRC errors.
		//  - Leave more space between the vias to allow easier routing through the middle
		//    of the footprint
		//
		// @ceoloide's improvements:
		//  - Move vias closer to the pads to clear up more space for silkscreen
		//  - Add ability to use rectangular jumpers instead of chevron-style
		//  - Add ability to control via size, to free up space for routing if needed
		//  - Add ability to only have required jumpers and let the rest be handled in firmware
		//  - Add single side (non-reversible) support
		//  - Add ability to mount with MCU facing towards or away from PCB
		//  - Add ability to show silkscreen labels on both sides for single side footprint
		//  - Add extra pins (P1.01, P1.02, P1.07) when footprint is single-side or reversible
		//    (only required jumpers)
		//  - Upgrade to KiCad 8
		//  - Adapted to match the SuperMini extra pin positions
		//
		// # Placement and soldering of jumpers
		//
		// The reversible footprint is meant to be used with jumpers on the
		// OPPOSITE side of where the SuperMini (or pro-micro compatible board) is
		// installed. The silkscreen labels will also match the board when read on
		// the opposite side. This is to have all jumpers and components to solder on
		// the same side, and be able to read the correct labels of the MCU to do
		// tests with a multimeter.
		//
		// # Further credits
		//
		// The original footprint was created from scratch by @infused-kim, but was based on the ideas from
		// these other footprints:
		//
		// https://github.com/Albert-IV/ergogen-contrib/blob/main/src/footprints/promicro_pretty.js
		// https://github.com/50an6xy06r6n/keyboard_reversible.pretty

		mcu_supermini_nrf52840 = {
		  params: {
		    designator: 'MCU',
		    side: 'F',
		    reversible: false,
		    reverse_mount: false,
		    include_traces: true,
		    include_extra_pins: false,
		    invert_jumpers_position: false,
		    only_required_jumpers: false,
		    use_rectangular_jumpers: false,
		    via_size: 0.8, // JLCPC min is 0.56 for 1-2 layer boards, KiCad defaults to 0.8
		    via_drill: 0.4, // JLCPC min is 0.3 for 1-2 layer boards, KiCad defaults to 0.4

		    show_instructions: true,
		    show_silk_labels: true,
		    show_silk_labels_on_both_sides: false,
		    show_via_labels: true,

		    mcu_3dmodel_filename: '',
		    mcu_3dmodel_xyz_offset: [0, 0, 0],
		    mcu_3dmodel_xyz_rotation: [0, 0, 0],
		    mcu_3dmodel_xyz_scale: [1, 1, 1],

		    RAW_label: '',
		    GND_label: '',
		    RST_label: '',
		    VCC_label: '',
		    P21_label: '',
		    P20_label: '',
		    P19_label: '',
		    P18_label: '',
		    P15_label: '',
		    P14_label: '',
		    P16_label: '',
		    P10_label: '',

		    P1_label: '',
		    P0_label: '',
		    P2_label: '',
		    P3_label: '',
		    P4_label: '',
		    P5_label: '',
		    P6_label: '',
		    P7_label: '',
		    P8_label: '',
		    P9_label: '',

		    P101_label: '',
		    P102_label: '',
		    P107_label: '',

		    RAW: { type: 'net', value: 'RAW' },
		    GND: { type: 'net', value: 'GND' },
		    RST: { type: 'net', value: 'RST' },
		    VCC: { type: 'net', value: 'VCC' },
		    P21: { type: 'net', value: 'P21' },
		    P20: { type: 'net', value: 'P20' },
		    P19: { type: 'net', value: 'P19' },
		    P18: { type: 'net', value: 'P18' },
		    P15: { type: 'net', value: 'P15' },
		    P14: { type: 'net', value: 'P14' },
		    P16: { type: 'net', value: 'P16' },
		    P10: { type: 'net', value: 'P10' },

		    P1: { type: 'net', value: 'P1' },
		    P0: { type: 'net', value: 'P0' },
		    P2: { type: 'net', value: 'P2' },
		    P3: { type: 'net', value: 'P3' },
		    P4: { type: 'net', value: 'P4' },
		    P5: { type: 'net', value: 'P5' },
		    P6: { type: 'net', value: 'P6' },
		    P7: { type: 'net', value: 'P7' },
		    P8: { type: 'net', value: 'P8' },
		    P9: { type: 'net', value: 'P9' },

		    P101: { type: 'net', value: 'P101' },
		    P102: { type: 'net', value: 'P102' },
		    P107: { type: 'net', value: 'P107' },
		  },
		  body: p => {
		    const get_pin_net_name = (p, pin_name) => {
		      return p[pin_name].name;
		    };

		    const get_pin_net_str = (p, pin_name) => {
		      return p[pin_name].str;
		    };

		    const get_pin_label_override = (p, pin_name) => {
		      let prop_name = `${pin_name}_label`;
		      return p[prop_name];
		    };

		    const get_pin_label = (p, pin_name) => {
		      let label = get_pin_label_override(p, pin_name);
		      if (label == '') {
		        label = get_pin_net_name(p, pin_name);
		      }

		      if (label === undefined) {
		        label = '""';
		      }

		      return label;
		    };

		    const gen_traces_row = (row_num) => {
		      const traces = `
  (segment (start ${p.eaxy((p.use_rectangular_jumpers ? 4.58 : 4.775), -12.7 + (row_num * 2.54))}) (end ${p.eaxy(3.4, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))
  (segment (start ${p.eaxy((p.use_rectangular_jumpers ? -4.58 : -4.775), -12.7 + (row_num * 2.54))}) (end ${p.eaxy(-3.4, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))

  (segment (start ${p.eaxy(-7.62, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(-5.5, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))
  (segment (start ${p.eaxy(-7.62, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(-5.5, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(5.5, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(7.62, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "F.Cu"))
  (segment (start ${p.eaxy(7.62, -12.7 + (row_num * 2.54))}) (end ${p.eaxy(5.5, -12.7 + (row_num * 2.54))}) (width 0.25) (layer "B.Cu"))

  (segment (start ${p.eaxy(-2.604695, 0.23 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(3.17, 0.23 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-4.775, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-4.425305, 0 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-3.700305, 0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-3.099695, 0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-4.425305, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-3.700305, 0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(-3.099695, 0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-2.604695, 0.23 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))

  (segment (start ${p.eaxy(4.775, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(4.425305, 0 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(2.594695, -0.22 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(-3.18, -0.22 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(4.425305, 0 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(3.700305, -0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(3.700305, -0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(3.099695, -0.725 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
  (segment (start ${p.eaxy(3.099695, -0.725 + (row_num * 2.54) - 12.7)}) (end ${p.eaxy(2.594695, -0.22 + (row_num * 2.54) - 12.7)}) (width 0.25) (layer "B.Cu"))
        `;

		      return traces
		    };

		    const gen_traces = () => {
		      let traces = '';
		      for (let i = 0; i < 12; i++) {
		        if (i < 4 || !p.only_required_jumpers) {
		          let row_traces = gen_traces_row(i);
		          traces += row_traces;
		        }
		      }

		      return traces
		    };

		    const invert_pins = (p.side == 'B' && !p.reverse_mount && !p.reversible) || (p.side == 'F' && p.reverse_mount && !p.reversible) || (!p.reverse_mount && p.reversible);

		    const gen_socket_row = (row_num, pin_name_left, pin_name_right, show_via_labels, show_silk_labels) => {
		      const row_offset_y = 2.54 * row_num;

		      const socket_hole_num_left = 24 - row_num;
		      const socket_hole_num_right = 1 + row_num;
		      const via_num_left = 124 - row_num;
		      const via_num_right = 101 + row_num;

		      const net_left = get_pin_net_str(p, pin_name_left);
		      const net_right = get_pin_net_str(p, pin_name_right);
		      const via_label_left = get_pin_label(p, pin_name_left);
		      const via_label_right = get_pin_label(p, pin_name_right);

		      // These are the silkscreen labels that will be printed on the PCB.
		      // If the footprint is reversible, they will be aligned with the pins
		      // on the opposite side of where the MCU board is mounted.
		      const net_silk_front_left = via_label_left;
		      const net_silk_front_right = via_label_right;
		      const net_silk_back_left = via_label_right;
		      const net_silk_back_right = via_label_left;

		      let socket_row_base = `
    ${''/* Socket Holes */}
    (pad "${socket_hole_num_left}" thru_hole circle (at -7.62 ${ -12.7 + row_offset_y} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? p.local_net(socket_hole_num_left).str : net_left})
    (pad "${socket_hole_num_right}" thru_hole circle (at 7.62 ${ -12.7 + row_offset_y} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? p.local_net(socket_hole_num_right).str : net_right})
      `;
		      let socket_row_vias = `
    ${''/* Inside VIAS */}
    (pad "${via_num_left}" thru_hole circle (at -3.4 ${ -12.7 + row_offset_y} ${p.r}) (size ${p.via_size} ${p.via_size}) (drill ${p.via_drill}) (layers "*.Cu" "*.Mask") ${net_left})
    (pad "${via_num_right}" thru_hole circle (at 3.4 ${ -12.7 + row_offset_y} ${p.r}) (size ${p.via_size} ${p.via_size}) (drill ${p.via_drill}) (layers "*.Cu" "*.Mask") ${net_right})
      `;

		      let socket_row_rectangular_jumpers = `
    ${''/* Jumper Pads - Front Left */}
    (pad "${socket_hole_num_left}" smd rect (at -5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_left).str})
    (pad "${via_num_left}" smd rect (at -4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_left})

    ${''/* Jumper Pads - Front Right */}
    (pad "${via_num_right}" smd rect (at 4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_right})
    (pad "${socket_hole_num_right}" smd rect (at 5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_right).str})

    ${''/* Jumper Pads - Back Left */}
    (pad "${socket_hole_num_left}" smd rect (at -5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_left).str})
    (pad "${via_num_right}" smd rect (at -4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_right})

    ${''/* Jumper Pads - Back Right */}
    (pad "${via_num_left}" smd rect (at 4.58 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_left})
    (pad "${socket_hole_num_right}" smd rect (at 5.48 ${ -12.7 + row_offset_y} ${p.r}) (size 0.6 1.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_right).str})
        `;

		      let socket_row_chevron_jumpers = `
    ${''/* Jumper Pads - Front Left */}
    (pad "${socket_hole_num_left}" smd custom (at -5.5 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_left).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0) (fill yes))
    ))
    (pad "${via_num_left}" smd custom (at -4.775 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_left}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))

    ${''/* Jumper Pads - Front Right */}
    (pad "${via_num_right}" smd custom (at 4.775 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${net_right}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))
    (pad "${socket_hole_num_right}" smd custom (at 5.5 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.local_net(socket_hole_num_right).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0) (fill yes))
    ))

    ${''/* Jumper Pads - Back Left */}
    (pad "${socket_hole_num_left}" smd custom (at -5.5 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_left).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
      ) (width 0) (fill yes))
    ))

    (pad "${via_num_right}" smd custom (at -4.775 ${ -12.7 + row_offset_y} ${p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_right}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))

    ${''/* Jumper Pads - Back Right */}
    (pad "${via_num_left}" smd custom (at 4.775 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${net_left}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0) (fill yes))
    ))
    (pad "${socket_hole_num_right}" smd custom (at 5.5 ${ -12.7 + row_offset_y} ${180 + p.r}) (size 0.2 0.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.local_net(socket_hole_num_right).str}
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts
          (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
      ) (width 0) (fill yes))
    ))
        `;
		      let socket_row = socket_row_base;
		      if (p.reversible && (row_num < 4 || !p.only_required_jumpers)) {
		        socket_row += socket_row_vias;
		        if (p.use_rectangular_jumpers) {
		          socket_row += socket_row_rectangular_jumpers;
		        } else {
		          socket_row += socket_row_chevron_jumpers;
		        }
		      }
		      if (show_silk_labels == true) {
		        if (p.reversible || p.show_silk_labels_on_both_sides || p.side == 'F') {
		          // Silkscreen labels - front
		          if (row_num != 10 
		            || !p.include_extra_pins
		            || (p.include_extra_pins && invert_pins && !p.reversible) 
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_front_left}" (at -${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_front_left.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
            `;
		          }
		          if (row_num != 10 
		            || !p.include_extra_pins
		            || (p.include_extra_pins && !invert_pins && !p.reversible) 
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_front_right}" (at ${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_front_right.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
            `;
		          }
		        }
		        if (p.reversible|| p.show_silk_labels_on_both_sides || p.side == 'B') {
		          // Silkscreen labels - back
		          if (row_num != 10
		            || !p.include_extra_pins
		            || (p.include_extra_pins && !invert_pins && !p.reversible) 
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_back_left}" (at ${p.reversible ? '-' : ''}${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_back_left.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
            `;
		          }
		          if (row_num != 10
		            || !p.include_extra_pins
		            || (p.include_extra_pins && invert_pins && !p.reversible) 
		            || (p.include_extra_pins && !p.only_required_jumpers && p.reversible)
		          ) {
		            socket_row += `
    (fp_text user "${net_silk_back_right}" (at ${p.reversible ? '' : '-'}${p.reversible && (row_num < 4 || !p.only_required_jumpers) ? (net_silk_back_right.length > 2 ? 1.45 : 2.04) : 4.47} ${ -12.7 + row_offset_y} ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
            `;
		          }
		        }
		      }

		      if (show_via_labels && (p.reversible && (row_num < 4 || !p.only_required_jumpers))) {
		        socket_row += `
    ${''/* Via Labels - Front */}
    (fp_text user "${via_label_left}" (at -3.262 ${ -13.5 + row_offset_y} ${p.r}) (layer "F.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)))
    )
    (fp_text user "${via_label_right}" (at 3.262 ${ -13.5 + row_offset_y} ${p.r}) (layer "F.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)))
    )

    ${''/* Via Labels - Back */}
    (fp_text user "${via_label_left}" (at -3.262 ${ -13.5 + row_offset_y} ${180 + p.r}) (layer "B.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
    )
    (fp_text user "${via_label_right}" (at 3.262 ${ -13.5 + row_offset_y} ${180 + p.r}) (layer "B.Fab")
      (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
    )
          `;
		      }

		      return socket_row
		    };
		    const gen_socket_rows = (show_via_labels, show_silk_labels) => {
		      const pin_names = [
		        // The pin matrix below assumes PCB is mounted with the MCU
		        // facing away from the PCB (reverse_mount = false) on the
		        // Front side. It should be inverted for reverse_mount = true
		        // or when mounted on teh Back
		        ['P1', 'RAW'],
		        ['P0', 'GND'],
		        ['GND', 'RST'],
		        ['GND', 'VCC'],
		        ['P2', 'P21'],
		        ['P3', 'P20'],
		        ['P4', 'P19'],
		        ['P5', 'P18'],
		        ['P6', 'P15'],
		        ['P7', 'P14'],
		        ['P8', 'P16'],
		        ['P9', 'P10'],
		      ];

		      let socket_rows = '';
		      for (let i = 0; i < pin_names.length; i++) {
		        let pin_name_left = pin_names[i][invert_pins ? 1 : 0];
		        let pin_name_right = pin_names[i][invert_pins ? 0 : 1];

		        const socket_row = gen_socket_row(
		          i, pin_name_left, pin_name_right,
		          show_via_labels, show_silk_labels
		        );

		        socket_rows += socket_row;
		      }
		      // Socket silkscreen
		      // P1 / D1 / P0.06 is marked according to orientation
		      if (show_silk_labels == true) {
		        if (p.reversible || p.show_silk_labels_on_both_sides || p.side == 'F') {
		          socket_rows += `
    (fp_line (start 6.29 -14.03) (end 8.95 -14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 16.57) (end 8.95 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 -14.03) (end -6.29 -14.03) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 16.57) (end -6.29 16.57) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start ${invert_pins ? '' : '-'}6.29 -11.43) (end ${invert_pins ? '' : '-'}8.95 -11.43) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            `;
		        }
		        if (p.reversible || p.show_silk_labels_on_both_sides || p.side == 'B') {
		          socket_rows += `
    (fp_line (start -6.29 -14.03) (end -8.95 -14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -6.29 16.57) (end -8.95 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 -14.03) (end 6.29 -14.03) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.95 16.57) (end 6.29 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start ${invert_pins ? (p.reversible ? '-' : '') : (p.reversible ? '' : '-')}8.95 -11.43) (end ${invert_pins ? (p.reversible ? '-' : '') : (p.reversible ? '' : '-')}6.29 -11.43) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
          `;
		        }
		      }
		      return socket_rows
		    };

		    const common_top = `
  (footprint "ceoloide:mcu_supermini_nrf52840"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 -15 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr exclude_from_pos_files exclude_from_bom)

    ${''/* USB socket outline */}
    (fp_line (start 3.556 -17.20) (end 3.556 -16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.81 -16.51) (end -3.81 -17.20) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -3.81 -17.20) (end 3.556 -17.20) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))


  ${''/* Controller outline */}
    (fp_line (start -8.89 -16.51) (end 8.89 -16.51) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -8.89 -16.51) (end -8.89 16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 8.89 -16.51) (end 8.89 16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -8.89 16.57) (end 8.89 16.57) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    `;

		    const instructions = `
    (fp_text user "R hand back side (M${!p.reverse_mount ? '↑' : '↓'})" (at 0 -15.245 ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user "L hand back side (M${!p.reverse_mount ? '↑' : '↓'})" (at 0 -15.245 ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    `;

		    const socket_rows = gen_socket_rows(
		      p.show_via_labels, p.show_silk_labels
		    );
		    const traces = gen_traces();

		    const extra_pins = `
    (pad "25" thru_hole circle (at ${invert_pins ? '' : '-'}4.54 ${ -13.2548 + 25.4} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P101})
    (pad "26" thru_hole circle (at ${invert_pins ? '' : '-'}2.00 ${ -13.2548 + 25.4} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P102})
    (pad "27" thru_hole circle (at ${invert_pins ? '-' : ''}0.54 ${ -13.2548 + 25.4} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P107})
    `;
		    const extra_pins_reversible = `
    (pad "25" thru_hole circle (at ${invert_pins ? '' : '-'}4.54 ${ -13.2548 + 25.4} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P101})
    (pad "26" thru_hole circle (at ${invert_pins ? '' : '-'}2.00 ${ -13.2548 + 25.4} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P102})
    (pad "28" thru_hole circle (at ${invert_pins ? '-' : ''}4.54 ${ -13.2548 + 25.4} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P101})
    (pad "29" thru_hole circle (at ${invert_pins ? '-' : ''}2.00 ${ -13.2548 + 25.4} ${p.r}) (size 1.7 1.7) (drill 1) (layers "*.Cu" "*.Mask") ${p.P102})
    `;

		    const mcu_3dmodel = `
    (model ${p.mcu_3dmodel_filename}
      (offset (xyz ${p.mcu_3dmodel_xyz_offset[0]} ${p.mcu_3dmodel_xyz_offset[1]} ${p.mcu_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.mcu_3dmodel_xyz_scale[0]} ${p.mcu_3dmodel_xyz_scale[1]} ${p.mcu_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.mcu_3dmodel_xyz_rotation[0]} ${p.mcu_3dmodel_xyz_rotation[1]} ${p.mcu_3dmodel_xyz_rotation[2]}))
    )
    `;

		    return `
    ${''/* Controller*/}
    ${common_top}
    ${socket_rows}
    ${p.include_extra_pins && !p.reversible ? extra_pins : ''}
    ${p.include_extra_pins && p.reversible && p.only_required_jumpers ? extra_pins_reversible : ''}
    ${p.reversible && p.show_instructions ? instructions : ''}
    ${p.mcu_3dmodel_filename ? mcu_3dmodel : ''}
  )

  ${''/* Traces */}
  ${p.reversible && p.include_traces ? traces : ''}
    `;
		  }
		};
		return mcu_supermini_nrf52840;
	}

	var mounting_hole_npth;
	var hasRequiredMounting_hole_npth;

	function requireMounting_hole_npth () {
		if (hasRequiredMounting_hole_npth) return mounting_hole_npth;
		hasRequiredMounting_hole_npth = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @ceoloide
		//
		// Description:
		//  A non-plated, mechanical through-hole to be used for screws, standoffs or
		//  other mounting options. Both the drill size and pad size can be independently
		//  defined.
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the footprint and designator, either F or B
		//    hole_size: default is 2.2mm for M2 screws
		//      the size of the pad around the hole
		//    hole_drill: default is 2.2mm for M2 screws
		//      the size of the hole to drill

		mounting_hole_npth = {
		  params: {
		    designator: 'MH',
		    side: 'F',
		    hole_size: '2.2',
		    hole_drill: '2.2',
		  },
		  body: p => `
  (footprint "ceoloide:mounting_hole_npth"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 2.55 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (pad "" np_thru_hole circle
      (at 0 0 ${p.r})
      (size ${p.hole_size} ${p.hole_size})
      (drill ${p.hole_drill})
      (layers "*.Cu" "*.Mask")
    )
  )
  `
		};
		return mounting_hole_npth;
	}

	var mounting_hole_plated;
	var hasRequiredMounting_hole_plated;

	function requireMounting_hole_plated () {
		if (hasRequiredMounting_hole_plated) return mounting_hole_plated;
		hasRequiredMounting_hole_plated = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Author: @infused-kim + @ceoloide improvements
		//
		// Description:
		//  A simple mounting hole with plated rim.
		//
		//  Note that some fine details may be lost depending on scale and fab capabilities.
		//
		// Params:
		//    side: default is F for Front
		//      The side on which to place the mounting hole.
		//    outline: default is 0.8 (mm)
		//      The width of the gold rim around the hole, in mm.
		//    drill: default is 2.2 (mm / M2 screw)
		//      The actual size for the hole. If drill_y is defined, it represents the
		//      horizontal width of an oval hole, in mm.
		//    drill_y: default is 0 (mm)
		//      The vertical height of an oval hole, in mm.
		//    include_courtyard: default is true
		//      if true it will include the part courtyard
		//
		//  @ceoloide's improvements:
		//    - Upgrade to KiCad 8
		//    - Minor footprint restructure

		mounting_hole_plated = {
		  params: {
		    designator: 'H',
		    side: 'F',
		    outline: 0.8,
		    drill: 2.2,
		    drill_y: 0,
		    include_courtyard: true,
		  },
		  body: p => {
		    if (p.drill_y == 0) {
		      p.drill_y = p.drill;
		    }

		    const size_x = p.drill + p.outline * 2;
		    const size_y = p.drill_y + p.outline * 2;

		    const courtyard_offset = 0.25;
		    const courtyard_x = size_x / 2 + courtyard_offset;
		    const courtyard_y = size_y / 2 + courtyard_offset;

		    const top = `
  (footprint "ceoloide:mounting_hole_plated"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 3 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    `;

		    const pad_circle = `
    (pad "" thru_hole circle (at 0 0 ${p.r}) (size ${size_x} ${size_y}) (drill ${p.drill}) (layers "*.Cu" "*.Mask"))
    `;
		    const courtyard_circle = `
    (fp_circle (center 0 0) (end -${courtyard_x} 0) (layer "F.CrtYd") (stroke (width 0.05) (type solid)) (fill none))
    (fp_circle (center 0 0) (end -${courtyard_x} 0) (layer "B.CrtYd") (stroke (width 0.05) (type solid)) (fill none))
    `;
		    const pad_oval = `
    (pad "" thru_hole oval (at 0 0 ${p.r}) (size ${size_x} ${size_y}) (drill oval ${p.drill} ${p.drill_y}) (layers "*.Cu" "*.Mask"))
    `;
		    const courtyard_oval = `
    (fp_line (start ${courtyard_x} -${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -${courtyard_x} -${courtyard_y}) (end -${courtyard_x} ${courtyard_y}) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -${courtyard_x} ${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -${courtyard_x} -${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -${courtyard_x} ${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -${courtyard_x} ${courtyard_y}) (end -${courtyard_x} -${courtyard_y}) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -${courtyard_x} -${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start ${courtyard_x} ${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    `;

		    const bottom = `
  )
    `;

		    let final = top;
		    if (size_x == size_y) {
		      final += pad_circle;
		      final += courtyard_circle;
		    } else {
		      final += pad_oval;
		      final += courtyard_oval;
		    }

		    final += bottom;

		    return final
		  }
		};
		return mounting_hole_plated;
	}

	var power_switch_smd_side;
	var hasRequiredPower_switch_smd_side;

	function requirePower_switch_smd_side () {
		if (hasRequiredPower_switch_smd_side) return power_switch_smd_side;
		hasRequiredPower_switch_smd_side = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Authors: @infused-kim + @ceoloide improvements
		//
		// Description:
		//  SMD side-operated on-off switch, compatible with Alps SSSS811101 as sold on
		//  Typeractive.xyz and LCSC. These switches are shorter than the height of hotswap sockets,
		//  so they can be mounted on the same side.
		//
		//  Should be compatible with:
		//    - G-Switch MK-12C02-G015 (untested)
		//    - PCM12SMTR (untested)
		//
		// Datasheet:
		//   https://cdn.shopify.com/s/files/1/0618/5674/3655/files/ALPS-SSSS811101.pdf?v=1670451309
		//
		// Nets:
		//    from: corresponds to pin 1 on the Front and 3 on the back
		//    to: corresponds to pin 2 on both sides
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F (Front)
		//      or B (Back)
		//    reversible: default is false
		//      if true, it will include pads on both Front and Back to make the footprint reversible
		//    invert_behavior: default is false
		//      if true, pin 3 will connect to the "from" net, and if false it will connect to pin 1,
		//      effectively inverting the behavior of the switch.
		//    include_silkscreen: default is true
		//      if true it will include silkscreen markings, which is recommended to know which side
		//      connects Bat+ to RAW.
		//    include_courtyard: default is false
		//      if true it will include the courtyard around the component
		//    switch_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    switch_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    switch_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    switch_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//
		// @ceoloide's improvements:
		//  - Add ability to set text on both sides
		//  - Add ability to adjust font thickness and size
		//  - Add ability to invert switch behavior / pin connections
		//  - Invert behavior on opposite layer to maintain consistency
		//  - Add on/off silkscreen to aid operation
		//  - Upgrade to KiCad 8

		power_switch_smd_side = {
		  params: {
		    designator: 'PWR',
		    side: 'F',
		    reversible: false,
		    invert_behavior: false,
		    include_silkscreen: true,
		    include_courtyard: false,
		    switch_3dmodel_filename: '',
		    switch_3dmodel_xyz_offset: [0, 0, 0],
		    switch_3dmodel_xyz_rotation: [0, 0, 0],
		    switch_3dmodel_xyz_scale: [1, 1, 1],
		    from: { type: 'net', value: 'BAT_P' },
		    to: { type: 'net', value: 'RAW' },
		  },
		  body: p => {
		    const common_start = `
  (footprint "ceoloide:power_switch_smd_side"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at -3.6 0 ${ -90 + p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr smd)
    `;
		    const silkscreen_front = `
    (fp_text user "ON" (at 0 ${p.invert_behavior ? '-' : ''}5 ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user "OFF" (at 0 ${p.invert_behavior ? '' : '-'}5 ${p.r}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_line (start 0.415 -3.45) (end -0.375 -3.45) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.375 3.45) (end 0.415 3.45) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.425 1.6) (end -1.425 -0.1) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 1.425 2.85) (end 1.425 -2.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.425 -1.4) (end -1.425 -1.6) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
    `;
		    const silkscreen_back = `
    (fp_text user "${p.ref}" (at -3.5 0 ${90 + p.r}) (layer "B.SilkS") ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user "ON" (at 0 ${p.invert_behavior ? '-' : ''}5 ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user "OFF" (at 0 ${p.invert_behavior ? '' : '-'}5 ${p.r}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_line (start -1.425 1.4) (end -1.425 1.6) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 0.415 3.45) (end -0.375 3.45) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -0.375 -3.45) (end 0.415 -3.45) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -1.425 -1.6) (end -1.425 0.1) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 1.425 -2.85) (end 1.425 2.85) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
    `;
		    const courtyard_front = `
    (fp_line (start 1.795 4.4) (end -2.755 4.4) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 1.795 1.65) (end 1.795 4.4) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 3.095 1.65) (end 1.795 1.65) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 3.095 -1.65) (end 3.095 1.65) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 1.795 -1.65) (end 3.095 -1.65) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 1.795 -4.4) (end 1.795 -1.65) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -2.755 -4.4) (end 1.795 -4.4) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -2.755 4.4) (end -2.755 -4.4) (layer "F.CrtYd") (stroke (width 0.05) (type solid)))
    `;
		    const courtyard_back = `
    (fp_line (start -2.755 -4.4) (end -2.755 4.4) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 3.095 1.65) (end 3.095 -1.65) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 1.795 1.65) (end 3.095 1.65) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 1.795 -4.4) (end -2.755 -4.4) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 1.795 -1.65) (end 1.795 -4.4) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 3.095 -1.65) (end 1.795 -1.65) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start 1.795 4.4) (end 1.795 1.65) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    (fp_line (start -2.755 4.4) (end 1.795 4.4) (layer "B.CrtYd") (stroke (width 0.05) (type solid)))
    `;

		    const pads_front = `
    (fp_line (start -1.305 -3.35) (end -1.305 3.35) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 1.295 -3.35) (end -1.305 -3.35) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 1.295 3.35) (end 1.295 -3.35) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -1.305 3.35) (end 1.295 3.35) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.595 0.1) (end 1.295 0.1) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.645 0.15) (end 2.595 0.1) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.845 0.35) (end 2.645 0.15) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.845 1.2) (end 2.845 0.35) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.645 1.4) (end 2.845 1.2) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 1.345 1.4) (end 2.645 1.4) (layer "F.Fab") (stroke (width 0.1) (type solid)))
    (pad "" smd rect (at 1.125 -3.65 ${90 + p.r}) (size 1 0.8) (layers "F.Cu" "F.Paste" "F.Mask"))
    (pad "" smd rect (at -1.085 -3.65 ${90 + p.r}) (size 1 0.8) (layers "F.Cu" "F.Paste" "F.Mask"))
    (pad "" smd rect (at -1.085 3.65 ${90 + p.r}) (size 1 0.8) (layers "F.Cu" "F.Paste" "F.Mask"))
    (pad "" smd rect (at 1.125 3.65 ${90 + p.r}) (size 1 0.8) (layers "F.Cu" "F.Paste" "F.Mask"))
    (pad "1" smd rect (at -1.735 2.25 ${90 + p.r}) (size 0.7 1.5) (layers "F.Cu" "F.Paste" "F.Mask") ${p.invert_behavior ? '' : p.from.str})
    (pad "2" smd rect (at -1.735 -0.75 ${90 + p.r}) (size 0.7 1.5) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to.str})
    (pad "3" smd rect (at -1.735 -2.25 ${90 + p.r}) (size 0.7 1.5) (layers "F.Cu" "F.Paste" "F.Mask") ${p.invert_behavior ? p.from.str : ''})
    `;
		    const pads_back = `
    (fp_line (start 2.595 -0.1) (end 1.295 -0.1) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -1.305 3.35) (end -1.305 -3.35) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.645 -0.15) (end 2.595 -0.1) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.845 -1.2) (end 2.845 -0.35) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 1.345 -1.4) (end 2.645 -1.4) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.845 -0.35) (end 2.645 -0.15) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 2.645 -1.4) (end 2.845 -1.2) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 1.295 -3.35) (end 1.295 3.35) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 1.295 3.35) (end -1.305 3.35) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -1.305 -3.35) (end 1.295 -3.35) (layer "B.Fab") (stroke (width 0.1) (type solid)))
    (pad "" smd rect (at -1.085 -3.65 ${270 + p.r}) (size 1 0.8) (layers "B.Cu" "B.Paste" "B.Mask"))
    (pad "" smd rect (at 1.125 -3.65 ${270 + p.r}) (size 1 0.8) (layers "B.Cu" "B.Paste" "B.Mask"))
    (pad "" smd rect (at -1.085 3.65 ${270 + p.r}) (size 1 0.8) (layers "B.Cu" "B.Paste" "B.Mask"))
    (pad "" smd rect (at 1.125 3.65 ${270 + p.r}) (size 1 0.8) (layers "B.Cu" "B.Paste" "B.Mask"))
    (pad "1" smd rect (at -1.735 -2.25 ${270 + p.r}) (size 0.7 1.5) (layers "B.Cu" "B.Paste" "B.Mask") ${p.invert_behavior ? p.from.str : ''})
    (pad "2" smd rect (at -1.735 0.75 ${270 + p.r}) (size 0.7 1.5) (layers "B.Cu" "B.Paste" "B.Mask") ${p.to.str})
    (pad "3" smd rect (at -1.735 2.25 ${270 + p.r}) (size 0.7 1.5) (layers "B.Cu" "B.Paste" "B.Mask") ${p.invert_behavior ? '' : p.from.str})
    `;
		    const common_end = `
    (pad "" np_thru_hole circle (at 0.025 -1.5 ${90 + p.r}) (size 0.9 0.9) (drill 0.9) (layers "*.Cu" "*.Mask"))
    (pad "" np_thru_hole circle (at 0.025 1.5 ${90 + p.r}) (size 0.9 0.9) (drill 0.9) (layers "*.Cu" "*.Mask"))
  )
    `;

		    const switch_3dmodel = `
    (model ${p.switch_3dmodel_filename}
      (offset (xyz ${p.switch_3dmodel_xyz_offset[0]} ${p.switch_3dmodel_xyz_offset[1]} ${p.switch_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.switch_3dmodel_xyz_scale[0]} ${p.switch_3dmodel_xyz_scale[1]} ${p.switch_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.switch_3dmodel_xyz_rotation[0]} ${p.switch_3dmodel_xyz_rotation[1]} ${p.switch_3dmodel_xyz_rotation[2]}))
    )
    `;

		    let final = common_start;
		    if (p.side == "F" || p.reversible) {
		      final += pads_front;
		      if (p.include_silkscreen) {
		        final += silkscreen_front;
		      }
		      if (p.include_courtyard) {
		        final += courtyard_front;
		      }
		    }
		    if (p.side == "B" || p.reversible) {
		      final += pads_back;
		      if (p.include_silkscreen) {
		        final += silkscreen_back;
		      }
		      if (p.include_courtyard) {
		        final += courtyard_back;
		      }
		    }

		    if (p.switch_3dmodel_filename) {
		      final += switch_3dmodel;
		    }

		    final += common_end;
		    return final;
		  }
		};
		return power_switch_smd_side;
	}

	var reset_switch_smd_side;
	var hasRequiredReset_switch_smd_side;

	function requireReset_switch_smd_side () {
		if (hasRequiredReset_switch_smd_side) return reset_switch_smd_side;
		hasRequiredReset_switch_smd_side = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @ceoloide
		//
		// Description:
		//   SMD side-operated momentary switch, compatible with Panasonic EVQ-PU[A|C|J|L]02K
		//   as sold on Typeractive.xyz https://typeractive.xyz/products/reset-button
		//   keebd.com https://keebd.com/products/reset-button-panasonic
		//   and LCSC. These switches are shorter than the height of hotswap
		//   sockets, so they can be mounted on the same side.
		//
		// Datasheet:
		//   https://cdn.shopify.com/s/files/1/0618/5674/3655/files/PANASONIC-EVQPUC02K.pdf?v=1670451309
		//
		// Nets:
		//    from: corresponds to pin 1 and 3
		//    to: corresponds to pin 2 and 4
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, it will include pads on both Front and Back to make the footprint reversible
		//    include_bosses: default is false
		//      if true it will include two mechanical NPTH for the switches that have them (EVQ-PUC02K
		//      and EVQ-PUL02K)
		//    include_silkscreen: default is true
		//      if true it will include silkscreen markings
		//    include_courtyard: default is false
		//      if true it will include the part courtyard
		//    reset_switch_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    reset_switch_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    reset_switch_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    reset_switch_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.

		reset_switch_smd_side = {
		  params: {
		    designator: 'RST',
		    side: 'F',
		    reversible: false,
		    include_bosses: false,
		    include_silkscreen: true,
		    include_courtyard: false,
		    reset_switch_3dmodel_filename: '',
		    reset_switch_3dmodel_xyz_offset: [0, 0, 0],
		    reset_switch_3dmodel_xyz_rotation: [0, 0, 0],
		    reset_switch_3dmodel_xyz_scale: [1, 1, 1],
		    from: { type: 'net', value: 'GND' },
		    to: { type: 'net', value: 'RST' },
		  },
		  body: p => {
		    const common_start = `
  (footprint "ceoloide:reset_switch_smd_side"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 0 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr smd)
    (fp_line (start -2.35 -1.75) (end -2.35 1.75) (stroke (width 0.1) (type solid)) (layer "Dwgs.User"))
    (fp_line (start -2.35 -1.75) (end 2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "Dwgs.User"))
    (fp_line (start -2.35 1.75) (end 2.35 1.75) (stroke (width 0.1) (type solid)) (layer "Dwgs.User"))
    (fp_line (start -1.3 -2.75) (end -1.3 -1.75) (stroke (width 0.1) (type solid)) (layer "Dwgs.User"))
    (fp_line (start -1.3 -2.75) (end 1.3 -2.75) (stroke (width 0.1) (type solid)) (layer "Dwgs.User"))
    (fp_line (start 1.3 -2.75) (end 1.3 -1.75) (stroke (width 0.1) (type solid)) (layer "Dwgs.User"))
    (fp_line (start 2.35 -1.75) (end 2.35 1.75) (stroke (width 0.1) (type solid)) (layer "Dwgs.User"))
    `;
		    const silkscreen_front = `
    (fp_line (start -2.35 -1.5) (end -2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    (fp_line (start -2.35 1.5) (end -2.35 1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    (fp_line (start -2.1 -1.75) (end -2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    (fp_line (start -2.1 1.75) (end -2.35 1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    (fp_line (start 2.1 -1.75) (end 2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    (fp_line (start 2.1 1.75) (end 2.35 1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    (fp_line (start 2.35 -1.5) (end 2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    (fp_line (start 2.35 1.5) (end 2.35 1.75) (stroke (width 0.1) (type solid)) (layer "F.SilkS"))
    `;
		    const silkscreen_back = `
    (fp_line (start -2.35 -1.5) (end -2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    (fp_line (start -2.35 1.5) (end -2.35 1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    (fp_line (start -2.1 -1.75) (end -2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    (fp_line (start -2.1 1.75) (end -2.35 1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    (fp_line (start 2.1 -1.75) (end 2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    (fp_line (start 2.1 1.75) (end 2.35 1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    (fp_line (start 2.35 -1.5) (end 2.35 -1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    (fp_line (start 2.35 1.5) (end 2.35 1.75) (stroke (width 0.1) (type solid)) (layer "B.SilkS"))
    `;
		    const pads_front = `
    (pad "1" smd rect (at 2.625 -0.85 ${180 + p.r}) (size 1.55 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from.str})
    (pad "2" smd rect (at 2.625 0.85 ${180 + p.r}) (size 1.55 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to.str})
    (pad "3" smd rect (at -2.625 -0.85 ${180 + p.r}) (size 1.55 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from.str})
    (pad "4" smd rect (at -2.625 0.85 ${180 + p.r}) (size 1.55 1) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to.str})
    `;
		    const pads_back = `
    (pad "1" smd rect (at -2.625 -0.85 ${180 + p.r}) (size 1.55 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from.str})
    (pad "2" smd rect (at -2.625 0.85 ${180 + p.r}) (size 1.55 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.to.str})
    (pad "3" smd rect (at 2.625 -0.85 ${180 + p.r}) (size 1.55 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from.str})
    (pad "4" smd rect (at 2.625 0.85 ${180 + p.r}) (size 1.55 1) (layers "B.Cu" "B.Paste" "B.Mask") ${p.to.str})
    `;
		    const courtyard_front = `
    (fp_rect (start 2.36 1.75) (end -2.36 -1.75) (stroke (width 0.05) (type solid)) (fill none) (layer "F.CrtYd"))
    `;
		    const courtyard_back = `
    (fp_rect (start 2.36 1.75) (end -2.36 -1.75) (stroke (width 0.05) (type solid)) (fill none) (layer "B.CrtYd"))
    `;
		    const bosses = `
    (pad "" np_thru_hole circle (at 0 -1.375 ${180 + p.r}) (size 0.75 0.75) (drill 0.75) (layers "*.Cu" "*.Mask"))
    (pad "" np_thru_hole circle (at 0 1.375 ${180 + p.r}) (size 0.75 0.75) (drill 0.75) (layers "*.Cu" "*.Mask"))
    `;

		    const reset_switch_3dmodel = `
    (model ${p.reset_switch_3dmodel_filename}
      (offset (xyz ${p.reset_switch_3dmodel_xyz_offset[0]} ${p.reset_switch_3dmodel_xyz_offset[1]} ${p.reset_switch_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.reset_switch_3dmodel_xyz_scale[0]} ${p.reset_switch_3dmodel_xyz_scale[1]} ${p.reset_switch_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.reset_switch_3dmodel_xyz_rotation[0]} ${p.reset_switch_3dmodel_xyz_rotation[1]} ${p.reset_switch_3dmodel_xyz_rotation[2]}))
    )
    `;

		    const common_end = `
  )
    `;

		    let final = common_start;
		    if (p.include_bosses) {
		      final += bosses;
		    }
		    if (p.side == "F" || p.reversible) {
		      final += pads_front;
		      if (p.include_silkscreen) {
		        final += silkscreen_front;
		      }
		      if (p.include_courtyard) {
		        final += courtyard_front;
		      }
		    }
		    if (p.side == "B" || p.reversible) {
		      final += pads_back;
		      if (p.include_silkscreen) {
		        final += silkscreen_back;
		      }
		      if (p.include_courtyard) {
		        final += courtyard_back;
		      }
		    }
		    if (p.reset_switch_3dmodel_filename) {
		      final += reset_switch_3dmodel;
		    }

		    final += common_end;

		    return final;
		  }
		};
		return reset_switch_smd_side;
	}

	var reset_switch_tht_top;
	var hasRequiredReset_switch_tht_top;

	function requireReset_switch_tht_top () {
		if (hasRequiredReset_switch_tht_top) return reset_switch_tht_top;
		hasRequiredReset_switch_tht_top = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @ceoloide
		//
		// Description:
		//  A through-hole top-actuated momentary switch, the same used by the Corne keyboard and
		//  compatible with "PTS636 S[L|M]43 LFS" tactile switches sold on LCSC.
		//
		// Datasheet:
		//  https://datasheet.lcsc.com/lcsc/2110271930_C-K-PTS636SM43LFS_C2689636.pdf
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, it will include silkscreen on both Front and Back, if silkscreen is included.
		//      because the footprint is through-hole and because it's only connecting RST to GND, the
		//      pads are reversible in any case.
		//    include_silkscreen: default is true
		//      if true it will include silkscreen markings

		reset_switch_tht_top = {
		  params: {
		    designator: 'RST', // for Button
		    side: 'F',
		    reversible: false,
		    include_silkscreen: true,
		    from: { type: 'net', value: 'GND' },
		    to: { type: 'net', value: 'RST' },
		  },
		  body: p => {
		    const common_start = `
  (footprint "ceoloide:reset_switch_tht_top"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 2.55 ${90 + p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
        `;
		    const silkscreen_front = `
    (fp_text user "RST" (at 0 0 ${p.r}) (layer "F.SilkS") (effects (font (size 1 1) (thickness 0.15))))
    (fp_line (start -3 1.75) (end 3 1.75) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 3 1.75) (end 3 1.5) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -3 1.75) (end -3 1.5) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -3 -1.75) (end -3 -1.5) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -3 -1.75) (end 3 -1.75) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 3 -1.75) (end 3 -1.5) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
        `;
		    const silkscreen_back = `
    (fp_text user "RST" (at 0 0 ${p.r}) (layer "B.SilkS") (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))
    (fp_line (start 3 1.5) (end 3 1.75) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 3 1.75) (end -3 1.75) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -3 1.75) (end -3 1.5) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -3 -1.5) (end -3 -1.75) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -3 -1.75) (end 3 -1.75) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 3 -1.75) (end 3 -1.5) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
        `;
		    const common_end = `
    (pad "2" thru_hole circle (at -3.25 0 ${p.r}) (size 1.7 1.7) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "1" thru_hole circle (at 3.25 0 ${p.r}) (size 1.7 1.7) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.to.str})
  )
        `;
		    let final = common_start;
		    if (p.side == "F" || p.reversible) {
		      if (p.include_silkscreen) {
		        final += silkscreen_front;
		      }
		    }
		    if (p.side == "B" || p.reversible) {
		      if (p.include_silkscreen) {
		        final += silkscreen_back;
		      }
		    }
		    final += common_end;
		    return final;
		  }
		};
		return reset_switch_tht_top;
	}

	/*
	Copyright (c) 2023 Marco Massarelli

	SPDX-License-Identifier: MIT

	To view a copy of this license, visit https://opensource.org/license/mit/

	Author: @ceoloide

	Description:
	  Reversible Alps EC11 / EC12 rotary encoder footprint with customization options to make it
	  compatible with Cherry MX or Choc v1 / v2 footprints, when co-located.
	  
	  The Alps EC12 (EC12E2440301) has a short through-shaft model that is well suited for low
	  profile keyboards, although it doesn't include a momentary switch.

	Notes:
	- The footprint can be co-located with a Cherry MX hotswap footprint, as long as the outermost
	  hotswap pads are at most 2 mm tall, so that they won't overlap with the plate mount legs
	  of the rotary encoder. The encoder mounting pads can be positioned 7.5mm instead of 5.6mm to
	  avoid overlap with mounting pins.
	- The footprint can be co-located with a Choc v1 / v2 hotswap footprint, as long as the encoder
	  pads are positioned at least 8.254 mm. If Choc v1 is co-located with the encoder, then mounting
	  pads can be positioned 8.00mm instead of 5.6mm to avoid overlap with mounting pins. Choc v2
	  don't have those pins, so wouldn't need the encoder mounting pads moved.
	- The footprint is inherently reversible, no solder jumper needed. Make sure to invert the pin
	  assignment for pad A and C in firmware, to ensure the encoder rotation is handled consistently.

	Datasheet:
	  https://www.soundwell.hk/ec12-rotary-encoder.html

	Params:
	  side: default is F for Front
	    the side on which to place the single-side footprint and designator, either F or B
	  reversible: default is false
	    if true, the footprint silkscreen will be placed on both sides so that the PCB can be
	    reversible. Pads are all THT, and only A and C need to be reversed in software.
	  include_momentary_switch_pads: default is true
	    if true, the footprint will include 2 extra pads to accommodate for momentary switch pins,
	    normally found in EC11-compatible rotary encoders.
	  include_plate_hole_marking: default is false
	    if true, will add a shape to indicate plate hole size and position for the encoder. If the
	    encoder is co-located with a switch, then the regular 14mm plate hole will be slightly
	    larger and work well enough.
	  include_silkscreen: default is true
	    if true it will include the silkscreen.
	  include_plated_mounting_holes: default is true
	    If true, it will include plated mounting holes and their pads, instead of just mechanical
	    NPTH for the mounting pins. The advantage of NPTH is that they can be more easily co-located
	    with Cherry MX mounting pins, allowing the Cherry MX hotswap pads to be 2.3 mm tall instead of
	    2.0 mmm.
	  mounting_holes_position: default is 5.6 (mm)
	    The distance in mm from the center of the footprint where to position the side mounting
	    pads. The datasheet calls for 5.7mm, but wider position can be accommodated by bending
	    legs slightly, while clearing up space for switch mounting pins (i.e. 7.5mm for Cherry,
	    8mm for Choc v1, see notes).
	  mounting_hole_width: default is 1.5 (mm)
	    The width of the mounting holes, in mm. The datasheet calls for 1.4mm rectangular, so an
	    extra mm is added for the oval shape. Note that the plated pad is made 0.3mm larger.
	  mounting_hole_height: default is 2.3 (mm)
	    The height of the mounting holes, in mm. The datasheet calls for 2.1mm rectangular, but users
	    reported a very tight fit with 2.1 mm oval holes, so the default is slightly larger. If the
	    footprint is not co-located with hotswap sockets, then 2.8 mm is a safe default, as it is the
	    same value used in the Sofle and other keyboards. Note that the plated pad is made 0.3mm larger.
	  encoder_pads_position: default is 7.5 (mm)
	    The position of the encoder pads, in mm. The datasheet calls for 7.5mm, but this makes it
	    impossible for the encoder to be co-located wtih Choc v1 / v2 hotswap pads, as it would overlap.
	    Increasing the value will require the encoder pins to be slightly bent. For Choc v1 / v2 use 
	    8.254 as a minimum.
	  encoder_3dmodel_filename: default is ''
	    Allows you to specify the path to a 3D model STEP or WRL file to be
	    used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
	    a KiCad configured path.
	  encoder_3dmodel_xyz_offset: default is [0, 0, 0]
	    xyz offset (in mm), used to adjust the position of the 3d model
	    relative the footprint.
	  encoder_3dmodel_xyz_scale: default is [1, 1, 1]
	    xyz scale, used to adjust the size of the 3d model relative to its
	    original size.
	  encoder_3dmodel_xyz_rotation: default is [0, 0, 0]
	    xyz rotation (in degrees), used to adjust the orientation of the 3d
	    model relative the footprint.
	*/

	var rotary_encoder_ec11_ec12;
	var hasRequiredRotary_encoder_ec11_ec12;

	function requireRotary_encoder_ec11_ec12 () {
		if (hasRequiredRotary_encoder_ec11_ec12) return rotary_encoder_ec11_ec12;
		hasRequiredRotary_encoder_ec11_ec12 = 1;
		rotary_encoder_ec11_ec12 = {
		  params: {
		    designator: 'RE',
		    side: 'F',
		    reversible: false,
		    include_momentary_switch_pads: true,
		    include_plate_hole_marking: false,
		    include_silkscreen: true,
		    include_plated_mounting_holes: true,
		    mounting_holes_position: 5.6,
		    mounting_holes_height: 2.3,
		    mounting_holes_width: 1.5,
		    encoder_pads_position: 7.5,
		    encoder_3dmodel_filename: '',
		    encoder_3dmodel_xyz_offset: [0, 0, 0],
		    encoder_3dmodel_xyz_rotation: [0, 0, 0],
		    encoder_3dmodel_xyz_scale: [1, 1, 1],
		    S1: { type: 'net', value: '' },
		    S2: { type: 'net', value: '' },
		    A: { type: 'net', value: 'RE_A' },
		    B: { type: 'net', value: 'GND' },
		    C: { type: 'net', value: 'RE_C' },
		  },
		  body: p => {
		    const common_top = `
  (footprint "ceoloide:rotary_encoder_ec11_ec12"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 -8.5)
      (layer "${p.side}.${p.include_silkscreen ? 'SilkS' : 'Fab'}")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15))${p.side == 'B' ? ' (justify mirror)' : ''})
    )${p.reversible && !p.ref_hide ? `
    (fp_text user "${p.ref}"
      (at 0 -8.5)
      (layer "${p.side == 'B' ? 'F' : 'B'}.${p.include_silkscreen ? 'SilkS' : 'Fab'}")
      (effects (font (size 1 1) (thickness 0.15))${p.side == 'F' ? ' (justify mirror)' : ''})
    )`:''}
    (attr through_hole)
    (pad "A" thru_hole oval (at 2.5 ${p.encoder_pads_position} ${p.r}) (size 1.6 1.1) (drill oval 1 0.5) (layers "*.Cu" "*.Mask") ${p.A})
    (pad "B" thru_hole oval (at 0 ${p.encoder_pads_position} ${p.r}) (size 1.6 1.1) (drill oval 1 0.5) (layers "*.Cu" "*.Mask") ${p.B})
    (pad "C" thru_hole oval (at -2.5 ${p.encoder_pads_position} ${p.r}) (size 1.6 1.1) (drill oval 1 0.5) (layers "*.Cu" "*.Mask") ${p.C})
    `;
		    const momentary_switch_pads = `
    (pad "S1" thru_hole oval (at -2.5 -7 ${p.r}) (size 1.6 1.1) (drill oval 1 0.5) (layers "*.Cu" "*.Mask") ${p.S1})
    (pad "S2" thru_hole oval (at 2.5 -7 ${p.r}) (size 1.6 1.1) (drill oval 1 0.5) (layers "*.Cu" "*.Mask") ${p.S2})
    `;
		    const plated_mp = `
    (pad "" thru_hole roundrect
      (at -${p.mounting_holes_position} 0 ${p.r - 90})
      (size ${p.mounting_holes_height+0.3} ${p.mounting_holes_width+0.3})
      (drill oval ${p.mounting_holes_height} ${p.mounting_holes_width})
      (layers "*.Cu" "*.Mask")
      (roundrect_rratio 0)
      (chamfer_ratio 0.2)
      (chamfer top_right top_left)
    )
    (pad "" thru_hole roundrect
      (at ${p.mounting_holes_position} 0 ${p.r - 90})
      (size ${p.mounting_holes_height+0.3} ${p.mounting_holes_width+0.3})
      (drill oval ${p.mounting_holes_height} ${p.mounting_holes_width})
      (layers "*.Cu" "*.Mask")
      (roundrect_rratio 0)
      (chamfer_ratio 0.2)
      (chamfer bottom_right bottom_left)
    )
    `;
		    const npth_mp = `
    (pad "" np_thru_hole oval
      (at -${p.mounting_holes_position} 0 ${p.r - 90})
      (size ${p.mounting_holes_height} ${p.mounting_holes_width})
      (drill oval ${p.mounting_holes_height} ${p.mounting_holes_width})
      (layers "*.Cu" "*.Mask")
    )    
    (pad "" np_thru_hole oval
      (at ${p.mounting_holes_position} 0 ${p.r - 90})
      (size ${p.mounting_holes_height} ${p.mounting_holes_width})
      (drill oval ${p.mounting_holes_height} ${p.mounting_holes_width})
      (layers "*.Cu" "*.Mask")
    )
    `;
		    const plate_hole = `
    (fp_rect (start -5.9 -6) (end 5.9 6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)) (fill none))
    `;
		    const encoder_3dmodel = `
    (model ${p.encoder_3dmodel_filename}
      (offset (xyz ${p.encoder_3dmodel_xyz_offset[0]} ${p.encoder_3dmodel_xyz_offset[1]} ${p.encoder_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.encoder_3dmodel_xyz_scale[0]} ${p.encoder_3dmodel_xyz_scale[1]} ${p.encoder_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.encoder_3dmodel_xyz_rotation[0]} ${p.encoder_3dmodel_xyz_rotation[1]} ${p.encoder_3dmodel_xyz_rotation[2]}))
    )
    `;
		    const common_bottom = `
  )
    `;

		    let final = common_top;
		    if (p.include_momentary_switch_pads) {
		      final += momentary_switch_pads;
		    }
		    if (p.include_plated_mounting_holes) {
		      final += plated_mp;
		    } else {
		      final += npth_mp;
		    }
		    if (p.include_plate_hole_marking) {
		      final += plate_hole;
		    }
		    if (p.encoder_3dmodel_filename) {
		      final += encoder_3dmodel;
		    }
		    final += common_bottom;

		    return final
		  }
		};
		return rotary_encoder_ec11_ec12;
	}

	var switch_choc_v1_v2;
	var hasRequiredSwitch_choc_v1_v2;

	function requireSwitch_choc_v1_v2 () {
		if (hasRequiredSwitch_choc_v1_v2) return switch_choc_v1_v2;
		hasRequiredSwitch_choc_v1_v2 = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Authors: @ergogen + @infused-kim, @ceoloide, @grazfather, @nxtk improvements
		//
		// Description:
		//    Kailh Choc PG1350 (v1) + Kailh Choc PG1353 (v2) reversible and hotswappable footprint.
		//    This includes support for LOFREE low profile POM switches (Ghost, Phantom, Wizard)
		//
		//    With the set defaults it will include support for choc v1 and v2 hotswap, single side
		//    (Back).
		//
		// Nets:
		//    from: corresponds to pin 1
		//    to: corresponds to pin 2
		//
		// Params:
		//    side: default is B for Back
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    hotswap: default is true
		//      if true, will include holes and pads for Kailh choc hotswap sockets
		//    solder: default is false
		//      if true, will include holes to solder switches (works with hotswap too)
		//    hotswap_pads_same_side: false
		//      if true, and if not using plated holes, it will position the pads so that nets are on
		//      the same side to simplify routing.
		//    include_traces_vias: default is true
		//      if true it will include traces and vias when hotswap is true, footprint is reversible
		//      and when no plated holes are used, to simplify routing. In the other cases it's simply
		//      not needed.
		//    trace_width: default is 0.200mm
		//      allows to override the trace width that connects the pads. Not recommended
		//      to go below 0.15mm (JLCPC min is 0.127mm), or above 0.200mm to avoid DRC errors.
		//    via_size: default is 0.6
		//      allows to define the size of the via. Not recommended below 0.56 (JLCPCB minimum),
		//      or above 0.8 (KiCad default), to avoid overlap or DRC errors
		//    via_drill: default is 0.3
		//      allows to define the size of the drill. Not recommended below 0.3 (JLCPCB minimum),
		//      or above 0.4 (KiCad default), to avoid overlap or DRC errors 
		//    locked_traces_vias: false
		//      sets the traces and vias as locked in KiCad. Locked objects may not be manipulated
		//      or moved, and cannot be selected unless the Locked Items option is enabled in the
		//      Selection Filter panel in KiCad. Useful for a faster workflow. If using autorouting
		//      solutions like Freerouting, locking can prevent the traces and vias from being
		//      replaced.
		//    include_plated_holes: default is false
		//      Alternate version of the footprint compatible with side, reversible, hotswap, solder options in any combination.
		//      Pretty, allows for connecting ground fill zones via center hole, 
		//      allows for setting nets to Choc v2 stabilizers and them for your routing needs.
		//    include_stabilizer_nets: default is false
		//      if true, will add adjustable nets to choc v2 plated stabilizer holes, 
		//      LEFTSTAB: default is "D1"
		//      RIGHTSTAB: default is "D2"
		//    include_centerhole_net: default is false
		//      if true, will add adjustable net to the center hole
		//      CENTERHOLE: default is "GND"
		//    outer_pad_width_front: default 2.6
		//    outer_pad_width_back: default 2.6
		//      Allows you to make the outer hotswap pads smaller to silence DRC
		//      warnings when the sockets are too close to the edge cuts. It's not
		//      recommended to go below 1.6mm to ensure the hotswap socket can be
		//      properly soldered.
		//    include_keycap: default is false
		//      if true, will add mx sized keycap box around the footprint (18mm)
		//    include_corner_marks: default is false
		//      if true, will add corner marks to indicate plate hole size and position
		//    include_choc_v1_led_cutout_marks: default is false
		//      if true, will add marks for the led cutout in choc v1 switch body
		//    include_choc_v2_led_cutout_marks: default is false
		//      if true, will add marks for the led cutout in choc v2 switch body
		//    include_stabilizer_pad: default is true
		//      if true, will add a corner pad for the stabilizer leg present in some
		//      Choc switches, unless choc_v2_support is false.
		//    oval_stabilizer_pad: default is false
		//      if false, will add an oval pad for the stabilizer leg, and a round one
		//      if true. Note that the datasheet calls for a round one.
		//    choc_v1_stabilizers_diameter: default is 1.9 (mm)
		//      Allows you to narrow Choc v1 stabilizer / boss holes diameter for tighter fit, not recommended to set below 1.7
		//    center_hole_diameter: default is 3.4 mm for choc v1 or 5.0 mm for choc v2
		//      The diameter of the center hole under the switch.
		//    choc_v1_support: default is true
		//      if true, will add lateral stabilizer holes that are required for
		//      Choc v1 footprints.
		//    choc_v2_support: default is true
		//      if true, will make the central hole bigger to as required for
		//      Choc v2 footprints. If false it will also disable the corner stabilizer
		//      pad even if include_stabilizer_pad is true.
		//    keycap_height: default is 18
		//      Allows you to adjust the width of the keycap outline. For example,
		//      to show a 1.5u outline for easier aligning.
		//    keycap_width: default is 18
		//      Allows you to adjust the height of the keycap outline.
		//    allow_soldermask_bridges: default is true
		//      Disables 'solder mask aperture bridges items with different nets' DRC check when set to true
		//      setting this option to false may be useful for debugging purposes, (applied locally to this footprint only)
		//      for global setting see `allow_soldermask_bridges_in_footprints` in a kicad template
		//    switch_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    switch_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    switch_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    switch_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//    hotswap_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model to be used when rendering
		//      the PCB. Allows for paths using a configured path by using the
		//      ${VAR_NAME} syntax.
		//    hotswap_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    hotswap_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative its
		//      original size.
		//    hotswap_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//    keycap_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    keycap_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    keycap_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    keycap_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//
		// Notes:
		// - Hotswap and solder can be used together. The solder holes will then be
		//   added above the hotswap holes.
		//
		// @infused-kim's improvements:
		//  - Add hotswap socket outlines
		//  - Move switch corner marks from user layer to silk screen
		//  - Add option to adjust keycap size outlines (to show 1.5u outline)
		//  - Add option to add hotswap sockets and direct soldering holes at the
		//    same time
		//  - Make hotswap pads not overlap holes to fix DRC errors
		//  - Fixed DRC errors "Drilled holes co-located"
		//
		// @ceoloide's improvements:
		//  - Adjusted footprint to be Choc PG1353 (v2) compatible
		//  - Add option to hide corner marks, as they interfere with hotswap silkscreen
		//  - Add ability to specify board side
		//  - Add ability to include stabilizer pad
		//  - Add ability to use an oval stabilizer pad
		//  - Add option to add routes between pads, and have pads on the same side
		//  - Add option to lock routes between pads
		//  - Upgrade to KiCad 8
		//
		// @grazfather's improvements:
		//  - Add support for switch 3D model
		//
		// @nxtk's improvements:
		//  - Add plated version, inspired by @daprice and @ssbb
		//  - Add ability to adjust v1 stabilizer / boss holes
		//  - Add ability to assign nets to v2 stabilizer / boss holes (useful for routing diode in place of backlight led)
		//  - Add ability to set a net to central hole (useful for connecting ground fill zones)
		//  - Add opposite stabilizer / boss holes when (choc_v2_support & solder & hotswap) options enabled together
		//  - Change v2 stabilizer / boss holes to plated
		//  - Add allow_soldermask_bridges option, which disables 'solder mask aperture bridges items with different nets' DRC check
		//
		// @mlilley's improvements:
		//  - Add options to include marks for the led cutout in choc v1 and v2 switch bodies

		switch_choc_v1_v2 = {
		  params: {
		    designator: 'S',
		    side: 'B',
		    reversible: false,
		    hotswap_pads_same_side: false,
		    include_traces_vias: true,
		    trace_width: 0.2,
		    via_size: 0.6,
		    via_drill: 0.3,
		    locked_traces_vias: false,
		    hotswap: true,
		    include_plated_holes: false,
		    include_stabilizer_nets: false,
		    include_centerhole_net: false,
		    solder: false,
		    outer_pad_width_front: 2.6,
		    outer_pad_width_back: 2.6,
		    include_keycap: false,
		    keycap_width: 18,
		    keycap_height: 18,
		    include_corner_marks: false,
		    include_choc_v1_led_cutout_marks: false,
		    include_choc_v2_led_cutout_marks: false,
		    include_stabilizer_pad: true,
		    oval_stabilizer_pad: false,
		    choc_v1_support: true,
		    choc_v2_support: true,
		    choc_v1_stabilizers_diameter: 1.9,
		    center_hole_diameter: 0.0,
		    allow_soldermask_bridges: true,
		    switch_3dmodel_filename: '',
		    switch_3dmodel_xyz_offset: [0, 0, 0],
		    switch_3dmodel_xyz_rotation: [0, 0, 0],
		    switch_3dmodel_xyz_scale: [1, 1, 1],
		    hotswap_3dmodel_filename: '',
		    hotswap_3dmodel_xyz_offset: [0, 0, 0],
		    hotswap_3dmodel_xyz_rotation: [0, 0, 0],
		    hotswap_3dmodel_xyz_scale: [1, 1, 1],
		    keycap_3dmodel_filename: '',
		    keycap_3dmodel_xyz_offset: [0, 0, 0],
		    keycap_3dmodel_xyz_rotation: [0, 0, 0],
		    keycap_3dmodel_xyz_scale: [1, 1, 1],
		    from: undefined,
		    to: undefined,
		    CENTERHOLE: { type: 'net', value: 'GND'},
		    LEFTSTAB: { type: 'net', value: 'D1' },
		    RIGHTSTAB: { type: 'net', value: 'D2' }
		  },
		  body: p => {
		    const center_hole_diameter = p.center_hole_diameter > 0 ? p.center_hole_diameter : (p.choc_v2_support ? 5 : 3.4);
		    const common_top = `
  (footprint "ceoloide:switch_choc_v1_v2"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 8.8 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr exclude_from_pos_files exclude_from_bom${p.allow_soldermask_bridges ? ' allow_soldermask_bridges' : ''})

    ${''/* middle shaft hole */}
    ${p.include_plated_holes ? `
    (pad "" thru_hole circle (at 0 0 ${p.r}) (size ${center_hole_diameter + 0.3} ${center_hole_diameter + 0.3}) (drill ${center_hole_diameter}) (layers "*.Cu" "*.Mask") ${p.include_centerhole_net ? p.CENTERHOLE : ''})
    `: `
    (pad "" np_thru_hole circle (at 0 0 ${p.r}) (size ${center_hole_diameter} ${center_hole_diameter}) (drill ${center_hole_diameter}) (layers "*.Cu" "*.Mask"))
    `}
    `;

		    const choc_v1_stabilizers = `
    ${p.include_plated_holes ? `
    (pad "" thru_hole circle (at 5.5 0 ${p.r}) (size ${p.choc_v1_stabilizers_diameter + 0.3} ${p.choc_v1_stabilizers_diameter + 0.3}) (drill ${p.choc_v1_stabilizers_diameter}) (layers "*.Cu" "*.Mask"))
    (pad "" thru_hole circle (at -5.5 0 ${p.r}) (size ${p.choc_v1_stabilizers_diameter + 0.3} ${p.choc_v1_stabilizers_diameter + 0.3}) (drill ${p.choc_v1_stabilizers_diameter}) (layers "*.Cu" "*.Mask"))
    `: `
    (pad "" np_thru_hole circle (at 5.5 0 ${p.r}) (size ${p.choc_v1_stabilizers_diameter} ${p.choc_v1_stabilizers_diameter}) (drill ${p.choc_v1_stabilizers_diameter}) (layers "*.Cu" "*.Mask"))
    (pad "" np_thru_hole circle (at -5.5 0 ${p.r}) (size ${p.choc_v1_stabilizers_diameter} ${p.choc_v1_stabilizers_diameter}) (drill ${p.choc_v1_stabilizers_diameter}) (layers "*.Cu" "*.Mask"))
    `}
    `;

		    const corner_marks = `
    ${''/* corner marks - front */}
    (fp_line (start -7 -6) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -7 7) (end -6 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -6 -7) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -7 7) (end -7 6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 6) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -7) (end 6 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 6 7) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -7) (end 7 -6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    `;

		    const keycap_xo = 0.5 * p.keycap_width;
		    const keycap_yo = 0.5 * p.keycap_height;
		    const keycap_marks = `
    (fp_rect (start ${keycap_xo} ${keycap_yo}) (end ${-keycap_xo} ${-keycap_yo}) (layer "Dwgs.User") (stroke (width 0.15) (type solid)) (fill none))
    `;

		    const choc_v1_led_cutout_marks = `
    (fp_rect (start -2.65 6.325) (end 2.65 3.075) (layer "Dwgs.User") (width 0.15) (stroke (width 0.15) (type solid)) (fill none))
    `;

		    const choc_v2_led_cutout_marks = `
    (fp_rect (start -2.75 6.405) (end 2.75 3.455) (layer "Dwgs.User") (width 0.15) (stroke (width 0.15) (type solid)) (fill none))
    `;

		    const hotswap_common = `
    ${'' /* Middle Hole */}
    ${p.include_plated_holes ? `
    (pad ${p.reversible ? '""' : 1} thru_hole circle (at 0 -5.95 ${p.r}) (size 3.3 3.3) (drill 3) (layers "*.Cu" "*.Mask") ${p.reversible ? '' : p.from.str})
    `: `
    (pad "" np_thru_hole circle (at 0 -5.95 ${p.r}) (size 3 3) (drill 3) (layers "*.Cu" "*.Mask"))
    `}
    `;

		    const hotswap_back_pads_plated = `
    (pad "1" smd roundrect (at -2.648 -5.95 ${p.r}) (size 3.8 2.15) (layers "B.Cu") (roundrect_rratio 0.1) ${p.from.str})
    (pad "" smd roundrect (at -3.248 -5.95 ${p.r}) (size 2.6 2.15) (layers "B.Paste" "B.Mask") (roundrect_rratio 0.1))
    (pad "2" smd roundrect (at ${7.6475 - (2.6 - p.outer_pad_width_back) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_back + 1.2} 2.15) (layers "B.Cu") (roundrect_rratio 0.1) ${p.to.str})
    (pad "" smd roundrect (at ${8.2475 - (2.6 - p.outer_pad_width_back) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_back} 2.15) (layers "B.Paste" "B.Mask") (roundrect_rratio ${(2.15 / p.outer_pad_width_back) <= 1 ? 0.1 : 0.1 * (2.15 / p.outer_pad_width_back)}))
    `;

		    const hotswap_front_pads_plated = `
    (pad "1" smd roundrect (at 2.648 -5.95 ${p.r}) (size 3.8 2.15) (layers "F.Cu") (roundrect_rratio 0.1) ${p.from.str})
    (pad "" smd roundrect (at 3.248 -5.95 ${p.r}) (size 2.6 2.15) (layers "F.Paste" "F.Mask") (roundrect_rratio 0.1)) 
    (pad "2" smd roundrect (at ${ -7.6475 + (2.6 - p.outer_pad_width_front) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_front + 1.2} 2.15) (layers "F.Cu") (roundrect_rratio 0.1) ${p.to.str})
    (pad "" smd roundrect (at ${ -8.2475 + (2.6 - p.outer_pad_width_front) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_front} 2.15) (layers "F.Paste" "F.Mask") (roundrect_rratio ${(2.15 / p.outer_pad_width_front) <= 1 ? 0.1 : 0.1 * (2.15 / p.outer_pad_width_front)}))
    `;

		    const hotswap_back_pads_plated_reversible = `
    (pad "1" smd roundrect (at -3.245 -5.95 ${p.r}) (size 2.65 2.15) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.1) ${p.from.str})
    (pad "2" smd roundrect (at ${7.6475 - (2.6 - p.outer_pad_width_back) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_back + 1.2} 2.15) (layers "B.Cu") (roundrect_rratio 0.1) ${p.to.str})
    (pad "" smd roundrect (at ${8.2475 - (2.6 - p.outer_pad_width_back) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_back} 2.15) (layers "B.Paste" "B.Mask") (roundrect_rratio ${(2.15 / p.outer_pad_width_back) <= 1 ? 0.1 : 0.1 * (2.15 / p.outer_pad_width_back)}))
    `;

		    const hotswap_front_pads_plated_reversible = `
    (pad "2" smd roundrect (at 3.245 -5.95 ${p.r}) (size 2.65 2.15) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.1) ${p.to.str})
    (pad "1" smd roundrect (at ${ -7.6475 + (2.6 - p.outer_pad_width_front) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_front + 1.2} 2.15) (layers "F.Cu") (roundrect_rratio 0.1) ${p.from.str})
    (pad "" smd roundrect (at ${ -8.2475 + (2.6 - p.outer_pad_width_front) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_front} 2.15) (layers "F.Paste" "F.Mask") (roundrect_rratio ${(2.15 / p.outer_pad_width_front) <= 1 ? 0.1 : 0.1 * (2.15 / p.outer_pad_width_front)}))
    `;

		    const hotswap_front_pad_cutoff = `
    (pad "1" smd roundrect
      (at 3.275 -5.95 ${p.r})
      (size 2.6 2.6)
      (layers "F.Cu" "F.Paste" "F.Mask")
      (roundrect_rratio 0)
			(chamfer_ratio 0.455)
			(chamfer bottom_right)
      ${p.from.str}
    )
    `;

		    const hotswap_front_pad_full = `
    (pad "1" smd rect (at 3.275 -5.95 ${p.r}) (size 2.6 2.6) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from.str})
    `;

		    const hotswap_back_pad_cutoff = `
    (pad "1" smd roundrect
      (at -3.275 -5.95 ${p.r})
      (size 2.6 2.6)
      (layers "B.Cu" "B.Paste" "B.Mask")
      (roundrect_rratio 0)
			(chamfer_ratio 0.455)
			(chamfer bottom_left)
      ${p.hotswap_pads_same_side ? p.to.str : p.from.str}
    )
    `;

		    const hotswap_back_pad_full = `
    (pad "1" smd rect (at -3.275 -5.95 ${p.r}) (size 2.6 2.6) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from.str})
    `;

		    const hotswap_back = `
    ${'' /* Silkscreen outline */}
    ${'' /* back top */}
    (fp_line (start -1.5 -8.2) (end -2 -7.7) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 1.5 -8.2) (end -1.5 -8.2) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 2 -7.7) (end 1.5 -8.2) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 2 -7.7) (end 2 -6.78) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 2.52 -6.2) (end 7 -6.2) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -6.2) (end 7 -5.6) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_arc (start 2.52 -6.2) (mid 2.139878 -6.382304) (end 2 -6.78) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
  
    ${'' /* back bottom */}
    (fp_line (start -1.5 -3.7) (end -2 -4.2) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 0.8 -3.7) (end -1.5 -3.7) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 2.5 -1.5) (end 2.5 -2.2) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -1.5) (end 2.5 -1.5) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -2) (end 7 -1.5) (layer "B.SilkS") (stroke (width 0.15) (type solid)))
    (fp_arc (start 0.8 -3.7) (mid 1.956518 -3.312082) (end 2.5 -2.22) (layer "B.SilkS") (stroke (width 0.15) (type solid)))

    ${p.include_plated_holes ? `
    ${'' /* Side Hole */}
      ${p.reversible ? `
      (pad "2" thru_hole circle (at 5 -3.75 ${195 + p.r}) (size 3.3 3.3) (drill 3) (layers "*.Cu" "*.Mask") ${p.to.str})
      ${'' /* Pads */}
      ${hotswap_back_pads_plated_reversible}
      `:`
      (pad "2" thru_hole circle (at 5 -3.75 ${195 + p.r}) (size 3.3 3.3) (drill 3) (layers "*.Cu" "*.Mask") ${p.to.str})
      ${'' /* Pads */}
      ${hotswap_back_pads_plated}
      `}
    `: `
    ${'' /* Left Pad*/}
    ${p.reversible ? hotswap_back_pad_cutoff : hotswap_back_pad_full}

    ${'' /* Right Pad (not cut off) */}
    (pad "2" smd rect (at ${8.275 - (2.6 - p.outer_pad_width_back) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_back} 2.6) (layers "B.Cu" "B.Paste" "B.Mask") ${p.hotswap_pads_same_side ? p.from.str : p.to.str})

    ${'' /* Side Hole */}
    (pad "" np_thru_hole circle (at 5 -3.75 ${195 + p.r}) (size 3 3) (drill 3) (layers "*.Cu" "*.Mask"))
    `}
    `;

		    const hotswap_front = `
    ${'' /* Silkscreen outline */}
    ${'' /* front top */}
    (fp_line (start -7 -5.6) (end -7 -6.2) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -7 -6.2) (end -2.52 -6.2) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -2 -6.78) (end -2 -7.7) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -1.5 -8.2) (end -2 -7.7) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 1.5 -8.2) (end -1.5 -8.2) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 2 -7.7) (end 1.5 -8.2) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_arc (start -2 -6.78) (mid -2.139878 -6.382304) (end -2.52 -6.2) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
  
    ${'' /* front bottom */}
    (fp_line (start -7 -1.5) (end -7 -2) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -2.5 -1.5) (end -7 -1.5) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start -2.5 -2.2) (end -2.5 -1.5) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 1.5 -3.7) (end -0.8 -3.7) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_line (start 2 -4.2) (end 1.5 -3.7) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    (fp_arc (start -2.5 -2.22) (mid -1.956518 -3.312082) (end -0.8 -3.7) (layer "F.SilkS") (stroke (width 0.15) (type solid)))
    
    ${p.include_plated_holes ? `
    ${'' /* Side Hole */}
    ${p.reversible ? `
    (pad "1" thru_hole circle (at -5 -3.75 ${195 + p.r}) (size 3.3 3.3) (drill 3) (layers "*.Cu" "*.Mask") ${p.from.str})
    ${'' /* Pads */}
    ${hotswap_front_pads_plated_reversible}
    `:`
    (pad "2" thru_hole circle (at -5 -3.75 ${195 + p.r}) (size 3.3 3.3) (drill 3) (layers "*.Cu" "*.Mask") ${p.to.str})
    ${'' /* Pads */}
    ${hotswap_front_pads_plated}
    `}
    `: `
    ${'' /* Side Hole */}
    (pad "" np_thru_hole circle (at -5 -3.75 ${195 + p.r}) (size 3 3) (drill 3) (layers "*.Cu" "*.Mask"))

    ${'' /* Right Pad (cut off) */}
    ${p.reversible ? hotswap_front_pad_cutoff : hotswap_front_pad_full}

    ${'' /* Left Pad (not cut off) */}
    (pad "2" smd rect (at ${ -8.275 + (2.6 - p.outer_pad_width_front) / 2} -3.75 ${p.r}) (size ${p.outer_pad_width_front} 2.6) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to.str})
    `}
    `;

		    // If both hotswap and solder are enabled, move the solder holes
		    // "down" to the opposite side of the switch.
		    // Since switches can be rotated by 90 degrees, this won't be a
		    // problem as long as we switch the side the holes are on.
		    let solder_offset_x_front = '-';
		    let solder_offset_x_back = '';
		    let solder_offset_y = '-';
		    let stab_offset_x_front = '';
		    let stab_offset_x_back = '-';
		    let stab_offset_y = '';
		    if (p.hotswap && p.solder) {
		      solder_offset_x_front = '';
		      solder_offset_x_back = '-';
		      solder_offset_y = '';
		      stab_offset_x_front = '-';
		      stab_offset_x_back = '';
		      stab_offset_y = '';
		    }

		    const solder_common = `
    (pad "2" thru_hole circle (at 0 ${solder_offset_y}5.9 ${195 + p.r}) (size 2.032 2.032) (drill 1.27) (layers "*.Cu" "*.Mask") ${p.from.str})
    `;

		    const solder_front = `
    (pad "1" thru_hole circle (at ${solder_offset_x_front}5 ${solder_offset_y}3.8 ${195 + p.r}) (size 2.032 2.032) (drill 1.27) (layers "*.Cu" "*.Mask") ${p.to.str})
    `;
		    
		    const solder_back = `
    (pad "1" thru_hole circle (at ${solder_offset_x_back}5 ${solder_offset_y}3.8 ${195 + p.r}) (size 2.032 2.032) (drill 1.27) (layers "*.Cu" "*.Mask") ${p.to.str})
    `;

		    const oval_corner_stab_front = `
    (pad "" thru_hole oval (at ${stab_offset_x_front}5 ${stab_offset_y}5.15 ${p.r}) (size 2.4 1.2) (drill oval 1.6 0.4) (layers "*.Cu" "*.Mask") ${p.solder && p.hotswap ? p.to.str : p.include_stabilizer_nets ? p.RIGHTSTAB : ''})
    `;

		    const oval_corner_stab_back = `
    (pad "" thru_hole oval (at ${stab_offset_x_back}5 ${stab_offset_y}5.15 ${p.r}) (size 2.4 1.2) (drill oval 1.6 0.4) (layers "*.Cu" "*.Mask") ${p.solder && p.hotswap ? p.to.str : p.include_stabilizer_nets ? p.LEFTSTAB : ''})
    `;

		    const round_corner_stab_front = `
    (pad "" thru_hole circle (at ${stab_offset_x_front}5.00 ${stab_offset_y}5.15 ${p.r}) (size 1.9 1.9) (drill 1.6) (layers "*.Cu" "*.Mask") ${p.solder && p.hotswap ? p.to.str : p.include_stabilizer_nets ? p.RIGHTSTAB : ''})
    `;

		    const round_corner_stab_back = `
    (pad "" thru_hole circle (at ${stab_offset_x_back}5.00 ${stab_offset_y}5.15 ${p.r}) (size 1.9 1.9) (drill 1.6) (layers "*.Cu" "*.Mask") ${p.solder && p.hotswap ? p.to.str : p.include_stabilizer_nets ? p.LEFTSTAB : ''})
    `;

		    const switch_3dmodel = `
    (model ${p.switch_3dmodel_filename}
      (offset (xyz ${p.switch_3dmodel_xyz_offset[0]} ${p.switch_3dmodel_xyz_offset[1]} ${p.switch_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.switch_3dmodel_xyz_scale[0]} ${p.switch_3dmodel_xyz_scale[1]} ${p.switch_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.switch_3dmodel_xyz_rotation[0]} ${p.switch_3dmodel_xyz_rotation[1]} ${p.switch_3dmodel_xyz_rotation[2]}))
    )
    `;

		    const hotswap_3dmodel = `
    (model ${p.hotswap_3dmodel_filename}
      (offset (xyz ${p.hotswap_3dmodel_xyz_offset[0]} ${p.hotswap_3dmodel_xyz_offset[1]} ${p.hotswap_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.hotswap_3dmodel_xyz_scale[0]} ${p.hotswap_3dmodel_xyz_scale[1]} ${p.hotswap_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.hotswap_3dmodel_xyz_rotation[0]} ${p.hotswap_3dmodel_xyz_rotation[1]} ${p.hotswap_3dmodel_xyz_rotation[2]}))
    )
	  `;

		    const keycap_3dmodel = `
    (model ${p.keycap_3dmodel_filename}
      (offset (xyz ${p.keycap_3dmodel_xyz_offset[0]} ${p.keycap_3dmodel_xyz_offset[1]} ${p.keycap_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.keycap_3dmodel_xyz_scale[0]} ${p.keycap_3dmodel_xyz_scale[1]} ${p.keycap_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.keycap_3dmodel_xyz_rotation[0]} ${p.keycap_3dmodel_xyz_rotation[1]} ${p.keycap_3dmodel_xyz_rotation[2]}))
    )
	  `;

		    const common_bottom = `
  )
    `;

		    const hotswap_routes_unplated = `
	(segment
		(start ${p.eaxy(3.275, -5.95)})
		(end ${p.eaxy(1.2, -3.875)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(1.2, -3.875)})
		(end ${p.eaxy(0, -3.875)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.from.index})
	)
	(via
		(at ${p.eaxy(0, -3.875)})
		(size ${p.via_size})
    (drill ${p.via_drill})
		(layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(-1.2, -3.875)})
		(end ${p.eaxy(0, -3.875)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(-3.275, -5.95)})
		(end ${p.eaxy(-1.2, -3.875)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(-6.421, -1.896)})
		(end ${p.eaxy(-2.154, -1.896)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(-0.975, -3.075)})
		(end ${p.eaxy(0, -3.075)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(-8.275, -3.75)})
		(end ${p.eaxy(-6.421, -1.896)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(-2.154, -1.896)})
		(end ${p.eaxy(-0.975, -3.075)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.to.index})
	)
	(via
		(at ${p.eaxy(0, -3.075)})
		(size ${p.via_size})
    (drill ${p.via_drill})
		(layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(2.140166, -1.896)})
		(end ${p.eaxy(0.961166, -3.075)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(6.421, -1.896)})
		(end ${p.eaxy(2.140166, -1.896)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(0.961166, -3.075)})
		(end ${p.eaxy(0, -3.075)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(8.275, -3.75)})
		(end ${p.eaxy(6.421, -1.896)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.to.index})
	)
    `;

		    const hotswap_routes_same_side = `
  (segment
		(start ${p.eaxy(3.275, -5.95)})
		(end ${p.eaxy(7.775, -5.95)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.from.index})
	)
	(via
		(at ${p.eaxy(7.775, -5.95)})
		(size ${p.via_size})
    (drill ${p.via_drill})
		(layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(7.775, -3.75)})
		(end ${p.eaxy(7.775, -5.95)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(-7.775, -3.75)})
		(end ${p.eaxy(-7.775, -5.95)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.to.index})
	)
	(via
		(at ${p.eaxy(-7.775, -5.95)})
		(size ${p.via_size})
    (drill ${p.via_drill})
		(layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(-3.275, -5.95)})
		(end ${p.eaxy(-7.775, -5.95)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.to.index})
	)
    `;

		    let final = common_top;
		    if (p.choc_v1_support) {
		      final += choc_v1_stabilizers;
		    }
		    if (p.include_corner_marks) {
		      final += corner_marks;
		    }
		    if (p.include_keycap) {
		      final += keycap_marks;
		    }
		    if (p.include_stabilizer_pad && p.choc_v2_support) {
		      if (p.reversible || p.side == "F") {
		        if (p.oval_stabilizer_pad) {
		          final += oval_corner_stab_front;
		        } else {
		          final += round_corner_stab_front;
		        }
		      }
		      if (p.reversible || p.side == "B") {
		        if (p.oval_stabilizer_pad) {
		          final += oval_corner_stab_back;
		        } else {
		          final += round_corner_stab_back;
		        }
		      }
		    }
		    if (p.include_choc_v1_led_cutout_marks) {
		      final += choc_v1_led_cutout_marks;
		    }
		    if (p.include_choc_v2_led_cutout_marks) {
		      final += choc_v2_led_cutout_marks;
		    }
		    if (p.hotswap) {
		      final += hotswap_common;
		      if (p.reversible || p.side == "F") {
		        final += hotswap_front;
		      }
		      if (p.reversible || p.side == "B") {
		        final += hotswap_back;
		      }
		      if (p.hotswap_3dmodel_filename) {
		        final += hotswap_3dmodel;
		      }
		    }
		    if (p.solder) {
		      final += solder_common;
		      if (p.reversible || p.side == "F") {
		        final += solder_front;
		      }
		      if (p.reversible || p.side == "B") {
		        final += solder_back;
		      }
		    }

		    if (p.switch_3dmodel_filename) {
		      final += switch_3dmodel;
		    }

		    if (p.keycap_3dmodel_filename) {
		      final += keycap_3dmodel;
		    }

		    final += common_bottom;

		    if (p.reversible && p.hotswap && p.include_traces_vias && !p.include_plated_holes) {
		      if(p.hotswap_pads_same_side){
		        final += hotswap_routes_same_side;
		      } else {
		        final += hotswap_routes_unplated;
		      }
		    }

		    return final;
		  }
		};
		return switch_choc_v1_v2;
	}

	var switch_gateron_ks27_ks33;
	var hasRequiredSwitch_gateron_ks27_ks33;

	function requireSwitch_gateron_ks27_ks33 () {
		if (hasRequiredSwitch_gateron_ks27_ks33) return switch_gateron_ks27_ks33;
		hasRequiredSwitch_gateron_ks27_ks33 = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://spdx.org/licenses/MIT.html, https://opensource.org/license/mit
		//
		// Authors: @nxtk
		//
		// Description:
		//    Gateron LP KS27 (v1) P\N: KS-27H10B050NN + Gateron LP KS33 (v2) P\N: KS-33H10B050NN reversible and hotswappable footprint.
		//    This includes support for NuPhy low profile switches Wisteria (T55), Aloe (L37), Daisy (L48), Cowberry, Moss
		//    Hotswap socket: Gateron LP HS 2.0 P\N KS-2P02B01-02
		//
		//    With the set defaults it will include support for hotswap, single side (Back).
		//
		// Notes:
		//   - Hotswap and solder can be used together. The solder holes will then be
		//     added above the hotswap holes.
		//   - Soldered reversible mode has alternate custom pads enabled by `include_custom_solder_pads` option.
		//     Compatible with hotswap mode.
		//
		// Params:
		//    side: default is B for Back
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    hotswap: default is true
		//      if true, will include holes and pads for Kailh choc hotswap sockets
		//    solder: default is false
		//      if true, will include holes to solder switches (works with hotswap too)
		//    outer_pad_width_front: default 2.6
		//    outer_pad_width_back: default 2.6
		//      Allows you to make the outer hotswap pads smaller to silence DRC
		//      warnings when the sockets are too close to the edge cuts. It's not
		//      recommended to go below 1.6mm to ensure the hotswap socket can be
		//      properly soldered.
		//    include_keycap: default is false
		//      if true, will add mx sized keycap box around the footprint (18mm)
		//    include_corner_marks: default is false
		//      if true, will add corner marks to indicate plate hole size and position
		//    include_stem_outline: default is false
		//      if true, will add switch stem outline
		//    include_led_outline: default is false
		//      if true, will add switch led cutout outline (changes alignment based on the `side` option)
		//    include_socket_silks: default is false
		//      if true, will add hotswap sockets silkscreens (follows `reversible` and `side` options)
		//    include_socket_fabs: default is false
		//      if true, will add hotswap socket outlines to *.Fab layers which might be helful for new users
		//    include_custom_solder_pads: default is false
		//      if true, replaces reversible solder pads with alternate version
		//      (disabled in non reversible mode)
		//    include_centerhole_net: default is false
		//      if true, will add adjustable net to the center hole
		//      CENTERHOLE: default is "GND"
		//    keycap_height: default is 18
		//      Allows you to adjust the width of the keycap outline. For example,
		//      to show a 1.5u outline for easier aligning.
		//    keycap_width: default is 18
		//      Allows you to adjust the height of the keycap outline.
		//    allow_soldermask_bridges: default is true
		//      Disables 'solder mask aperture bridges items with different nets' DRC check when set to true
		//      setting this option to false may be useful for debugging purposes, (applied locally to this footprint only)
		//      for global setting see `allow_soldermask_bridges_in_footprints` in a kicad template
		//    switch_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    switch_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    switch_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    switch_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//    hotswap_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model to be used when rendering
		//      the PCB. Allows for paths using a configured path by using the
		//      ${VAR_NAME} syntax.
		//    hotswap_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    hotswap_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative its
		//      original size.
		//    hotswap_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.
		//    keycap_3dmodel_filename: default is ''
		//      Allows you to specify the path to a 3D model STEP or WRL file to be
		//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
		//      a KiCad configured path.
		//    keycap_3dmodel_xyz_offset: default is [0, 0, 0]
		//      xyz offset (in mm), used to adjust the position of the 3d model
		//      relative the footprint.
		//    keycap_3dmodel_xyz_scale: default is [1, 1, 1]
		//      xyz scale, used to adjust the size of the 3d model relative to its
		//      original size.
		//    keycap_3dmodel_xyz_rotation: default is [0, 0, 0]
		//      xyz rotation (in degrees), used to adjust the orientation of the 3d
		//      model relative the footprint.

		switch_gateron_ks27_ks33 = {
		  params: {
		    designator: 'S',
		    side: 'B',
		    reversible: false,
		    solder: true,
		    hotswap: true,
		    keycap_width: 18,
		    keycap_height: 18,
		    include_corner_marks: false,
		    include_centerhole_net: false,
		    include_keycap: false,
		    include_stem_outline: false,
		    include_led_outline: false,
		    include_socket_silks: false,
		    include_socket_fabs: false,
		    include_custom_solder_pads: false,
		    allow_soldermask_bridges: true,
		    outer_pad_width_front: 2.6,
		    outer_pad_width_back: 2.6,
		    switch_3dmodel_filename: '',
		    switch_3dmodel_xyz_offset: [0, 0, 0],
		    switch_3dmodel_xyz_rotation: [0, 0, 0],
		    switch_3dmodel_xyz_scale: [1, 1, 1],
		    hotswap_3dmodel_filename: '',
		    hotswap_3dmodel_xyz_offset: [0, 0, 0],
		    hotswap_3dmodel_xyz_rotation: [0, 0, 0],
		    hotswap_3dmodel_xyz_scale: [1, 1, 1],
		    keycap_3dmodel_filename: '',
		    keycap_3dmodel_xyz_offset: [0, 0, 0],
		    keycap_3dmodel_xyz_rotation: [0, 0, 0],
		    keycap_3dmodel_xyz_scale: [1, 1, 1],
		    from: undefined,
		    to: undefined,
		    CENTERHOLE: { type: 'net', value: 'GND' },
		  },
		  body: p => {
		    const common_top = `
  (footprint "ceoloide:switch_gateron_ks27_ks33"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 8.8 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr exclude_from_pos_files exclude_from_bom${p.allow_soldermask_bridges ? ' allow_soldermask_bridges' : ''})

    ${''/* middle shaft hole */}
    (pad "" thru_hole circle (at 0 0 ${p.r}) (size 5.6 5.6) (drill 5.1) (layers "*.Cu" "*.Mask") ${p.include_centerhole_net ? p.CENTERHOLE : ''})
    `;

		    const corner_marks = `
    ${''/* corner marks - front */}
    (fp_line (start -7 -6) (end -7 -7) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    (fp_line (start -7 7) (end -7 6) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    (fp_line (start -7 7) (end -6 7) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    (fp_line (start -6 -7) (end -7 -7) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    (fp_line (start 6 7) (end 7 7) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    (fp_line (start 7 -7) (end 6 -7) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    (fp_line (start 7 -7) (end 7 -6) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    (fp_line (start 7 6) (end 7 7) (stroke (width 0.15) (type solid)) (layer "Dwgs.User"))
    `;

		    const led_outline = `
    ${''/* led outline - front */}
    ${p.side == 'B' ? `
    (fp_rect (start -3.2 -6.3) (end 1.8 -4.05) (stroke (width 0.15) (type solid)) (fill none) (layer "Dwgs.User"))
    `:`
    (fp_rect (start -1.8 -6.3) (end 3.2 -4.05) (stroke (width 0.15) (type solid)) (fill none) (layer "Dwgs.User"))
    `}
    `;

		    const stem_outline = `
    ${''/* stem outline - front */}
    (fp_poly (pts (xy -0.525791 -3.207186) (xy -0.869467 -3.131537) (xy -1.202949 -3.019174) (xy -1.522327 -2.871414) (xy -1.823858 -2.689989) (xy -2.104005 -2.477027) (xy -2.359485 -2.235023) (xy -2.389234 -2.2) (xy -4.7 -2.2) (xy -4.7 2.2) (xy -2.389234 2.2) (xy -2.359485 2.235023) (xy -2.104005 2.477027) (xy -1.823858 2.689989) (xy -1.522327 2.871414) (xy -1.202949 3.019174) (xy -0.869467 3.131537) (xy -0.525791 3.207186) (xy -0.175951 3.245234) (xy 0 3.245234) (xy 0 2.845178) (xy -0.165713 2.845178) (xy -0.494897 2.806702) (xy -0.817389 2.73027) (xy -1.128827 2.616916) (xy -1.425 2.468172) (xy -1.701902 2.286051) (xy -1.955789 2.073015) (xy -2.183227 1.831945) (xy -2.38114 1.566101) (xy -2.546853 1.279078) (xy -2.678124 0.974757) (xy -2.773178 0.657255) (xy -2.830729 0.330865) (xy -2.85 0) (xy -2.830729 -0.330865) (xy -2.773178 -0.657255) (xy -2.678124 -0.974757) (xy -2.546853 -1.279078) (xy -2.38114 -1.566101) (xy -2.183227 -1.831945) (xy -1.955789 -2.073015) (xy -1.701902 -2.286051) (xy -1.425 -2.468172) (xy -1.128827 -2.616916) (xy -0.817389 -2.73027) (xy -0.494897 -2.806702) (xy -0.165713 -2.845178) (xy 0 -2.845178) (xy 0 -3.245234) (xy -0.175951 -3.245234)) (stroke (width 0.001) (type solid)) (fill solid) (layer "Dwgs.User"))
    (fp_poly (pts (xy 0.525791 -3.207186) (xy 0.869467 -3.131537) (xy 1.202949 -3.019174) (xy 1.522327 -2.871414) (xy 1.823858 -2.689989) (xy 2.104005 -2.477027) (xy 2.359485 -2.235023) (xy 2.389234 -2.2) (xy 4.7 -2.2) (xy 4.7 2.2) (xy 2.389234 2.2) (xy 2.359485 2.235023) (xy 2.104005 2.477027) (xy 1.823858 2.689989) (xy 1.522327 2.871414) (xy 1.202949 3.019174) (xy 0.869467 3.131537) (xy 0.525791 3.207186) (xy 0.175951 3.245234) (xy 0 3.245234) (xy 0 2.845178) (xy 0.165713 2.845178) (xy 0.494897 2.806702) (xy 0.817389 2.73027) (xy 1.128827 2.616916) (xy 1.425 2.468172) (xy 1.701902 2.286051) (xy 1.955789 2.073015) (xy 2.183227 1.831945) (xy 2.38114 1.566101) (xy 2.546853 1.279078) (xy 2.678124 0.974757) (xy 2.773178 0.657255) (xy 2.830729 0.330865) (xy 2.85 0) (xy 2.830729 -0.330865) (xy 2.773178 -0.657255) (xy 2.678124 -0.974757) (xy 2.546853 -1.279078) (xy 2.38114 -1.566101) (xy 2.183227 -1.831945) (xy 1.955789 -2.073015) (xy 1.701902 -2.286051) (xy 1.425 -2.468172) (xy 1.128827 -2.616916) (xy 0.817389 -2.73027) (xy 0.494897 -2.806702) (xy 0.165713 -2.845178) (xy 0 -2.845178) (xy 0 -3.245234) (xy 0.175951 -3.245234)) (stroke (width 0.001) (type solid)) (fill solid) (layer "Dwgs.User"))
    `;

		    const stem_cross_outline = `
    ${''/* stem outline cross - front */}
    (fp_poly (pts (xy -0.55 -0.55) (xy -0.55 -2) (xy 0.55 -2) (xy 0.55 -0.55) (xy 2 -0.55) (xy 2 0.55) (xy 0.55 0.55) (xy 0.55 2) (xy -0.55 2) (xy -0.55 0.55) (xy -2 0.55) (xy -2 -0.55)) (stroke (width 0) (type solid)) (fill solid) (layer "Dwgs.User"))
    `;


		    const keycap_xo = 0.5 * p.keycap_width;
		    const keycap_yo = 0.5 * p.keycap_height;
		    const keycap_marks = `
    (fp_rect (start ${keycap_xo} ${keycap_yo}) (end ${-keycap_xo} ${-keycap_yo}) (layer "Dwgs.User") (stroke (width 0.15) (type solid)) (fill none))
    `;

		    const hotswap_fab_front = `
    (fp_line (start -6.65 6.525) (end -6.65 4.975) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -6.55 4.875) (end -5.025 4.875) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -5.025 4.875) (end -5.025 3.675) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -5.025 4.875) (end -5.025 6.625) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -5.025 6.625) (end -6.55 6.625) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -5.025 6.625) (end -5.025 7.825) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -4.925 3.575) (end 0.788397 3.575) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -4.925 7.925) (end -0.775 7.925) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -0.675 7.825) (end -0.675 7.325) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start -0.475 7.125) (end 0.625 7.125) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 0.825 7.325) (end 0.825 7.825) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 0.925 7.925) (end 1.022371 7.925) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 2.642949 2.658975) (end 1.288397 3.441026) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 2.742949 7.008975) (end 1.272371 7.858013) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 6.725 2.525) (end 3.142949 2.525) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 6.725 6.875) (end 3.242949 6.875) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 6.825 3.825) (end 6.825 2.625) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 6.825 3.825) (end 8.35 3.825) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 6.825 5.575) (end 6.825 3.825) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 6.825 6.775) (end 6.825 5.575) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 8.35 5.575) (end 6.825 5.575) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_line (start 8.45 3.925) (end 8.45 5.475) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start -6.65 4.975) (mid -6.620711 4.904289) (end -6.55 4.875) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start -6.55 6.625) (mid -6.620711 6.595711) (end -6.65 6.525) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start -5.025 3.675) (mid -4.995711 3.604289) (end -4.925 3.575) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start -4.925 7.925) (mid -4.995711 7.895711) (end -5.025 7.825) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start -0.675 7.325) (mid -0.616421 7.183579) (end -0.475 7.125) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start -0.675 7.825) (mid -0.704289 7.895711) (end -0.775 7.925) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 0.625 7.125) (mid 0.76642 7.183579) (end 0.825 7.325) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 0.925 7.925) (mid 0.854288 7.895711) (end 0.825 7.825) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 1.272371 7.858013) (mid 1.151778 7.907947) (end 1.022371 7.925) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 1.288397 3.441026) (mid 1.047216 3.540926) (end 0.788397 3.575) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 2.642949 2.658975) (mid 2.884134 2.559088) (end 3.142949 2.525) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 2.742949 7.008975) (mid 2.984134 6.909088) (end 3.242949 6.875) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 6.725 2.525) (mid 6.795709 2.55429) (end 6.825 2.625) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 6.825 6.775) (mid 6.795711 6.845711) (end 6.725 6.875) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 8.35 3.825) (mid 8.420709 3.85429) (end 8.45 3.925) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_arc (start 8.45 5.475) (mid 8.420711 5.545711) (end 8.35 5.575) (stroke (width 0.001) (type solid)) (layer "F.Fab"))
    (fp_circle (center -2.6 5.75) (end -1.1 5.75) (stroke (width 0.001) (type solid)) (fill none) (layer "F.Fab"))
    (fp_circle (center 4.4 4.7) (end 5.9 4.7) (stroke (width 0.001) (type solid)) (fill none) (layer "F.Fab"))
    `;

		    const hotswap_fab_back = `
    (fp_line (start -8.45 5.475) (end -8.45 3.925) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -8.35 3.825) (end -6.825 3.825) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -6.825 2.625) (end -6.825 3.825) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -6.825 3.825) (end -6.825 5.575) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -6.825 5.575) (end -8.35 5.575) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -6.825 5.575) (end -6.825 6.775) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -3.242949 6.875) (end -6.725 6.875) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -3.142949 2.525) (end -6.725 2.525) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -1.288397 3.441026) (end -2.642949 2.658975) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -1.272371 7.858013) (end -2.742949 7.008975) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -1.022371 7.925) (end -0.925 7.925) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -0.825 7.825) (end -0.825 7.325) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -0.788397 3.575) (end 4.925 3.575) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start -0.625 7.125) (end 0.475 7.125) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 0.675 7.325) (end 0.675 7.825) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 0.775 7.925) (end 4.925 7.925) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 5.025 3.675) (end 5.025 4.875) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 5.025 4.875) (end 6.55 4.875) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 5.025 6.625) (end 5.025 4.875) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 5.025 7.825) (end 5.025 6.625) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 6.55 6.625) (end 5.025 6.625) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_line (start 6.65 4.975) (end 6.65 6.525) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -8.45 3.925) (mid -8.420711 3.854289) (end -8.35 3.825) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -8.35 5.575) (mid -8.420711 5.545711) (end -8.45 5.475) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -6.825 2.625) (mid -6.795711 2.554289) (end -6.725 2.525) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -6.725 6.875) (mid -6.795711 6.845711) (end -6.825 6.775) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -3.242949 6.875) (mid -2.98413 6.909077) (end -2.742949 7.008975) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -3.142949 2.525) (mid -2.88413 2.559077) (end -2.642949 2.658975) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -1.022371 7.925) (mid -1.15178 7.907962) (end -1.272371 7.858013) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -0.825 7.325) (mid -0.766421 7.183579) (end -0.625 7.125) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -0.825 7.825) (mid -0.854289 7.895711) (end -0.925 7.925) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start -0.788397 3.575) (mid -1.047216 3.540927) (end -1.288397 3.441026) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start 0.475 7.125) (mid 0.616421 7.183579) (end 0.675 7.325) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start 0.775 7.925) (mid 0.704289 7.895711) (end 0.675 7.825) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start 4.925 3.575) (mid 4.995711 3.604289) (end 5.025 3.675) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start 5.025 7.825) (mid 4.995711 7.895711) (end 4.925 7.925) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start 6.55 4.875) (mid 6.620711 4.904289) (end 6.65 4.975) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_arc (start 6.65 6.525) (mid 6.620711 6.595711) (end 6.55 6.625) (stroke (width 0.001) (type solid)) (layer "B.Fab"))
    (fp_circle (center -4.4 4.7) (end -2.85 4.7) (stroke (width 0.001) (type solid)) (fill none) (layer "B.Fab"))
    (fp_circle (center 2.6 5.75) (end 4.15 5.75) (stroke (width 0.001) (type solid)) (fill none) (layer "B.Fab"))
    `;

		    const hotswap_silk_front = `
    (fp_line (start -5.025 7.825) (end -5.025 7.225) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start -4.325 7.925) (end -4.925 7.925) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start 0.788397 3.575) (end -0.75 3.575) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start 2.642949 2.658975) (end 1.288397 3.441026) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start 4.681346 2.525) (end 3.142949 2.525) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start 6.725 2.525) (end 6.125 2.525) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start 6.725 6.875) (end 6.125 6.875) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start 6.825 3.225) (end 6.825 2.625) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start 6.825 6.775) (end 6.825 6.175) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_arc (start -4.925 7.925) (mid -4.995711 7.895711) (end -5.025 7.825) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_arc (start 1.288397 3.441026) (mid 1.047216 3.540926) (end 0.788397 3.575) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_arc (start 2.642949 2.658975) (mid 2.884131 2.559086) (end 3.142949 2.525) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_arc (start 6.725 2.525) (mid 6.795711 2.554289) (end 6.825 2.625) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_arc (start 6.825 6.775) (mid 6.795711 6.845711) (end 6.725 6.875) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    
    ${p.reversible ? `` : `
    (fp_arc (start -5.025 3.675) (mid -4.995711 3.604289) (end -4.925 3.575) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start -5.025 4.275) (end -5.025 3.675) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    (fp_line (start -4.325 3.575) (end -4.925 3.575) (stroke (width 0.15) (type solid)) (layer "F.SilkS"))
    `}
    `;

		    const hotswap_silk_back = `
    (fp_line (start -6.825 2.625) (end -6.825 3.225) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start -6.825 6.175) (end -6.825 6.775) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start -6.125 2.525) (end -6.725 2.525) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start -6.125 6.875) (end -6.725 6.875) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start -3.142949 2.525) (end -4.681346 2.525) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start -1.288397 3.441026) (end -2.642949 2.658975) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start 0.75 3.575) (end -0.788397 3.575) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start 4.925 7.925) (end 4.325 7.925) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start 5.025 7.225) (end 5.025 7.825) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_arc (start -6.825 2.625) (mid -6.795711 2.554289) (end -6.725 2.525) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_arc (start -6.725 6.875) (mid -6.795711 6.845711) (end -6.825 6.775) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_arc (start -3.142949 2.525) (mid -2.884135 2.559092) (end -2.642949 2.658975) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_arc (start -0.788397 3.575) (mid -1.047216 3.540926) (end -1.288397 3.441026) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_arc (start 5.025 7.825) (mid 4.995711 7.895711) (end 4.925 7.925) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    
    ${p.reversible ? `` : `
    (fp_arc (start 4.925 3.575) (mid 4.995711 3.604289) (end 5.025 3.675) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start 5.025 3.675) (end 5.025 4.275) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    (fp_line (start 4.925 3.575) (end 4.325 3.575) (stroke (width 0.15) (type solid)) (layer "B.SilkS"))
    `}
    `;

		    const hotswap_front_full = `
    (pad "1" smd roundrect (at -5.55 5.75 ${p.r}) (size 4 2.5) (layers "F.Cu") (roundrect_rratio 0.1) ${p.from.str})
    (pad "" smd roundrect (at -6.25 5.75 ${p.r}) (size 2.6 2.5) (layers "F.Paste" "F.Mask") (roundrect_rratio 0.1))
    `;

		    const hotswap_back_full = `
    (pad "2" smd roundrect (at 5.55 5.75 ${p.r}) (size 4 2.5) (layers "B.Cu") (roundrect_rratio 0.1) ${p.to.str})
    (pad "" smd roundrect (at 6.25 5.75 ${p.r}) (size 2.6 2.5) (layers "B.Paste" "B.Mask") (roundrect_rratio 0.1))
    `;

		    const hotswap_front = `
    (pad ${p.reversible ? '""' : '"1"'} thru_hole circle (at -2.6 5.75 ${p.r}) (size 3.5 3.5) (drill 3) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "2" thru_hole circle (at 4.4 4.7 ${p.r}) (size 3.5 3.5) (drill 3) (layers "*.Cu" "*.Mask") ${p.to.str})

    (pad "2" smd roundrect (at ${7.35 - (2.6 - p.outer_pad_width_front) / 2} 4.7 ${p.r}) (size ${p.outer_pad_width_front + 1.4} 2.5) (layers "F.Cu") (roundrect_rratio 0.1) ${p.to.str})
    (pad "" smd roundrect (at ${8.05 - (2.6 - p.outer_pad_width_front) / 2} 4.7 ${p.r}) (size ${p.outer_pad_width_front} 2.5) (layers "F.Paste" "F.Mask") (roundrect_rratio 0.1))

    ${!p.reversible ? hotswap_front_full
	        : `(pad "1" smd roundrect (at -6.25 5.75 ${p.r}) (size 2.6 2.5) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.1) ${p.from.str})`}
    `;

		    const hotswap_back = `
    (pad "1" thru_hole circle (at -4.4 4.7 ${p.r}) (size 3.5 3.5) (drill 3) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad ${p.reversible ? '""' : '"2"'} thru_hole circle (at 2.6 5.75 ${p.r}) (size 3.5 3.5) (drill 3) (layers "*.Cu" "*.Mask") ${p.to.str})

    
    (pad "1" smd roundrect (at ${ -7.35 + (2.6 - p.outer_pad_width_back) / 2} 4.7 ${p.r}) (size ${p.outer_pad_width_back + 1.4} 2.5) (layers "B.Cu") (roundrect_rratio 0.1) ${p.from.str})
    (pad "" smd roundrect (at ${ -8.05 + (2.6 - p.outer_pad_width_back) / 2} 4.7 ${p.r}) (size ${p.outer_pad_width_back} 2.5) (layers "B.Paste" "B.Mask") (roundrect_rratio ${(2.5 / p.outer_pad_width_back) <= 1 ? 0.1 : 0.1 * (2.5 / p.outer_pad_width_back)}))
    
    ${!p.reversible ? hotswap_back_full
	        : `(pad "2" smd roundrect (at 6.25 5.75 ${p.r}) (size 2.6 2.5) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.1) ${p.to.str})`}
    `;


		    // If both hotswap and solder are enabled, move the solder holes
		    // "down" to the opposite side of the switch.
		    // Since switches can be r3otated by 90 degrees, this won't be a
		    // problem as long as we switch the side the holes are on.
		    //let solder_offset_x_front = ''
		    //let solder_offset_x_back = ''
		    let solder_offset_y = '';
		    if (p.hotswap && p.solder) {
		      //solder_offset_x_front = ''
		      //solder_offset_x_back = ''
		      solder_offset_y = '-';
		    }

		    const solder_back = `
    (pad "1" thru_hole circle (at -2.6 ${solder_offset_y}5.75 ${p.r}) (size 2.1 2.1) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "2" thru_hole circle (at 4.4 ${solder_offset_y}4.7 ${p.r}) (size 2.1 2.1) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.to.str})
    `;

		    const solder_front = `
    (pad "1" thru_hole circle (at -4.4 ${solder_offset_y}4.7 ${p.r}) (size 2.1 2.1) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "2" thru_hole circle (at 2.6 ${solder_offset_y}5.75 ${p.r}) (size 2.1 2.1) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.to.str})
    `;
		    
		    const solder_custom_reversible_top = `
    (pad "" thru_hole circle (at -4.4 -4.7) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "" thru_hole circle (at -2.6 -5.75) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "1" smd custom (at -2.6 -5.75) (size 1 1) (layers "F.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle))
      (primitives (gr_poly (pts (xy -0.19509 -0.980785) (xy -0.382683 -0.92388) (xy -0.55557 -0.83147) (xy -2.35557 0.21853) (xy -2.507107 0.342893) (xy -2.63147 0.49443) (xy -2.72388 0.667317) (xy -2.780785 0.85491) (xy -2.8 1.05) (xy -2.780785 1.24509) (xy -2.72388 1.432683) (xy -2.63147 1.60557) (xy -2.507107 1.757107) (xy -2.35557 1.88147) (xy -2.182683 1.97388) (xy -1.99509 2.030785) (xy -1.8 2.05) (xy -1.60491 2.030785) (xy -1.417317 1.97388) (xy -1.24443 1.88147) (xy 0.55557 0.83147) (xy 0.707107 0.707107) (xy 0.83147 0.55557) (xy 0.92388 0.382683) (xy 0.980785 0.19509) (xy 1 0) (xy 0.980785 -0.19509) (xy 0.92388 -0.382683) (xy 0.83147 -0.55557) (xy 0.707107 -0.707107) (xy 0.55557 -0.83147) (xy 0.382683 -0.92388) (xy 0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
      ${p.from.str})
    (pad "1" smd custom (at -2.6 -5.75) (size 1 1) (layers "B.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle))
      (primitives (gr_poly (pts (xy -0.19509 -0.980785) (xy -0.382683 -0.92388) (xy -0.55557 -0.83147) (xy -2.35557 0.21853) (xy -2.507107 0.342893) (xy -2.63147 0.49443) (xy -2.72388 0.667317) (xy -2.780785 0.85491) (xy -2.8 1.05) (xy -2.780785 1.24509) (xy -2.72388 1.432683) (xy -2.63147 1.60557) (xy -2.507107 1.757107) (xy -2.35557 1.88147) (xy -2.182683 1.97388) (xy -1.99509 2.030785) (xy -1.8 2.05) (xy -1.60491 2.030785) (xy -1.417317 1.97388) (xy -1.24443 1.88147) (xy 0.55557 0.83147) (xy 0.707107 0.707107) (xy 0.83147 0.55557) (xy 0.92388 0.382683) (xy 0.980785 0.19509) (xy 1 0) (xy 0.980785 -0.19509) (xy 0.92388 -0.382683) (xy 0.83147 -0.55557) (xy 0.707107 -0.707107) (xy 0.55557 -0.83147) (xy 0.382683 -0.92388) (xy 0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
      ${p.from.str})

    (pad "" thru_hole circle (at 2.6 -5.75) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.to.str})
    (pad "" thru_hole circle (at 4.4 -4.7) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.to.str})
    (pad "2" smd custom (at 2.6 -5.75) (size 1 1) (layers "F.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle))
      (primitives (gr_poly (pts (xy 0.19509 -0.980785) (xy 0.382683 -0.92388) (xy 0.55557 -0.83147) (xy 2.35557 0.21853) (xy 2.507107 0.342893) (xy 2.63147 0.49443) (xy 2.72388 0.667317) (xy 2.780785 0.85491) (xy 2.8 1.05) (xy 2.780785 1.24509) (xy 2.72388 1.432683) (xy 2.63147 1.60557) (xy 2.507107 1.757107) (xy 2.35557 1.88147) (xy 2.182683 1.97388) (xy 1.99509 2.030785) (xy 1.8 2.05) (xy 1.60491 2.030785) (xy 1.417317 1.97388) (xy 1.24443 1.88147) (xy -0.55557 0.83147) (xy -0.707107 0.707107) (xy -0.83147 0.55557) (xy -0.92388 0.382683) (xy -0.980785 0.19509) (xy -1 0) (xy -0.980785 -0.19509) (xy -0.92388 -0.382683) (xy -0.83147 -0.55557) (xy -0.707107 -0.707107) (xy -0.55557 -0.83147) (xy -0.382683 -0.92388) (xy -0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
      ${p.to.str})
    (pad "2" smd custom (at 2.6 -5.75) (size 1 1) (layers "B.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle))
      (primitives (gr_poly (pts (xy 0.19509 -0.980785) (xy 0.382683 -0.92388) (xy 0.55557 -0.83147) (xy 2.35557 0.21853) (xy 2.507107 0.342893) (xy 2.63147 0.49443) (xy 2.72388 0.667317) (xy 2.780785 0.85491) (xy 2.8 1.05) (xy 2.780785 1.24509) (xy 2.72388 1.432683) (xy 2.63147 1.60557) (xy 2.507107 1.757107) (xy 2.35557 1.88147) (xy 2.182683 1.97388) (xy 1.99509 2.030785) (xy 1.8 2.05) (xy 1.60491 2.030785) (xy 1.417317 1.97388) (xy 1.24443 1.88147) (xy -0.55557 0.83147) (xy -0.707107 0.707107) (xy -0.83147 0.55557) (xy -0.92388 0.382683) (xy -0.980785 0.19509) (xy -1 0) (xy -0.980785 -0.19509) (xy -0.92388 -0.382683) (xy -0.83147 -0.55557) (xy -0.707107 -0.707107) (xy -0.55557 -0.83147) (xy -0.382683 -0.92388) (xy -0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
      ${p.to.str})

    `;

		    const solder_custom_reversible_bottom = `
    (pad "" thru_hole circle (at -4.4 4.7) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "" thru_hole circle (at -2.6 5.75) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.from.str})
    (pad "1" smd custom (at -4.4 4.7) (size 1 1) (layers "F.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle)) 
      (primitives (gr_poly (pts (xy 0.19509 -0.980785) (xy 0.382683 -0.92388) (xy 0.55557 -0.83147) (xy 2.35557 0.21853) (xy 2.507107 0.342893) (xy 2.63147 0.49443) (xy 2.72388 0.667317) (xy 2.780785 0.85491) (xy 2.8 1.05) (xy 2.780785 1.24509) (xy 2.72388 1.432683) (xy 2.63147 1.60557) (xy 2.507107 1.757107) (xy 2.35557 1.88147) (xy 2.182683 1.97388) (xy 1.99509 2.030785) (xy 1.8 2.05) (xy 1.60491 2.030785) (xy 1.417317 1.97388) (xy 1.24443 1.88147) (xy -0.55557 0.83147) (xy -0.707107 0.707107) (xy -0.83147 0.55557) (xy -0.92388 0.382683) (xy -0.980785 0.19509) (xy -1 0) (xy -0.980785 -0.19509) (xy -0.92388 -0.382683) (xy -0.83147 -0.55557) (xy -0.707107 -0.707107) (xy -0.55557 -0.83147) (xy -0.382683 -0.92388) (xy -0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
       ${p.from.str})
    (pad "1" smd custom (at -4.4 4.7) (size 1 1) (layers "B.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle)) 
      (primitives (gr_poly (pts (xy 0.19509 -0.980785) (xy 0.382683 -0.92388) (xy 0.55557 -0.83147) (xy 2.35557 0.21853) (xy 2.507107 0.342893) (xy 2.63147 0.49443) (xy 2.72388 0.667317) (xy 2.780785 0.85491) (xy 2.8 1.05) (xy 2.780785 1.24509) (xy 2.72388 1.432683) (xy 2.63147 1.60557) (xy 2.507107 1.757107) (xy 2.35557 1.88147) (xy 2.182683 1.97388) (xy 1.99509 2.030785) (xy 1.8 2.05) (xy 1.60491 2.030785) (xy 1.417317 1.97388) (xy 1.24443 1.88147) (xy -0.55557 0.83147) (xy -0.707107 0.707107) (xy -0.83147 0.55557) (xy -0.92388 0.382683) (xy -0.980785 0.19509) (xy -1 0) (xy -0.980785 -0.19509) (xy -0.92388 -0.382683) (xy -0.83147 -0.55557) (xy -0.707107 -0.707107) (xy -0.55557 -0.83147) (xy -0.382683 -0.92388) (xy -0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
       ${p.from.str})

    (pad "" thru_hole circle (at 2.6 5.75) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.to.str})
    (pad "" thru_hole circle (at 4.4 4.7) (size 1.8 1.8) (drill 1.25) (layers "*.Cu" "*.Mask") ${p.to.str})
    (pad "2" smd custom (at 4.4 4.7) (size 1 1) (layers "F.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle))
      (primitives (gr_poly (pts (xy -0.19509 -0.980785) (xy -0.382683 -0.92388) (xy -0.55557 -0.83147) (xy -2.35557 0.21853) (xy -2.507107 0.342893) (xy -2.63147 0.49443) (xy -2.72388 0.667317) (xy -2.780785 0.85491) (xy -2.8 1.05) (xy -2.780785 1.24509) (xy -2.72388 1.432683) (xy -2.63147 1.60557) (xy -2.507107 1.757107) (xy -2.35557 1.88147) (xy -2.182683 1.97388) (xy -1.99509 2.030785) (xy -1.8 2.05) (xy -1.60491 2.030785) (xy -1.417317 1.97388) (xy -1.24443 1.88147) (xy 0.55557 0.83147) (xy 0.707107 0.707107) (xy 0.83147 0.55557) (xy 0.92388 0.382683) (xy 0.980785 0.19509) (xy 1 0) (xy 0.980785 -0.19509) (xy 0.92388 -0.382683) (xy 0.83147 -0.55557) (xy 0.707107 -0.707107) (xy 0.55557 -0.83147) (xy 0.382683 -0.92388) (xy 0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
      ${p.to.str})
    (pad "2" smd custom (at 4.4 4.7) (size 1 1) (layers "B.Cu") (thermal_bridge_angle 90) (options (clearance outline) (anchor circle)) 
      (primitives (gr_poly (pts (xy -0.19509 -0.980785) (xy -0.382683 -0.92388) (xy -0.55557 -0.83147) (xy -2.35557 0.21853) (xy -2.507107 0.342893) (xy -2.63147 0.49443) (xy -2.72388 0.667317) (xy -2.780785 0.85491) (xy -2.8 1.05) (xy -2.780785 1.24509) (xy -2.72388 1.432683) (xy -2.63147 1.60557) (xy -2.507107 1.757107) (xy -2.35557 1.88147) (xy -2.182683 1.97388) (xy -1.99509 2.030785) (xy -1.8 2.05) (xy -1.60491 2.030785) (xy -1.417317 1.97388) (xy -1.24443 1.88147) (xy 0.55557 0.83147) (xy 0.707107 0.707107) (xy 0.83147 0.55557) (xy 0.92388 0.382683) (xy 0.980785 0.19509) (xy 1 0) (xy 0.980785 -0.19509) (xy 0.92388 -0.382683) (xy 0.83147 -0.55557) (xy 0.707107 -0.707107) (xy 0.55557 -0.83147) (xy 0.382683 -0.92388) (xy 0.19509 -0.980785) (xy 0 -1)) (width 0.1) (fill yes)))
      ${p.to.str})
    `;

		    const switch_3dmodel = `
    (model ${p.switch_3dmodel_filename}
      (offset (xyz ${p.switch_3dmodel_xyz_offset[0]} ${p.switch_3dmodel_xyz_offset[1]} ${p.switch_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.switch_3dmodel_xyz_scale[0]} ${p.switch_3dmodel_xyz_scale[1]} ${p.switch_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.switch_3dmodel_xyz_rotation[0]} ${p.switch_3dmodel_xyz_rotation[1]} ${p.switch_3dmodel_xyz_rotation[2]}))
    )
    `;

		    const hotswap_3dmodel = `
    (model ${p.hotswap_3dmodel_filename}
      (offset (xyz ${p.hotswap_3dmodel_xyz_offset[0]} ${p.hotswap_3dmodel_xyz_offset[1]} ${p.hotswap_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.hotswap_3dmodel_xyz_scale[0]} ${p.hotswap_3dmodel_xyz_scale[1]} ${p.hotswap_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.hotswap_3dmodel_xyz_rotation[0]} ${p.hotswap_3dmodel_xyz_rotation[1]} ${p.hotswap_3dmodel_xyz_rotation[2]}))
    )
	  `;

		    const keycap_3dmodel = `
    (model ${p.keycap_3dmodel_filename}
      (offset (xyz ${p.keycap_3dmodel_xyz_offset[0]} ${p.keycap_3dmodel_xyz_offset[1]} ${p.keycap_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.keycap_3dmodel_xyz_scale[0]} ${p.keycap_3dmodel_xyz_scale[1]} ${p.keycap_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.keycap_3dmodel_xyz_rotation[0]} ${p.keycap_3dmodel_xyz_rotation[1]} ${p.keycap_3dmodel_xyz_rotation[2]}))
    )
	  `;

		    const common_bottom = `
  )
    `;
		    
		    let final = common_top;

		    if (p.include_corner_marks) {
		      final += corner_marks;
		    }

		    if (p.include_keycap) {
		      final += keycap_marks;
		    }

		    if (p.include_led_outline) {
		      final += led_outline;
		    }

		    if (p.include_stem_outline) {
		      final += stem_outline;
		      final += stem_cross_outline;
		    }

		    if (p.hotswap) {
		      if (p.reversible || p.side == "F") {
		        final += hotswap_front;

		        if (p.include_socket_silks) {
		          final += hotswap_silk_front;
		        }

		        if (p.include_socket_fabs) {
		          final += hotswap_fab_front;
		        }
		      }

		      if (p.reversible || p.side == "B") {
		        final += hotswap_back;

		        if (p.include_socket_silks) {
		          final += hotswap_silk_back;
		        }

		        if (p.include_socket_fabs) {
		          final += hotswap_fab_back;
		        }
		      }

		      if (p.hotswap_3dmodel_filename) {
		        final += hotswap_3dmodel;
		      }
		    }
		      
		    if (p.solder) {
		      if (p.reversible && p.include_custom_solder_pads) {
		        if (p.hotswap) {
		          final += solder_custom_reversible_top;
		        } else {
		          final += solder_custom_reversible_bottom;
		        }
		      } else {
		        if (p.reversible || p.side == "F") {
		          final += solder_front;
		        }

		        if (p.reversible || p.side == "B") {
		          final += solder_back;
		        }
		      }
		    }
		    
		    if (p.switch_3dmodel_filename) {
		      final += switch_3dmodel;
		    }

		    if (p.keycap_3dmodel_filename) {
		      final += keycap_3dmodel;
		    }

		    final += common_bottom;
		    return final
		  }
		};
		return switch_gateron_ks27_ks33;
	}

	/*
	Copyright (c) 2023 Marco Massarelli

	SPDX-License-Identifier: MIT

	To view a copy of this license, visit https://opensource.org/license/mit/

	Author: @ceoloide

	Description:
	   Cherry MX compatible reversible and hotswappable footprint.

	Notes:
	- Hotswap and solder can be used together. The solder holes will then be
	  added above the hotswap holes.

	Nets:
	   from: corresponds to pin 1
	   to: corresponds to pin 2

	Params:
	  side: default is B for Back
	    the side on which to place the single-side footprint and designator, either F or B
	  reversible: default is false
	    if true, the footprint will be placed on both sides so that the PCB can be
	    reversible
	  hotswap: default is true
	    if true, will include holes and pads for Kailh choc hotswap sockets
	  hotswap_pads_same_side: false
	    if true, and if not using plated holes, it will position the pads so that nets are on
	    the same side to simplify routing.
	  include_traces_vias: default is true
	    if true it will include traces and vias when hotswap is true, footprint is reversible
	    and when no plated holes are used, to simplify routing. In the other cases it's simply
	    not needed.
	  trace_width: default is 0.200mm
	    allows to override the trace width that connects the pads. Not recommended
	    to go below 0.15mm (JLCPC min is 0.127mm), or above 0.200mm to avoid DRC errors.
	  via_size: default is 0.6
	    allows to define the size of the via. Not recommended below 0.56 (JLCPCB minimum),
	    or above 0.8 (KiCad default), to avoid overlap or DRC errors
	  via_drill: default is 0.3
	    allows to define the size of the drill. Not recommended below 0.3 (JLCPCB minimum),
	    or above 0.4 (KiCad default), to avoid overlap or DRC errors 
	  locked_traces_vias: false
	    sets the traces and vias as locked in KiCad. Locked objects may not be manipulated
	    or moved, and cannot be selected unless the Locked Items option is enabled in the
	    Selection Filter panel in KiCad. Useful for a faster workflow. If using autorouting
	    solutions like Freerouting, locking can prevent the traces and vias from being
	    replaced.
	  solder: default is false
	    if true, will include holes to solder switches (works with hotswap too)
	  include_plated_holes: default is false
	    Alternate version of the footprint compatible with side, reversible, hotswap, solder
	    options in any combination. Pretty, allows for connecting ground fill zones via
	    center hole, and allows for setting nets on stabilizers for your routing needs.
	  include_stabilizer_nets: default is false
	    if true, will add adjustable nets to plated stabilizer holes, 
	    LEFTSTAB: default is "D1"
	    RIGHTSTAB: default is "D2"
	  include_centerhole_net: default is false
	    if true, will add adjustable net to the center hole
	    CENTERHOLE: default is "GND"
	  outer_pad_width_front: default 2.6
	  outer_pad_width_back: default 2.6
	    Allows you to make the outer hotswap pads smaller to silence DRC
	    warnings when the sockets are too close to the edge cuts. It's not
	    recommended to go below 1.6mm to ensure the hotswap socket can be
	    properly soldered.
	  outer_pad_height: default 2.5 (mm)
	    Allows you to make the outer hotswap pad vertically shorter, e.g. to make room for 
	    encoder pads to be colocated with the switch (use 2.0mm for EC12).  
	   stabilizers_diameter: default is 1.9 (mm)
	     Allows you to narrow stabilizer / boss holes diameter for tighter fit, not
	     recommended to set below 1.7mm.
	  include_keycap: default is false
	    if true, will add mx sized keycap box around the footprint (18mm)
	  keycap_width: default is 18 (mm - default MX size)
	    Allows you to adjust the height of the keycap outline.
	  keycap_height: default is 18 (mm - default MX size)
	    Allows you to adjust the width of the keycap outline. For example,
	    to show a 1.5u outline for easier aligning.
	  include_corner_marks: default is false
	    if true, will add corner marks to indicate plate hole size and position
	  include_silkscreen: default is true
	    if true it will include the silkscreen. Recommended to be true to ensure connector
	    polarity is not reversed, which can lead to shorting and damage to the MCU
	  switch_3dmodel_filename: default is ''
	    Allows you to specify the path to a 3D model STEP or WRL file to be
	    used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
	    a KiCad configured path.
	  switch_3dmodel_xyz_offset: default is [0, 0, 0]
	    xyz offset (in mm), used to adjust the position of the 3d model
	    relative the footprint.
	  switch_3dmodel_xyz_scale: default is [1, 1, 1]
	    xyz scale, used to adjust the size of the 3d model relative to its
	    original size.
	  switch_3dmodel_xyz_rotation: default is [0, 0, 0]
	    xyz rotation (in degrees), used to adjust the orientation of the 3d
	    model relative the footprint.
	  hotswap_3dmodel_filename: default is ''
	    Allows you to specify the path to a 3D model to be used when rendering
	    the PCB. Allows for paths using a configured path by using the
	    ${VAR_NAME} syntax.
	  hotswap_3dmodel_xyz_offset: default is [0, 0, 0]
	    xyz offset (in mm), used to adjust the position of the 3d model
	    relative the footprint.
	  hotswap_3dmodel_xyz_scale: default is [1, 1, 1]
	    xyz scale, used to adjust the size of the 3d model relative its
	    original size.
	  hotswap_3dmodel_xyz_rotation: default is [0, 0, 0]
	    xyz rotation (in degrees), used to adjust the orientation of the 3d
	    model relative the footprint.
	  keycap_3dmodel_filename: default is ''
	    Allows you to specify the path to a 3D model STEP or WRL file to be
	    used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
	    a KiCad configured path.
	  keycap_3dmodel_xyz_offset: default is [0, 0, 0]
	    xyz offset (in mm), used to adjust the position of the 3d model
	    relative the footprint.
	  keycap_3dmodel_xyz_scale: default is [1, 1, 1]
	    xyz scale, used to adjust the size of the 3d model relative to its
	    original size.
	  keycap_3dmodel_xyz_rotation: default is [0, 0, 0]
	    xyz rotation (in degrees), used to adjust the orientation of the 3d
	    model relative the footprint.
	*/

	var switch_mx;
	var hasRequiredSwitch_mx;

	function requireSwitch_mx () {
		if (hasRequiredSwitch_mx) return switch_mx;
		hasRequiredSwitch_mx = 1;
		switch_mx = {
		  params: {
		    designator: 'S',
		    side: 'B',
		    reversible: false,
		    hotswap: true,
		    hotswap_pads_same_side: false,
		    include_traces_vias: true,
		    trace_width: 0.2,
		    via_size: 0.6,
		    via_drill: 0.3,
		    locked_traces_vias: false,
		    include_plated_holes: false,
		    include_stabilizer_nets: false,
		    include_centerhole_net: false,
		    solder: false,
		    outer_pad_width_front: 2.6,
		    outer_pad_width_back: 2.6,
		    outer_pad_height: 2.5,
		    stabilizers_diameter: 1.9,
		    include_keycap: false,
		    keycap_width: 18,
		    keycap_height: 18,
		    include_corner_marks: false,
		    include_silkscreen: true,
		    switch_3dmodel_filename: '',
		    switch_3dmodel_xyz_offset: [0, 0, 0],
		    switch_3dmodel_xyz_rotation: [0, 0, 0],
		    switch_3dmodel_xyz_scale: [1, 1, 1],
		    hotswap_3dmodel_filename: '',
		    hotswap_3dmodel_xyz_offset: [0, 0, 0],
		    hotswap_3dmodel_xyz_rotation: [0, 0, 0],
		    hotswap_3dmodel_xyz_scale: [1, 1, 1],
		    keycap_3dmodel_filename: '',
		    keycap_3dmodel_xyz_offset: [0, 0, 0],
		    keycap_3dmodel_xyz_rotation: [0, 0, 0],
		    keycap_3dmodel_xyz_scale: [1, 1, 1],
		    from: undefined,
		    to: undefined,
		    CENTERHOLE: { type: 'net', value: 'GND'},
		    LEFTSTAB: { type: 'net', value: 'D1' },
		    RIGHTSTAB: { type: 'net', value: 'D2' }
		  },
		  body: p => {
		    const common_top = `
  (footprint "ceoloide:switch_mx"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 -7.5 180)
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    
    (pad "" ${!p.include_plated_holes ? `np_thru_hole` : `thru_hole`} circle 
      (at 0 0 ${p.r})
      (size ${p.include_plated_holes ? `4.4 4.4` : `4.1 4.1`})
      (drill 4.1)
      (layers "*.Cu" "*.Mask")
      ${p.include_plated_holes && p.include_centerhole_net ? p.CENTERHOLE : ''}
    )
    (pad "" ${!p.include_plated_holes ? `np_thru_hole` : `thru_hole`} circle 
      (at 5.08 0 ${p.r})
      (size ${p.stabilizers_diameter + (p.include_plated_holes ? 0.3 : 0)} ${p.stabilizers_diameter + (p.include_plated_holes ? 0.3 : 0)})
      (drill ${p.stabilizers_diameter})
      (layers "*.Cu" "*.Mask")
      ${p.include_plated_holes && p.include_centerhole_net ? p.RIGHTSTAB : ''}
    )
    (pad "" ${!p.include_plated_holes ? `np_thru_hole` : `thru_hole`} circle 
      (at -5.08 0 ${p.r})
      (size ${p.stabilizers_diameter + (p.include_plated_holes ? 0.3 : 0)} ${p.stabilizers_diameter + (p.include_plated_holes ? 0.3 : 0)})
      (drill ${p.stabilizers_diameter})
      (layers "*.Cu" "*.Mask")
      ${p.include_plated_holes && p.include_centerhole_net ? p.LEFTSTAB : ''}
    )
    `;
		    const corner_marks = `
    (fp_line (start -7 -6) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -7 7) (end -6 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -6 -7) (end -7 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start -7 7) (end -7 6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 6) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -7) (end 6 -7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 6 7) (end 7 7) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start 7 -7) (end 7 -6) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    `;
		    const keycap_xo = 0.5 * p.keycap_width;
		    const keycap_yo = 0.5 * p.keycap_height;
		    const keycap_marks = `
    (fp_rect (start ${keycap_xo} ${keycap_yo}) (end ${-keycap_xo} ${-keycap_yo}) (layer "Dwgs.User") (stroke (width 0.15) (type solid)) (fill none))
    `;

		    const hotswap_front = `
		(pad "" np_thru_hole circle (at -2.54 -5.08 180) (size 3 3) (drill 3) (layers "F&B.Cu" "*.Mask"))
		(pad "" np_thru_hole circle (at 3.81 -2.54 180) (size 3 3) (drill 3) (layers "F&B.Cu" "*.Mask"))
		(pad "1" smd rect (at 7.085 -2.54 ${p.r}) (size 2.55 ${p.outer_pad_height}) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from})
		(pad "2" smd ${p.reversible ? 'roundrect' : 'rect'}
      (at -5.842 -5.08 ${p.r})
      (size 2.55 2.5)
      (layers "F.Cu" "F.Paste" "F.Mask")${p.reversible ? `
			(roundrect_rratio 0)
			(chamfer_ratio 0.2)
			(chamfer bottom_right)` : ''}
      ${p.to}
    )
    `;

		    const hotswap_back = `
		(pad "" np_thru_hole circle (at 2.54 -5.08 180) (size 3 3) (drill 3) (layers "F&B.Cu" "*.Mask"))
		(pad "" np_thru_hole circle (at -3.81 -2.54 180) (size 3 3) (drill 3) (layers "F&B.Cu" "*.Mask"))
		(pad "1" smd rect
      (at -7.085 -2.54 ${p.r})
      (size 2.55 ${p.outer_pad_height})
      (layers "B.Cu" "B.Paste" "B.Mask")
      ${p.hotswap_pads_same_side ? p.to : p.from}
    )
		(pad "2" smd ${p.reversible ? 'roundrect' : 'rect'}
      (at 5.842 -5.08 ${p.r})
      (size 2.55 2.5)
      (layers "B.Cu" "B.Paste" "B.Mask")${p.reversible ? `
			(roundrect_rratio 0)
			(chamfer_ratio 0.2)
			(chamfer bottom_left)` : ''}
      ${p.hotswap_pads_same_side ? p.from : p.to}
    )
    `;

		    const hotswap_silkscreen_back = `
		(fp_poly
			(pts
				(xy -3.6 -6.5) (xy -3.8 -6.5) (xy -4.1 -6.45) (xy -4.4 -6.35) (xy -4.6 -6.25) (xy -4.75 -6.15) (xy -4.95 -6)
				(xy -5.1 -5.85) (xy -5.25 -5.65) (xy -5.4 -5.4) (xy -5.5 -5) (xy -5.5 -4.6) (xy -5.35 -4.5) (xy -5.2 -4.4)
				(xy -4.75 -4.65) (xy -4.5 -4.75) (xy -4.05 -4.85) (xy -3.55 -4.85) (xy -2.95 -4.7) (xy -2.45 -4.4) (xy -2.15 -4.15)
        (xy -1.75 -3.6) (xy -1.55 -3.05) (xy -1.5 -2.6) (xy -1.25 -2.8) (xy -0.9 -2.9) (xy -0.4 -2.95) (xy 1.65 -2.95)
        (xy 1.2 -3.2) (xy 0.95 -3.4) (xy 0.65 -3.75) (xy 0.5 -4) (xy 0.35 -4.35) (xy 0.25 -4.75) (xy 0.25 -5.05)
        (xy 0.25 -5.4) (xy 0.3 -5.65) (xy 0.45 -6.05) (xy 0.75 -6.5)
			)
			(stroke (width 0.4) (type solid))
			(fill solid)
			(layer "B.SilkS")
		)
    `;
		    const hotswap_silkscreen_front = `
		(fp_poly
			(pts
				(xy 3.6 -6.5) (xy 3.8 -6.5) (xy 4.1 -6.45) (xy 4.4 -6.35) (xy 4.6 -6.25) (xy 4.75 -6.15) (xy 4.95 -6)
				(xy 5.1 -5.85) (xy 5.25 -5.65) (xy 5.4 -5.4) (xy 5.5 -5) (xy 5.5 -4.6) (xy 5.35 -4.5) (xy 5.2 -4.4)
				(xy 4.75 -4.65) (xy 4.5 -4.75) (xy 4.05 -4.85) (xy 3.55 -4.85) (xy 2.95 -4.7) (xy 2.45 -4.4) (xy 2.15 -4.15)
				(xy 1.75 -3.6) (xy 1.55 -3.05) (xy 1.5 -2.6) (xy 1.25 -2.8) (xy 0.9 -2.9) (xy 0.4 -2.95) (xy -1.65 -2.95)
				(xy -1.2 -3.2) (xy -0.95 -3.4) (xy -0.65 -3.75) (xy -0.5 -4) (xy -0.35 -4.35) (xy -0.25 -4.75) (xy -0.25 -5.05)
				(xy -0.25 -5.4) (xy -0.3 -5.65) (xy -0.45 -6.05) (xy -0.75 -6.5)
			)
			(stroke (width 0.4) (type solid))
			(fill solid)
			(layer "F.SilkS")
		)
    `;
		    const hotswap_silkscreen_reversible = `
		(fp_line (start 1.22 -3.77) (end 0 -2.52) (stroke (width 0.1) (type default)) (layer "B.SilkS"))
		(fp_line (start 0 -2.52) (end -1.88 -2.52) (stroke (width 0.1) (type default)) (layer "B.SilkS"))
		(fp_line (start -1.22 -3.77) (end 0 -2.52) (stroke (width 0.1) (type default)) (layer "F.SilkS"))
		(fp_line (start 0 -2.52) (end 1.88 -2.52) (stroke (width 0.1) (type default)) (layer "F.SilkS"))
    `;

		    const solder_front = `
    (pad "1" thru_hole circle (at ${p.solder && p.hotswap ? '' : '-'}2.54 ${p.solder && p.hotswap ? '' : '-'}5.08) (size 2.286 2.286) (drill 1.4986) (layers "F&B.Cu" "*.Mask") ${p.from})
    (pad "2" thru_hole circle (at ${p.solder && p.hotswap ? '-' : ''}3.81 ${p.solder && p.hotswap ? '' : '-'}2.54) (size 2.286 2.286) (drill 1.4986) (layers "F&B.Cu" "*.Mask") ${p.to})
    `;
		    const solder_back = `
    (pad "1" thru_hole circle (at ${p.solder && p.hotswap ? '-' : ''}2.54 ${p.solder && p.hotswap ? '' : '-'}5.08) (size 2.286 2.286) (drill 1.4986) (layers "F&B.Cu" "*.Mask") ${p.from})
    (pad "2" thru_hole circle (at ${p.solder && p.hotswap ? '' : '-'}3.81 ${p.solder && p.hotswap ? '' : '-'}2.54) (size 2.286 2.286) (drill 1.4986) (layers "F&B.Cu" "*.Mask") ${p.to})
    `;

		    const switch_3dmodel = `
    (model ${p.switch_3dmodel_filename}
      (offset (xyz ${p.switch_3dmodel_xyz_offset[0]} ${p.switch_3dmodel_xyz_offset[1]} ${p.switch_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.switch_3dmodel_xyz_scale[0]} ${p.switch_3dmodel_xyz_scale[1]} ${p.switch_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.switch_3dmodel_xyz_rotation[0]} ${p.switch_3dmodel_xyz_rotation[1]} ${p.switch_3dmodel_xyz_rotation[2]}))
    )
    `;

		    const hotswap_3dmodel = `
    (model ${p.hotswap_3dmodel_filename}
      (offset (xyz ${p.hotswap_3dmodel_xyz_offset[0]} ${p.hotswap_3dmodel_xyz_offset[1]} ${p.hotswap_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.hotswap_3dmodel_xyz_scale[0]} ${p.hotswap_3dmodel_xyz_scale[1]} ${p.hotswap_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.hotswap_3dmodel_xyz_rotation[0]} ${p.hotswap_3dmodel_xyz_rotation[1]} ${p.hotswap_3dmodel_xyz_rotation[2]}))
    )
	  `;

		    const keycap_3dmodel = `
    (model ${p.keycap_3dmodel_filename}
      (offset (xyz ${p.keycap_3dmodel_xyz_offset[0]} ${p.keycap_3dmodel_xyz_offset[1]} ${p.keycap_3dmodel_xyz_offset[2]}))
      (scale (xyz ${p.keycap_3dmodel_xyz_scale[0]} ${p.keycap_3dmodel_xyz_scale[1]} ${p.keycap_3dmodel_xyz_scale[2]}))
      (rotate (xyz ${p.keycap_3dmodel_xyz_rotation[0]} ${p.keycap_3dmodel_xyz_rotation[1]} ${p.keycap_3dmodel_xyz_rotation[2]}))
    )
	  `;
		    const common_bottom = `
  )
    `;

		    const hotswap_routes_unplated = `
	(segment
		(start ${p.eaxy(-5.842, -5.08)})
		(end ${p.eaxy(-3.963, -6.959)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.to.index})
	)
	(segment
		(start ${p.eaxy(-3.963, -6.959)})
		(end ${p.eaxy(0, -6.959)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.from.index})
	)
	(via
		(at ${p.eaxy(0, -6.959)})
		(size ${p.via_size})
    (drill ${p.via_drill})
		(layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(0, -6.959)})
		(end ${p.eaxy(3.963, -6.9595)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(3.963, -6.959)})
		(end ${p.eaxy(5.842, -5.08)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.from.index})
  )
	(segment
    (start ${p.eaxy(0, -5.93)})
    (end ${p.eaxy(1.029, -6.959)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "F.Cu")
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(4.166, -6.959)})
    (end ${p.eaxy(7.085, -4.04)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "F.Cu")
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(7.085, -4.04)})
    (end ${p.eaxy(7.085, -2.54)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "F.Cu")
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(1.029, -6.959)})
    (end ${p.eaxy(4.166, -6.959)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "F.Cu")
    (net ${p.to.index})
  )
  (via
    (at ${p.eaxy(0, -5.93)})
		(size ${p.via_size})
    (drill ${p.via_drill})
    (layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(-4.166, -6.959)})
    (end ${p.eaxy(-1.029, -6.959)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "B.Cu")
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(-7.085, -2.54)})
    (end ${p.eaxy(-7.085, -4.04)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "B.Cu")
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(-7.085, -4.04)})
    (end ${p.eaxy(-4.166, -6.959)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "B.Cu")
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(-1.029, -6.959)})
    (end ${p.eaxy(0, -5.93)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "B.Cu")
    (net ${p.to.index})
  )
    `;
		    const hotswap_routes_same_side = `
	(segment
		(start ${p.eaxy(7.085, -4.415)})
		(end ${p.eaxy(7.085, -2.54)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(7.75, -5.08)})
		(end ${p.eaxy(7.085, -4.415)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "F.Cu")
		(net ${p.from.index})
	)
	(via
		(at ${p.eaxy(7.75, -5.08)})
		(size ${p.via_size})
    (drill ${p.via_drill})
		(layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(net ${p.from.index})
	)
	(segment
		(start ${p.eaxy(5.842, -5.08)})
		(end ${p.eaxy(7.75, -5.08)})
		(width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
		(layer "B.Cu")
		(net ${p.from.index})
	)

	(segment
    (start ${p.eaxy(-7.085, -4.415)})
    (end ${p.eaxy(-7.085, -2.54)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "B.Cu")
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(-7.75, -5.08)})
    (end ${p.eaxy(-7.085, -4.415)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "B.Cu")
    (net ${p.to.index})
  )
  (via
    (at ${p.eaxy(-7.75, -5.08)})
		(size ${p.via_size})
    (drill ${p.via_drill})
    (layers "F.Cu" "B.Cu")
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (net ${p.to.index})
  )
  (segment
    (start ${p.eaxy(-5.842, -5.08)})
    (end ${p.eaxy(-7.75, -5.08)})
    (width ${p.trace_width})
    (locked ${p.locked_traces_vias ? 'yes' : 'no'})
    (layer "F.Cu")
    (net ${p.to.index})
  )
    `;

		    let final = common_top;
		    if (p.include_corner_marks) {
		      final += corner_marks;
		    }
		    if (p.include_keycap) {
		      final += keycap_marks;
		    }
		    if (p.hotswap) {
		      if (p.reversible || p.side == "F") {
		        final += hotswap_front;
		        if (p.include_silkscreen && !p.reversible) {
		          final += hotswap_silkscreen_front;
		        }
		      }
		      if (p.reversible || p.side == "B") {
		        final += hotswap_back;
		        if (p.include_silkscreen && !p.reversible) {
		          final += hotswap_silkscreen_back;
		        }
		      }
		      if (p.hotswap_3dmodel_filename) {
		        final += hotswap_3dmodel;
		      }
		      if (p.include_silkscreen && p.reversible) {
		        final += hotswap_silkscreen_reversible;
		      }
		    }
		    if (p.solder) {
		      if (p.reversible || p.side == "F") {
		        final += solder_front;
		      }
		      if (p.reversible || p.side == "B") {
		        final += solder_back;
		      }
		    }

		    if (p.switch_3dmodel_filename) {
		      final += switch_3dmodel;
		    }

		    if (p.keycap_3dmodel_filename) {
		      final += keycap_3dmodel;
		    }

		    final += common_bottom;

		    if (p.reversible && p.hotswap && p.include_traces_vias && !p.include_plated_holes) {
		      if(p.hotswap_pads_same_side){
		        final += hotswap_routes_same_side;
		      } else {
		        final += hotswap_routes_unplated;
		      }
		    }

		    return final
		  }
		};
		return switch_mx;
	}

	var trrs_pj320a;
	var hasRequiredTrrs_pj320a;

	function requireTrrs_pj320a () {
		if (hasRequiredTrrs_pj320a) return trrs_pj320a;
		hasRequiredTrrs_pj320a = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Authors: @ergogen + @ceoloide improvements
		//
		// Description:
		//  A reversible "PJ-320A" TRRS footprint similar to the one used on
		//  the Corne keyboard, and available at LCSC. The footprint offers many
		//  customization options.
		//
		//  Normal / single side
		//     ____________________
		//    |                   |_
		//    | (R1)              | |
		//    |                   |_|
		//    |___(TP)___(R2)_(SL)|
		// 
		//  Reversible
		//     ____________________
		//    |   (TP)   (R2) (SL)|_
		//    | (R1)              | |
		//    | (R1)              |_|
		//    |___(TP)___(R2)_(SL)|
		//
		// Reversible & symmetrical
		//     ___________________
		//    | ( TP) (R2)   (SL)|_
		//    |                  |_|
		//    |_( TP)_(R2)___(SL)|
		//
		// Datasheet:
		//  https://datasheet.lcsc.com/lcsc/2311241628_Hong-Cheng-HC-PJ-320A_C7501806.pdf
		//
		// Nets:
		//    SL: corresponds to pin 2 (Sleeve)
		//    R2: corresponds to pin 3 (Ring 2)
		//    R1: corresponds to pin 1 (Ring 1)
		//    TP: corresponds to pin 4 (Tip)
		//
		// Warning:
		//    TRRS cables should never be hotswapped (removed or inserted when the MCU is turned on).
		//    To minimize the chance of damaging the MCU, connect VCC to the tip (TP) and GND on the
		//    sleeve (SL).
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    reversible: default is false
		//      if true, the footprint will be placed on both sides so that the PCB can be
		//      reversible
		//    symmetric: default is false
		//      if true, it will only work if reversible is also true. This will cause the
		//      footprint to be symmetrical on each half, however reducing the footprint
		//      to three pins: TP, R2, and SL
		//
		// @ceoloide's improvements:
		//  - Add oval pad when symmetrical
		//  - Adjust positioning to be symmetrical
		//  - Revamp pinout and nets
		//  - Upgrade to KiCad 8

		trrs_pj320a = {
		  params: {
		    designator: 'TRRS',
		    side: 'F',
		    reversible: false,
		    symmetric: false,
		    TP: { type: 'net', value: 'TP' },
		    R1: { type: 'net', value: 'R1' },
		    R2: { type: 'net', value: 'R2' },
		    SL: { type: 'net', value: 'SL' },
		  },
		  body: p => {

		    let footprint_name = "trrs_pj320a";
		    if (p.reversible) {
		      if (p.symmetric) {
		        footprint_name += " (reversible, symmetric)";
		      } else {
		        footprint_name += " (reversible)";
		      }
		    }

		    const standard_opening = `
  (footprint "ceoloide:${footprint_name}"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 14.2 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    `;
		    function corner_marks(offset_x) {
		      return `
    (fp_line (start ${2.8 + offset_x} -2) (end ${ -2.8 + offset_x} -2) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start ${ -2.8 + offset_x} 0) (end ${ -2.8 + offset_x} -2) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start ${2.8 + offset_x} 0) (end ${2.8 + offset_x} -2) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start ${ -3.05 + offset_x} 0) (end ${ -3.05 + offset_x} 12.1) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start ${3.05 + offset_x} 0) (end ${3.05 + offset_x} 12.1) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start ${3.05 + offset_x} 12.1) (end ${ -3.05 + offset_x} 12.1) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
    (fp_line (start ${3.05 + offset_x} 0) (end ${ -3.05 + offset_x} 0) (layer "Dwgs.User") (stroke (width 0.15) (type solid)))
      `
		    }
		    function stabilizers(def_pos) {
		      return `
    (pad "" np_thru_hole circle (at ${def_pos} 8.6 ${p.r}) (size 1.5 1.5) (drill 1.5) (layers "*.Cu" "*.Mask"))
    (pad "" np_thru_hole circle (at ${def_pos} 1.6 ${p.r}) (size 1.5 1.5) (drill 1.5) (layers "*.Cu" "*.Mask"))
      `
		    }
		    function pins(def_neg, def_pos) {
		      if (p.symmetric && p.reversible) {
		        return `
    (pad 2 thru_hole oval (at ${def_pos} 3.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers "*.Cu" "*.Mask") ${p.SL.str})
    (pad 3 thru_hole oval (at ${def_pos} 6.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers "*.Cu" "*.Mask") ${p.R2.str})
    (pad 4 thru_hole oval (at ${def_pos} 10.75 ${p.r}) (size 1.6 3.3) (drill oval 0.9 2.6) (layers "*.Cu" "*.Mask") ${p.TP.str})
        `
		      } else {
		        return `
    (pad 2 thru_hole oval (at ${def_pos} 3.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers "*.Cu" "*.Mask") ${p.SL.str})
    (pad 3 thru_hole oval (at ${def_pos} 6.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers "*.Cu" "*.Mask") ${p.R2.str})
    (pad 4 thru_hole oval (at ${def_pos} 10.2 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers "*.Cu" "*.Mask") ${p.TP.str})
    (pad 5 thru_hole oval (at ${def_neg} 11.3 ${p.r}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers "*.Cu" "*.Mask") ${p.R1.str})
        `
		      }
		    }
		    if (p.reversible & p.symmetric) {
		      return `
    ${standard_opening}
    ${corner_marks(0)}
    ${stabilizers(0)}
    ${pins(2.3, -2.3)}
    ${pins(-2.3, 2.3)}
  )
      `
		    } else if (p.reversible) {
		      return `
    ${standard_opening}
    ${corner_marks(1.15)}
    ${stabilizers(-1.15)}
    ${stabilizers(1.15)}
    ${pins(-1.15, 3.45)}
    ${pins(1.15, -3.45)}
  )
      `
		    } else {
		      return `
    ${standard_opening}
    ${corner_marks(0)}
    ${stabilizers(0)}
    ${p.side == 'F' ? pins(-2.3, 2.3) : pins(2.3, -2.3) }
  )
    `
		    }
		  }
		};
		return trrs_pj320a;
	}

	var utility_ergogen_logo;
	var hasRequiredUtility_ergogen_logo;

	function requireUtility_ergogen_logo () {
		if (hasRequiredUtility_ergogen_logo) return utility_ergogen_logo;
		hasRequiredUtility_ergogen_logo = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @dieseltravis + @ceoloide improvements
		//
		// Description:
		//  A 5mm x 5mmm Ergogen logo that can be scaled and assigned to any layer of your board.
		//  Make sure to add it to your board and spread the love <3
		//
		//  Note that some fine details may be lost depending on scale and fab capabilities.
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the logo. When the backside is selected, the logo will
		//      be mirrored automatically
		//    layer: default is 'SilkS' (Silkscreen layer)
		//      the layer where the logo will be placed, useful to have copper + soldermask texts
		//    reversible: default is false
		//      adds the logo on both sides, taking care of mirroring the backside
		//    scale: default is 1.0 (100%)
		//      the scale ratio to apply to the logo, to make it bigger or smaller
		//
		// @ceoloide's improvements:
		//  - Mirror the logo when added to the back layer
		//  - Add reversible option to add the logo on both layers
		//  - Ensure numbers have at most 6 decimals (KiCad max precision)
		//  - Upgrade to KiCad 8

		utility_ergogen_logo = {
		  params: {
		    designator: 'LOGO',
		    side: 'F',
		    layer: 'SilkS',
		    reversible: false,
		    scale: 1.0,
		  },
		  body: p => {
		    const scaled_point = (x, y, scale, mirrored) => {
		      let scaled_x = x * scale * (mirrored ? -1 : 1.0);
		      let scaled_y = y * scale;
		      return `(xy ${scaled_x.toFixed(6)} ${scaled_y.toFixed(6)})`
		    };
		    const fp_poly = (side, layer, scale, mirrored) => {
		      const s = scale;
		      const m = mirrored;
		      return `
    (fp_poly 
      (pts
          ${scaled_point(2.501231, 0, s, m)} ${scaled_point(2.501231, 2.501231, s, m)} ${scaled_point(0, 2.501231, s, m)} ${scaled_point(-2.50123, 2.501231, s, m)} ${scaled_point(-2.50123, 1.013088, s, m)}
          ${scaled_point(-1.738355, 1.013088, s, m)} ${scaled_point(-0.021885, 1.009917, s, m)} ${scaled_point(1.694584, 1.006746, s, m)} ${scaled_point(1.697905, 0.662827, s, m)} ${scaled_point(1.701225, 0.318907, s, m)}
          ${scaled_point(1.52891, 0.490867, s, m)} ${scaled_point(1.356594, 0.662827, s, m)} ${scaled_point(-0.19088, 0.662827, s, m)} ${scaled_point(-1.738355, 0.662827, s, m)} ${scaled_point(-1.738355, 0.837957, s, m)}
          ${scaled_point(-1.738355, 1.013088, s, m)} ${scaled_point(-2.50123, 1.013088, s, m)} ${scaled_point(-2.50123, 0.150074, s, m)} ${scaled_point(-1.394101, 0.150074, s, m)} ${scaled_point(-0.637478, 0.150074, s, m)}
          ${scaled_point(0.119144, 0.150074, s, m)} ${scaled_point(0.293895, -0.025012, s, m)} ${scaled_point(0.468646, -0.200098, s, m)} ${scaled_point(-0.287976, -0.200098, s, m)} ${scaled_point(-1.044599, -0.200098, s, m)}
          ${scaled_point(-1.21935, -0.025012, s, m)} ${scaled_point(-1.394101, 0.150074, s, m)} ${scaled_point(-2.50123, 0.150074, s, m)} ${scaled_point(-2.50123, 0, s, m)} ${scaled_point(-2.50123, -1.063023, s, m)}
          ${scaled_point(-1.738355, -1.063023, s, m)} ${scaled_point(-1.738355, -0.887937, s, m)} ${scaled_point(-1.738355, -0.71285, s, m)} ${scaled_point(-0.190545, -0.71285, s, m)} ${scaled_point(1.357266, -0.71285, s, m)}
          ${scaled_point(1.525751, -0.544017, s, m)} ${scaled_point(1.578342, -0.491483, s, m)} ${scaled_point(1.624575, -0.445614, s, m)} ${scaled_point(1.661679, -0.409133, s, m)} ${scaled_point(1.686885, -0.384763, s, m)}
          ${scaled_point(1.697422, -0.375226, s, m)} ${scaled_point(1.697537, -0.375184, s, m)} ${scaled_point(1.698399, -0.387158, s, m)} ${scaled_point(1.699177, -0.420952, s, m)} ${scaled_point(1.69984, -0.473372, s, m)}
          ${scaled_point(1.700359, -0.541225, s, m)} ${scaled_point(1.700701, -0.62132, s, m)} ${scaled_point(1.700836, -0.710463, s, m)} ${scaled_point(1.700837, -0.719103, s, m)} ${scaled_point(1.700837, -1.063023, s, m)}
          ${scaled_point(-0.018759, -1.063023, s, m)} ${scaled_point(-1.738355, -1.063023, s, m)} ${scaled_point(-2.50123, -1.063023, s, m)} ${scaled_point(-2.50123, -2.50123, s, m)} ${scaled_point(0, -2.50123, s, m)}
          ${scaled_point(2.501231, -2.50123, s, m)}
      )
			(stroke
				(width 0.01)
				(type solid)
			)
			(fill solid)
      (layer "${side}.${layer}")
    )
      `
		    };
		    const common_top = `
  (footprint "ceoloide:utility_ergogen_logo"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at ${p.scale * 4.572} 0 ${p.r})
      (layer "${p.side}.Fab")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
		(attr exclude_from_pos_files exclude_from_bom)
    `;
		    const common_bottom = `
  )
    `;
		    let ergogen_log_fp = common_top;
		    if (p.reversible) {
		      ergogen_log_fp += fp_poly('F', p.layer, p.scale, false);
		      ergogen_log_fp += fp_poly('B', p.layer, p.scale, true);
		    } else {
		      ergogen_log_fp += fp_poly(p.side, p.layer, p.scale, p.side == 'B');
		    }
		    ergogen_log_fp += common_bottom;
		    return ergogen_log_fp
		  }
		};
		return utility_ergogen_logo;
	}

	var utility_filled_zone;
	var hasRequiredUtility_filled_zone;

	function requireUtility_filled_zone () {
		if (hasRequiredUtility_filled_zone) return utility_filled_zone;
		hasRequiredUtility_filled_zone = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @ceoloide
		//
		// Description:
		//  A KiCad native filled zone, for example a copper fill or hatch pattern.
		//
		// NOTE: Filled zones need to be calculated at least once or they'll result
		//       empty.
		//
		// Params:
		//    side: default is 'F&B' for both Front and Back
		//      the side on which to place the filled zone, either 'F' for Front, 'B'
		//      for Back, or 'F&B' for both.
		//    name: default is '' (no name)
		//      an optional name to give to the zone.
		//    priority: default is 0
		//      an optional priority to give to the zone
		//    locked: default is false
		//      if true it will lock the resulting fill.
		//    corner_smoothing: default is chamfer
		//      allows to specify the type of corner smoothing ('none', 'chamfer',
		//      'fillet').
		//    smoothing_radius: default is 0.5
		//      the radius of the corner smoothing, valid when 'chamfer' or
		//      'fillet' are selected.
		//    net: default is GND
		//      the net connected to this filled zone, for example GND
		//    pad_clearance: default is 0.508
		//      the electrical clearance to be applied (in mm). KiCad default
		//      is 0.508.
		//    min_thickness: default is 0.25
		//      the minimum thickness of the zone areas (in mm). KiCad default
		//      is 0.25 to match default net properties. It shouldn't be lowered
		//      below 0.127 (the min width JLCPCB handles).
		//    connect_pads: default is ''
		//      whether pads should be connected, one of '' (thermal reliefs), 
		//      'yes' (solid connection), 'thru_hole_only', or 'no'.
		//    thermal_gap: default is 0.5
		//      the thermal relief gap (in mm), with KiCad default being 0.5
		//    thermal_bridge_width: default is 0.5
		//      the thermal relief spoke width (in mm), with KiCad default being 0.5
		//    remove_islands: default is 'never'
		//      whether to remove islands, one of 'never', 'always', or 'below_area_limit'
		//    min_island_size: default is 5
		//      the min island size in mm^2 to be kept if island should be removed below
		//      a given area limit.
		//    fill_type: default is 'solid'
		//      the type of fill, either 'solid' or 'hatch'
		//    hatch_thickness: default is 1
		//      the thickness of the hatch pattern (in mm)
		//    hatch_gap: default is 1.5
		//      the hatch gap size (in mm)
		//    hatch_orientation: default is 0
		//      the orientation of the hatch pattern (in degrees)
		//    hatch_smoothing_level: default is 0
		//      the level of smoothing to apply to the hatch pattern algorithm,
		//      between 0 and 3
		//    hatch_smoothing_value: default is 0.1
		//      the smoothing value used by the hatch smoothing algorithm,
		//      between 0.0 and 1.0
		//    points: default is [[0,0],[420,0],[420,297],[0,297]]
		//      an array containing the polygon points of the filled area, in
		//      xy coordinates relative to the PCB. The default is a square area of
		//      420x297mm^2 located at (0,0) xy coordinates, essentially filling the
		//      entire "PCB sheet" area.

		utility_filled_zone = {
		  params: {
		    side: 'F',
		    net: { type: 'net', value: 'GND' },
		    name: '',
		    priority: 0,
		    locked: false,
		    corner_smoothing: 'chamfer',
		    smoothing_radius: 0.5,
		    connect_pads: '',
		    pad_clearance: 0.508,
		    min_thickness: 0.25,
		    thermal_gap: 0.5,
		    thermal_bridge_width: 0.5,
		    remove_islands: 'never',
		    min_island_size: 5,
		    fill_type: 'solid',
		    hatch_thickness: 1,
		    hatch_gap: 1.5,
		    hatch_orientation: 0,
		    hatch_smoothing_level: 0,
		    hatch_smoothing_value: 0.1,
		    points: [[0, 0], [420, 0], [420, 297], [0, 297]],
		  },
		  body: p => {
		    let polygon_pts = '';
		    for (let i = 0; i < p.points.length; i++) {
		      polygon_pts += `(xy ${p.points[i][0]} ${p.points[i][1]}) `;
		    }
		    return `
  (zone
    (net ${p.net.index})
    (net_name "${p.net.name}")
    (locked ${p.locked ? 'yes' : 'no'})
    (layers "${p.side}.Cu")
    ${p.name ? '(name "' + p.name + '")' : ''}
    (hatch edge 0.5)
    ${p.prority > 0 ? '(priority ' + p.priority + ')' : ''}
    (connect_pads ${p.connect_pads}
      (clearance ${p.pad_clearance})
    )
    (min_thickness ${p.min_thickness})
    (filled_areas_thickness no)
    (fill 
      ${p.fill_type == 'solid' ? 'yes' : '(mode ' + p.fill_type + ')'}
      (thermal_gap ${p.thermal_gap})
      (thermal_bridge_width ${p.thermal_bridge_width})
      ${p.corner_smoothing != '' ? '(smoothing ' + p.corner_smoothing + ')' : ''}
      ${p.corner_smoothing != '' ? '(radius ' + p.smoothing_radius + ')' : ''}
      ${p.remove_islands == 'always' ? '' : '(island_removal_mode ' + (p.remove_islands == 'never' ? 1 : 2) + ')'}
      ${p.remove_islands == 'always' ? '' : '(island_area_min ' + p.min_island_size + ')'}
      ${p.fill_type == 'solid' ? '' : '(hatch_thickness ' + p.hatch_thickness + ')'}
      ${p.fill_type == 'solid' ? '' : '(hatch_gap ' + p.hatch_gap + ')'}
      ${p.fill_type == 'solid' ? '' : '(hatch_orientation ' + p.hatch_orientation + ')'}
      ${p.fill_type == 'solid' || p.hatch_smoothing_level < 1 ? '' : '(hatch_smoothing_level ' + p.hatch_smoothing_level + ')'}
      ${p.fill_type == 'solid' || p.hatch_smoothing_level < 1 ? '' : '(hatch_smoothing_value ' + p.hatch_smoothing_value + ')'}
      ${p.fill_type == 'solid' ? '' : '(hatch_border_algorithm hatch_thickness)'}
      ${p.fill_type == 'solid' ? '' : '(hatch_min_hole_area 0.3)'}
    )
    (polygon
      (pts
        ${polygon_pts}
      )
    )
  )
    `
		  }
		};
		return utility_filled_zone;
	}

	var utility_keepout_zone;
	var hasRequiredUtility_keepout_zone;

	function requireUtility_keepout_zone () {
		if (hasRequiredUtility_keepout_zone) return utility_keepout_zone;
		hasRequiredUtility_keepout_zone = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @ceoloide
		//
		// Description:
		//  A KiCad native keepout zone.
		//
		// Params:
		//    side: default is 'F&B' for both Front and Back
		//      the side on which to place the keepout zone, either 'F' for Front, 'B'
		//      for Back, or 'F&B' for both.
		//    name: default is '' (no name)
		//      an optional name to give to the zone.
		//    locked: default is false
		//      if true it will lock the resulting keepout zone.
		//    tracks_allowed: default is true
		//      if true, tracks are allowed in the keepout zone.
		//    vias_allowed: default is true
		//      if true, vias are allowed in the keepout zone.
		//    pads_allowed: default is true
		//      if true, pads are allowed in the keepout zone.
		//    copperpour_allowed: default is true
		//      if true, copper pours are allowed in the keepout zone.
		//    footprints_allowed: default is true
		//      if true, footprints are allowed in the keepout zone.
		//    outline_type: default is 'edge'
		//      the type of outline to use for the keepout zone, either 'none' to just
		//      display a line, 'edge' to display a hatch pattern at the edge, or `full`
		//      to display a full hatch pattern.
		//    hatch_pitch: default is 1
		//      the pitch (distance between display lines) of the hatch pattern (in mm).
		//      Must be below 2mm.
		//    points: default is [[0,0],[420,0],[420,297],[0,297]]
		//      an array containing the polygon points of the filled area, in
		//      xy coordinates relative to the PCB. The default is a square area of
		//      420x297mm^2 located at (0,0) xy coordinates, essentially filling the
		//      entire "PCB sheet" area.

		utility_keepout_zone = {
		  params: {
		    side: 'F&B',
		    name: '',
		    locked: false,
		    tracks_allowed: true,
		    vias_allowed: true,
		    pads_allowed: true,
		    copperpour_allowed: true,
		    footprints_allowed: true,
		    outline_type: 'edge',
		    hatch_pitch: 1,
		    points: [[0, 0], [420, 0], [420, 297], [0, 297]],
		  },
		  body: p => {
		    if (p.hatch_pitch < 0 || p.hatch_pitch > 2) {
		      throw new Error(
		        'Parameter hatch_pitch must be a positive number below 2mm to avoid KiCad issues. Current value: ' + p.hatch_pitch + 'mm'
		      );
		    }
		    let polygon_pts = '';
		    for (let i = 0; i < p.points.length; i++) {
		      polygon_pts += `(xy ${p.points[i][0]} ${p.points[i][1]}) `;
		    }
		    return `
  (zone
    (net 0)
    (net_name "")
    (locked ${p.locked ? 'yes' : 'no'})
    (layers "${p.side}.Cu")
    ${p.name ? '(name "' + p.name + '")' : ''}
		(hatch ${p.outline_type} ${p.hatch_pitch})
    (connect_pads
      (clearance 0)
    )
    (min_thickness 0.25)
    (filled_areas_thickness no)
		(keepout
			(tracks ${p.tracks_allowed ? 'allowed' : 'not_allowed'})
			(vias ${p.vias_allowed ? 'allowed' : 'not_allowed'})
			(pads ${p.pads_allowed ? 'allowed' : 'not_allowed'})
			(copperpour ${p.copperpour_allowed ? 'allowed' : 'not_allowed'})
			(footprints ${p.footprints_allowed ? 'allowed' : 'not_allowed'})
		)
		(fill
			(thermal_gap 0.5)
			(thermal_bridge_width 0.5)
		)
    (polygon
      (pts
        ${polygon_pts}
      )
    )
  )
    `
		  }
		};
		return utility_keepout_zone;
	}

	/*
	Copyright (c) 2023 Marco Massarelli

	SPDX-License-Identifier: CC-BY-NC-SA-4.0

	To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/

	Author: @infused-kim + @ceoloide improvements

	Description:
	  Adds tiny x and y arrows at the origin of points to help with the debugging
	  of complex layouts.

	  This will only show arrows for actual points you define. So if you draw an
	  outline without defining points, then they won't show up.

	Usage:
	  You can make enabling and disabling easy with ergogen's preprocessor:

	  ```js
	  settings:
	    point_debugger:
	      enabled: false
	  [...]
	  pcbs:
	    your_keyboard:
	      footprints:
	        point_debugger:
	          what: infused-kim/point_debugger
	          where: true
	          params:
	            $extends: settings.point_debugger
	  ```

	Showing the point name:
	  The footprint supports showing the name of the point when you zoom in, but
	  the latest version of ergogen (4.1.0) does not make the name available to
	  the footprint.

	  Until this gets merged, you can use the ergogen fork from this PR:
	  https://github.com/ergogen/ergogen/pull/103
	  
	Params:
	  enabled: default is true
	    Whether to include or not the point debugger footprint

	@ceoloide' improvements
	  - Upgrade to KiCad 8 
	*/

	var utility_point_debugger;
	var hasRequiredUtility_point_debugger;

	function requireUtility_point_debugger () {
		if (hasRequiredUtility_point_debugger) return utility_point_debugger;
		hasRequiredUtility_point_debugger = 1;
		utility_point_debugger = {
		  params: {
		    designator: 'P',
		    enabled: true,
		  },
		  body: p => {
		    if (p.enabled == false) {
		      return '';
		    }

		    const top = `
  (footprint "ceoloide:utility_point_debugger"
    (layer "F.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 2)
      (layer "Dwgs.User")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_line (start -0.6 0) (end 0.6 0) (layer "Dwgs.User") (stroke (width 0.05) (type solid)))
    (fp_line (start 0 -0.6) (end 0 0.6) (layer "Dwgs.User") (stroke (width 0.05) (type solid)))
    (fp_line (start 0.6 0) (end 0.5 -0.1) (layer "Dwgs.User") (stroke (width 0.05) (type solid)))
    (fp_line (start 0.6 0) (end 0.5 0.1) (layer "Dwgs.User") (stroke (width 0.05) (type solid)))
    (fp_line (start 0 -0.6) (end 0.1 -0.5) (layer "Dwgs.User") (stroke (width 0.05) (type solid)))
    (fp_line (start 0 -0.6) (end -0.1 -0.5) (layer "Dwgs.User") (stroke (width 0.05) (type solid)))
      `;

		    const bottom = `
  )
      `;

		    let final = top;

		    if ('point' in p) { // Only available from commit #852c100
		      final += ` 
    (fp_text user "${p.point.meta.name}"
      (at -0.3 -0.05 ${p.r})
      (layer "Dwgs.User")
      (effects (font (size 0.0254 0.0254) (thickness 0.001)))
    )
      `;
		    }

		    final += bottom;

		    return final;
		  }
		};
		return utility_point_debugger;
	}

	var utility_router;
	var hasRequiredUtility_router;

	function requireUtility_router () {
		if (hasRequiredUtility_router) return utility_router;
		hasRequiredUtility_router = 1;
		// Copyright (c) 2025 Marco Massarelli
		//
		// SPDX-License-Identifier: MIT
		//
		// To view a copy of this license, visit https://opensource.org/license/mit/
		//
		// Author: @yanshay + @ceoloide improvements
		//
		// Description:
		//   This footprint provides basic routing capabilities including laying routes (traces) and vias.
		//
		//   It is useful especially since there are tens of keys per keyboard which have exact same routing
		//   and whenever a change needs to be made to Ergogen config, rerouting is required. This footprint
		//   allows compact routing declaration in Ergogen directly.
		//
		//   For a more complete description, consult the original documentation at: https://github.com/yanshay/ergogen-stuff/blob/main/docs/router.md
		//
		//   A KiCad Plugin exists in order to facilitate the configuration of this footprint: 
		//  
		// Example:
		//  row_route:
		//    what: ceoloide/utility_router
		//    where: true
		//    params:
		//    net: "{{row_net}}"
		//    route: "f(-8.275,5.1)(-8.275,7.26)"
		//
		//  row_route2:
		//    what: ceoloide/utility_router
		//    where: true
		//    params:
		//    net: "{{row_net}}"
		//    route: "f(-8.275 5.1) (-8.275 7.26)"
		//
		// Params:
		//    net: default is no net
		//      allows specifying a net for all routes in this footprint. To route multiple different nets,
		//      you would need several different footprint configurations. However, if this parameter is left
		//      to the default value then KiCad will fill in the missing nets when a file is opened in KiCad.
		//      Support for multiple nets is included, but depends on an unmerged Ergogen PR. For details see
		//      https://github.com/ergogen/ergogen/pull/109
		//    width: default 0.250mm
		//      the default trace width to be used.  Not recommended to go below 0.15mm (JLCPC min is 0.127mm).
		//    via_size: default is 0.6
		//      allows to define the size of the via. Not recommended below 0.56 (JLCPCB minimum),
		//      or above 0.8 (KiCad default), to avoid overlap or DRC errors
		//    via_drill: default is 0.3
		//      allows to define the size of the drill. Not recommended below 0.3 (JLCPCB minimum),
		//      or above 0.4 (KiCad default), to avoid overlap or DRC errors 
		//    locked: default is false
		//      sets the traces and vias as locked in KiCad. Locked objects may not be manipulated
		//      or moved, and cannot be selected unless the Locked Items option is enabled in the
		//      Selection Filter panel in KiCad. Useful for a faster workflow. If using autorouting
		//      solutions like Freerouting, locking can prevent the traces and vias from being
		//      replaced.
		//    routes: default empty / no routes
		//      an array of routes based on the syntax described below, each stands by its own except they all
		//      share other params (net, ...)
		//    route: default empty / no route
		//      allows adding a single route using the syntax described below, but on a single row and in a more
		//      concise format
		//
		// Route syntax:
		//  A route is a string that describe how to route using one letter commands and positions. It follows to
		//  some extent KiCad key presses to make it easy to remember. Valid commands are as follows:
		//    
		//    b - route on the back layer - there is no default layer to avoid mistakes
		//    f - route on the front layer
		//    v - place a via and switch layer
		//    x or | - start a new route (if layer is set, stays on the same layer, just like in KiCad)
		//    (x_pos,y_pos) - route to the given position (relative to the Ergogen point). If it is the first
		//      occurrence in the route or if after x command then it places the cursor in the specific point.
		//    <net_name> - the name of a net to use for the following segment. Currently unsupported in mainline
		//      Ergogen, until https://github.com/ergogen/ergogen/pull/109 is merged.
		//
		// @morrijr's improvements:
		//  - ',' between x and y, is now optional
		//  - Spaces between coordinates are now allowed
		// @ceoloide's improvements:
		//  - Replace `get_at_coordinates` and `adjust_point` with native Ergogen `eaxy()`
		//  - Refresh `via` and `segment` syntax to align with KiCad 8
		//
		// Special credit to @infused-kim for the adjust_point() function in the original code.
		 
		utility_router = {
		  params: {
		    net: { type: "net", value: "" },
		    width: { type: "number", value: 0.25 },
		    via_size: { type: "number", value: 0.6 },
		    via_drill: { type: "number", value: 0.3 },
		    locked: false,
		    routes: { type: "array", value: [] },
		    route: { type: "string", value: "" },
		  },

		  body: (p) => {
		    /*
		    Reference (KiCad 8):
		    
		    (segment
		      (start 108.8 108)
		      (end 109.7 108)
		      (width 0.2)
		      (locked yes)
		      (layer "F.Cu")
		      (net 0)
		    )
		      */
		    const get_segment = (start, end, layer, net) => {
		      if (!layer) {
		        throw new Error(
		          "Can't place segment before layer is set, use 'f' or 'b', to set starting layer"
		        )
		      }
		      return `
  (segment
    (start ${p.eaxy(start[0], start[1])}) 
    (end ${p.eaxy(end[0], end[1])})
    (width ${p.width})
    (locked ${p.locked ? 'yes' : 'no'})
    (layer ${layer})
    (net ${net})
  )`
		    };

		    /*
		    Reference (KiCad 8):

		    (via
		      (at -7.775 -5.95)
		      (size 0.6)
		      (drill 0.3)
		      (layers "F.Cu" "B.Cu")
		      (locked yes)
		      (net 2)
		    )
		    */
		    const get_via = (pos, net) => {
		      if (!pos) {
		        throw new Error(
		          "Can't place via when position is not set, use (x,y) to set position"
		        )
		      }
		      return `
  (via
    (at ${p.eaxy(pos[0], pos[1])})
    (size ${p.via_size})
    (drill ${p.via_drill})
    (layers "F.Cu" "B.Cu")
    (locked ${p.locked ? 'yes' : 'no'})
    (net ${net})
  )`
		    };

		    const parse_tuple = (t) => {
		      let str_tuple = JSON.parse(
		        t.replace(/ /g, ',') // replace spaces with commas
		        .replace(/[,]+/g, ',') // replace multiple commas with a single comma
		        .replace(/\([,]*/g, "[") // replace opening parenthesis (and any leading comma's) with a bracket
		        .replace(/[,]*\)/g, "]")); // replace closing parenthesis (and any trailing comma's) with a bracket
		      let num_tuple = str_tuple.map((v) => Number(v));
		      if (isNaN(num_tuple[0] || isNaN(num_tuple[1]))) {
		        throw new Error(`Invalid position encountered: ${str_tuple}`)
		      }
		      return num_tuple
		    };

		    const get_traces = (route, net) => {
		      let traces = "";
		      let layer = undefined;
		      let start = undefined; // [x, y]

		      for (let i = 0; i < route.length; i++) {
		        let command = route[i].toLowerCase();
		        switch (command) {
		          case "f":
		            layer = "F.Cu";
		            break
		          case "b":
		            layer = "B.Cu";
		            break
		          case "v":
		            traces = traces + get_via(start, net) + "\n";
		            switch (layer) {
		              case "F.Cu":
		                layer = "B.Cu";
		                break
		              case "B.Cu":
		                layer = "F.Cu";
		                break
		            }
		            break
		          case "(":
		            let tuple_str = "(";
		            let parenthesis_idx = i;
		            for (i = i + 1; i < route.length; i++) {
		              let ch = route[i];
		              tuple_str += ch;
		              if (route[i] == ")") {
		                break
		              }
		              if (i > route.length) {
		                throw new Error(
		                  `Unclosed position parenthesis in ${route} at character position ${parenthesis_idx}`
		                )
		              }
		            }
		            let pos = parse_tuple(tuple_str);
		            if (start) {
		              traces = traces + get_segment(start, pos, layer, net) + "\n";
		            }
		            start = pos;
		            break
		          case "<":
		            if(typeof p.global_net !== 'Function') {
		              throw new Error(
		                `Global nets are not yet supported (character position ${i}). See https://github.com/ergogen/ergogen/pull/109`
		              )
		            }
		            let net_name = "";
		            let lt_idx = i;
		            for (i = i + 1; i < route.length; i++) {
		              let ch = route[i];
		              if (route[i] == ">") {
		                break
		              }
		              net_name += ch;
		              if (i > route.length) {
		                throw new Error(
		                  `Unclosed net parenthesis in ${route} at character position ${lt_idx}`
		                )
		              }
		            }
		            net = p.global_net(net_name);
		          case "x":
		          case "|":
		            start = undefined;
		            break
		          case " ":
		            break // ignore spaces between coordinates
		          default:
		            throw new Error(`Unsupported character '${command}' at position ${i}.`)
		        }
		      }

		      return traces
		    };

		    const get_routes_traces = (routes, net) => {
		      let routes_traces = routes.reduce((acc_traces, route) => {
		        return acc_traces + get_traces(route, net)
		      }, "");
		      return routes_traces
		    };

		    let combined_traces = "";
		    if (p.route) {
		      combined_traces += get_traces(p.route, p.net.index);
		    }
		    if (p.routes) {
		      combined_traces += get_routes_traces(p.routes, p.net.index);
		    }

		    return combined_traces
		  },
		};
		return utility_router;
	}

	var utility_text;
	var hasRequiredUtility_text;

	function requireUtility_text () {
		if (hasRequiredUtility_text) return utility_text;
		hasRequiredUtility_text = 1;
		// Copyright (c) 2023 Marco Massarelli
		//
		// SPDX-License-Identifier: CC-BY-NC-SA-4.0
		//
		// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
		//
		// Authors: @infused-kim + @ceoloide & @dieseltravis improvements
		//
		// Description:
		//  Allows you to place text on the PCB's Silkscreen
		//  layer, and optionally make it reversible on the
		//  opposite side.
		//
		// Params:
		//    side: default is F for Front
		//      the side on which to place the single-side footprint and designator, either F or B
		//    layer: default is 'SilkS' (Silkscreen layer)
		//      the layer where the text will be placed, useful to have copper + soldermask texts
		//    reversible: default is false
		//      adds a mirrored text on the opposite side of the board with the same style and text
		//    thickness: default is 0.15
		//      set the thickness of the stroke for the text (only applicable to the default font)
		//    width: default is 1
		//      set the text width
		//    height: default is 1
		//      set the text height
		//    mirrored: default is false
		//      mirror the text, useful when text is added to the back. A reversible text is mirrored
		//      by default on the backside.
		//    knockout: default is false
		//      add the knockout effect to the text
		//    bold: default is false
		//      adds bold effect to the text
		//    italic: default is false
		//      adds italics effect to the text
		//    align: default is ''
		//      control the alignment of the text (e.g. top left)
		//    face: default is '' (KiCad Default)
		//      control the font face applied to the text
		//    text:
		//      The text to display
		//
		// @ceoloide's improvements:
		//  - Add ability to set text on both sides
		//  - Add ability to adjust font thickness and size
		//  - Add mirrored and knockout effects
		//
		// @diseltravis's improvements:
		//  - Add option to customizer the font face
		//  - Add option to set bold, italic font styles
		//  - Add option to chose the layer where the text is added to

		utility_text = {
		  params: {
		    designator: 'TXT',
		    side: 'F',
		    layer: 'SilkS',
		    reversible: false,
		    thickness: 0.15,
		    height: 1,
		    width: 1,
		    mirrored: false,
		    knockout: false,
		    bold: false,
		    italic: false,
		    align: '',
		    face: '',
		    text: ''
		  },
		  body: p => {
		    const generate_text = (side, layer, align, mirrored, thickness, height, width, text, face, bold, italic, knockout) => {
		      let justify = `(justify ${align} ${mirrored ? 'mirror' : ''})`;
		      const gr_text = `
  (gr_text "${text}"
    ${p.at}
    (layer "${side}.${layer}" ${knockout ? 'knockout' : ''})
    (effects
      (font ${face != '' ? '(face "' + face + '")' : ''}
        (size ${height} ${width})
        (thickness ${thickness})
        ${bold ? '(bold yes)' : ''}
        ${italic ? '(italic yes)' : ''}
      )
      ${align != '' || mirrored ? justify : ''}
    )
  )
      `;
		      return gr_text;
		    };

		    let final = '';
		    if (p.reversible) {
		      final += generate_text('F', p.layer, p.align, false, p.thickness, p.height, p.width, p.text, p.face, p.bold, p.italic, p.knockout);
		      final += generate_text('B', p.layer, p.align, true, p.thickness, p.height, p.width, p.text, p.face, p.bold, p.italic, p.knockout);
		    } else {
		      final += generate_text(p.side, p.layer, p.align, p.mirrored, p.thickness, p.height, p.width, p.text, p.face, p.bold, p.italic, p.knockout);
		    }
		    return final;
		  }
		};
		return utility_text;
	}

	var choc;
	var hasRequiredChoc;

	function requireChoc () {
		if (hasRequiredChoc) return choc;
		hasRequiredChoc = 1;
		// Author: Ergogen + @infused-kim improvements
		//
		// Kailh Choc PG1350
		// Nets
		//    from: corresponds to pin 1
		//    to: corresponds to pin 2
		// Params
		//    reverse: default is false
		//      if true, will flip the footprint such that the pcb can be reversible
		//    hotswap: default is true
		//      if true, will include holes and pads for Kailh choc hotswap sockets
		//    solder: default is false
		//      if true, will include holes to solder switches (works with hotswap too)
		//    outer_pad_width_front: default 2.6
		//    outer_pad_width_back: default 2.6
		//      Allow you to make the outer hotswap pads smaller to silence DRC
		//      warnings when the sockets are to close to the edge cuts.
		//    show_keycaps: default is true
		//      if true, will add choc sized keycap box around the footprint
		//    keycaps_x: default is 18
		//    keycaps_y: default is 17
		//      Allows you to adjust the width of the keycap outline. For example,
		//      to show a 1.5u outline for easier aligning.
		//
		// notes:
		// - hotswap and solder can be used together. The solder holes will then be
		// - added above the hotswap holes.
		//
		// @infused-kim's improvements:
		//  - Added hotswap socket outlines
		//  - Moved switch corner marks from user layer to silk screen
		//  - Added option to adjust keycap size outlines (to show 1.5u outline)
		//  - Added option to add hotswap sockets and direct soldering holes at the
		//    same time
		//  - Made hotswap pads not overlap holes to fix DRC errors
		//  - Fixed DRC errors "Drilled holes co-located"

		choc = {
		    params: {
		        designator: 'S',
		        reverse: false,
		        hotswap: true,
		        solder: false,
		        outer_pad_width_front: 2.6,
		        outer_pad_width_back: 2.6,
		        show_keycaps: true,
		        keycaps_x: 18,
		        keycaps_y: 17,

		        // This parameter defines on which side the actual switch should be.
		        // Hotswap sockets and keycaps will be placed based on it.
		        switch_3dmodel_side: '',

		        keycap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Choc_V1_Keycap_MBK_Black_1u.step',
		        keycap_3dmodel_xyz_scale: '',
		        keycap_3dmodel_xyz_rotation: '',
		        keycap_3dmodel_xyz_offset: '',

		        switch_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Choc_V1_Switch.step',
		        switch_3dmodel_xyz_scale: '',
		        switch_3dmodel_xyz_rotation: '',
		        switch_3dmodel_xyz_offset: '',

		        hotswap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Choc_V1_Hotswap.step',
		        hotswap_3dmodel_xyz_scale: '',
		        hotswap_3dmodel_xyz_rotation: '',
		        hotswap_3dmodel_xyz_offset: '',

		        from: undefined,
		        to: undefined
		    },
		    body: p => {

		        const gen_3d_model = (filename, scale, rotation, offset, side, {
		            default_side =  'F',
		            scale_f =       [1, 1, 1],
		            rotation_f =    [0, 0, 0],
		            offset_f =      [0, 0, 0],
		            scale_b =       [1, 1, 1],
		            rotation_b =    [0, 0, 0],
		            offset_b =      [0, 0, 0]
		        } = {}) => {

		            if(filename == '') {
		              return '';
		            }

		            const get_3d_model_side = (side, default_side) => {

		                if(side == '') {
		                    if(p.reverse == true) {
		                        side = default_side;
		                    } else {
		                        side = p.side;
		                    }
		                }

		                if(side == 'F' || side == 'B') {
		                    return side;
		                } else {
		                    return default_side;
		                }
		            };

		            const final_side = get_3d_model_side(side, default_side);
		            const is_front = final_side === 'F';

		            // Determine the actual values to use
		            const final_scale = scale || (is_front ? scale_f : scale_b);
		            const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		            let final_offset = offset || (is_front ? offset_f : offset_b);

		            // Fix bug that seems to happen during the upgrade from KiCad 5 to
		            // 8. All offset values seem to be multiplied by 25.4. So here we
		            // divide them so that the upgrade KiCad file ends up with the
		            // correct value.
		            const offset_divisor = 25.4;
		            final_offset = final_offset.map(value => value / offset_divisor);

		            return  `
              (model ${filename}
                (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
                (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
                (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
              )
            `;
		        };

		        const common_top = `
            (module PG1350 (layer F.Cu) (tedit 5DD50112)
            ${p.at /* parametric position */}
            (attr virtual)

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))

            ${''/* middle shaft */}
            (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))

            ${''/* stabilizers */}
            (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
            (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))

            ${''/* corner marks - front */}
            (fp_line (start -7 -6) (end -7 -7) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -6 7) (layer F.SilkS) (width 0.15))
            (fp_line (start -6 -7) (end -7 -7) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -7 6) (layer F.SilkS) (width 0.15))
            (fp_line (start 7 6) (end 7 7) (layer F.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 6 -7) (layer F.SilkS) (width 0.15))
            (fp_line (start 6 7) (end 7 7) (layer F.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 7 -6) (layer F.SilkS) (width 0.15))

            ${''/* corner marks - back */}
            (fp_line (start -7 -6) (end -7 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -6 7) (layer B.SilkS) (width 0.15))
            (fp_line (start -6 -7) (end -7 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -7 6) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 6) (end 7 7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 6 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start 6 7) (end 7 7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 7 -6) (layer B.SilkS) (width 0.15))
        `;

		        const keycap_xo = 0.5 * p.keycaps_x;
		        const keycap_yo = 0.5 * p.keycaps_y;
		        const keycap_marks = `
            ${'' /* keycap marks - 1u */}
            (fp_line (start ${ -keycap_xo } ${ -keycap_yo }) (end ${ keycap_xo } ${ -keycap_yo }) (layer Dwgs.User) (width 0.15))
            (fp_line (start ${ keycap_xo } ${ -keycap_yo }) (end ${ keycap_xo } ${ keycap_yo }) (layer Dwgs.User) (width 0.15))
            (fp_line (start ${ keycap_xo } ${ keycap_yo }) (end ${ -keycap_xo } ${ keycap_yo }) (layer Dwgs.User) (width 0.15))
            (fp_line (start ${ -keycap_xo } ${ keycap_yo }) (end ${ -keycap_xo } ${ -keycap_yo }) (layer Dwgs.User) (width 0.15))
        `;

		        const hotswap_common = `
            ${'' /* Middle Hole */}
            (pad "" np_thru_hole circle (at 0 -5.95) (size 3 3) (drill 3) (layers *.Cu *.Mask))

        `;

		        const hotswap_front_pad_cutoff = `
            (pad 1 smd custom (at -3.275 -5.95 ${p.rot}) (size 1 1) (layers B.Cu B.Paste B.Mask)
                (zone_connect 0)
                (options (clearance outline) (anchor rect))
                (primitives
                    (gr_poly (pts
                    (xy -1.3 -1.3) (xy -1.3 0.25) (xy -0.05 1.3) (xy 1.3 1.3) (xy 1.3 -1.3)
                ) (width 0))
            ) ${p.from.str})
        `;

		        const hotswap_front_pad_full = `
            (pad 1 smd rect (at -3.275 -5.95 ${p.rot}) (size 2.6 2.6) (layers B.Cu B.Paste B.Mask)  ${p.from.str})
        `;

		        const hotswap_front = `
            ${'' /* Silkscreen outline */}
            (fp_line (start 7 -7) (end 7 -6) (layer B.SilkS) (width 0.15))
            (fp_line (start 1.5 -8.2) (end 2 -7.7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -1.5) (end 7 -2) (layer B.SilkS) (width 0.15))
            (fp_line (start -1.5 -8.2) (end 1.5 -8.2) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 6 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -6.2) (end 2.5 -6.2) (layer B.SilkS) (width 0.15))
            (fp_line (start 2.5 -2.2) (end 2.5 -1.5) (layer B.SilkS) (width 0.15))
            (fp_line (start -2 -7.7) (end -1.5 -8.2) (layer B.SilkS) (width 0.15))
            (fp_line (start -1.5 -3.7) (end 1 -3.7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -5.6) (end 7 -6.2) (layer B.SilkS) (width 0.15))
            (fp_line (start 2 -6.7) (end 2 -7.7) (layer B.SilkS) (width 0.15))
            (fp_line (start 2.5 -1.5) (end 7 -1.5) (layer B.SilkS) (width 0.15))
            (fp_line (start -2 -4.2) (end -1.5 -3.7) (layer B.SilkS) (width 0.15))
            (fp_arc (start 2.499999 -6.7) (end 2 -6.690001) (angle -88.9) (layer B.SilkS) (width 0.15))
            (fp_arc (start 0.97 -2.17) (end 2.5 -2.17) (angle -90) (layer B.SilkS) (width 0.15))

            ${'' /* Left Pad*/}

            ${p.reverse ? hotswap_front_pad_cutoff : hotswap_front_pad_full}

            ${'' /* Right Pad (not cut off) */}
            (pad 2 smd rect (at ${8.275 - (2.6 - p.outer_pad_width_back)/2} -3.75 ${p.rot}) (size ${p.outer_pad_width_back} 2.6) (layers B.Cu B.Paste B.Mask) ${p.to.str})

            ${'' /* Side Hole */}
            (pad "" np_thru_hole circle (at 5 -3.75 195) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        `;

		        const hotswap_back = `
            ${'' /* Silkscreen outline */}
            (fp_line (start 2 -4.2) (end 1.5 -3.7) (layer F.SilkS) (width 0.15))
            (fp_line (start 2 -7.7) (end 1.5 -8.2) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 -5.6) (end -7 -6.2) (layer F.SilkS) (width 0.15))
            (fp_line (start 1.5 -3.7) (end -1 -3.7) (layer F.SilkS) (width 0.15))
            (fp_line (start -2.5 -2.2) (end -2.5 -1.5) (layer F.SilkS) (width 0.15))
            (fp_line (start -1.5 -8.2) (end -2 -7.7) (layer F.SilkS) (width 0.15))
            (fp_line (start 1.5 -8.2) (end -1.5 -8.2) (layer F.SilkS) (width 0.15))
            (fp_line (start -2.5 -1.5) (end -7 -1.5) (layer F.SilkS) (width 0.15))
            (fp_line (start -2 -6.7) (end -2 -7.7) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 -1.5) (end -7 -2) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 -6.2) (end -2.5 -6.2) (layer F.SilkS) (width 0.15))
            (fp_arc (start -0.91 -2.11) (end -0.8 -3.7) (angle -90) (layer F.SilkS) (width 0.15))
            (fp_arc (start -2.55 -6.75) (end -2.52 -6.2) (angle -90) (layer F.SilkS) (width 0.15))

            ${'' /* Right Pad (cut off) */}
            (pad 1 connect custom (at 3.275 -5.95 ${p.rot}) (size 0.5 0.5) (layers F.Cu F.Mask)
                (zone_connect 0)
                (options (clearance outline) (anchor rect))
                (primitives
                (gr_poly (pts
                    (xy -1.3 -1.3) (xy -1.3 1.3) (xy 0.05 1.3) (xy 1.3 0.25) (xy 1.3 -1.3)
                ) (width 0))
            ) ${p.from.str})

            ${'' /* Left Pad (not cut off) */}
            (pad 2 smd rect (at ${ -8.275 + (2.6 - p.outer_pad_width_front)/2} -3.75 ${p.rot}) (size ${p.outer_pad_width_front} 2.6) (layers F.Cu F.Paste F.Mask) ${p.to.str})

            ${'' /* Side Hole */}
            (pad "" np_thru_hole circle (at -5 -3.75 195) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        `;

		        // If both hotswap and solder are enabled, move the solder holes
		        // "down" to the opposite side of the switch.
		        // Since switches can be rotated by 90 degrees, this won't be a
		        // problem as long as we switch the side the holes are on.
		        let solder_offset_x_front = '';
		        let solder_offset_x_back = '-';
		        let solder_offset_y = '-';
		        if(p.hotswap == true && p.solder == true) {
		            solder_offset_x_front = '-';
		            solder_offset_x_back = '';
		            solder_offset_y = '';
		        }
		        const solder_common = `
            (pad 2 thru_hole circle (at 0 ${solder_offset_y}5.9 195) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.to.str})
        `;

		        const solder_front = `
            (pad 1 thru_hole circle (at ${solder_offset_x_front}5 ${solder_offset_y}3.8 195) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from.str})
        `;

		        const solder_back = `
            (pad 1 thru_hole circle (at ${solder_offset_x_back}5 ${solder_offset_y}3.8 195) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from.str})
        `;

		        const common_bottom = `
        )
        `;

		        const final = `
            ${common_top}

            ${p.show_keycaps ? keycap_marks : ''}

            ${p.hotswap ? hotswap_common : ''}
            ${p.hotswap ? hotswap_front : ''}
            ${p.hotswap && p.reverse ? hotswap_back : ''}

            ${p.solder ? solder_common : ''}
            ${p.solder ? solder_front : ''}
            ${p.solder && p.reverse ? solder_back : ''}

            ${ gen_3d_model(
	                p.keycap_3dmodel_filename,
	                p.keycap_3dmodel_xyz_scale,
	                p.keycap_3dmodel_xyz_rotation,
	                p.keycap_3dmodel_xyz_offset,
	                p.switch_3dmodel_side,
	                {
	                    rotation_f: [0, 0, 0],
	                    offset_f: [0, 0, 6.6],

	                    rotation_b: [0, 180, 0],
	                    offset_b: [0, 0, -8.2],
	                },
	            )}
            ${ gen_3d_model(
	                p.switch_3dmodel_filename,
	                p.switch_3dmodel_xyz_scale,
	                p.switch_3dmodel_xyz_rotation,
	                p.switch_3dmodel_xyz_offset,
	                p.switch_3dmodel_side,
	                {
	                    rotation_f: [0, 0, 0],
	                    offset_f: [0, 0, 0],

	                    rotation_b: [0, 180, 0],
	                    offset_b: [0, 0, -1.6],
	                },
	            )}

            ${ gen_3d_model(
	                p.hotswap_3dmodel_filename,
	                p.hotswap_3dmodel_xyz_scale,
	                p.hotswap_3dmodel_xyz_rotation,
	                p.hotswap_3dmodel_xyz_offset,
	                p.switch_3dmodel_side,
	                {
	                    rotation_f: [0, 0, 0],
	                    offset_f: [0, 0, 0],

	                    rotation_b: [0, 180, 0],
	                    offset_b: [0, 0, -1.6],
	                },
	            )}

            ${common_bottom}
        `;

		        return final
		    }
		};
		return choc;
	}

	var conn_molex_pico_ezmate_1x02;
	var hasRequiredConn_molex_pico_ezmate_1x02;

	function requireConn_molex_pico_ezmate_1x02 () {
		if (hasRequiredConn_molex_pico_ezmate_1x02) return conn_molex_pico_ezmate_1x02;
		hasRequiredConn_molex_pico_ezmate_1x02 = 1;
		// Author: @infused-kim
		//
		// Description:
		// PCB footprint for for molex pico ezmate connector with 2 pins. Ideal for
		// battery connections.
		//
		// This connector was chosen over the more common JST connector, because it
		// has a mated profile height of only 1.65 mm. This is lower than the Kailh
		// Choc hotswap sockets.
		//
		// It should also be compatible with the JST ACH connector (which is almost the
		// same).
		//
		// One downside is that there are almost no batteries that ship with this
		// connector. The one exception is the Nintendo Joycon 500 mAh battery.
		//
		// If you want to use the common 301230 battery, you will either need to crimp
		// the connector yourself or buy a pre-crimped connector that you attach to
		// the battery wires (available on digikey).

		conn_molex_pico_ezmate_1x02 = {
		    params: {
		      designator: 'CONN',
		      side: 'F',
		      reverse: false,
		      pad_1: {type: 'net', value: 'RAW'},
		      pad_2: {type: 'net', value: 'GND'},

		      cable_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Molex_Ezmate_Pico_Cable_2pin.step',
		      cable_3dmodel_side: '',
		      cable_3dmodel_xyz_scale: '',
		      cable_3dmodel_xyz_rotation: '',
		      cable_3dmodel_xyz_offset: '',

		      socket_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Molex_Ezmate_Pico_Socket_2pin.step',
		      socket_3dmodel_side: '',
		      socket_3dmodel_xyz_scale: '',
		      socket_3dmodel_xyz_rotation: '',
		      socket_3dmodel_xyz_offset: '',

		    },
		    body: p => {

		      const gen_3d_model = (filename, scale, rotation, offset, side, {
		        default_side =  'F',
		        scale_f =       [1, 1, 1],
		        rotation_f =    [0, 0, 0],
		        offset_f =      [0, 0, 0],
		        scale_b =       [1, 1, 1],
		        rotation_b =    [0, 0, 0],
		        offset_b =      [0, 0, 0]
		      } = {}) => {

		        if(filename == '') {
		          return '';
		        }

		        const get_3d_model_side = (side, default_side) => {

		            if(side == '') {
		                if(p.reverse == true) {
		                    side = default_side;
		                } else {
		                    side = p.side;
		                }
		            }

		            if(side == 'F' || side == 'B') {
		                return side;
		            } else {
		                return default_side;
		            }
		        };

		        const final_side = get_3d_model_side(side, default_side);
		        const is_front = final_side === 'F';

		        // Determine the actual values to use
		        const final_scale = scale || (is_front ? scale_f : scale_b);
		        const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		        let final_offset = offset || (is_front ? offset_f : offset_b);

		        // Fix bug that seems to happen during the upgrade from KiCad 5 to
		        // 8. All offset values seem to be multiplied by 25.4. So here we
		        // divide them so that the upgrade KiCad file ends up with the
		        // correct value.
		        const offset_divisor = 25.4;
		        final_offset = final_offset.map(value => value / offset_divisor);

		        return  `
          (model ${filename}
            (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
            (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
            (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
          )
        `;
		      };

		      const top = `
        (module conn_molex_pico_ezmate_1x02 (layer F.Cu) (tedit 6445F610)
          ${p.at /* parametric position */}
          (attr smd)

      `;

		      const front = `
        (fp_text reference ${p.ref} (at 0.1 3.9 ${p.rot}) (layer F.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (fp_line (start 0.64 2.63) (end 1.14 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start 0.34 2.13) (end 0.64 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start -0.34 2.13) (end 0.34 2.13) (layer F.SilkS) (width 0.12))
        (fp_line (start -0.64 2.63) (end -0.34 2.13) (layer F.SilkS) (width 0.12))
        (fp_line (start -0.45 2.02) (end 0.45 2.02) (layer F.Fab) (width 0.1))
        (fp_line (start -0.75 2.52) (end -0.45 2.02) (layer F.Fab) (width 0.1))
        (fp_line (start -2.1 2.52) (end -0.75 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -1.16 -2.09) (end -1.16 -2.3) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.21 -2.09) (end -1.16 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.21 1.24) (end -2.21 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.1 -1.98) (end 2.1 -1.98) (layer F.Fab) (width 0.1))
        (fp_line (start -1.14 2.63) (end -0.64 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start 2.21 -2.09) (end 1.16 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start 2.21 1.24) (end 2.21 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start -0.6 -1.272893) (end -0.1 -1.98) (layer F.Fab) (width 0.1))
        (fp_line (start -1.1 -1.98) (end -0.6 -1.272893) (layer F.Fab) (width 0.1))
        (fp_line (start 2.6 -2.8) (end -2.6 -2.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start -2.6 -2.8) (end -2.6 3.02) (layer F.CrtYd) (width 0.05))
        (fp_line (start 2.1 -1.98) (end 2.1 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -2.1 -1.98) (end -2.1 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start 0.75 2.52) (end 2.1 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start 0.45 2.02) (end 0.75 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start 2.6 3.02) (end 2.6 -2.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start -2.6 3.02) (end 2.6 3.02) (layer F.CrtYd) (width 0.05))
        (pad MP smd roundrect (at 1.75 1.9 ${p.rot}) (size 0.7 0.8) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25))
        (pad MP smd roundrect (at -1.75 1.9 ${p.rot}) (size 0.7 0.8) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25))
        (pad 2 smd roundrect (at 0.6 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_2.str})
        (pad 1 smd roundrect (at -0.6 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_1.str})
      `;
		      const back = `
        (fp_line (start -0.34 2.13) (end -0.64 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.6 3.02) (end -2.6 -2.8) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.6 3.02) (end -2.6 3.02) (layer B.CrtYd) (width 0.05))
        (fp_line (start -0.64 2.63) (end -1.14 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start 1.16 -2.09) (end 1.16 -2.3) (layer B.SilkS) (width 0.12))
        (fp_line (start 2.21 -2.09) (end 1.16 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start 2.21 1.24) (end 2.21 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start 2.1 -1.98) (end -2.1 -1.98) (layer B.Fab) (width 0.1))
        (fp_line (start 1.14 2.63) (end 0.64 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.21 -2.09) (end -1.16 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.21 1.24) (end -2.21 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start 0.6 -1.272893) (end 0.1 -1.98) (layer B.Fab) (width 0.1))
        (fp_line (start 1.1 -1.98) (end 0.6 -1.272893) (layer B.Fab) (width 0.1))
        (fp_line (start -2.6 -2.8) (end 2.6 -2.8) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.6 -2.8) (end 2.6 3.02) (layer B.CrtYd) (width 0.05))
        (fp_line (start -2.1 -1.98) (end -2.1 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 2.1 -1.98) (end 2.1 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start -0.75 2.52) (end -2.1 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start -0.45 2.02) (end -0.75 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 0.64 2.63) (end 0.34 2.13) (layer B.SilkS) (width 0.12))
        (fp_line (start 0.45 2.02) (end -0.45 2.02) (layer B.Fab) (width 0.1))
        (fp_line (start 0.75 2.52) (end 0.45 2.02) (layer B.Fab) (width 0.1))
        (fp_line (start 2.1 2.52) (end 0.75 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 0.34 2.13) (end -0.34 2.13) (layer B.SilkS) (width 0.12))
        (pad MP smd roundrect (at 1.75 1.9 ${180 + p.rot}) (size 0.7 0.8) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25))
        (pad 2 smd roundrect (at -0.6 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_2.str})
        (pad 1 smd roundrect (at 0.6 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_1.str})
        (pad MP smd roundrect (at -1.75 1.9 ${180 + p.rot}) (size 0.7 0.8) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25))
      `;

		      const all_3d_models = `
        ${ gen_3d_model(
	              p.cable_3dmodel_filename,
	              p.cable_3dmodel_xyz_scale,
	              p.cable_3dmodel_xyz_rotation,
	              p.cable_3dmodel_xyz_offset,
	              p.cable_3dmodel_side,
	              {
	                rotation_f: [0, 0, 0],
	                offset_f: [0, 0, 0.8],

	                rotation_b: [0, 180, 0],
	                offset_b: [0, 0, -2.4000000000000004],
	              },
	          )
	        }
        ${ gen_3d_model(
	              p.socket_3dmodel_filename,
	              p.socket_3dmodel_xyz_scale,
	              p.socket_3dmodel_xyz_rotation,
	              p.socket_3dmodel_xyz_offset,
	              p.socket_3dmodel_side,
	              {
	                rotation_f: [-90, 0, 0],
	                offset_f: [0, 0, 1.4],

	                rotation_b: [-90, 180, 0],
	                offset_b: [0, 0, -3],
	              },
	          )
	        }
    `;

		      const bottom = `
      )
      `;

		      let final = top;

		      if(p.side == "F" || p.reverse) {
		        final += front;
		      }
		      if(p.side == "B" || p.reverse) {
		        final += back;
		      }

		      final += all_3d_models;
		      final += bottom;

		      return final;
		    }
		};
		return conn_molex_pico_ezmate_1x02;
	}

	var conn_molex_pico_ezmate_1x05;
	var hasRequiredConn_molex_pico_ezmate_1x05;

	function requireConn_molex_pico_ezmate_1x05 () {
		if (hasRequiredConn_molex_pico_ezmate_1x05) return conn_molex_pico_ezmate_1x05;
		hasRequiredConn_molex_pico_ezmate_1x05 = 1;
		// Author: @infused-kim
		//
		// Description:
		// PCB footprint for for molex pico ezmate connector with 5 pins. Used to
		// connect a trackpoint to the PCB on my keyboards.
		//
		// This connector was chosen over the more common JST connector, because it
		// has a mated profile height of only 1.65 mm. This is lower than the Kailh
		// Choc hotswap sockets.
		//
		// It should also be compatible with the JST ACH connector (which is almost the
		// same).

		conn_molex_pico_ezmate_1x05 = {
		    params: {
		      designator: 'CONN',
		      side: 'F',
		      reverse: false,
		      pad_1: {type: 'net', value: 'CONN_1'},
		      pad_2: {type: 'net', value: 'CONN_2'},
		      pad_3: {type: 'net', value: 'CONN_3'},
		      pad_4: {type: 'net', value: 'CONN_4'},
		      pad_5: {type: 'net', value: 'CONN_5'},

		      cable_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Molex_Ezmate_Pico_Cable_5pin.step',
		      cable_3dmodel_side: '',
		      cable_3dmodel_xyz_scale: '',
		      cable_3dmodel_xyz_rotation: '',
		      cable_3dmodel_xyz_offset: '',

		      socket_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Molex_Ezmate_Pico_Socket_5pin.step',
		      socket_3dmodel_side: '',
		      socket_3dmodel_xyz_scale: '',
		      socket_3dmodel_xyz_rotation: '',
		      socket_3dmodel_xyz_offset: '',
		    },
		    body: p => {

		      const gen_3d_model = (filename, scale, rotation, offset, side, {
		        default_side =  'F',
		        scale_f =       [1, 1, 1],
		        rotation_f =    [0, 0, 0],
		        offset_f =      [0, 0, 0],
		        scale_b =       [1, 1, 1],
		        rotation_b =    [0, 0, 0],
		        offset_b =      [0, 0, 0]
		      } = {}) => {

		        if(filename == '') {
		          return '';
		        }

		        const get_3d_model_side = (side, default_side) => {

		            if(side == '') {
		                if(p.reverse == true) {
		                    side = default_side;
		                } else {
		                    side = p.side;
		                }
		            }

		            if(side == 'F' || side == 'B') {
		                return side;
		            } else {
		                return default_side;
		            }
		        };

		        const final_side = get_3d_model_side(side, default_side);
		        const is_front = final_side === 'F';

		        // Determine the actual values to use
		        const final_scale = scale || (is_front ? scale_f : scale_b);
		        const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		        let final_offset = offset || (is_front ? offset_f : offset_b);

		        // Fix bug that seems to happen during the upgrade from KiCad 5 to
		        // 8. All offset values seem to be multiplied by 25.4. So here we
		        // divide them so that the upgrade KiCad file ends up with the
		        // correct value.
		        const offset_divisor = 25.4;
		        final_offset = final_offset.map(value => value / offset_divisor);

		        return  `
          (model ${filename}
            (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
            (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
            (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
          )
        `;
		      };

		      const top = `
      (module conn_molex_pico_ezmate_1x05 (layer F.Cu) (tedit 644602FB)
        ${p.at /* parametric position */}
        (attr smd)

      `;

		      const front = `
        (fp_text reference "${p.ref}" (at 0 0.25 ${p.rot}) (layer F.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (fp_line (start -2.96 -2.09) (end -2.96 -2.3) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.01 1.24) (end 4.01 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.01 -2.09) (end 2.96 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.94 2.63) (end -2.44 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.44 2.63) (end -2.14 2.13) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.14 2.13) (end 2.14 2.13) (layer F.SilkS) (width 0.12))
        (fp_line (start 2.14 2.13) (end 2.44 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start 2.44 2.63) (end 2.94 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start -3.9 2.52) (end -2.55 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -2.55 2.52) (end -2.25 2.02) (layer F.Fab) (width 0.1))
        (fp_line (start -2.25 2.02) (end 2.25 2.02) (layer F.Fab) (width 0.1))
        (fp_line (start 2.25 2.02) (end 2.55 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start 2.55 2.52) (end 3.9 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -3.9 -1.98) (end -3.9 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start 3.9 -1.98) (end 3.9 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -4.4 -2.8) (end -4.4 3.02) (layer F.CrtYd) (width 0.05))
        (fp_line (start -4.4 3.02) (end 4.4 3.02) (layer F.CrtYd) (width 0.05))
        (fp_line (start 4.4 3.02) (end 4.4 -2.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start 4.4 -2.8) (end -4.4 -2.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start -2.9 -1.98) (end -2.4 -1.272893) (layer F.Fab) (width 0.1))
        (fp_line (start -2.4 -1.272893) (end -1.9 -1.98) (layer F.Fab) (width 0.1))
        (fp_line (start -3.9 -1.98) (end 3.9 -1.98) (layer F.Fab) (width 0.1))
        (fp_line (start -4.01 1.24) (end -4.01 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start -4.01 -2.09) (end -2.96 -2.09) (layer F.SilkS) (width 0.12))
        (fp_text user %R (at 0 0.27 ${p.rot}) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (pad 1 smd roundrect (at -2.4 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_1.str})
        (pad MP smd roundrect (at 3.55 1.9 ${p.rot}) (size 0.7 0.8) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25))
        (pad MP smd roundrect (at -3.55 1.9 ${p.rot}) (size 0.7 0.8) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25))
        (pad 2 smd roundrect (at -1.2 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_2.str})
        (pad 4 smd roundrect (at 1.2 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_4.str})
        (pad 5 smd roundrect (at 2.4 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_5.str})
        (pad 3 smd roundrect (at 0 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_3.str})
      `;
		      const back = `
        (fp_text user %R (at 0 0.27 ${180 + p.rot}) (layer B.Fab)
          (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
        )
        (fp_line (start 2.94 2.63) (end 2.44 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.14 2.13) (end -2.44 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.44 2.63) (end -2.94 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start 3.9 2.52) (end 2.55 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 2.55 2.52) (end 2.25 2.02) (layer B.Fab) (width 0.1))
        (fp_line (start 2.25 2.02) (end -2.25 2.02) (layer B.Fab) (width 0.1))
        (fp_line (start -2.25 2.02) (end -2.55 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 2.44 2.63) (end 2.14 2.13) (layer B.SilkS) (width 0.12))
        (fp_line (start 2.14 2.13) (end -2.14 2.13) (layer B.SilkS) (width 0.12))
        (fp_line (start 2.96 -2.09) (end 2.96 -2.3) (layer B.SilkS) (width 0.12))
        (fp_line (start -4.01 -2.09) (end -2.96 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.55 2.52) (end -3.9 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 3.9 -1.98) (end 3.9 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start -3.9 -1.98) (end -3.9 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 4.4 -2.8) (end 4.4 3.02) (layer B.CrtYd) (width 0.05))
        (fp_line (start 4.4 3.02) (end -4.4 3.02) (layer B.CrtYd) (width 0.05))
        (fp_line (start -4.4 3.02) (end -4.4 -2.8) (layer B.CrtYd) (width 0.05))
        (fp_line (start -4.4 -2.8) (end 4.4 -2.8) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.9 -1.98) (end 2.4 -1.272893) (layer B.Fab) (width 0.1))
        (fp_line (start 2.4 -1.272893) (end 1.9 -1.98) (layer B.Fab) (width 0.1))
        (fp_line (start 3.9 -1.98) (end -3.9 -1.98) (layer B.Fab) (width 0.1))
        (fp_line (start 4.01 1.24) (end 4.01 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start 4.01 -2.09) (end 2.96 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start -4.01 1.24) (end -4.01 -2.09) (layer B.SilkS) (width 0.12))
        (pad 3 smd roundrect (at 0 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_3.str})
        (pad MP smd roundrect (at 3.55 1.9 ${180 + p.rot}) (size 0.7 0.8) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25))
        (pad 4 smd roundrect (at -1.2 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_4.str})
        (pad 5 smd roundrect (at -2.4 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_5.str})
        (pad 2 smd roundrect (at 1.2 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_2.str})
        (pad 1 smd roundrect (at 2.4 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_1.str})
        (pad MP smd roundrect (at -3.55 1.9 ${180 + p.rot}) (size 0.7 0.8) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25))
      `;


		        const all_3d_models = `
          ${ gen_3d_model(
	                p.cable_3dmodel_filename,
	                p.cable_3dmodel_xyz_scale,
	                p.cable_3dmodel_xyz_rotation,
	                p.cable_3dmodel_xyz_offset,
	                p.cable_3dmodel_side,
	                {
	                  rotation_f: [0, 0, 0],
	                  offset_f: [0, 0, 0.8],

	                  rotation_b: [0, 180, 0],
	                  offset_b: [0, 0, -2.4000000000000004],
	                },
	            )
	          }
          ${ gen_3d_model(
	                p.socket_3dmodel_filename,
	                p.socket_3dmodel_xyz_scale,
	                p.socket_3dmodel_xyz_rotation,
	                p.socket_3dmodel_xyz_offset,
	                p.socket_3dmodel_side,
	                {
	                  rotation_f: [-90, 0, 0],
	                  offset_f: [0, 0, 1.4],

	                  rotation_b: [-90, 180, 0],
	                  offset_b: [0, 0, -3],
	                },
	            )
	          }
      `;

		      const bottom = `
      )
      `;

		      let final = top;

		      if(p.side == "F" || p.reverse) {
		        final += front;
		      }
		      if(p.side == "B" || p.reverse) {
		        final += back;
		      }

		      final += all_3d_models;
		      final += bottom;

		      return final;
		    }
		};
		return conn_molex_pico_ezmate_1x05;
	}

	var diode;
	var hasRequiredDiode;

	function requireDiode () {
		if (hasRequiredDiode) return diode;
		hasRequiredDiode = 1;
		// Author: Ergogen + @infused-kim improvements
		//
		// @infused-kim's improvements:
		//  - Added option to hide thru-holes
		//  - Added virtual attribute to silence DRC error

		diode = {
		    params: {
		        designator: 'D',
		        include_tht: true,
		        from: undefined,
		        to: undefined,

		        diode_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Diode_1N4148W.step',
		        diode_3dmodel_side: '',
		        diode_3dmodel_xyz_scale: '',
		        diode_3dmodel_xyz_rotation: '',
		        diode_3dmodel_xyz_offset: '',
		    },
		    body: p => {

		        const gen_3d_model = (filename, scale, rotation, offset, side, {
		            default_side =  'F',
		            scale_f =       [1, 1, 1],
		            rotation_f =    [0, 0, 0],
		            offset_f =      [0, 0, 0],
		            scale_b =       [1, 1, 1],
		            rotation_b =    [0, 0, 0],
		            offset_b =      [0, 0, 0]
		          } = {}) => {

		            if(filename == '') {
		              return '';
		            }

		            const get_3d_model_side = (side, default_side) => {

		                if(side == '') {
		                    if(p.reverse == true) {
		                        side = default_side;
		                    } else {
		                        side = p.side;
		                    }
		                }

		                if(side == 'F' || side == 'B') {
		                    return side;
		                } else {
		                    return default_side;
		                }
		            };

		            const final_side = get_3d_model_side(side, default_side);
		            const is_front = final_side === 'F';

		            // Determine the actual values to use
		            const final_scale = scale || (is_front ? scale_f : scale_b);
		            const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		            let final_offset = offset || (is_front ? offset_f : offset_b);

		            // Fix bug that seems to happen during the upgrade from KiCad 5 to
		            // 8. All offset values seem to be multiplied by 25.4. So here we
		            // divide them so that the upgrade KiCad file ends up with the
		            // correct value.
		            const offset_divisor = 25.4;
		            final_offset = final_offset.map(value => value / offset_divisor);

		            return  `
              (model ${filename}
                (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
                (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
                (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
              )
            `;
		        };

		        const tht = `
        (pad 1 thru_hole rect (at -3.81 0 ${p.rot}) (size 1.778 1.778) (drill 0.9906) (layers *.Cu *.Mask) ${p.to.str})
        (pad 2 thru_hole circle (at 3.81 0 ${p.rot}) (size 1.905 1.905) (drill 0.9906) (layers *.Cu *.Mask) ${p.from.str})
        `;

		        const footprint = `
    (module ComboDiode (layer F.Cu) (tedit 5B24D78E)
        ${p.at /* parametric position */}
        (attr virtual)

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        ${''/* diode symbols */}
        (fp_line (start 0.25 0) (end 0.75 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0) (end 0.75 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer B.SilkS) (width 0.1))

        ${''/* SMD pads on both sides */}
        (pad 1 smd rect (at -1.65 0 ${p.rot}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.to.str})
        (pad 2 smd rect (at 1.65 0 ${p.rot}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.from.str})
        (pad 1 smd rect (at -1.65 0 ${p.rot}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.to.str})
        (pad 2 smd rect (at 1.65 0 ${p.rot}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.from.str})

        ${''/* THT terminals */}
        ${ p.include_tht ? tht : '' }
        ${ gen_3d_model(
	            p.diode_3dmodel_filename,
	            p.diode_3dmodel_xyz_scale,
	            p.diode_3dmodel_xyz_rotation,
	            p.diode_3dmodel_xyz_offset,
	            p.diode_3dmodel_side,
	            {
	              default_side: 'B',

	              rotation_f: [-90, 0, 0],
	              offset_f: [0, 0, 0.7],

	              rotation_b: [-90, 180, 180],
	              offset_b: [0, 0, -2.3],
	            },
	        )}
    )
    `;

		    return footprint;
		    }
		};
		return diode;
	}

	var icon_bat;
	var hasRequiredIcon_bat;

	function requireIcon_bat () {
		if (hasRequiredIcon_bat) return icon_bat;
		hasRequiredIcon_bat = 1;
		// Author: @infused-kim
		//
		// Description:
		// Shows battery icons on the PCB silkscreen.

		icon_bat = {
		    params: {
		      designator: 'ICON',
		      side: 'F',
		      reverse: false,
		      spacing: 1
		    },
		    body: p => {
		      const spacing_adj = p.spacing / 2;

		      const top = `
        (module icon_bat (layer F.Cu) (tedit 64461058)
          ${p.at /* parametric position */}
          (attr virtual)

      `;

		      const front = `
          (fp_text reference "${p.ref}" (at 0 3 ${p.rot}) (layer F.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )
          (fp_circle (center ${ -0.55 - spacing_adj} 0) (end ${ -0.05 - spacing_adj} 0) (layer F.SilkS) (width 0.1))
          (fp_line (start ${ -0.55 - spacing_adj} -0.3) (end ${ -0.55 - spacing_adj} 0.3) (layer F.SilkS) (width 0.1))
          (fp_line (start ${ -0.85 - spacing_adj} 0) (end ${ -0.25 - spacing_adj} 0) (layer F.SilkS) (width 0.1))

          (fp_circle (center ${0.55 + spacing_adj} 0) (end ${1.05 + spacing_adj}  0) (layer F.SilkS) (width 0.1))
          (fp_line (start ${0.25 + spacing_adj} 0) (end ${0.85 + spacing_adj} 0) (layer F.SilkS) (width 0.1))
      `;

		      const back = `
          (fp_circle (center ${ -0.55 - spacing_adj} 0) (end ${ -1.05 - spacing_adj}  0) (layer B.SilkS) (width 0.1))
          (fp_line (start ${ -0.25 - spacing_adj} 0) (end ${ -0.85 - spacing_adj} 0) (layer B.SilkS) (width 0.1))

          (fp_circle (center ${0.55 + spacing_adj} 0) (end ${0.05 + spacing_adj} 0) (layer B.SilkS) (width 0.1))
          (fp_line (start ${0.55 + spacing_adj} -0.3) (end ${0.55 + spacing_adj} 0.3) (layer B.SilkS) (width 0.1))
          (fp_line (start ${0.85 + spacing_adj} 0) (end ${0.25 + spacing_adj} 0) (layer B.SilkS) (width 0.1))
      `;

		      const bottom = `
      )
      `;

		      let final = top;

		      if(p.side == "F" || p.reverse) {
		        final += front;
		      }
		      if(p.side == "B" || p.reverse) {
		        final += back;
		      }

		      final += bottom;

		      return final;
		    }
		};
		return icon_bat;
	}

	var mounting_hole;
	var hasRequiredMounting_hole;

	function requireMounting_hole () {
		if (hasRequiredMounting_hole) return mounting_hole;
		hasRequiredMounting_hole = 1;
		// Author: @infused-kim
		//
		// Description:
		// Simple mounting hole with gold rim.
		//
		// Parameters:
		//   - outline: The width of the gold rim around the hole (Default: 0.8mm)
		//   - drill: The actual size for the hole (Default 2.2mm - for m2 screws)
		//   - drill_y: The height if you want an oval hole (Default: off)

		mounting_hole = {
		    params: {
		      designator: 'H',
		      outline: 0.8,
		      drill: 2.2,
		      drill_y: 0,
		    },
		    body: p => {
		        if(p.drill_y == 0) {
		            p.drill_y = p.drill;
		        }

		        const size_x = p.drill + p.outline * 2;
		        const size_y = p.drill_y + p.outline * 2;

		        const courtyard_offset = 0.25;
		        const courtyard_x = size_x / 2 + courtyard_offset;
		        const courtyard_y = size_y / 2 + courtyard_offset;

		        const top = `
            (module mounting_hole (layer F.Cu) (tedit 64B5A986)
                ${p.at /* parametric position */}
                (fp_text reference "${p.ref}" (at 0 3) (layer F.SilkS) ${p.ref_hide}
                    (effects (font (size 1 1) (thickness 0.15)))
                )
        `;

		        const pad_circle = `
                (pad "" thru_hole circle (at 0 0 180) (size ${size_x} ${size_y}) (drill ${p.drill}) (layers *.Cu *.Mask))
        `;
		        const courtyard_circle = `
                (fp_circle (center 0 0) (end -${courtyard_x} 0) (layer F.CrtYd) (width 0.05))
                (fp_circle (center 0 0) (end -${courtyard_x} 0) (layer B.CrtYd) (width 0.05))
        `;
		        const pad_oval = `
                (pad "" thru_hole oval (at 0 0 180) (size ${size_x} ${size_y}) (drill oval ${p.drill} ${p.drill_y}) (layers *.Cu *.Mask))
        `;
		        const courtyard_oval = `
                (fp_line (start ${courtyard_x} -${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} -${courtyard_y}) (end -${courtyard_x} ${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} ${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} -${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} ${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer B.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} ${courtyard_y}) (end -${courtyard_x} -${courtyard_y}) (layer B.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} -${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer B.CrtYd) (width 0.05))
                (fp_line (start ${courtyard_x} ${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer B.CrtYd) (width 0.05))
        `;

		        const bottom = `
            )
        `;

		        let final = top;
		        if(size_x == size_y) {
		            final += pad_circle;
		            final += courtyard_circle;
		        } else {
		            final += pad_oval;
		            final += courtyard_oval;
		        }

		        final += bottom;

		        return final
		    }
		};
		return mounting_hole;
	}

	var nice_nano_pretty;
	var hasRequiredNice_nano_pretty;

	function requireNice_nano_pretty () {
		if (hasRequiredNice_nano_pretty) return nice_nano_pretty;
		hasRequiredNice_nano_pretty = 1;
		// Author: @infused-kim
		//
		// A reversible footprint for the nice!nano (or any pro-micro compatible
		// controller) that uses jumpers instead of two rows socket rows to achieve
		// reversablity.
		//
		// This is a re-implementation of the promicro_pretty footprint made popular
		// by @benvallack.
		//
		// The following improvements have been made:
		//    1. It uses real traces instead of pads, which gets rid of hundreds of
		//       DRC errors.
		//    2. It leaves more space between the vias to allow easier routing through
		//       the middle of the footprint
		//
		//
		// # Placement and jumper soldering:
		// The footprint is meant to be used with a nice!nano (or any other pro micro
		// compatible board) that is placed on the top side of the PCB with the
		// components facing down.
		//
		// This means when you look down at it, the RAW pin is in the upper left
		// corner and the 006 pin in the upper right corner.
		//
		// To make it work in this configuration, you solder the jumpers on the
		// OPPOSITE side.
		//
		// Due to the way how this footprint works, you can also place it with the
		// components facing up or even at the bottom. You just need to make sure you
		// solder the jumpers on the correct side.
		//
		// Regardless, the silkscreen labels are displayed in location that match when
		// the controller is placed with the components facing down.
		//
		// # Credits
		// This footprint was created from scratch, but is based on the ideas from
		// these footprints:
		// https://github.com/Albert-IV/ergogen-contrib/blob/main/src/footprints/promicro_pretty.js
		// https://github.com/50an6xy06r6n/keyboard_reversible.pretty

		nice_nano_pretty =  {
		    params: {
		      designator: 'MCU',
		      traces: true,

		      RAW: {type: 'net', value: 'RAW'},
		      GND: {type: 'net', value: 'GND'},
		      RST: {type: 'net', value: 'RST'},
		      VCC: {type: 'net', value: 'VCC'},
		      P21: {type: 'net', value: 'P21'},
		      P20: {type: 'net', value: 'P20'},
		      P19: {type: 'net', value: 'P19'},
		      P18: {type: 'net', value: 'P18'},
		      P15: {type: 'net', value: 'P15'},
		      P14: {type: 'net', value: 'P14'},
		      P16: {type: 'net', value: 'P16'},
		      P10: {type: 'net', value: 'P10'},

		      P1: {type: 'net', value: 'P1'},
		      P0: {type: 'net', value: 'P0'},
		      P2: {type: 'net', value: 'P2'},
		      P3: {type: 'net', value: 'P3'},
		      P4: {type: 'net', value: 'P4'},
		      P5: {type: 'net', value: 'P5'},
		      P6: {type: 'net', value: 'P6'},
		      P7: {type: 'net', value: 'P7'},
		      P8: {type: 'net', value: 'P8'},
		      P9: {type: 'net', value: 'P9'},

		      show_instructions: true,
		      show_silk_labels: true,
		      show_via_labels: true,

		      RAW_label: '',
		      GND_label: '',
		      RST_label: '',
		      VCC_label: '',
		      P21_label: '',
		      P20_label: '',
		      P19_label: '',
		      P18_label: '',
		      P15_label: '',
		      P14_label: '',
		      P16_label: '',
		      P10_label: '',

		      P1_label: '',
		      P0_label: '',
		      P2_label: '',
		      P3_label: '',
		      P4_label: '',
		      P5_label: '',
		      P6_label: '',
		      P7_label: '',
		      P8_label: '',
		      P9_label: '',

		      // This side parameter applies to all 3d models
		      mcu_3dmodel_side: '',

		      mcu_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Nice_Nano_V2.step',
		      mcu_3dmodel_xyz_scale: '',
		      mcu_3dmodel_xyz_rotation: '',
		      mcu_3dmodel_xyz_offset: '',

		      header_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/PinHeader_2.54mm_2x-12.step',
		      header_3dmodel_xyz_scale: '',
		      header_3dmodel_xyz_rotation: '',
		      header_3dmodel_xyz_offset: '',

		      socket_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/PinSocket_2.54mm_5mm_2x-12.step',
		      socket_3dmodel_xyz_scale: '',
		      socket_3dmodel_xyz_rotation: '',
		      socket_3dmodel_xyz_offset: '',
		    },
		    body: p => {

		      const gen_3d_model = (filename, scale, rotation, offset, side, {
		        default_side =  'F',
		        scale_f =       [1, 1, 1],
		        rotation_f =    [0, 0, 0],
		        offset_f =      [0, 0, 0],
		        scale_b =       [1, 1, 1],
		        rotation_b =    [0, 0, 0],
		        offset_b =      [0, 0, 0]
		      } = {}) => {

		        if(filename == '') {
		          return '';
		        }

		        const get_3d_model_side = (side, default_side) => {

		            if(side == '') {
		                if(p.reverse == true) {
		                    side = default_side;
		                } else {
		                    side = p.side;
		                }
		            }

		            if(side == 'F' || side == 'B') {
		                return side;
		            } else {
		                return default_side;
		            }
		        };

		        const final_side = get_3d_model_side(side, default_side);
		        const is_front = final_side === 'F';

		        // Determine the actual values to use
		        const final_scale = scale || (is_front ? scale_f : scale_b);
		        const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		        let final_offset = offset || (is_front ? offset_f : offset_b);

		        // Fix bug that seems to happen during the upgrade from KiCad 5 to
		        // 8. All offset values seem to be multiplied by 25.4. So here we
		        // divide them so that the upgrade KiCad file ends up with the
		        // correct value.
		        const offset_divisor = 25.4;
		        final_offset = final_offset.map(value => value / offset_divisor);

		        return  `
          (model ${filename}
            (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
            (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
            (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
          )
        `;
		      };

		      const get_pin_net_name = (p, pin_name) => {
		        return p[pin_name].name;
		      };

		      const get_pin_net_str = (p, pin_name) => {
		        return p[pin_name].str;
		      };

		      const get_pin_label_override = (p, pin_name) => {
		        prop_name = `${pin_name}_label`;
		        return p[prop_name];
		      };

		      const get_pin_label = (p, pin_name) => {
		        label = get_pin_label_override(p, pin_name);
		        if(label == '') {
		          label = get_pin_net_name(p, pin_name);
		        }

		        if(label === undefined) {
		          label = '""';
		        }

		        return label;
		      };

		      const get_at_coordinates = () => {
		        const pattern = /\(at (-?[\d\.]*) (-?[\d\.]*) (-?[\d\.]*)\)/;
		        const matches = p.at.match(pattern);
		        if (matches && matches.length == 4) {
		          return [parseFloat(matches[1]), parseFloat(matches[2]), parseFloat(matches[3])];
		        } else {
		          return null;
		        }
		      };

		      const adjust_point = (x, y) => {
		        const at_l = get_at_coordinates();
		        if(at_l == null) {
		          throw new Error(
		            `Could not get x and y coordinates from p.at: ${p.at}`
		          );
		        }
		        const at_x = at_l[0];
		        const at_y = at_l[1];
		        const at_angle = at_l[2];
		        const adj_x = at_x + x;
		        const adj_y = at_y + y;

		        const radians = (Math.PI / 180) * at_angle,
		          cos = Math.cos(radians),
		          sin = Math.sin(radians),
		          nx = (cos * (adj_x - at_x)) + (sin * (adj_y - at_y)) + at_x,
		          ny = (cos * (adj_y - at_y)) - (sin * (adj_x - at_x)) + at_y;

		        const point_str = `${nx.toFixed(2)} ${ny.toFixed(2)}`;
		        return point_str;
		      };

		      const gen_traces_row = (row_num) => {
		        const traces = `
          (segment (start ${ adjust_point(4.775, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(3.262, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer F.Cu) (net 1))
          (segment (start ${ adjust_point(-4.335002, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(-3.610001, -11.974999 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-4.775, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(-4.335002, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-3.610001, -11.974999 + (row_num * 2.54)) }) (end ${ adjust_point(-2.913999, -11.974999 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.536999, -12.351999 + (row_num * 2.54)) }) (end ${ adjust_point(-2.536999, -12.363001 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.913999, -11.974999 + (row_num * 2.54)) }) (end ${ adjust_point(-2.536999, -12.351999 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.536999, -12.363001 + (row_num * 2.54)) }) (end ${ adjust_point(-2.45, -12.45 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(3.012, -12.45 + (row_num * 2.54)) }) (end ${ adjust_point(3.262, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.45, -12.45 + (row_num * 2.54)) }) (end ${ adjust_point(3.012, -12.45 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-4.775, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(-3.262, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer F.Cu) (net 13))
          (segment (start ${ adjust_point(3.610001, -13.425001 + (row_num * 2.54)) }) (end ${ adjust_point(2.913999, -13.425001 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(4.335002, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(3.610001, -13.425001 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(4.775, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(4.335002, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(2.913999, -13.425001 + (row_num * 2.54)) }) (end ${ adjust_point(2.438998, -12.95 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(-3.012, -12.95 + (row_num * 2.54)) }) (end ${ adjust_point(-3.262, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(2.438998, -12.95 + (row_num * 2.54)) }) (end ${ adjust_point(-3.012, -12.95 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(-7.62, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(-5.5, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer F.Cu) (net 23))
          (segment (start ${ adjust_point(-7.62, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(-5.5, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 23))
          (segment (start ${ adjust_point(5.5, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(7.62, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer F.Cu) (net 24))
          (segment (start ${ adjust_point(7.62, -12.7 + (row_num * 2.54)) }) (end ${ adjust_point(5.5, -12.7 + (row_num * 2.54)) }) (width 0.25) (layer B.Cu) (net 24))
        `;

		        return traces
		      };

		      const gen_traces = () => {
		        let traces = '';
		        for (let i = 0; i < 12; i++) {
		          row_traces = gen_traces_row(i);
		          traces += row_traces;
		        }

		        return traces
		      };

		      const gen_socket_row = (row_num, pin_name_left, pin_name_right, show_via_labels, show_silk_labels) => {
		        const row_offset_y = 2.54 * row_num;

		        const socket_hole_num_left = 24 - row_num;
		        const socket_hole_num_right = 1 + row_num;
		        const via_num_left = 124 - row_num;
		        const via_num_right = 1 + row_num;

		        const net_left = get_pin_net_str(p, pin_name_left);
		        const net_right = get_pin_net_str(p, pin_name_right);
		        const via_label_left = get_pin_label(p, pin_name_left);
		        const via_label_right = get_pin_label(p, pin_name_right);

		        // These are the silkscreen labels that will be printed on the PCB.
		        // They tell us the orientation if the controller is placed with
		        // the components down, on top of the PCB and the jumpers are
		        // soldered on the opposite side than the controller.
		        const net_silk_front_left = via_label_right;
		        const net_silk_front_right = via_label_left;
		        const net_silk_back_left = via_label_left;
		        const net_silk_back_right = via_label_right;

		        let socket_row = `
          ${''/* Socket Holes */}
          (pad ${socket_hole_num_left} thru_hole circle (at -7.62 ${ -12.7 + row_offset_y}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net(socket_hole_num_left).str})
          (pad ${socket_hole_num_right} thru_hole circle (at 7.62 ${ -12.7 + row_offset_y}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net(socket_hole_num_right).str})

          ${''/* Inside VIAS */}
          (pad ${via_num_left} thru_hole circle (at -3.262 ${ -12.7 + row_offset_y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${net_left})
          (pad ${via_num_right} thru_hole circle (at 3.262 ${ -12.7 + row_offset_y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${net_right})

          ${''/* Jumper Pads - Front Left */}
          (pad ${socket_hole_num_left} smd custom (at -5.5 ${ -12.7 + row_offset_y}) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(socket_hole_num_left).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
            ) (width 0))
          ))
          (pad ${via_num_left} smd custom (at -4.775 ${ -12.7 + row_offset_y}) (size 0.2 0.2) (layers F.Cu F.Mask) ${net_left}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
            ) (width 0))
          ))

          ${''/* Jumper Pads - Front Right */}
          (pad ${via_num_right} smd custom (at 4.775 ${ -12.7 + row_offset_y} 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${net_right}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
            ) (width 0))
          ))
          (pad ${socket_hole_num_right} smd custom (at 5.5 ${ -12.7 + row_offset_y} 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(socket_hole_num_right).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
            ) (width 0))
          ))

          ${''/* Jumper Pads - Back Left */}
          (pad ${socket_hole_num_left} smd custom (at -5.5 ${ -12.7 + row_offset_y}) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(socket_hole_num_left).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
            ) (width 0))
          ))

          (pad ${via_num_right} smd custom (at -4.775 ${ -12.7 + row_offset_y}) (size 0.2 0.2) (layers B.Cu B.Mask) ${net_right}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
            ) (width 0))
          ))

          ${''/* Jumper Pads - Back Right */}
          (pad ${via_num_left} smd custom (at 4.775 ${ -12.7 + row_offset_y} 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${net_left}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
            ) (width 0))
          ))
          (pad ${socket_hole_num_right} smd custom (at 5.5 ${ -12.7 + row_offset_y} 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(socket_hole_num_right).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
            ) (width 0))
          ))
        `;

		        if(show_silk_labels == true) {
		          socket_row += `

            ${''/* Silkscreen Labels - Front */}
            (fp_text user ${net_silk_front_left} (at -3 ${ -12.7 + row_offset_y}) (layer F.SilkS)
              (effects (font (size 1 1) (thickness 0.15)) (justify left))
            )
            (fp_text user ${net_silk_front_right} (at 3 ${ -12.7 + row_offset_y}) (layer F.SilkS)
              (effects (font (size 1 1) (thickness 0.15)) (justify right))
            )

            ${''/* Silkscreen Labels - Back */}
            (fp_text user ${net_silk_back_left} (at -3 ${ -12.7 + row_offset_y} 180) (layer B.SilkS)
              (effects (font (size 1 1) (thickness 0.15)) (justify right mirror))
            )
            (fp_text user ${net_silk_back_right} (at 3 ${ -12.7 + row_offset_y} 180) (layer B.SilkS)
              (effects (font (size 1 1) (thickness 0.15)) (justify left mirror))
            )
          `;
		        }

		        if(show_via_labels == true) {
		          socket_row += `
            ${''/* Via Labels - Front */}
            (fp_text user ${via_label_left} (at -3.262 ${ -13.5 + row_offset_y}) (layer F.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)))
            )
            (fp_text user ${via_label_right} (at 3.262 ${ -13.5 + row_offset_y}) (layer F.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)))
            )

            ${''/* Via Labels - Back */}
            (fp_text user ${via_label_left} (at -3.262 ${ -13.5 + row_offset_y} 180) (layer B.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
            )
            (fp_text user ${via_label_right} (at 3.262 ${ -13.5 + row_offset_y} 180) (layer B.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
            )
          `;
		        }

		        return socket_row
		      };

		      const gen_socket_rows = (show_via_labels, show_silk_labels) => {
		        const pin_names = [
		          ['P1', 'RAW'],
		          ['P0', 'GND'],
		          ['GND', 'RST'],
		          ['GND', 'VCC'],
		          ['P2', 'P21'],
		          ['P3', 'P20'],
		          ['P4', 'P19'],
		          ['P5', 'P18'],
		          ['P6', 'P15'],
		          ['P7', 'P14'],
		          ['P8', 'P16'],
		          ['P9', 'P10'],
		        ];
		        let socket_rows = '';
		        for (let i = 0; i < pin_names.length; i++) {
		          pin_name_left = pin_names[i][0];
		          pin_name_right = pin_names[i][1];

		          const socket_row = gen_socket_row(
		            i, pin_name_left, pin_name_right,
		            show_via_labels, show_silk_labels
		          );

		          socket_rows += socket_row;
		        }

		        return socket_rows
		      };

		      const common_top = `
        (module nice_nano (layer F.Cu) (tedit 6451A4F1)
          (attr virtual)
          ${p.at /* parametric position */}
          (fp_text reference "${p.ref}" (at 0 -15) (layer F.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )

          ${''/* USB Socket Outline */}
          (fp_line (start 3.556 -18.034) (end 3.556 -16.51) (layer Dwgs.User) (width 0.15))
          (fp_line (start -3.81 -16.51) (end -3.81 -18.034) (layer Dwgs.User) (width 0.15))
          (fp_line (start -3.81 -18.034) (end 3.556 -18.034) (layer Dwgs.User) (width 0.15))

          ${''/* Courtyard Outline */}
          (fp_line (start 8.89 16.51) (end 8.89 -14.03) (layer F.CrtYd) (width 0.15))
          (fp_line (start 8.89 -14.03) (end -8.89 -14.03) (layer F.CrtYd) (width 0.15))
          (fp_line (start -8.89 -14.03) (end -8.89 16.51) (layer F.CrtYd) (width 0.15))
          (fp_line (start -8.89 16.51) (end 8.89 16.51) (layer F.CrtYd) (width 0.15))
          (fp_line (start -8.89 16.51) (end -8.89 -14.03) (layer B.CrtYd) (width 0.15))
          (fp_line (start -8.89 -14.03) (end 8.89 -14.03) (layer B.CrtYd) (width 0.15))
          (fp_line (start 8.89 -14.03) (end 8.89 16.51) (layer B.CrtYd) (width 0.15))
          (fp_line (start 8.89 16.51) (end -8.89 16.51) (layer B.CrtYd) (width 0.15))


          ${''/* Controller top part outline */}
          (fp_line (start -8.89 -16.51) (end 8.89 -16.51) (layer F.Fab) (width 0.12))
          (fp_line (start -8.89 -16.51) (end -8.89 -14) (layer F.Fab) (width 0.12))
          (fp_line (start 8.89 -16.51) (end 8.89 -14) (layer F.Fab) (width 0.12))
          (fp_line (start -8.89 -16.5) (end -8.89 -13.99) (layer B.Fab) (width 0.12))
          (fp_line (start 8.89 -16.51) (end 8.89 -14) (layer B.Fab) (width 0.12))
          (fp_line (start -8.89 -16.51) (end 8.89 -16.51) (layer B.Fab) (width 0.12))

          ${''/* Socket outlines */}
          (fp_line (start 6.29 -11.43) (end 8.95 -11.43) (layer F.SilkS) (width 0.12))
          (fp_line (start 6.29 -14.03) (end 8.95 -14.03) (layer F.SilkS) (width 0.12))
          (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer F.SilkS) (width 0.12))
          (fp_line (start 6.29 16.57) (end 8.95 16.57) (layer F.SilkS) (width 0.12))
          (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer F.SilkS) (width 0.12))
          (fp_line (start -8.95 -14.03) (end -6.29 -14.03) (layer F.SilkS) (width 0.12))
          (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer F.SilkS) (width 0.12))
          (fp_line (start -8.95 16.57) (end -6.29 16.57) (layer F.SilkS) (width 0.12))
          (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer F.SilkS) (width 0.12))
          (fp_line (start -8.95 -11.43) (end -6.29 -11.43) (layer B.SilkS) (width 0.12))
          (fp_line (start -6.29 -14.03) (end -8.95 -14.03) (layer B.SilkS) (width 0.12))
          (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer B.SilkS) (width 0.12))
          (fp_line (start -6.29 16.57) (end -8.95 16.57) (layer B.SilkS) (width 0.12))
          (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer B.SilkS) (width 0.12))
          (fp_line (start 8.95 -14.03) (end 6.29 -14.03) (layer B.SilkS) (width 0.12))
          (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer B.SilkS) (width 0.12))
          (fp_line (start 8.95 16.57) (end 6.29 16.57) (layer B.SilkS) (width 0.12))
          (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer B.SilkS) (width 0.12))
      `;

		      const instructions = `
          (fp_text user "R. Side - Jumper Here" (at 0 -15.245) (layer F.SilkS)
            (effects (font (size 1 1) (thickness 0.15)))
          )
          (fp_text user "L. Side - Jumper Here" (at 0 -15.245) (layer B.SilkS)
            (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
          )
    `;

		      const socket_rows = gen_socket_rows(
		        p.show_via_labels, p.show_silk_labels
		      );
		      const traces = gen_traces();

		      return `
          ${''/* Controller*/}
          ${ common_top }
          ${ socket_rows }
          ${ p.show_instructions ? instructions : '' }
          ${ gen_3d_model(
	                  p.mcu_3dmodel_filename,
	                  p.mcu_3dmodel_xyz_scale,
	                  p.mcu_3dmodel_xyz_rotation,
	                  p.mcu_3dmodel_xyz_offset,
	                  p.mcu_3dmodel_side,
	                  {
	                    rotation_f: [0, 0, 0],
	                    offset_f: [0, 0, 5.0],

	                    rotation_b: [0, 180, 0],
	                    offset_b: [0, 0, -6.6],
	                  },
	              )
	          }
          ${ gen_3d_model(
	                  p.header_3dmodel_filename,
	                  p.header_3dmodel_xyz_scale,
	                  p.header_3dmodel_xyz_rotation,
	                  p.header_3dmodel_xyz_offset,
	                  p.mcu_3dmodel_side,
	                  {
	                    rotation_f: [0, 0, 0],
	                    offset_f: [0, -1.4, 1.5],

	                    rotation_b: [0, 180, 0],
	                    offset_b: [0, -1.4, -3.1],
	                  },
	              )
	          }
          ${ gen_3d_model(
	                  p.socket_3dmodel_filename,
	                  p.socket_3dmodel_xyz_scale,
	                  p.socket_3dmodel_xyz_rotation,
	                  p.socket_3dmodel_xyz_offset,
	                  p.mcu_3dmodel_side,
	                  {
	                    rotation_f: [-90, 0, -90],
	                    offset_f: [0, -15.3, 0],

	                    rotation_b: [90, 0, -90],
	                    offset_b: [0, -15.3, -1.6],
	                  },
	              )
	          }
        )

        ${''/* Traces */}
        ${ p.traces ? traces : ''}
    `;
		    }
		  };
		return nice_nano_pretty;
	}

	var nice_view;
	var hasRequiredNice_view;

	function requireNice_view () {
		if (hasRequiredNice_view) return nice_view;
		hasRequiredNice_view = 1;
		// Author: @infused-kim
		//
		// Description:
		// Reversible footprint for nice!view display. Includes an outline of the
		// display to make positioning easier.

		nice_view = {
		  params: {
		    designator: 'DISP',
		    side: 'F',
		    reverse: false,
		    MOSI: {type: 'net', value: 'MOSI'},
		    SCK: {type: 'net', value: 'SCK'},
		    VCC: {type: 'net', value: 'VCC'},
		    GND: {type: 'net', value: 'GND'},
		    CS: {type: 'net', value: 'CS'},
		    show_labels: {type: 'boolean', value: true},
		    jumpers_at_bottom: false,

		    // This side parameter applies to all 3d models
		    display_3dmodel_side: '',

		    display_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Nice_View.step',
		    display_3dmodel_xyz_scale: '',
		    display_3dmodel_xyz_rotation: '',
		    display_3dmodel_xyz_offset: '',

		    header_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/PinHeader_2.54mm_1x-5.step',
		    header_3dmodel_xyz_scale: '',
		    header_3dmodel_xyz_rotation: '',
		    header_3dmodel_xyz_offset: '',

		    socket_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/PinSocket_2.54mm_5mm_1x-5.step',
		    socket_3dmodel_xyz_scale: '',
		    socket_3dmodel_xyz_rotation: '',
		    socket_3dmodel_xyz_offset: '',

		  },
		  body: p => {

		    const gen_3d_model = (filename, scale, rotation, offset, side, {
		      default_side =  'F',
		      scale_f =       [1, 1, 1],
		      rotation_f =    [0, 0, 0],
		      offset_f =      [0, 0, 0],
		      scale_b =       [1, 1, 1],
		      rotation_b =    [0, 0, 0],
		      offset_b =      [0, 0, 0]
		    } = {}) => {

		      if(filename == '') {
		        return '';
		      }

		      const get_3d_model_side = (side, default_side) => {

		          if(side == '') {
		              if(p.reverse == true) {
		                  side = default_side;
		              } else {
		                  side = p.side;
		              }
		          }

		          if(side == 'F' || side == 'B') {
		              return side;
		          } else {
		              return default_side;
		          }
		      };

		      const final_side = get_3d_model_side(side, default_side);
		      const is_front = final_side === 'F';

		      // Determine the actual values to use
		      const final_scale = scale || (is_front ? scale_f : scale_b);
		      const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		      let final_offset = offset || (is_front ? offset_f : offset_b);

		      // Fix bug that seems to happen during the upgrade from KiCad 5 to
		      // 8. All offset values seem to be multiplied by 25.4. So here we
		      // divide them so that the upgrade KiCad file ends up with the
		      // correct value.
		      const offset_divisor = 25.4;
		      final_offset = final_offset.map(value => value / offset_divisor);

		      return  `
        (model ${filename}
          (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
          (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
          (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
        )
      `;
		    };

		    let dst_nets = [
		      p.MOSI.str,
		      p.SCK.str,
		      p.VCC.str,
		      p.GND.str,
		      p.CS.str,
		    ];
		    local_nets = [
		      p.local_net("1").str,
		      p.local_net("2").str,
		      p.VCC.str,
		      p.local_net("4").str,
		      p.local_net("5").str,
		    ];

		    let socket_nets = dst_nets;
		    if(p.reverse) {
		      socket_nets = local_nets;
		    } else if(p.side == 'B') {
		      socket_nets = dst_nets.slice().reverse();
		    }

		    let jumpers_offset = 0;
		    let labels_offset = 0;
		    let label_vcc_offset = 0;

		    let jumpers_front_top = dst_nets;
		    let jumpers_front_bottom = local_nets;
		    let jumpers_back_top = dst_nets;
		    let jumpers_back_bottom = local_nets.slice().reverse();
		    if(p.jumpers_at_bottom) {
		      jumpers_offset = 5.7;
		      labels_offset = jumpers_offset + 2 + 1 + 0.1;
		      label_vcc_offset = 4.85;

		      jumpers_front_top = local_nets;
		      jumpers_front_bottom = dst_nets;
		      jumpers_back_top = local_nets.slice().reverse();
		      jumpers_back_bottom = dst_nets;
		    }

		    const top = `
      (module nice!view (layer F.Cu) (tedit 6448AF5B)
        ${p.at /* parametric position */}
        (attr virtual)
        (fp_text reference "${p.ref}" (at 0 20 ${p.rot}) (layer ${p.side}.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
        `;
		    const front = `
        (fp_line (start -6.5 -18) (end 6.5 -18) (layer F.Fab) (width 0.15))
        (fp_line (start 6.5 18) (end -6.5 18) (layer F.Fab) (width 0.15))
        (fp_line (start -7 17.5) (end -7 -17.5) (layer F.Fab) (width 0.15))
        (fp_line (start 7 17.5) (end 7 -17.5) (layer F.Fab) (width 0.15))
        (fp_line (start -6.41 15.37) (end -6.41 18.03) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.41 18.03) (end -6.41 18.03) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.88 14.9) (end 6.88 18.45) (layer F.CrtYd) (width 0.15))
        (fp_line (start 6.88 18.45) (end -6.82 18.45) (layer F.CrtYd) (width 0.15))
        (fp_line (start -6.82 18.45) (end -6.82 14.9) (layer F.CrtYd) (width 0.15))
        (fp_line (start -6.82 14.9) (end 6.88 14.9) (layer F.CrtYd) (width 0.15))
        (fp_line (start 6.41 15.37) (end 6.41 18.03) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.41 15.37) (end -6.41 15.37) (layer F.SilkS) (width 0.12))
        (fp_arc (start -6.5 17.5) (end -7 17.5) (angle -90) (layer F.Fab) (width 0.15))
        (fp_arc (start 6.5 17.5) (end 6.5 18) (angle -90) (layer F.Fab) (width 0.15))
        (fp_arc (start 6.5 -17.5) (end 6.5 -18) (angle 90) (layer F.Fab) (width 0.15))
        (fp_arc (start -6.5 -17.5) (end -6.5 -18) (angle -90) (layer F.Fab) (width 0.15))
        (fp_text user %R (at 0 20 ${p.rot}) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )

    `;

		    const front_jumpers = `
        (fp_line (start 5.93 ${12.9 + jumpers_offset}) (end 5.93 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -5.93 ${14.9 + jumpers_offset}) (end -5.93 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -5.93 ${12.9 + jumpers_offset}) (end -4.23 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -4.23 ${14.9 + jumpers_offset}) (end -5.93 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -4.23 ${12.9 + jumpers_offset}) (end -4.23 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -3.39 ${14.9 + jumpers_offset}) (end -3.39 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -3.39 ${12.9 + jumpers_offset}) (end -1.69 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -1.69 ${14.9 + jumpers_offset}) (end -3.39 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start -1.69 ${12.9 + jumpers_offset}) (end -1.69 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start 3.39 ${12.9 + jumpers_offset}) (end 3.39 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start 3.39 ${14.9 + jumpers_offset}) (end 1.69 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start 1.69 ${14.9 + jumpers_offset}) (end 1.69 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start 1.69 ${12.9 + jumpers_offset}) (end 3.39 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start 5.93 ${14.9 + jumpers_offset}) (end 4.23 ${14.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start 4.23 ${14.9 + jumpers_offset}) (end 4.23 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))
        (fp_line (start 4.23 ${12.9 + jumpers_offset}) (end 5.93 ${12.9 + jumpers_offset}) (layer F.Fab) (width 0.15))

        (pad 14 smd rect (at -5.08 ${13.45 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_top[0] })
        (pad 15 smd rect (at -2.54 ${13.45 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_top[1] })
        (pad 16 smd rect (at 2.54 ${13.45 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_top[3] })
        (pad 17 smd rect (at 5.08 ${13.45 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_top[4] })

        (pad 10 smd rect (at -5.08 ${14.35 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_bottom[0] })
        (pad 11 smd rect (at -2.54 ${14.35 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_bottom[1] })
        (pad 12 smd rect (at 2.54 ${14.35 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_bottom[3] })
        (pad 13 smd rect (at 5.08 ${14.35 + jumpers_offset} ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ jumpers_front_bottom[4] })
    `;

		    const back = `
        (fp_line (start 6.41 15.37) (end 6.41 18.03) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.41 15.37) (end -6.41 15.37) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.41 18.03) (end -6.41 18.03) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.88 14.9) (end 6.88 18.45) (layer B.CrtYd) (width 0.15))
        (fp_line (start 6.88 18.45) (end -6.82 18.45) (layer B.CrtYd) (width 0.15))
        (fp_line (start -6.82 18.45) (end -6.82 14.9) (layer B.CrtYd) (width 0.15))
        (fp_line (start -6.82 14.9) (end 6.88 14.9) (layer B.CrtYd) (width 0.15))
        (fp_line (start -6.41 15.37) (end -6.41 18.03) (layer B.SilkS) (width 0.12))
        (fp_line (start -6.5 18) (end 6.5 18) (layer B.Fab) (width 0.15))
        (fp_line (start 7 -17.5) (end 7 17.5) (layer B.Fab) (width 0.15))
        (fp_line (start 6.5 -18) (end -6.5 -18) (layer B.Fab) (width 0.15))
        (fp_line (start -7 -17.5) (end -7 17.5) (layer B.Fab) (width 0.15))
        (fp_arc (start -6.5 -17.5) (end -7 -17.5) (angle 90) (layer B.Fab) (width 0.15))
        (fp_arc (start 6.5 -17.5) (end 6.5 -18) (angle 90) (layer B.Fab) (width 0.15))
        (fp_arc (start 6.5 17.5) (end 6.5 18) (angle -90) (layer B.Fab) (width 0.15))
        (fp_arc (start -6.5 17.5) (end -6.5 18) (angle 90) (layer B.Fab) (width 0.15))
    `;

		    const back_jumpers = `
        (fp_line (start -5.93 ${12.9 + jumpers_offset}) (end -5.93 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start -5.93 ${14.9 + jumpers_offset}) (end -4.23 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start -4.23 ${12.9 + jumpers_offset}) (end -5.93 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start -4.23 ${14.9 + jumpers_offset}) (end -4.23 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start -3.39 ${14.9 + jumpers_offset}) (end -1.69 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start -1.69 ${12.9 + jumpers_offset}) (end -3.39 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 4.23 ${14.9 + jumpers_offset}) (end 5.93 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 5.93 ${14.9 + jumpers_offset}) (end 5.93 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 3.39 ${12.9 + jumpers_offset}) (end 1.69 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start -1.69 ${14.9 + jumpers_offset}) (end -1.69 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start -3.39 ${12.9 + jumpers_offset}) (end -3.39 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 1.69 ${12.9 + jumpers_offset}) (end 1.69 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 1.69 ${14.9 + jumpers_offset}) (end 3.39 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 3.39 ${14.9 + jumpers_offset}) (end 3.39 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 5.93 ${12.9 + jumpers_offset}) (end 4.23 ${12.9 + jumpers_offset}) (layer B.Fab) (width 0.15))
        (fp_line (start 4.23 ${12.9 + jumpers_offset}) (end 4.23 ${14.9 + jumpers_offset}) (layer B.Fab) (width 0.15))

        (pad 24 smd rect (at 5.08 ${13.45 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_top[0] })
        (pad 25 smd rect (at 2.54 ${13.45 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_top[1] })
        (pad 26 smd rect (at -2.54 ${13.45 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_top[3] })
        (pad 27 smd rect (at -5.08 ${13.45 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_top[4] })

        (pad 20 smd rect (at 5.08 ${14.35 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_bottom[0] })
        (pad 21 smd rect (at 2.54 ${14.35 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_bottom[1] })
        (pad 22 smd rect (at -2.54 ${14.35 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_bottom[3] })
        (pad 23 smd rect (at -5.08 ${14.35 + jumpers_offset} ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ jumpers_back_bottom[4] })
    `;

		    const labels = `
        (fp_text user DA (at -5.08 ${12.5 + labels_offset} ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user CS (at 5.12 ${12.5 + labels_offset} ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user GND (at 2.62 ${12.5 + labels_offset} ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user VCC (at 0.15 ${14.4 + label_vcc_offset} ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user CL (at -2.48 ${12.5 + labels_offset} ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user CS (at -4.98 ${12.5 + labels_offset} ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user VCC (at 0.15 ${14.4 + label_vcc_offset} ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user DA (at 5.22 ${12.5 + labels_offset} ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user CL (at 2.72 ${12.5 + labels_offset} ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user GND (at -2.38 ${12.5 + labels_offset} ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
    `;

		    const bottom = `
      (pad 1 thru_hole oval (at -5.08 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ socket_nets[0] })
      (pad 2 thru_hole oval (at -2.54 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ socket_nets[1] })
      (pad 3 thru_hole oval (at 0 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ socket_nets[2] })
      (pad 4 thru_hole oval (at 2.54 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ socket_nets[3] })
      (pad 5 thru_hole circle (at 5.08 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ socket_nets[4] })

      (fp_line (start 5.4 13.4) (end 5.4 -11.9) (layer Dwgs.User) (width 0.15))
      (fp_line (start -5.4 13.4) (end -5.4 -11.9) (layer Dwgs.User) (width 0.15))
      (fp_line (start 5.4 -11.9) (end -5.4 -11.9) (layer Dwgs.User) (width 0.15))
      (fp_line (start -5.4 13.4) (end 5.4 13.4) (layer Dwgs.User) (width 0.15))
    )
    `;

		    let final = top;

		    if(p.side == "F" || p.reverse) {
		      final += front;
		    }
		    if(p.side == "B" || p.reverse) {
		      final += back;
		    }

		    if(p.reverse) {
		      final += front_jumpers;
		      final += back_jumpers;

		      if(p.show_labels) {
		        final += labels;
		      }
		    }

		    final += `
      ${ gen_3d_model(
	            p.display_3dmodel_filename,
	            p.display_3dmodel_xyz_scale,
	            p.display_3dmodel_xyz_rotation,
	            p.display_3dmodel_xyz_offset,
	            p.display_3dmodel_side,
	            {
	              rotation_f: [0, 0, 0],
	              offset_f: [-7, -18, 6.8],

	              rotation_b: [0, 180, 0],
	              offset_b: [7, -18, -8.4],
	            },
	        )
	      }
      ${ gen_3d_model(
	            p.header_3dmodel_filename,
	            p.header_3dmodel_xyz_scale,
	            p.header_3dmodel_xyz_rotation,
	            p.header_3dmodel_xyz_offset,
	            p.display_3dmodel_side,
	            {
	              rotation_f: [0, 0, -90],
	              offset_f: [0, -16.7, 3],

	              rotation_b: [0, 0, -90],
	              offset_b: [0, -16.7, -9],
	            },
	        )
	      }
      ${ gen_3d_model(
	            p.socket_3dmodel_filename,
	            p.socket_3dmodel_xyz_scale,
	            p.socket_3dmodel_xyz_rotation,
	            p.socket_3dmodel_xyz_offset,
	            p.display_3dmodel_side,
	            {
	              rotation_f: [-90, 0, 0],
	              offset_f: [-5.1, -16.7, 0],

	              rotation_b: [90, 0, 0],
	              offset_b: [-5.1, -16.7, -1.6],
	            },
	        )
	      }
    `;

		    final += bottom;

		    return final;
		  }
		};
		return nice_view;
	}

	var pads;
	var hasRequiredPads;

	function requirePads () {
		if (hasRequiredPads) return pads;
		hasRequiredPads = 1;
		// Author: @infused-kim
		//
		// Description:
		// Let's you place solder pads on the PCB that can be used instead of
		// connectors. Useful for batteries and other peripherals in case the end-user
		// does not have the right cable connector.
		//
		// Fully reversible and pads are mirrored on the back side.

		pads = {
		    params: {
		        designator: 'PAD',
		        side: 'F',
		        reverse: true,
		        width: 1.25,
		        height: 2.5,
		        space: 2,
		        mirror: true,
		        pads: 2,
		        net_1: {type: 'net', value: 'PAD_1'},
		        net_2: {type: 'net', value: 'PAD_2'},
		        net_3: {type: 'net', value: 'PAD_3'},
		        net_4: {type: 'net', value: 'PAD_4'},
		        net_5: {type: 'net', value: 'PAD_5'},
		        net_6: {type: 'net', value: 'PAD_5'},
		        label_1: '',
		        label_2: '',
		        label_3: '',
		        label_4: '',
		        label_5: '',
		        label_6: '',
		        label_at_bottom: false,
		      },
		    body: p => {

		        const gen_nets = (p) => {
		          const all_nets = [
		            p.net_1.str, p.net_2.str, p.net_3.str,
		            p.net_4.str, p.net_5.str, p.net_6.str,
		          ];
		          const all_labels = [
		            p.label_1, p.label_2, p.label_3,
		            p.label_4, p.label_5, p.label_6,
		          ];

		          pad_cnt = p.pads;
		          if(pad_cnt > all_nets.length || pad_cnt > all_labels.length) {
		            pad_cnt = Math.min(all_nets.length, all_labels.length);
		          }

		          let nets = [];
		          for(let i = 0; i < pad_cnt; i++) {
		            let net = [
		              all_nets[i],
		              all_labels[i],
		            ];
		            nets.push(net);
		          }

		          return nets;
		        };

		        const gen_pad = (pad_idx, pad_cnt, net_str, net_label, width, height, space, rot, layer, label_at_bottom) =>
		        {
		            // Calculate the pad position from center
		            const pos_x_raw = (width + space) * pad_idx;

		            // Adjust it so that the pads are centered in the middle
		            const pos_x = (
		              pos_x_raw - (width + space) * (pad_cnt - 1) / 2
		            );

		            let label_pos_y = -1 * (height / 2 + 0.2);
		            let label_justify_direction = "left";
		            if(label_at_bottom) {
		              label_pos_y = label_pos_y * -1;
		              label_justify_direction = "right";
		            }

		            if(label_at_bottom == false || layer == 'B') {
		              if((rot > 0 && rot <= 180) || (rot <= -180)) {
		                label_justify_direction = "right";
		              } else {
		                label_justify_direction = "left";
		              }
		            } else {
		              if((rot > 0 && rot <= 180) || (rot <= -180)) {
		                label_justify_direction = "left";
		              } else {
		                label_justify_direction = "right";
		              }
		            }

		            let justify_mirror = '';
		            if(layer == 'B') {
		              justify_mirror = 'mirror';
		            }

		            let label_justify = '';
		            if(justify_mirror != '' || label_justify_direction != '') {
		              label_justify = `(justify ${label_justify_direction} ${justify_mirror})`;
		            }

		            let pad = `
                (pad ${pad_idx + 1} smd rect (at ${pos_x} 0 ${rot}) (size ${width} ${height}) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) ${net_str})
            `;

		            if(net_label) {
		              pad += `
                (fp_text user "${net_label}" (at ${pos_x} ${label_pos_y} ${90 + rot}) (layer ${layer}.SilkS)
                  (effects (font (size 1 1) (thickness 0.1)) ${label_justify})
                )
              `;
		            }

		            return pad;
		        };

		        const gen_pads = (nets, width, height, space, rot, layer, label_at_bottom, mirror) => {

		            if(mirror) {
		                nets = nets.slice().reverse();
		            }

		            let pads = '';
		            for (let [net_idx, net] of nets.entries()) {

		                const net_str = net[0];
		                const net_label = net[1];

		                const pad = gen_pad(
		                  net_idx,
		                  nets.length,
		                  net_str,
		                  net_label,
		                  width,
		                  height,
		                  space,
		                  rot,
		                  layer,
		                  label_at_bottom,
		                );

		                pads += pad;
		            }

		            return pads;
		        };

		        const nets = gen_nets(p);

		        let pads_front = '';
		        if(p.side == 'F' || p.reverse) {
		          pads_front = gen_pads(
		            nets,
		            p.width, p.height, p.space, p.rot, "F",
		            p.label_at_bottom, false,
		          );
		        }

		        let pads_back = '';
		        if(p.side == 'B' || p.reverse) {
		          pads_back = gen_pads(
		            nets,
		            p.width, p.height, p.space, p.rot, "B",
		            p.label_at_bottom, p.mirror,
		          );
		        }
		        const fp = `
          (module pads (layer F.Cu) (tedit 6446BF3D)
            ${p.at /* parametric position */}
            (attr smd)

            (fp_text reference "${p.ref}" (at 0 2.2) (layer F.SilkS) ${p.ref_hide}
              (effects (font (size 1 1) (thickness 0.15)))
            )
            ${pads_front}
            ${pads_back}
          )
        `;

		        return fp;
		    }
		};
		return pads;
	}

	var point_debugger;
	var hasRequiredPoint_debugger;

	function requirePoint_debugger () {
		if (hasRequiredPoint_debugger) return point_debugger;
		hasRequiredPoint_debugger = 1;
		// Author: @infused-kim
		//
		// Description:
		// Adds tiny x and y arrows at the origin of points to help with the debugging
		// of complex layouts.
		//
		// This will only show arrows for actual points you define. So if you draw an
		// outline without defining points, then they won't show up.
		//
		// Usage:
		// You can make enabling and disabling easy with ergogen's preprocessor:
		//
		// ```js
		// settings:
		//   point_debugger:
		//     enabled: false
		// [...]
		// pcbs:
		//   your_keyboard:
		//     footprints:
		//       point_debugger:
		//         what: infused-kim/point_debugger
		//         where: true
		//         params:
		//           $extends: settings.point_debugger
		// ```
		//
		// Showing the point name:
		// The footprint supports showing the name of the point when you zoom in, but
		// the latest version of ergogen (4.0.4) does not make the name available to
		// the footprint.
		//
		// Until this gets merged, you can use the ergogen fork from this PR:
		// https://github.com/ergogen/ergogen/pull/103

		point_debugger = {
		    params: {
		      designator: 'P',
		      enabled: true,
		    },
		    body: p => {
		        if(p.enabled == false) {
		            return '';
		        }

		        const top = `
            (module point_debugger (layer F.Cu) (tedit 64B42FA5)
                ${p.at /* parametric position */}
                (fp_text reference ${p.ref}"(at 0 2) (layer F.SilkS) ${p.ref_hide}
                    (effects (font (size 1 1) (thickness 0.15)))
                )
                (fp_line (start -0.6 0) (end 0.6 0) (layer Dwgs.User) (width 0.05))
                (fp_line (start 0 -0.6) (end 0 0.6) (layer Dwgs.User) (width 0.05))
                (fp_line (start 0.6 0) (end 0.5 -0.1) (layer Dwgs.User) (width 0.05))
                (fp_line (start 0.6 0) (end 0.5 0.1) (layer Dwgs.User) (width 0.05))
                (fp_line (start 0 -0.6) (end 0.1 -0.5) (layer Dwgs.User) (width 0.05))
                (fp_line (start 0 -0.6) (end -0.1 -0.5) (layer Dwgs.User) (width 0.05))
        `;

		        const bottom = `
            )
        `;

		        let final = top;

		        // point is a property that is not available to footprints as of
		        // ergogen 4.0.4. I have submitted a PR to add it and until then
		        // my custom fork needs to be used if you want to see it.
		        if('point' in p) {
		            final += `
                    (fp_text user ${p.point.meta.name} (at -0.3 -0.05 ${p.rot}) (layer Dwgs.User)
                        (effects (font (size 0.0254 0.0254) (thickness 0.001)))
                    )
            `;
		        }

		        final += bottom;

		        return final;
		    }
		};
		return point_debugger;
	}

	var smd_0805;
	var hasRequiredSmd_0805;

	function requireSmd_0805 () {
		if (hasRequiredSmd_0805) return smd_0805;
		hasRequiredSmd_0805 = 1;
		// Author: @infused-kim
		//
		// Description:
		// Let's you place multiple SMD 0805 components, such as resistors and
		// capacitors.
		//
		// Fully reversible and component order is mirrored on the back.

		smd_0805 = {
		    params: {
		        designator: 'SMD',
		        side: 'F',
		        reverse: true,
		        space: 2,
		        mirror: true,
		        swap_pad_direction: false,
		        components: 2,
		        net_1_from: {type: 'net', value: 'SMD_1_F'},
		        net_1_to: {type: 'net', value: 'SMD_1_T'},
		        net_2_from: {type: 'net', value: 'SMD_2_F'},
		        net_2_to: {type: 'net', value: 'SMD_2_T'},
		        net_3_from: {type: 'net', value: 'SMD_3_F'},
		        net_3_to: {type: 'net', value: 'SMD_3_T'},
		        net_4_from: {type: 'net', value: 'SMD_4_F'},
		        net_4_to: {type: 'net', value: 'SMD_4_T'},
		        net_5_from: {type: 'net', value: 'SMD_5_F'},
		        net_5_to: {type: 'net', value: 'SMD_5_T'},
		        net_6_from: {type: 'net', value: 'SMD_6_F'},
		        net_6_to: {type: 'net', value: 'SMD_6_T'},
		        label_1: '',
		        label_2: '',
		        label_3: '',
		        label_4: '',
		        label_5: '',
		        label_6: '',
		        label_at_bottom: false,

		        component_3dmodel_side: '',

		        component_1_3dmodel_filename: '',
		        component_1_3dmodel_xyz_scale: '',
		        component_1_3dmodel_xyz_rotation: '',
		        component_1_3dmodel_xyz_offset: '',
		        component_2_3dmodel_filename: '',
		        component_2_3dmodel_xyz_scale: '',
		        component_2_3dmodel_xyz_rotation: '',
		        component_2_3dmodel_xyz_offset: '',
		        component_3_3dmodel_filename: '',
		        component_3_3dmodel_xyz_scale: '',
		        component_3_3dmodel_xyz_rotation: '',
		        component_3_3dmodel_xyz_offset: '',
		        component_4_3dmodel_filename: '',
		        component_4_3dmodel_xyz_scale: '',
		        component_4_3dmodel_xyz_rotation: '',
		        component_4_3dmodel_xyz_offset: '',
		        component_5_3dmodel_filename: '',
		        component_5_3dmodel_xyz_scale: '',
		        component_5_3dmodel_xyz_rotation: '',
		        component_5_3dmodel_xyz_offset: '',
		        component_6_3dmodel_filename: '',
		        component_6_3dmodel_xyz_scale: '',
		        component_6_3dmodel_xyz_rotation: '',
		        component_6_3dmodel_xyz_offset: '',
		      },
		    body: p => {

		        const get_3d_model_side = (model_side, default_side) => {

		            if(model_side == '') {
		                if(p.reverse == true) {
		                    model_side = default_side;
		                } else {
		                    model_side = p.side;
		                }
		            }

		            if(model_side == 'F' || model_side == 'B') {
		                return model_side;
		            } else {
		                return default_side;
		            }
		        };

		        const gen_3d_model = (filename, scale, rotation, offset, side, {
		            default_side =  'F',
		            scale_f =       [1, 1, 1],
		            rotation_f =    [0, 0, 0],
		            offset_f =      [0, 0, 0],
		            scale_b =       [1, 1, 1],
		            rotation_b =    [0, 0, 0],
		            offset_b =      [0, 0, 0]
		        } = {}) => {

		            if(filename == '') {
		              return '';
		            }

		            const final_side = get_3d_model_side(side, default_side);
		            const is_front = final_side === 'F';

		            // Determine the actual values to use
		            const final_scale = scale || (is_front ? scale_f : scale_b);
		            const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		            let final_offset = offset || (is_front ? offset_f : offset_b);

		            // Fix bug that seems to happen during the upgrade from KiCad 5 to
		            // 8. All offset values seem to be multiplied by 25.4. So here we
		            // divide them so that the upgrade KiCad file ends up with the
		            // correct value.
		            const offset_divisor = 25.4;
		            final_offset = final_offset.map(value => value / offset_divisor);

		            return  `
                (model ${filename}
                (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
                (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
                (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
                )
            `;
		        };

		        const gen_3d_model_for_net = (net_idx, pos_x) => {
		            prop_base =         `component_${net_idx + 1}`;
		            prop_filename =     `${prop_base}_3dmodel_filename`;
		            prop_scale =        `${prop_base}_3dmodel_scale`;
		            prop_rotation =     `${prop_base}_3dmodel_rotation`;
		            prop_offset =       `${prop_base}_3dmodel_offset`;

		            if(!p[prop_filename]) {
		                return '';
		            }

		            const model = gen_3d_model(
		                p[prop_filename],
		                p[prop_scale],
		                p[prop_rotation],
		                p[prop_offset],
		                p.component_3dmodel_side,
		                {
		                  rotation_f: [0, 0, 0],
		                  offset_f:   [pos_x, 0, 0],

		                  rotation_b: [0, 180, 0],
		                  offset_b:   [-pos_x, 0, -1.6],
		                },
		            );

		            return model;
		        };

		        const gen_nets = (p) => {
		          const all_nets_from = [
		            p.net_1_from.str, p.net_2_from.str, p.net_3_from.str,
		            p.net_4_from.str, p.net_5_from.str, p.net_6_from.str,
		          ];
		          const all_nets_to = [
		            p.net_1_to.str, p.net_2_to.str, p.net_3_to.str,
		            p.net_4_to.str, p.net_5_to.str, p.net_6_to.str,
		          ];
		          const all_labels = [
		            p.label_1, p.label_2, p.label_3,
		            p.label_4, p.label_5, p.label_6,
		          ];

		          pad_cnt = p.components;
		          if(pad_cnt > all_nets_from.length || pad_cnt > all_nets_to.length ||
		             pad_cnt > all_labels.length) {
		            pad_cnt = Math.min(
		              all_nets_from.length, all_nets_to.length, all_labels.length
		            );
		          }

		          let nets = [];
		          for(let i = 0; i < pad_cnt; i++) {
		            let net = [
		              all_nets_from[i],
		              all_nets_to[i],
		              all_labels[i],
		            ];
		            nets.push(net);
		          }

		          return nets;
		        };

		        const gen_pad = (pad_idx, pad_cnt, net_from, net_to, net_label, space, rot, layer, label_at_bottom) =>
		        {
		            const width = 1.025;
		            const height= 3.36;

		            // Calculate the pad position from center
		            const pos_x_raw = (width + space) * pad_idx;

		            // Adjust it so that the pads are centered in the middle
		            const pos_x = (
		              pos_x_raw - (width + space) * (pad_cnt - 1) / 2
		            );

		            let label_pos_y = -1 * (height / 2 + 0.2);
		            let label_justify_direction = "left";
		            if(label_at_bottom) {
		              label_pos_y = label_pos_y * -1;
		              label_justify_direction = "right";
		            }

		            if(label_at_bottom == false || layer == 'B') {
		              if((rot > 0 && rot <= 180) || (rot <= -180)) {
		                label_justify_direction = "right";
		              } else {
		                label_justify_direction = "left";
		              }
		            } else {
		              if((rot > 0 && rot <= 180) || (rot <= -180)) {
		                label_justify_direction = "left";
		              } else {
		                label_justify_direction = "right";
		              }
		            }

		            let justify_mirror = '';
		            if(layer == 'B') {
		              justify_mirror = 'mirror';
		            }

		            let label_justify = '';
		            if(justify_mirror != '' || label_justify_direction != '') {
		              label_justify = `(justify ${label_justify_direction} ${justify_mirror})`;
		            }

		            let label_fab_justify = '';
		            if(justify_mirror) {
		              label_fab_justify = `(justify ${justify_mirror})`;
		            }

		            const pad_num = pad_idx*2+1;
		            let pad = `
                (fp_line (start ${0.625 + pos_x} -1) (end ${0.625 + pos_x} 1) (layer ${layer}.Fab) (width 0.1))
                (fp_line (start ${ -0.625 + pos_x} -1) (end ${0.625 + pos_x} -1) (layer ${layer}.Fab) (width 0.1))
                (fp_line (start ${ -0.625 + pos_x} 1) (end ${ -0.625 + pos_x} -1) (layer ${layer}.Fab) (width 0.1))
                (fp_line (start ${0.625 + pos_x} 1) (end ${ -0.625 + pos_x} 1) (layer ${layer}.Fab) (width 0.1))

                (fp_line (start ${0.95 + pos_x} -1.68) (end ${0.95 + pos_x} 1.68) (layer ${layer}.CrtYd) (width 0.05))
                (fp_line (start ${ -0.95 + pos_x} -1.68) (end ${0.95 + pos_x} -1.68) (layer ${layer}.CrtYd) (width 0.05))
                (fp_line (start ${ -0.95 + pos_x} 1.68) (end ${ -0.95 + pos_x} -1.68) (layer ${layer}.CrtYd) (width 0.05))
                (fp_line (start ${0.95 + pos_x} 1.68) (end ${ -0.95 + pos_x} 1.68) (layer ${layer}.CrtYd) (width 0.05))

                (fp_line (start ${0.735 + pos_x} 0.227064) (end ${0.735 + pos_x} -0.227064) (layer ${layer}.SilkS) (width 0.12))
                (fp_line (start ${ -0.735 + pos_x} 0.227064) (end ${ -0.735 + pos_x} -0.227064) (layer ${layer}.SilkS) (width 0.12))

                (pad ${pad_num} smd roundrect (at ${0 + pos_x} 0.9125 ${90 + rot}) (size 1.025 1.4) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) (roundrect_rratio 0.243902) ${net_from})
                (pad ${pad_num + 1} smd roundrect (at ${0 + pos_x} -0.9125 ${90 + rot}) (size 1.025 1.4) (layers ${layer}.Cu ${layer}.Paste ${layer}.Mask) (roundrect_rratio 0.243902) ${net_to})
            `;

		            if(net_label) {
		              pad += `
              (fp_text user "${net_label}" (at ${0 + pos_x} 0 ${90 + rot}) (layer ${layer}.Fab)
                (effects (font (size 0.5 0.5) (thickness 0.08)) ${label_fab_justify})
              )
              (fp_text user "${net_label}" (at ${pos_x} ${label_pos_y} ${90 + rot}) (layer ${layer}.SilkS)
                  (effects (font (size 1 1) (thickness 0.1)) ${label_justify})
                )
              `;
		            }

		            const side_3dmodel = get_3d_model_side(p.component_3dmodel_side, 'F');
		            if(layer == side_3dmodel) {
		                pad += gen_3d_model_for_net(pad_idx, pos_x);
		            }

		            return pad;
		        };

		        const gen_pads = (nets, space, rot, layer, label_at_bottom, mirror, swap_pad_direction) => {

		            if(mirror) {
		                nets = nets.slice().reverse();
		            }

		            let pads = '';
		            for (let [net_idx, net] of nets.entries()) {

		                let net_from = net[0];
		                let net_to = net[1];
		                const net_label = net[2];

		                if(swap_pad_direction) {
		                  net_from = net[1];
		                  net_to = net[0];
		                }

		                const pad = gen_pad(
		                  net_idx,
		                  nets.length,
		                  net_from,
		                  net_to,
		                  net_label,
		                  space,
		                  rot,
		                  layer,
		                  label_at_bottom);

		                pads += pad;
		            }

		            return pads;
		        };

		        const nets = gen_nets(p);

		        let pads_front = '';
		        if(p.side == 'F' || p.reverse) {
		          pads_front = gen_pads(
		            nets,
		            p.space, p.rot, "F",
		            p.label_at_bottom, false, p.swap_pad_direction,
		          );
		        }

		        let pads_back = '';
		        if(p.side == 'B' || p.reverse) {
		          pads_back = gen_pads(
		            nets,
		            p.space, p.rot, "B",
		            p.label_at_bottom, p.mirror, p.swap_pad_direction,
		          );
		        }

		        const fp = `
          (module smd_805 (layer F.Cu) (tedit 6446BF3D)
            ${p.at /* parametric position */}
            (attr smd)

            (fp_text reference "${p.ref}" (at 0 3) (layer F.SilkS) ${p.ref_hide}
              (effects (font (size 1 1) (thickness 0.15)))
            )
            ${pads_front}
            ${pads_back}
          )
        `;

		        return fp;
		    }
		};
		return smd_0805;
	}

	var switch_power;
	var hasRequiredSwitch_power;

	function requireSwitch_power () {
		if (hasRequiredSwitch_power) return switch_power;
		hasRequiredSwitch_power = 1;
		// Author: @infused-kim
		//
		// Description:
		// Power switch for wireless boards.
		//
		// Should be compatible with:
		//  - G-Switch MK-12C02-G015
		//  - Alps SSSS811101
		//  - PCM12SMTR

		switch_power = {
		    params: {
		      designator: 'SW',
		      side: 'F',
		      reverse: false,
		      from: {type: 'net', value: 'BAT_P'},
		      to: {type: 'net', value: 'RAW'},

		      switch_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Switch_Power.step',
		      switch_3dmodel_side: '',
		      switch_3dmodel_xyz_scale: '',
		      switch_3dmodel_xyz_rotation: '',
		      switch_3dmodel_xyz_offset: '',
		    },
		    body: p => {

		      const gen_3d_model = (filename, scale, rotation, offset, side, {
		        default_side =  'F',
		        scale_f =       [1, 1, 1],
		        rotation_f =    [0, 0, 0],
		        offset_f =      [0, 0, 0],
		        scale_b =       [1, 1, 1],
		        rotation_b =    [0, 0, 0],
		        offset_b =      [0, 0, 0]
		      } = {}) => {

		        if(filename == '') {
		          return '';
		        }

		        const get_3d_model_side = (side, default_side) => {

		            if(side == '') {
		                if(p.reverse == true) {
		                    side = default_side;
		                } else {
		                    side = p.side;
		                }
		            }

		            if(side == 'F' || side == 'B') {
		                return side;
		            } else {
		                return default_side;
		            }
		        };

		        const final_side = get_3d_model_side(side, default_side);
		        const is_front = final_side === 'F';

		        // Determine the actual values to use
		        const final_scale = scale || (is_front ? scale_f : scale_b);
		        const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		        let final_offset = offset || (is_front ? offset_f : offset_b);

		        // Fix bug that seems to happen during the upgrade from KiCad 5 to
		        // 8. All offset values seem to be multiplied by 25.4. So here we
		        // divide them so that the upgrade KiCad file ends up with the
		        // correct value.
		        const offset_divisor = 25.4;
		        final_offset = final_offset.map(value => value / offset_divisor);

		        return  `
          (model ${filename}
            (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
            (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
            (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
          )
        `;
		      };

		      const shared_1 = `
        (module power_switch (layer F.Cu) (tedit 644556E6)
          ${p.at /* parametric position */}
          (attr smd)

      `;

		      const front_switch = `
          (fp_text reference "${p.ref}" (at -3.6 0 ${ -90 + p.rot}) (layer F.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )

          (fp_line (start 0.415 -3.45) (end -0.375 -3.45) (layer F.SilkS) (width 0.12))
          (fp_line (start -0.375 3.45) (end 0.415 3.45) (layer F.SilkS) (width 0.12))
          (fp_line (start -1.425 1.6) (end -1.425 -0.1) (layer F.SilkS) (width 0.12))
          (fp_line (start 1.425 2.85) (end 1.425 -2.85) (layer F.SilkS) (width 0.12))
          (fp_line (start 1.795 4.4) (end -2.755 4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.795 1.65) (end 1.795 4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start 3.095 1.65) (end 1.795 1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start 3.095 -1.65) (end 3.095 1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.795 -1.65) (end 3.095 -1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.795 -4.4) (end 1.795 -1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start -2.755 -4.4) (end 1.795 -4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start -2.755 4.4) (end -2.755 -4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start -1.425 -1.4) (end -1.425 -1.6) (layer F.SilkS) (width 0.12))
          (fp_line (start -1.305 -3.35) (end -1.305 3.35) (layer F.Fab) (width 0.1))
          (fp_line (start 1.295 -3.35) (end -1.305 -3.35) (layer F.Fab) (width 0.1))
          (fp_line (start 1.295 3.35) (end 1.295 -3.35) (layer F.Fab) (width 0.1))
          (fp_line (start -1.305 3.35) (end 1.295 3.35) (layer F.Fab) (width 0.1))
          (fp_line (start 2.595 0.1) (end 1.295 0.1) (layer F.Fab) (width 0.1))
          (fp_line (start 2.645 0.15) (end 2.595 0.1) (layer F.Fab) (width 0.1))
          (fp_line (start 2.845 0.35) (end 2.645 0.15) (layer F.Fab) (width 0.1))
          (fp_line (start 2.845 1.2) (end 2.845 0.35) (layer F.Fab) (width 0.1))
          (fp_line (start 2.645 1.4) (end 2.845 1.2) (layer F.Fab) (width 0.1))
          (fp_line (start 1.345 1.4) (end 2.645 1.4) (layer F.Fab) (width 0.1))

          (pad "" smd rect (at 1.125 -3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))
          (pad "" smd rect (at -1.085 -3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))
          (pad "" smd rect (at -1.085 3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))
          (pad 1 smd rect (at -1.735 2.25 ${90 + p.rot}) (size 0.7 1.5) (layers F.Cu F.Paste F.Mask))
          (pad 2 smd rect (at -1.735 -0.75 ${90 + p.rot}) (size 0.7 1.5) (layers F.Cu F.Paste F.Mask) ${p.from.str})
          (pad 3 smd rect (at -1.735 -2.25 ${90 + p.rot}) (size 0.7 1.5) (layers F.Cu F.Paste F.Mask) ${p.to.str})
          (pad "" smd rect (at 1.125 3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))

      `;
		      const back_switch = `
        ${'' /* Add the optional parts here */}
        (fp_text user "${p.ref}" (at -3.5 0 ${90 + p.rot}) (layer B.SilkS) ${p.ref_hide}
        (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
        )
        (fp_line (start 2.595 -0.1) (end 1.295 -0.1) (layer B.Fab) (width 0.1))
        (fp_line (start -1.305 3.35) (end -1.305 -3.35) (layer B.Fab) (width 0.1))
        (fp_line (start 2.645 -0.15) (end 2.595 -0.1) (layer B.Fab) (width 0.1))
        (fp_line (start -1.425 1.4) (end -1.425 1.6) (layer B.SilkS) (width 0.12))
        (fp_line (start 0.415 3.45) (end -0.375 3.45) (layer B.SilkS) (width 0.12))
        (fp_line (start -0.375 -3.45) (end 0.415 -3.45) (layer B.SilkS) (width 0.12))
        (fp_line (start -1.425 -1.6) (end -1.425 0.1) (layer B.SilkS) (width 0.12))
        (fp_line (start 1.425 -2.85) (end 1.425 2.85) (layer B.SilkS) (width 0.12))
        (fp_line (start 1.795 4.4) (end 1.795 1.65) (layer B.CrtYd) (width 0.05))
        (fp_line (start -2.755 4.4) (end 1.795 4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.845 -1.2) (end 2.845 -0.35) (layer B.Fab) (width 0.1))
        (fp_line (start 1.345 -1.4) (end 2.645 -1.4) (layer B.Fab) (width 0.1))
        (fp_line (start 1.795 -4.4) (end -2.755 -4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 1.795 -1.65) (end 1.795 -4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.095 -1.65) (end 1.795 -1.65) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.845 -0.35) (end 2.645 -0.15) (layer B.Fab) (width 0.1))
        (fp_line (start 2.645 -1.4) (end 2.845 -1.2) (layer B.Fab) (width 0.1))
        (fp_line (start 1.295 -3.35) (end 1.295 3.35) (layer B.Fab) (width 0.1))
        (fp_line (start 1.295 3.35) (end -1.305 3.35) (layer B.Fab) (width 0.1))
        (fp_line (start -1.305 -3.35) (end 1.295 -3.35) (layer B.Fab) (width 0.1))
        (fp_line (start -2.755 -4.4) (end -2.755 4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.095 1.65) (end 3.095 -1.65) (layer B.CrtYd) (width 0.05))
        (fp_line (start 1.795 1.65) (end 3.095 1.65) (layer B.CrtYd) (width 0.05))
        (pad "" smd rect (at -1.085 -3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        (pad "" smd rect (at 1.125 -3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        (pad 4 smd rect (at -1.735 2.25 ${270 + p.rot}) (size 0.7 1.5) (layers B.Cu B.Paste B.Mask))
        (pad "" smd rect (at -1.085 3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        (pad 5 smd rect (at -1.735 0.75 ${270 + p.rot}) (size 0.7 1.5) (layers B.Cu B.Paste B.Mask) ${p.from.str})
        (pad 6 smd rect (at -1.735 -2.25 ${270 + p.rot}) (size 0.7 1.5) (layers B.Cu B.Paste B.Mask) ${p.to.str})
        (pad "" smd rect (at 1.125 3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        `;

		        const shared_2 = `
          (pad "" np_thru_hole circle (at 0.025 -1.5 ${90 + p.rot}) (size 0.9 0.9) (drill 0.9) (layers *.Cu *.Mask))
          (pad "" np_thru_hole circle (at 0.025 1.5 ${90 + p.rot}) (size 0.9 0.9) (drill 0.9) (layers *.Cu *.Mask))
        `;

		        let final = shared_1;

		        if(p.side == "F" || p.reverse) {
		          final += front_switch;
		        }
		        if(p.side == "B" || p.reverse) {
		          final += back_switch;
		        }


		        final += shared_2;

		        final += gen_3d_model(
		          p.switch_3dmodel_filename,
		          p.switch_3dmodel_xyz_scale,
		          p.switch_3dmodel_xyz_rotation,
		          p.switch_3dmodel_xyz_offset,
		          p.switch_3dmodel_side,
		          {
		            default_side: 'B',

		            rotation_f: [-90, 0, -90],
		            offset_f: [0, 0, 0],

		            rotation_b: [90, 0, 90],
		            offset_b: [0, 0, -1.6],
		          },
		        );

		        final += `
          )
        `;

		        return final;
		    }
		  };
		return switch_power;
	}

	var switch_reset;
	var hasRequiredSwitch_reset;

	function requireSwitch_reset () {
		if (hasRequiredSwitch_reset) return switch_reset;
		hasRequiredSwitch_reset = 1;
		// Author: @infused-kim
		//
		// Description:
		// Reversible footprint for nice nano

		// Should be compatible with:
		// EVQ-P7A01P
		//
		// WARNING: This is not the same reset switch commonly used in the keyboard
		// community. This switch faces sideways and is lower profile.

		switch_reset = {
		    params: {
		      designator: 'SW',
		      side: 'F',
		      reverse: false,
		      from: {type: 'net', value: 'GND'},
		      to: {type: 'net', value: 'RST'},

		      switch_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Switch_Reset.step',
		      switch_3dmodel_side: '',
		      switch_3dmodel_xyz_scale: '',
		      switch_3dmodel_xyz_rotation: '',
		      switch_3dmodel_xyz_offset: '',
		    },
		    body: p => {

		      const gen_3d_model = (filename, scale, rotation, offset, side, {
		        default_side =  'F',
		        scale_f =       [1, 1, 1],
		        rotation_f =    [0, 0, 0],
		        offset_f =      [0, 0, 0],
		        scale_b =       [1, 1, 1],
		        rotation_b =    [0, 0, 0],
		        offset_b =      [0, 0, 0]
		      } = {}) => {

		        if(filename == '') {
		          return '';
		        }

		        const get_3d_model_side = (side, default_side) => {

		            if(side == '') {
		                if(p.reverse == true) {
		                    side = default_side;
		                } else {
		                    side = p.side;
		                }
		            }

		            if(side == 'F' || side == 'B') {
		                return side;
		            } else {
		                return default_side;
		            }
		        };

		        const final_side = get_3d_model_side(side, default_side);
		        const is_front = final_side === 'F';

		        // Determine the actual values to use
		        const final_scale = scale || (is_front ? scale_f : scale_b);
		        const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		        let final_offset = offset || (is_front ? offset_f : offset_b);

		        // Fix bug that seems to happen during the upgrade from KiCad 5 to
		        // 8. All offset values seem to be multiplied by 25.4. So here we
		        // divide them so that the upgrade KiCad file ends up with the
		        // correct value.
		        const offset_divisor = 25.4;
		        final_offset = final_offset.map(value => value / offset_divisor);

		        return  `
          (model ${filename}
            (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
            (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
            (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
          )
        `;
		      };

		      const top = `
        (module sw_reset_side (layer F.Cu) (tedit 64473C6F)
          ${p.at /* parametric position */}
          (attr smd)

          (fp_text reference "${p.ref}" (at 0 3.5 ${p.rot}) (layer ${p.side}.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )
      `;
		      const front = `
          (fp_line (start 1.7 2.75) (end -1.7 2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start -1.7 2.75) (end -1.7 -2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start 2.1 0.85) (end 2.1 -0.85) (layer F.Fab) (width 0.1))
          (fp_line (start 1.7 -1.1) (end 2.35 -1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start -1.7 -2.75) (end 1.7 -2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.45 -1.75) (end 1.45 1.75) (layer F.Fab) (width 0.1))
          (fp_line (start 1.7 1.1) (end 1.7 2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start 2.35 1.1) (end 1.7 1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.7 -2.75) (end 1.7 -1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.55 -1.75) (end 1.55 1.75) (layer F.SilkS) (width 0.12))
          (fp_line (start 2.1 -0.85) (end 1.45 -0.85) (layer F.Fab) (width 0.1))
          (fp_line (start 2.35 -1.1) (end 2.35 1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start 2.1 0.85) (end 1.45 0.85) (layer F.Fab) (width 0.1))
          (fp_line (start -1.55 1.75) (end -1.55 -1.75) (layer F.SilkS) (width 0.12))
          (fp_line (start 1.45 1.75) (end -1.4 1.75) (layer F.Fab) (width 0.1))
          (fp_line (start -1.45 1.75) (end -1.45 -1.75) (layer F.Fab) (width 0.1))
          (fp_line (start -1.45 -1.75) (end 1.45 -1.75) (layer F.Fab) (width 0.1))

          (pad 1 smd rect (at -0.72 -1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.from.str})

          (pad 1 smd rect (at -0.72 1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.from.str})
          (pad 2 smd rect (at 0.72 -1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.to.str})
          (pad 2 smd rect (at 0.72 1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.to.str})
      `;
		      const back = `
      (fp_line (start -1.45 1.75) (end 1.45 1.75) (layer B.Fab) (width 0.1))
      (fp_line (start 1.45 1.75) (end 1.45 -1.75) (layer B.Fab) (width 0.1))
      (fp_line (start 1.7 -1.1) (end 1.7 -2.75) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.35 -1.1) (end 1.7 -1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 1.7 2.75) (end 1.7 1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 1.55 1.75) (end 1.55 -1.75) (layer B.SilkS) (width 0.12))
      (fp_line (start 2.1 0.85) (end 1.45 0.85) (layer B.Fab) (width 0.1))
      (fp_line (start 2.35 1.1) (end 2.35 -1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.1 -0.85) (end 1.45 -0.85) (layer B.Fab) (width 0.1))
      (fp_line (start -1.55 -1.75) (end -1.55 1.75) (layer B.SilkS) (width 0.12))
      (fp_line (start 1.45 -1.75) (end -1.4 -1.75) (layer B.Fab) (width 0.1))
      (fp_line (start -1.45 -1.75) (end -1.45 1.75) (layer B.Fab) (width 0.1))
      (fp_line (start 1.7 -2.75) (end -1.7 -2.75) (layer B.CrtYd) (width 0.05))
      (fp_line (start -1.7 -2.75) (end -1.7 2.75) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.1 -0.85) (end 2.1 0.85) (layer B.Fab) (width 0.1))
      (fp_line (start 1.7 1.1) (end 2.35 1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start -1.7 2.75) (end 1.7 2.75) (layer B.CrtYd) (width 0.05))
      (pad 1 smd rect (at -0.72 -1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.from.str})
      (pad 2 smd rect (at 0.72 1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.to.str})
      (pad 2 smd rect (at 0.72 -1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.to.str})
      (pad 1 smd rect (at -0.72 1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.from.str})
      (fp_text user ${p.ref} (at 0 3.5 ${p.rot}) (layer B.SilkS) ${p.ref_hide}
        (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      )
      `;

		      const bottom = `
        )
      `;

		      let final = top;

		      if(p.side == "F" || p.reverse) {
		        final += front;
		      }
		      if(p.side == "B" || p.reverse) {
		        final += back;
		      }

		      final += gen_3d_model(
		        p.switch_3dmodel_filename,
		        p.switch_3dmodel_xyz_scale,
		        p.switch_3dmodel_xyz_rotation,
		        p.switch_3dmodel_xyz_offset,
		        p.switch_3dmodel_side,
		        {
		          default_side: 'B',

		          rotation_f: [-90, 0, -90],
		          offset_f: [0, 0, 0],

		          rotation_b: [90, 0, 90],
		          offset_b: [0, 0, -1.6],
		        },
		      );

		      final += bottom;

		      return final;
		    }
		 };
		return switch_reset;
	}

	var text;
	var hasRequiredText;

	function requireText () {
		if (hasRequiredText) return text;
		hasRequiredText = 1;
		// Author: @infused-kim
		//
		// Description:
		// Allows oyu to place text on the PCB.

		text = {
		  params: {
		    designator: 'TXT',
		    side: 'F',
		    reverse: false,
		    text: 'Awesomeness',
		  },
		  body: p => {
		    const front = `
      (gr_text "${p.text}" ${p.at} (layer F.SilkS)
        (effects (font (size 1 1) (thickness 0.15)))
      )
    `;
		    const back = `
      (gr_text "${p.text}" ${p.at} (layer B.SilkS)
        (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      )
    `;

		    let final = '';

		    if(p.side == "F" || p.reverse) {
		      final += front;
		    }
		    if(p.side == "B" || p.reverse) {
		      final += back;
		    }

		    return final;
		  }
		};
		return text;
	}

	var trackpoint_mount;
	var hasRequiredTrackpoint_mount;

	function requireTrackpoint_mount () {
		if (hasRequiredTrackpoint_mount) return trackpoint_mount;
		hasRequiredTrackpoint_mount = 1;
		// Author: @infused-kim
		//
		// Description:
		// Adds mounting holes for a trackpoint to the PCB.
		//
		// Should be compatible with:
		//  - Thinkpad T430
		//  - Thinkpad T440 / X240
		//
		// Check this page for other models:
		// https://deskthority.net/wiki/TrackPoint_Hardware

		trackpoint_mount = {
		  params: {
		    designator: 'TP',
		    side: 'B',
		    reverse: false,

		    // T430: 3.5
		    // T460S (red one): 3.5
		    // X240: 5.5
		    drill: 5.5,
		    outline: 0.25,

		    show_outline_t430: false,
		    show_outline_x240: false,
		    show_outline_t460s: false,
		    show_board: false,

		      // This side parameter applies to all 3d models
		      tp_3dmodel_side: '',

		      tp_cap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Cap_Red_T460S.step',
		      tp_cap_3dmodel_xyz_scale: '',
		      tp_cap_3dmodel_xyz_rotation: '',
		      tp_cap_3dmodel_xyz_offset: '',

		      tp_extension_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Extension_Red_T460S_h10.5_md0.0_pcb1.6.step',
		      tp_extension_3dmodel_xyz_scale: '',
		      tp_extension_3dmodel_xyz_rotation: '',
		      tp_extension_3dmodel_xyz_offset: '',

		      tp_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Red_T460S_platform_z_offset_+0.0_pcb_offset_-2.0.step',
		      tp_3dmodel_xyz_scale: '',
		      tp_3dmodel_xyz_rotation: '',
		      tp_3dmodel_xyz_offset: '',
		  },
		  body: p => {

		    const gen_3d_model = (filename, scale, rotation, offset, side, {
		      default_side =  'F',
		      scale_f =       [1, 1, 1],
		      rotation_f =    [0, 0, 0],
		      offset_f =      [0, 0, 0],
		      scale_b =       [1, 1, 1],
		      rotation_b =    [0, 0, 0],
		      offset_b =      [0, 0, 0]
		    } = {}) => {

		      if(filename == '') {
		        return '';
		      }

		      const get_3d_model_side = (side, default_side) => {

		          if(side == '') {
		              if(p.reverse == true) {
		                  side = default_side;
		              } else {
		                  side = p.side;
		              }
		          }

		          if(side == 'F' || side == 'B') {
		              return side;
		          } else {
		              return default_side;
		          }
		      };

		      const final_side = get_3d_model_side(side, default_side);
		      const is_front = final_side === 'F';

		      // Determine the actual values to use
		      const final_scale = scale || (is_front ? scale_f : scale_b);
		      const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
		      let final_offset = offset || (is_front ? offset_f : offset_b);

		      // Fix bug that seems to happen during the upgrade from KiCad 5 to
		      // 8. All offset values seem to be multiplied by 25.4. So here we
		      // divide them so that the upgrade KiCad file ends up with the
		      // correct value.
		      const offset_divisor = 25.4;
		      final_offset = final_offset.map(value => value / offset_divisor);

		      return  `
        (model ${filename}
          (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
          (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
          (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
        )
      `;
		    };

		    const top = `
      (module trackpoint_mount_t430 (layer F.Cu) (tedit 6449FFC5)
        ${p.at /* parametric position */}
        (attr virtual)

        (fp_text reference "${p.ref}" (at 0 0) (layer ${p.side}.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
    `;

		    const front = `
        (fp_circle (center 0 -9.75) (end -2.15 -9.75) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 -9.75) (end -1.9 -9.75) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 9.75) (end -2.15 9.75) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 9.75) (end -1.9 9.75) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 0) (end -3.95 0) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 0) (end -3.7 0) (layer Cmts.User) (width 0.15))

        (fp_text user %R (at 0 0 180) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )
    `;
		    const back = `
        (fp_circle (center 0 0) (end -3.95 0) (layer B.CrtYd) (width 0.05))
        (fp_circle (center 0 0) (end -3.7 0) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 9.75) (end -2.15 9.75) (layer B.CrtYd) (width 0.05))
        (fp_circle (center 0 -9.75) (end -2.15 -9.75) (layer B.CrtYd) (width 0.05))
    `;

		    const outline_t430_front = `
        (fp_line (start -4.5 -12.75) (end -9.5 -7.25) (layer F.Fab) (width 0.2))
        (fp_line (start -9.5 7.25) (end -4.5 12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 6.5 8) (end 6.5 -8) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 9.5 -12.75) (layer F.Fab) (width 0.2))
        (fp_line (start -9.5 7.25) (end -9.5 -7.25) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 -12.75) (end -4.5 -12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 12.75) (end -4.5 12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 6.5 -8) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 8) (end 9.5 12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 8) (end 6.5 8) (layer F.Fab) (width 0.2))
        (fp_line (start 8.5 5.5) (end 8.5 -5.5) (layer F.Fab) (width 0.2))
        (fp_line (start 8.5 -5.5) (end 6.5 -5.5) (layer F.Fab) (width 0.2))
        (fp_line (start 8.5 5.5) (end 6.5 5.5) (layer F.Fab) (width 0.2))
    `;

		    const outline_t430_back = `
        (fp_line (start -4.5 12.75) (end -9.5 7.25) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 9.5 -12.75) (layer B.Fab) (width 0.12))
        (fp_line (start 9.5 8) (end 9.5 12.75) (layer B.Fab) (width 0.2))
        (fp_line (start 6.5 -8) (end 6.5 8) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 -12.75) (end -4.5 -12.75) (layer B.Fab) (width 0.2))
        (fp_line (start -9.5 -7.25) (end -4.5 -12.75) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 6.5 -8) (layer B.Fab) (width 0.12))
        (fp_line (start 9.5 8) (end 6.5 8) (layer B.Fab) (width 0.2))
        (fp_line (start -9.5 -7.25) (end -9.5 7.25) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 12.75) (end -4.5 12.75) (layer B.Fab) (width 0.2))
        (fp_line (start 8.5 -5.5) (end 8.5 5.5) (layer B.Fab) (width 0.2))
        (fp_line (start 8.5 -5.5) (end 6.5 -5.5) (layer B.Fab) (width 0.2))
        (fp_line (start 8.5 5.5) (end 6.5 5.5) (layer B.Fab) (width 0.2))
    `;

		    const outline_x240_front = `
        (fp_line (start 12.25 -6.5) (end 6.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 12.25 6.5) (end 6.75 6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 12.25 6.5) (end 12.25 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6.75 11.5) (end -6.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6.75 -11.5) (end -6.75 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -6.75 11.5) (end -6.75 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6.75 11.5) (end 6.75 -11.5) (layer F.Fab) (width 0.2))
    `;

		    const outline_x240_back = `
        (fp_line (start 12.25 -6.5) (end 6.75 -6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 12.25 -6.5) (end 12.25 6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.75 -11.5) (end -6.75 -11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.75 11.5) (end -6.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -6.75 -11.5) (end -6.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.75 -11.5) (end 6.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 12.25 6.5) (end 6.75 6.5) (layer B.Fab) (width 0.2))
    `;

		    const outline_x240_board = `
        (fp_line (start 39.25 12) (end 23.25 12) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 5.5) (end 23.25 12) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 -5.5) (end 23.25 5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 5.5) (end 12.25 5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 -5.5) (end 12.25 -5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 39.25 -22) (end 39.25 12) (layer Dwgs.User) (width 0.2))
        (fp_line (start 39.25 -22) (end 23.25 -22) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 -22) (end 23.25 -5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 12.25 -5.5) (end 12.25 5.5) (layer Dwgs.User) (width 0.2))
    `;

		    const outline_t460s_front = `
        (fp_line (start 2.75 6.5) (end 6.25 3) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 11.5) (end -2.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -6.25 3) (end -6.25 -3) (layer F.Fab) (width 0.2))
        (fp_line (start 6.25 3) (end 6.25 -3) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end -2.75 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 6.5) (end 2.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -2.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -2.75 -11.5) (end -2.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end 2.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -6.25 3) (layer F.Fab) (width 0.2))
        (fp_line (start 6.25 -3) (end 2.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start -6.25 -3) (end -2.75 -6.5) (layer F.Fab) (width 0.2))
    `;

		    const outline_t460s_back = `
        (fp_line (start -6.25 -3) (end -2.75 -6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.25 -3) (end 2.75 -6.5) (layer B.Fab) (width 0.2))

        (fp_line (start 2.75 6.5) (end 6.25 3) (layer B.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -6.25 3) (layer B.Fab) (width 0.2))

        (fp_line (start 6.25 3) (end 6.25 -3) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 11.5) (end -2.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -6.25 3) (end -6.25 -3) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end -2.75 -11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -2.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 6.5) (end 2.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -2.75 -11.5) (end -2.75 -6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end 2.75 -6.5) (layer B.Fab) (width 0.2))
    `;

		    const outline_t460s_board = `
        (fp_line (start 38.25 12.25) (end 22.25 12.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 2.75) (end 22.25 12.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 -2.75) (end 22.25 2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 2.75) (end 6.25 2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 -2.75) (end 6.25 -2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 38.25 -22.25) (end 38.25 12.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 38.25 -22.25) (end 22.25 -22.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 -22.25) (end 22.25 -2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 6.25 -2.75) (end 6.25 2.75) (layer Dwgs.User) (width 0.2))
    `;

		    const size = p.drill + (p.outline * 2);
		    const bottom = `
        (pad "" thru_hole circle (at 0 -9.75 180) (size 3.8 3.8) (drill 2.2) (layers *.Cu *.Mask))
        (pad 1 np_thru_hole circle (at 0 0 180) (size ${size} ${size}) (drill ${p.drill}) (layers *.Cu *.Mask))
        (pad "" thru_hole circle (at 0 9.75 180) (size 3.8 3.8) (drill 2.2) (layers *.Cu *.Mask))
      )
    `;

		    let final = top;

		    if(p.side == "F" || p.reverse) {
		      final += front;

		      if(p.show_outline_t430) {
		        final += outline_t430_front;
		      }
		      if(p.show_outline_x240) {
		        final += outline_x240_front;
		      }
		      if(p.show_outline_t460s) {
		        final += outline_t460s_front;
		      }
		    }

		    if(p.side == "B" || p.reverse) {
		      final += back;
		      if(p.show_outline_t430) {
		        final += outline_t430_back;
		      }
		      if(p.show_outline_x240) {
		        final += outline_x240_back;
		      }
		      if(p.show_outline_t460s) {
		        final += outline_t460s_back;
		      }
		    }

		    if(p.show_board) {
		      if(p.show_outline_x240) {
		        final += outline_x240_board;
		      }
		      if(p.show_outline_t460s) {
		        final += outline_t460s_board;
		      }
		    }

		    final += `
      ${ gen_3d_model(
	              p.tp_cap_3dmodel_filename,
	              p.tp_cap_3dmodel_xyz_scale,
	              p.tp_cap_3dmodel_xyz_rotation,
	              p.tp_cap_3dmodel_xyz_offset,
	              p.tp_3dmodel_side,
	              {
	                rotation_f: [0, 0, 0],
	                offset_f: [0, 0, 10.5],

	                rotation_b: [0, 180, 0],
	                offset_b: [0, 0, -12.1],
	              },
	          )
	        }

      ${ gen_3d_model(
	              p.tp_extension_3dmodel_filename,
	              p.tp_extension_3dmodel_xyz_scale,
	              p.tp_extension_3dmodel_xyz_rotation,
	              p.tp_extension_3dmodel_xyz_offset,
	              p.tp_3dmodel_side,
	              {
	                rotation_f: [0, 0, 0],
	                offset_f: [0, 0, 0],

	                rotation_b: [0, 180, 0],
	                offset_b: [0, 0, -1.6],
	              },
	          )
	        }

      ${ gen_3d_model(
	              p.tp_3dmodel_filename,
	              p.tp_3dmodel_xyz_scale,
	              p.tp_3dmodel_xyz_rotation,
	              p.tp_3dmodel_xyz_offset,
	              p.tp_3dmodel_side,
	              {
	                rotation_f: [0, 0, 180],
	                offset_f: [0, 0, 0],

	                rotation_b: [0, 0, 0],
	                offset_b: [0, 0, 0],
	              },
	          )
	        }
    `;

		    final += bottom;

		    return final;
		  }
		};
		return trackpoint_mount;
	}

	var footprints;
	var hasRequiredFootprints;

	function requireFootprints () {
		if (hasRequiredFootprints) return footprints;
		hasRequiredFootprints = 1;
		footprints = {
		  alps: requireAlps(),
		  button: requireButton(),
		  choc: requireChoc$1(),
		  chocmini: requireChocmini(),
		  diode: requireDiode$1(),
		  jstph: requireJstph(),
		  jumper: requireJumper(),
		  mx: requireMx(),
		  oled: requireOled(),
		  omron: requireOmron(),
		  pad: requirePad(),
		  promicro: requirePromicro(),
		  rgb: requireRgb(),
		  rotary: requireRotary(),
		  scrollwheel: requireScrollwheel(),
		  slider: requireSlider(),
		  trrs: requireTrrs(),
		  via: requireVia(),
		  // @ceoloide's footprints
		  'ceoloide/battery_connector_jst_ph_2': requireBattery_connector_jst_ph_2(),
		  'ceoloide/battery_connector_molex_pico_ezmate_1x02': requireBattery_connector_molex_pico_ezmate_1x02(),
		  'ceoloide/diode_tht_sod123': requireDiode_tht_sod123(),
		  'ceoloide/display_nice_view': requireDisplay_nice_view(),
		  'ceoloide/display_ssd1306': requireDisplay_ssd1306(),
		  'ceoloide/led_sk6812mini-e': requireLed_sk6812miniE(),
		  'ceoloide/mcu_nice_nano': requireMcu_nice_nano(),
		  'ceoloide/mcu_supermini_nrf52840': requireMcu_supermini_nrf52840(),
		  'ceoloide/mounting_hole_npth': requireMounting_hole_npth(),
		  'ceoloide/mounting_hole_plated': requireMounting_hole_plated(),
		  'ceoloide/power_switch_smd_side': requirePower_switch_smd_side(),
		  'ceoloide/reset_switch_smd_side': requireReset_switch_smd_side(),
		  'ceoloide/reset_switch_tht_top': requireReset_switch_tht_top(),
		  'ceoloide/rotary_encoder_ec11_ec12': requireRotary_encoder_ec11_ec12(),
		  'ceoloide/switch_choc_v1_v2': requireSwitch_choc_v1_v2(),
		  'ceoloide/switch_gateron_ks27_ks33': requireSwitch_gateron_ks27_ks33(),
		  'ceoloide/switch_mx': requireSwitch_mx(),
		  'ceoloide/trrs_pj320a': requireTrrs_pj320a(),
		  'ceoloide/utility_ergogen_logo': requireUtility_ergogen_logo(),
		  'ceoloide/utility_filled_zone': requireUtility_filled_zone(),
		  'ceoloide/utility_keepout_zone': requireUtility_keepout_zone(),
		  'ceoloide/utility_point_debugger': requireUtility_point_debugger(),
		  'ceoloide/utility_router': requireUtility_router(),
		  'ceoloide/utility_text': requireUtility_text(),
		  // @infused-kim's footprints
		  'infused-kim/choc': requireChoc(),
		  'infused-kim/conn_molex_pico_ezmate_1x02': requireConn_molex_pico_ezmate_1x02(),
		  'infused-kim/conn_molex_pico_ezmate_1x05': requireConn_molex_pico_ezmate_1x05(),
		  'infused-kimo/isde': requireDiode(),
		  'infused-kim/icon_bat': requireIcon_bat(),
		  'infused-kim/mounting_hole': requireMounting_hole(),
		  'infused-kim/nice_nano_pretty': requireNice_nano_pretty(),
		  'infused-kim/nice_view': requireNice_view(),
		  'infused-kim/pads': requirePads(),
		  'infused-kim/point_debugger': requirePoint_debugger(),
		  'infused-kim/smd_0805': requireSmd_0805(),
		  'infused-kim/switch_power': requireSwitch_power(),
		  'infused-kim/switch_reset': requireSwitch_reset(),
		  'infused-kim/text': requireText(),
		  'infused-kim/trackpoint_mount': requireTrackpoint_mount(),
		};
		return footprints;
	}

	var kicad5;
	var hasRequiredKicad5;

	function requireKicad5 () {
		if (hasRequiredKicad5) return kicad5;
		hasRequiredKicad5 = 1;
		const m = require$$0;

		kicad5 = {

		    convert_outline: (model, layer) => {
		        const grs = [];
		        const xy = val => `${val[0]} ${-val[1]}`;
		        m.model.walk(model, {
		            onPath: wp => {
		                const p = wp.pathContext;
		                switch (p.type) {
		                    case 'line':
		                        grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (angle 90) (layer ${layer}) (width 0.15))`);
		                        break
		                    case 'arc':
		                        const arc_center = p.origin;
		                        const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle;
		                        const angle_diff = Math.abs(p.endAngle - angle_start);
		                        const arc_end = m.point.rotate(m.point.add(arc_center, [p.radius, 0]), angle_start, arc_center);
		                        grs.push(`(gr_arc (start ${xy(arc_center)}) (end ${xy(arc_end)}) (angle ${-angle_diff}) (layer ${layer}) (width 0.15))`);
		                        break
		                    case 'circle':
		                        const circle_center = p.origin;
		                        const circle_end = m.point.add(circle_center, [p.radius, 0]);
		                        grs.push(`(gr_circle (center ${xy(circle_center)}) (end ${xy(circle_end)}) (layer ${layer}) (width 0.15))`);
		                        break
		                    default:
		                        throw new Error(`Can't convert path type "${p.type}" to kicad!`)
		                }
		            }
		        });
		        return grs.join('\n')
		    },

		    body: params => {

		        const net_text = params.nets.join('\n');
		        const netclass_text = params.nets.map(net => `(add_net "${net.name}")`).join('\n');
		        const footprint_text = params.footprints.join('\n');
		        const outline_text = Object.values(params.outlines).join('\n');
		        
		        return `

(kicad_pcb (version 20171130) (host pcbnew 5.1.6)

  (page A3)
  (title_block
    (title "${params.name}")
    (rev "${params.version}")
    (company "${params.author}")
  )

  (general
    (thickness 1.6)
  )

  (layers
    (0 F.Cu signal)
    (31 B.Cu signal)
    (32 B.Adhes user)
    (33 F.Adhes user)
    (34 B.Paste user)
    (35 F.Paste user)
    (36 B.SilkS user)
    (37 F.SilkS user)
    (38 B.Mask user)
    (39 F.Mask user)
    (40 Dwgs.User user)
    (41 Cmts.User user)
    (42 Eco1.User user)
    (43 Eco2.User user)
    (44 Edge.Cuts user)
    (45 Margin user)
    (46 B.CrtYd user)
    (47 F.CrtYd user)
    (48 B.Fab user)
    (49 F.Fab user)
  )

  (setup
    (last_trace_width 0.25)
    (trace_clearance 0.2)
    (zone_clearance 0.508)
    (zone_45_only no)
    (trace_min 0.2)
    (via_size 0.8)
    (via_drill 0.4)
    (via_min_size 0.4)
    (via_min_drill 0.3)
    (uvia_size 0.3)
    (uvia_drill 0.1)
    (uvias_allowed no)
    (uvia_min_size 0.2)
    (uvia_min_drill 0.1)
    (edge_width 0.05)
    (segment_width 0.2)
    (pcb_text_width 0.3)
    (pcb_text_size 1.5 1.5)
    (mod_edge_width 0.12)
    (mod_text_size 1 1)
    (mod_text_width 0.15)
    (pad_size 1.524 1.524)
    (pad_drill 0.762)
    (pad_to_mask_clearance 0.05)
    (aux_axis_origin 0 0)
    (visible_elements FFFFFF7F)
    (pcbplotparams
      (layerselection 0x010fc_ffffffff)
      (usegerberextensions false)
      (usegerberattributes true)
      (usegerberadvancedattributes true)
      (creategerberjobfile true)
      (excludeedgelayer true)
      (linewidth 0.100000)
      (plotframeref false)
      (viasonmask false)
      (mode 1)
      (useauxorigin false)
      (hpglpennumber 1)
      (hpglpenspeed 20)
      (hpglpendiameter 15.000000)
      (psnegative false)
      (psa4output false)
      (plotreference true)
      (plotvalue true)
      (plotinvisibletext false)
      (padsonsilk false)
      (subtractmaskfromsilk false)
      (outputformat 1)
      (mirror false)
      (drillshape 1)
      (scaleselection 1)
      (outputdirectory ""))
  )

  ${net_text}

  (net_class Default "This is the default net class."
    (clearance 0.2)
    (trace_width 0.25)
    (via_dia 0.8)
    (via_drill 0.4)
    (uvia_dia 0.3)
    (uvia_drill 0.1)
    ${netclass_text}
  )

  ${footprint_text}
  ${outline_text}

)

`

		}
		};
		return kicad5;
	}

	var kicad8;
	var hasRequiredKicad8;

	function requireKicad8 () {
		if (hasRequiredKicad8) return kicad8;
		hasRequiredKicad8 = 1;
		const m = require$$0;
		const version = require$$8.version;

		kicad8 = {

		    convert_outline: (model, layer) => {
		        const grs = [];
		        const xy = val => `${val[0]} ${-val[1]}`;
		        m.model.walk(model, {
		            onPath: wp => {
		                const p = wp.pathContext;
		                switch (p.type) {
		                    case 'line':
		                        grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (layer ${layer}) (stroke (width 0.15) (type default)))`);
		                        break
		                    case 'arc':
		                        const arc_center = p.origin;
		                        const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle;
		                        const angle_diff = Math.abs(p.endAngle - angle_start);
		                        const arc_start = m.point.rotate(m.point.add(arc_center, [p.radius, 0]), angle_start, arc_center);
		                        const arc_mid = m.point.rotate(arc_start, angle_diff / 2, arc_center);
		                        const arc_end = m.point.rotate(arc_start, angle_diff, arc_center);
		                        grs.push(`(gr_arc (start ${xy(arc_start)}) (mid ${xy(arc_mid)}) (end ${xy(arc_end)}) (layer ${layer}) (stroke (width 0.15) (type default)))`);
		                        break
		                    case 'circle':
		                        const circle_center = p.origin;
		                        const circle_end = m.point.add(circle_center, [p.radius, 0]);
		                        grs.push(`(gr_circle (center ${xy(circle_center)}) (end ${xy(circle_end)}) (layer ${layer}) (stroke (width 0.15) (type default)) (fill none))`);
		                        break
		                    default:
		                        throw new Error(`Can't convert path type "${p.type}" to kicad!`)
		                }
		            }
		        });
		        return grs.join('\n')
		    },

		    body: params => {
		        const date_text = new Date().toISOString().slice(0, 10);
		        const net_text = params.nets.join('\n');
		        const footprint_text = params.footprints.join('\n');
		        const outline_text = Object.values(params.outlines).join('\n');

		        return `

(kicad_pcb
  (version 20240108)
  (generator "ergogen")
  (generator_version "${version}")
  (general
    (thickness 1.6)
    (legacy_teardrops no)
  )
  (paper "A3")
  (title_block
    (title "${params.name}")
    (date "${date_text}")
    (rev "${params.version}")
    (company "${params.author}")
  )

  (layers
    (0 "F.Cu" signal)
    (31 "B.Cu" signal)
    (32 "B.Adhes" user "B.Adhesive")
    (33 "F.Adhes" user "F.Adhesive")
    (34 "B.Paste" user)
    (35 "F.Paste" user)
    (36 "B.SilkS" user "B.Silkscreen")
    (37 "F.SilkS" user "F.Silkscreen")
    (38 "B.Mask" user)
    (39 "F.Mask" user)
    (40 "Dwgs.User" user "User.Drawings")
    (41 "Cmts.User" user "User.Comments")
    (42 "Eco1.User" user "User.Eco1")
    (43 "Eco2.User" user "User.Eco2")
    (44 "Edge.Cuts" user)
    (45 "Margin" user)
    (46 "B.CrtYd" user "B.Courtyard")
    (47 "F.CrtYd" user "F.Courtyard")
    (48 "B.Fab" user)
    (49 "F.Fab" user)
  )

  (setup
    (pad_to_mask_clearance 0.05)
    (allow_soldermask_bridges_in_footprints no)
    (pcbplotparams
      (layerselection 0x00010fc_ffffffff)
      (plot_on_all_layers_selection 0x0000000_00000000)
      (disableapertmacros no)
      (usegerberextensions no)
      (usegerberattributes yes)
      (usegerberadvancedattributes yes)
      (creategerberjobfile yes)
      (dashed_line_dash_ratio 12.000000)
      (dashed_line_gap_ratio 3.000000)
      (svgprecision 4)
      (plotframeref no)
      (viasonmask no)
      (mode 1)
      (useauxorigin no)
      (hpglpennumber 1)
      (hpglpenspeed 20)
      (hpglpendiameter 15.000000)
      (pdf_front_fp_property_popups yes)
      (pdf_back_fp_property_popups yes)
      (dxfpolygonmode yes)
      (dxfimperialunits yes)
      (dxfusepcbnewfont yes)
      (psnegative no)
      (psa4output no)
      (plotreference yes)
      (plotvalue yes)
      (plotfptext yes)
      (plotinvisibletext no)
      (sketchpadsonfab no)
      (subtractmaskfromsilk no)
      (outputformat 1)
      (mirror no)
      (drillshape 1)
      (scaleselection 1)
      (outputdirectory "")
    )
  )

  ${net_text}

  ${footprint_text}
  ${outline_text}

)

`

		}
		};
		return kicad8;
	}

	var templates;
	var hasRequiredTemplates;

	function requireTemplates () {
		if (hasRequiredTemplates) return templates;
		hasRequiredTemplates = 1;
		templates = {
		    kicad5: requireKicad5(),
		    kicad8: requireKicad8()
		};
		return templates;
	}

	var hasRequiredPcbs;

	function requirePcbs () {
		if (hasRequiredPcbs) return pcbs;
		hasRequiredPcbs = 1;
		const yaml = require$$2;

		const u = requireUtils();
		const a = requireAssert();
		const prep = requirePrepare();
		const anchor = requireAnchor().parse;
		const filter = requireFilter().parse;

		const footprint_types = requireFootprints();
		const template_types = requireTemplates();

		pcbs.inject_footprint = (name, fp) => {
		    footprint_types[name] = fp;
		};

		pcbs.inject_template = (name, t) => {
		    template_types[name] = t;
		};

		const xy_obj = (x, y) => {
		    return {
		        x,
		        y,
		        str: `${x} ${y}`,
		        toString: function() { return this.str }
		    }
		};

		const net_obj = (name, index) => {
		    return {
		        name,
		        index,
		        str: `(net ${index} "${name}")`,
		        toString: function() { return this.str }
		    }
		};

		const footprint = pcbs._footprint = (points, net_indexer, component_indexer, units, extra) => (config, name, point) => {

		    // config sanitization
		    a.unexpected(config, name, ['what', 'params']);
		    const what = a.in(config.what, `${name}.what`, Object.keys(footprint_types));
		    const fp = footprint_types[what];
		    const original_params = config.params || {};

		    // param sanitization
		    // we unset the mirror config, as it would be an unexpected field
		    let params = u.deepcopy(original_params);
		    delete params.mirror;
		    // but still override with it when applicable
		    if (point.meta.mirrored && original_params.mirror !== undefined) {
		        const mirror_overrides = a.sane(original_params.mirror, `${name}.params.mirror`, 'object')();
		        params = prep.extend(params, mirror_overrides);
		    }
		    a.unexpected(params, `${name}.params`, Object.keys(fp.params));

		    // parsing parameters
		    const parsed_params = {};
		    for (const [param_name, param_def] of Object.entries(fp.params)) {

		        // expand param definition shorthand
		        let parsed_def = param_def;
		        let def_type = a.type(param_def)(units);
		        if (def_type == 'string') {
		            parsed_def = {type: 'string', value: param_def};
		        } else if (def_type == 'number') {
		            parsed_def = {type: 'number', value: a.mathnum(param_def)(units)};
		        } else if (def_type == 'boolean') {
		            parsed_def = {type: 'boolean', value: param_def};
		        } else if (def_type == 'array') {
		            parsed_def = {type: 'array', value: param_def};
		        } else if (def_type == 'object') {
		            // parsed param definitions also expand to an object
		            // so to detect whether this is an arbitrary object,
		            // we first have to make sure it's not an expanded param def
		            // (this has to be a heuristic, but should be pretty reliable)
		            const defarr = Object.keys(param_def);
		            const already_expanded = defarr.length == 2 && defarr.includes('type') && defarr.includes('value');
		            if (!already_expanded) {
		                parsed_def = {type: 'object', value: param_def};
		            }
		        } else {
		            parsed_def = {type: 'net', value: undefined};
		        }

		        // combine default value with potential user override
		        let value = params[param_name] !== undefined ? params[param_name] : parsed_def.value;
		        const type = parsed_def.type;

		        // templating support, with conversion back to raw datatypes
		        const converters = {
		            string: v => v,
		            number: v => a.sane(v, `${name}.params.${param_name}`, 'number')(units),
		            boolean: v => v === 'true' || a.mathnum(v)(units) === 1,
		            array: v => yaml.load(v),
		            object: v => yaml.load(v),
		            net: v => v,
		            anchor: v => yaml.load(v)
		        };
		        a.in(type, `${name}.params.${param_name}.type`, Object.keys(converters));
		        if (a.type(value)() == 'string') {
		            value = u.template(value, point.meta);
		            value = converters[type](value);
		        }

		        // type-specific postprocessing
		        if (['string', 'number', 'boolean', 'array', 'object'].includes(type)) {
		            parsed_params[param_name] = value;
		        } else if (type == 'net') {
		            const net = a.sane(value, `${name}.params.${param_name}`, 'string')(units);
		            const index = net_indexer(net);
		            parsed_params[param_name] = net_obj(net, index);
		        } else { // anchor
		            let parsed_anchor = anchor(value, `${name}.params.${param_name}`, points, point)(units);
		            parsed_anchor.y = -parsed_anchor.y; // kicad mirror, as per usual
		            parsed_params[param_name] = parsed_anchor;
		        }
		    }

		    // reference
		    const component_ref = parsed_params.ref = component_indexer(parsed_params.designator || '_');
		    parsed_params.ref_hide = extra.references ? '' : 'hide';

		    // footprint positioning
		    parsed_params.point = point;
		    parsed_params.x = point.x;
		    parsed_params.y = -point.y;
		    parsed_params.r = point.r;
		    parsed_params.rot = point.r; // to be deprecated
		    parsed_params.xy = `${point.x} ${-point.y}`;
		    parsed_params.at = `(at ${point.x} ${-point.y} ${point.r})`;

		    const internal_xyfunc = (x, y, resist) => {
		        const sign = resist ? 1 : (point.meta.mirrored ? -1 : 1);
		        return xy_obj(sign * x, y)
		    };
		    parsed_params.isxy = (x, y) => internal_xyfunc(x, y, false);
		    parsed_params.iaxy = (x, y) => internal_xyfunc(x, y, true);

		    const external_xyfunc = (x, y, resist) => {
		        const new_anchor = anchor({
		            shift: [x, -y],
		            resist: resist
		        }, '_internal_footprint_xy', points, point)(units);
		        return xy_obj(new_anchor.x, -new_anchor.y)
		    };
		    parsed_params.esxy = (x, y) => external_xyfunc(x, y, false);
		    parsed_params.eaxy = (x, y) => external_xyfunc(x, y, true);

		    // allowing footprints to add dynamic nets
		    parsed_params.local_net = suffix => {
		        const net = `${component_ref}_${suffix}`;
		        const index = net_indexer(net);
		        return net_obj(net, index)
		    };

		    return fp.body(parsed_params)
		};

		pcbs.parse = (config, points, outlines, units) => {

		    const pcbs = a.sane(config.pcbs || {}, 'pcbs', 'object')();
		    const results = {};

		    for (const [pcb_name, pcb_config] of Object.entries(pcbs)) {

		        // config sanitization
		        a.unexpected(pcb_config, `pcbs.${pcb_name}`, ['outlines', 'footprints', 'references', 'template', 'params']);
		        const references = a.sane(pcb_config.references || false, `pcbs.${pcb_name}.references`, 'boolean')();
		        const template = template_types[a.in(pcb_config.template || 'kicad5', `pcbs.${pcb_name}.template`, Object.keys(template_types))];

		        // outline conversion
		        if (a.type(pcb_config.outlines)() == 'array') {
		            pcb_config.outlines = {...pcb_config.outlines};
		        }
		        const config_outlines = a.sane(pcb_config.outlines || {}, `pcbs.${pcb_name}.outlines`, 'object')();
		        const kicad_outlines = {};
		        for (const [outline_name, outline] of Object.entries(config_outlines)) {
		            const ref = a.in(outline.outline, `pcbs.${pcb_name}.outlines.${outline_name}.outline`, Object.keys(outlines));
		            const layer = a.sane(outline.layer || 'Edge.Cuts', `pcbs.${pcb_name}.outlines.${outline_name}.outline`, 'string')();
		            kicad_outlines[outline_name] = template.convert_outline(outlines[ref], layer);
		        }

		        // making a global net index registry
		        const nets = {"": 0};
		        const net_indexer = net => {
		            if (nets[net] !== undefined) return nets[net]
		            const index = Object.keys(nets).length;
		            return nets[net] = index
		        };
		        // and a component indexer
		        const component_registry = {};
		        const component_indexer = _class => {
		            if (!component_registry[_class]) {
		                component_registry[_class] = 0;
		            }
		            component_registry[_class]++;
		            return `${_class}${component_registry[_class]}`
		        };

		        const footprints = [];
		        const footprint_factory = footprint(points, net_indexer, component_indexer, units, {references});

		        // generate footprints
		        if (a.type(pcb_config.footprints)() == 'array') {
		            pcb_config.footprints = {...pcb_config.footprints};
		        }
		        const footprints_config = a.sane(pcb_config.footprints || {}, `pcbs.${pcb_name}.footprints`, 'object')();
		        for (const [f_name, f] of Object.entries(footprints_config)) {
		            const name = `pcbs.${pcb_name}.footprints.${f_name}`;
		            a.sane(f, name, 'object')();
		            const asym = a.asym(f.asym || 'source', `${name}.asym`);
		            const where = filter(f.where, `${name}.where`, points, units, asym);
		            const original_adjust = f.adjust; // need to save, so the delete's don't get rid of it below
		            const adjust = start => anchor(original_adjust || {}, `${name}.adjust`, points, start)(units);
		            delete f.asym;
		            delete f.where;
		            delete f.adjust;
		            for (const w of where) {
		                const aw = adjust(w.clone());
		                footprints.push(footprint_factory(f, name, aw));
		            }
		        }

		        // finalizing nets
		        const nets_arr = [];
		        for (const [net, index] of Object.entries(nets)) {
		            nets_arr.push(net_obj(net, index));
		        }

		        results[pcb_name] = template.body({
		            name: pcb_name,
		            version: config.meta && config.meta.version || 'v1.0.0',
		            author: config.meta && config.meta.author || 'Unknown',
		            nets: nets_arr,
		            footprints: footprints,
		            outlines: kicad_outlines,
		            custom: pcb_config.params
		        });
		    }

		    return results
		};
		return pcbs;
	}

	var ergogen$1;
	var hasRequiredErgogen;

	function requireErgogen () {
		if (hasRequiredErgogen) return ergogen$1;
		hasRequiredErgogen = 1;
		const u = requireUtils();
		const io = requireIo();
		const prepare = requirePrepare();
		const units_lib = requireUnits();
		const points_lib = requirePoints();
		const outlines_lib = requireOutlines();
		const cases_lib = requireCases();
		const pcbs_lib = requirePcbs();

		const version = require$$8.version;

		const process = async (raw, options={}, logger=()=>{}) => {

		    const prefix = 'Interpreting format: ';
		    let empty = true;
		    let [config, format] = io.interpret(raw, logger);
		    let suffix = format;
		    let { debug = false, svg = false } = options;
		    // KLE conversion warrants automaticly engaging debug mode
		    // as, usually, we're only interested in the points anyway
		    if (format == 'KLE') {
		        suffix = `${format} (Auto-debug)`;
		        debug = true;
		    }
		    logger(prefix + suffix);
		    
		    logger('Preprocessing input...');
		    config = prepare.unnest(config);
		    config = prepare.inherit(config);
		    config = prepare.parameterize(config);
		    const results = {};
		    if (debug) {
		        results.raw = raw;
		        results.canonical = u.deepcopy(config);
		    }

		    if (config.meta && config.meta.engine) {
		        logger('Checking compatibility...');
		        const engine = u.semver(config.meta.engine, 'config.meta.engine');
		        if (!u.satisfies(version, engine)) {
		            throw new Error(`Current ergogen version (${version}) doesn\'t satisfy config's engine requirement (${config.meta.engine})!`)
		        }
		    }

		    logger('Calculating variables...');
		    const units = units_lib.parse(config);
		    if (debug) {
		        results.units = units;
		    }
		    
		    logger('Parsing points...');
		    if (!config.points) {
		        throw new Error('Input does not contain a points clause!')
		    }
		    const points = points_lib.parse(config.points, units);
		    if (!Object.keys(points).length) {
		        throw new Error('Input does not contain any points!')
		    }
		    if (debug) {
		        results.points = points;
		        results.demo = io.twodee(points_lib.visualize(points, units), {debug, svg});
		    }

		    logger('Generating outlines...');
		    const outlines = outlines_lib.parse(config.outlines || {}, points, units);
		    results.outlines = {};
		    for (const [name, outline] of Object.entries(outlines)) {
		        if (!debug && name.startsWith('_')) continue
		        results.outlines[name] = io.twodee(outline, {debug, svg});
		        empty = false;
		    }

		    logger('Modeling cases...');
		    const cases = cases_lib.parse(config.cases || {}, outlines, units);
		    results.cases = {};
		    for (const [case_name, case_script] of Object.entries(cases)) {
		        if (!debug && case_name.startsWith('_')) continue
		        results.cases[case_name] = {jscad: case_script};
		        empty = false;
		    }

		    logger('Scaffolding PCBs...');
		    const pcbs = pcbs_lib.parse(config, points, outlines, units);
		    results.pcbs = {};
		    for (const [pcb_name, pcb_text] of Object.entries(pcbs)) {
		        if (!debug && pcb_name.startsWith('_')) continue
		        results.pcbs[pcb_name] = pcb_text;
		        empty = false;
		    }

		    if (!debug && empty) {
		        logger('Output would be empty, rerunning in debug mode...');
		        return process(raw, {debug: true, svg}, () => {})
		    }
		    return results
		};

		const inject = (type, name, value) => {
		    if (value === undefined) {
		        value = name;
		        name = type;
		        type = 'footprint';
		    }
		    switch (type) {
		        case 'footprint':
		            return pcbs_lib.inject_footprint(name, value)
		        case 'template':
		            return pcbs_lib.inject_template(name, value)
		        default:
		            throw new Error(`Unknown injection type "${type}" with name "${name}" and value "${value}"!`)
		    }
		};

		ergogen$1 = {
		    version,
		    process,
		    inject
		};
		return ergogen$1;
	}

	var ergogenExports = requireErgogen();
	var ergogen = /*@__PURE__*/getDefaultExportFromCjs(ergogenExports);

	return ergogen;

}));
