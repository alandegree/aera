'use client'
import type { FC } from 'react'
import React from 'react'
import {
  useCSVDownloader,
} from 'react-papaparse'
import { useTranslation } from 'react-i18next'
import { Download02 as DownloadIcon } from '@/app/components/base/icons/src/vender/solid/general'

export type ICSVDownloadProps = {
  vars: { name: string }[]
}

const CSVDownload: FC<ICSVDownloadProps> = ({
  vars,
}) => {
  const { t } = useTranslation()
  const { CSVDownloader, Type } = useCSVDownloader()
  const addQueryContentVars = [...vars]
  const template = (() => {
    const res: Record<string, string> = {}
    addQueryContentVars.forEach((item) => {
      res[item.name] = ''
    })
    return res
  })()

  return (
    <div className='mt-6'>
      <div className='system-sm-medium text-text-primary'>{t('share.generation.csvStructureTitle')}</div>
      <div className='mt-2 max-h-[500px] overflow-auto'>
        <table className='table-fixed w-full border-separate border-spacing-0 border border-divider-regular rounded-lg text-xs'>
          <thead className='text-text-tertiary'>
            <tr>
              {addQueryContentVars.map((item, i) => (
                <td key={i} className='h-9 pl-3 pr-2 border-b border-divider-regular'>{item.name}</td>
              ))}
            </tr>
          </thead>
          <tbody className='text-text-secondary'>
            <tr>
              {addQueryContentVars.map((item, i) => (
                <td key={i} className='h-9 pl-4'>{item.name} {t('share.generation.field')}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <CSVDownloader
        className="block mt-2 cursor-pointer"
        type={Type.Link}
        filename={'template'}
        bom={true}
        config={{
          // delimiter: ';',
        }}
        data={[
          template,
        ]}
      >
        <div className='flex items-center h-[18px] space-x-1 text-text-accent system-xs-medium'>
          <DownloadIcon className='w-3 h-3' />
          <span>{t('share.generation.downloadTemplate')}</span>
        </div>
      </CSVDownloader>
    </div>

  )
}
export default React.memo(CSVDownload)
