(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.JscadConvert = f() } })(function () {
  var define, module, exports; return (function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {
      /*
      ## License
      
      Copyright (c) 2014 bebbi (elghatta@gmail.com)
      Copyright (c) 2013 Eduard Bespalov (edwbes@gmail.com)
      Copyright (c) 2012 Joost Nieuwenhuijse (joost@newhouse.nl)
      Copyright (c) 2011 Evan Wallace (http://evanw.github.com/csg.js/)
      Copyright (c) 2012 Alexandre Girard (https://github.com/alx)
      
      All code released under MIT license
      
      ## Overview
      
      For an overview of the CSG process see the original csg.js code:
      http://evanw.github.com/csg.js/
      
      CSG operations through BSP trees suffer from one problem: heavy fragmentation
      of polygons. If two CSG solids of n polygons are unified, the resulting solid may have
      in the order of n*n polygons, because each polygon is split by the planes of all other
      polygons. After a few operations the number of polygons explodes.
      
      This version of CSG.js solves the problem in 3 ways:
      
      1. Every polygon split is recorded in a tree (CSG.PolygonTreeNode). This is a separate
      tree, not to be confused with the CSG tree. If a polygon is split into two parts but in
      the end both fragments have not been discarded by the CSG operation, we can retrieve
      the original unsplit polygon from the tree, instead of the two fragments.
      
      This does not completely solve the issue though: if a polygon is split multiple times
      the number of fragments depends on the order of subsequent splits, and we might still
      end up with unncessary splits:
      Suppose a polygon is first split into A and B, and then into A1, B1, A2, B2. Suppose B2 is
      discarded. We will end up with 2 polygons: A and B1. Depending on the actual split boundaries
      we could still have joined A and B1 into one polygon. Therefore a second approach is used as well:
      
      2. After CSG operations all coplanar polygon fragments are joined by a retesselating
      operation. See CSG.reTesselated(). Retesselation is done through a
      linear sweep over the polygon surface. The sweep line passes over the y coordinates
      of all vertices in the polygon. Polygons are split at each sweep line, and the fragments
      are joined horizontally and vertically into larger polygons (making sure that we
      will end up with convex polygons).
      This still doesn't solve the problem completely: due to floating point imprecisions
      we may end up with small gaps between polygons, and polygons may not be exactly coplanar
      anymore, and as a result the retesselation algorithm may fail to join those polygons.
      Therefore:
      
      3. A canonicalization algorithm is implemented: it looks for vertices that have
      approximately the same coordinates (with a certain tolerance, say 1e-5) and replaces
      them with the same vertex. If polygons share a vertex they will actually point to the
      same CSG.Vertex instance. The same is done for polygon planes. See CSG.canonicalized().
      
      Performance improvements to the original CSG.js:
      
      Replaced the flip() and invert() methods by flipped() and inverted() which don't
      modify the source object. This allows to get rid of all clone() calls, so that
      multiple polygons can refer to the same CSG.Plane instance etc.
      
      The original union() used an extra invert(), clipTo(), invert() sequence just to remove the
      coplanar front faces from b; this is now combined in a single b.clipTo(a, true) call.
      
      Detection whether a polygon is in front or in back of a plane: for each polygon
      we are caching the coordinates of the bounding sphere. If the bounding sphere is
      in front or in back of the plane we don't have to check the individual vertices
      anymore.
      
      Other additions to the original CSG.js:
      
      CSG.Vector class has been renamed into CSG.Vector3D
      
      Classes for 3D lines, 2D vectors, 2D lines, and methods to find the intersection of
      a line and a plane etc.
      
      Transformations: CSG.transform(), CSG.translate(), CSG.rotate(), CSG.scale()
      
      Expanding or contracting a solid: CSG.expand() and CSG.contract(). Creates nice
      smooth corners.
      
      The vertex normal has been removed since it complicates retesselation. It's not needed
      for solid CAD anyway.
      
      */

      const { addTransformationMethodsToPrototype, addCenteringToPrototype } = require('./src/mutators')
      let CSG = require('./src/CSG')
      let CAG = require('./src/CAG')

      // FIXME: how many are actual usefull to be exposed as API ?? looks like a code smell
      const { _CSGDEBUG,
        defaultResolution2D,
        defaultResolution3D,
        EPS,
        angleEPS,
        areaEPS,
        all,
        top,
        bottom,
        left,
        right,
        front,
        back,
        staticTag,
        getTag } = require('./src/constants')

      CSG._CSGDEBUG = _CSGDEBUG
      CSG.defaultResolution2D = defaultResolution2D
      CSG.defaultResolution3D = defaultResolution3D
      CSG.EPS = EPS
      CSG.angleEPS = angleEPS
      CSG.areaEPS = areaEPS
      CSG.all = all
      CSG.top = top
      CSG.bottom = bottom
      CSG.left = left
      CSG.right = right
      CSG.front = front
      CSG.back = back
      CSG.staticTag = staticTag
      CSG.getTag = getTag

      // eek ! all this is kept for backwards compatibility...for now
      CSG.Vector2D = require('./src/math/Vector2')
      CSG.Vector3D = require('./src/math/Vector3')
      CSG.Vertex = require('./src/math/Vertex3')
      CAG.Vertex = require('./src/math/Vertex2')
      CSG.Plane = require('./src/math/Plane')
      CSG.Polygon = require('./src/math/Polygon3')
      CSG.Polygon2D = require('./src/math/Polygon2')
      CSG.Line2D = require('./src/math/Line2')
      CSG.Line3D = require('./src/math/Line3')
      CSG.Path2D = require('./src/math/Path2')
      CSG.OrthoNormalBasis = require('./src/math/OrthoNormalBasis')
      CSG.Matrix4x4 = require('./src/math/Matrix4')

      CAG.Side = require('./src/math/Side')

      CSG.Connector = require('./src/connectors').Connector
      CSG.ConnectorList = require('./src/connectors').ConnectorList
      CSG.Properties = require('./src/Properties')

      const { circle, ellipse, rectangle, roundedRectangle } = require('./src/primitives2d')
      const { sphere, cube, roundedCube, cylinder, roundedCylinder, cylinderElliptic, polyhedron } = require('./src/primitives3d')

      CSG.sphere = sphere
      CSG.cube = cube
      CSG.roundedCube = roundedCube
      CSG.cylinder = cylinder
      CSG.roundedCylinder = roundedCylinder
      CSG.cylinderElliptic = cylinderElliptic
      CSG.polyhedron = polyhedron

      CAG.circle = circle
      CAG.ellipse = ellipse
      CAG.rectangle = rectangle
      CAG.roundedRectangle = roundedRectangle

      //
      const { fromCompactBinary, fromObject, fromSlices } = require('./src/CSGFactories')
      CSG.fromCompactBinary = fromCompactBinary
      CSG.fromObject = fromObject
      CSG.fromSlices = fromSlices

      CSG.toPointCloud = require('./src/debugHelpers').toPointCloud

      const CAGMakers = require('./src/CAGFactories')
      CAG.fromObject = CAGMakers.fromObject
      CAG.fromPointsNoCheck = CAGMakers.fromPointsNoCheck
      CAG.fromPath2 = CAGMakers.fromPath2

      // ////////////////////////////////////
      addTransformationMethodsToPrototype(CSG.prototype)
      addTransformationMethodsToPrototype(CSG.Vector2D.prototype)
      addTransformationMethodsToPrototype(CSG.Vector3D.prototype)
      addTransformationMethodsToPrototype(CSG.Vertex.prototype)
      addTransformationMethodsToPrototype(CSG.Plane.prototype)
      addTransformationMethodsToPrototype(CSG.Polygon.prototype)
      addTransformationMethodsToPrototype(CSG.Line2D.prototype)
      addTransformationMethodsToPrototype(CSG.Line3D.prototype)
      addTransformationMethodsToPrototype(CSG.Path2D.prototype)
      addTransformationMethodsToPrototype(CSG.OrthoNormalBasis.prototype)
      addTransformationMethodsToPrototype(CSG.Connector.prototype)

      addTransformationMethodsToPrototype(CAG.prototype)
      addTransformationMethodsToPrototype(CAG.Side.prototype)
      addTransformationMethodsToPrototype(CAG.Vertex.prototype)

      addCenteringToPrototype(CSG.prototype, ['x', 'y', 'z'])
      addCenteringToPrototype(CAG.prototype, ['x', 'y'])

      module.exports = { CSG, CAG }

    }, { "./src/CAG": 2, "./src/CAGFactories": 3, "./src/CSG": 4, "./src/CSGFactories": 5, "./src/Properties": 9, "./src/connectors": 10, "./src/constants": 11, "./src/debugHelpers": 12, "./src/math/Line2": 13, "./src/math/Line3": 14, "./src/math/Matrix4": 15, "./src/math/OrthoNormalBasis": 16, "./src/math/Path2": 17, "./src/math/Plane": 18, "./src/math/Polygon2": 19, "./src/math/Polygon3": 20, "./src/math/Side": 21, "./src/math/Vector2": 22, "./src/math/Vector3": 23, "./src/math/Vertex2": 24, "./src/math/Vertex3": 25, "./src/mutators": 28, "./src/primitives2d": 30, "./src/primitives3d": 31 }], 2: [function (require, module, exports) {
      const { EPS, angleEPS, areaEPS, defaultResolution3D } = require('./constants')
      const { Connector } = require('./connectors')
      const OrthoNormalBasis = require('./math/OrthoNormalBasis')
      const Vertex2D = require('./math/Vertex2')
      const Vertex3D = require('./math/Vertex3')
      const Vector2D = require('./math/Vector2')
      const Vector3D = require('./math/Vector3')
      const Polygon = require('./math/Polygon3')
      const Path2D = require('./math/Path2')
      const Side = require('./math/Side')
      const { linesIntersect } = require('./math/lineUtils')
      const { parseOptionAs3DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt } = require('./optionParsers')
      const FuzzyCAGFactory = require('./FuzzyFactory2d')
      /**
       * Class CAG
       * Holds a solid area geometry like CSG but 2D.
       * Each area consists of a number of sides.
       * Each side is a line between 2 points.
       * @constructor
       */
      let CAG = function () {
        this.sides = []
        this.isCanonicalized = false
      }

      /** Construct a CAG from a list of `Side` instances.
       * @param {Side[]} sides - list of sides
       * @returns {CAG} new CAG object
       */
      CAG.fromSides = function (sides) {
        let cag = new CAG()
        cag.sides = sides
        return cag
      }


      // Converts a CSG to a  The CSG must consist of polygons with only z coordinates +1 and -1
      // as constructed by _toCSGWall(-1, 1). This is so we can use the 3D union(), intersect() etc
      CAG.fromFakeCSG = function (csg) {
        let sides = csg.polygons.map(function (p) {
          return Side._fromFakePolygon(p)
        })
          .filter(function (s) {
            return s !== null
          })
        return CAG.fromSides(sides)
      }

      /** Construct a CAG from a list of points (a polygon).
       * The rotation direction of the points is not relevant.
       * The points can define a convex or a concave polygon.
       * The polygon must not self intersect.
       * @param {points[]} points - list of points in 2D space
       * @returns {CAG} new CAG object
       */
      CAG.fromPoints = function (points) {
        let numpoints = points.length
        if (numpoints < 3) throw new Error('CAG shape needs at least 3 points')
        let sides = []
        let prevpoint = new Vector2D(points[numpoints - 1])
        let prevvertex = new Vertex2D(prevpoint)
        points.map(function (p) {
          let point = new Vector2D(p)
          let vertex = new Vertex2D(point)
          let side = new Side(prevvertex, vertex)
          sides.push(side)
          prevvertex = vertex
        })
        let result = CAG.fromSides(sides)
        if (result.isSelfIntersecting()) {
          throw new Error('Polygon is self intersecting!')
        }
        let area = result.area()
        if (Math.abs(area) < areaEPS) {
          throw new Error('Degenerate polygon!')
        }
        if (area < 0) {
          result = result.flipped()
        }
        result = result.canonicalized()
        return result
      }

      const CAGFromCAGFuzzyFactory = function (factory, sourcecag) {
        let _this = factory
        let newsides = sourcecag.sides.map(function (side) {
          return _this.getSide(side)
        })
          // remove bad sides (mostly a user input issue)
          .filter(function (side) {
            return side.length() > EPS
          })
        return CAG.fromSides(newsides)
      }

      CAG.prototype = {
        toString: function () {
          let result = 'CAG (' + this.sides.length + ' sides):\n'
          this.sides.map(function (side) {
            result += '  ' + side.toString() + '\n'
          })
          return result
        },

        _toCSGWall: function (z0, z1) {
          const CSG = require('./CSG') // FIXME: circular dependencies CAG=>CSG=>CAG
          let polygons = this.sides.map(function (side) {
            return side.toPolygon3D(z0, z1)
          })
          return CSG.fromPolygons(polygons)
        },

        _toVector3DPairs: function (m) {
          // transform m
          let pairs = this.sides.map(function (side) {
            let p0 = side.vertex0.pos
            let p1 = side.vertex1.pos
            return [Vector3D.Create(p0.x, p0.y, 0),
            Vector3D.Create(p1.x, p1.y, 0)]
          })
          if (typeof m !== 'undefined') {
            pairs = pairs.map(function (pair) {
              return pair.map(function (v) {
                return v.transform(m)
              })
            })
          }
          return pairs
        },

        /*
         * transform a cag into the polygons of a corresponding 3d plane, positioned per options
         * Accepts a connector for plane positioning, or optionally
         * single translation, axisVector, normalVector arguments
         * (toConnector has precedence over single arguments if provided)
         */
        _toPlanePolygons: function (options) {
          const CSG = require('./CSG') // FIXME: circular dependencies CAG=>CSG=>CAG
          let flipped = options.flipped || false
          // reference connector for transformation
          let origin = [0, 0, 0]
          let defaultAxis = [0, 0, 1]
          let defaultNormal = [0, 1, 0]
          let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
          // translated connector per options
          let translation = options.translation || origin
          let axisVector = options.axisVector || defaultAxis
          let normalVector = options.normalVector || defaultNormal
          // will override above if options has toConnector
          let toConnector = options.toConnector ||
            new Connector(translation, axisVector, normalVector)
          // resulting transform
          let m = thisConnector.getTransformationTo(toConnector, false, 0)
          // create plane as a (partial non-closed) CSG in XY plane
          let bounds = this.getBounds()
          bounds[0] = bounds[0].minus(new Vector2D(1, 1))
          bounds[1] = bounds[1].plus(new Vector2D(1, 1))
          let csgshell = this._toCSGWall(-1, 1)
          let csgplane = CSG.fromPolygons([new Polygon([
            new Vertex3D(new Vector3D(bounds[0].x, bounds[0].y, 0)),
            new Vertex3D(new Vector3D(bounds[1].x, bounds[0].y, 0)),
            new Vertex3D(new Vector3D(bounds[1].x, bounds[1].y, 0)),
            new Vertex3D(new Vector3D(bounds[0].x, bounds[1].y, 0))
          ])])
          if (flipped) {
            csgplane = csgplane.invert()
          }
          // intersectSub -> prevent premature retesselate/canonicalize
          csgplane = csgplane.intersectSub(csgshell)
          // only keep the polygons in the z plane:
          let polys = csgplane.polygons.filter(function (polygon) {
            return Math.abs(polygon.plane.normal.z) > 0.99
          })
          // finally, position the plane per passed transformations
          return polys.map(function (poly) {
            return poly.transform(m)
          })
        },

        /*
         * given 2 connectors, this returns all polygons of a "wall" between 2
         * copies of this cag, positioned in 3d space as "bottom" and
         * "top" plane per connectors toConnector1, and toConnector2, respectively
         */
        _toWallPolygons: function (options) {
          // normals are going to be correct as long as toConn2.point - toConn1.point
          // points into cag normal direction (check in caller)
          // arguments: options.toConnector1, options.toConnector2, options.cag
          //     walls go from toConnector1 to toConnector2
          //     optionally, target cag to point to - cag needs to have same number of sides as this!
          let origin = [0, 0, 0]
          let defaultAxis = [0, 0, 1]
          let defaultNormal = [0, 1, 0]
          let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
          // arguments:
          let toConnector1 = options.toConnector1
          // let toConnector2 = new Connector([0, 0, -30], defaultAxis, defaultNormal);
          let toConnector2 = options.toConnector2
          if (!(toConnector1 instanceof Connector && toConnector2 instanceof Connector)) {
            throw new Error('could not parse Connector arguments toConnector1 or toConnector2')
          }
          if (options.cag) {
            if (options.cag.sides.length !== this.sides.length) {
              throw new Error('target cag needs same sides count as start cag')
            }
          }
          // target cag is same as this unless specified
          let toCag = options.cag || this
          let m1 = thisConnector.getTransformationTo(toConnector1, false, 0)
          let m2 = thisConnector.getTransformationTo(toConnector2, false, 0)
          let vps1 = this._toVector3DPairs(m1)
          let vps2 = toCag._toVector3DPairs(m2)

          let polygons = []
          vps1.forEach(function (vp1, i) {
            polygons.push(new Polygon([
              new Vertex3D(vps2[i][1]), new Vertex3D(vps2[i][0]), new Vertex3D(vp1[0])]))
            polygons.push(new Polygon([
              new Vertex3D(vps2[i][1]), new Vertex3D(vp1[0]), new Vertex3D(vp1[1])]))
          })
          return polygons
        },

        /**
         * Convert to a list of points.
         * @return {points[]} list of points in 2D space
         */
        toPoints: function () {
          let points = this.sides.map(function (side) {
            let v0 = side.vertex0
            // let v1 = side.vertex1
            return v0.pos
          })
          // due to the logic of CAG.fromPoints()
          // move the first point to the last
          if (points.length > 0) {
            points.push(points.shift())
          }
          return points
        },

        union: function (cag) {
          let cags
          if (cag instanceof Array) {
            cags = cag
          } else {
            cags = [cag]
          }
          let r = this._toCSGWall(-1, 1)
          r = r.union(
            cags.map(function (cag) {
              return cag._toCSGWall(-1, 1).reTesselated()
            }), false, false)
          return CAG.fromFakeCSG(r).canonicalized()
        },

        subtract: function (cag) {
          let cags
          if (cag instanceof Array) {
            cags = cag
          } else {
            cags = [cag]
          }
          let r = this._toCSGWall(-1, 1)
          cags.map(function (cag) {
            r = r.subtractSub(cag._toCSGWall(-1, 1), false, false)
          })
          r = r.reTesselated()
          r = r.canonicalized()
          r = CAG.fromFakeCSG(r)
          r = r.canonicalized()
          return r
        },

        intersect: function (cag) {
          let cags
          if (cag instanceof Array) {
            cags = cag
          } else {
            cags = [cag]
          }
          let r = this._toCSGWall(-1, 1)
          cags.map(function (cag) {
            r = r.intersectSub(cag._toCSGWall(-1, 1), false, false)
          })
          r = r.reTesselated()
          r = r.canonicalized()
          r = CAG.fromFakeCSG(r)
          r = r.canonicalized()
          return r
        },

        transform: function (matrix4x4) {
          let ismirror = matrix4x4.isMirroring()
          let newsides = this.sides.map(function (side) {
            return side.transform(matrix4x4)
          })
          let result = CAG.fromSides(newsides)
          if (ismirror) {
            result = result.flipped()
          }
          return result
        },

        // see http://local.wasp.uwa.edu.au/~pbourke/geometry/polyarea/ :
        // Area of the polygon. For a counter clockwise rotating polygon the area is positive, otherwise negative
        // Note(bebbi): this looks wrong. See polygon getArea()
        area: function () {
          let polygonArea = 0
          this.sides.map(function (side) {
            polygonArea += side.vertex0.pos.cross(side.vertex1.pos)
          })
          polygonArea *= 0.5
          return polygonArea
        },

        flipped: function () {
          let newsides = this.sides.map(function (side) {
            return side.flipped()
          })
          newsides.reverse()
          return CAG.fromSides(newsides)
        },

        getBounds: function () {
          let minpoint
          if (this.sides.length === 0) {
            minpoint = new Vector2D(0, 0)
          } else {
            minpoint = this.sides[0].vertex0.pos
          }
          let maxpoint = minpoint
          this.sides.map(function (side) {
            minpoint = minpoint.min(side.vertex0.pos)
            minpoint = minpoint.min(side.vertex1.pos)
            maxpoint = maxpoint.max(side.vertex0.pos)
            maxpoint = maxpoint.max(side.vertex1.pos)
          })
          return [minpoint, maxpoint]
        },

        isSelfIntersecting: function (debug) {
          let numsides = this.sides.length
          for (let i = 0; i < numsides; i++) {
            let side0 = this.sides[i]
            for (let ii = i + 1; ii < numsides; ii++) {
              let side1 = this.sides[ii]
              if (linesIntersect(side0.vertex0.pos, side0.vertex1.pos, side1.vertex0.pos, side1.vertex1.pos)) {
                if (debug) { console.log('side ' + i + ': ' + side0); console.log('side ' + ii + ': ' + side1) }
                return true
              }
            }
          }
          return false
        },

        expandedShell: function (radius, resolution) {
          resolution = resolution || 8
          if (resolution < 4) resolution = 4
          let cags = []
          let pointmap = {}
          let cag = this.canonicalized()
          cag.sides.map(function (side) {
            let d = side.vertex1.pos.minus(side.vertex0.pos)
            let dl = d.length()
            if (dl > EPS) {
              d = d.times(1.0 / dl)
              let normal = d.normal().times(radius)
              let shellpoints = [
                side.vertex1.pos.plus(normal),
                side.vertex1.pos.minus(normal),
                side.vertex0.pos.minus(normal),
                side.vertex0.pos.plus(normal)
              ]
              //      let newcag = CAG.fromPointsNoCheck(shellpoints);
              let newcag = CAG.fromPoints(shellpoints)
              cags.push(newcag)
              for (let step = 0; step < 2; step++) {
                let p1 = (step === 0) ? side.vertex0.pos : side.vertex1.pos
                let p2 = (step === 0) ? side.vertex1.pos : side.vertex0.pos
                let tag = p1.x + ' ' + p1.y
                if (!(tag in pointmap)) {
                  pointmap[tag] = []
                }
                pointmap[tag].push({
                  'p1': p1,
                  'p2': p2
                })
              }
            }
          })
          for (let tag in pointmap) {
            let m = pointmap[tag]
            let angle1, angle2
            let pcenter = m[0].p1
            if (m.length === 2) {
              let end1 = m[0].p2
              let end2 = m[1].p2
              angle1 = end1.minus(pcenter).angleDegrees()
              angle2 = end2.minus(pcenter).angleDegrees()
              if (angle2 < angle1) angle2 += 360
              if (angle2 >= (angle1 + 360)) angle2 -= 360
              if (angle2 < angle1 + 180) {
                let t = angle2
                angle2 = angle1 + 360
                angle1 = t
              }
              angle1 += 90
              angle2 -= 90
            } else {
              angle1 = 0
              angle2 = 360
            }
            let fullcircle = (angle2 > angle1 + 359.999)
            if (fullcircle) {
              angle1 = 0
              angle2 = 360
            }
            if (angle2 > (angle1 + angleEPS)) {
              let points = []
              if (!fullcircle) {
                points.push(pcenter)
              }
              let numsteps = Math.round(resolution * (angle2 - angle1) / 360)
              if (numsteps < 1) numsteps = 1
              for (let step = 0; step <= numsteps; step++) {
                let angle = angle1 + step / numsteps * (angle2 - angle1)
                if (step === numsteps) angle = angle2 // prevent rounding errors
                let point = pcenter.plus(Vector2D.fromAngleDegrees(angle).times(radius))
                if ((!fullcircle) || (step > 0)) {
                  points.push(point)
                }
              }
              let newcag = CAG.fromPointsNoCheck(points)
              cags.push(newcag)
            }
          }
          let result = new CAG()
          result = result.union(cags)
          return result
        },

        expand: function (radius, resolution) {
          let result = this.union(this.expandedShell(radius, resolution))
          return result
        },

        contract: function (radius, resolution) {
          let result = this.subtract(this.expandedShell(radius, resolution))
          return result
        },

        // extrude the CAG in a certain plane.
        // Giving just a plane is not enough, multiple different extrusions in the same plane would be possible
        // by rotating around the plane's origin. An additional right-hand vector should be specified as well,
        // and this is exactly a OrthoNormalBasis.
        //
        // orthonormalbasis: characterizes the plane in which to extrude
        // depth: thickness of the extruded shape. Extrusion is done upwards from the plane
        //        (unless symmetrical option is set, see below)
        // options:
        //   {symmetrical: true}  // extrude symmetrically in two directions about the plane
        extrudeInOrthonormalBasis: function (orthonormalbasis, depth, options) {
          // first extrude in the regular Z plane:
          if (!(orthonormalbasis instanceof OrthoNormalBasis)) {
            throw new Error('extrudeInPlane: the first parameter should be a OrthoNormalBasis')
          }
          let extruded = this.extrude({
            offset: [0, 0, depth]
          })
          if (parseOptionAsBool(options, 'symmetrical', false)) {
            extruded = extruded.translate([0, 0, -depth / 2])
          }
          let matrix = orthonormalbasis.getInverseProjectionMatrix()
          extruded = extruded.transform(matrix)
          return extruded
        },

        // Extrude in a standard cartesian plane, specified by two axis identifiers. Each identifier can be
        // one of ["X","Y","Z","-X","-Y","-Z"]
        // The 2d x axis will map to the first given 3D axis, the 2d y axis will map to the second.
        // See OrthoNormalBasis.GetCartesian for details.
        // options:
        //   {symmetrical: true}  // extrude symmetrically in two directions about the plane
        extrudeInPlane: function (axis1, axis2, depth, options) {
          return this.extrudeInOrthonormalBasis(OrthoNormalBasis.GetCartesian(axis1, axis2), depth, options)
        },

        // extruded=cag.extrude({offset: [0,0,10], twistangle: 360, twiststeps: 100});
        // linear extrusion of 2D shape, with optional twist
        // The 2d shape is placed in in z=0 plane and extruded into direction <offset> (a Vector3D)
        // The final face is rotated <twistangle> degrees. Rotation is done around the origin of the 2d shape (i.e. x=0, y=0)
        // twiststeps determines the resolution of the twist (should be >= 1)
        // returns a CSG object
        extrude: function (options) {
          const CSG = require('./CSG') // FIXME: circular dependencies CAG=>CSG=>CAG
          if (this.sides.length === 0) {
            // empty!
            return new CSG()
          }
          let offsetVector = parseOptionAs3DVector(options, 'offset', [0, 0, 1])
          let twistangle = parseOptionAsFloat(options, 'twistangle', 0)
          let twiststeps = parseOptionAsInt(options, 'twiststeps', defaultResolution3D)
          if (offsetVector.z === 0) {
            throw new Error('offset cannot be orthogonal to Z axis')
          }
          if (twistangle === 0 || twiststeps < 1) {
            twiststeps = 1
          }
          let normalVector = Vector3D.Create(0, 1, 0)

          let polygons = []
          // bottom and top
          polygons = polygons.concat(this._toPlanePolygons({
            translation: [0, 0, 0],
            normalVector: normalVector,
            flipped: !(offsetVector.z < 0)
          }
          ))
          polygons = polygons.concat(this._toPlanePolygons({
            translation: offsetVector,
            normalVector: normalVector.rotateZ(twistangle),
            flipped: offsetVector.z < 0
          }))
          // walls
          for (let i = 0; i < twiststeps; i++) {
            let c1 = new Connector(offsetVector.times(i / twiststeps), [0, 0, offsetVector.z],
              normalVector.rotateZ(i * twistangle / twiststeps))
            let c2 = new Connector(offsetVector.times((i + 1) / twiststeps), [0, 0, offsetVector.z],
              normalVector.rotateZ((i + 1) * twistangle / twiststeps))
            polygons = polygons.concat(this._toWallPolygons({ toConnector1: c1, toConnector2: c2 }))
          }

          return CSG.fromPolygons(polygons)
        },

        /** Extrude to into a 3D solid by rotating the origin around the Y axis.
         * (and turning everything into XY plane)
         * @param {Object} options - options for construction
         * @param {Number} [options.angle=360] - angle of rotation
         * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
         * @returns {CSG} new 3D solid
         */
        rotateExtrude: function (options) { // FIXME options should be optional
          const CSG = require('./CSG') // FIXME: circular dependencies CAG=>CSG=>CAG
          let alpha = parseOptionAsFloat(options, 'angle', 360)
          let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)

          alpha = alpha > 360 ? alpha % 360 : alpha
          let origin = [0, 0, 0]
          let axisV = Vector3D.Create(0, 1, 0)
          let normalV = [0, 0, 1]
          let polygons = []
          // planes only needed if alpha > 0
          let connS = new Connector(origin, axisV, normalV)
          if (alpha > 0 && alpha < 360) {
            // we need to rotate negative to satisfy wall function condition of
            // building in the direction of axis vector
            let connE = new Connector(origin, axisV.rotateZ(-alpha), normalV)
            polygons = polygons.concat(
              this._toPlanePolygons({ toConnector: connS, flipped: true }))
            polygons = polygons.concat(
              this._toPlanePolygons({ toConnector: connE }))
          }
          let connT1 = connS
          let connT2
          let step = alpha / resolution
          for (let a = step; a <= alpha + EPS; a += step) { // FIXME Should this be angelEPS?
            connT2 = new Connector(origin, axisV.rotateZ(-a), normalV)
            polygons = polygons.concat(this._toWallPolygons(
              { toConnector1: connT1, toConnector2: connT2 }))
            connT1 = connT2
          }
          return CSG.fromPolygons(polygons).reTesselated()
        },

        // check if we are a valid CAG (for debugging)
        // NOTE(bebbi) uneven side count doesn't work because rounding with EPS isn't taken into account
        check: function () {
          let errors = []
          if (this.isSelfIntersecting(true)) {
            errors.push('Self intersects')
          }
          let pointcount = {}
          this.sides.map(function (side) {
            function mappoint(p) {
              let tag = p.x + ' ' + p.y
              if (!(tag in pointcount)) pointcount[tag] = 0
              pointcount[tag]++
            }
            mappoint(side.vertex0.pos)
            mappoint(side.vertex1.pos)
          })
          for (let tag in pointcount) {
            let count = pointcount[tag]
            if (count & 1) {
              errors.push('Uneven number of sides (' + count + ') for point ' + tag)
            }
          }
          let area = this.area()
          if (area < areaEPS) {
            errors.push('Area is ' + area)
          }
          if (errors.length > 0) {
            let ertxt = ''
            errors.map(function (err) {
              ertxt += err + '\n'
            })
            throw new Error(ertxt)
          }
        },

        canonicalized: function () {
          if (this.isCanonicalized) {
            return this
          } else {
            let factory = new FuzzyCAGFactory()
            let result = CAGFromCAGFuzzyFactory(factory, this)
            result.isCanonicalized = true
            return result
          }
        },

        /** Convert to compact binary form.
         * See CAG.fromCompactBinary.
         * @return {CompactBinary}
         */
        toCompactBinary: function () {
          let cag = this.canonicalized()
          let numsides = cag.sides.length
          let vertexmap = {}
          let vertices = []
          let numvertices = 0
          let sideVertexIndices = new Uint32Array(2 * numsides)
          let sidevertexindicesindex = 0
          cag.sides.map(function (side) {
            [side.vertex0, side.vertex1].map(function (v) {
              let vertextag = v.getTag()
              let vertexindex
              if (!(vertextag in vertexmap)) {
                vertexindex = numvertices++
                vertexmap[vertextag] = vertexindex
                vertices.push(v)
              } else {
                vertexindex = vertexmap[vertextag]
              }
              sideVertexIndices[sidevertexindicesindex++] = vertexindex
            })
          })
          let vertexData = new Float64Array(numvertices * 2)
          let verticesArrayIndex = 0
          vertices.map(function (v) {
            let pos = v.pos
            vertexData[verticesArrayIndex++] = pos._x
            vertexData[verticesArrayIndex++] = pos._y
          })
          let result = {
            'class': 'CAG',
            sideVertexIndices: sideVertexIndices,
            vertexData: vertexData
          }
          return result
        },

        getOutlinePaths: function () {
          let cag = this.canonicalized()
          let sideTagToSideMap = {}
          let startVertexTagToSideTagMap = {}
          cag.sides.map(function (side) {
            let sidetag = side.getTag()
            sideTagToSideMap[sidetag] = side
            let startvertextag = side.vertex0.getTag()
            if (!(startvertextag in startVertexTagToSideTagMap)) {
              startVertexTagToSideTagMap[startvertextag] = []
            }
            startVertexTagToSideTagMap[startvertextag].push(sidetag)
          })
          let paths = []
          while (true) {
            let startsidetag = null
            for (let aVertexTag in startVertexTagToSideTagMap) {
              let sidesForThisVertex = startVertexTagToSideTagMap[aVertexTag]
              startsidetag = sidesForThisVertex[0]
              sidesForThisVertex.splice(0, 1)
              if (sidesForThisVertex.length === 0) {
                delete startVertexTagToSideTagMap[aVertexTag]
              }
              break
            }
            if (startsidetag === null) break // we've had all sides
            let connectedVertexPoints = []
            let sidetag = startsidetag
            let thisside = sideTagToSideMap[sidetag]
            let startvertextag = thisside.vertex0.getTag()
            while (true) {
              connectedVertexPoints.push(thisside.vertex0.pos)
              let nextvertextag = thisside.vertex1.getTag()
              if (nextvertextag === startvertextag) break // we've closed the polygon
              if (!(nextvertextag in startVertexTagToSideTagMap)) {
                throw new Error('Area is not closed!')
              }
              let nextpossiblesidetags = startVertexTagToSideTagMap[nextvertextag]
              let nextsideindex = -1
              if (nextpossiblesidetags.length === 1) {
                nextsideindex = 0
              } else {
                // more than one side starting at the same vertex. This means we have
                // two shapes touching at the same corner
                let bestangle = null
                let thisangle = thisside.direction().angleDegrees()
                for (let sideindex = 0; sideindex < nextpossiblesidetags.length; sideindex++) {
                  let nextpossiblesidetag = nextpossiblesidetags[sideindex]
                  let possibleside = sideTagToSideMap[nextpossiblesidetag]
                  let angle = possibleside.direction().angleDegrees()
                  let angledif = angle - thisangle
                  if (angledif < -180) angledif += 360
                  if (angledif >= 180) angledif -= 360
                  if ((nextsideindex < 0) || (angledif > bestangle)) {
                    nextsideindex = sideindex
                    bestangle = angledif
                  }
                }
              }
              let nextsidetag = nextpossiblesidetags[nextsideindex]
              nextpossiblesidetags.splice(nextsideindex, 1)
              if (nextpossiblesidetags.length === 0) {
                delete startVertexTagToSideTagMap[nextvertextag]
              }
              thisside = sideTagToSideMap[nextsidetag]
            } // inner loop
            // due to the logic of CAG.fromPoints()
            // move the first point to the last
            if (connectedVertexPoints.length > 0) {
              connectedVertexPoints.push(connectedVertexPoints.shift())
            }
            let path = new Path2D(connectedVertexPoints, true)
            paths.push(path)
          } // outer loop
          return paths
        },

        /*
        cag = cag.overCutInsideCorners(cutterradius);
    
        Using a CNC router it's impossible to cut out a true sharp inside corner. The inside corner
        will be rounded due to the radius of the cutter. This function compensates for this by creating
        an extra cutout at each inner corner so that the actual cut out shape will be at least as large
        as needed.
        */
        overCutInsideCorners: function (cutterradius) {
          let cag = this.canonicalized()
          // for each vertex determine the 'incoming' side and 'outgoing' side:
          let pointmap = {} // tag => {pos: coord, from: [], to: []}
          cag.sides.map(function (side) {
            if (!(side.vertex0.getTag() in pointmap)) {
              pointmap[side.vertex0.getTag()] = {
                pos: side.vertex0.pos,
                from: [],
                to: []
              }
            }
            pointmap[side.vertex0.getTag()].to.push(side.vertex1.pos)
            if (!(side.vertex1.getTag() in pointmap)) {
              pointmap[side.vertex1.getTag()] = {
                pos: side.vertex1.pos,
                from: [],
                to: []
              }
            }
            pointmap[side.vertex1.getTag()].from.push(side.vertex0.pos)
          })
          // overcut all sharp corners:
          let cutouts = []
          for (let pointtag in pointmap) {
            let pointobj = pointmap[pointtag]
            if ((pointobj.from.length === 1) && (pointobj.to.length === 1)) {
              // ok, 1 incoming side and 1 outgoing side:
              let fromcoord = pointobj.from[0]
              let pointcoord = pointobj.pos
              let tocoord = pointobj.to[0]
              let v1 = pointcoord.minus(fromcoord).unit()
              let v2 = tocoord.minus(pointcoord).unit()
              let crossproduct = v1.cross(v2)
              let isInnerCorner = (crossproduct < 0.001)
              if (isInnerCorner) {
                // yes it's a sharp corner:
                let alpha = v2.angleRadians() - v1.angleRadians() + Math.PI
                if (alpha < 0) {
                  alpha += 2 * Math.PI
                } else if (alpha >= 2 * Math.PI) {
                  alpha -= 2 * Math.PI
                }
                let midvector = v2.minus(v1).unit()
                let circlesegmentangle = 30 / 180 * Math.PI // resolution of the circle: segments of 30 degrees
                // we need to increase the radius slightly so that our imperfect circle will contain a perfect circle of cutterradius
                let radiuscorrected = cutterradius / Math.cos(circlesegmentangle / 2)
                let circlecenter = pointcoord.plus(midvector.times(radiuscorrected))
                // we don't need to create a full circle; a pie is enough. Find the angles for the pie:
                let startangle = alpha + midvector.angleRadians()
                let deltaangle = 2 * (Math.PI - alpha)
                let numsteps = 2 * Math.ceil(deltaangle / circlesegmentangle / 2) // should be even
                // build the pie:
                let points = [circlecenter]
                for (let i = 0; i <= numsteps; i++) {
                  let angle = startangle + i / numsteps * deltaangle
                  let p = Vector2D.fromAngleRadians(angle).times(radiuscorrected).plus(circlecenter)
                  points.push(p)
                }
                cutouts.push(CAG.fromPoints(points))
              }
            }
          }
          let result = cag.subtract(cutouts)
          return result
        }
      }

      module.exports = CAG

    }, { "./CSG": 4, "./FuzzyFactory2d": 7, "./connectors": 10, "./constants": 11, "./math/OrthoNormalBasis": 16, "./math/Path2": 17, "./math/Polygon3": 20, "./math/Side": 21, "./math/Vector2": 22, "./math/Vector3": 23, "./math/Vertex2": 24, "./math/Vertex3": 25, "./math/lineUtils": 26, "./optionParsers": 29 }], 3: [function (require, module, exports) {
      const CAG = require('./CAG')
      const Side = require('./math/Side')
      const Vector2D = require('./math/Vector2')
      const Vertex = require('./math/Vertex2')
      const Path2 = require('./math/Path2')

      /** Reconstruct a CAG from an object with identical property names.
       * @param {Object} obj - anonymous object, typically from JSON
       * @returns {CAG} new CAG object
       */
      const fromObject = function (obj) {
        let sides = obj.sides.map(function (s) {
          return Side.fromObject(s)
        })
        let cag = CAG.fromSides(sides)
        cag.isCanonicalized = obj.isCanonicalized
        return cag
      }

      /** Construct a CAG from a list of points (a polygon).
       * Like fromPoints() but does not check if the result is a valid polygon.
       * The points MUST rotate counter clockwise.
       * The points can define a convex or a concave polygon.
       * The polygon must not self intersect.
       * @param {points[]} points - list of points in 2D space
       * @returns {CAG} new CAG object
       */
      const fromPointsNoCheck = function (points) {
        let sides = []
        let prevpoint = new Vector2D(points[points.length - 1])
        let prevvertex = new Vertex(prevpoint)
        points.map(function (p) {
          let point = new Vector2D(p)
          let vertex = new Vertex(point)
          let side = new Side(prevvertex, vertex)
          sides.push(side)
          prevvertex = vertex
        })
        return CAG.fromSides(sides)
      }

      /** Construct a CAG from a 2d-path (a closed sequence of points).
       * Like fromPoints() but does not check if the result is a valid polygon.
       * @param {path} Path2 - a Path2 path
       * @returns {CAG} new CAG object
       */
      const fromPath2 = function (path) {
        if (!path.isClosed()) throw new Error('The path should be closed!')
        return CAG.fromPoints(path.getPoints())
      }


      module.exports = {
        fromObject,
        fromPointsNoCheck,
        fromPath2
        //fromFakeCSG
      }

    }, { "./CAG": 2, "./math/Path2": 17, "./math/Side": 21, "./math/Vector2": 22, "./math/Vertex2": 24 }], 4: [function (require, module, exports) {
      const { fnNumberSort } = require('./utils')
      const FuzzyCSGFactory = require('./FuzzyFactory3d')
      const Tree = require('./trees')
      const { EPS } = require('./constants')
      const { reTesselateCoplanarPolygons } = require('./math/polygonUtils')
      const Polygon = require('./math/Polygon3')
      const Plane = require('./math/Plane')
      const Vertex = require('./math/Vertex3')
      const Vector2D = require('./math/Vector2')
      const Vector3D = require('./math/Vector3')
      const Matrix4x4 = require('./math/Matrix4')
      const OrthoNormalBasis = require('./math/OrthoNormalBasis')

      const CAG = require('./CAG') // FIXME: circular dependency !

      const Properties = require('./Properties')
      const { Connector } = require('./connectors')
      const fixTJunctions = require('./utils/fixTJunctions')
      // let {fromPolygons} = require('./CSGMakers') // FIXME: circular dependency !

      /** Class CSG
       * Holds a binary space partition tree representing a 3D solid. Two solids can
       * be combined using the `union()`, `subtract()`, and `intersect()` methods.
       * @constructor
       */
      let CSG = function () {
        this.polygons = []
        this.properties = new Properties()
        this.isCanonicalized = true
        this.isRetesselated = true
      }

      CSG.prototype = {
        /** @return {Polygon[]} The list of polygons. */
        toPolygons: function () {
          return this.polygons
        },

        /**
         * Return a new CSG solid representing the space in either this solid or
         * in the given solids. Neither this solid nor the given solids are modified.
         * @param {CSG[]} csg - list of CSG objects
         * @returns {CSG} new CSG object
         * @example
         * let C = A.union(B)
         * @example
         * +-------+            +-------+
         * |       |            |       |
         * |   A   |            |       |
         * |    +--+----+   =   |       +----+
         * +----+--+    |       +----+       |
         *      |   B   |            |       |
         *      |       |            |       |
         *      +-------+            +-------+
         */
        union: function (csg) {
          let csgs
          if (csg instanceof Array) {
            csgs = csg.slice(0)
            csgs.push(this)
          } else {
            csgs = [this, csg]
          }

          let i
          // combine csg pairs in a way that forms a balanced binary tree pattern
          for (i = 1; i < csgs.length; i += 2) {
            csgs.push(csgs[i - 1].unionSub(csgs[i]))
          }
          return csgs[i - 1].reTesselated().canonicalized()
        },

        unionSub: function (csg, retesselate, canonicalize) {
          if (!this.mayOverlap(csg)) {
            return this.unionForNonIntersecting(csg)
          } else {
            let a = new Tree(this.polygons)
            let b = new Tree(csg.polygons)
            a.clipTo(b, false)

            // b.clipTo(a, true); // ERROR: this doesn't work
            b.clipTo(a)
            b.invert()
            b.clipTo(a)
            b.invert()

            let newpolygons = a.allPolygons().concat(b.allPolygons())
            let result = CSG.fromPolygons(newpolygons)
            result.properties = this.properties._merge(csg.properties)
            if (retesselate) result = result.reTesselated()
            if (canonicalize) result = result.canonicalized()
            return result
          }
        },

        // Like union, but when we know that the two solids are not intersecting
        // Do not use if you are not completely sure that the solids do not intersect!
        unionForNonIntersecting: function (csg) {
          let newpolygons = this.polygons.concat(csg.polygons)
          let result = CSG.fromPolygons(newpolygons)
          result.properties = this.properties._merge(csg.properties)
          result.isCanonicalized = this.isCanonicalized && csg.isCanonicalized
          result.isRetesselated = this.isRetesselated && csg.isRetesselated
          return result
        },

        /**
         * Return a new CSG solid representing space in this solid but
         * not in the given solids. Neither this solid nor the given solids are modified.
         * @param {CSG[]} csg - list of CSG objects
         * @returns {CSG} new CSG object
         * @example
         * let C = A.subtract(B)
         * @example
         * +-------+            +-------+
         * |       |            |       |
         * |   A   |            |       |
         * |    +--+----+   =   |    +--+
         * +----+--+    |       +----+
         *      |   B   |
         *      |       |
         *      +-------+
         */
        subtract: function (csg) {
          let csgs
          if (csg instanceof Array) {
            csgs = csg
          } else {
            csgs = [csg]
          }
          let result = this
          for (let i = 0; i < csgs.length; i++) {
            let islast = (i === (csgs.length - 1))
            result = result.subtractSub(csgs[i], islast, islast)
          }
          return result
        },

        subtractSub: function (csg, retesselate, canonicalize) {
          let a = new Tree(this.polygons)
          let b = new Tree(csg.polygons)
          a.invert()
          a.clipTo(b)
          b.clipTo(a, true)
          a.addPolygons(b.allPolygons())
          a.invert()
          let result = CSG.fromPolygons(a.allPolygons())
          result.properties = this.properties._merge(csg.properties)
          if (retesselate) result = result.reTesselated()
          if (canonicalize) result = result.canonicalized()
          return result
        },

        /**
         * Return a new CSG solid representing space in both this solid and
         * in the given solids. Neither this solid nor the given solids are modified.
         * @param {CSG[]} csg - list of CSG objects
         * @returns {CSG} new CSG object
         * @example
         * let C = A.intersect(B)
         * @example
         * +-------+
         * |       |
         * |   A   |
         * |    +--+----+   =   +--+
         * +----+--+    |       +--+
         *      |   B   |
         *      |       |
         *      +-------+
         */
        intersect: function (csg) {
          let csgs
          if (csg instanceof Array) {
            csgs = csg
          } else {
            csgs = [csg]
          }
          let result = this
          for (let i = 0; i < csgs.length; i++) {
            let islast = (i === (csgs.length - 1))
            result = result.intersectSub(csgs[i], islast, islast)
          }
          return result
        },

        intersectSub: function (csg, retesselate, canonicalize) {
          let a = new Tree(this.polygons)
          let b = new Tree(csg.polygons)
          a.invert()
          b.clipTo(a)
          b.invert()
          a.clipTo(b)
          b.clipTo(a)
          a.addPolygons(b.allPolygons())
          a.invert()
          let result = CSG.fromPolygons(a.allPolygons())
          result.properties = this.properties._merge(csg.properties)
          if (retesselate) result = result.reTesselated()
          if (canonicalize) result = result.canonicalized()
          return result
        },

        /**
         * Return a new CSG solid with solid and empty space switched.
         * This solid is not modified.
         * @returns {CSG} new CSG object
         * @example
         * let B = A.invert()
         */
        invert: function () {
          let flippedpolygons = this.polygons.map(function (p) {
            return p.flipped()
          })
          return CSG.fromPolygons(flippedpolygons)
          // TODO: flip properties?
        },

        // Affine transformation of CSG object. Returns a new CSG object
        transform1: function (matrix4x4) {
          let newpolygons = this.polygons.map(function (p) {
            return p.transform(matrix4x4)
          })
          let result = CSG.fromPolygons(newpolygons)
          result.properties = this.properties._transform(matrix4x4)
          result.isRetesselated = this.isRetesselated
          return result
        },

        /**
         * Return a new CSG solid that is transformed using the given Matrix.
         * Several matrix transformations can be combined before transforming this solid.
         * @param {CSG.Matrix4x4} matrix4x4 - matrix to be applied
         * @returns {CSG} new CSG object
         * @example
         * var m = new CSG.Matrix4x4()
         * m = m.multiply(CSG.Matrix4x4.rotationX(40))
         * m = m.multiply(CSG.Matrix4x4.translation([-.5, 0, 0]))
         * let B = A.transform(m)
         */
        transform: function (matrix4x4) {
          let ismirror = matrix4x4.isMirroring()
          let transformedvertices = {}
          let transformedplanes = {}
          let newpolygons = this.polygons.map(function (p) {
            let newplane
            let plane = p.plane
            let planetag = plane.getTag()
            if (planetag in transformedplanes) {
              newplane = transformedplanes[planetag]
            } else {
              newplane = plane.transform(matrix4x4)
              transformedplanes[planetag] = newplane
            }
            let newvertices = p.vertices.map(function (v) {
              let newvertex
              let vertextag = v.getTag()
              if (vertextag in transformedvertices) {
                newvertex = transformedvertices[vertextag]
              } else {
                newvertex = v.transform(matrix4x4)
                transformedvertices[vertextag] = newvertex
              }
              return newvertex
            })
            if (ismirror) newvertices.reverse()
            return new Polygon(newvertices, p.shared, newplane)
          })
          let result = CSG.fromPolygons(newpolygons)
          result.properties = this.properties._transform(matrix4x4)
          result.isRetesselated = this.isRetesselated
          result.isCanonicalized = this.isCanonicalized
          return result
        },

        toString: function () {
          let result = 'CSG solid:\n'
          this.polygons.map(function (p) {
            result += p.toString()
          })
          return result
        },

        // Expand the solid
        // resolution: number of points per 360 degree for the rounded corners
        expand: function (radius, resolution) {
          let result = this.expandedShell(radius, resolution, true)
          result = result.reTesselated()
          result.properties = this.properties // keep original properties
          return result
        },

        // Contract the solid
        // resolution: number of points per 360 degree for the rounded corners
        contract: function (radius, resolution) {
          let expandedshell = this.expandedShell(radius, resolution, false)
          let result = this.subtract(expandedshell)
          result = result.reTesselated()
          result.properties = this.properties // keep original properties
          return result
        },

        // cut the solid at a plane, and stretch the cross-section found along plane normal
        stretchAtPlane: function (normal, point, length) {
          let plane = Plane.fromNormalAndPoint(normal, point)
          let onb = new OrthoNormalBasis(plane)
          let crosssect = this.sectionCut(onb)
          let midpiece = crosssect.extrudeInOrthonormalBasis(onb, length)
          let piece1 = this.cutByPlane(plane)
          let piece2 = this.cutByPlane(plane.flipped())
          let result = piece1.union([midpiece, piece2.translate(plane.normal.times(length))])
          return result
        },

        // Create the expanded shell of the solid:
        // All faces are extruded to get a thickness of 2*radius
        // Cylinders are constructed around every side
        // Spheres are placed on every vertex
        // unionWithThis: if true, the resulting solid will be united with 'this' solid;
        //   the result is a true expansion of the solid
        //   If false, returns only the shell
        expandedShell: function (radius, resolution, unionWithThis) {
          // const {sphere} = require('./primitives3d') // FIXME: circular dependency !
          let csg = this.reTesselated()
          let result
          if (unionWithThis) {
            result = csg
          } else {
            result = new CSG()
          }

          // first extrude all polygons:
          csg.polygons.map(function (polygon) {
            let extrudevector = polygon.plane.normal.unit().times(2 * radius)
            let translatedpolygon = polygon.translate(extrudevector.times(-0.5))
            let extrudedface = translatedpolygon.extrude(extrudevector)
            result = result.unionSub(extrudedface, false, false)
          })

          // Make a list of all unique vertex pairs (i.e. all sides of the solid)
          // For each vertex pair we collect the following:
          //   v1: first coordinate
          //   v2: second coordinate
          //   planenormals: array of normal vectors of all planes touching this side
          let vertexpairs = {} // map of 'vertex pair tag' to {v1, v2, planenormals}
          csg.polygons.map(function (polygon) {
            let numvertices = polygon.vertices.length
            let prevvertex = polygon.vertices[numvertices - 1]
            let prevvertextag = prevvertex.getTag()
            for (let i = 0; i < numvertices; i++) {
              let vertex = polygon.vertices[i]
              let vertextag = vertex.getTag()
              let vertextagpair
              if (vertextag < prevvertextag) {
                vertextagpair = vertextag + '-' + prevvertextag
              } else {
                vertextagpair = prevvertextag + '-' + vertextag
              }
              let obj
              if (vertextagpair in vertexpairs) {
                obj = vertexpairs[vertextagpair]
              } else {
                obj = {
                  v1: prevvertex,
                  v2: vertex,
                  planenormals: []
                }
                vertexpairs[vertextagpair] = obj
              }
              obj.planenormals.push(polygon.plane.normal)

              prevvertextag = vertextag
              prevvertex = vertex
            }
          })

          // now construct a cylinder on every side
          // The cylinder is always an approximation of a true cylinder: it will have <resolution> polygons
          // around the sides. We will make sure though that the cylinder will have an edge at every
          // face that touches this side. This ensures that we will get a smooth fill even
          // if two edges are at, say, 10 degrees and the resolution is low.
          // Note: the result is not retesselated yet but it really should be!
          for (let vertextagpair in vertexpairs) {
            let vertexpair = vertexpairs[vertextagpair]
            let startpoint = vertexpair.v1.pos
            let endpoint = vertexpair.v2.pos
            // our x,y and z vectors:
            let zbase = endpoint.minus(startpoint).unit()
            let xbase = vertexpair.planenormals[0].unit()
            let ybase = xbase.cross(zbase)

            // make a list of angles that the cylinder should traverse:
            let angles = []

            // first of all equally spaced around the cylinder:
            for (let i = 0; i < resolution; i++) {
              angles.push(i * Math.PI * 2 / resolution)
            }

            // and also at every normal of all touching planes:
            for (let i = 0, iMax = vertexpair.planenormals.length; i < iMax; i++) {
              let planenormal = vertexpair.planenormals[i]
              let si = ybase.dot(planenormal)
              let co = xbase.dot(planenormal)
              let angle = Math.atan2(si, co)

              if (angle < 0) angle += Math.PI * 2
              angles.push(angle)
              angle = Math.atan2(-si, -co)
              if (angle < 0) angle += Math.PI * 2
              angles.push(angle)
            }

            // this will result in some duplicate angles but we will get rid of those later.
            // Sort:
            angles = angles.sort(fnNumberSort)

            // Now construct the cylinder by traversing all angles:
            let numangles = angles.length
            let prevp1
            let prevp2
            let startfacevertices = []
            let endfacevertices = []
            let polygons = []
            for (let i = -1; i < numangles; i++) {
              let angle = angles[(i < 0) ? (i + numangles) : i]
              let si = Math.sin(angle)
              let co = Math.cos(angle)
              let p = xbase.times(co * radius).plus(ybase.times(si * radius))
              let p1 = startpoint.plus(p)
              let p2 = endpoint.plus(p)
              let skip = false
              if (i >= 0) {
                if (p1.distanceTo(prevp1) < EPS) {
                  skip = true
                }
              }
              if (!skip) {
                if (i >= 0) {
                  startfacevertices.push(new Vertex(p1))
                  endfacevertices.push(new Vertex(p2))
                  let polygonvertices = [
                    new Vertex(prevp2),
                    new Vertex(p2),
                    new Vertex(p1),
                    new Vertex(prevp1)
                  ]
                  let polygon = new Polygon(polygonvertices)
                  polygons.push(polygon)
                }
                prevp1 = p1
                prevp2 = p2
              }
            }
            endfacevertices.reverse()
            polygons.push(new Polygon(startfacevertices))
            polygons.push(new Polygon(endfacevertices))
            let cylinder = CSG.fromPolygons(polygons)
            result = result.unionSub(cylinder, false, false)
          }

          // make a list of all unique vertices
          // For each vertex we also collect the list of normals of the planes touching the vertices
          let vertexmap = {}
          csg.polygons.map(function (polygon) {
            polygon.vertices.map(function (vertex) {
              let vertextag = vertex.getTag()
              let obj
              if (vertextag in vertexmap) {
                obj = vertexmap[vertextag]
              } else {
                obj = {
                  pos: vertex.pos,
                  normals: []
                }
                vertexmap[vertextag] = obj
              }
              obj.normals.push(polygon.plane.normal)
            })
          })

          // and build spheres at each vertex
          // We will try to set the x and z axis to the normals of 2 planes
          // This will ensure that our sphere tesselation somewhat matches 2 planes
          for (let vertextag in vertexmap) {
            let vertexobj = vertexmap[vertextag]
            // use the first normal to be the x axis of our sphere:
            let xaxis = vertexobj.normals[0].unit()
            // and find a suitable z axis. We will use the normal which is most perpendicular to the x axis:
            let bestzaxis = null
            let bestzaxisorthogonality = 0
            for (let i = 1; i < vertexobj.normals.length; i++) {
              let normal = vertexobj.normals[i].unit()
              let cross = xaxis.cross(normal)
              let crosslength = cross.length()
              if (crosslength > 0.05) {
                if (crosslength > bestzaxisorthogonality) {
                  bestzaxisorthogonality = crosslength
                  bestzaxis = normal
                }
              }
            }
            if (!bestzaxis) {
              bestzaxis = xaxis.randomNonParallelVector()
            }
            let yaxis = xaxis.cross(bestzaxis).unit()
            let zaxis = yaxis.cross(xaxis)
            let _sphere = CSG.sphere({
              center: vertexobj.pos,
              radius: radius,
              resolution: resolution,
              axes: [xaxis, yaxis, zaxis]
            })
            result = result.unionSub(_sphere, false, false)
          }

          return result
        },

        canonicalized: function () {
          if (this.isCanonicalized) {
            return this
          } else {
            let factory = new FuzzyCSGFactory()
            let result = CSGFromCSGFuzzyFactory(factory, this)
            result.isCanonicalized = true
            result.isRetesselated = this.isRetesselated
            result.properties = this.properties // keep original properties
            return result
          }
        },

        reTesselated: function () {
          if (this.isRetesselated) {
            return this
          } else {
            let csg = this
            let polygonsPerPlane = {}
            let isCanonicalized = csg.isCanonicalized
            let fuzzyfactory = new FuzzyCSGFactory()
            csg.polygons.map(function (polygon) {
              let plane = polygon.plane
              let shared = polygon.shared
              if (!isCanonicalized) {
                // in order to identify to polygons having the same plane, we need to canonicalize the planes
                // We don't have to do a full canonizalization (including vertices), to save time only do the planes and the shared data:
                plane = fuzzyfactory.getPlane(plane)
                shared = fuzzyfactory.getPolygonShared(shared)
              }
              let tag = plane.getTag() + '/' + shared.getTag()
              if (!(tag in polygonsPerPlane)) {
                polygonsPerPlane[tag] = [polygon]
              } else {
                polygonsPerPlane[tag].push(polygon)
              }
            })
            let destpolygons = []
            for (let planetag in polygonsPerPlane) {
              let sourcepolygons = polygonsPerPlane[planetag]
              if (sourcepolygons.length < 2) {
                destpolygons = destpolygons.concat(sourcepolygons)
              } else {
                let retesselayedpolygons = []
                reTesselateCoplanarPolygons(sourcepolygons, retesselayedpolygons)
                destpolygons = destpolygons.concat(retesselayedpolygons)
              }
            }
            let result = CSG.fromPolygons(destpolygons)
            result.isRetesselated = true
            // result = result.canonicalized();
            result.properties = this.properties // keep original properties
            return result
          }
        },

        /**
         * Returns an array of Vector3D, providing minimum coordinates and maximum coordinates
         * of this solid.
         * @returns {Vector3D[]}
         * @example
         * let bounds = A.getBounds()
         * let minX = bounds[0].x
         */
        getBounds: function () {
          if (!this.cachedBoundingBox) {
            let minpoint = new Vector3D(0, 0, 0)
            let maxpoint = new Vector3D(0, 0, 0)
            let polygons = this.polygons
            let numpolygons = polygons.length
            for (let i = 0; i < numpolygons; i++) {
              let polygon = polygons[i]
              let bounds = polygon.boundingBox()
              if (i === 0) {
                minpoint = bounds[0]
                maxpoint = bounds[1]
              } else {
                minpoint = minpoint.min(bounds[0])
                maxpoint = maxpoint.max(bounds[1])
              }
            }
            this.cachedBoundingBox = [minpoint, maxpoint]
          }
          return this.cachedBoundingBox
        },

        // returns true if there is a possibility that the two solids overlap
        // returns false if we can be sure that they do not overlap
        mayOverlap: function (csg) {
          if ((this.polygons.length === 0) || (csg.polygons.length === 0)) {
            return false
          } else {
            let mybounds = this.getBounds()
            let otherbounds = csg.getBounds()
            if (mybounds[1].x < otherbounds[0].x) return false
            if (mybounds[0].x > otherbounds[1].x) return false
            if (mybounds[1].y < otherbounds[0].y) return false
            if (mybounds[0].y > otherbounds[1].y) return false
            if (mybounds[1].z < otherbounds[0].z) return false
            if (mybounds[0].z > otherbounds[1].z) return false
            return true
          }
        },

        // Cut the solid by a plane. Returns the solid on the back side of the plane
        cutByPlane: function (plane) {
          if (this.polygons.length === 0) {
            return new CSG()
          }
          // Ideally we would like to do an intersection with a polygon of inifinite size
          // but this is not supported by our implementation. As a workaround, we will create
          // a cube, with one face on the plane, and a size larger enough so that the entire
          // solid fits in the cube.
          // find the max distance of any vertex to the center of the plane:
          let planecenter = plane.normal.times(plane.w)
          let maxdistance = 0
          this.polygons.map(function (polygon) {
            polygon.vertices.map(function (vertex) {
              let distance = vertex.pos.distanceToSquared(planecenter)
              if (distance > maxdistance) maxdistance = distance
            })
          })
          maxdistance = Math.sqrt(maxdistance)
          maxdistance *= 1.01 // make sure it's really larger
          // Now build a polygon on the plane, at any point farther than maxdistance from the plane center:
          let vertices = []
          let orthobasis = new OrthoNormalBasis(plane)
          vertices.push(new Vertex(orthobasis.to3D(new Vector2D(maxdistance, -maxdistance))))
          vertices.push(new Vertex(orthobasis.to3D(new Vector2D(-maxdistance, -maxdistance))))
          vertices.push(new Vertex(orthobasis.to3D(new Vector2D(-maxdistance, maxdistance))))
          vertices.push(new Vertex(orthobasis.to3D(new Vector2D(maxdistance, maxdistance))))
          let polygon = new Polygon(vertices, null, plane.flipped())

          // and extrude the polygon into a cube, backwards of the plane:
          let cube = polygon.extrude(plane.normal.times(-maxdistance))

          // Now we can do the intersection:
          let result = this.intersect(cube)
          result.properties = this.properties // keep original properties
          return result
        },

        // Connect a solid to another solid, such that two Connectors become connected
        //   myConnector: a Connector of this solid
        //   otherConnector: a Connector to which myConnector should be connected
        //   mirror: false: the 'axis' vectors of the connectors should point in the same direction
        //           true: the 'axis' vectors of the connectors should point in opposite direction
        //   normalrotation: degrees of rotation between the 'normal' vectors of the two
        //                   connectors
        connectTo: function (myConnector, otherConnector, mirror, normalrotation) {
          let matrix = myConnector.getTransformationTo(otherConnector, mirror, normalrotation)
          return this.transform(matrix)
        },

        // set the .shared property of all polygons
        // Returns a new CSG solid, the original is unmodified!
        setShared: function (shared) {
          let polygons = this.polygons.map(function (p) {
            return new Polygon(p.vertices, shared, p.plane)
          })
          let result = CSG.fromPolygons(polygons)
          result.properties = this.properties // keep original properties
          result.isRetesselated = this.isRetesselated
          result.isCanonicalized = this.isCanonicalized
          return result
        },

        setColor: function (args) {
          let newshared = Polygon.Shared.fromColor.apply(this, arguments)
          return this.setShared(newshared)
        },

        toCompactBinary: function () {
          let csg = this.canonicalized(),
            numpolygons = csg.polygons.length,
            numpolygonvertices = 0,
            numvertices = 0,
            vertexmap = {},
            vertices = [],
            numplanes = 0,
            planemap = {},
            polygonindex = 0,
            planes = [],
            shareds = [],
            sharedmap = {},
            numshared = 0
          // for (let i = 0, iMax = csg.polygons.length; i < iMax; i++) {
          //  let p = csg.polygons[i];
          //  for (let j = 0, jMax = p.length; j < jMax; j++) {
          //      ++numpolygonvertices;
          //      let vertextag = p[j].getTag();
          //      if(!(vertextag in vertexmap)) {
          //          vertexmap[vertextag] = numvertices++;
          //          vertices.push(p[j]);
          //      }
          //  }
          csg.polygons.map(function (p) {
            p.vertices.map(function (v) {
              ++numpolygonvertices
              let vertextag = v.getTag()
              if (!(vertextag in vertexmap)) {
                vertexmap[vertextag] = numvertices++
                vertices.push(v)
              }
            })

            let planetag = p.plane.getTag()
            if (!(planetag in planemap)) {
              planemap[planetag] = numplanes++
              planes.push(p.plane)
            }
            let sharedtag = p.shared.getTag()
            if (!(sharedtag in sharedmap)) {
              sharedmap[sharedtag] = numshared++
              shareds.push(p.shared)
            }
          })
          let numVerticesPerPolygon = new Uint32Array(numpolygons)
          let polygonSharedIndexes = new Uint32Array(numpolygons)
          let polygonVertices = new Uint32Array(numpolygonvertices)
          let polygonPlaneIndexes = new Uint32Array(numpolygons)
          let vertexData = new Float64Array(numvertices * 3)
          let planeData = new Float64Array(numplanes * 4)
          let polygonVerticesIndex = 0
          for (let polygonindex = 0; polygonindex < numpolygons; ++polygonindex) {
            let p = csg.polygons[polygonindex]
            numVerticesPerPolygon[polygonindex] = p.vertices.length
            p.vertices.map(function (v) {
              let vertextag = v.getTag()
              let vertexindex = vertexmap[vertextag]
              polygonVertices[polygonVerticesIndex++] = vertexindex
            })
            let planetag = p.plane.getTag()
            let planeindex = planemap[planetag]
            polygonPlaneIndexes[polygonindex] = planeindex
            let sharedtag = p.shared.getTag()
            let sharedindex = sharedmap[sharedtag]
            polygonSharedIndexes[polygonindex] = sharedindex
          }
          let verticesArrayIndex = 0
          vertices.map(function (v) {
            let pos = v.pos
            vertexData[verticesArrayIndex++] = pos._x
            vertexData[verticesArrayIndex++] = pos._y
            vertexData[verticesArrayIndex++] = pos._z
          })
          let planesArrayIndex = 0
          planes.map(function (p) {
            let normal = p.normal
            planeData[planesArrayIndex++] = normal._x
            planeData[planesArrayIndex++] = normal._y
            planeData[planesArrayIndex++] = normal._z
            planeData[planesArrayIndex++] = p.w
          })
          let result = {
            'class': 'CSG',
            numPolygons: numpolygons,
            numVerticesPerPolygon: numVerticesPerPolygon,
            polygonPlaneIndexes: polygonPlaneIndexes,
            polygonSharedIndexes: polygonSharedIndexes,
            polygonVertices: polygonVertices,
            vertexData: vertexData,
            planeData: planeData,
            shared: shareds
          }
          return result
        },

        // Get the transformation that transforms this CSG such that it is lying on the z=0 plane,
        // as flat as possible (i.e. the least z-height).
        // So that it is in an orientation suitable for CNC milling
        getTransformationAndInverseTransformationToFlatLying: function () {
          if (this.polygons.length === 0) {
            let m = new Matrix4x4() // unity
            return [m, m]
          } else {
            // get a list of unique planes in the CSG:
            let csg = this.canonicalized()
            let planemap = {}
            csg.polygons.map(function (polygon) {
              planemap[polygon.plane.getTag()] = polygon.plane
            })
            // try each plane in the CSG and find the plane that, when we align it flat onto z=0,
            // gives the least height in z-direction.
            // If two planes give the same height, pick the plane that originally had a normal closest
            // to [0,0,-1].
            let xvector = new Vector3D(1, 0, 0)
            let yvector = new Vector3D(0, 1, 0)
            let zvector = new Vector3D(0, 0, 1)
            let z0connectorx = new Connector([0, 0, 0], [0, 0, -1], xvector)
            let z0connectory = new Connector([0, 0, 0], [0, 0, -1], yvector)
            let isfirst = true
            let minheight = 0
            let maxdotz = 0
            let besttransformation, bestinversetransformation
            for (let planetag in planemap) {
              let plane = planemap[planetag]
              let pointonplane = plane.normal.times(plane.w)
              let transformation, inversetransformation
              // We need a normal vecrtor for the transformation
              // determine which is more perpendicular to the plane normal: x or y?
              // we will align this as much as possible to the x or y axis vector
              let xorthogonality = plane.normal.cross(xvector).length()
              let yorthogonality = plane.normal.cross(yvector).length()
              if (xorthogonality > yorthogonality) {
                // x is better:
                let planeconnector = new Connector(pointonplane, plane.normal, xvector)
                transformation = planeconnector.getTransformationTo(z0connectorx, false, 0)
                inversetransformation = z0connectorx.getTransformationTo(planeconnector, false, 0)
              } else {
                // y is better:
                let planeconnector = new Connector(pointonplane, plane.normal, yvector)
                transformation = planeconnector.getTransformationTo(z0connectory, false, 0)
                inversetransformation = z0connectory.getTransformationTo(planeconnector, false, 0)
              }
              let transformedcsg = csg.transform(transformation)
              let dotz = -plane.normal.dot(zvector)
              let bounds = transformedcsg.getBounds()
              let zheight = bounds[1].z - bounds[0].z
              let isbetter = isfirst
              if (!isbetter) {
                if (zheight < minheight) {
                  isbetter = true
                } else if (zheight === minheight) {
                  if (dotz > maxdotz) isbetter = true
                }
              }
              if (isbetter) {
                // translate the transformation around the z-axis and onto the z plane:
                let translation = new Vector3D([-0.5 * (bounds[1].x + bounds[0].x), -0.5 * (bounds[1].y + bounds[0].y), -bounds[0].z])
                transformation = transformation.multiply(Matrix4x4.translation(translation))
                inversetransformation = Matrix4x4.translation(translation.negated()).multiply(inversetransformation)
                minheight = zheight
                maxdotz = dotz
                besttransformation = transformation
                bestinversetransformation = inversetransformation
              }
              isfirst = false
            }
            return [besttransformation, bestinversetransformation]
          }
        },

        getTransformationToFlatLying: function () {
          let result = this.getTransformationAndInverseTransformationToFlatLying()
          return result[0]
        },

        lieFlat: function () {
          let transformation = this.getTransformationToFlatLying()
          return this.transform(transformation)
        },

        // project the 3D CSG onto a plane
        // This returns a 2D CAG with the 'shadow' shape of the 3D solid when projected onto the
        // plane represented by the orthonormal basis
        projectToOrthoNormalBasis: function (orthobasis) {
          let cags = []
          this.polygons.filter(function (p) {
            // only return polys in plane, others may disturb result
            return p.plane.normal.minus(orthobasis.plane.normal).lengthSquared() < (EPS * EPS)
          })
            .map(function (polygon) {
              let cag = polygon.projectToOrthoNormalBasis(orthobasis)
              if (cag.sides.length > 0) {
                cags.push(cag)
              }
            })
          let result = new CAG().union(cags)
          return result
        },

        sectionCut: function (orthobasis) {
          let plane1 = orthobasis.plane
          let plane2 = orthobasis.plane.flipped()
          plane1 = new Plane(plane1.normal, plane1.w)
          plane2 = new Plane(plane2.normal, plane2.w + (5 * EPS))
          let cut3d = this.cutByPlane(plane1)
          cut3d = cut3d.cutByPlane(plane2)
          return cut3d.projectToOrthoNormalBasis(orthobasis)
        },

        fixTJunctions: function () {
          return fixTJunctions(CSG.fromPolygons, this)
        },

        toTriangles: function () {
          let polygons = []
          this.polygons.forEach(function (poly) {
            let firstVertex = poly.vertices[0]
            for (let i = poly.vertices.length - 3; i >= 0; i--) {
              polygons.push(new Polygon([
                firstVertex, poly.vertices[i + 1], poly.vertices[i + 2]
              ],
                poly.shared, poly.plane))
            }
          })
          return polygons
        },

        /**
         * Returns an array of values for the requested features of this solid.
         * Supported Features: 'volume', 'area'
         * @param {String[]} features - list of features to calculate
         * @returns {Float[]} values
         * @example
         * let volume = A.getFeatures('volume')
         * let values = A.getFeatures('area','volume')
         */
        getFeatures: function (features) {
          if (!(features instanceof Array)) {
            features = [features]
          }
          let result = this.toTriangles().map(function (triPoly) {
            return triPoly.getTetraFeatures(features)
          })
            .reduce(function (pv, v) {
              return v.map(function (feat, i) {
                return feat + (pv === 0 ? 0 : pv[i])
              })
            }, 0)
          return (result.length === 1) ? result[0] : result
        }
      }

      /** Construct a CSG solid from a list of `Polygon` instances.
       * @param {Polygon[]} polygons - list of polygons
       * @returns {CSG} new CSG object
       */
      CSG.fromPolygons = function fromPolygons(polygons) {
        let csg = new CSG()
        csg.polygons = polygons
        csg.isCanonicalized = false
        csg.isRetesselated = false
        return csg
      }

      const CSGFromCSGFuzzyFactory = function (factory, sourcecsg) {
        let _this = factory
        let newpolygons = []
        sourcecsg.polygons.forEach(function (polygon) {
          let newpolygon = _this.getPolygon(polygon)
          // see getPolygon above: we may get a polygon with no vertices, discard it:
          if (newpolygon.vertices.length >= 3) {
            newpolygons.push(newpolygon)
          }
        })
        return CSG.fromPolygons(newpolygons)
      }

      module.exports = CSG

    }, { "./CAG": 2, "./FuzzyFactory3d": 8, "./Properties": 9, "./connectors": 10, "./constants": 11, "./math/Matrix4": 15, "./math/OrthoNormalBasis": 16, "./math/Plane": 18, "./math/Polygon3": 20, "./math/Vector2": 22, "./math/Vector3": 23, "./math/Vertex3": 25, "./math/polygonUtils": 27, "./trees": 32, "./utils": 33, "./utils/fixTJunctions": 34 }], 5: [function (require, module, exports) {
      const Vector3D = require('./math/Vector3')
      const Vertex = require('./math/Vertex3')
      const Plane = require('./math/Plane')
      const Polygon2D = require('./math/Polygon2')
      const Polygon3D = require('./math/Polygon3')

      /** Construct a CSG solid from a list of pre-generated slices.
       * See Polygon.prototype.solidFromSlices() for details.
       * @param {Object} options - options passed to solidFromSlices()
       * @returns {CSG} new CSG object
       */
      function fromSlices(options) {
        return (new Polygon2D.createFromPoints([
          [0, 0, 0],
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0]
        ])).solidFromSlices(options)
      }

      /** Reconstruct a CSG solid from an object with identical property names.
       * @param {Object} obj - anonymous object, typically from JSON
       * @returns {CSG} new CSG object
       */
      function fromObject(obj) {
        const CSG = require('./CSG')
        let polygons = obj.polygons.map(function (p) {
          return Polygon3D.fromObject(p)
        })
        let csg = CSG.fromPolygons(polygons)
        csg.isCanonicalized = obj.isCanonicalized
        csg.isRetesselated = obj.isRetesselated
        return csg
      }

      /** Reconstruct a CSG from the output of toCompactBinary().
       * @param {CompactBinary} bin - see toCompactBinary().
       * @returns {CSG} new CSG object
       */
      function fromCompactBinary(bin) {
        const CSG = require('./CSG') // FIXME: circular dependency ??

        if (bin['class'] !== 'CSG') throw new Error('Not a CSG')
        let planes = []
        let planeData = bin.planeData
        let numplanes = planeData.length / 4
        let arrayindex = 0
        let x, y, z, w, normal, plane
        for (let planeindex = 0; planeindex < numplanes; planeindex++) {
          x = planeData[arrayindex++]
          y = planeData[arrayindex++]
          z = planeData[arrayindex++]
          w = planeData[arrayindex++]
          normal = Vector3D.Create(x, y, z)
          plane = new Plane(normal, w)
          planes.push(plane)
        }

        let vertices = []
        const vertexData = bin.vertexData
        const numvertices = vertexData.length / 3
        let pos
        let vertex
        arrayindex = 0
        for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
          x = vertexData[arrayindex++]
          y = vertexData[arrayindex++]
          z = vertexData[arrayindex++]
          pos = Vector3D.Create(x, y, z)
          vertex = new Vertex(pos)
          vertices.push(vertex)
        }

        let shareds = bin.shared.map(function (shared) {
          return Polygon3D.Shared.fromObject(shared)
        })

        let polygons = []
        let numpolygons = bin.numPolygons
        let numVerticesPerPolygon = bin.numVerticesPerPolygon
        let polygonVertices = bin.polygonVertices
        let polygonPlaneIndexes = bin.polygonPlaneIndexes
        let polygonSharedIndexes = bin.polygonSharedIndexes
        let numpolygonvertices
        let polygonvertices
        let shared
        let polygon // already defined plane,
        arrayindex = 0
        for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
          numpolygonvertices = numVerticesPerPolygon[polygonindex]
          polygonvertices = []
          for (let i = 0; i < numpolygonvertices; i++) {
            polygonvertices.push(vertices[polygonVertices[arrayindex++]])
          }
          plane = planes[polygonPlaneIndexes[polygonindex]]
          shared = shareds[polygonSharedIndexes[polygonindex]]
          polygon = new Polygon3D(polygonvertices, shared, plane)
          polygons.push(polygon)
        }
        let csg = CSG.fromPolygons(polygons)
        csg.isCanonicalized = true
        csg.isRetesselated = true
        return csg
      }

      module.exports = {
        //fromPolygons,
        fromSlices,
        fromObject,
        fromCompactBinary
      }

    }, { "./CSG": 4, "./math/Plane": 18, "./math/Polygon2": 19, "./math/Polygon3": 20, "./math/Vector3": 23, "./math/Vertex3": 25 }], 6: [function (require, module, exports) {
      // //////////////////////////////
      // ## class fuzzyFactory
      // This class acts as a factory for objects. We can search for an object with approximately
      // the desired properties (say a rectangle with width 2 and height 1)
      // The lookupOrCreate() method looks for an existing object (for example it may find an existing rectangle
      // with width 2.0001 and height 0.999. If no object is found, the user supplied callback is
      // called, which should generate a new object. The new object is inserted into the database
      // so it can be found by future lookupOrCreate() calls.
      // Constructor:
      //   numdimensions: the number of parameters for each object
      //     for example for a 2D rectangle this would be 2
      //   tolerance: The maximum difference for each parameter allowed to be considered a match
      const FuzzyFactory = function (numdimensions, tolerance) {
        this.lookuptable = {}
        this.multiplier = 1.0 / tolerance
      }

      FuzzyFactory.prototype = {
        // let obj = f.lookupOrCreate([el1, el2, el3], function(elements) {/* create the new object */});
        // Performs a fuzzy lookup of the object with the specified elements.
        // If found, returns the existing object
        // If not found, calls the supplied callback function which should create a new object with
        // the specified properties. This object is inserted in the lookup database.
        lookupOrCreate: function (els, creatorCallback) {
          let hash = ''
          let multiplier = this.multiplier
          els.forEach(function (el) {
            let valueQuantized = Math.round(el * multiplier)
            hash += valueQuantized + '/'
          })
          if (hash in this.lookuptable) {
            return this.lookuptable[hash]
          } else {
            let object = creatorCallback(els)
            let hashparts = els.map(function (el) {
              let q0 = Math.floor(el * multiplier)
              let q1 = q0 + 1
              return ['' + q0 + '/', '' + q1 + '/']
            })
            let numelements = els.length
            let numhashes = 1 << numelements
            for (let hashmask = 0; hashmask < numhashes; ++hashmask) {
              let hashmaskShifted = hashmask
              hash = ''
              hashparts.forEach(function (hashpart) {
                hash += hashpart[hashmaskShifted & 1]
                hashmaskShifted >>= 1
              })
              this.lookuptable[hash] = object
            }
            return object
          }
        }
      }

      module.exports = FuzzyFactory

    }, {}], 7: [function (require, module, exports) {
      const FuzzyFactory = require('./FuzzyFactory')
      const { EPS } = require('./constants')
      const Side = require('./math/Side')

      const FuzzyCAGFactory = function () {
        this.vertexfactory = new FuzzyFactory(2, EPS)
      }

      FuzzyCAGFactory.prototype = {
        getVertex: function (sourcevertex) {
          let elements = [sourcevertex.pos._x, sourcevertex.pos._y]
          let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
            return sourcevertex
          })
          return result
        },

        getSide: function (sourceside) {
          let vertex0 = this.getVertex(sourceside.vertex0)
          let vertex1 = this.getVertex(sourceside.vertex1)
          return new Side(vertex0, vertex1)
        }
      }

      module.exports = FuzzyCAGFactory

    }, { "./FuzzyFactory": 6, "./constants": 11, "./math/Side": 21 }], 8: [function (require, module, exports) {
      const { EPS } = require('./constants')
      const Polygon = require('./math/Polygon3')
      const FuzzyFactory = require('./FuzzyFactory')

      // ////////////////////////////////////
      const FuzzyCSGFactory = function () {
        this.vertexfactory = new FuzzyFactory(3, EPS)
        this.planefactory = new FuzzyFactory(4, EPS)
        this.polygonsharedfactory = {}
      }

      FuzzyCSGFactory.prototype = {
        getPolygonShared: function (sourceshared) {
          let hash = sourceshared.getHash()
          if (hash in this.polygonsharedfactory) {
            return this.polygonsharedfactory[hash]
          } else {
            this.polygonsharedfactory[hash] = sourceshared
            return sourceshared
          }
        },

        getVertex: function (sourcevertex) {
          let elements = [sourcevertex.pos._x, sourcevertex.pos._y, sourcevertex.pos._z]
          let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
            return sourcevertex
          })
          return result
        },

        getPlane: function (sourceplane) {
          let elements = [sourceplane.normal._x, sourceplane.normal._y, sourceplane.normal._z, sourceplane.w]
          let result = this.planefactory.lookupOrCreate(elements, function (els) {
            return sourceplane
          })
          return result
        },

        getPolygon: function (sourcepolygon) {
          let newplane = this.getPlane(sourcepolygon.plane)
          let newshared = this.getPolygonShared(sourcepolygon.shared)
          let _this = this
          let newvertices = sourcepolygon.vertices.map(function (vertex) {
            return _this.getVertex(vertex)
          })
          // two vertices that were originally very close may now have become
          // truly identical (referring to the same Vertex object).
          // Remove duplicate vertices:
          let newverticesDedup = []
          if (newvertices.length > 0) {
            let prevvertextag = newvertices[newvertices.length - 1].getTag()
            newvertices.forEach(function (vertex) {
              let vertextag = vertex.getTag()
              if (vertextag !== prevvertextag) {
                newverticesDedup.push(vertex)
              }
              prevvertextag = vertextag
            })
          }
          // If it's degenerate, remove all vertices:
          if (newverticesDedup.length < 3) {
            newverticesDedup = []
          }
          return new Polygon(newverticesDedup, newshared, newplane)
        }
      }

      module.exports = FuzzyCSGFactory

    }, { "./FuzzyFactory": 6, "./constants": 11, "./math/Polygon3": 20 }], 9: [function (require, module, exports) {
      // ////////////////////////////////////
      // # Class Properties
      // This class is used to store properties of a solid
      // A property can for example be a Vertex, a Plane or a Line3D
      // Whenever an affine transform is applied to the CSG solid, all its properties are
      // transformed as well.
      // The properties can be stored in a complex nested structure (using arrays and objects)
      const Properties = function () { }

      Properties.prototype = {
        _transform: function (matrix4x4) {
          let result = new Properties()
          Properties.transformObj(this, result, matrix4x4)
          return result
        },
        _merge: function (otherproperties) {
          let result = new Properties()
          Properties.cloneObj(this, result)
          Properties.addFrom(result, otherproperties)
          return result
        }
      }

      Properties.transformObj = function (source, result, matrix4x4) {
        for (let propertyname in source) {
          if (propertyname === '_transform') continue
          if (propertyname === '_merge') continue
          let propertyvalue = source[propertyname]
          let transformed = propertyvalue
          if (typeof (propertyvalue) === 'object') {
            if (('transform' in propertyvalue) && (typeof (propertyvalue.transform) === 'function')) {
              transformed = propertyvalue.transform(matrix4x4)
            } else if (propertyvalue instanceof Array) {
              transformed = []
              Properties.transformObj(propertyvalue, transformed, matrix4x4)
            } else if (propertyvalue instanceof Properties) {
              transformed = new Properties()
              Properties.transformObj(propertyvalue, transformed, matrix4x4)
            }
          }
          result[propertyname] = transformed
        }
      }

      Properties.cloneObj = function (source, result) {
        for (let propertyname in source) {
          if (propertyname === '_transform') continue
          if (propertyname === '_merge') continue
          let propertyvalue = source[propertyname]
          let cloned = propertyvalue
          if (typeof (propertyvalue) === 'object') {
            if (propertyvalue instanceof Array) {
              cloned = []
              for (let i = 0; i < propertyvalue.length; i++) {
                cloned.push(propertyvalue[i])
              }
            } else if (propertyvalue instanceof Properties) {
              cloned = new Properties()
              Properties.cloneObj(propertyvalue, cloned)
            }
          }
          result[propertyname] = cloned
        }
      }

      Properties.addFrom = function (result, otherproperties) {
        for (let propertyname in otherproperties) {
          if (propertyname === '_transform') continue
          if (propertyname === '_merge') continue
          if ((propertyname in result) &&
            (typeof (result[propertyname]) === 'object') &&
            (result[propertyname] instanceof Properties) &&
            (typeof (otherproperties[propertyname]) === 'object') &&
            (otherproperties[propertyname] instanceof Properties)) {
            Properties.addFrom(result[propertyname], otherproperties[propertyname])
          } else if (!(propertyname in result)) {
            result[propertyname] = otherproperties[propertyname]
          }
        }
      }

      module.exports = Properties

    }, {}], 10: [function (require, module, exports) {
      const Vector3D = require('./math/Vector3')
      const Line3D = require('./math/Line3')
      const Matrix4x4 = require('./math/Matrix4')
      const OrthoNormalBasis = require('./math/OrthoNormalBasis')
      const Plane = require('./math/Plane')

      // # class Connector
      // A connector allows to attach two objects at predefined positions
      // For example a servo motor and a servo horn:
      // Both can have a Connector called 'shaft'
      // The horn can be moved and rotated such that the two connectors match
      // and the horn is attached to the servo motor at the proper position.
      // Connectors are stored in the properties of a CSG solid so they are
      // ge the same transformations applied as the solid
      const Connector = function (point, axisvector, normalvector) {
        this.point = new Vector3D(point)
        this.axisvector = new Vector3D(axisvector).unit()
        this.normalvector = new Vector3D(normalvector).unit()
      }

      Connector.prototype = {
        normalized: function () {
          let axisvector = this.axisvector.unit()
          // make the normal vector truly normal:
          let n = this.normalvector.cross(axisvector).unit()
          let normalvector = axisvector.cross(n)
          return new Connector(this.point, axisvector, normalvector)
        },

        transform: function (matrix4x4) {
          let point = this.point.multiply4x4(matrix4x4)
          let axisvector = this.point.plus(this.axisvector).multiply4x4(matrix4x4).minus(point)
          let normalvector = this.point.plus(this.normalvector).multiply4x4(matrix4x4).minus(point)
          return new Connector(point, axisvector, normalvector)
        },

        // Get the transformation matrix to connect this Connector to another connector
        //   other: a Connector to which this connector should be connected
        //   mirror: false: the 'axis' vectors of the connectors should point in the same direction
        //           true: the 'axis' vectors of the connectors should point in opposite direction
        //   normalrotation: degrees of rotation between the 'normal' vectors of the two
        //                   connectors
        getTransformationTo: function (other, mirror, normalrotation) {
          mirror = mirror ? true : false
          normalrotation = normalrotation ? Number(normalrotation) : 0
          let us = this.normalized()
          other = other.normalized()
          // shift to the origin:
          let transformation = Matrix4x4.translation(this.point.negated())
          // construct the plane crossing through the origin and the two axes:
          let axesplane = Plane.anyPlaneFromVector3Ds(
            new Vector3D(0, 0, 0), us.axisvector, other.axisvector)
          let axesbasis = new OrthoNormalBasis(axesplane)
          let angle1 = axesbasis.to2D(us.axisvector).angle()
          let angle2 = axesbasis.to2D(other.axisvector).angle()
          let rotation = 180.0 * (angle2 - angle1) / Math.PI
          if (mirror) rotation += 180.0
          transformation = transformation.multiply(axesbasis.getProjectionMatrix())
          transformation = transformation.multiply(Matrix4x4.rotationZ(rotation))
          transformation = transformation.multiply(axesbasis.getInverseProjectionMatrix())
          let usAxesAligned = us.transform(transformation)
          // Now we have done the transformation for aligning the axes.
          // We still need to align the normals:
          let normalsplane = Plane.fromNormalAndPoint(other.axisvector, new Vector3D(0, 0, 0))
          let normalsbasis = new OrthoNormalBasis(normalsplane)
          angle1 = normalsbasis.to2D(usAxesAligned.normalvector).angle()
          angle2 = normalsbasis.to2D(other.normalvector).angle()
          rotation = 180.0 * (angle2 - angle1) / Math.PI
          rotation += normalrotation
          transformation = transformation.multiply(normalsbasis.getProjectionMatrix())
          transformation = transformation.multiply(Matrix4x4.rotationZ(rotation))
          transformation = transformation.multiply(normalsbasis.getInverseProjectionMatrix())
          // and translate to the destination point:
          transformation = transformation.multiply(Matrix4x4.translation(other.point))
          // let usAligned = us.transform(transformation);
          return transformation
        },

        axisLine: function () {
          return new Line3D(this.point, this.axisvector)
        },

        // creates a new Connector, with the connection point moved in the direction of the axisvector
        extend: function (distance) {
          let newpoint = this.point.plus(this.axisvector.unit().times(distance))
          return new Connector(newpoint, this.axisvector, this.normalvector)
        }
      }

      const ConnectorList = function (connectors) {
        this.connectors_ = connectors ? connectors.slice() : []
      }

      ConnectorList.defaultNormal = [0, 0, 1]

      ConnectorList.fromPath2D = function (path2D, arg1, arg2) {
        if (arguments.length === 3) {
          return ConnectorList._fromPath2DTangents(path2D, arg1, arg2)
        } else if (arguments.length === 2) {
          return ConnectorList._fromPath2DExplicit(path2D, arg1)
        } else {
          throw new Error('call with path2D and either 2 direction vectors, or a function returning direction vectors')
        }
      }

      /*
       * calculate the connector axisvectors by calculating the "tangent" for path2D.
       * This is undefined for start and end points, so axis for these have to be manually
       * provided.
       */
      ConnectorList._fromPath2DTangents = function (path2D, start, end) {
        // path2D
        let axis
        let pathLen = path2D.points.length
        let result = new ConnectorList([new Connector(path2D.points[0],
          start, ConnectorList.defaultNormal)])
        // middle points
        path2D.points.slice(1, pathLen - 1).forEach(function (p2, i) {
          axis = path2D.points[i + 2].minus(path2D.points[i]).toVector3D(0)
          result.appendConnector(new Connector(p2.toVector3D(0), axis,
            ConnectorList.defaultNormal))
        }, this)
        result.appendConnector(new Connector(path2D.points[pathLen - 1], end,
          ConnectorList.defaultNormal))
        result.closed = path2D.closed
        return result
      }

      /*
       * angleIsh: either a static angle, or a function(point) returning an angle
       */
      ConnectorList._fromPath2DExplicit = function (path2D, angleIsh) {
        function getAngle(angleIsh, pt, i) {
          if (typeof angleIsh === 'function') {
            angleIsh = angleIsh(pt, i)
          }
          return angleIsh
        }
        let result = new ConnectorList(
          path2D.points.map(function (p2, i) {
            return new Connector(p2.toVector3D(0),
              Vector3D.Create(1, 0, 0).rotateZ(getAngle(angleIsh, p2, i)),
              ConnectorList.defaultNormal)
          }, this)
        )
        result.closed = path2D.closed
        return result
      }

      ConnectorList.prototype = {
        setClosed: function (closed) {
          this.closed = !!closed // FIXME: what the hell ?
        },
        appendConnector: function (conn) {
          this.connectors_.push(conn)
        },
        /*
         * arguments: cagish: a cag or a function(connector) returning a cag
         *            closed: whether the 3d path defined by connectors location
         *              should be closed or stay open
         *              Note: don't duplicate connectors in the path
         * TODO: consider an option "maySelfIntersect" to close & force union all single segments
         */
        followWith: function (cagish) {
          const CSG = require('./CSG') // FIXME , circular dependency connectors => CSG => connectors

          this.verify()
          function getCag(cagish, connector) {
            if (typeof cagish === 'function') {
              cagish = cagish(connector.point, connector.axisvector, connector.normalvector)
            }
            return cagish
          }

          let polygons = []
          let currCag
          let prevConnector = this.connectors_[this.connectors_.length - 1]
          let prevCag = getCag(cagish, prevConnector)
          // add walls
          this.connectors_.forEach(function (connector, notFirst) {
            currCag = getCag(cagish, connector)
            if (notFirst || this.closed) {
              polygons.push.apply(polygons, prevCag._toWallPolygons({
                toConnector1: prevConnector, toConnector2: connector, cag: currCag
              }))
            } else {
              // it is the first, and shape not closed -> build start wall
              polygons.push.apply(polygons,
                currCag._toPlanePolygons({ toConnector: connector, flipped: true }))
            }
            if (notFirst === this.connectors_.length - 1 && !this.closed) {
              // build end wall
              polygons.push.apply(polygons,
                currCag._toPlanePolygons({ toConnector: connector }))
            }
            prevCag = currCag
            prevConnector = connector
          }, this)
          return CSG.fromPolygons(polygons).reTesselated().canonicalized()
        },
        /*
         * general idea behind these checks: connectors need to have smooth transition from one to another
         * TODO: add a check that 2 follow-on CAGs are not intersecting
         */
        verify: function () {
          let connI
          let connI1
          for (let i = 0; i < this.connectors_.length - 1; i++) {
            connI = this.connectors_[i]
            connI1 = this.connectors_[i + 1]
            if (connI1.point.minus(connI.point).dot(connI.axisvector) <= 0) {
              throw new Error('Invalid ConnectorList. Each connectors position needs to be within a <90deg range of previous connectors axisvector')
            }
            if (connI.axisvector.dot(connI1.axisvector) <= 0) {
              throw new Error('invalid ConnectorList. No neighboring connectors axisvectors may span a >=90deg angle')
            }
          }
        }
      }

      module.exports = { Connector, ConnectorList }

    }, { "./CSG": 4, "./math/Line3": 14, "./math/Matrix4": 15, "./math/OrthoNormalBasis": 16, "./math/Plane": 18, "./math/Vector3": 23 }], 11: [function (require, module, exports) {
      const _CSGDEBUG = false

      /** Number of polygons per 360 degree revolution for 2D objects.
       * @default
       */
      const defaultResolution2D = 32 // FIXME this seems excessive
      /** Number of polygons per 360 degree revolution for 3D objects.
       * @default
       */
      const defaultResolution3D = 12

      /** Epsilon used during determination of near zero distances.
       * @default
       */
      const EPS = 1e-5

      /** Epsilon used during determination of near zero areas.
       * @default
       */
      const angleEPS = 0.10

      /** Epsilon used during determination of near zero areas.
       *  This is the minimal area of a minimal polygon.
       * @default
       */
      const areaEPS = 0.50 * EPS * EPS * Math.sin(angleEPS)

      const all = 0
      const top = 1
      const bottom = 2
      const left = 3
      const right = 4
      const front = 5
      const back = 6
      // Tag factory: we can request a unique tag through CSG.getTag()
      let staticTag = 1
      const getTag = () => staticTag++

      module.exports = {
        _CSGDEBUG,
        defaultResolution2D,
        defaultResolution3D,
        EPS,
        angleEPS,
        areaEPS,
        all,
        top,
        bottom,
        left,
        right,
        front,
        back,
        staticTag,
        getTag
      }

    }, {}], 12: [function (require, module, exports) {
      const CSG = require('./CSG')
      const { cube } = require('./primitives3d')

      // For debugging
      // Creates a new solid with a tiny cube at every vertex of the source solid
      // this is seperated from the CSG class itself because of the dependency on cube
      const toPointCloud = function (csg, cuberadius) {
        csg = csg.reTesselated()

        let result = new CSG()

        // make a list of all unique vertices
        // For each vertex we also collect the list of normals of the planes touching the vertices
        let vertexmap = {}
        csg.polygons.map(function (polygon) {
          polygon.vertices.map(function (vertex) {
            vertexmap[vertex.getTag()] = vertex.pos
          })
        })

        for (let vertextag in vertexmap) {
          let pos = vertexmap[vertextag]
          let _cube = cube({
            center: pos,
            radius: cuberadius
          })
          result = result.unionSub(_cube, false, false)
        }
        result = result.reTesselated()
        return result
      }

      module.exports = { toPointCloud }

    }, { "./CSG": 4, "./primitives3d": 31 }], 13: [function (require, module, exports) {
      const Vector2D = require('./Vector2')
      const { solve2Linear } = require('../utils')

      /**  class Line2D
       * Represents a directional line in 2D space
       * A line is parametrized by its normal vector (perpendicular to the line, rotated 90 degrees counter clockwise)
       * and w. The line passes through the point <normal>.times(w).
       * Equation: p is on line if normal.dot(p)==w
       * @param {Vector2D} normal normal must be a unit vector!
       * @returns {Line2D}
      */
      const Line2D = function (normal, w) {
        normal = new Vector2D(normal)
        w = parseFloat(w)
        let l = normal.length()
        // normalize:
        w *= l
        normal = normal.times(1.0 / l)
        this.normal = normal
        this.w = w
      }

      Line2D.fromPoints = function (p1, p2) {
        p1 = new Vector2D(p1)
        p2 = new Vector2D(p2)
        let direction = p2.minus(p1)
        let normal = direction.normal().negated().unit()
        let w = p1.dot(normal)
        return new Line2D(normal, w)
      }

      Line2D.prototype = {
        // same line but opposite direction:
        reverse: function () {
          return new Line2D(this.normal.negated(), -this.w)
        },

        equals: function (l) {
          return (l.normal.equals(this.normal) && (l.w === this.w))
        },

        origin: function () {
          return this.normal.times(this.w)
        },

        direction: function () {
          return this.normal.normal()
        },

        xAtY: function (y) {
          // (py == y) && (normal * p == w)
          // -> px = (w - normal._y * y) / normal.x
          let x = (this.w - this.normal._y * y) / this.normal.x
          return x
        },

        absDistanceToPoint: function (point) {
          point = new Vector2D(point)
          let pointProjected = point.dot(this.normal)
          let distance = Math.abs(pointProjected - this.w)
          return distance
        },
        /* FIXME: has error - origin is not defined, the method is never used
         closestPoint: function(point) {
             point = new Vector2D(point);
             let vector = point.dot(this.direction());
             return origin.plus(vector);
         },
         */

        // intersection between two lines, returns point as Vector2D
        intersectWithLine: function (line2d) {
          let point = solve2Linear(this.normal.x, this.normal.y, line2d.normal.x, line2d.normal.y, this.w, line2d.w)
          point = new Vector2D(point) // make  vector2d
          return point
        },

        transform: function (matrix4x4) {
          let origin = new Vector2D(0, 0)
          let pointOnPlane = this.normal.times(this.w)
          let neworigin = origin.multiply4x4(matrix4x4)
          let neworiginPlusNormal = this.normal.multiply4x4(matrix4x4)
          let newnormal = neworiginPlusNormal.minus(neworigin)
          let newpointOnPlane = pointOnPlane.multiply4x4(matrix4x4)
          let neww = newnormal.dot(newpointOnPlane)
          return new Line2D(newnormal, neww)
        }
      }

      module.exports = Line2D

    }, { "../utils": 33, "./Vector2": 22 }], 14: [function (require, module, exports) {
      const Vector3D = require('./Vector3')
      const { EPS } = require('../constants')
      const { solve2Linear } = require('../utils')

      // # class Line3D
      // Represents a line in 3D space
      // direction must be a unit vector
      // point is a random point on the line
      const Line3D = function (point, direction) {
        point = new Vector3D(point)
        direction = new Vector3D(direction)
        this.point = point
        this.direction = direction.unit()
      }

      Line3D.fromPoints = function (p1, p2) {
        p1 = new Vector3D(p1)
        p2 = new Vector3D(p2)
        let direction = p2.minus(p1)
        return new Line3D(p1, direction)
      }

      Line3D.fromPlanes = function (p1, p2) {
        let direction = p1.normal.cross(p2.normal)
        let l = direction.length()
        if (l < EPS) {
          throw new Error('Parallel planes')
        }
        direction = direction.times(1.0 / l)

        let mabsx = Math.abs(direction.x)
        let mabsy = Math.abs(direction.y)
        let mabsz = Math.abs(direction.z)
        let origin
        if ((mabsx >= mabsy) && (mabsx >= mabsz)) {
          // direction vector is mostly pointing towards x
          // find a point p for which x is zero:
          let r = solve2Linear(p1.normal.y, p1.normal.z, p2.normal.y, p2.normal.z, p1.w, p2.w)
          origin = new Vector3D(0, r[0], r[1])
        } else if ((mabsy >= mabsx) && (mabsy >= mabsz)) {
          // find a point p for which y is zero:
          let r = solve2Linear(p1.normal.x, p1.normal.z, p2.normal.x, p2.normal.z, p1.w, p2.w)
          origin = new Vector3D(r[0], 0, r[1])
        } else {
          // find a point p for which z is zero:
          let r = solve2Linear(p1.normal.x, p1.normal.y, p2.normal.x, p2.normal.y, p1.w, p2.w)
          origin = new Vector3D(r[0], r[1], 0)
        }
        return new Line3D(origin, direction)
      }

      Line3D.prototype = {
        intersectWithPlane: function (plane) {
          // plane: plane.normal * p = plane.w
          // line: p=line.point + labda * line.direction
          let labda = (plane.w - plane.normal.dot(this.point)) / plane.normal.dot(this.direction)
          let point = this.point.plus(this.direction.times(labda))
          return point
        },

        clone: function (line) {
          return new Line3D(this.point.clone(), this.direction.clone())
        },

        reverse: function () {
          return new Line3D(this.point.clone(), this.direction.negated())
        },

        transform: function (matrix4x4) {
          let newpoint = this.point.multiply4x4(matrix4x4)
          let pointPlusDirection = this.point.plus(this.direction)
          let newPointPlusDirection = pointPlusDirection.multiply4x4(matrix4x4)
          let newdirection = newPointPlusDirection.minus(newpoint)
          return new Line3D(newpoint, newdirection)
        },

        closestPointOnLine: function (point) {
          point = new Vector3D(point)
          let t = point.minus(this.point).dot(this.direction) / this.direction.dot(this.direction)
          let closestpoint = this.point.plus(this.direction.times(t))
          return closestpoint
        },

        distanceToPoint: function (point) {
          point = new Vector3D(point)
          let closestpoint = this.closestPointOnLine(point)
          let distancevector = point.minus(closestpoint)
          let distance = distancevector.length()
          return distance
        },

        equals: function (line3d) {
          if (!this.direction.equals(line3d.direction)) return false
          let distance = this.distanceToPoint(line3d.point)
          if (distance > EPS) return false
          return true
        }
      }

      module.exports = Line3D

    }, { "../constants": 11, "../utils": 33, "./Vector3": 23 }], 15: [function (require, module, exports) {
      const Vector3D = require('./Vector3')
      const Vector2D = require('./Vector2')
      const OrthoNormalBasis = require('./OrthoNormalBasis')
      const Plane = require('./Plane')

      // # class Matrix4x4:
      // Represents a 4x4 matrix. Elements are specified in row order
      const Matrix4x4 = function (elements) {
        if (arguments.length >= 1) {
          this.elements = elements
        } else {
          // if no arguments passed: create unity matrix
          this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        }
      }

      Matrix4x4.prototype = {
        plus: function (m) {
          var r = []
          for (var i = 0; i < 16; i++) {
            r[i] = this.elements[i] + m.elements[i]
          }
          return new Matrix4x4(r)
        },

        minus: function (m) {
          var r = []
          for (var i = 0; i < 16; i++) {
            r[i] = this.elements[i] - m.elements[i]
          }
          return new Matrix4x4(r)
        },

        // right multiply by another 4x4 matrix:
        multiply: function (m) {
          // cache elements in local variables, for speedup:
          var this0 = this.elements[0]
          var this1 = this.elements[1]
          var this2 = this.elements[2]
          var this3 = this.elements[3]
          var this4 = this.elements[4]
          var this5 = this.elements[5]
          var this6 = this.elements[6]
          var this7 = this.elements[7]
          var this8 = this.elements[8]
          var this9 = this.elements[9]
          var this10 = this.elements[10]
          var this11 = this.elements[11]
          var this12 = this.elements[12]
          var this13 = this.elements[13]
          var this14 = this.elements[14]
          var this15 = this.elements[15]
          var m0 = m.elements[0]
          var m1 = m.elements[1]
          var m2 = m.elements[2]
          var m3 = m.elements[3]
          var m4 = m.elements[4]
          var m5 = m.elements[5]
          var m6 = m.elements[6]
          var m7 = m.elements[7]
          var m8 = m.elements[8]
          var m9 = m.elements[9]
          var m10 = m.elements[10]
          var m11 = m.elements[11]
          var m12 = m.elements[12]
          var m13 = m.elements[13]
          var m14 = m.elements[14]
          var m15 = m.elements[15]

          var result = []
          result[0] = this0 * m0 + this1 * m4 + this2 * m8 + this3 * m12
          result[1] = this0 * m1 + this1 * m5 + this2 * m9 + this3 * m13
          result[2] = this0 * m2 + this1 * m6 + this2 * m10 + this3 * m14
          result[3] = this0 * m3 + this1 * m7 + this2 * m11 + this3 * m15
          result[4] = this4 * m0 + this5 * m4 + this6 * m8 + this7 * m12
          result[5] = this4 * m1 + this5 * m5 + this6 * m9 + this7 * m13
          result[6] = this4 * m2 + this5 * m6 + this6 * m10 + this7 * m14
          result[7] = this4 * m3 + this5 * m7 + this6 * m11 + this7 * m15
          result[8] = this8 * m0 + this9 * m4 + this10 * m8 + this11 * m12
          result[9] = this8 * m1 + this9 * m5 + this10 * m9 + this11 * m13
          result[10] = this8 * m2 + this9 * m6 + this10 * m10 + this11 * m14
          result[11] = this8 * m3 + this9 * m7 + this10 * m11 + this11 * m15
          result[12] = this12 * m0 + this13 * m4 + this14 * m8 + this15 * m12
          result[13] = this12 * m1 + this13 * m5 + this14 * m9 + this15 * m13
          result[14] = this12 * m2 + this13 * m6 + this14 * m10 + this15 * m14
          result[15] = this12 * m3 + this13 * m7 + this14 * m11 + this15 * m15
          return new Matrix4x4(result)
        },

        clone: function () {
          var elements = this.elements.map(function (p) {
            return p
          })
          return new Matrix4x4(elements)
        },

        // Right multiply the matrix by a Vector3D (interpreted as 3 row, 1 column)
        // (result = M*v)
        // Fourth element is taken as 1
        rightMultiply1x3Vector: function (v) {
          var v0 = v._x
          var v1 = v._y
          var v2 = v._z
          var v3 = 1
          var x = v0 * this.elements[0] + v1 * this.elements[1] + v2 * this.elements[2] + v3 * this.elements[3]
          var y = v0 * this.elements[4] + v1 * this.elements[5] + v2 * this.elements[6] + v3 * this.elements[7]
          var z = v0 * this.elements[8] + v1 * this.elements[9] + v2 * this.elements[10] + v3 * this.elements[11]
          var w = v0 * this.elements[12] + v1 * this.elements[13] + v2 * this.elements[14] + v3 * this.elements[15]
          // scale such that fourth element becomes 1:
          if (w !== 1) {
            var invw = 1.0 / w
            x *= invw
            y *= invw
            z *= invw
          }
          return new Vector3D(x, y, z)
        },

        // Multiply a Vector3D (interpreted as 3 column, 1 row) by this matrix
        // (result = v*M)
        // Fourth element is taken as 1
        leftMultiply1x3Vector: function (v) {
          var v0 = v._x
          var v1 = v._y
          var v2 = v._z
          var v3 = 1
          var x = v0 * this.elements[0] + v1 * this.elements[4] + v2 * this.elements[8] + v3 * this.elements[12]
          var y = v0 * this.elements[1] + v1 * this.elements[5] + v2 * this.elements[9] + v3 * this.elements[13]
          var z = v0 * this.elements[2] + v1 * this.elements[6] + v2 * this.elements[10] + v3 * this.elements[14]
          var w = v0 * this.elements[3] + v1 * this.elements[7] + v2 * this.elements[11] + v3 * this.elements[15]
          // scale such that fourth element becomes 1:
          if (w !== 1) {
            var invw = 1.0 / w
            x *= invw
            y *= invw
            z *= invw
          }
          return new Vector3D(x, y, z)
        },

        // Right multiply the matrix by a Vector2D (interpreted as 2 row, 1 column)
        // (result = M*v)
        // Fourth element is taken as 1
        rightMultiply1x2Vector: function (v) {
          var v0 = v.x
          var v1 = v.y
          var v2 = 0
          var v3 = 1
          var x = v0 * this.elements[0] + v1 * this.elements[1] + v2 * this.elements[2] + v3 * this.elements[3]
          var y = v0 * this.elements[4] + v1 * this.elements[5] + v2 * this.elements[6] + v3 * this.elements[7]
          var z = v0 * this.elements[8] + v1 * this.elements[9] + v2 * this.elements[10] + v3 * this.elements[11]
          var w = v0 * this.elements[12] + v1 * this.elements[13] + v2 * this.elements[14] + v3 * this.elements[15]
          // scale such that fourth element becomes 1:
          if (w !== 1) {
            var invw = 1.0 / w
            x *= invw
            y *= invw
            z *= invw
          }
          return new Vector2D(x, y)
        },

        // Multiply a Vector2D (interpreted as 2 column, 1 row) by this matrix
        // (result = v*M)
        // Fourth element is taken as 1
        leftMultiply1x2Vector: function (v) {
          var v0 = v.x
          var v1 = v.y
          var v2 = 0
          var v3 = 1
          var x = v0 * this.elements[0] + v1 * this.elements[4] + v2 * this.elements[8] + v3 * this.elements[12]
          var y = v0 * this.elements[1] + v1 * this.elements[5] + v2 * this.elements[9] + v3 * this.elements[13]
          var z = v0 * this.elements[2] + v1 * this.elements[6] + v2 * this.elements[10] + v3 * this.elements[14]
          var w = v0 * this.elements[3] + v1 * this.elements[7] + v2 * this.elements[11] + v3 * this.elements[15]
          // scale such that fourth element becomes 1:
          if (w !== 1) {
            var invw = 1.0 / w
            x *= invw
            y *= invw
            z *= invw
          }
          return new Vector2D(x, y)
        },

        // determine whether this matrix is a mirroring transformation
        isMirroring: function () {
          var u = new Vector3D(this.elements[0], this.elements[4], this.elements[8])
          var v = new Vector3D(this.elements[1], this.elements[5], this.elements[9])
          var w = new Vector3D(this.elements[2], this.elements[6], this.elements[10])

          // for a true orthogonal, non-mirrored base, u.cross(v) == w
          // If they have an opposite direction then we are mirroring
          var mirrorvalue = u.cross(v).dot(w)
          var ismirror = (mirrorvalue < 0)
          return ismirror
        }
      }

      // return the unity matrix
      Matrix4x4.unity = function () {
        return new Matrix4x4()
      }

      // Create a rotation matrix for rotating around the x axis
      Matrix4x4.rotationX = function (degrees) {
        var radians = degrees * Math.PI * (1.0 / 180.0)
        var cos = Math.cos(radians)
        var sin = Math.sin(radians)
        var els = [
          1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1
        ]
        return new Matrix4x4(els)
      }

      // Create a rotation matrix for rotating around the y axis
      Matrix4x4.rotationY = function (degrees) {
        var radians = degrees * Math.PI * (1.0 / 180.0)
        var cos = Math.cos(radians)
        var sin = Math.sin(radians)
        var els = [
          cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1
        ]
        return new Matrix4x4(els)
      }

      // Create a rotation matrix for rotating around the z axis
      Matrix4x4.rotationZ = function (degrees) {
        var radians = degrees * Math.PI * (1.0 / 180.0)
        var cos = Math.cos(radians)
        var sin = Math.sin(radians)
        var els = [
          cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
        ]
        return new Matrix4x4(els)
      }

      // Matrix for rotation about arbitrary point and axis
      Matrix4x4.rotation = function (rotationCenter, rotationAxis, degrees) {
        rotationCenter = new Vector3D(rotationCenter)
        rotationAxis = new Vector3D(rotationAxis)
        var rotationPlane = Plane.fromNormalAndPoint(rotationAxis, rotationCenter)
        var orthobasis = new OrthoNormalBasis(rotationPlane)
        var transformation = Matrix4x4.translation(rotationCenter.negated())
        transformation = transformation.multiply(orthobasis.getProjectionMatrix())
        transformation = transformation.multiply(Matrix4x4.rotationZ(degrees))
        transformation = transformation.multiply(orthobasis.getInverseProjectionMatrix())
        transformation = transformation.multiply(Matrix4x4.translation(rotationCenter))
        return transformation
      }

      // Create an affine matrix for translation:
      Matrix4x4.translation = function (v) {
        // parse as Vector3D, so we can pass an array or a Vector3D
        var vec = new Vector3D(v)
        var els = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, vec.x, vec.y, vec.z, 1]
        return new Matrix4x4(els)
      }

      // Create an affine matrix for mirroring into an arbitrary plane:
      Matrix4x4.mirroring = function (plane) {
        var nx = plane.normal.x
        var ny = plane.normal.y
        var nz = plane.normal.z
        var w = plane.w
        var els = [
          (1.0 - 2.0 * nx * nx), (-2.0 * ny * nx), (-2.0 * nz * nx), 0,
          (-2.0 * nx * ny), (1.0 - 2.0 * ny * ny), (-2.0 * nz * ny), 0,
          (-2.0 * nx * nz), (-2.0 * ny * nz), (1.0 - 2.0 * nz * nz), 0,
          (2.0 * nx * w), (2.0 * ny * w), (2.0 * nz * w), 1
        ]
        return new Matrix4x4(els)
      }

      // Create an affine matrix for scaling:
      Matrix4x4.scaling = function (v) {
        // parse as Vector3D, so we can pass an array or a Vector3D
        var vec = new Vector3D(v)
        var els = [
          vec.x, 0, 0, 0, 0, vec.y, 0, 0, 0, 0, vec.z, 0, 0, 0, 0, 1
        ]
        return new Matrix4x4(els)
      }

      module.exports = Matrix4x4

    }, { "./OrthoNormalBasis": 16, "./Plane": 18, "./Vector2": 22, "./Vector3": 23 }], 16: [function (require, module, exports) {
      const Vector2D = require('./Vector2')
      const Vector3D = require('./Vector3')
      const Line2D = require('./Line2')
      const Line3D = require('./Line3')
      const Plane = require('./Plane')

      // # class OrthoNormalBasis
      // Reprojects points on a 3D plane onto a 2D plane
      // or from a 2D plane back onto the 3D plane
      const OrthoNormalBasis = function (plane, rightvector) {
        if (arguments.length < 2) {
          // choose an arbitrary right hand vector, making sure it is somewhat orthogonal to the plane normal:
          rightvector = plane.normal.randomNonParallelVector()
        } else {
          rightvector = new Vector3D(rightvector)
        }
        this.v = plane.normal.cross(rightvector).unit()
        this.u = this.v.cross(plane.normal)
        this.plane = plane
        this.planeorigin = plane.normal.times(plane.w)
      }

      // Get an orthonormal basis for the standard XYZ planes.
      // Parameters: the names of two 3D axes. The 2d x axis will map to the first given 3D axis, the 2d y
      // axis will map to the second.
      // Prepend the axis with a "-" to invert the direction of this axis.
      // For example: OrthoNormalBasis.GetCartesian("-Y","Z")
      //   will return an orthonormal basis where the 2d X axis maps to the 3D inverted Y axis, and
      //   the 2d Y axis maps to the 3D Z axis.
      OrthoNormalBasis.GetCartesian = function (xaxisid, yaxisid) {
        let axisid = xaxisid + '/' + yaxisid
        let planenormal, rightvector
        if (axisid === 'X/Y') {
          planenormal = [0, 0, 1]
          rightvector = [1, 0, 0]
        } else if (axisid === 'Y/-X') {
          planenormal = [0, 0, 1]
          rightvector = [0, 1, 0]
        } else if (axisid === '-X/-Y') {
          planenormal = [0, 0, 1]
          rightvector = [-1, 0, 0]
        } else if (axisid === '-Y/X') {
          planenormal = [0, 0, 1]
          rightvector = [0, -1, 0]
        } else if (axisid === '-X/Y') {
          planenormal = [0, 0, -1]
          rightvector = [-1, 0, 0]
        } else if (axisid === '-Y/-X') {
          planenormal = [0, 0, -1]
          rightvector = [0, -1, 0]
        } else if (axisid === 'X/-Y') {
          planenormal = [0, 0, -1]
          rightvector = [1, 0, 0]
        } else if (axisid === 'Y/X') {
          planenormal = [0, 0, -1]
          rightvector = [0, 1, 0]
        } else if (axisid === 'X/Z') {
          planenormal = [0, -1, 0]
          rightvector = [1, 0, 0]
        } else if (axisid === 'Z/-X') {
          planenormal = [0, -1, 0]
          rightvector = [0, 0, 1]
        } else if (axisid === '-X/-Z') {
          planenormal = [0, -1, 0]
          rightvector = [-1, 0, 0]
        } else if (axisid === '-Z/X') {
          planenormal = [0, -1, 0]
          rightvector = [0, 0, -1]
        } else if (axisid === '-X/Z') {
          planenormal = [0, 1, 0]
          rightvector = [-1, 0, 0]
        } else if (axisid === '-Z/-X') {
          planenormal = [0, 1, 0]
          rightvector = [0, 0, -1]
        } else if (axisid === 'X/-Z') {
          planenormal = [0, 1, 0]
          rightvector = [1, 0, 0]
        } else if (axisid === 'Z/X') {
          planenormal = [0, 1, 0]
          rightvector = [0, 0, 1]
        } else if (axisid === 'Y/Z') {
          planenormal = [1, 0, 0]
          rightvector = [0, 1, 0]
        } else if (axisid === 'Z/-Y') {
          planenormal = [1, 0, 0]
          rightvector = [0, 0, 1]
        } else if (axisid === '-Y/-Z') {
          planenormal = [1, 0, 0]
          rightvector = [0, -1, 0]
        } else if (axisid === '-Z/Y') {
          planenormal = [1, 0, 0]
          rightvector = [0, 0, -1]
        } else if (axisid === '-Y/Z') {
          planenormal = [-1, 0, 0]
          rightvector = [0, -1, 0]
        } else if (axisid === '-Z/-Y') {
          planenormal = [-1, 0, 0]
          rightvector = [0, 0, -1]
        } else if (axisid === 'Y/-Z') {
          planenormal = [-1, 0, 0]
          rightvector = [0, 1, 0]
        } else if (axisid === 'Z/Y') {
          planenormal = [-1, 0, 0]
          rightvector = [0, 0, 1]
        } else {
          throw new Error('OrthoNormalBasis.GetCartesian: invalid combination of axis identifiers. Should pass two string arguments from [X,Y,Z,-X,-Y,-Z], being two different axes.')
        }
        return new OrthoNormalBasis(new Plane(new Vector3D(planenormal), 0), new Vector3D(rightvector))
      }

      /*
      // test code for OrthoNormalBasis.GetCartesian()
      OrthoNormalBasis.GetCartesian_Test=function() {
        let axisnames=["X","Y","Z","-X","-Y","-Z"];
        let axisvectors=[[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]];
        for(let axis1=0; axis1 < 3; axis1++) {
          for(let axis1inverted=0; axis1inverted < 2; axis1inverted++) {
            let axis1name=axisnames[axis1+3*axis1inverted];
            let axis1vector=axisvectors[axis1+3*axis1inverted];
            for(let axis2=0; axis2 < 3; axis2++) {
              if(axis2 != axis1) {
                for(let axis2inverted=0; axis2inverted < 2; axis2inverted++) {
                  let axis2name=axisnames[axis2+3*axis2inverted];
                  let axis2vector=axisvectors[axis2+3*axis2inverted];
                  let orthobasis=OrthoNormalBasis.GetCartesian(axis1name, axis2name);
                  let test1=orthobasis.to3D(new Vector2D([1,0]));
                  let test2=orthobasis.to3D(new Vector2D([0,1]));
                  let expected1=new Vector3D(axis1vector);
                  let expected2=new Vector3D(axis2vector);
                  let d1=test1.distanceTo(expected1);
                  let d2=test2.distanceTo(expected2);
                  if( (d1 > 0.01) || (d2 > 0.01) ) {
                    throw new Error("Wrong!");
        }}}}}}
        throw new Error("OK");
      };
      */

      // The z=0 plane, with the 3D x and y vectors mapped to the 2D x and y vector
      OrthoNormalBasis.Z0Plane = function () {
        let plane = new Plane(new Vector3D([0, 0, 1]), 0)
        return new OrthoNormalBasis(plane, new Vector3D([1, 0, 0]))
      }

      OrthoNormalBasis.prototype = {
        getProjectionMatrix: function () {
          const Matrix4x4 = require('./Matrix4') // FIXME: circular dependencies Matrix=>OrthoNormalBasis => Matrix
          return new Matrix4x4([
            this.u.x, this.v.x, this.plane.normal.x, 0,
            this.u.y, this.v.y, this.plane.normal.y, 0,
            this.u.z, this.v.z, this.plane.normal.z, 0,
            0, 0, -this.plane.w, 1
          ])
        },

        getInverseProjectionMatrix: function () {
          const Matrix4x4 = require('./Matrix4') // FIXME: circular dependencies Matrix=>OrthoNormalBasis => Matrix
          let p = this.plane.normal.times(this.plane.w)
          return new Matrix4x4([
            this.u.x, this.u.y, this.u.z, 0,
            this.v.x, this.v.y, this.v.z, 0,
            this.plane.normal.x, this.plane.normal.y, this.plane.normal.z, 0,
            p.x, p.y, p.z, 1
          ])
        },

        to2D: function (vec3) {
          return new Vector2D(vec3.dot(this.u), vec3.dot(this.v))
        },

        to3D: function (vec2) {
          return this.planeorigin.plus(this.u.times(vec2.x)).plus(this.v.times(vec2.y))
        },

        line3Dto2D: function (line3d) {
          let a = line3d.point
          let b = line3d.direction.plus(a)
          let a2d = this.to2D(a)
          let b2d = this.to2D(b)
          return Line2D.fromPoints(a2d, b2d)
        },

        line2Dto3D: function (line2d) {
          let a = line2d.origin()
          let b = line2d.direction().plus(a)
          let a3d = this.to3D(a)
          let b3d = this.to3D(b)
          return Line3D.fromPoints(a3d, b3d)
        },

        transform: function (matrix4x4) {
          // todo: this may not work properly in case of mirroring
          let newplane = this.plane.transform(matrix4x4)
          let rightpointTransformed = this.u.transform(matrix4x4)
          let originTransformed = new Vector3D(0, 0, 0).transform(matrix4x4)
          let newrighthandvector = rightpointTransformed.minus(originTransformed)
          let newbasis = new OrthoNormalBasis(newplane, newrighthandvector)
          return newbasis
        }
      }

      module.exports = OrthoNormalBasis

    }, { "./Line2": 13, "./Line3": 14, "./Matrix4": 15, "./Plane": 18, "./Vector2": 22, "./Vector3": 23 }], 17: [function (require, module, exports) {
      const Vector2D = require('./Vector2')
      const { EPS, angleEPS } = require('../constants')
      const { parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt, parseOptionAsBool } = require('../optionParsers')
      const { defaultResolution2D } = require('../constants')
      const Vertex = require('./Vertex2')
      const Side = require('./Side')

      /** Class Path2D
       * Represents a series of points, connected by infinitely thin lines.
       * A path can be open or closed, i.e. additional line between first and last points. 
       * The difference between Path2D and CAG is that a path is a 'thin' line, whereas a CAG is an enclosed area. 
       * @constructor
       * @param {Vector2D[]} [points=[]] - list of points
       * @param {boolean} [closed=false] - closer of path
       *
       * @example
       * new CSG.Path2D()
       * new CSG.Path2D([[10,10], [-10,10], [-10,-10], [10,-10]], true) // closed
       */
      const Path2D = function (points, closed) {
        closed = !!closed
        points = points || []
        // re-parse the points into Vector2D
        // and remove any duplicate points
        let prevpoint = null
        if (closed && (points.length > 0)) {
          prevpoint = new Vector2D(points[points.length - 1])
        }
        let newpoints = []
        points.map(function (point) {
          point = new Vector2D(point)
          let skip = false
          if (prevpoint !== null) {
            let distance = point.distanceTo(prevpoint)
            skip = distance < EPS
          }
          if (!skip) newpoints.push(point)
          prevpoint = point
        })
        this.points = newpoints
        this.closed = closed
      }

      /** Construct an arc.
       * @param {Object} [options] - options for construction
       * @param {Vector2D} [options.center=[0,0]] - center of circle
       * @param {Number} [options.radius=1] - radius of circle
       * @param {Number} [options.startangle=0] - starting angle of the arc, in degrees
       * @param {Number} [options.endangle=360] - ending angle of the arc, in degrees
       * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
       * @param {Boolean} [options.maketangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
       * @returns {Path2D} new Path2D object (not closed)
       *
       * @example
       * let path = CSG.Path2D.arc({
       *   center: [5, 5],
       *   radius: 10,
       *   startangle: 90,
       *   endangle: 180,
       *   resolution: 36,
       *   maketangent: true
       * });
       */
      Path2D.arc = function (options) {
        let center = parseOptionAs2DVector(options, 'center', 0)
        let radius = parseOptionAsFloat(options, 'radius', 1)
        let startangle = parseOptionAsFloat(options, 'startangle', 0)
        let endangle = parseOptionAsFloat(options, 'endangle', 360)
        let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
        let maketangent = parseOptionAsBool(options, 'maketangent', false)
        // no need to make multiple turns:
        while (endangle - startangle >= 720) {
          endangle -= 360
        }
        while (endangle - startangle <= -720) {
          endangle += 360
        }
        let points = []
        let point
        let absangledif = Math.abs(endangle - startangle)
        if (absangledif < angleEPS) {
          point = Vector2D.fromAngle(startangle / 180.0 * Math.PI).times(radius)
          points.push(point.plus(center))
        } else {
          let numsteps = Math.floor(resolution * absangledif / 360) + 1
          let edgestepsize = numsteps * 0.5 / absangledif // step size for half a degree
          if (edgestepsize > 0.25) edgestepsize = 0.25
          let numstepsMod = maketangent ? (numsteps + 2) : numsteps
          for (let i = 0; i <= numstepsMod; i++) {
            let step = i
            if (maketangent) {
              step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize
              if (step < 0) step = 0
              if (step > numsteps) step = numsteps
            }
            let angle = startangle + step * (endangle - startangle) / numsteps
            point = Vector2D.fromAngle(angle / 180.0 * Math.PI).times(radius)
            points.push(point.plus(center))
          }
        }
        return new Path2D(points, false)
      }

      Path2D.prototype = {
        concat: function (otherpath) {
          if (this.closed || otherpath.closed) {
            throw new Error('Paths must not be closed')
          }
          let newpoints = this.points.concat(otherpath.points)
          return new Path2D(newpoints)
        },

        /**
         * Get the points that make up the path.
         * note that this is current internal list of points, not an immutable copy.
         * @returns {Vector2[]} array of points the make up the path
         */
        getPoints: function () {
          return this.points;
        },

        /**
         * Append an point to the end of the path.
         * @param {Vector2D} point - point to append
         * @returns {Path2D} new Path2D object (not closed)
         */
        appendPoint: function (point) {
          if (this.closed) {
            throw new Error('Path must not be closed')
          }
          point = new Vector2D(point) // cast to Vector2D
          let newpoints = this.points.concat([point])
          return new Path2D(newpoints)
        },

        /**
         * Append a list of points to the end of the path.
         * @param {Vector2D[]} points - points to append
         * @returns {Path2D} new Path2D object (not closed)
         */
        appendPoints: function (points) {
          if (this.closed) {
            throw new Error('Path must not be closed')
          }
          let newpoints = this.points
          points.forEach(function (point) {
            newpoints.push(new Vector2D(point)) // cast to Vector2D
          })
          return new Path2D(newpoints)
        },

        close: function () {
          return new Path2D(this.points, true)
        },

        /**
         * Determine if the path is a closed or not.
         * @returns {Boolean} true when the path is closed, otherwise false
         */
        isClosed: function () {
          return this.closed
        },

        // Extrude the path by following it with a rectangle (upright, perpendicular to the path direction)
        // Returns a CSG solid
        //   width: width of the extrusion, in the z=0 plane
        //   height: height of the extrusion in the z direction
        //   resolution: number of segments per 360 degrees for the curve in a corner
        rectangularExtrude: function (width, height, resolution) {
          let cag = this.expandToCAG(width / 2, resolution)
          let result = cag.extrude({
            offset: [0, 0, height]
          })
          return result
        },

        // Expand the path to a CAG
        // This traces the path with a circle with radius pathradius
        expandToCAG: function (pathradius, resolution) {
          const CAG = require('../CAG') // FIXME: cyclic dependencies CAG => PATH2 => CAG
          let sides = []
          let numpoints = this.points.length
          let startindex = 0
          if (this.closed && (numpoints > 2)) startindex = -1
          let prevvertex
          for (let i = startindex; i < numpoints; i++) {
            let pointindex = i
            if (pointindex < 0) pointindex = numpoints - 1
            let point = this.points[pointindex]
            let vertex = new Vertex(point)
            if (i > startindex) {
              let side = new Side(prevvertex, vertex)
              sides.push(side)
            }
            prevvertex = vertex
          }
          let shellcag = CAG.fromSides(sides)
          let expanded = shellcag.expandedShell(pathradius, resolution)
          return expanded
        },

        innerToCAG: function () {
          const CAG = require('../CAG') // FIXME: cyclic dependencies CAG => PATH2 => CAG
          if (!this.closed) throw new Error("The path should be closed!");
          return CAG.fromPoints(this.points);
        },

        transform: function (matrix4x4) {
          let newpoints = this.points.map(function (point) {
            return point.multiply4x4(matrix4x4)
          })
          return new Path2D(newpoints, this.closed)
        },

        /**
         * Append a Bezier curve to the end of the path, using the control points to transition the curve through start and end points.
         * <br>
         * The Bézier curve starts at the last point in the path,
         * and ends at the last given control point. Other control points are intermediate control points.
         * <br>
         * The first control point may be null to ensure a smooth transition occurs. In this case,  
         * the second to last control point of the path is mirrored into the control points of the Bezier curve.
         * In other words, the trailing gradient of the path matches the new gradient of the curve. 
         * @param {Vector2D[]} controlpoints - list of control points
         * @param {Object} [options] - options for construction
         * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
         * @returns {Path2D} new Path2D object (not closed)
         *
         * @example
         * let p5 = new CSG.Path2D([[10,-20]],false);
         * p5 = p5.appendBezier([[10,-10],[25,-10],[25,-20]]);
         * p5 = p5.appendBezier([[25,-30],[40,-30],[40,-20]]);
         */
        appendBezier: function (controlpoints, options) {
          if (arguments.length < 2) {
            options = {}
          }
          if (this.closed) {
            throw new Error('Path must not be closed')
          }
          if (!(controlpoints instanceof Array)) {
            throw new Error('appendBezier: should pass an array of control points')
          }
          if (controlpoints.length < 1) {
            throw new Error('appendBezier: need at least 1 control point')
          }
          if (this.points.length < 1) {
            throw new Error('appendBezier: path must already contain a point (the endpoint of the path is used as the starting point for the bezier curve)')
          }
          let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
          if (resolution < 4) resolution = 4
          let factorials = []
          let controlpointsParsed = []
          controlpointsParsed.push(this.points[this.points.length - 1]) // start at the previous end point
          for (let i = 0; i < controlpoints.length; ++i) {
            let p = controlpoints[i]
            if (p === null) {
              // we can pass null as the first control point. In that case a smooth gradient is ensured:
              if (i !== 0) {
                throw new Error('appendBezier: null can only be passed as the first control point')
              }
              if (controlpoints.length < 2) {
                throw new Error('appendBezier: null can only be passed if there is at least one more control point')
              }
              let lastBezierControlPoint
              if ('lastBezierControlPoint' in this) {
                lastBezierControlPoint = this.lastBezierControlPoint
              } else {
                if (this.points.length < 2) {
                  throw new Error('appendBezier: null is passed as a control point but this requires a previous bezier curve or at least two points in the existing path')
                }
                lastBezierControlPoint = this.points[this.points.length - 2]
              }
              // mirror the last bezier control point:
              p = this.points[this.points.length - 1].times(2).minus(lastBezierControlPoint)
            } else {
              p = new Vector2D(p) // cast to Vector2D
            }
            controlpointsParsed.push(p)
          }
          let bezierOrder = controlpointsParsed.length - 1
          let fact = 1
          for (let i = 0; i <= bezierOrder; ++i) {
            if (i > 0) fact *= i
            factorials.push(fact)
          }
          let binomials = []
          for (let i = 0; i <= bezierOrder; ++i) {
            let binomial = factorials[bezierOrder] / (factorials[i] * factorials[bezierOrder - i])
            binomials.push(binomial)
          }
          let getPointForT = function (t) {
            let t_k = 1 // = pow(t,k)
            let one_minus_t_n_minus_k = Math.pow(1 - t, bezierOrder) // = pow( 1-t, bezierOrder - k)
            let inv_1_minus_t = (t !== 1) ? (1 / (1 - t)) : 1
            let point = new Vector2D(0, 0)
            for (let k = 0; k <= bezierOrder; ++k) {
              if (k === bezierOrder) one_minus_t_n_minus_k = 1
              let bernstein_coefficient = binomials[k] * t_k * one_minus_t_n_minus_k
              point = point.plus(controlpointsParsed[k].times(bernstein_coefficient))
              t_k *= t
              one_minus_t_n_minus_k *= inv_1_minus_t
            }
            return point
          }
          let newpoints = []
          let newpoints_t = []
          let numsteps = bezierOrder + 1
          for (let i = 0; i < numsteps; ++i) {
            let t = i / (numsteps - 1)
            let point = getPointForT(t)
            newpoints.push(point)
            newpoints_t.push(t)
          }
          // subdivide each segment until the angle at each vertex becomes small enough:
          let subdivideBase = 1
          let maxangle = Math.PI * 2 / resolution // segments may have differ no more in angle than this
          let maxsinangle = Math.sin(maxangle)
          while (subdivideBase < newpoints.length - 1) {
            let dir1 = newpoints[subdivideBase].minus(newpoints[subdivideBase - 1]).unit()
            let dir2 = newpoints[subdivideBase + 1].minus(newpoints[subdivideBase]).unit()
            let sinangle = dir1.cross(dir2) // this is the sine of the angle
            if (Math.abs(sinangle) > maxsinangle) {
              // angle is too big, we need to subdivide
              let t0 = newpoints_t[subdivideBase - 1]
              let t1 = newpoints_t[subdivideBase + 1]
              let t0_new = t0 + (t1 - t0) * 1 / 3
              let t1_new = t0 + (t1 - t0) * 2 / 3
              let point0_new = getPointForT(t0_new)
              let point1_new = getPointForT(t1_new)
              // remove the point at subdivideBase and replace with 2 new points:
              newpoints.splice(subdivideBase, 1, point0_new, point1_new)
              newpoints_t.splice(subdivideBase, 1, t0_new, t1_new)
              // re - evaluate the angles, starting at the previous junction since it has changed:
              subdivideBase--
              if (subdivideBase < 1) subdivideBase = 1
            } else {
              ++subdivideBase
            }
          }
          // append to the previous points, but skip the first new point because it is identical to the last point:
          newpoints = this.points.concat(newpoints.slice(1))
          let result = new Path2D(newpoints)
          result.lastBezierControlPoint = controlpointsParsed[controlpointsParsed.length - 2]
          return result
        },


        /**
         * Append an arc to the end of the path.
         * This implementation follows the SVG arc specs. For the details see
         * http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
         * @param {Vector2D} endpoint - end point of arc
         * @param {Object} [options] - options for construction
         * @param {Number} [options.radius=0] - radius of arc (X and Y), see also xradius and yradius
         * @param {Number} [options.xradius=0] - X radius of arc, see also radius
         * @param {Number} [options.yradius=0] - Y radius of arc, see also radius
         * @param {Number} [options.xaxisrotation=0] -  rotation (in degrees) of the X axis of the arc with respect to the X axis of the coordinate system
         * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
         * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point
         * @param {Boolean} [options.large=false] - draw an arc longer than 180 degrees
         * @returns {Path2D} new Path2D object (not closed)
         *
         * @example
         * let p1 = new CSG.Path2D([[27.5,-22.96875]],false);
         * p1 = p1.appendPoint([27.5,-3.28125]);
         * p1 = p1.appendArc([12.5,-22.96875],{xradius: 15,yradius: -19.6875,xaxisrotation: 0,clockwise: false,large: false});
         * p1 = p1.close();
         */
        appendArc: function (endpoint, options) {
          let decimals = 100000
          if (arguments.length < 2) {
            options = {}
          }
          if (this.closed) {
            throw new Error('Path must not be closed')
          }
          if (this.points.length < 1) {
            throw new Error('appendArc: path must already contain a point (the endpoint of the path is used as the starting point for the arc)')
          }
          let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
          if (resolution < 4) resolution = 4
          let xradius, yradius
          if (('xradius' in options) || ('yradius' in options)) {
            if ('radius' in options) {
              throw new Error('Should either give an xradius and yradius parameter, or a radius parameter')
            }
            xradius = parseOptionAsFloat(options, 'xradius', 0)
            yradius = parseOptionAsFloat(options, 'yradius', 0)
          } else {
            xradius = parseOptionAsFloat(options, 'radius', 0)
            yradius = xradius
          }
          let xaxisrotation = parseOptionAsFloat(options, 'xaxisrotation', 0)
          let clockwise = parseOptionAsBool(options, 'clockwise', false)
          let largearc = parseOptionAsBool(options, 'large', false)
          let startpoint = this.points[this.points.length - 1]
          endpoint = new Vector2D(endpoint)
          // round to precision in order to have determinate calculations
          xradius = Math.round(xradius * decimals) / decimals
          yradius = Math.round(yradius * decimals) / decimals
          endpoint = new Vector2D(Math.round(endpoint.x * decimals) / decimals, Math.round(endpoint.y * decimals) / decimals)

          let sweepFlag = !clockwise
          let newpoints = []
          if ((xradius === 0) || (yradius === 0)) {
            // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes:
            // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop
            newpoints.push(endpoint)
          } else {
            xradius = Math.abs(xradius)
            yradius = Math.abs(yradius)

            // see http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes :
            let phi = xaxisrotation * Math.PI / 180.0
            let cosphi = Math.cos(phi)
            let sinphi = Math.sin(phi)
            let minushalfdistance = startpoint.minus(endpoint).times(0.5)
            // F.6.5.1:
            // round to precision in order to have determinate calculations
            let x = Math.round((cosphi * minushalfdistance.x + sinphi * minushalfdistance.y) * decimals) / decimals
            let y = Math.round((-sinphi * minushalfdistance.x + cosphi * minushalfdistance.y) * decimals) / decimals
            let startTranslated = new Vector2D(x, y)
            // F.6.6.2:
            let biglambda = (startTranslated.x * startTranslated.x) / (xradius * xradius) + (startTranslated.y * startTranslated.y) / (yradius * yradius)
            if (biglambda > 1.0) {
              // F.6.6.3:
              let sqrtbiglambda = Math.sqrt(biglambda)
              xradius *= sqrtbiglambda
              yradius *= sqrtbiglambda
              // round to precision in order to have determinate calculations
              xradius = Math.round(xradius * decimals) / decimals
              yradius = Math.round(yradius * decimals) / decimals
            }
            // F.6.5.2:
            let multiplier1 = Math.sqrt((xradius * xradius * yradius * yradius - xradius * xradius * startTranslated.y * startTranslated.y - yradius * yradius * startTranslated.x * startTranslated.x) / (xradius * xradius * startTranslated.y * startTranslated.y + yradius * yradius * startTranslated.x * startTranslated.x))
            if (sweepFlag === largearc) multiplier1 = -multiplier1
            let centerTranslated = new Vector2D(xradius * startTranslated.y / yradius, -yradius * startTranslated.x / xradius).times(multiplier1)
            // F.6.5.3:
            let center = new Vector2D(cosphi * centerTranslated.x - sinphi * centerTranslated.y, sinphi * centerTranslated.x + cosphi * centerTranslated.y).plus((startpoint.plus(endpoint)).times(0.5))
            // F.6.5.5:
            let vec1 = new Vector2D((startTranslated.x - centerTranslated.x) / xradius, (startTranslated.y - centerTranslated.y) / yradius)
            let vec2 = new Vector2D((-startTranslated.x - centerTranslated.x) / xradius, (-startTranslated.y - centerTranslated.y) / yradius)
            let theta1 = vec1.angleRadians()
            let theta2 = vec2.angleRadians()
            let deltatheta = theta2 - theta1
            deltatheta = deltatheta % (2 * Math.PI)
            if ((!sweepFlag) && (deltatheta > 0)) {
              deltatheta -= 2 * Math.PI
            } else if ((sweepFlag) && (deltatheta < 0)) {
              deltatheta += 2 * Math.PI
            }

            // Ok, we have the center point and angle range (from theta1, deltatheta radians) so we can create the ellipse
            let numsteps = Math.ceil(Math.abs(deltatheta) / (2 * Math.PI) * resolution) + 1
            if (numsteps < 1) numsteps = 1
            for (let step = 1; step <= numsteps; step++) {
              let theta = theta1 + step / numsteps * deltatheta
              let costheta = Math.cos(theta)
              let sintheta = Math.sin(theta)
              // F.6.3.1:
              let point = new Vector2D(cosphi * xradius * costheta - sinphi * yradius * sintheta, sinphi * xradius * costheta + cosphi * yradius * sintheta).plus(center)
              newpoints.push(point)
            }
          }
          newpoints = this.points.concat(newpoints)
          let result = new Path2D(newpoints)
          return result
        }
      }

      module.exports = Path2D

    }, { "../CAG": 2, "../constants": 11, "../optionParsers": 29, "./Side": 21, "./Vector2": 22, "./Vertex2": 24 }], 18: [function (require, module, exports) {
      const Vector3D = require('./Vector3')
      const Line3D = require('./Line3')
      const { EPS, getTag } = require('../constants')

      // # class Plane
      // Represents a plane in 3D space.
      const Plane = function (normal, w) {
        this.normal = normal
        this.w = w
      }

      // create from an untyped object with identical property names:
      Plane.fromObject = function (obj) {
        let normal = new Vector3D(obj.normal)
        let w = parseFloat(obj.w)
        return new Plane(normal, w)
      }

      Plane.fromVector3Ds = function (a, b, c) {
        let n = b.minus(a).cross(c.minus(a)).unit()
        return new Plane(n, n.dot(a))
      }

      // like fromVector3Ds, but allow the vectors to be on one point or one line
      // in such a case a random plane through the given points is constructed
      Plane.anyPlaneFromVector3Ds = function (a, b, c) {
        let v1 = b.minus(a)
        let v2 = c.minus(a)
        if (v1.length() < EPS) {
          v1 = v2.randomNonParallelVector()
        }
        if (v2.length() < EPS) {
          v2 = v1.randomNonParallelVector()
        }
        let normal = v1.cross(v2)
        if (normal.length() < EPS) {
          // this would mean that v1 == v2.negated()
          v2 = v1.randomNonParallelVector()
          normal = v1.cross(v2)
        }
        normal = normal.unit()
        return new Plane(normal, normal.dot(a))
      }

      Plane.fromPoints = function (a, b, c) {
        a = new Vector3D(a)
        b = new Vector3D(b)
        c = new Vector3D(c)
        return Plane.fromVector3Ds(a, b, c)
      }

      Plane.fromNormalAndPoint = function (normal, point) {
        normal = new Vector3D(normal)
        point = new Vector3D(point)
        normal = normal.unit()
        let w = point.dot(normal)
        return new Plane(normal, w)
      }

      Plane.prototype = {
        flipped: function () {
          return new Plane(this.normal.negated(), -this.w)
        },

        getTag: function () {
          let result = this.tag
          if (!result) {
            result = getTag()
            this.tag = result
          }
          return result
        },

        equals: function (n) {
          return this.normal.equals(n.normal) && this.w === n.w
        },

        transform: function (matrix4x4) {
          let ismirror = matrix4x4.isMirroring()
          // get two vectors in the plane:
          let r = this.normal.randomNonParallelVector()
          let u = this.normal.cross(r)
          let v = this.normal.cross(u)
          // get 3 points in the plane:
          let point1 = this.normal.times(this.w)
          let point2 = point1.plus(u)
          let point3 = point1.plus(v)
          // transform the points:
          point1 = point1.multiply4x4(matrix4x4)
          point2 = point2.multiply4x4(matrix4x4)
          point3 = point3.multiply4x4(matrix4x4)
          // and create a new plane from the transformed points:
          let newplane = Plane.fromVector3Ds(point1, point2, point3)
          if (ismirror) {
            // the transform is mirroring
            // We should mirror the plane:
            newplane = newplane.flipped()
          }
          return newplane
        },

        // robust splitting of a line by a plane
        // will work even if the line is parallel to the plane
        splitLineBetweenPoints: function (p1, p2) {
          let direction = p2.minus(p1)
          let labda = (this.w - this.normal.dot(p1)) / this.normal.dot(direction)
          if (isNaN(labda)) labda = 0
          if (labda > 1) labda = 1
          if (labda < 0) labda = 0
          let result = p1.plus(direction.times(labda))
          return result
        },

        // returns Vector3D
        intersectWithLine: function (line3d) {
          return line3d.intersectWithPlane(this)
        },

        // intersection of two planes
        intersectWithPlane: function (plane) {
          return Line3D.fromPlanes(this, plane)
        },

        signedDistanceToPoint: function (point) {
          let t = this.normal.dot(point) - this.w
          return t
        },

        toString: function () {
          return '[normal: ' + this.normal.toString() + ', w: ' + this.w + ']'
        },

        mirrorPoint: function (point3d) {
          let distance = this.signedDistanceToPoint(point3d)
          let mirrored = point3d.minus(this.normal.times(distance * 2.0))
          return mirrored
        }
      }

      module.exports = Plane

    }, { "../constants": 11, "./Line3": 14, "./Vector3": 23 }], 19: [function (require, module, exports) {
      const CAG = require('../CAG')

      /*
      2D polygons are now supported through the CAG class.
      With many improvements (see documentation):
        - shapes do no longer have to be convex
        - union/intersect/subtract is supported
        - expand / contract are supported
      
      But we'll keep CSG.Polygon2D as a stub for backwards compatibility
      */
      function Polygon2D(points) {
        const cag = CAG.fromPoints(points)
        this.sides = cag.sides
      }

      Polygon2D.prototype = CAG.prototype

      module.exports = Polygon2D

    }, { "../CAG": 2 }], 20: [function (require, module, exports) {
      const Vector3D = require('./Vector3')
      const Vertex = require('./Vertex3')
      const Matrix4x4 = require('./Matrix4')
      const { _CSGDEBUG, EPS, getTag, areaEPS } = require('../constants')
      const { fnSortByIndex } = require('../utils')

      /** Class Polygon
       * Represents a convex polygon. The vertices used to initialize a polygon must
       *   be coplanar and form a convex loop. They do not have to be `Vertex`
       *   instances but they must behave similarly (duck typing can be used for
       *   customization).
       * <br>
       * Each convex polygon has a `shared` property, which is shared between all
       *   polygons that are clones of each other or were split from the same polygon.
       *   This can be used to define per-polygon properties (such as surface color).
       * <br>
       * The plane of the polygon is calculated from the vertex coordinates if not provided.
       *   The plane can alternatively be passed as the third argument to avoid calculations.
       *
       * @constructor
       * @param {Vertex[]} vertices - list of vertices
       * @param {Polygon.Shared} [shared=defaultShared] - shared property to apply
       * @param {Plane} [plane] - plane of the polygon
       *
       * @example
       * const vertices = [
       *   new CSG.Vertex(new CSG.Vector3D([0, 0, 0])),
       *   new CSG.Vertex(new CSG.Vector3D([0, 10, 0])),
       *   new CSG.Vertex(new CSG.Vector3D([0, 10, 10]))
       * ]
       * let observed = new Polygon(vertices)
       */
      let Polygon = function (vertices, shared, plane) {
        this.vertices = vertices
        if (!shared) shared = Polygon.defaultShared
        this.shared = shared
        // let numvertices = vertices.length;

        if (arguments.length >= 3) {
          this.plane = plane
        } else {
          const Plane = require('./Plane') // FIXME: circular dependencies
          this.plane = Plane.fromVector3Ds(vertices[0].pos, vertices[1].pos, vertices[2].pos)
        }

        if (_CSGDEBUG) {
          if (!this.checkIfConvex()) {
            throw new Error('Not convex!')
          }
        }
      }

      // create from an untyped object with identical property names:
      Polygon.fromObject = function (obj) {
        const Plane = require('./Plane') // FIXME: circular dependencies
        let vertices = obj.vertices.map(function (v) {
          return Vertex.fromObject(v)
        })
        let shared = Polygon.Shared.fromObject(obj.shared)
        let plane = Plane.fromObject(obj.plane)
        return new Polygon(vertices, shared, plane)
      }

      Polygon.prototype = {
        /** Check whether the polygon is convex. (it should be, otherwise we will get unexpected results)
         * @returns {boolean}
         */
        checkIfConvex: function () {
          return Polygon.verticesConvex(this.vertices, this.plane.normal)
        },

        // FIXME what? why does this return this, and not a new polygon?
        // FIXME is this used?
        setColor: function (args) {
          let newshared = Polygon.Shared.fromColor.apply(this, arguments)
          this.shared = newshared
          return this
        },

        getSignedVolume: function () {
          let signedVolume = 0
          for (let i = 0; i < this.vertices.length - 2; i++) {
            signedVolume += this.vertices[0].pos.dot(this.vertices[i + 1].pos
              .cross(this.vertices[i + 2].pos))
          }
          signedVolume /= 6
          return signedVolume
        },

        // Note: could calculate vectors only once to speed up
        getArea: function () {
          let polygonArea = 0
          for (let i = 0; i < this.vertices.length - 2; i++) {
            polygonArea += this.vertices[i + 1].pos.minus(this.vertices[0].pos)
              .cross(this.vertices[i + 2].pos.minus(this.vertices[i + 1].pos)).length()
          }
          polygonArea /= 2
          return polygonArea
        },

        // accepts array of features to calculate
        // returns array of results
        getTetraFeatures: function (features) {
          let result = []
          features.forEach(function (feature) {
            if (feature === 'volume') {
              result.push(this.getSignedVolume())
            } else if (feature === 'area') {
              result.push(this.getArea())
            }
          }, this)
          return result
        },

        // Extrude a polygon into the direction offsetvector
        // Returns a CSG object
        extrude: function (offsetvector) {
          const CSG = require('../CSG') // because of circular dependencies

          let newpolygons = []

          let polygon1 = this
          let direction = polygon1.plane.normal.dot(offsetvector)
          if (direction > 0) {
            polygon1 = polygon1.flipped()
          }
          newpolygons.push(polygon1)
          let polygon2 = polygon1.translate(offsetvector)
          let numvertices = this.vertices.length
          for (let i = 0; i < numvertices; i++) {
            let sidefacepoints = []
            let nexti = (i < (numvertices - 1)) ? i + 1 : 0
            sidefacepoints.push(polygon1.vertices[i].pos)
            sidefacepoints.push(polygon2.vertices[i].pos)
            sidefacepoints.push(polygon2.vertices[nexti].pos)
            sidefacepoints.push(polygon1.vertices[nexti].pos)
            let sidefacepolygon = Polygon.createFromPoints(sidefacepoints, this.shared)
            newpolygons.push(sidefacepolygon)
          }
          polygon2 = polygon2.flipped()
          newpolygons.push(polygon2)
          return CSG.fromPolygons(newpolygons)
        },

        translate: function (offset) {
          return this.transform(Matrix4x4.translation(offset))
        },

        // returns an array with a Vector3D (center point) and a radius
        boundingSphere: function () {
          if (!this.cachedBoundingSphere) {
            let box = this.boundingBox()
            let middle = box[0].plus(box[1]).times(0.5)
            let radius3 = box[1].minus(middle)
            let radius = radius3.length()
            this.cachedBoundingSphere = [middle, radius]
          }
          return this.cachedBoundingSphere
        },

        // returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
        boundingBox: function () {
          if (!this.cachedBoundingBox) {
            let minpoint, maxpoint
            let vertices = this.vertices
            let numvertices = vertices.length
            if (numvertices === 0) {
              minpoint = new Vector3D(0, 0, 0)
            } else {
              minpoint = vertices[0].pos
            }
            maxpoint = minpoint
            for (let i = 1; i < numvertices; i++) {
              let point = vertices[i].pos
              minpoint = minpoint.min(point)
              maxpoint = maxpoint.max(point)
            }
            this.cachedBoundingBox = [minpoint, maxpoint]
          }
          return this.cachedBoundingBox
        },

        flipped: function () {
          let newvertices = this.vertices.map(function (v) {
            return v.flipped()
          })
          newvertices.reverse()
          let newplane = this.plane.flipped()
          return new Polygon(newvertices, this.shared, newplane)
        },

        // Affine transformation of polygon. Returns a new Polygon
        transform: function (matrix4x4) {
          let newvertices = this.vertices.map(function (v) {
            return v.transform(matrix4x4)
          })
          let newplane = this.plane.transform(matrix4x4)
          if (matrix4x4.isMirroring()) {
            // need to reverse the vertex order
            // in order to preserve the inside/outside orientation:
            newvertices.reverse()
          }
          return new Polygon(newvertices, this.shared, newplane)
        },

        toString: function () {
          let result = 'Polygon plane: ' + this.plane.toString() + '\n'
          this.vertices.map(function (vertex) {
            result += '  ' + vertex.toString() + '\n'
          })
          return result
        },

        // project the 3D polygon onto a plane
        projectToOrthoNormalBasis: function (orthobasis) {
          const CAG = require('../CAG')
          const { fromPointsNoCheck } = require('../CAGFactories') // circular dependencies
          let points2d = this.vertices.map(function (vertex) {
            return orthobasis.to2D(vertex.pos)
          })

          let result = fromPointsNoCheck(points2d)
          let area = result.area()
          if (Math.abs(area) < areaEPS) {
            // the polygon was perpendicular to the orthnormal plane. The resulting 2D polygon would be degenerate
            // return an empty area instead:
            result = new CAG()
          } else if (area < 0) {
            result = result.flipped()
          }
          return result
        },

        //FIXME: WHY is this for 3D polygons and not for 2D shapes ?
        /**
         * Creates solid from slices (Polygon) by generating walls
         * @param {Object} options Solid generating options
         *  - numslices {Number} Number of slices to be generated
         *  - callback(t, slice) {Function} Callback function generating slices.
         *          arguments: t = [0..1], slice = [0..numslices - 1]
         *          return: Polygon or null to skip
         *  - loop {Boolean} no flats, only walls, it's used to generate solids like a tor
         */
        solidFromSlices: function (options) {
          const CSG = require('../CSG')

          let polygons = [],
            csg = null,
            prev = null,
            bottom = null,
            top = null,
            numSlices = 2,
            bLoop = false,
            fnCallback,
            flipped = null

          if (options) {
            bLoop = Boolean(options['loop'])

            if (options.numslices) { numSlices = options.numslices }

            if (options.callback) {
              fnCallback = options.callback
            }
          }
          if (!fnCallback) {
            let square = new Polygon.createFromPoints([
              [0, 0, 0],
              [1, 0, 0],
              [1, 1, 0],
              [0, 1, 0]
            ])
            fnCallback = function (t, slice) {
              return t === 0 || t === 1 ? square.translate([0, 0, t]) : null
            }
          }
          for (let i = 0, iMax = numSlices - 1; i <= iMax; i++) {
            csg = fnCallback.call(this, i / iMax, i)
            if (csg) {
              if (!(csg instanceof Polygon)) {
                throw new Error('Polygon.solidFromSlices callback error: Polygon expected')
              }
              csg.checkIfConvex()

              if (prev) { // generate walls
                if (flipped === null) { // not generated yet
                  flipped = prev.plane.signedDistanceToPoint(csg.vertices[0].pos) < 0
                }
                this._addWalls(polygons, prev, csg, flipped)
              } else { // the first - will be a bottom
                bottom = csg
              }
              prev = csg
            } // callback can return null to skip that slice
          }
          top = csg

          if (bLoop) {
            let bSameTopBottom = bottom.vertices.length === top.vertices.length &&
              bottom.vertices.every(function (v, index) {
                return v.pos.equals(top.vertices[index].pos)
              })
            // if top and bottom are not the same -
            // generate walls between them
            if (!bSameTopBottom) {
              this._addWalls(polygons, top, bottom, flipped)
            } // else - already generated
          } else {
            // save top and bottom
            // TODO: flip if necessary
            polygons.unshift(flipped ? bottom : bottom.flipped())
            polygons.push(flipped ? top.flipped() : top)
          }
          return CSG.fromPolygons(polygons)
        },
        /**
         *
         * @param walls Array of wall polygons
         * @param bottom Bottom polygon
         * @param top Top polygon
         */
        _addWalls: function (walls, bottom, top, bFlipped) {
          let bottomPoints = bottom.vertices.slice(0) // make a copy
          let topPoints = top.vertices.slice(0) // make a copy
          let color = top.shared || null

          // check if bottom perimeter is closed
          if (!bottomPoints[0].pos.equals(bottomPoints[bottomPoints.length - 1].pos)) {
            bottomPoints.push(bottomPoints[0])
          }

          // check if top perimeter is closed
          if (!topPoints[0].pos.equals(topPoints[topPoints.length - 1].pos)) {
            topPoints.push(topPoints[0])
          }
          if (bFlipped) {
            bottomPoints = bottomPoints.reverse()
            topPoints = topPoints.reverse()
          }

          let iTopLen = topPoints.length - 1
          let iBotLen = bottomPoints.length - 1
          let iExtra = iTopLen - iBotLen// how many extra triangles we need
          let bMoreTops = iExtra > 0
          let bMoreBottoms = iExtra < 0

          let aMin = [] // indexes to start extra triangles (polygon with minimal square)
          // init - we need exactly /iExtra/ small triangles
          for (let i = Math.abs(iExtra); i > 0; i--) {
            aMin.push({
              len: Infinity,
              index: -1
            })
          }

          let len
          if (bMoreBottoms) {
            for (let i = 0; i < iBotLen; i++) {
              len = bottomPoints[i].pos.distanceToSquared(bottomPoints[i + 1].pos)
              // find the element to replace
              for (let j = aMin.length - 1; j >= 0; j--) {
                if (aMin[j].len > len) {
                  aMin[j].len = len
                  aMin.index = j
                  break
                }
              } // for
            }
          } else if (bMoreTops) {
            for (let i = 0; i < iTopLen; i++) {
              len = topPoints[i].pos.distanceToSquared(topPoints[i + 1].pos)
              // find the element to replace
              for (let j = aMin.length - 1; j >= 0; j--) {
                if (aMin[j].len > len) {
                  aMin[j].len = len
                  aMin.index = j
                  break
                }
              } // for
            }
          } // if
          // sort by index
          aMin.sort(fnSortByIndex)
          let getTriangle = function addWallsPutTriangle(pointA, pointB, pointC, color) {
            return new Polygon([pointA, pointB, pointC], color)
            // return bFlipped ? triangle.flipped() : triangle;
          }

          let bpoint = bottomPoints[0]
          let tpoint = topPoints[0]
          let secondPoint
          let nBotFacet
          let nTopFacet // length of triangle facet side
          for (let iB = 0, iT = 0, iMax = iTopLen + iBotLen; iB + iT < iMax;) {
            if (aMin.length) {
              if (bMoreTops && iT === aMin[0].index) { // one vertex is on the bottom, 2 - on the top
                secondPoint = topPoints[++iT]
                // console.log('<<< extra top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
                walls.push(getTriangle(
                  secondPoint, tpoint, bpoint, color
                ))
                tpoint = secondPoint
                aMin.shift()
                continue
              } else if (bMoreBottoms && iB === aMin[0].index) {
                secondPoint = bottomPoints[++iB]
                walls.push(getTriangle(
                  tpoint, bpoint, secondPoint, color
                ))
                bpoint = secondPoint
                aMin.shift()
                continue
              }
            }
            // choose the shortest path
            if (iB < iBotLen) { // one vertex is on the top, 2 - on the bottom
              nBotFacet = tpoint.pos.distanceToSquared(bottomPoints[iB + 1].pos)
            } else {
              nBotFacet = Infinity
            }
            if (iT < iTopLen) { // one vertex is on the bottom, 2 - on the top
              nTopFacet = bpoint.pos.distanceToSquared(topPoints[iT + 1].pos)
            } else {
              nTopFacet = Infinity
            }
            if (nBotFacet <= nTopFacet) {
              secondPoint = bottomPoints[++iB]
              walls.push(getTriangle(
                tpoint, bpoint, secondPoint, color
              ))
              bpoint = secondPoint
            } else if (iT < iTopLen) { // nTopFacet < Infinity
              secondPoint = topPoints[++iT]
              // console.log('<<< top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
              walls.push(getTriangle(
                secondPoint, tpoint, bpoint, color
              ))
              tpoint = secondPoint
            };
          }
          return walls
        }
      }

      Polygon.verticesConvex = function (vertices, planenormal) {
        let numvertices = vertices.length
        if (numvertices > 2) {
          let prevprevpos = vertices[numvertices - 2].pos
          let prevpos = vertices[numvertices - 1].pos
          for (let i = 0; i < numvertices; i++) {
            let pos = vertices[i].pos
            if (!Polygon.isConvexPoint(prevprevpos, prevpos, pos, planenormal)) {
              return false
            }
            prevprevpos = prevpos
            prevpos = pos
          }
        }
        return true
      }

      /** Create a polygon from the given points.
       *
       * @param {Array[]} points - list of points
       * @param {Polygon.Shared} [shared=defaultShared] - shared property to apply
       * @param {Plane} [plane] - plane of the polygon
       *
       * @example
       * const points = [
       *   [0,  0, 0],
       *   [0, 10, 0],
       *   [0, 10, 10]
       * ]
       * let observed = CSG.Polygon.createFromPoints(points)
       */
      Polygon.createFromPoints = function (points, shared, plane) {
        let vertices = []
        points.map(function (p) {
          let vec = new Vector3D(p)
          let vertex = new Vertex(vec)
          vertices.push(vertex)
        })
        let polygon
        if (arguments.length < 3) {
          polygon = new Polygon(vertices, shared)
        } else {
          polygon = new Polygon(vertices, shared, plane)
        }
        return polygon
      }

      // calculate whether three points form a convex corner
      //  prevpoint, point, nextpoint: the 3 coordinates (Vector3D instances)
      //  normal: the normal vector of the plane
      Polygon.isConvexPoint = function (prevpoint, point, nextpoint, normal) {
        let crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point))
        let crossdotnormal = crossproduct.dot(normal)
        return (crossdotnormal >= 0)
      }

      Polygon.isStrictlyConvexPoint = function (prevpoint, point, nextpoint, normal) {
        let crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point))
        let crossdotnormal = crossproduct.dot(normal)
        return (crossdotnormal >= EPS)
      }

      /** Class Polygon.Shared
       * Holds the shared properties for each polygon (Currently only color).
       * @constructor
       * @param {Array[]} color - array containing RGBA values, or null
       *
       * @example
       *   let shared = new CSG.Polygon.Shared([0, 0, 0, 1])
       */
      Polygon.Shared = function (color) {
        if (color !== null) {
          if (color.length !== 4) {
            throw new Error('Expecting 4 element array')
          }
        }
        this.color = color
      }

      Polygon.Shared.fromObject = function (obj) {
        return new Polygon.Shared(obj.color)
      }

      /** Create Polygon.Shared from color values.
       * @param {number} r - value of RED component
       * @param {number} g - value of GREEN component
       * @param {number} b - value of BLUE component
       * @param {number} [a] - value of ALPHA component
       * @param {Array[]} [color] - OR array containing RGB values (optional Alpha)
       *
       * @example
       * let s1 = Polygon.Shared.fromColor(0,0,0)
       * let s2 = Polygon.Shared.fromColor([0,0,0,1])
       */
      Polygon.Shared.fromColor = function (args) {
        let color
        if (arguments.length === 1) {
          color = arguments[0].slice() // make deep copy
        } else {
          color = []
          for (let i = 0; i < arguments.length; i++) {
            color.push(arguments[i])
          }
        }
        if (color.length === 3) {
          color.push(1)
        } else if (color.length !== 4) {
          throw new Error('setColor expects either an array with 3 or 4 elements, or 3 or 4 parameters.')
        }
        return new Polygon.Shared(color)
      }

      Polygon.Shared.prototype = {
        getTag: function () {
          let result = this.tag
          if (!result) {
            result = getTag()
            this.tag = result
          }
          return result
        },
        // get a string uniquely identifying this object
        getHash: function () {
          if (!this.color) return 'null'
          return this.color.join('/')
        }
      }

      Polygon.defaultShared = new Polygon.Shared(null)

      module.exports = Polygon

    }, { "../CAG": 2, "../CAGFactories": 3, "../CSG": 4, "../constants": 11, "../utils": 33, "./Matrix4": 15, "./Plane": 18, "./Vector3": 23, "./Vertex3": 25 }], 21: [function (require, module, exports) {
      const Vector2D = require('./Vector2')
      const Vertex = require('./Vertex2')
      const Vertex3 = require('./Vertex3')
      const Polygon = require('./Polygon3')
      const { getTag } = require('../constants')

      const Side = function (vertex0, vertex1) {
        if (!(vertex0 instanceof Vertex)) throw new Error('Assertion failed')
        if (!(vertex1 instanceof Vertex)) throw new Error('Assertion failed')
        this.vertex0 = vertex0
        this.vertex1 = vertex1
      }

      Side.fromObject = function (obj) {
        var vertex0 = Vertex.fromObject(obj.vertex0)
        var vertex1 = Vertex.fromObject(obj.vertex1)
        return new Side(vertex0, vertex1)
      }

      Side._fromFakePolygon = function (polygon) {
        // this can happen based on union, seems to be residuals -
        // return null and handle in caller
        if (polygon.vertices.length < 4) {
          return null
        }
        var vert1Indices = []
        var pts2d = polygon.vertices.filter(function (v, i) {
          if (v.pos.z > 0) {
            vert1Indices.push(i)
            return true
          }
          return false
        })
          .map(function (v) {
            return new Vector2D(v.pos.x, v.pos.y)
          })
        if (pts2d.length !== 2) {
          throw new Error('Assertion failed: _fromFakePolygon: not enough points found')
        }
        var d = vert1Indices[1] - vert1Indices[0]
        if (d === 1 || d === 3) {
          if (d === 1) {
            pts2d.reverse()
          }
        } else {
          throw new Error('Assertion failed: _fromFakePolygon: unknown index ordering')
        }
        var result = new Side(new Vertex(pts2d[0]), new Vertex(pts2d[1]))
        return result
      }

      Side.prototype = {
        toString: function () {
          return this.vertex0 + ' -> ' + this.vertex1
        },

        toPolygon3D: function (z0, z1) {
          //console.log(this.vertex0.pos)
          const vertices = [
            new Vertex3(this.vertex0.pos.toVector3D(z0)),
            new Vertex3(this.vertex1.pos.toVector3D(z0)),
            new Vertex3(this.vertex1.pos.toVector3D(z1)),
            new Vertex3(this.vertex0.pos.toVector3D(z1))
          ]
          return new Polygon(vertices)
        },

        transform: function (matrix4x4) {
          var newp1 = this.vertex0.pos.transform(matrix4x4)
          var newp2 = this.vertex1.pos.transform(matrix4x4)
          return new Side(new Vertex(newp1), new Vertex(newp2))
        },

        flipped: function () {
          return new Side(this.vertex1, this.vertex0)
        },

        direction: function () {
          return this.vertex1.pos.minus(this.vertex0.pos)
        },

        getTag: function () {
          var result = this.tag
          if (!result) {
            result = getTag()
            this.tag = result
          }
          return result
        },

        lengthSquared: function () {
          let x = this.vertex1.pos.x - this.vertex0.pos.x
          let y = this.vertex1.pos.y - this.vertex0.pos.y
          return x * x + y * y
        },

        length: function () {
          return Math.sqrt(this.lengthSquared())
        }
      }

      module.exports = Side

    }, { "../constants": 11, "./Polygon3": 20, "./Vector2": 22, "./Vertex2": 24, "./Vertex3": 25 }], 22: [function (require, module, exports) {
      const { IsFloat } = require('../utils')

      /** Class Vector2D
       * Represents a 2D vector with X, Y coordinates
       * @constructor
       *
       * @example
       * new CSG.Vector2D(1, 2);
       * new CSG.Vector3D([1, 2]);
       * new CSG.Vector3D({ x: 1, y: 2});
       */
      const Vector2D = function (x, y) {
        if (arguments.length === 2) {
          this._x = parseFloat(x)
          this._y = parseFloat(y)
        } else {
          var ok = true
          if (arguments.length === 1) {
            if (typeof (x) === 'object') {
              if (x instanceof Vector2D) {
                this._x = x._x
                this._y = x._y
              } else if (x instanceof Array) {
                this._x = parseFloat(x[0])
                this._y = parseFloat(x[1])
              } else if (('x' in x) && ('y' in x)) {
                this._x = parseFloat(x.x)
                this._y = parseFloat(x.y)
              } else ok = false
            } else {
              var v = parseFloat(x)
              this._x = v
              this._y = v
            }
          } else ok = false
          if (ok) {
            if ((!IsFloat(this._x)) || (!IsFloat(this._y))) ok = false
          }
          if (!ok) {
            throw new Error('wrong arguments')
          }
        }
      }

      Vector2D.fromAngle = function (radians) {
        return Vector2D.fromAngleRadians(radians)
      }

      Vector2D.fromAngleDegrees = function (degrees) {
        var radians = Math.PI * degrees / 180
        return Vector2D.fromAngleRadians(radians)
      }

      Vector2D.fromAngleRadians = function (radians) {
        return Vector2D.Create(Math.cos(radians), Math.sin(radians))
      }

      // This does the same as new Vector2D(x,y) but it doesn't go through the constructor
      // and the parameters are not validated. Is much faster.
      Vector2D.Create = function (x, y) {
        var result = Object.create(Vector2D.prototype)
        result._x = x
        result._y = y
        return result
      }

      Vector2D.prototype = {
        get x() {
          return this._x
        },
        get y() {
          return this._y
        },

        set x(v) {
          throw new Error('Vector2D is immutable')
        },
        set y(v) {
          throw new Error('Vector2D is immutable')
        },

        // extend to a 3D vector by adding a z coordinate:
        toVector3D: function (z) {
          const Vector3D = require('./Vector3') // FIXME: circular dependencies Vector2 => Vector3 => Vector2
          return new Vector3D(this._x, this._y, z)
        },

        equals: function (a) {
          return (this._x === a._x) && (this._y === a._y)
        },

        clone: function () {
          return Vector2D.Create(this._x, this._y)
        },

        negated: function () {
          return Vector2D.Create(-this._x, -this._y)
        },

        plus: function (a) {
          return Vector2D.Create(this._x + a._x, this._y + a._y)
        },

        minus: function (a) {
          return Vector2D.Create(this._x - a._x, this._y - a._y)
        },

        times: function (a) {
          return Vector2D.Create(this._x * a, this._y * a)
        },

        dividedBy: function (a) {
          return Vector2D.Create(this._x / a, this._y / a)
        },

        dot: function (a) {
          return this._x * a._x + this._y * a._y
        },

        lerp: function (a, t) {
          return this.plus(a.minus(this).times(t))
        },

        length: function () {
          return Math.sqrt(this.dot(this))
        },

        distanceTo: function (a) {
          return this.minus(a).length()
        },

        distanceToSquared: function (a) {
          return this.minus(a).lengthSquared()
        },

        lengthSquared: function () {
          return this.dot(this)
        },

        unit: function () {
          return this.dividedBy(this.length())
        },

        cross: function (a) {
          return this._x * a._y - this._y * a._x
        },

        // returns the vector rotated by 90 degrees clockwise
        normal: function () {
          return Vector2D.Create(this._y, -this._x)
        },

        // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
        // Returns a new Vector2D
        multiply4x4: function (matrix4x4) {
          return matrix4x4.leftMultiply1x2Vector(this)
        },

        transform: function (matrix4x4) {
          return matrix4x4.leftMultiply1x2Vector(this)
        },

        angle: function () {
          return this.angleRadians()
        },

        angleDegrees: function () {
          var radians = this.angleRadians()
          return 180 * radians / Math.PI
        },

        angleRadians: function () {
          // y=sin, x=cos
          return Math.atan2(this._y, this._x)
        },

        min: function (p) {
          return Vector2D.Create(
            Math.min(this._x, p._x), Math.min(this._y, p._y))
        },

        max: function (p) {
          return Vector2D.Create(
            Math.max(this._x, p._x), Math.max(this._y, p._y))
        },

        toString: function () {
          return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ')'
        },

        abs: function () {
          return Vector2D.Create(Math.abs(this._x), Math.abs(this._y))
        }
      }

      module.exports = Vector2D

    }, { "../utils": 33, "./Vector3": 23 }], 23: [function (require, module, exports) {
      const { IsFloat } = require('../utils')
      const Vector2D = require('./Vector2')

      /** Class Vector3D
       * Represents a 3D vector with X, Y, Z coordinates.
       * @constructor
       *
       * @example
       * new CSG.Vector3D(1, 2, 3);
       * new CSG.Vector3D([1, 2, 3]);
       * new CSG.Vector3D({ x: 1, y: 2, z: 3 });
       * new CSG.Vector3D(1, 2); // assumes z=0
       * new CSG.Vector3D([1, 2]); // assumes z=0
       */
      const Vector3D = function (x, y, z) {
        if (arguments.length === 3) {
          this._x = parseFloat(x)
          this._y = parseFloat(y)
          this._z = parseFloat(z)
        } else if (arguments.length === 2) {
          this._x = parseFloat(x)
          this._y = parseFloat(y)
          this._z = 0
        } else {
          var ok = true
          if (arguments.length === 1) {
            if (typeof (x) === 'object') {
              if (x instanceof Vector3D) {
                this._x = x._x
                this._y = x._y
                this._z = x._z
              } else if (x instanceof Vector2D) {
                this._x = x._x
                this._y = x._y
                this._z = 0
              } else if (x instanceof Array) {
                if ((x.length < 2) || (x.length > 3)) {
                  ok = false
                } else {
                  this._x = parseFloat(x[0])
                  this._y = parseFloat(x[1])
                  if (x.length === 3) {
                    this._z = parseFloat(x[2])
                  } else {
                    this._z = 0
                  }
                }
              } else if (('x' in x) && ('y' in x)) {
                this._x = parseFloat(x.x)
                this._y = parseFloat(x.y)
                if ('z' in x) {
                  this._z = parseFloat(x.z)
                } else {
                  this._z = 0
                }
              } else if (('_x' in x) && ('_y' in x)) {
                this._x = parseFloat(x._x)
                this._y = parseFloat(x._y)
                if ('_z' in x) {
                  this._z = parseFloat(x._z)
                } else {
                  this._z = 0
                }
              } else ok = false
            } else {
              var v = parseFloat(x)
              this._x = v
              this._y = v
              this._z = v
            }
          } else ok = false
          if (ok) {
            if ((!IsFloat(this._x)) || (!IsFloat(this._y)) || (!IsFloat(this._z))) ok = false
          } else {
            throw new Error('wrong arguments')
          }
        }
      }

      // This does the same as new Vector3D(x,y,z) but it doesn't go through the constructor
      // and the parameters are not validated. Is much faster.
      Vector3D.Create = function (x, y, z) {
        var result = Object.create(Vector3D.prototype)
        result._x = x
        result._y = y
        result._z = z
        return result
      }

      Vector3D.prototype = {
        get x() {
          return this._x
        },
        get y() {
          return this._y
        },
        get z() {
          return this._z
        },

        set x(v) {
          throw new Error('Vector3D is immutable')
        },
        set y(v) {
          throw new Error('Vector3D is immutable')
        },
        set z(v) {
          throw new Error('Vector3D is immutable')
        },

        clone: function () {
          return Vector3D.Create(this._x, this._y, this._z)
        },

        negated: function () {
          return Vector3D.Create(-this._x, -this._y, -this._z)
        },

        abs: function () {
          return Vector3D.Create(Math.abs(this._x), Math.abs(this._y), Math.abs(this._z))
        },

        plus: function (a) {
          return Vector3D.Create(this._x + a._x, this._y + a._y, this._z + a._z)
        },

        minus: function (a) {
          return Vector3D.Create(this._x - a._x, this._y - a._y, this._z - a._z)
        },

        times: function (a) {
          return Vector3D.Create(this._x * a, this._y * a, this._z * a)
        },

        dividedBy: function (a) {
          return Vector3D.Create(this._x / a, this._y / a, this._z / a)
        },

        dot: function (a) {
          return this._x * a._x + this._y * a._y + this._z * a._z
        },

        lerp: function (a, t) {
          return this.plus(a.minus(this).times(t))
        },

        lengthSquared: function () {
          return this.dot(this)
        },

        length: function () {
          return Math.sqrt(this.lengthSquared())
        },

        unit: function () {
          return this.dividedBy(this.length())
        },

        cross: function (a) {
          return Vector3D.Create(
            this._y * a._z - this._z * a._y, this._z * a._x - this._x * a._z, this._x * a._y - this._y * a._x)
        },

        distanceTo: function (a) {
          return this.minus(a).length()
        },

        distanceToSquared: function (a) {
          return this.minus(a).lengthSquared()
        },

        equals: function (a) {
          return (this._x === a._x) && (this._y === a._y) && (this._z === a._z)
        },

        // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
        // Returns a new Vector3D
        multiply4x4: function (matrix4x4) {
          return matrix4x4.leftMultiply1x3Vector(this)
        },

        transform: function (matrix4x4) {
          return matrix4x4.leftMultiply1x3Vector(this)
        },

        toString: function () {
          return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ', ' + this._z.toFixed(5) + ')'
        },

        // find a vector that is somewhat perpendicular to this one
        randomNonParallelVector: function () {
          var abs = this.abs()
          if ((abs._x <= abs._y) && (abs._x <= abs._z)) {
            return Vector3D.Create(1, 0, 0)
          } else if ((abs._y <= abs._x) && (abs._y <= abs._z)) {
            return Vector3D.Create(0, 1, 0)
          } else {
            return Vector3D.Create(0, 0, 1)
          }
        },

        min: function (p) {
          return Vector3D.Create(
            Math.min(this._x, p._x), Math.min(this._y, p._y), Math.min(this._z, p._z))
        },

        max: function (p) {
          return Vector3D.Create(
            Math.max(this._x, p._x), Math.max(this._y, p._y), Math.max(this._z, p._z))
        }
      }

      module.exports = Vector3D

    }, { "../utils": 33, "./Vector2": 22 }], 24: [function (require, module, exports) {
      const Vector2D = require('./Vector2')
      const { getTag } = require('../constants')

      const Vertex = function (pos) {
        this.pos = pos
      }

      Vertex.fromObject = function (obj) {
        return new Vertex(new Vector2D(obj.pos._x, obj.pos._y))
      }

      Vertex.prototype = {
        toString: function () {
          return '(' + this.pos.x.toFixed(5) + ',' + this.pos.y.toFixed(5) + ')'
        },
        getTag: function () {
          var result = this.tag
          if (!result) {
            result = getTag()
            this.tag = result
          }
          return result
        }
      }

      module.exports = Vertex

    }, { "../constants": 11, "./Vector2": 22 }], 25: [function (require, module, exports) {
      const Vector3D = require('./Vector3')
      const { getTag } = require('../constants')

      // # class Vertex
      // Represents a vertex of a polygon. Use your own vertex class instead of this
      // one to provide additional features like texture coordinates and vertex
      // colors. Custom vertex classes need to provide a `pos` property
      // `flipped()`, and `interpolate()` methods that behave analogous to the ones
      // FIXME: And a lot MORE (see plane.fromVector3Ds for ex) ! This is fragile code
      // defined by `Vertex`.
      const Vertex = function (pos) {
        this.pos = pos
      }

      // create from an untyped object with identical property names:
      Vertex.fromObject = function (obj) {
        var pos = new Vector3D(obj.pos)
        return new Vertex(pos)
      }

      Vertex.prototype = {
        // Return a vertex with all orientation-specific data (e.g. vertex normal) flipped. Called when the
        // orientation of a polygon is flipped.
        flipped: function () {
          return this
        },

        getTag: function () {
          var result = this.tag
          if (!result) {
            result = getTag()
            this.tag = result
          }
          return result
        },

        // Create a new vertex between this vertex and `other` by linearly
        // interpolating all properties using a parameter of `t`. Subclasses should
        // override this to interpolate additional properties.
        interpolate: function (other, t) {
          var newpos = this.pos.lerp(other.pos, t)
          return new Vertex(newpos)
        },

        // Affine transformation of vertex. Returns a new Vertex
        transform: function (matrix4x4) {
          var newpos = this.pos.multiply4x4(matrix4x4)
          return new Vertex(newpos)
        },

        toString: function () {
          return this.pos.toString()
        }
      }

      module.exports = Vertex

    }, { "../constants": 11, "./Vector3": 23 }], 26: [function (require, module, exports) {
      const { EPS } = require('../constants')
      const { solve2Linear } = require('../utils')

      // see if the line between p0start and p0end intersects with the line between p1start and p1end
      // returns true if the lines strictly intersect, the end points are not counted!
      const linesIntersect = function (p0start, p0end, p1start, p1end) {
        if (p0end.equals(p1start) || p1end.equals(p0start)) {
          let d = p1end.minus(p1start).unit().plus(p0end.minus(p0start).unit()).length()
          if (d < EPS) {
            return true
          }
        } else {
          let d0 = p0end.minus(p0start)
          let d1 = p1end.minus(p1start)
          // FIXME These epsilons need review and testing
          if (Math.abs(d0.cross(d1)) < 1e-9) return false // lines are parallel
          let alphas = solve2Linear(-d0.x, d1.x, -d0.y, d1.y, p0start.x - p1start.x, p0start.y - p1start.y)
          if ((alphas[0] > 1e-6) && (alphas[0] < 0.999999) && (alphas[1] > 1e-5) && (alphas[1] < 0.999999)) return true
          //    if( (alphas[0] >= 0) && (alphas[0] <= 1) && (alphas[1] >= 0) && (alphas[1] <= 1) ) return true;
        }
        return false
      }


      module.exports = { linesIntersect }

    }, { "../constants": 11, "../utils": 33 }], 27: [function (require, module, exports) {
      const { EPS } = require('../constants')
      const OrthoNormalBasis = require('./OrthoNormalBasis')
      const { interpolateBetween2DPointsForY, insertSorted, fnNumberSort } = require('../utils')
      const Vertex = require('./Vertex3')
      const Vector2D = require('./Vector2')
      const Line2D = require('./Line2')
      const Polygon = require('./Polygon3')

      // Retesselation function for a set of coplanar polygons. See the introduction at the top of
      // this file.
      const reTesselateCoplanarPolygons = function (sourcepolygons, destpolygons) {
        let numpolygons = sourcepolygons.length
        if (numpolygons > 0) {
          let plane = sourcepolygons[0].plane
          let shared = sourcepolygons[0].shared
          let orthobasis = new OrthoNormalBasis(plane)
          let polygonvertices2d = [] // array of array of Vector2D
          let polygontopvertexindexes = [] // array of indexes of topmost vertex per polygon
          let topy2polygonindexes = {}
          let ycoordinatetopolygonindexes = {}

          let xcoordinatebins = {}
          let ycoordinatebins = {}

          // convert all polygon vertices to 2D
          // Make a list of all encountered y coordinates
          // And build a map of all polygons that have a vertex at a certain y coordinate:
          let ycoordinateBinningFactor = 1.0 / EPS * 10
          for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
            let poly3d = sourcepolygons[polygonindex]
            let vertices2d = []
            let numvertices = poly3d.vertices.length
            let minindex = -1
            if (numvertices > 0) {
              let miny, maxy, maxindex
              for (let i = 0; i < numvertices; i++) {
                let pos2d = orthobasis.to2D(poly3d.vertices[i].pos)
                // perform binning of y coordinates: If we have multiple vertices very
                // close to each other, give them the same y coordinate:
                let ycoordinatebin = Math.floor(pos2d.y * ycoordinateBinningFactor)
                let newy
                if (ycoordinatebin in ycoordinatebins) {
                  newy = ycoordinatebins[ycoordinatebin]
                } else if (ycoordinatebin + 1 in ycoordinatebins) {
                  newy = ycoordinatebins[ycoordinatebin + 1]
                } else if (ycoordinatebin - 1 in ycoordinatebins) {
                  newy = ycoordinatebins[ycoordinatebin - 1]
                } else {
                  newy = pos2d.y
                  ycoordinatebins[ycoordinatebin] = pos2d.y
                }
                pos2d = Vector2D.Create(pos2d.x, newy)
                vertices2d.push(pos2d)
                let y = pos2d.y
                if ((i === 0) || (y < miny)) {
                  miny = y
                  minindex = i
                }
                if ((i === 0) || (y > maxy)) {
                  maxy = y
                  maxindex = i
                }
                if (!(y in ycoordinatetopolygonindexes)) {
                  ycoordinatetopolygonindexes[y] = {}
                }
                ycoordinatetopolygonindexes[y][polygonindex] = true
              }
              if (miny >= maxy) {
                // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:
                vertices2d = []
                numvertices = 0
                minindex = -1
              } else {
                if (!(miny in topy2polygonindexes)) {
                  topy2polygonindexes[miny] = []
                }
                topy2polygonindexes[miny].push(polygonindex)
              }
            } // if(numvertices > 0)
            // reverse the vertex order:
            vertices2d.reverse()
            minindex = numvertices - minindex - 1
            polygonvertices2d.push(vertices2d)
            polygontopvertexindexes.push(minindex)
          }
          let ycoordinates = []
          for (let ycoordinate in ycoordinatetopolygonindexes) ycoordinates.push(ycoordinate)
          ycoordinates.sort(fnNumberSort)

          // Now we will iterate over all y coordinates, from lowest to highest y coordinate
          // activepolygons: source polygons that are 'active', i.e. intersect with our y coordinate
          //   Is sorted so the polygons are in left to right order
          // Each element in activepolygons has these properties:
          //        polygonindex: the index of the source polygon (i.e. an index into the sourcepolygons
          //                      and polygonvertices2d arrays)
          //        leftvertexindex: the index of the vertex at the left side of the polygon (lowest x)
          //                         that is at or just above the current y coordinate
          //        rightvertexindex: dito at right hand side of polygon
          //        topleft, bottomleft: coordinates of the left side of the polygon crossing the current y coordinate
          //        topright, bottomright: coordinates of the right hand side of the polygon crossing the current y coordinate
          let activepolygons = []
          let prevoutpolygonrow = []
          for (let yindex = 0; yindex < ycoordinates.length; yindex++) {
            let newoutpolygonrow = []
            let ycoordinate_as_string = ycoordinates[yindex]
            let ycoordinate = Number(ycoordinate_as_string)

            // update activepolygons for this y coordinate:
            // - Remove any polygons that end at this y coordinate
            // - update leftvertexindex and rightvertexindex (which point to the current vertex index
            //   at the the left and right side of the polygon
            // Iterate over all polygons that have a corner at this y coordinate:
            let polygonindexeswithcorner = ycoordinatetopolygonindexes[ycoordinate_as_string]
            for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {
              let activepolygon = activepolygons[activepolygonindex]
              let polygonindex = activepolygon.polygonindex
              if (polygonindexeswithcorner[polygonindex]) {
                // this active polygon has a corner at this y coordinate:
                let vertices2d = polygonvertices2d[polygonindex]
                let numvertices = vertices2d.length
                let newleftvertexindex = activepolygon.leftvertexindex
                let newrightvertexindex = activepolygon.rightvertexindex
                // See if we need to increase leftvertexindex or decrease rightvertexindex:
                while (true) {
                  let nextleftvertexindex = newleftvertexindex + 1
                  if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
                  if (vertices2d[nextleftvertexindex].y !== ycoordinate) break
                  newleftvertexindex = nextleftvertexindex
                }
                let nextrightvertexindex = newrightvertexindex - 1
                if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
                if (vertices2d[nextrightvertexindex].y === ycoordinate) {
                  newrightvertexindex = nextrightvertexindex
                }
                if ((newleftvertexindex !== activepolygon.leftvertexindex) && (newleftvertexindex === newrightvertexindex)) {
                  // We have increased leftvertexindex or decreased rightvertexindex, and now they point to the same vertex
                  // This means that this is the bottom point of the polygon. We'll remove it:
                  activepolygons.splice(activepolygonindex, 1)
                  --activepolygonindex
                } else {
                  activepolygon.leftvertexindex = newleftvertexindex
                  activepolygon.rightvertexindex = newrightvertexindex
                  activepolygon.topleft = vertices2d[newleftvertexindex]
                  activepolygon.topright = vertices2d[newrightvertexindex]
                  let nextleftvertexindex = newleftvertexindex + 1
                  if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
                  activepolygon.bottomleft = vertices2d[nextleftvertexindex]
                  let nextrightvertexindex = newrightvertexindex - 1
                  if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
                  activepolygon.bottomright = vertices2d[nextrightvertexindex]
                }
              } // if polygon has corner here
            } // for activepolygonindex
            let nextycoordinate
            if (yindex >= ycoordinates.length - 1) {
              // last row, all polygons must be finished here:
              activepolygons = []
              nextycoordinate = null
            } else // yindex < ycoordinates.length-1
            {
              nextycoordinate = Number(ycoordinates[yindex + 1])
              let middleycoordinate = 0.5 * (ycoordinate + nextycoordinate)
              // update activepolygons by adding any polygons that start here:
              let startingpolygonindexes = topy2polygonindexes[ycoordinate_as_string]
              for (let polygonindex_key in startingpolygonindexes) {
                let polygonindex = startingpolygonindexes[polygonindex_key]
                let vertices2d = polygonvertices2d[polygonindex]
                let numvertices = vertices2d.length
                let topvertexindex = polygontopvertexindexes[polygonindex]
                // the top of the polygon may be a horizontal line. In that case topvertexindex can point to any point on this line.
                // Find the left and right topmost vertices which have the current y coordinate:
                let topleftvertexindex = topvertexindex
                while (true) {
                  let i = topleftvertexindex + 1
                  if (i >= numvertices) i = 0
                  if (vertices2d[i].y !== ycoordinate) break
                  if (i === topvertexindex) break // should not happen, but just to prevent endless loops
                  topleftvertexindex = i
                }
                let toprightvertexindex = topvertexindex
                while (true) {
                  let i = toprightvertexindex - 1
                  if (i < 0) i = numvertices - 1
                  if (vertices2d[i].y !== ycoordinate) break
                  if (i === topleftvertexindex) break // should not happen, but just to prevent endless loops
                  toprightvertexindex = i
                }
                let nextleftvertexindex = topleftvertexindex + 1
                if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
                let nextrightvertexindex = toprightvertexindex - 1
                if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
                let newactivepolygon = {
                  polygonindex: polygonindex,
                  leftvertexindex: topleftvertexindex,
                  rightvertexindex: toprightvertexindex,
                  topleft: vertices2d[topleftvertexindex],
                  topright: vertices2d[toprightvertexindex],
                  bottomleft: vertices2d[nextleftvertexindex],
                  bottomright: vertices2d[nextrightvertexindex]
                }
                insertSorted(activepolygons, newactivepolygon, function (el1, el2) {
                  let x1 = interpolateBetween2DPointsForY(
                    el1.topleft, el1.bottomleft, middleycoordinate)
                  let x2 = interpolateBetween2DPointsForY(
                    el2.topleft, el2.bottomleft, middleycoordinate)
                  if (x1 > x2) return 1
                  if (x1 < x2) return -1
                  return 0
                })
              } // for(let polygonindex in startingpolygonindexes)
            } //  yindex < ycoordinates.length-1
            // if( (yindex === ycoordinates.length-1) || (nextycoordinate - ycoordinate > EPS) )
            if (true) {
              // Now activepolygons is up to date
              // Build the output polygons for the next row in newoutpolygonrow:
              for (let activepolygonKey in activepolygons) {
                let activepolygon = activepolygons[activepolygonKey]
                let polygonindex = activepolygon.polygonindex
                let vertices2d = polygonvertices2d[polygonindex]
                let numvertices = vertices2d.length

                let x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate)
                let topleft = Vector2D.Create(x, ycoordinate)
                x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate)
                let topright = Vector2D.Create(x, ycoordinate)
                x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate)
                let bottomleft = Vector2D.Create(x, nextycoordinate)
                x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate)
                let bottomright = Vector2D.Create(x, nextycoordinate)
                let outpolygon = {
                  topleft: topleft,
                  topright: topright,
                  bottomleft: bottomleft,
                  bottomright: bottomright,
                  leftline: Line2D.fromPoints(topleft, bottomleft),
                  rightline: Line2D.fromPoints(bottomright, topright)
                }
                if (newoutpolygonrow.length > 0) {
                  let prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1]
                  let d1 = outpolygon.topleft.distanceTo(prevoutpolygon.topright)
                  let d2 = outpolygon.bottomleft.distanceTo(prevoutpolygon.bottomright)
                  if ((d1 < EPS) && (d2 < EPS)) {
                    // we can join this polygon with the one to the left:
                    outpolygon.topleft = prevoutpolygon.topleft
                    outpolygon.leftline = prevoutpolygon.leftline
                    outpolygon.bottomleft = prevoutpolygon.bottomleft
                    newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1)
                  }
                }
                newoutpolygonrow.push(outpolygon)
              } // for(activepolygon in activepolygons)
              if (yindex > 0) {
                // try to match the new polygons against the previous row:
                let prevcontinuedindexes = {}
                let matchedindexes = {}
                for (let i = 0; i < newoutpolygonrow.length; i++) {
                  let thispolygon = newoutpolygonrow[i]
                  for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
                    if (!matchedindexes[ii]) // not already processed?
                    {
                      // We have a match if the sidelines are equal or if the top coordinates
                      // are on the sidelines of the previous polygon
                      let prevpolygon = prevoutpolygonrow[ii]
                      if (prevpolygon.bottomleft.distanceTo(thispolygon.topleft) < EPS) {
                        if (prevpolygon.bottomright.distanceTo(thispolygon.topright) < EPS) {
                          // Yes, the top of this polygon matches the bottom of the previous:
                          matchedindexes[ii] = true
                          // Now check if the joined polygon would remain convex:
                          let d1 = thispolygon.leftline.direction().x - prevpolygon.leftline.direction().x
                          let d2 = thispolygon.rightline.direction().x - prevpolygon.rightline.direction().x
                          let leftlinecontinues = Math.abs(d1) < EPS
                          let rightlinecontinues = Math.abs(d2) < EPS
                          let leftlineisconvex = leftlinecontinues || (d1 >= 0)
                          let rightlineisconvex = rightlinecontinues || (d2 >= 0)
                          if (leftlineisconvex && rightlineisconvex) {
                            // yes, both sides have convex corners:
                            // This polygon will continue the previous polygon
                            thispolygon.outpolygon = prevpolygon.outpolygon
                            thispolygon.leftlinecontinues = leftlinecontinues
                            thispolygon.rightlinecontinues = rightlinecontinues
                            prevcontinuedindexes[ii] = true
                          }
                          break
                        }
                      }
                    } // if(!prevcontinuedindexes[ii])
                  } // for ii
                } // for i
                for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
                  if (!prevcontinuedindexes[ii]) {
                    // polygon ends here
                    // Finish the polygon with the last point(s):
                    let prevpolygon = prevoutpolygonrow[ii]
                    prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright)
                    if (prevpolygon.bottomright.distanceTo(prevpolygon.bottomleft) > EPS) {
                      // polygon ends with a horizontal line:
                      prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft)
                    }
                    // reverse the left half so we get a counterclockwise circle:
                    prevpolygon.outpolygon.leftpoints.reverse()
                    let points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints)
                    let vertices3d = []
                    points2d.map(function (point2d) {
                      let point3d = orthobasis.to3D(point2d)
                      let vertex3d = new Vertex(point3d)
                      vertices3d.push(vertex3d)
                    })
                    let polygon = new Polygon(vertices3d, shared, plane)
                    destpolygons.push(polygon)
                  }
                }
              } // if(yindex > 0)
              for (let i = 0; i < newoutpolygonrow.length; i++) {
                let thispolygon = newoutpolygonrow[i]
                if (!thispolygon.outpolygon) {
                  // polygon starts here:
                  thispolygon.outpolygon = {
                    leftpoints: [],
                    rightpoints: []
                  }
                  thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)
                  if (thispolygon.topleft.distanceTo(thispolygon.topright) > EPS) {
                    // we have a horizontal line at the top:
                    thispolygon.outpolygon.rightpoints.push(thispolygon.topright)
                  }
                } else {
                  // continuation of a previous row
                  if (!thispolygon.leftlinecontinues) {
                    thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)
                  }
                  if (!thispolygon.rightlinecontinues) {
                    thispolygon.outpolygon.rightpoints.push(thispolygon.topright)
                  }
                }
              }
              prevoutpolygonrow = newoutpolygonrow
            }
          } // for yindex
        } // if(numpolygons > 0)
      }

      module.exports = { reTesselateCoplanarPolygons }

    }, { "../constants": 11, "../utils": 33, "./Line2": 13, "./OrthoNormalBasis": 16, "./Polygon3": 20, "./Vector2": 22, "./Vertex3": 25 }], 28: [function (require, module, exports) {
      const Matrix4x4 = require('./math/Matrix4')
      const Vector3D = require('./math/Vector3')
      const Plane = require('./math/Plane')

      // Add several convenience methods to the classes that support a transform() method:
      const addTransformationMethodsToPrototype = function (prot) {
        prot.mirrored = function (plane) {
          return this.transform(Matrix4x4.mirroring(plane))
        }

        prot.mirroredX = function () {
          let plane = new Plane(Vector3D.Create(1, 0, 0), 0)
          return this.mirrored(plane)
        }

        prot.mirroredY = function () {
          let plane = new Plane(Vector3D.Create(0, 1, 0), 0)
          return this.mirrored(plane)
        }

        prot.mirroredZ = function () {
          let plane = new Plane(Vector3D.Create(0, 0, 1), 0)
          return this.mirrored(plane)
        }

        prot.translate = function (v) {
          return this.transform(Matrix4x4.translation(v))
        }

        prot.scale = function (f) {
          return this.transform(Matrix4x4.scaling(f))
        }

        prot.rotateX = function (deg) {
          return this.transform(Matrix4x4.rotationX(deg))
        }

        prot.rotateY = function (deg) {
          return this.transform(Matrix4x4.rotationY(deg))
        }

        prot.rotateZ = function (deg) {
          return this.transform(Matrix4x4.rotationZ(deg))
        }

        prot.rotate = function (rotationCenter, rotationAxis, degrees) {
          return this.transform(Matrix4x4.rotation(rotationCenter, rotationAxis, degrees))
        }

        prot.rotateEulerAngles = function (alpha, beta, gamma, position) {
          position = position || [0, 0, 0]

          let Rz1 = Matrix4x4.rotationZ(alpha)
          let Rx = Matrix4x4.rotationX(beta)
          let Rz2 = Matrix4x4.rotationZ(gamma)
          let T = Matrix4x4.translation(new Vector3D(position))

          return this.transform(Rz2.multiply(Rx).multiply(Rz1).multiply(T))
        }
      }

      // TODO: consider generalization and adding to addTransformationMethodsToPrototype
      const addCenteringToPrototype = function (prot, axes) {
        prot.center = function (cAxes) {
          cAxes = Array.prototype.map.call(arguments, function (a) {
            return a // .toLowerCase();
          })
          // no args: center on all axes
          if (!cAxes.length) {
            cAxes = axes.slice()
          }
          let b = this.getBounds()
          return this.translate(axes.map(function (a) {
            return cAxes.indexOf(a) > -1 ? -(b[0][a] + b[1][a]) / 2 : 0
          }))
        }
      }
      module.exports = {
        addTransformationMethodsToPrototype,
        addCenteringToPrototype
      }

    }, { "./math/Matrix4": 15, "./math/Plane": 18, "./math/Vector3": 23 }], 29: [function (require, module, exports) {
      const Vector3D = require('./math/Vector3')
      const Vector2D = require('./math/Vector2')

      // Parse an option from the options object
      // If the option is not present, return the default value
      const parseOption = function (options, optionname, defaultvalue) {
        var result = defaultvalue
        if (options && optionname in options) {
          result = options[optionname]
        }
        return result
      }

      // Parse an option and force into a Vector3D. If a scalar is passed it is converted
      // into a vector with equal x,y,z
      const parseOptionAs3DVector = function (options, optionname, defaultvalue) {
        var result = parseOption(options, optionname, defaultvalue)
        result = new Vector3D(result)
        return result
      }

      const parseOptionAs3DVectorList = function (options, optionname, defaultvalue) {
        var result = parseOption(options, optionname, defaultvalue)
        return result.map(function (res) {
          return new Vector3D(res)
        })
      }

      // Parse an option and force into a Vector2D. If a scalar is passed it is converted
      // into a vector with equal x,y
      const parseOptionAs2DVector = function (options, optionname, defaultvalue) {
        var result = parseOption(options, optionname, defaultvalue)
        result = new Vector2D(result)
        return result
      }

      const parseOptionAsFloat = function (options, optionname, defaultvalue) {
        var result = parseOption(options, optionname, defaultvalue)
        if (typeof (result) === 'string') {
          result = Number(result)
        }
        if (isNaN(result) || typeof (result) !== 'number') {
          throw new Error('Parameter ' + optionname + ' should be a number')
        }
        return result
      }

      const parseOptionAsInt = function (options, optionname, defaultvalue) {
        var result = parseOption(options, optionname, defaultvalue)
        result = Number(Math.floor(result))
        if (isNaN(result)) {
          throw new Error('Parameter ' + optionname + ' should be a number')
        }
        return result
      }

      const parseOptionAsBool = function (options, optionname, defaultvalue) {
        var result = parseOption(options, optionname, defaultvalue)
        if (typeof (result) === 'string') {
          if (result === 'true') result = true
          else if (result === 'false') result = false
          else if (result === 0) result = false
        }
        result = !!result
        return result
      }

      module.exports = {
        parseOption,
        parseOptionAsInt,
        parseOptionAsFloat,
        parseOptionAsBool,
        parseOptionAs3DVector,
        parseOptionAs2DVector,
        parseOptionAs3DVectorList
      }

    }, { "./math/Vector2": 22, "./math/Vector3": 23 }], 30: [function (require, module, exports) {
      const CAG = require('./CAG')
      const { parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt } = require('./optionParsers')
      const { defaultResolution2D } = require('./constants')
      const Vector2D = require('./math/Vector2')
      const Path2D = require('./math/Path2')
      const { fromCompactBinary } = require('./CAGFactories')

      /** Construct a circle.
       * @param {Object} [options] - options for construction
       * @param {Vector2D} [options.center=[0,0]] - center of circle
       * @param {Number} [options.radius=1] - radius of circle
       * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
       * @returns {CAG} new CAG object
       */
      const circle = function (options) {
        options = options || {}
        let center = parseOptionAs2DVector(options, 'center', [0, 0])
        let radius = parseOptionAsFloat(options, 'radius', 1)
        let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
        let points = []
        for (let i = 0; i < resolution; i++) {
          let radians = 2 * Math.PI * i / resolution
          let point = Vector2D.fromAngleRadians(radians).times(radius).plus(center)
          points.push(point)
        }
        return CAG.fromPoints(points)
      }

      /** Construct an ellispe.
       * @param {Object} [options] - options for construction
       * @param {Vector2D} [options.center=[0,0]] - center of ellipse
       * @param {Vector2D} [options.radius=[1,1]] - radius of ellipse, width and height
       * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
       * @returns {CAG} new CAG object
       */
      const ellipse = function (options) {
        options = options || {}
        let c = parseOptionAs2DVector(options, 'center', [0, 0])
        let r = parseOptionAs2DVector(options, 'radius', [1, 1])
        r = r.abs() // negative radii make no sense
        let res = parseOptionAsInt(options, 'resolution', defaultResolution2D)

        let e2 = new Path2D([[c.x, c.y + r.y]])
        e2 = e2.appendArc([c.x, c.y - r.y], {
          xradius: r.x,
          yradius: r.y,
          xaxisrotation: 0,
          resolution: res,
          clockwise: true,
          large: false
        })
        e2 = e2.appendArc([c.x, c.y + r.y], {
          xradius: r.x,
          yradius: r.y,
          xaxisrotation: 0,
          resolution: res,
          clockwise: true,
          large: false
        })
        e2 = e2.close()
        return CAG.fromPath2(e2)
      }

      /** Construct a rectangle.
       * @param {Object} [options] - options for construction
       * @param {Vector2D} [options.center=[0,0]] - center of rectangle
       * @param {Vector2D} [options.radius=[1,1]] - radius of rectangle, width and height
       * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rectangle (alternate)
       * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rectangle (alternate)
       * @returns {CAG} new CAG object
       */
      const rectangle = function (options) {
        options = options || {}
        let c, r
        if (('corner1' in options) || ('corner2' in options)) {
          if (('center' in options) || ('radius' in options)) {
            throw new Error('rectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter')
          }
          let corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0])
          let corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1])
          c = corner1.plus(corner2).times(0.5)
          r = corner2.minus(corner1).times(0.5)
        } else {
          c = parseOptionAs2DVector(options, 'center', [0, 0])
          r = parseOptionAs2DVector(options, 'radius', [1, 1])
        }
        r = r.abs() // negative radii make no sense
        let rswap = new Vector2D(r.x, -r.y)
        let points = [
          c.plus(r), c.plus(rswap), c.minus(r), c.minus(rswap)
        ]
        return CAG.fromPoints(points)
      }

      /** Construct a rounded rectangle.
       * @param {Object} [options] - options for construction
       * @param {Vector2D} [options.center=[0,0]] - center of rounded rectangle
       * @param {Vector2D} [options.radius=[1,1]] - radius of rounded rectangle, width and height
       * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rounded rectangle (alternate)
       * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rounded rectangle (alternate)
       * @param {Number} [options.roundradius=0.2] - round radius of corners
       * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
       * @returns {CAG} new CAG object
       *
       * @example
       * let r = roundedRectangle({
       *   center: [0, 0],
       *   radius: [5, 10],
       *   roundradius: 2,
       *   resolution: 36,
       * });
       */
      const roundedRectangle = function (options) {
        options = options || {}
        let center, radius
        if (('corner1' in options) || ('corner2' in options)) {
          if (('center' in options) || ('radius' in options)) {
            throw new Error('roundedRectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter')
          }
          let corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0])
          let corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1])
          center = corner1.plus(corner2).times(0.5)
          radius = corner2.minus(corner1).times(0.5)
        } else {
          center = parseOptionAs2DVector(options, 'center', [0, 0])
          radius = parseOptionAs2DVector(options, 'radius', [1, 1])
        }
        radius = radius.abs() // negative radii make no sense
        let roundradius = parseOptionAsFloat(options, 'roundradius', 0.2)
        let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
        let maxroundradius = Math.min(radius.x, radius.y)
        maxroundradius -= 0.1
        roundradius = Math.min(roundradius, maxroundradius)
        roundradius = Math.max(0, roundradius)
        radius = new Vector2D(radius.x - roundradius, radius.y - roundradius)
        let rect = CAG.rectangle({
          center: center,
          radius: radius
        })
        if (roundradius > 0) {
          rect = rect.expand(roundradius, resolution)
        }
        return rect
      }

      /** Reconstruct a CAG from the output of toCompactBinary().
       * @param {CompactBinary} bin - see toCompactBinary()
       * @returns {CAG} new CAG object
       */
      CAG.fromCompactBinary = function (bin) {
        if (bin['class'] !== 'CAG') throw new Error('Not a CAG')
        let vertices = []
        let vertexData = bin.vertexData
        let numvertices = vertexData.length / 2
        let arrayindex = 0
        for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
          let x = vertexData[arrayindex++]
          let y = vertexData[arrayindex++]
          let pos = new Vector2D(x, y)
          let vertex = new CAG.Vertex(pos)
          vertices.push(vertex)
        }

        let sides = []
        let numsides = bin.sideVertexIndices.length / 2
        arrayindex = 0
        for (let sideindex = 0; sideindex < numsides; sideindex++) {
          let vertexindex0 = bin.sideVertexIndices[arrayindex++]
          let vertexindex1 = bin.sideVertexIndices[arrayindex++]
          let side = new CAG.Side(vertices[vertexindex0], vertices[vertexindex1])
          sides.push(side)
        }
        let cag = CAG.fromSides(sides)
        cag.isCanonicalized = true
        return cag
      }

      module.exports = {
        circle,
        ellipse,
        rectangle,
        roundedRectangle,
        fromCompactBinary
      }

    }, { "./CAG": 2, "./CAGFactories": 3, "./constants": 11, "./math/Path2": 17, "./math/Vector2": 22, "./optionParsers": 29 }], 31: [function (require, module, exports) {
      const CSG = require('./CSG')
      const { parseOption, parseOptionAs3DVector, parseOptionAs2DVector, parseOptionAs3DVectorList, parseOptionAsFloat, parseOptionAsInt } = require('./optionParsers')
      const { defaultResolution3D, defaultResolution2D, EPS } = require('./constants')
      const Vector3D = require('./math/Vector3')
      const Vertex = require('./math/Vertex3')
      const Polygon = require('./math/Polygon3')
      const { Connector } = require('./connectors')
      const Properties = require('./Properties')

      /** Construct an axis-aligned solid cuboid.
       * @param {Object} [options] - options for construction
       * @param {Vector3D} [options.center=[0,0,0]] - center of cube
       * @param {Vector3D} [options.radius=[1,1,1]] - radius of cube, single scalar also possible
       * @returns {CSG} new 3D solid
       *
       * @example
       * let cube = CSG.cube({
       *   center: [5, 5, 5],
       *   radius: 5, // scalar radius
       * });
       */
      const cube = function (options) {
        let c
        let r
        let corner1
        let corner2
        options = options || {}
        if (('corner1' in options) || ('corner2' in options)) {
          if (('center' in options) || ('radius' in options)) {
            throw new Error('cube: should either give a radius and center parameter, or a corner1 and corner2 parameter')
          }
          corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0])
          corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1])
          c = corner1.plus(corner2).times(0.5)
          r = corner2.minus(corner1).times(0.5)
        } else {
          c = parseOptionAs3DVector(options, 'center', [0, 0, 0])
          r = parseOptionAs3DVector(options, 'radius', [1, 1, 1])
        }
        r = r.abs() // negative radii make no sense
        let result = CSG.fromPolygons([
          [
            [0, 4, 6, 2],
            [-1, 0, 0]
          ],
          [
            [1, 3, 7, 5],
            [+1, 0, 0]
          ],
          [
            [0, 1, 5, 4],
            [0, -1, 0]
          ],
          [
            [2, 6, 7, 3],
            [0, +1, 0]
          ],
          [
            [0, 2, 3, 1],
            [0, 0, -1]
          ],
          [
            [4, 5, 7, 6],
            [0, 0, +1]
          ]
        ].map(function (info) {
          let vertices = info[0].map(function (i) {
            let pos = new Vector3D(
              c.x + r.x * (2 * !!(i & 1) - 1), c.y + r.y * (2 * !!(i & 2) - 1), c.z + r.z * (2 * !!(i & 4) - 1))
            return new Vertex(pos)
          })
          return new Polygon(vertices, null /* , plane */)
        }))
        result.properties.cube = new Properties()
        result.properties.cube.center = new Vector3D(c)
        // add 6 connectors, at the centers of each face:
        result.properties.cube.facecenters = [
          new Connector(new Vector3D([r.x, 0, 0]).plus(c), [1, 0, 0], [0, 0, 1]),
          new Connector(new Vector3D([-r.x, 0, 0]).plus(c), [-1, 0, 0], [0, 0, 1]),
          new Connector(new Vector3D([0, r.y, 0]).plus(c), [0, 1, 0], [0, 0, 1]),
          new Connector(new Vector3D([0, -r.y, 0]).plus(c), [0, -1, 0], [0, 0, 1]),
          new Connector(new Vector3D([0, 0, r.z]).plus(c), [0, 0, 1], [1, 0, 0]),
          new Connector(new Vector3D([0, 0, -r.z]).plus(c), [0, 0, -1], [1, 0, 0])
        ]
        return result
      }

      /** Construct a solid sphere
       * @param {Object} [options] - options for construction
       * @param {Vector3D} [options.center=[0,0,0]] - center of sphere
       * @param {Number} [options.radius=1] - radius of sphere
       * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
       * @param {Array} [options.axes] -  an array with 3 vectors for the x, y and z base vectors
       * @returns {CSG} new 3D solid
       *
       *
       * @example
       * let sphere = CSG.sphere({
       *   center: [0, 0, 0],
       *   radius: 2,
       *   resolution: 32,
       * });
      */
      const sphere = function (options) {
        options = options || {}
        let center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
        let radius = parseOptionAsFloat(options, 'radius', 1)
        let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
        let xvector, yvector, zvector
        if ('axes' in options) {
          xvector = options.axes[0].unit().times(radius)
          yvector = options.axes[1].unit().times(radius)
          zvector = options.axes[2].unit().times(radius)
        } else {
          xvector = new Vector3D([1, 0, 0]).times(radius)
          yvector = new Vector3D([0, -1, 0]).times(radius)
          zvector = new Vector3D([0, 0, 1]).times(radius)
        }
        if (resolution < 4) resolution = 4
        let qresolution = Math.round(resolution / 4)
        let prevcylinderpoint
        let polygons = []
        for (let slice1 = 0; slice1 <= resolution; slice1++) {
          let angle = Math.PI * 2.0 * slice1 / resolution
          let cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)))
          if (slice1 > 0) {
            // cylinder vertices:
            let vertices = []
            let prevcospitch, prevsinpitch
            for (let slice2 = 0; slice2 <= qresolution; slice2++) {
              let pitch = 0.5 * Math.PI * slice2 / qresolution
              let cospitch = Math.cos(pitch)
              let sinpitch = Math.sin(pitch)
              if (slice2 > 0) {
                vertices = []
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
                vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
                if (slice2 < qresolution) {
                  vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
                }
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
                polygons.push(new Polygon(vertices))
                vertices = []
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
                vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
                if (slice2 < qresolution) {
                  vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
                }
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
                vertices.reverse()
                polygons.push(new Polygon(vertices))
              }
              prevcospitch = cospitch
              prevsinpitch = sinpitch
            }
          }
          prevcylinderpoint = cylinderpoint
        }
        let result = CSG.fromPolygons(polygons)
        result.properties.sphere = new Properties()
        result.properties.sphere.center = new Vector3D(center)
        result.properties.sphere.facepoint = center.plus(xvector)
        return result
      }

      /** Construct a solid cylinder.
       * @param {Object} [options] - options for construction
       * @param {Vector} [options.start=[0,-1,0]] - start point of cylinder
       * @param {Vector} [options.end=[0,1,0]] - end point of cylinder
       * @param {Number} [options.radius=1] - radius of cylinder, must be scalar
       * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
       * @returns {CSG} new 3D solid
       *
       * @example
       * let cylinder = CSG.cylinder({
       *   start: [0, -10, 0],
       *   end: [0, 10, 0],
       *   radius: 10,
       *   resolution: 16
       * });
       */
      const cylinder = function (options) {
        let s = parseOptionAs3DVector(options, 'start', [0, -1, 0])
        let e = parseOptionAs3DVector(options, 'end', [0, 1, 0])
        let r = parseOptionAsFloat(options, 'radius', 1)
        let rEnd = parseOptionAsFloat(options, 'radiusEnd', r)
        let rStart = parseOptionAsFloat(options, 'radiusStart', r)
        let alpha = parseOptionAsFloat(options, 'sectorAngle', 360)
        alpha = alpha > 360 ? alpha % 360 : alpha

        if ((rEnd < 0) || (rStart < 0)) {
          throw new Error('Radius should be non-negative')
        }
        if ((rEnd === 0) && (rStart === 0)) {
          throw new Error('Either radiusStart or radiusEnd should be positive')
        }

        let slices = parseOptionAsInt(options, 'resolution', defaultResolution2D) // FIXME is this 3D?
        let ray = e.minus(s)
        let axisZ = ray.unit() //, isY = (Math.abs(axisZ.y) > 0.5);
        let axisX = axisZ.randomNonParallelVector().unit()

        //  let axisX = new Vector3D(isY, !isY, 0).cross(axisZ).unit();
        let axisY = axisX.cross(axisZ).unit()
        let start = new Vertex(s)
        let end = new Vertex(e)
        let polygons = []

        function point(stack, slice, radius) {
          let angle = slice * Math.PI * alpha / 180
          let out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)))
          let pos = s.plus(ray.times(stack)).plus(out.times(radius))
          return new Vertex(pos)
        }
        if (alpha > 0) {
          for (let i = 0; i < slices; i++) {
            let t0 = i / slices
            let t1 = (i + 1) / slices
            if (rEnd === rStart) {
              polygons.push(new Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]))
              polygons.push(new Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]))
              polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
            } else {
              if (rStart > 0) {
                polygons.push(new Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]))
                polygons.push(new Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]))
              }
              if (rEnd > 0) {
                polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
                polygons.push(new Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]))
              }
            }
          }
          if (alpha < 360) {
            polygons.push(new Polygon([start, end, point(0, 0, rStart)]))
            polygons.push(new Polygon([point(0, 0, rStart), end, point(1, 0, rEnd)]))
            polygons.push(new Polygon([start, point(0, 1, rStart), end]))
            polygons.push(new Polygon([point(0, 1, rStart), point(1, 1, rEnd), end]))
          }
        }
        let result = CSG.fromPolygons(polygons)
        result.properties.cylinder = new Properties()
        result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX)
        result.properties.cylinder.end = new Connector(e, axisZ, axisX)
        let cylCenter = s.plus(ray.times(0.5))
        let fptVec = axisX.rotate(s, axisZ, -alpha / 2).times((rStart + rEnd) / 2)
        let fptVec90 = fptVec.cross(axisZ)
        // note this one is NOT a face normal for a cone. - It's horizontal from cyl perspective
        result.properties.cylinder.facepointH = new Connector(cylCenter.plus(fptVec), fptVec, axisZ)
        result.properties.cylinder.facepointH90 = new Connector(cylCenter.plus(fptVec90), fptVec90, axisZ)
        return result
      }

      /** Construct a cylinder with rounded ends.
       * @param {Object} [options] - options for construction
       * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
       * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
       * @param {Number} [options.radius=1] - radius of rounded ends, must be scalar
       * @param {Vector3D} [options.normal] - vector determining the starting angle for tesselation. Should be non-parallel to start.minus(end)
       * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
       * @returns {CSG} new 3D solid
       *
       * @example
       * let cylinder = CSG.roundedCylinder({
       *   start: [0, -10, 0],
       *   end: [0, 10, 0],
       *   radius: 2,
       *   resolution: 16
       * });
       */
      const roundedCylinder = function (options) {
        let p1 = parseOptionAs3DVector(options, 'start', [0, -1, 0])
        let p2 = parseOptionAs3DVector(options, 'end', [0, 1, 0])
        let radius = parseOptionAsFloat(options, 'radius', 1)
        let direction = p2.minus(p1)
        let defaultnormal
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
          defaultnormal = new Vector3D(0, 1, 0)
        } else {
          defaultnormal = new Vector3D(1, 0, 0)
        }
        let normal = parseOptionAs3DVector(options, 'normal', defaultnormal)
        let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
        if (resolution < 4) resolution = 4
        let polygons = []
        let qresolution = Math.floor(0.25 * resolution)
        let length = direction.length()
        if (length < EPS) {
          return sphere({
            center: p1,
            radius: radius,
            resolution: resolution
          })
        }
        let zvector = direction.unit().times(radius)
        let xvector = zvector.cross(normal).unit().times(radius)
        let yvector = xvector.cross(zvector).unit().times(radius)
        let prevcylinderpoint
        for (let slice1 = 0; slice1 <= resolution; slice1++) {
          let angle = Math.PI * 2.0 * slice1 / resolution
          let cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)))
          if (slice1 > 0) {
            // cylinder vertices:
            let vertices = []
            vertices.push(new Vertex(p1.plus(cylinderpoint)))
            vertices.push(new Vertex(p1.plus(prevcylinderpoint)))
            vertices.push(new Vertex(p2.plus(prevcylinderpoint)))
            vertices.push(new Vertex(p2.plus(cylinderpoint)))
            polygons.push(new Polygon(vertices))
            let prevcospitch, prevsinpitch
            for (let slice2 = 0; slice2 <= qresolution; slice2++) {
              let pitch = 0.5 * Math.PI * slice2 / qresolution
              // let pitch = Math.asin(slice2/qresolution);
              let cospitch = Math.cos(pitch)
              let sinpitch = Math.sin(pitch)
              if (slice2 > 0) {
                vertices = []
                vertices.push(new Vertex(p1.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
                vertices.push(new Vertex(p1.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
                if (slice2 < qresolution) {
                  vertices.push(new Vertex(p1.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
                }
                vertices.push(new Vertex(p1.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
                polygons.push(new Polygon(vertices))
                vertices = []
                vertices.push(new Vertex(p2.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
                vertices.push(new Vertex(p2.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
                if (slice2 < qresolution) {
                  vertices.push(new Vertex(p2.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
                }
                vertices.push(new Vertex(p2.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
                vertices.reverse()
                polygons.push(new Polygon(vertices))
              }
              prevcospitch = cospitch
              prevsinpitch = sinpitch
            }
          }
          prevcylinderpoint = cylinderpoint
        }
        let result = CSG.fromPolygons(polygons)
        let ray = zvector.unit()
        let axisX = xvector.unit()
        result.properties.roundedCylinder = new Properties()
        result.properties.roundedCylinder.start = new Connector(p1, ray.negated(), axisX)
        result.properties.roundedCylinder.end = new Connector(p2, ray, axisX)
        result.properties.roundedCylinder.facepoint = p1.plus(xvector)
        return result
      }

      /** Construct an elliptic cylinder.
       * @param {Object} [options] - options for construction
       * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
       * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
       * @param {Vector2D} [options.radius=[1,1]] - radius of rounded ends, must be two dimensional array
       * @param {Vector2D} [options.radiusStart=[1,1]] - OPTIONAL radius of rounded start, must be two dimensional array
       * @param {Vector2D} [options.radiusEnd=[1,1]] - OPTIONAL radius of rounded end, must be two dimensional array
       * @param {Number} [options.resolution=defaultResolution2D] - number of polygons per 360 degree revolution
       * @returns {CSG} new 3D solid
       *
       * @example
       *     let cylinder = CSG.cylinderElliptic({
       *       start: [0, -10, 0],
       *       end: [0, 10, 0],
       *       radiusStart: [10,5],
       *       radiusEnd: [8,3],
       *       resolution: 16
       *     });
       */

      const cylinderElliptic = function (options) {
        let s = parseOptionAs3DVector(options, 'start', [0, -1, 0])
        let e = parseOptionAs3DVector(options, 'end', [0, 1, 0])
        let r = parseOptionAs2DVector(options, 'radius', [1, 1])
        let rEnd = parseOptionAs2DVector(options, 'radiusEnd', r)
        let rStart = parseOptionAs2DVector(options, 'radiusStart', r)

        if ((rEnd._x < 0) || (rStart._x < 0) || (rEnd._y < 0) || (rStart._y < 0)) {
          throw new Error('Radius should be non-negative')
        }
        if ((rEnd._x === 0 || rEnd._y === 0) && (rStart._x === 0 || rStart._y === 0)) {
          throw new Error('Either radiusStart or radiusEnd should be positive')
        }

        let slices = parseOptionAsInt(options, 'resolution', defaultResolution2D) // FIXME is this correct?
        let ray = e.minus(s)
        let axisZ = ray.unit() //, isY = (Math.abs(axisZ.y) > 0.5);
        let axisX = axisZ.randomNonParallelVector().unit()

        //  let axisX = new Vector3D(isY, !isY, 0).cross(axisZ).unit();
        let axisY = axisX.cross(axisZ).unit()
        let start = new Vertex(s)
        let end = new Vertex(e)
        let polygons = []

        function point(stack, slice, radius) {
          let angle = slice * Math.PI * 2
          let out = axisX.times(radius._x * Math.cos(angle)).plus(axisY.times(radius._y * Math.sin(angle)))
          let pos = s.plus(ray.times(stack)).plus(out)
          return new Vertex(pos)
        }
        for (let i = 0; i < slices; i++) {
          let t0 = i / slices
          let t1 = (i + 1) / slices

          if (rEnd._x === rStart._x && rEnd._y === rStart._y) {
            polygons.push(new Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]))
            polygons.push(new Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]))
            polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
          } else {
            if (rStart._x > 0) {
              polygons.push(new Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]))
              polygons.push(new Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]))
            }
            if (rEnd._x > 0) {
              polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
              polygons.push(new Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]))
            }
          }
        }
        let result = CSG.fromPolygons(polygons)
        result.properties.cylinder = new Properties()
        result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX)
        result.properties.cylinder.end = new Connector(e, axisZ, axisX)
        result.properties.cylinder.facepoint = s.plus(axisX.times(rStart))
        return result
      }

      /** Construct an axis-aligned solid rounded cuboid.
       * @param {Object} [options] - options for construction
       * @param {Vector3D} [options.center=[0,0,0]] - center of rounded cube
       * @param {Vector3D} [options.radius=[1,1,1]] - radius of rounded cube, single scalar is possible
       * @param {Number} [options.roundradius=0.2] - radius of rounded edges
       * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
       * @returns {CSG} new 3D solid
       *
       * @example
       * let cube = CSG.roundedCube({
       *   center: [2, 0, 2],
       *   radius: 15,
       *   roundradius: 2,
       *   resolution: 36,
       * });
       */
      const roundedCube = function (options) {
        let minRR = 1e-2 // minroundradius 1e-3 gives rounding errors already
        let center
        let cuberadius
        let corner1
        let corner2
        options = options || {}
        if (('corner1' in options) || ('corner2' in options)) {
          if (('center' in options) || ('radius' in options)) {
            throw new Error('roundedCube: should either give a radius and center parameter, or a corner1 and corner2 parameter')
          }
          corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0])
          corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1])
          center = corner1.plus(corner2).times(0.5)
          cuberadius = corner2.minus(corner1).times(0.5)
        } else {
          center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
          cuberadius = parseOptionAs3DVector(options, 'radius', [1, 1, 1])
        }
        cuberadius = cuberadius.abs() // negative radii make no sense
        let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
        if (resolution < 4) resolution = 4
        if (resolution % 2 === 1 && resolution < 8) resolution = 8 // avoid ugly
        let roundradius = parseOptionAs3DVector(options, 'roundradius', [0.2, 0.2, 0.2])
        // slight hack for now - total radius stays ok
        roundradius = Vector3D.Create(Math.max(roundradius.x, minRR), Math.max(roundradius.y, minRR), Math.max(roundradius.z, minRR))
        let innerradius = cuberadius.minus(roundradius)
        if (innerradius.x < 0 || innerradius.y < 0 || innerradius.z < 0) {
          throw new Error('roundradius <= radius!')
        }
        let res = sphere({ radius: 1, resolution: resolution })
        res = res.scale(roundradius)
        innerradius.x > EPS && (res = res.stretchAtPlane([1, 0, 0], [0, 0, 0], 2 * innerradius.x))
        innerradius.y > EPS && (res = res.stretchAtPlane([0, 1, 0], [0, 0, 0], 2 * innerradius.y))
        innerradius.z > EPS && (res = res.stretchAtPlane([0, 0, 1], [0, 0, 0], 2 * innerradius.z))
        res = res.translate([-innerradius.x + center.x, -innerradius.y + center.y, -innerradius.z + center.z])
        res = res.reTesselated()
        res.properties.roundedCube = new Properties()
        res.properties.roundedCube.center = new Vertex(center)
        res.properties.roundedCube.facecenters = [
          new Connector(new Vector3D([cuberadius.x, 0, 0]).plus(center), [1, 0, 0], [0, 0, 1]),
          new Connector(new Vector3D([-cuberadius.x, 0, 0]).plus(center), [-1, 0, 0], [0, 0, 1]),
          new Connector(new Vector3D([0, cuberadius.y, 0]).plus(center), [0, 1, 0], [0, 0, 1]),
          new Connector(new Vector3D([0, -cuberadius.y, 0]).plus(center), [0, -1, 0], [0, 0, 1]),
          new Connector(new Vector3D([0, 0, cuberadius.z]).plus(center), [0, 0, 1], [1, 0, 0]),
          new Connector(new Vector3D([0, 0, -cuberadius.z]).plus(center), [0, 0, -1], [1, 0, 0])
        ]
        return res
      }

      /** Create a polyhedron using Openscad style arguments.
       * Define face vertices clockwise looking from outside.
       * @param {Object} [options] - options for construction
       * @returns {CSG} new 3D solid
       */
      const polyhedron = function (options) {
        options = options || {}
        if (('points' in options) !== ('faces' in options)) {
          throw new Error("polyhedron needs 'points' and 'faces' arrays")
        }
        let vertices = parseOptionAs3DVectorList(options, 'points', [
          [1, 1, 0],
          [1, -1, 0],
          [-1, -1, 0],
          [-1, 1, 0],
          [0, 0, 1]
        ])
          .map(function (pt) {
            return new Vertex(pt)
          })
        let faces = parseOption(options, 'faces', [
          [0, 1, 4],
          [1, 2, 4],
          [2, 3, 4],
          [3, 0, 4],
          [1, 0, 3],
          [2, 1, 3]
        ])
        // Openscad convention defines inward normals - so we have to invert here
        faces.forEach(function (face) {
          face.reverse()
        })
        let polygons = faces.map(function (face) {
          return new Polygon(face.map(function (idx) {
            return vertices[idx]
          }))
        })

        // TODO: facecenters as connectors? probably overkill. Maybe centroid
        // the re-tesselation here happens because it's so easy for a user to
        // create parametrized polyhedrons that end up with 1-2 dimensional polygons.
        // These will create infinite loops at CSG.Tree()
        return CSG.fromPolygons(polygons).reTesselated()
      }

      module.exports = {
        cube,
        sphere,
        roundedCube,
        cylinder,
        roundedCylinder,
        cylinderElliptic,
        polyhedron
      }

    }, { "./CSG": 4, "./Properties": 9, "./connectors": 10, "./constants": 11, "./math/Polygon3": 20, "./math/Vector3": 23, "./math/Vertex3": 25, "./optionParsers": 29 }], 32: [function (require, module, exports) {
      const { _CSGDEBUG, EPS } = require('./constants')
      const Vertex = require('./math/Vertex3')
      const Polygon = require('./math/Polygon3')

      // Returns object:
      // .type:
      //   0: coplanar-front
      //   1: coplanar-back
      //   2: front
      //   3: back
      //   4: spanning
      // In case the polygon is spanning, returns:
      // .front: a Polygon of the front part
      // .back: a Polygon of the back part
      function splitPolygonByPlane(plane, polygon) {
        let result = {
          type: null,
          front: null,
          back: null
        }
        // cache in local lets (speedup):
        let planenormal = plane.normal
        let vertices = polygon.vertices
        let numvertices = vertices.length
        if (polygon.plane.equals(plane)) {
          result.type = 0
        } else {
          let thisw = plane.w
          let hasfront = false
          let hasback = false
          let vertexIsBack = []
          let MINEPS = -EPS
          for (let i = 0; i < numvertices; i++) {
            let t = planenormal.dot(vertices[i].pos) - thisw
            let isback = (t < 0)
            vertexIsBack.push(isback)
            if (t > EPS) hasfront = true
            if (t < MINEPS) hasback = true
          }
          if ((!hasfront) && (!hasback)) {
            // all points coplanar
            let t = planenormal.dot(polygon.plane.normal)
            result.type = (t >= 0) ? 0 : 1
          } else if (!hasback) {
            result.type = 2
          } else if (!hasfront) {
            result.type = 3
          } else {
            // spanning
            result.type = 4
            let frontvertices = []
            let backvertices = []
            let isback = vertexIsBack[0]
            for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
              let vertex = vertices[vertexindex]
              let nextvertexindex = vertexindex + 1
              if (nextvertexindex >= numvertices) nextvertexindex = 0
              let nextisback = vertexIsBack[nextvertexindex]
              if (isback === nextisback) {
                // line segment is on one side of the plane:
                if (isback) {
                  backvertices.push(vertex)
                } else {
                  frontvertices.push(vertex)
                }
              } else {
                // line segment intersects plane:
                let point = vertex.pos
                let nextpoint = vertices[nextvertexindex].pos
                let intersectionpoint = plane.splitLineBetweenPoints(point, nextpoint)
                let intersectionvertex = new Vertex(intersectionpoint)
                if (isback) {
                  backvertices.push(vertex)
                  backvertices.push(intersectionvertex)
                  frontvertices.push(intersectionvertex)
                } else {
                  frontvertices.push(vertex)
                  frontvertices.push(intersectionvertex)
                  backvertices.push(intersectionvertex)
                }
              }
              isback = nextisback
            } // for vertexindex
            // remove duplicate vertices:
            let EPS_SQUARED = EPS * EPS
            if (backvertices.length >= 3) {
              let prevvertex = backvertices[backvertices.length - 1]
              for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
                let vertex = backvertices[vertexindex]
                if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
                  backvertices.splice(vertexindex, 1)
                  vertexindex--
                }
                prevvertex = vertex
              }
            }
            if (frontvertices.length >= 3) {
              let prevvertex = frontvertices[frontvertices.length - 1]
              for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
                let vertex = frontvertices[vertexindex]
                if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
                  frontvertices.splice(vertexindex, 1)
                  vertexindex--
                }
                prevvertex = vertex
              }
            }
            if (frontvertices.length >= 3) {
              result.front = new Polygon(frontvertices, polygon.shared, polygon.plane)
            }
            if (backvertices.length >= 3) {
              result.back = new Polygon(backvertices, polygon.shared, polygon.plane)
            }
          }
        }
        return result
      }

      // # class PolygonTreeNode
      // This class manages hierarchical splits of polygons
      // At the top is a root node which doesn hold a polygon, only child PolygonTreeNodes
      // Below that are zero or more 'top' nodes; each holds a polygon. The polygons can be in different planes
      // splitByPlane() splits a node by a plane. If the plane intersects the polygon, two new child nodes
      // are created holding the splitted polygon.
      // getPolygons() retrieves the polygon from the tree. If for PolygonTreeNode the polygon is split but
      // the two split parts (child nodes) are still intact, then the unsplit polygon is returned.
      // This ensures that we can safely split a polygon into many fragments. If the fragments are untouched,
      //  getPolygons() will return the original unsplit polygon instead of the fragments.
      // remove() removes a polygon from the tree. Once a polygon is removed, the parent polygons are invalidated
      // since they are no longer intact.
      // constructor creates the root node:
      const PolygonTreeNode = function () {
        this.parent = null
        this.children = []
        this.polygon = null
        this.removed = false
      }

      PolygonTreeNode.prototype = {
        // fill the tree with polygons. Should be called on the root node only; child nodes must
        // always be a derivate (split) of the parent node.
        addPolygons: function (polygons) {
          if (!this.isRootNode())
          // new polygons can only be added to root node; children can only be splitted polygons
          {
            throw new Error('Assertion failed')
          }
          let _this = this
          polygons.map(function (polygon) {
            _this.addChild(polygon)
          })
        },

        // remove a node
        // - the siblings become toplevel nodes
        // - the parent is removed recursively
        remove: function () {
          if (!this.removed) {
            this.removed = true

            if (_CSGDEBUG) {
              if (this.isRootNode()) throw new Error('Assertion failed') // can't remove root node
              if (this.children.length) throw new Error('Assertion failed') // we shouldn't remove nodes with children
            }

            // remove ourselves from the parent's children list:
            let parentschildren = this.parent.children
            let i = parentschildren.indexOf(this)
            if (i < 0) throw new Error('Assertion failed')
            parentschildren.splice(i, 1)

            // invalidate the parent's polygon, and of all parents above it:
            this.parent.recursivelyInvalidatePolygon()
          }
        },

        isRemoved: function () {
          return this.removed
        },

        isRootNode: function () {
          return !this.parent
        },

        // invert all polygons in the tree. Call on the root node
        invert: function () {
          if (!this.isRootNode()) throw new Error('Assertion failed') // can only call this on the root node
          this.invertSub()
        },

        getPolygon: function () {
          if (!this.polygon) throw new Error('Assertion failed') // doesn't have a polygon, which means that it has been broken down
          return this.polygon
        },

        getPolygons: function (result) {
          let children = [this]
          let queue = [children]
          let i, j, l, node
          for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length
            children = queue[i]
            for (j = 0, l = children.length; j < l; j++) { // ok to cache length
              node = children[j]
              if (node.polygon) {
                // the polygon hasn't been broken yet. We can ignore the children and return our polygon:
                result.push(node.polygon)
              } else {
                // our polygon has been split up and broken, so gather all subpolygons from the children
                queue.push(node.children)
              }
            }
          }
        },

        // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
        // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
        // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
        //  and added to both arrays.
        splitByPlane: function (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
          if (this.children.length) {
            let queue = [this.children]
            let i
            let j
            let l
            let node
            let nodes
            for (i = 0; i < queue.length; i++) { // queue.length can increase, do not cache
              nodes = queue[i]
              for (j = 0, l = nodes.length; j < l; j++) { // ok to cache length
                node = nodes[j]
                if (node.children.length) {
                  queue.push(node.children)
                } else {
                  // no children. Split the polygon:
                  node._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)
                }
              }
            }
          } else {
            this._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)
          }
        },

        // only to be called for nodes with no children
        _splitByPlane: function (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
          let polygon = this.polygon
          if (polygon) {
            let bound = polygon.boundingSphere()
            let sphereradius = bound[1] + EPS // FIXME Why add imprecision?
            let planenormal = plane.normal
            let spherecenter = bound[0]
            let d = planenormal.dot(spherecenter) - plane.w
            if (d > sphereradius) {
              frontnodes.push(this)
            } else if (d < -sphereradius) {
              backnodes.push(this)
            } else {
              let splitresult = splitPolygonByPlane(plane, polygon)
              switch (splitresult.type) {
                case 0:
                  // coplanar front:
                  coplanarfrontnodes.push(this)
                  break

                case 1:
                  // coplanar back:
                  coplanarbacknodes.push(this)
                  break

                case 2:
                  // front:
                  frontnodes.push(this)
                  break

                case 3:
                  // back:
                  backnodes.push(this)
                  break

                case 4:
                  // spanning:
                  if (splitresult.front) {
                    let frontnode = this.addChild(splitresult.front)
                    frontnodes.push(frontnode)
                  }
                  if (splitresult.back) {
                    let backnode = this.addChild(splitresult.back)
                    backnodes.push(backnode)
                  }
                  break
              }
            }
          }
        },

        // PRIVATE methods from here:
        // add child to a node
        // this should be called whenever the polygon is split
        // a child should be created for every fragment of the split polygon
        // returns the newly created child
        addChild: function (polygon) {
          let newchild = new PolygonTreeNode()
          newchild.parent = this
          newchild.polygon = polygon
          this.children.push(newchild)
          return newchild
        },

        invertSub: function () {
          let children = [this]
          let queue = [children]
          let i, j, l, node
          for (i = 0; i < queue.length; i++) {
            children = queue[i]
            for (j = 0, l = children.length; j < l; j++) {
              node = children[j]
              if (node.polygon) {
                node.polygon = node.polygon.flipped()
              }
              queue.push(node.children)
            }
          }
        },

        recursivelyInvalidatePolygon: function () {
          let node = this
          while (node.polygon) {
            node.polygon = null
            if (node.parent) {
              node = node.parent
            }
          }
        }
      }

      // # class Tree
      // This is the root of a BSP tree
      // We are using this separate class for the root of the tree, to hold the PolygonTreeNode root
      // The actual tree is kept in this.rootnode
      const Tree = function (polygons) {
        this.polygonTree = new PolygonTreeNode()
        this.rootnode = new Node(null)
        if (polygons) this.addPolygons(polygons)
      }

      Tree.prototype = {
        invert: function () {
          this.polygonTree.invert()
          this.rootnode.invert()
        },

        // Remove all polygons in this BSP tree that are inside the other BSP tree
        // `tree`.
        clipTo: function (tree, alsoRemovecoplanarFront) {
          alsoRemovecoplanarFront = alsoRemovecoplanarFront ? true : false
          this.rootnode.clipTo(tree, alsoRemovecoplanarFront)
        },

        allPolygons: function () {
          let result = []
          this.polygonTree.getPolygons(result)
          return result
        },

        addPolygons: function (polygons) {
          let _this = this
          let polygontreenodes = polygons.map(function (p) {
            return _this.polygonTree.addChild(p)
          })
          this.rootnode.addPolygonTreeNodes(polygontreenodes)
        }
      }

      // # class Node
      // Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
      // by picking a polygon to split along.
      // Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in
      // this.polygontreenodes. Those PolygonTreeNodes are children of the owning
      // Tree.polygonTree
      // This is not a leafy BSP tree since there is
      // no distinction between internal and leaf nodes.
      const Node = function (parent) {
        this.plane = null
        this.front = null
        this.back = null
        this.polygontreenodes = []
        this.parent = parent
      }

      Node.prototype = {
        // Convert solid space to empty space and empty space to solid space.
        invert: function () {
          let queue = [this]
          let node
          for (let i = 0; i < queue.length; i++) {
            node = queue[i]
            if (node.plane) node.plane = node.plane.flipped()
            if (node.front) queue.push(node.front)
            if (node.back) queue.push(node.back)
            let temp = node.front
            node.front = node.back
            node.back = temp
          }
        },

        // clip polygontreenodes to our plane
        // calls remove() for all clipped PolygonTreeNodes
        clipPolygons: function (polygontreenodes, alsoRemovecoplanarFront) {
          let args = { 'node': this, 'polygontreenodes': polygontreenodes }
          let node
          let stack = []

          do {
            node = args.node
            polygontreenodes = args.polygontreenodes

            // begin "function"
            if (node.plane) {
              let backnodes = []
              let frontnodes = []
              let coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes
              let plane = node.plane
              let numpolygontreenodes = polygontreenodes.length
              for (let i = 0; i < numpolygontreenodes; i++) {
                let node1 = polygontreenodes[i]
                if (!node1.isRemoved()) {
                  node1.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes)
                }
              }

              if (node.front && (frontnodes.length > 0)) {
                stack.push({ 'node': node.front, 'polygontreenodes': frontnodes })
              }
              let numbacknodes = backnodes.length
              if (node.back && (numbacknodes > 0)) {
                stack.push({ 'node': node.back, 'polygontreenodes': backnodes })
              } else {
                // there's nothing behind this plane. Delete the nodes behind this plane:
                for (let i = 0; i < numbacknodes; i++) {
                  backnodes[i].remove()
                }
              }
            }
            args = stack.pop()
          } while (typeof (args) !== 'undefined')
        },

        // Remove all polygons in this BSP tree that are inside the other BSP tree
        // `tree`.
        clipTo: function (tree, alsoRemovecoplanarFront) {
          let node = this
          let stack = []
          do {
            if (node.polygontreenodes.length > 0) {
              tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront)
            }
            if (node.front) stack.push(node.front)
            if (node.back) stack.push(node.back)
            node = stack.pop()
          } while (typeof (node) !== 'undefined')
        },

        addPolygonTreeNodes: function (polygontreenodes) {
          let args = { 'node': this, 'polygontreenodes': polygontreenodes }
          let node
          let stack = []
          do {
            node = args.node
            polygontreenodes = args.polygontreenodes

            if (polygontreenodes.length === 0) {
              args = stack.pop()
              continue
            }
            let _this = node
            if (!node.plane) {
              let bestplane = polygontreenodes[0].getPolygon().plane
              node.plane = bestplane
            }
            let frontnodes = []
            let backnodes = []

            for (let i = 0, n = polygontreenodes.length; i < n; ++i) {
              polygontreenodes[i].splitByPlane(_this.plane, _this.polygontreenodes, backnodes, frontnodes, backnodes)
            }

            if (frontnodes.length > 0) {
              if (!node.front) node.front = new Node(node)
              stack.push({ 'node': node.front, 'polygontreenodes': frontnodes })
            }
            if (backnodes.length > 0) {
              if (!node.back) node.back = new Node(node)
              stack.push({ 'node': node.back, 'polygontreenodes': backnodes })
            }

            args = stack.pop()
          } while (typeof (args) !== 'undefined')
        },

        getParentPlaneNormals: function (normals, maxdepth) {
          if (maxdepth > 0) {
            if (this.parent) {
              normals.push(this.parent.plane.normal)
              this.parent.getParentPlaneNormals(normals, maxdepth - 1)
            }
          }
        }
      }

      module.exports = Tree

    }, { "./constants": 11, "./math/Polygon3": 20, "./math/Vertex3": 25 }], 33: [function (require, module, exports) {
      function fnNumberSort(a, b) {
        return a - b
      }

      function fnSortByIndex(a, b) {
        return a.index - b.index
      }

      const IsFloat = function (n) {
        return (!isNaN(n)) || (n === Infinity) || (n === -Infinity)
      }

      const solve2Linear = function (a, b, c, d, u, v) {
        let det = a * d - b * c
        let invdet = 1.0 / det
        let x = u * d - b * v
        let y = -u * c + a * v
        x *= invdet
        y *= invdet
        return [x, y]
      }

      function insertSorted(array, element, comparefunc) {
        let leftbound = 0
        let rightbound = array.length
        while (rightbound > leftbound) {
          let testindex = Math.floor((leftbound + rightbound) / 2)
          let testelement = array[testindex]
          let compareresult = comparefunc(element, testelement)
          if (compareresult > 0) // element > testelement
          {
            leftbound = testindex + 1
          } else {
            rightbound = testindex
          }
        }
        array.splice(leftbound, 0, element)
      }

      // Get the x coordinate of a point with a certain y coordinate, interpolated between two
      // points (CSG.Vector2D).
      // Interpolation is robust even if the points have the same y coordinate
      const interpolateBetween2DPointsForY = function (point1, point2, y) {
        let f1 = y - point1.y
        let f2 = point2.y - point1.y
        if (f2 < 0) {
          f1 = -f1
          f2 = -f2
        }
        let t
        if (f1 <= 0) {
          t = 0.0
        } else if (f1 >= f2) {
          t = 1.0
        } else if (f2 < 1e-10) { // FIXME Should this be CSG.EPS?
          t = 0.5
        } else {
          t = f1 / f2
        }
        let result = point1.x + t * (point2.x - point1.x)
        return result
      }

      module.exports = {
        fnNumberSort,
        fnSortByIndex,
        IsFloat,
        solve2Linear,
        insertSorted,
        interpolateBetween2DPointsForY
      }

    }, {}], 34: [function (require, module, exports) {
      const { EPS } = require('../constants')
      const Polygon = require('../math/Polygon3')
      const Plane = require('../math/Plane')

      function addSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) {
        let starttag = vertex0.getTag()
        let endtag = vertex1.getTag()
        if (starttag === endtag) throw new Error('Assertion failed')
        let newsidetag = starttag + '/' + endtag
        let reversesidetag = endtag + '/' + starttag
        if (reversesidetag in sidemap) {
          // we have a matching reverse oriented side.
          // Instead of adding the new side, cancel out the reverse side:
          // console.log("addSide("+newsidetag+") has reverse side:");
          deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex1, vertex0, null)
          return null
        }
        //  console.log("addSide("+newsidetag+")");
        let newsideobj = {
          vertex0: vertex0,
          vertex1: vertex1,
          polygonindex: polygonindex
        }
        if (!(newsidetag in sidemap)) {
          sidemap[newsidetag] = [newsideobj]
        } else {
          sidemap[newsidetag].push(newsideobj)
        }
        if (starttag in vertextag2sidestart) {
          vertextag2sidestart[starttag].push(newsidetag)
        } else {
          vertextag2sidestart[starttag] = [newsidetag]
        }
        if (endtag in vertextag2sideend) {
          vertextag2sideend[endtag].push(newsidetag)
        } else {
          vertextag2sideend[endtag] = [newsidetag]
        }
        return newsidetag
      }

      function deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) {
        let starttag = vertex0.getTag()
        let endtag = vertex1.getTag()
        let sidetag = starttag + '/' + endtag
        // console.log("deleteSide("+sidetag+")");
        if (!(sidetag in sidemap)) throw new Error('Assertion failed')
        let idx = -1
        let sideobjs = sidemap[sidetag]
        for (let i = 0; i < sideobjs.length; i++) {
          let sideobj = sideobjs[i]
          if (sideobj.vertex0 !== vertex0) continue
          if (sideobj.vertex1 !== vertex1) continue
          if (polygonindex !== null) {
            if (sideobj.polygonindex !== polygonindex) continue
          }
          idx = i
          break
        }
        if (idx < 0) throw new Error('Assertion failed')
        sideobjs.splice(idx, 1)
        if (sideobjs.length === 0) {
          delete sidemap[sidetag]
        }
        idx = vertextag2sidestart[starttag].indexOf(sidetag)
        if (idx < 0) throw new Error('Assertion failed')
        vertextag2sidestart[starttag].splice(idx, 1)
        if (vertextag2sidestart[starttag].length === 0) {
          delete vertextag2sidestart[starttag]
        }

        idx = vertextag2sideend[endtag].indexOf(sidetag)
        if (idx < 0) throw new Error('Assertion failed')
        vertextag2sideend[endtag].splice(idx, 1)
        if (vertextag2sideend[endtag].length === 0) {
          delete vertextag2sideend[endtag]
        }
      }

      /*
           fixTJunctions:
      
           Suppose we have two polygons ACDB and EDGF:
      
            A-----B
            |     |
            |     E--F
            |     |  |
            C-----D--G
      
           Note that vertex E forms a T-junction on the side BD. In this case some STL slicers will complain
           that the solid is not watertight. This is because the watertightness check is done by checking if
           each side DE is matched by another side ED.
      
           This function will return a new solid with ACDB replaced by ACDEB
      
           Note that this can create polygons that are slightly non-convex (due to rounding errors). Therefore the result should
           not be used for further CSG operations!
      */
      const fixTJunctions = function (fromPolygons, csg) {
        csg = csg.canonicalized()
        let sidemap = {}

        // STEP 1
        for (let polygonindex = 0; polygonindex < csg.polygons.length; polygonindex++) {
          let polygon = csg.polygons[polygonindex]
          let numvertices = polygon.vertices.length
          // should be true
          if (numvertices >= 3) {
            let vertex = polygon.vertices[0]
            let vertextag = vertex.getTag()
            for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
              let nextvertexindex = vertexindex + 1
              if (nextvertexindex === numvertices) nextvertexindex = 0
              let nextvertex = polygon.vertices[nextvertexindex]
              let nextvertextag = nextvertex.getTag()
              let sidetag = vertextag + '/' + nextvertextag
              let reversesidetag = nextvertextag + '/' + vertextag
              if (reversesidetag in sidemap) {
                // this side matches the same side in another polygon. Remove from sidemap:
                let ar = sidemap[reversesidetag]
                ar.splice(-1, 1)
                if (ar.length === 0) {
                  delete sidemap[reversesidetag]
                }
              } else {
                let sideobj = {
                  vertex0: vertex,
                  vertex1: nextvertex,
                  polygonindex: polygonindex
                }
                if (!(sidetag in sidemap)) {
                  sidemap[sidetag] = [sideobj]
                } else {
                  sidemap[sidetag].push(sideobj)
                }
              }
              vertex = nextvertex
              vertextag = nextvertextag
            }
          }
        }
        // STEP 2
        // now sidemap contains 'unmatched' sides
        // i.e. side AB in one polygon does not have a matching side BA in another polygon
        let vertextag2sidestart = {}
        let vertextag2sideend = {}
        let sidestocheck = {}
        let sidemapisempty = true
        for (let sidetag in sidemap) {
          sidemapisempty = false
          sidestocheck[sidetag] = true
          sidemap[sidetag].map(function (sideobj) {
            let starttag = sideobj.vertex0.getTag()
            let endtag = sideobj.vertex1.getTag()
            if (starttag in vertextag2sidestart) {
              vertextag2sidestart[starttag].push(sidetag)
            } else {
              vertextag2sidestart[starttag] = [sidetag]
            }
            if (endtag in vertextag2sideend) {
              vertextag2sideend[endtag].push(sidetag)
            } else {
              vertextag2sideend[endtag] = [sidetag]
            }
          })
        }

        // STEP 3 : if sidemap is not empty
        if (!sidemapisempty) {
          // make a copy of the polygons array, since we are going to modify it:
          let polygons = csg.polygons.slice(0)
          while (true) {
            let sidemapisempty = true
            for (let sidetag in sidemap) {
              sidemapisempty = false
              sidestocheck[sidetag] = true
            }
            if (sidemapisempty) break
            let donesomething = false
            while (true) {
              let sidetagtocheck = null
              for (let sidetag in sidestocheck) {
                sidetagtocheck = sidetag
                break // FIXME  : say what now ?
              }
              if (sidetagtocheck === null) break // sidestocheck is empty, we're done!
              let donewithside = true
              if (sidetagtocheck in sidemap) {
                let sideobjs = sidemap[sidetagtocheck]
                if (sideobjs.length === 0) throw new Error('Assertion failed')
                let sideobj = sideobjs[0]
                for (let directionindex = 0; directionindex < 2; directionindex++) {
                  let startvertex = (directionindex === 0) ? sideobj.vertex0 : sideobj.vertex1
                  let endvertex = (directionindex === 0) ? sideobj.vertex1 : sideobj.vertex0
                  let startvertextag = startvertex.getTag()
                  let endvertextag = endvertex.getTag()
                  let matchingsides = []
                  if (directionindex === 0) {
                    if (startvertextag in vertextag2sideend) {
                      matchingsides = vertextag2sideend[startvertextag]
                    }
                  } else {
                    if (startvertextag in vertextag2sidestart) {
                      matchingsides = vertextag2sidestart[startvertextag]
                    }
                  }
                  for (let matchingsideindex = 0; matchingsideindex < matchingsides.length; matchingsideindex++) {
                    let matchingsidetag = matchingsides[matchingsideindex]
                    let matchingside = sidemap[matchingsidetag][0]
                    let matchingsidestartvertex = (directionindex === 0) ? matchingside.vertex0 : matchingside.vertex1
                    let matchingsideendvertex = (directionindex === 0) ? matchingside.vertex1 : matchingside.vertex0
                    let matchingsidestartvertextag = matchingsidestartvertex.getTag()
                    let matchingsideendvertextag = matchingsideendvertex.getTag()
                    if (matchingsideendvertextag !== startvertextag) throw new Error('Assertion failed')
                    if (matchingsidestartvertextag === endvertextag) {
                      // matchingside cancels sidetagtocheck
                      deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, startvertex, endvertex, null)
                      deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, startvertex, null)
                      donewithside = false
                      directionindex = 2 // skip reverse direction check
                      donesomething = true
                      break
                    } else {
                      let startpos = startvertex.pos
                      let endpos = endvertex.pos
                      let checkpos = matchingsidestartvertex.pos
                      let direction = checkpos.minus(startpos)
                      // Now we need to check if endpos is on the line startpos-checkpos:
                      let t = endpos.minus(startpos).dot(direction) / direction.dot(direction)
                      if ((t > 0) && (t < 1)) {
                        let closestpoint = startpos.plus(direction.times(t))
                        let distancesquared = closestpoint.distanceToSquared(endpos)
                        if (distancesquared < (EPS * EPS)) {
                          // Yes it's a t-junction! We need to split matchingside in two:
                          let polygonindex = matchingside.polygonindex
                          let polygon = polygons[polygonindex]
                          // find the index of startvertextag in polygon:
                          let insertionvertextag = matchingside.vertex1.getTag()
                          let insertionvertextagindex = -1
                          for (let i = 0; i < polygon.vertices.length; i++) {
                            if (polygon.vertices[i].getTag() === insertionvertextag) {
                              insertionvertextagindex = i
                              break
                            }
                          }
                          if (insertionvertextagindex < 0) throw new Error('Assertion failed')
                          // split the side by inserting the vertex:
                          let newvertices = polygon.vertices.slice(0)
                          newvertices.splice(insertionvertextagindex, 0, endvertex)
                          let newpolygon = new Polygon(newvertices, polygon.shared /* polygon.plane */)

                          // calculate plane with differents point
                          if (isNaN(newpolygon.plane.w)) {
                            let found = false
                            let loop = function (callback) {
                              newpolygon.vertices.forEach(function (item) {
                                if (found) return
                                callback(item)
                              })
                            }

                            loop(function (a) {
                              loop(function (b) {
                                loop(function (c) {
                                  newpolygon.plane = Plane.fromPoints(a.pos, b.pos, c.pos)
                                  if (!isNaN(newpolygon.plane.w)) {
                                    found = true
                                  }
                                })
                              })
                            })
                          }
                          polygons[polygonindex] = newpolygon
                          // remove the original sides from our maps
                          // deleteSide(sideobj.vertex0, sideobj.vertex1, null)
                          deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, matchingside.vertex1, polygonindex)
                          let newsidetag1 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, endvertex, polygonindex)
                          let newsidetag2 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, matchingside.vertex1, polygonindex)
                          if (newsidetag1 !== null) sidestocheck[newsidetag1] = true
                          if (newsidetag2 !== null) sidestocheck[newsidetag2] = true
                          donewithside = false
                          directionindex = 2 // skip reverse direction check
                          donesomething = true
                          break
                        } // if(distancesquared < 1e-10)
                      } // if( (t > 0) && (t < 1) )
                    } // if(endingstidestartvertextag === endvertextag)
                  } // for matchingsideindex
                } // for directionindex
              } // if(sidetagtocheck in sidemap)
              if (donewithside) {
                delete sidestocheck[sidetagtocheck]
              }
            }
            if (!donesomething) break
          }
          let newcsg = fromPolygons(polygons)
          newcsg.properties = csg.properties
          newcsg.isCanonicalized = true
          newcsg.isRetesselated = true
          csg = newcsg
        }

        // FIXME : what is even the point of this ???
        /* sidemapisempty = true
        for (let sidetag in sidemap) {
          sidemapisempty = false
          break
        }
        */

        return csg
      }

      module.exports = fixTJunctions

    }, { "../constants": 11, "../math/Plane": 18, "../math/Polygon3": 20 }], 35: [function (require, module, exports) {
      const mimeType = 'application/dxf'

      function serialize(cagObject) {
        var paths = cagObject.getOutlinePaths()
        return PathsToDxf(paths)
      }

      function PathsToDxf(paths) {
        var str = '999\nDXF generated by OpenJsCad\n'
        str += '  0\nSECTION\n  2\nHEADER\n'
        str += '  0\nENDSEC\n'
        str += '  0\nSECTION\n  2\nTABLES\n'
        str += '  0\nTABLE\n  2\nLTYPE\n  70\n1\n'
        str += '  0\nLTYPE\n  2\nCONTINUOUS\n  3\nSolid Line\n  72\n65\n  73\n0\n  40\n0.0\n'
        str += '  0\nENDTAB\n'
        str += '  0\nTABLE\n  2\nLAYER\n  70\n1\n'
        str += '  0\nLAYER\n  2\nOpenJsCad\n  62\n7\n  6\ncontinuous\n'
        str += '  0\nENDTAB\n'
        str += '  0\nTABLE\n  2\nSTYLE\n  70\n0\n  0\nENDTAB\n'
        str += '  0\nTABLE\n  2\nVIEW\n  70\n0\n  0\nENDTAB\n'
        str += '  0\nENDSEC\n'
        str += '  0\nSECTION\n  2\nBLOCKS\n'
        str += '  0\nENDSEC\n'
        str += '  0\nSECTION\n  2\nENTITIES\n'
        paths.map(function (path) {
          var numpointsClosed = path.points.length + (path.closed ? 1 : 0)
          str += '  0\nLWPOLYLINE\n  8\nOpenJsCad\n  90\n' + numpointsClosed + '\n  70\n' + (path.closed ? 1 : 0) + '\n'
          for (var pointindex = 0; pointindex < numpointsClosed; pointindex++) {
            var pointindexwrapped = pointindex
            if (pointindexwrapped >= path.points.length) pointindexwrapped -= path.points.length
            var point = path.points[pointindexwrapped]
            str += ' 10\n' + point.x + '\n 20\n' + point.y + '\n 30\n0.0\n'
          }
        })
        str += '  0\nENDSEC\n  0\nEOF\n'
        return [str]
      }

      module.exports = {
        serialize,
        mimeType
      }

    }, {}], 36: [function (require, module, exports) {

      function deserialize(gcode, fn, options) {
        // http://reprap.org/wiki/G-code
        const defaults = { version: '0.0.0' }
        options = Object.assign({}, defaults, options)
        const { version } = options
        // just as experiment ...
        var l = gcode.split(/[\n]/) // for now just GCODE ASCII
        var srci = ''
        var d = 0
        var pos = []
        var lpos = []
        var le = 0
        var p = []
        var origin = [-100, -100]
        var layers = 0
        var lh = 0.35
        var lz = 0
        var ld = 0

        for (var i = 0; i < l.length; i++) {
          var val = ''
          var k
          var e = 0
          if (l[i].match(/^\s*;/)) { continue }
          var c = l[i].split(/\s+/)
          for (var j = 0; j < c.length; j++) {
            if (c[j].match(/G(\d+)/)) {
              var n = parseInt(RegExp.$1)
              if (n === 1) d++
              if (n === 90) pos.type = 'abs'
              if (n === 91) pos.type = 'rel'
            } else if (c[j].match(/M(\d+)/)) {
              let n = parseInt(RegExp.$1)
              if (n === 104 || n === 109) { k = 'temp' }
            } else if (c[j].match(/S([\d\.]+)/)) {
              var v = parseInt(RegExp.$1)
              if (k !== undefined) {
                val[k] = v
              }
            } else if (c[j].match(/([XYZE])([\-\d\.]+)/)) {
              var a = RegExp.$1
              let v = parseFloat(RegExp.$2)
              if (pos.type === 'abs') {
                if (d) pos[a] = v
              } else {
                if (d) pos[a] += v
              }
              // console.log(d,a,pos.E,lpos.E);
              if (d && a === 'E' && lpos.E === undefined) {
                lpos.E = pos.E
              }
              if (d && a === 'E' && (pos.E - lpos.E) > 0) {
                // console.log(pos.E,lpos.E);
                e++
              }
            }
          }
          if (d && pos.X && pos.Y) {
            if (e) {
              if (!le && lpos.X && lpos.Y) {
                // console.log(lpos.X,lpos.Y);
                p.push('[' + (lpos.X + origin[0]) + ',' + (lpos.Y + origin[1]) + ']')
              }
              p.push('[' + (pos.X + origin[0]) + ',' + (pos.Y + origin[1]) + ']')
            }
            if (!e && le && p.length > 1) {
              if (srci.length) srci += ',\n\t\t'
              if (pos.Z !== lz) {
                lh = pos.Z - lz
                layers++
              }
              srci += 'EX([' + p.join(', ') + '],{w: ' + lh * 1.1 + ', h:' + lh * 1.02 + ', fn:1, closed: false}).translate([0,0,' + pos['Z'] + '])'
              p = []
              lz = pos.Z
              // if(layers>2)
              //   break;
            }
            le = e
            lpos.X = pos.X
            lpos.Y = pos.Y
            lpos.Z = pos.Z
            lpos.E = pos.E
          }
          ld = d
        }

        var src = ''
        src += '// producer: OpenJSCAD Compatibility (' + version + ') GCode Importer\n'
        src += '// date: ' + (new Date()) + '\n'
        src += '// source: ' + fn + '\n'
        src += '\n'
        // if(err) src += "// WARNING: import errors: "+err+" (some triangles might be misaligned or missing)\n";
        src += '// layers: ' + layers + '\n'
        src += 'function main() {\n\tvar EX = function(p,opt) { return rectangular_extrude(p,opt); }\n\treturn ['
        src += srci
        src += '\n\t];\n}\n'
        return src
      }

      module.exports = {
        deserialize
      }

    }, {}], 37: [function (require, module, exports) {
      // BinaryReader
      // Refactored by Vjeux <vjeuxx@gmail.com>
      // http://blog.vjeux.com/2010/javascript/javascript-binary-reader.html

      // Original
      // + Jonas Raoni Soares Silva
      // @ http://jsfromhell.com/classes/binary-deserializer [rev. #1]

      function BinaryReader(data) {
        this._buffer = data
        this._pos = 0
      }

      BinaryReader.prototype = {
        /* Public */
        readInt8: function () { return this._decodeInt(8, true) },
        readUInt8: function () { return this._decodeInt(8, false) },
        readInt16: function () { return this._decodeInt(16, true) },
        readUInt16: function () { return this._decodeInt(16, false) },
        readInt32: function () { return this._decodeInt(32, true) },
        readUInt32: function () { return this._decodeInt(32, false) },

        readFloat: function () { return this._decodeFloat(23, 8) },
        readDouble: function () { return this._decodeFloat(52, 11) },

        readChar: function () { return this.readString(1) },
        readString: function (length) {
          this._checkSize(length * 8)
          var result = this._buffer.substr(this._pos, length)
          this._pos += length
          return result
        },

        seek: function (pos) {
          this._pos = pos
          this._checkSize(0)
        },

        getPosition: function () {
          return this._pos
        },

        getSize: function () {
          return this._buffer.length
        },

        /* Private */
        _decodeFloat: function (precisionBits, exponentBits) {
          var length = precisionBits + exponentBits + 1
          var size = length >> 3
          this._checkSize(length)

          var bias = Math.pow(2, exponentBits - 1) - 1
          var signal = this._readBits(precisionBits + exponentBits, 1, size)
          var exponent = this._readBits(precisionBits, exponentBits, size)
          var significand = 0
          var divisor = 2
          var curByte = 0 // length + (-precisionBits >> 3) - 1;
          do {
            var byteValue = this._readByte(++curByte, size)
            var startBit = precisionBits % 8 || 8
            var mask = 1 << startBit
            while (mask >>= 1) {
              if (byteValue & mask) {
                significand += 1 / divisor
              }
              divisor *= 2
            }
          } while (precisionBits -= startBit)

          this._pos += size

          return exponent === (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
            : (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
              : Math.pow(2, exponent - bias) * (1 + significand) : 0)
        },

        _decodeInt: function (bits, signed) {
          var x = this._readBits(0, bits, bits / 8)
          var max = Math.pow(2, bits)
          var result = signed && x >= max / 2 ? x - max : x

          this._pos += bits / 8
          return result
        },

        // shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)
        _shl: function (a, b) {
          for (++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) === 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
          return a
        },

        _readByte: function (i, size) {
          return this._buffer.charCodeAt(this._pos + size - i - 1) & 0xff
        },

        _readBits: function (start, length, size) {
          var offsetLeft = (start + length) % 8
          var offsetRight = start % 8
          var curByte = size - (start >> 3) - 1
          var lastByte = size + (-(start + length) >> 3)
          var diff = curByte - lastByte

          var sum = (this._readByte(curByte, size) >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1)

          if (diff && offsetLeft) {
            sum += (this._readByte(lastByte++, size) & ((1 << offsetLeft) - 1)) << (diff-- << 3) - offsetRight
          }

          while (diff) {
            sum += this._shl(this._readByte(lastByte++, size), (diff-- << 3) - offsetRight)
          }

          return sum
        },

        _checkSize: function (neededBits) {
          if (!(this._pos + Math.ceil(neededBits / 8) < this._buffer.length)) {
            // throw new Error("Index out of bound");
          }
        }
      }

      module.exports = BinaryReader

    }, {}], 38: [function (require, module, exports) {
      /**
       * wrapper around internal csg methods (in case they change) to make sure
       * it resuts in a manifold mesh
       * @constructor
       * @param {string} title - The title of the book.
       * @return {csg}
       */
      function ensureManifoldness(input) {
        const transform = input => {
          input = 'reTesselated' in input ? input.reTesselated() : input
          input = 'fixTJunctions' in input ? input.fixTJunctions() : input // fixTJunctions also calls this.canonicalized() so no need to do it twice
          return input
        }

        return input.constructor !== Array ? transform(input) : input.map(transform)
      }

      module.exports = ensureManifoldness

    }, {}], 39: [function (require, module, exports) {
      const makeBlob = require('./makeBlob')
      const BinaryReader = require('./BinaryReader')
      const ensureManifoldness = require('./ensureManifoldness')
      module.exports = { makeBlob, BinaryReader, ensureManifoldness }

    }, { "./BinaryReader": 37, "./ensureManifoldness": 38, "./makeBlob": 40 }], 40: [function (require, module, exports) {
      (function (Buffer) {
        (function () {
          /*
           * Blob.js
           * See https://developer.mozilla.org/en-US/docs/Web/API/Blob
           *
           * Node and Browserify Compatible
           *
           * Copyright (c) 2015 by Z3 Dev (@zdev/www.z3dev.jp)
           * License: MIT License
           *
           * This implementation uses the Buffer class for all storage.
           * See https://nodejs.org/api/buffer.html
           *
           * URL.createObjectURL(blob)
           *
           * History:
           * 2015/07/02: 0.0.1: contributed to OpenJSCAD.org CLI openjscad
           */

          function makeBlob(contents, options) {
            const blob = typeof window !== 'undefined' ? window.Blob : Blob
            return blob
          }

          function Blob(contents, options) {
            // make the optional options non-optional
            options = options || {}
            // number of bytes
            this.size = 0 // contents, not allocation
            // media type
            this.type = ''
            // readability state (CLOSED: true, OPENED: false)
            this.isClosed = false
            // encoding of given strings
            this.encoding = 'utf8'
            // storage
            this.buffer = null
            this.length = 32e+6 // allocation, not contents

            if (!contents) return
            if (!Array.isArray(contents)) return

            // process options if any
            if (options.type) {
              // TBD if type contains any chars outside range U+0020 to U+007E, then set type to the empty string
              // Convert every character in type to lowercase
              this.type = options.type.toLowerCase()
            }
            if (options.endings) {
              // convert the EOL on strings
            }
            if (options.encoding) {
              this.encoding = options.encoding.toLowerCase()
            }
            if (options.length) {
              this.length = options.length
            }

            let wbytes
            let object
            // convert the contents (String, ArrayBufferView, ArrayBuffer, Blob)
            this.buffer = Buffer.alloc(this.length) // new Buffer(this.length)
            var index = 0
            for (index = 0; index < contents.length; index++) {
              switch (typeof (contents[index])) {
                case 'string':
                  wbytes = this.buffer.write(contents[index], this.size, this.encoding)
                  this.size = this.size + wbytes
                  break
                case 'object':
                  object = contents[index] // this should be a reference to an object
                  if (Buffer.isBuffer(object)) {
                  }
                  if (object instanceof ArrayBuffer) {
                    var view = new DataView(object)
                    var bindex = 0
                    for (bindex = 0; bindex < object.byteLength; bindex++) {
                      var xbyte = view.getUint8(bindex)
                      wbytes = this.buffer.writeUInt8(xbyte, this.size, false)
                      this.size++
                    }
                  }
                  break
                default:
                  break
              }
            }
            return this
          }

          Blob.prototype = {
            asBuffer: function () {
              return this.buffer.slice(0, this.size)
            },

            slice: function (start, end, type) {
              start = start || 0
              end = end || this.size
              type = type || ''
              return new Blob()
            },

            close: function () {
              // if state of context objext is already CLOSED then return
              if (this.isClosed) return
              // set the readbility state of the context object to CLOSED and remove storage
              this.isClosed = true
            },

            toString: function () {
              return 'blob blob blob'
            }
          }

          module.exports = makeBlob

        }).call(this)
      }).call(this, require("buffer").Buffer)
    }, { "buffer": 106 }], 41: [function (require, module, exports) {
      const { makeBlob } = require('@jscad/io-utils')

      const dxfSerializer = require('@jscad/dxf-serializer')
      const jsonSerializer = require('@jscad/json-serializer')
      const stlSerializer = require('@jscad/stl-serializer')
      const svgSerializer = require('@jscad/svg-serializer')

      const gcodeDeSerializer = require('@jscad/gcode-deserializer')
      const jsonDeSerializer = require('@jscad/json-deserializer')
      const objDeSerializer = require('@jscad/obj-deserializer')
      const stlDeSerializer = require('@jscad/stl-deserializer')
      const svgDeSerializer = require('@jscad/svg-deserializer')

      module.exports = {
        makeBlob,
        dxfSerializer,
        jsonSerializer,
        stlSerializer,
        svgSerializer,

        gcodeDeSerializer,
        jsonDeSerializer,
        objDeSerializer,
        stlDeSerializer,
        svgDeSerializer
      }
      /* export {makeBlob} from './utils/Blob'
      
      import * as CAGToDxf from './serializers/CAGToDxf'
      import * as CAGToJson from './serializers/CAGToJson'
      import * as CAGToSvg from './serializers/CAGToSvg'
      import * as CSGToAMF from './serializers/CSGToAMF'
      import * as CSGToJson from './serializers/CSGToJson'
      import * as CSGToStla from './serializers/CSGToStla'
      import * as CSGToStlb from './serializers/CSGToStlb'
      import * as CSGToX3D from './serializers/CSGToX3D'
      
      export {CAGToDxf, CAGToJson, CAGToSvg, CSGToAMF, CSGToJson, CSGToStla, CSGToStlb, CSGToX3D}
      
      export {parseAMF} from './deserializers/parseAMF'
      export {parseGCode} from './deserializers/parseGCode'
      export {parseJSON} from './deserializers/parseJSON'
      export {parseOBJ} from './deserializers/parseOBJ'
      export {parseSTL} from './deserializers/parseSTL'
      export {parseSVG} from './deserializers/parseSVG' */

    }, { "@jscad/dxf-serializer": 35, "@jscad/gcode-deserializer": 36, "@jscad/io-utils": 39, "@jscad/json-deserializer": 42, "@jscad/json-serializer": 43, "@jscad/obj-deserializer": 44, "@jscad/stl-deserializer": 92, "@jscad/stl-serializer": 96, "@jscad/svg-deserializer": 99, "@jscad/svg-serializer": 103 }], 42: [function (require, module, exports) {
      /*
      ## License
      
      Copyright (c) 2016 Z3 Development https://github.com/z3dev
      
      All code released under MIT license
      
      History:
        2016/10/15: 0.5.2: initial version
      
      Notes:
      1) All functions extend other objects in order to maintain namespaces.
      */

      // import { CSG } from '@jscad/csg'
      const { CSG, CAG } = require('@jscad/csg')

      // //////////////////////////////////////////
      //
      // JSON (JavaScript Object Notation) is a lightweight data-interchange format
      // See http://json.org/
      //
      // //////////////////////////////////////////

      function toSourceCSGVertex(ver) {
        return 'new CSG.Vertex(new CSG.Vector3D(' + ver._x + ',' + ver._y + ',' + ver._z + '))'
      }

      // convert the give CSG object to JSCAD source
      function toSourceCSG(csg) {
        var code = '  var polygons = [];\n'
        csg.polygons.map(function (p) {
          code += '  poly = new CSG.Polygon([\n'
          for (var i = 0; i < p.vertices.length; i++) {
            code += '                         ' + toSourceCSGVertex(p.vertices[i].pos) + ',\n'
          }
          code += '                         ])'
          if (p.shared && p.shared.color && p.shared.color.length) {
            code += '.setColor(' + JSON.stringify(p.shared.color) + ');\n'
          } else {
            code += ';\n'
          }
          code += '  polygons.push(poly);\n'
        })
        code += '  return CSG.fromPolygons(polygons);\n'
        return code
      };

      function toSourceCAGVertex(ver) {
        return 'new CAG.Vertex(new CSG.Vector2D(' + ver.pos._x + ',' + ver.pos._y + '))'
      };
      function toSourceSide(side) {
        return 'new CAG.Side(' + toSourceCAGVertex(side.vertex0) + ',' + toSourceCAGVertex(side.vertex1) + ')'
      };

      // convert the give CAG object to JSCAD source
      function toSourceCAG(cag) {
        var code = '  var sides = [];\n'
        cag.sides.map(function (s) {
          code += '  sides.push(' + toSourceSide(s) + ');\n'
        })
        code += '  return CAG.fromSides(sides);\n'
        return code
      }

      // convert an anonymous CSG/CAG object to JSCAD source
      function toSource(obj) {
        if (obj.type && obj.type === 'csg') {
          var csg = CSG.fromObject(obj)
          return toSourceCSG(csg)
        }
        if (obj.type && obj.type === 'cag') {
          var cag = CAG.fromObject(obj)
          return toSourceCAG(cag)
        }
        return ''
      };

      //
      // deserialize the given JSON source and return a JSCAD script
      //
      // fn (optional) original filename of JSON source
      //
      function deserialize(src, fn, options) {
        fn = fn || 'amf'
        const defaults = { version: '0.0.0' }
        options = Object.assign({}, defaults, options)
        const { version } = options

        // convert the JSON into an anonymous object
        var obj = JSON.parse(src)
        // convert the internal objects to JSCAD code
        var code = ''
        code += '//\n'
        code += '// producer: OpenJSCAD.org ' + version + ' JSON Importer\n'
        code += '// date: ' + (new Date()) + '\n'
        code += '// source: ' + fn + '\n'
        code += '//\n'
        code += 'function main() {\n'
        code += toSource(obj)
        code += '};\n'
        return code
      };

      module.exports = {
        deserialize
      }

    }, { "@jscad/csg": 1 }], 43: [function (require, module, exports) {
      const { ensureManifoldness } = require('@jscad/io-utils')

      const mimeType = 'application/json'

      function fromCAG(CAG) {
        let str = '{ "type": "cag","sides": ['
        let comma = ''
        CAG.sides.map(
          function (side) {
            str += comma
            str += JSON.stringify(side)
            comma = ','
          }
        )
        str += '] }'
        return [str]
      }

      function fromCSG(CSG) {
        let str = '{ "type": "csg","polygons": ['
        let comma = ''
        CSG.polygons.map(
          function (polygon) {
            str += comma
            str += JSON.stringify(polygon)
            comma = ','
          }
        )
        str += '],'
        str += '"isCanonicalized": ' + JSON.stringify(CSG.isCanonicalized) + ','
        str += '"isRetesselated": ' + JSON.stringify(CSG.isRetesselated)
        str += '}'
        return [str]
      }

      function serialize(data, options) {
        return 'sides' in data ? fromCAG(data) : fromCSG(ensureManifoldness(data))
      }

      module.exports = {
        serialize,
        mimeType
      }

    }, { "@jscad/io-utils": 39 }], 44: [function (require, module, exports) {
      const { vt2jscad } = require('./vt2jscad')

      function deserialize(obj, fn, options) { // http://en.wikipedia.org/wiki/Wavefront_.obj_file
        const defaults = { version: '0.0.0' }
        options = Object.assign({}, defaults, options)
        const { version } = options

        var l = obj.split(/\n/)
        var v = []
        var f = []

        for (var i = 0; i < l.length; i++) {
          var s = l[i]
          var a = s.split(/\s+/)

          if (a[0] === 'v') {
            v.push([a[1], a[2], a[3]])
          } else if (a[0] === 'f') {
            var fc = []
            var skip = 0

            for (var j = 1; j < a.length; j++) {
              var c = a[j]
              c = c.replace(/\/.*$/, '') // -- if coord# is '840/840' -> 840
              c-- // -- starts with 1, but we start with 0
              if (c >= v.length) {
                skip++
              }
              if (skip === 0) {
                fc.push(c)
              }
            }
            // fc.reverse();
            if (skip === 0) {
              f.push(fc)
            }
          } else {
            // vn vt and all others disregarded
          }
        }
        var src = ''
        src += '// producer: OpenJSCAD Compatibility (' + version + ') Wavefront OBJ Importer\n'
        src += '// date: ' + (new Date()) + '\n'
        src += '// source: ' + fn + '\n'
        src += '\n'
        // if(err) src += "// WARNING: import errors: "+err+" (some triangles might be misaligned or missing)\n";
        src += '// objects: 1\n// object #1: polygons: ' + f.length + '\n\n'
        src += 'function main() { return '
        src += vt2jscad(v, f)
        src += '; }'
        return src
      }

      module.exports = {
        deserialize
      }

    }, { "./vt2jscad": 45 }], 45: [function (require, module, exports) {
      // vertices, triangles, normals and colors
      function vt2jscad(v, t, n, c) {
        let src = ''
        src += 'polyhedron({ points: [\n\t'
        for (let i = 0, j = 0; i < v.length; i++) {
          if (j++) src += ',\n\t'
          src += '[' + v[i] + ']' // .join(", ");
        }
        src += '],\n\tpolygons: [\n\t'
        for (let i = 0, j = 0; i < t.length; i++) {
          if (j++) src += ',\n\t'
          src += '[' + t[i] + ']' // .join(', ');
        }
        if (c && t.length === c.length) {
          src += '],\n\tcolors: [\n\t'
          for (let i = 0, j = 0; i < c.length; i++) {
            if (j++) src += ',\n\t'
            src += '[' + c[i] + ']' // .join(', ');
          }
        }
        src += '] })\n'
        return src
      }

      module.exports = {
        vt2jscad
      }

    }, {}], 46: [function (require, module, exports) {
      arguments[4][1][0].apply(exports, arguments)
    }, { "./src/CAG": 47, "./src/CAGFactories": 48, "./src/CSG": 49, "./src/CSGFactories": 50, "./src/Properties": 54, "./src/connectors": 55, "./src/constants": 56, "./src/debugHelpers": 57, "./src/math/Line2": 58, "./src/math/Line3": 59, "./src/math/Matrix4": 60, "./src/math/OrthoNormalBasis": 61, "./src/math/Path2": 62, "./src/math/Plane": 63, "./src/math/Polygon2": 64, "./src/math/Polygon3": 65, "./src/math/Side": 66, "./src/math/Vector2": 67, "./src/math/Vector3": 68, "./src/math/Vertex2": 69, "./src/math/Vertex3": 70, "./src/mutators": 73, "./src/primitives2d": 75, "./src/primitives3d": 76, "dup": 1 }], 47: [function (require, module, exports) {
      arguments[4][2][0].apply(exports, arguments)
    }, { "./CSG": 49, "./FuzzyFactory2d": 52, "./connectors": 55, "./constants": 56, "./math/OrthoNormalBasis": 61, "./math/Path2": 62, "./math/Polygon3": 65, "./math/Side": 66, "./math/Vector2": 67, "./math/Vector3": 68, "./math/Vertex2": 69, "./math/Vertex3": 70, "./math/lineUtils": 71, "./optionParsers": 74, "dup": 2 }], 48: [function (require, module, exports) {
      arguments[4][3][0].apply(exports, arguments)
    }, { "./CAG": 47, "./math/Path2": 62, "./math/Side": 66, "./math/Vector2": 67, "./math/Vertex2": 69, "dup": 3 }], 49: [function (require, module, exports) {
      arguments[4][4][0].apply(exports, arguments)
    }, { "./CAG": 47, "./FuzzyFactory3d": 53, "./Properties": 54, "./connectors": 55, "./constants": 56, "./math/Matrix4": 60, "./math/OrthoNormalBasis": 61, "./math/Plane": 63, "./math/Polygon3": 65, "./math/Vector2": 67, "./math/Vector3": 68, "./math/Vertex3": 70, "./math/polygonUtils": 72, "./trees": 77, "./utils": 78, "./utils/fixTJunctions": 79, "dup": 4 }], 50: [function (require, module, exports) {
      arguments[4][5][0].apply(exports, arguments)
    }, { "./CSG": 49, "./math/Plane": 63, "./math/Polygon2": 64, "./math/Polygon3": 65, "./math/Vector3": 68, "./math/Vertex3": 70, "dup": 5 }], 51: [function (require, module, exports) {
      arguments[4][6][0].apply(exports, arguments)
    }, { "dup": 6 }], 52: [function (require, module, exports) {
      arguments[4][7][0].apply(exports, arguments)
    }, { "./FuzzyFactory": 51, "./constants": 56, "./math/Side": 66, "dup": 7 }], 53: [function (require, module, exports) {
      arguments[4][8][0].apply(exports, arguments)
    }, { "./FuzzyFactory": 51, "./constants": 56, "./math/Polygon3": 65, "dup": 8 }], 54: [function (require, module, exports) {
      arguments[4][9][0].apply(exports, arguments)
    }, { "dup": 9 }], 55: [function (require, module, exports) {
      arguments[4][10][0].apply(exports, arguments)
    }, { "./CSG": 49, "./math/Line3": 59, "./math/Matrix4": 60, "./math/OrthoNormalBasis": 61, "./math/Plane": 63, "./math/Vector3": 68, "dup": 10 }], 56: [function (require, module, exports) {
      arguments[4][11][0].apply(exports, arguments)
    }, { "dup": 11 }], 57: [function (require, module, exports) {
      arguments[4][12][0].apply(exports, arguments)
    }, { "./CSG": 49, "./primitives3d": 76, "dup": 12 }], 58: [function (require, module, exports) {
      arguments[4][13][0].apply(exports, arguments)
    }, { "../utils": 78, "./Vector2": 67, "dup": 13 }], 59: [function (require, module, exports) {
      arguments[4][14][0].apply(exports, arguments)
    }, { "../constants": 56, "../utils": 78, "./Vector3": 68, "dup": 14 }], 60: [function (require, module, exports) {
      arguments[4][15][0].apply(exports, arguments)
    }, { "./OrthoNormalBasis": 61, "./Plane": 63, "./Vector2": 67, "./Vector3": 68, "dup": 15 }], 61: [function (require, module, exports) {
      arguments[4][16][0].apply(exports, arguments)
    }, { "./Line2": 58, "./Line3": 59, "./Matrix4": 60, "./Plane": 63, "./Vector2": 67, "./Vector3": 68, "dup": 16 }], 62: [function (require, module, exports) {
      arguments[4][17][0].apply(exports, arguments)
    }, { "../CAG": 47, "../constants": 56, "../optionParsers": 74, "./Side": 66, "./Vector2": 67, "./Vertex2": 69, "dup": 17 }], 63: [function (require, module, exports) {
      arguments[4][18][0].apply(exports, arguments)
    }, { "../constants": 56, "./Line3": 59, "./Vector3": 68, "dup": 18 }], 64: [function (require, module, exports) {
      arguments[4][19][0].apply(exports, arguments)
    }, { "../CAG": 47, "dup": 19 }], 65: [function (require, module, exports) {
      arguments[4][20][0].apply(exports, arguments)
    }, { "../CAG": 47, "../CAGFactories": 48, "../CSG": 49, "../constants": 56, "../utils": 78, "./Matrix4": 60, "./Plane": 63, "./Vector3": 68, "./Vertex3": 70, "dup": 20 }], 66: [function (require, module, exports) {
      arguments[4][21][0].apply(exports, arguments)
    }, { "../constants": 56, "./Polygon3": 65, "./Vector2": 67, "./Vertex2": 69, "./Vertex3": 70, "dup": 21 }], 67: [function (require, module, exports) {
      arguments[4][22][0].apply(exports, arguments)
    }, { "../utils": 78, "./Vector3": 68, "dup": 22 }], 68: [function (require, module, exports) {
      arguments[4][23][0].apply(exports, arguments)
    }, { "../utils": 78, "./Vector2": 67, "dup": 23 }], 69: [function (require, module, exports) {
      arguments[4][24][0].apply(exports, arguments)
    }, { "../constants": 56, "./Vector2": 67, "dup": 24 }], 70: [function (require, module, exports) {
      arguments[4][25][0].apply(exports, arguments)
    }, { "../constants": 56, "./Vector3": 68, "dup": 25 }], 71: [function (require, module, exports) {
      arguments[4][26][0].apply(exports, arguments)
    }, { "../constants": 56, "../utils": 78, "dup": 26 }], 72: [function (require, module, exports) {
      arguments[4][27][0].apply(exports, arguments)
    }, { "../constants": 56, "../utils": 78, "./Line2": 58, "./OrthoNormalBasis": 61, "./Polygon3": 65, "./Vector2": 67, "./Vertex3": 70, "dup": 27 }], 73: [function (require, module, exports) {
      arguments[4][28][0].apply(exports, arguments)
    }, { "./math/Matrix4": 60, "./math/Plane": 63, "./math/Vector3": 68, "dup": 28 }], 74: [function (require, module, exports) {
      arguments[4][29][0].apply(exports, arguments)
    }, { "./math/Vector2": 67, "./math/Vector3": 68, "dup": 29 }], 75: [function (require, module, exports) {
      arguments[4][30][0].apply(exports, arguments)
    }, { "./CAG": 47, "./CAGFactories": 48, "./constants": 56, "./math/Path2": 62, "./math/Vector2": 67, "./optionParsers": 74, "dup": 30 }], 76: [function (require, module, exports) {
      arguments[4][31][0].apply(exports, arguments)
    }, { "./CSG": 49, "./Properties": 54, "./connectors": 55, "./constants": 56, "./math/Polygon3": 65, "./math/Vector3": 68, "./math/Vertex3": 70, "./optionParsers": 74, "dup": 31 }], 77: [function (require, module, exports) {
      arguments[4][32][0].apply(exports, arguments)
    }, { "./constants": 56, "./math/Polygon3": 65, "./math/Vertex3": 70, "dup": 32 }], 78: [function (require, module, exports) {
      arguments[4][33][0].apply(exports, arguments)
    }, { "dup": 33 }], 79: [function (require, module, exports) {
      arguments[4][34][0].apply(exports, arguments)
    }, { "../constants": 56, "../math/Plane": 63, "../math/Polygon3": 65, "dup": 34 }], 80: [function (require, module, exports) {
      // color table from http://www.w3.org/TR/css3-color/
      const cssColors = {
        // basic color keywords
        'black': [0 / 255, 0 / 255, 0 / 255],
        'silver': [192 / 255, 192 / 255, 192 / 255],
        'gray': [128 / 255, 128 / 255, 128 / 255],
        'white': [255 / 255, 255 / 255, 255 / 255],
        'maroon': [128 / 255, 0 / 255, 0 / 255],
        'red': [255 / 255, 0 / 255, 0 / 255],
        'purple': [128 / 255, 0 / 255, 128 / 255],
        'fuchsia': [255 / 255, 0 / 255, 255 / 255],
        'green': [0 / 255, 128 / 255, 0 / 255],
        'lime': [0 / 255, 255 / 255, 0 / 255],
        'olive': [128 / 255, 128 / 255, 0 / 255],
        'yellow': [255 / 255, 255 / 255, 0 / 255],
        'navy': [0 / 255, 0 / 255, 128 / 255],
        'blue': [0 / 255, 0 / 255, 255 / 255],
        'teal': [0 / 255, 128 / 255, 128 / 255],
        'aqua': [0 / 255, 255 / 255, 255 / 255],
        // extended color keywords
        'aliceblue': [240 / 255, 248 / 255, 255 / 255],
        'antiquewhite': [250 / 255, 235 / 255, 215 / 255],
        // 'aqua': [ 0 / 255, 255 / 255, 255 / 255 ],
        'aquamarine': [127 / 255, 255 / 255, 212 / 255],
        'azure': [240 / 255, 255 / 255, 255 / 255],
        'beige': [245 / 255, 245 / 255, 220 / 255],
        'bisque': [255 / 255, 228 / 255, 196 / 255],
        // 'black': [ 0 / 255, 0 / 255, 0 / 255 ],
        'blanchedalmond': [255 / 255, 235 / 255, 205 / 255],
        // 'blue': [ 0 / 255, 0 / 255, 255 / 255 ],
        'blueviolet': [138 / 255, 43 / 255, 226 / 255],
        'brown': [165 / 255, 42 / 255, 42 / 255],
        'burlywood': [222 / 255, 184 / 255, 135 / 255],
        'cadetblue': [95 / 255, 158 / 255, 160 / 255],
        'chartreuse': [127 / 255, 255 / 255, 0 / 255],
        'chocolate': [210 / 255, 105 / 255, 30 / 255],
        'coral': [255 / 255, 127 / 255, 80 / 255],
        'cornflowerblue': [100 / 255, 149 / 255, 237 / 255],
        'cornsilk': [255 / 255, 248 / 255, 220 / 255],
        'crimson': [220 / 255, 20 / 255, 60 / 255],
        'cyan': [0 / 255, 255 / 255, 255 / 255],
        'darkblue': [0 / 255, 0 / 255, 139 / 255],
        'darkcyan': [0 / 255, 139 / 255, 139 / 255],
        'darkgoldenrod': [184 / 255, 134 / 255, 11 / 255],
        'darkgray': [169 / 255, 169 / 255, 169 / 255],
        'darkgreen': [0 / 255, 100 / 255, 0 / 255],
        'darkgrey': [169 / 255, 169 / 255, 169 / 255],
        'darkkhaki': [189 / 255, 183 / 255, 107 / 255],
        'darkmagenta': [139 / 255, 0 / 255, 139 / 255],
        'darkolivegreen': [85 / 255, 107 / 255, 47 / 255],
        'darkorange': [255 / 255, 140 / 255, 0 / 255],
        'darkorchid': [153 / 255, 50 / 255, 204 / 255],
        'darkred': [139 / 255, 0 / 255, 0 / 255],
        'darksalmon': [233 / 255, 150 / 255, 122 / 255],
        'darkseagreen': [143 / 255, 188 / 255, 143 / 255],
        'darkslateblue': [72 / 255, 61 / 255, 139 / 255],
        'darkslategray': [47 / 255, 79 / 255, 79 / 255],
        'darkslategrey': [47 / 255, 79 / 255, 79 / 255],
        'darkturquoise': [0 / 255, 206 / 255, 209 / 255],
        'darkviolet': [148 / 255, 0 / 255, 211 / 255],
        'deeppink': [255 / 255, 20 / 255, 147 / 255],
        'deepskyblue': [0 / 255, 191 / 255, 255 / 255],
        'dimgray': [105 / 255, 105 / 255, 105 / 255],
        'dimgrey': [105 / 255, 105 / 255, 105 / 255],
        'dodgerblue': [30 / 255, 144 / 255, 255 / 255],
        'firebrick': [178 / 255, 34 / 255, 34 / 255],
        'floralwhite': [255 / 255, 250 / 255, 240 / 255],
        'forestgreen': [34 / 255, 139 / 255, 34 / 255],
        // 'fuchsia': [ 255 / 255, 0 / 255, 255 / 255 ],
        'gainsboro': [220 / 255, 220 / 255, 220 / 255],
        'ghostwhite': [248 / 255, 248 / 255, 255 / 255],
        'gold': [255 / 255, 215 / 255, 0 / 255],
        'goldenrod': [218 / 255, 165 / 255, 32 / 255],
        // 'gray': [ 128 / 255, 128 / 255, 128 / 255 ],
        // 'green': [ 0 / 255, 128 / 255, 0 / 255 ],
        'greenyellow': [173 / 255, 255 / 255, 47 / 255],
        'grey': [128 / 255, 128 / 255, 128 / 255],
        'honeydew': [240 / 255, 255 / 255, 240 / 255],
        'hotpink': [255 / 255, 105 / 255, 180 / 255],
        'indianred': [205 / 255, 92 / 255, 92 / 255],
        'indigo': [75 / 255, 0 / 255, 130 / 255],
        'ivory': [255 / 255, 255 / 255, 240 / 255],
        'khaki': [240 / 255, 230 / 255, 140 / 255],
        'lavender': [230 / 255, 230 / 255, 250 / 255],
        'lavenderblush': [255 / 255, 240 / 255, 245 / 255],
        'lawngreen': [124 / 255, 252 / 255, 0 / 255],
        'lemonchiffon': [255 / 255, 250 / 255, 205 / 255],
        'lightblue': [173 / 255, 216 / 255, 230 / 255],
        'lightcoral': [240 / 255, 128 / 255, 128 / 255],
        'lightcyan': [224 / 255, 255 / 255, 255 / 255],
        'lightgoldenrodyellow': [250 / 255, 250 / 255, 210 / 255],
        'lightgray': [211 / 255, 211 / 255, 211 / 255],
        'lightgreen': [144 / 255, 238 / 255, 144 / 255],
        'lightgrey': [211 / 255, 211 / 255, 211 / 255],
        'lightpink': [255 / 255, 182 / 255, 193 / 255],
        'lightsalmon': [255 / 255, 160 / 255, 122 / 255],
        'lightseagreen': [32 / 255, 178 / 255, 170 / 255],
        'lightskyblue': [135 / 255, 206 / 255, 250 / 255],
        'lightslategray': [119 / 255, 136 / 255, 153 / 255],
        'lightslategrey': [119 / 255, 136 / 255, 153 / 255],
        'lightsteelblue': [176 / 255, 196 / 255, 222 / 255],
        'lightyellow': [255 / 255, 255 / 255, 224 / 255],
        // 'lime': [ 0 / 255, 255 / 255, 0 / 255 ],
        'limegreen': [50 / 255, 205 / 255, 50 / 255],
        'linen': [250 / 255, 240 / 255, 230 / 255],
        'magenta': [255 / 255, 0 / 255, 255 / 255],
        // 'maroon': [ 128 / 255, 0 / 255, 0 / 255 ],
        'mediumaquamarine': [102 / 255, 205 / 255, 170 / 255],
        'mediumblue': [0 / 255, 0 / 255, 205 / 255],
        'mediumorchid': [186 / 255, 85 / 255, 211 / 255],
        'mediumpurple': [147 / 255, 112 / 255, 219 / 255],
        'mediumseagreen': [60 / 255, 179 / 255, 113 / 255],
        'mediumslateblue': [123 / 255, 104 / 255, 238 / 255],
        'mediumspringgreen': [0 / 255, 250 / 255, 154 / 255],
        'mediumturquoise': [72 / 255, 209 / 255, 204 / 255],
        'mediumvioletred': [199 / 255, 21 / 255, 133 / 255],
        'midnightblue': [25 / 255, 25 / 255, 112 / 255],
        'mintcream': [245 / 255, 255 / 255, 250 / 255],
        'mistyrose': [255 / 255, 228 / 255, 225 / 255],
        'moccasin': [255 / 255, 228 / 255, 181 / 255],
        'navajowhite': [255 / 255, 222 / 255, 173 / 255],
        // 'navy': [ 0 / 255, 0 / 255, 128 / 255 ],
        'oldlace': [253 / 255, 245 / 255, 230 / 255],
        // 'olive': [ 128 / 255, 128 / 255, 0 / 255 ],
        'olivedrab': [107 / 255, 142 / 255, 35 / 255],
        'orange': [255 / 255, 165 / 255, 0 / 255],
        'orangered': [255 / 255, 69 / 255, 0 / 255],
        'orchid': [218 / 255, 112 / 255, 214 / 255],
        'palegoldenrod': [238 / 255, 232 / 255, 170 / 255],
        'palegreen': [152 / 255, 251 / 255, 152 / 255],
        'paleturquoise': [175 / 255, 238 / 255, 238 / 255],
        'palevioletred': [219 / 255, 112 / 255, 147 / 255],
        'papayawhip': [255 / 255, 239 / 255, 213 / 255],
        'peachpuff': [255 / 255, 218 / 255, 185 / 255],
        'peru': [205 / 255, 133 / 255, 63 / 255],
        'pink': [255 / 255, 192 / 255, 203 / 255],
        'plum': [221 / 255, 160 / 255, 221 / 255],
        'powderblue': [176 / 255, 224 / 255, 230 / 255],
        // 'purple': [ 128 / 255, 0 / 255, 128 / 255 ],
        // 'red': [ 255 / 255, 0 / 255, 0 / 255 ],
        'rosybrown': [188 / 255, 143 / 255, 143 / 255],
        'royalblue': [65 / 255, 105 / 255, 225 / 255],
        'saddlebrown': [139 / 255, 69 / 255, 19 / 255],
        'salmon': [250 / 255, 128 / 255, 114 / 255],
        'sandybrown': [244 / 255, 164 / 255, 96 / 255],
        'seagreen': [46 / 255, 139 / 255, 87 / 255],
        'seashell': [255 / 255, 245 / 255, 238 / 255],
        'sienna': [160 / 255, 82 / 255, 45 / 255],
        // 'silver': [ 192 / 255, 192 / 255, 192 / 255 ],
        'skyblue': [135 / 255, 206 / 255, 235 / 255],
        'slateblue': [106 / 255, 90 / 255, 205 / 255],
        'slategray': [112 / 255, 128 / 255, 144 / 255],
        'slategrey': [112 / 255, 128 / 255, 144 / 255],
        'snow': [255 / 255, 250 / 255, 250 / 255],
        'springgreen': [0 / 255, 255 / 255, 127 / 255],
        'steelblue': [70 / 255, 130 / 255, 180 / 255],
        'tan': [210 / 255, 180 / 255, 140 / 255],
        // 'teal': [ 0 / 255, 128 / 255, 128 / 255 ],
        'thistle': [216 / 255, 191 / 255, 216 / 255],
        'tomato': [255 / 255, 99 / 255, 71 / 255],
        'turquoise': [64 / 255, 224 / 255, 208 / 255],
        'violet': [238 / 255, 130 / 255, 238 / 255],
        'wheat': [245 / 255, 222 / 255, 179 / 255],
        // 'white': [ 255 / 255, 255 / 255, 255 / 255 ],
        'whitesmoke': [245 / 255, 245 / 255, 245 / 255],
        // 'yellow': [ 255 / 255, 255 / 255, 0 / 255 ],
        'yellowgreen': [154 / 255, 205 / 255, 50 / 255]
      }

      /**
       * Converts an CSS color name to RGB color.
       *
       * @param   String  s       The CSS color name
       * @return  Array           The RGB representation, or [0,0,0] default
       */
      function css2rgb(s) {
        return cssColors[s.toLowerCase()]
      }

      // color( (array[r,g,b] | css-string) [,alpha] (,array[objects] | list of objects) )
      /** apply the given color to the input object(s)
       * @param {Object} color - either an array or a hex string of color values
       * @param {Object|Array} objects either a single or multiple CSG/CAG objects to color
       * @returns {CSG} new CSG object , with the given color
       *
       * @example
       * let redSphere = color([1,0,0,1], sphere())
       */
      function color(color) {
        let object
        let i = 1
        let a = arguments

        // assume first argument is RGB array
        // but check if first argument is CSS string
        if (typeof color === 'string') {
          color = css2rgb(color)
        }
        // check if second argument is alpha
        if (Number.isFinite(a[i])) {
          color = color.concat(a[i])
          i++
        }
        // check if next argument is an an array
        if (Array.isArray(a[i])) {
          a = a[i]
          i = 0
        } // use this as the list of objects
        for (object = a[i++]; i < a.length; i++) {
          object = object.union(a[i])
        }
        return object.setColor(color)
      }

      // from http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
      /**
       * Converts an RGB color value to HSL. Conversion formula
       * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
       * Assumes r, g, and b are contained in the set [0, 1] and
       * returns h, s, and l in the set [0, 1].
       *
       * @param   Number  r       The red color value
       * @param   Number  g       The green color value
       * @param   Number  b       The blue color value
       * @return  Array           The HSL representation
       */
      function rgb2hsl(r, g, b) {
        if (r.length) {
          b = r[2]
          g = r[1]
          r = r[0]
        }
        let max = Math.max(r, g, b)
        let min = Math.min(r, g, b)
        let h
        let s
        let l = (max + min) / 2

        if (max === min) {
          h = s = 0 // achromatic
        } else {
          let d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0)
              break
            case g:
              h = (b - r) / d + 2
              break
            case b:
              h = (r - g) / d + 4
              break
          }
          h /= 6
        }

        return [h, s, l]
      }

      /**
       * Converts an HSL color value to RGB. Conversion formula
       * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
       * Assumes h, s, and l are contained in the set [0, 1] and
       * returns r, g, and b in the set [0, 1].
       *
       * @param   Number  h       The hue
       * @param   Number  s       The saturation
       * @param   Number  l       The lightness
       * @return  Array           The RGB representation
       */
      function hsl2rgb(h, s, l) {
        if (h.length) {
          h = h[0]
          s = h[1]
          l = h[2]
        }
        let r
        let g
        let b

        if (s === 0) {
          r = g = b = l // achromatic
        } else {
          let q = l < 0.5 ? l * (1 + s) : l + s - l * s
          let p = 2 * l - q
          r = hue2rgb(p, q, h + 1 / 3)
          g = hue2rgb(p, q, h)
          b = hue2rgb(p, q, h - 1 / 3)
        }

        return [r, g, b]
      }

      function hue2rgb(p, q, t) {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      /**
       * Converts an RGB color value to HSV. Conversion formula
       * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
       * Assumes r, g, and b are contained in the set [0, 1] and
       * returns h, s, and v in the set [0, 1].
       *
       * @param   Number  r       The red color value
       * @param   Number  g       The green color value
       * @param   Number  b       The blue color value
       * @return  Array           The HSV representation
       */

      function rgb2hsv(r, g, b) {
        if (r.length) {
          r = r[0]
          g = r[1]
          b = r[2]
        }
        let max = Math.max(r, g, b)
        let min = Math.min(r, g, b)
        let h
        let s
        let v = max

        let d = max - min
        s = max === 0 ? 0 : d / max

        if (max === min) {
          h = 0 // achromatic
        } else {
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0)
              break
            case g:
              h = (b - r) / d + 2
              break
            case b:
              h = (r - g) / d + 4
              break
          }
          h /= 6
        }

        return [h, s, v]
      }

      /**
       * Converts an HSV color value to RGB. Conversion formula
       * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
       * Assumes h, s, and v are contained in the set [0, 1] and
       * returns r, g, and b in the set [0, 1].
       *
       * @param   Number  h       The hue
       * @param   Number  s       The saturation
       * @param   Number  v       The value
       * @return  Array           The RGB representation
       */
      function hsv2rgb(h, s, v) {
        if (h.length) {
          h = h[0]
          s = h[1]
          v = h[2]
        }
        let r, g, b

        let i = Math.floor(h * 6)
        let f = h * 6 - i
        let p = v * (1 - s)
        let q = v * (1 - f * s)
        let t = v * (1 - (1 - f) * s)

        switch (i % 6) {
          case 0:
            r = v, g = t, b = p
            break
          case 1:
            r = q, g = v, b = p
            break
          case 2:
            r = p, g = v, b = t
            break
          case 3:
            r = p, g = q, b = v
            break
          case 4:
            r = t, g = p, b = v
            break
          case 5:
            r = v, g = p, b = q
            break
        }

        return [r, g, b]
      }

      /**
       * Converts a HTML5 color value (string) to RGB values
       * See the color input type of HTML5 forms
       * Conversion formula:
       * - split the string; "#RRGGBB" into RGB components
       * - convert the HEX value into RGB values
       */
      function html2rgb(s) {
        let r = 0
        let g = 0
        let b = 0
        if (s.length === 7) {
          r = parseInt('0x' + s.slice(1, 3)) / 255
          g = parseInt('0x' + s.slice(3, 5)) / 255
          b = parseInt('0x' + s.slice(5, 7)) / 255
        }
        return [r, g, b]
      }

      /**
       * Converts RGB color value to HTML5 color value (string)
       * Conversion forumla:
       * - convert R, G, B into HEX strings
       * - return HTML formatted string "#RRGGBB"
       */
      function rgb2html(r, g, b) {
        if (r.length) {
          r = r[0]
          g = r[1]
          b = r[2]
        }
        let s = '#' +
          Number(0x1000000 + r * 255 * 0x10000 + g * 255 * 0x100 + b * 255).toString(16).substring(1, 7)
        return s
      }

      module.exports = {
        css2rgb,
        color,
        rgb2hsl,
        hsl2rgb,
        rgb2hsv,
        hsv2rgb,
        html2rgb,
        rgb2html
      }

    }, {}], 81: [function (require, module, exports) {
      function echo() {
        console.warn('echo() will be deprecated in the near future: please use console.log/warn/error instead')
        var s = '', a = arguments
        for (var i = 0; i < a.length; i++) {
          if (i) s += ', '
          s += a[i]
        }
        // var t = (new Date()-global.time)/1000
        // console.log(t,s)
        console.log(s)
      }

      module.exports = {
        echo
      }

    }, {}], 82: [function (require, module, exports) {
      const { CSG } = require('@jscad/csg')

      // FIXME: this is to have more readable/less extremely verbose code below
      const vertexFromVectorArray = array => {
        return new CSG.Vertex(new CSG.Vector3D(array))
      }

      const polygonFromPoints = points => {
        // EEK talk about wrapping wrappers !
        const vertices = points.map(point => new CSG.Vertex(new CSG.Vector3D(point)))
        return new CSG.Polygon(vertices)
      }

      // Simplified, array vector rightMultiply1x3Vector
      const rightMultiply1x3VectorToArray = (matrix, vector) => {
        const [v0, v1, v2] = vector
        const v3 = 1
        let x = v0 * matrix.elements[0] + v1 * matrix.elements[1] + v2 * matrix.elements[2] + v3 * matrix.elements[3]
        let y = v0 * matrix.elements[4] + v1 * matrix.elements[5] + v2 * matrix.elements[6] + v3 * matrix.elements[7]
        let z = v0 * matrix.elements[8] + v1 * matrix.elements[9] + v2 * matrix.elements[10] + v3 * matrix.elements[11]
        let w = v0 * matrix.elements[12] + v1 * matrix.elements[13] + v2 * matrix.elements[14] + v3 * matrix.elements[15]

        // scale such that fourth element becomes 1:
        if (w !== 1) {
          const invw = 1.0 / w
          x *= invw
          y *= invw
          z *= invw
        }
        return [x, y, z]
      }

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max)
      }

      const cagToPointsArray = input => {
        let points
        if ('sides' in input) {//this is a cag
          points = []
          input.sides.forEach(side => {
            points.push([side.vertex0.pos.x, side.vertex0.pos.y])
            points.push([side.vertex1.pos.x, side.vertex1.pos.y])
          })
          // cag.sides.map(side => [side.vertex0.pos.x, side.vertex0.pos.y])
          //, side.vertex1.pos.x, side.vertex1.pos.y])
          // due to the logic of CAG.fromPoints()
          // move the first point to the last
          /* if (points.length > 0) {
            points.push(points.shift())
          } */
        } else if ('points' in input) {
          points = input.points.map(p => ([p.x, p.y]))
        }

        return points
      }

      const degToRad = deg => (Math.PI / 180) * deg

      module.exports = { cagToPointsArray, clamp, rightMultiply1x3VectorToArray, polygonFromPoints }
    }, { "@jscad/csg": 46 }], 83: [function (require, module, exports) {

      const primitives3d = require('./primitives3d')
      const primitives2d = require('./primitives2d')
      const booleanOps = require('./ops-booleans')
      const transformations = require('./ops-transformations')
      const extrusions = require('./ops-extrusions')
      const color = require('./color')
      const maths = require('./maths')
      const text = require('./text')
      const { echo } = require('./debug')

      // these are 'external' to this api and we basically just re-export for old api compatibility
      // ...needs to be reviewed
      const { CAG, CSG } = require('@jscad/csg')
      const { log } = require('./log') // FIXME: this is a duplicate of the one in openjscad itself,*/

      // mostly likely needs to be removed since it is in the OpenJsCad namespace anyway, leaving here
      // for now

      const exportedApi = {
        csg: { CAG, CSG },
        primitives2d,
        primitives3d,
        booleanOps,
        transformations,
        extrusions,
        color,
        maths,
        text,
        OpenJsCad: { OpenJsCad: { log } },
        debug: { echo }
      }

      module.exports = exportedApi

    }, { "./color": 80, "./debug": 81, "./log": 84, "./maths": 85, "./ops-booleans": 86, "./ops-extrusions": 87, "./ops-transformations": 88, "./primitives2d": 89, "./primitives3d": 90, "./text": 91, "@jscad/csg": 46 }], 84: [function (require, module, exports) {
      function log(txt) {
        var timeInMs = Date.now()
        var prevtime// OpenJsCad.log.prevLogTime
        if (!prevtime) prevtime = timeInMs
        var deltatime = timeInMs - prevtime
        log.prevLogTime = timeInMs
        var timefmt = (deltatime * 0.001).toFixed(3)
        txt = '[' + timefmt + '] ' + txt
        if ((typeof (console) === 'object') && (typeof (console.log) === 'function')) {
          console.log(txt)
        } else if ((typeof (self) === 'object') && (typeof (self.postMessage) === 'function')) {
          self.postMessage({ cmd: 'log', txt: txt })
        } else throw new Error('Cannot log')
      }

      // See Processor.setStatus()
      // Note: leave for compatibility
      function status(s) {
        log(s)
      }

      module.exports = {
        log,
        status
      }

    }, {}], 85: [function (require, module, exports) {
      // -- Math functions (360 deg based vs 2pi)
      function sin(a) {
        return Math.sin(a / 360 * Math.PI * 2)
      }
      function cos(a) {
        return Math.cos(a / 360 * Math.PI * 2)
      }
      function asin(a) {
        return Math.asin(a) / (Math.PI * 2) * 360
      }
      function acos(a) {
        return Math.acos(a) / (Math.PI * 2) * 360
      }
      function tan(a) {
        return Math.tan(a / 360 * Math.PI * 2)
      }
      function atan(a) {
        return Math.atan(a) / (Math.PI * 2) * 360
      }
      function atan2(a, b) {
        return Math.atan2(a, b) / (Math.PI * 2) * 360
      }
      function ceil(a) {
        return Math.ceil(a)
      }
      function floor(a) {
        return Math.floor(a)
      }
      function abs(a) {
        return Math.abs(a)
      }
      function min(a, b) {
        return a < b ? a : b
      }
      function max(a, b) {
        return a > b ? a : b
      }
      function rands(min, max, vn, seed) {
        // -- seed is ignored for now, FIX IT (requires reimplementation of random())
        //    see http://stackoverflow.com/questions/424292/how-to-create-my-own-javascript-random-number-generator-that-i-can-also-set-the
        var v = new Array(vn)
        for (var i = 0; i < vn; i++) {
          v[i] = Math.random() * (max - min) + min
        }
      }
      function log(a) {
        return Math.log(a)
      }
      function lookup(ix, v) {
        var r = 0
        for (var i = 0; i < v.length; i++) {
          var a0 = v[i]
          if (a0[0] >= ix) {
            i--
            a0 = v[i]
            var a1 = v[i + 1]
            var m = 0
            if (a0[0] !== a1[0]) {
              m = abs((ix - a0[0]) / (a1[0] - a0[0]))
            }
            // echo(">>",i,ix,a0[0],a1[0],";",m,a0[1],a1[1])
            if (m > 0) {
              r = a0[1] * (1 - m) + a1[1] * m
            } else {
              r = a0[1]
            }
            return r
          }
        }
        return r
      }

      function pow(a, b) {
        return Math.pow(a, b)
      }

      function sign(a) {
        return a < 0 ? -1 : (a > 1 ? 1 : 0)
      }

      function sqrt(a) {
        return Math.sqrt(a)
      }

      function round(a) {
        return floor(a + 0.5)
      }

      module.exports = {
        sin,
        cos,
        asin,
        acos,
        tan,
        atan,
        atan2,
        ceil,
        floor,
        abs,
        min,
        max,
        rands,
        log,
        lookup,
        pow,
        sign,
        sqrt,
        round
      }

    }, {}], 86: [function (require, module, exports) {
      const { CAG } = require('@jscad/csg')

      // -- 3D boolean operations

      // FIXME should this be lazy ? in which case, how do we deal with 2D/3D combined
      // TODO we should have an option to set behaviour as first parameter
      /** union/ combine the given shapes
       * @param {Object(s)|Array} objects - objects to combine : can be given
       * - one by one: union(a,b,c) or
       * - as an array: union([a,b,c])
       * @returns {CSG} new CSG object, the union of all input shapes
       *
       * @example
       * let unionOfSpherAndCube = union(sphere(), cube())
       */
      function union() {
        let options = {}
        const defaults = {
          extrude2d: false
        }
        let o
        let i = 0
        let a = arguments
        if (a[0].length) a = a[0]
        if ('extrude2d' in a[0]) { // first parameter is options
          options = Object.assign({}, defaults, a[0])
          o = a[i++]
        }

        o = a[i++]

        // TODO: add option to be able to set this?
        if ((typeof (a[i]) === 'object') && a[i] instanceof CAG && options.extrude2d) {
          o = a[i].extrude({ offset: [0, 0, 0.1] }) // -- convert a 2D shape to a thin solid, note: do not a[i] = a[i].extrude()
        }
        for (; i < a.length; i++) {
          let obj = a[i]

          if ((typeof (a[i]) === 'object') && a[i] instanceof CAG && options.extrude2d) {
            obj = a[i].extrude({ offset: [0, 0, 0.1] }) // -- convert a 2D shape to a thin solid:
          }
          o = o.union(obj)
        }
        return o
      }

      /** difference/ subtraction of the given shapes ie:
       * cut out C From B From A ie : a - b - c etc
       * @param {Object(s)|Array} objects - objects to subtract
       * can be given
       * - one by one: difference(a,b,c) or
       * - as an array: difference([a,b,c])
       * @returns {CSG} new CSG object, the difference of all input shapes
       *
       * @example
       * let differenceOfSpherAndCube = difference(sphere(), cube())
       */
      function difference() {
        let object
        let i = 0
        let a = arguments
        if (a[0].length) a = a[0]
        for (object = a[i++]; i < a.length; i++) {
          if (a[i] instanceof CAG) {
            object = object.subtract(a[i])
          } else {
            object = object.subtract(a[i].setColor(1, 1, 0)) // -- color the cuts
          }
        }
        return object
      }

      /** intersection of the given shapes: ie keep only the common parts between the given shapes
       * @param {Object(s)|Array} objects - objects to intersect
       * can be given
       * - one by one: intersection(a,b,c) or
       * - as an array: intersection([a,b,c])
       * @returns {CSG} new CSG object, the intersection of all input shapes
       *
       * @example
       * let intersectionOfSpherAndCube = intersection(sphere(), cube())
       */
      function intersection() {
        let object
        let i = 0
        let a = arguments
        if (a[0].length) a = a[0]
        for (object = a[i++]; i < a.length; i++) {
          if (a[i] instanceof CAG) {
            object = object.intersect(a[i])
          } else {
            object = object.intersect(a[i].setColor(1, 1, 0)) // -- color the cuts
          }
        }
        return object
      }

      module.exports = {
        union,
        difference,
        intersection
      }

    }, { "@jscad/csg": 46 }], 87: [function (require, module, exports) {
      const { CSG, CAG } = require('@jscad/csg')
      const { cagToPointsArray, clamp, rightMultiply1x3VectorToArray, polygonFromPoints } = require('./helpers')
      // -- 2D to 3D primitives

      // FIXME: right now linear & rotate extrude take params first, while rectangular_extrude
      // takes params second ! confusing and incoherent ! needs to be changed (BREAKING CHANGE !)

      /** linear extrusion of the input 2d shape
       * @param {Object} [options] - options for construction
       * @param {Float} [options.height=1] - height of the extruded shape
       * @param {Integer} [options.slices=10] - number of intermediary steps/slices
       * @param {Integer} [options.twist=0] - angle (in degrees to twist the extusion by)
       * @param {Boolean} [options.center=false] - whether to center extrusion or not
       * @param {CAG} baseShape input 2d shape
       * @returns {CSG} new extruded shape
       *
       * @example
       * let revolved = linear_extrude({height: 10}, square())
       */
      function linear_extrude(params, baseShape) {
        const defaults = {
          height: 1,
          slices: 10,
          twist: 0,
          center: false
        }
        /* convexity = 10, */
        const { height, twist, slices, center } = Object.assign({}, defaults, params)

        // if(params.convexity) convexity = params.convexity      // abandoned
        let output = baseShape.extrude({ offset: [0, 0, height], twistangle: twist, twiststeps: slices })
        if (center === true) {
          const b = output.getBounds() // b[0] = min, b[1] = max
          const offset = (b[1].plus(b[0])).times(-0.5)
          output = output.translate(offset)
        }
        return output
      }

      /** rotate extrusion / revolve of the given 2d shape
       * @param {Object} [options] - options for construction
       * @param {Integer} [options.fn=1] - resolution/number of segments of the extrusion
       * @param {Float} [options.startAngle=1] - start angle of the extrusion, in degrees
       * @param {Float} [options.angle=1] - angle of the extrusion, in degrees
       * @param {Float} [options.overflow='cap'] - what to do with points outside of bounds (+ / - x) :
       * defaults to capping those points to 0 (only supported behaviour for now)
       * @param {CAG} baseShape input 2d shape
       * @returns {CSG} new extruded shape
       *
       * @example
       * let revolved = rotate_extrude({fn: 10}, square())
       */
      function rotate_extrude(params, baseShape) {
        // note, we should perhaps alias this to revolve() as well
        const defaults = {
          fn: 32,
          startAngle: 0,
          angle: 360,
          overflow: 'cap'
        }
        params = Object.assign({}, defaults, params)
        let { fn, startAngle, angle, overflow } = params
        if (overflow !== 'cap') {
          throw new Error('only capping of overflowing points is supported !')
        }

        if (arguments.length < 2) { // FIXME: what the hell ??? just put params second !
          baseShape = params
        }
        // are we dealing with a positive or negative angle (for normals flipping)
        const flipped = angle > 0
        // limit actual angle between 0 & 360, regardless of direction
        const totalAngle = flipped ? clamp((startAngle + angle), 0, 360) : clamp((startAngle + angle), -360, 0)
        // adapt to the totalAngle : 1 extra segment per 45 degs if not 360 deg extrusion
        // needs to be at least one and higher then the input resolution
        const segments = Math.max(
          Math.floor(Math.abs(totalAngle) / 45),
          1,
          fn
        )
        // maximum distance per axis between two points before considering them to be the same
        const overlapTolerance = 0.00001
        // convert baseshape to just an array of points, easier to deal with
        let shapePoints = cagToPointsArray(baseShape)

        // determine if the rotate_extrude can be computed in the first place
        // ie all the points have to be either x > 0 or x < 0

        // generic solution to always have a valid solid, even if points go beyond x/ -x
        // 1. split points up between all those on the 'left' side of the axis (x<0) & those on the 'righ' (x>0)
        // 2. for each set of points do the extrusion operation IN OPOSITE DIRECTIONS
        // 3. union the two resulting solids

        // 1. alt : OR : just cap of points at the axis ?

        // console.log('shapePoints BEFORE', shapePoints, baseShape.sides)

        const pointsWithNegativeX = shapePoints.filter(x => x[0] < 0)
        const pointsWithPositiveX = shapePoints.filter(x => x[0] >= 0)
        const arePointsWithNegAndPosX = pointsWithNegativeX.length > 0 && pointsWithPositiveX.length > 0

        if (arePointsWithNegAndPosX && overflow === 'cap') {
          if (pointsWithNegativeX.length > pointsWithPositiveX.length) {
            shapePoints = shapePoints.map(function (point) {
              return [Math.min(point[0], 0), point[1]]
            })
          } else if (pointsWithPositiveX.length >= pointsWithNegativeX.length) {
            shapePoints = shapePoints.map(function (point) {
              return [Math.max(point[0], 0), point[1]]
            })
          }
        }

        // console.log('negXs', pointsWithNegativeX, 'pointsWithPositiveX', pointsWithPositiveX, 'arePointsWithNegAndPosX', arePointsWithNegAndPosX)
        //  console.log('shapePoints AFTER', shapePoints, baseShape.sides)

        let polygons = []

        // for each of the intermediary steps in the extrusion
        for (let i = 1; i < segments + 1; i++) {
          // for each side of the 2d shape
          for (let j = 0; j < shapePoints.length - 1; j++) {
            // 2 points of a side
            const curPoint = shapePoints[j]
            const nextPoint = shapePoints[j + 1]

            // compute matrix for current and next segment angle
            let prevMatrix = CSG.Matrix4x4.rotationZ((i - 1) / segments * angle + startAngle)
            let curMatrix = CSG.Matrix4x4.rotationZ(i / segments * angle + startAngle)

            const pointA = rightMultiply1x3VectorToArray(prevMatrix, [curPoint[0], 0, curPoint[1]])
            const pointAP = rightMultiply1x3VectorToArray(curMatrix, [curPoint[0], 0, curPoint[1]])
            const pointB = rightMultiply1x3VectorToArray(prevMatrix, [nextPoint[0], 0, nextPoint[1]])
            const pointBP = rightMultiply1x3VectorToArray(curMatrix, [nextPoint[0], 0, nextPoint[1]])

            // console.log(`point ${j} edge connecting ${j} to ${j + 1}`)
            let overlappingPoints = false
            if (Math.abs(pointA[0] - pointAP[0]) < overlapTolerance && Math.abs(pointB[1] - pointBP[1]) < overlapTolerance) {
              // console.log('identical / overlapping points (from current angle and next one), what now ?')
              overlappingPoints = true
            }

            // we do not generate a single quad because:
            // 1. it does not allow eliminating unneeded triangles in case of overlapping points
            // 2. the current cleanup routines of csg.js create degenerate shapes from those quads
            // let polyPoints = [pointA, pointB, pointBP, pointAP]
            // polygons.push(polygonFromPoints(polyPoints))

            if (flipped) {
              // CW
              polygons.push(polygonFromPoints([pointA, pointB, pointBP]))
              if (!overlappingPoints) {
                polygons.push(polygonFromPoints([pointBP, pointAP, pointA]))
              }
            } else {
              // CCW
              if (!overlappingPoints) {
                polygons.push(polygonFromPoints([pointA, pointAP, pointBP]))
              }
              polygons.push(polygonFromPoints([pointBP, pointB, pointA]))
            }
          }
          // if we do not do a full extrusion, we want caps at both ends (closed volume)
          if (Math.abs(angle) < 360) {
            // we need to recreate the side with capped points where applicable
            const sideShape = CAG.fromPoints(shapePoints)
            const endMatrix = CSG.Matrix4x4.rotationX(90).multiply(
              CSG.Matrix4x4.rotationZ(-startAngle)
            )
            const endCap = sideShape._toPlanePolygons({ flipped: flipped })
              .map(x => x.transform(endMatrix))

            const startMatrix = CSG.Matrix4x4.rotationX(90).multiply(
              CSG.Matrix4x4.rotationZ(-angle - startAngle)
            )
            const startCap = sideShape._toPlanePolygons({ flipped: !flipped })
              .map(x => x.transform(startMatrix))
            polygons = polygons.concat(endCap).concat(startCap)
          }
        }
        return CSG.fromPolygons(polygons).reTesselated().canonicalized()
      }

      /** rectangular extrusion of the given array of points
       * @param {Array} basePoints array of points (nested) to extrude from
       * layed out like [ [0,0], [10,0], [5,10], [0,10] ]
       * @param {Object} [options] - options for construction
       * @param {Float} [options.h=1] - height of the extruded shape
       * @param {Float} [options.w=10] - width of the extruded shape
       * @param {Integer} [options.fn=1] - resolution/number of segments of the extrusion
       * @param {Boolean} [options.closed=false] - whether to close the input path for the extrusion or not
       * @param {Boolean} [options.round=true] - whether to round the extrusion or not
       * @returns {CSG} new extruded shape
       *
       * @example
       * let revolved = rectangular_extrude({height: 10}, square())
       */
      function rectangular_extrude(basePoints, params) {
        const defaults = {
          w: 1,
          h: 1,
          fn: 8,
          closed: false,
          round: true
        }
        const { w, h, fn, closed, round } = Object.assign({}, defaults, params)
        return new CSG.Path2D(basePoints, closed).rectangularExtrude(w, h, fn, round)
      }

      module.exports = {
        linear_extrude,
        rotate_extrude,
        rectangular_extrude
      }

    }, { "./helpers": 82, "@jscad/csg": 46 }], 88: [function (require, module, exports) {
      const { CSG, CAG } = require('@jscad/csg')
      const { union } = require('./ops-booleans')
      // -- 3D transformations (OpenSCAD like notion)

      /** translate an object in 2D/3D space
       * @param {Object} vector - 3D vector to translate the given object(s) by
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to translate
       * @returns {CSG} new CSG object , translated by the given amount
       *
       * @example
       * let movedSphere = translate([10,2,0], sphere())
       */
      function translate(vector, ...objects) {      // v, obj or array
        // workaround needed to determine if we are dealing with an array of objects
        const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
        let object = _objects[0]

        if (_objects.length > 1) {
          for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
            object = object.union(_objects[i])
          }
        }
        return object.translate(vector)
      }

      /** scale an object in 2D/3D space
       * @param {Float|Array} scale - either an array or simple number to scale object(s) by
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to scale
       * @returns {CSG} new CSG object , scaled by the given amount
       *
       * @example
       * let scaledSphere = scale([0.2,15,1], sphere())
       */
      function scale(scale, ...objects) {         // v, obj or array
        const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
        let object = _objects[0]

        if (_objects.length > 1) {
          for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
            object = object.union(_objects[i])
          }
        }
        return object.scale(scale)
      }

      /** rotate an object in 2D/3D space
       * @param {Float|Array} rotation - either an array or simple number to rotate object(s) by
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to rotate
       * @returns {CSG} new CSG object , rotated by the given amount
       *
       * @example
       * let rotatedSphere = rotate([0.2,15,1], sphere())
       */
      function rotate() {
        let o
        let i
        let v
        let r = 1
        let a = arguments
        if (!a[0].length) {        // rotate(r,[x,y,z],o)
          r = a[0]
          v = a[1]
          i = 2
          if (a[2].length) { a = a[2]; i = 0 }
        } else {                   // rotate([x,y,z],o)
          v = a[0]
          i = 1
          if (a[1].length) { a = a[1]; i = 0 }
        }
        for (o = a[i++]; i < a.length; i++) {
          o = o.union(a[i])
        }
        if (r !== 1) {
          return o.rotateX(v[0] * r).rotateY(v[1] * r).rotateZ(v[2] * r)
        } else {
          return o.rotateX(v[0]).rotateY(v[1]).rotateZ(v[2])
        }
      }

      /** apply the given matrix transform to the given objects
       * @param {Array} matrix - the 4x4 matrix to apply, as a simple 1d array of 16 elements
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to transform
       * @returns {CSG} new CSG object , transformed
       *
       * @example
       * const angle = 45
       * let transformedShape = transform([
       * cos(angle), -sin(angle), 0, 10,
       * sin(angle),  cos(angle), 0, 20,
       * 0         ,           0, 1, 30,
       * 0,           0, 0,  1
       * ], sphere())
       */
      function transform(matrix, ...objects) { // v, obj or array
        const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
        let object = _objects[0]

        if (_objects.length > 1) {
          for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
            object = object.union(_objects[i])
          }
        }

        let transformationMatrix
        if (!Array.isArray(matrix)) {
          throw new Error('Matrix needs to be an array')
        }
        matrix.forEach(element => {
          if (!Number.isFinite(element)) {
            throw new Error('you can only use a flat array of valid, finite numbers (float and integers)')
          }
        })
        transformationMatrix = new CSG.Matrix4x4(matrix)
        return object.transform(transformationMatrix)
      }

      /** center an object in 2D/3D space
       * @param {Boolean|Array} axis - either an array or single boolean to indicate which axis you want to center on
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to translate
       * @returns {CSG} new CSG object , translated by the given amount
       *
       * @example
       * let movedSphere = center(false, sphere())
       */
      function center(axis, ...objects) { // v, obj or array
        const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
        let object = _objects[0]

        if (_objects.length > 1) {
          for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
            object = object.union(_objects[i])
          }
        }
        return object.center(axis)
      }

      /** mirror an object in 2D/3D space
       * @param {Array} vector - the axes to mirror the object(s) by
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to mirror
       * @returns {CSG} new CSG object , mirrored
       *
       * @example
       * let rotatedSphere = mirror([0.2,15,1], sphere())
       */
      function mirror(vector, ...objects) {
        const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
        let object = _objects[0]

        if (_objects.length > 1) {
          for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
            object = object.union(_objects[i])
          }
        }
        const plane = new CSG.Plane(new CSG.Vector3D(vector[0], vector[1], vector[2]).unit(), 0)
        return object.mirrored(plane)
      }

      /** expand an object in 2D/3D space
       * @param {float} radius - the radius to expand by
       * @param {Object} object a CSG/CAG objects to expand
       * @returns {CSG/CAG} new CSG/CAG object , expanded
       *
       * @example
       * let expanededShape = expand([0.2,15,1], sphere())
       */
      function expand(radius, n, object) {
        return object.expand(radius, n)
      }

      /** contract an object(s) in 2D/3D space
       * @param {float} radius - the radius to contract by
       * @param {Object} object a CSG/CAG objects to contract
       * @returns {CSG/CAG} new CSG/CAG object , contracted
       *
       * @example
       * let contractedShape = contract([0.2,15,1], sphere())
       */
      function contract(radius, n, object) {
        return object.contract(radius, n)
      }

      /** create a minkowski sum of the given shapes
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to create a hull around
       * @returns {CSG} new CSG object , mirrored
       *
       * @example
       * let hulled = hull(rect(), circle())
       */
      function minkowski() {
        console.log('minkowski() not yet implemented')
      }

      /** create a convex hull of the given shapes
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to create a hull around
       * @returns {CSG} new CSG object , a hull around the given shapes
       *
       * @example
       * let hulled = hull(rect(), circle())
       */
      function hull() {
        let pts = []

        let a = arguments
        if (a[0].length) a = a[0]
        let done = []

        for (let i = 0; i < a.length; i++) {              // extract all points of the CAG in the argument list
          let cag = a[i]
          if (!(cag instanceof CAG)) {
            throw new Error('ERROR: hull() accepts only 2D forms / CAG')
          }
          for (let j = 0; j < cag.sides.length; j++) {
            let x = cag.sides[j].vertex0.pos.x
            let y = cag.sides[j].vertex0.pos.y
            // avoid some coord to appear multiple times
            if (done['' + x + ',' + y]) {
              continue
            }
            pts.push({ x: x, y: y })
            done['' + x + ',' + y]++
            // echo(x,y);
          }
        }
        // echo(pts.length+" points in",pts);

        // from http://www.psychedelicdevelopment.com/grahamscan/
        //    see also at https://github.com/bkiers/GrahamScan/blob/master/src/main/cg/GrahamScan.java
        let ConvexHullPoint = function (i, a, d) {
          this.index = i
          this.angle = a
          this.distance = d

          this.compare = function (p) {
            if (this.angle < p.angle) {
              return -1
            } else if (this.angle > p.angle) {
              return 1
            } else {
              if (this.distance < p.distance) {
                return -1
              } else if (this.distance > p.distance) {
                return 1
              }
            }
            return 0
          }
        }

        let ConvexHull = function () {
          this.points = null
          this.indices = null

          this.getIndices = function () {
            return this.indices
          }

          this.clear = function () {
            this.indices = null
            this.points = null
          }

          this.ccw = function (p1, p2, p3) {
            let ccw = (this.points[p2].x - this.points[p1].x) * (this.points[p3].y - this.points[p1].y) -
              (this.points[p2].y - this.points[p1].y) * (this.points[p3].x - this.points[p1].x)
            // we need this, otherwise sorting never ends, see https://github.com/Spiritdude/OpenJSCAD.org/issues/18
            if (ccw < 1e-5) {
              return 0
            }
            return ccw
          }

          this.angle = function (o, a) {
            // return Math.atan((this.points[a].y-this.points[o].y) / (this.points[a].x - this.points[o].x));
            return Math.atan2((this.points[a].y - this.points[o].y), (this.points[a].x - this.points[o].x))
          }

          this.distance = function (a, b) {
            return ((this.points[b].x - this.points[a].x) * (this.points[b].x - this.points[a].x) +
              (this.points[b].y - this.points[a].y) * (this.points[b].y - this.points[a].y))
          }

          this.compute = function (_points) {
            this.indices = null
            if (_points.length < 3) {
              return
            }
            this.points = _points

            // Find the lowest point
            let min = 0
            for (let i = 1; i < this.points.length; i++) {
              if (this.points[i].y === this.points[min].y) {
                if (this.points[i].x < this.points[min].x) {
                  min = i
                }
              } else if (this.points[i].y < this.points[min].y) {
                min = i
              }
            }

            // Calculate angle and distance from base
            let al = []
            let ang = 0.0
            let dist = 0.0
            for (let i = 0; i < this.points.length; i++) {
              if (i === min) {
                continue
              }
              ang = this.angle(min, i)
              if (ang < 0) {
                ang += Math.PI
              }
              dist = this.distance(min, i)
              al.push(new ConvexHullPoint(i, ang, dist))
            }

            al.sort(function (a, b) { return a.compare(b) })

            // Create stack
            let stack = new Array(this.points.length + 1)
            let j = 2
            for (let i = 0; i < this.points.length; i++) {
              if (i === min) {
                continue
              }
              stack[j] = al[j - 2].index
              j++
            }
            stack[0] = stack[this.points.length]
            stack[1] = min

            let tmp
            let M = 2
            for (let i = 3; i <= this.points.length; i++) {
              while (this.ccw(stack[M - 1], stack[M], stack[i]) <= 0) {
                M--
              }
              M++
              tmp = stack[i]
              stack[i] = stack[M]
              stack[M] = tmp
            }

            this.indices = new Array(M)
            for (let i = 0; i < M; i++) {
              this.indices[i] = stack[i + 1]
            }
          }
        }

        let hull = new ConvexHull()

        hull.compute(pts)
        let indices = hull.getIndices()

        if (indices && indices.length > 0) {
          let ch = []
          for (let i = 0; i < indices.length; i++) {
            ch.push(pts[indices[i]])
          }
          return CAG.fromPoints(ch)
        }
      }

      /** create a chain hull of the given shapes
       * Originally "Whosa whatsis" suggested "Chain Hull" ,
       * as described at https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
       * essentially hull A+B, B+C, C+D and then union those
       * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to create a chain hull around
       * @returns {CSG} new CSG object ,which a chain hull of the inputs
       *
       * @example
       * let hulled = chain_hull(rect(), circle())
       */
      function chain_hull(params, objects) {
        /*
        const defaults = {
          closed: false
        }
        const closed = Object.assign({}, defaults, params) */
        let a = arguments
        let closed = false
        let j = 0

        if (a[j].closed !== undefined) {
          closed = a[j++].closed
        }

        if (a[j].length) { a = a[j] }

        let hulls = []
        let hullsAmount = a.length - (closed ? 0 : 1)
        for (let i = 0; i < hullsAmount; i++) {
          hulls.push(hull(a[i], a[(i + 1) % a.length]))
        }
        return union(hulls)
      }

      module.exports = {
        translate,
        center,
        scale,
        rotate,
        transform,
        mirror,
        expand,
        contract,
        minkowski,
        hull,
        chain_hull
      }

    }, { "./ops-booleans": 86, "@jscad/csg": 46 }], 89: [function (require, module, exports) {
      const { CAG } = require('@jscad/csg')

      // -- 2D primitives (OpenSCAD like notion)

      /** Construct a square/rectangle
       * @param {Object} [options] - options for construction
       * @param {Float} [options.size=1] - size of the square, either as array or scalar
       * @param {Boolean} [options.center=true] - wether to center the square/rectangle or not
       * @returns {CAG} new square
       *
       * @example
       * let square1 = square({
       *   size: 10
       * })
       */
      function square() {
        let v = [1, 1]
        let off
        let a = arguments
        let params = a[0]

        if (params && Number.isFinite(params)) v = [params, params]
        if (params && params.length) {
          v = a[0]
          params = a[1]
        }
        if (params && params.size && params.size.length) v = params.size

        off = [v[0] / 2, v[1] / 2]
        if (params && params.center === true) off = [0, 0]

        return CAG.rectangle({ center: off, radius: [v[0] / 2, v[1] / 2] })
      }

      /** Construct a circle
       * @param {Object} [options] - options for construction
       * @param {Float} [options.r=1] - radius of the circle
       * @param {Integer} [options.fn=32] - segments of circle (ie quality/ resolution)
       * @param {Boolean} [options.center=true] - wether to center the circle or not
       * @returns {CAG} new circle
       *
       * @example
       * let circle1 = circle({
       *   r: 10
       * })
       */
      function circle(params) {
        const defaults = {
          r: 1,
          fn: 32,
          center: false
        }
        let { r, fn, center } = Object.assign({}, defaults, params)
        if (params && !params.r && !params.fn && !params.center) r = params
        let offset = center === true ? [0, 0] : [r, r]
        return CAG.circle({ center: offset, radius: r, resolution: fn })
      }

      /** Construct a polygon either from arrays of paths and points, or just arrays of points
       * nested paths (multiple paths) and flat paths are supported
       * @param {Object} [options] - options for construction
       * @param {Array} [options.paths] - paths of the polygon : either flat or nested array
       * @param {Array} [options.points] - points of the polygon : either flat or nested array
       * @returns {CAG} new polygon
       *
       * @example
       * let poly = polygon([0,1,2,3,4])
       * or 
       * let poly = polygon({path: [0,1,2,3,4]})
       * or 
       * let poly = polygon({path: [0,1,2,3,4], points: [2,1,3]})
       */
      function polygon(params) { // array of po(ints) and pa(ths)
        let points = []
        if (params.paths && params.paths.length && params.paths[0].length) { // pa(th): [[0,1,2],[2,3,1]] (two paths)
          for (let j = 0; j < params.paths.length; j++) {
            for (let i = 0; i < params.paths[j].length; i++) {
              points[i] = params.points[params.paths[j][i]]
            }
          }
        } else if (params.paths && params.paths.length) { // pa(th): [0,1,2,3,4] (single path)
          for (let i = 0; i < params.paths.length; i++) {
            points[i] = params.points[params.paths[i]]
          }
        } else { // pa(th) = po(ints)
          if (params.length) {
            points = params
          } else {
            points = params.points
          }
        }
        return CAG.fromPoints(points)
      }

      // FIXME: errr this is kinda just a special case of a polygon , why do we need it ?
      /** Construct a triangle
       * @returns {CAG} new triangle
       *
       * @example
       * let triangle = trangle({
       *   length: 10
       * })
       */
      function triangle() {
        let a = arguments
        if (a[0] && a[0].length) a = a[0]
        return CAG.fromPoints(a)
      }

      module.exports = {
        square,
        circle,
        polygon,
        triangle
      }

    }, { "@jscad/csg": 46 }], 90: [function (require, module, exports) {
      // -- 3D primitives (OpenSCAD like notion)
      const { CSG } = require('@jscad/csg')
      const { circle } = require('./primitives2d')
      const { rotate_extrude } = require('./ops-extrusions')
      const { translate, scale } = require('./ops-transformations')

      /** Construct a cuboid
       * @param {Object} [options] - options for construction
       * @param {Float} [options.size=1] - size of the side of the cuboid : can be either:
       * - a scalar : ie a single float, in which case all dimensions will be the same
       * - or an array: to specify different dimensions along x/y/z
       * @param {Integer} [options.fn=32] - segments of the sphere (ie quality/resolution)
       * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
       * @param {String} [options.type='normal'] - type of sphere : either 'normal' or 'geodesic'
       * @returns {CSG} new sphere
       *
       * @example
       * let cube1 = cube({
       *   r: 10,
       *   fn: 20
       * })
       */
      function cube(params) {
        const defaults = {
          size: 1,
          offset: [0, 0, 0],
          round: false,
          radius: 0,
          fn: 8
        }

        let { round, radius, fn, size } = Object.assign({}, defaults, params)
        let offset = [0, 0, 0]
        let v = null
        if (params && params.length) v = params
        if (params && params.size && params.size.length) v = params.size // { size: [1,2,3] }
        if (params && params.size && !params.size.length) size = params.size // { size: 1 }
        if (params && (typeof params !== 'object')) size = params// (2)
        if (params && params.round === true) {
          round = true
          radius = v && v.length ? (v[0] + v[1] + v[2]) / 30 : size / 10
        }
        if (params && params.radius) {
          round = true
          radius = params.radius
        }

        let x = size
        let y = size
        let z = size
        if (v && v.length) {
          [x, y, z] = v
        }
        offset = [x / 2, y / 2, z / 2] // center: false default
        let object = round
          ? CSG.roundedCube({ radius: [x / 2, y / 2, z / 2], roundradius: radius, resolution: fn })
          : CSG.cube({ radius: [x / 2, y / 2, z / 2] })
        if (params && params.center && params.center.length) {
          offset = [params.center[0] ? 0 : x / 2, params.center[1] ? 0 : y / 2, params.center[2] ? 0 : z / 2]
        } else if (params && params.center === true) {
          offset = [0, 0, 0]
        } else if (params && params.center === false) {
          offset = [x / 2, y / 2, z / 2]
        }
        return (offset[0] || offset[1] || offset[2]) ? translate(offset, object) : object
      }

      /** Construct a sphere
       * @param {Object} [options] - options for construction
       * @param {Float} [options.r=1] - radius of the sphere
       * @param {Integer} [options.fn=32] - segments of the sphere (ie quality/resolution)
       * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
       * @param {String} [options.type='normal'] - type of sphere : either 'normal' or 'geodesic'
       * @returns {CSG} new sphere
       *
       * @example
       * let sphere1 = sphere({
       *   r: 10,
       *   fn: 20
       * })
       */
      function sphere(params) {
        const defaults = {
          r: 1,
          fn: 32,
          type: 'normal'
        }

        let { r, fn, type } = Object.assign({}, defaults, params)
        let offset = [0, 0, 0] // center: false (default)
        if (params && (typeof params !== 'object')) {
          r = params
        }
        // let zoffset = 0 // sphere() in openscad has no center:true|false

        let output = type === 'geodesic' ? geodesicSphere(params) : CSG.sphere({ radius: r, resolution: fn })

        // preparing individual x,y,z center
        if (params && params.center && params.center.length) {
          offset = [params.center[0] ? 0 : r, params.center[1] ? 0 : r, params.center[2] ? 0 : r]
        } else if (params && params.center === true) {
          offset = [0, 0, 0]
        } else if (params && params.center === false) {
          offset = [r, r, r]
        }
        return (offset[0] || offset[1] || offset[2]) ? translate(offset, output) : output
      }

      function geodesicSphere(params) {
        const defaults = {
          r: 1,
          fn: 5
        }
        let { r, fn } = Object.assign({}, defaults, params)

        let ci = [ // hard-coded data of icosahedron (20 faces, all triangles)
          [0.850651, 0.000000, -0.525731],
          [0.850651, -0.000000, 0.525731],
          [-0.850651, -0.000000, 0.525731],
          [-0.850651, 0.000000, -0.525731],
          [0.000000, -0.525731, 0.850651],
          [0.000000, 0.525731, 0.850651],
          [0.000000, 0.525731, -0.850651],
          [0.000000, -0.525731, -0.850651],
          [-0.525731, -0.850651, -0.000000],
          [0.525731, -0.850651, -0.000000],
          [0.525731, 0.850651, 0.000000],
          [-0.525731, 0.850651, 0.000000]]

        let ti = [[0, 9, 1], [1, 10, 0], [6, 7, 0], [10, 6, 0], [7, 9, 0], [5, 1, 4], [4, 1, 9], [5, 10, 1], [2, 8, 3], [3, 11, 2], [2, 5, 4],
        [4, 8, 2], [2, 11, 5], [3, 7, 6], [6, 11, 3], [8, 7, 3], [9, 8, 4], [11, 10, 5], [10, 11, 6], [8, 9, 7]]

        let geodesicSubDivide = function (p, fn, offset) {
          let p1 = p[0]
          let p2 = p[1]
          let p3 = p[2]
          let n = offset
          let c = []
          let f = []

          //           p3
          //           /\
          //          /__\     fn = 3
          //      i  /\  /\
          //        /__\/__\       total triangles = 9 (fn*fn)
          //       /\  /\  /\
          //     0/__\/__\/__\
          //    p1 0   j      p2

          for (let i = 0; i < fn; i++) {
            for (let j = 0; j < fn - i; j++) {
              let t0 = i / fn
              let t1 = (i + 1) / fn
              let s0 = j / (fn - i)
              let s1 = (j + 1) / (fn - i)
              let s2 = fn - i - 1 ? j / (fn - i - 1) : 1
              let q = []

              q[0] = mix3(mix3(p1, p2, s0), p3, t0)
              q[1] = mix3(mix3(p1, p2, s1), p3, t0)
              q[2] = mix3(mix3(p1, p2, s2), p3, t1)

              // -- normalize
              for (let k = 0; k < 3; k++) {
                let r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])
                for (let l = 0; l < 3; l++) {
                  q[k][l] /= r
                }
              }
              c.push(q[0], q[1], q[2])
              f.push([n, n + 1, n + 2]); n += 3

              if (j < fn - i - 1) {
                let s3 = fn - i - 1 ? (j + 1) / (fn - i - 1) : 1
                q[0] = mix3(mix3(p1, p2, s1), p3, t0)
                q[1] = mix3(mix3(p1, p2, s3), p3, t1)
                q[2] = mix3(mix3(p1, p2, s2), p3, t1)

                // -- normalize
                for (let k = 0; k < 3; k++) {
                  let r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])
                  for (let l = 0; l < 3; l++) {
                    q[k][l] /= r
                  }
                }
                c.push(q[0], q[1], q[2])
                f.push([n, n + 1, n + 2]); n += 3
              }
            }
          }
          return { points: c, triangles: f, offset: n }
        }

        const mix3 = function (a, b, f) {
          let _f = 1 - f
          let c = []
          for (let i = 0; i < 3; i++) {
            c[i] = a[i] * _f + b[i] * f
          }
          return c
        }

        if (params) {
          if (params.fn) fn = Math.floor(params.fn / 6)
        }

        if (fn <= 0) fn = 1

        let c = []
        let f = []
        let offset = 0

        for (let i = 0; i < ti.length; i++) {
          let g = geodesicSubDivide([ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], fn, offset)
          c = c.concat(g.points)
          f = f.concat(g.triangles)
          offset = g.offset
        }
        return scale(r, polyhedron({ points: c, triangles: f }))
      }

      /** Construct a cylinder
       * @param {Object} [options] - options for construction
       * @param {Float} [options.r=1] - radius of the cylinder
       * @param {Float} [options.r1=1] - radius of the top of the cylinder
       * @param {Float} [options.r2=1] - radius of the bottom of the cylinder
       * @param {Float} [options.d=1] - diameter of the cylinder
       * @param {Float} [options.d1=1] - diameter of the top of the cylinder
       * @param {Float} [options.d2=1] - diameter of the bottom of the cylinder
       * @param {Integer} [options.fn=32] - number of sides of the cylinder (ie quality/resolution)
       * @returns {CSG} new cylinder
       *
       * @example
       * let cylinder = cylinder({
       *   d: 10,
       *   fn: 20
       * })
       */
      function cylinder(params) {
        const defaults = {
          r: 1,
          r1: 1,
          r2: 1,
          h: 1,
          fn: 32,
          round: false
        }
        let { r1, r2, h, fn, round } = Object.assign({}, defaults, params)
        let offset = [0, 0, 0]
        let a = arguments
        if (params && params.d) {
          r1 = r2 = params.d / 2
        }
        if (params && params.r) {
          r1 = params.r
          r2 = params.r
        }
        if (params && params.h) {
          h = params.h
        }
        if (params && (params.r1 || params.r2)) {
          r1 = params.r1
          r2 = params.r2
          if (params.h) h = params.h
        }
        if (params && (params.d1 || params.d2)) {
          r1 = params.d1 / 2
          r2 = params.d2 / 2
        }

        if (a && a[0] && a[0].length) {
          a = a[0]
          r1 = a[0]
          r2 = a[1]
          h = a[2]
          if (a.length === 4) fn = a[3]
        }

        let object
        if (params && (params.start && params.end)) {
          object = round
            ? CSG.roundedCylinder({ start: params.start, end: params.end, radiusStart: r1, radiusEnd: r2, resolution: fn })
            : CSG.cylinder({ start: params.start, end: params.end, radiusStart: r1, radiusEnd: r2, resolution: fn })
        } else {
          object = round
            ? CSG.roundedCylinder({ start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn })
            : CSG.cylinder({ start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn })
          let r = r1 > r2 ? r1 : r2
          if (params && params.center && params.center.length) { // preparing individual x,y,z center
            offset = [params.center[0] ? 0 : r, params.center[1] ? 0 : r, params.center[2] ? -h / 2 : 0]
          } else if (params && params.center === true) {
            offset = [0, 0, -h / 2]
          } else if (params && params.center === false) {
            offset = [0, 0, 0]
          }
          object = (offset[0] || offset[1] || offset[2]) ? translate(offset, object) : object
        }
        return object
      }

      /** Construct a torus
       * @param {Object} [options] - options for construction
       * @param {Float} [options.ri=1] - radius of base circle
       * @param {Float} [options.ro=4] - radius offset
       * @param {Integer} [options.fni=16] - segments of base circle (ie quality)
       * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
       * @param {Integer} [options.roti=0] - rotation angle of base circle
       * @returns {CSG} new torus
       *
       * @example
       * let torus1 = torus({
       *   ri: 10
       * })
       */
      function torus(params) {
        const defaults = {
          ri: 1,
          ro: 4,
          fni: 16,
          fno: 32,
          roti: 0
        }
        params = Object.assign({}, defaults, params)

        /* possible enhancements ? declarative limits
        const limits = {
          fni: {min: 3},
          fno: {min: 3}
        }*/

        let { ri, ro, fni, fno, roti } = params

        if (fni < 3) fni = 3
        if (fno < 3) fno = 3

        let baseCircle = circle({ r: ri, fn: fni, center: true })

        if (roti) baseCircle = baseCircle.rotateZ(roti)
        let result = rotate_extrude({ fn: fno }, translate([ro, 0, 0], baseCircle))
        // result = result.union(result)
        return result
      }

      /** Construct a polyhedron from the given triangles/ polygons/points
       * @param {Object} [options] - options for construction
       * @param {Array} [options.triangles] - triangles to build the polyhedron from
       * @param {Array} [options.polygons] - polygons to build the polyhedron from
       * @param {Array} [options.points] - points to build the polyhedron from
       * @param {Array} [options.colors] - colors to apply to the polyhedron
       * @returns {CSG} new polyhedron
       *
       * @example
       * let torus1 = polyhedron({
       *   points: [...]
       * })
       */
      function polyhedron(params) {
        let pgs = []
        let ref = params.triangles || params.polygons
        let colors = params.colors || null

        for (let i = 0; i < ref.length; i++) {
          let pp = []
          for (let j = 0; j < ref[i].length; j++) {
            pp[j] = params.points[ref[i][j]]
          }

          let v = []
          for (let j = ref[i].length - 1; j >= 0; j--) { // --- we reverse order for examples of OpenSCAD work
            v.push(new CSG.Vertex(new CSG.Vector3D(pp[j][0], pp[j][1], pp[j][2])))
          }
          let s = CSG.Polygon.defaultShared
          if (colors && colors[i]) {
            s = CSG.Polygon.Shared.fromColor(colors[i])
          }
          pgs.push(new CSG.Polygon(v, s))
        }

        return CSG.fromPolygons(pgs)
      }

      module.exports = {
        cube,
        sphere,
        geodesicSphere,
        cylinder,
        torus,
        polyhedron
      }

    }, { "./ops-extrusions": 87, "./ops-transformations": 88, "./primitives2d": 89, "@jscad/csg": 46 }], 91: [function (require, module, exports) {

      /** Construct a with, segments tupple from a character
       * @param {Float} x - x offset
       * @param {Float} y - y offset
       * @param {Float} char - character
       * @returns {Object} { width: X, segments: [...] }
       *
       * @example
       * let charData = vector_char(0, 12.2, 'b')
       */
      function vector_char(x, y, char) {
        char = char.charCodeAt(0)
        char -= 32
        if (char < 0 || char >= 95) return { width: 0, segments: [] }

        let off = char * 112
        let n = simplexFont[off++]
        let w = simplexFont[off++]
        let l = []
        let segs = []

        for (let i = 0; i < n; i++) {
          let xp = simplexFont[off + i * 2]
          let yp = simplexFont[off + i * 2 + 1]
          if (xp === -1 && yp === -1) {
            segs.push(l); l = []
          } else {
            l.push([xp + x, yp + y])
          }
        }
        if (l.length) segs.push(l)
        return { width: w, segments: segs }
      }

      /** Construct an array of with, segments tupple from a string
       * @param {Float} x - x offset
       * @param {Float} y - y offset
       * @param {Float} string - string
       * @returns {Array} [{ width: X, segments: [...] }]
       *
       * @example
       * let stringData = vector_text(0, 12.2, 'b')
       */
      function vector_text(x, y, string) {
        let output = []
        let x0 = x
        for (let i = 0; i < string.length; i++) {
          let char = string.charAt(i)
          if (char === '\n') {
            x = x0; y -= 30
          } else {
            let d = vector_char(x, y, char)
            x += d.width
            output = output.concat(d.segments)
          }
        }
        return output
      }

      // -- data below from http://paulbourke.net/dataformats/hershey/
      const simplexFont = [
        0, 16, /* Ascii 32 */
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 10, /* Ascii 33 */
        5, 21, 5, 7, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 16, /* Ascii 34 */
        4, 21, 4, 14, -1, -1, 12, 21, 12, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 21, /* Ascii 35 */
        11, 25, 4, -7, -1, -1, 17, 25, 10, -7, -1, -1, 4, 12, 18, 12, -1, -1, 3, 6, 17, 6, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        26, 20, /* Ascii 36 */
        8, 25, 8, -4, -1, -1, 12, 25, 12, -4, -1, -1, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3,
        18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0,
        8, 0, 5, 1, 3, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        31, 24, /* Ascii 37 */
        21, 21, 3, 0, -1, -1, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4,
        20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, -1, -1, 17, 7, 15, 6, 14, 4,
        14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        34, 26, /* Ascii 38 */
        23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5,
        1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21,
        9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 10, /* Ascii 39 */
        5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 14, /* Ascii 40 */
        11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 14, /* Ascii 41 */
        3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 16, /* Ascii 42 */
        8, 21, 8, 9, -1, -1, 3, 18, 13, 12, -1, -1, 13, 18, 3, 12, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 26, /* Ascii 43 */
        13, 18, 13, 0, -1, -1, 4, 9, 22, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 10, /* Ascii 44 */
        6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 26, /* Ascii 45 */
        4, 9, 22, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 10, /* Ascii 46 */
        5, 2, 4, 1, 5, 0, 6, 1, 5, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 22, /* Ascii 47 */
        20, 25, 2, -7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 20, /* Ascii 48 */
        9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17,
        9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 20, /* Ascii 49 */
        6, 17, 8, 18, 11, 21, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        14, 20, /* Ascii 50 */
        4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13,
        10, 3, 0, 17, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        15, 20, /* Ascii 51 */
        5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8,
        0, 5, 1, 4, 2, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        6, 20, /* Ascii 52 */
        13, 21, 3, 7, 18, 7, -1, -1, 13, 21, 13, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 20, /* Ascii 53 */
        15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14,
        1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        23, 20, /* Ascii 54 */
        16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11,
        0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 20, /* Ascii 55 */
        17, 21, 7, 0, -1, -1, 3, 21, 17, 21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        29, 20, /* Ascii 56 */
        8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16,
        2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13,
        15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        23, 20, /* Ascii 57 */
        16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9,
        21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 10, /* Ascii 58 */
        5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        14, 10, /* Ascii 59 */
        5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6,
        -1, 5, -3, 4, -4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 24, /* Ascii 60 */
        20, 18, 4, 9, 20, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 26, /* Ascii 61 */
        4, 12, 22, 12, -1, -1, 4, 6, 22, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 24, /* Ascii 62 */
        4, 18, 20, 9, 4, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        20, 18, /* Ascii 63 */
        3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13,
        12, 9, 10, 9, 7, -1, -1, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        55, 27, /* Ascii 64 */
        18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16,
        6, 17, 8, -1, -1, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, -1, -1, 18, 16, 17, 8,
        17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12,
        21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0,
        15, 0, 18, 1, 20, 2, 21, 3, -1, -1, 19, 16, 18, 8, 18, 6, 19, 5,
        8, 18, /* Ascii 65 */
        9, 21, 1, 0, -1, -1, 9, 21, 17, 0, -1, -1, 4, 7, 14, 7, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        23, 21, /* Ascii 66 */
        4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13,
        11, -1, -1, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        18, 21, /* Ascii 67 */
        18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5,
        3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        15, 21, /* Ascii 68 */
        4, 21, 4, 0, -1, -1, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16,
        3, 14, 1, 11, 0, 4, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 19, /* Ascii 69 */
        4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11, -1, -1, 4, 0, 17, 0, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 18, /* Ascii 70 */
        4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        22, 21, /* Ascii 71 */
        18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5,
        3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, -1, -1, 13, 8, 18, 8, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 22, /* Ascii 72 */
        4, 21, 4, 0, -1, -1, 18, 21, 18, 0, -1, -1, 4, 11, 18, 11, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 8, /* Ascii 73 */
        4, 21, 4, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 16, /* Ascii 74 */
        12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 21, /* Ascii 75 */
        4, 21, 4, 0, -1, -1, 18, 21, 4, 7, -1, -1, 9, 12, 18, 0, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 17, /* Ascii 76 */
        4, 21, 4, 0, -1, -1, 4, 0, 16, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 24, /* Ascii 77 */
        4, 21, 4, 0, -1, -1, 4, 21, 12, 0, -1, -1, 20, 21, 12, 0, -1, -1, 20, 21, 20, 0, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 22, /* Ascii 78 */
        4, 21, 4, 0, -1, -1, 4, 21, 18, 0, -1, -1, 18, 21, 18, 0, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        21, 22, /* Ascii 79 */
        9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15,
        1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        13, 21, /* Ascii 80 */
        4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13,
        10, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        24, 22, /* Ascii 81 */
        9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15,
        1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, -1, -1, 12, 4,
        18, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        16, 21, /* Ascii 82 */
        4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13,
        11, 4, 11, -1, -1, 11, 11, 18, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        20, 20, /* Ascii 83 */
        17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15,
        9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 16, /* Ascii 84 */
        8, 21, 8, 0, -1, -1, 1, 21, 15, 21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 22, /* Ascii 85 */
        4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 18, /* Ascii 86 */
        1, 21, 9, 0, -1, -1, 17, 21, 9, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 24, /* Ascii 87 */
        2, 21, 7, 0, -1, -1, 12, 21, 7, 0, -1, -1, 12, 21, 17, 0, -1, -1, 22, 21, 17, 0, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 20, /* Ascii 88 */
        3, 21, 17, 0, -1, -1, 17, 21, 3, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        6, 18, /* Ascii 89 */
        1, 21, 9, 11, 9, 0, -1, -1, 17, 21, 9, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 20, /* Ascii 90 */
        17, 21, 3, 0, -1, -1, 3, 21, 17, 21, -1, -1, 3, 0, 17, 0, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 14, /* Ascii 91 */
        4, 25, 4, -7, -1, -1, 5, 25, 5, -7, -1, -1, 4, 25, 11, 25, -1, -1, 4, -7, 11, -7, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 14, /* Ascii 92 */
        0, 21, 14, -3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 14, /* Ascii 93 */
        9, 25, 9, -7, -1, -1, 10, 25, 10, -7, -1, -1, 3, 25, 10, 25, -1, -1, 3, -7, 10, -7, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 16, /* Ascii 94 */
        6, 15, 8, 18, 10, 15, -1, -1, 3, 12, 8, 17, 13, 12, -1, -1, 8, 17, 8, 0, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 16, /* Ascii 95 */
        0, -2, 16, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 10, /* Ascii 96 */
        6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 19, /* Ascii 97 */
        15, 14, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4,
        3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 19, /* Ascii 98 */
        4, 21, 4, 0, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15,
        3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        14, 18, /* Ascii 99 */
        15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11,
        0, 13, 1, 15, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 19, /* Ascii 100 */
        15, 21, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4,
        3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 18, /* Ascii 101 */
        3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4,
        3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 12, /* Ascii 102 */
        10, 21, 8, 21, 6, 20, 5, 17, 5, 0, -1, -1, 2, 14, 9, 14, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        22, 19, /* Ascii 103 */
        15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, -1, -1, 15, 11, 13, 13, 11, 14, 8,
        14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 19, /* Ascii 104 */
        4, 21, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 8, /* Ascii 105 */
        3, 21, 4, 20, 5, 21, 4, 22, 3, 21, -1, -1, 4, 14, 4, 0, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 10, /* Ascii 106 */
        5, 21, 6, 20, 7, 21, 6, 22, 5, 21, -1, -1, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 17, /* Ascii 107 */
        4, 21, 4, 0, -1, -1, 14, 14, 4, 4, -1, -1, 8, 8, 15, 0, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 8, /* Ascii 108 */
        4, 21, 4, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        18, 30, /* Ascii 109 */
        4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, -1, -1, 15,
        10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 19, /* Ascii 110 */
        4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 19, /* Ascii 111 */
        8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16,
        6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 19, /* Ascii 112 */
        4, 14, 4, -7, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15,
        3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 19, /* Ascii 113 */
        15, 14, 15, -7, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4,
        3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 13, /* Ascii 114 */
        4, 14, 4, 0, -1, -1, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        17, 17, /* Ascii 115 */
        14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14,
        3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 12, /* Ascii 116 */
        5, 21, 5, 4, 6, 1, 8, 0, 10, 0, -1, -1, 2, 14, 9, 14, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 19, /* Ascii 117 */
        4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, -1, -1, 15, 14, 15, 0, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 16, /* Ascii 118 */
        2, 14, 8, 0, -1, -1, 14, 14, 8, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 22, /* Ascii 119 */
        3, 14, 7, 0, -1, -1, 11, 14, 7, 0, -1, -1, 11, 14, 15, 0, -1, -1, 19, 14, 15, 0, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 17, /* Ascii 120 */
        3, 14, 14, 0, -1, -1, 14, 14, 3, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 16, /* Ascii 121 */
        2, 14, 8, 0, -1, -1, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 17, /* Ascii 122 */
        14, 14, 3, 0, -1, -1, 3, 14, 14, 14, -1, -1, 3, 0, 14, 0, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        39, 14, /* Ascii 123 */
        9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, -1, -1, 7,
        24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3,
        8, 1, 7, 0, 6, -2, 6, -4, 7, -6, -1, -1, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5,
        -1, 5, -3, 6, -5, 7, -6, 9, -7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 8, /* Ascii 124 */
        4, 25, 4, -7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        39, 14, /* Ascii 125 */
        5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, -1, -1, 7,
        24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3,
        6, 1, 7, 0, 8, -2, 8, -4, 7, -6, -1, -1, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9,
        -1, 9, -3, 8, -5, 7, -6, 5, -7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        23, 24, /* Ascii 126 */
        3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, -1,
        -1, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
      ]

      module.exports = {
        vector_char,
        vector_text
      }

    }, {}], 92: [function (require, module, exports) {
      const { CSG } = require('@jscad/csg')
      const { vt2jscad } = require('./vt2jscad')
      const { BinaryReader } = require('@jscad/io-utils')

      // STL function from http://jsfiddle.net/Riham/yzvGD/35/
      // CC BY-SA by Riham
      // changes by Rene K. Mueller <spiritdude@gmail.com>
      // changes by Mark 'kaosat-dev' Moissette
      // 2017/10/14: refactoring, added support for CSG output etc
      // 2013/03/28: lot of rework and debugging included, and error handling
      // 2013/03/18: renamed functions, creating .jscad source direct via polyhedron()
      const echo = console.info

      function deserialize(stl, filename, options) {
        const defaults = { version: '0.0.0', addMetaData: true, output: 'jscad' }
        options = Object.assign({}, defaults, options)
        const { version, output, addMetaData } = options

        const isBinary = isDataBinaryRobust(stl)

        stl = isBinary && isBuffer(stl) ? bufferToBinaryString(stl) : stl

        const elementFormatterJscad = ({ vertices, triangles, normals, colors, index }) => `// object #${index}: triangles: ${triangles.length}\n${vt2jscad(vertices, triangles, null)}`
        const elementFormatterCSG = ({ vertices, triangles, normals, colors }) => polyhedron({ points: vertices, polygons: triangles })

        const deserializer = isBinary ? deserializeBinarySTL : deserializeAsciiSTL
        const elementFormatter = output === 'jscad' ? elementFormatterJscad : elementFormatterCSG
        const outputFormatter = output === 'jscad' ? formatAsJscad : formatAsCsg

        return outputFormatter(deserializer(stl, filename, version, elementFormatter), addMetaData, version, filename)

        /*
        if (err) src += '// WARNING: import errors: ' + err + ' (some triangles might be misaligned or missing)\n'
        src += '// objects: 1\n// object #1: triangles: ' + totalTriangles + '\n\n'
        src += 'function main() { return '
        src += vt2jscad(vertices, triangles, normals, colors)
        src += '; }' */
      }

      function bufferToBinaryString(buffer) {
        let binary = ''
        const bytes = new Uint8Array(buffer)
        let length = bytes.byteLength
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return binary
      }

      // taken from https://github.com/feross/is-buffer if we need it more than once, add as dep
      function isBuffer(obj) {
        return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
      }

      // transforms input to string if it was not already the case
      function ensureString(buf) {
        if (typeof buf !== 'string') {
          let arrayBuffer = new Uint8Array(buf)
          let str = ''
          for (let i = 0; i < buf.byteLength; i++) {
            str += String.fromCharCode(arrayBuffer[i]) // implicitly assumes little-endian
          }
          return str
        } else {
          return buf
        }
      }

      // reliable binary detection
      function isDataBinaryRobust(data) {
        // console.log('data is binary ?')
        const patternVertex = /vertex[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g
        const text = ensureString(data)
        const isBinary = patternVertex.exec(text) === null
        return isBinary
      }

      function formatAsJscad(data, addMetaData, version, filename) {
        let code = addMetaData ? `//
  // producer: OpenJSCAD.org Compatibility${version} STL Binary Importer
  // date: ${new Date()}
  // source: ${filename}
  //
  ` : ''

        return code + `function main() { return union(
// objects: ${data.length}
${data.join('\n')}); }
`
      }

      function formatAsCsg(data) {
        return new CSG().union(data)
      }

      function deserializeBinarySTL(stl, filename, version, elementFormatter, debug = false) {
        // -- This makes more sense if you read http://en.wikipedia.org/wiki/STL_(file_format)#Binary_STL
        let vertices = []
        let triangles = []
        let normals = []
        let colors = []
        let converted = 0
        let vertexIndex = 0
        let err = 0
        let mcolor = null
        let umask = parseInt('01000000000000000', 2)
        let rmask = parseInt('00000000000011111', 2)
        let gmask = parseInt('00000001111100000', 2)
        let bmask = parseInt('00111110000000000', 2)
        let br = new BinaryReader(stl)

        let m = 0
        let c = 0
        let r = 0
        let g = 0
        let b = 0
        let a = 0
        for (let i = 0; i < 80; i++) {
          switch (m) {
            case 6:
              r = br.readUInt8()
              m += 1
              continue
            case 7:
              g = br.readUInt8()
              m += 1
              continue
            case 8:
              b = br.readUInt8()
              m += 1
              continue
            case 9:
              a = br.readUInt8()
              m += 1
              continue
            default:
              c = br.readChar()
              switch (c) {
                case 'C':
                case 'O':
                case 'L':
                case 'R':
                case '=':
                  m += 1
                  break
                default:
                  break
              }
              break
          }
        }
        if (m === 10) { // create the default color
          mcolor = [r / 255, g / 255, b / 255, a / 255]
        }

        let totalTriangles = br.readUInt32() // Read # triangles

        for (let tr = 0; tr < totalTriangles; tr++) {
          if (debug) {
            if (tr % 100 === 0) console.info(`stl importer: converted ${converted} out of ${totalTriangles} triangles`)
          }
          /*
            REAL32[3] . Normal vector
            REAL32[3] . Vertex 1
            REAL32[3] . Vertex 2
            REAL32[3] . Vertex 3
            UINT16 . Attribute byte count */
          // -- Parse normal
          let no = []; no.push(br.readFloat()); no.push(br.readFloat()); no.push(br.readFloat())

          // -- Parse every 3 subsequent floats as a vertex
          let v1 = []; v1.push(br.readFloat()); v1.push(br.readFloat()); v1.push(br.readFloat())
          let v2 = []; v2.push(br.readFloat()); v2.push(br.readFloat()); v2.push(br.readFloat())
          let v3 = []; v3.push(br.readFloat()); v3.push(br.readFloat()); v3.push(br.readFloat())

          let skip = 0

          for (let i = 0; i < 3; i++) {
            if (isNaN(v1[i])) skip++
            if (isNaN(v2[i])) skip++
            if (isNaN(v3[i])) skip++
            if (isNaN(no[i])) skip++
          }
          if (skip > 0) {
            echo('bad triangle vertice coords/normal: ', skip)
          }

          err += skip
          // -- every 3 vertices create a triangle.
          let triangle = []; triangle.push(vertexIndex++); triangle.push(vertexIndex++); triangle.push(vertexIndex++)

          let abc = br.readUInt16()
          let color = null
          if (m === 10) {
            let u = (abc & umask) // 0 if color is unique for this triangle
            let r = (abc & rmask) / 31
            let g = ((abc & gmask) >>> 5) / 31
            let b = ((abc & bmask) >>> 10) / 31
            let a = 255
            if (u === 0) {
              color = [r, g, b, a]
            } else {
              color = mcolor
            }
            colors.push(color)
          }

          // -- Add 3 vertices for every triangle
          // -- TODO: OPTIMIZE: Check if the vertex is already in the array, if it is just reuse the index
          if (skip === 0) { // checking cw vs ccw, given all normal/vertice are valid
            // E1 = B - A
            // E2 = C - A
            // test = dot( Normal, cross( E1, E2 ) )
            // test > 0: cw, test < 0 : ccw
            let w1 = new CSG.Vector3D(v1)
            let w2 = new CSG.Vector3D(v2)
            let w3 = new CSG.Vector3D(v3)
            let e1 = w2.minus(w1)
            let e2 = w3.minus(w1)
            let t = new CSG.Vector3D(no).dot(e1.cross(e2))
            if (t > 0) { // 1,2,3 -> 3,2,1
              let tmp = v3
              v3 = v1
              v1 = tmp
            }
          }
          vertices.push(v1)
          vertices.push(v2)
          vertices.push(v3)
          triangles.push(triangle)
          normals.push(no)
          converted++
        }

        if (err) {
          console.warn(`WARNING: import errors: ${err} (some triangles might be misaligned or missing)`)
          // FIXME: this used to be added to the output script, which makes more sense
        }

        return [elementFormatter({ vertices, triangles, normals, colors })]
      }

      function deserializeAsciiSTL(stl, filename, version, elementFormatter) {
        let converted = 0
        let o

        // -- Find all models
        const objects = stl.split('endsolid')
        // src += '// objects: ' + (objects.length - 1) + '\n'
        let elements = []
        for (o = 1; o < objects.length; o++) {
          // -- Translation: a non-greedy regex for facet {...} endloop pattern
          let patt = /\bfacet[\s\S]*?endloop/mgi
          let vertices = []
          let triangles = []
          let normals = []
          let vertexIndex = 0
          let err = 0

          let match = stl.match(patt)
          if (match == null) continue
          for (let i = 0; i < match.length; i++) {
            // if(converted%100==0) status('stl to jscad: converted '+converted+' out of '+match.length+ ' facets');
            // -- 1 normal with 3 numbers, 3 different vertex objects each with 3 numbers:
            // let vpatt = /\bfacet\s+normal\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*outer\s+loop\s+vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/mgi;
            // (-?\d+\.?\d*) -1.21223
            // (-?\d+\.?\d*[Ee]?[-+]?\d*)
            let vpatt = /\bfacet\s+normal\s+(\S+)\s+(\S+)\s+(\S+)\s+outer\s+loop\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s*/mgi
            let v = vpatt.exec(match[i])
            if (v == null) continue
            if (v.length !== 13) {
              echo('Failed to parse ' + match[i])
              break
            }
            let skip = 0
            for (let k = 0; k < v.length; k++) {
              if (v[k] === 'NaN') {
                echo('bad normal or triangle vertice #' + converted + ' ' + k + ": '" + v[k] + "', skipped")
                skip++
              }
            }
            err += skip
            if (skip) {
              continue
            }
            if (0 && skip) {
              let j = 1 + 3
              let v1 = []; v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++]))
              let v2 = []; v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++]))
              let v3 = []; v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++]))
              echo('recalculate norm', v1, v2, v3)
              let w1 = new CSG.Vector3D(v1)
              let w2 = new CSG.Vector3D(v2)
              let w3 = new CSG.Vector3D(v3)
              let _u = w1.minus(w3)
              let _v = w1.minus(w2)
              let norm = _u.cross(_v).unit()
              j = 1
              v[j++] = norm._x
              v[j++] = norm._y
              v[j++] = norm._z
              skip = false
            }
            let j = 1
            let no = []; no.push(parseFloat(v[j++])); no.push(parseFloat(v[j++])); no.push(parseFloat(v[j++]))
            let v1 = []; v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++]))
            let v2 = []; v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++]))
            let v3 = []; v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++]))
            let triangle = []; triangle.push(vertexIndex++); triangle.push(vertexIndex++); triangle.push(vertexIndex++)

            // -- Add 3 vertices for every triangle
            // TODO: OPTIMIZE: Check if the vertex is already in the array, if it is just reuse the index
            if (skip === 0) {  // checking cw vs ccw
              // E1 = B - A
              // E2 = C - A
              // test = dot( Normal, cross( E1, E2 ) )
              // test > 0: cw, test < 0: ccw
              let w1 = new CSG.Vector3D(v1)
              let w2 = new CSG.Vector3D(v2)
              let w3 = new CSG.Vector3D(v3)
              let e1 = w2.minus(w1)
              let e2 = w3.minus(w1)
              let t = new CSG.Vector3D(no).dot(e1.cross(e2))
              if (t > 0) { // 1,2,3 -> 3,2,1
                let tmp = v3
                v3 = v1
                v1 = tmp
              }
            }
            vertices.push(v1)
            vertices.push(v2)
            vertices.push(v3)
            normals.push(no)
            triangles.push(triangle)
            converted++
          }
          if (err) {
            console.warn(`WARNING: import errors: ${err} (some triangles might be misaligned or missing)`)
            // FIXME: this used to be added to the output script, which makes more sense
          }

          elements.push(
            elementFormatter({ vertices, triangles, index: o })
          )
        }

        return elements
      }

      // FIXME : just a stand in for now from scad-api, not sure if we should rely on scad-api from here ?
      function polyhedron(p) {
        let pgs = []
        let ref = p.triangles || p.polygons
        let colors = p.colors || null

        for (let i = 0; i < ref.length; i++) {
          let pp = []
          for (let j = 0; j < ref[i].length; j++) {
            pp[j] = p.points[ref[i][j]]
          }

          let v = []
          for (let j = ref[i].length - 1; j >= 0; j--) { // --- we reverse order for examples of OpenSCAD work
            v.push(new CSG.Vertex(new CSG.Vector3D(pp[j][0], pp[j][1], pp[j][2])))
          }
          let s = CSG.Polygon.defaultShared
          if (colors && colors[i]) {
            s = CSG.Polygon.Shared.fromColor(colors[i])
          }
          pgs.push(new CSG.Polygon(v, s))
        }
        let r = CSG.fromPolygons(pgs)
        return r
      }

      module.exports = {
        deserialize
      }

    }, { "./vt2jscad": 93, "@jscad/csg": 1, "@jscad/io-utils": 39 }], 93: [function (require, module, exports) {
      // vertices, triangles, normals and colors
      function vt2jscad(vertices, triangles, normals, colors) {
        let src = ''
        src += 'polyhedron({ points: [\n\t'
        for (let i = 0, j = 0; i < vertices.length; i++) {
          if (j++) src += ',\n\t'
          src += '[' + vertices[i] + ']' // .join(", ");
        }
        src += '],\n\tpolygons: [\n\t'
        for (let i = 0, j = 0; i < triangles.length; i++) {
          if (j++) src += ',\n\t'
          src += '[' + triangles[i] + ']' // .join(', ');
        }
        if (colors && triangles.length === colors.length) {
          src += '],\n\tcolors: [\n\t'
          for (let i = 0, j = 0; i < colors.length; i++) {
            if (j++) src += ',\n\t'
            src += '[' + colors[i] + ']' // .join(', ');
          }
        }
        src += '] })\n'
        return src
      }

      module.exports = {
        vt2jscad
      }

    }, {}], 94: [function (require, module, exports) {

      function serialize(CSG) {
        var result = 'solid csg.js\n'
        CSG.polygons.map(function (p) {
          result += CSGPolygontoStlString(p)
        })
        result += 'endsolid csg.js\n'
        return [result]
      }

      function CSGVector3DtoStlString(v) {
        return v._x + ' ' + v._y + ' ' + v._z
      }

      function CSGVertextoStlString(vertex) {
        return 'vertex ' + CSGVector3DtoStlString(vertex.pos) + '\n'
      }

      function CSGPolygontoStlString(polygon) {
        var result = ''
        if (polygon.vertices.length >= 3) {
          // STL requires triangular polygons. If our polygon has more vertices, create
          // multiple triangles:
          var firstVertexStl = CSGVertextoStlString(polygon.vertices[0])
          for (var i = 0; i < polygon.vertices.length - 2; i++) {
            result += 'facet normal ' + CSGVector3DtoStlString(polygon.plane.normal) + '\nouter loop\n'
            result += firstVertexStl
            result += CSGVertextoStlString(polygon.vertices[i + 1])
            result += CSGVertextoStlString(polygon.vertices[i + 2])
            result += 'endloop\nendfacet\n'
          }
        }
        return result
      }

      module.exports = {
        serialize
      }

    }, {}], 95: [function (require, module, exports) {

      // see http://en.wikipedia.org/wiki/STL_%28file_format%29#Binary_STL
      function serialize(CSG) {
        // first check if the host is little-endian:
        var buffer = new ArrayBuffer(4)
        var int32buffer = new Int32Array(buffer, 0, 1)
        var int8buffer = new Int8Array(buffer, 0, 4)
        int32buffer[0] = 0x11223344
        if (int8buffer[0] !== 0x44) {
          throw new Error('Binary STL output is currently only supported on little-endian (Intel) processors')
        }

        var numtriangles = 0
        CSG.polygons.map(function (p) {
          var numvertices = p.vertices.length
          var thisnumtriangles = (numvertices >= 3) ? numvertices - 2 : 0
          numtriangles += thisnumtriangles
        })
        var headerarray = new Uint8Array(80)
        for (var i = 0; i < 80; i++) {
          headerarray[i] = 65
        }
        var ar1 = new Uint32Array(1)
        ar1[0] = numtriangles
        // write the triangles to allTrianglesBuffer:
        var allTrianglesBuffer = new ArrayBuffer(50 * numtriangles)
        var allTrianglesBufferAsInt8 = new Int8Array(allTrianglesBuffer)
        // a tricky problem is that a Float32Array must be aligned at 4-byte boundaries (at least in certain browsers)
        // while each triangle takes 50 bytes. Therefore we write each triangle to a temporary buffer, and copy that
        // into allTrianglesBuffer:
        var triangleBuffer = new ArrayBuffer(50)
        var triangleBufferAsInt8 = new Int8Array(triangleBuffer)
        // each triangle consists of 12 floats:
        var triangleFloat32array = new Float32Array(triangleBuffer, 0, 12)
        // and one uint16:
        var triangleUint16array = new Uint16Array(triangleBuffer, 48, 1)
        var byteoffset = 0
        CSG.polygons.map(function (p) {
          var numvertices = p.vertices.length
          for (var i = 0; i < numvertices - 2; i++) {
            var normal = p.plane.normal
            triangleFloat32array[0] = normal._x
            triangleFloat32array[1] = normal._y
            triangleFloat32array[2] = normal._z
            var arindex = 3
            for (var v = 0; v < 3; v++) {
              var vv = v + ((v > 0) ? i : 0)
              var vertexpos = p.vertices[vv].pos
              triangleFloat32array[arindex++] = vertexpos._x
              triangleFloat32array[arindex++] = vertexpos._y
              triangleFloat32array[arindex++] = vertexpos._z
            }
            triangleUint16array[0] = 0
            // copy the triangle into allTrianglesBuffer:
            allTrianglesBufferAsInt8.set(triangleBufferAsInt8, byteoffset)
            byteoffset += 50
          }
        })
        return [headerarray.buffer, ar1.buffer, allTrianglesBuffer]// 'blobable array'
        /* return new Blob([headerarray.buffer, ar1.buffer, allTrianglesBuffer], {
          type: mimeType
        }) */
      }

      module.exports = {
        serialize
      }

    }, {}], 96: [function (require, module, exports) {
      const binarySerializer = require('./CSGToStlb').serialize
      const asciiSerializer = require('./CSGToStla').serialize
      const { ensureManifoldness } = require('@jscad/io-utils')

      const mimeType = 'application/sla'

      function serialize(data, options) {
        const defaults = {
          binary: true
        }
        options = Object.assign({}, defaults, options)

        data = ensureManifoldness(data)
        return options.binary ? binarySerializer(data, options) : asciiSerializer(data, options)
      }

      module.exports = {
        mimeType,
        serialize
      }

    }, { "./CSGToStla": 94, "./CSGToStlb": 95, "@jscad/io-utils": 39 }], 97: [function (require, module, exports) {
      // units for converting CSS2 points/length, i.e. CSS2 value / pxPmm
      const pxPmm = 1 / 0.2822222 // used for scaling SVG coordinates(PX) to CAG coordinates(MM)
      const inchMM = 1 / (1 / 0.039370) // used for scaling SVG coordinates(IN) to CAG coordinates(MM)
      const ptMM = 1 / (1 / 0.039370 / 72) // used for scaling SVG coordinates(IN) to CAG coordinates(MM)
      const pcMM = 1 / (1 / 0.039370 / 72 * 12) // used for scaling SVG coordinates(PC) to CAG coordinates(MM)
      const cssPxUnit = 0.2822222 // standard pixel size at arms length on 90dpi screens

      // standard SVG named colors (sRGB values)
      const svgColors = {
        'aliceblue': [240, 248, 255],
        'antiquewhite': [250, 235, 215],
        'aqua': [0, 255, 255],
        'aquamarine': [127, 255, 212],
        'azure': [240, 255, 255],
        'beige': [245, 245, 220],
        'bisque': [255, 228, 196],
        'black': [0, 0, 0],
        'blanchedalmond': [255, 235, 205],
        'blue': [0, 0, 255],
        'blueviolet': [138, 43, 226],
        'brown': [165, 42, 42],
        'burlywood': [222, 184, 135],
        'cadetblue': [95, 158, 160],
        'chartreuse': [127, 255, 0],
        'chocolate': [210, 105, 30],
        'coral': [255, 127, 80],
        'cornflowerblue': [100, 149, 237],
        'cornsilk': [255, 248, 220],
        'crimson': [220, 20, 60],
        'cyan': [0, 255, 255],
        'darkblue': [0, 0, 139],
        'darkcyan': [0, 139, 139],
        'darkgoldenrod': [184, 134, 11],
        'darkgray': [169, 169, 169],
        'darkgreen': [0, 100, 0],
        'darkgrey': [169, 169, 169],
        'darkkhaki': [189, 183, 107],
        'darkmagenta': [139, 0, 139],
        'darkolivegreen': [85, 107, 47],
        'darkorange': [255, 140, 0],
        'darkorchid': [153, 50, 204],
        'darkred': [139, 0, 0],
        'darksalmon': [233, 150, 122],
        'darkseagreen': [143, 188, 143],
        'darkslateblue': [72, 61, 139],
        'darkslategray': [47, 79, 79],
        'darkslategrey': [47, 79, 79],
        'darkturquoise': [0, 206, 209],
        'darkviolet': [148, 0, 211],
        'deeppink': [255, 20, 147],
        'deepskyblue': [0, 191, 255],
        'dimgray': [105, 105, 105],
        'dimgrey': [105, 105, 105],
        'dodgerblue': [30, 144, 255],
        'firebrick': [178, 34, 34],
        'floralwhite': [255, 250, 240],
        'forestgreen': [34, 139, 34],
        'fuchsia': [255, 0, 255],
        'gainsboro': [220, 220, 220],
        'ghostwhite': [248, 248, 255],
        'gold': [255, 215, 0],
        'goldenrod': [218, 165, 32],
        'gray': [128, 128, 128],
        'grey': [128, 128, 128],
        'green': [0, 128, 0],
        'greenyellow': [173, 255, 47],
        'honeydew': [240, 255, 240],
        'hotpink': [255, 105, 180],
        'indianred': [205, 92, 92],
        'indigo': [75, 0, 130],
        'ivory': [255, 255, 240],
        'khaki': [240, 230, 140],
        'lavender': [230, 230, 250],
        'lavenderblush': [255, 240, 245],
        'lawngreen': [124, 252, 0],
        'lemonchiffon': [255, 250, 205],
        'lightblue': [173, 216, 230],
        'lightcoral': [240, 128, 128],
        'lightcyan': [224, 255, 255],
        'lightgoldenrodyellow': [250, 250, 210],
        'lightgray': [211, 211, 211],
        'lightgreen': [144, 238, 144],
        'lightgrey': [211, 211, 211],
        'lightpink': [255, 182, 193],
        'lightsalmon': [255, 160, 122],
        'lightseagreen': [32, 178, 170],
        'lightskyblue': [135, 206, 250],
        'lightslategray': [119, 136, 153],
        'lightslategrey': [119, 136, 153],
        'lightsteelblue': [176, 196, 222],
        'lightyellow': [255, 255, 224],
        'lime': [0, 255, 0],
        'limegreen': [50, 205, 50],
        'linen': [250, 240, 230],
        'magenta': [255, 0, 255],
        'maroon': [128, 0, 0],
        'mediumaquamarine': [102, 205, 170],
        'mediumblue': [0, 0, 205],
        'mediumorchid': [186, 85, 211],
        'mediumpurple': [147, 112, 219],
        'mediumseagreen': [60, 179, 113],
        'mediumslateblue': [123, 104, 238],
        'mediumspringgreen': [0, 250, 154],
        'mediumturquoise': [72, 209, 204],
        'mediumvioletred': [199, 21, 133],
        'midnightblue': [25, 25, 112],
        'mintcream': [245, 255, 250],
        'mistyrose': [255, 228, 225],
        'moccasin': [255, 228, 181],
        'navajowhite': [255, 222, 173],
        'navy': [0, 0, 128],
        'oldlace': [253, 245, 230],
        'olive': [128, 128, 0],
        'olivedrab': [107, 142, 35],
        'orange': [255, 165, 0],
        'orangered': [255, 69, 0],
        'orchid': [218, 112, 214],
        'palegoldenrod': [238, 232, 170],
        'palegreen': [152, 251, 152],
        'paleturquoise': [175, 238, 238],
        'palevioletred': [219, 112, 147],
        'papayawhip': [255, 239, 213],
        'peachpuff': [255, 218, 185],
        'peru': [205, 133, 63],
        'pink': [255, 192, 203],
        'plum': [221, 160, 221],
        'powderblue': [176, 224, 230],
        'purple': [128, 0, 128],
        'red': [255, 0, 0],
        'rosybrown': [188, 143, 143],
        'royalblue': [65, 105, 225],
        'saddlebrown': [139, 69, 19],
        'salmon': [250, 128, 114],
        'sandybrown': [244, 164, 96],
        'seagreen': [46, 139, 87],
        'seashell': [255, 245, 238],
        'sienna': [160, 82, 45],
        'silver': [192, 192, 192],
        'skyblue': [135, 206, 235],
        'slateblue': [106, 90, 205],
        'slategray': [112, 128, 144],
        'slategrey': [112, 128, 144],
        'snow': [255, 250, 250],
        'springgreen': [0, 255, 127],
        'steelblue': [70, 130, 180],
        'tan': [210, 180, 140],
        'teal': [0, 128, 128],
        'thistle': [216, 191, 216],
        'tomato': [255, 99, 71],
        'turquoise': [64, 224, 208],
        'violet': [238, 130, 238],
        'wheat': [245, 222, 179],
        'white': [255, 255, 255],
        'whitesmoke': [245, 245, 245],
        'yellow': [255, 255, 0],
        'yellowgreen': [154, 205, 50]
      }

      module.exports = {
        pxPmm,
        inchMM,
        ptMM,
        pcMM,
        cssPxUnit,
        svgColors
      }

    }, {}], 98: [function (require, module, exports) {
      const { inchMM, ptMM, pcMM, svgColors } = require('./constants')

      // Calculate the CAG length/size from the given SVG value (float)
      const svg2cagX = function (v, svgUnitsPmm) {
        return (v / svgUnitsPmm[0])
      }

      const svg2cagY = function (v, svgUnitsPmm) {
        return 0 - (v / svgUnitsPmm[1])
      }

      // Calculate the CAG length/size from the given CSS value (string)
      const cagLengthX = function (css, svgUnitsPmm, svgUnitsX) {
        if (css.indexOf('%') < 0) {
          return css2cag(css, svgUnitsPmm[0])
        }
        // calculate the units as a percentage of the width
        var v = parseFloat(css) // number part
        if (isNaN(v)) { return 0.0 }
        if (v === 0) return v
        v = (v / 100) * svgUnitsX
        // convert the units to mm
        v = v / svgUnitsPmm[0]
        // return v;
        return Math.round(v / -100000) * -100000
      }

      const cagLengthY = function (css, svgUnitsPmm, svgUnitsY) {
        if (css.indexOf('%') < 0) {
          return css2cag(css, svgUnitsPmm[1])
        }
        // calculate the units as a percentage of the width
        var v = parseFloat(css) // number part
        if (isNaN(v)) { return 0.0 }
        if (v === 0) return v
        v = (v / 100) * svgUnitsY
        // convert the units to mm
        v = v / svgUnitsPmm[1]
        // return v;
        return Math.round(v / -100000) * -100000
      }

      const cagLengthP = function (css, svgUnitsPmm, svgUnitsV) {
        if (css.indexOf('%') < 0) {
          return css2cag(css, svgUnitsPmm[1])
        }
        // calculate the units as a percentage of the viewport
        var v = parseFloat(css) // number part
        if (isNaN(v)) { return 0.0 }
        if (v === 0) return v
        v = (v / 100) * svgUnitsV
        // convert the units to mm
        v = v / svgUnitsPmm[0] // FIXME should this use X units?
        return v
      }

      const css2cag = function (css, unit) {
        // console.log('css2cag('+css+','+unit+')');
        var v = parseFloat(css) // number part
        if (isNaN(v)) { return 0.0 }
        if (v === 0) return v
        if (css.search(/EM/i) > 0) { // FIXME self assignment , useless ?
          // v = v // font size
        } else
          if (css.search(/EX/i) > 0) { // FIXME self assignment , useless ?
            // v = v // x-height of font
          } else
            if (css.search(/MM/i) > 0) { // FIXME self assignment , useless ?
              // v = v // absolute millimeters
            } else
              if (css.search(/CM/i) > 0) {
                v = (v * 10) // absolute centimeters > millimeters
              } else
                if (css.search(/IN/i) > 0) {
                  v = (v / inchMM) // absolute inches > millimeters
                } else
                  if (css.search(/PT/i) > 0) {
                    v = (v / ptMM) // absolute points > millimeters
                  } else
                    if (css.search(/PC/i) > 0) {
                      v = (v / pcMM) // absolute picas > millimeters
                    } else {
                      v = (v / unit) // absolute pixels(units) > millimeters
                    }
        // console.log('v ('+v+')');
        return v
      }

      // convert the SVG color specification to CAG RGB
      const cagColor = function (value) {
        // var rgb = [0,0,0]; // default is black
        var rgb = null
        value = value.toLowerCase()
        if (value in svgColors) {
          rgb = svgColors[value]
          rgb = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255] // converted to 0.0-1.0 values
        } else {
          if (value[0] === '#') {
            if (value.length === 4) {
              // short HEX specification
              value = '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3]
            }
            if (value.length === 7) {
              // HEX specification
              rgb = [parseInt('0x' + value.slice(1, 3)) / 255,
              parseInt('0x' + value.slice(3, 5)) / 255,
              parseInt('0x' + value.slice(5, 7)) / 255]
            }
          } else {
            var pat = /rgb\(.+,.+,.+\)/
            var s = pat.exec(value)
            if (s !== null) {
              // RGB specification
              s = s[0]
              s = s.slice(s.indexOf('(') + 1, s.indexOf(')'))
              rgb = s.split(',')
              if (s.indexOf('%') > 0) {
                // rgb(#%,#%,#%)
                rgb = [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])]
                rgb = [rgb[0] / 100, rgb[1] / 100, rgb[2] / 100] // converted to 0.0-1.0 values
              } else {
                // rgb(#,#,#)
                rgb = [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])]
                rgb = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255] // converted to 0.0-1.0 values
              }
            }
          }
        }
        return rgb
      }

      const cssStyle = function (element, name) {
        if ('STYLE' in element) {
          var list = element.STYLE
          var pat = name + '\\s*:\\s*\\S+;'
          var exp = new RegExp(pat, 'i')
          var v = exp.exec(list)
          if (v !== null) {
            v = v[0]
            var i = v.length
            while (v[i] !== ' ') i--
            v = v.slice(i + 1, v.length - 1)
            return v
          }
        }
        return null
      }

      const reflect = function (x, y, px, py) {
        var ox = x - px
        var oy = y - py
        if (x === px && y === px) return [x, y]
        if (x === px) return [x, py + (-oy)]
        if (y === py) return [px + (-ox), y]
        return [px + (-ox), py + (-oy)]
      }

      // Return the value for the given attribute from the group hiearchy
      const groupValue = function (svgGroups, name) {
        var i = svgGroups.length
        while (i > 0) {
          const g = svgGroups[i - 1]
          if (name in g) {
            return g[name]
          }
          i--
        }
        return null
      }

      module.exports = {
        svg2cagX,
        svg2cagY,
        cagLengthX,
        cagLengthY,
        cagLengthP,
        css2cag,
        cagColor,
        cssStyle,
        reflect,
        groupValue
      }

    }, { "./constants": 97 }], 99: [function (require, module, exports) {
      /*
      ## License
      
      Copyright (c) 2016 Z3 Development https://github.com/z3dev
                    2017 Mark 'kaosat-dev' Moissette
      
      * The upgrades (direct CSG output from this deserializer) and refactoring
      have been very kindly sponsored by [Copenhagen Fabrication / Stykka](https://www.stykka.com/)***
      
      All code released under MIT license
      */

      const sax = require('sax')
      const { CAG } = require('@jscad/csg')

      const { cagLengthX, cagLengthY } = require('./helpers')
      const { svgSvg, svgRect, svgCircle, svgGroup, svgLine, svgPath, svgEllipse, svgPolygon, svgPolyline, svgUse } = require('./svgElementHelpers')
      const shapesMapCsg = require('./shapesMapCsg')
      const shapesMapJscad = require('./shapesMapJscad')
      // FIXE: should these be kept here ? any risk of side effects ?
      let svgUnitsX
      let svgUnitsY
      let svgUnitsV
      // processing controls
      let svgObjects = [] // named objects
      let svgGroups = [] // groups of objects
      let svgInDefs = false // svg DEFS element in process
      let svgObj = null // svg in object form
      let svgUnitsPmm = [1, 1]

      const objectify = function (group) {
        const level = svgGroups.length
        // add this group to the heiarchy
        svgGroups.push(group)
        // create an indent for the generated code
        let i = level
        while (i > 0) {
          i--
        }

        let lnCAG = new CAG()

        const params = {
          svgUnitsPmm,
          svgUnitsX,
          svgUnitsY,
          svgUnitsV,
          level,
          svgGroups
        }
        // generate code for all objects
        for (i = 0; i < group.objects.length; i++) {
          const obj = group.objects[i]
          let onCAG = shapesMapCsg(obj, objectify, params)

          if ('fill' in obj) {
            // FIXME when CAG supports color
            //  code += indent+on+' = '+on+'.setColor(['+obj.fill[0]+','+obj.fill[1]+','+obj.fill[2]+']);\n';
          }
          if ('transforms' in obj) {
            // NOTE: SVG specifications require that transforms are applied in the order given.
            // But these are applied in the order as required by CSG/CAG
            let tr
            let ts
            let tt

            for (let j = 0; j < obj.transforms.length; j++) {
              const t = obj.transforms[j]
              if ('rotate' in t) { tr = t }
              if ('scale' in t) { ts = t }
              if ('translate' in t) { tt = t }
            }
            if (ts !== null) {
              const x = ts.scale[0]
              const y = ts.scale[1]
              onCAG = onCAG.scale([x, y])
            }
            if (tr !== null) {
              const z = 0 - tr.rotate
              onCAG = onCAG.rotateZ(z)
            }
            if (tt !== null) {
              const x = cagLengthX(tt.translate[0], svgUnitsPmm, svgUnitsX)
              const y = (0 - cagLengthY(tt.translate[1], svgUnitsPmm, svgUnitsY))
              onCAG = onCAG.translate([x, y])
            }
          }
          lnCAG = lnCAG.union(onCAG)
        }

        // remove this group from the hiearchy
        svgGroups.pop()

        return lnCAG
      }

      const codify = function (group) {
        const level = svgGroups.length
        // add this group to the heiarchy
        svgGroups.push(group)
        // create an indent for the generated code
        var indent = '  '
        var i = level
        while (i > 0) {
          indent += '  '
          i--
        }
        // pre-code
        var code = ''
        if (level === 0) {
          code += 'function main(params) {\n'
        }
        var ln = 'cag' + level
        code += indent + 'var ' + ln + ' = new CAG();\n'

        // generate code for all objects
        for (i = 0; i < group.objects.length; i++) {
          const obj = group.objects[i]
          const on = ln + i

          const params = {
            level,
            indent,
            ln,
            on,
            svgUnitsPmm,
            svgUnitsX,
            svgUnitsY,
            svgUnitsV,
            svgGroups
          }

          let tmpCode = shapesMapJscad(obj, codify, params)
          code += tmpCode

          if ('fill' in obj) {
            // FIXME when CAG supports color
            //  code += indent+on+' = '+on+'.setColor(['+obj.fill[0]+','+obj.fill[1]+','+obj.fill[2]+']);\n';
          }
          if ('transforms' in obj) {
            // NOTE: SVG specifications require that transforms are applied in the order given.
            //       But these are applied in the order as required by CSG/CAG
            let tr
            let ts
            let tt

            for (let j = 0; j < obj.transforms.length; j++) {
              var t = obj.transforms[j]
              if ('rotate' in t) { tr = t }
              if ('scale' in t) { ts = t }
              if ('translate' in t) { tt = t }
            }
            if (ts !== null && ts !== undefined) {
              const x = ts.scale[0]
              const y = ts.scale[1]
              code += indent + on + ' = ' + on + '.scale([' + x + ',' + y + ']);\n'
            }
            if (tr !== null && tr !== undefined) {
              console.log('tr', tr)
              const z = 0 - tr.rotate
              code += indent + on + ' = ' + on + '.rotateZ(' + z + ');\n'
            }
            if (tt !== null && tt !== undefined) {
              const x = cagLengthX(tt.translate[0], svgUnitsPmm, svgUnitsX)
              const y = (0 - cagLengthY(tt.translate[1], svgUnitsPmm, svgUnitsY))
              code += indent + on + ' = ' + on + '.translate([' + x + ',' + y + ']);\n'
            }
          }
          code += indent + ln + ' = ' + ln + '.union(' + on + ');\n'
        }
        // post-code
        if (level === 0) {
          code += indent + 'return ' + ln + ';\n'
          code += '}\n'
        }
        // remove this group from the hiearchy
        svgGroups.pop()

        return code
      }

      function createSvgParser(src, pxPmm) {
        // create a parser for the XML
        const parser = sax.parser(false, { trim: true, lowercase: false, position: true })
        if (pxPmm !== undefined && pxPmm > parser.pxPmm) {
          parser.pxPmm = pxPmm
        }
        // extend the parser with functions
        parser.onerror = e => console.log('error: line ' + e.line + ', column ' + e.column + ', bad character [' + e.c + ']')

        parser.onopentag = function (node) {
          // console.log('opentag: '+node.name+' at line '+this.line+' position '+this.column);
          const objMap = {
            SVG: svgSvg,
            G: svgGroup,
            RECT: svgRect,
            CIRCLE: svgCircle,
            ELLIPSE: svgEllipse,
            LINE: svgLine,
            POLYLINE: svgPolyline,
            POLYGON: svgPolygon,
            PATH: svgPath,
            USE: svgUse,
            DEFS: () => { svgInDefs = true },
            DESC: () => undefined, // ignored by design
            TITLE: () => undefined, // ignored by design
            STYLE: () => undefined, // ignored by design
            undefined: () => console.log('Warning: Unsupported SVG element: ' + node.name)
          }
          let obj = objMap[node.name] ? objMap[node.name](node.attributes, { svgObjects, customPxPmm: pxPmm }) : null

          // case 'SYMBOL':
          // this is just like an embedded SVG but does NOT render directly, only named
          // this requires another set of control objects
          // only add to named objects for later USE
          //  break;
          // console.log('node',node)

          if (obj !== null) {
            // add to named objects if necessary
            if ('id' in obj) {
              svgObjects[obj.id] = obj
            }
            if (obj.type === 'svg') {
              // initial SVG (group)
              svgGroups.push(obj)
              // console.log('units', obj.unitsPmm)
              svgUnitsPmm = obj.unitsPmm
              svgUnitsX = obj.viewW
              svgUnitsY = obj.viewH
              svgUnitsV = obj.viewP
            } else {
              // add the object to the active group if necessary
              if (svgGroups.length > 0 && svgInDefs === false) {
                var group = svgGroups.pop()
                if ('objects' in group) {
                  // console.log('push object ['+obj.type+']');
                  // console.log(JSON.stringify(obj));
                  // TBD apply presentation attributes from the group
                  group.objects.push(obj)
                }
                svgGroups.push(group)
              }
              if (obj.type === 'group') {
                // add GROUPs to the stack
                svgGroups.push(obj)
              }
            }
          }
        }

        parser.onclosetag = function (node) {
          // console.log('closetag: '+node)
          const popGroup = () => svgGroups.pop()
          const objMap = {
            SVG: popGroup,
            DEFS: () => { svgInDefs = false },
            USE: popGroup,
            G: popGroup,
            undefined: () => { }
          }
          const obj = objMap[node] ? objMap[node]() : undefined

          // check for completeness
          if (svgGroups.length === 0) {
            svgObj = obj
          }
        }

        // parser.onattribute = function (attr) {};
        // parser.ontext = function (t) {};

        parser.onend = function () {
          //  console.log('SVG parsing completed')
        }
        // start the parser
        parser.write(src).close()
        return parser
      }

      /**
       * Parse the given SVG source and return a JSCAD script
       * @param  {string} src svg data as text
       * @param  {string} filename (optional) original filename of SVG source
       * @param  {object} options options (optional) anonymous object with:
       *  pxPmm {number: pixels per milimeter for calcuations
       *  version: {string} version number to add to the metadata
       *  addMetadata: {boolean} flag to enable/disable injection of metadata (producer, date, source)
       *
       * @return a CAG (2D CSG) object
       */
      function deserializeToCSG(src, filename, options) {
        filename = filename || 'svg'
        const defaults = { pxPmm: require('./constants').pxPmm, version: '0.0.0', addMetaData: true }
        options = Object.assign({}, defaults, options)
        const { pxPmm } = options

        // parse the SVG source
        createSvgParser(src, pxPmm)
        if (!svgObj) {
          throw new Error('SVG parsing failed, no valid svg data retrieved')
        }

        return objectify(svgObj)
      }

      /**
       * Parse the given SVG source and return a JSCAD script
       * @param  {string} src svg data as text
       * @param  {string} filename (optional) original filename of SVG source
       * @param  {object} options options (optional) anonymous object with:
       *  pxPmm {number: pixels per milimeter for calcuations
       *  version: {string} version number to add to the metadata
       *  addMetadata: {boolean} flag to enable/disable injection of metadata (producer, date, source)
       *    at the start of the file
       * @return a CAG (2D CSG) object
       */
      function translate(src, filename, options) {
        filename = filename || 'svg'
        const defaults = { pxPmm: require('./constants').pxPmm, version: '0.0.0', addMetaData: true }
        options = Object.assign({}, defaults, options)
        const { version, pxPmm, addMetaData } = options

        // parse the SVG source
        createSvgParser(src, pxPmm)
        // convert the internal objects to JSCAD code
        let code = addMetaData ? `//
  // producer: OpenJSCAD.org ${version} SVG Importer
  // date: ${new Date()}
  // source: ${filename}
  //
  ` : ''

        if (!svgObj) {
          throw new Error('SVG parsing failed, no valid svg data retrieved')
        }

        const scadCode = codify(svgObj)
        code += scadCode

        return code
      }

      const deserialize = function (src, filename, options) {
        const defaults = {
          output: 'jscad'
        }
        options = Object.assign({}, defaults, options)
        return options.output === 'jscad' ? translate(src, filename, options) : deserializeToCSG(src, filename, options)
      }

      module.exports = { deserialize }

    }, { "./constants": 97, "./helpers": 98, "./shapesMapCsg": 100, "./shapesMapJscad": 101, "./svgElementHelpers": 102, "@jscad/csg": 1, "sax": 129 }], 100: [function (require, module, exports) {
      const { CSG, CAG } = require('@jscad/csg')
      const { svg2cagX, svg2cagY, cagLengthX, cagLengthY, cagLengthP, reflect, groupValue } = require('./helpers')
      const { cssPxUnit } = require('./constants')

      const shapesMap = function (obj, codify, params) {
        const { svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV, svgGroups } = params

        const types = {
          group: (obj) => {
            // cag from nested element
            return codify(obj)
          },

          rect: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY) => {
            let x = cagLengthX(obj.x, svgUnitsPmm, svgUnitsX)
            let y = (0 - cagLengthY(obj.y, svgUnitsPmm, svgUnitsY))
            const w = cagLengthX(obj.width, svgUnitsPmm, svgUnitsX)
            const h = cagLengthY(obj.height, svgUnitsPmm, svgUnitsY)
            const rx = cagLengthX(obj.rx, svgUnitsPmm, svgUnitsX)
            // const ry = cagLengthY(obj.ry, svgUnitsPmm, svgUnitsY)
            if (w > 0 && h > 0) {
              x = (x + (w / 2)).toFixed(4) // position the object via the center
              y = (y - (h / 2)).toFixed(4) // position the object via the center
              if (rx === 0) {
                return CAG.rectangle({ center: [x, y], radius: [w / 2, h / 2] })
              } else {
                return CAG.roundedRectangle({ center: [x, y], radius: [w / 2, h / 2], roundradius: rx })
              }
            }
          },

          circle: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            const x = cagLengthX(obj.x, svgUnitsPmm, svgUnitsX)
            const y = (0 - cagLengthY(obj.y, svgUnitsPmm, svgUnitsY))
            const r = cagLengthP(obj.radius, svgUnitsPmm, svgUnitsV)

            if (r > 0) {
              return CAG.circle({ center: [x, y], radius: r })
            }
          },

          ellipse: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            const rx = cagLengthX(obj.rx, svgUnitsPmm, svgUnitsX)
            const ry = cagLengthY(obj.ry, svgUnitsPmm, svgUnitsY)
            const cx = cagLengthX(obj.cx, svgUnitsPmm, svgUnitsX)
            const cy = (0 - cagLengthY(obj.cy, svgUnitsPmm, svgUnitsY))
            if (rx > 0 && ry > 0) {
              return CAG.ellipse({ center: [cx, cy], radius: [rx, ry] })
            }
          },

          line: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            const x1 = cagLengthX(obj.x1, svgUnitsPmm, svgUnitsX)
            const y1 = (0 - cagLengthY(obj.y1, svgUnitsPmm, svgUnitsY))
            const x2 = cagLengthX(obj.x2, svgUnitsPmm, svgUnitsX)
            const y2 = (0 - cagLengthY(obj.y2, svgUnitsPmm, svgUnitsY))
            let r = cssPxUnit // default
            if ('strokeWidth' in obj) {
              r = cagLengthP(obj.strokeWidth, svgUnitsPmm, svgUnitsV) / 2
            } else {
              const v = groupValue(svgGroups, 'strokeWidth')
              if (v !== null) {
                r = cagLengthP(v, svgUnitsPmm, svgUnitsV) / 2
              }
            }
            const tmpObj = new CSG.Path2D([[x1, y1], [x2, y2]], false)
              .expandToCAG(r, CSG.defaultResolution2D)
            return tmpObj
          },

          polygon: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY) => {
            let points = []
            for (let j = 0; j < obj.points.length; j++) {
              const p = obj.points[j]
              if ('x' in p && 'y' in p) {
                const x = cagLengthX(p.x, svgUnitsPmm, svgUnitsX)
                const y = (0 - cagLengthY(p.y, svgUnitsPmm, svgUnitsY))
                points.push([x, y])
              }
            }
            let tmpObj = new CSG.Path2D(points, true).innerToCAG()
            return tmpObj
          },

          polyline: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            let points = []
            let r = cssPxUnit // default
            if ('strokeWidth' in obj) {
              r = cagLengthP(obj.strokeWidth, svgUnitsPmm, svgUnitsV) / 2
            } else {
              const v = groupValue(svgGroups, 'strokeWidth')
              if (v !== null) {
                r = cagLengthP(v, svgUnitsPmm, svgUnitsV) / 2
              }
            }
            for (let j = 0; j < obj.points.length; j++) {
              const p = obj.points[j]
              if ('x' in p && 'y' in p) {
                let x = cagLengthX(p.x, svgUnitsPmm, svgUnitsX)
                let y = (0 - cagLengthY(p.y, svgUnitsPmm, svgUnitsY))
                points.push([x, y])
              }
            }
            let tmpObj = new CSG.Path2D(points, false).expandToCAG(r, CSG.defaultResolution2D)
            return tmpObj
          },

          path // paths are a lot more complex, handled seperatly , see below
        }
        return types[obj.type](obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV, svgGroups)
      }

      module.exports = shapesMap

      function path(obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV, svgGroups) {
        let pathCag = new CAG()
        let paths = {}
        const on = '' // not sure

        let r = cssPxUnit // default
        if ('strokeWidth' in obj) {
          r = cagLengthP(obj.strokeWidth, svgUnitsPmm, svgUnitsV) / 2
        } else {
          const v = groupValue(svgGroups, 'strokeWidth')
          if (v !== null) {
            r = cagLengthP(v, svgUnitsPmm, svgUnitsV) / 2
          }
        }
        // Note: All values are SVG values
        let sx = 0 // starting position
        let sy = 0
        let cx = 0 // current position
        let cy = 0
        let pi = 0 // current path index
        let pathName = on + pi // current path name
        let pc = false // current path closed
        let bx = 0 // 2nd control point from previous C command
        let by = 0 // 2nd control point from previous C command
        let qx = 0 // 2nd control point from previous Q command
        let qy = 0 // 2nd control point from previous Q command

        for (let j = 0; j < obj.commands.length; j++) {
          let co = obj.commands[j]
          let pts = co.p
          // console.log('postion: ['+cx+','+cy+'] before '+co.c);
          switch (co.c) {
            case 'm': // relative move to X,Y
              // special case, if at beginning of path then treat like absolute M
              if (j === 0) {
                cx = 0; cy = 0
              }
              // close the previous path
              if (pi > 0 && pc === false) {
                paths[pathName].expandToCAG(CSG.defaultResolution2D)
                // code += indent + pathName + ' = ' + pathName + '.expandToCAG(' + r + ',CSG.defaultResolution2D);\n'
              }
              // open a new path
              if (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                pi++
                pathName = on + pi
                pc = false
                paths[pathName] = new CSG.Path2D([[svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]], false)
                sx = cx; sy = cy
              }
              // optional implicit relative lineTo (cf SVG spec 8.3.2)
              while (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'M': // absolute move to X,Y
              // close the previous path
              if (pi > 0 && pc === false) {
                paths[pathName] = paths[pathName].expandToCAG(CSG.defaultResolution2D)
              }
              // open a new path
              if (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                pi++
                pathName = on + pi
                pc = false
                paths[pathName] = new CSG.Path2D([[svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]], false)
                sx = cx; sy = cy
              }
              // optional implicit absolute lineTo (cf SVG spec 8.3.2)
              while (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'a': // relative elliptical arc
              while (pts.length >= 7) {
                let rx = parseFloat(pts.shift())
                let ry = parseFloat(pts.shift())
                let ro = 0 - parseFloat(pts.shift())
                let lf = (pts.shift() === '1')
                let sf = (pts.shift() === '1')
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                paths[pathName].appendArc([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)], { xradius: svg2cagX(rx, svgUnitsPmm), yradius: svg2cagY(ry, svgUnitsPmm), xaxisrotation: ro, clockwise: sf, large: lf })
              }
              break
            case 'A': // absolute elliptical arc
              while (pts.length >= 7) {
                let rx = parseFloat(pts.shift())
                let ry = parseFloat(pts.shift())
                let ro = 0 - parseFloat(pts.shift())
                let lf = (pts.shift() === '1')
                let sf = (pts.shift() === '1')
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                paths[pathName].appendArc([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)], { xradius: svg2cagX(rx, svgUnitsPmm), yradius: svg2cagY(ry, svgUnitsPmm), xaxisrotation: ro, clockwise: sf, large: lf })
              }
              break
            case 'c': // relative cubic Bézier
              while (pts.length >= 6) {
                let x1 = cx + parseFloat(pts.shift())
                let y1 = cy + parseFloat(pts.shift())
                bx = cx + parseFloat(pts.shift())
                by = cy + parseFloat(pts.shift())
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(x1, svgUnitsPmm), svg2cagY(y1, svgUnitsPmm)], [svg2cagX(bx, svgUnitsPmm), svg2cagY(by, svgUnitsPmm)], [svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]])
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'C': // absolute cubic Bézier
              while (pts.length >= 6) {
                let x1 = parseFloat(pts.shift())
                let y1 = parseFloat(pts.shift())
                bx = parseFloat(pts.shift())
                by = parseFloat(pts.shift())
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(x1, svgUnitsPmm), svg2cagY(y1, svgUnitsPmm)], [svg2cagX(bx, svgUnitsPmm), svg2cagY(by, svgUnitsPmm)], [svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]])
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'q': // relative quadratic Bézier
              while (pts.length >= 4) {
                qx = cx + parseFloat(pts.shift())
                qy = cy + parseFloat(pts.shift())
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]])
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 'Q': // absolute quadratic Bézier
              while (pts.length >= 4) {
                qx = parseFloat(pts.shift())
                qy = parseFloat(pts.shift())
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]])
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 't': // relative quadratic Bézier shorthand
              while (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [cx, cy]])
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 'T': // absolute quadratic Bézier shorthand
              while (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [svg2cagX(qx, svgUnitsPmm), svg2cagY(qy, svgUnitsPmm)], [svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]])
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 's': // relative cubic Bézier shorthand
              while (pts.length >= 4) {
                let x1 = bx // reflection of 2nd control point from previous C
                let y1 = by // reflection of 2nd control point from previous C
                bx = cx + parseFloat(pts.shift())
                by = cy + parseFloat(pts.shift())
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(x1, svgUnitsPmm), svg2cagY(y1, svgUnitsPmm)], [svg2cagX(bx, svgUnitsPmm), svg2cagY(by, svgUnitsPmm)], [svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]])
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'S': // absolute cubic Bézier shorthand
              while (pts.length >= 4) {
                let x1 = bx // reflection of 2nd control point from previous C
                let y1 = by // reflection of 2nd control point from previous C
                bx = parseFloat(pts.shift())
                by = parseFloat(pts.shift())
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendBezier([[svg2cagX(x1, svgUnitsPmm), svg2cagY(y1, svgUnitsPmm)], [svg2cagX(bx, svgUnitsPmm), svg2cagY(by, svgUnitsPmm)], [svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)]])
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'h': // relative Horzontal line to
              while (pts.length >= 1) {
                cx = cx + parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'H': // absolute Horzontal line to
              while (pts.length >= 1) {
                cx = parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'l': // relative line to
              while (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'L': // absolute line to
              while (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'v': // relative Vertical line to
              while (pts.length >= 1) {
                cy = cy + parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'V': // absolute Vertical line to
              while (pts.length >= 1) {
                cy = parseFloat(pts.shift())
                paths[pathName] = paths[pathName].appendPoint([svg2cagX(cx, svgUnitsPmm), svg2cagY(cy, svgUnitsPmm)])
              }
              break
            case 'z': // close current line
            case 'Z':
              paths[pathName] = paths[pathName].close().innerToCAG()
              pathCag = pathCag.union(paths[pathName])
              cx = sx
              cy = sy // return to the starting point
              pc = true
              break
            default:
              console.log('Warning: Unknow PATH command [' + co.c + ']')
              break
          }
          // console.log('postion: ['+cx+','+cy+'] after '+co.c);
        }
        if (pi > 0 && pc === false) {
          paths[pathName] = paths[pathName].expandToCAG(r, CSG.defaultResolution2D)
          pathCag = pathCag.union(paths[pathName])
        }
        return pathCag
      }

    }, { "./constants": 97, "./helpers": 98, "@jscad/csg": 1 }], 101: [function (require, module, exports) {
      const { svg2cagX, svg2cagY, cagLengthX, cagLengthY, cagLengthP, reflect, groupValue } = require('./helpers')
      const { cssPxUnit } = require('./constants')

      const shapesMap = function (obj, codify, params) {
        const { level, indent, on, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV, svgGroups } = params

        const types = {
          group: (obj) => {
            let code = codify(obj)
            code += indent + 'var ' + on + ' = cag' + (level + 1) + ';\n'
            return code
          },

          rect: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY) => {
            let x = cagLengthX(obj.x, svgUnitsPmm, svgUnitsX)
            let y = (0 - cagLengthY(obj.y, svgUnitsPmm, svgUnitsY))
            const w = cagLengthX(obj.width, svgUnitsPmm, svgUnitsX)
            const h = cagLengthY(obj.height, svgUnitsPmm, svgUnitsY)
            const rx = cagLengthX(obj.rx, svgUnitsPmm, svgUnitsX)
            // const ry = cagLengthY(obj.ry, svgUnitsPmm, svgUnitsY)
            if (w > 0 && h > 0) {
              x = (x + (w / 2)).toFixed(4) // position the object via the center
              y = (y - (h / 2)).toFixed(4) // position the object via the center
              if (rx === 0) {
                return indent + 'var ' + on + ' = CAG.rectangle({center: [' + x + ',' + y + '], radius: [' + w / 2 + ',' + h / 2 + ']});\n'
              } else {
                return indent + 'var ' + on + ' = CAG.roundedRectangle({center: [' + x + ',' + y + '], radius: [' + w / 2 + ',' + h / 2 + '], roundradius: ' + rx + '});\n'
              }
            }
          },

          circle: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            const x = cagLengthX(obj.x, svgUnitsPmm, svgUnitsX)
            const y = (0 - cagLengthY(obj.y, svgUnitsPmm, svgUnitsY))
            const r = cagLengthP(obj.radius, svgUnitsPmm, svgUnitsV)
            if (r > 0) {
              return indent + 'var ' + on + ' = CAG.circle({center: [' + x + ',' + y + '], radius: ' + r + '});\n'
            }
          },

          ellipse: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            const rx = cagLengthX(obj.rx, svgUnitsPmm, svgUnitsX)
            const ry = cagLengthY(obj.ry, svgUnitsPmm, svgUnitsY)
            const cx = cagLengthX(obj.cx, svgUnitsPmm, svgUnitsX)
            const cy = (0 - cagLengthY(obj.cy, svgUnitsPmm, svgUnitsY))
            if (rx > 0 && ry > 0) {
              return indent + 'var ' + on + ' = CAG.ellipse({center: [' + cx + ',' + cy + '], radius: [' + rx + ',' + ry + ']});\n'
            }
          },

          line: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            const x1 = cagLengthX(obj.x1, svgUnitsPmm, svgUnitsX)
            const y1 = (0 - cagLengthY(obj.y1, svgUnitsPmm, svgUnitsY))
            const x2 = cagLengthX(obj.x2, svgUnitsPmm, svgUnitsX)
            const y2 = (0 - cagLengthY(obj.y2, svgUnitsPmm, svgUnitsY))
            let r = cssPxUnit // default
            if ('strokeWidth' in obj) {
              r = cagLengthP(obj.strokeWidth, svgUnitsPmm, svgUnitsV) / 2
            } else {
              const v = groupValue(svgGroups, 'strokeWidth')
              if (v !== null) {
                r = cagLengthP(v, svgUnitsPmm, svgUnitsV) / 2
              }
            }

            let tmpCode = indent + 'var ' + on + ' = new CSG.Path2D([[' + x1 + ',' + y1 + '],[' + x2 + ',' + y2 + ']],false);\n'
            tmpCode += indent + on + ' = ' + on + '.expandToCAG(' + r + ',CSG.defaultResolution2D);\n'

            return tmpCode
          },

          polygon: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY) => {
            let tmpCode = indent + 'var ' + on + ' = new CSG.Path2D([\n'

            for (let j = 0; j < obj.points.length; j++) {
              const p = obj.points[j]
              if ('x' in p && 'y' in p) {
                const x = cagLengthX(p.x, svgUnitsPmm, svgUnitsX)
                const y = (0 - cagLengthY(p.y, svgUnitsPmm, svgUnitsY))
                tmpCode += indent + '  [' + x + ',' + y + '],\n'
              }
            }
            tmpCode += indent + '],true);\n'
            tmpCode += indent + on + ' = ' + on + '.innerToCAG();\n'
            return tmpCode
          },

          polyline: (obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV) => {
            let r = cssPxUnit // default
            if ('strokeWidth' in obj) {
              r = cagLengthP(obj.strokeWidth, svgUnitsPmm, svgUnitsV) / 2
            } else {
              const v = groupValue(svgGroups, 'strokeWidth')
              if (v !== null) {
                r = cagLengthP(v, svgUnitsPmm, svgUnitsV) / 2
              }
            }
            let tmpCode = indent + 'var ' + on + ' = new CSG.Path2D([\n'
            for (let j = 0; j < obj.points.length; j++) {
              const p = obj.points[j]
              if ('x' in p && 'y' in p) {
                var x = cagLengthX(p.x, svgUnitsPmm, svgUnitsX)
                var y = (0 - cagLengthY(p.y, svgUnitsPmm, svgUnitsY))
                tmpCode += indent + '  [' + x + ',' + y + '],\n'
              }
            }
            tmpCode += indent + '],false);\n'
            tmpCode += indent + on + ' = ' + on + '.expandToCAG(' + r + ',CSG.defaultResolution2D);\n'
            return tmpCode
          },

          path
        }
        return types[obj.type](obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV, params, svgGroups)
      }

      module.exports = shapesMap

      function path(obj, svgUnitsPmm, svgUnitsX, svgUnitsY, svgUnitsV, params, svgGroups) {
        const { indent, on } = params
        let tmpCode = indent + 'var ' + on + ' = new CAG();\n'

        let r = cssPxUnit // default
        if ('strokeWidth' in obj) {
          r = cagLengthP(obj.strokeWidth, svgUnitsPmm, svgUnitsV) / 2
        } else {
          const v = groupValue(svgGroups, 'strokeWidth')
          if (v !== null) {
            r = cagLengthP(v, svgUnitsPmm, svgUnitsV) / 2
          }
        }
        // Note: All values are SVG values
        let sx = 0 // starting position
        let sy = 0
        let cx = 0 // current position
        let cy = 0
        let pi = 0 // current path index
        let pathName = on + pi // current path name
        let pc = false // current path closed
        let bx = 0 // 2nd control point from previous C command
        let by = 0 // 2nd control point from previous C command
        let qx = 0 // 2nd control point from previous Q command
        let qy = 0 // 2nd control point from previous Q command

        for (let j = 0; j < obj.commands.length; j++) {
          let co = obj.commands[j]
          let pts = co.p
          // console.log('postion: ['+cx+','+cy+'] before '+co.c);
          switch (co.c) {
            case 'm': // relative move to X,Y
              // special case, if at beginning of path then treat like absolute M
              if (j === 0) {
                cx = 0; cy = 0
              }
              // close the previous path
              if (pi > 0 && pc === false) {
                tmpCode += indent + pathName + ' = ' + pathName + '.expandToCAG(' + r + ',CSG.defaultResolution2D);\n'
              }
              // open a new path
              if (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                pi++
                pathName = on + pi
                pc = false
                tmpCode += indent + 'var ' + pathName + ' = new CSG.Path2D([[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']],false);\n'
                sx = cx; sy = cy
              }
              // optional implicit relative lineTo (cf SVG spec 8.3.2)
              while (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'M': // absolute move to X,Y
              // close the previous path
              if (pi > 0 && pc === false) {
                tmpCode += indent + pathName + ' = ' + pathName + '.expandToCAG(' + r + ',CSG.defaultResolution2D);\n'
              }
              // open a new path
              if (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                pi++
                pathName = on + pi
                pc = false
                tmpCode += indent + 'var ' + pathName + ' = new CSG.Path2D([[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']],false);\n'
                sx = cx; sy = cy
              }
              // optional implicit absolute lineTo (cf SVG spec 8.3.2)
              while (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'a': // relative elliptical arc
              while (pts.length >= 7) {
                let rx = parseFloat(pts.shift())
                let ry = parseFloat(pts.shift())
                let ro = 0 - parseFloat(pts.shift())
                let lf = (pts.shift() === '1')
                let sf = (pts.shift() === '1')
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendArc([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + '],{xradius: ' + svg2cagX(rx, svgUnitsPmm) + ',yradius: ' + svg2cagY(ry, svgUnitsPmm) + ',xaxisrotation: ' + ro + ',clockwise: ' + sf + ',large: ' + lf + '});\n'
              }
              break
            case 'A': // absolute elliptical arc
              while (pts.length >= 7) {
                let rx = parseFloat(pts.shift())
                let ry = parseFloat(pts.shift())
                let ro = 0 - parseFloat(pts.shift())
                let lf = (pts.shift() === '1')
                let sf = (pts.shift() === '1')
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendArc([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + '],{xradius: ' + svg2cagX(rx, svgUnitsPmm) + ',yradius: ' + svg2cagY(ry, svgUnitsPmm) + ',xaxisrotation: ' + ro + ',clockwise: ' + sf + ',large: ' + lf + '});\n'
              }
              break
            case 'c': // relative cubic Bézier
              while (pts.length >= 6) {
                let x1 = cx + parseFloat(pts.shift())
                let y1 = cy + parseFloat(pts.shift())
                bx = cx + parseFloat(pts.shift())
                by = cy + parseFloat(pts.shift())
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(x1, svgUnitsPmm) + ',' + svg2cagY(y1, svgUnitsPmm) + '],[' + svg2cagX(bx, svgUnitsPmm) + ',' + svg2cagY(by, svgUnitsPmm) + '],[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']]);\n'
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'C': // absolute cubic Bézier
              while (pts.length >= 6) {
                let x1 = parseFloat(pts.shift())
                let y1 = parseFloat(pts.shift())
                bx = parseFloat(pts.shift())
                by = parseFloat(pts.shift())
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(x1, svgUnitsPmm) + ',' + svg2cagY(y1, svgUnitsPmm) + '],[' + svg2cagX(bx, svgUnitsPmm) + ',' + svg2cagY(by, svgUnitsPmm) + '],[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']]);\n'
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'q': // relative quadratic Bézier
              while (pts.length >= 4) {
                qx = cx + parseFloat(pts.shift())
                qy = cy + parseFloat(pts.shift())
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']]);\n'
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 'Q': // absolute quadratic Bézier
              while (pts.length >= 4) {
                qx = parseFloat(pts.shift())
                qy = parseFloat(pts.shift())
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']]);\n'
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 't': // relative quadratic Bézier shorthand
              while (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + cx + ',' + cy + ']]);\n'
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 'T': // absolute quadratic Bézier shorthand
              while (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + svg2cagX(qx, svgUnitsPmm) + ',' + svg2cagY(qy, svgUnitsPmm) + '],[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']]);\n'
                let rf = reflect(qx, qy, cx, cy)
                qx = rf[0]
                qy = rf[1]
              }
              break
            case 's': // relative cubic Bézier shorthand
              while (pts.length >= 4) {
                let x1 = bx // reflection of 2nd control point from previous C
                let y1 = by // reflection of 2nd control point from previous C
                bx = cx + parseFloat(pts.shift())
                by = cy + parseFloat(pts.shift())
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(x1, svgUnitsPmm) + ',' + svg2cagY(y1, svgUnitsPmm) + '],[' + svg2cagX(bx, svgUnitsPmm) + ',' + svg2cagY(by, svgUnitsPmm) + '],[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']]);\n'
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'S': // absolute cubic Bézier shorthand
              while (pts.length >= 4) {
                let x1 = bx // reflection of 2nd control point from previous C
                let y1 = by // reflection of 2nd control point from previous C
                bx = parseFloat(pts.shift())
                by = parseFloat(pts.shift())
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendBezier([[' + svg2cagX(x1, svgUnitsPmm) + ',' + svg2cagY(y1, svgUnitsPmm) + '],[' + svg2cagX(bx, svgUnitsPmm) + ',' + svg2cagY(by, svgUnitsPmm) + '],[' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']]);\n'
                let rf = reflect(bx, by, cx, cy)
                bx = rf[0]
                by = rf[1]
              }
              break
            case 'h': // relative Horzontal line to
              while (pts.length >= 1) {
                cx = cx + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'H': // absolute Horzontal line to
              while (pts.length >= 1) {
                cx = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'l': // relative line to
              while (pts.length >= 2) {
                cx = cx + parseFloat(pts.shift())
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'L': // absolute line to
              while (pts.length >= 2) {
                cx = parseFloat(pts.shift())
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'v': // relative Vertical line to
              while (pts.length >= 1) {
                cy = cy + parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'V': // absolute Vertical line to
              while (pts.length >= 1) {
                cy = parseFloat(pts.shift())
                tmpCode += indent + pathName + ' = ' + pathName + '.appendPoint([' + svg2cagX(cx, svgUnitsPmm) + ',' + svg2cagY(cy, svgUnitsPmm) + ']);\n'
              }
              break
            case 'z': // close current line
            case 'Z':
              tmpCode += indent + pathName + ' = ' + pathName + '.close();\n'
              tmpCode += indent + pathName + ' = ' + pathName + '.innerToCAG();\n'
              tmpCode += indent + on + ' = ' + on + '.union(' + pathName + ');\n'
              cx = sx
              cy = sy // return to the starting point
              pc = true
              break
            default:
              console.log('Warning: Unknow PATH command [' + co.c + ']')
              break
          }
          // console.log('postion: ['+cx+','+cy+'] after '+co.c);
        }
        if (pi > 0 && pc === false) {
          tmpCode += indent + pathName + ' = ' + pathName + '.expandToCAG(' + r + ',CSG.defaultResolution2D);\n'
          tmpCode += indent + on + ' = ' + on + '.union(' + pathName + ');\n'
        }
        return tmpCode
      }

    }, { "./constants": 97, "./helpers": 98 }], 102: [function (require, module, exports) {
      const { cagColor, cssStyle, css2cag } = require('./helpers')
      const { pxPmm } = require('./constants')

      const svgCore = function (obj, element) {
        if ('ID' in element) { obj.id = element.ID }
      }

      const svgPresentation = function (obj, element) {
        // presentation attributes for all
        if ('DISPLAY' in element) { obj.visible = element.DISPLAY }
        // presentation attributes for solids
        if ('COLOR' in element) { obj.fill = cagColor(element.COLOR) }
        if ('OPACITY' in element) { obj.opacity = element.OPACITY }
        if ('FILL' in element) {
          obj.fill = cagColor(element.FILL)
        } else {
          var s = cssStyle(element, 'fill')
          if (s !== null) {
            obj.fill = cagColor(s)
          }
        }
        if ('FILL-OPACITY' in element) { obj.opacity = element['FILL-OPACITY'] }
        // presentation attributes for lines
        if ('STROKE-WIDTH' in element) {
          obj.strokeWidth = element['STROKE-WIDTH']
        } else {
          var sw = cssStyle(element, 'stroke-width')
          if (sw !== null) {
            obj.strokeWidth = sw
          }
        }
        if ('STROKE' in element) {
          obj.stroke = cagColor(element.STROKE)
        } else {
          let s = cssStyle(element, 'stroke')
          if (s !== null) {
            obj.stroke = cagColor(s)
          }
        }
        if ('STROKE-OPACITY' in element) { obj.strokeOpacity = element['STROKE-OPACITY'] }
      }

      const svgTransforms = function (cag, element) {
        var list = null
        if ('TRANSFORM' in element) {
          list = element.TRANSFORM
        } else {
          var s = cssStyle(element, 'transform')
          if (s !== null) { list = s }
        }
        if (list !== null) {
          cag.transforms = []
          let exp = new RegExp('\\w+\\(.+\\)', 'i')
          var v = exp.exec(list)
          while (v !== null) {
            let s = exp.lastIndex
            var e = list.indexOf(')') + 1
            var t = list.slice(s, e) // the transform
            t = t.trim()
            // add the transform to the CAG
            // which are applied in the order provided
            var n = t.slice(0, t.indexOf('('))
            var a = t.slice(t.indexOf('(') + 1, t.indexOf(')')).trim()
            if (a.indexOf(',') > 0) { a = a.split(',') } else { a = a.split(' ') }
            let o
            switch (n) {
              case 'translate':
                o = { translate: [a[0], a[1]] }
                cag.transforms.push(o)
                break
              case 'scale':
                if (a.length === 1) a.push(a[0]) // as per SVG
                o = { scale: [a[0], a[1]] }
                cag.transforms.push(o)
                break
              case 'rotate':
                o = { rotate: a }
                cag.transforms.push(o)
                break
              // case 'matrix':
              // case 'skewX':
              // case 'skewY':
              default:
                break
            }
            // shorten the list and continue
            list = list.slice(e, list.length)
            v = exp.exec(list)
          }
        }
      }

      const svgSvg = function (element, { customPxPmm }) {
        // default SVG with no viewport
        var obj = { type: 'svg', x: 0, y: 0, width: '100%', height: '100%', strokeWidth: '1' }

        // default units per mm
        obj.unitsPmm = [pxPmm, pxPmm]

        if ('PXPMM' in element) {
          // WOW! a supplied value for pixels per milimeter!!!
          obj.pxPmm = element.PXPMM
          obj.unitsPmm = [obj.pxPmm, obj.pxPmm]
        }
        if ('WIDTH' in element) { obj.width = element.WIDTH }
        if ('HEIGHT' in element) { obj.height = element.HEIGHT }
        if ('VIEWBOX' in element) {
          var list = element.VIEWBOX.trim()
          var exp = new RegExp('([\\d\\.\\-]+)[\\s,]+([\\d\\.\\-]+)[\\s,]+([\\d\\.\\-]+)[\\s,]+([\\d\\.\\-]+)', 'i')
          var v = exp.exec(list)
          if (v !== null) {
            obj.viewX = parseFloat(v[1])
            obj.viewY = parseFloat(v[2])
            obj.viewW = parseFloat(v[3])
            obj.viewH = parseFloat(v[4])
          }
          // apply the viewbox
          if (obj.width.indexOf('%') < 0) {
            // calculate a scaling from width and viewW
            var s = css2cag(obj.width, customPxPmm) // width in millimeters
            s = obj.viewW / s
            // scale the default units
            // obj.unitsPmm[0] = obj.unitsPmm[0] * s;
            obj.unitsPmm[0] = s
          } else {
            // scale the default units by the width (%)
            const u = obj.unitsPmm[0] * (parseFloat(obj.width) / 100.0)
            obj.unitsPmm[0] = u
          }
          if (obj.height.indexOf('%') < 0) {
            // calculate a scaling from height and viewH
            let s = css2cag(obj.height, pxPmm) // height in millimeters
            s = obj.viewH / s
            // scale the default units
            // obj.unitsPmm[1] = obj.unitsPmm[1] * s;
            obj.unitsPmm[1] = s
          } else {
            // scale the default units by the width (%)
            const u = obj.unitsPmm[1] * (parseFloat(obj.height) / 100.0)
            obj.unitsPmm[1] = u
          }
        } else {
          obj.viewX = 0
          obj.viewY = 0
          obj.viewW = 1920 / obj.unitsPmm[0] // average screen size / pixels per unit
          obj.viewH = 1080 / obj.unitsPmm[1] // average screen size / pixels per unit
        }
        obj.viewP = Math.sqrt((obj.viewW * obj.viewW) + (obj.viewH * obj.viewH)) / Math.SQRT2

        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)

        obj.objects = []
        // console.log(JSON.stringify(obj));
        return obj
      }

      const svgEllipse = function (element) {
        const obj = { type: 'ellipse', cx: '0', cy: '0', rx: '0', ry: '0' }
        if ('CX' in element) { obj.cx = element.CX }
        if ('CY' in element) { obj.cy = element.CY }
        if ('RX' in element) { obj.rx = element.RX }
        if ('RY' in element) { obj.ry = element.RY }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)
        return obj
      }

      const svgLine = function (element) {
        var obj = { type: 'line', x1: '0', y1: '0', x2: '0', y2: '0' }
        if ('X1' in element) { obj.x1 = element.X1 }
        if ('Y1' in element) { obj.y1 = element.Y1 }
        if ('X2' in element) { obj.x2 = element.X2 }
        if ('Y2' in element) { obj.y2 = element.Y2 }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)
        return obj
      }

      const svgListOfPoints = function (list) {
        var points = []
        var exp = new RegExp('([\\d\\-\\+\\.]+)[\\s,]+([\\d\\-\\+\\.]+)[\\s,]*', 'i')
        list = list.trim()
        var v = exp.exec(list)
        while (v !== null) {
          var point = v[0]
          var next = exp.lastIndex + point.length
          point = { x: v[1], y: v[2] }
          points.push(point)
          list = list.slice(next, list.length)
          v = exp.exec(list)
        }
        return points
      }

      const svgPolyline = function (element) {
        const obj = { type: 'polyline' }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)

        if ('POINTS' in element) {
          obj.points = svgListOfPoints(element.POINTS)
        }
        return obj
      }

      const svgPolygon = function (element) {
        const obj = { type: 'polygon' }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)

        if ('POINTS' in element) {
          obj.points = svgListOfPoints(element.POINTS)
        }
        return obj
      }

      const svgRect = function (element) {
        var obj = { type: 'rect', x: '0', y: '0', rx: '0', ry: '0', width: '0', height: '0' }

        if ('X' in element) { obj.x = element.X }
        if ('Y' in element) { obj.y = element.Y }
        if ('RX' in element) {
          obj.rx = element.RX
          if (!('RY' in element)) { obj.ry = obj.rx } // by SVG specification
        }
        if ('RY' in element) {
          obj.ry = element.RY
          if (!('RX' in element)) { obj.rx = obj.ry } // by SVG specification
        }
        if (obj.rx !== obj.ry) {
          console.log('Warning: Unsupported RECT with RX and RY radius')
        }
        if ('WIDTH' in element) { obj.width = element.WIDTH }
        if ('HEIGHT' in element) { obj.height = element.HEIGHT }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)
        return obj
      }

      const svgCircle = function (element) {
        let obj = { type: 'circle', x: '0', y: '0', radius: '0' }

        if ('CX' in element) { obj.x = element.CX }
        if ('CY' in element) { obj.y = element.CY }
        if ('R' in element) { obj.radius = element.R }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)
        return obj
      }

      const svgGroup = function (element) {
        let obj = { type: 'group' }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)

        obj.objects = []
        return obj
      }

      //
      // Convert the PATH element into object representation
      //
      const svgPath = function (element) {
        var obj = { type: 'path' }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        // svgPresentation(obj,element);

        obj.commands = []
        if ('D' in element) {
          var co = null // current command
          var bf = ''

          var i = 0
          var l = element.D.length
          while (i < l) {
            var c = element.D[i]
            switch (c) {
              // numbers
              // FIXME support E notation numbers
              case '-':
                if (bf.length > 0) {
                  co.p.push(bf)
                  bf = ''
                }
                bf += c
                break
              case '.':
                if (bf.length > 0) {
                  if (bf.indexOf('.') >= 0) {
                    co.p.push(bf)
                    bf = ''
                  }
                }
                bf += c
                break
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                bf += c
                break
              // commands
              case 'a':
              case 'A':
              case 'c':
              case 'C':
              case 'h':
              case 'H':
              case 'l':
              case 'L':
              case 'v':
              case 'V':
              case 'm':
              case 'M':
              case 'q':
              case 'Q':
              case 's':
              case 'S':
              case 't':
              case 'T':
              case 'z':
              case 'Z':
                if (co !== null) {
                  if (bf.length > 0) {
                    co.p.push(bf)
                    bf = ''
                  }
                  obj.commands.push(co)
                }
                co = { c: c, p: [] }
                break
              // white space
              case ',':
              case ' ':
              case '\n':
                if (co !== null) {
                  if (bf.length > 0) {
                    co.p.push(bf)
                    bf = ''
                  }
                }
                break
              default:
                break
            }
            i++
          }
          if (i === l && co !== null) {
            if (bf.length > 0) {
              co.p.push(bf)
            }
            obj.commands.push(co)
          }
        }
        return obj
      }

      // generate GROUP with attributes from USE element
      // - except X,Y,HEIGHT,WIDTH,XLINK:HREF
      // - append translate(x,y) if X,Y available
      // deep clone the referenced OBJECT and add to group
      // - clone using JSON.parse(JSON.stringify(obj))
      const svgUse = function (element, { svgObjects }) {
        var obj = { type: 'group' }
        // transforms
        svgTransforms(obj, element)
        // core attributes
        svgCore(obj, element)
        // presentation attributes
        svgPresentation(obj, element)

        if ('X' in element && 'Y' in element) {
          if (!('transforms' in obj)) obj.transforms = []
          var o = { translate: [element.X, element.Y] }
          obj.transforms.push(o)
        }

        obj.objects = []
        if ('XLINK:HREF' in element) {
          // lookup the named object
          var ref = element['XLINK:HREF']
          if (ref[0] === '#') { ref = ref.slice(1, ref.length) }
          if (svgObjects[ref] !== undefined) {
            ref = svgObjects[ref]
            ref = JSON.parse(JSON.stringify(ref))
            obj.objects.push(ref)
          }
        }
        return obj
      }

      module.exports = {
        svgCore,
        svgPresentation,
        svgSvg,
        svgRect,
        svgCircle,
        svgEllipse,
        svgLine,
        svgPolyline,
        svgPolygon,
        svgGroup,
        svgPath,
        svgUse
      }

    }, { "./constants": 97, "./helpers": 98 }], 103: [function (require, module, exports) {
      // import { CSG } from '@jscad/csg'
      const { CSG } = require('@jscad/csg')

      const mimeType = 'image/svg+xml'

      function serialize(cagObject) {
        var decimals = 1000

        // mirror the CAG about the X axis in order to generate paths into the POSITIVE direction
        var plane = new CSG.Plane(CSG.Vector3D.Create(0, 1, 0), 0)
        var cag = cagObject.transform(CSG.Matrix4x4.mirroring(plane))

        var bounds = cag.getBounds()
        var paths = cag.getOutlinePaths()
        var width = Math.round((bounds[1].x - bounds[0].x) * decimals) / decimals
        var height = Math.round((bounds[1].y - bounds[0].y) * decimals) / decimals
        var svg = '<?xml version="1.0" encoding="UTF-8"?>\n'
        svg += '<!-- Generated by OpenJSCAD.org -->\n'
        svg += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">\n'
        svg += '<svg width="' + width + 'mm" height="' + height + 'mm" viewBox="0 0 ' + width + ' ' + height + '" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'
        svg += PathsToSvg(paths, bounds)
        svg += '</svg>'
        return [svg]
      }

      function PathsToSvg(paths, bounds) {
        // calculate offsets in order to create paths orientated from the 0,0 axis
        var xoffset = 0 - bounds[0].x
        var yoffset = 0 - bounds[0].y
        var str = '<g>\n'
        paths.map(function (path) {
          str += '<path d="'
          // FIXME add fill color when CAG has support for colors
          var numpointsClosed = path.points.length + (path.closed ? 1 : 0)
          for (var pointindex = 0; pointindex < numpointsClosed; pointindex++) {
            var pointindexwrapped = pointindex
            if (pointindexwrapped >= path.points.length) pointindexwrapped -= path.points.length
            var point = path.points[pointindexwrapped]
            if (pointindex > 0) {
              str += 'L' + (point.x + xoffset) + ' ' + (point.y + yoffset)
            } else {
              str += 'M' + (point.x + xoffset) + ' ' + (point.y + yoffset)
            }
          }
          str += '"/>\n'
        })
        str += '</g>\n'
        return str
      }

      module.exports = {
        serialize,
        mimeType
      }

    }, { "@jscad/csg": 1 }], 104: [function (require, module, exports) {
      'use strict'

      exports.byteLength = byteLength
      exports.toByteArray = toByteArray
      exports.fromByteArray = fromByteArray

      var lookup = []
      var revLookup = []
      var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

      var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i]
        revLookup[code.charCodeAt(i)] = i
      }

      // Support decoding URL-safe base64 strings, as Node.js does.
      // See: https://en.wikipedia.org/wiki/Base64#URL_applications
      revLookup['-'.charCodeAt(0)] = 62
      revLookup['_'.charCodeAt(0)] = 63

      function getLens(b64) {
        var len = b64.length

        if (len % 4 > 0) {
          throw new Error('Invalid string. Length must be a multiple of 4')
        }

        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        var validLen = b64.indexOf('=')
        if (validLen === -1) validLen = len

        var placeHoldersLen = validLen === len
          ? 0
          : 4 - (validLen % 4)

        return [validLen, placeHoldersLen]
      }

      // base64 is 4/3 + up to two characters of the original data
      function byteLength(b64) {
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }

      function _byteLength(b64, validLen, placeHoldersLen) {
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }

      function toByteArray(b64) {
        var tmp
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]

        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

        var curByte = 0

        // if there are placeholders, only get up to the last complete 4 chars
        var len = placeHoldersLen > 0
          ? validLen - 4
          : validLen

        var i
        for (i = 0; i < len; i += 4) {
          tmp =
            (revLookup[b64.charCodeAt(i)] << 18) |
            (revLookup[b64.charCodeAt(i + 1)] << 12) |
            (revLookup[b64.charCodeAt(i + 2)] << 6) |
            revLookup[b64.charCodeAt(i + 3)]
          arr[curByte++] = (tmp >> 16) & 0xFF
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 2) {
          tmp =
            (revLookup[b64.charCodeAt(i)] << 2) |
            (revLookup[b64.charCodeAt(i + 1)] >> 4)
          arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 1) {
          tmp =
            (revLookup[b64.charCodeAt(i)] << 10) |
            (revLookup[b64.charCodeAt(i + 1)] << 4) |
            (revLookup[b64.charCodeAt(i + 2)] >> 2)
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }

        return arr
      }

      function tripletToBase64(num) {
        return lookup[num >> 18 & 0x3F] +
          lookup[num >> 12 & 0x3F] +
          lookup[num >> 6 & 0x3F] +
          lookup[num & 0x3F]
      }

      function encodeChunk(uint8, start, end) {
        var tmp
        var output = []
        for (var i = start; i < end; i += 3) {
          tmp =
            ((uint8[i] << 16) & 0xFF0000) +
            ((uint8[i + 1] << 8) & 0xFF00) +
            (uint8[i + 2] & 0xFF)
          output.push(tripletToBase64(tmp))
        }
        return output.join('')
      }

      function fromByteArray(uint8) {
        var tmp
        var len = uint8.length
        var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        var parts = []
        var maxChunkLength = 16383 // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
          parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
          tmp = uint8[len - 1]
          parts.push(
            lookup[tmp >> 2] +
            lookup[(tmp << 4) & 0x3F] +
            '=='
          )
        } else if (extraBytes === 2) {
          tmp = (uint8[len - 2] << 8) + uint8[len - 1]
          parts.push(
            lookup[tmp >> 10] +
            lookup[(tmp >> 4) & 0x3F] +
            lookup[(tmp << 2) & 0x3F] +
            '='
          )
        }

        return parts.join('')
      }

    }, {}], 105: [function (require, module, exports) {

    }, {}], 106: [function (require, module, exports) {
      (function (Buffer) {
        (function () {
          /*!
           * The buffer module from node.js, for the browser.
           *
           * @author   Feross Aboukhadijeh <https://feross.org>
           * @license  MIT
           */
          /* eslint-disable no-proto */

          'use strict'

          var base64 = require('base64-js')
          var ieee754 = require('ieee754')
          var customInspectSymbol =
            (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
              ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
              : null

          exports.Buffer = Buffer
          exports.SlowBuffer = SlowBuffer
          exports.INSPECT_MAX_BYTES = 50

          var K_MAX_LENGTH = 0x7fffffff
          exports.kMaxLength = K_MAX_LENGTH

          /**
           * If `Buffer.TYPED_ARRAY_SUPPORT`:
           *   === true    Use Uint8Array implementation (fastest)
           *   === false   Print warning and recommend using `buffer` v4.x which has an Object
           *               implementation (most compatible, even IE6)
           *
           * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
           * Opera 11.6+, iOS 4.2+.
           *
           * We report that the browser does not support typed arrays if the are not subclassable
           * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
           * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
           * for __proto__ and has a buggy typed array implementation.
           */
          Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

          if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
            typeof console.error === 'function') {
            console.error(
              'This browser lacks typed array (Uint8Array) support which is required by ' +
              '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
            )
          }

          function typedArraySupport() {
            // Can typed array instances can be augmented?
            try {
              var arr = new Uint8Array(1)
              var proto = { foo: function () { return 42 } }
              Object.setPrototypeOf(proto, Uint8Array.prototype)
              Object.setPrototypeOf(arr, proto)
              return arr.foo() === 42
            } catch (e) {
              return false
            }
          }

          Object.defineProperty(Buffer.prototype, 'parent', {
            enumerable: true,
            get: function () {
              if (!Buffer.isBuffer(this)) return undefined
              return this.buffer
            }
          })

          Object.defineProperty(Buffer.prototype, 'offset', {
            enumerable: true,
            get: function () {
              if (!Buffer.isBuffer(this)) return undefined
              return this.byteOffset
            }
          })

          function createBuffer(length) {
            if (length > K_MAX_LENGTH) {
              throw new RangeError('The value "' + length + '" is invalid for option "size"')
            }
            // Return an augmented `Uint8Array` instance
            var buf = new Uint8Array(length)
            Object.setPrototypeOf(buf, Buffer.prototype)
            return buf
          }

          /**
           * The Buffer constructor returns instances of `Uint8Array` that have their
           * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
           * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
           * and the `Uint8Array` methods. Square bracket notation works as expected -- it
           * returns a single octet.
           *
           * The `Uint8Array` prototype remains unmodified.
           */

          function Buffer(arg, encodingOrOffset, length) {
            // Common case.
            if (typeof arg === 'number') {
              if (typeof encodingOrOffset === 'string') {
                throw new TypeError(
                  'The "string" argument must be of type string. Received type number'
                )
              }
              return allocUnsafe(arg)
            }
            return from(arg, encodingOrOffset, length)
          }

          Buffer.poolSize = 8192 // not used by this implementation

          function from(value, encodingOrOffset, length) {
            if (typeof value === 'string') {
              return fromString(value, encodingOrOffset)
            }

            if (ArrayBuffer.isView(value)) {
              return fromArrayView(value)
            }

            if (value == null) {
              throw new TypeError(
                'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
                'or Array-like Object. Received type ' + (typeof value)
              )
            }

            if (isInstance(value, ArrayBuffer) ||
              (value && isInstance(value.buffer, ArrayBuffer))) {
              return fromArrayBuffer(value, encodingOrOffset, length)
            }

            if (typeof SharedArrayBuffer !== 'undefined' &&
              (isInstance(value, SharedArrayBuffer) ||
                (value && isInstance(value.buffer, SharedArrayBuffer)))) {
              return fromArrayBuffer(value, encodingOrOffset, length)
            }

            if (typeof value === 'number') {
              throw new TypeError(
                'The "value" argument must not be of type number. Received type number'
              )
            }

            var valueOf = value.valueOf && value.valueOf()
            if (valueOf != null && valueOf !== value) {
              return Buffer.from(valueOf, encodingOrOffset, length)
            }

            var b = fromObject(value)
            if (b) return b

            if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
              typeof value[Symbol.toPrimitive] === 'function') {
              return Buffer.from(
                value[Symbol.toPrimitive]('string'), encodingOrOffset, length
              )
            }

            throw new TypeError(
              'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
              'or Array-like Object. Received type ' + (typeof value)
            )
          }

          /**
           * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
           * if value is a number.
           * Buffer.from(str[, encoding])
           * Buffer.from(array)
           * Buffer.from(buffer)
           * Buffer.from(arrayBuffer[, byteOffset[, length]])
           **/
          Buffer.from = function (value, encodingOrOffset, length) {
            return from(value, encodingOrOffset, length)
          }

          // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
          // https://github.com/feross/buffer/pull/148
          Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
          Object.setPrototypeOf(Buffer, Uint8Array)

          function assertSize(size) {
            if (typeof size !== 'number') {
              throw new TypeError('"size" argument must be of type number')
            } else if (size < 0) {
              throw new RangeError('The value "' + size + '" is invalid for option "size"')
            }
          }

          function alloc(size, fill, encoding) {
            assertSize(size)
            if (size <= 0) {
              return createBuffer(size)
            }
            if (fill !== undefined) {
              // Only pay attention to encoding if it's a string. This
              // prevents accidentally sending in a number that would
              // be interpreted as a start offset.
              return typeof encoding === 'string'
                ? createBuffer(size).fill(fill, encoding)
                : createBuffer(size).fill(fill)
            }
            return createBuffer(size)
          }

          /**
           * Creates a new filled Buffer instance.
           * alloc(size[, fill[, encoding]])
           **/
          Buffer.alloc = function (size, fill, encoding) {
            return alloc(size, fill, encoding)
          }

          function allocUnsafe(size) {
            assertSize(size)
            return createBuffer(size < 0 ? 0 : checked(size) | 0)
          }

          /**
           * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
           * */
          Buffer.allocUnsafe = function (size) {
            return allocUnsafe(size)
          }
          /**
           * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
           */
          Buffer.allocUnsafeSlow = function (size) {
            return allocUnsafe(size)
          }

          function fromString(string, encoding) {
            if (typeof encoding !== 'string' || encoding === '') {
              encoding = 'utf8'
            }

            if (!Buffer.isEncoding(encoding)) {
              throw new TypeError('Unknown encoding: ' + encoding)
            }

            var length = byteLength(string, encoding) | 0
            var buf = createBuffer(length)

            var actual = buf.write(string, encoding)

            if (actual !== length) {
              // Writing a hex string, for example, that contains invalid characters will
              // cause everything after the first invalid character to be ignored. (e.g.
              // 'abxxcd' will be treated as 'ab')
              buf = buf.slice(0, actual)
            }

            return buf
          }

          function fromArrayLike(array) {
            var length = array.length < 0 ? 0 : checked(array.length) | 0
            var buf = createBuffer(length)
            for (var i = 0; i < length; i += 1) {
              buf[i] = array[i] & 255
            }
            return buf
          }

          function fromArrayView(arrayView) {
            if (isInstance(arrayView, Uint8Array)) {
              var copy = new Uint8Array(arrayView)
              return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
            }
            return fromArrayLike(arrayView)
          }

          function fromArrayBuffer(array, byteOffset, length) {
            if (byteOffset < 0 || array.byteLength < byteOffset) {
              throw new RangeError('"offset" is outside of buffer bounds')
            }

            if (array.byteLength < byteOffset + (length || 0)) {
              throw new RangeError('"length" is outside of buffer bounds')
            }

            var buf
            if (byteOffset === undefined && length === undefined) {
              buf = new Uint8Array(array)
            } else if (length === undefined) {
              buf = new Uint8Array(array, byteOffset)
            } else {
              buf = new Uint8Array(array, byteOffset, length)
            }

            // Return an augmented `Uint8Array` instance
            Object.setPrototypeOf(buf, Buffer.prototype)

            return buf
          }

          function fromObject(obj) {
            if (Buffer.isBuffer(obj)) {
              var len = checked(obj.length) | 0
              var buf = createBuffer(len)

              if (buf.length === 0) {
                return buf
              }

              obj.copy(buf, 0, 0, len)
              return buf
            }

            if (obj.length !== undefined) {
              if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
                return createBuffer(0)
              }
              return fromArrayLike(obj)
            }

            if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
              return fromArrayLike(obj.data)
            }
          }

          function checked(length) {
            // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
            // length is NaN (which is otherwise coerced to zero.)
            if (length >= K_MAX_LENGTH) {
              throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
            }
            return length | 0
          }

          function SlowBuffer(length) {
            if (+length != length) { // eslint-disable-line eqeqeq
              length = 0
            }
            return Buffer.alloc(+length)
          }

          Buffer.isBuffer = function isBuffer(b) {
            return b != null && b._isBuffer === true &&
              b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
          }

          Buffer.compare = function compare(a, b) {
            if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
            if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
            if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
              throw new TypeError(
                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
              )
            }

            if (a === b) return 0

            var x = a.length
            var y = b.length

            for (var i = 0, len = Math.min(x, y); i < len; ++i) {
              if (a[i] !== b[i]) {
                x = a[i]
                y = b[i]
                break
              }
            }

            if (x < y) return -1
            if (y < x) return 1
            return 0
          }

          Buffer.isEncoding = function isEncoding(encoding) {
            switch (String(encoding).toLowerCase()) {
              case 'hex':
              case 'utf8':
              case 'utf-8':
              case 'ascii':
              case 'latin1':
              case 'binary':
              case 'base64':
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return true
              default:
                return false
            }
          }

          Buffer.concat = function concat(list, length) {
            if (!Array.isArray(list)) {
              throw new TypeError('"list" argument must be an Array of Buffers')
            }

            if (list.length === 0) {
              return Buffer.alloc(0)
            }

            var i
            if (length === undefined) {
              length = 0
              for (i = 0; i < list.length; ++i) {
                length += list[i].length
              }
            }

            var buffer = Buffer.allocUnsafe(length)
            var pos = 0
            for (i = 0; i < list.length; ++i) {
              var buf = list[i]
              if (isInstance(buf, Uint8Array)) {
                if (pos + buf.length > buffer.length) {
                  Buffer.from(buf).copy(buffer, pos)
                } else {
                  Uint8Array.prototype.set.call(
                    buffer,
                    buf,
                    pos
                  )
                }
              } else if (!Buffer.isBuffer(buf)) {
                throw new TypeError('"list" argument must be an Array of Buffers')
              } else {
                buf.copy(buffer, pos)
              }
              pos += buf.length
            }
            return buffer
          }

          function byteLength(string, encoding) {
            if (Buffer.isBuffer(string)) {
              return string.length
            }
            if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
              return string.byteLength
            }
            if (typeof string !== 'string') {
              throw new TypeError(
                'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
                'Received type ' + typeof string
              )
            }

            var len = string.length
            var mustMatch = (arguments.length > 2 && arguments[2] === true)
            if (!mustMatch && len === 0) return 0

            // Use a for loop to avoid recursion
            var loweredCase = false
            for (; ;) {
              switch (encoding) {
                case 'ascii':
                case 'latin1':
                case 'binary':
                  return len
                case 'utf8':
                case 'utf-8':
                  return utf8ToBytes(string).length
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return len * 2
                case 'hex':
                  return len >>> 1
                case 'base64':
                  return base64ToBytes(string).length
                default:
                  if (loweredCase) {
                    return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
                  }
                  encoding = ('' + encoding).toLowerCase()
                  loweredCase = true
              }
            }
          }
          Buffer.byteLength = byteLength

          function slowToString(encoding, start, end) {
            var loweredCase = false

            // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
            // property of a typed array.

            // This behaves neither like String nor Uint8Array in that we set start/end
            // to their upper/lower bounds if the value passed is out of range.
            // undefined is handled specially as per ECMA-262 6th Edition,
            // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
            if (start === undefined || start < 0) {
              start = 0
            }
            // Return early if start > this.length. Done here to prevent potential uint32
            // coercion fail below.
            if (start > this.length) {
              return ''
            }

            if (end === undefined || end > this.length) {
              end = this.length
            }

            if (end <= 0) {
              return ''
            }

            // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
            end >>>= 0
            start >>>= 0

            if (end <= start) {
              return ''
            }

            if (!encoding) encoding = 'utf8'

            while (true) {
              switch (encoding) {
                case 'hex':
                  return hexSlice(this, start, end)

                case 'utf8':
                case 'utf-8':
                  return utf8Slice(this, start, end)

                case 'ascii':
                  return asciiSlice(this, start, end)

                case 'latin1':
                case 'binary':
                  return latin1Slice(this, start, end)

                case 'base64':
                  return base64Slice(this, start, end)

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return utf16leSlice(this, start, end)

                default:
                  if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                  encoding = (encoding + '').toLowerCase()
                  loweredCase = true
              }
            }
          }

          // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
          // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
          // reliably in a browserify context because there could be multiple different
          // copies of the 'buffer' package in use. This method works even for Buffer
          // instances that were created from another copy of the `buffer` package.
          // See: https://github.com/feross/buffer/issues/154
          Buffer.prototype._isBuffer = true

          function swap(b, n, m) {
            var i = b[n]
            b[n] = b[m]
            b[m] = i
          }

          Buffer.prototype.swap16 = function swap16() {
            var len = this.length
            if (len % 2 !== 0) {
              throw new RangeError('Buffer size must be a multiple of 16-bits')
            }
            for (var i = 0; i < len; i += 2) {
              swap(this, i, i + 1)
            }
            return this
          }

          Buffer.prototype.swap32 = function swap32() {
            var len = this.length
            if (len % 4 !== 0) {
              throw new RangeError('Buffer size must be a multiple of 32-bits')
            }
            for (var i = 0; i < len; i += 4) {
              swap(this, i, i + 3)
              swap(this, i + 1, i + 2)
            }
            return this
          }

          Buffer.prototype.swap64 = function swap64() {
            var len = this.length
            if (len % 8 !== 0) {
              throw new RangeError('Buffer size must be a multiple of 64-bits')
            }
            for (var i = 0; i < len; i += 8) {
              swap(this, i, i + 7)
              swap(this, i + 1, i + 6)
              swap(this, i + 2, i + 5)
              swap(this, i + 3, i + 4)
            }
            return this
          }

          Buffer.prototype.toString = function toString() {
            var length = this.length
            if (length === 0) return ''
            if (arguments.length === 0) return utf8Slice(this, 0, length)
            return slowToString.apply(this, arguments)
          }

          Buffer.prototype.toLocaleString = Buffer.prototype.toString

          Buffer.prototype.equals = function equals(b) {
            if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
            if (this === b) return true
            return Buffer.compare(this, b) === 0
          }

          Buffer.prototype.inspect = function inspect() {
            var str = ''
            var max = exports.INSPECT_MAX_BYTES
            str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
            if (this.length > max) str += ' ... '
            return '<Buffer ' + str + '>'
          }
          if (customInspectSymbol) {
            Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
          }

          Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
            if (isInstance(target, Uint8Array)) {
              target = Buffer.from(target, target.offset, target.byteLength)
            }
            if (!Buffer.isBuffer(target)) {
              throw new TypeError(
                'The "target" argument must be one of type Buffer or Uint8Array. ' +
                'Received type ' + (typeof target)
              )
            }

            if (start === undefined) {
              start = 0
            }
            if (end === undefined) {
              end = target ? target.length : 0
            }
            if (thisStart === undefined) {
              thisStart = 0
            }
            if (thisEnd === undefined) {
              thisEnd = this.length
            }

            if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
              throw new RangeError('out of range index')
            }

            if (thisStart >= thisEnd && start >= end) {
              return 0
            }
            if (thisStart >= thisEnd) {
              return -1
            }
            if (start >= end) {
              return 1
            }

            start >>>= 0
            end >>>= 0
            thisStart >>>= 0
            thisEnd >>>= 0

            if (this === target) return 0

            var x = thisEnd - thisStart
            var y = end - start
            var len = Math.min(x, y)

            var thisCopy = this.slice(thisStart, thisEnd)
            var targetCopy = target.slice(start, end)

            for (var i = 0; i < len; ++i) {
              if (thisCopy[i] !== targetCopy[i]) {
                x = thisCopy[i]
                y = targetCopy[i]
                break
              }
            }

            if (x < y) return -1
            if (y < x) return 1
            return 0
          }

          // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
          // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
          //
          // Arguments:
          // - buffer - a Buffer to search
          // - val - a string, Buffer, or number
          // - byteOffset - an index into `buffer`; will be clamped to an int32
          // - encoding - an optional encoding, relevant is val is a string
          // - dir - true for indexOf, false for lastIndexOf
          function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
            // Empty buffer means no match
            if (buffer.length === 0) return -1

            // Normalize byteOffset
            if (typeof byteOffset === 'string') {
              encoding = byteOffset
              byteOffset = 0
            } else if (byteOffset > 0x7fffffff) {
              byteOffset = 0x7fffffff
            } else if (byteOffset < -0x80000000) {
              byteOffset = -0x80000000
            }
            byteOffset = +byteOffset // Coerce to Number.
            if (numberIsNaN(byteOffset)) {
              // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
              byteOffset = dir ? 0 : (buffer.length - 1)
            }

            // Normalize byteOffset: negative offsets start from the end of the buffer
            if (byteOffset < 0) byteOffset = buffer.length + byteOffset
            if (byteOffset >= buffer.length) {
              if (dir) return -1
              else byteOffset = buffer.length - 1
            } else if (byteOffset < 0) {
              if (dir) byteOffset = 0
              else return -1
            }

            // Normalize val
            if (typeof val === 'string') {
              val = Buffer.from(val, encoding)
            }

            // Finally, search either indexOf (if dir is true) or lastIndexOf
            if (Buffer.isBuffer(val)) {
              // Special case: looking for empty string/buffer always fails
              if (val.length === 0) {
                return -1
              }
              return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
            } else if (typeof val === 'number') {
              val = val & 0xFF // Search for a byte value [0-255]
              if (typeof Uint8Array.prototype.indexOf === 'function') {
                if (dir) {
                  return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                } else {
                  return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                }
              }
              return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
            }

            throw new TypeError('val must be string, number or Buffer')
          }

          function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
            var indexSize = 1
            var arrLength = arr.length
            var valLength = val.length

            if (encoding !== undefined) {
              encoding = String(encoding).toLowerCase()
              if (encoding === 'ucs2' || encoding === 'ucs-2' ||
                encoding === 'utf16le' || encoding === 'utf-16le') {
                if (arr.length < 2 || val.length < 2) {
                  return -1
                }
                indexSize = 2
                arrLength /= 2
                valLength /= 2
                byteOffset /= 2
              }
            }

            function read(buf, i) {
              if (indexSize === 1) {
                return buf[i]
              } else {
                return buf.readUInt16BE(i * indexSize)
              }
            }

            var i
            if (dir) {
              var foundIndex = -1
              for (i = byteOffset; i < arrLength; i++) {
                if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                  if (foundIndex === -1) foundIndex = i
                  if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                } else {
                  if (foundIndex !== -1) i -= i - foundIndex
                  foundIndex = -1
                }
              }
            } else {
              if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
              for (i = byteOffset; i >= 0; i--) {
                var found = true
                for (var j = 0; j < valLength; j++) {
                  if (read(arr, i + j) !== read(val, j)) {
                    found = false
                    break
                  }
                }
                if (found) return i
              }
            }

            return -1
          }

          Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
            return this.indexOf(val, byteOffset, encoding) !== -1
          }

          Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
          }

          Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
          }

          function hexWrite(buf, string, offset, length) {
            offset = Number(offset) || 0
            var remaining = buf.length - offset
            if (!length) {
              length = remaining
            } else {
              length = Number(length)
              if (length > remaining) {
                length = remaining
              }
            }

            var strLen = string.length

            if (length > strLen / 2) {
              length = strLen / 2
            }
            for (var i = 0; i < length; ++i) {
              var parsed = parseInt(string.substr(i * 2, 2), 16)
              if (numberIsNaN(parsed)) return i
              buf[offset + i] = parsed
            }
            return i
          }

          function utf8Write(buf, string, offset, length) {
            return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
          }

          function asciiWrite(buf, string, offset, length) {
            return blitBuffer(asciiToBytes(string), buf, offset, length)
          }

          function base64Write(buf, string, offset, length) {
            return blitBuffer(base64ToBytes(string), buf, offset, length)
          }

          function ucs2Write(buf, string, offset, length) {
            return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
          }

          Buffer.prototype.write = function write(string, offset, length, encoding) {
            // Buffer#write(string)
            if (offset === undefined) {
              encoding = 'utf8'
              length = this.length
              offset = 0
              // Buffer#write(string, encoding)
            } else if (length === undefined && typeof offset === 'string') {
              encoding = offset
              length = this.length
              offset = 0
              // Buffer#write(string, offset[, length][, encoding])
            } else if (isFinite(offset)) {
              offset = offset >>> 0
              if (isFinite(length)) {
                length = length >>> 0
                if (encoding === undefined) encoding = 'utf8'
              } else {
                encoding = length
                length = undefined
              }
            } else {
              throw new Error(
                'Buffer.write(string, encoding, offset[, length]) is no longer supported'
              )
            }

            var remaining = this.length - offset
            if (length === undefined || length > remaining) length = remaining

            if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
              throw new RangeError('Attempt to write outside buffer bounds')
            }

            if (!encoding) encoding = 'utf8'

            var loweredCase = false
            for (; ;) {
              switch (encoding) {
                case 'hex':
                  return hexWrite(this, string, offset, length)

                case 'utf8':
                case 'utf-8':
                  return utf8Write(this, string, offset, length)

                case 'ascii':
                case 'latin1':
                case 'binary':
                  return asciiWrite(this, string, offset, length)

                case 'base64':
                  // Warning: maxLength not taken into account in base64Write
                  return base64Write(this, string, offset, length)

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return ucs2Write(this, string, offset, length)

                default:
                  if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                  encoding = ('' + encoding).toLowerCase()
                  loweredCase = true
              }
            }
          }

          Buffer.prototype.toJSON = function toJSON() {
            return {
              type: 'Buffer',
              data: Array.prototype.slice.call(this._arr || this, 0)
            }
          }

          function base64Slice(buf, start, end) {
            if (start === 0 && end === buf.length) {
              return base64.fromByteArray(buf)
            } else {
              return base64.fromByteArray(buf.slice(start, end))
            }
          }

          function utf8Slice(buf, start, end) {
            end = Math.min(buf.length, end)
            var res = []

            var i = start
            while (i < end) {
              var firstByte = buf[i]
              var codePoint = null
              var bytesPerSequence = (firstByte > 0xEF)
                ? 4
                : (firstByte > 0xDF)
                  ? 3
                  : (firstByte > 0xBF)
                    ? 2
                    : 1

              if (i + bytesPerSequence <= end) {
                var secondByte, thirdByte, fourthByte, tempCodePoint

                switch (bytesPerSequence) {
                  case 1:
                    if (firstByte < 0x80) {
                      codePoint = firstByte
                    }
                    break
                  case 2:
                    secondByte = buf[i + 1]
                    if ((secondByte & 0xC0) === 0x80) {
                      tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                      if (tempCodePoint > 0x7F) {
                        codePoint = tempCodePoint
                      }
                    }
                    break
                  case 3:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                      tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                      if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                        codePoint = tempCodePoint
                      }
                    }
                    break
                  case 4:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    fourthByte = buf[i + 3]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                      tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                      if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                        codePoint = tempCodePoint
                      }
                    }
                }
              }

              if (codePoint === null) {
                // we did not generate a valid codePoint so insert a
                // replacement char (U+FFFD) and advance only 1 byte
                codePoint = 0xFFFD
                bytesPerSequence = 1
              } else if (codePoint > 0xFFFF) {
                // encode to utf16 (surrogate pair dance)
                codePoint -= 0x10000
                res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                codePoint = 0xDC00 | codePoint & 0x3FF
              }

              res.push(codePoint)
              i += bytesPerSequence
            }

            return decodeCodePointsArray(res)
          }

          // Based on http://stackoverflow.com/a/22747272/680742, the browser with
          // the lowest limit is Chrome, with 0x10000 args.
          // We go 1 magnitude less, for safety
          var MAX_ARGUMENTS_LENGTH = 0x1000

          function decodeCodePointsArray(codePoints) {
            var len = codePoints.length
            if (len <= MAX_ARGUMENTS_LENGTH) {
              return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
            }

            // Decode in chunks to avoid "call stack size exceeded".
            var res = ''
            var i = 0
            while (i < len) {
              res += String.fromCharCode.apply(
                String,
                codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
              )
            }
            return res
          }

          function asciiSlice(buf, start, end) {
            var ret = ''
            end = Math.min(buf.length, end)

            for (var i = start; i < end; ++i) {
              ret += String.fromCharCode(buf[i] & 0x7F)
            }
            return ret
          }

          function latin1Slice(buf, start, end) {
            var ret = ''
            end = Math.min(buf.length, end)

            for (var i = start; i < end; ++i) {
              ret += String.fromCharCode(buf[i])
            }
            return ret
          }

          function hexSlice(buf, start, end) {
            var len = buf.length

            if (!start || start < 0) start = 0
            if (!end || end < 0 || end > len) end = len

            var out = ''
            for (var i = start; i < end; ++i) {
              out += hexSliceLookupTable[buf[i]]
            }
            return out
          }

          function utf16leSlice(buf, start, end) {
            var bytes = buf.slice(start, end)
            var res = ''
            // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
            for (var i = 0; i < bytes.length - 1; i += 2) {
              res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
            }
            return res
          }

          Buffer.prototype.slice = function slice(start, end) {
            var len = this.length
            start = ~~start
            end = end === undefined ? len : ~~end

            if (start < 0) {
              start += len
              if (start < 0) start = 0
            } else if (start > len) {
              start = len
            }

            if (end < 0) {
              end += len
              if (end < 0) end = 0
            } else if (end > len) {
              end = len
            }

            if (end < start) end = start

            var newBuf = this.subarray(start, end)
            // Return an augmented `Uint8Array` instance
            Object.setPrototypeOf(newBuf, Buffer.prototype)

            return newBuf
          }

          /*
           * Need to make sure that buffer isn't trying to write out of bounds.
           */
          function checkOffset(offset, ext, length) {
            if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
            if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
          }

          Buffer.prototype.readUintLE =
            Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
              offset = offset >>> 0
              byteLength = byteLength >>> 0
              if (!noAssert) checkOffset(offset, byteLength, this.length)

              var val = this[offset]
              var mul = 1
              var i = 0
              while (++i < byteLength && (mul *= 0x100)) {
                val += this[offset + i] * mul
              }

              return val
            }

          Buffer.prototype.readUintBE =
            Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
              offset = offset >>> 0
              byteLength = byteLength >>> 0
              if (!noAssert) {
                checkOffset(offset, byteLength, this.length)
              }

              var val = this[offset + --byteLength]
              var mul = 1
              while (byteLength > 0 && (mul *= 0x100)) {
                val += this[offset + --byteLength] * mul
              }

              return val
            }

          Buffer.prototype.readUint8 =
            Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
              offset = offset >>> 0
              if (!noAssert) checkOffset(offset, 1, this.length)
              return this[offset]
            }

          Buffer.prototype.readUint16LE =
            Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
              offset = offset >>> 0
              if (!noAssert) checkOffset(offset, 2, this.length)
              return this[offset] | (this[offset + 1] << 8)
            }

          Buffer.prototype.readUint16BE =
            Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
              offset = offset >>> 0
              if (!noAssert) checkOffset(offset, 2, this.length)
              return (this[offset] << 8) | this[offset + 1]
            }

          Buffer.prototype.readUint32LE =
            Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
              offset = offset >>> 0
              if (!noAssert) checkOffset(offset, 4, this.length)

              return ((this[offset]) |
                (this[offset + 1] << 8) |
                (this[offset + 2] << 16)) +
                (this[offset + 3] * 0x1000000)
            }

          Buffer.prototype.readUint32BE =
            Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
              offset = offset >>> 0
              if (!noAssert) checkOffset(offset, 4, this.length)

              return (this[offset] * 0x1000000) +
                ((this[offset + 1] << 16) |
                  (this[offset + 2] << 8) |
                  this[offset + 3])
            }

          Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) checkOffset(offset, byteLength, this.length)

            var val = this[offset]
            var mul = 1
            var i = 0
            while (++i < byteLength && (mul *= 0x100)) {
              val += this[offset + i] * mul
            }
            mul *= 0x80

            if (val >= mul) val -= Math.pow(2, 8 * byteLength)

            return val
          }

          Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) checkOffset(offset, byteLength, this.length)

            var i = byteLength
            var mul = 1
            var val = this[offset + --i]
            while (i > 0 && (mul *= 0x100)) {
              val += this[offset + --i] * mul
            }
            mul *= 0x80

            if (val >= mul) val -= Math.pow(2, 8 * byteLength)

            return val
          }

          Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 1, this.length)
            if (!(this[offset] & 0x80)) return (this[offset])
            return ((0xff - this[offset] + 1) * -1)
          }

          Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 2, this.length)
            var val = this[offset] | (this[offset + 1] << 8)
            return (val & 0x8000) ? val | 0xFFFF0000 : val
          }

          Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 2, this.length)
            var val = this[offset + 1] | (this[offset] << 8)
            return (val & 0x8000) ? val | 0xFFFF0000 : val
          }

          Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)

            return (this[offset]) |
              (this[offset + 1] << 8) |
              (this[offset + 2] << 16) |
              (this[offset + 3] << 24)
          }

          Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)

            return (this[offset] << 24) |
              (this[offset + 1] << 16) |
              (this[offset + 2] << 8) |
              (this[offset + 3])
          }

          Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)
            return ieee754.read(this, offset, true, 23, 4)
          }

          Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)
            return ieee754.read(this, offset, false, 23, 4)
          }

          Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 8, this.length)
            return ieee754.read(this, offset, true, 52, 8)
          }

          Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 8, this.length)
            return ieee754.read(this, offset, false, 52, 8)
          }

          function checkInt(buf, value, offset, ext, max, min) {
            if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
            if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
            if (offset + ext > buf.length) throw new RangeError('Index out of range')
          }

          Buffer.prototype.writeUintLE =
            Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
              value = +value
              offset = offset >>> 0
              byteLength = byteLength >>> 0
              if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1
                checkInt(this, value, offset, byteLength, maxBytes, 0)
              }

              var mul = 1
              var i = 0
              this[offset] = value & 0xFF
              while (++i < byteLength && (mul *= 0x100)) {
                this[offset + i] = (value / mul) & 0xFF
              }

              return offset + byteLength
            }

          Buffer.prototype.writeUintBE =
            Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
              value = +value
              offset = offset >>> 0
              byteLength = byteLength >>> 0
              if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1
                checkInt(this, value, offset, byteLength, maxBytes, 0)
              }

              var i = byteLength - 1
              var mul = 1
              this[offset + i] = value & 0xFF
              while (--i >= 0 && (mul *= 0x100)) {
                this[offset + i] = (value / mul) & 0xFF
              }

              return offset + byteLength
            }

          Buffer.prototype.writeUint8 =
            Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
              value = +value
              offset = offset >>> 0
              if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
              this[offset] = (value & 0xff)
              return offset + 1
            }

          Buffer.prototype.writeUint16LE =
            Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
              value = +value
              offset = offset >>> 0
              if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
              this[offset] = (value & 0xff)
              this[offset + 1] = (value >>> 8)
              return offset + 2
            }

          Buffer.prototype.writeUint16BE =
            Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
              value = +value
              offset = offset >>> 0
              if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
              this[offset] = (value >>> 8)
              this[offset + 1] = (value & 0xff)
              return offset + 2
            }

          Buffer.prototype.writeUint32LE =
            Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
              value = +value
              offset = offset >>> 0
              if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
              this[offset + 3] = (value >>> 24)
              this[offset + 2] = (value >>> 16)
              this[offset + 1] = (value >>> 8)
              this[offset] = (value & 0xff)
              return offset + 4
            }

          Buffer.prototype.writeUint32BE =
            Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
              value = +value
              offset = offset >>> 0
              if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
              this[offset] = (value >>> 24)
              this[offset + 1] = (value >>> 16)
              this[offset + 2] = (value >>> 8)
              this[offset + 3] = (value & 0xff)
              return offset + 4
            }

          Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              var limit = Math.pow(2, (8 * byteLength) - 1)

              checkInt(this, value, offset, byteLength, limit - 1, -limit)
            }

            var i = 0
            var mul = 1
            var sub = 0
            this[offset] = value & 0xFF
            while (++i < byteLength && (mul *= 0x100)) {
              if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                sub = 1
              }
              this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
            }

            return offset + byteLength
          }

          Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              var limit = Math.pow(2, (8 * byteLength) - 1)

              checkInt(this, value, offset, byteLength, limit - 1, -limit)
            }

            var i = byteLength - 1
            var mul = 1
            var sub = 0
            this[offset + i] = value & 0xFF
            while (--i >= 0 && (mul *= 0x100)) {
              if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                sub = 1
              }
              this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
            }

            return offset + byteLength
          }

          Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
            if (value < 0) value = 0xff + value + 1
            this[offset] = (value & 0xff)
            return offset + 1
          }

          Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            return offset + 2
          }

          Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
            return offset + 2
          }

          Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            this[offset + 2] = (value >>> 16)
            this[offset + 3] = (value >>> 24)
            return offset + 4
          }

          Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
            if (value < 0) value = 0xffffffff + value + 1
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
            return offset + 4
          }

          function checkIEEE754(buf, value, offset, ext, max, min) {
            if (offset + ext > buf.length) throw new RangeError('Index out of range')
            if (offset < 0) throw new RangeError('Index out of range')
          }

          function writeFloat(buf, value, offset, littleEndian, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
            }
            ieee754.write(buf, value, offset, littleEndian, 23, 4)
            return offset + 4
          }

          Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
            return writeFloat(this, value, offset, true, noAssert)
          }

          Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
            return writeFloat(this, value, offset, false, noAssert)
          }

          function writeDouble(buf, value, offset, littleEndian, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
            }
            ieee754.write(buf, value, offset, littleEndian, 52, 8)
            return offset + 8
          }

          Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
            return writeDouble(this, value, offset, true, noAssert)
          }

          Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
            return writeDouble(this, value, offset, false, noAssert)
          }

          // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
          Buffer.prototype.copy = function copy(target, targetStart, start, end) {
            if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
            if (!start) start = 0
            if (!end && end !== 0) end = this.length
            if (targetStart >= target.length) targetStart = target.length
            if (!targetStart) targetStart = 0
            if (end > 0 && end < start) end = start

            // Copy 0 bytes; we're done
            if (end === start) return 0
            if (target.length === 0 || this.length === 0) return 0

            // Fatal error conditions
            if (targetStart < 0) {
              throw new RangeError('targetStart out of bounds')
            }
            if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
            if (end < 0) throw new RangeError('sourceEnd out of bounds')

            // Are we oob?
            if (end > this.length) end = this.length
            if (target.length - targetStart < end - start) {
              end = target.length - targetStart + start
            }

            var len = end - start

            if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
              // Use built-in when available, missing from IE11
              this.copyWithin(targetStart, start, end)
            } else {
              Uint8Array.prototype.set.call(
                target,
                this.subarray(start, end),
                targetStart
              )
            }

            return len
          }

          // Usage:
          //    buffer.fill(number[, offset[, end]])
          //    buffer.fill(buffer[, offset[, end]])
          //    buffer.fill(string[, offset[, end]][, encoding])
          Buffer.prototype.fill = function fill(val, start, end, encoding) {
            // Handle string cases:
            if (typeof val === 'string') {
              if (typeof start === 'string') {
                encoding = start
                start = 0
                end = this.length
              } else if (typeof end === 'string') {
                encoding = end
                end = this.length
              }
              if (encoding !== undefined && typeof encoding !== 'string') {
                throw new TypeError('encoding must be a string')
              }
              if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                throw new TypeError('Unknown encoding: ' + encoding)
              }
              if (val.length === 1) {
                var code = val.charCodeAt(0)
                if ((encoding === 'utf8' && code < 128) ||
                  encoding === 'latin1') {
                  // Fast path: If `val` fits into a single byte, use that numeric value.
                  val = code
                }
              }
            } else if (typeof val === 'number') {
              val = val & 255
            } else if (typeof val === 'boolean') {
              val = Number(val)
            }

            // Invalid ranges are not set to a default, so can range check early.
            if (start < 0 || this.length < start || this.length < end) {
              throw new RangeError('Out of range index')
            }

            if (end <= start) {
              return this
            }

            start = start >>> 0
            end = end === undefined ? this.length : end >>> 0

            if (!val) val = 0

            var i
            if (typeof val === 'number') {
              for (i = start; i < end; ++i) {
                this[i] = val
              }
            } else {
              var bytes = Buffer.isBuffer(val)
                ? val
                : Buffer.from(val, encoding)
              var len = bytes.length
              if (len === 0) {
                throw new TypeError('The value "' + val +
                  '" is invalid for argument "value"')
              }
              for (i = 0; i < end - start; ++i) {
                this[i + start] = bytes[i % len]
              }
            }

            return this
          }

          // HELPER FUNCTIONS
          // ================

          var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

          function base64clean(str) {
            // Node takes equal signs as end of the Base64 encoding
            str = str.split('=')[0]
            // Node strips out invalid characters like \n and \t from the string, base64-js does not
            str = str.trim().replace(INVALID_BASE64_RE, '')
            // Node converts strings with length < 2 to ''
            if (str.length < 2) return ''
            // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
            while (str.length % 4 !== 0) {
              str = str + '='
            }
            return str
          }

          function utf8ToBytes(string, units) {
            units = units || Infinity
            var codePoint
            var length = string.length
            var leadSurrogate = null
            var bytes = []

            for (var i = 0; i < length; ++i) {
              codePoint = string.charCodeAt(i)

              // is surrogate component
              if (codePoint > 0xD7FF && codePoint < 0xE000) {
                // last char was a lead
                if (!leadSurrogate) {
                  // no lead yet
                  if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                  } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                  }

                  // valid lead
                  leadSurrogate = codePoint

                  continue
                }

                // 2 leads in a row
                if (codePoint < 0xDC00) {
                  if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                  leadSurrogate = codePoint
                  continue
                }

                // valid surrogate pair
                codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
              } else if (leadSurrogate) {
                // valid bmp char, but last char was a lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              }

              leadSurrogate = null

              // encode utf8
              if (codePoint < 0x80) {
                if ((units -= 1) < 0) break
                bytes.push(codePoint)
              } else if (codePoint < 0x800) {
                if ((units -= 2) < 0) break
                bytes.push(
                  codePoint >> 0x6 | 0xC0,
                  codePoint & 0x3F | 0x80
                )
              } else if (codePoint < 0x10000) {
                if ((units -= 3) < 0) break
                bytes.push(
                  codePoint >> 0xC | 0xE0,
                  codePoint >> 0x6 & 0x3F | 0x80,
                  codePoint & 0x3F | 0x80
                )
              } else if (codePoint < 0x110000) {
                if ((units -= 4) < 0) break
                bytes.push(
                  codePoint >> 0x12 | 0xF0,
                  codePoint >> 0xC & 0x3F | 0x80,
                  codePoint >> 0x6 & 0x3F | 0x80,
                  codePoint & 0x3F | 0x80
                )
              } else {
                throw new Error('Invalid code point')
              }
            }

            return bytes
          }

          function asciiToBytes(str) {
            var byteArray = []
            for (var i = 0; i < str.length; ++i) {
              // Node's code seems to be doing this and not & 0x7F..
              byteArray.push(str.charCodeAt(i) & 0xFF)
            }
            return byteArray
          }

          function utf16leToBytes(str, units) {
            var c, hi, lo
            var byteArray = []
            for (var i = 0; i < str.length; ++i) {
              if ((units -= 2) < 0) break

              c = str.charCodeAt(i)
              hi = c >> 8
              lo = c % 256
              byteArray.push(lo)
              byteArray.push(hi)
            }

            return byteArray
          }

          function base64ToBytes(str) {
            return base64.toByteArray(base64clean(str))
          }

          function blitBuffer(src, dst, offset, length) {
            for (var i = 0; i < length; ++i) {
              if ((i + offset >= dst.length) || (i >= src.length)) break
              dst[i + offset] = src[i]
            }
            return i
          }

          // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
          // the `instanceof` check but they should be treated as of that type.
          // See: https://github.com/feross/buffer/issues/166
          function isInstance(obj, type) {
            return obj instanceof type ||
              (obj != null && obj.constructor != null && obj.constructor.name != null &&
                obj.constructor.name === type.name)
          }
          function numberIsNaN(obj) {
            // For IE11 support
            return obj !== obj // eslint-disable-line no-self-compare
          }

          // Create lookup table for `toString('hex')`
          // See: https://github.com/feross/buffer/issues/219
          var hexSliceLookupTable = (function () {
            var alphabet = '0123456789abcdef'
            var table = new Array(256)
            for (var i = 0; i < 16; ++i) {
              var i16 = i * 16
              for (var j = 0; j < 16; ++j) {
                table[i16 + j] = alphabet[i] + alphabet[j]
              }
            }
            return table
          })()

        }).call(this)
      }).call(this, require("buffer").Buffer)
    }, { "base64-js": 104, "buffer": 106, "ieee754": 109 }], 107: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // NOTE: These type checking functions intentionally don't use `instanceof`
      // because it is fragile and can be easily faked with `Object.create()`.

      function isArray(arg) {
        if (Array.isArray) {
          return Array.isArray(arg);
        }
        return objectToString(arg) === '[object Array]';
      }
      exports.isArray = isArray;

      function isBoolean(arg) {
        return typeof arg === 'boolean';
      }
      exports.isBoolean = isBoolean;

      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;

      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;

      function isNumber(arg) {
        return typeof arg === 'number';
      }
      exports.isNumber = isNumber;

      function isString(arg) {
        return typeof arg === 'string';
      }
      exports.isString = isString;

      function isSymbol(arg) {
        return typeof arg === 'symbol';
      }
      exports.isSymbol = isSymbol;

      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;

      function isRegExp(re) {
        return objectToString(re) === '[object RegExp]';
      }
      exports.isRegExp = isRegExp;

      function isObject(arg) {
        return typeof arg === 'object' && arg !== null;
      }
      exports.isObject = isObject;

      function isDate(d) {
        return objectToString(d) === '[object Date]';
      }
      exports.isDate = isDate;

      function isError(e) {
        return (objectToString(e) === '[object Error]' || e instanceof Error);
      }
      exports.isError = isError;

      function isFunction(arg) {
        return typeof arg === 'function';
      }
      exports.isFunction = isFunction;

      function isPrimitive(arg) {
        return arg === null ||
          typeof arg === 'boolean' ||
          typeof arg === 'number' ||
          typeof arg === 'string' ||
          typeof arg === 'symbol' ||  // ES6 symbol
          typeof arg === 'undefined';
      }
      exports.isPrimitive = isPrimitive;

      exports.isBuffer = require('buffer').Buffer.isBuffer;

      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }

    }, { "buffer": 106 }], 108: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      function EventEmitter() {
        this._events = this._events || {};
        this._maxListeners = this._maxListeners || undefined;
      }
      module.exports = EventEmitter;

      // Backwards-compat with node 0.10.x
      EventEmitter.EventEmitter = EventEmitter;

      EventEmitter.prototype._events = undefined;
      EventEmitter.prototype._maxListeners = undefined;

      // By default EventEmitters will print a warning if more than 10 listeners are
      // added to it. This is a useful default which helps finding memory leaks.
      EventEmitter.defaultMaxListeners = 10;

      // Obviously not all Emitters should be limited to 10. This function allows
      // that to be increased. Set to zero for unlimited.
      EventEmitter.prototype.setMaxListeners = function (n) {
        if (!isNumber(n) || n < 0 || isNaN(n))
          throw TypeError('n must be a positive number');
        this._maxListeners = n;
        return this;
      };

      EventEmitter.prototype.emit = function (type) {
        var er, handler, len, args, i, listeners;

        if (!this._events)
          this._events = {};

        // If there is no 'error' event listener then throw.
        if (type === 'error') {
          if (!this._events.error ||
            (isObject(this._events.error) && !this._events.error.length)) {
            er = arguments[1];
            if (er instanceof Error) {
              throw er; // Unhandled 'error' event
            } else {
              // At least give some kind of context to the user
              var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
              err.context = er;
              throw err;
            }
          }
        }

        handler = this._events[type];

        if (isUndefined(handler))
          return false;

        if (isFunction(handler)) {
          switch (arguments.length) {
            // fast cases
            case 1:
              handler.call(this);
              break;
            case 2:
              handler.call(this, arguments[1]);
              break;
            case 3:
              handler.call(this, arguments[1], arguments[2]);
              break;
            // slower
            default:
              args = Array.prototype.slice.call(arguments, 1);
              handler.apply(this, args);
          }
        } else if (isObject(handler)) {
          args = Array.prototype.slice.call(arguments, 1);
          listeners = handler.slice();
          len = listeners.length;
          for (i = 0; i < len; i++)
            listeners[i].apply(this, args);
        }

        return true;
      };

      EventEmitter.prototype.addListener = function (type, listener) {
        var m;

        if (!isFunction(listener))
          throw TypeError('listener must be a function');

        if (!this._events)
          this._events = {};

        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (this._events.newListener)
          this.emit('newListener', type,
            isFunction(listener.listener) ?
              listener.listener : listener);

        if (!this._events[type])
          // Optimize the case of one listener. Don't need the extra array object.
          this._events[type] = listener;
        else if (isObject(this._events[type]))
          // If we've already got an array, just append.
          this._events[type].push(listener);
        else
          // Adding the second element, need to change to array.
          this._events[type] = [this._events[type], listener];

        // Check for listener leak
        if (isObject(this._events[type]) && !this._events[type].warned) {
          if (!isUndefined(this._maxListeners)) {
            m = this._maxListeners;
          } else {
            m = EventEmitter.defaultMaxListeners;
          }

          if (m && m > 0 && this._events[type].length > m) {
            this._events[type].warned = true;
            console.error('(node) warning: possible EventEmitter memory ' +
              'leak detected. %d listeners added. ' +
              'Use emitter.setMaxListeners() to increase limit.',
              this._events[type].length);
            if (typeof console.trace === 'function') {
              // not supported in IE 10
              console.trace();
            }
          }
        }

        return this;
      };

      EventEmitter.prototype.on = EventEmitter.prototype.addListener;

      EventEmitter.prototype.once = function (type, listener) {
        if (!isFunction(listener))
          throw TypeError('listener must be a function');

        var fired = false;

        function g() {
          this.removeListener(type, g);

          if (!fired) {
            fired = true;
            listener.apply(this, arguments);
          }
        }

        g.listener = listener;
        this.on(type, g);

        return this;
      };

      // emits a 'removeListener' event iff the listener was removed
      EventEmitter.prototype.removeListener = function (type, listener) {
        var list, position, length, i;

        if (!isFunction(listener))
          throw TypeError('listener must be a function');

        if (!this._events || !this._events[type])
          return this;

        list = this._events[type];
        length = list.length;
        position = -1;

        if (list === listener ||
          (isFunction(list.listener) && list.listener === listener)) {
          delete this._events[type];
          if (this._events.removeListener)
            this.emit('removeListener', type, listener);

        } else if (isObject(list)) {
          for (i = length; i-- > 0;) {
            if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list.length = 0;
            delete this._events[type];
          } else {
            list.splice(position, 1);
          }

          if (this._events.removeListener)
            this.emit('removeListener', type, listener);
        }

        return this;
      };

      EventEmitter.prototype.removeAllListeners = function (type) {
        var key, listeners;

        if (!this._events)
          return this;

        // not listening for removeListener, no need to emit
        if (!this._events.removeListener) {
          if (arguments.length === 0)
            this._events = {};
          else if (this._events[type])
            delete this._events[type];
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          for (key in this._events) {
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = {};
          return this;
        }

        listeners = this._events[type];

        if (isFunction(listeners)) {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          while (listeners.length)
            this.removeListener(type, listeners[listeners.length - 1]);
        }
        delete this._events[type];

        return this;
      };

      EventEmitter.prototype.listeners = function (type) {
        var ret;
        if (!this._events || !this._events[type])
          ret = [];
        else if (isFunction(this._events[type]))
          ret = [this._events[type]];
        else
          ret = this._events[type].slice();
        return ret;
      };

      EventEmitter.prototype.listenerCount = function (type) {
        if (this._events) {
          var evlistener = this._events[type];

          if (isFunction(evlistener))
            return 1;
          else if (evlistener)
            return evlistener.length;
        }
        return 0;
      };

      EventEmitter.listenerCount = function (emitter, type) {
        return emitter.listenerCount(type);
      };

      function isFunction(arg) {
        return typeof arg === 'function';
      }

      function isNumber(arg) {
        return typeof arg === 'number';
      }

      function isObject(arg) {
        return typeof arg === 'object' && arg !== null;
      }

      function isUndefined(arg) {
        return arg === void 0;
      }

    }, {}], 109: [function (require, module, exports) {
      /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
      exports.read = function (buffer, offset, isLE, mLen, nBytes) {
        var e, m
        var eLen = (nBytes * 8) - mLen - 1
        var eMax = (1 << eLen) - 1
        var eBias = eMax >> 1
        var nBits = -7
        var i = isLE ? (nBytes - 1) : 0
        var d = isLE ? -1 : 1
        var s = buffer[offset + i]

        i += d

        e = s & ((1 << (-nBits)) - 1)
        s >>= (-nBits)
        nBits += eLen
        for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) { }

        m = e & ((1 << (-nBits)) - 1)
        e >>= (-nBits)
        nBits += mLen
        for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) { }

        if (e === 0) {
          e = 1 - eBias
        } else if (e === eMax) {
          return m ? NaN : ((s ? -1 : 1) * Infinity)
        } else {
          m = m + Math.pow(2, mLen)
          e = e - eBias
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
      }

      exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c
        var eLen = (nBytes * 8) - mLen - 1
        var eMax = (1 << eLen) - 1
        var eBias = eMax >> 1
        var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
        var i = isLE ? 0 : (nBytes - 1)
        var d = isLE ? 1 : -1
        var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

        value = Math.abs(value)

        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0
          e = eMax
        } else {
          e = Math.floor(Math.log(value) / Math.LN2)
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--
            c *= 2
          }
          if (e + eBias >= 1) {
            value += rt / c
          } else {
            value += rt * Math.pow(2, 1 - eBias)
          }
          if (value * c >= 2) {
            e++
            c /= 2
          }

          if (e + eBias >= eMax) {
            m = 0
            e = eMax
          } else if (e + eBias >= 1) {
            m = ((value * c) - 1) * Math.pow(2, mLen)
            e = e + eBias
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
            e = 0
          }
        }

        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) { }

        e = (e << mLen) | m
        eLen += mLen
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) { }

        buffer[offset + i - d] |= s * 128
      }

    }, {}], 110: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            })
          }
        };
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor
            var TempCtor = function () { }
            TempCtor.prototype = superCtor.prototype
            ctor.prototype = new TempCtor()
            ctor.prototype.constructor = ctor
          }
        }
      }

    }, {}], 111: [function (require, module, exports) {
      var toString = {}.toString;

      module.exports = Array.isArray || function (arr) {
        return toString.call(arr) == '[object Array]';
      };

    }, {}], 112: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          if (typeof process === 'undefined' ||
            !process.version ||
            process.version.indexOf('v0.') === 0 ||
            process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
            module.exports = { nextTick: nextTick };
          } else {
            module.exports = process
          }

          function nextTick(fn, arg1, arg2, arg3) {
            if (typeof fn !== 'function') {
              throw new TypeError('"callback" argument must be a function');
            }
            var len = arguments.length;
            var args, i;
            switch (len) {
              case 0:
              case 1:
                return process.nextTick(fn);
              case 2:
                return process.nextTick(function afterTickOne() {
                  fn.call(null, arg1);
                });
              case 3:
                return process.nextTick(function afterTickTwo() {
                  fn.call(null, arg1, arg2);
                });
              case 4:
                return process.nextTick(function afterTickThree() {
                  fn.call(null, arg1, arg2, arg3);
                });
              default:
                args = new Array(len - 1);
                i = 0;
                while (i < args.length) {
                  args[i++] = arguments[i];
                }
                return process.nextTick(function afterTick() {
                  fn.apply(null, args);
                });
            }
          }


        }).call(this)
      }).call(this, require('_process'))
    }, { "_process": 113 }], 113: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      }())
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }


      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }



      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};

      function noop() { }

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) { return [] }

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () { return '/' };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () { return 0; };

    }, {}], 114: [function (require, module, exports) {
      module.exports = require('./lib/_stream_duplex.js');

    }, { "./lib/_stream_duplex.js": 115 }], 115: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // a duplex stream is just a stream that is both readable and writable.
      // Since JS doesn't have multiple prototypal inheritance, this class
      // prototypally inherits from Readable, and then parasitically from
      // Writable.

      'use strict';

      /*<replacement>*/

      var pna = require('process-nextick-args');
      /*</replacement>*/

      /*<replacement>*/
      var objectKeys = Object.keys || function (obj) {
        var keys = [];
        for (var key in obj) {
          keys.push(key);
        } return keys;
      };
      /*</replacement>*/

      module.exports = Duplex;

      /*<replacement>*/
      var util = Object.create(require('core-util-is'));
      util.inherits = require('inherits');
      /*</replacement>*/

      var Readable = require('./_stream_readable');
      var Writable = require('./_stream_writable');

      util.inherits(Duplex, Readable);

      {
        // avoid scope creep, the keys array can then be collected
        var keys = objectKeys(Writable.prototype);
        for (var v = 0; v < keys.length; v++) {
          var method = keys[v];
          if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
        }
      }

      function Duplex(options) {
        if (!(this instanceof Duplex)) return new Duplex(options);

        Readable.call(this, options);
        Writable.call(this, options);

        if (options && options.readable === false) this.readable = false;

        if (options && options.writable === false) this.writable = false;

        this.allowHalfOpen = true;
        if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

        this.once('end', onend);
      }

      Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function () {
          return this._writableState.highWaterMark;
        }
      });

      // the no-half-open enforcer
      function onend() {
        // if we allow half-open state, or if the writable side ended,
        // then we're ok.
        if (this.allowHalfOpen || this._writableState.ended) return;

        // no more data can be written.
        // But allow more writes to happen in this tick.
        pna.nextTick(onEndNT, this);
      }

      function onEndNT(self) {
        self.end();
      }

      Object.defineProperty(Duplex.prototype, 'destroyed', {
        get: function () {
          if (this._readableState === undefined || this._writableState === undefined) {
            return false;
          }
          return this._readableState.destroyed && this._writableState.destroyed;
        },
        set: function (value) {
          // we ignore the value if the stream
          // has not been initialized yet
          if (this._readableState === undefined || this._writableState === undefined) {
            return;
          }

          // backward compatibility, the user is explicitly
          // managing destroyed
          this._readableState.destroyed = value;
          this._writableState.destroyed = value;
        }
      });

      Duplex.prototype._destroy = function (err, cb) {
        this.push(null);
        this.end();

        pna.nextTick(cb, err);
      };
    }, { "./_stream_readable": 117, "./_stream_writable": 119, "core-util-is": 107, "inherits": 110, "process-nextick-args": 112 }], 116: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // a passthrough stream.
      // basically just the most minimal sort of Transform stream.
      // Every written chunk gets output as-is.

      'use strict';

      module.exports = PassThrough;

      var Transform = require('./_stream_transform');

      /*<replacement>*/
      var util = Object.create(require('core-util-is'));
      util.inherits = require('inherits');
      /*</replacement>*/

      util.inherits(PassThrough, Transform);

      function PassThrough(options) {
        if (!(this instanceof PassThrough)) return new PassThrough(options);

        Transform.call(this, options);
      }

      PassThrough.prototype._transform = function (chunk, encoding, cb) {
        cb(null, chunk);
      };
    }, { "./_stream_transform": 118, "core-util-is": 107, "inherits": 110 }], 117: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          'use strict';

          /*<replacement>*/

          var pna = require('process-nextick-args');
          /*</replacement>*/

          module.exports = Readable;

          /*<replacement>*/
          var isArray = require('isarray');
          /*</replacement>*/

          /*<replacement>*/
          var Duplex;
          /*</replacement>*/

          Readable.ReadableState = ReadableState;

          /*<replacement>*/
          var EE = require('events').EventEmitter;

          var EElistenerCount = function (emitter, type) {
            return emitter.listeners(type).length;
          };
          /*</replacement>*/

          /*<replacement>*/
          var Stream = require('./internal/streams/stream');
          /*</replacement>*/

          /*<replacement>*/

          var Buffer = require('safe-buffer').Buffer;
          var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () { };
          function _uint8ArrayToBuffer(chunk) {
            return Buffer.from(chunk);
          }
          function _isUint8Array(obj) {
            return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
          }

          /*</replacement>*/

          /*<replacement>*/
          var util = Object.create(require('core-util-is'));
          util.inherits = require('inherits');
          /*</replacement>*/

          /*<replacement>*/
          var debugUtil = require('util');
          var debug = void 0;
          if (debugUtil && debugUtil.debuglog) {
            debug = debugUtil.debuglog('stream');
          } else {
            debug = function () { };
          }
          /*</replacement>*/

          var BufferList = require('./internal/streams/BufferList');
          var destroyImpl = require('./internal/streams/destroy');
          var StringDecoder;

          util.inherits(Readable, Stream);

          var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

          function prependListener(emitter, event, fn) {
            // Sadly this is not cacheable as some libraries bundle their own
            // event emitter implementation with them.
            if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

            // This is a hack to make sure that our error handler is attached before any
            // userland ones.  NEVER DO THIS. This is here only because this code needs
            // to continue to work with older versions of Node.js that do not include
            // the prependListener() method. The goal is to eventually remove this hack.
            if (!emitter._events || !emitter._events[event]) emitter.on(event, fn); else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn); else emitter._events[event] = [fn, emitter._events[event]];
          }

          function ReadableState(options, stream) {
            Duplex = Duplex || require('./_stream_duplex');

            options = options || {};

            // Duplex streams are both readable and writable, but share
            // the same options object.
            // However, some cases require setting options to different
            // values for the readable and the writable sides of the duplex stream.
            // These options can be provided separately as readableXXX and writableXXX.
            var isDuplex = stream instanceof Duplex;

            // object stream flag. Used to make read(n) ignore n and to
            // make all the buffer merging and length checks go away
            this.objectMode = !!options.objectMode;

            if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

            // the point at which it stops calling _read() to fill the buffer
            // Note: 0 is a valid value, means "don't call _read preemptively ever"
            var hwm = options.highWaterMark;
            var readableHwm = options.readableHighWaterMark;
            var defaultHwm = this.objectMode ? 16 : 16 * 1024;

            if (hwm || hwm === 0) this.highWaterMark = hwm; else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm; else this.highWaterMark = defaultHwm;

            // cast to ints.
            this.highWaterMark = Math.floor(this.highWaterMark);

            // A linked list is used to store data chunks instead of an array because the
            // linked list can remove elements from the beginning faster than
            // array.shift()
            this.buffer = new BufferList();
            this.length = 0;
            this.pipes = null;
            this.pipesCount = 0;
            this.flowing = null;
            this.ended = false;
            this.endEmitted = false;
            this.reading = false;

            // a flag to be able to tell if the event 'readable'/'data' is emitted
            // immediately, or on a later tick.  We set this to true at first, because
            // any actions that shouldn't happen until "later" should generally also
            // not happen before the first read call.
            this.sync = true;

            // whenever we return null, then we set a flag to say
            // that we're awaiting a 'readable' event emission.
            this.needReadable = false;
            this.emittedReadable = false;
            this.readableListening = false;
            this.resumeScheduled = false;

            // has it been destroyed
            this.destroyed = false;

            // Crypto is kind of old and crusty.  Historically, its default string
            // encoding is 'binary' so we have to make this configurable.
            // Everything else in the universe uses 'utf8', though.
            this.defaultEncoding = options.defaultEncoding || 'utf8';

            // the number of writers that are awaiting a drain event in .pipe()s
            this.awaitDrain = 0;

            // if true, a maybeReadMore has been scheduled
            this.readingMore = false;

            this.decoder = null;
            this.encoding = null;
            if (options.encoding) {
              if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
              this.decoder = new StringDecoder(options.encoding);
              this.encoding = options.encoding;
            }
          }

          function Readable(options) {
            Duplex = Duplex || require('./_stream_duplex');

            if (!(this instanceof Readable)) return new Readable(options);

            this._readableState = new ReadableState(options, this);

            // legacy
            this.readable = true;

            if (options) {
              if (typeof options.read === 'function') this._read = options.read;

              if (typeof options.destroy === 'function') this._destroy = options.destroy;
            }

            Stream.call(this);
          }

          Object.defineProperty(Readable.prototype, 'destroyed', {
            get: function () {
              if (this._readableState === undefined) {
                return false;
              }
              return this._readableState.destroyed;
            },
            set: function (value) {
              // we ignore the value if the stream
              // has not been initialized yet
              if (!this._readableState) {
                return;
              }

              // backward compatibility, the user is explicitly
              // managing destroyed
              this._readableState.destroyed = value;
            }
          });

          Readable.prototype.destroy = destroyImpl.destroy;
          Readable.prototype._undestroy = destroyImpl.undestroy;
          Readable.prototype._destroy = function (err, cb) {
            this.push(null);
            cb(err);
          };

          // Manually shove something into the read() buffer.
          // This returns true if the highWaterMark has not been hit yet,
          // similar to how Writable.write() returns true if you should
          // write() some more.
          Readable.prototype.push = function (chunk, encoding) {
            var state = this._readableState;
            var skipChunkCheck;

            if (!state.objectMode) {
              if (typeof chunk === 'string') {
                encoding = encoding || state.defaultEncoding;
                if (encoding !== state.encoding) {
                  chunk = Buffer.from(chunk, encoding);
                  encoding = '';
                }
                skipChunkCheck = true;
              }
            } else {
              skipChunkCheck = true;
            }

            return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
          };

          // Unshift should *always* be something directly out of read()
          Readable.prototype.unshift = function (chunk) {
            return readableAddChunk(this, chunk, null, true, false);
          };

          function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
            var state = stream._readableState;
            if (chunk === null) {
              state.reading = false;
              onEofChunk(stream, state);
            } else {
              var er;
              if (!skipChunkCheck) er = chunkInvalid(state, chunk);
              if (er) {
                stream.emit('error', er);
              } else if (state.objectMode || chunk && chunk.length > 0) {
                if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
                  chunk = _uint8ArrayToBuffer(chunk);
                }

                if (addToFront) {
                  if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event')); else addChunk(stream, state, chunk, true);
                } else if (state.ended) {
                  stream.emit('error', new Error('stream.push() after EOF'));
                } else {
                  state.reading = false;
                  if (state.decoder && !encoding) {
                    chunk = state.decoder.write(chunk);
                    if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false); else maybeReadMore(stream, state);
                  } else {
                    addChunk(stream, state, chunk, false);
                  }
                }
              } else if (!addToFront) {
                state.reading = false;
              }
            }

            return needMoreData(state);
          }

          function addChunk(stream, state, chunk, addToFront) {
            if (state.flowing && state.length === 0 && !state.sync) {
              stream.emit('data', chunk);
              stream.read(0);
            } else {
              // update the buffer info.
              state.length += state.objectMode ? 1 : chunk.length;
              if (addToFront) state.buffer.unshift(chunk); else state.buffer.push(chunk);

              if (state.needReadable) emitReadable(stream);
            }
            maybeReadMore(stream, state);
          }

          function chunkInvalid(state, chunk) {
            var er;
            if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
              er = new TypeError('Invalid non-string/buffer chunk');
            }
            return er;
          }

          // if it's past the high water mark, we can push in some more.
          // Also, if we have no data yet, we can stand some
          // more bytes.  This is to work around cases where hwm=0,
          // such as the repl.  Also, if the push() triggered a
          // readable event, and the user called read(largeNumber) such that
          // needReadable was set, then we ought to push more, so that another
          // 'readable' event will be triggered.
          function needMoreData(state) {
            return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
          }

          Readable.prototype.isPaused = function () {
            return this._readableState.flowing === false;
          };

          // backwards compatibility.
          Readable.prototype.setEncoding = function (enc) {
            if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
            this._readableState.decoder = new StringDecoder(enc);
            this._readableState.encoding = enc;
            return this;
          };

          // Don't raise the hwm > 8MB
          var MAX_HWM = 0x800000;
          function computeNewHighWaterMark(n) {
            if (n >= MAX_HWM) {
              n = MAX_HWM;
            } else {
              // Get the next highest power of 2 to prevent increasing hwm excessively in
              // tiny amounts
              n--;
              n |= n >>> 1;
              n |= n >>> 2;
              n |= n >>> 4;
              n |= n >>> 8;
              n |= n >>> 16;
              n++;
            }
            return n;
          }

          // This function is designed to be inlinable, so please take care when making
          // changes to the function body.
          function howMuchToRead(n, state) {
            if (n <= 0 || state.length === 0 && state.ended) return 0;
            if (state.objectMode) return 1;
            if (n !== n) {
              // Only flow one buffer at a time
              if (state.flowing && state.length) return state.buffer.head.data.length; else return state.length;
            }
            // If we're asking for more than the current hwm, then raise the hwm.
            if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
            if (n <= state.length) return n;
            // Don't have enough
            if (!state.ended) {
              state.needReadable = true;
              return 0;
            }
            return state.length;
          }

          // you can override either this method, or the async _read(n) below.
          Readable.prototype.read = function (n) {
            debug('read', n);
            n = parseInt(n, 10);
            var state = this._readableState;
            var nOrig = n;

            if (n !== 0) state.emittedReadable = false;

            // if we're doing read(0) to trigger a readable event, but we
            // already have a bunch of data in the buffer, then just trigger
            // the 'readable' event and move on.
            if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
              debug('read: emitReadable', state.length, state.ended);
              if (state.length === 0 && state.ended) endReadable(this); else emitReadable(this);
              return null;
            }

            n = howMuchToRead(n, state);

            // if we've ended, and we're now clear, then finish it up.
            if (n === 0 && state.ended) {
              if (state.length === 0) endReadable(this);
              return null;
            }

            // All the actual chunk generation logic needs to be
            // *below* the call to _read.  The reason is that in certain
            // synthetic stream cases, such as passthrough streams, _read
            // may be a completely synchronous operation which may change
            // the state of the read buffer, providing enough data when
            // before there was *not* enough.
            //
            // So, the steps are:
            // 1. Figure out what the state of things will be after we do
            // a read from the buffer.
            //
            // 2. If that resulting state will trigger a _read, then call _read.
            // Note that this may be asynchronous, or synchronous.  Yes, it is
            // deeply ugly to write APIs this way, but that still doesn't mean
            // that the Readable class should behave improperly, as streams are
            // designed to be sync/async agnostic.
            // Take note if the _read call is sync or async (ie, if the read call
            // has returned yet), so that we know whether or not it's safe to emit
            // 'readable' etc.
            //
            // 3. Actually pull the requested chunks out of the buffer and return.

            // if we need a readable event, then we need to do some reading.
            var doRead = state.needReadable;
            debug('need readable', doRead);

            // if we currently have less than the highWaterMark, then also read some
            if (state.length === 0 || state.length - n < state.highWaterMark) {
              doRead = true;
              debug('length less than watermark', doRead);
            }

            // however, if we've ended, then there's no point, and if we're already
            // reading, then it's unnecessary.
            if (state.ended || state.reading) {
              doRead = false;
              debug('reading or ended', doRead);
            } else if (doRead) {
              debug('do read');
              state.reading = true;
              state.sync = true;
              // if the length is currently zero, then we *need* a readable event.
              if (state.length === 0) state.needReadable = true;
              // call internal read method
              this._read(state.highWaterMark);
              state.sync = false;
              // If _read pushed data synchronously, then `reading` will be false,
              // and we need to re-evaluate how much data we can return to the user.
              if (!state.reading) n = howMuchToRead(nOrig, state);
            }

            var ret;
            if (n > 0) ret = fromList(n, state); else ret = null;

            if (ret === null) {
              state.needReadable = true;
              n = 0;
            } else {
              state.length -= n;
            }

            if (state.length === 0) {
              // If we have nothing in the buffer, then we want to know
              // as soon as we *do* get something into the buffer.
              if (!state.ended) state.needReadable = true;

              // If we tried to read() past the EOF, then emit end on the next tick.
              if (nOrig !== n && state.ended) endReadable(this);
            }

            if (ret !== null) this.emit('data', ret);

            return ret;
          };

          function onEofChunk(stream, state) {
            if (state.ended) return;
            if (state.decoder) {
              var chunk = state.decoder.end();
              if (chunk && chunk.length) {
                state.buffer.push(chunk);
                state.length += state.objectMode ? 1 : chunk.length;
              }
            }
            state.ended = true;

            // emit 'readable' now to make sure it gets picked up.
            emitReadable(stream);
          }

          // Don't emit readable right away in sync mode, because this can trigger
          // another read() call => stack overflow.  This way, it might trigger
          // a nextTick recursion warning, but that's not so bad.
          function emitReadable(stream) {
            var state = stream._readableState;
            state.needReadable = false;
            if (!state.emittedReadable) {
              debug('emitReadable', state.flowing);
              state.emittedReadable = true;
              if (state.sync) pna.nextTick(emitReadable_, stream); else emitReadable_(stream);
            }
          }

          function emitReadable_(stream) {
            debug('emit readable');
            stream.emit('readable');
            flow(stream);
          }

          // at this point, the user has presumably seen the 'readable' event,
          // and called read() to consume some data.  that may have triggered
          // in turn another _read(n) call, in which case reading = true if
          // it's in progress.
          // However, if we're not ended, or reading, and the length < hwm,
          // then go ahead and try to read some more preemptively.
          function maybeReadMore(stream, state) {
            if (!state.readingMore) {
              state.readingMore = true;
              pna.nextTick(maybeReadMore_, stream, state);
            }
          }

          function maybeReadMore_(stream, state) {
            var len = state.length;
            while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
              debug('maybeReadMore read 0');
              stream.read(0);
              if (len === state.length)
                // didn't get any data, stop spinning.
                break; else len = state.length;
            }
            state.readingMore = false;
          }

          // abstract method.  to be overridden in specific implementation classes.
          // call cb(er, data) where data is <= n in length.
          // for virtual (non-string, non-buffer) streams, "length" is somewhat
          // arbitrary, and perhaps not very meaningful.
          Readable.prototype._read = function (n) {
            this.emit('error', new Error('_read() is not implemented'));
          };

          Readable.prototype.pipe = function (dest, pipeOpts) {
            var src = this;
            var state = this._readableState;

            switch (state.pipesCount) {
              case 0:
                state.pipes = dest;
                break;
              case 1:
                state.pipes = [state.pipes, dest];
                break;
              default:
                state.pipes.push(dest);
                break;
            }
            state.pipesCount += 1;
            debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

            var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

            var endFn = doEnd ? onend : unpipe;
            if (state.endEmitted) pna.nextTick(endFn); else src.once('end', endFn);

            dest.on('unpipe', onunpipe);
            function onunpipe(readable, unpipeInfo) {
              debug('onunpipe');
              if (readable === src) {
                if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                  unpipeInfo.hasUnpiped = true;
                  cleanup();
                }
              }
            }

            function onend() {
              debug('onend');
              dest.end();
            }

            // when the dest drains, it reduces the awaitDrain counter
            // on the source.  This would be more elegant with a .once()
            // handler in flow(), but adding and removing repeatedly is
            // too slow.
            var ondrain = pipeOnDrain(src);
            dest.on('drain', ondrain);

            var cleanedUp = false;
            function cleanup() {
              debug('cleanup');
              // cleanup event handlers once the pipe is broken
              dest.removeListener('close', onclose);
              dest.removeListener('finish', onfinish);
              dest.removeListener('drain', ondrain);
              dest.removeListener('error', onerror);
              dest.removeListener('unpipe', onunpipe);
              src.removeListener('end', onend);
              src.removeListener('end', unpipe);
              src.removeListener('data', ondata);

              cleanedUp = true;

              // if the reader is waiting for a drain event from this
              // specific writer, then it would cause it to never start
              // flowing again.
              // So, if this is awaiting a drain, then we just call it now.
              // If we don't know, then assume that we are waiting for one.
              if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
            }

            // If the user pushes more data while we're writing to dest then we'll end up
            // in ondata again. However, we only want to increase awaitDrain once because
            // dest will only emit one 'drain' event for the multiple writes.
            // => Introduce a guard on increasing awaitDrain.
            var increasedAwaitDrain = false;
            src.on('data', ondata);
            function ondata(chunk) {
              debug('ondata');
              increasedAwaitDrain = false;
              var ret = dest.write(chunk);
              if (false === ret && !increasedAwaitDrain) {
                // If the user unpiped during `dest.write()`, it is possible
                // to get stuck in a permanently paused state if that write
                // also returned false.
                // => Check whether `dest` is still a piping destination.
                if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                  debug('false write response, pause', state.awaitDrain);
                  state.awaitDrain++;
                  increasedAwaitDrain = true;
                }
                src.pause();
              }
            }

            // if the dest has an error, then stop piping into it.
            // however, don't suppress the throwing behavior for this.
            function onerror(er) {
              debug('onerror', er);
              unpipe();
              dest.removeListener('error', onerror);
              if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
            }

            // Make sure our error handler is attached before userland ones.
            prependListener(dest, 'error', onerror);

            // Both close and finish should trigger unpipe, but only once.
            function onclose() {
              dest.removeListener('finish', onfinish);
              unpipe();
            }
            dest.once('close', onclose);
            function onfinish() {
              debug('onfinish');
              dest.removeListener('close', onclose);
              unpipe();
            }
            dest.once('finish', onfinish);

            function unpipe() {
              debug('unpipe');
              src.unpipe(dest);
            }

            // tell the dest that it's being piped to
            dest.emit('pipe', src);

            // start the flow if it hasn't been started already.
            if (!state.flowing) {
              debug('pipe resume');
              src.resume();
            }

            return dest;
          };

          function pipeOnDrain(src) {
            return function () {
              var state = src._readableState;
              debug('pipeOnDrain', state.awaitDrain);
              if (state.awaitDrain) state.awaitDrain--;
              if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
                state.flowing = true;
                flow(src);
              }
            };
          }

          Readable.prototype.unpipe = function (dest) {
            var state = this._readableState;
            var unpipeInfo = { hasUnpiped: false };

            // if we're not piping anywhere, then do nothing.
            if (state.pipesCount === 0) return this;

            // just one destination.  most common case.
            if (state.pipesCount === 1) {
              // passed in one, but it's not the right one.
              if (dest && dest !== state.pipes) return this;

              if (!dest) dest = state.pipes;

              // got a match.
              state.pipes = null;
              state.pipesCount = 0;
              state.flowing = false;
              if (dest) dest.emit('unpipe', this, unpipeInfo);
              return this;
            }

            // slow case. multiple pipe destinations.

            if (!dest) {
              // remove all.
              var dests = state.pipes;
              var len = state.pipesCount;
              state.pipes = null;
              state.pipesCount = 0;
              state.flowing = false;

              for (var i = 0; i < len; i++) {
                dests[i].emit('unpipe', this, { hasUnpiped: false });
              } return this;
            }

            // try to find the right one.
            var index = indexOf(state.pipes, dest);
            if (index === -1) return this;

            state.pipes.splice(index, 1);
            state.pipesCount -= 1;
            if (state.pipesCount === 1) state.pipes = state.pipes[0];

            dest.emit('unpipe', this, unpipeInfo);

            return this;
          };

          // set up data events if they are asked for
          // Ensure readable listeners eventually get something
          Readable.prototype.on = function (ev, fn) {
            var res = Stream.prototype.on.call(this, ev, fn);

            if (ev === 'data') {
              // Start flowing on next tick if stream isn't explicitly paused
              if (this._readableState.flowing !== false) this.resume();
            } else if (ev === 'readable') {
              var state = this._readableState;
              if (!state.endEmitted && !state.readableListening) {
                state.readableListening = state.needReadable = true;
                state.emittedReadable = false;
                if (!state.reading) {
                  pna.nextTick(nReadingNextTick, this);
                } else if (state.length) {
                  emitReadable(this);
                }
              }
            }

            return res;
          };
          Readable.prototype.addListener = Readable.prototype.on;

          function nReadingNextTick(self) {
            debug('readable nexttick read 0');
            self.read(0);
          }

          // pause() and resume() are remnants of the legacy readable stream API
          // If the user uses them, then switch into old mode.
          Readable.prototype.resume = function () {
            var state = this._readableState;
            if (!state.flowing) {
              debug('resume');
              state.flowing = true;
              resume(this, state);
            }
            return this;
          };

          function resume(stream, state) {
            if (!state.resumeScheduled) {
              state.resumeScheduled = true;
              pna.nextTick(resume_, stream, state);
            }
          }

          function resume_(stream, state) {
            if (!state.reading) {
              debug('resume read 0');
              stream.read(0);
            }

            state.resumeScheduled = false;
            state.awaitDrain = 0;
            stream.emit('resume');
            flow(stream);
            if (state.flowing && !state.reading) stream.read(0);
          }

          Readable.prototype.pause = function () {
            debug('call pause flowing=%j', this._readableState.flowing);
            if (false !== this._readableState.flowing) {
              debug('pause');
              this._readableState.flowing = false;
              this.emit('pause');
            }
            return this;
          };

          function flow(stream) {
            var state = stream._readableState;
            debug('flow', state.flowing);
            while (state.flowing && stream.read() !== null) { }
          }

          // wrap an old-style stream as the async data source.
          // This is *not* part of the readable stream interface.
          // It is an ugly unfortunate mess of history.
          Readable.prototype.wrap = function (stream) {
            var _this = this;

            var state = this._readableState;
            var paused = false;

            stream.on('end', function () {
              debug('wrapped end');
              if (state.decoder && !state.ended) {
                var chunk = state.decoder.end();
                if (chunk && chunk.length) _this.push(chunk);
              }

              _this.push(null);
            });

            stream.on('data', function (chunk) {
              debug('wrapped data');
              if (state.decoder) chunk = state.decoder.write(chunk);

              // don't skip over falsy values in objectMode
              if (state.objectMode && (chunk === null || chunk === undefined)) return; else if (!state.objectMode && (!chunk || !chunk.length)) return;

              var ret = _this.push(chunk);
              if (!ret) {
                paused = true;
                stream.pause();
              }
            });

            // proxy all the other methods.
            // important when wrapping filters and duplexes.
            for (var i in stream) {
              if (this[i] === undefined && typeof stream[i] === 'function') {
                this[i] = function (method) {
                  return function () {
                    return stream[method].apply(stream, arguments);
                  };
                }(i);
              }
            }

            // proxy certain important events.
            for (var n = 0; n < kProxyEvents.length; n++) {
              stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
            }

            // when we try to consume some more bytes, simply unpause the
            // underlying stream.
            this._read = function (n) {
              debug('wrapped _read', n);
              if (paused) {
                paused = false;
                stream.resume();
              }
            };

            return this;
          };

          Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function () {
              return this._readableState.highWaterMark;
            }
          });

          // exposed for testing purposes only.
          Readable._fromList = fromList;

          // Pluck off n bytes from an array of buffers.
          // Length is the combined lengths of all the buffers in the list.
          // This function is designed to be inlinable, so please take care when making
          // changes to the function body.
          function fromList(n, state) {
            // nothing buffered
            if (state.length === 0) return null;

            var ret;
            if (state.objectMode) ret = state.buffer.shift(); else if (!n || n >= state.length) {
              // read it all, truncate the list
              if (state.decoder) ret = state.buffer.join(''); else if (state.buffer.length === 1) ret = state.buffer.head.data; else ret = state.buffer.concat(state.length);
              state.buffer.clear();
            } else {
              // read part of list
              ret = fromListPartial(n, state.buffer, state.decoder);
            }

            return ret;
          }

          // Extracts only enough buffered data to satisfy the amount requested.
          // This function is designed to be inlinable, so please take care when making
          // changes to the function body.
          function fromListPartial(n, list, hasStrings) {
            var ret;
            if (n < list.head.data.length) {
              // slice is the same for buffers and strings
              ret = list.head.data.slice(0, n);
              list.head.data = list.head.data.slice(n);
            } else if (n === list.head.data.length) {
              // first chunk is a perfect match
              ret = list.shift();
            } else {
              // result spans more than one buffer
              ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
            }
            return ret;
          }

          // Copies a specified amount of characters from the list of buffered data
          // chunks.
          // This function is designed to be inlinable, so please take care when making
          // changes to the function body.
          function copyFromBufferString(n, list) {
            var p = list.head;
            var c = 1;
            var ret = p.data;
            n -= ret.length;
            while (p = p.next) {
              var str = p.data;
              var nb = n > str.length ? str.length : n;
              if (nb === str.length) ret += str; else ret += str.slice(0, n);
              n -= nb;
              if (n === 0) {
                if (nb === str.length) {
                  ++c;
                  if (p.next) list.head = p.next; else list.head = list.tail = null;
                } else {
                  list.head = p;
                  p.data = str.slice(nb);
                }
                break;
              }
              ++c;
            }
            list.length -= c;
            return ret;
          }

          // Copies a specified amount of bytes from the list of buffered data chunks.
          // This function is designed to be inlinable, so please take care when making
          // changes to the function body.
          function copyFromBuffer(n, list) {
            var ret = Buffer.allocUnsafe(n);
            var p = list.head;
            var c = 1;
            p.data.copy(ret);
            n -= p.data.length;
            while (p = p.next) {
              var buf = p.data;
              var nb = n > buf.length ? buf.length : n;
              buf.copy(ret, ret.length - n, 0, nb);
              n -= nb;
              if (n === 0) {
                if (nb === buf.length) {
                  ++c;
                  if (p.next) list.head = p.next; else list.head = list.tail = null;
                } else {
                  list.head = p;
                  p.data = buf.slice(nb);
                }
                break;
              }
              ++c;
            }
            list.length -= c;
            return ret;
          }

          function endReadable(stream) {
            var state = stream._readableState;

            // If we get here before consuming all the bytes, then that is a
            // bug in node.  Should never happen.
            if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

            if (!state.endEmitted) {
              state.ended = true;
              pna.nextTick(endReadableNT, state, stream);
            }
          }

          function endReadableNT(state, stream) {
            // Check that we didn't get one last unshift.
            if (!state.endEmitted && state.length === 0) {
              state.endEmitted = true;
              stream.readable = false;
              stream.emit('end');
            }
          }

          function indexOf(xs, x) {
            for (var i = 0, l = xs.length; i < l; i++) {
              if (xs[i] === x) return i;
            }
            return -1;
          }
        }).call(this)
      }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, { "./_stream_duplex": 115, "./internal/streams/BufferList": 120, "./internal/streams/destroy": 121, "./internal/streams/stream": 122, "_process": 113, "core-util-is": 107, "events": 108, "inherits": 110, "isarray": 111, "process-nextick-args": 112, "safe-buffer": 123, "string_decoder/": 124, "util": 105 }], 118: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // a transform stream is a readable/writable stream where you do
      // something with the data.  Sometimes it's called a "filter",
      // but that's not a great name for it, since that implies a thing where
      // some bits pass through, and others are simply ignored.  (That would
      // be a valid example of a transform, of course.)
      //
      // While the output is causally related to the input, it's not a
      // necessarily symmetric or synchronous transformation.  For example,
      // a zlib stream might take multiple plain-text writes(), and then
      // emit a single compressed chunk some time in the future.
      //
      // Here's how this works:
      //
      // The Transform stream has all the aspects of the readable and writable
      // stream classes.  When you write(chunk), that calls _write(chunk,cb)
      // internally, and returns false if there's a lot of pending writes
      // buffered up.  When you call read(), that calls _read(n) until
      // there's enough pending readable data buffered up.
      //
      // In a transform stream, the written data is placed in a buffer.  When
      // _read(n) is called, it transforms the queued up data, calling the
      // buffered _write cb's as it consumes chunks.  If consuming a single
      // written chunk would result in multiple output chunks, then the first
      // outputted bit calls the readcb, and subsequent chunks just go into
      // the read buffer, and will cause it to emit 'readable' if necessary.
      //
      // This way, back-pressure is actually determined by the reading side,
      // since _read has to be called to start processing a new chunk.  However,
      // a pathological inflate type of transform can cause excessive buffering
      // here.  For example, imagine a stream where every byte of input is
      // interpreted as an integer from 0-255, and then results in that many
      // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
      // 1kb of data being output.  In this case, you could write a very small
      // amount of input, and end up with a very large amount of output.  In
      // such a pathological inflating mechanism, there'd be no way to tell
      // the system to stop doing the transform.  A single 4MB write could
      // cause the system to run out of memory.
      //
      // However, even in such a pathological case, only a single written chunk
      // would be consumed, and then the rest would wait (un-transformed) until
      // the results of the previous transformed chunk were consumed.

      'use strict';

      module.exports = Transform;

      var Duplex = require('./_stream_duplex');

      /*<replacement>*/
      var util = Object.create(require('core-util-is'));
      util.inherits = require('inherits');
      /*</replacement>*/

      util.inherits(Transform, Duplex);

      function afterTransform(er, data) {
        var ts = this._transformState;
        ts.transforming = false;

        var cb = ts.writecb;

        if (!cb) {
          return this.emit('error', new Error('write callback called multiple times'));
        }

        ts.writechunk = null;
        ts.writecb = null;

        if (data != null) // single equals check for both `null` and `undefined`
          this.push(data);

        cb(er);

        var rs = this._readableState;
        rs.reading = false;
        if (rs.needReadable || rs.length < rs.highWaterMark) {
          this._read(rs.highWaterMark);
        }
      }

      function Transform(options) {
        if (!(this instanceof Transform)) return new Transform(options);

        Duplex.call(this, options);

        this._transformState = {
          afterTransform: afterTransform.bind(this),
          needTransform: false,
          transforming: false,
          writecb: null,
          writechunk: null,
          writeencoding: null
        };

        // start out asking for a readable event once data is transformed.
        this._readableState.needReadable = true;

        // we have implemented the _read method, and done the other things
        // that Readable wants before the first _read call, so unset the
        // sync guard flag.
        this._readableState.sync = false;

        if (options) {
          if (typeof options.transform === 'function') this._transform = options.transform;

          if (typeof options.flush === 'function') this._flush = options.flush;
        }

        // When the writable side finishes, then flush out anything remaining.
        this.on('prefinish', prefinish);
      }

      function prefinish() {
        var _this = this;

        if (typeof this._flush === 'function') {
          this._flush(function (er, data) {
            done(_this, er, data);
          });
        } else {
          done(this, null, null);
        }
      }

      Transform.prototype.push = function (chunk, encoding) {
        this._transformState.needTransform = false;
        return Duplex.prototype.push.call(this, chunk, encoding);
      };

      // This is the part where you do stuff!
      // override this function in implementation classes.
      // 'chunk' is an input chunk.
      //
      // Call `push(newChunk)` to pass along transformed output
      // to the readable side.  You may call 'push' zero or more times.
      //
      // Call `cb(err)` when you are done with this chunk.  If you pass
      // an error, then that'll put the hurt on the whole operation.  If you
      // never call cb(), then you'll never get another chunk.
      Transform.prototype._transform = function (chunk, encoding, cb) {
        throw new Error('_transform() is not implemented');
      };

      Transform.prototype._write = function (chunk, encoding, cb) {
        var ts = this._transformState;
        ts.writecb = cb;
        ts.writechunk = chunk;
        ts.writeencoding = encoding;
        if (!ts.transforming) {
          var rs = this._readableState;
          if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
        }
      };

      // Doesn't matter what the args are here.
      // _transform does all the work.
      // That we got here means that the readable side wants more data.
      Transform.prototype._read = function (n) {
        var ts = this._transformState;

        if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
          ts.transforming = true;
          this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
        } else {
          // mark that we need a transform, so that any data that comes in
          // will get processed, now that we've asked for it.
          ts.needTransform = true;
        }
      };

      Transform.prototype._destroy = function (err, cb) {
        var _this2 = this;

        Duplex.prototype._destroy.call(this, err, function (err2) {
          cb(err2);
          _this2.emit('close');
        });
      };

      function done(stream, er, data) {
        if (er) return stream.emit('error', er);

        if (data != null) // single equals check for both `null` and `undefined`
          stream.push(data);

        // if there's nothing in the write buffer, then that means
        // that nothing more will ever be provided
        if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

        if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

        return stream.push(null);
      }
    }, { "./_stream_duplex": 115, "core-util-is": 107, "inherits": 110 }], 119: [function (require, module, exports) {
      (function (process, global, setImmediate) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          // A bit simpler than readable streams.
          // Implement an async ._write(chunk, encoding, cb), and it'll handle all
          // the drain event emission and buffering.

          'use strict';

          /*<replacement>*/

          var pna = require('process-nextick-args');
          /*</replacement>*/

          module.exports = Writable;

          /* <replacement> */
          function WriteReq(chunk, encoding, cb) {
            this.chunk = chunk;
            this.encoding = encoding;
            this.callback = cb;
            this.next = null;
          }

          // It seems a linked list but it is not
          // there will be only 2 of these for each stream
          function CorkedRequest(state) {
            var _this = this;

            this.next = null;
            this.entry = null;
            this.finish = function () {
              onCorkedFinish(_this, state);
            };
          }
          /* </replacement> */

          /*<replacement>*/
          var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
          /*</replacement>*/

          /*<replacement>*/
          var Duplex;
          /*</replacement>*/

          Writable.WritableState = WritableState;

          /*<replacement>*/
          var util = Object.create(require('core-util-is'));
          util.inherits = require('inherits');
          /*</replacement>*/

          /*<replacement>*/
          var internalUtil = {
            deprecate: require('util-deprecate')
          };
          /*</replacement>*/

          /*<replacement>*/
          var Stream = require('./internal/streams/stream');
          /*</replacement>*/

          /*<replacement>*/

          var Buffer = require('safe-buffer').Buffer;
          var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () { };
          function _uint8ArrayToBuffer(chunk) {
            return Buffer.from(chunk);
          }
          function _isUint8Array(obj) {
            return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
          }

          /*</replacement>*/

          var destroyImpl = require('./internal/streams/destroy');

          util.inherits(Writable, Stream);

          function nop() { }

          function WritableState(options, stream) {
            Duplex = Duplex || require('./_stream_duplex');

            options = options || {};

            // Duplex streams are both readable and writable, but share
            // the same options object.
            // However, some cases require setting options to different
            // values for the readable and the writable sides of the duplex stream.
            // These options can be provided separately as readableXXX and writableXXX.
            var isDuplex = stream instanceof Duplex;

            // object stream flag to indicate whether or not this stream
            // contains buffers or objects.
            this.objectMode = !!options.objectMode;

            if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

            // the point at which write() starts returning false
            // Note: 0 is a valid value, means that we always return false if
            // the entire buffer is not flushed immediately on write()
            var hwm = options.highWaterMark;
            var writableHwm = options.writableHighWaterMark;
            var defaultHwm = this.objectMode ? 16 : 16 * 1024;

            if (hwm || hwm === 0) this.highWaterMark = hwm; else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm; else this.highWaterMark = defaultHwm;

            // cast to ints.
            this.highWaterMark = Math.floor(this.highWaterMark);

            // if _final has been called
            this.finalCalled = false;

            // drain event flag.
            this.needDrain = false;
            // at the start of calling end()
            this.ending = false;
            // when end() has been called, and returned
            this.ended = false;
            // when 'finish' is emitted
            this.finished = false;

            // has it been destroyed
            this.destroyed = false;

            // should we decode strings into buffers before passing to _write?
            // this is here so that some node-core streams can optimize string
            // handling at a lower level.
            var noDecode = options.decodeStrings === false;
            this.decodeStrings = !noDecode;

            // Crypto is kind of old and crusty.  Historically, its default string
            // encoding is 'binary' so we have to make this configurable.
            // Everything else in the universe uses 'utf8', though.
            this.defaultEncoding = options.defaultEncoding || 'utf8';

            // not an actual buffer we keep track of, but a measurement
            // of how much we're waiting to get pushed to some underlying
            // socket or file.
            this.length = 0;

            // a flag to see when we're in the middle of a write.
            this.writing = false;

            // when true all writes will be buffered until .uncork() call
            this.corked = 0;

            // a flag to be able to tell if the onwrite cb is called immediately,
            // or on a later tick.  We set this to true at first, because any
            // actions that shouldn't happen until "later" should generally also
            // not happen before the first write call.
            this.sync = true;

            // a flag to know if we're processing previously buffered items, which
            // may call the _write() callback in the same tick, so that we don't
            // end up in an overlapped onwrite situation.
            this.bufferProcessing = false;

            // the callback that's passed to _write(chunk,cb)
            this.onwrite = function (er) {
              onwrite(stream, er);
            };

            // the callback that the user supplies to write(chunk,encoding,cb)
            this.writecb = null;

            // the amount that is being written when _write is called.
            this.writelen = 0;

            this.bufferedRequest = null;
            this.lastBufferedRequest = null;

            // number of pending user-supplied write callbacks
            // this must be 0 before 'finish' can be emitted
            this.pendingcb = 0;

            // emit prefinish if the only thing we're waiting for is _write cbs
            // This is relevant for synchronous Transform streams
            this.prefinished = false;

            // True if the error was already emitted and should not be thrown again
            this.errorEmitted = false;

            // count buffered requests
            this.bufferedRequestCount = 0;

            // allocate the first CorkedRequest, there is always
            // one allocated and free to use, and we maintain at most two
            this.corkedRequestsFree = new CorkedRequest(this);
          }

          WritableState.prototype.getBuffer = function getBuffer() {
            var current = this.bufferedRequest;
            var out = [];
            while (current) {
              out.push(current);
              current = current.next;
            }
            return out;
          };

          (function () {
            try {
              Object.defineProperty(WritableState.prototype, 'buffer', {
                get: internalUtil.deprecate(function () {
                  return this.getBuffer();
                }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
              });
            } catch (_) { }
          })();

          // Test _writableState for inheritance to account for Duplex streams,
          // whose prototype chain only points to Readable.
          var realHasInstance;
          if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
            realHasInstance = Function.prototype[Symbol.hasInstance];
            Object.defineProperty(Writable, Symbol.hasInstance, {
              value: function (object) {
                if (realHasInstance.call(this, object)) return true;
                if (this !== Writable) return false;

                return object && object._writableState instanceof WritableState;
              }
            });
          } else {
            realHasInstance = function (object) {
              return object instanceof this;
            };
          }

          function Writable(options) {
            Duplex = Duplex || require('./_stream_duplex');

            // Writable ctor is applied to Duplexes, too.
            // `realHasInstance` is necessary because using plain `instanceof`
            // would return false, as no `_writableState` property is attached.

            // Trying to use the custom `instanceof` for Writable here will also break the
            // Node.js LazyTransform implementation, which has a non-trivial getter for
            // `_writableState` that would lead to infinite recursion.
            if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
              return new Writable(options);
            }

            this._writableState = new WritableState(options, this);

            // legacy.
            this.writable = true;

            if (options) {
              if (typeof options.write === 'function') this._write = options.write;

              if (typeof options.writev === 'function') this._writev = options.writev;

              if (typeof options.destroy === 'function') this._destroy = options.destroy;

              if (typeof options.final === 'function') this._final = options.final;
            }

            Stream.call(this);
          }

          // Otherwise people can pipe Writable streams, which is just wrong.
          Writable.prototype.pipe = function () {
            this.emit('error', new Error('Cannot pipe, not readable'));
          };

          function writeAfterEnd(stream, cb) {
            var er = new Error('write after end');
            // TODO: defer error events consistently everywhere, not just the cb
            stream.emit('error', er);
            pna.nextTick(cb, er);
          }

          // Checks that a user-supplied chunk is valid, especially for the particular
          // mode the stream is in. Currently this means that `null` is never accepted
          // and undefined/non-string values are only allowed in object mode.
          function validChunk(stream, state, chunk, cb) {
            var valid = true;
            var er = false;

            if (chunk === null) {
              er = new TypeError('May not write null values to stream');
            } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
              er = new TypeError('Invalid non-string/buffer chunk');
            }
            if (er) {
              stream.emit('error', er);
              pna.nextTick(cb, er);
              valid = false;
            }
            return valid;
          }

          Writable.prototype.write = function (chunk, encoding, cb) {
            var state = this._writableState;
            var ret = false;
            var isBuf = !state.objectMode && _isUint8Array(chunk);

            if (isBuf && !Buffer.isBuffer(chunk)) {
              chunk = _uint8ArrayToBuffer(chunk);
            }

            if (typeof encoding === 'function') {
              cb = encoding;
              encoding = null;
            }

            if (isBuf) encoding = 'buffer'; else if (!encoding) encoding = state.defaultEncoding;

            if (typeof cb !== 'function') cb = nop;

            if (state.ended) writeAfterEnd(this, cb); else if (isBuf || validChunk(this, state, chunk, cb)) {
              state.pendingcb++;
              ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
            }

            return ret;
          };

          Writable.prototype.cork = function () {
            var state = this._writableState;

            state.corked++;
          };

          Writable.prototype.uncork = function () {
            var state = this._writableState;

            if (state.corked) {
              state.corked--;

              if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
            }
          };

          Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
            // node::ParseEncoding() requires lower case.
            if (typeof encoding === 'string') encoding = encoding.toLowerCase();
            if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
            this._writableState.defaultEncoding = encoding;
            return this;
          };

          function decodeChunk(state, chunk, encoding) {
            if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
              chunk = Buffer.from(chunk, encoding);
            }
            return chunk;
          }

          Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function () {
              return this._writableState.highWaterMark;
            }
          });

          // if we're already writing something, then just put this
          // in the queue, and wait our turn.  Otherwise, call _write
          // If we return false, then we need a drain event, so set that flag.
          function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
            if (!isBuf) {
              var newChunk = decodeChunk(state, chunk, encoding);
              if (chunk !== newChunk) {
                isBuf = true;
                encoding = 'buffer';
                chunk = newChunk;
              }
            }
            var len = state.objectMode ? 1 : chunk.length;

            state.length += len;

            var ret = state.length < state.highWaterMark;
            // we must ensure that previous needDrain will not be reset to false.
            if (!ret) state.needDrain = true;

            if (state.writing || state.corked) {
              var last = state.lastBufferedRequest;
              state.lastBufferedRequest = {
                chunk: chunk,
                encoding: encoding,
                isBuf: isBuf,
                callback: cb,
                next: null
              };
              if (last) {
                last.next = state.lastBufferedRequest;
              } else {
                state.bufferedRequest = state.lastBufferedRequest;
              }
              state.bufferedRequestCount += 1;
            } else {
              doWrite(stream, state, false, len, chunk, encoding, cb);
            }

            return ret;
          }

          function doWrite(stream, state, writev, len, chunk, encoding, cb) {
            state.writelen = len;
            state.writecb = cb;
            state.writing = true;
            state.sync = true;
            if (writev) stream._writev(chunk, state.onwrite); else stream._write(chunk, encoding, state.onwrite);
            state.sync = false;
          }

          function onwriteError(stream, state, sync, er, cb) {
            --state.pendingcb;

            if (sync) {
              // defer the callback if we are being called synchronously
              // to avoid piling up things on the stack
              pna.nextTick(cb, er);
              // this can emit finish, and it will always happen
              // after error
              pna.nextTick(finishMaybe, stream, state);
              stream._writableState.errorEmitted = true;
              stream.emit('error', er);
            } else {
              // the caller expect this to happen before if
              // it is async
              cb(er);
              stream._writableState.errorEmitted = true;
              stream.emit('error', er);
              // this can emit finish, but finish must
              // always follow error
              finishMaybe(stream, state);
            }
          }

          function onwriteStateUpdate(state) {
            state.writing = false;
            state.writecb = null;
            state.length -= state.writelen;
            state.writelen = 0;
          }

          function onwrite(stream, er) {
            var state = stream._writableState;
            var sync = state.sync;
            var cb = state.writecb;

            onwriteStateUpdate(state);

            if (er) onwriteError(stream, state, sync, er, cb); else {
              // Check if we're actually ready to finish, but don't emit yet
              var finished = needFinish(state);

              if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
                clearBuffer(stream, state);
              }

              if (sync) {
                /*<replacement>*/
                asyncWrite(afterWrite, stream, state, finished, cb);
                /*</replacement>*/
              } else {
                afterWrite(stream, state, finished, cb);
              }
            }
          }

          function afterWrite(stream, state, finished, cb) {
            if (!finished) onwriteDrain(stream, state);
            state.pendingcb--;
            cb();
            finishMaybe(stream, state);
          }

          // Must force callback to be called on nextTick, so that we don't
          // emit 'drain' before the write() consumer gets the 'false' return
          // value, and has a chance to attach a 'drain' listener.
          function onwriteDrain(stream, state) {
            if (state.length === 0 && state.needDrain) {
              state.needDrain = false;
              stream.emit('drain');
            }
          }

          // if there's something in the buffer waiting, then process it
          function clearBuffer(stream, state) {
            state.bufferProcessing = true;
            var entry = state.bufferedRequest;

            if (stream._writev && entry && entry.next) {
              // Fast case, write everything using _writev()
              var l = state.bufferedRequestCount;
              var buffer = new Array(l);
              var holder = state.corkedRequestsFree;
              holder.entry = entry;

              var count = 0;
              var allBuffers = true;
              while (entry) {
                buffer[count] = entry;
                if (!entry.isBuf) allBuffers = false;
                entry = entry.next;
                count += 1;
              }
              buffer.allBuffers = allBuffers;

              doWrite(stream, state, true, state.length, buffer, '', holder.finish);

              // doWrite is almost always async, defer these to save a bit of time
              // as the hot path ends with doWrite
              state.pendingcb++;
              state.lastBufferedRequest = null;
              if (holder.next) {
                state.corkedRequestsFree = holder.next;
                holder.next = null;
              } else {
                state.corkedRequestsFree = new CorkedRequest(state);
              }
              state.bufferedRequestCount = 0;
            } else {
              // Slow case, write chunks one-by-one
              while (entry) {
                var chunk = entry.chunk;
                var encoding = entry.encoding;
                var cb = entry.callback;
                var len = state.objectMode ? 1 : chunk.length;

                doWrite(stream, state, false, len, chunk, encoding, cb);
                entry = entry.next;
                state.bufferedRequestCount--;
                // if we didn't call the onwrite immediately, then
                // it means that we need to wait until it does.
                // also, that means that the chunk and cb are currently
                // being processed, so move the buffer counter past them.
                if (state.writing) {
                  break;
                }
              }

              if (entry === null) state.lastBufferedRequest = null;
            }

            state.bufferedRequest = entry;
            state.bufferProcessing = false;
          }

          Writable.prototype._write = function (chunk, encoding, cb) {
            cb(new Error('_write() is not implemented'));
          };

          Writable.prototype._writev = null;

          Writable.prototype.end = function (chunk, encoding, cb) {
            var state = this._writableState;

            if (typeof chunk === 'function') {
              cb = chunk;
              chunk = null;
              encoding = null;
            } else if (typeof encoding === 'function') {
              cb = encoding;
              encoding = null;
            }

            if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

            // .end() fully uncorks
            if (state.corked) {
              state.corked = 1;
              this.uncork();
            }

            // ignore unnecessary end() calls.
            if (!state.ending) endWritable(this, state, cb);
          };

          function needFinish(state) {
            return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
          }
          function callFinal(stream, state) {
            stream._final(function (err) {
              state.pendingcb--;
              if (err) {
                stream.emit('error', err);
              }
              state.prefinished = true;
              stream.emit('prefinish');
              finishMaybe(stream, state);
            });
          }
          function prefinish(stream, state) {
            if (!state.prefinished && !state.finalCalled) {
              if (typeof stream._final === 'function') {
                state.pendingcb++;
                state.finalCalled = true;
                pna.nextTick(callFinal, stream, state);
              } else {
                state.prefinished = true;
                stream.emit('prefinish');
              }
            }
          }

          function finishMaybe(stream, state) {
            var need = needFinish(state);
            if (need) {
              prefinish(stream, state);
              if (state.pendingcb === 0) {
                state.finished = true;
                stream.emit('finish');
              }
            }
            return need;
          }

          function endWritable(stream, state, cb) {
            state.ending = true;
            finishMaybe(stream, state);
            if (cb) {
              if (state.finished) pna.nextTick(cb); else stream.once('finish', cb);
            }
            state.ended = true;
            stream.writable = false;
          }

          function onCorkedFinish(corkReq, state, err) {
            var entry = corkReq.entry;
            corkReq.entry = null;
            while (entry) {
              var cb = entry.callback;
              state.pendingcb--;
              cb(err);
              entry = entry.next;
            }

            // reuse the free corkReq.
            state.corkedRequestsFree.next = corkReq;
          }

          Object.defineProperty(Writable.prototype, 'destroyed', {
            get: function () {
              if (this._writableState === undefined) {
                return false;
              }
              return this._writableState.destroyed;
            },
            set: function (value) {
              // we ignore the value if the stream
              // has not been initialized yet
              if (!this._writableState) {
                return;
              }

              // backward compatibility, the user is explicitly
              // managing destroyed
              this._writableState.destroyed = value;
            }
          });

          Writable.prototype.destroy = destroyImpl.destroy;
          Writable.prototype._undestroy = destroyImpl.undestroy;
          Writable.prototype._destroy = function (err, cb) {
            this.end();
            cb(err);
          };
        }).call(this)
      }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("timers").setImmediate)
    }, { "./_stream_duplex": 115, "./internal/streams/destroy": 121, "./internal/streams/stream": 122, "_process": 113, "core-util-is": 107, "inherits": 110, "process-nextick-args": 112, "safe-buffer": 123, "timers": 132, "util-deprecate": 133 }], 120: [function (require, module, exports) {
      'use strict';

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      var Buffer = require('safe-buffer').Buffer;
      var util = require('util');

      function copyBuffer(src, target, offset) {
        src.copy(target, offset);
      }

      module.exports = function () {
        function BufferList() {
          _classCallCheck(this, BufferList);

          this.head = null;
          this.tail = null;
          this.length = 0;
        }

        BufferList.prototype.push = function push(v) {
          var entry = { data: v, next: null };
          if (this.length > 0) this.tail.next = entry; else this.head = entry;
          this.tail = entry;
          ++this.length;
        };

        BufferList.prototype.unshift = function unshift(v) {
          var entry = { data: v, next: this.head };
          if (this.length === 0) this.tail = entry;
          this.head = entry;
          ++this.length;
        };

        BufferList.prototype.shift = function shift() {
          if (this.length === 0) return;
          var ret = this.head.data;
          if (this.length === 1) this.head = this.tail = null; else this.head = this.head.next;
          --this.length;
          return ret;
        };

        BufferList.prototype.clear = function clear() {
          this.head = this.tail = null;
          this.length = 0;
        };

        BufferList.prototype.join = function join(s) {
          if (this.length === 0) return '';
          var p = this.head;
          var ret = '' + p.data;
          while (p = p.next) {
            ret += s + p.data;
          } return ret;
        };

        BufferList.prototype.concat = function concat(n) {
          if (this.length === 0) return Buffer.alloc(0);
          var ret = Buffer.allocUnsafe(n >>> 0);
          var p = this.head;
          var i = 0;
          while (p) {
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        };

        return BufferList;
      }();

      if (util && util.inspect && util.inspect.custom) {
        module.exports.prototype[util.inspect.custom] = function () {
          var obj = util.inspect({ length: this.length });
          return this.constructor.name + ' ' + obj;
        };
      }
    }, { "safe-buffer": 123, "util": 105 }], 121: [function (require, module, exports) {
      'use strict';

      /*<replacement>*/

      var pna = require('process-nextick-args');
      /*</replacement>*/

      // undocumented cb() API, needed for core, not for public API
      function destroy(err, cb) {
        var _this = this;

        var readableDestroyed = this._readableState && this._readableState.destroyed;
        var writableDestroyed = this._writableState && this._writableState.destroyed;

        if (readableDestroyed || writableDestroyed) {
          if (cb) {
            cb(err);
          } else if (err) {
            if (!this._writableState) {
              pna.nextTick(emitErrorNT, this, err);
            } else if (!this._writableState.errorEmitted) {
              this._writableState.errorEmitted = true;
              pna.nextTick(emitErrorNT, this, err);
            }
          }

          return this;
        }

        // we set destroyed to true before firing error callbacks in order
        // to make it re-entrance safe in case destroy() is called within callbacks

        if (this._readableState) {
          this._readableState.destroyed = true;
        }

        // if this is a duplex stream mark the writable part as destroyed as well
        if (this._writableState) {
          this._writableState.destroyed = true;
        }

        this._destroy(err || null, function (err) {
          if (!cb && err) {
            if (!_this._writableState) {
              pna.nextTick(emitErrorNT, _this, err);
            } else if (!_this._writableState.errorEmitted) {
              _this._writableState.errorEmitted = true;
              pna.nextTick(emitErrorNT, _this, err);
            }
          } else if (cb) {
            cb(err);
          }
        });

        return this;
      }

      function undestroy() {
        if (this._readableState) {
          this._readableState.destroyed = false;
          this._readableState.reading = false;
          this._readableState.ended = false;
          this._readableState.endEmitted = false;
        }

        if (this._writableState) {
          this._writableState.destroyed = false;
          this._writableState.ended = false;
          this._writableState.ending = false;
          this._writableState.finalCalled = false;
          this._writableState.prefinished = false;
          this._writableState.finished = false;
          this._writableState.errorEmitted = false;
        }
      }

      function emitErrorNT(self, err) {
        self.emit('error', err);
      }

      module.exports = {
        destroy: destroy,
        undestroy: undestroy
      };
    }, { "process-nextick-args": 112 }], 122: [function (require, module, exports) {
      module.exports = require('events').EventEmitter;

    }, { "events": 108 }], 123: [function (require, module, exports) {
      /* eslint-disable node/no-deprecated-api */
      var buffer = require('buffer')
      var Buffer = buffer.Buffer

      // alternative to using Object.keys for old browsers
      function copyProps(src, dst) {
        for (var key in src) {
          dst[key] = src[key]
        }
      }
      if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
        module.exports = buffer
      } else {
        // Copy properties from require('buffer')
        copyProps(buffer, exports)
        exports.Buffer = SafeBuffer
      }

      function SafeBuffer(arg, encodingOrOffset, length) {
        return Buffer(arg, encodingOrOffset, length)
      }

      // Copy static methods from Buffer
      copyProps(Buffer, SafeBuffer)

      SafeBuffer.from = function (arg, encodingOrOffset, length) {
        if (typeof arg === 'number') {
          throw new TypeError('Argument must not be a number')
        }
        return Buffer(arg, encodingOrOffset, length)
      }

      SafeBuffer.alloc = function (size, fill, encoding) {
        if (typeof size !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        var buf = Buffer(size)
        if (fill !== undefined) {
          if (typeof encoding === 'string') {
            buf.fill(fill, encoding)
          } else {
            buf.fill(fill)
          }
        } else {
          buf.fill(0)
        }
        return buf
      }

      SafeBuffer.allocUnsafe = function (size) {
        if (typeof size !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        return Buffer(size)
      }

      SafeBuffer.allocUnsafeSlow = function (size) {
        if (typeof size !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        return buffer.SlowBuffer(size)
      }

    }, { "buffer": 106 }], 124: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      'use strict';

      /*<replacement>*/

      var Buffer = require('safe-buffer').Buffer;
      /*</replacement>*/

      var isEncoding = Buffer.isEncoding || function (encoding) {
        encoding = '' + encoding;
        switch (encoding && encoding.toLowerCase()) {
          case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw':
            return true;
          default:
            return false;
        }
      };

      function _normalizeEncoding(enc) {
        if (!enc) return 'utf8';
        var retried;
        while (true) {
          switch (enc) {
            case 'utf8':
            case 'utf-8':
              return 'utf8';
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return 'utf16le';
            case 'latin1':
            case 'binary':
              return 'latin1';
            case 'base64':
            case 'ascii':
            case 'hex':
              return enc;
            default:
              if (retried) return; // undefined
              enc = ('' + enc).toLowerCase();
              retried = true;
          }
        }
      };

      // Do not cache `Buffer.isEncoding` when checking encoding names as some
      // modules monkey-patch it to support additional encodings
      function normalizeEncoding(enc) {
        var nenc = _normalizeEncoding(enc);
        if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
        return nenc || enc;
      }

      // StringDecoder provides an interface for efficiently splitting a series of
      // buffers into a series of JS strings without breaking apart multi-byte
      // characters.
      exports.StringDecoder = StringDecoder;
      function StringDecoder(encoding) {
        this.encoding = normalizeEncoding(encoding);
        var nb;
        switch (this.encoding) {
          case 'utf16le':
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
          case 'utf8':
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
          case 'base64':
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
          default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
        }
        this.lastNeed = 0;
        this.lastTotal = 0;
        this.lastChar = Buffer.allocUnsafe(nb);
      }

      StringDecoder.prototype.write = function (buf) {
        if (buf.length === 0) return '';
        var r;
        var i;
        if (this.lastNeed) {
          r = this.fillLast(buf);
          if (r === undefined) return '';
          i = this.lastNeed;
          this.lastNeed = 0;
        } else {
          i = 0;
        }
        if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
        return r || '';
      };

      StringDecoder.prototype.end = utf8End;

      // Returns only complete characters in a Buffer
      StringDecoder.prototype.text = utf8Text;

      // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
      StringDecoder.prototype.fillLast = function (buf) {
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
        this.lastNeed -= buf.length;
      };

      // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
      // continuation byte. If an invalid byte is detected, -2 is returned.
      function utf8CheckByte(byte) {
        if (byte <= 0x7F) return 0; else if (byte >> 5 === 0x06) return 2; else if (byte >> 4 === 0x0E) return 3; else if (byte >> 3 === 0x1E) return 4;
        return byte >> 6 === 0x02 ? -1 : -2;
      }

      // Checks at most 3 bytes at the end of a Buffer in order to detect an
      // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
      // needed to complete the UTF-8 character (if applicable) are returned.
      function utf8CheckIncomplete(self, buf, i) {
        var j = buf.length - 1;
        if (j < i) return 0;
        var nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) self.lastNeed = nb - 1;
          return nb;
        }
        if (--j < i || nb === -2) return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) self.lastNeed = nb - 2;
          return nb;
        }
        if (--j < i || nb === -2) return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) {
            if (nb === 2) nb = 0; else self.lastNeed = nb - 3;
          }
          return nb;
        }
        return 0;
      }

      // Validates as many continuation bytes for a multi-byte UTF-8 character as
      // needed or are available. If we see a non-continuation byte where we expect
      // one, we "replace" the validated continuation bytes we've seen so far with
      // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
      // behavior. The continuation byte check is included three times in the case
      // where all of the continuation bytes for a character exist in the same buffer.
      // It is also done this way as a slight performance increase instead of using a
      // loop.
      function utf8CheckExtraBytes(self, buf, p) {
        if ((buf[0] & 0xC0) !== 0x80) {
          self.lastNeed = 0;
          return '\ufffd';
        }
        if (self.lastNeed > 1 && buf.length > 1) {
          if ((buf[1] & 0xC0) !== 0x80) {
            self.lastNeed = 1;
            return '\ufffd';
          }
          if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xC0) !== 0x80) {
              self.lastNeed = 2;
              return '\ufffd';
            }
          }
        }
      }

      // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
      function utf8FillLast(buf) {
        var p = this.lastTotal - this.lastNeed;
        var r = utf8CheckExtraBytes(this, buf, p);
        if (r !== undefined) return r;
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, p, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, p, 0, buf.length);
        this.lastNeed -= buf.length;
      }

      // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
      // partial character, the character's bytes are buffered until the required
      // number of bytes are available.
      function utf8Text(buf, i) {
        var total = utf8CheckIncomplete(this, buf, i);
        if (!this.lastNeed) return buf.toString('utf8', i);
        this.lastTotal = total;
        var end = buf.length - (total - this.lastNeed);
        buf.copy(this.lastChar, 0, end);
        return buf.toString('utf8', i, end);
      }

      // For UTF-8, a replacement character is added when ending on a partial
      // character.
      function utf8End(buf) {
        var r = buf && buf.length ? this.write(buf) : '';
        if (this.lastNeed) return r + '\ufffd';
        return r;
      }

      // UTF-16LE typically needs two bytes per character, but even if we have an even
      // number of bytes available, we need to check if we end on a leading/high
      // surrogate. In that case, we need to wait for the next two bytes in order to
      // decode the last character properly.
      function utf16Text(buf, i) {
        if ((buf.length - i) % 2 === 0) {
          var r = buf.toString('utf16le', i);
          if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 0xD800 && c <= 0xDBFF) {
              this.lastNeed = 2;
              this.lastTotal = 4;
              this.lastChar[0] = buf[buf.length - 2];
              this.lastChar[1] = buf[buf.length - 1];
              return r.slice(0, -1);
            }
          }
          return r;
        }
        this.lastNeed = 1;
        this.lastTotal = 2;
        this.lastChar[0] = buf[buf.length - 1];
        return buf.toString('utf16le', i, buf.length - 1);
      }

      // For UTF-16LE we do not explicitly append special replacement characters if we
      // end on a partial character, we simply let v8 handle that.
      function utf16End(buf) {
        var r = buf && buf.length ? this.write(buf) : '';
        if (this.lastNeed) {
          var end = this.lastTotal - this.lastNeed;
          return r + this.lastChar.toString('utf16le', 0, end);
        }
        return r;
      }

      function base64Text(buf, i) {
        var n = (buf.length - i) % 3;
        if (n === 0) return buf.toString('base64', i);
        this.lastNeed = 3 - n;
        this.lastTotal = 3;
        if (n === 1) {
          this.lastChar[0] = buf[buf.length - 1];
        } else {
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
        }
        return buf.toString('base64', i, buf.length - n);
      }

      function base64End(buf) {
        var r = buf && buf.length ? this.write(buf) : '';
        if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
        return r;
      }

      // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
      function simpleWrite(buf) {
        return buf.toString(this.encoding);
      }

      function simpleEnd(buf) {
        return buf && buf.length ? this.write(buf) : '';
      }
    }, { "safe-buffer": 123 }], 125: [function (require, module, exports) {
      module.exports = require('./readable').PassThrough

    }, { "./readable": 126 }], 126: [function (require, module, exports) {
      exports = module.exports = require('./lib/_stream_readable.js');
      exports.Stream = exports;
      exports.Readable = exports;
      exports.Writable = require('./lib/_stream_writable.js');
      exports.Duplex = require('./lib/_stream_duplex.js');
      exports.Transform = require('./lib/_stream_transform.js');
      exports.PassThrough = require('./lib/_stream_passthrough.js');

    }, { "./lib/_stream_duplex.js": 115, "./lib/_stream_passthrough.js": 116, "./lib/_stream_readable.js": 117, "./lib/_stream_transform.js": 118, "./lib/_stream_writable.js": 119 }], 127: [function (require, module, exports) {
      module.exports = require('./readable').Transform

    }, { "./readable": 126 }], 128: [function (require, module, exports) {
      module.exports = require('./lib/_stream_writable.js');

    }, { "./lib/_stream_writable.js": 119 }], 129: [function (require, module, exports) {
      (function (Buffer) {
        (function () {
          ; (function (sax) { // wrapper for non-node envs
            sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
            sax.SAXParser = SAXParser
            sax.SAXStream = SAXStream
            sax.createStream = createStream

            // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
            // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
            // since that's the earliest that a buffer overrun could occur.  This way, checks are
            // as rare as required, but as often as necessary to ensure never crossing this bound.
            // Furthermore, buffers are only tested at most once per write(), so passing a very
            // large string into write() might have undesirable effects, but this is manageable by
            // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
            // edge case, result in creating at most one complete copy of the string passed in.
            // Set to Infinity to have unlimited buffers.
            sax.MAX_BUFFER_LENGTH = 64 * 1024

            var buffers = [
              'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
              'procInstName', 'procInstBody', 'entity', 'attribName',
              'attribValue', 'cdata', 'script'
            ]

            sax.EVENTS = [
              'text',
              'processinginstruction',
              'sgmldeclaration',
              'doctype',
              'comment',
              'opentagstart',
              'attribute',
              'opentag',
              'closetag',
              'opencdata',
              'cdata',
              'closecdata',
              'error',
              'end',
              'ready',
              'script',
              'opennamespace',
              'closenamespace'
            ]

            function SAXParser(strict, opt) {
              if (!(this instanceof SAXParser)) {
                return new SAXParser(strict, opt)
              }

              var parser = this
              clearBuffers(parser)
              parser.q = parser.c = ''
              parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
              parser.opt = opt || {}
              parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
              parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase'
              parser.tags = []
              parser.closed = parser.closedRoot = parser.sawRoot = false
              parser.tag = parser.error = null
              parser.strict = !!strict
              parser.noscript = !!(strict || parser.opt.noscript)
              parser.state = S.BEGIN
              parser.strictEntities = parser.opt.strictEntities
              parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES)
              parser.attribList = []

              // namespaces form a prototype chain.
              // it always points at the current tag,
              // which protos to its parent tag.
              if (parser.opt.xmlns) {
                parser.ns = Object.create(rootNS)
              }

              // mostly just for error reporting
              parser.trackPosition = parser.opt.position !== false
              if (parser.trackPosition) {
                parser.position = parser.line = parser.column = 0
              }
              emit(parser, 'onready')
            }

            if (!Object.create) {
              Object.create = function (o) {
                function F() { }
                F.prototype = o
                var newf = new F()
                return newf
              }
            }

            if (!Object.keys) {
              Object.keys = function (o) {
                var a = []
                for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
                return a
              }
            }

            function checkBufferLength(parser) {
              var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
              var maxActual = 0
              for (var i = 0, l = buffers.length; i < l; i++) {
                var len = parser[buffers[i]].length
                if (len > maxAllowed) {
                  // Text/cdata nodes can get big, and since they're buffered,
                  // we can get here under normal conditions.
                  // Avoid issues by emitting the text node now,
                  // so at least it won't get any bigger.
                  switch (buffers[i]) {
                    case 'textNode':
                      closeText(parser)
                      break

                    case 'cdata':
                      emitNode(parser, 'oncdata', parser.cdata)
                      parser.cdata = ''
                      break

                    case 'script':
                      emitNode(parser, 'onscript', parser.script)
                      parser.script = ''
                      break

                    default:
                      error(parser, 'Max buffer length exceeded: ' + buffers[i])
                  }
                }
                maxActual = Math.max(maxActual, len)
              }
              // schedule the next check for the earliest possible buffer overrun.
              var m = sax.MAX_BUFFER_LENGTH - maxActual
              parser.bufferCheckPosition = m + parser.position
            }

            function clearBuffers(parser) {
              for (var i = 0, l = buffers.length; i < l; i++) {
                parser[buffers[i]] = ''
              }
            }

            function flushBuffers(parser) {
              closeText(parser)
              if (parser.cdata !== '') {
                emitNode(parser, 'oncdata', parser.cdata)
                parser.cdata = ''
              }
              if (parser.script !== '') {
                emitNode(parser, 'onscript', parser.script)
                parser.script = ''
              }
            }

            SAXParser.prototype = {
              end: function () { end(this) },
              write: write,
              resume: function () { this.error = null; return this },
              close: function () { return this.write(null) },
              flush: function () { flushBuffers(this) }
            }

            var Stream
            try {
              Stream = require('stream').Stream
            } catch (ex) {
              Stream = function () { }
            }

            var streamWraps = sax.EVENTS.filter(function (ev) {
              return ev !== 'error' && ev !== 'end'
            })

            function createStream(strict, opt) {
              return new SAXStream(strict, opt)
            }

            function SAXStream(strict, opt) {
              if (!(this instanceof SAXStream)) {
                return new SAXStream(strict, opt)
              }

              Stream.apply(this)

              this._parser = new SAXParser(strict, opt)
              this.writable = true
              this.readable = true

              var me = this

              this._parser.onend = function () {
                me.emit('end')
              }

              this._parser.onerror = function (er) {
                me.emit('error', er)

                // if didn't throw, then means error was handled.
                // go ahead and clear error, so we can write again.
                me._parser.error = null
              }

              this._decoder = null

              streamWraps.forEach(function (ev) {
                Object.defineProperty(me, 'on' + ev, {
                  get: function () {
                    return me._parser['on' + ev]
                  },
                  set: function (h) {
                    if (!h) {
                      me.removeAllListeners(ev)
                      me._parser['on' + ev] = h
                      return h
                    }
                    me.on(ev, h)
                  },
                  enumerable: true,
                  configurable: false
                })
              })
            }

            SAXStream.prototype = Object.create(Stream.prototype, {
              constructor: {
                value: SAXStream
              }
            })

            SAXStream.prototype.write = function (data) {
              if (typeof Buffer === 'function' &&
                typeof Buffer.isBuffer === 'function' &&
                Buffer.isBuffer(data)) {
                if (!this._decoder) {
                  var SD = require('string_decoder').StringDecoder
                  this._decoder = new SD('utf8')
                }
                data = this._decoder.write(data)
              }

              this._parser.write(data.toString())
              this.emit('data', data)
              return true
            }

            SAXStream.prototype.end = function (chunk) {
              if (chunk && chunk.length) {
                this.write(chunk)
              }
              this._parser.end()
              return true
            }

            SAXStream.prototype.on = function (ev, handler) {
              var me = this
              if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
                me._parser['on' + ev] = function () {
                  var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
                  args.splice(0, 0, ev)
                  me.emit.apply(me, args)
                }
              }

              return Stream.prototype.on.call(me, ev, handler)
            }

            // this really needs to be replaced with character classes.
            // XML allows all manner of ridiculous numbers and digits.
            var CDATA = '[CDATA['
            var DOCTYPE = 'DOCTYPE'
            var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
            var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'
            var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }

            // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
            // This implementation works on strings, a single character at a time
            // as such, it cannot ever support astral-plane characters (10000-EFFFF)
            // without a significant breaking change to either this  parser, or the
            // JavaScript language.  Implementation of an emoji-capable xml parser
            // is left as an exercise for the reader.
            var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

            var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

            var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/
            var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

            function isWhitespace(c) {
              return c === ' ' || c === '\n' || c === '\r' || c === '\t'
            }

            function isQuote(c) {
              return c === '"' || c === '\''
            }

            function isAttribEnd(c) {
              return c === '>' || isWhitespace(c)
            }

            function isMatch(regex, c) {
              return regex.test(c)
            }

            function notMatch(regex, c) {
              return !isMatch(regex, c)
            }

            var S = 0
            sax.STATE = {
              BEGIN: S++, // leading byte order mark or whitespace
              BEGIN_WHITESPACE: S++, // leading whitespace
              TEXT: S++, // general stuff
              TEXT_ENTITY: S++, // &amp and such.
              OPEN_WAKA: S++, // <
              SGML_DECL: S++, // <!BLARG
              SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
              DOCTYPE: S++, // <!DOCTYPE
              DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
              DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
              DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
              COMMENT_STARTING: S++, // <!-
              COMMENT: S++, // <!--
              COMMENT_ENDING: S++, // <!-- blah -
              COMMENT_ENDED: S++, // <!-- blah --
              CDATA: S++, // <![CDATA[ something
              CDATA_ENDING: S++, // ]
              CDATA_ENDING_2: S++, // ]]
              PROC_INST: S++, // <?hi
              PROC_INST_BODY: S++, // <?hi there
              PROC_INST_ENDING: S++, // <?hi "there" ?
              OPEN_TAG: S++, // <strong
              OPEN_TAG_SLASH: S++, // <strong /
              ATTRIB: S++, // <a
              ATTRIB_NAME: S++, // <a foo
              ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
              ATTRIB_VALUE: S++, // <a foo=
              ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
              ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
              ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
              ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
              ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
              CLOSE_TAG: S++, // </a
              CLOSE_TAG_SAW_WHITE: S++, // </a   >
              SCRIPT: S++, // <script> ...
              SCRIPT_ENDING: S++ // <script> ... <
            }

            sax.XML_ENTITIES = {
              'amp': '&',
              'gt': '>',
              'lt': '<',
              'quot': '"',
              'apos': "'"
            }

            sax.ENTITIES = {
              'amp': '&',
              'gt': '>',
              'lt': '<',
              'quot': '"',
              'apos': "'",
              'AElig': 198,
              'Aacute': 193,
              'Acirc': 194,
              'Agrave': 192,
              'Aring': 197,
              'Atilde': 195,
              'Auml': 196,
              'Ccedil': 199,
              'ETH': 208,
              'Eacute': 201,
              'Ecirc': 202,
              'Egrave': 200,
              'Euml': 203,
              'Iacute': 205,
              'Icirc': 206,
              'Igrave': 204,
              'Iuml': 207,
              'Ntilde': 209,
              'Oacute': 211,
              'Ocirc': 212,
              'Ograve': 210,
              'Oslash': 216,
              'Otilde': 213,
              'Ouml': 214,
              'THORN': 222,
              'Uacute': 218,
              'Ucirc': 219,
              'Ugrave': 217,
              'Uuml': 220,
              'Yacute': 221,
              'aacute': 225,
              'acirc': 226,
              'aelig': 230,
              'agrave': 224,
              'aring': 229,
              'atilde': 227,
              'auml': 228,
              'ccedil': 231,
              'eacute': 233,
              'ecirc': 234,
              'egrave': 232,
              'eth': 240,
              'euml': 235,
              'iacute': 237,
              'icirc': 238,
              'igrave': 236,
              'iuml': 239,
              'ntilde': 241,
              'oacute': 243,
              'ocirc': 244,
              'ograve': 242,
              'oslash': 248,
              'otilde': 245,
              'ouml': 246,
              'szlig': 223,
              'thorn': 254,
              'uacute': 250,
              'ucirc': 251,
              'ugrave': 249,
              'uuml': 252,
              'yacute': 253,
              'yuml': 255,
              'copy': 169,
              'reg': 174,
              'nbsp': 160,
              'iexcl': 161,
              'cent': 162,
              'pound': 163,
              'curren': 164,
              'yen': 165,
              'brvbar': 166,
              'sect': 167,
              'uml': 168,
              'ordf': 170,
              'laquo': 171,
              'not': 172,
              'shy': 173,
              'macr': 175,
              'deg': 176,
              'plusmn': 177,
              'sup1': 185,
              'sup2': 178,
              'sup3': 179,
              'acute': 180,
              'micro': 181,
              'para': 182,
              'middot': 183,
              'cedil': 184,
              'ordm': 186,
              'raquo': 187,
              'frac14': 188,
              'frac12': 189,
              'frac34': 190,
              'iquest': 191,
              'times': 215,
              'divide': 247,
              'OElig': 338,
              'oelig': 339,
              'Scaron': 352,
              'scaron': 353,
              'Yuml': 376,
              'fnof': 402,
              'circ': 710,
              'tilde': 732,
              'Alpha': 913,
              'Beta': 914,
              'Gamma': 915,
              'Delta': 916,
              'Epsilon': 917,
              'Zeta': 918,
              'Eta': 919,
              'Theta': 920,
              'Iota': 921,
              'Kappa': 922,
              'Lambda': 923,
              'Mu': 924,
              'Nu': 925,
              'Xi': 926,
              'Omicron': 927,
              'Pi': 928,
              'Rho': 929,
              'Sigma': 931,
              'Tau': 932,
              'Upsilon': 933,
              'Phi': 934,
              'Chi': 935,
              'Psi': 936,
              'Omega': 937,
              'alpha': 945,
              'beta': 946,
              'gamma': 947,
              'delta': 948,
              'epsilon': 949,
              'zeta': 950,
              'eta': 951,
              'theta': 952,
              'iota': 953,
              'kappa': 954,
              'lambda': 955,
              'mu': 956,
              'nu': 957,
              'xi': 958,
              'omicron': 959,
              'pi': 960,
              'rho': 961,
              'sigmaf': 962,
              'sigma': 963,
              'tau': 964,
              'upsilon': 965,
              'phi': 966,
              'chi': 967,
              'psi': 968,
              'omega': 969,
              'thetasym': 977,
              'upsih': 978,
              'piv': 982,
              'ensp': 8194,
              'emsp': 8195,
              'thinsp': 8201,
              'zwnj': 8204,
              'zwj': 8205,
              'lrm': 8206,
              'rlm': 8207,
              'ndash': 8211,
              'mdash': 8212,
              'lsquo': 8216,
              'rsquo': 8217,
              'sbquo': 8218,
              'ldquo': 8220,
              'rdquo': 8221,
              'bdquo': 8222,
              'dagger': 8224,
              'Dagger': 8225,
              'bull': 8226,
              'hellip': 8230,
              'permil': 8240,
              'prime': 8242,
              'Prime': 8243,
              'lsaquo': 8249,
              'rsaquo': 8250,
              'oline': 8254,
              'frasl': 8260,
              'euro': 8364,
              'image': 8465,
              'weierp': 8472,
              'real': 8476,
              'trade': 8482,
              'alefsym': 8501,
              'larr': 8592,
              'uarr': 8593,
              'rarr': 8594,
              'darr': 8595,
              'harr': 8596,
              'crarr': 8629,
              'lArr': 8656,
              'uArr': 8657,
              'rArr': 8658,
              'dArr': 8659,
              'hArr': 8660,
              'forall': 8704,
              'part': 8706,
              'exist': 8707,
              'empty': 8709,
              'nabla': 8711,
              'isin': 8712,
              'notin': 8713,
              'ni': 8715,
              'prod': 8719,
              'sum': 8721,
              'minus': 8722,
              'lowast': 8727,
              'radic': 8730,
              'prop': 8733,
              'infin': 8734,
              'ang': 8736,
              'and': 8743,
              'or': 8744,
              'cap': 8745,
              'cup': 8746,
              'int': 8747,
              'there4': 8756,
              'sim': 8764,
              'cong': 8773,
              'asymp': 8776,
              'ne': 8800,
              'equiv': 8801,
              'le': 8804,
              'ge': 8805,
              'sub': 8834,
              'sup': 8835,
              'nsub': 8836,
              'sube': 8838,
              'supe': 8839,
              'oplus': 8853,
              'otimes': 8855,
              'perp': 8869,
              'sdot': 8901,
              'lceil': 8968,
              'rceil': 8969,
              'lfloor': 8970,
              'rfloor': 8971,
              'lang': 9001,
              'rang': 9002,
              'loz': 9674,
              'spades': 9824,
              'clubs': 9827,
              'hearts': 9829,
              'diams': 9830
            }

            Object.keys(sax.ENTITIES).forEach(function (key) {
              var e = sax.ENTITIES[key]
              var s = typeof e === 'number' ? String.fromCharCode(e) : e
              sax.ENTITIES[key] = s
            })

            for (var s in sax.STATE) {
              sax.STATE[sax.STATE[s]] = s
            }

            // shorthand
            S = sax.STATE

            function emit(parser, event, data) {
              parser[event] && parser[event](data)
            }

            function emitNode(parser, nodeType, data) {
              if (parser.textNode) closeText(parser)
              emit(parser, nodeType, data)
            }

            function closeText(parser) {
              parser.textNode = textopts(parser.opt, parser.textNode)
              if (parser.textNode) emit(parser, 'ontext', parser.textNode)
              parser.textNode = ''
            }

            function textopts(opt, text) {
              if (opt.trim) text = text.trim()
              if (opt.normalize) text = text.replace(/\s+/g, ' ')
              return text
            }

            function error(parser, er) {
              closeText(parser)
              if (parser.trackPosition) {
                er += '\nLine: ' + parser.line +
                  '\nColumn: ' + parser.column +
                  '\nChar: ' + parser.c
              }
              er = new Error(er)
              parser.error = er
              emit(parser, 'onerror', er)
              return parser
            }

            function end(parser) {
              if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag')
              if ((parser.state !== S.BEGIN) &&
                (parser.state !== S.BEGIN_WHITESPACE) &&
                (parser.state !== S.TEXT)) {
                error(parser, 'Unexpected end')
              }
              closeText(parser)
              parser.c = ''
              parser.closed = true
              emit(parser, 'onend')
              SAXParser.call(parser, parser.strict, parser.opt)
              return parser
            }

            function strictFail(parser, message) {
              if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
                throw new Error('bad call to strictFail')
              }
              if (parser.strict) {
                error(parser, message)
              }
            }

            function newTag(parser) {
              if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]()
              var parent = parser.tags[parser.tags.length - 1] || parser
              var tag = parser.tag = { name: parser.tagName, attributes: {} }

              // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
              if (parser.opt.xmlns) {
                tag.ns = parent.ns
              }
              parser.attribList.length = 0
              emitNode(parser, 'onopentagstart', tag)
            }

            function qname(name, attribute) {
              var i = name.indexOf(':')
              var qualName = i < 0 ? ['', name] : name.split(':')
              var prefix = qualName[0]
              var local = qualName[1]

              // <x "xmlns"="http://foo">
              if (attribute && name === 'xmlns') {
                prefix = 'xmlns'
                local = ''
              }

              return { prefix: prefix, local: local }
            }

            function attrib(parser) {
              if (!parser.strict) {
                parser.attribName = parser.attribName[parser.looseCase]()
              }

              if (parser.attribList.indexOf(parser.attribName) !== -1 ||
                parser.tag.attributes.hasOwnProperty(parser.attribName)) {
                parser.attribName = parser.attribValue = ''
                return
              }

              if (parser.opt.xmlns) {
                var qn = qname(parser.attribName, true)
                var prefix = qn.prefix
                var local = qn.local

                if (prefix === 'xmlns') {
                  // namespace binding attribute. push the binding into scope
                  if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
                    strictFail(parser,
                      'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
                      'Actual: ' + parser.attribValue)
                  } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
                    strictFail(parser,
                      'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
                      'Actual: ' + parser.attribValue)
                  } else {
                    var tag = parser.tag
                    var parent = parser.tags[parser.tags.length - 1] || parser
                    if (tag.ns === parent.ns) {
                      tag.ns = Object.create(parent.ns)
                    }
                    tag.ns[local] = parser.attribValue
                  }
                }

                // defer onattribute events until all attributes have been seen
                // so any new bindings can take effect. preserve attribute order
                // so deferred events can be emitted in document order
                parser.attribList.push([parser.attribName, parser.attribValue])
              } else {
                // in non-xmlns mode, we can emit the event right away
                parser.tag.attributes[parser.attribName] = parser.attribValue
                emitNode(parser, 'onattribute', {
                  name: parser.attribName,
                  value: parser.attribValue
                })
              }

              parser.attribName = parser.attribValue = ''
            }

            function openTag(parser, selfClosing) {
              if (parser.opt.xmlns) {
                // emit namespace binding events
                var tag = parser.tag

                // add namespace info to tag
                var qn = qname(parser.tagName)
                tag.prefix = qn.prefix
                tag.local = qn.local
                tag.uri = tag.ns[qn.prefix] || ''

                if (tag.prefix && !tag.uri) {
                  strictFail(parser, 'Unbound namespace prefix: ' +
                    JSON.stringify(parser.tagName))
                  tag.uri = qn.prefix
                }

                var parent = parser.tags[parser.tags.length - 1] || parser
                if (tag.ns && parent.ns !== tag.ns) {
                  Object.keys(tag.ns).forEach(function (p) {
                    emitNode(parser, 'onopennamespace', {
                      prefix: p,
                      uri: tag.ns[p]
                    })
                  })
                }

                // handle deferred onattribute events
                // Note: do not apply default ns to attributes:
                //   http://www.w3.org/TR/REC-xml-names/#defaulting
                for (var i = 0, l = parser.attribList.length; i < l; i++) {
                  var nv = parser.attribList[i]
                  var name = nv[0]
                  var value = nv[1]
                  var qualName = qname(name, true)
                  var prefix = qualName.prefix
                  var local = qualName.local
                  var uri = prefix === '' ? '' : (tag.ns[prefix] || '')
                  var a = {
                    name: name,
                    value: value,
                    prefix: prefix,
                    local: local,
                    uri: uri
                  }

                  // if there's any attributes with an undefined namespace,
                  // then fail on them now.
                  if (prefix && prefix !== 'xmlns' && !uri) {
                    strictFail(parser, 'Unbound namespace prefix: ' +
                      JSON.stringify(prefix))
                    a.uri = prefix
                  }
                  parser.tag.attributes[name] = a
                  emitNode(parser, 'onattribute', a)
                }
                parser.attribList.length = 0
              }

              parser.tag.isSelfClosing = !!selfClosing

              // process the tag
              parser.sawRoot = true
              parser.tags.push(parser.tag)
              emitNode(parser, 'onopentag', parser.tag)
              if (!selfClosing) {
                // special case for <script> in non-strict mode.
                if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
                  parser.state = S.SCRIPT
                } else {
                  parser.state = S.TEXT
                }
                parser.tag = null
                parser.tagName = ''
              }
              parser.attribName = parser.attribValue = ''
              parser.attribList.length = 0
            }

            function closeTag(parser) {
              if (!parser.tagName) {
                strictFail(parser, 'Weird empty close tag.')
                parser.textNode += '</>'
                parser.state = S.TEXT
                return
              }

              if (parser.script) {
                if (parser.tagName !== 'script') {
                  parser.script += '</' + parser.tagName + '>'
                  parser.tagName = ''
                  parser.state = S.SCRIPT
                  return
                }
                emitNode(parser, 'onscript', parser.script)
                parser.script = ''
              }

              // first make sure that the closing tag actually exists.
              // <a><b></c></b></a> will close everything, otherwise.
              var t = parser.tags.length
              var tagName = parser.tagName
              if (!parser.strict) {
                tagName = tagName[parser.looseCase]()
              }
              var closeTo = tagName
              while (t--) {
                var close = parser.tags[t]
                if (close.name !== closeTo) {
                  // fail the first time in strict mode
                  strictFail(parser, 'Unexpected close tag')
                } else {
                  break
                }
              }

              // didn't find it.  we already failed for strict, so just abort.
              if (t < 0) {
                strictFail(parser, 'Unmatched closing tag: ' + parser.tagName)
                parser.textNode += '</' + parser.tagName + '>'
                parser.state = S.TEXT
                return
              }
              parser.tagName = tagName
              var s = parser.tags.length
              while (s-- > t) {
                var tag = parser.tag = parser.tags.pop()
                parser.tagName = parser.tag.name
                emitNode(parser, 'onclosetag', parser.tagName)

                var x = {}
                for (var i in tag.ns) {
                  x[i] = tag.ns[i]
                }

                var parent = parser.tags[parser.tags.length - 1] || parser
                if (parser.opt.xmlns && tag.ns !== parent.ns) {
                  // remove namespace bindings introduced by tag
                  Object.keys(tag.ns).forEach(function (p) {
                    var n = tag.ns[p]
                    emitNode(parser, 'onclosenamespace', { prefix: p, uri: n })
                  })
                }
              }
              if (t === 0) parser.closedRoot = true
              parser.tagName = parser.attribValue = parser.attribName = ''
              parser.attribList.length = 0
              parser.state = S.TEXT
            }

            function parseEntity(parser) {
              var entity = parser.entity
              var entityLC = entity.toLowerCase()
              var num
              var numStr = ''

              if (parser.ENTITIES[entity]) {
                return parser.ENTITIES[entity]
              }
              if (parser.ENTITIES[entityLC]) {
                return parser.ENTITIES[entityLC]
              }
              entity = entityLC
              if (entity.charAt(0) === '#') {
                if (entity.charAt(1) === 'x') {
                  entity = entity.slice(2)
                  num = parseInt(entity, 16)
                  numStr = num.toString(16)
                } else {
                  entity = entity.slice(1)
                  num = parseInt(entity, 10)
                  numStr = num.toString(10)
                }
              }
              entity = entity.replace(/^0+/, '')
              if (isNaN(num) || numStr.toLowerCase() !== entity) {
                strictFail(parser, 'Invalid character entity')
                return '&' + parser.entity + ';'
              }

              return String.fromCodePoint(num)
            }

            function beginWhiteSpace(parser, c) {
              if (c === '<') {
                parser.state = S.OPEN_WAKA
                parser.startTagPosition = parser.position
              } else if (!isWhitespace(c)) {
                // have to process this as a text node.
                // weird, but happens.
                strictFail(parser, 'Non-whitespace before first tag.')
                parser.textNode = c
                parser.state = S.TEXT
              }
            }

            function charAt(chunk, i) {
              var result = ''
              if (i < chunk.length) {
                result = chunk.charAt(i)
              }
              return result
            }

            function write(chunk) {
              var parser = this
              if (this.error) {
                throw this.error
              }
              if (parser.closed) {
                return error(parser,
                  'Cannot write after close. Assign an onready handler.')
              }
              if (chunk === null) {
                return end(parser)
              }
              if (typeof chunk === 'object') {
                chunk = chunk.toString()
              }
              var i = 0
              var c = ''
              while (true) {
                c = charAt(chunk, i++)
                parser.c = c

                if (!c) {
                  break
                }

                if (parser.trackPosition) {
                  parser.position++
                  if (c === '\n') {
                    parser.line++
                    parser.column = 0
                  } else {
                    parser.column++
                  }
                }

                switch (parser.state) {
                  case S.BEGIN:
                    parser.state = S.BEGIN_WHITESPACE
                    if (c === '\uFEFF') {
                      continue
                    }
                    beginWhiteSpace(parser, c)
                    continue

                  case S.BEGIN_WHITESPACE:
                    beginWhiteSpace(parser, c)
                    continue

                  case S.TEXT:
                    if (parser.sawRoot && !parser.closedRoot) {
                      var starti = i - 1
                      while (c && c !== '<' && c !== '&') {
                        c = charAt(chunk, i++)
                        if (c && parser.trackPosition) {
                          parser.position++
                          if (c === '\n') {
                            parser.line++
                            parser.column = 0
                          } else {
                            parser.column++
                          }
                        }
                      }
                      parser.textNode += chunk.substring(starti, i - 1)
                    }
                    if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                      parser.state = S.OPEN_WAKA
                      parser.startTagPosition = parser.position
                    } else {
                      if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                        strictFail(parser, 'Text data outside of root node.')
                      }
                      if (c === '&') {
                        parser.state = S.TEXT_ENTITY
                      } else {
                        parser.textNode += c
                      }
                    }
                    continue

                  case S.SCRIPT:
                    // only non-strict
                    if (c === '<') {
                      parser.state = S.SCRIPT_ENDING
                    } else {
                      parser.script += c
                    }
                    continue

                  case S.SCRIPT_ENDING:
                    if (c === '/') {
                      parser.state = S.CLOSE_TAG
                    } else {
                      parser.script += '<' + c
                      parser.state = S.SCRIPT
                    }
                    continue

                  case S.OPEN_WAKA:
                    // either a /, ?, !, or text is coming next.
                    if (c === '!') {
                      parser.state = S.SGML_DECL
                      parser.sgmlDecl = ''
                    } else if (isWhitespace(c)) {
                      // wait for it...
                    } else if (isMatch(nameStart, c)) {
                      parser.state = S.OPEN_TAG
                      parser.tagName = c
                    } else if (c === '/') {
                      parser.state = S.CLOSE_TAG
                      parser.tagName = ''
                    } else if (c === '?') {
                      parser.state = S.PROC_INST
                      parser.procInstName = parser.procInstBody = ''
                    } else {
                      strictFail(parser, 'Unencoded <')
                      // if there was some whitespace, then add that in.
                      if (parser.startTagPosition + 1 < parser.position) {
                        var pad = parser.position - parser.startTagPosition
                        c = new Array(pad).join(' ') + c
                      }
                      parser.textNode += '<' + c
                      parser.state = S.TEXT
                    }
                    continue

                  case S.SGML_DECL:
                    if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                      emitNode(parser, 'onopencdata')
                      parser.state = S.CDATA
                      parser.sgmlDecl = ''
                      parser.cdata = ''
                    } else if (parser.sgmlDecl + c === '--') {
                      parser.state = S.COMMENT
                      parser.comment = ''
                      parser.sgmlDecl = ''
                    } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                      parser.state = S.DOCTYPE
                      if (parser.doctype || parser.sawRoot) {
                        strictFail(parser,
                          'Inappropriately located doctype declaration')
                      }
                      parser.doctype = ''
                      parser.sgmlDecl = ''
                    } else if (c === '>') {
                      emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl)
                      parser.sgmlDecl = ''
                      parser.state = S.TEXT
                    } else if (isQuote(c)) {
                      parser.state = S.SGML_DECL_QUOTED
                      parser.sgmlDecl += c
                    } else {
                      parser.sgmlDecl += c
                    }
                    continue

                  case S.SGML_DECL_QUOTED:
                    if (c === parser.q) {
                      parser.state = S.SGML_DECL
                      parser.q = ''
                    }
                    parser.sgmlDecl += c
                    continue

                  case S.DOCTYPE:
                    if (c === '>') {
                      parser.state = S.TEXT
                      emitNode(parser, 'ondoctype', parser.doctype)
                      parser.doctype = true // just remember that we saw it.
                    } else {
                      parser.doctype += c
                      if (c === '[') {
                        parser.state = S.DOCTYPE_DTD
                      } else if (isQuote(c)) {
                        parser.state = S.DOCTYPE_QUOTED
                        parser.q = c
                      }
                    }
                    continue

                  case S.DOCTYPE_QUOTED:
                    parser.doctype += c
                    if (c === parser.q) {
                      parser.q = ''
                      parser.state = S.DOCTYPE
                    }
                    continue

                  case S.DOCTYPE_DTD:
                    parser.doctype += c
                    if (c === ']') {
                      parser.state = S.DOCTYPE
                    } else if (isQuote(c)) {
                      parser.state = S.DOCTYPE_DTD_QUOTED
                      parser.q = c
                    }
                    continue

                  case S.DOCTYPE_DTD_QUOTED:
                    parser.doctype += c
                    if (c === parser.q) {
                      parser.state = S.DOCTYPE_DTD
                      parser.q = ''
                    }
                    continue

                  case S.COMMENT:
                    if (c === '-') {
                      parser.state = S.COMMENT_ENDING
                    } else {
                      parser.comment += c
                    }
                    continue

                  case S.COMMENT_ENDING:
                    if (c === '-') {
                      parser.state = S.COMMENT_ENDED
                      parser.comment = textopts(parser.opt, parser.comment)
                      if (parser.comment) {
                        emitNode(parser, 'oncomment', parser.comment)
                      }
                      parser.comment = ''
                    } else {
                      parser.comment += '-' + c
                      parser.state = S.COMMENT
                    }
                    continue

                  case S.COMMENT_ENDED:
                    if (c !== '>') {
                      strictFail(parser, 'Malformed comment')
                      // allow <!-- blah -- bloo --> in non-strict mode,
                      // which is a comment of " blah -- bloo "
                      parser.comment += '--' + c
                      parser.state = S.COMMENT
                    } else {
                      parser.state = S.TEXT
                    }
                    continue

                  case S.CDATA:
                    if (c === ']') {
                      parser.state = S.CDATA_ENDING
                    } else {
                      parser.cdata += c
                    }
                    continue

                  case S.CDATA_ENDING:
                    if (c === ']') {
                      parser.state = S.CDATA_ENDING_2
                    } else {
                      parser.cdata += ']' + c
                      parser.state = S.CDATA
                    }
                    continue

                  case S.CDATA_ENDING_2:
                    if (c === '>') {
                      if (parser.cdata) {
                        emitNode(parser, 'oncdata', parser.cdata)
                      }
                      emitNode(parser, 'onclosecdata')
                      parser.cdata = ''
                      parser.state = S.TEXT
                    } else if (c === ']') {
                      parser.cdata += ']'
                    } else {
                      parser.cdata += ']]' + c
                      parser.state = S.CDATA
                    }
                    continue

                  case S.PROC_INST:
                    if (c === '?') {
                      parser.state = S.PROC_INST_ENDING
                    } else if (isWhitespace(c)) {
                      parser.state = S.PROC_INST_BODY
                    } else {
                      parser.procInstName += c
                    }
                    continue

                  case S.PROC_INST_BODY:
                    if (!parser.procInstBody && isWhitespace(c)) {
                      continue
                    } else if (c === '?') {
                      parser.state = S.PROC_INST_ENDING
                    } else {
                      parser.procInstBody += c
                    }
                    continue

                  case S.PROC_INST_ENDING:
                    if (c === '>') {
                      emitNode(parser, 'onprocessinginstruction', {
                        name: parser.procInstName,
                        body: parser.procInstBody
                      })
                      parser.procInstName = parser.procInstBody = ''
                      parser.state = S.TEXT
                    } else {
                      parser.procInstBody += '?' + c
                      parser.state = S.PROC_INST_BODY
                    }
                    continue

                  case S.OPEN_TAG:
                    if (isMatch(nameBody, c)) {
                      parser.tagName += c
                    } else {
                      newTag(parser)
                      if (c === '>') {
                        openTag(parser)
                      } else if (c === '/') {
                        parser.state = S.OPEN_TAG_SLASH
                      } else {
                        if (!isWhitespace(c)) {
                          strictFail(parser, 'Invalid character in tag name')
                        }
                        parser.state = S.ATTRIB
                      }
                    }
                    continue

                  case S.OPEN_TAG_SLASH:
                    if (c === '>') {
                      openTag(parser, true)
                      closeTag(parser)
                    } else {
                      strictFail(parser, 'Forward-slash in opening tag not followed by >')
                      parser.state = S.ATTRIB
                    }
                    continue

                  case S.ATTRIB:
                    // haven't read the attribute name yet.
                    if (isWhitespace(c)) {
                      continue
                    } else if (c === '>') {
                      openTag(parser)
                    } else if (c === '/') {
                      parser.state = S.OPEN_TAG_SLASH
                    } else if (isMatch(nameStart, c)) {
                      parser.attribName = c
                      parser.attribValue = ''
                      parser.state = S.ATTRIB_NAME
                    } else {
                      strictFail(parser, 'Invalid attribute name')
                    }
                    continue

                  case S.ATTRIB_NAME:
                    if (c === '=') {
                      parser.state = S.ATTRIB_VALUE
                    } else if (c === '>') {
                      strictFail(parser, 'Attribute without value')
                      parser.attribValue = parser.attribName
                      attrib(parser)
                      openTag(parser)
                    } else if (isWhitespace(c)) {
                      parser.state = S.ATTRIB_NAME_SAW_WHITE
                    } else if (isMatch(nameBody, c)) {
                      parser.attribName += c
                    } else {
                      strictFail(parser, 'Invalid attribute name')
                    }
                    continue

                  case S.ATTRIB_NAME_SAW_WHITE:
                    if (c === '=') {
                      parser.state = S.ATTRIB_VALUE
                    } else if (isWhitespace(c)) {
                      continue
                    } else {
                      strictFail(parser, 'Attribute without value')
                      parser.tag.attributes[parser.attribName] = ''
                      parser.attribValue = ''
                      emitNode(parser, 'onattribute', {
                        name: parser.attribName,
                        value: ''
                      })
                      parser.attribName = ''
                      if (c === '>') {
                        openTag(parser)
                      } else if (isMatch(nameStart, c)) {
                        parser.attribName = c
                        parser.state = S.ATTRIB_NAME
                      } else {
                        strictFail(parser, 'Invalid attribute name')
                        parser.state = S.ATTRIB
                      }
                    }
                    continue

                  case S.ATTRIB_VALUE:
                    if (isWhitespace(c)) {
                      continue
                    } else if (isQuote(c)) {
                      parser.q = c
                      parser.state = S.ATTRIB_VALUE_QUOTED
                    } else {
                      strictFail(parser, 'Unquoted attribute value')
                      parser.state = S.ATTRIB_VALUE_UNQUOTED
                      parser.attribValue = c
                    }
                    continue

                  case S.ATTRIB_VALUE_QUOTED:
                    if (c !== parser.q) {
                      if (c === '&') {
                        parser.state = S.ATTRIB_VALUE_ENTITY_Q
                      } else {
                        parser.attribValue += c
                      }
                      continue
                    }
                    attrib(parser)
                    parser.q = ''
                    parser.state = S.ATTRIB_VALUE_CLOSED
                    continue

                  case S.ATTRIB_VALUE_CLOSED:
                    if (isWhitespace(c)) {
                      parser.state = S.ATTRIB
                    } else if (c === '>') {
                      openTag(parser)
                    } else if (c === '/') {
                      parser.state = S.OPEN_TAG_SLASH
                    } else if (isMatch(nameStart, c)) {
                      strictFail(parser, 'No whitespace between attributes')
                      parser.attribName = c
                      parser.attribValue = ''
                      parser.state = S.ATTRIB_NAME
                    } else {
                      strictFail(parser, 'Invalid attribute name')
                    }
                    continue

                  case S.ATTRIB_VALUE_UNQUOTED:
                    if (!isAttribEnd(c)) {
                      if (c === '&') {
                        parser.state = S.ATTRIB_VALUE_ENTITY_U
                      } else {
                        parser.attribValue += c
                      }
                      continue
                    }
                    attrib(parser)
                    if (c === '>') {
                      openTag(parser)
                    } else {
                      parser.state = S.ATTRIB
                    }
                    continue

                  case S.CLOSE_TAG:
                    if (!parser.tagName) {
                      if (isWhitespace(c)) {
                        continue
                      } else if (notMatch(nameStart, c)) {
                        if (parser.script) {
                          parser.script += '</' + c
                          parser.state = S.SCRIPT
                        } else {
                          strictFail(parser, 'Invalid tagname in closing tag.')
                        }
                      } else {
                        parser.tagName = c
                      }
                    } else if (c === '>') {
                      closeTag(parser)
                    } else if (isMatch(nameBody, c)) {
                      parser.tagName += c
                    } else if (parser.script) {
                      parser.script += '</' + parser.tagName
                      parser.tagName = ''
                      parser.state = S.SCRIPT
                    } else {
                      if (!isWhitespace(c)) {
                        strictFail(parser, 'Invalid tagname in closing tag')
                      }
                      parser.state = S.CLOSE_TAG_SAW_WHITE
                    }
                    continue

                  case S.CLOSE_TAG_SAW_WHITE:
                    if (isWhitespace(c)) {
                      continue
                    }
                    if (c === '>') {
                      closeTag(parser)
                    } else {
                      strictFail(parser, 'Invalid characters in closing tag')
                    }
                    continue

                  case S.TEXT_ENTITY:
                  case S.ATTRIB_VALUE_ENTITY_Q:
                  case S.ATTRIB_VALUE_ENTITY_U:
                    var returnState
                    var buffer
                    switch (parser.state) {
                      case S.TEXT_ENTITY:
                        returnState = S.TEXT
                        buffer = 'textNode'
                        break

                      case S.ATTRIB_VALUE_ENTITY_Q:
                        returnState = S.ATTRIB_VALUE_QUOTED
                        buffer = 'attribValue'
                        break

                      case S.ATTRIB_VALUE_ENTITY_U:
                        returnState = S.ATTRIB_VALUE_UNQUOTED
                        buffer = 'attribValue'
                        break
                    }

                    if (c === ';') {
                      parser[buffer] += parseEntity(parser)
                      parser.entity = ''
                      parser.state = returnState
                    } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                      parser.entity += c
                    } else {
                      strictFail(parser, 'Invalid character in entity name')
                      parser[buffer] += '&' + parser.entity + c
                      parser.entity = ''
                      parser.state = returnState
                    }

                    continue

                  default:
                    throw new Error(parser, 'Unknown state: ' + parser.state)
                }
              } // while

              if (parser.position >= parser.bufferCheckPosition) {
                checkBufferLength(parser)
              }
              return parser
            }

            /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
            /* istanbul ignore next */
            if (!String.fromCodePoint) {
              (function () {
                var stringFromCharCode = String.fromCharCode
                var floor = Math.floor
                var fromCodePoint = function () {
                  var MAX_SIZE = 0x4000
                  var codeUnits = []
                  var highSurrogate
                  var lowSurrogate
                  var index = -1
                  var length = arguments.length
                  if (!length) {
                    return ''
                  }
                  var result = ''
                  while (++index < length) {
                    var codePoint = Number(arguments[index])
                    if (
                      !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
                      codePoint < 0 || // not a valid Unicode code point
                      codePoint > 0x10FFFF || // not a valid Unicode code point
                      floor(codePoint) !== codePoint // not an integer
                    ) {
                      throw RangeError('Invalid code point: ' + codePoint)
                    }
                    if (codePoint <= 0xFFFF) { // BMP code point
                      codeUnits.push(codePoint)
                    } else { // Astral code point; split in surrogate halves
                      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                      codePoint -= 0x10000
                      highSurrogate = (codePoint >> 10) + 0xD800
                      lowSurrogate = (codePoint % 0x400) + 0xDC00
                      codeUnits.push(highSurrogate, lowSurrogate)
                    }
                    if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                      result += stringFromCharCode.apply(null, codeUnits)
                      codeUnits.length = 0
                    }
                  }
                  return result
                }
                /* istanbul ignore next */
                if (Object.defineProperty) {
                  Object.defineProperty(String, 'fromCodePoint', {
                    value: fromCodePoint,
                    configurable: true,
                    writable: true
                  })
                } else {
                  String.fromCodePoint = fromCodePoint
                }
              }())
            }
          })(typeof exports === 'undefined' ? this.sax = {} : exports)

        }).call(this)
      }).call(this, require("buffer").Buffer)
    }, { "buffer": 106, "stream": 130, "string_decoder": 131 }], 130: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      module.exports = Stream;

      var EE = require('events').EventEmitter;
      var inherits = require('inherits');

      inherits(Stream, EE);
      Stream.Readable = require('readable-stream/readable.js');
      Stream.Writable = require('readable-stream/writable.js');
      Stream.Duplex = require('readable-stream/duplex.js');
      Stream.Transform = require('readable-stream/transform.js');
      Stream.PassThrough = require('readable-stream/passthrough.js');

      // Backwards-compat with node 0.4.x
      Stream.Stream = Stream;



      // old-style streams.  Note that the pipe method (the only relevant
      // part of this class) is overridden in the Readable class.

      function Stream() {
        EE.call(this);
      }

      Stream.prototype.pipe = function (dest, options) {
        var source = this;

        function ondata(chunk) {
          if (dest.writable) {
            if (false === dest.write(chunk) && source.pause) {
              source.pause();
            }
          }
        }

        source.on('data', ondata);

        function ondrain() {
          if (source.readable && source.resume) {
            source.resume();
          }
        }

        dest.on('drain', ondrain);

        // If the 'end' option is not supplied, dest.end() will be called when
        // source gets the 'end' or 'close' events.  Only dest.end() once.
        if (!dest._isStdio && (!options || options.end !== false)) {
          source.on('end', onend);
          source.on('close', onclose);
        }

        var didOnEnd = false;
        function onend() {
          if (didOnEnd) return;
          didOnEnd = true;

          dest.end();
        }


        function onclose() {
          if (didOnEnd) return;
          didOnEnd = true;

          if (typeof dest.destroy === 'function') dest.destroy();
        }

        // don't leave dangling pipes when there are errors.
        function onerror(er) {
          cleanup();
          if (EE.listenerCount(this, 'error') === 0) {
            throw er; // Unhandled stream error in pipe.
          }
        }

        source.on('error', onerror);
        dest.on('error', onerror);

        // remove all the event listeners that were added.
        function cleanup() {
          source.removeListener('data', ondata);
          dest.removeListener('drain', ondrain);

          source.removeListener('end', onend);
          source.removeListener('close', onclose);

          source.removeListener('error', onerror);
          dest.removeListener('error', onerror);

          source.removeListener('end', cleanup);
          source.removeListener('close', cleanup);

          dest.removeListener('close', cleanup);
        }

        source.on('end', cleanup);
        source.on('close', cleanup);

        dest.on('close', cleanup);

        dest.emit('pipe', source);

        // Allow for unix-like usage: A.pipe(B).pipe(C)
        return dest;
      };

    }, { "events": 108, "inherits": 110, "readable-stream/duplex.js": 114, "readable-stream/passthrough.js": 125, "readable-stream/readable.js": 126, "readable-stream/transform.js": 127, "readable-stream/writable.js": 128 }], 131: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      var Buffer = require('buffer').Buffer;

      var isBufferEncoding = Buffer.isEncoding
        || function (encoding) {
          switch (encoding && encoding.toLowerCase()) {
            case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
            default: return false;
          }
        }


      function assertEncoding(encoding) {
        if (encoding && !isBufferEncoding(encoding)) {
          throw new Error('Unknown encoding: ' + encoding);
        }
      }

      // StringDecoder provides an interface for efficiently splitting a series of
      // buffers into a series of JS strings without breaking apart multi-byte
      // characters. CESU-8 is handled as part of the UTF-8 encoding.
      //
      // @TODO Handling all encodings inside a single object makes it very difficult
      // to reason about this code, so it should be split up in the future.
      // @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
      // points as used by CESU-8.
      var StringDecoder = exports.StringDecoder = function (encoding) {
        this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
        assertEncoding(encoding);
        switch (this.encoding) {
          case 'utf8':
            // CESU-8 represents each of Surrogate Pair by 3-bytes
            this.surrogateSize = 3;
            break;
          case 'ucs2':
          case 'utf16le':
            // UTF-16 represents each of Surrogate Pair by 2-bytes
            this.surrogateSize = 2;
            this.detectIncompleteChar = utf16DetectIncompleteChar;
            break;
          case 'base64':
            // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
            this.surrogateSize = 3;
            this.detectIncompleteChar = base64DetectIncompleteChar;
            break;
          default:
            this.write = passThroughWrite;
            return;
        }

        // Enough space to store all bytes of a single character. UTF-8 needs 4
        // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
        this.charBuffer = new Buffer(6);
        // Number of bytes received for the current incomplete multi-byte character.
        this.charReceived = 0;
        // Number of bytes expected for the current incomplete multi-byte character.
        this.charLength = 0;
      };


      // write decodes the given buffer and returns it as JS string that is
      // guaranteed to not contain any partial multi-byte characters. Any partial
      // character found at the end of the buffer is buffered up, and will be
      // returned when calling write again with the remaining bytes.
      //
      // Note: Converting a Buffer containing an orphan surrogate to a String
      // currently works, but converting a String to a Buffer (via `new Buffer`, or
      // Buffer#write) will replace incomplete surrogates with the unicode
      // replacement character. See https://codereview.chromium.org/121173009/ .
      StringDecoder.prototype.write = function (buffer) {
        var charStr = '';
        // if our last write ended with an incomplete multibyte character
        while (this.charLength) {
          // determine how many remaining bytes this buffer has to offer for this char
          var available = (buffer.length >= this.charLength - this.charReceived) ?
            this.charLength - this.charReceived :
            buffer.length;

          // add the new bytes to the char buffer
          buffer.copy(this.charBuffer, this.charReceived, 0, available);
          this.charReceived += available;

          if (this.charReceived < this.charLength) {
            // still not enough chars in this buffer? wait for more ...
            return '';
          }

          // remove bytes belonging to the current character from the buffer
          buffer = buffer.slice(available, buffer.length);

          // get the character that was split
          charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

          // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
          var charCode = charStr.charCodeAt(charStr.length - 1);
          if (charCode >= 0xD800 && charCode <= 0xDBFF) {
            this.charLength += this.surrogateSize;
            charStr = '';
            continue;
          }
          this.charReceived = this.charLength = 0;

          // if there are no more bytes in this buffer, just emit our char
          if (buffer.length === 0) {
            return charStr;
          }
          break;
        }

        // determine and set charLength / charReceived
        this.detectIncompleteChar(buffer);

        var end = buffer.length;
        if (this.charLength) {
          // buffer the incomplete character bytes we got
          buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
          end -= this.charReceived;
        }

        charStr += buffer.toString(this.encoding, 0, end);

        var end = charStr.length - 1;
        var charCode = charStr.charCodeAt(end);
        // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
        if (charCode >= 0xD800 && charCode <= 0xDBFF) {
          var size = this.surrogateSize;
          this.charLength += size;
          this.charReceived += size;
          this.charBuffer.copy(this.charBuffer, size, 0, size);
          buffer.copy(this.charBuffer, 0, 0, size);
          return charStr.substring(0, end);
        }

        // or just emit the charStr
        return charStr;
      };

      // detectIncompleteChar determines if there is an incomplete UTF-8 character at
      // the end of the given buffer. If so, it sets this.charLength to the byte
      // length that character, and sets this.charReceived to the number of bytes
      // that are available for this character.
      StringDecoder.prototype.detectIncompleteChar = function (buffer) {
        // determine how many bytes we have to check at the end of this buffer
        var i = (buffer.length >= 3) ? 3 : buffer.length;

        // Figure out if one of the last i bytes of our buffer announces an
        // incomplete char.
        for (; i > 0; i--) {
          var c = buffer[buffer.length - i];

          // See http://en.wikipedia.org/wiki/UTF-8#Description

          // 110XXXXX
          if (i == 1 && c >> 5 == 0x06) {
            this.charLength = 2;
            break;
          }

          // 1110XXXX
          if (i <= 2 && c >> 4 == 0x0E) {
            this.charLength = 3;
            break;
          }

          // 11110XXX
          if (i <= 3 && c >> 3 == 0x1E) {
            this.charLength = 4;
            break;
          }
        }
        this.charReceived = i;
      };

      StringDecoder.prototype.end = function (buffer) {
        var res = '';
        if (buffer && buffer.length)
          res = this.write(buffer);

        if (this.charReceived) {
          var cr = this.charReceived;
          var buf = this.charBuffer;
          var enc = this.encoding;
          res += buf.slice(0, cr).toString(enc);
        }

        return res;
      };

      function passThroughWrite(buffer) {
        return buffer.toString(this.encoding);
      }

      function utf16DetectIncompleteChar(buffer) {
        this.charReceived = buffer.length % 2;
        this.charLength = this.charReceived ? 2 : 0;
      }

      function base64DetectIncompleteChar(buffer) {
        this.charReceived = buffer.length % 3;
        this.charLength = this.charReceived ? 3 : 0;
      }

    }, { "buffer": 106 }], 132: [function (require, module, exports) {
      (function (setImmediate, clearImmediate) {
        (function () {
          var nextTick = require('process/browser.js').nextTick;
          var apply = Function.prototype.apply;
          var slice = Array.prototype.slice;
          var immediateIds = {};
          var nextImmediateId = 0;

          // DOM APIs, for completeness

          exports.setTimeout = function () {
            return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
          };
          exports.setInterval = function () {
            return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
          };
          exports.clearTimeout =
            exports.clearInterval = function (timeout) { timeout.close(); };

          function Timeout(id, clearFn) {
            this._id = id;
            this._clearFn = clearFn;
          }
          Timeout.prototype.unref = Timeout.prototype.ref = function () { };
          Timeout.prototype.close = function () {
            this._clearFn.call(window, this._id);
          };

          // Does not start the time, just sets up the members needed.
          exports.enroll = function (item, msecs) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = msecs;
          };

          exports.unenroll = function (item) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = -1;
          };

          exports._unrefActive = exports.active = function (item) {
            clearTimeout(item._idleTimeoutId);

            var msecs = item._idleTimeout;
            if (msecs >= 0) {
              item._idleTimeoutId = setTimeout(function onTimeout() {
                if (item._onTimeout)
                  item._onTimeout();
              }, msecs);
            }
          };

          // That's not how node.js implements it but the exposed api is the same.
          exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
            var id = nextImmediateId++;
            var args = arguments.length < 2 ? false : slice.call(arguments, 1);

            immediateIds[id] = true;

            nextTick(function onNextTick() {
              if (immediateIds[id]) {
                // fn.call() is faster so we optimize for the common use-case
                // @see http://jsperf.com/call-apply-segu
                if (args) {
                  fn.apply(null, args);
                } else {
                  fn.call(null);
                }
                // Prevent ids from leaking
                exports.clearImmediate(id);
              }
            });

            return id;
          };

          exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
            delete immediateIds[id];
          };
        }).call(this)
      }).call(this, require("timers").setImmediate, require("timers").clearImmediate)
    }, { "process/browser.js": 113, "timers": 132 }], 133: [function (require, module, exports) {
      (function (global) {
        (function () {

          /**
           * Module exports.
           */

          module.exports = deprecate;

          /**
           * Mark that a method should not be used.
           * Returns a modified function which warns once by default.
           *
           * If `localStorage.noDeprecation = true` is set, then it is a no-op.
           *
           * If `localStorage.throwDeprecation = true` is set, then deprecated functions
           * will throw an Error when invoked.
           *
           * If `localStorage.traceDeprecation = true` is set, then deprecated functions
           * will invoke `console.trace()` instead of `console.error()`.
           *
           * @param {Function} fn - the function to deprecate
           * @param {String} msg - the string to print to the console when `fn` is invoked
           * @returns {Function} a new "deprecated" version of `fn`
           * @api public
           */

          function deprecate(fn, msg) {
            if (config('noDeprecation')) {
              return fn;
            }

            var warned = false;
            function deprecated() {
              if (!warned) {
                if (config('throwDeprecation')) {
                  throw new Error(msg);
                } else if (config('traceDeprecation')) {
                  console.trace(msg);
                } else {
                  console.warn(msg);
                }
                warned = true;
              }
              return fn.apply(this, arguments);
            }

            return deprecated;
          }

          /**
           * Checks `localStorage` for boolean values for the given `name`.
           *
           * @param {String} name
           * @returns {Boolean}
           * @api private
           */

          function config(name) {
            // accessing global.localStorage can trigger a DOMException in sandboxed iframes
            try {
              if (!global.localStorage) return false;
            } catch (_) {
              return false;
            }
            var val = global.localStorage[name];
            if (null == val) return false;
            return String(val).toLowerCase() === 'true';
          }

        }).call(this)
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}], 134: [function (require, module, exports) {
      const { CSG, CAG } = require('@jscad/csg');
      const { toArray } = require('../utils/misc');
      const { isCSG, isCAG } = require('./utils');

      // FIXME: is there not too much overlap with convertToBlob ?
      /**
       * convert objects to a single solid
       * @param {Array} objects the list of objects
       * @return {Object} solid : the single CSG object
       */
      function convertToSolid(objects, params) {
        if (objects.length === undefined) {
          if (objects instanceof CAG || objects instanceof CSG) {
            var obj = objects;
            objects = [obj];
          } else {
            throw new Error('Cannot convert object (' + typeof objects + ') to solid');
          }
        }

        var solid = null;
        for (var i = 0; i < objects.length; i++) {
          let obj = objects[i];
          if (obj instanceof CAG) {
            obj = obj.extrude({ offset: [0, 0, 0.1] }); // convert CAG to a thin solid CSG
          }
          if (solid !== null) {
            solid = solid.unionForNonIntersecting(obj);
          } else {
            solid = obj;
          }
        }
        return solid;
      }

      function convertToSolid2(objects, params) {
        const { convertCSG, convertCAG } = params;

        let object;
        objects = toArray(objects);
        // review the given objects
        let foundCSG = false;
        let foundCAG = false;
        for (let i = 0; i < objects.length; i++) {
          if (isCSG(objects[i])) {
            foundCSG = true;
          }
          if (isCAG(objects[i])) {
            foundCAG = true;
          }
        }

        // convert based on the given format
        foundCSG = foundCSG && convertCSG;
        foundCAG = foundCAG && convertCAG;

        if (foundCSG && foundCAG) {
          foundCAG = false;
        } // use 3D conversion

        object = !foundCSG ? new CAG() : new CSG();

        for (let i = 0; i < objects.length; i++) {
          if (foundCSG === true && objects[i] instanceof CAG) {
            object = object.union(objects[i].extrude({ offset: [0, 0, 0.1] })); // convert CAG to a thin solid CSG
            continue;
          }
          if (foundCAG === true && objects[i] instanceof CSG) {
            continue;
          }
          object = object.union(objects[i]);
        }

        return object;
      }

      module.exports = {
        convertToSolid,
        convertToSolid2
      };

    }, { "../utils/misc": 139, "./utils": 136, "@jscad/csg": 1 }], 135: [function (require, module, exports) {
      /**
       * Create an function for processing the JSCAD script into CSG/CAG objects
       * @param {String} script the script
       * @param {Object} globals the globals to use when evaluating the script: these are not ..
       * ...ACTUAL globals, merely functions/ variable accessible AS IF they were globals !
       */
      function createJscadFunction(script, globals) {
        // console.log('globals', globals)
        // not a fan of this, we have way too many explicit api elements
        let globalsList = '';
        // each top key is a library ie : openscad helpers etc
        // one level below that is the list of libs
        // last level is the actual function we want to export to 'local' scope
        Object.keys(globals).forEach(function (libKey) {
          const lib = globals[libKey];
          // console.log(`lib:${libKey}: ${lib}`)
          Object.keys(lib).forEach(function (libItemKey) {
            const libItems = lib[libItemKey];
            // console.log('libItems', libItems)
            Object.keys(libItems).forEach(function (toExposeKey) {
              // console.log('toExpose',toExpose )
              const text = `const ${toExposeKey} = globals['${libKey}']['${libItemKey}']['${toExposeKey}']
`;
              globalsList += text;
            });
          });
        });

        const source = `// SYNC WORKER
    ${globalsList}

    //user defined script(s)
    ${script}

    if (typeof (main) !== 'function') {
      throw new Error('The JSCAD script must contain a function main() which returns one or more CSG or CAG solids.')
    }

    return main(params)
  `;

        var f = new Function('params', 'include', 'globals', source);
        return f;
      }

      module.exports = createJscadFunction;

    }, {}], 136: [function (require, module, exports) {
      function isCAG(object) {
        // objects[i] instanceof CAG => NOT RELIABLE
        // 'instanceof' causes huge issues when using objects from
        // two different versions of CSG.js as they are not reckonized as one and the same
        // so DO NOT use instanceof to detect matching types for CSG/CAG
        if (!('sides' in object)) {
          return false;
        }
        if (!object.sides.length) {
          return false;
        }

        return true;
      }

      function isCSG(object) {
        // objects[i] instanceof CSG => NOT RELIABLE
        // 'instanceof' causes huge issues when using objects from
        // two different versions of CSG.js as they are not reckonized as one and the same
        // so DO NOT use instanceof to detect matching types for CSG/CAG
        if (!('polygons' in object)) {
          return false;
        }
        if (!object.polygons.length) {
          return false;
        }
        return true;
      }

      module.exports = {
        isCSG,
        isCAG
      };

    }, {}], 137: [function (require, module, exports) {
      const { CSG, CAG } = require('@jscad/csg');

      // handled format descriptions
      const formats = {
        stl: {
          displayName: 'STL (Binary)',
          description: 'STereoLithography, Binary',
          extension: 'stl',
          mimetype: 'application/sla',
          convertCSG: true,
          convertCAG: false
        },
        stla: {
          displayName: 'STL (ASCII)',
          description: 'STereoLithography, ASCII',
          extension: 'stl',
          mimetype: 'application/sla',
          convertCSG: true,
          convertCAG: false
        },
        stlb: {
          displayName: 'STL (Binary)',
          description: 'STereoLithography, Binary',
          extension: 'stl',
          mimetype: 'application/sla',
          convertCSG: true,
          convertCAG: false
        },

        amf: {
          displayName: 'AMF (experimental)',
          description: 'Additive Manufacturing File Format',
          extension: 'amf',
          mimetype: 'application/amf+xml',
          convertCSG: true,
          convertCAG: false
        },
        x3d: {
          displayName: 'X3D',
          description: 'X3D File Format',
          extension: 'x3d',
          mimetype: 'model/x3d+xml',
          convertCSG: true,
          convertCAG: false
        },
        dxf: {
          displayName: 'DXF',
          description: 'AutoCAD Drawing Exchange Format',
          extension: 'dxf',
          mimetype: 'application/dxf',
          convertCSG: false,
          convertCAG: true
        },
        jscad: {
          displayName: 'JSCAD',
          description: 'OpenJSCAD.org Source',
          extension: 'jscad',
          mimetype: 'application/javascript',
          convertCSG: true,
          convertCAG: true
        },
        js: {
          displayName: 'js',
          description: 'JavaScript Source',
          extension: 'js',
          mimetype: 'application/javascript',
          convertCSG: true,
          convertCAG: true
        },
        svg: {
          displayName: 'SVG',
          description: 'Scalable Vector Graphics Format',
          extension: 'svg',
          mimetype: 'image/svg+xml',
          convertCSG: false,
          convertCAG: true
        },
        gcode: {
          displayName: 'gcode',
          description: 'G Programming Language File Format'
        },
        json: {
          displayName: 'json',
          description: 'JavaScript Object Notation Format'
        }

        // handled input formats
      }; const conversionFormats = [
        // 3D file formats
        'amf', 'gcode', 'js', 'jscad', 'obj', 'scad', 'stl',
        // 2D file formats
        'svg'];

      function supportedFormatsForObjects(objects) {
        let objectFormats = [];
        let foundCSG = false;
        let foundCAG = false;
        for (let i = 0; i < objects.length; i++) {
          if (objects[i] instanceof CSG) {
            foundCSG = true;
          }
          if (objects[i] instanceof CAG) {
            foundCAG = true;
          }
        }
        for (let format in formats) {
          if (foundCSG && formats[format].convertCSG === true) {
            objectFormats[objectFormats.length] = format;
            continue; // only add once
          }
          if (foundCAG && formats[format].convertCAG === true) {
            objectFormats[objectFormats.length] = format;
          }
        }
        return objectFormats;
      }

      module.exports = {
        formats,
        conversionFormats,
        supportedFormatsForObjects
      };

    }, { "@jscad/csg": 1 }], 138: [function (require, module, exports) {
      const { formats } = require('./formats');
      const { convertToSolid2 } = require('../core/convertToSolid');

      const { stlSerializer } = require('@jscad/io');
      const { amfSerializer } = require('@jscad/io');
      const { x3dSerializer } = require('@jscad/io');
      const { svgSerializer } = require('@jscad/io');
      const { jsonSerializer } = require('@jscad/io');
      const { dxfSerializer } = require('@jscad/io');

      function prepareOutput(objects, params) {
        const { format, version = '0.0.0' } = params;

        let object;

        if (format === 'jscad' || format === 'js') {
          object = objects;
        } else {
          const formatInfo = formats[format];
          object = convertToSolid2(objects, formatInfo);
        }

        const metaData = {
          producer: 'OpenJSCAD.org ' + version,
          date: new Date(),
          version
        };

        const outputFormatHandlers = {
          amf: amfSerializer, // CSG to AMF
          stl: stlSerializer, // CSG to STL ASCII // NOTE: now using binary output by default !!
          stla: {
            mimeType: stlSerializer.mimeType,
            serialize: data => stlSerializer.serialize(data, { binary: false })
          }, // CSG to STL ASCII
          stlb: stlSerializer, // CSG to STL BINARY
          dxf: dxfSerializer, // CAG to DXF
          svg: svgSerializer, // CAG to SVG
          x3d: x3dSerializer, // CSG to X3D
          json: jsonSerializer, // CSG or CAG to JSON
          js: {
            mimeType: formats['js'].mimetype,
            serialize: object => [object] // js , pass through
          },
          jscad: {
            mimeType: formats['jscad'].mimetype,
            serialize: object => [object] // jscad , pass through
          },
          undefined: () => {
            throw new Error('Not supported : only jscad, stl, amf, dxf, svg or json as output format');
          }
        };
        const data = outputFormatHandlers[format].serialize(object, metaData);
        const mimeType = outputFormatHandlers[format].mimeType;
        return { data, mimeType };
      }

      module.exports = {
        prepareOutput
      };

    }, { "../core/convertToSolid": 134, "./formats": 137, "@jscad/io": 41 }], 139: [function (require, module, exports) {
      /* converts input data to array if it is not already an array */
      function toArray(data) {
        if (!data) return [];
        if (data.constructor !== Array) return [data];
        return data;
      }

      module.exports = { toArray };

    }, {}], 140: [function (require, module, exports) {
      // Worker-friendly conversion API: evaluate JSCAD source and serialize to desired format
      // No DOM or window usage; safe for Web Workers and Node

      const oscad = require('@jscad/scad-api');
      const createJscadFunction = require('../core/jscad-function');
      const { toArray } = require('../utils/misc');
      const { prepareOutput } = require('../io/prepareOutput');

      /**
       * Evaluate JSCAD source to CSG/CAG objects without using the DOM
       * @param {string} source JSCAD program text
       * @param {object} parameters Parameter values for the program
       * @param {object} options { implicitGlobals?: boolean }
       * @returns {Array} Array of CSG/CAG objects
       */
      function evaluateJscad(source, parameters = {}, options = {}) {
        const { implicitGlobals = true } = options;
        const globals = implicitGlobals ? { oscad } : {};
        const include = x => x; // include is a no-op in this minimal worker variant
        const func = createJscadFunction(source, globals);

        let objects = func(parameters, include, globals);
        objects = toArray(objects);
        if (!objects || objects.length === 0) {
          throw new Error('The JSCAD script must return one or more CSG or CAG solids.');
        }
        return objects;
      }

      /**
       * Convert JSCAD source to a serialized output (e.g., STL ascii/binary)
       * @param {object} opts
       * @param {string} opts.source JSCAD program text
       * @param {object} [opts.parameters] Parameter values for the program
       * @param {string} opts.format One of: 'stl' | 'stla' | 'stlb' | 'amf' | 'x3d' | 'dxf' | 'svg' | 'json' | 'js' | 'jscad'
       * @param {object} [opts.options] { implicitGlobals?: boolean }
       * @returns {{ data: any[], mimeType: string }} Serializable pieces and mime type
       */
      function convert({ source, parameters = {}, format = 'stlb', options = {} }) {
        const objects = evaluateJscad(source, parameters, options);
        // prepareOutput returns { data, mimeType } using @jscad/io serializers
        return prepareOutput(objects, { format });
      }

      module.exports = {
        evaluateJscad,
        convert
      };

    }, { "../core/jscad-function": 135, "../io/prepareOutput": 138, "../utils/misc": 139, "@jscad/scad-api": 83 }]
  }, {}, [140])(140)
});
