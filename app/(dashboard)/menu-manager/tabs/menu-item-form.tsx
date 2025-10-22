"use client"

import { createNewMenuItem, getAllMenuItemsNameId, getNextMenuItemOrder, updateMenuItems } from "@/app/actions/menuitem.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { MenuItem } from "@/types/menu-items";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { title } from "process";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

type MenuItemFormProps = {
    menuItem: MenuItem | null;
    sessionRole: string | undefined;
    currentMenuId: string
};

const MenuItemForm = ({
    menuItem,
    sessionRole,
    currentMenuId,
}: MenuItemFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");
    const [options, setOptions] = useState<{ id: string; title: string }[]>([]);
    const [nextOrder, setNextOrder] = useState<number>(0)

    const styleClasses = React.useMemo(
        () => ({
            parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
            labelClassName: "text-sm text-black font-semibold capitalize",
            inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
        }),
        []
    );

    const NextOrder = async () => {
        try {
        const order = await getNextMenuItemOrder()
        
        setNextOrder(order) // now should return 4 if max order is 3
        } catch (error:any) {

        }
    }

    useEffect(() => {
        NextOrder();
    },[])

    console.log({nextOrder})


    useEffect(() => {
        (async () => {
            setLoading(true)
            const data = await getAllMenuItemsNameId(currentMenuId)
            setOptions(data) // ✅ no error now
            setLoading(false)
        })()
    }, [])

    const initialValues: MenuItem = useMemo(
        () => ({
            id: menuItem?.id ?? "",
            title: menuItem?.title ?? "",
            url: menuItem?.url ?? "",
            menuId: menuItem?.menuId ?? "",
            parentId: menuItem?.parentId ?? "",
            visible: menuItem?.visible ?? false,
            order: menuItem?.order ?? nextOrder,
        }),
        [menuItem, nextOrder, currentMenuId]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        title: Yup.string().required("This field is mandatory"),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: MenuItem,
        { resetForm }: FormikHelpers<MenuItem>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: MenuItem = {
                title: values.title,
                url: values.url,
                menuId: currentMenuId,
                order: values.order,
                parentId: values.parentId,
                visible: values.visible
            }

            let resp: any;

            // ========== update record ==========
            if(values.id) {
                console.log("click")
                resp = await updateMenuItems(values.id, createPayload);
            }
                        
            // ========== create new ==========
            else {
                console.log("click")
                resp = await createNewMenuItem(createPayload as MenuItem);
                console.log("click 2")
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
                        
            const saved: MenuItem = resp?.data ?? resp;
                        
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
                //onCreated(saved);
                return;
            } else {
                //onUpdated(saved);
            
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
        <><h1>{currentMenuId}</h1>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, helpers) => handleSubmit(values, helpers, submitTypeRef.current)}
        >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
                <Card className="border shadow-sm">
                    {/* FORM START */}
                    <Form className="w-full">
                        <div className="grid gap-4 py-4">

                            {/* Name */}
                            <CustomFormField
                                type="text"
                                id="title"
                                placeholder="Name"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.title}
                                touched={touched.title}
                            />

                            {/* Name */}
                            <CustomFormField
                                type="text"
                                id="url"
                                placeholder="Url"
                                value={values.url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.url}
                                touched={touched.url}
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

                            {/* title */}
                            <CustomSelectField
                                id="parent"
                                placeholder="Parent"
                                required={false}
                                value={values.parentId}
                                onChange={(v) => setFieldValue('parentId', v)}
                                onBlur={handleBlur}
                                options={options.map((o) => ({ label: o.title, value: o.id }))}
                                styleClasses={styleClasses}
                                error={errors.parentId}
                                touched={touched.parentId}
                            />

                            {/* visibility */}
                            <CustomCheckedField
                                id="visible"
                                placeholder="Is Publish?"
                                required
                                mode="boolean"
                                value={values.visible}
                                onChange={(val) => setFieldValue("visible", val)}
                                onBlur={handleBlur}
                                error={errors.visible as string}
                                touched={touched.visible}
                                styleClasses={styleClasses}
                            />

                            {/* Save Buttons */}
                            <FormActionsBtns
                                onCancelHref={"/menu-manager"}
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
        </Formik></>
    )
}

export default MenuItemForm;