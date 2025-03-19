# Omni Share

Omni Share is a secure, cross-network file-sharing application that enables users to share files effortlessly using public URLs and QR codes. It leverages secure tunneling to expose a local server to the internet, allowing recipients to download files directly after confirmation.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Security Considerations](#security-considerations)

---

## Overview

Omni Share provides a simple and secure way to share files remotely. A sender selects a file to share; the backend creates a secure tunnel using ngrok, generates a public URL and QR code, and a recipient scans the QR code to confirm the transfer and download the file via streaming.

---

## Features

- **Secure File Sharing:** Uses ngrok to expose the local file server securely.
- **QR Code Integration:** Generates a QR code encoding the public URL for easy access.
- **Dynamic Confirmation:** Renders a confirmation page using EJS where the recipient confirms the file transfer.
- **Efficient File Streaming:** Streams files in chunks from the sender’s machine, reducing memory usage.
- **Nonce-Based CSP:** Implements a robust Content Security Policy using nonces for inline scripts.

---

## Technologies Used

- **Frontend:**

  - React
  - HTML, CSS, JavaScript

- **Backend:**

  - Node.js
  - Express
  - EJS (for server-side rendering)
  - ngrok (for secure tunneling)
  - Node.js streaming & built-in modules (fs, path, crypto)

- **Security:**
  - Helmet with nonce-based Content Security Policy (CSP)

---

## Project Structure

- omnishare ├── client # React frontend │ └── src │ ├── FileSharing.js # File sharing component │ └── App.js # Main React App ├── server # Express backend │ ├── server.js # Main server file with API endpoints │ ├── ngrok.yml # ngrok configuration file │ └── views │ └── confirm.ejs # EJS template for confirmation page └── README.md # Project documentation

## Setup Instructions

### Backend Setup

1. **Install Dependencies:**  
   Navigate to the `server` folder and run:
   ```bash
   npm install express cors ngrok qrcode helmet ejs
   ```
2. **Configure ngrok:**
   - Create or update ngrok.yml in the server folder with:
     version: "2"
   ```
   authtoken: "YOUR_NGROK_AUTHTOKEN" # Replace with your token (optional but recommended)
   ```
   region: "us"
   ```

   ```

## Security Considerations

- **Content Security Policy (CSP):**
  - Uses Helmet with a nonce-based CSP to permit only trusted inline scripts, mitigating XSS risks.
    **Tunnel Security:**
  - Ngrok is used to create a secure, temporary tunnel, with sessions timing out after 5 minutes if not confirmed.
    **Input Validation:**
  - The backend validates file paths and file existence before sharing to minimize security risks.

```

```
