"use client"

import React from "react"
import { ErrorMessage } from "formik"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type Option = { id: string; name: string }
type OptionsLayout = "stack" | "two" | "three" | "four"

type Mode = "boolean" | "yesno" | "single" | "multiple"

interface CustomCheckedFieldProps {
  id: string
  placeholder: string
  /** For:
   *  - boolean / yesno: boolean
   *  - single: string
   *  - multiple: string[]
   */
  value: boolean | string | string[]
  onChange: (value: boolean | string | string[]) => void
  onBlur?: React.FocusEventHandler<any>
  disabled?: boolean
  required: boolean
  mode?: Mode // Mode of the component
  options?: Option[] // Used for single/multiple modes
  styleClasses?: {
    parentDiv?: string
    labelClassName?: string
    inputClassName?: string
  }
  error?: string
  touched?: boolean
  optionsLayout?: OptionsLayout
  inlineBooleanLabel?: boolean
}

const CustomCheckedField = ({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required,
  mode = "boolean",
  options = [],
  styleClasses,
  error,
  touched,
  optionsLayout,
  inlineBooleanLabel = false,
}: CustomCheckedFieldProps) => {

  // Helpers for value reads/writes per mode
  const isErrored = !!error && !!touched
  const errorBorder =
    "ring-1 ring-red-600/60 rounded-md px-3 py-2" // wrapper border mimic
  const normalBorder =
    "ring-0 ring-gray-300"

  const wrapperClass =
    (styleClasses?.inputClassName ? styleClasses.inputClassName + " " : "") +
    (isErrored ? errorBorder : normalBorder)

    // map to Tailwind classes
  const listClass =
    optionsLayout === "two"
      ? "grid grid-cols-1 sm:grid-cols-2 gap-2"
      : optionsLayout === "three"
        ? "grid grid-cols-1 sm:grid-cols-3 gap-2"
        : optionsLayout === "four"
          ? "grid grid-cols-1 sm:grid-cols-4 gap-2"
          : "flex flex-col gap-2"

  const renderBoolean = () => {
    const boolVal = Boolean(value)
    const checkboxId = `${id}-bool`
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={checkboxId}
          checked={boolVal}
          disabled={disabled}
          onCheckedChange={(checked) => onChange(Boolean(checked))}
          onBlur={onBlur as any}
        />
        <label
          htmlFor={checkboxId}
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${inlineBooleanLabel ? "" : "sr-only"}`}
        >
          {placeholder}
        </label>
      </div>
    )
  }

  const renderYesNo = () => {
    const boolVal = Boolean(value)
    const yesId = `${id}-yes`
    const noId = `${id}-no`

    return (
      <div className={listClass}>
        <div className="flex items-center gap-2">
          <Checkbox
            id={yesId}
            checked={boolVal === true}
            disabled={disabled}
            onCheckedChange={() => onChange(true)}
            onBlur={onBlur as any}
          />
          <label htmlFor={yesId} className="text-sm font-medium leading-none">
            Yes
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={noId}
            checked={boolVal === false}
            disabled={disabled}
            onCheckedChange={() => onChange(false)}
            onBlur={onBlur as any}
          />
          <label htmlFor={noId} className="text-sm font-medium leading-none">
            No
          </label>
        </div>
      </div>
    )
  }

  const renderSingle = () => {
    const cur = String(value ?? "")
    return (
      <div className={listClass}>
        {options.map((opt) => {
          const optId = `${id}-${opt.id}`
          return (
            <div key={opt.id} className="flex items-center gap-2">
              <Checkbox
                id={optId}
                checked={cur === opt.id}
                disabled={disabled}
                // behave like "radio" using checkboxes
                onCheckedChange={() => onChange(opt.id)}
                onBlur={onBlur as any}
              />
              <label htmlFor={optId} className="text-sm font-medium leading-none">
                {opt.name}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMultiple = () => {
    const arr = Array.isArray(value) ? value : []
    return (
      <div className={listClass}>
        {options.map((opt) => {
          const optId = `${id}-${opt.id}`
          const isChecked = arr.includes(opt.id)
          return (
            <div key={opt.id} className="flex items-center gap-2">
              <Checkbox
                id={optId}
                checked={isChecked}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...arr, opt.id])
                  } else {
                    onChange(arr.filter((x) => x !== opt.id))
                  }
                }}
                onBlur={onBlur as any}
              />
              <label htmlFor={optId} className="text-sm font-medium leading-none">
                {opt.name}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styleClasses?.parentDiv}>
      <Label
        htmlFor={id}
        className={`${styleClasses?.labelClassName || ""} ${inlineBooleanLabel && mode === "boolean" ? "sr-only" : ""}`}
      >
        {placeholder}
        {required && <span className="text-red-600"> *</span>}
      </Label>

      <div className={wrapperClass}>
        {mode === "boolean" && renderBoolean()}
        {mode === "yesno" && renderYesNo()}
        {mode === "single" && renderSingle()}
        {mode === "multiple" && renderMultiple()}
      </div>

      <ErrorMessage
        name={id}
        component="div"
        className="invalid-feedback text-red-600 text-sm whitespace-pre-wrap pt-1 sm:pt-0 mt-2"
      />
    </div>
  )
}

export default CustomCheckedField