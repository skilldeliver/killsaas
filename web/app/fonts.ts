import localFont from 'next/font/local';

export const louize = localFont({
  src: [
    {
      path: '../public/fonts/LouizeTrial-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/LouizeTrial-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/LouizeTrial-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/LouizeTrial-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/LouizeTrial-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/LouizeTrial-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-louize',
  display: 'swap',
});
