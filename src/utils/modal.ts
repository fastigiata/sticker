import { register, show } from '@ebay/nice-modal-react'
import type { ConfirmModalProps } from '@/modal/confirm.tsx'
import ConfirmModal from '@/modal/confirm.tsx'
import type { TransferModalProps } from '@/modal/transfer.tsx'
import TransferModal from '@/modal/transfer.tsx'
import type { BatchExportResult } from '@/modal/batch_export.tsx'
import { BatchExport } from '@/modal/batch_export.tsx'
import type { BatchImportResult } from '@/modal/batch_import.tsx'
import { BatchImport } from '@/modal/batch_import.tsx'
import type { ImportResultProps } from '@/modal/import_result.tsx'
import { ImportResult } from '@/modal/import_result.tsx'

abstract class ModalImpl {
    public static prepare() {
        register('confirm', ConfirmModal)
        register('transfer', TransferModal)
        register('batch_import', BatchImport)
        register('batch_export', BatchExport)
        register('import_result', ImportResult)
    }

    /**
     * 显示确认框
     *
     * @return {Promise<boolean>} - 用户的选择
     * - true: 确认
     * - false: 取消 或 关闭
     */
    public static confirm(props: ConfirmModalProps): Promise<boolean> {
        return show<boolean>('confirm', props)
    }

    /**
     * 显示collection选择框
     *
     * @return {Promise<string|null>} - 目标collectionId
     */
    public static transfer(props: TransferModalProps): Promise<string | null> {
        return show<string>('transfer', props)
    }

    /**
     * 显示批量导入 collection 选择框
     *
     * @return {Promise<BatchImportResult>} - 解析后的导入数据
     */
    public static batchImport(): Promise<BatchImportResult> {
        return show<BatchImportResult>('batch_import')
    }

    /**
     * 显示批量导出 collection 选择框
     *
     * @return {Promise<BatchExportResult>} - 选中的collectionId列表
     */
    public static batchExport(): Promise<BatchExportResult> {
        return show<BatchExportResult>('batch_export')
    }

    /**
     * 显示导入结果
     */
    public static importResult(props: ImportResultProps): Promise<void> {
        return show('import_result', props)
    }
}

export {
    ModalImpl
}