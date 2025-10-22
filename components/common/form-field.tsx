"use client"

import { ErrorMessage } from "formik"
import React, { ChangeEventHandler } from "react"
//ANCHOR -
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Eye, EyeOff } from "../icons"

interface CustomFormFieldProps {
  id: string
  type: string
  placeholder: string
  value: any
  onChange: ChangeEventHandler<any>
  onBlur: ChangeEventHandler<any>
  disabled?: boolean
  required: boolean
  styleClasses?: {
    parentDiv: string
    labelClassName: string
    inputClassName: string
  },
  error?: string
  touched?: boolean,
  maxInput?: number,
  minInput?: number
  step?: number | "any"
}

const CustomFormField = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  //   labelClassName,
  //   inputClassName,
  disabled = false,
  required,
  styleClasses,
  error,
  touched,
  maxInput,
  minInput,
  step
}: CustomFormFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className={styleClasses?.parentDiv}>
      <Label htmlFor={id} className={styleClasses?.labelClassName || ""}>
        {placeholder}
        {required && <span className="text-red-600"> *</span>}
      </Label>
      <div className={styleClasses?.inputClassName}>
        {type === "textarea" ? (
          <Textarea
            className={`p-2 border rounded outline-none 
                focus:outline-none focus:ring-0 focus-visible:outline-none
                focus-visible:!ring-0 focus-visible:!ring-offset-0 w-99
              ${styleClasses?.inputClassName || ""
              } ${error && touched ? "border-red-600" : "border-gray-300"}`}
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
          />

        ) : type === "password" ? (
          <div className="relative">
            <Input
              className={`p-2 border rounded outline-none ${styleClasses?.inputClassName || ""
                } ${error && touched ? "border-red-600" : "border-gray-300"}`}
              type={showPassword ? "text" : type} // Toggle password visibility
              id={id}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
            />
            <div
              className="absolute right-5 inset-y-0 flex items-center justify-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="text-black" />
              ) : (
                <Eye className="text-black" />
              )}
            </div>
          </div>
        ) : type === "telephone" ? (
          <Input
            className={`p-2 border rounded outline-none ${styleClasses?.inputClassName || ""
              } ${error && touched ? "border-red-600" : "border-gray-300"}`}
            type="tel"
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder || "Enter phone number"}
            disabled={disabled}
            inputMode="tel"
            pattern="^\+?[0-9]{7,15}$"
          />
        ) : (
          <Input
            className={`p-2 border rounded outline-none ${styleClasses?.inputClassName || ""
              } ${error && touched ? "border-red-600" : "border-gray-300"}`}
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            max={maxInput}
            min={minInput}
            step={step ?? "any"}
            accept={type === "file" ? ".apk" : undefined}
          />
        )}
        <ErrorMessage
          name={id}
          component="div"
          className="invalid-feedback text-red-600 text-sm whitespace-pre-wrap pt-1 sm:pt-0 mt-2"
        />
      </div>
    </div>
  )
}

export default CustomFormField
