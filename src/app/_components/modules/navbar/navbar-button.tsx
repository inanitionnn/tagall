import Link from 'next/link';
import { Button, Paragraph } from '../../ui';
import { cn } from '~/lib';
import { type ComponentPropsWithoutRef } from 'react';

type NavbarButtonProps = ComponentPropsWithoutRef<'button'> & {
  title: string;
  icon: React.ReactNode;
  pathname: string;
  isActive: boolean;
  isLink?: boolean;
};

const NavbarButtonWithoutLink = (
  props: Omit<NavbarButtonProps, 'pathname' | 'isLink'>,
) => {
  const { icon, title, isActive, className, ...restProps } = props;
  return (
    <Button
      size={'navbar'}
      variant={isActive ? 'default' : 'ghost'}
      className={cn('w-full justify-start gap-4', className)}
      {...restProps}
    >
      {icon}
      <Paragraph
        vsize={'base'}
        className={cn(
          'truncate text-wrap text-start font-medium leading-tight',
          {
            'font-semibold': isActive,
          },
        )}
      >
        {title}
      </Paragraph>
    </Button>
  );
};

const NavbarButton = (props: NavbarButtonProps) => {
  const { pathname, isLink = true, ...restProps } = props;
  if (isLink) {
    return (
      <Link
        className="w-full"
        href={{
          pathname: pathname,
        }}
      >
        <NavbarButtonWithoutLink {...restProps} />
      </Link>
    );
  }
  return <NavbarButtonWithoutLink {...restProps} />;
};

export { NavbarButton };
