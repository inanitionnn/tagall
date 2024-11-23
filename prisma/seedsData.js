export const seedsData = {
  collections: [
    {
      id: "cm3a9sw1v000gi1s7appi2tju",
      name: "Film",
      priority: 1,
    },
    {
      id: "cm3bnlve100000ks784yufzt9",
      name: "Serie",
      priority: 2,
    },
    {
      id: "cm3bnlxhu00020ks7hyps1g0a",
      name: "Book",
      priority: 3,
    },
    {
      id: "cm3bnlyzw00040ks77yx39ddf",
      name: "Manga",
      priority: 4,
    },
  ],
  fieldGroups: [
    {
      id: "cm3a9sm6c0008i1s7ekkm28ed",
      name: "people",
      priority: 5,
      isFiltering: true,
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9so0i000ai1s77en3aul5",
      name: "keyword",
      priority: 3,
      isFiltering: true,
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9sqbe000ci1s74wjod48c",
      name: "contentRating",
      priority: 2,
      isFiltering: true,
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9sse6000ei1s7cvwshatu",
      name: "production",
      priority: 4,
      isFiltering: true,
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3hvqbhn0000hxs7gckv6nyi",
      name: "runtime",
      priority: 1000,
      isFiltering: false,
      collections: ["cm3a9sw1v000gi1s7appi2tju"],
    },
  ],
};
