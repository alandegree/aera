import type { FC } from 'react'
import React, { useMemo } from 'react'
import cn from '@/utils/classnames'

type Props = {
  className?: string
  text: string
  descriptionLineRows: number
}

const Description: FC<Props> = ({
  className,
  text,
  descriptionLineRows,
}) => {
  const lineClassName = useMemo(() => {
    if (descriptionLineRows === 1)
      return 'h-4 truncate'
    else if (descriptionLineRows === 2)
      return 'h-8 line-clamp-2'
    else
      return 'h-12 line-clamp-3'
  }, [descriptionLineRows])

  const processedText = useMemo(() => {
    return text.replace(/aera/gi, (match) => {
      // Match case: if AERA -> AERA, if Aera -> Aera, if aera -> aera
      if (match === match.toUpperCase()) return 'AERA'
      if (match === match.toLowerCase()) return 'aera'
      if (match.charAt(0) === match.charAt(0).toUpperCase()) return 'Aera'
      return 'aera'
    })
  }, [text])

  return (
    <div className={cn('text-text-tertiary system-xs-regular', lineClassName, className)}>
      {processedText}
    </div>
  )
}

export default Description
