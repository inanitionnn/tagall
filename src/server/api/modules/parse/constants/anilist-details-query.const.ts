export const ANILIST_DETAILS_QUERY = `
query ($mediaId: Int) {
    Media(id: $mediaId) {
        id
        title {
            english
            romaji
        }
        coverImage {
            extraLarge
        }
        genres
        volumes
        tags {
            name
        }
        description
        startDate {
            year
        }
        chapters
        staff {
            nodes {
                name {
                    full
                }
            }
        }
    }
}`;
