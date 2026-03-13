import { Card } from './Card'

type LoadingProps = {
  message?: string
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="w-full">
      <Card>
        <p>{message}</p>
      </Card>
    </div>
  )
}

