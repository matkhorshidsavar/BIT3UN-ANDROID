import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ir.bit3un.app',
  appName: 'بیت‌سان',
  webDir: 'public',
  server: {
    url: 'https://bit3un.ir',
    cleartext: false,
    allowNavigation: [
      'bit3un.ir',
      '*.bit3un.ir',
      'bit3un.com',
      '*.bit3un.com',
      '*.shaparak.ir',
      '*.asanpardakht.ir',
      '*.sadadpsp.ir',
      '*.behpardakht.com',
      '*.zarinpal.com',
      '*.pep.co.ir',
      '*.sep.ir',
      '*.sepehrpay.com',
      '*.ikc.ir'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0c10',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0c10'
    }
  }
};

export default config;
