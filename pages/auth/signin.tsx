import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/auth"
import { SignInForm } from "../../components/auth/signin-form"

export default function SignIn() {
  return <SignInForm />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
