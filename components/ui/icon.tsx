import React, { useEffect, useState } from 'react';
import { Icon as RealIcon, IconProps } from '@iconify/react';

export function Icon(props: IconProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <RealIcon {...props} />
  ) : (
    <span
      style={{
        width: props.width || 20,
        height: props.width || 20,
      }}
    >
      <RealIcon {...props} />
    </span>
  );
}