
import { Layout } from '../components/Layout'
import { ToastContainer, Flip } from 'react-toastify';
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        transition={Flip}
        limit={3}
      />
    </>
  )
}

export default MyApp
