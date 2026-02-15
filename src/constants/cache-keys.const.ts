export const CACHE_KEYS = {
  item: {
    getUserItems: {
      userId: true,
      collectionsIds: true,
      filtering: true,
      sorting: true,
      page: true,
      limit: true,
      search: true,
      input: true,
    },
    getAllUserItems: {
      userId: true,
      collectionsIds: true,
      filtering: true,
      sorting: true,
      search: true,
      input: true,
    },
    getUserItemsStats: {
      userId: true,
      collectionsIds: true,
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
      collectionsIds: true,
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
      collectionsIds: true,
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
    imdbDetails: {
      parsedId: true,
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
