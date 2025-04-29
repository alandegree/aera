const Title = ({
  title,
}: {
  title: string
}) => {
  return (
    <div className='truncate text-text-secondary system-md-semibold'>
      {title.replace(/aera/gi, (match) => {
        if (match === 'AERA') return 'AERA'
        if (match === 'Aera') return 'Aera'
        if (match === 'aera') return 'aera'
        if (match === '-aera') return '-aera'
        return 'aera' // fallback
      })}
    </div>
  )
}

export default Title
