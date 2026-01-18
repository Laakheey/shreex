// utils/encryption.ts (Fixed Frontend Version - Web Crypto API)

const ENCRYPTION_SECRET = import.meta.env.VITE_PRIVATE_KEY_ENCRYPTION_SECRET;

if (!ENCRYPTION_SECRET || ENCRYPTION_SECRET.length < 32) {
  throw new Error(
    "VITE_PRIVATE_KEY_ENCRYPTION_SECRET must be at least 32 characters long"
  );
}

const getKeyMaterial = async (): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyData = enc.encode(ENCRYPTION_SECRET.slice(0, 32));
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
};

const deriveKey = async (salt: Uint8Array): Promise<CryptoKey> => {
  const baseKey = await getKeyMaterial();
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const generateIV = (): Uint8Array => crypto.getRandomValues(new Uint8Array(12));

const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const hexToUint8Array = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const matches = hex.match(/.{1,2}/g);
  if (!matches) throw new Error("Invalid hex format");
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

export const encryptPrivateKey = async (text: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = generateIV();

  const key = await deriveKey(salt);

  const enc = new TextEncoder();
  const data = enc.encode(text);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    data
  );

  const encryptedArray = new Uint8Array(encryptedBuffer);
  const ciphertext = encryptedArray.slice(0, -16); // Exclude auth tag
  const authTag = encryptedArray.slice(-16);       // Last 16 bytes = auth tag

  return `${bufferToHex(salt.buffer)}:${bufferToHex(iv.buffer as ArrayBuffer)}:${bufferToHex(ciphertext.buffer)}:${bufferToHex(authTag.buffer)}`;
};


export const decryptPrivateKey = async (encryptedData: string): Promise<string> => {
  const parts = encryptedData.split(":");
  if (parts.length !== 4) {
    throw new Error("Invalid encrypted data format. Expected: salt:iv:ciphertext:authTag");
  }

  const [saltHex, ivHex, ciphertextHex, authTagHex] = parts;

  const salt = hexToUint8Array(saltHex);
  const iv = hexToUint8Array(ivHex);
  const ciphertext = hexToUint8Array(ciphertextHex);
  const authTag = hexToUint8Array(authTagHex);

  const key = await deriveKey(salt);

  const fullEncrypted = new Uint8Array(ciphertext.length + authTag.length);
  fullEncrypted.set(ciphertext, 0);
  fullEncrypted.set(authTag, ciphertext.length);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
      key,
      fullEncrypted.buffer
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    throw new Error("Decryption failed: invalid key, corrupted data, or wrong password");
  }
};