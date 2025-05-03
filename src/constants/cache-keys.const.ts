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
    getNearestItems: {
      input: true,
    },
    getYearsRange: {
      userId: true,
      input: true,
    },
    searchItemByText: {
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
    getItemDetailFields: {
      input: true,
    },
  },
  parse: {
    search: {
      userId: true,
      input: true,
    },
    regrex: {
      userId: true,
      input: true,
    },
  },
  tag: {
    getUserTags: {
      userId: true,
    },
  },
  comment: {
    getUserComments: {
      userId: true,
      input: true,
    },
  },
  user: {
    getUser: {
      userId: true,
    },
  },
} as const;
