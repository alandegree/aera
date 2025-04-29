import cn from '@/utils/classnames'
type Props = {
  className?: string
  orgName?: string
  packageName: string
  packageNameClassName?: string
}

const OrgInfo = ({
  className,
  orgName,
  packageName,
  packageNameClassName,
}: Props) => {
  return (
    <div className={cn('flex items-center h-4 space-x-0.5', className)}>
      {orgName && (
        <>
          <span className='shrink-0 text-text-tertiary system-xs-regular'>
            {orgName === 'langgenius' ? 'aera'
              : orgName?.toLowerCase().includes('aera')
                ? orgName.replace(/aera/i, match =>
                  match === match.toUpperCase() ? 'AERA'
                    : match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase() ? 'Aera'
                      : 'aera')
                : orgName?.toLowerCase().includes('_aera')
                  ? orgName.replace(/_aera/i, '_aera')
                  : orgName?.toLowerCase().includes('aera_')
                    ? orgName.replace(/aera_/i, 'aera_')
                    : orgName}
          </span>
          <span className='shrink-0 text-text-quaternary system-xs-regular'>/</span>
        </>
      )}
      <span className={cn('shrink-0 w-0 grow truncate text-text-tertiary system-xs-regular', packageNameClassName)}>
        {packageName === 'langgenius' ? 'aera'
          : packageName?.toLowerCase().includes('aera')
            ? packageName.replace(/aera/i, match =>
              match === match.toUpperCase() ? 'AERA'
                : match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase() ? 'Aera'
                  : 'aera')
            : packageName?.toLowerCase().includes('_aera')
              ? packageName.replace(/_aera/i, '_aera')
              : packageName?.toLowerCase().includes('aera_')
                ? packageName.replace(/aera_/i, 'aera_')
                : packageName}
      </span>
    </div>
  )
}

export default OrgInfo
