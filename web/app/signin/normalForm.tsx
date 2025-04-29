import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { RiContractLine, RiDoorLockLine, RiErrorWarningFill } from '@remixicon/react'
import Loading from '../components/base/loading'
import MailAndCodeAuth from './components/mail-and-code-auth'
import MailAndPasswordAuth from './components/mail-and-password-auth'
import SocialAuth from './components/social-auth'
import SSOAuth from './components/sso-auth'
import cn from '@/utils/classnames'
import { getSystemFeatures, invitationCheck } from '@/service/common'
import { LicenseStatus, defaultSystemFeatures } from '@/types/feature'
import Toast from '@/app/components/base/toast'
import { IS_CE_EDITION } from '@/config'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import WalletAuth from './components/wallet-auth'

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

const NormalForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const consoleToken = decodeURIComponent(searchParams.get('access_token') || '')
  const refreshToken = decodeURIComponent(searchParams.get('refresh_token') || '')
  const message = decodeURIComponent(searchParams.get('message') || '')
  const invite_token = decodeURIComponent(searchParams.get('invite_token') || '')
  const [isLoading, setIsLoading] = useState(true)
  const [systemFeatures, setSystemFeatures] = useState(defaultSystemFeatures)
  const [authType, updateAuthType] = useState<'code' | 'password'>('password')
  const [workspaceName, setWorkSpaceName] = useState('')
  const [allMethodsAreDisabled, setAllMethodsAreDisabled] = useState(false)
  const [showORLine, setShowORLine] = useState(false)

  // Solana Wallet Adapter configuration - Memoized
  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), [])
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [], // Empty dependency array ensures this is only created once
  )

  const isInviteLink = Boolean(invite_token && invite_token !== 'null')

  const init = useCallback(async () => {
    try {
      if (consoleToken && refreshToken) {
        localStorage.setItem('console_token', consoleToken)
        localStorage.setItem('refresh_token', refreshToken)
        router.replace('/apps')
        return
      }

      if (message) {
        Toast.notify({
          type: 'error',
          message,
        })
      }
      const features = await getSystemFeatures()
      const allFeatures = { ...defaultSystemFeatures, ...features }
      setSystemFeatures(allFeatures)
      setAllMethodsAreDisabled(!allFeatures.enable_social_oauth_login && !allFeatures.enable_email_code_login && !allFeatures.enable_email_password_login && !allFeatures.sso_enforced_for_signin)
      setShowORLine((allFeatures.enable_social_oauth_login || allFeatures.sso_enforced_for_signin) && (allFeatures.enable_email_code_login || allFeatures.enable_email_password_login))
      updateAuthType(allFeatures.enable_email_password_login ? 'password' : 'code')
      if (isInviteLink) {
        const checkRes = await invitationCheck({
          url: '/activate/check',
          params: {
            token: invite_token,
          },
        })
        setWorkSpaceName(checkRes?.data?.workspace_name || '')
      }
    }
    catch (error) {
      console.error(error)
      setAllMethodsAreDisabled(true)
      setSystemFeatures(defaultSystemFeatures)
    }
    finally { setIsLoading(false) }
  }, [consoleToken, refreshToken, message, router, invite_token, isInviteLink])
  useEffect(() => {
    init()
  }, [init])
  useEffect(() => {
    const checkRes = { data: { workspace_name: 'Test Workspace' } } // Mock data
    const allFeatures = systemFeatures // Use the state variable

    setAllMethodsAreDisabled(!allFeatures.enable_social_oauth_login && !allFeatures.enable_email_code_login && !allFeatures.enable_email_password_login && !allFeatures.sso_enforced_for_signin)
    setShowORLine((allFeatures.enable_social_oauth_login || allFeatures.sso_enforced_for_signin) && (allFeatures.enable_email_code_login || allFeatures.enable_email_password_login))
    if (checkRes?.data?.workspace_name)
      setWorkSpaceName(checkRes.data.workspace_name)
  }, [systemFeatures])
  if (isLoading || consoleToken) {
    return <div className={
      cn(
        'flex flex-col items-center w-full grow justify-center',
        'px-6',
        'md:px-[108px]',
      )
    }>
      <Loading type='area' />
    </div>
  }
  if (systemFeatures.license?.status === LicenseStatus.LOST) {
    return <div className='w-full mx-auto mt-8'>
      <div className='bg-white'>
        <div className="p-4 rounded-lg bg-gradient-to-r from-workflow-workflow-progress-bg-1 to-workflow-workflow-progress-bg-2">
          <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-components-card-bg shadow shadows-shadow-lg mb-2 relative'>
            <RiContractLine className='w-5 h-5' />
            <RiErrorWarningFill className='absolute w-4 h-4 text-text-warning-secondary -top-1 -right-1' />
          </div>
          <p className='system-sm-medium text-text-primary'>{t('login.licenseLost')}</p>
          <p className='system-xs-regular text-text-tertiary mt-1'>{t('login.licenseLostTip')}</p>
        </div>
      </div>
    </div>
  }
  if (systemFeatures.license?.status === LicenseStatus.EXPIRED) {
    return <div className='w-full mx-auto mt-8'>
      <div className='bg-white'>
        <div className="p-4 rounded-lg bg-gradient-to-r from-workflow-workflow-progress-bg-1 to-workflow-workflow-progress-bg-2">
          <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-components-card-bg shadow shadows-shadow-lg mb-2 relative'>
            <RiContractLine className='w-5 h-5' />
            <RiErrorWarningFill className='absolute w-4 h-4 text-text-warning-secondary -top-1 -right-1' />
          </div>
          <p className='system-sm-medium text-text-primary'>{t('login.licenseExpired')}</p>
          <p className='system-xs-regular text-text-tertiary mt-1'>{t('login.licenseExpiredTip')}</p>
        </div>
      </div>
    </div>
  }
  if (systemFeatures.license?.status === LicenseStatus.INACTIVE) {
    return <div className='w-full mx-auto mt-8'>
      <div className='bg-white'>
        <div className="p-4 rounded-lg bg-gradient-to-r from-workflow-workflow-progress-bg-1 to-workflow-workflow-progress-bg-2">
          <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-components-card-bg shadow shadows-shadow-lg mb-2 relative'>
            <RiContractLine className='w-5 h-5' />
            <RiErrorWarningFill className='absolute w-4 h-4 text-text-warning-secondary -top-1 -right-1' />
          </div>
          <p className='system-sm-medium text-text-primary'>{t('login.licenseInactive')}</p>
          <p className='system-xs-regular text-text-tertiary mt-1'>{t('login.licenseInactiveTip')}</p>
        </div>
      </div>
    </div>
  }

  return (
    <>
      <div className="w-full mx-auto mt-8">
        {isInviteLink
          ? <div className="w-full mx-auto">
            <h2 className="title-4xl-semi-bold text-text-primary">{t('login.join')}{workspaceName}</h2>
            <p className='mt-2 body-md-regular text-text-tertiary'>{t('login.joinTipStart')}{workspaceName}{t('login.joinTipEnd')}</p>
          </div>
          : <div className="w-full mx-auto">
            <h2 className="title-4xl-semi-bold text-text-primary">{t('login.pageTitle')}</h2>
            <p className='mt-2 body-md-regular text-text-tertiary'>{t('login.welcome')}</p>
          </div>}
        <div className="bg-white">
          <div className="flex flex-col gap-3 mt-6 p-5 rounded-lg shadow-sm border border-gray-100">
            {/* Wallet login section */}
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <WalletAuth disabled={false} />
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>

            {systemFeatures.enable_social_oauth_login
              && <div className="mt-2 pt-2 border-t border-gray-100">
                <SocialAuth />
              </div>
            }
            {systemFeatures.sso_enforced_for_signin
              && <div className='w-full mt-2 pt-2 border-t border-gray-100'>
                <SSOAuth protocol={systemFeatures.sso_enforced_for_signin_protocol} />
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default NormalForm
