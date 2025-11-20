import { BrowserRouter as Router, Navigate, useRoutes, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from '@config/googleOAuth'
import appRoutes from './appRoutes'
import { useEffect } from 'react'
import { setupAxiosInterceptors } from './config/api'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store'
import Middleware from '@middleware/Middleware'
import { GlobalStyles } from './theme/GlobalStyles'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GlobalErrorHandler from '@components/GlobalErrorHandler'
import styled from 'styled-components'

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 500;
  }

  .Toastify__toast-icon svg {
    fill: white;
  }

  .Toastify__close-button {
    color: white;
    opacity: 0.8;
  }

  .Toastify__close-button:hover {
    opacity: 1;
  }

  .Toastify__progress-bar {
    background: white;
    height: 4px;
  }
`

const AxiosInterceptorSetup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        setupAxiosInterceptors(navigate, dispatch);
    }, [navigate, dispatch]);

    return null;
};

const AppRouter = () => useRoutes(appRoutes);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            <Router>
                <AxiosInterceptorSetup />
                <Middleware />
                <GlobalErrorHandler />
                <AppRouter />
                <GlobalStyles />
                <StyledToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar
                  newestOnTop
                  closeOnClick
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  transition={Slide}
                />
            </Router>
        </Provider>
    </GoogleOAuthProvider>
  )
}

export default App
