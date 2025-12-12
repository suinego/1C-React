export function sortBy(items = [], sortBy = "date") {
  const arr = Array.isArray(items) ? [...items] : [];
  if (sortBy === "date") {
    return arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
  if (sortBy === "likes") {
    return arr.sort((a, b) => (b.currentLikes || b.likes || 0) - (a.currentLikes || a.likes || 0));
  }
  return arr;
}

export function formatDateISO(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}`;
}

export default { sortBy, formatDateISO, generateId };
