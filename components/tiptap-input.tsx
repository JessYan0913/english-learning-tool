"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { useEffect, useImperativeHandle, forwardRef, useRef } from "react"

interface TiptapInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  className?: string
  correctWords?: string[]
  incorrectWords?: string[]
  expectedAnswer?: string
  enableRealTimeValidation?: boolean
}

export interface TiptapInputRef {
  focus: () => void
  clear: () => void
  highlightWords: (correct: string[], incorrect: string[]) => void
}

const TiptapInput = forwardRef<TiptapInputRef, TiptapInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder = "输入英文句子...",
      className = "",
      correctWords = [],
      incorrectWords = [],
      expectedAnswer = "",
      enableRealTimeValidation = false,
    },
    ref,
  ) => {
    const isUpdatingRef = useRef(false)

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [StarterKit, TextStyle, Color.configure({ types: [TextStyle.name] })],
      content: value,
      onUpdate: ({ editor }) => {
        if (isUpdatingRef.current) return

        const text = editor.getText()
        onChange(text)

        if (enableRealTimeValidation && expectedAnswer && text.trim()) {
          performRealTimeValidation(editor, text, expectedAnswer)
        }
      },
      editorProps: {
        attributes: {
          class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${className}`,
        },
        handleKeyDown: (view, event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            onSubmit()
            return true
          }
          return false
        },
      },
    })

    const performRealTimeValidation = (editor: any, currentText: string, expectedAnswer: string) => {
      if (isUpdatingRef.current) return

      isUpdatingRef.current = true

      const userWords = currentText.toLowerCase().split(/\s+/)
      const expectedWords = expectedAnswer.toLowerCase().split(/\s+/)

      // 清除所有颜色样式
      editor.commands.selectAll()
      editor.commands.unsetColor()

      // 逐个单词应用颜色
      let currentPos = 0
      userWords.forEach((word, index) => {
        const wordStart = currentText.toLowerCase().indexOf(word, currentPos)
        const wordEnd = wordStart + word.length

        if (wordStart !== -1) {
          // 选择当前单词
          editor.commands.setTextSelection({ from: wordStart + 1, to: wordEnd + 1 })

          if (index < expectedWords.length) {
            if (word === expectedWords[index]) {
              // 正确单词显示绿色
              editor.commands.setColor("#22c55e")
            } else if (expectedWords[index].startsWith(word)) {
              editor.commands.setColor("#f59e0b")
            } else {
              // 错误单词显示红色
              editor.commands.setColor("#ef4444")
            }
          } else {
            // 多余单词显示红色
            editor.commands.setColor("#ef4444")
          }

          currentPos = wordEnd
        }
      })

      // 恢复光标到末尾，让用户继续输入
      editor.commands.focus("end")

      isUpdatingRef.current = false
    }

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          editor?.commands.focus()
        },
        clear: () => {
          editor?.commands.clearContent()
        },
        highlightWords: (correct: string[], incorrect: string[]) => {
          if (!editor) return

          isUpdatingRef.current = true

          const content = editor.getText()
          const words = content.split(/\s+/)

          editor.commands.selectAll()
          editor.commands.unsetColor()

          let currentPos = 0
          words.forEach((word) => {
            const cleanWord = word.toLowerCase().replace(/[.,!?;:]$/, "")
            const wordStart = content.toLowerCase().indexOf(word.toLowerCase(), currentPos)
            const wordEnd = wordStart + word.length

            if (wordStart !== -1) {
              editor.commands.setTextSelection({ from: wordStart + 1, to: wordEnd + 1 })

              if (correct.includes(cleanWord)) {
                editor.commands.setColor("#22c55e")
              } else if (incorrect.includes(cleanWord)) {
                editor.commands.setColor("#ef4444")
              }

              currentPos = wordEnd
            }
          })

          isUpdatingRef.current = false
        },
      }),
      [editor],
    )

    useEffect(() => {
      if (editor && editor.getText() !== value && !isUpdatingRef.current) {
        editor.commands.setContent(value)
      }
    }, [value, editor])

    if (!editor) {
      return null
    }

    return (
      <div className="relative">
        <EditorContent
          editor={editor}
          className={`w-full text-4xl font-mono p-8 border-2 rounded-2xl focus-within:outline-none transition-all bg-white text-gray-800 text-center shadow-sm focus-within:shadow-md border-gray-200 focus-within:border-blue-500 min-h-[80px] ${className}`}
        />
        {!editor.getText().trim() && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-4xl font-mono">{placeholder}</span>
          </div>
        )}
      </div>
    )
  },
)

TiptapInput.displayName = "TiptapInput"

export default TiptapInput
