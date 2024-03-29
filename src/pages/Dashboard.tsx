import type { ActionFunctionArgs } from 'react-router-dom'
import { useNavigate, useRevalidator, useSubmit } from 'react-router-dom'
import { useLoaderData } from 'react-router-dom'
import { DeferView } from '@/components/Loading.tsx'
import { CollectionDB } from '@/db/collection.ts'
import type { ICollection } from '@/_types/collection.ts'
import { CollectionCard } from '@/components/Card/CollectionCard.tsx'
import { AwesomeScrollbar } from '@/components/AwesomeScrollbar.tsx'
import { ModalImpl } from '@/utils/modal.ts'
import { formatToN } from '@/misc/helper.ts'
import { IconTextButton, PrimaryButton, SecondaryButton } from '@/components/Button.tsx'
import { IconAdd, IconExport, IconImport } from '@/components/Icons.tsx'
import toast from 'react-hot-toast'
import { StickerDB } from '@/db/sticker.ts'
import { IOImpl } from '@/utils/io.ts'

type DashboardLoaderData = {
    collection: Promise<ICollection[]>
}

type DashboardActionConfig = {
    id: string
}

const CollectionList = ({ collections }: { collections: ICollection[] }) => {
    const navigate = useNavigate()
    const submit = useSubmit()

    const handleDelete = async (collection: ICollection) => {
        const ok = await ModalImpl.confirm({ content: `Are you sure to delete collection "${formatToN(collection.name, 10)}"?` })
        if (!ok) return

        submit(
            { id: collection.id } satisfies DashboardActionConfig,
            { method: 'DELETE', encType: 'application/json' }
        )
    }

    return collections.map(collection => {
        return <CollectionCard
            key={collection.id}
            collection={collection}
            onClick={() => navigate(`/collection/${collection.id}/view`)}
            onModify={() => navigate(`/collection/${collection.id}/modify?from=dashboard`)}
            onDelete={() => handleDelete(collection)}/>
    })
}

/**
 * dashboard to manage all stickers
 */
const DashboardPage = () => {
    const loader = useLoaderData() as DashboardLoaderData
    const navigate = useNavigate()
    const { revalidate } = useRevalidator()

    const handleImport = async () => {
        const re = await ModalImpl.batchImport()
        if (!re) return

        const { skipExist, collections, stickers } = re

        const re_c = await CollectionDB.load(collections, skipExist)
        const re_s = await StickerDB.load(stickers, skipExist)

        await ModalImpl.importResult({ collection: re_c, sticker: re_s })

        await CollectionDB.recountAll()

        // 更新列表
        revalidate()
    }

    const handleExport = async () => {
        const result = await ModalImpl.batchExport()
        if (!result) return

        const { cids, format } = result
        if (!cids || cids.length === 0) {
            toast.error('No collection selected')
        } else {
            const collections = await CollectionDB.getByIds(cids)
            const stickers = await StickerDB.getByCids(cids)
            IOImpl.batchExport(format, collections, stickers)
        }
    }

    return (
        <AwesomeScrollbar className={'w-full h-full p-4 overflow-y-auto space-y-4 space-y-reverse'}>
            <DeferView
                source={loader.collection}
                builder={collections => {
                    if (collections.length === 0) {
                        return (
                            <div className={'w-full h-[calc(100%-56px)] flex flex-col items-center justify-center'}>
                                <div className={'scale-in w-[400px] p-5 bg-white rounded-[4px] shadow-card space-y-4'}>
                                    <p className={'h-6 text-primary text-[18px] leading-[24px] font-primary'}>
                                        No Collection Found!
                                    </p>

                                    <p className={'text-secondary text-[16px] leading-[24px] font-secondary'}>
                                        There is no collection found, you can create a new collection or import from
                                        file.
                                    </p>

                                    <div className={'w-full h-9 flex items-center justify-between space-x-2'}>
                                        <SecondaryButton
                                            className={'flex-1'} text={'Batch Import'}
                                            onClick={handleImport}/>
                                        <PrimaryButton
                                            className={'flex-1'} text={'Create Now'}
                                            onClick={() => navigate('/collection/create')}/>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return <CollectionList collections={collections}/>
                }}
                slotBefore={
                    <div className={'w-full h-6 flex items-center'}>
                        <IconTextButton
                            className={'mr-3 text-secondary font-secondary'}
                            Icon={IconAdd} text={'New Collection'}
                            onClick={() => navigate('/collection/create')}/>

                        <IconTextButton
                            className={'mr-3 text-secondary font-secondary'}
                            Icon={IconImport} text={'Import'}
                            onClick={handleImport}/>

                        <IconTextButton
                            className={'text-secondary font-secondary'}
                            Icon={IconExport} text={'Export'}
                            onClick={handleExport}/>
                    </div>
                }/>
        </AwesomeScrollbar>
    )
}

DashboardPage.loader = async () => {
    return { collection: CollectionDB.getAll() } satisfies DashboardLoaderData
}

DashboardPage.action = async ({ request }: ActionFunctionArgs) => {
    // currently only support DELETE, that is, remove collection by id
    if (request.method !== 'DELETE') return null

    const config: DashboardActionConfig = await request.json()
    await CollectionDB.remove(config.id)

    return null
}

export default DashboardPage