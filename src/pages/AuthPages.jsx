import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { assets } from '../data/assets'
import { useCommerce } from '../state/CommerceContext'
import { Button } from '../components/ui/Primitives'
import { Icon } from '../components/ui/Icon'

const countries = [
  { code: '+91', label: 'India' },
  { code: '+971', label: 'UAE' },
  { code: '+1', label: 'USA / Canada' },
  { code: '+44', label: 'United Kingdom' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { requestOtp, session, verifyOtp } = useCommerce()
  const [country, setCountry] = useState('+91')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('mobile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const phone = `${country}${mobile.replace(/\D/g, '')}`

  if (session?.profileComplete) return <Navigate replace to="/" />

  const getOtp = async () => {
    if (mobile.replace(/\D/g, '').length < 7) return setError('Enter a valid mobile number.')
    setLoading(true)
    setError('')
    try {
      await requestOtp(phone)
      setStep('otp')
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setLoading(false)
    }
  }
  const submitOtp = async () => {
    setLoading(true)
    setError('')
    try {
      await verifyOtp(phone, otp)
      const nextPath = searchParams.get('next')
      if (nextPath?.startsWith('/')) sessionStorage.setItem('jain-farms-auth-next', nextPath)
      navigate('/register')
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-hero">
        <img className="auth-logo" src={assets.logo} alt="Jain Farms" />
        <p className="eyebrow">From farms to your table</p>
        <h1>
          Produce selected through a <em>5-level</em> quality check.
        </h1>
        <p>Thoughtful sourcing, careful packing and dependable freshness for your home.</p>
        <img className="auth-produce" src={assets.banners.hero} alt="Fresh Jain Farms produce" />
      </div>
      <div className="auth-card">
        <div className="sheet-handle" />
        {step === 'mobile' ? (
          <>
            <p className="eyebrow">Welcome to Jain Farms</p>
            <h2>Login / Sign up</h2>
            <p>Enter your mobile number to continue.</p>
            <label className="field-label" htmlFor="mobile-number">
              Mobile number
            </label>
            <div className="phone-field">
              <select
                aria-label="Country code"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                {countries.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} · {item.label}
                  </option>
                ))}
              </select>
              <input
                id="mobile-number"
                inputMode="tel"
                maxLength="12"
                placeholder="10 digit mobile number"
                value={mobile}
                onChange={(event) => setMobile(event.target.value.replace(/\D/g, ''))}
              />
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <Button className="button--wide auth-submit" disabled={loading} onClick={getOtp}>
              {loading ? (
                'Sending…'
              ) : (
                <>
                  Get OTP <Icon name="arrow" />
                </>
              )}
            </Button>
            <small className="auth-terms">
              By continuing, you agree to our Terms & Conditions and Privacy Policy.
            </small>
          </>
        ) : (
          <>
            <button
              className="auth-back"
              type="button"
              onClick={() => {
                setStep('mobile')
                setOtp('')
                setError('')
              }}
            >
              ← Change number
            </button>
            <p className="eyebrow">Secure verification</p>
            <h2>Enter OTP</h2>
            <p>
              We sent a six-digit code to <strong>{phone}</strong>.
            </p>
            <label className="field-label" htmlFor="otp">
              Verification code
            </label>
            <input
              className="otp-field"
              id="otp"
              inputMode="numeric"
              maxLength="6"
              placeholder="• • • • • •"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
            />
            <p className="preview-note">
              Frontend preview code: <strong>123456</strong>
            </p>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <Button
              className="button--wide auth-submit"
              disabled={loading || otp.length !== 6}
              onClick={submitOtp}
            >
              {loading ? 'Verifying…' : 'Verify & continue'}
            </Button>
            <button className="text-action" type="button" onClick={() => setOtp('')}>
              Resend code
            </button>
          </>
        )}
      </div>
    </section>
  )
}

export function RegistrationPage() {
  const navigate = useNavigate()
  const { completeProfile, session } = useCommerce()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  if (!session) return <Navigate replace to="/login" />
  if (session.profileComplete) return <Navigate replace to="/" />
  return (
    <section className="form-page">
      <div className="form-card">
        <p className="eyebrow">Almost there</p>
        <h1>Tell us your name.</h1>
        <p>
          Your number <strong>{session.phone}</strong> is verified.
        </p>
        <label className="field-label" htmlFor="register-name">
          Name <span>Required</span>
        </label>
        <input
          id="register-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your full name"
        />
        <label className="field-label" htmlFor="register-email">
          Email <span>Optional</span>
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <Button
          className="button--wide"
          disabled={!name.trim()}
          onClick={() => {
            completeProfile({ name: name.trim(), email: email.trim() })
            const nextPath = sessionStorage.getItem('jain-farms-auth-next') || '/'
            sessionStorage.removeItem('jain-farms-auth-next')
            navigate(nextPath)
          }}
        >
          Continue to Jain Farms
        </Button>
      </div>
    </section>
  )
}
