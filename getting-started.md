# Beacon Buddy Mobile - Getting Started

This guide helps you run the React Native Android app locally on Fedora.

## Daily Start (After Initial Setup)

Use this every day to start both backend and mobile quickly.

From workspace root, open 3 terminals.

Terminal 1 (Rails API):

~~~bash
cd beacon_buddy_rails
bin/dev
~~~

Terminal 2 (Metro bundler):

~~~bash
cd BeaconBuddyMobile
npm start
~~~

Terminal 3 (Android app build/run):

~~~bash
cd BeaconBuddyMobile
npm run android
~~~

Before Terminal 3, make sure an emulator is available and running:

~~~bash
emulator -list-avds
emulator -avd BeaconBuddy_API_36
~~~

Quick checks:

- Backend health: `curl http://localhost:3000/up`
- Mobile API URL in `config/api.ts` should be `http://10.0.2.2:3000/api/v1` for emulator
- For physical device, use `http://YOUR_FEDORA_LAN_IP:3000/api/v1`

When these 3 terminals are active, you are ready to develop.

## 1. Prerequisites

Install required tools.

~~~bash
sudo dnf install -y git curl nodejs npm java-21-openjdk java-21-openjdk-devel watchman
~~~

Project requirements from package and Android config:

- Node 20 or newer
- React Native 0.83.1
- Android Gradle wrapper 9.0.0
- compileSdk 36, minSdk 24

## 2. Android Studio and SDK

Install Android Studio, then install these SDK components from SDK Manager:

- Android SDK Platform 36
- Android SDK Build-Tools 36.0.0
- Android SDK Platform-Tools
- Android Emulator
- Android SDK Command-line Tools (latest)
- NDK version 27.1.12297006

## 3. Shell Environment

Add this to ~/.zshrc and restart terminal.

~~~bash
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"
~~~

Verify tools:

~~~bash
adb --version
java -version
node -v
~~~

## 4. Install Dependencies

From project root:

~~~bash
npm install
~~~

## 5. API Endpoint Configuration

Update app API base URL in config/api.ts.

Recommended values:

- Android emulator with local Rails: http://10.0.2.2:3000/api/v1
- Physical Android device with local Rails: http://YOUR_FEDORA_LAN_IP:3000/api/v1

Current file may point to an old ngrok URL. Change it before local testing.

## 6. Start Metro and Android App

Use two terminals.

Terminal 1:

~~~bash
npm start
~~~

Terminal 2:

~~~bash
npm run android
~~~

## 7. Google Sign-In Setup Note

Google Sign-In client id is configured in context/AuthContext.tsx.

Make sure backend environment variable GOOGLE_WEB_CLIENT_ID matches the same web client id value.

## 8. Run Together with Backend

Backend terminal:

~~~bash
cd ../beacon_buddy_rails
bin/dev
~~~

Mobile terminal:

~~~bash
cd ../BeaconBuddyMobile
npm start
npm run android
~~~

## 9. Troubleshooting

- Gradle/JDK mismatch: use Java 21.
- Android SDK not found: recheck ANDROID_HOME and PATH values.
- Network request failed: verify API URL and ensure backend is running.
- Device cannot reach localhost: use LAN IP, not localhost.
- Clear React Native cache if needed:

~~~bash
npm start -- --reset-cache
~~~
