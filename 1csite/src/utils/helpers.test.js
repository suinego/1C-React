import { sortBy, formatDateISO, generateId } from "./helpers";

describe("helpers", () => {
  test("sortBy by date orders newest first", () => {
    const items = [
      { id: 1, createdAt: "2025-01-01" },
      { id: 2, createdAt: "2026-01-05" },
      { id: 3, createdAt: "2024-06-21" },
    ];
    const sorted = sortBy(items, "date");
    expect(sorted.map((i) => i.id)).toEqual([2, 1, 3]);
  });

  test("sortBy лайки", () => {
    const items = [
      { id: 1, likes: 2 },
      { id: 2, likes: 10 },
      { id: 3, currentLikes: 5 },
    ];
    const sorted = sortBy(items, "likes");
    expect(sorted.map((i) => i.id)).toEqual([2, 3, 1]);
  });


  test("generateId использование Date.now", () => {
    const realNow = Date.now;
    Date.now = () => 1234567890;
    expect(generateId("x")).toBe("x_1234567890");
    Date.now = realNow;
  });
});
