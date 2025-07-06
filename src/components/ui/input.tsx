import * as React from 'react';
import { cn } from '@/utils/shadcn';
import type { LucideProps } from 'lucide-react';

type IconProps = LucideProps | (React.SVGProps<SVGSVGElement> & { children?: never });

type IconPropsWithBehavior<T extends IconProps> = T & { behavior: 'append' | 'prepend' };
type IconComponent<T extends IconProps = IconProps> = React.ComponentType<T>;

export type InputProps<T extends IconComponent = IconComponent> = React.InputHTMLAttributes<HTMLInputElement> & {
	icon?: T;
	iconProps?: T extends IconComponent<infer P> ? IconPropsWithBehavior<P> : never;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			icon,
			iconProps: { behavior: iconBehavior, className: iconClassName, ...iconProps } = {},
			...props
		},
		ref
	) => {
		const Icon = icon;
		return (
			<div
				className={cn(
					'border-input focus-within:ring-ring m-0 flex items-center justify-center rounded-md border bg-transparent p-0 px-3 py-0 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
			>
				{Icon && type !== 'file' && iconBehavior === 'prepend' && (
					<Icon className={cn('text-muted-foreground mr-3 h-4 w-4', iconClassName)} {...iconProps} />
				)}
				<input
					type={type}
					className={cn(
						'placeholder:text-muted-foreground flex h-9 w-full items-center justify-center bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
						type !== 'file' ? 'py-1' : 'py-1.5',
						className
					)}
					ref={ref}
					{...props}
				/>
				{Icon && type !== 'file' && iconBehavior === 'append' && (
					<Icon className={cn('text-muted-foreground ml-3 h-4 w-4', iconClassName)} {...iconProps} />
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';
export { Input };
