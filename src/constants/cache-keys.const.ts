export const CACHE_KEYS = {
  item: {
    getUserItems: {
      userId: true,
      input: true,
    },
    getUserItemsStats: {
      userId: true,
      input: true,
    },
    getUserItem: {
      userId: true,
      input: true,
    },
    getYearsRange: {
      userId: true,
      input: true,
    },
  },
  collection: {
    getAll: true,
    getUserCollections: {
      userId: true,
    },
  },
  field: {
    getFilterFields: {
      userId: true,
      input: true,
    },
  },
  parse: {
    search: {
      input: true,
    },
  },
  tag: {
    getUserTags: {
      userId: true,
    },
  },
  user: {
    getUser: {
      userId: true,
    },
  },
} as const;
