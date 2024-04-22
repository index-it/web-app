"use client";

import React, { useEffect, useState } from 'react';
import { Icon as RealIcon, IconProps } from '@iconify/react';
type SpinnerIconProps = Omit<IconProps, "icon">

export function Spinner(props: SpinnerIconProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <RealIcon icon="fluent:spinner-ios-16-filled" className={"animate-spin " + props.className} {...( ({className, ...rest}) => rest )(props)} />
  ) : (
    <span
      style={{
        width: props.width || 20,
        height: props.width || 20,
      }}
    >
      <RealIcon icon="fluent:spinner-ios-16-filled" className={"animate-spin " + props.className} {...( ({className, ...rest}) => rest )(props)} />
    </span>
  );
}