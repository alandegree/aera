import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
import { apiPrefix } from '@/config'

type WalletAuthProps = {
  disabled?: boolean
}

export default function WalletAuth({ disabled }: WalletAuthProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { publicKey, connected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)

  const handleWalletLogin = async () => {
    if (!publicKey) {
      Toast.notify({ type: 'error', message: t('login.connectWalletFirst') })
      return
    }

    try {
      setIsLoading(true)
      const walletAddress = publicKey.toString()

      const response = await fetch(`${apiPrefix}/wallet-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
        }),
      })

      const data = await response.json()

      if (data.result === 'success') {
        localStorage.setItem('console_token', data.data.access_token)
        localStorage.setItem('refresh_token', data.data.refresh_token)

        const inviteToken = searchParams.get('invite_token')
        if (inviteToken)
          router.replace(`/signin/invite-settings?${searchParams.toString()}`)
        else
          router.replace('/apps')
      }
      else {
        // Retry once if there's a duplicate key error
        if (data.result === 'fail' && data.message?.includes('duplicate key value violates unique constraint')) {
          const retryResponse = await fetch(`${apiPrefix}/wallet-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              wallet_address: walletAddress,
            }),
          });
          
          const retryData = await retryResponse.json();
          if (retryData.result === 'success') {
            localStorage.setItem('console_token', retryData.data.access_token)
            localStorage.setItem('refresh_token', retryData.data.refresh_token)
            
            const inviteToken = searchParams.get('invite_token')
            if (inviteToken)
              router.replace(`/signin/invite-settings?${searchParams.toString()}`)
            else
              router.replace('/apps')
            return;
          }
        }
        Toast.notify({ type: 'error', message: data.message || t('login.walletAuthFailed') })
      }
    }
    catch (error) {
      console.error(error)
      Toast.notify({ type: 'error', message: t('login.walletAuthError') })
    }
    finally {
      setIsLoading(false)
    }
  }

  // When the user connects their wallet, check if they have the required SPL token
  const SPL_TOKEN_ADDRESS = '99kBqp1dCstDZk16EdvZ9KijDSYeGakNVdkh3qHjpump' // Replace with your SPL token address
  const HOLDING_AMOUNT = 0
  const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=189a8726-37e1-41ba-9073-7bcd6237efb4'

  const checkWalletBalance = async (publicKey) => {
    try {
      const connection = new Connection(RPC_URL, 'confirmed')
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(SPL_TOKEN_ADDRESS),
      })
      const balance = tokenAccounts.value.reduce((acc, { account }) => acc + account.data.parsed.info.tokenAmount.uiAmount, 0)
      return balance >= HOLDING_AMOUNT
    }
    catch (error) {
      console.error('Error checking wallet balance:', error)
      return false
    }
  }
  const [hasRequiredBalance, setHasRequiredBalance] = useState(false)
  
  // Check balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      checkWalletBalance(publicKey).then(hasBalance => {
        setHasRequiredBalance(hasBalance)
      })
    }
  }, [connected, publicKey])
  
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full justify-center flex">
        <WalletMultiButton className="w-full py-2 px-4 bg-components-button-primary-default text-white rounded-lg hover:bg-components-button-primary-hover" />
      </div>
      {!connected && (
        <div className="text-center text-gray-500">
          {t('login.connectWalletFirst')}
        </div>
      )}
      {connected && publicKey && (
        <>
          {hasRequiredBalance ? (
            <Button
              disabled={disabled || isLoading}
              loading={isLoading}
              className="w-full"
              onClick={handleWalletLogin}
            >
              Sign in with Wallet
            </Button>
          ) : (
            <div className="text-center p-3 border border-yellow-300 bg-yellow-50 rounded-lg">
              <p className="mb-2">You need at least {HOLDING_AMOUNT} of our official token to access this platform</p>
              <Button 
                variant="primary"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 transition-colors duration-200 flex items-center justify-center gap-2"
                onClick={() => window.open(`https://dexscreener.com/solana/${SPL_TOKEN_ADDRESS}`, '_blank', 'noopener,noreferrer')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline-block">
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                  <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
                  Buy tokens
              </Button>
              <p className="mt-2 text-sm text-gray-500">Check the token price on DexScreener</p>
              <p className="text-sm text-gray-500">You can buy tokens on Raydium or Orca</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
