# Gerenciador de Senhas

An offline password manager for Android and iOS. Vaults are stored locally in SQLite, unlocked with the device's own biometrics, and never leave the phone — there is no server, no account and no sync.

Built with React Native and Expo Router.

---

## Features

| | |
|---|---|
| **Biometric unlock** | Fingerprint or face, via `expo-local-authentication` ([`hooks/useBiometricAuth.ts`](hooks/useBiometricAuth.ts)) |
| **Local vault** | Every credential in an on-device SQLite database ([`hooks/useSQLite.ts`](hooks/useSQLite.ts)) |
| **Password generator** | Configurable length and character classes ([`components/PasswordGenerator.tsx`](components/PasswordGenerator.tsx)) |
| **Categories** | Group credentials by category |
| **Backup and restore** | Export the vault to a file and import it back — `backup.tsx` / `restore.tsx` |
| **Clipboard** | Copy a password without revealing it on screen |
| **Themed UI** | Light and dark, following the system setting |

## Why offline

A password manager's threat model is dominated by the store, not the client. Keeping the vault on the device removes the server as a target entirely: there is no breach to be in, and no operator who could be compelled. The trade is real and deliberate — no multi-device sync, and losing the phone without a backup loses the vault, which is exactly why `backup.tsx` exists.

## Screens

```
app/
├─ login.tsx            biometric / master unlock
├─ register.tsx         first-run setup
├─ home.tsx             dashboard
├─ passwords.tsx        vault list
├─ createPassword.tsx   add or edit an entry
├─ generatePassword.tsx generator
├─ categories.tsx       category management
├─ backup.tsx           export
└─ restore.tsx          import
```

Routing is file-based through Expo Router; `contexts/AuthContext.tsx` holds the lock state and gates the routes behind it.

## Stack

React Native · Expo · TypeScript · Expo Router · `expo-sqlite` · `expo-local-authentication` · `expo-crypto` · `expo-clipboard` · `expo-document-picker` · React Navigation

## Running it

```bash
npm install
npx expo start
```

Then open it in Expo Go, an Android emulator, or an iOS simulator. Biometric unlock needs a physical device or an emulator with enrolled biometrics.

## Status

Personal project, 2024. A learning exercise in local-first mobile storage and platform biometric APIs — **not audited, and not intended to hold real credentials.**
