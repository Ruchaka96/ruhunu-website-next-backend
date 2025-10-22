"use client"

import { createNewMenu, updateMenu } from "@/app/actions/menu.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Menu } from "@/types/menu";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type MenuFormProps = {
    menu: Menu | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onCreated: (created: Menu) => void;
    onUpdated: (updated: Menu) => void;
    order: number;
};

const MenuForm = ({
    menu,
    sessionRole,
    styleClasses,
    onCreated,
    onUpdated,
    order}: MenuFormProps) => {

    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Menu = useMemo(
        () => ({
            id: menu?.id ?? "",
            name: menu?.name ?? "",
            visibility: menu?.visibility ?? false,
            order: typeof menu?.order === 'number' ? menu.order : order,
        }),
        [menu]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        visibility: Yup.boolean().required("This field is mandatory"),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: Menu,
        { resetForm }: FormikHelpers<Menu>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Menu = {
                name: values.name,
                visibility: values.visibility,
                order: values.order
            }

            let resp: any;

            // ========== update record ==========
            if(values.id) {
                resp = await updateMenu(values.id, createPayload);
            }
            
            // ========== create new ==========
            else {
                resp = await createNewMenu(createPayload as Menu);
            }

            if (resp?.isError) {
                toast({
                    variant: 'destructive',
                    title: 'Save failed',
                    description: values.id
                        ? 'Update failed. Please check the form and try again.'
                        : 'Save failed. Please check the form and try again.'
                });
                setLoading(false);
                return;
            }
            
            const saved: Menu = resp?.data ?? resp;
            
            toast({
                variant: 'success',
                title: values.id ? 'Docter updated' : 'Docter created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
            
            // if save and close
            if (submitType === 'save-close') {
                router.push('/menu-manager');
                return;
            }

            if (!values.id) {
                onCreated(saved);
                return;
            } else {
                onUpdated(saved);

                // refresh local form with saved id
                resetForm({ values: { ...values, id: saved.id } });
            }

        } catch (error: any) {
            setLoading(false);
            console.error(error);
            toast({
                variant: "destructive",
                title: "Save failed",
                description: "Unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, helpers) =>
                handleSubmit(values, helpers, submitTypeRef.current)
            }
        >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
                <Card className="border shadow-sm">
                    {/* FORM START */}
                        <Form className="w-full">
                            <div className="grid gap-4 py-4">

                                {/* Name */}
                                <CustomFormField
                                    type="text"
                                    id="name"
                                    placeholder="Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.name}
                                    touched={touched.name}
                                />

                                {/* visibility */}
                                <CustomCheckedField
                                    id="visibility"
                                    placeholder="Is Publish?"
                                    required
                                    mode="boolean"
                                    value={values.visibility}
                                    onChange={(val) => setFieldValue("visibility", val)}
                                    onBlur={handleBlur}
                                    error={errors.visibility as string}
                                    touched={touched.visibility}
                                    styleClasses={styleClasses}
                                />

                                {/* Order */}
                                <CustomFormField
                                    type="number"
                                    id="order"
                                    placeholder="Order"
                                    value={values.order}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.order}
                                    touched={touched.order}
                                />

                                {/* Save Buttons */}
                                <FormActionsBtns
                                    onCancelHref="/menu-manager"
                                    showSaveAndClose
                                    loading={loading}
                                    disabled={!sessionRole}
                                    onBeforeSubmit={(t) => { submitTypeRef.current = t; }}
                                    onSubmitClick={() => submitForm()}
                                />
                                
                            </div>
                        </Form>
                </Card>
            )}
        </Formik>
    )
}

export default MenuForm;