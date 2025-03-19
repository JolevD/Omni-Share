import { useState } from 'react'

import FileSharing from './Filesharing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <FileSharing/>
      </div>
    </>
  )
}

export default App
