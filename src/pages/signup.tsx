import Link from "next/link"
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { NextPage } from "next";
import { toast } from 'react-toastify';
import { useState } from "react";
import { useRouter } from 'next/router'

interface IFormValues {
    name: string,
    user: string,
    password: string,
    repassword: string,
}

const signupSchema = yup.object().shape({
    name: yup.string().required(),
    user: yup.string().required(),
    password: yup.string().required().min(6),
    repassword: yup.string().required().min(6).oneOf([yup.ref("password"), null]),
});

const signup: NextPage = () => {
    const router = useRouter()
    const [LoadingButton, setLoadingButton] = useState<boolean>(false)
    const initialValues: IFormValues = {
        // name: '',
        // user: '',
        // password: '',
        // repassword: '',
        name: 'asdasd',
        user: 'asdasd',
        password: 'asdasd',
        repassword: 'asdasd',
    }

    const SubmitData = async (name: string, user: string, password: string, repassword: string): Promise<void> => {
        const res = await fetch('api/auth/signup', {
            method: "POST",
            body: JSON.stringify({ name, user, password, repassword }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data.error) toast.error(data.message)
        if (!data.error) {
            router.push("/login")
            toast.success(data.message)
        }
    }

    const onSubmitForm = async (values: IFormValues, { setSubmitting, resetForm }: FormikHelpers<IFormValues>): Promise<void> => {
        setLoadingButton(true)
        const { name, user, password, repassword } = values
        setSubmitting(false);
        await SubmitData(name, user, password, repassword)
        resetForm();
        setLoadingButton(false)
    }

    return (
        <div className="hero my-14">
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmitForm}
                        validationSchema={signupSchema}
                    >
                        {({ errors, touched }) => (
                            <Form >
                                <h2 className="card-title justify-center py-2">Sign-up!</h2>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Name</span>
                                    </label>
                                    <Field name="name" type="text" placeholder="Name" className={`input input-bordered ${errors.name && touched.name ? "input-error border-2" : ""}`} />
                                </div>
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
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Repeat Password</span>
                                    </label>
                                    <Field name="repassword" type="password" placeholder="Confirm password" className={`input input-bordered ${errors.repassword && touched.repassword ? "input-error border-2" : ""}`} />
                                </div>
                                <div className="form-control mt-6">
                                    <button type="submit" className={`btn ${LoadingButton ? "loading" : ""}`}>Sign-up</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <span className="text-center link pt-2">
                        <Link href="/login">
                            I already have an account!
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default signup