import * as React from 'react';

import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon, Skull, Smile } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'password' | 'text';
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'password', ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className='relative'>
        <input
          type={showPassword ? 'text' : type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />

        <div className='absolute -translate-y-1/2 cursor-pointer right-4 top-1/2 text-primary'>
          {showPassword ? (
            <EyeOffIcon className='size-5 animate-rotate' onClick={() => setShowPassword(false)} />
          ) : (
            <EyeIcon className='size-5 animate-rotate' onClick={() => setShowPassword(true)} />
          )}
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
