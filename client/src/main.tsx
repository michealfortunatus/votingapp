import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl='https://jade-imperial-hawk-534.mypinata.cloud/ipfs/bafybeigkixu527m6rtupe3yimytsedkhroqve4bucaru6rrvkzw3ptcle4/'>
    <StrictMode>
      <App />
    </StrictMode>
  </TonConnectUIProvider>,
)
