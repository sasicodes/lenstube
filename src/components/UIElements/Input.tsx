import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id?: string
  type?: string
  className?: string
  validationError?: string
  prefix?: string
}
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    type = 'text',
    validationError,
    className = '',
    id,
    prefix,
    ...props
  },
  ref
) {
  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div
            className={clsx('text-[11px] font-semibold uppercase opacity-70')}
          >
            {label}
          </div>
        </div>
      )}
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-4 text-sm bg-gray-100 border border-r-0 border-gray-200 opacity-80 rounded-l-xl dark:bg-gray-900 dark:border-gray-800">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={clsx(
            {
              'focus:ring-1 focus:ring-indigo-500': !validationError?.length,
              '!border-red-500': validationError?.length,
              'rounded-r-xl': prefix,
              'rounded-xl': !prefix
            },
            'bg-white text-sm px-2.5 py-2 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 w-full',
            className
          )}
          ref={ref}
          type={type}
          {...props}
        />
      </div>
      {validationError && (
        <div className="mx-1 mt-1 text-xs font-medium text-red-500">
          {validationError}
        </div>
      )}
    </label>
  )
})
