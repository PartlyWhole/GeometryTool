import { type Board, type Selection, edge, endpoints } from "./model";
import { constraintPoints } from "./solver";
import { rotateArm, scalar } from "./actions";

export function relatedPointIds(b: Board, s: Selection) {
  const ids = new Set(s.points);
  s.segments.forEach((r) => endpoints(b, r)?.forEach((p) => ids.add(p.id)));
  s.angles.forEach((a) =>
    constraintPoints(b, {
      id: "selection",
      kind: "angle",
      angle: a,
      value: 0,
      input: "",
    }).forEach((id) => ids.add(id)),
  );
  const links = [
    ...b.edges.map((e) => [e.a, e.b]),
    ...b.constraints.map((c) => constraintPoints(b, c)),
    ...b.points.flatMap((p) => {
      const hosts = p.crossing || (p.on ? [p.on.edge] : []);
      return hosts.map((id) => {
        const e = edge(b, id);
        return e ? [p.id, e.a, e.b] : [p.id];
      });
    }),
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const link of links)
      if (link.some((id) => ids.has(id)))
        for (const id of link)
          if (!ids.has(id)) {
            ids.add(id);
            changed = true;
          }
  }
  return ids;
}
export function editConstraintValue(b: Board, id: string, text: string) {
  const c = b.constraints.find((c) => c.id === id);
  if (!c) throw Error("This relationship no longer exists.");
  const value = scalar(text);
  if (c.kind === "length") {
    if (value <= 0) throw Error("Enter a positive length.");
    c.value = value * 50;
  } else if (c.kind === "angle") {
    if (value <= 0 || value > 360 || (value === 360 && !c.angle.full))
      throw Error("Enter a valid angle measure between 0° and 360°.");
    rotateArm(b, c.angle, value);
    c.value = value;
    c.input = text;
  } else if (c.kind === "sumAngle") {
    if (value <= 0 || value > 360 * c.angles.length)
      throw Error("Enter a valid positive angle sum.");
    c.value = value;
  }
}
