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
      id: "cm3a9sgh40002i1s78gsg8y5y",
      name: "year",
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9si9x0004i1s7hnos3c86",
      name: "plot",
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9sm6c0008i1s7ekkm28ed",
      name: "people",
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9so0i000ai1s77en3aul5",
      name: "keyword",
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9sqbe000ci1s74wjod48c",
      name: "contentRating",
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3a9sse6000ei1s7cvwshatu",
      name: "production",
      collections: ["cm3a9sw1v000gi1s7appi2tju", "cm3bnlve100000ks784yufzt9"],
    },
    {
      id: "cm3hvqbhn0000hxs7gckv6nyi",
      name: "runtime",
      collections: ["cm3a9sw1v000gi1s7appi2tju"],
    },
  ],
};
