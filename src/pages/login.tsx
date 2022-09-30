import Link from "next/link"
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { GetServerSideProps, NextPage } from "next";
import { signIn, getSession } from "next-auth/react"
import { toast } from 'react-toastify';
import { useState } from "react";
import { useRouter } from 'next/router'

interface loginSchema {
    user: string,
    password: string,
}

const loginSchema = yup.object().shape({
    user: yup.string().required(),
    password: yup.string().required().min(6),
});

const login: NextPage = () => {
    const [LoadingButton, setLoadingButton] = useState<boolean>(false)
    const router = useRouter()
    const initialValues: loginSchema = {
        // user: '',
        // password: '',
        user: 'user',
        password: '123123',
    }

    const SubmitData = async (user: string, password: string): Promise<any> => {
        const loginRes = await signIn("credentials", {
            redirect: false,
            user, password
        })
        if (!loginRes?.ok) toast.error(loginRes?.error)
        if (loginRes?.ok) {
            toast.success("You are in!")
            router.push("/profile")
        }
    }

    const onSubmitForm = async (values: loginSchema, { setSubmitting, resetForm }: FormikHelpers<loginSchema>): Promise<void> => {
        setLoadingButton(true)
        const { user, password } = values

        setSubmitting(false);
        await SubmitData(user, password)
        resetForm();
        setLoadingButton(false)
    }

    return (
        <div className="hero">
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmitForm}
                        validationSchema={loginSchema}
                    >
                        {({ errors, touched }) => (
                            <Form >
                                <h2 className="card-title justify-center py-2">Login!</h2>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Username</span>
                                    </label>
                                    <Field name="user" type="text" placeholder="Username" className={`input input-bordered ${errors.user && touched.user ? "input-error border-2" : ""}`} />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <Field name="password" type="password" placeholder="Password" className={`input input-bordered ${errors.password && touched.password ? "input-error border-2" : ""}`} />
                                </div>
                                <div className="form-control mt-6">
                                    <button type="submit" className={`btn ${LoadingButton ? "loading" : ""}`}>Login</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <span className="text-center link pt-2">
                        <Link href="/signup">
                            I don't have an account!
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const sessionServer = await getSession(context)
    if (sessionServer) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}


export default login