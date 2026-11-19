// Corpus footprint injected through the app's injection evaluator. It places
// one pad on the parametric net so tests can check custom placement and nets.
module.exports = {
  params: {
    designator: 'P',
    net: undefined,
  },
  body: (p) =>
    `(footprint "corpus:probe_pad" (layer "F.Cu") ${p.at} (property "Reference" "${p.ref}" (at 0 0) (layer "F.SilkS")) (pad "1" smd rect (at 0 0 ${p.r}) (size 1 1) (layers "F.Cu") ${p.net.str}))`,
};
