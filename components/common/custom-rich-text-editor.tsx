"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "formik";
import "quill/dist/quill.snow.css";

type StyleClasses = {
    parentDiv?: string;
    labelClassName?: string;
    inputClassName?: string;
};

interface Props {
    id: string;
    placeholder?: string;
    value: string;
    onChange: (e: { target: { id: string; name: string; value: string } }) => void;
    onBlur: (e: { target: { id: string; name: string } }) => void;
    required?: boolean;
    disabled?: boolean;
    styleClasses?: StyleClasses;
    error?: string;
    touched?: boolean;
    height?: number;
}

export default function CustomRichTextEditor({
    id,
    placeholder = "",
    value = "",
    onChange,
    onBlur,
    required = false,
    disabled = false,
    styleClasses,
    error,
    touched,
    height = 240,
}: Props) {
    const wrapperRef = useRef<HTMLDivElement | null>(null); // holds toolbar + editor
    const quillRef = useRef<any>(null); // Quill instance

    // keep latest callbacks (avoid re-init loops)
    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);
    useEffect(() => {
        onBlurRef.current = onBlur;
    }, [onBlur]);

    // allowed formats
    const formats = useMemo(
        () => [
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list", // ordered/bullet
            "script", // sub/super
            "align",
            "blockquote",
            "code-block",
            "link",
            "image",
            "color",
            "background",
            "indent",
        ],
        []
    );

    // build toolbar DOM (pass the element to Quill; prevents duplicate toolbars)
    const buildToolbar = () => {
        const el = document.createElement("div");
        el.className = "ql-toolbar ql-snow";
        el.innerHTML = `
      <span class="ql-formats">
        <select class="ql-header">
          <option selected></option>
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
        <select class="ql-align"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-image"></button>
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
        <button class="ql-clean"></button>
      </span>
    `;
        return el;
    };

    // INIT ONCE (no onChange/onBlur in deps)
    useEffect(() => {
        let mounted = true;

        (async () => {
            const Quill = (await import("quill")).default;
            if (!wrapperRef.current || !mounted) return;

            // reset wrapper (hot reload)
            wrapperRef.current.innerHTML = "";

            // create toolbar + editor nodes
            const toolbar = buildToolbar();
            const editor = document.createElement("div"); // Quill will create .ql-container/.ql-editor around this

            // mount nodes
            wrapperRef.current.appendChild(toolbar);
            wrapperRef.current.appendChild(editor);

            // instantiate Quill
            const quill = new Quill(editor, {
                theme: "snow",
                readOnly: !!disabled,
                formats,
                modules: {
                    toolbar, // pass the DOM element
                    history: { delay: 800, maxStack: 200, userOnly: true },
                    clipboard: true,
                },
            });

            // fixed height + internal scroll
            const containerEl = quill.container as HTMLElement; // .ql-container
            containerEl.style.height = `${height}px`; // fixed viewport

            // fill container & scroll inside
            quill.root.style.height = "100%";
            quill.root.style.overflowY = "auto";

            // set initial content
            if (value) quill.clipboard.dangerouslyPasteHTML(value);

            // emit HTML string on change
            quill.on("text-change", () => {
                const html = quill.root.innerHTML || "";
                onChangeRef.current({ target: { id, name: id, value: html } });
            });

            // mark touched on blur
            quill.root.addEventListener("blur", () => {
                onBlurRef.current({ target: { id, name: id } });
            });

            quillRef.current = quill;
        })();

        return () => {
            mounted = false;
            quillRef.current = null;
            if (wrapperRef.current) wrapperRef.current.innerHTML = "";
        };
    }, [formats, height, id]);

    // ync external value (edit mode) without re-init
    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;

        const current = quill.root.innerHTML ?? "";
        if (value !== current) {
            const sel = quill.getSelection();
            quill.clipboard.dangerouslyPasteHTML(value || "");
            if (sel) quill.setSelection(sel.index, sel.length, "silent");
        }
    }, [value]);

    // toggle disabled without re-init
    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;
        quill.enable(!disabled);
    }, [disabled]);

    // UI state
    const borderClass = error && touched ? "border-red-600" : "border-gray-300";
    const disabledMask = disabled ? "pointer-events-none opacity-70" : "";

    return (
        <div className={styleClasses?.parentDiv}>
            <Label htmlFor={id} className={styleClasses?.labelClassName || ""}>
                {placeholder}
                {required && <span className="text-red-600"> *</span>}
            </Label>

            <div className={`${styleClasses?.inputClassName} w-99`}>
                <div className={`rounded border ${borderClass} ${disabledMask}`}>
                    {/* Quill mounts toolbar & editor here */}
                    <div ref={wrapperRef} />
                </div>

                <ErrorMessage
                    name={id}
                    component="div"
                    className="invalid-feedback text-red-600 text-sm whitespace-pre-wrap pt-1 sm:pt-0 mt-2"
                />
            </div>
        </div>
    );
}
