import type { ICollection } from '@/_types/collection.ts'
import { IconEdit } from '@/components/Icons.tsx'
import { IconDelete } from '@/components/Icons.tsx'
import { ActionButton } from '@/components/Button.tsx'
import dayjs from 'dayjs'
import { Placeholder } from '@/components/Placeholder.tsx'

type CollectionCardProps = {
    collection: ICollection,
    onClick?: VoidFunction
    onModify?: VoidFunction
    onDelete?: VoidFunction
}

const CollectionCard = ({ collection, onClick, onModify, onDelete }: CollectionCardProps) => {
    const { id, name, desc, count, ctime, mtime } = collection
    return (
        <div
            data-id={id}
            className={
                'slide-in-evenodd group relative w-full h-20 px-4 rounded-[4px] bg-white ' +
                'shadow-card hover:shadow-card_hover select-none ' +
                'flex flex-col items-start justify-center'
            }
            onClick={onClick}>
            <div className={
                'w-full pr-8 text-primary text-[18px] font-primary leading-[24px] line-clamp-1'
            }>
                {name}
            </div>
            <div className={
                'w-full text-secondary text-[14px] font-secondary leading-[18px] line-clamp-1'
            }>
                {desc || <Placeholder placeholder={'No Description'}/>}
            </div>
            <div className={'w-full text-tertiary text-[10px] font-tertiary font-JBMono leading-[16px]'}>
                <span>Created {dayjs(ctime).format('YYYY-MM-DD HH:mm')}</span>
                <span> • </span>
                <span>Modified {dayjs(mtime).format('YYYY-MM-DD HH:mm')}</span>
            </div>

            <div className={'collection-card-badge text-secondary text-[14px] font-secondary'}>
                {count ?? 0}
            </div>
            <div className={'absolute z-2 right-4 hidden group-hover:flex items-center space-x-2'}>
                <ActionButton className={'text-primary'} Icon={IconEdit} onClick={onModify}/>
                <ActionButton className={'text-red'} Icon={IconDelete} onClick={onDelete}/>
            </div>
        </div>
    )
}

export {
    CollectionCard
}