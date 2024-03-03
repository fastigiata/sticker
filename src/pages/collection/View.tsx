import type { LoaderFunctionArgs } from 'react-router-dom'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { CollectionDB } from '@/db/collection.ts'
import { StickerDB } from '@/db/sticker.ts'
import type { ISticker } from '@/_types/sticker.ts'
import { DeferView } from '@/components/Loading.tsx'
import { AwesomeScrollbar } from '@/components/AwesomeScrollbar'
import type { ICollection } from '@/_types/collection.ts'
import { ExceptionView } from '@/components/ExceptionView.tsx'
import { ActionButton } from '@/components/Button.tsx'
import { IconSetting } from '@/components/Icons.tsx'

type CollectionViewLoaderData = {
    task: Promise<[ ICollection | null, ISticker[] ]>
}

const ViewView = ({ collection, stickers }: {
    collection: ICollection,
    stickers: ISticker[]
}) => {
    const params = useParams()
    const navigate = useNavigate()

    const handleSetting = () => {
        navigate(`/collection/${params.collectionId}/modify`)
    }

    return (
        <div className={'w-full h-full p-4 flex flex-col items-start justify-start'}>
            <div className={'w-full mb-2 flex'}>
                <div className={'flex-1 space-y-2'}>
                    <div
                        className={'w-fit border-b-[1px] border-b-primary text-primary text-[18px] leading-[24px] font-primary'}>
                        {collection.name}
                    </div>
                    <div
                        className={'w-fit border-b-[1px] border-b-secondary text-secondary text-[14px] leading-[20px] font-secondary'}>
                        {collection.desc}
                    </div>
                </div>
                <ActionButton className={'ml-2 text-primary'} Icon={IconSetting} onClick={handleSetting}/>
            </div>
            <AwesomeScrollbar className={'w-full flex-1 bg-[#CCC]'}>
                // TODO: sticker list
            </AwesomeScrollbar>
        </div>
    )
}

const CollectionViewPage = () => {
    const loader = useLoaderData() as CollectionViewLoaderData

    return (
        <div className={'w-full h-full flex items-center justify-center'}>
            <DeferView
                source={loader.task}
                builder={([ collection, stickers ]) => {
                    if (!collection) {
                        return <ExceptionView text={
                            'Failed to load collection data, or it does not exist.'
                        }/>
                    }
                    return <ViewView collection={collection} stickers={stickers}/>
                }}/>
        </div>
    )
}

CollectionViewPage.loader = async ({ params }: LoaderFunctionArgs) => {
    const collectionId = params.collectionId!

    const task = Promise.all([
        CollectionDB.get(collectionId),
        StickerDB.list(collectionId)
    ])

    return { task } satisfies CollectionViewLoaderData
}

export default CollectionViewPage