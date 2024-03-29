import type { RecordMeta } from '@/_types/shared.ts'

/**
 * definition of a sticker
 */
interface ISticker extends RecordMeta {
    /**
     * id of the collection that the sticker belongs to
     */
    cid: string
    /**
     * title of the sticker
     */
    title: string
    /**
     * content of the sticker
     */
    content: string
    /**
     * alarm time of the sticker, timestamp in milliseconds
     */
    alarm?: number | null
    /**
     * theme of the sticker, (0-6)
     */
    theme: number
}

export type {
    ISticker
}