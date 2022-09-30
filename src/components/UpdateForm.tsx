import Link from "next/link"
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { signOut } from "next-auth/react"
import { toast } from 'react-toastify';
import { Dispatch, FC, Ref, SetStateAction, useState } from "react";

interface UpdateSchema {
    name: string,
    newPassword: string,
}

interface IProps {
    name: string,
    id: string,
}

const updateYupSchema = yup.object().shape({
    name: yup.string().required().min(4),
    newPassword: yup.string().min(6),
});

export const UpdateForm: FC<IProps> = ({ id, name }) => {
    const initialValues: UpdateSchema = {
        name,
        newPassword: '',
    }

    const SubmitData = async ({ name, newPassword }: UpdateSchema): Promise<any> => {
        try {
            const res = await fetch('api/update', {
                method: "PATCH",
                body: JSON.stringify({ id, newName: name, newPassword }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            if (data.error) toast.error(data.message)
            if (!data.error) {
                signOut()
                toast.success(data.message)
            }
        } catch (error) {
            console.log({ error })
        }
    }

    const onSubmitForm = async (values: UpdateSchema, { setSubmitting, resetForm }: FormikHelpers<UpdateSchema>): Promise<void> => {
        setSubmitting(false);
        resetForm();
        await SubmitData(values)
    }

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmitForm}
                validationSchema={updateYupSchema}
            >
                {({ errors, touched }) => (
                    <Form id='updateForm'>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <Field name="name" type="text" placeholder="Name" className={`input input-bordered ${errors.name && touched.name ? "input-error border-2" : ""}`} />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <Field name="newPassword" type="password" placeholder="New Password" className={`input input-bordered ${errors.newPassword && touched.newPassword ? "input-error border-2" : ""}`} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}