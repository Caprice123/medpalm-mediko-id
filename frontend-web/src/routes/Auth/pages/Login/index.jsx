import AuroraBackground from './components/AuroraBackground'
import ShowcasePanel from './components/ShowcasePanel'
import SignInCard from './components/SignInCard'
import { LoginContainer, Stage } from './Login.styles'
import { useLogin } from './hooks/useLogin'

export function Login() {
  useLogin()

  return (
    <LoginContainer>
      <AuroraBackground />

      <Stage>
        <ShowcasePanel />
        <SignInCard />
      </Stage>
    </LoginContainer>
  )
}

export default Login
