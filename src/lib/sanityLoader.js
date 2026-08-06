import { createQueryStore } from '@sanity/react-loader'
import { client } from './sanity'

// A query store bound to our Sanity client. Imported only by LiveContent, which
// is lazy-loaded and mounted only inside the Presentation iframe — so react-loader
// never reaches the main bundle that normal visitors download.
const store = createQueryStore({ client: client || false })

export const useQuery = store.useQuery
export const useLiveMode = store.useLiveMode
