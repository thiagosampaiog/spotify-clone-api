import { Status } from './enums'

export const MONGO_ERRORS = {
  DUPLICATE_KEY: 11000
}

export const ACTIVE_FILTER = {
  status: { $nin: [Status.BANNED, Status.DELETED] }
}

export const PLAYLIST_LITE_SELECT = 'id name totalTracks user'

export const PLAYLIST_DETAIL_SELECT = '-__v -createdAt -updatedAt -deletedAt'

export const TRACK_LITE_SELECT = 'id name durationMs imageUrl album artists'

export const TRACK_DETAIL_SELECT = '-__v -createdAt -updatedAt -deletedAt'

export const ALBUM_LITE_SELECT = 'id name imageUrl artist'

export const ALBUM_DETAIL_SELECT = '-__v -createdAt -updatedAt -deletedAt'

export const ARTIST_DETAIL_SELECT = '-__v -createdAt -updatedAt -deletedAt'

export const ARTIST_LITE_SELECT = 'id name imageUrl'

export const USER_LITE_SELECT = 'id name imageUrl'

export const USER_DETAIL_SELECT = '-__v -createdAt -updatedAt -status -deletedAt'

export const POPULATE_SELECT = '-__v -status -createdAt -updatedAt -deletedAt'
