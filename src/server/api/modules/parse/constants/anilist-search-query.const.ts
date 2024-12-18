export const ANILIST_SEARCH_QUERY = `
query ($search: String!, $type: MediaType, $perPage: Int) {
    Page (perPage: $perPage) {
        media(search: $search, type: $type) {
            id
            title {
                english
                romaji
            }
            coverImage {
                medium
            }
            genres
            tags {
                name
            }
            description
            status
            countryOfOrigin
            startDate {
                year
            }
            staff {
                nodes {
                    name {
                        full
                    }
                }
            }
        }
    }
}`;
