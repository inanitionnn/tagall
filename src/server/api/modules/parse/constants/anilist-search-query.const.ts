export const ANILIST_SEARCH_QUERY = `
query ($search: String!, $type: MediaType, $perPage: Int, $sort: [MediaSort], $genreNotIn: [String]) {
    Page (perPage: $perPage) {
        media(search: $search, type: $type, sort: $sort, genre_not_in: $genreNotIn) {
            id
            title {
                english
                romaji
            }
            coverImage {
                large
            }
            genres
            tags {
                name
            }
            description
            status
            volumes
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
