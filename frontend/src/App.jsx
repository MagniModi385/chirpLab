import React from 'react'
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import toast, {Toaster} from 'react-hot-toast';
import useAuthUser from './hooks/useAuthUser.js';
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import  Layout  from "./components/Layout.jsx";
import { useThemeStore } from './store/useThemeStore.js';
const App = () => {
//tanstack query
const {isLoading,authUser}=useAuthUser();
const isAuthenticated=Boolean(authUser);
const isOnboarded=authUser?.isOnboarded;
const {theme}=useThemeStore();
  return (
    <div className='h-screen' data-theme={theme} >
      <Routes>
        <Route path="/" element={ isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout>
        ):(
          <Navigate to={!isAuthenticated ? "/login":"/onboarding"}/>
        )}
        />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage/>: <Navigate to="/"/>}></Route>
        <Route path="/login" element={!isAuthenticated ?<LoginPage />:<Navigate to="/"/>}></Route>
        <Route path="/notifications" element={isAuthenticated 
          && isOnboarded ?
          <Layout showSidebar={true}>
            <NotificationsPage />
          </Layout>
          :<Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
          }></Route>

        {/* <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        /> */}
        <Route path="/call/:id" element={<CallPage />} />

        <Route path="/chat/:id" element={isAuthenticated 
          && isOnboarded ?
          <Layout showSidebar={false}>
            <ChatPage/>
          </Layout>
          :<Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
          }></Route>

        <Route path="/onboarding" element={isAuthenticated ?(

          !isOnboarded ?(
            <OnboardingPage/>
          ):(
            <Navigate to="/"></Navigate>
          )
        ):(<Navigate to="/login"></Navigate>)}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
