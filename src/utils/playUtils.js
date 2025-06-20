export function getCurrentState(players, routes, notes, name, tags) {
  return {
    players: structuredClone(players),
    routes: structuredClone(routes),
    notes: structuredClone(notes),
    name,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
  };
}
